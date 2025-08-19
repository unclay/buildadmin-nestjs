import { Injectable, Get, HttpStatus, Inject } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Prisma } from "@prisma/client";
// core
import { ApiException } from "../../../core/exceptions/api.exception";
import { CoreApiService } from "../../../core/services/api.service";
import { CoreAuthService } from "../../../core/services/auth.service";
import { PrismaService } from "../../../core/services/prisma.service";
import { AuthService } from "../../../modules/auth/auth.service";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { EditAdminDto } from "./dto/edit-admin.dto";
import { DelAdminDto } from "./dto/del-admin.dto";
import { RequestDto } from "src/core/dto/request.dto";

@Injectable()
export class AuthAdminService extends CoreApiService {
    protected dataLimit = 'allAuthAndOthers';
    protected dataLimitField = 'id';
    protected preExcludeFields: string | string[] = ['create_time', 'update_time', 'password', 'salt', 'login_failure', 'last_login_time', 'last_login_ip'];
    constructor(
        private prisma: PrismaService,
        private authService: AuthService,
        public coreAuthService: CoreAuthService,
        @Inject(REQUEST) public readonly req: RequestDto
    ) {
        super(req, coreAuthService);
    }
    async getList(page: number, limit: number) {
        const list = await this.prisma.baAdmin.findMany({
            skip: (page - 1) * limit,
            take: limit,
            select: {
                avatar: true,
                create_time: true,
                email: true,
                id: true,
                last_login_ip: true,
                last_login_time: true,
                mobile: true,
                motto: true,
                nickname: true,
                status: true,
                update_time: true,
                username: true,
                groups: {
                    select: {
                        group_id: true,
                        group: {
                            select: {
                                name: true,
                            }
                        }
                    }
                },
            }
        });
        const total = await this.prisma.baAdmin.count();
        return {
            // 同步buildadmin
            list: list.map(item => {
                (item as any).group_arr = item.groups.map(group => group.group_id);
                (item as any).group_name_arr = item.groups.map(group => group.group.name);
                delete item.groups;
                return item;
            }),
            remark: '',
            total,
        }
    }

    async createAdmin(data: CreateAdminDto) {
        const password = data.password; // 保存密码用于后续处理
        data = this.excludeFields(data) as CreateAdminDto; // 排除不需要的字段

        // 3. 检查分组权限
        if (data.group_arr) {
            await this.checkGroupAuth(data.group_arr);
        }

        // 4. 开始事务处理
        return this.prisma.$transaction(async (ctx) => {
            try {
                // 创建管理员
                const json = Object.assign({}, data, {
                    group_arr: undefined,
                });
                const admin = await ctx.baAdmin.create({
                    data: json
                });

                // 处理分组关联
                if (data.group_arr) {
                    await ctx.baAdminGroupAccess.createMany({
                        data: (data.group_arr.map(groupId => ({
                            uid: admin.id,
                            group_id: groupId
                        }))) as any
                    });
                }

                // 处理密码
                if (password) {
                    await this.coreAuthService.resetPassword(admin.id, password, ctx);
                }

                return {
                    msg: 'Added successfully',
                    data: admin,
                };
            } catch (error) {
                console.log(error.message);
                // 事务会自动回滚
                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    throw new ApiException(
                        'Database operation failed',
                        null,
                        HttpStatus.INTERNAL_SERVER_ERROR
                    );
                }
                throw new ApiException(
                    error.message,
                    null,
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        });
    }

    /**
     * 检查分组权限
     * @throws Throwable
     */
    async checkGroupAuth(groups) {
        const uid = (this.req as any).user?.id;
        if (this.authService.isSuperAdmin(uid)) {
            return;
        }
        const authGroups = await this.authService.getAllAuthGroups(uid, 'allAuthAndOthers');
        for (const group of groups) {
            if (!authGroups.includes(group)) {
                throw new ApiException('You have no permission to add an administrator to this group!')
            }
        }
    }

    /**
     * 获取某个管理员
     * @param id 
     * @returns 
     */
    async getItem(id: number) {
        let item = await this.prisma.baAdmin.findUnique({
            where: {
                id,
            },
            include: {
                groups: {
                    include: {
                        group: true
                    }
                },
            }
        });
        return this.transformAdminData(item);
    }

    async postEdit(body: EditAdminDto) {
        let record = await this.getItem(body.id);
        if (!record) {
            throw new ApiException('Record not found')
        }
        const dataLimitAdminIds = await this.getDataLimitAdminIds();
        if (dataLimitAdminIds?.length > 0 && !dataLimitAdminIds.includes(record[this.dataLimitField])) {
            throw new ApiException('You have no permission');
        }
        const loginAdminId = this.coreAuthService.getUser('id');
        if (loginAdminId === body.id && body.status === 'disable') {
            throw new ApiException('Please use another administrator account to disable the current account!');
        }
        if (body.password) {
            await this.coreAuthService.resetPassword(body.id, body.password);
        }

        const groupAccess = [];
        if (body.group_arr) {
            const checkGroups = [];
            for (const groupId of body.group_arr) {
                if (record.group_arr.includes(groupId)) {
                    checkGroups.push(groupId);
                }
                groupAccess.push({
                    uid: body.id,
                    group_id: groupId
                });
            }
            this.checkGroupAuth(checkGroups);
        }
        await this.prisma.baAdminGroupAccess.deleteMany({
            where: {
                uid: body.id,
            }
        });
        try {
            const newBody = this.excludeFields(body);
            await this.prisma.$transaction(async (ctx) => {
                // 更新管理员信息
                await ctx.baAdmin.update({
                    where: { id: body.id },
                    data: {
                        ...newBody,
                        id: undefined,
                        group_arr: undefined,
                        group_name_arr: undefined,
                    } as any
                });

                // 如果有分组信息，更新管理员分组
                if (groupAccess.length > 0) {
                    await ctx.baAdminGroupAccess.createMany({
                        data: groupAccess
                    });
                }
                return true;
            });
            return {
                msg: 'Update successful'
            };
        } catch(e) {
            console.error(e);
            // throw new ApiException(String(e));
            throw new ApiException('No rows updated');
        }
    }

    async del(body: DelAdminDto) {
        const loginAdminId = this.coreAuthService.getUser('id');
        const dataLimitAdminIds = await this.getDataLimitAdminIds();
        const whereAnd = [];
        if (dataLimitAdminIds.length) {
            whereAnd.push({
                [this.dataLimitField]: { in: dataLimitAdminIds }
            });
        }
        whereAnd.push({
            id: { in: body.ids }
        });
        const data = await this.prisma.baAdmin.findMany({
            where: {
                AND: whereAnd,
            }
        });
        let count = 0;
        await this.prisma.$transaction(async (ctx) => {
            for (const v of data) {
                if (v.id !== loginAdminId) {
                    await ctx.baAdminGroupAccess.deleteMany({
                        where: { uid: v.id }
                    });
                    await ctx.baAdmin.delete({
                        where: { id: v.id }
                    });
                    count += 1;
                }
            }
        });
        if (count === 0) {
            throw new ApiException('No rows were deleted');
        }
        return {
            msg: 'Deleted successfully'
        }
    }
}

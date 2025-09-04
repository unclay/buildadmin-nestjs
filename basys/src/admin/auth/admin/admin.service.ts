import { Injectable, Inject } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { ApiResponse } from "../../../shared/api";
// core
import { CoreApiService, RequestDto, PrismaService } from "../../../core";
// modules
import { AuthService } from "../../../modules";
// local
import { AuthAdminAddDto, AuthAdminDelDto, AuthAdminEditDto } from "./dto";
import { AdminCrudService } from "./admin.crud";

@Injectable()
export class AuthAdminService extends CoreApiService {
    protected dataLimit = 'allAuthAndOthers';
    protected dataLimitField = 'id';
    protected preExcludeFields: string | string[] = ['create_time', 'update_time', 'password', 'salt', 'login_failure', 'last_login_time', 'last_login_ip'];
    constructor(
        public prisma: PrismaService,
        public authService: AuthService,
        @Inject(REQUEST) public readonly req: RequestDto,
        public crudService: AdminCrudService,
    ) {
        super(req, prisma, crudService, authService);
    }

    async add(data: AuthAdminAddDto) {
        const password = data.password; // 保存密码用于后续处理
        data = this.excludeFields(data) as AuthAdminAddDto; // 排除不需要的字段

        // 3. 检查分组权限
        if (data.group_arr) {
            await this.checkGroupAuth(data.group_arr);
        }

        // 4. 开始事务处理
        let result = null;
        await this.prisma.$transaction(async (ctx) => {
            // 创建管理员
            const json = Object.assign({}, data, {
                group_arr: undefined,
                last_login_time: undefined,
            });
            const admin = await ctx.baAdmin.create({
                data: json
            });

            result = admin;

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
        });
        if (result) {
            return {
                msg: 'Added successfully',
                data: result,
            };
        }
        throw ApiResponse.error('No rows were added');
    }

    async del(body: AuthAdminDelDto) {
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
        const data = await this.model.findMany({
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
            throw ApiResponse.error('No rows were deleted');
        }
        return {
            msg: 'Deleted successfully'
        }
    }

    /**
     * 获取某个管理员
     * @param id 
     * @returns 
     */
    async getEdit(id: number) {
        let record = await this.model.findUnique({
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
        if (!record) {
            return;
        }
        return this.transformAdminData(record);
    }

    async postEdit(body: AuthAdminEditDto) {
        let record = await this.getEdit(body.id);
        if (!record) {
            throw ApiResponse.error('Record not found')
        }
        const dataLimitAdminIds = await this.getDataLimitAdminIds();
        if (dataLimitAdminIds?.length > 0 && !dataLimitAdminIds.includes(record[this.dataLimitField])) {
            throw ApiResponse.error('You have no permission');
        }
        const loginAdminId = this.coreAuthService.getUser('id');
        if (loginAdminId === body.id && body.status === 'disable') {
            throw ApiResponse.error('Please use another administrator account to disable the current account!');
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

        const newBody = this.excludeFields(body);
        let result = null;
        await this.prisma.$transaction(async (ctx) => {
            // 更新管理员信息
            result = await ctx.baAdmin.update({
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
        });
        if (result) return ApiResponse.success('Update successful');
        throw ApiResponse.error('No rows updated');
    }

    async getList(page: number, limit: number) {
        const list = await this.model.findMany({
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
        const total = await this.model.count();
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

    /**
     * 检查分组权限
     * @throws Throwable
     */
    async checkGroupAuth(groups) {
        const isSuperAdmin = await this.coreAuthService.isSuperAdmin(); 
        if (isSuperAdmin) {
            return;
        }
        const authGroups = await this.coreAuthService.getAllAuthGroups('allAuthAndOthers');
        for (const group of groups) {
            if (!authGroups.includes(group)) {
                throw ApiResponse.error('You have no permission to add an administrator to this group!')
            }
        }
    }
}

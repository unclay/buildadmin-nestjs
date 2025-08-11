import { Injectable, Get } from "@nestjs/common";
// core
import { PrismaService } from "../../../core/services/prisma.service";

@Injectable()
export class AuthAdminService {
    constructor(private prisma: PrismaService) {}
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
}

export interface PostBody {
    [key: string]: any
}
export class BaApi {
    protected preExcludeFields: string | string[];
    /**
     * 排除不需要的字段
     * @param data 
     * @returns 
     */
    protected excludeFields(data: PostBody): PostBody {
        if (typeof this.preExcludeFields === 'string') {
            this.preExcludeFields = this.preExcludeFields.split(',');
        }
        return Object.fromEntries(
            Object.entries(data).filter(([key]) => !this.preExcludeFields.includes(key)),
        );
    }

    /**
     * 管理员字段，格式化 group_arr
     * @param adminData 
     * @returns adminData(add group_arr/group_name_arr)
     */
    protected transformAdminData(adminData: any) {
        const groups = adminData.groups || [];
        const group_arr = groups.map(g => g.group.id);
        const group_name_arr = groups.map(g => g.group.name);

        return {
            ...adminData,
            group_arr,
            group_name_arr,
            password: '',
            groups: undefined,
        };
    }
}

export interface PostBody {
    [key: string]: any
}
export class BaBackend {

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
}

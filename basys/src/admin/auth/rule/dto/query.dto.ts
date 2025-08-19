import { Transform } from "class-transformer";
import { IsArray, IsOptional } from "class-validator";

export class RuleQueryDto {
    @IsOptional()
    @Transform(({ value }) => {
        return value === 'true';
    })
    select?: boolean;

    @IsOptional()
    quickSearch?: string;

    @IsOptional()
    initKey?: string;

    @IsOptional()
    @Transform(({ value }) => {
        return value === 'true';
    })
    isTree?: boolean;

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => {
        if (Array.isArray(value)) {
            return value.map((str) => parseInt(str, 10));
        }
        return value ? [parseInt(value, 10)] : [];
    })
    initValue?: number[];
}
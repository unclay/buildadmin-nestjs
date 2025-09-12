import { IsNumber } from 'class-validator';
// core
import { TransformToNumber } from '../../../../core/decorators/dto.decorator';
// local
import { AuthGroupAddDto } from './add-group.dto';

export class AuthGroupEditDto extends AuthGroupAddDto {
  @IsNumber({}, { message: 'id必须是数字' })
  @TransformToNumber()
  id: number;
}

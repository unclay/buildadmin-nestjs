import { Module } from '@nestjs/common';
import { IndexController } from './index.controller';
import { LoginController } from './login.controller';
import { AuthModule } from '../../modules';

@Module({
  imports: [AuthModule],
  controllers: [IndexController, LoginController],
})
export class IndexModule {}

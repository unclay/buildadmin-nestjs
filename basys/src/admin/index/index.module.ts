import { Module } from '@nestjs/common';
import { IndexController } from './index.controller';
import { LoginController } from './login.controller';

@Module({
  controllers: [IndexController, LoginController]
})
export class IndexModule {}

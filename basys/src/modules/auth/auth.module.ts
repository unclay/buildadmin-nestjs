import { Module } from '@nestjs/common';
// core
import { DatabaseModule } from '../../core';
// local
import { AuthService } from './';


// 外部权限判断模块
@Module({
  imports: [DatabaseModule],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule { }

import { Module } from '@nestjs/common';
import {
  I18nModule,
  AcceptLanguageResolver,
  QueryResolver,
  HeaderResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import * as fs from 'fs';
import { CoreI18nService } from './i18n.service';

// 动态确定 i18n 文件路径
function getI18nPath(): string {
  const cwd = process.cwd();
  const distPath = path.join(cwd, 'dist/i18n/');
  const srcPath = path.join(cwd, 'src/i18n/');
  
  // 优先使用 dist 路径（生产环境），如果不存在则使用 src 路径（开发环境）
  if (fs.existsSync(distPath)) {
    return distPath;
  }
  return srcPath;
}

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'zh-cn',
      loaderOptions: {
        path: getI18nPath(),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        new HeaderResolver(['think-lang']),
        AcceptLanguageResolver,
      ],
      typesOutputPath: path.join(process.cwd(), 'src/i18n/i18n.generated.ts'),
    }),
  ],
  providers: [CoreI18nService],
  exports: [I18nModule, CoreI18nService],
})
export class CoreI18nModule {}

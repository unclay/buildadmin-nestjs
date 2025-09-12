import { Module } from '@nestjs/common';
import {
  I18nModule,
  AcceptLanguageResolver,
  QueryResolver,
  HeaderResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import { CoreI18nService } from './i18n.service';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'zh-cn',
      loaderOptions: {
        path: path.join(process.cwd(), 'src/i18n/'),
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

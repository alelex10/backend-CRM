import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './company/company.module';
import { PrismaModule } from './prisma/prisma.module';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';

@Module({
  imports: [CompanyModule, { module: PrismaModule, global: true }],
  controllers: [AppController],
  providers: [AppService, {
    provide: 'APP_INTERCEPTOR',
    useClass: ResponseInterceptor
  }],
})
export class AppModule {}

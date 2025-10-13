import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './company/company.module';
import { PrismaModule } from './prisma/prisma.module';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // esta configuración es para que las variables de entorno se puedan usar en todo el proyecto
    ConfigModule.forRoot({ isGlobal: true }),
    CompanyModule,
    // es para usar la base de datos de prisma en todo el proyecto
    { module: PrismaModule, global: true },
  ],
  providers: [
    AppService,
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}

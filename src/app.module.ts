import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './company/company.module';
import { PrismaModule } from './prisma/prisma.module';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { ConfigModule } from '@nestjs/config';
import { ContactsModule } from './contacts/contacts.module';
import { NotesModule } from './notes/notes.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DealsModule } from './deals/deals.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CompanyModule,

    { module: PrismaModule, global: true },
    ContactsModule,
    NotesModule,
    UserModule,
    AuthModule,
    DealsModule,
    DashboardModule,
  ],
  providers: [
    AppService,
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}

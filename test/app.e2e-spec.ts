import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Module } from '@nestjs/common';
import request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { ResponseInterceptor } from '../src/common/interceptor/response.interceptor';
import { AppService } from '../src/app.service';
import { AppController } from '../src/app.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [ AppController ],
  providers: [
    AppService,
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ResponseInterceptor,
    },
  ],
})
class TestAppModule {}
describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('GET /', () => {
    it('should return "Hello World!"', async () => {
      const response = await request(app.getHttpServer()).get('/').expect(200);

      expect(response.body.data).toBe('Hello World!');
    });
  });
});

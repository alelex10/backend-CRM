import { INestApplication, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { CompanyModule } from '../src/company/company.module';
import { CreateCompanyDto } from '../src/company/dto/create-company.dto';
import { PrismaModule } from '../src/prisma/prisma.module';
import { PrismaService } from '../src/prisma/prisma.service';
import request from 'supertest';
import { ResponseInterceptor } from '../src/common/interceptor/response.interceptor';

// configurar mi propio modulo root de test, para evitar hacer over test(testear todo)
//solo coloco los midlerwares y los controladores que quiero testear
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CompanyModule,
    { module: PrismaModule, global: true },
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ResponseInterceptor,
    },
  ],
})
class TestAppModule {}

describe('CompanyController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let configService: ConfigService;
  //   mock para los guard
  const mockAuthGuard = {
    canActivate: (context) => {a
      // simule token and roles
      const request = context.switchToHttp().getRequest();
      request.user = { id: 1, role: ['USER', 'ADMIN'] }; //[ROLE.USER, ROLE.ADMIN]
      return true;
    },
  };

  const mockRoleGuard = {
    canActivate: (context) => true,
  };

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';

    //las guardas globales no se pueden sobreescribir, por eso creo el modulo root

    //los guardas locales se pueden sobreescribir con .overrideGuard()
    // EJEMPLO:
    //   const module = await Test.createTestingModule({
    //     imports: [TestAppModule],
    //   })
    //     .overrideGuard(AuthGuard('jwt'))
    //     .useValue(mockAuthGuard)
    //     .overrideGuard(RoleGuard)
    //     .useValue(mockRoleGuard)
    //     .compile();

    const module = await Test.createTestingModule({
      imports: [TestAppModule],
    })
      //   .overrideGuard(AuthGuard)
      //   .useValue(mockAuthGuard)
      //   .overrideGuard(RoleGuard)
      //   .useValue(mockRoleGuard)
      .compile();

    app = module.createNestApplication();

    prisma = module.get<PrismaService>(PrismaService);
    configService = module.get<ConfigService>(ConfigService);

    // Verificamos que estamos usando la base de datos de pruebas
    // selecciono el .env.test usando dotenv-cli con un script
    const dbUrl = configService.get<string>('DATABASE_URL');
    if (!dbUrl?.includes('test')) {
      throw new Error('Tests must be run against a test database');
    }

    // configuro las CORS y prefijos globales
    // app.enableCors();
    // app.setGlobalPrefix('api/v1');
    await app.init();
  });

  beforeEach(async () => {
    // Limpio la base de datos antes de cada prueba
    await prisma.$transaction([prisma.company.deleteMany()]);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('POST /company/create', () => {
    const createCompanyDto: CreateCompanyDto = {
      name: 'Coca Cola',
      industry: 'Soft Drinks',
      address: '123 Main St, Anytown, USA',
    };

    it('should create a company successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/company/create')
        .send(createCompanyDto)
        .expect(201);
        
      expect(response.body.data).toMatchObject({
        name: "Coca Cola",
        industry: createCompanyDto.industry,
        address: createCompanyDto.address,

      });
      // toBeGreaterThan(0): Verifica que el valor sea mayor que 0
      expect(response.body.data.id).toBeGreaterThan(0);
      expect(response.body.data.createdAt).toBeDefined();
      // expect(response.body.data.updatedAt).not.toBeDefined();
      expect(response.body.data.updatedAt).toBeDefined();

    });

  });
});

import { INestApplication, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { CompanyModule } from '../src/company/company.module';
import { CreateCompanyDto } from '../src/company/dto/create-company.dto';
import { PrismaModule } from '../src/prisma/prisma.module';
import { PrismaService } from '../src/prisma/prisma.service';
import request from 'supertest';
import { ResponseInterceptor } from '../src/common/interceptor/response.interceptor';
import {
  mockCompanys,
  mockCompanysAsStrings,
  mockReqCompanyUpdated,
} from '../src/company/mock/company-data.mock';
import { UpdateCompanyDto } from '../src/company/dto/update-company.dto';

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
    canActivate: (context) => {
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
    app.useGlobalPipes(
      new ValidationPipe({
        // whitelist: true, // Elimina propiedades no esperadas
        // forbidNonWhitelisted: true, // Lanza error si hay propiedades no esperadas
        transform: true, // ¡ESTA OPCIÓN ES CRUCIAL! Habilita la transformación de tipos.
        transformOptions: {
          enableImplicitConversion: true, // Permite la conversión implícita (útil si @Transform no es suficiente en algunos casos, pero @Transform es más explícito)
        },
      }),
    );
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
        name: 'Coca Cola',
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

  describe('GET /company', () => {
    beforeEach(async () => {
      await prisma.company.createMany({
        data: mockCompanys,
      });
    });

    it('should get all companies whit "values default" when page and limit are provided', async () => {
      const received = await request(app.getHttpServer())
        .get('/company')
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(received.body.data).toEqual({
        data: expect.arrayContaining(mockCompanysAsStrings),
        total: mockCompanys.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should get all companies whit "values default" when page and limit are not provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/company')
        .query({ page: 1 })
        .expect(200);

      expect(response.body.data).toEqual({
        data: expect.arrayContaining(mockCompanysAsStrings),
        total: mockCompanys.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should get all companies whit "values default" when page and limit are not provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/company')
        .query({ limit: 3 })
        .expect(200);

      expect(response.body.data).toEqual({
        data: expect.arrayContaining(mockCompanysAsStrings),
        total: mockCompanys.length,
        page: 1,
        limit: 3,
        totalPages: 1,
      });
    });

    it('should get all companies whit "values default" when page and limit are not provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/company')
        .expect(200);

      expect(response.body.data).toEqual({
        data: expect.arrayContaining(mockCompanysAsStrings),
        total: mockCompanys.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });

  describe('GET /company/:id', () => {
    beforeEach(async () => {
      await prisma.company.createMany({
        data: mockCompanys,
      });
    });

    it('should get a company successfully', async () => {
      const response = await request(app.getHttpServer())
        .get('/company/1')
        .expect(200);

      expect(response.body.data).toEqual(mockCompanysAsStrings[0]);
    });

    it('should get a company successfully', async () => {
      const response = await request(app.getHttpServer())
        .get('/company/2')
        .expect(200);

      expect(response.body.data).toEqual(mockCompanysAsStrings[1]);
    });
  });

  describe('PATCH /company/:id', () => {
    beforeEach(async () => {
      await prisma.company.createMany({
        data: mockCompanys,
      });
    });
    afterAll(async () => {
      await prisma.company.deleteMany();
    })

    it('should update a company successfully', async () => {
      const response = await request(app.getHttpServer())
        .patch('/company/1')
        .send(mockReqCompanyUpdated)
        .expect(200);

      expect(response.body.data).toMatchObject({
        ...mockCompanysAsStrings[0],
        ...mockReqCompanyUpdated,
        updatedAt: expect.any(String),
      });
    });

    it('should throw BadRequestException when company not found', async () => {
      const response = await request(app.getHttpServer())
        .patch('/company/999')
        .send(mockReqCompanyUpdated)
        .expect(400);

      expect(response.body).toEqual({
        message: 'Company not found With id: 999',
        error: 'Bad Request',
        statusCode: 400,
      });
    });
  });
});

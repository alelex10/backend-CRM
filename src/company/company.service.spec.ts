import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { mockCompany, mockCompanys } from './mock/company-data.mock';
import { BadRequestException } from '@nestjs/common';

describe('CompanyService', () => {
  let service: CompanyService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    company: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findFirst: jest.fn(),
    },
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    prismaService = module.get(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createCompanyDto: CreateCompanyDto = {
      name: 'Coca Cola',
      industry: 'Soft Drinks',
      address: '123 Main St, Anytown, USA',
    };
    it('should create a company successfully', async () => {
      /* jest
        .spyOn(prismaService.company, 'create')
        .mockResolvedValue(mockCompany); */

      mockPrismaService.company.create.mockResolvedValue(mockCompany);
      // mockeamos el findFirst para revisamos que no se repita el name de la empresa
      mockPrismaService.company.findFirst.mockResolvedValue(!mockCompany.name);

      const result = await service.create(createCompanyDto);
      expect(result).toEqual(mockCompany);
    });

    it('should throw BadRequestException with the correct message if company already exists', async () => {
      // 1. Simula el rechazo de la promesa con la excepción y el mensaje específico.
      const errorMessage = 'Company already exists';
      mockPrismaService.company.create.mockRejectedValue(
        new BadRequestException(errorMessage),
      );

      // Opcional: También puedes verificar el tipo de excepción y el mensaje a la vez.
      // .toThrow() puede recibir un objeto que represente la excepción esperada.
      await expect(service.create(createCompanyDto)).rejects.toThrow(
        new BadRequestException(errorMessage),
      );
    });
  });

  describe('findAll', () => {
    it('should return an paginated list of companies when page and limit are provided ', async () => {
      const companies = [mockCompanys];
      mockPrismaService.company.findMany.mockResolvedValue(companies);
      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.data).toEqual(companies);
    });

    it('should return an paginated list of companies when page and limit are not provided ', async () => {
      mockPrismaService.company.findMany.mockResolvedValue(mockCompanys);
      const result = await service.findAll({ page: 1 });
      expect(result.data).toEqual(mockCompanys);
    });

    it('should return an paginated list of companies when page and limit are not provided ', async () => {
      mockPrismaService.company.findMany.mockResolvedValue(mockCompanys);
      const result = await service.findAll({ limit: 10 });
      expect(result.data).toEqual(mockCompanys);
    });

    it('should return an paginated list of companies when page and limit are not provided ', async () => {
      mockPrismaService.company.findMany.mockResolvedValue(mockCompanys);
      const result = await service.findAll({});
      expect(result.data).toEqual(mockCompanys);
    });
  });
});

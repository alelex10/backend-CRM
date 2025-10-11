import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { mockCompany } from './mock/company-data.mock';
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
    prismaService = module.get<PrismaService>(PrismaService);

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
      mockPrismaService.company.create.mockResolvedValue(mockCompany);
      mockPrismaService.company.findFirst.mockResolvedValue(mockCompany.name);

      const result = await service.create(createCompanyDto);
      expect(result).toEqual(mockCompany);
    });

    it('should throw BadRequestException if company already exists', async () => {
      mockPrismaService.company.create.mockRejectedValue(
        new BadRequestException('Company already exists'),
      );

      // no compara el mensage de la excepción, le vasta con que la excepción se lanza
      await expect(service.create(createCompanyDto)).rejects.toThrow(
        'Company already exists',
      );

      // También puedes verificar el tipo de excepción
      await expect(service.create(createCompanyDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});

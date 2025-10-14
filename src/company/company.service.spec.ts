import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { mockCompany, mockCompanys } from './mock/company-data.mock';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from '../../generated/prisma';

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
      name: 'Coca Cola 123eweq 132',
      industry: 'Soft Drinks',
      address: '123 Main St, Anytown, USA',
    };
    it('should create a company successfully', async () => {
      /* jest
        .spyOn(prismaService.company, 'create')
        .mockResolvedValue(mockCompany); */

      mockPrismaService.company.create.mockResolvedValue(mockCompany);
      // mockeamos el findFirst para revisamos que no se repita el name de la empresa
      mockPrismaService.company.findFirst.mockResolvedValue(null);

      const result = await service.create(createCompanyDto);
      expect(result).toEqual(mockCompany);
    });

    it('should throw BadRequestException with the correct message if company already exists', async () => {
      // 1. Simula el rechazo de la promesa con la excepción y el mensaje específico.
      const errorMessage = 'Company already exists';
      // 1. Simula que findFirst encuentra una compañía (lo que significa que ya existe)
      mockPrismaService.company.findFirst.mockResolvedValue(mockCompany); // mockCompany representa una compañía existente

      // 2. Espera que la llamada a service.create lance el BadRequestException
      // No necesitamos mockear create ni que sea rejectada, porque la excepción se lanza ANTES.
      await expect(service.create(createCompanyDto)).rejects.toThrow(
        new BadRequestException(errorMessage),
      );

      // 3. Asegúrate de que prisma.company.create NUNCA fue llamado en este caso
      expect(mockPrismaService.company.create).not.toHaveBeenCalled();
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

  describe('findOne', () => {
    it('should return a company when id is valid', async () => {
      mockPrismaService.company.findUnique.mockResolvedValue(mockCompany);
      const result = await service.findOne(1);
      expect(result).toEqual(mockCompany);
    });

    it('should return "Company not found With id: ${id}" when id is invalid', async () => {
      const id = 1;
      const errorMessage = `Company not found With id: ${id}`;
      mockPrismaService.company.findUnique.mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(
        new BadRequestException(errorMessage),
      );
    });
  });

  describe('update', () => {
    let updateCompanyDto: UpdateCompanyDto;
    let mockCompanyUpdated: Company;
    beforeEach(() => {
      updateCompanyDto = {
        name: 'Village',
        industry: 'Bad Drinks',
        address: '323 Main St, Anytown, USA',
      };

      mockCompanyUpdated = {
        ...mockCompany,
        ...updateCompanyDto,
      };
    });
    it('should update a company successfully', async () => {
      const id = 1;
      mockPrismaService.company.update.mockResolvedValue(mockCompanyUpdated);
      const result = await service.update(id, updateCompanyDto);
      expect(result).toEqual(mockCompanyUpdated);
    });

    it('should return "Company not found With id: ${id}" when id is invalid', async () => {
      const id = 11324124;
      const errorMessage = `Company not found With id: ${id}`;

      // En lugar de mockResolvedValue(new Error()), usamos mockRejectedValue
      // para simular que la operación de Prisma falla.
      // No necesitamos envolverlo en un Error explícitamente,
      // Jest manejará el rechazo. Si quieres simular un error específico de Prisma,
      // podrías usar mockRejectedValue(new SomePrismaError(...)) si tuvieras esa clase.
      // Para este caso, simplemente rechazar es suficiente.
      mockPrismaService.company.update.mockRejectedValue(
        new Error('Company not found'),
      ); // O simplemente mockRejectedValue()

      await expect(service.update(id, updateCompanyDto)).rejects.toThrow(
        new BadRequestException(errorMessage),
      );
    });
  });

  describe('remove', () => {
    const id = 1;
    it('should remove a company successfully', async () => {
      mockPrismaService.company.delete.mockResolvedValue(mockCompany);
      const result = await service.remove(id);
      expect(result).toEqual(mockCompany);
    });

    it('should return "Company not found With id: ${id}" when id is invalid', async () => {
      const errorMessage = `Company not found With id: ${id}`;
      mockPrismaService.company.delete.mockRejectedValue(new Error());

      await expect(service.remove(id)).rejects.toThrow(
        new NotFoundException(errorMessage),
      );
    });
  });
});

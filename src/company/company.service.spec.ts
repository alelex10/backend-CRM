import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { mockCompany } from './mock/company-data.mock';

describe('CompanyService', () => {
  let service: CompanyService;
  let prismaService: jest.Mocked<PrismaService>;

  const mockPrismaService = () => ({
    company: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  });
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: PrismaService,
          useValue: mockPrismaService(),
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
    it('should create a company successfully', () => {
      
      mockPrismaService().company.create.mockResolvedValue(mockCompany);
      
      const result = service.create(createCompanyDto);
      expect(result).toEqual(mockCompany);
    });
  });
});

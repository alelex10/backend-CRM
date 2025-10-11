import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Company } from 'generated/prisma';
import { CreateCompanyDto } from './dto/create-company.dto';
import { mockCompany } from './mock/company-data.mock';

describe('CompanyController', () => {
  let controller: CompanyController;
  let service: CompanyService;

  const mockAuthGuard = {
    canActivate: (context) => {
      const request = context.switchToHttp().getRequest();
      request.user = { id: 1, role: 'user' }; //ROLE.USER
      return true;
    },
  };

  const mockRoleGuard = {
    canActivate: () => true,
  };

  const companyServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: CompanyService,
          useValue: companyServiceMock,
        },
      ],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createCompanyDto: CreateCompanyDto = {
      name: 'Coca Cola',
      industry: 'Soft Drinks',
      address: '123 Main St, Anytown, USA',
    };

    it('should create a new company', async () => {
      jest.spyOn(companyServiceMock, 'create').mockResolvedValue(mockCompany);

      const result = await controller.create(createCompanyDto);
      expect(result).toEqual(mockCompany);
    });

    it('should call CompanyService.create with the correct arguments', async () => {
      await controller.create(createCompanyDto);
      expect(companyServiceMock.create).toHaveBeenCalledWith(createCompanyDto);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { mockCompany, mockCompanys } from './mock/company-data.mock';
import { ResponsePaginatedDto } from '../common/abstract/response-paginated.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';

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
    findAll: jest.fn().mockResolvedValue(mockCompanys),
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

  describe('findAll', () => {
    it('should call CompanyService.findAll with the correct arguments', async () => {
      const query = { page: 1, limit: 10 };
      await controller.findAll(query);
      expect(companyServiceMock.findAll).toHaveBeenCalledWith(query);
    });

    it('should return an array of companies when page and limit are provided', async () => {
      companyServiceMock.findAll.mockResolvedValue(
        new ResponsePaginatedDto(mockCompanys, 1, 10),
      );
      const result = await controller.findAll({ page: 1, limit: 10 });
      expect(result.data).toEqual(mockCompanys);
    });
  });

  describe('findOne', () => {
    it('should call CompanyService.findOne with the correct arguments', async () => {
      // por que lo que llega en el request es un string siempre
      await controller.findOne('1');
      // al pasarlo a findOne se lo pasa como nuemro
      expect(companyServiceMock.findOne).toHaveBeenCalledWith(1);
    });

    it('should return a company when id is valid', async () => {
      companyServiceMock.findOne.mockResolvedValue(mockCompany);
      const result = await controller.findOne('1');
      expect(result).toEqual(mockCompany);
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

    it('should call CompanyService.update with the correct arguments', async () => {
      await controller.update('1', updateCompanyDto);
      expect(companyServiceMock.update).toHaveBeenCalledWith(
        1,
        updateCompanyDto,
      );
    });

    it('should return a company when id is valid', async () => {
      companyServiceMock.update.mockResolvedValue(mockCompanyUpdated);
      const result = await controller.update('1', updateCompanyDto);
      expect(result).toEqual(mockCompanyUpdated);
    });
  });
});

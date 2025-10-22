import { Test, TestingModule } from '@nestjs/testing';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { mockContact } from './mock/contact-data.mock';

describe('ContactsController (Unit)', () => {
  let controller: ContactsController;
  let service: ContactsService;

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactsController],
      providers: [
        {
          provide: ContactsService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<ContactsController>(ContactsController);
    service = module.get<ContactsService>(ContactsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create contact', () => {
    const createContactDto: CreateContactDto = {
      name: 'Paul',
      email: 'paul@example.com',
      phone: '+549123456789',
      companyId: 1,
    };

    it('should call service.create and return the created contact', async () => {
      serviceMock.create.mockResolvedValue(mockContact);

      const result = await controller.create(createContactDto);

      expect(serviceMock.create).toHaveBeenCalledWith(createContactDto);
      expect(result).toEqual(mockContact);
    });
  });
});

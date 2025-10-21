import { Test, TestingModule } from '@nestjs/testing';
import { ContactsService } from './contacts.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { mockContact } from './mock/contact-data.mock';

describe('ContactsService (Unit)', () => {
  let service: ContactsService;
  let prisma: PrismaService;

  const prismaMock = {
    contact: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ContactsService>(ContactsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  /*afterAll(async () => {
    await prisma.contact.deleteMany();
    await prisma.$disconnect();
  });*/

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create contact', () => {
    const createContactDto: CreateContactDto = {
      name: 'Paul',
      email: 'paul@example.com',
      phone: '+549123456789',
      companyId: 1,
    };

    it('should call prisma.contact.create and return a contact', async () => {
      prismaMock.contact.create.mockResolvedValue(mockContact);

      const result = await service.create(createContactDto);

      expect(prismaMock.contact.create).toHaveBeenCalledWith({
        data: createContactDto,
      });
      expect(result).toEqual(mockContact);
    });

    // Si la compania no existe, debe lanzar un error
    /*it('should throw an error if the company does not exist', async () => {
      const createContactDto: CreateContactDto = {
        name: 'Paul',
        email: 'paul@example.com',
        phone: '+549123456789',
        companyId: 100,
      };

      await expect(service.create(createContactDto)).rejects.toThrow(
        'Company not found',
      );
    });*/

    // otros test cases...
  });
});

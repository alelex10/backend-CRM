import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Contact, Prisma } from '../../generated/prisma';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  // Crear un nuevo contacto
  create(createContactDto: CreateContactDto, id: number): Promise<Contact> {
    const hasCompany = createContactDto.companyId !== undefined;
    return this.prisma.contact.create({
      data: {
        name: createContactDto.name,
        email: createContactDto.email,
        phone: createContactDto.phone,
        company: hasCompany
          ? { connect: { id: createContactDto.companyId } }
          : undefined,
        user: { connect: { id } },
      },
    });
  }

  // Obtener todos los contactos con/sin filtros
  async findAll(
    userId: number,
    params?: {
      name?: string;
      email?: string;
      orderBy?: string;
      order?: 'asc' | 'desc';
      page?: number;
    },
  ) {
    const {
      name,
      email,
      orderBy = 'createdAt',
      order = 'asc',
      page = 1,
    } = params || {};

    const limit = 10;

    const skip = (page - 1) * limit;

    const where: Prisma.ContactWhereInput = {
      deletedAt: null,
      userId,
      ...(name && { name: { contains: name, mode: 'insensitive' } }),
      ...(email && { email: { contains: email, mode: 'insensitive' } }),
    };

    // Obtener todos los contactos
    const [data, total] = await Promise.all([
      this.prisma.contact.findMany({
        where,
        orderBy: {
          [orderBy]: order,
        },
        skip,
        take: limit,
      }),
      this.prisma.contact.count({
        where,
      }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Obtener un contacto por ID
  async findOne(id: number, userId: number): Promise<Contact> {
    const contact = await this.prisma.contact.findUnique({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      include: {
        notes: {
          where: { deletedAt: null },
        },
      },
    });

    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    if (contact.deletedAt) {
      throw new NotFoundException(`Contact with ID ${id} deleted`);
    }

    return contact;
  }

  // Actualizar un contacto
  async update(
    id: number,
    updateContactDto: UpdateContactDto,
    userId: number,
  ): Promise<Contact> {
    await this.findOne(id, userId);

    const updatedContact = await this.prisma.contact.update({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      data: updateContactDto,
    });

    return updatedContact;
  }

  // Eliminar un contacto
  async remove(id: number, userId: number): Promise<void> {
    await this.findOne(id, userId);

    // Soft delete de las notas relacionadas
    await this.prisma.note.updateMany({
      where: { contactId: id },
      data: { deletedAt: new Date() },
    });

    // Desasociar los deals (mantenerlos para dashboard)
    await this.prisma.deal.updateMany({
      where: { contactId: id },
      data: { contactId: null },
    });

    // Soft delete del contacto
    await this.prisma.contact.update({
      where: {
        id,
        userId,
      },
      data: { deletedAt: new Date() },
    });
  }

  async updateCompanyMany(
    contactIds: number[],
    sub: number,
    newCompanyId: number,
  ) {
    
    console.log(`companyId: ${newCompanyId} typo: ${typeof newCompanyId}`);
    console.log(`contactIds: ${contactIds} typo: ${typeof contactIds}`);
    console.log(`sub: ${sub} typo: ${typeof sub}`);
    if (contactIds.length === 0) {
      throw new NotFoundException(`Contact not found with ids: ${contactIds}`);
    }
    const eliminate = await this.prisma.contact.updateMany({
      where: {
        id: {
          in: contactIds,
        },
        userId: sub,
      },
      data: {
        companyId: newCompanyId,
      },
    });

    console.log("eliminate", eliminate)

    const contacts = await this.prisma.contact.findMany({
      where: {
        id: {
          in: contactIds,
        },
      },
    });
    console.log('contacts', contacts);

    return contacts;
  }
}

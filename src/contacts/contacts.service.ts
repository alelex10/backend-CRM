import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Contact, Prisma } from '../../generated/prisma';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  // Crear un nuevo contacto
  create(createContactDto: CreateContactDto): Promise<Contact> {
    return this.prisma.contact.create({
      data: createContactDto,
    });
  }

  // Obtener todos los contactos con/sin filtros
  async findAll(params?: {
    name?: string;
    email?: string;
    orderBy?: string;
    order?: 'asc' | 'desc';
    page?: number;
  }) {
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
  async findOne(id: number): Promise<Contact> {
    const contact = await this.prisma.contact.findUnique({ where: { id } });

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
  ): Promise<Contact> {
    await this.findOne(id);

    const updatedContact = await this.prisma.contact.update({
      where: { id },
      data: updateContactDto,
    });

    return updatedContact;
  }

  // Eliminar un contacto
  async remove(id: number): Promise<void> {
    await this.findOne(id);

    // Borrado lógico
    await this.prisma.contact.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

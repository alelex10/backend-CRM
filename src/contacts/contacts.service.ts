import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Contact } from '../../generated/prisma';
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

  // Obtener todos los contactos
  findAll() {
    return `This action returns all contacts`;
  }

  // Obtener un contacto por ID
  findOne(id: number) {
    return `This action returns the contact #${id}`;
  }

  // Actualizar un contacto
  update(id: number, updateCompanyDto: UpdateContactDto) {
    return `This action updates the contact #${id}`;
  }

  // Eliminar un contacto
  remove(id: number) {
    return `This action removes the contact #${id}`;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Note } from '../../generated/prisma';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    contactId: number,
    createNoteDto: CreateNoteDto,
    userId: number,
  ): Promise<Note> {
    const { title, description } = createNoteDto;

    // Verificar que el contacto pertenece al usuario autenticado
    const contact = await this.prisma.contact.findFirst({
      where: {
        id: contactId,
        userId,
        deletedAt: null,
      },
    });

    if (!contact) {
      throw new NotFoundException(`Contact not found or not accessible`);
    }

    // Crear la nota
    return this.prisma.note.create({
      data: {
        title,
        description,
        contact: { connect: { id: contactId } },
      },
    });
  }

  /*findAll() {
    return `This action returns all notes`;
  }*/

  async findOne(id: number, userId: number): Promise<Note> {
    const note = await this.prisma.note.findUnique({
      where: {
        id,
        deletedAt: null,
        contact: { userId },
      },
    });

    if (!note) {
      throw new Error(`Note with ID ${id} not found or not accessible`);
    }

    return note;
  }

  async update(
    id: number,
    updateNoteDto: UpdateNoteDto,
    userId: number,
  ): Promise<Note> {
    //return `This action updates a #${id} note`;
    await this.findOne(id, userId);

    const updatedNote = await this.prisma.note.update({
      where: { id },
      data: updateNoteDto,
    });

    return updatedNote;
  }

  async remove(id: number, userId: number): Promise<void> {
    //return `This action removes a #${id} note`;
    await this.findOne(id, userId);

    // Soft delete
    await this.prisma.note.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

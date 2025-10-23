import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Note } from '../../generated/prisma';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  create(contactId: number, createNoteDto: CreateNoteDto): Promise<Note> {
    const { title, description } = createNoteDto;

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

  async findOne(id: number): Promise<Note> {
    const note = await this.prisma.note.findUnique({ where: { id } });

    if (!note) {
      throw new Error(`Note with ID ${id} not found`);
    }

    return note;
  }

  async update(id: number, updateNoteDto: UpdateNoteDto): Promise<Note> {
    //return `This action updates a #${id} note`;
    await this.findOne(id);

    const updatedNote = await this.prisma.note.update({
      where: { id },
      data: updateNoteDto,
    });

    return updatedNote;
  }

  async remove(id: number): Promise<void> {
    //return `This action removes a #${id} note`;
    await this.findOne(id);

    await this.prisma.note.delete({
      where: { id },
    });
  }
}

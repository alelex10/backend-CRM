import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Controller()
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post('/contacts/:id/notes')
  create(
    @Param('id') id: string,
    @Body() createNoteDto: CreateNoteDto,
    @Request() req: any,
  ) {
    return this.notesService.create(Number(id), createNoteDto, req.user.sub);
  }

  /*@Get()
  findAll() {
    return this.notesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(+id);
  }*/

  @Put('notes/:id')
  async update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Request() req: any,
  ) {
    const note = await this.notesService.update(
      Number(id),
      updateNoteDto,
      req.user.sub,
    );
    return { message: `Note with ID ${id} updated successfully`, note };
  }

  @Delete('notes/:id')
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.notesService.remove(Number(id), req.user.sub);
    return { message: `Note with ID ${id} deleted successfully` };
  }
}

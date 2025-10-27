import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  create(@Body() createContactDto: CreateContactDto, @Request() req: any) {
    //console.log(req.user);
    return this.contactsService.create(createContactDto, req.user.sub);
  }

  @Get()
  findAll(
    @Request() req: any,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('orderBy') orderBy?: string,
    @Query('order') order?: 'asc' | 'desc',
    @Query('page') page?: number,
  ) {
    return this.contactsService.findAll(req.user.sub, {
      name,
      email,
      orderBy,
      order,
      page: page ? Number(page) : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.contactsService.findOne(Number(id), req.user.sub);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
    @Request() req: any,
  ) {
    return this.contactsService.update(
      Number(id),
      updateContactDto,
      req.user.sub,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.contactsService.remove(Number(id), req.user.sub);
    return { message: `Contact with ID ${id} deleted successfully` };
  }
}

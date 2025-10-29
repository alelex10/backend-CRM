import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { FintUserDto } from './dto/fint-user.dto';
import { DeleteManyDto } from './dto/delete-many.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('create')
  create(@Body() createCompanyDto: CreateCompanyDto, @Request() req: any) {
    return this.companyService.create(createCompanyDto, req.user.sub);
  }

  // traer todos los company paginado
  @Get()
  findAll(@Query() query: FintUserDto, @Request() req: any) {
    return this.companyService.findAll(query, req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.companyService.findOne(+id, req.user.sub);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Request() req: any,
  ) {

    return this.companyService.update(+id, updateCompanyDto, req.user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.companyService.remove(+id, req.user.sub);
  }

  @Delete()
  removeMany(@Body() body: DeleteManyDto, @Request() req: any) {
    return this.companyService.removeMany(body.ids, req.user.sub);
  }
}

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

@Controller('company')
// @UseInterceptors(ResponseInterceptor)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  // @Roles(Role.USER)
  @Post('create')
  // @Public()
  create(@Body() createCompanyDto: CreateCompanyDto, @Request() req : any) {
    // console.log(req.user);
    return this.companyService.create(createCompanyDto, req.user.sub);
  }

  // traer todos los company paginado
  @Get()
  findAll(@Query() query: FintUserDto) {
    return this.companyService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(+id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }
}

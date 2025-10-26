import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { DealsService } from './deals.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';

@Controller('deals')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Post()
  create(@Body() createDealDto: CreateDealDto, @Request() req: any) {
    return this.dealsService.create(createDealDto, req.user.sub);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.dealsService.findAll(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.dealsService.findOne(Number(id), req.user.sub);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDealDto: UpdateDealDto,
    @Request() req: any,
  ) {
    return this.dealsService.update(Number(id), updateDealDto, req.user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.dealsService.remove(Number(id), req.user.sub);
  }
}

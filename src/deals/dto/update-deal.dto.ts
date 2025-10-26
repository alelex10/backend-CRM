import { PartialType } from '@nestjs/mapped-types';
import { CreateDealDto } from './create-deal.dto';
//import { IsDate, IsOptional } from 'class-validator';

export class UpdateDealDto extends PartialType(CreateDealDto) {
  /*@IsOptional()
  @IsDate()
  closedAt?: Date;*/
}

import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { DealStage } from '@generated/prisma';

export class CreateDealDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsOptional()
  value: number;

  @IsNotEmpty()
  stage: DealStage;

  @IsInt()
  @IsNotEmpty()
  contactId: number;

  @IsOptional()
  @IsInt()
  lossReasonId?: number;

  @IsOptional()
  @IsString()
  lossReasonNote?: string;
}

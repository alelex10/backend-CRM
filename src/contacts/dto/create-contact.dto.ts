import {
  IsInt,
  IsOptional,
  IsString,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsInt()
  @IsNotEmpty()
  companyId: number;
}

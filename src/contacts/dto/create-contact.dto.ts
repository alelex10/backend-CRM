import {
  IsInt,
  IsOptional,
  IsString,
  IsEmail,
  IsNotEmpty,
  IsEmpty,
} from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsInt()
  @IsOptional()
  companyId?: number;
}

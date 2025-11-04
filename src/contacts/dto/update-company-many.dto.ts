import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsEmpty, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCompanyManyDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Type(() => Number) // convierte strings a números
  contactIds: number[];

  @IsOptional()
  @IsInt()
  companyId: number | null;
}

import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';

export class UpdateCompanyManyDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Type(() => Number) // convierte strings a números
  contactIds: number[];

  companyId: number | null;
}

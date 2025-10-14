import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export abstract class Find {
  @IsOptional()
  @IsString()
  search?: string;

  //   @IsOptional()
  //   @IsEnum(Role)
  //   role?: Role;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) =>
    value === undefined || value === '' ? 1 : Number(value),
  )
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) =>
    value === undefined || value === '' ? 10 : Number(value),
  )
  limit?: number = 10;

  //   @IsOptional()
  //   @IsEnum(['name', 'email', 'createdAt'])
  //   orderBy?: 'name' | 'email' | 'createdAt' = 'createdAt';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';
}

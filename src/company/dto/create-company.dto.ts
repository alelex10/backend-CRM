import { IsString } from 'class-validator';
import { Company } from 'generated/prisma';

export class CreateCompanyDto implements Pick<Company, 'name' | 'industry' | 'address'> {
  @IsString()
  name: string;
  @IsString()
  industry: string;
  @IsString()
  address: string;
}

import { IsNotEmpty, IsString } from 'class-validator';
import { Company } from 'generated/prisma';

export class CreateCompanyDto
  implements Pick<Company, 'name' | 'industry' | 'address'>
{
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
  @IsNotEmpty({ message: 'Industry is required' })
  industry: string;
  @IsNotEmpty({ message: 'Address is required' })
  address: string;
}

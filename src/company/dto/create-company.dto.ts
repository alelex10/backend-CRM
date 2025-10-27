import { Company } from 'generated/prisma';

interface ICreateCompanyDto
  extends Omit<
    Company,
    'id' | 'createdAt' | 'updatedAt' | 'userId' | 'deletedAt'
  > {}
export class CreateCompanyDto implements ICreateCompanyDto {
  name: string;
  industry: string;
  address: string;
  // userId: number | null;
}

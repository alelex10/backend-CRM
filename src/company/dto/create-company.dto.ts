import { Company } from "generated/prisma";

interface ICreateCompanyDto extends  Omit<Company, 'id' | 'createdAt' | 'updatedAt'> {}
export class CreateCompanyDto implements ICreateCompanyDto {
    name: string;
    industry: string;
    address: string;
}

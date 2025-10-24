import { Company } from 'generated/prisma';
import { UpdateCompanyDto } from '../dto/update-company.dto';

export const mockCompany: Company = {
  userId: 1,
  id: 1,
  name: 'Coca Cola',
  industry: 'Soft Drinks',
  address: '123 Main St, Anytown, USA',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockCompanys: Company[] = [
  mockCompany,
  {
    userId: 1,
    id: 2,
    name: 'Pepsi',
    industry: 'Soft Drinks',
    address: '123 Main St, Anytown, USA',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockCompanysAsStrings = mockCompanys.map((company) => ({
  ...company,
  createdAt: company.createdAt.toISOString(),
  updatedAt: company.updatedAt.toISOString(),
}));

export const mockReqCompanyUpdated: UpdateCompanyDto = {
  name: 'Village',
  industry: 'Bad Drinks',
  address: '323 Main St, Anytown, USA',
};

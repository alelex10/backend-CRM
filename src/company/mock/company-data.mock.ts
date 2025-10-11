import { Company } from 'generated/prisma';

export const mockCompany: Company = {
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
    id: 2,
    name: 'Pepsi',
    industry: 'Soft Drinks',
    address: '123 Main St, Anytown, USA',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

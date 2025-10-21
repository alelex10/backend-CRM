import { Contact } from 'generated/prisma';

export const mockContact: Contact = {
  id: 1,
  name: 'Paul',
  email: 'paul@example.com',
  phone: '+549123456789',
  companyId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockContacts: Contact[] = [
  mockContact,
  {
    id: 2,
    name: 'David',
    email: 'david@example.com',
    phone: '+549123456789',
    companyId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

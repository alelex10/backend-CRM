import { Contact } from 'generated/prisma';

export const mockContact: Contact = {
  userId: 1,
  id: 1,
  name: 'Paul',
  email: 'paul@example.com',
  phone: '+549123456789',
  companyId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

export const mockContacts: Contact[] = [
  mockContact,
  {
    userId: 1,
    id: 2,
    name: 'David',
    email: 'david@example.com',
    phone: '+549123456789',
    companyId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
];

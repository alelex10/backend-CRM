import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // Crear usuarios de prueba
  const uID = 19;
  await prisma.company.createMany({
    data: [
      {
        name: 'Tech Solutions Inc.',
        industry: 'Tecnología',
        address: '123 Innovation Drive, Silicon Valley, CA',
        userId: uID,
        createdAt: new Date('2023-01-15T10:00:00Z'),
        updatedAt: new Date('2023-11-20T14:30:00Z'),
      },
      {
        name: 'Global Finance Group',
        industry: 'Finanzas',
        address: '45 Wall Street, New York, NY',
        userId: uID,
        createdAt: new Date('2023-02-10T09:00:00Z'),
        updatedAt: new Date('2023-12-05T16:00:00Z'),
      },
      {
        name: 'Health First Medical',
        industry: 'Salud',
        address: '789 Wellness Way, Boston, MA',
        userId: uID,
        createdAt: new Date('2023-03-22T11:30:00Z'),
        updatedAt: new Date('2024-01-10T09:15:00Z'),
      },
      {
        name: 'EcoBuild Construction',
        industry: 'Construcción',
        address: '101 Green Avenue, Austin, TX',
        userId: uID,
        createdAt: new Date('2023-04-05T14:00:00Z'),
        updatedAt: new Date('2024-01-25T11:45:00Z'),
      },
      {
        name: 'Artisan Foods Ltd.',
        industry: 'Alimentos',
        address: '222 Gourmet Lane, San Francisco, CA',
        userId: uID,
        createdAt: new Date('2023-05-18T08:45:00Z'),
        updatedAt: new Date('2024-02-01T13:00:00Z'),
      },
      {
        name: 'AeroDynamic Aviation',
        industry: 'Aeronáutica',
        address: '333 Skyway Boulevard, Seattle, WA',
        userId: uID,
        createdAt: new Date('2023-06-01T16:00:00Z'),
        updatedAt: new Date('2024-02-15T10:30:00Z'),
      },
      {
        name: 'Creative Minds Agency',
        industry: 'Marketing',
        address: '444 Visionary Street, Los Angeles, CA',
        userId: uID,
        createdAt: new Date('2023-07-12T10:15:00Z'),
        updatedAt: new Date('2024-03-01T14:00:00Z'),
      },
      {
        name: 'Oceanic Shipping Co.',
        industry: 'Logística',
        address: '555 Portside Road, Miami, FL',
        userId: uID, // Asumiendo que esta empresa también tiene un userId
        createdAt: new Date('2023-08-25T13:00:00Z'),
        updatedAt: new Date('2024-03-18T16:30:00Z'),
      },
      {
        name: 'Quantum Energy Corp.',
        industry: 'Energía',
        userId: uID,
        address: '666 Future Drive, Houston, TX',
        createdAt: new Date('2023-09-07T09:30:00Z'),
        updatedAt: new Date('2024-04-01T09:00:00Z'),
      },
      {
        name: 'EduFuture Academy',
        industry: 'Educación',
        userId: uID,
        address: '777 Learning Lane, Chicago, IL',
        createdAt: new Date('2023-10-19T11:00:00Z'),
        updatedAt: new Date('2024-04-15T11:15:00Z'),
      },
      {
        name: 'CyberSecure Solutions',
        industry: 'Ciberseguridad',
        userId: uID,
        address: '888 Network Avenue, Atlanta, GA',
        createdAt: new Date('2023-11-02T15:00:00Z'),
        updatedAt: new Date('2024-05-01T13:45:00Z'),
      },
      {
        name: 'BioGen Research',
        industry: 'Biotecnología',
        userId: uID,
        address: '999 Discovery Road, San Diego, CA',
        createdAt: new Date('2023-12-14T08:00:00Z'),
        updatedAt: new Date('2024-05-20T15:00:00Z'),
      },
      {
        name: 'Urban Mobility Systems',
        industry: 'Transporte',
        userId: uID,
        address: '111 Commute Street, Denver, CO',
        createdAt: new Date('2024-01-05T10:30:00Z'),
        updatedAt: new Date('2024-06-01T10:00:00Z'),
      },
      {
        name: 'Luxury Living Homes',
        industry: 'Inmobiliaria',
        userId: uID,
        address: '222 Estate Drive, Scottsdale, AZ',
        createdAt: new Date('2024-01-28T14:00:00Z'),
        updatedAt: new Date('2024-06-15T12:30:00Z'),
      },
      {
        name: 'GamerZone Entertainment',
        industry: 'Entretenimiento',
        userId: uID,
        address: '333 Pixel Way, Orlando, FL',
        createdAt: new Date('2024-02-10T09:15:00Z'),
        updatedAt: new Date('2024-07-01T14:00:00Z'),
      },
      {
        name: 'Sustainable Agriculture Farms',
        industry: 'Agricultura',
        userId: uID,
        address: '444 Harvest Lane, Fresno, CA',
        createdAt: new Date('2024-03-01T11:45:00Z'),
        updatedAt: new Date('2024-07-18T16:00:00Z'),
      },
      {
        name: 'Digital Media Hub',
        industry: 'Medios',
        userId: uID,
        address: '555 Broadcast Road, New York, NY',
        createdAt: new Date('2024-03-25T13:30:00Z'),
        updatedAt: new Date('2024-08-01T09:30:00Z'),
      },
      {
        name: 'Precision Engineering Works',
        industry: 'Ingeniería',
        userId: uID,
        address: '666 Forge Street, Detroit, MI',
        createdAt: new Date('2024-04-08T16:00:00Z'),
        updatedAt: new Date('2024-08-15T11:45:00Z'),
      },
      {
        name: 'Global Trade Exchange',
        industry: 'Comercio Internacional',
        userId: uID,
        address: '777 Exchange Avenue, London, UK',
        createdAt: new Date('2024-04-20T10:00:00Z'),
        updatedAt: new Date('2024-09-01T13:00:00Z'),
      },
      {
        name: 'Advanced Robotics Inc.',
        industry: 'Robótica',
        userId: uID,
        address: '888 Automaton Drive, Tokyo, JP',
        createdAt: new Date('2024-05-05T12:30:00Z'),
        updatedAt: new Date('2024-09-18T15:30:00Z'),
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

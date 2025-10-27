import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // Crear usuarios de prueba
  await prisma.company.createMany({
    data: [
      {
        name: 'Tech Solutions Inc.',
        industry: 'Tecnología',
        address: '123 Innovation Drive, Silicon Valley, CA',
        userId: 4,
      },
      {
        name: 'Global Finance Group',
        industry: 'Finanzas',
        address: '45 Wall Street, New York, NY',
        userId: 4,
      },
      {
        name: 'Health First Medical',
        industry: 'Salud',
        address: '789 Wellness Way, Boston, MA',
        userId: 4,
      },
      {
        name: 'EcoBuild Construction',
        industry: 'Construcción',
        address: '101 Green Avenue, Austin, TX',
        userId: 4,
      },
      {
        name: 'Artisan Foods Ltd.',
        industry: 'Alimentos',
        address: '222 Gourmet Lane, San Francisco, CA',
        userId: 4,
      },
      {
        name: 'AeroDynamic Aviation',
        industry: 'Aeronáutica',
        address: '333 Skyway Boulevard, Seattle, WA',
        userId: 4,
      },
      {
        name: 'Creative Minds Agency',
        industry: 'Marketing',
        address: '444 Visionary Street, Los Angeles, CA',
        userId: 4,
      },
      {
        name: 'Oceanic Shipping Co.',
        industry: 'Logística',
        address: '555 Portside Road, Miami, FL',
      },
      {
        name: 'Quantum Energy Corp.',
        industry: 'Energía',
        userId: 4,
        address: '666 Future Drive, Houston, TX',
      },
      {
        name: 'EduFuture Academy',
        industry: 'Educación',
        userId: 4,
        address: '777 Learning Lane, Chicago, IL',
      },
      {
        name: 'CyberSecure Solutions',
        industry: 'Ciberseguridad',
        userId: 4,
        address: '888 Network Avenue, Atlanta, GA',
      },
      {
        name: 'BioGen Research',
        industry: 'Biotecnología',
        userId: 4,
        address: '999 Discovery Road, San Diego, CA',
      },
      {
        name: 'Urban Mobility Systems',
        industry: 'Transporte',
        userId: 4,
        address: '111 Commute Street, Denver, CO',
      },
      {
        name: 'Luxury Living Homes',
        industry: 'Inmobiliaria',
        userId: 4,
        address: '222 Estate Drive, Scottsdale, AZ',
      },
      {
        name: 'GamerZone Entertainment',
        industry: 'Entretenimiento',
        userId: 4,
        address: '333 Pixel Way, Orlando, FL',
      },
      {
        name: 'Sustainable Agriculture Farms',
        industry: 'Agricultura',
        userId: 4,
        address: '444 Harvest Lane, Fresno, CA',
      },
      {
        name: 'Digital Media Hub',
        industry: 'Medios',
        userId: 4,
        address: '555 Broadcast Road, New York, NY',
      },
      {
        name: 'Precision Engineering Works',
        industry: 'Ingeniería',
        userId: 4,
        address: '666 Forge Street, Detroit, MI',
      },
      {
        name: 'Global Trade Exchange',
        industry: 'Comercio Internacional',
        userId: 4,
        address: '777 Exchange Avenue, London, UK',
      },
      {
        name: 'Advanced Robotics Inc.',
        industry: 'Robótica',
        userId: 4,
        address: '888 Automaton Drive, Tokyo, JP',
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

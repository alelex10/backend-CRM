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
      },
      {
        name: 'Global Finance Group',
        industry: 'Finanzas',
        address: '45 Wall Street, New York, NY',
      },
      {
        name: 'Health First Medical',
        industry: 'Salud',
        address: '789 Wellness Way, Boston, MA',
      },
      {
        name: 'EcoBuild Construction',
        industry: 'Construcción',
        address: '101 Green Avenue, Austin, TX',
      },
      {
        name: 'Artisan Foods Ltd.',
        industry: 'Alimentos',
        address: '222 Gourmet Lane, San Francisco, CA',
      },
      {
        name: 'AeroDynamic Aviation',
        industry: 'Aeronáutica',
        address: '333 Skyway Boulevard, Seattle, WA',
      },
      {
        name: 'Creative Minds Agency',
        industry: 'Marketing',
        address: '444 Visionary Street, Los Angeles, CA',
      },
      {
        name: 'Oceanic Shipping Co.',
        industry: 'Logística',
        address: '555 Portside Road, Miami, FL',
      },
      {
        name: 'Quantum Energy Corp.',
        industry: 'Energía',
        address: '666 Future Drive, Houston, TX',
      },
      {
        name: 'EduFuture Academy',
        industry: 'Educación',
        address: '777 Learning Lane, Chicago, IL',
      },
      {
        name: 'CyberSecure Solutions',
        industry: 'Ciberseguridad',
        address: '888 Network Avenue, Atlanta, GA',
      },
      {
        name: 'BioGen Research',
        industry: 'Biotecnología',
        address: '999 Discovery Road, San Diego, CA',
      },
      {
        name: 'Urban Mobility Systems',
        industry: 'Transporte',
        address: '111 Commute Street, Denver, CO',
      },
      {
        name: 'Luxury Living Homes',
        industry: 'Inmobiliaria',
        address: '222 Estate Drive, Scottsdale, AZ',
      },
      {
        name: 'GamerZone Entertainment',
        industry: 'Entretenimiento',
        address: '333 Pixel Way, Orlando, FL',
      },
      {
        name: 'Sustainable Agriculture Farms',
        industry: 'Agricultura',
        address: '444 Harvest Lane, Fresno, CA',
      },
      {
        name: 'Digital Media Hub',
        industry: 'Medios',
        address: '555 Broadcast Road, New York, NY',
      },
      {
        name: 'Precision Engineering Works',
        industry: 'Ingeniería',
        address: '666 Forge Street, Detroit, MI',
      },
      {
        name: 'Global Trade Exchange',
        industry: 'Comercio Internacional',
        address: '777 Exchange Avenue, London, UK',
      },
      {
        name: 'Advanced Robotics Inc.',
        industry: 'Robótica',
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

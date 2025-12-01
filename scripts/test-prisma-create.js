require('dotenv/config');
const { PrismaClient } = require('../generated/prisma/client');

(async () => {
  const prisma = new PrismaClient({ adapter: require('@prisma/adapter-pg').PrismaPg && new (require('@prisma/adapter-pg').PrismaPg)() });
  try {
    await prisma.$connect();
    console.log('Prisma connected');
    const u = await prisma.user.create({ data: { name: 'PrismaTest', email: `prisma-test-${Date.now()}@example.com`, role: 'USER' } });
    console.log('Created user', u);
  } catch (err) {
    console.error('Prisma error:', err);
  } finally {
    await prisma.$disconnect();
  }
})();

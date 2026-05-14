const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('Admin123!', 12);
  console.log('Hash généré:', hash);
  await prisma.admin.create({
    data: { email: 'admin@netpass.pro', password: hash, nom: 'Administrateur' }
  });
  console.log('Admin créé avec succès');
  await prisma.$disconnect();
}

main();

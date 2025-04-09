import {PrismaClient} from '@prisma/client';
import sampleData from './sample-data';

async function main() {
  const prisma = new PrismaClient();
  await prisma.morador.createMany({data: sampleData.moradores.filter((morador): morador is NonNullable<typeof morador> => morador !== undefined)});

  console.log('Sample data loaded.');
}
main()
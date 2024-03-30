import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

const connectPrisma = () => {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
};

export default connectPrisma;

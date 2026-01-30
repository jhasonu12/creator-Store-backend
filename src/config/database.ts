import { PrismaClient } from '@prisma/client';

let prismaInstance: PrismaClient;

export const getPrismaClient = (): PrismaClient => {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient();
  }
  return prismaInstance;
};

export const disconnectPrisma = async (): Promise<void> => {
  if (prismaInstance) {
    await prismaInstance.$disconnect();
  }
};

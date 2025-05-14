import { PrismaClient } from '@prisma/client';

// Déclarons un client Prisma global
let prisma: PrismaClient;

// Vérifiez si nous sommes en production
if (process.env.NODE_ENV === 'production') {
  // En production, créez un nouveau client PrismaClient
  prisma = new PrismaClient();
} else {
  // En développement, utilisez le même client entre les rechargements
  // @ts-ignore - globalThis n'est pas typé pour contenir _prisma
  if (!globalThis._prisma) {
    // @ts-ignore
    globalThis._prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    });
  }
  // @ts-ignore
  prisma = globalThis._prisma;
}

export default prisma; 
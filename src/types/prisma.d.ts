import { PrismaClient, Prisma } from '@prisma/client';

// Extension pour inclure les propriétés ajoutées dynamiquement
declare global {
  namespace PrismaJson {
    type PrismaClientExtended = PrismaClient & {
      race: any;
    };

    interface CharacterExtended {
      raceEntity?: {
        id: string;
        name: string;
      };
    }
  }
}

// Augmenter les types Prisma pour inclure les champs dynamiques
declare module '@prisma/client' {
  interface CharacterInclude extends Prisma.CharacterInclude {
    raceEntity?: boolean | Prisma.RaceArgsSelect;
  }
}

export {}; 
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

// Créer une nouvelle instance de PrismaClient pour éviter les problèmes de cache
const prisma = new PrismaClient();

export async function GET() {
  try {
    const characters = await prisma.character.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
        raceEntity: {
          select: {
            id: true,
            name: true,
          }
        }
      },
    });

    // Transformer les données pour ajouter la race de l'entité si elle existe
    const transformedCharacters = characters.map(character => {
      // Si character a une entité race, utiliser le nom de cette race
      const transformedCharacter = { ...character };
      if (transformedCharacter.raceEntity) {
        transformedCharacter.race = transformedCharacter.raceEntity.name;
      }
      
      // Nettoyer pour ne pas renvoyer raceEntity au client
      const { raceEntity, ...cleanCharacter } = transformedCharacter;
      return cleanCharacter;
    });

    return NextResponse.json(transformedCharacters);
  } catch (error) {
    console.error('Erreur lors de la récupération des personnages:', error);
    return NextResponse.json(
      [], { status: 200 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      );
    }

    const data = await request.json();

    if (!data.name) {
      return NextResponse.json(
        { message: 'Le nom est requis' },
        { status: 400 }
      );
    }

    // Créer un objet de données conforme au schéma Prisma
    const characterData = {
      name: data.name,
      lastName: data.lastName || null,
      title: data.title || null,
      race: data.race || null,
      class: data.class || null,
      faction: data.faction || null,
      alignment: data.alignment || null,
      background: data.background || null,
      description: data.description || null,
      mainImage: data.mainImage || null,
      headerBackground: data.headerBackground || null,
      images: data.images || '[]',
      videos: data.videos || '[]',
      tags: data.tags || '[]',
      author: {
        connect: {
          id: (session.user as any).id
        }
      }
    };

    // Ajouter la relation avec Race si raceId est fourni
    if (data.raceId) {
      console.log("Tentative de connexion avec la race:", data.raceId);
      // @ts-ignore - Nous ajoutons dynamiquement la propriété
      characterData.raceEntity = {
        connect: {
          id: data.raceId
        }
      };
    }

    const character = await prisma.character.create({
      data: characterData,
    });

    return NextResponse.json(character);
  } catch (error) {
    console.error('Erreur lors de la création du personnage:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la création du personnage', details: error instanceof Error ? error.message : 'Erreur inconnue' },
      { status: 500 }
    );
  }
} 
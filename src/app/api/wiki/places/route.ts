import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

// Créer une nouvelle instance de PrismaClient
const prisma = new PrismaClient();

export async function GET() {
  try {
    const places = await prisma.place.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            characters: true,
            stories: true
          }
        }
      },
    });

    return NextResponse.json(places);
  } catch (error) {
    console.error('Erreur lors de la récupération des lieux:', error);
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

    // Créer le lieu
    const placeData = {
      name: data.name,
      description: data.description || null,
      content: data.content || null,
      mainImage: data.mainImage || null,
      images: data.images || '[]',
      tags: data.tags || '[]',
      author: {
        connect: {
          id: (session.user as any).id
        }
      },
    };

    // Ajouter les personnages si présents
    if (data.characterIds && Array.isArray(data.characterIds) && data.characterIds.length > 0) {
      placeData['characters'] = {
        connect: data.characterIds.map((id: string) => ({ id }))
      };
    }

    // Ajouter les histoires si présentes
    if (data.storyIds && Array.isArray(data.storyIds) && data.storyIds.length > 0) {
      placeData['stories'] = {
        connect: data.storyIds.map((id: string) => ({ id }))
      };
    }

    const place = await prisma.place.create({
      data: placeData,
      include: {
        characters: true,
        stories: true
      }
    });

    return NextResponse.json(place);
  } catch (error) {
    console.error('Erreur lors de la création du lieu:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la création du lieu', details: error instanceof Error ? error.message : 'Erreur inconnue' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

// Créer une nouvelle instance de PrismaClient
const prisma = new PrismaClient();

export async function GET() {
  try {
    const stories = await prisma.story.findMany({
      orderBy: {
        updatedAt: 'desc',
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
            places: true
          }
        }
      },
    });

    return NextResponse.json(stories);
  } catch (error) {
    console.error('Erreur lors de la récupération des histoires:', error);
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

    if (!data.title) {
      return NextResponse.json(
        { message: 'Le titre est requis' },
        { status: 400 }
      );
    }

    if (!data.content) {
      return NextResponse.json(
        { message: 'Le contenu est requis' },
        { status: 400 }
      );
    }

    // Créer l'histoire
    const storyData = {
      title: data.title,
      summary: data.summary || null,
      content: data.content,
      mainImage: data.mainImage || null,
      images: data.images || '[]',
      published: data.published || false,
      tags: data.tags || '[]',
      author: {
        connect: {
          id: (session.user as any).id
        }
      },
    };

    // Ajouter les personnages si présents
    if (data.characterIds && Array.isArray(data.characterIds) && data.characterIds.length > 0) {
      storyData['characters'] = {
        connect: data.characterIds.map((id: string) => ({ id }))
      };
    }

    // Ajouter les lieux si présents
    if (data.placeIds && Array.isArray(data.placeIds) && data.placeIds.length > 0) {
      storyData['places'] = {
        connect: data.placeIds.map((id: string) => ({ id }))
      };
    }

    const story = await prisma.story.create({
      data: storyData,
      include: {
        characters: true,
        places: true
      }
    });

    return NextResponse.json(story);
  } catch (error) {
    console.error('Erreur lors de la création de l\'histoire:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la création de l\'histoire', details: error instanceof Error ? error.message : 'Erreur inconnue' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Créer une nouvelle instance de PrismaClient
const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Extraire l'ID de façon sécurisée
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { message: 'ID de lieu manquant' },
        { status: 400 }
      );
    }

    const place = await prisma.place.findUnique({
      where: {
        id: id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        characters: {
          select: {
            id: true,
            name: true,
            lastName: true,
            title: true,
            mainImage: true,
          }
        },
        stories: {
          select: {
            id: true,
            title: true,
            mainImage: true,
            summary: true,
            published: true,
          }
        }
      },
    });

    if (!place) {
      return NextResponse.json(
        { message: 'Lieu non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(place);
  } catch (error) {
    console.error('Erreur lors de la récupération du lieu:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération du lieu' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Extraire l'ID de façon sécurisée
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { message: 'ID de lieu manquant' },
        { status: 400 }
      );
    }
    
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

    // Vérifier si le lieu existe
    const place = await prisma.place.findUnique({
      where: {
        id: id,
      },
      include: {
        author: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!place) {
      return NextResponse.json(
        { message: 'Lieu non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur est l'auteur ou un admin
    if (
      place.author.id !== (session.user as any).id && 
      (session.user as any).role !== 'ADMIN'
    ) {
      return NextResponse.json(
        { message: 'Non autorisé à modifier ce lieu' },
        { status: 403 }
      );
    }

    // Préparer les données pour la mise à jour
    const updateData: any = {
      name: data.name,
      description: data.description || null,
      content: data.content || null,
      mainImage: data.mainImage || null,
      images: data.images || '[]',
      tags: data.tags || '[]',
    };

    // Mettre à jour les relations avec les personnages si spécifiés
    if (data.characterIds !== undefined) {
      // Déconnecter tous les personnages actuels puis reconnecter les nouveaux
      updateData.characters = {
        set: [], // Déconnecte tous les personnages
        connect: (data.characterIds || []).map((id: string) => ({ id }))
      };
    }

    // Mettre à jour les relations avec les histoires si spécifiés
    if (data.storyIds !== undefined) {
      // Déconnecter toutes les histoires actuelles puis reconnecter les nouvelles
      updateData.stories = {
        set: [], // Déconnecte toutes les histoires
        connect: (data.storyIds || []).map((id: string) => ({ id }))
      };
    }

    // Mettre à jour le lieu
    const updatedPlace = await prisma.place.update({
      where: {
        id: id,
      },
      data: updateData,
      include: {
        characters: {
          select: {
            id: true,
            name: true
          }
        },
        stories: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    return NextResponse.json(updatedPlace);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du lieu:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour du lieu', details: error instanceof Error ? error.message : 'Erreur inconnue' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Extraire l'ID de façon sécurisée
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { message: 'ID de lieu manquant' },
        { status: 400 }
      );
    }
    
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Non autorisé - Seuls les administrateurs peuvent supprimer des lieux' },
        { status: 401 }
      );
    }

    // Vérifier si le lieu existe
    const place = await prisma.place.findUnique({
      where: {
        id: id,
      },
    });

    if (!place) {
      return NextResponse.json(
        { message: 'Lieu non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer le lieu
    await prisma.place.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      { message: 'Lieu supprimé avec succès' }
    );
  } catch (error) {
    console.error('Erreur lors de la suppression du lieu:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la suppression du lieu' },
      { status: 500 }
    );
  }
} 
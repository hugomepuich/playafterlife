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
        { message: 'ID d\'histoire manquant' },
        { status: 400 }
      );
    }

    const story = await prisma.story.findUnique({
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
        places: {
          select: {
            id: true,
            name: true,
            mainImage: true,
          }
        }
      },
    });

    if (!story) {
      return NextResponse.json(
        { message: 'Histoire non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(story);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'histoire:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération de l\'histoire' },
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
        { message: 'ID d\'histoire manquant' },
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

    // Vérifier si l'histoire existe
    const story = await prisma.story.findUnique({
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

    if (!story) {
      return NextResponse.json(
        { message: 'Histoire non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur est l'auteur ou un admin
    if (
      story.author.id !== (session.user as any).id && 
      (session.user as any).role !== 'ADMIN'
    ) {
      return NextResponse.json(
        { message: 'Non autorisé à modifier cette histoire' },
        { status: 403 }
      );
    }

    // Préparer les données pour la mise à jour
    const updateData: any = {
      title: data.title,
      summary: data.summary || null,
      content: data.content,
      mainImage: data.mainImage || null,
      images: data.images || '[]',
      published: data.published ?? story.published,
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

    // Mettre à jour les relations avec les lieux si spécifiés
    if (data.placeIds !== undefined) {
      // Déconnecter tous les lieux actuels puis reconnecter les nouveaux
      updateData.places = {
        set: [], // Déconnecte tous les lieux
        connect: (data.placeIds || []).map((id: string) => ({ id }))
      };
    }

    // Mettre à jour l'histoire
    const updatedStory = await prisma.story.update({
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
        places: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json(updatedStory);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'histoire:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour de l\'histoire', details: error instanceof Error ? error.message : 'Erreur inconnue' },
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
        { message: 'ID d\'histoire manquant' },
        { status: 400 }
      );
    }
    
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Non autorisé - Seuls les administrateurs peuvent supprimer des histoires' },
        { status: 401 }
      );
    }

    // Vérifier si l'histoire existe
    const story = await prisma.story.findUnique({
      where: {
        id: id,
      },
    });

    if (!story) {
      return NextResponse.json(
        { message: 'Histoire non trouvée' },
        { status: 404 }
      );
    }

    // Supprimer l'histoire
    await prisma.story.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      { message: 'Histoire supprimée avec succès' }
    );
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'histoire:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la suppression de l\'histoire' },
      { status: 500 }
    );
  }
} 
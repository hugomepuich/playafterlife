import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Créer une nouvelle instance de PrismaClient pour éviter les problèmes de cache
const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Extraire l'ID de façon sécurisée
    const id = params?.id;
    if (!id) {
      return NextResponse.json(
        { message: 'ID de personnage manquant' },
        { status: 400 }
      );
    }

    const character = await prisma.character.findUnique({
      where: {
        id: id,
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

    if (!character) {
      return NextResponse.json(
        { message: 'Personnage non trouvé' },
        { status: 404 }
      );
    }

    // Transformer le résultat pour l'API
    const { raceEntity, ...cleanCharacter } = character;
    const result = {
      ...cleanCharacter,
      raceId: raceEntity?.id || null,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Erreur lors de la récupération du personnage:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération du personnage' },
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
    const id = params?.id;
    if (!id) {
      return NextResponse.json(
        { message: 'ID de personnage manquant' },
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

    // Vérifier si le personnage existe
    const character = await prisma.character.findUnique({
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

    if (!character) {
      return NextResponse.json(
        { message: 'Personnage non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur est l'auteur ou un admin
    if (
      character.author.id !== (session.user as any).id && 
      (session.user as any).role !== 'ADMIN'
    ) {
      return NextResponse.json(
        { message: 'Non autorisé à modifier ce personnage' },
        { status: 403 }
      );
    }

    // Préparer les données pour la mise à jour
    const updateData: any = {
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
    };

    // Gérer la relation avec la table Race
    if (data.raceId) {
      updateData.raceEntity = {
        connect: {
          id: data.raceId
        }
      };
    } else {
      // Si raceId est absent ou explicitement null, déconnecter la relation
      updateData.raceEntity = {
        disconnect: true
      };
    }

    // Mettre à jour le personnage
    const updatedCharacter = await prisma.character.update({
      where: {
        id: id,
      },
      data: updateData,
    });

    return NextResponse.json(updatedCharacter);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du personnage:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour du personnage', details: error instanceof Error ? error.message : 'Erreur inconnue' },
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
    const id = params?.id;
    if (!id) {
      return NextResponse.json(
        { message: 'ID de personnage manquant' },
        { status: 400 }
      );
    }
    
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Vérifier si le personnage existe
    const character = await prisma.character.findUnique({
      where: {
        id: id,
      },
    });

    if (!character) {
      return NextResponse.json(
        { message: 'Personnage non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer le personnage
    await prisma.character.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      { message: 'Personnage supprimé avec succès' }
    );
  } catch (error) {
    console.error('Erreur lors de la suppression du personnage:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la suppression du personnage' },
      { status: 500 }
    );
  }
} 
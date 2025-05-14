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
    const id = params?.id;
    if (!id) {
      return NextResponse.json(
        { message: 'ID de race manquant' },
        { status: 400 }
      );
    }

    const race = await prisma.race.findUnique({
      where: {
        id: id,
      },
      include: {
        characters: {
          select: {
            id: true,
            name: true,
            mainImage: true,
            lastName: true,
            title: true
          }
        }
      }
    });

    if (!race) {
      return NextResponse.json(
        { message: 'Race non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(race);
  } catch (error) {
    console.error('Erreur lors de la récupération de la race:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération de la race' },
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
        { message: 'ID de race manquant' },
        { status: 400 }
      );
    }
    
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Non autorisé - Seuls les administrateurs peuvent modifier des races' },
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

    // Vérifier si la race existe
    const race = await prisma.race.findUnique({
      where: {
        id: id,
      }
    });

    if (!race) {
      return NextResponse.json(
        { message: 'Race non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier si le nouveau nom existe déjà pour une autre race
    if (data.name !== race.name) {
      const existingRace = await prisma.race.findUnique({
        where: {
          name: data.name
        }
      });

      if (existingRace) {
        return NextResponse.json(
          { message: 'Une race avec ce nom existe déjà' },
          { status: 400 }
        );
      }
    }

    // Mettre à jour la race
    const updatedRace = await prisma.race.update({
      where: {
        id: id,
      },
      data: {
        name: data.name,
        description: data.description || null,
        image: data.image || null
      },
    });

    return NextResponse.json(updatedRace);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la race:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour de la race', details: error instanceof Error ? error.message : 'Erreur inconnue' },
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
        { message: 'ID de race manquant' },
        { status: 400 }
      );
    }
    
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Non autorisé - Seuls les administrateurs peuvent supprimer des races' },
        { status: 401 }
      );
    }

    // Vérifier si la race existe
    const race = await prisma.race.findUnique({
      where: {
        id: id,
      },
      include: {
        _count: {
          select: {
            characters: true
          }
        }
      }
    });

    if (!race) {
      return NextResponse.json(
        { message: 'Race non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier si la race est utilisée par des personnages
    if (race._count.characters > 0) {
      return NextResponse.json(
        { message: 'Impossible de supprimer cette race car elle est utilisée par des personnages' },
        { status: 400 }
      );
    }

    // Supprimer la race
    await prisma.race.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      { message: 'Race supprimée avec succès' }
    );
  } catch (error) {
    console.error('Erreur lors de la suppression de la race:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la suppression de la race' },
      { status: 500 }
    );
  }
} 
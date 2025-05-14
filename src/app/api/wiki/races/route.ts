import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

// Créer une nouvelle instance de PrismaClient
const prisma = new PrismaClient();

export async function GET() {
  try {
    const races = await prisma.race.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: {
            characters: true
          }
        }
      }
    });

    return NextResponse.json(races);
  } catch (error) {
    console.error('Erreur lors de la récupération des races:', error);
    return NextResponse.json(
      [], { status: 200 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Non autorisé - Seuls les administrateurs peuvent créer des races' },
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

    // Vérifier si la race existe déjà
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

    // Créer la nouvelle race
    const race = await prisma.race.create({
      data: {
        name: data.name,
        description: data.description || null,
        image: data.image || null
      },
    });

    return NextResponse.json(race);
  } catch (error) {
    console.error('Erreur lors de la création de la race:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la création de la race', details: error instanceof Error ? error.message : 'Erreur inconnue' },
      { status: 500 }
    );
  }
} 
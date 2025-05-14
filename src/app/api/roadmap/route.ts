import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET: Récupérer tous les éléments de roadmap
export async function GET() {
  try {
    const roadmapItems = await prisma.roadmap.findMany({
      orderBy: [
        { priority: 'desc' },
        { targetDate: 'asc' },
      ],
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(roadmapItems);
  } catch (error) {
    console.error('Erreur lors de la récupération des éléments de roadmap:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des éléments de roadmap' },
      { status: 500 }
    );
  }
}

// POST: Créer un nouvel élément de roadmap
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    const newRoadmapItem = await prisma.roadmap.create({
      data: {
        ...data,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(newRoadmapItem, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création d\'un élément de roadmap:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création d\'un élément de roadmap' },
      { status: 500 }
    );
  }
} 
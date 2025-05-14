import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET: Récupérer toutes les FAQs publiées
export async function GET() {
  try {
    const faqs = await prisma.FAQ.findMany({
      where: {
        published: true,
      },
      orderBy: [
        { category: 'asc' },
        { priority: 'desc' },
      ],
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(faqs);
  } catch (error) {
    console.error('Erreur lors de la récupération des FAQs:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des FAQs' },
      { status: 500 }
    );
  }
}

// POST: Créer une nouvelle FAQ
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
    
    const newFaq = await prisma.FAQ.create({
      data: {
        ...data,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(newFaq, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création d\'une FAQ:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création d\'une FAQ' },
      { status: 500 }
    );
  }
} 
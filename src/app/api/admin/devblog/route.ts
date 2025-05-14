import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { title, content, tags, published } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { message: 'Titre et contenu requis' },
        { status: 400 }
      );
    }

    if (!(session.user as any).id) {
      return NextResponse.json(
        { message: 'ID utilisateur manquant' },
        { status: 400 }
      );
    }

    const post = await prisma.devblogPost.create({
      data: {
        title,
        content,
        tags: JSON.stringify(tags ? tags.split(',').map((tag: string) => tag.trim()) : []),
        published,
        author: {
          connect: {
            id: (session.user as any).id
          }
        }
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Erreur lors de la création du post:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la création du post' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const posts = await prisma.devblogPost.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching devblog posts:', error);
    return NextResponse.json(
      { message: 'Error fetching posts' },
      { status: 500 }
    );
  }
} 
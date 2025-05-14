import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeAdmin() {
  try {
    const user = await prisma.user.update({
      where: {
        email: 'MAYHEM', // Remplacez par l'email exact de l'utilisateur
      },
      data: {
        role: 'ADMIN',
      },
    });

    console.log('User updated successfully:', user);
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin(); 
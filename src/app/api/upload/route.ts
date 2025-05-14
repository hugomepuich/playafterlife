import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { mkdir } from 'fs/promises';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier téléchargé' },
        { status: 400 }
      );
    }

    // Vérifier le type de fichier (ajout des types vidéo)
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    const validTypes = [...validImageTypes, ...validVideoTypes];
    
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non pris en charge. Utilisez JPG, PNG, WEBP, GIF, MP4, WEBM, OGG ou MOV.' },
        { status: 400 }
      );
    }

    // Obtenir l'extension du fichier
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    
    // Créer un nom de fichier unique
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // Déterminer le dossier de destination en fonction du type de fichier
    const isVideo = validVideoTypes.includes(file.type);
    const uploadFolder = isVideo ? 'videos' : 'uploads';
    
    // Chemin du dossier de destination et du fichier
    const uploadDir = path.join(process.cwd(), 'public', uploadFolder);
    const filePath = path.join(uploadDir, fileName);
    
    // S'assurer que le dossier existe
    await mkdir(uploadDir, { recursive: true });
    
    // Convertir le fichier en tableau d'octets
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Écrire le fichier
    await writeFile(filePath, buffer);
    
    // Retourner l'URL du fichier
    const fileUrl = `/${uploadFolder}/${fileName}`;
    
    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error('Erreur lors du téléchargement du fichier:', error);
    return NextResponse.json(
      { error: 'Erreur lors du téléchargement du fichier' },
      { status: 500 }
    );
  }
} 
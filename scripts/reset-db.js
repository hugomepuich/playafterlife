const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Chemin vers la base de données
const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');

// Fonction principale
async function resetDatabase() {
  try {
    console.log('Démarrage de la réinitialisation de la base de données...');
    
    // 1. Vérifier si le fichier de base de données existe
    if (fs.existsSync(dbPath)) {
      console.log('Suppression de la base de données existante...');
      // Supprimer le fichier de base de données
      fs.unlinkSync(dbPath);
      console.log('Base de données supprimée.');
    } else {
      console.log('Aucune base de données existante trouvée.');
    }
    
    // 2. Regénérer le client Prisma
    console.log('Regénération du client Prisma...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // 3. Pousser le schéma vers la base de données
    console.log('Création de la nouvelle base de données...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    
    console.log('Réinitialisation de la base de données terminée avec succès!');
  } catch (error) {
    console.error('Erreur lors de la réinitialisation de la base de données:', error);
    process.exit(1);
  }
}

// Exécuter la fonction
resetDatabase(); 
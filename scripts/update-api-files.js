const fs = require('fs');
const path = require('path');

// Chemins des fichiers
const routeCharactersNew = path.join(__dirname, '..', 'src', 'app', 'api', 'wiki', 'characters', 'route.ts.new');
const routeCharactersId = path.join(__dirname, '..', 'src', 'app', 'api', 'wiki', 'characters', '[id]', 'route.ts.new');
const routeCharacters = path.join(__dirname, '..', 'src', 'app', 'api', 'wiki', 'characters', 'route.ts');
const routeCharactersIdDir = path.join(__dirname, '..', 'src', 'app', 'api', 'wiki', 'characters', '[id]');
const routeCharactersIdFile = path.join(routeCharactersIdDir, 'route.ts');

// Fonction principale
async function updateApiFiles() {
  try {
    console.log('Mise à jour des fichiers API...');
    
    // Vérifier si les fichiers .new existent
    if (fs.existsSync(routeCharactersNew)) {
      // Mettre à jour route.ts
      console.log('Mise à jour du fichier route.ts des personnages...');
      fs.copyFileSync(routeCharactersNew, routeCharacters);
      console.log('Le fichier a été mis à jour avec succès.');
    } else {
      console.log('Le fichier .new pour route.ts des personnages est manquant.');
    }
    
    // Vérifier si le fichier [id].new existe
    if (fs.existsSync(routeCharactersId)) {
      // S'assurer que le répertoire [id] existe
      if (!fs.existsSync(routeCharactersIdDir)) {
        console.log('Création du répertoire [id]...');
        fs.mkdirSync(routeCharactersIdDir, { recursive: true });
      }
      
      // Mettre à jour route.ts dans [id]
      console.log('Mise à jour du fichier route.ts des personnages dans [id]...');
      fs.copyFileSync(routeCharactersId, routeCharactersIdFile);
      console.log('Le fichier a été mis à jour avec succès.');
    } else {
      console.log('Le fichier .new pour route.ts des personnages dans [id] est manquant.');
    }
    
    console.log('Mise à jour des fichiers API terminée.');
  } catch (error) {
    console.error('Erreur lors de la mise à jour des fichiers API:', error);
    process.exit(1);
  }
}

// Exécuter la fonction
updateApiFiles(); 
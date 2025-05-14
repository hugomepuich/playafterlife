const { execSync } = require('child_process');

// Fonction principale
async function fixDependencies() {
  try {
    console.log('Démarrage de la réparation des dépendances...');
    
    // Nettoyer node_modules
    console.log('Suppression de node_modules...');
    execSync('rm -rf node_modules', { stdio: 'inherit' });
    
    // Supprimer package-lock.json
    console.log('Suppression de package-lock.json...');
    execSync('rm -f package-lock.json', { stdio: 'inherit' });
    
    // Installer les dépendances avec force
    console.log('Installation des dépendances...');
    execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
    
    // Installer uuid spécifiquement
    console.log('Installation de uuid@9.0.1...');
    execSync('npm install uuid@9.0.1 --legacy-peer-deps', { stdio: 'inherit' });
    
    console.log('Réparation des dépendances terminée!');
  } catch (error) {
    console.error('Erreur lors de la réparation des dépendances:', error);
    process.exit(1);
  }
}

// Exécuter la fonction
fixDependencies(); 
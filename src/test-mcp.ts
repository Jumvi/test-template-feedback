#!/usr/bin/env node

/**
 * Script de test pour valider le serveur MCP d'évaluation
 */

import { spawn } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

// Configuration de test
const testConfig = {
  repositoryUrl: 'https://github.com/test/example-repo',
  competence: 'CSS Styling',
  bareme: 'Structure HTML (3pts), Styles CSS (8pts), Responsive design (4pts), Bonnes pratiques (3pts), Créativité (2pts)',
  filesToAnalyze: ['index.html', 'style.css'],
  niveau: 'debutant'
};

const sampleCode = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Page</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Mon Site Web</h1>
    </header>
    <main>
        <section class="content">
            <p>Contenu principal de la page.</p>
        </section>
    </main>
    <footer>
        <p>&copy; 2024 Mon Site</p>
    </footer>
</body>
</html>
`;

console.log('🧪 Test du serveur MCP GitHub Classroom Evaluator\n');

async function testMCPServer() {
  try {
    console.log('🔄 Démarrage du serveur MCP...');
    
    // Vérifier que le serveur est compilé
    try {
      readFileSync(join(process.cwd(), 'dist', 'index.js'));
    } catch (error) {
      console.error('❌ Erreur: Le serveur n\'est pas compilé. Exécutez: npm run build');
      process.exit(1);
    }

    // Lancer le serveur MCP
    const mcpServer = spawn('node', ['dist/index.js'], {
      stdio: ['pipe', 'pipe', 'inherit'],
      env: { 
        ...process.env,
        GITHUB_TOKEN: process.env.GITHUB_TOKEN || 'test-token'
      }
    });

    let output = '';
    let errorOccurred = false;

    mcpServer.stdout.on('data', (data) => {
      output += data.toString();
    });

    mcpServer.on('error', (error) => {
      console.error('❌ Erreur lors du démarrage du serveur:', error);
      errorOccurred = true;
    });

    mcpServer.on('close', (code) => {
      if (errorOccurred) return;
      
      if (code === 0) {
        console.log('✅ Test terminé avec succès');
        console.log('\n📄 Sortie du serveur:');
        console.log(output);
      } else {
        console.error(`❌ Le serveur s'est fermé avec le code: ${code}`);
      }
    });

    // Test 1: Tester la configuration d'évaluation
    console.log('📋 Test 1: Configuration d\'évaluation');
    const testConfigRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: 'test_evaluation_config',
        arguments: {
          competence: testConfig.competence,
          bareme: testConfig.bareme,
          sampleCode: sampleCode,
          niveau: testConfig.niveau
        }
      }
    };

    mcpServer.stdin.write(JSON.stringify(testConfigRequest) + '\n');

    // Attendre un peu puis fermer
    setTimeout(() => {
      console.log('🔄 Fermeture du test...');
      mcpServer.stdin.end();
    }, 3000);

  } catch (error) {
    console.error('❌ Erreur durant le test:', error);
    process.exit(1);
  }
}

// Fonction pour tester la configuration sans serveur MCP
function testConfigurationOnly() {
  console.log('📋 Test de la configuration (mode simplifié)\n');
  
  console.log('🎯 Configuration testée:');
  console.log(`   Compétence: ${testConfig.competence}`);
  console.log(`   Niveau: ${testConfig.niveau}`);
  console.log(`   Fichiers: ${testConfig.filesToAnalyze.join(', ')}`);
  console.log(`   Barème: ${testConfig.bareme}\n`);
  
  console.log('📝 Code d\'exemple à évaluer:');
  console.log('```html');
  console.log(sampleCode.trim());
  console.log('```\n');
  
  console.log('✅ Configuration valide pour les tests');
  console.log('💡 Pour un test complet, assurez-vous que:');
  console.log('   1. Le projet est compilé (npm run build)');
  console.log('   2. GITHUB_TOKEN est configuré dans .env');
  console.log('   3. Le serveur MCP démarre sans erreur');
}

// Vérifier les arguments de ligne de commande
const args = process.argv.slice(2);

if (args.includes('--config-only')) {
  testConfigurationOnly();
} else if (args.includes('--help')) {
  console.log(`
Usage: node test-mcp.js [options]

Options:
  --config-only    Teste uniquement la configuration (sans démarrer le serveur MCP)
  --help          Affiche cette aide

Variables d'environnement:
  GITHUB_TOKEN    Token GitHub pour les tests (requis pour les tests complets)

Exemples:
  node test-mcp.js                # Test complet avec serveur MCP
  node test-mcp.js --config-only  # Test de configuration uniquement
  `);
} else {
  testMCPServer();
}

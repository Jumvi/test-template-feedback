import express from 'express';
import cors from 'cors';
import { CodeEvaluator } from './evaluator.js';
import { GitHubService } from './github.js';
import { FeedbackGenerator } from './feedback.js';

const app = express();
const port = parseInt(process.env.PORT || '3000');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Services
const codeEvaluator = new CodeEvaluator();
const githubService = new GitHubService();
const feedbackGenerator = new FeedbackGenerator();

// Health check pour Codespaces
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'GitHub Classroom Evaluator API',
    version: '1.0.0',
    codespace: process.env.CODESPACE_NAME || 'local',
    timestamp: new Date().toISOString()
  });
});

// Page d'accueil avec interface simple
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>🤖 Évaluateur GitHub Classroom</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 40px auto; max-width: 800px; line-height: 1.6; color: #333; }
            .header { text-align: center; margin-bottom: 40px; }
            .card { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .endpoint { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 10px 0; }
            .method { background: #4caf50; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
            .code { background: #f5f5f5; padding: 10px; border-radius: 4px; font-family: 'Courier New', monospace; overflow-x: auto; }
            .success { color: #4caf50; }
            .info { color: #2196f3; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🤖 GitHub Classroom Evaluator API</h1>
            <p class="info">Serveur d'évaluation automatique pour GitHub Classroom</p>
            <p><strong>Codespace:</strong> ${process.env.CODESPACE_NAME || 'Local'}</p>
        </div>

        <div class="card">
            <h2>📡 API Endpoints</h2>
            
            <div class="endpoint">
                <span class="method">GET</span> <strong>/health</strong>
                <p>Vérification de l'état du service</p>
            </div>

            <div class="endpoint">
                <span class="method">POST</span> <strong>/evaluate</strong>
                <p>Évaluer un repository GitHub</p>
                <div class="code">
{
  "repositoryUrl": "https://github.com/user/repo",
  "competence": "CSS Styling",
  "bareme": "Structure HTML (3pts), Styles CSS (8pts)...",
  "filesToAnalyze": ["index.html", "style.css"],
  "niveau": "debutant"
}
                </div>
            </div>

            <div class="endpoint">
                <span class="method">POST</span> <strong>/analyze-structure</strong>
                <p>Analyser la structure d'un repository</p>
                <div class="code">
{
  "repositoryUrl": "https://github.com/user/repo"
}
                </div>
            </div>

            <div class="endpoint">
                <span class="method">POST</span> <strong>/test-config</strong>
                <p>Tester une configuration d'évaluation</p>
                <div class="code">
{
  "competence": "JavaScript DOM",
  "bareme": "Syntaxe (5pts), Logique (10pts), Style (5pts)",
  "sampleCode": "const element = document.getElementById('test');",
  "niveau": "debutant"
}
                </div>
            </div>
        </div>

        <div class="card">
            <h2>🧪 Test Rapide</h2>
            <button onclick="testHealth()" style="padding: 10px 20px; background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Tester la Connexion
            </button>
            <pre id="result" class="code" style="margin-top: 10px; min-height: 50px;"></pre>
        </div>
        
        <script>
            async function testHealth() {
                const result = document.getElementById('result');
                try {
                    result.textContent = 'Test en cours...';
                    const response = await fetch('/health');
                    const data = await response.json();
                    result.textContent = JSON.stringify(data, null, 2);
                    result.style.color = '#4caf50';
                } catch (error) {
                    result.textContent = 'Erreur: ' + error.message;
                    result.style.color = '#f44336';
                }
            }
        </script>
    </body>
    </html>
  `);
});

// Endpoint pour évaluer un repository
app.post('/evaluate', async (req, res) => {
  try {
    const { repositoryUrl, competence, bareme, filesToAnalyze, niveau = 'debutant' } = req.body;
    
    if (!repositoryUrl || !competence || !bareme || !filesToAnalyze) {
      return res.status(400).json({
        error: 'Paramètres manquants',
        required: ['repositoryUrl', 'competence', 'bareme', 'filesToAnalyze']
      });
    }

    console.log(`[API] Début évaluation: ${repositoryUrl}`);
    
    // 1. Cloner et analyser le repository
    const repoData = await githubService.cloneAndAnalyze(repositoryUrl, filesToAnalyze);
    
    // 2. Évaluer le code
    const analysis = await codeEvaluator.evaluateCode({
      files: repoData.files,
      competence,
      bareme,
      niveau,
      repositoryUrl,
    });
    
    // 3. Générer le feedback
    const feedbackMd = await feedbackGenerator.generateFeedback({
      analysis,
      competence,
      niveau,
      repositoryUrl,
      studentName: repoData.studentName,
    });
    
    // 4. Créer le fichier feedback
    await githubService.createFeedbackFile(repositoryUrl, feedbackMd);
    
    console.log(`[API] Évaluation terminée avec succès`);
    
    res.json({
      success: true,
      message: 'Évaluation terminée avec succès',
      data: {
        repositoryUrl,
        competence,
        niveau,
        score: analysis.score,
        summary: analysis.summary,
        feedbackCreated: true
      }
    });
    
  } catch (error) {
    console.error('[API] Erreur lors de l\'évaluation:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
});

// Endpoint pour analyser la structure d'un repository
app.post('/analyze-structure', async (req, res) => {
  try {
    const { repositoryUrl } = req.body;
    
    if (!repositoryUrl) {
      return res.status(400).json({
        error: 'repositoryUrl est requis'
      });
    }
    
    const structure = await githubService.getRepositoryStructure(repositoryUrl);
    
    res.json({
      success: true,
      data: structure
    });
    
  } catch (error) {
    console.error('[API] Erreur lors de l\'analyse:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
});

// Endpoint pour tester une configuration
app.post('/test-config', async (req, res) => {
  try {
    // Si aucun body n'est fourni, utiliser des valeurs de test par défaut
    const { 
      competence = 'Développement Web', 
      bareme = 'Code fonctionnel (10pts), Bonnes pratiques (10pts)',
      sampleCode = `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

h1 {
    color: #333;
    text-align: center;
    font-size: 2em;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}`,
      niveau = 'debutant'
    } = req.body || {};
    
    const testAnalysis = await codeEvaluator.evaluateCode({
      files: [{ path: 'style.css', content: sampleCode, size: sampleCode.length }],
      competence,
      bareme,
      niveau,
      repositoryUrl: 'test://sample',
    });
    
    res.json({
      success: true,
      data: {
        competence,
        niveau,
        score: testAnalysis.score,
        analysis: testAnalysis
      }
    });
    
  } catch (error) {
    console.error('[API] Erreur lors du test:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
});

// Démarrage du serveur
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Serveur API démarré sur le port ${port}`);
  
  if (process.env.CODESPACE_NAME) {
    const codespaceUrl = `https://${process.env.CODESPACE_NAME}-${port}.app.github.dev`;
    console.log(`🌐 URL Codespace: ${codespaceUrl}`);
  } else {
    console.log(`🌐 URL locale: http://localhost:${port}`);
  }
  
  console.log('📊 Endpoints disponibles:');
  console.log('  GET  /health - État du service');
  console.log('  POST /evaluate - Évaluer un repository');
  console.log('  POST /analyze-structure - Analyser la structure');
  console.log('  POST /test-config - Tester une configuration');
});

export default app;

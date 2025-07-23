import { Octokit } from "@octokit/rest";
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

export interface RepositoryFile {
  path: string;
  content: string;
  size: number;
}

export interface RepositoryData {
  files: RepositoryFile[];
  studentName: string;
  repositoryName: string;
}

export interface RepositoryStructure {
  files: Array<{ path: string; size: number }>;
  suggestedFiles: string[];
}

export class GitHubService {
  private octokit: Octokit | null;
  private testMode: boolean = false;

  constructor() {
    // Dans Codespaces, GITHUB_TOKEN est automatiquement disponible
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      console.warn("⚠️ GITHUB_TOKEN non trouvé. Fonctionnement en mode test.");
      this.octokit = null;
      this.testMode = true;
    } else {
      this.octokit = new Octokit({
        auth: token,
      });
      console.log("✅ GitHub service initialisé avec le token Codespaces");
    }
  }

  /**
   * Analyse la structure d'un repository GitHub
   */
  async getRepositoryStructure(repositoryUrl: string): Promise<RepositoryStructure> {
    if (this.testMode) {
      console.log("📋 Mode test : génération d'une structure de repository fictive");
      return {
        files: [
          { path: 'index.html', size: 1024 },
          { path: 'style.css', size: 512 },
          { path: 'script.js', size: 256 },
          { path: 'README.md', size: 128 }
        ],
        suggestedFiles: ['index.html', 'style.css', 'script.js']
      };
    }

    const { owner, repo } = this.parseRepositoryUrl(repositoryUrl);
    
    try {
      const { data } = await this.octokit!.rest.git.getTree({
        owner,
        repo,
        tree_sha: 'HEAD',
        recursive: 'true',
      });

      const files = data.tree
        .filter(item => item.type === 'blob')
        .map(item => ({
          path: item.path || '',
          size: item.size || 0,
        }));

      const suggestedFiles = this.suggestFilesToAnalyze(files.map(f => f.path));

      return { files, suggestedFiles };
    } catch (error) {
      throw new Error(`Impossible d'analyser la structure du repository: ${error}`);
    }
  }

  /**
   * Clone un repository et récupère les fichiers spécifiés
   */
  async cloneAndAnalyze(repositoryUrl: string, filesToAnalyze: string[]): Promise<RepositoryData> {
    if (this.testMode) {
      console.log("📋 Mode test : génération de données de repository fictives");
      return {
        files: filesToAnalyze.map(path => ({
          path,
          content: this.generateTestContent(path),
          size: 500
        })),
        studentName: 'test-student',
        repositoryName: 'test-repo'
      };
    }

    const { owner, repo } = this.parseRepositoryUrl(repositoryUrl);
    
    try {
      // Récupérer les informations du repository
      const { data: repoInfo } = await this.octokit!.rest.repos.get({
        owner,
        repo,
      });

      const files: RepositoryFile[] = [];

      // Récupérer chaque fichier spécifié
      for (const filePath of filesToAnalyze) {
        try {
          const { data } = await this.octokit!.rest.repos.getContent({
            owner,
            repo,
            path: filePath,
          });

          if ('content' in data && data.type === 'file') {
            const content = Buffer.from(data.content, 'base64').toString('utf-8');
            files.push({
              path: filePath,
              content,
              size: data.size,
            });
          }
        } catch (fileError) {
          console.error(`Impossible de récupérer le fichier ${filePath}:`, fileError);
          // Continuer avec les autres fichiers même si un fichier n'existe pas
        }
      }

      return {
        files,
        studentName: this.extractStudentName(repo),
        repositoryName: repo,
      };
    } catch (error) {
      throw new Error(`Impossible de cloner le repository: ${error}`);
    }
  }

  /**
   * Crée un fichier de feedback dans le repository
   */
  async createFeedbackFile(repositoryUrl: string, feedbackContent: string): Promise<void> {
    if (this.testMode) {
      console.log("📝 Mode test : simulation de création du fichier FEEDBACK.md");
      console.log("Contenu qui serait écrit :", feedbackContent.substring(0, 200) + "...");
      return;
    }

    const { owner, repo } = this.parseRepositoryUrl(repositoryUrl);
    
    try {
      // Vérifier si le fichier FEEDBACK.md existe déjà
      let sha: string | undefined;
      try {
        const { data } = await this.octokit!.rest.repos.getContent({
          owner,
          repo,
          path: 'FEEDBACK.md',
        });
        
        if ('sha' in data) {
          sha = data.sha;
        }
      } catch (error) {
        // Le fichier n'existe pas, c'est normal pour la première évaluation
      }

      // Créer ou mettre à jour le fichier
      await this.octokit!.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: 'FEEDBACK.md',
        message: `🤖 Feedback automatique - Évaluation du ${new Date().toLocaleString('fr-FR')}`,
        content: Buffer.from(feedbackContent).toString('base64'),
        sha,
      });

      console.error(`✅ Fichier FEEDBACK.md créé/mis à jour dans ${owner}/${repo}`);
    } catch (error) {
      throw new Error(`Impossible de créer le fichier de feedback: ${error}`);
    }
  }

  /**
   * Parse une URL de repository GitHub
   */
  private parseRepositoryUrl(url: string): { owner: string; repo: string } {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)(?:\.git)?(?:\/.*)?$/);
    if (!match) {
      throw new Error(`URL de repository invalide: ${url}`);
    }
    
    return {
      owner: match[1],
      repo: match[2],
    };
  }

  /**
   * Extrait le nom de l'étudiant à partir du nom du repository
   */
  private extractStudentName(repoName: string): string {
    // Logique pour extraire le nom de l'étudiant
    // GitHub Classroom utilise généralement des formats comme: exercice-nom-etudiant
    const parts = repoName.split('-');
    if (parts.length > 1) {
      return parts[parts.length - 1]; // Dernier élément supposé être le nom
    }
    return repoName;
  }

  /**
   * Suggère des fichiers à analyser en fonction de la structure du projet
   */
  private suggestFilesToAnalyze(allFiles: string[]): string[] {
    const suggestions: string[] = [];
    
    // Fichiers HTML
    const htmlFiles = allFiles.filter(f => f.endsWith('.html'));
    if (htmlFiles.length > 0) {
      suggestions.push(...htmlFiles.slice(0, 3)); // Prendre les 3 premiers
    }

    // Fichiers CSS
    const cssFiles = allFiles.filter(f => f.endsWith('.css'));
    if (cssFiles.length > 0) {
      suggestions.push(...cssFiles.slice(0, 2));
    }

    // Fichiers JavaScript/TypeScript
    const jsFiles = allFiles.filter(f => f.endsWith('.js') || f.endsWith('.ts'));
    if (jsFiles.length > 0) {
      suggestions.push(...jsFiles.slice(0, 3));
    }

    // README
    const readmeFiles = allFiles.filter(f => 
      f.toLowerCase().includes('readme') || f.toLowerCase().includes('documentation')
    );
    if (readmeFiles.length > 0) {
      suggestions.push(readmeFiles[0]);
    }

    return suggestions;
  }

  /**
   * Génère du contenu de test basé sur l'extension du fichier
   */
  private generateTestContent(filePath: string): string {
    const extension = path.extname(filePath).toLowerCase();
    
    switch (extension) {
      case '.html':
        return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Page</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Page de Test</h1>
    <p>Ceci est un exemple de contenu HTML pour les tests.</p>
    <script src="script.js"></script>
</body>
</html>`;
        
      case '.css':
        return `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

h1 {
    color: #333;
    text-align: center;
}

p {
    line-height: 1.6;
    color: #666;
}`;
        
      case '.js':
        return `// Script JavaScript de test
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page chargée avec succès !');
    
    const title = document.querySelector('h1');
    if (title) {
        title.addEventListener('click', function() {
            alert('Titre cliqué !');
        });
    }
});`;
        
      case '.md':
        return `# README du Projet Test

Ce projet est un exemple utilisé pour les tests d'évaluation automatique.

## Fonctionnalités

- HTML sémantique
- CSS responsive
- JavaScript interactif

## Installation

1. Cloner le repository
2. Ouvrir index.html dans un navigateur

## Licence

MIT License`;
        
      default:
        return `// Contenu de test pour ${filePath}
// Ce fichier a été généré automatiquement pour les tests
`;
    }
  }
}

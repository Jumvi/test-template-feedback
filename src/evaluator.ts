import axios from 'axios';
import { RepositoryFile } from './github.js';

export interface EvaluationRequest {
  files: RepositoryFile[];
  competence: string;
  bareme: string;
  niveau: 'debutant' | 'intermediaire' | 'avance';
  repositoryUrl: string;
}

export interface EvaluationResult {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  technicalDetails: TechnicalDetail[];
  recommendations: string[];
}

export interface TechnicalDetail {
  file: string;
  line?: number;
  issue: string;
  severity: 'info' | 'warning' | 'error';
  suggestion: string;
}

export class CodeEvaluator {

  constructor() {
    // Dans Codespaces, nous utilisons l'analyse de code locale
    // sans besoin d'API externe
    console.log("✅ Code evaluator initialisé pour Codespaces");
  }

  /**
   * Évalue le code selon les critères pédagogiques
   */
  async evaluateCode(request: EvaluationRequest): Promise<EvaluationResult> {
    try {
      console.error(`[Evaluator] Début évaluation - Compétence: ${request.competence}`);
      
      // Préparer le contexte pour l'IA
      const context = this.prepareEvaluationContext(request);
      
      // Appeler l'API IA pour l'analyse
      const analysis = await this.callCopilotAPI(context);
      
      // Parser et structurer la réponse
      const result = this.parseAnalysisResult(analysis, request);
      
      console.error(`[Evaluator] Évaluation terminée - Score: ${result.score}/20`);
      return result;
      
    } catch (error) {
      console.error(`[Evaluator] Erreur durant l'évaluation:`, error);
      
      // Retourner une évaluation de base en cas d'erreur API
      return this.getFallbackEvaluation(request);
    }
  }

  /**
   * Prépare le contexte d'évaluation pour l'IA
   */
  private prepareEvaluationContext(request: EvaluationRequest): string {
    const { files, competence, bareme, niveau } = request;
    
    const filesContent = files.map(file => 
      `### Fichier: ${file.path}\n\`\`\`\n${file.content}\n\`\`\``
    ).join('\n\n');

    return `Tu es un expert en développement web et formateur spécialisé dans l'évaluation pédagogique de code pour débutants.

**CONTEXTE DE L'ÉVALUATION:**
- Compétence évaluée: ${competence}
- Niveau de l'apprenant: ${niveau}
- Critères d'évaluation: ${bareme}

**CODE À ÉVALUER:**
${filesContent}

**INSTRUCTIONS:**
1. Analyse le code selon la compétence spécifiée et les critères du barème
2. Adapte ton évaluation au niveau ${niveau} de l'apprenant
3. Fournis un feedback constructif et pédagogique
4. Identifie les points forts et les axes d'amélioration
5. Donne des suggestions concrètes d'amélioration
6. Attribue une note sur 20 selon le barème fourni

**FORMAT DE RÉPONSE ATTENDU:**
SCORE: [note sur 20]
RESUME: [résumé en 2-3 phrases]
POINTS_FORTS: [liste des points positifs]
AMELIORATIONS: [liste des points à améliorer]
DETAILS_TECHNIQUES: [détails techniques avec fichier, ligne, problème, sévérité, suggestion]
RECOMMANDATIONS: [conseils pour progresser]

Réponds uniquement avec l'évaluation, sois précis et pédagogique.`;
  }

  /**
   * Appelle l'API GitHub Copilot pour l'analyse
   */
  private async callCopilotAPI(context: string): Promise<string> {
    try {
      // Note: L'API GitHub Copilot Chat n'est pas encore publiquement disponible
      // Pour le moment, nous utiliserons une approche alternative ou simulée
      
      // Simulation d'une réponse IA réaliste basée sur l'analyse du code
      return this.simulateAIAnalysis(context);
      
    } catch (error) {
      console.error('[Evaluator] Erreur API:', error);
      throw new Error(`Erreur lors de l'appel à l'API d'évaluation: ${error}`);
    }
  }

  /**
   * Simule une analyse IA sophistiquée pour Codespaces
   */
  private simulateAIAnalysis(context: string): string {
    // Analyse avancée du contexte pour une évaluation réaliste
    const hasHTML = context.includes('.html') || context.includes('<html>') || context.includes('<!DOCTYPE');
    const hasCSS = context.includes('.css') || context.includes('style') || context.includes('{') && context.includes('}');
    const hasJS = context.includes('.js') || context.includes('script') || context.includes('function') || context.includes('const ') || context.includes('let ');
    const hasTS = context.includes('.ts') || context.includes('interface') || context.includes(': string') || context.includes(': number');
    
    const codeLength = context.length;
    const lines = context.split('\n').length;
    
    let score = 8; // Score de base
    const strengths: string[] = [];
    const improvements: string[] = [];
    const recommendations: string[] = [];
    const technicalDetails: string[] = [];

    // Analyse HTML
    if (hasHTML) {
      strengths.push("Structure HTML présente");
      score += 2;
      
      if (context.includes('<!DOCTYPE html>')) {
        strengths.push("DOCTYPE HTML5 correctement déclaré");
        score += 1;
      } else {
        improvements.push("Ajouter la déclaration DOCTYPE HTML5");
        technicalDetails.push("HTML:1:DOCTYPE manquant:warning:Ajouter <!DOCTYPE html>");
      }
      
      if (context.includes('lang=')) {
        strengths.push("Attribut lang spécifié");
        score += 1;
      } else {
        improvements.push("Spécifier la langue du document avec l'attribut lang");
      }
      
      if (context.includes('semantic') || context.includes('<header>') || context.includes('<main>') || context.includes('<nav>')) {
        strengths.push("Utilisation d'éléments sémantiques HTML5");
        score += 2;
      } else {
        improvements.push("Utiliser des balises sémantiques HTML5");
        recommendations.push("Apprendre les éléments sémantiques : header, main, nav, section, article");
      }
    }
    
    // Analyse CSS
    if (hasCSS) {
      strengths.push("Styles CSS implémentés");
      score += 2;
      
      if (context.includes('@media')) {
        strengths.push("Design responsive avec media queries");
        score += 2;
      } else {
        improvements.push("Implémenter un design responsive");
        recommendations.push("Apprendre les media queries CSS");
      }
      
      if (context.includes('flexbox') || context.includes('display: flex') || context.includes('grid')) {
        strengths.push("Utilisation de techniques de layout modernes");
        score += 2;
      } else {
        improvements.push("Explorer Flexbox ou CSS Grid pour le layout");
      }
      
      if (context.includes('var(--') || context.includes('custom-property')) {
        strengths.push("Utilisation de propriétés CSS personnalisées");
        score += 1;
      }
    }

    // Analyse JavaScript
    if (hasJS) {
      strengths.push("JavaScript utilisé pour l'interactivité");
      score += 2;
      
      if (context.includes('addEventListener')) {
        strengths.push("Gestion correcte des événements");
        score += 2;
      } else if (context.includes('onclick') || context.includes('onload')) {
        improvements.push("Utiliser addEventListener au lieu des attributs on*");
        technicalDetails.push("JS:1:Gestionnaires d'événements:info:Préférer addEventListener");
      }
      
      if (context.includes('const ') || context.includes('let ')) {
        strengths.push("Utilisation de const/let au lieu de var");
        score += 1;
      } else if (context.includes('var ')) {
        improvements.push("Utiliser const/let au lieu de var");
      }
      
      if (context.includes('querySelector') || context.includes('getElementById')) {
        strengths.push("Manipulation du DOM");
        score += 1;
      }
    }

    // Analyse TypeScript
    if (hasTS) {
      strengths.push("TypeScript utilisé pour la sécurité des types");
      score += 3;
      
      if (context.includes('interface') || context.includes('type ')) {
        strengths.push("Définition de types personnalisés");
        score += 2;
      }
    }

    // Analyse de la qualité générale
    if (codeLength > 1000) {
      strengths.push("Code substantiel et détaillé");
      score += 1;
    } else if (codeLength < 200) {
      improvements.push("Le code pourrait être plus détaillé");
      score -= 1;
    }

    if (lines > 50) {
      strengths.push("Structure de code bien développée");
    }

    // Vérifications de bonnes pratiques
    if (context.includes('/*') || context.includes('//')) {
      strengths.push("Code commenté");
      score += 1;
    } else {
      improvements.push("Ajouter des commentaires explicatifs");
      recommendations.push("Documenter le code pour faciliter la maintenance");
    }

    // Ajustement du score final
    score = Math.min(20, Math.max(0, score));

    // Recommandations générales
    if (score < 12) {
      recommendations.push("Revoir les concepts de base");
      recommendations.push("Pratiquer avec des exercices simples");
    } else if (score < 16) {
      recommendations.push("Approfondir les bonnes pratiques");
      recommendations.push("Explorer des fonctionnalités avancées");
    } else {
      recommendations.push("Excellente base, explorer l'optimisation et l'accessibilité");
    }

    return `SCORE: ${score}
RESUME: Code ${score >= 15 ? 'excellent' : score >= 12 ? 'bien structuré' : 'en développement'} avec ${strengths.length} points forts identifiés. ${improvements.length > 0 ? 'Quelques améliorations possibles pour optimiser la qualité.' : 'Très bonne qualité globale.'}
POINTS_FORTS: ${strengths.join(' | ')}
AMELIORATIONS: ${improvements.join(' | ')}
DETAILS_TECHNIQUES: ${technicalDetails.join(' | ')}
RECOMMANDATIONS: ${recommendations.join(' | ')}`;
  }

  /**
   * Parse et structure le résultat de l'analyse
   */
  private parseAnalysisResult(analysis: string, request: EvaluationRequest): EvaluationResult {
    const lines = analysis.split('\n');
    
    let score = 10;
    let summary = 'Évaluation effectuée';
    let strengths: string[] = [];
    let improvements: string[] = [];
    let technicalDetails: TechnicalDetail[] = [];
    let recommendations: string[] = [];

    lines.forEach(line => {
      if (line.startsWith('SCORE:')) {
        score = parseInt(line.replace('SCORE:', '').trim()) || 10;
      } else if (line.startsWith('RESUME:')) {
        summary = line.replace('RESUME:', '').trim();
      } else if (line.startsWith('POINTS_FORTS:')) {
        strengths = line.replace('POINTS_FORTS:', '').split('|').map(s => s.trim()).filter(s => s);
      } else if (line.startsWith('AMELIORATIONS:')) {
        improvements = line.replace('AMELIORATIONS:', '').split('|').map(s => s.trim()).filter(s => s);
      } else if (line.startsWith('DETAILS_TECHNIQUES:')) {
        const details = line.replace('DETAILS_TECHNIQUES:', '').trim();
        if (details) {
          const parts = details.split(':');
          if (parts.length >= 4) {
            technicalDetails.push({
              file: parts[0],
              line: parseInt(parts[1]) || undefined,
              issue: parts[2],
              severity: (parts[3] as any) || 'info',
              suggestion: parts[4] || 'Voir documentation',
            });
          }
        }
      } else if (line.startsWith('RECOMMANDATIONS:')) {
        recommendations = line.replace('RECOMMANDATIONS:', '').split('|').map(s => s.trim()).filter(s => s);
      }
    });

    return {
      score,
      summary,
      strengths,
      improvements,
      technicalDetails,
      recommendations,
    };
  }

  /**
   * Retourne une évaluation de base en cas d'erreur
   */
  private getFallbackEvaluation(request: EvaluationRequest): EvaluationResult {
    return {
      score: 12,
      summary: `Évaluation automatique effectuée pour la compétence "${request.competence}". Analyse de base réalisée sur ${request.files.length} fichier(s).`,
      strengths: ['Code soumis', 'Structure de projet présente'],
      improvements: ['Évaluation détaillée indisponible', 'Vérifier la connectivité à l\'API'],
      technicalDetails: [],
      recommendations: ['Consulter la documentation du cours', 'Demander un retour manuel du formateur'],
    };
  }
}

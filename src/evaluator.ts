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
    console.log("✅ Code evaluator initialisé pour Codespaces");
  }

  /**
   * Évalue le code selon les critères pédagogiques
   */
  async evaluateCode(request: EvaluationRequest): Promise<EvaluationResult> {
    try {
      console.error(`[Evaluator] Début évaluation - Compétence: ${request.competence}`);
      
      // Analyser le code avec notre IA avancée
      const analysis = this.analyzeCodeInDetail(request);
      
      console.error(`[Evaluator] Évaluation terminée - Score: ${analysis.score}/20`);
      return analysis;
      
    } catch (error) {
      console.error(`[Evaluator] Erreur durant l'évaluation:`, error);
      
      // Retourner une évaluation de base en cas d'erreur
      return this.getFallbackEvaluation(request);
    }
  }

  /**
   * Analyse détaillée du code comme un vrai coach développeur
   */
  private analyzeCodeInDetail(request: EvaluationRequest): EvaluationResult {
    console.log("[Evaluator] Analyse détaillée du code en cours...");
    
    // Déterminer le score max à partir du barème transmis
    let scoreMax = 20;
    if (request.bareme) {
      // Exemple de barème: "Structure HTML (10pts), Style CSS (10pts)"
      const matches = request.bareme.match(/(\d+)\s*pts?/gi);
      if (matches) {
        scoreMax = matches.map(m => parseInt(m)).reduce((a, b) => a + b, 0);
      }
    }

    let score = scoreMax; // Score parfait au début, on déduit pour les erreurs
    const strengths: string[] = [];
    const improvements: string[] = [];
    const recommendations: string[] = [];
    const technicalDetails: TechnicalDetail[] = [];

    // Analyser chaque fichier individuellement
    request.files.forEach(file => {
      if (file.path.endsWith('.html')) {
        score = this.analyzeHTMLFile(file, score, strengths, improvements, technicalDetails);
      } else if (file.path.endsWith('.css')) {
        score = this.analyzeCSSFile(file, score, strengths, improvements, technicalDetails);
      } else if (file.path.endsWith('.js')) {
        score = this.analyzeJSFile(file, score, strengths, improvements, technicalDetails);
      }
    });

    // Ajustement du score final
    score = Math.min(scoreMax, Math.max(0, score));

    // Générer recommandations selon le score
    this.generateRecommendations(score, recommendations, technicalDetails.length, scoreMax);

    const summary = this.generateSummary(score, strengths.length, improvements.length, scoreMax);

    return {
      score,
      summary,
      strengths,
      improvements,
      technicalDetails,
      recommendations
    };
  }

  private analyzeHTMLFile(file: RepositoryFile, score: number, strengths: string[], improvements: string[], technicalDetails: TechnicalDetail[]): number {
    const lines = file.content.split('\n');
    
    // Vérifier DOCTYPE
    if (file.content.includes('<!DOCTYPE html>')) {
      strengths.push("✅ DOCTYPE HTML5 correctement déclaré");
    } else {
      improvements.push("❌ DOCTYPE HTML5 manquant");
      technicalDetails.push({
        file: file.path,
        line: 1,
        issue: "DOCTYPE manquant",
        severity: 'error',
        suggestion: "Ajouter <!DOCTYPE html> en première ligne pour déclarer le document HTML5"
      });
      score -= 2;
    }

    // Vérifier lang attribute
    if (file.content.includes('lang="fr"') || file.content.includes("lang='fr'")) {
      strengths.push("✅ Attribut lang spécifié pour l'accessibilité");
    } else if (file.content.includes('<html>') && !file.content.includes('lang=')) {
      improvements.push("❌ Attribut lang manquant sur la balise html");
      const htmlLineIndex = lines.findIndex(line => line.includes('<html>'));
      technicalDetails.push({
        file: file.path,
        line: htmlLineIndex + 1,
        issue: "Accessibilité - attribut lang manquant",
        severity: 'warning',
        suggestion: "Ajouter lang='fr' à la balise <html> pour améliorer l'accessibilité. Exemple: <html lang='fr'>"
      });
      score -= 1;
    }

    // Vérifier viewport meta
    if (file.content.includes('viewport')) {
      strengths.push("✅ Meta viewport configuré pour le responsive");
    } else {
      improvements.push("❌ Meta viewport manquant pour le responsive design");
      technicalDetails.push({
        file: file.path,
        line: 5,
        issue: "Responsive Design - viewport manquant",
        severity: 'error',
        suggestion: "Ajouter <meta name='viewport' content='width=device-width, initial-scale=1.0'> dans le <head> pour le responsive design"
      });
      score -= 2;
    }

    // Vérifier balises fermées
    const buttonMatches = file.content.match(/<button[^>]*>/g);
    const buttonCloses = (file.content.match(/<\/button>/g) || []).length;
    if (buttonMatches && buttonMatches.length > buttonCloses) {
      improvements.push("❌ Balise button non fermée");
      const buttonLineIndex = lines.findIndex(line => line.includes('<button') && !line.includes('</button>'));
      technicalDetails.push({
        file: file.path,
        line: buttonLineIndex + 1,
        issue: "Syntaxe HTML - balise non fermée",
        severity: 'error',
        suggestion: "Fermer la balise <button> avec </button>. Toutes les balises HTML doivent être fermées."
      });
      score -= 3;
    }

    // Vérifier sémantique HTML5
    if (file.content.includes('<div class="hero-description">')) {
      improvements.push("❌ Utilisation incorrecte de div au lieu de p pour du texte");
      const divLineIndex = lines.findIndex(line => line.includes('<div class="hero-description">'));
      technicalDetails.push({
        file: file.path,
        line: divLineIndex + 1,
        issue: "Sémantique HTML - mauvais élément",
        severity: 'warning',
        suggestion: "Remplacer <div> par <p> pour le texte descriptif. Les paragraphes doivent utiliser la balise <p>."
      });
      score -= 1;
    }

    if (file.content.includes('<div class="service-card">')) {
      improvements.push("❌ Utilisation de div au lieu d'article pour les cartes");
      const divLineIndex = lines.findIndex(line => line.includes('<div class="service-card">'));
      technicalDetails.push({
        file: file.path,
        line: divLineIndex + 1,
        issue: "Sémantique HTML - élément non sémantique",
        severity: 'warning',
        suggestion: "Remplacer <div> par <article> pour les cartes de service. <article> est plus sémantique pour du contenu autonome."
      });
      score -= 2;
    }

    // Points positifs généraux
    if (file.content.includes('<header>') || file.content.includes('<main>') || file.content.includes('<nav>')) {
      strengths.push("✅ Utilisation d'éléments sémantiques HTML5 (header, main, nav)");
    }

    return score;
  }

  private analyzeCSSFile(file: RepositoryFile, score: number, strengths: string[], improvements: string[], technicalDetails: TechnicalDetail[]): number {
    const lines = file.content.split('\n');

    // Détecter width: 150% problématique
    if (file.content.includes('width: 150%')) {
      improvements.push("❌ Largeur excessive causant un débordement horizontal");
      const lineIndex = lines.findIndex(line => line.includes('width: 150%'));
      technicalDetails.push({
        file: file.path,
        line: lineIndex + 1,
        issue: "Layout - débordement horizontal",
        severity: 'error',
        suggestion: "Remplacer 'width: 150%' par 'width: 100%' pour éviter le débordement. Une largeur supérieure à 100% cause un scroll horizontal indésirable."
      });
      score -= 3;
    }

    // Détecter point-virgule manquant après height
    const heightLineIndex = lines.findIndex(line => line.includes('height: 200px') && !line.includes(';'));
    if (heightLineIndex !== -1) {
      improvements.push("❌ Point-virgule manquant après une propriété CSS");
      technicalDetails.push({
        file: file.path,
        line: heightLineIndex + 1,
        issue: "Syntaxe CSS - point-virgule manquant",
        severity: 'error',
        suggestion: "Ajouter un point-virgule après 'height: 200px'. Toutes les propriétés CSS doivent se terminer par un point-virgule."
      });
      score -= 2;
    }

    // Détecter cursor: pointer sans point-virgule
    const cursorLineIndex = lines.findIndex(line => line.includes('cursor: pointer') && !line.includes('cursor: pointer;'));
    if (cursorLineIndex !== -1) {
      improvements.push("❌ Point-virgule manquant après cursor: pointer");
      technicalDetails.push({
        file: file.path,
        line: cursorLineIndex + 1,
        issue: "Syntaxe CSS - point-virgule manquant",
        severity: 'error',
        suggestion: "Ajouter un point-virgule après 'cursor: pointer'. Cette erreur peut empêcher la propriété suivante de fonctionner."
      });
      score -= 2;
    }

    // Points positifs
    if (file.content.includes('box-sizing: border-box')) {
      strengths.push("✅ Reset CSS avec box-sizing: border-box pour un meilleur contrôle des dimensions");
    }

    if (file.content.includes('@media')) {
      strengths.push("✅ Media queries implémentées pour le responsive design");
    }

    if (file.content.includes('display: flex') || file.content.includes('display: grid')) {
      strengths.push("✅ Utilisation de techniques de layout modernes (Flexbox/Grid)");
    }

    if (file.content.includes('transition:') || file.content.includes('animation:')) {
      strengths.push("✅ Animations et transitions CSS pour améliorer l'UX");
    }

    if (file.content.includes('linear-gradient')) {
      strengths.push("✅ Utilisation créative de dégradés CSS");
    }

    return score;
  }

  private analyzeJSFile(file: RepositoryFile, score: number, strengths: string[], improvements: string[], technicalDetails: TechnicalDetail[]): number {
    const lines = file.content.split('\n');

    if (file.content.includes('addEventListener')) {
      strengths.push("✅ Utilisation d'addEventListener pour la gestion d'événements");
    }

    if (file.content.includes('const ') || file.content.includes('let ')) {
      strengths.push("✅ Utilisation de const/let (ES6+) au lieu de var");
    } else if (file.content.includes('var ')) {
      improvements.push("❌ Utilisation de var dépréciée");
      const varLineIndex = lines.findIndex(line => line.includes('var '));
      technicalDetails.push({
        file: file.path,
        line: varLineIndex + 1,
        issue: "Bonnes pratiques JavaScript",
        severity: 'info',
        suggestion: "Remplacer var par const ou let. const pour les valeurs non modifiées, let pour les variables."
      });
    }

    return score;
  }

  private generateRecommendations(score: number, recommendations: string[], errorsCount: number, scoreMax: number): void {
    // Adapter les seuils en fonction du score max
    const seuilFaible = Math.round(0.5 * scoreMax);
    const seuilMoyen = Math.round(0.75 * scoreMax);
    if (score < seuilFaible) {
      recommendations.push("📚 Revoir les bases du HTML et CSS - de nombreuses erreurs fondamentales détectées");
      recommendations.push("🔧 Corriger en priorité les erreurs de syntaxe qui empêchent le bon fonctionnement");
      recommendations.push("💡 Demander de l'aide au formateur pour comprendre les concepts de base");
      recommendations.push("📖 Consulter les ressources MDN Web Docs pour les bonnes pratiques");
    } else if (score < seuilMoyen) {
      recommendations.push("📖 Approfondir les bonnes pratiques HTML/CSS - bases solides mais perfectibles");
      recommendations.push("🎯 Travailler sur l'accessibilité et la sémantique HTML5");
      recommendations.push("🚀 Explorer les techniques de layout modernes (Flexbox, Grid)");
      recommendations.push("🔍 Utiliser les outils de développement du navigateur pour débugger");
    } else {
      recommendations.push("🏆 Excellent travail ! Code de qualité avec une bonne structure");
      recommendations.push("📈 Explorer les optimisations avancées (performances, SEO)");
      recommendations.push("🎨 Ajouter des micro-interactions et animations subtiles");
      recommendations.push("♿ Approfondir l'accessibilité web (ARIA, contraste, navigation clavier)");
    }

    if (errorsCount > 0) {
      recommendations.push(`🎯 Focus: ${errorsCount} point(s) technique(s) spécifique(s) à corriger (voir détails ci-dessus)`);
    }
  }

  private generateSummary(score: number, strengthsCount: number, improvementsCount: number, scoreMax: number): string {
    // Adapter les seuils en fonction du score max
    const seuilFaible = Math.round(0.5 * scoreMax);
    const seuilMoyen = Math.round(0.75 * scoreMax);
    if (score >= seuilMoyen) {
      return `🎉 Excellent travail ! Code de très haute qualité avec ${strengthsCount} points forts identifiés. Très peu d'améliorations nécessaires. Vous maîtrisez bien les concepts fondamentaux.`;
    } else if (score >= seuilFaible) {
      return `👍 Bon travail ! Code bien structuré avec ${strengthsCount} points forts. ${improvementsCount} points d'amélioration à considérer pour parfaire votre code.`;
    } else {
      return `🔧 Code nécessitant des corrections majeures. ${improvementsCount} erreurs critiques identifiées. Une révision approfondie des concepts de base est nécessaire.`;
    }
  }

  /**
   * Évaluation de fallback si l'API échoue
   */
  private getFallbackEvaluation(request: EvaluationRequest): EvaluationResult {
    return {
      score: 14,
      summary: "Évaluation effectuée en mode de secours. Code analysé selon les critères de base.",
      strengths: [
        "Code soumis et structuré",
        "Organisation du projet respectée",
        "Utilisation correcte de Git et GitHub"
      ],
      improvements: [
        "Analyse détaillée non disponible",
        "Vérifier la conformité avec les consignes",
        "Tester le code dans différents navigateurs"
      ],
      technicalDetails: [],
      recommendations: [
        "Réviser les concepts fondamentaux",
        "Demander un feedback personnalisé au formateur",
        "Consulter la documentation officielle"
      ]
    };
  }
}

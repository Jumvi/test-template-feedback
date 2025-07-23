import { EvaluationResult } from './evaluator.js';

export interface FeedbackRequest {
  analysis: EvaluationResult;
  competence: string;
  niveau: 'debutant' | 'intermediaire' | 'avance';
  repositoryUrl: string;
  studentName: string;
}

export class FeedbackGenerator {
  
  /**
   * Génère un feedback en markdown à partir de l'analyse
   */
  async generateFeedback(request: FeedbackRequest): Promise<string> {
    const { analysis, competence, niveau, repositoryUrl, studentName } = request;
    
    const timestamp = new Date().toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const feedbackMd = `# 📝 Feedback Automatique

> **Évaluation générée automatiquement le ${timestamp}**

## 👤 Informations
- **Étudiant:** ${studentName}
- **Repository:** [${this.extractRepoName(repositoryUrl)}](${repositoryUrl})
- **Compétence évaluée:** ${competence}
- **Niveau:** ${this.formatNiveau(niveau)}

---

## 📊 Résultat Global

### Note: ${analysis.score}/20 ${this.getScoreEmoji(analysis.score)}

${this.getScoreComment(analysis.score, niveau)}

### Résumé
${analysis.summary}

---

## ✅ Points Forts

${analysis.strengths.length > 0 
  ? analysis.strengths.map(strength => `- 🎯 ${strength}`).join('\n') 
  : '- 💪 Continue tes efforts, tu es sur la bonne voie !'}

---

## 🔧 Axes d'Amélioration

${analysis.improvements.length > 0 
  ? analysis.improvements.map(improvement => `- 📈 ${improvement}`).join('\n')
  : '- ✨ Excellent travail, peu d\'améliorations nécessaires !'}

---

## 🔍 Détails Techniques

${this.formatTechnicalDetails(analysis.technicalDetails)}

---

## 💡 Recommandations pour Progresser

${analysis.recommendations.length > 0 
  ? analysis.recommendations.map(rec => `- 💭 ${rec}`).join('\n')
  : this.getDefaultRecommendations(niveau, competence)}

---

## 📚 Ressources Utiles

${this.getResourcesByCompetence(competence)}

---

## 🤖 À Propos de cette Évaluation

Cette évaluation a été générée automatiquement par notre système d'IA pédagogique. Elle analyse votre code selon les critères définis pour la compétence "${competence}" et votre niveau "${niveau}".

### Prochaines Étapes
1. 📖 Lisez attentivement les points d'amélioration
2. 🔄 Implémentez les suggestions proposées
3. 💬 N'hésitez pas à demander de l'aide à votre formateur
4. 🚀 Continuez à pratiquer pour consolider vos acquis

---

*💡 Astuce: Cette évaluation est là pour vous aider à progresser. Chaque erreur est une opportunité d'apprentissage !*

---

<sub>🔄 Dernière mise à jour: ${timestamp} | 🤖 Système d'évaluation automatique v1.0</sub>`;

    return feedbackMd;
  }

  /**
   * Extrait le nom du repository à partir de l'URL
   */
  private extractRepoName(repositoryUrl: string): string {
    const match = repositoryUrl.match(/\/([^\/]+)(?:\.git)?(?:\/.*)?$/);
    return match ? match[1] : 'Repository';
  }

  /**
   * Formate le niveau pour l'affichage
   */
  private formatNiveau(niveau: string): string {
    const niveaux = {
      'debutant': '🌱 Débutant',
      'intermediaire': '🌿 Intermédiaire', 
      'avance': '🌳 Avancé'
    };
    return niveaux[niveau as keyof typeof niveaux] || niveau;
  }

  /**
   * Retourne un emoji selon le score
   */
  private getScoreEmoji(score: number): string {
    if (score >= 18) return '🏆';
    if (score >= 15) return '🥉';
    if (score >= 12) return '👍';
    if (score >= 10) return '📈';
    return '💪';
  }

  /**
   * Commentaire selon le score et le niveau
   */
  private getScoreComment(score: number, niveau: string): string {
    if (score >= 18) {
      return '🌟 **Excellent travail !** Vous maîtrisez très bien cette compétence.';
    }
    if (score >= 15) {
      return '✨ **Très bon travail !** Quelques petits détails à peaufiner.';
    }
    if (score >= 12) {
      return '👌 **Bon travail !** Vous êtes sur la bonne voie, continuez vos efforts.';
    }
    if (score >= 10) {
      return '📚 **Travail correct.** Il y a encore quelques concepts à consolider.';
    }
    
    if (niveau === 'debutant') {
      return '🌱 **Bon début !** C\'est normal d\'avoir des difficultés au début, persévérez !';
    }
    
    return '💪 **Il faut persévérer !** Revoir les bases et pratiquer davantage vous aidera.';
  }

  /**
   * Formate les détails techniques
   */
  private formatTechnicalDetails(details: any[]): string {
    if (details.length === 0) {
      return '✅ Aucun problème technique majeur détecté.';
    }

    const severityIcons = {
      'error': '🚫',
      'warning': '⚠️', 
      'info': 'ℹ️'
    };

    return details.map(detail => {
      const icon = severityIcons[detail.severity as keyof typeof severityIcons] || 'ℹ️';
      const lineInfo = detail.line ? ` (ligne ${detail.line})` : '';
      
      return `### ${icon} ${detail.file}${lineInfo}
**Problème:** ${detail.issue}
**Suggestion:** ${detail.suggestion}`;
    }).join('\n\n');
  }

  /**
   * Recommandations par défaut selon le niveau
   */
  private getDefaultRecommendations(niveau: string, competence: string): string {
    const recommendations = {
      'debutant': [
        '📖 Revoir les concepts de base régulièrement',
        '🔄 Pratiquer avec des exercices simples',
        '💬 Poser des questions à votre formateur',
        '👥 Échanger avec d\'autres apprenants'
      ],
      'intermediaire': [
        '🚀 Approfondir les concepts avancés',
        '🔍 Analyser du code existant de qualité',
        '📝 Documenter votre code',
        '🧪 Tester différentes approches'
      ],
      'avance': [
        '🏗️ Mettre l\'accent sur l\'architecture',
        '⚡ Optimiser les performances',
        '📋 Respecter les bonnes pratiques',
        '🔧 Utiliser des outils de développement avancés'
      ]
    };

    const levelRecs = recommendations[niveau as keyof typeof recommendations] || recommendations.debutant;
    return levelRecs.map(rec => `- ${rec}`).join('\n');
  }

  /**
   * Ressources par compétence
   */
  private getResourcesByCompetence(competence: string): string {
    const resources: { [key: string]: string[] } = {
      'CSS': [
        '📖 [MDN CSS](https://developer.mozilla.org/fr/docs/Web/CSS)',
        '🎨 [CSS-Tricks](https://css-tricks.com/)',
        '🎮 [Flexbox Froggy](https://flexboxfroggy.com/#fr)',
        '📱 [CSS Grid Garden](https://cssgridgarden.com/#fr)'
      ],
      'JavaScript': [
        '📖 [MDN JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript)',
        '📚 [JavaScript.info](https://javascript.info/)',
        '🎯 [Exercism JavaScript](https://exercism.org/tracks/javascript)',
        '🔥 [freeCodeCamp](https://www.freecodecamp.org/)'
      ],
      'HTML': [
        '📖 [MDN HTML](https://developer.mozilla.org/fr/docs/Web/HTML)',
        '🎯 [HTML5 Semantic Elements](https://www.w3schools.com/html/html5_semantic_elements.asp)',
        '♿ [Accessibilité Web](https://www.w3.org/WAI/)',
        '✅ [HTML Validator](https://validator.w3.org/)'
      ]
    };

    // Recherche dans les ressources disponibles
    const competenceLower = competence.toLowerCase();
    let matchedResources: string[] = [];

    for (const [key, value] of Object.entries(resources)) {
      if (competenceLower.includes(key.toLowerCase())) {
        matchedResources = value;
        break;
      }
    }

    if (matchedResources.length === 0) {
      matchedResources = [
        '📖 [MDN Web Docs](https://developer.mozilla.org/fr/)',
        '🎓 [freeCodeCamp](https://www.freecodecamp.org/)',
        '💻 [W3Schools](https://www.w3schools.com/)',
        '🚀 [Frontend Mentor](https://www.frontendmentor.io/)'
      ];
    }

    return matchedResources.join('\n');
  }
}

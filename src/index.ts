#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { CodeEvaluator } from "./evaluator.js";
import { GitHubService } from "./github.js";
import { FeedbackGenerator } from "./feedback.js";

// Configuration du serveur MCP
const server = new McpServer({
  name: "github-classroom-evaluator",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Schema pour l'évaluation d'un repository
const EvaluationRequestSchema = z.object({
  repositoryUrl: z.string().url().describe("URL du repository GitHub à évaluer"),
  competence: z.string().describe("Compétence évaluée (ex: 'CSS Styling', 'JavaScript Functions')"),
  bareme: z.string().describe("Critères d'évaluation et barème"),
  filesToAnalyze: z.array(z.string()).describe("Liste des fichiers à analyser"),
  niveau: z.enum(["debutant", "intermediaire", "avance"]).default("debutant").describe("Niveau de l'apprenant"),
});

// Schema pour la configuration de l'évaluation
const ConfigUpdateSchema = z.object({
  competence: z.string().optional().describe("Nouvelle compétence à évaluer"),
  bareme: z.string().optional().describe("Nouveau barème d'évaluation"),
  filesToAnalyze: z.array(z.string()).optional().describe("Nouveaux fichiers à analyser"),
});

// Initialisation des services
const codeEvaluator = new CodeEvaluator();
const githubService = new GitHubService();
const feedbackGenerator = new FeedbackGenerator();

// Outil principal : Évaluer un repository
server.tool(
  "evaluate_repository",
  "Évalue automatiquement le code d'un repository GitHub selon les critères pédagogiques définis",
  {
    repositoryUrl: z.string().url().describe("URL du repository GitHub à évaluer"),
    competence: z.string().describe("Compétence évaluée"),
    bareme: z.string().describe("Critères d'évaluation et barème"), 
    filesToAnalyze: z.array(z.string()).describe("Liste des fichiers à analyser"),
    niveau: z.enum(["debutant", "intermediaire", "avance"]).default("debutant"),
  },
  async ({ repositoryUrl, competence, bareme, filesToAnalyze, niveau }) => {
    try {
      console.error(`[MCP] Début évaluation: ${repositoryUrl}`);
      
      // 1. Cloner le repository et récupérer les fichiers
      const repoData = await githubService.cloneAndAnalyze(repositoryUrl, filesToAnalyze);
      
      // 2. Analyser le code selon les critères
      const analysis = await codeEvaluator.evaluateCode({
        files: repoData.files,
        competence,
        bareme,
        niveau,
        repositoryUrl,
      });
      
      // 3. Générer le feedback en markdown
      const feedbackMd = await feedbackGenerator.generateFeedback({
        analysis,
        competence,
        niveau,
        repositoryUrl,
        studentName: repoData.studentName,
      });
      
      // 4. Créer et pusher le fichier feedback
      await githubService.createFeedbackFile(repositoryUrl, feedbackMd);
      
      console.error(`[MCP] Évaluation terminée avec succès`);
      
      return {
        content: [
          {
            type: "text",
            text: `✅ Évaluation terminée avec succès !\n\n**Repository:** ${repositoryUrl}\n**Compétence:** ${competence}\n**Niveau:** ${niveau}\n\n**Résumé:**\n${analysis.summary}\n\n**Score:** ${analysis.score}/20\n\nLe feedback détaillé a été ajouté au repository dans le fichier \`FEEDBACK.md\`.`,
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error(`[MCP] Erreur lors de l'évaluation: ${errorMessage}`);
      
      return {
        content: [
          {
            type: "text",
            text: `❌ Erreur lors de l'évaluation: ${errorMessage}`,
          },
        ],
      };
    }
  }
);

// Outil : Analyser la structure d'un repository
server.tool(
  "analyze_repository_structure",
  "Analyse la structure d'un repository pour identifier les fichiers disponibles",
  {
    repositoryUrl: z.string().url().describe("URL du repository GitHub à analyser"),
  },
  async ({ repositoryUrl }) => {
    try {
      const structure = await githubService.getRepositoryStructure(repositoryUrl);
      
      return {
        content: [
          {
            type: "text",
            text: `📁 Structure du repository:\n\n${structure.files.map((f: any) => `- ${f.path} (${f.size} bytes)`).join('\n')}\n\n**Suggestions de fichiers à analyser:** \n- ${structure.suggestedFiles.join('\n- ')}`,
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      
      return {
        content: [
          {
            type: "text", 
            text: `❌ Erreur lors de l'analyse: ${errorMessage}`,
          },
        ],
      };
    }
  }
);

// Outil : Tester une configuration d'évaluation
server.tool(
  "test_evaluation_config",
  "Teste une configuration d'évaluation avec des exemples de code",
  {
    competence: z.string().describe("Compétence à tester"),
    bareme: z.string().describe("Barème d'évaluation"),
    sampleCode: z.string().describe("Code d'exemple pour tester l'évaluation"),
    niveau: z.enum(["debutant", "intermediaire", "avance"]).default("debutant"),
  },
  async ({ competence, bareme, sampleCode, niveau }) => {
    try {
      const testAnalysis = await codeEvaluator.evaluateCode({
        files: [{ path: 'test.js', content: sampleCode, size: sampleCode.length }],
        competence,
        bareme,
        niveau,
        repositoryUrl: 'test://sample',
      });
      
      return {
        content: [
          {
            type: "text",
            text: `🧪 Test de configuration:\n\n**Compétence:** ${competence}\n**Niveau:** ${niveau}\n\n**Résultat:**\n${testAnalysis.summary}\n\n**Score estimé:** ${testAnalysis.score}/20\n\n**Points forts identifiés:**\n${testAnalysis.strengths.join('\n- ')}\n\n**Points d'amélioration:**\n${testAnalysis.improvements.join('\n- ')}`,
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      
      return {
        content: [
          {
            type: "text",
            text: `❌ Erreur lors du test: ${errorMessage}`,
          },
        ],
      };
    }
  }
);

// Fonction principale pour lancer le serveur
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🚀 MCP GitHub Classroom Evaluator Server démarré sur stdio");
}

// Gestion des erreurs
main().catch((error) => {
  console.error("❌ Erreur fatale:", error);
  process.exit(1);
});

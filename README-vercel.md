# Déploiement MCP Evaluator API sur Vercel

## Étapes rapides

1. **Créer un compte Vercel** (https://vercel.com)
2. **Importer le repo GitHub** (bouton "Add New Project")
3. **Configurer le projet**
   - Point d'entrée: `src/web-server.ts` (Vercel détecte TypeScript)
   - Fichier `vercel.json` déjà présent
   - Node.js 18+ recommandé
4. **Déployer**
   - Vercel build automatiquement et expose l'API sur une URL publique
   - Exemple: `https://mcp-evaluator-<id>.vercel.app/evaluate`
5. **Tester l'API**
   - Utiliser curl ou Postman sur l'URL Vercel
   - Mettre à jour le workflow GitHub Actions pour pointer vers cette URL

## Conseils
- Pour les secrets (tokens, etc.), utiliser l'interface Vercel "Environment Variables"
- Pour debug, consulter les logs Vercel

---

**Après déploiement, donne-moi l'URL Vercel pour mettre à jour le workflow !**

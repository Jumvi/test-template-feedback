# 🚀 Démarrage Rapide avec GitHub Codespaces

## Lancement en Un Clic

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/votre-username/ia-workflow)

## 🔧 Configuration Automatique

Votre Codespace inclut automatiquement :

✅ **Node.js 18** et npm  
✅ **Token GitHub** avec permissions  
✅ **Extensions VS Code** pour le développement  
✅ **Serveur MCP** prêt à l'emploi  
✅ **API Web** accessible publiquement  

## 🚀 Démarrage Express

```bash
# Dans le terminal de votre Codespace :

# 1. Construire le projet (automatique au premier lancement)
npm run build

# 2. Démarrer l'API web
npm run start:web
```

L'API sera accessible via l'URL de votre Codespace : `https://votre-codespace-3000.app.github.dev`

## 🧪 Test Immédiat

1. **Testez la santé du service :**
   ```bash
   curl https://votre-codespace-3000.app.github.dev/health
   ```

2. **Interface web :**
   Visitez directement l'URL dans votre navigateur pour une interface graphique

3. **Test de configuration :**
   ```bash
   npm run test:codespace
   ```

## 📡 Utilisation de l'API

### Évaluer un Repository

```bash
curl -X POST https://votre-codespace-3000.app.github.dev/evaluate \\
  -H "Content-Type: application/json" \\
  -d '{
    "repositoryUrl": "https://github.com/utilisateur/repo",
    "competence": "CSS Styling",
    "bareme": "Structure HTML (3pts), Styles CSS (8pts), Design responsive (4pts), Bonnes pratiques (3pts), Créativité (2pts)",
    "filesToAnalyze": ["index.html", "style.css"],
    "niveau": "debutant"
  }'
```

### Analyser la Structure

```bash
curl -X POST https://votre-codespace-3000.app.github.dev/analyze-structure \\
  -H "Content-Type: application/json" \\
  -d '{
    "repositoryUrl": "https://github.com/utilisateur/repo"
  }'
```

### Tester une Configuration

```bash
curl -X POST https://votre-codespace-3000.app.github.dev/test-config \\
  -H "Content-Type: application/json" \\
  -d '{
    "competence": "JavaScript DOM",
    "bareme": "Syntaxe correcte (5pts), Logique fonctionnelle (10pts), Bonnes pratiques (5pts)",
    "sampleCode": "const element = document.getElementById(\\"test\\"); element.style.color = \\"blue\\";",
    "niveau": "debutant"
  }'
```

## 🎯 Pour les Enseignants

### Configuration Rapide d'un Template

1. **Forkez ce repository**
2. **Créez votre Codespace**
3. **Copiez le workflow dans votre template :**
   ```bash
   cp templates/auto-evaluation.yml .github/workflows/
   ```
4. **Configurez les variables dans votre repository template**

### Variables à Définir

Dans `Settings > Secrets and variables > Actions > Variables` :

| Variable | Exemple | Description |
|----------|---------|-------------|
| `COMPETENCE` | "CSS Styling" | Compétence évaluée |
| `BAREME` | "HTML(3pts), CSS(8pts)..." | Critères de notation |
| `FILES_TO_ANALYZE` | "index.html,style.css" | Fichiers à analyser |
| `NIVEAU` | "debutant" | Niveau de l'apprenant |

## 🔄 Workflow Automatique

Une fois configuré, le système :

1. ✅ Se déclenche à chaque push étudiant
2. 🔍 Analyse le code selon vos critères
3. 📝 Génère un feedback personnalisé
4. 📤 Crée le fichier `FEEDBACK.md`
5. 💬 Commente automatiquement les PRs

## 🛠️ Développement

### Scripts Disponibles

```bash
npm run build        # Compiler TypeScript
npm run start        # MCP server (stdio)
npm run start:web    # API web server
npm run dev:web      # Développement avec recompilation
npm run test:codespace # Test de configuration
```

### Structure de l'API

```
/health              # État du service
/evaluate           # Évaluation complète
/analyze-structure  # Analyse de fichiers
/test-config       # Test de configuration
```

## 🎉 Avantages de Codespaces

- 🚫 **Pas de setup local** requis
- 🔑 **Tokens GitHub** automatiques
- 🌐 **URLs publiques** pour l'API
- ⚡ **Démarrage instantané**
- 🔄 **Synchronisation** automatique
- 💾 **Sauvegarde** dans le cloud

## 🆘 Dépannage

### Le serveur ne démarre pas
```bash
# Vérifiez les logs
npm run build
npm run start:web
```

### Token GitHub manquant
Dans Codespaces, `GITHUB_TOKEN` est automatiquement disponible. Si problème :
```bash
echo $GITHUB_TOKEN  # Doit afficher un token
```

### Port 3000 non accessible
Vérifiez que le port est bien "Public" dans l'onglet "PORTS" de VS Code.

## 📚 Ressources Supplémentaires

- 📖 [Documentation Codespaces](https://docs.github.com/codespaces)
- 🎓 [Guide GitHub Classroom](https://classroom.github.com/help)
- 🤖 [Model Context Protocol](https://modelcontextprotocol.io/)

---

*🌟 Avec Codespaces, votre environnement d'évaluation est prêt en quelques secondes !*

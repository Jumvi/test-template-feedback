# 🤖 IA Workflow - Évaluation Automatique GitHub Classroom

Un serveur MCP (Model Context Protocol) pour l'évaluation automatique des exercices GitHub Classroom avec feedback IA personnalisé.

## 🚀 Démarrage Rapide avec Codespaces

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/votre-username/ia-workflow)

**✨ Nouveau : Fonctionne maintenant avec GitHub Codespaces !**
- 🚫 Pas de setup local requis
- 🔑 Token GitHub automatique 
- 🌐 API web accessible publiquement
- ⚡ Prêt en quelques secondes

👉 **[Guide de démarrage Codespaces →](./CODESPACE-QUICKSTART.md)**

## 🎯 Objectif

Automatiser l'évaluation pédagogique des exercices de développement web (HTML, CSS, JavaScript, TypeScript, AdonisJS) pour gagner du temps et fournir un feedback immédiat aux apprenants.

## 🏗️ Architecture

```
Push étudiant → GitHub Action → Clone du repo → Envoi au serveur MCP → 
Analyse IA → Génération feedback MD → Commit & Push
```

## ✨ Fonctionnalités

- 🔍 **Analyse intelligente** du code avec IA
- 📝 **Feedback pédagogique** adapté au niveau de l'apprenant
- ⚡ **Évaluation automatique** déclenchée par les pushs
- 📊 **Notation selon barème** personnalisable
- 🎨 **Support multi-langages** (HTML, CSS, JS, TS, AdonisJS)
- 📚 **Ressources personnalisées** selon la compétence
- 🔄 **Configuration flexible** via variables d'environnement

## 🚀 Installation

### 1. Prérequis

- Node.js 18+
- Git
- Token GitHub avec permissions repository

### 2. Configuration

```bash
# Cloner le projet
git clone https://github.com/votre-username/ia-workflow.git
cd ia-workflow

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec votre GITHUB_TOKEN

# Compiler le projet
npm run build
```

### 3. Test du serveur MCP

```bash
# Démarrer le serveur
npm start

# Ou utiliser avec Claude Desktop en ajoutant à claude_desktop_config.json:
{
  "mcpServers": {
    "github-classroom-evaluator": {
      "command": "node",
      "args": ["/chemin/absolu/vers/ia-workflow/dist/index.js"]
    }
  }
}
```

## 📖 Utilisation

### Pour les Enseignants

#### 1. Créer un Template Repository

1. Créez un nouveau repository template sur GitHub
2. Copiez le workflow `.github/workflows/auto-evaluation.yml`
3. Configurez les variables dans `Settings > Secrets and variables > Actions`

#### 2. Configuration des Variables

| Variable | Description | Exemple |
|----------|-------------|---------|
| `COMPETENCE` | Compétence évaluée | "CSS Styling" |
| `BAREME` | Critères et points | "Structure HTML (3pts), Styles CSS (8pts)..." |
| `FILES_TO_ANALYZE` | Fichiers à analyser | "index.html,style.css,script.js" |
| `NIVEAU` | Niveau apprenant | "debutant", "intermediaire", "avance" |

#### 3. Utilisation dans GitHub Classroom

1. Créez un assignment depuis votre template
2. Les étudiants reçoivent automatiquement la configuration
3. À chaque push, l'évaluation s'exécute
4. Le feedback apparaît dans `FEEDBACK.md`

### Pour les Développeurs MCP

#### Outils disponibles

- `evaluate_repository`: Évalue un repository complet
- `analyze_repository_structure`: Analyse la structure des fichiers
- `test_evaluation_config`: Teste une configuration avec du code d'exemple

#### Exemple d'utilisation

```typescript
// Évaluer un repository
await mcpClient.callTool('evaluate_repository', {
  repositoryUrl: 'https://github.com/user/repo',
  competence: 'CSS Styling',
  bareme: 'Structure HTML (3pts), Styles CSS (8pts)...',
  filesToAnalyze: ['index.html', 'style.css'],
  niveau: 'debutant'
});
```

## 📊 Exemple de Feedback Généré

```markdown
# 📝 Feedback Automatique

## 📊 Résultat Global
### Note: 16/20 🥉

Excellent travail ! Quelques petits détails à peaufiner.

## ✅ Points Forts
- 🎯 Structure HTML sémantique respectée
- 🎯 Styles CSS bien organisés
- 🎯 Responsive design implémenté

## 🔧 Axes d'Amélioration
- 📈 Optimiser les sélecteurs CSS
- 📈 Ajouter des commentaires explicatifs

## 💡 Recommandations
- 💭 Approfondir les concepts de flexbox
- 💭 Pratiquer les animations CSS
```

## 🛠️ Configuration Avancée

### Exemples par Compétence

#### CSS Styling
```yaml
COMPETENCE: "Stylisation CSS d'une page web"
BAREME: "Structure HTML (3pts), Styles CSS (8pts), Responsive (4pts), Bonnes pratiques (3pts), Créativité (2pts)"
FILES_TO_ANALYZE: "index.html,style.css,assets/*.css"
NIVEAU: "debutant"
```

#### JavaScript DOM
```yaml
COMPETENCE: "Manipulation du DOM avec JavaScript"
BAREME: "Syntaxe JS (4pts), Manipulation DOM (6pts), Événements (4pts), Bonnes pratiques (3pts), Fonctionnalité (3pts)"
FILES_TO_ANALYZE: "index.html,script.js,app.js"
NIVEAU: "intermediaire"
```

### Personnalisation du Feedback

Le système s'adapte automatiquement selon :
- **Niveau de l'apprenant** (débutant, intermédiaire, avancé)
- **Type de compétence** évaluée
- **Qualité du code** soumis
- **Bonnes pratiques** observées

## 🔧 Développement

### Structure du Projet

```
src/
├── index.ts          # Serveur MCP principal
├── github.ts         # Service GitHub API  
├── evaluator.ts      # Moteur d'évaluation IA
└── feedback.ts       # Générateur de feedback

.github/workflows/
└── auto-evaluation.yml  # Workflow GitHub Actions

config/
└── evaluation-examples.md  # Exemples de configuration
```

### Scripts Disponibles

```bash
npm run build     # Compiler TypeScript
npm run dev       # Mode développement avec watch
npm start         # Démarrer le serveur MCP
```

### Tests

```bash
# Tester une configuration
npm run test-config

# Analyser un repository d'exemple  
npm run test-repo https://github.com/user/example-repo
```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence ISC. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

- 📚 [Documentation complète](./config/evaluation-examples.md)
- 🐛 [Signaler un bug](https://github.com/votre-username/ia-workflow/issues)
- 💡 [Demander une fonctionnalité](https://github.com/votre-username/ia-workflow/issues)
- 💬 [Discussions](https://github.com/votre-username/ia-workflow/discussions)

## 🙏 Remerciements

- [Model Context Protocol](https://modelcontextprotocol.io/) pour le framework MCP
- [GitHub API](https://docs.github.com/rest) pour l'intégration
- La communauté éducative pour les retours et suggestions

---

Made with ❤️ for educators and students

# Configuration d'Évaluation Automatique

Ce fichier contient les exemples de configuration pour utiliser le système d'évaluation automatique dans vos templates GitHub Classroom.

## Variables d'Environnement Requises

### Dans GitHub Repository Settings > Secrets and variables > Actions

#### Secrets:
- `GITHUB_TOKEN`: Token GitHub avec permissions de lecture/écriture (généralement auto-fourni)

#### Variables (Repository Variables):
- `COMPETENCE`: Compétence évaluée (ex: "CSS Styling", "JavaScript Functions")
- `BAREME`: Critères d'évaluation détaillés
- `FILES_TO_ANALYZE`: Liste des fichiers à analyser (séparés par des virgules)
- `NIVEAU`: Niveau de l'apprenant (debutant, intermediaire, avance)

## Exemples de Configuration

### Exercice CSS - Stylisation d'une Page Web

```yaml
Variables:
  COMPETENCE: "Stylisation CSS d'une page web"
  BAREME: "Structure HTML (3pts), Styles CSS (8pts), Responsive design (4pts), Bonnes pratiques (3pts), Créativité (2pts)"
  FILES_TO_ANALYZE: "index.html,style.css,assets/style.css"
  NIVEAU: "debutant"
```

### Exercice JavaScript - Fonctions et DOM

```yaml
Variables:
  COMPETENCE: "Manipulation du DOM avec JavaScript"
  BAREME: "Syntaxe JavaScript (4pts), Manipulation DOM (6pts), Gestion des événements (4pts), Bonnes pratiques (3pts), Fonctionnalité (3pts)"
  FILES_TO_ANALYZE: "index.html,script.js,app.js"
  NIVEAU: "intermediaire"
```

### Exercice TypeScript - Projet Avancé

```yaml
Variables:
  COMPETENCE: "Développement TypeScript avec types"
  BAREME: "Types TypeScript (5pts), Architecture (5pts), Gestion d'erreurs (3pts), Tests (4pts), Documentation (3pts)"
  FILES_TO_ANALYZE: "src/index.ts,src/types.ts,src/utils.ts,README.md"
  NIVEAU: "avance"
```

### Exercice AdonisJS - API REST

```yaml
Variables:
  COMPETENCE: "Création d'API REST avec AdonisJS"
  BAREME: "Routes API (4pts), Contrôleurs (4pts), Modèles (4pts), Validation (3pts), Sécurité (3pts), Documentation (2pts)"
  FILES_TO_ANALYZE: "app/Controllers/Http/*.ts,app/Models/*.ts,start/routes.ts,app/Validators/*.ts"
  NIVEAU: "avance"
```

### Exercice Gestion de Projet GitHub

```yaml
Variables:
  COMPETENCE: "Gestion de projet avec Git et GitHub"
  BAREME: "Structure du repo (3pts), Commits descriptifs (4pts), Branches (3pts), README qualité (4pts), Issues/PR (3pts), Documentation (3pts)"
  FILES_TO_ANALYZE: "README.md,.gitignore,CONTRIBUTING.md,docs/*.md"
  NIVEAU: "intermediaire"
```

## Instructions pour l'Enseignant

### 1. Créer un Template Repository

1. Créez un nouveau repository template
2. Ajoutez le workflow `.github/workflows/auto-evaluation.yml`
3. Configurez les variables d'environnement
4. Testez avec un repository d'exemple

### 2. Configuration des Variables

#### Via l'Interface GitHub:
1. Allez dans `Settings` > `Secrets and variables` > `Actions`
2. Onglet `Variables` > `New repository variable`
3. Ajoutez chaque variable de configuration

#### Via GitHub CLI:
```bash
gh variable set COMPETENCE --body "CSS Styling" --repo owner/template-repo
gh variable set BAREME --body "Structure HTML (3pts), Styles CSS (8pts)..." --repo owner/template-repo
gh variable set FILES_TO_ANALYZE --body "index.html,style.css" --repo owner/template-repo
gh variable set NIVEAU --body "debutant" --repo owner/template-repo
```

### 3. Utilisation dans GitHub Classroom

1. Créez un assignment depuis votre template
2. Les étudiants forkeront automatiquement le repo avec la configuration
3. À chaque push, l'évaluation s'exécutera automatiquement
4. Le feedback apparaîtra dans `FEEDBACK.md`

## Structure du Feedback Généré

Le fichier `FEEDBACK.md` contiendra:

- 📊 Note globale (/20)
- ✅ Points forts identifiés
- 🔧 Axes d'amélioration
- 🔍 Détails techniques par fichier
- 💡 Recommandations personnalisées
- 📚 Ressources utiles

## Personnalisation Avancée

### Modifier les Critères d'Évaluation

Vous pouvez adapter le `BAREME` pour inclure:
- Critères spécifiques à votre cours
- Points accordés à chaque aspect
- Bonus pour la créativité ou l'initiative

### Fichiers Spéciaux à Analyser

- `README.md`: Documentation du projet
- `package.json`: Configuration et dépendances
- `tests/`: Tests unitaires (si applicable)
- `.gitignore`: Bonnes pratiques Git

### Niveaux d'Évaluation

- **Débutant**: Feedback encourageant, focus sur les bases
- **Intermédiaire**: Analyse plus détaillée, bonnes pratiques
- **Avancé**: Architecture, performance, patterns avancés

## Dépannage

### Erreurs Communes

1. **Token insuffisant**: Vérifiez les permissions du GITHUB_TOKEN
2. **Fichiers introuvables**: Vérifiez les chemins dans FILES_TO_ANALYZE
3. **Boucle infinie**: Le workflow ignore automatiquement FEEDBACK.md

### Logs de Debug

Consultez les logs dans `Actions` > Workflow run > Job details

### Support

Pour des questions spécifiques, consultez:
- Les logs GitHub Actions
- Le fichier de configuration du serveur MCP
- La documentation du projet

# Template d'Évaluation Automatique GitHub Classroom

Ce dossier contient les fichiers template à copier dans vos repositories GitHub Classroom pour activer l'évaluation automatique.

## 📋 Checklist pour l'Enseignant

### 1. ✅ Préparation du Template Repository

- [ ] Créer un nouveau repository template sur GitHub
- [ ] Copier le fichier `auto-evaluation.yml` dans `.github/workflows/`
- [ ] Configurer les variables d'environnement (voir ci-dessous)
- [ ] Tester avec un repository d'exemple

### 2. ✅ Configuration des Variables

Allez dans `Settings > Secrets and variables > Actions > Variables` et ajoutez :

#### Exemple pour exercice CSS :
```
COMPETENCE = "Stylisation CSS d'une page web"
BAREME = "Structure HTML sémantique (3pts), Styles CSS appliqués (8pts), Responsive design (4pts), Bonnes pratiques et code propre (3pts), Créativité et finition (2pts)"
FILES_TO_ANALYZE = "index.html,style.css,assets/style.css"
NIVEAU = "debutant"
```

#### Exemple pour exercice JavaScript :
```
COMPETENCE = "Manipulation du DOM avec JavaScript"
BAREME = "Syntaxe JavaScript correcte (4pts), Manipulation DOM effective (6pts), Gestion des événements (4pts), Bonnes pratiques JS (3pts), Fonctionnalité attendue (3pts)"
FILES_TO_ANALYZE = "index.html,script.js,app.js,js/main.js"
NIVEAU = "intermediaire"
```

### 3. ✅ Utilisation dans GitHub Classroom

1. **Créer un Assignment :**
   - Utilisez votre template repository
   - Les étudiants recevront automatiquement la configuration

2. **Workflow automatique :**
   - À chaque push de l'étudiant → évaluation automatique
   - Feedback généré dans `FEEDBACK.md`
   - Commentaire automatique sur les PRs

3. **Suivi des évaluations :**
   - Consultez l'onglet `Actions` de chaque repository
   - Le feedback est visible directement dans le repo étudiant

## 📚 Variables de Configuration Détaillées

### COMPETENCE
**Description :** La compétence principale évaluée dans cet exercice.

**Exemples :**
- `"CSS Styling"` 
- `"JavaScript DOM Manipulation"`
- `"HTML Semantic Structure"`
- `"TypeScript Types and Interfaces"`
- `"AdonisJS API Development"`
- `"Git Workflow Management"`

### BAREME  
**Description :** Critères d'évaluation avec points attribués (total sur 20).

**Format recommandé :** `"Critère 1 (Xpts), Critère 2 (Ypts), ..."`

**Exemples :**
```
"Structure HTML (4pts), Styles CSS (6pts), Responsive (4pts), Bonnes pratiques (3pts), Créativité (3pts)"

"Fonctions JavaScript (5pts), Manipulation DOM (5pts), Gestion événements (4pts), Code propre (3pts), Fonctionnalité (3pts)"

"Architecture TypeScript (6pts), Types corrects (5pts), Gestion erreurs (4pts), Documentation (3pts), Tests (2pts)"
```

### FILES_TO_ANALYZE
**Description :** Liste des fichiers à analyser (séparés par des virgules).

**Conseils :**
- Incluez les fichiers principaux de l'exercice
- Utilisez des patterns pour les dossiers : `src/*.js`, `css/*.css`
- Maximum recommandé : 5-7 fichiers pour une analyse efficace

**Exemples :**
```
"index.html,style.css"
"index.html,css/main.css,js/script.js"
"src/index.ts,src/types.ts,README.md"
"app/Controllers/Http/UserController.ts,app/Models/User.ts,start/routes.ts"
```

### NIVEAU
**Description :** Niveau de l'apprenant pour adapter le feedback.

**Valeurs possibles :**
- `"debutant"` : Feedback encourageant, focus sur les bases
- `"intermediaire"` : Analyse plus détaillée, bonnes pratiques
- `"avance"` : Architecture, performance, patterns avancés

## 🎯 Exemples Complets par Domaine

### HTML/CSS - Page Vitrine
```yaml
Variables:
  COMPETENCE: "Création d'une page vitrine en HTML/CSS"
  BAREME: "Structure HTML sémantique (4pts), Styles CSS (6pts), Layout responsive (4pts), Accessibilité (3pts), Finition (3pts)"
  FILES_TO_ANALYZE: "index.html,css/style.css,css/responsive.css"
  NIVEAU: "debutant"
```

### JavaScript - Application Interactive
```yaml
Variables:
  COMPETENCE: "Développement d'une application JavaScript interactive"
  BAREME: "Architecture JS (5pts), Manipulation DOM (5pts), Gestion des données (4pts), UX/UI (3pts), Gestion d'erreurs (3pts)"
  FILES_TO_ANALYZE: "index.html,js/app.js,js/utils.js,css/style.css"
  NIVEAU: "intermediaire"
```

### TypeScript - Projet Structuré
```yaml
Variables:
  COMPETENCE: "Développement TypeScript avec typage fort"
  BAREME: "Types TypeScript (6pts), Architecture (5pts), Interfaces (4pts), Gestion erreurs (3pts), Documentation (2pts)"
  FILES_TO_ANALYZE: "src/index.ts,src/types.ts,src/services/*.ts,README.md"
  NIVEAU: "avance"
```

### AdonisJS - API REST
```yaml
Variables:
  COMPETENCE: "Création d'API REST avec AdonisJS"
  BAREME: "Routes définies (4pts), Contrôleurs (4pts), Modèles (4pts), Validation (3pts), Sécurité (3pts), Documentation (2pts)"
  FILES_TO_ANALYZE: "app/Controllers/Http/*.ts,app/Models/*.ts,start/routes.ts,app/Validators/*.ts"
  NIVEAU: "avance"
```

## 🔧 Dépannage

### Problèmes courants

**❌ "Repository not found"**
- Vérifiez que le repository est public ou que le token a les bonnes permissions
- Testez l'accès au repository manuellement

**❌ "Files not found" dans FILES_TO_ANALYZE**
- Vérifiez que les chemins correspondent exactement aux fichiers du repo
- Utilisez des chemins relatifs depuis la racine du projet

**❌ Workflow ne se déclenche pas**
- Vérifiez que le fichier est bien dans `.github/workflows/`
- Vérifiez la syntaxe YAML avec un validateur en ligne
- Assurez-vous que les permissions sont bien configurées

**❌ "Permission denied" lors du push du feedback**
- Vérifiez que `GITHUB_TOKEN` a les permissions `contents: write`
- Dans les paramètres du repo : `Settings > Actions > General > Workflow permissions`

### Logs de debug

Consultez les logs dans :
1. `Actions` tab du repository
2. Sélectionnez le workflow run qui a échoué  
3. Cliquez sur le job `Évaluation du Code`
4. Développez les étapes pour voir les détails

## 🆘 Support

- 📖 [Documentation complète](../README.md)
- 🐛 [Signaler un problème](https://github.com/votre-username/ia-workflow/issues)
- 💬 [Aide communautaire](https://github.com/votre-username/ia-workflow/discussions)

---

*Créé avec ❤️ pour simplifier l'évaluation pédagogique*

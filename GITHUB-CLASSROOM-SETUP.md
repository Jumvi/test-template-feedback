# 🎓 Configuration GitHub Classroom - Template d'Évaluation Automatique

## 📋 Instructions pour le Formateur

### 1. Créer le Template Repository

1. **Fork ce repository** et en faire un template
2. **Activer GitHub Actions** dans le template
3. **Configurer les variables** selon l'exercice

### 2. Configuration des Variables (OPTIONNEL)

Si vous voulez personnaliser l'évaluation, ajoutez ces variables dans **Settings** → **Secrets and variables** → **Actions** → **Variables** :

| Variable           | Exemple                                                           | Description          |
| ------------------ | ----------------------------------------------------------------- | -------------------- |
| `COMPETENCE`       | `"CSS Flexbox Layout"`                                            | Nom de la compétence |
| `BAREME`           | `"HTML Structure (5pts), CSS Flexbox (10pts), Responsive (5pts)"` | Barème détaillé      |
| `FILES_TO_ANALYZE` | `"index.html,styles.css,responsive.css"`                          | Fichiers à analyser  |
| `NIVEAU`           | `"Intermédiaire"`                                                 | Niveau des étudiants |

### 3. Configuration par Défaut (RECOMMANDÉ)

**Au lieu des variables GitHub**, modifiez le fichier `.evaluation-config` :

```bash
# Configuration pour un exercice CSS Grid
COMPETENCE="CSS Grid Layout"
BAREME="HTML Sémantique (5pts), CSS Grid (10pts), Responsive (5pts)"
FILES_TO_ANALYZE="index.html,grid.css"
NIVEAU="Intermédiaire"
```

### 4. Créer l'Assignment GitHub Classroom

1. **Nouveau Assignment** → **Import from repository**
2. **Sélectionner votre template**
3. **Activer automatic grading** (optionnel)
4. **Enable feedback pull requests** (recommandé)

## 🔄 Fonctionnement Automatique

### Pour l'Étudiant

1. Accepte l'assignment
2. Clone son repository
3. Développe son code
4. **Push** → **L'évaluation se déclenche automatiquement**
5. Consulte le fichier `FEEDBACK.md` généré

### Types d'Analyses

- ✅ **Validation HTML W3C** (erreurs de syntaxe)
- ✅ **Analyse CSS** (syntaxe, bonnes pratiques)
- ✅ **Score automatique** sur 20 points
- ✅ **Feedback pédagogique** personnalisé

## 📊 Exemples de Configuration

### 🌐 Exercice HTML/CSS Basique

```bash
COMPETENCE="Première Page Web"
BAREME="Structure HTML (10pts), Styles CSS (10pts)"
FILES_TO_ANALYZE="index.html,style.css"
NIVEAU="Débutant"
```

### 🎨 Exercice CSS Avancé

```bash
COMPETENCE="Layout CSS Moderne"
BAREME="HTML Sémantique (5pts), CSS Grid/Flexbox (10pts), Responsive (5pts)"
FILES_TO_ANALYZE="index.html,layout.css,responsive.css"
NIVEAU="Intermédiaire"
```

### 🚀 Projet Complet

```bash
COMPETENCE="Site Web Complet"
BAREME="Structure HTML (5pts), Design CSS (8pts), JavaScript (7pts)"
FILES_TO_ANALYZE="index.html,style.css,script.js"
NIVEAU="Avancé"
```

## 🛠️ Maintenance

### Mise à Jour du Template

- Modifiez `.evaluation-config` pour changer les critères
- Ajustez `generate_feedback.py` pour personnaliser le feedback
- Le workflow se met à jour automatiquement

### Dépannage

- **Pas de feedback généré** → Vérifier les logs dans Actions
- **Variables non reconnues** → Vérifier la syntaxe de `.evaluation-config`
- **Erreurs de validation** → Tester avec les outils W3C manuellement

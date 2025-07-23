# 🔧 Variables d'Environnement GitHub

## Variables à Configurer dans GitHub Classroom

### Repository Settings → Secrets and variables → Actions → Variables

| **Variable** | **Valeur Exemple** | **Description** |
|--------------|-------------------|-----------------|
| `COMPETENCE` | `Développement Web HTML/CSS` | Nom de la compétence évaluée |
| `BAREME` | `Structure HTML (8pts), Style CSS (7pts), Bonnes pratiques (5pts)` | Critères d'évaluation détaillés |
| `FILES_TO_ANALYZE` | `index.html,style.css,script.js` | Fichiers à analyser (séparés par des virgules) |
| `NIVEAU` | `debutant` | Niveau des étudiants (`debutant`, `intermediaire`, `avance`) |

## Exemples par Type d'Exercice

### 🌐 Exercice HTML/CSS Basique
```
COMPETENCE: "Développement Web - Mise en page"
BAREME: "HTML sémantique (10pts), CSS responsive (10pts)"
FILES_TO_ANALYZE: "index.html,style.css"
NIVEAU: "debutant"
```

### 🚀 Exercice JavaScript Interactif
```
COMPETENCE: "JavaScript - Manipulation DOM"
BAREME: "Fonctionnalités JS (12pts), Structure HTML (4pts), Style CSS (4pts)"
FILES_TO_ANALYZE: "index.html,style.css,script.js"
NIVEAU: "intermediaire"
```

### 📱 Exercice Responsive Design
```
COMPETENCE: "Design Responsive - Mobile First"
BAREME: "Responsive design (8pts), Performance (6pts), Accessibilité (6pts)"
FILES_TO_ANALYZE: "index.html,style.css,media-queries.css"
NIVEAU: "avance"
```

### 🎨 Exercice Frameworks CSS
```
COMPETENCE: "Framework CSS - Bootstrap/Tailwind"
BAREME: "Utilisation framework (10pts), Personnalisation (5pts), Bonnes pratiques (5pts)"
FILES_TO_ANALYZE: "index.html,custom.css,components.css"
NIVEAU: "intermediaire"
```

## 📋 Template de Configuration Rapide

Copiez-collez ces valeurs dans GitHub :

**Pour un exercice de base HTML/CSS :**
- COMPETENCE: `Développement Web - HTML/CSS`
- BAREME: `Structure HTML (10pts), Style CSS (10pts)`
- FILES_TO_ANALYZE: `index.html,style.css`
- NIVEAU: `debutant`

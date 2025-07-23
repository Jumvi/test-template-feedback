# 🔧 Guide de Configuration GitHub Variables

## Variables à Créer Manuellement

Pour configurer l'évaluation automatique, vous devez créer ces variables dans GitHub :

### Étapes de Configuration

1. **Allez sur votre repository GitHub**
2. **Settings** → **Secrets and variables** → **Actions**
3. **Onglet "Variables"** → **New repository variable**

### Variables à Créer

| Nom                | Valeur                                      | Description                  |
| ------------------ | ------------------------------------------- | ---------------------------- |
| `COMPETENCE`       | `Développement Web HTML/CSS`                | Nom de la compétence évaluée |
| `BAREME`           | `Structure HTML (10pts), Style CSS (10pts)` | Critères de notation         |
| `FILES_TO_ANALYZE` | `index.html,style.css`                      | Fichiers à analyser          |
| `NIVEAU`           | `debutant`                                  | Niveau des étudiants         |

## Exemples par Type d'Exercice

### 🌐 HTML/CSS Basique

```
COMPETENCE: "Développement Web HTML/CSS"
BAREME: "Structure HTML (10pts), Style CSS (10pts)"
FILES_TO_ANALYZE: "index.html,style.css"
NIVEAU: "debutant"
```

### 🎨 CSS Avancé + Responsive

```
COMPETENCE: "CSS Responsive Design"
BAREME: "Responsive design (8pts), Performance (6pts), Accessibilité (6pts)"
FILES_TO_ANALYZE: "index.html,style.css,responsive.css"
NIVEAU: "intermediaire"
```

### 🚀 Projet Complet

```
COMPETENCE: "Projet Web Frontend"
BAREME: "HTML Structure (5pts), CSS Design (8pts), JavaScript (7pts)"
FILES_TO_ANALYZE: "index.html,style.css,script.js"
NIVEAU: "avance"
```

## ✅ Vérification

Une fois les variables créées, le workflow se déclenchera automatiquement au prochain push et générera un feedback technique dans `FEEDBACK.md`.

## 🔍 Fonctionnement

Le workflow :

1. **Valide le HTML** avec W3C Validator
2. **Analyse le CSS** pour détecter les erreurs syntaxiques
3. **Calcule un score** basé sur les erreurs trouvées
4. **Génère un feedback technique** détaillé
5. **Fait un commit automatique** du fichier FEEDBACK.md

## 🛠️ Dépannage

Si le workflow ne fonctionne pas :

- Vérifiez que les variables sont bien créées
- Consultez l'onglet **Actions** du repository
- Les erreurs apparaîtront dans les logs du workflow

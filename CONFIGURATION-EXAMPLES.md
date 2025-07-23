# 📝 Exemples de Configuration pour Différents Exercices

Ce document présente des exemples de configuration du fichier `.evaluation-config` pour différents types d'exercices.

## 🎯 Exercice Débutant HTML/CSS (sur 15 points)

```ini
# Configuration pour exercice débutant
COMPETENCE="Introduction au Développement Web"
BAREME="Structure HTML (10pts), Style CSS de base (5pts)"

# Scores maximum
HTML_MAX_SCORE=10
CSS_MAX_SCORE=5
JS_MAX_SCORE=0
TOTAL_MAX_SCORE=15

# Seuils adaptés
EXCELLENT_THRESHOLD=85  # 13/15 points
GOOD_THRESHOLD=65       # 10/15 points
PASSING_THRESHOLD=40    # 6/15 points

FILES_TO_ANALYZE="index.html,style.css"
NIVEAU="Débutant"
```

## 🚀 Exercice Intermédiaire avec JavaScript (sur 30 points)

```ini
# Configuration pour exercice intermédiaire
COMPETENCE="Développement Web Frontend"
BAREME="Structure HTML (12pts), Style CSS avancé (10pts), Interactivité JavaScript (8pts)"

# Scores maximum
HTML_MAX_SCORE=12
CSS_MAX_SCORE=10
JS_MAX_SCORE=8
TOTAL_MAX_SCORE=30

# Seuils standards
EXCELLENT_THRESHOLD=80  # 24/30 points
GOOD_THRESHOLD=60       # 18/30 points
PASSING_THRESHOLD=40    # 12/30 points

FILES_TO_ANALYZE="index.html,style.css,script.js"
NIVEAU="Intermédiaire"
```

## 🎓 Projet Final Complet (sur 50 points)

```ini
# Configuration pour projet final
COMPETENCE="Développement Web Full-Stack Frontend"
BAREME="HTML Sémantique (15pts), CSS Responsive (15pts), JavaScript (10pts), Accessibilité (10pts)"

# Scores maximum
HTML_MAX_SCORE=15
CSS_MAX_SCORE=15
JS_MAX_SCORE=10
ACCESSIBILITY_MAX_SCORE=10
TOTAL_MAX_SCORE=50

# Seuils élevés pour projet final
EXCELLENT_THRESHOLD=85  # 43/50 points
GOOD_THRESHOLD=70       # 35/50 points
PASSING_THRESHOLD=50    # 25/50 points

FILES_TO_ANALYZE="index.html,style.css,script.js"
NIVEAU="Avancé"
```

## 📱 Exercice CSS Responsive (sur 25 points)

```ini
# Configuration spécialisée CSS
COMPETENCE="CSS Responsive Design"
BAREME="Structure HTML (8pts), CSS Desktop (7pts), CSS Mobile (10pts)"

# Scores maximum
HTML_MAX_SCORE=8
CSS_MAX_SCORE=17  # 7 + 10 pour responsive
JS_MAX_SCORE=0
TOTAL_MAX_SCORE=25

# Seuils CSS-centrés
EXCELLENT_THRESHOLD=88  # 22/25 points
GOOD_THRESHOLD=72       # 18/25 points
PASSING_THRESHOLD=48    # 12/25 points

FILES_TO_ANALYZE="index.html,style.css"
NIVEAU="Intermédiaire"
```

## 🧪 Test Technique Intensif (sur 100 points)

```ini
# Configuration pour évaluation complète
COMPETENCE="Maîtrise Complète Frontend"
BAREME="HTML Sémantique (25pts), CSS Avancé (30pts), JavaScript ES6+ (25pts), Performance et Accessibilité (20pts)"

# Scores maximum élevés
HTML_MAX_SCORE=25
CSS_MAX_SCORE=30
JS_MAX_SCORE=25
ACCESSIBILITY_MAX_SCORE=20
TOTAL_MAX_SCORE=100

# Seuils professionnels
EXCELLENT_THRESHOLD=85  # 85/100 points
GOOD_THRESHOLD=70       # 70/100 points
PASSING_THRESHOLD=60    # 60/100 points

FILES_TO_ANALYZE="index.html,style.css,script.js,README.md"
NIVEAU="Expert"
```

## 🎨 Exercice CSS Pur (sur 20 points)

```ini
# Configuration CSS uniquement
COMPETENCE="Maîtrise CSS Avancée"
BAREME="CSS Grid/Flexbox (8pts), Animations CSS (6pts), Responsive Design (6pts)"

# Scores spécialisés
HTML_MAX_SCORE=0  # Pas d'évaluation HTML
CSS_MAX_SCORE=20  # Tout en CSS
JS_MAX_SCORE=0
TOTAL_MAX_SCORE=20

# Seuils CSS spécialisés
EXCELLENT_THRESHOLD=90  # 18/20 points
GOOD_THRESHOLD=75       # 15/20 points
PASSING_THRESHOLD=50    # 10/20 points

FILES_TO_ANALYZE="style.css"
NIVEAU="Intermédiaire"
```

## 🎯 Comment Utiliser Ces Configurations

1. **Copiez** le contenu de l'exemple correspondant à votre exercice
2. **Remplacez** le contenu du fichier `.evaluation-config`
3. **Adaptez** les valeurs selon vos besoins spécifiques
4. **Testez** avec un commit pour vérifier les calculs

## 📊 Calcul des Seuils

Les seuils sont calculés automatiquement :

- **Excellent** : X% du score total maximum
- **Bon** : Y% du score total maximum
- **À corriger** : En dessous du seuil "Bon"

**Exemple** : Si `TOTAL_MAX_SCORE=30` et `EXCELLENT_THRESHOLD=80`
→ Seuil excellent = 30 × 80% = 24 points

## 🔄 Avantages du Système

- **Flexible** : S'adapte à tout type d'exercice
- **Proportionnel** : Les messages s'adaptent aux scores maximum
- **Cohérent** : Même logique d'évaluation pour tous les exercices
- **Configurable** : Un seul fichier à modifier par exercice

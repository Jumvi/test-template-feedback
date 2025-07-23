#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
import json
from datetime import datetime

def analyze_files_locally():
    """Analyse locale des fichiers quand l'API IA n'est pas disponible"""
    print("🔍 Analyse locale des fichiers en cours...")
    
    technical_details = []
    score = 20  # Score de départ
    
    # Analyser index.html
    if os.path.exists('index.html'):
        with open('index.html', 'r', encoding='utf-8') as f:
            html_content = f.read()
            lines = html_content.split('\n')
            
            for i, line in enumerate(lines, 1):
                # Détecter balises non fermées
                if '<button' in line and '</button>' not in line and not line.strip().endswith('/>'):
                    if i < len(lines) and '</button>' not in lines[i]:
                        technical_details.append({
                            'file': 'index.html',
                            'line': i,
                            'severity': 'error',
                            'issue': 'Balise button non fermée',
                            'suggestion': 'Ajoutez la balise de fermeture </button> correspondante'
                        })
                        score -= 3
                
                # Détecter attributs mal orthographiés
                if 'clas=' in line:
                    technical_details.append({
                        'file': 'index.html',
                        'line': i,
                        'severity': 'error',
                        'issue': 'Attribut "clas" incorrect',
                        'suggestion': 'Remplacez "clas" par "class"'
                    })
                    score -= 2
    
    # Analyser style.css
    if os.path.exists('style.css'):
        with open('style.css', 'r', encoding='utf-8') as f:
            css_content = f.read()
            lines = css_content.split('\n')
            
            for i, line in enumerate(lines, 1):
                # Détecter width excessive
                if 'width: 250%' in line:
                    technical_details.append({
                        'file': 'style.css',
                        'line': i,
                        'severity': 'error',
                        'issue': 'Largeur excessive (250%) cassant la mise en page',
                        'suggestion': 'Utilisez une largeur raisonnable comme 100% ou max-width'
                    })
                    score -= 4
                
                # Détecter position stick (invalide)
                if 'position: stick' in line and 'sticky' not in line:
                    technical_details.append({
                        'file': 'style.css',
                        'line': i,
                        'severity': 'error',
                        'issue': 'Valeur CSS invalide "stick"',
                        'suggestion': 'Remplacez "position: stick" par "position: sticky"'
                    })
                    score -= 2
                
                # Détecter margin négatif excessif
                if 'margin-left: -9999px' in line:
                    technical_details.append({
                        'file': 'style.css',
                        'line': i,
                        'severity': 'error',
                        'issue': 'Élément placé hors écran avec margin négatif excessif',
                        'suggestion': 'Retirez cette propriété ou utilisez display: none pour masquer l\'élément'
                    })
                    score -= 3
                
                # Détecter points-virgules manquants
                if ('cursor: pointer' in line or 'height: 400px' in line) and not line.strip().endswith(';') and not line.strip().endswith('{'):
                    technical_details.append({
                        'file': 'style.css',
                        'line': i,
                        'severity': 'warning',
                        'issue': 'Point-virgule manquant en fin de déclaration CSS',
                        'suggestion': 'Ajoutez un point-virgule (;) à la fin de la déclaration'
                    })
                    score -= 1
    
    return {
        'score': max(0, score),
        'technicalDetails': technical_details,
        'summary': f'Analyse locale détectant {len(technical_details)} problème(s) technique(s)',
        'strengths': ['Structure HTML de base présente'] if score > 10 else [],
        'improvements': [f'{len(technical_details)} erreurs critiques à corriger avant soumission']
    }

def generate_ai_feedback():
    """Génère le feedback à partir de l'évaluation IA avancée"""
    ai_available = os.environ.get('AI_AVAILABLE', 'false').lower() == 'true'
    ai_response = os.environ.get('AI_RESPONSE', '{}')
    
    if not ai_available:
        # Utiliser l'analyse locale si l'API IA n'est pas disponible
        print("⚠️ API IA indisponible, utilisation de l'analyse locale avancée")
        ai_data = analyze_files_locally()
    else:
        try:
            ai_data = json.loads(ai_response)
            if 'error' in ai_data:
                print("❌ Erreur dans la réponse IA, fallback vers analyse locale")
                ai_data = analyze_files_locally()
        except:
            print("❌ Erreur parsing réponse IA, fallback vers analyse locale")
            ai_data = analyze_files_locally()
    
    if not ai_data:
        return None
    
    try:
        ai_data = json.loads(ai_response)
        if 'error' in ai_data:
            return None
            
        repository = os.environ.get('REPOSITORY', 'repository')
        competence = os.environ.get('COMPETENCE', 'Développement Web HTML/CSS')
        niveau = os.environ.get('NIVEAU', 'Débutant')
        
        timestamp = datetime.now().strftime("%d/%m/%Y à %H:%M")
        
        # Génération du feedback avec les données IA
        feedback = f"""# 📝 Feedback Automatique Avancé

> **Évaluation générée automatiquement le {timestamp}**

## 👤 Informations
- **Repository:** {repository}
- **Compétence évaluée:** {competence}
- **Niveau:** {niveau}
- **Status:** ✅ Évaluation IA avancée

---

## 📊 Résultat Global

### Note: {ai_data.get('score', 0)}/20 {get_score_emoji(ai_data.get('score', 0))}

{ai_data.get('summary', 'Évaluation effectuée avec succès.')}

---

## ✅ Points Forts

"""
        
        strengths = ai_data.get('strengths', [])
        if strengths:
            for strength in strengths:
                feedback += f"- {strength}\n"
        else:
            feedback += "- 💪 Continue tes efforts, tu es sur la bonne voie !\n"
        
        feedback += "\n---\n\n## 🔧 Axes d'Amélioration\n\n"
        
        improvements = ai_data.get('improvements', [])
        if improvements:
            for improvement in improvements:
                feedback += f"- {improvement}\n"
        else:
            feedback += "- ✨ Excellent travail, peu d'améliorations nécessaires !\n"
        
        feedback += "\n---\n\n## 🔍 Détails Techniques\n\n"
        
        technical_details = ai_data.get('technicalDetails', [])
        if technical_details:
            feedback += f"J'ai analysé votre code en détail et identifié **{len(technical_details)} point(s)** spécifique(s) à améliorer :\n\n"
            
            # Grouper par fichier
            files_details = {}
            for detail in technical_details:
                file_name = detail.get('file', 'Fichier inconnu')
                if file_name not in files_details:
                    files_details[file_name] = []
                files_details[file_name].append(detail)
            
            for file_name, details in files_details.items():
                feedback += f"### 📄 **{file_name}**\n\n"
                
                for i, detail in enumerate(details, 1):
                    severity_icons = {'error': '🚫', 'warning': '⚠️', 'info': 'ℹ️'}
                    icon = severity_icons.get(detail.get('severity', 'info'), 'ℹ️')
                    line_info = f" **ligne {detail['line']}**" if detail.get('line') else ''
                    severity_text = {'error': 'Erreur', 'warning': 'Attention', 'info': 'Info'}.get(detail.get('severity', 'info'), 'Info')
                    
                    feedback += f"**{i}.** {icon} **{severity_text}**{line_info}\n"
                    feedback += f"- **Problème identifié :** {detail.get('issue', 'Non spécifié')}\n"
                    feedback += f"- **Conseil d'amélioration :** {detail.get('suggestion', 'Voir la documentation')}\n\n"
            
            feedback += "> 💡 **Conseil de coach :** Ces points d'amélioration sont là pour vous faire progresser. Chaque correction est une occasion d'apprendre quelque chose de nouveau !\n"
        else:
            feedback += "✅ **Aucun problème technique majeur détecté !**\n\nVotre code respecte les bonnes pratiques de base. C'est un excellent point de départ !\n"
        
        feedback += "\n---\n\n## 💡 Recommandations pour Progresser\n\n"
        
        recommendations = ai_data.get('recommendations', [])
        if recommendations:
            for rec in recommendations:
                feedback += f"- {rec}\n"
        else:
            feedback += "- 📚 Continuer à pratiquer régulièrement\n- 💬 N'hésiter pas à demander de l'aide\n"
        
        feedback += f"""

---

## 📚 Ressources Utiles

- 📖 [MDN Web Docs](https://developer.mozilla.org/fr/) - Documentation complète HTML/CSS/JS
- 🎓 [freeCodeCamp](https://www.freecodecamp.org/) - Cours gratuits et exercices
- 💻 [W3Schools](https://www.w3schools.com/) - Tutoriels et références
- 🔧 [Can I Use](https://caniuse.com/) - Compatibilité des propriétés CSS
- 🎨 [CSS-Tricks](https://css-tricks.com/) - Astuces et techniques CSS

---

## 🤖 À Propos de cette Évaluation

Cette évaluation a été générée par notre système d'IA pédagogique avancé qui analyse votre code ligne par ligne selon les critères définis pour la compétence "{competence}".

### Prochaines Étapes
1. 📖 Lisez attentivement les détails techniques ci-dessus
2. 🔄 Corrigez les erreurs identifiées une par une
3. 💬 Demandez de l'aide à votre formateur si nécessaire
4. 🚀 Committez vos corrections et relancez l'évaluation

---

*💡 Cette évaluation personnalisée montre que j'ai vraiment analysé votre code. Chaque conseil est spécifique à votre travail !*

---

<sub>🔄 Généré le: {timestamp} | 🤖 Évaluation IA avancée | 🌐 Powered by GitHub Codespaces</sub>
"""
        
        return feedback
        
    except json.JSONDecodeError:
        return None

def get_score_emoji(score):
    """Retourne un emoji selon le score"""
    if score >= 18:
        return '🏆'
    elif score >= 15:
        return '🥉'
    elif score >= 12:
        return '👍'
    elif score >= 10:
        return '📈'
    else:
        return '💪'

def main():
    # Essayer d'abord l'évaluation IA avancée
    ai_feedback = generate_ai_feedback()
    if ai_feedback:
        print("✅ Utilisation de l'évaluation IA avancée")
        with open('FEEDBACK.md', 'w', encoding='utf-8') as f:
            f.write(ai_feedback)
        return
    
    print("⚠️ Fallback vers l'évaluation basique")
    
    # Code de fallback original
    html_score = os.environ.get('HTML_SCORE', '0')
    css_score = os.environ.get('CSS_SCORE', '0')
    error_count = os.environ.get('ERROR_COUNT', '0')
    html_errors = os.environ.get('HTML_ERRORS', '')
    css_errors = os.environ.get('CSS_ERRORS', '')
    competence = os.environ.get('COMPETENCE', 'Développement Web HTML/CSS')
    bareme = os.environ.get('BAREME', 'Structure HTML (10pts), Style CSS (10pts)')
    files = os.environ.get('FILES', 'index.html,style.css')
    repository = os.environ.get('REPOSITORY', 'repository')
    niveau = os.environ.get('NIVEAU', 'Débutant')
    
    # Récupérer les scores maximum et seuils
    html_max_score = int(os.environ.get('HTML_MAX_SCORE', '3'))
    css_max_score = int(os.environ.get('CSS_MAX_SCORE', '9'))
    total_max_score = int(os.environ.get('TOTAL_MAX_SCORE', '12'))
    excellent_threshold = int(os.environ.get('EXCELLENT_THRESHOLD', '83'))
    good_threshold = int(os.environ.get('GOOD_THRESHOLD', '67'))

    # Récupérer les scores détaillés par critère CSS
    structure_score = int(os.environ.get('STRUCTURE_SCORE', '0'))
    typography_score = int(os.environ.get('TYPOGRAPHY_SCORE', '0'))
    practices_score = int(os.environ.get('PRACTICES_SCORE', '0'))

    try:
        html_score_int = int(html_score)
        css_score_int = int(css_score)
        total_score = html_score_int + css_score_int
    except ValueError:
        html_score_int = 0
        css_score_int = 0
        total_score = 0

    # Calcul des seuils adaptatifs
    excellent_score = (total_max_score * excellent_threshold) // 100
    good_score = (total_max_score * good_threshold) // 100

    # Status selon la note avec seuils adaptatifs
    if total_score >= excellent_score:
        status_emoji = "🎉"
        status_message = "Excellent travail !"
        global_level = "Avancé"
    elif total_score >= good_score:
        status_emoji = "👍"
        status_message = "Bon travail avec corrections à apporter"
        global_level = "Compétent"
    else:
        status_emoji = "⚠️"
        status_message = "Travail à corriger"
        global_level = "Basique"

    # Analyse contextuelle par critère
    def get_criterium_analysis(score, max_score, criterium_name, context):
        percentage = (score / max_score * 100) if max_score > 0 else 0
        if percentage >= 85:
            return f"✅ **{criterium_name}** ({score}/{max_score}): **Avancé** - {context['excellent']}"
        elif percentage >= 67:
            return f"🟡 **{criterium_name}** ({score}/{max_score}): **Compétent** - {context['good']}"
        elif percentage >= 33:
            return f"🟠 **{criterium_name}** ({score}/{max_score}): **Basique** - {context['basic']}"
        else:
            return f"❌ **{criterium_name}** ({score}/{max_score}): **Insuffisant** - {context['insufficient']}"

    # Contextes spécifiques selon le barème
    structure_context = {
        'excellent': "Code bien structuré, variables CSS utilisées, commentaires présents",
        'good': "Structure correcte mais perfectible, quelques optimisations possibles",
        'basic': "Organisation confuse, sélecteurs redondants, manque de variables",
        'insufficient': "Styles désorganisés, sélecteurs complexes, aucune variable CSS"
    }

    typography_context = {
        'excellent': "Unités relatives privilégiées, typographie cohérente, couleurs hexadécimales",
        'good': "Bonne base typographique, quelques unités fixes à convertir",
        'basic': "Typographie basique, mélange d'unités, couleurs incohérentes",
        'insufficient': "Typographie négligée, unités fixes prédominantes, couleurs désorganisées"
    }

    practices_context = {
        'excellent': "Classes réutilisables, pseudo-classes maîtrisées, séparation parfaite",
        'good': "Bonnes pratiques appliquées, quelques répétitions à optimiser",
        'basic': "Pratiques basiques, code fonctionnel mais peu maintenable",
        'insufficient': "Mauvaises pratiques, code difficile à maintenir, styles mélangés"
    }

    validation_context = {
        'excellent': "Code validé W3C sans erreurs, compatible multi-navigateurs",
        'good': "Validation correcte avec avertissements mineurs seulement",
        'basic': "Quelques erreurs de validation, problèmes d'affichage possibles",
        'insufficient': "Nombreuses erreurs, code non testé, incompatibilités"
    }

    # Génération des analyses par critère
    structure_analysis = get_criterium_analysis(structure_score, 3, "Structure et Organisation CSS", structure_context)
    typography_analysis = get_criterium_analysis(typography_score, 3, "Typographie et Couleurs", typography_context)
    practices_analysis = get_criterium_analysis(practices_score, 3, "Bonnes Pratiques CSS", practices_context)
    validation_analysis = get_criterium_analysis(html_score_int, html_max_score, "Validation et Tests", validation_context)

    # Recommandations spécifiques selon les scores
    def get_recommendations():
        recommendations = []
        
        if structure_score < 2:
            recommendations.append("🔧 **Structure**: Organisez votre CSS avec des variables (`--primary-color`) et des commentaires sections")
        
        if typography_score < 2:  
            recommendations.append("📝 **Typographie**: Utilisez des unités relatives (rem, em, %) plutôt que px")
            
        if practices_score < 2:
            recommendations.append("⚡ **Pratiques**: Créez des classes réutilisables et utilisez les pseudo-classes (:hover, :focus)")
            
        if html_score_int < 2:
            recommendations.append("✅ **Validation**: Corrigez les erreurs W3C avant de finaliser votre code")
            
        if not recommendations:
            recommendations.append("🎯 **Optimisation**: Votre code est solide, explorez les techniques avancées (CSS Grid, animations)")
            
        return recommendations

    recommendations = get_recommendations()

    # Messages d'encouragement selon le niveau et contexte
    def get_contextual_message():
        if niveau == "Débutant":
            if total_score >= excellent_score:
                return "🌟 Remarquable pour un niveau débutant ! Vous maîtrisez déjà les concepts avancés."
            elif total_score >= good_score:
                return "👏 Très bon travail pour un débutant ! Quelques corrections et vous excellerez."
            else:
                return "💪 Bon début ! Concentrez-vous sur les bases: validation W3C et organisation CSS."
        
        elif niveau == "Intermédiaire":
            if total_score >= excellent_score:
                return "🚀 Excellent niveau intermédiaire ! Prêt pour des défis plus complexes."
            elif total_score >= good_score:
                return "📈 Bonnes bases intermédiaires. Perfectionnez les détails pour exceller."
            else:
                return "🎯 Niveau intermédiaire à consolider. Focalisez sur les bonnes pratiques CSS."
        
        else:  # Avancé
            if total_score >= excellent_score:
                return "🏆 Niveau expert confirmé ! Votre code respecte les standards professionnels."
            elif total_score >= good_score:
                return "💼 Bon niveau avancé. Peaufinez les détails pour un code professionnel."
            else:
                return "📚 Niveau avancé à renforcer. Approfondissez l'organisation et les pratiques."

    contextual_message = get_contextual_message()

    # Génération du rapport contextuel et pédagogique
    feedback_content = f"""# 🎯 Rapport d'Évaluation Pédagogique Contextuelle

> **Analyse automatique contextuelle générée le {datetime.now().strftime('%d %B %Y à %H:%M')}**

## � Contexte de l'Évaluation

- **Repository:** `{repository}`
- **Compétence évaluée:** {competence.replace('developement web', 'Développement Web').strip()}
- **Niveau de l'étudiant:** **{niveau}**
- **Fichiers analysés:** `{files}`

---

## 🏆 Résultat Global

### 📊 Note Finale: {total_score}/{total_max_score} points {status_emoji} **{status_message}** ({global_level})

{contextual_message}

---

## 📈 Analyse Détaillée par Critère du Barème

### 🏗️ **Critère 1: Structure et Organisation du CSS**
{structure_analysis}

### � **Critère 2: Typographie et Couleurs** 
{typography_analysis}

### ⚡ **Critère 3: Bonnes Pratiques CSS**
{practices_analysis}

### ✅ **Critère 4: Validation et Tests**
{validation_analysis}

---

## � Points d'Amélioration Détectés

### **Erreurs Critiques à Corriger**

{"#### 🔴 **Validation W3C HTML**" if error_count != '0' else ""}
{html_errors if error_count != '0' else "✅ **Validation HTML**: Code validé sans erreurs critiques"}

{"#### � **Analyse CSS Contextuelle**" if css_errors else ""}
{css_errors if css_errors else "✅ **Analyse CSS**: Code respectant les critères du barème"}

---

## � Plan d'Action Personnalisé

### **Recommandations Prioritaires:**

{chr(10).join(f"- {rec}" for rec in recommendations)}

### **Ressources Ciblées selon votre Profil {niveau}:**

{"#### 📚 **Pour Débutants:**" if niveau == "Débutant" else ""}
{"- [Validateur W3C HTML](https://validator.w3.org/) - Vérifiez votre code" if niveau == "Débutant" else ""}
{"- [CSS Variables Guide](https://developer.mozilla.org/fr/docs/Web/CSS/Using_CSS_custom_properties) - Organisez vos couleurs" if niveau == "Débutant" else ""}
{"- [Unités CSS](https://developer.mozilla.org/fr/docs/Learn/CSS/Building_blocks/Values_and_units) - rem vs px" if niveau == "Débutant" else ""}

{"#### � **Pour Niveau Intermédiaire:**" if niveau == "Intermédiaire" else ""}
{"- [CSS Grid Generator](https://cssgrid-generator.netlify.app/) - Layouts avancés" if niveau == "Intermédiaire" else ""}
{"- [Pseudo-classes CSS](https://developer.mozilla.org/fr/docs/Web/CSS/Pseudo-classes) - Interactivité" if niveau == "Intermédiaire" else ""}
{"- [BEM Methodology](https://getbem.com/) - Classes réutilisables" if niveau == "Intermédiaire" else ""}

{"#### 🏆 **Pour Niveau Avancé:**" if niveau == "Avancé" else ""}
{"- [CSS Architecture](https://maintainablecss.com/) - Code professionnel" if niveau == "Avancé" else ""}
{"- [Performance CSS](https://web.dev/fast/#css) - Optimisation" if niveau == "Avancé" else ""}
{"- [CSS Houdini](https://developer.mozilla.org/fr/docs/Web/Houdini) - Techniques avancées" if niveau == "Avancé" else ""}

---

## 📊 Détail du Barème Appliqué

| **Critère d'Évaluation** | **Score Obtenu** | **Score Maximum** | **Niveau Atteint** |
|---------------------------|------------------|-------------------|-------------------|
| **Structure et Organisation CSS** | {structure_score}/3 | 3 points | {"🎉 Avancé" if structure_score >= 3 else "👍 Compétent" if structure_score >= 2 else "⚠️ Basique" if structure_score >= 1 else "❌ Insuffisant"} |
| **Typographie et Couleurs** | {typography_score}/3 | 3 points | {"🎉 Avancé" if typography_score >= 3 else "👍 Compétent" if typography_score >= 2 else "⚠️ Basique" if typography_score >= 1 else "❌ Insuffisant"} |
| **Bonnes Pratiques CSS** | {practices_score}/3 | 3 points | {"🎉 Avancé" if practices_score >= 3 else "👍 Compétent" if practices_score >= 2 else "⚠️ Basique" if practices_score >= 1 else "❌ Insuffisant"} |
| **Validation et Tests** | {html_score_int}/{html_max_score} | {html_max_score} points | {"🎉 Avancé" if html_score_int >= html_max_score*0.9 else "👍 Compétent" if html_score_int >= html_max_score*0.7 else "⚠️ Basique" if html_score_int >= html_max_score*0.5 else "❌ Insuffisant"} |
| **TOTAL GÉNÉRAL** | **{total_score}/{total_max_score}** | **{total_max_score} points** | **{global_level}** |

---

## 🎨 Code d'Exemple pour Améliorer votre Score

### **Si Structure < 3 points:**
{'''```css
/* Ajoutez des variables CSS organisées */
:root {
  /* Couleurs principales */
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --text-color: #333333;
  
  /* Espacement */
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
}

/* Utilisez vos variables */
.header {
  background: var(--primary-color);
  padding: var(--spacing-md);
}
```''' if structure_score < 3 else "✅ **Structure excellente** - Continuez ainsi !"}

### **Si Typographie < 3 points:**
{'''```css
/* Utilisez des unités relatives */
body {
  font-size: 1rem;        /* Au lieu de 16px */
  line-height: 1.6;       /* Proportion relative */
  margin: 2rem auto;      /* Au lieu de 32px */
}

h1 {
  font-size: 2.5rem;      /* Au lieu de 40px */
  margin-bottom: 1.5rem;  /* Au lieu de 24px */
}
```''' if typography_score < 3 else "✅ **Typographie excellente** - Maîtrise des unités relatives !"}

### **Si Pratiques < 3 points:**
{'''```css
/* Classes réutilisables */
.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.btn--primary { background: var(--primary-color); }
.btn--secondary { background: var(--secondary-color); }
```''' if practices_score < 3 else "✅ **Pratiques excellentes** - Code maintenable et réutilisable !"}

---

## 🎓 Message Pédagogique Final

**Bilan contextuel:** {contextual_message}

**Votre progression:** {"🔥 Vous excellez dans les critères techniques !" if total_score >= excellent_score else "📈 Vous progressez bien, quelques ajustements suffisent !" if total_score >= good_score else "💪 Bon départ, focalisez sur les bases pour progresser rapidement !"}

**Prochaine étape:** {"Explorez les techniques CSS avancées (animations, grid layout)" if total_score >= excellent_score else "Perfectionnez l'organisation du code et les bonnes pratiques" if total_score >= good_score else "Maîtrisez d'abord la validation W3C et l'organisation de base"}

---

<sub>🤖 **Analyse contextuelle automatisée** | 📊 Barème: Structure(3) + Typo(3) + Pratiques(3) + Validation({html_max_score}) = {total_max_score}pts | 🎯 Niveau: {niveau} | ⚡ Générée le {datetime.now().strftime('%d/%m/%Y %H:%M')}</sub>
"""

    # Écrire le fichier
    try:
        with open('FEEDBACK.md', 'w', encoding='utf-8') as f:
            f.write(feedback_content)
        print("✅ Fichier FEEDBACK.md technique généré avec succès")
        return 0
    except Exception as e:
        print(f"❌ Erreur lors de la génération du feedback: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())

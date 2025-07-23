#!/bin/bash

# Script de configuration des variables GitHub pour l'évaluation automatique
# Usage: ./setup-github-vars.sh [REPO_OWNER] [REPO_NAME]

REPO_OWNER=${1:-"Jumvi"}
REPO_NAME=${2:-"test-template-feedback"}

echo "🔧 Configuration des variables GitHub pour $REPO_OWNER/$REPO_NAME"

# Vérifier si gh CLI est disponible
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) n'est pas installé. Installez-le avec: https://cli.github.com/"
    exit 1
fi

# Vérifier l'authentification
if ! gh auth status &> /dev/null; then
    echo "❌ Non authentifié avec GitHub. Exécutez: gh auth login"
    exit 1
fi

echo "📊 Configuration des variables d'évaluation..."

# Variables par défaut pour un exercice HTML/CSS
echo "Développement Web HTML/CSS" | gh variable set COMPETENCE --repo "$REPO_OWNER/$REPO_NAME"
echo "Structure HTML (10pts), Style CSS (10pts)" | gh variable set BAREME --repo "$REPO_OWNER/$REPO_NAME"
echo "index.html,style.css" | gh variable set FILES_TO_ANALYZE --repo "$REPO_OWNER/$REPO_NAME"
echo "debutant" | gh variable set NIVEAU --repo "$REPO_OWNER/$REPO_NAME"

echo "✅ Variables configurées avec succès !"
echo ""
echo "📋 Variables créées:"
echo "- COMPETENCE: Développement Web HTML/CSS"
echo "- BAREME: Structure HTML (10pts), Style CSS (10pts)"
echo "- FILES_TO_ANALYZE: index.html,style.css"
echo "- NIVEAU: debutant"
echo ""
echo "🔄 Le workflow s'exécutera automatiquement au prochain push"
echo "📁 Le feedback sera généré dans FEEDBACK.md"

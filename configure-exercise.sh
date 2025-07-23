#!/bin/bash

# Script pour configurer rapidement un exercice
# Usage: ./configure-exercise.sh [nom-template]

TEMPLATE_NAME=${1:-"html-css-basic"}
TEMPLATE_FILE="templates/exercice-${TEMPLATE_NAME}.config"

echo "🎯 Configuration de l'exercice : $TEMPLATE_NAME"

if [ -f "$TEMPLATE_FILE" ]; then
    echo "📄 Template trouvé : $TEMPLATE_FILE"
    cp "$TEMPLATE_FILE" ".evaluation-config"
    echo "✅ Configuration appliquée avec succès !"
    echo ""
    echo "📋 Configuration actuelle :"
    cat .evaluation-config
else
    echo "❌ Template non trouvé : $TEMPLATE_FILE"
    echo ""
    echo "📂 Templates disponibles :"
    ls templates/*.config 2>/dev/null | sed 's/templates\/exercice-//g' | sed 's/.config//g' | while read template; do
        echo "  - $template"
    done
fi

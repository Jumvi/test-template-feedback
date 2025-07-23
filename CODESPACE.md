# Configuration pour GitHub Codespaces

Ce projet est optimisé pour fonctionner dans GitHub Codespaces avec les tokens automatiques.

## 🚀 Lancement avec Codespaces

1. **Créer un Codespace :**
   - Cliquez sur "Code" > "Codespaces" > "Create codespace on main"
   - Ou utilisez le badge : [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/votre-username/ia-workflow)

2. **Le Codespace inclut automatiquement :**
   - ✅ Token GitHub avec permissions appropriées
   - ✅ Node.js et npm pré-installés
   - ✅ Extensions VS Code pour le développement
   - ✅ Configuration MCP prête à l'emploi

## 🔧 Première Configuration

Une fois dans Codespaces, exécutez :

```bash
# Installation des dépendances
npm install

# Compilation du projet
npm run build

# Démarrage du serveur en mode web
npm run start:web
```

## 🌐 Mode Web API

Le serveur peut fonctionner en mode web pour les tests et l'intégration avec Codespaces :

```bash
# Démarrer l'API web sur le port 3000
npm run start:web

# L'API sera accessible via l'URL du Codespace
# https://votre-codespace-3000.app.github.dev
```

## 🔑 Tokens Automatiques

Dans Codespaces, les variables suivantes sont automatiquement disponibles :

- `GITHUB_TOKEN`: Token avec permissions sur votre repository
- `CODESPACE_NAME`: Nom du codespace actuel  
- `GITHUB_REPOSITORY`: Repository courant
- `GITHUB_USER`: Votre nom d'utilisateur GitHub

## 📡 Intégration IA avec Codespaces

Le système utilise l'API GitHub Copilot intégrée à Codespaces pour l'analyse de code :

```javascript
// Les requêtes IA sont traitées via l'extension GitHub Copilot
// Pas besoin de token OpenAI séparé
```

## 🧪 Test Rapide

```bash
# Tester la configuration
npm run test:codespace

# Évaluer un repository d'exemple
npm run eval:example
```

## ⚙️ Variables de Codespace

Configurez ces variables dans votre Codespace si nécessaire :

```bash
# Variables optionnelles (automatiquement définies)
export GITHUB_TOKEN=$GITHUB_TOKEN
export CODESPACE_API_URL="https://$CODESPACE_NAME-3000.app.github.dev"
```

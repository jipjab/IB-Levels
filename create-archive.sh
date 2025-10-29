#!/bin/bash
# Script pour créer une archive avec les fichiers nécessaires pour le serveur

echo "🔨 Création de l'archive pour le serveur..."

tar -czf trading-levels-deploy.tar.gz \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.git' \
  --exclude='*.md' \
  --exclude='.DS_Store' \
  --exclude='.cursor' \
  --exclude='tsconfig.tsbuildinfo' \
  Dockerfile \
  .dockerignore \
  docker-compose.yml \
  package.json \
  package-lock.json \
  next.config.js \
  tsconfig.json \
  tailwind.config.js \
  postcss.config.js \
  next-env.d.ts \
  app/ \
  components/ \
  lib/ \
  2>/dev/null

if [ -f "trading-levels-deploy.tar.gz" ]; then
    echo "✅ Archive créée : trading-levels-deploy.tar.gz"
    echo "📦 Taille : $(ls -lh trading-levels-deploy.tar.gz | awk '{print $5}')"
    echo ""
    echo "📤 Transférez maintenant vers votre serveur avec :"
    echo "   scp trading-levels-deploy.tar.gz votre_utilisateur@votre_serveur:/tmp/"
else
    echo "❌ Erreur lors de la création de l'archive"
    exit 1
fi

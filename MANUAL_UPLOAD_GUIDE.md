# Guide de transfert manuel vers le serveur

## 📦 Liste des fichiers à transférer

### Fichiers Docker (ESSENTIELS)
1. `Dockerfile` - Configuration de l'image Docker
2. `.dockerignore` - Fichiers à exclure du build
3. `docker-compose.yml` - Configuration du container

### Fichiers de configuration (ESSENTIELS)
4. `package.json` - Dépendances npm
5. `package-lock.json` - Versions exactes des dépendances
6. `next.config.js` - Configuration Next.js
7. `tsconfig.json` - Configuration TypeScript
8. `tailwind.config.js` - Configuration Tailwind
9. `postcss.config.js` - Configuration PostCSS

### Code source (ESSENTIEL)
10. Dossier `app/` (tout le contenu)
11. Dossier `components/` (tout le contenu)
12. Dossier `lib/` (tout le contenu)

### Fichiers optionnels mais recommandés
13. `README.md`
14. `.eslintrc.json`

### Fichiers à NE PAS transférer
- ❌ `node_modules/` (sera installé par Docker)
- ❌ `.next/` (sera créé par Docker)
- ❌ `.git/` (pas nécessaire)
- ❌ Fichiers `.md` de documentation (optionnels)
- ❌ `.env.local` (utiliser variables d'environnement Portainer)

---

## 📋 Structure minimale requise sur le serveur

```
/var/www/trading-levels/
├── Dockerfile                    ← ESSENTIEL
├── .dockerignore                 ← ESSENTIEL
├── docker-compose.yml            ← ESSENTIEL
├── package.json                  ← ESSENTIEL
├── package-lock.json             ← ESSENTIEL
├── next.config.js                ← ESSENTIEL
├── tsconfig.json                 ← ESSENTIEL
├── tailwind.config.js            ← ESSENTIEL
├── postcss.config.js             ← ESSENTIEL
├── app/
│   ├── api/
│   │   └── trading-data/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── icon.tsx
│   └── apple-icon.tsx
├── components/
│   ├── AdPlacement.tsx
│   ├── AffiliateLinks.tsx
│   ├── DateSelector.tsx
│   ├── FilterPanel.tsx
│   ├── InitialBalanceCard.tsx
│   ├── InstrumentSelector.tsx
│   ├── Logo.tsx
│   ├── SessionSelector.tsx
│   ├── SocialShare.tsx
│   ├── SponsorsSection.tsx
│   ├── ThemeToggle.tsx
│   ├── TradingChart.tsx
│   └── TradingLevelsTable.tsx
└── lib/
    ├── calculations.ts
    ├── csvExport.ts
    ├── instruments.ts
    ├── sessionBoundaries.ts
    ├── sessionTimes.ts
    ├── types.ts
    ├── useTheme.ts
    └── yahooFinance.ts
```

---

## 🚀 Méthodes de transfert manuel

### Méthode 1 : Via SCP (Recommandée)

#### Étape 1 : Créer une archive compressée (depuis votre Mac)

```bash
cd ~/Documents/Dev/Trading_Levels

# Créer une archive sans node_modules, .next, .git
tar -czf trading-levels.tar.gz \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.git' \
  --exclude='*.md' \
  --exclude='.DS_Store' \
  Dockerfile \
  .dockerignore \
  docker-compose.yml \
  package.json \
  package-lock.json \
  next.config.js \
  tsconfig.json \
  tailwind.config.js \
  postcss.config.js \
  app/ \
  components/ \
  lib/

# Vérifier la taille de l'archive
ls -lh trading-levels.tar.gz
```

#### Étape 2 : Transférer vers le serveur

```bash
# Transférer l'archive
scp trading-levels.tar.gz votre_utilisateur@votre_serveur:/tmp/
```

#### Étape 3 : Décompresser sur le serveur

```bash
# Se connecter au serveur
ssh votre_utilisateur@votre_serveur

# Créer le dossier
sudo mkdir -p /var/www/trading-levels
sudo chown $USER:$USER /var/www/trading-levels

# Décompresser
cd /var/www/trading-levels
tar -xzf /tmp/trading-levels.tar.gz

# Nettoyer
rm /tmp/trading-levels.tar.gz

# Vérifier
ls -la
```

---

### Méthode 2 : Via rsync (Alternative)

```bash
# Depuis votre Mac
rsync -avz \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.git' \
  --exclude='*.md' \
  --exclude='.DS_Store' \
  --include='Dockerfile' \
  --include='.dockerignore' \
  --include='docker-compose.yml' \
  --include='package.json' \
  --include='package-lock.json' \
  --include='*.js' \
  --include='*.ts' \
  --include='*.tsx' \
  --include='*.json' \
  --include='*.css' \
  ~/Documents/Dev/Trading_Levels/ \
  votre_utilisateur@votre_serveur:/var/www/trading-levels/
```

---

### Méthode 3 : Via FTP/SFTP (FileZilla, Cyberduck, etc.)

#### Étape 1 : Connectez-vous avec votre client FTP/SFTP
- Host : `votre_serveur`
- Port : `22` (SFTP)
- Username : `votre_utilisateur`
- Password : votre mot de passe

#### Étape 2 : Créez le dossier
- Naviguez vers `/var/www/`
- Créez le dossier `trading-levels`

#### Étape 3 : Transférez les fichiers
Transférez dans l'ordre :
1. Configuration Docker (`Dockerfile`, `.dockerignore`, `docker-compose.yml`)
2. Configuration npm (`package.json`, `package-lock.json`)
3. Configuration Next.js (`next.config.js`, `tsconfig.json`, etc.)
4. Dossiers `app/`, `components/`, `lib/`

---

### Méthode 4 : Copier-coller manuel (Petits fichiers)

Si vous n'avez que quelques fichiers à modifier :

```bash
# Se connecter au serveur
ssh votre_utilisateur@votre_serveur

# Créer/modifier un fichier
nano /var/www/trading-levels/Dockerfile

# Coller le contenu
# Sauvegarder : Ctrl+O, Enter, Ctrl+X
```

---

## ✅ Vérification après transfert

### Sur le serveur, vérifiez que tout est présent :

```bash
ssh votre_utilisateur@votre_serveur
cd /var/www/trading-levels

# Vérifier les fichiers Docker
ls -la | grep -E "Dockerfile|docker-compose"

# Vérifier package.json
cat package.json

# Vérifier la structure
ls -la app/
ls -la components/
ls -la lib/

# Vérifier next.config.js (doit contenir output: 'standalone')
cat next.config.js | grep standalone
```

Vous devriez voir :
```
output: 'standalone',
```

---

## 🚀 Déployer dans Portainer

Une fois tous les fichiers transférés :

### 1. Dans Portainer
- **Stacks** → **+ Add stack**
- **Name** : `trading-levels`
- **Build method** : **Web editor**

### 2. Coller ce docker-compose.yml :

```yaml
version: '3.8'

services:
  trading-levels:
    build:
      context: /var/www/trading-levels
      dockerfile: Dockerfile
    container_name: trading-levels-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_TELEMETRY_DISABLED=1
    networks:
      - trading-levels-network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

networks:
  trading-levels-network:
    driver: bridge
```

### 3. Cliquez sur "Deploy the stack"

### 4. Suivre les logs
- **Containers** → **trading-levels-app** → **Logs**

---

## 🔧 Troubleshooting

### Problème : "Permission denied"

```bash
ssh votre_utilisateur@votre_serveur
sudo chown -R $USER:$USER /var/www/trading-levels
```

### Problème : "File not found" pendant le build

Vérifiez que tous les fichiers sont présents :
```bash
cd /var/www/trading-levels
find . -name "*.tsx" -o -name "*.ts" -o -name "*.json"
```

### Problème : Build échoue avec "Cannot find module"

Vérifiez que `package.json` et `package-lock.json` sont présents :
```bash
ls -la package*.json
```

---

## 📊 Taille approximative

L'archive complète devrait faire environ :
- Sans compression : ~5-10 MB
- Avec compression : ~2-3 MB

---

## 🎯 Checklist finale

Avant de déployer dans Portainer, vérifiez :

- [ ] `/var/www/trading-levels/Dockerfile` existe
- [ ] `/var/www/trading-levels/.dockerignore` existe
- [ ] `/var/www/trading-levels/docker-compose.yml` existe
- [ ] `/var/www/trading-levels/package.json` existe
- [ ] `/var/www/trading-levels/package-lock.json` existe
- [ ] `/var/www/trading-levels/next.config.js` contient `output: 'standalone'`
- [ ] `/var/www/trading-levels/app/` existe avec tous les fichiers
- [ ] `/var/www/trading-levels/components/` existe avec tous les fichiers
- [ ] `/var/www/trading-levels/lib/` existe avec tous les fichiers
- [ ] Permissions correctes (`ls -la` montre votre user comme propriétaire)

---

## 🚀 Commande de déploiement rapide

Une fois tous les fichiers transférés :

```bash
# Sur le serveur
cd /var/www/trading-levels

# Vérifier la structure
ls -la

# Si tout est OK, builder manuellement pour tester
docker build -t trading-levels:latest .

# Si le build réussit, déployez dans Portainer
```

---

Votre application est maintenant prête à être déployée ! 🎉


# Déploiement depuis GitHub avec Portainer

Guide pour déployer directement depuis votre repository GitHub : https://github.com/jipjab/IB-Levels

---

## 🚀 Méthode 1 : Portainer Repository (RECOMMANDÉE - Aucun fichier à transférer !)

### Étape unique : Créer la Stack dans Portainer

1. **Connectez-vous à Portainer** : `http://votre-serveur:9000`

2. **Stacks** → **+ Add stack**

3. **Configuration** :
   - **Name** : `trading-levels`
   - **Build method** : Sélectionnez **"Repository"** ⭐

4. **Repository configuration** :
   - **Repository URL** : `https://github.com/jipjab/IB-Levels`
   - **Repository reference** : `refs/heads/main`
   - **Compose path** : `docker-compose.yml`
   
5. **Authentication** : Laissez vide (repository public)

6. **Automatic updates** (optionnel mais recommandé) :
   - ✅ **Enable automatic updates**
   - **Polling interval** : `5` minutes

7. **Deploy the stack**

✅ **C'est tout !** Portainer va automatiquement :
- Cloner votre repository GitHub
- Lire le `docker-compose.yml`
- Builder l'image avec le `Dockerfile`
- Lancer le container

---

## 🔄 Mise à jour automatique

Avec l'auto-update activé :
1. Vous pushez du code sur GitHub
2. Portainer détecte le changement (toutes les 5 min)
3. Portainer redéploie automatiquement ! 🎉

**Ou manuellement** :
- **Stacks** → **trading-levels** → **Pull and redeploy** 🔄

---

## 🛠️ Méthode 2 : Docker Compose avec clone Git intégré

Si la Méthode 1 ne fonctionne pas, utilisez cette méthode.

### Étape 1 : Transférer 2 fichiers seulement

**Depuis votre Mac :**

```bash
cd ~/Documents/Dev/Trading_Levels

# Transférer le Dockerfile.git
scp Dockerfile.git votre_utilisateur@votre_serveur:/tmp/Dockerfile

# Transférer docker-compose-github.yml
scp docker-compose-github.yml votre_utilisateur@votre_serveur:/tmp/docker-compose.yml
```

### Étape 2 : Sur le serveur

```bash
# Se connecter
ssh votre_utilisateur@votre_serveur

# Créer un dossier
mkdir -p ~/docker/trading-levels
cd ~/docker/trading-levels

# Déplacer les fichiers
mv /tmp/Dockerfile .
mv /tmp/docker-compose.yml .

# Vérifier
ls -la
```

### Étape 3 : Dans Portainer

1. **Stacks** → **+ Add stack**
2. **Name** : `trading-levels`
3. **Build method** : **Web editor**
4. **Collez ce code** :

```yaml
version: '3.8'

services:
  trading-levels:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        GIT_REPO_URL: https://github.com/jipjab/IB-Levels.git
        GIT_BRANCH: main
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

5. **Éditez la section "Working dir"** pour pointer vers `/home/votre_utilisateur/docker/trading-levels`

6. **Deploy the stack**

Le Dockerfile va automatiquement :
- Cloner depuis GitHub
- Installer les dépendances
- Builder Next.js
- Créer l'image

---

## 🎯 Méthode 3 : Commandes Docker manuelles (Sans Portainer)

Si vous préférez ne pas utiliser Portainer :

```bash
# Sur le serveur
ssh votre_utilisateur@votre_serveur

# Créer un dossier
mkdir -p ~/trading-levels
cd ~/trading-levels

# Créer le Dockerfile qui clone depuis Git
cat > Dockerfile << 'EOF'
FROM node:20-alpine AS base

# Stage 1: Clone depuis Git
FROM base AS git-clone
RUN apk add --no-cache git
WORKDIR /app

ARG GIT_REPO_URL=https://github.com/jipjab/IB-Levels.git
ARG GIT_BRANCH=main

RUN git clone --depth 1 --branch ${GIT_BRANCH} ${GIT_REPO_URL} .

# Stage 2: Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY --from=git-clone /app/package*.json ./
RUN npm ci

# Stage 3: Builder
FROM base AS builder
WORKDIR /app

COPY --from=git-clone /app ./
COPY --from=deps /app/node_modules ./node_modules

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

RUN npm run build

# Stage 4: Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
EOF

# Builder l'image
docker build \
  --build-arg GIT_REPO_URL=https://github.com/jipjab/IB-Levels.git \
  --build-arg GIT_BRANCH=main \
  -t trading-levels:latest .

# Lancer le container
docker run -d \
  --name trading-levels-app \
  --restart unless-stopped \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_TELEMETRY_DISABLED=1 \
  trading-levels:latest

# Voir les logs
docker logs -f trading-levels-app
```

---

## 🔄 Mettre à jour l'application

### Depuis GitHub (toutes les méthodes)

1. **Pushez vos changements sur GitHub** :
```bash
git add .
git commit -m "Update"
git push origin main
```

2. **Redéployez** :

**Avec Portainer (auto-update) :**
- Attendez 5 minutes OU
- **Stacks** → **trading-levels** → **Pull and redeploy**

**Avec Docker manuel :**
```bash
docker stop trading-levels-app
docker rm trading-levels-app
docker rmi trading-levels:latest
docker build --no-cache -t trading-levels:latest .
docker run -d --name trading-levels-app -p 3000:3000 trading-levels:latest
```

---

## 📊 Avantages du déploiement GitHub

✅ **Aucun fichier à transférer** (Méthode 1)  
✅ **Mises à jour automatiques** possibles  
✅ **Historique des versions** avec Git  
✅ **Rollback facile** (changer de branche)  
✅ **Un seul source de vérité** (GitHub)  

---

## 🎯 Résumé - Déploiement en 2 minutes

### La méthode la plus simple (Méthode 1) :

1. **Portainer** → **Stacks** → **+ Add stack**
2. **Repository** :
   - URL : `https://github.com/jipjab/IB-Levels`
   - Reference : `refs/heads/main`
   - Compose path : `docker-compose.yml`
3. ✅ **Enable automatic updates**
4. **Deploy**

**C'est tout ! Votre application se déploie et se met à jour automatiquement depuis GitHub !** 🚀

---

## 🔒 Pour un repository privé

Si vous rendez votre repository privé plus tard :

1. **Créez un Personal Access Token sur GitHub** :
   - GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
   - **Generate new token**
   - **Scopes** : ✅ `repo`
   - Copiez le token

2. **Dans Portainer** :
   - **Authentication** : **Username and password**
   - **Username** : `jipjab`
   - **Password** : Collez votre token

---

## 🆘 Dépannage

### Erreur : "Failed to clone repository"

```bash
# Vérifiez que le repository est accessible
curl -I https://github.com/jipjab/IB-Levels

# Si erreur 404 : le repository est privé, utilisez un token
```

### Erreur : "npm run build failed"

Le `Dockerfile.git` est corrigé et installe toutes les dépendances. Si l'erreur persiste :

```bash
# Vérifiez les logs dans Portainer
# Containers → trading-levels-app → Logs
```

### Build trop long

Le premier build prend 3-5 minutes (normal). Les builds suivants utilisent le cache Docker et sont plus rapides.

---

## ✅ Checklist

- [ ] Repository GitHub accessible : https://github.com/jipjab/IB-Levels
- [ ] Portainer ouvert et connecté
- [ ] Stack créée avec Repository URL
- [ ] Auto-update activé (optionnel)
- [ ] Container running (vert)
- [ ] Application accessible sur :3000
- [ ] Logs sans erreurs

**Votre application Trading Levels se déploie maintenant automatiquement depuis GitHub ! 🎉**


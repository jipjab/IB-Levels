# Guide de déploiement Portainer - Trading Levels

Ce guide vous explique comment déployer votre application Next.js Trading Levels via Portainer.

## Prérequis

- Portainer déjà installé et configuré ✅
- Accès à l'interface web Portainer
- Les fichiers du projet disponibles sur le serveur

---

## Méthode 1 : Déploiement via Stack (Recommandé)

Cette méthode utilise le fichier `docker-compose.yml` directement dans Portainer.

### Étape 1 : Transférer le projet sur le serveur

Depuis votre machine locale :

```bash
# Option A : Via rsync
rsync -avz --exclude='node_modules' --exclude='.next' --exclude='.git' \
  ~/Documents/Dev/Trading_Levels/ \
  votre_utilisateur@votre_serveur:/var/www/trading-levels/

# Option B : Via SCP
cd ~/Documents/Dev/Trading_Levels
tar -czf trading-levels.tar.gz --exclude=node_modules --exclude=.next --exclude=.git .
scp trading-levels.tar.gz votre_utilisateur@votre_serveur:/tmp/
```

Si vous utilisez SCP, décompressez sur le serveur :
```bash
ssh votre_utilisateur@votre_serveur
sudo mkdir -p /var/www/trading-levels
sudo chown $USER:$USER /var/www/trading-levels
cd /var/www/trading-levels
tar -xzf /tmp/trading-levels.tar.gz
rm /tmp/trading-levels.tar.gz
```

### Étape 2 : Créer la Stack dans Portainer

1. **Connectez-vous à Portainer** : `http://votre-serveur:9000` (ou 9443)

2. **Sélectionnez votre environnement** (local, ou le nom de votre serveur)

3. **Allez dans "Stacks"** dans le menu de gauche

4. **Cliquez sur "+ Add stack"**

5. **Remplissez les informations** :
   - **Name** : `trading-levels`
   - **Build method** : Sélectionnez "Web editor"

6. **Copiez ce docker-compose dans l'éditeur** :

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

7. **Variables d'environnement** (Optionnel) :
   - Si vous avez besoin de variables d'environnement, cliquez sur "+ Add an environment variable"
   - Ajoutez vos variables une par une

8. **Cliquez sur "Deploy the stack"**

9. **Attendez que le build se termine** (cela peut prendre 2-5 minutes)

### Étape 3 : Vérifier le déploiement

1. Dans Portainer, allez dans **"Containers"**
2. Vous devriez voir **"trading-levels-app"** avec un statut **"running"** (vert)
3. Cliquez sur le container pour voir les détails
4. Cliquez sur **"Logs"** pour voir les logs en temps réel
5. Visitez `http://votre-serveur:3000` pour accéder à l'application

---

## Méthode 2 : Déploiement via Stack avec Git (Avancé)

Si votre projet est sur GitHub/GitLab et public ou avec accès configuré.

### Étape 1 : Dans Portainer

1. **Stacks** > **+ Add stack**
2. **Name** : `trading-levels`
3. **Build method** : Sélectionnez **"Repository"**
4. **Repository URL** : `https://github.com/votre-username/trading-levels.git`
5. **Repository reference** : `refs/heads/main` (ou votre branche)
6. **Compose path** : `docker-compose.yml`
7. **Cliquez sur "Deploy the stack"**

Cette méthode permet de redéployer facilement en cliquant sur "Pull and redeploy".

---

## Méthode 3 : Déploiement manuel de l'image

Si vous préférez construire l'image avant de la déployer.

### Étape 1 : Construire l'image sur le serveur

```bash
ssh votre_utilisateur@votre_serveur
cd /var/www/trading-levels
docker build -t trading-levels:latest .
```

### Étape 2 : Créer le container dans Portainer

1. **Containers** > **+ Add container**

2. **Configuration de base** :
   - **Name** : `trading-levels-app`
   - **Image** : `trading-levels:latest`

3. **Network ports configuration** :
   - Cliquez sur **"+ publish a new network port"**
   - **host** : `3000`
   - **container** : `3000`

4. **Advanced container settings** :
   - **Env** (onglet) :
     - `NODE_ENV` = `production`
     - `NEXT_TELEMETRY_DISABLED` = `1`
   
   - **Restart policy** (onglet) :
     - Sélectionnez **"Unless stopped"**

5. **Cliquez sur "Deploy the container"**

---

## Configuration avec Nginx Proxy Manager (si disponible)

Si vous utilisez Nginx Proxy Manager avec Portainer :

### Dans Nginx Proxy Manager :

1. **Hosts** > **Proxy Hosts** > **Add Proxy Host**

2. **Details** :
   - **Domain Names** : `trading-levels.votre-domaine.com`
   - **Scheme** : `http`
   - **Forward Hostname/IP** : `trading-levels-app` (nom du container)
   - **Forward Port** : `3000`
   - ✅ **Block Common Exploits**
   - ✅ **Websockets Support**

3. **SSL** :
   - **SSL Certificate** : Request a new SSL Certificate with Let's Encrypt
   - ✅ **Force SSL**
   - ✅ **HTTP/2 Support**

4. **Save**

Votre application sera accessible sur `https://trading-levels.votre-domaine.com`

---

## Configuration avec Traefik (si disponible)

Si vous utilisez Traefik comme reverse proxy, ajoutez ces labels au docker-compose :

```yaml
services:
  trading-levels:
    build:
      context: /var/www/trading-levels
      dockerfile: Dockerfile
    container_name: trading-levels-app
    restart: unless-stopped
    networks:
      - traefik
      - trading-levels-network
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.trading-levels.rule=Host(`trading-levels.votre-domaine.com`)"
      - "traefik.http.routers.trading-levels.entrypoints=websecure"
      - "traefik.http.routers.trading-levels.tls.certresolver=letsencrypt"
      - "traefik.http.services.trading-levels.loadbalancer.server.port=3000"
    environment:
      - NODE_ENV=production
      - NEXT_TELEMETRY_DISABLED=1
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

networks:
  traefik:
    external: true
  trading-levels-network:
    driver: bridge
```

---

## Gestion via Portainer

### Voir les logs
1. **Containers** > **trading-levels-app**
2. Cliquez sur **"Logs"**
3. Activez **"Auto-refresh logs"** pour voir en temps réel

### Redémarrer le container
1. **Containers** > **trading-levels-app**
2. Cliquez sur **"Restart"**

### Arrêter/Démarrer
1. **Containers** > **trading-levels-app**
2. Cliquez sur **"Stop"** ou **"Start"**

### Voir les statistiques
1. **Containers** > **trading-levels-app**
2. Cliquez sur **"Stats"**
3. Vous verrez l'utilisation CPU, RAM, réseau, etc.

### Accéder au terminal du container
1. **Containers** > **trading-levels-app**
2. Cliquez sur **"Console"**
3. Sélectionnez **"/bin/sh"**
4. Cliquez sur **"Connect"**

---

## Mettre à jour l'application

### Méthode 1 : Via la Stack (si déployé avec Stack)

1. Mettez à jour les fichiers sur le serveur :
```bash
ssh votre_utilisateur@votre_serveur
cd /var/www/trading-levels
git pull  # si vous utilisez Git
# ou transférez les nouveaux fichiers
```

2. Dans Portainer :
   - **Stacks** > **trading-levels**
   - Cliquez sur **"Update the stack"** (ou l'icône de rafraîchissement)
   - Cochez **"Re-pull image and redeploy"**
   - Cliquez sur **"Update"**

### Méthode 2 : Via le container

1. Mettez à jour les fichiers sur le serveur
2. Reconstruisez l'image :
```bash
ssh votre_utilisateur@votre_serveur
cd /var/www/trading-levels
docker build -t trading-levels:latest .
```

3. Dans Portainer :
   - **Containers** > **trading-levels-app**
   - Cliquez sur **"Recreate"**
   - Cochez **"Pull latest image"**
   - Cliquez sur **"Recreate"**

---

## Sauvegardes

### Créer un volume pour les données persistantes (si nécessaire)

Dans votre docker-compose, ajoutez :

```yaml
services:
  trading-levels:
    # ... autres configurations
    volumes:
      - trading-levels-data:/app/data

volumes:
  trading-levels-data:
```

### Sauvegarder via Portainer

1. **Volumes** > **trading-levels-data**
2. Cliquez sur **"Browse"**
3. Téléchargez les fichiers importants

---

## Monitoring avec Portainer

### Configurer les alertes (Portainer Business Edition)

1. **Settings** > **Notifications**
2. Configurez un webhook ou email
3. Créez des alertes pour :
   - Container arrêté
   - Utilisation CPU/RAM élevée
   - Erreurs dans les logs

### Voir les événements

1. **Home** > **Votre environnement**
2. Cliquez sur **"Events"**
3. Vous verrez tous les événements Docker

---

## Intégration avec les autres containers

Si vous avez d'autres applications dans Portainer, vous pouvez les connecter :

### Partager un réseau
```yaml
networks:
  shared-network:
    external: true
    name: mon-reseau-existant
```

### Exemple : Partager une base de données
```yaml
services:
  trading-levels:
    # ... autres configurations
    networks:
      - database-network
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres-container:5432/db

networks:
  database-network:
    external: true
```

---

## Dépannage dans Portainer

### Le container ne démarre pas

1. **Containers** > **trading-levels-app**
2. Vérifiez le **Status** et l'**Exit Code**
3. Regardez les **Logs** pour voir l'erreur
4. Vérifiez la **Config** > **Env** pour les variables d'environnement

### Problèmes de réseau

1. **Networks**
2. Vérifiez que votre network existe et est attaché
3. Vérifiez les **Port Mapping** dans la config du container

### Problèmes de build

Si le build échoue :
1. Construisez manuellement via SSH pour voir l'erreur complète :
```bash
ssh votre_utilisateur@votre_serveur
cd /var/www/trading-levels
docker build -t trading-levels:latest .
```

### Vider le cache de build

```bash
ssh votre_utilisateur@votre_serveur
cd /var/www/trading-levels
docker build --no-cache -t trading-levels:latest .
```

---

## Commandes SSH utiles (si besoin)

```bash
# Voir tous les containers
docker ps -a

# Voir les logs d'un container
docker logs -f trading-levels-app

# Redémarrer un container
docker restart trading-levels-app

# Entrer dans le container
docker exec -it trading-levels-app sh

# Voir l'utilisation des ressources
docker stats trading-levels-app

# Nettoyer les images inutilisées
docker system prune -a
```

---

## Structure recommandée pour Portainer

```
/var/www/
└── trading-levels/
    ├── Dockerfile
    ├── .dockerignore
    ├── docker-compose.yml
    ├── package.json
    ├── next.config.js
    └── [autres fichiers du projet]
```

---

## Checklist de déploiement

- [ ] Fichiers du projet transférés sur le serveur
- [ ] Stack créée dans Portainer
- [ ] Container démarré avec succès
- [ ] Application accessible sur le port 3000
- [ ] Logs vérifiés (pas d'erreurs)
- [ ] Reverse proxy configuré (Nginx/Traefik)
- [ ] SSL configuré (si nécessaire)
- [ ] Tests de l'application effectués
- [ ] Politique de redémarrage configurée

---

## Résumé rapide

**Déploiement en 5 étapes simples :**

1. **Transférer les fichiers** → `/var/www/trading-levels/`
2. **Portainer** → **Stacks** → **+ Add stack**
3. **Copier le docker-compose.yml**
4. **Deploy the stack**
5. **Vérifier les logs et tester** → `http://votre-serveur:3000`

C'est tout ! Votre application Trading Levels tourne maintenant dans Portainer ! 🚀

---

## Support

Pour toute question ou problème :
- Consultez les logs dans Portainer
- Vérifiez la configuration du container
- Utilisez les commandes SSH de dépannage
- Vérifiez que le port 3000 est accessible

Bon déploiement ! 🎯


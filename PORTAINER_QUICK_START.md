# Déploiement rapide Portainer - Trading Levels

## 🚀 En 5 minutes

### 1️⃣ Transférer les fichiers sur le serveur

**Depuis votre Mac :**
```bash
cd ~/Documents/Dev/Trading_Levels
rsync -avz --exclude='node_modules' --exclude='.next' --exclude='.git' \
  . votre_utilisateur@votre_serveur:/var/www/trading-levels/
```

### 2️⃣ Dans Portainer

1. Ouvrez Portainer : `http://votre-serveur:9000`
2. **Stacks** → **+ Add stack**
3. **Name** : `trading-levels`
4. **Web editor** → Collez ce code :

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

5. **Deploy the stack**
6. Attendez 2-5 minutes (build en cours)

### 3️⃣ Vérifier

- **Containers** → `trading-levels-app` doit être **"running"** (vert)
- **Logs** → Vérifiez qu'il n'y a pas d'erreurs
- Visitez : `http://votre-serveur:3000` ✅

---

## 🔄 Mise à jour

```bash
# 1. Transférer les nouveaux fichiers
rsync -avz --exclude='node_modules' --exclude='.next' --exclude='.git' \
  ~/Documents/Dev/Trading_Levels/ \
  votre_utilisateur@votre_serveur:/var/www/trading-levels/

# 2. Dans Portainer : Stacks → trading-levels → Update → Re-pull and redeploy
```

---

## 🛠️ Commandes utiles

**Voir les logs :**
- Portainer → Containers → trading-levels-app → Logs

**Redémarrer :**
- Portainer → Containers → trading-levels-app → Restart

**Terminal du container :**
- Portainer → Containers → trading-levels-app → Console → Connect

---

## 📋 Avec Nginx Proxy Manager

Si vous utilisez NPM pour le reverse proxy :

1. **Proxy Hosts** → **Add Proxy Host**
2. **Domain** : `trading.votre-domaine.com`
3. **Forward to** : `trading-levels-app:3000`
4. **SSL** : Request Let's Encrypt certificate
5. **Save**

Accès : `https://trading.votre-domaine.com` 🔐

---

## 🔍 Dépannage rapide

**Container ne démarre pas ?**
```bash
ssh votre_utilisateur@votre_serveur
cd /var/www/trading-levels
docker build -t trading-levels:latest .
# Regardez les erreurs
```

**Port 3000 occupé ?**
- Changez `"3000:3000"` en `"3001:3000"` dans le docker-compose
- Accédez via : `http://votre-serveur:3001`

**Vider le cache de build :**
```bash
ssh votre_utilisateur@votre_serveur
cd /var/www/trading-levels
docker build --no-cache -t trading-levels:latest .
```

---

## ✅ Checklist

- [ ] Fichiers transférés
- [ ] Stack créée dans Portainer
- [ ] Container running (vert)
- [ ] App accessible sur :3000
- [ ] Pas d'erreurs dans les logs

**C'est tout ! 🎉**

Pour plus de détails, consultez `PORTAINER_DEPLOYMENT.md`


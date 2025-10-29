# Déploiement depuis Git - Trading Levels

Ce guide explique comment déployer votre application en clonant directement depuis Git.

---

## 🚀 Méthode 1 : Portainer + Git (RECOMMANDÉE)

### Étape 1 : Pusher votre code sur Git

```bash
cd ~/Documents/Dev/Trading_Levels

# Initialiser git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Commit
git commit -m "Setup Docker deployment"

# Ajouter votre remote (remplacez par votre URL)
git remote add origin https://github.com/votre-username/trading-levels.git

# Push
git push -u origin main
```

### Étape 2 : Déployer dans Portainer

1. **Connectez-vous à Portainer** : `http://votre-serveur:9000`

2. **Stacks** → **+ Add stack**

3. **Configuration** :
   - **Name** : `trading-levels`
   - **Build method** : Sélectionnez **"Repository"** ⭐
   
4. **Repository configuration** :
   - **Repository URL** : `https://github.com/votre-username/trading-levels.git`
   - **Repository reference** : `refs/heads/main`
   - **Compose path** : `docker-compose.yml`
   
5. **Authentication** (si repository privé) :
   - Username : votre username Git
   - Personal access token : votre token Git
   
6. **Automatic updates** (optionnel) :
   - ✅ **Enable** pour auto-pull les mises à jour
   - **Polling interval** : 5 minutes (ou selon préférence)

7. **Deploy the stack**

✅ Portainer va automatiquement :
- Cloner votre repository
- Lire le docker-compose.yml
- Builder l'image avec le Dockerfile
- Lancer le container

### Mise à jour automatique

Quand vous pushez des modifications :
1. Portainer détecte automatiquement le changement (si auto-update activé)
2. Ou manuellement : **Stacks** → **trading-levels** → **Pull and redeploy** 🔄

---

## 🔐 Pour un repository privé

### Créer un Personal Access Token

**GitHub :**
1. **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. **Generate new token**
3. **Scopes** : ✅ `repo` (Full control)
4. Copiez le token

**GitLab :**
1. **Preferences** → **Access Tokens**
2. **Add new token**
3. **Scopes** : ✅ `read_repository`
4. Copiez le token

### Dans Portainer

Quand vous configurez la Stack :
- **Authentication** → **Username and password**
- **Username** : votre username Git
- **Password** : collez votre Personal Access Token

---

## 🛠️ Méthode 2 : Dockerfile qui clone depuis Git

Si vous préférez que le Dockerfile clone directement depuis Git.

### Utiliser les fichiers créés

J'ai créé deux fichiers pour vous :
- **`Dockerfile.git`** - Dockerfile qui clone depuis Git
- **`docker-compose.git.yml`** - Docker-compose correspondant

### Étape 1 : Modifier les URLs

Éditez `docker-compose.git.yml` :

```yaml
services:
  trading-levels:
    build:
      context: .
      dockerfile: Dockerfile.git
      args:
        # 👇 REMPLACEZ PAR VOTRE URL
        GIT_REPO_URL: https://github.com/votre-username/trading-levels.git
        GIT_BRANCH: main
```

### Étape 2 : Transférer sur le serveur

Vous n'avez besoin que de 2 fichiers :

```bash
# Depuis votre Mac
scp ~/Documents/Dev/Trading_Levels/Dockerfile.git \
    votre_utilisateur@votre_serveur:/var/www/trading-levels/Dockerfile

scp ~/Documents/Dev/Trading_Levels/docker-compose.git.yml \
    votre_utilisateur@votre_serveur:/var/www/trading-levels/docker-compose.yml
```

### Étape 3 : Dans Portainer

1. **Stacks** → **+ Add stack**
2. **Name** : `trading-levels`
3. **Web editor** → Collez le contenu de `docker-compose.git.yml`
4. **Deploy**

Le build va cloner automatiquement depuis Git.

### Mise à jour

Pour mettre à jour :
```bash
# Dans Portainer : Stacks → trading-levels → Update → Re-pull and redeploy
```

Le container va re-cloner la dernière version depuis Git.

---

## 📦 Méthode 3 : Builder l'image localement et pusher sur Docker Hub

### Étape 1 : Builder localement

```bash
cd ~/Documents/Dev/Trading_Levels

# Builder l'image
docker build -t votre-username/trading-levels:latest .

# Login sur Docker Hub
docker login

# Push l'image
docker push votre-username/trading-levels:latest
```

### Étape 2 : Docker-compose simplifié

Créez ce docker-compose.yml :

```yaml
version: '3.8'

services:
  trading-levels:
    image: votre-username/trading-levels:latest
    container_name: trading-levels-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_TELEMETRY_DISABLED=1
    networks:
      - trading-levels-network

networks:
  trading-levels-network:
    driver: bridge
```

### Étape 3 : Dans Portainer

Utilisez ce docker-compose - pas besoin de Dockerfile sur le serveur !

### Mise à jour

```bash
# Localement : rebuild et push
docker build -t votre-username/trading-levels:latest .
docker push votre-username/trading-levels:latest

# Dans Portainer : Pull and redeploy
```

---

## 🔄 Comparaison des méthodes

| Méthode | Avantages | Inconvénients |
|---------|-----------|---------------|
| **Portainer + Git** | ✅ Plus simple<br>✅ Auto-update<br>✅ Rien à transférer | ❌ Repository doit être accessible |
| **Dockerfile.git** | ✅ Clone à chaque build<br>✅ Toujours à jour | ❌ Build plus long<br>❌ Repository doit être public |
| **Docker Hub** | ✅ Déploiement ultra-rapide<br>✅ Image pré-compilée | ❌ Besoin de builder localement<br>❌ Étape supplémentaire |

---

## 🎯 Ma recommandation

**Utilisez la Méthode 1 (Portainer + Git)** si :
- Votre code est sur GitHub/GitLab
- Vous voulez déployer facilement
- Vous voulez des mises à jour automatiques

**Étapes simples :**
1. Push votre code sur GitHub
2. Dans Portainer : Stacks → Repository → Entrez l'URL
3. Deploy
4. Terminé ! 🎉

---

## 📝 Fichier .gitignore recommandé

Assurez-vous d'avoir un `.gitignore` :

```
# Dependencies
node_modules
package-lock.json

# Next.js
.next
out
dist

# Environment
.env
.env*.local

# OS
.DS_Store
Thumbs.db

# IDE
.vscode
.idea

# Logs
*.log
npm-debug.log*
```

---

## 🔒 Sécurité

**JAMAIS** committer :
- ❌ Les fichiers `.env` avec des secrets
- ❌ Les clés API
- ❌ Les tokens d'authentification
- ❌ Les mots de passe

Utilisez les **variables d'environnement** dans Portainer à la place.

---

## ❓ Besoin d'aide ?

**Repository privé ?**
- Créez un Personal Access Token
- Utilisez-le dans Portainer comme mot de passe

**Erreur de clone ?**
- Vérifiez que l'URL est correcte
- Vérifiez vos credentials
- Pour SSH : configurez les clés sur le serveur

**Build échoue ?**
- Vérifiez les logs dans Portainer
- Assurez-vous que tous les fichiers sont committés
- Vérifiez le `next.config.js` (doit avoir `output: 'standalone'`)

---

## ✅ Checklist

- [ ] Code pushé sur Git (GitHub/GitLab)
- [ ] `.gitignore` configuré
- [ ] `next.config.js` a `output: 'standalone'`
- [ ] Dockerfile et docker-compose.yml committés
- [ ] Stack créée dans Portainer avec Repository URL
- [ ] Container démarré avec succès
- [ ] Application accessible

**Votre application se déploie maintenant directement depuis Git ! 🚀**


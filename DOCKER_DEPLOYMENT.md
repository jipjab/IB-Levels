# Guide de déploiement Docker - Trading Levels

Ce guide vous explique comment déployer votre application Next.js Trading Levels sur un serveur avec Docker.

## Prérequis sur votre serveur

Votre serveur doit avoir :
- Docker installé
- Docker Compose installé
- Git installé (pour cloner le projet)
- Port 3000 ouvert (ou un autre port de votre choix)

---

## Étape 1 : Installer Docker sur le serveur

Connectez-vous à votre serveur via SSH :
```bash
ssh votre_utilisateur@votre_serveur
```

### Pour Ubuntu/Debian :
```bash
# Mettre à jour le système
sudo apt update
sudo apt upgrade -y

# Installer Docker
sudo apt install -y docker.io

# Démarrer et activer Docker
sudo systemctl start docker
sudo systemctl enable docker

# Installer Docker Compose
sudo apt install -y docker-compose

# Ajouter votre utilisateur au groupe docker (pour éviter d'utiliser sudo)
sudo usermod -aG docker $USER

# Déconnectez-vous et reconnectez-vous pour appliquer les changements
exit
```

### Pour CentOS/RHEL :
```bash
# Mettre à jour le système
sudo yum update -y

# Installer Docker
sudo yum install -y docker

# Démarrer et activer Docker
sudo systemctl start docker
sudo systemctl enable docker

# Installer Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Ajouter votre utilisateur au groupe docker
sudo usermod -aG docker $USER

# Déconnectez-vous et reconnectez-vous
exit
```

Reconnectez-vous au serveur après l'installation.

---

## Étape 2 : Transférer votre projet sur le serveur

### Option A : Via Git (Recommandé)

Si votre projet est sur GitHub/GitLab :
```bash
# Sur le serveur
cd /var/www  # ou le dossier de votre choix
sudo mkdir -p trading-levels
sudo chown $USER:$USER trading-levels
cd trading-levels

# Cloner votre repository
git clone https://github.com/votre-username/trading-levels.git .
```

### Option B : Via SCP (depuis votre machine locale)

Depuis votre machine locale (dans le dossier du projet) :
```bash
# Compresser le projet
tar -czf trading-levels.tar.gz --exclude=node_modules --exclude=.next --exclude=.git .

# Transférer sur le serveur
scp trading-levels.tar.gz votre_utilisateur@votre_serveur:/tmp/

# Sur le serveur
ssh votre_utilisateur@votre_serveur
cd /var/www
sudo mkdir -p trading-levels
sudo chown $USER:$USER trading-levels
cd trading-levels
tar -xzf /tmp/trading-levels.tar.gz
rm /tmp/trading-levels.tar.gz
```

### Option C : Via rsync (depuis votre machine locale)

```bash
# Depuis votre machine locale
rsync -avz --exclude='node_modules' --exclude='.next' --exclude='.git' \
  ~/Documents/Dev/Trading_Levels/ \
  votre_utilisateur@votre_serveur:/var/www/trading-levels/
```

---

## Étape 3 : Configurer les variables d'environnement (si nécessaire)

Sur le serveur, créez un fichier `.env.production` si vous avez des variables d'environnement :

```bash
cd /var/www/trading-levels
nano .env.production
```

Ajoutez vos variables :
```
NODE_ENV=production
# Ajoutez d'autres variables si nécessaire
```

Puis décommentez la section `env_file` dans `docker-compose.yml`.

---

## Étape 4 : Construire et lancer l'application

```bash
cd /var/www/trading-levels

# Construire l'image Docker (première fois ou après modifications)
docker-compose build

# Lancer l'application en arrière-plan
docker-compose up -d

# Vérifier que le container tourne
docker-compose ps

# Voir les logs
docker-compose logs -f
```

Votre application devrait maintenant être accessible sur `http://votre_serveur:3000`

---

## Étape 5 : Configurer Nginx comme reverse proxy (Recommandé pour production)

### Installer Nginx
```bash
sudo apt install -y nginx  # Ubuntu/Debian
# ou
sudo yum install -y nginx  # CentOS/RHEL
```

### Créer la configuration Nginx
```bash
sudo nano /etc/nginx/sites-available/trading-levels
```

Ajoutez cette configuration :
```nginx
server {
    listen 80;
    server_name votre-domaine.com;  # Remplacez par votre domaine

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Activer la configuration
```bash
# Créer un lien symbolique
sudo ln -s /etc/nginx/sites-available/trading-levels /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

---

## Étape 6 : Configurer SSL avec Let's Encrypt (Recommandé)

```bash
# Installer Certbot
sudo apt install -y certbot python3-certbot-nginx  # Ubuntu/Debian
# ou
sudo yum install -y certbot python3-certbot-nginx  # CentOS/RHEL

# Obtenir un certificat SSL
sudo certbot --nginx -d votre-domaine.com

# Le certificat se renouvellera automatiquement
```

Votre site sera maintenant accessible sur `https://votre-domaine.com`

---

## Commandes utiles pour gérer l'application

### Voir les logs
```bash
cd /var/www/trading-levels
docker-compose logs -f
```

### Arrêter l'application
```bash
docker-compose down
```

### Redémarrer l'application
```bash
docker-compose restart
```

### Mettre à jour l'application
```bash
# Récupérer les dernières modifications (si Git)
git pull

# Reconstruire et relancer
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Nettoyer les images Docker inutilisées
```bash
docker system prune -a
```

### Voir l'utilisation des ressources
```bash
docker stats
```

---

## Configuration du pare-feu

### UFW (Ubuntu/Debian)
```bash
# Autoriser SSH, HTTP et HTTPS
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
sudo ufw status
```

### Firewalld (CentOS/RHEL)
```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

---

## Monitoring et maintenance

### Configurer les logs
Pour éviter que les logs Docker ne remplissent le disque :

```bash
sudo nano /etc/docker/daemon.json
```

Ajoutez :
```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

Puis redémarrez Docker :
```bash
sudo systemctl restart docker
docker-compose up -d
```

### Configurer les mises à jour automatiques
```bash
# Ubuntu/Debian
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

---

## Dépannage

### Le container ne démarre pas
```bash
docker-compose logs
docker-compose down
docker-compose up
```

### L'application n'est pas accessible
```bash
# Vérifier que le port est ouvert
sudo netstat -tulpn | grep 3000

# Vérifier le statut de Nginx
sudo systemctl status nginx

# Voir les logs Nginx
sudo tail -f /var/log/nginx/error.log
```

### Problèmes de mémoire
Ajoutez des limites dans `docker-compose.yml` :
```yaml
services:
  trading-levels:
    # ... autres configurations
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
```

---

## Sauvegardes

### Créer un script de sauvegarde
```bash
sudo nano /usr/local/bin/backup-trading-levels.sh
```

Contenu :
```bash
#!/bin/bash
BACKUP_DIR="/backup/trading-levels"
SOURCE_DIR="/var/www/trading-levels"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz -C $SOURCE_DIR .

# Garder seulement les 7 dernières sauvegardes
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete
```

Rendez-le exécutable :
```bash
sudo chmod +x /usr/local/bin/backup-trading-levels.sh
```

Ajoutez une tâche cron :
```bash
sudo crontab -e
```

Ajoutez cette ligne pour une sauvegarde quotidienne à 2h du matin :
```
0 2 * * * /usr/local/bin/backup-trading-levels.sh
```

---

## Résumé des commandes essentielles

```bash
# Démarrer l'application
docker-compose up -d

# Arrêter l'application
docker-compose down

# Voir les logs
docker-compose logs -f

# Redémarrer
docker-compose restart

# Mettre à jour
git pull && docker-compose build && docker-compose up -d
```

---

## Support

En cas de problème, vérifiez :
1. Les logs Docker : `docker-compose logs`
2. Les logs Nginx : `sudo tail -f /var/log/nginx/error.log`
3. L'espace disque : `df -h`
4. La mémoire : `free -h`
5. Les processus : `docker ps -a`

Votre application Trading Levels est maintenant déployée et prête pour la production ! 🚀


# Dépannage des erreurs Portainer

Ce guide résout les erreurs communes de Portainer que vous rencontrez.

---

## 🔴 Erreurs actuelles visibles

1. **"Unable to retrieve containers"**
2. **"Unable to remove image: conflict"** - Image utilisée par un container arrêté
3. **"Unable to get container logs"** - Container inexistant
4. **"Unable to retrieve application settings"**

---

## 🛠️ Solution rapide (via SSH)

Connectez-vous à votre serveur et exécutez ces commandes :

### Étape 1 : Nettoyer les containers arrêtés

```bash
ssh votre_utilisateur@votre_serveur

# Voir tous les containers (même arrêtés)
docker ps -a

# Supprimer TOUS les containers arrêtés
docker container prune -f

# Ou supprimer un container spécifique
docker rm 04655433faa9  # ID du container problématique
```

### Étape 2 : Nettoyer les images inutilisées

```bash
# Supprimer les images non utilisées
docker image prune -a -f

# Nettoyer tout (images, containers, volumes, networks)
docker system prune -a --volumes -f
```

### Étape 3 : Redémarrer Docker

```bash
# Redémarrer le service Docker
sudo systemctl restart docker

# Attendre 10 secondes
sleep 10

# Vérifier que Docker fonctionne
docker ps
```

### Étape 4 : Redémarrer Portainer

```bash
# Redémarrer le container Portainer
docker restart portainer

# Ou si Portainer est dans une stack
docker-compose -f /chemin/vers/portainer/docker-compose.yml restart
```

### Étape 5 : Vérifier l'état

```bash
# Voir les containers en cours d'exécution
docker ps

# Voir l'utilisation du disque
docker system df

# Voir les logs Docker
sudo journalctl -u docker -n 50
```

---

## 🖥️ Solution via Portainer (Interface Web)

### Nettoyer les containers

1. **Containers** (menu gauche)
2. Cochez tous les containers avec statut **"Exited"** ou **"Stopped"**
3. Cliquez sur **"Remove"**
4. Cochez **"Automatically remove non-persistent volumes"**
5. Confirmez

### Nettoyer les images

1. **Images** (menu gauche)
2. Triez par **"Used"** → Regardez celles marquées **"Unused"**
3. Cochez les images non utilisées
4. Cliquez sur **"Remove"**
5. Cochez **"Force"** si nécessaire
6. Confirmez

### Vider les notifications d'erreur

1. **Notifications** (icône cloche en haut)
2. Cliquez sur **"Clear all"** (si disponible)
3. Ou fermez chaque notification individuellement

---

## 🔧 Commandes de diagnostic

### Vérifier l'espace disque

```bash
# Espace disque général
df -h

# Espace utilisé par Docker
docker system df -v

# Voir les gros containers
docker ps -as
```

### Vérifier les erreurs Docker

```bash
# Logs du service Docker
sudo journalctl -u docker --since "1 hour ago"

# Statut de Docker
sudo systemctl status docker

# Version de Docker
docker version
```

### Inspecter un container problématique

```bash
# Voir les détails d'un container
docker inspect 04655433faa9

# Voir pourquoi un container s'est arrêté
docker logs 04655433faa9

# Voir l'exit code
docker inspect 04655433faa9 | grep -A 5 "State"
```

---

## 🚨 Erreur spécifique : "Unable to retrieve containers"

Cette erreur signifie généralement que Portainer ne peut pas communiquer avec Docker.

### Solution :

```bash
# Vérifier que Docker fonctionne
sudo systemctl status docker

# Si Docker est arrêté, le démarrer
sudo systemctl start docker

# Redémarrer Portainer
docker restart portainer

# Vérifier les permissions
sudo usermod -aG docker $USER
```

---

## 🚨 Erreur spécifique : "Image being used by stopped container"

Cette erreur signifie qu'une image ne peut pas être supprimée car un container arrêté l'utilise.

### Solution :

```bash
# Trouver quel container utilise l'image
docker ps -a --filter "ancestor=4ba5e84a7e03"

# Supprimer le container
docker rm -f 04655433faa9

# Maintenant supprimer l'image
docker rmi 4ba5e84a7e03

# Ou forcer la suppression
docker rmi -f 4ba5e84a7e03
```

---

## 🚨 Erreur : "No such container"

Le container a été supprimé mais Portainer a encore des références.

### Solution :

```bash
# Redémarrer Portainer pour rafraîchir la base de données
docker restart portainer

# Ou nettoyer la base de données Portainer (ATTENTION : perd les configurations)
docker stop portainer
docker rm portainer

# Redémarrer Portainer (il recréera sa base de données)
docker run -d -p 9000:9000 \
  --name=portainer --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest
```

---

## 🧹 Nettoyage complet (Si rien ne fonctionne)

**⚠️ ATTENTION : Ceci supprimera TOUS les containers arrêtés, images, volumes et networks inutilisés !**

```bash
# Arrêter tous les containers en cours
docker stop $(docker ps -aq)

# Supprimer tous les containers
docker rm $(docker ps -aq)

# Supprimer toutes les images
docker rmi $(docker images -q)

# Nettoyage complet
docker system prune -a --volumes -f

# Redémarrer Docker
sudo systemctl restart docker

# Redémarrer Portainer
docker start portainer
```

Après cela, vous devrez recréer vos stacks et containers.

---

## 🔄 Redémarrage complet (Solution ultime)

```bash
# 1. Arrêter Docker
sudo systemctl stop docker

# 2. Nettoyer les processus Docker restants
sudo pkill -9 docker
sudo pkill -9 containerd

# 3. Nettoyer les fichiers temporaires
sudo rm -rf /var/lib/docker/tmp/*

# 4. Redémarrer Docker
sudo systemctl start docker

# 5. Vérifier que Docker fonctionne
docker ps

# 6. Redémarrer Portainer
docker restart portainer
```

---

## 📊 Prévention des erreurs futures

### 1. Nettoyage automatique

Créez un script de nettoyage hebdomadaire :

```bash
sudo nano /usr/local/bin/docker-cleanup.sh
```

Contenu :
```bash
#!/bin/bash
# Nettoyage hebdomadaire de Docker

echo "🧹 Nettoyage Docker..."

# Supprimer les containers arrêtés depuis plus de 24h
docker container prune -f --filter "until=24h"

# Supprimer les images non utilisées depuis plus de 7 jours
docker image prune -a -f --filter "until=168h"

# Supprimer les volumes non utilisés
docker volume prune -f

# Supprimer les networks non utilisés
docker network prune -f

echo "✅ Nettoyage terminé"
docker system df
```

Rendez-le exécutable :
```bash
sudo chmod +x /usr/local/bin/docker-cleanup.sh
```

Ajoutez un cron (chaque dimanche à 3h) :
```bash
sudo crontab -e
```

Ajoutez :
```
0 3 * * 0 /usr/local/bin/docker-cleanup.sh >> /var/log/docker-cleanup.log 2>&1
```

### 2. Limiter la taille des logs

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

Redémarrez Docker :
```bash
sudo systemctl restart docker
```

### 3. Monitoring de l'espace disque

```bash
# Créer une alerte si < 20% d'espace disque
sudo nano /usr/local/bin/disk-alert.sh
```

Contenu :
```bash
#!/bin/bash
THRESHOLD=20
CURRENT=$(df / | grep / | awk '{ print $5}' | sed 's/%//g')

if [ "$CURRENT" -gt "$THRESHOLD" ]; then
    echo "⚠️ ALERTE : Espace disque faible : ${CURRENT}% utilisé"
    # Envoyer un email ou notification
fi
```

---

## ✅ Checklist de résolution

Faites ces étapes dans l'ordre :

- [ ] Connecté au serveur via SSH
- [ ] Exécuté `docker container prune -f`
- [ ] Exécuté `docker image prune -a -f`
- [ ] Redémarré Docker : `sudo systemctl restart docker`
- [ ] Redémarré Portainer : `docker restart portainer`
- [ ] Vérifié que Docker fonctionne : `docker ps`
- [ ] Actualisé la page Portainer (F5)
- [ ] Vérifié que les erreurs ont disparu
- [ ] Testé de créer une nouvelle stack

---

## 🆘 Si rien ne fonctionne

1. **Vérifiez l'espace disque** :
   ```bash
   df -h
   ```
   Si le disque est plein (>90%), libérez de l'espace.

2. **Vérifiez les logs système** :
   ```bash
   sudo journalctl -xe
   ```

3. **Réinstallez Docker** (dernier recours) :
   ```bash
   # Sauvegarder vos données Portainer
   docker cp portainer:/data /backup/portainer-data
   
   # Désinstaller Docker
   sudo apt remove docker docker-engine docker.io containerd runc
   
   # Réinstaller Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   
   # Redémarrer
   sudo systemctl start docker
   ```

---

## 📞 Obtenir de l'aide

Si les erreurs persistent, collectez ces informations :

```bash
# Version de Docker
docker version

# Informations système
docker info

# Espace disque
df -h

# Logs Docker récents
sudo journalctl -u docker -n 100

# Liste des containers
docker ps -a

# Erreurs système
dmesg | tail -50
```

Envoyez ces informations pour un diagnostic plus approfondi.

---

## 🎯 Commande rapide tout-en-un

Pour un nettoyage rapide, copiez-collez cette commande complète :

```bash
docker container prune -f && \
docker image prune -a -f && \
docker volume prune -f && \
docker network prune -f && \
sudo systemctl restart docker && \
sleep 10 && \
docker restart portainer && \
echo "✅ Nettoyage terminé. Actualisez Portainer (F5)"
```

Cette commande va :
1. ✅ Supprimer tous les containers arrêtés
2. ✅ Supprimer toutes les images non utilisées
3. ✅ Supprimer tous les volumes non utilisés
4. ✅ Supprimer tous les networks non utilisés
5. ✅ Redémarrer Docker
6. ✅ Redémarrer Portainer

**Attendez 10-15 secondes puis actualisez Portainer !** 🔄

---

Vos erreurs devraient être résolues ! 🎉


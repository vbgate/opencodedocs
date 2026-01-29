---
title: "Déploiement : Solution de déploiement serveur | Antigravity-Manager"
sidebarTitle: "Exécuter sur serveur"
subtitle: "Déploiement : Solution de déploiement serveur"
description: "Apprendre la méthode de déploiement serveur d'Antigravity-Manager. Comparer les solutions Docker noVNC et Headless Xvfb, effectuer l'installation et la configuration, la persistance des données et le dépannage de la vérification de santé, établir un environnement serveur exploitable."
tags:
  - "déploiement"
  - "docker"
  - "xvfb"
  - "novnc"
  - "systemd"
  - "sauvegarde"
prerequisite:
  - "start-installation"
  - "start-backup-migrate"
  - "advanced-security"
duration: 20
order: 10
---
# Déploiement serveur : Docker noVNC vs Headless Xvfb (sélection et exploitation)

Vous souhaitez faire un déploiement serveur d'Antigravity Tools, l'exécuter sur NAS/serveur, généralement pas pour "ouvrir l'interface graphique à distance", mais pour en faire une passerelle API locale en exécution continue : toujours en ligne, vérifiable, upgradable, sauvegardable, et capable de localiser les problèmes.

Ce cours ne traite que deux chemins de déploiement concrets déjà fournis dans le projet : Docker (avec noVNC) et Headless Xvfb (géré par systemd). Toutes les commandes et valeurs par défaut sont basées sur les fichiers de déploiement du dépôt.

::: tip Si vous voulez simplement "l'exécuter une fois"
Le chapitre d'installation couvre déjà les commandes d'entrée pour Docker et Headless Xvfb, vous pouvez d'abord voir **[Installation et mise à jour](/fr/lbjlaq/Antigravity-Manager/start/installation/)**, puis revenir à ce cours pour compléter "la boucle d'exploitation".
:::

## Ce que vous pourrez faire après ce cours

- Choisir la bonne forme de déploiement : savoir quels problèmes Docker noVNC et Headless Xvfb résolvent respectivement
- Compléter une boucle complète : déploiement -> synchronisation des données de compte -> vérification `/healthz` -> consulter les logs -> sauvegarde
- Transformer la mise à niveau en une action contrôlable : connaître la différence entre la "mise à jour automatique au démarrage" de Docker et le script `upgrade.sh` de Xvfb

## Votre situation actuelle

- Le serveur n'a pas de bureau, mais vous ne pouvez pas vous passer d'opérations comme OAuth/autorisation qui "nécessitent un navigateur"
- L'avoir exécuté une fois ne suffit pas, vous voulez surtout : récupération automatique après coupure d'alimentation, vérifiable, sauvegardable
- Vous craignez qu'exposer le port 8045 pose un risque de sécurité, mais vous ne savez pas par où commencer pour le sécuriser

## Quand utiliser cette méthode

- NAS/serveur domestique : souhaitez pouvoir ouvrir l'interface graphique via navigateur pour l'autorisation (Docker/noVNC très simple)
- Exécution serveur long terme : préférez gérer les processus via systemd, sauvegarder les logs sur disque, mise à niveau par script (Headless Xvfb ressemble plus à un "projet d'exploitation")

## Qu'est-ce que le mode "Déploiement serveur" ?

Le **déploiement serveur** signifie : vous n'exécutez pas Antigravity Tools sur votre bureau local, mais vous le placez sur une machine toujours en ligne, et utilisez le port de reverse proxy (par défaut 8045) comme point d'entrée de service externe. Son cœur n'est pas "voir l'interface à distance", mais d'établir une boucle d'exploitation stable : persistance des données, vérification de santé, logs, mise à niveau et sauvegarde.

## Idée centrale

1. D'abord choisissez "la capacité qui vous manque le plus" : besoin d'autorisation navigateur -> Docker/noVNC ; besoin de contrôle d'exploitation -> Headless Xvfb.
2. Ensuite définissez les "données" : compte/config sont dans `.antigravity_tools/`, soit via volume Docker, soit fixé dans `/opt/antigravity/.antigravity_tools/`.
3. Enfin réalisez "une boucle exploitable" : vérification via `/healthz`, en cas de problème d'abord regarder les logs, puis décider redémarrage ou mise à niveau.

::: warning Rappel préalable : d'abord définir la ligne de base de sécurité
Si vous allez exposer 8045 au réseau local/public, d'abord voir **[Sécurité et confidentialité : auth_mode, allow_lan_access, et la conception "ne pas divulguer les informations de compte"](/fr/lbjlaq/Antigravity-Manager/advanced/security/)**.
:::

## Tableau de sélection rapide : Docker vs Headless Xvfb

| Ce qui vous importe le plus | Plus recommandé | Pourquoi |
| --- | --- | --- |
| Besoin d'un navigateur pour OAuth/autorisation | Docker (noVNC) | Le conteneur inclut Firefox ESR, peut opérer directement dans le navigateur (voir `deploy/docker/README.md`) |
| Veut gestion systemd/sauvegarde logs sur disque | Headless Xvfb | Le script d'installation installe le service systemd, et ajoute les logs à `logs/app.log` (voir `deploy/headless-xvfb/install.sh`) |
| Veut isolation et limitation de ressources | Docker | Mode compose nativement isolé, plus facile à configurer les limites de ressources (voir `deploy/docker/README.md`) |

## Suivez-moi

### Étape 1 : D'abord confirmer "où se trouve le répertoire de données"

**Pourquoi**
Déploiement réussi mais "pas de compte/config", essentiellement le répertoire de données n'a pas été transféré ou n'est pas persistant.

- La solution Docker monte les données dans `/home/antigravity/.antigravity_tools` dans le conteneur (compose volume)
- La solution Headless Xvfb place les données dans `/opt/antigravity/.antigravity_tools` (et fixe l'emplacement d'écriture via `HOME=$(pwd)`)

**Ce que vous devriez voir**
- Docker : `docker volume ls` montre `antigravity_data`
- Xvfb : `/opt/antigravity/.antigravity_tools/` existe, et contient `accounts/`, `gui_config.json`

### Étape 2 : Démarrer Docker/noVNC (convient si besoin d'autorisation navigateur)

**Pourquoi**
La solution Docker empaquette "écran virtuel + gestionnaire de fenêtres + noVNC + application + navigateur" dans un conteneur, vous évite d'installer une pile de dépendances graphiques sur le serveur.

Sur le serveur, exécutez :

```bash
cd deploy/docker
docker compose up -d
```

Ouvrez noVNC :

```text
http://<server-ip>:6080/vnc_lite.html
```

**Ce que vous devriez voir**
- `docker compose ps` affiche le conteneur en cours d'exécution
- Le navigateur peut ouvrir la page noVNC

::: tip À propos du port noVNC (recommandé de garder par défaut)
`deploy/docker/README.md` mentionne que `NOVNC_PORT` peut être utilisé pour personnaliser le port, mais dans l'implémentation actuelle, `start.sh` lors du démarrage de `websockify` écoute le port 6080 en dur. Pour modifier le port, il faut ajuster simultanément le mappage de ports docker-compose et le port d'écoute de start.sh.

Pour éviter les incohérences de configuration, il est recommandé d'utiliser directement 6080 par défaut.
:::

### Étape 3 : Persistance, vérification de santé et sauvegarde de Docker

**Pourquoi**
La disponibilité du conteneur dépend de deux choses : santé du processus (toujours en cours) et persistance des données (le compte est toujours là après redémarrage).

1) Confirmer que le volume de persistance est monté :

```bash
cd deploy/docker
docker compose ps
```

2) Sauvegarder le volume (le README du projet donne une méthode de sauvegarde tar) :

```bash
docker run --rm -v antigravity_data:/data -v $(pwd):/backup alpine \
  tar czf /backup/antigravity-backup.tar.gz /data
```

3) Vérification de santé du conteneur (Dockerfile a HEALTHCHECK) :

```bash
docker inspect --format '{{json .State.Health}}' antigravity-manager | jq
```

**Ce que vous devriez voir**
- `.State.Health.Status` est `healthy`
- Le répertoire courant génère `antigravity-backup.tar.gz`

### Étape 4 : Installation Headless Xvfb en un clic (convient si vous voulez l'exploitation systemd)

**Pourquoi**
Headless Xvfb n'est pas "mode pur backend", mais utilise un écran virtuel pour exécuter le programme GUI sur le serveur ; mais en échange, il offre un mode d'exploitation plus familier : systemd, répertoire fixe, logs sur disque.

Sur le serveur, exécutez (script one-click fourni par le projet) :

```bash
curl -fsSL https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/headless-xvfb/install.sh | sudo bash
```

**Ce que vous devriez voir**
- Le répertoire `/opt/antigravity/` existe
- `systemctl status antigravity` affiche le service running

::: tip Méthode plus sûre : d'abord auditer le script
`curl -O .../install.sh` téléchargez-le, regardez-le d'abord, puis `sudo bash install.sh`.
:::

### Étape 5 : Synchroniser le compte local vers le serveur (obligatoire pour solution Xvfb)

**Pourquoi**
L'installation Xvfb exécute simplement le programme. Pour que le reverse proxy soit vraiment utilisable, vous devez synchroniser le compte/config existant local vers le répertoire de données du serveur.

Le projet fournit `sync.sh`, qui recherche automatiquement le répertoire de données sur votre machine par priorité (comme `~/.antigravity_tools`, `~/Library/Application Support/Antigravity Tools`), puis rsync vers le serveur :

```bash
curl -O https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/headless-xvfb/sync.sh
chmod +x sync.sh

./sync.sh root@your-server /opt/antigravity
```

**Ce que vous devriez voir**
- Le terminal affiche quelque chose comme : `Synchronisation : <local> -> root@your-server:/opt/antigravity/.antigravity_tools/`
- Le service distant est tenté redémarré (le script appellera `systemctl restart antigravity`)

### Étape 6 : Vérification de santé et dépannage (commun aux deux solutions)

**Pourquoi**
Après déploiement, la première chose n'est pas "d'abord connecter le client", mais d'abord établir une entrée pour juger rapidement de la santé.

1) Vérification de santé (le service reverse proxy fournit `/healthz`) :

```bash
curl -i http://127.0.0.1:8045/healthz
```

2) Voir les logs :

```bash
## Docker
cd deploy/docker
docker compose logs -f

## Headless Xvfb
tail -f /opt/antigravity/logs/app.log
```

**Ce que vous devriez voir**
- `/healthz` retourne 200 (le corps de réponse exact selon la réalité)
- Les logs montrent les informations de démarrage du service reverse proxy

### Étape 7 : Stratégie de mise à niveau (ne considérez pas "mise à jour automatique" comme la seule solution)

**Pourquoi**
La mise à niveau est l'action la plus susceptible de "mettre le système dans un état indisponible". Vous devez savoir exactement ce que la mise à niveau fait pour chaque solution.

- Docker : au démarrage du conteneur, il essaiera de tirer le dernier `.deb` via GitHub API et de l'installer (si limitation ou anomalie réseau, continuera avec la version en cache).
- Headless Xvfb : utilise `upgrade.sh` pour tirer le dernier AppImage, et en cas d'échec de redémarrage, retourne à la sauvegarde.

Commande de mise à niveau Headless Xvfb (README du projet) :

```bash
cd /opt/antigravity
sudo ./upgrade.sh
```

**Ce que vous devriez voir**
- Sortie similaire à : `Mise à niveau : v<current> -> v<latest>`
- Après mise à niveau, le service reste actif (le script fera `systemctl restart antigravity` et vérifiera l'état)

## Attention aux pièges courants

| Scénario | Erreur courante (❌) | Approche recommandée (✓) |
| --- | --- | --- |
| Perte de compte/config | ❌ Se soucier seulement de "le programme tourne" | ✓ D'abord confirmer que `.antigravity_tools/` est persistant (volume ou `/opt/antigravity`) |
| Port noVNC modifié inefficace | ❌ Ne modifier que `NOVNC_PORT` | ✓ Garder 6080 par défaut ; si vous changez, vérifiez simultanément le port `websockify` dans `start.sh` |
| Exposer 8045 au réseau public | ❌ Ne pas définir `api_key`/ne pas regarder auth_mode | ✓ D'abord selon **[Sécurité et confidentialité](/fr/lbjlaq/Antigravity-Manager/advanced/security/)** faire la ligne de base, puis considérer tunnel/reverse proxy |

## Résumé du cours

- Docker/noVNC résout le problème "serveur sans navigateur/sans bureau mais besoin d'autorisation", convient pour NAS
- Headless Xvfb ressemble plus à une exploitation standard : répertoire fixe, gestion systemd, mise à niveau/rollback par script
- Quelle que soit la solution, d'abord compléter la boucle : données -> vérification -> logs -> sauvegarde -> mise à niveau

## À suivre

- Vous voulez exposer le service au réseau local/public : **[Sécurité et confidentialité : auth_mode, allow_lan_access](/fr/lbjlaq/Antigravity-Manager/advanced/security/)**
- Après déploiement, 401 : **[401/Échec d'auth : auth_mode, compatibilité Header et liste de configuration client](/fr/lbjlaq/Antigravity-Manager/faq/auth-401/)**
- Vous voulez exposer le service via tunnel : **[Tunnel Cloudflared en un clic](/fr/lbjlaq/Antigravity-Manager/platforms/cloudflared/)**

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-23

| Fonction | Chemin du fichier | Ligne |
| --- | --- | --- |
| Entrée déploiement Docker et URL noVNC | [`deploy/docker/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/README.md#L5-L13) | 5-13 |
| Description des variables d'environnement déploiement Docker (VNC_PASSWORD/RESOLUTION/NOVNC_PORT) | [`deploy/docker/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/README.md#L32-L39) | 32-39 |
| Mappage de ports compose Docker et volume de données (antigravity_data) | [`deploy/docker/docker-compose.yml`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/docker-compose.yml#L1-L21) | 1-21 |
| Script de démarrage Docker : mise à jour automatique de version (GitHub rate limit) | [`deploy/docker/start.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/start.sh#L27-L58) | 27-58 |
| Script de démarrage Docker : démarrer Xtigervnc/Openbox/noVNC/application | [`deploy/docker/start.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/start.sh#L60-L78) | 60-78 |
| Vérification de santé Docker : confirmer existence processus Xtigervnc/websockify/antigravity_tools | [`deploy/docker/Dockerfile`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/Dockerfile#L60-L79) | 60-79 |
| Headless Xvfb : structure répertoire et commandes d'exploitation (systemctl/healthz) | [`deploy/headless-xvfb/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/README.md#L19-L78) | 19-78 |
| Headless Xvfb : install.sh installation dépendances et initialisation gui_config.json (par défaut 8045) | [`deploy/headless-xvfb/install.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/install.sh#L16-L67) | 16-67 |
| Headless Xvfb : sync.sh découverte automatique répertoire données local et rsync vers serveur | [`deploy/headless-xvfb/sync.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/sync.sh#L8-L32) | 8-32 |
| Headless Xvfb : upgrade.sh télécharge nouvelle version et rollback en cas d'échec | [`deploy/headless-xvfb/upgrade.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/upgrade.sh#L11-L51) | 11-51 |
| Point de terminaison vérification de santé service reverse proxy `/healthz` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |

</details>

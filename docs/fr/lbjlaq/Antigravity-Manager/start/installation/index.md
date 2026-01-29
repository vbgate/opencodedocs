---
title: "Installation : déploiement via Homebrew et Releases | Antigravity Manager"
sidebarTitle: "Installation en 5 minutes"
subtitle: "Installation et mise à niveau : chemin d'installation optimal pour l'application de bureau (brew / releases)"
description: "Apprenez les méthodes d'installation Homebrew et Releases d'Antigravity Tools. Effectuez le déploiement en 5 minutes, gérez les problèmes courants de macOS quarantine et l'erreur d'application corrompue, et maîtrisez le processus de mise à niveau."
tags:
  - "Installation"
  - "Mise à niveau"
  - "Homebrew"
  - "Releases"
  - "Docker"
prerequisite:
  - "start-getting-started"
order: 2
---

# Installation et mise à niveau : chemin d'installation optimal pour l'application de bureau (brew / releases)

Si vous souhaitez installer rapidement Antigravity Tools et faire fonctionner les cours suivants, ce cours ne fait qu'une seule chose : expliquer clairement « l'installation + le lancement + comment mettre à niveau ».

## Ce que vous pourrez faire après ce cours

- Choisir la bonne méthode d'installation : privilégier Homebrew, puis GitHub Releases
- Gérer les blocages courants de macOS (quarantine / « application corrompue »)
- Installer dans des environnements spéciaux : scripts Arch, Headless Xvfb, Docker
- Connaître l'entrée de mise à niveau et les méthodes de vérification pour chaque type d'installation

## Votre situation actuelle

- La documentation propose trop de méthodes d'installation, vous ne savez pas laquelle choisir
- Après téléchargement sur macOS, l'application ne s'ouvre pas, message « corrompue/impossible à ouvrir »
- Vous exécutez sur NAS/serveur, sans interface graphique, et l'autorisation n'est pas pratique

## Quand utiliser cette méthode

- Première installation d'Antigravity Tools
- Récupération de l'environnement après changement d'ordinateur ou réinstallation du système
- Après mise à niveau, en cas de blocage système ou problème de démarrage

::: warning Prérequis
Si vous n'êtes pas sûr du problème qu'Antigravity Tools résout, jetez d'abord un œil à **[Antigravity Tools, c'est quoi](/fr/lbjlaq/Antigravity-Manager/start/getting-started/)**, puis revenez pour l'installation.
:::

## Idée centrale

Nous vous recommandons de choisir selon l'ordre « bureau d'abord, serveur ensuite » :

1. Bureau (macOS/Linux) : installer avec Homebrew (le plus rapide, la mise à niveau aussi la plus simple)
2. Bureau (toutes plateformes) : télécharger depuis GitHub Releases (adapté si vous ne voulez pas installer brew ou si le réseau est restreint)
3. Serveur/NAS : privilégier Docker ; ensuite Headless Xvfb (plus proche d'« exécuter une application de bureau sur le serveur »)

## Suivez-moi

### Étape 1 : Choisissez d'abord votre méthode d'installation

**Pourquoi**
Les coûts de « mise à niveau / retour en arrière / dépannage » varient énormément selon la méthode d'installation. Choisir la bonne méthode permet d'éviter les détours.

**Recommandation** :

| Scénario | Méthode d'installation recommandée |
| --- | --- |
| Bureau macOS / Linux | Homebrew (option A) |
| Bureau Windows | GitHub Releases (option B) |
| Arch Linux | Script officiel (option Arch) |
| Serveur distant sans bureau | Docker (option D) ou Headless Xvfb (option C-Headless) |

**Ce que vous devriez voir** : Vous pouvez identifier clairement à quelle ligne vous appartenez.

### Étape 2 : Installer avec Homebrew (macOS / Linux)

**Pourquoi**
Homebrew est le chemin « gestion automatique du téléchargement et de l'installation », et la mise à niveau est aussi la plus aisée.

```bash
#1) Abonnez-vous au Tap de ce dépôt
brew tap lbjlaq/antigravity-manager https://github.com/lbjlaq/Antigravity-Manager

#2) Installez l'application
brew install --cask antigravity-tools
```

::: tip Indication de permissions macOS
Le README mentionne : si vous rencontrez des problèmes de permissions/quarantine sur macOS, vous pouvez utiliser à la place :

```bash
brew install --cask --no-quarantine antigravity-tools
```
:::

**Ce que vous devriez voir** : `brew` affiche que l'installation a réussi, et l'application Antigravity Tools apparaît dans le système.

### Étape 3 : Installation manuelle depuis GitHub Releases (macOS / Windows / Linux)

**Pourquoi**
Lorsque vous n'utilisez pas Homebrew, ou que vous souhaitez contrôler vous-même la source du paquet d'installation, ce chemin est le plus direct.

1. Ouvrez la page Releases du projet : `https://github.com/lbjlaq/Antigravity-Manager/releases`
2. Choisissez le paquet d'installation correspondant à votre système :
    - macOS : `.dmg` (Apple Silicon / Intel)
    - Windows : `.msi` ou version portable `.zip`
    - Linux : `.deb` ou `AppImage`
3. Terminez l'installation en suivant les indications du programme d'installation du système

**Ce que vous devriez voir** : Une fois l'installation terminée, vous pouvez trouver Antigravity Tools dans la liste des applications du système et le lancer.

### Étape 4 : Traitement de macOS « application corrompue, impossible à ouvrir »

**Pourquoi**
Le README donne explicitement la méthode de correction pour ce scénario ; si vous rencontrez le même message, suivez simplement les instructions.

```bash
sudo xattr -rd com.apple.quarantine "/Applications/Antigravity Tools.app"
```

**Ce que vous devriez voir** : Au redémarrage de l'application, le message de blocage « corrompue/impossible à ouvrir » n'apparaît plus.

### Étape 5 : Mise à niveau (choisissez selon votre méthode d'installation)

**Pourquoi**
Lors des mises à niveau, le piège le plus courant est que « la méthode a changé », vous ne savez donc pas où faire la mise à jour.

::: code-group

```bash [Homebrew]
#Mettez d'abord à jour les informations du tap avant la mise à niveau
brew update

#Mettez à niveau le cask
brew upgrade --cask antigravity-tools
```

```text [Releases]
Téléchargez à nouveau le paquet d'installation de la dernière version (.dmg/.msi/.deb/AppImage), et installez par écrasement selon les indications du système.
```

```bash [Headless Xvfb]
cd /opt/antigravity
sudo ./upgrade.sh
```

```bash [Docker]
cd deploy/docker

#Le README explique que le conteneur tentera de tirer la dernière release au démarrage ; le moyen le plus simple de mettre à niveau est de redémarrer le conteneur
docker compose restart
```

:::

**Ce que vous devriez voir** : Après la mise à niveau, l'application peut toujours démarrer normalement ; si vous utilisez Docker/Headless, vous pouvez également continuer à accéder au point de terminaison de vérification de santé.

## Autres méthodes d'installation (scénarios spécifiques)

### Arch Linux : script d'installation officiel en un clic

Le README fournit l'entrée pour le script Arch :

```bash
curl -sSL https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/arch/install.sh | bash
```

::: details Que fait ce script ?
Il récupère la dernière release via l'API GitHub, télécharge l'actif `.deb`, calcule le SHA256, génère ensuite un PKGBUILD et installe avec `makepkg -si`.
:::

### Serveur distant : Headless Xvfb

Si vous avez besoin d'exécuter une application GUI sur un serveur Linux sans interface, le projet propose le déploiement Xvfb :

```bash
curl -fsSL https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/headless-xvfb/install.sh | sudo bash
```

Une fois l'installation terminée, la documentation donne les commandes de vérification courantes :

```bash
systemctl status antigravity
tail -f /opt/antigravity/logs/app.log
curl localhost:8045/healthz
```

### NAS/serveur : Docker (avec navigateur VNC)

Le déploiement Docker fournit noVNC dans le navigateur (pratique pour les opérations OAuth/autorisation), tout en mappant les ports de proxy :

```bash
cd deploy/docker
docker compose up -d
```

Vous devriez pouvoir accéder à : `http://localhost:6080/vnc_lite.html`.

## Attention aux pièges courants

- Échec de l'installation brew : vérifiez d'abord que vous avez installé Homebrew, puis réessayez le `brew tap` / `brew install --cask` du README
- macOS impossible à ouvrir : essayez d'abord `--no-quarantine` ; si déjà installé, utilisez `xattr` pour nettoyer quarantine
- Limites du déploiement serveur : Headless Xvfb est essentiellement « exécuter une application de bureau avec un écran virtuel », l'utilisation des ressources sera supérieure à un service backend pur

## Résumé du cours

- Pour le bureau, le plus recommandé : Homebrew (installation et mise à niveau toutes simples)
- Sans brew : utilisez directement GitHub Releases
- Serveur/NAS : privilégier Docker ; pour la gestion systemd, utilisez Headless Xvfb

## Aperçu du prochain cours

Le prochain cours pousse « capable d'ouvrir » un cran plus loin : comprendre clairement **[répertoire de données, journaux, barre des tâches et démarrage automatique](/fr/lbjlaq/Antigravity-Manager/start/first-run-data/)**, afin que vous sachiez où chercher en cas de problème.

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-23

| Sujet | Chemin du fichier | Ligne |
| --- | --- | --- |
| Installation Homebrew (tap + cask) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L112-L127) | 112-127 |
| Téléchargement manuel Releases (paquets pour chaque plateforme) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L128-L133) | 128-133 |
| Entrée du script d'installation en un clic Arch | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L134-L140) | 134-140 |
| Implémentation du script d'installation Arch (API GitHub + makepkg) | [`deploy/arch/install.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/arch/install.sh#L1-L56) | 1-56 |
| Entrée d'installation Headless Xvfb (curl | sudo bash) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L141-L149) | 141-149 |
| Commandes de déploiement/mise à niveau/entretien Headless Xvfb | [`deploy/headless-xvfb/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/README.md#L1-L99) | 1-99 |
| Headless Xvfb install.sh (systemd + configuration par défaut 8045) | [`deploy/headless-xvfb/install.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/install.sh#L1-L99) | 1-99 |
| Entrée du déploiement Docker (docker compose up -d) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L150-L166) | 150-166 |
| Explication du déploiement Docker (noVNC 6080 / proxy 8045) | [`deploy/docker/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/README.md#L1-L35) | 1-35 |
| Configuration des ports/volumes de données Docker (8045 + antigravity_data) | [`deploy/docker/docker-compose.yml`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/docker-compose.yml#L1-L25) | 1-25 |
| Dépannage macOS « corrompue, impossible à ouvrir » (xattr / --no-quarantine) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L171-L186) | 171-186 |

</details>

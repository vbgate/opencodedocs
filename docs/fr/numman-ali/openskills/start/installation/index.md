---
title: "Installation : déploiement rapide | OpenSkills"
sidebarTitle: "Démarrage en 5 minutes"
subtitle: "Installation : déploiement rapide | OpenSkills"
description: "Apprenez les méthodes d'installation d'OpenSkills. Configurez votre environnement en 5 minutes, avec support de npx et de l'installation globale, incluant la validation et le dépannage."
tags:
  - "Installation"
  - "Configuration de l'environnement"
  - "Node.js"
  - "Git"
prerequisite:
  - "Opérations de base du terminal"
duration: 3
order: 3
---

# Installation de l'outil OpenSkills

## Ce que vous saurez faire

Après avoir terminé ce cours, vous serez capable de :

- Vérifier et configurer les environnements Node.js et Git
- Utiliser OpenSkills via `npx` ou via une installation globale
- Vérifier qu'OpenSkills est correctement installé et utilisable
- Résoudre les problèmes d'installation courants (incompatibilité de version, problèmes réseau, etc.)

## Vos difficultés actuelles

Vous pourriez rencontrer ces problèmes :

- **Exigences d'environnement incertaines** : vous ne savez pas quelles versions de Node.js et de Git sont nécessaires
- **Comment installer** : OpenSkills est un package npm, mais vous ne savez pas s'il faut utiliser npx ou une installation globale
- **Échec de l'installation** : rencontre d'incompatibilités de version ou de problèmes réseau
- **Problèmes de permissions** : erreur EACCES lors de l'installation globale

Ce cours vous aide à résoudre ces problèmes étape par étape.

## Quand utiliser cette méthode

Quand vous avez besoin de :

- Utiliser OpenSkills pour la première fois
- Mettre à jour vers une nouvelle version
- Configurer un environnement de développement sur une nouvelle machine
- Dépanner des problèmes liés à l'installation

## 🎒 Préparatifs

::: tip Exigences système

OpenSkills a des exigences minimales pour le système. Le non-respect de ces exigences entraînera un échec de l'installation ou un comportement anormal.

:::

::: warning Vérification préalable

Avant de commencer, assurez-vous d'avoir installé les logiciels suivants :

1. **Node.js version 20.6 ou supérieure**
2. **Git** (pour cloner les compétences depuis les dépôts)

:::

## Approche principale

OpenSkills est un outil CLI Node.js avec deux modes d'utilisation :

| Mode | Commande | Avantages | Inconvénients | Scénario d'utilisation |
|--- | --- | --- | --- | ---|
| **npx** | `npx openskills` | Pas besoin d'installation, utilise automatiquement la dernière version | Nécessite un téléchargement à chaque exécution (avec cache) | Utilisation occasionnelle, tester une nouvelle version |
| **Installation globale** | `openskills` | Commande plus courte, réponse plus rapide | Nécessite une mise à jour manuelle | Utilisation fréquente, version fixe |

**L'utilisation de npx est recommandée**, sauf si vous utilisez très fréquemment OpenSkills.

---

## Suivez-moi

### Étape 1 : Vérifier la version de Node.js

Tout d'abord, vérifiez si Node.js est installé sur votre système et si la version répond aux exigences :

```bash
node --version
```

**Pourquoi**

OpenSkills nécessite Node.js version 20.6 ou supérieure. Une version inférieure entraînera des erreurs d'exécution.

**Vous devriez voir** :

```bash
v20.6.0
```

Ou une version supérieure (comme `v22.0.0`).

::: danger Version trop basse

Si vous voyez `v18.x.x` ou une version inférieure (comme `v16.x.x`), vous devez mettre à jour Node.js.

:::

**Si la version est trop basse** :

Il est recommandé d'utiliser [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm) pour installer et gérer Node.js :

::: code-group

```bash [macOS/Linux]
# Installer nvm (si ce n'est pas déjà fait)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Recharger la configuration du terminal
source ~/.bashrc  # ou source ~/.zshrc

# Installer Node.js 20 LTS
nvm install 20
nvm use 20

# Vérifier la version
node --version
```

```powershell [Windows]
# Télécharger et installer nvm-windows
# Visitez : https://github.com/coreybutler/nvm-windows/releases

# Après l'installation, exécutez dans PowerShell :
nvm install 20
nvm use 20

# Vérifier la version
node --version
```

:::

**Vous devriez voir** (après la mise à jour) :

```bash
v20.6.0
```

---

### Étape 2 : Vérifier l'installation de Git

OpenSkills a besoin de Git pour cloner les dépôts de compétences :

```bash
git --version
```

**Pourquoi**

Lors de l'installation de compétences depuis GitHub, OpenSkills utilise la commande `git clone` pour télécharger le dépôt.

**Vous devriez voir** :

```bash
git version 2.40.0
```

(Les numéros de version peuvent varier, toute sortie signifie que Git est installé)

::: danger Git non installé

Si vous voyez `command not found: git` ou une erreur similaire, vous devez installer Git.

:::

**Si Git n'est pas installé** :

::: code-group

```bash [macOS]
# macOS a généralement Git préinstallé. Sinon, utilisez Homebrew :
brew install git
```

```powershell [Windows]
# Télécharger et installer Git for Windows
# Visitez : https://git-scm.com/download/win
```

```bash [Linux (Ubuntu/Debian)]
sudo apt update
sudo apt install git
```

```bash [Linux (CentOS/RHEL)]
sudo yum install git
```

:::

Après l'installation, relancez `git --version` pour vérifier.

---

### Étape 3 : Vérifier l'environnement

Maintenant, vérifiez que Node.js et Git sont tous les deux disponibles :

```bash
node --version && git --version
```

**Vous devriez voir** :

```bash
v20.6.0
git version 2.40.0
```

Si les deux commandes produisent une sortie, cela signifie que l'environnement est correctement configuré.

---

### Étape 4 : Utiliser la méthode npx (recommandée)

OpenSkills recommande d'utiliser `npx` pour l'exécution directe, sans installation supplémentaire :

```bash
npx openskills --version
```

**Pourquoi**

`npx` télécharge et exécute automatiquement la dernière version d'OpenSkills, sans nécessiter d'installation ou de mise à jour manuelle. Lors de la première exécution, le package est téléchargé dans le cache local. Les exécutions ultérieures utilisent le cache, ce qui est très rapide.

**Vous devriez voir** :

```bash
1.5.0
```

(Le numéro de version peut varier)

::: tip Comment fonctionne npx

`npx` (Node Package eXecute) est un outil inclus avec npm 5.2.0+ :
- Première exécution : télécharge le package depuis npm vers un répertoire temporaire
- Exécutions ultérieures : utilise le cache (expire par défaut après 24 heures)
- Mise à jour : télécharge automatiquement la dernière version après expiration du cache

:::

**Tester la commande d'installation** :

```bash
npx openskills list
```

**Vous devriez voir** :

```bash
Installed Skills:

No skills installed. Run: npx openskills install <source>
```

Ou une liste de compétences déjà installées.

---

### Étape 5 : (Optionnel) Installation globale

Si vous utilisez fréquemment OpenSkills, vous pouvez choisir une installation globale :

```bash
npm install -g openskills
```

**Pourquoi**

Après une installation globale, vous pouvez directement utiliser la commande `openskills` sans avoir à saisir `npx` à chaque fois, pour une réponse plus rapide.

**Vous devriez voir** :

```bash
added 4 packages in 3s
```

(La sortie peut varier)

::: warning Problèmes de permissions

Si vous rencontrez une erreur `EACCES` lors de l'installation globale, cela signifie que vous n'avez pas la permission d'écrire dans le répertoire global.

**Solution** :

```bash
# Méthode 1 : utiliser sudo (macOS/Linux)
sudo npm install -g openskills

# Méthode 2 : réparer les permissions npm (recommandé)
# Voir le répertoire d'installation global
npm config get prefix

# Définir les permissions correctes (remplacez /usr/local par le chemin réel)
sudo chown -R $(whoami) /usr/local/lib/node_modules
sudo chown -R $(whoami) /usr/local/bin
```

:::

**Vérifier l'installation globale** :

```bash
openskills --version
```

**Vous devriez voir** :

```bash
1.5.0
```

::: tip Mettre à jour l'installation globale

Pour mettre à jour l'installation globale d'OpenSkills :

```bash
npm update -g openskills
```

:::

---

## Point de contrôle ✅

Après avoir terminé les étapes ci-dessus, vous devriez vérifier :

- [ ] La version de Node.js est 20.6 ou supérieure (`node --version`)
- [ ] Git est installé (`git --version`)
- [ ] `npx openskills --version` ou `openskills --version` affiche correctement le numéro de version
- [ ] `npx openskills list` ou `openskills list` s'exécute normalement

Si toutes les vérifications réussissent, félicitations ! OpenSkills a été installé avec succès.

---

## Pièges à éviter

### Problème 1 : Version de Node.js trop basse

**Message d'erreur** :

```bash
Error: The module was compiled against a different Node.js version
```

**Cause** : Version de Node.js inférieure à 20.6

**Solution** :

Utilisez nvm pour installer Node.js version 20 ou supérieure :

```bash
nvm install 20
nvm use 20
```

---

### Problème 2 : Commande npx introuvable

**Message d'erreur** :

```bash
command not found: npx
```

**Cause** : Version de npm trop basse (npx nécessite npm 5.2.0+)

**Solution** :

```bash
# Mettre à jour npm
npm install -g npm@latest

# Vérifier la version
npx --version
```

---

### Problème 3 : Délai d'attente réseau ou échec du téléchargement

**Message d'erreur** :

```bash
Error: network timeout
```

**Cause** : Accès limité au dépôt npm

**Solution** :

```bash
# Utiliser un miroir npm (comme le miroir Taobao)
npm config set registry https://registry.npmmirror.com

# Réessayer
npx openskills --version
```

Restaurer la source par défaut :

```bash
npm config set registry https://registry.npmjs.org
```

---

### Problème 4 : Erreur de permissions d'installation globale

**Message d'erreur** :

```bash
Error: EACCES: permission denied
```

**Cause** : Pas de permission d'écriture dans le répertoire d'installation globale

**Solution** :

Reportez-vous à la méthode de réparation des permissions de l'étape 5, ou utilisez `sudo` (non recommandé).

---

### Problème 5 : Échec du clone Git

**Message d'erreur** :

```bash
Error: git clone failed
```

**Cause** : Clé SSH non configurée ou problème réseau

**Solution** :

```bash
# Tester la connexion Git
git ls-remote https://github.com/numman-ali/openskills.git

# Si cela échoue, vérifiez le réseau ou configurez un proxy
git config --global http.proxy http://proxy.example.com:8080
```

---

## Résumé du cours

Dans ce cours, nous avons appris :

1. **Exigences d'environnement** : Node.js 20.6+ et Git
2. **Mode d'utilisation recommandé** : `npx openskills` (pas d'installation nécessaire)
3. **Installation globale optionnelle** : `npm install -g openskills` (pour une utilisation fréquente)
4. **Vérification de l'environnement** : vérifier les numéros de version et la disponibilité des commandes
5. **Problèmes courants** : incompatibilité de version, problèmes de permissions, problèmes réseau

Vous avez maintenant terminé l'installation d'OpenSkills. Dans le prochain cours, nous apprendrons comment installer la première compétence.

---

## Aperçu du prochain cours

> Le prochain cours : **[Installer la première compétence](../first-skill/)**
>
> Vous apprendrez :
> - Comment installer une compétence depuis le dépôt officiel d'Anthropic
> - Techniques de sélection interactive de compétences
> - Structure des répertoires des compétences
> - Vérifier qu'une compétence est correctement installée

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquer pour afficher l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

### Configuration principale

| Élément de configuration | Chemin du fichier                                                                                       | Lignes     |
|--- | --- | ---|
| Exigence de version Node.js | [`package.json`](https://github.com/numman-ali/openskills/blob/main/package.json) | 45-47     |
| Informations sur le package         | [`package.json`](https://github.com/numman-ali/openskills/blob/main/package.json) | 1-9       |
| Point d'entrée CLI       | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts)             | 39-80     |

### Constantes clés

- **Exigence Node.js** : `>=20.6.0` (package.json:46)
- **Nom du package** : `openskills` (package.json:2)
- **Version** : `1.5.0` (package.json:3)
- **Commande CLI** : `openskills` (package.json:8)

### Explication des dépendances

**Dépendances d'exécution** (package.json:48-53) :
- `@inquirer/prompts` : sélection interactive
- `chalk` : sortie colorée dans le terminal
- `commander` : analyse des arguments CLI
- `ora` : animation de chargement

**Dépendances de développement** (package.json:54-59) :
- `typescript` : compilation TypeScript
- `vitest` : tests unitaires
- `tsup` : outil de packaging

</details>

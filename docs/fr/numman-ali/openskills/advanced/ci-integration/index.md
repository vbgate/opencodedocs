---
title: "CI/CD : Intégration non-interactive | OpenSkills"
sidebarTitle: "Maîtriser CI/CD en un clic"
subtitle: "CI/CD : Intégration non-interactive | OpenSkills"
description: "Apprenez l'intégration CI/CD d'OpenSkills, maîtrisez le drapeau -y pour une installation et synchronisation non-interactives. Inclut des exemples pratiques avec GitHub Actions et Docker, pour une gestion automatisée des compétences."
tags:
  - "Avancé"
  - "CI/CD"
  - "Automatisation"
  - "Déploiement"
prerequisite:
  - "start-first-skill"
  - "start-sync-to-agents"
  - "platforms-cli-commands"
order: 6
---

# Intégration CI/CD

## Ce que vous saurez faire

- Comprendre pourquoi les environnements CI/CD ont besoin du mode non-interactif
- Maîtriser l'utilisation du drapeau `--yes/-y` dans les commandes `install` et `sync`
- Apprendre à intégrer OpenSkills dans les plateformes CI comme GitHub Actions, GitLab CI
- Comprendre le processus d'installation automatisée des compétences dans les conteneurs Docker
- Maîtriser les stratégies de mise à jour et de synchronisation des compétences en environnement CI/CD
- Éviter les échecs causés par les invites interactives dans les workflows CI/CD

::: info Prérequis

Ce tutoriel suppose que vous avez déjà compris [l'installation de la première compétence](../../start/first-skill/) et la [synchronisation des compétences vers AGENTS.md](../../start/sync-to-agents/), ainsi que les bases de la [documentation des commandes](../../platforms/cli-commands/).

:::

---

## Votre problème actuel

Vous utilisez probablement OpenSkills avec aisance dans votre environnement local, mais vous rencontrez des problèmes dans l'environnement CI/CD :

- **Les invites interactives causent des échecs** : L'interface de sélection apparaît pendant le workflow CI, empêchant la poursuite de l'exécution
- **Besoin d'installer des compétences lors du déploiement automatisé** : Chaque build nécessite une réinstallation des compétences, impossible sans confirmation automatique
- **Configuration non synchronisée entre environnements** : Les configurations de compétences des environnements de développement, de test et de production sont incohérentes
- **Génération non automatisée de AGENTS.md** : Nécessite d'exécuter manuellement la commande sync après chaque déploiement
- **Compétences manquantes lors de la construction d'images Docker** : Les compétences doivent être installées manuellement après le démarrage du conteneur

En réalité, OpenSkills fournit le drapeau `--yes/-y`, spécialement conçu pour les environnements non-interactifs, vous permettant d'automatiser toutes les opérations dans vos workflows CI/CD.

---

## Quand utiliser cette approche

**Scénarios applicables à l'intégration CI/CD** :

| Scénario | Mode non-interactif nécessaire ? | Exemple |
|--- | --- | ---|
| **GitHub Actions** | ✅ Oui | Installation automatique des compétences à chaque PR ou push |
| **GitLab CI** | ✅ Oui | Synchronisation automatique de AGENTS.md lors des merge requests |
| **Construction Docker** | ✅ Oui | Installation automatique des compétences dans le conteneur lors de la construction de l'image |
| **Pipelines Jenkins** | ✅ Oui | Mise à jour automatique des compétences lors de l'intégration continue |
| **Scripts d'initialisation de l'environnement de développement** | ✅ Oui | Configuration de l'environnement en un clic pour les nouveaux développeurs |
| **Déploiement en production** | ✅ Oui | Synchronisation automatique des dernières compétences lors du déploiement |

::: tip Recommandation

- **Utiliser le mode interactif pour le développement local** : Vous pouvez sélectionner attentivement les compétences à installer lors d'opérations manuelles
- **Utiliser le mode non-interactif pour CI/CD** : Le drapeau `-y` doit être utilisé pour sauter toutes les invites dans les workflows automatisés
- **Stratégie de séparation des environnements** : Différents environnements utilisent différentes sources de compétences (par exemple, des dépôts privés)

:::

---

## Concept clé : Mode non-interactif

Les commandes `install` et `sync` d'OpenSkills prennent toutes deux en charge le drapeau `--yes/-y`, utilisé pour sauter toutes les invites interactives :

**Comportement non-interactif de la commande install** (code source `install.ts:424-427`) :

```typescript
// Interactive selection (unless -y flag or single skill)
let skillsToInstall = skillInfos;

if (!options.yes && skillInfos.length > 1) {
  // Entrer dans le processus de sélection interactif
  // ...
}
```

**Caractéristiques du mode non-interactif** :

1. **Sauter la sélection des compétences** : Installer toutes les compétences trouvées
2. **Écrasement automatique** : Écraser directement les compétences existantes (afficher `Overwriting: <skill-name>`)
3. **Sauter la confirmation de conflit** : Ne pas demander l'autorisation d'écraser, exécuter directement
4. **Compatible avec les environnements headless** : Fonctionne normalement dans les environnements CI sans TTY

**Comportement de la fonction warnIfConflict** (code source `install.ts:524-527`) :

```typescript
if (skipPrompt) {
  // Auto-overwrite in non-interactive mode
  console.log(chalk.dim(`Overwriting: ${skillName}`));
  return true;
}
```

::: important Concept important

**Mode non-interactif** : Utilisez le drapeau `--yes/-y` pour sauter toutes les invites interactives, permettant aux commandes de s'exécuter automatiquement dans CI/CD, les scripts et les environnements sans TTY, sans dépendre de la saisie utilisateur.

:::

---

## Suivez-moi

### Étape 1 : Expérimenter l'installation non-interactive

**Pourquoi**
Expérimentez d'abord localement le comportement du mode non-interactif pour comprendre sa différence avec le mode interactif.

Ouvrez un terminal et exécutez :

```bash
# Installation non-interactive (installe toutes les compétences trouvées)
npx openskills install anthropics/skills --yes

# Ou utiliser l'abréviation
npx openskills install anthropics/skills -y
```

**Ce que vous devriez voir** :

```
Cloning into '/tmp/openskills-temp-...'...
...
Found 3 skill(s)

Overwriting: codebase-reviewer
Overwriting: file-writer
Overwriting: git-helper

✅ Installed 3 skill(s)

Next: Run 'openskills sync' to generate AGENTS.md
```

**Explication** :
- Après avoir utilisé le drapeau `-y`, l'interface de sélection des compétences est sautée
- Toutes les compétences trouvées sont automatiquement installées
- Si une compétence existe déjà, `Overwriting: <skill-name>` est affiché et elle est écrasée directement
- Aucune boîte de dialogue de confirmation n'apparaît

---

### Étape 2 : Comparer interactif et non-interactif

**Pourquoi**
En comparant les deux modes, comprenez plus clairement leurs différences et scénarios d'application.

Exécutez les commandes suivantes pour comparer les deux modes :

```bash
# Vider les compétences existantes (pour les tests)
rm -rf .claude/skills

# Installation interactive (affichera l'interface de sélection)
echo "=== Installation interactive ==="
npx openskills install anthropics/skills

# Vider les compétences existantes
rm -rf .claude/skills

# Installation non-interactive (installe automatiquement toutes les compétences)
echo "=== Installation non-interactive ==="
npx openskills install anthropics/skills -y
```

**Ce que vous devriez voir** :

**Mode interactif** :
- Affiche la liste des compétences, vous permettant de cocher avec la barre d'espace
- Nécessite d'appuyer sur Entrée pour confirmer
- Permet d'installer sélectivement certaines compétences

**Mode non-interactif** :
- Affiche directement le processus d'installation
- Installe automatiquement toutes les compétences
- Ne nécessite aucune saisie utilisateur

**Tableau de comparaison** :

| Caractéristique | Mode interactif (par défaut) | Mode non-interactif (-y) |
|--- | --- | ---|
| **Sélection des compétences** | Affiche l'interface de sélection, coche manuelle | Installe automatiquement toutes les compétences trouvées |
| **Confirmation d'écrasement** | Demande s'il faut écraser les compétences existantes | Écrase automatiquement, affiche un message informatif |
| **Exigence TTY** | Nécessite un terminal interactif | Pas nécessaire, peut fonctionner dans les environnements CI |
| **Scénarios applicables** | Développement local, opérations manuelles | CI/CD, scripts, workflows automatisés |
| **Exigence de saisie** | Nécessite une saisie utilisateur | Zéro saisie, exécution automatique |

---

### Étape 3 : Synchronisation non-interactive de AGENTS.md

**Pourquoi**
Apprenez à générer AGENTS.md dans les workflows automatisés, pour que les agents IA utilisent toujours la liste la plus récente des compétences.

Exécutez :

```bash
# Synchronisation non-interactive (synchronise toutes les compétences vers AGENTS.md)
npx openskills sync -y

# Voir AGENTS.md généré
cat AGENTS.md | head -20
```

**Ce que vous devriez voir** :

```
✅ Synced 3 skill(s) to AGENTS.md
```

Contenu de AGENTS.md :

```xml
<skills_system>
This project uses the OpenSkills system for AI agent extensibility.

Usage:
- Ask the AI agent to load specific skills using: "Use the <skill-name> skill"
- The agent will read the skill definition from .claude/skills/<skill-name>/SKILL.md
- Skills provide specialized capabilities like code review, file writing, etc.
</skills_system>

<available_skills>
  <skill name="codebase-reviewer">
    <description>Review code changes for issues...</description>
  </skill>
  <skill name="file-writer">
    <description>Write files with format...</description>
  </skill>
  <skill name="git-helper">
    <description>Git operations and utilities...</description>
  </skill>
</available_skills>
```

**Explication** :
- Le drapeau `-y` saute l'interface de sélection des compétences
- Toutes les compétences installées sont synchronisées vers AGENTS.md
- Aucune boîte de dialogue de confirmation n'apparaît

---

### Étape 4 : Intégration GitHub Actions

**Pourquoi**
Intégrez OpenSkills dans un workflow CI/CD réel pour une gestion automatisée des compétences.

Créez le fichier `.github/workflows/setup-skills.yml` dans votre projet :

```yaml
name: Setup Skills

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  setup-skills:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install OpenSkills
        run: npm install -g openskills

      - name: Install skills (non-interactive)
        run: openskills install anthropics/skills -y

      - name: Sync to AGENTS.md
        run: openskills sync -y

      - name: Verify AGENTS.md
        run: |
          echo "=== AGENTS.md generated ==="
          cat AGENTS.md

      - name: Upload AGENTS.md as artifact
        uses: actions/upload-artifact@v4
        with:
          name: agents-md
          path: AGENTS.md
```

Commitez et poussez vers GitHub :

```bash
git add .github/workflows/setup-skills.yml
git commit -m "Add GitHub Actions workflow for OpenSkills"
git push
```

**Ce que vous devriez voir** : GitHub Actions s'exécute automatiquement, installe avec succès les compétences et génère AGENTS.md.

**Explication** :
- Se déclenche automatiquement à chaque push ou PR
- Utilise `openskills install anthropics/skills -y` pour installer les compétences en mode non-interactif
- Utilise `openskills sync -y` pour synchroniser AGENTS.md en mode non-interactif
- Sauvegarde AGENTS.md comme artifact pour faciliter le débogage

---

### Étape 5 : Utiliser des dépôts privés

**Pourquoi**
Dans les environnements d'entreprise, les compétences sont généralement hébergées dans des dépôts privés et nécessitent un accès SSH dans CI/CD.

Configurez SSH dans GitHub Actions :

```yaml
name: Setup Skills from Private Repo

on:
  push:
    branches: [main]

jobs:
  setup-skills:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup SSH key
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
        run: |
          mkdir -p ~/.ssh
          echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan github.com >> ~/.ssh/known_hosts

      - name: Install OpenSkills
        run: npm install -g openskills

      - name: Install skills from private repo
        run: openskills install git@github.com:your-org/private-skills.git -y

      - name: Sync to AGENTS.md
        run: openskills sync -y
```

Ajoutez `SSH_PRIVATE_KEY` dans **Settings → Secrets and variables → Actions** du dépôt GitHub.

**Ce que vous devriez voir** : GitHub Actions installe avec succès les compétences depuis le dépôt privé.

**Explication** :
- Utilisez Secrets pour stocker la clé privée, éviter les fuites
- Configurez l'accès SSH au dépôt privé
- `openskills install git@github.com:your-org/private-skills.git -y` prend en charge l'installation depuis des dépôts privés

---

### Étape 6 : Intégration Docker

**Pourquoi**
Installez automatiquement les compétences lors de la construction de l'image Docker pour qu'elles soient immédiatement disponibles après le démarrage du conteneur.

Créez `Dockerfile` :

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Installer OpenSkills
RUN npm install -g openskills

# Installer les compétences (non-interactif)
RUN openskills install anthropics/skills -y

# Synchroniser AGENTS.md
RUN openskills sync -y

# Copier le code de l'application
COPY . .

# Autres étapes de construction...
RUN npm install
RUN npm run build

# Commande de démarrage
CMD ["node", "dist/index.js"]
```

Construisez et exécutez :

```bash
# Construire l'image Docker
docker build -t myapp:latest .

# Exécuter le conteneur
docker run -it --rm myapp:latest sh

# Vérifier que les compétences sont installées dans le conteneur
ls -la .claude/skills/
cat AGENTS.md
```

**Ce que vous devriez voir** : Les compétences sont déjà installées dans le conteneur et AGENTS.md est généré.

**Explication** :
- Installez les compétences lors de la phase de construction de l'image Docker
- Utilisez `RUN openskills install ... -y` pour l'installation non-interactive
- Pas besoin d'installer manuellement les compétences après le démarrage du conteneur
- Convient aux microservices, Serverless et autres scénarios

---

### Étape 7 : Configuration des variables d'environnement

**Pourquoi**
Configurez flexiblement les sources de compétences via des variables d'environnement, différents environnements utilisant différents dépôts de compétences.

Créez le fichier `.env.ci` :

```bash
# Configuration de l'environnement CI/CD
SKILLS_SOURCE=anthropics/skills
SKILLS_INSTALL_FLAGS=-y
SYNC_FLAGS=-y
```

Utilisez dans les scripts CI/CD :

```bash
#!/bin/bash
# .github/scripts/setup-skills.sh

set -e

# Charger les variables d'environnement
if [ -f .env.ci ]; then
  export $(cat .env.ci | grep -v '^#' | xargs)
fi

echo "Installing skills from: $SKILLS_SOURCE"
npx openskills install $SKILLS_SOURCE $SKILLS_INSTALL_FLAGS

echo "Syncing to AGENTS.md"
npx openskills sync $SYNC_FLAGS

echo "✅ Skills setup completed"
```

Appelez dans GitHub Actions :

```yaml
- name: Setup skills
  run: .github/scripts/setup-skills.sh
```

**Ce que vous devriez voir** : Le script configure automatiquement les sources et drapeaux de compétences selon les variables d'environnement.

**Explication** :
- Configurez flexiblement les sources de compétences via des variables d'environnement
- Différents environnements (développement, test, production) peuvent utiliser différents fichiers `.env`
- Maintenir la maintenabilité de la configuration CI/CD

---

## Point de vérification ✅

Effectuez les vérifications suivantes pour confirmer que vous maîtrisez le contenu de cette leçon :

- [ ] Comprendre l'objectif et les caractéristiques du mode non-interactif
- [ ] Être capable d'utiliser le drapeau `-y` pour une installation non-interactive
- [ ] Être capable d'utiliser le drapeau `-y` pour une synchronisation non-interactive
- [ ] Comprendre la différence entre le mode interactif et non-interactif
- [ ] Être capable d'intégrer OpenSkills dans GitHub Actions
- [ ] Être capable d'installer des compétences lors de la construction d'images Docker
- [ ] Savoir comment gérer les dépôts privés dans CI/CD
- [ ] Comprendre les meilleures pratiques de configuration des variables d'environnement

---

## Éviter les pièges

### Erreur courante 1 : Oublier d'ajouter le drapeau -y

**Scénario d'erreur** : Oublier d'utiliser le drapeau `-y` dans GitHub Actions

```yaml
# ❌ Erreur : drapeau -y manquant
- name: Install skills
  run: openskills install anthropics/skills
```

**Problème** :
- L'environnement CI n'a pas de terminal interactif (TTY)
- La commande attendra une saisie utilisateur, provoquant un timeout du workflow
- Le message d'erreur peut ne pas être évident

**Approche correcte** :

```yaml
# ✅ Correct : utiliser le drapeau -y
- name: Install skills
  run: openskills install anthropics/skills -y
```

---

### Erreur courante 2 : Perte de configuration due à l'écrasement des compétences

**Scénario d'erreur** : CI/CD écrase les compétences à chaque fois, entraînant la perte de la configuration locale

```bash
# Installation de compétences dans le répertoire global dans CI/CD
openskills install anthropics/skills --global -y

# L'utilisateur local installe dans le répertoire du projet, écrasé par le global
```

**Problème** :
- Les compétences installées globalement ont une priorité inférieure à celle du projet local
- Les emplacements d'installation CI/CD et locaux sont incohérents, entraînant de la confusion
- Peut écraser les compétences soigneusement configurées par l'utilisateur local

**Approche correcte** :

```bash
# Solution 1 : CI/CD et local utilisent tous deux l'installation de projet
openskills install anthropics/skills -y

# Solution 2 : Utiliser le mode Universal pour éviter les conflits
openskills install anthropics/skills --universal -y

# Solution 3 : CI/CD utilise un répertoire dédié (via un chemin de sortie personnalisé)
openskills install anthropics/skills -y
openskills sync -o .agents-md/AGENTS.md -y
```

---

### Erreur courante 3 : Autorisations Git insuffisantes

**Scénario d'erreur** : Installation de compétences depuis un dépôt privé sans configuration de clé SSH

```yaml
# ❌ Erreur : clé SSH non configurée
- name: Install from private repo
  run: openskills install git@github.com:your-org/private-skills.git -y
```

**Problème** :
- L'environnement CI ne peut pas accéder au dépôt privé
- Message d'erreur : `Permission denied (publickey)`
- Le clone échoue, le workflow échoue

**Approche correcte** :

```yaml
# ✅ Correct : configurer la clé SSH
- name: Setup SSH key
  env:
    SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
  run: |
    mkdir -p ~/.ssh
    echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
    chmod 600 ~/.ssh/id_rsa
    ssh-keyscan github.com >> ~/.ssh/known_hosts

- name: Install from private repo
  run: openskills install git@github.com:your-org/private-skills.git -y
```

---

### Erreur courante 4 : Image Docker trop volumineuse

**Scénario d'erreur** : L'installation de compétences dans Dockerfile entraîne une taille d'image trop importante

```dockerfile
# ❌ Erreur : clone et réinstallation à chaque fois
RUN openskills install anthropics/skills -y
```

**Problème** :
- Clone le dépôt depuis GitHub à chaque construction
- Augmente le temps de construction et la taille de l'image
- Les problèmes de réseau peuvent entraîner des échecs

**Approche correcte** :

```dockerfile
# ✅ Correct : utiliser le multi-stage build et le cache
FROM node:20-alpine AS skills-builder

RUN npm install -g openskills
RUN openskills install anthropics/skills -y
RUN openskills sync -y

# Image principale
FROM node:20-alpine

WORKDIR /app

# Copier les compétences installées
COPY --from=skills-builder ~/.claude /root/.claude
COPY --from=skills-builder /app/AGENTS.md /app/

# Copier le code de l'application
COPY . .

# Autres étapes de construction...
```

---

### Erreur courante 5 : Oublier de mettre à jour les compétences

**Scénario d'erreur** : CI/CD installe toujours l'ancienne version des compétences

```yaml
# ❌ Erreur : seulement installer, pas mettre à jour
- name: Install skills
  run: openskills install anthropics/skills -y
```

**Problème** :
- Le dépôt de compétences a peut-être été mis à jour
- La version des compétences installée par CI/CD n'est pas la plus récente
- Peut entraîner des fonctionnalités manquantes ou des bugs

**Approche correcte** :

```yaml
# ✅ Correct : mettre à jour d'abord, puis synchroniser
- name: Update skills
  run: openskills update -y

- name: Sync to AGENTS.md
  run: openskills sync -y

# Ou utiliser une stratégie de mise à jour lors de l'installation
- name: Install or update skills
  run: |
    openskills install anthropics/skills -y || openskills update -y
```

---

## Résumé de la leçon

**Points clés** :

1. **Le mode non-interactif convient à CI/CD** : Utilisez le drapeau `-y` pour sauter toutes les invites interactives
2. **Drapeau -y de la commande install** : Installe automatiquement toutes les compétences trouvées, écrase les compétences existantes
3. **Drapeau -y de la commande sync** : Synchronise automatiquement toutes les compétences vers AGENTS.md
4. **Intégration GitHub Actions** : Utilisez des commandes non-interactives dans le workflow pour automatiser la gestion des compétences
5. **Scénario Docker** : Installez les compétences lors de la phase de construction de l'image pour qu'elles soient immédiatement disponibles après le démarrage du conteneur
6. **Accès aux dépôts privés** : Configurez l'accès aux dépôts de compétences privés via des clés SSH
7. **Configuration des variables d'environnement** : Configurez flexiblement les sources et paramètres d'installation des compétences via des variables d'environnement

**Processus de décision** :

```
[Besoin d'utiliser OpenSkills dans CI/CD] → [Installer les compétences]
                                     ↓
                             [Utiliser le drapeau -y pour sauter l'interaction]
                                     ↓
                             [Générer AGENTS.md]
                                     ↓
                             [Utiliser le drapeau -y pour sauter l'interaction]
                                     ↓
                             [Vérifier que les compétences sont correctement installées]
```

**Mnémonique** :

- **CI/CD n'oubliez pas d'ajouter -y** : Le mode non-interactif est la clé
- **GitHub Actions utilisez SSH** : Les dépôts privés nécessitent une clé
- **Construisez tôt dans Docker** : Faites attention à la taille de l'image
- **Configurez bien les variables d'environnement** : Différents environnements doivent être distingués

---

## Prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[Notes de sécurité](../security/)**.
>
> Vous apprendrez :
> - Les fonctionnalités de sécurité d'OpenSkills et les mécanismes de protection
> - Comment fonctionne la protection contre le parcours de répertoire
> - Le mode de gestion sécurisée des liens symboliques
> - Les mesures de sécurité de l'analyse YAML
> - Les meilleures pratiques de gestion des autorisations

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer la référence du code source</strong></summary>

> Date de mise à jour : 2026-01-24

| Fonction              | Chemin du fichier                                                                                                    | Ligne    |
|--- | --- | ---|
| Installation non-interactive      | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L424-L455) | 424-455 |
| Détection de conflits et écrasement    | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L521-L550) | 521-550 |
| Synchronisation non-interactive      | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L46-L93)   | 46-93   |
| Définition des arguments de ligne de commande    | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L49)                          | 49      |
| Définition des arguments de ligne de commande    | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L65)                          | 65      |

**Constantes clés** :
- `-y, --yes` : Drapeau de ligne de commande pour sauter la sélection interactive

**Fonctions clés** :
- `warnIfConflict(skillName, targetPath, isProject, skipPrompt)` : Détecte les conflits de compétences et décide s'il faut écraser
- `installFromRepo()` : Installe les compétences depuis un dépôt (prend en charge le mode non-interactif)
- `syncAgentsMd()` : Synchronise les compétences vers AGENTS.md (prend en charge le mode non-interactif)

**Règles métier** :
- Lors de l'utilisation du drapeau `-y`, sauter toutes les invites interactives
- Lorsqu'une compétence existe déjà, le mode non-interactif l'écrase automatiquement (affiche `Overwriting: <skill-name>`)
- Le mode non-interactif fonctionne normalement dans les environnements headless (sans TTY)
- Les commandes `install` et `sync` prennent toutes deux en charge le drapeau `-y`

</details>

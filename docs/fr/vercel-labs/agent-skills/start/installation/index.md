---
title: "Installation rapide : Claude Code et claude.ai | Agent Skills"
sidebarTitle: "Installation"
subtitle: "Installer Agent Skills"
description: "Apprenez à installer Agent Skills dans Claude Code et claude.ai. Maîtrisez l'installation npx, la copie manuelle et la configuration des autorisations réseau."
tags:
  - "Installation"
  - "Claude Code"
  - "claude.ai"
  - "Autorisations réseau"
prerequisite:
  - "start-getting-started"
---

# Installer Agent Skills

## Ce que vous pourrez faire après ce cours

- Installer Agent Skills en une seule commande (recommandé)
- Copier manuellement les compétences dans le répertoire local de Claude Code
- Activer les compétences dans claude.ai et configurer les autorisations réseau
- Dépanner les erreurs courantes lors de l'installation

## Votre problème actuel

Vous souhaitez utiliser Agent Skills pour que Claude vous aide à déployer des projets et auditer le code, mais vous ne savez pas comment l'installer dans Claude Code ou claude.ai. Ou vous avez essayé l'installation, mais les compétences ne s'activent pas, et le déploiement signale « Network Egress Error ».

## Quand utiliser cette technique

- ✓ Première utilisation d'Agent Skills
- ✓ Vous utilisez Claude Code (outil de ligne de commande)
- ✓ Vous utilisez claude.ai (version Web de Claude)
- ✓ Vous devez permettre aux compétences d'accéder au réseau (fonctionnalité de déploiement)

## 🎒 Avant de commencer

Avant de commencer, confirmez que vous avez :
- [ ] Installé Node.js version 20 ou supérieure
- [ ] Un compte actif Claude Code ou claude.ai

::: tip Conseil
Si vous n'avez pas encore compris ce qu'est Agent Skills, il est recommandé de lire d'abord [Agent Skills 101](../getting-started/).
:::

## L'idée centrale

Il existe deux méthodes pour installer Agent Skills :

1. **Installation npx (recommandée)** : installation en un clic dans Claude Code, automatisant toutes les étapes
2. **Installation manuelle** : copie de fichiers dans le répertoire spécifié, adapté pour claude.ai ou nécessitant un emplacement d'installation personnalisé

Une fois installées, les compétences s'activeront automatiquement dans Claude - il vous suffit de déclencher des mots-clés (comme « Deploy my app »), et Claude appellera automatiquement la compétence correspondante.

## Méthode 1 : installation rapide npx (recommandée)

C'est la méthode d'installation la plus simple, adaptée aux utilisateurs de Claude Code.

### Étape 1 : exécuter la commande d'installation

Dans le terminal, exécutez :

```bash
npx add-skill vercel-labs/agent-skills
```

**Pourquoi**
`add-skill` est un paquet npm qui téléchargera automatiquement Agent Skills et l'installera dans le bon répertoire.

**Vous devriez voir** :
```
Skills successfully installed.
```

### Étape 2 : vérifier l'installation

Dans Claude Code, saisissez :

```
List available skills
```

**Vous devriez voir** :
Dans la liste des compétences renvoyée par Claude, vous devriez trouver :
- `react-best-practices`
- `web-design-guidelines`
- `vercel-deploy`

**Point de contrôle ✅** : si vous voyez ces 3 compétences, l'installation a réussi.

## Méthode 2 : installation manuelle dans Claude Code

Si vous ne souhaitez pas utiliser npx, ou si vous devez contrôler l'emplacement d'installation, vous pouvez utiliser l'installation manuelle.

### Étape 1 : cloner ou télécharger le projet

```bash
git clone https://github.com/vercel-labs/agent-skills.git
cd agent-skills
```

**Pourquoi**
L'installation manuelle nécessite d'abord d'obtenir le code source du projet.

### Étape 2 : copier les compétences dans le répertoire Claude Code

```bash
cp -r skills/react-best-practices ~/.claude/skills/
cp -r skills/web-design-guidelines ~/.claude/skills/
cp -r skills/claude.ai/vercel-deploy-claimable ~/.claude/skills/vercel-deploy
```

**Pourquoi**
Les compétences de Claude Code sont stockées dans le répertoire `~/.claude/skills/`. Une fois copiées, Claude peut reconnaître ces compétences.

**Vous devriez voir** :
L'exécution de la commande se termine sans erreur de sortie.

**Point de contrôle ✅** :
Utilisez `ls ~/.claude/skills/` pour vérifier, vous devriez pouvoir voir 3 répertoires de compétences : `react-best-practices`, `web-design-guidelines`, `vercel-deploy`.

### Étape 3 : redémarrer Claude Code

Forcez la fermeture de Claude Code, puis rouvrez-le.

**Pourquoi**
Claude Code ne charge la liste des compétences qu'au démarrage, vous devez donc redémarrer pour reconnaître les compétences nouvellement installées.

## Méthode 3 : utiliser les compétences dans claude.ai

Si vous utilisez claude.ai (version Web de Claude), la méthode d'installation est différente.

### Méthode 3.1 : ajouter à la base de connaissances du projet

#### Étape 1 : sélectionner les fichiers de compétence

Empaquetez tous les fichiers des répertoires `skills/react-best-practices`, `skills/web-design-guidelines`, `skills/claude.ai/vercel-deploy-claimable`.

**Pourquoi**
claude.ai nécessite d'ajouter les fichiers de compétence comme « base de connaissances » au projet.

#### Étape 2 : téléverser dans le projet

Dans claude.ai :
1. Créez un nouveau projet ou ouvrez-en un existant
2. Cliquez sur « Knowledge » → « Add Files »
3. Téléversez les fichiers de compétence (ou le répertoire entier)

**Vous devriez voir** :
La base de connaissances affiche la liste des fichiers du projet.

### Méthode 3.2 : coller le contenu de SKILL.md

Si vous ne souhaitez pas téléverser le répertoire entier, vous pouvez copier directement le contenu de `SKILL.md`.

#### Étape 1 : copier la définition de compétence

Ouvrez `skills/react-best-practices/SKILL.md` et copiez tout le contenu.

**Pourquoi**
`SKILL.md` contient la définition complète de la compétence, et Claude comprendra la fonctionnalité de la compétence à partir de ce fichier.

#### Étape 2 : coller dans la conversation

Collez le contenu de `SKILL.md` dans la conversation claude.ai, ou ajoutez-le aux « Instructions » du projet.

**Vous devriez voir** :
Claude confirme avoir reçu la définition de compétence.

## Configuration des autorisations réseau (important)

Si vous utilisez la compétence `vercel-deploy` pour déployer des projets, vous devez configurer les autorisations réseau.

::: warning Important
La compétence `vercel-deploy` nécessite d'accéder au domaine `*.vercel.com` pour téléverser des déploiements. Ignorer cette étape entraînera l'échec du déploiement !
:::

### Étape 1 : ouvrir les paramètres des capacités Claude

Dans le navigateur, visitez :
```
https://claude.ai/settings/capabilities
```

**Pourquoi**
Ici, vous contrôlez la liste des domaines que Claude peut accéder.

### Étape 2 : ajouter le domaine Vercel

Cliquez sur « Add domain », saisissez :
```
*.vercel.com
```

Cliquez sur « Save » pour enregistrer.

**Vous devriez voir** :
`*.vercel.com` apparaît dans la liste des domaines.

**Point de contrôle ✅** : le domaine a été ajouté, les compétences peuvent maintenant accéder au réseau.

## Mises en garde

### Problème 1 : compétences non activées

**Phénomène** : vous saisissez « Deploy my app », mais Claude ne sait pas quoi faire.

**Causes possibles** :
- Claude Code n'a pas été redémarré (installation manuelle)
- La base de connaissances du projet claude.ai n'a pas correctement chargé les compétences

**Méthodes de résolution** :
- Claude Code : redémarrez l'application
- claude.ai : confirmez que les fichiers de compétence ont été téléversés dans la Knowledge du projet

### Problème 2 : échec du déploiement (Network Egress Error)

**Phénomène** :
```
Deployment failed due to network restrictions
```

**Méthode de résolution** :
Vérifiez si `*.vercel.com` a été ajouté aux autorisations réseau :
```
Visiter https://claude.ai/settings/capabilities
Vérifier si *.vercel.com est inclus
```

### Problème 3 : répertoire `~/.claude/skills/` introuvable

**Phénomène** : lors de l'installation manuelle, le message indique que le répertoire n'existe pas.

**Méthode de résolution** :
```bash
mkdir -p ~/.claude/skills/
```

### Problème 4 : échec de l'installation npx

**Phénomène** :
```
npx: command not found
```

**Méthode de résolution** :
```bash
# Confirmer que Node.js et npm sont installés
node -v
npm -v

# Si non installés, installer la version LTS depuis https://nodejs.org/
```

## Résumé de ce cours

Ce cours a présenté trois méthodes d'installation d'Agent Skills :
- **Installation rapide npx** : recommandée pour Claude Code, en un clic
- **Installation manuelle** : copie de fichiers dans `~/.claude/skills/`, adaptée si vous devez contrôler l'emplacement d'installation
- **Installation claude.ai** : téléversement de fichiers dans la base de connaissances du projet ou collage de `SKILL.md`

Si vous utilisez la compétence `vercel-deploy`, n'oubliez pas d'ajouter l'autorisation réseau `*.vercel.com` à `https://claude.ai/settings/capabilities`.

Une fois l'installation terminée, vous pouvez laisser Claude utiliser automatiquement ces compétences pour auditer le code, vérifier l'accessibilité et déployer des projets.

## Aperçu du cours suivant

> Dans le cours suivant, nous apprendrons **[Meilleures pratiques d'optimisation des performances React/Next.js](../../platforms/react-best-practices/)**.
>
> Vous apprendrez :
> - Comment utiliser 57 règles d'optimisation des performances React
> - Éliminer les cascades, optimiser la taille des packages, réduire les re-renders
> - Laissez l'IA auditer automatiquement le code et fournir des suggestions de correction

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Dernière mise à jour :2026-01-25

| Fonctionnalité | Chemin de fichier | Ligne |
| ------------- | ------------------------------------------ | ----- |
| Méthode d'installation npx | [`README.md:83-86`](https://github.com/vercel-labs/agent-skills/blob/main/README.md#L83-L86) | 83-86 |
| Installation manuelle Claude Code | [`AGENTS.md:98-105`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L98-L105) | 98-105 |
| Méthode d'installation claude.ai | [`AGENTS.md:106-109`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L106-L109) | 106-109 |
| Configuration des autorisations réseau | [`skills/claude.ai/vercel-deploy-claimable/SKILL.md:104-112`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/SKILL.md#L104-L112) | 104-112 |

**Packs de compétences clés** :
- `react-best-practices` : 57 règles d'optimisation des performances React (nombre réel de fichiers de règles)
- `web-design-guidelines` : plus de 100 règles de directives de conception Web
- `vercel-deploy` : déploiement en un clic vers Vercel (supporte 40+ frameworks)

</details>

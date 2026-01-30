---
title: "CLI vs MCP : Choix de conception | OpenSkills"
sidebarTitle: "Pourquoi CLI plutôt que MCP"
subtitle: "Pourquoi CLI et non MCP ?"
description: "Découvrez les raisons de conception d'OpenSkills qui privilégie CLI plutôt que MCP. Comparez les différences de positionnement entre les deux, comprenez pourquoi le système de compétences convient au mode fichier statique, et comment réaliser l'universalité multi-agents et le déploiement sans configuration."
tags:
- "FAQ"
- "Philosophie de conception"
- "MCP"
prerequisite:
- "start-what-is-openskills"
order: 3
---

# Pourquoi CLI plutôt que MCP ?

## Ce que vous apprendrez

Ce cours vous aide à comprendre :

- ✅ Les différences de positionnement entre MCP et le système de compétences
- ✅ Pourquoi CLI est plus adapté au chargement de compétences
- ✅ La philosophie de conception d'OpenSkills
- ✅ Les principes techniques du système de compétences

## Votre situation actuelle

Vous vous demandez peut-être :

- "Pourquoi ne pas utiliser le protocole MCP plus avancé ?"
- "La méthode CLI n'est-elle pas trop ancienne ?"
- "MCP n'est-il pas plus conforme à la conception de l'ère de l'IA ?"

Ce cours vous aide à comprendre les considérations techniques derrière ces décisions de conception.

---

## Question centrale : qu'est-ce qu'une compétence ?

Avant de discuter de CLI vs MCP, comprenons d'abord la nature d'une "compétence".

### La nature d'une compétence

::: info Définition d'une compétence
Une compétence est une combinaison d'**instructions statiques + ressources**, comprenant :
- `SKILL.md` : guide d'opération détaillé et prompts
- `references/` : documents de référence
- `scripts/` : scripts exécutables
- `assets/` : images, modèles et autres ressources

Une compétence **n'est pas** un service dynamique, une API en temps réel ou un outil nécessitant un serveur.
:::

### La conception officielle d'Anthropic

Le système de compétences d'Anthropic est lui-même conçu autour du **système de fichiers** :

- Les compétences existent sous forme de fichiers `SKILL.md`
- Les compétences disponibles sont décrites via un bloc XML `<available_skills>`
- L'agent IA lit le contenu des fichiers dans le contexte selon les besoins

Cela détermine que la sélection technologique du système de compétences doit être compatible avec le système de fichiers.

---

## MCP vs OpenSkills : comparaison des positionnements

| Dimension de comparaison | MCP (Model Context Protocol) | OpenSkills (CLI) |
| --- | --- | --- |
| **Scénarios applicables** | Outils dynamiques, appels API en temps réel | Instructions statiques, documents, scripts |
| **Exigences d'exécution** | Nécessite un serveur MCP | Aucun serveur requis (fichiers purs) |
| **Support des agents** | Uniquement les agents supportant MCP | Tous les agents pouvant lire `AGENTS.md` |
| **Complexité** | Nécessite déploiement et maintenance serveur | Zéro configuration, prêt à l'emploi |
| **Source de données** | Récupération en temps réel depuis le serveur | Lecture depuis le système de fichiers local |
| **Dépendance réseau** | Requise | Non requise |
| **Chargement des compétences** | Via appel de protocole | Via lecture de fichier |

---

## Pourquoi CLI est-il plus adapté au système de compétences ?

### 1. Une compétence est un fichier

**MCP nécessite un serveur** : il faut déployer un serveur MCP, gérer les requêtes, les réponses, le handshake de protocole...

**CLI nécessite seulement des fichiers** :

```bash
# Les compétences sont stockées dans le système de fichiers
.claude/skills/pdf/
├── SKILL.md          # Fichier d'instructions principal
├── references/       # Documents de référence
│   └── pdf-format-spec.md
├── scripts/          # Scripts exécutables
│   └── extract-pdf.py
└── assets/           # Fichiers de ressources
    └── pdf-icon.png
```

**Avantages** :
- ✅ Zéro configuration, aucun serveur requis
- ✅ Les compétences peuvent être versionnées
- ✅ Fonctionnement hors ligne
- ✅ Déploiement simple

### 2. Universalité : tous les agents peuvent l'utiliser

**Limitations de MCP** :

Seuls les agents supportant le protocole MCP peuvent l'utiliser. Si Cursor, Windsurf, Aider et autres agents implémentent chacun MCP, cela entraîne :
- Travail de développement redondant
- Problèmes de compatibilité de protocole
- Difficultés de synchronisation des versions

**Avantages de CLI** :

Tout agent capable d'exécuter des commandes shell peut l'utiliser :

```bash
# Appel via Claude Code
npx openskills read pdf

# Appel via Cursor
npx openskills read pdf

# Appel via Windsurf
npx openskills read pdf
```

**Coût d'intégration nul** : l'agent doit seulement pouvoir exécuter des commandes shell.

### 3. Conforme à la conception officielle

Le système de compétences d'Anthropic est lui-même une **conception basée sur le système de fichiers**, pas une conception MCP :

```xml
<!-- Description des compétences dans AGENTS.md -->
<available_skills>
  <skill>
    <name>pdf</name>
    <description>Comprehensive PDF manipulation toolkit...</description>
    <location>project</location>
  </skill>
</available_skills>
```

**Méthode d'appel** :

```bash
# Méthode d'appel de la conception officielle
npx openskills read pdf
```

OpenSkills suit entièrement la conception officielle d'Anthropic, maintenant la compatibilité.

### 4. Chargement progressif (Progressive Disclosure)

**Avantage principal du système de compétences** : chargement à la demande, maintien d'un contexte léger.

**Implémentation CLI** :

```bash
# Le contenu de la compétence n'est chargé que lorsque nécessaire
npx openskills read pdf
# Sortie : contenu complet de SKILL.md vers la sortie standard
```

**Défis de MCP** :

Si implémenté via MCP, il faudrait :
- Un serveur gérant la liste des compétences
- Une logique de chargement à la demande
- Une gestion du contexte

La méthode CLI supporte naturellement le chargement progressif.

---

## Scénarios applicables de MCP

MCP résout des problèmes **différents** de ceux du système de compétences :

| Problèmes résolus par MCP | Exemples |
| --- | --- |
| **Appels API en temps réel** | Appel API OpenAI, requêtes base de données |
| **Outils dynamiques** | Calculatrice, service de conversion de données |
| **Intégration de services distants** | Opérations Git, systèmes CI/CD |
| **Gestion d'état** | Outils nécessitant un état serveur |

Ces scénarios nécessitent un **serveur** et un **protocole**, MCP est le bon choix.

---

## Système de compétences vs MCP : pas une relation de concurrence

**Point central** : MCP et le système de compétences résolvent des problèmes différents, ce n'est pas l'un ou l'autre.

### Positionnement du système de compétences

```
[Instructions statiques] → [SKILL.md] → [Système de fichiers] → [Chargement CLI]
```

Scénarios applicables :
- Guides d'opération et bonnes pratiques
- Documentation et références
- Scripts statiques et modèles
- Configurations nécessitant un contrôle de version

### Positionnement de MCP

```
[Outils dynamiques] → [Serveur MCP] → [Appel de protocole] → [Réponse en temps réel]
```

Scénarios applicables :
- Appels API en temps réel
- Requêtes base de données
- Services distants nécessitant un état
- Calculs et conversions complexes

### Relation complémentaire

OpenSkills n'exclut pas MCP, mais se **concentre sur le chargement de compétences** :

```
Agent IA
├─ Système de compétences (OpenSkills CLI) → Chargement d'instructions statiques
└─ Outils MCP → Appel de services dynamiques
```

Ils sont complémentaires, pas substituables.

---

## Cas pratiques : lequel utiliser quand ?

### Cas 1 : Opérations Git

❌ **Inadapté au système de compétences** :
- Les opérations Git sont dynamiques, nécessitent une interaction en temps réel
- Dépendent de l'état du serveur Git

✅ **Adapté à MCP** :
```bash
# Appel via outil MCP
git:checkout(branch="main")
```

### Cas 2 : Guide de traitement PDF

❌ **Inadapté à MCP** :
- Le guide d'opération est statique
- Ne nécessite pas de serveur

✅ **Adapté au système de compétences** :
```bash
# Chargement via CLI
npx openskills read pdf
# Sortie : étapes détaillées de traitement PDF et bonnes pratiques
```

### Cas 3 : Requête base de données

❌ **Inadapté au système de compétences** :
- Nécessite une connexion à la base de données
- Les résultats sont dynamiques

✅ **Adapté à MCP** :
```bash
# Appel via outil MCP
database:query(sql="SELECT * FROM users")
```

### Cas 4 : Normes de revue de code

❌ **Inadapté à MCP** :
- Les normes de revue sont des documents statiques
- Nécessitent un contrôle de version

✅ **Adapté au système de compétences** :
```bash
# Chargement via CLI
npx openskills read code-review
# Sortie : liste de contrôle détaillée de revue de code et exemples
```

---

## Avenir : fusion de MCP et du système de compétences

### Directions d'évolution possibles

**MCP + Système de compétences** :

```bash
# Référence à des outils MCP dans les compétences
npx openskills read pdf-tool

# Contenu de SKILL.md
Cette compétence nécessite l'utilisation d'outils MCP :

1. Utiliser mcp:pdf-extract pour extraire le texte
2. Utiliser mcp:pdf-parse pour analyser la structure
3. Utiliser les scripts fournis par cette compétence pour traiter les résultats
```

**Avantages** :
- Les compétences fournissent des instructions avancées et bonnes pratiques
- MCP fournit des outils dynamiques de bas niveau
- La combinaison des deux offre des fonctionnalités plus puissantes

### Phase actuelle

OpenSkills choisit CLI car :
1. Le système de compétences est déjà une conception mature basée sur les fichiers
2. La méthode CLI est simple à implémenter et universelle
3. Pas besoin d'attendre que chaque agent implémente le support MCP

---

## Résumé du cours

Raisons principales pour lesquelles OpenSkills choisit CLI plutôt que MCP :

### Raisons principales

- ✅ **Les compétences sont des fichiers statiques** : aucun serveur requis, stockage dans le système de fichiers
- ✅ **Plus universel** : tous les agents peuvent l'utiliser, indépendamment du protocole MCP
- ✅ **Conforme à la conception officielle** : le système de compétences d'Anthropic est lui-même une conception basée sur les fichiers
- ✅ **Déploiement sans configuration** : aucun serveur requis, prêt à l'emploi

### MCP vs Système de compétences

| MCP | Système de compétences (CLI) |
| --- | --- |
| Outils dynamiques | Instructions statiques |
| Nécessite un serveur | Système de fichiers pur |
| API en temps réel | Documents et scripts |
| Nécessite un support de protocole | Coût d'intégration nul |

### Pas de concurrence, mais complémentarité

- MCP résout les problèmes d'outils dynamiques
- Le système de compétences résout les problèmes d'instructions statiques
- Les deux peuvent être utilisés ensemble

---

## Lectures connexes

- [Qu'est-ce qu'OpenSkills ?](../../start/what-is-openskills/)
- [Détails des commandes](../../platforms/cli-commands/)
- [Créer des compétences personnalisées](../../advanced/create-skills/)

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Fonction | Chemin du fichier | Lignes |
| --- | --- | --- |
| Entrée CLI | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts) | 39-80 |
| Commande de lecture | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts) | 1-50 |
| Génération AGENTS.md | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts) | 23-93 |

**Décisions de conception clés** :
- Méthode CLI : chargement des compétences via `npx openskills read <name>`
- Stockage dans le système de fichiers : compétences stockées dans `.claude/skills/` ou `.agent/skills/`
- Compatibilité universelle : sortie au format XML identique à Claude Code

</details>

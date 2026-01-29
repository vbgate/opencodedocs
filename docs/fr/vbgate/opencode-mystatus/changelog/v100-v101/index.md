---
title: "v1.0.0 - v1.0.1: Version initiale | opencode-mystatus"
sidebarTitle: "v1.0.0 - v1.0.1"
description: "Découvrez les fonctionnalités de la version initiale opencode-mystatus v1.0.0: interrogation de quota multi-plateforme et barres de progression visuelles."
subtitle: "v1.0.0 - v1.0.1 : publication de la version initiale et correction des commandes slash"
tags:
  - "version"
  - "journal des modifications"
  - "v1.0.0"
  - "v1.0.1"
order: 2
---

# v1.0.0 - v1.0.1 : publication de la version initiale et correction des commandes slash

## Aperçu des versions

**v1.0.0** (2026-01-11) est la version initiale d'opencode-mystatus, apportant les fonctionnalités de base d'interrogation de quota multi-plateforme.

**v1.0.1** (2026-01-11) a suivi immédiatement, corrigeant un problème critique de prise en charge des commandes slash.

---

## v1.0.1 - Correction des commandes slash

### Problème corrigé

**Inclure le répertoire `command/` dans le package npm**

- **Description du problème** : Après la publication de v1.0.0, il a été découvert que la commande slash `/mystatus` ne fonctionnait pas correctement
- **Analyse de la cause** : L'empaquetage npm a omis le répertoire `command/`, empêchant OpenCode de reconnaître la commande slash
- **Solution** : Mettre à jour le champ `files` dans `package.json` pour garantir que le répertoire `command/` est inclus dans le package publié
- **Impact** : Affecte uniquement les utilisateurs installant via npm, l'installation manuelle n'est pas affectée

### Recommandation de mise à niveau

Si vous avez déjà installé v1.0.0, nous vous recommandons de passer immédiatement à v1.0.1 pour bénéficier du support complet des commandes slash :

```bash
## Mettre à niveau vers la dernière version
npm update @vbgate/opencode-mystatus
```

---

## v1.0.0 - Publication de la version initiale

### Nouvelles fonctionnalités

**1. Interrogation de quota multi-plateforme**

Prend en charge l'interrogation en un clic de l'utilisation du quota des plateformes suivantes :

| Plateforme | Types d'abonnement pris en charge | Types de quota |
| ---------- | -------------------------------- | -------------- |
| OpenAI | Plus/Team/Pro | Limite de 3 heures, limite de 24 heures |
| Zhipu AI | Coding Plan | Limite de token sur 5 heures, quota mensuel MCP |
| Google Cloud | Antigravity | G3 Pro, G3 Image, G3 Flash, Claude |

**2. Barres de progression visuelles**

Affichage intuitif de l'utilisation du quota :

```
OpenAI (user@example.com)
━━━━━━━━━━━━━━━━━━━━ 75%
Utilisé 750 / 1000 demandes
```

**3. Support multilingue**

- Chinois (simplifié)
- Anglais

Détection automatique de la langue, aucun changement manuel nécessaire.

**4. Masquage sécurisé de la clé API**

Toutes les informations sensibles (clé API, jeton OAuth) sont automatiquement masquées lors de l'affichage :

```
Zhipu AI (zhipuai-coding-plan)
Clé API: sk-a1b2****xyz
```

---

## Utilisation

### Commande slash (recommandée)

Dans OpenCode, entrez :

```
/mystatus
```

### Langage naturel

Vous pouvez également demander en langage naturel :

```
Voir mon quota de toutes les plateformes IA
```

---

## Guide de mise à niveau

### Mise à niveau de v1.0.0 vers v1.0.1

```bash
npm update @vbgate/opencode-mystatus
```

Après la mise à niveau, redémarrez OpenCode pour utiliser la commande slash `/mystatus`.

### Première installation

```bash
npm install -g @vbgate/opencode-mystatus
```

Une fois l'installation terminée, entrez `/mystatus` dans OpenCode pour interroger le quota de toutes les plateformes.

---

## Limitations connues

- v1.0.0 ne prend pas en charge GitHub Copilot (ajouté dans v1.2.0)
- v1.0.0 ne prend pas en charge Z.ai (ajouté dans v1.1.0)

Pour utiliser ces fonctionnalités, veuillez passer à la dernière version.

---

## Prochaines étapes

Consultez le [journal des modifications v1.2.0 - v1.2.4](../v120-v124/) pour découvrir les nouvelles fonctionnalités telles que le support GitHub Copilot.

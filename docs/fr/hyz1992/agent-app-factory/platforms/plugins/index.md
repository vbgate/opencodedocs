---
title: "Installation des plugins requis : superpowers et ui-ux-pro-max | Tutoriel AI App Factory"
sidebarTitle: "Installation des plugins en 5 minutes"
subtitle: "Installation des plugins requis : superpowers et ui-ux-pro-max | Tutoriel AI App Factory"
description: "Apprenez à installer et vérifier les deux plugins requis pour AI App Factory : superpowers (pour le brainstorming Bootstrap) et ui-ux-pro-max (pour le système de conception UI). Ce tutoriel couvre l'installation automatique, l'installation manuelle, les méthodes de vérification et le dépannage des problèmes courants, garantissant que le pipeline peut s'exécuter correctement et générer des applications de haute qualité et fonctionnelles, évitant les échecs dus à des plugins manquants."
tags:
  - "Installation de plugins"
  - "Claude Code"
  - "superpowers"
  - "ui-ux-pro-max"
prerequisite:
  - "start-installation"
  - "start-init-project"
  - "platforms-claude-code"
order: 70
---

# Installation des plugins requis : superpowers et ui-ux-pro-max | Tutoriel AI App Factory

## Ce que vous pourrez faire après ce cours

- Vérifier si les plugins superpowers et ui-ux-pro-max sont installés
- Installer manuellement ces deux plugins requis (si l'installation automatique échoue)
- Vérifier que les plugins sont correctement activés
- Comprendre pourquoi ces deux plugins sont des prérequis pour l'exécution du pipeline
- Résoudre les problèmes courants d'échec d'installation de plugins

## Votre problème actuel

Lors de l'exécution du pipeline Factory, vous pourriez rencontrer :

- **Échec de l'étape Bootstrap** : message « compétence superpowers:brainstorm non utilisée »
- **Échec de l'étape UI** : message « compétence ui-ux-pro-max non utilisée »
- **Échec de l'installation automatique** : erreur lors de l'installation des plugins pendant `factory init`
- **Conflit de plugins** : un plugin du même nom existe déjà mais la version est incorrecte
- **Problème de permissions** : les plugins ne sont pas correctement activés après installation

En réalité, Factory tente **automatiquement d'installer** ces deux plugins lors de l'initialisation, mais en cas d'échec, vous devez les gérer manuellement.

## Quand utiliser cette méthode

Une installation manuelle des plugins est nécessaire dans les cas suivants :

- Message d'échec de l'installation des plugins lors de `factory init`
- Les étapes Bootstrap ou UI détectent que les compétences requises ne sont pas utilisées
- Première utilisation de Factory, pour garantir que le pipeline peut s'exécuter normalement
- Version de plugin trop ancienne, nécessitant une réinstallation

## Pourquoi ces deux plugins sont nécessaires

Le pipeline de Factory dépend de deux plugins clés de Claude Code :

| Plugin | Utilité | Étape du pipeline | Compétences fournies |
| --- | --- | --- | --- |
| **superpowers** | Explorer en profondeur les idées de produit | Bootstrap | `superpowers:brainstorm` - brainstorming systématique, analyse des problèmes, utilisateurs, valeur et hypothèses |
| **ui-ux-pro-max** | Générer un système de conception professionnel | UI | `ui-ux-pro-max` - 67 styles, 96 palettes de couleurs, 100 règles de l'industrie |

::: warning Exigence obligatoire
Selon la définition de `agents/orchestrator.checkpoint.md`, ces deux plugins sont **obligatoires** :
- **Étape Bootstrap** : doit utiliser la compétence `superpowers:brainstorm`, sinon le résultat est rejeté
- **Étape UI** : doit utiliser la compétence `ui-ux-pro-max`, sinon le résultat est rejeté

:::

## 🎒 Préparatifs avant de commencer

Avant de commencer, assurez-vous de :

- [ ] Avoir installé Claude CLI (la commande `claude --version` est disponible)
- [ ] Avoir terminé l'initialisation du projet avec `factory init`
- [ ] Avoir configuré les permissions Claude Code (référez-vous au [Guide d'intégration Claude Code](../claude-code/))
- [ ] Avoir une connexion réseau normale (accès au marketplace de plugins GitHub requis)

## Concept de base

L'installation des plugins suit un processus en quatre étapes : **vérifier→ajouter marketplace→installer→vérifier** :

1. **Vérifier** : vérifier si les plugins sont déjà installés
2. **Ajouter marketplace** : ajouter le dépôt de plugins au marketplace Claude Code
3. **Installer** : exécuter la commande d'installation
4. **Vérifier** : confirmer que les plugins sont activés

Le script d'installation automatique de Factory (`cli/scripts/check-and-install-*.js`) exécute automatiquement ces étapes, mais vous devez connaître la méthode manuelle pour faire face aux échecs.

## Suivez-moi

### Étape 1 : Vérifier l'état des plugins

**Pourquoi**
Confirmez d'abord si les plugins sont déjà installés pour éviter les opérations répétées.

Ouvrez un terminal et exécutez dans le répertoire racine du projet :

```bash
claude plugin list
```

**Ce que vous devriez voir** : une liste des plugins installés, s'ils contiennent ce qui suit, les plugins sont installés :

```
✅ superpowers (enabled)
✅ ui-ux-pro-max (enabled)
```

Si vous ne voyez pas ces deux plugins, ou s'ils affichent `disabled`, continuez avec les étapes suivantes.

::: info Installation automatique de factory init
La commande `factory init` exécute automatiquement la vérification de l'installation des plugins (lignes 360-392 de `init.js`). Si elle réussit, vous verrez :

```
📦 Installing superpowers plugin... ✓
📦 Installing ui-ux-pro-max-skill plugin... ✓
✅ Plugins installed!
```
:::

### Étape 2 : Installer le plugin superpowers

**Pourquoi**
L'étape Bootstrap a besoin d'utiliser la compétence `superpowers:brainstorm` pour le brainstorming.

#### Ajouter au marketplace

```bash
claude plugin marketplace add obra/superpowers-marketplace
```

**Ce que vous devriez voir** :

```
✅ Plugin marketplace added successfully
```

::: tip Échec de l'ajout au marketplace
Si un message « le marketplace de plugins existe déjà » s'affiche, vous pouvez l'ignorer et continuer avec les étapes d'installation.
:::

#### Installer le plugin

```bash
claude plugin install superpowers@superpowers-marketplace
```

**Ce que vous devriez voir** :

```
✅ Plugin installed successfully
```

#### Vérifier l'installation

```bash
claude plugin list
```

**Ce que vous devriez voir** : la liste contient `superpowers (enabled)`.

### Étape 3 : Installer le plugin ui-ux-pro-max

**Pourquoi**
L'étape UI a besoin d'utiliser la compétence `ui-ux-pro-max` pour générer le système de conception.

#### Ajouter au marketplace

```bash
claude plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
```

**Ce que vous devriez voir** :

```
✅ Plugin marketplace added successfully
```

#### Installer le plugin

```bash
claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

**Ce que vous devriez voir** :

```
✅ Plugin installed successfully
```

#### Vérifier l'installation

```bash
claude plugin list
```

**Ce que vous devriez voir** : la liste contient `ui-ux-pro-max (enabled)`.

### Étape 4 : Vérifier que les deux plugins fonctionnent correctement

**Pourquoi**
Garantir que le pipeline peut appeler normalement les compétences de ces deux plugins.

#### Vérifier superpowers

Exécutez dans Claude Code :

```
Veuillez utiliser la compétence superpowers:brainstorm pour analyser l'idée de produit suivante : [votre idée]
```

**Ce que vous devriez voir** : Claude commence à utiliser la compétence brainstorm pour analyser systématiquement les problèmes, les utilisateurs, la valeur et les hypothèses.

#### Vérifier ui-ux-pro-max

Exécutez dans Claude Code :

```
Veuillez utiliser la compétence ui-ux-pro-max pour concevoir un schéma de couleurs pour mon application
```

**Ce que vous devriez voir** : Claude retourne une suggestion professionnelle de schéma de couleurs avec plusieurs options de conception.

## Point de contrôle ✅

Après avoir terminé les étapes ci-dessus, confirmez les points suivants :

- [ ] L'exécution de `claude plugin list` montre que les deux plugins sont marqués comme `enabled`
- [ ] Vous pouvez appeler la compétence `superpowers:brainstorm` dans Claude Code
- [ ] Vous pouvez appeler la compétence `ui-ux-pro-max` dans Claude Code
- [ ] L'exécution de `factory run` n'affiche plus de message de plugin manquant

## Conseils pour éviter les pièges

### ❌ Plugin installé mais non activé

**Symptôme** : `claude plugin list` affiche que le plugin existe mais n'a pas la marque `enabled`.

**Solution** : réexécutez la commande d'installation :

```bash
claude plugin install <ID du plugin>
```

### ❌ Permissions bloquées

**Symptôme** : message « Permission denied: Skill(superpowers:brainstorming) »

**Cause** : la configuration des permissions de Claude Code ne contient pas la permission `Skill`.

**Solution** : vérifiez que `.claude/settings.local.json` contient :

```json
{
  "permissions": [
    "Skill(superpowers:brainstorming)",
    "Skill(ui-ux-pro-max)"
  ]
}
```

::: info Configuration complète des permissions
Ceci est un exemple de configuration de permissions minimales. La commande `init` de Factory générera automatiquement un fichier de configuration de permissions complet (y compris `Skill(superpowers:brainstorm)` et d'autres permissions nécessaires), généralement pas besoin de l'éditer manuellement.

Si vous devez régénérer la configuration des permissions, vous pouvez exécuter dans le répertoire racine du projet :
```bash
factory init --force-permissions
```
:::

Référez-vous au [Guide d'intégration Claude Code](../claude-code/) pour régénérer la configuration des permissions.

### ❌ Échec de l'ajout au marketplace

**Symptôme** : `claude plugin marketplace add` échoue avec un message « not found » ou une erreur réseau.

**Solution** :

1. Vérifiez la connexion réseau
2. Confirmez que la version de Claude CLI est à jour : `npm update -g @anthropic-ai/claude-code`
3. Essayez d'installer directement : sautez l'ajout au marketplace, exécutez directement `claude plugin install <ID du plugin>`

### ❌ Conflit de version de plugin

**Symptôme** : un plugin du même nom est déjà installé, mais la version est incorrecte, entraînant l'échec du pipeline.

**Solution** :

```bash
# Désinstaller l'ancienne version
claude plugin uninstall <nom du plugin>

# Réinstaller
claude plugin install <ID du plugin>
```

### ❌ Problème de chemin Windows

**Symptôme** : message « commande introuvable » lors de l'exécution de scripts sous Windows.

**Solution** :

Utilisez Node.js pour exécuter directement les scripts d'installation :

```bash
node cli/scripts/check-and-install-superpowers.js
node cli/scripts/check-and-install-ui-skill.js
```

## Gestion de l'échec de l'installation automatique

Si l'installation automatique lors de `factory init` échoue, vous pouvez :

1. **Vérifier le message d'erreur** : le terminal affichera la cause spécifique de l'échec
2. **Installer manuellement** : installez manuellement les deux plugins en suivant les étapes ci-dessus
3. **Réexécuter** : `factory run` détectera l'état des plugins, s'ils sont installés, le pipeline continuera

::: warning N'affecte pas le démarrage du pipeline
Même si l'installation des plugins échoue, `factory init` terminera toujours l'initialisation. Vous pouvez installer manuellement les plugins ultérieurement, cela n'affecte pas les opérations suivantes.
:::

## Rôle des plugins dans le pipeline

### Étape Bootstrap (superpowers requis)

- **Appel de compétence** : `superpowers:brainstorm`
- **Sortie** : `input/idea.md` - document structuré de l'idée de produit
- **Point de vérification** : vérifier si l'Agent indique explicitement avoir utilisé cette compétence (`orchestrator.checkpoint.md:60-70`)

### Étape UI (ui-ux-pro-max requis)

- **Appel de compétence** : `ui-ux-pro-max`
- **Sortie** : `artifacts/ui/ui.schema.yaml` - UI Schema contenant le système de conception
- **Point de vérification** : vérifier si la configuration du système de conception provient de cette compétence (`orchestrator.checkpoint.md:72-84`)

## Résumé de ce cours

- Factory dépend de deux plugins requis : `superpowers` et `ui-ux-pro-max`
- `factory init` tente automatiquement de les installer, mais en cas d'échec, une gestion manuelle est nécessaire
- Processus d'installation de plugins : vérifier→ajouter marketplace→installer→vérifier
- Assurez-vous que les deux plugins sont dans l'état `enabled` et que la configuration des permissions est correcte
- Les étapes Bootstrap et UI du pipeline vérifieront obligatoirement l'utilisation de ces deux plugins

## Présentation du prochain cours

> Le prochain cours apprendra **[Vue d'ensemble du pipeline en 7 étapes](../../start/pipeline-overview/)**.
>
> Vous apprendrez :
> - Le processus d'exécution complet du pipeline
> - Les entrées, sorties et responsabilités de chaque étape
> - Comment le mécanisme de points de contrôle garantit la qualité
> - Comment récupérer à partir d'une étape en échec

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour afficher les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-29

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Script de vérification du plugin Superpowers | [`cli/scripts/check-and-install-superpowers.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/scripts/check-and-install-superpowers.js) | 1-208 |
| Script de vérification du plugin UI/UX Pro Max | [`cli/scripts/check-and-install-ui-skill.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/scripts/check-and-install-ui-skill.js) | 1-209 |
| Logique d'installation automatique de plugins | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 360-392 |
| Vérification de compétence de l'étape Bootstrap | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 60-70 |
| Vérification de compétence de l'étape UI | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 72-84 |

**Constantes clés** :
- `PLUGIN_NAME = 'superpowers'` : nom du plugin superpowers
- `PLUGIN_ID = 'superpowers@superpowers-marketplace'` : ID complet de superpowers
- `PLUGIN_MARKETPLACE = 'obra/superpowers-marketplace'` : dépôt du marketplace de plugins
- `UI_PLUGIN_NAME = 'ui-ux-pro-max'` : nom du plugin UI
- `UI_PLUGIN_ID = 'ui-ux-pro-max@ui-ux-pro-max-skill'` : ID complet du plugin UI
- `UI_PLUGIN_MARKETPLACE = 'nextlevelbuilder/ui-ux-pro-max-skill'` : dépôt du marketplace du plugin UI

**Fonctions clés** :
- `isPluginInstalled()` : vérifie si le plugin est installé (via la sortie de `claude plugin list`)
- `addToMarketplace()` : ajoute le plugin au marketplace (`claude plugin marketplace add`)
- `installPlugin()` : installe le plugin (`claude plugin install`)
- `verifyPlugin()` : vérifie que le plugin est installé et activé
- `main()` : fonction principale, exécute le processus complet vérifier→ajouter→installer→vérifier

</details>

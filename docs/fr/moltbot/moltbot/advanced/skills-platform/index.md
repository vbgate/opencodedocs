---
title: "Plateforme de Compétences et ClawdHub : Étendre l'Assistant IA | Tutoriel Clawdbot | Clawdbot"
sidebarTitle: "Étendre les Capacités IA"
subtitle: "Plateforme de Compétences et ClawdHub : Étendre l'Assistant IA | Tutoriel Clawdbot | Clawdbot"
description: "Apprenez l'architecture du système de compétences de Clawdbot, maîtrisez les trois priorités de chargement des compétences Bundled, Managed et Workspace. Utilisez ClawdHub pour installer et mettre à jour des compétences, configurez les règles de filtrage et le mécanisme d'injection de variables d'environnement."
tags:
  - "système de compétences"
  - "ClawdHub"
  - "extension IA"
  - "configuration de compétences"
prerequisite:
  - "start-getting-start"
order: 280
---

# Plateforme de Compétences et ClawdHub pour Étendre l'Assistant IA | Tutoriel Clawdbot

## Ce que vous pourrez faire après ce cours

Après avoir terminé ce cours, vous pourrez :

- Comprendre l'architecture du système de compétences de Clawdbot (trois types de compétences : Bundled, Managed, Workspace)
- Découvrir, installer et mettre à jour des compétences depuis ClawdHub pour étendre les capacités de votre assistant IA
- Configurer l'état d'activation, les variables d'environnement et les clés API des compétences
- Utiliser les règles de filtrage (Gating) pour garantir que les compétences ne se chargent que lorsque les conditions sont remplies
- Gérer le partage et la priorité de remplacement des compétences dans les scénarios multi-agent

## Votre problème actuel

Clawdbot fournit déjà une riche collection d'outils intégrés (navigateur, exécution de commandes, recherche web, etc.), mais lorsque vous avez besoin de :

- Appeler des outils CLI tiers (comme `gemini`, `peekaboo`)
- Ajouter des scripts d'automatisation spécifiques à un domaine
- Faire apprendre à l'IA à utiliser votre ensemble d'outils personnalisé

Vous pourriez penser : « Comment dire à l'IA quels outils sont disponibles ? Où dois-je placer ces outils ? Plusieurs agents peuvent-ils partager des compétences ? »

Le système de compétences de Clawdbot est conçu pour cela : **déclarez les compétences via le fichier SKILL.md, et l'agent les charge et utilise automatiquement**.

## Quand utiliser cette approche

- **Lorsque vous avez besoin d'étendre les capacités de l'IA** : vous souhaitez ajouter de nouveaux outils ou processus d'automatisation
- **En collaboration multi-agent** : différents agents ont besoin de partager ou d'avoir un accès exclusif aux compétences
- **Dans la gestion des versions de compétences** : installer, mettre à jour et synchroniser les compétences depuis ClawdHub
- **Dans le filtrage de compétences** : garantir que les compétences ne se chargent que dans des environnements spécifiques (OS, binaires, configuration)

## 🎒 Préparatifs avant de commencer

Avant de commencer, veuillez confirmer :

- [ ] Vous avez terminé [Démarrage Rapide](../../start/getting-start/) et le Gateway fonctionne normalement
- [ ] Vous avez configuré au moins un modèle d'IA (Anthropic, OpenAI, Ollama, etc.)
- [ ] Vous comprenez les opérations de base en ligne de commande (`mkdir`, `cp`, `rm`)

## Concepts fondamentaux

### Qu'est-ce qu'une compétence ?

Une compétence est un répertoire contenant un fichier `SKILL.md` (instructions pour le LLM et définitions d'outils), ainsi que des scripts ou ressources optionnels. Le fichier `SKILL.md` utilise le frontmatter YAML pour définir les métadonnées et Markdown pour décrire l'utilisation de la compétence.

Clawdbot est compatible avec la spécification [AgentSkills](https://agentskills.io), de sorte que les compétences peuvent être chargées par d'autres outils qui suivent cette spécification.

#### Les trois emplacements de chargement des compétences

Les compétences sont chargées depuis trois endroits, par ordre de priorité du plus élevé au plus bas :

1. **Compétences Workspace** : `<workspace>/skills` (priorité la plus élevée)
2. **Compétences Managed/locales** : `~/.clawdbot/skills`
3. **Compétences Bundled** : fournies avec le paquet d'installation (priorité la plus basse)

::: info Règle de priorité
Si une compétence du même nom existe à plusieurs endroits, les compétences Workspace remplacent les compétences Managed et Bundled.
:::

De plus, vous pouvez configurer des répertoires de compétences supplémentaires via `skills.load.extraDirs` (priorité la plus basse).

#### Partage de compétences dans les scénarios multi-agent

Dans une configuration multi-agent, chaque agent a son propre workspace :

- **Compétences Per-agent** : situées dans `<workspace>/skills`, visibles uniquement pour cet agent
- **Compétences partagées** : situées dans `~/.clawdbot/skills`, visibles pour tous les agents sur la même machine
- **Dossier partagé** : peut être ajouté via `skills.load.extraDirs` (priorité la plus basse), utilisé pour que plusieurs agents partagent le même paquet de compétences

En cas de conflit de noms, la règle de priorité s'applique également : Workspace > Managed > Bundled.

#### Filtrage des compétences (Gating)

Clawdbot filtre les compétences selon le champ `metadata` lors du chargement, garantissant que les compétences ne se chargent que lorsque les conditions sont remplies :

```markdown
---
name: nano-banana-pro
description: Generate or edit images via Gemini 3 Pro Image
metadata: {"clawdbot":{"requires":{"bins":["uv"],"env":["GEMINI_API_KEY"],"config":["browser.enabled"]},"primaryEnv":"GEMINI_API_KEY"}}
---
```

Champs sous `metadata.clawdbot` :

- `always: true` : toujours charger la compétence (ignorer les autres filtrages)
- `emoji` : emoji affiché dans l'interface utilisateur des compétences macOS
- `homepage` : lien vers le site web affiché dans l'interface utilisateur des compétences macOS
- `os` : liste de plateformes (`darwin`, `linux`, `win32`), la compétence n'est disponible que sur ces systèmes d'exploitation
- `requires.bins` : liste, chacun doit exister dans `PATH`
- `requires.anyBins` : liste, au moins un doit exister dans `PATH`
- `requires.env` : liste, les variables d'environnement doivent exister ou être fournies dans la configuration
- `requires.config` : liste de chemins `clawdbot.json`, doivent être vrais
- `primaryEnv` : nom de la variable d'environnement associée à `skills.entries.<name>.apiKey`
- `install` : tableau de spécifications d'installateur optionnelles (pour l'interface utilisateur des compétences macOS)

::: warning Vérification des binaires dans l'environnement sandbox
`requires.bins` est vérifié sur l'**hôte** lors du chargement de la compétence. Si l'agent s'exécute dans un sandbox, le binaire doit également exister dans le conteneur.
Les dépendances peuvent être installées via `agents.defaults.sandbox.docker.setupCommand`.
:::

### Injection de variables d'environnement

Lorsque l'exécution de l'agent commence, Clawdbot :

1. Lit les métadonnées de la compétence
2. Applique tous les `skills.entries.<key>.env` ou `skills.entries.<key>.apiKey` à `process.env`
3. Construit le prompt système en utilisant les compétences qui remplissent les conditions
4. Restaure l'environnement d'origine après la fin de l'exécution de l'agent

Ceci est **limité à la portée de l'exécution de l'agent**, pas l'environnement global du Shell.

## Suivez ces étapes

### Étape 1 : Voir les compétences installées

Utilisez la CLI pour lister les compétences actuellement disponibles :

```bash
clawdbot skills list
```

Ou ne voir que les compétences qui remplissent les conditions :

```bash
clawdbot skills list --eligible
```

**Vous devriez voir** : liste des compétences, incluant le nom, la description, si les conditions sont remplies (comme les binaires, les variables d'environnement)

### Étape 2 : Installer des compétences depuis ClawdHub

ClawdHub est le registre public des compétences de Clawdbot, où vous pouvez parcourir, installer, mettre à jour et publier des compétences.

#### Installer la CLI

Choisissez une méthode pour installer la CLI ClawdHub :

```bash
npm i -g clawdhub
```

ou

```bash
pnpm add -g clawdhub
```

#### Rechercher des compétences

```bash
clawdhub search "postgres backups"
```

#### Installer une compétence

```bash
clawdhub install <skill-slug>
```

Par défaut, la CLI installe dans le sous-répertoire `./skills` du répertoire de travail actuel (ou retombe au workspace Clawdbot configuré). Clawdbot la chargera comme `<workspace>/skills` lors de la prochaine session.

**Vous devriez voir** : sortie d'installation, affichant le dossier de compétence et les informations de version.

### Étape 3 : Mettre à jour les compétences installées

Mettre à jour toutes les compétences installées :

```bash
clawdhub update --all
```

Ou mettre à jour une compétence spécifique :

```bash
clawdhub update <slug>
```

**Vous devriez voir** : statut de mise à jour de chaque compétence, incluant les changements de version.

### Étape 4 : Configurer le remplacement des compétences

Dans `~/.clawdbot/clawdbot.json`, configurez l'état d'activation, les variables d'environnement, etc., des compétences :

```json5
{
  "skills": {
    "entries": {
      "nano-banana-pro": {
        "enabled": true,
        "apiKey": "GEMINI_KEY_HERE",
        "env": {
          "GEMINI_API_KEY": "GEMINI_KEY_HERE"
        },
        "config": {
          "endpoint": "https://example.invalid",
          "model": "nano-pro"
        }
      },
      "peekaboo": { "enabled": true },
      "sag": { "enabled": false }
    }
  }
}
```

**Règles** :

- `enabled: false` : désactive la compétence, même si elle est Bundled ou installée
- `env` : injecte des variables d'environnement (seulement lorsque la variable n'est pas définie dans le processus)
- `apiKey` : champ pratique pour les compétences qui déclarent `metadata.clawdbot.primaryEnv`
- `config` : paquet de champs personnalisés optionnels, les clés personnalisées doivent être placées ici

**Vous devriez voir** : après avoir sauvegardé la configuration, Clawdbot appliquera ces paramètres lors de la prochaine exécution de l'agent.

### Étape 5 : Activer le moniteur de compétences (optionnel)

Par défaut, Clawdbot surveille le dossier des compétences et actualise l'instantané des compétences lorsque le fichier `SKILL.md` change. Vous pouvez configurer ceci dans `skills.load` :

```json5
{
  "skills": {
    "load": {
      "watch": true,
      "watchDebounceMs": 250
    }
  }
}
```

**Vous devriez voir** : après avoir modifié le fichier de compétence, sans avoir besoin de redémarrer le Gateway, Clawdbot actualisera automatiquement la liste des compétences lors du prochain tour de l'agent.

### Étape 6 : Déboguer les problèmes de compétences

Voir les informations détaillées de la compétence et les dépendances manquantes :

```bash
clawdbot skills info <name>
```

Vérifier le statut des dépendances de toutes les compétences :

```bash
clawdbot skills check
```

**Vous devriez voir** : informations détaillées de la compétence, incluant les binaires, les variables d'environnement, le statut de configuration, et les conditions manquantes.

## Point de contrôle ✅

Après avoir terminé les étapes ci-dessus, vous devriez être capable de :

- [ ] Utiliser `clawdbot skills list` pour voir toutes les compétences disponibles
- [ ] Installer de nouvelles compétences depuis ClawdHub
- [ ] Mettre à jour les compétences installées
- [ ] Configurer le remplacement des compétences dans `clawdbot.json`
- [ ] Utiliser `skills check` pour déboguer les problèmes de dépendances de compétences

## Avertissements courants

### Erreur courante 1 : nom de compétence contenant des tirets

**Problème** : utiliser le nom de compétence avec tirets comme clé dans `skills.entries`

```json
// ❌ Erreur : sans guillemets
{
  "skills": {
    "entries": {
      nano-banana-pro: { "enabled": true }  // Erreur de syntaxe JSON
    }
  }
}
```

**Correction** : envelopper la clé avec des guillemets (JSON5 supporte les clés avec guillemets)

```json
// ✅ Correct : avec guillemets
{
  "skills": {
    "entries": {
      "nano-banana-pro": { "enabled": true }
    }
  }
}
```

### Erreur courante 2 : variables d'environnement dans l'environnement sandbox

**Problème** : la compétence s'exécute dans un sandbox, mais `skills.entries.<skill>.env` ou `apiKey` n'ont pas d'effet

**Cause** : le `env` global et `skills.entries.<skill>.env/apiKey` ne s'appliquent qu'à l'**exécution sur l'hôte**, le sandbox n'hérite pas du `process.env` de l'hôte.

**Correction** : utiliser l'une des méthodes suivantes :

```json5
{
  "agents": {
    "defaults": {
      "sandbox": {
        "docker": {
          "env": {
            "GEMINI_API_KEY": "your_key_here"
          }
        }
      }
    }
  }
}
```

Ou baked les variables d'environnement dans l'image sandbox personnalisée.

### Erreur courante 3 : la compétence n'apparaît pas dans la liste

**Problème** : compétence installée, mais `clawdbot skills list` ne l'affiche pas

**Causes possibles** :

1. La compétence ne remplit pas les conditions de filtrage (binaires manquants, variables d'environnement, configuration)
2. La compétence est désactivée (`enabled: false`)
3. La compétence n'est pas dans les répertoires scannés par Clawdbot

**Étapes de dépannage** :

```bash
# Vérifier les dépendances de compétence
clawdbot skills check

# Vérifier si le répertoire de compétences est scanné
ls -la ~/.clawdbot/skills/
ls -la <workspace>/skills/
```

### Erreur courante 4 : conflits de compétences et confusion de priorité

**Problème** : existe une compétence du même nom à plusieurs endroits, laquelle est chargée ?

**Rappelez-vous la priorité** :

`<workspace>/skills` (le plus élevé) → `~/.clawdbot/skills` → bundled skills (le plus bas)

Si vous voulez utiliser des compétences Bundled au lieu du remplacement de Workspace :

1. Supprimer ou renommer `<workspace>/skills/<skill-name>`
2. Ou désactiver cette compétence dans `skills.entries`

## Résumé du cours

Dans ce cours, vous avez appris les concepts fondamentaux de la plateforme de compétences de Clawdbot :

- **Trois types de compétences** : Bundled, Managed, Workspace, chargées par priorité
- **Intégration ClawdHub** : registre public pour parcourir, installer, mettre à jour et publier des compétences
- **Filtrage des compétences** : filtrer les compétences par le champ `requires` des métadonnées
- **Configuration de remplacement** : contrôler l'activation, les variables d'environnement et la configuration personnalisée dans `clawdbot.json`
- **Moniteur de compétences** : actualise automatiquement la liste des compétences sans avoir besoin de redémarrer le Gateway

Le système de compétences est le mécanisme central pour étendre les capacités de Clawdbot. Le maîtriser permet à votre assistant IA de s'adapter à plus de scénarios et d'outils.

## Prochain cours

> Dans le prochain cours, nous apprendrons **[Sécurité et Isolation Sandbox](../security-sandbox/)**.
>
> Vous apprendrez :
> - Modèle de sécurité et contrôle des autorisations
> - Allowlist/denylist des autorisations d'outils
> - Mécanisme d'isolation sandbox Docker
> - Configuration de sécurité du Gateway distant

---

#### Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer et voir les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-27

| Fonctionnalité | Chemin du fichier | Numéro de ligne |
|--- | --- | ---|
| Définition du type de configuration des compétences | [`src/config/types.skills.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/types.skills.ts) | 1-32 |
| Documentation du système de compétences | [`docs/tools/skills.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/tools/skills.md) | 1-260 |
| Référence de configuration des compétences | [`docs/tools/skills-config.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/tools/skills-config.md) | 1-76 |
| Documentation ClawdHub | [`docs/tools/clawdhub.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/tools/clawdhub.md) | 1-202 |
| Guide de création de compétences | [`docs/tools/creating-skills.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/tools/creating-skills.md) | 1-42 |
| Commandes CLI | [`docs/cli/skills.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/cli/skills.md) | 1-26 |

**Types clés** :

- `SkillConfig` : configuration de compétence individuelle (enabled, apiKey, env, config)
- `SkillsLoadConfig` : configuration de chargement des compétences (extraDirs, watch, watchDebounceMs)
- `SkillsInstallConfig` : configuration d'installation des compétences (preferBrew, nodeManager)
- `SkillsConfig` : configuration de compétences de niveau supérieur (allowBundled, load, install, entries)

**Exemples de compétences intégrées** :

- `skills/gemini/SKILL.md` : compétence CLI Gemini
- `skills/peekaboo/SKILL.md` : compétence d'automatisation UI macOS Peekaboo

</details>

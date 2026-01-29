---
title: "Initialisation du projet | opencode-supermemory"
sidebarTitle: "Initialisation"
subtitle: "Initialisation du projet : Créer une première impression"
description: "Apprenez à utiliser /supermemory-init pour analyser le dépôt, extraire l'architecture et stocker les conventions dans une mémoire persistante."
tags:
  - "Initialisation"
  - "Génération de mémoire"
  - "Flux de travail"
prerequisite:
  - "start-getting-started"
order: 2
---

# Initialisation du projet : Créer une première impression

## Ce que vous pourrez faire après ce cours

- **Familiarisation instantanée du projet** : Laissez l'Agent explorer et comprendre l'ensemble du dépôt de code comme un nouvel employé.
- **Création de mémoire à long terme** : Extraitz automatiquement la pile technologique, les modèles d'architecture et les conventions de codage du projet, et stockez-les dans Supermemory.
- **Élimination des explications répétitives** : N'ayez plus besoin de répéter "nous utilisons Bun" ou "tous les composants doivent avoir des tests" au début de chaque session.

## Votre situation actuelle

Avez-vous rencontré ces situations :

- **Travail répétitif** : À chaque nouvelle session, vous devez passer beaucoup de temps à expliquer à l'Agent les bases du projet.
- **Oubli de contexte** : L'Agent oublie souvent la structure des répertoires spécifique au projet et crée des fichiers au mauvais endroit.
- **Incohérence des conventions** : Le code écrit par l'Agent a un style incohérent, utilisant parfois `interface` et parfois `type`.

## Quand utiliser cette approche

- **Juste après l'installation du plugin** : C'est la première étape de l'utilisation d'opencode-supermemory.
- **Lorsque vous reprenez un nouveau projet** : Créez rapidement une base de mémoire pour ce projet.
- **Après une refonte majeure** : Lorsque l'architecture du projet change et que vous devez mettre à jour la compréhension de l'Agent.

## 🎒 Préparation avant de commencer

::: warning Vérification préalable
Assurez-vous d'avoir terminé les étapes d'installation et de configuration dans [Démarrage rapide](./../getting-started/index.md) et que `SUPERMEMORY_API_KEY` est correctement configuré.
:::

## Idée principale

La commande `/supermemory-init` n'est pas essentiellement un programme binaire, mais un **prompt soigneusement conçu** (invite).

Lorsque vous exécutez cette commande, elle envoie à l'Agent un "guide d'intégration" détaillé, indiquant à l'Agent :

1. **Recherche approfondie** : Lire activement `README.md`, `package.json`, l'historique des commits Git, etc.
2. **Analyse structurée** : Identifier la pile technologique, les modèles d'architecture et les conventions implicites du projet.
3. **Stockage persistant** : Utiliser l'outil `supermemory` pour stocker ces aperçus dans la base de données cloud.

::: info Portée de la mémoire
Le processus d'initialisation distingue deux types de mémoire :
- **Project Scope** : S'applique uniquement au projet actuel (comme : commandes de build, structure des répertoires).
- **User Scope** : S'applique à tous vos projets (comme : votre style de codage préféré).
:::

## Suivez-moi

### Étape 1 : Exécuter la commande d'initialisation

Dans la zone de saisie OpenCode, entrez la commande suivante et envoyez :

```bash
/supermemory-init
```

**Pourquoi**
Cela charge le prompt prédéfini et lance le mode d'exploration de l'Agent.

**Ce que vous devriez voir**
L'Agent commence à répondre, indiquant qu'il comprend la tâche et commence à planifier les étapes de recherche. Il pourrait dire : "I will start by exploring the codebase structure and configuration files..."

### Étape 2 : Observer le processus d'exploration de l'Agent

L'Agent exécutera automatiquement une série d'opérations, vous n'avez qu'à regarder. Il fera généralement :

1. **Lire les fichiers de configuration** : Lire `package.json`, `tsconfig.json`, etc. pour comprendre la pile technologique.
2. **Voir l'historique Git** : Exécuter `git log` pour comprendre les conventions de commit et les contributeurs actifs.
3. **Explorer la structure des répertoires** : Utiliser `ls` ou `list_files` pour voir la disposition du projet.

**Exemple de sortie** :
```
[Agent] Reading package.json to identify dependencies...
[Agent] Running git log to understand commit conventions...
```

::: tip Attention à la consommation
Ce processus est une recherche approfondie et peut consommer beaucoup de tokens (généralement 50+ appels d'outils). Soyez patient jusqu'à ce que l'Agent signale la fin.
:::

### Étape 3 : Vérifier les mémoires générées

Lorsque l'Agent indique que l'initialisation est terminée, vous pouvez vérifier ce qu'il a mémorisé. Entrez :

```bash
/ask Lister les mémoires du projet actuel
```

Ou appelez directement l'outil (si vous voulez voir les données brutes) :

```
supermemory(mode: "list", scope: "project")
```

**Ce que vous devriez voir**
L'Agent liste une série de mémoires structurées, par exemple :

| Type | Exemple de contenu |
|--- | ---|
| `project-config` | "Uses Bun runtime. Build command: bun run build" |
| `architecture` | "API routes are located in src/routes/, using Hono framework" |
| `preference` | "Strict TypeScript usage: no 'any' type allowed" |

### Étape 4 : Compléter les omissions (optionnel)

Si l'Agent a manqué certaines informations clés (comme une règle spécifique qui n'a été convenue qu'oralement), vous pouvez la compléter manuellement :

```
S'il te plaît, souviens-toi : dans ce projet, tout le traitement des dates doit utiliser la bibliothèque dayjs, l'utilisation de Date natif est interdite.
```

**Ce que vous devriez voir**
L'Agent confirme et appelle `supermemory(mode: "add")` pour sauvegarder cette nouvelle règle.

## Point de contrôle ✅

- [ ] Après avoir exécuté `/supermemory-init`, l'Agent a-t-il automatiquement exécuté la tâche d'exploration ?
- [ ] Pouvez-vous voir les nouvelles mémoires créées avec la commande `list` ?
- [ ] Le contenu de la mémoire reflète-t-il fidèlement la situation réelle du projet actuel ?

## Pièges courants

::: warning Ne lancez pas fréquemment
L'initialisation est un processus chronophage et consommateur de tokens. Habituellement, chaque projet ne doit être exécuté qu'une seule fois. Ne le relancez que lorsque le projet subit des changements majeurs.
:::

::: danger Attention à la confidentialité
Bien que le plugin masque automatiquement le contenu des balises `<private>`, lors du processus d'initialisation, l'Agent lira de nombreux fichiers. Assurez-vous qu'il n'y a pas de clés sensibles codées en dur dans votre dépôt de code (comme AWS Secret Key), sinon elles pourraient être stockées dans la mémoire en tant que "configuration du projet".
:::

## Résumé du cours

Grâce à `/supermemory-init`, nous avons accompli la transition de "étranger" à "employé expérimenté". Maintenant, l'Agent a mémorisé l'architecture principale et les conventions du projet, et dans les tâches de codage à venir, il utilisera automatiquement ces informations pour vous fournir une assistance plus précise.

## Aperçu du prochain cours

> Le prochain cours est **[Mécanisme d'injection automatique de contexte](./../../core/context-injection/index.md)**.
>
> Vous apprendrez :
> - Comment l'Agent "rappelle" ces mémoires au début d'une session.
> - Comment déclencher le rappel de mémoires spécifiques par des mots-clés.

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Lignes |
|--- | --- | ---|
| Définition du prompt d'initialisation | [`src/cli.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/cli.ts#L13-L163) | 13-163 |
| Implémentation de l'outil de mémoire | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L183-L485) | 183-485 |

**Constantes clés** :
- `SUPERMEMORY_INIT_COMMAND` : Définit le contenu spécifique du prompt pour la commande `/supermemory-init`, guidant l'Agent sur comment effectuer la recherche et la mémorisation.

</details>

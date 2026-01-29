---
title: "Outils: Modes de supermemory | opencode-supermemory"
sidebarTitle: "Outils"
subtitle: "Ensemble d'outils détaillé : Enseigner à l'Agent à mémoriser"
description: "Maîtrisez les 5 modes de supermemory (add, search, profile, list, forget) pour contrôler la mémoire de l'Agent."
tags:
  - "Utilisation des outils"
  - "Gestion de la mémoire"
  - "Fonctionnalités principales"
prerequisite:
  - "start-getting-started"
order: 2
---

# Ensemble d'outils détaillé : Enseigner à l'Agent à mémoriser

## Ce que vous pourrez faire après ce cours

Dans ce cours, vous maîtriserez la méthode d'interaction principale du plugin `supermemory`. Bien que l'Agent gère généralement les mémoires automatiquement, en tant que développeur, vous avez souvent besoin d'intervenir manuellement.

Après avoir terminé ce cours, vous serez capable de :
1. Utiliser le mode `add` pour sauvegarder manuellement des décisions techniques clés.
2. Utiliser le mode `search` pour vérifier que l'Agent se souvient de vos préférences.
3. Utiliser `profile` pour voir "vous" du point de vue de l'Agent.
4. Utiliser `list` et `forget` pour nettoyer les mémoires obsolètes ou incorrectes.

## Idée principale

opencode-supermemory n'est pas une boîte noire, il interagit avec l'Agent via le protocole standard OpenCode Tool. Cela signifie que vous pouvez l'appeler comme une fonction, ou commander à l'Agent de l'utiliser par langage naturel.

Le plugin enregistre un outil nommé `supermemory` auprès de l'Agent. Il est comme un couteau suisse, avec 6 modes :

| Mode | Fonction | Scénario typique |
| :--- | :--- | :--- |
| **add** | Ajouter une mémoire | "Souviens-toi, ce projet doit fonctionner avec Bun" |
| **search** | Rechercher une mémoire | "Est-ce que j'ai déjà dit comment gérer l'authentification ?" |
| **profile** | Profil utilisateur | Voir les habitudes de codage résumées par l'Agent |
| **list** | Lister les mémoires | Auditer les 10 dernières mémoires sauvegardées |
| **forget** | Supprimer une mémoire | Supprimer un enregistrement de configuration incorrect |
| **help** | Guide d'utilisation | Voir la documentation d'aide de l'outil |

::: info Mécanisme de déclenchement automatique
En plus de l'appel manuel, le plugin surveille le contenu de votre chat. Lorsque vous dites "Remember this" ou "Save this" en langage naturel, le plugin détecte automatiquement les mots-clés et force l'Agent à appeler l'outil `add`.
:::

## Suivez-moi : Gérer manuellement les mémoires

Bien que nous laissons généralement l'Agent opérer automatiquement, lors du débogage ou de la création de mémoires initiales, l'appel manuel d'outils est très utile. Vous pouvez commander à l'Agent d'exécuter ces opérations directement en langage naturel dans la boîte de dialogue OpenCode.

### 1. Ajouter une mémoire (Add)

C'est la fonctionnalité la plus couramment utilisée. Vous pouvez spécifier le contenu, le type et la portée de la mémoire.

**Action** : Dites à l'Agent de sauvegarder une mémoire sur l'architecture du projet.

**Commande de saisie** :
```text
Utilise l'outil supermemory pour sauvegarder une mémoire :
Contenu : "Tous le code de la couche service de ce projet doit être placé dans le répertoire src/services"
Type : architecture
Portée : project
```

**Comportement interne de l'Agent** (logique du code source) :
```json
{
  "tool": "supermemory",
  "args": {
    "mode": "add",
    "content": "Tous le code de la couche service de ce projet doit être placé dans le répertoire src/services",
    "type": "architecture",
    "scope": "project"
  }
}
```

**Ce que vous devriez voir** :
L'Agent renvoie un message de confirmation similaire à :
> ✅ Memory added to project scope (ID: mem_12345...)

::: tip Choix du type de mémoire (Type)
Pour une recherche plus précise, il est recommandé d'utiliser des types précis :
- `project-config` : Pile technologique, configuration de chaîne d'outils
- `architecture` : Modèles d'architecture, structure des répertoires
- `preference` : Vos préférences de codage personnelles (comme "préfère les fonctions fléchées")
- `error-solution` : Solution spécifique à une erreur
- `learned-pattern` : Motifs de code observés par l'Agent
:::

### 2. Rechercher une mémoire (Search)

Lorsque vous voulez confirmer que l'Agent "sait" quelque chose, vous pouvez utiliser la fonction de recherche.

**Action** : Recherchez les mémoires sur "service layer".

**Commande de saisie** :
```text
Interroge supermemory, mot-clé "services", portée project
```

**Comportement interne de l'Agent** :
```json
{
  "tool": "supermemory",
  "args": {
    "mode": "search",
    "query": "services",
    "scope": "project"
  }
}
```

**Ce que vous devriez voir** :
L'Agent liste les fragments de mémoire pertinents et leur similarité (Similarity).

### 3. Voir le profil utilisateur (Profile)

Supermemory maintient automatiquement un "profil utilisateur" contenant vos préférences à long terme.

**Action** : Voyez votre profil.

**Commande de saisie** :
```text
Appelle le mode profile de l'outil supermemory pour voir ce que tu sais sur moi
```

**Ce que vous devriez voir** :
Renvoie deux types d'informations :
- **Static** : Faits statiques (comme "l'utilisateur est un ingénieur full-stack")
- **Dynamic** : Préférences dynamiques (comme "l'utilisateur s'intéresse récemment à Rust")

### 4. Audit et oubli (List & Forget)

Si l'Agent se souvient d'informations incorrectes (comme une clé API obsolète), vous devez la supprimer.

**Première étape : Lister les mémoires récentes**
```text
Liste les 5 dernières mémoires du projet
```
*(l'Agent appelle `mode: "list", limit: 5`)*

**Deuxième étape : Obtenir l'ID et supprimer**
Supposons que vous voyiez une mémoire incorrecte avec l'ID `mem_abc123`.

```text
Supprime la mémoire avec l'ID mem_abc123
```
*(l'Agent appelle `mode: "forget", memoryId: "mem_abc123"`)*

**Ce que vous devriez voir** :
> ✅ Memory mem_abc123 removed from project scope

## Avancé : Déclenchement en langage naturel

Vous n'avez pas besoin de décrire en détail les paramètres de l'outil à chaque fois. Le plugin intègre un mécanisme de détection de mots-clés.

**Essayez** :
Dans la conversation, dites simplement :
> **Remember this** : tout le traitement des dates doit utiliser la bibliothèque date-fns, l'utilisation de moment.js est interdite.

**Qu'est-ce qui se passe ?**
1. Le hook `chat.message` du plugin détecte le mot-clé "Remember this".
2. Le plugin injecte une invite système à l'Agent : `[MEMORY TRIGGER DETECTED]`.
3. L'Agent reçoit la commande : "You MUST use the supermemory tool with mode: 'add'...".
4. L'Agent extrait automatiquement le contenu et appelle l'outil.

C'est un mode d'interaction très naturel qui vous permet de "solidifier" les connaissances à tout moment pendant le codage.

## Questions fréquentes (FAQ)

**Q : Quelle est la valeur par défaut de `scope` ?**
R : La valeur par défaut est `project`. Si vous voulez sauvegarder des préférences communes à tous les projets (comme "j'utilise toujours TypeScript"), spécifiez explicitement `scope: "user"`.

**Q : Pourquoi ma mémoire ajoutée n'a-t-elle pas pris effet immédiatement ?**
R : L'opération `add` est asynchrone. Habituellement, l'Agent "saura" cette nouvelle mémoire immédiatement après l'appel réussi de l'outil, mais dans certains cas de délai réseau extrême, cela peut prendre quelques secondes.

**Q : Les informations sensibles seront-elles téléchargées ?**
R : Le plugin masque automatiquement le contenu des balises `<private>`. Mais par sécurité, il est recommandé de ne pas mettre de mots de passe ou de clés API dans les mémoires.

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Lignes |
| :--- | :--- | :--- |
| Définition de l'outil | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L183-L485) | 183-485 |
| Détection de mots-clés | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L34-L37) | 34-37 |
| Prompt de déclenchement | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L20-L28) | 20-28 |
| Implémentation du client | [`src/services/client.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/client.ts) | Texte complet |

**Définitions de types clés** :
- `MemoryType` : Défini dans [`src/types/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/types/index.ts)
- `MemoryScope` : Défini dans [`src/types/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/types/index.ts)

</details>

## Aperçu du prochain cours

> Le prochain cours est **[Portée et cycle de vie de la mémoire](../memory-management/index.md)**.
>
> Vous apprendrez :
> - Le mécanisme d'isolation sous-jacent entre User Scope et Project Scope
> - Comment concevoir une stratégie de partitionnement de mémoire efficace
> - La gestion du cycle de vie de la mémoire

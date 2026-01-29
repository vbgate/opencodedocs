---
title: "Injection de contexte : Mémoire automatique | opencode-supermemory"
sidebarTitle: "Injection de contexte"
subtitle: "Mécanisme d'injection automatique de contexte : Laissez l'Agent 'prévoir l'avenir'"
description: "Apprenez le mécanisme d'injection automatique de contexte d'opencode-supermemory. Découvrez comment l'Agent obtient le profil utilisateur et les connaissances du projet au début d'une session."
tags:
  - "contexte"
  - "injection"
  - "prompt"
  - "mémoire"
prerequisite:
  - "start-getting-started"
order: 1
---

# Mécanisme d'injection automatique de contexte : Laissez l'Agent "prévoir l'avenir"

## Ce que vous pourrez faire après ce cours

Après avoir terminé ce cours, vous serez capable de :
1. **Comprendre** pourquoi l'Agent connaît vos habitudes de codage et l'architecture du projet dès le début.
2. **Maîtriser** le "modèle tridimensionnel" de l'injection de contexte (profil utilisateur, connaissances du projet, mémoires pertinentes).
3. **Apprendre** à utiliser des mots-clés (comme "Remember this") pour intervenir activement dans le comportement de mémorisation de l'Agent.
4. **Configurer** le nombre d'éléments injectés pour équilibrer la longueur du contexte et la richesse des informations.

---

## Idée principale

Avant le plugin de mémoire, à chaque nouvelle session, l'Agent était une page blanche. Vous deviez répéter : "J'utilise TypeScript", "ce projet utilise Next.js".

**L'injection de contexte (Context Injection)** résout ce problème. Elle consiste à insérer un "briefing de mission" dans le cerveau de l'Agent dès qu'il s'éveille.

### Moment de déclenchement

opencode-supermemory est très discret, ne déclenchant l'injection automatique qu'avec le **premier message de la session**.

- **Pourquoi le premier message ?** Parce que c'est le moment clé pour établir le ton de la session.
- **Et les messages suivants ?** Les messages suivants ne déclenchent plus l'injection automatique pour éviter d'interférer avec le flux de conversation, sauf si vous le déclenchez activement (voir "Déclenchement par mots-clés" ci-dessous).

### Modèle d'injection tridimensionnel

Le plugin obtient en parallèle trois types de données, les combinant en un bloc de prompt `[SUPERMEMORY]` :

| Dimension | Source | Fonction | Exemple |
| :--- | :--- | :--- | :--- |
| **1. Profil utilisateur** (Profile) | `getProfile` | Vos préférences à long terme | "L'utilisateur préfère la programmation fonctionnelle", "préfère les fonctions fléchées" |
| **2. Connaissances du projet** (Project) | `listMemories` | Connaissances globales du projet actuel | "Ce projet utilise Clean Architecture", "l'API est dans src/api" |
| **3. Mémoires pertinentes** (Relevant) | `searchMemories` | Expériences passées liées à votre première phrase | Vous demandez "comment corriger ce bug", il trouve les enregistrements de corrections similaires |

---

## Qu'est-ce qui est injecté ?

Lorsque vous envoyez le premier message dans OpenCode, le plugin insère silencieusement le contenu suivant dans le System Prompt en arrière-plan.

::: details Cliquez pour voir la structure réelle du contenu injecté
```text
[SUPERMEMORY]

User Profile:
- User prefers concise responses
- User uses Zod for all validations

Recent Context:
- Working on auth module refactoring

Project Knowledge:
- [100%] Architecture follows MVC pattern
- [100%] Use 'npm run test' for testing

Relevant Memories:
- [85%] Previous fix for hydration error: use useEffect
```
:::

Après avoir vu ces informations, l'Agent se comportera comme un employé expérimenté travaillant sur ce projet depuis longtemps, et non comme un stagiaire nouvellement arrivé.

---

## Mécanisme de déclenchement par mots-clés (Nudge)

En plus de l'injection automatique au début, vous pouvez "réveiller" la fonction de mémorisation à tout moment pendant la conversation.

Le plugin intègre un **détecteur de mots-clés**. Tant que votre message contient des mots de déclenchement spécifiques, le plugin enverra un "indice invisible" (Nudge) à l'Agent, le forçant à appeler l'outil de sauvegarde.

### Mots-clés par défaut

- `remember`
- `save this`
- `don't forget`
- `memorize`
- `take note`
- ... (voir configuration du code source pour plus)

### Exemple d'interaction

**Votre saisie** :
> Le format de réponse de l'API a changé, **remember** dorénavant utilisez `data.result` au lieu de `data.payload`.

**Le plugin détecte "remember"** :
> (injection d'indice en arrière-plan) : `[MEMORY TRIGGER DETECTED] The user wants you to remember something...`

**Réaction de l'Agent** :
> Reçu. Je vais me souvenir de ce changement.
> *(appelle `supermemory.add` en arrière-plan pour sauvegarder la mémoire)*

---

## Configuration approfondie

Vous pouvez ajuster le comportement d'injection en modifiant `~/.config/opencode/supermemory.jsonc`.

### Options de configuration courantes

```jsonc
{
  // Si le profil utilisateur est injecté (défaut true)
  "injectProfile": true,

  // Combien de mémoires du projet injecter à chaque fois (défaut 10)
  // Augmenter permet à l'Agent de mieux comprendre le projet, mais consomme plus de tokens
  "maxProjectMemories": 10,

  // Combien d'éléments de profil utilisateur injecter à chaque fois (défaut 5)
  "maxProfileItems": 5,

  // Mots-clés personnalisés (supporte les expressions régulières)
  "keywordPatterns": [
    "note ceci",
    "sauvegarde permanente"
  ]
}
```

::: tip Conseil
Après avoir modifié la configuration, vous devez redémarrer OpenCode ou recharger le plugin pour que les changements prennent effet.
:::

---

## Questions fréquentes

### Q : Les informations injectées consomment-elles beaucoup de tokens ?
**R** : Elles consomment une partie, mais généralement de manière contrôlable. Avec la configuration par défaut (10 mémoires du projet + 5 éléments de profil), environ 500-1000 tokens sont consommés. Pour les grands modèles modernes (comme Claude 3.5 Sonnet) avec un contexte de 200k, ce n'est rien.

### Q : Pourquoi n'y a-t-il aucune réaction quand je dis "remember" ?
**R** :
1. Vérifiez que l'orthographe est correcte (supporte la correspondance regex).
2. Confirmez que la clé API est correctement configurée (si le plugin n'est pas initialisé, il ne se déclenchera pas).
3. L'Agent peut décider d'ignorer (bien que le plugin ait forcé l'invite, l'Agent a le dernier mot).

### Q : Comment les "mémoires pertinentes" sont-elles trouvées ?
**R** : Elles sont trouvées par une recherche sémantique basée sur le **contenu de votre premier message**. Si votre première phrase ne dit que "Hi", vous ne trouverez peut-être rien d'utile, mais les "connaissances du projet" et le "profil utilisateur" seront toujours injectés.

---

## Résumé du cours

- **L'injection automatique** se déclenche uniquement avec le premier message de la session.
- Le **modèle tridimensionnel** comprend le profil utilisateur, les connaissances du projet et les mémoires pertinentes.
- Le **déclenchement par mots-clés** vous permet de commander à l'Agent de sauvegarder des mémoires à tout moment.
- Vous pouvez contrôler la quantité d'informations injectées via le **fichier de configuration**.

## Aperçu du prochain cours

> Le prochain cours est **[Ensemble d'outils détaillé : Enseigner à l'Agent à mémoriser](../tools/index.md)**.
>
> Vous apprendrez :
> - Comment utiliser manuellement les outils `add`, `search`, etc.
> - Comment voir et supprimer les mémoires incorrectes.

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Lignes |
| :--- | :--- | :--- |
| Logique de déclenchement de l'injection | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L125-L176) | 125-176 |
| Détection de mots-clés | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L34-L37) | 34-37 |
| Formatage du prompt | [`src/services/context.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/context.ts#L14-L64) | 14-64 |
| Configuration par défaut | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L44-L54) | 44-54 |

**Fonctions clés** :
- `formatContextForPrompt()` : Assemble le bloc de texte `[SUPERMEMORY]`.
- `detectMemoryKeyword()` : Correspond aux mots-clés dans le message de l'utilisateur par regex.

</details>

## Aperçu du prochain cours

> Le prochain cours est **[Ensemble d'outils détaillé : Enseigner à l'Agent à mémoriser](../tools/index.md)**.
>
> Vous apprendrez :
> - Maîtriser les 5 modes d'outils principaux (add, search, profile, list, forget)
> - Comment intervenir et corriger manuellement les mémoires de l'Agent
> - Utiliser des commandes en langage naturel pour déclencher la sauvegarde de mémoires

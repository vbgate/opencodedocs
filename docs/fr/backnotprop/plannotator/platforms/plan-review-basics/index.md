---
title: "Révision de plan : réviser visuellement les plans IA | Plannotator"
subtitle: "Bases de la révision de plan : réviser visuellement les plans IA"
description: "Apprenez la fonctionnalité de révision de plan de Plannotator. Utilisez l'interface visuelle pour réviser les plans générés par l'IA, ajoutez des annotations pour approuver ou rejeter, et maîtrisez la différence entre Approve et Request Changes."
sidebarTitle: "Apprendre à réviser un plan en 5 min"
tags:
  - "Révision de plan"
  - "Révision visuelle"
  - "Annotations"
  - "Approbation"
  - "Rejet"
  - "Claude Code"
  - "OpenCode"
prerequisite:
  - "start-getting-started"
order: 1
---

# Bases de la révision de plan : réviser visuellement les plans IA

## Ce que vous pourrez faire après ce cours

- ✅ Utiliser l'interface visuelle de Plannotator pour réviser les plans générés par l'IA
- ✅ Sélectionner du texte de plan et ajouter différents types d'annotations (suppression, remplacement, commentaire)
- ✅ Approuver un plan pour que l'IA continue l'implémentation
- ✅ Rejeter un plan en envoyant vos annotations comme retour à l'IA
- ✅ Comprendre les cas d'utilisation et les différences entre les types d'annotations

## Votre problème actuel

**Problème 1** : Les plans d'implémentation générés par l'IA sont difficiles à lire dans le terminal — trop de texte, structure peu claire, révision fatigante.

**Problème 2** : Pour donner un retour à l'IA, vous devez décrire textuellement « supprimer le 3e paragraphe », « modifier cette fonction » — coût de communication élevé, et l'IA peut mal comprendre.

**Problème 3** : Certaines parties du plan n'ont pas besoin de modification, d'autres doivent être remplacées, d'autres nécessitent des commentaires, mais aucun outil ne vous aide à structurer ces retours.

**Problème 4** : Vous ne savez pas comment indiquer à l'IA si vous avez approuvé le plan ou s'il nécessite des modifications.

**Plannotator peut vous aider** :
- Interface visuelle au lieu de la lecture en terminal, structure claire
- Sélectionnez du texte pour ajouter des annotations (suppression, remplacement, commentaire), retour précis
- Les annotations sont automatiquement converties en données structurées, l'IA comprend précisément votre intention
- Approbation ou rejet en un clic, l'IA répond immédiatement

## Quand utiliser cette approche

**Cas d'utilisation** :
- L'agent IA termine un plan et appelle `ExitPlanMode` (Claude Code)
- L'agent IA appelle l'outil `submit_plan` (OpenCode)
- Vous devez réviser un plan d'implémentation généré par l'IA
- Vous devez fournir des retours précis sur les modifications du plan

**Cas non applicables** :
- Laisser l'IA implémenter directement le code (sans révision de plan)
- Plan déjà approuvé, vous devez réviser les modifications de code réelles (utilisez la fonctionnalité de revue de code)

## 🎒 Préparation avant de commencer

**Prérequis** :
- ✅ Plannotator CLI installé (voir [Démarrage rapide](../../start/getting-started/))
- ✅ Plugin Claude Code ou OpenCode configuré (voir le guide d'installation correspondant)
- ✅ Agent IA supportant la révision de plan (Claude Code 2.1.7+ ou OpenCode)

**Méthodes de déclenchement** :
- **Claude Code** : L'IA appelle automatiquement `ExitPlanMode` après avoir terminé le plan, Plannotator se lance automatiquement
- **OpenCode** : L'IA appelle l'outil `submit_plan`, Plannotator se lance automatiquement

## Concept central

### Qu'est-ce que la révision de plan

La **révision de plan** est la fonctionnalité principale de Plannotator, utilisée pour réviser visuellement les plans d'implémentation générés par l'IA.

::: info Pourquoi avez-vous besoin de la révision de plan ?
Après avoir généré un plan, l'IA demande généralement « Ce plan vous convient-il ? » ou « Dois-je commencer l'implémentation ? ». Sans outil visuel, vous ne pouvez que lire le plan en texte brut dans le terminal, puis répondre par des retours vagues comme « OK », « Non, modifiez XX ». Plannotator vous permet de visualiser le plan, de sélectionner précisément les parties à modifier, d'ajouter des annotations structurées, et l'IA comprend plus facilement votre intention.
:::

### Flux de travail

```
┌─────────────────┐
│  Agent IA      │
│  (génère plan) │
└────────┬────────┘
         │
         │ ExitPlanMode / submit_plan
         ▼
┌─────────────────┐
│ Plannotator UI  │  ← Le navigateur s'ouvre automatiquement
│                 │
│ ┌───────────┐  │
│ │ Contenu   │  │
│ │ du plan   │  │
│ │ (Markdown) │  │
│ └───────────┘  │
│       │         │
│       │ Sélectionner du texte
│       ▼         │
│ ┌───────────┐  │
│ │ Ajouter   │  │
│ │ annotation│  │
│ │ Delete/   │  │
│ │ Replace/  │  │
│ │ Comment   │  │
│ └───────────┘  │
│       │         │
│       ▼         │
│ ┌───────────┐  │
│ │ Décision  │  │
│ │ Approve/  │  │
│ │ Request   │  │
│ │ Changes   │  │
│ └───────────┘  │
└────────┬────────┘
         │
         │ {"behavior": "allow"} ou
         │ {"behavior": "deny", "message": "..."}
         ▼
┌─────────────────┐
│  Agent IA      │
│  (continue     │
│  implémentation)│
└─────────────────┘
```

### Types d'annotations

Plannotator prend en charge quatre types d'annotations, chacun avec un usage différent :

| Type d'annotation | Utilisation | Retour reçu par l'IA |
| --- | --- | --- |
| **Delete** | Supprimer le contenu non nécessaire | « Supprimer : [texte sélectionné] » |
| **Replace** | Remplacer par un meilleur contenu | « Remplacer : [texte sélectionné] par [votre texte] » |
| **Comment** | Commenter un passage sans exiger de modification | « Commentaire : [texte sélectionné]. Note : [votre commentaire] » |
| **Global Comment** | Commentaire global, non lié à un texte spécifique | « Commentaire global : [votre commentaire] » |

### Approve vs Request Changes

| Type de décision | Action | Retour reçu par l'IA | Cas d'utilisation |
| --- | --- | --- | --- |
| **Approve** | Cliquer sur le bouton Approve | `{"behavior": "allow"}` | Le plan est correct, approbation directe |
| **Request Changes** | Cliquer sur le bouton Request Changes | `{"behavior": "deny", "message": "..."}` | Des modifications sont nécessaires |

::: tip Différences entre Claude Code et OpenCode
- **Claude Code** : Les annotations ne sont pas envoyées lors de l'approbation (elles sont ignorées)
- **OpenCode** : Les annotations peuvent être envoyées comme notes lors de l'approbation (optionnel)

**Lors du rejet du plan** : Sur les deux plateformes, les annotations sont envoyées à l'IA
:::

## Suivez les étapes

### Étape 1 : Déclencher la révision de plan

**Exemple Claude Code** :

Dialoguez avec l'IA dans Claude Code pour qu'elle génère un plan d'implémentation :

```
Utilisateur : Aide-moi à créer un plan d'implémentation pour un module d'authentification utilisateur

Claude : D'accord, voici le plan d'implémentation :
1. Créer le modèle utilisateur
2. Implémenter l'API d'inscription
3. Implémenter l'API de connexion
...
(L'IA appelle ExitPlanMode)
```

**Exemple OpenCode** :

Dans OpenCode, l'IA appelle automatiquement l'outil `submit_plan`.

**Ce que vous devriez voir** :
1. Le navigateur ouvre automatiquement l'interface Plannotator
2. Le contenu du plan généré par l'IA s'affiche (format Markdown)
3. Les boutons « Approve » et « Request Changes » apparaissent en bas de page

### Étape 2 : Parcourir le contenu du plan

Consultez le plan dans le navigateur :

- Le plan est rendu en format Markdown, incluant titres, paragraphes, listes, blocs de code
- Vous pouvez faire défiler pour voir l'ensemble du plan
- Support du mode clair/sombre (cliquez sur le bouton de changement de thème en haut à droite)

### Étape 3 : Sélectionner du texte et ajouter des annotations

**Ajouter une annotation Delete** :

1. Sélectionnez avec la souris le texte à supprimer dans le plan
2. Cliquez sur le bouton **Delete** dans la barre d'outils qui apparaît
3. Le texte est marqué avec un style de suppression (barré rouge)

**Ajouter une annotation Replace** :

1. Sélectionnez avec la souris le texte à remplacer dans le plan
2. Cliquez sur le bouton **Replace** dans la barre d'outils qui apparaît
3. Saisissez le contenu de remplacement dans le champ de saisie qui apparaît
4. Appuyez sur Entrée ou cliquez sur confirmer
5. Le texte original est marqué avec un style de remplacement (fond jaune), et le contenu de remplacement s'affiche en dessous

**Ajouter une annotation Comment** :

1. Sélectionnez avec la souris le texte à commenter dans le plan
2. Cliquez sur le bouton **Comment** dans la barre d'outils qui apparaît
3. Saisissez le contenu du commentaire dans le champ de saisie qui apparaît
4. Appuyez sur Entrée ou cliquez sur confirmer
5. Le texte est marqué avec un style de commentaire (surbrillance bleue), et le commentaire s'affiche dans la barre latérale

**Ajouter un Global Comment** :

1. Cliquez sur le bouton **Add Global Comment** en haut à droite de la page
2. Saisissez le contenu du commentaire global dans le champ de saisie qui apparaît
3. Appuyez sur Entrée ou cliquez sur confirmer
4. Le commentaire s'affiche dans la section « Global Comments » de la barre latérale

**Ce que vous devriez voir** :
- Après avoir sélectionné du texte, la barre d'outils apparaît immédiatement (Delete, Replace, Comment)
- Après avoir ajouté une annotation, le texte affiche le style correspondant (barré, couleur de fond, surbrillance)
- La barre latérale affiche la liste de toutes les annotations, vous pouvez cliquer pour naviguer vers la position correspondante
- Vous pouvez cliquer sur le bouton **Supprimer** à côté d'une annotation pour la retirer

### Étape 4 : Approuver le plan

**Si le plan est correct** :

Cliquez sur le bouton **Approve** en bas de page.

**Ce que vous devriez voir** :
- Le navigateur se ferme automatiquement (délai de 1,5 seconde)
- Le terminal Claude Code/OpenCode affiche que le plan est approuvé
- L'IA continue l'implémentation du plan

::: info Comportement de Approve
- **Claude Code** : Envoie uniquement `{"behavior": "allow"}`, les annotations sont ignorées
- **OpenCode** : Envoie `{"behavior": "allow"}`, les annotations peuvent être envoyées comme notes (optionnel)
:::

### Étape 5 : Rejeter le plan (Request Changes)

**Si le plan nécessite des modifications** :

1. Ajoutez les annotations nécessaires (Delete, Replace, Comment)
2. Cliquez sur le bouton **Request Changes** en bas de page
3. Le navigateur affiche une boîte de dialogue de confirmation

**Ce que vous devriez voir** :
- La boîte de dialogue de confirmation affiche « Send X annotations to AI? »
- Après confirmation, le navigateur se ferme automatiquement
- Le terminal Claude Code/OpenCode affiche le contenu du retour
- L'IA modifie le plan en fonction du retour

::: tip Comportement de Request Changes
- **Claude Code** et **OpenCode** : Les deux envoient `{"behavior": "deny", "message": "..."}`
- Les annotations sont converties en texte Markdown structuré
- L'IA modifie le plan et appelle à nouveau ExitPlanMode/submit_plan
:::

### Étape 6 : Consulter le contenu du retour (optionnel)

Si vous souhaitez voir le contenu du retour envoyé par Plannotator à l'IA, consultez le terminal :

**Claude Code** :
```
Plan rejected by user
Please modify the plan based on the following feedback:

[Contenu structuré des annotations]
```

**OpenCode** :
```
<feedback>
[Contenu structuré des annotations]
</feedback>
```

## Point de contrôle ✅

Après avoir terminé les étapes ci-dessus, vous devriez pouvoir :

- [ ] Après que l'IA déclenche la révision de plan, le navigateur ouvre automatiquement l'interface Plannotator
- [ ] Sélectionner du texte de plan et ajouter des annotations Delete, Replace, Comment
- [ ] Ajouter un Global Comment
- [ ] Consulter toutes les annotations dans la barre latérale et naviguer vers la position correspondante
- [ ] Cliquer sur Approve, le navigateur se ferme, l'IA continue l'implémentation
- [ ] Cliquer sur Request Changes, le navigateur se ferme, l'IA modifie le plan

**Si une étape échoue**, consultez :
- [Problèmes courants](../../faq/common-problems/)
- [Guide d'installation Claude Code](../../start/installation-claude-code/)
- [Guide d'installation OpenCode](../../start/installation-opencode/)

## Pièges à éviter

**Erreur courante 1** : Après avoir sélectionné du texte, la barre d'outils n'apparaît pas

**Cause** : Vous avez peut-être sélectionné du texte dans un bloc de code, ou le texte sélectionné traverse plusieurs éléments.

**Solution** :
- Essayez de sélectionner du texte dans un seul paragraphe ou élément de liste
- Pour les blocs de code, utilisez une annotation Comment, ne sélectionnez pas sur plusieurs lignes

**Erreur courante 2** : Après avoir ajouté une annotation Replace, le contenu de remplacement ne s'affiche pas

**Cause** : Le champ de saisie du contenu de remplacement n'a peut-être pas été correctement soumis.

**Solution** :
- Après avoir saisi le contenu de remplacement, appuyez sur Entrée ou cliquez sur le bouton de confirmation
- Vérifiez si le contenu de remplacement s'affiche dans la barre latérale

**Erreur courante 3** : Après avoir cliqué sur Approve ou Request Changes, le navigateur ne se ferme pas

**Cause** : Erreur serveur ou problème réseau possible.

**Solution** :
- Vérifiez s'il y a des messages d'erreur dans le terminal
- Fermez manuellement le navigateur
- Si le problème persiste, consultez [Dépannage](../../faq/troubleshooting/)

**Erreur courante 4** : L'IA ne modifie pas selon les annotations après avoir reçu le retour

**Cause** : L'IA n'a peut-être pas correctement compris l'intention des annotations.

**Solution** :
- Essayez d'utiliser des annotations plus explicites (Replace est plus explicite que Comment)
- Utilisez Comment pour ajouter des explications détaillées
- Si le problème persiste, rejetez à nouveau le plan et ajustez le contenu des annotations

**Erreur courante 5** : Après avoir ajouté plusieurs annotations Delete, l'IA n'a supprimé qu'une partie du contenu

**Cause** : Il peut y avoir des chevauchements ou des conflits entre plusieurs annotations Delete.

**Solution** :
- Assurez-vous que les plages de texte de chaque annotation Delete ne se chevauchent pas
- Si vous devez supprimer un grand bloc de contenu, sélectionnez le paragraphe entier en une seule fois

## Résumé du cours

La révision de plan est la fonctionnalité principale de Plannotator, vous permettant de réviser visuellement les plans générés par l'IA :

**Opérations principales** :
1. **Déclenchement** : L'IA appelle `ExitPlanMode` ou `submit_plan`, le navigateur ouvre automatiquement l'interface
2. **Parcours** : Consultez le contenu du plan dans l'interface visuelle (format Markdown)
3. **Annotation** : Sélectionnez du texte, ajoutez Delete, Replace, Comment ou Global Comment
4. **Décision** : Cliquez sur Approve (approuver) ou Request Changes (rejeter)
5. **Retour** : Les annotations sont converties en données structurées, l'IA continue ou modifie le plan selon le retour

**Types d'annotations** :
- **Delete** : Supprimer le contenu non nécessaire
- **Replace** : Remplacer par un meilleur contenu
- **Comment** : Commenter un passage sans exiger de modification
- **Global Comment** : Commentaire global, non lié à un texte spécifique

**Types de décision** :
- **Approve** : Le plan est correct, approbation directe (Claude Code ignore les annotations)
- **Request Changes** : Des modifications sont nécessaires, les annotations sont envoyées à l'IA

## Aperçu du prochain cours

> Dans le prochain cours, nous apprendrons **[Ajouter des annotations de plan](../plan-review-annotations/)**.
>
> Vous apprendrez :
> - Comment utiliser précisément les annotations Delete, Replace, Comment
> - Comment ajouter des annotations d'images
> - Comment modifier et supprimer des annotations
> - Les meilleures pratiques et cas d'utilisation courants des annotations

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour afficher l'emplacement du code source</strong></summary>

> Date de mise à jour : 2026-01-24

| Fonctionnalité | Chemin du fichier | Numéros de ligne |
| --- | --- | --- |
| Interface de révision de plan | [`packages/editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/editor/App.tsx#L1-L200) | 1-200 |
| Définition des types d'annotations | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L1-L70) | 1-70 |
| Serveur de révision de plan | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L91-L310) | 91-310 |
| API : Obtenir le contenu du plan | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L132-L134) | 132-134 |
| API : Approuver le plan | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L201-L277) | 201-277 |
| API : Rejeter le plan | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L280-L309) | 280-309 |
| Composant Viewer | [`packages/ui/components/Viewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Viewer.tsx#L1-L100) | 1-100 |
| Composant AnnotationPanel | [`packages/ui/components/AnnotationPanel.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationPanel.tsx#L1-L50) | 1-50 |

**Types clés** :
- `AnnotationType` : Énumération des types d'annotations (DELETION, INSERTION, REPLACEMENT, COMMENT, GLOBAL_COMMENT) (`packages/ui/types.ts:1-7`)
- `Annotation` : Interface d'annotation (`packages/ui/types.ts:11-33`)
- `Block` : Interface de bloc de plan (`packages/ui/types.ts:35-44`)

**Fonctions clés** :
- `startPlannotatorServer()` : Démarre le serveur de révision de plan (`packages/server/index.ts:91`)
- `parseMarkdownToBlocks()` : Analyse le Markdown en Blocks (`packages/ui/utils/parser.ts`)

**Routes API** :
- `GET /api/plan` : Obtenir le contenu du plan (`packages/server/index.ts:132`)
- `POST /api/approve` : Approuver le plan (`packages/server/index.ts:201`)
- `POST /api/deny` : Rejeter le plan (`packages/server/index.ts:280`)

**Règles métier** :
- Claude Code n'envoie pas les annotations lors de l'approbation (`apps/hook/server/index.ts:132`)
- OpenCode peut envoyer les annotations comme notes lors de l'approbation (`apps/opencode-plugin/index.ts:270`)
- Les annotations sont toujours envoyées lors du rejet du plan (`apps/hook/server/index.ts:154`)

</details>

---
title: "Portées mémoire: User et Project CRUD | opencode-supermemory"
sidebarTitle: "Gestion mémoire"
subtitle: "Portée et cycle de vie de la mémoire : Gérer votre cerveau numérique"
description: "Comprenez les portées User et Project d'opencode-supermemory. Maîtrisez les opérations CRUD pour gérer votre mémoire efficacement entre projets."
tags:
  - "gestion-de-la-mémoire"
  - "portée"
  - "crud"
prerequisite:
  - "core-tools"
order: 3
---

# Portée et cycle de vie de la mémoire : Gérer votre cerveau numérique

## Ce que vous pourrez faire après ce cours

- **Distinguer les portées** : Comprenez quelles mémoires "vous suivent" (inter-projets) et lesquelles "suivent le projet" (spécifiques au projet).
- **Gérer les mémoires** : Apprenez à visualiser, ajouter et supprimer manuellement les mémoires pour maintenir la cognition de l'Agent propre.
- **Déboguer l'Agent** : Lorsque l'Agent se "souvient" mal, savez où corriger.

## Idée principale

opencode-supermemory divise la mémoire en deux **portées (Scope)** isolées, similaires aux variables globales et variables locales dans les langages de programmation.

### 1. Les deux portées

| Portée | Identifiant (Scope ID) | Cycle de vie | Usage typique |
|--- | --- | --- | ---|
| **User Scope**<br>(Portée utilisateur) | `user` | **Vous suit de façon permanente**<br>Partagé entre tous les projets | • Préférences de style de codage (comme "préfère TypeScript")<br>• Habitudes personnelles (comme "toujours écrire des commentaires")<br>• Connaissances générales |
| **Project Scope**<br>(Portée projet) | `project` | **Limité au projet actuel**<br>Devient invalide en changeant de répertoire | • Conception de l'architecture du projet<br><br>• Explication de la logique métier<br><br>• Solution de correction d'un bug spécifique |

::: info Comment les portées sont-elles générées ?
Le plugin génère automatiquement des balises uniques via `src/services/tags.ts` :
- **User Scope** : Basé sur le hachage de votre email Git (`opencode_user_{hash}`).
- **Project Scope** : Basé sur le hachage du chemin du projet actuel (`opencode_project_{hash}`).
:::

### 2. Le cycle de vie de la mémoire

1. **Création (Add)** : Écrite via l'initialisation CLI ou la conversation de l'Agent (`Remember this...`).
2. **Activation (Inject)** : À chaque nouvelle session, le plugin extrait automatiquement les mémoires User et Project pertinentes et les injecte dans le contexte.
3. **Recherche (Search)** : L'Agent peut activement rechercher des mémoires spécifiques pendant la conversation.
4. **Oubli (Forget)** : Lorsque la mémoire devient obsolète ou incorrecte, supprimée par ID.

---

## Suivez-moi : Gérer vos mémoires

Nous allons gérer manuellement les mémoires de ces deux portées en conversant avec l'Agent.

### Étape 1 : Voir les mémoires existantes

D'abord, voyons ce que l'Agent se souvient actuellement.

**Action** : Dans la boîte de chat OpenCode, entrez :

```text
S'il te plaît, liste toutes les mémoires du projet actuel (List memories in project scope)
```

**Ce que vous devriez voir** :
L'Agent appelle le mode `list` de l'outil `supermemory` et renvoie une liste :

```json
// Exemple de sortie
{
  "success": true,
  "scope": "project",
  "count": 3,
  "memories": [
    {
      "id": "mem_123456",
      "content": "Le projet utilise l'architecture MVC, la couche Service est responsable de la logique métier",
      "createdAt": "2023-10-01T10:00:00Z"
    }
    // ...
  ]
}
```

### Étape 2 : Ajouter une mémoire inter-projets (User Scope)

Supposons que vous souhaitiez que l'Agent réponde toujours en chinois dans **tous** les projets. C'est une mémoire adaptée à User Scope.

**Action** : Entrez la commande suivante :

```text
S'il te plaît, souviens-toi de ma préférence personnelle : quel que soit le projet, réponds-moi toujours en chinois.
S'il te plaît, enregistre ceci dans User Scope.
```

**Ce que vous devriez voir** :
L'Agent appelle l'outil `add`, avec le paramètre `scope: "user"` :

```json
{
  "mode": "add",
  "content": "User prefers responses in Chinese across all projects",
  "scope": "user",
  "type": "preference"
}
```

Le système confirme que la mémoire a été ajoutée et renvoie un `id`.

### Étape 3 : Ajouter une mémoire spécifique au projet (Project Scope)

Maintenant, ajoutons une règle spécifique pour le **projet actuel**.

**Action** : Entrez la commande suivante :

```text
S'il te plaît, souviens-toi : dans ce projet, tous les formats de date doivent être AAAA-MM-JJ.
Enregistre dans Project Scope.
```

**Ce que vous devriez voir** :
L'Agent appelle l'outil `add`, avec le paramètre `scope: "project"` (valeur par défaut, l'Agent peut l'omettre) :

```json
{
  "mode": "add",
  "content": "Le format de date doit être AAAA-MM-JJ dans ce projet",
  "scope": "project",
  "type": "project-config"
}
```

### Étape 4 : Vérifier l'isolation

Pour vérifier que la portée fonctionne, nous pouvons essayer de rechercher.

**Action** : Entrez :

```text
Recherche les mémoires sur "format de date"
```

**Ce que vous devriez voir** :
L'Agent appelle l'outil `search`. S'il spécifie `scope: "project"` ou effectue une recherche mixte, il devrait pouvoir trouver cette mémoire.

::: tip Vérifier les capacités inter-projets
Si vous ouvrez une nouvelle fenêtre de terminal, entrez dans un autre répertoire de projet différent, et demandez à nouveau le "format de date", l'Agent devrait **ne pas trouver** cette mémoire (car elle est isolée dans le Project Scope du projet d'origine). Mais si vous demandez "quelle langue veux-tu utiliser pour me répondre", il devrait pouvoir retrouver la préférence "répondre en chinois" du User Scope.
:::

### Étape 5 : Supprimer les mémoires obsolètes

Si les normes du projet changent, nous devons supprimer les anciennes mémoires.

**Action** :
1. Exécutez d'abord **l'étape 1** pour obtenir l'ID de la mémoire (par exemple `mem_987654`).
2. Entrez la commande :

```text
S'il te plaît, oublie la mémoire avec l'ID mem_987654 concernant le format de date.
```

**Ce que vous devriez voir** :
L'Agent appelle l'outil `forget` :

```json
{
  "mode": "forget",
  "memoryId": "mem_987654"
}
```

Le système renvoie `success: true`.

---

## Questions fréquentes (FAQ)

### Q : Si je change d'ordinateur, les mémoires User Scope sont-elles toujours là ?
**R : Cela dépend de votre configuration Git.**
User Scope est généré basé sur `git config user.email`. Si vous utilisez le même email Git sur deux ordinateurs et que vous vous connectez au même compte Supermemory (en utilisant la même clé API), les mémoires sont **synchronisées**.

### Q : Pourquoi ne puis-je pas voir la mémoire que je viens d'ajouter ?
**R : Peut-être un cache ou un délai d'indexation.**
L'index vectoriel de Supermemory est généralement de l'ordre de quelques secondes, mais peut y avoir un délai court lors de fluctuations du réseau. De plus, le contexte injecté par l'Agent au début de la session est **statique** (instantané), les nouvelles mémoires ajoutées peuvent nécessiter un redémarrage de la session (`/clear` ou redémarrer OpenCode) pour prendre effet dans "l'injection automatique", mais peuvent être trouvées immédiatement via l'outil `search`.

---

## Annexe : Référence du code source

| Fonctionnalité | Chemin du fichier | Lignes |
|--- | --- | ---|
| Logique de génération de Scope | [`src/services/tags.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/tags.ts#L18-L36) | 18-36 |
| Définition de l'outil de mémoire | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L183-L485) | 183-485 |
| Définition des types de mémoire | [`src/types/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/types/index.ts) | - |
| Implémentation du client | [`src/services/client.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/client.ts) | 23-182 |

**Fonctions clés** :
- `getUserTag()` : Génère la balise utilisateur basée sur l'email Git
- `getProjectTag()` : Génère la balise projet basée sur le chemin du répertoire
- `supermemoryClient.addMemory()` : Appel API d'ajout de mémoire
- `supermemoryClient.deleteMemory()` : Appel API de suppression de mémoire

## Aperçu du prochain cours

> Le prochain cours est **[Principe de compactage préemptif](../../advanced/compaction/index.md)**.
>
> Vous apprendrez :
> - Pourquoi l'Agent "oublie" (dépassement de contexte)
> - Comment le plugin détecte automatiquement l'utilisation des tokens
> - Comment compresser une session sans perdre d'informations clés

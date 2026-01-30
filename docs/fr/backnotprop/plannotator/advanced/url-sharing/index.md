---
title: "Partage par URL : Collaboration sans Backend | Plannotator"
sidebarTitle: "Partager avec l'équipe"
subtitle: "Partage par URL : Collaboration sans Backend"
description: "Apprenez la fonctionnalité de partage par URL de Plannotator. Collaborez sans backend grâce à la compression deflate et l'encodage Base64, configurez les variables d'environnement et résolvez les problèmes courants de partage."
tags:
  - "Partage URL"
  - "Collaboration d'équipe"
  - "Sans backend"
  - "Compression deflate"
  - "Encodage Base64"
  - "Sécurité"
prerequisite:
  - "start-getting-started"
  - "platforms-plan-review-basics"
order: 1
---

# Partage par URL : Collaboration de plans sans backend

## Ce que vous apprendrez

- ✅ Partager des plans et annotations via URL, sans compte ni serveur
- ✅ Comprendre comment la compression deflate et l'encodage Base64 intègrent les données dans le hash de l'URL
- ✅ Distinguer le mode partage (lecture seule) du mode local (éditable)
- ✅ Configurer la variable d'environnement `PLANNOTATOR_SHARE` pour contrôler le partage
- ✅ Gérer les limites de longueur d'URL et les échecs de partage

## Votre situation actuelle

**Problème 1** : Vous souhaitez demander à un collègue de réviser un plan généré par l'IA, mais vous n'avez pas de plateforme collaborative.

**Problème 2** : Partager via captures d'écran ou copier-coller du texte ne permet pas à l'autre personne de voir vos annotations directement.

**Problème 3** : Déployer un serveur de collaboration en ligne est coûteux, ou la politique de sécurité de votre entreprise ne le permet pas.

**Problème 4** : Vous avez besoin d'un moyen simple et rapide de partager, mais vous ne savez pas comment garantir la confidentialité des données.

**Plannotator peut vous aider** :
- Aucun serveur backend nécessaire, toutes les données sont compressées dans l'URL
- Le lien de partage contient le plan complet et les annotations, le destinataire peut les consulter
- Les données ne quittent pas votre appareil local, confidentialité garantie
- L'URL générée peut être copiée dans n'importe quel outil de communication

## Quand utiliser cette fonctionnalité

**Cas d'utilisation** :
- Demander à un membre de l'équipe de réviser un plan d'implémentation généré par l'IA
- Partager les résultats d'une revue de code avec un collègue
- Sauvegarder le contenu de la revue dans vos notes (avec l'intégration Obsidian/Bear)
- Obtenir rapidement des retours sur un plan

**Cas non adaptés** :
- Collaboration en temps réel (le partage Plannotator est en lecture seule)
- Contenu du plan dépassant la limite de longueur d'URL (généralement plusieurs milliers de lignes)
- Contenu partagé contenant des informations sensibles (l'URL elle-même n'est pas chiffrée)

::: warning Avertissement de sécurité
L'URL de partage contient le plan complet et les annotations. Ne partagez pas de contenu contenant des informations sensibles (clés API, mots de passe, etc.). L'URL de partage est accessible par quiconque la possède et n'expire pas automatiquement.
:::

## Concept clé

### Qu'est-ce que le partage par URL

Le **partage par URL** est une méthode de collaboration sans backend fournie par Plannotator. Elle compresse le plan et les annotations dans le hash de l'URL, permettant le partage sans serveur.

::: info Pourquoi « sans backend » ?
Les solutions de collaboration traditionnelles nécessitent un serveur backend pour stocker les plans et annotations, les utilisateurs y accédant via un ID ou un token. Le partage par URL de Plannotator ne dépend d'aucun backend — toutes les données sont dans l'URL, le destinataire ouvre le lien et le contenu est analysé. Cela garantit la confidentialité (pas d'upload de données) et la simplicité (pas de service à déployer).
:::

### Fonctionnement

```
┌─────────────────────────────────────────────────────────┐
│  Utilisateur A (Partageur)                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Révise le plan, ajoute des annotations              │
│     ┌──────────────────────┐                           │
│     │ Plan: Plan d'implém. │                           │
│     │ Annotations: [       │                           │
│     │   {type: 'REPLACE'},│                           │
│     │   {type: 'COMMENT'}  │                           │
│     │ ]                   │                           │
│     └──────────────────────┘                           │
│              │                                         │
│              ▼                                         │
│  2. Cliquer sur Export → Share                         │
│              │                                         │
│              ▼                                         │
│  3. Compression des données                            │
│     JSON → deflate → Base64 → Caractères URL-safe      │
│     ↓                                                │
│     https://share.plannotator.ai/#eJyrVkrLz1...       │
│                                                         │
└─────────────────────────────────────────────────────────┘
                         │
                         │ Copier l'URL
                         ▼
┌─────────────────────────────────────────────────────────┐
│  Utilisateur B (Destinataire)                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Ouvrir l'URL de partage                            │
│     https://share.plannotator.ai/#eJyrVkrLz1...       │
│              │                                         │
│              ▼                                         │
│  2. Le navigateur analyse le hash                      │
│     Caractères URL-safe → Décodage Base64 → Décompression deflate → JSON │
│              │                                         │
│              ▼                                         │
│  3. Restauration du plan et des annotations            │
│     ┌──────────────────────┐                           │
│     │ Plan: Plan d'implém. │  ✅ Mode lecture seule   │
│     │ Annotations: [       │  (Impossible de valider) │
│     │   {type: 'REPLACE'},│                           │
│     │   {type: 'COMMENT'}  │                           │
│     │ ]                   │                           │
│     └──────────────────────┘                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Détail de l'algorithme de compression

**Étape 1 : Sérialisation JSON**
```json
{
  "p": "# Plan\n\nStep 1...",
  "a": [
    ["R", "old text", "new text", null, null],
    ["C", "context", "comment text", null, null]
  ],
  "g": ["image1.png", "image2.png"]
}
```

**Étape 2 : Compression Deflate-raw**
- Utilise l'API native `CompressionStream('deflate-raw')`
- Taux de compression typique de 60-80% (selon la répétition du texte, non défini dans le code source)
- Emplacement dans le code : `packages/ui/utils/sharing.ts:34`

**Étape 3 : Encodage Base64**
```typescript
const base64 = btoa(String.fromCharCode(...compressed));
```

**Étape 4 : Remplacement des caractères URL-safe**
```typescript
base64
  .replace(/\+/g, '-')   // + → -
  .replace(/\//g, '_')   // / → _
  .replace(/=/g, '');    // = → '' (suppression du padding)
```

::: tip Pourquoi remplacer les caractères spéciaux ?
Certains caractères ont une signification spéciale dans les URL (comme `+` qui représente un espace, `/` qui est un séparateur de chemin). L'encodage Base64 peut contenir ces caractères, ce qui causerait des erreurs d'analyse de l'URL. En les remplaçant par `-` et `_`, l'URL devient sûre et copiable.
:::

### Optimisation du format des annotations

Pour l'efficacité de la compression, Plannotator utilise un format d'annotation compact (`ShareableAnnotation`) :

| Annotation originale | Format compact | Description |
| --- | --- | --- |
| `{type: 'DELETION', originalText: '...', text: undefined, ...}` | `['D', 'old text', null, images?]` | D = Deletion, null signifie pas de texte |
| `{type: 'REPLACEMENT', originalText: '...', text: 'new...', ...}` | `['R', 'old text', 'new text', null, images?]` | R = Replacement |
| `{type: 'COMMENT', originalText: '...', text: 'comment...', ...}` | `['C', 'old text', 'comment text', null, images?]` | C = Comment |
| `{type: 'INSERTION', originalText: '...', text: 'new...', ...}` | `['I', 'context', 'new text', null, images?]` | I = Insertion |
| `{type: 'GLOBAL_COMMENT', text: '...', ...}` | `['G', 'comment text', null, images?]` | G = Global comment |

L'ordre des champs est fixe, les noms de clés sont omis, réduisant significativement la taille des données. Emplacement dans le code : `packages/ui/utils/sharing.ts:76`

### Structure de l'URL de partage

```
https://share.plannotator.ai/#<compressed_data>
                            ↑
                        partie hash
```

- **Domaine de base** : `share.plannotator.ai` (page de partage dédiée)
- **Séparateur hash** : `#` (n'est pas envoyé au serveur, entièrement analysé côté client)
- **Données compressées** : JSON compressé encodé en Base64url

## 🎒 Prérequis

**Conditions préalables** :
- ✅ Avoir complété [Les bases de la revue de plan](../../platforms/plan-review-basics/), comprendre comment ajouter des annotations
- ✅ Avoir complété [Tutoriel sur les annotations de plan](../../platforms/plan-review-annotations/), comprendre les types d'annotations
- ✅ Navigateur supportant l'API `CompressionStream` (tous les navigateurs modernes la supportent)

**Vérifier si la fonctionnalité de partage est activée** :
```bash
# Activée par défaut
echo $PLANNOTATOR_SHARE

# Pour désactiver le partage (ex: politique de sécurité d'entreprise)
export PLANNOTATOR_SHARE=disabled
```

::: info Explication de la variable d'environnement
`PLANNOTATOR_SHARE` contrôle l'état d'activation de la fonctionnalité de partage :
- **Non définie ou différente de "disabled"** : Partage activé
- **Définie à "disabled"** : Partage désactivé (Export Modal n'affiche que l'onglet Raw Diff)

Emplacement dans le code : `apps/hook/server/index.ts:44`, `apps/opencode-plugin/index.ts:50`
:::

**Vérifier la compatibilité du navigateur** :
```bash
# Exécuter dans la console du navigateur
const stream = new CompressionStream('deflate-raw');
console.log('CompressionStream supported');
```

Si `CompressionStream supported` s'affiche, le navigateur est compatible. Les navigateurs modernes (Chrome 80+, Firefox 113+, Safari 16.4+) sont tous compatibles.

## Suivez le guide

### Étape 1 : Terminer la revue du plan

**Pourquoi**
Avant de partager, vous devez d'abord terminer la revue, y compris l'ajout d'annotations.

**Actions** :
1. Déclencher une revue de plan dans Claude Code ou OpenCode
2. Consulter le contenu du plan, sélectionner le texte à modifier
3. Ajouter des annotations (suppression, remplacement, commentaire, etc.)
4. (Optionnel) Télécharger des images en pièces jointes

**Vous devriez voir** :
```
┌─────────────────────────────────────────────────────────────┐
│  Plan Review                                              │
├─────────────────────────────────────────────────────────────┤
│                                                           │
│  # Implementation Plan                                    │
│                                                           │
│  ## Phase 1: Setup                                      │
│  Set up WebSocket server on port 8080                    │
│                                                           │
│  ## Phase 2: Authentication                             │
│  Implement JWT authentication middleware                   │
│                    ┌─────────────────────┐               │
│  ━━━━━━━━━━━━━━━━│ Replace: "implement" │               │
│                    └─────────────────────┘               │
│                                                           │
│  Annotation Panel                                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ REPLACE: "implement" → "add"                      │  │
│  │ JWT is overkill, use simple session tokens         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                           │
│  [Approve] [Request Changes] [Export]                   │
└─────────────────────────────────────────────────────────────┘
```

### Étape 2 : Ouvrir l'Export Modal

**Pourquoi**
L'Export Modal fournit le point d'entrée pour générer l'URL de partage.

**Actions** :
1. Cliquer sur le bouton **Export** en haut à droite
2. Attendre l'ouverture de l'Export Modal

**Vous devriez voir** :
```
┌─────────────────────────────────────────────────────────────┐
│  Export                                     ×             │
│  1 annotation                          Share | Raw Diff   │
├─────────────────────────────────────────────────────────────┤
│                                                           │
│  Shareable URL                                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ https://share.plannotator.ai/#eJyrVkrLz1...        │ │
│  │                                              [Copy] │ │
│  │                                           3.2 KB    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                           │
│  This URL contains full plan and all annotations.          │
│  Anyone with this link can view and add to your annotations.│
│                                                           │
└─────────────────────────────────────────────────────────────┘
```

::: tip Indication de la taille de l'URL
Le coin inférieur droit affiche la taille de l'URL en octets (ex: 3.2 KB). Si l'URL est trop longue (plus de 8 KB), envisagez de réduire le nombre d'annotations ou de pièces jointes.
:::

### Étape 3 : Copier l'URL de partage

**Pourquoi**
Une fois l'URL copiée, vous pouvez la coller dans n'importe quel outil de communication (Slack, Email, WeChat, etc.).

**Actions** :
1. Cliquer sur le bouton **Copy**
2. Attendre que le bouton affiche **Copied!**
3. L'URL est maintenant dans le presse-papiers

**Vous devriez voir** :
```
┌─────────────────────────────────────────────────────────────┐
│  Shareable URL                                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ https://share.plannotator.ai/#eJyrVkrLz1...        │ │
│  │                                    ✓ Copied         │ │
│  │                                           3.2 KB    │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

::: tip Sélection automatique
Cliquer sur le champ URL sélectionne automatiquement tout le contenu, facilitant la copie manuelle (si vous n'utilisez pas le bouton Copy).
:::

### Étape 4 : Partager l'URL avec vos collaborateurs

**Pourquoi**
Les collaborateurs peuvent consulter le plan et les annotations en ouvrant l'URL.

**Actions** :
1. Coller l'URL dans un outil de communication (Slack, Email, etc.)
2. Envoyer aux membres de l'équipe

**Exemple de message** :
```
Bonjour @équipe,

Merci de réviser ce plan d'implémentation :
https://share.plannotator.ai/#eJyrVkrLz1...

J'ai ajouté une annotation de remplacement à la phase 2, car je pense que JWT est trop complexe.

Merci de me donner vos retours !
```

### Étape 5 : Le collaborateur ouvre l'URL de partage (côté destinataire)

**Pourquoi**
Le collaborateur doit ouvrir l'URL dans son navigateur pour voir le contenu.

**Actions** (exécutées par le collaborateur) :
1. Cliquer sur l'URL de partage
2. Attendre le chargement de la page

**Vous devriez voir** (point de vue du collaborateur) :
```
┌─────────────────────────────────────────────────────────────┐
│  Plan Review                               Read-only     │
├─────────────────────────────────────────────────────────────┤
│                                                           │
│  # Implementation Plan                                    │
│                                                           │
│  ## Phase 1: Setup                                      │
│  Set up WebSocket server on port 8080                    │
│                                                           │
│  ## Phase 2: Authentication                             │
│  Implement JWT authentication middleware                   │
│                    ┌─────────────────────┐               │
│  ━━━━━━━━━━━━━━━━│ Replace: "implement" │               │
│  │                  └─────────────────────┘               │
│  │ This annotation was shared by [Your Name]             │
│                                                           │
│  Annotation Panel                                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ REPLACE: "implement" → "add"                      │  │
│  │ JWT is overkill, use simple session tokens         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                           │
│  [View Only Mode - Approve and Deny disabled]            │
└─────────────────────────────────────────────────────────────┘
```

::: warning Mode lecture seule
Après ouverture de l'URL de partage, l'interface affiche "Read-only" en haut à droite, et les boutons Approve et Deny sont désactivés. Le collaborateur peut consulter le plan et les annotations, mais ne peut pas soumettre de décision.
:::

::: info Processus de décompression
Lorsque le collaborateur ouvre l'URL, le navigateur exécute automatiquement les étapes suivantes (déclenchées par le Hook `useSharing`) :
1. Extraire les données compressées de `window.location.hash`
2. Exécuter en sens inverse : décodage Base64 → décompression deflate → analyse JSON
3. Restaurer le plan et les annotations
4. Effacer le hash de l'URL (pour éviter le rechargement lors d'un rafraîchissement)

Emplacement dans le code : `packages/ui/hooks/useSharing.ts:67`
:::

### Point de contrôle ✅

**Vérifier que l'URL de partage fonctionne** :
1. Copier l'URL de partage
2. L'ouvrir dans un nouvel onglet ou en navigation privée
3. Confirmer que le même plan et les mêmes annotations s'affichent

**Vérifier le mode lecture seule** :
1. Le collaborateur ouvre l'URL de partage
2. Vérifier la présence du badge "Read-only" en haut à droite
3. Confirmer que les boutons Approve et Deny sont désactivés

**Vérifier la longueur de l'URL** :
1. Consulter la taille de l'URL dans l'Export Modal
2. Confirmer qu'elle ne dépasse pas 8 KB (sinon, réduire les annotations)

## Pièges à éviter

### Problème 1 : Le bouton de partage URL n'apparaît pas

**Symptôme** : L'Export Modal n'affiche pas l'onglet Share, seulement Raw Diff.

**Cause** : La variable d'environnement `PLANNOTATOR_SHARE` est définie à "disabled".

**Solution** :
```bash
# Vérifier la valeur actuelle
echo $PLANNOTATOR_SHARE

# Supprimer ou définir une autre valeur
unset PLANNOTATOR_SHARE
# ou
export PLANNOTATOR_SHARE=enabled
```

Emplacement dans le code : `apps/hook/server/index.ts:44`

### Problème 2 : L'URL de partage affiche une page blanche

**Symptôme** : Le collaborateur ouvre l'URL, la page est vide.

**Cause** : Le hash de l'URL a été perdu ou tronqué lors de la copie.

**Solution** :
1. S'assurer de copier l'URL complète (incluant `#` et tous les caractères suivants)
2. Ne pas utiliser de service de raccourcissement d'URL (peut tronquer le hash)
3. Utiliser le bouton Copy de l'Export Modal plutôt que la copie manuelle

::: tip Longueur du hash URL
La partie hash de l'URL de partage contient généralement plusieurs milliers de caractères, la copie manuelle peut facilement en omettre. Il est recommandé d'utiliser le bouton Copy ou de vérifier l'intégrité en copiant-collant deux fois.
:::

### Problème 3 : L'URL est trop longue pour être envoyée

**Symptôme** : L'URL dépasse la limite de caractères de l'outil de communication (WeChat, Slack, etc.).

**Cause** : Le contenu du plan est trop long ou il y a trop d'annotations.

**Solution** :
1. Supprimer les annotations non essentielles
2. Réduire les pièces jointes images
3. Envisager d'utiliser l'export Raw Diff et de sauvegarder en fichier
4. Utiliser la fonctionnalité de revue de code (le mode diff a un meilleur taux de compression)

### Problème 4 : Le collaborateur ne voit pas mes images

**Symptôme** : L'URL de partage contient des chemins d'images, mais le collaborateur voit "Image not found".

**Cause** : Les images sont sauvegardées dans le répertoire local `/tmp/plannotator/`, inaccessible au collaborateur.

**Solution** :
- Le partage par URL de Plannotator ne supporte pas l'accès aux images entre appareils
- Il est recommandé d'utiliser l'intégration Obsidian, les images sauvegardées dans le vault peuvent être partagées
- Ou faire une capture d'écran et l'intégrer dans l'annotation (description textuelle)

Emplacement dans le code : `packages/server/index.ts:163` (chemin de sauvegarde des images)

### Problème 5 : L'URL n'est pas mise à jour après modification des annotations

**Symptôme** : Après ajout d'une nouvelle annotation, l'URL dans l'Export Modal n'a pas changé.

**Cause** : L'état `shareUrl` n'a pas été rafraîchi automatiquement (cas rare, généralement un problème de mise à jour d'état React).

**Solution** :
1. Fermer l'Export Modal
2. Rouvrir l'Export Modal
3. L'URL devrait automatiquement se mettre à jour avec le dernier contenu

Emplacement dans le code : `packages/ui/hooks/useSharing.ts:128` (fonction `refreshShareUrl`)

## Résumé de la leçon

La **fonctionnalité de partage par URL** vous permet de partager des plans et annotations sans serveur backend :

- ✅ **Sans backend** : Les données sont compressées dans le hash de l'URL, aucune dépendance serveur
- ✅ **Confidentialité garantie** : Les données ne sont pas uploadées, elles transitent uniquement entre vous et le collaborateur
- ✅ **Simple et efficace** : Génération d'URL en un clic, copier-coller pour partager
- ✅ **Mode lecture seule** : Le collaborateur peut consulter et ajouter des annotations, mais ne peut pas soumettre de décision

**Principes techniques** :
1. **Compression Deflate-raw** : Compresse les données JSON d'environ 60-80%
2. **Encodage Base64** : Convertit les données binaires en texte
3. **Remplacement des caractères URL-safe** : `+` → `-`, `/` → `_`, `=` → `''`
4. **Analyse du hash** : Le frontend décompresse et restaure automatiquement le contenu

**Options de configuration** :
- `PLANNOTATOR_SHARE=disabled` : Désactiver la fonctionnalité de partage
- Par défaut activé : La fonctionnalité de partage est disponible

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons l'**[Intégration Obsidian](../obsidian-integration/)**.
>
> Vous apprendrez :
> - Détection automatique des vaults Obsidian
> - Sauvegarder les plans approuvés dans Obsidian
> - Génération automatique du frontmatter et des tags
> - Combiner le partage par URL et la gestion des connaissances Obsidian

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons l'**[Intégration Obsidian](../obsidian-integration/)**.
>
> Vous apprendrez :
> - Comment configurer l'intégration Obsidian pour sauvegarder automatiquement les plans dans le vault
> - Comprendre le mécanisme de génération du frontmatter et des tags
> - Utiliser les backlinks pour construire un graphe de connaissances

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements dans le code source</strong></summary>

> Date de mise à jour : 2026-01-24

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Compression des données (deflate + Base64) | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L30-L48) | 30-48 |
| Décompression des données | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L53-L71) | 53-71 |
| Conversion du format d'annotation (compact) | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L76-L95) | 76-95 |
| Restauration du format d'annotation | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L102-L155) | 102-155 |
| Génération de l'URL de partage | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L162-L175) | 162-175 |
| Analyse du hash URL | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L181-L194) | 181-194 |
| Formatage de la taille URL | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L199-L205) | 199-205 |
| Hook de partage URL | [`packages/ui/hooks/useSharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/hooks/useSharing.ts#L45-L155) | 45-155 |
| Interface Export Modal | [`packages/ui/components/ExportModal.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ExportModal.tsx#L1-L196) | 1-196 |
| Configuration du partage (Hook) | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L44) | 44 |
| Configuration du partage (OpenCode) | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L50) | 50 |

**Constantes clés** :
- `SHARE_BASE_URL = 'https://share.plannotator.ai'` : Domaine de base de la page de partage

**Fonctions clés** :
- `compress(payload: SharePayload): Promise<string>` : Compresse le payload en chaîne base64url
- `decompress(b64: string): Promise<SharePayload>` : Décompresse la chaîne base64url en payload
- `toShareable(annotations: Annotation[]): ShareableAnnotation[]` : Convertit les annotations complètes en format compact
- `fromShareable(data: ShareableAnnotation[]): Annotation[]` : Restaure le format compact en annotations complètes
- `generateShareUrl(markdown, annotations, attachments): Promise<string>` : Génère l'URL de partage complète
- `parseShareHash(): Promise<SharePayload | null>` : Analyse le hash de l'URL actuelle

**Types de données** :
```typescript
interface SharePayload {
  p: string;  // plan markdown
  a: ShareableAnnotation[];
  g?: string[];  // global attachments
}

type ShareableAnnotation =
  | ['D', string, string | null, string[]?]  // Deletion
  | ['R', string, string, string | null, string[]?]  // Replacement
  | ['C', string, string, string | null, string[]?]  // Comment
  | ['I', string, string, string | null, string[]?]  // Insertion
  | ['G', string, string | null, string[]?];  // Global Comment
```

</details>

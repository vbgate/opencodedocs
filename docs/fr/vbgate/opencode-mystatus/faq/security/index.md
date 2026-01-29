---
title: "Sécurité: Protection des données | opencode-mystatus"
sidebarTitle: "Sécurité"
subtitle: "Sécurité et confidentialité : accès aux fichiers locaux, masquage de l'API, interfaces officielles"
description: "Découvrez les mécanismes de sécurité d'opencode-mystatus : lecture seule des fichiers, masquage des clés API, appels aux API officielles uniquement."
tags:
  - "sécurité"
  - "confidentialité"
  - "FAQ"
prerequisite: []
order: 2
---

# Sécurité et confidentialité : accès aux fichiers locaux, masquage de l'API, interfaces officielles

## Votre problème actuel

Lors de l'utilisation d'outils tiers, ce qui vous inquiète le plus ?

- "Va-t-il lire ma clé API ?"
- "Mes informations d'authentification seront-elles téléchargées sur un serveur ?"
- "Y a-t-il un risque de fuite de données ?"
- "Que se passe-t-il s'il modifie mes fichiers de configuration ?"

Ces préoccupations sont tout à fait raisonnables, surtout lors du traitement d'informations d'authentification sensibles de plateformes IA. Ce tutoriel expliquera en détail comment le plugin opencode-mystatus protège vos données et votre confidentialité par sa conception.

::: info Principe de priorité locale
opencode-mystatus suit le principe « lecture seule de fichiers locaux + requête directe vers l'API officielle », toutes les opérations sensibles sont effectuées sur votre machine, sans passer par aucun serveur tiers.
:::

## Concept clé

La conception de la sécurité du plugin repose sur trois principes fondamentaux :

1. **Principe de lecture seule** : Lit uniquement les fichiers d'authentification locaux, n'écrit ni ne modifie aucun contenu
2. **Interfaces officielles** : Appelle uniquement les API officielles de chaque plateforme, n'utilise aucun service tiers
3. **Masquage des données** : Masque automatiquement les informations sensibles lors de l'affichage (comme les clés API)

Ces trois principes se superposent pour garantir que vos données sont sécurisées de la lecture à l'affichage.

---

## Accès aux fichiers locaux (lecture seule)

### Quels fichiers le plugin lit-il

Le plugin lit uniquement deux fichiers de configuration locaux, et tous sont en **mode lecture seule** :

| Chemin du fichier | Utilisation | Emplacement du code source |
|--- | --- | ---|
| `~/.local/share/opencode/auth.json` | Stockage d'authentification officielle OpenCode | `mystatus.ts:35` |
| `~/.config/opencode/antigravity-accounts.json` | Stockage des comptes du plugin Antigravity | `google.ts` (logique de lecture) |

::: tip Pas de modification de fichiers
Dans le code source, seule la fonction `readFile` est utilisée pour lire les fichiers, aucune fonction `writeFile` ou autre opération de modification n'est utilisée. Cela signifie que le plugin ne remplacera pas accidentellement votre configuration.
:::

### Preuve du code source

```typescript
// mystatus.ts lignes 38-40
const content = await readFile(authPath, "utf-8");
authData = JSON.parse(content);
```

Ici, `fs/promises.readFile` de Node.js est utilisé, ce qui est une **opération en lecture seule**. Si le fichier n'existe pas ou si le format est incorrect, le plugin renverra un message d'erreur convivial, plutôt que de créer ou modifier le fichier.

---

## Masquage automatique de la clé API

### Qu'est-ce que le masquage

Le masquage (Masking) consiste à n'afficher qu'une partie des caractères lors de l'affichage d'informations sensibles, en masquant la partie critique.

Par exemple, votre clé API Zhipu AI pourrait être :
```
sk-9c89abc1234567890abcdefAQVM
```

Après masquage, elle s'affiche :
```
sk-9c8****fAQVM
```

### Règles de masquage

Le plugin utilise la fonction `maskString` pour traiter toutes les informations sensibles :

```typescript
// utils.ts lignes 130-135
export function maskString(str: string, showChars: number = 4): string {
  if (str.length <= showChars * 2) {
    return str;
  }
  return `${str.slice(0, showChars)}****${str.slice(-showChars)}`;
}
```

**Description des règles** :
- Par défaut, affiche les 4 premiers et 4 derniers caractères
- La partie centrale est remplacée par `****`
- Si la chaîne est trop courte (≤ 8 caractères), elle est renvoyée telle quelle

### Exemple d'utilisation réelle

Dans l'interrogation de quota Zhipu AI, la clé API masquée apparaîtra dans la sortie :

```typescript
// zhipu.ts ligne 124
const maskedKey = maskString(apiKey);
lines.push(`${t.account}        ${maskedKey} (${accountLabel})`);
```

Effet de sortie :
```
Account:        9c89****AQVM (Coding Plan)
```

::: tip Effet du masquage
Même si vous partagez une capture d'écran des résultats de l'interrogation avec d'autres, cela ne révélera pas votre vraie clé API. Seuls les « 4 premiers et 4 derniers » caractères sont visibles, la partie critique centrale a été masquée.
:::

---

## Appels aux interfaces officielles

### Quelles API le plugin appelle-t-il

Le plugin appelle uniquement les **API officielles** de chaque plateforme, sans passer par aucun serveur tiers :

| Plateforme | Point de terminaison API | Utilisation |
|--- | --- | ---|
| OpenAI | `https://chatgpt.com/backend-api/wham/usage` | Interrogation de quota |
| Zhipu AI | `https://bigmodel.cn/api/monitor/usage/quota/limit` | Interrogation de la limite de token |
| Z.ai | `https://api.z.ai/api/monitor/usage/quota/limit` | Interrogation de la limite de token |
| GitHub Copilot | `https://api.github.com/copilot_internal/user` | Interrogation de quota |
| GitHub Copilot | `https://api.github.com/users/{username}/settings/billing/premium_request/usage` | Interrogation d'API publique |
| Google Cloud | `https://oauth2.googleapis.com/token` | Rafraîchissement du jeton OAuth |
| Google Cloud | `https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels` | Interrogation du quota de modèle |

::: info Sécurité des API officielles
Ces points de terminaison API sont tous des interfaces officielles de chaque plateforme, utilisant la transmission cryptée HTTPS. Le plugin agit simplement comme un « client » envoyant des demandes, ne stockant ni ne transférant aucune donnée.
:::

### Protection contre le délai d'attente

Pour éviter que les demandes réseau ne bloquent, le plugin définit un délai de 10 secondes :

```typescript
// types.ts ligne 114
export const REQUEST_TIMEOUT_MS = 10000;

// utils.ts lignes 84-106
export async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number = REQUEST_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(t.timeoutError(Math.round(timeoutMs / 1000)));
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
```

**Rôle du mécanisme de délai** :
- Empêche les pannes réseau de faire attendre indéfiniment le plugin
- Protège vos ressources système contre l'occupation
- Annule automatiquement la demande après 10 secondes et renvoie un message d'erreur

---

## Résumé de la protection de la confidentialité

### Ce que le plugin ne fera pas

| Opération | Comportement du plugin |
|--- | ---|
| Stocker des données | ❌ Ne stocke aucune donnée utilisateur |
| Télécharger des données | ❌ Ne télécharge aucune donnée vers des serveurs tiers |
| Mettre en cache les résultats | ❌ Ne met en cache aucun résultat de requête |
| Modifier des fichiers | ❌ Ne modifie aucun fichier de configuration locale |
| Enregistrer des journaux | ❌ N'enregistre aucun journal d'utilisation |

### Ce que le plugin fera

| Opération | Comportement du plugin |
|--- | ---|
| Lire des fichiers | ✅ Lit uniquement les fichiers d'authentification locaux |
| Appeler des API | ✅ Appelle uniquement les points de terminaison API officiels |
| Affichage masqué | ✅ Masque automatiquement les informations sensibles telles que les clés API |
| Audit open source | ✅ Le code source est entièrement open source et peut être audité |

### Code source auditable

Tout le code du plugin est open source, vous pouvez :
- Consulter le dépôt source GitHub
- Vérifier chaque point de terminaison API appelé
- Confirmer s'il existe une logique de stockage de données
- Vérifier la méthode de mise en œuvre de la fonction de masquage

---

## Questions fréquemment posées

::: details Le plugin va-t-il voler ma clé API ?
Non. Le plugin utilise la clé API uniquement pour envoyer des demandes à l'API officielle, il ne la stocke ni ne la transfère vers des serveurs tiers. Tout le code est open source et peut être audité.
:::

::: details Pourquoi la clé API masquée s'affiche-t-elle ?
C'est pour protéger votre confidentialité. Même si vous partagez une capture d'écran des résultats de l'interrogation, cela ne révélera pas la clé API complète. Après masquage, seuls les 4 premiers et 4 derniers caractères sont affichés, la partie centrale a été masquée.
:::

::: details Le plugin va-t-il modifier mes fichiers de configuration ?
Non. Le plugin utilise uniquement `readFile` pour lire les fichiers, n'exécutant aucune opération d'écriture. Si le format de votre fichier de configuration est incorrect, le plugin renverra un message d'erreur plutôt que de tenter de le réparer ou de l'écraser.
:::

::: details Les résultats de l'interrogation seront-ils mis en cache dans le plugin ?
Non. Le plugin lit les fichiers et interroge l'API à chaque appel, ne mettant en cache aucun résultat. Toutes les données sont immédiatement supprimées après l'achèvement de l'interrogation.
:::

::: details Le plugin collecte-t-il des données d'utilisation ?
Non. Le plugin n'a aucune fonction de suivi ou de collecte de données, ne traquant pas votre comportement d'utilisation.
:::

---

## Résumé de cette leçon

- **Principe de lecture seule** : Le plugin lit uniquement les fichiers d'authentification locaux, ne modifiant aucun contenu
- **Masquage de l'API** : Masque automatiquement la partie critique des clés API lors de l'affichage
- **Interfaces officielles** : Appelle uniquement les API officielles de chaque plateforme, n'utilise aucun service tiers
- **Transparence open source** : Tout le code est open source et peut être audité pour vérifier les mécanismes de sécurité

## Prochaine leçon

> La prochaine leçon nous apprendrons **[Modèles de données : structure des fichiers d'authentification et format des réponses API](/fr/vbgate/opencode-mystatus/appendix/data-models/)**
>
> Vous apprendrez :
> - Structure complète de définition AuthData
> - Signification des champs des données d'authentification de chaque plateforme
> - Format des données des réponses API

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour afficher l'emplacement du code source</strong></summary>

> Date de mise à jour : 2026-01-23

| Fonction | Chemin du fichier | Ligne |
|--- | --- | ---|
| Lecture des fichiers d'authentification | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts#L38-L40) | 38-40 |
| Fonction de masquage de l'API | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L130-L135) | 130-135 |
| Configuration du délai de demande | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L114) | 114 |
| Implémentation du délai de demande | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L84-L106) | 84-106 |
| Exemple de masquage Zhipu AI | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L124) | 124 |

**Fonction clé** :
- `maskString(str, showChars = 4)` : Masque l'affichage des chaînes sensibles, affiche `showChars` caractères au début et à la fin, remplace le milieu par `****`

**Constante clé** :
- `REQUEST_TIMEOUT_MS = 10000` : Délai d'expiration de demande API (10 secondes)

</details>

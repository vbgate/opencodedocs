---
title: "Première Requête : Vérifier l'Installation d'Antigravity | opencode-antigravity-auth"
sidebarTitle: "Envoyer la Première Requête"
description: "Apprenez à envoyer votre première requête avec les modèles Antigravity, vérifiez l'authentification OAuth et la configuration. Maîtrisez la sélection des modèles, l'utilisation du paramètre variant et le dépannage des erreurs courantes."
subtitle: "Première Requête : Vérifier le Succès de l'Installation"
tags:
  - "Vérification d'Installation"
  - "Requête de Modèle"
  - "Démarrage Rapide"
prerequisite:
  - "start-quick-install"
order: 4
---

# Première Requête : Vérifier le Succès de l'Installation

## Ce Que Vous Allez Apprendre

- Envoyer votre première requête avec un modèle Antigravity
- Comprendre le rôle des paramètres `--model` et `--variant`
- Choisir le modèle et la configuration de réflexion adaptés à vos besoins
- Résoudre les erreurs courantes de requête de modèle

## Votre Situation Actuelle

Vous venez d'installer le plugin, de compléter l'authentification OAuth et de configurer les définitions de modèles, mais vous vous demandez :
- Le plugin fonctionne-t-il vraiment correctement ?
- Quel modèle utiliser pour commencer les tests ?
- Comment utiliser le paramètre `--variant` ?
- Si une requête échoue, comment identifier l'étape problématique ?

## Quand Utiliser Cette Méthode

Utilisez la méthode de vérification de ce cours dans les situations suivantes :
- **Après la première installation** — Confirmer que l'authentification, la configuration et les modèles fonctionnent correctement
- **Après l'ajout d'un nouveau compte** — Vérifier que le nouveau compte est utilisable
- **Après un changement de configuration de modèle** — Confirmer que la nouvelle configuration est correcte
- **Avant de rencontrer des problèmes** — Établir une référence pour faciliter les comparaisons ultérieures

## 🎒 Préparatifs Avant de Commencer

::: warning Vérifications Préliminaires

Avant de continuer, veuillez confirmer que :

- ✅ Vous avez complété l'[Installation Rapide](/fr/NoeFabris/opencode-antigravity-auth/start/quick-install/)
- ✅ Vous avez exécuté `opencode auth login` pour compléter l'authentification OAuth
- ✅ Les définitions de modèles ont été ajoutées dans `~/.config/opencode/opencode.json`
- ✅ Le terminal OpenCode ou le CLI est disponible

:::

## Concept Principal

### Pourquoi Vérifier d'Abord

Le plugin implique la collaboration de plusieurs composants :
1. **Authentification OAuth** — Obtention du jeton d'accès
2. **Gestion des comptes** — Sélection d'un compte disponible
3. **Transformation des requêtes** — Conversion du format OpenCode vers le format Antigravity
4. **Réponse en streaming** — Traitement de la réponse SSE et reconversion vers le format OpenCode

Envoyer une première requête permet de vérifier que toute la chaîne fonctionne. En cas de succès, tous les composants fonctionnent correctement ; en cas d'échec, le message d'erreur permet de localiser le problème.

### Relation entre Model et Variant

Dans le plugin Antigravity, **le modèle et le variant sont deux concepts indépendants** :

| Concept | Fonction | Exemple |
| --- | --- | --- |
| **Model (Modèle)** | Sélectionne le modèle IA spécifique | `antigravity-claude-sonnet-4-5-thinking` |
| **Variant (Variante)** | Configure le budget ou le mode de réflexion du modèle | `low` (réflexion légère), `max` (réflexion maximale) |

::: info Qu'est-ce que le Budget de Réflexion ?

Le budget de réflexion (thinking budget) désigne le nombre de tokens que le modèle peut utiliser pour "réfléchir" avant de générer une réponse. Un budget plus élevé signifie que le modèle a plus de temps pour raisonner, mais cela augmente également le temps de réponse et le coût.

- **Modèles Claude Thinking** : Configuré via `thinkingConfig.thinkingBudget` (unité : tokens)
- **Modèles Gemini 3** : Configuré via `thinkingLevel` (niveau en chaîne : minimal/low/medium/high)

:::

### Combinaisons Recommandées pour Débuter

Combinaisons recommandées de modèles et variants selon les besoins :

| Besoin | Modèle | Variant | Caractéristiques |
| --- | --- | --- | --- |
| **Test rapide** | `antigravity-gemini-3-flash` | `minimal` | Réponse la plus rapide, idéal pour la vérification |
| **Développement quotidien** | `antigravity-claude-sonnet-4-5-thinking` | `low` | Équilibre entre vitesse et qualité |
| **Raisonnement complexe** | `antigravity-claude-opus-4-5-thinking` | `max` | Capacité de raisonnement maximale |
| **Tâches visuelles** | `antigravity-gemini-3-pro` | `high` | Support multimodal (images/PDF) |

## Guide Étape par Étape

### Étape 1 : Envoyer la Requête de Test la Plus Simple

Commencez par la commande la plus simple pour tester si la connexion de base fonctionne.

**Pourquoi**
Cette requête n'utilise pas la fonctionnalité thinking, elle retourne très rapidement et est idéale pour vérifier rapidement l'authentification et l'état du compte.

**Exécuter la commande**

```bash
opencode run "Hello" --model=google/antigravity-claude-sonnet-4-5
```

**Vous devriez voir**

```
Hello! I'm Claude Sonnet 4.5, an AI assistant...
```

::: tip Indicateur de Succès

Si vous voyez une réponse de l'IA, cela signifie :
- ✅ Authentification OAuth réussie
- ✅ Le compte a les droits d'accès
- ✅ La transformation des requêtes fonctionne correctement
- ✅ La réponse en streaming est correctement analysée

:::

### Étape 2 : Utiliser un Modèle Thinking avec Variant

Testez maintenant le flux de réflexion complet, incluant le paramètre variant.

**Pourquoi**
Les modèles Thinking nécessitent une logique de transformation de requête supplémentaire, c'est l'une des fonctionnalités principales du plugin.

**Exécuter la commande**

```bash
opencode run "Explique ce qu'est une closure, avec une analogie simple" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=max
```

**Vous devriez voir**

1. **Sortie de réflexion en streaming** : Vous verrez d'abord le processus de réflexion du modèle (avec la balise `<thinking>`)
2. **Processus de réflexion** : Le modèle analyse en détail comment organiser sa réponse
3. **Réponse finale** : Une fois la réflexion terminée, le contenu final est affiché

::: details Voir un exemple de réponse complète

```
<thinking>
L'utilisateur demande ce qu'est une closure, il faut l'expliquer avec une analogie simple.

Le concept de closure :
1. Une fonction peut accéder aux variables de sa portée externe
2. Même après que la fonction externe a terminé son exécution
3. Cette capacité est comme un "sac à dos"

Idée d'analogie :
- On peut utiliser l'analogie du "sac à dos"
- La fonction emporte certaines variables quand elle est retournée
- Comme quand on sort de chez soi avec des affaires dans son sac
</thinking>

Une closure est comme un "sac à dos" pour une fonction.

Quand une fonction est créée, elle "emballe" les variables externes auxquelles elle peut accéder, comme quand on met dans son sac les affaires dont on aura besoin avant de sortir. Même si la fonction quitte l'endroit où elle a été créée (la fonction externe a terminé son exécution), elle peut toujours accéder à ces variables via ce "sac à dos".

Voici un exemple :
```javascript
function createCounter() {
  let count = 0;  // Cette variable est mise dans le "sac à dos"
  return function() {
    count++;  // On peut toujours accéder à la variable du sac
    return count;
  };
}
```
```

:::

**Point de Contrôle ✅**

- [ ] Vous avez vu le bloc `<thinking>` (si `keep_thinking: true` est configuré)
- [ ] Le contenu de la réponse est raisonnable et logique
- [ ] Le temps de réponse est acceptable (généralement 2-10 secondes)

### Étape 3 : Tester les Modèles Gemini 3

Testez les différents niveaux de réflexion de Gemini 3 Pro.

**Pourquoi**
Gemini 3 utilise un `thinkingLevel` sous forme de chaîne, cela vérifie le support des différentes familles de modèles.

**Exécuter les commandes**

```bash
# Tester Gemini 3 Flash (réponse rapide)
opencode run "Écris un tri à bulles" --model=google/antigravity-gemini-3-flash --variant=low

# Tester Gemini 3 Pro (réflexion approfondie)
opencode run "Analyse la complexité temporelle du tri à bulles" --model=google/antigravity-gemini-3-pro --variant=high
```

**Vous devriez voir**

- Le modèle Flash répond plus rapidement (adapté aux tâches simples)
- Le modèle Pro réfléchit plus en profondeur (adapté aux analyses complexes)
- Les deux modèles fonctionnent correctement

### Étape 4 : Tester les Capacités Multimodales (Optionnel)

Si votre configuration de modèle prend en charge l'entrée d'images, vous pouvez tester la fonctionnalité multimodale.

**Pourquoi**
Antigravity prend en charge l'entrée d'images/PDF, c'est une fonctionnalité nécessaire dans de nombreux scénarios.

**Préparez une image de test** : N'importe quel fichier image (par exemple `test.png`)

**Exécuter la commande**

```bash
opencode run "Décris le contenu de cette image" --model=google/antigravity-gemini-3-pro --image=test.png
```

**Vous devriez voir**

- Le modèle décrit précisément le contenu de l'image
- La réponse contient les résultats de l'analyse visuelle

## Point de Contrôle ✅

Après avoir complété les tests ci-dessus, confirmez la liste suivante :

| Élément à Vérifier | Résultat Attendu | Statut |
| --- | --- | --- |
| **Connexion de base** | La requête simple de l'étape 1 réussit | ☐ |
| **Modèle Thinking** | Vous voyez le processus de réflexion à l'étape 2 | ☐ |
| **Modèles Gemini 3** | Les deux modèles de l'étape 3 fonctionnent | ☐ |
| **Paramètre Variant** | Différents variants produisent différents résultats | ☐ |
| **Sortie en streaming** | La réponse s'affiche en temps réel, sans interruption | ☐ |

::: tip Tout est Validé ?

Si tous les éléments sont validés, félicitations ! Le plugin est entièrement configuré et prêt à être utilisé.

Prochaines étapes possibles :
- [Explorer les modèles disponibles](/fr/NoeFabris/opencode-antigravity-auth/platforms/available-models/)
- [Configurer la répartition de charge multi-comptes](/fr/NoeFabris/opencode-antigravity-auth/advanced/multi-account-setup/)
- [Activer Google Search](/fr/NoeFabris/opencode-antigravity-auth/platforms/google-search-grounding/)

:::

## Pièges Courants

### Erreur 1 : `Model not found`

**Message d'erreur**
```
Error: Model 'antigravity-claude-sonnet-4-5' not found
```

**Cause**
La définition du modèle n'a pas été correctement ajoutée dans `provider.google.models` de `opencode.json`.

**Solution**

Vérifiez le fichier de configuration :

```bash
cat ~/.config/opencode/opencode.json | grep -A 10 "models"
```

Confirmez que le format de définition du modèle est correct :

```json
{
  "provider": {
    "google": {
      "models": {
        "antigravity-claude-sonnet-4-5": {
          "name": "Claude Sonnet 4.5 (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        }
      }
    }
  }
}
```

::: warning Attention à l'Orthographe

Le nom du modèle doit correspondre exactement à la clé dans le fichier de configuration (sensible à la casse) :

- ❌ Incorrect : `--model=google/claude-sonnet-4-5`
- ✅ Correct : `--model=google/antigravity-claude-sonnet-4-5`

:::

### Erreur 2 : `403 Permission Denied`

**Message d'erreur**
```
403 Permission denied on resource '//cloudaicompanion.googleapis.com/...'
```

**Causes**
1. L'authentification OAuth n'est pas complète
2. Le compte n'a pas les droits d'accès
3. Problème de configuration du Project ID (pour les modèles Gemini CLI)

**Solution**

1. **Vérifier l'état de l'authentification** :
   ```bash
   cat ~/.config/opencode/antigravity-accounts.json
   ```

   Vous devriez voir au moins un enregistrement de compte.

2. **Si le compte est vide ou l'authentification a échoué** :
   ```bash
   rm ~/.config/opencode/antigravity-accounts.json
   opencode auth login
   ```

3. **Si l'erreur concerne un modèle Gemini CLI** :
   Vous devez configurer manuellement le Project ID (voir [FAQ - 403 Permission Denied](/fr/NoeFabris/opencode-antigravity-auth/faq/common-auth-issues/))

### Erreur 3 : `Invalid variant 'max'`

**Message d'erreur**
```
Error: Invalid variant 'max' for model 'antigravity-gemini-3-pro'
```

**Cause**
Les différents modèles prennent en charge des formats de configuration variant différents.

**Solution**

Vérifiez la définition des variants dans la configuration du modèle :

| Type de Modèle | Format du Variant | Exemple de Valeur |
| --- | --- | --- |
| **Claude Thinking** | `thinkingConfig.thinkingBudget` | `{ "thinkingConfig": { "thinkingBudget": 32768 } }` |
| **Gemini 3** | `thinkingLevel` | `{ "thinkingLevel": "high" }` |
| **Gemini 2.5** | `thinkingConfig.thinkingBudget` | `{ "thinkingConfig": { "thinkingBudget": 8192 } }` |

**Exemple de configuration correcte** :

```json
{
  "antigravity-claude-sonnet-4-5-thinking": {
    "name": "Claude Sonnet 4.5 Thinking",
    "variants": {
      "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
      "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
    }
  },
  "antigravity-gemini-3-pro": {
    "name": "Gemini 3 Pro",
    "variants": {
      "low": { "thinkingLevel": "low" },
      "high": { "thinkingLevel": "high" }
    }
  }
}
```

### Erreur 4 : Timeout ou Absence de Réponse

**Symptômes**
Après l'exécution de la commande, aucune sortie pendant longtemps, ou timeout final.

**Causes Possibles**
1. Problème de connexion réseau
2. Réponse lente du serveur
3. Tous les comptes sont en état de limitation de débit

**Solution**

1. **Vérifier la connexion réseau** :
   ```bash
   ping cloudaicompanion.googleapis.com
   ```

2. **Consulter les logs de débogage** :
   ```bash
   OPENCODE_ANTIGRAVITY_DEBUG=1 opencode run "test" --model=google/antigravity-claude-sonnet-4-5
   ```

3. **Vérifier l'état des comptes** :
   ```bash
   cat ~/.config/opencode/antigravity-accounts.json
   ```

   Si vous voyez que tous les comptes ont un timestamp `rateLimit`, ils sont tous limités et vous devez attendre la réinitialisation.

### Erreur 5 : Interruption du Flux SSE

**Symptômes**
La réponse s'arrête en cours de route, ou vous ne voyez qu'un contenu partiel.

**Causes Possibles**
1. Réseau instable
2. Le jeton du compte a expiré pendant la requête
3. Erreur serveur

**Solution**

1. **Activer les logs de débogage pour plus de détails** :
   ```bash
   OPENCODE_ANTIGRAVITY_DEBUG=2 opencode run "test"
   ```

2. **Consulter le fichier de log** :
   ```bash
   tail -f ~/.config/opencode/antigravity-logs/latest.log
   ```

3. **En cas d'interruptions fréquentes** :
   - Essayez de passer à un environnement réseau plus stable
   - Utilisez un modèle non-Thinking pour réduire le temps de requête
   - Vérifiez si le compte approche de sa limite de quota

## Résumé du Cours

Envoyer la première requête est une étape clé pour vérifier le succès de l'installation. Dans ce cours, vous avez appris :

- **Requête de base** : Utiliser `opencode run --model` pour envoyer des requêtes
- **Utilisation des Variants** : Configurer le budget de réflexion via `--variant`
- **Sélection de modèle** : Choisir entre les modèles Claude ou Gemini selon les besoins
- **Dépannage** : Localiser et résoudre les problèmes selon les messages d'erreur

::: tip Pratiques Recommandées

Dans le développement quotidien :

1. **Commencez par un test simple** : Après chaque changement de configuration, envoyez d'abord une requête simple pour vérifier
2. **Augmentez progressivement la complexité** : De sans thinking → low thinking → max thinking
3. **Notez les temps de réponse de référence** : Mémorisez les temps de réponse normaux pour faciliter les comparaisons
4. **Utilisez les logs de débogage** : En cas de problème, activez `OPENCODE_ANTIGRAVITY_DEBUG=2`

---

## Aperçu du Prochain Cours

> Dans le prochain cours, nous apprendrons **[Vue d'Ensemble des Modèles Disponibles](/fr/NoeFabris/opencode-antigravity-auth/platforms/available-models/)**.
>
> Vous apprendrez :
> - La liste complète de tous les modèles disponibles et leurs caractéristiques
> - Le guide de sélection entre les modèles Claude et Gemini
> - La comparaison des limites de contexte et de sortie
> - Les meilleurs cas d'utilisation des modèles Thinking

---

## Annexe : Références du Code Source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonctionnalité | Chemin du Fichier | Lignes |
| --- | --- | --- |
| Point d'entrée de transformation des requêtes | [`src/plugin/request.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request.ts) | 1-100 |
| Sélection de compte et gestion des jetons | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts) | 1-50 |
| Transformation des modèles Claude | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | Fichier complet |
| Transformation des modèles Gemini | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | Fichier complet |
| Traitement des réponses en streaming | [`src/plugin/core/streaming/index.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/core/streaming/index.ts) | Fichier complet |
| Système de logs de débogage | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts) | Fichier complet |

**Fonctions Clés** :
- `prepareAntigravityRequest()` : Convertit les requêtes OpenCode au format Antigravity (`request.ts`)
- `createStreamingTransformer()` : Crée le transformateur de réponses en streaming (`core/streaming/`)
- `resolveModelWithVariant()` : Résout la configuration du modèle et du variant (`transform/model-resolver.ts`)
- `getCurrentOrNextForFamily()` : Sélectionne le compte pour la requête (`accounts.ts`)

**Exemples de Configuration** :
- Format de configuration des modèles : [`README.md#models`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/README.md#L110)
- Documentation détaillée des variants : [`docs/MODEL-VARIANTS.md`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/docs/MODEL-VARIANTS.md)

</details>

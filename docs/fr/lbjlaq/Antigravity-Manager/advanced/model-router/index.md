---
title: "Routage de modèles : Mappage personnalisé | Antigravity-Manager"
sidebarTitle: "Routage de modèles personnalisé"
subtitle: "Routage de modèles : mappage personnalisé, priorité des caractères génériques et stratégies prédéfinies"
description: "Apprendre la configuration de routage de modèles d'Antigravity Tools. Implémenter le mappage de noms de modèles via custom_mapping, comprendre les règles de correspondance exacte et générique, utiliser les préréglages pour adapter OpenAI/Claude, et vérifier le routage via X-Mapped-Model."
tags:
  - "routage de modèles"
  - "custom_mapping"
  - "caractère générique"
  - "compatibilité OpenAI"
  - "compatibilité Claude"
prerequisite:
  - "start-proxy-and-first-client"
  - "platforms-openai"
order: 4
---
# Routage de modèles : mappage personnalisé, priorité des caractères génériques et stratégies prédéfinies

Le `model` que vous écrivez dans le client n'est pas nécessairement égal au "modèle physique" qu'Antigravity Tools utilise finalement pour demander l'amont. Ce que fait le **routage de modèles** est très simple : mapper le "nom de modèle stable en externe" en "modèle réellement utilisé en interne", et mettre le résultat dans l'en-tête de réponse `X-Mapped-Model`, facilitant ainsi la confirmation que le chemin attendu a été pris.

## Ce que vous pourrez faire après ce cours

- Configurer `proxy.custom_mapping` dans l'interface (mappage exact + mappage générique)
- Expliquer clairement comment une règle est matchée (exact > générique > mappage par défaut)
- Appliquer en un clic les règles prédéfinies, rapidement compatibles avec les clients OpenAI/Claude
- Utiliser `curl -i` pour vérifier `X-Mapped-Model`, localiser "pourquoi n'a-t-il pas pris le chemin que je voulais"

## Votre situation actuelle

- Vous voulez que le client écrive toujours `gpt-4o`, mais l'amont doit tomber de manière stable sur un modèle Gemini
- Vous avez une pile de noms de modèles versionnés (par exemple `gpt-4-xxxx`), ne voulez pas ajouter manuellement le mappage à chaque fois
- Vous voyez la requête réussir, mais n'êtes pas sûr quel modèle physique est vraiment utilisé

## Quand utiliser cette méthode

- Vous voulez fournir à l'équipe un "ensemble de modèles externe fixe", masquant les changements de modèles amont
- Vous voulez router plusieurs noms de modèles OpenAI/Claude vers quelques modèles de haute rentabilité
- Vous dépannez 401/429/0 token, devez confirmer le modèle réel après mappage

## 🎒 Préparation avant de commencer

- Vous avez déjà pu démarrer le reverse proxy local, et pouvez faire passer des requêtes externes (recommandé d'abord compléter [Démarrer le reverse proxy local et intégrer le premier client (/healthz + config SDK)](/fr/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/))
- Vous savez comment utiliser `curl -i` pour voir les en-têtes de réponse (utilisé `X-Mapped-Model` dans le cours précédent)

::: info Deux mots-clés dans ce cours
- **`custom_mapping`** : votre "table de règles personnalisées", la clé est le nom du modèle entré par le client (ou pattern générique), la valeur est le nom du modèle finalement utilisé (source : `src/types/config.ts`).
- **Caractère générique `*`** : utilisé pour correspondre en masse aux noms de modèles (par exemple `gpt-4*`), la correspondance implémentation est **sensible à la casse** (source : `src-tauri/src/proxy/common/model_mapping.rs`).
:::

## Idée centrale

Au traitement de la requête, le backend calcule d'abord un `mapped_model` :

1. D'abord vérifier si `custom_mapping` a une **correspondance exacte** (la clé est exactement égale à `model`)
2. Ensuite essayer correspondance générique : choisir la règle avec "plus de caractères non `*`" (règle plus spécifique prioritaire)
3. Aucune correspondance, puis prendre mappage par défaut système (par exemple certains alias de modèles OpenAI/Claude vers modèles internes)

Ce `mapped_model` sera écrit dans l'en-tête de réponse `X-Mapped-Model` (au moins le handler OpenAI le fera), vous pouvez l'utiliser pour confirmer "mon model s'est finalement transformé en quoi".

::: tip Sémantique de mise à jour à chaud (pas besoin de redémarrer)
Lorsque le service reverse proxy est en cours d'exécution, l'appel frontend `update_model_mapping` fait immédiatement écrire `custom_mapping` dans la mémoire `RwLock` du backend, et sauvegarde aussi dans la configuration persistante (source : `src-tauri/src/commands/proxy.rs` ; `src-tauri/src/proxy/server.rs`).
:::

## Suivez-moi

### Étape 1 : Trouver la carte "Routage de modèles" dans la page API Proxy

**Pourquoi**
L'entrée de configuration du routage de modèles est dans l'interface ; vous n'avez pas besoin d'éditer manuellement le fichier de configuration.

Ouvrez Antigravity Tools -> page `API Proxy`, faites défiler vers le bas.

**Ce que vous devriez voir** : une carte avec un titre similaire à "Centre de routage de modèles", en haut à droite deux boutons : "Appliquer mappage prédéfini" et "Réinitialiser mappage" (source : `src/pages/ApiProxy.tsx`).

### Étape 2 : Ajouter un "mappage exact" (le plus contrôlable)

**Pourquoi**
Le mappage exact a la priorité la plus haute, convient pour "je veux juste ce nom de modèle tomber sur ce modèle physique".

Dans la zone "Ajouter mappage" :

- Original : mettez le nom de modèle que vous voulez exposer en externe, par exemple `gpt-4o`
- Target : dans le déroulant choisissez un modèle cible, par exemple `gemini-3-flash`

Cliquez Add.

**Ce que vous devriez voir** : la liste de mappage apparaît `gpt-4o -> gemini-3-flash`, et une notification de sauvegarde réussie apparaît.

### Étape 3 : Ajouter un "mappage générique" (couverture en masse)

**Pourquoi**
Quand vous avez une pile de noms de modèles versionnés (par exemple `gpt-4-turbo`, `gpt-4-1106-preview`), utiliser les caractères génériques économise beaucoup de configuration répétitive.

Ajoutez encore un mappage :

- Original : `gpt-4*`
- Target : `gemini-3-pro-high`

**Ce que vous devriez voir** : la liste apparaît `gpt-4* -> gemini-3-pro-high`.

::: warning Le "piège" de priorité de règles
Quand `gpt-4o` satisfait à la fois la règle exacte `gpt-4o` et la règle générique `gpt-4*`, le backend prendra d'abord la correspondance exacte (source : `src-tauri/src/proxy/common/model_mapping.rs`).
:::

### Étape 4 : Appliquer en un clic les règles prédéfinies (compatibilité rapide)

**Pourquoi**
Si votre objectif principal est "adapter rapidement les noms de modèles OpenAI/Claude courants", les préréglages peuvent vous aider à remplir directement une série de règles génériques.

Cliquez "Appliquer mappage prédéfini".

**Ce que vous devriez voir** : la liste ajoute plusieurs règles, incluant quelque chose comme ci-dessous (source : `src/pages/ApiProxy.tsx`) :

```json
{
  "gpt-4*": "gemini-3-pro-high",
  "gpt-4o*": "gemini-3-flash",
  "gpt-3.5*": "gemini-2.5-flash",
  "o1-*": "gemini-3-pro-high",
  "o3-*": "gemini-3-pro-high",
  "claude-3-5-sonnet-*": "claude-sonnet-4-5",
  "claude-3-opus-*": "claude-opus-4-5-thinking",
  "claude-opus-4-*": "claude-opus-4-5-thinking",
  "claude-haiku-*": "gemini-2.5-flash",
  "claude-3-haiku-*": "gemini-2.5-flash"
}
```

### Étape 5 : Utiliser `X-Mapped-Model` pour vérifier si le routage est effectif

**Pourquoi**
Vous voulez confirmer "la configuration est bien entrée", et surtout "la requête a vraiment pris cette règle". La méthode la plus simple est de regarder `X-Mapped-Model`.

::: code-group

```bash [macOS/Linux]
curl -i http://127.0.0.1:8045/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "hi"}]
  }'
```

```powershell [Windows]
$resp = Invoke-WebRequest "http://127.0.0.1:8045/v1/chat/completions" -Method Post -ContentType "application/json" -Body '{
  "model": "gpt-4o",
  "messages": [{"role": "user", "content": "hi"}]
}'
$resp.Headers["X-Mapped-Model"]
```

:::

**Ce que vous devriez voir** : l'en-tête de réponse a `X-Mapped-Model: ...`. Si à l'étape 2 vous avez mappé exactement `gpt-4o` vers `gemini-3-flash`, vous devriez voir la valeur correspondante ici (écriture de l'en-tête de réponse voir `src-tauri/src/proxy/handlers/openai.rs`).

### Étape 6 : Besoin de revenir à "mappage par défaut pur", réinitialiser custom_mapping

**Pourquoi**
En dépannage, vous espérez souvent d'abord éliminer "l'impact des règles personnalisées". Vider `custom_mapping` est le moyen de repli le plus direct.

Cliquez "Réinitialiser mappage".

**Ce que vous devriez voir** : la liste de mappage est vidée ; après, lors des requêtes, si aucune règle personnalisée n'est matchée, le mappage par défaut système sera utilisé (source : `src/pages/ApiProxy.tsx` ; `src-tauri/src/proxy/common/model_mapping.rs`).

## Point de vérification ✅

- [ ] Vous pouvez ajouter/supprimer des règles `custom_mapping` dans l'interface
- [ ] Vous pouvez expliquer clairement : pourquoi la règle exacte l'emporte sur la règle générique
- [ ] Vous pouvez utiliser `curl -i` ou PowerShell pour lire `X-Mapped-Model`

## Attention aux pièges courants

| Scénario | Ce que vous pourriez faire (❌) | Approche recommandée (✓) |
|--- | --- | ---|
| Caractère générique inefficace | Avoir écrit `GPT-4*` espérant correspondre à `gpt-4-turbo` | Utiliser minuscules `gpt-4*` ; la correspondance de caractères génériques backend est sensible à la casse |
| Deux caractères génériques peuvent correspondre | Avoir écrit simultanément `gpt-*` et `gpt-4*`, incertain lequel prendra | Rendre la règle plus spécifique plus "longue", assurer qu'elle a plus de caractères non `*` |
| Règle semble correcte mais toujours inchangée | Ne regarder que le corps de réponse, pas l'en-tête de réponse | Utiliser `curl -i` pour confirmer `X-Mapped-Model` (c'est le résultat explicitement renvoyé par le backend) |
| Deux règles "aussi spécifiques" | Avoir écrit deux caractères génériques, nombre de caractères non `*` identique | Éviter cette configuration ; le commentaire source explique que dans ce cas le résultat dépend de l'ordre de traversée `HashMap`, peut être instable (source : `src-tauri/src/proxy/common/model_mapping.rs`) |

## Résumé du cours

- `proxy.custom_mapping` est l'entrée principale pour contrôler "nom de modèle externe -> modèle physique"
- La priorité de routage backend est : correspondance exacte > correspondance générique (plus spécifique prioritaire) > mappage par défaut système
- `X-Mapped-Model` est le moyen de vérification le plus fiable, en dépannage priorité à le regarder

## Aperçu du prochain cours

> Le prochain cours continuera avec **Gouvernance de quota : combinaison Quota Protection + Smart Warmup** (chapitre correspondant : `advanced-quota`).

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-23

| Fonction | Chemin du fichier | Ligne |
|--- | --- | ---|
| Champ configuration : `proxy.custom_mapping` (type frontend) | [`src/types/config.ts`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/types/config.ts#L6-L20) | 6-20 |
| Interface : écriture/réinitialisation/préréglage (appel `update_model_mapping`) | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L371-L475) | 371-475 |
| Interface : carte routage de modèles (appliquer mappage prédéfini / réinitialiser mappage / liste et formulaire ajout) | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L1762-L1931) | 1762-1931 |
| Commande backend : mise à jour à chaud et persistance `custom_mapping` | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L344-L365) | 344-365 |
| État serveur : `custom_mapping` sauvegardé avec `RwLock<HashMap<..>>` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L16-L53) | 16-53 |
| Algorithme de routage : exact > générique (plus spécifique prioritaire) > mappage par défaut | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L180-L228) | 180-228 |
| Correspondance générique : supporte plusieurs `*`, et sensible à la casse | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L134-L178) | 134-178 |
| Calcul de `mapped_model` dans la requête (exemple : handler OpenAI) | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L154-L159) | 154-159 |
|--- | --- | ---|

**Fonctions clés** :
- `resolve_model_route(original_model, custom_mapping)` : entrée principale routage de modèles (voir `src-tauri/src/proxy/common/model_mapping.rs`)

</details>

---
title: "Compression de contexte : Stabiliser les sessions longues | Antigravity-Manager"
sidebarTitle: "Sessions longues ne s'effondrent pas"
subtitle: "Compression de contexte : Stabiliser les sessions longues"
description: "Apprenez le mécanisme de compression de contexte à trois couches d'Antigravity. Réduisez les erreurs 400 et les échecs de Prompt trop long par le rognage des outils, la compression Thinking et le cache de signatures."
tags:
  - "Compression de contexte"
  - "Cache de signatures"
  - "Thinking"
  - "Résultat d'outil"
  - "Stabilité"
prerequisite:
  - "start-proxy-and-first-client"
  - "advanced-monitoring"
order: 8
---

# Stabilité des sessions longues : Compression de contexte, cache de signatures et compression des résultats d'outils

Lorsque vous utilisez des clients comme Claude Code / Cherry Studio pour des sessions longues, ce qui vous énerve le plus n'est pas que le modèle n'est pas assez intelligent, mais que la conversation commence soudainement à signaler des erreurs : `Prompt is too long`, erreur de signature 400, chaîne d'appels d'outils interrompue, ou boucles d'outils de plus en plus lentes.

Ce cours explique clairement les trois choses qu'Antigravity Tools fait pour ces problèmes : compression de contexte (intervention progressive en trois couches), cache de signatures (relier la chaîne de signatures de Thinking), compression des résultats d'outils (éviter que les résultats d'outils n'explosent le contexte).

## Ce que vous pourrez faire après ce cours

- Expliquer clairement ce que fait la compression de contexte progressive à trois couches et quels sont les coûts de chacune
- Savoir ce que stocke le cache de signatures (trois couches Tool/Family/Session) et l'impact du TTL de 2 heures
- Comprendre les règles de compression des résultats d'outils : quand supprimer les images base64, quand convertir les instantanés du navigateur en résumé tête+queue
- Au besoin, ajuster le moment du déclenchement de la compression via les seuils de `proxy.experimental`

## Votre problème actuel

- Après de longues conversations, 400 commencent soudainement : cela ressemble à une signature expirée, mais vous ne savez pas d'où vient la signature ni où elle a été perdue
- Les appels d'outils sont de plus en plus nombreux, l'historique tool_result s'accumule et est rejeté directement par l'amont (ou devient extrêmement lent)
- Vous voulez utiliser la compression pour sauver la situation, mais craignez de briser le Prompt Cache, d'affecter la cohérence ou de faire perdre des informations au modèle

## Quand utiliser cette méthode

- Vous exécutez des tâches d'outils à longue chaîne (recherche/lecture de fichiers/instantanés de navigateur/boucles d'outils multiples)
- Vous utilisez des modèles Thinking pour un raisonnement complexe et les sessions dépassent souvent des dizaines de tours
- Vous dépannez des problèmes de stabilité reproductibles par le client mais que vous ne pouvez pas expliquer clairement

## Qu'est-ce que la compression de contexte

La **compression de contexte** est la réduction de bruit et l'affinage automatique des messages historiques effectués par le proxy lorsque la pression de contexte est détectée comme trop élevée : rogner d'abord les anciens tours d'outils, puis compresser l'ancien texte Thinking en espace réservé mais conserver la signature, et enfin en cas extrême générer un résumé XML et Fork une nouvelle session pour continuer la conversation, réduisant ainsi les échecs causés par `Prompt is too long` et les ruptures de chaîne de signatures.

::: info Comment est calculée la pression de contexte ?
Le processeur Claude utilise `ContextManager::estimate_token_usage()` pour une estimation légère, la calibre avec `estimation_calibrator`, puis obtient le pourcentage de pression avec `usage_ratio = estimated_usage / context_limit` (les journaux affichent les valeurs raw/calibrated).
:::

## 🎒 Préparatifs avant de commencer

- Vous avez déjà exécuté le proxy local et le client suit effectivement la route `/v1/messages` (voir Démarrer le proxy inverse local et connecter le premier client)
- Vous pouvez afficher les journaux du proxy (débogage du développeur ou fichier de journaux local). Le plan de test du référentiel donne un exemple de chemin de journal et de méthode grep (voir `docs/testing/context_compression_test_plan.md`)

::: tip Combiner avec Proxy Monitor pour mieux localiser
Si vous voulez faire correspondre le déclenchement de la compression à quel type de demande/quel compte/quel tour d'appel d'outil, il est recommandé d'ouvrir Proxy Monitor en même temps.
:::

## Idée centrale

Cette conception de stabilité ne supprime pas directement tout l'historique, mais intervient couche par couche du coût le plus faible au plus élevé :

| Couche | Point de déclenchement (configurable) | Ce qu'il fait | Coût/effets secondaires |
|--- | --- | --- | ---|
| Couche 1 | `proxy.experimental.context_compression_threshold_l1` (par défaut 0,4) | Identifier les tours d'outils, ne conserver que les N tours récents (5 dans le code), supprimer les paires tool_use/tool_result de tours antérieurs | Ne modifie pas le contenu des messages restants, plus amical pour Prompt Cache |
| Couche 2 | `proxy.experimental.context_compression_threshold_l2` (par défaut 0,55) | Compresser l'ancien texte Thinking en `"..."`, mais conserver `signature`, et protéger les 4 derniers messages inchangés | Modifie le contenu historique, les commentaires indiquent clairement que cela break cache, mais peut préserver la chaîne de signatures |
| Couche 3 | `proxy.experimental.context_compression_threshold_l3` (par défaut 0,7) | Appeler le modèle en arrière-plan pour générer un résumé XML, puis Fork une nouvelle séquence de messages pour continuer la conversation | Dépend de l'appel de modèle en arrière-plan ; en cas d'échec, renvoie 400 (avec message convivial) |

Ensuite, expliquons les trois couches séparément, en mettant le cache de signatures et la compression des résultats d'outils ensemble.

### Couche 1 : Rogner les messages d'outils (Trim Tool Messages)

Le point clé de la Couche 1 est de supprimer uniquement les interactions d'outils entières, évitant les suppressions partielles qui entraînent une incohérence de contexte.

- La règle d'identification d'une interaction d'outils se trouve dans `identify_tool_rounds()` : `tool_use` apparaît dans `assistant` commence un tour, `tool_result` apparaît ensuite dans `user` est toujours considéré comme ce tour, jusqu'à ce qu'un texte user normal apparaisse pour terminer ce tour.
- La suppression réelle est effectuée par `ContextManager::trim_tool_messages(&mut messages, 5)` : lorsque les tours d'outils historiques dépassent 5 tours, les messages impliqués dans les tours antérieurs sont supprimés.

### Couche 2 : Compression Thinking mais conservation des signatures

Beaucoup de problèmes 400 ne sont pas dus à un Thinking trop long, mais à une chaîne de signatures Thinking interrompue. La stratégie de la Couche 2 est :

- Traite uniquement `ContentBlock::Thinking { thinking, signature, .. }` dans les messages `assistant`
- Compresse en remplaçant `thinking` directement par `"..."` uniquement lorsque `signature.is_some()` et `thinking.len() > 10`
- Les derniers `protected_last_n = 4` messages ne sont pas compressés (environ les 2 derniers tours user/assistant)

Cela permet d'économiser beaucoup de Token, tout en laissant `signature` dans l'historique, évitant que la chaîne d'outils ne puisse être restaurée lorsqu'elle doit être remplie.

### Couche 3 : Fork + Résumé XML (filet de sécurité ultime)

Lorsque la pression continue d'augmenter, le processeur Claude essaiera de rouvrir la session sans perdre d'informations clés :

1. Extraire de la dernière signature Thinking valide des messages originaux (`ContextManager::extract_last_valid_signature()`)
2. Assembler tout l'historique + `CONTEXT_SUMMARY_PROMPT` en une demande de génération de résumé XML, le modèle est fixé à `BACKGROUND_MODEL_LITE` (le code actuel est `gemini-2.5-flash`)
3. Le résumé exige d'inclure `<latest_thinking_signature>`, utilisé pour la continuation de la chaîne de signatures
4. Fork une nouvelle séquence de messages :
   - `User: Context has been compressed... + XML summary`
   - `Assistant: I have reviewed...`
   - Attachez ensuite le dernier message user de la demande originale (s'il n'est pas l'instruction de résumé)

Si Fork + résumé échoue, renvoie directement `StatusCode::BAD_REQUEST` et vous suggère de traiter manuellement avec `/compact` ou `/clear` (voir l'erreur JSON renvoyée par le processeur).

### Déviation 1 : Cache de signatures à trois couches (Tool / Family / Session)

Le cache de signatures est le fusible de la compression de contexte, surtout lorsque le client rognera/supprimera les champs de signature.

- TTL : `SIGNATURE_TTL = 2 * 60 * 60` (2 heures)
- Couche 1 : `tool_use_id -> signature` (récupération de chaîne d'outils)
- Couche 2 : `signature -> model family` (vérification de compatibilité inter-modèles, évitant que les signatures Claude ne soient portées sur des modèles de famille Gemini)
- Couche 3 : `session_id -> latest signature` (isolation de niveau session, évitant que différentes conversations ne se polluent)

Ces trois couches de cache seront écrites/lues lors de l'analyse de flux SSE Claude et de la conversion de demandes :

- L'analyse de flux jusqu'à la `signature` de thinking écrit dans le Cache de Session (ainsi que le cache de famille)
- L'analyse de flux jusqu'à la `signature` de tool_use écrit dans le Cache d'Outil + Cache de Session
- Lors de la conversion des appels d'outils Claude en `functionCall` Gemini, essayez d'abord de restaurer les signatures depuis le Cache de Session ou le Cache d'Outil

### Déviation 2 : Compression des résultats d'outils (Tool Result Compressor)

Les résultats d'outils sont plus susceptibles d'exploser le contexte que le texte de chat, donc la phase de conversion de demandes effectuera des suppressions prévisibles sur tool_result.

Règles principales (toutes dans `tool_result_compressor.rs`) :

- Limite totale de caractères : `MAX_TOOL_RESULT_CHARS = 200_000`
- Les blocs d'images base64 sont directement supprimés (ajout d'un texte d'invite)
- Si une invite indiquant que la sortie a été enregistrée dans un fichier est détectée, les informations clés sont extraites et un espace réservé `[tool_result omitted ...]` est utilisé
- Si un instantané de navigateur est détecté (contenant `page snapshot` / `ref=` et autres caractéristiques), il est converti en résumé tête+queue, notant combien de caractères ont été omis
- Si l'entrée ressemble à du HTML, supprimez d'abord les fragments `<style>`/`<script>`/base64 avant la troncature

## Suivez le guide

### Étape 1 : Confirmez les seuils de compression (et les valeurs par défaut)

**Pourquoi**
Les points de déclenchement de compression ne sont pas codés en dur, proviennent de `proxy.experimental.*`. Vous devez d'abord connaître les seuils actuels pour juger pourquoi il intervient si tôt/si tard.

Valeurs par défaut (côté Rust `ExperimentalConfig::default()`) :

```json
{
  "proxy": {
    "experimental": {
      "enable_signature_cache": true,
      "enable_tool_loop_recovery": true,
      "enable_cross_model_checks": true,
      "enable_usage_scaling": true,
      "context_compression_threshold_l1": 0.4,
      "context_compression_threshold_l2": 0.55,
      "context_compression_threshold_l3": 0.7
    }
  }
}
```

**Vous devriez voir** : Votre configuration contient `proxy.experimental` (noms de champs cohérents avec ci-dessus), et les seuils sont des valeurs de ratio comme `0.x`.

::: warning L'emplacement du fichier de configuration n'est pas répété dans ce cours
L'emplacement de persistance du fichier de configuration et s'il nécessite un redémarrage après modification appartiennent à la gestion de la configuration. Selon le système de tutoriels, priorité à Configuration complète : AppConfig/ProxyConfig, emplacement de persistance et sémantique de mise à jour à chaud.
:::

### Étape 2 : Utilisez les journaux pour confirmer si Couche 1/2/3 est déclenchée

**Pourquoi**
Ces trois couches sont des comportements internes du proxy, la méthode de vérification la plus fiable est de voir si `[Layer-1]` / `[Layer-2]` / `[Layer-3]` apparaît dans les journaux.

Le plan de test du référentiel donne un exemple de commande (ajustez selon le chemin de journal réel sur votre machine) :

```bash
tail -f ~/Library/Application\ Support/com.antigravity.tools/logs/antigravity.log | grep -E "Layer-[123]"
```

**Vous devriez voir** : Lorsque la pression augmente, les journaux affichent des enregistrements similaires à `Tool trimming triggered`, `Thinking compression triggered`, `Fork successful` (les champs spécifiques sont basés sur le texte original du journal).

### Étape 3 : Comprenez la différence entre purification et compression (ne confondez pas les attentes)

**Pourquoi**
Certains problèmes (comme la dégradation forcée vers des modèles ne prenant pas en charge Thinking) nécessitent une purification plutôt qu'une compression. La purification supprime directement les blocs Thinking ; la compression conserve la chaîne de signatures.

Dans le processeur Claude, la dégradation des tâches en arrière-plan suit `ContextManager::purify_history(..., PurificationStrategy::Aggressive)`, qui supprime directement les blocs Thinking historiques.

**Vous devriez voir** : Vous pouvez distinguer deux types de comportements :

- La purification supprime les blocs Thinking
- La compression de Couche 2 remplace l'ancien texte Thinking par `"..."`, mais la signature reste

### Étape 4 : Lorsque vous rencontrez une erreur de signature 400, vérifiez d'abord si le Cache de Session est atteint

**Pourquoi**
La cause racine de beaucoup de 400 n'est pas l'absence de signature, mais que la signature ne suit pas le message. Lors de la conversion de demandes, la signature est d'abord restaurée depuis le Cache de Session.

Indices (les journaux de phase de conversion de demandes indiqueront la restauration de signature depuis le cache SESSION/TOOL) :

- `[Claude-Request] Recovered signature from SESSION cache ...`
- `[Claude-Request] Recovered signature from TOOL cache ...`

**Vous devriez voir** : Lorsque le client perd la signature mais le cache proxy existe toujours, les journaux affichent des enregistrements Recovered signature from ... cache.

### Étape 5 : Comprenez ce que la compression des résultats d'outils peut perdre

**Pourquoi**
Si vous laissez les outils insérer de gros morceaux de HTML / instantanés de navigateur / images base64 dans la conversation, le proxy les supprimera activement. Vous devez savoir à l'avance quels contenus seront remplacés par des espaces réservés, éviter de penser à tort que le modèle ne les a pas vus.

Mémorisez trois points principaux :

1. Les images base64 seront supprimées (remplacées par un texte d'invite)
2. Les instantanés de navigateur deviennent un résumé head/tail (avec nombre de caractères omis)
3. Plus de 200 000 caractères seront tronqués et l'invite `...[truncated ...]` sera ajoutée

**Vous devriez voir** : Dans `tool_result_compressor.rs`, ces règles ont des constantes et des branches claires, pas supprimé par expérience.

## Point de contrôle

- Vous pouvez dire clairement que les points de déclenchement L1/L2/L3 proviennent de `proxy.experimental.context_compression_threshold_*`, par défaut `0.4/0.55/0.7`
- Vous pouvez expliquer pourquoi la Couche 2 break cache : parce qu'elle modifie le contenu du texte thinking historique
- Vous pouvez expliquer pourquoi la Couche 3 s'appelle Fork : elle transforme la conversation en une nouvelle séquence de résumé XML + confirmation + dernier message user
- Vous pouvez expliquer que la compression des résultats d'outils supprime les images base64, et convertit les instantanés de navigateur en résumé head/tail

## Rappels sur les pièges

| Phénomène | Cause possible | Ce que vous pouvez faire |
|--- | --- | ---|
| Après le déclenchement de la Couche 2, le contexte semble moins stable | La Couche 2 modifie le contenu historique, les commentaires indiquent clairement qu'elle break cache | Si vous dépendez de la cohérence de Prompt Cache, essayez de laisser la Couche 1 résoudre le problème d'abord, ou augmentez le seuil L2 |
| Après le déclenchement de la Couche 3, 400 est renvoyé directement | Échec de l'appel de modèle en arrière-plan Fork + résumé (réseau/compte/erreur amont, etc.) | Suivez d'abord la suggestion dans l'erreur JSON avec `/compact` ou `/clear` ; vérifiez également la chaîne d'appel de modèle en arrière-plan |
| Images/gros contenus dans la sortie d'outil ont disparu | tool_result supprime les images base64, tronque les sorties trop longues | Faites atterrir les contenus importants dans des fichiers locaux/liens puis référencez-les ; ne comptez pas insérer directement 100 000 lignes de texte dans la conversation |
| Utiliser explicitement le modèle Gemini mais porte la signature Claude provoquant une erreur | Signature incompatible inter-modèles (il y a une vérification de famille dans le code) | Confirmez la source de la signature ; si nécessaire, laissez le proxy séparer les signatures historiques dans les scénarios de réessai (voir la logique de conversion de demandes) |

## Résumé du cours

- Le cœur de la compression à trois couches est la gradation par coût : d'abord supprimer les anciens tours d'outils, puis compresser l'ancien Thinking, et enfin Fork + résumé XML
- Le cache de signatures est la clé pour garder la chaîne d'outils ininterrompue : trois couches Session/Tool/Family gèrent chacune un type de problème, TTL est 2 heures
- La compression des résultats d'outils est la limite stricte pour éviter que les résultats d'outils n'explosent le contexte : limite supérieure de 200 000 caractères + spécialisation pour les instantanés/grands fichiers

## Aperçu du prochain cours

> Dans le prochain cours, nous parlerons des capacités du système : multilingue/thème/mises à jour/démarrage automatique/serveur API HTTP.

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer et voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonction | Chemin du fichier | Numéro de ligne |
|--- | --- | ---|
| Configuration expérimentale : seuils de compression et valeurs par défaut des commutateurs | `src-tauri/src/proxy/config.rs` | 119-168 |
| Estimation de contexte : estimation de caractères multilingues + 15% de marge | `src-tauri/src/proxy/mappers/context_manager.rs` | 9-37 |
| Estimation de l'utilisation de Token : parcourir system/messages/tools/thinking | `src-tauri/src/proxy/mappers/context_manager.rs` | 103-198 |
| Couche 1 : identifier les tours d'outils + rogner les anciens tours | `src-tauri/src/proxy/mappers/context_manager.rs` | 311-439 |
| Couche 2 : compression Thinking mais conservation des signatures (protéger les N derniers) | `src-tauri/src/proxy/mappers/context_manager.rs` | 200-271 |
| Auxiliaire Couche 3 : extraire la dernière signature valide | `src-tauri/src/proxy/mappers/context_manager.rs` | 73-109 |
|--- | --- | ---|
| Flux principal de compression à trois couches : estimation, calibration, déclenchement L1/L2/L3 par seuils | `src-tauri/src/proxy/handlers/claude.rs` | 379-731 |
| Couche 3 : implémentation résumé XML + Fork session | `src-tauri/src/proxy/handlers/claude.rs` | 1560-1687 |
| Cache de signatures : TTL/structure de cache à trois couches (Tool/Family/Session) | `src-tauri/src/proxy/signature_cache.rs` | 5-88 |
| Cache de signatures : écriture/lecture de signature de Session | `src-tauri/src/proxy/signature_cache.rs` | 141-223 |
| Analyse de flux SSE : cache de signature thinking/tool vers Session/Tool cache | `src-tauri/src/proxy/mappers/claude/streaming.rs` | 766-776 |
|--- | --- | ---|
| Conversion de demandes : tool_use priorise la restauration de signature depuis Session/Tool cache | `src-tauri/src/proxy/mappers/claude/request.rs` | 1045-1142 |
| Conversion de demandes : tool_result déclenche la compression des résultats d'outils | `src-tauri/src/proxy/mappers/claude/request.rs` | 1159-1225 |
| Compression des résultats d'outils : entrée `compact_tool_result_text()` | `src-tauri/src/proxy/mappers/tool_result_compressor.rs` | 28-69 |
| Compression des résultats d'outils : résumé head/tail instantané navigateur | `src-tauri/src/proxy/mappers/tool_result_compressor.rs` | 123-178 |
| Compression des résultats d'outils : supprimer les images base64 + limite totale de caractères | `src-tauri/src/proxy/mappers/tool_result_compressor.rs` | 247-320 |
| Plan de test : déclenchement de compression à trois couches et vérification des journaux | `docs/testing/context_compression_test_plan.md` | 1-116 |

</details>

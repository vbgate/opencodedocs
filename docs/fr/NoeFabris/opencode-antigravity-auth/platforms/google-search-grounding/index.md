---
title: "Google Search : Permettre à Gemini de naviguer sur le web | Antigravity"
sidebarTitle: "Permettre à Gemini de rechercher en ligne"
subtitle: "Google Search Grounding : Permettre à Gemini de rechercher des informations en ligne"
description: "Apprenez à activer Google Search Grounding pour Gemini, afin de permettre au modèle de rechercher des informations en temps réel sur le web. Maîtrisez les méthodes de configuration et les techniques d'ajustement des seuils pour équilibrer précision et vitesse de réponse."
tags:
  - "gemini"
  - "google-search"
  - "grounding"
  - "configuration"
prerequisite:
  - "start-quick-install"
  - "start-first-request"
order: 3
---

# Google Search Grounding : Permettre à Gemini de rechercher des informations en ligne

## Ce que vous apprendrez

- Activer Google Search pour les modèles Gemini, permettant à l'IA de rechercher des informations en temps réel sur le web
- Régler le seuil de recherche pour contrôler la fréquence des recherches du modèle
- Comprendre le fonctionnement et les cas d'usage de Google Search Grounding
- Choisir la configuration appropriée selon les besoins de votre tâche

## Votre problème actuel

::: info Qu'est-ce que Google Search Grounding ?

**Google Search Grounding** est une fonctionnalité de Gemini qui permet au modèle de rechercher automatiquement sur Google pour obtenir des informations en temps réel (actualités, statistiques, prix de produits, etc.), au lieu de s'appuyer entièrement sur les données d'entraînement.

:::

Quand vous demandez à Gemini "Quel temps fait-il aujourd'hui ?" ou "Quelle est la dernière version de VS Code ?", le modèle peut ne pas répondre car ses données d'entraînement sont obsolètes. En activant Google Search Grounding, le modèle peut rechercher lui-même les réponses en ligne, comme vous le faites avec votre navigateur.

## Quand utiliser cette fonctionnalité

| Scénario | Activer ? | Raison |
| --- | --- | --- |
| Génération de code, problèmes de programmation | ❌ Non nécessaire | Les connaissances en programmation sont relativement stables, les données d'entraînement suffisent |
| Obtenir les dernières informations (actualités, prix, versions) | ✅ Fortement recommandé | Nécessite des données en temps réel |
| Vérification de faits (dates, statistiques) | ✅ Recommandé | Évite que le modèle invente des informations |
| Écriture créative, brainstorming | ❌ Non nécessaire | Pas besoin de précision factuelle |
| Recherche de documentation technique | ✅ Recommandé | Recherche de la dernière documentation d'API |

## Concept clé

Le cœur de Google Search Grounding est de permettre au modèle de rechercher automatiquement **quand nécessaire**, pas à chaque fois. Le plugin injecte l'outil `googleSearchRetrieval`, permettant à Gemini d'appeler l'API Google Search.

::: tip Concepts clés

- **Mode Auto** : Le modèle décide lui-même s'il doit rechercher (selon le seuil)
- **Seuil (grounding_threshold)** : Contrôle la "barrière" pour la recherche du modèle. Plus la valeur est petite, plus la recherche est fréquente

:::

## 🎒 Prérequis

::: warning Vérifications préalables

Avant de commencer, assurez-vous :

- [ ] D'avoir terminé l'[installation rapide](../../start/quick-install/)
- [ ] D'avoir ajouté au moins un compte Google
- [ ] D'avoir réussi à faire votre première requête (voir [première requête](../../start/first-request/))

:::

## Procédure

### Étape 1 : Vérifier l'emplacement du fichier de configuration

Le fichier de configuration du plugin se trouve à :

- **macOS/Linux** : `~/.config/opencode/antigravity.json`
- **Windows** : `%APPDATA%\opencode\antigravity.json`

Si le fichier n'existe pas, créez-le :

```bash
# macOS/Linux
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json"
}
EOF
```

```powershell
# Windows
@"
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json"
}
"@ | Out-File -FilePath "$env:APPDATA\opencode\antigravity.json" -Encoding utf8
```

**Vous devriez voir** : Le fichier de configuration est créé, contenant le champ `$schema`

### Étape 2 : Activer Google Search

Ajoutez la configuration `web_search` dans le fichier de configuration :

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "web_search": {
    "default_mode": "auto",
    "grounding_threshold": 0.3
  }
}
```

**Description de la configuration** :

| Champ | Valeur | Description |
| --- | --- | --- |
| `web_search.default_mode` | `"auto"` ou `"off"` | Active ou désactive Google Search, `"off"` par défaut |
| `web_search.grounding_threshold` | `0.0` - `1.0` | Seuil de recherche, `0.3` par défaut, fonctionne uniquement en mode `auto` |

**Vous devriez voir** : Le fichier de configuration est mis à jour, contenant la configuration `web_search`

### Étape 3 : Ajuster le seuil de recherche (optionnel)

Le `grounding_threshold` contrôle la fréquence de recherche du modèle :

| Seuil | Comportement | Scénario d'usage |
| --- | --- | --- |
| `0.0 - 0.2` | Recherche fréquente, presque à chaque incertitude | Besoin de données en temps réel hautement précises |
| `0.3` (défaut) | Équilibré, le modèle recherche seulement avec une certaine confiance | Usage quotidien, équilibre entre précision et vitesse |
| `0.7 - 1.0` | Recherche rare, uniquement à haute confiance | Réduire les recherches, améliorer la vitesse |

::: tip Conseil d'expert

Commencez avec la valeur par défaut `0.3`, puis ajustez :
- **Si le modèle ne recherche pas** → Diminuez le seuil (par exemple `0.2`)
- **Si la recherche est trop fréquente, ralentit les réponses** → Augmentez le seuil (par exemple `0.5`)

:::

**Vous devriez voir** : Le seuil est ajusté, peut être optimisé selon l'expérience d'utilisation réelle

### Étape 4 : Vérifier la configuration

Redémarrez OpenCode, ou rechargez la configuration (si supporté), puis faites une requête nécessitant des informations en temps réel :

```
Entrée utilisateur :
Quelle est la dernière version de VS Code ?

Réponse système (avec Google Search activé) :
La dernière version stable de VS Code est 1.96.4 (à partir de janvier 2026)...

[citation:1] ← Marque de source de référence
```

**Vous devriez voir** :
- La réponse du modèle inclut des sources de référence (`[citation:1]`, etc.)
- Le contenu de la réponse est à jour, pas une ancienne version des données d'entraînement

### Étape 5 : Tester différents seuils

Essayez d'ajuster le `grounding_threshold` et observez les changements de comportement du modèle :

```json
// Seuil bas (recherche fréquente)
"grounding_threshold": 0.1

// Seuil élevé (recherche rare)
"grounding_threshold": 0.7
```

Après chaque ajustement, testez avec la même question et observez :
- Si la recherche a lieu (vérifiez si des citations sont présentes dans la réponse)
- Le nombre de recherches (plusieurs `citation`)
- La vitesse de réponse

**Vous devriez voir** :
- Seuil bas : recherches plus fréquentes, mais réponses légèrement plus lentes
- Seuil élevé : moins de recherches, mais risque de réponses inexactes

## Points de contrôle ✅

::: details Cliquez pour déplier la liste de vérification

Effectuez les vérifications suivantes pour confirmer que la configuration est correcte :

- [ ] Le fichier de configuration contient la configuration `web_search`
- [ ] `default_mode` est défini sur `"auto"`
- [ ] `grounding_threshold` est entre `0.0` et `1.0`
- [ ] Faites une requête nécessitant des informations en temps réel, le modèle retourne une réponse incluant des citations
- [ ] Après ajustement du seuil, le comportement de recherche du modèle change

Si tout est validé, Google Search Grounding est correctement activé !

:::

## Pièges à éviter

### Problème 1 : Le modèle ne recherche pas

**Symptôme** : Après activation du mode `auto`, le modèle ne recherche toujours pas et n'indique pas de source de référence.

**Cause** :
- Seuil trop élevé (par exemple `0.9`), le modèle nécessite une confiance très élevée pour rechercher
- La question elle-même ne nécessite pas de recherche (comme un problème de programmation)

**Solution** :
- Diminuez le `grounding_threshold` à `0.2` ou moins
- Testez avec une question nécessitant explicitement des informations en temps réel (comme "Quel temps fait-il aujourd'hui ?", "Dernières actualités")

### Problème 2 : Recherche trop fréquente, réponse lente

**Symptôme** : Chaque question déclenche une recherche, le temps de réponse augmente significativement.

**Cause** :
- Seuil trop bas (par exemple `0.1`), le modèle déclenche les recherches trop fréquemment
- Le type de question nécessite des informations en temps réel (comme le prix des actions, l'actualité)

**Solution** :
- Augmentez le `grounding_threshold` à `0.5` ou plus
- Si la tâche ne nécessite pas d'informations en temps réel, changez `default_mode` en `"off"`

### Problème 3 : Erreur de format du fichier de configuration

**Symptôme** : Le plugin signale une erreur, impossible de charger la configuration.

**Cause** : Erreur de format JSON (virgule en trop, guillemets non appariés, etc.).

**Solution** : Utilisez un outil de validation JSON pour vérifier le fichier de configuration, assurez-vous que le format est correct.

```bash
# Valider le format JSON
cat ~/.config/opencode/antigravity.json | python3 -m json.tool
```

## Résumé de ce cours

- **Google Search Grounding** permet aux modèles Gemini de rechercher des informations en temps réel sur le web
- Activez avec `web_search.default_mode: "auto"`, désactivez avec `"off"`
- `grounding_threshold` contrôle la fréquence de recherche : plus la valeur est petite, plus la recherche est fréquente
- Le seuil par défaut `0.3` convient à la plupart des scénarios, ajustable selon l'expérience réelle
- Le modèle indique les sources dans ses réponses, marquées comme `[citation:1]`, etc.

## Aperçu du prochain cours

> Dans le prochain cours, nous apprendrons le **[Système de double quota](../dual-quota-system/)**.
>
> Vous apprendrez :
> - Comment fonctionnent les deux pools de quotas indépendants d'Antigravity et de Gemini CLI
> - Comment basculer entre les pools de quotas pour maximiser l'utilisation
> - Les meilleures pratiques pour le partage des quotas

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour déplier l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Schéma de configuration Google Search | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 303-319 |
| Définition des types Google Search | [`src/plugin/transform/types.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/types.ts) | 85-88 |
| Logique d'injection Google Search | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 402-419 |
| Chargement de la configuration Google Search | [`src/plugin/config/loader.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/loader.ts) | 173-184 |
| Application de la configuration Google Search | [`src/plugin.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin.ts) | 1194-1196 |

**Options de configuration clés** :

- `web_search.default_mode`: `"auto"` ou `"off"`, par défaut `"off"`
- `web_search.grounding_threshold`: `0.0` - `1.0`, par défaut `0.3`

**Fonctions clés** :

- `applyGeminiTransforms()` : Applique toutes les transformations Gemini, y compris l'injection de Google Search
- `normalizeGeminiTools()` : Normalise le format des outils, conserve l'outil `googleSearchRetrieval`
- `wrapToolsAsFunctionDeclarations()` : Encapsule les outils au format `functionDeclarations`

**Principe de fonctionnement** :

1. Le plugin lit `web_search.default_mode` et `web_search.grounding_threshold` depuis le fichier de configuration
2. Quand `mode === "auto"`, injecte l'outil `googleSearchRetrieval` dans le tableau `tools` de la requête :
   ```json
   {
     "googleSearchRetrieval": {
       "dynamicRetrievalConfig": {
         "mode": "MODE_DYNAMIC",
         "dynamicThreshold": 0.3  // grounding_threshold
       }
     }
   }
   ```
3. Le modèle Gemini décide d'appeler ou non l'outil de recherche selon le seuil
4. Les résultats de recherche sont inclus dans la réponse, avec les sources de référence marquées (`[citation:1]`, etc.)

</details>

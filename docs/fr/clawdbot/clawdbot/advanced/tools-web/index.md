---
title: "Outils de recherche et scraping web : Brave, Perplexity et extraction de contenu web | Tutoriel Clawdbot"
sidebarTitle: "Faire rechercher l'IA sur le web"
subtitle: "Outils de recherche et scraping web"
description: "Apprenez à configurer et utiliser les outils web_search et web_fetch de Clawdbot pour permettre à l'assistant IA d'accéder aux informations web en temps réel. Ce tutoriel couvre la configuration de Brave Search API et Perplexity Sonar, l'extraction de contenu web, le mécanisme de cache et le dépannage des problèmes courants. Inclut l'obtention de API Key, la configuration des paramètres, la configuration de langue et de région et la configuration de secours Firecrawl."
tags:
  - "advanced"
  - "tools"
  - "web"
  - "search"
  - "fetch"
prerequisite:
  - "start-getting-started"
order: 230
---

# Outils de recherche et scraping web

## Ce que vous pourrez faire après

- Configurer l'outil **web_search** pour permettre à l'assistant IA d'utiliser Brave Search ou Perplexity Sonar pour la recherche web
- Configurer l'outil **web_fetch** pour permettre à l'assistant IA de faire du scraping et de l'extraction de contenu web
- Comprendre la différence entre les deux outils et leurs cas d'utilisation
- Configurer API Key et les paramètres avancés (région, langue, temps de cache, etc.)
- Résoudre les problèmes courants (erreurs d'API Key, échecs de scraping, problèmes de cache, etc.)

## Votre problème actuel

La base de connaissances de l'assistant IA est statique et ne peut pas accéder aux informations web en temps réel :

- L'IA ne connaît pas les nouvelles du jour
- L'IA ne peut pas rechercher les derniers documents API ou blogs techniques
- L'IA ne peut pas récupérer le contenu le plus récent de sites web spécifiques

Vous voulez que l'assistant IA "se connecte à internet" mais vous ne savez pas :

- Dois-je utiliser Brave ou Perplexity ?
- Où obtenir l'API Key ? Comment la configurer ?
- Quelle est la différence entre web_search et web_fetch ?
- Comment gérer les pages web dynamiques ou les sites qui nécessitent une connexion ?

## Quand utiliser cette technique

- **web_search** : Quand vous devez rechercher des informations rapidement, rechercher sur plusieurs sites web, obtenir des données en temps réel (comme les nouvelles, les prix, la météo)
- **web_fetch** : Quand vous devez extraire le contenu complet d'une page web spécifique, lire des pages de documentation, analyser des articles de blog

::: tip Guide de sélection d'outils
| Scénario | Outil recommandé | Raison |
|------|----------|------|
| Rechercher plusieurs sources | web_search | Retourne plusieurs résultats en une seule requête |
| Extraire le contenu d'une seule page | web_fetch | Obtient le texte complet, supporte markdown |
| Pages dynamiques/nécessitent une connexion | [browser](../tools-browser/) | Nécessite l'exécution de JavaScript |
| Pages statiques simples | web_fetch | Léger et rapide |
:::

## 🎒 Préparatifs avant de commencer

::: warning Conditions préalables
Ce tutoriel suppose que vous avez terminé le [Démarrage rapide](../../start/getting-started/), avez installé et démarré Gateway.
:::

- Le démon Gateway est en cours d'exécution
- La configuration de canaux de base est terminée (au moins un canal de communication disponible)
- API Key d'au moins un fournisseur de recherche préparée (Brave ou Perplexity/OpenRouter)

::: info Note
web_search et web_fetch sont des **outils légers** qui n'exécutent pas JavaScript. Pour les sites web qui nécessitent une connexion ou des pages dynamiques complexes, utilisez l'[outil browser](../tools-browser/).
:::

## Concepts clés

### Différence entre les deux outils

**web_search** : Outil de recherche web
- Appelle des moteurs de recherche (Brave ou Perplexity) pour retourner les résultats de recherche
- **Brave** : Retourne des résultats structurés (titre, URL, description, date de publication)
- **Perplexity** : Retourne des réponses synthétisées par l'IA avec des liens de citation

**web_fetch** : Outil de scraping de contenu web
- Effectue des requêtes HTTP GET vers une URL spécifique
- Utilise l'algorithme Readability pour extraire le contenu principal (éliminant la navigation, les publicités, etc.)
- Convertit HTML en Markdown ou texte brut
- N'exécute pas JavaScript

### Pourquoi avons-nous besoin de deux outils ?

```
┌─────────────────┐     web_search      ┌──────────────────┐
│  Utilisateur demande à l'IA│ ──────────────────→  │   API de moteur de recherche   │
│ "Dernières nouvelles"│                      │   (Brave/Perplexity) │
└─────────────────┘                      └──────────────────┘
        ↓                                        ↓
   IA obtient 5 résultats                    Retourne les résultats de recherche
        ↓
┌─────────────────┐     web_fetch       ┌──────────────────┐
│  IA sélectionne résultat│ ──────────────────→  │   Page web cible   │
│ "Ouvrir le lien 1" │                      │   (HTTP/HTTPS)   │
└─────────────────┘                      └──────────────────┘
        ↓                                        ↓
   IA obtient le contenu complet                    Extrait Markdown
```

**Workflow typique** :
1. L'IA utilise **web_search** pour rechercher des informations pertinentes
2. L'IA sélectionne les liens appropriés parmi les résultats de recherche
3. L'IA utilise **web_fetch** pour faire le scraping du contenu de la page spécifique
4. L'IA répond à la question de l'utilisateur en se basant sur le contenu

### Mécanisme de cache

Les deux outils incluent un cache intégré pour réduire les requêtes en double :

| Outil | Clé de cache | TTL par défaut | Élément de configuration |
|------|---------|----------|--------|
| web_search | `provider:query:count:country:search_lang:ui_lang:freshness` | 15 minutes | `tools.web.search.cacheTtlMinutes` |
| web_fetch | `fetch:url:extractMode:maxChars` | 15 minutes | `tools.web.fetch.cacheTtlMinutes` |

::: info Avantages du cache
- Réduit le nombre d'appels API externes (économise les coûts)
- Accélère le temps de réponse (même requête retourne le cache directement)
- Évite la limitation de taux par des requêtes fréquentes
:::

## Suivez-moi

### Étape 1 : Sélectionner le fournisseur de recherche

Clawdbot supporte deux fournisseurs de recherche :

| Fournisseur | Avantages | Inconvénients | API Key |
|--------|------|--------|---------|
| **Brave** (par défaut) | Rapide, résultats structurés, niveau gratuit | Résultats de recherche traditionnels | `BRAVE_API_KEY` |
| **Perplexity** | Réponses synthétisées par l'IA, citations, en temps réel | Nécessite l'accès Perplexity ou OpenRouter | `OPENROUTER_API_KEY` ou `PERPLEXITY_API_KEY` |

::: tip Sélection recommandée
- **Débutants** : Il est recommandé d'utiliser Brave (le niveau gratuit est suffisant pour l'utilisation quotidienne)
- **Besoin de résumé IA** : Choisissez Perplexity (retourne des réponses synthétisées plutôt que des résultats originaux)
:::

### Étape 2 : Obtenir API Key de Brave Search

**Pourquoi utiliser Brave** : Niveau gratuit généreux, rapide, résultats structurés faciles à analyser

#### 2.1 S'inscrire à Brave Search API

1. Visitez https://brave.com/search/api/
2. Créez un compte et connectez-vous
3. Dans Dashboard, sélectionnez le plan **"Data for Search"** (pas "Data for AI")
4. Générez API Key

#### 2.2 Configurer API Key

**Méthode A : Utiliser CLI (recommandé)**

```bash
# Exécuter l'assistant de configuration interactif
clawdbot configure --section web
```

CLI vous demandera d'entrer l'API Key et la sauvegardera dans `~/.clawdbot/clawdbot.json`.

**Méthode B : Utiliser les variables d'environnement**

Ajoutez API Key aux variables d'environnement du processus Gateway :

```bash
# Ajouter dans ~/.clawdbot/.env
echo "BRAVE_API_KEY=votreAPIKey" >> ~/.clawdbot/.env

# Redémarrer Gateway pour que les variables d'environnement prennent effet
clawdbot gateway restart
```

**Méthode C : Éditer directement le fichier de configuration**

Éditez `~/.clawdbot/clawdbot.json` :

```json5
{
  "tools": {
    "web": {
      "search": {
        "apiKey": "BRAVE_API_KEY_HERE",
        "provider": "brave"
      }
    }
  }
}
```

**Ce que vous devriez voir** :

- Après avoir sauvegardé la configuration, redémarrez Gateway
- Dans le canal configuré (comme WhatsApp), envoyez le message : "Aide-moi à rechercher les dernières nouvelles IA"
- L'IA devrait retourner les résultats de recherche (titre, URL, description)

### Étape 3 : Configurer les paramètres avancés de web_search

Vous pouvez configurer plus de paramètres dans `~/.clawdbot/clawdbot.json` :

```json5
{
  "tools": {
    "web": {
      "search": {
        "enabled": true,           // Si activé (par défaut true)
        "provider": "brave",       // Fournisseur de recherche
        "apiKey": "BRAVE_API_KEY_HERE",
        "maxResults": 5,          // Nombre de résultats à retourner (1-10, par défaut 5)
        "timeoutSeconds": 30,       // Délai d'attente (par défaut 30)
        "cacheTtlMinutes": 15      // Temps de cache (par défaut 15 minutes)
      }
    }
  }
}
```

#### 3.1 Configurer la région et la langue

Rendez les résultats de recherche plus précis :

```json5
{
  "tools": {
    "web": {
      "search": {
        "provider": "brave",
        "apiKey": "BRAVE_API_KEY_HERE",
        "maxResults": 10,
        // Optionnel : L'IA peut remplacer ces valeurs lors de l'appel
        "defaultCountry": "US",   // Pays par défaut (code de 2 caractères)
        "defaultSearchLang": "en",  // Langue des résultats de recherche
        "defaultUiLang": "en"      // Langue des éléments UI
      }
    }
  }
}
```

**Codes de pays courants** : `US` (États-Unis), `DE` (Allemagne), `FR` (France), `CN` (Chine), `JP` (Japon), `ALL` (Mondial)

**Codes de langue courants** : `en` (anglais), `zh` (chinois), `fr` (français), `de` (allemand), `es` (espagnol)

#### 3.2 Configurer le filtre de temps (exclusif Brave)

```json5
{
  "tools": {
    "web": {
      "search": {
        "provider": "brave",
        "apiKey": "BRAVE_API_KEY_HERE",
        // Optionnel : L'IA peut remplacer lors de l'appel
        "defaultFreshness": "pw"  // Filtrer les résultats de la dernière semaine
      }
    }
  }
}
```

**Valeurs de Freshness** :
- `pd` : Dernières 24 heures
- `pw` : Dernière semaine
- `pm` : Dernier mois
- `py` : Dernière année
- `YYYY-MM-DDtoYYYY-MM-DD` : Plage de dates personnalisée (ex : `2024-01-01to2024-12-31`)

### Étape 4 : Configurer Perplexity Sonar (optionnel)

Si vous préférez les réponses synthétisées par l'IA, vous pouvez utiliser Perplexity.

#### 4.1 Obtenir API Key

**Méthode A : Connexion directe à Perplexity**

1. Visitez https://www.perplexity.ai/
2. Créez un compte et abonnez-vous
3. Générez API Key dans Settings (commence par `pplx-`)

**Méthode B : Via OpenRouter (pas besoin de carte de crédit)**

1. Visitez https://openrouter.ai/
2. Créez un compte et rechargez (supporte crypto ou prépayement)
3. Générez API Key (commence par `sk-or-v1-`)

#### 4.2 Configurer Perplexity

Éditez `~/.clawdbot/clawdbot.json` :

```json5
{
  "tools": {
    "web": {
      "search": {
        "enabled": true,
        "provider": "perplexity",
        "perplexity": {
          // API Key (optionnel, peut aussi être configuré via variables d'environnement)
          "apiKey": "sk-or-v1-...",  // ou "pplx-..."
          // Base URL (optionnel, Clawdbot déduira automatiquement selon API Key)
          "baseUrl": "https://openrouter.ai/api/v1",  // ou "https://api.perplexity.ai"
          // Modèle (par défaut perplexity/sonar-pro)
          "model": "perplexity/sonar-pro"
        }
      }
    }
  }
}
```

::: info Inférence automatique de Base URL
Si vous omettez `baseUrl`, Clawdbot choisira automatiquement selon le préfixe d'API Key :
- `pplx-...` → `https://api.perplexity.ai`
- `sk-or-...` → `https://openrouter.ai/api/v1`
:::

#### 4.3 Sélectionner le modèle Perplexity

| Modèle | Description | Cas d'utilisation |
|------|------|----------|
| `perplexity/sonar` | Réponses rapides + recherche web | Requêtes simples, recherche rapide |
| `perplexity/sonar-pro` (par défaut) | Raisonnement multi-étapes + recherche web | Problèmes complexes, nécessite un raisonnement |
| `perplexity/sonar-reasoning-pro` | Analyse de chaîne de pensée | Recherche approfondie, nécessite un processus de raisonnement |

### Étape 5 : Configurer l'outil web_fetch

web_fetch est activé par défaut et peut être utilisé sans configuration supplémentaire. Mais vous pouvez ajuster les paramètres :

```json5
{
  "tools": {
    "web": {
      "fetch": {
        "enabled": true,           // Si activé (par défaut true)
        "maxChars": 50000,        // Nombre maximum de caractères (par défaut 50000)
        "timeoutSeconds": 30,       // Délai d'attente (par défaut 30)
        "cacheTtlMinutes": 15,     // Temps de cache (par défaut 15 minutes)
        "maxRedirects": 3,         // Nombre maximum de redirections (par défaut 3)
        "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "readability": true         // Si activer Readability (par défaut true)
      }
    }
  }
}
```

#### 5.1 Configurer le secours Firecrawl (optionnel)

Si l'extraction Readability échoue, vous pouvez utiliser Firecrawl comme secours (nécessite API Key) :

```json5
{
  "tools": {
    "web": {
      "fetch": {
        "readability": true,
        "firecrawl": {
          "enabled": true,
          "apiKey": "FIRECRAWL_API_KEY_HERE",  // ou définir la variable d'environnement FIRECRAWL_API_KEY
          "baseUrl": "https://api.firecrawl.dev",
          "onlyMainContent": true,  // Extraire uniquement le contenu principal
          "maxAgeMs": 86400000,    // Temps de cache (millisecondes, par défaut 1 jour)
          "timeoutSeconds": 60
        }
      }
    }
  }
}
```

::: tip Avantages de Firecrawl
- Supporte le rendu JavaScript (nécessite d'être activé)
- Capacité anti-scraping plus forte
- Supporte les sites web complexes (SPA, applications à page unique)
:::

**Obtenir API Key Firecrawl** :
1. Visitez https://www.firecrawl.dev/
2. Créez un compte et générez API Key
3. Configurez dans la configuration ou utilisez la variable d'environnement `FIRECRAWL_API_KEY`

### Étape 6 : Vérifier la configuration

**Vérifier web_search** :

Envoyez un message dans le canal configuré (comme WebChat) :

```
Aide-moi à rechercher les nouvelles fonctionnalités de TypeScript 5.0
```

**Ce que vous devriez voir** :
- L'IA retourne 5 résultats de recherche (titre, URL, description)
- Si vous utilisez Perplexity, retourne des réponses résumées par l'IA + liens de citation

**Vérifier web_fetch** :

Envoyez un message :

```
Aide-moi à obtenir le contenu de https://www.typescriptlang.org/docs/handbook/intro.html
```

**Ce que vous devriez voir** :
- L'IA retourne le contenu au format Markdown de cette page
- Le contenu a déjà la navigation, les publicités et autres éléments non pertinents supprimés

### Étape 7 : Tester les fonctionnalités avancées

**Tester le filtre de région** :

```
Recherche les cours de formation TypeScript en Allemagne
```

L'IA peut utiliser le paramètre `country: "DE"` pour une recherche spécifique à la région.

**Tester le filtre de temps** :

```
Recherche les nouvelles du domaine IA de la semaine dernière
```

L'IA peut utiliser le paramètre `freshness: "pw"` pour filtrer les résultats de la dernière semaine.

**Tester le mode d'extraction** :

```
Récupère https://example.com et retourne-le en format texte brut
```

L'IA peut utiliser le paramètre `extractMode: "text"` pour obtenir du texte brut au lieu de Markdown.

## Point de contrôle ✅

Assurez-vous que la configuration suivante est correcte :

- [ ] Gateway est en cours d'exécution
- [ ] Au moins un fournisseur de recherche configuré (Brave ou Perplexity)
- [ ] API Key sauvegardée correctement (via CLI ou variables d'environnement)
- [ ] Test web_search réussi (retourne les résultats de recherche)
- [ ] Test web_fetch réussi (retourne le contenu de la page)
- [ ] Configuration du cache raisonnable (éviter les requêtes excessives)

::: tip Commandes de vérification rapide
```bash
# Voir la configuration Gateway
clawdbot configure --show

# Voir les logs Gateway
clawdbot gateway logs --tail 50
```
:::

## Éviter les pièges

### Erreur courante 1 : API Key non configurée

**Message d'erreur** :

```json
{
  "error": "missing_brave_api_key",
  "message": "web_search needs a Brave Search API key. Run `clawdbot configure --section web` to store it, or set BRAVE_API_KEY in Gateway environment."
}
```

**Solution** :

1. Exécutez `clawdbot configure --section web`
2. Entrez API Key
3. Redémarrez Gateway : `clawdbot gateway restart`

### Erreur courante 2 : Échec du scraping (pages web dynamiques)

**Problème** : web_fetch ne peut pas extraire le contenu qui nécessite JavaScript.

**Solution** :

1. Confirmez si le site web est une SPA (application à page unique)
2. Si oui, utilisez l'[outil browser](../tools-browser/)
3. Ou configurez le secours Firecrawl (nécessite API Key)

### Erreur courante 3 : Contenu périmé par le cache

**Problème** : Les résultats de recherche ou le contenu extrait sont anciens.

**Solution** :

1. Ajustez la configuration `cacheTtlMinutes`
2. Ou demandez explicitement "ne pas utiliser le cache" dans le dialogue avec l'IA
3. Redémarrez Gateway pour vider le cache en mémoire

### Erreur courante 4 : Délai de requête expiré

**Problème** : Délai d'attente lors du scraping de pages volumineuses ou de sites web lents.

**Solution** :

```json5
{
  "tools": {
    "web": {
      "search": {
        "timeoutSeconds": 60
      },
      "fetch": {
        "timeoutSeconds": 60
      }
    }
  }
}
```

### Erreur courante 5 : IP de réseau interne bloquée par SSRF

**Problème** : Le scraping vers des adresses de réseau interne (comme `http://localhost:8080`) est bloqué.

**Solution** :

web_fetch bloque par défaut les IP de réseau interne pour éviter les attaques SSRF. Si vous avez vraiment besoin d'accéder au réseau interne :

1. Utilisez l'[outil browser](../tools-browser/) (plus flexible)
2. Ou éditez la configuration pour autoriser des hôtes spécifiques (nécessite de modifier le code source)

## Résumé de cette leçon

- **web_search** : Outil de recherche web, supporte Brave (résultats structurés) et Perplexity (réponses synthétisées par l'IA)
- **web_fetch** : Outil de scraping de contenu web, utilise Readability pour extraire le contenu principal (HTML → Markdown/text)
- Les deux incluent un cache intégré (par défaut 15 minutes), réduisent les requêtes en double
- API Key de Brave peut être configurée via CLI, variables d'environnement ou fichier de configuration
- Perplexity supporte deux méthodes : connexion directe et OpenRouter
- Pour les sites web qui nécessitent JavaScript, utilisez l'[outil browser](../tools-browser/)
- Les paramètres de configuration incluent : nombre de résultats, délai d'attente, région, langue, filtre de temps, etc.

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[Canvas interface visuelle et A2UI](../canvas/)**.
>
> Vous apprendrez :
> - Mécanisme de push Canvas A2UI
> - Opération de l'interface visuelle
> - Comment faire contrôler les éléments Canvas par l'assistant IA

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer et voir l'emplacement du code source</strong></summary>

> Date de mise à jour : 2026-01-27

| Fonction | Chemin du fichier | Numéro de ligne |
|------|----------|------|
| Définition de l'outil web_search | [`src/agents/tools/web-search.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-search.ts) | 409-483 |
| Définition de l'outil web_fetch | [`src/agents/tools/web-fetch.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-fetch.ts) | 572-624 |
| Appel API Brave Search | [`src/agents/tools/web-search.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-search.ts) | 309-407 |
| Appel API Perplexity | [`src/agents/tools/web-search.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-search.ts) | 268-307 |
| Extraction de contenu Readability | [`src/agents/tools/web-fetch-utils.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-fetch-utils.ts) | - |
| Intégration Firecrawl | [`src/agents/tools/web-fetch.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-fetch.ts) | 257-330 |
| Implémentation du cache | [`src/agents/tools/web-shared.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-shared.ts) | - |
| Protection SSRF | [`src/infra/net/ssrf.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/net/ssrf.ts) | - |
| Schéma de configuration | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts) | - |

**Constantes clés** :

- `DEFAULT_SEARCH_COUNT = 5` : Nombre par défaut de résultats de recherche
- `MAX_SEARCH_COUNT = 10` : Nombre maximum de résultats de recherche
- `DEFAULT_CACHE_TTL_MINUTES = 15` : Temps de cache par défaut (minutes)
- `DEFAULT_TIMEOUT_SECONDS = 30` : Délai d'attente par défaut (secondes)
- `DEFAULT_FETCH_MAX_CHARS = 50_000` : Nombre maximum de caractères de scraping par défaut

**Fonctions clés** :

- `createWebSearchTool()` : Crée une instance d'outil web_search
- `createWebFetchTool()` : Crée une instance d'outil web_fetch
- `runWebSearch()` : Exécute la recherche et retourne les résultats
- `runWebFetch()` : Exécute le scraping et extrait le contenu
- `normalizeFreshness()` : Normalise les paramètres de filtre de temps
- `extractReadableContent()` : Extrait le contenu en utilisant Readability

</details>

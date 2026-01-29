---
title: "Outils d'Automatisation du Navigateur: Contrôle Web et Automatisation UI | Tutoriel Clawdbot"
sidebarTitle: "Contrôle du Navigateur en 5 Minutes"
subtitle: "Outils d'Automatisation du Navigateur: Contrôle Web et Automatisation UI | Tutoriel Clawdbot"
description: "Apprenez à utiliser les outils de navigateur de Clawdbot pour l'automatisation web, les captures d'écran, la manipulation de formulaires et le contrôle UI. Ce tutoriel couvre le démarrage du navigateur, les instantanés de page, l'interaction UI (click/type/drag, etc.), le téléchargement de fichiers, la gestion des boîtes de dialogue et le contrôle distant du navigateur. Maîtrisez le workflow complet, y compris le mode relais d'extension Chrome et la configuration de navigateur autonome, ainsi que l'exécution d'opérations de navigateur sur des nœuds iOS/Android."
tags:
  - "browser"
  - "automation"
  - "ui"
prerequisite:
  - "start-gateway-startup"
  - "advanced-models-auth"
order: 210
---

# Outils d'Automatisation du Navigateur: Contrôle Web et Automatisation UI

## Ce que vous pourrez faire à la fin

- Démarrer et contrôler les navigateurs gérés par Clawdbot
- Utiliser le relais d'extension Chrome pour prendre le contrôle de vos onglets Chrome existants
- Capturer des instantanés de page (format AI/ARIA) et des captures d'écran (PNG/JPEG)
- Exécuter des opérations d'automatisation UI: clic, saisie de texte, glisser-déposer, sélection, remplissage de formulaire
- Gérer le téléchargement de fichiers et les boîtes de dialogue (alert/confirm/prompt)
- Opérer des navigateurs distribués via le serveur de contrôle distant du navigateur
- Exécuter des opérations de navigateur sur des appareils iOS/Android en utilisant le proxy de nœud

## Votre situation actuelle

Vous avez déjà exécuté Gateway et configuré les modèles d'IA, mais vous avez encore des questions sur l'utilisation des outils de navigateur:

- L'IA ne peut pas accéder au contenu de la page web et vous devez décrire la structure de la page?
- Vous voulez que l'IA remplisse automatiquement des formulaires et clique sur des boutons, mais vous ne savez pas comment faire?
- Vous voulez prendre des captures d'écran ou enregistrer des pages web, mais vous devez le faire manuellement à chaque fois?
- Vous voulez utiliser vos propres onglets Chrome (avec session connectée) au lieu de démarrer un nouveau navigateur?
- Vous voulez exécuter des opérations de navigateur sur des appareils distants comme des nœuds iOS/Android?

## Quand utiliser cette fonctionnalité

**Scénarios d'utilisation des outils de navigateur**:

| Scénario | Action | Exemple |
| ---- | ------ | ---- |
| Automatisation de formulaire | `act` + `fill` | Remplir des formulaires d'inscription, soumettre des commandes |
| Web scraping | `snapshot` | Extraire la structure de page, collecter des données |
| Enregistrer captures d'écran | `screenshot` | Enregistrer des captures d'écran de pages, enregistrer des preuves |
| Téléchargement de fichiers | `upload` | Télécharger un CV, télécharger des pièces jointes |
| Gestion de boîtes de dialogue | `dialog` | Accepter/rejeter alert/confirm |
| Utiliser session existante | `profile="chrome"` | Opérer sur des onglets Chrome connectés |
| Contrôle distant | `target="node"` | Exécuter sur des nœuds iOS/Android |

## 🎒 Préparatifs avant de commencer

::: warning Vérification préalable

Avant d'utiliser les outils de navigateur, assurez-vous de:

1. ✅ Gateway est démarré (`clawdbot gateway start`)
2. ✅ Les modèles d'IA sont configurés (Anthropic / OpenAI / OpenRouter, etc.)
3. ✅ Les outils de navigateur sont activés (`browser.enabled=true`)
4. ✅ Vous comprenez la cible que vous allez utiliser (sandbox/host/custom/node)
5. ✅ Si vous utilisez le relais d'extension Chrome, vous avez installé et activé l'extension

:::

## Concept central

**Que sont les outils de navigateur?**

Les outils de navigateur sont des outils d'automatisation intégrés à Clawdbot qui permettent à l'IA de contrôler des navigateurs via CDP (Chrome DevTools Protocol):

- **Serveur de contrôle**: `http://127.0.0.1:18791` (par défaut)
- **Automatisation UI**: Localisation et manipulation d'éléments basée sur Playwright
- **Mécanisme d'instantané**: Format AI ou ARIA, retourne la structure de page et les références d'éléments
- **Support multi-cible**: sandbox (par défaut), host (relais Chrome), custom (distant), node (nœud d'appareil)

**Deux modes de navigateur**:

| Mode | Profile | Pilote | Description |
| ---- | ------- | ---- | ---- |
| **Navigateur autonome** | `clawd` (par défaut) | clawd | Clawdbot démarre une instance indépendante de Chrome/Chromium |
| **Relais Chrome** | `chrome` | extension | Prend le contrôle de vos onglets Chrome existants (nécessite l'installation de l'extension) |

**Workflow**:

```
1. Démarrer le navigateur (start)
   ↓
2. Ouvrir un onglet (open)
   ↓
3. Obtenir un instantané de page (snapshot) → obtenir les références d'éléments (ref)
   ↓
4. Exécuter des opérations UI (act: click/type/fill/drag)
   ↓
5. Vérifier les résultats (screenshot/snapshot)
```

## Suivez les étapes

### Étape 1: Démarrer le navigateur

**Pourquoi**

La première fois que vous utilisez les outils de navigateur, vous devez d'abord démarrer le serveur de contrôle du navigateur.

```bash
# Dans le chat, demandez à l'IA de démarrer le navigateur
S'il vous plaît, démarrez le navigateur

# Ou utilisez l'outil de navigateur
action: start
profile: clawd  # ou chrome (relais d'extension Chrome)
target: sandbox
```

**Vous devriez voir**:

```
✓ Browser control server: http://127.0.0.1:18791
✓ Profile: clawd
✓ CDP endpoint: http://127.0.0.1:18792
✓ Headless: false
✓ Color: #FF4500
```

::: tip Point de vérification

- Voir `Browser control server` indique que le démarrage a réussi
- Par défaut, utilise le profile `clawd` (navigateur autonome)
- Si vous avez besoin d'utiliser le relais d'extension Chrome, utilisez `profile="chrome"`
- La fenêtre du navigateur s'ouvrira automatiquement (mode non headless)

:::

### Étape 2: Ouvrir une page web

**Pourquoi**

Ouvrez la page web cible pour préparer l'automatisation.

```bash
# Dans le chat
S'il vous plaît, ouvrez https://example.com

# Ou utilisez l'outil de navigateur
action: open
targetUrl: https://example.com
profile: clawd
target: sandbox
```

**Vous devriez voir**:

```
✓ Tab opened: https://example.com
targetId: tab_abc123
url: https://example.com
```

::: tip Référence d'élément (targetId)

Chaque fois que vous ouvrez ou focalisez un onglet, un `targetId` est retourné, cet ID est utilisé pour les opérations ultérieures (snapshot/act/screenshot).

:::

### Étape 3: Obtenir un instantané de page

**Pourquoi**

L'instantané permet à l'IA de comprendre la structure de la page et retourne des références d'éléments actionnables (ref).

```bash
# Obtenir un instantané format AI (par défaut)
action: snapshot
profile: clawd
targetId: tab_abc123
snapshotFormat: ai
refs: aria  # Utilise les Playwright aria-ref ids (stable entre les appels)

# Ou obtenir un instantané format ARIA (sortie structurée)
action: snapshot
profile: clawd
targetId: tab_abc123
snapshotFormat: aria
```

**Vous devriez voir** (format AI):

```
Page snapshot:

[header]
  Logo [aria-label="Example Logo"]
  Navigation [role="navigation"]
    Home [href="/"] [ref="e1"]
    About [href="/about"] [ref="e2"]
    Contact [href="/contact"] [ref="e3"]

[main]
  Hero section
    Title: "Welcome to Example" [ref="e4"]
    Button: "Get Started" [ref="e5"] [type="primary"]

[form section]
  Login form
    Input: Email [type="email"] [ref="e6"]
    Input: Password [type="password"] [ref="e7"]
    Button: "Sign In" [ref="e8"]
```

::: tip Choix du format d'instantané

| Format | Usage | Caractéristiques |
| ---- | ---- | ---- |
| `ai` | Par défaut, pour l'IA | Bonne lisibilité, adapté pour l'analyse IA |
| `aria` | Sortie structurée | Adapté pour les scénarios nécessitant une structure précise |
| `refs="aria"` | Stable entre les appels | Recommandé pour les opérations multi-étapes (snapshot → act) |

:::

### Étape 4: Exécuter des opérations UI (act)

**Pourquoi**

Utilisez les références d'éléments (ref) retournées dans l'instantané pour exécuter des opérations d'automatisation.

```bash
# Cliquer sur un bouton
action: act
request: {
  kind: "click",
  ref: "e5",
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox

# Saisir du texte
action: act
request: {
  kind: "type",
  ref: "e6",
  text: "user@example.com",
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox

# Remplir un formulaire (plusieurs champs)
action: act
request: {
  kind: "fill",
  fields: [
    { ref: "e6", value: "user@example.com" },
    { ref: "e7", value: "password123" }
  ],
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox

# Cliquer sur le bouton de soumission
action: act
request: {
  kind: "click",
  ref: "e8",
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox
```

**Vous devriez voir**:

```
✓ Clicked ref=e5
✓ Typed "user@example.com" into ref=e6
✓ Typed "password123" into ref=e7
✓ Clicked ref=e8
✓ Form submitted successfully
```

::: tip Opérations UI courantes

| Opération | Kind | Paramètres |
| ---- | ---- | ---- |
| Clic | `click` | `ref`, `doubleClick`, `button`, `modifiers` |
| Saisie de texte | `type` | `ref`, `text`, `submit`, `slowly` |
| Appui de touche | `press` | `key`, `targetId` |
| Survol | `hover` | `ref`, `targetId` |
| Glisser-déposer | `drag` | `startRef`, `endRef`, `targetId` |
| Sélection | `select` | `ref`, `values` |
| Remplir formulaire | `fill` | `fields` (tableau) |
| Attendre | `wait` | `timeMs`, `text`, `textGone`, `selector` |
| Exécuter JS | `evaluate` | `fn`, `ref`, `targetId` |

:::

### Étape 5: Capturer une capture d'écran de page web

**Pourquoi**

Vérifier les résultats des opérations ou enregistrer des captures d'écran de pages web.

```bash
# Capturer l'onglet actuel
action: screenshot
profile: clawd
targetId: tab_abc123
type: png

# Capturer la page complète
action: screenshot
profile: clawd
targetId: tab_abc123
fullPage: true
type: png

# Capturer un élément spécifique
action: screenshot
profile: clawd
targetId: tab_abc123
ref: "e4"  # Utilise le ref de l'instantané
type: jpeg
```

**Vous devriez voir**:

```
📸 Screenshot saved: ~/.clawdbot/media/browser-screenshot-12345.png
```

::: tip Formats de capture d'écran

| Format | Usage |
| ---- | ---- |
| `png` | Par défaut, compression sans perte, adapté pour les documents |
| `jpeg` | Compression avec perte, fichiers plus petits, adapté pour le stockage |

:::

### Étape 6: Gérer le téléchargement de fichiers

**Pourquoi**

Automatiser les opérations de téléchargement de fichiers dans les formulaires.

```bash
# D'abord déclencher le sélecteur de fichiers (clic sur le bouton de téléchargement)
action: act
request: {
  kind: "click",
  ref: "upload_button"
}
profile: clawd
targetId: tab_abc123

# Puis télécharger les fichiers
action: upload
paths:
  - "/Users/you/Documents/resume.pdf"
  - "/Users/you/Documents/photo.jpg"
ref: "upload_button"  # Optionnel: spécifier le ref du sélecteur de fichiers
targetId: tab_abc123
profile: clawd
```

**Vous devriez voir**:

```
✓ Files uploaded: 2
  - /Users/you/Documents/resume.pdf
  - /Users/you/Documents/photo.jpg
```

::: warning Note sur les chemins de fichiers

- Utilisez des chemins absolus, les chemins relatifs ne sont pas supportés
- Assurez-vous que les fichiers existent et ont des droits de lecture
- Plusieurs fichiers sont téléchargés dans l'ordre du tableau

:::

### Étape 7: Gérer les boîtes de dialogue

**Pourquoi**

Gérer automatiquement les boîtes de dialogue alert, confirm, prompt dans les pages web.

```bash
# Accepter la boîte de dialogue (alert/confirm)
action: dialog
accept: true
targetId: tab_abc123
profile: clawd

# Rejeter la boîte de dialogue (confirm)
action: dialog
accept: false
targetId: tab_abc123
profile: clawd

# Répondre à la boîte de dialogue prompt
action: dialog
accept: true
promptText: "Réponse de l'utilisateur"
targetId: tab_abc123
profile: clawd
```

**Vous devriez voir**:

```
✓ Dialog handled: accepted (prompt: "Réponse de l'utilisateur")
```

## Problèmes courants

### ❌ Erreur: Relais d'extension Chrome non connecté

**Message d'erreur**:
```
No Chrome tabs are attached via Clawdbot Browser Relay extension. Click toolbar icon on tab you want to control (badge ON), then retry.
```

**Cause**: Vous avez utilisé `profile="chrome"` mais aucun onglet n'est attaché

**Solution**:

1. Installez l'extension Clawdbot Browser Relay (Chrome Web Store)
2. Cliquez sur l'icône de l'extension dans l'onglet que vous voulez contrôler (badge ON)
3. Réexécutez `action: snapshot profile="chrome"`

### ❌ Erreur: Référence d'élément expirée (stale targetId)

**Message d'erreur**:
```
Chrome tab not found (stale targetId?). Run action=tabs profile="chrome" and use one of the returned targetIds.
```

**Cause**: L'onglet a été fermé ou le targetId a expiré

**Solution**:

```bash
# Obtenir à nouveau la liste des onglets
action: tabs
profile: chrome

# Utiliser le nouveau targetId
action: snapshot
targetId: "nouveau_targetId"
profile: chrome
```

### ❌ Erreur: Serveur de contrôle du navigateur non démarré

**Message d'erreur**:
```
Browser control server not available. Run action=start first.
```

**Cause**: Le serveur de contrôle du navigateur n'est pas démarré

**Solution**:

```bash
# Démarrer le navigateur
action: start
profile: clawd
target: sandbox
```

### ❌ Erreur: Timeout de connexion du navigateur distant

**Message d'erreur**:
```
Remote CDP handshake timeout. Check remoteCdpTimeoutMs/remoteCdpHandshakeTimeoutMs.
```

**Cause**: Timeout de connexion du navigateur distant

**Solution**:

```bash
# Augmenter le timeout dans le fichier de configuration
# ~/.clawdbot/clawdbot.json
{
  "browser": {
    "remoteCdpTimeoutMs": 3000,
    "remoteCdpHandshakeTimeoutMs": 5000
  }
}
```

### ❌ Erreur: Proxy de navigateur de nœud non disponible

**Message d'erreur**:
```
Node browser proxy is disabled (gateway.nodes.browser.mode=off).
```

**Cause**: Le proxy de navigateur de nœud est désactivé

**Solution**:

```bash
# Activer le navigateur de nœud dans le fichier de configuration
# ~/.clawdbot/clawdbot.json
{
  "gateway": {
    "nodes": {
      "browser": {
        "mode": "auto"  # ou "manual"
      }
    }
  }
}
```

## Résumé de la leçon

Dans cette leçon, vous avez appris:

✅ **Contrôle du navigateur**: Démarrer/arrêter/vérifier l'état
✅ **Gestion des onglets**: Ouvrir/focaliser/fermer des onglets
✅ **Instantanés de page**: Format AI/ARIA, obtenir les références d'éléments
✅ **Automatisation UI**: click/type/drag/fill/wait/evaluate
✅ **Captures d'écran**: Format PNG/JPEG, captures de page complète ou d'élément
✅ **Téléchargement de fichiers**: Gérer les sélecteurs de fichiers, support multi-fichiers
✅ **Gestion des boîtes de dialogue**: accept/reject/alert/confirm/prompt
✅ **Relais Chrome**: Utilisez `profile="chrome"` pour contrôler les onglets existants
✅ **Proxy de nœud**: Exécutez sur les appareils via `target="node"`

**Référence rapide des opérations clés**:

| Opération | Action | Paramètres clés |
| ---- | ------ | -------- |
| Démarrer navigateur | `start` | `profile` (clawd/chrome) |
| Ouvrir page web | `open` | `targetUrl` |
| Obtenir instantané | `snapshot` | `targetId`, `snapshotFormat`, `refs` |
| Opération UI | `act` | `request.kind`, `request.ref` |
| Capture d'écran | `screenshot` | `targetId`, `fullPage`, `ref` |
| Télécharger fichiers | `upload` | `paths`, `ref` |
| Boîte de dialogue | `dialog` | `accept`, `promptText` |

## Prochaine leçon

> Dans la prochaine leçon, nous apprendrons les **[Outils d'Exécution de Commandes et Approbation](../tools-exec/)**.
>
> Vous apprendrez:
> - Configurer et utiliser l'outil exec
> - Comprendre le mécanisme d'approbation de sécurité
> - Configurer allowlist pour contrôler les commandes exécutables
> - Utiliser le sandbox pour isoler les opérations à risque

---

## Annexe: Référence du code source

<details>
<summary><strong>Cliquez pour développer l'emplacement du code source</strong></summary>

> Date de mise à jour: 2026-01-27

| Fonction | Chemin du fichier | Numéro de ligne |
| ---- | -------- | ---- |
| Définition de l'outil Browser | [`src/agents/tools/browser-tool.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/browser-tool.ts) | 269-791 |
| Browser Schema | [`src/agents/tools/browser-tool.schema.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/browser-tool.schema.ts) | 1-115 |
| Définition des types Action | [`src/browser/client-actions-core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/browser/client-actions-core.ts) | 18-86 |
| Analyse de configuration du navigateur | [`src/browser/config.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/browser/config.ts) | 140-231 |
| Constantes du navigateur | [`src/browser/constants.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/browser/constants.ts) | 1-9 |
| Client CDP | [`src/browser/cdp.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/browser/cdp.ts) | 1-500 |
| Détection des exécutables Chrome | [`src/browser/chrome.executables.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/browser/chrome.executables.ts) | 1-500 |

**Constantes clés**:
- `DEFAULT_CLAWD_BROWSER_CONTROL_URL = "http://127.0.0.1:18791"`: Adresse du serveur de contrôle par défaut (source: `src/browser/constants.ts:2`)
- `DEFAULT_AI_SNAPSHOT_MAX_CHARS = 80000`: Nombre maximum de caractères par défaut pour les instantanés AI (source: `src/browser/constants.ts:6`)
- `DEFAULT_AI_SNAPSHOT_EFFICIENT_MAX_CHARS = 10000`: Nombre maximum de caractères en mode efficient (source: `src/browser/constants.ts:7`)
- `DEFAULT_AI_SNAPSHOT_EFFICIENT_DEPTH = 6`: Profondeur en mode efficient (source: `src/browser/constants.ts:8`)

**Fonctions clés**:
- `createBrowserTool()`: Crée l'outil de navigateur, définit toutes les actions et le traitement des paramètres
- `browserSnapshot()`: Obtient l'instantané de page, supporte le format AI/ARIA
- `browserScreenshotAction()`: Exécute l'opération de capture d'écran, supporte les captures de page complète et d'élément
- `browserAct()`: Exécute les opérations d'automatisation UI (click/type/drag/fill/wait/evaluate, etc.)
- `browserArmFileChooser()`: Gère le téléchargement de fichiers, déclenche le sélecteur de fichiers
- `browserArmDialog()`: Gère les boîtes de dialogue (alert/confirm/prompt)
- `resolveBrowserConfig()`: Analyse la configuration du navigateur, retourne l'adresse et le port du serveur de contrôle
- `resolveProfile()`: Analyse la configuration du profile (clawd/chrome)

**Browser Actions Kind** (source: `src/agents/tools/browser-tool.schema.ts:5-17`):
- `click`: Cliquer sur l'élément
- `type`: Saisir du texte
- `press`: Appuyer sur une touche
- `hover`: Survoler
- `drag`: Glisser-déposer
- `select`: Sélectionner une option déroulante
- `fill`: Remplir un formulaire (plusieurs champs)
- `resize`: Ajuster la taille de la fenêtre
- `wait`: Attendre
- `evaluate`: Exécuter JavaScript
- `close`: Fermer l'onglet

**Browser Tool Actions** (source: `src/agents/tools/browser-tool.schema.ts:19-36`):
- `status`: Obtenir l'état du navigateur
- `start`: Démarrer le navigateur
- `stop`: Arrêter le navigateur
- `profiles`: Lister tous les profiles
- `tabs`: Lister tous les onglets
- `open`: Ouvrir un nouvel onglet
- `focus`: Focaliser un onglet
- `close`: Fermer un onglet
- `snapshot`: Obtenir un instantané de page
- `screenshot`: Capturer une capture d'écran
- `navigate`: Naviguer vers une URL spécifique
- `console`: Obtenir les messages de console
- `pdf`: Enregistrer la page en PDF
- `upload`: Télécharger des fichiers
- `dialog`: Gérer les boîtes de dialogue
- `act`: Exécuter des opérations UI

</details>

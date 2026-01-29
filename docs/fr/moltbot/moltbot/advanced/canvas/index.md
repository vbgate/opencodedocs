---
title: "Interface visuelle Canvas et A2UI | Tutoriel Clawdbot"
sidebarTitle: "Créer des interfaces visuelles pour l'IA"
subtitle: "Interface visuelle Canvas et A2UI"
description: "Apprenez à utiliser l'interface visuelle Canvas de Clawdbot, comprenez le mécanisme de push A2UI, la configuration de Canvas Host et les opérations Canvas sur les nœuds, et créez des interfaces interactives pour les assistants IA. Ce tutoriel couvre deux méthodes : HTML statique et A2UI dynamique, incluant la référence complète des commandes de l'outil canvas, les mécanismes de sécurité, les options de configuration et les conseils de dépannage."
tags:
  - "Canvas"
  - "A2UI"
  - "Interface visuelle"
  - "Nœuds"
prerequisite:
  - "start-getting-started"
  - "platforms-ios-node"
  - "platforms-android-node"
order: 240
---

# Interface visuelle Canvas et A2UI

## Ce que vous pourrez faire après cette leçon

À l'issue de cette leçon, vous serez capable de :

- Configurer Canvas Host et déployer des interfaces HTML/CSS/JS personnalisées
- Utiliser l'outil `canvas` pour contrôler les Canvas sur les nœuds (afficher, masquer, naviguer, exécuter JS)
- Maîtriser le protocole A2UI pour permettre à l'IA de pousser des mises à jour d'UI dynamiquement
- Capturer des captures d'écran de Canvas pour le contexte de l'IA
- Comprendre les mécanismes de sécurité et le contrôle d'accès de Canvas

## Votre situation actuelle

Vous disposez d'un assistant IA, mais il ne peut interagir avec vous que par texte. Vous souhaitez :

- Que l'IA affiche des interfaces visuelles, comme des tableaux, des graphiques, des formulaires
- Voir des interfaces dynamiques générées par des Agents sur des appareils mobiles
- Créer une expérience interactive de type "application" sans développement indépendant

## Quand utiliser cette technique

**Canvas + A2UI convient à ces scénarios** :

| Scénario | Exemple |
|--- | ---|
| **Visualisation de données** | Afficher des graphiques statistiques, des barres de progression, des chronologies |
| **Formulaires interactifs** | Demander à l'utilisateur de confirmer des actions, de sélectionner des options |
| **Panneaux d'état** | Afficher en temps réel la progression des tâches, l'état du système |
| **Jeux et divertissement** | Mini-jeux simples, démonstrations interactives |

::: tip A2UI vs HTML statique
- **A2UI**(Agent-to-UI) : L'IA génère et met à jour l'UI dynamiquement, adapté aux données en temps réel
- **HTML statique** : Interfaces prédéfinies, adapté aux mises en page fixes et aux interactions complexes
:::

## 🎒 Préparatifs

Avant de commencer, assurez-vous d'avoir complété :

- [ ] **Gateway démarré** : Canvas Host démarre automatiquement avec Gateway par défaut (port 18793)
- [ ] **Nœuds appairés** : Nœuds macOS/iOS/Android connectés à Gateway
- [ ] **Nœuds compatibles Canvas** : Confirmez que le nœud a la capacité `canvas` (`clawdbot nodes list`)

::: warning Connaissances préalables
Ce tutoriel suppose que vous connaissez déjà :
- [Appariement de base des nœuds](../../platforms/android-node/)
- [Mécanisme d'appel d'outils IA](../tools-browser/)
:::

## Concepts clés

Le système Canvas comprend trois composants principaux :

```
┌─────────────────┐
│   Canvas Host  │ ────▶ Serveur HTTP (port 18793)
│   (Gateway)   │        └── Dessert les fichiers ~/clawd/canvas/
└─────────────────┘
        │
        │ Communication WebSocket
        │
┌─────────────────┐
│    Node App   │ ────▶ WKWebView rend Canvas
│ (iOS/Android) │        └── Reçoit les pushs via A2UI
└─────────────────┘
        │
        │ Événements userAction
        │
┌─────────────────┐
│   AI Agent    │ ────▶ Appels à l'outil canvas
│  (pi-mono)   │        └── Pousse les mises à jour A2UI
└─────────────────┘
```

**Concepts clés** :

1. **Canvas Host**(côté Gateway)
   - Fournit le service de fichiers statiques : `http://<gateway-host>:18793/__clawdbot__/canvas/`
   - Héberge l'hôte A2UI : `http://<gateway-host>:18793/__clawdbot__/a2ui/`
   - Prend en charge le rechargement à chaud : mise à jour automatique après modification des fichiers

2. **Canvas Panel**(côté nœud)
   - Les nœuds macOS/iOS/Android intègrent WKWebView
   - Se connectent à Gateway via WebSocket (rechargement en temps réel, communication A2UI)
   - Supportent `eval` pour exécuter JS, `snapshot` pour capturer l'écran

3. **Protocole A2UI**(v0.8)
   - L'Agent pousse les mises à jour d'UI via WebSocket
   - Supporte : `beginRendering`, `surfaceUpdate`, `dataModelUpdate`, `deleteSurface`

## Suivez les étapes

### Étape 1 : Vérifier l'état de Canvas Host

**Pourquoi**
S'assurer que Canvas Host est en cours d'exécution pour que les nœuds puissent charger le contenu Canvas.

```bash
# Vérifier si le port 18793 est en écoute
lsof -i :18793
```

**Vous devriez voir** :

```text
COMMAND   PID   USER   FD   TYPE   DEVICE SIZE/OFF NODE NAME
node     12345  user   16u  IPv6  0x1234      0t0  TCP *:18793 (LISTEN)
```

::: info Chemins de configuration
- **Répertoire racine Canvas** : `~/clawd/canvas/`(modifiable via `canvasHost.root`)
- **Port** : `18793` = `gateway.port + 4`(modifiable via `canvasHost.port`)
- **Rechargement à chaud** : Activé par défaut(désactivable via `canvasHost.liveReload: false`)
:::

### Étape 2 : Créer la première page Canvas

**Pourquoi**
Créer une interface HTML personnalisée pour afficher votre contenu sur le nœud.

```bash
# Créer le répertoire racine Canvas (s'il n'existe pas)
mkdir -p ~/clawd/canvas

# Créer un fichier HTML simple
cat > ~/clawd/canvas/hello.html <<'EOF'
<!doctype html>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Hello Canvas</title>
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    padding: 20px;
    background: #000;
    color: #fff;
    text-align: center;
  }
  h1 { color: #24e08a; }
</style>
<h1>🎉 Hello from Canvas!</h1>
<p>C'est votre première page Canvas.</p>
<button onclick="alert('Bouton cliqué !')">Cliquez ici</button>
EOF
```

**Vous devriez voir** :

```text
Fichier créé : ~/clawd/canvas/hello.html
```

### Étape 3 : Afficher Canvas sur le nœud

**Pourquoi**
Faire en sorte que le nœud charge et affiche la page que vous venez de créer.

Trouvez d'abord l'ID de votre nœud :

```bash
clawdbot nodes list
```

**Vous devriez voir** :

```text
ID                                  Name          Type       Capabilities
──────────────────────────────────────────────────────────────────────────
abc123-def456-ghi789               iOS Phone     canvas, camera, screen
jkl012-mno345-pqr678               Android Tab   canvas, camera
```

Ensuite affichez le Canvas (en utilisant le nœud iOS comme exemple) :

```bash
# Méthode 1 : Via commande CLI
clawdbot nodes canvas present --node abc123-def456-ghi789 --target http://127.0.0.1:18793/__clawdbot__/canvas/hello.html
```

**Vous devriez voir** :

- Un panneau sans bordures apparaît sur l'appareil iOS affichant votre contenu HTML
- Le panneau apparaît près de la barre de menus ou de la position de la souris
- Le contenu est centré avec un titre vert et un bouton

**Exemple d'appel IA** :

```
IA : J'ai ouvert un panneau Canvas sur votre appareil iOS affichant la page de bienvenue.
```

::: tip Format d'URL Canvas
- **Fichier local** : `http://<gateway-host>:18793/__clawdbot__/canvas/hello.html`
- **URL externe** : `https://example.com`(nécessite des permissions réseau du nœud)
- **Retour au défaut** : `/` ou chaîne vide, affiche la page d'échafaudage intégrée
:::

### Étape 4 : Utiliser A2UI pour pousser l'UI dynamique

**Pourquoi**
L'IA peut pousser des mises à jour d'UI directement vers Canvas sans modifier les fichiers, adapté aux données en temps réel et à l'interaction.

**Méthode A : Push rapide de texte**

```bash
clawdbot nodes canvas a2ui push --node abc123-def456-ghi789 --text "Hello from A2UI"
```

**Vous devriez voir** :

- Canvas affiche l'interface A2UI bleue
- Texte centré affichant : `Hello from A2UI`

**Méthode B : Push complet JSONL**

Créez un fichier de définition A2UI :

```bash
cat > /tmp/a2ui-demo.jsonl <<'EOF'
{"surfaceUpdate":{"surfaceId":"main","components":[{"id":"root","component":{"Column":{"children":{"explicitList":["title","status","button"]}}}},{"id":"title","component":{"Text":{"text":{"literalString":"Démo A2UI"},"usageHint":"h1"}}},{"id":"status","component":{"Text":{"text":{"literalString":"État du système : En cours d'exécution"},"usageHint":"body"}}},{"id":"button","component":{"Button":{"label":{"literalString":"Bouton de test"},"onClick":{"action":{"name":"testAction","sourceComponentId":"demo.test"}}}}}]}
{"beginRendering":{"surfaceId":"main","root":"root"}}
EOF
```

Pussez A2UI :

```bash
clawdbot nodes canvas a2ui push --node abc123-def456-ghi789 --jsonl /tmp/a2ui-demo.jsonl
```

**Vous devriez voir** :

```
┌────────────────────────────┐
│     Démo A2UI         │
│                        │
│  État du système : En cours d'exécution  │
│                        │
│   [ Bouton de test ]          │
└────────────────────────────┘
```

::: details Explication du format JSONL A2UI
JSONL (JSON Lines) contient un objet JSON par ligne, adapté aux mises à jour en streaming :

```jsonl
{"surfaceUpdate":{...}}   // Mettre à jour les composants de surface
{"beginRendering":{...}}   // Démarrer le rendu
{"dataModelUpdate":{...}} // Mettre à jour le modèle de données
{"deleteSurface":{...}}   // Supprimer la surface
```
:::

### Étape 5 : Exécuter le JavaScript Canvas

**Pourquoi**
Exécuter du JS personnalisé dans Canvas, comme modifier le DOM, lire l'état.

```bash
clawdbot nodes canvas eval --node abc123-def456-ghi789 --js "document.title"
```

**Vous devriez voir** :

```text
"Hello from Canvas"
```

::: tip Exemples d'exécution JS
- Lire l'élément : `document.querySelector('h1').textContent`
- Modifier le style : `document.body.style.background = '#333'`
- Calculer une valeur : `innerWidth + 'x' + innerHeight`
- Exécuter une fermeture : `(() => { ... })()`
:::

### Étape 6 : Capturer une capture d'écran Canvas

**Pourquoi**
Permettre à l'IA de voir l'état actuel de Canvas pour la compréhension du contexte.

```bash
# Format par défaut (JPEG)
clawdbot nodes canvas snapshot --node abc123-def456-ghi789

# Format PNG + limite de largeur maximale
clawdbot nodes canvas snapshot --node abc123-def456-ghi789 --format png --max-width 1200

# JPEG haute qualité
clawdbot nodes canvas snapshot --node abc123-def456-ghi789 --format jpg --quality 0.9
```

**Vous devriez voir** :

```text
Canvas snapshot saved to: /var/folders/.../canvas-snapshot.jpg
```

Le chemin du fichier est généré automatiquement par le système, généralement dans le répertoire temporaire.

### Étape 7 : Masquer Canvas

**Pourquoi**
Fermer le panneau Canvas pour libérer l'espace d'écran.

```bash
clawdbot nodes canvas hide --node abc123-def456-ghi789
```

**Vous devriez voir** :

- Le panneau Canvas sur l'appareil iOS disparaît
- L'état du nœud se rétablit (s'il était occupé auparavant)

## Point de contrôle ✅

**Vérifier que les fonctions Canvas fonctionnent correctement** :

| Élément de vérification | Méthode de vérification |
|--- | ---|
| Canvas Host en cours d'exécution | `lsof -i :18793` a une sortie |
| Capacité de nœud Canvas | `clawdbot nodes list` affiche `canvas` |
| Page chargée avec succès | Le nœud affiche le contenu HTML |
| Push A2UI réussi | Canvas affiche l'interface A2UI bleue |
| Exécution JS renvoie un résultat | La commande `eval` renvoie une valeur |
| Capture d'écran générée | Le répertoire temporaire a un fichier `.jpg` ou `.png` |

## Avertissements

::: warning Limitations premier plan/arrière-plan
- **Nœuds iOS/Android** : Les commandes `canvas.*` et `camera.*` **doivent être exécutées au premier plan**
- Les appels en arrière-plan renverront : `NODE_BACKGROUND_UNAVAILABLE`
- Solution : Réveiller l'appareil au premier plan
:::

::: danger Précautions de sécurité
- **Protection contre le parcours de répertoire** : Les URL Canvas interdisent `..` pour accéder aux répertoires supérieurs
- **Schéma personnalisé** : `clawdbot-canvas://` limité uniquement à l'usage interne du nœud
- **Restrictions HTTPS** : Les URL HTTPS externes nécessitent des permissions réseau du nœud
- **Accès aux fichiers** : Canvas Host permet uniquement l'accès aux fichiers sous `canvasHost.root`
:::

::: tip Conseils de débogage
- **Voir les journaux Gateway** : `clawdbot gateway logs`
- **Voir les journaux de nœud** : iOS Réglages → Debug Logs, Journaux dans l'application Android
- **Tester l'URL** : Accédez directement dans le navigateur à `http://<gateway-host>:18793/__clawdbot__/canvas/`
:::

## Résumé de la leçon

Dans cette leçon, vous avez appris :

1. **Architecture Canvas** : Comprendre la relation entre Canvas Host, Node App et le protocole A2UI
2. **Configurer Canvas Host** : Ajuster le répertoire racine, le port et la configuration du rechargement à chaud
3. **Créer des pages personnalisées** : Écrire HTML/CSS/JS et déployer sur les nœuds
4. **Utiliser A2UI** : Pousser des mises à jour d'UI dynamique via JSONL
5. **Exécuter JavaScript** : Exécuter du code dans Canvas, lire et modifier l'état
6. **Capturer des captures d'écran** : Permettre à l'IA de voir l'état actuel de Canvas

**Points clés** :

- Canvas Host démarre automatiquement avec Gateway, ne nécessite pas de configuration supplémentaire
- A2UI est adapté aux données en temps réel, HTML statique pour les interactions complexes
- Les nœuds doivent être au premier plan pour exécuter les opérations Canvas
- Utiliser `canvas snapshot` pour transmettre l'état de l'UI à l'IA

## Prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[Réveil vocal et synthèse vocale](../voice-tts/)**.
>
> Vous apprendrez :
> - Configurer les mots-clés de réveil Voice Wake
> - Utiliser Talk Mode pour des conversations vocales continues
> - Intégrer plusieurs fournisseurs TTS (Edge, Deepgram, ElevenLabs)

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Date de mise à jour : 2026-01-27

| Fonction | Chemin du fichier | Numéro de ligne |
|--- | --- | ---|
| Serveur Canvas Host | [`src/canvas-host/server.ts`](https://github.com/moltbot/moltbot/blob/main/src/canvas-host/server.ts) | 372-441 |
| Traitement du protocole A2UI | [`src/canvas-host/a2ui.ts`](https://github.com/moltbot/moltbot/blob/main/src/canvas-host/a2ui.ts) | 150-203 |
| Définition de l'outil Canvas | [`src/agents/tools/canvas-tool.ts`](https://github.com/moltbot/moltbot/blob/main/src/agents/tools/canvas-tool.ts) | 52-179 |
| Constantes de chemin Canvas | [`src/canvas-host/a2ui.ts`](https://github.com/moltbot/moltbot/blob/main/src/canvas-host/a2ui.ts) | 8-10 |

**Constantes clés** :
- `A2UI_PATH = "/__clawdbot__/a2ui"` : Chemin de l'hôte A2UI
- `CANVAS_HOST_PATH = "/__clawdbot__/canvas"` : Chemin des fichiers Canvas
- `CANVAS_WS_PATH = "/__clawdbot__/ws"` : Chemin de rechargement à chaud WebSocket

**Fonctions clés** :
- `createCanvasHost()` : Démarrer le serveur HTTP Canvas (port 18793)
- `injectCanvasLiveReload()` : Injecter le script de rechargement à chaud WebSocket dans HTML
- `handleA2uiHttpRequest()` : Gérer les demandes de ressources A2UI
- `createCanvasTool()` : Enregistrer l'outil `canvas` (present/hide/navigate/eval/snapshot/a2ui_push/a2ui_reset)

**Actions Canvas prises en charge** :
- `present` : Afficher Canvas (URL, position, taille optionnels)
- `hide` : Masquer Canvas
- `navigate` : Naviguer vers l'URL (chemin local/HTTP/file://)
- `eval` : Exécuter JavaScript
- `snapshot` : Capturer une capture d'écran (PNG/JPEG, maxWidth/quality optionnels)
- `a2ui_push` : Pousser les mises à jour A2UI (JSONL ou texte)
- `a2ui_reset` : Réinitialiser l'état A2UI

**Schéma de configuration** :
- `canvasHost.root` : Répertoire racine Canvas (par défaut `~/clawd/canvas`)
- `canvasHost.port` : Port HTTP (par défaut 18793)
- `canvasHost.liveReload` : Activer le rechargement à chaud (par défaut true)
- `canvasHost.enabled` : Activer Canvas Host (par défaut true)

**Messages pris en charge par A2UI v0.8** :
- `beginRendering` : Démarrer le rendu d'une surface spécifique
- `surfaceUpdate` : Mettre à jour les composants de surface (Column, Text, Button, etc.)
- `dataModelUpdate` : Mettre à jour le modèle de données
- `deleteSurface` : Supprimer une surface spécifique

</details>

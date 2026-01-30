---
title: "Référence de Configuration opencode-notify : Guide Complet des Options et Différences par Plateforme"
sidebarTitle: "Personnaliser les Notifications"
subtitle: "Référence de Configuration : Guide Complet des Options"
description: "Apprenez toutes les options de configuration d'opencode-notify, incluant la notification des sous-sessions, les sons personnalisés, les heures silencieuses et la détection de terminal. Ce tutoriel fournit des explications détaillées des paramètres, valeurs par défaut, différences par plateforme et exemples complets pour vous aider à personnaliser le comportement des notifications et optimiser votre flux de travail sur macOS, Windows et Linux."
order: 70
tags:
  - "Référence de Configuration"
  - "Configuration Avancée"
prerequisite:
  - "start-quick-start"
---

# Référence de Configuration

## Ce que Vous Apprendrez

- ✅ Comprendre tous les paramètres configurables et leur signification
- ✅ Personnaliser le comportement des notifications selon vos besoins
- ✅ Configurer des heures silencieuses pour éviter les interruptions à des moments spécifiques
- ✅ Comprendre l'impact des différences entre plateformes sur la configuration

## Votre Situation Actuelle

La configuration par défaut est suffisante, mais votre flux de travail peut être particulier :
- Vous devez recevoir des notifications importantes la nuit, mais ne pas être dérangé le reste du temps
- Vous travaillez avec plusieurs sessions en parallèle et souhaitez être notifié pour toutes
- Vous travaillez dans tmux et constatez que la détection du focus ne fonctionne pas comme prévu
- Vous voulez savoir ce que fait exactement un paramètre de configuration

## Quand Utiliser ces Paramètres

- **Vous devez personnaliser le comportement des notifications** - La configuration par défaut ne correspond pas à vos habitudes de travail
- **Vous voulez réduire les interruptions** - Configurez les heures silencieuses ou le paramètre de sous-sessions
- **Vous voulez déboguer le comportement du plugin** - Comprenez le rôle de chaque paramètre
- **Vous utilisez plusieurs plateformes** - Apprenez comment les différences entre plateformes affectent la configuration

## Concept Principal

Le fichier de configuration vous permet d'ajuster le comportement du plugin sans modifier le code, comme un "menu de paramètres" pour le plugin. Le fichier de configuration est au format JSON et se trouve à `~/.config/opencode/kdco-notify.json`.

**Flux de Chargement de la Configuration** :

```
Démarrage du plugin
    ↓
Lecture du fichier de configuration utilisateur
    ↓
Fusion avec la configuration par défaut (priorité à la configuration utilisateur)
    ↓
Exécution avec la configuration fusionnée
```

::: info Chemin du Fichier de Configuration
`~/.config/opencode/kdco-notify.json`
:::

## 📋 Explication des Paramètres

### Structure Complète de la Configuration

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine",
    "question": "Submarine"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  },
  "terminal": ""
}
```

### Explications Détaillées

#### notifyChildSessions

| Paramètre | Type | Valeur par Défaut | Description |
| --- | --- | --- | --- |
| `notifyChildSessions` | boolean | `false` | Activer les notifications pour les sous-sessions |

**Rôle** : Contrôle si les notifications sont envoyées pour les sous-sessions.

**Qu'est-ce qu'une Sous-Session** :
Quand vous utilisez la fonction multi-sessions d'OpenCode, les sessions peuvent être divisées en sessions parentes et sous-sessions. Les sous-sessions sont généralement des tâches auxiliaires lancées par la session parente, comme la lecture/écriture de fichiers ou les requêtes réseau.

**Comportement par Défaut** (`false`) :
- Seules les notifications des événements de complétion, d'erreur et de demande de permission de la session parente sont envoyées
- Aucun événement des sous-sessions n'est notifié
- Cela évite de recevoir de nombreuses notifications lors de l'exécution de plusieurs tâches en parallèle

**Après Activation** (`true`) :
- Toutes les sessions (parentes et sous-sessions) envoient des notifications
- Convient aux scénarios où vous devez suivre la progression de chaque sous-tâche

::: tip Paramètre Recommandé
Gardez la valeur par défaut `false`, sauf si vous devez vraiment suivre l'état de chaque sous-tâche.
:::

#### Détection du Focus (macOS)

Le plugin détecte automatiquement si le terminal est au premier plan. Si le terminal est la fenêtre active, la notification est supprimée pour éviter les rappels répétés.

**Principe de Fonctionnement** :
- Utilise `osascript` de macOS pour détecter l'application au premier plan
- Compare le nom du processus de l'application au premier plan avec celui de votre terminal
- Si le terminal est au premier plan, aucune notification n'est envoyée
- **Les notifications de questions sont exclues** (prise en charge du flux de travail tmux)

::: info Différences entre Plateformes
La fonction de détection du focus ne fonctionne que sur macOS. Windows et Linux ne prennent pas en charge cette fonctionnalité.
:::

#### sounds

| Paramètre | Type | Valeur par Défaut | Plateforme | Description |
| --- | --- | --- | --- | --- |
| `sounds.idle` | string | `"Glass"` | ✅ macOS | Son de complétion de tâche |
| `sounds.error` | string | `"Basso"` | ✅ macOS | Son d'erreur |
| `sounds.permission` | string | `"Submarine"` | ✅ macOS | Son de demande de permission |
| `sounds.question` | string | non défini | ✅ macOS | Son de question (optionnel) |

**Rôle** : Définit différents sons système pour différents types de notifications (uniquement macOS).

**Liste des Sons Disponibles** :

| Nom du Son | Caractéristique | Scénario Recommandé |
| --- | --- | --- |
| Glass | Léger, cristallin | Complétion de tâche (par défaut) |
| Basso | Grave, avertissement | Notification d'erreur (par défaut) |
| Submarine | Rappel, doux | Demande de permission (par défaut) |
| Blow | Puissant | Événement important |
| Bottle | Cristallin | Complétion de sous-tâche |
| Frog | Légère | Rappel informel |
| Funk | Rythmé | Complétion de plusieurs tâches |
| Hero | Majestueux | Jalon atteint |
| Morse | Code Morse | Lié au débogage |
| Ping | Cristallin | Rappel léger |
| Pop | Court | Tâche rapide |
| Purr | Doux | Rappel discret |
| Sosumi | Unique | Événement spécial |
| Tink | Clair | Petite tâche terminée |

**Notes sur le champ question** :
`sonds.question` est un champ optionnel utilisé pour les notifications de question de l'IA. S'il n'est pas défini, le son de `permission` sera utilisé.

::: tip Astuce de Configuration des Sons
- Utilisez des sons légers pour le succès (idle)
- Utilisez des sons graves pour les erreurs (error)
- Utilisez des sons doux pour attirer l'attention (permission, question)
- La combinaison de différents sons vous permet de comprendre la situation sans regarder les notifications
:::

::: warning Différences entre Plateformes
La configuration `sounds` n'est effective que sur macOS. Windows et Linux utiliseront le son de notification par défaut du système, qui ne peut pas être personnalisé.
:::

#### quietHours

| Paramètre | Type | Valeur par Défaut | Description |
| --- | --- | --- | --- |
| `quietHours.enabled` | boolean | `false` | Activer les heures silencieuses |
| `quietHours.start` | string | `"22:00"` | Heure de début du silence (format HH:MM) |
| `quietHours.end` | string | `"08:00"` | Heure de fin du silence (format HH:MM) |

**Rôle** : Supprime l'envoi de toutes les notifications pendant la période spécifiée.

**Comportement par Défaut** (`enabled: false`) :
- Les heures silencieuses ne sont pas activées
- Les notifications peuvent être reçues à tout moment

**Après Activation** (`enabled: true`) :
- Aucune notification n'est envoyée entre `start` et `end`
- Prend en charge les périodes traversant minuit (comme 22:00-08:00)

**Format de l'Heure** :
- Utilise le format 24 heures `HH:MM`
- Exemple : `"22:30"` représente 22h30

**Période Traversant Minuit** :
- Si `start > end` (comme 22:00-08:00), cela indique une période traversant minuit
- De 22h à 8h du matin suivant fait partie des heures silencieuses

::: info Priorité des Heures Silencieuses
Les heures silencieuses ont la priorité la plus élevée. Même si toutes les autres conditions sont remplies, aucune notification ne sera envoyée pendant les heures silencieuses.
:::

#### terminal

| Paramètre | Type | Valeur par Défaut | Description |
| --- | --- | --- | --- |
| `terminal` | string | non défini | Spécifier manuellement le type de terminal (remplace la détection automatique) |

**Rôle** : Spécifier manuellement le type d'émulateur de terminal que vous utilisez, remplaçant la détection automatique du plugin.

**Comportement par Défaut** (non défini) :
- Le plugin utilise la bibliothèque `detect-terminal` pour détecter automatiquement votre terminal
- Prend en charge plus de 37 émulateurs de terminal

**Après Configuration** :
- Le plugin utilise le type de terminal spécifié
- Utilisé pour la détection du focus et la fonction de clic pour focus (macOS)

**Valeurs de Terminal Courantes** :

| Application Terminal | Valeur de Configuration |
| --- | --- |
| Ghostty | `"ghostty"` |
| Kitty | `"kitty"` |
| iTerm2 | `"iterm2"` |
| WezTerm | `"wezterm"` |
| Alacritty | `"alacritty"` |
| Terminal macOS | `"terminal"` |
| Hyper | `"hyper"` |
| Warp | `"warp"` |
| Terminal Intégré VS Code | `"vscode"` |

::: tip Quand Définir Manuellement
- La détection automatique échoue et la détection du focus ne fonctionne pas
- Vous utilisez plusieurs terminaux et devez en spécifier un
- Le nom de votre terminal n'est pas dans la liste courante
:::

## Résumé des Différences entre Plateformes

Le niveau de prise en charge des paramètres varie selon les plateformes :

| Paramètre | macOS | Windows | Linux |
| --- | --- | --- | --- |
| `notifyChildSessions` | ✅ | ✅ | ✅ |
| Détection du focus (codé en dur) | ✅ | ❌ | ❌ |
| `sounds.*` | ✅ | ❌ | ❌ |
| `quietHours.*` | ✅ | ✅ | ✅ |
| `terminal` | ✅ | ✅ | ✅ |

::: warning Note pour les Utilisateurs Windows/Linux
La configuration `sounds` et la fonction de détection du focus ne fonctionnent pas sur Windows et Linux.
- Windows/Linux utiliseront le son de notification par défaut du système
- Windows/Linux ne prennent pas en charge la détection du focus (ne peut pas être contrôlé par configuration)
:::

## Exemples de Configuration

### Configuration de Base (Recommandée)

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

Cette configuration convient à la plupart des utilisateurs :
- Ne notifie que les sessions parentes, évitant le bruit des sous-tâches
- Sur macOS, les notifications sont automatiquement supprimées quand le terminal est au premier plan (aucune configuration nécessaire)
- Utilise la combinaison de sons par défaut
- N'active pas les heures silencieuses

### Activer les Heures Silencieuses

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  },
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

Convient aux utilisateurs qui souhaitent ne pas être dérangés la nuit :
- Aucune notification n'est envoyée entre 22h et 8h du matin
- Notifications normales aux autres moments

### Suivre Toutes les Sous-Tâches

```json
{
  "notifyChildSessions": true,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine",
    "question": "Ping"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

Convient aux utilisateurs qui doivent suivre la progression de toutes les tâches :
- Toutes les sessions (parentes et sous-sessions) envoient des notifications
- Définit un son indépendant pour les questions (Ping)

### Spécifier Manuellement le Terminal

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  },
  "terminal": "ghostty"
}
```

Convient aux utilisateurs dont la détection automatique échoue ou qui utilisent plusieurs terminaux :
- Spécifie manuellement l'utilisation du terminal Ghostty
- Assure le bon fonctionnement de la détection du focus et de la fonction de clic pour focus

### Configuration Minimale Windows/Linux

```json
{
  "notifyChildSessions": false,
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

Convient aux utilisateurs Windows/Linux (configuration simplifiée) :
- Ne conserve que les paramètres pris en charge par la plateforme
- La configuration `sounds` et la fonction de détection du focus sont inefficaces sur Windows/Linux, inutile de les configurer

## Gestion du Fichier de Configuration

### Créer le Fichier de Configuration

**macOS/Linux** :

```bash
# Créer le répertoire de configuration (s'il n'existe pas)
mkdir -p ~/.config/opencode

# Créer le fichier de configuration
nano ~/.config/opencode/kdco-notify.json
```

**Windows (PowerShell)** :

```powershell
# Créer le répertoire de configuration (s'il n'existe pas)
New-Item -ItemType Directory -Path "$env:APPDATA\opencode" -Force

# Créer le fichier de configuration
notepad "$env:APPDATA\opencode\kdco-notify.json"
```

### Vérifier le Fichier de Configuration

**Vérifier l'existence du fichier** :

```bash
# macOS/Linux
cat ~/.config/opencode/kdco-notify.json

# Windows PowerShell
Get-Content "$env:APPDATA\opencode\kdco-notify.json"
```

**Vérifier si la configuration est effective** :

1. Modifiez le fichier de configuration
2. Redémarrez OpenCode (ou déclenchez le rechargement de la configuration)
3. Observez si le comportement des notifications correspond aux attentes

### Gestion des Erreurs de Configuration

Si le format du fichier de configuration est incorrect :
- Le plugin ignorera le fichier de configuration erroné
- Il utilisera la configuration par défaut pour continuer à fonctionner
- Il affichera un message d'avertissement dans les journaux OpenCode

**Erreurs JSON Courantes** :

| Type d'Erreur | Exemple | Méthode de Correction |
|---|---|---|
| Virgule manquante | `"key1": "value1" "key2": "value2"` | Ajoutez une virgule : `"key1": "value1",` |
| Virgule en trop | `"key1": "value1",}` | Supprimez la dernière virgule : `"key1": "value1"}` |
| Guillemets non fermés | `"key": value` | Ajoutez des guillemets : `"key": "value"` |
| Utilisation de guillemets simples | `'key': 'value'` | Utilisez des guillemets doubles : `"key": "value"` |
| Erreur de syntaxe de commentaire | `{"key": "value" /* comment */}` | JSON ne supporte pas les commentaires, supprimez-les |

::: tip Utiliser un Outil de Validation JSON
Vous pouvez utiliser des outils de validation JSON en ligne (comme jsonlint.com) pour vérifier si le format du fichier de configuration est correct.
:::

## Résumé de la Leçon

Cette leçon fournit une référence de configuration complète pour opencode-notify :

**Paramètres de Configuration Principaux** :

| Paramètre | Rôle | Valeur par Défaut | Support Plateforme |
|---|---|---|---|
| `notifyChildSessions` | Interrupteur de notification des sous-sessions | `false` | Toutes plateformes |
| Détection du focus | Suppression par focus du terminal (codé en dur) | Aucune configuration | macOS uniquement |
| `sounds.*` | Sons personnalisés | Voir chaque champ | macOS uniquement |
| `quietHours.*` | Configuration des heures silencieuses | Voir chaque champ | Toutes plateformes |
| `terminal` | Spécification manuelle du terminal | Non défini | Toutes plateformes |

**Principes de Configuration** :
- **La plupart des utilisateurs** : La configuration par défaut suffit
- **Besoin de silence** : Activez `quietHours`
- **Besoin de suivre les sous-tâches** : Activez `notifyChildSessions`
- **Utilisateurs macOS** : Peuvent personnaliser `sounds` et profiter de la détection automatique du focus
- **Utilisateurs Windows/Linux** : Moins d'options de configuration, concentrez-vous sur `notifyChildSessions` et `quietHours`

**Chemin du Fichier de Configuration** : `~/.config/opencode/kdco-notify.json`

## Aperçu de la Prochaine Leçon

> Dans la prochaine leçon, nous apprendrons **[Heures Silencieuses en Détail](../quiet-hours/)**.
>
> Vous apprendrez :
> - Le fonctionnement détaillé des heures silencieuses
> - Comment configurer les périodes traversant minuit
> - La priorité des heures silencieuses par rapport aux autres configurations
> - Problèmes courants et solutions

---

## Annexe : Référence du Code Source

<details>
<summary><strong>Cliquez pour Développer et Voir l'Emplacement du Code Source</strong></summary>

> Dernière mise à jour : 2026-01-27

| Fonctionnalité | Chemin du Fichier | Numéro de Ligne |
|---|---|---|
| Définition de l'Interface de Configuration | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L30-L48) | 30-48 |
| Configuration par Défaut | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |
| Chargement du Fichier de Configuration | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L91-L114) | 91-114 |
| Vérification des Sous-Sessions | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L256-L259) | 256-259 |
| Vérification du Focus du Terminal | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L265) | 265 |
| Vérification des Heures Silencieuses | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L262) | 262 |
| Utilisation de la Configuration des Sons | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L236) | 227-236 |
| Exemple de Configuration README | [`README.md`](https://github.com/kdcokenny/opencode-notify/blob/main/README.md#L68-L79) | 68-79 |

**Interface de Configuration** (NotifyConfig) :

```typescript
interface NotifyConfig {
  /** Notifier les événements des sous-sessions (défaut : false) */
  notifyChildSessions: boolean
  /** Configuration des sons par type d'événement */
  sounds: {
    idle: string
    error: string
    permission: string
    question?: string
  }
  /** Configuration des heures silencieuses */
  quietHours: {
    enabled: boolean
    start: string // format "HH:MM"
    end: string // format "HH:MM"
  }
  /** Remplacer la détection du terminal (optionnel) */
  terminal?: string
}
```

**Note** : L'interface de configuration ne contient **pas** de champ `suppressWhenFocused`. La détection du focus est un comportement codé en dur de la plateforme macOS que les utilisateurs ne peuvent pas contrôler via le fichier de configuration.

**Configuration par Défaut** (DEFAULT_CONFIG) :

```typescript
const DEFAULT_CONFIG: NotifyConfig = {
  notifyChildSessions: false,
  sounds: {
    idle: "Glass",      // Son de complétion de tâche
    error: "Basso",     // Son d'erreur
    permission: "Submarine",  // Son de demande de permission
  },
  quietHours: {
    enabled: false,     // Heures silencieuses désactivées par défaut
    start: "22:00",    // 22h
    end: "08:00",      // 8h
  },
}
```

**Fonction de Chargement de la Configuration** (loadConfig) :

- Chemin : `~/.config/opencode/kdco-notify.json`
- Utilise `fs.readFile()` pour lire le fichier de configuration
- Fusionne avec `DEFAULT_CONFIG` (priorité à la configuration utilisateur)
- Les objets imbriqués (`sounds`, `quietHours`) sont également fusionnés
- Si le fichier de configuration n'existe pas ou est mal formé, utilise la configuration par défaut

**Vérification des Sous-Sessions** (isParentSession) :

- Vérifie si `sessionID` contient `/` (identifiant de sous-session)
- Si `notifyChildSessions` est `false`, saute les notifications des sous-sessions
- Les notifications de demande de permission (`permission.updated`) sont toujours envoyées, sans restriction

**Vérification du Focus du Terminal** (isTerminalFocused) :

- Utilise `osascript` pour obtenir le nom du processus de l'application au premier plan
- Compare avec le `processName` du terminal (insensible à la casse)
- Activé uniquement sur la plateforme macOS, **ne peut pas être désactivé via configuration**
- Les notifications de question (`question`) ne sont pas soumises à la vérification du focus (prise en charge du flux de travail tmux)

**Vérification des Heures Silencieuses** (isQuietHours) :

- Convertit l'heure actuelle en minutes (depuis minuit)
- Compare avec `start` et `end` configurés
- Prend en charge les périodes traversant minuit (comme 22:00-08:00)
- Si `start > end`, cela indique une période traversant minuit

**Utilisation de la Configuration des Sons** (sendNotification) :

- Lit le nom du son correspondant à l'événement depuis la configuration
- Passe à l'option `sound` de `node-notifier`
- Effectif uniquement sur la plateforme macOS
- Si le son de l'événement `question` n'est pas configuré, utilise le son de `permission`

</details>

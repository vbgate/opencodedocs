---
title: "Dépannage : notifications absentes, détection de focus défaillante et autres problèmes courants | Tutoriel opencode-notify"
sidebarTitle: "Notifications absentes ?"
subtitle: "Dépannage : notifications absentes, détection de focus défaillante et autres problèmes courants"
description: "Résolvez les problèmes courants d'opencode-notify : notifications absentes, détection de focus défaillante, erreurs de configuration, sons non joués. Apprenez à diagnostiquer les autorisations de notification macOS, les plages horaires silencieuses et la détection de terminal."
tags:
  - "Dépannage"
  - "FAQ"
prerequisite:
  - "start-quick-start"
order: 110
---

# Dépannage : notifications absentes, détection de focus défaillante et autres problèmes courants

## Ce que vous apprendrez

- Identifier rapidement pourquoi les notifications ne s'affichent pas
- Résoudre les problèmes d'autorisations de notification sur macOS
- Diagnostiquer les problèmes de détection de focus
- Corriger les erreurs de format dans les fichiers de configuration
- Comprendre les différences de fonctionnalités entre plateformes

## Le problème

L'IA a terminé une tâche, mais vous n'avez reçu aucune notification. Ou bien, cliquer sur une notification ne met pas le terminal au premier plan. Vous ne savez pas d'où vient le problème ni par où commencer le diagnostic.

## Quand utiliser ce guide

- Première utilisation après l'installation du plugin, aucune notification reçue
- Après une mise à jour du plugin ou du système, les notifications ont cessé de fonctionner
- Vous souhaitez désactiver certains comportements de notification, mais la configuration semble sans effet
- Vous passez de macOS à Windows/Linux et certaines fonctionnalités ne sont plus disponibles

## Approche générale

Le flux de travail d'opencode-notify est simple, mais implique plusieurs étapes : SDK OpenCode → écoute des événements → logique de filtrage → notification système. Un problème à n'importe quelle étape peut empêcher l'affichage des notifications.

La clé du diagnostic est de **vérifier chaque étape dans l'ordre**, en commençant par les causes les plus probables. 80 % des problèmes peuvent être résolus en examinant ces 5 catégories :

1. **Notifications absentes** - Le problème le plus courant
2. **Détection de focus défaillante** (macOS uniquement)
3. **Configuration sans effet** - Erreur de format JSON ou de chemin
4. **Sons non joués** (macOS uniquement)
5. **Différences entre plateformes** - Certaines fonctionnalités non supportées

---

## Problème 1 : Notifications absentes

C'est le problème le plus courant, avec 6 causes possibles. Vérifiez dans l'ordre :

### 1.1 Vérifier que le plugin est correctement installé

**Symptôme** : OpenCode fonctionne normalement, mais vous n'avez jamais reçu de notification.

**Étapes de diagnostic** :

```bash
# Vérifier si le plugin est installé
ls ~/.opencode/plugin/kdco-notify

# S'il n'existe pas, réinstaller
ocx add kdco/notify
```

**Résultat attendu** : Le répertoire `~/.opencode/plugin/kdco-notify` existe et contient `package.json`, `src/notify.ts` et d'autres fichiers.

::: tip Vérification pour installation manuelle
Si vous avez installé manuellement, assurez-vous que :
1. Les dépendances sont installées : `npm install node-notifier detect-terminal`
2. Les fichiers du plugin sont au bon emplacement : `~/.opencode/plugin/`
3. OpenCode a été redémarré (les modifications de plugin nécessitent un redémarrage)
:::

### 1.2 Vérifier les autorisations de notification macOS

**Symptôme** : Utilisateurs macOS uniquement, le plugin est installé mais aucune notification n'est reçue.

**Cause** : macOS nécessite une autorisation explicite pour que l'application terminal puisse envoyer des notifications.

**Étapes de diagnostic** :

```bash
# 1. Ouvrir les Réglages Système
# macOS Ventura et versions ultérieures : Réglages Système → Notifications et concentration
# Anciennes versions de macOS : Préférences Système → Notifications

# 2. Trouver votre application terminal (ex. Ghostty, iTerm2, Terminal.app)
# 3. Vérifier que "Autoriser les notifications" est activé
# 4. Vérifier que "Sur l'écran verrouillé" et "Afficher les bannières sur l'écran verrouillé" sont activés
```

**Résultat attendu** : Votre application terminal apparaît dans les réglages de notification avec l'interrupteur "Autoriser les notifications" en vert.

::: warning Erreur courante
OpenCode lui-même n'apparaît pas dans les réglages de notification. Vous devez autoriser **l'application terminal** (Ghostty, iTerm2, Terminal.app, etc.), pas OpenCode.
:::

### 1.3 Vérifier les paramètres de plage horaire silencieuse

**Symptôme** : Pas de notifications pendant certaines périodes, mais elles fonctionnent le reste du temps.

**Cause** : La plage horaire silencieuse est activée dans le fichier de configuration.

**Étapes de diagnostic** :

```bash
# Vérifier le fichier de configuration
cat ~/.config/opencode/kdco-notify.json
```

**Solution** :

```json
{
  "quietHours": {
    "enabled": false,  // Mettre à false pour désactiver la plage silencieuse
    "start": "22:00",
    "end": "08:00"
  }
}
```

**Résultat attendu** : `quietHours.enabled` est `false`, ou l'heure actuelle n'est pas dans la plage silencieuse.

::: tip Plage silencieuse traversant minuit
La plage silencieuse peut traverser minuit (ex. 22:00-08:00), c'est un comportement normal. Si l'heure actuelle est entre 22h et 8h le lendemain matin, les notifications sont supprimées.
:::

### 1.4 Vérifier le focus de la fenêtre terminal

**Symptôme** : Pas de notification lorsque vous regardez le terminal.

**Cause** : C'est le **comportement attendu**, pas un bug. Le mécanisme de détection de focus supprime les notifications lorsque vous consultez le terminal pour éviter les rappels redondants.

**Étapes de diagnostic** :

**Vérifier si le terminal a le focus** :
1. Basculer vers une autre application (ex. navigateur, VS Code)
2. Demander à l'IA d'exécuter une tâche
3. Attendre la fin de la tâche

**Résultat attendu** : Les notifications s'affichent normalement lorsque vous êtes dans une autre application.

::: tip Explication de la détection de focus
La détection de focus est un comportement intégré qui ne peut pas être désactivé via la configuration. Le plugin supprime par défaut les notifications lorsque le terminal a le focus pour éviter les rappels redondants. C'est le comportement prévu par conception.
:::

### 1.5 Vérifier le filtrage des sessions enfants

**Symptôme** : L'IA a exécuté plusieurs sous-tâches, mais vous n'avez pas reçu de notification pour chacune.

**Cause** : C'est le **comportement attendu**. Le plugin ne notifie par défaut que les sessions parentes, pas les sessions enfants, pour éviter un bombardement de notifications.

**Étapes de diagnostic** :

**Comprendre les sessions parentes et enfants** :
- Session parente : La tâche que vous demandez directement à l'IA (ex. "optimiser le code")
- Session enfant : Les sous-tâches que l'IA décompose elle-même (ex. "optimiser src/components", "optimiser src/utils")

**Si vous avez vraiment besoin des notifications pour les sessions enfants** :

```json
{
  "notifyChildSessions": true
}
```

**Résultat attendu** : Vous recevez une notification à la fin de chaque session enfant.

::: tip Recommandation
Sauf si vous surveillez plusieurs tâches concurrentes, gardez `notifyChildSessions: false` et ne recevez que les notifications des sessions parentes.
:::

### 1.6 Vérifier si le fichier de configuration a été supprimé ou renommé

**Symptôme** : Les notifications fonctionnaient avant, puis ont soudainement cessé.

**Étapes de diagnostic** :

```bash
# Vérifier si le fichier de configuration existe
ls -la ~/.config/opencode/kdco-notify.json
```

**Solution** :

Si le fichier de configuration a été supprimé ou si le chemin est incorrect, le plugin utilise la configuration par défaut :

**Supprimer le fichier de configuration pour restaurer les valeurs par défaut** :

```bash
# Supprimer le fichier de configuration pour utiliser les paramètres par défaut
rm ~/.config/opencode/kdco-notify.json
```

**Résultat attendu** : Le plugin recommence à envoyer des notifications (avec la configuration par défaut).

---

## Problème 2 : Détection de focus défaillante (macOS uniquement)

**Symptôme** : Vous recevez des notifications même lorsque vous regardez le terminal, la détection de focus ne semble pas fonctionner.

### 2.1 Vérifier si le terminal est correctement détecté

**Cause** : Le plugin utilise la bibliothèque `detect-terminal` pour identifier automatiquement le terminal. Si la détection échoue, la détection de focus ne peut pas fonctionner.

**Étapes de diagnostic** :

```bash
# Vérifier si la détection du terminal fonctionne
node -e "console.log(require('detect-terminal')())"
```

**Résultat attendu** : Affiche le nom de votre terminal (ex. `ghostty`, `iterm2`, etc.).

Si la sortie est vide, la détection du terminal a échoué.

### 2.2 Spécifier manuellement le type de terminal

**Si la détection automatique échoue, vous pouvez spécifier manuellement** :

```json
{
  "terminal": "ghostty"  // Remplacer par le nom de votre terminal
}
```

**Noms de terminaux supportés** (en minuscules) :

| Terminal | Nom | Terminal | Nom |
| --- | --- | --- | --- |
| Ghostty | `ghostty` | Kitty | `kitty` |
| iTerm2 | `iterm2` ou `iterm` | WezTerm | `wezterm` |
| Alacritty | `alacritty` | Terminal macOS | `terminal` ou `apple_terminal` |
| Hyper | `hyper` | Warp | `warp` |
| Terminal VS Code | `vscode` | VS Code Insiders | `vscode-insiders` |

::: tip Correspondance des noms de processus
Le plugin dispose d'une table de correspondance interne entre les noms de terminaux et les noms de processus macOS. Si vous spécifiez manuellement `terminal`, assurez-vous d'utiliser un nom de la table de correspondance (lignes 71-84).
:::

---

## Problème 3 : Configuration sans effet

**Symptôme** : Vous avez modifié le fichier de configuration, mais le comportement du plugin n'a pas changé.

### 3.1 Vérifier que le format JSON est correct

**Erreurs courantes** :

```json
// ❌ Erreur : guillemets manquants
{
  notifyChildSessions: true
}

// ❌ Erreur : virgule finale
{
  "notifyChildSessions": true,
}

// ❌ Erreur : commentaires non supportés
{
  "notifyChildSessions": true  // Ceci provoque une erreur d'analyse JSON
}
```

**Format correct** :

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

**Valider le format JSON** :

```bash
# Utiliser jq pour valider le format JSON
cat ~/.config/opencode/kdco-notify.json | jq '.'

# Si le JSON formaté s'affiche, le format est correct
# Si une erreur apparaît, le JSON a un problème
```

### 3.2 Vérifier le chemin du fichier de configuration

**Symptôme** : Vous avez créé un fichier de configuration, mais le plugin ne semble pas le lire.

**Chemin correct** :

```
~/.config/opencode/kdco-notify.json
```

**Étapes de diagnostic** :

```bash
# Vérifier si le fichier de configuration existe
ls -la ~/.config/opencode/kdco-notify.json

# S'il n'existe pas, créer le répertoire et le fichier
mkdir -p ~/.config/opencode
cat > ~/.config/opencode/kdco-notify.json << 'EOF'
{
  "notifyChildSessions": false
}
EOF
```

### 3.3 Redémarrer OpenCode

**Cause** : Le plugin charge la configuration une seule fois au démarrage, un redémarrage est nécessaire après modification.

**Étapes de diagnostic** :

```bash
# Redémarrer complètement OpenCode
# 1. Quitter OpenCode
# 2. Relancer OpenCode
```

---

## Problème 4 : Sons non joués (macOS uniquement)

**Symptôme** : Les notifications s'affichent normalement, mais aucun son n'est joué.

### 4.1 Vérifier que le nom du son est correct

**Sons macOS supportés** :

| Nom du son | Description | Nom du son | Description |
| --- | --- | --- | --- |
| Basso | Son grave | Blow | Souffle |
| Bottle | Son de bouteille | Frog | Grenouille |
| Funk | Funk | Glass | Verre (défaut tâche terminée) |
| Hero | Héros | Morse | Code Morse |
| Ping | Ding | Pop | Bulle |
| Purr | Ronronnement | Sosumi | Sosumi |
| Submarine | Sous-marin (défaut demande permission) | Tink | Tintement |

**Exemple de configuration** :

```json
{
  "sounds": {
    "idle": "Glass",      // Son de fin de tâche
    "error": "Basso",    // Son d'erreur
    "permission": "Submarine",  // Son de demande de permission
    "question": "Ping"   // Son de question (optionnel)
  }
}
```

### 4.2 Vérifier les paramètres de volume système

**Étapes de diagnostic** :

```bash
# Ouvrir Réglages Système → Son → Volume de sortie
# Vérifier que le volume n'est pas en sourdine et qu'il est à un niveau approprié
```

### 4.3 Les autres plateformes ne supportent pas les sons personnalisés

**Symptôme** : Utilisateurs Windows ou Linux, vous avez configuré des sons mais n'entendez rien.

**Cause** : Les sons personnalisés sont une fonctionnalité exclusive à macOS, non supportée sur Windows et Linux.

**Solution** : Les utilisateurs Windows et Linux reçoivent les notifications, mais les sons sont contrôlés par les paramètres système par défaut et ne peuvent pas être configurés via le plugin.

::: tip Sons Windows/Linux
Les sons de notification sur Windows et Linux sont contrôlés par les paramètres système :
- Windows : Paramètres → Système → Notifications → Choisir le son de notification
- Linux : Paramètres de l'environnement de bureau → Notifications → Sons
:::

---

## Problème 5 : Clic sur notification sans focus (macOS uniquement)

**Symptôme** : Après avoir cliqué sur une notification, la fenêtre du terminal ne passe pas au premier plan.

### 5.1 Vérifier si le Bundle ID a été obtenu avec succès

**Cause** : La fonctionnalité de focus au clic nécessite d'obtenir le Bundle ID du terminal (ex. `com.ghostty.Ghostty`). Si l'obtention échoue, le focus ne peut pas fonctionner.

**Étapes de diagnostic** :

Le plugin détecte automatiquement le terminal et obtient le Bundle ID au démarrage. En cas d'échec, la fonctionnalité de focus au clic n'est pas disponible.

**Causes courantes** :
1. Le terminal n'est pas dans la table de correspondance (ex. terminal personnalisé)
2. Échec d'exécution d'`osascript` (problème de permissions macOS)

**Solution** : Spécifier manuellement le type de terminal (voir section 2.2).

### 5.2 Vérifier les permissions d'accessibilité système

**Cause** : macOS nécessite les permissions "Accessibilité" pour contrôler les fenêtres d'autres applications.

**Étapes de diagnostic** :

```bash
# Ouvrir Réglages Système → Confidentialité et sécurité → Accessibilité
# Vérifier que l'application terminal a les permissions d'accessibilité
```

**Résultat attendu** : Votre application terminal (Ghostty, iTerm2, etc.) apparaît dans la liste d'accessibilité avec l'interrupteur activé.

---

## Problème 6 : Différences de fonctionnalités entre plateformes

**Symptôme** : En passant de macOS à Windows/Linux, certaines fonctionnalités ne sont plus disponibles.

### 6.1 Tableau comparatif des fonctionnalités

| Fonctionnalité | macOS | Windows | Linux |
| --- | --- | --- | --- |
| Notifications natives | ✅ | ✅ | ✅ |
| Sons personnalisés | ✅ | ❌ | ❌ |
| Détection de focus | ✅ | ❌ | ❌ |
| Focus au clic sur notification | ✅ | ❌ | ❌ |
| Détection de terminal | ✅ | ✅ | ✅ |
| Plage horaire silencieuse | ✅ | ✅ | ✅ |
| Notification sessions enfants | ✅ | ✅ | ✅ |

**Explication** :
- **Windows/Linux** : Seules les fonctionnalités de notification de base sont supportées, les fonctionnalités avancées (détection de focus, focus au clic, sons personnalisés) ne sont pas disponibles
- **macOS** : Toutes les fonctionnalités sont supportées

### 6.2 Compatibilité multiplateforme du fichier de configuration

**Problème** : Vous avez configuré `sounds` sur macOS, mais les sons ne fonctionnent pas après passage à Windows.

**Cause** : La configuration `sounds` n'est effective que sur macOS.

**Solution** : Le fichier de configuration peut être utilisé sur toutes les plateformes, le plugin ignore automatiquement les options de configuration non supportées. Pas besoin de supprimer le champ `sounds`, Windows/Linux l'ignorera silencieusement.

::: tip Bonne pratique
Utilisez le même fichier de configuration sur plusieurs plateformes, le plugin gère automatiquement les différences entre plateformes. Pas besoin de créer un fichier de configuration séparé pour chaque plateforme.
:::

---

## Résumé

Le dépannage d'opencode-notify peut être résumé en 6 catégories de problèmes :

1. **Notifications absentes** : Vérifier l'installation du plugin, les permissions de notification macOS, la plage horaire silencieuse, le focus du terminal, le filtrage des sessions enfants, si le plugin est désactivé
2. **Détection de focus défaillante** (macOS) : Vérifier si le terminal est correctement détecté, ou spécifier manuellement le type de terminal
3. **Configuration sans effet** : Vérifier le format JSON, le chemin du fichier de configuration, redémarrer OpenCode
4. **Sons non joués** (macOS) : Vérifier que le nom du son est correct, confirmer que les sons ne sont supportés que sur macOS
5. **Clic sur notification sans focus** (macOS) : Vérifier l'obtention du Bundle ID et les permissions d'accessibilité
6. **Différences entre plateformes** : Windows/Linux ne supportent que les notifications de base, les fonctionnalités avancées ne sont disponibles que sur macOS

**Liste de vérification rapide** :

```
□ Le plugin est-il correctement installé ?
□ Les permissions de notification macOS sont-elles accordées ?
□ La plage horaire silencieuse est-elle activée ?
□ Le terminal a-t-il le focus ?
□ Le filtrage des sessions enfants est-il activé ?
□ Le format JSON du fichier de configuration est-il correct ?
□ Le chemin du fichier de configuration est-il correct ?
□ Avez-vous redémarré OpenCode ?
□ Le nom du son est-il dans la liste supportée (macOS uniquement) ?
□ Le Bundle ID a-t-il été obtenu avec succès (macOS uniquement) ?
□ Le volume système est-il normal ?
```

---

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous aborderons les **[Questions fréquentes](../common-questions/)**.
>
> Vous apprendrez :
> - Si opencode-notify augmente la consommation de contexte de conversation
> - Si vous risquez d'être bombardé de notifications
> - Comment désactiver temporairement les notifications
> - L'impact sur les performances et les questions de confidentialité

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements dans le code source</strong></summary>

> Dernière mise à jour : 2026-01-27

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Chargement de configuration et gestion des erreurs | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |
| Détection de terminal | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| Exécution osascript macOS | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L120-L133) | 120-133 |
| Détection de focus du terminal | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| Vérification plage horaire silencieuse | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L181-L199) | 181-199 |
| Détection session parente | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L205-L214) | 205-214 |
| Envoi de notification | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L243) | 227-243 |
| Configuration par défaut | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |
| Correspondance noms de processus terminal | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84 |
| Traitement fin de tâche | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L249-L284) | 249-284 |
| Traitement notification d'erreur | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L286-L313) | 286-313 |
| Traitement demande de permission | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L315-L334) | 315-334 |
| Traitement question | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L336-L351) | 336-351 |

**Constantes clés** :

- `DEFAULT_CONFIG` : Configuration par défaut (lignes 56-68)
  - `notifyChildSessions: false` : Par défaut, ne pas notifier les sessions enfants
  - `sounds.idle: "Glass"` : Son de fin de tâche
  - `sounds.error: "Basso"` : Son d'erreur
  - `sounds.permission: "Submarine"` : Son de demande de permission
  - `quietHours.start: "22:00"`, `quietHours.end: "08:00"` : Plage horaire silencieuse par défaut

- `TERMINAL_PROCESS_NAMES` : Correspondance entre noms de terminaux et noms de processus macOS (lignes 71-84)

**Fonctions clés** :

- `loadConfig()` : Charge et fusionne le fichier de configuration avec la configuration par défaut, utilise les valeurs par défaut si le fichier n'existe pas ou est invalide
- `detectTerminalInfo()` : Détecte les informations du terminal (nom, Bundle ID, nom de processus)
- `isTerminalFocused()` : Vérifie si le terminal est l'application au premier plan (macOS)
- `isQuietHours()` : Vérifie si l'heure actuelle est dans la plage horaire silencieuse
- `isParentSession()` : Vérifie si la session est une session parente
- `sendNotification()` : Envoie une notification native, supporte le focus au clic sur macOS
- `runOsascript()` : Exécute AppleScript (macOS), retourne null en cas d'échec
- `getBundleId()` : Obtient le Bundle ID d'une application (macOS)

**Règles métier** :

- BR-1-1 : Par défaut, ne notifier que les sessions parentes, pas les sessions enfants (`notify.ts:256-259`)
- BR-1-2 : Supprimer les notifications lorsque le terminal a le focus (`notify.ts:265`)
- BR-1-3 : Ne pas envoyer de notifications pendant la plage horaire silencieuse (`notify.ts:262`)
- BR-1-4 : Toujours notifier les demandes de permission, sans vérification de session parente (`notify.ts:319`)
- BR-1-5 : Pas de vérification de focus pour les questions, supporte le workflow tmux (`notify.ts:340`)
- BR-1-6 : macOS supporte le focus du terminal au clic sur notification (`notify.ts:238-240`)

**Gestion des exceptions** :

- `loadConfig()` : Si le fichier de configuration n'existe pas ou si l'analyse JSON échoue, utiliser la configuration par défaut (`notify.ts:110-113`)
- `isParentSession()` : Si la requête de session échoue, supposer que c'est une session parente (notifier plutôt que manquer) (`notify.ts:210-212`)
- `runOsascript()` : Retourner null si l'exécution d'osascript échoue (`notify.ts:120-132`)
- `handleSessionIdle()` : Si l'obtention des informations de session échoue, utiliser le titre par défaut (`notify.ts:274-276`)

</details>

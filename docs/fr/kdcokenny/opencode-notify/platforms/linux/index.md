---
title: "Guide Linux : Notifications notify-send et détection du terminal | opencode-notify"
sidebarTitle: "Les notifications sur Linux aussi"
subtitle: "Fonctionnalités spécifiques à Linux : notify-send et détection du terminal"
description: "Découvrez les fonctionnalités et limitations d'opencode-notify sur Linux. Maîtrisez les notifications natives et la détection du terminal, comprenez les différences avec macOS/Windows, configurez une stratégie de notification adaptée à Linux pour améliorer votre productivité tout en évitant les interruptions."
tags:
  - "Linux"
  - "Fonctionnalités plateforme"
  - "Détection du terminal"
prerequisite:
  - "start-quick-start"
order: 50
---

# Fonctionnalités spécifiques à Linux : notify-send et détection du terminal

## Ce que vous apprendrez

- Comprendre les fonctionnalités supportées par opencode-notify sur Linux
- Maîtriser le fonctionnement des notifications natives et de la détection du terminal
- Comprendre les différences avec les plateformes macOS et Windows
- Configurer une stratégie de notification adaptée à Linux

## Votre situation actuelle

Vous utilisez OpenCode sur Linux et constatez que certaines fonctionnalités ne sont pas aussi intelligentes que sur macOS. Les notifications apparaissent même lorsque le terminal est au premier plan, et cliquer sur une notification ne ramène pas à la fenêtre du terminal. Est-ce normal ? Quelles sont les limitations de la plateforme Linux ?

## Quand utiliser ces fonctionnalités

**Consultez ce guide sur les spécificités Linux dans les cas suivants** :
- Vous utilisez opencode-notify sur un système Linux
- Vous constatez que certaines fonctionnalités macOS ne sont pas disponibles sur Linux
- Vous souhaitez exploiter au maximum les fonctionnalités disponibles sur Linux

## Concept clé

opencode-notify offre des **capacités de notification de base** sur Linux, mais avec certaines limitations par rapport à macOS. Cela est dû aux caractéristiques du système d'exploitation, pas au plugin lui-même.

::: info Pourquoi macOS offre-t-il plus de fonctionnalités ?

macOS fournit des API système plus puissantes :
- NSUserNotificationCenter supporte l'activation au clic
- AppleScript peut détecter l'application au premier plan
- L'API des sons système permet des sons personnalisés

Les API de notification système de Linux et Windows sont plus basiques. opencode-notify utilise `node-notifier` sur ces plateformes pour appeler les notifications natives du système.
:::

## Aperçu des fonctionnalités Linux

| Fonctionnalité | Linux | Description |
| --- | --- | --- |
| **Notifications natives** | ✅ Supporté | Via notify-send |
| **Détection du terminal** | ✅ Supporté | Reconnaissance automatique de 37+ émulateurs |
| **Détection du focus** | ❌ Non supporté | Impossible de détecter si le terminal est au premier plan |
| **Activation au clic** | ❌ Non supporté | Cliquer sur la notification ne bascule pas vers le terminal |
| **Sons personnalisés** | ❌ Non supporté | Utilise le son de notification système par défaut |

### Mécanisme de notification Linux

opencode-notify utilise la commande **notify-send** pour envoyer des notifications système sur Linux, via la bibliothèque `node-notifier` qui appelle l'API native du système.

**Déclencheurs de notification** :
- Fin de tâche IA (session.idle)
- Erreur d'exécution IA (session.error)
- Demande de permission IA (permission.updated)
- Question de l'IA (tool.execute.before)

::: tip Caractéristiques des notifications notify-send
- Les notifications apparaissent en haut à droite de l'écran (GNOME/Ubuntu)
- Disparition automatique (environ 5 secondes)
- Utilise le son de notification système par défaut
- Cliquer sur la notification ouvre le centre de notifications (ne bascule pas vers le terminal)
:::

## Détection du terminal

### Reconnaissance automatique du terminal

opencode-notify utilise la bibliothèque `detect-terminal` pour détecter automatiquement votre émulateur de terminal.

**Terminaux supportés sur Linux** :
- gnome-terminal (par défaut sur GNOME)
- konsole (KDE)
- xterm
- lxterminal (LXDE)
- alacritty
- kitty
- terminator
- guake
- tilix
- hyper
- Terminal intégré VS Code
- Et plus de 37 autres émulateurs

::: details Principe de détection du terminal

Au démarrage du plugin, `detect-terminal()` analyse les processus système pour identifier le type de terminal actuel.

Emplacement dans le code source : `src/notify.ts:145-164`

La fonction `detectTerminalInfo()` :
1. Lit le champ `terminal` de la configuration (si spécifié manuellement)
2. Appelle `detectTerminal()` pour la détection automatique
3. Obtient le nom du processus (utilisé pour la détection du focus sur macOS)
4. Sur macOS, obtient le bundle ID (utilisé pour l'activation au clic)

Sur Linux, `bundleId` et `processName` seront `null`, car Linux n'a pas besoin de ces informations.
:::

### Spécification manuelle du terminal

Si la détection automatique échoue, vous pouvez spécifier manuellement le type de terminal dans le fichier de configuration.

**Exemple de configuration** :

```json
{
  "terminal": "gnome-terminal"
}
```

**Noms de terminaux disponibles** : Consultez la [liste des terminaux supportés par `detect-terminal`](https://github.com/jonschlinkert/detect-terminal#supported-terminals).

## Comparaison des fonctionnalités par plateforme

| Fonctionnalité | macOS | Windows | Linux |
| --- | --- | --- | --- |
| **Notifications natives** | ✅ Notification Center | ✅ Toast | ✅ notify-send |
| **Sons personnalisés** | ✅ Liste des sons système | ❌ Son par défaut | ❌ Son par défaut |
| **Détection du focus** | ✅ API AppleScript | ❌ Non supporté | ❌ Non supporté |
| **Activation au clic** | ✅ activate bundleId | ❌ Non supporté | ❌ Non supporté |
| **Détection du terminal** | ✅ 37+ terminaux | ✅ 37+ terminaux | ✅ 37+ terminaux |

### Pourquoi Linux ne supporte-t-il pas la détection du focus ?

Dans le code source, la fonction `isTerminalFocused()` retourne directement `false` sur Linux :

```typescript
// src/notify.ts:166-168
async function isTerminalFocused(terminalInfo: TerminalInfo): Promise<boolean> {
	if (!terminalInfo.processName) return false
	if (process.platform !== "darwin") return false  // ← Retourne false sur Windows/Linux
	// ... logique de détection du focus pour macOS
}
```

**Raisons** :
- Les environnements de bureau Linux sont variés (GNOME, KDE, XFCE, etc.), sans API unifiée pour interroger l'application au premier plan
- Linux DBus peut obtenir la fenêtre active, mais l'implémentation est complexe et dépend de l'environnement de bureau
- La version actuelle privilégie la stabilité et n'implémente pas encore la détection du focus sur Linux

### Pourquoi Linux ne supporte-t-il pas l'activation au clic ?

Dans le code source, la fonction `sendNotification()` ne définit l'option `activate` que sur macOS :

```typescript
// src/notify.ts:238-240
// macOS-specific: click notification to focus terminal
if (process.platform === "darwin" && terminalInfo.bundleId) {
	notifyOptions.activate = terminalInfo.bundleId
}
```

**Raisons** :
- notify-send ne supporte pas le paramètre `activate`
- Les notifications Linux ne peuvent être associées que par ID d'application, sans possibilité de spécifier dynamiquement une fenêtre cible
- Cliquer sur une notification ouvre le centre de notifications, pas une fenêtre spécifique

### Pourquoi Linux ne supporte-t-il pas les sons personnalisés ?

::: details Principe de configuration des sons

Sur macOS, `sendNotification()` transmet le paramètre `sound` à la notification système :

```typescript
// src/notify.ts:227-243
function sendNotification(options: NotificationOptions): void {
	const { title, message, sound, terminalInfo } = options
	
	const notifyOptions: Record<string, unknown> = {
		title,
		message,
		sound,  // ← macOS accepte ce paramètre
	}
	
	// macOS-specific: click notification to focus terminal
	if (process.platform === "darwin" && terminalInfo.bundleId) {
		notifyOptions.activate = terminalInfo.bundleId
	}
	
	notifier.notify(notifyOptions)
}
```

Linux notify-send ne supporte pas le paramètre de son personnalisé, donc la configuration `sounds` est sans effet sur Linux.
:::

## Bonnes pratiques pour Linux

### Recommandations de configuration

Comme Linux ne supporte pas la détection du focus, il est conseillé d'ajuster la configuration pour réduire le bruit des notifications.

**Configuration recommandée** :

```json
{
  "notifyChildSessions": false,
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

**Explications** :
- `notifyChildSessions: false` - Notifie uniquement la session parente, évite le bruit des sous-tâches
- `quietHours.enabled: true` - Active les heures silencieuses pour éviter les interruptions nocturnes

### Options de configuration non supportées

Les options suivantes sont sans effet sur Linux :

| Option | Effet sur macOS | Effet sur Linux |
| --- | --- | --- |
| `sounds.idle` | Joue le son Glass | Utilise le son système par défaut |
| `sounds.error` | Joue le son Basso | Utilise le son système par défaut |
| `sounds.permission` | Joue le son Submarine | Utilise le son système par défaut |

### Astuces d'utilisation

**Astuce 1 : Désactiver manuellement les notifications**

Si vous consultez le terminal et ne souhaitez pas être interrompu :

1. Cliquez sur l'icône de notification en haut à droite de l'écran
2. Désactivez les notifications d'opencode-notify

**Astuce 2 : Utiliser les heures silencieuses**

Définissez vos heures de travail et de repos pour éviter les interruptions en dehors des heures de travail :

```json
{
  "quietHours": {
    "enabled": true,
    "start": "18:00",
    "end": "09:00"
  }
}
```

**Astuce 3 : Désactiver temporairement le plugin**

Pour désactiver complètement les notifications, utilisez la configuration `quietHours` pour définir un mode silencieux toute la journée, ou supprimez/renommez le fichier de configuration pour désactiver le plugin.

**Astuce 4 : Configurer le son de notification système**

Bien qu'opencode-notify ne supporte pas les sons personnalisés, vous pouvez modifier le son de notification par défaut dans les paramètres système :

- **GNOME** : Paramètres → Son → Son d'alerte
- **KDE** : Configuration du système → Notifications → Son par défaut
- **XFCE** : Paramètres → Apparence → Notifications → Son

## Suivez le guide

### Vérifier les notifications Linux

**Étape 1 : Déclencher une notification de test**

Dans OpenCode, saisissez une tâche simple :

```
Calcule le résultat de 1+1.
```

**Résultat attendu** :
- Une notification notify-send apparaît en haut à droite de l'écran (GNOME/Ubuntu)
- Le titre de la notification est "Ready for review"
- Le son de notification système par défaut est joué

**Étape 2 : Tester la suppression par focus (vérifier qu'elle n'est pas supportée)**

Gardez la fenêtre du terminal au premier plan et déclenchez une autre tâche.

**Résultat attendu** :
- La notification apparaît quand même (car Linux ne supporte pas la détection du focus)

**Étape 3 : Tester le clic sur la notification**

Cliquez sur la notification qui apparaît.

**Résultat attendu** :
- Le centre de notifications s'ouvre, au lieu de basculer vers la fenêtre du terminal

### Configurer les heures silencieuses

**Étape 1 : Créer le fichier de configuration**

Éditez le fichier de configuration (bash) :

```bash
nano ~/.config/opencode/kdco-notify.json
```

**Étape 2 : Ajouter la configuration des heures silencieuses**

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

**Étape 3 : Enregistrer et tester**

Attendez que l'heure actuelle entre dans la période silencieuse, puis déclenchez une tâche.

**Résultat attendu** :
- Aucune notification n'apparaît (les heures silencieuses sont actives)

## Point de contrôle ✅

Après avoir complété les étapes ci-dessus, vérifiez :

- [ ] Les notifications notify-send s'affichent correctement
- [ ] Les notifications affichent le bon titre de tâche
- [ ] La configuration des heures silencieuses fonctionne
- [ ] Vous comprenez les fonctionnalités non supportées sur Linux

## Pièges à éviter

### Problème courant 1 : Les notifications ne s'affichent pas

**Cause 1** : notify-send n'est pas installé

**Solution** :

```bash
# Ubuntu/Debian
sudo apt install libnotify-bin

# Fedora/RHEL
sudo dnf install libnotify

# Arch Linux
sudo pacman -S libnotify
```

**Cause 2** : Les permissions de notification Linux ne sont pas accordées

**Solution** :

1. Ouvrez les paramètres système
2. Trouvez « Notifications » ou « Confidentialité » → « Notifications »
3. Assurez-vous que « Autoriser les applications à envoyer des notifications » est activé
4. Trouvez OpenCode et vérifiez que les permissions de notification sont activées

### Problème courant 2 : Échec de la détection du terminal

**Cause** : `detect-terminal` ne reconnaît pas votre terminal

**Solution** :

Spécifiez manuellement le type de terminal dans le fichier de configuration :

```json
{
  "terminal": "gnome-terminal"
}
```

### Problème courant 3 : Les sons personnalisés ne fonctionnent pas

**Cause** : La plateforme Linux ne supporte pas les sons personnalisés

**Explication** : C'est un comportement normal. notify-send utilise le son système par défaut, qui ne peut pas être modifié via le fichier de configuration.

**Solution** : Modifiez le son de notification par défaut dans les paramètres système.

### Problème courant 4 : Cliquer sur la notification n'active pas le terminal

**Cause** : notify-send ne supporte pas le paramètre `activate`

**Explication** : C'est une limitation de l'API Linux. Cliquer sur une notification ouvre le centre de notifications ; vous devez basculer manuellement vers la fenêtre du terminal.

### Problème courant 5 : Comportement différent selon l'environnement de bureau

**Symptôme** : La position et le comportement des notifications varient selon l'environnement de bureau (GNOME, KDE, XFCE).

**Explication** : C'est normal, chaque environnement de bureau a sa propre implémentation du système de notifications.

**Solution** : Ajustez le comportement des notifications dans les paramètres système selon votre environnement de bureau.

## Résumé

Ce tutoriel a couvert :

- ✅ Linux supporte les notifications natives et la détection du terminal
- ✅ Linux ne supporte pas la détection du focus ni l'activation au clic
- ✅ Linux ne supporte pas les sons personnalisés
- ✅ Configuration recommandée (heures silencieuses, notification de la session parente uniquement)
- ✅ Solutions aux problèmes courants

**Points clés** :
1. Les fonctionnalités Linux sont plus basiques, mais les capacités de notification essentielles sont complètes
2. La détection du focus et l'activation au clic sont des fonctionnalités exclusives à macOS
3. Les heures silencieuses permettent de réduire le bruit des notifications
4. La détection du terminal peut être spécifiée manuellement pour améliorer la compatibilité
5. notify-send doit être préinstallé (inclus par défaut dans certaines distributions)

## Aperçu du prochain tutoriel

> Dans le prochain tutoriel, nous aborderons les **[Terminaux supportés](../terminals/)**.
>
> Vous apprendrez :
> - La liste des 37+ terminaux supportés par opencode-notify
> - Les mécanismes de détection des différents terminaux
> - Comment configurer manuellement le type de terminal
> - Astuces pour utiliser le terminal intégré de VS Code

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-27

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Vérification des limitations Linux (osascript) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L121-L133) | 121-133 |
| Vérification des limitations Linux (détection du focus) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| Spécificité macOS : activation au clic | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L238-L240) | 238-240 |
| Envoi de notification (multiplateforme) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L243) | 227-243 |
| Détection du terminal (multiplateforme) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| Chargement de la configuration (multiplateforme) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |

**Fonctions clés** :
- `runOsascript()` : S'exécute uniquement sur macOS, retourne null sur Linux
- `isTerminalFocused()` : Retourne directement false sur Linux
- `sendNotification()` : Ne définit le paramètre `activate` que sur macOS
- `detectTerminalInfo()` : Détection du terminal multiplateforme

**Vérification de la plateforme** :
- `process.platform === "darwin"` : macOS
- `process.platform === "win32"` : Windows
- `process.platform === "linux"` : Linux

**Dépendances des notifications Linux** :
- Dépendance externe : `node-notifier` → commande `notify-send`
- Prérequis système : libnotify-bin ou équivalent

</details>

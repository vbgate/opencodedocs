---
title: "Guide d'utilisation Windows : Notifications natives, détection de terminal et configuration détaillée | Tutoriel opencode-notify"
sidebarTitle: "Utiliser les notifications sur Windows"
subtitle: "Fonctionnalités de la plateforme Windows : Notifications natives et détection de terminal"
description: "Découvrez les fonctionnalités et limitations d'opencode-notify sur Windows. Maîtrisez les notifications natives Windows et la détection de terminal, comprenez les différences avec macOS, configurez la meilleure stratégie de notification pour améliorer votre efficacité, éviter les interruptions et maintenir votre concentration."
tags:
  - "Windows"
  - "Fonctionnalités de plateforme"
  - "Détection de terminal"
prerequisite:
  - "start-quick-start"
order: 40
---

# Fonctionnalités de la plateforme Windows : Notifications natives et détection de terminal

## Ce que vous saurez faire

- Comprendre les fonctionnalités supportées par opencode-notify sur Windows
- Maîtriser le fonctionnement de la détection de terminal sous Windows
- Comprendre les différences fonctionnelles avec macOS
- Configurer une stratégie de notification adaptée à Windows

## Votre problème actuel

Vous utilisez OpenCode sur Windows et constatez que certaines fonctionnalités ne sont pas aussi intelligentes que sur macOS. Les notifications apparaissent même lorsque le terminal est au premier plan, et cliquer sur une notification ne ramène pas au terminal. Est-ce normal ? Quelles sont les limitations de la plateforme Windows ?

## Quand utiliser cette solution

**Comprendre les fonctionnalités de la plateforme Windows dans les situations suivantes** :
- Vous utilisez opencode-notify sur un système Windows
- Vous constatez que certaines fonctionnalités macOS ne sont pas disponibles sur Windows
- Vous souhaitez maximiser l'utilisation des fonctionnalités disponibles sur Windows

## Concept clé

opencode-notify offre des **capacités de notification de base** sur Windows, mais avec certaines limitations fonctionnelles par rapport à macOS. Cela est dû aux caractéristiques du système d'exploitation, pas à un problème du plugin.

::: info Pourquoi macOS offre-t-il plus de fonctionnalités ?

macOS fournit des API système plus puissantes :
- NSUserNotificationCenter supporte le focus au clic
- AppleScript peut détecter l'application au premier plan
- L'API des sons système permet des sons personnalisés

Les API de notification système de Windows et Linux sont relativement basiques, opencode-notify utilise `node-notifier` sur ces plateformes pour appeler les notifications natives du système.
:::

## Aperçu des fonctionnalités Windows

| Fonctionnalité | Windows | Description |
| --- | --- | --- |
| **Notifications natives** | ✅ Supporté | Envoie des notifications via Windows Toast |
| **Détection de terminal** | ✅ Supporté | Reconnaît automatiquement plus de 37 émulateurs de terminal |
| **Détection du focus** | ❌ Non supporté | Impossible de détecter si le terminal est la fenêtre active |
| **Focus au clic** | ❌ Non supporté | Cliquer sur une notification ne bascule pas vers le terminal |
| **Sons personnalisés** | ❌ Non supporté | Utilise le son de notification système par défaut |

### Mécanisme de notification Windows

opencode-notify utilise les notifications **Windows Toast** sur Windows, en appelant l'API native du système via la bibliothèque `node-notifier`.

**Moments de déclenchement des notifications** :
- Lorsqu'une tâche IA est terminée (session.idle)
- Lorsqu'une erreur d'exécution IA se produit (session.error)
- Lorsque l'IA nécessite des permissions (permission.updated)
- Lorsque l'IA pose une question (tool.execute.before)

::: tip Caractéristiques des notifications Windows Toast
- Les notifications s'affichent dans le coin inférieur droit de l'écran
- Disparition automatique (environ 5 secondes)
- Utilise le son de notification système par défaut
- Cliquer sur une notification ouvre le centre de notifications (ne bascule pas vers le terminal)
:::

## Détection de terminal

### Reconnaissance automatique du terminal

opencode-notify utilise la bibliothèque `detect-terminal` pour détecter automatiquement l'émulateur de terminal que vous utilisez.

**Terminaux supportés sous Windows** :
- Windows Terminal (recommandé)
- Git Bash
- ConEmu
- Cmder
- PowerShell
- Terminal intégré VS Code

::: details Principe de détection du terminal
Au démarrage du plugin, `detect-terminal()` scanne les processus système pour identifier le type de terminal actuel.

Emplacement du code source : `src/notify.ts:145-147`

```typescript
async function detectTerminalInfo(config: NotifyConfig): Promise<TerminalInfo> {
	const terminalName = config.terminal || detectTerminal() || null
	
	if (!terminalName) {
		return { name: null, bundleId: null, processName: null }
	}
	
	return {
		name: terminalName,
		bundleId: null,  // Windows n'a pas besoin de bundleId
		processName: null,  // Windows n'a pas besoin de processName
	}
}
```
:::

### Spécification manuelle du terminal

Si la détection automatique échoue, vous pouvez spécifier manuellement le type de terminal dans le fichier de configuration.

**Exemple de configuration** :

```json
{
  "terminal": "Windows Terminal"
}
```

**Noms de terminaux disponibles** : Consultez la [liste des terminaux supportés par `detect-terminal`](https://github.com/jonschlinkert/detect-terminal#supported-terminals).

## Comparaison des fonctionnalités par plateforme

| Fonctionnalité | macOS | Windows | Linux |
| --- | --- | --- | --- |
| **Notifications natives** | ✅ Notification Center | ✅ Toast | ✅ notify-send |
| **Sons personnalisés** | ✅ Liste des sons système | ❌ Son système par défaut | ❌ Son système par défaut |
| **Détection du focus** | ✅ API AppleScript | ❌ Non supporté | ❌ Non supporté |
| **Focus au clic** | ✅ activate bundleId | ❌ Non supporté | ❌ Non supporté |
| **Détection de terminal** | ✅ Plus de 37 terminaux | ✅ Plus de 37 terminaux | ✅ Plus de 37 terminaux |

### Pourquoi Windows ne supporte-t-il pas la détection du focus ?

Dans le code source, la fonction `isTerminalFocused()` retourne directement `false` sur Windows :

```typescript
// src/notify.ts:166-168
async function isTerminalFocused(terminalInfo: TerminalInfo): Promise<boolean> {
	if (!terminalInfo.processName) return false
	if (process.platform !== "darwin") return false  // ← Windows/Linux retourne directement false
	// ... logique de détection du focus pour macOS
}
```

**Raisons** :
- Windows ne fournit pas d'API de requête d'application au premier plan similaire à AppleScript de macOS
- Windows PowerShell peut obtenir la fenêtre active, mais nécessite l'appel d'interfaces COM, ce qui est complexe à implémenter
- La version actuelle privilégie la stabilité, la détection du focus Windows n'est pas encore implémentée

### Pourquoi Windows ne supporte-t-il pas le focus au clic ?

Dans le code source, la fonction `sendNotification()` ne définit l'option `activate` que sur macOS :

```typescript
// src/notify.ts:238-240
// macOS-specific: click notification to focus terminal
if (process.platform === "darwin" && terminalInfo.bundleId) {
	notifyOptions.activate = terminalInfo.bundleId
}
```

**Raisons** :
- Windows Toast ne supporte pas le paramètre `activate`
- Les notifications Windows ne peuvent être associées que par ID d'application, impossible de spécifier dynamiquement une fenêtre cible
- Cliquer sur une notification ouvre le centre de notifications, plutôt que de basculer vers une fenêtre spécifique

## Meilleures pratiques pour la plateforme Windows

### Recommandations de configuration

Comme Windows ne supporte pas la détection du focus, il est recommandé d'ajuster la configuration pour réduire le bruit des notifications.

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

**Explication de la configuration** :
- `notifyChildSessions: false` - Notifie uniquement les sessions parentes, évite le bruit des sous-tâches
- `quietHours.enabled: true` - Active les heures silencieuses, évite les interruptions nocturnes

### Options de configuration non supportées

Les options de configuration suivantes sont inefficaces sur Windows :

| Option de configuration | Effet sur macOS | Effet sur Windows |
| --- | --- | --- |
| `sounds.idle` | Joue le son Glass | Utilise le son système par défaut |
| `sounds.error` | Joue le son Basso | Utilise le son système par défaut |
| `sounds.permission` | Joue le son Submarine | Utilise le son système par défaut |

### Astuces d'utilisation

**Astuce 1 : Désactiver manuellement les notifications**

Si vous consultez le terminal et ne souhaitez pas être dérangé :

1. Cliquez sur l'icône « Centre de notifications » dans la barre des tâches (Windows + A)
2. Désactivez les notifications d'opencode-notify

**Astuce 2 : Utiliser les heures silencieuses**

Définissez les heures de travail et de repos pour éviter d'être dérangé en dehors des heures de travail :

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

Si vous devez désactiver complètement les notifications, vous pouvez supprimer le fichier de configuration ou définir les heures silencieuses sur toute la journée :

```json
{
  "quietHours": {
    "enabled": true,
    "start": "00:00",
    "end": "23:59"
  }
}
```

## Suivez le guide

### Vérifier les notifications Windows

**Étape 1 : Déclencher une notification de test**

Dans OpenCode, entrez une tâche simple :

```
Calcule le résultat de 1+1.
```

**Vous devriez voir** :
- Une notification Windows Toast apparaît dans le coin inférieur droit
- Le titre de la notification est "Ready for review"
- Le son de notification système par défaut est joué

**Étape 2 : Tester la suppression du focus (vérifier le non-support)**

Gardez la fenêtre du terminal au premier plan et déclenchez à nouveau une tâche.

**Vous devriez voir** :
- La notification apparaît toujours (car Windows ne supporte pas la détection du focus)

**Étape 3 : Tester le clic sur la notification**

Cliquez sur la notification qui apparaît.

**Vous devriez voir** :
- Le centre de notifications s'ouvre, plutôt que de basculer vers la fenêtre du terminal

### Configurer les heures silencieuses

**Étape 1 : Créer le fichier de configuration**

Éditez le fichier de configuration (PowerShell) :

```powershell
notepad $env:USERPROFILE\.config\opencode\kdco-notify.json
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

**Vous devriez voir** :
- Aucune notification n'apparaît (les heures silencieuses sont actives)

## Point de contrôle ✅

Après avoir terminé les étapes ci-dessus, vérifiez :

- [ ] Les notifications Windows Toast s'affichent normalement
- [ ] La notification affiche le titre de tâche correct
- [ ] La configuration des heures silencieuses est active
- [ ] Vous comprenez les fonctionnalités non supportées sur Windows

## Pièges à éviter

### Problème courant 1 : Les notifications ne s'affichent pas

**Cause** : Les permissions de notification Windows ne sont pas accordées

**Solution** :

1. Ouvrez « Paramètres » → « Système » → « Notifications »
2. Assurez-vous que « Recevoir des notifications des applications et autres expéditeurs » est activé
3. Trouvez OpenCode et assurez-vous que les permissions de notification sont activées

### Problème courant 2 : Échec de la détection du terminal

**Cause** : `detect-terminal` ne peut pas reconnaître votre terminal

**Solution** :

Spécifiez manuellement le type de terminal dans le fichier de configuration :

```json
{
  "terminal": "Windows Terminal"
}
```

### Problème courant 3 : Les sons personnalisés ne fonctionnent pas

**Cause** : La plateforme Windows ne supporte pas les sons personnalisés

**Explication** : C'est un comportement normal. Les notifications Windows Toast utilisent le son système par défaut, qui ne peut pas être modifié via le fichier de configuration.

### Problème courant 4 : Cliquer sur la notification ne bascule pas vers le terminal

**Cause** : Windows Toast ne supporte pas le paramètre `activate`

**Explication** : C'est une limitation de l'API Windows. Cliquer sur une notification ouvre le centre de notifications, vous devez basculer manuellement vers la fenêtre du terminal.

## Résumé de la leçon

Dans cette leçon, nous avons découvert :

- ✅ Windows supporte les notifications natives et la détection de terminal
- ✅ Windows ne supporte pas la détection du focus et le focus au clic
- ✅ Windows ne supporte pas les sons personnalisés
- ✅ Configuration recommandée (heures silencieuses, notification des sessions parentes uniquement)
- ✅ Solutions aux problèmes courants

**Points clés** :
1. Les fonctionnalités de la plateforme Windows sont relativement basiques, mais les capacités de notification de base sont complètes
2. La détection du focus et le focus au clic sont des fonctionnalités exclusives à macOS
3. La configuration des heures silencieuses peut réduire le bruit des notifications
4. La détection de terminal supporte la spécification manuelle, améliorant la compatibilité

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous étudierons **[Fonctionnalités de la plateforme Linux](../linux/)**.
>
> Vous apprendrez :
> - Le mécanisme de notification de la plateforme Linux (notify-send)
> - Les capacités de détection de terminal sous Linux
> - La comparaison des fonctionnalités avec Windows
> - Les problèmes de compatibilité des distributions Linux

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-27

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Vérification des limitations Windows (osascript) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L121-L133) | 121-133 |
| Vérification des limitations Windows (détection du focus) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| Spécifique à macOS : focus au clic | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L238-L240) | 238-240 |
| Envoi de notification (multiplateforme) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L243) | 227-243 |
| Détection de terminal (multiplateforme) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| Chargement de la configuration (multiplateforme) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |

**Fonctions clés** :
- `runOsascript()` : S'exécute uniquement sur macOS, retourne null sur Windows
- `isTerminalFocused()` : Retourne directement false sur Windows
- `sendNotification()` : Définit le paramètre `activate` uniquement sur macOS
- `detectTerminalInfo()` : Détection de terminal multiplateforme

**Détection de plateforme** :
- `process.platform === "darwin"` : macOS
- `process.platform === "win32"` : Windows
- `process.platform === "linux"` : Linux

</details>

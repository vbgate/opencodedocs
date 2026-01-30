---
title: "Types d'événements : comprendre le déclenchement des notifications OpenCode | opencode-notify"
sidebarTitle: "Quand les notifications sont envoyées"
subtitle: "Types d'événements : comprendre le déclenchement des notifications OpenCode"
description: "Apprenez les types d'événements OpenCode surveillés par le plugin opencode-notify, maîtrisez les conditions de déclenchement et les règles de filtrage de session.idle, session.error, permission.updated et tool.execute.before."
tags:
  - "Annexe"
  - "Types d'événements"
  - "OpenCode"
prerequisite: []
order: 130
---

# Types d'événements : comprendre le déclenchement des notifications OpenCode

Cette page liste les **types d'événements OpenCode** surveillés par le plugin `opencode-notify` ainsi que leurs conditions de déclenchement. Le plugin écoute quatre événements : session.idle, session.error, permission.updated et tool.execute.before. Comprendre le moment de déclenchement de ces événements et les règles de filtrage vous aidera à mieux configurer le comportement des notifications.

## Vue d'ensemble des types d'événements

| Type d'événement | Moment de déclenchement | Titre de notification | Son par défaut | Vérification session parent | Vérification focus terminal |
| --- | --- | --- | --- | --- | --- |
| `session.idle` | La session AI entre en état d'inactivité | "Ready for review" | Glass | ✅ | ✅ |
| `session.error` | Erreur lors de l'exécution de la session AI | "Something went wrong" | Basso | ✅ | ✅ |
| `permission.updated` | L'AI nécessite une autorisation utilisateur | "Waiting for you" | Submarine | ❌ | ✅ |
| `tool.execute.before` | L'AI pose une question (outil question) | "Question for you" | Submarine* | ❌ | ❌ |

> *Note : l'événement question utilise par défaut le son permission, personnalisable via la configuration

## Détails des événements

### session.idle

**Condition de déclenchement** : La session AI entre en état d'inactivité après avoir terminé une tâche

**Contenu de la notification** :
- Titre : `Ready for review`
- Message : Titre de la session (maximum 50 caractères)

**Logique de traitement** :
1. Vérifier s'il s'agit d'une session parent (`notifyChildSessions=false`)
2. Vérifier si l'on est en période de silence
3. Vérifier si le terminal est focalisé (suppression de la notification si focalisé)
4. Envoyer la notification native

**Emplacement du code source** : `src/notify.ts:249-284`

---

### session.error

**Condition de déclenchement** : Erreur survenue lors de l'exécution de la session AI

**Contenu de la notification** :
- Titre : `Something went wrong`
- Message : Résumé de l'erreur (maximum 100 caractères)

**Logique de traitement** :
1. Vérifier s'il s'agit d'une session parent (`notifyChildSessions=false`)
2. Vérifier si l'on est en période de silence
3. Vérifier si le terminal est focalisé (suppression de la notification si focalisé)
4. Envoyer la notification native

**Emplacement du code source** : `src/notify.ts:286-313`

---

### permission.updated

**Condition de déclenchement** : L'AI nécessite une autorisation utilisateur pour effectuer une action

**Contenu de la notification** :
- Titre : `Waiting for you`
- Message : `OpenCode needs your input`

**Logique de traitement** :
1. **Ne vérifie pas la session parent** (les demandes d'autorisation nécessitent toujours une intervention humaine)
2. Vérifier si l'on est en période de silence
3. Vérifier si le terminal est focalisé (suppression de la notification si focalisé)
4. Envoyer la notification native

**Emplacement du code source** : `src/notify.ts:315-334`

---

### tool.execute.before

**Condition de déclenchement** : Avant l'exécution d'un outil par l'AI, lorsque le nom de l'outil est `question`

**Contenu de la notification** :
- Titre : `Question for you`
- Message : `OpenCode needs your input`

**Logique de traitement** :
1. **Ne vérifie pas la session parent**
2. **Ne vérifie pas le focus du terminal** (support du flux de travail tmux)
3. Vérifier si l'on est en période de silence
4. Envoyer la notification native

**Note spéciale** : Cet événement ne détecte pas le focus afin de permettre la réception normale des notifications dans les flux de travail multi-fenêtres tmux.

**Emplacement du code source** : `src/notify.ts:336-351`

## Conditions de déclenchement et règles de filtrage

### Vérification de la session parent

Par défaut, le plugin ne notifie que les sessions parent (sessions racine), évitant ainsi un trop grand nombre de notifications générées par les sous-tâches.

**Logique de vérification** :
- Obtenir les informations de session via `client.session.get()`
- Si la session possède un `parentID`, sauter la notification

**Options de configuration** :
- `notifyChildSessions: false` (par défaut) - Ne notifier que les sessions parent
- `notifyChildSessions: true` - Notifier toutes les sessions

**Événements applicables** :
- `session.idle` ✅
- `session.error` ✅
- `permission.updated` ❌ (non vérifié)
- `tool.execute.before` ❌ (non vérifié)

### Vérification de la période de silence

Aucune notification n'est envoyée pendant la période de silence configurée.

**Logique de vérification** :
- Lire `quietHours.enabled`, `quietHours.start`, `quietHours.end`
- Support des périodes traversant minuit (ex. 22:00-08:00)

**Événements applicables** :
- Tous les événements ✅

### Vérification du focus du terminal

Lorsque l'utilisateur consulte le terminal, les notifications sont supprimées pour éviter les rappels répétés.

**Logique de vérification** :
- macOS : Obtenir le nom de l'application au premier plan via `osascript`
- Comparer `frontmostApp` avec le `processName` du terminal

**Événements applicables** :
- `session.idle` ✅
- `session.error` ✅
- `permission.updated` ✅
- `tool.execute.before` ❌ (non vérifié, support tmux)

## Différences entre plateformes

| Fonctionnalité | macOS | Windows | Linux |
| --- | --- | --- | --- |
| Notification native | ✅ | ✅ | ✅ |
| Détection du focus terminal | ✅ | ❌ | ❌ |
| Focus du terminal au clic sur notification | ✅ | ❌ | ❌ |
| Sons personnalisés | ✅ | ❌ | ❌ |

## Impact de la configuration

Le comportement des notifications peut être personnalisé via le fichier de configuration :

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
  }
}
```

**Tutoriels connexes** :
- [Référence de configuration](../../advanced/config-reference/)
- [Guide détaillé des périodes de silence](../../advanced/quiet-hours/)

---

## Aperçu du prochain cours

> Dans le prochain cours, nous apprendrons **[Exemple de fichier de configuration](../config-file-example/)**.
>
> Vous apprendrez :
> - Un modèle de fichier de configuration complet
> - Des annotations détaillées pour tous les champs de configuration
> - Des explications sur les valeurs par défaut du fichier de configuration

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer et voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-27

| Type d'événement | Chemin du fichier | Numéros de ligne | Fonction de traitement |
| --- | --- | --- | --- |
| session.idle | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L249-L284) | 249-284 | `handleSessionIdle` |
| session.error | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L286-L313) | 286-313 | `handleSessionError` |
| permission.updated | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L315-L334) | 315-334 | `handlePermissionUpdated` |
| tool.execute.before | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L336-L351) | 336-351 | `handleQuestionAsked` |
| Configuration de l'écouteur d'événements | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L367-L402) | 367-402 | `NotifyPlugin` |

**Constantes clés** :
- `DEFAULT_CONFIG` (L56-68) : Configuration par défaut, incluant les sons et les paramètres de période de silence
- `TERMINAL_PROCESS_NAMES` (L71-84) : Correspondance entre les noms de terminaux et les noms de processus macOS

**Fonctions clés** :
- `sendNotification()` (L227-243) : Envoyer une notification native, gérer la fonction de focus macOS
- `isParentSession()` (L205-214) : Vérifier s'il s'agit d'une session parent
- `isQuietHours()` (L181-199) : Vérifier si l'on est en période de silence
- `isTerminalFocused()` (L166-175) : Vérifier si le terminal est focalisé (macOS uniquement)

</details>

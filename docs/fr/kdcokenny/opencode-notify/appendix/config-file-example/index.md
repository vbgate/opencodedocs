---
title: "Exemple de configuration : notifyChildSessions et sounds | Tutoriel opencode-notify"
sidebarTitle: "Configuration personnalisée"
subtitle: "Exemple de configuration : notifyChildSessions et sounds"
description: "Consultez l'exemple complet de fichier de configuration opencode-notify, apprenez les annotations détaillées de tous les champs de configuration tels que notifyChildSessions, sounds, quietHours, terminal, les paramètres par défaut, l'exemple de configuration minimale, la liste complète des sons disponibles sur macOS et la méthode de désactivation du plugin, et accédez au journal des modifications pour connaître l'historique des versions et les nouvelles améliorations de fonctionnalités."
tags:
  - "Configuration"
  - "Exemple"
  - "Annexe"
order: 140
---

# Exemple de fichier de configuration

## Exemple de configuration complet

Enregistrez le contenu suivant dans `~/.config/opencode/kdco-notify.json` :

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
  "terminal": "Ghostty"
}
```

## Description des champs

### notifyChildSessions

- **Type** : boolean
- **Valeur par défaut** : `false`
- **Description** : Activer ou non les notifications des sessions enfants (sous-tâches)

Par défaut, le plugin ne notifie que les sessions parentes pour éviter le bruit des notifications provenant des sous-tâches. Si vous souhaitez suivre l'état d'achèvement de toutes les sous-tâches, définissez cette valeur sur `true`.

```json
{
  "notifyChildSessions": false  // Ne notifier que les sessions parentes (recommandé)
}
```

### sounds

Configuration des sons, uniquement applicable sur la plateforme macOS.

#### sounds.idle

- **Type** : string
- **Valeur par défaut** : `"Glass"`
- **Description** : Son joué lors de l'achèvement d'une tâche

Joué lorsque la session IA passe en état inactif (tâche terminée).

#### sounds.error

- **Type** : string
- **Valeur par défaut** : `"Basso"`
- **Description** : Son joué en cas d'erreur

Joué lorsque la session IA rencontre une erreur d'exécution.

#### sounds.permission

- **Type** : string
- **Valeur par défaut** : `"Submarine"`
- **Description** : Son joué lors d'une demande d'autorisation

Joué lorsque l'IA nécessite l'autorisation de l'utilisateur pour effectuer une action.

#### sounds.question

- **Type** : string (optionnel)
- **Valeur par défaut** : non défini (utilise le son permission)
- **Description** : Son joué lors d'une question posée à l'utilisateur

Joué lorsque l'IA pose une question à l'utilisateur. Si non défini, le son `permission` sera utilisé.

### quietHours

Configuration des heures silencieuses, pour éviter de recevoir des notifications pendant une période spécifiée.

#### quietHours.enabled

- **Type** : boolean
- **Valeur par défaut** : `false`
- **Description** : Activer ou non les heures silencieuses

#### quietHours.start

- **Type** : string
- **Valeur par défaut** : `"22:00"`
- **Description** : Heure de début du silence (format 24h, HH:MM)

#### quietHours.end

- **Type** : string
- **Valeur par défaut** : `"08:00"`
- **Description** : Heure de fin du silence (format 24h, HH:MM)

Prend en charge les plages horaires traversant minuit, par exemple de `"22:00"` à `"08:00"` signifie qu'aucune notification ne sera envoyée de 22h à 8h du matin suivant.

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

### terminal

- **Type** : string (optionnel)
- **Valeur par défaut** : non défini (détection automatique)
- **Description** : Spécifier manuellement le type de terminal, remplaçant la détection automatique

Si la détection automatique échoue ou si vous souhaitez spécifier manuellement, vous pouvez définir le nom de votre terminal.

```json
{
  "terminal": "Ghostty"  // ou "iTerm", "Kitty", "WezTerm", etc.
}
```

## Liste des sons disponibles sur macOS

Voici les sons de notification intégrés au système macOS, utilisables dans la configuration `sounds` :

- Basso
- Blow
- Bottle
- Frog
- Funk
- Glass
- Hero
- Morse
- Ping
- Pop
- Purr
- Sosumi
- Submarine
- Tink

## Exemple de configuration minimale

Si vous souhaitez modifier uniquement quelques paramètres, vous pouvez inclure uniquement les champs à modifier, les autres champs utiliseront les valeurs par défaut :

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

## Désactiver le plugin

Pour désactiver temporairement le plugin, supprimez simplement le fichier de configuration, le plugin reviendra alors à sa configuration par défaut.

## Aperçu de la leçon suivante

> Dans la prochaine leçon, nous apprendrons le **[Journal des modifications](../changelog/release-notes/)**.
>
> Vous découvrirez :
> - L'historique des versions et les changements importants
> - Les nouvelles fonctionnalités et les améliorations

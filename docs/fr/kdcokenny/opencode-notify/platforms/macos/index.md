---
title: "Fonctionnalités macOS : Détection du focus, clic pour activer et sons personnalisés | opencode-notify"
sidebarTitle: "Cliquer sur la notification pour revenir au terminal"
subtitle: "Fonctionnalités spécifiques à macOS"
description: "Découvrez les fonctionnalités exclusives d'opencode-notify sur macOS : détection intelligente du focus pour éviter les notifications redondantes, activation automatique du terminal au clic, et 12 sons système personnalisables. Ce tutoriel détaille la configuration, la liste des sons disponibles et les astuces pratiques pour exploiter pleinement les notifications natives de macOS."
tags:
  - "Fonctionnalités plateforme"
  - "macOS"
  - "Détection du focus"
prerequisite:
  - "start-quick-start"
order: 30
---

# Fonctionnalités spécifiques à macOS

## Ce que vous apprendrez

- ✅ Configurer la détection intelligente du focus pour que le plugin sache quand vous regardez le terminal
- ✅ Activer automatiquement la fenêtre du terminal en cliquant sur une notification
- ✅ Personnaliser les sons de notification pour différents événements
- ✅ Comprendre les avantages et limitations propres à macOS

## Votre situation actuelle

Lorsque vous utilisez OpenCode, vous passez constamment d'une fenêtre à l'autre : l'IA exécute des tâches en arrière-plan, vous consultez votre navigateur pour des recherches, et toutes les quelques dizaines de secondes, vous devez revenir vérifier : la tâche est-elle terminée ? Y a-t-il une erreur ? L'IA attend-elle votre intervention ?

Ce serait tellement pratique d'avoir une notification native sur le bureau, comme lorsque vous recevez un message sur une application de messagerie, pour vous alerter quand l'IA a terminé ou a besoin de vous.

## Quand utiliser ces fonctionnalités

- **Vous utilisez OpenCode sur macOS** - Ce tutoriel s'applique uniquement à macOS
- **Vous souhaitez optimiser votre workflow** - Éviter de changer constamment de fenêtre pour vérifier l'état de l'IA
- **Vous voulez une meilleure expérience de notification** - Profiter des avantages des notifications natives de macOS

::: info Pourquoi macOS est-il plus puissant ?
La plateforme macOS offre des capacités de notification complètes : détection du focus, activation au clic, sons personnalisés. Windows et Linux ne supportent actuellement que les fonctionnalités de base des notifications natives.
:::

## 🎒 Avant de commencer

Avant de démarrer, assurez-vous d'avoir complété :

::: warning Prérequis
- [ ] Avoir terminé le tutoriel [Démarrage rapide](../../start/quick-start/)
- [ ] Le plugin est installé et fonctionne correctement
- [ ] Vous utilisez macOS
:::

## Concept clé

L'expérience complète de notification sur macOS repose sur trois capacités essentielles :

### 1. Détection intelligente du focus

Le plugin sait si vous regardez actuellement la fenêtre du terminal. Si vous êtes en train d'examiner la sortie de l'IA, il ne vous enverra pas de notification pour ne pas vous déranger. Les notifications ne sont envoyées que lorsque vous passez à une autre application.

**Principe de fonctionnement** : Via le service système `osascript` de macOS, le plugin interroge le nom du processus de l'application au premier plan et le compare avec le nom du processus de votre terminal.

### 2. Activation du terminal au clic

Après avoir reçu une notification, cliquez simplement sur la carte de notification et la fenêtre du terminal passera automatiquement au premier plan. Vous pouvez reprendre votre travail immédiatement.

**Principe de fonctionnement** : Le Centre de notifications de macOS supporte l'option `activate`. En passant le Bundle ID de l'application, l'activation au clic est possible.

### 3. Sons personnalisés

Attribuez différents sons à différents types d'événements : un son clair pour la fin d'une tâche, un son grave pour une erreur, vous permettant de comprendre la situation sans même regarder la notification.

**Principe de fonctionnement** : En utilisant les 14 sons système intégrés à macOS (comme Glass, Basso, Submarine), il suffit de spécifier le champ `sounds` dans le fichier de configuration.

::: tip Synergie des trois capacités
Détection du focus pour éviter les interruptions → Clic sur notification pour revenir rapidement → Sons pour identifier rapidement le type d'événement
:::

## Suivez le guide

### Étape 1 : Vérifier le terminal détecté automatiquement

Le plugin détecte automatiquement votre émulateur de terminal au démarrage. Vérifions s'il a été correctement identifié.

**Pourquoi**

Le plugin doit connaître votre terminal pour activer les fonctionnalités de détection du focus et d'activation au clic.

**Procédure**

1. Ouvrez votre répertoire de configuration OpenCode :
   ```bash
   ls ~/.config/opencode/
   ```

2. Si vous avez déjà créé un fichier de configuration `kdco-notify.json`, vérifiez s'il contient un champ `terminal` :
   ```bash
   cat ~/.config/opencode/kdco-notify.json
   ```

3. Si le fichier de configuration ne contient pas de champ `terminal`, le plugin utilise la détection automatique.

**Résultat attendu**

Si le fichier de configuration ne contient pas de champ `terminal`, le plugin détecte automatiquement. Les terminaux supportés incluent :
- **Terminaux courants** : Ghostty, Kitty, iTerm2, WezTerm, Alacritty
- **Terminal système** : Terminal.app intégré à macOS
- **Autres terminaux** : Hyper, Warp, terminal intégré VS Code, etc.

::: info Support de 37+ terminaux
Le plugin utilise la bibliothèque `detect-terminal`, supportant plus de 37 émulateurs de terminal. Même si votre terminal n'est pas dans la liste courante, une tentative de reconnaissance automatique sera effectuée.
:::

### Étape 2 : Configurer les sons personnalisés

macOS propose 14 sons intégrés que vous pouvez attribuer à différents événements.

**Pourquoi**

Des sons différents vous permettent de comprendre approximativement ce qui se passe sans regarder la notification : tâche terminée ou erreur, l'IA attend ou a simplement fini.

**Procédure**

1. Ouvrez ou créez le fichier de configuration :
   ```bash
   nano ~/.config/opencode/kdco-notify.json
   ```

2. Ajoutez ou modifiez la configuration `sounds` :

```json
{
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  }
}
```

3. Enregistrez et quittez (Ctrl+O, Entrée, Ctrl+X)

**Résultat attendu**

Le champ `sounds` dans le fichier de configuration a quatre options :

| Champ | Fonction | Valeur par défaut | Configuration recommandée |
| --- | --- | --- | --- |
| `idle` | Son de fin de tâche | Glass | Glass (clair) |
| `error` | Son de notification d'erreur | Basso | Basso (grave) |
| `permission` | Son de demande de permission | Submarine | Submarine (alerte) |
| `question` | Son de question IA (optionnel) | permission | Purr (doux) |

::: tip Combinaison recommandée
Cette combinaison par défaut est intuitive : un son léger pour la fin, un son d'avertissement pour les erreurs, un son d'alerte pour les demandes de permission.
:::

### Étape 3 : Découvrir la liste des sons disponibles

macOS dispose de 14 sons intégrés que vous pouvez combiner librement.

**Pourquoi**

Connaître tous les sons disponibles vous aide à trouver la combinaison la mieux adaptée à vos habitudes de travail.

**Sons disponibles**

| Nom du son | Caractéristique | Cas d'utilisation |
| --- | --- | --- |
| Glass | Léger, clair | Fin de tâche |
| Basso | Grave, avertissement | Notification d'erreur |
| Submarine | Alerte, doux | Demande de permission |
| Blow | Puissant | Événement important |
| Bottle | Clair | Fin de sous-tâche |
| Frog | Décontracté | Rappel informel |
| Funk | Rythmé | Fin de tâches multiples |
| Hero | Grandiose | Fin d'étape importante |
| Morse | Code Morse | Lié au débogage |
| Ping | Clair | Rappel léger |
| Pop | Bref | Tâche rapide |
| Purr | Doux | Rappel discret |
| Sosumi | Unique | Événement spécial |
| Tink | Cristallin | Fin de petite tâche |

::: tip Reconnaître par le son
Une fois configuré, essayez différentes combinaisons de sons pour trouver celle qui convient le mieux à votre workflow.
:::

### Étape 4 : Tester la fonction d'activation au clic

Après avoir cliqué sur une notification, la fenêtre du terminal passe automatiquement au premier plan. C'est une fonctionnalité exclusive à macOS.

**Pourquoi**

Lorsque vous recevez une notification, vous n'avez pas besoin de basculer manuellement vers le terminal et de chercher la fenêtre. Cliquez sur la notification pour revenir directement à votre travail.

**Procédure**

1. Assurez-vous qu'OpenCode est en cours d'exécution et lancez une tâche IA
2. Passez à une autre application (comme le navigateur)
3. Attendez que la tâche IA se termine, vous recevrez une notification "Ready for review"
4. Cliquez sur la carte de notification

**Résultat attendu**

- La notification disparaît
- La fenêtre du terminal passe automatiquement au premier plan et obtient le focus
- Vous pouvez immédiatement examiner la sortie de l'IA

::: info Principe d'activation
Le plugin obtient dynamiquement le Bundle ID de l'application terminal via osascript, puis passe l'option `activate` lors de l'envoi de la notification. Lorsque le Centre de notifications de macOS reçoit cette option, cliquer sur la notification active automatiquement l'application correspondante.
:::

### Étape 5 : Vérifier la fonction de détection du focus

Lorsque vous regardez le terminal, vous ne recevez pas de notification. Cela évite les rappels redondants.

**Pourquoi**

Si vous regardez déjà le terminal, la notification est superflue. Les notifications n'ont de sens que lorsque vous êtes passé à une autre application.

**Procédure**

1. Ouvrez OpenCode et lancez une tâche IA
2. Gardez la fenêtre du terminal au premier plan (ne changez pas de fenêtre)
3. Attendez que la tâche se termine

**Résultat attendu**

- Vous ne recevez pas de notification "Ready for review"
- Le terminal affiche que la tâche est terminée

**Ensuite, essayez** :

1. Lancez une autre tâche IA
2. Passez au navigateur ou à une autre application
3. Attendez que la tâche se termine

**Résultat attendu**

- Vous recevez une notification "Ready for review"
- Le son configuré est joué (Glass par défaut)

::: tip L'intelligence de la détection du focus
Le plugin sait quand vous regardez le terminal et quand vous ne le regardez pas. Ainsi, vous ne manquez pas les rappels importants et vous n'êtes pas dérangé par des notifications redondantes.
:::

## Point de contrôle ✅

### Vérification de la configuration

- [ ] Le fichier de configuration `~/.config/opencode/kdco-notify.json` existe
- [ ] Le champ `sounds` est configuré (contient au moins idle, error, permission)
- [ ] Le champ `terminal` n'est pas défini (utilisation de la détection automatique)

### Vérification des fonctionnalités

- [ ] Vous recevez une notification après la fin d'une tâche IA
- [ ] La fenêtre du terminal passe au premier plan après avoir cliqué sur la notification
- [ ] Vous ne recevez pas de notification redondante lorsque la fenêtre du terminal est au premier plan
- [ ] Différents types d'événements jouent différents sons

::: danger La détection du focus ne fonctionne pas ?
Si la fenêtre du terminal ne passe pas au premier plan après avoir cliqué sur la notification, cela peut être dû à :
1. L'application terminal n'a pas été correctement identifiée - Vérifiez le champ `terminal` dans le fichier de configuration
2. Échec de l'obtention du Bundle ID - Consultez les messages d'erreur dans les logs d'OpenCode
:::

## Pièges à éviter

### Le son ne se joue pas

**Problème** : Les sons sont configurés, mais aucun son lors de la notification

**Causes possibles** :
1. Le volume système est trop bas ou en sourdine
2. Les sons de notification sont désactivés dans les préférences système de macOS

**Solution** :
1. Vérifiez le volume système et les paramètres de notification
2. Ouvrez « Réglages Système → Notifications → OpenCode » et assurez-vous que le son est activé

### Le clic sur la notification n'active pas le terminal

**Problème** : Après avoir cliqué sur la notification, la fenêtre du terminal ne passe pas au premier plan

**Causes possibles** :
1. L'application terminal n'a pas été détectée automatiquement
2. Échec de l'obtention du Bundle ID

**Solution** :
1. Spécifiez manuellement le type de terminal :
   ```json
   {
     "terminal": "ghostty"  // ou un autre nom de terminal
   }
   ```

2. Assurez-vous que le nom de l'application terminal est correct (sensible à la casse)

### La détection du focus ne fonctionne pas

**Problème** : Vous recevez des notifications même lorsque le terminal est au premier plan

**Causes possibles** :
1. Échec de la détection du nom du processus terminal
2. L'application terminal n'est pas dans la liste de détection automatique

**Solution** :
1. Spécifiez manuellement le type de terminal :
   ```json
   {
     "terminal": "ghostty"  // ou un autre nom de terminal
   }
   ```

2. Assurez-vous que le nom de l'application terminal est correct (sensible à la casse)
3. Consultez les logs pour confirmer que le terminal est correctement identifié

## Résumé

macOS offre une expérience de notification complète :

| Fonctionnalité | Utilité | Support plateforme |
| --- | --- | --- |
| Notification native | Affiche des notifications système | ✅ macOS<br>✅ Windows<br>✅ Linux |
| Sons personnalisés | Sons différents par événement | ✅ macOS |
| Détection du focus | Évite les notifications redondantes | ✅ macOS |
| Activation au clic | Retour rapide au travail | ✅ macOS |

**Configuration essentielle** :
```json
{
  "sounds": {
    "idle": "Glass",       // Fin de tâche
    "error": "Basso",      // Erreur
    "permission": "Submarine"  // Demande de permission
  }
}
```

**Workflow** :
1. L'IA termine une tâche → Envoi de notification → Son Glass joué
2. Vous travaillez dans le navigateur → Réception de la notification → Clic
3. Le terminal passe au premier plan → Examen de la sortie de l'IA

## Aperçu du prochain tutoriel

> Dans le prochain tutoriel, nous aborderons les **[Fonctionnalités spécifiques à Windows](../windows/)**.
>
> Vous apprendrez :
> - Quelles fonctionnalités sont supportées sur Windows
> - Les différences par rapport à macOS
> - Comment configurer les notifications sur Windows

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-27

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Détection du focus | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| Activation au clic | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L238-L240) | 238-240 |
| Obtention du Bundle ID | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L135-L137) | 135-137 |
| Détection de l'app au premier plan | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L139-L143) | 139-143 |
| Mapping des noms de terminaux | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84 |
| Configuration des sons par défaut | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L59-L61) | 59-61 |
| Liste des sons macOS | [`README.md`](https://github.com/kdcokenny/opencode-notify/blob/main/README.md#L81) | 81 |
| Tableau comparatif des fonctionnalités | [`README.md`](https://github.com/kdcokenny/opencode-notify/blob/main/README.md#L54-L62) | 54-62 |

**Constantes clés** :

- `TERMINAL_PROCESS_NAMES` (lignes 71-84) : Table de mapping des noms de terminaux vers les noms de processus macOS
  - `ghostty` → `"Ghostty"`
  - `kitty` → `"kitty"`
  - `iterm` / `iterm2` → `"iTerm2"`
  - `wezterm` → `"WezTerm"`
  - `alacritty` → `"Alacritty"`
  - `terminal` / `apple_terminal` → `"Terminal"`
  - `hyper` → `"Hyper"`
  - `warp` → `"Warp"`
  - `vscode` → `"Code"`
  - `vscode-insiders` → `"Code - Insiders"`

**Configuration par défaut** :

- `sounds.idle = "Glass"` : Son de fin de tâche
- `sounds.error = "Basso"` : Son de notification d'erreur
- `sounds.permission = "Submarine"` : Son de demande de permission

**Fonctions clés** :

- `isTerminalFocused(terminalInfo)` (lignes 166-175) : Détecte si le terminal est l'application au premier plan
  - Utilise `osascript` pour obtenir le nom du processus de l'app au premier plan
  - Compare avec le `processName` du terminal (insensible à la casse)
  - Activé uniquement sur la plateforme macOS

- `getBundleId(appName)` (lignes 135-137) : Obtient dynamiquement le Bundle ID de l'application
  - Utilise `osascript` pour la requête
  - Le Bundle ID est utilisé pour la fonction d'activation au clic

- `getFrontmostApp()` (lignes 139-143) : Obtient l'application actuellement au premier plan
  - Utilise `osascript` pour interroger System Events
  - Retourne le nom du processus de l'app au premier plan

- `sendNotification(options)` (lignes 227-243) : Envoie une notification
  - Spécificité macOS : si la plateforme est darwin et que `terminalInfo.bundleId` existe, définit l'option `activate` pour l'activation au clic

</details>

---
title: "Utilisation avancée : Astuces de configuration et bonnes pratiques | Tutoriel opencode-notify"
sidebarTitle: "Optimiser les notifications en 5 min"
subtitle: "Utilisation avancée : Astuces de configuration et bonnes pratiques | Tutoriel opencode-notify"
description: "Apprenez les techniques avancées de configuration d'opencode-notify : filtrage des sessions parentes, personnalisation des sons, paramètres de terminal, mode silencieux et bonnes pratiques."
tags:
  - "Configuration"
  - "Bonnes pratiques"
  - "Sons"
prerequisite:
  - "start-quick-start"
  - "advanced-config-reference"
order: 100
---

# Utilisation avancée : Astuces de configuration et bonnes pratiques

## Ce que vous apprendrez

- Comprendre pourquoi seules les sessions parentes sont notifiées par défaut, réduisant ainsi le bruit
- Personnaliser les sons de notification macOS pour distinguer les différents types d'événements
- Spécifier manuellement le type de terminal pour résoudre les problèmes de détection automatique
- Configurer le mode silencieux temporaire pour éviter les interruptions pendant les réunions ou les sessions de concentration
- Optimiser votre stratégie de notification en équilibrant réactivité et perturbation

## Votre situation actuelle

Le plugin de notification est pratique, mais la configuration par défaut peut ne pas convenir à tous les flux de travail :

- Vous souhaitez suivre toutes les sous-tâches IA, mais seules les sessions parentes sont notifiées par défaut
- Vous utilisez un terminal peu courant et la détection automatique échoue
- Vous voulez désactiver temporairement les notifications pendant une réunion sans modifier le fichier de configuration
- Tous les types d'événements utilisent le même son, impossible de distinguer une tâche terminée d'une erreur

## Quand utiliser ces techniques

Lorsque vous maîtrisez déjà les bases du plugin et souhaitez optimiser l'expérience de notification selon votre flux de travail personnel.

---

## Concept clé

La configuration par défaut du plugin de notification a été soigneusement conçue, mais vous pouvez ajuster son comportement via le fichier de configuration. Le principe fondamental est :

**Réduire le bruit, augmenter la valeur**

- **Filtrage des sessions parentes** : Notifier uniquement les tâches principales, ignorer les sous-tâches internes de l'IA
- **Détection du focus** : Pas de notification lorsque le terminal est actif, évitant les rappels redondants
- **Notifications groupées** : Regrouper les notifications lorsque plusieurs tâches se terminent simultanément

::: info Remarque
Tous les paramètres de configuration sont détaillés dans la [Référence de configuration](../config-reference/). Cette leçon se concentre sur les astuces pratiques et les bonnes pratiques.
:::

---

## 🎒 Prérequis

Assurez-vous d'avoir terminé le [Démarrage rapide](../../start/quick-start/) et d'avoir reçu votre première notification avec succès.

---

## Suivez le guide

### Étape 1 : Comprendre le filtrage des sessions parentes

**Pourquoi**

Les sessions OpenCode ont une structure arborescente : une session parente peut avoir plusieurs sessions enfants. Par défaut, le plugin ne notifie que la fin des sessions parentes, évitant le bruit des sous-tâches.

**Vérifier la configuration**

Éditez le fichier de configuration :

```bash
# macOS/Linux
~/.config/opencode/kdco-notify.json

# Windows
%APPDATA%\opencode\kdco-notify.json
```

```json
{
  "notifyChildSessions": false  // ← false par défaut
}
```

**Ce que vous devriez voir** :
- `notifyChildSessions: false` signifie que seules les sessions racines sont notifiées
- Les appels d'outils internes exécutés par l'IA ne déclenchent pas de notification

**Quand activer les notifications des sessions enfants**

Si vous devez suivre chaque sous-tâche (par exemple pour déboguer un workflow multi-étapes), définissez la valeur sur `true` :

```json
{
  "notifyChildSessions": true  // ← Une fois activé, chaque sous-tâche déclenche une notification
}
```

::: warning Attention
Activer les notifications des sessions enfants augmente significativement la fréquence des notifications. À utiliser avec précaution.
:::

---

### Étape 2 : Personnaliser les sons de notification macOS

**Pourquoi**

Utiliser différents sons pour différents types d'événements vous permet de savoir ce qui s'est passé sans regarder la notification.

**Voir les sons disponibles**

macOS propose 14 sons système intégrés :

| Nom du son | Cas d'utilisation | Style |
| --- | --- | --- |
| Glass | Tâche terminée (par défaut) | Cristallin |
| Basso | Erreur (par défaut) | Grave |
| Submarine | Demande de permission (par défaut) | Doux |
| Bottle | Événement spécial | Léger |
| Ping | Rappel général | Simple |
| Pop | Événement décontracté | Vif |
| Purr | Événement réussi | Chaleureux |
| Blow | Avertissement | Urgent |
| Funk | Marqueur spécial | Unique |
| Frog | Rappel | Sonore |
| Hero | Événement important | Grandiose |
| Morse | Notification | Rythmé |
| Sosumi | Alerte système | Classique |
| Tink | Terminé | Léger |

**Personnaliser les sons**

Modifiez la section `sounds` dans la configuration :

```json
{
  "sounds": {
    "idle": "Ping",        // Tâche terminée
    "error": "Blow",      // Erreur (plus urgent)
    "permission": "Pop",   // Demande de permission (plus léger)
    "question": "Tink"    // Question (optionnel, utilise le son de permission par défaut)
  }
}
```

**Ce que vous devriez voir** :
- Après modification, différents types d'événements jouent leurs sons correspondants
- Si `sounds.question` n'est pas défini, le son de `sounds.permission` sera utilisé

::: tip Astuce
Les sons ne fonctionnent que sur macOS. Windows et Linux utilisent le son de notification système par défaut.
:::

---

### Étape 3 : Spécifier manuellement le type de terminal

**Pourquoi**

La bibliothèque `detect-terminal` prend en charge plus de 37 terminaux, mais les terminaux peu courants ou les versions personnalisées peuvent ne pas être reconnus.

**Vérifier le terminal détecté**

Il n'est pas possible de voir directement le résultat de la détection, mais vous pouvez le déduire des logs :

```bash
# L'interface OpenCode affiche les logs de démarrage du plugin
```

Si vous voyez quelque chose comme "Terminal detection failed" ou si les notifications ne peuvent pas mettre le focus, vous devrez peut-être spécifier manuellement.

**Spécifier manuellement le terminal**

Ajoutez le champ `terminal` dans la configuration :

```json
{
  "terminal": "wezterm"  // Utilisez le nom du terminal en minuscules
}
```

**Noms de terminaux pris en charge**

Noms de terminaux courants (insensible à la casse) :

| Terminal | Valeur de configuration |
| --- | --- |
| Ghostty | `"ghostty"` |
| Kitty | `"kitty"` |
| iTerm2 | `"iterm"` ou `"iterm2"` |
| WezTerm | `"wezterm"` |
| Alacritty | `"alacritty"` |
| Terminal macOS | `"terminal"` ou `"apple_terminal"` |
| Hyper | `"hyper"` |
| Terminal VS Code | `"code"` ou `"code-insiders"` |

**Ce que vous devriez voir** :
- Après spécification manuelle, la détection du focus macOS et la fonction de mise au premier plan fonctionnent correctement
- Si la spécification est invalide, le plugin échoue silencieusement et revient à la détection automatique

---

### Étape 4 : Mode silencieux temporaire

**Pourquoi**

Pendant les réunions, les revues de code ou les sessions de concentration, vous pouvez souhaiter ne pas recevoir de notifications temporairement.

**Utiliser les heures silencieuses**

Si vous avez des plages horaires fixes chaque jour (comme la nuit) où vous ne souhaitez pas être dérangé, configurez les heures silencieuses :

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",  // 22h00
    "end": "08:00"     // 8h00 le lendemain
  }
}
```

**Prise en charge des plages traversant minuit**

Les heures silencieuses peuvent traverser minuit (comme 22:00-08:00) :

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"     // 22:00 - 08:00 le lendemain
  }
}
```

**Ce que vous devriez voir** :
- Pendant les heures silencieuses, aucune notification n'est envoyée pour tous les événements
- Les notifications reprennent normalement en dehors de cette plage

::: tip Astuce
Le format de l'heure doit être `HH:MM` (format 24 heures), par exemple `"22:30"`.
:::

---

### Étape 5 : Équilibrer la stratégie de notification

**Pourquoi**

La configuration par défaut est déjà optimisée, mais vous devrez peut-être l'ajuster selon votre flux de travail.

**Résumé de la stratégie par défaut**

| Paramètre | Valeur par défaut | Effet |
| --- | --- | --- |
| `notifyChildSessions` | `false` | Notifier uniquement les sessions parentes |
| `quietHours.enabled` | `false` | Heures silencieuses désactivées |

::: info Remarque
La fonction de détection du focus (pas de notification lorsque le terminal est actif) est activée en dur et ne peut pas être désactivée via la configuration.
:::

**Combinaisons de configuration recommandées**

**Scénario 1 : Perturbation minimale (par défaut)**

```json
{
  "notifyChildSessions": false
}
```

**Scénario 2 : Suivre toutes les tâches**

```json
{
  "notifyChildSessions": true
}
```

::: warning Attention
Cela augmente significativement la fréquence des notifications. Adapté aux scénarios nécessitant une surveillance fine.
:::

**Scénario 3 : Mode silencieux nocturne**

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

**Ce que vous devriez voir** :
- Selon les différents scénarios, le comportement des notifications varie significativement
- Ajustez progressivement pour trouver la configuration qui vous convient le mieux

---

## Point de contrôle ✅

Après avoir terminé la configuration, vérifiez les éléments suivants :

| Élément à vérifier | Méthode de vérification |
| --- | --- |
| Filtrage des sessions parentes | Déclenchez une tâche IA avec des sous-tâches, vous ne devriez recevoir qu'une seule notification "Ready for review" |
| Personnalisation des sons | Déclenchez respectivement une tâche terminée, une erreur et une demande de permission, écoutez les différents sons |
| Remplacement du terminal | Sur macOS, cliquez sur la notification, la fenêtre du terminal devrait passer au premier plan correctement |
| Heures silencieuses | Déclenchez un événement pendant les heures silencieuses, aucune notification ne devrait être reçue |

---

## Pièges à éviter

### Les modifications de configuration ne prennent pas effet

**Problème** : Après avoir modifié le fichier de configuration, le comportement des notifications ne change pas.

**Cause** : OpenCode peut nécessiter un redémarrage du plugin ou d'OpenCode lui-même.

**Solution** : Redémarrez OpenCode CLI ou OpenCode UI.

---

### Le son ne joue pas

**Problème** : Vous avez défini un son personnalisé, mais c'est toujours le son par défaut.

**Causes** :
- Faute d'orthographe dans le nom du son
- Vous n'êtes pas sur la plateforme macOS

**Solutions** :
- Vérifiez que le nom du son est dans la liste des sons pris en charge (sensible à la casse)
- Confirmez que vous utilisez macOS

---

### Le remplacement du terminal ne fonctionne pas

**Problème** : Vous avez défini le champ `terminal`, mais cliquer sur la notification ne met toujours pas le focus.

**Causes** :
- Nom du terminal incorrect
- Le nom du processus du terminal ne correspond pas à la valeur de configuration

**Solutions** :
- Essayez le nom en minuscules
- Consultez la liste des [terminaux pris en charge](../../platforms/terminals/)

---

## Résumé de la leçon

Cette leçon a couvert l'utilisation avancée et les bonnes pratiques d'opencode-notify :

- **Filtrage des sessions parentes** : Par défaut, seules les sessions racines sont notifiées, évitant le bruit des sous-tâches
- **Personnalisation des sons** : macOS permet de personnaliser 14 sons pour distinguer les types d'événements
- **Remplacement du terminal** : Spécifiez manuellement le type de terminal pour résoudre les problèmes de détection automatique
- **Mode silencieux temporaire** : Configurez les heures silencieuses via `quietHours`
- **Équilibre stratégique** : Ajustez la configuration selon votre flux de travail, en équilibrant réactivité et perturbation

**Principe fondamental** : Réduire le bruit, augmenter la valeur. La configuration par défaut est déjà optimisée, dans la plupart des cas aucune modification n'est nécessaire.

---

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons le **[Dépannage](../../faq/troubleshooting/)**.
>
> Vous apprendrez :
> - Que faire si les notifications ne s'affichent pas
> - Comment diagnostiquer les problèmes de détection du focus
> - Comprendre les messages d'erreur courants
> - Solutions aux problèmes spécifiques à chaque plateforme

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-27

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Détection session parente | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L205-L214) | 205-214 |
| Schéma de configuration | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L30-L68) | 30-68 |
| Configuration par défaut | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |
| Liste des sons macOS | [`README.md`](https://github.com/kdcokenny/opencode-notify/blob/main/README.md#L81) | 81 |
</details>
 
**Constantes clés** :
- `DEFAULT_CONFIG` : Valeurs de configuration par défaut
- `TERMINAL_PROCESS_NAMES` : Table de correspondance entre les noms de terminaux et les noms de processus macOS

**Fonctions clés** :
- `isParentSession()` : Détermine si une session est une session parente
- `loadConfig()` : Charge et fusionne la configuration utilisateur

---
title: "FAQ opencode-notify : Performance, confidentialité et compatibilité multiplateforme"
sidebarTitle: "Comprendre les points clés"
subtitle: "Questions fréquentes : Performance, confidentialité et compatibilité"
description: "Découvrez l'impact d'opencode-notify sur le contexte IA et la consommation de ressources système. Confirmez que le plugin fonctionne entièrement en local sans envoi de données. Maîtrisez les stratégies de filtrage intelligent des notifications et la configuration des heures silencieuses. Apprenez la compatibilité avec les autres plugins OpenCode et les différences fonctionnelles entre macOS, Windows et Linux."
tags:
  - "FAQ"
  - "Performance"
  - "Confidentialité"
prerequisite:
  - "start-quick-start"
order: 120
---

# Questions fréquentes : Performance, confidentialité et compatibilité

## Ce que vous saurez faire

- Comprendre l'impact du plugin sur les performances et la consommation de ressources
- Connaître les garanties de confidentialité et de sécurité
- Maîtriser les stratégies de notification et les astuces de configuration
- Comprendre les différences entre plateformes et la compatibilité

---

## Performance

### Cela augmente-t-il le contexte de l'IA ?

**Non**. Le plugin utilise un modèle événementiel et n'ajoute aucun outil ni prompt aux conversations IA.

D'après l'implémentation du code source :

| Composant | Type | Implémentation | Impact sur le contexte |
| --- | --- | --- | --- |
| Écoute d'événements | Événement | Écoute les événements `session.idle`, `session.error`, `permission.updated` | ✅ Aucun impact |
| Hook d'outil | Hook | Surveille l'outil `question` via `tool.execute.before` | ✅ Aucun impact |
| Contenu des conversations | - | Ne lit, ne modifie, ni n'injecte aucun contenu de conversation | ✅ Aucun impact |

Dans le code source, le plugin se contente d'**écouter et notifier** — le contexte des conversations IA n'est absolument pas affecté.

### Quelle est la consommation de ressources système ?

**Très faible**. Le plugin adopte une conception « mise en cache au démarrage + déclenchement par événement » :

1. **Chargement de la configuration** : Le plugin lit le fichier de configuration (`~/.config/opencode/kdco-notify.json`) une seule fois au démarrage, sans le relire ensuite
2. **Détection du terminal** : Le type de terminal est détecté et mis en cache au démarrage (nom, Bundle ID, nom du processus), les événements suivants utilisent directement le cache
3. **Piloté par événements** : Le plugin n'exécute la logique de notification que lorsque l'IA déclenche des événements spécifiques

Caractéristiques de la consommation de ressources :

| Type de ressource | Consommation | Description |
| --- | --- | --- |
| CPU | Quasi nulle | Ne s'exécute brièvement qu'au déclenchement d'événements |
| Mémoire | < 5 Mo | Passe en mode veille après le démarrage |
| Disque | < 100 Ko | Fichier de configuration et code lui-même |
| Réseau | 0 | N'effectue aucune requête réseau |

---

## Confidentialité et sécurité

### Les données sont-elles envoyées à un serveur ?

**Non**. Le plugin fonctionne entièrement en local et n'envoie aucune donnée.

**Garanties de confidentialité** :

| Type de données | Traitement | Envoi ? |
| --- | --- | --- |
| Contenu des conversations IA | Non lu, non stocké | ❌ Non |
| Informations de session (titre) | Utilisé uniquement pour le texte de notification | ❌ Non |
| Messages d'erreur | Utilisé uniquement pour le texte de notification (max 100 caractères) | ❌ Non |
| Informations du terminal | Détecté et mis en cache localement | ❌ Non |
| Configuration | Fichier local (`~/.config/opencode/`) | ❌ Non |
| Contenu des notifications | Envoyé via l'API native de notification système | ❌ Non |

**Implémentation technique** :

Le plugin utilise les notifications natives du système :
- macOS : Appelle `NSUserNotificationCenter` via `node-notifier`
- Windows : Appelle `SnoreToast` via `node-notifier`
- Linux : Appelle `notify-send` via `node-notifier`

Toutes les notifications sont déclenchées localement et ne passent pas par les services cloud d'OpenCode.

### Le plugin peut-il accéder au contenu de mes conversations ?

**Non**. Le plugin ne lit que les **métadonnées nécessaires** :

| Données lues | Utilisation | Limitation |
| --- | --- | --- |
| Titre de session (title) | Texte de notification | Seulement les 50 premiers caractères |
| Message d'erreur (error) | Texte de notification | Seulement les 100 premiers caractères |
| Informations du terminal | Détection du focus et activation au clic | Ne lit pas le contenu du terminal |
| Fichier de configuration | Paramètres personnalisés de l'utilisateur | Fichier local |

Le code source ne contient aucune logique de lecture des messages de conversation (messages) ou des entrées utilisateur (user input).

---

## Stratégie de notification

### Vais-je être submergé de notifications ?

**Non**. Le plugin intègre plusieurs mécanismes de filtrage intelligent pour éviter le bombardement de notifications.

**Stratégie de notification par défaut** :

| Type | Événement/Outil | Notification ? | Raison |
| --- | --- | --- | --- |
| Événement | Session parente terminée (session.idle) | ✅ Oui | Tâche principale terminée |
| Événement | Session enfant terminée (session.idle) | ❌ Non | La session parente notifiera globalement |
| Événement | Erreur de session (session.error) | ✅ Oui | Nécessite une action immédiate |
| Événement | Demande de permission (permission.updated) | ✅ Oui | L'IA est bloquée en attente |
| Hook d'outil | Question posée (tool.execute.before - question) | ✅ Oui | L'IA a besoin d'une entrée |

**Mécanismes de filtrage intelligent** :

1. **Notification des sessions parentes uniquement**
   - Code source : `notify.ts:256-259`
   - Configuration par défaut : `notifyChildSessions: false`
   - Évite les notifications pour chaque sous-tâche quand l'IA décompose le travail

2. **Suppression quand le terminal est au premier plan** (macOS)
   - Code source : `notify.ts:265`
   - Logique : Quand le terminal est la fenêtre active, aucune notification n'est envoyée (comportement intégré, pas de configuration nécessaire)
   - Évite les rappels redondants quand vous regardez déjà le terminal
   - **Note** : Cette fonctionnalité n'est disponible que sur macOS (nécessite les informations du terminal pour la détection)

3. **Heures silencieuses**
   - Code source : `notify.ts:262`, `notify.ts:181-199`
   - Configuration par défaut : `quietHours: { enabled: false, start: "22:00", end: "08:00" }`
   - Configurable pour éviter les dérangements nocturnes

4. **Les demandes de permission notifient toujours**
   - Code source : `notify.ts:319`
   - Raison : L'IA est bloquée en attente d'autorisation utilisateur, la notification est indispensable
   - Pas de vérification de session parente

### Puis-je recevoir uniquement certains types de notifications ?

**Oui**. Bien que le plugin n'ait pas d'interrupteurs individuels par type de notification, vous pouvez utiliser les heures silencieuses et la détection du focus terminal :

- **Recevoir uniquement les notifications urgentes** : La détection du focus terminal est un comportement intégré — quand vous êtes dans le terminal, vous ne recevez pas de notifications (macOS)
- **Recevoir uniquement les notifications nocturnes** : Activez les heures silencieuses (ex : 09:00-18:00), utilisez-les à l'inverse

Si vous avez besoin d'un contrôle plus fin, vous pouvez soumettre une Feature Request.

---

## Compatibilité du plugin

### Y a-t-il des conflits avec d'autres plugins OpenCode ?

**Non**. Le plugin s'intègre via l'API standard des plugins OpenCode, sans modifier le comportement de l'IA ni interférer avec les autres plugins.

**Méthode d'intégration** :

| Composant | Méthode d'intégration | Risque de conflit |
| --- | --- | --- |
| Écoute d'événements | Hook `event` du SDK OpenCode | ❌ Aucun conflit |
| Hook d'outil | Hook `tool.execute.before` de l'API Plugin OpenCode | ❌ Aucun conflit (écoute uniquement l'outil `question`) |
| Requête de session | `client.session.get()` du SDK OpenCode | ❌ Aucun conflit (lecture seule) |
| Envoi de notification | Processus indépendant `node-notifier` | ❌ Aucun conflit |

**Plugins pouvant coexister** :

- Plugins officiels OpenCode (comme `opencode-coder`)
- Plugins tiers (comme `opencode-db`, `opencode-browser`)
- Plugins personnalisés

Tous les plugins fonctionnent en parallèle via l'API Plugin standard, sans interférence mutuelle.

### Quelles plateformes sont supportées ? Y a-t-il des différences fonctionnelles ?

**macOS, Windows et Linux sont supportés, mais avec des différences fonctionnelles**.

| Fonctionnalité | macOS | Windows | Linux |
| --- | --- | --- | --- |
| Notifications natives | ✅ Supporté | ✅ Supporté | ✅ Supporté |
| Sons personnalisés | ✅ Supporté | ❌ Non supporté | ❌ Non supporté |
| Détection du focus terminal | ✅ Supporté | ❌ Non supporté | ❌ Non supporté |
| Activation au clic sur notification | ✅ Supporté | ❌ Non supporté | ❌ Non supporté |
| Détection automatique du terminal | ✅ Supporté | ✅ Supporté | ✅ Supporté |
| Heures silencieuses | ✅ Supporté | ✅ Supporté | ✅ Supporté |

**Raisons des différences entre plateformes** :

| Plateforme | Explication |
| --- | --- |
| macOS | Le système fournit des API de notification riches et des interfaces de gestion d'applications (comme `osascript`), supportant les sons, la détection du focus et l'activation au clic |
| Windows | L'API de notification système a des fonctionnalités limitées, ne supportant pas la détection du premier plan au niveau application ni la personnalisation des sons |
| Linux | Dépend du standard `notify-send`, fonctionnalités similaires à Windows |

**Fonctionnalités principales multiplateformes** :

Quelle que soit la plateforme utilisée, les fonctionnalités principales suivantes sont disponibles :
- Notification de tâche terminée (session.idle)
- Notification d'erreur (session.error)
- Notification de demande de permission (permission.updated)
- Notification de question posée (tool.execute.before)
- Configuration des heures silencieuses

---

## Terminal et système

### Quels terminaux sont supportés ? Comment sont-ils détectés ?

**Plus de 37 émulateurs de terminal sont supportés**.

Le plugin utilise la bibliothèque [`detect-terminal`](https://github.com/jonschlinkert/detect-terminal) pour identifier automatiquement le terminal. Les terminaux supportés incluent :

**Terminaux macOS** :
- Ghostty, Kitty, iTerm2, WezTerm, Alacritty
- macOS Terminal, Hyper, Warp
- Terminal intégré VS Code (Code / Code - Insiders)

**Terminaux Windows** :
- Windows Terminal, Git Bash, ConEmu, Cmder
- PowerShell, CMD (via détection par défaut)

**Terminaux Linux** :
- gnome-terminal, konsole, xterm, lxterminal
- terminator, tilix, alacritty, kitty

**Mécanisme de détection** :

1. **Détection automatique** : Le plugin appelle la bibliothèque `detectTerminal()` au démarrage
2. **Remplacement manuel** : L'utilisateur peut spécifier le champ `terminal` dans le fichier de configuration pour remplacer la détection automatique
3. **Mapping macOS** : Le nom du terminal est mappé au nom du processus (ex : `ghostty` → `Ghostty`), utilisé pour la détection du focus

**Exemple de configuration** :

```json
{
  "terminal": "ghostty"
}
```

### Que se passe-t-il si la détection du terminal échoue ?

**Le plugin continue de fonctionner normalement, seule la détection du focus est désactivée**.

**Logique de gestion des échecs** :

| Scénario d'échec | Comportement | Impact |
| --- | --- | --- |
| `detectTerminal()` retourne `null` | Informations du terminal : `{ name: null, bundleId: null, processName: null }` | Pas de détection du focus, mais notifications envoyées normalement |
| Échec d'exécution `osascript` sur macOS | Échec d'obtention du Bundle ID | Activation au clic désactivée sur macOS, mais notifications normales |
| Valeur `terminal` invalide dans la configuration | Utilise le résultat de la détection automatique | Si la détection automatique échoue aussi, pas de détection du focus |

Logique correspondante dans le code source (`notify.ts:149-150`) :

```typescript
if (!terminalName) {
  return { name: null, bundleId: null, processName: null }
}
```

**Solution** :

Si la détection du terminal échoue, vous pouvez spécifier manuellement le type de terminal :

```json
{
  "terminal": "iterm2"
}
```

---

## Configuration et dépannage

### Où se trouve le fichier de configuration ? Comment le modifier ?

**Chemin du fichier de configuration** : `~/.config/opencode/kdco-notify.json`

**Exemple de configuration complète** :

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
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  },
  "terminal": "ghostty"
}
```

**Étapes pour modifier la configuration** :

1. Ouvrez le terminal et éditez le fichier de configuration :
   ```bash
   # macOS/Linux
   nano ~/.config/opencode/kdco-notify.json
   
   # Windows
   notepad %USERPROFILE%\.config\opencode\kdco-notify.json
   ```

2. Modifiez les options de configuration (référez-vous à l'exemple ci-dessus)

3. Enregistrez le fichier, la configuration prend effet automatiquement (pas besoin de redémarrer)

### Que se passe-t-il si le fichier de configuration est corrompu ?

**Le plugin utilise la configuration par défaut et gère l'erreur silencieusement**.

**Logique de gestion des erreurs** (`notify.ts:110-113`) :

```typescript
} catch {
  // Config doesn't exist or is invalid, use defaults
  return DEFAULT_CONFIG
}
```

**Solution** :

Si le fichier de configuration est corrompu (erreur de format JSON), le plugin revient à la configuration par défaut. Étapes de correction :

1. Supprimez le fichier de configuration corrompu :
   ```bash
   rm ~/.config/opencode/kdco-notify.json
   ```

2. Le plugin continue de fonctionner avec la configuration par défaut

3. Si vous avez besoin d'une configuration personnalisée, recréez le fichier de configuration

---

## Résumé de la leçon

Cette leçon a répondu aux questions les plus fréquentes des utilisateurs :

- **Impact sur les performances** : Le plugin n'augmente pas le contexte IA, consommation de ressources très faible (CPU quasi nul, mémoire < 5 Mo)
- **Confidentialité et sécurité** : Fonctionne entièrement en local, n'envoie aucune donnée, ne lit que les métadonnées nécessaires
- **Stratégie de notification** : Mécanismes de filtrage intelligent (notification des sessions parentes uniquement, suppression quand le terminal est au premier plan sur macOS, heures silencieuses)
- **Compatibilité du plugin** : Aucun conflit avec les autres plugins, supporte les trois plateformes principales avec des différences fonctionnelles
- **Support des terminaux** : Supporte plus de 37 terminaux, continue de fonctionner même si la détection automatique échoue

---

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous étudierons **[Types d'événements](../../appendix/event-types/)**.
>
> Vous apprendrez :
> - Les quatre types d'événements OpenCode écoutés par le plugin
> - Le moment de déclenchement et le contenu de notification de chaque événement
> - Les règles de filtrage des événements (vérification de session parente, heures silencieuses, focus terminal)
> - Les différences de traitement des événements selon les plateformes

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-27

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Démarrage du plugin et chargement de la configuration | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L357-L364) | 357-364 |
| Logique d'écoute des événements | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L372-L400) | 372-400 |
| Vérification de session parente | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L256-L259) | 256-259 |
| Vérification des heures silencieuses | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L262) | 262 |
| Détection du focus terminal | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L265) | 265 |
| Chargement du fichier de configuration | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |
| Détection des informations du terminal | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L176) | 145-176 |
| Définition de la configuration par défaut | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |

**Constantes clés** :
- `DEFAULT_CONFIG` : Configuration par défaut (notification des sessions parentes uniquement, sons Glass/Basso/Submarine, heures silencieuses désactivées par défaut)

**Fonctions clés** :
- `loadConfig()` : Charge la configuration utilisateur et fusionne avec les valeurs par défaut
- `detectTerminalInfo()` : Détecte les informations du terminal et les met en cache
- `isQuietHours()` : Vérifie si l'heure actuelle est dans la période silencieuse
- `isTerminalFocused()` : Vérifie si le terminal est la fenêtre active (macOS)
- `isParentSession()` : Vérifie si la session est une session parente

</details>

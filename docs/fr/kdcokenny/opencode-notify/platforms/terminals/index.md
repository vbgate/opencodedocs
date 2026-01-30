---
title: "Terminaux supportés : 37+ émulateurs de terminaux et principe de détection automatique | Tutoriel opencode-notify"
sidebarTitle: "Votre terminal est-il supporté"
subtitle: "Liste des terminaux supportés : 37+ émulateurs de terminaux"
description: "Découvrez les 37+ émulateurs de terminaux supportés par opencode-notify, incluant la liste complète des terminaux pour macOS, Windows et Linux. Ce tutoriel explique le principe de détection automatique des terminaux, la méthode de spécification manuelle, la résolution des problèmes d'identification, pour optimiser votre expérience de notification, activer le filtrage intelligent, éviter le bruit des notifications, réduire les changements de fenêtre, maintenir votre concentration et améliorer efficacement votre productivité."
tags:
  - "Terminal"
  - "Détection de terminal"
  - "Support de plateforme"
prerequisite:
  - "start-quick-start"
order: 60
---

# Liste des terminaux supportés : 37+ émulateurs de terminaux

## Ce que vous saurez faire

- Connaître tous les émulateurs de terminaux supportés par opencode-notify
- Vérifier si votre terminal est dans la liste des terminaux supportés
- Comprendre le principe de fonctionnement de la détection automatique des terminaux
- Apprendre à spécifier manuellement le type de terminal

## Votre problème actuel

Vous avez installé opencode-notify, mais les notifications ne fonctionnent pas correctement. Le terminal n'est peut-être pas détecté, ou la détection du focus échoue. Vous utilisez Alacritty / Windows Terminal / tmux et vous ne savez pas s'ils sont supportés. L'échec de l'identification du terminal entraîne la désactivation du filtrage intelligent, affectant l'expérience utilisateur.

## Quand utiliser cette solution

**Consultez la liste des terminaux supportés dans les situations suivantes** :
- Vous voulez savoir si votre terminal est supporté
- La détection automatique du terminal échoue et nécessite une configuration manuelle
- Vous basculez entre plusieurs terminaux et souhaitez connaître la compatibilité
- Vous voulez comprendre le principe technique de la détection des terminaux

## Concept clé

opencode-notify utilise la bibliothèque `detect-terminal` pour identifier automatiquement l'émulateur de terminal que vous utilisez, **supportant 37+ terminaux**. Après une détection réussie, le plugin peut :
- **Activer la détection du focus** (macOS uniquement) : Supprimer les notifications lorsque le terminal est au premier plan
- **Supporter le clic pour focus** (macOS uniquement) : Cliquer sur la notification pour basculer vers la fenêtre du terminal

::: info Pourquoi la détection du terminal est-elle importante ?

La détection du terminal est la base du filtrage intelligent :
- **Détection du focus** : Éviter les notifications popup lorsque vous regardez déjà le terminal
- **Clic pour focus** : Les utilisateurs macOS peuvent cliquer sur la notification pour revenir directement au terminal
- **Optimisation des performances** : Différents terminaux peuvent nécessiter un traitement spécial

Si la détection échoue, les notifications fonctionnent toujours, mais le filtrage intelligent sera désactivé.
:::

## Liste des terminaux supportés

### Terminaux macOS

| Nom du terminal | Nom du processus | Fonctionnalités |
| --- | --- | --- |
| **Ghostty** | Ghostty | ✅ Détection du focus + ✅ Clic pour focus |
| **iTerm2** | iTerm2 | ✅ Détection du focus + ✅ Clic pour focus |
| **Kitty** | kitty | ✅ Détection du focus + ✅ Clic pour focus |
| **WezTerm** | WezTerm | ✅ Détection du focus + ✅ Clic pour focus |
| **Alacritty** | Alacritty | ✅ Détection du focus + ✅ Clic pour focus |
| **Terminal.app** | Terminal | ✅ Détection du focus + ✅ Clic pour focus |
| **Hyper** | Hyper | ✅ Détection du focus + ✅ Clic pour focus |
| **Warp** | Warp | ✅ Détection du focus + ✅ Clic pour focus |
| **Terminal intégré VS Code** | Code / Code - Insiders | ✅ Détection du focus + ✅ Clic pour focus |

::: tip Fonctionnalités des terminaux macOS
Les terminaux macOS supportent toutes les fonctionnalités :
- Notifications natives (Notification Center)
- Détection du focus (via AppleScript)
- Focus automatique du terminal en cliquant sur la notification
- Effets sonores système personnalisés

Tous les terminaux utilisent le Notification Center de macOS pour envoyer des notifications.
:::

### Terminaux Windows

| Nom du terminal | Fonctionnalités |
| --- | --- |
| **Windows Terminal** | ✅ Notifications natives (Toast) |
| **Git Bash** | ✅ Notifications natives (Toast) |
| **ConEmu** | ✅ Notifications natives (Toast) |
| **Cmder** | ✅ Notifications natives (Toast) |
| **PowerShell** | ✅ Notifications natives (Toast) |
| **Terminal intégré VS Code** | ✅ Notifications natives (Toast) |
| **Autres terminaux Windows** | ✅ Notifications natives (Toast) |

::: details Limitations des terminaux Windows
Les fonctionnalités de la plateforme Windows sont relativement basiques :
- ✅ Notifications natives (Windows Toast)
- ✅ Détection du terminal
- ❌ Détection du focus (limitation système)
- ❌ Clic pour focus (limitation système)

Tous les terminaux Windows envoient des notifications via Windows Toast, utilisant le son système par défaut.
:::

### Terminaux Linux

| Nom du terminal | Fonctionnalités |
| --- | --- |
| **konsole** | ✅ Notifications natives (notify-send) |
| **xterm** | ✅ Notifications natives (notify-send) |
| **lxterminal** | ✅ Notifications natives (notify-send) |
| **alacritty** | ✅ Notifications natives (notify-send) |
| **kitty** | ✅ Notifications natives (notify-send) |
| **wezterm** | ✅ Notifications natives (notify-send) |
| **Terminal intégré VS Code** | ✅ Notifications natives (notify-send) |
| **Autres terminaux Linux** | ✅ Notifications natives (notify-send) |

::: details Limitations des terminaux Linux
Les fonctionnalités de la plateforme Linux sont relativement basiques :
- ✅ Notifications natives (notify-send)
- ✅ Détection du terminal
- ❌ Détection du focus (limitation système)
- ❌ Clic pour focus (limitation système)

Tous les terminaux Linux envoient des notifications via notify-send, utilisant le son par défaut de l'environnement de bureau.
:::

### Autres terminaux supportés

La bibliothèque `detect-terminal` supporte également les terminaux suivants (liste non exhaustive) :

**Windows / WSL** :
- Terminal WSL
- Windows Command Prompt (cmd)
- PowerShell (pwsh)
- PowerShell Core (pwsh-preview)
- Cygwin Mintty
- MSYS2 MinTTY

**macOS / Linux** :
- tmux (détection via variables d'environnement)
- screen
- rxvt-unicode (urxvt)
- rxvt
- Eterm
- eterm
- aterm
- wterm
- sakura
- roxterm
- xfce4-terminal
- pantheon-terminal
- lxterminal
- mate-terminal
- terminator
- tilix
- guake
- yakuake
- qterminal
- terminology
- deepin-terminal
- gnome-terminal
- konsole
- xterm
- uxterm
- eterm

::: tip Statistiques du nombre de terminaux
opencode-notify supporte **37+ émulateurs de terminaux** via la bibliothèque `detect-terminal`.
Si votre terminal n'est pas dans la liste, consultez la [liste complète de detect-terminal](https://github.com/jonschlinkert/detect-terminal#supported-terminals).
:::

## Principe de détection des terminaux

### Flux de détection automatique

Le plugin détecte automatiquement le type de terminal au démarrage :

```
1. Appel de la bibliothèque detect-terminal()
    ↓
2. Scan des processus système, identification du terminal actuel
    ↓
3. Retour du nom du terminal (ex: "ghostty", "kitty")
    ↓
4. Recherche dans la table de correspondance, obtention du nom du processus macOS
    ↓
5. macOS: Obtention dynamique du Bundle ID
    ↓
6. Sauvegarde des informations du terminal pour les notifications ultérieures
```

### Table de correspondance des terminaux macOS

Le code source prédéfinit une correspondance des noms de processus pour les terminaux courants :

```typescript
// src/notify.ts:71-84
const TERMINAL_PROCESS_NAMES: Record<string, string> = {
    ghostty: "Ghostty",
    kitty: "kitty",
    iterm: "iTerm2",
    iterm2: "iTerm2",
    wezterm: "WezTerm",
    alacritty: "Alacritty",
    terminal: "Terminal",
    apple_terminal: "Terminal",
    hyper: "Hyper",
    warp: "Warp",
    vscode: "Code",
    "vscode-insiders": "Code - Insiders",
}
```

::: details Code source de détection
Logique complète de détection du terminal :

```typescript
// src/notify.ts:145-164
async function detectTerminalInfo(config: NotifyConfig): Promise<TerminalInfo> {
    // Use config override if provided
    const terminalName = config.terminal || detectTerminal() || null
    
    if (!terminalName) {
        return { name: null, bundleId: null, processName: null }
    }
    
    // Get process name for focus detection
    const processName = TERMINAL_PROCESS_NAMES[terminalName.toLowerCase()] || terminalName
    
    // Dynamically get bundle ID from macOS (no hardcoding!)
    const bundleId = await getBundleId(processName)
    
    return {
        name: terminalName,
        bundleId,
        processName,
    }
}
```

:::

### Traitement spécial macOS

La plateforme macOS a des étapes de détection supplémentaires :

1. **Obtention du Bundle ID** : Requête dynamique du Bundle ID de l'application via `osascript` (ex: `com.mitchellh.ghostty`)
2. **Détection du focus** : Requête du nom du processus de l'application au premier plan via `osascript`
3. **Clic pour focus** : Paramètre `activate` de la notification, bascule vers le terminal via le Bundle ID lors du clic

::: info Avantages du Bundle ID dynamique
Le code source ne code pas en dur les Bundle ID, mais les interroge dynamiquement via `osascript`. Cela signifie :
- ✅ Support des mises à jour de terminal (tant que le Bundle ID ne change pas)
- ✅ Réduction des coûts de maintenance (pas besoin de mettre à jour manuellement la liste)
- ✅ Meilleure compatibilité (tout terminal macOS est théoriquement supporté)
:::

### Support du terminal tmux

tmux est un multiplexeur de terminal, le plugin détecte les sessions tmux via des variables d'environnement :

```bash
# Dans une session tmux
echo $TMUX
# Sortie: /tmp/tmux-1000/default,1234,0

# Pas dans tmux
echo $TMUX
# Sortie: (vide)
```

::: tip Support du workflow tmux
Les utilisateurs de tmux peuvent utiliser normalement les notifications :
- Détection automatique de la session tmux
- Notifications envoyées à la fenêtre de terminal actuelle
- **Pas de détection du focus** (support du workflow multi-fenêtres tmux)
:::

## Spécification manuelle du terminal

Si la détection automatique échoue, vous pouvez spécifier manuellement le type de terminal dans le fichier de configuration.

### Quand spécifier manuellement

Une configuration manuelle est nécessaire dans les situations suivantes :
- Votre terminal n'est pas dans la liste supportée par `detect-terminal`
- Vous utilisez un terminal imbriqué dans un autre (ex: tmux + Alacritty)
- Le résultat de la détection automatique est incorrect (identifié comme un autre terminal)

### Méthode de configuration

**Étape 1 : Ouvrir le fichier de configuration**

::: code-group

```bash [macOS/Linux]
nano ~/.config/opencode/kdco-notify.json
```

```powershell [Windows]
notepad $env:USERPROFILE\.config\opencode\kdco-notify.json
```

:::

**Étape 2 : Ajouter la configuration terminal**

```json
{
  "terminal": "ghostty"
}
```

**Étape 3 : Sauvegarder et redémarrer OpenCode**

### Noms de terminaux disponibles

Le nom du terminal doit être un nom reconnu par la bibliothèque `detect-terminal`. Noms courants :

| Terminal | Valeur de configuration |
| --- | --- |
| Ghostty | `"ghostty"` |
| iTerm2 | `"iterm2"` ou `"iterm"` |
| Kitty | `"kitty"` |
| WezTerm | `"wezterm"` |
| Alacritty | `"alacritty"` |
| macOS Terminal | `"terminal"` ou `"apple_terminal"` |
| Hyper | `"hyper"` |
| Warp | `"warp"` |
| VS Code | `"vscode"` |
| VS Code Insiders | `"vscode-insiders"` |
| Windows Terminal | `"windows-terminal"` ou `"Windows Terminal"` |

::: details Noms complets disponibles
Consultez le [code source de detect-terminal](https://github.com/jonschlinkert/detect-terminal) pour la liste complète.
:::

### Exemple de fonctionnalités complètes pour terminal macOS

```json
{
  "terminal": "ghostty",
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  }
}
```

### Exemple pour terminaux Windows/Linux

```json
{
  "terminal": "Windows Terminal",
  "notifyChildSessions": false,
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

::: warning Limitations de configuration Windows/Linux
Windows et Linux ne supportent pas l'option de configuration `sounds` (utilisation du son système par défaut), ni la détection du focus (limitation système).
:::

## Point de contrôle ✅

Après avoir terminé la lecture, vérifiez :

- [ ] Savoir si votre terminal est supporté
- [ ] Comprendre le principe de la détection automatique des terminaux
- [ ] Savoir comment spécifier manuellement le type de terminal
- [ ] Comprendre les différences fonctionnelles entre plateformes

## Pièges à éviter

### Problème courant 1 : Échec de la détection du terminal

**Symptôme** : Les notifications ne s'affichent pas, ou la détection du focus échoue.

**Cause** : `detect-terminal` ne peut pas identifier votre terminal.

**Solution** :

1. Vérifiez que le nom de votre terminal est correct (sensible à la casse)
2. Spécifiez manuellement dans le fichier de configuration :

```json
{
  "terminal": "nom_de_votre_terminal"
}
```

3. Consultez la [liste des terminaux supportés par detect-terminal](https://github.com/jonschlinkert/detect-terminal#supported-terminals)

### Problème courant 2 : Échec du clic pour focus sur macOS

**Symptôme** : Cliquer sur la notification ne bascule pas vers la fenêtre du terminal.

**Cause** : Échec de l'obtention du Bundle ID, ou le terminal n'est pas dans la table de correspondance.

**Solution** :

1. Vérifiez si le terminal est dans la table de correspondance `TERMINAL_PROCESS_NAMES`
2. Si absent, vous pouvez spécifier manuellement le nom du terminal

**Méthode de vérification** :

```typescript
// Débogage temporaire (ajouter console.log dans notify.ts)
console.log("Terminal info:", terminalInfo)
// Devrait afficher { name: "ghostty", bundleId: "com.mitchellh.ghostty", processName: "Ghostty" }
```

### Problème courant 3 : La détection du focus ne fonctionne pas dans tmux

**Symptôme** : Dans une session tmux, les notifications apparaissent toujours même lorsque le terminal est au premier plan.

**Cause** : tmux a sa propre gestion de session, la détection du focus peut être imprécise.

**Explication** : C'est un comportement normal. Dans le workflow tmux, la détection du focus est limitée, mais vous pouvez toujours recevoir des notifications normalement.

### Problème courant 4 : Le terminal intégré VS Code est identifié comme Code

**Symptôme** : Dans la configuration, `"vscode"` et `"vscode-insiders"` fonctionnent tous les deux, mais vous ne savez pas lequel utiliser.

**Explication** :
- Utilisation de **VS Code Stable** → Configurer `"vscode"`
- Utilisation de **VS Code Insiders** → Configurer `"vscode-insiders"`

La détection automatique sélectionnera automatiquement le nom de processus correct selon la version installée.

### Problème courant 5 : Échec de l'identification de Windows Terminal

**Symptôme** : Windows Terminal utilise le nom "windows-terminal", mais n'est pas détecté.

**Cause** : Le nom du processus de Windows Terminal peut être `WindowsTerminal.exe` ou `Windows Terminal`.

**Solution** : Essayez différentes valeurs de configuration :

```json
{
  "terminal": "windows-terminal"  // ou "Windows Terminal"
}
```

## Résumé de la leçon

Dans cette leçon, nous avons découvert :

- ✅ opencode-notify supporte 37+ émulateurs de terminaux
- ✅ Les terminaux macOS supportent toutes les fonctionnalités (détection du focus + clic pour focus)
- ✅ Les terminaux Windows/Linux supportent les notifications de base
- ✅ Le principe de la détection automatique des terminaux et l'implémentation du code source
- ✅ Comment spécifier manuellement le type de terminal
- ✅ Méthodes de résolution des problèmes courants d'identification des terminaux

**Points clés** :
1. La détection du terminal est la base du filtrage intelligent, supportant 37+ terminaux
2. Les terminaux macOS offrent les fonctionnalités les plus riches, Windows/Linux offrent des fonctionnalités relativement basiques
3. En cas d'échec de la détection automatique, vous pouvez configurer manuellement le nom du terminal
4. Les utilisateurs de tmux peuvent utiliser normalement les notifications, mais la détection du focus est limitée
5. Le Bundle ID de macOS est obtenu dynamiquement, offrant une meilleure compatibilité

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous étudierons **[Référence de configuration](../../advanced/config-reference/)**.
>
> Vous apprendrez :
> - Description complète des options de configuration et valeurs par défaut
> - Personnalisation des effets sonores (macOS)
> - Configuration des heures silencieuses
> - Interrupteur de notification des sessions enfants
> - Remplacement du type de terminal
> - Techniques de configuration avancées

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-27

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Table de correspondance des terminaux | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84 |
| Fonction de détection du terminal | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| Obtention du Bundle ID macOS | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L135-L137) | 135-137 |
| Détection de l'application au premier plan macOS | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L139-L143) | 139-143 |
| Détection du focus macOS | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |

**Constantes clés** :
- `TERMINAL_PROCESS_NAMES` : Table de correspondance des noms de terminaux vers les noms de processus macOS

**Fonctions clés** :
- `detectTerminalInfo()` : Détecte les informations du terminal (nom, Bundle ID, nom du processus)
- `detectTerminal()` : Appelle la bibliothèque detect-terminal pour identifier le terminal
- `getBundleId()` : Obtient dynamiquement le Bundle ID de l'application macOS via osascript
- `getFrontmostApp()` : Interroge le nom de l'application actuellement au premier plan
- `isTerminalFocused()` : Détecte si le terminal est la fenêtre active (macOS uniquement)

**Dépendances externes** :
- [detect-terminal](https://github.com/jonschlinkert/detect-terminal) : Bibliothèque de détection de terminal, supportant 37+ terminaux

</details>

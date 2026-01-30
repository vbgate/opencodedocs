---
title: "Récupération de Session : Réparation Automatique des Interruptions d'Outils | Antigravity"
sidebarTitle: "Réparation automatique des interruptions d'outils"
subtitle: "Récupération de session : gestion automatique des échecs et interruptions d'appels d'outils"
description: "Apprenez le mécanisme de récupération de session pour gérer automatiquement les interruptions et erreurs d'outils. Couvre la détection d'erreurs, l'injection de tool_result synthétique et la configuration auto_resume."
tags:
  - "advanced"
  - "session-recovery"
  - "error-handling"
  - "auto-recovery"
prerequisite:
  - "start-quick-install"
  - "start-first-request"
order: 8
---

# Récupération de Session : Gestion Automatique des Échecs et Interruptions d'Appels d'Outils

## Ce que vous apprendrez

- Comprendre comment le mécanisme de récupération de session gère automatiquement les interruptions d'exécution d'outils
- Configurer les options session_recovery et auto_resume
- Diagnostiquer les erreurs tool_result_missing et thinking_block_order
- Comprendre le fonctionnement des tool_result synthétiques

## Votre situation actuelle

Lors de l'utilisation d'OpenCode, vous pouvez rencontrer ces scénarios d'interruption :

- Interruption d'un outil en cours d'exécution avec ESC, bloquant la session et nécessitant un retry manuel
- Erreur d'ordre des blocs de réflexion (thinking_block_order), empêchant l'IA de continuer
- Utilisation incorrecte de la fonctionnalité de réflexion dans un modèle non-thinking (thinking_disabled_violation)
- Nécessité de réparer manuellement l'état de session corrompu, perdant du temps

## Quand utiliser cette technique

La récupération de session convient aux scénarios suivants :

| Scénario | Type d'erreur | Méthode de récupération |
| --- | --- | --- |
| Interruption d'outil avec ESC | `tool_result_missing` | Injection automatique de tool_result synthétique |
| Erreur d'ordre des blocs de réflexion | `thinking_block_order` | Préposition automatique d'un bloc de réflexion vide |
| Utilisation de réflexion dans modèle non-thinking | `thinking_disabled_violation` | Suppression automatique de tous les blocs de réflexion |
| Toutes les erreurs ci-dessus | Générique | Réparation automatique + continue automatique (si activé) |

::: warning Vérifications préalables
Avant de commencer ce tutoriel, assurez-vous d'avoir :
- ✅ Installé le plugin opencode-antigravity-auth
- ✅ Possibilité d'envoyer des requêtes avec les modèles Antigravity
- ✅ Compris les concepts de base des appels d'outils

[Tutoriel d'installation rapide](../../start/quick-install/) | [Tutoriel de première requête](../../start/first-request/)
:::

## Concept clé

Le mécanisme central de récupération de session :

1. **Détection d'erreurs** : Identification automatique de trois types d'erreurs récupérables
   - `tool_result_missing` : Résultat manquant lors de l'exécution d'un outil
   - `thinking_block_order` : Ordre incorrect des blocs de réflexion
   - `thinking_disabled_violation` : Réflexion interdite dans un modèle non-thinking

2. **Réparation automatique** : Injection de messages synthétiques selon le type d'erreur
   - Injection de tool_result synthétique (contenu : "Operation cancelled by user (ESC pressed)")
   - Préposition d'un bloc de réflexion vide (le bloc thinking doit être au début du message)
   - Suppression de tous les blocs de réflexion (modèles non-thinking n'autorisent pas la réflexion)

3. **Continuation automatique** : Si `auto_resume` est activé, envoi automatique d'un message continue pour reprendre la conversation

4. **Déduplication** : Utilisation d'un `Set` pour éviter le traitement répété de la même erreur

::: info Qu'est-ce qu'un message synthétique ?
Un message synthétique est un message "virtuel" injecté par le plugin pour réparer l'état de session corrompu. Par exemple, lorsqu'un outil est interrompu, le plugin injecte un tool_result synthétique indiquant à l'IA "cet outil a été annulé", permettant à l'IA de continuer à générer une nouvelle réponse.
:::

## Suivez le guide

### Étape 1 : Activer la récupération de session (activée par défaut)

**Pourquoi**
La récupération de session est activée par défaut, mais si vous l'avez désactivée manuellement auparavant, vous devez la réactiver.

**Action**

Modifier le fichier de configuration du plugin :

```bash
# macOS/Linux
nano ~/.config/opencode/antigravity.json

# Windows
notepad %APPDATA%\opencode\antigravity.json
```

Confirmer la configuration suivante :

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "session_recovery": true,
  "auto_resume": false,
  "quiet_mode": false
}
```

**Vous devriez voir** :

1. `session_recovery` à `true` (valeur par défaut)
2. `auto_resume` à `false` (recommandé pour un contrôle manuel, évite les actions involontaires)
3. `quiet_mode` à `false` (affiche les notifications toast pour comprendre l'état de récupération)

::: tip Explication des options de configuration
- `session_recovery` : Active/désactive la fonctionnalité de récupération de session
- `auto_resume` : Envoie automatiquement un message "continue" (à utiliser avec précaution, peut entraîner une exécution involontaire de l'IA)
- `quiet_mode` : Masque les notifications toast (peut être désactivé lors du débogage)
:::

### Étape 2 : Tester la récupération tool_result_missing

**Pourquoi**
Vérifier que le mécanisme de récupération de session fonctionne correctement lorsque l'exécution d'un outil est interrompue.

**Action**

1. Ouvrir OpenCode, sélectionner un modèle supportant les appels d'outils (par exemple `google/antigravity-claude-sonnet-4-5`)
2. Saisir une tâche nécessitant un appel d'outil (par exemple : "Aide-moi à voir les fichiers du répertoire courant")
3. Appuyer sur `ESC` pendant l'exécution de l'outil pour l'interrompre

**Vous devriez voir** :

1. OpenCode arrête immédiatement l'exécution de l'outil
2. Une notification toast apparaît : "Tool Crash Recovery - Injecting cancelled tool results..."
3. L'IA continue automatiquement à générer sans attendre le résultat de l'outil

::: info Principe de l'erreur tool_result_missing
Lorsque vous appuyez sur ESC, OpenCode interrompt l'exécution de l'outil, créant une incohérence dans la session avec un `tool_use` mais sans `tool_result` correspondant. L'API Antigravity détecte cette incohérence et retourne une erreur `tool_result_missing`. Le plugin capture cette erreur, injecte un tool_result synthétique, restaurant ainsi la cohérence de la session.
:::

### Étape 3 : Tester la récupération thinking_block_order

**Pourquoi**
Vérifier que le mécanisme de récupération de session peut réparer automatiquement les erreurs d'ordre des blocs de réflexion.

**Action**

1. Ouvrir OpenCode, sélectionner un modèle supportant la réflexion (par exemple `google/antigravity-claude-opus-4-5-thinking`)
2. Saisir une tâche nécessitant une réflexion approfondie
3. Si vous rencontrez une erreur "Expected thinking but found text" ou "First block must be thinking"

**Vous devriez voir** :

1. Une notification toast apparaît : "Thinking Block Recovery - Fixing message structure..."
2. La session est automatiquement réparée, l'IA peut continuer à générer

::: tip Causes de l'erreur thinking_block_order
Cette erreur est généralement causée par :
- Suppression accidentelle des blocs de réflexion (par exemple via d'autres outils)
- État de session corrompu (par exemple échec d'écriture sur disque)
- Incompatibilité de format lors de la migration entre modèles
:::

### Étape 4 : Tester la récupération thinking_disabled_violation

**Pourquoi**
Vérifier que la récupération de session peut automatiquement supprimer les blocs de réflexion lors d'une utilisation incorrecte de la fonctionnalité de réflexion dans un modèle non-thinking.

**Action**

1. Ouvrir OpenCode, sélectionner un modèle ne supportant pas la réflexion (par exemple `google/antigravity-claude-sonnet-4-5`)
2. Si l'historique des messages contient des blocs de réflexion

**Vous devriez voir** :

1. Une notification toast apparaît : "Thinking Strip Recovery - Stripping thinking blocks..."
2. Tous les blocs de réflexion sont automatiquement supprimés
3. L'IA peut continuer à générer

::: warning Perte des blocs de réflexion
La suppression des blocs de réflexion entraîne la perte du contenu de réflexion de l'IA, ce qui peut affecter la qualité des réponses. Assurez-vous d'utiliser la fonctionnalité de réflexion dans un modèle thinking.
:::

### Étape 5 : Configurer auto_resume (optionnel)

**Pourquoi**
Avec auto_resume activé, après la récupération de session, un "continue" est automatiquement envoyé sans intervention manuelle.

**Action**

Dans `antigravity.json`, définir :

```json
{
  "auto_resume": true
}
```

Enregistrer le fichier et redémarrer OpenCode.

**Vous devriez voir** :

1. Après la récupération de session, l'IA continue automatiquement à générer
2. Pas besoin de saisir manuellement "continue"

::: danger Risques d'auto_resume
La continuation automatique peut entraîner une exécution involontaire d'appels d'outils par l'IA. Si vous avez des préoccupations concernant la sécurité des appels d'outils, il est recommandé de conserver `auto_resume: false` pour contrôler manuellement le moment de la récupération.
:::

## Point de contrôle ✅

Après avoir terminé les étapes ci-dessus, vous devriez pouvoir :

- [ ] Voir la configuration session_recovery dans `antigravity.json`
- [ ] Voir la notification "Tool Crash Recovery" lors de l'interruption d'un outil avec ESC
- [ ] La session se récupère automatiquement sans retry manuel
- [ ] Comprendre le fonctionnement des tool_result synthétiques
- [ ] Savoir quand activer/désactiver auto_resume

## Pièges à éviter

### La récupération de session ne se déclenche pas

**Symptôme** : Erreur rencontrée mais pas de récupération automatique

**Cause** : `session_recovery` est désactivé ou le type d'erreur ne correspond pas

**Solution** :

1. Confirmer `session_recovery: true` :

```bash
grep session_recovery ~/.config/opencode/antigravity.json
```

2. Vérifier si le type d'erreur est récupérable :

```bash
# Activer les logs de débogage pour voir les informations d'erreur détaillées
export DEBUG=session-recovery:*
opencode run "test" --model=google/antigravity-claude-sonnet-4-5
```

3. Vérifier s'il y a des logs d'erreur dans la console :

```bash
# Emplacement des logs
~/.config/opencode/antigravity-logs/session-recovery.log
```

### Le tool_result synthétique n'est pas injecté

**Symptôme** : Après l'interruption de l'outil, l'IA attend toujours le résultat de l'outil

**Cause** : Configuration incorrecte du chemin de stockage d'OpenCode

**Solution** :

1. Confirmer que le chemin de stockage d'OpenCode est correct :

```bash
# Voir la configuration d'OpenCode
cat ~/.config/opencode/opencode.json | grep storage
```

2. Vérifier que les répertoires de stockage des messages et parties existent :

```bash
ls -la ~/.local/share/opencode/storage/message/
ls -la ~/.local/share/opencode/storage/part/
```

3. Si les répertoires n'existent pas, vérifier la configuration d'OpenCode

### Auto Resume se déclenche de manière inattendue

**Symptôme** : L'IA continue automatiquement à un moment inapproprié

**Cause** : `auto_resume` est défini à `true`

**Solution** :

1. Désactiver auto_resume :

```json
{
  "auto_resume": false
}
```

2. Contrôler manuellement le moment de la récupération

### Notifications toast trop fréquentes

**Symptôme** : Notifications de récupération fréquentes, affectant l'expérience utilisateur

**Cause** : `quiet_mode` n'est pas activé

**Solution** :

1. Activer quiet_mode :

```json
{
  "quiet_mode": true
}
```

2. Si vous avez besoin de déboguer, vous pouvez le désactiver temporairement

## Résumé de la leçon

- Le mécanisme de récupération de session gère automatiquement trois types d'erreurs récupérables : tool_result_missing, thinking_block_order, thinking_disabled_violation
- Le tool_result synthétique est la clé pour réparer l'état de session, le contenu injecté est "Operation cancelled by user (ESC pressed)"
- session_recovery est activé par défaut, auto_resume est désactivé par défaut (contrôle manuel recommandé)
- La récupération des blocs de réflexion (thinking_block_order) prépose un bloc de réflexion vide, permettant à l'IA de régénérer le contenu de réflexion
- La suppression des blocs de réflexion (thinking_disabled_violation) entraîne la perte du contenu de réflexion, assurez-vous d'utiliser la fonctionnalité de réflexion dans un modèle thinking

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons le **[Mécanisme de Transformation des Requêtes](../request-transformation/)**.
>
> Vous apprendrez :
> - Les différences de format de requête entre Claude et Gemini
> - Les règles de nettoyage et de transformation du Tool Schema
> - Le mécanisme d'injection de signature des blocs de réflexion
> - La méthode de configuration de Google Search Grounding

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Logique principale de récupération de session | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts) | Fichier complet |
| Détection du type d'erreur | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L85-L110) | 85-110 |
| Récupération tool_result_missing | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L143-L183) | 143-183 |
| Récupération thinking_block_order | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L188-L217) | 188-217 |
| Récupération thinking_disabled_violation | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L222-L240) | 222-240 |
| Fonctions utilitaires de stockage | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts) | Fichier complet |
| Lecture des messages | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L53-L78) | 53-78 |
| Lecture des parties (part) | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L84-L104) | 84-104 |
| Préposition de bloc de réflexion | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L233-L256) | 233-256 |
| Suppression de blocs de réflexion | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L258-L283) | 258-283 |
| Définitions de types | [`src/plugin/recovery/types.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/types.ts) | Fichier complet |

**Constantes clés** :

| Nom de constante | Valeur | Description |
| --- | --- | --- |
| `RECOVERY_RESUME_TEXT` | `"[session recovered - continuing previous task]"` | Texte de récupération envoyé lors d'Auto Resume |
| `THINKING_TYPES` | `Set(["thinking", "redacted_thinking", "reasoning"])` | Ensemble des types de blocs de réflexion |
| `META_TYPES` | `Set(["step-start", "step-finish"])` | Ensemble des types de métadonnées |
| `CONTENT_TYPES` | `Set(["text", "tool", "tool_use", "tool_result"])` | Ensemble des types de contenu |

**Fonctions clés** :

- `detectErrorType(error: unknown): RecoveryErrorType` : Détecte le type d'erreur, retourne `"tool_result_missing"`, `"thinking_block_order"`, `"thinking_disabled_violation"` ou `null`
- `isRecoverableError(error: unknown): boolean` : Détermine si l'erreur est récupérable
- `createSessionRecoveryHook(ctx, config): SessionRecoveryHook | null` : Crée un hook de récupération de session
- `recoverToolResultMissing(client, sessionID, failedMsg): Promise<boolean>` : Récupère l'erreur tool_result_missing
- `recoverThinkingBlockOrder(sessionID, failedMsg, error): Promise<boolean>` : Récupère l'erreur thinking_block_order
- `recoverThinkingDisabledViolation(sessionID, failedMsg): Promise<boolean>` : Récupère l'erreur thinking_disabled_violation
- `readMessages(sessionID): StoredMessageMeta[]` : Lit tous les messages de la session
- `readParts(messageID): StoredPart[]` : Lit toutes les parties (parts) du message
- `prependThinkingPart(sessionID, messageID): boolean` : Prépose un bloc de réflexion vide au début du message
- `stripThinkingParts(messageID): boolean` : Supprime tous les blocs de réflexion du message

**Options de configuration** (depuis schema.ts) :

| Option de configuration | Type | Valeur par défaut | Description |
| --- | --- | --- | --- |
| `session_recovery` | boolean | `true` | Active la fonctionnalité de récupération de session |
| `auto_resume` | boolean | `false` | Envoie automatiquement un message "continue" |
| `quiet_mode` | boolean | `false` | Masque les notifications toast |

</details>

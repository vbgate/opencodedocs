---
title: "Guide complet des outils d'exécution de commandes et d'approbations : mécanismes de sécurité, configuration et dépannage | Tutoriel Clawdbot"
sidebarTitle: "Exécuter des commandes en toute sécurité avec l'IA"
subtitle: "Outils d'exécution de commandes et approbations"
description: "Apprenez à configurer et utiliser l'outil exec de Clawdbot pour exécuter des commandes Shell, comprendre les trois modes d'exécution (sandbox/gateway/node), les mécanismes de sécurité des approbations, la configuration de la liste d'autorisation et le flux d'approbation. Ce tutoriel inclut des exemples de configuration pratiques, des commandes CLI et le dépannage pour vous aider à étendre en toute sécurité les capacités de votre assistant IA."
tags:
  - "advanced"
  - "tools"
  - "exec"
  - "security"
  - "approvals"
prerequisite:
  - "start-gateway-startup"
order: 220
---

# Outils d'exécution de commandes et approbations

## Ce que vous pourrez faire après

- Configurer l'outil exec pour s'exécuter en trois modes (sandbox/gateway/node)
- Comprendre et configurer les mécanismes de sécurité des approbations (deny/allowlist/full)
- Gérer la liste d'autorisation (Allowlist) et les bins sûrs
- Approuver les demandes exec via l'interface ou les canaux de chat
- Dépanner les problèmes courants et les erreurs de sécurité de l'outil exec

## Votre dilemme actuel

L'outil exec permet aux assistants IA d'exécuter des commandes Shell, ce qui est puissant mais aussi dangereux :

- L'IA va-t-elle supprimer des fichiers importants de mon système ?
- Comment limiter l'IA à n'exécuter que des commandes sécurisées ?
- Quelles sont les différences entre les différents modes d'exécution ?
- Comment fonctionne le flux d'approbation ?
- Comment la liste d'autorisation doit-elle être configurée ?

## Quand utiliser cette approche

- Lorsque vous avez besoin que l'IA effectue des opérations système (gestion de fichiers, compilation de code)
- Lorsque vous souhaitez que l'IA appelle des scripts personnalisés ou des outils
- Lorsque vous avez besoin d'un contrôle précis des autorisations d'exécution de l'IA
- Lorsque vous devez autoriser de manière sécurisée des commandes spécifiques

## 🎒 Préparation avant de commencer

::: warning Conditions préalables
Ce tutoriel suppose que vous avez terminé [Démarrer Gateway](../../start/gateway-startup/) et que le démon Gateway est en cours d'exécution.
:::

- Assurez-vous que Node ≥22 est installé
- Le démon Gateway est en cours d'exécution
- Connaissances de base des commandes Shell et du système de fichiers Linux/Unix

## Concepts clés

### Les trois couches de sécurité de l'outil exec

L'outil exec utilise un mécanisme de sécurité à trois couches pour contrôler les autorisations d'exécution de l'IA, du niveau grossier au fin :

1. **Politique d'outils (Tool Policy)** : contrôle si l'outil `exec` est autorisé dans `tools.policy`
2. **Hôte d'exécution (Host)** : les commandes s'exécutent dans trois environnements sandbox/gateway/node
3. **Mécanisme d'approbations (Approvals)** : dans les modes gateway/node, des restrictions supplémentaires peuvent être appliquées via la liste d'autorisation et les invites d'approbation

::: info Pourquoi une protection multicouche ?
Une protection à une seule couche est facile à contourner ou à configurer incorrectement. Une protection multicouche garantise que si une couche échoue, les autres couches peuvent fournir une protection.
:::

### Comparaison des trois modes d'exécution

| Mode d'exécution | Lieu d'exécution | Niveau de sécurité | Scénarios typiques | Approbation requise |
|--- | --- | --- | --- | ---|
| **sandbox** | Dans des conteneurs (ex. Docker) | Élevé | Environnement isolé, tests | Non |
| **gateway** | La machine où le démon Gateway s'exécute | Moyen | Développement local, intégration | Oui (allowlist + approbation) |
| **node** | Nœud d'appareil apparié (macOS/iOS/Android) | Moyen | Opérations locales d'appareil | Oui (allowlist + approbation) |

**Différences clés** :
- Le mode sandbox par défaut **ne nécessite pas d'approbation** (mais peut être limité par Sandbox)
- Les modes gateway et node par défaut **nécessitent une approbation** (sauf si configuré comme `full`)

## Suivez le guide

### Étape 1 : Comprendre les paramètres de l'outil exec

**Pourquoi**
Comprendre les paramètres de l'outil exec est la base de la configuration de sécurité.

L'outil exec prend en charge les paramètres suivants :

```json
{
  "tool": "exec",
  "command": "ls -la",
  "workdir": "/path/to/dir",
  "env": { "NODE_ENV": "production" },
  "yieldMs": 10000,
  "background": false,
  "timeout": 1800,
  "pty": false,
  "host": "sandbox",
  "security": "allowlist",
  "ask": "on-miss",
  "node": "mac-1"
}
```

**Description des paramètres** :

| Paramètre | Type | Valeur par défaut | Description |
|--- | --- | --- | ---|
| `command` | string | Requis | Commande Shell à exécuter |
| `workdir` | string | Répertoire de travail actuel | Répertoire d'exécution |
| `env` | object | Hériter de l'environnement | Remplacement des variables d'environnement |
| `yieldMs` | number | 10000 | Passer automatiquement en arrière-plan après le délai (millisecondes) |
| `background` | boolean | false | Exécuter immédiatement en arrière-plan |
| `timeout` | number | 1800 | Délai d'exécution (secondes) |
| `pty` | boolean | false | Exécuter dans un pseudo-terminal (support TTY) |
| `host` | string | sandbox | Hôte d'exécution : `sandbox` \| `gateway` \| `node` |
| `security` | string | deny/allowlist | Politique de sécurité : `deny` \| `allowlist` \| `full` |
| `ask` | string | on-miss | Politique d'approbation : `off` \| `on-miss` \| `always` |
| `node` | string | - | ID ou nom du nœud cible en mode node |

**Ce que vous devriez voir** : La liste des paramètres explique clairement les méthodes de contrôle pour chaque mode d'exécution.

### Étape 2 : Configurer le mode d'exécution par défaut

**Pourquoi**
Définir des valeurs par défaut globales via des fichiers de configuration évite de spécifier des paramètres à chaque appel exec.

Éditez `~/.clawdbot/clawdbot.json` :

```json
{
  "tools": {
    "exec": {
      "host": "sandbox",
      "security": "allowlist",
      "ask": "on-miss",
      "node": "mac-1",
      "notifyOnExit": true,
      "approvalRunningNoticeMs": 10000,
      "pathPrepend": ["~/bin", "/opt/homebrew/bin"],
      "safeBins": ["jq", "grep", "cut"]
    }
  }
}
```

**Description des éléments de configuration** :

| Élément de configuration | Type | Valeur par défaut | Description |
|--- | --- | --- | ---|
| `host` | string | sandbox | Hôte d'exécution par défaut |
| `security` | string | deny (sandbox) / allowlist (gateway, node) | Politique de sécurité par défaut |
| `ask` | string | on-miss | Politique d'approbation par défaut |
| `node` | string | - | Nœud par défaut en mode node |
| `notifyOnExit` | boolean | true | Envoyer un événement système lorsque les tâches d'arrière-plan se terminent |
| `approvalRunningNoticeMs` | number | 10000 | Envoyer une notification "en cours d'exécution" après le délai (0 pour désactiver) |
| `pathPrepend` | string[] | - | Liste des répertoires à ajouter au PATH |
| `safeBins` | string[] | [Liste par défaut] | Liste des bins sûrs (opérations stdin uniquement) |

**Ce que vous devriez voir** : Après avoir enregistré la configuration, l'outil exec utilise ces valeurs par défaut.

### Étape 3 : Utiliser la substitution de session `/exec`

**Pourquoi**
La substitution de session vous permet d'ajuster temporairement les paramètres d'exécution sans modifier le fichier de configuration.

Envoyez dans le chat :

```
/exec host=gateway security=allowlist ask=on-miss node=mac-1
```

Voir les valeurs de substitution actuelles :

```
/exec
```

**Ce que vous devriez voir** : Configuration des paramètres exec de la session actuelle.

### Étape 4 : Configurer la liste d'autorisation (Allowlist)

**Pourquoi**
allowlist est le mécanisme de sécurité central dans les modes gateway/node, n'autorisant que l'exécution de commandes spécifiques.

#### Éditer allowlist

**Éditer via l'interface** :

1. Ouvrez l'interface de contrôle
2. Accédez à l'onglet **Nodes**
3. Trouvez la carte **Exec approvals**
4. Sélectionnez la cible (Gateway ou Node)
5. Sélectionnez l'Agent (ex. `main`)
6. Cliquez sur **Add pattern** pour ajouter un modèle de commande
7. Cliquez sur **Save** pour enregistrer

**Éditer via CLI** :

```bash
clawdbot approvals
```

**Éditer via fichier JSON** :

Éditez `~/.clawdbot/exec-approvals.json` :

```json
{
  "version": 1,
  "defaults": {
    "security": "deny",
    "ask": "on-miss",
    "askFallback": "deny",
    "autoAllowSkills": false
  },
  "agents": {
    "main": {
      "security": "allowlist",
      "ask": "on-miss",
      "askFallback": "deny",
      "autoAllowSkills": true,
      "allowlist": [
        {
          "id": "B0C8C0B3-2C2D-4F8A-9A3C-5A4B3C2D1E0F",
          "pattern": "~/Projects/**/bin/*",
          "lastUsedAt": 1737150000000,
          "lastUsedCommand": "rg -n TODO",
          "lastResolvedPath": "/Users/user/Projects/bin/rg"
        },
        {
          "id": "C1D9D1C4-3D3E-5F9B-0B4D-6B5C4D3E2F1G",
          "pattern": "/opt/homebrew/bin/rg",
          "lastUsedAt": 1737150000000,
          "lastUsedCommand": "rg test",
          "lastResolvedPath": "/opt/homebrew/bin/rg"
        }
      ]
    }
  }
}
```

**Description du mode Allowlist** :

allowlist utilise **la correspondance de motifs glob** (insensible à la casse) :

| Motif | Correspondance | Description |
|--- | --- | ---|
| `~/Projects/**/bin/*` | `/Users/user/Projects/any/bin/rg` | Correspond à tous les sous-répertoires |
| `~/.local/bin/*` | `/Users/user/.local/bin/jq` | Correspond au bin local |
| `/opt/homebrew/bin/rg` | `/opt/homebrew/bin/rg` | Correspondance de chemin absolu |

::: warning Règles importantes
- **Correspond uniquement au chemin binaire résolu**, ne prend pas en charge la correspondance de nom de base (ex. `rg`)
- Les connexions Shell (`&&`, `||`, `;`) nécessitent que chaque segment respecte allowlist
- Les redirections (`>`, `<`) ne sont pas prises en charge en mode allowlist
:::

**Ce que vous devriez voir** : Après avoir configuré allowlist, seules les commandes correspondantes peuvent être exécutées.

### Étape 5 : Comprendre les bins sûrs (Safe Bins)

**Pourquoi**
safe bins est un ensemble de binaires sûrs qui ne prennent en charge que les opérations stdin, pouvant être exécutés en mode allowlist sans allowlist explicite.

**Bins sûrs par défaut** :

`jq`, `grep`, `cut`, `sort`, `uniq`, `head`, `tail`, `tr`, `wc`

**Caractéristiques de sécurité des bins sûrs** :

- Refuse les arguments de fichier de position
- Refuse les indicateurs de type chemin
- Ne peut opérer que sur le flux passé (stdin)

**Configurer des bins sûrs personnalisés** :

```json
{
  "tools": {
    "exec": {
      "safeBins": ["jq", "grep", "my-safe-tool"]
    }
  }
}
```

**Ce que vous devriez voir** : Les commandes de bins sûrs peuvent être exécutées directement en mode allowlist.

### Étape 6 : Approuver les demandes exec via les canaux de chat

**Pourquoi**
Lorsque l'interface n'est pas disponible, vous pouvez approuver les demandes exec via n'importe quel canal de chat (WhatsApp, Telegram, Slack, etc.).

#### Activer le transfert des approbations

Éditez `~/.clawdbot/clawdbot.json` :

```json
{
  "approvals": {
    "exec": {
      "enabled": true,
      "mode": "session",
      "agentFilter": ["main"],
      "sessionFilter": ["discord"],
      "targets": [
        { "channel": "slack", "to": "U12345678" },
        { "channel": "telegram", "to": "123456789" }
      ]
    }
  }
}
```

**Description des éléments de configuration** :

| Élément de configuration | Description |
|--- | ---|
| `enabled` | Si activer le transfert des approbations exec |
| `mode` | `"session"` \| `"targets"` \| `"both"` - mode de cibles d'approbation |
| `agentFilter` | Traiter uniquement les demandes d'approbation d'agents spécifiques |
| `sessionFilter` | Filtre de session (substring ou regex) |
| `targets` | Liste des canaux cibles (`channel` + `to`) |

#### Approuver les demandes

Lorsque l'outil exec nécessite une approbation, vous recevrez un message avec les informations suivantes :

```
Exec approval request (id: abc-123)
Command: ls -la
CWD: /home/user
Agent: main
Resolved: /usr/bin/ls
Host: gateway
Security: allowlist
```

**Options d'approbation** :

```
/approve abc-123 allow-once     # Autoriser une fois
/approve abc-123 allow-always    # Toujours autoriser (ajouter à allowlist)
/approve abc-123 deny           # Refuser
```

**Ce que vous devriez voir** : Après approbation, la commande est exécutée ou refusée.

## Point de contrôle ✅

- [ ] Vous comprenez les différences entre les trois modes d'exécution (sandbox/gateway/node)
- [ ] Vous avez configuré les paramètres par défaut globaux exec
- [ ] Vous pouvez utiliser la substitution de session de la commande `/exec`
- [ ] Vous avez configuré allowlist (au moins un motif)
- [ ] Vous comprenez les caractéristiques de sécurité des bins sûrs
- [ ] Vous pouvez approuver les demandes exec via les canaux de chat

## Problèmes courants

### Erreurs courantes

| Erreur | Cause | Solution |
|--- | --- | ---|
| `Command not allowed by exec policy` | `security=deny` ou allowlist ne correspond pas | Vérifiez `tools.exec.security` et la configuration allowlist |
| `Approval timeout` | Interface non disponible, `askFallback=deny` | Définissez `askFallback=allowlist` ou activez l'interface |
| `Pattern does not resolve to binary` | Utilisation du nom de base en mode allowlist | Utilisez le chemin complet (ex. `/opt/homebrew/bin/rg`) |
| `Unsupported shell token` | Utilisation de `>` ou `&&` en mode allowlist | Divisez les commandes ou utilisez `security=full` |
| `Node not found` | Nœud non apparié en mode node | Terminez d'abord l'appariement des nœuds |

### Connexions et redirections Shell

::: danger Avertissement
En mode `security=allowlist`, les fonctionnalités Shell suivantes **ne sont pas prises en charge** :
- Tuyaux : `|` (mais `||` est pris en charge)
- Redirections : `>`, `<`, `>>`
- Substitution de commandes : `$()`, `` ` ` ``
- Arrière-plan : `&`, `;`
:::

**Solutions** :
- Utilisez `security=full` (avec prudence)
- Divisez en plusieurs appels exec
- Écrivez des scripts wrapper et ajoutez le chemin du script à allowlist

### Variables d'environnement PATH

Les modes d'exécution gèrent PATH de différentes manières :

| Mode d'exécution | Gestion de PATH | Description |
|--- | --- | ---|
| `sandbox` | Hérite du shell login, peut être réinitialisé par `/etc/profile` | `pathPrepend` s'applique après le profil |
| `gateway` | Fusionne le PATH du shell de login dans l'environnement exec | Le démon garde un PATH minimal, mais exec hérite du PATH utilisateur |
| `node` | Utilise uniquement les remplacements de variables d'environnement passés | Les nœuds macOS rejettent les remplacements de `PATH`, les nœuds headless prennent en charge prepend |

**Ce que vous devriez voir** : La configuration correcte de PATH affecte la recherche de commandes.

## Résumé

L'outil exec permet aux assistants IA d'exécuter des commandes Shell de manière sécurisée via un mécanisme à trois couches (politique d'outils, hôte d'exécution, approbations) :

- **Modes d'exécution** : sandbox (isolement de conteneur), gateway (exécution locale), node (opérations d'appareil)
- **Politiques de sécurité** : deny (interdiction complète), allowlist (liste blanche), full (autorisation complète)
- **Mécanisme d'approbations** : off (pas d'invite), on-miss (invite en cas de non-correspondance), always (toujours inviter)
- **Liste d'autorisation** : correspondance de motifs glob du chemin binaire résolu
- **Bins sûrs** : les binaires qui ne font que des opérations stdin sont exemptés d'approbation en mode allowlist

## Prochaine leçon

> Dans la prochaine leçon, nous apprendrons les **[Outils de recherche et extraction web](../tools-web/)**
>
> Vous apprendrez :
> - Comment utiliser l'outil `web_search` pour la recherche web
> - Comment utiliser l'outil `web_fetch` pour extraire le contenu de pages web
> - Comment configurer les fournisseurs de moteurs de recherche (Brave, Perplexity)
> - Comment gérer les résultats de recherche et les erreurs d'extraction web

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer et voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-27

| Fonctionnalité | Chemin de fichier | Numéro de ligne |
|--- | --- | ---|
| Définition de l'outil exec | [`src/agents/bash-tools.exec.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/bash-tools.exec.ts) | 1-500+ |
| Logique d'approbation exec | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 1-1268 |
| Analyse des commandes Shell | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 500-1100 |
| Correspondance Allowlist | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 507-521 |
| Validation Safe bins | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 836-873 |
| Communication Socket d'approbations | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 1210-1267 |
| Exécution de processus | [`src/process/exec.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/process/exec.ts) | 1-125 |
| Schéma de configuration d'outils | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts) | - |

**Types clés** :
- `ExecHost`: `"sandbox" \| "gateway" \| "node"` - Type d'hôte d'exécution
- `ExecSecurity`: `"deny" \| "allowlist" \| "full"` - Politique de sécurité
- `ExecAsk`: `"off" \| "on-miss" \| "always"` - Politique d'approbation
- `ExecAllowlistEntry`: Type d'entrée allowlist (contient `pattern`, `lastUsedAt`, etc.)

**Constantes clés** :
- `DEFAULT_SECURITY = "deny"` - Politique de sécurité par défaut
- `DEFAULT_ASK = "on-miss"` - Politique d'approbation par défaut
- `DEFAULT_SAFE_BINS = ["jq", "grep", "cut", "sort", "uniq", "head", "tail", "tr", "wc"]` - Bins sûrs par défaut

**Fonctions clés** :
- `resolveExecApprovals()`: Résout la configuration exec-approvals.json
- `evaluateShellAllowlist()`: Évalue si la commande Shell respecte allowlist
- `matchAllowlist()`: Vérifie si le chemin de la commande correspond au motif allowlist
- `isSafeBinUsage()`: Vérifie si la commande est une utilisation de bin sûr
- `requestExecApprovalViaSocket()`: Demande l'approbation via le socket Unix

</details>

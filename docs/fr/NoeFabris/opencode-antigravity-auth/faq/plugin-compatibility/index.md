---
title: "Compatibilité des plugins : Résoudre les conflits courants | Antigravity Auth"
sidebarTitle: "Que faire en cas de conflit"
subtitle: "Résoudre les problèmes de compatibilité avec d'autres plugins"
description: "Apprenez à résoudre les problèmes de compatibilité d'Antigravity Auth avec oh-my-opencode, DCP et autres plugins. Configurez l'ordre correct des plugins et désactivez les méthodes d'authentification conflictuelles."
tags:
  - "FAQ"
  - "Configuration des plugins"
  - "oh-my-opencode"
  - "DCP"
  - "OpenCode"
  - "Antigravity"
prerequisite:
  - "start-quick-install"
order: 4
---

# Résoudre les problèmes de compatibilité avec d'autres plugins

La **compatibilité des plugins** est un problème courant lors de l'utilisation d'Antigravity Auth. Différents plugins peuvent entrer en conflit, entraînant des échecs d'authentification, la perte de thinking blocks ou des erreurs de format de requête. Ce tutoriel vous aide à résoudre les problèmes de compatibilité avec oh-my-opencode, DCP et autres plugins.

## Ce que vous apprendrez

- Configurer correctement l'ordre de chargement des plugins pour éviter les problèmes avec DCP
- Désactiver les méthodes d'authentification conflictuelles dans oh-my-opencode
- Identifier et supprimer les plugins inutiles
- Activer le décalage PID pour les scénarios d'agents parallèles

## Problèmes de compatibilité courants

### Problème 1 : Conflit avec oh-my-opencode

**Symptômes** :
- Échec d'authentification ou fenêtres d'autorisation OAuth répétées
- Les requêtes de modèle renvoient des erreurs 400 ou 401
- La configuration du modèle Agent ne prend pas effet

**Cause** : oh-my-opencode active par défaut l'authentification Google intégrée, qui entre en conflit avec le flux OAuth d'Antigravity Auth.

::: warning Problème principal
oh-my-opencode intercepte toutes les requêtes de modèles Google et utilise sa propre méthode d'authentification. Cela empêche l'utilisation des jetons OAuth d'Antigravity Auth.
:::

**Solution** :

Éditez `~/.config/opencode/oh-my-opencode.json` et ajoutez la configuration suivante :

```json
{
  "google_auth": false,
  "agents": {
    "frontend-ui-ux-engineer": { "model": "google/antigravity-gemini-3-pro" },
    "document-writer": { "model": "google/antigravity-gemini-3-flash" },
    "multimodal-looker": { "model": "google/antigravity-gemini-3-flash" }
  }
}
```

**Explication de la configuration** :

| Option | Valeur | Description |
| --- | --- | --- |
| `google_auth` | `false` | Désactive l'authentification Google intégrée d'oh-my-opencode |
| `agents.<agent-name>.model` | `google/antigravity-*` | Remplace le modèle Agent par un modèle Antigravity |

**Points de vérification ✅** :

- Redémarrez OpenCode après avoir enregistré la configuration
- Testez si l'Agent utilise le modèle Antigravity
- Vérifiez que les fenêtres d'autorisation OAuth n'apparaissent plus

---

### Problème 2 : Conflit avec DCP (@tarquinen/opencode-dcp)

**Symptômes** :
- Le modèle Claude Thinking renvoie l'erreur : `thinking must be first block in message`
- Absence de thinking blocks dans l'historique des conversations
- Le contenu de réflexion ne s'affiche pas

**Cause** : Les synthetic assistant messages (messages d'assistant synthétiques) créés par DCP manquent de thinking blocks, ce qui entre en conflit avec les exigences de l'API Claude.

::: info Qu'est-ce que les synthetic messages ?
Les synthetic messages sont des messages générés automatiquement par des plugins ou le système pour corriger l'historique des conversations ou compléter les messages manquants. DCP crée ces messages dans certains scénarios, mais n'ajoute pas de thinking blocks.
:::

**Solution** :

Assurez-vous qu'Antigravity Auth est chargé **avant** DCP. Éditez `~/.config/opencode/config.json` :

```json
{
  "plugin": [
    "opencode-antigravity-auth@latest",
    "@tarquinen/opencode-dcp@latest"
  ]
}
```

**Pourquoi cet ordre est nécessaire** :

- Antigravity Auth traite et corrige les thinking blocks
- DCP crée des synthetic messages (qui peuvent manquer de thinking blocks)
- Si DCP est chargé en premier, Antigravity Auth ne peut pas corriger les messages créés par DCP

**Points de vérification ✅** :

- Vérifiez que `opencode-antigravity-auth` est avant `@tarquinen/opencode-dcp`
- Redémarrez OpenCode
- Testez si le modèle Thinking affiche correctement le contenu de réflexion

---

### Problème 3 : Attribution de compte dans les scénarios d'agents parallèles

**Symptômes** :
- Plusieurs agents parallèles utilisent le même compte
- Tous les agents échouent simultanément lors de limites de débit
- Faible taux d'utilisation des quotas

**Cause** : Par défaut, plusieurs agents parallèles partagent la même logique de sélection de compte, ce qui peut les amener à utiliser simultanément le même compte.

::: tip Scénarios d'agents parallèles
Lorsque vous utilisez la fonctionnalité parallèle de Cursor (comme l'exécution simultanée de plusieurs Agents), chaque Agent lance indépendamment des requêtes de modèle. Sans attribution de compte appropriée, ils peuvent "entrer en collision".
:::

**Solution** :

Éditez `~/.config/opencode/antigravity.json` et activez le décalage PID :

```json
{
  "pid_offset_enabled": true
}
```

**Qu'est-ce que le décalage PID ?**

Le décalage PID (Process ID) permet à chaque agent parallèle d'utiliser un index de compte de départ différent :

```
Agent 1 (PID 100) → Compte 0
Agent 2 (PID 101) → Compte 1
Agent 3 (PID 102) → Compte 2
```

Ainsi, même lors de requêtes simultanées, ils n'utilisent pas le même compte.

**Prérequis** :
- Au moins 2 comptes Google nécessaires
- Il est recommandé d'activer `account_selection_strategy: "round-robin"` ou `"hybrid"`

**Points de vérification ✅** :

- Confirmez que plusieurs comptes sont configurés (exécutez `opencode auth list`)
- Activez `pid_offset_enabled: true`
- Testez si les agents parallèles utilisent des comptes différents (consultez les journaux de débogage)

---

### Problème 4 : Plugins inutiles

**Symptômes** :
- Conflits d'authentification ou authentification en double
- Échec de chargement des plugins ou messages d'avertissement
- Configuration confuse, incertitude sur les plugins actifs

**Cause** : Installation de plugins aux fonctionnalités redondantes.

::: tip Vérification des plugins redondants
Vérifiez régulièrement la liste des plugins dans `config.json` et supprimez les plugins inutiles pour éviter les conflits et les problèmes de performance.
:::

**Plugins inutiles** :

| Type de plugin | Exemple | Raison |
| --- | --- | --- |
| **Plugins gemini-auth** | `opencode-gemini-auth`, `@username/gemini-auth` | Antigravity Auth gère déjà tous les OAuth Google |
| **Plugins d'authentification Claude** | `opencode-claude-auth` | Antigravity Auth n'utilise pas l'authentification Claude |

**Solution** :

Supprimez ces plugins de `~/.config/opencode/config.json` :

```json
{
  "plugin": [
    "opencode-antigravity-auth@latest"
    // Supprimez ceux-ci :
    // "opencode-gemini-auth@latest",
    // "@username/gemini-auth@latest"
  ]
}
```

**Points de vérification ✅** :

- Consultez la liste des plugins dans `~/.config/opencode/config.json`
- Supprimez tous les plugins liés à gemini-auth
- Redémarrez OpenCode et confirmez l'absence de conflits d'authentification

---

## Dépannage des erreurs courantes

### Erreur 1 : `thinking must be first block in message`

**Causes possibles** :
- DCP est chargé avant Antigravity Auth
- La récupération de session d'oh-my-opencode entre en conflit avec Antigravity Auth

**Étapes de dépannage** :

1. Vérifiez l'ordre de chargement des plugins :
   ```bash
   grep -A 10 '"plugin"' ~/.config/opencode/config.json
   ```

2. Assurez-vous qu'Antigravity Auth est avant DCP

3. Si le problème persiste, essayez de désactiver la récupération de session d'oh-my-opencode (si elle existe)

### Erreur 2 : `invalid_grant` ou échec d'authentification

**Causes possibles** :
- `google_auth` d'oh-my-opencode n'est pas désactivé
- Plusieurs plugins d'authentification tentent de traiter les requêtes simultanément

**Étapes de dépannage** :

1. Vérifiez la configuration d'oh-my-opencode :
   ```bash
   cat ~/.config/opencode/oh-my-opencode.json | grep google_auth
   ```

2. Assurez-vous que la valeur est `false`

3. Supprimez les autres plugins gemini-auth

### Erreur 3 : Tous les agents parallèles utilisent le même compte

**Causes possibles** :
- `pid_offset_enabled` n'est pas activé
- Le nombre de comptes est inférieur au nombre d'agents

**Étapes de dépannage** :

1. Vérifiez la configuration Antigravity :
   ```bash
   cat ~/.config/opencode/antigravity.json | grep pid_offset
   ```

2. Assurez-vous que la valeur est `true`

3. Vérifiez le nombre de comptes :
   ```bash
   opencode auth list
   ```

4. Si le nombre de comptes est inférieur au nombre d'agents, il est recommandé d'ajouter plus de comptes

---

## Exemples de configuration

### Exemple de configuration complète (avec oh-my-opencode)

```json
// ~/.config/opencode/config.json
{
  "plugin": [
    "opencode-antigravity-auth@latest",
    "@tarquinen/opencode-dcp@latest",
    "oh-my-opencode@latest"
  ]
}
```

```json
// ~/.config/opencode/antigravity.json
{
  "pid_offset_enabled": true,
  "account_selection_strategy": "hybrid"
}
```

```json
// ~/.config/opencode/oh-my-opencode.json
{
  "google_auth": false,
  "agents": {
    "frontend-ui-ux-engineer": { "model": "google/antigravity-gemini-3-pro" },
    "document-writer": { "model": "google/antigravity-gemini-3-flash" },
    "multimodal-looker": { "model": "google/antigravity-gemini-3-flash" }
  }
}
```

---

## Résumé de la leçon

Les problèmes de compatibilité des plugins proviennent généralement de conflits d'authentification, de l'ordre de chargement des plugins ou de fonctionnalités redondantes. Avec une configuration appropriée :

- ✅ Désactivez l'authentification Google intégrée d'oh-my-opencode (`google_auth: false`)
- ✅ Assurez-vous qu'Antigravity Auth est chargé avant DCP
- ✅ Activez le décalage PID pour les agents parallèles (`pid_offset_enabled: true`)
- ✅ Supprimez les plugins gemini-auth redondants

Ces configurations permettent d'éviter la plupart des problèmes de compatibilité et de maintenir un environnement OpenCode stable.

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous étudierons le **[Guide de migration](../migration-guide/)**.
>
> Vous apprendrez :
> - Migrer la configuration des comptes entre différentes machines
> - Gérer les modifications de configuration lors des mises à niveau de version
> - Sauvegarder et restaurer les données de compte

---

## Annexe : Références du code source

<details>
<summary><strong>Cliquez pour afficher les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Traitement des thinking blocks | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts#L898-L930) | 898-930 |
| Cache de signature des blocs de réflexion | [`src/plugin/cache/signature-cache.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/cache/signature-cache.ts) | Fichier complet |
| Configuration du décalage PID | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts#L69-L72) | 69-72 |
| Récupération de session (basée sur oh-my-opencode) | [`src/plugin/recovery/index.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/index.ts) | Fichier complet |

**Configuration clé** :
- `pid_offset_enabled: true` : Active le décalage d'ID de processus pour attribuer différents comptes aux agents parallèles
- `account_selection_strategy: "hybrid"` : Stratégie de sélection de compte hybride intelligente

**Fonctions clés** :
- `deepFilterThinkingBlocks()` : Supprime tous les thinking blocks (request-helpers.ts:898)
- `filterThinkingBlocksWithSignatureCache()` : Filtre les thinking blocks selon le cache de signature (request-helpers.ts:1183)

</details>

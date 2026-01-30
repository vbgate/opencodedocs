---
title: "FAQ: Dépannage des problèmes courants | opencode-dcp"
sidebarTitle: "Que faire en cas de problème"
subtitle: "Questions fréquentes et dépannage"
description: "Apprenez à résoudre les problèmes courants lors de l'utilisation d'OpenCode DCP, y compris la correction des erreurs de configuration, l'activation des méthodes de débogage, les raisons de la non-réduction des tokens et d'autres techniques de dépannage."
tags:
  - "FAQ"
  - "troubleshooting"
  - "configuration"
  - "débogage"
prerequisite:
  - "start-getting-started"
order: 1
---

# Questions fréquentes et dépannage

## Problèmes liés à la configuration

### Pourquoi ma configuration ne prend-elle pas effet ?

Les fichiers de configuration DCP sont fusionnés par priorité : **valeurs par défaut < global < variables d'environnement < projet**. La configuration au niveau du projet a la priorité la plus élevée.

**Étapes de vérification** :

1. **Confirmer l'emplacement du fichier de configuration** :
   ```bash
   # macOS/Linux
   ls -la ~/.config/opencode/dcp.jsonc
   ls -la ~/.config/opencode/dcp.json

   # ou dans le répertoire racine du projet
   ls -la .opencode/dcp.jsonc
   ```

2. **Voir la configuration effective** :
   Après avoir le mode de débogage, DCP affichera les informations de configuration dans le fichier journal lors du premier chargement de la configuration.

3. **Redémarrer OpenCode** :
   Après avoir modifié la configuration, vous devez redémarrer OpenCode pour que les modifications prennent effet.

::: tip Priorité de configuration
Si vous avez plusieurs fichiers de configuration simultanément, la configuration au niveau du projet (`.opencode/dcp.jsonc`) remplacera la configuration globale.
:::

### Que faire si le fichier de configuration signale une erreur ?

DCP affichera un avertissement Toast lors de la détection d'une erreur de configuration (affiché après 7 secondes) et utilisera les valeurs par défaut en mode dégradé.

**Types d'erreurs courants** :

| Type d'erreur | Description du problème | Méthode de résolution |
|--- | --- | ---|
| Erreur de type | `pruneNotification` doit être `"off" | "minimal" | "detailed"` | Vérifier l'orthographe des valeurs d'énumération |
| Erreur de tableau | `protectedFilePatterns` doit être un tableau de chaînes | S'assurer d'utiliser le format `["pattern1", "pattern2"]` |
| Clé inconnue | Le fichier de configuration contient des clés non prises en charge | Supprimer ou commenter les clés inconnues |

**Activer les journaux de débogage pour voir les erreurs détaillées** :

```jsonc
// ~/.config/opencode/dcp.jsonc
{
    "debug": true  // Activer les journaux de débogage
}
```

Emplacement du fichier journal : `~/.config/opencode/logs/dcp/daily/YYYY-MM-DD.log`

---

## Problèmes liés aux fonctionnalités

### Pourquoi l'utilisation des tokens n'a-t-elle pas diminué ?

DCP ne rogne que le contenu des **appels d'outils**. Si votre conversation n'utilise pas d'outils, ou si tous les outils utilisés sont protégés, les tokens ne diminueront pas.

**Causes possibles** :

1. **Outils protégés**
   Les outils protégés par défaut incluent : `task`, `write`, `edit`, `batch`, `discard`, `extract`, `todowrite`, `todoread`, `plan_enter`, `plan_exit`

2. **La protection de tour n'a pas expiré**
   Si `turnProtection` est activé, les outils ne seront pas rognés pendant la période de protection.

3. **Aucun contenu dupliqué ou rognable dans la conversation**
   La stratégie automatique de DCP cible uniquement :
   - Les appels d'outils en double (déduplication)
   - Les opérations d'écriture écrasées par des lectures (écrasement d'écriture)
   - Les entrées d'outils erronées expirées (nettoyage des erreurs)

**Méthode de vérification** :

```bash
# Dans OpenCode, entrez
/dcp context
```

Regardez le champ `Pruned` dans la sortie pour connaître le nombre d'outils rognés et les tokens économisés.

::: info Rognage manuel
Si la stratégie automatique ne se déclenche pas, vous pouvez utiliser `/dcp sweep` pour rogner manuellement les outils.
:::

### Pourquoi la session de sous-agent n'est-elle pas rognée ?

**C'est un comportement attendu**. DCP est complètement désactivé dans les sessions de sous-agent.

**Raison** : L'objectif de conception du sous-agent est de renvoyer un résumé concis des découvertes, et non d'optimiser l'utilisation des tokens. Le rognage de DCP pourrait interférer avec le comportement de résumé du sous-agent.

**Comment déterminer s'il s'agit d'une session de sous-agent** :
- Vérifiez le champ `parentID` dans les métadonnées de la session
- Après avoir activé les journaux de débogage, vous verrez le marqueur `isSubAgent: true`

---

## Débogage et journaux

### Comment activer les journaux de débogage ?

```jsonc
// ~/.config/opencode/dcp.jsonc
{
    "debug": true
}
```

**Emplacement des fichiers journaux** :
- **Journaux quotidiens** : `~/.config/opencode/logs/dcp/daily/YYYY-MM-DD.log`
- **Instantanés de contexte** : `~/.config/opencode/logs/dcp/context/{sessionId}/{timestamp}.json`

::: warning Impact sur les performances
Les journaux de débogage écrivent dans des fichiers disque, ce qui peut affecter les performances. Il est recommandé de les désactiver en production.
:::

### Comment voir la distribution des tokens de la session actuelle ?

```bash
# Dans OpenCode, entrez
/dcp context
```

**Exemple de sortie** :

```
╭───────────────────────────────────────────────────────────╮
│                  DCP Context Analysis                     │
╰───────────────────────────────────────────────────────────╯

Session Context Breakdown:
────────────────────────────────────────────────────────────

System         15.2% │████████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  25.1K tokens
User            5.1% │████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│   8.4K tokens
Assistant       35.8% │██████████████████████████████████████▒▒▒▒▒▒▒│  59.2K tokens
Tools (45)      43.9% │████████████████████████████████████████████████│  72.6K tokens

────────────────────────────────────────────────────────────

Summary:
  Pruned:          12 tools (~15.2K tokens)
  Current context: ~165.3K tokens
  Without DCP:     ~180.5K tokens
```

### Comment voir les statistiques cumulées de rognage ?

```bash
# Dans OpenCode, entrez
/dcp stats
```

Cela affichera le nombre cumulé de tokens rognés pour toutes les sessions historiques.

---

## Questions relatives au Prompt Caching

### DCP affecte-t-il le Prompt Caching ?

**Oui**, mais après équilibrage, c'est généralement un gain positif.

Les fournisseurs de LLM (comme Anthropic, OpenAI) mettent en cache les prompts basés sur une **correspondance de préfixe exacte**. Lorsque DCP rogne la sortie des outils, cela modifie le contenu des messages, et le cache devient invalide à partir de ce point.

**Résultats de tests réels** :
- Sans DCP : taux de succès du cache d'environ 85%
- Avec DCP activé : taux de succès du cache d'environ 65%

**Mais les économies de tokens dépassent généralement la perte de cache**, en particulier dans les conversations longues.

**Meilleurs scénarios d'utilisation** :
- Lors de l'utilisation de services facturés par requête (comme GitHub Copilot, Google Antigravity), la perte de cache n'a pas d'impact négatif

---

## Configuration avancée

### Comment protéger des fichiers spécifiques contre le rognage ?

Utilisez la configuration `protectedFilePatterns` avec des motifs glob :

```jsonc
{
    "protectedFilePatterns": [
        "src/config/*",     // Protéger le répertoire config
        "*.env",           // Protéger tous les fichiers .env
        "**/secrets/**"    // Protéger le répertoire secrets
    ]
}
```

Les motifs correspondent au champ `filePath` dans les paramètres des outils (comme les outils `read`, `write`, `edit`).

### Comment personnaliser les outils protégés ?

Chaque stratégie et configuration d'outils a un tableau `protectedTools` :

```jsonc
{
    "strategies": {
        "deduplication": {
            "enabled": true,
            "protectedTools": ["custom_tool"]  // Outils supplémentaires protégés
        }
    },
    "tools": {
        "settings": {
            "protectedTools": ["another_tool"]
        }
    },
    "commands": {
        "protectedTools": ["sweep_protected"]
    }
}
```

Ces configurations sont **ajoutées** à la liste des outils protégés par défaut.

---

## Scénarios d'erreurs courants

### Erreur : DCP non chargé

**Causes possibles** :
1. Le plugin n'est pas enregistré dans `opencode.jsonc`
2. L'installation du plugin a échoué
3. Version d'OpenCode incompatible

**Méthode de résolution** :
1. Vérifiez si `opencode.jsonc` contient `"plugin": ["@tarquinen/opencode-dcp@latest"]`
2. Redémarrez OpenCode
3. Consultez le fichier journal pour confirmer l'état du chargement

### Erreur : fichier de configuration JSON invalide

**Causes possibles** :
- Virgule manquante
- Virgule en trop
- Chaîne non entre guillemets doubles
- Format de commentaire JSONC incorrect

**Méthode de résolution** :
Utilisez un éditeur prenant en charge JSONC (comme VS Code) pour éditer, ou utilisez un outil de validation JSON en ligne pour vérifier la syntaxe.

### Erreur : commande /dcp ne répond pas

**Causes possibles** :
- `commands.enabled` est défini sur `false`
- Le plugin n'est pas chargé correctement

**Méthode de résolution** :
1. Vérifiez si `"commands.enabled"` dans le fichier de configuration est `true`
2. Confirmez que le plugin est chargé (consultez le journal)

---

## Obtenir de l'aide

Si les méthodes ci-dessus ne résolvent pas le problème :

1. **Activez les journaux de débogage** et reproduisez le problème
2. **Consultez les instantanés de contexte** : `~/.config/opencode/logs/dcp/context/{sessionId}/`
3. **Soumettez un Issue sur GitHub** :
   - Joignez les fichiers journaux (supprimez les informations sensibles)
   - Décrivez les étapes de reproduction
   - Expliquez le comportement attendu et le comportement réel

---

## Aperçu du prochain cours

> Dans le prochain cours, nous apprendrons **[DCP Meilleures pratiques](../best-practices/)**.
>
> Vous apprendrez :
> - La relation de compromis entre Prompt Caching et économie de tokens
> - Les règles de priorité de configuration et les stratégies d'utilisation
> - Le choix et la configuration des mécanismes de protection
> - Les techniques d'utilisation des commandes et les suggestions d'optimisation

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer et voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Lignes |
|--- | --- | ---|
| Validation de la configuration | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L147-375) | 147-375 |
| Gestion des erreurs de configuration | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L391-421) | 391-421 |
| Système de journalisation | [`lib/logger.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/logger.ts#L6-109) | 6-109 |
| Instantanés de contexte | [`lib/logger.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/logger.ts#L196-210) | 196-210 |
| Détection de sous-agent | [`lib/state/utils.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/utils.ts#L1-8) | 1-8 |
| Outils protégés | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L68-79) | 68-79 |

**Fonctions clés** :
- `validateConfigTypes()` : Valide les types des éléments de configuration
- `getInvalidConfigKeys()` : Détecte les clés inconnues dans le fichier de configuration
- `Logger.saveContext()` : Enregistre les instantanés de contexte pour le débogage
- `isSubAgentSession()` : Détecte les sessions de sous-agent

</details>

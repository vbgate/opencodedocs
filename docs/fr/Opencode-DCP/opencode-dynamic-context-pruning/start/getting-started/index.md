---
title: "Installation : Démarrage Rapide en 5 Minutes | opencode-dcp"
sidebarTitle: "Démarrage en 5 Minutes"
subtitle: "Installation : Démarrage Rapide en 5 Minutes"
description: "Apprenez à installer le plugin DCP. Complétez la configuration en 5 minutes et réduisez considérablement la consommation de tokens dans les longues conversations grâce à l'élagage automatique, améliorant ainsi la qualité des réponses de l'IA."
tags:
  - "Installation"
  - "Démarrage Rapide"
  - "DCP"
prerequisite:
  - "OpenCode installé"
order: 1
---

# Installation et Démarrage Rapide

## Ce Que Vous Apprendrez

- ✅ Installer le plugin DCP en 5 minutes
- ✅ Configurer le plugin et vérifier l'installation
- ✅ Observer le premier élagage automatique en action

## Votre Situation Actuelle

Après une utilisation prolongée d'OpenCode, les conversations deviennent de plus en plus longues :
- L'IA lit le même fichier plusieurs fois
- Les messages d'erreur des appels d'outils saturent le contexte
- Chaque conversation consomme une grande quantité de tokens
- **Plus la conversation est longue, plus les réponses de l'IA sont lentes**

Vous souhaitez nettoyer automatiquement le contenu redondant des conversations, sans intervention manuelle.

## Concept Fondamental

**DCP (Dynamic Context Pruning)** est un plugin OpenCode qui supprime automatiquement les appels d'outils redondants de l'historique des conversations, réduisant ainsi la consommation de tokens.

Son fonctionnement :
1. **Détection automatique** : Analyse automatiquement l'historique des conversations avant chaque envoi de message
2. **Nettoyage intelligent** : Supprime les appels d'outils dupliqués, les erreurs obsolètes et les écritures écrasées
3. **Piloté par l'IA** : L'IA peut appeler proactivement les outils `discard` et `extract` pour optimiser le contexte
4. **Transparent et contrôlable** : Consultez les statistiques d'élagage via la commande `/dcp` et déclenchez le nettoyage manuellement

::: tip Avantages Clés
- **Coût zéro** : Les stratégies automatiques ne nécessitent aucun appel LLM
- **Configuration zéro** : Prêt à l'emploi, la configuration par défaut est déjà optimisée
- **Risque zéro** : Modifie uniquement le contexte envoyé au LLM, l'historique des conversations reste intact
:::

## 🎒 Préparation Avant de Commencer

Avant de commencer l'installation, veuillez confirmer :

- [ ] **OpenCode** est installé (avec support des plugins)
- [ ] Vous savez comment modifier le **fichier de configuration OpenCode**
- [ ] Vous connaissez la syntaxe **JSONC** de base (JSON avec commentaires)

::: warning Note Importante
DCP modifie le contenu du contexte envoyé au LLM, mais n'affecte pas votre historique de conversations. Vous pouvez désactiver le plugin à tout moment dans la configuration.
:::

## Suivez le Guide

### Étape 1 : Modifier le Fichier de Configuration OpenCode

**Pourquoi**
Vous devez déclarer le plugin DCP dans la configuration OpenCode pour qu'il soit chargé automatiquement au démarrage.

Ouvrez votre fichier de configuration OpenCode `opencode.jsonc` et ajoutez DCP dans le champ `plugin` :

```jsonc
// opencode.jsonc
{
    "plugin": ["@tarquinen/opencode-dcp@latest"],
}
```

**Vous devriez voir** : Le fichier de configuration contient peut-être déjà d'autres plugins. Ajoutez simplement DCP à la fin du tableau.

::: info Astuce
En utilisant le tag `@latest`, OpenCode vérifiera et récupérera automatiquement la dernière version à chaque démarrage.
:::

### Étape 2 : Redémarrer OpenCode

**Pourquoi**
Les modifications de configuration des plugins nécessitent un redémarrage pour prendre effet.

Fermez complètement OpenCode, puis relancez-le.

**Vous devriez voir** : OpenCode démarre normalement, sans message d'erreur.

### Étape 3 : Vérifier l'Installation du Plugin

**Pourquoi**
Confirmer que le plugin DCP est correctement chargé et consulter la configuration par défaut.

Dans une conversation OpenCode, tapez :

```
/dcp
```

**Vous devriez voir** : Le message d'aide de la commande DCP, indiquant que le plugin est installé avec succès.

```
╭───────────────────────────────────────────────────────────╮
│                      DCP Commands                         │
╰───────────────────────────────────────────────────────────╯

  /dcp context      Show token usage breakdown for current session
  /dcp stats        Show DCP pruning statistics
  /dcp sweep [n]    Prune tools since last user message, or last n tools
```

### Étape 4 : Consulter la Configuration par Défaut

**Pourquoi**
Comprendre la configuration par défaut de DCP et confirmer que le plugin fonctionne comme prévu.

DCP crée automatiquement un fichier de configuration lors de la première exécution :

```bash
# Consulter le fichier de configuration global
cat ~/.config/opencode/dcp.jsonc
```

**Vous devriez voir** : Le fichier de configuration est créé, contenant initialement uniquement le champ `$schema` :

```jsonc
{
    "$schema": "https://raw.githubusercontent.com/Opencode-DCP/opencode-dynamic-context-pruning/master/dcp.schema.json"
}
```

Le fichier de configuration ne contient initialement que le champ `$schema`. Toutes les autres options utilisent les valeurs par défaut du code, aucune configuration manuelle n'est nécessaire.

::: tip Explication de la Configuration par Défaut
Les valeurs par défaut de DCP sont les suivantes (pas besoin de les écrire dans le fichier de configuration) :

- **deduplication** : Déduplication automatique, supprime les appels d'outils dupliqués
- **purgeErrors** : Nettoie automatiquement les entrées d'outils erronées datant de plus de 4 tours
- **discard/extract** : Outils d'élagage que l'IA peut appeler
- **pruneNotification** : Affiche des notifications d'élagage détaillées

Si vous souhaitez personnaliser la configuration, vous pouvez ajouter manuellement ces champs. Pour plus de détails, consultez [Configuration Complète](../configuration/).
:::

### Étape 5 : Découvrir l'Élagage Automatique en Action

**Pourquoi**
Utiliser DCP concrètement et observer les effets de l'élagage automatique.

Dans OpenCode, menez une conversation où l'IA lit plusieurs fois le même fichier ou effectue des appels d'outils qui échouent.

**Vous devriez voir** :

1. À chaque envoi de message, DCP analyse automatiquement l'historique des conversations
2. S'il y a des appels d'outils dupliqués, DCP les nettoie automatiquement
3. Après la réponse de l'IA, vous pourriez voir une notification d'élagage (selon la configuration `pruneNotification`)

Exemple de notification d'élagage :

```
▣ DCP | ~12.5K tokens saved total

▣ Pruning (~12.5K tokens)
→ read: src/config.ts
→ write: package.json
```

Tapez `/dcp context` pour voir l'utilisation des tokens de la session en cours :

```
Session Context Breakdown:
──────────────────────────────────────────────────────────

System         15.2% │████████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  25.1K tokens
User            5.1% │████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│   8.4K tokens
Assistant       35.8% │██████████████████████████████████████▒▒▒▒▒▒▒│  59.2K tokens
Tools (45)      43.9% │████████████████████████████████████████████████│  72.6K tokens

──────────────────────────────────────────────────────────

Summary:
  Pruned:          12 tools (~15.2K tokens)
  Current context: ~165.3K tokens
  Without DCP:     ~180.5K tokens
```

## Point de Contrôle ✅

Après avoir terminé les étapes ci-dessus, vous devriez :

- [ ] Avoir ajouté le plugin DCP dans `opencode.jsonc`
- [ ] OpenCode fonctionne normalement après le redémarrage
- [ ] La commande `/dcp` affiche le message d'aide
- [ ] Le fichier de configuration `~/.config/opencode/dcp.jsonc` est créé
- [ ] Voir les notifications d'élagage dans les conversations ou les statistiques via `/dcp context`

**Si une étape échoue** :
- Vérifiez que la syntaxe de `opencode.jsonc` est correcte (format JSONC)
- Consultez les logs OpenCode pour les erreurs de chargement du plugin
- Confirmez que votre version d'OpenCode supporte les plugins

## Alertes aux Pièges

### Problème 1 : Le Plugin Ne Fonctionne Pas

**Symptôme** : La configuration est ajoutée mais aucun effet d'élagage n'est visible

**Cause** : OpenCode n'a pas été redémarré ou le chemin du fichier de configuration est incorrect

**Solution** :
1. Fermez complètement OpenCode puis relancez-le
2. Vérifiez que l'emplacement de `opencode.jsonc` est correct
3. Consultez les logs : fichiers dans le répertoire `~/.config/opencode/logs/dcp/daily/`

### Problème 2 : Le Fichier de Configuration N'est Pas Créé

**Symptôme** : `~/.config/opencode/dcp.jsonc` n'existe pas

**Cause** : OpenCode n'a pas appelé le plugin DCP ou problème de permissions du répertoire de configuration

**Solution** :
1. Confirmez qu'OpenCode a été redémarré
2. Créez manuellement le répertoire de configuration : `mkdir -p ~/.config/opencode`
3. Vérifiez que le nom du plugin est correct dans `opencode.jsonc` : `@tarquinen/opencode-dcp@latest`

### Problème 3 : Les Notifications d'Élagage Ne S'affichent Pas

**Symptôme** : Aucune notification d'élagage visible, mais `/dcp stats` montre des élagages

**Cause** : `pruneNotification` est configuré sur `"off"` ou `"minimal"`

**Solution** : Modifiez le fichier de configuration :
```jsonc
"pruneNotification": "detailed"  // ou "minimal"
```

## Résumé de la Leçon

L'installation du plugin DCP est très simple :
1. Ajouter le plugin dans `opencode.jsonc`
2. Redémarrer OpenCode
3. Vérifier l'installation avec la commande `/dcp`
4. La configuration par défaut est prête à l'emploi, aucun ajustement supplémentaire nécessaire

**Fonctionnalités Activées par Défaut de DCP** :
- ✅ Stratégie de déduplication automatique (supprime les appels d'outils dupliqués)
- ✅ Stratégie de purge des erreurs (nettoie les entrées erronées obsolètes)
- ✅ Outils pilotés par l'IA (`discard` et `extract`)
- ✅ Notifications d'élagage détaillées

**Prochaine étape** : Découvrez comment personnaliser la configuration et ajuster les stratégies d'élagage pour différents scénarios.

---

## Aperçu de la Prochaine Leçon

> Dans la prochaine leçon, nous apprendrons **[Configuration Complète](../configuration/)**
>
> Vous apprendrez :
> - Le système de configuration multi-niveaux (global, variables d'environnement, projet)
> - Le rôle et les paramètres recommandés de chaque option de configuration
> - La protection des tours, les outils protégés, les modèles de fichiers protégés
> - Comment activer/désactiver différentes stratégies d'élagage

---

## Annexe : Référence du Code Source

<details>
<summary><strong>Cliquez pour développer les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonctionnalité | Chemin du Fichier | Lignes |
| --- | --- | --- |
| Point d'entrée du plugin | [`index.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/index.ts) | 12-102 |
| Gestion de la configuration | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 669-794 |
| Traitement des commandes | [`lib/commands/help.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/help.ts) | 1-40 |
| Calcul des tokens | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 68-174 |

**Constantes clés** :
- `MAX_TOOL_CACHE_SIZE = 1000` : Nombre maximum d'entrées dans le cache des outils

**Fonctions clés** :
- `Plugin()` : Enregistrement du plugin et configuration des hooks
- `getConfig()` : Chargement et fusion de la configuration multi-niveaux
- `handleContextCommand()` : Analyse de l'utilisation des tokens de la session en cours

</details>

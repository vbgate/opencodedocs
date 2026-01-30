---
title: "Configuration : Paramètres multiniveaux DCP | opencode-dcp"
sidebarTitle: "Personnaliser DCP selon vos besoins"
subtitle: "Configuration : Paramètres multiniveaux DCP"
description: "Apprenez le système de configuration multiniveaux d'opencode-dcp. Maîtrisez les règles de priorité des configurations globale, d'environnement et de projet, le paramétrage des stratégies de taillage, les mécanismes de protection et l'ajustement des niveaux de notification."
tags:
  - "Configuration"
  - "DCP"
  - "Paramètres de plug-in"
prerequisite:
  - "start-getting-started"
order: 2
---

# Guide complet de configuration DCP

## Ce que vous saurez faire à la fin

- Maîtriser le système de configuration à trois niveaux de DCP (global, projet, variables d'environnement)
- Comprendre les règles de priorité de configuration et savoir quelle configuration sera appliquée
- Ajuster les stratégies de taillage et les mécanismes de protection selon vos besoins
- Configurer les niveaux de notification pour contrôler le niveau de détail des alertes de taillage

## Votre problème actuel

Après l'installation de DCP, la configuration par défaut fonctionne, mais vous pourriez rencontrer ces problèmes :

- Vous souhaitez définir différentes stratégies de taillage pour différents projets
- Vous ne voulez pas que certains fichiers soient taillés
- Les notifications de taillage sont trop fréquentes ou trop détaillées
- Vous souhaitez désactiver une stratégie de taillage automatique

C'est là qu'il faut comprendre le système de configuration de DCP.

## Quand utiliser cette méthode

- **Personnalisation au niveau du projet** : différents projets ont des besoins de taillage différents
- **Débogage** : activer les journaux de debug pour localiser les problèmes
- **Optimisation des performances** : ajuster les bascules de stratégies et les seuils
- **Expérience personnalisée** : modifier les niveaux de notification, protéger les outils critiques

## Concept central

DCP adopte un **système de configuration à trois niveaux**, par ordre de priorité croissante :

```
Valeurs par défaut (codées en dur) → Configuration globale → Variables d'environnement → Configuration de projet
         Priorité la plus faible                              Priorité la plus élevée
```

Chaque niveau de configuration remplace les éléments de configuration du même nom du niveau précédent, donc la configuration de projet a la priorité la plus élevée.

::: info Pourquoi besoin d'une configuration multiniveaux ?

L'objectif de cette conception est :
- **Configuration globale** : définir des comportements par défaut communs, applicables à tous les projets
- **Configuration de projet** : personnaliser pour des projets spécifiques, sans affecter les autres projets
- **Variables d'environnement** : changer rapidement de configuration dans différents environnements (comme CI/CD)

:::

## 🎒 Préparatifs

Assurez-vous d'avoir terminé [Installation et démarrage rapide](../getting-started/), et que le plug-in DCP est installé et fonctionne dans OpenCode.

## Suivez le guide

### Étape 1 : Voir la configuration actuelle

**Pourquoi**
Comprenez d'abord la configuration par défaut, puis décidez comment l'ajuster.

DCP crée automatiquement le fichier de configuration globale lors de sa première exécution.

```bash
# macOS/Linux
cat ~/.config/opencode/dcp.jsonc

# Windows PowerShell
Get-Content "$env:USERPROFILE\.config\opencode\dcp.jsonc"
```

**Ce que vous devriez voir** : une configuration par défaut similaire à celle-ci

```jsonc
{
    "$schema": "https://raw.githubusercontent.com/Opencode-DCP/opencode-dynamic-context-pruning/master/dcp.schema.json",
    "enabled": true,
    "debug": false,
    "pruneNotification": "detailed",
    "commands": {
        "enabled": true,
        "protectedTools": []
    },
    "turnProtection": {
        "enabled": false,
        "turns": 4
    },
    "protectedFilePatterns": [],
    "tools": {
        "settings": {
            "nudgeEnabled": true,
            "nudgeFrequency": 10,
            "protectedTools": []
        },
        "discard": {
            "enabled": true
        },
        "extract": {
            "enabled": true,
            "showDistillation": false
        }
    },
    "strategies": {
        "deduplication": {
            "enabled": true,
            "protectedTools": []
        },
        "supersedeWrites": {
            "enabled": false
        },
        "purgeErrors": {
            "enabled": true,
            "turns": 4,
            "protectedTools": []
        }
    }
}
```

### Étape 2 : Comprendre les emplacements des fichiers de configuration

DCP prend en charge les fichiers de configuration à trois niveaux :

| Niveau | Chemin | Priorité | Scénario applicable |
|--- | --- | --- | ---|
| **Global** | `~/.config/opencode/dcp.jsonc` ou `dcp.json` | 2 | Configuration par défaut pour tous les projets |
| **Variables d'environnement** | `$OPENCODE_CONFIG_DIR/dcp.jsonc` ou `dcp.json` | 3 | Configuration pour des environnements spécifiques |
| **Projet** | `<project>/.opencode/dcp.jsonc` ou `dcp.json` | 4 | Remplacement de configuration pour un seul projet |

::: tip Format du fichier de configuration

DCP prend en charge deux formats : `.json` et `.jsonc` :
- `.json` : format JSON standard, ne peut pas contenir de commentaires
- `.jsonc` : format JSON prenant en charge les commentaires `//` (recommandé)

:::

### Étape 3 : Configurer les notifications de taillage

**Pourquoi**
Contrôlez le niveau de détail des notifications de taillage affichées par DCP pour éviter d'être trop dérangé.

Modifiez le fichier de configuration globale :

```jsonc
{
    "pruneNotification": "detailed"  // Valeurs possibles : "off", "minimal", "detailed"
}
```

**Explication des niveaux de notification** :

| Niveau | Comportement | Scénario applicable |
|--- | --- | ---|
| **off** | Ne pas afficher les notifications de taillage | Se concentrer sur le développement, pas besoin de retour |
| **minimal** | Afficher uniquement des statistiques simples (nombre de tokens économisés) | Besoin d'un retour simple, ne pas être dérangé par trop d'informations |
| **detailed** | Afficher des informations détaillées sur le taillage (nom de l'outil, raison) | Comprendre le comportement de taillage, déboguer la configuration |

**Ce que vous devriez voir** : après avoir modifié la configuration, les notifications s'afficheront avec le nouveau niveau lors du prochain déclenchement du taillage.

### Étape 4 : Configurer les stratégies de taillage automatique

**Pourquoi**
DCP propose trois stratégies de taillage automatique que vous pouvez activer ou désactiver selon vos besoins.

Modifiez le fichier de configuration :

```jsonc
{
    "strategies": {
        // Stratégie de déduplication : supprimer les appels d'outils en double
        "deduplication": {
            "enabled": true,           // Activer/désactiver
            "protectedTools": []         // Noms d'outils supplémentaires à protéger
        },

        // Stratégie de remplacement d'écriture : nettoyer les opérations d'écriture écrasées par des lectures ultérieures
        "supersedeWrites": {
            "enabled": false          // Désactivé par défaut
        },

        // Stratégie de purge des erreurs : nettoyer les entrées d'outils d'erreur expirées
        "purgeErrors": {
            "enabled": true,           // Activer/désactiver
            "turns": 4,               // Nettoyer les erreurs après quelques tours
            "protectedTools": []         // Noms d'outils supplémentaires à protéger
        }
    }
}
```

**Explication détaillée des stratégies** :

- **deduplication (déduplication)** : activée par défaut. Détecte les appels avec le même outil et les mêmes paramètres, conserve uniquement le plus récent.
- **supersedeWrites (remplacement d'écriture)** : désactivée par défaut. Si une opération d'écriture est suivie d'une lecture, nettoie l'entrée de cette opération d'écriture.
- **purgeErrors (purge des erreurs)** : activée par défaut. Les outils d'erreur dépassant le nombre spécifié de tours seront taillés (conserve uniquement le message d'erreur, supprime les paramètres d'entrée potentiellement volumineux).

### Étape 5 : Configurer les mécanismes de protection

**Pourquoi**
Éviter de tailler par erreur du contenu critique (comme des fichiers importants, des outils principaux).

DCP propose trois mécanismes de protection :

#### 1. Protection de tour (Turn Protection)

Protéger les résultats des outils des quelques derniers tours, donner suffisamment de temps à l'IA pour s'y référer.

```jsonc
{
    "turnProtection": {
        "enabled": false,   // Une fois activé, protège les 4 derniers tours
        "turns": 4          // Nombre de tours à protéger
    }
}
```

**Scénario applicable** : lorsque vous constatez que l'IA perd fréquemment le contexte, vous pouvez l'activer.

#### 2. Outils protégés (Protected Tools)

Certains outils ne sont jamais taillés par défaut :

```
task, todowrite, todoread, discard, extract, batch, write, edit, plan_enter, plan_exit
```

Vous pouvez ajouter des outils supplémentaires à protéger :

```jsonc
{
    "tools": {
        "settings": {
            "protectedTools": [
                "myCustomTool",   // Ajouter un outil personnalisé
                "databaseQuery"    // Ajouter un outil à protéger
            ]
        }
    },
    "strategies": {
        "deduplication": {
            "protectedTools": ["databaseQuery"]  // Protéger l'outil pour une stratégie spécifique
        }
    }
}
```

#### 3. Modèles de fichiers protégés (Protected File Patterns)

Utiliser des modèles glob pour protéger des fichiers spécifiques :

```jsonc
{
    "protectedFilePatterns": [
        "**/*.config.ts",           // Protéger tous les fichiers .config.ts
        "**/secrets/**",           // Protéger tous les fichiers du répertoire secrets
        "**/*.env",                // Protéger les fichiers de variables d'environnement
        "**/critical/*.json"        // Protéger les fichiers JSON du répertoire critical
    ]
}
```

::: warning Attention
protectedFilePatterns correspond à `tool.parameters.filePath`, et non au chemin réel du fichier. Cela signifie qu'il ne s'applique qu'aux outils qui ont un paramètre `filePath` (comme read, write, edit).

:::

### Étape 6 : Créer une configuration au niveau du projet

**Pourquoi**
Différents projets peuvent avoir besoin de différentes stratégies de taillage.

Créez le répertoire `.opencode` à la racine du projet (s'il n'existe pas), puis créez `dcp.jsonc` :

```bash
# Exécuter à la racine du projet
mkdir -p .opencode
cat > .opencode/dcp.jsonc << 'EOF'
{
    "$schema": "https://raw.githubusercontent.com/Opencode-DCP/opencode-dynamic-context-pruning/master/dcp.schema.json",
    // Configuration spécifique pour ce projet
    "strategies": {
        "supersedeWrites": {
            "enabled": true   // Activer la stratégie de remplacement d'écriture pour ce projet
        }
    },
    "protectedFilePatterns": [
        "**/config/**/*.ts"   // Protéger les fichiers de configuration de ce projet
    ]
}
EOF
```

**Ce que vous devriez voir** :
- La configuration au niveau du projet remplace les éléments du même nom de la configuration globale
- Les éléments non remplacés continuent d'utiliser la configuration globale

### Étape 7 : Activer les journaux de debug

**Pourquoi**
Rencontrer des problèmes, voir les journaux de debug détaillés.

Modifiez le fichier de configuration :

```jsonc
{
    "debug": true
}
```

**Emplacement des journaux** :
```
~/.config/opencode/logs/dcp/daily/YYYY-MM-DD.log
```

**Ce que vous devriez voir** : le fichier de journal contient des informations détaillées sur les opérations de taillage, le chargement de la configuration, etc.

::: info Recommandation pour l'environnement de production
N'oubliez pas de remettre `debug` à `false` après le débogage, pour éviter que le fichier de journal ne devienne trop volumineux.

:::

## Point de contrôle ✅

Après avoir terminé les étapes ci-dessus, confirmez les éléments suivants :

- [ ] Connaître les trois niveaux de fichiers de configuration et leurs priorités
- [ ] Pouvoir modifier le niveau de notification et voir l'effet
- [ ] Comprendre le rôle des trois stratégies de taillage automatique
- [ ] Savoir configurer les mécanismes de protection (tours, outils, fichiers)
- [ ] Pouvoir créer une configuration au niveau du projet pour remplacer les paramètres globaux

## Mises en garde sur les pièges

### Les modifications de configuration ne prennent pas effet

**Problème** : après avoir modifié le fichier de configuration, OpenCode ne réagit pas.

**Raison** : OpenCode ne recharge pas automatiquement le fichier de configuration.

**Solution** : après avoir modifié la configuration, **redémarrez OpenCode**.

### Erreur de syntaxe dans le fichier de configuration

**Problème** : le fichier de configuration contient une erreur de syntaxe, DCP ne peut pas l'analyser.

**Symptôme** : OpenCode affiche une alerte Toast indiquant "Invalid config".

**Solution** : vérifiez la syntaxe JSON, en particulier :
- Les guillemets, virgules, parenthèses correspondent-ils ?
- Y a-t-il des virgules en trop (comme la virgule après le dernier élément) ?
- Utilisez `true`/`false` pour les valeurs booléennes, pas de guillemets

**Recommandation** : utilisez un éditeur prenant en charge JSONC (comme VS Code + plug-in JSONC).

### Les outils protégés ne prennent pas effet

**Problème** : vous avez ajouté `protectedTools`, mais l'outil est toujours taillé.

**Raisons** :
1. Faute de frappe dans le nom de l'outil
2. Ajouté au mauvais tableau `protectedTools` (comme `tools.settings.protectedTools` vs `strategies.deduplication.protectedTools`)
3. L'appel de l'outil se trouve dans la période de protection de tour (si la protection de tour est activée)

**Solutions** :
1. Vérifiez que l'orthographe du nom de l'outil est correcte
2. Vérifiez qu'il a été ajouté au bon emplacement
3. Consultez les journaux de debug pour comprendre la raison du taillage

## Résumé du cours

Les points clés du système de configuration DCP :

- **Configuration à trois niveaux** : valeurs par défaut → global → variables d'environnement → projet, priorité croissante
- **Remplacement flexible** : la configuration de projet peut remplacer la configuration globale
- **Mécanismes de protection** : protection de tour, outils protégés, modèles de fichiers protégés, éviter le taillage erroné
- **Stratégies automatiques** : déduplication, remplacement d'écriture, purge des erreurs, activation/désactivation selon les besoins
- **Redémarrage pour prendre effet** : n'oubliez pas de redémarrer OpenCode après avoir modifié la configuration

## Aperçu du prochain cours

> Dans le prochain cours, nous apprenrons **[Explication détaillée des stratégies de taillage automatique](../../platforms/auto-pruning/)**.
>
> Vous apprendrez :
> - Comment la stratégie de déduplication détecte les appels d'outils en double
> - Le principe de fonctionnement de la stratégie de remplacement d'écriture
> - Les conditions de déclenchement de la stratégie de purge des erreurs
> - Comment surveiller l'efficacité des stratégies

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer et voir les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Ligne |
|--- | --- | ---|
| Gestion de configuration principale | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 1-798 |
| Schéma de configuration | [`dcp.schema.json`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/dcp.schema.json) | 1-232 |
| Configuration par défaut | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L423-L464) | 423-464 |
| Priorité de configuration | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L669-L797) | 669-797 |
| Validation de configuration | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L147-L375) | 147-375 |
| Chemins des fichiers de configuration | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L484-L526) | 484-526 |
| Outils protégés par défaut | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L68-L79) | 68-79 |
| Fusion de configuration de stratégies | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L565-L595) | 565-595 |
| Fusion de configuration d'outils | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L597-L622) | 597-622 |

**Constantes clés** :
- `DEFAULT_PROTECTED_TOOLS` : liste des noms d'outils protégés par défaut (`lib/config.ts:68-79`)

**Fonctions clés** :
- `getConfig()` : charger et fusionner toutes les configurations de tous les niveaux (`lib/config.ts:669-797`)
- `getInvalidConfigKeys()` : valider les clés invalides dans le fichier de configuration (`lib/config.ts:135-138`)
- `validateConfigTypes()` : valider le type des valeurs de configuration (`lib/config.ts:147-375`)
- `getConfigPaths()` : obtenir les chemins de tous les fichiers de configuration (`lib/config.ts:484-526`)

</details>

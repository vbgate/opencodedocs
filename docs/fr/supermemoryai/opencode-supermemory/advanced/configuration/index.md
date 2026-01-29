---
title: "Configuration avancée : Personnaliser le moteur | opencode-supermemory"
sidebarTitle: "Configuration"
subtitle: "Détails de la configuration approfondie : Personnaliser votre moteur de mémoire"
description: "Maîtrisez la configuration avancée d'opencode-supermemory. Personnalisez les mots-clés, ajustez l'injection de contexte et optimisez les seuils de compression."
tags:
  - "Configuration"
  - "Avancé"
  - "Personnalisation"
prerequisite:
  - "start-getting-started"
order: 2
---

# Détails de la configuration approfondie : Personnaliser votre moteur de mémoire

## Ce que vous pourrez faire après ce cours

- **Personnaliser les mots-clés** : Permettre à l'Agent de comprendre vos commandes personnelles (comme "note ceci", "marque").
- **Ajuster la capacité de mémoire** : Contrôler le nombre de mémoires injectées dans le contexte, équilibrant la consommation de tokens et la quantité d'informations.
- **Optimiser la stratégie de compression** : Ajuster le moment du déclenchement du compactage préemptif selon l'échelle du projet.
- **Gestion multi-environnement** : Basculer flexiblement entre les clés API via les variables d'environnement.

## Emplacement du fichier de configuration

opencode-supermemory recherche les fichiers de configuration suivants dans l'ordre, et s'arrête dès qu'il en trouve un :

1. `~/.config/opencode/supermemory.jsonc` (recommandé, supporte les commentaires)
2. `~/.config/opencode/supermemory.json`

::: tip Pourquoi recommander .jsonc ?
Le format `.jsonc` permet d'écrire des commentaires (`//`) dans JSON, très pratique pour expliquer l'utilisation des éléments de configuration.
:::

## Détails de la configuration principale

Voici un exemple de configuration complet, incluant toutes les options disponibles et leurs valeurs par défaut.

### Configuration de base

```jsonc
// ~/.config/opencode/supermemory.jsonc
{
  // Supermemory API Key
  // Priorité : fichier de configuration > variable d'environnement SUPERMEMORY_API_KEY
  "apiKey": "your-api-key-here",

  // Seuil de similarité pour la recherche sémantique (0.0 - 1.0)
  // Plus la valeur est élevée, plus les résultats sont précis mais moins nombreux ; plus elle est basse, plus les résultats sont dispersés
  "similarityThreshold": 0.6
}
```

### Contrôle de l'injection de contexte

Ces paramètres déterminent combien de mémoires l'Agent lit automatiquement et injecte dans le prompt lors du démarrage d'une session.

```jsonc
{
  // Si le profil utilisateur est injecté automatiquement
  // Définir sur false pour économiser des tokens, mais l'Agent peut oublier vos préférences de base
  "injectProfile": true,

  // Nombre maximum d'éléments du profil utilisateur injectés
  "maxProfileItems": 5,

  // Nombre maximum de mémoires utilisateur (User Scope) injectées
  // Ce sont des mémoires générales partagées entre les projets
  "maxMemories": 5,

  // Nombre maximum de mémoires projet (Project Scope) injectées
  // Ce sont des mémoires spécifiques au projet actuel
  "maxProjectMemories": 10
}
```

### Mots-clés personnalisés

Vous pouvez ajouter des expressions régulières personnalisées pour permettre à l'Agent de reconnaître des commandes spécifiques et de sauvegarder automatiquement les mémoires.

```jsonc
{
  // Liste de mots-clés personnalisés (supporte les expressions régulières)
  // Ces mots seront fusionnés avec les mots-clés par défaut intégrés
  "keywordPatterns": [
    "note ceci",           // Correspondance simple
    "marque\\s+ceci",      // Correspondance regex : mark this
    "important[:：]",       // Correspond à "important:" ou "important："
    "TODO\\(memoire\\)"    // Correspond à une balise spécifique
  ]
}
```

::: details Voir les mots-clés par défaut intégrés
Le plugin intègre les mots-clés suivants, disponibles sans configuration :
- `remember`, `memorize`
- `save this`, `note this`
- `keep in mind`, `don't forget`
- `learn this`, `store this`
- `record this`, `make a note`
- `take note`, `jot down`
- `commit to memory`
- `remember that`
- `never forget`, `always remember`
:::

### Compactage préemptif (Preemptive Compaction)

Lorsque le contexte de la session est trop long, le plugin déclenche automatiquement le mécanisme de compression.

```jsonc
{
  // Seuil de déclenchement de la compression (0.0 - 1.0)
  // Se déclenche lorsque l'utilisation des tokens dépasse ce ratio
  // Par défaut 0.80 (80%)
  "compactionThreshold": 0.80
}
```

::: warning Recommandation de réglage du seuil
- **Ne le réglez pas trop haut** (comme > 0.95) : Cela pourrait entraîner l'épuisement de la fenêtre de contexte avant que la compression ne soit terminée.
- **Ne le réglez pas trop bas** (comme < 0.50) : Cela entraînera des compressions fréquentes, interrompant le flux et gaspillant des tokens.
- **Valeur recommandée** : Entre 0.70 et 0.85.
:::

## Support des variables d'environnement

En plus du fichier de configuration, vous pouvez utiliser des variables d'environnement pour gérer des informations sensibles ou remplacer le comportement par défaut.

| Variable d'environnement | Description | Priorité |
| :--- | :--- | :--- |
| `SUPERMEMORY_API_KEY` | Clé API Supermemory | Inférieure au fichier de configuration |
| `USER` ou `USERNAME` | Identifiant utilisé pour générer le hash de la portée utilisateur | Défaut système |

### Scénario d'utilisation : Basculement multi-environnement

Si vous utilisez différents comptes Supermemory pour les projets de l'entreprise et les projets personnels, vous pouvez utiliser les variables d'environnement :

::: code-group

```bash [macOS/Linux]
# Dans .zshrc ou .bashrc, définissez la clé par défaut
export SUPERMEMORY_API_KEY="key_personal"

# Dans le répertoire du projet de l'entreprise, remplacez temporairement la clé
export SUPERMEMORY_API_KEY="key_work" && opencode
```

```powershell [Windows]
# Définir la variable d'environnement
$env:SUPERMEMORY_API_KEY="key_work"
opencode
```

:::

## Suivez-moi : Créer votre configuration personnalisée

Créons une configuration optimisée adaptée à la plupart des développeurs.

### Étape 1 : Créer le fichier de configuration

Si le fichier n'existe pas, créez-le.

```bash
mkdir -p ~/.config/opencode
touch ~/.config/opencode/supermemory.jsonc
```

### Étape 2 : Écrire la configuration optimisée

Copiez le contenu suivant dans `supermemory.jsonc`. Cette configuration augmente le poids des mémoires projet et ajoute des mots-clés chinois.

```jsonc
{
  // Maintenir la similarité par défaut
  "similarityThreshold": 0.6,

  // Augmenter le nombre de mémoires projet, réduire les mémoires générales, plus adapté au développement approfondi
  "maxMemories": 3,
  "maxProjectMemories": 15,

  // Ajouter des mots-clés chinois
  "keywordPatterns": [
    "note ceci",
    "souviens-toi",
    "sauvegarder mémoire",
    "n'oublie pas"
  ],

  // Déclencher légèrement plus tôt la compression, réserver plus de marge de sécurité
  "compactionThreshold": 0.75
}
```

### Étape 3 : Vérifier la configuration

Redémarrez OpenCode, et essayez d'utiliser les nouveaux mots-clés définis dans la conversation :

```
Entrée utilisateur :
Note ceci : le chemin de base de l'API de ce projet est /api/v2

Réponse système (attendue) :
(L'Agent appelle l'outil supermemory pour sauvegarder la mémoire)
Mémoire sauvegardée : le chemin de base de l'API de ce projet est /api/v2
```

## Questions fréquentes

### Q : Dois-je redémarrer après avoir modifié la configuration ?
**R : Oui.** Le plugin charge la configuration au démarrage. Après avoir modifié `supermemory.jsonc`, vous devez redémarrer OpenCode pour que les changements prennent effet.

### Q : `keywordPatterns` supporte-t-il les expressions régulières chinoises ?
**R : Oui.** Le sous-couche utilise `new RegExp()` de JavaScript, supportant pleinement les caractères Unicode.

### Q : Qu'advient-il si le format du fichier de configuration est incorrect ?
**R : Le plugin revient aux valeurs par défaut.** Si le format JSON est invalide (comme des virgules superflues), le plugin détectera l'erreur et utilisera les `DEFAULTS` intégrés, sans provoquer le crash d'OpenCode.

## Aperçu du prochain cours

> Le prochain cours est **[Confidentialité et sécurité des données](../../security/privacy/)**.
>
> Vous apprendrez :
> - Mécanisme de masquage automatique des données sensibles
> - Comment utiliser la balise `<private>` pour protéger la confidentialité
> - Limites de sécurité du stockage des données

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Lignes |
| :--- | :--- | :--- |
| Définition de l'interface de configuration | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L12-L23) | 12-23 |
| Définition des valeurs par défaut | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L44-L54) | 44-54 |
| Mots-clés par défaut | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L25-L42) | 25-42 |
| Chargement du fichier de configuration | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L73-L86) | 73-86 |
| Lecture des variables d'environnement | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L90) | 90 |

</details>

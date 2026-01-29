---
title: "Confidentialité: Protection des données | opencode-supermemory"
sidebarTitle: "Confidentialité"
subtitle: "Confidentialité et sécurité des données : Comment protéger vos informations sensibles"
description: "Comprenez le mécanisme de protection de la confidentialité d'opencode-supermemory. Apprenez à utiliser la balise private et configurer la clé API en toute sécurité."
tags:
  - "Confidentialité"
  - "Sécurité"
  - "Configuration"
prerequisite:
  - "start-getting-started"
order: 1
---

# Confidentialité et sécurité des données : Comment protéger vos informations sensibles

## Ce que vous pourrez faire après ce cours

* **Comprendre où vont les données** : Savoir clairement quelles données seront téléchargées vers le cloud et lesquelles resteront localement.
* **Maîtriser les techniques de masquage** : Apprendre à utiliser la balise `<private>` pour empêcher le téléchargement d'informations sensibles (comme les mots de passe, les clés).
* **Gérer les clés en toute sécurité** : Apprendre à configurer `SUPERMEMORY_API_KEY` de la manière la plus sécurisée.

## Idée principale

Lors de l'utilisation d'opencode-supermemory, comprendre le flux des données est crucial :

1. **Stockage cloud** : Vos mémoires sont stockées dans la base de données cloud Supermemory, pas dans des fichiers locaux. Cela signifie que vous avez besoin d'une connexion réseau pour accéder aux mémoires.
2. **Masquage local** : Pour protéger la confidentialité, le plugin effectue un masquage des données localement **avant** d'envoyer les données vers le cloud.
3. **Contrôle explicite** : Le plugin ne numérise pas automatiquement tous les fichiers pour les télécharger. Seul le contenu pertinent est traité lorsque l'Agent appelle explicitement l'outil `add` ou déclenche la compression.

### Mécanisme de masquage

Le plugin intègre un filtre simple qui identifie spécifiquement la balise `<private>`.

* **Entrée** : `Le mot de passe de la base de données ici est <private>123456</private>`
* **Traitement** : Le plugin détecte la balise et remplace son contenu par `[REDACTED]`.
* **Téléchargement** : `Le mot de passe de la base de données ici est [REDACTED]`

::: info Conseil
Ce processus de traitement se produit dans le code interne du plugin, avant que les données ne quittent votre ordinateur.
:::

## Suivez-moi

### Étape 1 : Configurer la clé API en toute sécurité

Bien que vous puissiez écrire directement la clé API dans le fichier de configuration, pour éviter les fuites accidentelles (comme partager accidentellement le fichier de configuration avec quelqu'un), nous recommandons de comprendre la logique de priorité.

**Règle de priorité** :
1. **Fichier de configuration** (`~/.config/opencode/supermemory.jsonc`) : Priorité la plus élevée.
2. **Variable d'environnement** (`SUPERMEMORY_API_KEY`) : Utilisée si elle n'est pas définie dans le fichier de configuration.

**Pratique recommandée** :
Si vous souhaitez basculer flexiblement ou l'utiliser dans un environnement CI/CD, utilisez les variables d'environnement. Si vous êtes un développeur individuel, la configuration dans un fichier JSONC dans le répertoire utilisateur est également sûre (car il n'est pas dans votre dépôt Git du projet).

### Étape 2 : Utiliser la balise `<private>`

Lorsque vous demandez à l'Agent de se souvenir de contenu contenant des informations sensibles en langage naturel pendant la conversation, vous pouvez envelopper les parties sensibles avec la balise `<private>`.

**Démonstration de l'action** :

Dites à l'Agent :
> Souviens-toi, l'adresse IP de la base de données de production est 192.168.1.10, mais le mot de passe root est `<private>SuperSecretPwd!</private>`, ne divulgue pas le mot de passe.

**Ce que vous devriez voir** :
L'Agent appelle l'outil `supermemory` pour sauvegarder la mémoire. Bien que la réponse de l'Agent puisse contenir le mot de passe (car il est dans le contexte), **la mémoire réellement sauvegardée dans le cloud Supermemory** a été masquée.

### Étape 3 : Vérifier le résultat du masquage

Nous pouvons vérifier par une recherche si le mot de passe a vraiment été stocké.

**Action** :
Demandez à l'Agent de rechercher la mémoire précédente :
> Recherche le mot de passe de la base de données de production.

**Résultat attendu** :
Le contenu que l'Agent récupère de Supermemory devrait être :
`L'adresse IP de la base de données de production est 192.168.1.10, mais le mot de passe root est [REDACTED]...`

Si l'Agent vous dit "le mot de passe est [REDACTED]", cela signifie que le mécanisme de masquage fonctionne correctement.

## Idées fausses courantes

::: warning Idée fausse 1 : Tout le code sera téléchargé
**Fait** : Le plugin **ne** téléchargera pas automatiquement votre dépôt de code entier. Il ne téléchargera que des segments spécifiques lors de l'exécution de `/supermemory-init` pour l'analyse initiale, ou lorsque l'Agent décide explicitement de "se souvenir" d'une logique de code spécifique.
:::

::: warning Idée fausse 2 : Les fichiers .env seront automatiquement chargés
**Fait** : Le plugin lit `SUPERMEMORY_API_KEY` dans l'environnement du processus. Si vous placez un fichier `.env` dans le répertoire racine du projet, le plugin **ne** le lira pas automatiquement, sauf si votre terminal ou le programme principal OpenCode l'a chargé.
:::

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Lignes |
|--- | --- | ---|
| Logique de masquage de confidentialité | [`src/services/privacy.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/privacy.ts#L1-L13) | 1-13 |
| Chargement de la clé API | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L90) | 90 |
| Appel au masquage par le plugin | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L282) | 282 |

**Fonctions clés** :
- `stripPrivateContent(content)` : Exécute le remplacement regex, transformant le contenu `<private>` en `[REDACTED]`.
- `loadConfig()` : Charge le fichier de configuration local, priorité supérieure aux variables d'environnement.

</details>

## Aperçu du prochain cours

> Félicitations ! Vous avez terminé les cours principaux d'opencode-supermemory !
>
> Ensuite, vous pouvez :
> - Revoir la [configuration avancée](/fr/supermemoryai/opencode-supermemory/advanced/configuration/) pour plus d'options de personnalisation.

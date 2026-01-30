---
title: "Utilisation avancée : configuration et optimisation | Tutoriel opencode-notify"
sidebarTitle: "Personnaliser votre expérience de notifications"
subtitle: "Utilisation avancée : configuration et optimisation"
description: "Maîtrisez la configuration avancée d'opencode-notify : référence, heures calmes, détection de terminal et bonnes pratiques."
tags:
  - "Avancé"
  - "Configuration"
  - "Optimisation"
prerequisite:
  - "start-quick-start"
  - "start-how-it-works"
order: 3
---

# Utilisation avancée : configuration et optimisation

Ce chapitre vous aide à maîtriser les fonctionnalités avancées d'opencode-notify, à approfondir les options de configuration, à optimiser votre expérience de notifications et à personnaliser le comportement des notifications selon vos besoins.

## Parcours d'apprentissage

Nous recommandons d'étudier ce chapitre dans l'ordre suivant :

### 1. [Référence de configuration](./config-reference/)

Découvrez toutes les options de configuration disponibles et leur rôle.

- Maîtriser la structure et la syntaxe du fichier de configuration
- Apprendre les méthodes de personnalisation des sons de notification
- Comprendre les scénarios d'utilisation des interrupteurs de sous-session
- Découvrir les méthodes de configuration de la priorité des types de terminal

### 2. [Heures calmes](./quiet-hours/)

Apprenez à configurer les heures calmes pour éviter d'être dérangé à des moments spécifiques.

- Configurer les heures de début et de fin des heures calmes
- Gérer les heures calmes nocturnes (par exemple 22:00 - 08:00)
- Désactiver temporairement la fonction d'heures calmes si nécessaire
- Comprendre la priorité des heures calmes par rapport aux autres règles de filtrage

### 3. [Principe de détection de terminal](./terminal-detection/)

Plongez dans le mécanisme de détection automatique des terminaux.

- Apprendre comment le plugin identifie 37+ émulateurs de terminal
- Découvrir l'implémentation de la détection de focus sur macOS
- Maîtriser les méthodes de spécification manuelle du type de terminal
- Comprendre le comportement par défaut en cas d'échec de détection

### 4. [Utilisation avancée](./advanced-usage/)

Maîtrisez les techniques de configuration et les bonnes pratiques.

- Stratégies de configuration pour éviter le spam de notifications
- Ajuster le comportement des notifications selon votre flux de travail
- Recommandations de configuration pour les environnements multi-fenêtres et multi-terminaux
- Techniques d'optimisation des performances et de dépannage

## Prérequis

Avant de commencer ce chapitre, nous recommandons d'avoir terminé le contenu de base suivant :

- ✅ **Démarrage rapide** : Installation du plugin et configuration de base
- ✅ **Fonctionnement** : Compréhension des fonctionnalités principales et du mécanisme d'écoute d'événements
- ✅ **Fonctionnalités spécifiques à la plateforme** (optionnel) : Découverte des fonctionnalités spécifiques de votre plateforme

::: tip Conseil d'apprentissage
Si vous souhaitez simplement personnaliser les sons de notification ou configurer les heures calmes, vous pouvez directement passer aux sous-pages correspondantes. En cas de problème, n'hésitez pas à consulter le chapitre de référence de configuration.
:::

## Étapes suivantes

Après avoir terminé ce chapitre, vous pouvez continuer à explorer :

- **[Dépannage](../../faq/troubleshooting/)** : Résoudre les problèmes courants et les cas complexes
- **[Questions fréquentes](../../faq/common-questions/)** : Découvrir les questions importantes des utilisateurs
- **[Types d'événements](../../appendix/event-types/)** : Approfondir tous les types d'événements écoutés par le plugin
- **[Exemple de fichier de configuration](../../appendix/config-file-example/)** : Consulter un exemple complet de configuration avec commentaires

---

<details>
<summary><strong>Cliquer pour afficher l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-27

| Fonction | Chemin du fichier | Lignes |
|--- | --- | ---|
| Définition de l'interface de configuration | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L30-L48) | 30-48 |
| Configuration par défaut | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |
| Chargement de configuration | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |
| Vérification des heures calmes | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L181-L199) | 181-199 |
| Détection de terminal | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L176) | 145-176 |
| Mappage des noms de processus de terminal | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84 |

**Interfaces clés** :
- `NotifyConfig` : Interface de configuration, contient tous les éléments configurables
- `quietHours` : Configuration des heures calmes (enabled/start/end)
- `sounds` : Configuration des sons (idle/error/permission)
- `terminal` : Priorité des types de terminal (optionnel)

**Constantes clés** :
- `DEFAULT_CONFIG` : Valeurs par défaut de tous les éléments de configuration
- `TERMINAL_PROCESS_NAMES` : Table de mappage des noms de terminal vers les noms de processus macOS

</details>

---
title: "Dépannage : Diagnostic des problèmes | oh-my-opencode"
sidebarTitle: "Que faire en cas de problème"
subtitle: "Dépannage : Diagnostic des problèmes | oh-my-opencode"
description: "Apprenez les méthodes de dépannage d'oh-my-opencode. Effectuez un diagnostic de configuration avec plus de 17 vérifications via la commande Doctor pour localiser et résoudre rapidement les problèmes d'installation, d'authentification et de dépendances."
order: 150
---

# Questions fréquentes et dépannage

Ce chapitre vous aide à résoudre les problèmes courants rencontrés lors de l'utilisation d'oh-my-opencode. Du diagnostic de configuration aux astuces d'utilisation, en passant par les recommandations de sécurité, vous pourrez rapidement localiser les problèmes et trouver des solutions.

## Parcours d'apprentissage

Suivez l'ordre ci-dessous pour maîtriser progressivement le dépannage et les meilleures pratiques :

### 1. [Diagnostic de configuration et dépannage](./troubleshooting/)

Apprenez à utiliser la commande Doctor pour diagnostiquer et résoudre rapidement les problèmes de configuration.
- Exécutez la commande Doctor pour un contrôle de santé complet
- Interprétez les résultats des 17+ vérifications (installation, configuration, authentification, dépendances, outils, mises à jour)
- Localisez et réparez les problèmes de configuration courants
- Utilisez le mode détaillé et la sortie JSON pour un diagnostic avancé

### 2. [FAQ (Foire aux questions)](./faq/)

Trouvez et résolvez les problèmes courants rencontrés lors de l'utilisation.
- Réponses rapides aux problèmes d'installation et de configuration
- Astuces d'utilisation et meilleures pratiques (ultrawork, appels proxy, tâches en arrière-plan)
- Notes de compatibilité avec Claude Code
- Avertissements de sécurité et recommandations d'optimisation des performances
- Ressources de contribution et d'aide

## Prérequis

Avant de commencer ce chapitre, assurez-vous de :
- Avoir terminé [l'installation et la configuration rapide](../start/installation/)
- Être familiarisé avec la structure des fichiers de configuration de base d'oh-my-opencode
- Rencontrer un problème spécifique ou vouloir comprendre les meilleures pratiques

::: tip Moment recommandé pour la lecture
Il est recommandé de lire d'abord la FAQ après avoir terminé l'installation de base pour comprendre les pièges courants et les meilleures pratiques. Utilisez ensuite les outils de dépannage pour diagnostiquer les problèmes spécifiques.
:::

## Guide de dépannage rapide

Si vous rencontrez un problème urgent, suivez ces étapes pour un dépannage rapide :

```bash
# Étape 1 : Exécuter un diagnostic complet
bunx oh-my-opencode doctor

# Étape 2 : Voir les messages d'erreur détaillés
bunx oh-my-opencode doctor --verbose

# Étape 3 : Vérifier une catégorie spécifique (par exemple, l'authentification)
bunx oh-my-opencode doctor --category authentication

# Étape 4 : Si le problème persiste, consultez la FAQ
# ou demandez de l'aide sur GitHub Issues
```

## Étapes suivantes

Après avoir terminé ce chapitre, vous pouvez continuer à apprendre :
- **[Compatibilité Claude Code](../appendix/claude-code-compatibility/)** - Découvrez le support complet de compatibilité avec Claude Code
- **[Référence de configuration](../appendix/configuration-reference/)** - Consultez le schéma complet des fichiers de configuration et la description des champs
- **[Serveurs MCP intégrés](../appendix/builtin-mcps/)** - Apprenez à utiliser les serveurs MCP intégrés

---
title: "Annexe: Manuel de référence technique | Antigravity-Manager"
sidebarTitle: "Dictionnaire technique"
subtitle: "Annexe: Manuel de référence technique"
description: "Consultez les références techniques d'Antigravity Tools, incluant tableau de référence rapide des points de terminaison API, structure de stockage de données et limites de fonctionnalités expérimentales. Recherchez rapidement des informations clés."
order: 500
---

# Annexe

Ce chapitre rassemble les références techniques d'Antigravity Tools, incluant tableau de référence rapide des points de terminaison API, structure de stockage de données et limites de fonctionnalités expérimentales. Lorsque vous devez rapidement consulter un détail technique, voici votre « dictionnaire ».

## Contenu de ce chapitre

| Document | Description | Scénario approprié |
|--- | --- | ---|
| **[Tableau de référence rapide des points de terminaison](./endpoints/)** | Vue d'ensemble des routes HTTP externes : points de terminaison OpenAI/Anthropic/Gemini/MCP, modes d'authentification et format d'en-tête | Intégration de nouveaux clients, dépannage 404/401 |
| **[Données et modèles](./storage-models/)** | Structure de fichier de compte, structure de table de base de données statistiques SQLite, définitions de champs clés | Sauvegarde/migration, requête directe de base de données, dépannage |
| **[Limites d'intégration z.ai](./zai-boundaries/)** | Liste des fonctionnalités implémentées vs explicitement non implémentées de z.ai | Évaluer les capacités de z.ai, éviter la mauvaise utilisation |

## Suggestions de chemin d'apprentissage

```
Tableau de référence rapide des points de terminaison → Données et modèles → Limites d'intégration z.ai
    ↓              ↓              ↓
  Savoir quel chemin appeler   Savoir où sont les données   Savoir où sont les limites
```

1. **D'abord le tableau de référence rapide des points de terminaison** : comprenez quelles API peuvent être appelées, et comment configurer l'authentification
2. **Ensuite Données et modèles** : comprenez la structure de stockage de données, facilitant sauvegarde, migration et requête directe de base de données pour dépannage
3. **Enfin Limites d'intégration z.ai** : si vous utilisez z.ai, ce document vous aide à éviter de prendre « non implémenté » comme « utilisable »

::: tip Ces documents ne sont pas « obligatoires »
L'annexe est une référence, pas un tutoriel. Vous n'avez pas besoin de lire du début à la fin, venez consulter uniquement lorsque vous rencontrez un problème spécifique.
:::

## Conditions préalables

::: warning Recommandé de compléter d'abord
- [Qu'est-ce qu'Antigravity Tools](../start/getting-started/) : établir le modèle mental de base
- [Démarrer le proxy local et intégrer le premier client](../start/proxy-and-first-client/) : parcourir le flux de base
:::

Si vous n'avez pas encore parcouru le flux de base, nous recommandons de compléter d'abord les tutoriels du chapitre [Prise en main](../start/).

## Prochaines étapes

Après avoir terminé la lecture de l'annexe, vous pouvez :

- **[Évolution des versions](../changelog/release-notes/)** : comprendre les changements récents, faire la validation avant la mise à niveau
- **[Questions fréquentes](../faq/invalid-grant/)** : en cas d'erreur spécifique, allez au chapitre FAQ pour trouver la réponse
- **[Configuration avancée](../advanced/config/)** : comprendre en profondeur les fonctionnalités avancées comme mise à jour à chaud de configuration, stratégie de planification, etc.

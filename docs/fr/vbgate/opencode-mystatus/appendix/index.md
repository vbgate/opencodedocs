---
title: "Annexes : Références techniques | opencode-mystatus"
sidebarTitle: "Annexes"
subtitle: "Annexes : Références techniques"
description: "Consultez les références techniques d'opencode-mystatus. Découvrez les modèles de données et les endpoints API pour les développeurs avancés."
order: 5
---

# Annexes

Ce chapitre fournit des références techniques pour opencode-mystatus, adaptées aux développeurs et utilisateurs avancés.

## Documentation de référence

### [Modèles de données](./data-models/)

Comprenez les structures de données du plugin :

- Structure des fichiers d'authentification (`auth.json`, `antigravity-accounts.json`, `copilot-quota-token.json`)
- Format de réponse de chaque plateforme API
- Définitions des types de données internes
- Comment étendre le support de nouvelles plateformes

### [Résumé des API](./api-endpoints/)

Consultez toutes les API officielles appelées par le plugin :

- API de consultation des quotas OpenAI
- API de consultation des quotas Zhipu AI / Z.ai
- API de consultation des quotas GitHub Copilot
- API de consultation des quotas Google Cloud Antigravity
- Méthodes d'authentification et formats de requête

## Scénarios d'utilisation

| Scénario | Documentation recommandée |
|--- | ---|
| Comprendre le fonctionnement du plugin | [Modèles de données](./data-models/) |
| Appeler manuellement les API | [Résumé des API](./api-endpoints/) |
| Étendre le support de nouvelles plateformes | Les deux documents sont nécessaires |
| Dépanner les problèmes de format de données | [Modèles de données](./data-models/) |

## Liens connexes

- [Dépôt GitHub](https://github.com/vbgate/opencode-mystatus) - Code source complet
- [Package NPM](https://www.npmjs.com/package/opencode-mystatus) - Versions et dépendances
- [Journal des modifications](../changelog/) - Historique des versions

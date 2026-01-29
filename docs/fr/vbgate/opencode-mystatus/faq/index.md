---
title: "FAQ: Questions fréquentes et dépannage | opencode-mystatus"
sidebarTitle: "FAQ"
subtitle: "FAQ: Questions fréquentes et dépannage"
description: "Trouvez des solutions aux problèmes courants d'opencode-mystatus. Ce guide couvre le dépannage, la sécurité, les erreurs fréquentes et la localisation rapide des solutions."
order: 4
---

# Questions fréquentes

Ce chapitre rassemble les questions et solutions courantes lors de l'utilisation d'opencode-mystatus.

## Catégorisation des questions

### [Dépannage](./troubleshooting/)

Résolvez divers problèmes d'échec de consultation :

- Impossible de lire le fichier d'authentification
- Token expiré ou permissions insuffisantes
- Échec ou timeout des requêtes API
- Gestion des erreurs spécifiques à chaque plateforme

### [Sécurité et confidentialité](./security/)

Comprenez les mécanismes de sécurité du plugin :

- Accès en lecture seule aux fichiers locaux
- Masquage automatique de la clé API
- Appels uniquement aux interfaces officielles
- Pas de téléchargement ou de stockage de données

## Localisation rapide

Trouvez rapidement la solution selon le message d'erreur :

| Mots-clés d'erreur | Cause possible | Solution |
|--- | --- | ---|
| `auth.json not found` | Fichier d'authentification inexistant | [Dépannage](./troubleshooting/) |
| `Token expired` | Token expiré | [Dépannage](./troubleshooting/) |
| `Permission denied` | Permissions insuffisantes | [Configuration de l'authentification Copilot](../advanced/copilot-auth/) |
| `project_id missing` | Configuration Google Cloud incomplète | [Configuration Google Cloud](../advanced/google-setup/) |
| `Request timeout` | Problème réseau | [Dépannage](./troubleshooting/) |

## Obtenir de l'aide

Si ce chapitre ne résout pas votre problème :

- Soumettez une [Issue](https://github.com/vbgate/opencode-mystatus/issues) - Signalez un bug ou demandez une nouvelle fonctionnalité
- Consultez le [dépôt GitHub](https://github.com/vbgate/opencode-mystatus) - Obtenez la dernière version et le code source

---
title: "Intégration de plateformes : multiples protocoles | Antigravity-Manager"
sidebarTitle: "Connectez vos plateformes IA"
subtitle: "Intégration de plateformes : multiples protocoles"
description: "Apprenez l'intégration des protocoles de plateformes avec Antigravity Tools. Supporte la passerelle API unifiée pour 7 protocoles dont OpenAI, Anthropic et Gemini."
order: 200
---

# Plateformes et intégrations

La capacité principale d'Antigravity Tools est de convertir les protocoles de plusieurs plateformes IA en une passerelle API locale unifiée. Ce chapitre détaille la méthode d'intégration, les limites de compatibilité et les meilleures pratiques pour chaque protocole.

## Ce chapitre contient

| Tutoriel | Description |
|---------|-------------|
| [API compatible OpenAI](./openai/) | Stratégies pour `/v1/chat/completions` et `/v1/responses`, intégration transparente du SDK OpenAI |
| [API compatible Anthropic](./anthropic/) | Contrats clés pour `/v1/messages` et Claude Code, supportant les chaînes de pensée, prompts système et autres fonctionnalités principales |
| [API native Gemini](./gemini/) | `/v1beta/models` et intégration des points de terminaison du SDK Google, support compatible avec `x-goog-api-key` |
| [Génération d'images Imagen 3](./imagen/) | Mappage automatique des paramètres `size`/`quality` des Images OpenAI, supporte tous les ratios d'aspect |
| [Transcription audio](./audio/) | Limitations et gestion des gros volumes pour `/v1/audio/transcriptions` |
| [Points de terminaison MCP](./mcp/) | Expose Web Search/Reader/Vision comme outils appelables |
| [Tunnel Cloudflared](./cloudflared/) | Exposez votre API locale sur Internet en un clic (pas sécurisé par défaut) |

## Recommandations de parcours d'apprentissage

::: tip Ordre recommandé
1. **Commencez par le protocole que vous utilisez** : Si vous utilisez Claude Code, commencez par [API compatible Anthropic](./anthropic/) ; si vous utilisez le SDK OpenAI, commencez par [API compatible OpenAI](./openai/)
2. **Apprenez ensuite Gemini natif** : Comprenez la méthode d'intégration directe du SDK Google
3. **Apprenez les fonctionnalités étendues selon vos besoins** : Génération d'images, transcription audio, outils MCP
4. **Terminez par les tunnels** : Consultez [Tunnel Cloudflared](./cloudflared/) seulement si vous avez besoin d'exposer sur Internet
:::

**Sélection rapide** :

| Votre scénario | Commencez par |
|---------------|---------------|
| Utilisation du CLI Claude Code | [API compatible Anthropic](./anthropic/) |
| Utilisation du SDK Python OpenAI | [API compatible OpenAI](./openai/) |
| Utilisation du SDK officiel Google | [API native Gemini](./gemini/) |
| Besoin de génération d'images IA | [Génération d'images Imagen 3](./imagen/) |
| Besoin de transcription vocal vers texte | [Transcription audio](./audio/) |
| Besoin de recherche en ligne/lecture de pages web | [Points de terminaison MCP](./mcp/) |
| Besoin d'accès à distance | [Tunnel Cloudflared](./cloudflared/) |

## Prérequis

::: warning Avant de commencer, vérifiez que
- [Installation et mise à niveau](../start/installation/) terminée
- [Ajout de comptes](../start/add-account/) terminé
- [Démarrage du reverse proxy local](../start/proxy-and-first-client/) terminé (au minimum capable d'accéder à `/healthz`)
:::

## Prochaines étapes

Après avoir terminé ce chapitre, vous pouvez continuer à apprendre :

- [Configuration avancée](../advanced/) : Routage de modèles, gouvernance des quotas, programmation haute disponibilité et autres fonctionnalités avancées
- [Questions fréquentes](../faq/) : Guide de dépannage pour les erreurs 401/404/429, etc.

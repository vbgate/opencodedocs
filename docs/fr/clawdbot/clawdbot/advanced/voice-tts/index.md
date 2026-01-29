---
title: "Réveil vocal et TTS : Voice Wake, Talk Mode et configuration vocale | Tutoriel Clawdbot"
sidebarTitle: "Réveiller l'IA en une phrase"
subtitle: "Réveil vocal et synthèse vocale"
description: "Apprenez à configurer les fonctions vocales de Clawdbot : Voice Wake réveil vocal, Talk Mode mode de conversation continue et fournisseurs TTS de synthèse vocale (Edge, OpenAI, ElevenLabs). Ce tutoriel couvre la configuration des mots de réveil vocal, la conversation vocale continue, la configuration TTS multi-fournisseurs et le dépannage courant."
tags:
  - "advanced"
  - "voice"
  - "tts"
  - "configuration"
prerequisite:
  - "start-getting-started"
order: 250
---

# Réveil vocal et synthèse vocale

## Ce que vous pourrez faire après avoir appris

- Configurer Voice Wake réveil vocal, prend en charge les nœuds macOS/iOS/Android
- Utiliser Talk Mode pour une conversation vocale continue (entrée vocale → IA → sortie vocale)
- Configurer plusieurs fournisseurs TTS (Edge, OpenAI, ElevenLabs) et basculement automatique en cas de panne
- Personnaliser les mots de réveil vocal, les voix TTS et les paramètres de conversation
- Dépanner les problèmes courants des fonctions vocales (autorisations, formats audio, erreurs API)

## Votre situation actuelle

L'interaction vocale est pratique, mais la configuration peut être confuse :

- Quel fournisseur TTS devriez-vous utiliser ? Edge est gratuit mais la qualité est moyenne, ElevenLabs est de haute qualité mais payant
- Quelle est la différence entre Voice Wake et Talk Mode ? Quand utiliser chacun ?
- Comment configurer des mots de réveil personnalisés au lieu de "clawd" par défaut ?
- Comment synchroniser la configuration vocale sur différents appareils (macOS, iOS, Android) ?
- Pourquoi le format de sortie TTS est-il important ? Pourquoi Telegram utilise-t-il Opus alors que d'autres canaux utilisent MP3 ?

## Quand utiliser cette fonction

- **Voice Wake** : Lorsque vous avez besoin d'une expérience d'assistant vocal mains libres. Par exemple, réveiller l'IA en parlant directement sur macOS ou iOS/Android sans opération de clavier.
- **Talk Mode** : Lorsque vous avez besoin d'une conversation vocale continue. Par exemple, conversation de plusieurs tours avec l'IA par voix en conduisant, cuisinant ou marchant.
- **Configuration TTS** : Lorsque vous souhaitez que les réponses de l'IA soient lues par voix. Par exemple, assistant vocal pour les personnes âgées ou malvoyantes, ou expérience personnelle d'assistant vocal.
- **Voix personnalisée** : Lorsque vous n'êtes pas satisfait de la voix par défaut. Par exemple, ajuster la vitesse, la hauteur, la stabilité, ou changer vers des modèles de voix en chinois.

## 🎒 Préparatifs avant de commencer

::: warning Conditions préalables
Ce tutoriel suppose que vous avez terminé [Démarrage rapide](../../start/getting-started/), avez installé et démarré Gateway.
::

- Le démon Gateway est en cours d'exécution
- Au moins un fournisseur de modèle IA est configuré (Anthropic ou OpenAI)
- **Pour Voice Wake** : Appareil macOS/iOS/Android installé et connecté à Gateway
- **Pour Talk Mode** : Nœud iOS ou Android connecté (l'application de barre de menu macOS ne prend en charge que Voice Wake)
- **Pour ElevenLabs TTS** : Clé API ElevenLabs préparée (si vous avez besoin d'une voix de haute qualité)
- **Pour OpenAI TTS** : Clé API OpenAI préparée (optionnel, Edge TTS est gratuit mais la qualité est moyenne)

::: info Avertissement d'autorisations
Voice Wake et Talk Mode nécessitent les autorisations suivantes :
- **Autorisation de microphone** : Essentielle pour l'entrée vocale
- **Autorisation de reconnaissance vocale** (Speech Recognition) : Voix vers texte
- **Autorisation d'accessibilité** (macOS) : Surveillance des raccourcis globaux (comme Cmd+Fn push-to-talk)
::

## Concepts clés

Clawdbot possède trois modules de fonctions vocales qui travaillent ensemble : Voice Wake (réveil), Talk Mode (conversation continue), TTS (synthèse vocale).

### Voice Wake : Système global de mots de réveil

Les mots de réveil sont une configuration globale de Gateway.

### Talk Mode : Boucle de conversation vocale

Boucle de conversation vocale continue avec transitions d'état Listening → Thinking → Speaking.

### TTS : Basculement automatique en cas de panne entre plusieurs fournisseurs

Prend en charge trois fournisseurs TTS (Edge, OpenAI, ElevenLabs) avec basculement automatique en cas de panne.

## Suivez-moi

### Étape 1 : Configurer TTS de base

Modifier `~/.clawdbot/clawdbot.json` :

```yaml
messages:
  tts:
    auto: "always"
    provider: "edge"
    edge:
      enabled: true
      voice: "zh-CN-XiaoxiaoNeural"
      lang: "zh-CN"
      outputFormat: "audio-24khz-48kbitrate-mono-mp3"
```

```bash
clawdbot gateway restart
```

### Étape 2 : Configurer ElevenLabs TTS

Générer la clé API sur [console ElevenLabs](https://elevenlabs.io/app).

Variables d'environnement :

```bash
export ELEVENLABS_API_KEY="xi_..."
```

Ou fichier de configuration :

```yaml
messages:
  tts:
    provider: "elevenlabs"
    elevenlabs:
      voiceId: "pMsXgVXv3BLzUgSXRplE"
      modelId: "eleven_multilingual_v2"
```

### Étape 3 : Configurer OpenAI TTS comme sauvegarde

```yaml
messages:
  tts:
    provider: "elevenlabs"
    openai:
      model: "gpt-4o-mini-tts"
      voice: "alloy"
```

### Étape 4 : Configurer les mots de réveil Voice Wake

Sur l'application macOS, allez dans Settings → Voice Wake pour modifier les mots de réveil.

Ou en utilisant RPC :

```bash
clawdbot gateway rpc voicewake.set '{"triggers":["助手","小助"]}'
```

### Étape 5 : Utiliser Talk Mode (iOS/Android)

Appuyez sur le bouton Talk dans l'application iOS/Android pour activer.

## Point de contrôle ✅

- [ ] Configuration TTS de base terminée
- [ ] Réponse vocale IA reçue sur au moins un canal
- [ ] Mots de réveil Voice Wake personnalisés
- [ ] Talk Mode iOS/Android peut démarrer et maintenir la conversation
- [ ] Fonction d'interruption TTS fonctionne correctement
- [ ] Peut changer de fournisseur avec la commande `/tts`
- [ ] Pas d'erreurs TTS dans les journaux Gateway

## Résumé

- Les fonctions vocales de Clawdbot comprennent trois modules : Voice Wake, Talk Mode, TTS
- TTS prend en charge trois fournisseurs : Edge (gratuit), OpenAI (stable), ElevenLabs (haute qualité)
- Voice Wake utilise la configuration globale des mots de réveil
- Talk Mode ne prend en charge que iOS/Android
- Le format de sortie TTS est déterminé par le canal
- Configuration recommandée : ElevenLabs principal, OpenAI sauvegarde, Edge TTS pour les urgences

## Prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[Système de mémoire et recherche vectorielle](../memory-system/)**.

---

## Annexe : Références du code source

<details>
<summary><strong>Cliquez pour afficher les emplacements du code source</strong></summary>

> Mis à jour : 2026-01-27

| Fonction | Chemin du fichier | Numéro de ligne |
| ----- | --------- | ---- |
| Logique principale TTS | [`src/tts/tts.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/tts/tts.ts) | 1-1472 |
| ElevenLabs TTS | [`src/tts/tts.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/tts/tts.ts) | 916-991 |
| OpenAI TTS | [`src/tts/tts.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/tts/tts.ts) | 993-1037 |
| Edge TTS | [`src/tts/tts.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/tts/tts.ts) | 1050-1069 |
| Gestion de configuration Voice Wake | [`src/infra/voicewake.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/voicewake.ts) | 1-91 |

</details>

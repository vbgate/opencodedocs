---
title: "Appariement DM et Contrôle d'Accès : Protégez Votre Assistant IA | Tutoriel Clawdbot"
sidebarTitle: "Gérer les Accès d'Inconnus"
subtitle: "Appariement DM et Contrôle d'Accès : Protégez Votre Assistant IA"
description: "Comprendre le mécanisme de protection par appariement DM de Clawdbot, apprendre à approuver les demandes d'appariement d'expéditeurs inconnus via CLI, lister les demandes en attente et gérer la liste autorisée. Ce tutoriel couvre le flux d'appariement, l'utilisation des commandes CLI, la configuration des stratégies d'accès et les bonnes pratiques de sécurité, incluant le dépannage des erreurs courantes et la commande doctor."
tags:
  - "Démarrage"
  - "Sécurité"
  - "Appariement"
  - "Contrôle d'accès"
prerequisite:
  - "start-gateway-startup"
order: 50
---

# Appariement DM et Contrôle d'Accès : Protégez Votre Assistant IA

## Ce que vous apprendrez

Après avoir suivi ce tutoriel, vous serez capable de :

- ✅ Comprendre le mécanisme de protection par appariement DM par défaut
- ✅ Approuver les demandes d'appariement d'expéditeurs inconnus
- ✅ Lister et gérer les demandes d'appariement en attente
- ✅ Configurer différentes stratégies d'accès DM (pairing/allowlist/open)
- ✅ Exécuter doctor pour vérifier la configuration de sécurité

## Votre situation actuelle

Vous avez peut-être configuré un canal WhatsApp ou Telegram et espériez discuter avec l'assistant IA, mais vous rencontrez les problèmes suivants :

- "Pourquoi les inconnus m'envoient-ils des messages et Clawdbot ne répond-il pas ?"
- "J'ai reçu un code d'appariement, je ne sais pas ce que cela signifie"
- "Je veux approuver la demande de quelqu'un mais je ne sais pas quelle commande utiliser"
- "Comment savoir combien de personnes attendent une approbation ?"

La bonne nouvelle est que **Clawdbot active par défaut la protection par appariement DM**, ce qui garantit que seuls les expéditeurs que vous avez autorisés peuvent converser avec l'assistant IA.

## Quand utiliser cette approche

Lorsque vous devez :

- 🛡 **Protéger votre vie privée** : Garantir que seules les personnes de confiance peuvent converser avec l'assistant IA
- ✅ **Approuver des inconnus** : Permettre à de nouveaux expéditeurs d'accéder à votre assistant IA
- 🔒 **Contrôle d'accès strict** : Limiter les droits d'accès aux utilisateurs spécifiques
- 📋 **Gestion par lots** : Voir et gérer toutes les demandes d'appariement en attente

---

## Concept fondamental

### Qu'est-ce que l'appariement DM ?

Clawdbot se connecte aux plateformes de messagerie réelles (WhatsApp, Telegram, Slack, etc.), et les **messages privés (DM) sur ces plateformes sont considérés par défaut comme des entrées non fiables**.

Pour protéger votre assistant IA, Clawdbot fournit un **mécanisme d'appariement** :

::: info Flux d'appariement
1. Un expéditeur inconnu vous envoie un message
2. Clawdbot détecte que cet expéditeur n'est pas autorisé
3. Clawdbot renvoie un **code d'appariement** (8 caractères)
4. L'expéditeur doit vous fournir le code d'appariement
5. Vous approuvez ce code via CLI
6. L'ID de l'expéditeur est ajouté à la liste autorisée
7. L'expéditeur peut converser normalement avec l'assistant IA
:::

### Stratégie DM par défaut

**Tous les canaux utilisent par défaut `dmPolicy="pairing"`**, ce qui signifie :

| Stratégie | Comportement |
|--- | ---|
| `pairing` | Les expéditeurs inconnus reçoivent un code d'appariement, les messages ne sont pas traités (par défaut) |
| `allowlist` | Seuls les expéditeurs de la liste `allowFrom` sont autorisés |
| `open` | Autorise tous les expéditeurs (nécessite une configuration explicite `"*"`) |
| `disabled` | Désactive complètement la fonctionnalité DM |

::: warning Rappel de sécurité
Le mode `pairing` par défaut est le choix le plus sûr. Sauf si vous avez des besoins spéciaux, ne passez pas en mode `open`.
:::

---

## 🎒 Avant de commencer

Assurez-vous que vous avez :

- [x] Complété le tutoriel [Démarrage Rapide](../getting-started/)
- [x] Complété le tutoriel [Démarrage du Gateway](../gateway-startup/)
- [x] Configuré au moins un canal de messagerie (WhatsApp, Telegram, Slack, etc.)
- [x] Le Gateway est en cours d'exécution

---

## Suivez-moi

### Étape 1 : Comprendre l'origine du code d'appariement

Lorsqu'un expéditeur inconnu envoie un message à votre Clawdbot, ils recevront une réponse similaire à :

```
Clawdbot: access not configured.

Telegram ID: 123456789

Pairing code: AB3D7X9K

Ask the bot owner to approve with:
clawdbot pairing approve telegram <code>
```

**Caractéristiques clés du code d'appariement** (source : `src/pairing/pairing-store.ts`) :

- **8 caractères** : Facile à saisir et à mémoriser
- **Lettres majuscules et chiffres** : Évite la confusion
- **Caractères confus exclus** : Ne contient pas 0, O, 1, I
- **Validité de 1 heure** : Expire automatiquement après ce délai
- **Maximum 3 demandes en attente** : Les demandes les plus anciennes sont automatiquement nettoyées une fois ce délai dépassé

### Étape 2 : Lister les demandes d'appariement en attente

Exécutez la commande suivante dans le terminal :

```bash
clawdbot pairing list telegram
```

**Vous devriez voir** :

```
Pairing requests (1)

┌──────────────────┬────────────────┬────────┬──────────────────────┐
│ Code            │ ID            │ Meta   │ Requested            │
├──────────────────┼────────────────┼────────┼──────────────────────┤
│ AB3D7X9K        │ 123456789      │        │ 2026-01-27T10:30:00Z │
└──────────────────┴────────────────┴────────┴──────────────────────┘
```

S'il n'y a pas de demandes en attente, vous verrez :

```
No pending telegram pairing requests.
```

::: tip Canaux pris en charge
La fonction d'appariement prend en charge les canaux suivants :
- telegram
- whatsapp
- slack
- discord
- signal
- imessage
- msteams
- googlechat
- bluebubbles
:::

### Étape 3 : Approuver la demande d'appariement

Utilisez le code d'appariement fourni par l'expéditeur pour approuver l'accès :

```bash
clawdbot pairing approve telegram AB3D7X9K
```

**Vous devriez voir** :

```
✅ Approved telegram sender 123456789
```

::: info Effet après approbation
Après approbation, l'ID de l'expéditeur (123456789) est automatiquement ajouté à la liste autorisée de ce canal, stocké dans :
`~/.clawdbot/credentials/telegram-allowFrom.json`
:::

### Étape 4 : Notifier l'expéditeur (optionnel)

Si vous souhaitez notifier automatiquement l'expéditeur, vous pouvez utiliser l'option `--notify` :

```bash
clawdbot pairing approve telegram AB3D7X9K --notify
```

L'expéditeur recevra le message suivant (source : `src/channels/plugins/pairing-message.ts`) :

```
✅ Clawdbot access approved. Send a message to start chatting.
```

**Attention** : L'option `--notify` nécessite que le Gateway Clawdbot soit en cours d'exécution et que ce canal soit actif.

### Étape 5 : Vérifier que l'expéditeur peut converser normalement

Demandez à l'expéditeur d'envoyer à nouveau un message, l'assistant IA devrait répondre normalement.

---

## Point de contrôle ✅

Effectuez les vérifications suivantes pour confirmer que la configuration est correcte :

- [ ] Exécuter `clawdbot pairing list <channel>` permet de voir les demandes en attente
- [ ] Utiliser `clawdbot pairing approve <channel> <code>` permet d'approuver avec succès
- [ ] Les expéditeurs approuvés peuvent converser normalement avec l'assistant IA
- [ ] Le code d'appariement expire automatiquement après 1 heure (vérifiable en renvoyant un message)

---

## Pièges à éviter

### Erreur 1 : Code d'appariement introuvable

**Message d'erreur** :
```
No pending pairing request found for code: AB3D7X9K
```

**Causes possibles** :
- Le code d'appariement a expiré (plus de 1 heure)
- Le code d'appariement a été saisi incorrectement (vérifiez la casse)
- L'expéditeur n'a pas réellement envoyé de message (le code d'appariement n'est généré que lors de la réception d'un message)

**Solution** :
- Demandez à l'expéditeur d'envoyer à nouveau un message pour générer un nouveau code d'appariement
- Assurez-vous que le code d'appariement est correctement copié (attention à la casse)

### Erreur 2 : Le canal ne prend pas en charge l'appariement

**Message d'erreur** :
```
Channel xxx does not support pairing
```

**Causes possibles** :
- Faute de frappe dans le nom du canal
- Ce canal ne prend pas en charge la fonction d'appariement

**Solution** :
- Exécutez `clawdbot pairing list` pour voir la liste des canaux pris en charge
- Utilisez le nom correct du canal

### Erreur 3 : Échec de la notification

**Message d'erreur** :
```
Failed to notify requester: <error details>
```

**Causes possibles** :
- Gateway n'est pas en cours d'exécution
- Connexion du canal interrompue
- Problème réseau

**Solution** :
- Vérifiez que le Gateway est en cours d'exécution
- Vérifiez l'état de la connexion du canal : `clawdbot channels status`
- N'utilisez pas l'option `--notify`, notifiez manuellement l'expéditeur

---

## Résumé du cours

Ce tutoriel a présenté le mécanisme de protection par appariement DM de Clawdbot :

- **Sécurité par défaut** : Tous les canaux utilisent par défaut le mode `pairing` pour protéger votre assistant IA
- **Flux d'appariement** : Les expéditeurs inconnus reçoivent un code d'appariement de 8 caractères, vous devez l'approuver via CLI
- **Commandes de gestion** :
  - `clawdbot pairing list <channel>` : Lister les demandes en attente
  - `clawdbot pairing approve <channel> <code>` : Approuver l'appariement
- **Emplacement de stockage** : La liste autorisée est stockée dans `~/.clawdbot/credentials/<channel>-allowFrom.json`
- **Expiration automatique** : Les demandes d'appariement expirent automatiquement après 1 heure

Rappelez-vous : **le mécanisme d'appariement est la pierre angulaire de la sécurité de Clawdbot**, garantissant que seules les personnes que vous avez autorisées peuvent converser avec l'assistant IA.

---

## Aperçu du prochain cours

> Dans le prochain cours, nous apprendrons le **[Dépannage : Résoudre les problèmes courants](../../faq/troubleshooting/)**.
>
> Vous apprendrez :
> - Diagnostic rapide et vérification de l'état du système
> - Résoudre les problèmes de démarrage du Gateway, de connexion des canaux, d'erreurs d'authentification, etc.
> - Méthodes de dépannage pour les échecs d'appel d'outils et l'optimisation des performances

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquer pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-27

| Fonctionnalité | Chemin du fichier | Lignes |
|--- | --- | ---|
| Génération du code d'appariement (8 caractères, exclut les caractères confus) | [`src/pairing/pairing-store.ts`](https://github.com/moltbot/moltbot/blob/main/src/pairing/pairing-store.ts#L173-L181) | 173-181 |
| Stockage et TTL des demandes d'appariement (1 heure) | [`src/pairing/pairing-store.ts`](https://github.com/moltbot/moltbot/blob/main/src/pairing/pairing-store.ts#L11-L14) | 11-14 |
| Commande d'approbation d'appariement | [`src/cli/pairing-cli.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/pairing-cli.ts#L107-L143) | 107-143 |
| Génération du message de code d'appariement | [`src/pairing/pairing-messages.ts`](https://github.com/moltbot/moltbot/blob/main/src/pairing/pairing-messages.ts#L4-L20) | 4-20 |
| Stockage de la liste autorisée | [`src/pairing/pairing-store.ts`](https://github.com/moltbot/moltbot/blob/main/src/pairing/pairing-store.ts#L457-L461) | 457-461 |
| Liste des canaux prenant en charge `pairing` | [`src/channels/plugins/pairing.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/pairing.ts#L11-L16) | 11-16 |
| Stratégie DM par défaut (pairing) | [`src/config/zod-schema.providers-core.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/zod-schema.providers-core.ts#L93) | 93 |

**Constantes clés** :
- `PAIRING_CODE_LENGTH = 8` : Longueur du code d'appariement
- `PAIRING_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"` : Jeu de caractères du code d'appariement (exclut 0O1I)
- `PAIRING_PENDING_TTL_MS = 60 * 60 * 1000` : Validité de la demande d'appariement (1 heure)
- `PAIRING_PENDING_MAX = 3` : Nombre maximum de demandes en attente

**Fonctions clés** :
- `approveChannelPairingCode()` : Approuve le code d'appariement et l'ajoute à la liste autorisée
- `listChannelPairingRequests()` : Liste les demandes d'appariement en attente
- `upsertChannelPairingRequest()` : Crée ou met à jour une demande d'appariement
- `addChannelAllowFromStoreEntry()` : Ajoute un expéditeur à la liste autorisée

</details>

---
title: "Guide complet de configuration du canal WhatsApp | Tutoriel Clawdbot"
sidebarTitle: "Connexion WhatsApp en 5 minutes"
subtitle: "Guide complet de configuration du canal WhatsApp"
description: "Apprenez à configurer et utiliser le canal WhatsApp dans Clawdbot (basé sur Baileys), y compris la connexion par QR code, la gestion multi-comptes, le contrôle d'accès DM et la prise en charge des groupes."
tags:
  - "whatsapp"
  - "configuration-canal"
  - "baileys"
  - "connexion-qr"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 70
---

# Guide complet de configuration du canal WhatsApp

## Ce que vous pourrez faire après ce cours

- Connecter un compte WhatsApp à Clawdbot via QR code
- Configurer la prise en charge multi-comptes WhatsApp
- Configurer le contrôle d'accès DM (appariement/liste blanche/public)
- Activer et gérer la prise en charge des groupes WhatsApp
- Configurer les confirmations automatiques de messages et les accusés de lecture

## Votre problème actuel

WhatsApp est votre plateforme de messagerie la plus utilisée, mais votre assistant IA ne peut pas encore recevoir de messages WhatsApp. Vous souhaitez :
- Discuter directement avec l'IA sur WhatsApp, sans changer d'application
- Contrôler qui peut envoyer des messages à votre IA
- Prendre en charge plusieurs comptes WhatsApp (séparation travail/personnel)

## Quand utiliser cette solution

- Vous devez intégrer un assistant IA sur WhatsApp
- Vous devez séparer les comptes WhatsApp travail/personnel
- Vous souhaitez contrôler précisément qui peut envoyer des messages à l'IA

::: info Qu'est-ce que Baileys ?

Baileys est une bibliothèque WhatsApp Web qui permet aux programmes d'envoyer et de recevoir des messages via le protocole WhatsApp Web. Clawdbot utilise Baileys pour se connecter à WhatsApp, sans avoir besoin de l'API WhatsApp Business, ce qui est plus privé et plus flexible.

:::

## 🎒 Préparatifs avant de commencer

Avant de configurer le canal WhatsApp, assurez-vous de :

- [ ] Avoir installé et démarré Clawdbot Gateway
- [ ] Avoir terminé le [ démarrage rapide](../../start/getting-started/)
- [ ] Disposer d'un numéro de téléphone fonctionnel (recommandé : numéro secondaire)
- [ ] Que le téléphone WhatsApp puisse accéder à Internet (pour scanner le QR code)

::: warning Points d'attention

- **Utilisez un numéro indépendant** : carte SIM séparée ou ancien téléphone, pour éviter d'interférer avec votre usage personnel
- **Évitez les numéros virtuels** : TextNow, Google Voice et autres numéros virtuels seront bloqués par WhatsApp
- **Runtime Node** : WhatsApp et Telegram sont instables sur Bun, utilisez Node ≥22

:::

## Concepts fondamentaux

L'architecture principale du canal WhatsApp :

```
Votre téléphone WhatsApp ←--(QR code)--> Baileys ←--→ Clawdbot Gateway
                                                      ↓
                                                  Agent IA
                                                      ↓
                                              Réponse message
```

**Concepts clés** :

1. **Session Baileys** : Connexion établie via WhatsApp Linked Devices
2. **Stratégie DM** : Contrôle qui peut envoyer des messages privés à l'IA
3. **Prise en charge multi-comptes** : Un Gateway gère plusieurs comptes WhatsApp
4. **Confirmation de messages** : Envoi automatique d'emojis/accusés de lecture pour améliorer l'expérience utilisateur

## Suivez les étapes

### Étape 1 : Configurer les paramètres de base

**Pourquoi**
Configurer les stratégies de contrôle d'accès WhatsApp pour protéger votre assistant IA contre les abus.

Modifiez `~/.clawdbot/clawdbot.json`, ajoutez la configuration WhatsApp :

```json
{
  "channels": {
    "whatsapp": {
      "dmPolicy": "pairing",
      "allowFrom": ["+15551234567"]
    }
  }
}
```

**Description des champs** :

| Champ | Type | Par défaut | Description |
|--- | --- | --- | ---|
| `dmPolicy` | string | `"pairing"` | Stratégie d'accès DM : `pairing` (appariement), `allowlist` (liste blanche), `open` (public), `disabled` (désactivé) |
| `allowFrom` | string[] | `[]` | Liste des numéros de téléphone autorisés (format E.164, ex. `+15551234567`) |

**Comparaison des stratégies DM** :

| Stratégie | Comportement | Scénario d'utilisation |
|--- | --- | ---|
| `pairing` | Expéditeurs inconnus reçoivent un code d'appariement, approbation manuelle requise | **Recommandé**, équilibre entre sécurité et commodité |
| `allowlist` | Seuls les numéros de la liste `allowFrom` sont autorisés | Contrôle strict, utilisateurs connus |
| `open` | N'importe qui peut envoyer (nécessite que `allowFrom` contienne `"*"`) | Test public ou service communautaire |
| `disabled` | Ignorer tous les messages WhatsApp | Désactiver temporairement ce canal |

**Ce que vous devriez voir** : Fichier de configuration enregistré avec succès, sans erreur de format JSON.

### Étape 2 : Se connecter à WhatsApp

**Pourquoi**
Connecter le compte WhatsApp à Clawdbot via QR code, Baileys maintiendra l'état de la session.

Exécutez dans le terminal :

```bash
clawdbot channels login whatsapp
```

**Connexion multi-comptes** :

Se connecter à un compte spécifique :

```bash
clawdbot channels login whatsapp --account work
```

Se connecter au compte par défaut :

```bash
clawdbot channels login whatsapp
```

**Étapes** :

1. Le terminal affiche un QR code (ou dans l'interface CLI)
2. Ouvrez l'application WhatsApp sur votre téléphone
3. Allez dans **Settings → Linked Devices**
4. Cliquez sur **Link a Device**
5. Scannez le QR code affiché dans le terminal

**Ce que vous devriez voir** :

```
✓ WhatsApp linked successfully!
Credentials stored: ~/.clawdbot/credentials/whatsapp/default/creds.json
```

::: tip Stockage des identifiants

Les identifiants de connexion WhatsApp sont stockés dans `~/.clawdbot/credentials/whatsapp/<accountId>/creds.json`. Après la première connexion, la session sera automatiquement restaurée aux démarrages suivants, sans avoir à rescanner le QR code.

:::

### Étape 3 : Démarrer le Gateway

**Pourquoi**
Démarrer le Gateway pour que le canal WhatsApp commence à recevoir et envoyer des messages.

```bash
clawdbot gateway
```

Ou utiliser le mode démon :

```bash
clawdbot gateway start
```

**Ce que vous devriez voir** :

```
[WhatsApp] Connected to WhatsApp Web
[WhatsApp] Default account linked: +15551234567
Gateway listening on ws://127.0.0.1:18789
```

### Étape 4 : Envoyer un message de test

**Pourquoi**
Vérifier que la configuration du canal WhatsApp est correcte et que les messages sont envoyés et reçus normalement.

Envoyez un message depuis votre téléphone WhatsApp vers le numéro connecté :

```
Bonjour
```

**Ce que vous devriez voir** :
- Le terminal affiche les journaux des messages reçus
- WhatsApp reçoit la réponse de l'IA

**Point de contrôle ✅**

- [ ] Les journaux du Gateway affichent `[WhatsApp] Received message from +15551234567`
- [ ] WhatsApp reçoit la réponse de l'IA
- [ ] Le contenu de la réponse est pertinent par rapport à votre entrée

### Étape 5 : Configurer les options avancées (optionnel)

#### Activer les confirmations automatiques de messages

Ajoutez dans `clawdbot.json` :

```json
{
  "channels": {
    "whatsapp": {
      "ackReaction": {
        "emoji": "👀",
        "direct": true,
        "group": "mentions"
      }
    }
  }
}
```

**Description des champs** :

| Champ | Type | Par défaut | Description |
|--- | --- | --- | ---|
| `emoji` | string | - | Emoji de confirmation (ex. `"👀"`, `"✅"`), chaîne vide signifie désactivé |
| `direct` | boolean | `true` | Envoyer la confirmation dans les messages privés |
| `group` | string | `"mentions"` | Comportement dans les groupes : `"always"` (tous les messages), `"mentions"` (seulement @mentions), `"never"` (jamais) |

#### Configurer les accusés de lecture

Par défaut, Clawdbot marque automatiquement les messages comme lus (double coche bleue). Pour désactiver :

```json
{
  "channels": {
    "whatsapp": {
      "sendReadReceipts": false
    }
  }
}
```

#### Ajuster les limites de messages

```json
{
  "channels": {
    "whatsapp": {
      "textChunkLimit": 4000,
      "mediaMaxMb": 50,
      "chunkMode": "length"
    }
  }
}
```

| Champ | Par défaut | Description |
|--- | --- | ---|
| `textChunkLimit` | 4000 | Nombre maximum de caractères par message texte |
| `mediaMaxMb` | 50 | Taille maximum des fichiers médias reçus (MB) |
| `chunkMode` | `"length"` | Mode de découpage : `"length"` (par longueur), `"newline"` (par paragraphe) |

**Ce que vous devriez voir** : Une fois la configuration appliquée, les longs messages sont automatiquement découpés, la taille des fichiers médias est contrôlée.

## Mises en garde et problèmes courants

### Problème 1 : Échec du scan du QR code

**Symptôme** : Après avoir scanné le QR code, le terminal affiche un échec de connexion ou un délai d'expiration.

**Cause** : Problème de connexion réseau ou service WhatsApp instable.

**Solution** :

1. Vérifiez la connexion réseau du téléphone
2. Assurez-vous que le serveur Gateway peut accéder à Internet
3. Déconnectez-vous et reconnectez-vous :
   ```bash
   clawdbot channels logout whatsapp
   clawdbot channels login whatsapp
   ```

### Problème 2 : Messages non livrés ou retardés

**Symptôme** : Après avoir envoyé un message, la réponse est reçue après un long délai.

**Cause** : Gateway non démarré ou connexion WhatsApp interrompue.

**Solution** :

1. Vérifiez l'état du Gateway : `clawdbot gateway status`
2. Redémarrez le Gateway : `clawdbot gateway restart`
3. Consultez les journaux : `clawdbot logs --follow`

### Problème 3 : Code d'appariement non reçu

**Symptôme** : Un inconnu envoie un message, mais aucun code d'appariement n'est reçu.

**Cause** : `dmPolicy` n'est pas configuré sur `pairing`.

**Solution** :

Vérifiez le paramètre `dmPolicy` dans `clawdbot.json` :

```json
{
  "channels": {
    "whatsapp": {
      "dmPolicy": "pairing"  // ← Assurez-vous que c'est "pairing"
    }
  }
}
```

### Problème 4 : Problème de runtime Bun

**Symptôme** : WhatsApp et Telegram se déconnectent fréquemment ou échouent à se connecter.

**Cause** : Baileys et Telegram SDK sont instables sur Bun.

**Solution** :

Utilisez Node ≥22 pour exécuter le Gateway :

Vérifiez le runtime actuel :

```bash
node --version
```

Si nécessaire, exécutez le Gateway avec Node :

```bash
clawdbot gateway --runtime node
```

::: tip Runtime recommandé

Les canaux WhatsApp et Telegram recommandent fortement l'utilisation du runtime Node, Bun peut entraîner une instabilité de connexion.

:::

## Résumé du cours

Points clés de la configuration du canal WhatsApp :

1. **Configuration de base** : `dmPolicy` + `allowFrom` pour contrôler l'accès
2. **Processus de connexion** : `clawdbot channels login whatsapp` et scan du QR code
3. **Multi-comptes** : Utilisez le paramètre `--account` pour gérer plusieurs comptes WhatsApp
4. **Options avancées** : Confirmations automatiques de messages, accusés de lecture, limites de messages
5. **Dépannage** : Vérifiez l'état du Gateway, les journaux et le runtime

## Aperçu du cours suivant

> Dans le cours suivant, nous apprendrons la configuration du **[canal Telegram](../telegram/)**.
>
> Vous apprendrez :
> - Configurer un bot Telegram avec le Bot Token
> - Configurer les commandes et les requêtes en ligne
> - Gérer les stratégies de sécurité spécifiques à Telegram

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour afficher l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-27

| Fonctionnalité | Chemin du fichier | Lignes |
|--- | --- | ---|
| Définition des types de configuration WhatsApp | [`src/config/types.whatsapp.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/types.whatsapp.ts) | 1-160 |
| Schéma de configuration WhatsApp | [`src/config/zod-schema.providers-whatsapp.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/zod-schema.providers-whatsapp.ts) | 13-100 |
| Configuration d'intégration WhatsApp | [`src/channels/plugins/onboarding/whatsapp.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/onboarding/whatsapp.ts) | 1-341 |
| Documentation WhatsApp | [`docs/channels/whatsapp.md`](https://github.com/moltbot/moltbot/blob/main/docs/channels/whatsapp.md) | 1-363 |
| Outil de connexion WhatsApp | [`src/channels/plugins/agent-tools/whatsapp-login.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/agent-tools/whatsapp-login.ts) | 1-72 |
| Outil WhatsApp Actions | [`src/agents/tools/whatsapp-actions.ts`](https://github.com/moltbot/moltbot/blob/main/src/agents/tools/whatsapp-actions.ts) | 1-42 |

**Éléments de configuration clés** :
- `dmPolicy` : Stratégie d'accès DM (`pairing`/`allowlist`/`open`/`disabled`)
- `allowFrom` : Liste des expéditeurs autorisés (numéros de téléphone au format E.164)
- `ackReaction` : Configuration de la confirmation automatique de messages (`{emoji, direct, group}`)
- `sendReadReceipts` : Envoyer les accusés de lecture (par défaut `true`)
- `textChunkLimit` : Limite de découpage de texte (par défaut 4000 caractères)
- `mediaMaxMb` : Limite de taille des fichiers médias (par défaut 50 Mo)

**Fonctions clés** :
- `loginWeb()` : Exécute la connexion WhatsApp par QR code
- `startWebLoginWithQr()` : Démarre le processus de génération de QR code
- `sendReactionWhatsApp()` : Envoie une réaction emoji WhatsApp
- `handleWhatsAppAction()` : Traite les actions spécifiques à WhatsApp (comme les réactions)

**Constantes clés** :
- `DEFAULT_ACCOUNT_ID` : ID du compte par défaut (`"default"`)
- `creds.json` : Chemin de stockage des identifiants d'authentification WhatsApp

</details>

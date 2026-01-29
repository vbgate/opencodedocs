---
title: "Cloudflared : Exposition publique de l'API locale | Antigravity-Manager"
sidebarTitle: "Permettre aux appareils distants d'accéder à l'API locale"
subtitle: "Tunnel en un clic Cloudflared : Exposition sécurisée de l'API locale sur l'Internet public (pas sécurisé par défaut)"
description: "Apprenez le tunnel en un clic Cloudflared d'Antigravity Tools : Faites fonctionner Quick/Auth deux modes de démarrage, comprenez quand l'URL s'affiche, comment copier et tester, et utilisez proxy.auth_mode + API Key fort pour une exposition minimale. Avec emplacement d'installation, erreurs courantes et idées de dépannage, les appareils distants peuvent également appeler la passerelle locale de manière stable."
tags:
  - "Cloudflared"
  - "Pénétration Intranet"
  - "Accès public"
  - "Tunnel"
  - "Antigravity Tools"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 7
---
# Tunnel en un clic Cloudflared : Exposition sécurisée de l'API locale sur l'Internet public (pas sécurisé par défaut)

Vous utiliserez le **tunnel en un clic Cloudflared** pour exposer la passerelle API locale d'Antigravity Tools sur l'Internet public (uniquement lorsque vous l'activez explicitement), permettant aux appareils distants de l'appeler, tout en comprenant les différences de comportement et les limites de risque entre les modes Quick et Auth.

## Ce que vous pourrez faire après ce cours

- Installer et démarrer le tunnel Cloudflared en un clic
- Choisir entre le mode Quick (URL temporaire) et le mode Auth (tunnel nommé)
- Copier l'URL publique pour permettre aux appareils distants d'accéder à l'API locale
- Comprendre les risques de sécurité du tunnel et adopter une stratégie d'exposition minimale

## Votre problème actuel

Vous avez exécuté la passerelle API locale d'Antigravity Tools, mais seule la machine locale ou le réseau local peut y accéder. Vous souhaitez permettre aux serveurs distants, aux appareils mobiles ou aux services cloud d'appeler également cette passerelle, mais vous n'avez pas d'IP publique et ne souhaitez pas déployer de solutions de serveur complexes.

## Quand utiliser cette méthode

- Vous n'avez pas d'IP publique mais avez besoin que des appareils distants accèdent à l'API locale
- Vous êtes en phase de test/développement et souhaitez exposer rapidement le service à l'extérieur
- Vous ne souhaitez pas acheter de serveur pour le déploiement, utilisez simplement la machine existante

::: warning Avertissement de sécurité
L'exposition publique comporte des risques ! Veuillez vous assurer de :
1. Configurer un API Key fort (`proxy.auth_mode=strict/all_except_health`)
2. N'activer le tunnel que si nécessaire, fermez-le dès que vous avez terminé
3. Vérifier régulièrement les journaux Monitor, arrêter immédiatement si des anomalies sont détectées
:::

## 🎒 Préparatifs avant de commencer

::: warning Conditions préalables
- Vous avez déjà démarré le service de proxy inverse (l'interrupteur de la page "API Proxy" est activé)
- Vous avez déjà ajouté au moins un compte disponible
:::

## Qu'est-ce que Cloudflared ?

**Cloudflared** est le client tunnel fourni par Cloudflare. Il établit un canal crypté entre votre machine et Cloudflare, mappant le service HTTP local en une URL accessible depuis le public. Antigravity Tools simplifie l'installation, le démarrage, l'arrêt et la copie d'URL en opérations d'interface utilisateur, vous permettant de compléter rapidement la boucle de vérification.

### Plates-formes prises en charge

La logique "téléchargement automatique + installation" intégrée au projet ne couvre que ces combinaisons OS/architecture (d'autres plates-formes signaleront `Unsupported platform`).

| Système d'exploitation | Architecture | État de prise en charge |
| --- | --- | --- |
| macOS | Apple Silicon (arm64) | ✅ |
| macOS | Intel (x86_64) | ✅ |
| Linux | x86_64 | ✅ |
| Linux | ARM64 | ✅ |
| Windows | x86_64 | ✅ |

### Comparaison des deux modes

| Caractéristique | Mode Quick | Mode Auth |
| --- | --- | --- |
| **Type d'URL** | `https://xxx.trycloudflare.com` (URL temporaire extraite des journaux) | L'application ne peut pas extraire automatiquement l'URL (dépend des journaux cloudflared) ; le nom de domaine d'entrée est basé sur votre configuration côté Cloudflare |
| **Token requis** | ❌ Non requis | ✅ Requis (obtenu depuis la console Cloudflare) |
| **Stabilité** | L'URL peut changer avec le redémarrage du processus | Dépend de votre configuration côté Cloudflare (l'application ne fait que démarrer le processus) |
| **Scénario adapté** | Test temporaire, vérification rapide | Service stable à long terme, environnement de production |
| **Recommandation** | ⭐⭐⭐ Pour les tests | ⭐⭐⭐⭐⭐ Pour la production |

::: info Caractéristiques de l'URL en mode Quick
L'URL en mode Quick peut changer à chaque démarrage et est un sous-domaine `*.trycloudflare.com` généré aléatoirement. Si vous avez besoin d'une URL fixe, vous devez utiliser le mode Auth et lier le nom de domaine dans la console Cloudflare.
:::

## Suivez le guide

### Étape 1 : Ouvrez la page API Proxy

**Pourquoi**
Trouvez l'entrée de configuration Cloudflared.

1. Ouvrez Antigravity Tools
2. Cliquez sur **"API Proxy"** dans la navigation de gauche (Proxy inverse API)
3. Trouvez la carte **"Public Access (Cloudflared)"** (en bas de la page, icône orange)

**Vous devriez voir** : Une carte extensible affichant "Cloudflared not installed" (non installé) ou "Installed: xxx" (installé).

### Étape 2 : Installez Cloudflared

**Pourquoi**
Téléchargez et installez le binaire Cloudflared dans le dossier `bin` du répertoire de données.

#### Si non installé

1. Cliquez sur le bouton **"Install"** (Installer)
2. Attendez que le téléchargement soit terminé (selon la vitesse du réseau, environ 10-30 secondes)

**Vous devriez voir** :
- Le bouton affiche une animation de chargement
- Une fois terminé, le message "Cloudflared installed successfully"
- La carte affiche "Installed: cloudflared version 202X.X.X"

#### Si déjà installé

Sautez cette étape et passez directement à l'étape 3.

::: tip Emplacement d'installation
Le binaire Cloudflared sera installé dans `bin/` du "répertoire de données" (le nom du répertoire de données est `.antigravity_tools`).

::: code-group

```bash [macOS/Linux]
ls -la "$HOME/.antigravity_tools/bin/"
```

```powershell [Windows]
Get-ChildItem "$HOME\.antigravity_tools\bin\"
```

:::

Si vous n'êtes pas sûr où se trouve le répertoire de données, lisez d'abord **[Premier démarrage : Répertoire de données, journaux, barre des tâches et démarrage automatique](../../start/first-run-data/)**.
:::

### Étape 3 : Choisissez le mode de tunnel

**Pourquoi**
Choisissez le mode approprié selon votre scénario d'utilisation.

1. Dans la carte, trouvez la zone de sélection de mode (deux grands boutons)
2. Cliquez pour choisir :

| Mode | Description | Quand choisir |
| --- | --- | --- |
| **Quick Tunnel** | Génère automatiquement une URL temporaire (`*.trycloudflare.com`) | Test rapide, accès temporaire |
| **Named Tunnel** | Utilise le compte Cloudflare et un nom de domaine personnalisé | Environnement de production, besoin de nom de domaine fixe |

::: tip Recommandation de choix
Si vous l'utilisez pour la première fois, **choisissez d'abord le mode Quick** pour vérifier rapidement si les fonctionnalités répondent à vos besoins.
:::

### Étape 4 : Configurez les paramètres

**Pourquoi**
Remplissez les paramètres nécessaires et les options selon le mode.

#### Mode Quick

1. Le port utilisera automatiquement votre port Proxy actuel (par défaut `8045`, basé sur la configuration réelle)
2. Cochez **"Use HTTP/2"** (coché par défaut)

#### Mode Auth

1. Entrez le **Tunnel Token** (obtenu depuis la console Cloudflare)
2. Le port utilise également votre port Proxy actuel (basé sur la configuration réelle)
3. Cochez **"Use HTTP/2"** (coché par défaut)

::: info Comment obtenir le Tunnel Token ?
1. Connectez-vous à la [console Cloudflare Zero Trust](https://dash.cloudflare.com/sign-up-to-cloudflare-zero-trust)
2. Allez dans **"Networks"** → **"Tunnels"**
3. Cliquez sur **"Create a tunnel"** → **"Remote browser"** ou **"Cloudflared"**
4. Copiez le Token généré (une longue chaîne similaire à `eyJhIjoiNj...`)
:::

#### Description de l'option HTTP/2

`Use HTTP/2` fait démarrer cloudflared avec `--protocol http2`. Le texte dans le projet le décrit comme "plus compatible (recommandé pour les utilisateurs de Chine continentale)" et est activé par défaut.

::: tip Recommandation de coche
**L'option HTTP/2 est recommandée cochée par défaut**, surtout dans l'environnement réseau de Chine continentale.
:::

### Étape 5 : Démarrez le tunnel

**Pourquoi**
Établissez le tunnel crypté entre local et Cloudflare.

1. Cliquez sur l'interrupteur dans le coin supérieur droit de la carte (ou sur le bouton **"Start Tunnel"** après développement)
2. Attendez le démarrage du tunnel (environ 5-10 secondes)

**Vous devriez voir** :
- Un point vert s'affiche à droite du titre de la carte
- Le message **"Tunnel Running"**
- L'URL publique affichée (similaire à `https://random-name.trycloudflare.com`)
- Un bouton de copie à droite : le bouton n'affiche que les 20 premiers caractères de l'URL, mais le clic copie l'URL complète

::: warning Le mode Auth peut ne pas afficher l'URL
L'application actuelle n'extrait que les URL de type `*.trycloudflare.com` des journaux cloudflared pour l'affichage. Le mode Auth ne produit généralement pas de tels noms de domaine, vous pouvez donc voir seulement "Running", mais pas l'URL. Dans ce cas, le nom de domaine d'entrée est basé sur votre configuration côté Cloudflare.
:::

### Étape 6 : Testez l'accès public

**Pourquoi**
Vérifiez si le tunnel fonctionne normalement.

#### Vérification de santé

::: code-group

```bash [macOS/Linux]
#Remplacez par votre URL de tunnel réelle
curl -s "https://your-url.trycloudflare.com/healthz"
```

```powershell [Windows]
Invoke-RestMethod "https://your-url.trycloudflare.com/healthz"
```

:::

**Vous devriez voir** : `{"status":"ok"}`

#### Requête de liste de modèles

::: code-group

```bash [macOS/Linux]
#Si vous avez activé l'authentification, remplacez <proxy_api_key> par votre clé
curl -s \
  -H "Authorization: Bearer <proxy_api_key>" \
  "https://your-url.trycloudflare.com/v1/models"
```

```powershell [Windows]
Invoke-RestMethod \
  -Headers @{ Authorization = "Bearer <proxy_api_key>" } \
  "https://your-url.trycloudflare.com/v1/models"
```

:::

**Vous devriez voir** : JSON de liste de modèles renvoyé.

::: tip Note HTTPS
L'URL du tunnel utilise le protocole HTTPS, aucune configuration de certificat supplémentaire n'est nécessaire.
:::

#### Utilisation avec le SDK OpenAI (exemple)

```python
import openai

#Utilisez l'URL publique
client = openai.OpenAI(
    api_key="your-proxy-api-key",  # Si l'authentification est activée
    base_url="https://your-url.trycloudflare.com/v1"
)

#modelId est basé sur le retour réel de /v1/models

response = client.chat.completions.create(
    model="<modelId>",
    messages=[{"role": "user", "content": "你好"}]
)

print(response.choices[0].message.content)
```

::: warning Rappel d'authentification
Si vous avez activé l'authentification sur la page "API Proxy" (`proxy.auth_mode=strict/all_except_health`), les demandes doivent transporter l'API Key :
- Header : `Authorization: Bearer your-api-key`
- Ou : `x-api-key: your-api-key`
:::

### Étape 7 : Arrêtez le tunnel

**Pourquoi**
Fermez dès que vous avez terminé pour réduire le temps d'exposition de sécurité.

1. Cliquez sur l'interrupteur dans le coin supérieur droit de la carte (ou sur le bouton **"Stop Tunnel"** après développement)
2. Attendez l'arrêt (environ 2 secondes)

**Vous devriez voir** :
- Le point vert disparaît
- Le message **"Tunnel Stopped"**
- L'URL publique disparaît

## Point de contrôle ✅

Après avoir terminé les étapes ci-dessus, vous devriez être capable de :

- [ ] Installer le binaire Cloudflared
- [ ] Basculer entre les modes Quick et Auth
- [ ] Démarrer le tunnel et obtenir l'URL publique
- [ ] Appeler l'API locale via l'URL publique
- [ ] Arrêter le tunnel

## Rappels sur les pièges

### Problème 1 : Échec de l'installation (délai d'attente du téléchargement)

**Symptôme** : Pas de réponse pendant longtemps après avoir cliqué sur "Install" ou message d'échec du téléchargement.

**Cause** : Problèmes réseau (surtout l'accès aux GitHub Releases depuis la Chine continentale).

**Solution** :
1. Vérifiez la connexion réseau
2. Utilisez un VPN ou un proxy
3. Téléchargement manuel : [Cloudflared Releases](https://github.com/cloudflare/cloudflared/releases), choisissez la version de plate-forme correspondante, placez-la manuellement dans le dossier `bin` du répertoire de données, et donnez les droits d'exécution (macOS/Linux).

### Problème 2 : Échec du démarrage du tunnel

**Symptôme** : Après avoir cliqué sur Démarrer, l'URL ne s'affiche pas ou une erreur est signalée.

**Cause** :
- Token invalide en mode Auth
- Service de proxy inverse local non démarré
- Port occupé

**Solution** :
1. Mode Auth : Vérifiez si le Token est correct et s'il n'a pas expiré
2. Vérifiez si l'interrupteur de proxy inverse de la page "API Proxy" est activé
3. Vérifiez si le port `8045` est occupé par un autre programme

### Problème 3 : L'URL publique est inaccessible

**Symptôme** : curl ou SDK expirent lors de l'appel de l'URL publique.

**Cause** :
- Le processus tunnel a quitté inopinément
- Problèmes réseau Cloudflare
- Pare-feu local bloquant

**Solution** :
1. Vérifiez si la carte affiche "Tunnel Running"
2. Vérifiez si la carte a des messages d'erreur (texte rouge)
3. Vérifiez les paramètres du pare-feu local
4. Essayez de redémarrer le tunnel

### Problème 4 : Échec de l'authentification (401)

**Symptôme** : La demande renvoie une erreur 401.

**Cause** : Le proxy a activé l'authentification mais la demande ne transporte pas l'API Key.

**Solution** :
1. Vérifiez le mode d'authentification de la page "API Proxy"
2. Ajoutez le bon Header dans la demande :
   ```bash
   curl -H "Authorization: Bearer your-api-key" \
         https://your-url.trycloudflare.com/v1/models
   ```

## Résumé du cours

Le tunnel Cloudflared est un outil puissant pour exposer rapidement les services locaux. Avec ce cours, vous avez appris :

- **Installation en un clic** : Téléchargement et installation automatiques de Cloudflared dans l'interface utilisateur
- **Deux modes** : Choix entre Quick (temporaire) et Auth (nommé)
- **Accès public** : Copiez l'URL HTTPS, les appareils distants peuvent appeler directement
- **Conscience de sécurité** : Activez l'authentification, fermez après utilisation, vérifiez régulièrement les journaux

Souvenez-vous : **Le tunnel est une arme à double tranchant**, bien utilisé c'est pratique, mal utilisé c'est risqué. Suivez toujours le principe d'exposition minimale.

## Aperçu du prochain cours

Dans le prochain cours, nous apprendrons **[Configuration complète : AppConfig/ProxyConfig, emplacement de persistance et sémantique de mise à jour à chaud](/fr/lbjlaq/Antigravity-Manager/advanced/config/)**.

Vous apprendrez :
- Les champs complets de AppConfig et ProxyConfig
- L'emplacement de persistance du fichier de configuration
- Quelles configurations nécessitent un redémarrage, lesquelles peuvent être mises à jour à chaud

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer et voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonction | Chemin du fichier | Numéro de ligne |
| --- | --- | --- |
| Nom du répertoire de données (`.antigravity_tools`) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L33) | 16-33 |
| Structure de configuration et valeurs par défaut (`CloudflaredConfig`, `TunnelMode`) | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L16-L59) | 16-59 |
| Règles d'URL de téléchargement automatique (OS/architecture pris en charge) | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L70-L88) | 70-88 |
| Logique d'installation (téléchargement/écriture/extraction/autorisations) | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L147-L211) | 147-211 |
| Paramètres de démarrage Quick/Auth (`tunnel --url` vs `tunnel run --token`) | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L233-L266) | 233-266 |
| Règles d'extraction d'URL (identifie uniquement `*.trycloudflare.com`) | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L390-L413) | 390-413 |
| Interface de commande Tauri (check/install/start/stop/get_status) | [`src-tauri/src/commands/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/cloudflared.rs#L6-L118) | 6-118 |
| Carte d'interface utilisateur (mode/Token/HTTP2/affichage et copie d'URL) | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L1597-L1753) | 1597-1753 |
| Proxy Running requis avant le démarrage (toast + return) | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L256-L306) | 256-306 |

**Constantes clés** :
- `DATA_DIR = ".antigravity_tools"` : Nom du répertoire de données (source : `src-tauri/src/modules/account.rs`)

**Fonctions clés** :
- `get_download_url()` : Assemble l'adresse de téléchargement de GitHub Releases (source : `src-tauri/src/modules/cloudflared.rs`)
- `extract_tunnel_url()` : Extrait l'URL du mode Quick depuis les journaux (source : `src-tauri/src/modules/cloudflared.rs`)

</details>

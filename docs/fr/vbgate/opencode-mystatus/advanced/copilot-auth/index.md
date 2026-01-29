---
title: "Auth Copilot: OAuth et PAT | opencode-mystatus"
sidebarTitle: "Auth Copilot"
subtitle: "Configuration de l'authentification Copilot : Jeton OAuth et Fine-grained PAT"
description: "Apprenez à configurer l'authentification GitHub Copilot avec OAuth et Fine-grained PAT. Résolvez les problèmes d'autorisation et interrogez le quota Premium Requests avec succès."
tags:
  - "GitHub Copilot"
  - "Authentification OAuth"
  - "Configuration PAT"
  - "Problèmes d'autorisation"
prerequisite:
  - "start-quick-start"
  - "platforms-copilot-usage"
order: 2
---

# Configuration de l'authentification Copilot : Jeton OAuth et Fine-grained PAT

## Ce que vous apprendrez

- Comprendre les deux méthodes d'authentification Copilot : Jeton OAuth et Fine-grained PAT
- Résoudre les problèmes d'autorisation insuffisante du jeton OAuth
- Créer un PAT Fine-grained et configurer le type d'abonnement
- Interroger avec succès le quota Premium Requests de Copilot

## Votre problème actuel

Lorsque vous exécutez `/mystatus` pour interroger le quota Copilot, vous pouvez voir ce message d'erreur :

```
⚠️ L'interrogation du quota GitHub Copilot est temporairement indisponible.
La nouvelle intégration OAuth d'OpenCode ne prend pas en charge l'accès à l'API de quota.

Solution :
1. Créez un PAT fine-grained (visitez https://github.com/settings/tokens?type=beta)
2. Définissez 'Plan' sur 'Read-only' dans 'Account permissions'
3. Créez le fichier de configuration ~/.config/opencode/copilot-quota-token.json :
   {"token": "github_pat_xxx...", "username": "votre_nom_utilisateur"}
```

Vous ne savez pas :
- Qu'est-ce qu'un jeton OAuth ? Qu'est-ce qu'un PAT Fine-grained ?
- Pourquoi l'intégration OAuth ne prend-elle pas en charge l'accès à l'API de quota ?
- Comment créer un PAT Fine-grained ?
- Comment choisir le type d'abonnement (free, pro, pro+, etc.) ?

Ces problèmes vous empêchent de voir le quota Copilot.

## Quand utiliser cette méthode

Lorsque vous :
- Voyez le message "La nouvelle intégration OAuth d'OpenCode ne prend pas en charge l'accès à l'API de quota"
- Voulez utiliser la méthode PAT Fine-grained plus stable pour interroger le quota
- Besoin de configurer l'interrogation du quota Copilot pour des comptes d'équipe ou d'entreprise

## Concept clé

mystatus prend en charge **deux méthodes d'authentification Copilot** :

| Méthode d'authentification | Description | Avantages | Inconvénients |
|--- | --- | --- | ---|
| **Jeton OAuth** (par défaut) | Utilise le jeton OAuth GitHub obtenu lors de la connexion à OpenCode | Aucune configuration supplémentaire, prêt à l'emploi | Le nouveau jeton OAuth d'OpenCode peut ne pas avoir les autorisations Copilot |
| **Fine-grained PAT** (recommandé) | Jeton d'accès personnel Fine-grained créé manuellement par l'utilisateur | Stable et fiable, ne dépend pas des autorisations OAuth | Nécessite une création manuelle une fois |

**Règle de priorité** :
1. mystatus utilise en priorité le PAT Fine-grained (si configuré)
2. Si aucun PAT n'est configuré, il revient au jeton OAuth

::: tip Approche recommandée
Si votre jeton OAuth a des problèmes d'autorisation, créer un PAT Fine-grained est la solution la plus stable.
:::

### Différence entre les deux méthodes

**Jeton OAuth** :
- Emplacement de stockage : `~/.local/share/opencode/auth.json`
- Méthode d'obtention : Obtenu automatiquement lors de la connexion à GitHub dans OpenCode
- Problème d'autorisation : La nouvelle version d'OpenCode utilise un client OAuth différent qui peut ne pas accorder les autorisations Copilot

**Fine-grained PAT** :
- Emplacement de stockage : `~/.config/opencode/copilot-quota-token.json`
- Méthode d'obtention : Créé manuellement dans les paramètres développeur GitHub
- Exigence d'autorisation : Nécessite de cocher l'autorisation de lecture pour "Plan" (informations d'abonnement)

## Suivez les étapes

### Étape 1 : Vérifier si un PAT Fine-grained est déjà configuré

Exécutez la commande suivante dans le terminal pour vérifier si le fichier de configuration existe :

::: code-group

```bash [macOS/Linux]
ls -la ~/.config/opencode/copilot-quota-token.json
```

```powershell [Windows]
Test-Path "$env:APPDATA\opencode\copilot-quota-token.json"
```

:::

**Ce que vous devriez voir** :
- Si le fichier existe, cela signifie qu'un PAT Fine-grained est déjà configuré
- Si le fichier n'existe pas ou affiche une erreur, vous devez en créer un

### Étape 2 : Créer un PAT Fine-grained (si non configuré)

Si le fichier n'existe pas à l'étape précédente, créez-en un en suivant ces étapes :

#### 2.1 Accéder à la page de création de PAT GitHub

Dans votre navigateur, visitez :
```
https://github.com/settings/tokens?type=beta
```

C'est la page de création de PAT Fine-grained de GitHub.

#### 2.2 Créer un nouveau PAT Fine-grained

Cliquez sur **Generate new token (classic)** ou **Generate new token (beta)**, il est recommandé d'utiliser Fine-grained (beta).

**Paramètres de configuration** :

| Champ | Valeur |
|--- | ---|
| **Name** | `mystatus-copilot` (ou tout autre nom de votre choix) |
| **Expiration** | Choisissez la date d'expiration (comme 90 jours ou No expiration) |
| **Resource owner** | Non nécessaire (par défaut) |

**Configuration des autorisations** (important !) :

Dans la section **Account permissions**, cochez :
- ✅ **Plan** → Choisissez **Read** (cette autorisation est nécessaire pour interroger le quota)

::: warning Important
Ne cochez que l'autorisation de lecture "Plan", ne cochez pas d'autres autorisations inutiles pour protéger la sécurité de votre compte.
:::

**Ce que vous devriez voir** :
- "Plan: Read" est coché
- Aucune autre autorisation n'est cochée (respect du principe du moindre privilège)

#### 2.3 Générer et sauvegarder le jeton

Cliquez sur le bouton **Generate token** en bas de la page.

**Ce que vous devriez voir** :
- La page affiche le nouveau jeton généré (similaire à `github_pat_xxxxxxxxxxxx`)
- ⚠️ **Copiez immédiatement ce jeton**, vous ne pourrez plus le voir après le rafraîchissement de la page

### Étape 3 : Obtenir le nom d'utilisateur GitHub

Dans votre navigateur, visitez votre page d'accueil GitHub :
```
https://github.com/
```

**Ce que vous devriez voir** :
- Votre nom d'utilisateur s'affiche en haut à droite ou en haut à gauche (comme `john-doe`)

Notez ce nom d'utilisateur, vous en aurez besoin pour la configuration.

### Étape 4 : Déterminer le type d'abonnement Copilot

Vous devez connaître votre type d'abonnement Copilot, car différents types ont des quotas mensuels différents :

| Type d'abonnement | Quota mensuel | Scénario applicable |
|--- | --- | ---|
| `free` | 50 | Copilot Free (utilisateurs gratuits) |
| `pro` | 300 | Copilot Pro (professionnel personnel) |
| `pro+` | 1500 | Copilot Pro+ (personnel amélioré) |
| `business` | 300 | Copilot Business (équipe commerciale) |
| `enterprise` | 1000 | Copilot Enterprise (entreprise) |

::: tip Comment déterminer le type d'abonnement ?
1. Visitez la [page d'abonnement GitHub Copilot](https://github.com/settings/copilot)
2. Consultez le plan d'abonnement actuellement affiché
3. Choisissez le type correspondant dans le tableau ci-dessus
:::

### Étape 5 : Créer le fichier de configuration

Selon votre système d'exploitation, créez le fichier de configuration et renseignez les informations.

::: code-group

```bash [macOS/Linux]
mkdir -p ~/.config/opencode
cat > ~/.config/opencode/copilot-quota-token.json << 'EOF'
{
  "token": "votre_PAT_Token",
  "username": "votre_nom_utilisateur_GitHub",
  "tier": "type_d_abonnement"
}
EOF
```

```powershell [Windows]
# Créer le répertoire (s'il n'existe pas)
New-Item -ItemType Directory -Force -Path "$env:APPDATA\opencode" | Out-Null

# Créer le fichier de configuration
@"
{
  "token": "votre_PAT_Token",
  "username": "votre_nom_utilisateur_GitHub",
  "tier": "type_d_abonnement"
}
"@ | Out-File -FilePath "$env:APPDATA\opencode\copilot-quota-token.json" -Encoding utf8
```

:::

**Exemple de configuration** :

Supposons que votre PAT est `github_pat_abc123`, votre nom d'utilisateur est `johndoe`, et votre type d'abonnement est `pro` :

```json
{
  "token": "github_pat_abc123",
  "username": "johndoe",
  "tier": "pro"
}
```

::: danger Rappel de sécurité
- Ne soumettez pas le jeton au dépôt Git ou ne le partagez avec d'autres personnes
- Le jeton est un certificat d'accès à votre compte GitHub, sa divulgation peut entraîner des problèmes de sécurité
:::

### Étape 6 : Vérifier la configuration

Exécutez la commande `/mystatus` dans OpenCode.

**Ce que vous devriez voir** :
- La section Copilot affiche normalement les informations de quota
- Aucun message d'erreur d'autorisation n'apparaît
- Affiche un contenu similaire à :

```
## GitHub Copilot Account Quota

Account:        GitHub Copilot (@johndoe)

Premium requests
███████████████████░░░░░░░ 70% (90/300)

Period: 2026-01
```

## Point de vérification ✅

Vérifiez votre compréhension :

| Scénario | Ce que vous devriez voir/faire |
|--- | ---|
| Le fichier de configuration existe | `ls ~/.config/opencode/copilot-quota-token.json` affiche le fichier |
| PAT créé avec succès | Le jeton commence par `github_pat_` |
| Type d'abonnement correct | La valeur `tier` dans la configuration est l'une de free/pro/pro+/business/enterprise |
| Vérification réussie | Exécutez `/mystatus` et voyez les informations de quota Copilot |

## Pièges courants

### ❌ Erreur courante : Oublier de cocher l'autorisation "Plan: Read"

**Phénomène d'erreur** : Lors de l'exécution de `/mystatus`, vous voyez une erreur API (403 ou 401)

**Cause** : Les autorisations nécessaires n'ont pas été cochées lors de la création du PAT.

**Solution correcte** :
1. Supprimez l'ancien jeton (dans les paramètres GitHub)
2. Recréez-le en vous assurant de cocher **Plan: Read**
3. Mettez à jour le champ `token` dans le fichier de configuration

### ❌ Erreur courante : Type d'abonnement incorrect

**Phénomène d'erreur** : Le quota s'affiche de manière incorrecte (par exemple, un utilisateur Free affiche un quota de 300)

**Cause** : Le champ `tier` a été mal rempli (par exemple, `pro` a été rempli alors que c'est en réalité `free`).

**Solution correcte** :
1. Visitez la page des paramètres GitHub Copilot pour confirmer le type d'abonnement
2. Modifiez le champ `tier` dans le fichier de configuration

### ❌ Erreur courante : Jeton expiré

**Phénomène d'erreur** : Lors de l'exécution de `/mystatus`, vous voyez une erreur 401

**Cause** : Le PAT Fine-grained a une date d'expiration et a expiré.

**Solution correcte** :
1. Visitez les paramètres GitHub → page des jetons
2. Trouvez le jeton expiré et supprimez-le
3. Créez un nouveau jeton et mettez à jour le fichier de configuration

### ❌ Erreur courante : Erreur de casse du nom d'utilisateur

**Phénomène d'erreur** : Vous voyez une erreur 404 ou utilisateur introuvable

**Cause** : Les noms d'utilisateur GitHub sont sensibles à la casse (par exemple, `Johndoe` et `johndoe` sont des utilisateurs différents).

**Solution correcte** :
1. Copiez le nom d'utilisateur affiché sur la page d'accueil GitHub (exactement identique)
2. Ne saisissez pas manuellement pour éviter les erreurs de casse

::: tip Astuce
Si vous rencontrez une erreur 404, copiez le nom d'utilisateur directement depuis l'URL GitHub, par exemple visitez `https://github.com/YourName`, le `YourName` dans l'URL est votre nom d'utilisateur.
:::

## Résumé de cette leçon

mystatus prend en charge deux méthodes d'authentification Copilot :

1. **Jeton OAuth** (par défaut) : Obtenu automatiquement, mais peut avoir des problèmes d'autorisation
2. **Fine-grained PAT** (recommandé) : Configuré manuellement, stable et fiable

Étapes recommandées pour configurer un PAT Fine-grained :
1. Créez un PAT Fine-grained dans les paramètres GitHub
2. Cochez l'autorisation "Plan: Read"
3. Notez le nom d'utilisateur GitHub et le type d'abonnement
4. Créez le fichier de configuration `~/.config/opencode/copilot-quota-token.json`
5. Vérifiez que la configuration est réussie

Une fois la configuration terminée, mystatus utilisera en priorité le PAT pour interroger le quota Copilot, évitant les problèmes d'autorisation OAuth.

## Prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[Support multilingue : basculement automatique entre le chinois et l'anglais](../i18n-setup/)**.
>
> Vous apprendrez :
> - Mécanisme de détection de langue (API Intl, variables d'environnement)
> - Comment basculer manuellement la langue
> - Tableau de correspondance chinois-anglais

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour afficher l'emplacement du code source</strong></summary>

> Date de mise à jour : 2026-01-23

| Fonction | Chemin du fichier | Ligne |
|--- | --- | ---|
| Point d'entrée de la stratégie d'authentification Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L481-L524) | 481-524 |
|--- | --- | ---|
| Appel de l'API Billing publique | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L157-L177) | 157-177 |
| Échange de jeton OAuth | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L183-L208) | 183-208 |
| Appel de l'API interne (OAuth) | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L242-L304) | 242-304 |
| Formatage de la sortie de l'API Billing publique | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L410-L468) | 410-468 |
| Définition de type CopilotAuthData | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L46-L51) | 46-51 |
| Définition de type CopilotQuotaConfig | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L66-L73) | 66-73 |
| Définition d'énumération CopilotTier | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L57) | 57 |
| Quota de type d'abonnement Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L397-L403) | 397-403 |

**Constantes clés** :
- `COPILOT_QUOTA_CONFIG_PATH = "~/.config/opencode/copilot-quota-token.json"` : Chemin du fichier de configuration PAT Fine-grained
- `COPILOT_PLAN_LIMITS` : Limites de quota mensuelles pour chaque type d'abonnement (lignes 397-403)

**Fonctions clés** :
- `queryCopilotUsage(authData)` : Fonction principale d'interrogation du quota Copilot, contient deux stratégies d'authentification
- `readQuotaConfig()` : Lit le fichier de configuration PAT Fine-grained
- `fetchPublicBillingUsage(config)` : Appelle l'API Billing publique GitHub (utilise PAT)
- `fetchCopilotUsage(authData)` : Appelle l'API interne GitHub (utilise jeton OAuth)
- `exchangeForCopilotToken(oauthToken)` : Échange le jeton OAuth contre un jeton de session Copilot
- `formatPublicBillingUsage(data, tier)` : Formate la réponse de l'API Billing publique
- `formatCopilotUsage(data)` : Formate la réponse de l'API interne

**Comparaison du flux d'authentification** :

| Stratégie | Type de jeton | Point de terminaison API | Priorité |
|--- | --- | --- | ---|
| Fine-grained PAT | PAT Fine-grained | `/users/{username}/settings/billing/premium_request/usage` | 1 (prioritaire) |
| Jeton OAuth (mis en cache) | Jeton de session Copilot | `/copilot_internal/user` | 2 |
| Jeton OAuth (direct) | Jeton OAuth GitHub | `/copilot_internal/user` | 3 |
| Jeton OAuth (échange) | Jeton de session Copilot (après échange) | `/copilot_internal/v2/token` | 4 |

</details>

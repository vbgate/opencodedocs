---
title: "Configuration multi-comptes : Regroupement de quotas et équilibrage de charge | opencode-antigravity-auth"
sidebarTitle: "Essayez plusieurs comptes"
subtitle: "Configuration multi-comptes : Regroupement de quotas et équilibrage de charge"
description: "Apprenez à configurer plusieurs comptes Google pour réaliser le regroupement de quotas et l'équilibrage de charge. Maîtrisez le système de quotas dual, les stratégies de sélection de compte et la configuration du décalage PID pour maximiser l'utilisation des quotas d'API."
tags:
  - "advanced"
  - "multi-account"
  - "load-balancing"
  - "quota-management"
prerequisite:
  - "start-quick-install"
  - "start-first-auth-login"
order: 4
---

# Configuration multi-comptes : Regroupement de quotas et équilibrage de charge

## Ce que vous serez capable de faire après cette leçon

- Ajouter plusieurs comptes Google pour augmenter la limite totale de quotas
- Comprendre le système de quotas dual et utiliser efficacement les pools de quotas Antigravity et Gemini CLI
- Choisir la stratégie d'équilibrage de charge appropriée en fonction du nombre de comptes et des scénarios d'utilisation
- Dépanner les problèmes courants liés à la configuration multi-comptes

## Le problème auquel vous êtes confronté actuellement

Lorsque vous utilisez un seul compte, vous pouvez rencontrer ces points de douleur :

- Vous rencontrez fréquemment des erreurs 429 de limitation de taux et devez attendre la récupération du quota
- Dans les scénarios de développement/test, il y a trop de requêtes concurrentes qu'un seul compte ne peut gérer
- Après avoir épuisé le quota des modèles Gemini 3 Pro ou Claude Opus, vous devez attendre le lendemain
- Lors de l'exécution parallèle de plusieurs instances OpenCode ou de sous-agents oh-my-opencode, il y a une concurrence intense entre les comptes

## Quand utiliser cette technique

La configuration multi-comptes convient aux scénarios suivants :

| Scénario | Nombre de comptes recommandé | Raison |
|---|---|---|
| Développement personnel | 2-3 | Comptes de secours pour éviter les interruptions |
| Collaboration d'équipe | 3-5 | Répartition des requêtes, réduction de la concurrence |
| Appels API à haute fréquence | 5+ | Équilibrage de charge, maximisation du débit |
| Agents parallèles | 3+ avec décalage PID | Chaque agent utilise un compte indépendant |

::: warning Vérifications préalables
Avant de commencer ce tutoriel, assurez-vous d'avoir terminé :
- ✅ Installation du plugin opencode-antigravity-auth
- ✅ Authentification OAuth réussie et ajout du premier compte
- ✅ Possibilité de lancer des requêtes avec les modèles Antigravity

[Tutoriel d'installation rapide](../../start/quick-install/) | [Tutoriel de première connexion](../../start/first-auth-login/)
:::

## Concept de base

Le mécanisme central de la configuration multi-comptes :

1. **Regroupement de quotas** : Chaque compte Google dispose d'un quota indépendant, et les quotas de plusieurs comptes se combinent pour former un pool total plus grand
2. **Équilibrage de charge** : Le plugin sélectionne automatiquement les comptes disponibles et passe au compte suivant en cas de limitation de taux
3. **Système de quotas dual** (Gemini uniquement) : Chaque compte peut accéder à deux pools de quotas indépendants, Antigravity et Gemini CLI
4. **Récupération intelligente** : Déduplication des limitations de taux (fenêtre de 2 secondes) + backoff exponentiel pour éviter les tentatives inutiles

**Exemple de calcul des quotas** :

Supposons que le quota Claude de chaque compte soit de 1000 requêtes/minute :

| Nombre de comptes | Quota total théorique | Quota réellement disponible (en tenant compte du cache) |
|---|---|---|
| 1 | 1000/min | 1000/min |
| 3 | 3000/min | ~2500/min (stratégie sticky) |
| 5 | 5000/min | ~4000/min (round-robin) |

> 💡 **Pourquoi la stratégie sticky a-t-elle un quota disponible plus faible ?**
>
> La stratégie sticky continue d'utiliser le même compte jusqu'à atteindre la limitation de taux, ce qui fait que les quotas des autres comptes restent inutilisés. Mais cela a l'avantage de préserver le cache de prompts d'Anthropic, améliorant la vitesse de réponse.

## Suivez-moi

### Étape 1 : Ajouter un deuxième compte

**Pourquoi**
Après avoir ajouté un deuxième compte, lorsque le compte principal rencontre une limitation de taux, le plugin passera automatiquement au compte de secours, évitant ainsi l'échec des requêtes.

**Opération**

Exécutez la commande de connexion OAuth :

```bash
opencode auth login
```

Si vous avez déjà un compte, vous verrez l'invite suivante :

```
1 account(s) saved:
  1. user1@gmail.com

(a)dd new account(s) or (f)resh start? [a/f]:
```

Entrez `a` et appuyez sur Entrée, le navigateur ouvrira automatiquement la page d'autorisation Google.

**Vous devriez voir** :

1. Le navigateur ouvre la page d'autorisation OAuth de Google
2. Sélectionnez ou connectez-vous à votre deuxième compte Google
3. Après avoir donné votre consentement, le terminal affichera :

```
Account added successfully!

2 account(s) saved:
  1. user1@gmail.com
  2. user2@gmail.com
```

::: tip
Si le navigateur ne s'ouvre pas automatiquement, copiez l'URL OAuth affichée dans le terminal et collez-la manuellement dans votre navigateur.
:::

### Étape 2 : Vérifier l'état des comptes multiples

**Pourquoi**
Confirmer que les comptes ont été correctement ajoutés et sont disponibles.

**Opération**

Affichez le fichier de stockage des comptes :

```bash
cat ~/.config/opencode/antigravity-accounts.json
```

**Vous devriez voir** :

```json
{
  "version": 3,
  "accounts": [
    {
      "email": "user1@gmail.com",
      "refreshToken": "1//0abc...",
      "projectId": "project-id-123",
      "addedAt": 1737609600000,
      "lastUsed": 1737609600000
    },
    {
      "email": "user2@gmail.com",
      "refreshToken": "1//0xyz...",
      "addedAt": 1737609700000,
      "lastUsed": 1737609700000
    }
  ],
  "activeIndex": 0,
  "activeIndexByFamily": {
    "claude": 0,
    "gemini": 0
  }
}
```

::: warning Rappel de sécurité
Le fichier `antigravity-accounts.json` contient des refresh tokens OAuth, équivalents à un mot de passe. Ne le commitez pas dans un système de contrôle de version.
:::

### Étape 3 : Tester la bascule entre comptes

**Pourquoi**
Vérifier que l'équilibrage de charge multi-comptes fonctionne correctement.

**Opération**

Envoyez plusieurs requêtes simultanées pour déclencher la limitation de taux :

```bash
# macOS/Linux
for i in {1..10}; do
  opencode run "Test $i" --model=google/antigravity-claude-sonnet-4-5 &
done
wait

# Windows PowerShell
1..10 | ForEach-Object {
  Start-Process -FilePath "opencode" -ArgumentList "run","Test $_","--model=google/antigravity-claude-sonnet-4-5"
}
```

**Vous devriez voir** :

1. Les N premières requêtes utilisent le compte 1 (user1@gmail.com)
2. Après une erreur 429, bascule automatiquement vers le compte 2 (user2@gmail.com)
3. Si les notifications sont activées, vous verrez un toast "Switched to account 2"

::: info Notification de bascule de compte
Si `quiet_mode: false` est activé (par défaut), le plugin affichera les notifications de bascule de compte. Le premier affichage montrera l'adresse e-mail, les suivants n'afficheront que l'index du compte.
:::

### Étape 4 : Configurer le système de quotas dual (Spécifique à Gemini)

**Pourquoi**
Après avoir activé le fallback de quotas dual, lorsque le quota Antigravity est épuisé, le plugin tentera automatiquement d'utiliser le quota Gemini CLI sans changer de compte.

**Opération**

Modifiez le fichier de configuration du plugin :

```bash
# macOS/Linux
nano ~/.config/opencode/antigravity.json

# Windows
notepad %APPDATA%\opencode\antigravity.json
```

Ajoutez la configuration suivante :

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "quota_fallback": true
}
```

Sauvegardez le fichier et redémarrez OpenCode.

**Vous devriez voir** :

1. Lors de l'utilisation de modèles Gemini, le plugin privilégie d'abord le quota Antigravity
2. Lorsque Antigravity retourne une erreur 429, bascule automatiquement vers le quota Gemini CLI du même compte
3. Si les deux quotas sont limités, passe alors au compte suivant

::: tip Quotas dual vs Multi-comptes
- **Quotas dual** : Deux pools de quotas indépendants pour un même compte (Antigravity + Gemini CLI)
- **Multi-comptes** : Superposition des pools de quotas de plusieurs comptes
- Bonne pratique : Activez d'abord les quotas dual, puis ajoutez plusieurs comptes
:::

### Étape 5 : Choisir la stratégie de sélection de compte

**Pourquoi**
Différents nombres de comptes et scénarios d'utilisation nécessitent différentes stratégies pour atteindre des performances optimales.

**Opération**

Configurez la stratégie dans `antigravity.json` :

```json
{
  "account_selection_strategy": "hybrid"
}
```

Choisissez en fonction du nombre de comptes :

| Nombre de comptes | Stratégie recommandée | Valeur de configuration | Raison |
|---|---|---|---|
| 1 | sticky | `"sticky"` | Préserver le cache de prompts |
| 2-5 | hybrid | `"hybrid"` | Équilibre entre débit et cache |
| 5+ | round-robin | `"round-robin"` | Maximiser le débit |

**Détails des stratégies** :

- **sticky** (par défaut mono-compte) : Continue à utiliser le même compte jusqu'à la limitation de taux, adapté aux sessions de développement individuelles
- **round-robin** : Alterne vers le compte suivant pour chaque requête, maximise le débit mais sacrifice le cache
- **hybrid** (par défaut multi-comptes) : Décision combinée basée sur le score de santé + Token bucket + LRU

**Vous devriez voir** :

1. Avec la stratégie `hybrid`, le plugin sélectionne automatiquement le compte optimal actuel
2. Avec la stratégie `round-robin`, les requêtes sont réparties uniformément entre tous les comptes
3. Avec la stratégie `sticky`, la même session utilise toujours le même compte

### Étape 6 : Activer le décalage PID (scénarios d'agents parallèles)

**Pourquoi**
Lors de l'exécution de plusieurs instances OpenCode ou d'agents parallèles oh-my-opencode, différents processus peuvent sélectionner le même compte, provoquant une contention.

**Opération**

Ajoutez dans `antigravity.json` :

```json
{
  "pid_offset_enabled": true
}
```

Sauvegardez et redémarrez OpenCode.

**Vous devriez voir** :

1. Différents processus (PID différents) commencent à partir d'indices de compte différents
2. La contention de compte entre agents parallèles est réduite
3. Le débit global est amélioré

::: tip Fonctionnement du décalage PID
Le décalage PID mappe l'ID de processus à un décalage de compte, par exemple :
- PID 100 → Décalage 0 → Commence au compte 0
- PID 101 → Décalage 1 → Commence au compte 1
- PID 102 → Décalage 2 → Commence au compte 2
:::

## Points de contrôle ✅

Après avoir terminé les étapes ci-dessus, vous devriez être capable de :

- [ ] Ajouter plusieurs comptes Google via `opencode auth login`
- [ ] Voir plusieurs enregistrements de comptes dans `antigravity-accounts.json`
- [ ] Le plugin bascule automatiquement vers le compte suivant lors d'une limitation de taux
- [ ] Les modèles Gemini ont activé le fallback de quotas dual
- [ ] Choisir la stratégie de sélection de compte appropriée en fonction du nombre de comptes
- [ ] Activer le décalage PID dans les scénarios d'agents parallèles

## Avertissements sur les pièges

### Tous les comptes sont limités

**Symptômes** : Tous les comptes affichent une erreur 429, impossible de continuer les requêtes

**Cause** : Quotas épuisés ou trop de requêtes concurrentes

**Solutions** :

1. Attendez que la limitation de taux se réinitialise automatiquement (généralement 1-5 minutes)
2. Si le problème persiste, ajoutez plus de comptes
3. Vérifiez `max_rate_limit_wait_seconds` dans la configuration et définissez une limite d'attente raisonnable

### Basculement de compte trop fréquent

**Symptômes** : Chaque requête bascule de compte, sans utiliser le même compte

**Cause** : Mauvais choix de stratégie ou score de santé anormal

**Solutions** :

1. Changez la stratégie en `sticky`
2. Vérifiez la configuration `health_score`, ajustez `min_usable` et `rate_limit_penalty`
3. Confirmez qu'il n'y a pas d'erreurs 429 fréquentes causant le marquage des comptes comme non sains

### Erreur de permission Gemini CLI (403)

**Symptômes** : Lors de l'utilisation des modèles Gemini CLI, une erreur `Permission denied` est retournée

**Cause** : Le compte manque d'un Project ID valide

**Solutions** :

1. Ajoutez manuellement un `projectId` pour chaque compte :

```json
{
  "accounts": [
    {
      "email": "your@email.com",
      "refreshToken": "...",
      "projectId": "your-project-id"
    }
  ]
}
```

2. Assurez-vous d'avoir activé l'API Gemini for Google Cloud dans la [Google Cloud Console](https://console.cloud.google.com/)

### Jeton invalide (invalid_grant)

**Symptômes** : Le compte est automatiquement supprimé, affichant une erreur `invalid_grant`

**Cause** : Changement de mot de passe du compte Google, événement de sécurité ou expiration du jeton

**Solutions** :

1. Supprimez le compte invalide et ré-authentifiez :

```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```

2. Si cela se produit fréquemment, envisagez d'utiliser un compte Google plus stable

## Résumé de la leçon

- La configuration multi-comptes peut augmenter la limite totale de quotas et la stabilité du système
- L'ajout de comptes est très simple, il suffit d'exécuter `opencode auth login` plusieurs fois
- Le système de quotas dual double le quota disponible pour chaque compte Gemini
- La stratégie de sélection de compte doit être ajustée en fonction du nombre de comptes et des scénarios d'utilisation
- Le décalage PID est crucial pour les scénarios d'agents parallèles

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[Stratégies de sélection de compte](../account-selection-strategies/)**.
>
> Vous apprendrez :
> - Le fonctionnement détaillé des trois stratégies : sticky, round-robin et hybrid
> - Comment choisir la stratégie optimale selon le scénario
> - Les méthodes d'optimisation du score de santé et du Token bucket

---

## Annexe : Références du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Lignes |
|---|---|---|
| Classe AccountManager | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L174-L250) | 174-250 |
| Stratégies d'équilibrage de charge | [`src/plugin/rotation.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/rotation.ts) | Ensemble |
| Schéma de configuration | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | Ensemble |
| Stockage des comptes | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts) | Ensemble |

**Constantes clés** :

| Nom de la constante | Valeur | Description |
|---|---|---|
| `QUOTA_EXHAUSTED_BACKOFFS` | `[60000, 300000, 1800000, 7200000]` | Temps de backoff après épuisement du quota (1min → 5min → 30min → 2h) |
| `RATE_LIMIT_EXCEEDED_BACKOFF` | `30000` | Temps de backoff après dépassement de la limite de taux (30s) |
| `MIN_BACKOFF_MS` | `2000` | Temps de backoff minimum (2s) |

**Fonctions clés** :

- `calculateBackoffMs(reason, consecutiveFailures, retryAfterMs)` : Calcule le délai de backoff
- `getQuotaKey(family, headerStyle, model)` : Génère la clé de quota (supporte la limitation au niveau du modèle)
- `isRateLimitedForQuotaKey(account, key)` : Vérifie si une clé de quota spécifique est limitée
- `selectHybridAccount(accounts, family)` : Logique de sélection de compte pour la stratégie hybrid

**Éléments de configuration** (de schema.ts) :

| Élément de configuration | Type | Valeur par défaut | Description |
|---|---|---|---|
| `account_selection_strategy` | enum | `"hybrid"` | Stratégie de sélection de compte |
| `quota_fallback` | boolean | `false` | Activer le fallback de quotas dual Gemini |
| `pid_offset_enabled` | boolean | `false` | Activer le décalage PID |
| `switch_on_first_rate_limit` | boolean | `true` | Basculer immédiatement à la première limitation de taux |

</details>

---
title: "Stratégies de Sélection de Compte: Configuration du Multi-Compte | Antigravity Auth"
sidebarTitle: "Choisir la bonne stratégie pour ne pas gaspiller les quotas"
subtitle: "Stratégies de sélection de compte : sticky, round-robin, hybrid - meilleures pratiques"
description: "Apprenez les trois stratégies de sélection de compte : sticky, round-robin, hybrid. Choisissez la meilleure configuration selon le nombre de comptes, optimisez l'utilisation des quotas et la répartition des requêtes, évitez le rate limiting."
tags:
  - "multi-compte"
  - "load-balancing"
  - "configuration"
  - "avancé"
prerequisite:
  - "advanced-multi-account-setup"
order: 10
---

# Stratégies de sélection de compte : sticky, round-robin, hybrid - meilleures pratiques

## Ce que vous allez apprendre

Selon le nombre de vos comptes Google et votre cas d'usage, choisissez et configurez la stratégie de sélection de compte appropriée :

- 1 compte → utilisez la stratégie `sticky` pour conserver le cache du prompt
- 2-3 comptes → utilisez la stratégie `hybrid` pour une distribution intelligente des requêtes
- 4+ comptes → utilisez la stratégie `round-robin` pour maximiser le débit

Évitez la situation embarrassante où "tous les comptes sont limités, mais les quotas réels ne sont pas épuisés".

## Votre situation actuelle

Vous avez configuré plusieurs comptes Google, mais :

- Vous ne savez pas quelle stratégie utiliser pour maximiser l'utilisation des quotas
- Vous rencontrez souvent le problème où tous les comptes sont limités, mais le quota d'un compte spécifique n'est pas encore épuisé
- Dans les scénarios avec des agents parallèles, plusieurs processus enfants utilisent toujours le même compte, entraînant un rate limiting

## Concepts fondamentaux

### Qu'est-ce qu'une stratégie de sélection de compte

Le plugin Antigravity Auth prend en charge trois stratégies de sélection de compte, qui déterminent comment distribuer les requêtes de modèles entre plusieurs comptes Google :

| Stratégie | Comportement | Cas d'usage |
| --- | --- | --- |
| `sticky` | Continue d'utiliser le même compte sauf si celui-ci est limité | Mono-compte, nécessite le cache du prompt |
| `round-robin` | Passe au compte disponible suivant à chaque requête | Multi-compte, maximise le débit |
| `hybrid` (par défaut) | Sélection intelligente combinant health score + Token bucket + LRU | 2-3 comptes, équilibre performance et stabilité |

::: info Pourquoi avoir besoin d'une stratégie ?
Google applique des limites de débit à chaque compte. Si vous n'avez qu'un seul compte, les requêtes fréquentes peuvent facilement être limitées. Les multi-comptes permettent de distribuer les requêtes via une rotation ou une sélection intelligente, évitant qu'un seul compte consomme excessivement le quota.
:::

### Fonctionnement des trois stratégies

#### 1. Stratégie Sticky (Collante)

**Logique principale** : Conserve le compte actuel jusqu'à ce qu'il soit limité.

**Avantages** :

- Conserve le cache du prompt, les réponses avec le même contexte sont plus rapides
- Le modèle d'utilisation du compte est stable, moins susceptible de déclencher le contrôle de risque

**Inconvénients** :

- Utilisation inéquilibrée des quotas multi-comptes
- Impossible d'utiliser d'autres comptes avant la récupération du rate limiting

**Cas d'usage** :

- Un seul compte
- Importance accordée au cache du prompt (comme les conversations longues)

#### 2. Stratégie Round-Robin (Rotation)

**Logique principale** : Passe au compte disponible suivant à chaque requête, en boucle.

**Avantages** :

- Utilisation la plus équilibrée des quotas
- Maximise le débit concurrent
- Adapté aux scénarios à haute concurrence

**Inconvénients** :

- Ne considère pas la santé du compte, peut choisir un compte qui vient de récupérer d'un rate limiting
- Impossible d'exploiter le cache du prompt

**Cas d'usage** :

- 4 comptes ou plus
- Tâches par lots nécessitant un débit maximal
- Scénarios avec agents parallèles (avec `pid_offset_enabled`)

#### 3. Stratégie Hybrid (Hybride, par défaut)

**Logique principale** : Considère trois facteurs pour choisir le compte optimal :

**Formule de score** :

```
Score total = Score santé × 2 + Score Token × 5 + Score fraîcheur × 0.1
```

- **Score santé** (0-200) : Basé sur l'historique de succès/échec du compte
  - Requête réussie : +1 point
  - Rate limiting : -10 points
  - Autre échec (authentification, réseau) : -20 points
  - Valeur initiale : 70 points, minimum 0, maximum 100 points
  - Récupère 2 points par heure (même sans utilisation)

- **Score Token** (0-500) : Basé sur l'algorithme Token bucket
  - Chaque compte a maximum 50 tokens, initialisé à 50 tokens
  - Récupère 6 tokens par minute
  - Chaque requête consomme 1 token
  - Score Token = (tokens actuels / 50) × 100 × 5

- **Score fraîcheur** (0-360) : Basé sur le temps écoulé depuis la dernière utilisation
  - Plus le temps écoulé est long, plus le score est élevé
  - Atteint le maximum après 3600 secondes (1 heure)

**Avantages** :

- Évite intelligemment les comptes avec une faible santé
- Le Token bucket évite le rate limiting causé par des requêtes denses
- LRU (priorité au moins récemment utilisé) donne aux comptes un temps de repos suffisant
- Considère de manière équilibrée la performance et la stabilité

**Inconvénients** :

- Algorithme plus complexe, moins intuitif que round-robin
- Effet moins visible avec 2 comptes

**Cas d'usage** :

- 2-3 comptes (stratégie par défaut)
- Besoin d'équilibrer l'utilisation des quotas et la stabilité

### Tableau de choix rapide des stratégies

Selon les recommandations du README et du CONFIGURATION.md :

| Votre configuration | Stratégie recommandée | Raison |
| --- | --- | ---|
| **1 compte** | `sticky` | Pas besoin de rotation, conserve le cache du prompt |
| **2-3 comptes** | `hybrid` (par défaut) | Rotation intelligente, évite un rate limiting excessif |
| **4+ comptes** | `round-robin` | Maximise le débit, utilisation la plus équilibrée des quotas |
| **Agents parallèles** | `round-robin` + `pid_offset_enabled: true` | Différents processus utilisent différents comptes |

## 🎒 Avant de commencer

::: warning Vérifications préalables
Assurez-vous d'avoir terminé :

- [x] Configuration multi-compte (au moins 2 comptes Google)
- [x] Compréhension du [système de quotas dual](/fr/NoeFabris/opencode-antigravity-auth/platforms/dual-quota-system/)
  :::

## Suivez-moi

### Étape 1 : Vérifier la configuration actuelle

**Pourquoi**
Comprendre l'état actuel de la configuration pour éviter les modifications redondantes.

**Action**

Vérifiez votre fichier de configuration du plugin :

```bash
cat ~/.config/opencode/antigravity.json
```

**Vous devriez voir** :

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json"
}
```

Si le fichier n'existe pas, le plugin utilise la configuration par défaut (`account_selection_strategy` = `"hybrid"`).

### Étape 2 : Configurer la stratégie selon le nombre de comptes

**Pourquoi**
Différents nombres de comptes conviennent à différentes stratégies. Choisir la mauvaise stratégie peut entraîner un gaspillage de quotas ou un rate limiting fréquent.

::: code-group

```bash [1 compte - Stratégie Sticky]
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "sticky"
}
EOF
```

```bash [2-3 comptes - Stratégie Hybrid (par défaut)]
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "hybrid"
}
EOF
```

```bash [4+ comptes - Stratégie Round-Robin]
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin"
}
EOF
```

:::

**Vous devriez voir** : Le fichier de configuration a été mis à jour avec la stratégie correspondante.

### Étape 3 : Activer le décalage PID (scénario d'agents parallèles)

**Pourquoi**
Si vous utilisez des plugins comme oh-my-opencode pour générer des agents parallèles, plusieurs processus enfants peuvent initier des requêtes simultanément. Par défaut, ils commencent tous à sélectionner à partir du même compte initial, entraînant une contention sur les comptes et du rate limiting.

**Action**

Modifiez la configuration pour ajouter le décalage PID :

```bash
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin",
  "pid_offset_enabled": true
}
EOF
```

**Vous devriez voir** : `pid_offset_enabled` défini sur `true`.

**Fonctionnement** :

- Chaque processus calcule un décalage basé sur son PID (ID de processus)
- Décalage = `PID % nombre de comptes`
- Différents processus utilisent prioritairement différents comptes de départ
- Exemple : Avec 3 comptes, les processus avec PID 100, 101, 102 utilisent respectivement les comptes 1, 2, 0

### Étape 4 : Vérifier que la stratégie est active

**Pourquoi**
Confirmer que la configuration est correcte et que la stratégie fonctionne comme prévu.

**Action**

Initiez plusieurs requêtes concurrentes et observez le changement de compte :

```bash
# Activer les logs de débogage
export OPENCODE_ANTIGRAVITY_DEBUG=1

# Initier 5 requêtes
for i in {1..5}; do
  opencode run "Test $i" --model=google/antigravity-gemini-3-pro &
done
wait
```

**Vous devriez voir** :

- Des logs montrant que différentes requêtes utilisent différents comptes
- L'événement `account-switch` enregistre le changement de compte

Exemple de logs (stratégie round-robin) :

```
[DEBUG] Selected account: user1@gmail.com (index: 0) - reason: rotation
[DEBUG] Selected account: user2@gmail.com (index: 1) - reason: rotation
[DEBUG] Selected account: user3@gmail.com (index: 2) - reason: rotation
[DEBUG] Selected account: user1@gmail.com (index: 0) - reason: rotation
[DEBUG] Selected account: user2@gmail.com (index: 1) - reason: rotation
```

### Étape 5 : Surveiller l'état de santé des comptes (stratégie Hybrid)

**Pourquoi**
La stratégie Hybrid sélectionne les comptes basée sur le health score. Comprendre l'état de santé aide à juger si la configuration est appropriée.

**Action**

Consultez le health score dans les logs de débogage :

```bash
export OPENCODE_ANTIGRAVITY_DEBUG=2 opencode run "Hello" --model=google/antigravity-gemini-3-pro
```

**Vous devriez voir** :

```
[VERBOSE] Health scores: {
  "0": { "score": 85, "consecutiveFailures": 0 },
  "1": { "score": 60, "consecutiveFailures": 2 },
  "2": { "score": 70, "consecutiveFailures": 0 }
}
[DEBUG] Selected account: user1@gmail.com (index: 0) - hybrid score: 270.2
```

**Interprétation** :

- Compte 0 : health score 85 (excellent)
- Compte 1 : health score 60 (utilisable, mais 2 échecs consécutifs)
- Compte 2 : health score 70 (bon)
- Sélection finale du compte 0, score combiné 270.2

## Points de contrôle ✅

::: tip Comment vérifier que la configuration est active ?

1. Consultez le fichier de configuration pour confirmer la valeur de `account_selection_strategy`
2. Initiez plusieurs requêtes et observez le comportement de changement de compte dans les logs
3. Stratégie Hybrid : les comptes avec un health score bas devraient être sélectionnés moins fréquemment
4. Stratégie Round-robin : les comptes devraient être utilisés en boucle, sans préférence notable
   :::

## Pièges à éviter

### ❌ Nombre de comptes et stratégie incompatibles

**Comportement incorrect** :

- Utiliser round-robin avec seulement 2 comptes, entraînant des changements fréquents
- Utiliser sticky avec 5 comptes, conduisant à une utilisation inéquilibrée des quotas

**Bonne pratique** : Choisissez la stratégie selon le tableau de référence rapide.

### ❌ Agents parallèles sans activation du décalage PID

**Comportement incorrect** :

- Plusieurs agents parallèles utilisant simultanément le même compte
- Entraînant un rate limiting rapide du compte

**Bonne pratique** : Définissez `pid_offset_enabled: true`.

### ❌ Ignorer le health score (stratégie Hybrid)

**Comportement incorrect** :

- Un compte fréquemment limité est encore utilisé à haute fréquence
- Ne pas exploiter le health score pour éviter les comptes problématiques

**Bonne pratique** : Vérifiez régulièrement le health score dans les logs de débogage. En cas d'anomalie (par exemple, un compte avec plus de 5 échecs consécutifs), envisagez de retirer ce compte ou de changer de stratégie.

### ❌ Mélanger le double pool de quotas et les stratégies mono-quota

**Comportement incorrect** :

- Les modèles Gemini utilisent le suffixe `:antigravity` pour forcer l'utilisation du pool de quotas Antigravity
- Configurez simultanément `quota_fallback: false`
- Lorsqu'un pool de quotas est épuisé, impossible de faire un fallback vers l'autre pool

**Bonne pratique** : Comprenez le [système de quotas dual](/fr/NoeFabris/opencode-antigravity-auth/platforms/dual-quota-system/), configurez `quota_fallback` selon vos besoins.

## Résumé de la leçon

| Stratégie | Caractéristique principale | Cas d'usage |
| --- | --- | ---|
| `sticky` | Garde le compte jusqu'au rate limiting | 1 compte, nécessite le cache du prompt |
| `round-robin` | Rotation cyclique des comptes | 4+ comptes, maximise le débit |
| `hybrid` | Sélection intelligente Health + Token + LRU | 2-3 comptes, équilibre performance et stabilité |

**Configuration clé** :

- `account_selection_strategy` : Définit la stratégie (`sticky` / `round-robin` / `hybrid`)
- `pid_offset_enabled` : Active pour les scénarios d'agents parallèles (`true`)
- `quota_fallback` : Fallback pour le double pool de quotas Gemini (`true` / `false`)

**Méthodes de vérification** :

- Activez les logs de débogage : `OPENCODE_ANTIGRAVITY_DEBUG=1`
- Consultez les logs de changement de compte et le health score
- Observez l'index de compte utilisé par différentes requêtes

## Prochaine leçon

> La prochaine leçon porte sur la **[gestion des rate limits](/fr/NoeFabris/opencode-antigravity-auth/advanced/rate-limit-handling/)**.
>
> Vous apprendrez :
>
> - Comment comprendre les différents types d'erreurs 429 (quota épuisé, rate limit, capacité épuisée)
> - Le fonctionnement des algorithmes de retry automatique et de backoff
> - Quand changer de compte et quand attendre la réinitialisation

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | ---|
| Point d'entrée de la stratégie de sélection de compte | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L340-L412) | 340-412 |
| Implémentation de la stratégie Sticky | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L395-L411) | 395-411 |
| Implémentation de la stratégie Hybrid | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L358-L383) | 358-383 |
| Système de health score | [`src/plugin/rotation.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/rotation.ts#L14-L163) | 14-163 |
| Système Token bucket | [`src/plugin/rotation.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/rotation.ts#L290-L402) | 290-402 |
| Algorithme de sélection LRU | [`src/plugin/rotation.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/rotation.ts#L215-L288) | 215-288 |
| Logique de décalage PID | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L387-L393) | 387-393 |
| Schema de configuration | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | Voir fichier |

**Constantes clés** :

- `DEFAULT_HEALTH_SCORE_CONFIG.initial = 70` : Health score initial pour les nouveaux comptes
- `DEFAULT_HEALTH_SCORE_CONFIG.minUsable = 50` : Health score minimum utilisable pour un compte
- `DEFAULT_TOKEN_BUCKET_CONFIG.maxTokens = 50` : Nombre maximum de tokens par compte
- `DEFAULT_TOKEN_BUCKET_CONFIG.regenerationRatePerMinute = 6` : Nombre de tokens régénérés par minute

**Fonctions clés** :

- `getCurrentOrNextForFamily()` : Sélectionne le compte selon la stratégie
- `selectHybridAccount()` : Algorithme de sélection par score de la stratégie Hybrid
- `getScore()` : Obtient le health score du compte (avec récupération temporelle)
- `hasTokens()` / `consume()` : Vérification et consommation Token bucket
- `sortByLruWithHealth()` : Tri LRU + health score

</details>

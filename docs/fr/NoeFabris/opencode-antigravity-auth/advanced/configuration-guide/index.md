---
title: "Guide de Configuration : Options Complètes Détaillées | Antigravity Auth"
sidebarTitle: "Maîtriser la Configuration"
subtitle: "Guide Complet des Options de Configuration"
description: "Maîtrisez toutes les options de configuration du plugin Antigravity Auth. Découvrez l'emplacement des fichiers de configuration, le comportement des modèles, les stratégies de rotation des comptes et les paramètres applicatifs, avec des configurations recommandées pour les scénarios mono-compte, multi-comptes et agents parallèles."
tags:
  - "configuration"
  - "configuration-avancée"
  - "multi-comptes"
  - "rotation-comptes"
prerequisite:
  - "start-quick-install"
  - "advanced-multi-account-setup"
order: 2
---

# Guide Complet des Options de Configuration

## Ce Que Vous Saurez Faire

- Créer le fichier de configuration au bon emplacement
- Choisir la configuration adaptée à votre cas d'usage
- Comprendre le rôle et les valeurs par défaut de chaque option
- Utiliser les variables d'environnement pour surcharger temporairement la configuration
- Ajuster le comportement des modèles, la rotation des comptes et le comportement du plugin

## Votre Situation Actuelle

Trop d'options de configuration et vous ne savez pas par où commencer ? La configuration par défaut fonctionne, mais vous souhaitez l'optimiser ? En multi-comptes, vous ne savez pas quelle stratégie de rotation choisir ?

## Concept Clé

Le fichier de configuration est comme un « mode d'emploi » pour le plugin — vous lui indiquez comment fonctionner, et il s'exécute selon vos directives. Le plugin Antigravity Auth offre de nombreuses options de configuration, mais la plupart des utilisateurs n'ont besoin de configurer que quelques options essentielles.

### Priorité des Fichiers de Configuration

La priorité des options de configuration, de la plus haute à la plus basse :

1. **Variables d'environnement** (surcharge temporaire)
2. **Configuration projet** `.opencode/antigravity.json` (projet courant)
3. **Configuration utilisateur** `~/.config/opencode/antigravity.json` (globale)

::: info
Les variables d'environnement ont la priorité la plus élevée, idéales pour les tests temporaires. Les fichiers de configuration conviennent aux paramètres persistants.
:::

### Emplacement des Fichiers de Configuration

Selon le système d'exploitation, l'emplacement du fichier de configuration utilisateur diffère :

| Système | Chemin |
| --- | --- |
| Linux/macOS | `~/.config/opencode/antigravity.json` |
| Windows | `%APPDATA%\opencode\antigravity.json` |

Le fichier de configuration projet se trouve toujours dans `.opencode/antigravity.json` à la racine du projet.

### Catégories d'Options de Configuration

Les options de configuration se divisent en quatre catégories :

1. **Comportement des modèles** : blocs de réflexion, récupération de session, Google Search
2. **Rotation des comptes** : gestion multi-comptes, stratégie de sélection, décalage PID
3. **Comportement applicatif** : journaux de débogage, mise à jour automatique, notifications silencieuses
4. **Paramètres avancés** : récupération d'erreurs, gestion des tokens, score de santé

---

## Prérequis

- [x] Installation du plugin terminée (voir [Installation Rapide](../../start/quick-install/))
- [x] Au moins un compte Google configuré
- [x] Connaissance de la syntaxe JSON de base

---

## Étapes à Suivre

### Étape 1 : Créer le Fichier de Configuration

**Pourquoi** : Le fichier de configuration permet au plugin de fonctionner selon vos besoins

Créez le fichier de configuration au chemin correspondant à votre système d'exploitation :

::: code-group

```bash [macOS/Linux]
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json"
}
EOF
```

```powershell [Windows]
## Avec PowerShell
$env:APPDATA\opencode\antigravity.json = @{
  '$schema' = "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json"
} | ConvertTo-Json -Depth 10

Set-Content -Path "$env:APPDATA\opencode\antigravity.json" -Value $json
```

:::

**Résultat attendu** : Le fichier est créé avec succès, contenant uniquement le champ `$schema`.

::: tip
L'ajout du champ `$schema` active l'autocomplétion et la validation de type dans VS Code.
:::

### Étape 2 : Configurer les Options de Base

**Pourquoi** : Optimiser le comportement du plugin selon votre cas d'usage

Choisissez l'une des configurations suivantes selon votre situation :

**Scénario A : Compte unique + Google Search nécessaire**

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "sticky",
  "web_search": {
    "default_mode": "auto"
  }
}
```

**Scénario B : 2-3 comptes + rotation intelligente**

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "hybrid",
  "web_search": {
    "default_mode": "auto"
  }
}
```

**Scénario C : Multi-comptes + agents parallèles**

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin",
  "switch_on_first_rate_limit": true,
  "pid_offset_enabled": true,
  "web_search": {
    "default_mode": "auto"
  }
}
```

**Résultat attendu** : Le fichier de configuration est enregistré avec succès, OpenCode recharge automatiquement la configuration du plugin.

### Étape 3 : Vérifier la Configuration

**Pourquoi** : Confirmer que la configuration est bien appliquée

Dans OpenCode, lancez une requête au modèle et observez :

1. Compte unique avec stratégie `sticky` : toutes les requêtes utilisent le même compte
2. Multi-comptes avec stratégie `hybrid` : les requêtes sont réparties intelligemment entre les comptes
3. Modèle Gemini avec `web_search` activé : le modèle effectue des recherches web si nécessaire

**Résultat attendu** : Le comportement du plugin correspond à vos attentes de configuration.

---

## Détail des Options de Configuration

### Comportement des Modèles

Ces options influencent la façon dont le modèle réfléchit et répond.

#### keep_thinking

| Valeur | Par défaut | Description |
| --- | --- | --- |
| `true` | - | Conserver les blocs de réflexion Claude, maintenir la cohérence entre les tours |
| `false` | ✓ | Supprimer les blocs de réflexion, plus stable, contexte réduit |

::: warning Attention
Activer `keep_thinking` peut réduire la stabilité du modèle et provoquer des erreurs de signature. Il est recommandé de garder `false`.
:::

#### session_recovery

| Valeur | Par défaut | Description |
| --- | --- | --- |
| `true` | ✓ | Récupérer automatiquement les sessions interrompues lors d'appels d'outils |
| `false` | - | Ne pas récupérer automatiquement en cas d'erreur |

#### auto_resume

| Valeur | Par défaut | Description |
| --- | --- | --- |
| `true` | - | Envoyer automatiquement "continue" après récupération |
| `false` | ✓ | Afficher uniquement une invite après récupération, continuation manuelle |

#### resume_text

Personnaliser le texte envoyé lors de la récupération. Par défaut `"continue"`, modifiable selon vos préférences.

#### web_search

| Option | Par défaut | Description |
| --- | --- | --- |
| `default_mode` | `"off"` | `"auto"` ou `"off"` |
| `grounding_threshold` | `0.3` | Seuil de recherche (0=toujours rechercher, 1=jamais rechercher) |

::: info
`grounding_threshold` n'est effectif que lorsque `default_mode: "auto"`. Plus la valeur est élevée, plus le modèle est conservateur dans ses recherches.
:::

---

### Rotation des Comptes

Ces options gèrent la répartition des requêtes entre plusieurs comptes.

#### account_selection_strategy

| Stratégie | Par défaut | Cas d'usage |
| --- | --- | --- |
| `sticky` | - | Compte unique, préserver le cache de prompts |
| `round-robin` | - | 4+ comptes, maximiser le débit |
| `hybrid` | ✓ | 2-3 comptes, rotation intelligente |

::: tip
Stratégies recommandées selon le nombre de comptes :
- 1 compte → `sticky`
- 2-3 comptes → `hybrid`
- 4+ comptes → `round-robin`
- Agents parallèles → `round-robin` + `pid_offset_enabled: true`
:::

#### switch_on_first_rate_limit

| Valeur | Par défaut | Description |
| --- | --- | --- |
| `true` | ✓ | Changer de compte immédiatement au premier 429 |
| `false` | - | Réessayer d'abord le compte actuel, changer au deuxième 429 |

#### pid_offset_enabled

| Valeur | Par défaut | Description |
| --- | --- | --- |
| `true` | - | Différentes sessions (PID) utilisent différents comptes de départ |
| `false` | ✓ | Toutes les sessions commencent avec le même compte |

::: tip
Garder `false` pour une utilisation mono-session afin de préserver le cache de prompts Anthropic. Activer `true` pour les sessions parallèles.
:::

#### quota_fallback

| Valeur | Par défaut | Description |
| --- | --- | --- |
| `true` | - | Fallback vers le pool de quota Gemini |
| `false` | ✓ | Ne pas activer le fallback |

::: info
Applicable uniquement aux modèles Gemini. Lorsque le pool de quota principal est épuisé, tente le pool de quota de secours du même compte.
:::

---

### Comportement Applicatif

Ces options contrôlent le comportement du plugin lui-même.

#### quiet_mode

| Valeur | Par défaut | Description |
| --- | --- | --- |
| `true` | - | Masquer la plupart des notifications toast (sauf les notifications de récupération) |
| `false` | ✓ | Afficher toutes les notifications |

#### debug

| Valeur | Par défaut | Description |
| --- | --- | --- |
| `true` | - | Activer les journaux de débogage |
| `false` | ✓ | Ne pas enregistrer les journaux de débogage |

::: tip
Pour activer temporairement les journaux de débogage sans modifier le fichier de configuration, utilisez les variables d'environnement :
```bash
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode   # Journaux basiques
OPENCODE_ANTIGRAVITY_DEBUG=2 opencode   # Journaux détaillés
```
:::

#### log_dir

Personnaliser le répertoire des journaux de débogage. Par défaut `~/.config/opencode/antigravity-logs/`.

#### auto_update

| Valeur | Par défaut | Description |
| --- | --- | --- |
| `true` | ✓ | Vérifier et mettre à jour automatiquement le plugin |
| `false` | - | Ne pas mettre à jour automatiquement |

---

### Paramètres Avancés

Ces options sont destinées aux cas particuliers, la plupart des utilisateurs n'ont pas besoin de les modifier.

<details>
<summary><strong>Afficher les paramètres avancés</strong></summary>

#### Récupération d'Erreurs

| Option | Par défaut | Description |
| --- | --- | --- |
| `empty_response_max_attempts` | `4` | Nombre de tentatives pour réponse vide |
| `empty_response_retry_delay_ms` | `2000` | Délai entre tentatives (millisecondes) |
| `tool_id_recovery` | `true` | Corriger les incohérences d'ID d'outil |
| `claude_tool_hardening` | `true` | Prévenir les hallucinations de paramètres d'outils |
| `max_rate_limit_wait_seconds` | `300` | Temps d'attente maximum en cas de limitation (0=illimité) |

#### Gestion des Tokens

| Option | Par défaut | Description |
| --- | --- | --- |
| `proactive_token_refresh` | `true` | Rafraîchir proactivement les tokens avant expiration |
| `proactive_refresh_buffer_seconds` | `1800` | Rafraîchir 30 minutes avant expiration |
| `proactive_refresh_check_interval_seconds` | `300` | Intervalle de vérification du rafraîchissement (secondes) |

#### Cache de Signature (effectif avec `keep_thinking: true`)

| Option | Par défaut | Description |
| --- | --- | --- |
| `signature_cache.enabled` | `true` | Activer le cache disque |
| `signature_cache.memory_ttl_seconds` | `3600` | TTL du cache mémoire (1 heure) |
| `signature_cache.disk_ttl_seconds` | `172800` | TTL du cache disque (48 heures) |
| `signature_cache.write_interval_seconds` | `60` | Intervalle d'écriture en arrière-plan (secondes) |

#### Score de Santé (utilisé par la stratégie `hybrid`)

| Option | Par défaut | Description |
| --- | --- | --- |
| `health_score.initial` | `70` | Score de santé initial |
| `health_score.success_reward` | `1` | Points de récompense pour succès |
| `health_score.rate_limit_penalty` | `-10` | Points de pénalité pour limitation |
| `health_score.failure_penalty` | `-20` | Points de pénalité pour échec |
| `health_score.recovery_rate_per_hour` | `2` | Points de récupération par heure |
| `health_score.min_usable` | `50` | Score minimum pour compte utilisable |
| `health_score.max_score` | `100` | Score de santé maximum |

#### Token Bucket (utilisé par la stratégie `hybrid`)

| Option | Par défaut | Description |
| --- | --- | --- |
| `token_bucket.max_tokens` | `50` | Capacité maximale du bucket |
| `token_bucket.regeneration_rate_per_minute` | `6` | Taux de régénération par minute |
| `token_bucket.initial_tokens` | `50` | Nombre initial de tokens |

</details>

---

## Configurations Recommandées

### Configuration Mono-Compte

Adaptée aux utilisateurs avec un seul compte Google

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "sticky",
  "web_search": {
    "default_mode": "auto"
  }
}
```

**Explications** :
- `sticky` : pas de rotation, préserve le cache de prompts Anthropic
- `web_search: auto` : Gemini peut effectuer des recherches si nécessaire

### Configuration 2-3 Comptes

Adaptée aux petites équipes ou utilisateurs nécessitant une certaine flexibilité

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "hybrid",
  "web_search": {
    "default_mode": "auto"
  }
}
```

**Explications** :
- `hybrid` : rotation intelligente, sélection du meilleur compte par score de santé
- `web_search: auto` : Gemini peut effectuer des recherches si nécessaire

### Configuration Multi-Comptes + Agents Parallèles

Adaptée aux utilisateurs exécutant plusieurs agents en parallèle

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin",
  "switch_on_first_rate_limit": true,
  "pid_offset_enabled": true,
  "web_search": {
    "default_mode": "auto"
  }
}
```

**Explications** :
- `round-robin` : rotation de compte à chaque requête
- `switch_on_first_rate_limit: true` : changement immédiat au premier 429
- `pid_offset_enabled: true` : différentes sessions utilisent différents comptes de départ
- `web_search: auto` : Gemini peut effectuer des recherches si nécessaire

---

## Pièges à Éviter

### Erreur : La configuration ne prend pas effet après modification

**Cause** : OpenCode n'a peut-être pas rechargé le fichier de configuration.

**Solution** : Redémarrer OpenCode ou vérifier que la syntaxe JSON est correcte.

### Erreur : Format JSON invalide dans le fichier de configuration

**Cause** : Erreur de syntaxe JSON (virgule manquante, virgule en trop, commentaires, etc.).

**Solution** : Utiliser un validateur JSON pour vérifier, ou ajouter le champ `$schema` pour activer l'autocomplétion IDE.

### Erreur : Les variables d'environnement ne prennent pas effet

**Cause** : Nom de variable mal orthographié ou OpenCode non redémarré.

**Solution** : Vérifier que le nom de la variable est `OPENCODE_ANTIGRAVITY_*` (tout en majuscules, préfixe correct), puis redémarrer OpenCode.

### Erreur : Erreurs fréquentes après activation de `keep_thinking: true`

**Cause** : Incohérence de signature des blocs de réflexion.

**Solution** : Garder `keep_thinking: false` (valeur par défaut), ou ajuster la configuration `signature_cache`.

---

## Résumé

Priorité des fichiers de configuration : Variables d'environnement > Projet > Utilisateur.

Options de configuration essentielles :
- Comportement des modèles : `keep_thinking`, `session_recovery`, `web_search`
- Rotation des comptes : `account_selection_strategy`, `pid_offset_enabled`
- Comportement applicatif : `debug`, `quiet_mode`, `auto_update`

Configurations recommandées selon le scénario :
- Compte unique : `sticky`
- 2-3 comptes : `hybrid`
- 4+ comptes : `round-robin`
- Agents parallèles : `round-robin` + `pid_offset_enabled: true`

---

## Aperçu du Prochain Cours

> Dans le prochain cours, nous apprendrons les **[Journaux de Débogage](../debug-logging/)**.
>
> Vous découvrirez :
> - Comment activer les journaux de débogage
> - Comment interpréter le contenu des journaux
> - Comment diagnostiquer les problèmes courants

---

## Annexe : Référence du Code Source

<details>
<summary><strong>Cliquer pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Définition du schéma de configuration | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 12-323 |
| Valeurs par défaut | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 325-373 |
| Logique de chargement de configuration | [`src/plugin/config/loader.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/loader.ts) | 1-100 |

**Constantes clés** :
- `DEFAULT_CONFIG` : valeurs par défaut de toutes les options de configuration

**Types clés** :
- `AntigravityConfig` : type de l'objet de configuration
- `AccountSelectionStrategy` : type de la stratégie de sélection de compte
- `SignatureCacheConfig` : type de la configuration du cache de signature

</details>

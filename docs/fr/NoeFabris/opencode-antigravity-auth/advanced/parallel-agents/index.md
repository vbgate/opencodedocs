---
title: "Décalage PID : Optimiser l'attribution des comptes pour agents parallèles | Antigravity Auth"
sidebarTitle: "Agents parallèles sans conflit"
subtitle: "Optimisation des agents parallèles : Décalage PID et attribution des comptes"
description: "Apprenez comment le décalage PID optimise l'attribution des comptes pour les agents parallèles oh-my-opencode. Configuration, stratégies, vérification et dépannage."
tags:
  - "advanced"
  - "parallel-agents"
  - "pid-offset"
  - "oh-my-opencode"
  - "load-balancing"
prerequisite:
  - "start-quick-install"
  - "start-first-auth-login"
  - "advanced-multi-account-setup"
order: 5
---

# Optimisation des agents parallèles : Décalage PID et attribution des comptes

Le **décalage PID** est un mécanisme d'optimisation de l'attribution des comptes basé sur l'identifiant de processus (PID). Il calcule un décalage via `process.pid % accounts.length`, permettant à plusieurs processus OpenCode ou agents parallèles oh-my-opencode de privilégier différents comptes Google. Lorsque plusieurs processus s'exécutent simultanément, chacun sélectionne automatiquement un compte de départ différent selon le modulo de son PID. Cela évite efficacement les erreurs de limitation de débit 429 causées par plusieurs processus accédant au même compte, améliorant significativement le taux de réussite des requêtes et l'utilisation des quotas en contexte parallèle. Cette fonctionnalité est particulièrement adaptée aux développeurs qui doivent exécuter plusieurs agents ou tâches parallèles simultanément.

## Ce que vous apprendrez

- Comprendre les problèmes de conflit de comptes dans les scénarios d'agents parallèles
- Activer le décalage PID pour que différents processus privilégient différents comptes
- Combiner avec la stratégie round-robin pour maximiser l'utilisation multi-comptes
- Diagnostiquer les problèmes de limitation de débit et de sélection de compte dans les agents parallèles

## Votre situation actuelle

Lors de l'utilisation de oh-my-opencode ou de l'exécution simultanée de plusieurs instances OpenCode, vous pouvez rencontrer :

- Plusieurs sous-agents utilisant le même compte simultanément, provoquant fréquemment des limitations de débit 429
- Même avec plusieurs comptes configurés, les requêtes concurrentes se concentrent sur le même compte
- Différents processus démarrent tous depuis le premier compte, entraînant une distribution inégale
- Après un échec de requête, il faut attendre longtemps avant de réessayer

## Quand utiliser cette technique

Le décalage PID est adapté aux scénarios suivants :

| Scénario | Décalage PID nécessaire ? | Raison |
| --- | --- | --- |
| Instance OpenCode unique | ❌ Non | Processus unique, pas de conflit de compte |
| Changement manuel de comptes | ❌ Non | Non concurrent, la stratégie sticky suffit |
| Multi-agents oh-my-opencode | ✅ Recommandé | Processus multiples concurrents, nécessite une distribution |
| Plusieurs OpenCode simultanés | ✅ Recommandé | PID indépendants, distribution automatique |
| Tâches CI/CD parallèles | ✅ Recommandé | Processus indépendants par tâche, évite la compétition |

::: warning Prérequis
Avant de commencer ce tutoriel, assurez-vous d'avoir :
- ✅ Configuré au moins 2 comptes Google
- ✅ Compris le fonctionnement des stratégies de sélection de compte
- ✅ Utilisé oh-my-opencode ou besoin d'exécuter plusieurs instances OpenCode en parallèle

[Tutoriel configuration multi-comptes](../multi-account-setup/) | [Tutoriel stratégies de sélection de compte](../account-selection-strategies/)
:::

## Concept clé

### Qu'est-ce que le décalage PID ?

Le **PID (Process ID)** est un identifiant unique attribué par le système d'exploitation à chaque processus. Lorsque plusieurs processus OpenCode s'exécutent simultanément, chacun possède un PID différent.

Le **décalage PID** est une optimisation de l'attribution des comptes basée sur l'identifiant de processus :

```
Supposons 3 comptes (index : 0, 1, 2) :

Processus A (PID=123) :
  123 % 3 = 0 → Utilise prioritairement le compte 0

Processus B (PID=456) :
  456 % 3 = 1 → Utilise prioritairement le compte 1

Processus C (PID=789) :
  789 % 3 = 2 → Utilise prioritairement le compte 2
```

Chaque processus sélectionne prioritairement un compte différent selon le reste de la division de son PID, évitant ainsi de se concentrer sur le même compte dès le départ.

### Pourquoi le décalage PID est-il nécessaire ?

Sans décalage PID, tous les processus démarrent depuis le compte 0 :

```
Chronologie :
T1 : Processus A démarre → Utilise compte 0
T2 : Processus B démarre → Utilise compte 0  ← Conflit !
T3 : Processus C démarre → Utilise compte 0  ← Conflit !
```

Avec le décalage PID activé :

```
Chronologie :
T1 : Processus A démarre → Décalage PID → Utilise compte 0
T2 : Processus B démarre → Décalage PID → Utilise compte 1  ← Distribué !
T3 : Processus C démarre → Décalage PID → Utilise compte 2  ← Distribué !
```

### Combinaison avec les stratégies de sélection de compte

Le décalage PID ne s'applique que lors de la phase de fallback de la stratégie sticky (les stratégies round-robin et hybrid ont leur propre logique de distribution) :

| Stratégie | Décalage PID actif ? | Scénario recommandé |
| --- | --- | --- |
| `sticky` | ✅ Actif | Processus unique + priorité au cache de prompt |
| `round-robin` | ❌ Inactif | Multi-processus/agents parallèles, débit maximal |
| `hybrid` | ❌ Inactif | Distribution intelligente, priorité au score de santé |

**Pourquoi round-robin n'a pas besoin du décalage PID ?**

La stratégie round-robin alterne déjà les comptes par elle-même :

```typescript
// Chaque requête passe au compte suivant
this.cursor++;
const account = available[this.cursor % available.length];
```

Les processus multiples se répartissent naturellement sur différents comptes, sans besoin de décalage PID supplémentaire.

::: tip Bonne pratique
Pour les scénarios d'agents parallèles, configuration recommandée :

```json
{
  "account_selection_strategy": "round-robin",
  "pid_offset_enabled": false  // round-robin n'en a pas besoin
}
```

Activez le décalage PID uniquement si vous devez utiliser la stratégie sticky ou hybrid.
:::

## Guide pas à pas

### Étape 1 : Vérifier la configuration multi-comptes

**Pourquoi**
Le décalage PID nécessite au moins 2 comptes pour être efficace. Avec un seul compte, quel que soit le reste de la division du PID, seul ce compte sera utilisé.

**Action**

Vérifiez le nombre de comptes actuels :

```bash
opencode auth list
```

Vous devriez voir au moins 2 comptes :

```
2 account(s) saved:
  1. user1@gmail.com
  2. user2@gmail.com
```

Si vous n'avez qu'un seul compte, ajoutez-en d'autres :

```bash
opencode auth login
```

Suivez les instructions et sélectionnez `(a)dd new account(s)`.

**Résultat attendu** : La liste des comptes affiche 2 comptes ou plus.

### Étape 2 : Configurer le décalage PID

**Pourquoi**
Activer le décalage PID via le fichier de configuration permet au plugin de prendre en compte l'identifiant de processus lors de la sélection de compte.

**Action**

Ouvrez le fichier de configuration OpenCode :

- **macOS/Linux** : `~/.config/opencode/antigravity.json`
- **Windows** : `%APPDATA%\opencode\antigravity.json`

Ajoutez ou modifiez la configuration suivante :

```json
{
  "pid_offset_enabled": true
}
```

Exemple de configuration complète (avec stratégie sticky) :

```json
{
  "pid_offset_enabled": true,
  "account_selection_strategy": "sticky"
}
```

**Via variable d'environnement** (optionnel) :

```bash
export OPENCODE_ANTIGRAVITY_PID_OFFSET_ENABLED=1
```

**Résultat attendu** : `pid_offset_enabled` est défini sur `true` dans le fichier de configuration.

### Étape 3 : Vérifier l'effet du décalage PID

**Pourquoi**
En exécutant plusieurs processus, vérifiez si le décalage PID fonctionne et si différents processus utilisent prioritairement différents comptes.

**Action**

Ouvrez deux fenêtres de terminal et exécutez OpenCode dans chacune :

**Terminal 1** :
```bash
opencode chat
# Envoyez une requête, notez le compte utilisé (consultez les logs ou le toast)
```

**Terminal 2** :
```bash
opencode chat
# Envoyez une requête, notez le compte utilisé
```

Observez le comportement de sélection de compte :

- ✅ **Attendu** : Les deux terminaux utilisent prioritairement des comptes différents
- ❌ **Problème** : Les deux terminaux utilisent le même compte

Si le problème persiste, vérifiez :

1. Si la configuration est correctement chargée
2. Si la stratégie de sélection de compte est `sticky` (round-robin n'a pas besoin du décalage PID)
3. Si vous n'avez qu'un seul compte

Activez les logs de débogage pour voir le processus détaillé de sélection de compte :

```bash
export OPENCODE_ANTIGRAVITY_DEBUG=1
opencode chat
```

Les logs afficheront :

```
[accounts] Applying PID offset: 1 (process.pid % accounts.length)
[accounts] Starting account index for 'claude': 1
```

**Résultat attendu** : Différents terminaux utilisent prioritairement différents comptes, ou les logs montrent que le décalage PID est appliqué.

### Étape 4 : (Optionnel) Combiner avec la stratégie round-robin

**Pourquoi**
La stratégie round-robin alterne déjà les comptes par elle-même, sans besoin de décalage PID. Cependant, pour les agents parallèles à haute fréquence, round-robin est un meilleur choix.

**Action**

Modifiez le fichier de configuration :

```json
{
  "account_selection_strategy": "round-robin",
  "pid_offset_enabled": false
}
```

Lancez plusieurs agents oh-my-opencode et observez la distribution des requêtes :

```
Agent 1 → Compte 0 → Compte 1 → Compte 2 → Compte 0 ...
Agent 2 → Compte 1 → Compte 2 → Compte 0 → Compte 1 ...
```

Chaque agent alterne indépendamment, utilisant pleinement les quotas de tous les comptes.

**Résultat attendu** : Les requêtes sont distribuées uniformément sur tous les comptes, chaque agent alternant indépendamment.

## Points de contrôle ✅

Après avoir terminé les étapes ci-dessus, vous devriez être capable de :

- [ ] Configurer avec succès au moins 2 comptes Google
- [ ] Activer `pid_offset_enabled` dans `antigravity.json`
- [ ] Lors de l'exécution de plusieurs instances OpenCode, différents processus utilisent prioritairement différents comptes
- [ ] Comprendre pourquoi round-robin n'a pas besoin du décalage PID
- [ ] Utiliser les logs de débogage pour voir le processus de sélection de compte

## Pièges courants

### Problème 1 : Aucun effet après activation

**Symptôme** : Vous avez configuré `pid_offset_enabled: true`, mais plusieurs processus utilisent toujours le même compte.

**Cause** : La stratégie de sélection de compte est peut-être `round-robin` ou `hybrid`, qui n'utilisent pas le décalage PID.

**Solution** : Passez à la stratégie `sticky`, ou comprenez que la stratégie actuelle n'a pas besoin du décalage PID.

```json
{
  "account_selection_strategy": "sticky",  // Changez en sticky
  "pid_offset_enabled": true
}
```

### Problème 2 : Un seul compte

**Symptôme** : Après activation du décalage PID, tous les processus utilisent toujours le compte 0.

**Cause** : Le décalage PID est calculé via `process.pid % accounts.length`. Avec un seul compte, le reste est toujours 0.

**Solution** : Ajoutez plus de comptes :

```bash
opencode auth login
# Sélectionnez (a)dd new account(s)
```

### Problème 3 : Cache de prompt invalidé

**Symptôme** : Après activation du décalage PID, le cache de prompt d'Anthropic ne fonctionne plus.

**Cause** : Le décalage PID peut amener différents processus ou sessions à utiliser différents comptes, alors que le cache de prompt est partagé par compte. Après changement de compte, les prompts doivent être renvoyés.

**Solution** : C'est le comportement attendu. Si le cache de prompt est prioritaire, désactivez le décalage PID et utilisez la stratégie sticky :

```json
{
  "pid_offset_enabled": false,
  "account_selection_strategy": "sticky"
}
```

### Problème 4 : Conflit multi-agents oh-my-opencode

**Symptôme** : Même avec plusieurs comptes configurés, les agents oh-my-opencode rencontrent fréquemment des erreurs 429.

**Cause** : oh-my-opencode peut démarrer les agents séquentiellement, plusieurs agents demandant le même compte en peu de temps.

**Solution** :

1. Utilisez la stratégie `round-robin` (recommandé) :

```json
{
  "account_selection_strategy": "round-robin"
}
```

2. Ou augmentez le nombre de comptes pour que chaque agent ait un compte dédié :

```bash
# Si vous avez 3 agents, prévoyez au moins 5 comptes
opencode auth login
```

## Résumé

Le décalage PID optimise l'attribution des comptes dans les scénarios multi-processus via l'identifiant de processus (PID) :

- **Principe** : Calcul du décalage via `process.pid % accounts.length`
- **Fonction** : Permet à différents processus de sélectionner prioritairement différents comptes, évitant les conflits
- **Limitation** : Actif uniquement avec la stratégie sticky, round-robin et hybrid n'en ont pas besoin
- **Bonne pratique** : Pour les agents parallèles, la stratégie round-robin est recommandée, sans décalage PID

Après configuration multi-comptes, choisissez la stratégie adaptée à votre cas d'usage :

| Scénario | Stratégie recommandée | Décalage PID |
| --- | --- | --- |
| Processus unique, priorité au cache de prompt | sticky | Non |
| Multi-processus/agents parallèles | round-robin | Non |
| Stratégie hybrid + démarrage distribué | hybrid | Optionnel |

## Prochaine leçon

> Dans la prochaine leçon, nous étudierons le **[Guide complet des options de configuration](../configuration-guide/)**.
>
> Vous apprendrez :
> - L'emplacement et la priorité des fichiers de configuration
> - Les options de configuration pour le comportement des modèles, la rotation des comptes et le comportement de l'application
> - Les configurations recommandées pour différents scénarios
> - Les méthodes avancées d'optimisation de la configuration

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Implémentation du décalage PID | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L388-L393) | 388-393 |
| Définition du schéma de configuration | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts#L244-L255) | 244-255 |
| Support des variables d'environnement | [`src/plugin/config/loader.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/loader.ts#L163-L168) | 163-168 |
| Emplacement de passage de la configuration | [`src/plugin.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin.ts#L902) | 902 |
| Documentation d'utilisation | [`docs/MULTI-ACCOUNT.md`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/docs/MULTI-ACCOUNT.md#L111-L125) | 111-125 |
| Guide de configuration | [`docs/CONFIGURATION.md`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/docs/CONFIGURATION.md#L69) | 69 |

**Fonctions clés** :
- `getCurrentOrNextForFamily()` : Fonction principale de sélection de compte, gère la logique du décalage PID en interne
- `process.pid % this.accounts.length` : Formule centrale pour calculer le décalage

**Constantes clés** :
- `sessionOffsetApplied[family]` : Marqueur d'application du décalage pour chaque famille de modèles (appliqué une seule fois par session)

</details>

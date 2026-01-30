---
title: "Migration de compte : Configuration multi-appareils | Antigravity Auth"
sidebarTitle: "Changer d'ordinateur"
subtitle: "Migration de compte : Configuration multi-appareils et mise à niveau de version"
description: "Apprenez à migrer les fichiers de compte Antigravity Auth entre macOS/Linux/Windows, comprenez le mécanisme de mise à niveau automatique du format de stockage et résolvez les problèmes d'authentification post-migration."
tags:
  - "migration"
  - "multi-appareils"
  - "mise à niveau"
  - "gestion de compte"
prerequisite:
  - "quick-install"
order: 2
---

# Migration de compte : Configuration multi-appareils et mise à niveau de version

## Ce que vous apprendrez

- ✅ Migrer un compte d'une machine à une autre
- ✅ Comprendre les changements de version du format de stockage (v1/v2/v3)
- ✅ Résoudre les problèmes d'authentification post-migration (erreur invalid_grant)
- ✅ Partager un même compte sur plusieurs appareils

## Votre situation actuelle

Vous avez un nouvel ordinateur et souhaitez continuer à utiliser Antigravity Auth pour accéder à Claude et Gemini 3, sans repasser par tout le processus d'authentification OAuth. Ou bien, après une mise à jour du plugin, vos données de compte existantes ne fonctionnent plus.

## Quand utiliser cette méthode

- 📦 **Nouvel appareil** : Migration d'un ancien ordinateur vers un nouveau
- 🔄 **Synchronisation multi-appareils** : Partager un compte entre ordinateur de bureau et portable
- 🆙 **Mise à niveau de version** : Changement du format de stockage après mise à jour du plugin
- 💾 **Sauvegarde et restauration** : Sauvegarder régulièrement les données de compte

## Concept clé

La **migration de compte** consiste à copier le fichier de compte (antigravity-accounts.json) d'une machine à une autre. Le plugin gère automatiquement la mise à niveau du format de stockage.

### Vue d'ensemble du mécanisme de migration

Le format de stockage est versionné (actuellement v3), et le plugin **gère automatiquement la migration de version** :

| Version | Changements principaux | État actuel |
| --- | --- | --- |
| v1 → v2 | Structuration de l'état de limitation de débit | ✅ Migration automatique |
| v2 → v3 | Support du double pool de quotas (gemini-antigravity/gemini-cli) | ✅ Migration automatique |

Emplacement du fichier de stockage (multi-plateforme) :

| Plateforme | Chemin |
| --- | --- |
| macOS/Linux | `~/.config/opencode/antigravity-accounts.json` |
| Windows | `%APPDATA%\opencode\antigravity-accounts.json` |

::: tip Rappel de sécurité
Le fichier de compte contient le refresh token OAuth, **équivalent à un mot de passe**. Utilisez un transfert chiffré (SFTP, ZIP chiffré, etc.).
:::

## 🎒 Prérequis

- [ ] OpenCode installé sur la machine cible
- [ ] Plugin Antigravity Auth installé sur la machine cible : `opencode plugin add opencode-antigravity-auth@beta`
- [ ] Moyen de transfert sécurisé entre les deux machines (SSH, clé USB, etc.)

## Guide pas à pas

### Étape 1 : Localiser le fichier de compte sur la machine source

**Pourquoi**
Vous devez trouver le fichier JSON contenant les informations de compte.

```bash
# macOS/Linux
ls -la ~/.config/opencode/antigravity-accounts.json

# Windows PowerShell
Get-ChildItem "$env:APPDATA\opencode\antigravity-accounts.json"
```

**Résultat attendu** : Le fichier existe avec un contenu similaire à :

```json
{
  "version": 3,
  "accounts": [...],
  "activeIndex": 0
}
```

Si le fichier n'existe pas, vous n'avez pas encore ajouté de compte. Exécutez d'abord `opencode auth login`.

### Étape 2 : Copier le fichier de compte vers la machine cible

**Pourquoi**
Transférer les informations de compte (refresh token et Project ID) vers le nouvel appareil.

::: code-group

```bash [macOS/Linux]
# Méthode 1 : Utiliser scp (via SSH)
scp ~/.config/opencode/antigravity-accounts.json user@new-machine:/tmp/

# Méthode 2 : Utiliser une clé USB
cp ~/.config/opencode/antigravity-accounts.json /Volumes/USB/
```

```powershell [Windows]
# Méthode 1 : Utiliser PowerShell Copy-Item (via SMB)
Copy-Item "$env:APPDATA\opencode\antigravity-accounts.json" "\\new-machine\c$\Users\user\Downloads\"

# Méthode 2 : Utiliser une clé USB
Copy-Item "$env:APPDATA\opencode\antigravity-accounts.json" "E:\"
```

:::

**Résultat attendu** : Le fichier est copié avec succès dans un répertoire temporaire de la machine cible (comme `/tmp/` ou `Downloads/`).

### Étape 3 : Installer le plugin sur la machine cible

**Pourquoi**
S'assurer que la version du plugin sur la machine cible est compatible.

```bash
opencode plugin add opencode-antigravity-auth@beta
```

**Résultat attendu** : Message de confirmation d'installation du plugin.

### Étape 4 : Placer le fichier au bon emplacement

**Pourquoi**
Le plugin ne recherche le fichier de compte qu'à un emplacement fixe.

::: code-group

```bash [macOS/Linux]
# Créer le répertoire (s'il n'existe pas)
mkdir -p ~/.config/opencode

# Copier le fichier
cp /tmp/antigravity-accounts.json ~/.config/opencode/

# Vérifier les permissions
chmod 600 ~/.config/opencode/antigravity-accounts.json
```

```powershell [Windows]
# Copier le fichier (le répertoire sera créé automatiquement)
Copy-Item "$env:Downloads\antigravity-accounts.json" "$env:APPDATA\opencode\"

# Vérifier
Test-Path "$env:APPDATA\opencode\antigravity-accounts.json"
```

:::

**Résultat attendu** : Le fichier existe dans le répertoire de configuration.

### Étape 5 : Vérifier le résultat de la migration

**Pourquoi**
Confirmer que le compte a été correctement chargé.

```bash
# Lister les comptes (déclenche le chargement du fichier de compte par le plugin)
opencode auth login

# Si des comptes existent, vous verrez :
# 2 account(s) saved:
#   1. user1@gmail.com
#   2. user2@gmail.com
# (a)dd new account(s) or (f)resh start? [a/f]:
```

Appuyez sur `Ctrl+C` pour quitter (pas besoin d'ajouter un nouveau compte).

**Résultat attendu** : Le plugin reconnaît la liste des comptes, y compris les adresses email des comptes migrés.

### Étape 6 : Tester la première requête

**Pourquoi**
Vérifier que le refresh token est toujours valide.

```bash
# Lancer une requête de test dans OpenCode
# Sélectionner : google/antigravity-gemini-3-flash
```

**Résultat attendu** : Le modèle répond normalement.

## Points de contrôle ✅

- [ ] La machine cible peut lister les comptes migrés
- [ ] La requête de test réussit (pas d'erreur d'authentification)
- [ ] Pas d'erreur dans les logs du plugin

## Problèmes courants

### Problème 1 : Erreur "API key missing"

**Symptôme** : Erreur `API key missing` après la migration.

**Cause** : Le refresh token a peut-être expiré ou été révoqué par Google (changement de mot de passe, incident de sécurité, etc.).

**Solution** :

```bash
# Supprimer le fichier de compte et se réauthentifier
rm ~/.config/opencode/antigravity-accounts.json  # macOS/Linux
del "%APPDATA%\opencode\antigravity-accounts.json"  # Windows

opencode auth login
```

### Problème 2 : Version du plugin incompatible

**Symptôme** : Le fichier de compte ne peut pas être chargé après la migration, les logs indiquent `Unknown storage version`.

**Cause** : La version du plugin sur la machine cible est trop ancienne et ne supporte pas le format de stockage actuel.

**Solution** :

```bash
# Mettre à jour vers la dernière version
opencode plugin add opencode-antigravity-auth@latest

# Retester
opencode auth login
```

### Problème 3 : Perte des données du double pool de quotas

**Symptôme** : Après la migration, le modèle Gemini n'utilise qu'un seul pool de quotas, sans fallback automatique.

**Cause** : Seul `antigravity-accounts.json` a été copié lors de la migration, mais pas le fichier de configuration `antigravity.json`.

**Solution** :

Copier également le fichier de configuration (si `quota_fallback` est activé) :

::: code-group

```bash [macOS/Linux]
# Copier le fichier de configuration
cp ~/.config/opencode/antigravity.json ~/.config/opencode/
```

```powershell [Windows]
# Copier le fichier de configuration
Copy-Item "$env:APPDATA\opencode\antigravity.json" "$env:APPDATA\opencode\"
```

:::

### Problème 4 : Erreur de permissions de fichier

**Symptôme** : Message `Permission denied` sur macOS/Linux.

**Cause** : Les permissions du fichier sont incorrectes, le plugin ne peut pas le lire.

**Solution** :

```bash
# Corriger les permissions
chmod 600 ~/.config/opencode/antigravity-accounts.json
chown $USER ~/.config/opencode/antigravity-accounts.json
```

## Détails de la migration automatique du format de stockage

Lors du chargement des comptes, le plugin détecte automatiquement la version de stockage et effectue la migration :

```
v1 (ancienne version)
  ↓ migrateV1ToV2()
v2
  ↓ migrateV2ToV3()
v3 (version actuelle)
```

**Règles de migration** :
- v1 → v2 : Séparation de `rateLimitResetTime` en deux champs `claude` et `gemini`
- v2 → v3 : Séparation de `gemini` en `gemini-antigravity` et `gemini-cli` (support du double pool de quotas)
- Nettoyage automatique : Les temps de limitation de débit expirés sont filtrés (`> Date.now()`)

::: info Déduplication automatique
Lors du chargement des comptes, le plugin déduplique automatiquement par email, en conservant le compte le plus récent (trié par `lastUsed` et `addedAt`).
:::

## Résumé

Les étapes clés de la migration de compte :

1. **Localiser le fichier** : Trouver `antigravity-accounts.json` sur la machine source
2. **Copier et transférer** : Transférer de manière sécurisée vers la machine cible
3. **Placer correctement** : Mettre dans le répertoire de configuration (`~/.config/opencode/` ou `%APPDATA%\opencode\`)
4. **Vérifier et tester** : Exécuter `opencode auth login` pour confirmer la reconnaissance

Le plugin **gère automatiquement la migration de version**, pas besoin de modifier manuellement le format du fichier de stockage. Cependant, en cas d'erreur `invalid_grant`, une réauthentification est nécessaire.

## Prochaine leçon

> Dans la prochaine leçon, nous aborderons **[Avertissement ToS](../tos-warning/)**.
>
> Vous apprendrez :
> - Les risques potentiels liés à l'utilisation d'Antigravity Auth
> - Comment éviter le bannissement de compte
> - Les restrictions des conditions d'utilisation de Google

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Définition du format de stockage | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L128-L198) | 128-198 |
| Migration v1→v2 | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L366-L395) | 366-395 |
| Migration v2→v3 | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L397-L431) | 397-431 |
| Chargement des comptes (avec migration auto) | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L433-L518) | 433-518 |
| Chemin du répertoire de configuration | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L202-L213) | 202-213 |
| Logique de déduplication | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L301-L364) | 301-364 |

**Interfaces clés** :

- `AccountStorageV3` (format de stockage v3) :
  ```typescript
  interface AccountStorageV3 {
    version: 3;
    accounts: AccountMetadataV3[];
    activeIndex: number;
    activeIndexByFamily?: { claude?: number; gemini?: number; };
  }
  ```

- `AccountMetadataV3` (métadonnées de compte) :
  ```typescript
  interface AccountMetadataV3 {
    email?: string;                    // Email du compte Google
    refreshToken: string;              // OAuth refresh token (essentiel)
    projectId?: string;                // ID du projet GCP
    managedProjectId?: string;         // ID du projet géré
    addedAt: number;                   // Horodatage d'ajout
    lastUsed: number;                  // Dernière utilisation
    lastSwitchReason?: "rate-limit" | "initial" | "rotation";
    rateLimitResetTimes?: RateLimitStateV3;  // Temps de réinitialisation de la limite (v3 supporte le double pool)
    coolingDownUntil?: number;          // Fin de la période de refroidissement
    cooldownReason?: CooldownReason;   // Raison du refroidissement
  }
  ```

- `RateLimitStateV3` (état de limitation de débit v3) :
  ```typescript
  interface RateLimitStateV3 {
    claude?: number;                  // Temps de réinitialisation du quota Claude
    "gemini-antigravity"?: number;    // Temps de réinitialisation du quota Gemini Antigravity
    "gemini-cli"?: number;            // Temps de réinitialisation du quota Gemini CLI
  }
  ```

**Fonctions clés** :
- `loadAccounts()` : Charge le fichier de compte, détecte automatiquement la version et migre (storage.ts:433)
- `migrateV1ToV2()` : Migre le format v1 vers v2 (storage.ts:366)
- `migrateV2ToV3()` : Migre le format v2 vers v3 (storage.ts:397)
- `deduplicateAccountsByEmail()` : Déduplique par email, conserve le compte le plus récent (storage.ts:301)
- `getStoragePath()` : Obtient le chemin du fichier de stockage, compatible multi-plateforme (storage.ts:215)

**Logique de migration** :
- Détection du champ `data.version` (storage.ts:446)
- v1 : Migration vers v2, puis vers v3 (storage.ts:447-457)
- v2 : Migration directe vers v3 (storage.ts:458-468)
- v3 : Pas de migration nécessaire, chargement direct (storage.ts:469-470)
- Nettoyage automatique des temps de limitation de débit expirés (storage.ts:404-410)

</details>

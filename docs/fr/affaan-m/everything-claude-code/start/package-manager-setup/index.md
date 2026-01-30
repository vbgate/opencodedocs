---
title: "Configuration du Gestionnaire de Paquets : Détection Automatique | Everything Claude Code"
sidebarTitle: "Commandes de Projet Unifiées"
subtitle: "Configuration du Gestionnaire de Paquets : Détection Automatique | Everything Claude Code"
description: "Apprenez la configuration de la détection automatique du gestionnaire de paquets. Maîtrisez le mécanisme de 6 niveaux de priorité, prenant en charge npm/pnpm/yarn/bun, unifiant les commandes multi-projets."
tags:
  - "package-manager"
  - "configuration"
  - "npm"
  - "pnpm"
prerequisite:
  - "start-installation"
order: 30
---

# Configuration du Gestionnaire de Paquets : Détection Automatique et Personnalisation

## Ce Que Vous Apprendrez

- ✅ Détecter automatiquement le gestionnaire de paquets utilisé par votre projet (npm/pnpm/yarn/bun)
- ✅ Comprendre le mécanisme de 6 niveaux de priorité de détection
- ✅ Configurer le gestionnaire de paquets au niveau global et du projet
- ✅ Utiliser la commande `/setup-pm` pour une configuration rapide
- ✅ Gérer les scénarios multi-projets avec différents gestionnaires de paquets

## Votre Situation Actuelle

Vous avez de plus en plus de projets, certains utilisant npm, d'autres pnpm, et encore d'autres yarn ou bun. Chaque fois que vous entrez des commandes dans Claude Code, vous devez vous souvenir :

- Ce projet utilise-t-il `npm install` ou `pnpm install` ?
- Dois-je utiliser `npx`, `pnpm dlx` ou `bunx` ?
- Les scripts s'exécutent-ils avec `npm run dev`, `pnpm dev` ou `bun run dev` ?

Une seule erreur, et la commande échoue, vous faisant perdre du temps.

## Quand Utiliser Cette Fonctionnalité

- **Lors du démarrage d'un nouveau projet** : Configurez immédiatement après avoir choisi votre gestionnaire de paquets
- **Lors du changement de projet** : Vérifiez que la détection est correcte
- **En travaillant en équipe** : Assurez-vous que tous les membres utilisent le même style de commandes
- **En environnement multi-gestionnaires** : Configuration globale + remplacements par projet pour une gestion flexible

::: tip Pourquoi Configurer un Gestionnaire de Paquets ?
Les hooks et agents de Everything Claude Code génèrent automatiquement des commandes liées au gestionnaire de paquets. Si la détection est incorrecte, toutes les commandes utiliseront le mauvais outil, entraînant des échecs d'opération.
:::

## 🎒 Préparation Avant de Commencer

::: warning Vérification Préalable
Avant de commencer cette leçon, assurez-vous d'avoir suivi le [Guide d'Installation](../installation/), et que l'extension est correctement installée dans Claude Code.
:::

Vérifiez que votre système a les gestionnaires de paquets installés :

```bash
# Vérifier les gestionnaires de paquets installés
which npm pnpm yarn bun

# Ou sous Windows (PowerShell)
Get-Command npm, pnpm, yarn, bun -ErrorAction SilentlyContinue
```

Si vous voyez une sortie similaire, cela signifie qu'ils sont installés :

```
/usr/local/bin/npm
/usr/local/bin/pnpm
```

Si un gestionnaire de paquets n'est pas trouvé, vous devez d'abord l'installer (ce tutoriel ne couvre pas l'installation).

## Concept Fondamental

Everything Claude Code utilise un **mécanisme de détection intelligente** qui choisit automatiquement le gestionnaire de paquets selon 6 niveaux de priorité. Vous n'avez qu'à le configurer au bon endroit une fois, et il fonctionnera correctement dans tous les scénarios.

### Priorité de Détection (du Plus Haut au Plus Bas)

```
1. Variable d'environnement CLAUDE_PACKAGE_MANAGER  ─── Priorité la plus élevée, remplacement temporaire
2. Configuration projet .claude/package-manager.json  ─── Remplacement au niveau projet
3. Champ packageManager de package.json  ─── Standard du projet
4. Fichier Lock (pnpm-lock.yaml, etc.)  ─── Détection automatique
5. Configuration globale ~/.claude/package-manager.json  ─── Défaut global
6. Fallback : chercher le premier disponible  ─── Solution de secours
```

### Pourquoi Cet Ordre ?

- **Variable d'environnement en premier** : Facilite le changement temporaire (comme dans les environnements CI/CD)
- **Configuration projet ensuite** : Uniformité forcée au sein d'un même projet
- **Champ package.json** : C'est la norme Node.js
- **Fichier Lock** : Fichiers réellement utilisés par le projet
- **Configuration globale** : Préférences personnelles par défaut
- **Fallback** : Assure qu'il y a toujours un outil disponible

## Suivez-Moi

### Étape 1 : Détecter la Configuration Actuelle

**Pourquoi**
Comprendre d'abord la situation de détection actuelle pour confirmer si une configuration manuelle est nécessaire.

```bash
# Détecter le gestionnaire de paquets actuel
node scripts/setup-package-manager.js --detect
```

**Vous devriez voir** :

```
=== Package Manager Detection ===

Current selection:
  Package Manager: pnpm
  Source: lock-file

Detection results:
  From package.json: not specified
  From lock file: pnpm
  Environment var: not set

Available package managers:
  ✓ npm
  ✓ pnpm (current)
  ✗ yarn
  ✓ bun

Commands:
  Install: pnpm install
  Run script: pnpm [script-name]
  Execute binary: pnpm dlx [binary-name]
```

Si le gestionnaire de paquets affiché correspond à vos attentes, cela signifie que la détection est correcte et qu'aucune configuration manuelle n'est nécessaire.

### Étape 2 : Configurer le Gestionnaire de Paquets Global par Défaut

**Pourquoi**
Définir un global par défaut pour tous vos projets pour réduire les configurations répétitives.

```bash
# Définir pnpm comme global par défaut
node scripts/setup-package-manager.js --global pnpm
```

**Vous devriez voir** :

```
✓ Global preference set to: pnpm
  Saved to: ~/.claude/package-manager.json
```

Vérifiez le fichier de configuration généré :

```bash
cat ~/.claude/package-manager.json
```

**Vous devriez voir** :

```json
{
  "packageManager": "pnpm",
  "setAt": "2026-01-25T12:00:00.000Z"
}
```

### Étape 3 : Configurer le Gestionnaire de Paquets au Niveau du Projet

**Pourquoi**
Certains projets peuvent nécessiter un gestionnaire de paquets spécifique (comme des fonctionnalités spécifiques). La configuration au niveau du projet remplacera le paramètre global.

```bash
# Définir bun pour le projet actuel
node scripts/setup-package-manager.js --project bun
```

**Vous devriez voir** :

```
✓ Project preference set to: bun
  Saved to: .claude/package-manager.json
```

Vérifiez le fichier de configuration généré :

```bash
cat .claude/package-manager.json
```

**Vous devriez voir** :

```json
{
  "packageManager": "bun",
  "setAt": "2026-01-25T12:00:00.000Z"
}
```

::: tip Configuration Projet vs Configuration Globale
- **Configuration Globale** : ~/.claude/package-manager.json, affecte tous les projets
- **Configuration Projet** : .claude/package-manager.json, n'affecte que le projet actuel, priorité plus élevée
:::

### Étape 4 : Utiliser la Commande /setup-pm (Optionnel)

**Pourquoi**
Si vous ne voulez pas exécuter le script manuellement, vous pouvez utiliser directement la commande slash dans Claude Code.

Dans Claude Code, tapez :

```
/setup-pm
```

Claude Code appelle le script et affiche des options interactives.

**Vous devriez voir** une sortie de détection similaire :

```
[PackageManager] Available package managers:
  - npm
  - pnpm (current)
  - bun

To set your preferred package manager:
  - Global: Set CLAUDE_PACKAGE_MANAGER environment variable
  - Or add to ~/.claude/package-manager.json: {"packageManager": "pnpm"}
  - Or add to package.json: {"packageManager": "pnpm@8"}
```

### Étape 5 : Vérifier la Logique de Détection

**Pourquoi**
Après avoir compris la priorité de détection, vous pouvez prédire les résultats dans différentes situations.

Testons plusieurs scénarios :

**Scénario 1 : Détection par Fichier Lock**

```bash
# Supprimer la configuration du projet
rm .claude/package-manager.json

# Détecter
node scripts/setup-package-manager.js --detect
```

**Vous devriez voir** `Source: lock-file` (si un fichier lock existe)

**Scénario 2 : Champ package.json**

```bash
# Ajouter à package.json
cat >> package.json << 'EOF'
  "packageManager": "pnpm@8.6.0"
EOF

# Détecter
node scripts/setup-package-manager.js --detect
```

**Vous devriez voir** `From package.json: pnpm@8.6.0`

**Scénario 3 : Remplacement par Variable d'Environnement**

```bash
# Définir temporairement la variable d'environnement
export CLAUDE_PACKAGE_MANAGER=yarn

# Détecter
node scripts/setup-package-manager.js --detect
```

**Vous devriez voir** `Source: environment` et `Package Manager: yarn`

```bash
# Supprimer la variable d'environnement
unset CLAUDE_PACKAGE_MANAGER
```

## Points de Contrôle ✅

Assurez-vous que les points de contrôle suivants sont validés :

- [ ] L'exécution de la commande `--detect` identifie correctement le gestionnaire de paquets actuel
- [ ] Le fichier de configuration globale a été créé : `~/.claude/package-manager.json`
- [ ] Le fichier de configuration du projet a été créé (si nécessaire) : `.claude/package-manager.json`
- [ ] Les relations de priorité entre différents niveaux correspondent aux attentes
- [ ] Les gestionnaires de paquets listés comme disponibles correspondent à ceux réellement installés

## Pièges à Éviter

### ❌ Erreur 1 : Configuration Définie mais Non Appliquée

**Symptôme** : Vous avez configuré `pnpm`, mais la détection affiche `npm`.

**Cause** :
- La priorité du fichier Lock est supérieure à la configuration globale (si un fichier Lock existe)
- Le champ `packageManager` de package.json a également une priorité supérieure à la configuration globale

**Solution** :
```bash
# Vérifier la source de détection
node scripts/setup-package-manager.js --detect

# Si c'est un fichier Lock ou package.json, vérifiez ces fichiers
ls -la | grep -E "(package-lock|yarn.lock|pnpm-lock|bun.lockb)"
cat package.json | grep packageManager
```

### ❌ Erreur 2 : Gestionnaire de Paquets Configuré mais Non Installé

**Symptôme** : Vous avez configuré `bun`, mais le système n'est pas installé.

**Résultat de détection** affichera :

```
Available package managers:
  ✓ npm
  ✗ bun (current)  ← Note : bien que marqué comme current, il n'est pas installé
```

**Solution** : Installez d'abord le gestionnaire de paquets, ou configurez-en un autre qui est installé.

```bash
# Lister les gestionnaires de paquets disponibles
node scripts/setup-package-manager.js --list

# Basculer vers un gestionnaire installé
node scripts/setup-package-manager.js --global npm
```

### ❌ Erreur 3 : Problèmes de Chemin sous Windows

**Symptôme** : Sous Windows, l'exécution du script génère une erreur indiquant que le fichier est introuvable.

**Cause** : Problème de séparateur de chemin Node.js (le code source a déjà traité ce problème, mais assurez-vous d'utiliser la commande correcte).

**Solution** : Utilisez PowerShell ou Git Bash, assurez-vous que les chemins sont corrects :

```powershell
# PowerShell
node scripts\setup-package-manager.js --detect
```

### ❌ Erreur 4 : Configuration Projet Affectant d'Autres Projets

**Symptôme** : Le projet A est configuré avec `bun`, mais après être passé au projet B, il utilise toujours `bun`.

**Cause** : La configuration du projet ne prend effet que dans le répertoire du projet actuel, elle sera redétectée après le changement de répertoire.

**Solution** : C'est un comportement normal. La configuration du projet n'affecte que le projet actuel et ne pollue pas les autres projets.

## Résumé de la Leçon

Le mécanisme de détection du gestionnaire de paquets d'Everything Claude Code est très intelligent :

- **6 niveaux de priorité** : Variable d'environnement > Configuration projet > package.json > Fichier Lock > Configuration globale > fallback
- **Configuration flexible** : Supporte les valeurs par défaut globales et les remplacements par projet
- **Détection automatique** : Dans la plupart des cas, aucune configuration manuelle n'est nécessaire
- **Commandes unifiées** : Après configuration, tous les hooks et agents utiliseront les commandes correctes

**Stratégie de Configuration Recommandée** :

1. Définissez globalement le gestionnaire de paquets que vous utilisez le plus (par exemple `pnpm`)
2. Remplacez au niveau du projet pour les cas spéciaux (comme les performances dépendantes de `bun`)
3. Laissez la détection automatique gérer les autres cas

## Aperçu de la Leçon Suivante

> Dans la leçon suivante, nous apprendrons la **[Configuration des Serveurs MCP](../mcp-setup/)**.
>
> Vous apprendrez :
> - Comment configurer plus de 15 serveurs MCP prédéfinis
> - Comment les serveurs MCP étendent les capacités de Claude Code
> - Comment gérer l'état d'activation des serveurs MCP et l'utilisation des Tokens

---

## Annexe : Référence du Code Source

<details>
<summary><strong>Cliquez pour développer et voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-25

| Fonctionnalité | Chemin du Fichier | Numéros de Ligne |
| --- | --- | --- |
| Logique principale de détection du gestionnaire de paquets | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L157-L236) | 157-236 |
| Détection par fichier Lock | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L92-L102) | 92-102 |
| Détection par package.json | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L107-L126) | 107-126 |
| Définition du gestionnaire de paquets (configuration) | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L13-L54) | 13-54 |
| Définition de la priorité de détection | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L57) | 57 |
| Sauvegarde de la configuration globale | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L241-L252) | 241-252 |
| Sauvegarde de la configuration du projet | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L257-L272) | 257-272 |
| Point d'entrée du script en ligne de commande | [`scripts/setup-package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/setup-package-manager.js#L158-L206) | 158-206 |
| Implémentation de la commande de détection | [`scripts/setup-package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/setup-package-manager.js#L62-L95) | 62-95 |

**Constantes Clés** :
- `PACKAGE_MANAGERS` : Gestionnaires de paquets pris en charge et configuration des commandes (lignes 13-54)
- `DETECTION_PRIORITY` : Ordre de priorité de détection `['pnpm', 'bun', 'yarn', 'npm']` (ligne 57)

**Fonctions Clés** :
- `getPackageManager()` : Logique de détection principale, retourne le gestionnaire de paquets par priorité (lignes 157-236)
- `detectFromLockFile()` : Détecte le gestionnaire de paquets à partir du fichier lock (lignes 92-102)
- `detectFromPackageJson()` : Détecte le gestionnaire de paquets à partir de package.json (lignes 107-126)
- `setPreferredPackageManager()` : Sauvegarde la configuration globale (lignes 241-252)
- `setProjectPackageManager()` : Sauvegarde la configuration du projet (lignes 257-272)

**Implémentation de la Priorité de Détection** (lignes 157-236 du code source) :
```javascript
function getPackageManager(options = {}) {
  // 1. Variable d'environnement (priorité la plus élevée)
  if (envPm && PACKAGE_MANAGERS[envPm]) { return { name: envPm, source: 'environment' }; }

  // 2. Configuration du projet
  if (projectConfig) { return { name: config.packageManager, source: 'project-config' }; }

  // 3. Champ package.json
  if (fromPackageJson) { return { name: fromPackageJson, source: 'package.json' }; }

  // 4. Fichier Lock
  if (fromLockFile) { return { name: fromLockFile, source: 'lock-file' }; }

  // 5. Configuration globale
  if (globalConfig) { return { name: globalConfig.packageManager, source: 'global-config' }; }

  // 6. Fallback : chercher le premier disponible
  for (const pmName of fallbackOrder) {
    if (available.includes(pmName)) { return { name: pmName, source: 'fallback' }; }
  }

  // Défaut npm
  return { name: 'npm', source: 'default' };
}
```

</details>

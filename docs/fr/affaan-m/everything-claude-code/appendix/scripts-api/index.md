---
title: "API Scripts : Scripts Node.js | Everything Claude Code"
sidebarTitle: "Écrire vos Scripts Hook"
subtitle: "API Scripts : Scripts Node.js"
description: "Apprenez l'interface API Scripts d'Everything Claude Code. Maîtrisez la détection de plateforme, les opérations de fichiers, l'API du gestionnaire de paquets et l'utilisation des scripts Hook."
tags:
  - "scripts-api"
  - "api"
  - "nodejs"
  - "utils"
  - "package-manager"
  - "hooks"
prerequisite:
  - "start-package-manager-setup"
order: 215
---

# Référence API Scripts : Interface Scripts Node.js

## Ce Que Vous Apprendrez

- Comprendre complètement l'interface API scripts d'Everything Claude Code
- Utiliser la détection de plateforme et les fonctions utilitaires multiplateformes
- Configurer et utiliser le mécanisme de détection automatique du gestionnaire de paquets
- Écrire des scripts Hook personnalisés pour étendre les capacités d'automatisation
- Déboguer et modifier les implémentations de scripts existantes

## Votre Situation Actuelle

Vous savez déjà qu'Everything Claude Code dispose de nombreux scripts d'automatisation, mais vous rencontrez ces problèmes :

- "Quelles API ces scripts Node.js fournissent-ils exactement ?"
- "Comment personnaliser les scripts Hook ?"
- "Quelle est la priorité de détection du gestionnaire de paquets ?"
- "Comment implémenter la compatibilité multiplateforme dans les scripts ?"

Ce tutoriel vous fournira un manuel de référence complet de l'API Scripts.

## Concept Fondamental

Le système de scripts d'Everything Claude Code se divise en deux catégories :

1. **Bibliothèque d'outils partagés** (`scripts/lib/`) - Fournit des fonctions et API multiplateformes
2. **Scripts Hook** (`scripts/hooks/`) - Logique d'automatisation déclenchée lors d'événements spécifiques

Tous les scripts supportent **Windows, macOS et Linux**, implémentés avec des modules natifs Node.js.

### Structure des Scripts

```
scripts/
├── lib/
│   ├── utils.js              # Fonctions utilitaires générales
│   └── package-manager.js    # Détection du gestionnaire de paquets
├── hooks/
│   ├── session-start.js       # Hook SessionStart
│   ├── session-end.js         # Hook SessionEnd
│   ├── pre-compact.js        # Hook PreCompact
│   ├── suggest-compact.js     # Hook PreToolUse
│   └── evaluate-session.js   # Hook Stop
└── setup-package-manager.js   # Script de configuration du gestionnaire de paquets
```

## lib/utils.js - Fonctions Utilitaires Générales

Ce module fournit des fonctions utilitaires multiplateformes, incluant la détection de plateforme, les opérations de fichiers, les commandes système, etc.

### Détection de Plateforme

```javascript
const {
  isWindows,
  isMacOS,
  isLinux
} = require('./lib/utils');
```

| Fonction | Type | Valeur de Retour | Description |
| --- | --- | --- | --- |
| `isWindows` | boolean | `true/false` | Si la plateforme actuelle est Windows |
| `isMacOS` | boolean | `true/false` | Si la plateforme actuelle est macOS |
| `isLinux` | boolean | `true/false` | Si la plateforme actuelle est Linux |

**Principe d'implémentation** : Basé sur le jugement de `process.platform`

```javascript
const isWindows = process.platform === 'win32';
const isMacOS = process.platform === 'darwin';
const isLinux = process.platform === 'linux';
```

### Outils de Répertoire

```javascript
const {
  getHomeDir,
  getClaudeDir,
  getSessionsDir,
  getLearnedSkillsDir,
  getTempDir,
  ensureDir
} = require('./lib/utils');
```

#### getHomeDir()

Obtient le répertoire personnel de l'utilisateur (compatible multiplateforme)

**Valeur de retour** : `string` - Chemin du répertoire personnel

**Exemple** :
```javascript
const homeDir = getHomeDir();
// Windows: C:\Users\username
// macOS: /Users/username
// Linux: /home/username
```

#### getClaudeDir()

Obtient le répertoire de configuration de Claude Code

**Valeur de retour** : `string` - Chemin du répertoire `~/.claude`

**Exemple** :
```javascript
const claudeDir = getClaudeDir();
// /Users/username/.claude
```

#### getSessionsDir()

Obtient le répertoire des fichiers de session

**Valeur de retour** : `string` - Chemin du répertoire `~/.claude/sessions`

**Exemple** :
```javascript
const sessionsDir = getSessionsDir();
// /Users/username/.claude/sessions
```

#### getLearnedSkillsDir()

Obtient le répertoire des compétences apprises

**Valeur de retour** : `string` - Chemin du répertoire `~/.claude/skills/learned`

**Exemple** :
```javascript
const learnedDir = getLearnedSkillsDir();
// /Users/username/.claude/skills/learned
```

#### getTempDir()

Obtient le répertoire temporaire du système (multiplateforme)

**Valeur de retour** : `string` - Chemin du répertoire temporaire

**Exemple** :
```javascript
const tempDir = getTempDir();
// macOS: /var/folders/...
// Linux: /tmp
// Windows: C:\Users\username\AppData\Local\Temp
```

#### ensureDir(dirPath)

Assure l'existence du répertoire, le crée s'il n'existe pas

**Paramètres** :
- `dirPath` (string) - Chemin du répertoire

**Valeur de retour** : `string` - Chemin du répertoire

**Exemple** :
```javascript
const dir = ensureDir('/path/to/new/dir');
// Si le répertoire n'existe pas, il sera créé récursivement
```

### Outils de Date et Heure

```javascript
const {
  getDateString,
  getTimeString,
  getDateTimeString
} = require('./lib/utils');
```

#### getDateString()

Obtient la date actuelle (format : YYYY-MM-DD)

**Valeur de retour** : `string` - Chaîne de date

**Exemple** :
```javascript
const date = getDateString();
// '2026-01-25'
```

#### getTimeString()

Obtient l'heure actuelle (format : HH:MM)

**Valeur de retour** : `string` - Chaîne d'heure

**Exemple** :
```javascript
const time = getTimeString();
// '14:30'
```

#### getDateTimeString()

Obtient la date et l'heure actuelles (format : YYYY-MM-DD HH:MM:SS)

**Valeur de retour** : `string` - Chaîne de date et heure

**Exemple** :
```javascript
const datetime = getDateTimeString();
// '2026-01-25 14:30:45'
```

### Opérations de Fichiers

```javascript
const {
  findFiles,
  readFile,
  writeFile,
  appendFile,
  replaceInFile,
  countInFile,
  grepFile
} = require('./lib/utils');
```

#### findFiles(dir, pattern, options)

Recherche des fichiers correspondant au motif dans un répertoire (alternative multiplateforme à `find`)

**Paramètres** :
- `dir` (string) - Répertoire à rechercher
- `pattern` (string) - Motif de fichier (ex : `"*.tmp"`, `"*.md"`)
- `options` (object, optionnel) - Options
  - `maxAge` (number) - Âge maximum du fichier en jours
  - `recursive` (boolean) - Recherche récursive ou non

**Valeur de retour** : `Array<{path: string, mtime: number}>` - Liste des fichiers correspondants, triés par date de modification décroissante

**Exemple** :
```javascript
// Rechercher les fichiers .tmp des 7 derniers jours
const recentFiles = findFiles('/tmp', '*.tmp', { maxAge: 7 });
// [{ path: '/tmp/session.tmp', mtime: 1737804000000 }]

// Rechercher récursivement tous les fichiers .md
const allMdFiles = findFiles('./docs', '*.md', { recursive: true });
```

::: tip Compatibilité Multiplateforme
Cette fonction fournit une fonctionnalité de recherche de fichiers multiplateforme, ne dépend pas de la commande Unix `find`, et fonctionne donc normalement sous Windows.
:::

#### readFile(filePath)

Lecture sécurisée d'un fichier texte

**Paramètres** :
- `filePath` (string) - Chemin du fichier

**Valeur de retour** : `string | null` - Contenu du fichier, retourne `null` en cas d'échec de lecture

**Exemple** :
```javascript
const content = readFile('/path/to/file.txt');
if (content !== null) {
  console.log(content);
}
```

#### writeFile(filePath, content)

Écriture dans un fichier texte

**Paramètres** :
- `filePath` (string) - Chemin du fichier
- `content` (string) - Contenu du fichier

**Valeur de retour** : Aucune

**Exemple** :
```javascript
writeFile('/path/to/file.txt', 'Hello, World!');
// Si le répertoire n'existe pas, il sera créé automatiquement
```

#### appendFile(filePath, content)

Ajoute du contenu à un fichier texte

**Paramètres** :
- `filePath` (string) - Chemin du fichier
- `content` (string) - Contenu à ajouter

**Valeur de retour** : Aucune

**Exemple** :
```javascript
appendFile('/path/to/log.txt', 'New log entry\n');
```

#### replaceInFile(filePath, search, replace)

Remplace du texte dans un fichier (alternative multiplateforme à `sed`)

**Paramètres** :
- `filePath` (string) - Chemin du fichier
- `search` (string | RegExp) - Contenu à rechercher
- `replace` (string) - Contenu de remplacement

**Valeur de retour** : `boolean` - Si le remplacement a réussi

**Exemple** :
```javascript
const success = replaceInFile('/path/to/file.txt', 'old text', 'new text');
// true: remplacement réussi
// false: fichier inexistant ou échec de lecture
```

#### countInFile(filePath, pattern)

Compte le nombre d'occurrences d'un motif dans un fichier

**Paramètres** :
- `filePath` (string) - Chemin du fichier
- `pattern` (string | RegExp) - Motif à compter

**Valeur de retour** : `number` - Nombre de correspondances

**Exemple** :
```javascript
const count = countInFile('/path/to/file.txt', /error/g);
// 5
```

#### grepFile(filePath, pattern)

Recherche un motif dans un fichier et retourne les lignes et numéros de ligne correspondants

**Paramètres** :
- `filePath` (string) - Chemin du fichier
- `pattern` (string | RegExp) - Motif à rechercher

**Valeur de retour** : `Array<{lineNumber: number, content: string}>` - Liste des lignes correspondantes

**Exemple** :
```javascript
const matches = grepFile('/path/to/file.txt', /function\s+\w+/);
// [{ lineNumber: 10, content: 'function test() {...}' }]
```


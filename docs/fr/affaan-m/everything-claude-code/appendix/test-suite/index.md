---
title: "Suite de tests : Exécution et personnalisation | everything-claude-code"
sidebarTitle: "Exécuter tous les tests"
subtitle: "Suite de tests : Exécution et personnalisation"
description: "Apprenez à exécuter la suite de tests d'everything-claude-code. Couvre 56 cas de test incluant les modules utils, package-manager et hooks, avec des explications sur les tests multiplateformes, l'utilisation du framework et les étapes de personnalisation."
tags:
  - "testing"
  - "test-suite"
  - "qa"
prerequisite:
  - "start-installation"
order: 220
---

# Suite de tests : Exécution et personnalisation

Everything Claude Code inclut une suite de tests complète pour valider le bon fonctionnement des scripts et des fonctions utilitaires. Cet article présente comment exécuter la suite de tests, sa couverture et comment ajouter des tests personnalisés.

## Qu'est-ce qu'une suite de tests ?

Une **suite de tests** est un ensemble de scripts de tests automatisés et de cas de test utilisés pour valider le bon fonctionnement d'un logiciel. La suite de tests d'Everything Claude Code contient 56 cas de test couvrant les fonctions utilitaires multiplateformes, la détection des gestionnaires de paquets et les scripts Hook, garantissant un fonctionnement correct sur différents systèmes d'exploitation.

::: info Pourquoi avons-nous besoin d'une suite de tests ?

La suite de tests garantit que l'ajout de nouvelles fonctionnalités ou la modification du code existant ne casse pas accidentellement les fonctionnalités existantes. En particulier pour les scripts Node.js multiplateformes, les tests peuvent vérifier la cohérence du comportement sur différents systèmes d'exploitation.

:::

---

## Vue d'ensemble de la suite de tests

La suite de tests se trouve dans le répertoire `tests/` avec la structure suivante :

```
tests/
├── lib/                          # Tests de la bibliothèque utilitaire
│   ├── utils.test.js              # Tests des fonctions utilitaires multiplateformes (21 tests)
│   └── package-manager.test.js    # Tests de détection des gestionnaires de paquets (21 tests)
├── hooks/                        # Tests des scripts Hook
│   └── hooks.test.js             # Tests des scripts Hook (14 tests)
└── run-all.js                    # Exécuteur de tests principal
```

**Couverture des tests** :

| Module | Nombre de tests | Contenu couvert |
| --- | --- | --- |
| `utils.js` | 21 | Détection de plateforme, opérations sur les répertoires, opérations sur les fichiers, date/heure, commandes système |
| `package-manager.js` | 21 | Détection des gestionnaires de paquets, génération de commandes, logique de priorité |
| Scripts Hook | 14 | Cycle de vie des sessions, suggestions de compression, évaluation des sessions, validation de hooks.json |
| **Total** | **56** | Validation complète des fonctionnalités |

---

## Exécution des tests

### Exécuter tous les tests

Dans le répertoire racine du plugin, exécutez :

```bash
node tests/run-all.js
```

**Vous devriez voir** :

```
╔════════════════════════════════════════════════════════╗
║           Everything Claude Code - Test Suite            ║
╚════════════════════════════════════════════════════════╝

━━━ Running lib/utils.test.js ━━━

=== Testing utils.js ===

Platform Detection:
  ✓ isWindows/isMacOS/isLinux are booleans
  ✓ exactly one platform should be true

Directory Functions:
  ✓ getHomeDir returns valid path
  ✓ getClaudeDir returns path under home
  ✓ getSessionsDir returns path under Claude dir
  ✓ getTempDir returns valid temp directory
  ✓ ensureDir creates directory

...

=== Test Results ===
Passed: 21
Failed: 0
Total:  21

╔════════════════════════════════════════════════════════╗
║                     Final Results                        ║
╠════════════════════════════════════════════════════════╣
║  Total Tests:   56                                      ║
║  Passed:       56  ✓                                   ║
║  Failed:        0                                       ║
╚════════════════════════════════════════════════════════╝
```

### Exécuter un fichier de test individuel

Si vous souhaitez tester uniquement un module spécifique, vous pouvez exécuter les fichiers de test individuellement :

```bash
# Tester utils.js
node tests/lib/utils.test.js

# Tester package-manager.js
node tests/lib/package-manager.test.js

# Tester les scripts Hook
node tests/hooks/hooks.test.js
```

**Vous devriez voir** (exemple avec utils.test.js) :

```
=== Testing utils.js ===

Platform Detection:
  ✓ isWindows/isMacOS/isLinux are booleans
  ✓ exactly one platform should be true

Directory Functions:
  ✓ getHomeDir returns valid path
  ✓ getClaudeDir returns path under home
  ✓ getSessionsDir returns path under Claude dir
  ...

File Operations:
  ✓ readFile returns null for non-existent file
  ✓ writeFile and readFile work together
  ✓ appendFile adds content to file
  ✓ replaceInFile replaces text
  ✓ countInFile counts occurrences
  ✓ grepFile finds matching lines

System Functions:
  ✓ commandExists finds node
  ✓ commandExists returns false for fake command
  ✓ runCommand executes simple command
  ✓ runCommand handles failed command

=== Test Results ===
Passed: 21
Failed: 0
Total:  21
```

---

## Explication du framework de test

La suite de tests utilise un framework de test léger personnalisé, sans dépendances externes. Chaque fichier de test contient les composants suivants :

### Fonctions auxiliaires de test

```javascript
// Fonction auxiliaire de test synchrone
function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    return true;
  } catch (err) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${err.message}`);
    return false;
  }
}

// Fonction auxiliaire de test asynchrone
async function asyncTest(name, fn) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    return true;
  } catch (err) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${err.message}`);
    return false;
  }
}
```

### Assertions de test

Utilisation du module `assert` intégré à Node.js pour les assertions :

```javascript
const assert = require('assert');

// Assertion d'égalité
assert.strictEqual(actual, expected, 'message');

// Assertion booléenne
assert.ok(condition, 'message');

// Inclusion dans un tableau/objet
assert.ok(array.includes(item), 'message');

// Correspondance regex
assert.ok(regex.test(string), 'message');
```

---

## Détail des modules de test

### lib/utils.test.js

Teste les fonctions utilitaires multiplateformes de `scripts/lib/utils.js`.

**Catégories de tests** :

| Catégorie | Nombre de tests | Fonctionnalités couvertes |
| --- | --- | --- |
| Détection de plateforme | 2 | `isWindows`, `isMacOS`, `isLinux` |
| Fonctions de répertoire | 5 | `getHomeDir`, `getClaudeDir`, `getSessionsDir`, `getTempDir`, `ensureDir` |
| Date/Heure | 3 | `getDateString`, `getTimeString`, `getDateTimeString` |
| Opérations sur fichiers | 6 | `readFile`, `writeFile`, `appendFile`, `replaceInFile`, `countInFile`, `grepFile` |
| Fonctions système | 5 | `commandExists`, `runCommand` |

**Exemple de test clé** :

```javascript
// Test des opérations sur fichiers
test('writeFile and readFile work together', () => {
  const testFile = path.join(utils.getTempDir(), `utils-test-${Date.now()}.txt`);
  const testContent = 'Hello, World!';
  try {
    utils.writeFile(testFile, testContent);
    const read = utils.readFile(testFile);
    assert.strictEqual(read, testContent);
  } finally {
    fs.unlinkSync(testFile);
  }
});
```

### lib/package-manager.test.js

Teste la logique de détection et de sélection des gestionnaires de paquets de `scripts/lib/package-manager.js`.

**Catégories de tests** :

| Catégorie | Nombre de tests | Fonctionnalités couvertes |
| --- | --- | --- |
| Constantes des gestionnaires de paquets | 2 | `PACKAGE_MANAGERS`, intégrité des propriétés |
| Détection des fichiers lock | 5 | Reconnaissance des fichiers lock npm, pnpm, yarn, bun |
| Détection de package.json | 4 | Analyse du champ `packageManager` |
| Gestionnaires de paquets disponibles | 1 | Détection des gestionnaires de paquets système |
| Sélection du gestionnaire de paquets | 3 | Priorité des variables d'environnement, fichiers lock, configuration du projet |
| Génération de commandes | 6 | `getRunCommand`, `getExecCommand`, `getCommandPattern` |

**Exemple de test clé** :

```javascript
// Test de la priorité de détection
test('respects environment variable', () => {
  const originalEnv = process.env.CLAUDE_PACKAGE_MANAGER;
  try {
    process.env.CLAUDE_PACKAGE_MANAGER = 'yarn';
    const result = pm.getPackageManager();
    assert.strictEqual(result.name, 'yarn');
    assert.strictEqual(result.source, 'environment');
  } finally {
    if (originalEnv !== undefined) {
      process.env.CLAUDE_PACKAGE_MANAGER = originalEnv;
    } else {
      delete process.env.CLAUDE_PACKAGE_MANAGER;
    }
  }
});
```

### hooks/hooks.test.js

Teste l'exécution des scripts Hook et la validation de la configuration.

**Catégories de tests** :

| Catégorie | Nombre de tests | Fonctionnalités couvertes |
| --- | --- | --- |
| session-start.js | 2 | Exécution réussie, format de sortie |
| session-end.js | 2 | Exécution réussie, création de fichiers |
| pre-compact.js | 3 | Exécution réussie, format de sortie, création de logs |
| suggest-compact.js | 3 | Exécution réussie, compteur, déclenchement du seuil |
| evaluate-session.js | 3 | Saut des sessions courtes, traitement des sessions longues, comptage des messages |
| Validation de hooks.json | 4 | Validité JSON, types d'événements, préfixe node, variables de chemin |

**Exemple de test clé** :

```javascript
// Test de la configuration hooks.json
test('all hook commands use node', () => {
  const hooksPath = path.join(__dirname, '..', '..', 'hooks', 'hooks.json');
  const hooks = JSON.parse(fs.readFileSync(hooksPath, 'utf8'));

  const checkHooks = (hookArray) => {
    for (const entry of hookArray) {
      for (const hook of entry.hooks) {
        if (hook.type === 'command') {
          assert.ok(
            hook.command.startsWith('node'),
            `Hook command should start with 'node': ${hook.command.substring(0, 50)}...`
          );
        }
      }
    }
  };

  for (const [eventType, hookArray] of Object.entries(hooks.hooks)) {
    checkHooks(hookArray);
  }
});
```

---

## Ajouter de nouveaux tests

### Créer un fichier de test

1. Créez un nouveau fichier de test dans le répertoire `tests/`
2. Utilisez les fonctions auxiliaires de test pour encapsuler les cas de test
3. Utilisez le module `assert` pour les assertions
4. Enregistrez le nouveau fichier de test dans `run-all.js`

**Exemple** : Créer un nouveau fichier de test `tests/lib/new-module.test.js`

```javascript
/**
 * Tests for scripts/lib/new-module.js
 *
 * Run with: node tests/lib/new-module.test.js
 */

const assert = require('assert');
const newModule = require('../../scripts/lib/new-module');

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    return true;
  } catch (err) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${err.message}`);
    return false;
  }
}

function runTests() {
  console.log('\n=== Testing new-module.js ===\n');

  let passed = 0;
  let failed = 0;

  // Vos cas de test
  if (test('basic functionality', () => {
    assert.strictEqual(newModule.test(), 'expected value');
  })) passed++; else failed++;

  // Résumé
  console.log('\n=== Test Results ===');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total:  ${passed + failed}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
```

### Enregistrer dans run-all.js

Ajoutez le nouveau fichier de test dans `tests/run-all.js` :

```javascript
const testFiles = [
  'lib/utils.test.js',
  'lib/package-manager.test.js',
  'lib/new-module.test.js',  // Ajoutez cette ligne
  'hooks/hooks.test.js'
];
```

---

## Bonnes pratiques de test

### 1. Utiliser try-finally pour nettoyer les ressources

Les fichiers et répertoires temporaires créés pendant les tests doivent être nettoyés :

```javascript
✅ Correct :
test('file operations', () => {
  const testFile = path.join(utils.getTempDir(), `test-${Date.now()}.txt`);
  try {
    utils.writeFile(testFile, 'content');
    // Logique de test
  } finally {
    fs.unlinkSync(testFile);  // Assure le nettoyage
  }
});

❌ Incorrect :
test('file operations', () => {
  const testFile = path.join(utils.getTempDir(), `test-${Date.now()}.txt`);
  utils.writeFile(testFile, 'content');
  // Si le test échoue, le fichier ne sera pas nettoyé
  fs.unlinkSync(testFile);
});
```

### 2. Isoler l'environnement de test

Chaque test doit utiliser un nom de fichier temporaire unique pour éviter les interférences :

```javascript
✅ Correct :
const testFile = path.join(utils.getTempDir(), `test-${Date.now()}.txt`);

❌ Incorrect :
const testFile = path.join(utils.getTempDir(), 'test.txt');
```

### 3. Utiliser des noms de test descriptifs

Les noms de test doivent clairement indiquer ce qui est testé :

```javascript
✅ Correct :
test('detects pnpm from pnpm-lock.yaml', () => { ... });

❌ Incorrect :
test('test1', () => { ... });
```

### 4. Tester les cas limites

Ne testez pas seulement les cas normaux, mais aussi les cas limites et les erreurs :

```javascript
// Tester le cas normal
test('detects npm from package-lock.json', () => { ... });

// Tester un répertoire vide
test('returns null when no lock file exists', () => { ... });

// Tester plusieurs fichiers lock
test('respects detection priority (pnpm > npm)', () => { ... });
```

### 5. Valider la sécurité des entrées

Pour les fonctions qui acceptent des entrées, les tests doivent valider la sécurité :

```javascript
test('commandExists returns false for fake command', () => {
  const exists = utils.commandExists('nonexistent_command_12345');
  assert.strictEqual(exists, false);
});
```

---

## Questions fréquentes

### Que faire si un test échoue ?

1. Examinez le message d'erreur spécifique
2. Vérifiez si la logique du test est correcte
3. Vérifiez si la fonction testée contient un bug
4. Exécutez les tests sur différents systèmes d'exploitation (compatibilité multiplateforme)

### Pourquoi y a-t-il un saut de ligne après `Passed: X Failed: Y` dans la sortie du fichier de test ?

C'est pour la compatibilité avec l'analyse des résultats de `run-all.js`. Les fichiers de test doivent produire un format spécifique :

```
=== Test Results ===
Passed: X
Failed: Y
Total:  Z
```

### Puis-je utiliser d'autres frameworks de test ?

Oui, mais vous devrez modifier `run-all.js` pour prendre en charge le format de sortie du nouveau framework. Le framework léger personnalisé actuel convient aux scénarios de test simples.

---

## Résumé de cette leçon

La suite de tests est un élément essentiel de l'assurance qualité d'Everything Claude Code. En exécutant les tests, vous pouvez vous assurer que :

- ✅ Les fonctions utilitaires multiplateformes fonctionnent correctement sur différents systèmes d'exploitation
- ✅ La logique de détection des gestionnaires de paquets gère correctement toutes les priorités
- ✅ Les scripts Hook créent et mettent à jour correctement les fichiers
- ✅ Les fichiers de configuration sont corrects et complets

**Caractéristiques de la suite de tests** :
- Légère : Aucune dépendance externe
- Couverture complète : 56 cas de test
- Multiplateforme : Supporte Windows, macOS, Linux
- Facile à étendre : Ajouter de nouveaux tests ne nécessite que quelques lignes de code

---

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons le **[Guide de contribution](../contributing/)**.
>
> Vous apprendrez :
> - Comment contribuer des configurations, agents et skills au projet
> - Les bonnes pratiques pour les contributions de code
> - Le processus de soumission d'une Pull Request

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Date de mise à jour : 2026-01-25

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Exécuteur de tests | [`tests/run-all.js`](https://github.com/affaan-m/everything-claude-code/blob/main/tests/run-all.js) | 1-77 |
| Tests utils | [`tests/lib/utils.test.js`](https://github.com/affaan-m/everything-claude-code/blob/main/tests/lib/utils.test.js) | 1-237 |
| Tests hooks | [`tests/hooks/hooks.test.js`](https://github.com/affaan-m/everything-claude-code/blob/main/tests/hooks/hooks.test.js) | 1-317 |
| Module utils | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-384 |

**Fonctions clés** :

**run-all.js** :
- `execSync()` : Exécute un sous-processus et récupère la sortie (ligne 8)
- Tableau des fichiers de test : `testFiles` définit tous les chemins des fichiers de test (lignes 13-17)
- Analyse des résultats : Extrait les compteurs `Passed` et `Failed` de la sortie (lignes 46-62)

**Fonctions auxiliaires de test** :
- `test()` : Wrapper de test synchrone, capture les exceptions et affiche les résultats
- `asyncTest()` : Wrapper de test asynchrone, supporte les tests avec Promise

**utils.js** :
- Détection de plateforme : `isWindows`, `isMacOS`, `isLinux` (lignes 12-14)
- Fonctions de répertoire : `getHomeDir()`, `getClaudeDir()`, `getSessionsDir()` (lignes 19-35)
- Opérations sur fichiers : `readFile()`, `writeFile()`, `replaceInFile()`, `countInFile()`, `grepFile()` (lignes 200-343)
- Fonctions système : `commandExists()`, `runCommand()` (lignes 228-269)

**package-manager.js** :
- `PACKAGE_MANAGERS` : Constantes de configuration des gestionnaires de paquets (lignes 13-54)
- `DETECTION_PRIORITY` : Ordre de priorité de détection (ligne 57)
- `getPackageManager()` : Sélectionne le gestionnaire de paquets selon la priorité (lignes 157-236)
- `getRunCommand()` : Génère la commande d'exécution de script (lignes 279-294)
- `getExecCommand()` : Génère la commande d'exécution de paquet (lignes 301-304)

</details>

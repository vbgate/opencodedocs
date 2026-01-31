---
title: "Automatisation des Hooks : Analyse de 15+ Hooks | Everything Claude Code"
sidebarTitle: "Automatiser Claude"
subtitle: "Automatisation des Hooks : Analyse approfondie de 15+ hooks"
description: "Apprenez les 15+ mécanismes d'automatisation par hooks d'Everything Claude Code. Ce tutoriel couvre 6 types de hooks, 14 fonctionnalités principales et l'implémentation en scripts Node.js."
tags:
  - "advanced"
  - "hooks"
  - "automation"
  - "nodejs"
prerequisite:
  - "start-installation"
  - "platforms-commands-overview"
order: 90
---

# Automatisation des Hooks : Analyse approfondie de 15+ hooks

## Ce que vous apprendrez

- Comprendre les 6 types de hooks de Claude Code et leurs mécanismes de déclenchement
- Maîtriser les fonctionnalités et la configuration des 14 hooks intégrés
- Apprendre à personnaliser les hooks avec des scripts Node.js
- Sauvegarder et charger automatiquement le contexte au début/fin de session
- Implémenter des fonctionnalités automatisées comme les suggestions de compression et le formatage automatique du code

## Votre problème actuel

Vous souhaitez que Claude Code exécute automatiquement certaines opérations lors d'événements spécifiques, par exemple :
- Charger automatiquement le contexte précédent au démarrage d'une session
- Formater automatiquement le code après chaque modification
- Vous rappeler de vérifier les changements avant un push
- Suggérer la compression du contexte au moment opportun

Mais ces fonctionnalités nécessitent un déclenchement manuel, ou vous devez comprendre en profondeur le système de hooks de Claude Code pour les implémenter. Cette leçon vous aidera à maîtriser ces capacités d'automatisation.

## Quand utiliser cette technique

- Besoin de maintenir le contexte et l'état de travail entre les sessions
- Souhait d'exécuter automatiquement des vérifications de qualité du code (formatage, vérification TypeScript)
- Envie de recevoir des rappels avant certaines opérations (comme vérifier les changements avant un git push)
- Besoin d'optimiser l'utilisation des tokens en compressant le contexte au bon moment
- Souhait d'extraire automatiquement les patterns réutilisables des sessions

## Concept principal

**Qu'est-ce qu'un Hook**

Les **Hooks** sont un mécanisme d'automatisation fourni par Claude Code qui peut déclencher des scripts personnalisés lors d'événements spécifiques. C'est comme un « écouteur d'événements » qui exécute automatiquement des opérations prédéfinies lorsque les conditions sont remplies.

::: info Fonctionnement des Hooks

```
Action utilisateur → Déclenchement événement → Vérification Hook → Exécution script → Retour résultat
        ↓                    ↓                      ↓                   ↓                ↓
  Utilisation outil    PreToolUse           Correspondance      Script Node.js    Sortie console
```

Par exemple, lorsque vous utilisez l'outil Bash pour exécuter `npm run dev` :
1. Le hook PreToolUse détecte le pattern de commande
2. Si vous n'êtes pas dans tmux, il bloque automatiquement et affiche un message
3. Vous voyez le message et utilisez la bonne méthode pour démarrer

:::

**6 types de Hooks**

Everything Claude Code utilise 6 types de hooks :

| Type de Hook | Moment de déclenchement | Cas d'utilisation |
| --- | --- | --- |
| **PreToolUse** | Avant l'exécution de tout outil | Validation de commandes, blocage d'opérations, suggestions |
| **PostToolUse** | Après l'exécution de tout outil | Formatage automatique, vérification de types, journalisation |
| **PreCompact** | Avant la compression du contexte | Sauvegarde d'état, enregistrement des événements de compression |
| **SessionStart** | Au démarrage d'une nouvelle session | Chargement du contexte, détection du gestionnaire de paquets |
| **SessionEnd** | À la fin d'une session | Sauvegarde d'état, évaluation de session, extraction de patterns |
| **Stop** | À la fin de chaque réponse | Vérification des fichiers modifiés, rappels de nettoyage |

::: tip Ordre d'exécution des Hooks

Durant le cycle de vie complet d'une session, les hooks s'exécutent dans l'ordre suivant :

```
SessionStart → [PreToolUse → PostToolUse]×N → PreCompact → Stop → SessionEnd
```

Où `[PreToolUse → PostToolUse]` se répète à chaque utilisation d'outil.

:::

**Règles de correspondance des Hooks**

Chaque hook utilise une expression `matcher` pour décider s'il doit s'exécuter. Claude Code utilise des expressions JavaScript qui peuvent vérifier :

- Le type d'outil : `tool == "Bash"`, `tool == "Edit"`
- Le contenu de la commande : `tool_input.command matches "npm run dev"`
- Le chemin du fichier : `tool_input.file_path matches "\\.ts$"`
- Des conditions combinées : `tool == "Bash" && tool_input.command matches "git push"`

**Pourquoi utiliser des scripts Node.js**

Tous les hooks d'Everything Claude Code sont implémentés avec des scripts Node.js plutôt que des scripts Shell. Voici pourquoi :

| Avantage | Script Shell | Script Node.js |
| --- | --- | --- |
| **Multi-plateforme** | ❌ Nécessite des branches Windows/macOS/Linux | ✅ Automatiquement multi-plateforme |
| **Traitement JSON** | ❌ Nécessite des outils supplémentaires (jq) | ✅ Support natif |
| **Opérations fichiers** | ⚠️ Commandes complexes | ✅ API fs concise |
| **Gestion d'erreurs** | ❌ Implémentation manuelle requise | ✅ Support natif try/catch |

## Suivez le guide

### Étape 1 : Consulter la configuration actuelle des Hooks

**Pourquoi**
Comprendre la configuration existante des hooks et savoir quelles fonctionnalités d'automatisation sont déjà activées

```bash
## Consulter la configuration hooks.json
cat source/affaan-m/everything-claude-code/hooks/hooks.json
```

**Vous devriez voir** : Un fichier de configuration JSON contenant les définitions des 6 types de hooks

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "PreToolUse": [...],
    "PostToolUse": [...],
    "PreCompact": [...],
    "SessionStart": [...],
    "Stop": [...],
    "SessionEnd": [...]
  }
}
```

### Étape 2 : Comprendre les Hooks PreToolUse

**Pourquoi**
PreToolUse est le type de hook le plus utilisé, capable de bloquer des opérations ou de fournir des suggestions

Examinons les 5 hooks PreToolUse d'Everything Claude Code :

#### 1. Tmux Dev Server Block

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"console.error('[Hook] BLOCKED: Dev server must run in tmux for log access');console.error('[Hook] Use: tmux new-session -d -s dev \\\"npm run dev\\\"');console.error('[Hook] Then: tmux attach -t dev');process.exit(1)\""
  }],
  "description": "Block dev servers outside tmux - ensures you can access logs"
}
```

**Fonction** : Bloquer le démarrage du serveur de développement en dehors de tmux

**Pourquoi c'est nécessaire** : Exécuter le serveur de développement dans tmux permet de détacher la session et de continuer à consulter les logs même après avoir fermé Claude Code

#### 2. Git Push Reminder

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"git push\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"console.error('[Hook] Review changes before push...');console.error('[Hook] Continuing with push (remove this hook to add interactive review)')\""
  }],
  "description": "Reminder before git push to review changes"
}
```

**Fonction** : Vous rappeler de vérifier les changements avant un `git push`

**Pourquoi c'est nécessaire** : Éviter de pousser du code non vérifié par erreur

#### 3. Block Random MD Files

```json
{
  "matcher": "tool == \"Write\" && tool_input.file_path matches \"\\\\.(md|txt)$\" && !(tool_input.file_path matches \"README\\\\.md|CLAUDE\\\\.md|AGENTS\\\\.md|CONTRIBUTING\\\\.md\")",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{...process.exit(1)}console.log(d)})\""
  }],
  "description": "Block creation of random .md files - keeps docs consolidated"
}
```

**Fonction** : Bloquer la création de fichiers .md non documentaires

**Pourquoi c'est nécessaire** : Éviter la dispersion de la documentation et maintenir le projet organisé

#### 4. Suggest Compact

```json
{
  "matcher": "tool == \"Edit\" || tool == \"Write\"",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
  }],
  "description": "Suggest manual compaction at logical intervals"
}
```

**Fonction** : Suggérer la compression du contexte lors de l'édition ou de l'écriture de fichiers

**Pourquoi c'est nécessaire** : Compresser manuellement au bon moment pour garder le contexte concis

### Étape 3 : Comprendre les Hooks PostToolUse

**Pourquoi**
PostToolUse s'exécute automatiquement après la fin d'une opération, idéal pour les vérifications de qualité automatisées

Everything Claude Code possède 4 hooks PostToolUse :

#### 1. Auto Format

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const{execSync}=require('child_process');...try{execSync('npx prettier --write \"'+p+'\"',{stdio:['pipe','pipe','pipe']})}catch(e){}}console.log(d)})\""
  }],
  "description": "Auto-format JS/TS files with Prettier after edits"
}
```

**Fonction** : Exécuter automatiquement Prettier pour formater les fichiers .js/.ts/.jsx/.tsx après édition

**Pourquoi c'est nécessaire** : Maintenir un style de code cohérent

#### 2. TypeScript Check

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const{execSync}=require('child_process');...if(fs.existsSync(path.join(dir,'tsconfig.json'))){try{const r=execSync('npx tsc --noEmit --pretty false 2>&1',{cwd:dir,...});...}catch(e){...}}console.log(d)})\""
  }],
  "description": "TypeScript check after editing .ts/.tsx files"
}
```

**Fonction** : Exécuter automatiquement la vérification de types TypeScript après édition de fichiers .ts/.tsx

**Pourquoi c'est nécessaire** : Détecter les erreurs de types rapidement

#### 3. Console.log Warning

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const fs=require('fs');...const c=fs.readFileSync(p,'utf8');const lines=c.split('\\n');...if(/console\\.log/.test(l))matches.push((idx+1)+': '+l.trim())...console.log(d)})\""
  }],
  "description": "Warn about console.log statements after edits"
}
```

**Fonction** : Vérifier la présence d'instructions console.log après édition de fichiers

**Pourquoi c'est nécessaire** : Éviter de commiter du code de débogage

#### 4. Log PR URL

```json
{
  "matcher": "tool == \"Bash\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"...const cmd=i.tool_input?.command||'';if(/gh pr create/.test(cmd)){const out=i.tool_output?.output||'';...console.error('[Hook] PR created: '+m[0])...}console.log(d)})\""
  }],
  "description": "Log PR URL and provide review command after PR creation"
}
```

**Fonction** : Afficher automatiquement l'URL de la PR et la commande de révision après création d'une PR

**Pourquoi c'est nécessaire** : Accéder rapidement à la PR nouvellement créée

### Étape 4 : Comprendre les Hooks du cycle de vie de session

**Pourquoi**
Les hooks SessionStart et SessionEnd sont utilisés pour la persistance du contexte entre les sessions

#### Hook SessionStart

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\""
  }],
  "description": "Load previous context and detect package manager on new session"
}
```

**Fonctions** :
- Vérifier les fichiers de session des 7 derniers jours
- Vérifier les skills appris
- Détecter le gestionnaire de paquets
- Afficher les informations de contexte chargeables

**Logique du script** (`session-start.js`) :

```javascript
// Vérifier les fichiers de session des 7 derniers jours
const recentSessions = findFiles(sessionsDir, '*.tmp', { maxAge: 7 });

// Vérifier les skills appris
const learnedSkills = findFiles(learnedDir, '*.md');

// Détecter le gestionnaire de paquets
const pm = getPackageManager();

// Si valeur par défaut, demander de choisir
if (pm.source === 'fallback' || pm.source === 'default') {
  log('[SessionStart] No package manager preference found.');
  log(getSelectionPrompt());
}
```

#### Hook SessionEnd

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-end.js\""
  }],
  "description": "Persist session state on end"
}
```

**Fonctions** :
- Créer ou mettre à jour le fichier de session
- Enregistrer les heures de début et de fin de session
- Générer un modèle de session (Completed, In Progress, Notes)

**Modèle de fichier de session** (`session-end.js`) :

```
# Session: 2026-01-25
**Date:** 2026-01-25
**Started:** 10:30
**Last Updated:** 14:20

---

## Current State

[Session context goes here]

### Completed
- [ ]

### In Progress
- [ ]

### Notes for Next Session
-

### Context to Load
[relevant files]
```

Les placeholders `[Session context goes here]` et `[relevant files]` dans le modèle doivent être remplis manuellement avec le contenu réel de la session et les fichiers pertinents.

### Étape 5 : Comprendre les Hooks liés à la compression

**Pourquoi**
Les hooks PreCompact et Stop sont utilisés pour la gestion du contexte et les décisions de compression

#### Hook PreCompact

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/pre-compact.js\""
  }],
  "description": "Save state before context compaction"
}
```

**Fonctions** :
- Enregistrer l'événement de compression dans le journal
- Marquer l'heure de compression dans le fichier de session actif

**Logique du script** (`pre-compact.js`) :

```javascript
// Enregistrer l'événement de compression
appendFile(compactionLog, `[${timestamp}] Context compaction triggered\n`);

// Marquer dans le fichier de session
appendFile(activeSession, `\n---\n**[Compaction occurred at ${timeStr}]** - Context was summarized\n`);
```

#### Hook Stop

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const{execSync}=require('child_process');...const files=execSync('git diff --name-only HEAD'...).split('\\n')...let hasConsole=false;for(const f of files){if(fs.readFileSync(f,'utf8').includes('console.log')){console.error('[Hook] WARNING: console.log found in '+f);hasConsole=true}}...console.log(d)})\""
  }],
  "description": "Check for console.log in modified files after each response"
}
```

**Fonction** : Vérifier la présence de console.log dans tous les fichiers modifiés

**Pourquoi c'est nécessaire** : Dernière ligne de défense pour éviter de commiter du code de débogage

### Étape 6 : Comprendre le Hook d'apprentissage continu

**Pourquoi**
Le hook Evaluate Session est utilisé pour extraire les patterns réutilisables des sessions

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/evaluate-session.js\""
  }],
  "description": "Evaluate session for extractable patterns"
}
```

**Fonctions** :
- Lire la transcription de session
- Compter le nombre de messages utilisateur
- Si la session est assez longue (par défaut > 10 messages), suggérer d'évaluer les patterns extractibles

**Logique du script** (`evaluate-session.js`) :

```javascript
// Lire la configuration
const config = JSON.parse(readFile(configFile));
const minSessionLength = config.min_session_length || 10;

// Compter les messages utilisateur
const messageCount = countInFile(transcriptPath, /"type":"user"/g);

// Ignorer les sessions courtes
if (messageCount < minSessionLength) {
  log(`[ContinuousLearning] Session too short (${messageCount} messages), skipping`);
  process.exit(0);
}

// Suggérer l'évaluation
log(`[ContinuousLearning] Session has ${messageCount} messages - evaluate for extractable patterns`);
log(`[ContinuousLearning] Save learned skills to: ${learnedSkillsPath}`);
```

### Étape 7 : Personnaliser un Hook

**Pourquoi**
Créer vos propres règles d'automatisation selon les besoins du projet

**Exemple : Bloquer les commandes dangereuses en environnement de production**

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Bash\" && tool_input.command matches \"(rm -rf /|docker rm.*--force|DROP DATABASE)\"",
        "hooks": [{
          "type": "command",
          "command": "node -e \"console.error('[Hook] BLOCKED: Dangerous command detected');console.error('[Hook] Command: '+process.argv[2]);process.exit(1)\""
        }],
        "description": "Block dangerous commands"
      }
    ]
  }
}
```

**Étapes de configuration** :

1. Créer un script de hook personnalisé :
   ```bash
   # Créer scripts/hooks/custom-hook.js
   vi scripts/hooks/custom-hook.js
   ```

2. Modifier `~/.claude/settings.json` :
   ```json
   {
     "hooks": {
       "PreToolUse": [
         {
           "matcher": "tool == \"Bash\" && tool_input.command matches \"your pattern\"",
           "hooks": [{
             "type": "command",
             "command": "node /path/to/your/script.js"
           }],
           "description": "Your custom hook"
         }
       ]
     }
   }
   ```

3. Redémarrer Claude Code

**Vous devriez voir** : Les messages de sortie lors du déclenchement du hook

## Point de contrôle ✅

Confirmez que vous avez compris les points suivants :

- [ ] Les hooks sont un mécanisme d'automatisation piloté par événements
- [ ] Claude Code possède 6 types de hooks
- [ ] PreToolUse se déclenche avant l'exécution d'un outil et peut bloquer des opérations
- [ ] PostToolUse se déclenche après l'exécution d'un outil, idéal pour les vérifications automatisées
- [ ] SessionStart/SessionEnd sont utilisés pour la persistance du contexte entre sessions
- [ ] Everything Claude Code utilise des scripts Node.js pour la compatibilité multi-plateforme
- [ ] Vous pouvez personnaliser les hooks en modifiant `~/.claude/settings.json`

## Pièges à éviter

### ❌ Les erreurs dans les scripts de hook bloquent la session

**Problème** : Le script de hook ne se termine pas correctement après une exception, causant un timeout de Claude Code

**Cause** : Les erreurs dans le script Node.js ne sont pas correctement capturées

**Solution** :
```javascript
// Exemple incorrect
main();  // Si une exception est levée, cela cause des problèmes

// Exemple correct
main().catch(err => {
  console.error('[Hook] Error:', err.message);
  process.exit(0);  // Sortie normale même en cas d'erreur
});
```

### ❌ L'utilisation de scripts Shell cause des problèmes multi-plateformes

**Problème** : Les scripts Shell échouent sur Windows

**Cause** : Les commandes Shell ne sont pas compatibles entre différents systèmes d'exploitation

**Solution** : Utiliser des scripts Node.js au lieu de scripts Shell

| Fonction | Script Shell | Script Node.js |
| --- | --- | --- |
| Lecture de fichier | `cat file.txt` | `fs.readFileSync('file.txt')` |
| Vérification de répertoire | `[ -d dir ]` | `fs.existsSync(dir)` |
| Variable d'environnement | `$VAR` | `process.env.VAR` |

### ❌ Trop de sortie des hooks gonfle le contexte

**Problème** : Chaque opération produit beaucoup d'informations de débogage, gonflant rapidement le contexte

**Cause** : Le script de hook utilise trop de console.log

**Solution** :
- N'afficher que les informations nécessaires
- Utiliser `console.error` pour les messages importants (mis en évidence par Claude Code)
- Utiliser une sortie conditionnelle, n'afficher que si nécessaire

```javascript
// Exemple incorrect
console.log('[Hook] Starting...');
console.log('[Hook] File:', filePath);
console.log('[Hook] Size:', size);
console.log('[Hook] Done');  // Trop de sortie

// Exemple correct
if (someCondition) {
  console.error('[Hook] Warning: File is too large');
}
```

### ❌ Le hook PreToolUse bloque des opérations nécessaires

**Problème** : Les règles de correspondance du hook sont trop larges, bloquant par erreur des opérations normales

**Cause** : L'expression matcher ne correspond pas précisément au scénario

**Solution** :
- Tester la précision de l'expression matcher
- Ajouter plus de conditions pour limiter la portée de déclenchement
- Fournir des messages d'erreur clairs et des suggestions de résolution

```json
// Exemple incorrect : correspond à toutes les commandes npm
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"npm\""
}

// Exemple correct : correspond uniquement à la commande dev
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"npm run dev\""
}
```

## Résumé de la leçon

**Résumé des 6 types de Hooks** :

| Type de Hook | Moment de déclenchement | Usage typique | Nombre dans Everything Claude Code |
| --- | --- | --- | --- |
| PreToolUse | Avant exécution d'outil | Validation, blocage, suggestions | 5 |
| PostToolUse | Après exécution d'outil | Formatage, vérification, journalisation | 4 |
| PreCompact | Avant compression du contexte | Sauvegarde d'état | 1 |
| SessionStart | Démarrage de nouvelle session | Chargement contexte, détection PM | 1 |
| SessionEnd | Fin de session | Sauvegarde état, évaluation session | 2 |
| Stop | Fin de réponse | Vérification des modifications | 1 |

**Points clés** :

1. **Les hooks sont pilotés par événements** : Exécution automatique lors d'événements spécifiques
2. **Le matcher détermine le déclenchement** : Utilise des expressions JavaScript pour la correspondance
3. **Implémentation en scripts Node.js** : Compatibilité multi-plateforme, évite les scripts Shell
4. **La gestion d'erreurs est importante** : Le script doit se terminer normalement même en cas d'erreur
5. **La sortie doit être concise** : Éviter trop de logs qui gonflent le contexte
6. **Configuration dans settings.json** : Ajouter des hooks personnalisés via `~/.claude/settings.json`

**Bonnes pratiques** :

```
1. Utiliser PreToolUse pour valider les opérations dangereuses
2. Utiliser PostToolUse pour automatiser les vérifications de qualité
3. Utiliser SessionStart/End pour persister le contexte
4. Tester l'expression matcher avant de personnaliser un hook
5. Utiliser try/catch et process.exit(0) dans les scripts
6. N'afficher que les informations nécessaires pour éviter le gonflement du contexte
```

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons le **[Mécanisme d'apprentissage continu](../continuous-learning/)**.
>
> Vous apprendrez :
> - Comment Continuous Learning extrait automatiquement les patterns réutilisables
> - Utiliser la commande `/learn` pour extraire manuellement des patterns
> - Configurer la longueur minimale pour l'évaluation de session
> - Gérer le répertoire des skills appris

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-25

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Configuration principale des Hooks | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| Script SessionStart | [`scripts/hooks/session-start.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-start.js) | 1-62 |
| Script SessionEnd | [`scripts/hooks/session-end.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-end.js) | 1-83 |
| Script PreCompact | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49 |
| Script Suggest Compact | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61 |
| Script Evaluate Session | [`scripts/hooks/evaluate-session.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/evaluate-session.js) | 1-79 |
| Bibliothèque utilitaire | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-150 |
| Détection gestionnaire de paquets | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js) | 1-100 |

**Constantes clés** :
- Aucune (configuration chargée dynamiquement)

**Fonctions clés** :
- `getSessionsDir()` : Obtenir le chemin du répertoire des sessions
- `getLearnedSkillsDir()` : Obtenir le chemin du répertoire des skills appris
- `findFiles(dir, pattern, options)` : Rechercher des fichiers, supporte le filtrage par date
- `ensureDir(path)` : S'assurer que le répertoire existe, le créer sinon
- `getPackageManager()` : Détecter le gestionnaire de paquets (supporte 6 niveaux de priorité)
- `log(message)` : Afficher les messages de log des hooks

**Configurations clés** :
- `min_session_length` : Nombre minimum de messages pour l'évaluation de session (défaut 10)
- `COMPACT_THRESHOLD` : Seuil d'appels d'outils pour suggérer la compression (défaut 50)
- `CLAUDE_PLUGIN_ROOT` : Variable d'environnement du répertoire racine du plugin

**14 Hooks principaux** :
1. Tmux Dev Server Block (PreToolUse)
2. Tmux Reminder (PreToolUse)
3. Git Push Reminder (PreToolUse)
4. Block Random MD Files (PreToolUse)
5. Suggest Compact (PreToolUse)
6. Save Before Compact (PreCompact)
7. Session Start Load (SessionStart)
8. Log PR URL (PostToolUse)
9. Auto Format (PostToolUse)
10. TypeScript Check (PostToolUse)
11. Console.log Warning (PostToolUse)
12. Check Console.log (Stop)
13. Session End Save (SessionEnd)
14. Evaluate Session (SessionEnd)

</details>

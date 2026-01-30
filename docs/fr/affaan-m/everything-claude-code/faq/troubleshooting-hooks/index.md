---
title: "Dépannage : Problèmes de Hooks | everything-claude-code"
sidebarTitle: "Réparer les Hooks en 5 minutes"
subtitle: "Dépannage : Problèmes de Hooks | everything-claude-code"
description: "Apprenez à diagnostiquer les problèmes de Hooks. Diagnostiquez de manière systématique les variables d'environnement, les permissions, la syntaxe JSON et autres problèmes pour assurer le bon fonctionnement de SessionStart/End, PreToolUse."
tags:
  - "hooks"
  - "troubleshooting"
  - "faq"
prerequisite:
  - "advanced-hooks-automation"
order: 150
---

# Que faire si les Hooks ne fonctionnent pas

## Le problème que vous rencontrez

Vous avez configuré les Hooks, mais vous constatez qu'ils ne fonctionnent pas comme prévu ? Vous pourriez rencontrer les situations suivantes :

- Le serveur de développement n'est pas empêché de s'exécuter en dehors de tmux
- Vous ne voyez pas les journaux SessionStart ou SessionEnd
- Le formatage automatique Prettier ne s'applique pas
- La vérification TypeScript ne s'exécute pas
- Vous voyez des messages d'erreur étranges

Ne vous inquiétez pas, ces problèmes ont généralement des solutions claires. Cette leçon vous aide à diagnostiquer et résoudre systématiquement les problèmes liés aux Hooks.

## 🎒 Préparation avant de commencer

::: warning Vérification préalable
Assurez-vous d'avoir :
1. ✅ Terminé l'installation de Everything Claude Code dans [installation](../../start/installation/)
2. ✅ Compris les concepts de base de [l'automatisation des Hooks](../../advanced/hooks-automation/)
3. ✅ Lu les instructions de configuration des Hooks dans le README du projet
:::

---

## Problème courant 1 : Les Hooks ne se déclenchent pas du tout

### Symptômes
Après avoir exécuté une commande, vous ne voyez aucune sortie de journal `[Hook]`, les Hooks ne semblent pas être appelés.

### Causes possibles

#### Cause A : Chemin de hooks.json incorrect

**Problème** : `hooks.json` n'est pas au bon endroit, Claude Code ne trouve pas le fichier de configuration.

**Solution** :

Vérifiez que `hooks.json` est au bon endroit :

```bash
# Devrait être dans l'un de ces emplacements :
~/.claude/hooks/hooks.json              # Configuration au niveau utilisateur (globale)
.claude/hooks/hooks.json                 # Configuration au niveau projet
```

**Méthode de vérification** :

```bash
# Voir la configuration au niveau utilisateur
ls -la ~/.claude/hooks/hooks.json

# Voir la configuration au niveau projet
ls -la .claude/hooks/hooks.json
```

**Si le fichier n'existe pas**, copiez depuis le répertoire du plugin Everything Claude Code :

```bash
# En supposant que le plugin est installé dans ~/.claude-plugins/
cp ~/.claude-plugins/everything-claude-code/hooks/hooks.json ~/.claude/hooks/
```

#### Cause B : Erreur de syntaxe JSON

**Problème** : `hooks.json` contient des erreurs de syntaxe, donc Claude Code ne peut pas l'analyser.

**Solution** :

Validez le format JSON :

```bash
# Utiliser jq ou Python pour valider la syntaxe JSON
jq empty ~/.claude/hooks/hooks.json
# ou
python3 -m json.tool ~/.claude/hooks/hooks.json > /dev/null
```

**Erreurs de syntaxe courantes** :
- Virgules manquantes
- Guillemets non fermés
- Utilisation de guillemets simples (devrait utiliser des guillemets doubles)
- Format de commentaire incorrect (JSON ne supporte pas les commentaires `//`)

#### Cause C : Variable d'environnement CLAUDE_PLUGIN_ROOT non définie

**Problème** : Le script Hook utilise `${CLAUDE_PLUGIN_ROOT}` pour référencer les chemins, mais la variable d'environnement n'est pas définie.

**Solution** :

Vérifiez que le chemin d'installation du plugin est correct :

```bash
# Voir les chemins des plugins installés
ls -la ~/.claude-plugins/
```

Assurez-vous que le plugin Everything Claude Code est correctement installé :

```bash
# Devrait voir un répertoire similaire
~/.claude-plugins/everything-claude-code/
├── scripts/
├── hooks/
├── agents/
└── ...
```

**Si l'installation s'est faite via le marché de plugins**, la variable d'environnement sera automatiquement définie après redémarrage de Claude Code.

**Si l'installation est manuelle**, vérifiez le chemin du plugin dans `~/.claude/settings.json` :

```json
{
  "plugins": [
    {
      "name": "everything-claude-code",
      "path": "/path/to/everything-claude-code"
    }
  ]
}
```

---

## Problème courant 2 : Un Hook spécifique ne se déclenche pas

### Symptômes
Certains Hooks fonctionnent (comme SessionStart), mais d'autres ne se déclenchent pas (comme le formatage PreToolUse).

### Causes possibles

#### Cause A : Expression Matcher erronée

**Problème** : L'expression `matcher` du Hook est incorrecte, donc les conditions de correspondance ne sont pas remplies.

**Solution** :

Vérifiez la syntaxe du matcher dans `hooks.json` :

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx)$\""
}
```

**Points d'attention** :
- Les noms d'outils doivent être entre guillemets doubles : `"Edit"`, `"Bash"`
- Les anti-slashs dans les expressions régulières doivent être échappés deux fois : `\\\\.` au lieu de `\\.`
- La correspondance de chemin de fichier utilise le mot-clé `matches`

**Tester le Matcher** :

Vous pouvez tester manuellement la logique de correspondance :

```bash
# Tester la correspondance de chemin de fichier
node -e "console.log(/\\\\.(ts|tsx)$/.test('src/index.ts'))"
# Devrait afficher : true
```

#### Cause B : Échec de l'exécution de la commande

**Problème** : La commande du Hook elle-même échoue, mais il n'y a pas de message d'erreur.

**Solution** :

Exécutez manuellement la commande du Hook pour tester :

```bash
# Aller dans le répertoire du plugin
cd ~/.claude-plugins/everything-claude-code

# Exécuter manuellement un script Hook
node scripts/hooks/session-start.js

# Vérifier s'il y a une sortie d'erreur
```

**Raisons courantes d'échec** :
- Incompatibilité de version Node.js (nécessite Node.js 14+)
- Dépendances manquantes (ex : prettier, typescript non installés)
- Problèmes de permissions du script (voir ci-dessous)

---

## Problème courant 3 : Problèmes de permissions (Linux/macOS)

### Symptômes
Vous voyez des erreurs comme celle-ci :

```
Permission denied: node scripts/hooks/session-start.js
```

### Solution

Ajoutez les permissions d'exécution aux scripts Hook :

```bash
# Aller dans le répertoire du plugin
cd ~/.claude-plugins/everything-claude-code

# Ajouter les permissions d'exécution à tous les scripts hooks
chmod +x scripts/hooks/*.js

# Vérifier les permissions
ls -la scripts/hooks/
# Devrait voir quelque chose comme : -rwxr-xr-x  session-start.js
```

**Réparation en lot de tous les scripts** :

```bash
# Réparer tous les fichiers .js dans scripts
find ~/.claude-plugins/everything-claude-code/scripts -name "*.js" -exec chmod +x {} \;
```

---

## Problème courant 4 : Problèmes de compatibilité multiplateforme

### Symptômes
Fonctionne sur Windows mais échoue sur macOS/Linux ; ou vice versa.

### Causes possibles

#### Cause A : Séparateur de chemin

**Problème** : Windows utilise l'anti-slash `\`, Unix utilise la barre oblique `/`.

**Solution** :

Les scripts de Everything Claude Code sont déjà traités pour être multiplateformes (en utilisant le module `path` de Node.js), mais si vous personnalisez un Hook, vous devez faire attention :

**Écriture incorrecte** :
```json
{
  "command": "node scripts/hooks\\session-start.js"  // Style Windows
}
```

**Écriture correcte** :
```json
{
  "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\"  // Utiliser la variable d'environnement et la barre oblique
}
```

#### Cause B : Différences de commandes Shell

**Problème** : La syntaxe des commandes diffère selon les plateformes (ex : `which` vs `where`).

**Solution** :

Le fichier `scripts/lib/utils.js` de Everything Claude Code gère déjà ces différences. Lors de la personnalisation d'un Hook, reportez-vous aux fonctions multiplateformes de ce fichier :

```javascript
// Détection de commande multiplateforme dans utils.js
function commandExists(cmd) {
  if (isWindows) {
    spawnSync('where', [cmd], { stdio: 'pipe' });
  } else {
    spawnSync('which', [cmd], { stdio: 'pipe' });
  }
}
```

---

## Problème courant 5 : Le formatage automatique ne fonctionne pas

### Symptômes
Après avoir modifié un fichier TypeScript, Prettier ne formate pas automatiquement le code.

### Causes possibles

#### Cause A : Prettier non installé

**Problème** : Le Hook PostToolUse appelle `npx prettier`, mais il n'est pas installé dans le projet.

**Solution** :

```bash
# Installer Prettier (au niveau projet)
npm install --save-dev prettier
# ou
pnpm add -D prettier

# Ou installer globalement
npm install -g prettier
```

#### Cause B : Configuration Prettier manquante

**Problème** : Prettier ne trouve pas le fichier de configuration et utilise les règles de formatage par défaut.

**Solution** :

Créez un fichier de configuration Prettier :

```bash
# Créer .prettierrc à la racine du projet
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
EOF
```

#### Cause C : Type de fichier non correspondant

**Problème** : L'extension du fichier modifié n'est pas dans les règles de correspondance du Hook.

**Règles de correspondance actuelles** (`hooks.json` L92-97) :

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "description": "Auto-format JS/TS files with Prettier after edits"
}
```

**Si vous devez supporter d'autres types de fichiers** (comme `.vue`), vous devez modifier la configuration :

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx|vue)$\""
}
```

---

## Problème courant 6 : La vérification TypeScript ne fonctionne pas

### Symptômes
Après avoir modifié un fichier `.ts`, vous ne voyez pas la sortie d'erreur de vérification de type.

### Causes possibles

#### Cause A : tsconfig.json manquant

**Problème** : Le script Hook recherche le fichier `tsconfig.json`, mais ne le trouve pas.

**Solution** :

Assurez-vous qu'il y a un `tsconfig.json` à la racine du projet ou dans le répertoire parent :

```bash
# Rechercher tsconfig.json
find . -name "tsconfig.json" -type f

# S'il n'existe pas, créer une configuration de base
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
EOF
```

#### Cause B : TypeScript non installé

**Problème** : Le Hook appelle `npx tsc`, mais TypeScript n'est pas installé.

**Solution** :

```bash
npm install --save-dev typescript
# ou
pnpm add -D typescript
```

---

## Problème courant 7 : SessionStart/SessionEnd ne se déclenchent pas

### Symptômes
Au démarrage ou à la fin d'une session, vous ne voyez pas les journaux `[SessionStart]` ou `[SessionEnd]`.

### Causes possibles

#### Cause A : Le répertoire des sessions n'existe pas

**Problème** : Le répertoire `~/.claude/sessions/` n'existe pas, le script Hook ne peut pas créer le fichier de session.

**Solution** :

Créez manuellement le répertoire :

```bash
# macOS/Linux
mkdir -p ~/.claude/sessions

# Windows PowerShell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.claude\sessions"
```

#### Cause B : Chemin de script incorrect

**Problème** : Le chemin du script référencé dans `hooks.json` est incorrect.

**Méthode de vérification** :

```bash
# Vérifier que le script existe
ls -la ~/.claude-plugins/everything-claude-code/scripts/hooks/session-start.js
ls -la ~/.claude-plugins/everything-claude-code/scripts/hooks/session-end.js
```

**S'il n'existe pas**, vérifiez que le plugin est complètement installé :

```bash
# Voir la structure du répertoire du plugin
ls -la ~/.claude-plugins/everything-claude-code/
```

---

## Problème courant 8 : Le blocage du Dev Server ne fonctionne pas

### Symptômes
Exécuter `npm run dev` directement n'est pas bloqué, le serveur de développement peut démarrer.

### Causes possibles

#### Cause A : Expression régulière non correspondante

**Problème** : Votre commande de serveur de développement n'est pas dans les règles de correspondance du Hook.

**Règles de correspondance actuelles** (`hooks.json` L6) :

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)\""
}
```

**Tester la correspondance** :

```bash
# Tester si votre commande correspond
node -e "console.log(/(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)/.test('npm run dev'))"
```

**Si vous devez supporter d'autres commandes** (comme `npm start`), modifiez `hooks.json` :

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm (run dev|start)|pnpm( run)? (dev|start)|yarn (dev|start)|bun run (dev|start))\""
}
```

#### Cause B : Non bloqué bien qu'il ne s'exécute pas dans tmux

**Problème** : Le Hook devrait bloquer le serveur de développement en dehors de tmux, mais ça ne fonctionne pas.

**Points de vérification** :

1. Confirmez que la commande Hook s'exécute correctement :
```bash
# Simuler la commande Hook
node -e "console.error('[Hook] BLOCKED: Dev server must run in tmux');process.exit(1)"
# Devrait voir la sortie d'erreur et le code de sortie 1
```

2. Vérifiez si `process.exit(1)` bloque correctement la commande :
- Le `process.exit(1)` dans la commande Hook devrait bloquer l'exécution des commandes suivantes

3. Si cela ne fonctionne toujours pas, vous devrez peut-être mettre à jour la version de Claude Code (le support des Hooks peut nécessiter la dernière version)

---

## Outils et conseils de diagnostic

### Activer les journaux détaillés

Consultez les journaux détaillés de Claude Code pour voir l'exécution des Hooks :

```bash
# macOS/Linux
tail -f ~/Library/Logs/claude-code/claude-code.log

# Windows
Get-Content "$env:APPDATA\claude-code\logs\claude-code.log" -Wait -Tail 50
```

### Tester manuellement un Hook

Exécutez manuellement le script Hook dans le terminal pour vérifier son fonctionnement :

```bash
# Tester SessionStart
cd ~/.claude-plugins/everything-claude-code
node scripts/hooks/session-start.js

# Tester Suggest Compact
node scripts/hooks/suggest-compact.js

# Tester PreCompact
node scripts/hooks/pre-compact.js
```

### Vérifier les variables d'environnement

Voir les variables d'environnement de Claude Code :

```bash
# Ajouter une sortie de débogage dans le script Hook
node -e "console.log('CLAUDE_PLUGIN_ROOT:', process.env.CLAUDE_PLUGIN_ROOT); console.log('COMPACT_THRESHOLD:', process.env.COMPACT_THRESHOLD)"
```

---

## Points de vérification ✅

Vérifiez point par point selon la liste suivante :

- [ ] `hooks.json` est au bon endroit (`~/.claude/hooks/` ou `.claude/hooks/`)
- [ ] Le format JSON de `hooks.json` est correct (validé avec `jq`)
- [ ] Le chemin du plugin est correct (`${CLAUDE_PLUGIN_ROOT}` est défini)
- [ ] Tous les scripts ont les permissions d'exécution (Linux/macOS)
- [ ] Les outils dépendants sont installés (Node.js, Prettier, TypeScript)
- [ ] Le répertoire de sessions existe (`~/.claude/sessions/`)
- [ ] L'expression Matcher est correcte (échappement regex, guillemets)
- [ ] Compatibilité multiplateforme (utiliser le module `path`, variables d'environnement)

---

## Quand avez-vous besoin d'aide

Si aucune des méthodes ci-dessus ne résout le problème :

1. **Collectez les informations de diagnostic** :
   ```bash
   # Afficher les informations suivantes
   echo "Node version: $(node -v)"
   echo "Claude Code version: $(claude-code --version)"
   echo "Plugin path: $(ls -la ~/.claude-plugins/everything-claude-code)"
   echo "Hooks config: $(cat ~/.claude/hooks/hooks.json | jq -c .)"
   ```

2. **Consultez les GitHub Issues** :
   - Visitez [Everything Claude Code Issues](https://github.com/affaan-m/everything-claude-code/issues)
   - Recherchez des problèmes similaires

3. **Soumettez un Issue** :
   - Incluez le journal d'erreur complet
   - Fournissez le système d'exploitation et les informations de version
   - Joignez le contenu de `hooks.json` (masquez les informations sensibles)

---

## Résumé de cette leçon

Les Hooks qui ne fonctionnent pas sont généralement dus à ces types de raisons :

| Type de problème | Causes courantes | Diagnostic rapide |
| --- | --- | --- |
| **Ne se déclenche pas du tout** | Chemin hooks.json erroné, erreur syntaxe JSON | Vérifier l'emplacement du fichier, valider le format JSON |
| **Un Hook spécifique ne se déclenche pas** | Expression Matcher erronée, échec d'exécution de commande | Vérifier la syntaxe regex, exécuter le script manuellement |
| **Problèmes de permissions** | Scripts sans permissions d'exécution (Linux/macOS) | `chmod +x scripts/hooks/*.js` |
| **Compatibilité multiplateforme** | Séparateurs de chemin, différences de commandes Shell | Utiliser le module `path`,参考 utils.js |
| **Fonctionne pas** | Outils dépendants non installés (Prettier, TypeScript) | Installer les outils correspondants, vérifier les fichiers de configuration |

Rappelez-vous : la plupart des problèmes peuvent être résolus en vérifiant les chemins de fichiers, validant le format JSON et confirmant l'installation des dépendances.

---

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons le **[Dépannage des échecs de connexion MCP](../troubleshooting-mcp/)**.
>
> Vous apprendrez :
> - Erreurs courantes de configuration des serveurs MCP
> - Comment déboguer les problèmes de connexion MCP
> - Variables d'environnement et paramètres de placeholders MCP

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Date de mise à jour : 2026-01-25

| Fonction | Chemin du fichier | Ligne |
| --- | --- | --- |
| Configuration principale des Hooks | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| Hook SessionStart | [`scripts/hooks/session-start.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-start.js) | 1-62 |
| Hook SessionEnd | [`scripts/hooks/session-end.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-end.js) | 1-83 |
| Hook PreCompact | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49 |
| Hook Suggest Compact | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61 |
| Fonctions utilitaires multiplateformes | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-384 |

**Fonctions clés** :
- `getHomeDir()` / `getClaudeDir()` / `getSessionsDir()` : Obtenir les chemins des répertoires de configuration (utils.js 19-34)
- `ensureDir(dirPath)` : S'assurer que le répertoire existe, le créer sinon (utils.js 54-59)
- `log(message)` : Sortir le journal vers stderr (visible dans Claude Code) (utils.js 182-184)
- `findFiles(dir, pattern, options)` : Recherche de fichiers multiplateforme (utils.js 102-149)
- `commandExists(cmd)` : Vérifier si une commande existe (compatible multiplateforme) (utils.js 228-246)

**Expressions régulières clés** :
- Blocage du serveur de développement : `npm run dev|pnpm( run)? dev|yarn dev|bun run dev` (hooks.json 6)
- Correspondance d'édition de fichier : `\\.(ts|tsx|js|jsx)$` (hooks.json 92)
- Fichiers TypeScript : `\\.(ts|tsx)$` (hooks.json 102)

**Variables d'environnement** :
- `${CLAUDE_PLUGIN_ROOT}` : Chemin du répertoire racine du plugin
- `CLAUDE_SESSION_ID` : Identifiant de session
- `COMPACT_THRESHOLD` : Seuil de suggestion de compactage (défaut 50)

</details>

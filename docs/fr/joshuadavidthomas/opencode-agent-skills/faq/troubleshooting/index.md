---
title: "Dépannage : Résolution des problèmes courants | opencode-agent-skills"
subtitle: "Dépannage : Résolution des problèmes courants"
sidebarTitle: "Que faire en cas de problème"
description: "Apprenez les méthodes de dépannage d'opencode-agent-skills. Couvre 9 catégories de problèmes courants incluant l'échec du chargement des skills, les erreurs d'exécution de scripts, les problèmes de sécurité des chemins, etc."
tags:
  - "troubleshooting"
  - "faq"
  - "dépannage"
prerequisite: []
order: 1
---

# Dépannage des problèmes courants

::: info
Cette leçon s'adresse à tous les utilisateurs rencontrant des problèmes d'utilisation, que vous soyez déjà familiarisé avec les fonctionnalités de base du plugin ou non. Si vous rencontrez des problèmes tels que l'échec du chargement des skills, des erreurs d'exécution de scripts, ou si vous souhaitez comprendre les méthodes de dépannage des problèmes courants, cette leçon vous aidera à identifier et résoudre rapidement ces problèmes courants.
:::

## Ce que vous apprendrez

- Identifier rapidement les causes de l'échec du chargement des skills
- Résoudre les erreurs d'exécution de scripts et les problèmes de permissions
- Comprendre le principe des restrictions de sécurité des chemins
- Diagnostiquer les problèmes de correspondance sémantique et de chargement de modèles

## Skill introuvable

### Symptômes
L'appel à `get_available_skills` retourne `No skills found matching your query`.

### Causes possibles
1. Le skill n'est pas installé dans le chemin de découverte
2. Le nom du skill est mal orthographié
3. Le format de SKILL.md ne respecte pas les spécifications

### Solutions

**Vérifier si le skill est dans le chemin de découverte** :

Le plugin recherche les skills selon la priorité suivante (la première correspondance est utilisée) :

| Priorité | Chemin | Type |
| --- | --- | --- |
| 1 | `.opencode/skills/` | Niveau projet (OpenCode) |
| 2 | `.claude/skills/` | Niveau projet (Claude) |
| 3 | `~/.config/opencode/skills/` | Niveau utilisateur (OpenCode) |
| 4 | `~/.claude/skills/` | Niveau utilisateur (Claude) |
| 5 | `~/.claude/plugins/cache/` | Cache du plugin |
| 6 | `~/.claude/plugins/marketplaces/` | Plugins installés |

Commandes de vérification :
```bash
# Vérifier les skills au niveau projet
ls -la .opencode/skills/
ls -la .claude/skills/

# Vérifier les skills au niveau utilisateur
ls -la ~/.config/opencode/skills/
ls -la ~/.claude/skills/
```

**Vérifier le format de SKILL.md** :

Le répertoire du skill doit contenir un fichier `SKILL.md` au format Anthropic Skills Spec :

```yaml
---
name: skill-name
description: Brève description du skill
license: MIT
allowed-tools:
  - read
  - write
metadata:
  author: your-name
---

Contenu du skill...
```

Points de vérification obligatoires :
- ✅ `name` doit être en minuscules, chiffres et tirets (ex. `git-helper`)
- ✅ `description` ne doit pas être vide
- ✅ Le frontmatter YAML doit être entouré de `---`
- ✅ Le contenu du skill doit suivre le deuxième `---`

**Utiliser la correspondance floue** :

Le plugin fournit des suggestions d'orthographe. Par exemple :
```
No skills found matching "git-helper". Did you mean "git-helper-tool"?
```

Si vous voyez un message similaire, réessayez avec le nom suggéré.

---

## Erreur "Skill inexistant"

### Symptômes
L'appel à `use_skill("skill-name")` retourne `Skill "skill-name" not found`.

### Causes possibles
1. Le nom du skill est mal orthographié
2. Le skill a été remplacé par un skill du même nom (conflit de priorité)
3. Le répertoire du skill manque de SKILL.md ou a un format incorrect

### Solutions

**Voir tous les skills disponibles** :

```bash
Utilisez l'outil get_available_skills pour lister tous les skills
```

**Comprendre les règles de remplacement par priorité** :

Si plusieurs chemins contiennent un skill du même nom, seul celui avec la **priorité la plus élevée** est actif. Par exemple :
- Niveau projet `.opencode/skills/git-helper/` → ✅ Actif
- Niveau utilisateur `~/.config/opencode/skills/git-helper/` → ❌ Remplacé

Vérifier les conflits de noms :
```bash
# Rechercher tous les skills du même nom
find .opencode/skills .claude/skills ~/.config/opencode/skills ~/.claude/skills \
  -name "git-helper" -type d
```

**Vérifier l'existence de SKILL.md** :

```bash
# Entrer dans le répertoire du skill
cd .opencode/skills/git-helper/

# Vérifier SKILL.md
ls -la SKILL.md

# Vérifier si le format YAML est correct
head -10 SKILL.md
```

---

## Échec de l'exécution du script

### Symptômes
L'appel à `run_skill_script` retourne une erreur de script ou un code de sortie non nul.

### Causes possibles
1. Le chemin du script est incorrect
2. Le script n'a pas les permissions d'exécution
3. Le script contient des erreurs logiques

### Solutions

**Vérifier si le script est dans la liste des scripts du skill** :

Lors du chargement du skill, les scripts disponibles sont listés :
```
Skill loaded. Available scripts:
- tools/build.sh
- scripts/setup.js
```

Si vous appelez un script inexistant :
```
Script "build.sh" not found in skill "my-skill". Available scripts: tools/build.sh, scripts/setup.js
```

**Utiliser le bon chemin relatif** :

Le chemin du script est relatif au répertoire du skill, sans `/` initial :
- ✅ Correct : `tools/build.sh`
- ❌ Incorrect : `/tools/build.sh`

**Accorder les permissions d'exécution** :

Le plugin n'exécute que les fichiers avec le bit d'exécution (`mode & 0o111`).

::: code-group

```bash [macOS/Linux]
# Accorder les permissions d'exécution
chmod +x .opencode/skills/my-skill/tools/build.sh

# Vérifier les permissions
ls -la .opencode/skills/my-skill/tools/build.sh
# La sortie doit contenir : -rwxr-xr-x
```

```powershell [Windows]
# Windows n'utilise pas les bits de permission Unix, assurez-vous que l'extension est correctement associée
# Scripts PowerShell : .ps1
# Scripts Bash (via Git Bash) : .sh
```

:::

**Déboguer les erreurs d'exécution** :

Si le script retourne une erreur, le plugin affiche le code de sortie et la sortie :
```
Script failed (exit 1): Error: Build failed at /path/to/script.js:42
```

Débogage manuel :
```bash
# Entrer dans le répertoire du skill
cd .opencode/skills/my-skill/

# Exécuter directement le script pour voir l'erreur détaillée
./tools/build.sh
```

---

## Erreur de chemin non sécurisé

### Symptômes
L'appel à `read_skill_file` ou `run_skill_script` retourne une erreur de chemin non sécurisé.

### Causes possibles
1. Le chemin contient `..` (traversée de répertoire)
2. Le chemin est absolu
3. Le chemin contient des caractères non standard

### Solutions

**Comprendre les règles de sécurité des chemins** :

Le plugin interdit l'accès aux fichiers en dehors du répertoire du skill pour prévenir les attaques par traversée de répertoire.

Exemples de chemins autorisés (relatifs au répertoire du skill) :
- ✅ `docs/guide.md`
- ✅ `config/settings.json`
- ✅ `tools/setup.sh`

Exemples de chemins interdits :
- ❌ `../../../etc/passwd` (traversée de répertoire)
- ❌ `/tmp/file.txt` (chemin absolu)
- ❌ `./../other-skill/file.md` (traversée vers un autre répertoire)

**Utiliser des chemins relatifs** :

Utilisez toujours des chemins relatifs au répertoire du skill, sans `/` ou `../` initial :
```bash
# Lire la documentation du skill
read_skill_file("my-skill", "docs/guide.md")

# Exécuter le script du skill
run_skill_script("my-skill", "tools/build.sh")
```

**Lister les fichiers disponibles** :

Si vous n'êtes pas sûr du nom du fichier, consultez d'abord la liste des fichiers du skill :
```
Après l'appel à use_skill, la réponse contient :
Available files:
- docs/guide.md
- config/settings.json
- README.md
```

---

## Échec du chargement du modèle Embedding

### Symptômes
La fonction de correspondance sémantique ne fonctionne pas, les logs affichent `Model failed to load`.

### Causes possibles
1. Problème de connexion réseau (téléchargement initial du modèle)
2. Fichiers du modèle corrompus
3. Problème de permissions du répertoire de cache

### Solutions

**Vérifier la connexion réseau** :

Lors de la première utilisation, le plugin doit télécharger le modèle `all-MiniLM-L6-v2` (environ 238 Mo) depuis Hugging Face. Assurez-vous que votre réseau peut accéder à Hugging Face.

**Nettoyer et retélécharger le modèle** :

Le modèle est mis en cache dans `~/.cache/opencode-agent-skills/` :

```bash
# Supprimer le répertoire de cache
rm -rf ~/.cache/opencode-agent-skills/

# Redémarrer OpenCode, le plugin retéléchargera automatiquement le modèle
```

**Vérifier les permissions du répertoire de cache** :

```bash
# Voir le répertoire de cache
ls -la ~/.cache/opencode-agent-skills/

# Assurer les permissions de lecture/écriture
chmod -R 755 ~/.cache/opencode-agent-skills/
```

**Vérifier manuellement le chargement du modèle** :

Si le problème persiste, consultez les logs détaillés dans les logs du plugin :
```
Consultez les logs OpenCode, recherchez "embedding" ou "model"
```

---

## Échec de l'analyse de SKILL.md

### Symptômes
Le répertoire du skill existe mais n'est pas découvert par le plugin, ou retourne une erreur de format lors du chargement.

### Causes possibles
1. Erreur de format du frontmatter YAML
2. Champs obligatoires manquants
3. Valeurs de champs ne respectant pas les règles de validation

### Solutions

**Vérifier le format YAML** :

La structure de SKILL.md doit être la suivante :

```markdown
---
name: my-skill
description: Description du skill
---

Contenu du skill...
```

Erreurs courantes :
- ❌ Manque le séparateur `---`
- ❌ Indentation YAML incorrecte (YAML utilise 2 espaces d'indentation)
- ❌ Manque l'espace après les deux-points

**Vérifier les champs obligatoires** :

| Champ | Type | Obligatoire | Contraintes |
| --- | --- | --- | --- |
| name | string | ✅ | Minuscules, chiffres, tirets, non vide |
| description | string | ✅ | Non vide |

**Tester la validité YAML** :

Utilisez un outil en ligne pour valider le format YAML :
- [YAML Lint](https://www.yamllint.com/)

Ou utilisez l'outil en ligne de commande :
```bash
# Installer yamllint
pip install yamllint

# Valider le fichier
yamllint SKILL.md
```

**Vérifier la zone de contenu du skill** :

Le contenu du skill doit suivre le deuxième `---` :

```markdown
---
name: my-skill
description: Description du skill
---

Ici commence le contenu du skill, qui sera injecté dans le contexte de l'IA...
```

Si le contenu du skill est vide, le plugin ignorera ce skill.

---

## Recommandation automatique non fonctionnelle

### Symptômes
Après l'envoi d'un message pertinent, l'IA ne reçoit pas de suggestion de skill.

### Causes possibles
1. Similarité inférieure au seuil (par défaut 0.35)
2. Description du skill insuffisamment détaillée
3. Modèle non chargé

### Solutions

**Améliorer la qualité de la description du skill** :

Plus la description du skill est spécifique, plus la correspondance sémantique est précise.

| ❌ Mauvaise description | ✅ Bonne description |
| --- | --- |
| "Outil Git" | "Aide à exécuter les opérations Git : créer des branches, committer du code, fusionner des PR, résoudre des conflits" |
| "Aide aux tests" | "Générer des tests unitaires, exécuter des suites de tests, analyser la couverture de test, réparer les tests échoués" |

**Appeler manuellement le skill** :

Si la recommandation automatique ne fonctionne pas, vous pouvez charger manuellement :

```
Utilisez l'outil use_skill("skill-name")
```

**Ajuster le seuil de similarité** (avancé) :

Le seuil par défaut est 0.35. Si vous trouvez qu'il y a trop peu de recommandations, vous pouvez l'ajuster dans le code source (`src/embeddings.ts:10`) :

```typescript
export const SIMILARITY_THRESHOLD = 0.35; // Diminuer cette valeur augmentera les recommandations
```

::: warning
Modifier le code source nécessite de recompiler le plugin, ce qui n'est pas recommandé pour les utilisateurs ordinaires.
:::

---

## Skill inefficace après compression du contexte

### Symptômes
Après une longue conversation, l'IA semble "oublier" les skills déjà chargés.

### Causes possibles
1. Version du plugin inférieure à v0.1.0
2. Initialisation de la session incomplète

### Solutions

**Vérifier la version du plugin** :

La fonction de restauration après compression est prise en charge à partir de v0.1.0. Si le plugin est installé via npm, vérifiez la version :

```bash
# Voir le package.json dans le répertoire des plugins OpenCode
cat ~/.config/opencode/plugins/opencode-agent-skills/package.json | grep version
```

**Confirmer que l'initialisation de la session est terminée** :

Le plugin injecte la liste des skills lors du premier message. Si l'initialisation de la session n'est pas terminée, la restauration après compression peut échouer.

Symptômes :
- La liste des skills n'apparaît pas après le premier message
- L'IA ne connaît pas les skills disponibles

**Redémarrer la session** :

Si le problème persiste, supprimez la session actuelle et créez-en une nouvelle :
```
Dans OpenCode, supprimez la session et recommencez la conversation
```

---

## Échec de la recherche récursive des scripts

### Symptômes
Le skill contient des scripts profondément imbriqués, mais ils ne sont pas découverts par le plugin.

### Causes possibles
1. Profondeur de récursion dépassant 10 niveaux
2. Scripts dans un répertoire caché (commençant par `.`)
3. Scripts dans un répertoire de dépendances (comme `node_modules`)

### Solutions

**Comprendre les règles de recherche récursive** :

Lors de la recherche récursive des scripts, le plugin :
- Profondeur maximale : 10 niveaux
- Ignore les répertoires cachés (nom commençant par `.`) : `.git`, `.vscode`, etc.
- Ignore les répertoires de dépendances : `node_modules`, `__pycache__`, `vendor`, `.venv`, `venv`, `.tox`, `.nox`

**Ajuster l'emplacement des scripts** :

Si les scripts sont dans un répertoire profond, vous pouvez :
- Les remonter vers un répertoire moins profond (ex. `tools/` plutôt que `src/lib/utils/tools/`)
- Utiliser un lien symbolique vers l'emplacement du script (systèmes Unix)

```bash
# Créer un lien symbolique
ln -s ../../../scripts/build.sh tools/build.sh
```

**Lister les scripts découverts** :

Après le chargement du skill, le plugin retourne la liste des scripts. Si un script n'est pas dans la liste, vérifiez :
1. Si le fichier a les permissions d'exécution
2. Si le répertoire correspond aux règles d'ignorance

---

## Résumé de cette leçon

Cette leçon couvre 9 catégories de problèmes courants lors de l'utilisation du plugin OpenCode Agent Skills :

| Type de problème | Points de vérification clés |
| --- | --- |
| Skill introuvable | Chemin de découverte, format de SKILL.md, orthographe |
| Skill inexistant | Exactitude du nom, remplacement par priorité, existence du fichier |
| Échec de l'exécution du script | Chemin du script, permissions d'exécution, logique du script |
| Chemin non sécurisé | Chemin relatif, pas de `..`, pas de chemin absolu |
| Échec du chargement du modèle | Connexion réseau, nettoyage du cache, permissions du répertoire |
| Échec de l'analyse | Format YAML, champs obligatoires, contenu du skill |
| Recommandation automatique non fonctionnelle | Qualité de la description, seuil de similarité, appel manuel |
| Skill inefficace après compression | Version du plugin, initialisation de la session |
| Échec de la recherche récursive | Limite de profondeur, règles d'ignorance des répertoires, permissions d'exécution |

---

## Aperçu de la prochaine leçon

> La prochaine leçon portera sur les **[Considérations de sécurité](../security-considerations/)**.
>
> Vous apprendrez :
> - La conception des mécanismes de sécurité du plugin
> - Comment écrire des skills sécurisés
> - Le principe de la validation des chemins et du contrôle des permissions
> - Les meilleures pratiques de sécurité

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Suggestions de correspondance floue pour les requêtes de skills | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L49-L59) | 49-59 |
| Gestion des erreurs de skill inexistant | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L89-L97) | 89-97 |
| Gestion des erreurs de script inexistant | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L167-L177) | 167-177 |
| Gestion des erreurs d'échec d'exécution de script | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L184-L195) | 184-195 |
| Vérification de sécurité des chemins | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L130-L133) | 130-133 |
| Gestion des erreurs d'analyse de SKILL.md | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L127-L152) | 127-152 |
| Erreur de chargement du modèle | [`src/embeddings.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/embeddings.ts#L38-L40) | 38-40 |
| Algorithme de correspondance floue | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L88-L125) | 88-125 |

**Constantes clés** :
- `SIMILARITY_THRESHOLD = 0.35` (seuil de similarité) : `src/embeddings.ts:10`
- `TOP_K = 5` (nombre de skills les plus similaires retournés) : `src/embeddings.ts:11`

**Autres valeurs importantes** :
- `maxDepth = 10` (profondeur maximale de récursion des scripts, paramètre par défaut de findScripts) : `src/skills.ts:59`
- `0.4` (seuil de correspondance floue, condition de retour de findClosestMatch) : `src/utils.ts:124`

**Fonctions clés** :
- `findClosestMatch()` : Algorithme de correspondance floue, utilisé pour générer des suggestions d'orthographe
- `isPathSafe()` : Vérification de sécurité des chemins, prévention de la traversée de répertoire
- `ensureModel()` : S'assurer que le modèle d'embedding est chargé
- `parseSkillFile()` : Analyser SKILL.md et valider le format

</details>

---
title: "Intégration Superpowers : Configurer le Workflow | opencode-agent-skills"
subtitle: "Intégration Superpowers : Configurer le Workflow | opencode-agent-skills"
sidebarTitle: "Activer Superpowers"
description: "Apprenez à installer et configurer le mode Superpowers. Activez les workflows guidés via les variables d'environnement et maîtrisez les règles de mappage des outils et des priorités des espaces de noms."
tags:
  - "Configuration avancée"
  - "Workflow"
  - "Superpowers"
prerequisite:
  - "start-installation"
order: 2
---

# Intégration du Workflow Superpowers

## Ce que vous pourrez faire après ce tutoriel

- Comprendre la valeur et les cas d'usage du workflow Superpowers
- Installer et configurer correctement le mode Superpowers
- Comprendre le système de mappage des outils et des espaces de noms des compétences
- Maîtriser le mécanisme d'injection automatique de Superpowers lors de la récupération de compression

## Les défis auxquels vous faites face

Vous vous posez peut-être ces questions :

- **Workflow non standardisé** : Les habitudes de développement de l'équipe ne sont pas unifiées, la qualité du code est inégale
- **Processus manquant de rigueur** : Bien qu'il y ait une bibliothèque de compétences, l'assistant IA n'a pas de directives de processus claires
- **Appels d'outils chaotiques** : Les outils définis par Superpowers ont des noms différents des outils natifs d'OpenCode, entraînant des échecs d'appel
- **Coût de migration élevé** : Vous utilisez déjà Superpowers et craignez de devoir reconfigurer après le passage à OpenCode

Ces problèmes affectent l'efficacité du développement et la qualité du code.

## Concept fondamental

::: info Qu'est-ce que Superpowers ?
Superpowers est un framework complet de workflow de développement logiciel qui fournit des directives de workflow strictes via des compétences composables. Il définit des étapes de développement standardisées, des méthodes d'appel d'outils et un système d'espaces de noms.
:::

**OpenCode Agent Skills fournit une intégration transparente de Superpowers**, qui injecte automatiquement des directives de workflow complètes via une variable d'environnement, incluant :

1. **Contenu de la compétence using-superpowers** : Instructions de workflow central Superpowers
2. **Mappage des outils** : Mapper les noms d'outils définis par Superpowers vers les outils natifs OpenCode
3. **Espaces de noms des compétences** : Clarifier les priorités et méthodes de référence des compétences

## 🎒 Préparatifs

Avant de commencer, assurez-vous que :

::: warning Vérifications préalables
- ✅ Le plugin [opencode-agent-skills](../../start/installation/) est installé
- ✅ Vous connaissez le mécanisme de base de découverte des compétences
:::

## Suivez-moi

### Étape 1 : Installer Superpowers

**Pourquoi**
Vous devez d'abord installer le projet Superpowers pour que ce plugin puisse découvrir la compétence `using-superpowers`.

**Comment faire**

Selon vos besoins, choisissez l'une des méthodes suivantes pour installer Superpowers :

::: code-group

```bash [En tant que plugin Claude Code]
// Suivez la documentation officielle Superpowers pour l'installation
// https://github.com/obra/superpowers
// La compétence sera automatiquement située dans ~/.claude/plugins/...
```

```bash [En tant que compétence OpenCode]
// Installation manuelle en tant que compétence OpenCode
mkdir -p ~/.config/opencode/skills
git clone https://github.com/obra/superpowers ~/.config/opencode/skills/superpowers
// La compétence sera située dans .opencode/skills/superpowers/ (niveau projet) ou ~/.config/opencode/skills/superpowers/ (niveau utilisateur)
```

:::

**Vous devriez voir** :
- Après l'installation, le répertoire des compétences Superpowers contient le fichier `using-superpowers/SKILL.md`

### Étape 2 : Activer le mode Superpowers

**Pourquoi**
Utilisez une variable d'environnement pour indiquer au plugin d'activer le mode Superpowers. Le plugin injectera automatiquement le contenu pertinent lors de l'initialisation de la session.

**Comment faire**

Activation temporaire (uniquement pour la session terminale actuelle) :

```bash
export OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true
opencode
```

Activation permanente (ajouter au fichier de configuration du shell) :

::: code-group

```bash [Bash (~/.bashrc ou ~/.bash_profile)]
echo 'export OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true' >> ~/.bashrc
source ~/.bashrc
```

```zsh [Zsh (~/.zshrc)]
echo 'export OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true' >> ~/.zshrc
source ~/.zshrc
```

```powershell [PowerShell (~/.config/powershell/Microsoft.PowerShell_profile.ps1)]
[System.Environment]::SetEnvironmentVariable('OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE', 'true', 'User')
```

:::

**Vous devriez voir** :
- La commande `echo $OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE` affiche `true`

### Étape 3 : Vérifier l'injection automatique

**Pourquoi**
Confirmez que le plugin reconnaît correctement la compétence Superpowers et injecte automatiquement le contenu au début d'une nouvelle session.

**Comment faire**

1. Redémarrez OpenCode
2. Créez une nouvelle session
3. Entrez n'importe quel message dans la nouvelle session (par exemple "bonjour")
4. Consultez le contexte de la session (si OpenCode le supporte)

**Vous devriez voir** :
- Le plugin injecte automatiquement en arrière-plan le contenu suivant (formaté en XML) :

```xml
<EXTREMELY_IMPORTANT>
You have superpowers.

**IMPORTANT: The using-superpowers skill content is included below. It is ALREADY LOADED - do not call use_skill for it again. Use use_skill only for OTHER skills.**

[Contenu réel de la compétence using-superpowers...]

**Tool Mapping for OpenCode:**
- `TodoWrite` → `todowrite`
- `Task` tool with subagents → Use `task` tool with `subagent_type`
- `Skill` tool → `use_skill`
- `Read`, `Write`, `Edit`, `Bash`, `Glob`, `Grep`, `WebFetch` → Use native lowercase OpenCode tools

**Skill namespace priority:**
1. Project: `project:skill-name`
2. Claude project: `claude-project:skill-name`
3. User: `skill-name`
4. Claude user: `claude-user:skill-name`
5. Marketplace: `claude-plugins:skill-name`

The first discovered match wins.
</EXTREMELY_IMPORTANT>
```

## Point de contrôle ✅

Après avoir terminé les étapes ci-dessus, vérifiez les éléments suivants :

| Élément de vérification | Résultat attendu |
|---|---|
| Variable d'environnement correctement définie | La commande `echo $OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE` affiche `true` |
| Compétence Superpowers détectable | L'appel de `get_available_skills()` montre `using-superpowers` |
| Injection automatique dans les nouvelles sessions | Après création d'une nouvelle session, l'IA sait qu'elle a des superpowers |

## Pièges courants à éviter

### ❌ Erreur 1 : Compétence non détectée

**Symptôme** : La variable d'environnement est activée, mais le plugin n'injecte pas le contenu Superpowers.

**Cause** : L'emplacement d'installation de Superpowers n'est pas dans le chemin de découverte des compétences.

**Solution** :
- Vérifiez que Superpowers est installé dans l'un des emplacements suivants :
  - `.claude/plugins/...` (cache des plugins Claude Code)
  - `.opencode/skills/...` (répertoire des compétences OpenCode)
  - `~/.config/opencode/skills/...` (compétences utilisateur OpenCode)
  - `~/.claude/skills/...` (compétences utilisateur Claude)
- Exécutez `get_available_skills()` pour vérifier que `using-superpowers` est dans la liste

### ❌ Erreur 2 : Échec de l'appel d'outils

**Symptôme** : L'IA tente d'appeler les outils `TodoWrite` ou `Skill`, mais reçoit un message indiquant que l'outil n'existe pas.

**Cause** : L'IA n'a pas appliqué le mappage des outils et utilise toujours les noms définis par Superpowers.

**Solution** :
- Le plugin injecte automatiquement le mappage des outils, assurez-vous que la balise `<EXTREMELY_IMPORTANT>` est correctement injectée
- Si le problème persiste, vérifiez que la session a été créée après l'activation de la variable d'environnement

### ❌ Erreur 3 : Superpowers disparaît après compression

**Symptôme** : Après une longue session, l'IA ne suit plus le workflow Superpowers.

**Cause** : La compression du contexte a entraîné la suppression du contenu injecté précédemment.

**Solution** :
- Le plugin réinjecte automatiquement le contenu Superpowers après l'événement `session.compacted`
- Si le problème persiste, vérifiez que le plugin écoute correctement les événements

## Explication détaillée du mappage des outils

Le plugin injecte automatiquement le mappage des outils suivant pour aider l'IA à appeler correctement les outils OpenCode :

| Outil Superpowers | Outil OpenCode | Description |
|---|---|---|
| `TodoWrite` | `todowrite` | Outil d'écriture des tâches |
| `Task` (avec subagents) | `task` + `subagent_type` | Appel de sous-agent |
| `Skill` | `use_skill` | Chargement de compétence |
| `Read` / `Write` / `Edit` | Outils natifs en minuscules | Opérations sur fichiers |
| `Bash` / `Glob` / `Grep` / `WebFetch` | Outils natifs en minuscules | Opérations système |

::: tip Pourquoi le mappage des outils est-il nécessaire ?
Superpowers est nativement conçu pour Claude Code, et les noms d'outils diffèrent d'OpenCode. Grâce au mappage automatique, l'IA peut utiliser de manière transparente les outils natifs d'OpenCode sans conversion manuelle.
:::

## Priorité des espaces de noms des compétences

Lorsque des compétences de même nom existent dans plusieurs sources, le plugin choisit selon la priorité suivante :

```
1. project:skill-name         (Compétence OpenCode niveau projet)
2. claude-project:skill-name  (Compétence Claude niveau projet)
3. skill-name                (Compétence OpenCode niveau utilisateur)
4. claude-user:skill-name    (Compétence Claude niveau utilisateur)
5. claude-plugins:skill-name (Compétence du marketplace de plugins)
```

::: info Référencement des espaces de noms
Vous pouvez spécifier explicitement l'espace de noms : `use_skill("project:my-skill")`  
Ou laisser le plugin faire la correspondance automatique : `use_skill("my-skill")`
:::

**La première correspondance découverte est utilisée**, les compétences de même nom ultérieures sont ignorées. Cela permet aux compétences niveau projet de remplacer les compétences niveau utilisateur.

## Mécanisme de récupération après compression

Au cours des sessions longues, OpenCode effectue une compression du contexte pour économiser des tokens. Le plugin assure la disponibilité continue de Superpowers via les mécanismes suivants :

1. **Écoute des événements** : Le plugin écoute l'événement `session.compacted`
2. **Réinjection** : Une fois la compression terminée, le contenu Superpowers est réinjecté automatiquement
3. **Transition transparente** : Les directives de workflow de l'IA restent toujours présentes et ne sont pas interrompues par la compression

## Résumé de cette leçon

L'intégration Superpowers fournit des directives de workflow strictes, les points clés sont :

- **Installer Superpowers** : Choisissez d'installer en tant que plugin Claude Code ou compétence OpenCode
- **Activer la variable d'environnement** : Définissez `OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true`
- **Injection automatique** : Le plugin injecte automatiquement le contenu lors de l'initialisation de la session et après compression
- **Mappage des outils** : Mappez automatiquement les noms d'outils Superpowers vers les outils natifs OpenCode
- **Priorité des espaces de noms** : Les compétences niveau projet ont priorité sur les compétences niveau utilisateur

## Aperçu de la prochaine leçon

> La prochaine leçon portera sur **[Espaces de noms et priorité des compétences](../namespaces-and-priority/)**.
>
> Vous apprendrez :
> - À comprendre le système d'espaces de noms des compétences et les règles de priorité de découverte
> - À maîtriser l'utilisation des espaces de noms pour spécifier explicitement la source des compétences
> - À connaître les mécanismes de remplacement et de gestion des conflits pour les compétences de même nom

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Fonctionnalité | Chemin du fichier | Ligne |
|---|---|---|
| Module d'intégration Superpowers | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L1-L59) | 1-59 |
| Définition du mappage des outils | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L12-L16) | 12-16 |
| Définition des espaces de noms des compétences | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L18-L25) | 18-25 |
| Fonction d'injection du contenu Superpowers | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L31-L58) | 31-58 |
| Vérification des variables d'environnement | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L37) | 37 |
| Appel d'injection à l'initialisation de la session | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L101) | 101 |
| Réinjection après compression | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L148) | 148 |

**Constantes clés** :
- `OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE` : Variable d'environnement, définie sur `'true'` pour activer le mode Superpowers

**Fonctions clés** :
- `maybeInjectSuperpowersBootstrap()` : Vérifie la variable d'environnement et l'existence de la compétence, injecte le contenu Superpowers
- `discoverAllSkills()` : Découvre toutes les compétences disponibles (utilisé pour trouver `using-superpowers`)
- `injectSyntheticContent()` : Injecte le contenu sous forme de message synthétique dans la session

</details>

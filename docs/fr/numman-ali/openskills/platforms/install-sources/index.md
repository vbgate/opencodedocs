---
title: "Sources d'installation : Installer des compétences de plusieurs manières | openskills"
sidebarTitle: "Choisissez parmi trois sources"
subtitle: "Détail des sources d'installation"
description: "Apprenez les trois méthodes d'installation des compétences OpenSkills. Maîtrisez l'installation depuis les dépôts GitHub, les chemins locaux et les dépôts Git privés, y compris l'authentification SSH/HTTPS et la configuration des sous-chemins."
tags:
  - "Intégration de plateforme"
  - "Gestion des compétences"
  - "Configuration d'installation"
prerequisite:
  - "start-first-skill"
order: 2
---

# Détail des sources d'installation

## Ce que vous pourrez faire après ce cours

- Installer des compétences de trois manières : dépôt GitHub, chemin local, dépôt Git privé
- Choisir la source d'installation la plus appropriée en fonction du scénario
- Comprendre les avantages, inconvénients et précautions des différentes sources
- Maîtriser les formats GitHub shorthand, chemin relatif, URL de dépôt privé, etc.

::: info Connaissances préalables

Ce tutoriel suppose que vous avez déjà terminé [Installer la première compétence](../../start/first-skill/) et que vous comprenez le processus d'installation de base.

:::

---

## Votre dilemme actuel

Vous avez peut-être déjà appris à installer des compétences depuis le dépôt officiel, mais :

- **Seul GitHub est-il disponible ?** : Vous voulez utiliser le dépôt GitLab interne de votre entreprise, mais vous ne savez pas comment le configurer
- **Comment installer des compétences en développement local ?** : Vous développez votre propre compétence et souhaitez la tester sur votre machine
- **Vous voulez spécifier directement une compétence** : Il y a plusieurs compétences dans le dépôt, vous ne voulez pas les choisir via l'interface interactive à chaque fois
- **Comment accéder aux dépôts privés ?** : Le dépôt de compétences de votre entreprise est privé, vous ne savez pas comment vous authentifier

En fait, OpenSkills prend en charge plusieurs sources d'installation, voyons-les une par une.

---

## Quand utiliser cette méthode

**Scénarios d'utilisation des différentes sources d'installation** :

| Source d'installation | Scénario d'utilisation | Exemple |
|--- | --- | ---|
| **Dépôt GitHub** | Utiliser des compétences de la communauté open source | `openskills install anthropics/skills` |
| **Chemin local** | Développer et tester vos propres compétences | `openskills install ./my-skill` |
| **Dépôt Git privé** | Utiliser les compétences internes de l'entreprise | `openskills install git@github.com:my-org/private-skills.git` |

::: tip Pratique recommandée

- **Compétences open source** : Installez prioritairement depuis les dépôts GitHub pour faciliter les mises à jour
- **Phase de développement** : Installez depuis les chemins locaux pour tester les modifications en temps réel
- **Collaboration en équipe** : Utilisez des dépôts Git privés pour une gestion unifiée des compétences internes

:::

---

## Concept clé : trois sources, un même mécanisme

Bien que les sources d'installation soient différentes, le mécanisme sous-jacent d'OpenSkills est le même :

```
[Identifier le type de source] → [Obtenir les fichiers de compétences] → [Copier vers .claude/skills/]
```

**Logique d'identification de la source** (code source `install.ts:25-45`) :

```typescript
function isLocalPath(source: string): boolean {
  return (
    source.startsWith('/') ||
    source.startsWith('./') ||
    source.startsWith('../') ||
    source.startsWith('~/')
  );
}

function isGitUrl(source: string): boolean {
  return (
    source.startsWith('git@') ||
    source.startsWith('git://') ||
    source.startsWith('http://') ||
    source.startsWith('https://') ||
    source.endsWith('.git')
  );
}
```

**Priorité de jugement** :
1. Vérifier d'abord si c'est un chemin local (`isLocalPath`)
2. Vérifier ensuite si c'est une URL Git (`isGitUrl`)
3. Traiter enfin comme GitHub shorthand (`owner/repo`)

---

## Suivez-moi

### Méthode 1 : Installer depuis un dépôt GitHub

**Scénario d'utilisation** : Installer des compétences de la communauté open source, comme le dépôt officiel Anthropic ou des packs de compétences tiers.

#### Utilisation de base : installer tout le dépôt

```bash
npx openskills install owner/repo
```

**Exemple** : Installer des compétences depuis le dépôt officiel Anthropic

```bash
npx openskills install anthropics/skills
```

**Ce que vous devriez voir** :

```
Installing from: anthropics/skills
Location: project (.claude/skills)

Cloning repository...
✓ Repository cloned

Found 4 skill(s)

? Select skills to install:
❯ ◉ pdf (24 KB)
  ◯ git-workflow (12 KB)
  ◯ check-branch-first (8 KB)
  ◯ skill-creator (16 KB)
```

#### Utilisation avancée : spécifier un sous-chemin (installer directement une compétence spécifique)

Si le dépôt contient plusieurs compétences, vous pouvez spécifier directement le sous-chemin de la compétence à installer, en sautant la sélection interactive :

```bash
npx openskills install owner/repo/skill-name
```

**Exemple** : Installer directement la compétence de traitement PDF

```bash
npx openskills install anthropics/skills/pdf
```

**Ce que vous devriez voir** :

```
Installing from: anthropics/skills/pdf
Location: project (.claude/skills)

Cloning repository...
✓ Repository cloned
✅ Installed: pdf
   Location: /path/to/project/.claude/skills/pdf
```

::: tip Pratique recommandée

Lorsque vous n'avez besoin que d'une seule compétence dans le dépôt, l'utilisation du format de sous-chemin peut vous faire sauter la sélection interactive, ce qui est plus rapide.

:::

#### Règles GitHub shorthand (code source `install.ts:131-143`)

| Format | Exemple | Résultat de conversion |
|--- | --- | ---|
| `owner/repo` | `anthropics/skills` | `https://github.com/anthropics/skills` |
|--- | --- | ---|

---

### Méthode 2 : Installer depuis un chemin local

**Scénario d'utilisation** : Vous développez votre propre compétence et souhaitez la tester sur votre machine avant de la publier sur GitHub.

#### Utiliser un chemin absolu

```bash
npx openskills install /absolute/path/to/skill
```

**Exemple** : Installer depuis le répertoire de compétences dans votre répertoire personnel

```bash
npx openskills install ~/dev/my-skills/pdf-processor
```

#### Utiliser un chemin relatif

```bash
npx openskills install ./local-skills/my-skill
```

**Exemple** : Installer depuis le sous-répertoire `local-skills/` dans le répertoire du projet

```bash
npx openskills install ./local-skills/web-scraper
```

**Ce que vous devriez voir** :

```
Installing from: ./local-skills/web-scraper
Location: project (.claude/skills)
✅ Installed: web-scraper
   Location: /path/to/project/.claude/skills/web-scraper
```

::: warning Précautions

L'installation depuis un chemin local copie les fichiers de compétences vers `.claude/skills/`, les modifications ultérieures des fichiers sources ne seront pas automatiquement synchronisées. Pour mettre à jour, vous devez réinstaller.

:::

#### Installer un répertoire local contenant plusieurs compétences

Si la structure de votre répertoire local est la suivante :

```
local-skills/
├── pdf-processor/SKILL.md
├── web-scraper/SKILL.md
└── git-helper/SKILL.md
```

Vous pouvez installer tout le répertoire directement :

```bash
npx openskills install ./local-skills
```

Cela lancera l'interface de sélection interactive, vous permettant de choisir les compétences à installer.

#### Formats de chemins locaux pris en charge (code source `install.ts:25-32`)

| Format | Description | Exemple |
|--- | --- | ---|
| `/absolute/path` | Chemin absolu | `/home/user/skills/my-skill` |
| `./relative/path` | Chemin relatif au répertoire actuel | `./local-skills/my-skill` |
| `../relative/path` | Chemin relatif au répertoire parent | `../shared-skills/common` |
| `~/path` | Chemin relatif au répertoire personnel | `~/dev/my-skills` |

::: tip Astuce de développement

Utiliser l'abréviation `~` permet de référencer rapidement les compétences dans votre répertoire personnel, adapté à l'environnement de développement personnel.

:::

---

### Méthode 3 : Installer depuis un dépôt Git privé

**Scénario d'utilisation** : Utiliser des dépôts GitLab/Bitbucket internes à l'entreprise ou des dépôts GitHub privés.

#### Méthode SSH (recommandée)

```bash
npx openskills install git@github.com:owner/private-skills.git
```

**Exemple** : Installer depuis un dépôt GitHub privé

```bash
npx openskills install git@github.com:my-org/internal-skills.git
```

**Ce que vous devriez voir** :

```
Installing from: git@github.com:my-org/internal-skills.git
Location: project (.claude/skills)

Cloning repository...
✓ Repository cloned

Found 3 skill(s)
? Select skills to install:
```

::: tip Configuration de l'authentification

La méthode SSH nécessite que vous ayez déjà configuré vos clés SSH. Si le clonage échoue, veuillez vérifier :

```bash
# Tester la connexion SSH
ssh -T git@github.com

# Si le message "Hi username! You've successfully authenticated..." apparaît, la configuration est correcte
```

:::

#### Méthode HTTPS (nécessite des identifiants)

```bash
npx openskills install https://github.com/owner/private-skills.git
```

::: warning Authentification HTTPS

Lors du clonage d'un dépôt privé via HTTPS, Git vous demandera de saisir votre nom d'utilisateur et votre mot de passe (ou Personal Access Token). Si vous utilisez l'authentification à deux facteurs, vous devez utiliser un Personal Access Token plutôt que votre mot de compte.

:::

#### Autres plateformes d'hébergement Git

**GitLab (SSH)** :

```bash
npx openskills install git@gitlab.com:owner/skills.git
```

**GitLab (HTTPS)** :

```bash
npx openskills install https://gitlab.com/owner/skills.git
```

**Bitbucket (SSH)** :

```bash
npx openskills install git@bitbucket.org:owner/skills.git
```

**Bitbucket (HTTPS)** :

```bash
npx openskills install https://bitbucket.org/owner/skills.git
```

::: tip Pratique recommandée

Pour les compétences internes d'une équipe, il est recommandé d'utiliser des dépôts Git privés, car :
- Tous les membres peuvent installer depuis la même source
- Pour mettre à jour les compétences, il suffit d'exécuter `openskills update`
- Facilite la gestion des versions et le contrôle des accès

:::

#### Règles d'identification des URL Git (code source `install.ts:37-45`)

| Préfixe/Suffixe | Description | Exemple |
|--- | --- | ---|
| `git@` | Protocole SSH | `git@github.com:owner/repo.git` |
| `git://` | Protocole Git | `git://github.com/owner/repo.git` |
| `http://` | Protocole HTTP | `http://github.com/owner/repo.git` |
| `https://` | Protocole HTTPS | `https://github.com/owner/repo.git` |
| Suffixe `.git` | Dépôt Git (n'importe quel protocole) | `owner/repo.git` |

---

## Point de contrôle ✅

Après avoir terminé ce cours, veuillez confirmer :

- [ ] Vous savez comment installer des compétences depuis un dépôt GitHub (format `owner/repo`)
- [ ] Vous savez comment installer directement une compétence spécifique dans un dépôt (format `owner/repo/skill-name`)
- [ ] Vous savez comment installer des compétences depuis un chemin local (`./`, `~/`, etc.)
- [ ] Vous savez comment installer des compétences depuis un dépôt Git privé (SSH/HTTPS)
- [ ] Vous comprenez les scénarios d'utilisation des différentes sources d'installation

---

## Attention aux pièges

### Problème 1 : Le chemin local n'existe pas

**Symptôme** :

```
Error: Path does not exist: ./local-skills/my-skill
```

**Cause** :
- Erreur de frappe dans le chemin
- Erreur de calcul du chemin relatif

**Solution** :
1. Vérifiez si le chemin existe : `ls ./local-skills/my-skill`
2. Utilisez un chemin absolu pour éviter la confusion des chemins relatifs

---

### Problème 2 : Échec du clonage du dépôt privé

**Symptôme** :

```
✗ Failed to clone repository
fatal: repository 'git@github.com:owner/private-skills.git' does not appear to be a git repository
```

**Cause** :
- Clés SSH non configurées
- Pas d'accès au dépôt
- Adresse du dépôt incorrecte

**Solution** :
1. Testez la connexion SSH : `ssh -T git@github.com`
2. Confirmez que vous avez accès au dépôt
3. Vérifiez que l'adresse du dépôt est correcte

::: tip Astuce

Pour les dépôts privés, l'outil affichera le message suivant (code source `install.ts:167`) :

```
Tip: For private repos, ensure git SSH keys or credentials are configured
```

:::

---

### Problème 3 : SKILL.md introuvable dans le sous-chemin

**Symptôme** :

```
Error: SKILL.md not found at skills/my-skill
```

**Cause** :
- Sous-chemin incorrect
- La structure des répertoires dans le dépôt est différente de celle attendue

**Solution** :
1. Installez d'abord tout le dépôt sans sous-chemin : `npx openskills install owner/repo`
2. Consultez les compétences disponibles via l'interface interactive
3. Réinstallez avec le bon sous-chemin

---

### Problème 4 : Erreur d'identification GitHub shorthand

**Symptôme** :

```
Error: Invalid source format
Expected: owner/repo, owner/repo/skill-name, git URL, or local path
```

**Cause** :
- Le format ne correspond à aucune règle
- Erreur de frappe (comme `owner / repo` avec un espace au milieu)

**Solution** :
- Vérifiez que le format est correct (pas d'espace, nombre de barres obliques correct)
- Utilisez l'URL Git complète plutôt que le shorthand

---

## Résumé du cours

Dans ce cours, vous avez appris :

- **Trois sources d'installation** : Dépôt GitHub, chemin local, dépôt Git privé
- **GitHub shorthand** : Deux formats `owner/repo` et `owner/repo/skill-name`
- **Formats de chemins locaux** : Chemin absolu, chemin relatif, abréviation du répertoire personnel
- **Installation de dépôt privé** : Deux méthodes SSH et HTTPS, syntaxes pour différentes plateformes
- **Logique d'identification de source** : Comment l'outil détermine le type de source d'installation que vous avez fourni

**Référence rapide des commandes principales** :

| Commande | Action |
|--- | ---|
| `npx openskills install owner/repo` | Installer depuis un dépôt GitHub (sélection interactive) |
| `npx openskills install owner/repo/skill-name` | Installer directement une compétence spécifique dans le dépôt |
| `npx openskills install ./local-skills/skill` | Installer depuis un chemin local |
| `npx openskills install ~/dev/my-skills` | Installer depuis le répertoire personnel |
| `npx openskills install git@github.com:owner/private-skills.git` | Installer depuis un dépôt Git privé |

---

## Aperçu du prochain cours

> Le prochain cours portera sur **[Installation globale vs Installation locale au projet](../global-vs-project/)**.
>
> Vous apprendrez :
> > - Le rôle de l'option `--global` et l'emplacement d'installation
> > - La différence entre l'installation globale et l'installation locale au projet
> > - Choisir l'emplacement d'installation approprié en fonction du scénario
> > - Meilleures pratiques pour partager des compétences entre plusieurs projets

La source d'installation n'est qu'une partie de la gestion des compétences, il est ensuite nécessaire de comprendre l'impact de l'emplacement d'installation des compétences sur le projet.

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour afficher les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Fonctionnalité | Chemin du fichier | Numéros de ligne |
|--- | --- | ---|
| Point d'entrée de la commande d'installation | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L83-L184) | 83-184 |
| Jugement du chemin local | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L25-L32) | 25-32 |
| Jugement de l'URL Git | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L37-L45) | 37-45 |
| Analyse GitHub shorthand | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L131-L143) | 131-143 |
| Installation depuis le chemin local | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L199-L226) | 199-226 |
| Clonage du dépôt Git | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L155-L169) | 155-169 |
| Message d'erreur pour dépôt privé | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L167) | 167 |

**Fonctions clés** :
- `isLocalPath(source)` - Détermine si c'est un chemin local (lignes 25-32)
- `isGitUrl(source)` - Détermine si c'est une URL Git (lignes 37-45)
- `installFromLocal()` - Installe des compétences depuis un chemin local (lignes 199-226)
- `installSpecificSkill()` - Installe une compétence avec un sous-chemin spécifié (lignes 272-316)
- `getRepoName()` - Extrait le nom du dépôt depuis une URL Git (lignes 50-56)

**Logique clé** :
1. Priorité de jugement du type de source : chemin local → URL Git → GitHub shorthand (lignes 111-143)
2. GitHub shorthand prend en charge deux formats : `owner/repo` et `owner/repo/skill-name` (lignes 132-142)
3. En cas d'échec du clonage d'un dépôt privé, invite à configurer les clés SSH ou les identifiants (ligne 167)

</details>

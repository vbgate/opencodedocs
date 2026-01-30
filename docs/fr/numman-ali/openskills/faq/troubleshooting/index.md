---
title: "Dépannage : Résoudre les problèmes courants d'OpenSkills | openskills"
sidebarTitle: "Que faire en cas d'erreur"
subtitle: "Dépannage : Résoudre les problèmes courants d'OpenSkills"
description: "Résolvez les erreurs courantes d'OpenSkills. Ce didacticiel couvre les échecs de Git clone, SKILL.md introuvable, compétences non trouvées, erreurs de permissions, mises à jour ignorées, etc., en fournissant des étapes détaillées de diagnostic et de réparation pour vous aider à résoudre rapidement divers problèmes."
tags:
  - FAQ
  - Dépannage
  - Résolution d'erreurs
prerequisite:
  - "start-quick-start"
  - "start-installation"
order: 2
---

# Dépannage : Résoudre les problèmes courants d'OpenSkills

## Ce que vous saurez faire

- Diagnostiquer et réparer rapidement les problèmes courants lors de l'utilisation d'OpenSkills
- Comprendre les causes sous-jacentes des messages d'erreur
- Maîtriser les techniques de diagnostic des problèmes liés au clonage Git, aux permissions, aux formats de fichiers, etc.
- Comprendre quand il est nécessaire de réinstaller les compétences

## Votre situation actuelle

Vous rencontrez une erreur lors de l'utilisation d'OpenSkills et ne savez pas quoi faire :

```
Error: No SKILL.md files found in repository
```

Ou un échec du git clone, une erreur de permissions, un format de fichier incorrect... Ces problèmes peuvent empêcher les compétences de fonctionner correctement.

## Quand consulter ce didacticiel

Quand vous rencontrez les situations suivantes :

- **Échec de l'installation** : Erreur lors de l'installation depuis GitHub ou un chemin local
- **Échec de la lecture** : `openskills read` indique que la compétence est introuvable
- **Échec de la synchronisation** : `openskills sync` indique aucune compétence ou erreur de format de fichier
- **Échec de la mise à jour** : `openskills update` ignore certaines compétences
- **Erreurs de permissions** : Accès restreint au chemin ou erreur de sécurité

## Approche principale

Les erreurs d'OpenSkills sont principalement classées en 4 catégories :

| Type d'erreur | Causes courantes | Approche de résolution |
|--- | --- | ---|
| **Liées à Git** | Problèmes de réseau, configuration SSH, dépôt inexistant | Vérifier le réseau, configurer les identifiants Git, vérifier l'adresse du dépôt |
| **Liées aux fichiers** | SKILL.md manquant, erreur de format, erreur de chemin | Vérifier l'existence du fichier, valider le format YAML |
| **Liées aux permissions** | Permissions de répertoire, traversée de chemin, liens symboliques | Vérifier les permissions du répertoire, valider le chemin d'installation |
| **Liées aux métadonnées** | Perte de métadonnées lors de la mise à jour, changement du chemin source | Réinstaller la compétence pour restaurer les métadonnées |

**Techniques de diagnostic** :
1. **Lire le message d'erreur** : La sortie en rouge contient généralement la cause spécifique
2. **Lire l'avertissement jaune** : Généralement des avertissements et des suggestions, comme `Tip: For private repos...`
3. **Vérifier la structure des répertoires** : Utiliser `openskills list` pour voir les compétences installées
4. **Voir l'emplacement du code source** : Le message d'erreur listera les chemins de recherche (4 répertoires)

---

## Échec de l'installation

### Problème 1 : Échec du Git clone

**Message d'erreur** :
```
Failed to clone repository
fatal: repository '...' not found
Tip: For private repos, ensure git SSH keys or credentials are configured
```

**Causes possibles** :

| Cause | Scénario |
|--- | ---|
| Dépôt inexistant | Erreur de frappe dans owner/repo |
| Dépôt privé | Clé SSH ou identifiants Git non configurés |
| Problème de réseau | Impossible d'accéder à GitHub |

**Résolution** :

1. **Vérifier l'adresse du dépôt** :
   ```bash
   # Visiter l'URL du dépôt dans un navigateur
   https://github.com/owner/repo
   ```

2. **Vérifier la configuration Git** (dépôts privés) :
   ```bash
   # Vérifier la configuration SSH
   ssh -T git@github.com

   # Configurer les identifiants Git
   git config --global credential.helper store
   ```

3. **Tester le clonage** :
   ```bash
   git clone https://github.com/owner/repo.git
   ```

**Ce que vous devriez voir** :
- Le dépôt cloné avec succès dans un répertoire local

---

### Problème 2 : SKILL.md introuvable

**Message d'erreur** :
```
Error: No SKILL.md files found in repository
Error: No valid SKILL.md files found
```

**Causes possibles** :

| Cause | Description |
|--- | ---|
| Pas de SKILL.md dans le dépôt | Le dépôt n'est pas un dépôt de compétences |
| SKILL.md sans frontmatter | Métadonnées YAML manquantes |
| SKILL.md avec erreur de format | Erreur de syntaxe YAML |

**Résolution** :

1. **Vérifier la structure du dépôt** :
   ```bash
   # Voir le répertoire racine du dépôt
   ls -la

   # Voir s'il y a un SKILL.md
   find . -name "SKILL.md"
   ```

2. **Vérifier le format de SKILL.md** :
   ```markdown
   ---
   name: Nom de la compétence
   description: Description de la compétence
   ---

   Contenu de la compétence...
   ```

   **Obligatoire** :
   - Frontmatter YAML séparé par `---` au début
   - Contient les champs `name` et `description`

3. **Voir l'exemple officiel** :
   ```bash
   git clone https://github.com/anthropics/skills.git
   cd skills
   ls -la
   ```

**Ce que vous devriez voir** :
- Le dépôt contient un ou plusieurs fichiers `SKILL.md`
- Chaque SKILL.md commence par un frontmatter YAML

---

### Problème 3 : Le chemin n'existe pas ou n'est pas un répertoire

**Message d'erreur** :
```
Error: Path does not exist: /path/to/skill
Error: Path must be a directory
```

**Causes possibles** :

| Cause | Description |
|--- | ---|
| Erreur de frappe du chemin | Chemin incorrect saisi |
| Le chemin pointe vers un fichier | Doit être un répertoire, pas un fichier |
| Chemin non développé | Utilisation de `~` nécessite un développement |

**Résolution** :

1. **Vérifier que le chemin existe** :
   ```bash
   # Vérifier le chemin
   ls -la /path/to/skill

   # Vérifier si c'est un répertoire
   file /path/to/skill
   ```

2. **Utiliser le chemin absolu** :
   ```bash
   # Obtenir le chemin absolu
   realpath /path/to/skill

   # Utiliser le chemin absolu lors de l'installation
   openskills install /absolute/path/to/skill
   ```

3. **Utiliser le chemin relatif** :
   ```bash
   # Dans le répertoire du projet
   openskills install ./skills/my-skill
   ```

**Ce que vous devriez voir** :
- Le chemin existe et est un répertoire
- Le répertoire contient un fichier `SKILL.md`

---

### Problème 4 : SKILL.md invalide

**Message d'erreur** :
```
Error: Invalid SKILL.md (missing YAML frontmatter)
```

**Causes possibles** :

| Cause | Description |
|--- | ---|
|--- | ---|
| Champs requis manquants | Doit avoir `name` et `description` |
| Erreur de syntaxe YAML | Problème de format avec les deux-points, guillemets, etc. |

**Résolution** :

1. **Vérifier le frontmatter YAML** :
   ```markdown
   ---              ← Délimiteur de début
   name: my-skill   ← Obligatoire
   description: Description de la compétence  ← Obligatoire
   ---              ← Délimiteur de fin
   ```

2. **Utiliser un outil de validation YAML en ligne** :
   - Visiter YAML Lint ou un outil similaire pour valider la syntaxe

3. **Référer à l'exemple officiel** :
   ```bash
   openskills install anthropics/skills
   cat .claude/skills/*/SKILL.md | head -20
   ```

**Ce que vous devriez voir** :
- SKILL.md commence par un frontmatter YAML correct
- Contient les champs `name` et `description`

---

### Problème 5 : Erreur de sécurité de traversée de chemin

**Message d'erreur** :
```
Security error: Installation path outside target directory
```

**Causes possibles** :

| Cause | Description |
|--- | ---|
| Nom de la compétence contient `..` | Tentative d'accès à un chemin en dehors du répertoire cible |
| Lien symbolique pointe vers l'extérieur | Symlink pointe en dehors du répertoire cible |
| Compétence malveillante | La compétence essaie de contourner les restrictions de sécurité |

**Résolution** :

1. **Vérifier le nom de la compétence** :
   - Assurez-vous que le nom de la compétence ne contient pas `..`, `/` ou d'autres caractères spéciaux

2. **Vérifier les liens symboliques** :
   ```bash
   # Voir les liens symboliques dans le répertoire des compétences
   find .claude/skills/skill-name -type l

   # Voir la cible du lien symbolique
   ls -la .claude/skills/skill-name
   ```

3. **Utiliser des compétences sécurisées** :
   - N'installez des compétences qu'à partir de sources de confiance
   - Vérifiez le code de la compétence avant l'installation

**Ce que vous devriez voir** :
- Le nom de la compétence ne contient que des lettres, des chiffres et des traits d'union
- Aucun lien symbolique pointant vers l'extérieur

---

## Échec de la lecture

### Problème 6 : Compétence introuvable

**Message d'erreur** :
```
Error: Skill(s) not found: my-skill

Searched:
  .agent/skills/ (project universal)
  ~/.agent/skills/ (global universal)
  .claude/skills/ (project)
  ~/.claude/skills/ (global)

Install skills: npx openskills install owner/repo
```

**Causes possibles** :

| Cause | Description |
|--- | ---|
| Compétence non installée | La compétence n'est installée dans aucun des répertoires |
| Erreur de frappe du nom de la compétence | Le nom ne correspond pas |
| Installée à un autre emplacement | Compétence installée dans un répertoire non standard |

**Résolution** :

1. **Voir les compétences installées** :
   ```bash
   openskills list
   ```

2. **Vérifier le nom de la compétence** :
   - Comparer avec la sortie de `openskills list`
   - Assurer une correspondance exacte (sensible à la casse)

3. **Installer les compétences manquantes** :
   ```bash
   openskills install owner/repo
   ```

4. **Rechercher dans tous les répertoires** :
   ```bash
   # Vérifier les 4 répertoires de compétences
   ls -la .agent/skills/
   ls -la ~/.agent/skills/
   ls -la .claude/skills/
   ls -la ~/.claude/skills/
   ```

**Ce que vous devriez voir** :
- `openskills list` affiche la compétence cible
- La compétence existe dans l'un des 4 répertoires

---

### Problème 7 : Aucun nom de compétence fourni

**Message d'erreur** :
```
Error: No skill names provided
```

**Causes possibles** :

| Cause | Description |
|--- | ---|
| Paramètre oublié | Pas de paramètre après `openskills read` |
| Chaîne vide | Chaîne vide transmise |

**Résolution** :

1. **Fournir le nom de la compétence** :
   ```bash
   # Une seule compétence
   openskills read my-skill

   # Plusieurs compétences (séparées par des virgules)
   openskills read skill1,skill2,skill3
   ```

2. **Voir d'abord les compétences disponibles** :
   ```bash
   openskills list
   ```

**Ce que vous devriez voir** :
- Lecture réussie du contenu de la compétence vers la sortie standard

---

## Échec de la synchronisation

### Problème 8 : Le fichier de sortie n'est pas un fichier Markdown

**Message d'erreur** :
```
Error: Output file must be a markdown file (.md)
```

**Causes possibles** :

| Cause | Description |
|--- | ---|
| Fichier de sortie n'est pas .md | Spécifié .txt, .json, etc. |
| Paramètre --output incorrect | Le chemin ne se termine pas par .md |

**Résolution** :

1. **Utiliser un fichier .md** :
   ```bash
   # Correct
   openskills sync -o AGENTS.md
   openskills sync -o custom.md

   # Incorrect
   openskills sync -o AGENTS.txt
   openskills sync -o AGENTS
   ```

2. **Chemin de sortie personnalisé** :
   ```bash
   # Sortir vers un sous-répertoire
   openskills sync -o .ruler/AGENTS.md
   openskills sync -o docs/agents.md
   ```

**Ce que vous devriez voir** :
- Fichier .md généré avec succès
- Le fichier contient les sections XML de compétences

---

### Problème 9 : Aucune compétence installée

**Message d'erreur** :
```
No skills installed. Install skills first:
  npx openskills install anthropics/skills --project
```

**Causes possibles** :

| Cause | Description |
|--- | ---|
| Jamais installé de compétences | Première utilisation d'OpenSkills |
| Répertoire de compétences supprimé | Fichiers de compétences supprimés manuellement |

**Résolution** :

1. **Installer des compétences** :
   ```bash
   # Installer les compétences officielles
   openskills install anthropics/skills

   # Installer depuis d'autres dépôts
   openskills install owner/repo
   ```

2. **Vérifier l'installation** :
   ```bash
   openskills list
   ```

**Ce que vous devriez voir** :
- `openskills list` affiche au moins une compétence
- Synchronisation réussie

---

## Échec de la mise à jour

### Problème 10 : Aucune métadonnée source

**Message d'erreur** :
```
Skipped: my-skill (no source metadata; re-install once to enable updates)
```

**Causes possibles** :

| Cause | Description |
|--- | ---|
| Installation d'une ancienne version | Compétence installée avant la fonctionnalité de métadonnées |
| Copie manuelle | Répertoire de compétences copié directement, non installé via OpenSkills |
| Fichier de métadonnées endommagé | `.openskills.json` endommagé ou manquant |

**Résolution** :

1. **Réinstaller la compétence** :
   ```bash
   # Supprimer l'ancienne compétence
   openskills remove my-skill

   # Réinstaller
   openskills install owner/repo
   ```

2. **Vérifier le fichier de métadonnées** :
   ```bash
   # Voir les métadonnées de la compétence
   cat .claude/skills/my-skill/.openskills.json
   ```

3. **Garder la compétence mais ajouter les métadonnées** :
   - Créer manuellement `.openskills.json` (non recommandé)
   - La réinstallation est plus simple et fiable

**Ce que vous devriez voir** :
- Mise à jour réussie, sans avertissement d'ignorance

---

### Problème 11 : Source locale manquante

**Message d'erreur** :
```
Skipped: my-skill (local source missing)
```

**Causes possibles** :

| Cause | Description |
|--- | ---|
| Chemin local déplacé | L'emplacement du répertoire source a changé |
| Chemin local supprimé | Le répertoire source n'existe plus |
| Chemin non développé | Utilisation de `~` mais le chemin développé est stocké dans les métadonnées |

**Résolution** :

1. **Vérifier le chemin local dans les métadonnées** :
   ```bash
   cat .claude/skills/my-skill/.openskills.json
   ```

2. **Restaurer le répertoire source ou mettre à jour les métadonnées** :
   ```bash
   # Si le répertoire source a été déplacé
   openskills remove my-skill
   openskills install /new/path/to/skill

   # Ou modifier manuellement les métadonnées (non recommandé)
   vi .claude/skills/my-skill/.openskills.json
   ```

**Ce que vous devriez voir** :
- Le chemin source local existe et contient `SKILL.md`

---

### Problème 12 : SKILL.md introuvable dans le dépôt

**Message d'erreur** :
```
SKILL.md missing for my-skill
Skipped: my-skill (SKILL.md not found in repo at subpath)
```

**Causes possibles** :

| Cause | Description |
|--- | ---|
| Changement de structure du dépôt | Le sous-chemin ou le nom de la compétence a changé |
| Compétence supprimée | Le dépôt ne contient plus cette compétence |
| Sous-chemin incorrect | Le sous-chemin enregistré dans les métadonnées est incorrect |

**Résolution** :

1. **Visiter le dépôt pour voir la structure** :
   ```bash
   # Cloner le dépôt pour voir
   git clone https://github.com/owner/repo.git
   cd repo
   ls -la
   find . -name "SKILL.md"
   ```

2. **Réinstaller la compétence** :
   ```bash
   openskills remove my-skill
   openskills install owner/repo/subpath
   ```

3. **Vérifier l'historique des mises à jour du dépôt** :
   - Voir l'historique des commits sur GitHub
   - Rechercher les enregistrements de déplacement ou de suppression de compétences

**Ce que vous devriez voir** :
- Mise à jour réussie
- SKILL.md existe dans le sous-chemin enregistré

---

## Problèmes de permissions

### Problème 13 : Permissions de répertoire restreintes

**Symptômes** :

| Opération | Symptôme |
|--- | ---|
| Échec de l'installation | Erreur de permissions indiquée |
| Échec de la suppression | Impossible de supprimer les fichiers |
| Échec de la lecture | Accès aux fichiers restreint |

**Causes possibles** :

| Cause | Description |
|--- | ---|
| Permissions de répertoire insuffisantes | L'utilisateur n'a pas de permissions d'écriture |
| Permissions de fichiers insuffisantes | Fichiers en lecture seule |
| Protection du système | macOS SIP, restrictions Windows UAC |

**Résolution** :

1. **Vérifier les permissions du répertoire** :
   ```bash
   # Voir les permissions
   ls -la .claude/skills/

   # Modifier les permissions (utiliser avec prudence)
   chmod -R 755 .claude/skills/
   ```

2. **Utiliser sudo (non recommandé)** :
   ```bash
   # Dernier recours
   sudo openskills install owner/repo
   ```

3. **Vérifier la protection du système** :
   ```bash
   # macOS : Vérifier l'état SIP
   csrutil status

   # Pour désactiver SIP (nécessite le mode de récupération)
   # Non recommandé, utiliser uniquement en cas de nécessité
   ```

**Ce que vous devriez voir** :
- Lecture et écriture normales des répertoires et fichiers

---

## Problèmes de liens symboliques

### Problème 14 : Lien symbolique endommagé

**Symptômes** :

| Symptôme | Description |
|--- | ---|
| Compétence ignorée lors du listage | `openskills list` n'affiche pas cette compétence |
| Échec de la lecture | Fichier introuvable indiqué |
| Échec de la mise à jour | Chemin source invalide |

**Causes possibles** :

| Cause | Description |
|--- | ---|
| Répertoire cible supprimé | Le lien symbolique pointe vers un chemin inexistant |
| Lien symbolique endommagé | Le fichier de lien lui-même est endommagé |
| Lien inter-périphérique | Certains systèmes ne prennent pas en charge les liens symboliques entre périphériques |

**Résolution** :

1. **Vérifier les liens symboliques** :
   ```bash
   # Trouver tous les liens symboliques
   find .claude/skills -type l

   # Voir la cible du lien
   ls -la .claude/skills/my-skill

   # Tester le lien
   readlink .claude/skills/my-skill
   ```

2. **Supprimer le lien symbolique endommagé** :
   ```bash
   openskills remove my-skill
   ```

3. **Réinstaller** :
   ```bash
   openskills install owner/repo
   ```

**Ce que vous devriez voir** :
- Aucun lien symbolique endommagé
- La compétence s'affiche et se lit normalement

---

## Attention aux pièges courants

::: warning Erreurs courantes

**❌ Ne faites pas ceci** :

- **Copier directement le répertoire de compétences** → Provoque une perte de métadonnées, échec des mises à jour
- **Modifier manuellement `.openskills.json`** → Risque de casser le format, échec des mises à jour
- **Utiliser sudo pour installer les compétences** → Crée des fichiers appartenant à root, les opérations ultérieures peuvent nécessiter sudo
- **Supprimer `.openskills.json`** → Provoque l'ignorance de la compétence lors des mises à jour

**✅ Faites plutôt ceci** :

- Installer via `openskills install` → Crée automatiquement les métadonnées
- Supprimer via `openskills remove` → Nettoie correctement les fichiers
- Mettre à jour via `openskills update` → Actualise automatiquement depuis la source
- Vérifier via `openskills list` → Confirme l'état des compétences

:::

::: tip Techniques de diagnostic

1. **Commencer simplement** : Exécutez d'abord `openskills list` pour confirmer l'état
2. **Lire le message d'erreur complet** : L'avertissement jaune contient généralement des suggestions de résolution
3. **Vérifier la structure des répertoires** : Utilisez `ls -la` pour voir les fichiers et les permissions
4. **Vérifier l'emplacement du code source** : Le message d'erreur listera les 4 répertoires de recherche
5. **Utiliser -y pour sauter l'interaction** : Utilisez le drapeau `-y` dans les pipelines CI/CD ou les scripts

:::

---

## Résumé du cours

Ce cours a couvert les méthodes de diagnostic et de réparation des problèmes courants d'OpenSkills :

| Type de problème | Méthode clé de résolution |
|--- | ---|
| Échec du Git clone | Vérifier le réseau, configurer les identifiants, vérifier l'adresse du dépôt |
| SKILL.md introuvable | Vérifier la structure du dépôt, valider le format YAML |
| Échec de la lecture | Utiliser `openskills list` pour vérifier l'état des compétences |
| Échec de la mise à jour | Réinstaller la compétence pour restaurer les métadonnées |
| Problèmes de permissions | Vérifier les permissions du répertoire, éviter d'utiliser sudo |

**À retenir** :
- Les messages d'erreur contiennent généralement des indications claires
- La réinstallation est le moyen le plus simple de résoudre les problèmes de métadonnées
- N'installez des compétences qu'à partir de sources de confiance

## Étapes suivantes

- **Voir [FAQ](../faq/)** → Réponses à d'autres questions
- **Apprendre [Meilleures pratiques](../../advanced/best-practices/)** → Éviter les erreurs courantes
- **Explorer [Notes de sécurité](../../advanced/security/)** → Comprendre les mécanismes de sécurité

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquer pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Fonction | Chemin du fichier | Ligne |
|--- | --- | ---|
| Gestion de l'échec du Git clone | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L162-L168) | 162-168 |
| Erreur de chemin inexistant | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L205-L207) | 205-207 |
| Erreur de pas un répertoire | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L210-L213) | 210-213 |
| SKILL.md invalide | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L241-L243) | 241-243 |
| Erreur de sécurité de traversée de chemin | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L256-L259) | 256-259 |
| SKILL.md introuvable | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L378-L380) | 378-380 |
| Aucun nom de compétence fourni | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts#L10-L12) | 10-12 |
| Compétence introuvable | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts#L26-L34) | 26-34 |
| Fichier de sortie non Markdown | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L23-L25) | 23-25 |
| Aucune compétence installée | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L40-L43) | 40-43 |
| Ignorance sans métadonnées source | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L57-L61) | 57-61 |
| Source locale manquante | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L66-L71) | 66-71 |
| SKILL.md introuvable dans le dépôt | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L102-L107) | 102-107 |

**Fonctions clés** :
- `hasValidFrontmatter(content)`: Vérifie si SKILL.md a un frontmatter YAML valide
- `isPathInside(targetPath, targetDir)`: Vérifie si un chemin est dans le répertoire cible (contrôle de sécurité)
- `findSkill(name)`: Recherche une compétence dans les 4 répertoires par priorité
- `readSkillMetadata(path)`: Lit les métadonnées de la source d'installation de la compétence

**Constantes clés** :
- Ordre des répertoires de recherche (`src/utils/skills.ts`) :
  1. `.agent/skills/` (projet universel)
  2. `~/.agent/skills/` (global universel)
  3. `.claude/skills/` (projet)
  4. `~/.claude/skills/` (global)

</details>

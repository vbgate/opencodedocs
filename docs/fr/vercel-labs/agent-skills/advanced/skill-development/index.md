---
title: "Développement de Skills Personnalisés Agent Skills : Créer un Assistant IA Claude Exclusif | Tutoriel Agent Skills"
sidebarTitle: "Créer une skill pour étendre Claude"
subtitle: "Développer des skills personnalisées"
description: "Apprenez à développer des skills personnalisées pour Claude, y compris la structure de répertoire, le format SKILL.md détaillé, les spécifications de script et le processus d'empaquetage et de publication Zip. Ce tutoriel vous apprend à créer des outils d'assistance IA extensibles, à déclencher des skills avec précision, à optimiser l'efficacité du contexte, à étendre les capacités de code de Claude, à encapsuler les opérations répétitives et à réaliser des flux de travail standardisés en équipe."
tags:
  - "Développement de skills"
  - "Claude"
  - "Programmation assistée par IA"
  - "Extension personnalisée"
order: 60
prerequisite:
  - "start-getting-started"
  - "start-installation"
---

# Développer des Skills Personnalisées

## Ce que vous pourrez faire après ce cours

Après avoir terminé cette leçon, vous serez capable de :

- ✅ Créer une structure de répertoire de skill conforme aux spécifications
- ✅ Écrire un fichier de définition `SKILL.md` complet (comprenant Front Matter, How It Works, Usage, etc.)
- ✅ Écrire des scripts Bash conformes aux spécifications (gestion d'erreurs, format de sortie, mécanismes de nettoyage)
- ✅ Empaqueter des skills dans des fichiers Zip et les publier
- ✅ Optimiser l'efficacité du contexte pour que Claude active les skills avec plus de précision

## Votre situation actuelle

Vous avez peut-être rencontré ces scénarios :

- ✗ Répéter fréquemment une opération complexe (comme le déploiement sur une plateforme spécifique, l'analyse de formats de logs), expliquant à chaque fois à Claude
- ✗ Claude ne sait pas quand activer une certaine fonction, vous obligeant à saisir à plusieurs reprises les mêmes instructions
- ✗ Vouloir encapsuler les meilleures pratiques de l'équipe dans des outils réutilisables, mais ne pas savoir par où commencer
- ✗ Les fichiers de skill écrits sont souvent ignorés par Claude, sans savoir quel est le problème

## Quand utiliser cette méthode

Lorsque vous avez besoin de :

- 📦 **Encapsuler les opérations répétitives** : Empaqueter les séquences de commandes fréquemment utilisées en exécution en un clic
- 🎯 **Déclenchement précis** : Permettre à Claude d'activer activement les skills dans des scénarios spécifiques
- 🏢 **Standardiser les flux de travail** : Automatiser les normes d'équipe (comme la vérification de code, les processus de déploiement)
- 🚀 **Étendre les capacités** : Ajouter à Claude des fonctionnalités qu'il ne supporte pas nativement

## 🎒 Préparatifs avant de commencer

Avant de commencer, veuillez confirmer :

::: warning Vérification préalable

- Avoir terminé [Démarrage avec Agent Skills](../../start/getting-started/)
- Avoir installé Agent Skills et être familier avec l'utilisation de base
- Comprendre les opérations de ligne de commande de base (scripts Bash)
- Avoir un dépôt GitHub (pour publier les skills)

:::

## Idée centrale

**Comment fonctionne Agent Skills** :

Au démarrage, Claude charge uniquement le **nom et la description** des skills, ne lisant le contenu complet du fichier `SKILL.md` que lorsqu'il détecte des mots-clés pertinents. Ce **mécanisme de chargement à la demande** minimise la consommation de tokens.

**Trois éléments essentiels du développement de skills** :

1. **Structure de répertoire** : Une organisation de dossiers conforme aux conventions de nommage
2. **SKILL.md** : Le fichier de définition de skill, indiquant à Claude quand l'activer et comment l'utiliser
3. **Scripts** : Le code Bash réellement exécuté, responsable des opérations spécifiques

<!-- ![Flux d'activation des skills](/images/advanced/skill-activation-flow.svg) -->
> [Image : Flux d'activation des skills]

---

## Suivez-moi : Créer votre première skill

### Étape 1 : Créer la structure de répertoire

**Pourquoi**
Une structure de répertoire correcte est la condition préalable pour que Claude puisse reconnaître la skill.

Dans le répertoire `skills/`, créez une nouvelle skill :

```bash
cd skills
mkdir my-custom-skill
cd my-custom-skill
mkdir scripts
```

**La structure de répertoire devrait être** :

```
skills/
  my-custom-skill/
    SKILL.md           # Fichier de définition de skill (obligatoire)
    scripts/
      deploy.sh        # Script exécutable (obligatoire)
```

**Note** : Une fois le développement terminé, vous devez empaqueter l'intégralité du répertoire de skill en `my-custom-skill.zip` pour la publication (voir la section "Empaqueter les skills" ci-dessous)

**Vous devriez voir** :
- `my-custom-skill/` utilise le nommage kebab-case (lettres minuscules et traits d'union)
- Le nom de fichier `SKILL.md` est entièrement en majuscules, doit correspondre exactement
- Le répertoire `scripts/` stocke les scripts exécutables

### Étape 2 : Écrire le SKILL.md

**Pourquoi**
Le `SKILL.md` est le cœur de la skill, définissant les conditions de déclenchement, le mode d'utilisation et le format de sortie.

Créez le fichier `SKILL.md` :

```markdown
---
name: my-custom-skill
description: Déployer mon application sur une plateforme personnalisée. À utiliser lorsque l'utilisateur dit "déployer", "production" ou "déploiement personnalisé".
---

# Skill de Déploiement Personnalisé

Déployez votre application sur une plateforme personnalisée avec une configuration zéro.

## Comment ça marche

1. Détecte le framework depuis `package.json` (Next.js, Vue, Svelte, etc.)
2. Crée une archive tar du projet (en excluant `node_modules` et `.git`)
3. Téléverse vers l'API de déploiement
4. Retourne l'URL de prévisualisation et l'ID de déploiement

## Utilisation

```bash
bash /mnt/skills/user/my-custom-skill/scripts/deploy.sh [chemin]
```

**Arguments :**
- `chemin` - Chemin du répertoire ou fichier .tgz à déployer (par défaut : répertoire courant)

**Exemples :**

Déployer le répertoire courant :
```bash
bash /mnt/skills/user/my-custom-skill/scripts/deploy.sh .
```

Déployer un répertoire spécifique :
```bash
bash /mnt/skills/user/my-custom-skill/scripts/deploy.sh ./my-app
```

## Sortie

Vous verrez :

```
✓ Déployé sur https://my-app-abc123.custom-platform.io
✓ ID de déploiement : deploy_12345
✓ URL de réclamation : https://custom-platform.io/claim?code=...
```

Format JSON (pour une sortie lisible par machine) :
```json
{
  "previewUrl": "https://my-app-abc123.custom-platform.io",
  "deploymentId": "deploy_12345",
  "claimUrl": "https://custom-platform.io/claim?code=..."
}
```

## Présenter les Résultats à l'Utilisateur

Lors de la présentation des résultats à l'utilisateur, utilisez ce format :

```
🎉 Déploiement réussi !

**URL de prévisualisation** : https://my-app-abc123.custom-platform.io

Pour transférer la propriété :
1. Visitez l'URL de réclamation
2. Connectez-vous à votre compte
3. Confirmez le transfert

**ID de déploiement** : deploy_12345
```

## Dépannage

**Erreur Réseau**
- Vérifiez votre connexion internet
- Vérifiez que l'API de déploiement est accessible

**Erreur de Permission**
- Assurez-vous que le répertoire est lisible
- Vérifiez les permissions de fichier sur le script

**Framework Non Détecté**
- Assurez-vous que `package.json` existe à la racine du projet
- Vérifiez que le framework est supporté
```

**Vous devriez voir** :
- Le Front Matter contient les champs `name` et `description`
- Le `description` contient les mots-clés de déclenchement (comme "déployer", "production")
- Contient les sections `How It Works`, `Usage`, `Output`, `Present Results to User`, `Troubleshooting`

### Étape 3 : Écrire le script Bash

**Pourquoi**
Le script est la partie qui exécute réellement les opérations et doit être conforme aux spécifications d'entrée/sortie de Claude.

Créez `scripts/deploy.sh` :

```bash
#!/bin/bash
set -e  # Quitter immédiatement en cas d'erreur

# Configuration
DEPLOY_API="${DEPLOY_API:-https://deploy.example.com/api}"

# Analyse des arguments
INPUT_PATH="${1:-.}"

# Fonction de nettoyage
cleanup() {
  if [ -n "$TEMP_TARBALL" ] && [ -f "$TEMP_TARBALL" ]; then
    rm -f "$TEMP_TARBALL" >&2 || true
  fi
}
trap cleanup EXIT

# Détection du framework
detect_framework() {
  local path="$1"
  local framework=""

  if [ -f "${path}/package.json" ]; then
    if grep -q '"next"' "${path}/package.json"; then
      framework="nextjs"
    elif grep -q '"vue"' "${path}/package.json"; then
      framework="vue"
    elif grep -q '"@sveltejs/kit"' "${path}/package.json"; then
      framework="sveltekit"
    fi
  fi

  echo "$framework"
}

# Flux principal
FRAMEWORK=$(detect_framework "$INPUT_PATH")
echo "Framework détecté : ${FRAMEWORK:-inconnu}" >&2

# Création de l'archive
TEMP_TARBALL=$(mktemp -t deploy-XXXXXX.tgz)
echo "Création de l'archive..." >&2
tar -czf "$TEMP_TARBALL" \
  --exclude='node_modules' \
  --exclude='.git' \
  -C "$INPUT_PATH" . >&2 || true

# Téléversement
echo "Téléversement..." >&2
RESULT=$(curl -s -X POST "$DEPLOY_API" \
  -F "file=@$TEMP_TARBALL" \
  -F "framework=$FRAMEWORK")

# Vérification des erreurs
if echo "$RESULT" | grep -q '"error"'; then
  ERROR_MSG=$(echo "$RESULT" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)
  echo "Échec du déploiement : $ERROR_MSG" >&2
  exit 1
fi

# Sortie des résultats
echo "$RESULT"
echo "Déploiement terminé avec succès" >&2
```

**Vous devriez voir** :
- Le script utilise le shebang `#!/bin/bash`
- Utilise `set -e` pour la gestion des erreurs
- Les messages de statut sont envoyés vers stderr (`>&2`)
- Les sorties lisibles par machine (JSON) sont envoyées vers stdout
- Comprend un trap de nettoyage

### Étape 4 : Définir les permissions d'exécution

```bash
chmod +x scripts/deploy.sh
```

**Vous devriez voir** :
- Le script devient exécutable (`ls -l scripts/deploy.sh` affiche `-rwxr-xr-x`)

### Étape 5 : Tester la skill

Testez la skill dans Claude Code :

```bash
# Activer la skill
"Activate my-custom-skill"

# Déclencher le déploiement
"Deploy my current directory using my-custom-skill"
```

**Vous devriez voir** :
- Claude active la skill
- Exécute le script `deploy.sh`
- Affiche le résultat du déploiement (contenant previewUrl et deploymentId)

---

## Point de contrôle ✅

Vérifiez maintenant si votre skill respecte les spécifications :

- [ ] Le nom du répertoire utilise le kebab-case (par exemple `my-custom-skill`)
- [ ] Le nom de fichier `SKILL.md` est entièrement en majuscules, exact
- [ ] Le Front Matter contient les champs `name` et `description`
- [ ] Le `description` contient les mots-clés de déclenchement
- [ ] Le script utilise le shebang `#!/bin/bash`
- [ ] Le script utilise `set -e` pour la gestion des erreurs
- [ ] Les messages de statut sont envoyés vers stderr (`>&2`)
- [ ] Le JSON est envoyé vers stdout
- [ ] Le script comprend un trap de nettoyage

---

## Pièges à éviter

### Piège 1 : La skill n'est pas activée

**Symptôme** : Vous dites "Deploy my app", mais Claude n'active pas la skill.

**Cause** : Le `description` ne contient pas les mots-clés de déclenchement.

**Solution** :
```markdown
# ❌ Incorrect
description: A tool for deploying applications

# ✅ Correct
description: Deploy my app to production. Use when user says "deploy", "production", or "push to live".
```

### Piège 2 : Sortie du script confondue

**Symptôme** : Claude ne peut pas analyser la sortie JSON.

**Cause** : Les messages de statut et la sortie JSON sont mélangés.

**Solution** :
```bash
# ❌ Incorrect : tous envoyés vers stdout
echo "Creating tarball..."
echo '{"previewUrl": "..."}'

# ✅ Correct : messages de statut vers stderr
echo "Creating tarball..." >&2
echo '{"previewUrl": "..."}'
```

### Piège 3 : Fichiers temporaires non nettoyés

**Symptôme** : L'espace disque est progressivement rempli.

**Cause** : Les fichiers temporaires ne sont pas nettoyés à la sortie du script.

**Solution** :
```bash
# ✅ Correct : utiliser le trap de nettoyage
cleanup() {
  rm -f "$TEMP_TARBALL" >&2 || true
}
trap cleanup EXIT
```

### Piège 4 : SKILL.md trop long

**Symptôme** : La skill occupe trop de contexte, affectant les performances.

**Cause** : Le `SKILL.md` dépasse 500 lignes.

**Solution** :
- Placer la documentation de référence détaillée dans un fichier séparé
- Utiliser la divulgation progressive (Progressive Disclosure)
- Prioriser l'utilisation de scripts plutôt que du code intégré

---

## Résumé de cette leçon

**Points clés** :

1. **Structure de répertoire** : Utiliser le kebab-case, inclure `SKILL.md` et le répertoire `scripts/`
2. **Format SKILL.md** : Front Matter + How It Works + Usage + Output + Present Results to User + Troubleshooting
3. **Spécifications du script** : `#!/bin/bash`, `set -e`, messages de statut vers stderr, sortie JSON vers stdout, trap de nettoyage
4. **Efficacité du contexte** : Garder `SKILL.md` < 500 lignes, utiliser la divulgation progressive, privilégier les scripts
5. **Empaquetage et publication** : Utiliser la commande `zip -r` pour empaqueter en `{nom-skill}.zip`

**Mantra des meilleures pratiques** :

> La description doit être spécifique, le déclenchement doit être clair
> Les statuts vers stderr, le JSON vers stdout
> N'oubliez pas le trap, nettoyez les fichiers temporaires
> Gardez les fichiers courts, laissez les scripts prendre de la place

---

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[Rédaction de Règles des Meilleures Pratiques React](../rule-authoring/)**.
>
> Vous apprendrez :
> - Comment rédiger des fichiers de règles conformes aux spécifications
> - Utiliser le modèle `_template.md` pour générer des règles
> - Définir les niveaux d'impact et les tags
> - Rédiger des comparaisons de code Incorrect/Correct
> - Ajouter des références et des règles de validation

---

## Annexe : Référence du Code Source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-25

| Fonctionnalité | Chemin du fichier | Lignes |
|---|---|---|
| Spécifications de développement de skills | [`AGENTS.md:9-69`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L9-L69) | 9-69 |
| Définition de la structure de répertoire | [`AGENTS.md:11-20`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L11-L20) | 11-20 |
| Conventions de nommage | [`AGENTS.md:22-27`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L22-L27) | 22-27 |
| Format SKILL.md | [`AGENTS.md:29-68`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L29-L68) | 29-68 |
| Meilleures pratiques d'efficacité de contexte | [`AGENTS.md:70-78`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L70-L78) | 70-78 |
| Exigences des scripts | [`AGENTS.md:80-87`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L80-L87) | 80-87 |
| Empaquetage Zip | [`AGENTS.md:89-96`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L89-L96) | 89-96 |
| Méthode d'installation utilisateur | [`AGENTS.md:98-110`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L98-L110) | 98-110 |

**Constantes clés** :
- Nom de fichier `SKILL.md` : doit être entièrement en majuscules, correspondance exacte
- `/mnt/skills/user/{nom-skill}/scripts/{script}.sh` : format de chemin de script

**Fonctions clés** :
- Fonction de nettoyage de script `cleanup()` : utilisée pour supprimer les fichiers temporaires
- Fonction de détection de framework `detect_framework()` : déduit le type de framework depuis package.json

</details>

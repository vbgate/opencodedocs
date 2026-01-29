---
title: "Démarrage rapide : consulter les quotas IA | opencode-mystatus"
sidebarTitle: "Démarrage rapide"
subtitle: "Démarrage rapide : consultation des quotas de toutes les plateformes IA en un clic"
description: "Apprenez à installer opencode-mystatus en 5 minutes. Trois méthodes d'installation, support OpenAI, Zhipu AI, Z.ai, GitHub Copilot et Google Cloud."
tags:
  - "Démarrage rapide"
  - "Installation"
  - "Configuration"
order: 1
---

# Démarrage rapide : consultation des quotas de toutes les plateformes IA en un clic

## Ce que vous saurez faire à la fin

- Installer le plugin opencode-mystatus en 5 minutes
- Configurer la commande slash `/mystatus`
- Vérifier l'installation réussie et consulter le quota de votre première plateforme IA

## Votre situation actuelle

Vous utilisez plusieurs plateformes IA pour le développement (OpenAI, Zhipu AI, GitHub Copilot, Google Cloud, etc.) et devez vérifier fréquemment les quotas restants de chaque plateforme. Vous devez vous connecter à chaque plateforme individuellement, ce qui est une perte de temps considérable.

## Quand utiliser cette méthode

- **Lorsque vous débutez avec OpenCode** : Premier plugin à installer en tant que débutant
- **Lorsque vous avez besoin de gérer des quotas multi-plateformes** : Utilisation simultanée d'OpenAI, Zhipu AI, GitHub Copilot, etc.
- **Scénario de collaboration en équipe** : L'équipe partage plusieurs comptes IA et doit consulter les quotas de manière unifiée

## 🎒 Avant de commencer

Avant de commencer, assurez-vous d'avoir :

::: info Conditions préalables

- [ ] Installé [OpenCode](https://opencode.ai)
- [ ] Configuré les informations d'authentification d'au moins une plateforme IA (OpenAI, Zhipu AI, Z.ai, GitHub Copilot ou Google Cloud)

:::

Si vous n'avez pas encore configuré de plateforme IA, nous vous recommandons de compléter d'abord l'authentification d'au moins une plateforme dans OpenCode avant d'installer ce plugin.

## Approche principale

opencode-mystatus est un plugin OpenCode, sa valeur principale est :

1. **Lecture automatique des fichiers d'authentification** : lit toutes les informations de compte configurées depuis le stockage officiel d'authentification d'OpenCode
2. **Requête parallèle de toutes les plateformes** : appelle simultanément les API officielles d'OpenAI, Zhipu AI, Z.ai, GitHub Copilot et Google Cloud
3. **Affichage visuel** : affiche les quotas restants avec des barres de progression et des compteurs à rebours

Le processus d'installation est simple :
1. Ajoutez le plugin et la commande slash dans le fichier de configuration d'OpenCode
2. Redémarrez OpenCode
3. Entrez `/mystatus` pour consulter les quotas

## Suivez les étapes

### Étape 1 : Choisissez la méthode d'installation

opencode-mystatus propose trois méthodes d'installation, choisissez celle qui vous convient :

::: code-group

```bash [Laissez l'IA vous installer (recommandé)]
Collez le contenu suivant dans n'importe quel agent IA (Claude Code, OpenCode, Cursor, etc.) :

Install opencode-mystatus plugin by following: https://raw.githubusercontent.com/vbgate/opencode-mystatus/main/README.md
```

```bash [Installation manuelle]
Ouvrez ~/.config/opencode/opencode.json et éditez la configuration selon l'étape 2
```

```bash [Installation depuis un fichier local]
Copiez les fichiers du plugin dans le répertoire ~/.config/opencode/plugin/ (voir étape 4 pour les détails)
```

:::

**Pourquoi recommander l'installation par IA** : L'agent IA exécutera automatiquement toutes les étapes de configuration, vous n'avez qu'à confirmer, c'est le moyen le plus rapide et le plus simple.

---

### Étape 2 : Configuration manuelle (obligatoire pour l'installation manuelle)

Si vous choisissez l'installation manuelle, vous devez modifier le fichier de configuration d'OpenCode.

#### 2.1 Ouvrir le fichier de configuration

```bash
# macOS/Linux
code ~/.config/opencode/opencode.json

# Windows
code %APPDATA%\opencode\opencode.json
```

#### 2.2 Ajouter le plugin et la commande slash

Ajoutez le contenu suivant au fichier de configuration (conservez les configurations existantes `plugin` et `command`, ajoutez simplement les nouveaux éléments) :

```json
{
  "plugin": ["opencode-mystatus"],
  "command": {
    "mystatus": {
      "description": "Query quota usage for all AI accounts",
      "template": "Use the mystatus tool to query quota usage. Return the result as-is without modification."
    }
  }
}
```

**Pourquoi cette configuration** :

| Élément de configuration | Valeur | Rôle |
|--- | --- | ---|
| Tableau `plugin` | `["opencode-mystatus"]` | Indique à OpenCode de charger ce plugin |
| `description` | "Query quota usage for all AI accounts" | Description affichée dans la liste des commandes slash |
| `template` | "Use the mystatus tool..." | Indique à OpenCode comment appeler l'outil mystatus |

**Ce que vous devriez voir** : Le fichier de configuration contient les champs complets `plugin` et `command`, avec un format correct (attention aux virgules et guillemets JSON).

---

### Étape 3 : Installation depuis un fichier local (obligatoire pour l'installation locale)

Si vous choisissez l'installation depuis un fichier local, vous devez copier manuellement les fichiers du plugin.

#### 3.1 Copier les fichiers du plugin

```bash
# Supposons que vous ayez cloné le code source d'opencode-mystatus dans ~/opencode-mystatus/

# Copier le plugin principal et les fichiers de bibliothèque
cp -r ~/opencode-mystatus/plugin/mystatus.ts ~/.config/opencode/plugin/
cp -r ~/opencode-mystatus/plugin/lib/ ~/.config/opencode/plugin/

# Copier la configuration de la commande slash
cp ~/opencode-mystatus/command/mystatus.md ~/.config/opencode/command/
```

**Pourquoi copier ces fichiers** :

- `mystatus.ts` : Fichier d'entrée principal du plugin, contient la définition de l'outil mystatus
- Répertoire `lib/` : Contient la logique de requête pour OpenAI, Zhipu AI, Z.ai, GitHub Copilot et Google Cloud
- `mystatus.md` : Description de la configuration de la commande slash

**Ce que vous devriez voir** : Le répertoire `~/.config/opencode/plugin/` contient `mystatus.ts` et le sous-répertoire `lib/`, le répertoire `~/.config/opencode/command/` contient `mystatus.md`.

---

### Étape 4 : Redémarrer OpenCode

Quelle que soit la méthode d'installation choisie, la dernière étape consiste à redémarrer OpenCode.

**Pourquoi le redémarrage est nécessaire** : OpenCode ne lit le fichier de configuration qu'au démarrage, vous devez redémarrer pour que les modifications prennent effet.

**Ce que vous devriez voir** : Après le redémarrage d'OpenCode, tout fonctionne normalement.

---

### Étape 5 : Vérifier l'installation

Maintenant, vérifiez que l'installation a réussi.

#### 5.1 Tester la commande slash

Dans OpenCode, entrez :

```bash
/mystatus
```

**Ce que vous devriez voir** :

Si vous avez configuré au moins une plateforme IA, vous devriez voir une sortie similaire (exemple avec OpenAI) :

::: code-group

```markdown [Sortie système chinois]
## OpenAI 账号额度

Account:        user@example.com (team)

3小时限额
█████████████████████████ 剩余 85%
重置: 2h 30m后
```

```markdown [Sortie système anglais]
## OpenAI Account Quota

Account:        user@example.com (team)

3-hour limit
█████████████████████████ 85% remaining
Resets in: 2h 30m
```

:::

::: tip Note sur la langue de sortie
Le plugin détecte automatiquement votre langue système (système chinois = sortie chinoise, système anglais = sortie anglaise), les deux sorties ci-dessus sont correctes.
:::

Si vous n'avez pas encore configuré de compte, vous verrez :

::: code-group

```markdown [Sortie système chinois]
未找到任何已配置的账号。

支持的账号类型:
- OpenAI (Plus/Team/Pro 订阅用户)
- 智谱 AI (Coding Plan)
- Z.ai (Coding Plan)
- Google Cloud (Antigravity)
```

```markdown [Sortie système anglais]
No configured accounts found.

Supported account types:
- OpenAI (Plus/Team/Pro subscribers)
- Zhipu AI (Coding Plan)
- Z.ai (Coding Plan)
- Google Cloud (Antigravity)
```

:::

#### 5.2 Comprendre la signification de la sortie

| Élément (version chinoise) | Élément (version anglaise) | Signification |
|--- | --- | ---|
| `## OpenAI 账号额度` | `## OpenAI Account Quota` | Titre de la plateforme |
| `user@example.com (team)` | `user@example.com (team)` | Informations du compte (email ou équipe) |
| `3小时限额` | `3-hour limit` | Type de limite (limite de 3 heures) |
| `剩余 85%` | `85% remaining` | Pourcentage restant |
| `重置: 2h 30m后` | `Resets in: 2h 30m` | Compte à rebours jusqu'à la réinitialisation |

**Pourquoi la clé API n'est-elle pas affichée entièrement** : Pour protéger votre confidentialité, le plugin masque automatiquement l'affichage (par exemple `9c89****AQVM`).

## Point de contrôle ✅

Confirmez que vous avez terminé les étapes suivantes :

| Étape | Méthode de vérification | Résultat attendu |
|--- | --- | ---|
| Installer le plugin | Vérifier `~/.config/opencode/opencode.json` | Le tableau `plugin` contient `"opencode-mystatus"` |
| Configurer la commande slash | Vérifier le même fichier | L'objet `command` contient la configuration `mystatus` |
| Redémarrer OpenCode | Vérifier le processus OpenCode | Redémarré |
| Tester la commande | Entrer `/mystatus` | Affichage des informations de quota ou "Aucun compte configuré trouvé" |

## Pièges à éviter

### Erreur courante 1 : Erreur de format JSON

**Symptôme** : Échec du démarrage d'OpenCode, erreur de format JSON

**Cause** : Trop ou pas assez de virgules ou de guillemets dans le fichier de configuration

**Solution** :

Utilisez un outil de validation JSON en ligne pour vérifier le format, par exemple :

```json
// ❌ Erreur : virgule en trop à la fin du dernier élément
{
  "plugin": ["opencode-mystatus"],
  "command": {
    "mystatus": {
      "description": "Query quota usage for all AI accounts",
      "template": "Use the mystatus tool..."
    }
  }  // ← Il ne devrait pas y avoir de virgule ici
}

// ✅ Correct
{
  "plugin": ["opencode-mystatus"],
  "command": {
    "mystatus": {
      "description": "Query quota usage for all AI accounts",
      "template": "Use the mystatus tool..."
    }
  }
}
```

---

### Erreur courante 2 : Oublier de redémarrer OpenCode

**Symptôme** : Après la configuration, l'entrée de `/mystatus` affiche "Commande non trouvée"

**Cause** : OpenCode n'a pas rechargé le fichier de configuration

**Solution** :

1. Quittez complètement OpenCode (pas réduction)
2. Redémarrez OpenCode
3. Réessayez la commande `/mystatus`

---

### Erreur courante 3 : Affichage "Aucun compte configuré trouvé"

**Symptôme** : Après l'exécution de `/mystatus`, affichage "Aucun compte configuré trouvé"

**Cause** : Vous n'avez pas encore connecté de plateforme IA dans OpenCode

**Solution** :

1. Connectez-vous à au moins une plateforme IA dans OpenCode (OpenAI, Zhipu AI, Z.ai, GitHub Copilot ou Google Cloud)
2. Les informations d'authentification seront automatiquement enregistrées dans `~/.local/share/opencode/auth.json`
3. Réexécutez `/mystatus`

---

### Erreur courante 4 : Échec de la consultation des quotas Google Cloud

**Symptôme** : Toutes les autres plateformes fonctionnent, mais Google Cloud affiche une erreur

**Cause** : Google Cloud nécessite un plugin d'authentification supplémentaire

**Solution** :

Installez d'abord le plugin [opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth) pour compléter l'authentification Google.

## Résumé de la leçon

Cette leçon a couvert l'installation et la vérification initiale d'opencode-mystatus :

1. **Trois méthodes d'installation** : Laisser l'IA installer (recommandé), installation manuelle, installation depuis un fichier local
2. **Emplacement du fichier de configuration** : `~/.config/opencode/opencode.json`
3. **Éléments de configuration clés** :
   - Tableau `plugin` : ajouter `"opencode-mystatus"`
   - Objet `command` : configurer la commande slash `mystatus`
4. **Méthode de vérification** : Après redémarrage d'OpenCode, entrez `/mystatus`
5. **Lecture automatique de l'authentification** : Le plugin lit automatiquement les informations de compte configurées depuis `~/.local/share/opencode/auth.json`

Une fois l'installation terminée, vous pouvez utiliser la commande `/mystatus` ou le langage naturel dans OpenCode pour consulter les quotas de toutes les plateformes IA.

## Prochaine leçon

> La prochaine leçon couvre **[Utiliser mystatus : commandes slash et langage naturel](/fr/vbgate/opencode-mystatus/start/using-mystatus/)**.
>
> Vous apprendrez :
> - Utilisation détaillée de la commande slash `/mystatus`
> - Comment déclencher l'outil mystatus en langage naturel
> - Différences et scénarios d'utilisation des deux méthodes
> - Principes de configuration des commandes slash

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer l'emplacement du code source</strong></summary>

> Date de mise à jour : 2026-01-23

| Fonction | Chemin du fichier | Ligne |
|--- | --- | ---|
| Entrée du plugin | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 26-94 |
| Définition de l'outil mystatus | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 29-33 |
| Lecture du fichier d'authentification | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 35-46 |
| Requête parallèle de toutes les plateformes | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 49-56 |
| Collecte et synthèse des résultats | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 58-89 |
| Configuration de la commande slash | [`command/mystatus.md`](https://github.com/vbgate/opencode-mystatus/blob/main/command/mystatus.md) | 1-6 |

**Constantes clés** :
- Chemin du fichier d'authentification : `~/.local/share/opencode/auth.json` (`plugin/mystatus.ts:35`)

**Fonctions clés** :
- `mystatus()` : Fonction principale de l'outil mystatus, lit le fichier d'authentification et interroge en parallèle toutes les plateformes (`plugin/mystatus.ts:29-33`)
- `collectResult()` : Collecte les résultats de requête dans les tableaux results et errors (`plugin/mystatus.ts:100-116`)
- `queryOpenAIUsage()` : Interroge le quota OpenAI (`plugin/lib/openai.ts`)
- `queryZhipuUsage()` : Interroge le quota Zhipu AI (`plugin/lib/zhipu.ts`)
- `queryZaiUsage()` : Interroge le quota Z.ai (`plugin/lib/zhipu.ts`)
- `queryGoogleUsage()` : Interroge le quota Google Cloud (`plugin/lib/google.ts`)
- `queryCopilotUsage()` : Interroge le quota GitHub Copilot (`plugin/lib/copilot.ts`)

**Format du fichier de configuration** :
La configuration du plugin et des commandes slash dans le fichier de configuration OpenCode `~/.config/opencode/opencode.json` est référencée dans [`README.zh-CN.md`](https://github.com/vbgate/opencode-mystatus/blob/main/README.zh-CN.md#安装) lignes 33-82.

</details>

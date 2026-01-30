---
title: "Journal des modifications : Historique des versions | everything-claude-code"
sidebarTitle: "Voir les dernières mises à jour"
subtitle: "Journal des modifications : Historique des versions"
description: "Découvrez l'historique des versions et les changements importants d'everything-claude-code. Suivez les nouvelles fonctionnalités, les correctifs de sécurité et les mises à jour de documentation pour décider si une mise à niveau est nécessaire."
tags:
  - "journal-des-modifications"
  - "mises-à-jour"
prerequisite: []
order: 250
---

# Journal des modifications : Historique des versions et changements

## Ce que vous apprendrez

- Comprendre les changements importants de chaque version
- Suivre les nouvelles fonctionnalités et les correctifs
- Décider si une mise à niveau est nécessaire

## Historique des versions

### 2026-01-24 - Correctifs de sécurité et documentation

**Corrections** :
- 🔒 **Correctif de sécurité** : Prévention de la vulnérabilité d'injection de commandes dans `commandExists()`
  - Remplacement de `execSync` par `spawnSync`
  - Validation de l'entrée pour n'autoriser que les caractères alphanumériques, les tirets, les soulignements et les points
- 📝 **Correction de documentation** : Ajout d'avertissements de sécurité pour `runCommand()`
- 🐛 **Correction des faux positifs du scanner XSS** : Remplacement de `<script>` et `<binary>` par `[script-name]` et `[binary-name]`
- 📚 **Correction de documentation** : Correction de `npx ts-morph` en `npx tsx scripts/codemaps/generate.ts` dans `doc-updater.md`

**Impact** : #42, #43, #51

---

### 2026-01-22 - Support multiplateforme et pluginisation

**Nouvelles fonctionnalités** :
- 🌐 **Support multiplateforme** : Tous les hooks et scripts réécrits en Node.js, supportant Windows, macOS et Linux
- 📦 **Packaging de plugin** : Distribué en tant que plugin Claude Code, supportant l'installation via le marché de plugins
- 🎯 **Détection automatique du gestionnaire de paquets** : Support de 6 niveaux de priorité de détection
  - Variable d'environnement `CLAUDE_PACKAGE_MANAGER`
  - Configuration du projet `.claude/package-manager.json`
  - Champ `packageManager` de `package.json`
  - Détection de fichiers de verrouillage (package-lock.json, yarn.lock, pnpm-lock.yaml, bun.lockb)
  - Configuration globale `~/.claude/package-manager.json`
  - Repli vers le premier gestionnaire de paquets disponible

**Corrections** :
- 🔄 **Chargement des hooks** : Chargement automatique des hooks par convention, suppression des déclarations de hooks dans `plugin.json`
- 📌 **Chemins des hooks** : Utilisation de `${CLAUDE_PLUGIN_ROOT}` et de chemins relatifs
- 🎨 **Améliorations de l'interface** : Ajout d'un graphique d'historique des étoiles et d'une barre de badges
- 📖 **Organisation des hooks** : Déplacement des hooks session-end de Stop de SessionEnd

---

### 2026-01-20 - Améliorations de fonctionnalités

**Nouvelles fonctionnalités** :
- 💾 **Hooks de persistance de mémoire** : Sauvegarde et chargement automatiques du contexte entre les sessions
- 🧠 **Hook de compactage stratégique** : Suggestions intelligentes de compression du contexte
- 📚 **Compétence d'apprentissage continu** : Extraction automatique de modèles réutilisables à partir des sessions
- 🎯 **Compétence de compactage stratégique** : Stratégies d'optimisation des tokens

---

### 2026-01-17 - Publication initiale

**Fonctionnalités initiales** :
- ✨ Ensemble complet de configurations Claude Code
- 🤖 9 agents spécialisés
- ⚡ 14 commandes slash
- 📋 8 ensembles de règles
- 🔄 Hooks automatisés
- 🎨 11 bibliothèques de compétences
- 🌐 15+ serveurs MCP préconfigurés
- 📖 Documentation README complète

---

## Notes sur le versionnage

Ce projet n'utilise pas le versionnage sémantique traditionnel, mais adopte le format de **versionnage par date** (`YYYY-MM-DD`).

### Types de versions

| Type | Description | Exemple |
|--- | --- | ---|
| **Nouvelle fonctionnalité** | Ajout de nouvelles fonctionnalités ou améliorations majeures | `feat: add new agent` |
| **Correction** | Correction de bug ou problème | `fix: resolve hook loading issue` |
| **Documentation** | Mise à jour de la documentation | `docs: update README` |
| **Style** | Formatage ou style de code | `style: fix indentation` |
| **Refactorisation** | Refactorisation de code | `refactor: simplify hook logic` |
| **Performance** | Optimisation des performances | `perf: improve context loading` |
| **Test** | Lié aux tests | `test: add unit tests` |
| **Build** | Système de build ou dépendances | `build: update package.json` |
| **Annulation** | Annulation d'un commit précédent | `revert: remove version field` |

---

## Comment obtenir les mises à jour

### Mise à jour via le marché de plugins

Si vous avez installé Everything Claude Code via le marché de plugins :

1. Ouvrez Claude Code
2. Exécutez `/plugin update everything-claude-code`
3. Attendez la fin de la mise à jour

### Mise à jour manuelle

Si vous avez cloné le dépôt manuellement :

```bash
cd ~/.claude/plugins/everything-claude-code
git pull origin main
```

### Installation depuis le marché

Première installation :

```bash
/plugin marketplace add affaan-m/everything-claude-code
```

---

## Analyse de l'impact des changements

### Correctifs de sécurité (mise à niveau obligatoire)

- **2026-01-24** : Correction de la vulnérabilité d'injection de commandes, mise à niveau fortement recommandée

### Améliorations de fonctionnalités (mise à niveau optionnelle)

- **2026-01-22** : Support multiplateforme, les utilisateurs Windows doivent effectuer une mise à niveau
- **2026-01-20** : Nouvelles améliorations de fonctionnalités, mise à niveau selon les besoins

### Mises à jour de documentation (pas de mise à niveau nécessaire)

- Les mises à jour de documentation n'affectent pas les fonctionnalités, vous pouvez consulter le README manuellement

---

## Problèmes connus

### Version actuelle (2026-01-24)

- Aucun problème critique connu

### Versions précédentes

- Avant 2026-01-22 : Le chargement des hooks nécessitait une configuration manuelle (corrigé dans 2026-01-22)
- Avant 2026-01-20 : Windows n'était pas supporté (corrigé dans 2026-01-22)

---

## Contribution et feedback

### Signaler un problème

Si vous découvrez un bug ou avez une suggestion de fonctionnalité, veuillez :

1. Rechercher dans [GitHub Issues](https://github.com/affaan-m/everything-claude-code/issues) si un problème similaire existe déjà
2. Si non, créer un nouveau Issue en fournissant :
   - Informations de version
   - Système d'exploitation
   - Étapes de reproduction
   - Comportement attendu vs comportement réel

### Soumettre une PR

Les contributions sont les bienvenues ! Consultez [CONTRIBUTING.md](https://github.com/affaan-m/everything-claude-code/blob/main/CONTRIBUTING.md) pour plus de détails.

---

## Résumé de la leçon

- Everything Claude Code utilise des numéros de version par date (`YYYY-MM-DD`)
- Les correctifs de sécurité (comme 2026-01-24) nécessitent une mise à niveau obligatoire
- Les améliorations de fonctionnalités peuvent être mises à niveau selon les besoins
- Les utilisateurs du marché de plugins utilisent `/plugin update` pour mettre à jour
- Les utilisateurs avec installation manuelle utilisent `git pull` pour mettre à jour
- Pour signaler des problèmes et soumettre des PR, suivez les directives du projet

## Prochain cours

> Le prochain cours couvre **[Référence de configuration](../../appendix/config-reference/)**.
>
> Vous apprendrez :
> - Description complète des champs de `settings.json`
> - Options avancées de configuration des hooks
> - Détails de configuration des serveurs MCP
> - Meilleures pratiques pour la configuration personnalisée

---
title: "Historique des versions: Changelog | Agent Skills"
sidebarTitle: "Versions"
subtitle: "Historique des versions"
description: "Consultez l'historique des mises à jour et des changements de fonctionnalité du projet Agent Skills."
tags:
  - "changelog"
  - "mises à jour"
  - "versions"
---

# Historique des versions

Ce projet enregistre toutes les mises à jour de fonctionnalité, améliorations et correctifs.

---

## v1.0.0 - Janvier 2026

### 🎉 Première version

C'est la première version officielle d'Agent Skills, comprenant le pack de compétences complet et la chaîne d'outils de construction.

#### Nouvelles fonctionnalités

**Règles d'optimisation des performances React**
- 40+ règles d'optimisation des performances React/Next.js
- 8 catégories principales : élimination des cascades, optimisation des bundles, performance serveur, optimisation des re-renders, etc.
- Classées par niveau d'impact (CRITICAL > HIGH > MEDIUM > LOW）
- Chaque règle comprend des exemples de code Incorrect/Correct

**Déploiement en un clic Vercel**
- Supporte la détection automatique de plus de 40 frameworks populaires
- Processus de déploiement sans authentification
- Génère automatiquement les liens de prévisualiation et de transfert de propriété
- Support des projets HTML statiques

**Directives de conception Web**
- 100+ règles de conception d'interface Web
- Audit multidimensionnel : accessibilité, performance, UX
- Récupération à distance des dernières règles (depuis GitHub）

**Chaîne d'outils de construction**
- `pnpm build` - génère la documentation complète AGENTS.md
- `pnpm validate` - valide l'intégrité des fichiers de règles
- `pnpm extract-tests` - extrait les cas de test
- `pnpm dev` - flux de travail de développement (build + validate）

#### Stack technique

- TypeScript 5.3.0
- Node.js 20+
- pnpm 10.24.0+
- tsx 4.7.0 (exécution TypeScript)

#### Documentation

- AGENTS.md guide complet des règles
- SKILL.md fichiers de définition des compétences
- README.md guide d'installation et d'utilisation
- Documentation complète des outils de construction

---

## Convention de nommage des versions

Le projet suit le contrôle de version sémantique (Semantic Versioning) :

- **Version majeure (Major)** : changements d'API incompatibles
- **Version mineure (Minor)** : nouvelles fonctionnalités rétrocompatibles
- **Version de correctif (Patch)** : corrections de bugs rétrocompatibles

Exemple : `1.0.0` indique la première version stable.

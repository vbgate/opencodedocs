---
title: "Journal des modifications: Historique des versions | Plannotator"
sidebarTitle: "Voir les nouveautés"
subtitle: "Journal des modifications: Historique des versions | Plannotator"
description: "Découvrez l'historique des versions et les nouvelles fonctionnalités de Plannotator. Consultez les mises à jour majeures, les corrections de bugs et les améliorations de performance, et maîtrisez les nouvelles fonctionnalités de révision de code, d'annotation d'images et d'intégration Obsidian."
tags:
- "Journal des modifications"
- "Historique des versions"
- "Nouvelles fonctionnalités"
- "Corrections de bugs"
order: 1
---

# Journal des modifications : Historique des versions et nouvelles fonctionnalités de Plannotator

## Ce que vous apprendrez

- ✅ Découvrir l'historique des versions et les nouvelles fonctionnalités de Plannotator
- ✅ Maîtriser les principales mises à jour et améliorations de chaque version
- ✅ Comprendre les corrections de bugs et les optimisations de performance

---

## Dernière version

### v0.6.7 (2026-01-24)

**Nouvelles fonctionnalités** :
- **Mode Commentaire** : Ajout du mode Commentaire, permettant de saisir des commentaires directement dans les plans
- **Raccourci de saisie de commentaire** : Ajout d'un raccourci clavier pour saisir directement le contenu du commentaire

**Améliorations** :
- Correction du problème de blocage des sous-agents du plugin OpenCode
- Correction de la vulnérabilité de sécurité par injection de prompt (CVE)
- Amélioration de la détection intelligente du changement d'agent dans OpenCode

**Référence du code source** :
- Mode Commentaire : [`packages/ui/components/AnnotationToolbar.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationToolbar.tsx#L23-L42)
- Saisie de commentaire : [`packages/ui/components/AnnotationToolbar.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationToolbar.tsx#L80-L100)

---

### v0.6.6 (2026-01-20)

**Corrections** :
- Correction de la vulnérabilité de sécurité CVE du plugin OpenCode
- Correction du problème de blocage des sous-agents, prévention de l'injection de prompt
- Amélioration de la logique de détection intelligente du changement d'agent

**Référence du code source** :
- Plugin OpenCode : [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L245-L280)
- Changement d'agent : [`packages/ui/utils/agentSwitch.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/agentSwitch.ts#L1-L50)

---

### v0.6.5 (2026-01-15)

**Améliorations** :
- **Augmentation du délai d'expiration des hooks** : Augmentation du délai d'expiration des hooks de la valeur par défaut à 4 jours, pour s'adapter aux plans AI de longue durée
- **Correction de la fonction de copie** : Préservation des sauts de ligne lors des opérations de copie
- **Nouveau raccourci Cmd+C** : Ajout de la prise en charge du raccourci Cmd+C

**Référence du code source** :
- Délai d'expiration des hooks : [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L44-L50)
- Sauts de ligne lors de la copie : [`packages/ui/components/Viewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Viewer.tsx#L150-L170)

---

### v0.6.4 (2026-01-10)

**Nouvelles fonctionnalités** :
- **Raccourci Cmd+Entrée** : Prise en charge de l'utilisation de Cmd+Entrée (Windows : Ctrl+Entrée) pour soumettre une approbation ou un retour

**Améliorations** :
- Optimisation de l'expérience des opérations clavier

**Référence du code source** :
- Raccourcis clavier : [`packages/ui/components/AnnotationPanel.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationPanel.tsx#L323)
(La fonctionnalité de raccourci Cmd+Entrée est implémentée directement dans les différents composants)

---

### v0.6.3 (2026-01-05)

**Corrections** :
- Correction du problème de génération de titre ignorée

**Référence du code source** :
- Ignorer le titre : [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L67-L71)

---

### v0.6.2 (2026-01-01)

**Corrections** :
- Correction du problème de fichiers HTML non inclus dans le package npm du plugin OpenCode

**Référence du code source** :
- Construction du plugin OpenCode : [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L1-L50)

---

### v0.6.1 (2025-12-20)

**Nouvelles fonctionnalités** :
- **Intégration Bear** : Prise en charge de la sauvegarde automatique des plans approuvés dans l'application de prise de notes Bear

**Améliorations** :
- Amélioration de la logique de génération des tags pour l'intégration Obsidian
- Optimisation du mécanisme de détection du vault Obsidian

**Référence du code source** :
- Intégration Bear : [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L234-L280)
- Intégration Obsidian : [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L136-L220)

---

## Versions majeures

### Fonctionnalité de révision de code (2026-01)

**Nouvelles fonctionnalités** :
- **Outil de révision de code** : Exécutez la commande `/plannotator-review` pour réviser visuellement les diff Git
- **Annotations au niveau des lignes** : Cliquez sur les numéros de ligne pour sélectionner une plage de code et ajouter des annotations de type commentaire/suggestion/préoccupation
- **Plusieurs vues de diff** : Prise en charge du basculement entre différents types de diff : non validé/staged/dernier commit/branche
- **Intégration d'agents** : Envoi de retours structurés aux agents AI, avec prise en charge des réponses automatiques

**Comment utiliser** :
```bash
# Exécuter dans le répertoire du projet
/plannotator-review
```

**Tutoriels connexes** :
- [Bases de la révision de code](../../platforms/code-review-basics/)
- [Ajouter des annotations de code](../../platforms/code-review-annotations/)
- [Changer de vue de diff](../../platforms/code-review-diff-types/)

**Référence du code source** :
- Serveur de révision de code : [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts)
- Interface de révision de code : [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx)
- Outil Git diff : [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts)

---

### Fonctionnalité d'annotation d'images (2026-01)

**Nouvelles fonctionnalités** :
- **Téléchargement d'images** : Téléchargez des pièces jointes image dans les plans et les révisions de code
- **Outils d'annotation** : Fourniture de trois outils d'annotation : pinceau, flèche et cercle
- **Annotation visuelle** : Annotation directe sur les images pour améliorer l'efficacité des retours de révision

**Tutoriels connexes** :
- [Ajouter des annotations d'images](../../platforms/plan-review-images/)

**Référence du code source** :
- Annotateur d'images : [`packages/ui/components/ImageAnnotator/index.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ImageAnnotator/index.tsx)
- API de téléchargement : [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L160-L180)

---

### Intégration Obsidian (2025-12)

**Nouvelles fonctionnalités** :
- **Détection automatique des vaults** : Détection automatique du chemin de configuration du vault Obsidian
- **Sauvegarde automatique des plans** : Les plans approuvés sont automatiquement sauvegardés dans Obsidian
- **Génération de frontmatter** : Inclusion automatique du frontmatter created, source, tags, etc.
- **Extraction intelligente de tags** : Extraction de mots-clés du contenu du plan comme tags

**Configuration** :
Aucune configuration supplémentaire requise, Plannotator détecte automatiquement le chemin d'installation d'Obsidian.

**Tutoriels connexes** :
- [Intégration Obsidian](../../advanced/obsidian-integration/)

**Référence du code source** :
- Détection Obsidian : [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L136-L145)
- Sauvegarde Obsidian : [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L180-L220)
- Génération de frontmatter : [`packages/ui/utils/obsidian.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/obsidian.ts#L50-L80)

---

### Fonctionnalité de partage par URL (2025-11)

**Nouvelles fonctionnalités** :
- **Partage sans backend** : Compression des plans et annotations dans le hash de l'URL, sans serveur backend requis
- **Partage en un clic** : Cliquez sur Exporter → Partager comme URL pour générer un lien de partage
- **Mode lecture seule** : Les collaborateurs peuvent consulter l'URL mais ne peuvent pas soumettre de décisions

**Implémentation technique** :
- Utilisation de l'algorithme de compression Deflate
- Encodage Base64 + remplacement de caractères sûrs pour l'URL
- Prise en charge d'un payload maximum d'environ 7 tags

**Tutoriels connexes** :
- [Partage par URL](../../advanced/url-sharing/)

**Référence du code source** :
- Utilitaires de partage : [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts)
- Hook de partage : [`packages/ui/hooks/useSharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/hooks/useSharing.ts)

---

### Mode distant/Devcontainer (2025-10)

**Nouvelles fonctionnalités** :
- **Prise en charge du mode distant** : Utilisation de Plannotator dans des environnements distants tels que SSH, devcontainer, WSL
- **Port fixe** : Définition d'un port fixe via des variables d'environnement
- **Transfert de port** : Sortie automatique de l'URL pour que l'utilisateur ouvre manuellement le navigateur
- **Contrôle du navigateur** : Contrôle de l'ouverture automatique du navigateur via la variable d'environnement `PLANNOTATOR_BROWSER`

**Variables d'environnement** :
- `PLANNOTATOR_REMOTE=1` : Activer le mode distant
- `PLANNOTATOR_PORT=3000` : Définir le port fixe
- `PLANNOTATOR_BROWSER=disabled` : Désactiver l'ouverture automatique du navigateur

**Tutoriels connexes** :
- [Mode distant/Devcontainer](../../advanced/remote-mode/)
- [Configuration des variables d'environnement](../../advanced/environment-variables/)

**Référence du code source** :
- Mode distant : [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts)
- Contrôle du navigateur : [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts)

---

## Compatibilité des versions

| Version Plannotator | Claude Code | OpenCode | Version minimale Bun |
| --- | --- | --- | --- |
| v0.6.x | 2.1.7+ | 1.0+ | 1.0+ |
| v0.5.x | 2.1.0+ | 0.9+ | 0.7+ |

**Recommandations de mise à jour** :
- Maintenez Plannotator à jour pour bénéficier des dernières fonctionnalités et corrections de sécurité
- Claude Code et OpenCode doivent également être maintenus à jour

---

## Changements de licence

**Version actuelle (v0.6.7+)** : Business Source License 1.1 (BSL-1.1)

**Détails de la licence** :
- Autorisé : Utilisation personnelle, utilisation commerciale interne
- Restrictions : Fourniture de services hébergés, produits SaaS
- Détails dans le fichier [LICENSE](https://github.com/backnotprop/plannotator/blob/main/LICENSE)

---

## Retours et support

**Signaler un problème** :
- GitHub Issues : https://github.com/backnotprop/plannotator/issues

**Suggestions de fonctionnalités** :
- Soumettre une demande de fonctionnalité dans les GitHub Issues

**Vulnérabilités de sécurité** :
- Veuillez signaler les vulnérabilités de sécurité via des canaux privés

---

## Prochaine leçon

> Vous avez maintenant découvert l'historique des versions et les nouvelles fonctionnalités de Plannotator.
>
> Prochaines étapes :
> - Retourner à la [page de démarrage rapide](../../start/getting-started/) pour apprendre à installer et utiliser
> - Consulter la [FAQ](../../faq/common-problems/) pour résoudre les problèmes d'utilisation
> - Lire la [référence API](../../appendix/api-reference/) pour découvrir tous les points de terminaison API

---
title: "Meilleures pratiques: utilisation efficace | Agent Skills"
sidebarTitle: "Meilleures pratiques"
subtitle: "Meilleures pratiques d'utilisation"
description: "Apprenez à utiliser efficacement Agent Skills: techniques de mots-clés déclencheurs, gestion du contexte et collaboration multi-compétences pour optimiser vos workflows."
tags:
  - "Meilleures pratiques"
  - "Optimisation des performances"
  - "Amélioration de l'efficacité"
  - "Techniques d'utilisation de l'IA"
prerequisite:
  - "start-getting-started"
  - "start-installation"
---

# Meilleures pratiques d'utilisation

## Ce que vous pourrez faire après ce cours

- ✅ Sélectionner précisément les mots-clés déclencheurs, permettant à l'IA d'activer les compétences au bon moment
- ✅ Optimiser la gestion du contexte, réduire la consommation de tokens, améliorer la vitesse de réponse
- ✅ Gérer les scénarios de collaboration multi-compétences, éviter les conflits et la confusion
- ✅ Maîtriser les modes d'utilisation courants, améliorer l'efficacité du travail

## Votre problème actuel

Vous pourriez rencontrer ces scénarios :

- ✗ Saisissez « aidez-moi à déployer », mais l'IA n'active pas la compétence Vercel Deploy
- ✗ La même tâche déclenche plusieurs compétences, l'IA ne sait pas laquelle utiliser
- ✗ Les compétences occupent trop de contexte, l'IA « oublie » vos besoins
- ✗ Vous devez expliquer la tâche à chaque fois, vous ne savez pas comment faire en sorte que l'IA se souvienne de vos habitudes

## Quand utiliser cette technique

Lorsque vous utilisez Agent Skills et rencontrez :

- 🎯 **Déclenchement inexact** : compétences non activées ou mauvaise compétence activée
- 💾 **Pression de contexte** : compétences occupent trop de tokens, affectant les autres conversations
- 🔄 **Conflit de compétences** : plusieurs compétences activées simultanément, l'IA exécute en confusion
- ⚡ **Baisse des performances** : réponse de l'IA ralentit, nécessite une optimisation

## L'idée centrale

**La philosophie de conception d'Agent Skills** :

Agent Skills adopte le mécanisme de **chargement à la demande** - Claude ne charge au démarrage que le nom et la description de la compétence (environ 1-2 lignes), et ne lit le contenu complet de `SKILL.md` que lorsqu'il détecte des mots-clés pertinents. Cette conception minimise au maximum la consommation de contexte tout en maintenant l'activation précise des compétences.

**Les trois dimensions clés de l'efficacité d'utilisation** :

1. **Précision du déclenchement** : choisir les mots-clés appropriés pour que les compétences s'activent au bon moment
2. **Efficacité du contexte** : contrôler la longueur du contenu des compétences, éviter d'occuper trop de tokens
3. **Clarté de la collaboration** : définir clairement les frontières des compétences, éviter les conflits multi-compétences

---

## Meilleure pratique 1 : choisir précisément les mots-clés déclencheurs

### Qu'est-ce qu'un mot-clé déclencheur ?

Les mots-clés déclencheurs sont définis dans le champ `description` de `SKILL.md`, indiquant à l'IA quand elle devrait activer cette compétence.

**Principe clé** : la description doit être spécifique, le déclenchement doit être explicite

### Comment écrire une description efficace ?

#### ❌ Exemple incorrect : description trop vague

```yaml
---
name: my-deploy-tool
description: A deployment tool for applications  # trop vague, impossible à déclencher
---
```

**Problèmes** :
- Aucun scénario d'utilisation explicite
- Ne contient pas les mots-clés que l'utilisateur pourrait dire
- L'IA ne peut pas juger quand activer

#### ✅ Exemple correct : description spécifique et contenant des mots-clés

```yaml
---
name: vercel-deploy
description: Deploy applications and websites to Vercel. Use this skill when user requests deployment actions such as "Deploy my app", "Deploy this to production", "Create a preview deployment", "Deploy and give me the link", or "Push this live". No authentication required.
---
```

**Avantages** :
- Scénario d'utilisation explicite (Deploy applications)
- Liste des phrases déclencheurs spécifiques (« Deploy my app », « Deploy this to production »)
- Décrit la valeur unique (No authentication required)

### Guide de sélection des mots-clés déclencheurs

| Scénario d'écriture | Mots-clés recommandés | À éviter |
|---------|-----------|---------|
| **Opérations de déploiement** | « deploy », « production », « push », « publish » | « send », « move » |
| **Audit de code** | « review », « check », « audit », « optimize » | « look at », « see » |
| **Vérification de conception** | « accessibility », « a11y », « UX check », « design audit » | « design », « style » |
| **Optimisation des performances** | « optimize », « performance », « improve speed » | « faster », « better » |

### Mises en garde : erreurs courantes

::: warning Évitez ces erreurs

❌ **Utiliser seulement des mots génériques**
```yaml
description: A tool for code review  # « code review » trop générique
```

✅ **Scénario spécifique + mots-clés**
```yaml
description: Review React components for performance issues. Use when user says "review performance", "check optimization", or "find bottlenecks".
```

❌ **Trop peu de mots-clés**
```yaml
description: Deploy to Vercel  # un seul scénario
```

✅ **Couvrir plusieurs expressions**
```yaml
description: Deploy to Vercel. Use when user says "deploy", "push live", "create preview", or "publish".
```

---

## Meilleure pratique 2 : techniques de gestion du contexte

### Pourquoi la gestion du contexte est-elle importante ?

Les tokens sont une ressource limitée. Si `SKILL.md` est trop long, il occupera beaucoup de contexte, causant que l'IA « oublie » vos besoins ou que la réponse ralentisse.

### Principe clé : garder SKILL.md concis

::: tip Règle d'or

**Garder le fichier SKILL.md sous 500 lignes**

:::

Selon la documentation officielle, les stratégies suivantes peuvent minimiser l'utilisation du contexte :

| Stratégie | Description | Effet |
|-----|------|------|
| **Garder SKILL.md concis** | Mettre les références détaillées dans des fichiers séparés | Réduire la quantité de chargement initial |
| **Écrire une description spécifique** | Aider l'IA à juger précisément quand activer | Éviter les déclenchements erronés |
| **Divulgation progressive** | Ne lire les fichiers de support que si nécessaire | Contrôler la consommation réelle de tokens |
| **Prioriser l'exécution de scripts** | La sortie du script ne consomme pas de contexte, seule la sortie de résultat le fait | Réduire considérablement l'utilisation de tokens |
| **Référence de fichier à un seul niveau** | Lier directement de SKILL.md vers les fichiers de support | Éviter les imbrications multiples |

---

## Résumé de ce cours

**Points clés** :

1. **Mots-clés de déclenchement** : la description doit être spécifique, couvrir plusieurs expressions que l'utilisateur pourrait dire
2. **Gestion du contexte** : garder SKILL.md < 500 lignes, utiliser la divulgation progressive, prioriser les scripts
3. **Collaboration multi-compétences** : distinguer clairement les mots déclencheurs pour séparer les compétences, traiter explicitement les tâches multiples par ordre
4. **Optimisation des performances** : simplifier le contexte de conversation, éviter le chargement répété, surveiller l'utilisation des tokens

**Mnémo des meilleures pratiques** :

> La description doit être spécifique, le déclenchement explicite
> Le fichier ne doit pas être trop long, les scripts prennent de la place
> Plusieurs compétences ont des frontières, l'ordre des tâches doit être clair
> Le contexte doit être concis, nettoyez régulièrement pour éviter les ralentissements

---

## Aperçu du cours suivant

> Dans le cours suivant, nous approfondirons **[Architecture et détails d'implémentation d'Agent Skills](../../appendix/architecture/)**.
>
> Vous apprendrez :
> - Processus de construction détaillé (parse → validate → group → sort → generate）
> - Comment fonctionne le parseur de règles
> - Système de types et modèle de données
> - Mécanisme d'extraction des cas de test
> - Algorithme de détection de frameworks des scripts de déploiement

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Dernière mise à jour :2026-01-25

| Fonctionnalité | Chemin de fichier | Ligne |
| ----------- | -------------------------------------------------------------------------- | ------ |
| Meilleures pratiques de gestion du contexte | [`AGENTS.md:70-78`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L70-L78) | 70-78 |
| Exemples de déclenchement de compétences | [`README.md:88-102`](https://github.com/vercel-labs/agent-skills/blob/main/README.md#L88-L102) | 88-102 |
| Mots-clés de compétences React | [`SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/SKILL.md) | 1-30 |
| Mots-clés de déploiement Vercel | [`SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/SKILL.md) | 1-30 |

**Principes clés** :
- Keep SKILL.md under 500 lines : garder le fichier de compétence concis
- Write specific descriptions : écrire des descriptions spécifiques pour aider l'IA à juger
- Use progressive disclosure : divulgation progressive du contenu détaillé
- Prefer scripts over inline code : prioriser l'exécution de scripts pour réduire la consommation de tokens

</details>

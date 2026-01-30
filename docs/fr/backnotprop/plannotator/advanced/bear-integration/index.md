---
title: "Intégration Bear : Sauvegarde automatique des plans | Plannotator"
sidebarTitle: "Sauvegarde auto vers Bear"
subtitle: "Intégration Bear : Sauvegarde automatique des plans approuvés | Plannotator"
description: "Apprenez à configurer l'intégration Bear de plannotator. Sauvegardez automatiquement les plans approuvés via x-callback-url, génération intelligente de tags, capitalisation des connaissances et archivage des plans."
tags:
  - "Intégration"
  - "Bear"
  - "Application de notes"
  - "Capitalisation des connaissances"
prerequisite:
  - "start/installation-claude-code"
  - "platforms/plan-review-basics"
order: 3
---

# Intégration Bear : Sauvegarde automatique des plans approuvés

## Ce que vous apprendrez

Une fois l'intégration Bear activée, chaque fois que vous approuvez un plan, Plannotator l'enregistre automatiquement dans votre Bear, notamment :
- Un titre généré automatiquement (extrait du plan)
- Des tags intelligents (nom du projet, mots-clés, langage de programmation)
- Le contenu complet du plan

Ainsi, vous pouvez gérer tous les plans approuvés en un seul endroit, facilitant la consultation ultérieure et la capitalisation des connaissances.

## Le problème que vous rencontrez

Vous avez peut-être rencontré ces situations :
- L'IA génère un excellent plan, mais vous souhaitez le sauvegarder pour référence future
- Copier-coller manuellement les plans dans Bear est fastidieux
- Les plans de différents projets sont mélangés, sans gestion par tags

Avec l'intégration Bear, ces problèmes sont résolus automatiquement.

## Quand utiliser cette fonctionnalité

- Vous utilisez Bear comme application de notes principale
- Vous devez archiver les plans approuvés dans une base de connaissances
- Vous souhaitez récupérer rapidement les plans historiques via des tags

::: info À propos de Bear
Bear est une application de notes Markdown pour macOS, prenant en charge les tags, le chiffrement, la synchronisation et d'autres fonctionnalités. Si vous ne l'avez pas encore installée, visitez [bear.app](https://bear.app/) pour en savoir plus.
:::

## 🎒 Prérequis

- Plannotator installé (voir le [tutoriel d'installation](../../start/installation-claude-code/))
- Bear installé et fonctionnel
- Connaissance de base du processus d'évaluation des plans (voir les [bases de l'évaluation des plans](../../platforms/plan-review-basics/))

## Concept clé

Le cœur de l'intégration Bear est le protocole **x-callback-url** :

1. Dans l'interface UI de Plannotator, activez l'intégration Bear (stockée dans le localStorage du navigateur)
2. Lors de l'approbation d'un plan, Plannotator envoie l'URL `bear://x-callback-url/create`
3. Le système utilise la commande `open` pour ouvrir automatiquement Bear et créer une note
4. Le contenu du plan, le titre et les tags sont automatiquement remplis

**Points clés** :
- Aucune configuration de chemin de vault nécessaire (contrairement à Obsidian qui nécessite de spécifier un vault)
- Génération intelligente de tags (maximum 7)
- Sauvegarde automatique lors de l'approbation du plan

::: tip Différence avec Obsidian
L'intégration Bear est plus simple, ne nécessitant pas la configuration d'un chemin de vault, juste un interrupteur. Cependant, Obsidian permet de spécifier le dossier de sauvegarde et offre plus de personnalisation.
:::

## Tutoriel étape par étape

### Étape 1 : Ouvrir les paramètres de Plannotator

Une fois que l'Agent IA a généré un plan et ouvert l'interface UI de Plannotator, cliquez sur le bouton ⚙️ **Settings** en haut à droite.

**Ce que vous devriez voir** : Le panneau des paramètres apparaît, contenant plusieurs options de configuration

### Étape 2 : Activer l'intégration Bear

Dans le panneau des paramètres, trouvez la section **Bear Notes** et cliquez sur l'interrupteur.

**Pourquoi**
L'interrupteur passe du gris (désactivé) au bleu (activé), tout en étant stocké dans le localStorage du navigateur.

**Ce que vous devriez voir** :
- L'interrupteur Bear Notes devient bleu
- Texte descriptif : "Auto-save approved plans to Bear"

### Étape 3 : Approuver le plan

Une fois l'évaluation du plan terminée, cliquez sur le bouton **Approve** en bas.

**Pourquoi**
Plannotator lit les paramètres Bear, et si activé, appelle le x-callback-url de Bear lors de l'approbation.

**Ce que vous devriez voir** :
- L'application Bear s'ouvre automatiquement
- Une fenêtre de nouvelle note apparaît
- Le titre et le contenu sont déjà remplis
- Les tags sont déjà générés (commençant par `#`)

### Étape 4 : Consulter la note sauvegardée

Dans Bear, vérifiez la note nouvellement créée et confirmez :
- Le titre est correct (provenant du H1 du plan)
- Le contenu est complet (contient le texte complet du plan)
- Les tags sont raisonnables (nom du projet, mots-clés, langage de programmation)

**Ce que vous devriez voir** :
Une structure de note similaire à celle-ci :

```markdown
## User Authentication

[Contenu complet du plan...]

#plannotator #myproject #authentication #typescript #api
```

## Points de vérification ✅

- [ ] L'interrupteur Bear Notes dans les paramètres est activé
- [ ] Bear s'ouvre automatiquement après l'approbation du plan
- [ ] Le titre de la note correspond au H1 du plan
- [ ] La note contient le contenu complet du plan
- [ ] Les tags incluent `#plannotator` et le nom du projet

## Dépannage

### Bear ne s'ouvre pas automatiquement

**Cause** : La commande système `open` a échoué, peut-être :
- Bear n'est pas installé ou n'a pas été téléchargé depuis l'App Store
- Le schéma d'URL de Bear a été détourné par une autre application

**Solution** :
1. Confirmez que Bear est installé correctement
2. Testez manuellement dans le terminal : `open "bear://x-callback-url/create?title=test"`

### Les tags ne correspondent pas aux attentes

**Cause** : Les tags sont générés automatiquement selon les règles suivantes :
- Obligatoire : `#plannotator`
- Obligatoire : Nom du projet (extrait du nom du dépôt git ou du répertoire)
- Optionnel : Maximum 3 mots-clés extraits du titre H1 (en excluant les mots vides)
- Optionnel : Tags de langage de programmation extraits des blocs de code (en excluant json/yaml/markdown)
- Maximum 7 tags

**Solution** :
- Si les tags ne correspondent pas aux attentes, vous pouvez les modifier manuellement dans Bear
- Si le nom du projet est incorrect, vérifiez la configuration du dépôt git ou le nom du répertoire

### Approuvé mais non sauvegardé

**Cause** :
- L'interrupteur Bear n'est pas activé (vérifiez les paramètres)
- Erreur réseau ou Bear a expiré
- Le contenu du plan est vide

**Solution** :
1. Confirmez que l'interrupteur dans les paramètres est bleu (état activé)
2. Vérifiez les journaux du terminal pour les erreurs (`[Bear] Save failed:`)
3. Approuvez à nouveau le plan

## Mécanisme de génération des tags

Plannotator génère intelligemment des tags pour vous permettre de récupérer rapidement les plans dans Bear. Voici les règles de génération des tags :

| Source du tag | Exemple | Priorité |
|--- | --- | ---|
| Tag fixe | `#plannotator` | Obligatoire |
| Nom du projet | `#myproject`, `#plannotator` | Obligatoire |
| Mots-clés H1 | `#authentication`, `#api` | Optionnel (maximum 3) |
| Langage de programmation | `#typescript`, `#python` | Optionnel |

**Liste des mots vides** (non utilisés comme tags) :
- `the`, `and`, `for`, `with`, `this`, `that`, `from`, `into`
- `plan`, `implementation`, `overview`, `phase`, `step`, `steps`

**Exclusion de langages de programmation** (non utilisés comme tags) :
- `json`, `yaml`, `yml`, `text`, `txt`, `markdown`, `md`

::: details Exemple : Processus de génération de tags
Supposons que le titre du plan soit "Implementation Plan: User Authentication System in TypeScript", et que les blocs de code contiennent Python et JSON :

1. **Tag fixe** : `#plannotator`
2. **Nom du projet** : `#myproject` (nom du dépôt git supposé)
3. **Mots-clés H1** :
   - `implementation` → Exclu (mot vide)
   - `plan` → Exclu (mot vide)
   - `user` → Conservé → `#user`
   - `authentication` → Conservé → `#authentication`
   - `system` → Conservé → `#system`
   - `typescript` → Conservé → `#typescript`
4. **Langages de programmation** :
   - `python` → Conservé → `#python`
   - `json` → Exclu (liste d'exclusion)

Tags finaux : `#plannotator #myproject #user #authentication #system #typescript #python` (7 tags, limite atteinte)
:::

## Comparaison avec l'intégration Obsidian

| Fonctionnalité | Intégration Bear | Intégration Obsidian |
|--- | --- | ---|
| Complexité de configuration | Simple (seulement un interrupteur) | Moyenne (nécessite de choisir le vault et le dossier) |
| Stockage | Dans l'application Bear | Chemin de vault spécifié |
| Nom de fichier | Géré automatiquement par Bear | `Title - Jan 2, 2026 2-30pm.md` |
| Frontmatter | Aucun (Bear ne le prend pas en charge) | Oui (created, source, tags) |
| Multiplateforme | macOS uniquement | macOS/Windows/Linux |
| x-callback-url | ✅ Utilisé | ❌ Écriture directe du fichier |

::: tip Comment choisir
- Si vous utilisez uniquement macOS et aimez Bear : l'intégration Bear est plus simple
- Si vous avez besoin du multiplateforme ou de chemins de stockage personnalisés : l'intégration Obsidian est plus flexible
- Si vous souhaitez utiliser les deux : vous pouvez les activer simultanément (l'approbation du plan sauvegardera dans les deux emplacements)
:::

## Résumé de la leçon

- L'intégration Bear fonctionne via le protocole x-callback-url, configuration simple
- Il suffit d'activer l'interrupteur dans les paramètres, aucun chemin à spécifier
- Sauvegarde automatique dans Bear lors de l'approbation du plan
- Génération intelligente de tags, incluant le nom du projet, les mots-clés, le langage de programmation (maximum 7)
- Comparé à l'intégration Obsidian, Bear est plus simple mais offre moins de fonctionnalités

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons le **[Mode à distance/Devcontainer](../remote-mode/)**.
>
> Vous découvrirez :
> - Comment utiliser Plannotator dans un environnement distant (SSH, devcontainer, WSL)
> - Configuration de ports fixes et de redirection de ports
> - Ouvrir le navigateur dans l'environnement distant pour consulter la page d'évaluation

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Fonctionnalité | Chemin du fichier | Lignes |
|--- | --- | ---|
| Interface de configuration Bear | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L18-L20) | 18-20 |
| Sauvegarde vers Bear | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L234-L257) | 234-257 |
| Extraction des tags | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L34-L74) | 34-74 |
| Extraction du titre | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L94-L105) | 94-105 |
| Interface des paramètres Bear | [`packages/ui/utils/bear.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/bear.ts#L15-L17) | 15-17 |
| Lecture des paramètres Bear | [`packages/ui/utils/bear.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/bear.ts#L22-L26) | 22-26 |
| Sauvegarde des paramètres Bear | [`packages/ui/utils/bear.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/bear.ts#L31-L33) | 31-33 |
| Composant UI des paramètres | [`packages/ui/components/Settings.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Settings.tsx#L496-L518) | 496-518 |
| Appel de Bear lors de l'approbation | [`packages/editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/editor/App.tsx#L512-L514) | 512-514 |
| Traitement Bear côté serveur | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L250-L257) | 250-257 |

**Fonctions clés** :
- `saveToBear(config: BearConfig)` : Sauvegarde le plan dans Bear via x-callback-url
- `extractTags(markdown: string)` : Extrait intelligemment les tags du contenu du plan (maximum 7)
- `extractTitle(markdown: string)` : Extrait le titre de la note du titre H1 du plan
- `getBearSettings()` : Lit les paramètres d'intégration Bear depuis le localStorage
- `saveBearSettings(settings)` : Sauvegarde les paramètres d'intégration Bear dans le localStorage

**Constantes clés** :
- `STORAGE_KEY_ENABLED = 'plannotator-bear-enabled'` : Nom de la clé des paramètres Bear dans le localStorage

**Format de l'URL Bear** :
```typescript
bear://x-callback-url/create?title={title}&text={content}&open_note=no
```

</details>

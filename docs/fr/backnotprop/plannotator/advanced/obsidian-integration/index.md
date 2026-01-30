---
title: "Intégration Obsidian : Sauvegarde automatique des plans | plannotator"
sidebarTitle: "Sauvegarde auto vers Obsidian"
subtitle: "Intégration Obsidian : Sauvegarde automatique des plans | plannotator"
description: "Apprenez à configurer l'intégration Obsidian de plannotator. Sauvegardez automatiquement les plans approuvés dans votre vault, avec génération de frontmatter et de tags, et chemins personnalisables."
tags:
  - "plannotator"
  - "integration"
  - "obsidian"
  - "advanced"
prerequisite:
  - "start-getting-started"
order: 2
---

# Intégration Obsidian : Sauvegarde automatique des plans dans votre vault

## Ce que vous apprendrez

- Sauvegarder automatiquement les plans approuvés ou rejetés dans un vault Obsidian
- Comprendre le mécanisme de génération du frontmatter et des tags
- Personnaliser les chemins et dossiers de sauvegarde
- Exploiter les backlinks pour construire un graphe de connaissances

## Le problème que vous rencontrez

Vous évaluez des plans générés par l'IA dans Plannotator, mais une fois approuvés, ces plans « disparaissent ». Vous aimeriez les conserver dans Obsidian pour les consulter et les retrouver facilement, mais le copier-coller manuel est fastidieux et la mise en forme se perd.

## Quand utiliser cette fonctionnalité

- Vous utilisez Obsidian comme outil de gestion des connaissances
- Vous souhaitez conserver et revoir à long terme les plans d'implémentation générés par l'IA
- Vous voulez organiser vos plans avec la vue graphique et le système de tags d'Obsidian

## Concept clé

L'intégration Obsidian de Plannotator sauvegarde automatiquement le contenu des plans dans votre vault Obsidian lorsque vous les approuvez ou les rejetez. Le système :

1. **Détecte les vaults** : Lit automatiquement tous les vaults depuis le fichier de configuration Obsidian
2. **Génère le frontmatter** : Inclut la date de création, la source et les tags
3. **Extrait les tags** : Extrait automatiquement les tags du titre du plan et des langages des blocs de code
4. **Ajoute un backlink** : Insère un lien `[[Plannotator Plans]]` pour faciliter la construction du graphe de connaissances

::: info Qu'est-ce qu'Obsidian ?
Obsidian est une application de prise de notes avec liens bidirectionnels, orientée local-first, supportant le format Markdown. Elle permet de visualiser les relations entre les notes grâce à une vue graphique.
:::

## 🎒 Prérequis

Assurez-vous qu'Obsidian est installé et configuré. Plannotator détecte automatiquement les vaults présents sur votre système, mais vous devez avoir au moins un vault pour utiliser cette fonctionnalité.

## Tutoriel étape par étape

### Étape 1 : Ouvrir le panneau des paramètres

Dans l'interface Plannotator, cliquez sur l'icône d'engrenage en haut à droite pour ouvrir le panneau des paramètres.

Vous devriez voir la boîte de dialogue des paramètres avec plusieurs options de configuration.

### Étape 2 : Activer l'intégration Obsidian

Dans le panneau des paramètres, trouvez la section « Obsidian Integration » et activez l'interrupteur.

Une fois activé, Plannotator détecte automatiquement les vaults Obsidian présents sur votre système.

Vous devriez voir un menu déroulant listant les vaults détectés (par exemple `My Vault`, `Work Notes`).

### Étape 3 : Sélectionner le vault et le dossier

Sélectionnez dans le menu déroulant le vault où vous souhaitez sauvegarder vos plans. Si aucun vault n'est détecté, vous pouvez :

1. Sélectionner l'option « Custom path... »
2. Saisir le chemin complet du vault dans le champ de texte

Ensuite, définissez le nom du dossier de sauvegarde dans le champ « Folder » (par défaut `plannotator`).

Vous devriez voir l'aperçu du chemin en dessous, indiquant où les plans seront sauvegardés.

### Étape 4 : Approuver ou rejeter un plan

Une fois la configuration terminée, évaluez normalement les plans générés par l'IA. Lorsque vous cliquez sur « Approve » ou « Send Feedback », le plan est automatiquement sauvegardé dans le vault configuré.

Vous devriez voir un nouveau fichier créé dans Obsidian, avec un nom au format `Title - Jan 2, 2026 2-30pm.md`.

### Étape 5 : Consulter le fichier sauvegardé

Ouvrez le fichier sauvegardé dans Obsidian, vous verrez le contenu suivant :

```markdown
---
created: 2026-01-24T14:30:00.000Z
source: plannotator
tags: [plan, authentication, typescript, sql]
---

[[Plannotator Plans]]

## Implementation Plan: User Authentication

...
```

Vous remarquerez le frontmatter YAML en haut du fichier, contenant la date de création, la source et les tags.

## Points de vérification ✅

- [ ] L'intégration Obsidian est activée dans le panneau des paramètres
- [ ] Un vault est sélectionné (ou un chemin personnalisé est saisi)
- [ ] Le nom du dossier est défini
- [ ] Après approbation ou rejet d'un plan, un nouveau fichier apparaît dans Obsidian
- [ ] Le fichier contient le frontmatter et le backlink `[[Plannotator Plans]]`

## Détails du frontmatter et des tags

### Structure du frontmatter

Chaque plan sauvegardé contient les champs frontmatter suivants :

| Champ | Exemple de valeur | Description |
| --- | --- | --- |
| `created` | `2026-01-24T14:30:00.000Z` | Horodatage de création au format ISO 8601 |
| `source` | `plannotator` | Valeur fixe identifiant la source |
| `tags` | `[plan, authentication, typescript]` | Tableau de tags extraits automatiquement |

### Règles de génération des tags

Plannotator utilise les règles suivantes pour extraire automatiquement les tags :

1. **Tag par défaut** : Inclut toujours le tag `plannotator`
2. **Tag du projet** : Extrait automatiquement du nom du dépôt git ou du répertoire
3. **Mots-clés du titre** : Extrait les mots significatifs du premier titre H1 (en excluant les mots vides courants)
4. **Tags des langages de code** : Extraits des identifiants de langage des blocs de code (par exemple `typescript`, `sql`). Les langages de configuration génériques (comme `json`, `yaml`, `markdown`) sont automatiquement filtrés.

Liste des mots vides (non utilisés comme tags) :
- `the`, `and`, `for`, `with`, `this`, `that`, `from`, `into`
- `plan`, `implementation`, `overview`, `phase`, `step`, `steps`

Limite du nombre de tags : maximum 7 tags, classés par ordre d'extraction.

### Format du nom de fichier

Le nom de fichier utilise un format lisible : `Title - Jan 2, 2026 2-30pm.md`

| Partie | Exemple | Description |
| --- | --- | --- |
| Titre | `User Authentication` | Extrait du H1, limité à 50 caractères |
| Date | `Jan 2, 2026` | Date actuelle |
| Heure | `2-30pm` | Heure actuelle (format 12 heures) |

### Mécanisme des backlinks

Un lien `[[Plannotator Plans]]` est inséré à la fin de chaque fichier de plan. Ce backlink permet :

- **Connexion au graphe de connaissances** : Dans la vue graphique d'Obsidian, tous les plans sont connectés au même nœud
- **Navigation rapide** : Cliquer sur `[[Plannotator Plans]]` permet de créer une page d'index regroupant tous les plans sauvegardés
- **Liens bidirectionnels** : Utiliser les liens retour dans la page d'index pour voir tous les plans

## Support multiplateforme

Plannotator détecte automatiquement l'emplacement du fichier de configuration Obsidian selon le système d'exploitation :

| Système | Chemin du fichier de configuration |
| --- | --- |
| macOS | `~/Library/Application Support/obsidian/obsidian.json` |
| Windows | `%APPDATA%\obsidian/obsidian.json` |
| Linux | `~/.config/obsidian/obsidian.json` |

Si la détection automatique échoue, vous pouvez saisir manuellement le chemin du vault.

## Dépannage

### Problème 1 : Aucun vault détecté

**Symptôme** : Le menu déroulant affiche « Detecting... » mais aucun résultat

**Cause** : Le fichier de configuration Obsidian n'existe pas ou est mal formaté

**Solution** :
1. Vérifiez qu'Obsidian est installé et a été ouvert au moins une fois
2. Vérifiez que le fichier de configuration existe (voir les chemins dans le tableau ci-dessus)
3. Utilisez « Custom path... » pour saisir manuellement le chemin du vault

### Problème 2 : Fichier introuvable après sauvegarde

**Symptôme** : Après approbation d'un plan, aucun nouveau fichier n'apparaît dans Obsidian

**Cause** : Chemin du vault incorrect ou Obsidian non actualisé

**Solution** :
1. Vérifiez que le chemin affiché dans le panneau des paramètres est correct
2. Dans Obsidian, cliquez sur « Reload vault » ou appuyez sur `Cmd+R` (macOS) / `Ctrl+R` (Windows/Linux)
3. Vérifiez que vous avez sélectionné le bon vault

### Problème 3 : Caractères spéciaux dans le nom de fichier

**Symptôme** : Le nom de fichier contient des `_` ou d'autres caractères de remplacement

**Cause** : Le titre contient des caractères non supportés par le système de fichiers (`< > : " / \ | ? *`)

**Solution** : C'est un comportement attendu. Plannotator remplace automatiquement ces caractères pour éviter les erreurs du système de fichiers.

## Résumé de la leçon

L'intégration Obsidian connecte de manière transparente votre processus d'évaluation des plans à votre gestion des connaissances :

- ✅ Sauvegarde automatique des plans approuvés ou rejetés
- ✅ Extraction intelligente des tags pour faciliter la recherche ultérieure
- ✅ Génération du frontmatter pour un format de métadonnées unifié
- ✅ Ajout de backlinks pour construire un graphe de connaissances

Une fois configuré, chaque évaluation est automatiquement archivée, sans copier-coller manuel.

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons l'**[Intégration Bear](../bear-integration/)**.
>
> Vous découvrirez :
> - Comment sauvegarder les plans dans l'application Bear
> - Les différences entre l'intégration Bear et l'intégration Obsidian
> - L'utilisation des x-callback-url pour créer automatiquement des notes

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Détection des vaults Obsidian | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L135-L175) | 135-175 |
| Sauvegarde du plan dans Obsidian | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L180-L227) | 180-227 |
| Extraction des tags | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L34-L74) | 34-74 |
| Génération du frontmatter | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L81-L89) | 81-89 |
| Génération du nom de fichier | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L111-L127) | 111-127 |
| Stockage des paramètres Obsidian | [`packages/ui/utils/obsidian.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/obsidian.ts#L36-L43) | 36-43 |
| Composant UI des paramètres | [`packages/ui/components/Settings.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Settings.tsx#L387-L491) | 387-491 |

**Fonctions clés** :
- `detectObsidianVaults()` : Lit le fichier de configuration Obsidian et retourne la liste des chemins de vaults disponibles
- `saveToObsidian(config)` : Sauvegarde le plan dans le vault spécifié, avec frontmatter et backlink
- `extractTags(markdown)` : Extrait les tags du contenu du plan (mots-clés du titre, langages de code, nom du projet)
- `generateFrontmatter(tags)` : Génère la chaîne frontmatter YAML
- `generateFilename(markdown)` : Génère un nom de fichier lisible

**Règles métier** :
- Maximum 7 tags (L73)
- Nom de fichier limité à 50 caractères (L102)
- Support de la détection multiplateforme des chemins de configuration (L141-149)
- Création automatique des dossiers inexistants (L208)

</details>

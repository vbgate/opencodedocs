---
title: "Étape UI : Conception de l'interface et des prototypes - Système de design ui-ux-pro-max | Tutoriel Agent App Factory"
sidebarTitle: "Conception de l'interface et des prototypes"
subtitle: "Étape 3 : UI - Conception de l'interface et des prototypes"
description: "Apprenez comment l'étape UI génère des schémas UI professionnels et des prototypes prévisualisables à partir du PRD. Ce tutoriel explique les responsabilités de l'UI Agent, l'utilisation du système de design ui-ux-pro-max, la structure standard de ui.schema.yaml, les principes de conception et la liste de vérification de livraison."
tags:
  - "Pipeline"
  - "UI/UX"
  - "Système de design"
prerequisite:
  - "advanced-stage-prd"
order: 100
---

# Étape 3 : UI - Conception de l'interface et des prototypes

L'étape UI est la troisième étape du pipeline Agent App Factory. Elle est responsable de transformer les descriptions fonctionnelles du PRD en une structure d'interface claire (UI Schema) et en prototypes prévisualisables. Cette étape détermine l'apparence et l'expérience d'interaction de l'application finale, constituant un pont clé entre les exigences du produit et la mise en œuvre technique.

## Ce que vous pourrez faire après avoir terminé

- Transformer le PRD en fichier `ui.schema.yaml` conforme aux standards
- Utiliser le skill ui-ux-pro-max pour générer un système de design professionnel (styles, couleurs, polices)
- Créer des prototypes prévisualisables dans le navigateur (HTML + CSS + JS)
- Comprendre les limites de responsabilité de l'UI Agent (conception visuelle, pas de mise en œuvre technique)
- Éviter les pièges courants de la conception par IA (comme l'abus de dégradés violets, de la police Inter)

## Votre difficulté actuelle

Vous avez peut-être un PRD clair, mais vous ne savez pas comment commencer à concevoir l'interface :

- "Le PRD est écrit, mais je ne trouve pas de style UI approprié" (manque de connaissances sur les systèmes de design)
- "Je ne sais pas quelles couleurs, polices ou mises en page utiliser" (dépendance de l'esthétique personnelle plutôt que de normes professionnelles)
- "Le prototype conçu ne correspond pas au PRD" (déconnexion entre la structure de l'interface et les exigences fonctionnelles)
- "J'ai peur que le design soit trop laid ou trop tape-à-l'œil, ne correspondant pas au positionnement du produit" (manque d'expérience en design industriel)

Cette zone aveugle de conception entraînera un manque de normes visuelles claires pour l'étape Code ultérieure, et l'application finale générée peut avoir une apparence confuse et des interactions incohérentes.

## Quand utiliser cette approche

Lorsque votre PRD est terminé et que les conditions suivantes sont remplies :

1. **PRD document clair** (incluant les stories utilisateurs, la liste des fonctionnalités, les non-objectifs)
2. **Pas encore commencé la conception de l'interface** (l'étape UI est la première étape de conception)
3. **Pas encore décidé de la stack technique** (les détails de mise en œuvre technique sont dans l'étape Tech)
4. **Vous souhaitez contrôler la portée de la conception et éviter la sur-conception** (l'étape UI est limitée à un maximum de 3 pages)

## 🎒 Préparation avant de commencer

::: warning Conditions préalables
Avant de commencer l'étape UI, assurez-vous de :

- ✅ Avoir terminé l'[étape PRD](../stage-prd/), `artifacts/prd/prd.md` a été généré
- ✅ Avoir installé le plugin ui-ux-pro-max (méthode recommandée : exécuter [factory init](../../start/installation/) installera automatiquement)
- ✅ Avoir compris l'[aperçu du pipeline en 7 étapes](../../start/pipeline-overview/)
- ✅ Avoir préparé un assistant IA (recommandé : Claude Code)
:::

## Concept central

### Qu'est-ce que l'étape UI ?

**L'étape UI** est un pont entre les exigences du produit et la mise en œuvre technique. Sa seule responsabilité est de **transformer les descriptions fonctionnelles du PRD en structure d'interface et normes visuelles**.

::: info Pas de développement frontend
L'UI Agent n'est pas un ingénieur de développement frontend, il n'écrira pas de composants React ou de code CSS. Sa tâche est de :
- Analyser les exigences fonctionnelles du PRD
- Déterminer l'architecture de l'information de l'interface (pages et composants)
- Générer le système de design (couleurs, polices, espacements, rayons de bordure)
- Créer des prototypes prévisualisables (HTML + CSS + JS)

Il ne décidera pas "avec quel framework implémenter", mais seulement "à quoi cela ressemblera".
:::

### Pourquoi avons-nous besoin d'un système de design ?

Imaginez la décoration d'une maison sans système de design :

- ❌ Sans système de design : salon en style minimaliste, chambre en style rétro, cuisine en style industriel, ensemble chaotique
- ✅ Avec système de design : couleurs unifiées dans toute la maison, style unifié, matériaux unifiés, ensemble cohérent

L'étape UI génère ce "guide de décoration de maison" via le skill ui-ux-pro-max, garantissant que toutes les interfaces générées dans l'étape Code ultérieure suivent des normes visuelles unifiées.

### Structure des fichiers de sortie

L'étape UI générera trois fichiers :

| Fichier | Contenu | Utilisation |
|---------|---------|-------------|
| **ui.schema.yaml** | Configuration du système de design + définition de la structure des pages | L'étape Tech lit ce fichier pour concevoir le modèle de données, l'étape Code lit ce fichier pour générer l'interface |
| **preview.web/index.html** | Prototype prévisualisable dans le navigateur | Permet de voir l'effet de l'interface à l'avance, de vérifier si la conception correspond aux attentes |
| **design-system.md** (optionnel) | Documentation persistante du système de design | Enregistre les décisions de conception, facilite les ajustements ultérieurs |

## Suivez les étapes

### Étape 1 : Confirmer que le PRD est terminé

Avant de démarrer l'étape UI, assurez-vous que `artifacts/prd/prd.md` existe et que le contenu est complet.

**Point de contrôle ✅** :

1. **Utilisateur cible** est-il clairement défini ?
   - ✅ Personas spécifiques (âge/profession/compétences techniques)
   - ❌ Flou : "tout le monde"

2. **Fonctionnalités principales** sont-elles listées ?
   - ✅ 3-7 fonctionnalités clés
   - ❌ Trop ou trop peu

3. **Non-objectifs** sont-ils suffisants ?
   - ✅ Au moins 3 fonctionnalités non faites listées
   - ❌ Manquant ou trop peu

::: tip Si le PRD est incomplet
Retournez d'abord à l'[étape PRD](../stage-prd/) pour modifier, garantissant que la conception a une entrée claire.
:::

### Étape 2 : Démarrer le pipeline jusqu'à l'étape UI

Exécutez dans le répertoire du projet Factory :

```bash
# Continuer à partir de l'étape PRD (si l'étape PRD vient d'être terminée)
factory continue

# Ou spécifier directement de commencer par ui
factory run ui
```

La CLI affichera l'état actuel et les étapes disponibles.

### Étape 3 : L'assistant IA lit la définition de l'UI Agent

L'assistant IA (comme Claude Code) lira automatiquement `agents/ui.agent.md`, comprenant ses responsabilités et contraintes.

::: info Responsabilités de l'Agent
L'UI Agent peut seulement :
- Lire `artifacts/prd/prd.md`
- Écrire dans `artifacts/ui/`
- Utiliser le skill ui-ux-pro-max pour générer le système de design
- Créer des prototypes ne dépassant pas 3 pages

Il ne peut pas :
- Lire d'autres fichiers
- Écrire dans d'autres répertoires
- Décider de la stack technique (ces éléments sont dans l'étape Tech)
- Utiliser le style par défaut de l'IA (dégradés violets, police Inter)
:::

### Étape 4 : Utilisation obligatoire du système de design ui-ux-pro-max (étape clé)

C'est l'étape centrale de l'étape UI. L'assistant IA **doit** d'abord appeler le skill `ui-ux-pro-max`, même si vous pensez que la direction de conception est très claire.

**Rôle du skill ui-ux-pro-max** :

1. **Recommandation automatique du système de design** : correspond automatiquement au meilleur style en fonction du type de produit, du domaine industriel
2. **Fournir 67 styles UI** : du minimalisme au néo-brutalisme
3. **Fournir 96 palettes de couleurs** : prédéfinies par industrie et style
4. **Fournir 57 combinaisons de polices** : éviter les styles IA courants (Inter, Roboto)
5. **Appliquer 100 règles de raisonnement industriel** : garantir que la conception correspond au positionnement du produit

**Ce que fera l'assistant IA** :
- Extraire les informations clés du PRD : type de produit, domaine industriel, utilisateur cible
- Appeler le skill `ui-ux-pro-max` pour obtenir une recommandation complète du système de design
- Appliquer le système de design recommandé à `ui.schema.yaml` et au prototype

::: danger L'omission de cette étape entraînera un rejet
Le planificateur Sisyphus vérifiera si le skill ui-ux-pro-max a été utilisé. Sinon, les artefacts générés par l'UI Agent seront rejetés et devront être réexécutés.
:::

**Que contient le système de design** ?

```yaml
design_system:
  style: "Glassmorphism"           # Style choisi (comme glassmorphism, minimalisme)
  colors:
    primary: "#2563eb"             # Couleur primaire (utilisée pour les actions principales)
    secondary: "#64748b"           # Couleur secondaire
    success: "#10b981"             # Couleur de succès
    warning: "#f59e0b"             # Couleur d'avertissement
    error: "#ef4444"               # Couleur d'erreur
    background: "#ffffff"          # Couleur d'arrière-plan
    surface: "#f8fafc"            # Couleur de surface
    text:
      primary: "#1e293b"           # Texte principal
      secondary: "#64748b"         # Texte secondaire
  typography:
    font_family:
      headings: "DM Sans"          # Police de titres (éviter Inter)
      body: "DM Sans"              # Police de corps de texte
    font_size:
      base: 16
      lg: 18
      xl: 20
      2xl: 24
  spacing:
    unit: 8                        # Base d'espacement (grille 8px)
  border_radius:
    md: 8
    lg: 12
  effects:
    hover_transition: "200ms"      # Temps de transition hover
    blur: "backdrop-blur-md"       # Effet verre dépoli
```

### Étape 5 : Concevoir la structure de l'interface

L'assistant IA concevra l'architecture de l'information de l'interface (pages et composants) en fonction des exigences fonctionnelles du PRD.

**Exemple de structure d'interface** (tiré de `ui.schema.yaml`) :

```yaml
pages:
  - id: home
    title: "Accueil"
    type: list
    description: "Affiche la liste de tous les projets"
    components:
      - type: header
        content: "Mon application"
      - type: list
        source: "api/items"
        item_layout:
          - type: text
            field: "title"
            style: "heading"
          - type: text
            field: "description"
            style: "body"
        actions:
          - type: "navigate"
            target: "detail"
            params: ["id"]

  - id: detail
    title: "Détails"
    type: detail
    params:
      - name: "id"
        type: "number"

  - id: create
    title: "Créer"
    type: form
    fields:
      - name: "title"
        type: "text"
        label: "Titre"
        required: true
    submit:
      action: "post"
      endpoint: "/api/items"
      on_success: "navigate:home"
```

**Types de pages** :
- `list` : page de liste (comme page d'accueil, résultats de recherche)
- `detail` : page de détails (comme voir les détails du projet)
- `form` : page de formulaire (comme créer, modifier)

### Étape 6 : Créer le prototype de prévisualisation

L'assistant IA créera un prototype prévisualisable en utilisant HTML + CSS + JS, affichant les flux d'interaction clés.

**Caractéristiques du prototype** :
- Utilise des technologies natives (pas de dépendance de framework)
- Applique les couleurs, polices et effets recommandés par le système de design
- Tous les éléments cliquables ont un état hover et `cursor-pointer`
- Conception mobile-first (réactif correctement à 375px et 768px)
- Utilise des icônes SVG (Heroicons/Lucide), pas d'emoji

**Mode de prévisualisation** :
Ouvrez `artifacts/ui/preview.web/index.html` avec un navigateur pour voir le prototype.

### Étape 7 : Confirmer la sortie UI

Une fois l'UI Agent terminé, vous devez vérifier les fichiers de sortie.

**Point de contrôle ✅** :

1. **ui.schema.yaml existe-t-il ?**
   - ✅ Le fichier est dans le répertoire `artifacts/ui/`
   - ❌ Manquant ou chemin incorrect

2. **Le système de design a-t-il utilisé le skill ui-ux-pro-max ?**
   - ✅ Explicitement indiqué dans la sortie ou le schema
   - ❌ Système de design choisi par soi-même

3. **Le nombre de pages ne dépasse-t-il pas 3 pages ?**
   - ✅ 1-3 pages (MVP focalisé sur les fonctionnalités principales)
   - ❌ Plus de 3 pages

4. **Le prototype peut-il être ouvert dans le navigateur ?**
   - ✅ Ouvrir `preview.web/index.html` avec un navigateur s'affiche normalement
   - ❌ Impossible d'ouvrir ou erreur d'affichage

5. **A-t-on évité le style par défaut de l'IA ?**
   - ✅ Pas de dégradés violets/roses
   - ✅ Pas d'utilisation de la police Inter
   - ✅ Utilisation d'icônes SVG (pas d'emoji)
   - ❌ Apparition des styles IA ci-dessus

6. **Tous les éléments cliquables ont-ils un retour d'interaction ?**
   - ✅ Avoir `cursor-pointer` et état hover
   - ✅ Transition fluide (150-300ms)
   - ❌ Pas d'indication d'interaction ou changement instantané

### Étape 8 : Choisir continuer, réessayer ou mettre en pause

Après vérification, la CLI affichera les options :

```bash
Choisissez une action :
[1] Continuer (entrer dans l'étape Tech)
[2] Réessayer (régénérer l'UI)
[3] Mettre en pause (continuer plus tard)
```

::: tip Prévisualisez d'abord le prototype
Avant de confirmer dans l'assistant IA, ouvrez d'abord le prototype avec un navigateur, vérifiez si la conception correspond aux attentes. Une fois que vous entrez dans l'étape Tech, le coût de modification de la conception sera plus élevé.
:::

## Attention aux pièges

### Piège 1 : Non-utilisation du skill ui-ux-pro-max

**Exemple d'erreur** :
```
L'assistant IA a choisi par lui-même le style glassmorphism, le bleu
```

**Conséquence** : Le planificateur Sisyphus rejettera les artefacts et demandera une réexécution.

**Recommandation** :
```
L'assistant IA doit d'abord appeler le skill ui-ux-pro-max pour obtenir le système de design recommandé
```

### Piège 2 : Utilisation du style par défaut de l'IA

**Exemple d'erreur** :
- Arrière-plan avec dégradés violets/roses
- Polices Inter ou Roboto
- Emoji comme icônes UI

**Conséquence** : Conception non professionnelle, facilement identifiable comme générée par l'IA, affectant l'image du produit.

**Recommandation** :
- Choisir parmi les 57 combinaisons de polices recommandées par ui-ux-pro-max
- Utiliser des bibliothèques d'icônes SVG (Heroicons/Lucide)
- Éviter l'abus de dégradés et de couleurs néon

### Piège 3 : Nombre de pages supérieur à 3

**Exemple d'erreur** :
```
5 pages générées : accueil, détails, créer, modifier, paramètres
```

**Conséquence** : Portée MVP hors de contrôle, charge de travail considérablement accrue dans les étapes Tech et Code.

**Recommandation** : Limiter à 1-3 pages, focaliser sur le chemin d'utilisation principal.

### Piège 4 : Prototype sans retour d'interaction

**Exemple d'erreur** :
```
Les boutons n'ont pas d'état hover, les liens n'ont pas de cursor-pointer
```

**Conséquence** : Mauvaise expérience utilisateur, prototype irréaliste.

**Recommandation** : Ajouter `cursor-pointer` et état hover à tous les éléments cliquables (transition 150-300ms).

### Piège 5 : Contraste insuffisant en mode clair

**Exemple d'erreur** :
```
Couleur d'arrière-plan de carte en verre bg-white/10 (trop transparent), couleur de texte #94A3B8 (trop clair)
```

**Conséquence** : Contenu invisible en mode clair, accessibilité non conforme.

**Recommandation** :
- Mode clair de carte en verre : utiliser `bg-white/80` ou plus
- Contraste de texte >= 4.5:1 (standard WCAG AA)

### Piège 6 : Incohérence entre le prototype et le schema

**Exemple d'erreur** :
```
Le schema définit 2 pages, mais le prototype affiche 3 pages
```

**Conséquence** : Les étapes Tech et Code seront confuses, ne sachant pas lequel suivre.

**Recommandation** : Assurer la cohérence totale entre le prototype et le schema, le nombre de pages, la structure des composants doivent correspondre.

## Résumé de cette leçon

Le cœur de l'étape UI est le **système de design** :

1. **Entrée** : PRD document clair (`artifacts/prd/prd.md`)
2. **Processus** : L'assistant IA génère un système de design professionnel via le skill ui-ux-pro-max
3. **Sortie** : `ui.schema.yaml` (système de design + structure de l'interface) + `preview.web/index.html` (prototype prévisualisable)
4. **Validation** : Vérifier si le système de design est professionnel, si le prototype est prévisualisable, si on a évité le style par défaut de l'IA

::: tip Principes clés
- ❌ Ne pas faire : ne pas décider de la stack technique, ne pas écrire de code frontend, ne pas utiliser le style par défaut de l'IA
- ✅ Faire seulement : générer le système de design, concevoir la structure de l'interface, créer des prototypes prévisualisables
:::

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[Étape 4 : Tech - Conception de l'architecture technique](../stage-tech/)**.
>
> Vous apprendrez :
> - Comment concevoir l'architecture technique en fonction du PRD et de l'UI Schema
> - Comment choisir la stack technique appropriée (Express + Prisma + React Native)
> - Comment concevoir un modèle de données minimum viable (Prisma Schema)
> - Pourquoi l'étape Tech ne peut pas impliquer de détails de mise en œuvre UI

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-29

| Fonction | Chemin du fichier | Ligne |
| ------ | ------------------------------------------------------------- | ------- |
| Définition de l'UI Agent | [`agents/ui.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/ui.agent.md) | 1-98 |
| UI Skill | [`skills/ui/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/ui/skill.md) | 1-430 |
| Définition du pipeline (étape UI) | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 34-47 |
| Définition du planificateur | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 1-100+ |

**Contraintes clés** :
- **Utilisation obligatoire du skill ui-ux-pro-max** : ui.agent.md:33, 53-54
- **Interdiction des couleurs de style IA** : ui.agent.md:36
- **Interdiction des icônes emoji** : ui.agent.md:37
- **Obligation d'ajouter cursor-pointer et état hover** : ui.agent.md:38
- **Pages de prototype ne dépassant pas 3** : ui.agent.md:34
- **Utilisation de HTML/CSS/JS natif** : ui.agent.md:35

**Conditions de sortie** (pipeline.yaml:43-47) :
- ui.schema.yaml existe
- Le nombre de pages ne dépasse pas 3
- La page de prévisualisation peut être ouverte dans le navigateur
- L'Agent a utilisé le skill `ui-ux-pro-max` pour générer le système de design

**Cadre de contenu de l'UI Skill** :
- **Cadre de pensée** : objectif, ton, différenciation, architecture de l'information
- **Workflow de génération du système de design** : analyser les exigences → générer le système de design → compléter la recherche → obtenir le guide de la stack technique
- **67 styles UI** : minimalisme, néomorphisme, glassmorphism, brutalisme, etc.
- **Règles de raisonnement industriel** : 100 règles, recommandation automatique du système de design par type de produit
- **Guide du système de design** : système de couleurs, système de typographie, système d'espacement, normes de composants
- **Liste de vérification avant livraison** : qualité visuelle, interaction, mode clair/sombre, mise en page, accessibilité
- **Principes de décision** : guidé par l'objectif, mobile-first, accessibilité, simplicité limitée, cohérence de prévisualisation, priorité des outils
- **Ne jamais faire (NEVER)** : polices/couleurs de style IA, icônes emoji, faible contraste, plus de 3 pages, etc.

</details>

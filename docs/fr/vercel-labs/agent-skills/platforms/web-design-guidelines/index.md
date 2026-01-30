---
title: "Audit des Guidelines de Design Web : 100 Bonnes Pratiques d'Interface | Agent Skills"
sidebarTitle: "100 Règles pour l'UI"
subtitle: "Audit des Guidelines de Design Web"
description: "Apprenez à auditer l'accessibilité, les performances et l'UX avec les Guidelines de Design Web. Vérifiez les aria-labels, la validation des formulaires, les animations et le mode sombre avec 100 règles pour améliorer la qualité de l'interface."
tags:
  - "Accessibilité"
  - "UX"
  - "Code Review"
  - "Design Web"
order: 40
prerequisite:
  - "start-getting-started"
---

# Audit des Guidelines de Design Web

## Ce Que Vous Allez Apprendre

- 🎯 Faire auditer automatiquement le code UI par l'IA pour détecter les problèmes d'accessibilité, de performance et d'UX
- ♿ Appliquer les bonnes pratiques d'accessibilité web (WCAG) pour améliorer l'accessibilité du site
- ⚡ Optimiser les performances des animations et le chargement des images pour améliorer l'expérience utilisateur
- 🎨 Assurer une implémentation correcte du mode sombre et du design responsive
- 🔍 Corriger les anti-patterns UI courants (comme `transition: all`, aria-labels manquants, etc.)

## Votre Situation Actuelle

Vous écrivez des composants UI, mais quelque chose ne va pas :

- Le site passe les tests fonctionnels, mais vous ne savez pas s'il respecte les normes d'accessibilité
- Les animations sont lentes et les utilisateurs se plaignent de la latence de la page
- Certains éléments sont illisibles en mode sombre
- Le code généré par l'IA fonctionne, mais manque d'aria-labels ou de HTML sémantique
- Chaque revue de code nécessite de vérifier manuellement les règles de 17 catégories, ce qui est inefficace
- Vous ne savez pas quand utiliser les propriétés CSS comme `prefers-reduced-motion`, `tabular-nums`

En fait, l'équipe d'ingénierie de Vercel a déjà résumé un ensemble de **100** Guidelines de Design Web, couvrant tous les scénarios de l'accessibilité à l'optimisation des performances. Maintenant, ces règles sont intégrées dans les Agent Skills, vous pouvez laisser l'IA auditer et corriger automatiquement les problèmes UI pour vous.

::: info Qu'est-ce que les "Web Interface Guidelines"
Les Web Interface Guidelines sont un ensemble de standards de qualité UI de Vercel, comprenant 100 règles réparties en 17 catégories. Ces règles sont basées sur les normes d'accessibilité WCAG, les bonnes pratiques de performance et les principes de design UX, garantissant que la qualité des applications Web atteint le niveau de production.
:::

## Quand Utiliser Cette Technique

Scénarios typiques d'utilisation de la compétence Web Design Guidelines :

- ❌ **Non applicable** : Logique backend pure, pages de prototype simples (sans interaction utilisateur)
- ✅ **Applicable** :
  - Écrire de nouveaux composants UI (boutons, formulaires, cartes, etc.)
  - Implémenter des fonctionnalités interactives (modales, menus déroulants, drag & drop, etc.)
  - Revue de code ou refactoring de composants UI
  - Vérification de qualité UI avant mise en production
  - Correction des problèmes d'accessibilité ou de performance signalés par les utilisateurs

## 🎒 Préparation Avant de Commencer

::: warning Vérification Préalable
Avant de commencer, assurez-vous d'avoir :
1. Installé les Agent Skills (référez-vous au [Guide d'Installation](../../start/installation/))
2. Des connaissances de base en HTML/CSS/React
3. Un projet UI à auditer (peut être un composant unique ou une page entière)
:::

## Idée Principale

Les Guidelines de Design Web couvrent **17 catégories**, priorisées en trois blocs :

| Bloc de Catégories | Points d'Attention | Bénéfices Typiques |
| --- | --- | --- |
| **Accessibilité (Accessibility)** | Assurer l'accès à tous les utilisateurs (lecteurs d'écran, navigation clavier) | Conformité aux normes WCAG, élargissement de l'audience |
| **Performance & UX (Performance & UX)** | Optimiser la vitesse de chargement, la fluidité des animations, l'expérience interactive | Amélioration du taux de rétention, réduction du taux de rebond |
| **Complétude & Détails (Completeness)** | Mode sombre, responsive, validation des formulaires, gestion des erreurs | Réduction des plaintes utilisateurs, amélioration de l'image de marque |

**17 Catégories de Règles** :

| Catégorie | Règles Typiques | Priorité |
| --- | --- | --- |
| Accessibility | aria-labels, HTML sémantique, gestion clavier | ⭐⭐⭐ Plus Haute |
| Focus States | Focus visible, :focus-visible au lieu de :focus | ⭐⭐⭐ Plus Haute |
| Forms | autocomplete, validation, gestion des erreurs | ⭐⭐⭐ Plus Haute |
| Animation | prefers-reduced-motion, transform/opacity | ⭐⭐ Haute |
| Typography | Guillemets typographiques, ellipsis, tabular-nums | ⭐⭐ Haute |
| Content Handling | Troncature de texte, gestion des états vides | ⭐⭐ Haute |
| Images | dimensions, lazy loading, texte alternatif | ⭐⭐ Haute |
| Performance | virtualisation, preconnect, traitement par lots du DOM | ⭐⭐ Haute |
| Navigation & State | URL reflétant l'état, liens profonds | ⭐⭐ Haute |
| Touch & Interaction | touch-action, tap-highlight | ⭐ Moyenne |
| Safe Areas & Layout | Zones sûres, gestion des barres de défilement | ⭐ Moyenne |
| Dark Mode & Theming | color-scheme, meta theme-color | ⭐ Moyenne |
| Locale & i18n | Intl.DateTimeFormat, Intl.NumberFormat | ⭐ Moyenne |
| Hydration Safety | value + onChange, prévention du désalignement des cellules | ⭐ Moyenne |
| Hover & Interactive States | États hover, amélioration du contraste | ⭐ Moyenne |
| Content & Copy | Voix active, libellés de boutons spécifiques | ⭐ Basse |
| Anti-patterns | Signalement des erreurs courantes | ⭐⭐⭐ Plus Haute |

**Principes Fondamentaux** :
1. **Priorité aux problèmes d'accessibilité** — ceux-ci affectent l'utilisation par les personnes handicapées
2. **Les problèmes de performance commencent par les animations et les images** — ceux-ci affectent directement l'expérience utilisateur
3. **Les problèmes de complétude sont vérifiés en dernier** — mode sombre, internationalisation, etc.

## Suivez-Moi

### Étape 1 : Déclencher l'Audit UI par l'IA

Ouvrez votre projet UI (peut être un fichier de composant unique ou un répertoire entier), et saisissez dans Claude ou Cursor :

```
Review my UI components for accessibility and UX issues
```

Ou

```
Check accessibility of my site
```

Ou

```
Audit design and apply Web Interface Guidelines
```

**Ce Que Vous Devriez Voir** : L'IA activera la compétence `web-design-guidelines` et récupérera les 100 dernières règles depuis GitHub.

### Étape 2 : Spécifier les Fichiers à Auditer (si l'IA ne les détecte pas automatiquement)

Si l'IA demande quels fichiers auditer, vous pouvez :

```bash
# Auditer un fichier unique
src/components/Button.tsx

# Auditer plusieurs fichiers (séparés par des espaces)
src/components/Button.tsx src/components/Input.tsx

# Auditer tout un répertoire (mode glob)
src/components/**/*.tsx
```

### Étape 3 : L'IA Détecte Automatiquement les Problèmes

L'IA vérifie le code ligne par ligne, et produit des résultats d'audit au format `fichier:ligne` lorsqu'elle trouve des problèmes. Par exemple :

```typescript
// ❌ Votre code original (problèmes présents)
export function Button({ icon, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded hover:bg-gray-100 transition-all"
    >
      {icon}
    </button>
  )
}
```

**Résultat d'Audit de l'IA** :

```
## src/components/Button.tsx

src/components/Button.tsx:8 - icon button missing aria-label
src/components/Button.tsx:8 - animation missing prefers-reduced-motion
src/components/Button.tsx:8 - transition: all → list properties explicitly
src/components/Button.tsx:8 - button needs visible focus
```

**Code Corrigé Proposé par l'IA** :

```typescript
// ✅ Après correction
export function Button({ icon, onClick, ariaLabel }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="p-2 rounded hover:bg-gray-100 
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500
                motion-safe:hover:scale-105 active:scale-100
                motion-reduce:transition-none motion-reduce:transform-none"
    >
      {icon}
    </button>
  )
}
```

### Étape 4 : Exemples de Problèmes Courants

#### Problème 1 : Entrée de Formulaire Manquant label et autocomplete

```typescript
// ❌ Erreur : label et autocomplete manquants
<input
  type="text"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

```typescript
// ✅ Correct : inclut label, name, autocomplete
<label htmlFor="email" className="sr-only">
  Adresse email
</label>
<input
  id="email"
  type="email"
  name="email"
  autoComplete="email"
  placeholder="votre@email.com…"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

**Règles** :
- `Form Controls need <label> or aria-label`
- `Inputs need autocomplete and meaningful name`
- `Use correct type (email, tel, url, number) and inputmode`

#### Problème 2 : Animation Ne Tenant Pas Compte de `prefers-reduced-motion`

```css
/* ❌ Erreur : tous les utilisateurs voient l'animation, non adapté aux troubles vestibulaires */
.modal {
  transition: all 0.3s ease-in-out;
}
```

```css
/* ✅ Correct : respecte la préférence de réduction d'animation de l'utilisateur */
.modal {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

@media (prefers-reduced-motion: reduce) {
  .modal {
    transition: none;
  }
}
```

**Règles** :
- `Honor prefers-reduced-motion (provide reduced variant or disable)`
- `Never transition: all—list properties explicitly`

#### Problème 3 : Image Manquant dimensions et lazy loading

```typescript
// ❌ Erreur : provoque le Cumulative Layout Shift (CLS)
<img src="/hero.jpg" alt="Hero image" />
```

```typescript
// ✅ Correct : réserve l'espace à l'avance, évite les sauts de mise en page
<img
  src="/hero.jpg"
  alt="Hero : équipe travaillant ensemble"
  width={1920}
  height={1080}
  loading="lazy"
  fetchpriority="high"  // Pour les images critiques au-dessus de la ligne de flottaison
/>
```

**Règles** :
- `<img> needs explicit width and height (prevents CLS)`
- `Below-fold images: loading="lazy"`
- `Above-fold critical images: priority or fetchpriority="high"`

#### Problème 4 : Mode Sombre Ne Définissant Pas `color-scheme`

```html
<!-- ❌ Erreur : les contrôles natifs (comme select, input) restent blancs en mode sombre -->
<html>
  <body>
    <select>...</select>
  </body>
</html>
```

```html
<!-- ✅ Correct : les contrôles natifs s'adaptent automatiquement au thème sombre -->
<html class="dark">
  <head>
    <meta name="theme-color" content="#0f172a" />
  </head>
  <body style="color-scheme: dark">
    <select style="background-color: #1e293b; color: #e2e8f0">
      ...
    </select>
  </body>
</html>
```

**Règles** :
- `color-scheme: dark on <html> for dark themes (fixes scrollbar, inputs)`
- `<meta name="theme-color"> matches page background`
- `Native <select>: explicit background-color and color (Windows dark mode)`

#### Problème 5 : Navigation Clavier Incomplète

```typescript
// ❌ Erreur : seul le clic souris fonctionne, les utilisateurs clavier ne peuvent pas utiliser
<div onClick={handleClick} className="cursor-pointer">
  Cliquez-moi
</div>
```

```typescript
// ✅ Correct : supporte la navigation clavier (Entrée/Espace déclenche)
<button
  onClick={handleClick}
  className="cursor-pointer"
  // Support clavier automatique, pas de code supplémentaire nécessaire
>
  Cliquez-moi
</button>

// Ou si vous devez utiliser div, ajoutez le support clavier :
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleClick()
    }
  }}
  onClick={handleClick}
  className="cursor-pointer"
>
  Cliquez-moi
</div>
```

**Règles** :
- `Interactive elements need keyboard handlers (onKeyDown/onKeyUp)`
- `<button>` for actions, `<a>`/`<Link>` for navigation (not `<div onClick>`)
- `Icon-only buttons need aria-label`

#### Problème 6 : Longues Listes Non Virtualisées

```typescript
// ❌ Erreur : rend 1000 éléments, provoque la latence de la page
function UserList({ users }: { users: User[] }) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

```typescript
// ✅ Correct : utilise le défilement virtuel, ne rend que les éléments visibles
import { useVirtualizer } from '@tanstack/react-virtual'

function UserList({ users }: { users: User[] }) {
  const parentRef = useRef<HTMLUListElement>(null)

  const virtualizer = useVirtualizer({
    count: users.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,  // Hauteur de chaque élément
    overscan: 5,  // Pré-rendu de quelques éléments pour éviter les vides
  })

  return (
    <ul ref={parentRef} className="h-96 overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {users[virtualItem.index].name}
          </div>
        ))}
      </div>
    </ul>
  )
}
```

**Règles** :
- `Large lists (>50 items): virtualize (virtua, content-visibility: auto)`

#### Problème 7 : Colonnes Numériques N'Utilisant Pas `tabular-nums`

```css
/* ❌ Erreur : largeur des chiffres non fixe, provoque des sauts d'alignement */
.table-cell {
  font-family: system-ui;
}
```

```css
/* ✅ Correct : chiffres à largeur fixe, alignement stable */
.table-cell.number {
  font-variant-numeric: tabular-nums;
}
```

**Règles** :
- `font-variant-numeric: tabular-nums for number columns/comparisons`

### Étape 5 : Corriger les Anti-Patterns Courants

L'IA marquera automatiquement ces anti-patterns :

```typescript
// ❌ Collection d'anti-patterns
const BadComponent = () => (
  <div>
    {/* Anti-pattern 1: transition: all */}
    <div className="transition-all hover:scale-105">...</div>

    {/* Anti-pattern 2: bouton icône manquant aria-label */}
    <button onClick={handleClose}>✕</button>

    {/* Anti-pattern 3: empêcher le collage */}
    <Input onPaste={(e) => e.preventDefault()} />

    {/* Anti-pattern 4: outline-none sans alternative de focus */}
    <button className="focus:outline-none">...</button>

    {/* Anti-pattern 5: image manquant dimensions */}
    <img src="/logo.png" alt="Logo" />

    {/* Anti-pattern 6: utilisation de div au lieu de button */}
    <div onClick={handleClick}>Submit</div>

    {/* Anti-pattern 7: format de date codé en dur */}
    <Text>{formatDate(new Date(), 'MM/DD/YYYY')}</Text>

    {/* Anti-pattern 8: autofocus sur mobile */}
    <input autoFocus />

    {/* Anti-pattern 9: user-scalable=no */}
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />

    {/* Anti-pattern 10: grande liste non virtualisée */}
    {largeList.map((item) => (<Item key={item.id} {...item} />))}
  </div>
)
```

```typescript
// ✅ Après correction
const GoodComponent = () => (
  <div>
    {/* Correction 1: lister explicitement les propriétés de transition */}
    <div className="transition-transform hover:scale-105">...</div>

    {/* Correction 2: bouton icône incluant aria-label */}
    <button onClick={handleClose} aria-label="Fermer la boîte de dialogue">✕</button>

    {/* Correction 3: autoriser le collage */}
    <Input />

    {/* Correction 4: utiliser focus-visible */}
    <button className="focus:outline-none focus-visible:ring-2">...</button>

    {/* Correction 5: image incluant dimensions */}
    <img src="/logo.png" alt="Logo" width={120} height={40} />

    {/* Correction 6: utiliser un bouton sémantique */}
    <button onClick={handleClick}>Submit</button>

    {/* Correction 7: utiliser Intl pour le formatage */}
    <Text>{new Intl.DateTimeFormat('fr-FR').format(new Date())}</Text>

    {/* Correction 8: autoFocus uniquement sur desktop */}
    <input autoFocus={isDesktop} />

    {/* Correction 9: autoriser le zoom */}
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    {/* Correction 10: virtualisation */}
    <VirtualList items={largeList}>{(item) => <Item {...item} />}</VirtualList>
  </div>
)
```

## Points de Vérification ✅

Après avoir terminé les étapes ci-dessus, vérifiez que vous maîtrisez :

- [ ] Comment déclencher l'audit des Guidelines de Design Web par l'IA
- [ ] L'importance de l'accessibilité (Accessibilité priorité maximale)
- [ ] Comment ajouter aria-label et HTML sémantique
- [ ] Le rôle de `prefers-reduced-motion`
- [ ] Comment optimiser le chargement des images (dimensions, lazy loading)
- [ ] L'implémentation correcte du mode sombre (`color-scheme`)
- [ ] La capacité à identifier les anti-patterns UI courants dans le code

## Pièges à Éviter

### Piège 1 : Se Concentrer Uniquement sur le Visuel, Ignorer l'Accessibilité

::: warning L'accessibilité n'est pas optionnelle
L'accessibilité est une exigence légale (comme ADA, WCAG) et une responsabilité sociale.

**Omissions Courantes** :
- Boutons icônes manquant `aria-label`
- Contrôles personnalisés (comme les menus déroulants) ne supportant pas le clavier
- Entrées de formulaire manquant `<label>`
- Mises à jour asynchrones (comme Toast) manquant `aria-live="polite"`
:::

### Piège 2 : Utilisation Excessive de `transition: all`

::: danger Tueur de Performance
`transition: all` surveille les changements de toutes les propriétés CSS, forçant le navigateur à recalculer de nombreuses valeurs.

**Utilisation Incorrecte** :
```css
.card {
  transition: all 0.3s ease;  // ❌ Transitionnera background, color, transform, padding, margin, etc.
}
```

**Utilisation Correcte** :
```css
.card {
  transition: transform 0.3s ease, opacity 0.3s ease;  // ✅ Ne transitionne que les propriétés nécessaires
}
```
:::

### Piège 3 : Oublier l'Alternative à `outline`

::: focus-visible n'est pas optionnel
Après avoir supprimé le `outline` par défaut, vous devez fournir un style de focus visible, sinon les utilisateurs clavier ne peuvent pas savoir où se trouve le focus.

**Mauvaise Pratique** :
```css
button {
  outline: none;  // ❌ Supprime complètement le focus
}
```

**Bonne Pratique** :
```css
button {
  outline: none;  /* Supprime le contour par défaut peu esthétique */
}

button:focus-visible {
  ring: 2px solid blue;  /* ✅ Ajoute un style de focus personnalisé (uniquement lors de la navigation clavier) */
}

button:focus {
  /* Ne s'affiche pas lors du clic souris (car focus-visible = false) */
}
```
:::

### Piège 4 : Image Manquant `alt` ou `dimensions`

::: CLS fait partie des Core Web Vitals
L'absence de `width` et `height` provoque des sauts de mise en page lors du chargement, affectant l'expérience utilisateur et le SEO.

**Rappelez-vous** :
- Images décoratives : utilisez `alt=""` (chaîne vide)
- Images informatives : utilisez un `alt` descriptif (comme "Photo d'équipe : Alice et Bob")
- Toutes les images incluent `width` et `height`
:::

### Piège 5 : Format Codé en Dur pour l'Internationalisation (i18n)

::: Utilisez l'API Intl
Ne codez pas en dur les formats de date, nombre, devise, utilisez l'API `Intl` intégrée au navigateur.

**Mauvaise Pratique** :
```typescript
const formattedDate = formatDate(date, 'MM/DD/YYYY')  // ❌ Format américain, confusant pour d'autres pays
```

**Bonne Pratique** :
```typescript
const formattedDate = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
}).format(date)  // ✅ Utilise automatiquement la locale de l'utilisateur
```
:::

## Résumé du Cours

Principes fondamentaux des Guidelines de Design Web :

1. **Accessibilité Prioritaire** : Assurer l'accès à tous les utilisateurs (clavier, lecteurs d'écran)
2. **Optimisation des Performances** : Animations avec `transform/opacity`, lazy loading des images, virtualisation des longues listes
3. **Respect des Préférences Utilisateur** : `prefers-reduced-motion`, `color-scheme`, autoriser le zoom
4. **HTML Sémantique** : Utiliser `<button>`, `<label>`, `<input>` plutôt que `<div>`
5. **Vérification de Complétude** : Mode sombre, internationalisation, validation des formulaires, gestion des erreurs
6. **Audit Automatisé par l'IA** : Laissez les Agent Skills découvrir et corriger les 100 règles pour vous

Les 100 règles de Vercel couvrent tous les scénarios du basique au détail. Apprendre à déclencher l'IA pour appliquer ces règles fera atteindre à votre qualité UI le niveau de production.

## Aperçu de la Leçon Suivante

Ensuite, nous apprenons le **[Déploiement en Un Clic sur Vercel](../vercel-deploy/)**.

Vous apprendrez :
- Comment déployer un projet en un clic sur Vercel (supporte 40+ frameworks)
- Détection automatique du type de framework (Next.js, Vue, Svelte, etc.)
- Obtenir le lien de prévisualisation et le lien de transfert de propriété

---

## Annexe : Référence du Code Source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-25

| Fonctionnalité | Chemin du Fichier | Ligne |
| --- | --- | --- |
| Définition de la compétence Web Design Guidelines | [`skills/web-design-guidelines/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md) | Entier |
| Source des Règles (100 règles) | [`https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) | Entier |
| Vue d'ensemble README | [`README.md`](https://github.com/vercel-labs/agent-skills/blob/main/README.md) | 28-50 |

**17 Catégories de Règles** :

| Catégorie | Nombre de Règles | Règles Typiques |
| --- | --- | --- |
| Accessibility | 10 règles | aria-labels, HTML sémantique, gestion clavier |
| Focus States | 4 règles | Focus visible, :focus-visible |
| Forms | 11 règles | autocomplete, validation, gestion des erreurs |
| Animation | 6 règles | prefers-reduced-motion, transform/opacity |
| Typography | 6 règles | Guillemets typographiques, ellipsis, tabular-nums |
| Content Handling | 4 règles | Troncature de texte, gestion des états vides |
| Images | 3 règles | dimensions, lazy loading, texte alternatif |
| Performance | 6 règles | virtualisation, preconnect, traitement par lots |
| Navigation & State | 4 règles | URL reflétant l'état, liens profonds |
| Touch & Interaction | 5 règles | touch-action, tap-highlight |
| Safe Areas & Layout | 3 règles | Zones sûres, gestion des barres de défilement |
| Dark Mode & Theming | 3 règles | color-scheme, theme-color |
| Locale & i18n | 3 règles | Intl.DateTimeFormat, Intl.NumberFormat |
| Hydration Safety | 3 règles | value + onChange, prévention du désalignement |
| Hover & Interactive States | 2 règles | États hover, contraste |
| Content & Copy | 7 règles | Voix active, libellés de boutons spécifiques |
| Anti-patterns | 20 règles | Signalement des erreurs courantes |

**Constantes Clés** :
- `RULE_SOURCE_URL = "https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md"` : Source de récupération des règles
- `version = "1.0.0"` : Numéro de version de la compétence (SKILL.md)

**Flux de Travail** :
1. `SKILL.md:23-27` : Récupérer les dernières règles depuis GitHub
2. `SKILL.md:31-38` : Lire les fichiers utilisateur et appliquer toutes les règles
3. `SKILL.md:39` : Si aucun fichier n'est spécifié, demander à l'utilisateur

**Mots-Clés de Déclenchement** :
- "Review my UI"
- "Check accessibility"
- "Audit design"
- "Review UX"
- "Check my site against best practices"

</details>

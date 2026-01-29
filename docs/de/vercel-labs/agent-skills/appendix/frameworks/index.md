---
title: "Frameworks: 40+ Deployment-Optionen | Agent Skills"
sidebarTitle: "Frameworks"
subtitle: "Frameworks: 40+ Deployment-Optionen"
description: "Sehen Sie die vollständige Liste der von Agent Skills Vercel Deploy unterstützten Frameworks. Deckt 40+ Frontend-Frameworks ab, einschließlich React, Vue, Svelte, Angular. Enthält Erkennungsprinzipien."
tags:
  - "Frameworks"
  - "Deployment"
  - "Kompatibilität"
  - "Referenz"
prerequisite: []
---

# Unterstützte Framework-Liste

## Was Sie nach diesem Kurs können

- Vollständige Liste der von Vercel Deploy unterstützten Frameworks kennen (45+)
- Verstehen Sie das Funktionsprinzip der Framework-Erkennung
- Beurteilen, ob Ihr Projekt Ein-Klick-Deployment unterstützt
- Prioritätsregeln der Framework-Erkennung ansehen

## Kernkonzept

Vercel Deploy-Skill scannt die `dependencies`- und `devDependencies`-Abhängigkeiten der Datei `package.json` Ihres Projekts, prüft逐一 vordefinierte Framework-Merkmalspaketnamen, um zu beurteilen, welches Framework das Projekt verwendet.

**Erkennung in Prioritätsreihenfolge**: Vom spezifischsten Framework zum allgemeinsten, um Fehleinschätzungen zu vermeiden. Zum Beispiel:
1. Prüfen auf `next` → Übereinstimmung mit Next.js
2. Selbst wenn `react` gleichzeitig vorhanden ist, wird es als Next.js priorisiert erkannt

::: tip Erkennungsbereich

Die Erkennung prüft gleichzeitig `dependencies` und `devDependencies`, daher werden auch Frameworks erkannt, die nur als Entwicklungsabhängigkeit installiert wurden.

:::

## Vollständige Framework-Liste

### React-Ökosystem

| Framework | Erkennungsabhängigkeit | Rückgabewert |
|--- | --- | ---|
| **Next.js** | `next` | `nextjs` |
| **Gatsby** | `gatsby` | `gatsby` |
| **Remix** | `@remix-run/` | `remix` |
| **React Router** | `@react-router/` | `react-router` |
| **Blitz** | `blitz` | `blitzjs` |
| **Create React App** | `react-scripts` | `create-react-app` |
| **Ionic React** | `@ionic/react` | `ionic-react` |
| **Preact** | `preact` | `preact` |

### Vue-Ökosystem

| Framework | Erkennungsabhängigkeit | Rückgabewert |
|--- | --- | ---|
| **Nuxt** | `nuxt` | `nuxtjs` |
| **VitePress** | `vitepress` | `vitepress` |
| **VuePress** | `vuepress` | `vuepress` |
| **Gridsome** | `gridsome` | `gridsome` |

### Svelte-Ökosystem

| Framework | Erkennungsabhängigkeit | Rückgabewert |
|--- | --- | ---|
| **SvelteKit** | `@sveltejs/kit` | `sveltekit-1` |
| **Svelte** | `svelte` | `svelte` |
| **Sapper** (legacy) | `sapper` | `sapper` |

### Angular

| Framework | Erkennungsabhängigkeit | Rückgabewert |
|--- | --- | ---|
| **Angular** | `@angular/core` | `angular` |
| **Ionic Angular** | `@ionic/angular` | `ionic-angular` |

### Statische Site-Generatoren

| Framework | Erkennungsabhängigkeit | Rückgabewert |
|--- | --- | ---|
| **Astro** | `astro` | `astro` |
| **Docusaurus** | `@docusaurus/core` | `docusaurus-2` |
| **Hexo** | `hexo` | `hexo` |
| **Eleventy** | `@11ty/eleventy` | `eleventy` |
| **RedwoodJS** | `@redwoodjs/` | `redwoodjs` |

### Node.js-Backend-Frameworks

| Framework | Erkennungsabhängigkeit | Rückgabewert |
|--- | --- | ---|
| **Express** | `express` | `express` |
| **NestJS** | `@nestjs/core` | `nestjs` |
| **Hono** | `hono` | `hono` |
| **Fastify** | `fastify` | `fastify` |
| **Elysia** | `elysia` | `elysia` |
| **h3** | `h3` | `h3` |
| **Nitro** | `nitropack` | `nitro` |

### Andere Frameworks

| Framework | Erkennungsabhängigkeit | Rückgabewert |
|--- | --- | ---|
| **SolidStart** | `@solidjs/start` | `solidstart-1` |
| **Ember** | `ember-cli`, `ember-source` | `ember` |
| **Dojo** | `@dojo/framework` | `dojo` |
| **Polymer** | `@polymer/` | `polymer` |
| **Stencil** | `@stencil/core` | `stencil` |
| **UmiJS** | `umi` | `umijs` |
| **Saber** | `saber` | `saber` |
| **Sanity** | `sanity`, `@sanity/` | `sanity` oder `sanity-v3` |
| **Storybook** | `@storybook/` | `storybook` |
| **Hydrogen** (Shopify) | `@shopify/hydrogen` | `hydrogen` |
| **TanStack Start** | `@tanstack/start` | `tanstack-start` |

### Build-Tools

| Framework | Erkennungsabhängigkeit | Rückgabewert |
|--- | --- | ---|
| **Vite** | `vite` | `vite` |
| **Parcel** | `parcel` | `parcel` |

### Statische HTML-Projekte

Wenn Ihr Projekt **keine** `package.json` hat (reine statische Website), gibt die Framework-Erkennung `null` zurück.

Das Deployment-Skript behandelt dies intelligent:
- Automatische Erkennung von `.html`-Dateien im Stammverzeichnis
- Wenn nur eine `.html`-Datei vorhanden ist und diese nicht `index.html` heißt, wird sie automatisch in `index.html` umbenannt
- Direktes Hosting als statische Website auf Vercel

## Framework-Erkennungsprinzip

### Erkennungsablauf

```
package.json lesen
    ↓
dependencies und devDependencies scannen
    ↓
In Prioritätsreihenfolge vordefinierte Paketnamen abgleichen
    ↓
Erste Übereinstimmung gefunden → Rückgabe des entsprechenden Framework-Identifikators
    ↓
Keine Übereinstimmung gefunden → Rückgabe von null (statisches HTML-Projekt)
```

### Erkennungsreihenfolge

Die Erkennung ist nach der Spezifität von Frameworks sortiert, **bevorzugt spezifischere Frameworks**:

## Zusammenfassung

Agent Skills Vercel Deploy-Funktion unterstützt **45+ Frameworks**, deckt alle gängigen Frontend-Technologiestacks ab:

**Kernwerte**:
- ✅ Breite Framework-Unterstützung, React/Vue/Svelte/Angular vollständig abgedeckt
- ✅ Intelligente Framework-Erkennung, automatische Erkennung des Projekttyps
- ✅ Unterstützung statischer HTML-Projekte, Deployment ohne Abhängigkeiten
- ✅ Open-Source, erweiterbar für neue Frameworks

**Erkennungsprinzip**:
- Scan der `dependencies` und `devDependencies` von package.json
- Abgleich vordefinierter Framework-Merkmalspaketnamen in Prioritätsreihenfolge
- Rückgabe des entsprechenden Framework-Identifikators zur Verwendung durch Vercel

**Nächste Schritte**:
Lesen Sie das [Vercel Ein-Klick-Deployment-Tutorial](../../platforms/vercel-deploy/), um zu erfahren, wie Sie diese Funktion verwenden.

---

## Anhang: Quellcodereferenz

<details>
<summary><strong>Klicken zum Anzeigen der Quellcodepositionen</strong></summary>

> Aktualisierungszeit: 2026-01-25

| Funktion        | Dateipfad                                                                                             | Zeilen    |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|

**Wichtige Funktion**:
- `detect_framework()`: Erkennt 45+ Frameworks aus package.json (11-156 Zeilen)

</details>

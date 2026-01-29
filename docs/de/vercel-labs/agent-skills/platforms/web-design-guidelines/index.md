---
title: "Web-Design-Richtlinien: 100+ Regeln | Agent Skills"
sidebarTitle: "Web-Design-Richtlinien"
subtitle: "Web-Design-Richtlinien: 100+ Regeln"
description: "Lernen Sie Web-Design-Richtlinien für Barrierefreiheit und UX. Mit 100 Regeln prüfen Sie aria-labels, Formulare, Animationen und Dark Mode, verbessern Sie die Interface-Qualität."
tags:
  - "Barrierefreiheit"
  - "UX"
  - "Codeüberprüfung"
  - "Web-Design"
prerequisite:
  - "start-getting-started"
---

# Web-Interface-Design-Richtlinien-Prüfung

## Was Sie nach diesem Kurs können

- 🎯 Lassen Sie die KI automatisch UI-Code auf Barrierefreiheit, Performance- und UX-Probleme prüfen
- ♿ Wenden Sie Web-Accessibility (WCAG) Best Practices an, verbessern Sie die Website-Barrierefreiheit
- ⚡ Optimieren Sie Animationsperformance und Bildladen, verbessern Sie die User Experience
- 🎨 Stellen Sie sicher, dass Dark Mode und Responsive Design korrekt implementiert sind
- 🔍 Beheben Sie häufige UI-Antipatterns (wie `transition: all`, fehlende aria-labels usw.)

## Ihre aktuelle Herausforderung

Sie haben UI-Komponenten geschrieben, aber etwas fühlt sich nicht ganz richtig:

- Die Website hat die Funktionstests bestanden, aber Sie wissen nicht, ob sie Barrierefreiheitsstandards erfüllt
- Die Animationsperformance ist schlecht, Benutzer melden ruckelnde Seiten
- Im Dark Mode sind einige Elemente nicht klar erkennbar
- Der von der KI generierte Code funktioniert, aber fehlt notwendige aria-labels oder semantisches HTML
- Jede Codeüberprüfung erfordert die manuelle Überprüfung von 17 Kategorien von Regeln, was ineffizient ist
- Sie wissen nicht, wann man CSS-Eigenschaften wie `prefers-reduced-motion`, `tabular-nums` verwenden soll

Tatsächlich hat das Vercel-Engineering-Team bereits einen Satz von **100** Web-Interface-Design-Richtlinien zusammengestellt, die alle Szenarien von der Barrierefreiheit bis zur Performance-Optimierung abdecken. Diese Regeln sind nun in Agent Skills verpackt, und Sie können die KI automatisch UI-Probleme prüfen und beheben lassen.

::: info Was sind "Web Interface Guidelines"
Web Interface Guidelines ist eine Sammlung von UI-Qualitätsstandards von Vercel, die 100 Regeln in 17 Kategorien umfasst. Diese Regeln basieren auf WCAG-Barrierefreiheitsstandards, Performance-Best Practices und UX-Designprinzipien und stellen sicher, dass Web-Anwendungen Produktionsqualität erreichen.
:::

## Wann man diesen Ansatz anwendet

Typische Szenarien für die Verwendung der Web-Interface-Design-Richtlinien-Skills:

- ❌ **Nicht geeignet**: Reine Backend-Logik, einfache Prototypseiten (ohne Benutzerinteraktion)
- ✅ **Geeignet**:
  - Schreiben neuer UI-Komponenten (Buttons, Formulare, Karten usw.)
  - Implementierung interaktiver Funktionen (Modals, Dropdown-Menüs, Drag-and-Drop usw.)
  - Codeüberprüfung oder Refactoring von UI-Komponenten
  - UI-Qualitätsprüfung vor dem Launch
  - Behebung von Benutzerfeedback zu Barrierefreiheit oder Performance

## 🎒 Vorbereitungen vor dem Start

::: warning Vorab-Überprüfung
Vergewissern Sie sich vor dem Start, dass Sie bereits:
1. Agent Skills installiert haben (siehe [Installationsanleitung](../../start/installation/))
2. Grundlegende HTML/CSS/React-Kenntnisse besitzen
3. Ein UI-Projekt zur Prüfung haben (kann eine einzelne Komponente oder eine ganze Seite sein)
:::

## Kernkonzept

Web-Interface-Design-Richtlinien umfassen **17 Kategorien**, die nach Priorität in drei Blöcke unterteilt sind:

| Kategorienblock | Fokus | Typische Gewinne |
|--- | --- | ---|
| **Barrierefreiheit (Accessibility)** | Stellen sicher, dass alle Benutzer die Website nutzen können (inklusive Screen Reader, Tastaturbenutzer) | Erfüllung von WCAG-Standards, Erweiterung der Benutzerbasis |
| **Performance & UX** | Optimieren der Ladegeschwindigkeit, Animationsflüssigkeit, Interaktions-Erfahrung | Erhöhung der Benutzerbindung, Reduzierung der Absprungrate |
| **Vollständigkeit & Details** | Dark Mode, Responsive, Formularvalidierung, Fehlerbehandlung | Reduzierung von Benutzerbeschwerden, Verbesserung des Markenimages |

**17 Regelkategorien**:

| Kategorie | Typische Regeln | Priorität |
|--- | --- | ---|
| Accessibility | aria-labels, semantisches HTML, Tastaturbehandlung | ⭐⭐⭐ Höchste |
| Focus States | Sichtbarer Focus, :focus-visible statt :focus | ⭐⭐⭐ Höchste |
| Forms | Autocomplete, Validierung, Fehlerbehandlung | ⭐⭐⭐ Höchste |
| Animation | prefers-reduced-motion, transform/opacity | ⭐⭐ Hoch |
| Typography | curly quotes, ellipsis, tabular-nums | ⭐⭐ Hoch |
| Content Handling | Textabschnitt, Leere-Status-Behandlung | ⭐⭐ Hoch |
| Images | Maße, Lazy Loading, Alt-Texte | ⭐⭐ Hoch |
| Performance | Virtualisierung, Preconnect, Batch-DOM-Operationen | ⭐⭐ Hoch |
| Navigation & State | URL spiegelt Status wider, Deep-Links | ⭐⭐ Hoch |
| Touch & Interaction | touch-action, Tap-Highlight | ⭐ Mittel |
| Safe Areas & Layout | Sichere Bereiche, Scrollbar-Behandlung | ⭐ Mittel |
| Dark Mode & Theming | color-scheme, theme-color meta | ⭐ Mittel |
| Locale & i18n | Intl.DateTimeFormat, Intl.NumberFormat | ⭐ Mittel |
| Hydration Safety | value + onChange, Verhinderung von Einzelzellfehlern | ⭐ Mittel |
| Hover & Interactive States | Hover-Zustände, Kontrasterhöhung | ⭐ Mittel |
| Content & Copy | Aktiv-Status, spezifische Button-Labels | ⭐ Niedrig |
| Anti-patterns | Flag häufige Fehlermuster | ⭐⭐⭐ Höchste |

**Kernprinzipien**:
1. **Priorisieren Sie Behebung von Accessibility-Problemen** – diese beeinflussen die Nutzung durch benachteiligte Benutzer
2. **Performance-Probleme beginnen mit Animationen und Bildern** – diese beeinflussen direkt die User Experience
3. **Vollständigkeitsprobleme zuletzt prüfen** – Dark Mode, Internationalisierung, Details

## Schritt-für-Schritt-Anleitung

### Schritt 1: KI-UI-Prüfung auslösen

Öffnen Sie Ihr UI-Projekt (kann eine einzelne Komponentendatei oder ein ganzes Verzeichnis sein) und geben Sie in Claude oder Cursor ein:

```
Review my UI components for accessibility and UX issues
```

oder

```
Check accessibility of my site
```

oder

```
Audit design and apply Web Interface Guidelines
```

**Sie sollten sehen**: Die KI wird den Skill `web-design-guidelines` aktivieren und die neuesten 100 Regeln von GitHub abrufen.

### Schritt 2: Zu prüfende Dateien spezifizieren (falls die KI nicht automatisch erkennt)

Wenn die KI fragt, welche Dateien Sie prüfen möchten, können Sie:

```bash
# Prüfen einer einzelnen Datei
src/components/Button.tsx

# Prüfen mehrerer Dateien (durch Leerzeichen getrennt)
src/components/Button.tsx src/components/Input.tsx

# Prüfen eines ganzen Verzeichnisses (mit Glob-Muster)
src/components/**/*.tsx
```

### Schritt 3: KI erkennt automatisch Probleme

Die KI prüft den Code Zeile für Zeile und gibt bei Problemen Prüfergebnisse im Format `file:line` aus. Zum Beispiel:

```typescript
// ❌ Ihr ursprünglicher Code (hat ein Problem)
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

**Prüfergebnis der KI**:

```
## src/components/Button.tsx

src/components/Button.tsx:8 - icon button missing aria-label
src/components/Button.tsx:8 - animation missing prefers-reduced-motion
src/components/Button.tsx:8 - transition: all → list properties explicitly
src/components/Button.tsx:8 - button needs visible focus
```

**Der von der KI reparierte Code**:

```typescript
// ✅ Repariert
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

### Schritt 4: Häufige Problembeispiele

#### Problem 1: Formulareingabe fehlt Label und Autocomplete

```typescript
// ❌ Falsch: Fehlendes Label und Autocomplete
<input
  type="text"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

```typescript
// ✅ Richtig: Beinhaltet Label, Name, Autocomplete
<label htmlFor="email" className="sr-only">
  Email address
</label>
<input
  id="email"
  type="email"
  name="email"
  autoComplete="email"
  placeholder="your@email.com…"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

**Regeln**:
- `Form Controls need <label> or aria-label`
- `Inputs need autocomplete and meaningful name`
- `Use correct type (email, tel, url, number) and inputmode`

#### Problem 2: Animation beachtet nicht `prefers-reduced-motion`

```css
/* ❌ Falsch: Alle Benutzer sehen die Animation, nicht freundlich für Benutzer mit vestibulären Störungen */
.modal {
  transition: all 0.3s ease-in-out;
}
```

```css
/* ✅ Richtig: Respektiert die Präferenz des Benutzers für reduzierte Animationen */
.modal {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

@media (prefers-reduced-motion: reduce) {
  .modal {
    transition: none;
  }
}
```

**Regeln**:
- `Honor prefers-reduced-motion (provide reduced variant or disable)`
- `Never transition: all—list properties explicitly`

#### Problem 3: Bildern fehlen Maße und Lazy Loading

```typescript
// ❌ Falsch: Verursacht Cumulative Layout Shift (CLS)
<img src="/hero.jpg" alt="Hero image" />
```

```typescript
// ✅ Richtig: Platz reserviert, verhindert Layout-Shifts
<img
  src="/hero.jpg"
  alt="Hero: team working together"
  width={1920}
  height={1080}
  loading="lazy"
  fetchpriority="high"  // Für über dem Fold kritische Bilder
/>
```

**Regeln**:
- `<img> needs explicit width and height (prevents CLS)`
- `Below-fold images: loading="lazy"`
- `Above-fold critical images: priority or fetchpriority="high"`

#### Problem 4: Dark Mode ohne `color-scheme`

```html
<!-- ❌ Falsch: Im Dark Mode sind native Steuerelemente (wie select, input) noch weiß -->
<html>
  <body>
    <select>...</select>
  </body>
</html>
```

```html
<!-- ✅ Richtig: Native Steuerelemente passen automatisch Dark Theme an -->
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

**Regeln**:
- `color-scheme: dark on <html> for dark themes (fixes scrollbar, inputs)`
- `<meta name="theme-color"> matches page background`
- `Native <select>: explicit background-color and color (Windows dark mode)`

#### Problem 5: Unvollständige Tastaturnavigation

```typescript
// ❌ Falsch: Nur mit der Maus klickbar, Tastaturbenutzer können nicht verwenden
<div onClick={handleClick} className="cursor-pointer">
  Click me
</div>
```

```typescript
// ✅ Richtig: Tastaturnavigation unterstützt (Enter/Space auslöst)
<button
  onClick={handleClick}
  className="cursor-pointer"
  // Tastaturunterstützung automatisch, kein zusätzlicher Code erforderlich
>
  Click me
</button>

// Oder wenn Sie div verwenden müssen, fügen Sie Tastaturunterstützung hinzu:
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
  Click me
</div>
```

**Regeln**:
- `Interactive elements need keyboard handlers (onKeyDown/onKeyUp)`
- `<button>` für Aktionen, `<a>`/`<Link>` für Navigation (nicht `<div onClick>`)
- `Icon-only buttons need aria-label`

## Kontrollpunkt ✅

Nach Abschluss der oben genannten Schritte überprüfen Sie, ob Sie Folgendes verstanden haben:

- [ ] Wissen Sie, wie man die KI für eine Web-Interface-Design-Richtlinien-Prüfung auslöst
- [ ] Verstehen Sie die Bedeutung der Barrierefreiheit (Accessibility) (Accessibility hat höchste Priorität)
- [ ] Wissen Sie, wie man aria-labels und semantisches HTML hinzufügt
- [ ] Verstehen Sie die Funktion von `prefers-reduced-motion`
- [ ] Wissen Sie, wie man Bildladen optimiert (dimensions, lazy loading)
- [ ] Verstehen Sie die korrekte Implementierung von Dark Mode (`color-scheme`)
- [ ] Können Sie häufige UI-Antipatterns im Code erkennen

## Häufige Fallstricke

### Fallstrick 1: Nur Fokus auf Visuals, Ignorieren der Barrierefreiheit

::: warning Barrierefreiheit ist nicht optional
Barrierefreiheit ist eine gesetzliche Anforderung (wie ADA, WCAG) und auch eine soziale Verantwortung.

**Häufige Auslassungen**:
- Icon-Buttons fehlen `aria-label`
- Benutzerdefinierte Steuerelemente (wie Dropdown-Menüs) unterstützen keine Tastatur
- Formulareingaben fehlen `<label>`
- Asynchrone Updates (wie Toasts) fehlen `aria-live="polite"`
:::

### Fallstrick 2: Übermäßige Verwendung von `transition: all`

::: danger Performance-Killer
`transition: all` überwacht alle CSS-Eigenschaftsänderungen, was dazu führt, dass der Browser viele Werte neu berechnet.

**Falsche Verwendung**:
```css
.card {
  transition: all 0.3s ease;  // ❌ Übergeht background, color, transform, padding, margin usw.
}
```

**Richtige Verwendung**:
```css
.card {
  transition: transform 0.3s ease, opacity 0.3s ease;  // ✅ Nur übergeht benötigte Eigenschaften
}
```
:::

## Zusammenfassung dieser Lektion

Die Kernprinzipien der Web-Interface-Design-Richtlinien sind:

1. **Barrierefreiheit zuerst**: Stellen Sie sicher, dass alle Benutzer die Website nutzen können (Tastatur, Screen Reader)
2. **Performance-Optimierung**: Animationen mit `transform/opacity`, Bilder lazy load, Virtulisierung von langen Listen
3. **Respektieren von Benutzerpräferenzen**: `prefers-reduced-motion`, `color-scheme`, Zulassen von Zoom
4. **Semantisches HTML**: Verwenden Sie `<button>`, `<label>`, `<input>` anstelle von `<div>`
5. **Vollständigkeitsprüfung**: Dark Mode, Internationalisierung, Formularvalidierung, Fehlerbehandlung
6. **Automatisierte Prüfung durch KI**: Lassen Sie Agent Skills 100 Regeln erkennen und beheben

Die 100 Regeln von Vercel decken alle Szenarien von den Grundlagen bis zu Details ab. Wenn Sie lernen, die KI zur Anwendung dieser Regeln auszulösen, erreicht Ihre UI-Qualität Produktionsniveau.

---

## Anhang: Quellcodereferenz

<details>
<summary><strong>Klicken zum Anzeigen der Quellcodepositionen</strong></summary>

> Aktualisierungszeit:2026-01-25

| Funktion | Dateipfad | Zeilen |
|--- | --- | ---|
| Web-Interface-Design-Richtlinien-Skilldefinition | [`skills/web-design-guidelines/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md) | Ganze Datei |
| Regelnquelle (100 Regeln) | [`https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) | Ganze Datei |
|--- | --- | ---|

**17 Regelkategorien**:

| Kategorie | Anzahl abgedeckter Regeln | Typische Regeln |
|--- | --- | ---|
| Accessibility | 10 Regeln | aria-labels, semantisches HTML, Tastaturbehandlung |
| Focus States | 4 Regeln | Sichtbarer Focus, :focus-visible |
| Forms | 11 Regeln | Autocomplete, Validierung, Fehlerbehandlung |
| Animation | 6 Regeln | prefers-reduced-motion, transform/opacity |
| Typography | 6 Regeln | curly quotes, ellipsis, tabular-nums |
| Content Handling | 4 Regeln | Textabschnitt, Leere-Status-Behandlung |
| Images | 3 Regeln | Maße, Lazy Loading, Alt-Texte |
| Performance | 6 Regeln | Virtulisierung, Preconnect, Batch-Operationen |
| Navigation & State | 4 Regeln | URL spiegelt Status wider, Deep-Links |
| Touch & Interaction | 5 Regeln | touch-action, Tap-Highlight |
| Safe Areas & Layout | 3 Regeln | Sichere Bereiche, Scrollbar-Behandlung |
| Dark Mode & Theming | 3 Regeln | color-scheme, theme-color |
| Locale & i18n | 3 Regeln | Intl.DateTimeFormat, Intl.NumberFormat |
| Hydration Safety | 3 Regeln | value + onChange, Verhinderung von Einzelzellfehlern |
| Hover & Interactive States | 2 Regeln | Hover-Zustände, Kontrast |
| Content & Copy | 7 Regeln | Aktiv-Status, spezifische Button-Labels |
| Anti-patterns | 20 Regeln | Flag häufige Fehlermuster |

</details>

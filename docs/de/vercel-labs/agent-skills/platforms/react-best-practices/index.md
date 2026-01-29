---
title: "React-Performance: Vercel-Regeln | Agent Skills"
sidebarTitle: "React-Performance"
subtitle: "React/Next.js Performance-Optimierung Best Practices"
description: "Lernen Sie React-Performance-Optimierung mit 57 Vercel-Regeln. Beseitigen Sie Waterfalls, optimieren Sie Bundles und steigern Sie die Performance."
tags:
  - "React"
  - "Next.js"
  - "Performance-Optimierung"
  - "Codeüberprüfung"
prerequisite:
  - "start-getting-started"
---

# React/Next.js Performance-Optimierung Best Practices

## Was Sie nach diesem Kurs können

- 🎯 Lassen Sie die KI automatisch Performance-Probleme im React-Code erkennen und Optimierungsvorschläge machen
- ⚡ Beseitigen Sie Waterfalls, erhöhen Sie die Seitengeschwindigkeit um das 2- bis 10-fache
- 📦 Optimieren Sie die Bundle-Größe, reduzieren Sie die initiale Ladezeit
- 🔄 Reduzieren Sie Re-renders, erhöhen Sie die Seitenreaktionsgeschwindigkeit
- 🏗️ Wenden Sie Produktionsstandards von Vercel Engineering an

## Ihre aktuelle Herausforderung

Sie haben React-Code geschrieben, aber etwas fühlt sich nicht ganz richtig:

- Die Seitenladezeit ist lang, aber Developer Tools zeigen keine Probleme an
- Der von der KI generierte Code funktioniert, aber Sie wissen nicht, ob er Performance-Best-Practices entspricht
- Andere Next.js-Anwendungen flitzen vorbei, während Ihrer hakt
- Sie kennen einige Optimierungstechniken (wie `useMemo`, `useCallback`), wissen aber nicht, wann man sie anwenden soll
- Jede Codeüberprüfung erfordert manuelle Überprüfung von Performance-Problemen, was ineffizient ist

Tatsächlich hat das Vercel-Engineering-Team bereits einen Satz von **57** durch实战验证的性能优化规则 zusammengestellt, die alle Szenarien von "Beseitigung von Waterfalls" bis zu "Erweiterte Muster" abdecken. Diese Regeln sind nun in Agent Skills verpackt, und Sie können die KI automatisch den Code prüfen und optimieren lassen.

::: info Was sind "Agent Skills"
Agent Skills sind erweiterbare Skillpakete für KI-Coding-Agenten (wie Claude, Cursor, Copilot). Nach der Installation wendet die KI diese Regeln automatisch bei relevanten Aufgaben an, als hätte sie einem Vercel-Ingenieur das Hirn gegeben.
:::

## Wann man diesen Ansatz anwendet

Typische Szenarien für die Verwendung der React-Best-Practices-Skills:

- ❌ **Nicht geeignet**: Einfache statische Seiten, Komponenten ohne komplexe Interaktion
- ✅ **Geeignet**:
  - Schreiben neuer React-Komponenten oder Next.js-Seiten
  - Implementierung von Client-Side- oder Server-Side-Data-Fetching
  - Codeüberprüfung oder Refactoring vorhandenen Codes
  - Optimierung der Bundle-Größe oder Ladezeiten
  - Benutzerfeedback über ruckelnde Seiten

## 🎒 Vorbereitungen vor dem Start

::: warning Vorab-Überprüfung
Vergewissern Sie sich vor dem Start, dass Sie bereits:
1. Agent Skills installiert haben (siehe [Installationsanleitung](../../start/installation/))
2. Grundlegende Kenntnisse von React und Next.js besitzen
3. Ein React/Next.js-Projekt zur Optimierung haben
:::

## Kernkonzept

React-Performance-Optimierung ist nicht nur die Verwendung einiger Hooks, sondern erfordert die Lösung von Problemen auf **Architekturebene**. Die 57 Regeln von Vercel sind nach Priorität in 8 Kategorien unterteilt:

| Priorität | Kategorie | Fokus | Typische Gewinne |
|--- | --- | --- | ---|
| **KRITISCH** | Waterfall-Beseitigung | Vermeidung von seriellen async-Operationen | 2-10× Steigerung |
| **KRITISCH** | Bundle-Optimierung | Reduzierung der initialen Bundle-Größe | TTI/LCP signifikant verbessert |
| **HOCH** | Server-Side Performance | Optimierung von Data-Fetching und Caching | Reduzierung der Serverlast |
| **MITTEL-HOCH** | Client-Side Data-Fetching | Vermeidung von doppelten Anfragen | Reduzierung des Netzwerkverkehrs |
| **MITTEL** | Re-render-Optimierung | Reduzierung unnötiger Re-renders | Erhöhung der Interaktionsreaktionsgeschwindigkeit |
| **MITTEL** | Rendering-Performance | Optimierung von CSS und JS-Ausführung | Erhöhung der Framerate |
|--- | --- | --- | ---|
| **NIEDRIG** | Erweiterte Muster | Spezielle Szenario-Optimierungen | Randfälle |

**Kernprinzipien**:
1. **Lösen Sie zuerst KRITISCHE- und HOCH-Prioritäts-Probleme** – diese Änderungen bringen den größten Nutzen
2. **Beginnen Sie mit dem Datenfluss** – optimieren Sie zuerst asynchrone Operationen und Data-Fetching
3. **Optimieren Sie dann das Rendering** – betrachten Sie zuletzt `useMemo`, `useCallback` usw.

## Schritt-für-Schritt-Anleitung

### Schritt 1: KI-Performance-Überprüfung auslösen

Öffnen Sie Ihr React/Next.js-Projekt und geben Sie in Claude oder Cursor ein:

```
Review this React component for performance issues
```

oder

```
Apply React best practices to optimize this code
```

**Sie sollten sehen**: Die KI wird den Skill `vercel-react-best-practices` aktivieren und beginnen, den Code mit den Regeln zu prüfen.

### Schritt 2: KI erkennt automatisch Probleme

Die KI prüft den Code Zeile für Zeile und gibt bei Problemen Optimierungsvorschläge. Zum Beispiel:

```typescript
// ❌ Ihr ursprünglicher Code (hat ein Problem)
async function UserProfile({ userId }: { userId: string }) {
  const user = await fetchUser(userId)
  const posts = await fetchUserPosts(userId)
  const comments = await fetchUserComments(userId)

  return <div>...</div>
}
```

**Feedback der KI**:
```
⚠️ async-parallel: 3 unabhängige Anfragen werden seriell ausgeführt, was zu einem Waterfall führt
Auswirkung: KRITISCH (2-10× Steigerung)

Empfehlung:
Verwenden Sie Promise.all() für die parallele Ausführung unabhängiger Anfragen, reduzieren Sie 3 Netzwerk-Roundtrips auf 1.
```

**Der von der KI optimierte Code**:
```typescript
// ✅ Optimiert (paralleles Fetching)
async function UserProfile({ userId }: { userId: string }) {
  const [user, posts, comments] = await Promise.all([
    fetchUser(userId),
    fetchUserPosts(userId),
    fetchUserComments(userId),
  ])

  return <div>...</div>
}
```

### Schritt 3: Häufige Problembeispiele

Hier sind einige typische Performance-Probleme und ihre Lösungen:

#### Problem 1: Große Komponenten verursachen zu große initiale Bundles

```typescript
// ❌ Falsch: Monaco-Editor wird mit dem Haupt-Bundle geladen (~300KB)
import { MonacoEditor } from './monaco-editor'

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```

```typescript
// ✅ Richtig: Dynamischer Import, Lazy-Loading
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(
  () => import('./monaco-editor').then(m => m.MonacoEditor),
  { ssr: false }
)

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```

**Regel**: `bundle-dynamic-imports` (KRITISCH)

#### Problem 2: Unnötige Re-renders

```typescript
// ❌ Falsch: ExpensiveList wird bei jedem Update der Elternkomponente neu gerendert
function Parent() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <ExpensiveList items={largeArray} />
    </div>
  )
}
```

```typescript
// ✅ Richtig: Wrapper mit React.memo, um unnötige Re-renders zu vermeiden
const ExpensiveList = React.memo(function ExpensiveList({ items }: { items: Item[] }) {
  // ...
})

function Parent() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <ExpensiveList items={largeArray} />
    </div>
  )
}
```

**Regel**: `rerender-memo` (MITTEL)

#### Problem 3: Ableitung von Zustand in Effect

```typescript
// ❌ Falsch: Unnötiger Effect und zusätzliche Re-renders
function Component({ items }: { items: Item[] }) {
  const [filteredItems, setFilteredItems] = useState<Item[]>([])

  useEffect(() => {
    setFilteredItems(items.filter(item => item.isActive))
  }, [items])

  return <div>{filteredItems.map(...)}</div>
}
```

```typescript
// ✅ Richtig: Ableitung von Zustand beim Rendering, kein Effect erforderlich
function Component({ items }: { items: Item[] }) {
  const filteredItems = items.filter(item => item.isActive)

  return <div>{filteredItems.map(...)}</div>
}
```

**Regel**: `rerender-derived-state-no-effect` (MITTEL)

### Schritt 4: Server-Side Performance-Optimierung (Next.js-spezifisch)

Wenn Sie Next.js verwenden, prüft die KI auch die Server-Side Performance:

```typescript
// ❌ Falsch: Mehrere unabhängige fetch werden seriell ausgeführt
async function Dashboard() {
  const user = await fetchUser()
  const stats = await fetchStats()
  const notifications = await fetchNotifications()

  return <DashboardLayout user={user} stats={stats} notifications={notifications} />
}
```

```typescript
// ✅ Richtig: Paralleles Fetching aller Daten
async function Dashboard() {
  const [user, stats, notifications] = await Promise.all([
    fetchUser(),
    fetchStats(),
    fetchNotifications(),
  ])

  return <DashboardLayout user={user} stats={stats} notifications={notifications} />
}
```

**Regel**: `server-parallel-fetching` (**KRITISCH**)

### Schritt 5: React.cache Caching für wiederholte Berechnungen

```typescript
// ❌ Falsch: Berechnung bei jedem Rendering erneut durchgeführt
async function UserProfile({ userId }: { userId: string }) {
  const userData = await fetchUser(userId)

  const posts = await fetchUserPosts(userId)
  const comments = await fetchUserComments(userId)

  return <Dashboard userData={userData} posts={posts} comments={comments} />
}
```

```typescript
// ✅ Richtig: Caching mit React.cache, gleicher Request wird nur einmal ausgeführt
const fetchCachedUser = React.cache(async (userId: string) => {
  return await fetchUser(userId)
})

async function UserProfile({ userId }: { userId: string }) {
  const userData = await fetchCachedUser(userId)

  const posts = await fetchUserPosts(userId)  // userData könnte wiederverwendet werden
  const comments = await fetchUserComments(userId)

  return <Dashboard userData={userData} posts={posts} comments={comments} />
}
```

**Regel**: `server-cache-react` (**MITTEL**)

## Kontrollpunkt ✅

Nach Abschluss der oben genannten Schritte überprüfen Sie, ob Sie Folgendes verstanden haben:

- [ ] Wissen Sie, wie man die KI für eine React-Performance-Überprüfung auslöst
- [ ] Verstehen Sie die Bedeutung der "Beseitigung von Waterfalls" (KRITISCHE Priorität)
- [ ] Wissen Sie, wann man `Promise.all()` für parallele Anfragen verwendet
- [ ] Verstehen Sie die Funktion von dynamischen Imports (`next/dynamic`)
- [ ] Wissen Sie, wie man unnötige Re-renders reduziert
- [ ] Verstehen Sie die Rolle von React.cache auf Server-Side
- [ ] Können Sie Performance-Probleme im Code erkennen

## Häufige Fallstricke

### Fallstrick 1: Überoptimierung

::: warning Nicht zu früh optimieren
Optimieren Sie nur, wenn tatsächlich Performance-Probleme bestehen. Das frühzeitige Verwenden von `useMemo`, `useCallback` kann den Code schwerer lesbar machen und könnte negative Auswirkungen haben.

**Erinnern Sie sich an**:
- Messen Sie zuerst mit React DevTools Profiler
- Lösen Sie zuerst KRITISCHE- und HOCH-Prioritäts-Probleme
- Verwenden Sie `useMemo` nur, wenn "die Berechnungskosten beim Rendering hoch sind"
:::

### Fallstrick 2: Ignorieren von Server-Side Performance

::: tip Besonderheiten von Next.js
Next.js hat viele Server-Side-Optimierungstechniken (React.cache, parallel fetching, after()), die mehr bringen als Client-Side-Optimierungen.

**Priorität**: Server-Side-Optimierung > Client-Side-Optimierung > Mikro-Optimierung
:::

### Fallstrick 3: Fügen Sie allen Komponenten `React.memo` hinzu

::: danger React.memo ist kein Allheilmittel
`React.memo` ist nur nützlich, wenn "props sich nicht ändern, aber die Elternkomponente häufig aktualisiert wird".

**Falsche Verwendung**:
- Einfache Komponenten (Rendering-Zeit < 1ms)
- Komponenten mit sich häufig ändernden props
- Komponenten, die auf Updates der Elternkomponente reagieren müssen
:::

### Fallstrick 4: Abhängigkeit von `useEffect` zur Ableitung von Zustand

Abgeleiteter Zustand (derived state) sollte beim Rendering berechnet werden, nicht mit `useEffect` + `setState`.

```typescript
// ❌ Falsch: Ableitung von Zustand in Effect (zusätzliche Re-renders)
useEffect(() => {
  setFiltered(items.filter(...))
}, [items])

// ✅ Richtig: Berechnung beim Rendering (kein zusätzlicher Overhead)
const filtered = items.filter(...)
```

## Zusammenfassung dieser Lektion

Die Kernprinzipien der React-Performance-Optimierung sind:

1. **Beseitigung von Waterfalls**: Unabhängige Operationen werden mit `Promise.all()` parallel ausgeführt
2. **Reduzierung der Bundle-Größe**: Große Komponenten werden mit `next/dynamic` dynamisch importiert
3. **Reduzierung von Re-renders**: Wrapper mit `React.memo`, Vermeidung unnötiger Effects
4. **Priorisierung von Server-Side-Optimierung**: React.cache und paralleles Fetching bei Next.js bringen den größten Nutzen
5. **Automatisierung von Überprüfungen durch KI**: Lassen Sie Agent Skills Probleme erkennen und beheben

Die 57 Regeln von Vercel decken alle Szenarien von der Architektur bis zur Mikro-Optimierung ab. Das Lernen, die KI zur Anwendung dieser Regeln auszulösen, wird Ihre Codequalität signifikant verbessern.

## Vorschau auf die nächste Lektion

Als Nächstes lernen wir **[Web-Interface-Design-Richtlinien-Prüfung](../web-design-guidelines/)**.

Sie werden lernen:
- Wie man 100+ Regeln zur Barrierefreiheit (a11y) anwendet
- Überprüfung der Animationsperformance und Focus-Zustände
- Audit von Formularvalidierung und Dark-Mode-Unterstützung

---

## Anhang: Quellcodereferenz

<details>
<summary><strong>Klicken zum Anzeigen der Quellcodepositionen</strong></summary>

> Aktualisierungszeit: 2026-01-25

| Funktion | Dateipfad | Zeilen |
|--- | --- | ---|
| React-Best-Practices-Skilldefinition | [`skills/react-best-practices/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/SKILL.md) | Ganze Datei |
| Vollständige Regeldokumentation | [`skills/react-best-practices/AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/AGENTS.md) | Ganze Datei |
| 57 Regeldateien | [`skills/react-best-practices/rules/*.md`](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices/rules) | - |
| Regelvorlage | [`skills/react-best-practices/rules/_template.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/_template.md) | Ganze Datei |
| Metadaten | [`skills/react-best-practices/metadata.json`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/metadata.json) | Ganze Datei |
|--- | --- | ---|

**Wichtige Dateien (Beispiele für KRITISCHE-Regeln)**:

| Regel | Dateipfad | Beschreibung |
|--- | --- | ---|
| Promise.all() parallele Anfragen | [`async-parallel.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/async-parallel.md) | Beseitigung von Waterfalls |
| Dynamischer Import großer Komponenten | [`bundle-dynamic-imports.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/bundle-dynamic-imports.md) | Reduzierung der Bundle-Größe |
| Defer await | [`async-defer-await.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/async-defer-await.md) | Verzögerte Ausführung von asynchronen Operationen |

**Wichtige Konstanten**:
- `version = "1.0.0"`: Version der Regelbibliothek (metadata.json)
- `organization = "Vercel Engineering"`: Betreiberorganisation

**8 Regelkategorien**:
- `async-` (Waterfall-Beseitigung, 5 Regeln, KRITISCH)
- `bundle-` (Bundle-Optimierung, 5 Regeln, KRITISCH)
- `server-` (Server-Side Performance, 7 Regeln, HOCH)
- `client-` (Client-Side Data-Fetching, 4 Regeln, MITTEL-HOCH)
- `rerender-` (Re-render-Optimierung, 12 Regeln, MITTEL)
- `rendering-` (Rendering-Performance, 9 Regeln, MITTEL)
- `js-` (JavaScript-Performance, 12 Regeln, NIEDRIG-MITTEL)
- `advanced-` (Erweiterte Muster, 3 Regeln, NIEDRIG)

</details>

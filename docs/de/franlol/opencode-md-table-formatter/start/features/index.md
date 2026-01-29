---
title: "Funktionsübersicht: 8 Kernfunktionen | opencode-md-table-formatter"
sidebarTitle: "8 Funktionen im Überblick"
subtitle: "Funktionsübersicht: 8 Kernfunktionen"
description: "Lernen Sie die 8 Kernfunktionen des opencode-md-table-formatter-Plugins kennen. Beherrschen Sie die automatische Tabellenformatierung, Versteckmodus-Kompatibilität und Ausrichtungsunterstützung, schnellere Verarbeitung von Emoji und Unicode."
tags:
  - "automatische Formatierung"
  - "Versteckmodus"
  - "Ausrichtungsunterstützung"
  - "Codeblock-Schutz"
prerequisite:
  - "start-getting-started"
order: 20
---

# Funktionsübersicht: Die Magie der automatischen Formatierung

::: info Was Sie nach dieser Lektion können
- Die 8 Kernfunktionen des Plugins verstehen
- Wissen, welche Szenarien für dieses Plugin geeignet sind
- Die Grenzen des Plugins verstehen (was es nicht kann)
:::

## Ihr aktuelles Problem

::: info Plugin-Informationen
Der vollständige Name dieses Plugins ist **@franlol/opencode-md-table-formatter**, im Folgenden als "Tabellenformatierungs-Plugin" bezeichnet.
:::

KI-generierte Markdown-Tabellen sehen oft so aus:

```markdown
| 名称 | 描述 | 状态 |
|---|---|---|
| **用户管理** | 管理系统用户 | ✅ 完成 |
| API | 接口文档 | 🚧 进行中 |
```

Die Spaltenbreiten sind ungleichmäßig und sehen unansehnlich aus. Manuell anpassen? Jedes Mal, wenn die KI eine neue Tabelle generiert, müssen Sie sie anpassen – zu mühsam.

## Wann Sie diesen Ansatz verwenden

- Die KI hat eine Markdown-Tabelle generiert und Sie möchten sie ordentlicher machen
- Sie haben den Versteckmodus (Concealment Mode) von OpenCode aktiviert und die Tabellenausrichtung funktioniert immer nicht
- Sie sind zu faul, die Spaltenbreiten von Tabellen manuell anzupassen

## Kernkonzept

Die Funktionsweise dieses Plugins ist sehr einfach:

```
KI generiert Text → Plugin erkennt Tabellen → Überprüft Struktur → Formatiert → Gibt verschönerten Text zurück
```

Es wird am Hook `experimental.text.complete` von OpenCode angehängt. Jedes Mal, wenn die KI Text generiert hat, verarbeitet das Plugin ihn automatisch. Sie müssen ihn nicht manuell auslösen – der gesamte Prozess ist für Sie unsichtbar.

## 8 Kernfunktionen

### 1. Automatische Tabellenformatierung

Das Plugin erkennt automatisch Markdown-Tabellen im von der KI generierten Text, gleicht die Spaltenbreiten an und macht die Tabellen ordentlich und ästhetisch.

**Vor der Formatierung**:

```markdown
| 名称 | 描述 | 状态 |
|---|---|---|
| **用户管理** | 管理系统用户 | ✅ 完成 |
| API | 接口文档 | 🚧 进行中 |
```

**Nach der Formatierung**:

```markdown
| 名称         | 描述         | 状态       |
| ------------ | ------------ | ---------- |
| **用户管理** | 管理系统用户 | ✅ 完成    |
| API          | 接口文档     | 🚧 进行中  |
```

::: tip Auslösebedingungen
Das Plugin wird am Hook `experimental.text.complete` angehängt und wird automatisch ausgelöst, nachdem die KI Text generiert hat. Keine manuelle Bedienung erforderlich.
:::

### 2. Versteckmodus-Kompatibilität

OpenCode hat standardmäßig den Versteckmodus (Concealment Mode) aktiviert, der Markdown-Symbole wie `**`, `*`, `~~` ausblendet.

Gewöhnliche Tabellenformatierungstools berücksichtigen dies nicht und berechnen die Breite mit `**` einbezogen, was zu Fehlausrichtungen führt.

Dieses Plugin ist speziell für den Versteckmodus optimiert:

- Bei der Breitenberechnung werden Symbole wie `**Fett**`, `*Kursiv*`, `~~Durchgestrichen~~` entfernt
- Die ursprüngliche Markdown-Syntax wird bei der Ausgabe beibehalten
- Endergebnis: Tabellen sind im Versteckmodus perfekt ausgerichtet

::: details Technische Details: Breitenberechnungslogik
```typescript
// Entfernen von Markdown-Symbolen (für Breitenberechnung)
visualText = visualText
  .replace(/\*\*\*(.+?)\*\*\*/g, "$1") // ***Fettkursiv*** → Text
  .replace(/\*\*(.+?)\*\*/g, "$1")     // **Fett** → Fett
  .replace(/\*(.+?)\*/g, "$1")         // *Kursiv* → Kursiv
  .replace(/~~(.+?)~~/g, "$1")         // ~~Durchgestrichen~~ → Durchgestrichen
```
Quellcode-Position: `index.ts:181-185`
:::

### 3. Ausrichtungsunterstützung

Unterstützt die drei Ausrichtungsarten von Markdown-Tabellen:

| Syntax | Ausrichtung | Effekt |
| --- | --- | --- |
| `---` oder `:---` | Linksbündig | Text links (beide Syntaxen haben denselben Effekt) |
| `:---:` | Zentriert | Text zentriert |
| `---:` | Rechtsbündig | Text rechts |

**Beispiel**:

```markdown
| 左对齐 | 居中 | 右对齐 |
| :--- | :---: | ---: |
| 文本 | 文本 | 文本 |
```

Nach der Formatierung wird jede Spalte entsprechend der angegebenen Art ausgerichtet und die Trennzeile wird basierend auf der Ausrichtungsart neu generiert.

### 4. Verschachtelte Markdown-Verarbeitung

Tabellenzellen können verschachtelte Markdown-Syntax enthalten, wie `***Fettkursiv***`.

Das Plugin verwendet einen mehrstufigen Regex-Algorithmus und entfernt Symbole von außen nach innen schichtweise:

```
***Fettkursiv*** → **Fettkursiv** → *Fettkursiv* → Fettkursiv
```

So ist die Breitenberechnung auch bei mehreren Verschachtelungsebenen genau.

### 5. Codeblock-Schutz

Markdown-Symbole in Inline-Code (mit Backticks umschlossen) sollten unverändert bleiben und nicht entfernt werden.

Zum Beispiel `` `**bold**` `` – der Benutzer sieht genau die 8 Zeichen `**bold**`, nicht die 4 Zeichen `bold`.

Das Plugin extrahiert zuerst den Codeblock-Inhalt, entfernt die Markdown-Symbole in anderen Teilen und fügt dann den Codeblock-Inhalt wieder ein.

::: details Technische Details: Codeblock-Schutzlogik
```typescript
// Schritt 1: Inline-Code extrahieren und schützen
const codeBlocks: string[] = []
let textWithPlaceholders = text.replace(/`(.+?)`/g, (match, content) => {
  codeBlocks.push(content)
  return `\x00CODE${codeBlocks.length - 1}\x00`
})

// Schritt 2: Markdown-Symbole in Nicht-Code-Teilen entfernen
// ...

// Schritt 3: Inline-Code-Inhalt wiederherstellen
visualText = visualText.replace(/\x00CODE(\d+)\x00/g, (match, index) => {
  return codeBlocks[parseInt(index)]
})
```
Quellcode-Position: `index.ts:168-193`
:::

### 6. Randfallbehandlung

Das Plugin kann verschiedene Randfälle korrekt verarbeiten:

| Szenario | Verarbeitungsweise |
| --- | --- |
| Emoji-Ausdrücke | Verwenden Sie `Bun.stringWidth` zur korrekten Berechnung der Anzeigebreite |
| Unicode-Zeichen | Chinesisch, Japanisch und andere Festbreitenzeichen werden korrekt ausgerichtet |
| Leere Zellen | Mit Leerzeichen auf die Mindestbreite auffüllen (3 Zeichen) |
| Überlanger Inhalt | Normal verarbeiten, nicht abschneiden |

### 7. Stiller Betrieb

Das Plugin läuft im Hintergrund still:

- **Keine Protokollausgabe**: Es werden keine Informationen in der Konsole ausgegeben
- **Fehler unterbrechen nicht**: Selbst wenn die Formatierung fehlschlägt, wird die normale Ausgabe der KI nicht beeinträchtigt

Wenn während der Formatierung ein Fehler auftritt, behält das Plugin den ursprünglichen Text bei und fügt am Ende einen HTML-Kommentar hinzu:

```markdown
<!-- table formatting failed: [Fehlerinformation] -->
```

### 8. Validierungsfeedback

Das Plugin überprüft, ob die Tabellenstruktur gültig ist. Ungültige Tabellen werden nicht formatiert, sondern unverändert beibehalten und mit einem Hinweis versehen:

```markdown
<!-- table not formatted: invalid structure -->
```

**Anforderungen für gültige Tabellen**:

- Mindestens 2 Zeilen (einschließlich Trennzeile)
- Alle Zeilen haben dieselbe Spaltenanzahl
- Muss eine Trennzeile haben (Format: `|---|---|`)

## Grenzen des Plugins

::: warning Nicht unterstützte Szenarien
- **HTML-Tabellen**: Es werden nur Markdown-Pipe-Tabellen (`| ... |`) verarbeitet
- **Mehrzeilige Zellen**: Zellen mit `<br>`-Tags werden nicht unterstützt
- **Tabellen ohne Trennzeile**: Muss eine Trennzeile `|---|---|` haben
- **Tabellen ohne Kopfzeile**: Muss eine Kopfzeile haben
:::

## Kontrollpunkte

Nach Abschluss dieser Lektion sollten Sie folgende Fragen beantworten können:

- [ ] Wie wird das Plugin automatisch ausgelöst? (Antwort: Hook `experimental.text.complete`)
- [ ] Warum ist "Versteckmodus-Kompatibilität" erforderlich? (Antwort: Der Versteckmodus blendet Markdown-Symbole aus, was die Breitenberechnung beeinflusst)
- [ ] Werden Markdown-Symbole in Inline-Code entfernt? (Antwort: Nein, Markdown-Symbole im Code werden vollständig beibehalten)
- [ ] Wie werden ungültige Tabellen verarbeitet? (Antwort: Unverändert beibehalten, Fehlerkommentar hinzugefügt)

## Zusammenfassung dieser Lektion

| Funktion | Beschreibung |
| --- | --- |
| Automatische Formatierung | Wird automatisch ausgelöst, nachdem die KI Text generiert hat, keine manuelle Bedienung erforderlich |
| Versteckmodus-Kompatibilität | Korrekte Berechnung der Anzeigebreite nach dem Ausblenden von Markdown-Symbolen |
| Ausrichtungsunterstützung | Linksbündig, zentriert, rechtsbündig |
| Verschachteltes Markdown | Mehrstufige Regex-Entfernung, unterstützt verschachtelte Syntax |
| Codeblock-Schutz | Symbole in Inline-Code bleiben unverändert |
| Randfälle | Emoji, Unicode, leere Zellen, überlanger Inhalt |
| Stiller Betrieb | Keine Protokolle, Fehler unterbrechen nicht |
| Validierungsfeedback | Ungültige Tabellen erhalten Fehlerkommentar |

## Vorschau auf die nächste Lektion

> In der nächsten Lektion gehen wir tiefer in **[Versteckmodus-Prinzipien](../../advanced/concealment-mode/)** ein.
>
> Sie werden lernen:
> - Wie der Versteckmodus von OpenCode funktioniert
> - Wie das Plugin die Anzeigebreite korrekt berechnet
> - Die Funktion von `Bun.stringWidth`

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-26

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| Plugin-Einstieg | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L9-L23) | 9-23 |
| Tabellenerkennung | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L58-L61) | 58-61 |
| Tabellenvalidierung | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L70-L88) | 70-88 |
| Breitenberechnung (Versteckmodus) | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L161-L196) | 161-196 |
| Ausrichtungsarten-Parsing | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L141-L149) | 141-149 |
| Codeblock-Schutz | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L168-L173) | 168-173 |

**Wichtige Konstanten**:
- `colWidths[col] = 3`：Mindestspaltenbreite von 3 Zeichen (`index.ts:115`)

**Wichtige Funktionen**:
- `formatMarkdownTables()`：Hauptverarbeitungsfunktion, formatiert alle Tabellen im Text
- `getStringWidth()`：Berechnet die Anzeigebreite von Zeichenfolgen, entfernt Markdown-Symbole
- `isValidTable()`：Überprüft, ob die Tabellenstruktur gültig ist

</details>

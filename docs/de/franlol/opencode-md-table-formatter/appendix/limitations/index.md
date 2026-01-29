---
title: "Bekannte Einschränkungen: HTML-Tabellen usw. nicht unterstützt | opencode-md-table-formatter"
sidebarTitle: "Was tun, wenn die Tabellenformatierung fehlschlägt"
subtitle: "Bekannte Einschränkungen: HTML-Tabellen usw. nicht unterstützt"
description: "Verstehen Sie die technischen Grenzen von opencode-md-table-formatter, einschließlich der fehlenden Unterstützung für HTML-Tabellen und mehrzeilige Zellen. Vermeiden Sie die Verwendung in nicht unterstützten Szenarien, um die Arbeitseffizienz zu steigern."
tags:
  - "Bekannte Einschränkungen"
  - "HTML-Tabellen"
  - "Mehrzeilige Zellen"
  - "Tabellen ohne Trennzeile"
prerequisite:
  - "/de/franlol/opencode-md-table-formatter/start/features/"
order: 70
---

# Bekannte Einschränkungen: Wo liegen die Grenzen des Plugins

::: info Was Sie nach dieser Lektion können
- Wissen, welche Tabellentypen nicht unterstützt werden
- Die Verwendung des Plugins in nicht unterstützten Szenarien vermeiden
- Die technischen Grenzen und Designentscheidungen des Plugins verstehen
:::

## Kernkonzept

Dieses Plugin konzentriert sich auf ein Ziel: **Optimierung der Markdown-Pipe-Tabellenformatierung für den versteckten Modus von OpenCode**.

Dazu haben wir bewusst einige Funktionen eingeschränkt, um die Zuverlässigkeit und Leistung in den Kernszenarien zu gewährleisten.

## Übersicht der bekannten Einschränkungen

| Einschränkung | Beschreibung | Geplant |
| --- | --- | --- |
| **HTML-Tabellen** | Nur Markdown-Pipe-Tabellen (`\| ... \|`) werden unterstützt | ❌ Nicht unterstützt |
| **Mehrzeilige Zellen** | Zellen dürfen keine `<br>` oder andere Zeilenumbruch-Tags enthalten | ❌ Nicht unterstützt |
| **Tabellen ohne Trennzeile** | Muss eine `|---|`-Trennzeile haben | ❌ Nicht unterstützt |
| **Zusammengeführte Zellen** | Keine Unterstützung für zeilen- oder spaltenübergreifende Zusammenführung | ❌ Nicht unterstützt |
| **Tabellen ohne Tabellenkopf** | Die Trennzeile wird als Tabellenkopf behandelt, keine Tabellen ohne Kopf möglich | ❌ Nicht unterstützt |
| **Konfigurationsoptionen** | Keine Anpassung der Spaltenbreite, Deaktivierung von Funktionen usw. | 🤔 Vielleicht in Zukunft |
| **Sehr große Tabellen** | Leistung für Tabellen mit 100+ Zeilen nicht verifiziert | 🤔 Zukünftige Optimierung |

---

## Detaillierte Erläuterung der Einschränkungen

### 1. Keine Unterstützung für HTML-Tabellen

**Phänomen**

```html
<!-- Diese Tabelle wird nicht formatiert -->
<table>
  <tr>
    <th>Spalte 1</th>
    <th>Spalte 2</th>
  </tr>
  <tr>
    <td>Daten 1</td>
    <td>Daten 2</td>
  </tr>
</table>
```

**Grund**

Das Plugin verarbeitet nur Markdown-Pipe-Tabellen, also das mit `|` getrennte Format:

```markdown
| Spalte 1 | Spalte 2 |
| --- | --- |
| Daten 1 | Daten 2 |
```

**Quellcode-Basis**

```typescript
// index.ts:58-61
function isTableRow(line: string): boolean {
  const trimmed = line.trim()
  return trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.split("|").length > 2
}
```

Die Erkennungslogik stimmt nur mit Zeilen überein, die mit `|` beginnen und enden. HTML-Tabellen werden übersprungen.

**Alternative**

Wenn Sie HTML-Tabellen formatieren müssen, empfehlen wir:
- Verwendung anderer spezialisierter HTML-Formatierungstools
- Konvertierung von HTML-Tabellen in Markdown-Pipe-Tabellen

---

### 2. Keine Unterstützung für mehrzeilige Zellen

**Phänomen**

```markdown
| Spalte 1 | Spalte 2 |
| --- | --- |
| Zeile 1<br>Zeile 2 | Einzeilig |
```

Bei der Ausgabe sehen Sie den Kommentar `<!-- table not formatted: invalid structure -->`.

**Grund**

Das Plugin verarbeitet Tabellen zeilenweise und unterstützt keine Zeilenumbrüche innerhalb von Zellen.

**Quellcode-Basis**

```typescript
// index.ts:25-56
function formatMarkdownTables(text: string): string {
  const lines = text.split("\n")
  // ... zeilenweises Scannen, keine Logik zum Zusammenführen mehrerer Zeilen
}
```

**Alternative**

- Teilen Sie mehrzeilige Inhalte in mehrere Datenzeilen auf
- Oder akzeptieren Sie, dass die Tabelle breiter wird, und lassen Sie den Inhalt in einer Zeile anzeigen

---

### 3. Keine Unterstützung für Tabellen ohne Trennzeile

**Phänomen**

```markdown
<!-- Fehlende Trennzeile -->
| Spalte 1 | Spalte 2 |
| Daten 1 | Daten 2 |
| Daten 3 | Daten 4 |
```

Sie sehen den Kommentar `<!-- table not formatted: invalid structure -->`.

**Grund**

Markdown-Pipe-Tabellen müssen eine Trennzeile (Separator Row) enthalten, die die Anzahl der Spalten und die Ausrichtung definiert.

**Quellcode-Basis**

```typescript
// index.ts:86-87
const hasSeparator = lines.some((line) => isSeparatorRow(line))
return hasSeparator  // Gibt false zurück, wenn keine Trennzeile vorhanden ist
```

**Korrekte Schreibweise**

```markdown
| Spalte 1 | Spalte 2 |
| --- | --- |  ← Trennzeile
| Daten 1 | Daten 2 |
| Daten 3 | Daten 4 |
```

---

### 4. Keine Unterstützung für zusammengeführte Zellen

**Phänomen**

```markdown
| Spalte 1 | Spalte 2 |
| --- | --- |
| Zwei Spalten zusammenführen |  ← Erwartet: Überbrückt Spalte 1 und Spalte 2
| Daten 1 | Daten 2 |
```

**Grund**

Der Markdown-Standard unterstützt keine Syntax für zusammengeführte Zellen, und das Plugin implementiert keine Zusammenführungslogik.

**Alternative**

- Verwenden Sie leere Zellen als Platzhalter: `| Zwei Spalten zusammenführen | |`
- Oder akzeptieren Sie die Markdown-Einschränkung und verwenden Sie stattdessen HTML-Tabellen

---

### 5. Trennzeile wird als Tabellenkopf behandelt

**Phänomen**

```markdown
| :--- | :---: | ---: |
| Links ausgerichtet | Zentriert | Rechts ausgerichtet |
| Daten 1 | Daten 2 | Daten 3 |
```

Die Trennzeile wird als Tabellenkopfzeile behandelt, sodass keine "kopflosen" reinen Datentabellen erstellt werden können.

**Grund**

Die Markdown-Spezifikation betrachtet die erste Zeile nach der Trennzeile als Tabellenkopf (Table Header).

**Alternative**

- Dies ist eine Einschränkung von Markdown selbst, nicht spezifisch für dieses Plugin
- Für Tabellen ohne Tabellenkopf können Sie andere Formate in Betracht ziehen (z. B. CSV)

---

### 6. Keine Konfigurationsoptionen

**Phänomen**

Keine Anpassung über Konfigurationsdateien möglich:
- Minimale/maximale Spaltenbreite
- Deaktivierung bestimmter Funktionen
- Anpassung der Cache-Strategie

**Grund**

Die aktuelle Version (v0.0.3) bietet keine Konfigurationsschnittstelle, alle Parameter sind im Quellcode fest codiert.

::: tip Versionshinweis
Die aktuelle Plugin-Version ist v0.0.3 (in package.json deklariert). Die in CHANGELOG.md erwähnte v0.1.0 ist eine zukünftige Planung und noch nicht veröffentlicht.
:::

**Quellcode-Basis**

```typescript
// index.ts:115 - Minimale Spaltenbreite fest auf 3 codiert
const colWidths: number[] = Array(colCount).fill(3)

// index.ts:222 - Cache-Schwellenwert fest codiert
if (cacheOperationCount > 100 || widthCache.size > 1000) {
  cleanupCache()
}
```

**Zukünftige Planung**

Im CHANGELOG wird erwähnt, dass möglicherweise in Zukunft Folgendes unterstützt wird:
> Configuration options (min/max column width, disable features)

---

### 7. Leistung für sehr große Tabellen nicht verifiziert

**Phänomen**

Für Tabellen mit 100+ Zeilen kann die Formatierung langsam sein oder viel Speicher verbrauchen.

**Grund**

Das Plugin verwendet zeilenweises Scannen und einen Caching-Mechanismus, kann theoretisch große Tabellen verarbeiten, aber es wurde keine spezielle Leistungsoptimierung durchgeführt.

**Quellcode-Basis**

```typescript
// index.ts:5-7
const widthCache = new Map<string, number>()
let cacheOperationCount = 0

// Cache wird nach 100 Operationen oder 1000 Einträgen geleert
if (cacheOperationCount > 100 || widthCache.size > 1000) {
  cleanupCache()
}
```

**Empfehlung**

- Für sehr große Tabellen empfehlen wir, sie in mehrere kleine Tabellen aufzuteilen
- Oder warten Sie auf zukünftige Leistungsoptimierungsversionen

---

## Kontrollpunkte

Nach Abschluss dieser Lektion sollten Sie folgende Fragen beantworten können:

- [ ] Welche Tabellenformate werden vom Plugin unterstützt? (Antwort: Nur Markdown-Pipe-Tabellen)
- [ ] Warum können mehrzeilige Zellen nicht formatiert werden? (Antwort: Das Plugin verarbeitet zeilenweise, keine Zusammenführungslogik)
- [ ] Was ist der Zweck der Trennzeile? (Antwort: Definiert Spaltenanzahl und Ausrichtung, erforderlich)
- [ ] Kann die Spaltenbreite angepasst werden? (Antwort: Aktuelle Version unterstützt dies nicht)

---

## Häufige Fehler vermeiden

::: warning Häufige Fehler

**Fehler 1**: Erwartung, dass HTML-Tabellen formatiert werden

Das Plugin verarbeitet nur Markdown-Pipe-Tabellen. HTML-Tabellen müssen manuell formatiert oder mit anderen Tools formatiert werden.

**Fehler 2**: Tabelle ohne Trennzeile

Die Trennzeile ist ein erforderlicher Bestandteil von Markdown-Tabellen. Fehlt sie, führt dies zu einem "Ungültige Struktur"-Fehler.

**Fehler 3**: Zelleninhalt zu lang, führt zu sehr breiter Tabelle

Das Plugin hat keine Begrenzung für die maximale Spaltenbreite. Wenn der Zelleninhalt zu lang ist, wird die gesamte Tabelle sehr breit. Empfehlung: Manuelles Umbrechen oder Kürzen des Inhalts.

:::

---

## Zusammenfassung dieser Lektion

| Einschränkung | Grund | Alternative |
| --- | --- | --- |
| HTML-Tabellen nicht unterstützt | Plugin konzentriert sich auf Markdown-Pipe-Tabellen | HTML-Formatierungstools verwenden |
| Mehrzeilige Zellen nicht unterstützt | Zeilenweise Verarbeitungslogik | In mehrere Zeilen aufteilen oder Breiterwerden akzeptieren |
| Tabellen ohne Trennzeile nicht unterstützt | Markdown-Spezifikation erfordert dies | `|---|`-Trennzeile hinzufügen |
| Keine Konfigurationsoptionen | Aktuelle Version nicht implementiert | Auf zukünftige Versionupdates warten |

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Technische Details](../tech-details/)**.
>
> Sie werden lernen:
> - Wie der Caching-Mechanismus des Plugins funktioniert
> - Leistungsoptimierungsstrategien
> - Warum der Cache nach 100 Operationen geleert wird

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-26

| Einschränkung | Dateipfad | Zeilennummer |
| --- | --- | --- |
| HTML-Tabellenerkennung | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L58-L61) | 58-61 |
| Trennzeilenerkennung | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L63-L68) | 63-68 |
| Tabellenvalidierung (muss Trennzeile enthalten) | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L70-L88) | 70-88 |
| Minimale Spaltenbreite fest codiert | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L115) | 115 |
| Cache-Schwellenwert fest codiert | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L222-L224) | 222-224 |

**Wichtige Funktionen**:
- `isTableRow()`: Erkennt, ob es sich um eine Markdown-Pipe-Tabellenzeile handelt
- `isSeparatorRow()`: Erkennt die Trennzeile
- `isValidTable()`: Validiert die Gültigkeit der Tabellenstruktur

**Wichtige Konstanten**:
- `colWidths Mindestbreite = 3`: Minimale Anzeigebreite von Spalten
- `Cache-Schwellenwert = 100 Operationen oder 1000 Einträge`: Bedingung für das Auslösen der Cache-Bereinigung

**CHANGELOG-Referenz**:
- Kapitel "Bekannte Einschränkungen": [`CHANGELOG.md`](https://github.com/franlol/opencode-md-table-formatter/blob/main/CHANGELOG.md#L31-L36) Zeilen 31-36

</details>

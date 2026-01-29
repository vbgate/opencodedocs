---
title: "Tabellenspezifikation: Formatierungsbedingungen | opencode-md-table-formatter"
sidebarTitle: "invalid structure-Fehler beheben"
subtitle: "Tabellenspezifikation: Welche Tabellen können formatiert werden"
description: "Lernen Sie die 4 gültigen Bedingungen für Markdown-Tabellen. Beherrschen Sie Pipe-Zeichen am Zeilenanfang und -ende, Trennzeilen-Syntax, Spaltenanzahl-Konsistenz und beheben Sie invalid structure-Fehler."
tags:
  - "Tabellenvalidierung"
  - "Trennzeilen"
  - "Spaltenanzahl-Konsistenz"
  - "Ausrichtungs-Syntax"
prerequisite:
  - "start-features"
order: 40
---

# Tabellenspezifikation: Welche Tabellen können formatiert werden

::: info Was Sie nach dieser Lektion können
- Wissen, welche Tabellen vom Plugin formatiert werden können
- Die Ursache von `invalid structure`-Fehlern verstehen
- Konforme Markdown-Tabellen schreiben
:::

## Ihr aktuelles Problem

Die KI hat eine Tabelle generiert, aber das Plugin hat sie nicht formatiert und am Ende einen Kommentar hinzugefügt:

```markdown
<!-- table not formatted: invalid structure -->
```

Was bedeutet "ungültige Struktur"? Warum funktioniert meine Tabelle nicht?

## Wann Sie diesen Trick anwenden

- Sie erhalten einen `invalid structure`-Fehler und möchten wissen, wo das Problem liegt
- Sie möchten sicherstellen, dass KI-generierte Tabellen korrekt formatiert werden
- Sie möchten manuell eine konforme Markdown-Tabelle schreiben

## Kernidee

Das Plugin führt vor der Formatierung eine dreistufige Validierung durch:

```
Ebene 1: Ist es eine Tabellenzeile? → isTableRow()
Ebene 2: Gibt es eine Trennzeile? → isSeparatorRow()
Ebene 3: Ist die Struktur gültig? → isValidTable()
```

Nur wenn alle drei Ebenen bestanden werden, wird formatiert. Wenn eine Ebene fehlschlägt, bleibt die Tabelle unverändert und ein Fehlerkommentar wird hinzugefügt.

## Die 4 Bedingungen für gültige Tabellen

### Bedingung 1: Jede Zeile muss mit `|` beginnen und enden

Dies ist die grundlegendste Anforderung. Jede Zeile einer Markdown-Pipe-Tabelle muss mit `|` umschlossen sein.

```markdown
✅ Korrekt
| Name | Beschreibung |

❌ Falsch
Name | Beschreibung      ← Kein | am Anfang
| Name | Beschreibung     ← Kein | am Ende
```

::: details Quellcode-Implementierung
```typescript
function isTableRow(line: string): boolean {
  const trimmed = line.trim()
  return trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.split("|").length > 2
}
```
Quellcode-Position: `index.ts:58-61`
:::

### Bedingung 2: Jede Zeile muss mindestens 2 Trennzeichen haben

`split("|").length > 2` bedeutet, dass es mindestens 2 `|` geben muss, die den Inhalt trennen.

```markdown
✅ Korrekt (3 |, 2 Trennzeichen)
| Name | Beschreibung |

❌ Falsch (nur 2 |, 1 Trennzeichen)
| Name |
```

Mit anderen Worten: **Einspaltige Tabellen sind gültig**, müssen aber als `| Inhalt |` geschrieben werden.

### Bedingung 3: Es muss eine Trennzeile geben

Die Trennzeile ist die Zeile zwischen der Kopfzeile und den Datenzeilen, die die Ausrichtung definiert.

```markdown
| Name | Beschreibung |
| --- | --- |      ← Das ist die Trennzeile
| Wert1 | Wert2 |
```

**Syntaxregeln der Trennzeile**:

Jede Zelle muss dem regulären Ausdruck `/^\s*:?-+:?\s*$/` entsprechen, übersetzt in Klartext:

| Bestandteil | Bedeutung | Beispiel |
|--- | --- | ---|
| `\s*` | Optionaler Leerraum | Erlaubt `| --- |` oder `|---|` |
| `:?` | Optionaler Doppelpunkt | Zur Angabe der Ausrichtung |
| `-+` | Mindestens ein Bindestrich | `-`, `---`, `------` sind alle möglich |

**Beispiele für gültige Trennzeilen**:

```markdown
| --- | --- |           ← Einfachste Form
| :--- | ---: |         ← Mit Ausrichtungsmarkierungen
| :---: | :---: |       ← Zentriert
|---|---|               ← Ohne Leerzeichen auch möglich
| -------- | -------- | ← Lange Bindestriche auch möglich
```

**Beispiele für ungültige Trennzeilen**:

```markdown
| === | === |           ← Gleichheitszeichen statt Bindestriche
| - - | - - |           ← Leerzeichen zwischen Bindestrichen
| ::: | ::: |           ← Nur Doppelpunkte, keine Bindestriche
```

::: details Quellcode-Implementierung
```typescript
function isSeparatorRow(line: string): boolean {
  const trimmed = line.trim()
  if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) return false
  const cells = trimmed.split("|").slice(1, -1)
  return cells.length > 0 && cells.every((cell) => /^\s*:?-+:?\s*$/.test(cell))
}
```
Quellcode-Position: `index.ts:63-68`
:::

### Bedingung 4: Alle Zeilen müssen die gleiche Spaltenanzahl haben

Wenn die erste Zeile 3 Spalten hat, muss jede folgende Zeile ebenfalls 3 Spalten haben.

```markdown
✅ Korrekt (jede Zeile hat 3 Spalten)
| A | B | C |
|--- | --- | ---|
| 1 | 2 | 3 |

❌ Falsch (dritte Zeile hat nur 2 Spalten)
| A | B | C |
|--- | --- | ---|
| 1 | 2 |
```

::: details Quellcode-Implementierung
```typescript
function isValidTable(lines: string[]): boolean {
  if (lines.length < 2) return false

  const rows = lines.map((line) =>
    line.split("|").slice(1, -1).map((cell) => cell.trim()),
  )

  if (rows.length === 0 || rows[0].length === 0) return false

  const firstRowCellCount = rows[0].length
  const allSameColumnCount = rows.every((row) => row.length === firstRowCellCount)
  if (!allSameColumnCount) return false

  const hasSeparator = lines.some((line) => isSeparatorRow(line))
  return hasSeparator
}
```
Quellcode-Position: `index.ts:70-88`
:::

## Schnellreferenz für Ausrichtungssyntax

Die Trennzeile dient nicht nur zur Trennung, sondern auch zur Angabe der Ausrichtung:

| Syntax | Ausrichtung | Effekt |
|--- | --- | ---|
| `---` oder `:---` | Linksbündig | Text links (Standard) |
| `:---:` | Zentriert | Text zentriert |
| `---:` | Rechtsbündig | Text rechts |

**Beispiel**:

```markdown
| Linksbündig | Zentriert | Rechtsbündig |
|--- | --- | ---|
| Text | Text | Text |
```

Nach der Formatierung:

```markdown
| Linksbündig |  Zentriert  | Rechtsbündig |
|--- | --- | ---|
| Text        |    Text     |        Text |
```

::: details Quellcode-Implementierung
```typescript
function getAlignment(delimiterCell: string): "left" | "center" | "right" {
  const trimmed = delimiterCell.trim()
  const hasLeftColon = trimmed.startsWith(":")
  const hasRightColon = trimmed.endsWith(":")

  if (hasLeftColon && hasRightColon) return "center"
  if (hasRightColon) return "right"
  return "left"
}
```
Quellcode-Position: `index.ts:141-149`
:::

## Häufige Fehlerbehebung

| Fehlererscheinung | Mögliche Ursache | Lösung |
|--- | --- | ---|
| `invalid structure` | Fehlende Trennzeile | Fügen Sie nach der Kopfzeile `\| --- \| --- \|` hinzu |
| `invalid structure` | Unterschiedliche Spaltenanzahl | Überprüfen Sie, ob jede Zeile die gleiche Anzahl von `\|` hat |
| `invalid structure` | Fehlendes `\|` am Zeilenanfang/ende | Ergänzen Sie das fehlende `\|` |
| Tabelle wird nicht erkannt | Nur 1 Spalte | Stellen Sie sicher, dass es mindestens 2 `\|`-Trennzeichen gibt |
| Ausrichtung wirkt nicht | Syntaxfehler in der Trennzeile | Überprüfen Sie, ob Sie `-` und nicht andere Zeichen verwendet haben |

## Kontrollpunkte

Nach Abschluss dieser Lektion sollten Sie folgende Fragen beantworten können:

- [ ] Welche Bedingungen müssen Tabellenzeilen erfüllen? (Antwort: Mit `|` beginnen und enden, mindestens 2 Trennzeichen)
- [ ] Was bedeutet der reguläre Ausdruck der Trennzeile? (Antwort: Optionaler Doppelpunkt + mindestens ein Bindestrich + optionaler Doppelpunkt)
- [ ] Warum tritt `invalid structure` auf? (Antwort: Fehlende Trennzeile, unterschiedliche Spaltenanzahl oder fehlendes `|` am Zeilenanfang/ende)
- [ ] Was bedeutet `:---:` für die Ausrichtung? (Antwort: Zentriert)

## Zusammenfassung dieser Lektion

| Bedingung | Anforderung |
|--- | ---|
| Zeilenanfang und -ende | Muss mit `\|` beginnen und enden |
| Anzahl der Trennzeichen | Mindestens 2 `\|` |
| Trennzeile | Muss vorhanden sein, Format ist `:?-+:?` |
| Spaltenanzahl-Konsistenz | Alle Zeilen müssen die gleiche Spaltenanzahl haben |

**Merksatz**:

> Pipe-Zeichen an beiden Seiten, Bindestriche in der Trennzeile,
> Spaltenanzahl muss gleich sein, vier Regeln im Kopf behalten.

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Ausrichtung im Detail](../alignment/)**.
>
> Sie werden lernen:
> - Detaillierte Verwendung der drei Ausrichtungsarten
> - Das Implementierungsprinzip der Trennzeilen-Formatierung
> - Den Zellenfüllalgorithmus

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-26

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
| Tabellenvalidierung | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L70-L88) | 70-88 |
| Ausrichtungsanalyse | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L141-L149) | 141-149 |
| Behandlung ungültiger Tabellen | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L44-L47) | 44-47 |

**Wichtige reguläre Ausdrücke**:
- `/^\s*:?-+:?\s*$/`: Matching-Regel für Trennzeilen-Zellen

**Wichtige Funktionen**:
- `isTableRow()`: Prüft, ob es sich um eine Tabellenzeile handelt
- `isSeparatorRow()`: Prüft, ob es sich um eine Trennzeile handelt
- `isValidTable()`: Validiert, ob die Tabellenstruktur gültig ist
- `getAlignment()`: Analysiert die Ausrichtung

</details>

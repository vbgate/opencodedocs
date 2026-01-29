---
title: "Ausrichtung: Markdown-Tabellenlayout | opencode-md-table-formatter"
subtitle: "Ausrichtung: Markdown-Tabellenlayout | opencode-md-table-formatter"
sidebarTitle: "Tabellen schön ausrichten"
description: "Lernen Sie die drei Ausrichtungsarten und die Syntax der Trennzeilen in Markdown-Tabellen. Beherrschen Sie den Ausrichtungsalgorithmus, damit KI-generierte Tabellen bei verschiedenen Ausrichtungen schön und ordentlich aussehen."
tags:
  - "Linksbündig"
  - "Zentriert"
  - "Rechtsbündig"
  - "Trennzeilen-Syntax"
prerequisite:
  - "advanced-table-spec"
order: 50
---

# Ausrichtung im Detail: Linksbündig, Zentriert, Rechtsbündig

::: info Was Sie nach dieser Lektion können
- Die Syntax und Wirkung der drei Ausrichtungsarten beherrschen
- Verstehen, wie Trennzeilen die Ausrichtung festlegen
- Den Arbeitsprinzip des Zellenfüllalgorithmus kennenlernen
- Wissen, warum sich Trennzeilen automatisch an die Breite anpassen
:::

## Ihr aktuelles Problem

Die KI hat eine Tabelle generiert, aber die Spaltenausrichtung ist nicht sehr schön:

```markdown
| 名称 | 类型 | 描述 |
| --- | --- | --- |
| 用户 | string | 用户名 |
| 年龄 | number | 年龄 |
| is_active | boolean | 是否激活 |
```

Sie möchten bestimmte Spalten zentrieren oder rechtsbündig ausrichten, um die Tabelle lesbarer zu machen, wissen aber nicht, wie Sie das angeben.

## Wann Sie diesen Trick anwenden

- Sie möchten bestimmte Spalten zentrieren (z. B. Status, Tags)
- Sie möchten Zahlenspalten rechtsbündig ausrichten (für bessere Vergleichbarkeit)
- Sie möchten Textspalten linksbündig ausrichten (Standardverhalten)
- Sie möchten das Implementierungsprinzip der Ausrichtung verstehen

## Kernidee: Trennzeilen bestimmen die Ausrichtung

Die Ausrichtung von Markdown-Tabellen wird nicht in jeder Zeile angegeben, sondern einheitlich durch die **Trennzeile** festgelegt.

Die Syntax der Trennzeile ist: `:?-+:?` (Doppelpunkt + Bindestrich + Doppelpunkt)

| Position des Doppelpunkts | Ausrichtung | Beispiel |
| --- | --- | --- |
| Links und rechts | Zentriert | `:---:` |
| Nur rechts | Rechtsbündig | `---:` |
| Keiner | Linksbündig | `---` oder `:---` |

Jede Zelle der Trennzeile entspricht der Ausrichtung einer Spalte. Das Plugin formatiert die gesamte Spalte nach dieser Regel.

## Machen Sie mit: Drei Ausrichtungsarten

### Schritt 1: Linksbündig (Standard)

**Warum**

Linksbündig ist das Standardverhalten von Tabellen und eignet sich für textbasierte Daten.

**Syntax**

```markdown
| 名称 | 描述 |
| :--- | :--- |    ← Doppelpunkt links oder kein Doppelpunkt bedeutet linksbündig
| 用户 | 用户名 |
```

**Was Sie sehen sollten**

```markdown
| 名称   | 描述   |
| :----- | :----- |
| 用户   | 用户名 |
```

Die Trennzeile wird als `:---` (Linksbündig-Markierung) angezeigt, der Text ist linksbündig ausgerichtet.

**Quellcode-Implementierung**

```typescript
// getAlignment-Funktion: Analysiert die Ausrichtung
function getAlignment(delimiterCell: string): "left" | "center" | "right" {
  const trimmed = delimiterCell.trim()
  const hasLeftColon = trimmed.startsWith(":")
  const hasRightColon = trimmed.endsWith(":")

  if (hasLeftColon && hasRightColon) return "center"
  if (hasRightColon) return "right"
  return "left"  // Standardmäßig left zurückgeben
}
```

Quellcode-Position: `index.ts:141-149`

**Logik-Erklärung**

- Doppelpunkt links und rechts (`:---:`) → Gibt `"center"` zurück
- Nur Doppelpunkt rechts (`---:`) → Gibt `"right"` zurück
- Andere Fälle (`---` oder `:---`) → Gibt `"left"` zurück (Standard)

### Schritt 2: Zentriert

**Warum**

Zentriert eignet sich für Status-Tags, kurze Texte, Überschriften und andere Inhalte, die visuell zentriert werden sollen.

**Syntax**

```markdown
| 名称 | 状态 | 描述 |
| :--- | :---: | :--- |    ← Mittlere Spalte mit :---: für zentriert
| 用户 | 激活 | 用户名 |
```

**Was Sie sehen sollten**

```markdown
| 名称   |  状态  | 描述   |
| :----- | :----: | :----- |
| 用户   |  激活  | 用户名 |
```

Der "激活" in der mittleren Spalte wird zentriert angezeigt, die Trennzeile wird als `:---:` (Zentriert-Markierung) angezeigt.

**Formatierungsprinzip der Trennzeile**

Die Formatierung der Trennzeilen-Zelle wird von der Funktion `formatSeparatorCell` verarbeitet:

```typescript
function formatSeparatorCell(width: number, align: "left" | "center" | "right"): string {
  if (align === "center") return ":" + "-".repeat(Math.max(1, width - 2)) + ":"
  if (align === "right") return "-".repeat(Math.max(1, width - 1)) + ":"
  return "-".repeat(width)
}
```

Quellcode-Position: `index.ts:213-217`

**Mathematisches Prinzip der zentrierten Ausrichtung**

Das Format der zentrierten Trennzeile ist: `:` + Bindestrich + `:`

| Zielbreite | Berechnungsformel | Ergebnis |
| --- | --- | --- |
| 3 | `:` + ` `-`*1 ` + `:` | `:-:` |
| 5 | `:` + `-`*3 + `:` | `:---:` |
| 10 | `:` + `-`*8 + `:` | `:--------:` |

`Math.max(1, width - 2)` stellt sicher, dass mindestens 1 Bindestrich erhalten bleibt, um zu vermeiden, dass bei einer Breite von 2 `::` entsteht (keine Trennwirkung).

### Schritt 3: Rechtsbündig

**Warum**

Rechtsbündig eignet sich für Zahlen, Beträge, Daten und andere Daten, die von rechts nach links verglichen werden müssen.

**Syntax**

```markdown
| 名称 | 价格 | 数量 |
| :--- | ---: | ---: |    ← Doppelpunkt rechts bedeutet rechtsbündig
| 商品 | 99.9 | 100 |
```

**Was Sie sehen sollten**

```markdown
| 名称   | 价格 | 数量 |
| :----- | ----: | ---: |
| 商品   |  99.9 |  100 |
```

Zahlen sind rechtsbündig ausgerichtet, was den Größenvergleich erleichtert.

**Mathematisches Prinzip der rechtsbündigen Ausrichtung**

Das Format der rechtsbündigen Trennzeile ist: Bindestrich + `:`

| Zielbreite | Berechnungsformel | Ergebnis |
| --- | --- | --- |
| 3 | `-`*2 + `:` | `--:` |
| 5 | `-`*4 + `:` | `----:` |
| 10 | `-`*9 + `:` | `---------:` |

`Math.max(1, width - 1)` stellt sicher, dass mindestens 1 Bindestrich erhalten bleibt.

## Zellenfüllalgorithmus

Wie entscheidet das Plugin, wie viele Leerzeichen auf beiden Seiten einer Zelle gefüllt werden sollen? Die Antwort liegt in der Funktion `padCell`.

**Quellcode-Implementierung**

```typescript
function padCell(text: string, width: number, align: "left" | "center" | "right"): string {
  const displayWidth = calculateDisplayWidth(text)  // Berechnet die Anzeigebreite
  const totalPadding = Math.max(0, width - displayWidth)

  if (align === "center") {
    const leftPad = Math.floor(totalPadding / 2)
    const rightPad = totalPadding - leftPad
    return " ".repeat(leftPad) + text + " ".repeat(rightPad)
  } else if (align === "right") {
    return " ".repeat(totalPadding) + text
  } else {
    return text + " ".repeat(totalPadding)
  }
}
```

Quellcode-Position: `index.ts:198-211`

**Füllregeln**

| Ausrichtung | Linke Füllung | Rechte Füllung | Beispiel (Zielbreite 10, Text "abc") |
| --- | --- | --- | --- |
| Linksbündig | 0 | totalPadding | `abc       ` |
| Zentriert | floor(total/2) | total - floor(total/2) | `   abc    ` |
| Rechtsbündig | totalPadding | 0 | `       abc` |

**Mathematische Details der zentrierten Ausrichtung**

`Math.floor(totalPadding / 2)` stellt sicher, dass die linke Füllung eine ganze Zahl ist, und der zusätzliche Platz wird rechts hinzugefügt.

| Zielbreite | Textbreite | totalPadding | Linke Füllung | Rechte Füllung | Ergebnis |
| --- | --- | --- | --- | --- | --- |
| 10 | 3 | 7 | 3 (7÷2=3.5→3) | 4 (7-3) | `   abc    ` |
| 11 | 3 | 8 | 4 (8÷2=4) | 4 (8-4) | `    abc    ` |
| 12 | 3 | 9 | 4 (9÷2=4.5→4) | 5 (9-4) | `    abc     ` |

## Vollständiges Beispiel

**Eingabetabelle** (verschiedene Ausrichtungen für verschiedene Spalten):

```markdown
| 名称 | 状态 | 价格 | 描述 |
| :--- | :---: | ---: | :--- |
| 商品A | 激活 | 99.9 | 这是一个商品 |
| 商品B | 停用 | 199.0 | 这是另一个商品 |
```

**Formatiertes Ergebnis**:

```markdown
| 名称   |  状态  | 价格 | 描述         |
| :----- | :----: | ----: | :----------- |
| 商品A  |  激活  |  99.9 | 这是一个商品 |
| 商品B  |  停用  | 199.0 | 这是另一个商品 |
```

**Ausrichtung jeder Spalte**:

| Spaltenname | Trennzeilen-Syntax | Ausrichtung | Erklärung |
| --- | --- | --- | --- |
| 名称 | `:---` | Linksbündig | Text linksbündig |
| 状态 | `:---:` | Zentriert | Text zentriert |
| 价格 | `---:` | Rechtsbündig | Zahlen rechtsbündig |
| 描述 | `:---` | Linksbündig | Text linksbündig |

## Kontrollpunkte

Nach Abschluss dieser Lektion sollten Sie folgende Fragen beantworten können:

- [ ] Wie geben Sie eine zentrierte Ausrichtung an? (Antwort: Trennzeile mit `:---:`)
- [ ] Wie geben Sie eine rechtsbündige Ausrichtung an? (Antwort: Trennzeile mit `---:`)
- [ ] Was ist die Standardsyntax für linksbündig? (Antwort: `---` oder `:---`)
- [ ] Warum wird bei zentrierter Ausrichtung `Math.floor(totalPadding / 2)` verwendet? (Antwort: Um sicherzustellen, dass die linke Füllung eine ganze Zahl ist, der zusätzliche Platz wird rechts hinzugefügt)
- [ ] Was bedeutet `:---:` in der Trennzeile? (Antwort: Zentriert-Markierung, links und rechts jeweils ein Doppelpunkt, in der Mitte Bindestriche)

## Häufige Fehler

::: warning Häufige Missverständnisse
**Missverständnis**: Jede Zeile muss die Ausrichtung angeben

**Tatsache**: Nein. Nur die Trennzeile gibt die Ausrichtung an, Datenzeilen werden automatisch spaltenweise ausgerichtet.

Die Trennzeile ist die "Konfiguration", Datenzeilen sind der "Inhalt". Eine Konfigurationszeile reicht aus.
:::

::: danger Wichtig
Die Position der Doppelpunkte in der Trennzeile **muss** mit den Spalten übereinstimmen.

| Falsches Beispiel | Problem |
| --- | --- |
| `| :--- | --- |` | Erste Spalte zentriert, zweite Spalte linksbündig (2 Spalten) |
| `| :--- | ---: | :--- |` | Erste Spalte linksbündig, zweite Spalte rechtsbündig, dritte Spalte linksbündig (3 Spalten) |

Die Anzahl der Spalten in der Trennzeile muss mit der Anzahl der Spalten in der Kopfzeile und den Datenzeilen übereinstimmen!
:::

## Zusammenfassung dieser Lektion

| Ausrichtung | Trennzeilen-Syntax | Anwendungsfall |
| --- | --- | --- |
| Linksbündig | `---` oder `:---` | Texte, beschreibende Daten (Standard) |
| Zentriert | `:---:` | Status-Tags, kurze Texte, Überschriften |
| Rechtsbündig | `---:` | Zahlen, Beträge, Daten |

**Wichtige Funktionen**:

| Funktion | Zweck | Quellcode-Position |
| --- | --- | --- |
| `getAlignment()` | Analysiert die Ausrichtung der Trennzeilen-Zelle | 141-149 |
| `padCell()` | Füllt Zellen auf die angegebene Breite | 198-211 |
| `formatSeparatorCell()` | Formatiert Trennzeilen-Zellen | 213-217 |

**Merksatz**:

> Doppelpunkte links und rechts für zentriert, Doppelpunkt rechts für rechtsbündig,
> Kein Doppelpunkt standardmäßig links, in der Trennzeile werden die Regeln festgelegt.

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Häufige Probleme: Was tun, wenn die Tabelle nicht formatiert wird](../../faq/troubleshooting/)**.
>
> Sie werden lernen:
> - Wie Sie `invalid structure`-Fehler schnell lokalisieren
> - Methoden zur Fehlersuche bei Konfigurationsproblemen
> - Lösungen für häufige Tabellenprobleme

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-26

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Ausrichtungsanalyse | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L141-L149) | 141-149 |
| Zellenfüllung | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L198-L211) | 198-211 |
| Trennzeilen-Formatierung | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L213-L217) | 213-217 |
| Ausrichtungsanwendung | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L107-L113) | 107-113 |

**Wichtige Funktionen**:
- `getAlignment(delimiterCell: string)`: Analysiert die Ausrichtung der Trennzeilen-Zelle
  - Gibt `"left"` | `"center"` | `"right"` zurück
  - Logik: Doppelpunkt links und rechts → zentriert, nur Doppelpunkt rechts → rechtsbündig, andere → linksbündig

- `padCell(text, width, align)`: Füllt Zellen auf die angegebene Breite
  - Berechnet die Differenz zwischen Anzeigebreite und Zielbreite
  - Verteilt linke und rechte Füllung je nach Ausrichtung
  - Verwendet `Math.floor(totalPadding / 2)` für zentriert, um sicherzustellen, dass die linke Füllung eine ganze Zahl ist

- `formatSeparatorCell(width, align)`: Formatiert Trennzeilen-Zellen
  - Zentriert: `:` + `-`*(width-2) + `:`
  - Rechtsbündig: `-`*(width-1) + `:`
  - Linksbündig: `-`*width
  - Verwendet `Math.max(1, ...)` um sicherzustellen, dass mindestens 1 Bindestrich erhalten bleibt

</details>

---
title: "Versteckter Modus: Breitenberechnungsprinzip | opencode-md-table-formatter"
sidebarTitle: "Breitenberechnung in drei Schritten"
subtitle: "Prinzip des versteckten Modus: Warum die Breitenberechnung so wichtig ist"
description: "Lernen Sie, wie der OpenCode-Versteckmodus funktioniert. Beherrschen Sie die Anzeigebreitenberechnung des Plugins, verstehen Sie das Entfernen von Markdown-Symbolen, den Schutz von Codeblöcken und die Verwendung von Bun.stringWidth."
tags:
  - "concealment-mode"
  - "Anzeigebreitenberechnung"
  - "Markdown-Symbolentfernung"
  - "Bun.stringWidth"
prerequisite:
  - "/de/franlol/opencode-md-table-formatter/start/features/"
order: 30
---

# Prinzip des versteckten Modus: Warum die Breitenberechnung so wichtig ist

::: info Was Sie nach diesem Kurs können
- Verstehen Sie, wie der OpenCode-Versteckmodus funktioniert
- Wissen Sie, warum normale Formatierungstools im versteckten Modus falsch ausrichten
- Beherrschen Sie den Breitenberechnungsalgorithmus des Plugins (drei Schritte)
- Verstehen Sie die Funktion von `Bun.stringWidth`
:::

## Ihr aktuelles Problem

Sie schreiben Code mit OpenCode, und die KI generiert eine schöne Tabelle:

```markdown
| Feld | Typ | Beschreibung |
| --- | --- | --- |
| **name** | string | Benutzername |
| age | number | Alter |
```

In der Quellcodeansicht sieht es ordentlich aus. Aber in der Vorschau ist die Tabelle verschoben:

```
| Feld     | Typ   | Beschreibung   |
| -------- | ------ | ------ |
| name | string | Benutzername |    ← Warum ist es kürzer?
| age      | number | Alter   |
```

Wo liegt das Problem? **Versteckter Modus**.

## Was ist der versteckte Modus

OpenCode aktiviert standardmäßig den **Versteckten Modus (Concealment Mode)**, der Markdown-Syntaxsymbole beim Rendern ausblendet:

| Quellcode | Im versteckten Modus angezeigt |
| --- | --- |
| `**fett**` | fett (4 Zeichen) |
| `*kursiv*` | kursiv (4 Zeichen) |
| `~~durchgestrichen~~` | durchgestrichen (6 Zeichen) |
| `` `Code` `` | `Code` (4 Zeichen + Hintergrundfarbe) |

::: tip Vorteil des versteckten Modus
Ermöglicht es Ihnen, sich auf den Inhalt zu konzentrieren, anstatt von einer Reihe von `**`- und `*`-Symbolen abgelenkt zu werden.
:::

## Warum normale Formatierungstools Probleme verursachen

Normale Tabellenformatierungstools berechnen die Breite, indem sie `**name**` als 8 Zeichen behandeln:

```
** n a m e ** = 8 Zeichen
```

Aber im versteckten Modus sieht der Benutzer `name`, nur 4 Zeichen.

Das Ergebnis ist: Das Formatierungstool richtet nach 8 Zeichen aus, aber der Benutzer sieht 4 Zeichen, also ist die Tabelle natürlich verschoben.

## Kernidee: Berechnen der "Anzeigebreite" statt der "Zeichenlänge"

Die Kernidee dieses Plugins ist: **Berechnen der Breite, die der Benutzer tatsächlich sieht, nicht der Zeichenanzahl im Quellcode**.

Der Algorithmus besteht aus drei Schritten:

```
Schritt 1: Codeblöcke schützen (Symbole in Codeblöcken werden nicht entfernt)
Schritt 2: Markdown-Symbole entfernen (**, *, ~~ usw.)
Schritt 3: Endgültige Breite mit Bun.stringWidth berechnen
```

## Machen Sie mit: Verstehen des dreistufigen Algorithmus

### Schritt 1: Codeblöcke schützen

**Warum**

Markdown-Symbole in Inline-Code (mit Backticks umschlossen) sind "Literale". Der Benutzer sieht die 8 Zeichen `**bold**`, nicht die 4 Zeichen `bold`.

Daher müssen Sie den Inhalt der Codeblöcke "verstecken", bevor Sie die Markdown-Symbole entfernen.

**Quellcode-Implementierung**

```typescript
// Schritt 1: Inline-Code extrahieren und schützen
const codeBlocks: string[] = []
let textWithPlaceholders = text.replace(/`(.+?)`/g, (match, content) => {
  codeBlocks.push(content)
  return `\x00CODE${codeBlocks.length - 1}\x00`
})
```

**Funktionsweise**

| Eingabe | Nach der Verarbeitung | codeBlocks-Array |
| --- | --- | --- |
| `` `**bold**` `` | `\x00CODE0\x00` | `["**bold**"]` |
| `` `a` and `b` `` | `\x00CODE0\x00 and \x00CODE1\x00` | `["a", "b"]` |

Ersetzen Sie Codeblöcke mit speziellen Platzhaltern wie `\x00CODE0\x00`, damit sie beim Entfernen von Markdown-Symbolen nicht versehentlich beschädigt werden.

### Schritt 2: Markdown-Symbole entfernen

**Warum**

Im versteckten Modus wird `**fett**` als `fett` angezeigt, `*kursiv*` als `kursiv`. Bei der Breitenberechnung müssen diese Symbole entfernt werden.

**Quellcode-Implementierung**

```typescript
// Schritt 2: Markdown-Symbole aus Nicht-Code-Teilen entfernen
let visualText = textWithPlaceholders
let previousText = ""

while (visualText !== previousText) {
  previousText = visualText
  visualText = visualText
    .replace(/\*\*\*(.+?)\*\*\*/g, "$1") // ***fett kursiv*** → Text
    .replace(/\*\*(.+?)\*\*/g, "$1")     // **fett** → fett
    .replace(/\*(.+?)\*/g, "$1")         // *kursiv* → kursiv
    .replace(/~~(.+?)~~/g, "$1")         // ~~durchgestrichen~~ → durchgestrichen
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "$1")     // ![alt](url) → alt
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)") // [text](url) → text (url)
}
```

**Warum eine while-Schleife?**

Um verschachtelte Syntax zu verarbeiten. Zum Beispiel `***fett kursiv***`:

```
Runde 1: ***fett kursiv*** → **fett kursiv** (äußere *** entfernt)
Runde 2: **fett kursiv** → *fett kursiv* (** entfernt)
Runde 3: *fett kursiv* → fett kursiv (* entfernt)
Runde 4: fett kursiv = fett kursiv (keine Änderung, Schleife beendet)
```

::: details Behandlung von Bildern und Links
- **Bilder** `![alt](url)`: OpenCode zeigt nur den alt-Text an, also wird durch `alt` ersetzt
- **Links** `[text](url)`: Wird als `text (url)` angezeigt, URL-Informationen werden beibehalten
:::

### Schritt 3: Codeblöcke wiederherstellen + Breite berechnen

**Warum**

Der Inhalt der Codeblöcke muss zurückgesetzt werden, dann wird die endgültige Anzeigebreite mit `Bun.stringWidth` berechnet.

**Quellcode-Implementierung**

```typescript
// Schritt 3: Codeblock-Inhalte wiederherstellen
visualText = visualText.replace(/\x00CODE(\d+)\x00/g, (match, index) => {
  return codeBlocks[parseInt(index)]
})

return Bun.stringWidth(visualText)
```

**Warum Bun.stringWidth?**

`Bun.stringWidth` kann korrekt berechnen:

| Zeichentyp | Beispiel | Zeichenanzahl | Anzeigebreite |
| --- | --- | --- | --- |
| ASCII | `abc` | 3 | 3 |
| Chinesisch | `你好` | 2 | 4 (jedes belegt 2 Positionen) |
| Emoji | `😀` | 1 | 2 (belegt 2 Positionen) |
| Nullbreite-Zeichen | `a\u200Bb` | 3 | 2 (Nullbreite-Zeichen belegt keinen Platz) |

Normales `text.length` kann nur die Zeichenanzahl zählen und kann diese Sonderfälle nicht verarbeiten.

## Vollständiges Beispiel

Angenommen, der Zelleninhalt ist: `` **`code`** and *text* ``

**Schritt 1: Codeblöcke schützen**

```
Eingabe: **`code`** and *text*
Ausgabe: **\x00CODE0\x00** and *text*
codeBlocks = ["code"]
```

**Schritt 2: Markdown-Symbole entfernen**

```
Runde 1: **\x00CODE0\x00** and *text* → \x00CODE0\x00 and text
Runde 2: Keine Änderung, beendet
```

**Schritt 3: Codeblöcke wiederherstellen + Breite berechnen**

```
Nach Wiederherstellung: code and text
Breite: Bun.stringWidth("code and text") = 13
```

Schließlich richtet das Plugin diese Zelle nach einer Breite von 13 Zeichen aus, nicht nach den 22 Zeichen des Quellcodes.

## Kontrollpunkte

Nach Abschluss dieses Kurses sollten Sie folgende Fragen beantworten können:

- [ ] Welche Symbole werden im versteckten Modus ausgeblendet? (Antwort: `**`, `*`, `~~` und andere Markdown-Syntaxsymbole)
- [ ] Warum müssen Codeblöcke zuerst geschützt werden? (Antwort: Symbole in Codeblöcken sind Literale und sollten nicht entfernt werden)
- [ ] Warum wird eine while-Schleife zum Entfernen von Symbolen verwendet? (Antwort: Um verschachtelte Syntax zu verarbeiten, z. B. `***fett kursiv***`)
- [ ] Was ist der Vorteil von `Bun.stringWidth` gegenüber `text.length`? (Antwort: Kann die Anzeigebreite von chinesischen Zeichen, Emojis und Nullbreite-Zeichen korrekt berechnen)

## Warnung vor Fallstricken

::: warning Häufige Missverständnisse
**Missverständnis**: `**` in Codeblöcken wird ebenfalls entfernt

**Tatsache**: Nein. Das Plugin schützt den Inhalt der Codeblöcke zuerst mit Platzhaltern, entfernt die Symbole anderer Teile und stellt sie dann wieder her.

Daher ist die Breite von `` `**bold**` `` 8 (`**bold**`), nicht 4 (`bold`).
:::

## Zusammenfassung dieser Lektion

| Schritt | Funktion | Schlüsselcode |
| --- | --- | --- |
| Codeblöcke schützen | Verhindert, dass Symbole in Codeblöcken versehentlich entfernt werden | `text.replace(/\`(.+?)\`/g, ...)` |
| Markdown entfernen | Berechnet den tatsächlichen Anzeigeinhalt im versteckten Modus | Mehrere Regex-Ersetzungen |
| Breite berechnen | Verarbeitet chinesische Zeichen, Emojis und andere Sonderzeichen | `Bun.stringWidth()` |

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Tabellenspezifikationen](../table-spec/)**.
>
> Sie werden lernen:
> - Welche Tabellen formatiert werden können
> - Die 4 Regeln der Tabellenvalidierung
> - Wie Sie "Ungültige Tabelle"-Fehler vermeiden

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-26

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Einstiegspunkt für Anzeigebreitenberechnung | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L151-L159) | 151-159 |
| Codeblock-Schutz | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L168-L173) | 168-173 |
| Markdown-Symbolentfernung | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L175-L188) | 175-188 |
| Codeblock-Wiederherstellung | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L190-L193) | 190-193 |
| Bun.stringWidth-Aufruf | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L195) | 195 |

**Schlüsselfunktionen**:
- `calculateDisplayWidth()`: Einstiegspunkt für Breitenberechnung mit Cache
- `getStringWidth()`: Kernalgorithmus, entfernt Markdown-Symbole und berechnet Anzeigebreite

**Schlüsselkonstanten**:
- `\x00CODE{n}\x00`: Format für Codeblock-Platzhalter

</details>

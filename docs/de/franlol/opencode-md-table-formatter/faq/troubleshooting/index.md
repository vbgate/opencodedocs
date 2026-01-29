---
title: "Fehlerbehebung: Tabellenformatierungsprobleme | opencode-md-table-formatter"
sidebarTitle: "Was tun, wenn Tabellen nicht formatiert werden"
subtitle: "Fehlerbehebung: Tabellenformatierungsprobleme"
description: "Lernen Sie die Fehlerbehebungsmethoden für das opencode-md-table-formatter-Plugin. Identifizieren Sie schnell häufige Probleme wie nicht formatierte Tabellen und ungültige Strukturen und beherrschen Sie die Konfigurationsprüfung und Lösungen."
tags:
  - "Fehlerbehebung"
  - "Häufige Fragen"
prerequisite:
  - "start-getting-started"
order: 60
---

# Häufige Fragen: Was tun, wenn Tabellen nicht formatiert werden

## Was Sie lernen können

Diese Lektion hilft Ihnen, häufige Probleme bei der Plugin-Nutzung schnell zu diagnostizieren und zu lösen:

- Ursachen für nicht formatierte Tabellen identifizieren
- Die Bedeutung des Fehlers "Ungültige Tabellenstruktur" verstehen
- Bekannte Einschränkungen und ungeeignete Szenarien des Plugins kennenlernen
- Schnell überprüfen, ob die Konfiguration korrekt ist

---

## Problem 1: Tabelle wird nicht automatisch formatiert

### Symptome

Die KI hat eine Tabelle generiert, aber die Spaltenbreiten sind nicht einheitlich und die Tabelle ist nicht ausgerichtet.

### Mögliche Ursachen und Lösungen

#### Ursache 1: Plugin nicht konfiguriert

**Prüfschritte**:

1. Öffnen Sie die Datei `.opencode/opencode.jsonc`
2. Bestätigen Sie, ob das Plugin im `plugin`-Array enthalten ist:

```jsonc
{
  "plugin": ["@franlol/opencode-md-table-formatter@0.0.3"]
}
```

3. Wenn nicht, fügen Sie die Plugin-Konfiguration hinzu
4. **Starten Sie OpenCode neu**, damit die Konfiguration wirksam wird

::: tip Konfigurationsformat
Stellen Sie sicher, dass die Versionsnummer und der Paketname korrekt sind. Verwenden Sie das Format `@franlol/opencode-md-table-formatter` + `@` + Versionsnummer.
:::

#### Ursache 2: OpenCode nicht neu gestartet

**Lösung**:

Nach dem Hinzufügen des Plugins müssen Sie OpenCode vollständig neu starten (nicht nur die Seite aktualisieren), damit das Plugin geladen wird.

#### Ursache 3: Tabelle fehlt Trennzeile

**Symptombeispiel**:

```markdown
| Name | Age |
| Alice | 25 |
| Bob | 30 |
```

Diese Tabelle wird nicht formatiert.

**Lösung**:

Fügen Sie eine Trennzeile hinzu (zweite Zeile im Format `|---|`):

```markdown
| Name | Age |
|------|-----|
| Alice | 25 |
| Bob | 30 |
```

::: info Funktion der Trennzeile
Die Trennzeile ist die Standard-Syntax für Markdown-Tabellen. Sie dient zur Unterscheidung zwischen Kopfzeile und Inhaltszeilen sowie zur Angabe der Ausrichtung. Das Plugin **muss** eine Trennzeile erkennen, um die Tabelle zu formatieren.
:::

#### Ursache 4: OpenCode-Version zu niedrig

**Prüfschritte**:

1. Öffnen Sie das OpenCode-Hilfemenü
2. Sehen Sie sich die aktuelle Versionsnummer an
3. Bestätigen Sie, dass die Version >= 1.0.137 ist

**Lösung**:

Aktualisieren Sie auf die neueste Version von OpenCode.

::: warning Versionsanforderung
Das Plugin verwendet den `experimental.text.complete`-Hook, der in OpenCode 1.0.137+ verfügbar ist.
:::

---

## Problem 2: Sie sehen den Kommentar "invalid structure"

### Symptome

Am Ende der Tabelle erscheint:

```markdown
<!-- table not formatted: invalid structure -->
```

### Was ist eine "ungültige Tabellenstruktur"

Das Plugin validiert jede Markdown-Tabelle. Nur Tabellen, die die Validierung bestehen, werden formatiert. Wenn die Tabellenstruktur nicht den Spezifikationen entspricht, behält das Plugin den Originaltext bei und fügt diesen Kommentar hinzu.

### Häufige Ursachen

#### Ursache 1: Nicht genügend Zeilen

**Fehlerbeispiel**:

```markdown
| Name |
```

Nur 1 Zeile, Format unvollständig.

**Korrektes Beispiel**:

```markdown
| Name |
|------|
```

Mindestens 2 Zeilen erforderlich (einschließlich Trennzeile).

#### Ursache 2: Inhomogene Spaltenanzahl

**Fehlerbeispiel**:

```markdown
| Name | Age |
|------|-----|
| Alice |
```

Erste Zeile 2 Spalten, zweite Zeile 1 Spalte, Spaltenanzahl nicht einheitlich.

**Korrektes Beispiel**:

```markdown
| Name | Age |
|------|-----|
| Alice | 25 |
```

Alle Zeilen müssen die gleiche Spaltenanzahl haben.

#### Ursache 3: Fehlende Trennzeile

**Fehlerbeispiel**:

```markdown
| Name | Age |
| Alice | 25 |
| Bob | 30 |
```

Keine Trennzeile wie `|---|---|`.

**Korrektes Beispiel**:

```markdown
| Name | Age |
|------|-----|
| Alice | 25 |
| Bob | 30 |
```

### Schnelle Diagnose

Verwenden Sie die folgende Checkliste:

- [ ] Tabelle hat mindestens 2 Zeilen
- [ ] Alle Zeilen haben die gleiche Spaltenanzahl (zählen Sie, wie viele `|` jede Zeile hat)
- [ ] Es gibt eine Trennzeile (die zweite Zeile ist normalerweise im Format `|---|`)

Wenn alle Bedingungen erfüllt sind, aber der Fehler weiterhin auftritt, überprüfen Sie, ob versteckte Zeichen oder überflüssige Leerzeichen zu falschen Spaltenanzahlberechnungen führen.

---

## Problem 3: Sie sehen den Kommentar "table formatting failed"

### Symptome

Am Ende des Textes erscheint:

```markdown
<!-- table formatting failed: {Fehlermeldung} -->
```

### Ursache

Das Plugin hat eine unerwartete Ausnahme ausgelöst.

### Lösung

1. **Fehlermeldung anzeigen**: Der Teil `{Fehlermeldung}` im Kommentar erklärt das spezifische Problem
2. **Tabelleninhalt prüfen**: Bestätigen Sie, ob es extreme Sonderfälle gibt (z. B. sehr lange einzelne Zeilen, spezielle Zeichenkombinationen)
3. **Originaltext behalten**: Auch bei einem Fehlschlag zerstört das Plugin nicht den Originaltext, Ihre Inhalte sind sicher
4. **Problem melden**: Wenn das Problem wiederholt auftritt, können Sie auf [GitHub Issues](https://github.com/franlol/opencode-md-table-formatter/issues) einen Problembericht einreichen

::: tip Fehlerisolation
Das Plugin umschließt die Formatierungslogik mit try-catch. Selbst bei einem Fehler wird der OpenCode-Workflow nicht unterbrochen.
:::

---

## Problem 4: Bestimmte Tabellentypen werden nicht unterstützt

### Nicht unterstützte Tabellentypen

#### HTML-Tabellen

**Nicht unterstützt**:

```html
<table>
  <tr><th>Name</th></tr>
  <tr><td>Alice</td></tr>
</table>
```

**Nur unterstützt**: Markdown-Pipe-Tabellen (Pipe Table)

#### Mehrzeilige Zellen

**Nicht unterstützt**:

```markdown
| Name | Description |
|------|-------------|
| Alice | Line 1<br>Line 2 |
```

::: info Warum nicht unterstützt
Das Plugin ist für einfache Tabellen entwickelt, die von der KI generiert werden. Mehrzeilige Zellen erfordern komplexere Layout-Logik.
:::

#### Tabellen ohne Trennzeile

**Nicht unterstützt**:

```markdown
| Name | Age |
| Alice | 25 |
| Bob | 30 |
```

Es muss eine Trennzeile geben (siehe oben "Ursache 3").

---

## Problem 5: Tabelle ist nach der Formatierung immer noch nicht ausgerichtet

### Mögliche Ursachen

#### Ursache 1: Versteckter Modus nicht aktiviert

Das Plugin ist für den Versteckten Modus (Concealment Mode) von OpenCode optimiert, der Markdown-Symbole (wie `**`, `*`) ausblendet.

Wenn Ihr Editor den Versteckten Modus nicht aktiviert hat, kann die Tabelle "nicht ausgerichtet" aussehen, da die Markdown-Symbole die tatsächliche Breite beanspruchen.

**Lösung**:

Bestätigen Sie, dass der Versteckte Modus von OpenCode aktiviert ist (standardmäßig aktiviert).

#### Ursache 2: Zelleninhalt zu lang

Wenn der Inhalt einer Zelle sehr lang ist, kann die Tabelle sehr breit gestreckt werden.

Dies ist normales Verhalten, das Plugin schneidet den Inhalt nicht ab.

#### Ursache 3: Symbole im Inline-Code

Markdown-Symbole in Inline-Code (`` `**code**` ``) werden **wörtlich nach Breite** berechnet und nicht entfernt.

**Beispiel**:

```
| Symbol | Breite |
|--------|--------|
| Normaler Text | 4 |
| `**bold**` | 8 |
```

Dies ist korrektes Verhalten, da Symbole in Codeblöcken im Versteckten Modus sichtbar sind.

---

## Zusammenfassung dieser Lektion

In dieser Lektion haben Sie gelernt:

- **Nicht formatierte Tabellen diagnostizieren**: Konfiguration, Neustart, Versionsanforderungen, Trennzeile prüfen
- **Ungültige Tabellenfehler verstehen**: Validierung von Zeilenanzahl, Spaltenanzahl, Trennzeile
- **Bekannte Einschränkungen identifizieren**: HTML-Tabellen, mehrzeilige Zellen, Tabellen ohne Trennzeile werden nicht unterstützt
- **Schnelle Selbstprüfung**: Checkliste zur Validierung der Tabellenstruktur verwenden

---

## Immer noch nicht gelöst?

Wenn Sie alle oben genannten Probleme überprüft haben, aber das Problem weiterhin besteht:

1. **Vollständige Protokolle anzeigen**: Das Plugin läuft standardmäßig still ohne detaillierte Protokolle
2. **Issue einreichen**: Auf [GitHub Issues](https://github.com/franlol/opencode-md-table-formatter/issues) können Sie Ihr Tabellenbeispiel und die Fehlermeldung bereitstellen
3. **Fortgeschrittene Lektionen lesen**: Lesen Sie [Tabellenspezifikation](../../advanced/table-spec/) und [Prinzip des Versteckten Modus](../../advanced/concealment-mode/) für weitere technische Details

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Bekannte Einschränkungen: Wo liegen die Grenzen des Plugins](../../appendix/limitations/)**.
>
> Sie werden lernen:
> - Designgrenzen und Einschränkungen des Plugins
> - Mögliche zukünftige Erweiterungen
> - Wie man beurteilt, ob ein Szenario für die Verwendung dieses Plugins geeignet ist

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-26

| Funktion            | Dateipfad                                                                                    | Zeilen  |
| ------------------- | ------------------------------------------------------------------------------------------- | ------- |
| Tabellenvalidierungslogik    | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L70-L88)     | 70-88   |
| Tabellenzeilenerkennung      | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L58-L61)     | 58-61   |
| Trennzeilenerkennung      | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L63-L68)     | 63-68   |
| Fehlerbehandlung        | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L15-L20)     | 15-20   |
| Ungültige Tabellenkommentare    | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L44-L47)     | 44-47   |

**Wichtige Geschäftsregeln**:
- `isValidTable()`: Validiert, dass die Tabelle mindestens 2 Zeilen hat, alle Zeilen die gleiche Spaltenanzahl haben und eine Trennzeile existiert (Zeilen 70-88)
- `isSeparatorRow()`: Verwendet den Regex `/^\s*:?-+:?\s*$/` zur Erkennung der Trennzeile (Zeilen 63-68)
- Minimale Spaltenbreite: 3 Zeichen (Zeile 115)

**Fehlerbehandlungsmechanismus**:
- try-catch umschließt die Hauptverarbeitungsfunktion (Zeilen 15-20)
- Formatierungsfehler: Originaltext behalten + Kommentar `<!-- table formatting failed: {message} -->` hinzufügen
- Validierungsfehler: Originaltext behalten + Kommentar `<!-- table not formatted: invalid structure -->` hinzufügen

</details>

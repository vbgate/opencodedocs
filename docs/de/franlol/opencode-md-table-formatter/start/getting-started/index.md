---
title: "Schnellstart: Installation und Konfiguration | opencode-md-table-formatter"
sidebarTitle: "Tabellen in 1 Minute ausrichten"
subtitle: "In einer Minute starten: Installation und Konfiguration"
description: "Lernen Sie die Installations- und Konfigurationsmethode für opencode-md-table-formatter. Installieren Sie das Plugin in 1 Minute und lassen Sie KI-generierte Tabellen automatisch ausrichten."
tags:
  - "installation"
  - "configuration"
  - "opencode-plugin"
prerequisite: []
order: 10
---

# In einer Minute starten: Installation und Konfiguration

::: info Was Sie nach dieser Lektion können
- Installieren Sie das Tabellenformatierungs-Plugin in OpenCode
- Lassen Sie KI-generierte Markdown-Tabellen automatisch ausrichten
- Überprüfen Sie, ob das Plugin ordnungsgemäß funktioniert
:::

## Ihr aktuelles Problem

KI-generierte Markdown-Tabellen sehen oft so aus:

```markdown
| 名称 | 描述 | 状态 |
|--- | --- | ---|
| 功能A | 这是一个很长的描述文本 | 已完成 |
| B | 短 | 进行中 |
```

Die Spaltenbreiten sind ungleichmäßig und sehen unansehnlich aus. Manuell anpassen? Zu zeitaufwendig.

## Wann Sie diesen Ansatz verwenden

- Sie lassen die KI häufig Tabellen generieren (Vergleiche, Checklisten, Konfigurationsbeschreibungen)
- Sie möchten, dass Tabellen in OpenCode ordentlich angezeigt werden
- Sie möchten nicht jedes Mal die Spaltenbreiten manuell anpassen

## 🎒 Vorbereitungen vor dem Start

::: warning Voraussetzungen
- OpenCode installiert (Version >= 1.0.137)
- Sie wissen, wo die Konfigurationsdatei `.opencode/opencode.jsonc` liegt
:::

## Machen Sie mit

### Schritt 1: Öffnen Sie die Konfigurationsdatei

**Warum**: Plugins werden über die Konfigurationsdatei deklariert und beim Start von OpenCode automatisch geladen.

Finden Sie Ihre OpenCode-Konfigurationsdatei:

::: code-group

```bash [macOS/Linux]
# Die Konfigurationsdatei befindet sich normalerweise im Projektstammverzeichnis
ls -la .opencode/opencode.jsonc

# Oder im Benutzerverzeichnis
ls -la ~/.config/opencode/opencode.jsonc
```

```powershell [Windows]
# Die Konfigurationsdatei befindet sich normalerweise im Projektstammverzeichnis
Get-ChildItem .opencode\opencode.jsonc

# Oder im Benutzerverzeichnis
Get-ChildItem "$env:APPDATA\opencode\opencode.jsonc"
```

:::

Öffnen Sie diese Datei mit Ihrem bevorzugten Editor.

### Schritt 2: Fügen Sie die Plugin-Konfiguration hinzu

**Warum**: Weisen Sie OpenCode an, das Tabellenformatierungs-Plugin zu laden.

Fügen Sie das Feld `plugin` zur Konfigurationsdatei hinzu:

```jsonc
{
  // ... andere Konfigurationen ...
  "plugin": ["@franlol/opencode-md-table-formatter@0.0.3"]
}
```

::: tip Bereits andere Plugins vorhanden?
Wenn Sie bereits ein `plugin`-Array haben, fügen Sie das neue Plugin zum Array hinzu:

```jsonc
{
  "plugin": [
    "existing-plugin",
    "@franlol/opencode-md-table-formatter@0.0.3"  // hier hinzufügen
  ]
}
```
:::

**Sie sollten sehen**: Die Konfigurationsdatei wurde erfolgreich gespeichert, ohne Syntaxfehlermeldungen.

### Schritt 3: Starten Sie OpenCode neu

**Warum**: Plugins werden beim Start von OpenCode geladen. Nach Änderungen an der Konfiguration ist ein Neustart erforderlich, damit die Änderungen wirksam werden.

Schließen Sie die aktuelle OpenCode-Sitzung und starten Sie neu.

**Sie sollten sehen**: OpenCode startet normal, ohne Fehlermeldungen.

### Schritt 4: Überprüfen Sie, ob das Plugin funktioniert

**Warum**: Bestätigen Sie, dass das Plugin korrekt geladen wurde und funktioniert.

Lassen Sie die KI eine Tabelle generieren, zum Beispiel durch Eingabe von:

```
帮我生成一个表格，对比 React、Vue、Angular 三个框架的特点
```

**Sie sollten sehen**: Die von der KI generierte Tabelle hat gleichmäßige Spaltenbreiten, wie diese:

```markdown
| 框架    | 特点                     | 学习曲线 |
|--- | --- | ---|
| React   | 组件化、虚拟 DOM         | 中等     |
| Vue     | 渐进式、双向绑定         | 较低     |
| Angular | 全功能框架、TypeScript   | 较高     |
```

## Kontrollpunkte ✅

Nach Abschluss der oben genannten Schritte überprüfen Sie folgende Punkte:

| Prüfpunkt              | Erwartetes Ergebnis                                   |
|--- | ---|
| Konfigurationsdatei    | Keine Fehlermeldungen                                 |
|--- | ---|
| KI-generierte Tabellen | Spaltenbreiten automatisch ausgerichtet, Trennzeilen formatiert |

## Häufige Stolpersteine

### Tabelle nicht formatiert?

1. **Überprüfen Sie den Pfad der Konfigurationsdatei**: Stellen Sie sicher, dass Sie die Konfigurationsdatei ändern, die OpenCode tatsächlich liest
2. **Überprüfen Sie den Plugin-Namen**: Muss `@franlol/opencode-md-table-formatter@0.0.3` sein, beachten Sie das `@`-Symbol
3. **Starten Sie OpenCode neu**: Nach Änderungen an der Konfiguration ist ein Neustart erforderlich

### Kommentar "invalid structure" angezeigt?

Dies bedeutet, dass die Tabellenstruktur nicht den Markdown-Spezifikationen entspricht. Häufige Ursachen:

- Fehlende Trennzeile (`|---|---|`)
| Ungleichmäßige Spaltenanzahl in den Zeilen

Weitere Informationen finden Sie im Kapitel [Häufige Probleme](../../faq/troubleshooting/).

## Zusammenfassung dieser Lektion

- Das Plugin wird über das Feld `plugin` in `.opencode/opencode.jsonc` konfiguriert
- Die Versionsnummer `@0.0.3` stellt sicher, dass eine stabile Version verwendet wird
- Nach Änderungen an der Konfiguration muss OpenCode neu gestartet werden
- Das Plugin formatiert automatisch alle von der KI generierten Markdown-Tabellen

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Funktionsübersicht](../features/)** kennen.
>
> Sie werden lernen:
> - Die 8 Kernfunktionen des Plugins
> - Das Prinzip der Breitenberechnung im Versteckmodus
> - Welche Tabellen formatiert werden können und welche nicht

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-26

| Funktion          | Dateipfad                                                                                    | Zeilen |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
| Paketkonfiguration | [`package.json`](https://github.com/franlol/opencode-md-table-formatter/blob/main/package.json#L1-L41) | 1-41   |

**Wichtige Konstanten**:
- `@franlol/opencode-md-table-formatter@0.0.3`: npm-Paketname und Version
- `experimental.text.complete`: Name des Hooks, den das Plugin überwacht

**Abhängigkeitsanforderungen**:
- OpenCode >= 1.0.137
- `@opencode-ai/plugin` >= 0.13.7

</details>

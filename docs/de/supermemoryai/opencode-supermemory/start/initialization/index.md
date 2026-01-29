---
title: "Initialisierung: Projekt-Setup | opencode-supermemory"
sidebarTitle: "Initialisierung"
subtitle: "Initialisierung: Projekt-Setup"
description: "Lernen Sie, wie Sie /supermemory-init verwenden, um die Codebasis zu scannen und Architektur und Konventionen automatisch zu extrahieren und zu speichern."
tags:
  - "Initialisierung"
  - "Speichergenerierung"
  - "Workflow"
prerequisite:
  - "start-getting-started"
order: 2
---

# Projektinitialisierung: Erster Eindruck

## Was Sie nach dieser Lektion können

- **Projekt schnell kennenlernen**: Lassen Sie den Agenten die gesamte Codebase aktiv erforschen und verstehen, wie ein neuer Mitarbeiter.
- **Langzeitgedächtnis aufbauen**: Extrahieren Sie automatisch den Tech-Stack, die Architekturmuster und die Codierungskonventionen des Projekts und speichern Sie sie in Supermemory.
- **Wiederholte Erklärungen vermeiden**: Sie müssen nicht mehr in jeder Sitzung zu Beginn sagen "Wir verwenden Bun" oder "Alle Komponenten müssen getestet werden".

## Ihre aktuelle Situation

Sind Sie bereits auf folgende Situationen gestoßen:

- **Wiederholte Arbeit**: Jedes Mal, wenn Sie eine neue Sitzung starten, müssen Sie dem Agenten viel erklären, um ihm die Grundlagen des Projekts beizubringen.
- **Kontextvergessen**: Der Agent vergisst oft die projektspezifische Verzeichnisstruktur und erstellt Dateien an der falschen Stelle.
- **Inkonsistente Konventionen**: Der Codestil des Agenten schwankt; manchmal verwendet er `interface`, manchmal `type`.

## Wann Sie diese Methode anwenden sollten

- **Unmittelbar nach der Plugin-Installation**: Dies ist der erste Schritt bei der Verwendung von opencode-supermemory.
- **Wenn Sie ein neues Projekt übernehmen**: Bauen Sie schnell die Speicherdatenbank für dieses Projekt auf.
- **Nach einer großen Refaktorisierung**: Wenn sich die Projektarchitektur ändert und Sie das Wissen des Agents aktualisieren müssen.

## 🎒 Vorbereitungen

::: warning Vorprüfung
Stellen Sie sicher, dass Sie die Installation und Konfigurationsschritte aus [Schnellstart](./../getting-started/index.md) abgeschlossen haben und `SUPERMEMORY_API_KEY` korrekt festgelegt ist.
:::

## Kernkonzept

Der Befehl `/supermemory-init` ist im Grunde kein Binärprogramm, sondern ein **sorgfältig gestalteter Prompt** (Eingabeaufforderung).

Wenn Sie diesen Befehl ausführen, sendet er dem Agenten einen detaillierten "Onboarding-Leitfaden", der den Agenten anweist:

1.  **Tiefgehende Recherche**: Aktiv lesen Sie `README.md`, `package.json`, Git-Commit-Verläufe usw.
2.  **Strukturierte Analyse**: Erkennen Sie den Tech-Stack, die Architekturmuster und die impliziten Konventionen des Projekts.
3.  **Persistente Speicherung**: Verwenden Sie das `supermemory`-Tool, um diese Erkenntnisse in der Cloud-Datenbank zu speichern.

::: info Speicherumfang
Der Initialisierungsprozess unterscheidet zwischen zwei Arten von Speichern:
- **Project Scope**: Nur für das aktuelle Projekt wirksam (z. B. Build-Befehle, Verzeichnisstruktur).
- **User Scope**: Für alle Ihre Projekte wirksam (z. B. Ihr bevorzugter Codestil).
:::

## Führen Sie es mit mir aus

### Schritt 1: Initialisierungsbefehl ausführen

Geben Sie im OpenCode-Eingabefeld den folgenden Befehl ein und senden Sie ihn:

```bash
/supermemory-init
```

**Warum**
Dies lädt den vordefinierten Prompt und startet den Erkundungsmodus des Agenten.

**Was Sie sehen sollten**
Der Agent beginnt zu antworten, signalisiert, dass er die Aufgabe verstanden hat, und plant die Recherche-Schritte. Er könnte sagen: "I will start by exploring the codebase structure and configuration files..."

### Schritt 2: Beobachten Sie den Erkundungsprozess des Agenten

Der Agent führt automatisch eine Reihe von Operationen aus; Sie müssen nur zusehen. Normalerweise tut er Folgendes:

1.  **Konfigurationsdateien lesen**: Lesen Sie `package.json`, `tsconfig.json` usw., um den Tech-Stack zu verstehen.
2.  **Git-Verlauf anzeigen**: Führen Sie `git log` aus, um Commit-Konventionen und aktive Mitwirkende zu verstehen.
3.  **Verzeichnisstruktur erkunden**: Verwenden Sie `ls` oder `list_files`, um das Projektlayout anzuzeigen.

**Beispielausgabe**:
```
[Agent] Reading package.json to identify dependencies...
[Agent] Running git log to understand commit conventions...
```

::: tip Verbrauchshinweis
Dieser Prozess ist eine tiefgehende Recherche und kann viele Tokens verbrauchen (normalerweise 50+ Tool-Aufrufe). Haben Sie Geduld, bis der Agent den Abschluss meldet.
:::

### Schritt 3: Generierte Speicher verifizieren

Wenn der Agent meldet, dass die Initialisierung abgeschlossen ist, können Sie überprüfen, was er genau behalten hat. Geben Sie ein:

```bash
/ask List current project memories
```

Oder rufen Sie das Tool direkt auf (wenn Sie die Rohdaten sehen möchten):

```
supermemory(mode: "list", scope: "project")
```

**Was Sie sehen sollten**
Der Agent listet eine Reihe strukturierter Speicher auf, wie zum Beispiel:

| Typ | Inhaltsbeispiel |
| :--- | :--- |
| `project-config` | "Uses Bun runtime. Build command: bun run build" |
| `architecture` | "API routes are located in src/routes/, using Hono framework" |
| `preference` | "Strict TypeScript usage: no 'any' type allowed" |

### Schritt 4: Fehlende Ergänzung (optional)

Wenn der Agent einige wichtige Informationen verpasst hat (z. B. eine spezielle Regel, die nur mündlich vereinbart wurde), können Sie sie manuell ergänzen:

```
Bitte merken Sie sich: In diesem Projekt muss die Datumsbearbeitung unbedingt die Bibliothek dayjs verwenden; die Verwendung von nativem Date ist verboten.
```

**Was Sie sehen sollten**
Der Agent bestätigt und ruft `supermemory(mode: "add")` auf, um diese neue Regel zu speichern.

## Prüfpunkt ✅

- [ ] Führt der Agent nach dem Ausführen von `/supermemory-init` automatisch die Erkundungsaufgaben durch?
- [ ] Können Sie mit dem `list`-Befehl die neu generierten Speicher aufrufen?
- [ ] Reflektiert der Speicherinhalt die tatsächliche Situation des aktuellen Projekts genau?

## Fallstricke

::: warning Nicht zu oft ausführen
Die Initialisierung ist ein zeitaufwendiger und token-intensiver Prozess. Normalerweise muss jeder Projekt nur einmal ausgeführt werden. Nur wenn das Projekt große Änderungen erfährt, müssen Sie es erneut ausführen.
:::

::: danger Datenschutz
Obwohl das Plugin den Inhalt von `<private>`-Tags automatisch maskiert, liest der Agent während der Initialisierung viele Dateien. Stellen Sie sicher, dass Ihre Codebase keine fest codierten geheimen Schlüssel (z. B. AWS Secret Key) enthält, da sie sonst als "Projektkonfiguration" im Speicher abgelegt werden könnten.
:::

## Zusammenfassung dieser Lektion

Durch `/supermemory-init` haben wir den Übergang vom "Fremden" zum "erfahrenen Mitarbeiter" vollzogen. Jetzt hat der Agent die Kernarchitektur und Konventionen des Projekts gespeichert. In den kommenden Codierungsaufgaben wird er diesen Kontext automatisch nutzen, um Ihnen präzisere Unterstützung zu bieten.

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Automatischer Kontextinjektionsmechanismus](./../../core/context-injection/index.md)**.
>
> Sie werden lernen:
> - Wie der Agent beim Sitzungsstart an diese Speicher "denkt".
> - Wie Sie durch Schlüsselwörter spezifische Speicherrückrufe auslösen.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie, um die Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
| :--- | :--- | :--- |
| Initialisierungs-Prompt-Definition | [`src/cli.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/cli.ts#L13-L163) | 13-163 |
| Speicher-Tool-Implementierung | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L183-L485) | 183-485 |

**Wichtige Konstanten**:
- `SUPERMEMORY_INIT_COMMAND`: Definiert den genauen Prompt-Inhalt des Befehls `/supermemory-init` und leitet den Agenten an, wie Recherche und Speicherung durchzuführen werden.

</details>

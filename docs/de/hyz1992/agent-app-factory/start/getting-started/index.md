---
title: "Schnellstart: Von der Idee zur App | AI App Factory Tutorial"
sidebarTitle: "In 5 Minuten zum Laufen"
subtitle: "Schnellstart: Von der Idee zur App"
description: "Erfahren Sie, wie AI App Factory Produktideen automatisch in lauffähige MVP-Anwendungen umwandelt. Dieses Tutorial deckt Kernwerte, Voraussetzungen, Projektinitialisierung, Pipeline-Start und Codeausführung ab und hilft Ihnen, sich in 5 Minuten mit der KI-gesteuerten App-Generierung vertraut zu machen. End-to-End-Automatisierung, Checkpoint-Mechanismus und Produktionsbereitschaft mit Frontend- und Backend-Code, Tests, Dokumentation und CI/CD-Konfiguration."
tags:
  - "Schnellstart"
  - "MVP"
  - "KI-Generierung"
prerequisite: []
order: 10
---

# Schnellstart: Von der Idee zur App

## Was Sie nach diesem Lernen können

Nachdem Sie diese Lektion gelesen haben, werden Sie:

- Verstehen, wie AI App Factory Ihnen hilft, Ideen schnell in lauffähige Anwendungen zu verwandeln
- Die Initialisierung Ihres ersten Factory-Projekts abgeschlossen haben
- Die Pipeline gestartet und Ihr erstes MVP über 7 Phasen generiert haben

## Ihre aktuelle Herausforderung

**"Eine Produktidee haben, aber nicht wissen, wo man anfangen soll"**

Haben Sie auch schon einmal diese Situation erlebt:
- Eine Produktidee haben, aber nicht wissen, wie man sie in ausführbare Anforderungen zerlegt
- Frontend, Backend, Datenbank, Tests, Bereitstellung... jeder Schritt dauert Zeit
- Ideen schnell validieren wollen, aber die Einrichtung der Entwicklungsumgebung dauert mehrere Tage
- Nach dem Schreiben des Codes feststellen, dass das Verständnis der Anforderungen falsch war und alles neu beginnen muss

AI App Factory wurde genau entwickelt, um diese Probleme zu lösen.

## Wann Sie diesen Ansatz verwenden

AI App Factory ist für diese Szenarien geeignet:

- ✅ **Schnelle Validierung von Produktideen**: Probieren Sie aus, ob diese Idee machbar ist
- ✅ **0-1-Phase von Startup-Projekten**: Schnelle Bereitstellung eines demonstrierbaren Prototyps
- ✅ **Interne Tools und Verwaltungssysteme**: Keine komplexen Berechtigungen erforderlich, einfach und praktisch
- ✅ **Lernen von Best Practices für die Full-Stack-Entwicklung**: Sehen Sie, wie KI produktionsbereiten Code generiert

Nicht geeignet für diese Szenarien:

- ❌ **Komplexe Enterprise-Systeme**: Multi-Tenant, Berechtigungssysteme, hohe Parallelität
- ❌ **Hochgradig angepasste UIs**: Projekte mit einzigartigen Designsystemen
- ❌ **Systeme mit extremen Echtzeitanforderungen**: Spiele, Videoanrufe usw.

## 🎯 Kernkonzept

AI App Factory ist ein Checkpoint-basiertes intelligentes Anwendungsgenerierungssystem, das Ihre Produktideen automatisch über eine Multi-Agent-Kollaborationspipeline in vollständige lauffähige Anwendungen verwandelt, die Frontend- und Backend-Code, Tests und Dokumentation enthalten.

**Drei Kernwerte**:

### 1. End-to-End-Automatisierung

Von der Idee zum Code, vollständig automatisch:
- Eingabe: Beschreiben Sie Ihre Produktidee in einem Satz
- Ausgabe: Vollständige Frontend- und Backend-Anwendung (Express + Prisma + React Native)
- Zwischenprozess: Automatisch Anforderungsanalyse, UI-Design, technische Architektur, Codegenerierung

### 2. Checkpoint-Mechanismus

Pausiert nach Abschluss jeder Phase und wartet auf Ihre Bestätigung:
- ✅ Verhindert die Akkumulation von Fehlern, stellt sicher, dass jeder Schritt den Erwartungen entspricht
- ✅ Sie können die Richtung jederzeit anpassen, vermeiden festzustellen, dass Sie am Ende vom Weg abgekommen sind
- ✅ Automatisches Rollback bei Fehlern, keine Zeitverschwendung auf falschen Code

### 3. Produktionsbereitschaft

Es wird kein Spielzeugcode generiert, sondern direkt einsetzbare produktionsreife Anwendungen:
- ✅ Vollständiger Frontend- und Backend-Code
- ✅ Einheitentests und Integrationstests (>60% Abdeckung)
- ✅ API-Dokumentation (Swagger/OpenAPI)
- ✅ Datenbank-Seed-Daten
- ✅ Docker-Bereitstellungskonfiguration
- ✅ CI/CD-Pipeline (GitHub Actions)
- ✅ Fehlerbehandlung und Protokollüberwachung
- ✅ Leistungsoptimierung und Sicherheitsprüfungen

**7-Phasen-Pipeline**:

```
Bootstrap → PRD → UI → Tech → Code → Validation → Preview
   ↓          ↓    ↓     ↓      ↓         ↓          ↓
Strukturiert   Produkt  UI  Technisch   Code     Validierung  Bereitstellungs-
Idee      Anforderungen Design Architektur  Generierung Qualität   guide
```

## 🎒 Vorbereitungen vor dem Start

### Erforderliche Tools

**1. Node.js >= 16.0.0**

```bash
# Überprüfen der Node.js-Version
node --version
```

Wenn nicht installiert oder die Version zu alt, laden Sie sie von [nodejs.org](https://nodejs.org/) herunter und installieren Sie sie.

**2. AI-Programmierassistent (erforderlich)** ⚠️ Wichtig

Die Agent-Definitionen und Skill-Dateien von AI App Factory sind Markdown-formatierte KI-Anweisungen, die von einem AI-Assistenten interpretiert und ausgeführt werden müssen. Menschen können diese Pipelines nicht direkt ausführen.

Es wird empfohlen, eines der folgenden Tools zu verwenden:

- **Claude Code** (https://claude.ai/code) - Empfohlen ⭐
- **OpenCode** oder andere AI-Assistenten mit Agent-Modus-Unterstützung

::: warning Warum muss ein AI-Assistent verwendet werden?
Das Kern dieses Projekts ist das AI-Agent-System, und jede Phase benötigt den AI-Assistenten:
- Lesen Sie die `.agent.md`-Datei, um Ihre eigenen Aufgaben zu verstehen
- Laden Sie die entsprechenden Skill-Dateien, um Wissen zu erhalten
- Generieren Sie streng nach den Anweisungen Code und Dokumentation

Menschen können diesen Prozess nicht ersetzen, genau wie Sie Python-Code nicht mit Notepad ausführen können.
:::

**3. CLI-Tool global installieren**

```bash
npm install -g agent-app-factory
```

Installationsüberprüfung:

```bash
factory --version
```

Sie sollten eine Versionsnummer sehen.

### Produktidee vorbereiten

Nehmen Sie sich 5 Minuten Zeit, um Ihre Produktidee aufzuschreiben. Je detaillierter die Beschreibung, desto besser entspricht die generierte Anwendung Ihren Erwartungen.

**Gutes Beschreibungsbeispiel**:

> ✅ Eine Anwendung, die Anfängern beim Fitness-Training hilft, die Unterstützung von Aufzeichnung von Bewegungstypen (Laufen, Schwimmen, Fitnessstudio), Dauer, verbrannten Kalorien und Anzeige dieser Wochen-Trainingsstatistik unterstützt. Keine多人-Kollaboration erforderlich, keine Datenanalyse, Fokus auf persönliche Aufzeichnungen.

**Schlechtes Beschreibungsbeispiel**:

> ❌ Machen Sie eine Fitness-Anwendung.

## Folgen Sie den Anweisungen

### Schritt 1: Projektverzeichnis erstellen

Erstellen Sie an einem beliebigen Ort ein leeres Verzeichnis:

```bash
mkdir my-first-app && cd my-first-app
```

### Schritt 2: Factory-Projekt initialisieren

Führen Sie den Initialisierungsbefehl aus:

```bash
factory init
```

**Warum**
Dies erstellt das Verzeichnis `.factory/` und kopiert alle erforderlichen Agent-, Skill-, Policy-Dateien, sodass das aktuelle Verzeichnis zu einem Factory-Projekt wird.

**Sie sollten sehen**:

```
✓ Verzeichnis .factory/ erstellt
✓ agents/, skills/, policies/, pipeline.yaml kopiert
✓ Konfigurationsdateien generiert: config.yaml, state.json
✓ Claude Code Berechtigungskonfiguration generiert: .claude/settings.local.json
✓ Versuch, erforderliche Plugins zu installieren (superpowers, ui-ux-pro-max)
```

Wenn Sie Fehlermeldungen sehen, überprüfen Sie bitte:
- Ob das Verzeichnis leer ist (oder nur Konfigurationsdateien enthält)
- Ob die Node.js-Version >= 16.0.0 ist
- Ob agent-app-factory global installiert ist

::: tip Verzeichnisstruktur
Nach der Initialisierung sollte Ihre Verzeichnisstruktur wie folgt aussehen:

```
my-first-app/
├── .factory/
│   ├── agents/              # Agent-Definitionsdateien
│   ├── skills/              # Wiederverwendbare Wissensmodule
│   ├── policies/            # Richtlinien und Standards
│   ├── pipeline.yaml         # Pipeline-Definition
│   ├── config.yaml          # Projektkonfiguration
│   └── state.json           # Pipeline-Status
└── .claude/
    └── settings.local.json  # Claude Code Berechtigungskonfiguration
```
:::

### Schritt 3: Pipeline starten

Führen Sie im AI-Assistenten (Claude Code empfohlen) den folgenden Befehl aus:

```
Bitte lesen Sie pipeline.yaml und agents/orchestrator.checkpoint.md,
starten Sie die Pipeline und helfen Sie mir, diese Produktidee in eine lauffähige Anwendung zu verwandeln:

[Fügen Sie Ihre Produktidee ein]
```

**Warum**
Dadurch startet der Sisyphus-Scheduler die Pipeline, beginnend mit der Bootstrap-Phase, und verwandelt Ihre Idee Schritt für Schritt in Code.

**Sie sollten sehen**:

Der AI-Assistent wird:
1. pipeline.yaml und orchestrator.checkpoint.md lesen
2. Den aktuellen Status anzeigen (idle → running)
3. Den Bootstrap-Agenten starten und beginnen, Ihre Produktidee zu strukturieren

### Schritt 4: Folgen Sie den 7 Phasen

Das System führt die folgenden 7 Phasen aus, **nach jeder Phase wird pausiert und um Bestätigung gebeten**:

#### Phase 1: Bootstrap - Produktidee strukturieren

**Eingabe**: Ihre Produktbeschreibung
**Ausgabe**: `input/idea.md` (strukturiertes Produktdokument)

**Zu bestätigen**:
- Problemdefinition: Welches Problem wird gelöst?
- Zielgruppe: Wer hat dieses Problem?
- Kernwert: Warum wird dieses Produkt benötigt?
- Schlüsselannahmen: Was sind Ihre Annahmen?

**Sie sollten sehen**:

Der AI-Assistent wird fragen:

```
✓ Bootstrap-Phase abgeschlossen
Generiertes Dokument: input/idea.md

Bitte bestätigen Sie:
1. Fortfahren zur nächsten Phase
2. Aktuelle Phase wiederholen (Änderungsvorschläge bereitstellen)
3. Pipeline pausieren
```

Lesen Sie `input/idea.md` sorgfältig. Wenn etwas nicht Ihren Erwartungen entspricht, wählen Sie "Wiederholen" und geben Sie Änderungsvorschläge.

#### Phase 2: PRD - Produktanforderungsdokument generieren

**Eingabe**: `input/idea.md`
**Ausgabe**: `artifacts/prd/prd.md`

**Zu bestätigen**:
- User Stories: Wie werden Benutzer dieses Produkt verwenden?
- Funktionsliste: Welche Kernfunktionen müssen implementiert werden?
- Nicht-Ziele: Was explizit nicht getan wird (um Scope Creep zu verhindern)

#### Phase 3: UI - UI-Struktur und Prototyp entwerfen

**Eingabe**: `artifacts/prd/prd.md`
**Ausgabe**: `artifacts/ui/ui.schema.yaml` + HTML-Prototyp zur Vorschau

**Zu bestätigen**:
- Seitenstruktur: Welche Seiten gibt es?
- Interaktionsablauf: Wie bedienen Benutzer?
- Visuelles Design: Farbschema, Schriftarten, Layout

**Besonderheit**: Integration des Designsystems ui-ux-pro-max (67 Stile, 96 Farbpaletten, 100 Branchenregeln)

#### Phase 4: Tech - Technische Architektur entwerfen

**Eingabe**: `artifacts/prd/prd.md`
**Ausgabe**: `artifacts/tech/tech.md` + `artifacts/backend/prisma/schema.prisma`

**Zu bestätigen**:
- Technologiestack: Welche Technologien werden verwendet?
- Datenmodell: Welche Tabellen gibt es? Welche Felder?
- API-Design: Welche API-Endpunkte gibt es?

#### Phase 5: Code - Vollständigen Code generieren

**Eingabe**: UI-Schema + Tech-Design + Prisma-Schema
**Ausgabe**: `artifacts/backend/` + `artifacts/client/`

**Zu bestätigen**:
- Backend-Code: Express + Prisma + TypeScript
- Frontend-Code: React Native + TypeScript
- Tests: Vitest (Backend) + Jest (Frontend)
- Konfigurationsdateien: package.json, tsconfig.json usw.

#### Phase 6: Validation - Codequalität validieren

**Eingabe**: Generierter Code
**Ausgabe**: `artifacts/validation/report.md`

**Zu bestätigen**:
- Abhängigkeiten: Ist npm install erfolgreich?
- Typprüfung: Lässt sich TypeScript kompilieren?
- Prisma-Validierung: Ist das Datenbank-Schema korrekt?

#### Phase 7: Preview - Bereitstellungsanleitung generieren

**Eingabe**: Vollständiger Code
**Ausgabe**: `artifacts/preview/README.md` + `GETTING_STARTED.md`

**Zu bestätigen**:
- Lokale Ausführung: Wie starten Sie Frontend und Backend lokal?
- Docker-Bereitstellung: Wie stellen Sie mit Docker bereit?
- CI/CD-Konfiguration: Wie konfigurieren Sie GitHub Actions?

### Checkpoint ✅

Nach Abschluss aller 7 Phasen sollten Sie sehen:

```
✓ Alle Pipeline-Phasen abgeschlossen
Endprodukte:
- artifacts/prd/prd.md (Produktanforderungsdokument)
- artifacts/ui/ui.schema.yaml (UI-Design)
- artifacts/tech/tech.md (Technische Architektur)
- artifacts/backend/ (Backend-Code)
- artifacts/client/ (Frontend-Code)
- artifacts/validation/report.md (Validierungsbericht)
- artifacts/preview/GETTING_STARTED.md (Ausführungsanleitung)

Nächster Schritt: Lesen Sie artifacts/preview/GETTING_STARTED.md, um die Anwendung zu starten
```

Herzlichen Glückwunsch! Ihre erste KI-generierte Anwendung ist abgeschlossen.

### Schritt 5: Generierte Anwendung ausführen

Führen Sie die Anwendung gemäß der generierten Anleitung aus:

```bash
# Backend
cd artifacts/backend
npm install
npm run dev

# Öffnen Sie ein neues Terminalfenster, um das Frontend auszuführen
cd artifacts/client
npm install
npm run web  # Web-Version
# oder
npm run ios      # iOS-Simulator
# oder
npm run android  # Android-Simulator
```

**Sie sollten sehen**:
- Backend startet auf `http://localhost:3000`
- Frontend startet auf `http://localhost:8081` (Web-Version) oder öffnet im Simulator

## Fallstrick-Warnung

### ❌ Fehler 1: Verzeichnis nicht leer

**Fehlermeldung**:

```
✗ Verzeichnis nicht leer, bitte bereinigen Sie es und wiederholen Sie es
```

**Ursache**: Beim Initialisieren enthält das Verzeichnis bereits Dateien

**Lösung**:

```bash
# Methode 1: Verzeichnis bereinigen (nur versteckte Konfigurationsdateien behalten)
ls -a    # Alle Dateien anzeigen
rm -rf !(.*)

# Methode 2: Neues Verzeichnis erstellen
mkdir new-app && cd new-app
factory init
```

### ❌ Fehler 2: AI-Assistent kann Befehl nicht verstehen

**Fehlerphänomen**: AI-Assistent meldet "Agent-Definition nicht gefunden"

**Ursache**: Nicht im Factory-Projektverzeichnis ausgeführt

**Lösung**:

```bash
# Stellen Sie sicher, dass Sie sich im Stammverzeichnis des Projekts mit .factory/ Verzeichnis befinden
ls -la  # Sie sollten .factory/ sehen
pwd     # Aktuelles Verzeichnis bestätigen
```

### ❌ Fehler 3: Claude CLI nicht installiert

**Fehlermeldung**:

```
✗ Claude CLI nicht installiert, bitte besuchen Sie https://claude.ai/code zum Download
```

**Lösung**:

Laden Sie Claude Code CLI herunter und installieren Sie sie von https://claude.ai/code.

## Zusammenfassung dieser Lektion

In dieser Lektion haben Sie gelernt:

- **Kernwerte von AI App Factory**: End-to-End-Automatisierung + Checkpoint-Mechanismus + Produktionsbereitschaft
- **7-Phasen-Pipeline**: Bootstrap → PRD → UI → Tech → Code → Validation → Preview
- **Wie Sie ein Projekt initialisieren**: `factory init` Befehl
- **Wie Sie die Pipeline starten**: Befehl im AI-Assistenten ausführen
- **Wie Sie der Pipeline folgen**: Nach jeder Phase bestätigen, um sicherzustellen, dass die Ausgabe den Erwartungen entspricht

**Wichtige Punkte**:
- Muss in Verbindung mit einem AI-Assistenten verwendet werden (Claude Code empfohlen)
- Geben Sie eine klare detaillierte Produktbeschreibung
- Bestätigen Sie sorgfältig an jedem Checkpoint, um Fehlerakkumulation zu vermeiden
- Der generierte Code ist produktionsbereit und kann direkt verwendet werden

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Installation und Konfiguration](../installation/)**.
>
> Sie werden lernen:
> - Wie Sie Agent Factory CLI global installieren
> - Wie Sie den AI-Assistenten konfigurieren (Claude Code / OpenCode)
> - Wie Sie die erforderlichen Plugins installieren (superpowers, ui-ux-pro-max)

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcodestandorte anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-29

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| CLI-Eingang          | [`cli/bin/factory.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/bin/factory.js)         | 1-123     |
| init-Befehl-Implementierung    | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | -         |
| run-Befehl-Implementierung     | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js)    | -         |
| continue-Befehl-Implementierung | [`cli/commands/continue.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/continue.js) | -         |
| Pipeline-Definition        | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml)              | -         |
| Scheduler-Definition        | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | -         |

**Wichtige Konfiguration**:
- `pipeline.yaml`: Definiert die Reihenfolge der 7-Phasen-Pipeline und Eingabe/Ausgabe jeder Phase
- `.factory/state.json`: Verwaltet den Ausführungsstatus der Pipeline (idle/running/waiting_for_confirmation/paused/failed)

**Kernprozess**:
- `factory init` → Erstellt das Verzeichnis `.factory/`, kopiert Agent-, Skill-, Policy-Dateien
- `factory run` → Liest `state.json`, erkennt den AI-Assistententyp, generiert Hilfsbefehle
- `factory continue` → Generiert Claude Code Berechtigungskonfiguration neu, startet neue Sitzung zur Fortsetzung

</details>

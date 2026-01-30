---
title: "Verzeichnisstruktur im Detail: Vollständige Struktur des Factory-Projekts und Verwendung der Dateien | AI App Factory Tutorial"
sidebarTitle: "Verzeichnisstruktur im Detail"
subtitle: "Verzeichnisstruktur im Detail: Vollständiger Leitfaden für Factory-Projekte"
description: "Lernen Sie die vollständige Verzeichnisstruktur und die Verwendung der Dateien im AI App Factory-Projekt kennen. Dieses Tutorial erklärt ausführlich die Funktionen und Dateifunktionen der Kernverzeichnisse wie agents, skills, policies und artifacts, hilft Ihnen, die Arbeitsweise von Factory-Projekten tiefgreifend zu verstehen, Konfigurationsdateien schnell zu lokalisieren und zu ändern sowie Pipeline-Probleme zu debuggen."
tags:
  - "Anhang"
  - "Verzeichnisstruktur"
  - "Projektarchitektur"
prerequisite:
  - "start-init-project"
order: 220
---

# Verzeichnisstruktur im Detail: Vollständiger Leitfaden für Factory-Projekte

## Was Sie nach diesem Tutorial können

- ✅ Die vollständige Verzeichnisstruktur von Factory-Projekten verstehen
- ✅ Den Zweck jedes Verzeichnisses und jeder Datei kennen
- ✅ Die Speichermethode von Artefakten verstehen
- ✅ Die Funktionen und Änderungsmethoden von Konfigurationsdateien beherrschen

## Kernkonzept

Factory-Projekte verwenden eine klare hierarchische Verzeichnisstruktur, die Konfigurationen, Code, Artefakte und Dokumentation trennt. Das Verstehen dieser Verzeichnisstrukturen hilft Ihnen, Dateien schnell zu lokalisieren, Konfigurationen zu ändern und Probleme zu debuggen.

Factory-Projekte haben zwei Formen:

**Form 1: Quellcode-Repository** (das Sie von GitHub klonen)
**Form 2: Initialisiertes Projekt** (das von `factory init` generiert wird)

Dieses Tutorial konzentriert sich auf **Form 2** – die Struktur des initialisierten Factory-Projekts, da dies das Verzeichnis ist, in dem Sie täglich arbeiten.

---

## Vollständige Struktur des Factory-Projekts

```
my-app/                          # Root-Verzeichnis Ihres Factory-Projekts
├── .factory/                    # Kernkonfigurationsverzeichnis von Factory (nicht manuell ändern)
│   ├── pipeline.yaml             # Pipeline-Definition (7 Phasen)
│   ├── config.yaml               # Projektkonfigurationsdatei (Tech Stack, MVP-Einschränkungen usw.)
│   ├── state.json                # Pipeline-Laufzustand (aktuelle Phase, abgeschlossene Phasen)
│   ├── agents/                   # Agent-Definitionen (Aufgabenbeschreibungen für KI-Assistenten)
│   ├── skills/                   # Skill-Module (wiederverwendbares Wissen)
│   ├── policies/                 # Richtliniendokumente (Berechtigungen, Fehlerbehandlung, Codestandards)
│   └── templates/                # Konfigurationsvorlagen (CI/CD, Git Hooks)
├── .claude/                      # Claude Code-Konfigurationsverzeichnis (automatisch generiert)
│   └── settings.local.json       # Claude Code-Berechtigungskonfiguration
├── input/                        # Benutzereingabeverzeichnis
│   └── idea.md                   # Strukturierte Produktidee (von Bootstrap generiert)
└── artifacts/                    # Pipeline-Artefaktverzeichnis (Ausgaben der 7 Phasen)
    ├── prd/                      # PRD-Artefakte
    │   └── prd.md                # Produktspezifikationsdokument
    ├── ui/                       # UI-Artefakte
    │   ├── ui.schema.yaml        # UI-Strukturdefinition
    │   └── preview.web/          # Vorschau-HTML-Prototyp
    │       └── index.html
    ├── tech/                     # Tech-Artefakte
    │   └── tech.md               # Technische Architekturdokumentation
    ├── backend/                  # Backend-Code (Express + Prisma)
    │   ├── src/                  # Quellcode
    │   ├── prisma/               # Datenbankkonfiguration
    │   │   ├── schema.prisma     # Prisma-Datenmodell
    │   │   └── seed.ts           # Seed-Daten
    │   ├── tests/                # Tests
    │   ├── docs/                 # API-Dokumentation
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── README.md
    ├── client/                   # Frontend-Code (React Native)
    │   ├── src/                  # Quellcode
    │   ├── __tests__/            # Tests
    │   ├── app.json
    │   ├── package.json
    │   └── README.md
    ├── validation/               # Validierungsartefakte
    │   └── report.md             # Codequalitätsvalidierungsbericht
    ├── preview/                  # Preview-Artefakte
    │   ├── README.md             # Bereitstellungs- und Ausführungsanleitung
    │   └── GETTING_STARTED.md    # Schnellstartanleitung
    ├── _failed/                  # Archiv für fehlgeschlagene Artefakte
    │   └── <stage-id>/           # Artefakte der fehlgeschlagenen Phase
    └── _untrusted/               # Isolierung unbefugter Artefakte
        └── <stage-id>/           # Von unbefugten Agenten geschriebene Dateien
```

---

## .factory/-Verzeichnis im Detail

Das `.factory/`-Verzeichnis ist das Kernstück des Factory-Projekts und enthält Pipeline-Definitionen, Agent-Konfigurationen und Richtliniendokumente. Dieses Verzeichnis wird automatisch durch den Befehl `factory init` erstellt und muss normalerweise nicht manuell geändert werden.

### pipeline.yaml - Pipeline-Definition

**Verwendung**: Definiert die Ausführungsreihenfolge der 7 Phasen, Eingaben/Ausgaben und Exit-Kriterien.

**Schlüsselinhalt**:
- 7 Phasen: bootstrap, prd, ui, tech, code, validation, preview
- Für jede Phase: Agent, Eingabedateien, Ausgabedateien
- Exit-Kriterien (exit_criteria): Validierungsstandards für den Phasenabschluss

**Beispiel**:
```yaml
stages:
  - id: bootstrap
    description: Initialisiere Produktidee
    agent: agents/bootstrap.agent.md
    inputs: []
    outputs:
      - input/idea.md
    exit_criteria:
      - idea.md existiert
      - idea.md beschreibt eine zusammenhängende Produktidee
```

**Wann zu ändern**: Normalerweise nicht erforderlich, es sei denn, Sie möchten den Pipeline-Ablauf anpassen.

### config.yaml - Projektkonfigurationsdatei

**Verwendung**: Konfiguriert globale Einstellungen wie Tech Stack, MVP-Einschränkungen und UI-Präferenzen.

**Hauptkonfigurationselemente**:
- `preferences`: Tech Stack-Präferenzen (Backend-Sprache, Datenbank, Frontend-Framework usw.)
- `mvp_constraints`: MVP-Bereichskontrolle (maximale Seitenzahl, maximale Modellzahl usw.)
- `ui_preferences`: UI-Design-Präferenzen (ästhetische Richtung, Farbschema)
- `pipeline`: Pipeline-Verhalten (Checkpoint-Modus, Fehlerbehandlung)
- `advanced`: Erweiterte Optionen (Agent-Timeout, Nebenläufigkeitssteuerung)

**Beispiel**:
```yaml
preferences:
  backend:
    language: typescript
    framework: express
    database: sqlite
  mvp_constraints:
    max_pages: 3
    enable_auth: false
```

**Wann zu ändern**: Wenn Sie den Tech Stack anpassen oder den MVP-Bereich ändern möchten.

### state.json - Pipeline-Status

**Verwendung**: Zeichnet den Laufstatus der Pipeline auf und unterstützt die Wiederaufnahme an Haltepunkten.

**Schlüsselinhalt**:
- `status`: Aktueller Status (idle/running/waiting_for_confirmation/paused/failed)
- `current_stage`: Aktuelle Phase
- `completed_stages`: Liste der abgeschlossenen Phasen
- `last_updated`: Zeit der letzten Aktualisierung

**Wann zu ändern**: Automatisch aktualisiert, nicht manuell ändern.

### agents/ - Agent-Definitionsverzeichnis

**Verwendung**: Definiert Verantwortlichkeiten, Eingaben/Ausgaben und Ausführungsbedingungen für jeden Agenten.

**Dateiliste**:
| Datei | Beschreibung |
|------|-------------|
| `orchestrator.checkpoint.md` | Orchestrator-Kerndefinition (Pipeline-Koordinierung) |
| `orchestrator-implementation.md` | Orchestrator-Implementierungsleitfaden (Entwicklungsreferenz) |
| `bootstrap.agent.md` | Bootstrap Agent (strukturierte Produktidee) |
| `prd.agent.md` | PRD Agent (Anforderungsdokumentgenerierung) |
| `ui.agent.md` | UI Agent (UI-Prototypdesign) |
| `tech.agent.md` | Tech Agent (Technische Architekturdesign) |
| `code.agent.md` | Code Agent (Codegenerierung) |
| `validation.agent.md` | Validation Agent (Codequalitätsvalidierung) |
| `preview.agent.md` | Preview Agent (Bereitstellungsanleitungsgenerierung) |

**Wann zu ändern**: Normalerweise nicht erforderlich, es sei denn, Sie möchten das Verhalten eines bestimmten Agenten anpassen.

### skills/ - Skill-Modulverzeichnis

**Verwendung**: Wiederverwendbare Wissensmodule, jeder Agent lädt die entsprechende Skill-Datei.

**Verzeichnisstruktur**:
```
skills/
├── bootstrap/skill.md         # Strukturierung von Produktideen
├── prd/skill.md               # PRD-Generierung
├── ui/skill.md                # UI-Design
├── tech/skill.md              # Technische Architektur + Datenbankmigration
├── code/skill.md              # Codegenerierung + Tests + Logging
│   └── references/            # Referenzvorlagen für Codegenerierung
│       ├── backend-template.md   # Produktionsreife Backend-Vorlage
│       └── frontend-template.md  # Produktionsreife Frontend-Vorlage
└── preview/skill.md           # Bereitstellungskonfiguration + Schnellstartanleitung
```

**Wann zu ändern**: Normalerweise nicht erforderlich, es sei denn, Sie möchten die Fähigkeiten eines bestimmten Skills erweitern.

### policies/ - Richtliniendokumentverzeichnis

**Verwendung**: Definiert Richtlinien für Berechtigungen, Fehlerbehandlung, Codestandards usw.

**Dateiliste**:
| Datei | Beschreibung |
|------|-------------|
| `capability.matrix.md` | Fähigkeitsgrenzmatrix (Agent-Lese-/Schreibberechtigungen) |
| `failure.policy.md` | Fehlerbehandlungsrichtlinie (Wiederholung, Rollback, menschliches Eingreifen) |
| `context-isolation.md` | Kontextisolierungsrichtlinie (Token-Einsparung) |
| `error-codes.md` | Einheitlicher Fehlercodestandard |
| `code-standards.md` | Codestandard (Codierungsstil, Dateistruktur) |
| `pr-template.md` | PR-Vorlage und Code-Prüfliste |
| `changelog.md` | Changelog-Generierungsstandard |

**Wann zu ändern**: Normalerweise nicht erforderlich, es sei denn, Sie möchten Richtlinien oder Standards anpassen.

### templates/ - Konfigurationsvorlagenverzeichnis

**Verwendung**: Konfigurationsvorlagen für CI/CD, Git Hooks usw.

**Dateiliste**:
| Datei | Beschreibung |
|------|-------------|
| `cicd-github-actions.md` | CI/CD-Konfiguration (GitHub Actions) |
| `git-hooks-husky.md` | Git Hooks-Konfiguration (Husky) |

**Wann zu ändern**: Normalerweise nicht erforderlich, es sei denn, Sie möchten den CI/CD-Ablauf anpassen.

---

## .claude/-Verzeichnis im Detail

### settings.local.json - Claude Code-Berechtigungskonfiguration

**Verwendung**: Definiert die Verzeichnisse und Vorgänge, auf die Claude Code zugreifen darf.

**Wann generiert**: Automatisch bei `factory init`.

**Wann zu ändern**: Normalerweise nicht erforderlich, es sei denn, Sie möchten den Berechtigungsbereich anpassen.

---

## input/-Verzeichnis im Detail

### idea.md - Strukturierte Produktidee

**Verwendung**: Speichert eine strukturierte Produktidee, die vom Bootstrap Agent generiert wurde.

**Generierungszeitpunkt**: Nach Abschluss der Bootstrap-Phase.

**Inhaltsstruktur**:
- Problembeschreibung (Problem)
- Zielbenutzer (Target Users)
- Kernwert (Core Value)
- Annahmen (Assumptions)
- Nicht-Ziele (Out of Scope)

**Wann zu ändern**: Wenn Sie die Produktrichtung anpassen möchten, können Sie manuell bearbeiten und dann Bootstrap oder nachfolgende Phasen erneut ausführen.

---

## artifacts/-Verzeichnis im Detail

Das `artifacts/`-Verzeichnis ist der Speicherort für Pipeline-Artefakte. Jede Phase schreibt ihre Artefakte in das entsprechende Unterverzeichnis.

### prd/ - PRD-Artefaktverzeichnis

**Artefaktdateien**:
- `prd.md`: Produktspezifikationsdokument

**Inhalt**:
- User Stories
- Feature-Liste
- Nicht-funktionale Anforderungen
- Nicht-Ziele

**Generierungszeitpunkt**: Nach Abschluss der PRD-Phase.

### ui/ - UI-Artefaktverzeichnis

**Artefaktdateien**:
- `ui.schema.yaml`: UI-Strukturdefinition (Seiten, Komponenten, Interaktionen)
- `preview.web/index.html`: Vorschau-HTML-Prototyp

**Inhalt**:
- Seitenstruktur (Seitenanzahl, Layout)
- Komponentendefinitionen (Schaltflächen, Formulare, Listen usw.)
- Interaktionsflüsse (Navigation, Weiterleitungen)
- Designsystem (Farbschema, Schriftarten, Abstände)

**Generierungszeitpunkt**: Nach Abschluss der UI-Phase.

**Vorschaumethode**: Öffnen Sie `preview.web/index.html` im Browser.

### tech/ - Tech-Artefaktverzeichnis

**Artefaktdateien**:
- `tech.md`: Technische Architekturdokumentation

**Inhalt**:
- Tech Stack-Auswahl (Backend, Frontend, Datenbank)
- Datenmodelldesign
- API-Endpunkt-Design
- Sicherheitsrichtlinien
- Leistungsoptimierungsempfehlungen

**Generierungszeitpunkt**: Nach Abschluss der Tech-Phase.

### backend/ - Backend-Codeverzeichnis

**Artefaktdateien**:
```
backend/
├── src/                      # Quellcode
│   ├── routes/               # API-Routen
│   ├── services/             # Geschäftslogik
│   ├── middleware/           # Middleware
│   └── utils/               # Hilfsfunktionen
├── prisma/                   # Prisma-Konfiguration
│   ├── schema.prisma         # Prisma-Datenmodell
│   └── seed.ts              # Seed-Daten
├── tests/                    # Tests
│   ├── unit/                 # Einheitstests
│   └── integration/          # Integrationstests
├── docs/                     # Dokumentation
│   └── api-spec.yaml        # API-Spezifikation (Swagger)
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

**Inhalt**:
- Express Backend-Server
- Prisma ORM (SQLite/PostgreSQL)
- Vitest-Testframework
- Swagger API-Dokumentation

**Generierungszeitpunkt**: Nach Abschluss der Code-Phase.

### client/ - Frontend-Codeverzeichnis

**Artefaktdateien**:
```
client/
├── src/                      # Quellcode
│   ├── screens/              # Seiten
│   ├── components/           # Komponenten
│   ├── navigation/           # Navigationskonfiguration
│   ├── services/             # API-Services
│   └── utils/               # Hilfsfunktionen
├── __tests__/               # Tests
│   └── components/          # Komponententests
├── assets/                  # Statische Ressourcen
├── app.json                 # Expo-Konfiguration
├── package.json
├── tsconfig.json
└── README.md
```

**Inhalt**:
- React Native + Expo
- React Navigation
- Jest + React Testing Library
- TypeScript

**Generierungszeitpunkt**: Nach Abschluss der Code-Phase.

### validation/ - Validierungsartefaktverzeichnis

**Artefaktdateien**:
- `report.md`: Codequalitätsvalidierungsbericht

**Inhalt**:
- Abhängigkeitsinstallationsvalidierung
- TypeScript-Typprüfung
- Prisma-Schema-Validierung
- Testabdeckung

**Generierungszeitpunkt**: Nach Abschluss der Validation-Phase.

### preview/ - Preview-Artefaktverzeichnis

**Artefaktdateien**:
- `README.md`: Bereitstellungs- und Ausführungsanleitung
- `GETTING_STARTED.md`: Schnellstartanleitung

**Inhalt**:
- Lokale Ausführungsschritte
- Docker-Bereitstellungskonfiguration
- CI/CD-Pipeline
- Zugriffsadressen und Demo-Flüsse

**Generierungszeitpunkt**: Nach Abschluss der Preview-Phase.

### _failed/ - Archiv für fehlgeschlagene Artefakte

**Verwendung**: Speichert Artefakte fehlgeschlagener Phasen, um das Debuggen zu erleichtern.

**Verzeichnisstruktur**:
```
_failed/
├── bootstrap/
├── prd/
├── ui/
├── tech/
├── code/
├── validation/
└── preview/
```

**Wann generiert**: Nach zwei aufeinanderfolgenden Fehlschlägen einer Phase.

### _untrusted/ - Isolierung unbefugter Artefakte

**Verwendung**: Speichert von unbefugten Agenten geschriebene Dateien, um die Hauptartefakte nicht zu verunreinigen.

**Verzeichnisstruktur**:
```
_untrusted/
├── bootstrap/
├── prd/
├── ui/
├── tech/
├── code/
├── validation/
└── preview/
```

**Wann generiert**: Wenn ein Agent versucht, in ein nicht autorisiertes Verzeichnis zu schreiben.

---

## Häufig gestellte Fragen

### 1. Kann ich Dateien unter .factory/ manuell ändern?

::: warning Vorsicht beim Ändern
Es wird **nicht empfohlen**, Dateien unter `.factory/` direkt zu ändern, es sei denn, Sie wissen genau, was Sie tun. Falsche Änderungen können dazu führen, dass die Pipeline nicht ordnungsgemäß ausgeführt werden kann.

Wenn Sie Konfigurationen anpassen müssen, sollten Sie vorrangig die Datei `config.yaml` ändern.
:::

### 2. Können Dateien unter artifacts/ manuell geändert werden?

**Ja**. Dateien unter `artifacts/` sind Ausgabeartefakte der Pipeline. Sie können:

- `input/idea.md` oder `artifacts/prd/prd.md` ändern, um die Produktrichtung anzupassen
- Code in `artifacts/backend/` oder `artifacts/client/` manuell reparieren
- Stile in `artifacts/ui/preview.web/index.html` anpassen

Nach Änderungen können Sie die Pipeline ab der entsprechenden Phase erneut ausführen.

### 3. Wie werden Dateien unter _failed/ und _untrusted/ behandelt?

- **_failed/**: Überprüfen Sie die Fehlerursache und führen Sie die Phase erneut aus, nachdem Sie das Problem behoben haben.
- **_untrusted/**: Bestätigen Sie, ob die Dateien vorhanden sein sollten, und verschieben Sie sie bei Bedarf in das richtige Verzeichnis.

### 4. Was tun, wenn die Datei state.json beschädigt ist?

Wenn `state.json` beschädigt ist, können Sie den folgenden Befehl zum Zurücksetzen ausführen:

```bash
factory reset
```

### 5. Wie kann ich den aktuellen Status der Pipeline anzeigen?

Führen Sie den folgenden Befehl aus, um den aktuellen Status anzuzeigen:

```bash
factory status
```

---

## Zusammenfassung

In diesem Lektion haben wir die vollständige Verzeichnisstruktur von Factory-Projekten ausführlich erläutert:

- ✅ `.factory/`: Factory-Kernkonfiguration (pipeline, agents, skills, policies)
- ✅ `.claude/`: Claude Code-Berechtigungskonfiguration
- ✅ `input/`: Benutzereingaben (idea.md)
- ✅ `artifacts/`: Pipeline-Artefakte (prd, ui, tech, backend, client, validation, preview)
- ✅ `_failed/` und `_untrusted/`: Archivierung für fehlgeschlagene und unbefugte Artefakte

Das Verstehen dieser Verzeichnisstrukturen hilft Ihnen, Dateien schnell zu lokalisieren, Konfigurationen zu ändern und Probleme zu debuggen.

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Code-Standards](../code-standards/)**.
>
> Sie werden lernen:
> - TypeScript-Codierungsstandards
> - Dateistruktur und Namenskonventionen
> - Kommentare und Dokumentationsanforderungen
> - Git-Commit-Nachricht-Standards

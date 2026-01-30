---
title: "Changelog: Versionshistorie und Funktionsänderungen | Agent App Factory"
sidebarTitle: "Changelog"
subtitle: "Changelog: Versionshistorie und Funktionsänderungen | Agent App Factory"
description: "Erfahren Sie mehr über die Versionshistorie, Funktionsänderungen, Bugfixes und wichtige Verbesserungen von Agent App Factory. Diese Seite dokumentiert die vollständige Änderungshistorie ab Version 1.0.0, einschließlich Kernfunktionen wie dem 7-Stufen-Pipeline-System, dem Sisyphus-Scheduler, Berechtigungsmanagement, Kontextoptimierung und Fehlerbehandlungsstrategien."
tags:
- "Changelog"
- "Versionshistorie"
prerequisite: []
order: 250
---

# Changelog

Diese Seite dokumentiert die Versionshistorie von Agent App Factory, einschließlich neuer Funktionen, Verbesserungen, Bugfixes und Breaking Changes.

Das Format folgt den [Keep a Changelog](https://keepachangelog.com/de/1.0.0/) Konventionen, die Versionsnummern folgen [Semantic Versioning](https://semver.org/lang/de/).

## [1.0.0] - 2024-01-29

### Hinzugefügt

**Kernfunktionen**
- **7-Stufen-Pipeline-System**: Vollständiger automatisierter Workflow von der Idee bis zur ausführbaren Anwendung
  - Bootstrap - Strukturierung der Produktidee (input/idea.md)
  - PRD - Erstellung des Product Requirement Documents (artifacts/prd/prd.md)
  - UI - Design der UI-Struktur und Vorschau-Prototypen (artifacts/ui/)
  - Tech - Design der technischen Architektur und Prisma-Datenmodelle (artifacts/tech/)
  - Code - Generierung von Frontend- und Backend-Code (artifacts/backend/, artifacts/client/)
  - Validation - Überprüfung der Code-Qualität (artifacts/validation/report.md)
  - Preview - Erstellung der Deployment-Anleitung (artifacts/preview/README.md)

- **Sisyphus-Scheduler**: Kernkomponente der Pipeline-Steuerung
  - Sequentielle Ausführung der in pipeline.yaml definierten Stages
  - Validierung der Ein-/Ausgaben und Exit-Kriterien jeder Phase
  - Verwaltung des Pipeline-Status (.factory/state.json)
  - Durchführung von Berechtigungsprüfungen zur Verhinderung unautorisierter Zugriffe
  - Behandlung von Ausnahmen gemäß der Fehlerbehandlungsstrategie
  - Pausieren an jedem Checkpoint zur manuellen Bestätigung

**CLI-Tools**
- `factory init` - Initialisierung eines Factory-Projekts
- `factory run [stage]` - Ausführung der Pipeline (ab aktueller oder angegebener Phase)
- `factory continue` - Fortsetzung in neuer Sitzung (Token-Einsparung)
- `factory status` - Anzeige des aktuellen Projektstatus
- `factory list` - Auflistung aller Factory-Projekte
- `factory reset` - Zurücksetzen des aktuellen Projektstatus

**Berechtigungen und Sicherheit**
- **Capability Boundary Matrix** (capability.matrix.md): Definiert strikte Lese-/Schreibberechtigungen für jeden Agent
  - Jeder Agent kann nur auf autorisierte Verzeichnisse zugreifen
  - Unautorisierte Dateischreibvorgänge werden nach artifacts/_untrusted/ verschoben
  - Automatisches Pausieren der Pipeline bei Verstößen zur manuellen Intervention

**Kontextoptimierung**
- **Sitzungsbasierte Ausführung**: Jede Phase wird in einer neuen Sitzung ausgeführt
  - Vermeidung von Kontextakkumulation, Token-Einsparung
  - Unterstützung für Unterbrechung und Wiederaufnahme
  - Kompatibel mit allen KI-Assistenten (Claude Code, OpenCode, Cursor)

**Fehlerbehandlungsstrategien**
- Automatischer Retry-Mechanismus: Jede Phase kann einmal wiederholt werden
- Fehlerarchivierung: Fehlgeschlagene Artefakte werden nach artifacts/_failed/ verschoben
- Rollback-Mechanismus: Zurücksetzen auf den letzten erfolgreichen Checkpoint
- Manuelle Intervention: Pause nach zwei aufeinanderfolgenden Fehlern

**Qualitätssicherung**
- **Code-Standards** (code-standards.md)
  - TypeScript-Codierungsstandards und Best Practices
  - Dateistruktur und Namenskonventionen
  - Anforderungen an Kommentare und Dokumentation
  - Git-Commit-Nachrichten-Konventionen (Conventional Commits)

- **Fehlercode-Spezifikation** (error-codes.md)
  - Einheitliche Fehlercode-Struktur: [MODULE]_[ERROR_TYPE]_[SPECIFIC]
  - Standard-Fehlertypen: VALIDATION, NOT_FOUND, FORBIDDEN, CONFLICT, INTERNAL_ERROR
  - Frontend-Backend-Fehlercode-Mapping und benutzerfreundliche Meldungen

**Changelog-Verwaltung**
- Einhaltung des Keep a Changelog-Formats
- Integration mit Conventional Commits
- Unterstützung durch Automatisierungstools: conventional-changelog-cli, release-it

**Konfigurationsvorlagen**
- CI/CD-Konfiguration (GitHub Actions)
- Git Hooks-Konfiguration (Husky)

**Generierte Anwendungsfunktionen**
- Vollständiger Frontend- und Backend-Code (Express + Prisma + React Native)
- Unit-Tests und Integrationstests (Vitest + Jest)
- API-Dokumentation (Swagger/OpenAPI)
- Datenbank-Seed-Daten
- Docker-Deployment-Konfiguration
- Fehlerbehandlung und Log-Monitoring
- Performance-Optimierung und Sicherheitsprüfungen

### Verbessert

**MVP-Fokus**
- Klare Definition von Non-Goals zur Verhinderung von Scope Creep
- Begrenzung der Seitenanzahl auf maximal 3 Seiten
- Fokus auf Kernfunktionen, Vermeidung von Over-Engineering

**Trennung der Verantwortlichkeiten**
- Jeder Agent ist nur für seinen eigenen Bereich zuständig
- PRD enthält keine technischen Details, Tech befasst sich nicht mit UI-Design
- Code-Agent implementiert strikt nach UI-Schema und Tech-Design

**Verifizierbarkeit**
- Jedes Stadium definiert klare exit_criteria
- Alle Funktionen sind testbar und lokal ausführbar
- Artefakte müssen strukturiert sein und von nachfolgenden Stufen konsumiert werden können

### Technologie-Stack

**CLI-Tools**
- Node.js >= 16.0.0
- Commander.js - Kommandozeilen-Framework
- Chalk - Farbige Terminal-Ausgabe
- Ora - Fortschrittsanzeige
- Inquirer - Interaktive Kommandozeile
- fs-extra - Dateisystem-Operationen
- YAML - YAML-Parsing

**Generierte Anwendungen**
- Backend: Node.js + Express + Prisma + TypeScript + Vitest
- Frontend: React Native + Expo + TypeScript + Jest + React Testing Library
- Deployment: Docker + GitHub Actions

### Abhängigkeiten

- `chalk@^4.1.2` - Terminal-Farbstile
- `commander@^11.0.0` - Kommandozeilen-Argument-Parsing
- `fs-extra@^11.1.1` - Dateisystem-Erweiterungen
- `inquirer@^8.2.5` - Interaktive Kommandozeile
- `ora@^5.4.1` - Elegante Terminal-Loader
- `yaml@^2.3.4` - YAML-Parsing und Serialisierung

## Versionshinweise

### Semantic Versioning

Dieses Projekt folgt dem [Semantic Versioning](https://semver.org/lang/de/) Versionsnummernformat: MAJOR.MINOR.PATCH

- **MAJOR**: Inkompatible API-Änderungen
- **MINOR**: Rückwärtskompatible neue Funktionen
- **PATCH**: Rückwärtskompatible Bugfixes

### Änderungstypen

- **Hinzugefügt** (Added): Neue Funktionen
- **Geändert** (Changed): Änderungen bestehender Funktionen
- **Veraltet** (Deprecated): Funktionen, die bald entfernt werden
- **Entfernt** (Removed): Entfernte Funktionen
- **Behoben** (Fixed): Bugfixes
- **Sicherheit** (Security): Sicherheitsfixes

## Zugehörige Ressourcen

- [GitHub Releases](https://github.com/hyz1992/agent-app-factory/releases) - Offizielle Release-Seite
- [Projekt-Repository](https://github.com/hyz1992/agent-app-factory) - Quellcode
- [Issue-Tracking](https://github.com/hyz1992/agent-app-factory/issues) - Feedback und Vorschläge
- [Contributing Guide](https://github.com/hyz1992/agent-app-factory/blob/main/CONTRIBUTING.md) - Wie Sie beitragen können

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Erweitern der Quellcode-Positionen</strong></summary>

> Aktualisiert am: 2024-01-29

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| package.json | [`package.json`](https://github.com/hyz1992/agent-app-factory/blob/main/package.json) | 1-52 |
| CLI-Einstieg | [`cli/bin/factory.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/bin/factory.js) | 1-123 |
| Init-Befehl | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 1-427 |
| Run-Befehl | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js) | 1-294 |
| Continue-Befehl | [`cli/commands/continue.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/continue.js) | 1-87 |
| Pipeline-Definition | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 1-87 |
| Scheduler-Definition | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 1-301 |
| Berechtigungsmatrix | [`policies/capability.matrix.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/capability.matrix.md) | 1-44 |
| Fehlerstrategie | [`policies/failure.policy.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/failure.policy.md) | 1-200 |
| Code-Standards | [`policies/code-standards.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/code-standards.md) | 1-287 |
| Fehlercode-Spezifikation | [`policies/error-codes.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/error-codes.md) | 1-134 |
| Changelog-Spezifikation | [`policies/changelog.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/changelog.md) | 1-87 |

**Wichtige Versionsinformationen**:
- `version = "1.0.0"`: Initiale Release-Version
- `engines.node = ">=16.0.0"`: Minimale Node.js-Versionsanforderung

**Abhängigkeitsversionen**:
- `chalk@^4.1.2`: Terminal-Farbstile
- `commander@^11.0.0`: Kommandozeilen-Argument-Parsing
- `fs-extra@^11.1.1`: Dateisystem-Erweiterungen
- `inquirer@^8.2.5`: Interaktive Kommandozeile
- `ora@^5.4.1`: Elegante Terminal-Loader
- `yaml@^2.3.4`: YAML-Parsing und Serialisierung

</details>

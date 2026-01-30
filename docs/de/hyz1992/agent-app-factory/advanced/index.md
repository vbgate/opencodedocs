---
title: "Fortgeschritten: Pipelines und interne Mechanismen | AI App Factory Tutorial"
sidebarTitle: "Fortgeschritten: Pipelines"
subtitle: "Fortgeschritten: Pipelines und interne Mechanismen"
description: "Vertiefen Sie Ihr Verständnis des 7-Phasen-Pipelines, des Sisyphus-Schedulers, der Berechtigungs- und Sicherheitsmechanismen sowie der Fehlerbehandlungsstrategien von AI App Factory. Meistern Sie Kontextoptimierung und fortgeschrittene Konfigurationstechniken."
tags:
  - "Pipeline"
  - "Scheduler"
  - "Berechtigungen und Sicherheit"
  - "Fehlerbehandlung"
prerequisite:
  - "start-pipeline-overview"
order: 80
---

# Fortgeschritten: Pipelines und interne Mechanismen

Dieses Kapitel bietet eine eingehende Erklärung der Kernmechanismen und fortgeschrittenen Funktionen von AI App Factory, einschließlich der detaillierten Arbeitsweise des 7-Phasen-Pipelines, der Scheduling-Strategien des Sisyphus-Schedulers, der Berechtigungs- und Sicherheitsmechanismen, der Fehlerbehandlungsstrategien sowie der Optimierung des Kontexts zur Senkung der Token-Kosten.

::: warning Voraussetzungen
Vergewissern Sie sich vor dem Studium dieses Kapitels, dass Sie folgende Schritte abgeschlossen haben:
- [Schnellstart](../../start/getting-started/) und [Installation und Konfiguration](../../start/installation/)
- [7-Phasen-Pipeline-Übersicht](../../start/pipeline-overview/)
- [Plattformintegration](../../platforms/claude-code/) Konfiguration
:::

## Kapitelinhalt

Dieses Kapitel behandelt folgende Themen:

### Detaillierte 7-Phasen-Pipeline

- **[Phase 1: Bootstrap - Strukturierung von Produktideen](stage-bootstrap/)**
  - Lernen Sie, wie vage Produktkonzepte in strukturierte Dokumente verwandelt werden
  - Verstehen Sie das Ein- und Ausgabeformat des Bootstrap-Agenten

- **[Phase 2: PRD - Erstellung von Produktanforderungsdokumenten](stage-prd/)**
  - Generierung eines MVP-PRD mit User Stories, Funktionslisten und Nicht-Zielen
  - Beherrschung von Anforderungszerlegung und Priorisierungstechniken

- **[Phase 3: UI - Interface- und Prototyp-Design](stage-ui/)**
  - Nutzung der ui-ux-pro-max-Skill für UI-Struktur und vorschaufähige Prototypen
  - Verstehen des UI-Design-Prozesses und bewährter Verfahren

- **[Phase 4: Tech - Technische Architektur-Design](stage-tech/)**
  - Entwicklung einer minimal durchführbaren technischen Architektur und Prisma-Datenmodells
  - Beherrschung von Technologieauswahl und Architekturprinzipien

- **[Phase 5: Code - Generierung ausführbarer Implementierung](stage-code/)**
  - Erstellung von Frontend- und Backend-Code, Tests und Konfigurationen basierend auf UI-Schema und Tech-Design
  - Verstehen des Code-Generierungsprozesses und Template-Systems

- **[Phase 6: Validierung - Qualitätssicherung der Implementierung](stage-validation/)**
  - Überprüfung von Abhängigkeitsinstallation, Typisierung, Prisma-Schema und Codequalität
  - Meistern automatisierter Qualitätsprüfungsprozesse

- **[Phase 7: Preview - Bereitstellungsdokumentation](stage-preview/)**
  - Erstellung vollständiger Ausführungs- und Bereitstellungsdokumentation
  - Integration von CI/CD und Git-Hooks-Konfiguration

### Interne Mechanismen

- **[Sisyphus-Scheduler-Detaillierung](orchestrator/)**
  - Verstehen Sie, wie der Scheduler Pipelines koordiniert, Status verwaltet und Berechtigungsprüfungen durchführt
  - Beherrschung von Scheduling-Strategien und Zustandsautomatenprinzipien

- **[Kontextoptimierung: Session-basierte Ausführung](context-optimization/)**
  - Lernen Sie die Nutzung von `factory continue` zur Token-Effizienz
  - Meistern Sie bewährte Verfahren für die Neuerstellung von Sitzungen in jeder Phase

- **[Berechtigungs- und Sicherheitsmechanismen](security-permissions/)**
  - Verstehen von Capability-Boundary-Matrizen, Überberechtigungsbehandlung und Sicherheitsprüfungsmechanismen
  - Beherrschung von Sicherheitskonfigurationen und Rechtemanagement

- **[Fehlerbehandlung und Rollback](failure-handling/)**
  - Erlernen Sie Fehleridentifikation, Wiederholungsmechanismen, Rollback-Strategien und manuelle Interventionsprozesse
  - Meistern Sie Fehlerbehebung und Wiederherstellungstechniken

## Lernpfad-Empfehlungen

### Empfohlene Lernreihenfolge

1. **Absolvieren Sie zuerst die 7-Phasen-Pipeline** (in Reihenfolge)
   - Bootstrap → PRD → UI → Tech → Code → Validierung → Preview
   - Jede Phase hat klare Eingaben und Ausgaben, das sequenzielle Lernen schafft ein vollständiges Verständnis

2. **Lernen Sie anschließend Scheduler und Kontextoptimierung**
   - Verstehen Sie, wie Sisyphus diese 7 Phasen koordiniert
   - Lernen Sie, wie Sie den Kontext optimieren können, um Token-Kosten zu sparen

3. **Lernen Sie zuletzt Sicherheit und Fehlerbehandlung**
   - Meistern Sie Berechtigungsgrenzen und Sicherheitsmechanismen
   - Verstehen Sie Fehlerszenarien und Bewältigungsstrategien

### Lernschwerpunkte für verschiedene Rollen

| Rolle | Wichtige Kapitel |
| ---- | ------------ |
| **Entwickler** | Code, Validierung, Tech, Orchestrator |
| **Produktmanager** | Bootstrap, PRD, UI, Preview |
| **Technischer Leiter** | Tech, Code, Sicherheit, Fehlerbehandlung |
| **DevOps-Ingenieur** | Validierung, Preview, Kontextoptimierung |

## Nächste Schritte

Nach Abschluss dieses Kapitels können Sie weiter lernen:

- **[Häufig gestellte Fragen und Fehlerbehebung](../../faq/troubleshooting/)** - Lösung von Problemen bei der tatsächlichen Nutzung
- **[Bewährte Verfahren](../../faq/best-practices/)** - Meistern Sie Techniken für die effiziente Nutzung von Factory
- **[CLI-Befehlsreferenz](../../appendix/cli-commands/)** - Vollständige Befehlsliste anzeigen
- **[Codestandards](../../appendix/code-standards/)** - Verstehen Sie die Standards, die der generierte Code einhalten muss

---

💡 **Tipp**: Wenn Sie bei der Nutzung auf Probleme stoßen, konsultieren Sie zuerst das Kapitel [Häufig gestellte Fragen und Fehlerbehebung](../../faq/troubleshooting/).

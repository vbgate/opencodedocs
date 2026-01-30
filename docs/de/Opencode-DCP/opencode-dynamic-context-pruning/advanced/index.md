---
title: "Erweiterte Funktionen: Tiefenanalyse | opencode-dcp"
sidebarTitle: "Vermeidung versehentlichen Löschens kritischer Inhalte"
subtitle: "Erweiterte Funktionen: Tiefenanalyse"
description: "Lernen Sie die Schutzmechanismen, Zustandspersistenz und andere erweiterte Funktionen von DCP kennen. Beherrschen Sie Techniken für komplexe Szenarien, vermeiden Sie versehentliches Beschneiden kritischer Inhalte und optimieren Sie die Caching-Trefferquote."
order: 30
---

# Erweiterte Funktionen

Dieser Abschnitt behandelt die erweiterten Funktionen von DCP, hilft Ihnen, die internen Mechanismen des Plugins zu verstehen, und zeigt Ihnen, wie Sie DCP in komplexen Szenarien korrekt verwenden.

::: warning Voraussetzungen
Stellen Sie vor dem Studium dieses Abschnitts sicher, dass Sie Folgendes abgeschlossen haben:
- [Installation und Schnellstart](../start/getting-started/) – Grundlagen der Installation und Verwendung von DCP verstehen
- [Konfigurationsübersicht](../start/configuration/) – Mit dem Konfigurationssystem von DCP vertraut sein
- [Automatische Beschneidungsstrategien](../platforms/auto-pruning/) – Die Kern-Beschneidungsstrategien von DCP verstehen
:::

## Inhalt dieses Kapitels

| Kurs | Beschreibung | Geeignet für |
|--- | --- | ---|
| [Schutzmechanismen](./protection/) | Schutz für Konversationen, geschützte Tools und Dateimuster | Vermeidung versehentlichen Beschneidens kritischer Inhalte |
| [Zustandspersistenz](./state-persistence/) | Wie DCP Beschneidungsstatus und Statistiken über Sitzungen hinweg speichert | Verständnis der Datenspeicherungsmechanismen |
| [Einfluss auf Prompt-Caching](./prompt-caching/) | Auswirkungen der DCP-Beschneidung auf Prompt Caching | Optimierung der Caching-Trefferquote |
| [Unteragenten-Verarbeitung](./subagent-handling/) | Verhalten und Einschränkungen von DCP in Unteragenten-Sitzungen | Bei Verwendung des Task-Tools |

## Empfohlener Lernpfad

```
Schutzmechanismen → Zustandspersistenz → Prompt-Caching → Unteragenten-Verarbeitung
       ↓                    ↓                     ↓                        ↓
   Pflichtkurs        Bei Bedarf        Für Performance-Optimierung   Bei Verwendung von Unteragenten
```

**Empfohlene Reihenfolge**:

1. **Schutzmechanismen** (Pflicht) – Die wichtigste erweiterte Funktion; Verständnis davon hilft, versehentliches Löschen kritischer Inhalte durch DCP zu vermeiden
2. **Zustandspersistenz** (bei Bedarf) – Wenn Sie wissen möchten, wie DCP Statistiken speichert, oder Probleme mit Zuständen debuggen müssen
3. **Einfluss auf Prompt-Caching** (für Performance-Optimierung) – Wenn Sie sich auf API-Kostenoptimierung konzentrieren, müssen Sie das Verhältnis zwischen Beschneidung und Caching abwägen
4. **Unteragenten-Verarbeitung** (bei Verwendung von Unteragenten) – Wenn Sie das Task-Tool von OpenCode verwenden, um Unteraufgaben zu verteilen, müssen Sie die Einschränkungen von DCP verstehen

## Nächste Schritte

Nach Abschluss dieses Abschnitts können Sie:

- [Häufig gestellte Fragen und Fehlerbehebung](../faq/troubleshooting/) für Problemlösungen während der Verwendung konsultieren
- [Best Practices](../faq/best-practices/) lesen, um zu erfahren, wie Sie die Token-Einsparungen maximieren können
- [Architekturübersicht](../appendix/architecture/) für detaillierte Informationen zur internen Implementierung von DCP studieren

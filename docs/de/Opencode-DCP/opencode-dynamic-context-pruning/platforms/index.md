---
title: "Kernfunktionen: Drei Hauptfähigkeiten | opencode-dcp"
sidebarTitle: "Drei Hauptfähigkeiten freischalten"
subtitle: "Kernfunktionen: Drei Hauptfähigkeiten"
description: "Lernen Sie die drei Kernfunktionen von opencode-dcp: automatische Beschneidungsstrategien, LLM-gesteuerte Tools und Slash-Befehle. Nutzen Sie diese Funktionen vollständig zur Token-Optimierung."
order: 20
---

# Kernfunktionen

In diesem Kapitel werden die drei Kernfähigkeiten von DCP eingehend erläutert: automatische Beschneidungsstrategien, LLM-gesteuerte Tools und Slash-Befehle. Nachdem Sie diese Funktionen beherrschen, können Sie das Token-Optimierungspotenzial von DCP voll ausschöpfen.

## Kapitelinhalt

<div class="grid-cards">

### [Automatische Beschneidungsstrategien](./auto-pruning/)

Verstehen Sie im Detail, wie die drei automatischen Strategien von DCP funktionieren: Deduplizierungsstrategie, Überschreibungsstrategie und Fehlerbereinigungsstrategie. Erfahren Sie die Auslösebedingungen und Anwendungsszenarien für jede Strategie.

### [LLM-gesteuerte Beschneidungstools](./llm-tools/)

Verstehen Sie, wie KI autonom die Tools `discard` und `extract` aufruft, um den Kontext zu optimieren. Dies ist die intelligenteste Funktion von DCP, bei der KI aktiv an der Kontextverwaltung teilnimmt.

### [Slash-Befehle verwenden](./commands/)

Beherrschen Sie die Verwendung aller DCP-Befehle: `/dcp context` zum Anzeigen des Kontextstatus, `/dcp stats` zum Anzeigen von Statistiken, `/dcp sweep` zum manuellen Auslösen der Beschneidung.

</div>

## Lernpfad

Es wird empfohlen, den Inhalt dieses Kapitels in der folgenden Reihenfolge zu lernen:

```
Automatische Beschneidungsstrategien → LLM-gesteuerte Tools → Slash-Befehle
              ↓                              ↓                       ↓
        Prinzipien verstehen          Intelligente Beschneidung   Überwachung und
                                             beherrschen          Debugging lernen
```

1. **Beginnen Sie mit automatischen Beschneidungsstrategien**: Dies ist die Grundlage von DCP. Verstehen Sie die Funktionsweise der drei Strategien.
2. **Lernen Sie dann LLM-gesteuerte Tools**: Nachdem Sie die automatischen Strategien verstanden haben, lernen Sie die fortschrittlicheren KI-aktiven Beschneidungsfähigkeiten.
3. **Lernen Sie abschließend Slash-Befehle**: Beherrschen Sie die Methoden zur Überwachung und manuellen Steuerung, um Debugging und Optimierung zu erleichtern.

::: tip Voraussetzungen
Bevor Sie dieses Kapitel lernen, stellen Sie sicher, dass Sie Folgendes abgeschlossen haben:
- [Installation und Schnellstart](../start/getting-started/) - Installation des DCP-Plugins abgeschlossen
- [Komplette Konfiguration](../start/configuration/) - Grundlegende Konzepte des Konfigurationssystems verstanden
:::

## Nächste Schritte

Nach Abschluss dieses Kapitels können Sie weiter erkunden:

- **[Schutzmechanismen](../advanced/protection/)** - Lernen Sie, wie Sie wichtige Inhalte vor versehentlicher Beschneidung schützen
- **[Status-Persistenz](../advanced/state-persistence/)** - Erfahren Sie, wie DCP den Status über Sitzungen hinweg beibehält
- **[Prompt-Caching-Auswirkungen](../advanced/prompt-caching/)** - Verstehen Sie die Abwägungen zwischen DCP und Prompt Caching

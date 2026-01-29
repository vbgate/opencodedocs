---
title: "Erweiterte Funktionen: Optimierung | opencode-supermemory"
sidebarTitle: "Erweiterte Funktionen"
subtitle: "Erweiterte Funktionen: Optimierung"
order: 3
description: "Lernen Sie die tiefgehenden Mechanismen und Konfigurationsoptionen von Supermemory. Optimieren Sie die Speicher-Engine und passen Sie das Pluginverhalten an Ihre Projektanforderungen an."
---

# Erweiterte Funktionen

Dieses Kapitel erklärt tiefgehend die zugrundeliegenden Mechanismen und erweiterten Konfigurationsoptionen von Supermemory. Sie lernen, wie Sie die Leistung der Speicher-Engine optimieren und das Pluginverhalten nach Projektanforderungen anpassen.

## Dieses Kapitel enthält

<div class="grid-cards">

### [Präemptive Komprimierungsprinzipien](./compaction/)

Verstehen Sie den durch Token-Schwellenwert ausgelösten automatischen Komprimierungsmechanismus. Lernen Sie, wie Supermemory vor dem Überlauf des Kontexts automatisch strukturierte Zusammenfassungen generiert und persistent speichert, um "Vergesslichkeit" in langen Sitzungen zu verhindern.

### [Tiefenkonfiguration-Detaillierung](./configuration/)

Passen Sie Komprimierungsschwellenwerte, Schlüsselwortauslöseregeln und Suchparameter an. Meistern Sie alle Konfigurationsoptionen der Konfigurationsdatei, damit Supermemory perfekt an Ihren Workflow angepasst wird.

</div>

## Lernpfad

```
┌─────────────────────────────────────────────────────────────┐
│  Schritt 1          Schritt 2                                │
│  Präemptive Komprimierungsprinzipien  →   Tiefenkonfiguration-Detaillierung  │
│  (Mechanismus verstehen)           (Anpassen)               │
└─────────────────────────────────────────────────────────────┘
```

**Empfohlene Reihenfolge**:

1. **Lernen Sie zuerst Komprimierungsprinzipien**: Verstehen Sie, wie Supermemory automatisch Kontext verwaltet. Dies ist die Grundlage für erweiterte Konfiguration.
2. **Lernen Sie dann Konfiguration-Detaillierung**: Nachdem Sie den Mechanismus verstehen, können Sie vernünftige Konfigurationsentscheidungen treffen (z. B. welchen Schwellenwert Sie festlegen sollten).

## Voraussetzungen

::: warning Bitte bestätigen Sie vor dem Start
Dieses Kapitel setzt voraus, dass Sie Folgendes abgeschlossen haben:

- ✅ [Schnellstart](../start/getting-started/): Plugin installiert und API Key konfiguriert
- ✅ [Speicherumfang und Lebenszyklus](../core/memory-management/): Verstehen Sie den Unterschied zwischen User Scope und Project Scope
:::

## Nächste Schritte

Nach Abschluss dieses Kapitels empfehle ich, weiter zu lernen:

- **[Privatsphäre und Datensicherheit](../security/privacy/)**: Erfahren Sie mehr über den Mechanismus zur Maskierung sensibler Daten, um sicherzustellen, dass Ihr Code und Ihre Schlüssel nicht versehentlich hochgeladen werden.

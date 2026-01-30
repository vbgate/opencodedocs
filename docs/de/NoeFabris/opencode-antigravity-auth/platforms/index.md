---
title: "Plattformfunktionen: Modelle und Kontingente | opencode-antigravity-auth"
sidebarTitle: "Doppeltes Kontingentsystem freischalten"
subtitle: "Plattformfunktionen: Modelle und Kontingente"
description: "Erfahren Sie mehr über die Modelle und das doppelte Kontingentsystem von Antigravity Auth. Beherrschen Sie die Modellauswahl, Thinking-Konfiguration und Google Search-Methoden."
order: 2
---

# Plattformfunktionen

Dieses Kapitel hilft Ihnen, die von Antigravity Auth unterstützten Modelle, das Kontingentsystem und die Plattformmerkmale besser zu verstehen. Sie lernen, wie Sie das geeignete Modell auswählen, Thinking-Fähigkeiten konfigurieren, Google Search aktivieren und die Kontingentnutzung maximieren.

## Voraussetzungen

::: warning Vor dem Start
Bevor Sie dieses Kapitel studieren, stellen Sie sicher, dass Sie Folgendes abgeschlossen haben:
- [Schnellinstallation](../start/quick-install/): Installation des Plugins und erste Authentifizierung
- [Erste Anfrage](../start/first-request/): Erfolgreiche Durchführung der ersten Modellanfrage
:::

## Lernpfad

Lernen Sie in der folgenden Reihenfolge, um die Plattformfunktionen schrittweise zu beherrschen:

### 1. [Verfügbare Modelle](./available-models/)

Erfahren Sie mehr über alle verfügbaren Modelle und ihre Variantenkonfigurationen

- Lernen Sie Claude Opus 4.5, Sonnet 4.5 und Gemini 3 Pro/Flash kennen
- Verstehen Sie die Modellverteilung zwischen den beiden Kontingentpools von Antigravity und Gemini CLI
- Beherrschen Sie die Verwendung des `--variant`-Parameters

### 2. [Doppeltes Kontingentsystem](./dual-quota-system/)

Verstehen Sie die Funktionsweise des doppelten Kontingentpools von Antigravity und Gemini CLI

- Erfahren Sie, wie jedes Konto über zwei unabhängige Gemini-Kontingentpools verfügt
- Aktivieren Sie die automatische Fallback-Konfiguration, um das Kontingent zu verdoppeln
- Geben Sie explizit an, welches Modell welchen Kontingentpool verwendet

### 3. [Google Search Grounding](./google-search-grounding/)

Aktivieren Sie Google Search für Gemini-Modelle, um die Faktengenauigkeit zu verbessern

- Ermöglichen Sie Gemini die Suche nach Echtzeit-Netzwerkinformationen
- Regulieren Sie den Suchschwellenwert, um die Suchhäufigkeit zu steuern
- Wählen Sie die geeignete Konfiguration basierend auf den Aufgabenanforderungen

### 4. [Thinking-Modelle](./thinking-models/)

Beherrschen Sie die Konfiguration und Verwendung von Claude- und Gemini 3 Thinking-Modellen

- Konfigurieren Sie das Thinking-Budget von Claude
- Verwenden Sie den Thinking-Level von Gemini 3 (minimal/low/medium/high)
- Verstehen Sie Interleaved Thinking und Strategien zur Aufbewahrung von Thinking-Blöcken

## Nächste Schritte

Nach Abschluss dieses Kapitels können Sie mit folgenden Themen fortfahren:

- [Multi-Konto-Konfiguration](../advanced/multi-account-setup/): Konfigurieren Sie mehrere Google-Konten, um Kontingent-Pooling und Lastausgleich zu implementieren
- [Kontoauswahlstrategien](../advanced/account-selection-strategies/): Beherrschen Sie die Best Practices für die drei Strategien sticky, round-robin und hybrid
- [Konfigurationsleitfaden](../advanced/configuration-guide/): Beherrschen Sie alle Konfigurationsoptionen und passen Sie das Plugin-Verhalten nach Bedarf an

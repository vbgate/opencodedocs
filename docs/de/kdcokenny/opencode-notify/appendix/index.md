---
title: "opencode-notify Anhang: Vollständige Referenz zu Ereignistypen und Konfigurationsdateien | Tutorial"
sidebarTitle: "Konfiguration und Ereignisse"
subtitle: "Anhang: Ereignistypen und Konfigurationsreferenz"
description: "Referenz für Ereignistypen und Konfigurationsdateien des opencode-notify-Plugins. Dieses Tutorial führt vier OpenCode-Ereignistypen und deren Auslösebedingungen auf, erklärt die Filterregeln und Plattformunterschiede jedes Ereignisses im Detail und bietet vollständige Konfigurationsdateivorlagen, detaillierte Kommentare zu allen Konfigurationsfeldern, Standardeinstellungen, minimale Konfigurationsbeispiele, Methoden zum Deaktivieren des Plugins und eine vollständige Liste der auf macOS verfügbaren Soundeffekte."
order: 5
---

# Anhang: Ereignistypen und Konfigurationsreferenz

Dieses Kapitel bietet Referenzdokumentation und Konfigurationsbeispiele, die Ihnen helfen, die Ereignistypen und Konfigurationsoptionen von opencode-notify tiefgreifend zu verstehen. Diese Inhalte sind als Referenzmaterial gedacht und müssen nicht in einer bestimmten Reihenfolge gelernt werden.
## Lernpfad

### 1. [Ereignistypen-Erklärung](./event-types/)

Erfahren Sie mehr über die OpenCode-Ereignistypen, die vom Plugin überwacht werden, und deren Auslösebedingungen.

- Vier Ereignistypen (session.idle, session.error, permission.updated, tool.execute.before)
- Auslösezeitpunkte und Verarbeitungslogik für jeden Ereignistyp
- Filterregeln für übergeordnete Sitzungsprüfung, Ruhezeitprüfung und Terminalfokusprüfung
- Funktionsunterschiede zwischen verschiedenen Plattformen

### 2. [Konfigurationsdatei-Beispiel](./config-file-example/)

Sehen Sie sich vollständige Konfigurationsdatei-Beispiele und detaillierte Kommentare zu allen Feldern an.

- Vollständige Konfigurationsdateivorlage
- Erklärung der Felder notifyChildSessions, sounds, quietHours, terminal usw.
- Vollständige Liste der auf macOS verfügbaren Soundeffekte
- Minimale Konfigurationsbeispiele
- Methoden zum Deaktivieren des Plugins

## Voraussetzungen

::: tip Lerneinheit

Dieses Kapitel ist eine Referenzdokumentation, die Sie bei Bedarf konsultieren können. Es wird empfohlen, die folgenden Grundlagentutorials abzuschließen, bevor Sie auf den Inhalt dieses Kapitels verweisen:

- [Schnellstart](../../start/quick-start/) - Installation und erste Konfiguration abschließen
- [Wie es funktioniert](../../start/how-it-works/) - Die Kernmechanismen des Plugins verstehen

:::

## Nächste Schritte

Nachdem Sie den Inhalt des Anhangs gelernt haben, können Sie:

- Die [Versionshinweise](../changelog/release-notes/) lesen, um die Versionshistorie und neue Funktionen zu erfahren
- Zur [Konfigurationsreferenz](../../advanced/config-reference/) zurückkehren, um fortgeschrittene Konfigurationsoptionen tiefgreifend zu lernen
- Die [Häufig gestellten Fragen](../../faq/common-questions/) durchsuchen, um Antworten zu finden

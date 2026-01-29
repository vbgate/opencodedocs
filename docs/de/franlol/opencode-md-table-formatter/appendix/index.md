---
title: "Anhang: Technische Details und Einschränkungen | opencode-md-table-formatter"
sidebarTitle: "Einschränkungen und Prinzipien verstehen"
subtitle: "Anhang: Technische Details und Einschränkungen"
description: "Erfahren Sie mehr über die technischen Grenzen und Performance-Optimierungsstrategien von opencode-md-table-formatter. Verstehen Sie die bekannten Einschränkungen, Caching-Mechanismen und Designdetails des Plugins."
tags:
  - "Anhang"
  - "Bekannte Einschränkungen"
  - "Technische Details"
prerequisite:
  - "start-features"
order: 4
---

# Anhang: Technische Details und Einschränkungen

Dieses Kapitel enthält die Referenzdokumentation und technischen Details des Plugins, die Ihnen helfen, die Designentscheidungen, Grenzen und Performance-Optimierungsstrategien des Plugins tiefgreifend zu verstehen.

::: info Was Sie lernen können
- Die bekannten Einschränkungen und Anwendungsfälle des Plugins verstehen
- Caching-Mechanismen und Performance-Optimierungsstrategien beherrschen
- Die technischen Grenzen und Design-Trade-offs des Plugins verstehen
:::

## Inhalt dieses Kapitels

### 📚 [Bekannte Einschränkungen: Wo liegen die Grenzen des Plugins](./limitations/)

Erfahren Sie mehr über die nicht unterstützten Funktionen und technischen Einschränkungen des Plugins, um eine Verwendung in nicht unterstützten Szenarien zu vermeiden. Dazu gehören:
- Keine Unterstützung für HTML-Tabellen, mehrzeilige Zellen, Tabellen ohne Trennzeilen
- Keine Unterstützung für zusammengeführte Zellen und keine Konfigurationsoptionen
- Performance bei sehr großen Tabellen nicht validiert

**Für wen geeignet**: Benutzer, die wissen möchten, was das Plugin kann und was nicht

### 🔧 [Technische Details: Caching-Mechanismus und Performance-Optimierung](./tech-details/)

Verstehen Sie die interne Implementierung des Plugins, einschließlich Caching-Mechanismus, Performance-Optimierungsstrategien und Code-Struktur. Dazu gehören:
- widthCache-Datenstruktur und Caching-Suchablauf
- Automatischer Bereinigungsmechanismus und Caching-Schwellenwerte
- Analyse der Performance-Optimierungseffekte

**Für wen geeignet**: Entwickler, die an den Implementierungsprinzipien des Plugins interessiert sind

## Empfohlener Lernpfad

Die beiden Unterseiten dieses Kapitels sind relativ unabhängig und können bei Bedarf gelesen werden:

1. **Schnelleinsteiger**: Es wird empfohlen, zuerst "Bekannte Einschränkungen" zu lesen und nach dem Verstehen der Plugin-Grenzen aufzuhören
2. **Tiefgehende Lernende**: In der Reihenfolge lesen → "Bekannte Einschränkungen" → "Technische Details"
3. **Entwickler**: Vollständiges Lesen wird empfohlen, hilft beim Verstehen des Plugin-Designs und zukünftiger Erweiterungen

## Voraussetzungen

::: warning Vorbereitung vor dem Lernen

Bevor Sie mit diesem Kapitel beginnen, wird empfohlen, dass Sie Folgendes abgeschlossen haben:
- [ ] [Funktionsübersicht: Die Magie der automatischen Formatierung](../../start/features/) - Verstehen Sie die Kernfunktionen des Plugins

So können Sie die technischen Details und Einschränkungen in diesem Kapitel besser verstehen.
:::

## Nächste Schritte

Nach Abschluss dieses Kapitels können Sie weiterlernen:

- [Änderungsprotokoll: Versionshistorie und Änderungsaufzeichnungen](../../changelog/release-notes/) - Verfolgen Sie die Versionsevolution und neuen Funktionen des Plugins

Oder kehren Sie zum vorherigen Kapitel zurück:
- [Häufig gestellte Fragen: Was tun, wenn die Tabelle nicht formatiert ist](../../faq/troubleshooting/) - Schnelles Identifizieren und Lösen häufiger Probleme

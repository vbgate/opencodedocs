---
title: "Anhang: Technische Referenz | Antigravity Auth"
sidebarTitle: "Plugin-Architektur verstehen"
subtitle: "Anhang: Architektur, API und Konfigurationsreferenz"
description: "Erfahren Sie mehr über die technische Referenz des Antigravity Auth Plugins, einschließlich Architekturdesign, API-Spezifikation, Speicherformat und vollständiger Konfigurationsoptionen, um die internen Mechanismen des Plugins tiefgreifend zu verstehen."
order: 5
---

# Anhang

Dieses Kapitel bietet technische Referenzmaterialien für das Antigravity Auth Plugin, einschließlich Architekturdesign, API-Spezifikation, Speicherformat und vollständigem Konfigurationshandbuch, um Ihnen ein tiefgreifendes Verständnis der internen Mechanismen des Plugins zu ermöglichen.

## Lernpfad

### 1. [Architekturübersicht](./architecture-overview/)

Verstehen Sie die Modulstruktur und den Anfrageverarbeitungsablauf des Plugins.

- Modulare Schichtarchitektur und Verantwortlichkeiten
- Vollständiger Anfragepfad von OpenCode zur Antigravity API
- Multi-Account-Load-Balancing und Sitzungswiederherstellungsmechanismus

### 2. [API-Spezifikation](./api-spec/)

Vertiefen Sie Ihr Wissen über die technischen Details der Antigravity API.

- Einheitliche Gateway-Schnittstelle und Endpunktkonfiguration
- Anfrage-/Antwortformat und JSON-Schema-Einschränkungen
- Thinking-Modellkonfiguration und Funktionsaufrufregeln

### 3. [Speicherformat](./storage-schema/)

Verstehen Sie die Struktur der Account-Speicherdatei und die Versionsverwaltung.

- Speicherort der Datei und Bedeutung der einzelnen Felder
- v1/v2/v3-Versionsentwicklung und automatische Migration
- Methoden zur Migration der Account-Konfiguration zwischen Rechnern

### 4. [Vollständige Konfigurationsoptionen](./all-config-options/)

Vollständiges Referenzhandbuch für alle Konfigurationsoptionen.

- Standardwerte und Anwendungsszenarien für über 30 Konfigurationsoptionen
- Methoden zur Überschreibung der Konfiguration durch Umgebungsvariablen
- Optimale Konfigurationskombinationen für verschiedene Anwendungsszenarien

## Voraussetzungen

::: warning Empfohlen: Zuerst abschließen
Der Inhalt dieses Kapitels ist technisch anspruchsvoll. Es wird empfohlen, zunächst folgende Abschnitte zu absolvieren:

- [Schnellinstallation](../start/quick-install/) - Plugin-Installation und erste Authentifizierung abschließen
- [Konfigurationsleitfaden](../advanced/configuration-guide/) - Gängige Konfigurationsmethoden kennenlernen
:::

## Nächste Schritte

Nach Abschluss des Anhangs können Sie:

- Die [Häufig gestellten Fragen](../faq/) konsultieren, um Probleme bei der Nutzung zu lösen
- Das [Änderungsprotokoll](../changelog/version-history/) verfolgen, um über Versionsänderungen informiert zu bleiben
- An der Plugin-Entwicklung teilnehmen und Code oder Dokumentation beitragen

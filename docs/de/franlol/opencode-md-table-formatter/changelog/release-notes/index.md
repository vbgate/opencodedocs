---
title: "Änderungsprotokoll: Versionshistorie | opencode-md-table-formatter"
sidebarTitle: "Versionsübersicht"
subtitle: "Änderungsprotokoll: Versionshistorie und Änderungsaufzeichnungen"
description: "Erfahren Sie mehr über die Versionsentwicklung und neuen Funktionen von opencode-md-table-formatter. Sehen Sie sich die v0.1.0-Funktionen an, einschließlich automatischer Formatierung und Breitencaching."
tags:
  - "changelog"
  - "version-history"
  - "release-notes"
prerequisite: []
order: 90
---

# Änderungsprotokoll: Versionshistorie und Änderungsaufzeichnungen

::: info Was Sie lernen können
- Die Versionsentwicklung des Plugins verfolgen
- Neue Funktionen und Fixes jeder Version verstehen
- Bekannte Einschränkungen und technische Details beherrschen
- Mögliche zukünftige Funktionsverbesserungen kennenlernen
:::

---

## [0.1.0] - 2025-01-07

### Neue Funktionen

Dies ist die **ursprüngliche Veröffentlichung** von opencode-md-table-formatter mit den folgenden Kernfunktionen:

- **Automatische Tabellenformatierung**: Automatische Formatierung von AI-generierten Markdown-Tabellen über den `experimental.text.complete`-Hook
- **Unterstützung für versteckten Modus**: Korrekte Behandlung versteckter Markdown-Symbole (wie `**`, `*`) bei der Breitenberechnung
- **Verschachtelte Markdown-Verarbeitung**: Unterstützung für Markdown-Syntax beliebiger Verschachtelungstiefe mit einem Multi-Pass-Stripping-Algorithmus
- **Codeblock-Schutz**: Markdown-Symbole in Inline-Code (`` `code` ``) bleiben wörtlich und nehmen nicht an der Breitenberechnung teil
- **Ausrichtungsunterstützung**: Unterstützung für Linksbündigkeit (`---` oder `:---`), Zentrierung (`:---:`) und Rechtsbündigkeit (`---:`)
- **Breitencaching-Optimierung**: Caching der berechneten Zeichenfolgenanzeigebreite zur Leistungssteigerung
- **Validierung ungültiger Tabellen**: Automatische Validierung der Tabellenstruktur, ungültige Tabellen erhalten einen Fehlerkommentar
- **Unterstützung für mehrere Zeichen**: Unterstützung für Emojis, Unicode-Zeichen, leere Zellen und überlange Inhalte
- **Stille Fehlerbehandlung**: Formatierungsfehler unterbrechen nicht den OpenCode-Workflow

### Technische Details

Diese Version enthält ca. **230 Zeilen produktionsbereiten TypeScript-Code**:

- **12 Funktionen**: Klare Verantwortlichkeiten, gute Trennung
- **Typsicherheit**: Korrekte Verwendung des `Hooks`-Interfaces
- **Intelligente Cache-Bereinigung**: Ausgelöst bei mehr als 100 Operationen oder mehr als 1000 Cache-Einträgen
- **Multi-Pass-Regex-Verarbeitung**: Unterstützung für das Stripping von Markdown-Symbolen beliebiger Verschachtelungstiefe

::: tip Caching-Mechanismus
Der Cache ist zur Optimierung der Breitenberechnung für wiederholte Inhalte konzipiert. Wenn beispielsweise derselbe Zellentext mehrmals in einer Tabelle vorkommt, wird die Breite nur einmal berechnet und anschließend direkt aus dem Cache gelesen.
:::

### Bekannte Einschränkungen

Diese Version unterstützt die folgenden Szenarien nicht:

- **HTML-Tabellen**: Nur Markdown-Pipe-Tabellen werden unterstützt
- **Mehrzeilige Zellen**: Zellen mit `<br>`-Tags werden nicht unterstützt
- **Tabellen ohne Trennzeile**: Tabellen müssen eine Trennzeile (`|---|`) enthalten, um formatiert zu werden
- **Anforderungen**: Erfordert `@opencode-ai/plugin` >= 0.13.7 (verwendet den nicht öffentlichen `experimental.text.complete`-Hook)

::: info Versionsanforderungen
Das Plugin benötigt OpenCode >= 1.0.137 und `@opencode-ai/plugin` >= 0.13.7, um ordnungsgemäß zu funktionieren.
:::

---

## Zukünftige Pläne

Die folgenden Funktionen sind für zukünftige Versionen geplant:

- **Konfigurationsoptionen**: Unterstützung für benutzerdefinierte minimale/maximale Spaltenbreiten, Deaktivierung bestimmter Funktionen
- **Unterstützung für Tabellen ohne Kopfzeile**: Formatierung von Tabellen ohne Kopfzeile
- **Leistungsoptimierung**: Leistungsanalyse und Optimierung für sehr große Tabellen (100+ Zeilen)
- **Weitere Ausrichtungsoptionen**: Erweiterung der Syntax und Funktionen für Ausrichtungen

::: tip Mitwirken
Wenn Sie Funktionsvorschläge haben oder Code beitragen möchten, sind Ihre Ideen auf [GitHub Issues](https://github.com/franlol/opencode-md-table-formatter/issues) willkommen.
:::

---

## Format des Änderungsprotokolls

Das Änderungsprotokoll dieses Projekts folgt dem [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)-Format, und die Versionsnummern folgen der [Semantic Versioning](https://semver.org/spec/v2.0.0.html)-Spezifikation.

**Format der Versionsnummer**: `MAJOR.MINOR.PATCH`

- **MAJOR**: Inkompatible API-Änderungen
- **MINOR**: Rückwärtskompatible neue Funktionen
- **PATCH**: Rückwärtskompatible Fehlerbehebungen

**Änderungstypen**:

- **Added**: Neue Funktionen
- **Changed**: Änderungen an bestehenden Funktionen
- **Deprecated**: Bald zu entfernende Funktionen
- **Removed**: Entfernte Funktionen
- **Fixed**: Fehlerbehebungen
- **Security**: Sicherheitsbezogene Fehlerbehebungen

---

## Empfohlene Lesereihenfolge

Wenn Sie ein neuer Benutzer sind, empfehlen wir, in folgender Reihenfolge zu lernen:

1. [Schnellstart: Installation und Konfiguration](../../start/getting-started/) — Schneller Einstieg
2. [Funktionsübersicht: Die Magie der automatischen Formatierung](../../start/features/) — Kernfunktionen verstehen
3. [Häufig gestellte Fragen: Was tun, wenn die Tabelle nicht formatiert wird](../../faq/troubleshooting/) — Fehlerbehebung
4. [Bekannte Einschränkungen: Wo liegen die Grenzen des Plugins](../../appendix/limitations/) — Einschränkungen verstehen

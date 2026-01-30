---
title: "opencode-notify Änderungsprotokoll: Versionshistorie und Funktionsänderungen"
sidebarTitle: "Neue Funktionen entdecken"
subtitle: "Änderungsprotokoll"
description: "Zeigen Sie die Versionshistorie und wichtigen Änderungsprotokolle des opencode-notify Plugins an. Erfahren Sie mehr über Funktionsaktualisierungen, Fehlerbehebungen und Konfigurationsverbesserungen jeder Version."
tags:
  - "Änderungsprotokoll"
  - "Versionshistorie"
order: 150
---

# Änderungsprotokoll

## Versionshinweise

Dieses Plugin wird über OCX veröffentlicht und hat keine herkömmlichen Versionsnummern. Die folgenden Einträge dokumentieren wichtige Änderungen in umgekehrter zeitlicher Reihenfolge.

---

## 2026-01-23

**Änderungstyp**: Synchronisationsaktualisierung

- Synchronisation mit dem kdcokenny/ocx Haupt-Repository

---

## 2026-01-22

**Änderungstyp**: Synchronisationsaktualisierung

- Synchronisation mit dem kdcokenny/ocx Haupt-Repository

---

## 2026-01-13

**Änderungstyp**: Synchronisationsaktualisierung

- Synchronisation mit dem kdcokenny/ocx Haupt-Repository

---

## 2026-01-12

**Änderungstyp**: Synchronisationsaktualisierung

- Synchronisation mit dem kdcokenny/ocx Haupt-Repository

---

## 2026-01-08

**Änderungstyp**: Synchronisationsaktualisierung

- Synchronisation mit dem kdcokenny/ocx Haupt-Repository

---

## 2026-01-07

**Änderungstyp**: Synchronisationsaktualisierung

- Aktualisierung von ocx@30a9af5
- CI-Build übersprungen

---

## 2026-01-01

### Fehlerbehebung: Cargo-Stil-Namespace-Syntax

**Änderungsinhalt**:
- Namespace-Syntax aktualisiert: `ocx add kdco-notify` → `ocx add kdco/notify`
- Namespace-Syntax aktualisiert: `ocx add kdco-workspace` → `ocx add kdco/workspace`
- Quelldatei umbenannt: `kdco-notify.ts` → `notify.ts`

**Auswirkungen**:
- Installationsbefehl geändert von `ocx add kdco-notify` zu `ocx add kdco/notify`
- Quellcode-Struktur klarer, entspricht dem Cargo-Stil

---

### Optimierung: README-Dokumentation

**Änderungsinhalt**:
- README-Dokumentation optimiert, Wertversprechen-Beschreibung hinzugefügt
- FAQ-Abschnitt hinzugefügt, beantwortet häufige Fragen
- Beschreibungstext zu "Intelligente Benachrichtigungen" verbessert
- Installationsschritte vereinfacht

**Neuer Inhalt**:
- Wertversprechen-Tabelle (Ereignis, Benachrichtigung, Sound, Grund)
- Häufige Fragen: Kontexterhöhung, Spam-Benachrichtigungen, temporäre Deaktivierung

---

## 2025-12-31

### Dokumentation: README vereinfacht

**Änderungsinhalt**:
- Ungültige Symbole und Dark-Mode-Referenzen entfernt
- README-Dokumentation vereinfacht, Fokus auf Kernfunktionsbeschreibung

### Entfernung: Symbol-Unterstützung

**Änderungsinhalt**:
- OpenCode-Symbol-Unterstützung entfernt (plattformübergreifende Dark-Mode-Erkennung)
- Benachrichtigungsablauf vereinfacht, instabile Symbolfunktion entfernt
- `src/plugin/assets/` Verzeichnis bereinigt

**Entfernte Dateien**:
- `src/plugin/assets/opencode-icon-dark.png`
- `src/plugin/assets/opencode-icon-light.png`

**Auswirkungen**:
- Benachrichtigungen zeigen keine benutzerdefinierten Symbole mehr
- Benachrichtigungsablauf stabiler, weniger Plattform-Kompatibilitätsprobleme

### Hinzugefügt: OpenCode-Symbole (entfernt)

**Änderungsinhalt**:
- OpenCode-Symbol-Unterstützung hinzugefügt
- Plattformübergreifende Dark-Mode-Erkennung implementiert

::: info
Diese Funktion wurde in späteren Versionen entfernt, see 2025-12-31 "Entfernung: Symbol-Unterstützung".
:::

### Hinzugefügt: Terminalerkennung und Fokus-Wahrnehmung

**Änderungsinhalt**:
- Automatische Terminalerkennung hinzugefügt (unterstützt 37+ Terminals)
- Fokuserkennung hinzugefügt (nur macOS)
- Klick-zu-Fokus-Funktion hinzugefügt (nur macOS)

**Neue Funktionen**:
- Automatische Erkennung von Terminal-Emulatoren
- Benachrichtigungen unterdrücken, wenn Terminal im Fokus ist
- Auf Klick auf Benachrichtigung reagieren und Terminal-Fenster fokussieren (macOS)

**Technische Details**:
- `detect-terminal` Bibliothek zur Terminalerkennung verwendet
- macOS osascript für Vordergrund-App-Abfrage verwendet
- node-notifier activate-Option für Klick-zu-Fokus verwendet

### Hinzugefügt: Erste Version

**Änderungsinhalt**:
- Erster Commit: kdco-notify Plugin
- Grundlegende native Benachrichtigungsfunktion
- Grundlegendes Konfigurationssystem

**Kernfunktionen**:
- session.idle Ereignisbenachrichtigung (Aufgabe abgeschlossen)
- session.error Ereignisbenachrichtigung (Fehler)
- permission.updated Ereignisbenachrichtigung (Berechtigungsanfrage)
- node-notifier Integration (plattformübergreifende native Benachrichtigungen)

**Erste Dateien**:
- `LICENSE` - MIT-Lizenz
- `README.md` - Projektdokumentation
- `registry.json` - OCX-Registrierungskonfiguration
- `src/plugin/kdco-notify.ts` - Haupt-Plugin-Code

---

## Zugehörige Ressourcen

- **GitHub Repository**: https://github.com/kdcokenny/ocx/tree/main/registry/src/kdco/notify
- **Commit-Historie**: https://github.com/kdcokenny/ocx/commits/main/registry/src/kdco/notify
- **OCX-Dokumentation**: https://github.com/kdcokenny/ocx

---

## Versionsstrategie

Dieses Plugin ist Teil des OCX-Ökosystems und verwendet die folgende Versionsstrategie:

- **Keine Versionsnummern**: Änderungen werden durch Git-Commit-Historie verfolgt
- **Kontinuierliche Lieferung**: Synchronisation mit dem OCX-Haupt-Repository
- **Rückwärtskompatibilität**: Beibehaltung der Konfigurationsformat- und API-Rückwärtskompatibilität

Bei Breaking Changes werden diese klar im Änderungsprotokoll gekennzeichnet.

---

**Letzte Aktualisierung**: 2026-01-27

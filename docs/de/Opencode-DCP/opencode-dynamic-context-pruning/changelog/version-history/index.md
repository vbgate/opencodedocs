---
title: "Versionshistorie: Die Entwicklung von DCP verfolgen | opencode-dynamic-context-pruning"
sidebarTitle: "Neue Funktionen anzeigen"
subtitle: "Versionshistorie: Die Entwicklung von DCP verfolgen"
description: "Erfahren Sie alles über die Updates des OpenCode DCP-Plugins von v1.0.1 bis v1.2.7. Entdecken Sie neue Funktionen, Fehlerbehebungen und Optimierungen, um von Token-Einsparungen zu profitieren."
tags:
  - "Versionshistorie"
  - "Änderungsprotokoll"
  - "DCP"
prerequisite: []
order: 1
---

# DCP Versionshistorie

Dieses Dokument enthält das vollständige Änderungsprotokoll des OpenCode Dynamic Context Pruning (DCP) Plugins.

---

## [v1.2.7] - 2026-01-22

**Neue Funktionen**
- ✨ Anzeige der Token-Anzahl für extrahierte Inhalte (in der Pruning-Benachrichtigung)
- 🛡️ Verbesserter Schutzmechanismus für Context-Injection (Array-Prüfung hinzugefügt)
- 📝 Optimierung: Context wird als Benutzernachricht injiziert, wenn die letzte Nachricht eine Benutzernachricht ist
- ⚙️ Vereinfachte Standardkonfiguration (enthält nur Schema-URL)

---

## [v1.2.6] - 2026-01-21

**Neue Funktionen**
- ✨ Neuer `/dcp sweep`-Befehl für manuelles Context-Pruning

**Befehlsdetails**
- `/dcp sweep` - Pruning aller Tools nach der letzten Benutzernachricht
- `/dcp sweep N` - Pruning der letzten N Tools

---

## [v1.2.5] - 2026-01-20

**Neue Funktionen**
- ✨ Anzeige der Tool-Anzahl im `/dcp context`-Befehl
- ✨ Verbesserte UI des `/dcp context`-Befehls:
  - Anzeige der Anzahl gekürzter Tools
  - Verbesserte Genauigkeit der Fortschrittsanzeige

**Leistungsoptimierungen**
- 🚀 Optimierte Token-Berechnung im Context-Befehl

---

## [v1.2.4] - 2026-01-20

**Neue Funktionen**
- ✨ Vereinheitlichung der DCP-Befehle zu einem einzigen `/dcp`-Befehl (Unterbefehlsstruktur):
  - `/dcp` - Hilfe anzeigen
  - `/dcp context` - Context-Analyse
  - `/dcp stats` - Statistiken
- ✨ Neuer `commands`-Konfigurationsabschnitt:
  - Aktivierung/Deaktivierung von Slash-Befehlen
  - Konfiguration geschützter Tools

**Verbesserungen**
- 📝 Vereinfachte UI des Context-Befehls
- 📝 Dokumentationsaktualisierung: Erläuterung des context_info Tool-Injektionsmechanismus

**Fehlerbehebungen**
- 🐛 Korrigierte Fehlerbehandlung beim Tool-Pruning (wirft jetzt Fehler statt String zurückzugeben)

**Dokumentation**
- 📚 Cache-Trefferquoten-Statistik zur README hinzugefügt

---

## [v1.2.3] - 2026-01-16

**Neue Funktionen**
- ✨ Vereinfachtes Laden von Prompts (Prompts in TS-Dateien verschoben)

**Verbesserungen**
- 🔧 Gemini-Kompatibilität: Verwendung von `thoughtSignature` zur Umgehung der Tool-Teil-Injektionsvalidierung

---

## [v1.2.2] - 2026-01-15

**Fehlerbehebungen**
- 🐛 Vereinfachtes Injektions-Timing (wartet auf Assistant-Runde)
- 🐛 Gemini-Kompatibilitätsfix: Text-Injektion zur Vermeidung von Thought-Signature-Fehlern

---

## [v1.2.1] - 2026-01-14

**Fehlerbehebungen**
- 🐛 Anthropic-Modelle: Reasoning-Block vor Context-Injektion erforderlich
- 🐛 GitHub Copilot: Überspringen der synthetischen Nachrichteninjektion für Benutzerrolle

---

## [v1.2.0] - 2026-01-13

**Neue Funktionen**
- ✨ `plan_enter` und `plan_exit` zur Standard-Liste geschützter Tools hinzugefügt
- ✨ Unterstützung für Question-Tool beim Pruning

**Verbesserungen**
- 🔧 Vereinheitlichter Injektionsmechanismus (mit isAnthropic-Prüfung)
- 🔧 Flache Prompt-Verzeichnisstruktur
- 🔧 Vereinfachte und vereinheitlichte Prüfreihenfolge in prune.ts
- 🔧 System-Prompt-Handler in hooks.ts extrahiert

**Fehlerbehebungen**
- 🐛 Überspringen der System-Prompt-Injektion für Sub-Agent-Sitzungen
- 🐛 GitHub Copilot: Überspringen der Injektion, wenn letzte Nachricht Benutzerrolle hat

---

## [v1.1.6] - 2026-01-12

**Fehlerbehebungen**
- 🐛 **Kritischer Fix für GitHub Copilot-Nutzer**: Verwendung von Completed-Assistant-Message und Tool-Part zur Injektion der Prunable-Tool-Liste

**Betroffener Bereich**
- Dieser Fix behebt ein kritisches Problem für GitHub Copilot-Nutzer bei der Verwendung von DCP

---

## [v1.1.5] - 2026-01-10

**Neue Funktionen**
- ✨ JSON-Schema-Unterstützung für Autovervollständigung der Konfigurationsdatei
- ✨ Konfiguration geschützter Dateimuster (protectedFilePatterns)
- ✨ Schutz von Dateioperationen (read/write/edit) über Glob-Muster

**Verbesserungen**
- 📝 Dokumentation: Sub-Agent-Einschränkungen dokumentiert

**Fehlerbehebungen**
- 🐛 Schema-URL verwendet jetzt Master-Branch
- 🐛 `$schema` zur Liste gültiger Konfigurationsschlüssel hinzugefügt

---

## [v1.1.4] - 2026-01-06

**Fehlerbehebungen**
- 🐛 `isInternalAgent`-Flag entfernt (wegen Hook-Reihenfolge-Race-Condition)

**Verbesserungen**
- 🔧 Optimierte Erkennungslogik für interne Agenten

---

## [v1.1.3] - 2026-01-05

**Fehlerbehebungen**
- 🐛 DCP-Injektion für interne Agenten (title, summary, compaction) übersprungen
- 🐛 Pruning für write/edit-Tools deaktiviert

**Verbesserungen**
- 🔧 Verbesserte Erkennung von Sub-Agent-Einschränkungen

---

## [v1.1.2] - 2025-12-26

**Verbesserungen**
- 🔧 Distillation zu einheitlicher Benachrichtigung zusammengeführt
- 🔧 Vereinfachte Distillation-UI

---

## [v1.1.1] - 2025-12-25

**Neue Funktionen**
- ✨ Purge-Errors-Strategie: Pruning der Eingabe nach fehlgeschlagenen Tool-Aufrufen
- ✨ Skill-Tool-Unterstützung für `extractParameterKey`

**Verbesserungen**
- 📝 Verbesserter Ersetzungstext für Fehler-Pruning
- 📝 Dokumentation: Hinweise zu Context-Poisoning und OAuth aktualisiert

---

## [v1.1.0] - 2025-12-24

**Neue Funktionen**
- ✨ Wichtiges Funktions-Update
- ✨ Automatische Pruning-Strategien:
  - Deduplizierungsstrategie
  - Überschreibungsstrategie
  - Fehlerbereinigungsstrategie

**Neue Tools**
- ✨ LLM-gesteuerte Pruning-Tools:
  - `discard` - Tool-Inhalt entfernen
  - `extract` - Wichtige Erkenntnisse extrahieren

**Konfigurationssystem**
- ✨ Mehrstufige Konfigurationsunterstützung (Global/Umgebungsvariablen/Projekt)
- ✨ Rundenschutzfunktion
- ✨ Konfiguration geschützter Tools

---

## [v1.0.4] - 2025-12-18

**Fehlerbehebungen**
- 🐛 Kein Pruning von Tool-Eingaben im Status pending oder running

**Verbesserungen**
- 🔧 Optimierte Tool-Statuserkennungslogik

---

## [v1.0.3] - 2025-12-18

**Neue Funktionen**
- ✅ Nachrichtenbasierte Komprimierungserkennung

**Verbesserungen**
- 🔧 Prüfung des Komprimierungszeitstempels bei Sitzungsinitialisierung

---

## [v1.0.2] - 2025-12-17

**Neue Funktionen**
- ✅ Nachrichtenbasierte Komprimierungserkennung

**Verbesserungen**
- 🔧 Codestruktur bereinigt

---

## [v1.0.1] - 2025-12-16

**Erstveröffentlichung**

- ✅ Kernfunktionalität implementiert
- ✅ OpenCode-Plugin-Integration
- ✅ Grundlegende Context-Pruning-Fähigkeiten

---

## Versionsnummerierung

- **Hauptversion** (z.B. 1.x) - Inkompatible größere Updates
- **Nebenversion** (z.B. 1.2.x) - Abwärtskompatible neue Funktionen
- **Patch-Version** (z.B. 1.2.7) - Abwärtskompatible Fehlerbehebungen

---

## Neueste Version erhalten

Wir empfehlen die Verwendung des `@latest`-Tags in der OpenCode-Konfiguration, um automatisch die neueste Version zu erhalten:

```jsonc
// opencode.jsonc
{
    "plugin": ["@tarquinen/opencode-dcp@latest"],
}
```

Aktuelle Version ansehen: [npm package](https://www.npmjs.com/package/@tarquinen/opencode-dcp)

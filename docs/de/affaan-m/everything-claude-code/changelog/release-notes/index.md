---
title: "Änderungsprotokoll: Versionshistorie | everything-claude-code"
sidebarTitle: "Was gibt's Neues?"
subtitle: "Änderungsprotokoll: Versionshistorie"
description: "Erfahren Sie mehr über die Versionshistorie und wichtige Änderungen von everything-claude-code. Verfolgen Sie neue Funktionen, Sicherheitsfixes und Dokumentationsupdates."
tags:
  - "changelog"
  - "updates"
prerequisite: []
order: 250
---

# Änderungsprotokoll: Versionshistorie und Änderungen

## Was Sie lernen werden

- Die wichtigen Änderungen jeder Version verstehen
- Neue Funktionen und Fehlerbehebungen verfolgen
- Entscheiden, ob ein Upgrade erforderlich ist

## Versionshistorie

### 2026-01-24 - Sicherheits- und Dokumentationsfixes

**Behobene Probleme**:
- 🔒 **Sicherheitsfix**: Command-Injection-Schwachstelle in `commandExists()` behoben
  - `spawnSync` anstelle von `execSync` verwendet
  - Eingabevalidierung: nur alphanumerische Zeichen, Bindestriche, Unterstriche und Punkte erlaubt
- 📝 **Dokumentationsfix**: Sicherheitswarnung für `runCommand()` hinzugefügt
- 🐛 **XSS-Scanner-Fehlalarm behoben**: `<script>` und `<binary>` durch `[script-name]` und `[binary-name]` ersetzt
- 📚 **Dokumentationsfix**: `npx ts-morph` in `doc-updater.md` korrigiert zu `npx tsx scripts/codemaps/generate.ts`

**Betroffene Issues**: #42, #43, #51

---

### 2026-01-22 - Plattformübergreifende Unterstützung und Plugin-Architektur

**Neue Funktionen**:
- 🌐 **Plattformübergreifende Unterstützung**: Alle Hooks und Skripte in Node.js umgeschrieben, unterstützt Windows, macOS und Linux
- 📦 **Plugin-Paketierung**: Als Claude Code Plugin verteilt, Installation über Plugin-Marktplatz möglich
- 🎯 **Automatische Paketmanager-Erkennung**: Unterstützt 6 Erkennungsprioritäten
  - Umgebungsvariable `CLAUDE_PACKAGE_MANAGER`
  - Projektkonfiguration `.claude/package-manager.json`
  - `packageManager`-Feld in `package.json`
  - Lock-Datei-Erkennung (package-lock.json, yarn.lock, pnpm-lock.yaml, bun.lockb)
  - Globale Konfiguration `~/.claude/package-manager.json`
  - Fallback auf den ersten verfügbaren Paketmanager

**Behobene Probleme**:
- 🔄 **Hook-Laden**: Automatisches Laden von Hooks nach Konvention, Hook-Deklarationen aus `plugin.json` entfernt
- 📌 **Hook-Pfade**: Verwendung von `${CLAUDE_PLUGIN_ROOT}` und relativen Pfaden
- 🎨 **UI-Verbesserungen**: Star-Verlaufsdiagramm und Badge-Leiste hinzugefügt
- 📖 **Hook-Organisation**: Session-End-Hooks von Stop nach SessionEnd verschoben

---

### 2026-01-20 - Funktionserweiterungen

**Neue Funktionen**:
- 💾 **Memory Persistence Hooks**: Automatisches Speichern und Laden des Kontexts über Sitzungen hinweg
- 🧠 **Strategic Compact Hook**: Intelligente Kontextkomprimierungsvorschläge
- 🎯 **Continuous Learning Skill**: Automatische Extraktion wiederverwendbarer Muster aus Sitzungen
- 📚 **Strategic Compact Skill**: Token-Optimierungsstrategien

---

### 2026-01-17 - Erstveröffentlichung

**Initiale Funktionen**:
- ✨ Vollständige Claude Code Konfigurationssammlung
- 🤖 9 spezialisierte Agents
- ⚡ 14 Slash-Befehle
- 📋 8 Regelsets
- 🔄 Automatisierte Hooks
- 🎨 11 Skills
- 🌐 15+ vorkonfigurierte MCP-Server
- 📖 Vollständige README-Dokumentation

---

## Versionierungsschema

Dieses Projekt verwendet keine traditionelle semantische Versionierung, sondern ein **Datumsformat** (`YYYY-MM-DD`).

### Änderungstypen

| Typ | Beschreibung | Beispiel |
| --- | --- | --- |
| **Neue Funktion** | Neue Funktionen oder wesentliche Verbesserungen | `feat: add new agent` |
| **Fix** | Fehlerbehebungen | `fix: resolve hook loading issue` |
| **Dokumentation** | Dokumentationsupdates | `docs: update README` |
| **Stil** | Formatierung oder Code-Stil | `style: fix indentation` |
| **Refactoring** | Code-Refactoring | `refactor: simplify hook logic` |
| **Performance** | Leistungsoptimierungen | `perf: improve context loading` |
| **Test** | Testbezogene Änderungen | `test: add unit tests` |
| **Build** | Build-System oder Abhängigkeiten | `build: update package.json` |
| **Revert** | Rückgängigmachen vorheriger Commits | `revert: remove version field` |

---

## So erhalten Sie Updates

### Update über den Plugin-Marktplatz

Wenn Sie Everything Claude Code über den Plugin-Marktplatz installiert haben:

1. Öffnen Sie Claude Code
2. Führen Sie `/plugin update everything-claude-code` aus
3. Warten Sie, bis das Update abgeschlossen ist

### Manuelles Update

Wenn Sie das Repository manuell geklont haben:

```bash
cd ~/.claude/plugins/everything-claude-code
git pull origin main
```

### Installation vom Marktplatz

Erstinstallation:

```bash
/plugin marketplace add affaan-m/everything-claude-code
```

---

## Auswirkungsanalyse der Änderungen

### Sicherheitsfixes (Upgrade erforderlich)

- **2026-01-24**: Command-Injection-Schwachstelle behoben, Upgrade dringend empfohlen

### Funktionserweiterungen (optionales Upgrade)

- **2026-01-22**: Plattformübergreifende Unterstützung, Windows-Benutzer müssen upgraden
- **2026-01-20**: Neue Funktionserweiterungen, Upgrade nach Bedarf

### Dokumentationsupdates (kein Upgrade erforderlich)

- Dokumentationsupdates beeinflussen die Funktionalität nicht, README kann manuell eingesehen werden

---

## Bekannte Probleme

### Aktuelle Version (2026-01-24)

- Keine bekannten kritischen Probleme

### Frühere Versionen

- Vor 2026-01-22: Hooks mussten manuell konfiguriert werden (behoben in 2026-01-22)
- Vor 2026-01-20: Keine Windows-Unterstützung (behoben in 2026-01-22)

---

## Beiträge und Feedback

### Probleme melden

Wenn Sie einen Bug gefunden haben oder einen Funktionsvorschlag haben:

1. Suchen Sie in den [GitHub Issues](https://github.com/affaan-m/everything-claude-code/issues), ob ein ähnliches Problem bereits existiert
2. Falls nicht, erstellen Sie ein neues Issue mit folgenden Informationen:
   - Versionsinformationen
   - Betriebssystem
   - Reproduktionsschritte
   - Erwartetes Verhalten vs. tatsächliches Verhalten

### Pull Requests einreichen

Beiträge sind willkommen! Weitere Informationen finden Sie in [CONTRIBUTING.md](https://github.com/affaan-m/everything-claude-code/blob/main/CONTRIBUTING.md).

---

## Zusammenfassung

- Everything Claude Code verwendet Datumsversionierung (`YYYY-MM-DD`)
- Sicherheitsfixes (wie 2026-01-24) erfordern ein Upgrade
- Funktionserweiterungen können nach Bedarf aktualisiert werden
- Plugin-Marktplatz-Benutzer verwenden `/plugin update` für Updates
- Manuelle Installationen verwenden `git pull` für Updates
- Befolgen Sie die Projektrichtlinien für Problemberichte und Pull Requests

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir die **[Konfigurationsdatei-Referenz](../../appendix/config-reference/)** kennen.
>
> Sie werden lernen:
> - Vollständige Feldbeschreibung von `settings.json`
> - Erweiterte Hook-Konfigurationsoptionen
> - Detaillierte MCP-Server-Konfiguration
> - Best Practices für benutzerdefinierte Konfigurationen

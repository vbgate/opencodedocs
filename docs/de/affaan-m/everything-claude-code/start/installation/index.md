---
title: "Installation: Plugin vs. Manuell | Everything Claude Code"
sidebarTitle: "Installation in 5 Minuten"
subtitle: "Installation: Plugin vs. Manuell"
description: "Lernen Sie die zwei Installationsmethoden von Everything Claude Code kennen. Die Plugin-Marketplace-Installation ist am schnellsten, während die manuelle Installation eine präzise Komponentenkonfiguration ermöglicht."
tags:
  - "installation"
  - "plugin"
  - "setup"
prerequisite:
  - "start-quickstart"
order: 20
---

# Installationsanleitung: Plugin-Marketplace vs. Manuelle Installation

## Was Sie nach diesem Tutorial können werden

Nach Abschluss dieses Tutorials können Sie:

- Everything Claude Code mit einem einzigen Klick über den Plugin-Marketplace installieren
- Manuelle Auswahl der benötigten Komponenten für eine präzise Konfiguration vornehmen
- MCP-Server und Hooks korrekt konfigurieren
- Überprüfen, ob die Installation erfolgreich war

## Ihre aktuelle Situation

Sie möchten schnell mit Everything Claude Code beginnen, wissen aber nicht:

- Ob Sie den Plugin-Marketplace für die Ein-Klick-Installation oder die manuelle Komponentenkontrolle nutzen sollen
- Wie Sie Konfigurationsfehler vermeiden, die zu Funktionsausfällen führen
- Welche Dateien bei der manuellen Installation wohin kopiert werden müssen

## Wann welche Methode verwenden

| Szenario | Empfohlene Methode | Grund |
|---|---|---|
| Erstbenutzung | Plugin-Marketplace | Einfachste Lösung, in 5 Minuten erledigt |
| Ausprobieren bestimmter Funktionen | Plugin-Marketplace | Vollständige Erfahrung vor der Entscheidung |
| Spezifische Anforderungen | Manuelle Installation | Präzise Kontrolle über jede Komponente |
| Bereits eigene Konfiguration | Manuelle Installation | Vermeidet Überschreiben bestehender Einstellungen |

## Kernkonzept

Everything Claude Code bietet zwei Installationsmethoden:

1. **Plugin-Marketplace-Installation** (empfohlen)
   - Für die meisten Benutzer geeignet
   - Verarbeitet alle Abhängigkeiten automatisch
   - Installation mit einem Befehl

2. **Manuelle Installation**
   - Für Benutzer mit spezifischen Anforderungen
   - Präzise Kontrolle über die zu installierenden Komponenten
   - Manuelle Konfiguration erforderlich

Unabhängig von der gewählten Methode werden die Konfigurationsdateien schließlich in das `~/.claude/` Verzeichnis kopiert, damit Claude Code diese Komponenten erkennen und nutzen kann.

## 🎒 Vorbereitung vor dem Start

::: warning Voraussetzungen

Bitte stellen Sie vor dem Start sicher:
- [ ] Claude Code ist installiert
- [ ] Sie haben eine Netzwerkverbindung zu GitHub
- [ ] Sie verstehen grundlegende Befehlszeilenoperationen (bei manueller Installation)

:::

---

## Schritt-für-Schritt-Anleitung

### Methode 1: Plugin-Marketplace-Installation (empfohlen)

Dies ist die einfachste Methode, geeignet für Erstbenutzer oder Nutzer, die schnell loslegen möchten.

#### Schritt 1: Plugin-Marketplace hinzufügen

**Warum**
Damit Plugins aus dem GitHub-Repository installiert werden können, muss dieses zunächst als Plugin-Marketplace in Claude Code registriert werden.

Geben Sie in Claude Code ein:

```bash
/plugin marketplace add affaan-m/everything-claude-code
```

**Sie sollten sehen**:
```
Successfully added marketplace affaan-m/everything-claude-code
```

#### Schritt 2: Plugin installieren

**Warum**
Installation des Everything Claude Code Plugins aus dem zuvor hinzugefügten Marketplace.

Geben Sie in Claude Code ein:

```bash
/plugin install everything-claude-code@everything-claude-code
```

**Sie sollten sehen**:
```
Successfully installed everything-claude-code@everything-claude-code
```

::: tip Checkpoint ✅

Überprüfen Sie, ob das Plugin installiert ist:

```bash
/plugin list
```

In der Ausgabe sollten Sie `everything-claude-code@everything-claude-code` sehen.

:::

#### Schritt 3 (optional): Direkte Konfiguration von settings.json

**Warum**
Wenn Sie die Befehlszeile umgehen und die Konfigurationsdatei direkt bearbeiten möchten.

Öffnen Sie `~/.claude/settings.json` und fügen Sie folgenden Inhalt hinzu:

```json
{
  "extraKnownMarketplaces": {
    "everything-claude-code": {
      "source": {
        "source": "github",
        "repo": "affaan-m/everything-claude-code"
      }
    }
  },
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

**Sie sollten sehen**:
- Nach der Aktualisierung der Konfigurationsdatei lädt Claude Code das Plugin automatisch
- Alle Agents, Skills, Commands und Hooks sind sofort verfügbar

---

### Methode 2: Manuelle Installation

Geeignet für Benutzer, die präzise Kontrolle darüber haben möchten, welche Komponenten installiert werden.

#### Schritt 1: Repository klonen

**Warum**
Alle Quelldateien von Everything Claude Code abrufen.

```bash
git clone https://github.com/affaan-m/everything-claude-code.git
cd everything-claude-code
```

**Sie sollten sehen**:
```
Cloning into 'everything-claude-code'...
remote: Enumerating objects...
```

#### Schritt 2: Agents kopieren

**Warum**
Die spezialisierten Sub-Agents in das Claude Code Agents-Verzeichnis kopieren.

```bash
cp everything-claude-code/agents/*.md ~/.claude/agents/
```

**Sie sollten sehen**:
- 9 neue Agent-Dateien im Verzeichnis `~/.claude/agents/`

::: tip Checkpoint ✅

Überprüfen Sie, ob die Agents kopiert wurden:

```bash
ls ~/.claude/agents/
```

Sie sollten etwas Ähnliches sehen:
```
planner.md architect.md tdd-guide.md code-reviewer.md ...
```

:::

#### Schritt 3: Rules kopieren

**Warum**
Die obligatorischen Regeln in das Claude Code Rules-Verzeichnis kopieren.

```bash
cp everything-claude-code/rules/*.md ~/.claude/rules/
```

**Sie sollten sehen**:
- 8 neue Regel-Dateien im Verzeichnis `~/.claude/rules/`

#### Schritt 4: Commands kopieren

**Warum**
Die Slash-Commands in das Claude Code Commands-Verzeichnis kopieren.

```bash
cp everything-claude-code/commands/*.md ~/.claude/commands/
```

**Sie sollten sehen**:
- 14 neue Command-Dateien im Verzeichnis `~/.claude/commands/`

#### Schritt 5: Skills kopieren

**Warum**
Die Workflow-Definitionen und Domänenwissen in das Claude Code Skills-Verzeichnis kopieren.

```bash
cp -r everything-claude-code/skills/* ~/.claude/skills/
```

**Sie sollten sehen**:
- 11 neue Skill-Verzeichnisse im Verzeichnis `~/.claude/skills/`

#### Schritt 6: Hooks konfigurieren

**Warum**
Die Automatisierungs-Hooks in die `~/.claude/settings.json` einfügen.

Kopieren Sie den Inhalt von `hooks/hooks.json` in Ihre `~/.claude/settings.json`:

```bash
cat everything-claude-code/hooks/hooks.json
```

Fügen Sie die Ausgabe im folgenden Format zur `~/.claude/settings.json` hinzu:

```json
{
  "hooks": [
    {
      "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\.(ts|tsx|js|jsx)$\"",
      "hooks": [
        {
          "type": "command",
          "command": "#!/bin/bash\ngrep -n 'console\\.log' \"$file_path\" && echo '[Hook] Remove console.log' >&2"
        }
      ]
    }
  ]
}
```

**Sie sollten sehen**:
- Bei der Bearbeitung von TypeScript/JavaScript-Dateien erscheint eine Warnung, wenn `console.log` vorhanden ist

::: warning Wichtiger Hinweis

Stellen Sie sicher, dass das `hooks`-Array nicht vorhandene Konfigurationen in `~/.claude/settings.json` überschreibt. Falls bereits Hooks vorhanden sind, müssen diese zusammengeführt werden.

:::

#### Schritt 7: MCP-Server konfigurieren

**Warum**
Die Integration externer Dienste in Claude Code erweitern.

Wählen Sie aus `mcp-configs/mcp-servers.json` die benötigten MCP-Server aus und fügen Sie diese zu `~/.claude.json` hinzu:

```bash
cat everything-claude-code/mcp-configs/mcp-servers.json
```

Kopieren Sie die benötigte Konfiguration in `~/.claude.json`, zum Beispiel:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "YOUR_GITHUB_TOKEN_HERE"
      }
    }
  }
}
```

::: danger Wichtig: Platzhalter ersetzen

Sie müssen die `YOUR_*_HERE`-Platzhalter durch Ihre tatsächlichen API-Keys ersetzen, sonst funktionieren die MCP-Server nicht.

:::

::: tip MCP-Nutzungsempfehlungen

**Aktivieren Sie nicht alle MCP-Server!** Zu viele MCPs belegen viel Kontext-Fenster.

- Konfigurieren Sie 20-30 MCP-Server
- Halten Sie pro Projekt weniger als 10 aktiviert
- Behalten Sie weniger als 80 aktive Tools bei

Verwenden Sie `disabledMcpServers`, um nicht benötigte MCPs in der Projektkonfiguration zu deaktivieren:

```json
{
  "disabledMcpServers": ["firecrawl", "supabase"]
}
```

:::

---

## Checkpoint ✅

### Plugin-Marketplace-Installation verifizieren

```bash
/plugin list
```

Sie sollten sehen, dass `everything-claude-code@everything-claude-code` aktiviert ist.

### Manuelle Installation verifizieren

```bash
# Agents prüfen
ls ~/.claude/agents/ | head -5

# Rules prüfen
ls ~/.claude/rules/ | head -5

# Commands prüfen
ls ~/.claude/commands/ | head -5

# Skills prüfen
ls ~/.claude/skills/ | head -5
```

Sie sollten sehen:
- Im agents-Verzeichnis: `planner.md`, `tdd-guide.md` usw.
- Im rules-Verzeichnis: `security.md`, `coding-style.md` usw.
- Im commands-Verzeichnis: `tdd.md`, `plan.md` usw.
- Im skills-Verzeichnis: `coding-standards`, `backend-patterns` usw.

### Funktionsverfügbarkeit verifizieren

Geben Sie in Claude Code ein:

```bash
/tdd
```

Der TDD Guide Agent sollte zu arbeiten beginnen.

---

## Fallstricke

### Häufiger Fehler 1: Plugin funktioniert nicht nach Installation

**Symptom**: Nach Plugin-Installation sind die Befehle nicht verfügbar.

**Ursache**: Das Plugin wurde nicht korrekt geladen.

**Lösung**:
```bash
# Plugin-Liste prüfen
/plugin list

# Falls nicht aktiviert, manuell aktivieren
/plugin enable everything-claude-code@everything-claude-code
```

### Häufiger Fehler 2: MCP-Server-Verbindung fehlgeschlagen

**Symptom**: MCP-Funktionen nicht verfügbar, Verbindungsfehler.

**Ursache**: API-Key nicht ersetzt oder Formatfehler.

**Lösung**:
- Prüfen Sie in `~/.claude.json`, ob alle `YOUR_*_HERE`-Platzhalter ersetzt wurden
- Überprüfen Sie die Gültigkeit des API-Keys
- Stellen Sie sicher, dass die MCP-Server-Befehlspfade korrekt sind

### Häufiger Fehler 3: Hooks werden nicht ausgelöst

**Symptom**: Keine Hook-Hinweise beim Bearbeiten von Dateien.

**Ursache**: `hooks`-Array in `~/.claude/settings.json` hat Formatfehler.

**Lösung**:
- Prüfen Sie, ob das `hooks`-Array das korrekte Format hat
- Stellen Sie sicher, dass der `matcher`-Ausdruck die korrekte Syntax hat
- Überprüfen Sie, ob der Hook-Befehlspfad ausführbar ist

### Häufiger Fehler 4: Dateiberechtigungsprobleme (manuelle Installation)

**Symptom**: "Permission denied"-Fehler beim Kopieren von Dateien.

**Ursache**: Unzureichende Berechtigungen im `~/.claude/`-Verzeichnis.

**Lösung**:
```bash
# Stellen Sie sicher, dass das .claude-Verzeichnis existiert und berechtigt ist
mkdir -p ~/.claude/{agents,rules,commands,skills}

# Verwenden Sie sudo (nur wenn nötig)
sudo cp -r everything-claude-code/agents/*.md ~/.claude/agents/
```

---

## Lektionszusammenfassung

**Vergleich der beiden Installationsmethoden**:

| Eigenschaft | Plugin-Marketplace | Manuelle Installation |
|---|---|---|
| Geschwindigkeit | ⚡ Schnell | 🐌 Langsam |
| Schwierigkeit | 🟢 Einfach | 🟡 Mittel |
| Flexibilität | 🔒 Fest | 🔓 Anpassbar |
| Empfohlen für | Anfänger, schneller Einstieg | Fortgeschrittene, spezifische Anforderungen |

**Kernpunkte**:
- Die Plugin-Marketplace-Installation ist die einfachste Methode – ein Befehl genügt
- Die manuelle Installation ist für Benutzer geeignet, die präzise Kontrolle über Komponenten benötigen
- Denken Sie beim MCP-Konfigurieren daran, Platzhalter zu ersetzen, und aktivieren Sie nicht zu viele
- Überprüfen Sie bei der Installationsüberprüfung die Verzeichnisstruktur und Befehlsverfügbarkeit

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Paketmanager-Konfiguration: Automatische Erkennung und Anpassung](../package-manager-setup/)** kennen.
>
> Sie werden lernen:
> - Wie Everything Claude Code Paketmanager automatisch erkennt
> - Wie die 6-stufige Erkennungspriorität funktioniert
> - Wie Sie projektspezifische und benutzerspezifische Paketmanager-Konfigurationen anpassen
> - Wie Sie den `/setup-pm` Befehl für eine schnelle Konfiguration verwenden

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Zum Quellcode anzeigen klicken</strong></summary>

> Letzte Aktualisierung: 2026-01-25

| Funktion | Dateipfad | Zeilen |
|---|---|---|
| Plugin-Metadaten | [`source/affaan-m/everything-claude-code/.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28 |
| Marketplace-Liste | [`source/affaan-m/everything-claude-code/.claude-plugin/marketplace.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/marketplace.json) | 1-45 |
| Installationsanleitung | [`source/affaan-m/everything-claude-code/README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md) | 175-242 |
| Hooks-Konfiguration | [`source/affaan-m/everything-claude-code/hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-146 |
| MCP-Konfiguration | [`source/affaan-m/everything-claude-code/mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-95 |

**Wichtige Konfigurationen**:
- Plugin-Name: `everything-claude-code`
- Repository: `affaan-m/everything-claude-code`
- Lizenz: MIT
- Unterstützt 9 Agents, 14 Commands, 8 Rules-Sets, 11 Skills

**Installationsmethoden**:
1. Plugin-Marketplace-Installation: `/plugin marketplace add` + `/plugin install`
2. Manuelle Installation: Kopieren von Agents, Rules, Commands, Skills nach `~/.claude/`

</details>

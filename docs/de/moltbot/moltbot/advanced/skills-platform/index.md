---
title: "Skill-Plattform und ClawdHub: KI-Assistent erweitern | Clawdbot-Tutorial | Clawdbot"
sidebarTitle: "KI-Fähigkeiten erweitern"
subtitle: "Skill-Plattform und ClawdHub: KI-Assistent erweitern | Clawdbot-Tutorial | Clawdbot"
description: "Lernen Sie die Skill-Systemarchitektur von Clawdbot kennen und meistern Sie die drei Ladeprioritäten für Bundled-, Managed- und Workspace-Skills. Verwenden Sie ClawdHub zum Installieren und Aktualisieren von Skills, konfigurieren Sie Skill-Gating-Regeln und den Umgebungsvariablen-Injektionsmechanismus."
tags:
  - "Skill-System"
  - "ClawdHub"
  - "KI-Erweiterung"
  - "Skill-Konfiguration"
prerequisite:
  - "start-getting-start"
order: 280
---

# Skill-Plattform und ClawdHub zur KI-Assistenten-Erweiterung | Clawdbot-Tutorial

## Was Sie nach diesem Kurs können

Nach Abschluss dieses Kurses können Sie:

- Die Skill-Systemarchitektur von Clawdbot verstehen (drei Skill-Typen: Bundled, Managed, Workspace)
- Skills über ClawdHub entdecken, installieren und aktualisieren, um die Fähigkeiten Ihres KI-Assistenten zu erweitern
- Den Aktivierungsstatus, Umgebungsvariablen und API-Schlüssel von Skills konfigurieren
- Skill-Gating-Regeln verwenden, um sicherzustellen, dass Skills nur geladen werden, wenn die Bedingungen erfüllt sind
- Die gemeinsame Nutzung und Überschreibungspriorität von Skills in Multi-Agent-Szenarien verwalten

## Ihr aktuelles Problem

Clawdbot bietet bereits eine reiche Auswahl an integrierten Tools (Browser, Befehlsausführung, Websuche usw.), aber wenn Sie:

- Drittanbieter-CLI-Tools aufrufen möchten (wie `gemini`, `peekaboo`)
- Domänenspezifische Automatisierungsskripte hinzufügen möchten
- Die KI lernen lassen, wie sie Ihren benutzerdefinierten Tool-Satz verwendet

Möchten Sie vielleicht denken: "Wie sage ich der KI, welche Tools verfügbar sind? Wo sollten diese Tools platziert werden? Können mehrere Agents Skills gemeinsam nutzen?"

Das Skill-System von Clawdbot ist dafür konzipiert: **Deklarieren Sie Skills über die SKILL.md-Datei, und der Agent lädt und verwendet sie automatisch**.

## Wann Sie diesen Ansatz verwenden sollten

- **Wenn Sie KI-Fähigkeiten erweitern müssen**: Sie neue Tools oder Automatisierungsprozesse hinzufügen möchten
- **Bei der Multi-Agent-Zusammenarbeit**: Verschiedene Agents müssen Skills gemeinsam nutzen oder exklusiven Zugriff haben
- **Bei der Skill-Versionsverwaltung**: Skills von ClawdHub installieren, aktualisieren und synchronisieren
- **Beim Skill-Gating**: Sicherstellen, dass Skills nur in bestimmten Umgebungen (OS, Binaries, Konfiguration) geladen werden

## 🎒 Vorbereitungen vor dem Start

Bevor Sie beginnen, bestätigen Sie bitte:

- [ ] Sie haben [Schnellstart](../../start/getting-start/) abgeschlossen und das Gateway läuft normal
- [ ] Sie haben mindestens ein KI-Modell konfiguriert (Anthropic, OpenAI, Ollama usw.)
- [ ] Sie verstehen grundlegende Befehlszeilenoperationen (`mkdir`, `cp`, `rm`)

## Kernkonzepte

### Was ist ein Skill?

Ein Skill ist ein Verzeichnis, das eine `SKILL.md`-Datei (Anweisungen für das LLM und Tool-Definitionen) sowie optionale Skripte oder Ressourcen enthält. Die `SKILL.md` verwendet YAML-Frontmatter zur Definition von Metadaten und Markdown zur Beschreibung der Skill-Nutzung.

Clawdbot ist kompatibel mit der [AgentSkills](https://agentskills.io)-Spezifikation, sodass Skills von anderen Tools, die dieser Spezifikation folgen, geladen werden können.

#### Die drei Ladepositionen für Skills

Skills werden an drei Orten geladen, in Prioritätsreihenfolge von hoch nach niedrig:

1. **Workspace-Skills**: `<workspace>/skills` (höchste Priorität)
2. **Managed/lokale Skills**: `~/.clawdbot/skills`
3. **Bundled-Skills**: mit dem Installationspaket bereitgestellt (niedrigste Priorität)

::: info Prioritätsregel
Wenn ein Skill mit demselben Namen an mehreren Orten vorhanden ist, überschreiben Workspace-Skills Managed- und Bundled-Skills.
:::

Darüber hinaus können Sie über `skills.load.extraDirs` zusätzliche Skill-Verzeichnisse konfigurieren (niedrigste Priorität).

#### Skill-Freigabe in Multi-Agent-Szenarien

In einer Multi-Agent-Konfiguration hat jeder Agent seinen eigenen Workspace:

- **Per-Agent-Skills**: befinden sich in `<workspace>/skills`, sichtbar nur für diesen Agenten
- **Gemeinsame Skills**: befinden sich in `~/.clawdbot/skills`, sichtbar für alle Agents auf derselben Maschine
- **Gemeinsamer Ordner**: kann über `skills.load.extraDirs` hinzugefügt werden (niedrigste Priorität), verwendet damit mehrere Agents dasselbe Skill-Paket gemeinsam nutzen können

Bei Namenskonflikten gilt auch die Prioritätsregel: Workspace > Managed > Bundled.

#### Skill-Gating (Gating)

Clawdbot filtert Skills beim Laden basierend auf dem `metadata`-Feld, um sicherzustellen, dass Skills nur geladen werden, wenn die Bedingungen erfüllt sind:

```markdown
---
name: nano-banana-pro
description: Generate or edit images via Gemini 3 Pro Image
metadata: {"clawdbot":{"requires":{"bins":["uv"],"env":["GEMINI_API_KEY"],"config":["browser.enabled"]},"primaryEnv":"GEMINI_API_KEY"}}
---
```

Felder unter `metadata.clawdbot`:

- `always: true`: Skill immer laden (andere Gateing überspringen)
- `emoji`: Emoji, das in der macOS-Skills-Benutzeroberfläche angezeigt wird
- `homepage`: Website-Link, der in der macOS-Skills-Benutzeroberfläche angezeigt wird
- `os`: Liste der Plattformen (`darwin`, `linux`, `win32`), Skill ist nur auf diesen Betriebssystemen verfügbar
- `requires.bins`: Liste, jeder muss in `PATH` vorhanden sein
- `requires.anyBins`: Liste, mindestens einer muss in `PATH` vorhanden sein
- `requires.env`: Liste, Umgebungsvariablen müssen vorhanden sein oder in der Konfiguration bereitgestellt werden
- `requires.config`: Liste von `clawdbot.json`-Pfaden, müssen wahr sein
- `primaryEnv`: Name der Umgebungsvariablen, die mit `skills.entries.<name>.apiKey` verknüpft ist
- `install`: Array optionaler Installator-Spezifikationen (für macOS-Skills-Benutzeroberfläche)

::: warning Binär-Prüfung in Sandbox-Umgebung
`requires.bins` wird beim Laden des Skills auf dem **Host** überprüft. Wenn der Agent in einer Sandbox ausgeführt wird, muss das Binary auch im Container vorhanden sein.
Abhängigkeiten können über `agents.defaults.sandbox.docker.setupCommand` installiert werden.
:::

### Injektion von Umgebungsvariablen

Wenn die Agent-Ausführung beginnt, führt Clawdbot Folgendes aus:

1. Liest die Skill-Metadaten
2. Wendet alle `skills.entries.<key>.env` oder `skills.entries.<key>.apiKey` auf `process.env` an
3. Baut den System-Prompt mit Skills, die die Bedingungen erfüllen
4. Stellt die ursprüngliche Umgebung nach Abschluss der Agent-Ausführung wieder her

Dies ist **auf den Ausführungsbereich des Agents beschränkt**, nicht die globale Shell-Umgebung.

## Folgen Sie diesen Schritten

### Schritt 1: Installierte Skills anzeigen

Verwenden Sie die CLI, um die aktuell verfügbaren Skills aufzulisten:

```bash
clawdbot skills list
```

Oder nur Skills anzeigen, die die Bedingungen erfüllen:

```bash
clawdbot skills list --eligible
```

**Sie sollten sehen**: Skill-Liste mit Name, Beschreibung, ob die Bedingungen erfüllt sind (wie Binaries, Umgebungsvariablen)

### Schritt 2: Skills von ClawdHub installieren

ClawdHub ist das öffentliche Skill-Register von Clawdbot, wo Sie Skills durchsuchen, installieren, aktualisieren und veröffentlichen können.

#### CLI installieren

Wählen Sie eine Methode, um ClawdHub CLI zu installieren:

```bash
npm i -g clawdhub
```

oder

```bash
pnpm add -g clawdhub
```

#### Skills suchen

```bash
clawdhub search "postgres backups"
```

#### Skill installieren

```bash
clawdhub install <skill-slug>
```

Standardmäßig installiert die CLI im Unterverzeichnis `./skills` des aktuellen Arbeitsverzeichnisses (oder fällt auf den konfigurierten Clawdbot-Workspace zurück). Clawdbot lädt es beim nächsten Sitzungsstart als `<workspace>/skills`.

**Sie sollten sehen**: Installationsausgabe, die den Skill-Ordner und die Versionsinformationen anzeigt.

### Schritt 3: Installierte Skills aktualisieren

Alle installierten Skills aktualisieren:

```bash
clawdhub update --all
```

Oder einen bestimmten Skill aktualisieren:

```bash
clawdhub update <slug>
```

**Sie sollten sehen**: Aktualisierungsstatus jedes Skills, einschließlich Versionsänderungen.

### Schritt 4: Skill-Überschreibung konfigurieren

Konfigurieren Sie in `~/.clawdbot/clawdbot.json` den Aktivierungsstatus, Umgebungsvariablen usw. der Skills:

```json5
{
  "skills": {
    "entries": {
      "nano-banana-pro": {
        "enabled": true,
        "apiKey": "GEMINI_KEY_HERE",
        "env": {
          "GEMINI_API_KEY": "GEMINI_KEY_HERE"
        },
        "config": {
          "endpoint": "https://example.invalid",
          "model": "nano-pro"
        }
      },
      "peekaboo": { "enabled": true },
      "sag": { "enabled": false }
    }
  }
}
```

**Regeln**:

- `enabled: false`: Deaktiviert den Skill, selbst wenn er Bundled oder installiert ist
- `env`: Injiziert Umgebungsvariablen (nur wenn die Variable im Prozess nicht festgelegt ist)
- `apiKey`: Bequemes Feld für Skills, die `metadata.clawdbot.primaryEnv` deklarieren
- `config`: Paket optionaler benutzerdefinierter Felder, benutzerdefinierte Schlüssel müssen hier platziert werden

**Sie sollten sehen**: Nach dem Speichern der Konfiguration wendet Clawdbot diese Einstellungen bei der nächsten Agent-Ausführung an.

### Schritt 5: Skill-Monitor aktivieren (optional)

Standardmäßig überwacht Clawdbot den Skill-Ordner und aktualisiert den Skill-Snapshot, wenn sich die `SKILL.md`-Datei ändert. Sie können dies unter `skills.load` konfigurieren:

```json5
{
  "skills": {
    "load": {
      "watch": true,
      "watchDebounceMs": 250
    }
  }
}
```

**Sie sollten sehen**: Nach dem Ändern der Skill-Datei aktualisiert Clawdbot die Skill-Liste im nächsten Agent-Durchlauf automatisch, ohne das Gateway neu zu starten.

### Schritt 6: Skill-Probleme debuggen

Detaillierte Informationen zum Skill und fehlende Abhängigkeiten anzeigen:

```bash
clawdbot skills info <name>
```

Abhängigkeitsstatus aller Skills überprüfen:

```bash
clawdbot skills check
```

**Sie sollten sehen**: Detaillierte Informationen zum Skill, einschließlich Binaries, Umgebungsvariablen, Konfigurationsstatus und fehlenden Bedingungen.

## Kontrollpunkt ✅

Nach Abschluss der oben genannten Schritte sollten Sie in der Lage sein zu:

- [ ] `clawdbot skills list` verwenden, um alle verfügbaren Skills anzuzeigen
- [ ] Neue Skills von ClawdHub installieren
- [ ] Installierte Skills aktualisieren
- [ ] Skill-Überschreibungen in `clawdbot.json` konfigurieren
- [ ] `skills check` verwenden, um Skill-Abhängigkeitsprobleme zu debuggen

## Häufige Fehler

### Häufiger Fehler 1: Skill-Name enthält Bindestriche

**Problem**: Verwendung des Skill-Namens mit Bindestrichen als Schlüssel in `skills.entries`

```json
// ❌ Fehler: ohne Anführungszeichen
{
  "skills": {
    "entries": {
      nano-banana-pro: { "enabled": true }  // JSON-Syntaxfehler
    }
  }
}
```

**Korrektur**: Den Schlüssel mit Anführungszeichen umgeben (JSON5 unterstützt Schlüssel mit Anführungszeichen)

```json
// ✅ Korrekt: mit Anführungszeichen
{
  "skills": {
    "entries": {
      "nano-banana-pro": { "enabled": true }
    }
  }
}
```

### Häufiger Fehler 2: Umgebungsvariablen in Sandbox-Umgebung

**Problem**: Skill wird in einer Sandbox ausgeführt, aber `skills.entries.<skill>.env` oder `apiKey` haben keine Wirkung

**Ursache**: Globale `env` und `skills.entries.<skill>.env/apiKey` gelten nur für die **Host-Ausführung**, die Sandbox erbt nicht den `process.env` des Hosts.

**Korrektur**: Verwenden Sie eine der folgenden Methoden:

```json5
{
  "agents": {
    "defaults": {
      "sandbox": {
        "docker": {
          "env": {
            "GEMINI_API_KEY": "your_key_here"
          }
        }
      }
    }
  }
}
```

Oder backen Sie die Umgebungsvariablen in das benutzerdefinierte Sandbox-Image.

### Häufiger Fehler 3: Skill wird nicht in der Liste angezeigt

**Problem**: Skill installiert, aber `clawdbot skills list` zeigt ihn nicht an

**Mögliche Ursachen**:

1. Skill erfüllt keine Gating-Bedingungen (fehlende Binaries, Umgebungsvariablen, Konfiguration)
2. Skill ist deaktiviert (`enabled: false`)
3. Skill befindet sich nicht in den von Clawdbot durchsuchten Verzeichnissen

**Fehlerbehebungsschritte**:

```bash
# Skill-Abhängigkeiten überprüfen
clawdbot skills check

# Überprüfen, ob das Skill-Verzeichnis durchsucht wird
ls -la ~/.clawdbot/skills/
ls -la <workspace>/skills/
```

### Häufiger Fehler 4: Skill-Konflikte und Prioritätsverwirrung

**Problem**: Es existiert ein Skill mit demselben Namen an mehreren Orten, welcher wird geladen?

**Erinnern Sie sich an die Priorität**:

`<workspace>/skills` (höchste) → `~/.clawdbot/skills` → bundled skills (niedrigste)

Wenn Sie Bundled-Skills anstelle von Workspace-Überschreibungen verwenden möchten:

1. Löschen oder umbenennen Sie `<workspace>/skills/<skill-name>`
2. Oder deaktivieren Sie diesen Skill in `skills.entries`

## Zusammenfassung des Kurses

In diesem Kurs haben Sie die Kernkonzepte der Skill-Plattform von Clawdbot kennengelernt:

- **Drei Skill-Typen**: Bundled, Managed, Workspace, geladen nach Priorität
- **ClawdHub-Integration**: öffentliches Register zum Durchsuchen, Installieren, Aktualisieren und Veröffentlichen von Skills
- **Skill-Gating**: Filtern von Skills nach dem `requires`-Feld der Metadaten
- **Konfigurationsüberschreibung**: Steuern der Aktivierung, Umgebungsvariablen und benutzerdefinierten Konfiguration in `clawdbot.json`
- **Skill-Monitor**: Aktualisiert die Skill-Liste automatisch, ohne das Gateway neu zu starten

Das Skill-System ist der zentrale Mechanismus zur Erweiterung der Fähigkeiten von Clawdbot. Wenn Sie es beherrschen, kann sich Ihr KI-Assistent an mehr Szenarien und Tools anpassen.

## Nächster Kurs

> Im nächsten Kurs lernen wir **[Sicherheit und Sandbox-Isolation](../security-sandbox/)**.
>
> Sie lernen:
> - Sicherheitsmodell und Berechtigungssteuerung
> - Allowlist/Denylist für Tool-Berechtigungen
> - Docker-Sandbox-Isolationsmechanismus
> - Sicherheitskonfiguration für Remote-Gateway

---

#### Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie, um Quellcode-Orte anzuzeigen</strong></summary>

> Aktualisierungsdatum: 2026-01-27

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
| Typdefinition der Skill-Konfiguration | [`src/config/types.skills.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/types.skills.ts) | 1-32 |
| Dokumentation des Skill-Systems | [`docs/tools/skills.md`](https://github.com/moltbot/moltbot/blob/main/docs/tools/skills.md) | 1-260 |
|--- | --- | ---|
| ClawdHub-Dokumentation | [`docs/tools/clawdhub.md`](https://github.com/moltbot/moltbot/blob/main/docs/tools/clawdhub.md) | 1-202 |
|--- | --- | ---|
| CLI-Befehle | [`docs/cli/skills.md`](https://github.com/moltbot/moltbot/blob/main/docs/cli/skills.md) | 1-26 |

**Wichtige Typen**:

- `SkillConfig`: Konfiguration eines einzelnen Skills (enabled, apiKey, env, config)
- `SkillsLoadConfig`: Skill-Ladekonfiguration (extraDirs, watch, watchDebounceMs)
- `SkillsInstallConfig`: Skill-Installationskonfiguration (preferBrew, nodeManager)
- `SkillsConfig`: Konfiguration auf oberster Ebene für Skills (allowBundled, load, install, entries)

**Beispiele für integrierte Skills**:

- `skills/gemini/SKILL.md`: Gemini-CLI-Skill
- `skills/peekaboo/SKILL.md`: Peekaboo-macOS-UI-Automatisierungs-Skill

</details>

---
title: "MCP-Konfiguration: Externe Dienste erweitern | Everything Claude Code"
sidebarTitle: "Externe Dienste verbinden"
subtitle: "MCP-Server-Konfiguration: Erweitern Sie die Integrationsfähigkeiten von Claude Code für externe Dienste"
description: "Lernen Sie die MCP-Konfiguration. Wählen Sie aus 15 vorkonfigurierten Servern die passenden für Ihr Projekt, konfigurieren Sie API-Schlüssel und Umgebungsvariablen, und optimieren Sie die Nutzung des Kontextfensters."
tags:
  - "mcp"
  - "configuration"
  - "integration"
prerequisite:
  - "start-installation"
order: 40
---
# MCP-Server-Konfiguration: Erweitern Sie die Integrationsfähigkeiten von Claude Code für externe Dienste

## Was Sie nach diesem Tutorial können werden

- Verstehen, was MCP ist und wie es die Fähigkeiten von Claude Code erweitert
- Aus 15 vorkonfigurierten MCP-Servern die passenden für Ihr Projekt auswählen
- API-Schlüssel und Umgebungsvariablen korrekt konfigurieren
- Die MCP-Nutzung optimieren, um eine Überlastung des Kontextfensters zu vermeiden

## Ihre aktuelle Situation

Claude Code verfügt standardmäßig nur über Dateioperationen und Befehlsausführung, aber Sie benötigen möglicherweise:

- GitHub PRs und Issues abfragen
- Webinhalte abrufen
- Supabase-Datenbanken bedienen
- Echtzeit-Dokumentation abfragen
- Sitzungsübergreifende persistente Speicherung

Wenn Sie diese Aufgaben manuell erledigen, müssen Sie ständig zwischen Tools wechseln und kopieren/einfügen – das ist ineffizient. MCP-Server (Model Context Protocol) können Ihnen helfen, diese externen Dienste automatisch zu integrieren.

## Wann Sie diese Methode anwenden sollten

**Geeignete Situationen für MCP-Server**:
- Ihr Projekt umfasst Drittanbieter-Dienste wie GitHub, Vercel, Supabase
- Sie müssen Echtzeit-Dokumentation abfragen (z. B. Cloudflare, ClickHouse)
- Sie benötigen sitzungsübergreifende Zustandsspeicherung
- Sie benötigen Web-Scraping oder UI-Komponenten-Generierung

**Situationen, in denen MCP nicht benötigt wird**:
- Nur lokale Dateioperationen
- Reine Frontend-Entwicklung ohne externe Dienste
- Einfache CRUD-Anwendungen mit wenigen Datenbankoperationen

## 🎒 Vorbereitung

Bevor Sie mit der Konfiguration beginnen, stellen Sie sicher:

::: warning Voraussetzungen prüfen

- ✅ [Plugin-Installation](../installation/) abgeschlossen
- ✅ Vertraut mit grundlegender JSON-Konfigurationssyntax
- ✅ API-Schlüssel für die zu integrierenden Dienste vorhanden (GitHub PAT, Firecrawl API Key usw.)
- ✅ Kenntnis des Speicherorts der `~/.claude.json` Konfigurationsdatei

:::

## Das Grundprinzip

### Was ist MCP

**MCP (Model Context Protocol)** ist das Protokoll, das Claude Code verwendet, um sich mit externen Diensten zu verbinden. Es ermöglicht der KI den Zugriff auf externe Ressourcen wie GitHub, Datenbanken und Dokumentationsabfragen – wie eine Erweiterung der Fähigkeiten.

**Funktionsweise**:

```
Claude Code ←→ MCP Server ←→ External Service
   (lokal)       (Middleware)     (GitHub/Supabase/...)
```

### MCP-Konfigurationsstruktur

Jede MCP-Server-Konfiguration enthält:

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",          // Startbefehl
      "args": ["-y", "package"],  // Befehlsargumente
      "env": {                   // Umgebungsvariablen
        "API_KEY": "YOUR_KEY"
      },
      "description": "Funktionsbeschreibung"   // Beschreibung
    }
  }
}
```

**Typen**:
- **npx-Typ**: Verwendet npm-Pakete (z. B. GitHub, Firecrawl)
- **http-Typ**: Verbindet sich mit HTTP-Endpunkten (z. B. Vercel, Cloudflare)

### Kontextfenster-Management (Wichtig!)

::: warning Kontextwarnung

Jeder aktivierte MCP-Server belegt Kontextfenster-Kapazität. Zu viele aktivierte Server können das 200K-Kontextfenster auf 70K reduzieren.

**Goldene Regeln**:
- Konfigurieren Sie 20-30 MCP-Server (alle verfügbar)
- Aktivieren Sie pro Projekt < 10
- Halten Sie die Gesamtzahl aktiver Tools < 80

Verwenden Sie `disabledMcpServers` in der Projektkonfiguration, um nicht benötigte MCPs zu deaktivieren.

:::

## Schritt für Schritt

### Schritt 1: Verfügbare MCP-Server anzeigen

Everything Claude Code bietet **15 vorkonfigurierte MCP-Server**:

| MCP-Server | Typ | Schlüssel erforderlich | Verwendungszweck |
| --- | --- | --- | --- |
| **github** | npx | ✅ GitHub PAT | PR-, Issues-, Repos-Operationen |
| **firecrawl** | npx | ✅ API Key | Web-Scraping und Crawling |
| **supabase** | npx | ✅ Project Ref | Datenbankoperationen |
| **memory** | npx | ❌ | Sitzungsübergreifende persistente Speicherung |
| **sequential-thinking** | npx | ❌ | Verkettete Schlussfolgerung |
| **vercel** | http | ❌ | Deployment und Projektverwaltung |
| **railway** | npx | ❌ | Railway-Deployment |
| **cloudflare-docs** | http | ❌ | Dokumentationssuche |
| **cloudflare-workers-builds** | http | ❌ | Workers-Builds |
| **cloudflare-workers-bindings** | http | ❌ | Workers-Bindings |
| **cloudflare-observability** | http | ❌ | Logs und Monitoring |
| **clickhouse** | http | ❌ | Analytische Abfragen |
| **context7** | npx | ❌ | Echtzeit-Dokumentationssuche |
| **magic** | npx | ❌ | UI-Komponenten-Generierung |
| **filesystem** | npx | ❌ (Pfad erforderlich) | Dateisystemoperationen |

**Sie sollten sehen**: Eine vollständige Liste von 15 MCP-Servern, die gängige Szenarien wie GitHub, Deployment, Datenbanken und Dokumentationsabfragen abdecken.

---

### Schritt 2: MCP-Konfiguration nach Claude Code kopieren

Kopieren Sie die Konfiguration aus dem Quellverzeichnis:

```bash
# MCP-Konfigurationsvorlage kopieren
cp source/affaan-m/everything-claude-code/mcp-configs/mcp-servers.json ~/.claude/mcp-servers-backup.json
```

**Warum**: Sichern Sie die Originalkonfiguration für spätere Referenz und Vergleiche.

---

### Schritt 3: Benötigte MCP-Server auswählen

Wählen Sie basierend auf Ihren Projektanforderungen die benötigten MCP-Server aus.

**Beispielszenarien**:

| Projekttyp | Empfohlene MCPs |
| --- | --- |
| **Full-Stack-Anwendung** (GitHub + Supabase + Vercel) | github, supabase, vercel, memory, context7 |
| **Frontend-Projekt** (Vercel + Dokumentationsabfrage) | vercel, cloudflare-docs, context7, magic |
| **Datenprojekt** (ClickHouse + Analyse) | clickhouse, sequential-thinking, memory |
| **Allgemeine Entwicklung** | github, filesystem, memory, context7 |

**Sie sollten sehen**: Eine klare Zuordnung von Projekttypen zu MCP-Servern.

---

### Schritt 4: `~/.claude.json` Konfigurationsdatei bearbeiten

Öffnen Sie Ihre Claude Code Konfigurationsdatei:

::: code-group

```bash [macOS/Linux]
vim ~/.claude.json
```

```powershell [Windows]
notepad $env:USERPROFILE\.claude.json
```

:::

Fügen Sie den `mcpServers`-Abschnitt in `~/.claude.json` hinzu:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"
      },
      "description": "GitHub operations - PRs, issues, repos"
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "description": "Persistent memory across sessions"
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server"],
      "description": "Live documentation lookup"
    }
  }
}
```

**Warum**: Dies ist die Kernkonfiguration, die Claude Code mitteilt, welche MCP-Server gestartet werden sollen.

**Sie sollten sehen**: Das `mcpServers`-Objekt enthält die Konfiguration Ihrer ausgewählten MCP-Server.

---

### Schritt 5: API-Schlüssel-Platzhalter ersetzen

Ersetzen Sie für MCP-Server, die API-Schlüssel benötigen, die `YOUR_*_HERE`-Platzhalter:

**GitHub MCP Beispiel**:

1. GitHub Personal Access Token generieren:
   - Besuchen Sie https://github.com/settings/tokens
   - Erstellen Sie einen neuen Token mit `repo`-Berechtigung

2. Ersetzen Sie den Platzhalter in der Konfiguration:

```json
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"  // Durch tatsächlichen Token ersetzen
  }
}
```

**Andere MCPs, die Schlüssel benötigen**:

| MCP | Schlüsselname | Bezugsquelle |
| --- | --- | --- |
| **firecrawl** | FIRECRAWL_API_KEY | https://www.firecrawl.dev/ |
| **supabase** | --project-ref | https://supabase.com/dashboard |

**Warum**: Ohne tatsächliche Schlüssel können MCP-Server keine Verbindung zu externen Diensten herstellen.

**Sie sollten sehen**: Alle `YOUR_*_HERE`-Platzhalter sind durch tatsächliche Schlüssel ersetzt.

---

### Schritt 6: Projektspezifische MCP-Deaktivierung konfigurieren (Empfohlen)

Um zu vermeiden, dass alle Projekte alle MCPs aktivieren, erstellen Sie `.claude/config.json` im Projektstammverzeichnis:

```json
{
  "disabledMcpServers": [
    "supabase",      // Nicht benötigte MCPs deaktivieren
    "railway",
    "firecrawl"
  ]
}
```

**Warum**: So können Sie auf Projektebene flexibel steuern, welche MCPs aktiv sind, und eine Überlastung des Kontextfensters vermeiden.

**Sie sollten sehen**: Die `.claude/config.json`-Datei enthält das `disabledMcpServers`-Array.

---

### Schritt 7: Claude Code neu starten

Starten Sie Claude Code neu, damit die Konfiguration wirksam wird:

```bash
# Claude Code stoppen (falls aktiv)
# Dann neu starten
claude
```

**Warum**: Die MCP-Konfiguration wird beim Start geladen und erfordert einen Neustart.

**Sie sollten sehen**: Nach dem Start von Claude Code werden die MCP-Server automatisch geladen.

## Checkpoints ✅

Überprüfen Sie, ob die MCP-Konfiguration erfolgreich war:

1. **MCP-Ladestatus prüfen**:

Geben Sie in Claude Code ein:

```bash
/tool list
```

**Erwartetes Ergebnis**: Sie sehen die geladenen MCP-Server und die Tool-Liste.

2. **MCP-Funktionalität testen**:

Wenn Sie GitHub MCP aktiviert haben, testen Sie eine Abfrage:

```bash
# GitHub Issues abfragen
@mcp list issues
```

**Erwartetes Ergebnis**: Eine Liste der Issues Ihres Repositories wird zurückgegeben.

3. **Kontextfenster prüfen**:

Überprüfen Sie die Anzahl der Tools in `~/.claude.json`:

```bash
jq '.mcpServers | length' ~/.claude.json
```

**Erwartetes Ergebnis**: Die Anzahl der aktivierten MCP-Server ist < 10.

::: tip Debugging-Tipps

Wenn MCP nicht erfolgreich geladen wurde, überprüfen Sie die Claude Code Logdateien:
- macOS/Linux: `~/.claude/logs/`
- Windows: `%USERPROFILE%\.claude\logs\`

:::

## Häufige Probleme und Lösungen

### Problem 1: Zu viele MCPs führen zu unzureichendem Kontext

**Symptom**: Das Kontextfenster zeigt zu Beginn der Konversation nur 70K statt 200K.

**Ursache**: Jedes aktivierte MCP-Tool belegt Kontextfenster-Kapazität.

**Lösung**:
1. Überprüfen Sie die Anzahl der aktivierten MCPs (`~/.claude.json`)
2. Verwenden Sie projektspezifisches `disabledMcpServers`, um nicht benötigte MCPs zu deaktivieren
3. Halten Sie die Gesamtzahl aktiver Tools < 80

---

### Problem 2: API-Schlüssel nicht korrekt konfiguriert

**Symptom**: Beim Aufrufen von MCP-Funktionen erscheinen Berechtigungsfehler oder Verbindungsfehler.

**Ursache**: `YOUR_*_HERE`-Platzhalter wurden nicht ersetzt.

**Lösung**:
1. Überprüfen Sie das `env`-Feld in `~/.claude.json`
2. Stellen Sie sicher, dass alle Platzhalter durch tatsächliche Schlüssel ersetzt wurden
3. Überprüfen Sie, ob die Schlüssel ausreichende Berechtigungen haben (z. B. benötigt GitHub Token `repo`-Berechtigung)

---

### Problem 3: Filesystem MCP Pfadfehler

**Symptom**: Filesystem MCP kann nicht auf das angegebene Verzeichnis zugreifen.

**Ursache**: Der Pfad in `args` wurde nicht durch den tatsächlichen Pfad ersetzt.

**Lösung**:
```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/yourname/projects"],  // Durch Ihren Projektpfad ersetzen
    "description": "Filesystem operations"
  }
}
```

---

### Problem 4: Projektspezifische Konfiguration wird nicht angewendet

**Symptom**: `disabledMcpServers` im Projektstammverzeichnis deaktiviert MCPs nicht.

**Ursache**: `.claude/config.json` Pfad oder Format ist fehlerhaft.

**Lösung**:
1. Stellen Sie sicher, dass die Datei im Projektstammverzeichnis liegt: `.claude/config.json`
2. Überprüfen Sie das JSON-Format (validieren Sie mit `jq .`)
3. Stellen Sie sicher, dass `disabledMcpServers` ein String-Array ist

## Zusammenfassung dieser Lektion

In dieser Lektion haben Sie die MCP-Server-Konfiguration gelernt:

**Wichtige Punkte**:
- MCP erweitert die Integrationsfähigkeiten von Claude Code für externe Dienste
- Wählen Sie aus 15 vorkonfigurierten MCPs die passenden aus (empfohlen < 10)
- Ersetzen Sie `YOUR_*_HERE`-Platzhalter durch tatsächliche API-Schlüssel
- Verwenden Sie projektspezifisches `disabledMcpServers`, um die Anzahl zu kontrollieren
- Halten Sie die Gesamtzahl aktiver Tools < 80, um eine Überlastung des Kontextfensters zu vermeiden

**Nächster Schritt**: Sie haben die MCP-Server konfiguriert. In der nächsten Lektion lernen Sie die Kern-Commands kennen.

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen Sie **[Kern-Commands im Detail](../../platforms/commands-overview/)** kennen.
>
> Sie werden lernen:
> - Die Funktionen und Anwendungsfälle der 14 Slash-Commands
> - Wie der `/plan`-Befehl Implementierungspläne erstellt
> - Wie der `/tdd`-Befehl testgetriebene Entwicklung durchführt
> - Wie Sie durch Commands schnell komplexe Workflows auslösen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-25

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| MCP-Konfigurationsvorlage | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-92 |
| README Wichtige Hinweise | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md) | 348-369 |

**Wichtige Konfigurationen**:
- 15 MCP-Server (GitHub, Firecrawl, Supabase, Memory, Sequential-thinking, Vercel, Railway, Cloudflare-Serie, ClickHouse, Context7, Magic, Filesystem)
- Unterstützt zwei Typen: npx (Kommandozeile) und http (Endpunktverbindung)
- Verwendet `disabledMcpServers` für projektspezifische Kontrolle der aktivierten Anzahl

**Wichtige Regeln**:
- Konfigurieren Sie 20-30 MCP-Server
- Aktivieren Sie pro Projekt < 10
- Halten Sie die Gesamtzahl aktiver Tools < 80
- Risiko der Reduzierung des Kontextfensters von 200K auf 70K

</details>

---
title: "MCP-Verbindungsfehler: Fehlerbehebung bei Konfigurationsproblemen | Everything Claude Code"
sidebarTitle: "MCP-Verbindungsprobleme lösen"
subtitle: "MCP-Verbindungsfehler: Fehlerbehebung bei Konfigurationsproblemen"
description: "Lernen Sie, wie Sie MCP-Server-Verbindungsprobleme diagnostizieren. Lösen Sie 6 häufige Fehler, einschließlich API-Schlüssel-Fehler, zu kleines Kontextfenster, falsche Server-Typ-Konfiguration und mehr, mit systematischen Lösungsansätzen."
tags:
  - "troubleshooting"
  - "mcp"
  - "configuration"
prerequisite:
  - "start-mcp-setup"
order: 160
---

# Häufige Probleme: MCP-Verbindungsfehler

## Ihre aktuelle Situation

Nach der Konfiguration von MCP-Servern können folgende Probleme auftreten:

- ❌ Claude Code zeigt "Failed to connect to MCP server"
- ❌ GitHub/Supabase-bezogene Befehle funktionieren nicht
- ❌ Kontextfenster wird plötzlich kleiner, Tool-Aufrufe werden langsamer
- ❌ Filesystem MCP kann nicht auf Dateien zugreifen
- ❌ Zu viele aktivierte MCP-Server, System läuft langsam

Keine Sorge, für all diese Probleme gibt es klare Lösungen. Diese Lektion hilft Ihnen, MCP-Verbindungsprobleme systematisch zu diagnostizieren.

---

## Häufiges Problem 1: API-Schlüssel nicht konfiguriert oder ungültig

### Symptome

Wenn Sie versuchen, MCP-Server wie GitHub oder Firecrawl zu verwenden, zeigt Claude Code:

```
Failed to execute tool: Missing GITHUB_PERSONAL_ACCESS_TOKEN
```

oder

```
Failed to connect to MCP server: Authentication failed
```

### Ursache

Die `YOUR_*_HERE`-Platzhalter in der MCP-Konfigurationsdatei wurden nicht durch tatsächliche API-Schlüssel ersetzt.

### Lösung

**Schritt 1: Konfigurationsdatei überprüfen**

Öffnen Sie `~/.claude.json` und finden Sie die Konfiguration des entsprechenden MCP-Servers:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"  // ← Hier überprüfen
      },
      "description": "GitHub operations - PRs, issues, repos"
    }
  }
}
```

**Schritt 2: Platzhalter ersetzen**

Ersetzen Sie `YOUR_GITHUB_PAT_HERE` durch Ihren tatsächlichen API-Schlüssel:

```json
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxxxxxxxxxx"
  }
}
```

**Schritt 3: API-Schlüssel für gängige MCP-Server abrufen**

| MCP-Server | Umgebungsvariable | Bezugsquelle |
| --- | --- | --- |
| GitHub | `GITHUB_PERSONAL_ACCESS_TOKEN` | GitHub Settings → Developer Settings → Personal access tokens |
| Firecrawl | `FIRECRAWL_API_KEY` | Firecrawl Dashboard → API Keys |
| Supabase | Projektreferenz | Supabase Dashboard → Settings → API |

**Was Sie sehen sollten**: Nach dem Neustart von Claude Code können die entsprechenden Tools normal aufgerufen werden.

### Wichtige Hinweise

::: danger Sicherheitshinweis
Committen Sie keine Konfigurationsdateien mit echten API-Schlüsseln in Git-Repositories. Stellen Sie sicher, dass `~/.claude.json` in `.gitignore` enthalten ist.
:::

---

## Häufiges Problem 2: Kontextfenster zu klein

### Symptome

- Tool-Aufruf-Liste wird plötzlich sehr kurz
- Claude zeigt "Context window exceeded"
- Antwortgeschwindigkeit deutlich langsamer

### Ursache

Zu viele MCP-Server aktiviert, was das Kontextfenster belegt. Laut Projekt-README **schrumpft das 200k-Kontextfenster auf 70k, wenn zu viele MCPs aktiviert sind**.

### Lösung

**Schritt 1: Anzahl der aktivierten MCPs überprüfen**

Sehen Sie sich den `mcpServers`-Abschnitt in `~/.claude.json` an und zählen Sie die aktivierten Server.

**Schritt 2: Nicht benötigte Server mit `disabledMcpServers` deaktivieren**

Fügen Sie in der projektspezifischen Konfiguration (`~/.claude/settings.json` oder Projekt `.claude/settings.json`) hinzu:

```json
{
  "disabledMcpServers": [
    "railway",
    "cloudflare-docs",
    "cloudflare-workers-builds",
    "magic",
    "filesystem"
  ]
}
```

**Schritt 3: Best Practices befolgen**

Gemäß den Empfehlungen im README:

- Konfigurieren Sie 20-30 MCP-Server (in der Konfigurationsdatei definiert)
- Aktivieren Sie < 10 MCP-Server pro Projekt
- Halten Sie die Anzahl aktiver Tools < 80

**Was Sie sehen sollten**: Tool-Liste kehrt zur normalen Länge zurück, Antwortgeschwindigkeit verbessert sich.

### Wichtige Hinweise

::: tip Erfahrungswert
Es wird empfohlen, verschiedene MCP-Kombinationen je nach Projekttyp zu aktivieren. Zum Beispiel:
- Web-Projekte: GitHub, Firecrawl, Memory, Context7
- Datenprojekte: Supabase, ClickHouse, Sequential-thinking
:::

---

## Häufiges Problem 3: Falsche Server-Typ-Konfiguration

### Symptome

```
Failed to start MCP server: Command not found
```

oder

```
Failed to connect: Invalid server type
```

### Ursache

Verwechslung der beiden MCP-Server-Typen `npx` und `http`.

### Lösung

**Schritt 1: Server-Typ bestätigen**

Überprüfen Sie `mcp-configs/mcp-servers.json` und unterscheiden Sie die beiden Typen:

**npx-Typ** (benötigt `command` und `args`):
```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"
    }
  }
}
```

**http-Typ** (benötigt `url`):
```json
{
  "vercel": {
    "type": "http",
    "url": "https://mcp.vercel.com"
  }
}
```

**Schritt 2: Konfiguration korrigieren**

| MCP-Server | Korrekter Typ | Korrekte Konfiguration |
| --- | --- | --- |
| GitHub | npx | `command: "npx"`, `args: ["-y", "@modelcontextprotocol/server-github"]` |
| Vercel | http | `type: "http"`, `url: "https://mcp.vercel.com"` |
| Cloudflare Docs | http | `type: "http"`, `url: "https://docs.mcp.cloudflare.com/mcp"` |
| Memory | npx | `command: "npx"`, `args: ["-y", "@modelcontextprotocol/server-memory"]` |

**Was Sie sehen sollten**: Nach dem Neustart startet der MCP-Server normal.

---

## Häufiges Problem 4: Falsche Filesystem-MCP-Pfadkonfiguration

### Symptome

- Filesystem-Tools können nicht auf Dateien zugreifen
- Meldung "Path not accessible" oder "Permission denied"

### Ursache

Der Pfadparameter des Filesystem MCP wurde nicht durch den tatsächlichen Projektpfad ersetzt.

### Lösung

**Schritt 1: Konfiguration überprüfen**

```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/your/projects"],
    "description": "Filesystem operations (set your path)"
  }
}
```

**Schritt 2: Durch tatsächlichen Pfad ersetzen**

Ersetzen Sie den Pfad entsprechend Ihrem Betriebssystem:

**macOS/Linux**:
```json
{
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/yourname/projects"]
}
```

**Windows**:
```json
{
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "C:\\Users\\yourname\\projects"]
}
```

**Schritt 3: Berechtigungen überprüfen**

Stellen Sie sicher, dass Sie Lese- und Schreibrechte für den konfigurierten Pfad haben.

**Was Sie sehen sollten**: Filesystem-Tools können normal auf Dateien im angegebenen Pfad zugreifen und diese bearbeiten.

### Wichtige Hinweise

::: warning Hinweise
- Verwenden Sie nicht das `~`-Symbol, Sie müssen den vollständigen Pfad verwenden
- Backslashes in Windows-Pfaden müssen als `\\` escaped werden
- Stellen Sie sicher, dass am Ende des Pfades kein überflüssiges Trennzeichen steht
:::

---

## Häufiges Problem 5: Supabase-Projektreferenz nicht konfiguriert

### Symptome

Supabase MCP-Verbindung schlägt fehl mit der Meldung "Missing project reference".

### Ursache

Der `--project-ref`-Parameter des Supabase MCP ist nicht konfiguriert.

### Lösung

**Schritt 1: Projektreferenz abrufen**

Im Supabase Dashboard:
1. Gehen Sie zu den Projekteinstellungen
2. Finden Sie den Abschnitt "Project Reference" oder "API"
3. Kopieren Sie die Projekt-ID (Format ähnlich `xxxxxxxxxxxxxxxx`)

**Schritt 2: Konfiguration aktualisieren**

```json
{
  "supabase": {
    "command": "npx",
    "args": ["-y", "@supabase/mcp-server-supabase@latest", "--project-ref=your-project-ref-here"],
    "description": "Supabase database operations"
  }
}
```

**Was Sie sehen sollten**: Supabase-Tools können normal Datenbankabfragen durchführen.

---

## Häufiges Problem 6: npx-Befehl nicht gefunden

### Symptome

```
Failed to start MCP server: npx: command not found
```

### Ursache

Node.js ist nicht installiert oder npx ist nicht im PATH.

### Lösung

**Schritt 1: Node.js-Version überprüfen**

```bash
node --version
```

**Schritt 2: Node.js installieren (falls fehlend)**

Besuchen Sie [nodejs.org](https://nodejs.org/) und laden Sie die neueste LTS-Version herunter und installieren Sie sie.

**Schritt 3: npx verifizieren**

```bash
npx --version
```

**Was Sie sehen sollten**: Die npx-Versionsnummer wird normal angezeigt.

---

## Diagnose-Flussdiagramm

Bei MCP-Problemen in folgender Reihenfolge diagnostizieren:

```
1. Überprüfen Sie, ob API-Schlüssel konfiguriert sind
   ↓ (konfiguriert)
2. Überprüfen Sie, ob die Anzahl aktivierter MCPs < 10 ist
   ↓ (Anzahl normal)
3. Überprüfen Sie den Server-Typ (npx vs http)
   ↓ (Typ korrekt)
4. Überprüfen Sie Pfadparameter (Filesystem, Supabase)
   ↓ (Pfad korrekt)
5. Überprüfen Sie, ob Node.js und npx verfügbar sind
   ↓ (verfügbar)
Problem gelöst!
```

---

## Zusammenfassung der Lektion

Die meisten MCP-Verbindungsprobleme sind konfigurationsbedingt. Merken Sie sich folgende Punkte:

- ✅ **API-Schlüssel**: Ersetzen Sie alle `YOUR_*_HERE`-Platzhalter
- ✅ **Kontextverwaltung**: Aktivieren Sie < 10 MCPs, verwenden Sie `disabledMcpServers` zum Deaktivieren nicht benötigter Server
- ✅ **Server-Typ**: Unterscheiden Sie zwischen npx- und http-Typ
- ✅ **Pfadkonfiguration**: Filesystem und Supabase benötigen spezifische Pfad-/Referenzkonfiguration
- ✅ **Umgebungsabhängigkeiten**: Stellen Sie sicher, dass Node.js und npx verfügbar sind

Wenn das Problem weiterhin besteht, überprüfen Sie `~/.claude/settings.json` und projektspezifische Konfigurationen auf Konflikte.

---



## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Fehlerbehebung bei Agent-Aufrufen](../troubleshooting-agents/)**.
>
> Sie werden lernen:
> - Diagnosemethoden für nicht geladene Agents und Konfigurationsfehler
> - Lösungsstrategien für unzureichende Tool-Berechtigungen
> - Diagnose von Agent-Ausführungs-Timeouts und unerwarteten Ausgaben

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-25

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| MCP-Konfigurationsdatei | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-91 |
| Kontextfenster-Warnung | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md) | 67-75 |

**Wichtige Konfigurationen**:
- `mcpServers.mcpServers.*.command`: Startbefehl für npx-Typ-Server
- `mcpServers.mcpServers.*.args`: Startparameter
- `mcpServers.mcpServers.*.env`: Umgebungsvariablen (API-Schlüssel)
- `mcpServers.mcpServers.*.type`: Server-Typ ("npx" oder "http")
- `mcpServers.mcpServers.*.url`: URL für http-Typ-Server

**Wichtige Kommentare**:
- `mcpServers._comments.env_vars`: Ersetzen Sie `YOUR_*_HERE`-Platzhalter
- `mcpServers._comments.disabling`: Verwenden Sie `disabledMcpServers` zum Deaktivieren von Servern
- `mcpServers._comments.context_warning`: Aktivieren Sie < 10 MCPs, um Kontextfenster zu erhalten

</details>

---
title: "Komplettleitfaden für Befehlsausführungstools und Genehmigungen: Sicherheitsmechanismen, Konfiguration und Fehlerbehebung | Clawdbot-Tutorial"
sidebarTitle: "Sicheres Ausführen von Befehlen mit KI"
subtitle: "Befehlsausführungstools und Genehmigungen"
description: "Erfahren Sie, wie Sie das exec-Tool von Clawdbot konfigurieren und verwenden, um Shell-Befehle auszuführen, die drei Ausführungsmodi (sandbox/gateway/node), Sicherheitsgenehmigungsmechanismen, Allowlist-Konfiguration und den Genehmigungsablauf verstehen. Dieses Tutorial enthält praktische Konfigurationsbeispiele, CLI-Befehle und Fehlerbehebung, um Ihnen zu helfen, die Fähigkeiten Ihres KI-Assistenten sicher zu erweitern."
tags:
  - "advanced"
  - "tools"
  - "exec"
  - "security"
  - "approvals"
prerequisite:
  - "start-gateway-startup"
order: 220
---

# Befehlsausführungstools und Genehmigungen

## Was Sie nach Abschluss können werden

- Konfigurieren Sie das exec-Tool zur Ausführung in drei Modi (sandbox/gateway/node)
- Verstehen und konfigurieren Sie Sicherheitsgenehmigungsmechanismen (deny/allowlist/full)
- Verwalten Sie die Allowlist (Zulassungsliste) und sichere bins
- Genehmigen Sie exec-Anfragen über die UI oder Chat-Kanäle
- Beheben Sie häufige Probleme und Sicherheitsfehler des exec-Tools

## Ihr aktuelles Dilemma

Das exec-Tool ermöglicht es KI-Assistenten, Shell-Befehle auszuführen, was sowohl leistungsstark als auch gefährlich ist:

- Wird die KI wichtige Dateien auf meinem System löschen?
- Wie kann ich die KI auf die Ausführung sicherer Befehle beschränken?
- Was sind die Unterschiede zwischen den verschiedenen Ausführungsmodi?
- Wie funktioniert der Genehmigungsablauf?
- Wie sollte die Allowlist konfiguriert werden?

## Wann Sie diesen Ansatz verwenden sollten

- Wenn Sie benötigen, dass die KI Systemvorgänge ausführt (Dateiverwaltung, Code-Erstellung)
- Wenn möchten, dass die KI benutzerdefinierte Skripte oder Tools aufruft
- Wenn Sie eine präzise Kontrolle über die Ausführungsberechtigungen der KI benötigen
- Wenn Sie bestimmte Befehle sicher zulassen müssen

## 🎒 Vorbereitung vor dem Start

::: warning Voraussetzungen
Dieses Tutorial geht davon aus, dass Sie [Gateway starten](../../start/gateway-startup/) abgeschlossen haben und der Gateway-Daemon ausgeführt wird.
:::

- Stellen Sie sicher, dass Node ≥22 installiert ist
- Der Gateway-Daemon wird ausgeführt
- Grundlegende Kenntnisse der Shell-Befehle und des Linux/Unix-Dateisystems

## Kernkonzepte

### Die drei Sicherheits-Schichten des exec-Tools

Das exec-Tool verwendet einen dreischichtigen Sicherheitsmechanismus zur Steuerung der Ausführungsberechtigungen der KI, von grober zu feiner Granularität：

1. **Tool-Policy (Tool Policy)**：steuert, ob das `exec`-Tool in `tools.policy` zulässig ist
2. **Ausführungs-Host (Host)**：Befehle werden in drei Umgebungen sandbox/gateway/node ausgeführt
3. **Genehmigungsmechanismus (Approvals)**：in den Modi gateway/node können weitere Einschränkungen über Allowlist und Genehmigungsaufforderungen angewendet werden

::: info Warum ist mehrschichtiger Schutz notwendig?
Einschichtiger Schutz ist leicht zu umgehen oder falsch zu konfigurieren. Mehrschichtiger Schutz stellt sicher, dass wenn eine Ebene ausfällt, die anderen Ebenen weiterhin Schutz bieten.
:::

### Vergleich der drei Ausführungsmodi

| Ausführungsmodus | Ausführungsort | Sicherheitsstufe | Typische Szenarien | Genehmigung erforderlich? |
|--- | --- | --- | --- | ---|
| **sandbox** | Innerhalb von Containern (z.B. Docker) | Hoch | Isolierte Umgebung, Tests | Nein |
| **gateway** | Der Computer, auf dem der Gateway-Daemon läuft | Mittel | Lokale Entwicklung, Integration | Ja (Allowlist + Genehmigung) |
| **node** | Gekoppelter Geräte-Knoten (macOS/iOS/Android) | Mittel | Lokale Geräteoperationen | Ja (Allowlist + Genehmigung) |

**Wichtige Unterschiede**：
- Der sandbox-Modus erfordert standardmäßig **keine Genehmigung** (kann jedoch durch Sandbox-Einschränkungen begrenzt sein)
- Die Modi gateway und node erfordern standardmäßig **eine Genehmigung** (es sei denn, sie sind als `full` konfiguriert)

## Lassen Sie uns beginnen

### Schritt 1: Die Parameter des exec-Tools verstehen

**Warum**
Das Verständnis der exec-Tool-Parameter ist die Grundlage für die Sicherheitskonfiguration.

Das exec-Tool unterstützt die folgenden Parameter：

```json
{
  "tool": "exec",
  "command": "ls -la",
  "workdir": "/path/to/dir",
  "env": { "NODE_ENV": "production" },
  "yieldMs": 10000,
  "background": false,
  "timeout": 1800,
  "pty": false,
  "host": "sandbox",
  "security": "allowlist",
  "ask": "on-miss",
  "node": "mac-1"
}
```

**Parameterbeschreibung**：

| Parameter | Typ | Standardwert | Beschreibung |
|--- | --- | --- | ---|
| `command` | string | Erforderlich | Auszuführender Shell-Befehl |
| `workdir` | string | Aktuelles Arbeitsverzeichnis | Ausführungsverzeichnis |
| `env` | object | Umgebung erben | Umgebungsvariablen überschreiben |
| `yieldMs` | number | 10000 | Automatisch in den Hintergrund wechseln nach Zeitüberschreitung (Millisekunden) |
| `background` | boolean | false | Sofort im Hintergrund ausführen |
| `timeout` | number | 1800 | Ausführungszeitüberschreitung (Sekunden) |
| `pty` | boolean | false | In einem Pseudo-Terminal ausführen (TTY-Unterstützung) |
| `host` | string | sandbox | Ausführungs-Host：`sandbox` \| `gateway` \| `node` |
| `security` | string | deny/allowlist | Sicherheitsrichtlinie：`deny` \| `allowlist` \| `full` |
| `ask` | string | on-miss | Genehmigungsrichtlinie：`off` \| `on-miss` \| `always` |
| `node` | string | - | ID oder Name des Zielknotens im node-Modus |

**Was Sie sehen sollten**：Die Parameterliste erklärt klar die Steuerungsmethoden für jeden Ausführungsmodus.

### Schritt 2: Den Standardausführungsmodus konfigurieren

**Warum**
Das Festlegen globaler Standardwerte über Konfigurationsdateien vermeidet die Angabe von Parametern bei jedem exec-Aufruf.

Bearbeiten Sie `~/.clawdbot/clawdbot.json`：

```json
{
  "tools": {
    "exec": {
      "host": "sandbox",
      "security": "allowlist",
      "ask": "on-miss",
      "node": "mac-1",
      "notifyOnExit": true,
      "approvalRunningNoticeMs": 10000,
      "pathPrepend": ["~/bin", "/opt/homebrew/bin"],
      "safeBins": ["jq", "grep", "cut"]
    }
  }
}
```

**Beschreibung der Konfigurationselemente**：

| Konfigurationselement | Typ | Standardwert | Beschreibung |
|--- | --- | --- | ---|
| `host` | string | sandbox | Standard-Ausführungs-Host |
| `security` | string | deny (sandbox) / allowlist (gateway, node) | Standard-Sicherheitsrichtlinie |
| `ask` | string | on-miss | Standard-Genehmigungsrichtlinie |
| `node` | string | - | Standard-Knoten im node-Modus |
| `notifyOnExit` | boolean | true | Systemereignis senden, wenn Hintergrundaufgaben beendet werden |
| `approvalRunningNoticeMs` | number | 10000 | "Wird ausgeführt"-Benachrichtigung nach Zeitüberschreitung senden (0 zum Deaktivieren) |
| `pathPrepend` | string[] | - | Liste der Verzeichnisse, die dem PATH voranzustellen sind |
| `safeBins` | string[] | [Standardliste] | Liste der sicheren Binärdateien (nur stdin-Operationen) |

**Was Sie sehen sollten**：Nach dem Speichern der Konfiguration verwendet das exec-Tool diese Standardwerte.

### Schritt 3: Die `/exec`-Sitzungsüberschreibung verwenden

**Warum**
Die Sitzungsüberschreibung ermöglicht es Ihnen, Ausführungsparameter temporär anzupassen, ohne die Konfigurationsdatei zu bearbeiten.

Senden Sie im Chat：

```
/exec host=gateway security=allowlist ask=on-miss node=mac-1
```

Die aktuellen Überschreibungswerte anzeigen：

```
/exec
```

**Was Sie sehen sollten**：exec-Parameterkonfiguration der aktuellen Sitzung.

### Schritt 4: Die Allowlist (Zulassungsliste) konfigurieren

**Warum**
Allowlist ist der zentrale Sicherheitsmechanismus in den Modi gateway/node, der nur die Ausführung bestimmter Befehle zulässt.

#### Allowlist bearbeiten

**Über UI bearbeiten**：

1. Öffnen Sie die Control UI
2. Wechseln Sie zum Tab **Nodes**
3. Finden Sie die Karte **Exec approvals**
4. Wählen Sie das Ziel (Gateway oder Node)
5. Wählen Sie den Agent (z.B. `main`)
6. Klicken Sie auf **Add pattern**, um ein Befehlsmuster hinzuzufügen
7. Klicken Sie auf **Save**, um zu speichern

**Über CLI bearbeiten**：

```bash
clawdbot approvals
```

**Über JSON-Datei bearbeiten**：

Bearbeiten Sie `~/.clawdbot/exec-approvals.json`：

```json
{
  "version": 1,
  "defaults": {
    "security": "deny",
    "ask": "on-miss",
    "askFallback": "deny",
    "autoAllowSkills": false
  },
  "agents": {
    "main": {
      "security": "allowlist",
      "ask": "on-miss",
      "askFallback": "deny",
      "autoAllowSkills": true,
      "allowlist": [
        {
          "id": "B0C8C0B3-2C2D-4F8A-9A3C-5A4B3C2D1E0F",
          "pattern": "~/Projects/**/bin/*",
          "lastUsedAt": 1737150000000,
          "lastUsedCommand": "rg -n TODO",
          "lastResolvedPath": "/Users/user/Projects/bin/rg"
        },
        {
          "id": "C1D9D1C4-3D3E-5F9B-0B4D-6B5C4D3E2F1G",
          "pattern": "/opt/homebrew/bin/rg",
          "lastUsedAt": 1737150000000,
          "lastUsedCommand": "rg test",
          "lastResolvedPath": "/opt/homebrew/bin/rg"
        }
      ]
    }
  }
}
```

**Allowlist-Modus-Beschreibung**：

Allowlist verwendet **glob-Musterabgleich** (Groß-/Kleinschreibung unempfindlich)：

| Muster | Übereinstimmung | Beschreibung |
|--- | --- | ---|
| `~/Projects/**/bin/*` | `/Users/user/Projects/any/bin/rg` | Übereinstimmung mit allen Unterverzeichnissen |
| `~/.local/bin/*` | `/Users/user/.local/bin/jq` | Übereinstimmung mit lokalem bin |
| `/opt/homebrew/bin/rg` | `/opt/homebrew/bin/rg` | Absolute Pfadübereinstimmung |

::: warning Wichtige Regeln
- **Nur aufgelöste Binärpfade werden abgeglichen**, Basename-Abgleich wird nicht unterstützt (z.B. `rg`)
- Shell-Verkettungen (`&&`, `||`, `;`) erfordern, dass jedes Segment die Allowlist erfüllt
- Umleitungen (`>`, `<`) werden im Allowlist-Modus nicht unterstützt
:::

**Was Sie sehen sollten**：Nach Konfiguration der Allowlist können nur übereinstimmende Befehle ausgeführt werden.

### Schritt 5: Sichere bins (Safe Bins) verstehen

**Warum**
Sichere bins sind eine Reihe sicherer Binärdateien, die nur stdin-Operationen unterstützen und im Allowlist-Modus ohne explizite Allowlist ausgeführt werden können.

**Standard sichere bins**：

`jq`, `grep`, `cut`, `sort`, `uniq`, `head`, `tail`, `tr`, `wc`

**Sicherheitsmerkmale sicherer bins**：

- Lehnt Positionsdateiargumente ab
- Lehnt pfadähnliche Flags ab
- Kann nur mit dem übergebenen Stream (stdin) arbeiten

**Benutzerdefinierte sichere bins konfigurieren**：

```json
{
  "tools": {
    "exec": {
      "safeBins": ["jq", "grep", "my-safe-tool"]
    }
  }
}
```

**Was Sie sehen sollten**：Safe-bin-Befehle können direkt im Allowlist-Modus ausgeführt werden.

### Schritt 6: exec-Anfragen über Chat-Kanäle genehmigen

**Warum**
Wenn die UI nicht verfügbar ist, können Sie exec-Anfragen über jeden Chat-Kanal (WhatsApp, Telegram, Slack usw.) genehmigen.

#### Genehmigungsweiterleitung aktivieren

Bearbeiten Sie `~/.clawdbot/clawdbot.json`：

```json
{
  "approvals": {
    "exec": {
      "enabled": true,
      "mode": "session",
      "agentFilter": ["main"],
      "sessionFilter": ["discord"],
      "targets": [
        { "channel": "slack", "to": "U12345678" },
        { "channel": "telegram", "to": "123456789" }
      ]
    }
  }
}
```

**Beschreibung der Konfigurationselemente**：

| Konfigurationselement | Beschreibung |
|--- | ---|
| `enabled` | Ob die exec-Genehmigungsweiterleitung aktiviert werden soll |
| `mode` | `"session"` \| `"targets"` \| `"both"` - Genehmigungszielmodus |
| `agentFilter` | Nur Genehmigungsanfragen bestimmter Agents verarbeiten |
| `sessionFilter` | Sitzungsfilter (Substring oder Regex) |
| `targets` | Liste der Zielkanäle (`channel` + `to`) |

#### Anfragen genehmigen

Wenn das exec-Tool eine Genehmigung benötigt, erhalten Sie eine Nachricht mit den folgenden Informationen：

```
Exec approval request (id: abc-123)
Command: ls -la
CWD: /home/user
Agent: main
Resolved: /usr/bin/ls
Host: gateway
Security: allowlist
```

**Genehmigungsoptionen**：

```
/approve abc-123 allow-once     # Einmal zulassen
/approve abc-123 allow-always    # Immer zulassen (zur Allowlist hinzufügen)
/approve abc-123 deny           # Ablehnen
```

**Was Sie sehen sollten**：Nach der Genehmigung wird der Befehl ausgeführt oder abgelehnt.

## Kontrollpunkt ✅

- [ ] Sie verstehen die Unterschiede zwischen den drei Ausführungsmodi (sandbox/gateway/node)
- [ ] Sie haben die globalen exec-Standardparameter konfiguriert
- [ ] Sie können die `/exec`-Befehls-Sitzungsüberschreibung verwenden
- [ ] Sie haben die Allowlist konfiguriert (mindestens ein Muster)
- [ ] Sie verstehen die Sicherheitsmerkmale sicherer bins
- [ ] Sie können exec-Anfragen über Chat-Kanäle genehmigen

## Häufige Fallstricke

### Häufige Fehler

| Fehler | Ursache | Lösung |
|--- | --- | ---|
| `Command not allowed by exec policy` | `security=deny` oder Allowlist stimmt nicht überein | Überprüfen Sie `tools.exec.security` und Allowlist-Konfiguration |
| `Approval timeout` | UI nicht verfügbar, `askFallback=deny` | Stellen Sie `askFallback=allowlist` ein oder aktivieren Sie die UI |
| `Pattern does not resolve to binary` | Verwendung von Basename im Allowlist-Modus | Verwenden Sie den vollständigen Pfad (z.B. `/opt/homebrew/bin/rg`) |
| `Unsupported shell token` | Verwendung von `>` oder `&&` im Allowlist-Modus | Teilen Sie Befehle oder verwenden Sie `security=full` |
| `Node not found` | Knoten im node-Modus nicht gekoppelt | Schließen Sie zuerst die Knotenkopplung ab |

### Shell-Verkettungen und Umleitungen

::: danger Warnung
Im Modus `security=allowlist` werden die folgenden Shell-Funktionen **nicht unterstützt**：
- Pipes：`|` (aber `||` wird unterstützt)
- Umleitungen：`>`, `<`, `>>`
- Befehlssubstitution：`$()`, `` ` ` ``
- Hintergrund：`&`, `;`
:::

**Lösungen**：
- Verwenden Sie `security=full` (mit Vorsicht)
- Teilen Sie in mehrere exec-Aufrufe auf
- Schreiben Sie Wrapper-Skripte und fügen Sie den Skriptpfad zur Allowlist hinzu

### PATH-Umgebungsvariablen

Die verschiedenen Ausführungsmodi verarbeiten PATH unterschiedlich：

| Ausführungsmodus | PATH-Verarbeitung | Beschreibung |
|--- | --- | ---|
| `sandbox` | Erbt shell login, kann von `/etc/profile` zurückgesetzt werden | `pathPrepend` wird nach dem Profil angewendet |
| `gateway` | Merged login shell PATH in die exec-Umgebung | Der Daemon hält minimalen PATH, aber exec erbt Benutzer-PATH |
| `node` | Verwendet nur übergebene Umgebungsvariablenüberschreibungen | macOS-Knoten verwerfen `PATH`-Überschreibungen, headless-Knoten unterstützen prepend |

**Was Sie sehen sollten**：Die korrekte PATH-Konfiguration wirkt sich auf die Befehlssuche aus.

## Zusammenfassung

Das exec-Tool ermöglicht es KI-Assistenten, Shell-Befehle sicher auszuführen, indem es einen dreischichtigen Schutzmechanismus (Tool-Policy, Ausführungs-Host, Genehmigungen) verwendet：

- **Ausführungsmodi**：sandbox (Container-Isolierung), gateway (lokale Ausführung), node (Geräteoperationen)
- **Sicherheitsrichtlinien**：deny (vollständige Sperrung), allowlist (Zulassungsliste), full (vollständige Erlaubnis)
- **Genehmigungsmechanismus**：off (keine Aufforderung), on-miss (Aufforderung bei Nichtübereinstimmung), always (immer auffordern)
- **Allowlist**：glob-Musterabgleich der aufgelösten Binärpfade
- **Sichere bins**：Binärdateien, die nur stdin-Operationen durchführen, sind im Allowlist-Modus von Genehmigungen befreit

## Nächste Lektion

> In der nächsten Lektion lernen wir **[Web-Such- und Abruf-Tools](../tools-web/)**
>
> Sie werden lernen：
> - Wie Sie das `web_search`-Tool für die Websuche verwenden
> - Wie Sie das `web_fetch`-Tool zum Abrufen von Webseiteninhalten verwenden
> - Wie Sie Suchmaschinenanbieter (Brave, Perplexity) konfigurieren
> - Wie Sie Suchergebnisse und Web-Abruffehler behandeln

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie zum Erweitern, um Quellcode-Positionen anzuzeigen</strong></summary>

> Zuletzt aktualisiert：2026-01-27

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
| Prozessausführung | [`src/process/exec.ts`](https://github.com/moltbot/moltbot/blob/main/src/process/exec.ts) | 1-125 |
|--- | --- | ---|

**Wichtige Typen**：
- `ExecHost`: `"sandbox" \| "gateway" \| "node"` - Ausführungs-Host-Typ
- `ExecSecurity`: `"deny" \| "allowlist" \| "full"` - Sicherheitsrichtlinie
- `ExecAsk`: `"off" \| "on-miss" \| "always"` - Genehmigungsrichtlinie
- `ExecAllowlistEntry`: Allowlist-Eintragstyp (enthält `pattern`, `lastUsedAt` usw.)

**Wichtige Konstanten**：
- `DEFAULT_SECURITY = "deny"` - Standard-Sicherheitsrichtlinie
- `DEFAULT_ASK = "on-miss"` - Standard-Genehmigungsrichtlinie
- `DEFAULT_SAFE_BINS = ["jq", "grep", "cut", "sort", "uniq", "head", "tail", "tr", "wc"]` - Standard sichere bins

**Wichtige Funktionen**：
- `resolveExecApprovals()`: Löst die exec-approvals.json-Konfiguration auf
- `evaluateShellAllowlist()`: Bewertet, ob der Shell-Befehl die Allowlist erfüllt
- `matchAllowlist()`: Überprüft, ob der Befehlspfad mit dem Allowlist-Muster übereinstimmt
- `isSafeBinUsage()`: Validiert, ob der Befehl eine sichere bin-Verwendung ist
- `requestExecApprovalViaSocket()`: Fordert Genehmigung über Unix-Socket an

</details>

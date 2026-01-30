---
title: "Claude Code: Installation und Konfiguration | Plannotator"
sidebarTitle: "In 3 Minuten installiert"
subtitle: "Claude Code: Installation und Konfiguration"
description: "Lernen Sie, wie Sie das Plannotator-Plugin in Claude Code installieren. Konfiguration in 3 Minuten, unterstützt Plugin-System und manuelle Hooks, geeignet für macOS, Linux und Windows, einschließlich Remote- und Devcontainer-Umgebungskonfiguration."
tags:
  - "installation"
  - "claude-code"
  - "getting-started"
prerequisite:
  - "start-getting-started"
order: 2
---

# Claude Code-Plugin installieren

## Was Sie nach dieser Lektion können

- Plannotator-Plan-Review-Funktion in Claude Code aktivieren
- Die für Sie geeignete Installationsmethode wählen (Plugin-System oder manueller Hook)
- Überprüfen, ob die Installation erfolgreich war
- Plannotator in Remote-/Devcontainer-Umgebungen korrekt konfigurieren

## Ihr aktuelles Problem

Wenn Sie Claude Code verwenden, können die von AI generierten Pläne nur im Terminal gelesen werden, was eine präzise Überprüfung und Feedback erschwert. Sie möchten:
- AI-Pläne im Browser visualisieren
- Pläne durch Löschen, Ersetzen, Einfügen usw. präzise kommentieren
- Der AI klare Änderungsanweisungen auf einmal geben

## Wann diese Methode verwenden

Geeignet für folgende Szenarien:
- Sie verwenden Claude Code + Plannotator zum ersten Mal
- Sie müssen Plannotator neu installieren oder aktualisieren
- Sie möchten es in Remote-Umgebungen (SSH, Devcontainer, WSL) verwenden

## Kernkonzept

Die Installation von Plannotator besteht aus zwei Teilen:
1. **CLI-Befehl installieren**: Dies ist die Kernlaufzeit, die für das Starten des lokalen Servers und des Browsers verantwortlich ist
2. **Claude Code konfigurieren**: Durch das Plugin-System oder manuelle Hooks wird Claude Code automatisch Plannotator aufrufen, wenn der Plan abgeschlossen ist

Nach der Installation wird Plannotator automatisch ausgelöst, wenn Claude Code `ExitPlanMode` aufruft, und öffnet die Plan-Review-Benutzeroberfläche im Browser.

## 🎒 Vorbereitungen

::: warning Vorabprüfung

- [ ] Claude Code 2.1.7 oder höher installiert ( muss Permission Request Hooks unterstützen)
- [ ] Berechtigung zum Ausführen von Befehlen im Terminal (Linux/macOS benötigen sudo oder Installation im Home-Verzeichnis)

:::

## Folgen Sie mir

### Schritt 1: Plannotator-CLI-Befehl installieren

Installieren Sie zunächst das Befehlszeilentool von Plannotator.

::: code-group

```bash [macOS / Linux / WSL]
curl -fsSL https://plannotator.ai/install.sh | bash
```

```powershell [Windows PowerShell]
irm https://plannotator.ai/install.ps1 | iex
```

```cmd [Windows CMD]
curl -fsSL https://plannotator.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

:::

**Sie sollten sehen**: Der Terminal zeigt den Installationsfortschritt, und nach Abschluss wird `plannotator {Version} installiert in {Installationspfad}/plannotator` angezeigt

**Kontrollpunkt ✅**: Führen Sie den folgenden Befehl aus, um die Installation zu überprüfen:

::: code-group

```bash [macOS / Linux]
which plannotator
```

```powershell [Windows PowerShell]
Get-Command plannotator
```

```cmd [Windows CMD]
where plannotator
```

:::

Sie sollten den Installationspfad des Plannotator-Befehls sehen, z.B. `/usr/local/bin/plannotator` oder `$HOME/.local/bin/plannotator`.

### Schritt 2: Plugin in Claude Code installieren

Öffnen Sie Claude Code und führen Sie die folgenden Befehle aus:

```bash
/plugin marketplace add backnotprop/plannotator
/plugin install plannotator@plannotator
```

**Sie sollten sehen**: Eine Erfolgsmeldung zur Plugin-Installation.

::: danger Wichtig: Claude Code muss neu gestartet werden

Nach der Installation des Plugins **muss Claude Code neu gestartet werden**, sonst funktionieren die Hooks nicht.

:::

### Schritt 3: Installation überprüfen

Starten Sie Claude Code neu und führen Sie den folgenden Befehl aus, um die Code-Review-Funktion zu testen:

```bash
/plannotator-review
```

**Sie sollten sehen**:
- Der Browser öffnet automatisch die Code-Review-Benutzeroberfläche von Plannotator
- Das Terminal zeigt "Code-Review wird geöffnet..." und wartet auf Ihr Feedback

Wenn Sie die oben genannte Ausgabe sehen, herzlichen Glückwunsch, die Installation war erfolgreich!

::: tip Hinweis
Die Plan-Review-Funktion wird automatisch ausgelöst, wenn Claude Code `ExitPlanMode` aufruft. Sie müssen den Testbefehl nicht manuell ausführen. Sie können diese Funktion beim tatsächlichen Verwenden des Planmodus testen.
:::

### Schritt 4: (Optional) Manueller Hook installieren

Wenn Sie das Plugin-System nicht verwenden möchten oder es in einer CI/CD-Umgebung verwenden müssen, können Sie den Hook manuell konfigurieren.

Bearbeiten Sie die Datei `~/.claude/settings.json` (erstellen Sie sie, wenn sie nicht existiert) und fügen Sie Folgendes hinzu:

```json
{
  "hooks": {
    "PermissionRequest": [
      {
        "matcher": "ExitPlanMode",
        "hooks": [
          {
            "type": "command",
            "command": "plannotator",
            "timeout": 1800
          }
        ]
      }
    ]
  }
}
```

**Feldbeschreibung**:
- `matcher: "ExitPlanMode"` - Wird ausgelöst, wenn Claude Code ExitPlanMode aufruft
- `command: "plannotator"` - Führt den installierten Plannotator-CLI-Befehl aus
- `timeout: 1800` - Timeout-Zeit (30 Minuten), gibt Ihnen genügend Zeit, um den Plan zu überprüfen

**Kontrollpunkt ✅**: Speichern Sie die Datei, starten Sie Claude Code neu und führen Sie `/plannotator-review` aus, um zu testen.

### Schritt 5: (Optional) Remote-/Devcontainer-Konfiguration

Wenn Sie Claude Code in Remote-Umgebungen wie SSH, Devcontainer oder WSL verwenden, müssen Sie Umgebungsvariablen festlegen, um einen festen Port zu verwenden und das automatische Öffnen des Browsers zu deaktivieren.

Führen Sie in der Remote-Umgebung aus:

```bash
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_PORT=9999  # Wählen Sie einen Port, auf den Sie über Port-Forwarding zugreifen werden
```

**Diese Variablen werden**:
- Einen festen Port (statt eines zufälligen Ports) verwenden, was das Port-Forwarding erleichtert
- Das automatische Öffnen des Browsers überspringen (da der Browser auf Ihrem lokalen Computer läuft)
- Die URL im Terminal ausgeben, die Sie in Ihren lokalen Browser kopieren und öffnen können

::: tip Port-Forwarding

**VS Code Devcontainer**: Ports werden normalerweise automatisch weitergeleitet, überprüfen Sie den "Ports"-Tab in VS Code.

**SSH-Port-Forwarding**: Bearbeiten Sie `~/.ssh/config` und fügen Sie hinzu:

```bash
Host your-server
    LocalForward 9999 localhost:9999
```

:::

## Häufige Fehler

### Problem 1: Keine Reaktion auf den Befehl `/plannotator-review` nach der Installation

**Ursache**: Claude Code wurde nicht neu gestartet, die Hooks sind nicht aktiv.

**Lösung**: Beenden Sie Claude Code vollständig und öffnen Sie es erneut.

### Problem 2: Installationsskript konnte nicht ausgeführt werden

**Ursache**: Netzwerkprobleme oder unzureichende Berechtigungen.

**Lösung**:
- Überprüfen Sie die Netzwerkverbindung, stellen Sie sicher, dass Sie auf `https://plannotator.ai` zugreifen können
- Wenn Sie auf Berechtigungsprobleme stoßen, versuchen Sie, das Installationsskript manuell herunterzuladen und auszuführen

### Problem 3: Browser kann in Remote-Umgebung nicht geöffnet werden

**Ursache**: Remote-Umgebung hat keine grafische Benutzeroberfläche, der Browser kann nicht gestartet werden.

**Lösung**: Stellen Sie die Umgebungsvariable `PLANNOTATOR_REMOTE=1` ein und konfigurieren Sie das Port-Forwarding.

### Problem 4: Port ist bereits belegt

**Ursache**: Der feste Port `9999` wird bereits von einem anderen Programm verwendet.

**Lösung**: Wählen Sie einen anderen verfügbaren Port, z.B. `8888` oder `19432`.

## Zusammenfassung

- ✅ Plannotator-CLI-Befehl installiert
- ✅ Claude Code über Plugin-System oder manuelle Hooks konfiguriert
- ✅ Überprüft, ob die Installation erfolgreich war
- ✅ (Optional) Remote-/Devcontainer-Umgebung konfiguriert

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[OpenCode-Plugin installieren](../installation-opencode/)**.
>
> Wenn Sie OpenCode anstelle von Claude Code verwenden, zeigt Ihnen die nächste Lektion, wie Sie eine ähnliche Konfiguration in OpenCode vornehmen.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Position anzuzeigen</strong></summary>

> Aktualisierungsdatum: 2026-01-24

| Funktion              | Dateipfad                                                                                                | Zeilennummer    |
|--- | --- | ---|
| Installationsskript-Einstieg      | [`README.md`](https://github.com/backnotprop/plannotator/blob/main/README.md#L35-L60)                     | 35-60   |
| Hook-Konfigurationsbeschreibung     | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L30-L39)   | 30-39   |
| Manueller Hook-Beispiel    | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L42-L62)   | 42-62   |
| Umgebungsvariablenkonfiguration      | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L73-L79)   | 73-79   |
| Remote-Modus-Konfiguration      | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L81-L94)   | 81-94   |

**Wichtige Konstanten**:
- `PLANNOTATOR_REMOTE = "1"`: Aktiviert den Remote-Modus, verwendet einen festen Port
- `PLANNOTATOR_PORT = 9999`: Fester Port für den Remote-Modus (Standard 19432)
- `timeout: 1800`: Hook-Timeout-Zeit (30 Minuten)

**Wichtige Umgebungsvariablen**:
- `PLANNOTATOR_REMOTE`: Remote-Modus-Flag
- `PLANNOTATOR_PORT`: Feste Portnummer
- `PLANNOTATOR_BROWSER`: Benutzerdefinierter Browser-Pfad

</details>

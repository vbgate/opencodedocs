---
title: "Schnellstart: KI-Kreditabfrage | opencode-mystatus"
sidebarTitle: "Schnellstart"
subtitle: "Schnellstart: KI-Kreditabfrage"
description: "Lernen Sie opencode-mystatus in 5 Minuten zu installieren. Abfragen von KI-Krediten für OpenAI, Zhipu AI, Z.ai, GitHub Copilot und Google Cloud."
tags:
  - "Schnellstart"
  - "Installation"
  - "Konfiguration"
order: 1
---

# Schnellstart: Abfrage aller KI-Plattform-Kredite mit einem Klick

## Was Sie nach diesem Tutorial können

- Installieren Sie das opencode-mystatus-Plugin in 5 Minuten
- Konfigurieren Sie den Slash-Befehl `/mystatus`
- Überprüfen Sie die Installation und fragen Sie die Kreditabfrage der ersten KI-Plattform ab

## Ihre aktuelle Situation

Sie verwenden mehrere KI-Plattformen zur Entwicklung (OpenAI, Zhipu AI, GitHub Copilot, Google Cloud usw.) und müssen täglich die verbleibenden Kredite jeder Plattform überprüfen. Jedes Mal müssen Sie sich separat auf jeder Plattform anmelden - das ist zu zeitaufwendig.

## Wann sollten Sie dies verwenden?

- **Wenn Sie OpenCode zum ersten Mal verwenden**: Als Anfänger ist dies das erste Plugin, das Sie installieren sollten
- **Wenn Sie Kredite mehrerer Plattformen verwalten müssen**: Gleichzeitige Verwendung von OpenAI, Zhipu AI, GitHub Copilot und mehreren anderen Plattformen
- **In Teamzusammenarbeitsszenarien**: Teammitglieder teilen sich mehrere KI-Konten und müssen Kredite einheitlich anzeigen

## 🎒 Vorbereitungen vor dem Start

Bevor Sie beginnen, stellen Sie sicher, dass Sie bereits:

::: info Voraussetzungen

- [ ] [OpenCode](https://opencode.ai) installiert haben
- [ ] Mindestens eine KI-Plattform authentifiziert haben (OpenAI, Zhipu AI, Z.ai, GitHub Copilot oder Google Cloud)

:::

Wenn Sie noch keine KI-Plattform konfiguriert haben, empfehlen wir, mindestens eine Plattform in OpenCode zu authentifizieren, bevor Sie dieses Plugin installieren.

## Grundlegende Idee

opencode-mystatus ist ein OpenCode-Plugin mit folgendem Kernwert:

1. **Automatisches Lesen der Authentifizierungsdatei**: Liest alle konfigurierten Kontoinformationen aus dem offiziellen Authentifizierungsspeicher von OpenCode
2. **Parallele Abfrage aller Plattformen**: Ruft gleichzeitig die offiziellen APIs von OpenAI, Zhipu AI, Z.ai, GitHub Copilot und Google Cloud auf
3. **Visuelle Anzeige**: Zeigt die verbleibenden Kredite intuitiv mit Fortschrittsbalken und Countdown-Timer

Der Installationsprozess ist einfach:
1. Fügen Sie das Plugin und den Slash-Befehl zur OpenCode-Konfigurationsdatei hinzu
2. Starten Sie OpenCode neu
3. Geben Sie `/mystatus` ein, um Kredite abzufragen

## Folgen Sie mir

### Schritt 1: Installationsmethode wählen

opencode-mystatus bietet drei Installationsmethoden. Wählen Sie je nach Ihren Vorlieben eine:

::: code-group

```bash [Installation durch KI (empfohlen)]
Fügen Sie den folgenden Inhalt in einen beliebigen KI-Agenten (Claude Code, OpenCode, Cursor usw.) ein:

Install opencode-mystatus plugin by following: https://raw.githubusercontent.com/vbgate/opencode-mystatus/main/README.md
```

```bash [Manuelle Installation]
Öffnen Sie ~/.config/opencode/opencode.json und bearbeiten Sie die Konfiguration wie in Schritt 2 beschrieben
```

```bash [Installation aus lokalen Dateien]
Kopieren Sie die Plugindateien in das Verzeichnis ~/.config/opencode/plugin/ (siehe Schritt 4)
```

:::

**Warum Installation durch KI empfohlen wird**: KI-Agenten führen alle Konfigurationsschritte automatisch aus, Sie müssen nur bestätigen - das ist am schnellsten und unkompliziertesten.

---

### Schritt 2: Manuelle Installationskonfiguration (bei manueller Installation erforderlich)

Wenn Sie die manuelle Installation gewählt haben, müssen Sie die OpenCode-Konfigurationsdatei bearbeiten.

#### 2.1 Konfigurationsdatei öffnen

```bash
# macOS/Linux
code ~/.config/opencode/opencode.json

# Windows
code %APPDATA%\opencode\opencode.json
```

#### 2.2 Plugin und Slash-Befehl hinzufügen

Fügen Sie den folgenden Inhalt zur Konfigurationsdatei hinzu (behalten Sie die bestehenden `plugin`- und `command`-Konfigurationen bei und fügen Sie neue Konfigurationselemente hinzu):

```json
{
  "plugin": ["opencode-mystatus"],
  "command": {
    "mystatus": {
      "description": "Query quota usage for all AI accounts",
      "template": "Use the mystatus tool to query quota usage. Return the result as-is without modification."
    }
  }
}
```

**Warum diese Konfiguration**:

| Konfigurationselement | Wert | Funktion |
| ------------- | --------------------------------------- | ------------------------------------ |
| `plugin` Array | `["opencode-mystatus"]` | Weist OpenCode an, dieses Plugin zu laden |
| `description` | "Query quota usage for all AI accounts" | In der Befehlsliste angezeigte Beschreibung |
| `template` | "Use the mystatus tool..." | Weist OpenCode an, wie der mystatus-Befehl aufgerufen werden soll |

**Was Sie sehen sollten**: Die Konfigurationsdatei enthält vollständige `plugin`- und `command`-Felder mit korrektem Format (achten Sie auf Kommas und Anführungszeichen im JSON).

---

### Schritt 3: Installation aus lokalen Dateien (bei lokaler Installation erforderlich)

Wenn Sie die Installation aus lokalen Dateien gewählt haben, müssen Sie die Plugindateien manuell kopieren.

#### 3.1 Plugindateien kopieren

```bash
# Angenommen, Sie haben den opencode-mystatus-Quellcode nach ~/opencode-mystatus/ geklont

# Kopieren Sie das Hauptplugin und die Bibliotheksdateien
cp -r ~/opencode-mystatus/plugin/mystatus.ts ~/.config/opencode/plugin/
cp -r ~/opencode-mystatus/plugin/lib/ ~/.config/opencode/plugin/

# Kopieren Sie die Slash-Befehlskonfiguration
cp ~/opencode-mystatus/command/mystatus.md ~/.config/opencode/command/
```

**Warum diese Dateien kopiert werden müssen**:

- `mystatus.ts`: Hauptdatei des Plugins, enthält die Definition des mystatus-Tools
- `lib/` Verzeichnis: Enthält die Abfragelogik für OpenAI, Zhipu AI, Z.ai, GitHub Copilot und Google Cloud
- `mystatus.md`: Konfigurationsbeschreibung des Slash-Befehls

**Was Sie sehen sollten**: Das Verzeichnis `~/.config/opencode/plugin/` enthält `mystatus.ts` und das Unterverzeichnis `lib/`, das Verzeichnis `~/.config/opencode/command/` enthält `mystatus.md`.

---

### Schritt 4: OpenCode neu starten

Unabhängig davon, welche Installationsmethode Sie gewählt haben, ist der letzte Schritt das Neustarten von OpenCode.

**Warum ist ein Neustart erforderlich**: OpenCode liest die Konfigurationsdatei nur beim Start. Nach Änderungen an der Konfiguration muss ein Neustart durchgeführt werden, damit die Änderungen wirksam werden.

**Was Sie sehen sollten**: Nach dem Neustart von OpenCode kann es normal verwendet werden.

---

### Schritt 5: Installation überprüfen

Überprüfen Sie nun, ob die Installation erfolgreich war.

#### 5.1 Slash-Befehl testen

Geben Sie in OpenCode Folgendes ein:

```bash
/mystatus
```

**Was Sie sehen sollten**:

Wenn mindestens eine KI-Plattform authentifiziert ist, sehen Sie eine Ausgabe wie diese (Beispiel mit OpenAI):

::: code-group

```markdown [Ausgabe auf Chinesischem System]
## OpenAI 账号额度

Account:        user@example.com (team)

3小时限额
███████████████████████████ 剩余 85%
重置: 2h 30m后
```

```markdown [Ausgabe auf Englischem System]
## OpenAI Account Quota

Account:        user@example.com (team)

3-hour limit
███████████████████████████ 85% remaining
Resets in: 2h 30m
```

:::

::: info Ausgabesprache
Das Plugin erkennt automatisch Ihre Systemsprache (auf Chinesischem System wird Chinesisch angezeigt, auf Englischem System Englisch). Beide Ausgaben sind korrekt.
:::

Wenn noch keine Konten konfiguriert sind, sehen Sie:

::: code-group

```markdown [Ausgabe auf Chinesischem System]
未找到任何已配置的账号。

支持的账号类型:
- OpenAI (Plus/Team/Pro 订阅用户)
- 智谱 AI (Coding Plan)
- Z.ai (Coding Plan)
- Google Cloud (Antigravity)
```

```markdown [Ausgabe auf Englischem System]
No configured accounts found.

Supported account types:
- OpenAI (Plus/Team/Pro subscribers)
- Zhipu AI (Coding Plan)
- Z.ai (Coding Plan)
- Google Cloud (Antigravity)
```

:::

#### 5.2 Bedeutung der Ausgabe verstehen

| Element (Chinesisch) | Element (Englisch) | Bedeutung |
| ------------------------- | ------------------------- | ---------------------- |
| `## OpenAI 账号额度` | `## OpenAI Account Quota` | Plattformtitel |
| `user@example.com (team)` | `user@example.com (team)` | Kontoinformationen (E-Mail oder Team) |
| `3小时限额` | `3-hour limit` | Kreditart (3-Stunden-Limit) |
| `剩余 85%` | `85% remaining` | Verbleibender Prozentsatz |
| `重置: 2h 30m后` | `Resets in: 2h 30m` | Rücksetz-Countdown |

**Warum API-Key nicht vollständig angezeigt wird**: Um Ihre Privatsphäre zu schützen, maskiert das Plugin die Anzeige automatisch (z.B. `9c89****AQVM`).

## Kontrollpunkt ✅

Vergewissern Sie sich, dass Sie die folgenden Schritte abgeschlossen haben:

| Schritt | Überprüfungsmethode | Erwartetes Ergebnis |
| ------------- | --------------------------------------- | --------------------------------------- |
| Plugin installieren | `~/.config/opencode/opencode.json` aufrufen | Das `plugin`-Array enthält `"opencode-mystatus"` |
| Slash-Befehl konfigurieren | Dieselbe Datei aufrufen | Das `command`-Objekt enthält die `mystatus`-Konfiguration |
| OpenCode neu starten | OpenCode-Prozess aufrufen | Wurde neu gestartet |
| Befehl testen | `/mystatus` eingeben | Zeigt Kreditinformationen oder "Keine konfigurierten Konten gefunden" |

## Häufige Fehler

### Häufiger Fehler 1: JSON-Formatfehler

**Symptom**: OpenCode startet nicht erfolgreich, es wird ein JSON-Formatfehler gemeldet

**Ursache**: In der Konfigurationsdatei sind Kommas oder Anführungszeichen zu viele oder zu wenige

**Lösung**:

Verwenden Sie ein Online-JSON-Validierungstool, um das Format zu überprüfen, zum Beispiel:

```json
// ❌ Falsch: Letztes Element hat ein zu viel Komma
{
  "plugin": ["opencode-mystatus"],
  "command": {
    "mystatus": {
      "description": "Query quota usage for all AI accounts",
      "template": "Use the mystatus tool..."
    }
  }  // ← Hier sollte kein Komma stehen
}

// ✅ Richtig
{
  "plugin": ["opencode-mystatus"],
  "command": {
    "mystatus": {
      "description": "Query quota usage for all AI accounts",
      "template": "Use the mystatus tool..."
    }
  }
}
```

---

### Häufiger Fehler 2: Vergessen, OpenCode neu zu starten

**Symptom**: Nach Eingabe von `/mystatus` wird die Meldung "Befehl nicht gefunden" angezeigt

**Ursache**: OpenCode hat die Konfigurationsdatei nicht neu geladen

**Lösung**:

1. OpenCode vollständig beenden (nicht minimieren)
2. OpenCode neu starten
3. Versuchen Sie erneut, `/mystatus` einzugeben

---

### Häufiger Fehler 3: Anzeige "Keine konfigurierten Konten gefunden"

**Symptom**: Nach Ausführung von `/mystatus` wird "Keine konfigurierten Konten gefunden" angezeigt

**Ursache**: Sie haben sich noch nicht bei einer KI-Plattform in OpenCode angemeldet

**Lösung**:

1. Melden Sie sich in OpenCode bei mindestens einer KI-Plattform an (OpenAI, Zhipu AI, Z.ai, GitHub Copilot oder Google Cloud)
2. Die Authentifizierungsinformationen werden automatisch in `~/.local/share/opencode/auth.json` gespeichert
3. Führen Sie erneut `/mystatus` aus

---

### Häufiger Fehler 4: Google Cloud-Kreditabfrage fehlgeschlagen

**Symptom**: Alle anderen Plattformen können normal abgefragt werden, aber Google Cloud zeigt einen Fehler an

**Ursache**: Google Cloud benötigt ein zusätzliches Authentifizierungs-Plugin

**Lösung**:

Installieren Sie zuerst das [opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth)-Plugin, um die Google-Kontoauthentifizierung abzuschließen.

## Zusammenfassung

In diesem Lektion haben Sie die Installation und erste Überprüfung von opencode-mystatus abgeschlossen:

1. **Drei Installationsmethoden**: Installation durch KI (empfohlen), manuelle Installation, Installation aus lokalen Dateien
2. **Speicherort der Konfigurationsdatei**: `~/.config/opencode/opencode.json`
3. **Wichtige Konfigurationselemente**:
   - `plugin`-Array: `"opencode-mystatus"` hinzufügen
   - `command`-Objekt: `mystatus`-Slash-Befehl konfigurieren
4. **Überprüfungsmethode**: Nach Neustart von OpenCode `/mystatus` eingeben
5. **Automatisches Lesen der Authentifizierung**: Das Plugin liest automatisch die konfigurierten Kontoinformationen aus `~/.local/share/opencode/auth.json`

Nach der Installation können Sie den Befehl `/mystatus` oder natürliche Sprache in OpenCode verwenden, um Kredite aller KI-Plattformen abzufragen.

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[mystatus verwenden: Slash-Befehl und natürliche Sprache](/de/vbgate/opencode-mystatus/start/using-mystatus/)**.
>
> Sie werden lernen:
> - Detaillierte Verwendung des Slash-Befehls `/mystatus`
> - Wie man das mystatus-Tool durch Fragen in natürlicher Sprache auslöst
> - Unterschiede und Anwendungsfälle der beiden Auslösemethoden
> - Funktionsweise der Slash-Befehlskonfiguration

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
| ----------------- | -------------------------------------------------------------------------------------------------- | ----- |
| Plugineinstieg | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 26-94 |
| mystatus-Tool-Definition | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 29-33 |
| Authentifizierungsdatei lesen | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 35-46 |
| Parallele Abfrage aller Plattformen | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 49-56 |
| Ergebnissammlung und -zusammenfassung | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 58-89 |
| Slash-Befehlskonfiguration | [`command/mystatus.md`](https://github.com/vbgate/opencode-mystatus/blob/main/command/mystatus.md) | 1-6 |

**Wichtige Konstanten**:
- Pfad der Authentifizierungsdatei: `~/.local/share/opencode/auth.json` (`plugin/mystatus.ts:35`)

**Wichtige Funktionen**:
- `mystatus()`: Hauptfunktion des mystatus-Tools, liest die Authentifizierungsdatei und fragt alle Plattformen parallel ab (`plugin/mystatus.ts:29-33`)
- `collectResult()`: Sammelt Abfrageergebnisse in Arrays results und errors (`plugin/mystatus.ts:100-116`)
- `queryOpenAIUsage()`: Fragt OpenAI-Kredite ab (`plugin/lib/openai.ts`)
- `queryZhipuUsage()`: Fragt Zhipu AI-Kredite ab (`plugin/lib/zhipu.ts`)
- `queryZaiUsage()`: Fragt Z.ai-Kredite ab (`plugin/lib/zhipu.ts`)
- `queryGoogleUsage()`: Fragt Google Cloud-Kredite ab (`plugin/lib/google.ts`)
- `queryCopilotUsage()`: Fragt GitHub Copilot-Kredite ab (`plugin/lib/copilot.ts`)

**Format der Konfigurationsdatei**:
Referenz zur Plugin- und Slash-Befehlskonfiguration in der OpenCode-Konfigurationsdatei `~/.config/opencode/opencode.json` in [`README.zh-CN.md`](https://github.com/vbgate/opencode-mystatus/blob/main/README.zh-CN.md#安装), Zeilen 33-82.

</details>

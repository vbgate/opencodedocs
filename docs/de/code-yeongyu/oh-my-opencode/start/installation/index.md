---
title: "Installation: Schnelle Bereitstellung | oh-my-opencode"
sidebarTitle: "In 5 Minuten starten"
subtitle: "Schnelle Installation und Konfiguration: Provider-Setup und Verifikation"
description: "Lernen Sie die Installation und Konfiguration von oh-my-opencode. Konfigurieren Sie AI-Provider in 5 Minuten, unterstützt werden Claude, OpenAI, Gemini und GitHub Copilot."
tags:
  - "installation"
  - "setup"
  - "provider-konfiguration"
prerequisite: []
order: 10
---

# Schnelle Installation und Konfiguration: Provider-Setup und Verifikation

## Was Sie nach diesem Tutorial können werden

- ✅ Den empfohlenen AI-Agent-Ansatz für die automatische Installation und Konfiguration von oh-my-opencode nutzen
- ✅ Die interaktive CLI-Installation manuell durchführen
- ✅ Mehrere AI-Provider wie Claude, OpenAI, Gemini und GitHub Copilot konfigurieren
- ✅ Die Installation überprüfen und Konfigurationsprobleme diagnostizieren
- ✅ Das Provider-Prioritäts- und Fallback-System verstehen

## Ihre aktuellen Herausforderungen

- Sie haben OpenCode gerade installiert, wissen aber nicht, wie Sie bei der leeren Konfigurationsoberfläche beginnen sollen
- Sie haben mehrere AI-Service-Abonnements (Claude, ChatGPT, Gemini), wissen aber nicht, wie Sie diese einheitlich konfigurieren
- Sie möchten, dass die AI Ihnen bei der Installation hilft, wissen aber nicht, welche genauen Installationsanweisungen Sie der AI geben sollen
- Sie befürchten, dass Konfigurationsfehler dazu führen, dass das Plugin nicht ordnungsgemäß funktioniert

## Wann Sie diese Methode verwenden sollten

- **Bei der ersten Installation von oh-my-opencode**: Dies ist der erste Schritt und muss abgeschlossen werden
- **Nach dem Hinzufügen eines neuen AI-Provider-Abonnements**: Zum Beispiel nach dem Kauf von Claude Max oder ChatGPT Plus
- **Beim Wechsel der Entwicklungsumgebung**: Beim erneuten Konfigurieren der Entwicklungsumgebung auf einer neuen Maschine
- **Bei Provider-Verbindungsproblemen**: Zur Diagnose von Konfigurationsproblemen mithilfe von Diagnosebefehlen

## 🎒 Vorbereitung vor dem Start

::: warning Voraussetzungen
Dieses Tutorial setzt voraus, dass Sie:
1. **OpenCode >= 1.0.150** installiert haben
2. Mindestens ein AI-Provider-Abonnement besitzen (Claude, OpenAI, Gemini, GitHub Copilot, etc.)

Falls OpenCode nicht installiert ist, lesen Sie bitte zuerst die [OpenCode-Dokumentation](https://opencode.ai/docs).
:::

::: tip OpenCode-Version prüfen
```bash
opencode --version
# Sollte 1.0.150 oder höher anzeigen
```
:::

## Kerngedanken

Das Installationsdesign von oh-my-opencode basiert auf zwei Kernkonzepten:

**1. AI-Agent-First (Empfohlen)**

Lassen Sie einen AI-Agenten die Installation und Konfiguration für Sie durchführen, anstatt manuell zu arbeiten. Warum?
- Die AI überspringt keine Schritte (sie hat die vollständige Installationsanleitung)
- Die AI wählt automatisch die beste Konfiguration basierend auf Ihren Abonnements
- Die AI kann Fehler automatisch diagnostizieren und beheben

**2. Interaktiv vs. Nicht-interaktiv**

- **Interaktive Installation**: Führen Sie `bunx oh-my-opencode install` aus und konfigurieren Sie über Frage-Antwort-Dialoge
- **Nicht-interaktive Installation**: Verwenden Sie Befehlszeilenparameter (geeignet für Automatisierung oder AI-Agenten)

**3. Provider-Prioritäten**

oh-my-opencode verwendet einen dreistufigen Modellauflösungsmechanismus:
1. **Benutzer-Override**: Wenn im Konfigurationsfile explizit ein Modell angegeben ist, wird dieses verwendet
2. **Provider-Fallback**: Versuch nach Prioritätskette: `Native (anthropic/openai/google) > GitHub Copilot > OpenCode Zen > Z.ai Coding Plan`
3. **System-Default**: Wenn alle Provider nicht verfügbar sind, wird das OpenCode-Standardmodell verwendet

::: info Was ist ein Provider?
Ein Provider ist ein Anbieter von KI-Modell-Diensten, zum Beispiel:
- **Anthropic**: Bietet Claude-Modelle (Opus, Sonnet, Haiku)
- **OpenAI**: Bietet GPT-Modelle (GPT-5.2, GPT-5-nano)
- **Google**: Bietet Gemini-Modelle (Gemini 3 Pro, Flash)
- **GitHub Copilot**: Bietet mehrere Modelle, gehostet von GitHub, als Fallback

oh-my-opencode kann mehrere Provider gleichzeitig konfigurieren und das optimale Modell automatisch basierend auf Aufgabentyp und Priorität auswählen.
:::

## Mach mit

### Schritt 1: Empfohlene Methode – Lassen Sie einen AI-Agenten installieren (Benutzerfreundlich)

**Warum**
Dies ist die offiziell empfohlene Installationsmethode. Lassen Sie einen AI-Agenten die Konfiguration automatisch durchführen, um menschliche Fehler zu vermeiden.

**Aktion**

Öffnen Sie Ihre AI-Konversationsschnittstelle (Claude Code, AmpCode, Cursor, etc.) und geben Sie folgenden Prompt ein:

```bash
Bitte installieren und konfigurieren Sie oh-my-opencode gemäß folgender Anleitung:
https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/docs/guide/installation.md
```

**Was Sie sehen sollten**
Der AI-Agent wird:
1. Nach Ihren Abonnements fragen (Claude, OpenAI, Gemini, GitHub Copilot, etc.)
2. Installationsbefehle automatisch ausführen
3. Provider-Authentifizierung konfigurieren
4. Installationsergebnisse verifizieren
5. Ihnen mitteilen, dass die Installation abgeschlossen ist

::: tip Test-Phrase des AI-Agenten
Der AI-Agent bestätigt nach Abschluss der Installation mit der Test-Phrase "oMoMoMoMo...".
:::

### Schritt 2: Manuelle Installation – Verwendung des CLI-interaktiven Installers

**Warum**
Wenn Sie den Installationsprozess vollständig kontrollieren möchten oder die AI-Agent-Installation fehlschlägt.

::: code-group

```bash [Verwendung von Bun (empfohlen)]
bunx oh-my-opencode install
```

```bash [Verwendung von npm]
npx oh-my-opencode install
```

:::

> **Hinweis**: Die CLI lädt automatisch das passende Standalone-Binary für Ihre Plattform herunter. Nach der Installation ist keine Bun/Node.js-Laufzeitumgebung mehr erforderlich.
>
> **Unterstützte Plattformen**: macOS (ARM64, x64), Linux (x64, ARM64, Alpine/musl), Windows (x64)

**Was Sie sehen sollten**
Der Installer wird folgende Fragen stellen:

```
oMoMoMoMo... Install

[?] Do you have a Claude Pro/Max Subscription? (Y/n)
[?] Are you on max20 (20x mode)? (Y/n)
[?] Do you have an OpenAI/ChatGPT Plus Subscription? (Y/n)
[?] Will you integrate Gemini models? (Y/n)
[?] Do you have a GitHub Copilot Subscription? (Y/n)
[?] Do you have access to OpenCode Zen (opencode/ models)? (Y/n)
[?] Do you have a Z.ai Coding Plan subscription? (Y/n)

Configuration Summary
────────────────────────────────────────────────

  [OK] Claude (max20)
  [OK] OpenAI/ChatGPT (GPT-5.2 for Oracle)
  [OK] Gemini
  [OK] GitHub Copilot (fallback)
  ○ OpenCode Zen (opencode/ models)
  ○ Z.ai Coding Plan (Librarian/Multimodal)

────────────────────────────────────────────────

Model Assignment

  [i] Models auto-configured based on provider priority
  * Priority: Native > Copilot > OpenCode Zen > Z.ai

✓ Plugin registered in opencode.json
✓ Configuration written to ~/.config/opencode/oh-my-opencode.json
✓ Auth setup hints displayed

[!] Please configure authentication for your providers:

1. Anthropic (Claude): Run 'opencode auth login' → Select Anthropic
2. Google (Gemini): Run 'opencode auth login' → Select Google → Choose OAuth with Google (Antigravity)
3. GitHub (Copilot): Run 'opencode auth login' → Select GitHub

Done! 🎉
```

### Schritt 3: Provider-Authentifizierung konfigurieren

#### 3.1 Claude (Anthropic)-Authentifizierung

**Warum**
Der Sisyphus-Hauptagent empfiehlt dringend die Verwendung des Opus 4.5-Modells, daher ist die Authentifizierung erforderlich.

**Aktion**

```bash
opencode auth login
```

Folgen Sie dann den Anweisungen:
1. **Provider auswählen**: Wählen Sie `Anthropic`
2. **Anmeldemethode auswählen**: Wählen Sie `Claude Pro/Max`
3. **OAuth-Flow abschließen**: Melden Sie sich im Browser an und autorisieren Sie
4. **Warten auf Abschluss**: Das Terminal zeigt die erfolgreiche Authentifizierung an

**Was Sie sehen sollten**
```
✓ Authentication successful
✓ Anthropic provider configured
```

::: warning Claude OAuth-Zugriffsbeschränkungen
> Stand Januar 2026 hat Anthropic den OAuth-Zugriff für Dritte eingeschränkt, unter Berufung auf ToS-Verstöße.
>
> [**Anthropic zitiert dieses Projekt oh-my-opencode als Grund für die Sperrung von OpenCode**](https://x.com/thdxr/status/2010149530486911014)
>
> Es gibt tatsächlich einige Plugins in der Community, die Claude Code OAuth-Anfragen fälschen. Diese Tools sind technisch möglicherweise funktionsfähig, aber Benutzer sollten sich der ToS-Auswirkungen bewusst sein. Ich persönlich empfehle sie nicht.
>
> Dieses Projekt übernimmt keine Verantwortung für Probleme, die durch die Verwendung inoffizieller Tools verursacht werden, und **wir haben keine benutzerdefinierte OAuth-Systemimplementierung**.
:::

#### 3.2 Google Gemini (Antigravity OAuth)-Authentifizierung

**Warum**
Gemini-Modelle werden für Multimodal Looker (Medienanalyse) und einige spezialisierte Aufgaben verwendet.

**Aktion**

**Schritt 1**: Antigravity Auth-Plugin hinzufügen

Bearbeiten Sie `~/.config/opencode/opencode.json` und fügen Sie `opencode-antigravity-auth@latest` zum `plugin`-Array hinzu:

```json
{
  "plugin": [
    "oh-my-opencode",
    "opencode-antigravity-auth@latest"
  ]
}
```

**Schritt 2**: Antigravity-Modell konfigurieren (erforderlich)

Kopieren Sie die vollständige Modellkonfiguration aus der [opencode-antigravity-auth-Dokumentation](https://github.com/NoeFabris/opencode-antigravity-auth) und fügen Sie sie sorgfältig in `~/.config/opencode/oh-my-opencode.json` ein, ohne die bestehende Konfiguration zu beschädigen.

Dieses Plugin verwendet ein **Variant-System** – Modelle wie `antigravity-gemini-3-pro` unterstützen `low`/`high`-Varianten anstelle separater `-low`/`-high`-Modelleinträge.

**Schritt 3**: oh-my-opencode-Agent-Modelle überschreiben

Überschreiben Sie die Agent-Modelle in `oh-my-opencode.json` (oder `.opencode/oh-my-opencode.json`):

```json
{
  "agents": {
    "multimodal-looker": { "model": "google/antigravity-gemini-3-flash" }
  }
}
```

**Verfügbare Modelle (Antigravity-Kontingent)**:
- `google/antigravity-gemini-3-pro` — Varianten: `low`, `high`
- `google/antigravity-gemini-3-flash` — Varianten: `minimal`, `low`, `medium`, `high`
- `google/antigravity-claude-sonnet-4-5` — keine Varianten
- `google/antigravity-claude-sonnet-4-5-thinking` — Varianten: `low`, `max`
- `google/antigravity-claude-opus-4-5-thinking` — Varianten: `low`, `max`

**Verfügbare Modelle (Gemini CLI-Kontingent)**:
- `google/gemini-2.5-flash`, `google/gemini-2.5-pro`
- `google/gemini-3-flash-preview`, `google/gemini-3-pro-preview`

> **Hinweis**: Traditionelle Namen mit Suffixen wie `google/antigravity-gemini-3-pro-high` funktionieren weiterhin, aber Varianten werden empfohlen. Verwenden Sie `--variant=high` mit dem Basis-Modellnamen stattdessen.

**Schritt 4**: Authentifizierung durchführen

```bash
opencode auth login
```

Folgen Sie dann den Anweisungen:
1. **Provider auswählen**: Wählen Sie `Google`
2. **Anmeldemethode auswählen**: Wählen Sie `OAuth with Google (Antigravity)`
3. **Browser-Anmeldung abschließen**: (Automatische Erkennung) Anmeldung abschließen
4. **Optional**: Weitere Google-Konten hinzufügen, um Load-Balancing zu ermöglichen
5. **Erfolg verifizieren**: Bestätigung durch den Benutzer

**Was Sie sehen sollten**
```
✓ Authentication successful
✓ Google provider configured (Antigravity)
✓ Multiple accounts available for load balancing
```

::: tip Multi-Account Load-Balancing
Das Plugin unterstützt bis zu 10 Google-Konten. Wenn ein Konto das Raten-Limit erreicht, wird automatisch zum nächsten verfügbaren Konto gewechselt.
:::

#### 3.3 GitHub Copilot (Fallback-Provider)-Authentifizierung

**Warum**
GitHub Copilot dient als **Fallback-Provider**, wenn Native-Provider nicht verfügbar sind.

**Priorität**: `Native (anthropic/, openai/, google/) > GitHub Copilot > OpenCode Zen > Z.ai Coding Plan`

**Aktion**

```bash
opencode auth login
```

Folgen Sie dann den Anweisungen:
1. **Provider auswählen**: Wählen Sie `GitHub`
2. **Authentifizierungsmethode auswählen**: Wählen Sie `Authenticate via OAuth`
3. **Browser-Anmeldung abschließen**: GitHub OAuth-Flow

**Was Sie sehen sollten**
```
✓ Authentication successful
✓ GitHub Copilot configured as fallback
```

::: info GitHub Copilot Model Mapping
Wenn GitHub Copilot der beste verfügbare Provider ist, verwendet oh-my-opencode folgende Model-Zuweisungen:

| Agent          | Modell                           |
|---|---|
| **Sisyphus**   | `github-copilot/claude-opus-4.5`  |
| **Oracle**     | `github-copilot/gpt-5.2`          |
| **Explore**    | `opencode/gpt-5-nano`             |
| **Librarian**  | `zai-coding-plan/glm-4.7` (wenn Z.ai verfügbar) oder fallback |

GitHub Copilot fungiert als Proxy-Provider, der Anfragen basierend auf Ihrem Abonnement an zugrunde liegende Modelle weiterleitet.
:::

### Schritt 4: Nicht-interaktive Installation (für AI-Agenten geeignet)

**Warum**
AI-Agenten müssen den nicht-interaktiven Modus verwenden, um alle Konfigurationen über Befehlszeilenparameter auf einmal abzuschließen.

**Aktion**

```bash
bunx oh-my-opencode install --no-tui \
  --claude=<yes|no|max20> \
  --openai=<yes|no> \
  --gemini=<yes|no> \
  --copilot=<yes|no> \
  [--opencode-zen=<yes|no>] \
  [--zai-coding-plan=<yes|no>]
```

**Parameterbeschreibung**:

| Parameter           | Wert           | Beschreibung                           |
|---|---|---|
| `--no-tui`          | -              | Deaktiviert die interaktive Oberfläche (andere Parameter müssen angegeben werden) |
| `--claude`          | `yes/no/max20` | Claude-Abonnementstatus                          |
| `--openai`          | `yes/no`       | OpenAI/ChatGPT-Abonnement (GPT-5.2 für Oracle) |
| `--gemini`          | `yes/no`       | Gemini-Integration                              |
| `--copilot`         | `yes/no`       | GitHub Copilot-Abonnement                        |
| `--opencode-zen`    | `yes/no`       | OpenCode Zen-Zugriff (Standard: no)                |
| `--zai-coding-plan` | `yes/no`       | Z.ai Coding Plan-Abonnement (Standard: no)      |

**Beispiele**:

```bash
# Benutzer hat alle Native-Abonnements
bunx oh-my-opencode install --no-tui \
  --claude=max20 \
  --openai=yes \
  --gemini=yes \
  --copilot=no

# Benutzer hat nur Claude
bunx oh-my-opencode install --no-tui \
  --claude=yes \
  --openai=no \
  --gemini=no \
  --copilot=no

# Benutzer hat nur GitHub Copilot
bunx oh-my-opencode install --no-tui \
  --claude=no \
  --openai=no \
  --gemini=no \
  --copilot=yes

# Benutzer hat kein Abonnement
bunx oh-my-opencode install --no-tui \
  --claude=no \
  --openai=no \
  --gemini=no \
  --copilot=no
```

**Was Sie sehen sollten**
Die gleiche Ausgabe wie bei der nicht-interaktiven Installation, aber ohne manuelle Beantwortung von Fragen.

## Kontrollpunkt ✅

### Verifizieren, ob die Installation erfolgreich war

**Prüfung 1**: OpenCode-Version bestätigen

```bash
opencode --version
```

**Erwartetes Ergebnis**: Zeigt `1.0.150` oder höher an.

::: warning OpenCode-Versionsanforderungen
Wenn Sie Version 1.0.132 oder älter verwenden, kann ein Bug in OpenCode die Konfiguration beschädigen.
>
> Dieser Fix wurde nach 1.0.132 zusammengeführt – verwenden Sie eine neuere Version.
> Interessante Tatsache: Dieser PR wurde aufgrund der Librarian-, Explore- und Oracle-Setups von OhMyOpenCode entdeckt und behoben.
:::

**Prüfung 2**: Bestätigen, dass das Plugin registriert ist

```bash
cat ~/.config/opencode/opencode.json
```

**Erwartetes Ergebnis**: Sie sehen `"oh-my-opencode"` im `plugin`-Array.

```json
{
  "plugin": [
    "oh-my-opencode",
    "opencode-antigravity-auth@latest"
  ]
}
```

**Prüfung 3**: Bestätigen, dass die Konfigurationsdatei erstellt wurde

```bash
cat ~/.config/opencode/oh-my-opencode.json
```

**Erwartetes Ergebnis**: Zeigt die vollständige Konfigurationsstruktur an, einschließlich Felder wie `agents`, `categories`, `disabled_agents`, etc.

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  "agents": {
    "sisyphus": {
      "model": "anthropic/claude-opus-4-5"
    },
    "oracle": {
      "model": "openai/gpt-5.2"
    },
    ...
  },
  "categories": {
    "quick": {
      "model": "anthropic/claude-haiku-4-5",
      "temperature": 0.1
    },
    ...
  },
  "disabled_agents": [],
  "disabled_skills": [],
  "disabled_hooks": [],
  "disabled_mcps": []
}
```

### Diagnosebefehl ausführen

```bash
oh-my-opencode doctor --verbose
```

**Was Sie sehen sollten**:
- Modellauflösungsprüfung
- Agent-Konfigurationsvalidierung
- MCP-Verbindungsstatus
- Provider-Authentifizierungsstatus

```bash
✓ OpenCode version: 1.0.150 (required: >=1.0.150)
✓ Plugin registered: oh-my-opencode
✓ Config file found: ~/.config/opencode/oh-my-opencode.json
✓ Anthropic provider: authenticated
✓ OpenAI provider: authenticated
✓ Google provider: authenticated (Antigravity)
✓ GitHub Copilot: authenticated (fallback)
✓ MCP servers: 3 connected (websearch, context7, grep_app)
✓ Agents: 10 enabled
✓ Hooks: 32 enabled
```

::: danger Wenn die Diagnose fehlschlägt
Wenn die Diagnose Fehler anzeigt, beheben Sie diese bitte zuerst:
1. **Provider-Authentifizierung fehlgeschlagen**: Führen Sie `opencode auth login` erneut aus
2. **Konfigurationsdatei-Fehler**: Überprüfen Sie die Syntax von `oh-my-opencode.json` (JSONC unterstützt Kommentare und Trailing-Kommas)
3. **Versionsinkompatibilität**: Aktualisieren Sie OpenCode auf die neueste Version
4. **Plugin nicht registriert**: Führen Sie `bunx oh-my-opencode install` erneut aus
:::

## Häufige Fehler und Lösungen

### ❌ Fehler 1: Provider-Authentifizierung vergessen

**Problem**: Nach der Installation direkt verwendet, aber die AI-Modelle funktionieren nicht.

**Ursache**: Das Plugin ist installiert, aber der Provider wurde nicht über OpenCode authentifiziert.

**Lösung**:
```bash
opencode auth login
# Wählen Sie den entsprechenden Provider und schließen Sie die Authentifizierung ab
```

### ❌ Fehler 2: OpenCode-Version zu alt

**Problem**: Konfigurationsdatei wird beschädigt oder lässt sich nicht laden.

**Ursache**: OpenCode 1.0.132 oder früher hat einen Bug, der die Konfiguration beschädigen kann.

**Lösung**:
```bash
# OpenCode aktualisieren
npm install -g @opencode/cli@latest

# Oder verwenden Sie Ihren Paketmanager (Bun, Homebrew, etc.)
bun install -g @opencode/cli@latest
```

### ❌ Fehler 3: CLI-Befehlsparameter-Fehler

**Problem**: Beim Ausführen der nicht-interaktiven Installation werden Parameterfehler angezeigt.

**Ursache**: `--claude` ist ein erforderlicher Parameter und muss `yes`, `no` oder `max20` sein.

**Lösung**:
```bash
# ❌ Falsch: --claude-Parameter fehlt
bunx oh-my-opencode install --no-tui --gemini=yes

# ✅ Richtig: Alle erforderlichen Parameter angeben
bunx oh-my-opencode install --no-tui --claude=yes --gemini=yes
```

### ❌ Fehler 4: Antigravity-Kontingent erschöpft

**Problem**: Gemini-Modelle funktionieren plötzlich nicht mehr.

**Ursache**: Das Antigravity-Kontingent ist begrenzt, und ein einzelnes Konto kann das Raten-Limit erreichen.

**Lösung**: Fügen Sie mehrere Google-Konten hinzu, um Load-Balancing zu ermöglichen
```bash
opencode auth login
# Wählen Sie Google
# Fügen Sie weitere Konten hinzu
```

Das Plugin wechselt automatisch zwischen den Konten, um zu verhindern, dass ein einzelnes Konto erschöpft wird.

### ❌ Fehler 5: Falsche Konfigurationsdatei-Position

**Problem**: Konfigurationsänderungen werden nicht wirksam.

**Ursache**: Die falsche Konfigurationsdatei wurde bearbeitet (Projektkonfiguration vs. Benutzerkonfiguration).

**Lösung**: Bestätigen Sie die Konfigurationsdatei-Position

| Konfigurationstyp | Dateipfad | Priorität |
|---|---|---|
| **Benutzerkonfiguration** | `~/.config/opencode/oh-my-opencode.json` | Hoch |
| **Projektkonfiguration** | `.opencode/oh-my-opencode.json` | Niedrig |

::: tip Konfigurationszusammenführungsregeln
Wenn sowohl Benutzerkonfiguration als auch Projektkonfiguration existieren, **überschreibt die Benutzerkonfiguration die Projektkonfiguration**.
:::

## Zusammenfassung dieser Lektion

- **Empfohlene AI-Agent-Installation**: Lassen Sie die AI die Konfiguration automatisch durchführen, um menschliche Fehler zu vermeiden
- **CLI unterstützt interaktiven und nicht-interaktiven Modus**: Interaktiv für Menschen, nicht-interaktiv für AI
- **Provider-Prioritäten**: Native > Copilot > OpenCode Zen > Z.ai
- **Authentifizierung ist erforderlich**: Nach der Installation muss die Provider-Authentifizierung konfiguriert werden, um zu funktionieren
- **Diagnosebefehl ist wichtig**: `oh-my-opencode doctor --verbose` kann Probleme schnell erkennen
- **JSONC-Format wird unterstützt**: Konfigurationsdateien unterstützen Kommentare und Trailing-Kommas

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Sisyphus kennen: Der Haupt-Orchestrator](../sisyphus-orchestrator/)**.
>
> Sie werden lernen:
> - Kernfunktionen und Designphilosophie des Sisyphus-Agenten
> - Wie Sie Aufgaben mit Sisyphus planen und delegieren
> - Wie parallele Hintergrundaufgaben funktionieren
> - Die Funktionsweise des Todo-Completion-Enforcers

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Position anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-26

| Funktion              | Dateipfad                                                                                               | Zeilennummer    |
|---|---|---|
| CLI-Installationseintrag      | [`src/cli/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/index.ts)         | 22-60   |
| Interaktiver Installer      | [`src/cli/install.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/install.ts)         | 1-400+  |
| Konfigurationsmanager        | [`src/cli/config-manager.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/config-manager.ts) | 1-200+  |
| Konfiguration Schema       | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/config/schema.ts)       | 1-400+  |
| Diagnosebefehl          | [`src/cli/doctor.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/doctor.ts)          | 1-200+  |

**Wichtige Konstanten**:
- `VERSION = packageJson.version`: Aktuelle CLI-Versionsnummer
- `SYMBOLS`: UI-Symbole (check, cross, arrow, bullet, info, warn, star)

**Wichtige Funktionen**:
- `install(args: InstallArgs)`: Hauptinstallationsfunktion, verarbeitet interaktive und nicht-interaktive Installation
- `validateNonTuiArgs(args: InstallArgs)`: Validiert Parameter für den nicht-interaktiven Modus
- `argsToConfig(args: InstallArgs)`: Konvertiert CLI-Parameter in Konfigurationsobjekt
- `addPluginToOpenCodeConfig()`: Registriert das Plugin in opencode.json
- `writeOmoConfig(config)`: Schreibt die oh-my-opencode.json-Konfigurationsdatei
- `isOpenCodeInstalled()`: Prüft, ob OpenCode installiert ist
- `getOpenCodeVersion()`: Ruft die OpenCode-Versionsnummer ab

**Konfiguration Schema Felder**:
- `AgentOverrideConfigSchema`: Agent-Override-Konfiguration (model, variant, skills, temperature, prompt, etc.)
- `CategoryConfigSchema`: Category-Konfiguration (description, model, temperature, thinking, etc.)
- `ClaudeCodeConfigSchema`: Claude Code Kompatibilitätskonfiguration (mcp, commands, skills, agents, hooks, plugins)
- `BuiltinAgentNameSchema`: Eingebaute Agent-Enumeration (sisyphus, prometheus, oracle, librarian, explore, multimodal-looker, metis, momus, atlas)
- `PermissionValue`: Berechtigungswert-Enumeration (ask, allow, deny)

**Unterstützte Plattformen** (aus README):
- macOS (ARM64, x64)
- Linux (x64, ARM64, Alpine/musl)
- Windows (x64)

**Provider-Prioritätskette** (aus docs/guide/installation.md):
1. Native (anthropic/, openai/, google/)
2. GitHub Copilot
3. OpenCode Zen
4. Z.ai Coding Plan

</details>
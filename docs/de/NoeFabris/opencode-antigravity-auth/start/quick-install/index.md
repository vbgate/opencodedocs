---
title: "Schnellinstallation: Plugin-Konfiguration in 5 Minuten | Antigravity Auth"
sidebarTitle: "In 5 Minuten startklar"
subtitle: "Antigravity Auth Schnellinstallation: Plugin-Konfiguration in 5 Minuten"
description: "Lernen Sie die Schnellinstallation des Antigravity Auth Plugins. Zwei Installationsmethoden (KI-gestützt/manuell), Modellkonfiguration, Google OAuth-Authentifizierung und Verifizierung."
tags:
  - "Schnellstart"
  - "Installationsanleitung"
  - "OAuth"
  - "Plugin-Konfiguration"
prerequisite:
  - "start-what-is-antigravity-auth"
order: 2
---

# Antigravity Auth Schnellinstallation: Plugin-Konfiguration in 5 Minuten

Mit der Antigravity Auth Schnellinstallation konfigurieren Sie das OpenCode-Plugin in nur 5 Minuten und können sofort Claude und Gemini 3 Premium-Modelle nutzen. Dieses Tutorial bietet zwei Installationsmethoden (KI-gestützt/manuelle Konfiguration) und behandelt Plugin-Installation, OAuth-Authentifizierung, Modelldefinition und Verifizierungsschritte für einen schnellen Einstieg.

## Was Sie lernen werden

- ✅ Antigravity Auth Plugin in 5 Minuten installieren
- ✅ Zugriff auf Claude und Gemini 3 Modelle konfigurieren
- ✅ Google OAuth-Authentifizierung durchführen und Installation verifizieren

## Ihre aktuelle Herausforderung

Sie möchten die leistungsstarken Funktionen von Antigravity Auth ausprobieren (Claude Opus 4.5, Sonnet 4.5, Gemini 3 Pro/Flash), wissen aber nicht, wie Sie das Plugin installieren und die Modelle konfigurieren – und befürchten, bei einem falschen Schritt steckenzubleiben.

## Wann Sie diese Anleitung brauchen

- Bei der ersten Verwendung des Antigravity Auth Plugins
- Bei der Installation von OpenCode auf einem neuen Rechner
- Wenn Sie das Plugin neu konfigurieren müssen

## 🎒 Voraussetzungen

::: warning Checkliste vor dem Start

Bevor Sie beginnen, stellen Sie sicher:
- [ ] OpenCode CLI ist installiert (`opencode`-Befehl verfügbar)
- [ ] Sie haben ein Google-Konto (für OAuth-Authentifizierung)
- [ ] Sie kennen die Grundkonzepte von Antigravity Auth (lesen Sie [Was ist Antigravity Auth?](/de/NoeFabris/opencode-antigravity-auth/start/what-is-antigravity-auth/))

:::

## Kernkonzept

Die Installation von Antigravity Auth erfolgt in 4 Schritten:

1. **Plugin installieren** → Plugin in der OpenCode-Konfiguration aktivieren
2. **OAuth-Authentifizierung** → Mit Google-Konto anmelden
3. **Modelle konfigurieren** → Claude/Gemini Modelldefinitionen hinzufügen
4. **Installation verifizieren** → Erste Testanfrage senden

**Wichtiger Hinweis**: Der Konfigurationsdateipfad ist auf allen Systemen `~/.config/opencode/opencode.json` (unter Windows wird `~` automatisch zum Benutzerverzeichnis aufgelöst, z.B. `C:\Users\IhrName`).

## Schritt-für-Schritt-Anleitung

### Schritt 1: Installationsmethode wählen

Antigravity Auth bietet zwei Installationsmethoden – wählen Sie eine davon.

::: tip Empfehlung

Wenn Sie einen LLM-Agenten verwenden (wie Claude Code, Cursor, OpenCode), **empfehlen wir die KI-gestützte Installation** – schneller und unkomplizierter.

:::

**Methode 1: KI-gestützte Installation (Empfohlen)**

Kopieren Sie einfach den folgenden Prompt und fügen Sie ihn in einen beliebigen LLM-Agenten ein:

```
Install opencode-antigravity-auth plugin and add Antigravity model definitions to ~/.config/opencode/opencode.json by following: https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/dev/README.md
```

**Die KI erledigt automatisch**:
- Bearbeitung von `~/.config/opencode/opencode.json`
- Hinzufügen der Plugin-Konfiguration
- Hinzufügen der vollständigen Modelldefinitionen
- Ausführung von `opencode auth login` zur Authentifizierung

**Erwartete Ausgabe**: Die KI meldet „Plugin erfolgreich installiert" oder eine ähnliche Bestätigung.

**Methode 2: Manuelle Installation**

Wenn Sie die manuelle Kontrolle bevorzugen, folgen Sie diesen Schritten:

**Schritt 1.1: Plugin zur Konfigurationsdatei hinzufügen**

Bearbeiten Sie `~/.config/opencode/opencode.json` (erstellen Sie die Datei, falls sie nicht existiert):

```json
{
  "plugin": ["opencode-antigravity-auth@latest"]
}
```

> **Beta-Version**: Für die neuesten Funktionen verwenden Sie `opencode-antigravity-auth@beta` statt `@latest`.

**Erwartete Ausgabe**: Die Konfigurationsdatei enthält das `plugin`-Feld mit einem Array als Wert.

---

### Schritt 2: Google OAuth-Authentifizierung durchführen

Führen Sie im Terminal aus:

```bash
opencode auth login
```

**Das System führt automatisch aus**:
1. Startet einen lokalen OAuth-Server (lauscht auf `localhost:51121`)
2. Öffnet den Browser zur Google-Autorisierungsseite
3. Empfängt den OAuth-Callback und tauscht Token aus
4. Ermittelt automatisch die Google Cloud Projekt-ID

**Ihre Aufgaben**:
1. Klicken Sie im Browser auf „Zulassen", um den Zugriff zu autorisieren
2. In WSL- oder Docker-Umgebungen müssen Sie möglicherweise die Callback-URL manuell kopieren

**Erwartete Ausgabe**:

```
✅ Authentication successful
✅ Account added: ihre-email@gmail.com
✅ Project ID resolved: cloud-project-id-xxx
```

::: tip Multi-Account-Unterstützung

Möchten Sie weitere Konten hinzufügen, um Ihr Kontingent zu erhöhen? Führen Sie einfach `opencode auth login` erneut aus. Das Plugin unterstützt bis zu 10 Konten mit automatischem Load-Balancing.

:::

---

### Schritt 3: Modelldefinitionen konfigurieren

Kopieren Sie die folgende vollständige Konfiguration und fügen Sie sie zu `~/.config/opencode/opencode.json` hinzu (achten Sie darauf, das bestehende `plugin`-Feld nicht zu überschreiben):

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-antigravity-auth@latest"],
  "provider": {
    "google": {
      "models": {
        "antigravity-gemini-3-pro": {
          "name": "Gemini 3 Pro (Antigravity)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingLevel": "low" },
            "high": { "thinkingLevel": "high" }
          }
        },
        "antigravity-gemini-3-flash": {
          "name": "Gemini 3 Flash (Antigravity)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "minimal": { "thinkingLevel": "minimal" },
            "low": { "thinkingLevel": "low" },
            "medium": { "thinkingLevel": "medium" },
            "high": { "thinkingLevel": "high" }
          }
        },
        "antigravity-claude-sonnet-4-5": {
          "name": "Claude Sonnet 4.5 (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "antigravity-claude-sonnet-4-5-thinking": {
          "name": "Claude Sonnet 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "antigravity-claude-opus-4-5-thinking": {
          "name": "Claude Opus 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "gemini-2.5-flash": {
          "name": "Gemini 2.5 Flash (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-2.5-pro": {
          "name": "Gemini 2.5 Pro (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-flash-preview": {
          "name": "Gemini 3 Flash Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-pro-preview": {
          "name": "Gemini 3 Pro Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        }
      }
    }
  }
}
```

::: info Modellkategorien

- **Antigravity-Kontingent** (Claude + Gemini 3): `antigravity-gemini-*`, `antigravity-claude-*`
- **Gemini CLI-Kontingent** (separat): `gemini-2.5-*`, `gemini-3-*-preview`

Weitere Details zur Modellkonfiguration finden Sie in der [Vollständigen Liste verfügbarer Modelle](/de/NoeFabris/opencode-antigravity-auth/platforms/available-models/).

:::

**Erwartete Ausgabe**: Die Konfigurationsdatei enthält die vollständige `provider.google.models`-Definition und das JSON-Format ist gültig (keine Syntaxfehler).

---

### Schritt 4: Installation verifizieren

Führen Sie den folgenden Befehl aus, um zu testen, ob das Plugin korrekt funktioniert:

```bash
opencode run "Hello" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=max
```

**Erwartete Ausgabe**:

```
Verwende: google/antigravity-claude-sonnet-4-5-thinking (max)
...

Claude: Hallo! Ich bin Claude Sonnet 4.5 Thinking.
```

::: tip Checkpoint ✅

Wenn Sie eine normale KI-Antwort sehen, herzlichen Glückwunsch! Das Antigravity Auth Plugin wurde erfolgreich installiert und konfiguriert.

:::

---

## Fehlerbehebung

### Problem 1: OAuth-Authentifizierung fehlgeschlagen

**Symptome**: Nach Ausführung von `opencode auth login` erscheint eine Fehlermeldung wie `invalid_grant` oder die Autorisierungsseite öffnet sich nicht.

**Ursachen**: Google-Kontopasswort geändert, Sicherheitsereignis oder unvollständige Callback-URL.

**Lösungen**:
1. Prüfen Sie, ob der Browser die Google-Autorisierungsseite korrekt öffnet
2. In WSL/Docker-Umgebungen kopieren Sie die im Terminal angezeigte Callback-URL manuell in den Browser
3. Löschen Sie `~/.config/opencode/antigravity-accounts.json` und authentifizieren Sie sich erneut

### Problem 2: Modell nicht gefunden (400-Fehler)

**Symptome**: Bei einer Anfrage wird `400 Unknown name 'xxx'` zurückgegeben.

**Ursachen**: Tippfehler im Modellnamen oder Formatproblem in der Konfigurationsdatei.

**Lösungen**:
1. Prüfen Sie, ob der `--model`-Parameter exakt mit dem Key in der Konfigurationsdatei übereinstimmt (Groß-/Kleinschreibung beachten)
2. Validieren Sie, ob `opencode.json` gültiges JSON ist (prüfen Sie mit `cat ~/.config/opencode/opencode.json | jq`)
3. Stellen Sie sicher, dass unter `provider.google.models` die entsprechende Modelldefinition vorhanden ist

### Problem 3: Falscher Konfigurationsdateipfad

**Symptome**: Meldung „Konfigurationsdatei existiert nicht" oder Änderungen werden nicht übernommen.

**Ursachen**: Falscher Pfad auf verschiedenen Systemen verwendet.

**Lösungen**: Verwenden Sie auf allen Systemen einheitlich `~/.config/opencode/opencode.json`, einschließlich Windows (`~` wird automatisch zum Benutzerverzeichnis aufgelöst).

| System | Korrekter Pfad | Falscher Pfad |
| --- | --- | --- |
| macOS/Linux | `~/.config/opencode/opencode.json` | `/usr/local/etc/...` |
| Windows | `C:\Users\IhrName\.config\opencode\opencode.json` | `%APPDATA%\opencode\...` |

## Zusammenfassung

In dieser Lektion haben wir behandelt:
1. ✅ Zwei Installationsmethoden (KI-gestützt / manuelle Konfiguration)
2. ✅ Google OAuth-Authentifizierungsprozess
3. ✅ Vollständige Modellkonfiguration (Claude + Gemini 3)
4. ✅ Installationsverifizierung und Fehlerbehebung

**Wichtige Punkte**:
- Einheitlicher Konfigurationsdateipfad: `~/.config/opencode/opencode.json`
- OAuth-Authentifizierung ermittelt automatisch die Projekt-ID, keine manuelle Konfiguration erforderlich
- Multi-Account-Unterstützung für höhere Kontingentgrenzen
- Verwenden Sie den `variant`-Parameter zur Steuerung der Denktiefe bei Thinking-Modellen

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen Sie **[Erste Authentifizierung: OAuth 2.0 PKCE-Flow im Detail](/de/NoeFabris/opencode-antigravity-auth/start/first-auth-login/)**.
>
> Sie werden lernen:
> - Funktionsweise von OAuth 2.0 PKCE
> - Token-Aktualisierungsmechanismus
> - Automatische Auflösung der Projekt-ID
> - Speicherformat für Konten

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-23

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| OAuth-Autorisierungs-URL-Generierung | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L91-L113) | 91-113 |
| PKCE-Schlüsselpaar-Generierung | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L1-L2) | 1-2 |
| Token-Austausch | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L201-L270) | 201-270 |
| Automatische Projekt-ID-Ermittlung | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L131-L196) | 131-196 |
| Benutzerinformationen abrufen | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L231-L242) | 231-242 |

**Wichtige Konstanten**:
- `ANTIGRAVITY_CLIENT_ID`: OAuth-Client-ID (für Google-Authentifizierung)
- `ANTIGRAVITY_REDIRECT_URI`: OAuth-Callback-Adresse (fest auf `http://localhost:51121/oauth-callback`)
- `ANTIGRAVITY_SCOPES`: Liste der OAuth-Berechtigungsbereiche

**Wichtige Funktionen**:
- `authorizeAntigravity()`: Erstellt die OAuth-Autorisierungs-URL mit PKCE-Challenge
- `exchangeAntigravity()`: Tauscht Autorisierungscode gegen Access-Token und Refresh-Token
- `fetchProjectID()`: Ermittelt automatisch die Google Cloud Projekt-ID
- `encodeState()` / `decodeState()`: Kodiert/dekodiert den OAuth-State-Parameter (enthält PKCE-Verifier)

</details>

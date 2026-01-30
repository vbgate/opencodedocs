---
title: "Provider-Einrichtung: Multi-Modell-Strategie | oh-my-opencode"
sidebarTitle: "Mehrere KI-Dienste verbinden"
subtitle: "Provider-Einrichtung: Multi-Modell-Strategie"
description: "Lernen Sie, wie Sie verschiedene KI-Provider für oh-my-opencode konfigurieren, einschließlich Anthropic, OpenAI, Google und GitHub Copilot, sowie wie die automatische Modell-Degradierung funktioniert."
tags:
  - "configuration"
  - "providers"
  - "models"
prerequisite:
  - "start-installation"
order: 40
---

# Provider-Einrichtung: Claude, OpenAI, Gemini und Multi-Modell-Strategie

## Was Sie nach diesem Tutorial können werden

- Konfigurieren Sie mehrere KI-Provider wie Anthropic Claude, OpenAI, Google Gemini und GitHub Copilot
- Verstehen Sie den Multi-Modell-Prioritäts-Degradierungsmechanismus, der das System automatisch das beste verfügbare Modell auswählen lässt
- Weisen Sie die am besten geeigneten Modelle für verschiedene KI-Agenten und Aufgabentypen zu
- Konfigurieren Sie Drittanbieter-Dienste wie Z.ai Coding Plan und OpenCode Zen
- Verwenden Sie den Doctor-Befehl zur Diagnose der Modellauflösungskonfiguration

## Ihre aktuelle Herausforderung

Sie haben oh-my-opencode installiert, aber sind sich nicht sicher:
- Wie Sie mehrere KI-Provider hinzufügen (Claude, OpenAI, Gemini usw.)
- Warum ein Agent manchmal nicht das erwartete Modell verwendet
- Wie Sie verschiedene Modelle für verschiedene Aufgaben konfigurieren (z. B. günstige für Recherche, leistungsstarke für Programmierung)
- Wie das System automatisch auf ein Backup-Modell umschaltet, wenn ein Provider nicht verfügbar ist
- Wie die Modellkonfiguration in `opencode.json` und `oh-my-opencode.json` zusammenarbeitet

## Wann diese Technik verwenden

- **Erstkonfiguration**: Gerade oh-my-opencode installiert und müssen KI-Provider hinzufügen oder anpassen
- **Neues Abonnement hinzufügen**: Ein neues KI-Service-Abonnement gekauft (z. B. Gemini Pro) und möchten es integrieren
- **Kosten optimieren**: Möchten, dass bestimmte Agenten günstigere oder schnellere Modelle verwenden
- **Fehlerbehebung**: Festgestellt, dass ein Agent nicht das erwartete Modell verwendet, und müssen das Problem diagnostizieren
- **Multi-Modell-Orchestrierung**: Möchten die Vorteile verschiedener Modelle nutzen, um intelligente Entwicklungsworkflows zu erstellen

## 🎒 Vorbereitung vor dem Start

::: warning Voraussetzungsprüfung
Dieses Tutorial setzt voraus, dass Sie:
- ✅ Die [Installation und Erstkonfiguration](../installation/) abgeschlossen haben
- ✅ OpenCode installiert haben (Version >= 1.0.150)
- ✅ Grundlegende JSON/JSONC-Konfigurationsdateiformate verstehen
:::

## Kernkonzept

oh-my-opencode verwendet ein **Multi-Modell-Orchestrierungssystem**, das basierend auf Ihren Abonnements und Konfigurationen die am besten geeigneten Modelle für verschiedene KI-Agenten und Aufgabentypen auswählt.

**Warum mehrere Modelle benötigt werden?**

Verschiedene Modelle haben unterschiedliche Stärken:
- **Claude Opus 4.5**: Stark in komplexem Reasoning und Architekturdesign (hohe Kosten, aber hohe Qualität)
- **GPT-5.2**: Stark in Code-Debugging und strategischer Beratung
- **Gemini 3 Pro**: Stark in Frontend- und UI/UX-Aufgaben (starke visuelle Fähigkeiten)
- **GPT-5 Nano**: Schnell und kostenlos, geeignet für Code-Suche und einfache Erkundung
- **GLM-4.7**: Hohe Kosten-Nutzen-Verhältnis, geeignet für Recherche und Dokumentensuche

Die Intelligenz von oh-my-opencode liegt darin: **Jede Aufgabe verwendet das am besten geeignete Modell, anstatt alle Aufgaben mit demselben Modell auszuführen**.

## Konfigurationsdateispeicherort

oh-my-opencode unterstützt zwei Konfigurationsebenen:

| Speicherort | Pfad | Priorität | Anwendungsszenario |
|---|---|---|---|
| **Projektkonfiguration** | `.opencode/oh-my-opencode.json` | Niedrig | Projektspezifische Konfiguration (mit Codebasis committet) |
| **Benutzerkonfiguration** | `~/.config/opencode/oh-my-opencode.json` | Hoch | Globale Konfiguration (von allen Projekten gemeinsam genutzt) |

**Konfigurationszusammenführungsregel**: Benutzerkonfiguration überschreibt Projektkonfiguration.

**Empfohlene Konfigurationsdateistruktur**:

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  // JSON Schema-Autovervollständigung aktivieren

  "agents": {
    // Agent-Modell-Overrides
  },
  "categories": {
    // Kategorie-Modell-Overrides
  }
}
```

::: tip Schema-Autovervollständigung
In Editoren wie VS Code erhalten Sie nach dem Hinzufügen des `$schema`-Felds vollständige Autovervollständigung und Typprüfung während der Eingabe.
:::

## Provider-Konfigurationsmethoden

oh-my-opencode unterstützt 6 Haupt-Provider. Die Konfigurationsmethoden variieren je nach Provider.

### Anthropic Claude (Empfohlen)

**Anwendungsszenario**: Hauptorchestrator Sisyphus und die meisten Kern-Agenten

**Konfigurationsschritte**:

1. **OpenCode-Authentifizierung ausführen**:
   ```bash
   opencode auth login
   ```

2. **Provider auswählen**:
   - `Provider`: Wählen Sie `Anthropic`
   - `Login method`: Wählen Sie `Claude Pro/Max`

3. **OAuth-Flow abschließen**:
   - Das System öffnet automatisch den Browser
   - Melden Sie sich bei Ihrem Claude-Konto an
   - Warten Sie auf die Fertigstellung der Authentifizierung

4. **Erfolg verifizieren**:
   ```bash
   opencode models | grep anthropic
   ```

   Sie sollten sehen:
   - `anthropic/claude-opus-4-5`
   - `anthropic/claude-sonnet-4-5`
   - `anthropic/claude-haiku-4-5`

**Modellzuordnung** (Sisyphus-Standardkonfiguration):

| Agent | Standardmodell | Verwendung |
|---|---|---|
| Sisyphus | `anthropic/claude-opus-4-5` | Hauptorchestrator, komplexes Reasoning |
| Prometheus | `anthropic/claude-opus-4-5` | Projektplanung |
| Metis | `anthropic/claude-sonnet-4-5` | Vorplanungsanalyse |
| Momus | `anthropic/claude-opus-4-5` | Planungsüberprüfung |

### OpenAI (ChatGPT Plus)

**Anwendungsszenario**: Oracle-Agent (Architekturüberprüfung, Debugging)

**Konfigurationsschritte**:

1. **OpenCode-Authentifizierung ausführen**:
   ```bash
   opencode auth login
   ```

2. **Provider auswählen**:
   - `Provider`: Wählen Sie `OpenAI`
   - `Login method`: Wählen Sie OAuth oder API Key

3. **Authentifizierungsflow abschließen** (je nach gewählter Methode)

4. **Erfolg verifizieren**:
   ```bash
   opencode models | grep openai
   ```

**Modellzuordnung** (Oracle-Standardkonfiguration):

| Agent | Standardmodell | Verwendung |
|---|---|---|
| Oracle | `openai/gpt-5.2` | Architekturüberprüfung, Debugging |

**Manuelles Überschreibungsbeispiel**:

```jsonc
{
  "agents": {
    "oracle": {
      "model": "openai/gpt-5.2",  // Verwendet GPT für strategisches Reasoning
      "temperature": 0.1
    }
  }
}
```

### Google Gemini (Empfohlen)

**Anwendungsszenario**: Multimodal Looker (Medienanalyse), Frontend UI/UX-Aufgaben

::: tip Sehr empfohlen
Für die Gemini-Authentifizierung wird dringend empfohlen, das Plugin [`opencode-antigravity-auth`](https://github.com/NoeFabris/opencode-antigravity-auth) zu installieren. Es bietet:
- Multi-Account-Lastenausgleich (bis zu 10 Konten)
- Variant-System-Unterstützung (`low`/`high`-Varianten)
- Duales Kontingentsystem (Antigravity + Gemini CLI)
:::

**Konfigurationsschritte**:

1. **Antigravity-Authentifizierungs-Plugin hinzufügen**:
   
   Bearbeiten Sie `~/.config/opencode/opencode.json`:
   ```json
   {
     "plugin": [
       "oh-my-opencode",
       "opencode-antigravity-auth@latest"
     ]
   }
   ```

2. **Gemini-Modelle konfigurieren** (wichtig):
   
   Das Antigravity-Plugin verwendet unterschiedliche Modellnamen. Sie müssen die vollständige Modellkonfiguration nach `opencode.json` kopieren, wobei Sie sorgfältig zusammenführen müssen, um bestehende Einstellungen nicht zu beschädigen.

   Verfügbare Modelle (Antigravity-Kontingent):
   - `google/antigravity-gemini-3-pro` — Varianten: `low`, `high`
   - `google/antigravity-gemini-3-flash` — Varianten: `minimal`, `low`, `medium`, `high`
   - `google/antigravity-claude-sonnet-4-5` — keine Varianten
   - `google/antigravity-claude-sonnet-4-5-thinking` — Varianten: `low`, `max`
   - `google/antigravity-claude-opus-4-5-thinking` — Varianten: `low`, `max`

   Verfügbare Modelle (Gemini CLI-Kontingent):
   - `google/gemini-2.5-flash`, `google/gemini-2.5-pro`, `google/gemini-3-flash-preview`, `google/gemini-3-pro-preview`

3. **Agent-Modell überschreiben** (in `oh-my-opencode.json`):
   
   ```jsonc
   {
     "agents": {
       "multimodal-looker": {
         "model": "google/antigravity-gemini-3-flash"
       }
     }
   }
   ```

4. **Authentifizierung ausführen**:
   ```bash
   opencode auth login
   ```

5. **Provider auswählen**:
   - `Provider`: Wählen Sie `Google`
   - `Login method`: Wählen Sie `OAuth with Google (Antigravity)`

6. **Authentifizierungsflow abschließen**:
   - Das System öffnet automatisch den Browser
   - Melden Sie sich bei Google an
   - Optional: Fügen Sie weitere Google-Konten für Lastenausgleich hinzu

**Modellzuordnung** (Standardkonfiguration):

| Agent | Standardmodell | Verwendung |
|---|---|---|
| Multimodal Looker | `google/antigravity-gemini-3-flash` | PDF-, Bildanalyse |

### GitHub Copilot (Backup-Provider)

**Anwendungsszenario**: Alternative Option, wenn native Provider nicht verfügbar sind

::: info Backup-Provider
GitHub Copilot fungiert als Proxy-Provider, der Anfragen an das/die von Ihnen abonnierte(n) zugrunde liegende(n) Modell(e) weiterleitet.
:::

**Konfigurationsschritte**:

1. **OpenCode-Authentifizierung ausführen**:
   ```bash
   opencode auth login
   ```

2. **Provider auswählen**:
   - `Provider`: Wählen Sie `GitHub`
   - `Login method`: Wählen Sie `Authenticate via OAuth`

3. **GitHub OAuth-Flow abschließen**

4. **Erfolg verifizieren**:
   ```bash
   opencode models | grep github-copilot
   ```

**Modellzuordnung** (wenn GitHub Copilot der bestverfügbare Provider ist):

| Agent | Modell | Verwendung |
|---|---|---|
| Sisyphus | `github-copilot/claude-opus-4.5` | Hauptorchestrator |
| Oracle | `github-copilot/gpt-5.2` | Architekturüberprüfung |
| Explore | `opencode/gpt-5-nano` | Schnelle Erkundung |
| Librarian | `zai-coding-plan/glm-4.7` (wenn Z.ai verfügbar) | Dokumentensuche |

### Z.ai Coding Plan (Optional)

**Anwendungsszenario**: Librarian-Agent (Multi-Repository-Recherche, Dokumentensuche)

**Merkmale**:
- Bietet GLM-4.7-Modell
- Hohe Kosten-Nutzen-Verhältnis
- Wenn aktiviert, **verwendet der Librarian-Agent immer** `zai-coding-plan/glm-4.7`, unabhängig von anderen verfügbaren Providern

**Konfigurationsschritte**:

Verwenden Sie den interaktiven Installer:

```bash
bunx oh-my-opencode install
# Wenn gefragt: "Do you have a Z.ai Coding Plan subscription?" → Wählen Sie "Yes"
```

**Modellzuordnung** (wenn Z.ai der einzige verfügbare Provider ist):

| Agent | Modell | Verwendung |
|---|---|---|
| Sisyphus | `zai-coding-plan/glm-4.7` | Hauptorchestrator |
| Oracle | `zai-coding-plan/glm-4.7` | Architekturüberprüfung |
| Explore | `zai-coding-plan/glm-4.7-flash` | Schnelle Erkundung |
| Librarian | `zai-coding-plan/glm-4.7` | Dokumentensuche |

### OpenCode Zen (Optional)

**Anwendungsszenario**: Bietet `opencode/`-präfix-Modelle (Claude Opus 4.5, GPT-5.2, GPT-5 Nano, Big Pickle)

**Konfigurationsschritte**:

```bash
bunx oh-my-opencode install
# Wenn gefragt: "Do you have access to OpenCode Zen (opencode/ models)?" → Wählen Sie "Yes"
```

**Modellzuordnung** (wenn OpenCode Zen der bestverfügbare Provider ist):

| Agent | Modell | Verwendung |
|---|---|---|
| Sisyphus | `opencode/claude-opus-4-5` | Hauptorchestrator |
| Oracle | `opencode/gpt-5.2` | Architekturüberprüfung |
| Explore | `opencode/gpt-5-nano` | Schnelle Erkundung |
| Librarian | `opencode/big-pickle` | Dokumentensuche |

## Modellauflösungssystem (3-Schritt-Priorität)

oh-my-opencode verwendet ein **3-Schritt-Prioritätsmechanismus**, um das für jeden Agenten und jede Kategorie verwendete Modell zu bestimmen. Dieser Mechanismus stellt sicher, dass das System immer ein verfügbares Modell findet.

### Schritt 1: Benutzerüberschreibung

Wenn der Benutzer ein Modell explizit in `oh-my-opencode.json` angibt, wird dieses Modell verwendet.

**Beispiel**:
```jsonc
{
  "agents": {
    "oracle": {
      "model": "openai/gpt-5.2"  // Benutzer explizit angegeben
    }
  }
}
```

In diesem Fall:
- ✅ Verwendet direkt `openai/gpt-5.2`
- ❌ Überspringt den Provider-Degradierungsschritt

### Schritt 2: Provider-Degradierung

Wenn der Benutzer kein Modell explizit angibt, versucht das System nacheinander die in der Prioritätskette des Agenten definierten Provider, bis ein verfügbares Modell gefunden wird.

**Sisyphus' Provider-Prioritätskette**:

```
anthropic → github-copilot → opencode → antigravity → google
```

**Auflösungsprozess**:
1. Versucht `anthropic/claude-opus-4-5`
   - Verfügbar? → Gibt dieses Modell zurück
   - Nicht verfügbar? → Fährt mit nächstem Schritt fort
2. Versucht `github-copilot/claude-opus-4-5`
   - Verfügbar? → Gibt dieses Modell zurück
   - Nicht verfügbar? → Fährt mit nächstem Schritt fort
3. Versucht `opencode/claude-opus-4-5`
   - ...
4. Versucht `google/antigravity-claude-opus-4-5-thinking` (wenn konfiguriert)
   - ...
5. Gibt das Systemstandardmodell zurück

**Provider-Prioritätsketten aller Agenten**:

| Agent | Modell (ohne Präfix) | Provider-Prioritätskette |
|---|---|---|
| **Sisyphus** | `claude-opus-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **Oracle** | `gpt-5.2` | openai → anthropic → google → github-copilot → opencode |
| **Librarian** | `big-pickle` | opencode → github-copilot → anthropic |
| **Explore** | `gpt-5-nano` | anthropic → opencode |
| **Multimodal Looker** | `gemini-3-flash` | google → openai → zai-coding-plan → anthropic → opencode |
| **Prometheus** | `claude-opus-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **Metis** | `claude-sonnet-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **Momus** | `claude-opus-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **Atlas** | `claude-sonnet-4-5` | anthropic → github-copilot → opencode → antigravity → google |

**Provider-Prioritätsketten von Kategorien**:

| Kategorie | Modell (ohne Präfix) | Provider-Prioritätskette |
|---|---|---|
| **ultrabrain** | `gpt-5.2-codex` | openai → anthropic → google → github-copilot → opencode |
| **artistry** | `gemini-3-pro` | google → openai → anthropic → github-copilot → opencode |
| **quick** | `claude-haiku-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **writing** | `gemini-3-flash` | google → openai → anthropic → github-copilot → opencode |

### Schritt 3: Systemstandard

Wenn alle Provider nicht verfügbar sind, wird das OpenCode-Standardmodell verwendet (aus `opencode.json` gelesen).

**Globale Prioritätsreihenfolge**:

```
Benutzerüberschreibung > Provider-Degradierung > Systemstandard
```

## Schritt-für-Schritt: Konfiguration mehrerer Provider

### Schritt 1: Planen Sie Ihre Abonnements

Bevor Sie mit der Konfiguration beginnen, organisieren Sie Ihre Abonnements:

```markdown
- [ ] Anthropic Claude (Pro/Max)
- [ ] OpenAI ChatGPT Plus
- [ ] Google Gemini
- [ ] GitHub Copilot
- [ ] Z.ai Coding Plan
- [ ] OpenCode Zen
```

### Schritt 2: Verwenden Sie den interaktiven Installer (empfohlen)

oh-my-opencode bietet einen interaktiven Installer, der die meisten Konfigurationen automatisch durchführt:

```bash
bunx oh-my-opencode install
```

Der Installer fragt nach:
1. **Do you have a Claude Pro/Max Subscription?**
   - `yes, max20` → `--claude=max20`
   - `yes, regular` → `--claude=yes`
   - `no` → `--claude=no`

2. **Do you have an OpenAI/ChatGPT Plus Subscription?**
   - `yes` → `--openai=yes`
   - `no` → `--openai=no`

3. **Will you integrate Gemini models?**
   - `yes` → `--gemini=yes`
   - `no` → `--gemini=no`

4. **Do you have a GitHub Copilot Subscription?**
   - `yes` → `--copilot=yes`
   - `no` → `--copilot=no`

5. **Do you have access to OpenCode Zen (opencode/ models)?**
   - `yes` → `--opencode-zen=yes`
   - `no` → `--opencode-zen=no`

6. **Do you have a Z.ai Coding Plan subscription?**
   - `yes` → `--zai-coding-plan=yes`
   - `no` → `--zai-coding-plan=no`

**Nicht-interaktiver Modus** (geeignet für Skriptinstallation):

```bash
bunx oh-my-opencode install --no-tui \
  --claude=max20 \
  --openai=yes \
  --gemini=yes \
  --copilot=no
```

### Schritt 3: Authentifizieren Sie jeden Provider

Nach Abschluss des Installers authentifizieren Sie nacheinander:

```bash
# Anthropic authentifizieren
opencode auth login
# Provider: Anthropic
# Login method: Claude Pro/Max
# OAuth-Flow abschließen

# OpenAI authentifizieren
opencode auth login
# Provider: OpenAI
# OAuth-Flow abschließen

# Google Gemini authentifizieren (Antigravity-Plugin zuerst installieren)
opencode auth login
# Provider: Google
# Login method: OAuth with Google (Antigravity)
# OAuth-Flow abschließen

# GitHub Copilot authentifizieren
opencode auth login
# Provider: GitHub
# Login method: Authenticate via OAuth
# GitHub OAuth abschließen
```

### Schritt 4: Konfiguration verifizieren

```bash
# OpenCode-Version prüfen
opencode --version
# Sollte >= 1.0.150 sein

# Alle verfügbaren Modelle anzeigen
opencode models

# Diagnose ausführen
bunx oh-my-opencode doctor --verbose
```

**Sie sollten sehen** (Doctor-Ausgabebeispiel):

```
✅ OpenCode version: 1.0.150
✅ Plugin loaded: oh-my-opencode

📊 Model Resolution:
┌─────────────────────────────────────────────────────┐
│ Agent           │ Requirement            │ Resolved         │
├─────────────────────────────────────────────────────┤
│ Sisyphus        │ anthropic/claude-opus-4-5  │ anthropic/claude-opus-4-5 │
│ Oracle           │ openai/gpt-5.2              │ openai/gpt-5.2              │
│ Librarian        │ opencode/big-pickle           │ opencode/big-pickle           │
│ Explore          │ anthropic/gpt-5-nano          │ anthropic/gpt-5-nano          │
│ Multimodal Looker│ google/gemini-3-flash          │ google/gemini-3-flash          │
└─────────────────────────────────────────────────────┘

✅ All models resolved successfully
```

### Schritt 5: Agent-Modelle anpassen (optional)

Wenn Sie für einen bestimmten Agenten ein anderes Modell angeben möchten:

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "agents": {
    // Oracle verwendet GPT für Architekturüberprüfung
    "oracle": {
      "model": "openai/gpt-5.2",
      "temperature": 0.1
    },

    // Librarian verwendet günstigeres Modell für Recherche
    "librarian": {
      "model": "opencode/gpt-5-nano",
      "temperature": 0.1
    },

    // Multimodal Looker verwendet Antigravity Gemini
    "multimodal-looker": {
      "model": "google/antigravity-gemini-3-flash",
      "variant": "high"
    }
  }
}
```

### Schritt 6: Kategorie-Modelle anpassen (optional)

Geben Sie Modelle für verschiedene Aufgabentypen an:

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "categories": {
    // Schnelle Aufgaben verwenden günstiges Modell
    "quick": {
      "model": "opencode/gpt-5-nano",
      "temperature": 0.1
    },

    // Frontend-Aufgaben verwenden Gemini
    "visual-engineering": {
      "model": "google/gemini-3-pro",
      "temperature": 0.7,
      "prompt_append": "Use shadcn/ui components and Tailwind CSS."
    },

    // Hochintelligente Reasoning-Aufgaben verwenden GPT Codex
    "ultrabrain": {
      "model": "openai/gpt-5.2-codex",
      "temperature": 0.1
    }
  }
}
```

**Kategorie verwenden**:

```markdown
// Verwendung von delegate_task im Dialog
delegate_task(category="visual", prompt="Create a responsive dashboard component")
delegate_task(category="quick", skills=["git-master"], prompt="Commit these changes")
```

## Prüfpunkte ✅

- [ ] `opencode --version` zeigt Version >= 1.0.150 an
- [ ] `opencode models` listet Modelle aller konfigurierten Provider auf
- [ ] `bunx oh-my-opencode doctor --verbose` zeigt, dass alle Agentenmodelle korrekt aufgelöst sind
- [ ] In `opencode.json` ist `"oh-my-opencode"` im `plugin`-Array zu sehen
- [ ] Versuchen Sie, einen Agenten (z. B. Sisyphus) zu verwenden, um zu bestätigen, dass das Modell funktioniert

## Warnhinweise

### ❌ Falle 1: Provider-Authentifizierung vergessen

**Symptom**: Provider konfiguriert, aber Modellauflösung schlägt fehl.

**Ursache**: Der Installer hat die Modelle konfiguriert, aber die Authentifizierung wurde nicht abgeschlossen.

**Lösung**:
```bash
opencode auth login
# Wählen Sie den entsprechenden Provider und schließen Sie die Authentifizierung ab
```

### ❌ Falle 2: Falsche Antigravity-Modellnamen

**Symptom**: Gemini konfiguriert, aber der Agent verwendet es nicht.

**Ursache**: Das Antigravity-Plugin verwendet unterschiedliche Modellnamen (`google/antigravity-gemini-3-pro` statt `google/gemini-3-pro`).

**Lösung**:
```jsonc
{
  "agents": {
    "multimodal-looker": {
      "model": "google/antigravity-gemini-3-flash"  // Korrekt
      // model: "google/gemini-3-flash"  // ❌ Falsch
    }
  }
}
```

### ❌ Falle 3: Falsche Konfigurationsdateispeicherort

**Symptom**: Konfiguration geändert, aber das System hat sie nicht übernommen.

**Ursache**: Falscher Konfigurationsdateispeicherort (Benutzerkonfiguration vs. Projektkonfiguration).

**Lösung**:
```bash
# Benutzerkonfiguration (global, hohe Priorität)
~/.config/opencode/oh-my-opencode.json

# Projektkonfiguration (lokal, niedrige Priorität)
.opencode/oh-my-opencode.json

# Überprüfen, welche Datei verwendet wird
bunx oh-my-opencode doctor --verbose
```

### ❌ Falle 4: Provider-Prioritätskette unterbrochen

**Symptom**: Ein Agent verwendet immer das falsche Modell.

**Ursache**: Die Benutzerüberschreibung (Schritt 1) überspringt die Provider-Degradierung (Schritt 2) vollständig.

**Lösung**: Wenn Sie die automatische Degradierung nutzen möchten, kodieren Sie das Modell nicht hart in `oh-my-opencode.json`, sondern lassen Sie das System basierend auf der Prioritätskette automatisch auswählen.

**Beispiel**:
```jsonc
{
  "agents": {
    "oracle": {
      // ❌ Hartkodiert: Verwendet immer GPT, auch wenn Anthropic verfügbar ist
      "model": "openai/gpt-5.2"
    }
  }
}
```

Um die Degradierung zu nutzen, entfernen Sie das `model`-Feld und lassen Sie das System automatisch auswählen:
```jsonc
{
  "agents": {
    "oracle": {
      // ✅ Automatisch: anthropic → google → github-copilot → opencode
      "temperature": 0.1
    }
  }
}
```

### ❌ Falle 5: Z.ai belegt immer den Librarian

**Symptom**: Auch wenn andere Provider konfiguriert sind, verwendet Librarian immer noch GLM-4.7.

**Ursache**: Wenn Z.ai aktiviert ist, ist der Librarian hartkodiert, um `zai-coding-plan/glm-4.7` zu verwenden.

**Lösung**: Wenn Sie dieses Verhalten nicht benötigen, deaktivieren Sie Z.ai:
```bash
bunx oh-my-opencode install --no-tui --zai-coding-plan=no
```

Oder manuelles Überschreiben:
```jsonc
{
  "agents": {
    "librarian": {
      "model": "opencode/big-pickle"  // Überschreibt die Z.ai-Hartkodierung
    }
  }
}
```

## Lektionszusammenfassung

- oh-my-opencode unterstützt 6 Haupt-Provider: Anthropic, OpenAI, Google, GitHub Copilot, Z.ai, OpenCode Zen
- Verwenden Sie den interaktiven Installer `bunx oh-my-opencode install`, um mehrere Provider schnell zu konfigurieren
- Das Modellauflösungssystem wählt dynamisch Modelle durch 3 Schritte Priorität (Benutzerüberschreibung → Provider-Degradierung → Systemstandard)
- Jeder Agent und jede Kategorie hat seine eigene Provider-Prioritätskette, um sicherzustellen, dass immer ein verfügbares Modell gefunden wird
- Verwenden Sie den Befehl `doctor --verbose`, um die Modellauflösungskonfiguration zu diagnostizieren
- Beim Anpassen von Agent- und Kategorie-Modellen müssen Sie vorsichtig sein, den automatischen Degradierungsmechanismus nicht zu unterbrechen

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Multi-Modell-Strategie: Automatische Degradierung und Prioritäten](../model-resolution/)**.
>
> Sie werden lernen:
> - Den vollständigen Arbeitsablauf des Modellauflösungssystems
> - Wie man optimale Modellkombinationen für verschiedene Aufgaben entwirft
> - Strategien zur Parallelitätskontrolle in Hintergrundaufgaben
> - Wie man Modellauflösungsprobleme diagnostiziert

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie, um die Quellcode-Position anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-26

| Funktion | Dateipfad | Zeilennummer |
|---|---|---|
| Konfiguration Schema-Definition | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 1-378 |
| Installationsanleitung (Provider-Konfiguration) | [`docs/guide/installation.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/guide/installation.md) | 1-299 |
| Konfigurationsreferenz (Modellauflösung) | [`docs/configurations.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/configurations.md) | 391-512 |
| Agent-Override-Konfiguration Schema | [`src/config/schema.ts:AgentOverrideConfigSchema`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts#L98-L119) | 98-119 |
| Kategorie-Konfiguration Schema | [`src/config/schema.ts:CategoryConfigSchema`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts#L154-L172) | 154-172 |
| Provider-Prioritätskette-Dokumentation | [`docs/configurations.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/configurations.md#L445-L473) | 445-473 |

**Wichtige Konstanten**:
- Keine: Provider-Prioritätskette ist in der Konfigurationsdokumentation hartkodiert, nicht als Code-Konstante

**Wichtige Funktionen**:
- Keine: Die Modellauflösungslogik wird vom OpenCode-Kern verarbeitet, oh-my-opencode bietet Konfiguration und Prioritätsdefinition

</details>

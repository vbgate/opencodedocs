---
title: "Tiefenkonfiguration: Agenten und Berechtigungen | oh-my-opencode"
sidebarTitle: "Agentenverhalten steuern"
subtitle: "Tiefenkonfiguration: Agenten und Berechtigungen | oh-my-opencode"
description: "Erfahren Sie mehr über die Agentenkonfiguration, Berechtigungseinstellungen, Modellüberschreibung und Prompt-Modifikation in oh-my-opencode. Erstellen Sie durch tiefe Anpassung Ihr optimiertes AI-Entwicklungsteam und steuern Sie das Verhalten und die Fähigkeiten jedes Agenten präzise."
tags:
  - "configuration"
  - "agents"
  - "permissions"
  - "customization"
prerequisite:
  - "start-installation"
  - "platforms-provider-setup"
order: 140
---

# Konfigurationstiefe anpassen: Agenten- und Berechtigungsverwaltung

## Was Sie nach diesem Lernprogramm können

- Anpassen des Modells und der Parameter, die jeder Agent verwendet
- Präzise Kontrolle der Agentenberechtigungen (Dateibearbeitung, Bash-Ausführung, Web-Anfragen usw.)
- Hinzufügen zusätzlicher Anweisungen für Agenten über `prompt_append`
- Erstellen benutzerdefinierter Kategorien für dynamische Agentenkombinationen
- Aktivieren/Deaktivieren spezifischer Agenten, Skills, Hooks und MCPs

## Ihr aktuelles Problem

**Die Standardkonfiguration funktioniert gut, entspricht aber nicht Ihren Anforderungen:**
- Oracle verwendet GPT 5.2, was zu teuer ist; Sie möchten ein günstigeres Modell
- Der Explore-Agent sollte keine Dateischreibberechtigungen haben, nur Suche
- Librarian soll bevorzugt offizielle Dokumentationen statt GitHub durchsuchen
- Ein Hook meldet ständig falsche Ergebnisse und Sie möchten ihn vorübergehend deaktivieren

**Sie benötigen eine"Tiefenkonfiguration"** – nicht einfach"funktioniert", sondern"passt perfekt".

---

## 🎒 Vorbereitungen vor dem Start

::: warning Voraussetzungen
Dieses Lernprogramm setzt voraus, dass Sie die [Installation und Konfiguration](../../start/installation/) und die [Provider-Einrichtung](../../platforms/provider-setup/) abgeschlossen haben.
:::

**Was Sie wissen müssen:**
- Konfigurationsdateiposition: `~/.config/opencode/oh-my-opencode.json` (Benutzerebene) oder `.opencode/oh-my-opencode.json` (Projektebene)
- Konfigurationen auf Benutzerebene haben Vorrang vor Konfigurationen auf Projektebene

---

## Kernkonzept

**Priorität der Konfiguration:** Benutzerkonfiguration > Projektkonfiguration > Standardkonfiguration

```
~/.config/opencode/oh-my-opencode.json (höchste Priorität)
    ↓ überschreibt
.opencode/oh-my-opencode.json (Projektebene)
    ↓ überschreibt
oh-my-opencode integrierte Standardwerte (niedrigste Priorität)
```

**Konfigurationsdateien unterstützen JSONC:**
- Sie können `//` verwenden, um Kommentare hinzuzufügen
- Sie können `/* */` verwenden, um Blockkommentare hinzuzufügen
- Nachgestellte Kommas sind erlaubt

---

## Lernen Sie durch praktische Anwendung

### Schritt 1: Konfigurationsdatei finden und Schema-Autovervollständigung aktivieren

**Warum**
Nach der Aktivierung des JSON-Schemas schlägt der Editor automatisch alle verfügbaren Felder und Typen vor, um Konfigurationsfehler zu vermeiden.

**Vorgehensweise:**

```jsonc
{
  // Fügen Sie diese Zeile hinzu, um die Autovervollständigung zu aktivieren
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  
  // Ihre Konfiguration...
}
```

**Was Sie sehen sollten:**
- In Editoren wie VS Code / JetBrains werden nach Eingabe von `{` automatisch alle verfügbaren Felder vorgeschlagen
- Wenn Sie mit der Maus über ein Feld fahren, wird die Beschreibung und der Typ angezeigt

---

### Schritt 2: Agentenmodell anpassen

**Warum**
Verschiedene Aufgaben benötigen verschiedene Modelle:
- **Architekturdesign:** Verwenden Sie das stärkste Modell (Claude Opus 4.5)
- **Schnelle Erkundung:** Verwenden Sie das schnellste Modell (Grok Code)
- **UI-Design:** Verwenden Sie ein visuelles Modell (Gemini 3 Pro)
- **Kostenkontrolle:** Verwenden Sie für einfache Aufgaben günstigere Modelle

**Vorgehensweise:**

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "agents": {
    // Oracle: Strategieberater, verwendet GPT 5.2
    "oracle": {
      "model": "openai/gpt-5.2",
      "temperature": 0.1  // Niedrige Temperatur, mehr Determinismus
    },

    // Explore: Schnelle Erkundung, kostenloses Modell
    "explore": {
      "model": "opencode/gpt-5-nano",  // Kostenlos
      "temperature": 0.3
    },

    // Librarian: Dokumentationssuche, Modell mit großem Kontext
    "librarian": {
      "model": "anthropic/claude-sonnet-4-5"
    },

    // Multimodaler Looker: Medienanalyse, verwendet Gemini
    "multimodal-looker": {
      "model": "google/gemini-3-flash"
    }
  }
}
```

**Was Sie sehen sollten:**
- Jeder Agent verwendet ein anderes Modell, das auf seine Aufgabenmerkmale optimiert ist
- Nach dem Speichern der Konfiguration wird der entsprechende Agent beim nächsten Aufruf das neue Modell verwenden

---

### Schritt 3: Agentenberechtigungen konfigurieren

**Warum**
Einige Agenten sollten **nicht** über alle Berechtigungen verfügen:
- Oracle (Strategieberater): Nur lesen, keine Dateioperationen nötig
- Librarian (Forschungsexperte): Nur lesen, keine Bash-Ausführung nötig
- Explore (Erkundung): Nur lesen, keine Web-Anfragen nötig

**Vorgehensweise:**

```jsonc
{
  "agents": {
    "explore": {
      // Verbietet das Schreiben von Dateien und die Ausführung von Bash, erlaubt nur die Websuche
      "permission": {
        "edit": "deny",
        "bash": "deny",
        "webfetch": "allow"
      }
    },

    "librarian": {
      // Nur-Lese-Berechtigungen
      "permission": {
        "edit": "deny",
        "bash": "deny",
        "webfetch": "allow"  // Dokumentationssuche erforderlich
      }
    },

    "oracle": {
      // Nur-Lese-Berechtigungen
      "permission": {
        "edit": "deny",
        "bash": "deny",
        "webfetch": "allow"  // Informationsbeschaffung erforderlich
      }
    },

    // Sisyphus: Hauptorchestrator, kann alle Operationen ausführen
    "sisyphus": {
      "permission": {
        "edit": "allow",
        "bash": "allow",
        "webfetch": "allow"
      }
    }
  }
}
```

**Berechtigungserklärung:**

| Berechtigung       | Wert            | Erklärung                                               |
|--- | --- | ---|
| `edit`         | `ask/allow/deny` | Dateibearbeitungsberechtigung                                    |
| `bash`         | `ask/allow/deny` oder Objekt | Bash-Ausführungsberechtigung (kann auf bestimmte Befehle detailliert werden)             |
| `webfetch`     | `ask/allow/deny` | Web-Anfrageberechtigung                                  |
| `doom_loop`    | `ask/allow/deny` | Erlaubt Agenten, die Erkennung von Endlosschleifen zu überschreiben                   |
| `external_directory` | `ask/allow/deny` | Berechtigung zum Zugriff auf Verzeichnisse außerhalb des Projektes                         |

**Detaillierte Bash-Berechtigungen:**

```jsonc
{
  "agents": {
    "explore": {
      "permission": {
        "bash": {
          "git": "allow",      // Erlaubt die Ausführung von Git-Befehlen
          "grep": "allow",     // Erlaubt die Ausführung von grep
          "rm": "deny",       // Verbietet das Löschen von Dateien
          "mv": "deny"        // Verbietet das Verschieben von Dateien
        }
      }
    }
  }
}
```

**Was Sie sehen sollten:**
- Nach der Konfiguration von Berechtigungen werden Versuche eines Agenten, deaktivierte Operationen auszuführen, automatisch abgelehnt
- In OpenCode wird eine Ablehnung der Berechtigung angezeigt

---

### Schritt 4: prompt_append verwenden, um zusätzliche Anweisungen hinzuzufügen

**Warum**
Das Standardsystem-Prompt ist bereits gut, aber Sie haben vielleicht **besondere Anforderungen:**
- Librarian soll bevorzugt bestimmte Dokumentationen durchsuchen
- Oracle soll einem bestimmten Architekturmuster folgen
- Explore soll bestimmte Suchschlüsselwörter verwenden

**Vorgehensweise:**

```jsonc
{
  "agents": {
    "librarian": {
      // Wird nach dem Standard-System-Prompt angehängt, überschreibt es nicht
      "prompt_append": "Always use elisp-dev-mcp for Emacs Lisp documentation lookups. " +
                      "When searching for docs, prioritize official documentation over blog posts."
    },

    "oracle": {
      "prompt_append": "Follow SOLID principles and Clean Architecture patterns. " +
                    "Always suggest TypeScript types for all function signatures."
    },

    "explore": {
      "prompt_append": "When searching code, prioritize recent commits and actively maintained files. " +
                    "Ignore test files unless explicitly asked."
    }
  }
}
```

**Was Sie sehen sollten:**
- Das Verhalten des Agenten ändert sich, aber er behält seine ursprünglichen Fähigkeiten bei
- Zum Beispiel schlägt Oracle bei Anfragen immer TypeScript-Typen vor

---

### Schritt 5: Kategorie-Konfiguration anpassen

**Warum**
Kategorien sind eine neue Funktion in v3.0, die **dynamische Agentenkombinationen** ermöglicht:
- Vordefinieren von Modellen und Parametern für bestimmte Aufgabentypen
- Schneller Aufruf über `delegate_task(category="...")`
- Effizienter als"manuelle Modellauswahl + Prompt-Eingabe"

**Vorgehensweise:**

```jsonc
{
  "categories": {
    // Benutzerdefiniert: Data Science Aufgaben
    "data-science": {
      "model": "anthropic/claude-sonnet-4-5",
      "temperature": 0.2,
      "prompt_append": "Focus on data analysis, ML pipelines, and statistical methods. " +
                     "Use pandas/numpy for Python and dplyr/tidyr for R."
    },

    // Standard überschreiben: UI Aufgaben mit benutzerdefiniertem Prompt
    "visual-engineering": {
      "model": "google/gemini-3-pro",
      "prompt_append": "Use shadcn/ui components and Tailwind CSS. " +
                     "Ensure responsive design and accessibility."
    },

    // Standard überschreiben: Schnelle Aufgaben
    "quick": {
      "model": "anthropic/claude-haiku-4-5",
      "temperature": 0.1,
      "prompt_append": "Be concise. Focus on simple fixes and quick searches."
    }
  }
}
```

**Konfigurationsfelder für Kategorien:**

| Feld              | Erklärung                         | Beispiel                              |
|--- | --- | ---|
| `model`           | Zu verwendendes Modell                   | `"anthropic/claude-sonnet-4-5"`    |
| `temperature`     | Temperatur (0-2)                 | `0.2` (deterministisch) / `0.8` (kreativ)    |
| `top_p`           | Nukleus-Sampling (0-1)               | `0.9`                              |
| `maxTokens`       | Maximale Token-Anzahl               | `4000`                             |
| `thinking`        | Thinking-Konfiguration               | `{"type": "enabled", "budgetTokens": 16000}` |
| `prompt_append`    | Zusätzlicher Prompt                   | `"Use X for Y"`                    |
| `tools`           | Werkzeugberechtigungen                   | `{"bash": false}`                    |
| `is_unstable_agent` | Als instabil markiert (erzwingt Hintergrundmodus) | `true`                              |

**Kategorien verwenden:**

```
// In OpenCode
delegate_task(category="data-science", prompt="Analysiere diesen Datensatz und erstelle Visualisierungen")
delegate_task(category="visual-engineering", prompt="Erstelle ein responsives Dashboard-Komponent")
delegate_task(category="quick", prompt="Suche die Definition dieser Funktion")
```

**Was Sie sehen sollten:**
- Verschiedene Aufgabentypen verwenden automatisch das am besten geeignete Modell und die Konfiguration
- Keine manuelle Angabe von Modell und Parametern bei jeder Aufgabe erforderlich

---

### Schritt 6: Spezifische Funktionen deaktivieren

**Warum**
Einige Funktionen passen vielleicht nicht zu Ihrem Workflow:
- `comment-checker`: Ihr Projekt erlaubt detaillierte Kommentare
- `agent-usage-reminder`: Sie wissen, welchen Agent Sie wann verwenden
- Ein bestimmter MCP: Sie benötigen ihn nicht

**Vorgehensweise:**

```jsonc
{
  // Spezifische Hooks deaktivieren
  "disabled_hooks": [
    "comment-checker",           // Keine Überprüfung von Kommentaren
    "agent-usage-reminder",       // Keine Hinweise zur Agentennutzung
    "startup-toast"               // Keine Startbenachrichtigung
  ],

  // Spezifische Skills deaktivieren
  "disabled_skills": [
    "playwright",                // Keine Verwendung von Playwright
    "frontend-ui-ux"            // Keine Verwendung des integrierten Frontend-Skill
  ],

  // Spezifische MCPs deaktivieren
  "disabled_mcps": [
    "websearch",                // Keine Verwendung von Exa-Suche
    "context7",                // Keine Verwendung von Context7
    "grep_app"                 // Keine Verwendung von grep.app
  ],

  // Spezifische Agenten deaktivieren
  "disabled_agents": [
    "multimodal-looker",        // Keine Verwendung von multimodalem Looker
    "metis"                   // Keine Verwendung von Metis-Vorplanungsanalyse
  ]
}
```

**Liste der verfügbaren Hooks** (teilweise):

| Hook-Name                | Funktion                           |
|--- | ---|
| `todo-continuation-enforcer` | Erzwingt den Abschluss von TODO-Listen              |
| `comment-checker`          | Erkennt redundante Kommentare                  |
| `tool-output-truncator`     | Kürzt Werkzeugausgaben, um Kontext zu sparen        |
| `keyword-detector`         | Erkennt Keywords wie ultrawork          |
| `agent-usage-reminder`     | Gibt Hinweise, welcher Agent verwendet werden sollte           |
| `session-notification`      | Sitzungsende-Benachrichtigung                  |
| `background-notification`    | Hintergrundaufgabenabschluss-Benachrichtigung              |

**Was Sie sehen sollten:**
- Deaktivierte Funktionen werden nicht mehr ausgeführt
- Nach der Reaktivierung werden die Funktionen wiederhergestellt

---

### Schritt 7: Hintergrundaufgaben-Konkurrenzsteuerung konfigurieren

**Warum**
Parallele Hintergrundaufgaben erfordern eine **Konkurrenzsteuerung**:
- Vermeidung von API-Rate-Limits
- Kostenkontrolle (teure Modelle sollten nicht zu viele gleichzeitige Aufrufe haben)
- Einhaltung von Provider-Kontingenten

**Vorgehensweise:**

```jsonc
{
  "background_task": {
    // Standardmäßige maximale Konkurrenz
    "defaultConcurrency": 5,

    // Provider-Ebene Konkurrenzeinschränkungen
    "providerConcurrency": {
      "anthropic": 3,      // Anthropic API maximal 3 gleichzeitige
      "openai": 5,         // OpenAI API maximal 5 gleichzeitige
      "google": 10          // Gemini API maximal 10 gleichzeitige
    },

    // Modell-Ebene Konkurrenzeinschränkungen (höchste Priorität)
    "modelConcurrency": {
      "anthropic/claude-opus-4-5": 2,     // Opus zu teuer, begrenzt auf 2 gleichzeitige
      "google/gemini-3-flash": 10,          // Flash sehr günstig, erlaubt 10 gleichzeitige
      "anthropic/claude-haiku-4-5": 15      // Haiku noch günstiger, erlaubt 15 gleichzeitige
    }
  }
}
```

**Prioritätsreihenfolge:**
```
modelConcurrency > providerConcurrency > defaultConcurrency
```

**Was Sie sehen sollten:**
- Hintergrundaufgaben, die die Konkurrenzgrenzen überschreiten, warten in einer Warteschlange
- Die Konkurrenz teurer Modelle wird begrenzt, um Kosten zu sparen

---

### Schritt 8: Experimentelle Funktionen aktivieren

**Warum**
Experimentelle Funktionen bieten **zusätzliche Fähigkeiten**, können aber instabil sein:
- `aggressive_truncation`: Aggressiveres Kürzen des Kontexts
- `auto_resume`: Automatische Wiederherstellung nach Abstürzen
- `truncate_all_tool_outputs`: Kürzen aller Werkzeugausgaben

::: danger Warnung
Experimentelle Funktionen können in zukünftigen Versionen entfernt oder ihr Verhalten geändert werden. Testen Sie sie gründlich, bevor Sie sie aktivieren.
:::

**Vorgehensweise:**

```jsonc
{
  "experimental": {
    // Aktiviert aggressiveres Kürzen von Werkzeugausgaben
    "aggressive_truncation": true,

    // Automatische Wiederherstellung von Thinking-Block-Fehlern
    "auto_resume": true,

    // Kürzen aller Werkzeugausgaben (nicht nur Grep/Glob/LSP/AST-Grep)
    "truncate_all_tool_outputs": false
  }
}
```

**Was Sie sehen sollten:**
- Im aggressiven Modus werden Werkzeugausgaben strenger gekürzt, um Kontext zu sparen
- Nach Aktivierung von `auto_resume` setzen Agenten nach Fehlern ihre Arbeit automatisch fort

---

## Checkpoint ✅

**Überprüfen, ob die Konfiguration wirksam ist:**

```bash
# Diagnosebefehl ausführen
bunx oh-my-opencode doctor --verbose
```

**Was Sie sehen sollten:**
- Die Modell-Auflösungsergebnisse für jeden Agenten
- Ob Ihre Konfigurationsüberschreibungen wirksam sind
- Ob deaktivierte Funktionen korrekt erkannt werden

---

## Häufige Fallstricke

### 1. Formatfehler in Konfigurationsdateien

**Problem:**
- JSON-Syntaxfehler (fehlendes Komma, überflüssiges Komma)
- Rechtschreibfehler in Feldnamen (`temperature` statt `temperature` geschrieben)

**Lösung:**
```bash
# JSON-Format überprüfen
cat ~/.config/opencode/oh-my-opencode.json | jq .
```

### 2. Zu strikte Berechtigungskonfiguration

**Problem:**
- Einige Agenten vollständig deaktiviert (`edit: "deny"`, `bash: "deny"`)
- Führt dazu, dass Agenten ihre normale Arbeit nicht erledigen können

**Lösung:**
- Nur-Lese-Agenten (Oracle, Librarian) können `edit` und `bash` deaktivieren
- Hauptorchestrator (Sisyphus) benötigt volle Berechtigungen

### 3. Kategorie-Konfiguration wirkt nicht

**Problem:**
- Kategorie falsch geschrieben (`visual-engineering` statt `visual-engineering` geschrieben)
- `delegate_task` gibt den `category`-Parameter nicht an

**Lösung:**
- Überprüfen Sie, ob der Name in `delegate_task(category="...")` mit der Konfiguration übereinstimmt
- Verwenden Sie `doctor --verbose`, um die Kategorie-Auflösungsergebnisse zu überprüfen

### 4. Konkurrenzeinschränkungen zu niedrig

**Problem:**
- `modelConcurrency` zu niedrig eingestellt (z.B. `1`)
- Hintergrundaufgaben werden fast seriell ausgeführt, Parallelitätsvorteile gehen verloren

**Lösung:**
- Rationale Einstellung basierend auf Budget und API-Kontingenten
- Teure Modelle (Opus) auf 2-3 beschränken, günstige Modelle (Haiku) können 10+ sein

---

## Zusammenfassung der Lektion

**Tiefenkonfiguration = Präzise Kontrolle:**

| Konfigurationselement           | Zweck                          | Häufige Szenarien                         |
|--- | --- | ---|
| `agents.model`    | Agentenmodell überschreiben                  | Kostenoptimierung, Aufgabenanpassung             |
| `agents.permission` | Agentenberechtigungen steuern                | Sicherheitsisolierung, Nur-Lese-Modus           |
| `agents.prompt_append` | Zusätzliche Anweisungen anhängen                | Architekturrichtlinien befolgen, Suchstrategien optimieren |
| `categories`      | Dynamische Agentenkombinationen                  | Schneller Aufruf bestimmter Aufgabentypen           |
| `background_task` | Konkurrenzsteuerung                     | Kostenkontrolle, API-Kontingent           |
| `disabled_*`      | Spezifische Funktionen deaktivieren                 | Ungebräuchliche Funktionen entfernen               |

**Denken Sie daran:**
- Konfigurationen auf Benutzerebene (`~/.config/opencode/oh-my-opencode.json`) haben Vorrang vor Konfigurationen auf Projektebene
- Verwenden Sie JSONC, um Konfigurationen lesbarer zu gestalten
- Führen Sie `oh-my-opencode doctor --verbose` aus, um Konfigurationen zu überprüfen

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Konfigurationsdiagnose und Fehlerbehebung](../../faq/troubleshooting/)**.
>
> Sie lernen:
> - Verwenden des doctor-Befehls für Gesundheitschecks
> - Diagnose von Problemen mit OpenCode-Versionen, Plugin-Registrierung, Provider-Konfigurationen usw.
> - Verständnis des Modell-Auflösungsmechanismus und der Kategorien-Konfiguration
> - Verwendung von JSON-Ausgabe für automatisierte Diagnose

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Einblenden, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisierungsdatum: 2026-01-26

| Funktion                | Dateipfad                                                                 | Zeile    |
|--- | --- | ---|
| Konfigurationsschema-Definition    | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 1-378   |
| AgentOverrideConfig | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 98-119   |
| CategoryConfig      | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 154-172  |
| AgentPermissionSchema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 11-17    |
| OhMyOpenCodeConfigSchema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 329-350  |
| Konfigurationsdokumentation          | [`docs/configurations.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/configurations.md) | 1-595   |

**Wichtige Konstanten:**
- `PermissionValue = z.enum(["ask", "allow", "deny"])`: Berechtigungs-Werte-Aufzählung

**Wichtige Typen:**
- `AgentOverrideConfig`: Agentenüberschreibungskonfiguration (Modell, Temperatur, Prompt usw.)
- `CategoryConfig`: Kategorie-Konfiguration (Modell, Temperatur, Prompt usw.)
- `AgentPermissionSchema`: Agentenberechtigungs-Konfiguration (edit, bash, webfetch usw.)
- `BackgroundTaskConfig`: Hintergrundaufgaben-Konkurrenz-Konfiguration

**Integrierte Agenten-Aufzählung** (`BuiltinAgentNameSchema`):
- `sisyphus`, `prometheus`, `oracle`, `librarian`, `explore`, `multimodal-looker`, `metis`, `momus`, `atlas`

**Integrierte Skill-Aufzählung** (`BuiltinSkillNameSchema`):
- `playwright`, `agent-browser`, `frontend-ui-ux`, `git-master`

**Integrierte Kategorie-Aufzählung** (`BuiltinCategoryNameSchema`):
- `visual-engineering`, `ultrabrain`, `artistry`, `quick`, `unspecified-low`, `unspecified-high`, `writing`

</details>

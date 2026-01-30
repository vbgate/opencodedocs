---
title: "Häufig gestellte Fragen: ultrawork-Modus | oh-my-opencode"
subtitle: "Häufig gestellte Fragen und Antworten"
sidebarTitle: "Problemlösung"
description: "Lernen Sie die Antworten auf häufig gestellte Fragen zu oh-my-opencode. Einschließlich ultrawork-Modus, Multi-Agent-Zusammenarbeit, Hintergrundaufgaben, Ralph Loop und Fehlerbehebung bei der Konfiguration."
tags:
  - "faq"
  - "troubleshooting"
  - "installation"
  - "configuration"
order: 160
---

# Häufig gestellte Fragen

## Was Sie nach diesem Tutorial können werden

Nach dem Lesen dieser FAQ werden Sie in der Lage sein:

- Schnell Lösungen für Installations- und Konfigurationsprobleme zu finden
- Den ultrawork-Modus korrekt zu verwenden
- Best Practices für Agent-Aufrufe zu beherrschen
- Die Grenzen und Einschränkungen der Claude Code-Kompatibilität zu verstehen
- Häufige Sicherheits- und Performance-Fallen zu vermeiden

---

## Installation und Konfiguration

### Wie installiere ich oh-my-opencode?

**Der einfachste Weg**: Lassen Sie einen AI-Agenten die Installation für Sie durchführen.

Senden Sie folgenden Prompt an Ihren LLM-Agenten (Claude Code, AmpCode, Cursor, etc.):

```
Install and configure oh-my-opencode by following the instructions here:
https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/docs/guide/installation.md
```

**Manuelle Installation**: Siehe [Installationsanleitung](../start/installation/).

::: tip Warum wird die AI-Agent-Installation empfohlen?
Menschen machen leicht Fehler bei der JSONC-Formatierung (z.B. vergessene Anführungszeichen, falsche Doppelpunkt-Positionen). Die Verwendung eines AI-Agenten vermeidet häufige Syntaxfehler.
:::

### Wie deinstalliere ich oh-my-opencode?

Die Bereinigung erfolgt in drei Schritten:

**Schritt 1**: Plugin aus der OpenCode-Konfiguration entfernen

Bearbeiten Sie `~/.config/opencode/opencode.json` (oder `opencode.jsonc`) und entfernen Sie `"oh-my-opencode"` aus dem `plugin`-Array.

```bash
# Automatisches Entfernen mit jq
jq '.plugin = [.plugin[] | select(. != "oh-my-opencode")]' \
    ~/.config/opencode/opencode.json > /tmp/oc.json && \
    mv /tmp/oc.json ~/.config/opencode/opencode.json
```

**Schritt 2**: Konfigurationsdateien löschen (optional)

```bash
# Benutzerkonfiguration löschen
rm -f ~/.config/opencode/oh-my-opencode.json

# Projektkonfiguration löschen (falls vorhanden)
rm -f .opencode/oh-my-opencode.json
```

**Schritt 3**: Entfernung verifizieren

```bash
opencode --version
# Das Plugin sollte nicht mehr geladen werden
```

### Wo befinden sich die Konfigurationsdateien?

Konfigurationsdateien existieren auf zwei Ebenen:

| Ebene | Speicherort | Verwendungszweck | Priorität |
| --- | --- | --- | --- |
| Projektebene | `.opencode/oh-my-opencode.json` | Projektspezifische Konfiguration | Niedrig |
| Benutzerebene | `~/.config/opencode/oh-my-opencode.json` | Globale Standardkonfiguration | Hoch |

**Zusammenführungsregel**: Die Benutzerkonfiguration überschreibt die Projektkonfiguration.

Konfigurationsdateien unterstützen das JSONC-Format (JSON with Comments), Sie können Kommentare und Trailing-Kommas hinzufügen:

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/assets/oh-my-opencode.schema.json",
  // Dies ist ein Kommentar
  "disabled_agents": [], // Trailing-Komma erlaubt
  "agents": {}
}
```

### Wie deaktiviere ich eine bestimmte Funktion?

Verwenden Sie die `disabled_*`-Arrays in der Konfigurationsdatei:

```json
{
  "disabled_agents": ["oracle", "librarian"],
  "disabled_skills": ["playwright"],
  "disabled_hooks": ["comment-checker", "auto-update-checker"],
  "disabled_mcps": ["websearch"]
}
```

**Claude Code-Kompatibilitätsschalter**:

```json
{
  "claude_code": {
    "mcp": false,        // Claude Code MCP deaktivieren
    "commands": false,    // Claude Code Commands deaktivieren
    "skills": false,      // Claude Code Skills deaktivieren
    "hooks": false        // settings.json Hooks deaktivieren
  }
}
```

---

## Verwendung

### Was ist ultrawork?

**ultrawork** (oder die Kurzform `ulw`) ist das Zauberwort – wenn Sie es in Ihren Prompt aufnehmen, werden alle Funktionen automatisch aktiviert:

- ✅ Parallele Hintergrundaufgaben
- ✅ Alle spezialisierten Agenten (Sisyphus, Oracle, Librarian, Explore, Prometheus, etc.)
- ✅ Tiefenexplorationsmodus
- ✅ Todo-Completion-Enforcer

**Verwendungsbeispiel**:

```
ultrawork Entwickle eine REST API mit JWT-Authentifizierung und Benutzerverwaltung
```

Oder kürzer:

```
ulw Refaktoriere dieses Modul
```

::: info Funktionsweise
Der `keyword-detector`-Hook erkennt die Schlüsselwörter `ultrawork` oder `ulw` und setzt dann `message.variant` auf einen speziellen Wert, der alle erweiterten Funktionen auslöst.
:::

### Wie rufe ich einen bestimmten Agenten auf?

**Methode 1: Verwendung des @-Symbols**

```
Ask @oracle to review this design and propose an architecture
Ask @librarian how this is implemented - why does behavior keep changing?
Ask @explore for policy on this feature
```

**Methode 2: Verwendung des delegate_task-Tools**

```
delegate_task(agent="oracle", prompt="Review this architecture design")
delegate_task(agent="librarian", prompt="Find implementation examples of JWT auth")
```

**Agent-Berechtigungsbeschränkungen**:

| Agent | Kann Code schreiben | Kann Bash ausführen | Kann Aufgaben delegieren | Beschreibung |
| --- | --- | --- | --- | --- |
| Sisyphus | ✅ | ✅ | ✅ | Haupt-Orchestrator |
| Oracle | ❌ | ❌ | ❌ | Nur-Lese-Berater |
| Librarian | ❌ | ❌ | ❌ | Nur-Lese-Recherche |
| Explore | ❌ | ❌ | ❌ | Nur-Lese-Suche |
| Multimodal Looker | ❌ | ❌ | ❌ | Nur-Lese-Medienanalyse |
| Prometheus | ✅ | ✅ | ✅ | Planer |

### Wie funktionieren Hintergrundaufgaben?

Hintergrundaufgaben ermöglichen es Ihnen, mehrere AI-Agenten parallel arbeiten zu lassen, wie ein echtes Entwicklungsteam:

**Hintergrundaufgabe starten**:

```
delegate_task(agent="explore", background=true, prompt="Find auth implementations")
```

**Weiterarbeiten...**

**System benachrichtigt automatisch bei Fertigstellung** (über den `background-notification`-Hook)

**Ergebnisse abrufen**:

```
background_output(task_id="bg_abc123")
```

**Parallelitätssteuerung**:

```json
{
  "background_task": {
    "defaultConcurrency": 3,
    "providerConcurrency": {
      "anthropic": 2,
      "openai": 3
    },
    "modelConcurrency": {
      "anthropic/claude-opus-4-5": 1,
      "openai/gpt-5.2": 2
    }
  }
}
```

**Priorität**: `modelConcurrency` > `providerConcurrency` > `defaultConcurrency`

::: tip Warum ist Parallelitätssteuerung notwendig?
Um API-Ratenbegrenzungen und Kostenexplosionen zu vermeiden. Zum Beispiel ist Claude Opus 4.5 teuer, daher wird die Parallelität begrenzt; Haiku ist günstig und kann mehr parallel ausführen.
:::

### Wie verwende ich Ralph Loop?

**Ralph Loop** ist eine selbstreferenzierende Entwicklungsschleife – sie arbeitet kontinuierlich, bis die Aufgabe abgeschlossen ist.

**Starten**:

```
/ralph-loop "Build a REST API with authentication"
/ralph-loop "Refactor the payment module" --max-iterations=50
```

**Wie wird die Fertigstellung erkannt**: Der Agent gibt das `<promise>DONE</promise>`-Tag aus.

**Schleife abbrechen**:

```
/cancel-ralph
```

**Konfiguration**:

```json
{
  "ralph_loop": {
    "enabled": true,
    "default_max_iterations": 100
  }
}
```

::: tip Unterschied zu ultrawork
`/ralph-loop` ist der normale Modus, `/ulw-loop` ist der ultrawork-Modus (alle erweiterten Funktionen aktiviert).
:::

### Was sind Categories und Skills?

**Categories** (neu in v3.0): Eine Modellabstraktionsschicht, die automatisch das optimale Modell basierend auf dem Aufgabentyp auswählt.

**Integrierte Categories**:

| Category | Standardmodell | Temperature | Anwendungsfall |
| --- | --- | --- | --- |
| visual-engineering | google/gemini-3-pro | 0.7 | Frontend, UI/UX, Design |
| ultrabrain | openai/gpt-5.2-codex | 0.1 | Hochintelligente Reasoning-Aufgaben |
| artistry | google/gemini-3-pro | 0.7 | Kreative und künstlerische Aufgaben |
| quick | anthropic/claude-haiku-4-5 | 0.1 | Schnelle, kostengünstige Aufgaben |
| writing | google/gemini-3-flash | 0.1 | Dokumentation und Schreibaufgaben |

**Skills**: Spezialisierte Wissensmodule, die domänenspezifische Best Practices injizieren.

**Integrierte Skills**:

| Skill | Auslösebedingung | Beschreibung |
| --- | --- | --- |
| playwright | Browser-bezogene Aufgaben | Playwright MCP Browser-Automatisierung |
| frontend-ui-ux | UI/UX-Aufgaben | Designer-zu-Entwickler, erstellt ansprechende Oberflächen |
| git-master | Git-Operationen (commit, rebase, squash) | Git-Experte, atomare Commits, Verlaufssuche |

**Verwendungsbeispiel**:

```
delegate_task(category="visual", skills=["frontend-ui-ux"], prompt="Entwerfe die UI für diese Seite")
delegate_task(category="quick", skills=["git-master"], prompt="Committe diese Änderungen")
```

::: info Vorteile
Categories optimieren die Kosten (verwenden günstigere Modelle), Skills gewährleisten Qualität (injizieren Fachwissen).
:::

---

## Claude Code-Kompatibilität

### Kann ich die Claude Code-Konfiguration verwenden?

**Ja**, oh-my-opencode bietet eine **vollständige Kompatibilitätsschicht**:

**Unterstützte Konfigurationstypen**:

| Typ | Ladeort | Priorität |
| --- | --- | --- |
| Commands | `~/.claude/commands/`, `.claude/commands/` | Niedrig |
| Skills | `~/.claude/skills/*/SKILL.md`, `.claude/skills/*/SKILL.md` | Mittel |
| Agents | `~/.claude/agents/*.md`, `.claude/agents/*.md` | Hoch |
| MCPs | `~/.claude/.mcp.json`, `.claude/.mcp.json` | Hoch |
| Hooks | `~/.claude/settings.json`, `.claude/settings.json` | Hoch |

**Konfigurationsladepriorität**:

OpenCode-Projektkonfiguration > Claude Code-Benutzerkonfiguration

```json
{
  "claude_code": {
    "plugins_override": {
      "claude-mem@thedotmack": false  // Bestimmtes Plugin deaktivieren
    }
  }
}
```

### Kann ich das Claude Code-Abonnement verwenden?

**Technisch möglich, aber nicht empfohlen**.

::: warning Claude OAuth-Zugriffsbeschränkungen
Stand Januar 2026 hat Anthropic den OAuth-Zugriff für Dritte eingeschränkt, unter Berufung auf ToS-Verstöße.
:::

**Offizielle Erklärung** (aus der README):

> Es gibt tatsächlich einige Community-Tools, die Claude Code OAuth-Anfragen fälschen. Diese Tools sind technisch möglicherweise nicht erkennbar, aber Benutzer sollten sich der ToS-Auswirkungen bewusst sein. Ich persönlich empfehle sie nicht.
>
> **Dieses Projekt übernimmt keine Verantwortung für Probleme, die durch die Verwendung inoffizieller Tools verursacht werden, und wir haben keine benutzerdefinierte OAuth-Systemimplementierung.**

**Empfohlene Lösung**: Verwenden Sie Ihre bestehenden AI-Provider-Abonnements (Claude, OpenAI, Gemini, etc.).

### Sind die Daten kompatibel?

**Ja**, das Datenspeicherformat ist kompatibel:

| Daten | Speicherort | Format | Kompatibilität |
| --- | --- | --- | --- |
| Todos | `~/.claude/todos/` | JSON | ✅ Claude Code-kompatibel |
| Transcripts | `~/.claude/transcripts/` | JSONL | ✅ Claude Code-kompatibel |

Sie können nahtlos zwischen Claude Code und oh-my-opencode wechseln.

---

## Sicherheit und Performance

### Gibt es Sicherheitswarnungen?

**Ja**, oben in der README gibt es eine deutliche Warnung:

::: danger Warnung: Betrügerische Websites
**ohmyopencode.com steht in keiner Verbindung zu diesem Projekt.** Wir betreiben oder unterstützen diese Website nicht.
>
> OhMyOpenCode ist **kostenlos und Open Source**. Laden Sie keine Installer herunter und geben Sie keine Zahlungsinformationen auf Drittanbieter-Websites ein, die behaupten, "offiziell" zu sein.
>
> Da die betrügerische Website hinter einer Paywall liegt, **können wir nicht verifizieren, was sie verteilt**. Behandeln Sie alle Downloads von dort als **potenziell unsicher**.
>
> ✅ Offizieller Download: https://github.com/code-yeongyu/oh-my-opencode/releases
:::

### Wie optimiere ich die Performance?

**Strategie 1: Das richtige Modell verwenden**

- Schnelle Aufgaben → `quick`-Category verwenden (Haiku-Modell)
- UI-Design → `visual`-Category verwenden (Gemini 3 Pro)
- Komplexes Reasoning → `ultrabrain`-Category verwenden (GPT 5.2)

**Strategie 2: Parallelitätssteuerung aktivieren**

```json
{
  "background_task": {
    "providerConcurrency": {
      "anthropic": 2,  // Anthropic-Parallelität begrenzen
      "openai": 5       // OpenAI-Parallelität erhöhen
    }
  }
}
```

**Strategie 3: Hintergrundaufgaben verwenden**

Lassen Sie leichtgewichtige Modelle (wie Haiku) im Hintergrund Informationen sammeln, während der Hauptagent (Opus) sich auf die Kernlogik konzentriert.

**Strategie 4: Nicht benötigte Funktionen deaktivieren**

```json
{
  "disabled_hooks": ["comment-checker", "auto-update-checker"],
  "claude_code": {
    "hooks": false  // Claude Code Hooks deaktivieren (falls nicht verwendet)
  }
}
```

### OpenCode-Versionsanforderungen?

**Empfohlen**: OpenCode >= 1.0.132

::: warning Bug in älteren Versionen
Wenn Sie Version 1.0.132 oder älter verwenden, kann ein Bug in OpenCode die Konfiguration beschädigen.
>
> Der Fix wurde nach 1.0.132 zusammengeführt – verwenden Sie eine neuere Version.
:::

Version prüfen:

```bash
opencode --version
```

---

## Fehlerbehebung

### Agent funktioniert nicht?

**Checkliste**:

1. ✅ Konfigurationsdateiformat verifizieren (JSONC-Syntax)
2. ✅ Provider-Konfiguration prüfen (ist der API-Key gültig)
3. ✅ Diagnosetool ausführen: `oh-my-opencode doctor --verbose`
4. ✅ OpenCode-Logs auf Fehlermeldungen prüfen

**Häufige Probleme**:

| Problem | Ursache | Lösung |
| --- | --- | --- |
| Agent lehnt Aufgabe ab | Berechtigungskonfiguration falsch | `agents.permission`-Konfiguration prüfen |
| Hintergrundaufgabe Timeout | Parallelitätslimit zu streng | `providerConcurrency` erhöhen |
| Thinking-Block-Fehler | Modell unterstützt kein Thinking | Zu einem Modell wechseln, das Thinking unterstützt |

### Konfigurationsdatei wird nicht wirksam?

**Mögliche Ursachen**:

1. JSON-Syntaxfehler (vergessene Anführungszeichen, Kommas)
2. Falscher Speicherort der Konfigurationsdatei
3. Benutzerkonfiguration überschreibt Projektkonfiguration nicht

**Verifizierungsschritte**:

```bash
# Prüfen, ob Konfigurationsdatei existiert
ls -la ~/.config/opencode/oh-my-opencode.json
ls -la .opencode/oh-my-opencode.json

# JSON-Syntax validieren
cat ~/.config/opencode/oh-my-opencode.json | jq .
```

**JSON Schema zur Validierung verwenden**:

Fügen Sie das `$schema`-Feld am Anfang der Konfigurationsdatei hinzu, und der Editor zeigt automatisch Fehler an:

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/assets/oh-my-opencode.schema.json"
}
```

### Hintergrundaufgabe wird nicht abgeschlossen?

**Checkliste**:

1. ✅ Aufgabenstatus prüfen: `background_output(task_id="...")`
2. ✅ Parallelitätslimit prüfen: Sind verfügbare Parallelitäts-Slots vorhanden
3. ✅ Logs prüfen: Gibt es API-Ratenbegrenzungsfehler

**Aufgabe erzwungen abbrechen**:

```javascript
background_cancel(task_id="bg_abc123")
```

**Aufgaben-TTL**: Hintergrundaufgaben werden nach 30 Minuten automatisch bereinigt.

---

## Weitere Ressourcen

### Wo finde ich Hilfe?

- **GitHub Issues**: https://github.com/code-yeongyu/oh-my-opencode/issues
- **Discord-Community**: https://discord.gg/PUwSMR9XNk
- **X (Twitter)**: https://x.com/justsisyphus

### Empfohlene Lesereihenfolge

Wenn Sie neu sind, empfehlen wir folgende Lesereihenfolge:

1. [Schnelle Installation und Konfiguration](../start/installation/)
2. [Sisyphus kennenlernen: Der Haupt-Orchestrator](../start/sisyphus-orchestrator/)
3. [Ultrawork-Modus](../start/ultrawork-mode/)
4. [Konfigurationsdiagnose und Fehlerbehebung](../troubleshooting/)

### Code beitragen

Pull Requests sind willkommen! 99% des Projektcodes wurden mit OpenCode erstellt.

Wenn Sie eine Funktion verbessern oder einen Bug beheben möchten:

1. Repository forken
2. Feature-Branch erstellen
3. Änderungen committen
4. Zum Branch pushen
5. Pull Request erstellen

---

## Zusammenfassung dieser Lektion

Diese FAQ behandelt häufige Fragen zu oh-my-opencode, einschließlich:

- **Installation und Konfiguration**: Installation, Deinstallation, Speicherort der Konfigurationsdateien, Funktionen deaktivieren
- **Verwendungstipps**: ultrawork-Modus, Agent-Aufrufe, Hintergrundaufgaben, Ralph Loop, Categories und Skills
- **Claude Code-Kompatibilität**: Konfigurationsladen, Abonnementnutzungsbeschränkungen, Datenkompatibilität
- **Sicherheit und Performance**: Sicherheitswarnungen, Performance-Optimierungsstrategien, Versionsanforderungen
- **Fehlerbehebung**: Häufige Probleme und Lösungen

Merken Sie sich diese Kernpunkte:

- Verwenden Sie die Schlüsselwörter `ultrawork` oder `ulw`, um alle Funktionen zu aktivieren
- Lassen Sie leichtgewichtige Modelle im Hintergrund Informationen sammeln, während der Hauptagent sich auf die Kernlogik konzentriert
- Konfigurationsdateien unterstützen das JSONC-Format, Kommentare sind erlaubt
- Claude Code-Konfigurationen können nahtlos geladen werden, aber OAuth-Zugriff ist eingeschränkt
- Laden Sie nur vom offiziellen GitHub-Repository herunter, Vorsicht vor betrügerischen Websites

## Vorschau auf die nächste Lektion

> Wenn Sie bei der Verwendung auf spezifische Konfigurationsprobleme stoßen, können Sie **[Konfigurationsdiagnose und Fehlerbehebung](../troubleshooting/)** lesen.
>
> Sie werden lernen:
> - Wie Sie Diagnosetools zur Konfigurationsprüfung verwenden
> - Die Bedeutung häufiger Fehlercodes und deren Lösungen
> - Techniken zur Fehlerbehebung bei Provider-Konfigurationsproblemen
> - Tipps zur Lokalisierung und Optimierung von Performance-Problemen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Position anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-26

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Keyword Detector (ultrawork-Erkennung) | [`src/hooks/keyword-detector/`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/) | Gesamtes Verzeichnis |
| Background Task Manager | [`src/features/background-agent/manager.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/background-agent/manager.ts) | 1-1377 |
| Concurrency Control | [`src/features/background-agent/concurrency.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/background-agent/concurrency.ts) | Gesamte Datei |
| Ralph Loop | [`src/hooks/ralph-loop/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/ralph-loop/index.ts) | Gesamte Datei |
| Delegate Task (Category & Skill-Parsing) | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | 1-1070 |
| Config Schema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | Gesamte Datei |
| Claude Code Hooks | [`src/hooks/claude-code-hooks/`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/claude-code-hooks/) | Gesamtes Verzeichnis |

**Wichtige Konstanten**:
- `DEFAULT_MAX_ITERATIONS = 100`: Ralph Loop Standard-Maximaliterationen
- `TASK_TTL_MS = 30 * 60 * 1000`: Hintergrundaufgaben-TTL (30 Minuten)
- `POLL_INTERVAL_MS = 2000`: Hintergrundaufgaben-Abfrageintervall (2 Sekunden)

**Wichtige Konfigurationen**:
- `disabled_agents`: Liste der deaktivierten Agenten
- `disabled_skills`: Liste der deaktivierten Skills
- `disabled_hooks`: Liste der deaktivierten Hooks
- `claude_code`: Claude Code-Kompatibilitätskonfiguration
- `background_task`: Hintergrundaufgaben-Parallelitätskonfiguration
- `categories`: Category-Anpassungskonfiguration
- `agents`: Agent-Override-Konfiguration

</details>

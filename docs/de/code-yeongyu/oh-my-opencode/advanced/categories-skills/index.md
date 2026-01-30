---
title: "Kategorien und Skills: Dynamische Agent-Komposition | oh-my-opencode"
sidebarTitle: "Dynamische Agent-Komposition"
subtitle: "Kategorien und Skills: Dynamische Agent-Komposition (v3.0)"
description: "Lernen Sie das Kategorien- und Skills-System von oh-my-opencode kennen und beherrschen Sie die Kombination von Modellen und Wissen zur Erstellung spezialisierter KI-Unteragenten. Optimieren Sie Entwicklungskosten mit 7 integrierten Kategorien, 4 Skills und dem delegate_task-Tool."
tags:
  - "categories"
  - "skills"
  - "delegate-task"
  - "sisyphus-junior"
prerequisite:
  - "start-quick-start"
order: 100
---

# Kategorien und Skills: Dynamische Agent-Komposition (v3.0)

## Was Sie nach Abschluss können

- ✅ Verwenden Sie 7 integrierte Kategorien zur automatischen Auswahl des optimalen Modells für verschiedene Aufgabentypen
- ✅ Laden Sie 4 integrierte Skills, um Agenten mit Fachwissen und MCP-Tools auszustatten
- ✅ Kombinieren Sie Kategorien und Skills über `delegate_task`, um spezialisierte Unteragenten zu erstellen
- ✅ Passen Sie Kategorien und Skills an Ihre spezifischen Projektanforderungen an

## Ihr aktuelles Problem

**Agenten nicht spezialisiert genug? Kosten zu hoch?**

Stellen Sie sich folgendes Szenario vor:

| Problem | Herkömmlicher Ansatz | Tatsächlicher Bedarf |
|---|---|---|
| **UI-Aufgaben mit übermäßigem Modell** | Claude Opus für einfache Stilanpassungen verwenden | Hohe Kosten, verschwendete Rechenleistung |
| **Komplexe Logik mit leichtem Modell** | Haiku für Architekturdesign verwenden | Ungenügende推理-Fähigkeit, falsche Lösungen |
| **Git-Commit-Stil inkonsistent** | Manuelles Commit-Management, fehleranfällig | Automatische Erkennung und Einhaltung von Projektstandards |
| **Browser-Tests erforderlich** | Manuelles Öffnen des Browsers zur Verifizierung | Benötigt Playwright MCP-Tool-Support |

**Kernproblem**:
1. Alle Aufgaben mit einem Agenten bearbeiten → Modell und Tools nicht passend
2. 10 feste Agenten hardcodieren → Keine flexible Kombination möglich
3. Fehlende Fachkenntnisse → Agenten mangelt es an domainspezifischem Wissen

**Lösung**: Das Kategorien- und Skills-System von v3.0 ermöglicht die Komposition von Agenten wie beim Bau von Bausteinen:
- **Kategorie** (Modellabstraktion): Aufgabentyp definieren → Automatische Auswahl des optimalen Modells
- **Skill** (Fachwissen): Domänenwissen und MCP-Tools injizieren → Agenten spezialiserter machen

## Wann Sie diesen Ansatz verwenden

| Szenario | Empfohlene Kombination | Effekt |
|---|---|---|
| **UI-Design und -implementierung** | `category="visual-engineering"` + `skills=["frontend-ui-ux", "playwright"]` | Automatische Auswahl von Gemini 3 Pro + Designer-Denken + Browser-Verifizierung |
| **Schnellbehebung und Commit** | `category="quick"` + `skills=["git-master"]` | Günstig mit Haiku + Automatische Erkennung des Commit-Stils |
| **Tiefgehende Architekturanalyse** | `category="ultrabrain"` + `skills=[]` | Reines推理mit GPT-5.2 Codex (xhigh) |
| **Dokumentation** | `category="writing"` + `skills=[]` | Schnelle Dokumentationsgenerierung mit Gemini 3 Flash |

## 🎒 Vorbereitungen

:::warning Voraussetzungen

Stellen Sie vor Beginn dieses Tutorials sicher, dass:
1. oh-my-opencode installiert ist (siehe [Installationsanleitung](../../start/installation/))
2. Mindestens ein Provider konfiguriert ist (siehe [Provider-Konfiguration](../../platforms/provider-setup/))
3. Sie die Grundlagen des delegate_task-Tools verstehen (siehe [Hintergrund-Parallelaufgaben](../background-tasks/))

:::

:::info Schlüsselkonzepte
**Kategorie** ist "Welche Art von Arbeit ist das" (bestimmt Modell, Temperatur, Denkmodus), **Skill** ist "Welches Fachwissen und welche Tools werden benötigt" (injiziert Prompts und MCP-Server). Kombinieren Sie beides über `delegate_task(category=..., skills=[...])`.
:::

## Kernkonzepte

### Kategorien: Aufgabentyp bestimmt Modell

oh-my-opencode bietet 7 integrierte Kategorien, jede mit optimaler Modell- und Denkmodus-Konfiguration:

| Kategorie | Standardmodell | Temperatur | Verwendung |
|---|---|---|---|
| `visual-engineering` | `google/gemini-3-pro` | 0.7 | Frontend, UI/UX, Design-Aufgaben |
| `ultrabrain` | `openai/gpt-5.2-codex` (xhigh) | 0.1 | Aufgaben mit hohem推理-IQ (komplexe Architekturentscheidungen) |
| `artistry` | `google/gemini-3-pro` (max) | 0.7 | Kreative und künstlerische Aufgaben (neue Ideen) |
| `quick` | `anthropic/claude-haiku-4-5` | 0.1 | Schnelle, günstige Aufgaben (einzelne Dateiänderungen) |
| `unspecified-low` | `anthropic/claude-sonnet-4-5` | 0.1 | Mittlere Aufgaben, die nicht in andere Kategorien passen |
| `unspecified-high` | `anthropic/claude-opus-4-5` (max) | 0.1 | Hochwertige Aufgaben, die nicht in andere Kategorien passen |
| `writing` | `google/gemini-3-flash` | 0.1 | Dokumentations- und Schreibaufgaben |

**Warum brauchen Kategorien?**

Verschiedene Aufgaben benötigen Modelle mit unterschiedlichen Fähigkeiten:
- UI-Design → Benötigt **visuelle Kreativität** (Gemini 3 Pro)
- Architekturentscheidungen → Benötigt **tiefgehendes推理** (GPT-5.2 Codex xhigh)
- Einfache Änderungen → Benötigt **schnelle Reaktion** (Claude Haiku)

Manuell für jede Aufgabe ein Modell auszuwählen ist mühsam. Mit Kategorien deklarieren Sie nur den Aufgabentyp, und das System wählt automatisch das optimale Modell.

### Skills: Fachwissen injizieren

Skills sind durch SKILL.md-Dateien definierte Domänenexperten, die Folgendes injizieren können:
- **Fachwissen** (Prompt-Erweiterung)
- **MCP-Server** (automatisch geladen)
- **Workflow-Anleitungen** (konkrete Operationsschritte)

4 integrierte Skills:

| Skill | Funktion | MCP | Verwendung |
|---|---|---|---|
| `playwright` | Browser-Automatisierung | `@playwright/mcp` | UI-Verifizierung, Screenshots, Web-Scraping |
| `agent-browser` | Browser-Automatisierung (Vercel) | Manuelle Installation | Gleiches, alternative Option |
| `frontend-ui-ux` | Designer-Denken | Kein | Schöne Benutzeroberflächen gestalten |
| `git-master` | Git-Experte | Kein | Automatische Commits, Verlaufssuche, Rebase |

**Funktionsweise von Skills**:

Wenn Sie einen Skill laden, führt das System folgende Schritte aus:
1. Liest den Prompt-Inhalt der SKILL.md-Datei
2. Startet automatisch den entsprechenden Server, wenn ein MCP definiert ist
3. Fügt den Skill-Prompt an den System-Prompt des Agenten an

Zum Beispiel enthält der `git-master` Skill:
- Commit-Stil-Erkennung (automatische Erkennung des Commit-Formats des Projekts)
- Atomare Commit-Regeln (3 Dateien → mindestens 2 Commits)
- Rebase-Workflow (squash, fixup, Konflikthandhabung)
| Verlaufssuche (blame, bisect, log -S)

### Sisyphus Junior: Aufgaben-Ausführer

Wenn Sie eine Kategorie verwenden, wird ein spezieller Unteragent erstellt – **Sisyphus Junior**.

**Schlüsseleigenschaften**:
- ✅ Erbt die Modellkonfiguration der Kategorie
- ✅ Erbt die Prompts der geladenen Skills
- ❌ **Kann nicht erneut delegieren** (Verwendung der Tools `task` und `delegate_task` ist verboten)

**Warum erneute Delegation verboten ist?**

Vermeidung von Endlosschleifen und Aufgabenabstieg:
```
Sisyphus (Haupt-Agent)
  ↓ delegate_task(category="quick")
Sisyphus Junior
  ↓ Versucht delegate_task (wenn erlaubt)
Sisyphus Junior 2
  ↓ delegate_task
...Endlosschleife...
```

Durch das Verbot erneuter Delegation konzentriert sich Sisyphus Junior auf die Erledigung der zugewiesenen Aufgaben, wodurch klare Ziele und effiziente Ausführung sichergestellt werden.

## Lernen Sie mit mir

### Schritt 1: Schnellbehebung (Quick + Git Master)

Lassen Sie uns ein praktisches Szenario verwenden: Sie haben einige Dateien geändert und möchten sie automatisch committen und dabei den Projektstil einhalten.

**Warum**
Verwendung des Haiku-Modells der `quick`-Kategorie ist günstig. In Kombination mit dem `git-master` Skill werden der Commit-Stil automatisch erkannt und perfekte Commits durchgeführt.

Geben Sie in OpenCode ein:

```
Verwenden Sie delegate_task, um die aktuellen Änderungen zu committen
- category: quick
- load_skills: ["git-master"]
- prompt: "Committen Sie alle aktuellen Änderungen. Befolgen Sie den Commit-Stil des Projekts (durch git log erkennen). Stellen Sie atomare Commits sicher, ein Commit enthält maximal 3 Dateien."
- run_in_background: false
```

**Was Sie sehen sollten**:

1. Sisyphus Junior startet und verwendet das `claude-haiku-4-5`-Modell
2. `git-master` Skill wird geladen, Prompt enthält Git-Experten-Wissen
3. Der Agent führt folgende Operationen aus:
   ```bash
   # Kontext parallel sammeln
   git status
   git diff --stat
   git log -30 --oneline
   ```
4. Commit-Stil wird erkannt (z. B. Semantic vs Plain vs Short)
5. Atomare Commits werden geplant (3 Dateien → mindestens 2 Commits)
6. Commits werden ausgeführt und erkannter Stil eingehalten

**Checkpoint ✅**:

Verifizieren Sie, ob der Commit erfolgreich war:
```bash
git log --oneline -5
```

Sie sollten mehrere atomare Commits sehen, jede mit klarer Nachrichten-Formatierung.

### Schritt 2: UI-Implementierung und -verifizierung (Visual + Playwright + UI/UX)

Szenario: Sie müssen einer Seite ein responsives Diagramm-Component hinzufügen und es im Browser verifizieren.

**Warum**
- `visual-engineering`-Kategorie wählt Gemini 3 Pro (gut bei visuellem Design)
- `playwright`-Skill stellt MCP-Tools für Browser-Tests bereit
- `frontend-ui-ux`-Skill injiziert Designer-Denken (Farbpalette, Typografie, Animation)

Geben Sie in OpenCode ein:

```
Verwenden Sie delegate_task, um das Diagramm-Component zu implementieren
- category: visual-engineering
- load_skills: ["frontend-ui-ux", "playwright"]
- prompt: "Fügen Sie auf der Dashboard-Seite ein responsives Diagramm-Component hinzu. Anforderungen:
  - Verwenden Sie Tailwind CSS
  - Unterstützen Sie Mobile und Desktop
  - Verwenden Sie eine lebendige Farbpalette (vermeiden Sie lila Verläufe)
  - Fügen Sie gestaffelte Animationseffekte hinzu
  - Verifizieren Sie nach Abschluss mit playwright-Screenshot"
- run_in_background: false
```

**Was Sie sehen sollten**:

1. Sisyphus Junior startet und verwendet das `google/gemini-3-pro`-Modell
2. Prompts von zwei Skills werden geladen:
   - `frontend-ui-ux`: Anleitung für Designer-Denken
   - `playwright`: Browser-Automatisierungsanweisungen
3. `@playwright/mcp`-Server wird automatisch gestartet
4. Der Agent führt aus:
   - Diagramm-Component entwerfen (Designer-Denken anwenden)
   - Responsives Layout implementieren
   - Animationseffekte hinzufügen
   - Playwright-Tools verwenden:
      ```
      playwright_navigate: http://localhost:3000/dashboard
      playwright_take_screenshot: output=dashboard-chart.png
      ```

**Checkpoint ✅**:

Verifizieren Sie, ob das Component korrekt gerendert wird:
```bash
# Neue Dateien prüfen
git diff --name-only
git diff --stat

# Screenshots anzeigen
ls screenshots/
```

Sie sollten sehen:
- Neue Diagramm-Component-Dateien
- Responsiver CSS-Code
- Screenshot-Dateien (Verifizierung bestanden)

### Schritt 3: Tiefgehende Architekturanalyse (Ultrabrain rein推理)

Szenario: Sie müssen ein komplexes Kommunikationsmuster für eine Microservice-Architektur entwerfen.

**Warum**
- `ultrabrain`-Kategorie wählt GPT-5.2 Codex (xhigh), bietet stärkste推理-Fähigkeit
- Keine Skills geladen → Rein推理, Vermeidung von Fachwissen-Interferenz

Geben Sie in OpenCode ein:

```
Verwenden Sie delegate_task, um die Architektur zu analysieren
- category: ultrabrain
- load_skills: []
- prompt: "Entwerfen Sie ein effizientes Kommunikationsmuster für unsere Microservice-Architektur. Anforderungen:
  - Unterstützen Sie Service Discovery
  - Handhaben Sie Netzwerkpartitionen
  - Minimieren Sie die Latenz
  - Bieten Sie eine Fallback-Strategie

  Aktuelle Architektur: [kurz beschreiben]
  Tech-Stack: gRPC, Kubernetes, Consul"
- run_in_background: false
```

**Was Sie sehen sollten**:

1. Sisyphus Junior startet und verwendet das `openai/gpt-5.2-codex`-Modell (xhigh-Variante)
2. Keine Skills geladen
3. Der Agent führt tiefgehendes推理durch:
   - Analyse der bestehenden Architektur
   - Vergleich von Kommunikationsmustern (z. B. CQRS, Event Sourcing, Saga)
   - Abwägen von Vor- und Nachteilen
   - Bereitstellung von schichtweisen Empfehlungen (Bottom Line → Action Plan → Risks)

**Ausgabestruktur**:

```
Bottom Line: Empfehlung für Hybrid-Muster (gRPC + Event Bus)

Action Plan:
1. Verwenden Sie gRPC für synchrone Kommunikation zwischen Services
2. Wichtige Ereignisse werden asynchron über Event Bus veröffentlicht
3. Implementieren Sie Idempotenz für doppelte Nachrichten

Risks and Mitigations:
- Risk: Netzwerkpartitionen führen zu Nachrichtenverlust
  Mitigation: Implementieren Sie Nachrichten-Wiederholung und Dead Letter Queue
```

**Checkpoint ✅**:

Verifizieren Sie, ob der Lösungsvorschlag umfassend ist:
- Wurde Service Discovery berücksichtigt?
- Wurden Netzwerkpartitionen behandelt?
- Wurde eine Fallback-Strategie bereitgestellt?

### Schritt 4: Kategorie anpassen (optional)

Wenn die integrierten Kategorien nicht Ihren Anforderungen entsprechen, können Sie sie in `oh-my-opencode.json` anpassen.

**Warum**
Einige Projekte benötigen spezifische Modellkonfigurationen (z. B. Korean Writer, Deep Reasoning).

Bearbeiten Sie `~/.config/opencode/oh-my-opencode.json`:

```jsonc
{
  "categories": {
    "korean-writer": {
      "model": "google/gemini-3-flash",
      "temperature": 0.5,
      "prompt_append": "You are a Korean technical writer. Maintain a friendly and clear tone."
    },
    
    "deep-reasoning": {
      "model": "anthropic/claude-opus-4-5",
      "thinking": {
        "type": "enabled",
        "budgetTokens": 32000
      },
      "tools": {
        "websearch_web_search_exa": false
      }
    }
  }
}
```

**Feldbeschreibung**:

| Feld | Typ | Beschreibung |
|---|---|---|
| `model` | string | Überschreibt das von der Kategorie verwendete Modell |
| `temperature` | number | Kreativitätsniveau (0-2) |
| `prompt_append` | string | An den System-Prompt anzufügender Inhalt |
| `thinking` | object | Thinking-Konfiguration (`{ type, budgetTokens }`) |
| `tools` | object | Tool-Berechtigungen deaktivieren (`{ toolName: false }`) |

**Checkpoint ✅**:

Verifizieren Sie, ob die angepasste Kategorie wirkt:
```bash
# Angepasste Kategorie verwenden
delegate_task(category="korean-writer", load_skills=[], prompt="...")
```

Sie sollten sehen, dass das System Ihr konfiguriertes Modell und Ihren Prompt verwendet.

## Häufige Fehler vermeiden

### Fehler 1: Quick-Kategorie Prompt nicht klar genug

**Problem**: Die `quick`-Kategorie verwendet das Haiku-Modell mit begrenzter推理-Fähigkeit. Wenn der Prompt zu vage ist, sind die Ergebnisse schlecht.

**Falsches Beispiel**:
```
delegate_task(category="quick", load_skills=["git-master"], prompt="Änderungen committen")
```

**Richtiger Ansatz**:
```
TASK: Committen Sie alle aktuellen Code-Änderungen

MUST DO:
1. Erkennen Sie den Commit-Stil des Projekts (durch git log -30)
2. Teilen Sie 8 Dateien nach Verzeichnissen in 3+ atomare Commits auf
3. Ein Commit enthält maximal 3 Dateien
4. Befolgen Sie den erkannten Stil (Semantic/Plain/Short)

MUST NOT DO:
- Zusammenführen von Dateien aus verschiedenen Verzeichnissen in einen Commit
- Commit-Planung überspringen und direkt ausführen

EXPECTED OUTPUT:
- Mehrere atomare Commits
- Jede Commit-Nachricht stimmt mit dem Projekt-Stil überein
- Befolgt die Abhängigkeitsreihenfolge (Typdefinitionen → Implementierung → Tests)
```

### Fehler 2: `load_skills` nicht angegeben

**Problem**: `load_skills` ist ein **erforderlicher Parameter**, ohne Angabe tritt ein Fehler auf.

**Falsch**:
```
delegate_task(category="quick", prompt="...")
```

**Fehlerausgabe**:
```
Error: Invalid arguments: 'load_skills' parameter is REQUIRED.
Pass [] if no skills needed, but IT IS HIGHLY RECOMMENDED to pass proper skills.
```

**Richtig**:
```
# Kein Skill benötigt, explizit leeres Array übergeben
delegate_task(category="unspecified-low", load_skills=[], prompt="...")
```

### Fehler 3: Kategorie und subagent_type gleichzeitig angegeben

**Problem**: Diese beiden Parameter schließen sich gegenseitig aus, sie können nicht gleichzeitig angegeben werden.

**Falsch**:
```
delegate_task(
  category="quick",
  subagent_type="oracle",  # ❌ Konflikt
  ...
)
```

**Richtig**:
```
# Kategorie verwenden (empfohlen)
delegate_task(category="quick", load_skills=[], prompt="...")

# Oder Agent direkt angeben
delegate_task(subagent_type="oracle", load_skills=[], prompt="...")
```

### Fehler 4: Git Master Multi-Commit-Regeln

**Problem**: Der `git-master` Skill fordert **mehrere Commits** stark, ein Commit mit 3+ Dateien schlägt fehl.

**Falsch**:
```
# Versuch, 1 Commit mit 8 Dateien
git commit -m "Update landing page"  # ❌ git-master wird ablehnen
```

**Richtig**:
```
# In mehrere Commits nach Verzeichnissen aufteilen
git add app/page.tsx app/layout.tsx
git commit -m "Add app layer"  # ✅ Commit 1

git add components/demo/*
git commit -m "Add demo components"  # ✅ Commit 2

git add e2e/*
git commit -m "Add tests"  # ✅ Commit 3
```

### Fehler 5: Playwright Skill MCP nicht installiert

**Problem**: Vor der Verwendung des `playwright`-Skills muss sichergestellt sein, dass der MCP-Server verfügbar ist.

**Falsch**:
```
delegate_task(category="visual-engineering", load_skills=["playwright"], prompt="Screenshot...")
```

**Richtig**:

Überprüfen Sie die MCP-Konfiguration (`~/.config/opencode/mcp.json` oder `.claude/.mcp.json`):

```jsonc
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

Wenn Playwright MCP nicht konfiguriert ist, startet der `playwright`-Skill es automatisch.

## Zusammenfassung

Das Kategorien- und Skills-System ermöglicht Ihnen die flexible Komposition von Agenten:

| Komponente | Funktion | Konfigurationsart |
|---|---|---|
| **Kategorie** | Bestimmt Modell und Denkmodus | `delegate_task(category="...")` oder Konfigurationsdatei |
| **Skill** | Injiziert Fachwissen und MCP | `delegate_task(load_skills=["..."])` oder SKILL.md-Datei |
| **Sisyphus Junior** | Führt Aufgaben aus, kann nicht erneut delegieren | Automatisch erstellt, keine manuelle Angabe erforderlich |

**Kompositionsstrategien**:
1. **UI-Aufgaben**: `visual-engineering` + `frontend-ui-ux` + `playwright`
2. **Schnellbehebung**: `quick` + `git-master`
3. **Tiefgehendes推理**: `ultrabrain` (ohne Skills)
4. **Dokumentation**: `writing` (ohne Skills)

**Best Practices**:
- ✅ Geben Sie immer `load_skills` an (auch bei leerem Array)
- ✅ Prompt der `quick`-Kategorie muss klar sein (Haiku-推理-Fähigkeit begrenzt)
- ✅ Git-Aufgaben immer mit `git-master`-Skill (automatische Stilerkennung)
- ✅ UI-Aufgaben immer mit `playwright`-Skill (Browser-Verifizierung)
- ✅ Wählen Sie basierend auf dem Aufgabentyp die passende Kategorie (nicht standardmäßig den Haupt-Agent verwenden)

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Integrierte Skills: Browser-Automatisierung, Git-Experte und UI-Designer](../builtin-skills/)**.
>
> Sie werden lernen:
> - Detaillierter Workflow des `playwright`-Skills
> - 3 Modi des `git-master`-Skills (Commit/Rebase/History Search)
> - Design-Philosophie des `frontend-ui-ux`-Skills
> - Wie Sie eigene Skills erstellen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-26

| Funktion | Dateipfad | Zeilennummer |
|---|---|---|
| delegate_task-Tool-Implementierung | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | Gesamtheit (1070 Zeilen) |
| resolveCategoryConfig-Funktion | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | 113-152 |
| buildSystemContent-Funktion | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | 176-188 |
| Standard-Kategorien-Konfiguration | [`src/tools/delegate-task/constants.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/constants.ts) | 158-166 |
| Kategorien-Prompt-Anhängungen | [`src/tools/delegate-task/constants.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/constants.ts) | 168-176 |
| Kategorien-Beschreibungen | [`src/tools/delegate-task/constants.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/constants.ts) | 178-186 |
| Kategorie-Konfiguration-Schema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 154-172 |
| Integrierte Skills-Definitionen | [`src/features/builtin-skills/`](https://github.com/code-yeongyu/oh-my-opencode/tree/main/src/features/builtin-skills) | Verzeichnisstruktur |
| git-master Skill-Prompt | [`src/features/builtin-skills/git-master/SKILL.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/git-master/SKILL.md) | Gesamtheit (1106 Zeilen) |

**Schlüsselkonstanten**:
- `SISYPHUS_JUNIOR_AGENT = "sisyphus-junior"`: Ausführender Agent für Kategorie-Delegation
- `DEFAULT_CATEGORIES`: Modellkonfiguration für 7 integrierte Kategorien
- `CATEGORY_PROMPT_APPENDS`: Prompt-Anhängungen für jede Kategorie
- `CATEGORY_DESCRIPTIONS`: Beschreibungen für jede Kategorie (angezeigt im delegate_task-Prompt)

**Schlüsselfunktionen**:
- `resolveCategoryConfig()`: Löst Kategorie-Konfiguration auf, verschmilzt Benutzer-Override mit Standardwerten
- `buildSystemContent()`: Verschmilzt Prompt-Inhalte von Skill und Kategorie
- `createDelegateTask()`: Erstellt delegate_task-Tool-Definition

**Integrierte Skill-Dateien**:
- `src/features/builtin-skills/frontend-ui-ux/SKILL.md`: Designer-Denken-Prompt
- `src/features/builtin-skills/git-master/SKILL.md`: Git-Experte vollständiger Workflow
- `src/features/builtin-skills/agent-browser/SKILL.md`: Vercel agent-browser-Konfiguration
- `src/features/builtin-skills/dev-browser/SKILL.md`: Browser-Automatisierungs-Referenzdokumentation

</details>

---
title: "v3.0: Kategorien & Fähigkeiten | oh-my-opencode"
sidebarTitle: "v3.0 Funktionen"
subtitle: "v3.0: Kategorien & Fähigkeiten"
description: "Erfahren Sie mehr über das neue Kategorien- und Fähigkeitensystem von oh-my-opencode v3.0. Meistern Sie 7 integrierte Kategorien, 3 Fähigkeitspakete und die dynamische Agentenzusammensetzung."
tags:
  - "v3.0"
  - "categories"
  - "skills"
  - "changelog"
order: 200
---

# v3.0 Funktionen: Umfassender Leitfaden zu Kategorien und Fähigkeiten

## Versionsübersicht

oh-my-opencode v3.0 ist ein bedeutendes Meilenstein-Release, das das brandneue **Kategorien- und Fähigkeitensystem** einführt und die Art und Weise revolutioniert, wie KI-Agenten orchestriert werden. Diese Version zielt darauf ab, KI-Agenten spezialisierter, flexibler und zusammensetzbarer zu machen.

**Wichtige Verbesserungen**:
- 🎯 **Kategoriesystem**: 7 integrierte Aufgabenkategorien mit automatischer Modellauswahl
- 🛠️ **Fähigkeitensystem**: 3 integrierte professionelle Fähigkeitspakete zur Injektion von Domänenwissen
- 🔄 **Dynamische Komposition**: Kombinieren Sie Kategorie und Fähigkeit frei über `delegate_task`
- 🚀 **Sisyphus-Junior**: Neuer Delegationsaufgaben-Ausführer, der Endlosschleifen verhindert
- 📝 **Flexible Konfiguration**: Unterstützung für benutzerdefinierte Kategorien und Fähigkeiten

---

## Kernfunktion 1: Kategoriesystem

### Was ist eine Kategorie?

Eine Kategorie ist eine **spezialisierte Agentenkonfigurationsvoreinstellung**, die für einen bestimmten Bereich optimiert ist. Sie beantwortet eine Schlüsselfrage: **"Welche Art von Arbeit ist dies?"**

Jede Kategorie definiert:
- **Zu verwendendes Modell** (model)
- **Temperaturparameter** (temperature)
- **Prompt-Mindset** (prompt mindset)
- **Reasoning-Fähigkeit** (reasoning effort)
- **Tool-Berechtigungen** (tools)

### 7 Integrierte Kategorien

| Kategorie | Standardmodell | Temperatur | Anwendungsfälle |
|----------|---------------|-------------|-----------|
| `visual-engineering` | `google/gemini-3-pro` | 0.7 | Frontend, UI/UX, Design, Styling, Animationen |
| `ultrabrain` | `openai/gpt-5.2-codex` (xhigh) | 0.1 | Tiefes logisches Denken, komplexe Architekturentscheidungen, die umfangreiche Analysen erfordern |
| `artistry` | `google/gemini-3-pro` (max) | 0.7 | Aufgaben mit hoher Kreativität/Kunst, neue Ideen |
| `quick` | `anthropic/claude-haiku-4-5` | 0.1 | Einfache Aufgaben - Einzeldateiänderung, Tippfehlerkorrekturen, einfache Änderungen |
| `unspecified-low` | `anthropic/claude-sonnet-4-5` | 0.1 | Aufgaben, die nicht in andere Kategorien passen, geringe Arbeitslast |
| `unspecified-high` | `anthropic/claude-opus-4-5` (max) | 0.1 | Aufgaben, die nicht in andere Kategorien passen, hohe Arbeitslast |
| `writing` | `google/gemini-3-flash` | 0.1 | Dokumentation, Essays, technisches Schreiben |

**Quelle**: `docs/category-skill-guide.md:22-30`

### Wie werden Kategorien verwendet?

Geben Sie beim Aufrufen des `delegate_task`-Tools den `category`-Parameter an:

```typescript
// Frontend-Aufgabe an visual-engineering-Kategorie delegieren
delegate_task(
  category="visual-engineering",
  prompt="Responsive Diagrammkomponente zur Dashboard-Seite hinzufügen"
)
```

Das System wird automatisch:
1. Die `visual-engineering`-Kategorie auswählen
2. Das `google/gemini-3-pro`-Modell verwenden
3. `temperature: 0.7` anwenden (hohe Kreativität)
4. Das Prompt-Mindset der Kategorie laden

### Sisyphus-Junior: Delegationsaufgaben-Ausführer

Wenn Sie eine Kategorie verwenden, führt ein spezieller Agent namens **Sisyphus-Junior** die Aufgabe aus.

**Hauptmerkmale**:
- ❌ **Kann Aufgaben nicht erneut delegieren** an andere Agenten
- 🎯 **Fokus auf zugewiesene Aufgaben**
- 🔄 **Verhindert Endlosschleifen bei Delegationen**

**Designzweck**: Stellt sicher, dass Agenten sich auf die aktuelle Aufgabe konzentrieren und Komplexität vermeiden, die durch schichtweise Aufgabendelegation entsteht.

---

## Kernfunktion 2: Fähigkeitensystem

### Was ist eine Fähigkeit?

Eine Fähigkeit ist ein Mechanismus, der **Domänenexpertise (Context)** und **Tools (MCP)** in einen Agenten injiziert. Sie beantwortet eine weitere Schlüsselfrage: **"Welche Tools und Kenntnisse werden benötigt?"**

### 3 Integrierte Fähigkeiten

#### 1. `git-master`

**Fähigkeiten**:
- Git-Experte
- Commit-Stil erkennen
- Atomare Commits aufteilen
- Rebase-Strategien erstellen

**MCP**: Keine (verwendet Git-Befehle)

**Anwendungsfälle**: Commits, Historiensuche, Branch-Management

#### 2. `playwright`

**Fähigkeiten**:
- Browser-Automatisierung
- Web-Testing
- Screenshots
- Data Scraping

**MCP**: `@playwright/mcp` (automatisch ausgeführt)

**Anwendungsfälle**: UI-Validierung nach Implementierung, E2E-Test-Erstellung

#### 3. `frontend-ui-ux`

**Fähigkeiten**:
- Designer-Mindset injizieren
- Richtlinien für Farbe, Typografie, Bewegung

**Anwendungsfälle**: Schöne UI-Arbeit über einfache Implementierung hinaus

**Quelle**: `docs/category-skill-guide.md:57-70`

### Wie werden Fähigkeiten verwendet?

Fügen Sie ein `load_skills`-Array in `delegate_task` hinzu:

```typescript
// Schnelle Aufgabe delegieren und git-master-Fähigkeit laden
delegate_task(
  category="quick",
  load_skills=["git-master"],
  prompt="Aktuelle Änderungen committen. Commit-Nachrichten-Stil befolgen."
)
```

Das System wird automatisch:
1. Die `quick`-Kategorie auswählen (Claude Haiku, geringe Kosten)
2. Die `git-master`-Fähigkeit laden (Git-Expertise injizieren)
3. Sisyphus-Junior starten, um die Aufgabe auszuführen

### Benutzerdefinierte Fähigkeiten

Sie können benutzerdefinierte Fähigkeiten direkt in `.opencode/skills/` im Projektstammverzeichnis oder in `~/.claude/skills/` im Benutzerverzeichnis hinzufügen.

**Beispiel: `.opencode/skills/my-skill/SKILL.md`**

```markdown
---
name: my-skill
description: Meine professionelle benutzerdefinierte Fähigkeit
mcp:
  my-mcp:
    command: npx
    args: ["-y", "my-mcp-server"]
---

# Mein Fähigkeiten-Prompt

Dieser Inhalt wird in den System-Prompt des Agenten injiziert.
...
```

**Quelle**: `docs/category-skill-guide.md:87-103`

---

## Kernfunktion 3: Dynamische Komposition

### Kompositionsstrategie: Spezialisierte Agenten erstellen

Durch die Kombination verschiedener Kategorien und Fähigkeiten können Sie leistungsstarke spezialisierte Agenten erstellen.

#### 🎨 Designer (UI-Implementierung)

- **Kategorie**: `visual-engineering`
- **load_skills**: `["frontend-ui-ux", "playwright"]`
- **Effekt**: Schöne UI implementieren und Rendering-Ergebnisse direkt im Browser validieren

#### 🏗️ Architekt (Design-Review)

- **Kategorie**: `ultrabrain`
- **load_skills**: `[]` (reines Denken)
- **Effekt**: Logische Denkfähigkeit von GPT-5.2 für tiefgehende Systemarchitekturanalyse nutzen

#### ⚡ Maintainer (Schnelle Korrekturen)

- **Kategorie**: `quick`
- **load_skills**: `["git-master"]`
- **Effekt**: Code schnell mit kostengünstigem Modell korrigieren und saubere Commits erstellen

**Quelle**: `docs/category-skill-guide.md:111-124`

### delegate_task Prompt-Leitfaden

Bei der Delegation von Aufgaben sind **klare und spezifische** Prompts entscheidend. Fügen Sie die folgenden 7 Elemente ein:

1. **TASK**: Was muss getan werden? (einzelnes Ziel)
2. **EXPECTED OUTCOME**: Was ist das Ergebnis?
3. **REQUIRED SKILLS**: Welche Fähigkeiten sollten über `load_skills` geladen werden?
4. **REQUIRED TOOLS**: Welche Tools müssen verwendet werden? (Whitelist)
5. **MUST DO**: Was muss getan werden (Einschränkungen)
6. **MUST NOT DO**: Was darf niemals getan werden
7. **CONTEXT**: Dateipfade, vorhandene Muster, Referenzmaterialien

**❌ Schlechtes Beispiel**:
> "Fix this"

**✅ Gutes Beispiel**:
> **TASK**: Mobile Layout-Problem in `LoginButton.tsx` beheben
> **CONTEXT**: `src/components/LoginButton.tsx`, verwendet Tailwind CSS
> **MUST DO**: flex-direction bei `md:`-Breakpoint ändern
> **MUST NOT DO**: Vorhandenes Desktop-Layout ändern
> **EXPECTED**: Button richtet sich auf Mobilgeräten vertikal aus

**Quelle**: `docs/category-skill-guide.md:130-148`

---

## Konfigurationsleitfaden

### Kategorie-Konfigurationsschema

Sie können Kategorien in `oh-my-opencode.json` feinabstimmen.

| Feld | Typ | Beschreibung |
|-------|------|-------------|
| `description` | string | Menschenlesbare Beschreibung des Kategoriezwecks. Wird in delegate_task-Prompts angezeigt. |
| `model` | string | Zu verwendende KI-Modell-ID (z. B. `anthropic/claude-opus-4-5`) |
| `variant` | string | Modellvariante (z. B. `max`, `xhigh`) |
| `temperature` | number | Kreativitätsstufe (0.0 ~ 2.0). Niedriger ist deterministischer. |
| `top_p` | number | Nucleus-Sampling-Parameter (0.0 ~ 1.0) |
| `prompt_append` | string | Inhalt, der an den System-Prompt angehängt wird, wenn diese Kategorie ausgewählt wird |
| `thinking` | object | Thinking-Modell-Konfiguration (`{ type: "enabled", budgetTokens: 16000 }`) |
| `reasoningEffort` | string | Reasoning-Aufwandsstufe (`low`, `medium`, `high`) |
| `textVerbosity` | string | Text-Verbosität (`low`, `medium`, `high`) |
| `tools` | object | Tool-Verwendungskontrolle (verwenden Sie `{ "tool_name": false }` zum Deaktivieren) |
| `maxTokens` | number | Maximale Antwort-Tokens |
| `is_unstable_agent` | boolean | Agent als instabil markieren - Hintergrundmodus zur Überwachung erzwingen |

**Quelle**: `docs/category-skill-guide.md:159-172`

### Konfigurationsbeispiel

```jsonc
{
  "categories": {
    // 1. Neue benutzerdefinierte Kategorie definieren
    "korean-writer": {
      "model": "google/gemini-3-flash",
      "temperature": 0.5,
      "prompt_append": "Sie sind ein koreanischer technischer Autor. Halten Sie einen freundlichen und klaren Ton."
    },

    // 2. Vorhandene Kategorie überschreiben (Modell ändern)
    "visual-engineering": {
      "model": "openai/gpt-5.2",
      "temperature": 0.8
    },

    // 3. Thinking-Modell konfigurieren und Tools einschränken
    "deep-reasoning": {
      "model": "anthropic/claude-opus-4-5",
      "thinking": {
        "type": "enabled",
        "budgetTokens": 32000
      },
      "tools": {
        "websearch_web_search_exa": false // Websuche deaktivieren
      }
    }
  },

  // Fähigkeiten deaktivieren
  "disabled_skills": ["playwright"]
}
```

**Quelle**: `docs/category-skill-guide.md:175-206`

---

## Weitere wichtige Verbesserungen

Zusätzlich zum Kategorien- und Fähigkeitensystem enthält v3.0 die folgenden wichtigen Verbesserungen:

### Stabilitätsverbesserungen
- ✅ Version als stabil markiert (3.0.1)
- ✅ Optimierter Agenten-Delegationsmechanismus
- ✅ Verbesserte Fehlerwiederherstellungsfähigkeit

### Leistungsoptimierungen
- ✅ Reduzierte unnötige Kontextinjektion
- ✅ Optimierter Hintergrundaufgaben-Polling-Mechanismus
- ✅ Verbesserte Effizienz der Multi-Modell-Orchestrierung

### Claude Code-Kompatibilität
- ✅ Vollständig kompatibel mit Claude Code-Konfigurationsformat
- ✅ Unterstützt Laden von Claude Code-Fähigkeiten, Befehlen, MCPs
- ✅ Auto-Discovery und Konfiguration

**Quelle**: `README.md:18-20`, `README.md:292-304`

---

## Nächste Schritte

Das Kategorien- und Fähigkeitensystem in v3.0 legt eine flexible Grundlage für die Erweiterung von oh-my-opencode. Wenn Sie tiefer in die Verwendung dieser neuen Funktionen eintauchen möchten, lesen Sie die folgenden Abschnitte:

- [Kategorien und Fähigkeiten: Dynamische Agentenzusammensetzung](/de/code-yeongyu/oh-my-opencode/advanced/categories-skills/) - Detaillierter Anwendungsleitfaden
- [Integrierte Fähigkeiten: Browser-Automatisierung und Git-Experte](/de/code-yeongyu/oh-my-opencode/advanced/builtin-skills/) - Tiefgehende Fähigkeitsanalyse
- [Erweiterte Konfiguration: Agenten- und Berechtigungsverwaltung](/de/code-yeongyu/oh-my-opencode/advanced/advanced-configuration/) - Leitfaden zur benutzerdefinierten Konfiguration

Beginnen Sie mit der Erkundung dieser neuen Funktionen und machen Sie Ihre KI-Agenten spezialisierter und effizienter!

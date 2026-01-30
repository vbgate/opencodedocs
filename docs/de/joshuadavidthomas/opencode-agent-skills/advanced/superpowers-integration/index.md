---
title: "Superpowers-Integration: Workflow-Konfiguration | opencode-agent-skills"
subtitle: "Superpowers-Integration: Workflow-Konfiguration | opencode-agent-skills"
sidebarTitle: "Superpowers aktivieren"
description: "Lernen Sie die Installations- und Konfigurationsmethoden des Superpowers-Modus. Aktivieren Sie Workflow-Anleitungen durch Umgebungsvariablen und beherrschen Sie Tool-Mapping und Namespace-Prioritätsregeln."
tags:
  - "Erweiterte Konfiguration"
  - "Workflow"
  - "Superpowers"
prerequisite:
  - "start-installation"
order: 2
---

# Superpowers-Workflow-Integration

## Was Sie nach Abschluss können

- Den Wert und Anwendungsbereich des Superpowers-Workflows verstehen
- Das Superpowers-Modus korrekt installieren und konfigurieren
- Das Tool-Mapping- und Skill-Namespace-System verstehen
- Die automatische Injektionsmechanismen von Superpowers bei der Komprimierungswiederherstellung beherrschen

## Ihr aktuelles Problem

Sie stehen möglicherweise vor folgenden Fragen:

- **Workflow nicht standardisiert**: Die Entwicklungsgewohnheiten des Teams sind nicht einheitlich, die Codequalität variiert
- **Fehlender strikter Prozess**: Obwohl eine Skill-Bibliothek existiert, hat der KI-Assistent keine klare Prozessanleitung
- **Verwirrte Tool-Aufrufe**: Die von Superpowers definierten Tools haben andere Namen als die nativen Tools von OpenCode, was zu Aufruffehlern führt
- **Hohe Migrationskosten**: Superpowers wird bereits verwendet, man befürchtet, dass nach dem Wechsel zu OpenCode eine Neukonfiguration erforderlich ist

Diese Probleme beeinflussen die Entwicklungseffizienz und die Codequalität.

## Kernkonzept

::: info Was ist Superpowers?
Superpowers ist ein vollständiges Softwareentwicklungs-Workflow-Framework, das durch kompositionale Skills strikte Workflow-Anleitungen bereitstellt. Es definiert standardisierte Entwicklungsschritte, Tool-Aufrufmethoden und ein Namespace-System.
:::

**OpenCode Agent Skills bietet eine nahtlose Superpowers-Integration**, die nach Aktivierung durch Umgebungsvariablen automatisch vollständige Workflow-Anleitungen injiziert, einschließlich:

1. **Inhalt des using-superpowers Skills**: Kern-Workflow-Anweisungen von Superpowers
2. **Tool-Mapping**: Mapping der von Superpowers definierten Tool-Namen auf native OpenCode-Tools
3. **Skill-Namespace**: Klare Priorität und Referenzmethode für Skills

## 🎒 Vorbereitung

Bevor Sie beginnen, stellen Sie sicher:

::: warning Vorabprüfung
- ✅ [opencode-agent-skills Plugin installiert](../../start/installation/)
- ✅ Verständnis des grundlegenden Skill-Entdeckungsmechanismus
:::

## Machen Sie mit

### Schritt 1: Superpowers installieren

**Warum**
Sie müssen zuerst das Superpowers-Projekt installieren, damit dieses Plugin den `using-superpowers` Skill entdecken kann.

**Vorgehensweise**

Wählen Sie je nach Bedarf eine der folgenden Methoden zur Installation von Superpowers:

::: code-group

```bash [Als Claude Code Plugin]
// Installieren Sie gemäß der offiziellen Superpowers-Dokumentation
// https://github.com/obra/superpowers
// Der Skill befindet sich automatisch unter ~/.claude/plugins/...
```

```bash [Als OpenCode Skill]
// Manuelle Installation als OpenCode Skill
mkdir -p ~/.config/opencode/skills
git clone https://github.com/obra/superpowers ~/.config/opencode/skills/superpowers
// Der Skill befindet sich unter .opencode/skills/superpowers/ (Projektebene) oder ~/.config/opencode/skills/superpowers/ (Benutzerebene)
```

:::

**Was Sie sehen sollten**:
- Nach der Installation enthält das Superpowers-Skill-Verzeichnis die Datei `using-superpowers/SKILL.md`

### Schritt 2: Superpowers-Modus aktivieren

**Warum**
Teilen Sie dem Plugin durch eine Umgebungsvariable mit, dass es den Superpowers-Modus aktivieren soll. Das Plugin injiziert dann automatisch relevante Inhalte bei der Initialisierung der Sitzung.

**Vorgehensweise**

Vorübergehende Aktivierung (nur aktuelle Terminalsitzung):

```bash
export OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true
opencode
```

Permanente Aktivierung (zur Shell-Konfigurationsdatei hinzufügen):

::: code-group

```bash [Bash (~/.bashrc oder ~/.bash_profile)]
echo 'export OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true' >> ~/.bashrc
source ~/.bashrc
```

```zsh [Zsh (~/.zshrc)]
echo 'export OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true' >> ~/.zshrc
source ~/.zshrc
```

```powershell [PowerShell (~/.config/powershell/Microsoft.PowerShell_profile.ps1)]
[System.Environment]::SetEnvironmentVariable('OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE', 'true', 'User')
```

:::

**Was Sie sehen sollten**:
- Die Eingabe `echo $OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE` zeigt `true`

### Schritt 3: Automatische Injektion überprüfen

**Warum**
Bestätigen Sie, dass das Plugin den Superpowers-Skill korrekt erkennt und bei Beginn einer neuen Sitzung automatisch Inhalte injiziert.

**Vorgehensweise**

1. Starten Sie OpenCode neu
2. Erstellen Sie eine neue Sitzung
3. Geben Sie in der neuen Sitzung eine beliebige Nachricht ein (z.B. "Hallo")
4. Überprüfen Sie den Sitzungskontext (falls von OpenCode unterstützt)

**Was Sie sehen sollten**:
- Das Plugin injiziert automatisch folgende Inhalte im Hintergrund (als XML formatiert):

```xml
<EXTREMELY_IMPORTANT>
You have superpowers.

**IMPORTANT: The using-superpowers skill content is included below. It is ALREADY LOADED - do not call use_skill for it again. Use use_skill only for OTHER skills.**

[Aktueller Inhalt des using-superpowers Skills...]

**Tool Mapping for OpenCode:**
- `TodoWrite` → `todowrite`
- `Task` tool with subagents → Use `task` tool with `subagent_type`
- `Skill` tool → `use_skill`
- `Read`, `Write`, `Edit`, `Bash`, `Glob`, `Grep`, `WebFetch` → Use native lowercase OpenCode tools

**Skill namespace priority:**
1. Project: `project:skill-name`
2. Claude project: `claude-project:skill-name`
3. User: `skill-name`
4. Claude user: `claude-user:skill-name`
5. Marketplace: `claude-plugins:skill-name`

The first discovered match wins.
</EXTREMELY_IMPORTANT>
```

## Checkpoint ✅

Nach Abschluss der oben genannten Schritte überprüfen Sie folgende Punkte:

| Prüfpunkt | Erwartetes Ergebnis |
|--- | ---|
| Umgebungsvariable korrekt eingestellt | `echo $OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE` gibt `true` aus |
| Superpowers-Skill entdeckbar | Aufruf von `get_available_skills()` zeigt `using-superpowers` |
| Automatische Injektion bei neuer Sitzung | Nach Erstellung einer neuen Sitzung weiß die KI, dass sie Superpowers hat |

## Häufige Fehler

### ❌ Fehler 1: Skill nicht entdeckt

**Erscheinung**: Die Umgebungsvariable ist aktiviert, aber das Plugin injiziert keine Superpowers-Inhalte.

**Ursache**: Der Installationsort von Superpowers befindet sich nicht im Skill-Entdeckungspfad.

**Lösung**:
- Bestätigen Sie, dass Superpowers an einem der folgenden Orte installiert ist:
  - `.claude/plugins/...` (Claude Code Plugin-Cache)
  - `.opencode/skills/...` (OpenCode-Skill-Verzeichnis)
  - `~/.config/opencode/skills/...` (OpenCode-Benutzer-Skills)
  - `~/.claude/skills/...` (Claude-Benutzer-Skills)
- Führen Sie `get_available_skills()` aus, um zu überprüfen, ob `using-superpowers` in der Liste ist

### ❌ Fehler 2: Tool-Aufruf fehlgeschlagen

**Erscheinung**: Die KI versucht, die Tools `TodoWrite` oder `Skill` aufzurufen, es wird jedoch gemeldet, dass das Tool nicht existiert.

**Ursache**: Die KI hat das Tool-Mapping nicht angewendet und verwendet weiterhin die von Superpowers definierten Namen.

**Lösung**:
- Das Plugin injiziert automatisch das Tool-Mapping, stellen Sie sicher, dass das `<EXTREMELY_IMPORTANT>`-Tag korrekt injiziert wird
- Wenn das Problem weiterhin besteht, überprüfen Sie, ob die Sitzung nach der Aktivierung der Umgebungsvariable erstellt wurde

### ❌ Fehler 3: Superpowers verschwindet nach Komprimierung

**Erscheinung**: Nach langen Sitzungen befolgt die KI den Superpowers-Workflow nicht mehr.

**Ursache**: Die Kontextkomprimierung hat dazu geführt, dass die zuvor injizierten Inhalte bereinigt wurden.

**Lösung**:
- Das Plugin injiziert die Superpowers-Inhalte automatisch neu nach dem `session.compacted`-Ereignis
- Wenn das Problem weiterhin besteht, überprüfen Sie, ob das Plugin die Ereignisse ordnungsgemäß überwacht

## Detailliertes Tool-Mapping

Das Plugin injiziert automatisch folgendes Tool-Mapping, damit die KI die OpenCode-Tools korrekt aufrufen kann:

| Superpowers-Tool | OpenCode-Tool | Beschreibung |
|--- | --- | ---|
| `TodoWrite` | `todowrite` | Todo-Schreibtool |
| `Task` (mit subagents) | `task` + `subagent_type` | Sub-Agenten-Aufruf |
| `Skill` | `use_skill` | Skill laden |
| `Read` / `Write` / `Edit` | Native Kleinschreib-Tools | Dateioperationen |
| `Bash` / `Glob` / `Grep` / `WebFetch` | Native Kleinschreib-Tools | Systemoperationen |

::: tip Warum ist Tool-Mapping erforderlich?
Das native Design von Superpowers basiert auf Claude Code, die Tool-Namen stimmen nicht mit OpenCode überein. Durch das automatische Mapping kann die KI die nativen OpenCode-Tools nahtlos verwenden, ohne manuelle Konvertierung.
:::

## Skill-Namespace-Priorität

Wenn Skills mit demselben Namen aus mehreren Quellen existieren, wählt das Plugin in folgender Priorität:

```
1. project:skill-name         (Projektebene OpenCode-Skill)
2. claude-project:skill-name  (Projektebene Claude-Skill)
3. skill-name                (Benutzerebene OpenCode-Skill)
4. claude-user:skill-name    (Benutzerebene Claude-Skill)
5. claude-plugins:skill-name (Plugin-Marktplatz-Skill)
```

::: info Namespace-Referenzierung
Sie können den Namespace explizit angeben: `use_skill("project:my-skill")`  
Oder das Plugin automatisch matching lassen: `use_skill("my-skill")`
:::

**Die erste gefundene Übereinstimmung gilt**, nachfolgende gleichnamige Skills werden ignoriert. Dies ermöglicht, dass Skills auf Projektebene Skills auf Benutzerebene überschreiben.

## Komprimierungswiederhermechanismus

In langen Sitzungen führt OpenCode eine Kontextkomprimierung durch, um Tokens zu sparen. Das Plugin stellt durch folgenden Mechanismus sicher, dass Superpowers kontinuierlich verfügbar bleibt:

1. **Ereignisüberwachung**: Das Plugin überwacht das `session.compacted`-Ereignis
2. **Neuinjektion**: Nach Abschluss der Komprimierung werden die Superpowers-Inhalte automatisch neu injiziert
3. **Unmerklicher Übergang**: Die Workflow-Anleitung der KI ist immer vorhanden und wird durch die Komprimierung nicht unterbrochen

## Zusammenfassung dieser Lektion

Die Superpowers-Integration bietet strikte Workflow-Anleitungen, die Kernpunkte sind:

- **Superpowers installieren**: Wählen Sie entweder Claude Code Plugin oder OpenCode Skill
- **Umgebungsvariable aktivieren**: Setzen Sie `OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true`
- **Automatische Injektion**: Das Plugin injiziert Inhalte automatisch bei der Sitzungsinitialisierung und nach der Komprimierung
- **Tool-Mapping**: Mapping der Superpowers-Tool-Namen auf native OpenCode-Tools
- **Namespace-Priorität**: Skills auf Projektebene haben Vorrang vor Skills auf Benutzerebene

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Namespaces und Skill-Priorität](../namespaces-and-priority/)**.
>
> Sie werden lernen:
> - Das Namespace-System für Skills und die Regeln für die Entdeckungspriorität verstehen
> - Beherrschen, wie Sie Namespaces verwenden, um die Quelle eines Skills explizit anzugeben
> - Die Überschreibungs- und Konfliktlösungsmechanismen für gleichnamige Skills verstehen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Erweitern der Quellcode-Positionen</strong></summary>

> Aktualisierungsdatum: 2026-01-24

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
| Superpowers-Integrationsmodul | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L1-L59) | 1-59 |
| Tool-Mapping-Definition | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L12-L16) | 12-16 |
| Skill-Namespace-Definition | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L18-L25) | 18-25 |
| Superpowers-Inhaltsinjektionsfunktion | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L31-L58) | 31-58 |
| Umgebungsvariablenprüfung | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L37) | 37 |
| Sitzungsinitialisierungs-Injektionsaufruf | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L101) | 101 |
| Neuinjektion nach Komprimierung | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L148) | 148 |

**Wichtige Konstanten**:
- `OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE`: Umgebungsvariable, auf `'true'` gesetzt, um den Superpowers-Modus zu aktivieren

**Wichtige Funktionen**:
- `maybeInjectSuperpowersBootstrap()`: Prüft die Umgebungsvariable und die Skill-Existenz, injiziert Superpowers-Inhalte
- `discoverAllSkills()`: Entdeckt alle verfügbaren Skills (zum Suchen von `using-superpowers`)
- `injectSyntheticContent()`: Injiziert Inhalte als synthetische Nachricht in die Sitzung

</details>

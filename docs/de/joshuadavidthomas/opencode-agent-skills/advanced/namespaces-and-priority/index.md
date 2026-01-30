---
title: "Namespaces: Skill-Priorität | opencode-agent-skills"
sidebarTitle: "Skill-Konflikte lösen"
subtitle: "Namespaces: Skill-Priorität | opencode-agent-skills"
description: "Lernen Sie das Namespace-System und die Prioritätsregeln für die Skill-Erkennung. Beherrschen Sie 5 Labels, 6 Prioritätsstufen und nutzen Sie Namespaces zur Unterscheidung gleichnamiger Skills."
tags:
  - "Fortgeschritten"
  - "Namespaces"
  - "Skill-Verwaltung"
prerequisite:
  - "start-what-is-opencode-agent-skills"
  - "platforms-skill-discovery-mechanism"
  - "platforms-listing-available-skills"
order: 3
---

# Namespaces und Skill-Priorität

## Was Sie lernen werden

- Das Namespace-System für Skills verstehen und gleichnamige Skills aus verschiedenen Quellen unterscheiden
- Die Prioritätsregeln der Skill-Erkennung beherrschen und vorhersagen, welcher Skill geladen wird
- Namespace-Präfixe verwenden, um die Skill-Quelle präzise anzugeben
- Konflikte bei gleichnamigen Skills lösen

## Ihre aktuelle Herausforderung

Mit wachsender Anzahl von Skills stoßen Sie möglicherweise auf folgende Probleme:

- **Konflikte bei gleichnamigen Skills**: Sowohl im Projektverzeichnis als auch im Benutzerverzeichnis gibt es einen Skill namens `git-helper` – unklar, welcher geladen wird
- **Unklare Skill-Herkunft**: Unsicherheit darüber, welche Skills aus dem Projekt stammen und welche aus dem Benutzerverzeichnis oder Plugin-Cache
- **Unverständliches Überschreibungsverhalten**: Änderungen am Benutzer-Skill werden nicht wirksam, weil ein Projekt-Skill sie überschreibt
- **Fehlende präzise Kontrolle**: Sie möchten einen Skill aus einer bestimmten Quelle erzwingen, wissen aber nicht wie

Diese Probleme entstehen durch mangelndes Verständnis des Namespace-Systems und der Prioritätsregeln.

## Kernkonzept

**Namespaces** sind der Mechanismus, mit dem OpenCode Agent Skills gleichnamige Skills aus verschiedenen Quellen unterscheidet. Jeder Skill hat ein Label, das seine Herkunft kennzeichnet – diese Labels bilden den Namespace des Skills.

::: info Warum brauchen wir Namespaces?

Stellen Sie sich vor, Sie haben zwei gleichnamige Skills:
- Projekt-Ebene `.opencode/skills/git-helper/` (projektspezifisch angepasst)
- Benutzer-Ebene `~/.config/opencode/skills/git-helper/` (allgemeine Version)

Ohne Namespaces wüsste das System nicht, welchen es verwenden soll. Mit Namespaces können Sie explizit angeben:
- `project:git-helper` - Projekt-Version erzwingen
- `user:git-helper` - Benutzer-Version erzwingen
:::

**Prioritätsregeln** stellen sicher, dass das System bei fehlendem Namespace eine sinnvolle Wahl trifft. Projekt-Skills haben Vorrang vor Benutzer-Skills, sodass Sie projektspezifisches Verhalten anpassen können, ohne die globale Konfiguration zu beeinflussen.

## Skill-Quellen und Labels

OpenCode Agent Skills unterstützt mehrere Skill-Quellen, jede mit einem entsprechenden Label:

| Quelle | Label | Pfad | Beschreibung |
| --- | --- | --- | --- |
| **OpenCode Projekt-Ebene** | `project` | `.opencode/skills/` | Skills exklusiv für das aktuelle Projekt |
| **Claude Projekt-Ebene** | `claude-project` | `.claude/skills/` | Claude Code-kompatible Projekt-Skills |
| **OpenCode Benutzer-Ebene** | `user` | `~/.config/opencode/skills/` | Allgemeine Skills für alle Projekte |
| **Claude Benutzer-Ebene** | `claude-user` | `~/.claude/skills/` | Claude Code-kompatible Benutzer-Skills |
| **Claude Plugin-Cache** | `claude-plugins` | `~/.claude/plugins/cache/` | Installierte Claude-Plugins |
| **Claude Plugin-Marktplatz** | `claude-plugins` | `~/.claude/plugins/marketplaces/` | Vom Marktplatz installierte Claude-Plugins |

::: tip Praktische Empfehlungen
- Projektspezifische Konfiguration: In `.opencode/skills/` ablegen
- Allgemeine Tool-Skills: In `~/.config/opencode/skills/` ablegen
- Migration von Claude Code: Keine Verschiebung nötig, das System erkennt sie automatisch
:::

## Priorität der Skill-Erkennung

Bei der Skill-Erkennung durchsucht das System die Speicherorte in folgender Reihenfolge:

```
1. .opencode/skills/              (project)        ← Höchste Priorität
2. .claude/skills/                (claude-project)
3. ~/.config/opencode/skills/     (user)
4. ~/.claude/skills/              (claude-user)
5. ~/.claude/plugins/cache/       (claude-plugins)
6. ~/.claude/plugins/marketplaces/ (claude-plugins)  ← Niedrigste Priorität
```

**Wichtige Regeln**:
- **Erster Treffer gewinnt**: Der zuerst gefundene Skill wird beibehalten
- **Deduplizierung gleichnamiger Skills**: Nachfolgende gleichnamige Skills werden ignoriert (mit Warnung)
- **Projekt-Priorität**: Projekt-Skills überschreiben Benutzer-Skills

### Prioritätsbeispiel

Angenommen, Sie haben folgende Skill-Verteilung:

```
Projektverzeichnis:
.opencode/skills/
  └── git-helper/              ← Version A (projektspezifisch)

Benutzerverzeichnis:
~/.config/opencode/skills/
  └── git-helper/              ← Version B (allgemein)

Plugin-Cache:
~/.claude/plugins/cache/xxx/skills/
  └── git-helper/              ← Version C (Claude-Plugin)
```

Ergebnis: Das System lädt **Version A** (`project:git-helper`), die beiden anderen gleichnamigen Skills werden ignoriert.

## Skills mit Namespaces angeben

Beim Aufruf von `use_skill` oder anderen Tools können Sie Namespace-Präfixe verwenden, um die Skill-Quelle präzise anzugeben.

### Syntax

```
namespace:skill-name
```

oder

```
skill-name  # Ohne Namespace, Standard-Priorität wird verwendet
```

### Namespace-Liste

```
project:skill-name         # OpenCode Projekt-Skill
claude-project:skill-name  # Claude Projekt-Skill
user:skill-name            # OpenCode Benutzer-Skill
claude-user:skill-name     # Claude Benutzer-Skill
claude-plugins:skill-name  # Claude Plugin-Skill
```

### Anwendungsbeispiele

**Szenario 1: Standard-Laden (nach Priorität)**

```
use_skill("git-helper")
```

- Das System sucht nach Priorität und lädt den ersten Treffer
- Also `project:git-helper` (falls vorhanden)

**Szenario 2: Benutzer-Skill erzwingen**

```
use_skill("user:git-helper")
```

- Umgeht die Prioritätsregeln und lädt direkt den Benutzer-Skill
- Auch wenn der Benutzer-Skill vom Projekt-Skill überschrieben wird, bleibt er zugänglich

**Szenario 3: Claude Plugin-Skill laden**

```
use_skill("claude-plugins:git-helper")
```

- Lädt explizit einen Skill aus einem Claude-Plugin
- Geeignet für Szenarien, die spezifische Plugin-Funktionalität erfordern

## Namespace-Matching-Logik

Bei Verwendung des Formats `namespace:skill-name` funktioniert die Matching-Logik wie folgt:

1. **Eingabe parsen**: Namespace und Skill-Name trennen
2. **Alle Skills durchlaufen**: Nach passendem Skill suchen
3. **Matching-Bedingungen**:
   - Skill-Name stimmt überein
   - Das `label`-Feld des Skills entspricht dem angegebenen Namespace
   - Oder das benutzerdefinierte `namespace`-Feld des Skills entspricht dem angegebenen Namespace
4. **Ergebnis zurückgeben**: Der erste Skill, der die Bedingungen erfüllt

::: details Quellcode der Matching-Logik

```typescript
export function resolveSkill(
  skillName: string,
  skillsByName: Map<string, Skill>
): Skill | null {
  if (skillName.includes(':')) {
    const [namespace, name] = skillName.split(':');
    for (const skill of skillsByName.values()) {
      if (skill.name === name &&
          (skill.label === namespace || skill.namespace === namespace)) {
        return skill;
      }
    }
    return null;
  }
  return skillsByName.get(skillName) || null;
}
```

:::

## Namespaces im Superpowers-Modus

Wenn Sie den Superpowers-Modus aktivieren, injiziert das System bei der Session-Initialisierung eine Erklärung der Namespace-Prioritäten:

```markdown
**Skill namespace priority:**
1. Project: `project:skill-name`
2. Claude project: `claude-project:skill-name`
3. User: `skill-name`
4. Claude user: `claude-user:skill-name`
5. Marketplace: `claude-plugins:skill-name`

The first discovered match wins.
```

Dies stellt sicher, dass die KI bei der Skill-Auswahl die korrekten Prioritätsregeln befolgt.

::: tip So aktivieren Sie den Superpowers-Modus

Setzen Sie die Umgebungsvariable:

```bash
OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true opencode
```

:::

## Häufige Anwendungsfälle

### Szenario 1: Projektanpassung überschreibt allgemeinen Skill

**Anforderung**: Ihr Projekt benötigt einen speziellen Git-Workflow, aber auf Benutzer-Ebene existiert bereits ein allgemeiner `git-helper`-Skill.

**Lösung**:
1. Erstellen Sie `.opencode/skills/git-helper/` im Projektverzeichnis
2. Konfigurieren Sie den projektspezifischen Git-Workflow
3. Der Standard-Aufruf `use_skill("git-helper")` verwendet automatisch die Projekt-Version

**Überprüfung**:

```bash
## Skill-Liste anzeigen, auf Labels achten
get_available_skills("git-helper")
```

Beispielausgabe:
```
git-helper (project)
  Project-specific Git workflow
```

### Szenario 2: Temporär zum allgemeinen Skill wechseln

**Anforderung**: Eine bestimmte Aufgabe erfordert den allgemeinen Benutzer-Skill statt der projektspezifischen Version.

**Lösung**:

```
use_skill("user:git-helper")
```

Durch explizite Angabe des `user:`-Namespace wird die Projekt-Überschreibung umgangen.

### Szenario 3: Skill aus Claude-Plugin laden

**Anforderung**: Sie sind von Claude Code migriert und möchten weiterhin einen bestimmten Claude-Plugin-Skill verwenden.

**Lösung**:

1. Stellen Sie sicher, dass der Claude-Plugin-Cache-Pfad korrekt ist: `~/.claude/plugins/cache/`
2. Skill-Liste anzeigen:

```
get_available_skills()
```

3. Mit Namespace laden:

```
use_skill("claude-plugins:plugin-name")
```

## Häufige Fehler vermeiden

### ❌ Fehler 1: Unbewusstes Überschreiben gleichnamiger Skills

**Symptom**: Änderungen am Benutzer-Skill werden vorgenommen, aber die KI verwendet weiterhin die alte Version.

**Ursache**: Ein gleichnamiger Projekt-Skill hat höhere Priorität und überschreibt den Benutzer-Skill.

**Lösung**:
1. Prüfen Sie, ob im Projektverzeichnis ein gleichnamiger Skill existiert
2. Erzwingen Sie mit Namespace: `use_skill("user:skill-name")`
3. Oder löschen Sie den gleichnamigen Projekt-Skill

### ❌ Fehler 2: Tippfehler im Namespace

**Symptom**: `use_skill("project:git-helper")` gibt 404 zurück.

**Ursache**: Tippfehler im Namespace (z.B. `projcet`) oder falsche Groß-/Kleinschreibung.

**Lösung**:
1. Zuerst Skill-Liste anzeigen: `get_available_skills()`
2. Auf Labels in Klammern achten (z.B. `(project)`)
3. Korrekten Namespace-Namen verwenden

### ❌ Fehler 3: Verwechslung von Labels und benutzerdefinierten Namespaces

**Symptom**: `use_skill("project:custom-skill")` findet den Skill nicht.

**Ursache**: `project` ist ein Label, kein benutzerdefinierter Namespace. Sofern das `namespace`-Feld des Skills nicht explizit auf `project` gesetzt ist, erfolgt kein Match.

**Lösung**:
- Skill-Namen direkt verwenden: `use_skill("custom-skill")`
- Oder das `label`-Feld des Skills prüfen und den korrekten Namespace verwenden

## Zusammenfassung

Das Namespace-System von OpenCode Agent Skills ermöglicht durch Labels und Prioritätsregeln eine einheitliche Verwaltung von Skills aus verschiedenen Quellen:

- **5 Quell-Labels**: `project`, `claude-project`, `user`, `claude-user`, `claude-plugins`
- **6 Prioritätsstufen**: Projekt > Claude-Projekt > Benutzer > Claude-Benutzer > Plugin-Cache > Plugin-Marktplatz
- **Erster Treffer gewinnt**: Gleichnamige Skills werden nach Priorität geladen, nachfolgende ignoriert
- **Namespace-Präfix**: Format `namespace:skill-name` für präzise Quellenangabe

Dieses System bietet sowohl den Komfort der automatischen Erkennung als auch präzise Kontrolle über die Skill-Quelle bei Bedarf.

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen Sie den **[Kontext-Komprimierungs-Wiederherstellungsmechanismus](../context-compaction-resilience/)**.
>
> Sie werden lernen:
> - Auswirkungen der Kontext-Komprimierung auf Skills
> - Wie das Plugin die Skill-Liste automatisch wiederherstellt
> - Techniken zur Aufrechterhaltung der Skill-Verfügbarkeit in langen Sessions

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-24

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| SkillLabel Typdefinition | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L30) | 30 |
| Erkennungs-Prioritätsliste | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L241-L246) | 241-246 |
| Deduplizierungslogik für gleichnamige Skills | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L258-L259) | 258-259 |
| resolveSkill Namespace-Verarbeitung | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |
| Superpowers Namespace-Erklärung | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L18-L25) | 18-25 |

**Wichtige Typen**:
- `SkillLabel`: Enumeration der Skill-Quell-Labels
- `Skill`: Skill-Metadaten-Interface (enthält `namespace`- und `label`-Felder)

**Wichtige Funktionen**:
- `discoverAllSkills()`: Erkennt Skills nach Priorität mit automatischer Deduplizierung
- `resolveSkill()`: Parst Namespace-Präfix und sucht Skill
- `maybeInjectSuperpowersBootstrap()`: Injiziert Namespace-Prioritätserklärung

**Erkennungspfade** (nach Priorität):
1. `project` - `.opencode/skills/`
2. `claude-project` - `.claude/skills/`
3. `user` - `~/.config/opencode/skills/`
4. `claude-user` - `~/.claude/skills/`
5. `claude-plugins` - `~/.claude/plugins/cache/` und `~/.claude/plugins/marketplaces/`

</details>

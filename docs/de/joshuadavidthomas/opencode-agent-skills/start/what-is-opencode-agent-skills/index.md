---
title: "Einführung: OpenCode Agent Skills | opencode-agent-skills"
sidebarTitle: "Lassen Sie KI Ihre Skills verstehen"
subtitle: "Einführung: OpenCode Agent Skills"
description: "Lernen Sie die Kernwerte und Hauptfunktionen von OpenCode Agent Skills kennen. Meistern Sie dynamische Skill-Erkennung, Kontext-Injektion, Komprimierungswiederherstellung und mehr – kompatibel mit Claude Code und automatischen Empfehlungen."
tags:
  - "Einstiegsleitfaden"
  - "Plugin-Einführung"
prerequisite: []
order: 1
---

# Was ist OpenCode Agent Skills?

## Was Sie nach dem Lernen tun können

- Den Kernwert des OpenCode Agent Skills Plugins verstehen
- Die Hauptfunktionen und Features des Plugins beherrschen
- Verstehen, wie Skills automatisch erkannt und geladen werden
- Unterscheiden, wie sich dieses Plugin von anderen Skill-Management-Lösungen unterscheidet

## Ihre aktuellen Herausforderungen

Vielleicht haben Sie bereits folgende Situationen erlebt:

- **Schwierige Skill-Verwaltung**: Skills sind über verschiedene Projekte, Benutzerverzeichnisse und Plugin-Cache verstreut, und Sie können nicht den richtigen Skill finden
- **Probleme mit langen Sitzungen**: Nach langen Sitzungen werden zuvor geladene Skills aufgrund von Kontextkomprimierung ungültig
- **Kompatibilitätsängste**: Sorge, dass vorhandene Skills und Plugins nach der Migration von Claude Code nicht mehr verwendet werden können
- **Wiederholte Konfiguration**: Jedes Projekt erfordert eine neue Skill-Konfiguration, es gibt kein einheitliches Skill-Management-System

Diese Probleme beeinflussen alle die Effizienz Ihrer Nutzung von KI-Assistenten.

## Kernkonzept

**OpenCode Agent Skills** ist ein Plugin-System, das dynamische Skill-Erkennung und Verwaltungsfunktionen für OpenCode bereitstellt.

::: info Was ist ein Skill?
Ein Skill ist ein wiederverwendbares Modul, das KI-Arbeitsablauf-Anleitungen enthält. Es ist normalerweise ein Verzeichnis mit einer `SKILL.md`-Datei (beschreibt die Funktionen und Verwendungsmethoden des Skills) sowie möglichen Hilfsdateien (Dokumentation, Skripte, etc.).
:::

**Kernwert**: Durch das standardisierte Skill-Format (SKILL.md) wird die Skill-Wiederverwendung über Projekte und Sitzungen hinweg ermöglicht.

### Technische Architektur

Das Plugin basiert auf TypeScript + Bun + Zod und bietet 4 Kern-Tools:

| Tool | Funktion |
| --- | --- |
| `use_skill` | Injiziert SKILL.md-Inhalt des Skills in den Sitzungskontext |
| `read_skill_file` | Liest Hilfsdateien im Skill-Verzeichnis (Dokumente, Konfigurationen, etc.) |
| `run_skill_script` | Führt ausführbare Skripte im Skill-Verzeichnis-Kontext aus |
| `get_available_skills` | Ruft die Liste der aktuell verfügbaren Skills ab |

## Hauptfunktionen

### 1. Dynamische Skill-Erkennung

Das Plugin erkennt Skills automatisch von mehreren Standorten und sortiert sie nach Priorität:

```
1. .opencode/skills/              (Projekt-Ebene - OpenCode)
2. .claude/skills/                (Projekt-Ebene - Claude Code)
3. ~/.config/opencode/skills/     (Benutzer-Ebene - OpenCode)
4. ~/.claude/skills/              (Benutzer-Ebene - Claude Code)
5. ~/.claude/plugins/cache/        (Plugin-Cache)
6. ~/.claude/plugins/marketplaces/ (Installierte Plugins)
```

**Regel**: Das erste passende Skill wird verwendet, nachfolgende Skills mit demselben Namen werden ignoriert.

> Warum dieses Design?
>
> Projekt-Ebene Skills haben Vorrang vor Benutzer-Ebene Skills, sodass Sie projektspezifisches Verhalten anpassen können, ohne die globale Konfiguration zu beeinflussen.

### 2. Kontext-Injektion

Wenn Sie `use_skill` aufrufen, wird der Skill-Inhalt im XML-Format in den Sitzungskontext injiziert:

- `noReply: true` - Die KI antwortet nicht auf die injizierte Nachricht
- `synthetic: true` - Markiert die Nachricht als systemgeneriert (nicht im UI angezeigt, nicht als Benutzereingabe gezählt)

Dies bedeutet, dass der Skill-Inhalt dauerhaft im Sitzungskontext existiert. Selbst wenn die Sitzung wächst und eine Kontextkomprimierung durchführt, bleibt der Skill verfügbar.

### 3. Komprimierungswiederherstellung

Wenn OpenCode eine Kontextkomprimierung durchführt (eine häufige Operation bei langen Sitzungen), lauscht das Plugin auf das `session.compacted`-Ereignis und injiziert automatisch die Liste der verfügbaren Skills neu.

Dies stellt sicher, dass die KI in langen Sitzungen immer weiß, welche Skills verfügbar sind, und nicht durch Komprimierung die Skill-Zugriffsfähigkeit verliert.

### 4. Claude Code Kompatibilität

Das Plugin ist vollständig kompatibel mit dem Claude Code Skill- und Plugin-System und unterstützt:

- Claude Code Skills (`.claude/skills/<skill-name>/SKILL.md`)
- Claude Plugin Cache (`~/.claude/plugins/cache/...`)
- Claude Plugin Marketplace (`~/.claude/plugins/marketplaces/...`)

Das bedeutet, dass Sie, wenn Sie zuvor Claude Code verwendet haben, vorhandene Skills und Plugins nach der Migration zu OpenCode weiterhin verwenden können.

### 5. Automatische Skill-Empfehlung

Das Plugin überwacht Ihre Nachrichten und verwendet semantische Ähnlichkeitserkennung, um festzustellen, ob diese mit einem verfügbaren Skill verwandt sind:

- Berechnet den Embedding-Vektor der Nachricht
- Berechnet die Kosinus-Ähnlichkeit mit allen Skill-Beschreibungen
- Wenn die Ähnlichkeit den Schwellenwert überschreitet, wird ein Evaluierungshinweis injiziert, der die KI empfiehlt, den entsprechenden Skill zu laden

Dieser Prozess ist vollständig automatisch; Sie müssen sich Skill-Namen nicht merken oder explizit anfordern.

### 6. Superpowers Integration (Optional)

Das Plugin unterstützt den Superpowers-Workflow, aktiviert durch Umgebungsvariablen:

```bash
OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true opencode
```

Nach Aktivierung erkennt das Plugin automatisch den `using-superpowers`-Skill und injiziert die vollständigen Workflow-Anleitungen bei der Sitzungsinitialisierung.

## Vergleich mit anderen Lösungen

| Lösung | Merkmale | Anwendungsszenarien |
| --- | --- | --- |
| **opencode-agent-skills** | Dynamische Erkennung, Komprimierungswiederherstellung, automatische Empfehlung | Szenarien, die einheitliche Verwaltung und automatische Empfehlung erfordern |
| **opencode-skills** | Automatische Registrierung als `skills_{{name}}` Tool | Szenarien, die unabhängige Tool-Aufrufe erfordern |
| **superpowers** | Vollständige Softwareentwicklungs-Workflows | Projekte, die strenge Prozessrichtlinien erfordern |
| **skillz** | MCP-Server-Modus | Szenarien, die plattformübergreifende Skill-Nutzung erfordern |

Gründe für die Auswahl dieses Plugins:

- ✅ **Zero-Konfiguration**: Automatische Erkennung und Verwaltung von Skills
- ✅ **Intelligente Empfehlung**: Automatische Empfehlung relevanter Skills basierend auf semantischer Übereinstimmung
- ✅ **Komprimierungswiederherstellung**: Zuverlässig in langen Sitzungen
- ✅ **Kompatibilität**: Nahtlose Migration von Claude Code Skills

## Lektionszusammenfassung

Das OpenCode Agent Skills Plugin bietet durch dynamische Erkennung, Kontext-Injektion, Komprimierungswiederherstellung und andere Kernmechanismen eine vollständige Skill-Verwaltungsfunktion für OpenCode. Seine Kernwerte liegen in:

- **Automatisierung**: Reduzierung der Belastung durch manuelle Konfiguration und das Merken von Skill-Namen
- **Stabilität**: Skills sind in langen Sitzungen immer verfügbar
- **Kompatibilität**: Nahtlose Integration in das bestehende Claude Code-Ökosystem

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Installation von OpenCode Agent Skills](../installation/)**.
>
> Sie werden lernen:
> - Wie man das Plugin zur OpenCode-Konfiguration hinzufügt
> - Wie man überprüft, ob das Plugin korrekt installiert ist
> - Wie man den lokalen Entwicklungsmodus einrichtet

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-24

| Funktion | Dateipfad | Zeile |
| --- | --- | --- |
| Plugin-Einstieg und Funktionsübersicht | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L1-L12) | 1-12 |
| Liste der Kernfunktionen | [`README.md`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/README.md#L5-L11) | 5-11 |
| Skill-Erkennungspriorität | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L241-L246) | 241-246 |
| Synthetische Nachrichteninjektion | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L147-L162) | 147-162 |
| Komprimierungswiederherstellungsmechanismus | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L144-L151) | 144-151 |
| Semantisches Matching-Modul | [`src/embeddings.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/embeddings.ts#L108-L135) | 108-135 |

**Wichtige Konstanten**:
- `EMBEDDING_MODEL = "Xenova/all-MiniLM-L6-v2"`: Verwendetes Embedding-Modell
- `SIMILARITY_THRESHOLD = 0.35`: Schwellenwert für semantische Ähnlichkeit
- `TOP_K = 5`: Maximale Anzahl zurückgegebener Skills bei automatischer Empfehlung

**Wichtige Funktionen**:
- `discoverAllSkills()`: Erkennt Skills von mehreren Positionen
- `use_skill()`: Injiziert Skill-Inhalt in den Sitzungskontext
- `matchSkills()`: Passt relevante Skills basierend auf semantischer Ähnlichkeit an
- `injectSyntheticContent()`: Injiziert synthetische Nachrichten in die Sitzung

</details>

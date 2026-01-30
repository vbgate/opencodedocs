---
title: "Fähigkeiten verwalten: Verfügbare Fähigkeiten abfragen | opencode-agent-skills"
sidebarTitle: "Fähigkeiten schnell finden"
subtitle: "Fähigkeiten verwalten: Verfügbare Fähigkeiten abfragen"
description: "Lernen Sie die Verwendung des Tools get_available_skills. Durch Such-, Namespace- und Filterfunktionen finden Sie schnell Fähigkeiten und beherrschen die Kernfunktionen der Fähigkeitenentdeckung und -verwaltung."
tags:
  - "Fähigkeitenverwaltung"
  - "Tool-Nutzung"
  - "Namensräume"
prerequisite:
  - "start-installation"
order: 2
---

# Verfügbare Fähigkeiten abfragen und auflisten

## Was Sie nach diesem Kurs können

- Mit dem Tool `get_available_skills` alle verfügbaren Fähigkeiten auflisten
- Bestimmte Fähigkeiten durch Suchanfragen filtern
- Fähigkeiten mit Namensräumen (z. B. `project:skill-name`) präzise lokalisieren
- Fähigkeitsquellen und ausführbare Skriptlisten erkennen

## Ihre aktuelle Situation

Sie möchten eine bestimmte Fähigkeit verwenden, können sich aber nicht mehr an den genauuen Namen erinnern. Vielleicht wissen Sie, dass es sich um eine Fähigkeit im Projekt handelt, aber nicht unter welchem Entdeckungspfad. Oder Sie möchten einfach nur schnell sehen, welche Fähigkeiten im aktuellen Projekt verfügbar sind.

## Wann Sie diese Technik anwenden

- **Neue Projekte erkunden**: Wenn Sie einem neuen Projekt beitreten, schnell sehen, welche Fähigkeiten verfügbar sind
- **Unsicherer Fähigkeitsname**: Sie erinnern sich nur an einen Teil des Namens oder der Beschreibung und benötigen eine Fuzzy-Suche
- **Namensraumkonflikte**: Wenn es projekt- und benutzerspezifische Fähigkeiten mit demselben Namen gibt, müssen Sie明确指定使用哪个
- **Skripte finden**: Wissen möchten, welche ausführbaren Automatisierungsskripte im Fähigkeitenverzeichnis vorhanden sind

## Grundlegende Vorgehensweise

Das Tool `get_available_skills` zeigt alle Fähigkeiten an, die in der aktuellen Sitzung verfügbar sind. Das Plugin scannt automatisch Fähigkeiten aus 6 Entdeckungspfaden:

::: info Fähigkeitsentdeckungspriorität
1. `.opencode/skills/` (projektspezifisch OpenCode)
2. `.claude/skills/` (projektspezifisch Claude)
3. `~/.config/opencode/skills/` (benutzerspezifisch OpenCode)
4. `~/.claude/skills/` (benutzerspezifisch Claude)
5. `~/.claude/plugins/cache/` (Plugin-Cache)
6. `~/.claude/plugins/marketplaces/` (installierte Plugins)
:::

Fähigkeiten mit demselben Namen werden nur nach Priorität behalten, alle weiteren werden ignoriert.

Die vom Tool zurückgegebenen Informationen umfassen:
- **Fähigkeitsname**
- **Quelletikett** (project, user, claude-project usw.)
- **Beschreibung**
- **Liste ausführbarer Skripte** (falls vorhanden)

::: tip Namensraumsyntax
Sie können mit dem Format `namespace:skill-name`明确指定来源：
- `project:my-skill` - Projektspezifische OpenCode-Fähigkeit verwenden (`.opencode/skills/`)
- `claude-project:my-skill` - Projektspezifische Claude-Fähigkeit verwenden (`.claude/skills/`)
- `user:my-skill` - Benutzerspezifische OpenCode-Fähigkeit verwenden (`~/.config/opencode/skills/`)
- `claude-user:my-skill` - Benutzerspezifische Claude-Fähigkeit verwenden (`~/.claude/skills/`)
- `claude-plugins:my-skill` - Fähigkeit aus Claude-Plugins verwenden
:::

## Praktische Anleitung

### Schritt 1: Alle verfügbaren Fähigkeiten auflisten

Fordern Sie den KI-Assistenten direkt auf, die Fähigkeiten aufzulisten:

```
Benutzereingabe:
Alle verfügbaren Fähigkeiten auflisten

Systemantwort:
skill-helper (project)
  Git-Operationen und Zweigverwassistent [scripts: tools/branch.sh, tools/commit.sh]

test-helper (user)
  Unit-Tests und Abdeckungsanalyse-Tool

docker-helper (project)
  Docker-Containerisierung und Deployment-Leitfaden [scripts: build.sh, deploy.sh]

claude-code-superpowers (claude-plugins)
  Vollständiger Softwareentwicklungs-Workflow
```

**Was Sie sehen sollten**: Eine Fähigkeitsliste, die für jede Fähigkeit den Namen, das Quelletikett, die Beschreibung und die Skriptliste anzeigt.

### Schritt 2: Suchanfragen zum Filtern verwenden

Wenn Sie sich nur noch an einen Teil des Fähigkeitsnamens erinnern:

```
Benutzereingabe:
Fähigkeiten suchen, die "docker" enthalten

Systemantwort:
docker-helper (project)
  Docker-Containerisierung und Deployment-Leitfaden [scripts: build.sh, deploy.sh]
```

Die Suche stimmt Schlüsselwörter im Fähigkeitsnamen und in der Beschreibung überein und unterstützt `*` Wildcards:

```
Benutzereingabe:
Fähigkeiten suchen, die mit "test" beginnen

Systemantwort:
test-helper (user)
  Unit-Tests und Abdeckungsanalyse-Tool
```

**Was Sie sehen sollten**: Nur Fähigkeiten, die mit den Suchkriterien übereinstimmen.

### Schritt 3: Fuzzy-Match-Vorschläge testen

Wenn Sie einen falschen Fähigkeitsnamen eingeben:

```
Benutzereingabe:
Ich möchte docker-asistant verwenden

Systemantwort:
No skills found matching "docker-asistant". Did you mean "docker-helper"?
```

Das Plugin berechnet die Ähnlichkeit automatisch basierend auf der Levenshtein-Distanz und schlägt den ähnlichsten Fähigkeitsnamen vor.

**Was Sie sehen sollten**: Eine Fehlermeldung und den richtigen Fähigkeitsvorschlag.

### Schritt 4: Namensräume zur präzisen Lokalisierung verwenden

Angenommen, es gibt projekt- und benutzerspezifische Fähigkeiten namens `build-helper`:

```
Benutzereingabe:
Details von build-helper auflisten

Systemantwort:
build-helper (project)
  Projektspezifische Build-Konfiguration und Compiler-Optimierung [scripts: build.sh, optimize.sh]
```

Wenn der Benutzer die benutzerspezifische Fähigkeit möchte:

```
Benutzereingabe:
user:build-helper verwenden

Systemantwort:
build-helper (user)
  Generische Build-Toolchain und CI-Konfiguration [scripts: ci.sh, test.sh]
```

**Was Sie sehen sollten**: Mit Namensraum-Präfixen können Sie auf Fähigkeiten mit demselben Namen aus verschiedenen Quellen zugreifen.

### Schritt 5: Ausführbare Skripte prüfen

Sehen Sie, welche Skripte im Fähigkeitenverzeichnis vorhanden sind:

```
Benutzereingabe:
Welche Skripte hat docker-helper?

Systemantwort:
docker-helper (project)
  Docker-Containerisierung und Deployment-Leitfaden [scripts: build.sh, deploy.sh]
```

Die Skripte werden in eckigen Klammern nach den Fähigkeitsinformationen angezeigt, durch Kommas getrennt. Sie können das Tool `run_skill_script` verwenden, um diese Skripte auszuführen.

**Was Sie sehen sollten**: Den Fähigkeitsnamen gefolgt von einer Liste im Format `[scripts: SkriptPfad1, SkriptPfad2, ...]`.

## Checkliste ✅

- [ ] Können Sie alle verfügbaren Fähigkeiten auflisten?
- [ ] Können Sie bestimmte Fähigkeiten durch Suchanfragen filtern?
- [ ] Verstehen Sie die Bedeutung der Fähigkeitsquelletiketten (project, user, claude-project usw.)?
- [ ] Können Sie den Zweck und die Syntax von Fähigkeitsnamensräumen erklären?
- [ ] Können Sie aus den Fähigkeitsinformationen die Liste der ausführbaren Skripte identifizieren?

## Fallstricke

### Fallstrick 1: Überschreibung von Fähigkeiten mit demselben Namen

Wenn es projekt- und benutzerspezifische Fähigkeiten mit demselben Namen gibt, sind Sie möglicherweise verwirrt, warum nicht die erwartete Fähigkeit geladen wird.

**Grund**: Fähigkeiten werden nach Priorität entdeckt, projekt-spezifisch hat Vorrang vor benutzerspezifisch, und bei demselben Namen wird nur die erste behalten.

**Lösung**: Verwenden Sie Namensräume明确指定，例如 `user:my-skill` statt `my-skill`.

### Fallstrick 2: Suche unterscheidet Groß-/Kleinschreibung

Suchanfragen verwenden reguläre Ausdrücke, aber mit dem `i`-Flag, daher wird die Groß-/Kleinschreibung nicht berücksichtigt.

```bash
# Diese Suchen sind gleichwertig
get_available_skills(query="docker")
get_available_skills(query="DOCKER")
get_available_skills(query="Docker")
```

### Fallstrick 3: Escape-Zeichen für Wildcards

Das `*` in der Suche wird automatisch in `.*` reguläre Ausdrücke konvertiert, Sie müssen nicht manuell escapen:

```bash
# Fähigkeiten suchen, die mit "test" beginnen
get_available_skills(query="test*")

# Entspricht dem regulären Ausdruck /test.*/i
```

## Zusammenfassung

`get_available_skills` ist ein Werkzeug zum Erkunden des Fähigkeiten-Ökosystems, das unterstützt:

- **Alle Fähigkeiten auflisten**: Ohne Parameter aufrufen
- **Suchfilterung**: Durch den `query`-Parameter Namen und Beschreibung abgleichen
- **Namensräume**: Mit `namespace:skill-name` präzise lokalisieren
- **Fuzzy-Match-Vorschläge**: Bei Rechtschreibfehlern automatisch den richtigen Namen vorschlagen
- **Skriptlisten**: Ausführbare Automatisierungsskripte anzeigen

Das Plugin injiziert die Fähigkeitenliste automatisch zu Beginn der Sitzung, daher müssen Sie dieses Tool normalerweise nicht manuell aufrufen. Aber in folgenden Szenarien ist es nützlich:
- Schnell verfügbare Fähigkeiten durchsuchen möchten
- Sich nicht mehr an den genauen Fähigkeitsnamen erinnern
- Fähigkeiten mit demselben Namen aus verschiedenen Quellen unterscheiden müssen
- Die Skriptliste einer bestimmten Fähigkeit sehen möchten

## Nächste Lektion

> In der nächsten Lektion lernen wir **[Fähigkeiten in den Sitzungskontext laden](../loading-skills-into-context/)**.
>
> Sie werden lernen:
> - Das Tool use_skill verwenden, um Fähigkeiten in die aktuelle Sitzung zu laden
> - Verstehen, wie Fähigkeitsinhalte im XML-Format in den Kontext injiziert werden
> - Den Synthetic Message Injection-Mechanismus beherrschen (synthetic message injection)
> - Erfahren, wie Fähigkeiten nach der Sitzungskomprimierung verfügbar bleiben

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Aufklappen der Quellcode-Position</strong></summary>

> Letzte Aktualisierung：2026-01-24

| Funktion | Dateipfad | Zeilennummern |
| --- | --- | --- |
| GetAvailableSkills Tool-Definition | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L29-L72) | 29-72 |
| discoverAllSkills Funktion | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L240-L263) | 240-263 |
| resolveSkill Funktion | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |
| findClosestMatch Funktion | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L88-L125) | 88-125 |

**Wichtige Typen**：
- `SkillLabel = "project" | "user" | "claude-project" | "claude-user" | "claude-plugins"`：Aufzählung der Fähigkeitsquelletiketten

**Wichtige Konstanten**：
- Fuzzy-Match-Schwellenwert：`0.4` (`utils.ts:124`) - Ähnlichkeiten unter diesem Wert geben keine Vorschläge zurück

**Wichtige Funktionen**：
- `GetAvailableSkills()`：Gibt eine formatierte Fähigkeitsliste zurück, unterstützt Suchfilterung und Fuzzy-Match-Vorschläge
- `resolveSkill(skillName: string, skillsByName: Map<string, Skill>)`：Unterstützt Fähigkeitsauflösung im Format `namespace:skill-name`
- `findClosestMatch(input: string, candidates: string[])`：Berechnet die beste Übereinstimmung basierend auf verschiedenen Matching-Strategien (Präfix, Enthaltensein, Bearbeitungsdistanz)

**Geschäftsregeln**：
- Fähigkeiten mit demselben Namen werden nach Entdeckungsreihenfolge dedupliziert, nur die erste wird behalten (`skills.ts:258`)
- Suchanfragen unterstützen das Wildcard-Zeichen `*`, das automatisch in reguläre Ausdrücke konvertiert wird (`tools.ts:43`)
- Fuzzy-Match-Vorschläge werden nur ausgelöst, wenn ein Suchparameter vorhanden ist und keine Ergebnisse gefunden wurden (`tools.ts:49-57`)

</details>

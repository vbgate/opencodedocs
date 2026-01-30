---
title: "API: Tool-Referenz | opencode-agent-skills"
sidebarTitle: "Diese 4 Tools aufrufen"
subtitle: "API: Tool-Referenz | opencode-agent-skills"
description: "Lernen Sie die Verwendung der 4 Kern-API-Tools von opencode-agent-skills. Beherrschen Sie Parameterkonfiguration, Rückgabewertverarbeitung und Fehlerbehebung, verstehen Sie Namespace-Unterstützung und Sicherheitsmechanismen, und steigern Sie Ihre Entwicklungseffizienz durch praktische Beispiele."
tags:
  - "API"
  - "Tool-Referenz"
  - "Schnittstellendokumentation"
prerequisite:
  - "start-installation"
order: 2
---

# API Tool-Referenz

## Was Sie lernen werden

Nach dieser API-Referenz werden Sie:

- Die Parameter und Rückgabewerte der 4 Kern-Tools verstehen
- Die korrekte Verwendung der Tools beherrschen
- Häufige Fehlersituationen behandeln können

## Tool-Übersicht

Das OpenCode Agent Skills Plugin bietet folgende 4 Tools:

| Tool-Name | Funktionsbeschreibung | Anwendungsfall |
|---|---|---|
| `get_available_skills` | Verfügbare Skills abrufen | Alle verfügbaren Skills anzeigen, mit Suchfilter |
| `read_skill_file` | Skill-Datei lesen | Auf Dokumentation, Konfiguration und andere Unterstützungsdateien eines Skills zugreifen |
| `run_skill_script` | Skill-Skript ausführen | Automatisierungsskripte im Skill-Verzeichnis ausführen |
| `use_skill` | Skill laden | Den SKILL.md-Inhalt in den Sitzungskontext injizieren |

---

## get_available_skills

Ruft die Liste der verfügbaren Skills ab, mit optionaler Suchfilterung.

### Parameter

| Parametername | Typ | Erforderlich | Beschreibung |
|---|---|---|---|
| `query` | string | Nein | Suchzeichenfolge, die mit Skill-Namen und -Beschreibungen abgeglichen wird (unterstützt `*` Wildcard) |

### Rückgabewert

Gibt eine formatierte Skill-Liste zurück, wobei jeder Eintrag enthält:

- Skill-Name und Quell-Label (z.B. `skill-name (project)`)
- Skill-Beschreibung
- Liste verfügbarer Skripte (falls vorhanden)

**Beispielrückgabe**:
```
git-helper (project)
  Git operations and workflow automation tools
  [scripts: tools/commit.sh, tools/branch.sh]

code-review (user)
  Code review checklist and quality standards
```

### Fehlerbehandlung

- Bei keinen Treffern wird eine Hinweismeldung zurückgegeben
- Bei Tippfehlern im Suchparameter werden ähnliche Skills vorgeschlagen

### Anwendungsbeispiele

**Alle Skills auflisten**:
```
Benutzereingabe:
Liste alle verfügbaren Skills auf

KI-Aufruf:
get_available_skills()
```

**Nach Skills mit "git" suchen**:
```
Benutzereingabe:
Finde Skills, die mit git zusammenhängen

KI-Aufruf:
get_available_skills({
  "query": "git"
})
```

**Suche mit Wildcard**:
```
KI-Aufruf:
get_available_skills({
  "query": "code*"
})

Rückgabe:
code-review (user)
  Code review checklist and quality standards
```

---

## read_skill_file

Liest Unterstützungsdateien (Dokumentation, Konfiguration, Beispiele usw.) aus dem Skill-Verzeichnis.

### Parameter

| Parametername | Typ | Erforderlich | Beschreibung |
|---|---|---|---|
| `skill` | string | Ja | Skill-Name |
| `filename` | string | Ja | Dateipfad (relativ zum Skill-Verzeichnis, z.B. `docs/guide.md`, `scripts/helper.sh`) |

### Rückgabewert

Gibt eine Bestätigungsmeldung über das erfolgreiche Laden der Datei zurück.

**Beispielrückgabe**:
```
File "docs/guide.md" from skill "code-review" loaded.
```

Der Dateiinhalt wird im XML-Format in den Sitzungskontext injiziert:

```xml
<skill-file skill="code-review" file="docs/guide.md">
  <metadata>
    <directory>/path/to/skills/code-review</directory>
  </metadata>
  
  <content>
[Tatsächlicher Dateiinhalt]
  </content>
</skill-file>
```

### Fehlerbehandlung

| Fehlertyp | Rückgabemeldung |
|---|---|
| Skill nicht gefunden | `Skill "xxx" not found. Use get_available_skills to list available skills.` |
| Unsicherer Pfad | `Invalid path: cannot access files outside skill directory.` |
| Datei nicht gefunden | `File "xxx" not found. Available files: file1, file2, ...` |

### Sicherheitsmechanismen

- Pfadsicherheitsprüfung: Verhindert Directory-Traversal-Angriffe (z.B. `../../../etc/passwd`)
- Zugriff nur auf Dateien innerhalb des Skill-Verzeichnisses

### Anwendungsbeispiele

**Skill-Dokumentation lesen**:
```
Benutzereingabe:
Zeige die Anleitung für den code-review Skill

KI-Aufruf:
read_skill_file({
  "skill": "code-review",
  "filename": "docs/guide.md"
})
```

**Konfigurationsdatei lesen**:
```
KI-Aufruf:
read_skill_file({
  "skill": "git-helper",
  "filename": "config.json"
})
```

---

## run_skill_script

Führt ausführbare Skripte im Skill-Verzeichnis aus.

### Parameter

| Parametername | Typ | Erforderlich | Beschreibung |
|---|---|---|---|
| `skill` | string | Ja | Skill-Name |
| `script` | string | Ja | Relativer Skriptpfad (z.B. `build.sh`, `tools/deploy.sh`) |
| `arguments` | string[] | Nein | Array von Kommandozeilenargumenten für das Skript |

### Rückgabewert

Gibt die Ausgabe des Skripts zurück.

**Beispielrückgabe**:
```
Building project...
✓ Dependencies installed
✓ Tests passed
Build complete.
```

### Fehlerbehandlung

| Fehlertyp | Rückgabemeldung |
|---|---|
| Skill nicht gefunden | `Skill "xxx" not found. Use get_available_skills to list available skills.` |
| Skript nicht gefunden | `Script "xxx" not found in skill "yyy". Available scripts: script1, script2, ...` |
| Ausführung fehlgeschlagen | `Script failed (exit 1): error message` |

### Skript-Erkennungsregeln

Das Plugin scannt automatisch ausführbare Dateien im Skill-Verzeichnis:

- Maximale Rekursionstiefe: 10 Ebenen
- Überspringt versteckte Verzeichnisse (beginnend mit `.`)
- Überspringt gängige Abhängigkeitsverzeichnisse (`node_modules`, `__pycache__`, `.git` usw.)
- Enthält nur Dateien mit Ausführungsbit (`mode & 0o111`)

### Ausführungsumgebung

- Arbeitsverzeichnis (CWD) wird auf das Skill-Verzeichnis gewechselt
- Skript wird im Kontext des Skill-Verzeichnisses ausgeführt
- Ausgabe wird direkt an die KI zurückgegeben

### Anwendungsbeispiele

**Build-Skript ausführen**:
```
Benutzereingabe:
Führe das Build-Skript des Projekts aus

KI-Aufruf:
run_skill_script({
  "skill": "git-helper",
  "script": "tools/build.sh"
})
```

**Mit Argumenten ausführen**:
```
KI-Aufruf:
run_skill_script({
  "skill": "deployment",
  "script": "deploy.sh",
  "arguments": ["--env", "production", "--force"]
})
```

---

## use_skill

Lädt den SKILL.md-Inhalt eines Skills in den Sitzungskontext.

### Parameter

| Parametername | Typ | Erforderlich | Beschreibung |
|---|---|---|---|
| `skill` | string | Ja | Skill-Name (unterstützt Namespace-Präfix, z.B. `project:my-skill`, `user:my-skill`) |

### Rückgabewert

Gibt eine Bestätigungsmeldung über das erfolgreiche Laden des Skills zurück, einschließlich der Liste verfügbarer Skripte und Dateien.

**Beispielrückgabe**:
```
Skill "code-review" loaded.
Available scripts: tools/check.sh, tools/format.sh
Available files: docs/guide.md, examples/bad.js
```

Der Skill-Inhalt wird im XML-Format in den Sitzungskontext injiziert:

```xml
<skill name="code-review">
  <metadata>
    <source>user</source>
    <directory>/path/to/skills/code-review</directory>
    <scripts>
      <script>tools/check.sh</script>
      <script>tools/format.sh</script>
    </scripts>
    <files>
      <file>docs/guide.md</file>
      <file>examples/bad.js</file>
    </files>
  </metadata>

  [Claude Code Tool-Mapping...]
  
  <content>
[Tatsächlicher SKILL.md-Inhalt]
  </content>
</skill>
```

### Namespace-Unterstützung

Verwenden Sie Namespace-Präfixe, um die Skill-Quelle präzise anzugeben:

| Namespace | Beschreibung | Beispiel |
|---|---|---|
| `project:` | OpenCode-Skill auf Projektebene | `project:my-skill` |
| `user:` | OpenCode-Skill auf Benutzerebene | `user:my-skill` |
| `claude-project:` | Claude-Skill auf Projektebene | `claude-project:my-skill` |
| `claude-user:` | Claude-Skill auf Benutzerebene | `claude-user:my-skill` |
| Kein Präfix | Verwendet Standardpriorität | `my-skill` |

### Fehlerbehandlung

| Fehlertyp | Rückgabemeldung |
|---|---|
| Skill nicht gefunden | `Skill "xxx" not found. Use get_available_skills to list available skills.` |

### Automatische Injektionsfunktion

Beim Laden eines Skills führt das Plugin automatisch folgende Aktionen aus:

1. Listet alle Dateien im Skill-Verzeichnis auf (außer SKILL.md)
2. Listet alle ausführbaren Skripte auf
3. Injiziert Claude Code Tool-Mapping (falls der Skill es benötigt)

### Anwendungsbeispiele

**Skill laden**:
```
Benutzereingabe:
Hilf mir bei der Code-Review

KI-Aufruf:
use_skill({
  "skill": "code-review"
})
```

**Quelle mit Namespace angeben**:
```
KI-Aufruf:
use_skill({
  "skill": "user:git-helper"
})
```

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-24

| Tool | Dateipfad | Zeilennummern |
|---|---|---|
| GetAvailableSkills Tool | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L29-L72) | 29-72 |
| ReadSkillFile Tool | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L74-L135) | 74-135 |
| RunSkillScript Tool | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L137-L198) | 137-198 |
| UseSkill Tool | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L200-L267) | 200-267 |
| Tool-Registrierung | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L160-L167) | 160-167 |
| Skill-Typdefinition | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L43-L52) | 43-52 |
| Script-Typdefinition | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L35-L38) | 35-38 |
| SkillLabel-Typdefinition | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L30) | 30 |
| resolveSkill-Funktion | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |

**Wichtige Typen**:
- `Skill`: Vollständige Skill-Metadaten (name, description, path, scripts, template usw.)
- `Script`: Skript-Metadaten (relativePath, absolutePath)
- `SkillLabel`: Skill-Quellkennung (project, user, claude-project usw.)

**Wichtige Funktionen**:
- `resolveSkill()`: Löst Skill-Namen auf, unterstützt Namespace-Präfixe
- `isPathSafe()`: Validiert Pfadsicherheit, verhindert Directory-Traversal
- `findClosestMatch()`: Fuzzy-Matching-Vorschläge

</details>

---

## Vorschau auf die nächste Lektion

Diese Lektion hat die API-Tool-Referenzdokumentation für OpenCode Agent Skills abgeschlossen.

Für weitere Informationen konsultieren Sie bitte:
- [Best Practices für Skill-Entwicklung](../best-practices/) - Lernen Sie Tipps und Standards für das Schreiben hochwertiger Skills
- [Fehlerbehebung](../../faq/troubleshooting/) - Lösen Sie häufige Probleme bei der Plugin-Nutzung

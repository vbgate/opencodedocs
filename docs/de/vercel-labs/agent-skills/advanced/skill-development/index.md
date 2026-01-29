---
title: "Skill-Entwicklung: Benutzerdefinierte Skills | Agent Skills"
sidebarTitle: "Skill-Entwicklung"
subtitle: "Skill-Entwicklung"
description: "Lernen Sie benutzerdefinierte Skills für Claude zu entwickeln. Erfahren Sie, wie Sie Verzeichnisstrukturen erstellen, SKILL.md definieren, Skripte schreiben und Skills als Zip veröffentlichen."
tags:
  - "Skill-Entwicklung"
  - "Claude"
  - "KI-Hilfsprogrammierung"
  - "benutzerdefinierte Erweiterungen"
prerequisite:
  - "start-getting-started"
  - "start-installation"
---

# Entwicklung benutzerdefinierter Skills

## Was Sie nach diesem Kurs können

Lernen Sie nach Abschluss dieser Lektion:

- ✅ Spezifikationsgerechte Skill-Verzeichnisstruktur erstellen
- ✅ Vollständige `SKILL.md`-Definitionsdatei schreiben (inklusive Front Matter, How It Works, Usage usw.)
- ✅ Spezifikationskonforme Bash-Skripte schreiben (Fehlerbehandlung, Ausgabeformat, Bereinigungsmechanismus)
- ✅ Skills als Zip-Datei packen und veröffentlichen
- ✅ Kontexteffizienz optimieren, damit Claude Skills präziser aktiviert

## Kernkonzept

**Arbeitsweise von Agent Skills**:

Claude lädt beim Start nur den **Namen und die Beschreibung** des Skills. Wenn relevante Keywords erkannt werden, wird der vollständige Inhalt von `SKILL.md` gelesen. Dieser **On-Demand-Lademechanismus** minimiert den Token-Verbrauch.

**Drei Kernkomponenten der Skill-Entwicklung**:

1. **Verzeichnisstruktur**: Ordner-Layout, das den Benennungskonventionen entspricht
2. **SKILL.md**: Skill-Definitionsdatei, die Claude mitteilt, wann der Skill aktiviert werden soll und wie er zu verwenden ist
3. **Skripte**: Tatsächlich auszuführender Bash-Code, der spezifische Aufgaben ausführt

## Schritt-für-Schritt-Anleitung

### Schritt 1: Verzeichnisstruktur erstellen

Korrekte Verzeichnisstruktur ist Voraussetzung dafür, dass Claude den Skill erkennen kann.

```bash
cd skills
mkdir my-custom-skill
cd my-custom-skill
mkdir scripts
```

### Schritt 2: SKILL.md schreiben

`SKILL.md` ist der Kern des Skills und definiert die Auslösbedingungen, die Verwendungsmethode und das Ausgabeformat.

### Schritt 3: Bash-Skripte schreiben

Skripte sind der Teil, der die tatsächliche Ausführung übernimmt und den Eingabe-Ausgabe-Spezifikationen von Claude entsprechen muss.

## Zusammenfassung

**Kernpunkte**:

1. **Verzeichnisstruktur**: Verwendung von kebab-case, Enthalt von `SKILL.md` und `scripts/`-Verzeichnis
2. **SKILL.md-Format**: Front Matter + How It Works + Usage + Output + Present Results to User + Troubleshooting
3. **Skript-Spezifikation**: `#!/bin/bash`, `set -e`, stderr für Status, stdout für JSON, cleanup trap
4. **Kontexteffizienz**: `SKILL.md` < 500 Zeilen, progressive Disclosure, priorisierte Skripte
5. **Packen und Veröffentlichen**: Verwenden Sie `zip -r` zum Packen als `{skill-name}.zip`

**Best-Practices-Mantra**:

> Beschreibungen sollen spezifisch sein, Auslösungen klar
> Status über stderr, JSON über stdout
> Remember trap hinzufügen, temporäre Dateien bereinigen
> Dateien nicht zu lang, Skripte nutzen den Platz

---

## Anhang: Quellcodereferenz

<details>
<summary><strong>Klicken zum Anzeigen der Quellcodepositionen</strong></summary>

> Aktualisierungszeit: 2026-01-25

| Funktion               | Dateipfad                                                                                       | Zeilen   |
|--- | --- | ---|
|--- | --- | ---|
| Verzeichnisstrukturdefinition       | [`AGENTS.md:11-20`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L11-L20)   | 11-20  |
| Benennungskonvention           | [`AGENTS.md:22-27`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L22-L27)   | 22-27  |
| SKILL.md Format      | [`AGENTS.md:29-68`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L29-L68)   | 29-68  |

**Wichtige Konstanten**:
- `SKILL.md`-Dateiname: Muss GROSSBUCHSTABEN sein, muss exakt übereinstimmen
- `/mnt/skills/user/{skill-name}/scripts/{script}.sh`: Skript-Pfadformat

**Wichtige Funktionen**:
- Skript-Bereinigungsfunktion `cleanup()`: Zum Löschen temporärer Dateien
- Framework-Erkennungsfunktion `detect_framework()`: Erkennt Framework-Typ aus package.json

</details>

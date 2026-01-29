---
title: "API: Befehlsreferenz | Agent Skills"
sidebarTitle: "API-Referenz"
subtitle: "API: Befehlsreferenz"
description: "Sehen Sie die Befehle, Konfigurationen und Typendefinitionen von Agent Skills."
tags:
  - "Referenz"
  - "API"
  - "Befehlszeile"
  - "Typendefinition"
prerequisite: []
---

# API- und Befehlsreferenz

Diese Seite bietet die vollständige API- und Befehlsreferenz von Agent Skills, einschließlich Build-Toolchain-Befehle, TypeScript-Typendefinitionen, SKILL.md-Template-Formate und Impact-Level-Enum-Werte.

## TypeScript-Typendefinitionen

### ImpactLevel（Impact-Level）

Der Impact-Level wird zur Kennzeichnung des Performance-Einflussgrades von Regeln verwendet, mit 6 Levels:

| Wert | Beschreibung | Anwendbare Szenarien |
|--- | --- | ---|
| `CRITICAL` | Kritische Engpässe | müssen behoben werden, sonst erhebliche Beeinträchtigung der User Experience (wie Wasserfalls, unoptimierte Bundle-Größen) |
| `HIGH` | Wichtige Verbesserungen | signifikante Performance-Steigerung (wie Server-Side-Caching, Beseitigung doppelter Props) |
|--- | --- | ---|
| `MEDIUM` | Mittlere Verbesserungen | messbare Performance-Verbesserung (wie Memo-Optimierung, Reduzierung von Re-renders) |
|--- | --- | ---|
| `LOW` | Inkrementelle Verbesserungen | Mikro-Optimierungen (wie Code-Stil, erweiterte Muster) |

**Quellcode-Position**: `types.ts:5`

## Build-Toolchain-Befehle

### pnpm build

Regeldokumentation bauen und Testfälle extrahieren.

**Befehl**:
```bash
pnpm build
```

**Funktion**:
1. Alle Regeldateien parsen (`rules/*.md`)
2. Nach Kapiteln gruppieren und sortieren
3. Vollständige AGENTS.md generieren
4. Testfälle nach test-cases.json extrahieren

### pnpm validate

Validierung des Formats und der Vollständigkeit aller Regeldateien.

**Befehl**:
```bash
pnpm validate
```

**Prüfpunkte**:
- ✅ Regeltitel nicht leer
- ✅ Regelerklärung nicht leer
- ✅ Mindestens ein Codebeispiel vorhanden
- ✅ Enthält Bad/Incorrect- und Good/Correct-Beispiele
- ✅ Impact-Level gültig (CRITICAL/HIGH/MEDIUM-HIGH/MEDIUM/LOW-MEDIUM/LOW)

## SKILL.md-Template

### Claude.ai Skill-Definitions-Template

Jeder Claude.ai Skill muss die Datei `SKILL.md` enthalten:

```markdown
---
name: {skill-name}
description: {Ein Satz, der beschreibt, wann dieser Skill verwendet wird. Enthält Auslöse-Phrasen wie "Deploy my app", "Check logs" usw.}
---

# {Skill-Titel}

{Kurze Beschreibung, was der Skill tut.}

## How It Works

{Nummerierte Liste, die den Workflow des Skills erklärt}

## Usage

```bash
bash /mnt/skills/user/{skill-name}/scripts/{script}.sh [args]
```

**Arguments:**
- `arg1` - Beschreibung (Standard X)

**Examples:**
{Zeigen Sie 2-3 häufige Verwendungsmuster}

## Output

{Zeigen Sie ein Beispiel der Ausgabe, die Benutzer sehen werden}

## Present Results to User

{Template, wie Claude Ergebnisse formatieren soll, wenn sie dem Benutzer präsentiert werden}

## Troubleshooting

{Häufige Probleme und Lösungen, besonders Netzwerk/Berechtigungsfehler}
```

**Quellcode-Position**: `AGENTS.md:29-69`

## Zusammenfassung

Dies ist die vollständige API- und Befehlsreferenz von Agent Skills. Alle Build-Toolchain-Befehle, Typendefinitionen und SKILL.md-Templates sind hier enthalten.

---

## Anhang: Quellcodereferenz

<details>
<summary><strong>Klicken zum Anzeigen der Quellcodepositionen</strong></summary>

> Aktualisierungszeit: 2026-01-25

| Funktion        | Dateipfad                                                                                      | Zeilen  |
|--- | --- | ---|
| ImpactLevel Typ | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L5) | 5     |
| CodeExample Interface | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L7-L13) | 7-13  |

**Wichtige Konstanten**:
- `ImpactLevel`-Enum: `'CRITICAL' | 'HIGH' | 'MEDIUM-HIGH' | 'MEDIUM' | 'LOW-MEDIUM' | 'LOW'`

**Wichtige Funktionen**:
- `incrementVersion(version: string)`: Versionsnummer inkrementieren (build.ts)
- `generateMarkdown(sections, metadata)`: AGENTS.md generieren (build.ts)
- `validateRule(rule, file)`: Regelvollständigkeit validieren (validate.ts)

</details>

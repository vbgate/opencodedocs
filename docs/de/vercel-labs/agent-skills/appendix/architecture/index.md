---
title: "Architektur: Agent Skills | Agent Skills"
sidebarTitle: "Architektur"
subtitle: "Architektur: Agent Skills"
description: "Verstehen Sie die technische Architektur von Agent Skills. Lernen Sie Build-Ablauf, Regelparser, Typensystem und Deployment-Mechanismen."
tags:
  - "Architektur"
  - "Build-Ablauf"
  - "Regelparsing"
  - "Typensystem"
prerequisite:
  - "start-getting-started"
---

# Architektur und Implementationsdetails

## Was Sie nach diesem Kurs können

- Verstehen Sie die Funktionsweise der Agent Skills Build-Toolchain
- Beherrschen Sie die Kernlogik des Regeldatei-Parsings
- Verstehen Sie das Typensystem und das Datenflussdesign
- Lernen Sie die Implementierungsdetails der Framework-Erkennungsalgorithmen

## Kernarchitektur-Übersicht

Agent Skills besteht aus drei Hauptteilen:

**1. Build-Toolchain** (`packages/react-best-practices-build/`)
- Regeldateien parsen
- AGENTS.md generieren
- Testfälle extrahieren

**2. Regeldateien** (`skills/react-best-practices/rules/`)
- 57 React-Performance-Optimierungsregeln
- Markdown-Format, folgt den Template-Spezifikationen

**3. Deployment-Skripte** (`skills/claude.ai/vercel-deploy-claimable/`)
- Ein-Klick-Deployment auf Vercel
- Automatische Framework-Erkennung

## Build-Ablauf-Details

Der Build-Ablauf kompiliert die verteilten Regeldateien in eine AGENTS.md-Datei, die vom AIAgent gelesen werden kann. Der Ablauf ist in fünf Phasen unterteilt:

### Phase 1: Regeldateien parsen

Jede Regeldatei (`.md`) wird durch die Funktion `parseRuleFile()` in ein `Rule`-Objekt geparst.

**Parsing-Reihenfolge** (Quellcode-Position: `parser.ts:18-238`):

1. **Frontmatter extrahieren** (falls vorhanden)
   - YAML-Format-Metadaten parsen
   - Unterstützte Felder: `title`, `impact`, `tags`, `section`, `explanation`, `references`

2. **Überschrift extrahieren**
   - Erste `##` oder `###`-Überschrift suchen
   - Wenn Frontmatter keinen title hat, wird dieser Inhalt verwendet

3. **Impact extrahieren**
   - Zeile mit `**Impact:**` abgleichen
   - Format: `**Impact:** CRITICAL (2-10× improvement)`
   - Level und Beschreibung extrahieren

4. **Codebeispiele extrahieren**
   - Markierungen mit `**Label:**` suchen (wie `**Incorrect:**`, `**Correct:**`)
   - Nachfolgende Codeblöcke sammeln
   - Ergänzungstexte nach dem Codeblock erfassen

5. **Referenzen extrahieren**
   - Zeile mit `Reference:` oder `References:` suchen
   - Markdown-Links `[text](url)` parsen

6. **Section ableiten**
   - Aus dem Dateinamenpräfix extrahieren (Quellcode-Position: `parser.ts:201-210`)

## Typensystem

Typendefinitionen in `types.ts` (Quellcode-Position: `types.ts:1-54`).

### ImpactLevel-Enumeration

Der Impact-Level identifiziert den Performance-Einflussgrad der Regel, mit 6 Levels:

| Wert | Beschreibung | Anwendbare Szenarien |
|--- | --- | ---|
| `CRITICAL` | Kritische Engpässe | müssen behoben werden, beeinträchtigt erheblich die User Experience (wie Wasserfälle, unoptimierte Bundle-Größen) |
| `HIGH` | Wichtige Verbesserungen | signifikante Performance-Steigerung (wie Server-Side-Caching, Beseitigung doppelter Props) |
|--- | --- | ---|
| `MEDIUM` | Mittlere Verbesserungen | messbare Performance-Verbesserung (wie Memo-Optimierung, Reduzierung von Re-renders) |
|--- | --- | ---|
| `LOW` | Inkrementelle Verbesserungen | Mikro-Optimierungen (wie Code-Stil, erweiterte Muster) |

### Rule-Interface

Vollständige Struktur einer einzelnen Performance-Optimierungsregel:

| Feld | Typ | Pflicht | Beschreibung |
|--- | --- | --- | ---|
| `id` | string | ✅ | Regel-ID (automatisch generiert, wie "1.1", "2.3") |
| `title` | string | ✅ | Regeltitel |
| `section` | number | ✅ | Zugehöriges Kapitel (1-8) |
| `subsection` | number | ❌ | Unterkapitelnr. (automatisch generiert) |
| `impact` | ImpactLevel | ✅ | Impact-Level |
| `impactDescription` | string | ❌ | Impact-Beschreibung (wie "2-10× improvement") |
| `explanation` | string | ✅ | Regelerklärung |
| `examples` | CodeExample[] | ✅ | Array von Codebeispielen (mindestens 1) |
| `references` | string[] | ❌ | Referenz-Links |
| `tags` | string[] | ❌ | Tags (für Suche) |

## Zusammenfassung

**Kernarchitektur**:

1. **Build-Toolchain**: Parsen → Validieren → Gruppieren → Sortieren → Generieren
2. **Regelparser**: Extrahiert Frontmatter, Überschriften, Impact, Beispiele, Referenzen
3. **Typensystem**: ImpactLevel, Rule, CodeExample, Section, GuidelinesDocument, TestCase-Interfaces
4. **Testfall-Extraktion**: Extrahiert bad/good-Beispiele aus Regeln für LLM-Bewertung

**Nächste Schritte**:

- [Entwicklung benutzerdefinierter Skills](../../advanced/skill-development/)
- [Erstellen von React Best Practices Regeln](../../advanced/rule-authoring/)
- [API- und Befehlsreferenz ansehen](../reference/)

---

## Anhang: Quellcodereferenz

<details>
<summary><strong>Klicken zum Anzeigen der Quellcodepositionen</strong></summary>

> Aktualisierungszeit: 2026-01-25

| Funktion                  | Dateipfad                                                                 | Zeilen       |
|--- | --- | ---|
| Typensystem              | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts) | 1-54       |
|--- | --- | ---|
| Regelparser            | [`packages/react-best-practices-build/src/parser.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/parser.ts) | 18-238     |
|--- | --- | ---|

**Wichtige Konstanten**:
- `ImpactLevel`-Enum-Werte: CRITICAL, HIGH, MEDIUM-HIGH, MEDIUM, LOW-MEDIUM, LOW (`types.ts:5`)

**Wichtige Funktionen**:
- `parseRuleFile()`: Parst Markdown-Regeldatei in Rule-Objekt (`parser.ts:18`)
- `extractTestCases()`: Extrahiert Testfälle aus Regeln (`extract-tests.ts:15`)
- `generateMarkdown()`: Generiert AGENTS.md aus Section[] (`build.ts:29`)

</details>

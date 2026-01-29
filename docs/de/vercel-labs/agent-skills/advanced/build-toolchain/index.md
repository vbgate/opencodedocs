---
title: "Build-Toolchain: Validierung & CI | Agent Skills"
sidebarTitle: "Build-Toolchain"
subtitle: "Build-Toolchain: Validierung & CI"
description: "Lernen Sie die Agent Skills Build-Toolchain: Validierung mit pnpm validate, Build mit pnpm build, Entwicklungsablauf mit pnpm dev, GitHub Actions CI-Integration, Testfall-Extraktion und LLM-Automatisierungsbewertung."
tags:
  - "Build-Tools"
  - "CI/CD"
  - "Automatisierung"
  - "Code-Validierung"
prerequisite:
  - "start-getting-started"
  - "start-installation"
  - "advanced-rule-authoring"
---

# Build-Toolchain-Verwendung

## Was Sie nach diesem Kurs können

Nach Abschluss dieser Lektion werden Sie können:

- ✅ `pnpm validate` verwenden, um das Format und die Vollständigkeit der Regeldateien zu validieren
- ✅ `pnpm build` verwenden, um AGENTS.md und test-cases.json zu generieren
- ✅ Den Build-Ablauf verstehen: parse → validate → group → sort → generate
- ✅ GitHub Actions CI für automatische Validierung und Build konfigurieren
- ✅ Testfälle für die LLM-Automatisierungsbewertung extrahieren
- ✅ `pnpm dev` für den schnellen Entwicklungsablauf (build + validate) verwenden

## Kernarchitektur

Die Build-Toolchain besteht aus drei Hauptteilen:

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

## Kernkonzept

**Rolle der Build-Toolchain**:

Agent Skills Regelbibliothek besteht im Wesentlichen aus 57 unabhängigen Markdown-Dateien, aber Claude benötigt eine strukturierte AGENTS.md, um sie effizient nutzen zu können. Die Build-Toolchain übernimmt:

1. **Regeldateien parsen**: Extrahieren von title, impact, examples usw. aus Markdown
2. **Vollständigkeit validieren**: Überprüfung, ob jede Regel title, explanation und Codebeispiele hat
3. **Gruppieren und Sortieren**: Gruppierung nach Kapiteln, Sortierung nach Titel, Zuweisung von IDs (1.1, 1.2...)
4. **Dokumentation generieren**: Ausgabe von formatiertem AGENTS.md und test-cases.json

**Build-Ablauf**:

```
rules/*.md (57 Dateien)
    ↓
[parser.ts] Markdown parsen
    ↓
[validate.ts] Vollständigkeit validieren
    ↓
[build.ts] Gruppieren → Sortieren → AGENTS.md generieren
    ↓
[extract-tests.ts] Testfälle extrahieren → test-cases.json
```

**Vier Kernbefehle**:

| Befehl | Funktion | Geeignete Szenarien |
|------|------|----------|
| `pnpm validate` | Validierung des Formats und der Vollständigkeit aller Regeldateien | Vor Commit-Prüfung, CI-Validierung |
| `pnpm build` | Generierung von AGENTS.md und test-cases.json | Nach Regeldateien-Modifikation, vor Veröffentlichung |
| `pnpm dev` | Ausführung von build + validate (Entwicklungsablauf) | Schnelle Iteration, Entwicklung neuer Regeln |
| `pnpm extract-tests` | Alleinige Extraktion von Testfällen (ohne Neubuild) | Nur Aktualisierung von Testdaten |

## Zusammenfassung

**Kernpunkte**:

1. **Validierung (validate)**: Validierung des Regelformats, der Vollständigkeit, des Impact-Levels
2. **Build (build)**: Regeln parsen → Gruppieren → Sortieren → AGENTS.md generieren
3. **Test-Extraktion (extract-tests)**: Extraktion von bad/good-Beispielen aus examples
4. **Entwicklungsablauf (dev)**: `validate + build + extract-tests` für schnelle Iteration
5. **CI-Integration**: GitHub Actions automatisieren Validierung und Build, verhindern das Einreichen von fehlerhaftem Code

**Best-Practices-Mantra**:

> Erst validieren, dann builden, dann commiten
> dev-Befehl für den kompletten Ablauf, ein Schritt für hohe Effizienz
> CI automatisch prüfen, PR-Review einfacher
> Versionsnummern müssen aktualisiert werden, metadata muss bearbeitet werden

---

## Anhang: Quellcodereferenz

<details>
<summary><strong>Klicken zum Anzeigen der Quellcodepositionen</strong></summary>

> Aktualisierungszeit: 2026-01-25

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| package.json Skriptdefinition | [`packages/react-best-practices-build/package.json`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/package.json) | 6-12 |
| Build-Einstiegsfunktion | [`packages/react-best-practices-build/src/build.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/build.ts) | 131-290 |
| Regelparser | [`packages/react-best-practices-build/src/parser.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/parser.ts) | Ganze Datei |
| Regelvalidierungsfunktion | [`packages/react-best-practices-build/src/validate.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts) | 21-66 |
| Testfall-Extraktion | [`packages/react-best-practices-build/src/extract-tests.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/extract-tests.ts) | 15-38 |

</details>

---
title: "Global vs. Projekt: Installationsort | OpenSkills"
sidebarTitle: "Globale Installation: Skills projektübergreifend teilen"
subtitle: "Globale Installation vs. projektlokale Installation"
description: "Lernen Sie den Unterschied zwischen globaler und projektlokaler Installation von OpenSkills-Skills. Meistern Sie die Verwendung des --global-Flags, verstehen Sie die Suchprioritätsregeln und wählen Sie den passenden Installationsort je nach Szenario."
tags:
- "Plattformintegration"
- "Skill-Management"
- "Konfigurationstipps"
prerequisite:
- "start-first-skill"
- "platforms-install-sources"
order: 3
---

# Globale Installation vs. projektlokale Installation

## Was Sie nach diesem Tutorial können

- Den Unterschied zwischen den beiden Installationsorten von OpenSkills (global vs. projektlokal) verstehen
- Je nach Szenario den passenden Installationsort wählen
- Die Verwendung des `--global`-Flags beherrschen
- Die Suchprioritätsregeln für Skills verstehen
- Häufige Installationsort-Konfigurationsfehler vermeiden

::: info Voraussetzungen

Dieses Tutorial setzt voraus, dass Sie bereits [Ihren ersten Skill installiert](../../start/first-skill/) und [Installationsquellen im Detail](../install-sources/) durchgearbeitet haben und den grundlegenden Installationsablauf kennen.

:::

---

## Ihre aktuelle Situation

Sie haben vielleicht bereits gelernt, wie man Skills installiert, aber:

- **Wo werden Skills installiert?**: Nach der Ausführung von `openskills install` wissen Sie nicht, in welches Verzeichnis die Skill-Dateien kopiert werden
- **Muss ich für jedes neue Projekt neu installieren?**: Wenn Sie zu einem anderen Projekt wechseln, sind die zuvor installierten Skills verschwunden
- **Was ist mit Skills, die ich nur global einmalig verwenden möchte?**: Einige Skills werden von allen Projekten benötigt, und Sie möchten sie nicht in jedem Projekt installieren
- **Skills über mehrere Projekte hinweg teilen?**: Einige Skills sind teamübergreifend und sollen zentral verwaltet werden

Tatsächlich bietet OpenSkills zwei Installationsorte für eine flexible Skill-Verwaltung.

---

## Wann Sie diese Funktion verwenden

**Anwendungsszenarien für die beiden Installationsorte**:

| Installationsort | Anwendungsszenario | Beispiele |
| --- | --- | --- |
| **Projektlokal** (Standard) | Projektspezifische Skills, Versionskontrolle erforderlich | Team-Geschäftsregeln, projektspezifische Tools |
| **Globale Installation** (`--global`) | Projekteübergreifend genutzte Skills, keine Versionskontrolle nötig | Allgemeine Code-Generatoren, Dateiformat-Konverter |

::: tip Empfohlene Vorgehensweise

- **Standardmäßig projektlokal installieren**: Lassen Sie Skills dem Projekt folgen, um die Zusammenarbeit im Team und die Versionskontrolle zu erleichtern
- **Nur für allgemeine Tools globale Installation verwenden**: Zum Beispiel `git-helper`, `docker-generator` und andere projektübergreifende Tools
- **Vermeiden Sie übermäßige Globalisierung**: Global installierte Skills werden von allen Projekten geteilt, was zu Konflikten oder Versionsinkonsistenzen führen kann

:::

---

## Kernkonzept: Zwei Orte, flexible Auswahl

Der Installationsort von OpenSkills-Skills wird durch das `--global`-Flag gesteuert:

**Standard (projektlokale Installation)**:
- Installationsort: `./.claude/skills/` (Projektstammverzeichnis)
- Anwendung: Für einzelne, projektspezifische Skills
- Vorteil: Skills folgen dem Projekt, können in Git committet werden, erleichtert die Teamzusammenarbeit

**Globale Installation**:
- Installationsort: `~/.claude/skills/` (Benutzer-Home-Verzeichnis)
- Anwendung: Für alle projektübergreifend genutzten Skills
- Vorteil: Von allen Projekten geteilt, keine wiederholte Installation nötig

::: info Wichtiges Konzept

**Projektlokal**: Skills werden im Verzeichnis `.claude/skills/` des aktuellen Projekts installiert und sind nur für das aktuelle Projekt sichtbar.

**Globale Installation**: Skills werden im Verzeichnis `.claude/skills/` des Benutzer-Home-Verzeichnisses installiert und sind für alle Projekte sichtbar.

:::

---

## Schritt für Schritt

### Schritt 1: Standard-Installationsverhalten anzeigen

**Warum**
Verstehen Sie zuerst die Standard-Installationsmethode, um das Designkonzept von OpenSkills zu begreifen.

Öffnen Sie das Terminal und führen Sie in einem beliebigen Projekt aus:

```bash
# Einen Test-Skill installieren (Standard: projektlokal)
npx openskills install anthropics/skills -y

# Skill-Liste anzeigen
npx openskills list
```

**Sie sollten sehen**: In der Skill-Liste hat jeder Skill ein `(project)`-Label

```
codebase-reviewer (project)
Review code changes for issues...

Summary: 3 project, 0 global (3 total)
```

**Erklärung**:
- Standardmäßig werden Skills im Verzeichnis `./.claude/skills/` installiert
- Der `list`-Befehl zeigt `(project)`- oder `(global)`-Labels an
- Ohne das `--global`-Flag sind Skills standardmäßig nur für das aktuelle Projekt sichtbar

---

### Schritt 2: Skill-Installationsort anzeigen

**Warum**
Bestätigen Sie den tatsächlichen Speicherort der Skill-Dateien für eine einfachere spätere Verwaltung.

Führen Sie im Projektstammverzeichnis aus:

```bash
# Projekt-lokales Skill-Verzeichnis anzeigen
ls -la .claude/skills/

# Inhalt des Skill-Verzeichnisses anzeigen
ls -la .claude/skills/codebase-reviewer/
```

**Sie sollten sehen**:

```
.claude/skills/
├── codebase-reviewer/
│   ├── SKILL.md
│   └── .openskills.json # Installations-Metadaten
├── file-writer/
│   ├── SKILL.md
│   └── .openskills.json
└── ...
```

**Erklärung**:
- Jeder Skill hat sein eigenes Verzeichnis
- `SKILL.md` ist der Kerninhalt des Skills
- `.openskills.json` zeichnet Installationsquelle und Metadaten auf (für Updates)

---

### Schritt 3: Skill global installieren

**Warum**
Lernen Sie den Befehl und die Auswirkungen der globalen Installation kennen.

Führen Sie aus:

```bash
# Einen Skill global installieren
npx openskills install anthropics/skills --global -y

# Skill-Liste erneut anzeigen
npx openskills list
```

**Sie sollten sehen**:

```
codebase-reviewer (project)
Review code changes for issues...
file-writer (global)
Write files with format...

Summary: 1 project, 2 global (3 total)
```

**Erklärung**:
- Mit dem `--global`-Flag werden Skills in `~/.claude/skills/` installiert
- Der `list`-Befehl zeigt das `(global)`-Label an
- Skills mit demselben Namen verwenden bevorzugt die projektlokale Version (Suchpriorität)

---

### Schritt 4: Die beiden Installationsorte vergleichen

**Warum**
Verstehen Sie durch direkten Vergleich die Unterschiede zwischen den beiden Installationsorten.

Führen Sie folgende Befehle aus:

```bash
# Globales Skill-Verzeichnis anzeigen
ls -la ~/.claude/skills/

# Projekt-lokale und global installierte Skills vergleichen
echo "=== Project Skills ==="
ls .claude/skills/

echo "=== Global Skills ==="
ls ~/.claude/skills/
```

**Sie sollten sehen**:

```
=== Project Skills ===
codebase-reviewer
file-writer

=== Global Skills ===
codebase-reviewer
file-writer
test-generator
```

**Erklärung**:
- Projekt-lokale Skills: `./.claude/skills/`
- Globale Skills: `~/.claude/skills/`
- Beide Verzeichnisse können Skills mit demselben Namen enthalten, aber projektlokale haben höhere Priorität

---

### Schritt 5: Suchpriorität verifizieren

**Warum**
Verstehen Sie, wie OpenSkills an mehreren Orten nach Skills sucht.

Führen Sie aus:

```bash
# Gleichnamige Skills an beiden Orten installieren
npx openskills install anthropics/skills -y # Projektlokal
npx openskills install anthropics/skills --global -y # Global

# Skill lesen (verwendet bevorzugt die projektlokale Version)
npx openskills read codebase-reviewer | head -5
```

**Sie sollten sehen**: Die Ausgabe zeigt den Inhalt der projektlokalen Skill-Version.

**Suchprioritätsregeln** (Quellcode `dirs.ts:18-24`):

```typescript
export function getSearchDirs(): string[] {
  return [
    join(process.cwd(), '.claude/skills'), // 1. Projektlokal (höchste Priorität)
    join(homedir(), '.claude/skills'),     // 2. Global
  ];
}
```

**Erklärung**:
- Projektlokale Skills haben höhere Priorität als globale
- Wenn gleichnamige Skills existieren, wird bevorzugt die projektlokale Version verwendet
- Dies ermöglicht eine flexible "Projekt überschreibt Global"-Konfiguration

---

## Checkpoint ✅

Überprüfen Sie folgende Punkte, um zu bestätigen, dass Sie den Inhalt dieses Tutorials beherrschen:

- [ ] Können zwischen projektlokaler und globaler Installation unterscheiden
- [ ] Wissen, welche Funktion das `--global`-Flag hat
- [ ] Verstehen die Suchprioritätsregeln für Skills
- [ ] Können je nach Szenario den passenden Installationsort wählen
- [ ] Wissen, wie man die Positions-Labels installierter Skills anzeigt

---

## Fallstricke

### Häufiger Fehler 1: Falsche Verwendung der globalen Installation

**Fehlerszenario**: Projektspezifische Skills global installieren

```bash
# ❌ Falsch: Team-Geschäftsregeln sollten nicht global installiert werden
npx openskills install my-company/rules --global
```

**Problem**:
- Andere Teammitglieder können den Skill nicht erhalten
- Der Skill wird nicht versionskontrolliert
- Mögliche Konflikte mit Skills anderer Projekte

**Korrekte Vorgehensweise**:

```bash
# ✅ Richtig: Projektspezifische Skills verwenden die Standardinstallation (projektlokal)
npx openskills install my-company/rules
```

---

### Häufiger Fehler 2: `--global`-Flag vergessen

**Fehlerszenario**: Möchten, dass alle Skills projektübergreifend geteilt werden, vergessen aber das `--global`

```bash
# ❌ Falsch: Standardmäßig projektlokal installiert, andere Projekte können es nicht verwenden
npx openskills install universal-tool
```

**Problem**:
- Der Skill wird nur im `./.claude/skills/` des aktuellen Projekts installiert
- Nach dem Wechsel zu anderen Projekten muss erneut installiert werden

**Korrekte Vorgehensweise**:

```bash
# ✅ Richtig: Allgemeine Tools verwenden globale Installation
npx openskills install universal-tool --global
```

---

### Häufiger Fehler 3: Konflikt gleichnamiger Skills

**Fehlerszenario**: Gleichnamige Skills sind projektlokal und global installiert, aber die globale Version soll verwendet werden

```bash
# Sowohl projektlokal als auch global ist codebase-reviewer installiert
# Aber die globale Version (neuere) soll verwendet werden
npx openskills install codebase-reviewer --global # Neue Version installieren
npx openskills read codebase-reviewer # ❌ Liest trotzdem die alte Version
```

**Problem**:
- Projektlokale Versionen haben höhere Priorität
- Selbst wenn die neue Version global installiert ist, wird die projektlokale alte Version gelesen

**Korrekte Vorgehensweise**:

```bash
# Option 1: Projektlokale Version löschen
npx openskills remove codebase-reviewer # Projektlokal löschen
npx openskills read codebase-reviewer # ✅ Jetzt wird die globale Version gelesen

# Option 2: Projektlokal aktualisieren
npx openskills update codebase-reviewer # Projektlokale Version aktualisieren
```

---

## Zusammenfassung

**Kernpunkte**:

1. **Standardmäßig projektlokal installieren**: Skills werden in `./.claude/skills/` installiert und sind nur für das aktuelle Projekt sichtbar
2. **Globale Installation mit `--global`**: Skills werden in `~/.claude/skills/` installiert und von allen Projekten geteilt
3. **Suchpriorität**: Projektlokal > Global
4. **Empfohlene Prinzipien**: Projektspezifisch = lokal, allgemeine Tools = global

**Entscheidungsablauf**:

```
[Skill muss installiert werden] → [Ist er projektspezifisch?]
↓ Ja
[Projektlokale Installation (Standard)]
↓ Nein
[Versionskontrolle erforderlich?]
↓ Ja
[Projektlokale Installation (kann in Git committet werden)]
↓ Nein
[Globale Installation (--global)]
```

**Merkspruch**:

- **Projektlokal**: Skills folgen dem Projekt, Teamarbeit ohne Sorgen
- **Globale Installation**: Allgemeine Tools global ablegen, von allen Projekten nutzbar

---

## Vorschau auf das nächste Tutorial

> Im nächsten Tutorial lernen Sie **[Installierte Skills auflisten](../list-skills/)**.
>
> Sie lernen:
> - Wie man alle installierten Skills anzeigt
> - Die Bedeutung der Positions-Labels verstehen
> - Wie man projekt- und global installierte Skills zählt
> - Wie man Skills nach Installationsort filtert

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-24

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| Installationsort-Bestimmung | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L84-L92) | 84-92 |
| Verzeichnis-Pfad-Tools | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts#L7-L25) | 7-25 |
| Skill-Listenanzeige | [`src/commands/list.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/list.ts#L20-L43) | 20-43 |

**Wichtige Konstanten**:
- `.claude/skills`: Standard-Skill-Verzeichnis (Claude Code kompatibel)
- `.agent/skills`: Allgemeines Skill-Verzeichnis (Multi-Agent-Umgebung)

**Wichtige Funktionen**:
- `getSkillsDir(projectLocal, universal)`: Gibt Skill-Verzeichnispfad basierend auf Flags zurück
- `getSearchDirs()`: Gibt Liste der Skill-Suchverzeichnisse zurück (nach Priorität sortiert)
- `listSkills()`: Listet alle installierten Skills auf, zeigt Positions-Labels an

**Geschäftsregeln**:
- Standardmäßig projektlokal installieren (`!options.global`)
- Skill-Suchpriorität: Projektlokal > Global
- `list`-Befehl zeigt `(project)`- und `(global)`-Labels an

</details>

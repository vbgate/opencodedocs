---
title: "Skills aktualisieren: Bleib auf dem neuesten Stand | opencode-openskills"
sidebarTitle: "One-Click Skill-Update"
subtitle: "Skills aktualisieren: Bleib auf dem neuesten Stand"
description: "Lerne den OpenSkills update-Befehl, um installierte Skills zu aktualisieren. Unterstützt die Massenaktualisierung aller Skills oder die Angabe bestimmter Skills. Verstehe den Unterschied zwischen lokalen Pfaden und Git-Repository-Updates und halte deine Skills auf dem neuesten Stand."
tags:
  - "skills"
  - "update"
  - "git"
prerequisite:
  - "start-installation"
  - "start-first-skill"
order: 5
---

# Skills aktualisieren: Immer synchron mit dem Quell-Repository

## Was du nach diesem Tutorial können wirst

In dieser Lektion lernst du, wie du deine OpenSkills-Skills immer auf dem neuesten Stand hältst. Mit dem OpenSkills update-Befehl kannst du:

- Alle installierten Skills mit einem Klick aktualisieren
- Nur bestimmte Skills aktualisieren
- Die Unterschiede bei der Aktualisierung aus verschiedenen Quellen verstehen
- Gründe für fehlgeschlagene Updates erkennen und beheben

## Dein aktuelles Dilemma

Skill-Repositories werden ständig aktualisiert – die Autoren beheben Bugs, fügen neue Funktionen hinzu und verbessern die Dokumentation. Aber deine installierten Skills sind noch auf einer alten Version.

Vielleicht hast du bereits diese Situationen erlebt:
- Die Skill-Dokumentation sagt "unterstützt eine bestimmte Funktion", aber dein AI-Agent sagt, er kennt sie nicht
- Der Skill hat bessere Fehlermeldungen erhalten, aber du siehst immer noch die alten
- Der Bug, den du beim Installieren hattest, wurde behoben, aber du bist immer noch betroffen

**Jedes Mal löschen und neu installieren ist zu mühsam** – du brauchst einen effizienteren Weg zur Aktualisierung.

## Wann du diese Funktion verwenden solltest

Typische Szenarien für die Verwendung des `update`-Befehls:

| Szenario | Aktion |
| --- | ---|
| Entdecke ein Skill-Update | Führe `openskills update` aus |
| Aktualisiere nur einige Skills | `openskills update skill1,skill2` |
| Teste lokal entwickelte Skills | Aktualisiere vom lokalen Pfad |
| Aktualisiere vom GitHub-Repository | Klone den neuesten Code automatisch |

::: tip Empfohlene Aktualisierungsfrequenz
- **Community-Skills**: Einmal pro Monat aktualisieren, um die neuesten Verbesserungen zu erhalten
- **Selbst entwickelte Skills**: Nach jeder Änderung manuell aktualisieren
- **Lokale Pfad-Skills**: Nach jeder Code-Änderung aktualisieren
:::

## 🎒 Vorbereitungen vor dem Start

Bevor du beginnst, stelle sicher, dass du folgendes erledigt hast:

- [x] OpenSkills ist installiert (siehe [OpenSkills installieren](../../start/installation/))
- [x] Mindestens ein Skill ist installiert (siehe [Der erste Skill](../../start/first-skill/))
- [x] Wenn du von GitHub installiert hast, stelle sicher, dass du eine Internetverbindung hast

## Kernkonzept

Der Aktualisierungsmechanismus von OpenSkills ist einfach:

**Quellinformationen bei jeder Installation speichern → Beim Aktualisieren vom ursprünglichen Quellort neu kopieren**

::: info Warum muss neu installiert werden?
Alte Skill-Versionen (installiert, ohne Quellen zu erfassen) können nicht aktualisiert werden. In diesem Fall muss der Skill einmal neu installiert werden. OpenSkills speichert dann die Quelle und kann ihn danach automatisch aktualisieren.
:::

**Aktualisierungsmethoden für drei Installationsquellen**:

| Quelltyp | Aktualisierungsmethode | Anwendungsszenario |
| --- | --- | ---|
| **Lokaler Pfad** | Direkte Kopie vom lokalen Pfad | Entwicklung eigener Skills |
| **Git-Repository** | Klone neuesten Code in temporäres Verzeichnis | Installation von GitHub/GitLab |
| **GitHub-Kurzschreibweise** | In vollständige URL konvertieren und klonen | Installation von offiziellen GitHub-Repositories |

Beim Aktualisieren werden Skills ohne Quell-Metadaten übersprungen, und die Namen der Skills, die neu installiert werden müssen, werden aufgelistet.

## Mach mit

### Schritt 1: Installierte Skills anzeigen

Bestätige zunächst, welche Skills aktualisiert werden können:

```bash
npx openskills list
```

**Du solltest sehen**: Eine Liste der installierten Skills mit Name, Beschreibung und Installationstags (project/global)

### Schritt 2: Alle Skills aktualisieren

Der einfachste Weg ist die Aktualisierung aller installierten Skills:

```bash
npx openskills update
```

**Du solltest sehen**: Skills werden nacheinander aktualisiert, jeder Skill zeigt das Aktualisierungsergebnis

```
✅ Updated: git-workflow
✅ Updated: check-branch-first
Skipped: my-old-skill (no source metadata; re-install once to enable updates)
Summary: 2 updated, 1 skipped (3 total)
```

::: details Bedeutung von übersprungenen Skills
Wenn du `Skipped: xxx (no source metadata)` siehst, wurde dieser Skill installiert, bevor die Aktualisierungsfunktion hinzugefügt wurde. Du musst ihn einmal neu installieren, um automatische Aktualisierungen zu ermöglichen.
:::

### Schritt 3: Bestimmte Skills aktualisieren

Wenn du nur bestimmte Skills aktualisieren möchtest, gib die Skill-Namen an (kommagetrennt):

```bash
npx openskills update git-workflow,check-branch-first
```

**Du solltest sehen**: Nur die beiden angegebenen Skills wurden aktualisiert

```
✅ Updated: git-workflow
✅ Updated: check-branch-first
Summary: 2 updated, 0 skipped (2 total)
```

### Schritt 4: Lokal entwickelte Skills aktualisieren

Wenn du gerade einen Skill lokal entwickelst, kannst du ihn vom lokalen Pfad aktualisieren:

```bash
npx openskills update my-skill
```

**Du solltest sehen**: Der Skill wurde vom lokalen Pfad, der während der Installation angegeben wurde, neu kopiert

```
✅ Updated: my-skill
Summary: 1 updated, 0 skipped (1 total)
```

::: tip Workflow für die lokale Entwicklung
Entwicklungsprozess:
1. Skill installieren: `openskills install ./my-skill`
2. Code ändern
3. Skill aktualisieren: `openskills update my-skill`
4. Mit AGENTS.md synchronisieren: `openskills sync`
:::

### Schritt 5: Fehler bei der Aktualisierung beheben

Wenn bestimmte Skills nicht aktualisiert werden können, zeigt OpenSkills den detaillierten Grund an:

```bash
npx openskills update
```

**Mögliche Situationen, die du sehen könntest**:

```
Skipped: git-workflow (git clone failed)
Skipped: my-skill (local source missing)
Missing source metadata (1): old-skill
Clone failed (1): git-workflow
```

**Entsprechende Lösungen**:

| Fehlermeldung | Ursache | Lösung |
| --- | --- | ---|
| `no source metadata` | Installation alter Version | Neu installieren: `openskills install <source>` |
| `local source missing` | Lokaler Pfad wurde gelöscht | Wiederherstellung des lokalen Pfads oder Neuinstallation |
| `SKILL.md missing at local source` | Lokale Datei wurde gelöscht | Wiederherstellung der SKILL.md-Datei |
| `git clone failed` | Netzwerkproblem oder Repository existiert nicht | Netzwerkverbindung oder Repository-Adresse prüfen |
| `SKILL.md not found in repo` | Repository-Struktur hat sich geändert | Skill-Autor kontaktieren oder subpath aktualisieren |

## Prüfpunkte ✅

Stelle sicher, dass du gelernt hast:

- [ ] Wie man mit `openskills update` alle Skills aktualisiert
- [ ] Wie man bestimmte Skills mit Kommata getrennt aktualisiert
- [ ] Die Bedeutung von "übersprungenen" Skills und deren Lösungen
- [ ] Den Aktualisierungsworkflow für lokal entwickelte Skills

## Warnhinweise

### ❌ Häufige Fehler

| Fehler | Richtige Vorgehensweise |
| --- | ---|
| Bei "Skipped" nichts tun | Nach Hinweis neu installieren oder Problem beheben |
| Jedes Mal löschen und neu installieren | `update`-Befehl ist effizienter |
| Nicht wissen, woher der Skill stammt | Mit `openskills list` die Quelle anzeigen |

### ⚠️ Wichtige Hinweise

**Aktualisierung überschreibt lokale Änderungen**

Wenn du Dateien direkt im Installationsverzeichnis des Skills geändert hast, werden diese Änderungen bei der Aktualisierung überschrieben. Die richtige Vorgehensweise ist:
1. Ändere die **Quelldateien** (lokaler Pfad oder Repository)
2. Führe dann `openskills update` aus

**Symbolische Links erfordern besondere Behandlung**

Wenn der Skill über einen symbolischen Link installiert wurde (siehe [Symlink-Unterstützung](../../advanced/symlink-support/)), wird beim Aktualisieren der Link neu erstellt, ohne die symbolische Link-Beziehung zu zerstören.

**Globale und Projekt-Skills müssen separat aktualisiert werden**

```bash
# Nur Projekt-Skills aktualisieren (Standard)
openskills update

# Globale Skills müssen separat behandelt werden
# Oder im --universal-Modus für einheitliche Verwaltung verwenden
```

## Zusammenfassung dieser Lektion

In dieser Lektion haben wir die Aktualisierungsfunktion von OpenSkills kennengelernt:

- **Massenaktualisierung**: `openskills update` aktualisiert alle Skills mit einem Klick
- **Gezielte Aktualisierung**: `openskills update skill1,skill2` aktualisiert bestimmte Skills
- **Quellenerkennung**: Automatische Erkennung von lokalen Pfaden und Git-Repositories
- **Fehlermeldungen**: Detaillierte Erläuterung der Gründe für übersprungene Skills und deren Lösungen

Die Aktualisierungsfunktion hält deine Skills auf der neuesten Version und stellt sicher, dass du immer die neuesten Verbesserungen und Fehlerbehebungen nutzt.

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Skills entfernen](../remove-skills/)**.
>
> Du wirst lernen:
> - Wie man mit dem interaktiven `manage`-Befehl Skills entfernt
> - Wie man mit dem `remove`-Befehl das Entfernen skriptet
> - Was nach dem Entfernen eines Skills zu beachten ist

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcode-Standort anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-24

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Hauptlogik für Skill-Aktualisierung | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L14-L150) | 14-150 |
| Aktualisierung vom lokalen Pfad | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L64-L82) | 64-82 |
| Aktualisierung vom Git-Repository | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L85-L125) | 85-125 |
| Skill aus Verzeichnis kopieren | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L152-L163) | 152-163 |
| Pfadsicherheitsvalidierung | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L165-L172) | 165-172 |
| Metadaten-Strukturdefinition | [`src/utils/skill-metadata.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-metadata.ts#L8-L15) | 8-15 |
| Skill-Metadaten lesen | [`src/utils/skill-metadata.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-metadata.ts#L17-L27) | 17-27 |
| Skill-Metadaten schreiben | [`src/utils/skill-metadata.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-metadata.ts#L29-L36) | 29-36 |
| CLI-Befehlsdefinition | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L58-L62) | 58-62 |

**Wichtige Konstanten**:
- `SKILL_METADATA_FILE = '.openskills.json'`: Name der Metadatendatei, zeichnet die Installationsquelle des Skills auf

**Wichtige Funktionen**:
- `updateSkills(skillNames)`: Hauptfunktion zum Aktualisieren bestimmter oder aller Skills
- `updateSkillFromDir(targetPath, sourceDir)`: Kopiert Skill vom Quellverzeichnis zum Zielverzeichnis
- `isPathInside(targetPath, targetDir)`: Validiert Installationssicherheit (verhindert Path Traversal)
- `readSkillMetadata(skillDir)`: Liest Metadaten des Skills
- `writeSkillMetadata(skillDir, metadata)`: Schreibt/aktualisiert Metadaten des Skills

**Geschäftsregeln**:
- **BR-5-1**: Standardmäßig alle installierten Skills aktualisieren (update.ts:37-38)
- **BR-5-2**: Unterstützt kommagetrennte Liste von Skill-Namen (update.ts:15)
- **BR-5-3**: Überspringt Skills ohne Quell-Metadaten (update.ts:56-62)
- **BR-5-4**: Unterstützt Aktualisierung vom lokalen Pfad (update.ts:64-82)
- **BR-5-5**: Unterstützt Aktualisierung vom Git-Repository (update.ts:85-125)
- **BR-5-6**: Validiert Pfadsicherheit (update.ts:156-162)

</details>

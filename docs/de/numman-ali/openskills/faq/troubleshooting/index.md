---
title: "Fehlerbehebung: Häufige OpenSkills-Probleme lösen | openskills"
sidebarTitle: "Was tun bei Fehlern"
subtitle: "Fehlerbehebung: Häufige OpenSkills-Probleme lösen"
description: "Lösen Sie häufige OpenSkills-Fehler. Dieses Tutorial deckt Git-Clone-Fehler, fehlende SKILL.md, Skill nicht gefunden, Berechtigungsfehler, Update-Überspringen und mehr ab. Es bietet detaillierte Schritte zur Fehlerbehebung und Behebungsmethoden, um Ihnen zu helfen, verschiedene Probleme schnell zu lösen."
tags:
  - FAQ
  - Fehlerbehebung
  - Fehlerbehebung
prerequisite:
  - "start-quick-start"
  - "start-installation"
order: 2
---

# Fehlerbehebung: Häufige OpenSkills-Probleme lösen

## Was Sie nach diesem Tutorial können

- Schnell häufige OpenSkills-Probleme diagnostizieren und beheben
- Die Gründe hinter Fehlermeldungen verstehen
- Techniken zur Fehlerbehebung bei Git-Clone, Berechtigungen, Dateiformaten usw. beherrschen
- Wissen, wann eine Neuinstallation eines Skills erforderlich ist

## Ihre aktuelle Situation

Sie sind auf Fehler gestoßen, während Sie OpenSkills verwendet, und wissen nicht, was zu tun ist:

```
Error: No SKILL.md files found in repository
```

Oder Git-Clone schlägt fehl, Berechtigungsfehler, falsches Dateiformat... Diese Probleme können alle dazu führen, dass Skills nicht normal funktionieren.

## Wann Sie dieses Tutorial lesen sollten

Wenn Sie auf die folgenden Situationen stoßen:

- **Installationsfehler**: Fehler bei der Installation von GitHub oder einem lokalen Pfad
- **Lesefehler**: `openskills read` zeigt an, dass der Skill nicht gefunden wurde
- **Synchronisationsfehler**: `openskills sync` zeigt an, dass kein Skill vorhanden ist oder ein Dateiformatfehler aufgetreten ist
- **Update-Fehler**: `openskills update` überspringt bestimmte Skills
- **Berechtigungsfehler**: Zeigt an, dass der Pfadzugriff eingeschränkt ist oder ein Sicherheitsfehler aufgetreten ist

## Kernkonzept

OpenSkills-Fehler lassen sich hauptsächlich in 4 Kategorien einteilen:

| Fehlertyp | Häufige Ursachen | Lösungsansatz |
|---|---|---|
| **Git-bezogen** | Netzwerkprobleme, SSH-Konfiguration, Repository existiert nicht | Netzwerk prüfen, Git-Anmeldeinformationen konfigurieren, Repository-Adresse validieren |
| **Dateibezogen** | SKILL.md fehlt, Formatfehler, Pfadfehler | Dateiexistenz prüfen, YAML-Format validieren |
| **Berechtigungsbezogen** | Verzeichnisberechtigungen, Pfad-Traversal, symbolische Links | Verzeichnisberechtigungen prüfen, Installationspfad validieren |
| **Metadaten-bezogen** | Metadatenverlust beim Update, Quellpfadänderungen | Skill neu installieren, um Metadaten wiederherzustellen |

**Fehlerbehebungstipps**:
1. **Fehlermeldung lesen**: Die rote Ausgabe enthält normalerweise den spezifischen Grund
2. **Gelbe Hinweise beachten**: Dies sind normalerweise Warnungen und Vorschläge, wie z.B. `Tip: For private repos...`
3. **Verzeichnisstruktur prüfen**: Mit `openskills list` installierte Skills anzeigen
4. **Quellcode-Position anzeigen**: Fehlermeldungen listen die Suchpfade auf (4 Verzeichnisse)

---

## Installationsfehler

### Problem 1: Git-Clone schlägt fehl

**Fehlermeldung**:
```
Failed to clone repository
fatal: repository '...' not found
Tip: For private repos, ensure git SSH keys or credentials are configured
```

**Mögliche Ursachen**:

| Ursache | Szenario |
|---|---|
| Repository existiert nicht | Falsch geschriebener owner/repo |
| Privates Repository | SSH-Key oder Git-Anmeldeinformationen nicht konfiguriert |
| Netzwerkproblem | Kein Zugriff auf GitHub möglich |

**Lösungsmethoden**:

1. **Repository-Adresse validieren**:
   ```bash
   # Repository-URL im Browser aufrufen
   https://github.com/owner/repo
   ```

2. **Git-Konfiguration prüfen** (privates Repository):
   ```bash
   # SSH-Konfiguration prüfen
   ssh -T git@github.com

   # Git-Anmeldeinformationen konfigurieren
   git config --global credential.helper store
   ```

3. **Clone testen**:
   ```bash
   git clone https://github.com/owner/repo.git
   ```

**Sie sollten sehen**:
- Repository erfolgreich in das lokale Verzeichnis geklont

---

### Problem 2: SKILL.md nicht gefunden

**Fehlermeldung**:
```
Error: No SKILL.md files found in repository
Error: No valid SKILL.md files found
```

**Mögliche Ursachen**:

| Ursache | Beschreibung |
|---|---|
| Repository hat kein SKILL.md | Repository ist kein Skill-Repository |
| SKILL.md hat kein Frontmatter | YAML-Metadaten fehlen |
| SKILL.md Formatfehler | YAML-Syntaxfehler |

**Lösungsmethoden**:

1. **Repository-Struktur prüfen**:
   ```bash
   # Repository-Root anzeigen
   ls -la

   # Nach SKILL.md suchen
   find . -name "SKILL.md"
   ```

2. **SKILL.md-Format validieren**:
   ```markdown
   ---
   name: Skill-Name
   description: Skill-Beschreibung
   ---

   Skill-Inhalt...
   ```

   **Erforderlich**:
   - YAML-Frontmatter am Anfang mit `---`-Trennzeichen
   - Enthält `name`- und `description`-Felder

3. **Offizielles Beispiel ansehen**:
   ```bash
   git clone https://github.com/anthropics/skills.git
   cd skills
   ls -la
   ```

**Sie sollten sehen**:
- Repository enthält eine oder mehrere `SKILL.md`-Dateien
- Jede SKILL.md hat ein YAML-Frontmatter am Anfang

---

### Problem 3: Pfad existiert nicht oder ist kein Verzeichnis

**Fehlermeldung**:
```
Error: Path does not exist: /path/to/skill
Error: Path must be a directory
```

**Mögliche Ursachen**:

| Ursache | Beschreibung |
|---|---|
| Pfad falsch geschrieben | Falscher Pfad eingegeben |
| Pfad zeigt auf Datei | Sollte Verzeichnis sein, nicht Datei |
| Pfad nicht erweitert | `~` muss erweitert werden |

**Lösungsmethoden**:

1. **Pfadexistenz validieren**:
   ```bash
   # Pfad prüfen
   ls -la /path/to/skill

   # Prüfen, ob es ein Verzeichnis ist
   file /path/to/skill
   ```

2. **Absoluten Pfad verwenden**:
   ```bash
   # Absoluten Pfad ermitteln
   realpath /path/to/skill

   # Bei Installation absoluten Pfad verwenden
   openskills install /absolute/path/to/skill
   ```

3. **Relativen Pfad verwenden**:
   ```bash
   # Im Projektverzeichnis
   openskills install ./skills/my-skill
   ```

**Sie sollten sehen**:
- Pfad existiert und ist ein Verzeichnis
- Verzeichnis enthält eine `SKILL.md`-Datei

---

### Problem 4: SKILL.md ungültig

**Fehlermeldung**:
```
Error: Invalid SKILL.md (missing YAML frontmatter)
```

**Mögliche Ursachen**:

| Ursache | Beschreibung |
|---|---|
| Erforderliche Felder fehlen | Muss `name` und `description` enthalten |
| YAML-Syntaxfehler | Formatierungsprobleme mit Doppelpunkten, Anführungszeichen |

**Lösungsmethoden**:

1. **YAML-Frontmatter prüfen**:
   ```markdown
   ---              ← Start-Trennzeichen
   name: my-skill   ← Erforderlich
   description: Skill-Beschreibung  ← Erforderlich
   ---              ← End-Trennzeichen
   ```

2. **Online-YAML-Validierungswerkzeug verwenden**:
   - YAML Lint oder ähnliches Tool besuchen, um Syntax zu validieren

3. **Offizielles Beispiel referenzieren**:
   ```bash
   openskills install anthropics/skills
   cat .claude/skills/*/SKILL.md | head -20
   ```

**Sie sollten sehen**:
- SKILL.md hat korrektes YAML-Frontmatter am Anfang
- Enthält `name`- und `description`-Felder

---

### Problem 5: Pfad-Traversal-Sicherheitsfehler

**Fehlermeldung**:
```
Security error: Installation path outside target directory
```

**Mögliche Ursachen**:

| Ursache | Beschreibung |
|---|---|
| Skill-Name enthält `..` | Versucht, auf Pfad außerhalb des Zielverzeichnisses zuzugreifen |
| Symbolischer Link zeigt nach außen | Symlink zeigt außerhalb des Zielverzeichnisses |
| Bösartiger Skill | Skill versucht, Sicherheitsbeschränkungen zu umgehen |

**Lösungsmethoden**:

1. **Skill-Namen prüfen**:
   - Sicherstellen, dass der Skill-Name keine `..`, `/` oder anderen Sonderzeichen enthält

2. **Symbolische Links prüfen**:
   ```bash
   # Symbolische Links im Skill-Verzeichnis anzeigen
   find .claude/skills/skill-name -type l

   # Ziel des symbolischen Links anzeigen
   ls -la .claude/skills/skill-name
   ```

3. **Sichere Skills verwenden**:
   - Nur aus vertrauenswürdigen Quellen installieren
   - Skill-Code vor der Installation überprüfen

**Sie sollten sehen**:
- Skill-Name enthält nur Buchstaben, Zahlen, Bindestriche
- Keine nach außen zeigenden symbolischen Links

---

## Lesefehler

### Problem 6: Skill nicht gefunden

**Fehlermeldung**:
```
Error: Skill(s) not found: my-skill

Searched:
  .agent/skills/ (project universal)
  ~/.agent/skills/ (global universal)
  .claude/skills/ (project)
  ~/.claude/skills/ (global)

Install skills: npx openskills install owner/repo
```

**Mögliche Ursachen**:

| Ursache | Beschreibung |
|---|---|
| Skill nicht installiert | Der Skill ist in keinem Verzeichnis installiert |
| Falsch geschriebener Skill-Name | Name stimmt nicht überein |
| Installation an anderem Ort | Skill in einem nicht standardmäßigen Verzeichnis installiert |

**Lösungsmethoden**:

1. **Installierte Skills anzeigen**:
   ```bash
   openskills list
   ```

2. **Skill-Namen prüfen**:
   - Mit `openskills list` Ausgabe vergleichen
   - Sicherstellen, dass der Name exakt übereinstimmt (Groß-/Kleinschreibung beachten)

3. **Fehlenden Skill installieren**:
   ```bash
   openskills install owner/repo
   ```

4. **Alle Verzeichnisse durchsuchen**:
   ```bash
   # 4 Skill-Verzeichnisse prüfen
   ls -la .agent/skills/
   ls -la ~/.agent/skills/
   ls -la .claude/skills/
   ls -la ~/.claude/skills/
   ```

**Sie sollten sehen**:
- `openskills list` zeigt den Ziel-Skill an
- Skill existiert in einem der 4 Verzeichnisse

---

### Problem 7: Kein Skill-Name angegeben

**Fehlermeldung**:
```
Error: No skill names provided
```

**Mögliche Ursachen**:

| Ursache | Beschreibung |
|---|---|
| Parameter vergessen | Kein Parameter nach `openskills read` |
| Leerer String | Leerer String übergeben |

**Lösungsmethoden**:

1. **Skill-Namen angeben**:
   ```bash
   # Einzelner Skill
   openskills read my-skill

   # Mehrere Skills (durch Komma getrennt)
   openskills read skill1,skill2,skill3
   ```

2. **Verfügbare Skills zuerst anzeigen**:
   ```bash
   openskills list
   ```

**Sie sollten sehen**:
- Skill-Inhalt erfolgreich in die Standardausgabe gelesen

---

## Synchronisationsfehler

### Problem 8: Ausgabedatei ist keine Markdown-Datei

**Fehlermeldung**:
```
Error: Output file must be a markdown file (.md)
```

**Mögliche Ursachen**:

| Ursache | Beschreibung |
|---|---|
| Ausgabedatei ist keine .md | Format wie .txt, .json angegeben |
| --output Parameter falsch | Pfad endet nicht mit .md |

**Lösungsmethoden**:

1. **.md-Datei verwenden**:
   ```bash
   # Korrekt
   openskills sync -o AGENTS.md
   openskills sync -o custom.md

   # Falsch
   openskills sync -o AGENTS.txt
   openskills sync -o AGENTS
   ```

2. **Benutzerdefinierten Ausgabepfad verwenden**:
   ```bash
   # In Unterverzeichnis ausgeben
   openskills sync -o .ruler/AGENTS.md
   openskills sync -o docs/agents.md
   ```

**Sie sollten sehen**:
- .md-Datei erfolgreich generiert
- Datei enthält Skill-XML-Abschnitte

---

### Problem 9: Keine Skills installiert

**Fehlermeldung**:
```
No skills installed. Install skills first:
  npx openskills install anthropics/skills --project
```

**Mögliche Ursachen**:

| Ursache | Beschreibung |
|---|---|
| Noch nie Skills installiert | Erstmalige OpenSkills-Verwendung |
| Skill-Verzeichnis gelöscht | Skill-Dateien manuell gelöscht |

**Lösungsmethoden**:

1. **Skills installieren**:
   ```bash
   # Offizielle Skills installieren
   openskills install anthropics/skills

   # Aus anderem Repository installieren
   openskills install owner/repo
   ```

2. **Installation verifizieren**:
   ```bash
   openskills list
   ```

**Sie sollten sehen**:
- `openskills list` zeigt mindestens einen Skill an
- Synchronisation erfolgreich

---

## Update-Fehler

### Problem 10: Keine Quell-Metadaten

**Fehlermeldung**:
```
Skipped: my-skill (no source metadata; re-install once to enable updates)
```

**Mögliche Ursachen**:

| Ursache | Beschreibung |
|---|---|
| Mit alter Version installiert | Skill vor der Metadaten-Funktion installiert |
| Manuell kopiert | Skill-Verzeichnis direkt kopiert, nicht über OpenSkills installiert |
| Metadaten-Datei beschädigt | `.openskills.json` beschädigt oder verloren |

**Lösungsmethoden**:

1. **Skill neu installieren**:
   ```bash
   # Alten Skill löschen
   openskills remove my-skill

   # Neu installieren
   openskills install owner/repo
   ```

2. **Metadaten-Datei prüfen**:
   ```bash
   # Skill-Metadaten anzeigen
   cat .claude/skills/my-skill/.openskills.json
   ```

3. **Skill behalten, aber Metadaten hinzufügen**:
   - `.openskills.json` manuell erstellen (nicht empfohlen)
   - Neuinstallation ist einfacher und zuverlässiger

**Sie sollten sehen**:
- Update erfolgreich, keine Überspring-Warnungen

---

### Problem 11: Lokale Quelle fehlt

**Fehlermeldung**:
```
Skipped: my-skill (local source missing)
```

**Mögliche Ursachen**:

| Ursache | Beschreibung |
|---|---|
| Lokaler Pfad verschoben | Quellverzeichnis hat Position geändert |
| Lokaler Pfad gelöscht | Quellverzeichnis existiert nicht mehr |
| Pfad nicht erweitert | `~` verwendet, aber Metadaten speichern erweiterten Pfad |

**Lösungsmethoden**:

1. **Lokalen Pfad in Metadaten prüfen**:
   ```bash
   cat .claude/skills/my-skill/.openskills.json
   ```

2. **Quellverzeichnis wiederherstellen oder Metadaten aktualisieren**:
   ```bash
   # Wenn sich das Quellverzeichnis verschoben hat
   openskills remove my-skill
   openskills install /new/path/to/skill

   # Oder Metadaten manuell bearbeiten (nicht empfohlen)
   vi .claude/skills/my-skill/.openskills.json
   ```

**Sie sollten sehen**:
- Lokaler Quellpfad existiert und enthält `SKILL.md`

---

### Problem 12: SKILL.md nicht im Repository gefunden

**Fehlermeldung**:
```
SKILL.md missing for my-skill
Skipped: my-skill (SKILL.md not found in repo at subpath)
```

**Mögliche Ursachen**:

| Ursache | Beschreibung |
|---|---|
| Repository-Struktur geändert | Skill-Unterpfad oder Name geändert |
| Skill gelöscht | Skill nicht mehr im Repository enthalten |
| Unterpfad falsch | In Metadaten aufgezeichneter Unterpfad inkorrekt |

**Lösungsmethoden**:

1. **Repository-Struktur ansehen**:
   ```bash
   # Repository klonen und ansehen
   git clone https://github.com/owner/repo.git
   cd repo
   ls -la
   find . -name "SKILL.md"
   ```

2. **Skill neu installieren**:
   ```bash
   openskills remove my-skill
   openskills install owner/repo/subpath
   ```

3. **Repository-Update-Verlauf prüfen**:
   - Commit-Verlauf des Repositories auf GitHub ansehen
   - Nach Datensätzen von Skill-Verschiebungen oder -Löschungen suchen

**Sie sollten sehen**:
- Update erfolgreich
- SKILL.md existiert im aufgezeichneten Unterpfad

---

## Berechtigungsprobleme

### Problem 13: Verzeichnisberechtigungen eingeschränkt

**Symptome**:

| Operation | Symptom |
|---|---|
| Installation schlägt fehl | Berechtigungsfehler angezeigt |
| Löschung schlägt fehl | Kann Datei nicht löschen angezeigt |
| Lesen schlägt fehl | Dateizugriff eingeschränkt angezeigt |

**Mögliche Ursachen**:

| Ursache | Beschreibung |
|---|---|
| Unzureichende Verzeichnisberechtigungen | Benutzer hat keine Schreibberechtigung |
| Unzureichende Dateiberechtigungen | Datei ist schreibgeschützt |
| Systemschutz | macOS SIP, Windows UAC-Einschränkungen |

**Lösungsmethoden**:

1. **Verzeichnisberechtigungen prüfen**:
   ```bash
   # Berechtigungen anzeigen
   ls -la .claude/skills/

   # Berechtigungen ändern (vorsichtig verwenden)
   chmod -R 755 .claude/skills/
   ```

2. **Sudo verwenden (nicht empfohlen)**:
   ```bash
   # Letzter Ausweg
   sudo openskills install owner/repo
   ```

3. **Systemsicherheit prüfen**:
   ```bash
   # macOS: SIP-Status prüfen
   csrutil status

   # Zum Deaktivieren von SIP (Wiederherstellungsmodus erforderlich)
   # Nicht empfohlen, nur bei Bedarf verwenden
   ```

**Sie sollten sehen**:
- Normales Lesen/Schreiben von Verzeichnissen und Dateien

---

## Symbolische Link-Probleme

### Problem 14: Symbolischer Link beschädigt

**Symptome**:

| Symptom | Beschreibung |
|---|---|
| Skill wird beim Auflisten übersprungen | `openskills list` zeigt den Skill nicht an |
| Lesen schlägt fehl | Zeigt an, dass Datei nicht existiert |
| Update schlägt fehl | Quellpfad ungültig |

**Mögliche Ursachen**:

| Ursache | Beschreibung |
|---|---|
| Zielverzeichnis gelöscht | Symbolischer Link zeigt auf nicht existierenden Pfad |
| Symbolischer Link beschädigt | Link-Datei selbst beschädigt |
| Geräteübergreifender Link | Einige Systeme unterstützen keine geräteübergreifenden symbolischen Links |

**Lösungsmethoden**:

1. **Symbolische Links prüfen**:
   ```bash
   # Alle symbolischen Links finden
   find .claude/skills -type l

   # Link-Ziel anzeigen
   ls -la .claude/skills/my-skill

   # Link testen
   readlink .claude/skills/my-skill
   ```

2. **Beschädigte symbolische Links löschen**:
   ```bash
   openskills remove my-skill
   ```

3. **Neu installieren**:
   ```bash
   openskills install owner/repo
   ```

**Sie sollten sehen**:
- Keine beschädigten symbolischen Links
- Skill wird normal angezeigt und gelesen

---

## Stolperfallen-Warnung

::: warning Häufige Fehleroperationen

**❌ Nicht tun**:

- **Skill-Verzeichnis direkt kopieren** → Führt zu fehlenden Metadaten, Update schlägt fehl
- **`.openskills.json` manuell bearbeiten** → Einfaches Zerstören des Formats, Update schlägt fehl
- **`sudo` zum Installieren von Skills verwenden** → Erstellt root-eigene Dateien, nachfolgende Operationen erfordern möglicherweise sudo
- **`.openskills.json` löschen** → Führt dazu, dass der Skill beim Update übersprungen wird

**✅ Tun**:

- Installation über `openskills install` → Metadaten werden automatisch erstellt
- Löschung über `openskills remove` → Dateien werden korrekt bereinigt
- Update über `openskills update` → Automatische Aktualisierung aus der Quelle
- Überprüfung über `openskills list` → Skill-Status bestätigen

:::

::: tip Fehlerbehebungstipps

1. **Einfach anfangen**: Führen Sie zuerst `openskills list` aus, um den Status zu bestätigen
2. **Vollständige Fehlermeldung lesen**: Gelbe Hinweise enthalten normalerweise Lösungsvorschläge
3. **Verzeichnisstruktur prüfen**: Mit `ls -la` Dateien und Berechtigungen anzeigen
4. **Quellcode-Position validieren**: Fehlermeldungen listen 4 Suchverzeichnisse auf
5. **`-y` zum Überspringen von Interaktionen verwenden**: In CI/CD oder Skripten `-y`-Flag verwenden

:::

---

## Zusammenfassung dieser Lektion

In dieser Lektion haben Sie gelernt, häufige OpenSkills-Probleme zu beheben und zu reparieren:

| Problemtyp | Wichtige Lösungsmethode |
|---|---|
| Git-Clone schlägt fehl | Netzwerk prüfen, Anmeldeinformationen konfigurieren, Repository-Adresse validieren |
| SKILL.md nicht gefunden | Repository-Struktur prüfen, YAML-Format validieren |
| Lesefehler | Skill-Status mit `openskills list` prüfen |
| Update schlägt fehl | Skill neu installieren, um Metadaten wiederherzustellen |
| Berechtigungsproblem | Verzeichnisberechtigungen prüfen, sudo vermeiden |

**Merken Sie sich**:
- Fehlermeldungen enthalten normalerweise klare Hinweise
- Neuinstallation ist die einfachste Methode, um Metadatenprobleme zu lösen
- Nur aus vertrauenswürdigen Quellen installieren

## Nächste Schritte

- **[FAQ (Häufig gestellte Fragen)](../faq/) ansehen** → Antworten auf weitere Fragen
- **[Best Practices](../../advanced/best-practices/) lernen** → Häufige Fehler vermeiden
- **[Sicherheitshinweise](../../advanced/security/) erkunden** → Sicherheitsmechanismen verstehen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie, um Quellcode-Position anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-24

| Funktion | Dateipfad | Zeilennummer |
|---|---|---|
| Git-Clone-Fehlerbehandlung | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L162-L168) | 162-168 |
| Pfad-existiert-nicht-Fehler | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L205-L207) | 205-207 |
| Kein-Verzeichnis-Fehler | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L210-L213) | 210-213 |
| SKILL.md ungültig | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L241-L243) | 241-243 |
| Pfad-Traversal-Sicherheitsfehler | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L256-L259) | 256-259 |
| SKILL.md nicht gefunden | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L378-L380) | 378-380 |
| Kein Skill-Name angegeben | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts#L10-L12) | 10-12 |
| Skill nicht gefunden | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts#L26-L34) | 26-34 |
| Ausgabedatei ist keine Markdown-Datei | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L23-L25) | 23-25 |
| Keine Skills installiert | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L40-L43) | 40-43 |
| Keine Quell-Metadaten übersprungen | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L57-L61) | 57-61 |
| Lokale Quelle fehlt | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L66-L71) | 66-71 |
| SKILL.md nicht im Repository gefunden | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L102-L107) | 102-107 |

**Wichtige Funktionen**:
- `hasValidFrontmatter(content)`: Validiert, ob SKILL.md gültiges YAML-Frontmatter hat
- `isPathInside(targetPath, targetDir)`: Validiert, ob Pfad innerhalb des Zielverzeichnisses ist (Sicherheitsprüfung)
- `findSkill(name)`: Sucht Skill mit Priorität in 4 Verzeichnissen
- `readSkillMetadata(path)`: Liest Installationsquellen-Metadaten des Skills

**Wichtige Konstanten**:
- Suchverzeichnis-Reihenfolge (`src/utils/skills.ts`):
  1. `.agent/skills/` (Projekt universal)
  2. `~/.agent/skills/` (Global universal)
  3. `.claude/skills/` (Projekt)
  4. `~/.claude/skills/` (Global)

</details>

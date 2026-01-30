---
title: "Fehlerbehebung: Häufige Probleme lösen | opencode-agent-skills"
subtitle: "Fehlerbehebung: Häufige Probleme lösen"
sidebarTitle: "Probleme lösen"
description: "Lernen Sie die Fehlerbehebung für opencode-agent-skills. 9 Kategorien von Problemlösungen: Fähigkeiten-Ladefehler, Skriptausführungsfehler, Pfadsicherheitsprobleme."
tags:
  - "troubleshooting"
  - "faq"
  - "Fehlerbehebung"
prerequisite: []
order: 1
---

# Häufige Probleme beheben

::: info
Dieses Tutorial richtet sich an alle Benutzer, die auf Probleme stoßen, unabhängig davon, ob Sie bereits mit den Grundfunktionen der Erweiterung vertraut sind. Wenn Sie Probleme mit dem Laden von Fähigkeiten, Skriptausführungsfehlern oder anderen Schwierigkeiten haben oder wissen möchten, wie Sie häufige Probleme排查en können, hilft Ihnen dieses Tutorial dabei, diese schnell zu identifizieren und zu lösen.
:::

## Was Sie nach diesem Tutorial können

- Schnell die Ursache für fehlgeschlagene Fähigkeiten-Ladungen finden
- Skriptausführungsfehler und Berechtigungsprobleme lösen
- Die Funktionsweise der Pfadsicherheitsbeschränkungen verstehen
- Semantische Matching- und Modell-Lade-Probleme排查en

## Fähigkeit kann nicht gefunden werden

### Symptome
Der Aufruf von `get_available_skills` gibt `No skills found matching your query` zurück.

### Mögliche Ursachen
1. Fähigkeit ist nicht im Suchpfad installiert
2. Fähigkeitsname ist falsch geschrieben
3. SKILL.md-Format entspricht nicht der Norm

### Lösung

**Überprüfen, ob sich die Fähigkeit im Suchpfad befindet**:

Die Erweiterung sucht Fähigkeiten in der folgenden Prioritätsreihenfolge (erste Übereinstimmung wird verwendet):

| Priorität | Pfad | Typ |
|---|---|---|
| 1 | `.opencode/skills/` | Projekt-Ebene (OpenCode) |
| 2 | `.claude/skills/` | Projekt-Ebene (Claude) |
| 3 | `~/.config/opencode/skills/` | Benutzer-Ebene (OpenCode) |
| 4 | `~/.claude/skills/` | Benutzer-Ebene (Claude) |
| 5 | `.claude/plugins/cache/` | Plugin-Cache |
| 6 | `.claude/plugins/marketplaces/` | Installierte Plugins |

Verifizierungsbefehle:
```bash
# Projekt-Ebene Fähigkeiten prüfen
ls -la .opencode/skills/
ls -la .claude/skills/

# Benutzer-Ebene Fähigkeiten prüfen
ls -la ~/.config/opencode/skills/
ls -la ~/.claude/skills/
```

**SKILL.md-Format verifizieren**:

Das Fähigkeiten-Verzeichnis muss eine `SKILL.md`-Datei enthalten, deren Format der Anthropic Skills Spec entspricht:

```yaml
---
name: skill-name
description: Kurze Beschreibung der Fähigkeit
license: MIT
allowed-tools:
  - read
  - write
metadata:
  author: Ihr-Name
---

Fähigkeits-Inhalt...
```

Prüfliste:
- ✅ `name` muss Kleinbuchstaben, Zahlen und Bindestriche enthalten (z.B. `git-helper`)
- ✅ `description` darf nicht leer sein
- ✅ YAML frontmatter muss von `---` umgeben sein
- ✅ Fähigkeits-Inhalt muss nach dem zweiten `---` folgen

**Fuzzy-Matching nutzen**:

Die Erweiterung bietet Rechtschreibvorschläge. Zum Beispiel:
```
No skills found matching "git-helper". Did you mean "git-helper-tool"?
```

Wenn Sie ähnliche Hinweise sehen, verwenden Sie den vorgeschlagenen Namen und versuchen Sie es erneut.

---

## Fähigkeit existiert nicht Fehler

### Symptome
Der Aufruf von `use_skill("skill-name")` gibt `Skill "skill-name" not found` zurück.

### Mögliche Ursachen
1. Fähigkeitsname ist falsch geschrieben
2. Fähigkeit wurde von einer gleichnamigen Fähigkeit überschrieben (Prioritätskonflikt)
3. Fähigkeits-Verzeichnis fehlt SKILL.md oder Format ist fehlerhaft

### Lösung

**Alle verfügbaren Fähigkeiten anzeigen**:

```bash
Verwenden Sie das Tool get_available_skills, um alle Fähigkeiten aufzulisten
```

**Prioritätsüberschreibungsregeln verstehen**:

Wenn mehrere Pfade gleichnamige Fähigkeiten enthalten, ist nur die **höchste Priorität** aktiv. Zum Beispiel:
- Projekt-Ebene `.opencode/skills/git-helper/` → ✅ Aktiv
- Benutzer-Ebene `~/.config/opencode/skills/git-helper/` → ❌ Überschrieben

Namenskonflikte prüfen:
```bash
# Alle gleichnamigen Fähigkeiten suchen
find .opencode/skills .claude/skills ~/.config/opencode/skills ~/.claude/skills \
  -name "git-helper" -type d
```

**SKILL.md vorhanden prüfen**:

```bash
# In das Fähigkeiten-Verzeichnis wechseln
cd .opencode/skills/git-helper/

# SKILL.md prüfen
ls -la SKILL.md

# YAML-Format überprüfen
head -10 SKILL.md
```

---

## Skriptausführung fehlgeschlagen

### Symptome
Der Aufruf von `run_skill_script` gibt einen Skriptfehler oder einen Exit-Code ungleich Null zurück.

### Mögliche Ursachen
1. Skriptpfad ist falsch
2. Skript hat keine Ausführungsberechtigung
3. Skript hat einen logischen Fehler

### Lösung

**Prüfen, ob das Skript in der scripts-Liste der Fähigkeit enthalten ist**:

Beim Laden der Fähigkeit werden verfügbare Skripte aufgelistet:
```
Skill loaded. Available scripts:
- tools/build.sh
- scripts/setup.js
```

Wenn ein nicht vorhandenes Skript angegeben wird:
```
Script "build.sh" not found in skill "my-skill". Available scripts: tools/build.sh, scripts/setup.js
```

**Richtigen relativen Pfad verwenden**:

Der Skriptpfad ist relativ zum Fähigkeiten-Verzeichnis, führen Sie keinen `/` ein:
- ✅ Richtig: `tools/build.sh`
- ❌ Falsch: `/tools/build.sh`

**Skript Ausführungsberechtigung erteilen**:

Die Erweiterung führt nur Dateien mit Ausführungsbit aus (`mode & 0o111`).

::: code-group

```bash [macOS/Linux]
# Ausführungsberechtigung erteilen
chmod +x .opencode/skills/my-skill/tools/build.sh

# Berechtigung verifizieren
ls -la .opencode/skills/my-skill/tools/build.sh
# Ausgabe sollte enthalten: -rwxr-xr-x
```

```powershell [Windows]
# Windows verwendet keine Unix-Berechtigungsbits, stellen Sie sicher, dass die Dateierweiterung korrekt zugeordnet ist
# PowerShell-Skript: .ps1
# Bash-Skript (via Git Bash): .sh
```

:::

**Skriptausführungsfehler debuggen**:

Wenn das Skript einen Fehler zurückgibt, zeigt die Erweiterung den Exit-Code und die Ausgabe an:
```
Script failed (exit 1): Error: Build failed at /path/to/script.js:42
```

Manuelles Debugging:
```bash
# In das Fähigkeiten-Verzeichnis wechseln
cd .opencode/skills/my-skill/

# Skript direkt ausführen, um detaillierte Fehler zu sehen
./tools/build.sh
```

---

## Pfad unsicher Fehler

### Symptome
Der Aufruf von `read_skill_file` oder `run_skill_script` gibt einen Pfad-unsicher-Fehler zurück.

### Mögliche Ursachen
1. Pfad enthält `..` (Verzeichnis-Traversierung)
2. Pfad ist absolut
3. Pfad enthält ungültige Zeichen

### Lösung

**Pfadsicherheitsregeln verstehen**:

Die Erweiterung verbietet den Zugriff auf Dateien außerhalb des Fähigkeiten-Verzeichnisses, um Verzeichnis-Traversierungs-Angriffe zu verhindern.

Zulässige Pfad-Beispiele (relativ zum Fähigkeiten-Verzeichnis):
- ✅ `docs/guide.md`
- ✅ `config/settings.json`
- ✅ `tools/setup.sh`

Verbotene Pfad-Beispiele:
- ❌ `../../../etc/passwd` (Verzeichnis-Traversierung)
- ❌ `/tmp/file.txt` (Absoluter Pfad)
- ❌ `./../other-skill/file.md` (Traversierung in ein anderes Verzeichnis)

**Relative Pfade verwenden**:

Verwenden Sie immer Pfade relativ zum Fähigkeiten-Verzeichnis, beginnen Sie nicht mit `/` oder `../`:
```bash
# Fähigkeits-Dokumentation lesen
read_skill_file("my-skill", "docs/guide.md")

# Fähigkeits-Skript ausführen
run_skill_script("my-skill", "tools/build.sh")
```

**Verfügbare Dateien auflisten**:

Wenn Sie sich bei Dateinamen unsicher sind, zeigen Sie zuerst die Fähigkeits-Dateiliste an:
```
Nach dem Aufruf von use_skill wird zurückgegeben:
Available files:
- docs/guide.md
- config/settings.json
- README.md
```

---

## Embedding-Modell-Ladung fehlgeschlagen

### Symptome
Semantische Matching-Funktion funktioniert nicht, Protokoll zeigt `Model failed to load`.

### Mögliche Ursachen
1. Netzwerkverbindungsproblem (erster Modell-Download)
2. Modell-Datei beschädigt
3. Cache-Verzeichnis Berechtigungsproblem

### Lösung

**Netzwerkverbindung prüfen**:

Bei der ersten Verwendung muss die Erweiterung das Modell `all-MiniLM-L6-v2` (ca. 238MB) von Hugging Face herunterladen. Stellen Sie sicher, dass das Netzwerk auf Hugging Face zugreifen kann.

**Cache leeren und Modell erneut herunterladen**:

Das Modell ist im Cache unter `~/.cache/opencode-agent-skills/`:

```bash
# Cache-Verzeichnis löschen
rm -rf ~/.cache/opencode-agent-skills/

# OpenCode neu starten, die Erweiterung lädt das Modell automatisch erneut herunter
```

**Cache-Verzeichnisberechtigung prüfen**:

```bash
# Cache-Verzeichnis anzeigen
ls -la ~/.cache/opencode-agent-skills/

# Sicherstellen, dass Lese- und Schreibberechtigungen vorhanden sind
chmod -R 755 ~/.cache/opencode-agent-skills/
```

**Modellladung manuell verifizieren**:

Wenn das Problem weiterhin besteht, können Sie detaillierte Fehler im Erweiterungsprotokoll sehen:
```
OpenCode-Protokoll durchsuchen nach "embedding" oder "model"
```

---

## SKILL.md Parsing fehlgeschlagen

### Symptome
Fähigkeiten-Verzeichnis existiert, aber die Erweiterung findet es nicht, oder beim Laden wird ein Formatfehler zurückgegeben.

### Mögliche Ursachen
1. YAML frontmatter Formatfehler
2. Pflichtfelder fehlen
3. Feldwerte entsprechen nicht den Validierungsregeln

### Lösung

**YAML-Format prüfen**:

Die Struktur von SKILL.md muss wie folgt sein:

```markdown
---
name: my-skill
description: Fähigkeitsbeschreibung
---

Fähigkeits-Inhalt...
```

Häufige Fehler:
- ❌ Fehlende `---` Trennzeichen
- ❌ Falsche YAML-Einrückung (YAML verwendet 2-Leerzeichen-Einrückung)
- ❌ Fehlendes Leerzeichen nach dem Doppelpunkt

**Pflichtfelder verifizieren**:

| Feld | Typ | Pflicht | Einschränkung |
|---|---|---|---|
| name | string | ✅ | Kleinbuchstaben, Zahlen, Bindestriche, nicht leer |
| description | string | ✅ | Nicht leer |

**YAML-Gültigkeit testen**:

Online-Tools zur YAML-Formatvalidierung verwenden:
- [YAML Lint](https://www.yamllint.com/)

Oder Befehlszeilentools verwenden:
```bash
# yamllint installieren
pip install yamllint

# Datei validieren
yamllint SKILL.md
```

**Fähigkeits-Inhaltsbereich prüfen**:

Der Fähigkeits-Inhalt muss nach dem zweiten `---` beginnen:

```markdown
---
name: my-skill
description: Fähigkeitsbeschreibung
---

Hier beginnt der Fähigkeits-Inhalt, der in den KI-Kontext injiziert wird...
```

Wenn der Fähigkeits-Inhalt leer ist, ignoriert die Erweiterung diese Fähigkeit.

---

## Automatische Empfehlung funktioniert nicht

### Symptome
Nach dem Senden einer relevanten Nachricht erhält die KI keine Fähigkeitsempfehlung.

### Mögliche Ursachen
1. Ähnlichkeitsschwelle unterschritten (Standard 0.35)
2. Fähigkeitsbeschreibung nicht detailliert genug
3. Modell nicht geladen

### Lösung

**Fähigkeitsbeschreibungsqualität verbessern**:

Je spezifischer die Fähigkeitsbeschreibung, desto genauer das semantische Matching.

| ❌ Schlechte Beschreibung | ✅ Gute Beschreibung |
|---|---|
| "Git-Tool" | "Hilft bei Git-Operationen: Branch erstellen, Code committen, PRs mergen, Konflikte lösen" |
| "Test-Hilfe" | "Unit-Tests generieren, Test-Suite ausführen, Test-Coverage analysieren, fehlgeschlagene Tests reparieren" |

**Fähigkeit manuell aufrufen**:

Wenn die automatische Empfehlung nicht funktioniert, kann sie manuell geladen werden:

```
Verwenden Sie das Tool use_skill("skill-name")
```

**Ähnlichkeitsschwelle anpassen** (Fortgeschritten):

Die Standardschwelle ist 0.35. Wenn Sie finden, dass zu wenige Empfehlungen angezeigt werden, können Sie den Wert im Quellcode anpassen (`src/embeddings.ts:10`):

```typescript
export const SIMILARITY_THRESHOLD = 0.35; // Diesen Wert senken, um mehr Empfehlungen zu erhalten
```

::: warning
Das Ändern des Quellcodes erfordert ein erneutes Kompilieren der Erweiterung, wird für normale Benutzer nicht empfohlen.
:::

---

## Nach Kontextkomprimierung Fähigkeiten ungültig

### Symptome
Nach einem langen Gespräch scheint die KI die geladenen Fähigkeiten "vergessen" zu haben.

### Mögliche Ursachen
1. Erweiterungsversion niedriger als v0.1.0
2. Sitzungsinitialisierung nicht abgeschlossen

### Lösung

**Erweiterungsversion verifizieren**:

Die Komprimierungswiederherstellungsfunktion wird ab v0.1.0 unterstützt. Wenn die Erweiterung per npm installiert wurde, Version prüfen:

```bash
# package.json im OpenCode-Plugin-Verzeichnis anzeigen
cat ~/.config/opencode/plugins/opencode-agent-skills/package.json | grep version
```

**Sitzungsinitialisierung abschließen**:

Die Erweiterung injiziert die Fähigkeitsliste bei der ersten Nachricht. Wenn die Sitzungsinitialisierung nicht abgeschlossen ist, kann die Komprimierungswiederherstellung fehlschlagen.

Symptome:
- Keine Fähigkeitsliste nach der ersten Nachricht
- KI kennt keine verfügbaren Fähigkeiten

**Sitzung neu starten**:

Wenn das Problem weiterhin besteht, aktuelle Sitzung löschen und neue erstellen:
```
Sitzung in OpenCode löschen, Gespräch neu beginnen
```

---

## Skript-Rekursivsuche fehlgeschlagen

### Symptome
Fähigkeit enthält tief verschachtelte Skripte, aber die Erweiterung findet sie nicht.

### Mögliche Ursachen
1. Rekursionstiefe überschreitet 10 Ebenen
2. Skripte in versteckten Verzeichnissen (beginnen mit `.`)
3. Skripte in Abhängigkeitsverzeichnissen (z.B. `node_modules`)

### Lösung

**Rekursionssuchregeln verstehen**:

Bei der rekursiven Skriptsuche der Erweiterung:
- Maximale Tiefe: 10 Ebenen
- Überspringt versteckte Verzeichnisse (Verzeichnisname beginnt mit `.`): `.git`, `.vscode` usw.
- Überspringt Abhängigkeitsverzeichnisse: `node_modules`, `__pycache__`, `vendor`, `.venv`, `venv`, `.tox`, `.nox`

**Skriptposition anpassen**:

Wenn sich Skripte in tiefen Verzeichnissen befinden, können Sie:
- Sie in flachere Verzeichnisse verschieben (z.B. `tools/` statt `src/lib/utils/tools/`)
- Softlinks zum Skriptstandort erstellen (Unix-Systeme)

```bash
# Softlink erstellen
ln -s ../../../scripts/build.sh tools/build.sh
```

**Gefundene Skripte auflisten**:

Nach dem Laden der Fähigkeit gibt die Erweiterung die Skriptliste zurück. Wenn das Skript nicht in der Liste ist, prüfen Sie:
1. Hat die Datei Ausführungsberechtigung?
2. Wird das Verzeichnis von Überspringregeln erfasst?

---

## Zusammenfassung

Dieses Tutorial hat 9 häufige Probleme bei der Verwendung des OpenCode Agent Skills Plugins behandelt:

| Problemtyp | Wichtige Prüfpunkte |
|---|---|
| Fähigkeit nicht gefunden | Suchpfad, SKILL.md-Format, Rechtschreibung |
| Fähigkeit existiert nicht | Namensrichtigkeit, Prioritätsüberschreibung, Dateiexistenz |
| Skriptausführung fehlgeschlagen | Skriptpfad, Ausführungsberechtigung, Skriptlogik |
| Pfad unsicher | Relativer Pfad, kein `..`, kein absoluter Pfad |
| Modellladung fehlgeschlagen | Netzwerkverbindung, Cache bereinigen, Verzeichnisberechtigungen |
| Parsing fehlgeschlagen | YAML-Format, Pflichtfelder, Fähigkeitsinhalt |
| Automatische Empfehlung funktioniert nicht | Beschreibungqualität, Ähnlichkeitsschwelle, manueller Aufruf |
| Nach Kontextkomprimierung ungültig | Erweiterungsversion, Sitzungsinitialisierung |
| Skript-Rekursivsuche fehlgeschlagen | Tiefenbeschränkung, Verzeichnis-Überspringregeln, Ausführungsberechtigungen |

---

## Nächstes Tutorial

> Im nächsten Tutorial lernen wir **[Sicherheitshinweise](../security-considerations/)**.
>
> Sie werden lernen:
> - Sicherheitsmechanismen der Erweiterung
> - Wie man sichere Fähigkeiten schreibt
> - Pfadvalidierung und Berechtigungskontrollprinzipien
> - Sicherheits-Best-Practices

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Aufklappen der Quellcode-Positionen</strong></summary>

> Aktualisierungszeit: 2026-01-24

| Funktion | Dateipfad | Zeilennummer |
|---|---|---|
| Fähigkeitssuche Fuzzy-Matching-Vorschläge | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L49-L59) | 49-59 |
| Fähigkeit existiert nicht Fehlerbehandlung | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L89-L97) | 89-97 |
| Skript existiert nicht Fehlerbehandlung | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L167-L177) | 167-177 |
| Skriptausführung fehlgeschlagen Fehlerbehandlung | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L184-L195) | 184-195 |
| Pfadsicherheitsprüfung | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L130-L133) | 130-133 |
| SKILL.md Parsing-Fehlerbehandlung | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L127-L152) | 127-152 |
| Modellladung fehlgeschlagen Fehler | [`src/embeddings.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/embeddings.ts#L38-L40) | 38-40 |
| Fuzzy-Matching-Algorithmus | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L88-L125) | 88-125 |

**Wichtige Konstanten**:
- `SIMILARITY_THRESHOLD = 0.35` (Ähnlichkeitsschwelle): `src/embeddings.ts:10`
- `TOP_K = 5` (Anzahl der ähnlichsten Fähigkeiten): `src/embeddings.ts:11`

**Andere wichtige Werte**:
- `maxDepth = 10` (Maximale Rekursionstiefe für Skripte, Standardparameter der findScripts-Funktion): `src/skills.ts:59`
- `0.4` (Fuzzy-Matching-Schwelle, Rückgabebedingung der findClosestMatch-Funktion): `src/utils.ts:124`

**Wichtige Funktionen**:
- `findClosestMatch()`: Fuzzy-Matching-Algorithmus zur Generierung von Rechtschreibvorschlägen
- `isPathSafe()`: Pfadsicherheitsprüfung, verhindert Verzeichnis-Traversierung
- `ensureModel()`: Stellt sicher, dass das Embedding-Modell geladen ist
- `parseSkillFile()`: Parst SKILL.md und validiert das Format

</details>

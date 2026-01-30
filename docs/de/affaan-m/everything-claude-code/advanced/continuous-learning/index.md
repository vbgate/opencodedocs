---
title: "Kontinuierliches Lernen: Automatische Musterextraktion | Everything Claude Code"
sidebarTitle: "Claude Code intelligenter machen"
subtitle: "Kontinuierliches Lernen: Automatische Extraktion wiederverwendbarer Muster"
description: "Erfahren Sie mehr über den Mechanismus für kontinuierliches Lernen in Everything Claude Code. Extrahieren Sie Muster mit /learn, konfigurieren Sie die automatische Bewertung, richten Sie den Stop-Hook ein und lassen Sie Claude Code kontinuierlich Erfahrungen sammeln, um die Entwicklungseffizienz zu steigern."
tags:
  - "kontinuierliches-lernen"
  - "wissen-extraktion"
  - "automatisierung"
prerequisite:
  - "start-quick-start"
  - "platforms-commands-overview"
order: 100
---

# Kontinuierliches Lernen: Automatische Extraktion wiederverwendbarer Muster

## Was Sie lernen können

- Verwenden Sie den Befehl `/learn`, um wiederverwendbare Muster aus der Sitzung manuell zu extrahieren
- Konfigurieren Sie den Continuous-Learning-Skill für die automatische Bewertung am Sitzungsende
- Richten Sie den Stop-Hook ein, um die Musterextraktion automatisch auszulösen
- Speichern Sie extrahierte Muster als learned skills, um sie in zukünftigen Sitzungen wiederzuverwenden
- Konfigurieren Sie Parameter wie Extraktionsschwellenwert und Mindestsitzungslänge

## Ihr aktuelles Problem

Haben Sie bei der Verwendung von Claude Code folgende Situationen erlebt:

- Sie haben ein komplexes Problem gelöst, müssen aber beim nächsten Mal ähnliche Probleme erneut erkunden
- Sie haben Debugging-Techniken für ein Framework gelernt, aber nach einiger Zeit vergessen
- Sie haben projektspezifische Codierungskonventionen entdeckt, können sie aber nicht systematisch dokumentieren
- Sie haben eine Workaround-Lösung gefunden, aber beim nächsten Mal ähnliche Probleme nicht mehr erinnern

Diese Probleme führen dazu, dass Ihre Erfahrungen und Ihr Wissen nicht effektiv akkumuliert werden und Sie jedes Mal von vorne beginnen müssen.

## Wann Sie diesen Ansatz verwenden

Verwendungsszenarien für den Mechanismus für kontinuierliches Lernen:

- **Bei der Lösung komplexer Probleme**: Sie haben einen halben Tag einen Bug debuggt und müssen den Lösungsansatz merken
- **Beim Erlernen neuer Frameworks**: Sie haben die Besonderheiten oder Best Practices des Frameworks entdeckt
- **In der Mitte der Projektentwicklung**: Sie haben nach und nach projektspezifische Konventionen und Muster entdeckt
- **Nach Code-Reviews**: Sie haben neue Sicherheitsprüfungsverfahren oder Codierungskonventionen gelernt
- **Bei der Leistungsoptimierung**: Sie haben effektive Optimierungstechniken oder Tool-Kombinationen gefunden

::: tip Kernwert
Der Mechanismus für kontinuierliches Lernen macht Claude Code mit der Zeit intelligenter. Er wirkt wie ein erfahrener Mentor, der automatisch nützliche Muster aufzeichnet, während Sie Probleme lösen, und in zukünftigen ähnlichen Situationen Vorschläge macht.
:::

## Kernkonzept

Der Mechanismus für kontinuierliches Lernen besteht aus drei Kernkomponenten:

```
1. /learn Befehl     → Manuelle Extraktion: Jederzeit ausführbar, speichert aktuelle wertvolle Muster
2. Continuous Learning Skill → Automatische Bewertung: Wird durch Stop-Hook ausgelöst, analysiert Sitzung
3. Learned Skills   → Wissensbasis: Speichert Muster, zukünftig automatisch geladen
```

**Funktionsweise**:

- **Manuelle Extraktion**: Nachdem Sie ein nicht-triviales Problem gelöst haben, verwenden Sie aktiv `/learn`, um Muster zu extrahieren
- **Automatische Bewertung**: Am Sitzungsende prüft das Stop-Hook-Skript die Sitzungslänge und fordert Claude zur Bewertung auf
- **Wissenskonsolidierung**: Extrahierte Muster werden als learned skills im Verzeichnis `~/.claude/skillskillslearned/` gespeichert
- **Zukünftige Wiederverwendung**: Claude Code lädt diese skills automatisch in zukünftigen Sitzungen

**Warum Stop-Hook**:

- **Leichtgewichtig**: Wird nur einmal am Sitzungsende ausgeführt, beeinflusst nicht die Interaktionsreaktionszeit
- **Vollständiger Kontext**: Kann auf das vollständige Sitzungsprotokoll zugreifen, wodurch wertvolle Muster leichter gefunden werden
- **Nicht blockierend**: Wird nicht bei jeder Nachricht gesendet, erhöht nicht die Latenz

## 🎒 Vorbereitungen

Bevor Sie den Mechanismus für kontinuierliches Lernen verwenden, stellen Sie sicher:

- ✅ Das Everything Claude Code Plugin ist installiert
- ✅ Sie haben den Befehl `/learn` in [Kernbefehle-Übersicht](../../platforms/commands-overview/) verstanden
- ✅ Sie haben das Konzept des Stop-Hooks in [Hooks-Automatisierung](../hooks-automation/) verstanden

::: warning Voraussetzungen
Dieses Tutorial setzt voraus, dass Sie mit den grundlegenden Vorgängen von Claude Code und dem Konzept von Hooks vertraut sind. Wenn Sie die Installation noch nicht abgeschlossen haben, lesen Sie bitte zuerst [Schnellstart](../../start/quickstart/).
:::

## Lernen Sie mit mir: Vollständiger Ablauf für kontinuierliches Lernen

Lassen Sie uns den gesamten Ablauf anhand eines praktischen Beispiels lernen. Angenommen, Sie debuggen einen TypeScript-Typfehler und haben schließlich die Lösung gefunden.

### Schritt 1: Verwenden Sie /learn zur manuellen Musterextraktion

**Warum**
Manuelle Extraktion eignet sich für gerade gelöste wichtige Probleme, um sofort zu speichern und das Vergessen zu vermeiden.

**Vorgehensweise**
Geben Sie in Claude Code ein:

```
/learn
```

**Was Sie sehen sollten**
Claude analysiert die aktuelle Sitzung und fragt, ob extrahierbare Muster gefunden wurden:

```markdown
Ich habe die aktuelle Sitzung analysiert und die folgenden extrahierbaren Muster gefunden:

1. TypeScript-Typfehler: Lösung durch generische Einschränkungen
   - Problembeschreibung: Typermittlung für Funktionsparameter ist falsch
   - Lösungsmethode: Explizite generische Einschränkung `<T extends ...>` hinzufügen
   - Anwendungsfall: Komplexe Typermittlung, Rückruffunktionen

Möchten Sie diese Muster extrahieren? (yes/no/skip)
```

**Prüfpunkt ✅**
- Hat Claude das von Ihnen gelöste Problem erkannt?
- Ist die Beschreibung des extrahierten Musters genau?
- Ist der Anwendungsfall angemessen?

**Nächster Schritt**
Wenn das Muster korrekt ist, antworten Sie mit `yes`. Wenn Änderungen erforderlich sind, geben Sie die spezifischen Änderungen an.

---

### Schritt 2: Speichern als learned skill

**Warum**
Nach dem Speichern als Skill-Datei können diese Kenntnisse in zukünftigen Sitzungen automatisch geladen werden.

**Vorgehensweise**
Wenn Sie die Extraktion bestätigen, erstellt Claude eine Skill-Datei:

```markdown
Speichere Muster in: ~/.claude/skills/learned/typescript-generic-constraints.md

# TypeScript Generic Constraints

**Extrahiert:** 2026-01-25
**Kontext:** Lösung komplexer Typermittlungsprobleme

## Problem
Die Typermittlung für TypeScript-Funktionsparameter ist falsch, was zu Typfehlern führt.

## Lösung
Fügen Sie explizite generische Einschränkungen `<T extends ...>` hinzu, um Typbeziehungen zu klären.

## Beispiel
```typescript
// Vorher
function process(data) { ... }  // Typermittlung schlägt fehl

// Nachher
function process<T extends Record<string, unknown>>(data: T) { ... }
```

## Wann zu verwenden
- Komplexe Typermittlungsszenarien
- Typdefinitionen für Rückruffunktionen
- Generische Funktionsparametereinschränkungen
```

**Was Sie sehen sollten**
Claude zeigt an, dass die Datei gespeichert wurde:

```markdown
✅ Skill gespeichert in: ~/.claude/skills/learned/typescript-generic-constraints.md

Wenn Sie in Zukunft auf ähnliche Typprobleme stoßen, lädt Claude diesen Skill automatisch.
```

**Prüfpunkt ✅**
- Wurde die Datei erfolgreich erstellt?
- Liegt der Dateipfad im Verzeichnis `~/.claude/skills/learned/`?
- Ist der Inhalt des Skills genau?

---

### Schritt 3: Konfigurieren Sie den Continuous Learning Skill

**Warum**
Nach der Konfiguration der automatischen Bewertung prüft Claude am Ende jeder Sitzung automatisch, ob extrahierbare Muster vorhanden sind.

**Vorgehensweise**

Erstellen Sie die Konfigurationsdatei `~/.claude/skills/continuous-learning/config.json`:

```json
{
  "min_session_length": 10,
  "extraction_threshold": "medium",
  "auto_approve": false,
  "learned_skills_path": "~/.claude/skills/learned/",
  "patterns_to_detect": [
    "error_resolution",
    "user_corrections",
    "workarounds",
    "debugging_techniques",
    "project_specific"
  ],
  "ignore_patterns": [
    "simple_typos",
    "one_time_fixes",
    "external_api_issues"
  ]
}
```

**Konfigurationserklärung**:

| Feld | Beschreibung | Empfohlener Wert |
|--- | --- | ---|
| `min_session_length` | Mindestsitzungslänge (Anzahl der Benutzernachrichten) | 10 |
| `extraction_threshold` | Extraktionsschwellenwert | medium |
| `auto_approve` | Automatisch speichern (empfohlen: false) | false |
| `learned_skills_path` | Speicherpfad für learned skills | `~/.claude/skills/learned/` |
| `patterns_to_detect` | Zu erkennende Mustertypen | Siehe oben |
| `ignore_patterns` | Zu ignorierende Mustertypen | Siehe oben |

**Was Sie sehen sollten**
Die Konfigurationsdatei wurde in `~/.claude/skills/continuous-learning/config.json` erstellt.

**Prüfpunkt ✅**
- Das Format der Konfigurationsdatei ist korrekt (gültiges JSON)
- `learned_skills_path` enthält das Symbol `~` (wird durch das tatsächliche Home-Verzeichnis ersetzt)
- `auto_approve` ist auf `false` eingestellt (empfohlen)

---

### Schritt 4: Richten Sie den Stop-Hook für automatische Auslösung ein

**Warum**
Der Stop-Hook wird automatisch am Ende jeder Sitzung ausgelöst, ohne dass Sie `/learn` manuell ausführen müssen.

**Vorgehensweise**

Bearbeiten Sie `~/.claude/settings.json` und fügen Sie den Stop-Hook hinzu:

```json
{
  "hooks": {
    "Stop": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/skills/continuous-learning/evaluate-session.sh"
      }]
    }]
  }
}
```

**Erklärung des Skriptpfads**:

| Plattform | Skriptpfad |
|--- | ---|
| macOS/Linux | `~/.claude/skills/continuous-learning/evaluate-session.sh` |
| Windows | `C:\Users\YourName\.claude\skills\continuous-learning\evaluate-session.cmd` |

**Was Sie sehen sollten**
Der Stop-Hook wurde zu `~/.claude/settings.json` hinzugefügt.

**Prüfpunkt ✅**
- Die Struktur von hooks ist korrekt (Stop → matcher → hooks)
- Der Befehlspfad zeigt auf das richtige Skript
- Der matcher ist auf `"*"` eingestellt (passt auf alle Sitzungen)

---

### Schritt 5: Überprüfen Sie, ob der Stop-Hook ordnungsgemäß funktioniert

**Warum**
Nach der Überprüfung der Konfiguration können Sie die automatische Extraktionsfunktion sicher verwenden.

**Vorgehensweise**
1. Öffnen Sie eine neue Claude Code-Sitzung
2. Führen Sie einige Entwicklungsaufgaben aus (senden Sie mindestens 10 Nachrichten)
3. Schließen Sie die Sitzung

**Was Sie sehen sollten**
Das Stop-Hook-Skript gibt Protokolle aus:

```
[ContinuousLearning] Sitzung hat 12 Nachrichten - auf extrahierbare Muster prüfen
[ContinuousLearning] Speichere learned skills in: /Users/yourname/.claude/skills/learned/
```

**Prüfpunkt ✅**
- Das Protokoll zeigt, dass die Anzahl der Sitzungsnachrichten ≥ 10 ist
- Der Pfad für learned skills im Protokoll ist korrekt
- Keine Fehlermeldungen

---

### Schritt 6: Automatisches Laden von learned skills in zukünftigen Sitzungen

**Warum**
Gespeicherte skills werden in zukünftigen ähnlichen Szenarien automatisch geladen und bieten Kontext.

**Vorgehensweise**
Wenn Sie in zukünftigen Sitzungen auf ähnliche Probleme stoßen, lädt Claude automatisch relevante learned skills.

**Was Sie sehen sollten**
Claude zeigt an, dass relevante skills geladen wurden:

```markdown
Ich habe bemerkt, dass dieses Szenario dem zuvor gelösten Typermittlungsproblem ähnelt.

Basierend auf dem gespeicherten Skill (typescript-generic-constraints) empfehle ich die Verwendung expliziter generischer Einschränkungen:

```typescript
function process<T extends Record<string, unknown>>(data: T) { ... }
```
```

**Prüfpunkt ✅**
- Claude verweist auf den gespeicherten Skill
- Die vorgeschlagene Lösung ist genau
- Die Effizienz der Problemlösung wurde verbessert

## Prüfpunkt ✅: Konfiguration überprüfen

Nach Abschluss der oben genannten Schritte führen Sie die folgenden Überprüfungen durch, um sicherzustellen, dass alles ordnungsgemäß funktioniert:

1. **Überprüfen, ob die Konfigurationsdatei vorhanden ist**:
```bash
ls -la ~/.claude/skills/continuous-learning/config.json
```

2. **Stop-Hook-Konfiguration überprüfen**:
```bash
cat ~/.claude/settings.json | grep -A 10 "Stop"
```

3. **Verzeichnis für learned skills überprüfen**:
```bash
ls -la ~/.claude/skills/learned/
```

4. **Stop-Hook manuell testen**:
```bash
node ~/.claude/skills/continuous-learning/scripts/hooks/evaluate-session.js
```

## Häufige Fallstricke

### Falle 1: Zu kurze Sitzung führt dazu, dass keine Extraktion ausgelöst wird

**Problem**:
Das Stop-Hook-Skript prüft die Sitzungslänge und überspringt sie, wenn sie unter `min_session_length` liegt.

**Ursache**:
Standardmäßig `min_session_length: 10`, kurze Sitzungen lösen keine Bewertung aus.

**Lösung**:
```json
{
  "min_session_length": 5  // Schwellenwert senken
}
```

::: warning Hinweis
Stellen Sie ihn nicht zu niedrig ein (z. B. < 5), da sonst viele bedeutungslose Muster extrahiert werden (z. B. einfache Syntaxfehlerkorrekturen).
:::

---

### Falle 2: `auto_approve: true` führt zum automatischen Speichern von Müllmustern

**Problem**:
Im automatischen Speichermodus speichert Claude möglicherweise minderwertige Muster.

**Ursache**:
`auto_approve: true` überspringt die manuelle Bestätigung.

**Lösung**:
```json
{
  "auto_approve": false  // Immer auf false lassen
}
```

**Empfohlene Vorgehensweise**:
Bestätigen Sie extrahierte Muster immer manuell, um die Qualität zu gewährleisten.

---

### Falle 3: Nicht vorhandenes Verzeichnis für learned skills führt zu Speicherfehlern

**Problem**:
Das Stop-Hook-Skript wird erfolgreich ausgeführt, aber die Skill-Datei wird nicht erstellt.

**Ursache**:
Das durch `learned_skills_path` angegebene Verzeichnis existiert nicht.

**Lösung**:
```bash
# Verzeichnis manuell erstellen
mkdir -p ~/.claude/skills/learned/

# Oder verwenden Sie einen absoluten Pfad in der Konfiguration
{
  "learned_skills_path": "/absoluter/pfad/zur/learned/"
}
```

---

### Falle 4: Falscher Pfad für Stop-Hook-Skript (Windows)

**Problem**:
Der Stop-Hook wird unter Windows nicht ausgelöst.

**Ursache**:
Die Konfigurationsdatei verwendet Unix-Pfade (`~/.claude/...`), aber die tatsächlichen Pfade unter Windows sind anders.

**Lösung**:
```json
{
  "command": "C:\\Users\\YourName\\.claude\\skills\\continuous-learning\\evaluate-session.cmd"
}
```

**Empfohlene Vorgehensweise**:
Verwenden Sie Node.js-Skripte (plattformübergreifend) anstelle von Shell-Skripten.

---

### Falle 5: Extrahierte Muster sind zu allgemein, schlechte Wiederverwendbarkeit

**Problem**:
Die Beschreibung der extrahierten Muster ist zu allgemein (z. B. "Typfehler beheben"), es fehlt spezifischer Kontext.

**Ursache**:
Bei der Extraktion wurden nicht genügend Kontextinformationen enthalten (Fehlermeldung, Codebeispiel, Anwendungsfall).

**Lösung**:
Geben Sie beim Verwenden von `/learn` detaillierteren Kontext an:

```
/learn Ich habe einen TypeScript-Typfehler behoben: Property 'xxx' does not exist on type 'yyy'. Ich habe ihn vorübergehend mit einer Typbehauptung as gelöst, aber eine bessere Methode ist die Verwendung generischer Einschränkungen.
```

**Checkliste**:
- [ ] Problembeschreibung ist spezifisch (enthält Fehlermeldung)
- [ ] Lösungsmethode ist detailliert (enthält Codebeispiel)
- [ ] Anwendungsfall ist klar (wann dieses Muster zu verwenden ist)
- [ ] Benennung ist spezifisch (z. B. "typescript-generic-constraints" statt "type-fix")

---

### Falle 6: Zu viele learned skills, schwer zu verwalten

**Problem**:
Im Laufe der Zeit sammelt das Verzeichnis `learned/` viele skills an, die schwer zu finden und zu verwalten sind.

**Ursache**:
Es gibt keine regelmäßige Bereinigung von minderwertigen oder veralteten skills.

**Lösung**:

1. **Regelmäßige Überprüfung**: Überprüfen Sie learned skills einmal im Monat
```bash
# Alle skills auflisten
ls -la ~/.claude/skills/learned/

# Skill-Inhalt anzeigen
cat ~/.claude/skills/learned/pattern-name.md
```

2. **Minderwertige skills markieren**: Fügen Sie das Präfix `deprecated-` zum Dateinamen hinzu
```bash
mv ~/.claude/skills/learned/old-pattern.md \
   ~/.claude/skills/learned/deprecated-old-pattern.md
```

3. **Kategorisierte Verwaltung**: Verwenden Sie Unterverzeichnisse zur Kategorisierung
```bash
mkdir -p ~/.claude/skills/learned/{types,debugging,testing}
mv ~/.claude/skills/learned/*types*.md ~/.claude/skills/learned/types/
```

**Empfohlene Vorgehensweise**:
Bereinigen Sie einmal pro Quartal, um learned skills prägnant und effektiv zu halten.

---

## Zusammenfassung

Der Mechanismus für kontinuierliches Lernen funktioniert über drei Kernkomponenten:

1. **`/learn` Befehl**: Manuelle Extraktion wiederverwendbarer Muster aus der Sitzung
2. **Continuous Learning Skill**: Konfiguration von Parametern für die automatische Bewertung (Sitzungslänge, Extraktionsschwellenwert)
3. **Stop Hook**: Automatische Auslösung der Bewertung am Sitzungsende

**Wichtige Punkte**:

- ✅ Manuelle Extraktion eignet sich für gerade gelöste wichtige Probleme
- ✅ Die automatische Bewertung wird durch den Stop-Hook am Sitzungsende ausgelöst
- ✅ Extrahierte Muster werden als learned skills im Verzeichnis `~/.claude/skills/learned/` gespeichert
- ✅ Konfigurieren Sie `min_session_length` für die Mindestsitzungslänge (empfohlen: 10)
- ✅ Halten Sie `auto_approve: false` immer bei, um die Qualität der Extraktion manuell zu bestätigen
- ✅ Bereinigen Sie regelmäßig minderwertige oder veraltete learned skills

**Best Practices**:

- Verwenden Sie nach der Lösung nicht-trivialer Probleme sofort `/learn`, um Muster zu extrahieren
- Geben Sie detaillierten Kontext an (Problembeschreibung, Lösung, Codebeispiel, Anwendungsfall)
- Verwenden Sie spezifische Skill-Benennungen (z. B. "typescript-generic-constraints" statt "type-fix")
- Überprüfen und bereinigen Sie learned skills regelmäßig, um die Wissensbasis prägnant zu halten

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Token-Optimierungsstrategien](../token-optimization/)**.
>
> Sie werden lernen:
> - Wie Sie die Token-Nutzung optimieren und die Effizienz des Kontextfensters maximieren
> - Konfiguration und Verwendung des strategic-compact-skill
> - Automatisierung von PreCompact- und PostToolUse-Hooks
> - Auswahl des geeigneten Modells (opus vs sonnet) zur Balance zwischen Kosten und Qualität

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-25

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
| /learn Befehlsdefinition | [`commands/learn.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/learn.md) | 1-71 |
| Continuous Learning Skill | [`skills/continuous-learning/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/continuous-learning/SKILL.md) | 1-81 |
| Stop Hook Skript | [`scripts/hooks/evaluate-session.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/evaluate-session.js) | 1-79 |
| Checkpoint Befehl | [`commands/checkpoint.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/checkpoint.md) | 1-75 |

**Wichtige Konstanten**:
- `min_session_length = 10`: Standardmäßige Mindestsitzungslänge (Anzahl der Benutzernachrichten)
- `CLAUDE_TRANSCRIPT_PATH`: Umgebungsvariable, Pfad zum Sitzungsprotokoll
- `learned_skills_path`: Speicherpfad für learned skills, standardmäßig `~/.claude/skills/learned/`

**Wichtige Funktionen**:
- `main()`: Hauptfunktion von evaluate-session.js, liest Konfiguration, prüft Sitzungslänge, gibt Protokolle aus
- `getLearnedSkillsDir()`: Ruft den Verzeichnispfad für learned skills ab (verarbeitet `~`-Erweiterung)
- `countInFile()`: Zählt die Häufigkeit des Auftretens eines Musters in einer Datei

**Konfigurationsoptionen**:
| Konfigurationsoption | Typ | Standardwert | Beschreibung |
|--- | --- | --- | ---|
| `min_session_length` | number | 10 | Mindestsitzungslänge (Anzahl der Benutzernachrichten) |
| `extraction_threshold` | string | "medium" | Extraktionsschwellenwert |
| `auto_approve` | boolean | false | Automatisch speichern (empfohlen: false) |
| `learned_skills_path` | string | "~/.claude/skills/learned/" | Speicherpfad für learned skills |
| `patterns_to_detect` | array | Siehe Quellcode | Zu erkennende Mustertypen |
| `ignore_patterns` | array | Siehe Quellcode | Zu ignorierende Mustertypen |

**Mustertypen**:
- `error_resolution`: Fehlerlösungsmuster
- `user_corrections`: Benutzerkorrekturmuster
- `workarounds`: Workaround-Lösungen
- `debugging_techniques`: Debugging-Techniken
- `project_specific`: Projektspezifische Muster

**Hook-Typen**:
- Stop: Wird am Sitzungsende ausgeführt (evaluate-session.js)

</details>

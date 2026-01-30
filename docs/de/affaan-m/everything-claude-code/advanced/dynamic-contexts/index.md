---
title: "Dynamische Kontexte: Context-Injection | Everything Claude Code"
sidebarTitle: "KI-Arbeitsmodi verstehen"
subtitle: "Dynamische Kontexte: Context-Injection"
description: "Lernen Sie den dynamischen Context-Injection-Mechanismus von Claude Code. Beherrschen Sie den Wechsel zwischen dev-, review- und research-Modi, um das KI-Verhalten situationsgerecht zu optimieren."
tags:
  - "contexts"
  - "workflow-optimization"
  - "dynamic-prompts"
prerequisite:
  - "start-quick-start"
order: 140
---

# Dynamische Context-Injection: Verwendung von Contexts

## Was Sie nach diesem Tutorial können

Nach dem Erlernen der dynamischen Context-Injection können Sie:

- Die Verhaltensstrategie der KI je nach aktuellem Arbeitsmodus wechseln (Entwicklung, Review, Recherche)
- Claude dazu bringen, in verschiedenen Szenarien unterschiedliche Prioritäten und Tool-Präferenzen zu befolgen
- Vermeiden, dass Arbeitsziele in derselben Sitzung vermischt werden, und die Fokussierung verbessern
- Die Effizienz in verschiedenen Phasen optimieren (schnelle Implementierung vs. tiefgehende Überprüfung)

## Ihre aktuelle Herausforderung

Kennen Sie diese Probleme aus Ihrem Entwicklungsalltag?

- **Bei schneller Entwicklung** analysiert Claude zu viel, gibt zu viele Vorschläge und verlangsamt den Fortschritt
- **Beim Code-Review** will Claude sofort Code ändern, anstatt sorgfältig zu lesen und Probleme zu identifizieren
- **Bei der Recherche neuer Themen** beginnt Claude zu programmieren, bevor das Problem verstanden ist, was zu falschen Ansätzen führt
- **In derselben Sitzung** wechseln Sie zwischen Entwicklung und Review, und Claudes Verhalten wird inkonsistent

Die Ursache dieser Probleme: **Claude fehlt ein klares "Arbeitsmodus"-Signal** – es weiß nicht, was gerade Priorität hat.

## Wann Sie diese Technik einsetzen sollten

- **Entwicklungsphase**: KI soll zuerst Funktionen implementieren, Details später besprechen
- **Code-Review**: KI soll zuerst vollständig verstehen, dann Verbesserungen vorschlagen
- **Technische Recherche**: KI soll zuerst erkunden und lernen, dann Schlussfolgerungen ziehen
- **Beim Wechsel des Arbeitsmodus**: Der KI klar mitteilen, was das aktuelle Ziel ist

## Kernkonzept

Der Kern der dynamischen Context-Injection ist es, **der KI in verschiedenen Arbeitsmodi unterschiedliche Verhaltensstrategien zu geben**.

### Drei Arbeitsmodi

Everything Claude Code bietet drei vordefinierte Kontexte:

| Modus | Datei | Fokus | Priorität | Anwendungsfall |
| --- | --- | --- | --- | --- |
| **dev** | `contexts/dev.md` | Funktionen implementieren, schnell iterieren | Erst zum Laufen bringen, dann verfeinern | Tägliche Entwicklung, neue Features |
| **review** | `contexts/review.md` | Code-Qualität, Sicherheit, Wartbarkeit | Erst Probleme finden, dann Fixes vorschlagen | Code-Review, PR-Prüfung |
| **research** | `contexts/research.md` | Problem verstehen, Lösungen erkunden | Erst verstehen, dann handeln | Technische Recherche, Bug-Analyse, Architekturdesign |

### Warum brauchen wir dynamische Kontexte?

::: info Kontext vs. System-Prompt

**System-Prompts** sind feste Anweisungen, die beim Start von Claude Code geladen werden (z.B. Inhalte aus `agents/`- und `rules/`-Verzeichnissen). Sie definieren das Grundverhalten der KI.

**Kontexte** sind temporäre Anweisungen, die Sie je nach aktuellem Arbeitsmodus dynamisch injizieren. Sie überschreiben oder ergänzen den System-Prompt, um das KI-Verhalten in bestimmten Szenarien anzupassen.

System-Prompts sind der "globale Standard", Kontexte sind die "szenariospezifische Anpassung".
:::

### Vergleich der Arbeitsmodi

Dieselbe Aufgabe zeigt in verschiedenen Modi unterschiedliches KI-Verhalten:

```markdown
### Aufgabe: Einen Bug beheben, der Login-Fehler verursacht

#### dev-Modus (Schnelle Behebung)
- Problem schnell lokalisieren
- Code direkt ändern
- Tests zur Verifizierung ausführen
- Erst zum Laufen bringen, dann optimieren

### review-Modus (Tiefgehende Analyse)
- Relevanten Code gründlich lesen
- Randbedingungen und Fehlerbehandlung prüfen
- Auswirkungen der Lösung bewerten
- Erst Probleme finden, dann Fixes vorschlagen

### research-Modus (Gründliche Untersuchung)
- Alle möglichen Ursachen erkunden
- Logs und Fehlermeldungen analysieren
- Hypothesen verifizieren
- Erst Ursache verstehen, dann Lösung präsentieren
```

## 🎒 Vorbereitung

::: warning Voraussetzungen

Dieses Tutorial setzt voraus, dass Sie:

- ✅ Den [Schnellstart](../../start/quickstart/) abgeschlossen haben
- ✅ Das Everything Claude Code Plugin installiert haben
- ✅ Grundlegende Konzepte der Sitzungsverwaltung kennen

:::

---

## Schritt für Schritt: Dynamische Kontexte verwenden

### Schritt 1: Die drei Kontexte verstehen

Lernen Sie zunächst die Definition jedes Kontexts kennen:

#### dev.md - Entwicklungsmodus

**Ziel**: Funktionen schnell implementieren, erst zum Laufen bringen, dann verfeinern

**Prioritäten**:
1. Get it working (Zum Laufen bringen)
2. Get it right (Korrekt machen)
3. Get it clean (Sauber machen)

**Verhaltensstrategie**:
- Write code first, explain after (Erst Code schreiben, dann erklären)
- Prefer working solutions over perfect solutions (Funktionierende Lösungen vor perfekten)
- Run tests after changes (Nach Änderungen Tests ausführen)
- Keep commits atomic (Commits atomar halten)

**Tool-Präferenzen**: Edit, Write (Code-Änderungen), Bash (Tests/Build ausführen), Grep/Glob (Code suchen)

---

#### review.md - Review-Modus

**Ziel**: Code-Qualitätsprobleme, Sicherheitslücken und Wartbarkeitsprobleme finden

**Prioritäten**: Critical (Kritisch) > High (Hoch) > Medium (Mittel) > Low (Niedrig)

**Verhaltensstrategie**:
- Read thoroughly before commenting (Gründlich lesen, bevor kommentiert wird)
- Prioritize issues by severity (Probleme nach Schweregrad priorisieren)
- Suggest fixes, don't just point out problems (Fixes vorschlagen, nicht nur Probleme aufzeigen)
- Check for security vulnerabilities (Auf Sicherheitslücken prüfen)

**Review-Checkliste**:
- [ ] Logic errors (Logikfehler)
- [ ] Edge cases (Randfälle)
- [ ] Error handling (Fehlerbehandlung)
- [ ] Security (injection, auth, secrets) (Sicherheit)
- [ ] Performance (Leistung)
- [ ] Readability (Lesbarkeit)
- [ ] Test coverage (Testabdeckung)

**Ausgabeformat**: Nach Datei gruppiert, Schweregrad priorisiert

---

#### research.md - Recherche-Modus

**Ziel**: Problem tiefgehend verstehen, mögliche Lösungen erkunden

**Recherche-Prozess**:
1. Understand the question (Frage verstehen)
2. Explore relevant code/docs (Relevanten Code/Dokumentation erkunden)
3. Form hypothesis (Hypothese aufstellen)
4. Verify with evidence (Mit Beweisen verifizieren)
5. Summarize findings (Erkenntnisse zusammenfassen)

**Verhaltensstrategie**:
- Read widely before concluding (Breit lesen, bevor Schlüsse gezogen werden)
- Ask clarifying questions (Klärende Fragen stellen)
- Document findings as you go (Erkenntnisse während der Arbeit dokumentieren)
- Don't write code until understanding is clear (Keinen Code schreiben, bis das Verständnis klar ist)

**Tool-Präferenzen**: Read (Code verstehen), Grep/Glob (Muster suchen), WebSearch/WebFetch (externe Dokumentation), Task with Explore agent (Codebase-Fragen)

**Ausgabeformat**: Erst Erkenntnisse, dann Empfehlungen

---

### Schritt 2: Kontext auswählen und anwenden

Wählen Sie je nach aktuellem Arbeitsszenario den passenden Kontext.

#### Szenario 1: Neues Feature implementieren

**Passender Kontext**: `dev.md`

**Anwendung**:

```markdown
@contexts/dev.md

Bitte implementiere eine Benutzerauthentifizierung:
1. E-Mail/Passwort-Login unterstützen
2. JWT-Token generieren
3. Middleware zum Schutz von Routen implementieren
```

**Wie Claude sich verhält**:
- Kernfunktionalität schnell implementieren
- Nicht über-engineeren
- Nach der Implementierung Tests zur Verifizierung ausführen
- Commits atomar halten (jeder Commit vollendet ein kleines Feature)

**Was Sie sehen sollten**:
- Schnell lauffähigen Code erhalten
- Tests bestehen
- Funktion nutzbar, möglicherweise noch nicht elegant

---

#### Szenario 2: PR eines Kollegen reviewen

**Passender Kontext**: `review.md`

**Anwendung**:

```markdown
@contexts/review.md

Bitte reviewe diesen PR: https://github.com/your-repo/pull/123

Fokus auf:
- Sicherheit (SQL-Injection, XSS, Authentifizierung)
- Fehlerbehandlung
- Performance-Probleme
```

**Wie Claude sich verhält**:
- Zuerst allen relevanten Code gründlich lesen
- Probleme nach Schweregrad sortieren
- Für jedes Problem einen Fix-Vorschlag machen
- Code nicht direkt ändern, nur Vorschläge machen

**Was Sie sehen sollten**:
- Strukturierten Review-Bericht (nach Datei, nach Schweregrad)
- Jedes Problem mit konkreter Position und Fix-Vorschlag
- Critical-Level-Probleme priorisiert markiert

---

#### Szenario 3: Integrationslösung für neue Technologie recherchieren

**Passender Kontext**: `research.md`

**Anwendung**:

```markdown
@contexts/research.md

Ich möchte ClickHouse als Analyse-Datenbank in das Projekt integrieren. Bitte recherchiere:

1. Vor- und Nachteile von ClickHouse
2. Wie es mit unserer bestehenden PostgreSQL-Architektur zusammenarbeitet
3. Migrationsstrategie und Risiken
4. Performance-Benchmark-Ergebnisse

Schreibe keinen Code, recherchiere zuerst die Lösung gründlich.
```

**Wie Claude sich verhält**:
- Zuerst ClickHouse-Dokumentation und Best Practices suchen
- Relevante Migrationsfälle lesen
- Kompatibilität mit bestehender Architektur analysieren
- Erkenntnisse während der Erkundung dokumentieren
- Am Ende umfassende Empfehlungen geben

**Was Sie sehen sollten**:
- Detaillierte technische Vergleichsanalyse
- Risikobewertung und Migrationsempfehlungen
- Kein Code, nur Lösungen und Schlussfolgerungen

---

### Schritt 3: Kontext innerhalb einer Sitzung wechseln

Sie können den Kontext innerhalb derselben Sitzung dynamisch wechseln, um sich an verschiedene Arbeitsphasen anzupassen.

**Beispiel: Entwicklung + Review Workflow**

```markdown
#### Schritt 1: Feature implementieren (dev-Modus)
@contexts/dev.md
Bitte implementiere eine Benutzer-Login-Funktion mit E-Mail/Passwort-Authentifizierung.
...
#### Claude implementiert das Feature schnell

#### Schritt 2: Selbst-Review (review-Modus)
@contexts/review.md
Bitte reviewe den gerade implementierten Login-Code:
...
#### Claude wechselt in den Review-Modus, analysiert Code-Qualität tiefgehend
#### Listet Probleme und Verbesserungsvorschläge nach Schweregrad

#### Schritt 3: Basierend auf Review-Ergebnissen verbessern (dev-Modus)
@contexts/dev.md
Behebe basierend auf dem obigen Review die Critical- und High-Level-Probleme.
...
#### Claude behebt Probleme schnell

#### Schritt 4: Erneutes Review (review-Modus)
@contexts/review.md
Reviewe den korrigierten Code erneut.
...
#### Claude verifiziert, ob Probleme behoben sind
```

**Was Sie sehen sollten**:
- Verschiedene Phasen haben klare Arbeitsschwerpunkte
- Entwicklungsphase: schnelle Iteration
- Review-Phase: tiefgehende Analyse
- Verhaltenskonflikte im selben Modus vermeiden

---

### Schritt 4: Benutzerdefinierten Kontext erstellen (optional)

Wenn die drei vordefinierten Modi Ihre Anforderungen nicht erfüllen, können Sie einen benutzerdefinierten Kontext erstellen.

**Kontext-Dateiformat**:

```markdown
#### My Custom Context

Mode: [Modusname]
Focus: [Fokus]

## Behavior
- Verhaltensregel 1
- Verhaltensregel 2

## Priorities
1. Priorität 1
2. Priorität 2

## Tools to favor
- Empfohlene Tools
```

**Beispiel: `debug.md` - Debug-Modus**

```markdown
#### Debug Context

Mode: Debugging and troubleshooting
Focus: Root cause analysis and fix

## Behavior
- Start by gathering evidence (logs, error messages, stack traces)
- Form hypothesis before proposing fixes
- Test fixes systematically (control variables)
- Document findings for future reference

## Debug Process
1. Reproduce the issue consistently
2. Gather diagnostic information
3. Narrow down potential causes
4. Test hypotheses
5. Verify the fix works

## Tools to favor
- Read for code inspection
- Bash for running tests and checking logs
- Grep for searching error patterns
```

**Benutzerdefinierten Kontext verwenden**:

```markdown
@contexts/debug.md

Ich habe dieses Problem in der Produktionsumgebung:
[Fehlermeldung]
[Relevante Logs]

Bitte hilf mir beim Debuggen.
```

---

## Checkpoint ✅

Nach Abschluss der obigen Schritte sollten Sie:

- [ ] Die Funktionsweise und Anwendungsfälle der drei vordefinierten Kontexte verstehen
- [ ] Den passenden Kontext je nach Arbeitsszenario auswählen können
- [ ] Den Kontext innerhalb einer Sitzung dynamisch wechseln können
- [ ] Wissen, wie man benutzerdefinierte Kontexte erstellt
- [ ] Den deutlichen Unterschied im KI-Verhalten bei verschiedenen Kontexten erlebt haben

---

## Häufige Fehler vermeiden

### ❌ Fehler 1: Kontext nicht wechseln und erwarten, dass die KI sich automatisch anpasst

**Problem**: In derselben Sitzung zwischen Entwicklung und Review wechseln, ohne der KI das aktuelle Ziel mitzuteilen.

**Symptom**: Claude verhält sich inkonsistent, analysiert manchmal zu viel, ändert manchmal hastig Code.

**Richtige Vorgehensweise**:
- Kontext explizit wechseln: `@contexts/dev.md` oder `@contexts/review.md`
- Zu Beginn jeder Phase das aktuelle Ziel deklarieren
- Mit `## Schritt X: [Ziel]` die Phase klar kennzeichnen

---

### ❌ Fehler 2: Research-Modus für schnelle Entwicklung verwenden

**Problem**: Ein Feature muss in 30 Minuten implementiert werden, aber `@contexts/research.md` wird verwendet.

**Symptom**: Claude verbringt viel Zeit mit Recherche, Diskussion und Analyse, beginnt aber nicht mit dem Programmieren.

**Richtige Vorgehensweise**:
- Für schnelle Entwicklung den `dev`-Modus verwenden
- Für tiefgehende Recherche den `research`-Modus verwenden
- Modus basierend auf Zeitdruck und Aufgabenkomplexität wählen

---

### ❌ Fehler 3: Dev-Modus für kritischen Code-Review verwenden

**Problem**: Kritischen Code, der Sicherheit, Finanzen oder Datenschutz betrifft, mit `@contexts/dev.md` reviewen.

**Symptom**: Claude überfliegt den Code schnell und übersieht möglicherweise schwerwiegende Sicherheitslücken.

**Richtige Vorgehensweise**:
- Kritischer Code-Review muss im `review`-Modus erfolgen
- Normale PR-Reviews im `review`-Modus durchführen
- `dev`-Modus nur für eigene schnelle Iterationen verwenden

---

## Zusammenfassung

Dynamische Context-Injection optimiert das KI-Verhalten in verschiedenen Szenarien durch klare Definition des aktuellen Arbeitsmodus:

**Drei vordefinierte Modi**:
- **dev**: Schnelle Implementierung, erst zum Laufen bringen, dann verfeinern
- **review**: Tiefgehendes Review, Probleme finden und Fixes vorschlagen
- **research**: Gründliche Recherche, erst verstehen, dann Schlüsse ziehen

**Wichtige Punkte**:
1. Kontext je nach Arbeitsphase wechseln
2. Mit `@contexts/xxx.md` den Kontext explizit laden
3. Mehrfacher Wechsel in derselben Sitzung möglich
4. Benutzerdefinierte Kontexte für spezifische Anforderungen erstellen

**Kernwert**: Inkonsistentes KI-Verhalten vermeiden, Fokus und Effizienz in verschiedenen Phasen verbessern.

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Konfigurationsdatei-Referenz: Vollständige settings.json-Dokumentation](../../appendix/config-reference/)**.
>
> Sie werden lernen:
> - Alle Konfigurationsoptionen von settings.json
> - Wie man Hooks konfiguriert
> - Aktivierungs- und Deaktivierungsstrategien für MCP-Server
> - Priorität von Projekt- und globaler Konfiguration

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-25

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| dev-Kontext-Definition | [`contexts/dev.md`](https://github.com/affaan-m/everything-claude-code/blob/main/contexts/dev.md) | 1-21 |
| review-Kontext-Definition | [`contexts/review.md`](https://github.com/affaan-m/everything-claude-code/blob/main/contexts/review.md) | 1-23 |
| research-Kontext-Definition | [`contexts/research.md`](https://github.com/affaan-m/everything-claude-code/blob/main/contexts/research.md) | 1-27 |

**Wichtige Kontext-Dateien**:
- `dev.md`: Entwicklungsmodus-Kontext, priorisiert schnelle Feature-Implementierung
- `review.md`: Review-Modus-Kontext, priorisiert das Finden von Code-Qualitätsproblemen
- `research.md`: Recherche-Modus-Kontext, priorisiert tiefgehendes Problemverständnis

</details>

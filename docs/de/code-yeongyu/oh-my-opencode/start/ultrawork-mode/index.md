---
title: "Ultrawork-Modus: Alle Funktionen aktivieren | oh-my-opencode"
sidebarTitle: "Ultrawork-Modus"
subtitle: "Ultrawork-Modus: Alle Funktionen mit einem Befehl aktivieren"
description: "Lernen Sie den Ultrawork-Modus von oh-my-opencode kennen, um alle Funktionen mit einem Befehl zu aktivieren. Aktiviert parallele Agenten, erzwungene Fertigstellung und das Kategorie-+ Skills-System."
tags:
  - "ultrawork"
  - "Hintergrundaufgaben"
  - "Agent-Zusammenarbeit"
prerequisite:
  - "start-installation"
  - "start-sisyphus-orchestrator"
order: 30
---

# Ultrawork-Modus: Alle Funktionen mit einem Befehl aktivieren

## Was Sie lernen werden

- Alle erweiterten Funktionen von oh-my-opencode mit einem einzigen Befehl aktivieren
- Mehrere KI-Agenten wie ein echtes Team parallel arbeiten lassen
- Manuelles Konfigurieren mehrerer Agenten und Hintergrundaufgaben vermeiden
- Die Designphilosophie und Best Practices des Ultrawork-Modus verstehen

## Ihre aktuellen Herausforderungen

Sie haben während der Entwicklung möglicherweise folgende Situationen erlebt:

- **Zu viele Funktionen, keine Ahnung, wie man sie nutzt**: Sie haben 10 spezialisierte Agenten, Hintergrundaufgaben, LSP-Tools, wissen aber nicht, wie Sie sie schnell aktivieren können
- **Manuelle Konfiguration erforderlich**: Jede komplexe Aufgabe erfordert manuelles Festlegen von Agenten, Hintergrundparallelität und anderen Einstellungen
- **Ineffiziente Agent-Zusammenarbeit**: Aufrufen von Agenten in Serie, Verschwendung von Zeit und Kosten
- **Aufgaben stecken mittendrin fest**: Agenten haben nicht genug Motivation und Zwänge, um Aufgaben zu beenden

Dies alles beeinträchtigt Ihre Fähigkeit, die wahre Kraft von oh-my-opencode zu entfesseln.

## Kernkonzept

Der **Ultrawork-Modus** ist der "Mit einem Klick alles aktivieren"-Mechanismus von oh-my-opencode.

::: info Was ist der Ultrawork-Modus?
Der Ultrawork-Modus ist ein spezieller Arbeitsmodus, der durch ein Schlüsselwort ausgelöst wird. Wenn Ihre Eingabe das Schlüsselwort `ultrawork` oder seine Abkürzung `ulw` enthält, aktiviert das System automatisch alle erweiterten Funktionen: parallele Hintergrundaufgaben, tiefe Erkundung, erzwungene Fertigstellung, Multi-Agent-Zusammenarbeit und mehr.
:::

### Designphilosophie

Der Ultrawork-Modus basiert auf den folgenden Kernprinzipien (aus dem [Ultrawork-Manifest](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/ultrawork-manifesto.md)):

| Prinzip | Beschreibung |
|----------|-------------|
| **Menschliches Eingreifen ist ein Fehlersignal** | Wenn Sie ständig KI-Ausgaben korrigieren müssen, bedeutet das, dass ein Problem mit dem Systemdesign vorliegt |
| **Ununterscheidbarer Code** | Von KI geschriebener Code sollte von Code von Senior-Ingenieuren ununterscheidbar sein |
| **Kognitive Belastung minimieren** | Sie müssen nur sagen, "was zu tun ist", Agenten sind für "wie es zu tun ist" verantwortlich |
| **Vorhersehbar, konsistent, delegierbar** | Agenten sollten so stabil und zuverlässig wie ein Compiler sein |

### Aktivierungsmechanismus

Wenn das System das Schlüsselwort `ultrawork` oder `ulw` erkennt:

1. **Maximale Präzisionsmodus einstellen**: `message.variant = "max"`
2. **Toast-Benachrichtigung anzeigen**: "Ultrawork-Modus aktiviert - Maximale Präzision engagiert. Alle Agenten zur Verfügung."
3. **Vollständige Anweisungen injizieren**: Injiziert 200+ Zeilen ULTRAWORK-Anweisungen an Agenten, einschließlich:
   - Erfordert 100%ige Sicherheit vor Beginn der Implementierung
   - Erfordert parallele Verwendung von Hintergrundaufgaben
   - Erzwungene Verwendung des Kategorie-+ Skills-Systems
   - Erzwungene Fertigstellungsverifizierung (TDD-Workflow)
   - Verbietet jegliche "Ich kann das nicht"-Ausreden

## Schritt-für-Schritt

### Schritt 1: Ultrawork-Modus auslösen

Geben Sie eine Eingabe ein, die das Schlüsselwort `ultrawork` oder `ulw` enthält, in OpenCode:

```
ultrawork develop a REST API
```

Oder noch prägnanter:

```
ulw add user authentication
```

**Sie sollten sehen**:
- Eine Toast-Benachrichtigung poppt auf der Schnittstelle auf: "Ultrawork-Modus aktiviert"
- Die Agent-Antwort beginnt mit "ULTRAWORK MODUS AKTIVIERT!"

### Schritt 2: Änderungen im Agentenverhalten beobachten

Nach dem Aktivieren des Ultrawork-Modus werden Agenten:

1. **Parallele Erkundung der Codebasis**
   ```
   delegate_task(agent="explore", prompt="find existing API patterns", background=true)
   delegate_task(agent="explore", prompt="find test infrastructure", background=true)
   delegate_task(agent="librarian", prompt="find authentication best practices", background=true)
   ```

2. **Plan-Agent aufrufen, um Arbeitsplan zu erstellen**
   ```
   delegate_task(subagent_type="plan", prompt="create detailed plan based on gathered context")
   ```

3. **Kategorie-+ Skills verwenden, um Aufgaben auszuführen**
   ```
   delegate_task(category="visual-engineering", load_skills=["frontend-ui-ux", "playwright"], ...)
   ```

**Sie sollten sehen**:
- Mehrere Hintergrundaufgaben, die gleichzeitig laufen
- Agenten rufen aktiv spezialisierte Agenten auf (Oracle, Librarian, Explore)
- Vollständige Testpläne und Arbeitsaufschlüsselung
- Aufgaben führen weiter aus, bis 100% abgeschlossen

### Schritt 3: Aufgabenerfüllung verifizieren

Nachdem Agenten fertig sind, werden sie:

1. **Verifizierungsnachweise zeigen**: Tatsächliche Testlaufausgaben, manuelle Verifizierungsbeschreibungen
2. **Alle TODOs als abgeschlossen bestätigen**: Wird nicht vorzeitig Fertigstellung erklären
3. **Erledigte Arbeit zusammenfassen**: Auflisten, was getan wurde und warum

**Sie sollten sehen**:
- Klare Testergebnisse (nicht "sollte funktionieren")
- Alle Probleme gelöst
- Keine unvollständige TODO-Liste

## Kontrollpunkt ✅

Nach Abschluss der obigen Schritte bestätigen Sie:

- [ ] Sie sehen eine Toast-Benachrichtigung nach Eingabe von `ulw`
- [ ] Die Agent-Antwort beginnt mit "ULTRAWORK MODUS AKTIVIERT!"
- [ ] Sie beobachten parallele Hintergrundaufgaben, die laufen
- [ ] Agenten verwenden das Kategorie-+ Skills-System
- [ ] Es gibt Verifizierungsnachweise nach Aufgabenerfüllung

Wenn ein Punkt fehlschlägt, überprüfen Sie:
- Ist das Schlüsselwort richtig geschrieben (`ultrawork` oder `ulw`)
- Sind Sie in der Hauptsitzung (Hintergrundaufgaben lösen den Modus nicht aus)
- Ist die Konfigurationsdatei mit relevanten Funktionen aktiviert

## Wann Sie diese Technik verwenden sollten

| Szenario | Ultrawork verwenden | Normaler Modus |
|----------|-------------------|----------------|
| **Komplexe neue Funktionen** | ✅ Empfohlen (erfordert Multi-Agent-Zusammenarbeit) | ❌ Möglicherweise nicht effizient genug |
| **Dringende Fixes** | ✅ Empfohlen (benötigt schnelle Diagnose und Erkundung) | ❌ Möglicherweise Kontext verpassen |
| **Einfache Änderungen** | ❌ Übertrieben (verschwendet Ressourcen) | ✅ Geeigneter |
| **Schnelle Ideengültigkeit** | ❌ Übertrieben | ✅ Geeigneter |

**Faustregel**:
- Aufgabe umfasst mehrere Module oder Systeme → Verwenden Sie `ulw`
- Tiefe Erforschung der Codebasis erforderlich → Verwenden Sie `ulw`
- Mehrere spezialisierte Agenten aufrufen müssen → Verwenden Sie `ulw`
- Einzelne Datei kleine Änderung → `ulw` nicht erforderlich

## Häufige Fallstricke

::: warning Wichtige Hinweise

**1. Verwenden Sie nicht `ulw` in jeder Eingabe**

Der Ultrawork-Modus injiziert eine große Menge an Anweisungen, was für einfache Aufgaben übertrieben ist. Verwenden Sie ihn nur für komplexe Aufgaben, die wirklich Multi-Agent-Zusammenarbeit, parallele Erkundung und tiefe Analyse erfordern.

**2. Hintergrundaufgaben lösen den Ultrawork-Modus nicht aus**

Der Schlüsselwort-Detector überspringt Hintergrundsitzungen, um ein falsches Injizieren des Modus in Sub-Agenten zu vermeiden. Der Ultrawork-Modus funktioniert nur in der Hauptsitzung.

**3. Stellen Sie sicher, dass die Provider-Konfiguration korrekt ist**

Der Ultrawork-Modus basiert auf mehreren KI-Modellen, die parallel arbeiten. Wenn bestimmte Provider nicht konfiguriert oder nicht verfügbar sind, können Agenten möglicherweise keine spezialisierten Agenten aufrufen.
:::

## Lektion Zusammenfassung

Der Ultrawork-Modus erreicht das Designziel "Alle Funktionen mit einem Befehl aktivieren" durch Schlüsselwort-Auslösung:

- **Einfach zu verwenden**: Geben Sie einfach `ulw` ein, um zu aktivieren
- **Automatische Zusammenarbeit**: Agenten rufen automatisch andere Agenten auf und führen Hintergrundaufgaben parallel aus
- **Erzwungene Fertigstellung**: Vollständiger Verifizierungsmechanismus garantiert 100%ige Fertigstellung
- **Null-Konfiguration**: Kein manuelles Festlegen von Agentenprioritäten, Parallelitätsgrenzen usw. erforderlich

Denken Sie daran: Der Ultrawork-Modus ist so konzipiert, dass Agenten wie ein echtes Team arbeiten. Sie müssen nur Absicht ausdrücken, Agenten sind für die Ausführung verantwortlich.

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Provider-Konfiguration](../../platforms/provider-setup/)** kennen.
>
> Sie lernen:
> - Wie Sie mehrere Provider wie Anthropic, OpenAI, Google konfigurieren
> - Wie die Multi-Modell-Strategie automatisch degradiert und optimale Modelle auswählt
> - Wie Sie Provider-Verbindungen und Kontingentnutzung testen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcode-Speicherorte zu erweitern</strong></summary>

> Zuletzt aktualisiert: 2026-01-26

| Funktion | Dateipfad | Zeilennummern |
|----------|-----------|--------------|
| Ultrawork-Designphilosophie | [`docs/ultrawork-manifesto.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/ultrawork-manifesto.md) | 1-198 |
| Schlüsselwort-Detector Hook | [`src/hooks/keyword-detector/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/index.ts) | 12-100 |
| ULTRAWORK-Anweisungsvorlage | [`src/hooks/keyword-detector/constants.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/constants.ts) | 54-280 |
| Schlüsselwort-Erkennungslogik | [`src/hooks/keyword-detector/detector.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/detector.ts) | 26-53 |

**Wichtige Konstanten**:
- `KEYWORD_DETECTORS`: Konfiguration des Schlüsselwort-Detectors, einschließlich drei Modi: ultrawork, search, analyze
- `CODE_BLOCK_PATTERN`: Codeblock-Regex-Muster, verwendet zum Filtern von Schlüsselwörtern in Codeblöcken
- `INLINE_CODE_PATTERN`: Inline-Code-Regex-Muster, verwendet zum Filtern von Schlüsselwörtern in Inline-Code

**Wichtige Funktionen**:
- `createKeywordDetectorHook()`: Erstellt Schlüsselwort-Detector Hook, hört auf UserPromptSubmit-Ereignis
- `detectKeywordsWithType()`: Erkennt Schlüsselwörter im Text und gibt Typ zurück (ultrawork/search/analyze)
- `getUltraworkMessage()`: Generiert vollständige ULTRAWORK-Modus-Anweisungen (wählt Planner oder normalen Modus basierend auf Agententyp)
- `removeCodeBlocks()`: Entfernt Codeblöcke aus Text, um das Auslösen von Schlüsselwörtern in Codeblöcken zu vermeiden

**Geschäftsregeln**:
| Regel-ID | Regelbeschreibung | Tag |
|----------|-------------------|-----|
| BR-4.8.4-1 | Aktiviert Ultrawork-Modus, wenn "ultrawork" oder "ulw" erkannt wird | [Fact] |
| BR-4.8.4-2 | Ultrawork-Modus setzt `message.variant = "max"` | [Fact] |
| BR-4.8.4-3 | Ultrawork-Modus zeigt Toast-Benachrichtigung: "Ultrawork-Modus aktiviert" | [Fact] |
| BR-4.8.4-4 | Hintergrundaufgaben-Sitzungen überspringen Schlüsselwort-Erkennung, um Modus-Injektion zu vermeiden | [Fact] |
| BR-4.8.4-5 | Nicht-Hauptsitzungen erlauben nur ultrawork-Schlüsselwort, blockieren andere Modus-Injektion | [Fact] |

</details>

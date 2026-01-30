---
title: "AI App Factory Best Practices: Produktbeschreibung, Checkpoints, Umfang und iterative Entwicklung | Tutorial"
sidebarTitle: "Best Practices"
subtitle: "Best Practices: Klare Beschreibung, Checkpoint-Nutzung, Umfangskontrolle und Iterationstechniken"
description: "Meistern Sie die AI App Factory Best Practices, um die Qualität und Effizienz von KI-generierten Anwendungen zu verbessern. Lernen Sie, klare Produktbeschreibungen zu schreiben, Checkpoints zur Qualitätskontrolle zu nutzen, Nicht-Ziele zur Vermeidung von Scope Creep zu definieren, Ideen iterativ zu validieren, Tokens durch separate Sessions zu sparen und mit Fehlern und Wiederholungen umzugehen. Dieses Tutorial behandelt sechs Schlüsseltechniken: Eingabequalität, Checkpoint-Validierung, MVP-Kontrolle, iterative Entwicklung, Kontextoptimierung und Fehlerbehandlung."
tags:
  - "Best Practices"
  - "MVP"
  - "Iterative Entwicklung"
prerequisite:
  - "start-getting-started"
  - "start-pipeline-overview"
order: 200
---

# Best Practices: Klare Beschreibung, Checkpoint-Nutzung, Umfangskontrolle und Iterationstechniken

## Was Sie nach Abschluss können

Nach Abschluss dieser Lektion beherrschen Sie:
- Wie Sie qualitativ hochwertige Produktbeschreibungen erstellen, damit die KI Ihre Ideen versteht
- Wie Sie den Checkpoint-Mechanismus nutzen, um die Ausgabequalität jeder Phase zu steuern
- Wie Sie durch Nicht-Ziele klare Umfangsgrenzen definieren und Projektaufblähung verhindern
- Wie Sie durch schrittweise Iterationen Ideen schnell validieren und kontinuierlich optimieren

## Ihre aktuelle Herausforderung

Sind Sie auch in diese Situationen geraten:
- "Ich habe es doch klar gesagt, warum ist das Ergebnis nicht das, was ich will?"
- "An einem Stelle unzufrieden, alles danach ist falsch – korrigieren ist schmerzhaft"
- "Immer mehr Funktionen entstehen, Abschluss ist unmöglich"
- "Alle Funktionen auf einmal machen wollen, aber nichts wird fertig"

## Wann diese Methode nutzen

Egal, ob Sie AI App Factory zum ersten Mal verwenden oder bereits Erfahrung haben, diese Best Practices helfen Ihnen:
- **Ausgabequalität verbessern**: Die generierte Anwendung entspricht eher Ihren Erwartungen
- **Korrekturzeit sparen**: Fehlerakkumulation vermeiden, Probleme frühzeitig erkennen
- **Projektumfang steuern**: Auf MVP fokussieren, schnell liefern
- **Entwicklungskosten senken**: Phasenweise Validierung, unnötige Investitionen vermeiden

## 🎒 Vorbereitungen vor dem Start

::: warning Voraussetzungen
- [Schnellstart](../../start/getting-started/) gelesen, um die Grundkonzepte von AI App Factory zu verstehen
- [7-Phasen-Pipeline-Übersicht](../../start/pipeline-overview/) gelesen, um den vollständigen Prozess zu verstehen
- Mindestens eine vollständige Pipeline-Ausführung abgeschlossen (damit Sie ein intuitives Gefühl für die Ausgaben jeder Phase haben)
:::

## Kernkonzepte

Die Best Practices von AI App Factory drehen sich um vier Kernprinzipien:

1. **Eingabequalität bestimmt Ausgabequalität**: Klare, detaillierte Produktbeschreibung ist der erste Schritt zum Erfolg
2. **Checkpoints sind Qualitätsabwehr**: Sorgfältige Bestätigung nach jeder Phase vermeidet Fehlerakkumulation
3. **MVP-Fokus**: Klare Nicht-Ziele, Umfangskontrolle, schnelle Lieferung der Kernfunktionen
4. **Kontinuierliche Iteration**: Zuerst die Kernidee validieren, dann Funktionen schrittweise erweitern

Diese Prinzipien stammen aus der Zusammenfassung von Quellcode und Praxiserfahrung. Wenn Sie ihnen folgen, wird sich Ihre Entwicklungseffizienz vervielfachen.

## Folgen Sie mir

### Tipp 1: Klare Produktbeschreibung bereitstellen

#### Warum

Wenn die KI Ihre Ideen versteht, kann sie sich nur auf die von Ihnen bereitgestellten Textinformationen verlassen. Je klarer die Beschreibung, desto eher entspricht das generierte Ergebnis Ihren Erwartungen.

#### Wie

**Eine gute Produktbeschreibung enthält folgende Elemente**:
- **Zielbenutzer**: Wer wird dieses Produkt verwenden?
- **Kernproblem**: Welche Schwierigkeiten haben Benutzer?
- **Lösung**: Wie löst das Produkt dieses Problem?
- **Schlüsselfunktionen**: Welche Funktionen müssen enthalten sein?
- **Nutzungsszenarien**: Wann benutzen Benutzer das Produkt?
- **Einschränkungen**: Welche Einschränkungen oder speziellen Anforderungen gibt es?

#### Vergleichsbeispiele

| ❌ Schlechte Beschreibung | ✅ Gute Beschreibung |
| --- | --- |
| Mach eine Fitness-App | Eine App zur Unterstützung von Fitness-Anfängern beim Aufzeichnen von Trainingseinheiten. Unterstützt Aufzeichnung von Trainingsart, Dauer, verbrannten Kalorien und Anzeige der wöchentlichen Trainingsstatistiken. Zielgruppe sind junge Menschen, die gerade mit dem Training beginnen. Die Kernfunktionen sind schnelle Aufzeichnung und Fortschrittsanzeige, ohne soziales Teilen oder kostenpflichtige Funktionen |
| Mach eine Buchhaltungs-App | Eine mobile Buchhaltungs-App zur schnellen Aufzeichnung täglicher Ausgaben für junge Menschen. Hauptfunktionen sind Betrag eingeben, Kategorie auswählen (Ernährung, Verkehr, Unterhaltung, Sonstiges), monatliche Gesamtausgaben und Kategoriestatistiken anzeigen. Unterstützt Offline-Nutzung, Daten werden nur lokal gespeichert |
| Mach ein Aufgabenverwaltungs-Tool | Ein einfaches Tool zur Aufgabenverwaltung für kleine Teams. Unterstützt Erstellen von Aufgaben, Zuweisen von Mitgliedern, Festlegen von Fristen, Anzeigen der Aufgabenliste. Teammitglieder können Aufgabenstatus teilen. Kein komplexer Workflow oder Berechtigungsmanagement erforderlich |

#### Checkpoint ✅

- [ ] Die Beschreibung definiert die Zielbenutzer klar
- [ ] Die Beschreibung erklärt das Kernproblem der Benutzer
- [ ] Die Beschreibung listet die Schlüsselfunktionen auf (nicht mehr als 5)
- [ ] Die Beschreibung enthält Einschränkungen oder Nicht-Ziele

---

### Tipp 2: Sorgfältige Bestätigung an Checkpoints

#### Warum

Nach Abschluss jeder Phase der Pipeline wird an einem Checkpoint pausiert und auf Ihre Bestätigung gewartet. Dies ist die **Qualitätsabwehr**, die es Ihnen ermöglicht, Probleme frühzeitig zu erkennen und zu vermeiden, dass sie sich in nachfolgenden Phasen ausbreiten.

Wenn Sie in dieser Phase ein Problem entdecken, müssen Sie nur die aktuelle Phase erneut ausführen. Wenn Sie es erst am Ende entdecken, müssen Sie möglicherweise mehrere Phasen zurückrollen, was viel Zeit und Tokens verschwendet.

#### Wie

**Bestätigen Sie bei jedem Checkpoint folgende Inhalte**:

**Bootstrap-Phase Checkpoint**:
- [ ] Die Problemdefinition in `input/idea.md` ist korrekt
- [ ] Die Zielbenutzer-Persona ist klar und spezifiziert
- [ ] Das Kernwertversprechen ist eindeutig
- [ ] Die Annahmen sind vernünftig

**PRD-Phase Checkpoint**:
- [ ] User Stories sind klar und enthalten Akzeptanzkriterien
- [ ] Funktionsliste nicht mehr als 7 (MVP-Prinzip)
- [ ] Nicht-Ziele (Non-Goals) sind klar aufgelistet
- [ ] Keine technischen Details enthalten (wie React, API, Datenbank)

**UI-Phase Checkpoint**:
- [ ] Seitenstruktur ist vernünftig, nicht mehr als 3 Seiten
- [ ] Das Prototyp kann im Browser angezeigt werden
- [ ] Interaktionsfluss ist klar
- [ ] Ästhetischer Stil ist ausgeprägt (vermeiden Sie gängige KI-Stile)

**Tech-Phase Checkpoint**:
- [ ] Tech-Stack-Wahl ist vernünftig und entspricht dem MVP-Prinzip
- [ ] Datenmodell-Design ist einfach, Tabellenanzahl nicht mehr als 10
- [ ] API-Endpunkt-Liste ist vollständig
- [ ] Keine übermäßigen Designs wie Microservices, Caching eingeführt

**Code-Phase Checkpoint**:
- [ ] Frontend- und Backend-Code-Struktur ist vollständig
- [ ] Enthält Testfälle
- [ ] Keine offensichtlichen `any`-Typen
- [ ] Enthält README.md mit Anweisungen zur Ausführung

**Validation-Phase Checkpoint**:
- [ ] Keine schwerwiegenden Sicherheitsprobleme im Validierungsbericht
- [ ] Testabdeckung > 60%
- [ ] Keine Konflikte bei Abhängigkeitsinstallation
- [ ] TypeScript-Typprüfung bestanden

**Preview-Phase Checkpoint**:
- [ ] README.md enthält vollständige Ausführungsanweisungen
- [ ] Docker-Konfiguration kann erfolgreich gebaut werden
- [ ] Frontend- und Backend-Services können lokal gestartet werden
- [ ] Enthält Umgebungsvariablen-Konfigurationsanweisungen

#### Checkpoint-Bestätigungsprozess

Bei jedem Checkpoint bietet das System folgende Optionen:
- **Weiter**: Wenn die Ausgabe den Erwartungen entspricht, zur nächsten Phase fortfahren
- **Wiederholen**: Wenn die Ausgabe Probleme hat, Korrekturvorschläge geben und aktuelle Phase erneut ausführen
- **Pausieren**: Wenn Sie mehr Informationen benötigen oder die Idee anpassen möchten, Pipeline pausieren

**Entscheidungsprinzipien**:
- ✅ **Weiter**: Alle Prüfpunkte erfüllen die Anforderungen
- ⚠️ **Wiederholen**: Kleine Probleme (Format, Auslassungen, Details), können sofort korrigiert werden
- 🛑 **Pausieren**: Schwerwiegende Probleme (falsche Richtung, Umfang außer Kontrolle, nicht korrigierbar), Neuplanung erforderlich

#### Fallstrick-Hinweis

::: danger Häufige Fehler
**Überspringen Sie nicht die Checkpoint-Bestätigung, um "schnell fertig zu werden"!**

Die Pipeline ist so konzipiert, dass sie "nach jeder Phase zur Bestätigung pausiert", damit Sie Probleme rechtzeitig erkennen. Wenn Sie gewohnheitsmäßig auf "Weiter" klicken und erst am Ende Probleme entdecken, müssen Sie möglicherweise:
- Mehrere Phasen zurückrollen
- Viel Arbeit erneut ausführen
- Viele Tokens verschwenden

Denken Sie daran: **Der Zeitaufwand für Checkpoint-Bestätigung ist viel geringer als die Zeitkosten für das Zurückrollen und Neumachen**.
:::

---

### Tipp 3: Nicht-Ziele zur Umfangskontrolle nutzen

#### Warum

**Nicht-Ziele (Non-Goals) sind die Kernwaffe der MVP-Entwicklung**. Durch die klare Auflistung von "was nicht getan wird", kann Scope Creep effektiv verhindert werden.

Die Wurzel vieler gescheiterter Projekte ist nicht zu wenige Funktionen, sondern zu viele. Jede neue Funktion erhöht Komplexität, Entwicklungszeit und Wartungskosten. Nur durch klare Grenzen und Fokus auf Kernwerte können Sie schnell liefern.

#### Wie

**In der Bootstrap-Phase, Nicht-Ziele klar auflisten**:

```markdown
## Nicht-Ziele (Funktionen, die in dieser Version nicht getan werden)

1. Keine Unterstützung für Mehrbenutzer-Kollaboration
2. Keine Unterstützung für Echtzeit-Synchronisation
3. Keine Integration von Drittanbieterdiensten (wie Zahlung, Karten)
4. Keine Datenanalyse oder Berichtsfunktionen
5. Keine Social-Sharing-Funktionen
6. Keine Benutzer-Authentifizierung oder Anmeldefunktion erforderlich
```

**In der PRD-Phase, Nicht-Ziele als eigenständigen Abschnitt**:

```markdown
## Nicht-Ziele (Explizit nicht in dieser Version)

Die folgenden Funktionen haben zwar Wert, sind aber nicht im Rahmen dieses MVP:

| Funktion | Begründung | Zukünftige Planung |
| --- | --- | --- |
| Mehrbenutzer-Kollaboration | Fokus auf Einzelbenutzer | In v2.0 in Betracht ziehen |
| Echtzeit-Synchronisation | Erhöht technische Komplexität | Nach starkem Benutzerfeedback in Betracht ziehen |
| Zahlungsintegration | Kein Kernwert | In v1.5 in Betracht ziehen |
| Datenanalyse | MVP nicht erforderlich | In v2.0 in Betracht ziehen |
```

#### Kriterien für Nicht-Ziele

**Wie zu entscheiden, ob etwas als Nicht-Ziel gelten soll**:
- ❌ Diese Funktion ist zur Validierung der Kernidee nicht erforderlich → Als Nicht-Ziel
- ❌ Diese Funktion erhöht die technische Komplexität erheblich → Als Nicht-Ziel
- ❌ Diese Funktion kann manuell ersetzt werden → Als Nicht-Ziel
- ✅ Diese Funktion ist der Grund für die Existenz des Produkts → Muss enthalten sein

#### Fallstrick-Hinweis

::: warning Scope Creep-Falle
**Typische Signale von Scope Creep**:

1. "Ist doch einfach, einfach eine hinzufügen..."
2. "Konkurrenzprodukte haben diese Funktion, wir müssen auch..."
3. "Benutzer könnten das brauchen, machen wir es einfach..."
4. "Diese Funktion ist interessant, kann die Produkt-Highlights verbessern..."

**Wenn Sie auf diese Ideen stoßen, fragen Sie sich drei Fragen**:
1. Ist diese Funktion nützlich, um die Kernidee zu validieren?
2. Kann das Produkt ohne diese Funktion noch verwendet werden?
3. Wird das Hinzufügen dieser Funktion die Lieferzeit verzögern?

Wenn die Antworten "nicht erforderlich", "kann verwendet", "verzögert", dann entscheiden Sie sich für Nicht-Ziele.
:::

---

### Tipp 4: Schrittweise Iteration, schnelle Validierung

#### Warum

**Der Kerngedanke von MVP (Minimum Viable Product) ist die schnelle Validierung von Ideen**, nicht auf einmal perfekt zu machen.

Durch iterative Entwicklung können Sie:
- Frühes Benutzerfeedback erhalten
- Rechtzeitig die Richtung anpassen
- Sunk Costs reduzieren
- Entwicklungsmotivation aufrechterhalten

#### Wie

**Schritte der iterativen Entwicklung**:

**Runde 1: Kernfunktionsvalidierung**
1. Verwenden Sie AI App Factory, um die erste Version der Anwendung zu generieren
2. Nur die 3-5 wichtigsten Kernfunktionen enthalten
3. Schnell ausführen und testen
4. Echte Benutzern das Prototyp zeigen, Feedback sammeln

**Runde 2: Optimierung basierend auf Feedback**
1. Basierend auf Benutzerfeedback die wichtigsten Verbesserungspunkte priorisieren
2. `input/idea.md` oder `artifacts/prd/prd.md` ändern
3. Verwenden Sie `factory run <stage>`, um ab der entsprechenden Phase erneut auszuführen
4. Neue Version generieren und testen

**Runde 3: Funktionserweiterung**
1. Bewerten, ob das Kernziel erreicht wurde
2. 2-3 hochwertige Funktionen auswählen
3. Durch Pipeline generieren und integrieren
4. Kontinuierlich iterieren, schrittweise perfektionieren

#### Iteratives Praxisbeispiel

**Szenario**: Sie möchten eine Aufgabenverwaltungsanwendung erstellen

**Runde 1 MVP**:
- Kernfunktionen: Aufgabe erstellen, Listenanzeige, als erledigt markieren
- Nicht-Ziele: Mitgliederverwaltung, Berechtigungssteuerung, Erinnerungsbenachrichtigungen
- Lieferzeit: 1 Tag

**Runde 2 Optimierung** (basierend auf Feedback):
- Benutzerfeedback: Aufgaben mit Tags versehen wollen
- PRD ändern, Funktion "Tag-Klassifizierung" hinzufügen
- Pipeline ab UI-Phase erneut ausführen
- Lieferzeit: Halber Tag

**Runde 3 Erweiterung** (nach erfolgreicher Validierung):
- Mitgliederverwaltungsfunktion hinzufügen
- Frist-Erinnerungen hinzufügen
- Aufgaben-Kommentarfunktion hinzufügen
- Lieferzeit: 2 Tage

#### Checkpoint ✅

Vor jeder Iteration prüfen:
- [ ] Ob die neue Funktion mit dem Kernziel übereinstimmt
- [ ] Ob die neue Funktion durch Benutzeranforderungen gestützt wird
- [ ] Ob die neue Funktion die Komplexität erheblich erhöht
- [ ] Ob klare Akzeptanzkriterien vorliegen

---

## Fortgeschrittene Tipps

### Tipp 5: Tokens durch separate Sessions sparen

#### Warum

Lange Laufzeit der Pipeline führt zur Anhäufung von Kontext und verbraucht viele Tokens. **Ausführung in separaten Sessions** ermöglicht jeder Phase einen sauberen Kontext und senkt die Nutzungskosten erheblich.

#### Wie

**Wählen Sie bei jedem Checkpoint "Neue Session fortsetzen"**:

```bash
# In einem neuen Befehlsfenster ausführen
factory continue
```

Das System automatisch:
1. Liest `.factory/state.json` zum Wiederherstellen des Status
2. Startet ein neues Claude Code-Fenster
3. Führt ab der nächsten ausstehenden Phase fort
4. Lädt nur die für diese Phase erforderlichen Eingabedateien

**Vergleich**:

| Methode | Vorteile | Nachteile |
| --- | --- | --- |
| In gleicher Session fortfahren | Einfach, kein Fensterwechsel erforderlich | Kontext akkumuliert, hoher Token-Verbrauch |
| Neue Session fortfahren | Jede Phase hat sauberen Kontext, spart Tokens | Fensterwechsel erforderlich |

::: tip Empfohlene Vorgehensweise
**Für große Projekte oder begrenzte Token-Budgets wird dringend empfohlen, "Neue Session fortsetzen" zu verwenden**.

Detaillierte Erklärung siehe [Kontextoptimierung](../../advanced/context-optimization/) Tutorial.
:::

---

### Tipp 6: Umgang mit Fehlern und Wiederholungen

#### Warum

Bei der Pipeline-Ausführung können Fehler auftreten (ungenügende Eingaben, Berechtigungsprobleme, Code-Fehler usw.). Das Verständnis, wie man mit Fehlern umgeht, ermöglicht Ihnen eine schnellere Fortschrittsfortsetzung.

#### Wie

**Best Practices für Fehlerbehandlung** (siehe `failure.policy.md:267-274`):

1. **Frühes Scheitern**: Probleme frühzeitig erkennen, Verschwendung von Zeit in nachfolgenden Phasen vermeiden
2. **Detaillierte Logs**: Ausreichende Kontextinformationen aufzeichnen, um Probleme zu beheben
3. **Atomare Operationen**: Die Ausgabe jeder Phase sollte atomar sein, um ein Rollback zu ermöglichen
4. **Beweise behalten**: Fehlgeschlagene Ergebnisse archivieren, bevor erneut versucht wird, um Vergleichsanalysen zu ermöglichen
5. **Schrittweise Wiederholung**: Bei Wiederholungen konkretere Anleitungen bereitstellen, anstatt einfache Wiederholung

**Typische Fehler-Szenarien**:

| Fehlertyp | Symptom | Lösungsansatz |
| --- | --- | --- |
| Ausgabe fehlt | `input/idea.md` existiert nicht | Wiederholen, Schreibpfad prüfen |
| Scope Creep | Funktionsanzahl > 7 | Wiederholen, auf MVP reduzieren anfordern |
| Technischer Fehler | TypeScript-Kompilierung fehlgeschlagen | Typdefinition prüfen, wiederholen |
| Berechtigungsproblem | Agent schreibt in nicht autorisiertes Verzeichnis | Fähigkeitsgrenzen-Matrix prüfen |

**Fehlerwiederherstellungs-Checkliste**:
- [ ] Fehlerursache ist klar
- [ ] Korrekturansatz ist implementiert
- [ ] Verwandte Konfigurationen sind aktualisiert
- [ ] Von der fehlgeschlagenen Phase neu beginnen

::: tip Fehler sind normal
**Fürchten Sie sich nicht vor Fehlern!** AI App Factory verfügt über einen umfassenden Fehlerbehandlungsmechanismus:
- Jede Phase erlaubt eine automatische Wiederholung
- Fehlgeschlagene Ergebnisse werden automatisch in `artifacts/_failed/` archiviert
- Kann zum letzten erfolgreichen Checkpoint zurückrollen

Wenn Sie auf Fehler stoßen, analysieren Sie ruhig die Ursache und befolgen Sie die Fehlerbehandlungsstrategie.
:::

---

## Zusammenfassung dieser Lektion

Diese Lektion stellte die sechs Best Practices von AI App Factory vor:

1. **Klare Produktbeschreibung**: Detaillierte Beschreibung von Zielbenutzern, Kernproblemen, Schlüsselfunktionen und Einschränkungen
2. **Sorgfältige Checkpoint-Bestätigung**: Nach jeder Phase die Ausgabequalität prüfen, Fehlerakkumulation vermeiden
3. **Nicht-Ziele zur Umfangskontrolle nutzen**: Klare Auflistung von nicht getanen Funktionen, Scope Creep verhindern
4. **Schrittweise Iteration**: Zuerst Kernidee validieren, dann basierend auf Benutzerfeedback schrittweise erweitern
5. **Separate Sessions zum Tokensparen**: Bei jedem Checkpoint neue Session erstellen, Nutzungskosten senken
6. **Richtige Fehlerbehandlung**: Fehlerbehandlungsmechanismus nutzen, Fortschritt schnell wiederherstellen

Wenn Sie diese Best Practices befolgen, wird Ihre AI App Factory-Nutzungserfahrung reibungsloser verlaufen, die Qualität der generierten Anwendungen höher und die Entwicklungseffizienz vervielfacht.

---

## Vorschau auf nächste Lektion

> In der nächsten Lektion lernen wir **[CLI-Befehlsreferenz](../../appendix/cli-commands/)**.
>
> Sie werden lernen:
> - Alle Parameter und Optionen des factory init-Befehls
> - Wie der factory run-Befehl ab einer bestimmten Phase startet
> - Wie der factory continue-Befehl eine neue Session erstellt und fortfährt
> - Wie factory status und factory list Projektinformationen anzeigen
> - Wie factory reset den Projektstatus zurücksetzt

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Anzeigen der Quellcode-Position</strong></summary>

> Aktualisiert: 2026-01-29

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| Produktbeschreibung-Tipps | [`README.md`](https://github.com/hyz1992/agent-app-factory/blob/main/README.md#L186-L210) | 186-210 |
| Checkpoint-Mechanismus | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md#L98-L112) | 98-112 |
| Nicht-Ziel-Kontrolle | [`README.md`](https://github.com/hyz1992/agent-app-factory/blob/main/README.md#L199-L203) | 199-203 |
| Fehlerbehandlungsstrategie | [`policies/failure.policy.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/failure.policy.md#L267-L274) | 267-274 |
| Kontext-Isolation | [`policies/context-isolation.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/context-isolation.md#L10-L42) | 10-42 |
| Code-Standards | [`policies/code-standards.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/code-standards.md) | Volltext |

**Wichtige Konstanten**:
- `MAX_RETRY_COUNT = 1`: Jede Phase erlaubt standardmäßig eine automatische Wiederholung

**Wichtige Regeln**:
- Anzahl der Must-Have-Funktionen ≤ 7 (MVP-Prinzip)
- Seitenanzahl ≤ 3 (UI-Phase)
- Datenmodellanzahl ≤ 10 (Tech-Phase)
- Testabdeckung > 60% (Validation-Phase)

</details>

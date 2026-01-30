---
title: "Phase 2: PRD - Produktanforderungsdokument erstellen | Agent App Factory Tutorial"
sidebarTitle: "Produktanforderungsdokument erstellen"
subtitle: "Phase 2: PRD - Produktanforderungsdokument erstellen"
description: "Lernen Sie, wie die PRD-Phase strukturierte Produktideen in ein MVP-fähiges Produktanforderungsdokument umwandelt. Dieses Tutorial erklärt die Verantwortungsbereiche des PRD-Agenten, die Verwendung von skills/prd/skill.md, die Standardstruktur von prd.md und das MoSCoW-Priorisierungsframework. So können Sie schnell den MVP-Umfang und die Prioritäten festlegen und eigenständig testbare User Stories und Akzeptanzkriterien verfassen."
tags:
  - "Pipeline"
  - "PRD"
  - "Produktanforderung"
prerequisite:
  - "start-pipeline-overview"
  - "advanced-stage-bootstrap"
order: 90
---

# Phase 2: PRD - Produktanforderungsdokument erstellen

Die PRD-Phase ist die zweite Stufe der Agent App Factory Pipeline. Sie ist dafür verantwortlich, die `input/idea.md` in ein vollständiges, MVP-orientiertes Produktanforderungsdokument umzuwandeln. Diese Phase klärt die Zielgruppe, die Kernfunktionen, den MVP-Umfang und die Nicht-Ziele und bietet so eine klare Orientierung für die nachfolgende UI-Design- und Technikarchitektur.

## Was Sie nach dem Lernen können

- Die `input/idea.md` in ein `artifacts/prd/prd.md` gemäß Standardvorlage umwandeln
- Die Verantwortungsbereiche des PRD-Agenten verstehen (nur Anforderungen definieren, keine technische Umsetzung)
- Das MoSCoW-Funktionspriorisierungsframework beherrschen, um sicherzustellen, dass sich der MVP auf den Kernwert konzentriert
- Hochwertige User Stories und überprüfbare Akzeptanzkriterien verfassen können
- Wissen, welche Inhalte in die PRD gehören und welche in spätere Phasen

## Ihre aktuelle Schwierigkeit

Vielleicht haben Sie eine klare Produktidee (Bootstrap-Phase abgeschlossen), haben aber Schwierigkeiten, diese in ein Anforderungsdokument umzuwandeln:

- "Ich weiß nicht, welche Funktionen enthalten sein sollten, fürchte aber, etwas zu vergessen oder zu überzudesignen"
- "Es gibt viele Funktionen, aber ich weiß nicht, welche für den MVP notwendig sind"
- "Die User Stories sind unklar geschrieben, das Entwicklungsteam kann sie nicht verstehen"
- "Ich habe versehentlich technische Umsetzungsdetails in die Anforderungen gemischt, was zu Umfangsausweitung führt"

Eine unklare PRD führt dazu, dass nachfolgende UI-Design und Code-Entwicklung keine klare Orientierung haben, und die endgültig generierte Anwendung kann von Ihren Erwartungen abweichen oder unnötige Komplexität enthalten.

## Wann Sie diese Methode anwenden

Wenn die Bootstrap-Phase abgeschlossen ist und folgende Bedingungen erfüllt sind:

1. **idea.md-Strukturierung abgeschlossen** (Ausgabe der Bootstrap-Phase)
2. **UI-Design oder Technikarchitektur noch nicht begonnen** (diese folgen in späteren Phasen)
3. **MVP-Umfang klären wollen** (Funktionsüberdesign vermeiden)
4. **Klare Orientierung für Entwicklung und Design benötigen** (User Stories, Akzeptanzkriterien)

## 🎒 Vorbereitung vor dem Start

::: warning Voraussetzungen
Bevor Sie mit der PRD-Phase beginnen, stellen Sie sicher:

- ✅ [Projektinitialisierung](../../start/init-project/) abgeschlossen
- ✅ [7-Phasen-Pipeline-Überblick](../../start/pipeline-overview/) verstanden
- ✅ [Bootstrap-Phase](../stage-bootstrap/) abgeschlossen, `input/idea.md` generiert
- ✅ KI-Assistent installiert und konfiguriert (Claude Code empfohlen)
:::

## Kernkonzept

### Was ist die PRD-Phase?

**PRD** (Product Requirements Document, Produktanforderungsdokument) ist in dieser Phase dafür verantwortlich, **zu definieren, was getan werden soll, nicht wie es getan wird**.

::: info Kein Technikdokument
Der PRD-Agent ist kein Architekt oder UI-Designer, er wird nicht für Sie entscheiden:
- ❌ Welcher Technologie-Stack verwendet wird (React vs Vue, Express vs Koa)
- ❌ Wie die Datenbank entworfen wird (Tabellenstruktur, Indizes)
- ❌ UI-Layout und Interaktionsdetails (Button-Position, Farbschema)

Seine Aufgabe ist:
- ✅ Zielgruppe und ihre Schmerzpunkte definieren
- ✅ Kernfunktionen und Prioritäten auflisten
- ✅ MVP-Umfang und Nicht-Ziele klären
- ✅ Testbare User Stories und Akzeptanzkriterien bereitstellen
:::

### Warum PRD?

Stellen Sie sich vor, Sie sagen einer Baucrew: "Ich möchte ein Haus bauen"

- ❌ Ohne Bauplan: Die Crew kann nur raten und baut möglicherweise ein Haus, in dem Sie nie wohnen wollen
- ✅ Mit detailliertem Plan: Klare Anzahl der Zimmer, Funktionslayout, Materialanforderungen, die Crew baut nach Plan

Die PRD-Phase verwandelt "Ich möchte ein Haus bauen" in "Drei Zimmer, zwei Wohnzimmer, Hauptschlafzimmer nach Süden, offene Küche"-detaillierte Pläne.

### MoSCoW-Funktionspriorisierungsframework

Die PRD-Phase verwendet das **MoSCoW-Framework** zur Klassifizierung von Funktionen, um sicherzustellen, dass sich der MVP auf den Kernwert konzentriert:

| Kategorie | Definition | Bewertungskriterien | Beispiel |
|-----------|------------|---------------------|----------|
| **Must Have** | Funktionen, die der MVP absolut nicht entbehren kann | Ohne sie kann das Produkt keinen Kernwert liefern | Buchhaltungs-App: Ausgabeneintrag hinzufügen, Ausgabenliste anzeigen |
| **Should Have** | Wichtige, aber nicht blockierende Funktionen | Benutzer spüren deutlich, dass etwas fehlt, können aber vorübergehend Umwege nutzen | Buchhaltungs-App: Berichte exportieren, Kategorienstatistik |
| **Could Have** | Funktionen, die das Produkt verschönern | Beeinträchtigen nicht die Kernfunktionalität, Benutzer werden den Mangel nicht bemerken | Buchhaltungs-App: Budgeterinnerung, Mehrwährungsunterstützung |
| **Won't Have** | Klar ausgeschlossene Funktionen | Nicht im Zusammenhang mit dem Kernwert oder technisch zu komplex | Buchhaltungs-App: Social Sharing, Investitionsempfehlungen |

::: tip MVP-Kern
Must-Have-Funktionen sollten auf 5-7 begrenzt sein, um sicherzustellen, dass sich der MVP auf den Kernwert konzentriert und Umfangsausweitung vermeidet.
:::

## Schritt-für-Schritt-Anleitung

### Schritt 1: Bestätigen, dass Bootstrap-Phase abgeschlossen ist

Bevor Sie mit der PRD-Phase beginnen, stellen Sie sicher, dass `input/idea.md` existiert und dem Standard entspricht.

```bash
# Überprüfen, ob idea.md existiert
cat input/idea.md
```

**Sie sollten sehen**: Ein strukturiertes Dokument mit Abschnitten wie Kurzbeschreibung, Problem, Zielgruppe, Kernwert, Annahmen und Nicht-Ziele.

::: tip Wenn idea.md nicht dem Standard entspricht
Kehren Sie zur [Bootstrap-Phase](../stage-bootstrap/) zurück, um es neu zu generieren, oder bearbeiten Sie es manuell, um Informationen zu ergänzen.
:::

### Schritt 2: Pipeline zur PRD-Phase starten

Führen Sie im Factory-Projektverzeichnis aus:

```bash
# Wenn die Pipeline bereits läuft, zur PRD-Phase fortfahren
factory run prd

# Oder Pipeline von vorne starten
factory run
```

Die CLI zeigt den aktuellen Status und verfügbare Phasen an und generiert die Hilfsanweisungen für den PRD-Agenten.

### Schritt 3: KI-Assistent liest PRD-Agent-Definition

Der KI-Assistent (z.B. Claude Code) liest automatisch `agents/prd.agent.md`, um Aufgaben und Einschränkungen zu verstehen.

::: info PRD-Agent-Aufgaben
Der PRD-Agent kann nur:
- `input/idea.md` lesen
- In `artifacts/prd/prd.md` schreiben
- Denken-Rahmen und Entscheidungsprinzipien aus `skills/prd/skill.md` verwenden

Er kann nicht:
- Technische Umsetzungsdetails oder UI-Design diskutieren
- Andere Dateien lesen (einschließlich Upstream-Produkten)
- In andere Verzeichnisse schreiben
:::

### Schritt 4: skills/prd/skill.md laden

Der PRD-Agent lädt `skills/prd/skill.md`, um folgende Anleitungen zu erhalten:

**Denken-Rahmen**:
- Zielgruppe: Wer wird es nutzen? Hintergrund, Rolle, Schmerzpunkt?
- Kernproblem: Welches grundlegende Problem soll das Produkt lösen?
- Kernwert: Warum ist diese Lösung wertvoll? Welche Vorteile gegenüber Wettbewerbern?
- Erfolgskennzahlen: Wie messen wir Erfolg?

**MoSCoW-Funktionspriorisierung**:
- Must Have (Muss haben): Funktionen, die der MVP absolut nicht entbehren kann
- Should Have (Sollte haben): Wichtige, aber nicht blockierende Funktionen
- Could Have (Könnte haben): Funktionen, die das Produkt verschönern
- Won't Have (Wird nicht haben): Klar ausgeschlossene Funktionen

**User-Story-Schreibanleitung**:
```
Als [Rolle/Nutzertyp]
möchte ich [Funktion/Aktion]
damit [Geschäftswert/Ziel]
```

**PRD-Dokumentstrukturanforderungen** (8 Kapitel):
1. Übersicht
2. Zielgruppenprofil
3. Kernwertversprechen
4. Funktionsanforderungen (MoSCoW-Klassifizierung)
5. User Flow
6. Nicht-Ziele (Won't Have)
7. Erfolgskennzahlen
8. Annahmen und Risiken

### Schritt 5: PRD-Dokument generieren

Der KI-Assistent generiert das vollständige PRD-Dokument basierend auf dem Inhalt von `input/idea.md`, unter Verwendung des Denken-Rahmens und der Entscheidungsprinzipien aus den Skills.

**Was der PRD-Agent tut**:
1. Liest `input/idea.md` und destilliert Schlüsselelemente (Zielgruppe, Problem, Kernwert usw.)
2. Klassifiziert Funktionen nach dem MoSCoW-Framework
3. Schreibt User Stories und Akzeptanzkriterien für Must-Have-Funktionen
4. Listet Nicht-Ziele auf, um Umfangsausweitung zu verhindern
5. Gibt quantifizierbare Erfolgskennzahlen an
6. Schreibt das organisierte Dokument in `artifacts/prd/prd.md`

::: tip Wichtige Einschränkung
Der PRD-Agent verbietet die Diskussion technischer Umsetzungsdetails oder UI-Design. Wenn solche Inhalte gefunden werden, lehnt der PRD-Agent das Schreiben ab.
:::

### Schritt 6: prd.md-Inhalt bestätigen

Nach Abschluss des PRD-Agenten wird `artifacts/prd/prd.md` generiert. Sie müssen sorgfältig prüfen:

**Prüfpunkte ✅**:

1. **Ist die Zielgruppe** spezifisch?
   - ✅ Konkretes Profil (Alter/Beruf/Technikkompetenz/Nutzungsszenario/Schmerzpunkt)
   - ❌ Vage: "Alle" oder "Leute, die Buchhaltung brauchen"

2. **Ist das Kernproblem** klar?
   - ✅ Beschreibt die Schwierigkeit, die Benutzer in realen Szenarien erleben
   - ❌ Allgemein: "Benutzererfahrung ist nicht gut"

3. **Ist der Kernwert** quantifizierbar?
   - ✅ Konkrete Vorteile (80% Zeitersparnis, 50% Effizienzsteigerung)
   - ❌ Allgemein: "Effizienz steigern", "bessere Erfahrung"

4. **Sind die Must-Have-Funktionen** fokussiert?
   - ✅ Nicht mehr als 5-7 Kernfunktionen
   - ❌ Zu viele Funktionen oder Sekundärfunktionen enthalten

5. **Hat jede Must-Have-Funktion** eine User Story?
   - ✅ Verwendet Standardformat (Als...möchte ich...damit...)
   - ❌ Fehlende User Story oder falsches Format

6. **Sind die Akzeptanzkriterien** überprüfbar?
   - ✅ Konkrete überprüfbare Standards (Betrag kann eingegeben werden, wird in Liste angezeigt)
   - ❌ Vage ("benutzerfreundlich", "flüssige Erfahrung")

7. **Sind Should Have** und **Won't Have** klar aufgeführt?
   - ✅ Should Have als "zukünftige Iteration" markiert mit Begründung
   - ✅ Won't Have erklärt, warum ausgeschlossen
   - ❌ Fehlend oder zu wenige

8. **Sind die Erfolgskennzahlen** quantifizierbar?
   - ✅ Konkrete Zahlen (Benutzerbindung > 30%, Aufgabenabschlusszeit < 30 Sekunden)
   - ❌ Vage ("Benutzer mögen", "gute Erfahrung")

9. **Sind die Annahmen** überprüfbar?
   - ✅ Kann durch Benutzerforschung validiert werden
   - ❌ Subjektive Einschätzung ("Benutzer werden mögen")

10. **Enthält es technische Umsetzungsdetails oder UI-Design**?
    - ✅ Keine technischen Details und UI-Beschreibungen
    - ❌ Enthält Technologie-Stack-Auswahl, Datenbankdesign, UI-Layout usw.

### Schritt 7: Wählen Sie Fortfahren, Wiederholen oder Pausieren

Nach der Bestätigung zeigt die CLI Optionen an:

```bash
Bitte wählen Sie eine Aktion:
[1] Fortfahren (zur UI-Phase)
[2] Wiederholen (prd.md neu generieren)
[3] Pausieren (später fortsetzen)
```

::: tip Zuerst im Code-Editor ansehen empfohlen
Bestätigen Sie im KI-Assistenten erst, nachdem Sie `artifacts/prd/prd.md` im Code-Editor geöffnet und Zeile für Zeile überprüft haben. Sobald Sie in die UI-Phase wechseln, werden die Änderungskosten höher.
:::

## Fallstricke und Warnungen

### Fallstrick 1: Zu viele Must-Have-Funktionen

**Falsches Beispiel**:
```
Must Have:
1. Ausgabeneintrag hinzufügen
2. Ausgabenliste anzeigen
3. Berichte exportieren
4. Kategorienstatistik
5. Budgeterinnerung
6. Mehrwährungsunterstützung
7. Social Sharing
8. Investitionsempfehlungen
```

**Konsequenz**: Der MVP-Umfang ist zu groß, die Entwicklungsdauer lang, das Risiko hoch.

**Empfehlung**: Auf 5-7 Kernfunktionen begrenzen:
```
Must Have:
1. Ausgabeneintrag hinzufügen
2. Ausgabenliste anzeigen
3. Ausgabenkategorie auswählen

Should Have (zukünftige Iteration):
4. Berichte exportieren
5. Kategorienstatistik

Won't Have (klar ausgeschlossen):
6. Social Sharing (nicht im Zusammenhang mit dem Kernwert)
7. Investitionsempfehlungen (erfordert professionelle Qualifikation, hohe technische Komplexität)
```

### Fallstrick 2: Fehlende oder falsch formatierte User Stories

**Falsches Beispiel**:
```
Funktion: Ausgabeneintrag hinzufügen
Beschreibung: Benutzer können Ausgabeneinträge hinzufügen
```

**Konsequenz**: Das Entwicklungsteam versteht nicht, für wen und welches Problem gelöst werden soll.

**Empfehlung**: Standardformat verwenden:
```
Funktion: Ausgabeneintrag hinzufügen
User Story: Als budgetbewusster Benutzer
möchte ich jede Ausgabe aufzeichnen
damit ich weiß, wohin mein Geld fließt und mein Budget kontrollieren kann

Akzeptanzkriterien:
- Betrag und Beschreibung können eingegeben werden
- Ausgabenkategorie kann ausgewählt werden
- Eintrag wird sofort in der Ausgabenliste angezeigt
- Aktuelles Datum und Uhrzeit werden angezeigt
```

### Fallstrick 3: Nicht überprüfbare Akzeptanzkriterien

**Falsches Beispiel**:
```
Akzeptanzkriterien:
- Benutzeroberfläche ist freundlich
- Bedienung ist flüssig
- Erfahrung ist gut
```

**Konsequenz**: Nicht testbar, das Entwicklungsteam weiß nicht, was "freundlich", "flüssig", "gut" bedeutet.

**Empfehlung**: Konkrete, überprüfbare Standards schreiben:
```
Akzeptanzkriterien:
- Betrag und Beschreibung können eingegeben werden
- Aus 10 voreingestellten Kategorien kann ausgewählt werden
- Eintrag wird innerhalb von 1 Sekunde in der Ausgabenliste angezeigt
- Aktuelles Datum und Uhrzeit werden automatisch aufgezeichnet
```

### Fallstrick 4: Zu allgemeine Zielgruppenbeschreibung

**Falsches Beispiel**:
```
Zielgruppe: Alle, die Buchhaltung brauchen
```

**Konsequenz**: Nachfolgende UI-Design und Technikarchitektur können keine klare Richtung bestimmen.

**Empfehlung**: Klares Profil:
```
Hauptnutzergruppe:
- Rolle: Junge Erwachsene im Alter von 18-30 Jahren, die gerade angefangen haben zu arbeiten
- Alter: 18-30 Jahre
- Technikkompetenz: Mittel, vertraut mit Smartphone-Anwendungen
- Nutzungsszenario: Sofortige Aufzeichnung nach dem täglichen Konsum, Statistik am Monatsende ansehen
- Schmerzpunkt: Am Monatsende feststellen, dass das Budget überschritten wurde, aber nicht wissen, wohin das Geld geflossen ist, keine Budgetkontrolle
```

### Fallstrick 5: Fehlende oder zu wenige Nicht-Ziele

**Falsches Beispiel**:
```
Nicht-Ziele: Keine
```

**Konsequenz**: Nachfolgende PRD- und Code-Phasen können zu übermäßigem Design führen und die technische Komplexität erhöhen.

**Empfehlung**: Mindestens 3 Punkte auflisten:
```
Nicht-Ziele (Out of Scope):
- Social-Sharing-Funktion (MVP konzentriert sich auf persönliche Buchhaltung)
- Finanzberatung und Investmentanalyse (erfordert professionelle Qualifikation, über den Kernwert hinaus)
- Integration mit Finanzsystemen von Drittanbietern (hohe technische Komplexität, MVP nicht benötigt)
- Komplexe Datenanalyse und Berichte (Should Have, zukünftige Iteration)
```

### Fallstrick 6: Enthält technische Umsetzungsdetails

**Falsches Beispiel**:
```
Funktion: Ausgabeneintrag hinzufügen
Technische Umsetzung: Verwendung von React Hook Form zur Formularverwaltung, API-Endpunkt POST /api/expenses
```

**Konsequenz**: Der PRD-Agent lehnt diese Inhalte ab (nur Anforderungen definieren, keine technische Umsetzung).

**Empfehlung**: Nur sagen, was getan werden soll, nicht wie:
```
Funktion: Ausgabeneintrag hinzufügen
User Story: Als budgetbewusster Benutzer
möchte ich jede Ausgabe aufzeichnen
damit ich weiß, wohin mein Geld fließt und mein Budget kontrollieren kann

Akzeptanzkriterien:
- Betrag und Beschreibung können eingegeben werden
- Ausgabenkategorie kann ausgewählt werden
- Eintrag wird sofort in der Ausgabenliste angezeigt
- Aktuelles Datum und Uhrzeit werden angezeigt
```

### Fallstrick 7: Nicht quantifizierbare Erfolgskennzahlen

**Falsches Beispiel**:
```
Erfolgskennzahlen:
- Benutzer mögen unsere App
- Flüssige Erfahrung
- Hohe Benutzerbindung
```

**Konsequenz**: Es kann nicht gemessen werden, ob das Produkt erfolgreich ist.

**Empfehlung**: Quantifizierbare Kennzahlen schreiben:
```
Erfolgskennzahlen:
Produktziele:
- 100 aktive Benutzer im ersten Monat gewinnen
- Benutzer nutzen die App mindestens 3 Mal pro Woche
- Kernfunktionsnutzung (Ausgabeneintrag hinzufügen) > 80%

KPIs:
- Benutzerbindungsrate: 7-Tage-Retention > 30%, 30-Tage-Retention > 15%
- Kernfunktionsnutzung: Ausgabeneintrag hinzufügen > 80%
- Aufgabenabschlusszeit: Einen Ausgabeneintrag hinzufügen < 30 Sekunden

Validierungsmethode:
- Benutzerverhalten durch Backend-Protokolle aufzeichnen
- A/B-Tests verwenden, um Benutzerbindung zu validieren
- Zufriedenheit durch Benutzerfeedback-Umfragen sammeln
```

### Fallstrick 8: Nicht überprüfbare Annahmen

**Falsches Beispiel**:
```
Annahme: Benutzer werden unser Design mögen
```

**Konsequenz**: Kann nicht durch Benutzerforschung validiert werden, MVP könnte scheitern.

**Empfehlung: Überprüfbare Annahmen schreiben:
```
Annahmen:
Marktannahmen:
- Junge Erwachsene (18-30 Jahre) haben den Schmerzpunkt "nicht wissen, wohin das Geld geflossen ist"
- Bestehende Buchhaltungs-Apps sind zu komplex, junge Erwachsene brauchen einfachere Lösungen

Benutzerverhaltensannahmen:
- Benutzer sind bereit, nach jedem Konsum 2 Minuten für die Aufzeichnung zu investieren, wenn es bei der Budgetkontrolle hilft
- Benutzer bevorzugen minimalistische UI, keine komplexen Diagramme und Analysen benötigt

Technische Machbarkeitsannahmen:
- Mobile Apps können schnelle 3-Schritt-Buchhaltungsabläufe realisieren
- Offline-Speicher kann grundlegende Bedürfnisse erfüllen
```

## Lektionszusammenfassung

Der Kern der PRD-Phase ist **Anforderungen definieren, nicht umsetzen**:

1. **Eingabe**: Strukturierte `input/idea.md` (Ausgabe der Bootstrap-Phase)
2. **Prozess**: KI-Assistent verwendet Denken-Rahmen und MoSCoW-Priorisierungsframework aus `skills/prd/skill.md`
3. **Ausgabe**: Vollständiges `artifacts/prd/prd.md`-Dokument
4. **Validierung**: Überprüfung, ob Benutzer klar definiert sind, Werte quantifizierbar sind, Funktionen fokussiert sind, keine technischen Details enthalten sind

::: tip Kernprinzip
- ❌ Was nicht getan wird: Technische Umsetzung nicht diskutieren, kein UI-Layout designen, keine Datenbankstruktur entscheiden
- ✅ Was nur getan wird: Zielgruppe definieren, Kernfunktionen auflisten, MVP-Umfang klären, testbare User Stories bereitstellen
:::

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Phase 3: UI - Interface und Prototyping designen](../stage-ui/)**.
>
> Sie werden lernen:
> - Wie man UI-Struktur basierend auf PRD designt
> - Wie man ui-ux-pro-max-Skill verwendet, um ein Designsystem zu generieren
> - Wie man eine ansehbare HTML-Prototyp generiert
> - Ausgabedateien und Exit-Bedingungen der UI-Phase

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie, um Quellcode-Position anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-29

| Funktion | Dateipfad | Zeile |
| --- | --- | --- |
| PRD Agent Definition | [`agents/prd.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/prd.agent.md) | 1-33 |
| PRD Skill | [`skills/prd/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/prd/skill.md) | 1-325 |
| Pipeline-Definition (PRD-Phase) | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 20-33 |
| Scheduler-Definition | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 1-100+ |

**Wichtige Einschränkungen**:
- **Technische Umsetzungsdetails verboten**: prd.agent.md:23
- **UI-Design-Beschreibung verboten**: prd.agent.md:23
- **Muss Zielgruppe enthalten**: pipeline.yaml:29
- **Muss MVP-Umfang definieren**: pipeline.yaml:30
- **Muss Nicht-Ziele auflisten**: pipeline.yaml:31
- **Ausgabedatei muss in artifacts/prd/prd.md gespeichert werden**: prd.agent.md:13

**Exit-Bedingungen** (pipeline.yaml:28-32):
- PRD enthält Zielgruppe
- PRD definiert MVP-Umfang
- PRD listet Nicht-Ziele (Out of Scope) auf
- PRD enthält keine technischen Umsetzungsdetails

**Skill-Inhaltsrahmen**:
- **Denken-Rahmen**: Zielgruppe, Kernproblem, Kernwert, Erfolgskennzahlen
- **MoSCoW-Funktionspriorisierungsframework**: Must Have, Should Have, Could Have, Won't Have
- **User-Story-Schreibanleitung**: Standardformat und Beispiele
- **PRD-Dokumentstrukturanforderungen**: 8 erforderliche Kapitel
- **Entscheidungsprinzipien**: Benutzerzentriert, MVP-fokussiert, klare Nicht-Ziele, Testbarkeit
- **Qualitätsprüfliste**: Benutzer und Problem, Funktionsumfang, User Stories, Dokumentenvollständigkeit, Verbotsscheck
- **Nie tun (NEVER)**: 7 klar verbotene Verhaltensweisen

**Erforderliche PRD-Dokumentkapitel**:
1. Übersicht (Produktübersicht, Hintergrund und Ziele)
2. Zielgruppenprofil (Hauptnutzergruppe, sekundäre Nutzergruppe)
3. Kernwertversprechen (Gelöstes Problem, unsere Lösung, Differenzierungsvorteil)
4. Funktionsanforderungen (Must Have, Should Have, Could Have)
5. User Flow (Hauptflussbeschreibung)
6. Nicht-Ziele (Won't Have)
7. Erfolgskennzahlen (Produktziele, KPIs, Validierungsmethode)
8. Annahmen und Risiken (Marktannahmen, Benutzerverhaltensannahmen, technische Machbarkeitsannahmen, Risikotabelle)

</details>

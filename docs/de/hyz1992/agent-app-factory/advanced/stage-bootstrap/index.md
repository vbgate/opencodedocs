---
title: "Phase 1: Bootstrap - Produktidee strukturieren | Agent App Factory Tutorial"
sidebarTitle: "Produktidee strukturieren"
subtitle: "Phase 1: Bootstrap - Produktidee strukturieren"
description: "Lernen Sie, wie die Bootstrap-Phase eine vage Produktidee in ein klares, strukturiertes input/idea.md-Dokument überführt. Dieses Tutorial erklärt die Verantwortlichkeiten des Bootstrap Agent, die Verwendung der superpowers:brainstorm-Fähigkeit, die Standardstruktur von idea.md und die Qualitäts-Checkliste."
tags:
  - "Pipeline"
  - "Bootstrap"
  - "Produktidee"
prerequisite:
  - "start-pipeline-overview"
order: 80
---

# Phase 1: Bootstrap - Produktidee strukturieren

Bootstrap ist die erste Phase der Agent App Factory Pipeline. Sie ist dafür verantwortlich, Ihre vage Produktidee in ein klares `input/idea.md`-Dokument zu überführen. Dies ist der Ausgangspunkt für alle nachfolgenden Phasen wie PRD, UI und Tech und bestimmt die Richtung und Qualität des gesamten Projekts.

## Was Sie nach diesem Tutorial können

- Eine vage Produktidee in ein `input/idea.md`-Dokument im Standardformat überführen
- Die Verantwortlichkeitsgrenzen des Bootstrap Agent verstehen (nur Informationen sammeln, keine Anforderungen kreieren)
- Wissen, wie die `superpowers:brainstorm`-Fähigkeit genutzt wird, um Produktideen zu vertiefen
- Beurteilen können, welche Informationen in die Bootstrap-Phase gehören und welche nicht

## Ihre aktuelle Situation

Sie haben vielleicht eine Produktidee, aber sie ist schwammig formuliert:

- "Ich möchte eine Fitness-App machen" (zu allgemein)
- "Eine App wie Xiaohongshu machen" (keine Differenzierung genannt)
- "Nutzer brauchen ein besseres Aufgabenmanagement-Tool" (kein spezifisches Problem genannt)

Diese vagen Beschreibungen führen dazu, dass nachfolgende Phasen (PRD, UI, Tech) keine klaren Eingaben haben, und die entstandene App könnte völlig von Ihren Erwartungen abweichen.

## Wann Sie diesen Ansatz verwenden

Verwenden Sie diesen Ansatz, wenn Sie bereit sind, die Pipeline zu starten, und folgende Bedingungen erfüllt sind:

1. **Sie haben eine erste Produktidee** (auch wenn es nur ein Satz ist)
2. **Sie haben noch kein Anforderungsdokument geschrieben** (PRD kommt in späteren Phasen)
3. **Sie haben sich noch nicht für einen Tech-Stack oder UI-Stil entschieden** (das kommt in späteren Phasen)
4. **Sie wollen den Produktumfang kontrollieren und Over-Engineering vermeiden** (die Bootstrap-Phase klärt Nicht-Ziele)

## 🎒 Vorbereitung

::: warning Voraussetzungen
Bevor Sie die Bootstrap-Phase starten, stellen Sie sicher:

- ✅ Projektinitialisierung abgeschlossen ([Projekt initialisieren](../../start/init-project/))
- ✅ Überblick über die 7-Phasen-Pipeline verstanden ([Pipeline-Übersicht](../../start/pipeline-overview/))
- ✅ KI-Assistent installiert und konfiguriert (Claude Code empfohlen)
- ✅ Produktidee vorbereitet (auch wenn vage)
:::

## Kernkonzept

### Was ist die Bootstrap-Phase?

**Bootstrap** ist der Ausgangspunkt der gesamten Pipeline. Ihre einzige Aufgabe ist es, **fragmentierte Produktideen in strukturierte Dokumente zu überführen**.

::: info Kein Produktmanager
Der Bootstrap Agent ist kein Produktmanager. Er wird keine Anforderungen oder Funktionen für Sie kreieren. Seine Aufgabe ist:
- Sammeln der Informationen, die Sie bereits bereitgestellt haben
- Ordnen und Strukturieren dieser Informationen
- Präsentation nach Standardvorlage

Er wird nicht entscheiden "welche Funktionen es geben sollte", sondern nur Ihnen helfen, "was Sie wollen" klar auszudrücken.
:::

### Warum strukturieren?

Stellen Sie sich vor, Sie sagen dem Koch: "Ich möchte etwas Leckeres essen"

- ❌ Vage Beschreibung: Der Koch kann nur raten und macht vielleicht etwas, das Sie überhaupt nicht essen wollen
- ✅ Strukturierte Beschreibung: "Ich möchte ein scharfes, korianderfreies Sichuan-Gericht, das gut zum Reis passt"

Die Bootstrap-Phase verwandelt "Ich möchte etwas Leckeres essen" in "scharfes, korianderfreies Sichuan-Gericht".

### Ausgabedokument-Struktur

Die Bootstrap-Phase generiert `input/idea.md` mit folgenden Kapiteln:

| Kapitel | Inhalt | Beispiel |
|---------|--------|----------|
| **Kurzbeschreibung** | 1-2 Sätze zur Produktzusammenfassung | "Eine mobile Buchhaltungs-App, die jungen Menschen hilft, tägliche Ausgaben schnell zu erfassen" |
| **Problem** | Kernschmerzpunkt des Nutzers | "Junge Menschen merken am Monatsende, dass sie überzogen haben, aber wissen nicht, wohin das Geld ging" |
| **Zielnutzer** | Konkrete Personenbeschreibung | "18-30 Jahre alte Berufseinsteiger, mittlere Technikkenntnisse" |
| **Kernwert** | Warum wertvoll | "3-Sekunden-Buchhaltung, 80% Zeitersparnis gegenüber manueller Abfrage" |
| **Annahmen** | 2-4 überprüfbare Annahmen | "Nutzer sind bereit, 2 Minuten zu lernen, wenn sie das Budget kontrollieren können" |
| **Nicht-Ziele** | Klar definiert, was nicht gemacht wird | "Keine Budgetplanung und Finanzberatung" |

## Schritt-für-Schritt-Anleitung

### Schritt 1: Produktidee vorbereiten

Bevor Sie die Pipeline starten, denken Sie zuerst über Ihre Produktidee nach. Es kann eine vollständige Beschreibung oder nur eine einfache Idee sein.

**Beispiel**:
```
Ich möchte eine Fitness-App machen, die Fitness-Anfängern hilft, Training aufzuzeichnen, einschließlich Bewegungstyp, Dauer, Kalorien, und kann auch Wochenstatistiken anzeigen.
```

::: tip Ideen können grob sein
Selbst wenn es nur ein Satz ist, ist das kein Problem. Der Bootstrap Agent wird durch die superpowers:brainstorm-Fähigkeit helfen, die Informationen zu vervollständigen.
:::

### Schritt 2: Pipeline zur Bootstrap-Phase starten

Führen Sie im Factory-Projektverzeichnis aus:

```bash
# Pipeline starten (falls noch nicht gestartet)
factory run

# Oder direkt von bootstrap beginnen
factory run bootstrap
```

Die CLI zeigt den aktuellen Status und verfügbare Phasen an.

### Schritt 3: KI-Assistent liest Bootstrap Agent Definition

Der KI-Assistent (z.B. Claude Code) liest automatisch `agents/bootstrap.agent.md`, um Verantwortlichkeiten und Einschränkungen zu verstehen.

::: info Agent-Verantwortlichkeiten
Der Bootstrap Agent kann nur:
- Produktideen lesen, die Sie im Gespräch bereitgestellt haben
- In `input/idea.md` schreiben

Er kann nicht:
- Andere Dateien lesen
- In andere Verzeichnisse schreiben
- Neue Anforderungen kreieren
:::

### Schritt 4: Verpflichtende Verwendung der superpowers:brainstorm-Fähigkeit

Dies ist der Schlüsselschritt der Bootstrap-Phase. Der KI-Assistent **muss** zuerst die `superpowers:brainstorm`-Fähigkeit aufrufen, auch wenn die Informationen bereits vollständig erscheinen.

**Funktion der brainstorm-Fähigkeit**:
1. **Problemessenz vertiefen**: Durch strukturierte Fragen Blindstellen in Ihrer Beschreibung entdecken
2. **Zielnutzer-Profil klären**: Ihnen helfen, "an wen genau verkauft wird" zu verstehen
3. **Kernwert validieren**: Differenzierung durch Wettbewerbsvergleich finden
4. **Implizite Annahmen identifizieren**: Auflisten jener Annahmen, die Sie als gegeben betrachten, aber nicht validiert haben
5. **Produktumfang kontrollieren**: Grenzen durch Nicht-Ziele klären

**Was der KI-Assistent tun wird**:
- Die `superpowers:brainstorm`-Fähigkeit aufrufen
- Ihre ursprüngliche Idee bereitstellen
- Durch vom Skill generierte Fragen Sie befragen
- Ihre Antworten sammeln und die Idee verfeinern

::: danger Überspringen dieses Schritts wird abgelehnt
Der Sisyphus-Scheduler überprüft, ob die brainstorm-Fähigkeit verwendet wurde. Falls nicht, werden die vom Bootstrap Agent generierten Artefakte abgelehnt und müssen neu ausgeführt werden.
:::

### Schritt 5: Inhalt von idea.md bestätigen

Nach Abschluss des Bootstrap Agent wird `input/idea.md` generiert. Sie müssen es sorgfältig überprüfen:

**Checkpunkte ✅**:

1. Ist die **Kurzbeschreibung** klar?
   - ✅ Enthält: Was + Für wen + Welches Problem lösen
   - ❌ Zu allgemein: "Ein Tool zur Effizienzsteigerung"

2. Ist die **Problembeschreibung** konkret?
   - ✅ Enthält: Szenario + Schwierigkeit + Negatives Ergebnis
   - ❌ Leer: "Schlechte Benutzererfahrung"

3. Ist der **Zielnutzer** klar definiert?
   - ✅ Konkretes Profil (Alter/Beruf/Technikkenntnisse)
   - ❌ Unklar: "Alle"

4. Ist der **Kernwert** quantifizierbar?
   - ✅ Konkreter Nutzen (80% Zeitersparnis)
   - ❌ Leer: "Effizienzsteigern"

5. Sind die **Annahmen** überprüfbar?
   - ✅ Durch Nutzerforschung validierbar
   - ❌ Subjektiv: "Nutzer werden es mögen"

6. Sind die **Nicht-Ziele** ausreichend?
   - ✅ Mindestens 3 Funktionen aufgelistet, die nicht gemacht werden
   - ❌ Fehlend oder zu wenig

### Schritt 6: Wahl zwischen Fortfahren, Wiederholen oder Pausieren

Nach Bestätigung zeigt die CLI Optionen an:

```bash
Bitte wählen Sie eine Aktion:
[1] Fortfahren (in PRD-Phase)
[2] Wiederholen (idea.md neu generieren)
[3] Pausieren (später fortsetzen)
```

::: Tipp Vorab im Code-Editor ansehen
Bestätigen Sie im KI-Assistenten erst, nachdem Sie `input/idea.md` im Code-Editor geöffnet und Wort für Wort überprüft haben. Sobald Sie in die PRD-Phase eintreten, steigen die Änderungskosten.
:::

## Warnung vor Fehlern

### Fehler 1: Ideenbeschreibung zu unklar

**Falsches Beispiel**:
```
Ich möchte eine Fitness-App machen
```

**Konsequenz**: Der Bootstrap Agent wird durch die brainstorm-Fähigkeit viele Fragen stellen und Informationen ergänzen.

**Empfehlung**: Beschreiben Sie von Anfang an klar:
```
Ich möchte eine mobile Fitness-App machen, die Fitness-Anfängern hilft, Training aufzuzeichnen, einschließlich Bewegungstyp, Dauer, Kalorien, und kann auch Wochenstatistiken anzeigen.
```

### Fehler 2: Enthält technische Implementierungsdetails

**Falsches Beispiel**:
```
Ich möchte React Native verwenden, Backend mit Express, Datenbank ist Prisma...
```

**Konsequenz**: Der Bootstrap Agent wird diese Inhalte ablehnen (er sammelt nur Produktideen, der Tech-Stack wird in der Tech-Phase festgelegt).

**Empfehlung**: Sagen Sie nur "was" gemacht werden soll, nicht "wie" es gemacht wird.

### Fehler 3: Zielnutzerbeschreibung zu allgemein

**Falsches Beispiel**:
```
Alle, die Fitness brauchen
```

**Konsequenz**: Nachfolgende Phasen können keine klare Designrichtung festlegen.

**Empfehlung**: Klares Profil definieren:
```
18-30 Jahre alte Fitness-Anfänger, die gerade mit systematischem Training beginnen, mittlere Technikkenntnisse, möchten einfach aufzeichnen und Statistiken ansehen.
```

### Fehler 4: Nicht-Ziele fehlen oder zu wenig

**Falsches Beispiel**:
```
Nicht-Ziele: keine
```

**Konsequenz**: Nachfolgende PRD- und Code-Phasen könnten übermäßig entwerfen und die technische Komplexität erhöhen.

**Empfehlung**: Mindestens 3 Punkte auflisten:
```
Nicht-Ziele:
- Team-Kollaboration und soziale Funktionen (MVP fokussiert auf Individuen)
- Komplexe Datenanalyse und Berichte
- Integration mit Drittanbieter-Fitnessgeräten
```

### Fehler 5: Annahmen nicht überprüfbar

**Falsches Beispiel**:
```
Annahme: Nutzer werden unser Design mögen
```

**Konsequenz**: Nicht durch Nutzerforschung validierbar, MVP könnte scheitern.

**Empfehlung**: Überprüfbare Annahmen schreiben:
```
Annahme: Nutzer sind bereit, 5 Minuten zu lernen, wenn es hilft, Training systematisch aufzuzeichnen.
```

## Zusammenfassung dieser Lektion

Der Kern der Bootstrap-Phase ist **Strukturierung**:

1. **Eingabe**: Ihre vage Produktidee
2. **Prozess**: KI-Assistent vertieft durch superpowers:brainstorm-Fähigkeit
3. **Ausgabe**: `input/idea.md` im Standardformat
4. **Validierung**: Prüfung, ob Beschreibung konkret, Nutzer klar, Wert quantifizierbar

::: tip Kernprinzipien
- ❌ Nicht tun: Keine Anforderungen kreieren, keine Funktionen entwerfen, keinen Tech-Stack festlegen
- ✅ Nur tun: Informationen sammeln, strukturieren, nach Vorlage präsentieren
:::

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Phase 2: PRD - Produktspezifikationsdokument generieren](../stage-prd/)**.
>
> Sie lernen:
> - Wie idea.md in ein MVP-PRD überführt wird
> - Was das PRD enthält (User Stories, Feature-Liste, Nicht-funktionale Anforderungen)
> - Wie MVP-Umfang und Priorität klar definiert werden
> - Warum das PRD keine technischen Details enthalten darf

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Anzeigen der Quellcode-Position</strong></summary>

> Aktualisiert: 2026-01-29

| Funktion | Dateipfad | Zeile |
| --- | --- | --- |
| Bootstrap Agent Definition | [`agents/bootstrap.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/bootstrap.agent.md) | 1-93 |
| Bootstrap Skill | [`skills/bootstrap/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/bootstrap/skill.md) | 1-433 |
| Pipeline-Definition (Bootstrap-Phase) | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 8-18 |
| Scheduler-Definition | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 1-100+ |

**Wichtige Einschränkungen**:
- **Verpflichtende Verwendung der brainstorm-Fähigkeit**: bootstrap.agent.md:70-71
- **Technische Details verboten**: bootstrap.agent.md:47
- **Zusammenführen mehrerer Ideen verboten**: bootstrap.agent.md:48
- **Ausgabedatei muss in input/idea.md gespeichert werden**: bootstrap.agent.md:50

**Exit-Bedingungen** (pipeline.yaml:15-18):
- idea.md existiert
- idea.md beschreibt eine kohärente Produktidee
- Agent hat `superpowers:brainstorm`-Fähigkeit zur Vertiefung verwendet

**Skill-Inhaltsrahmen**:
- **Denkrahmen**: Extrahieren vs. Kreieren, Problem-First, Konkretisierung, Hypothesenvalidierung
- **Fragevorlagen**: Über Problem, Zielnutzer, Kernwert, MVP-Annahmen, Nicht-Ziele
- **Informationsextraktionstechniken**: Problem aus Funktion rückwärts ableiten, Bedürfnis aus Beschwerde extrahieren, implizite Annahmen identifizieren
- **Qualitäts-Checkliste**: Vollständigkeit, Konkretheit, Konsistenz, Verbotene Elemente
- **Entscheidungsprinzipien**: Fragen priorisieren, problemorientiert, konkret über abstrakt, überprüfbar, Umfangskontrolle
- **Häufige Szenarien**: Nutzer gibt nur einen Satz, beschreibt viele Funktionen, beschreibt Wettbewerber, widersprüchliche Ideen
- **Beispielvergleiche**: Schlechte idea.md vs. gute idea.md

</details>

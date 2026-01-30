---
title: "Prometheus-Planung: Interview-basierte Anforderungserhebung | oh-my-opencode"
sidebarTitle: "Hochwertige Arbeitspläne generieren"
subtitle: "Prometheus-Planung: Interview-basierte Anforderungserhebung"
description: "Lernen Sie das Prometheus-Planungssystem mit strukturierter Anforderungserhebung, Metis-Beratung und Momus-Validierung kennen, um hochwertige Arbeitspläne zu erstellen und eine perfekte Trennung von Planung und Ausführung zu erreichen."
tags:
  - "planning"
  - "prometheus"
  - "interview"
prerequisite:
  - "start-sisyphus-orchestrator"
  - "advanced-ai-agents-overview"
order: 70
---

# Prometheus-Planung: Interview-basierte Anforderungserhebung und Arbeitsplan-Generierung

## Was Sie lernen werden

- Eine Prometheus-Planungssitzung starten und Anforderungen im Interview-Modus klären
- Das Kernprinzip von Prometheus verstehen: "Nur planen, nicht implementieren"
- Mit Metis und Momus hochwertige, lückenlose Arbeitspläne erstellen
- Den Befehl `/start-work` verwenden, um Pläne zur Ausführung an Atlas zu übergeben

## Ihr aktuelles Dilemma

Stellen Sie sich vor, Sie geben der KI einen komplexen Auftrag: "Helfen Sie mir, das Authentifizierungssystem umzubauen."

**5 Minuten später** fängt die KI an, Code zu schreiben. Sie sind glücklich und denken, Sie sparen Zeit.

**30 Minuten später** stellen Sie fest:
- Die KI hat Sie nicht gefragt, welche Authentifizierungsbibliothek Sie verwenden möchten (JWT? NextAuth? Session?)
- Die KI hat viele Annahmen getroffen (zum Beispiel "muss OAuth unterstützen", obwohl Sie das gar nicht brauchen)
- Der Code ist halb geschrieben, die Richtung ist falsch, alles muss von vorne gemacht werden
- Beim Testen stellen Sie fest, dass die Kernlogik nicht mit dem bestehenden System kompatibel ist

Dies ist ein typisches Problem der "gemischten Planung und Ausführung": Die KI beginnt zu arbeiten, bevor die Anforderungen klar sind, was zu viel Nacharbeit führt.

## Wann Prometheus verwenden

::: tip Einsatzzeitpunkt
**Szenarien, die für Prometheus geeignet sind**:
- Komplexe Funktionsentwicklung (z.B. "Benutzerauthentifizierungssystem hinzufügen")
- Großangelegte Refaktorisierung (z.B. "Die gesamte Datenzugriffsschicht umstrukturieren")
- Architekturdesign (z.B. "Microservices-Architektur entwerfen")
- Aufgaben, die strenge Qualitätssicherung erfordern

**Szenarien, in denen Sisyphus direkt ausgeführt werden sollte**:
- Einfache Bug-Fixes (z.B. "Rechtschreibfehler im Login-Button korrigieren")
- Klare kleine Funktionen (z.B. "Formular mit 3 Eingabefeldern hinzufügen")
:::

## Vorbereitung vor dem Start

Stellen Sie sicher, dass folgende Konfigurationen abgeschlossen sind:

- [ ] Der Prometheus-Agent ist aktiviert (standardmäßig aktiviert)
- [ ] Mindestens ein KI-Anbieter ist konfiguriert (Anthropic, OpenAI usw.)
- [ ] Grundlegendes Agent-Konzept ist verstanden (Abschluss von "[KI-Agent-Team: Vorstellung von 10 Experten](../ai-agents-overview/)" )

**Überprüfung der Prometheus-Verfügbarkeit**:

```bash
# Im OpenCode-Chat eingeben
@prometheus

# Sollte Prometheus zeigen:
# "Hallo, ich bin Prometheus - Strategischer Planungsberater...."
```

## Kerngedanke

### Kernidentitätsbeschränkung von Prometheus

Was ist das wichtigste Merkmal von Prometheus? **Es schreibt niemals Code**.

| Funktion | Prometheus | Sisyphus | Atlas |
|---|---|---|---|
| Anforderungserhebung | ✅ | ❌ | ❌ |
| Arbeitsplan-Generierung | ✅ | ❌ | ❌ |
| Code-Implementierung | ❌ | ✅ | ✅ (Delegierung) |
| Aufgabenausführung | ❌ | ✅ | ✅ (Delegierung) |

**Warum ist das wichtig?**

- **Planer ≠ Ausführender**: Wie ein Produktmanager keinen Code schreibt, ist Prometheus' Aufgabe das "Wie", nicht das "Tun"
- **Annahmen verhindern**: Wenn Prometheus direkt Code schreiben könnte, würde es möglicherweise "ratend" arbeiten, wenn die Anforderungen unklar sind
- **Erzwingen des Nachdenkens**: Nachdem es verboten wurde, Code zu schreiben, muss Prometheus alle Details klarstellen

### Dreiphasen-Workflow

```mermaid
flowchart LR
    A[Benutzereingabe Anforderung] --> B[Phase 1: Interview-Modus]
    B -->|Anforderung klar?| C[Phase 2: Plan-Generierung]
    C --> D[Metis-Beratung]
    D -->|Hohe Präzision erforderlich?| E[Momus-Loop-Validierung]
    E -->|Plan vervollständigt| F[Generieren .sisyphus/plans/*.md]
    C -->|Hohe Präzision nicht erforderlich| F
    F --> G[/start-work Ausführung]
```

**Zuständigkeiten in jeder Phase**:

- **Phase 1 - Interview-Modus**: Anforderungen sammeln, Codebasis erforschen, Entwurf fortlaufend aktualisieren
- **Phase 2 - Plan-Generierung**: Metis konsultieren, vollständigen Plan erstellen, Zusammenfassung präsentieren
- **Phase 3 - Ausführung**: Durch `/start-work` an Atlas zur Ausführung übergeben

## Schritt-für-Schritt-Anleitung

### Schritt 1: Prometheus-Planungssitzung starten

**Warum**
Prometheus durch Schlüsselwort oder Befehl auslösen, in den Interview-Modus wechseln.

**Aktion**

Im OpenCode-Chat eingeben:

```
@prometheus Hilf mir bei der Planung eines Benutzerauthentifizierungssystems
```

**Sie sollten sehen**:
- Prometheus bestätigt den Eintritt in den Interview-Modus
- Stellt die erste Frage (z.B. "Was ist der Technologie-Stack Ihrer Anwendung?")
- Erstellt die Entwurfsdatei `.sisyphus/drafts/user-auth.md`

::: info Wichtige Funktion: Entwurfsdatei
Prometheus aktualisiert fortlaufend Dateien unter `.sisyphus/drafts/`. Dies ist sein "externes Gedächtnis":
- Zeichnet Entscheidungen jeder Diskussion auf
- Speichert erforschte Code-Muster
- Markiert klare Grenzen (IN/OUT)

Sie können den Entwurf jederzeit überprüfen, um zu verifizieren, ob Prometheus Ihre Anforderungen richtig verstanden hat.
:::

### Schritt 2: Fragen beantworten, Prometheus lässt Kontext sammeln

**Warum**
Prometheus muss Ihr Projekt "verstehen", um einen ausführbaren Plan zu erstellen. Es rät nicht, sondern erhält Belege durch die Erforschung der Codebasis und Studium bewährter Praktiken.

**Aktion**

Beantworten Sie die Fragen von Prometheus, zum Beispiel:

```
Benutzereingabe:
Meine Anwendung ist Next.js 14, App Router, derzeit keine Authentifizierung.
Ich möchte E-Mail-Passwort-Login und GitHub OAuth unterstützen.
```

**Was Prometheus tun wird**:

- Verwendet den `explore`-Agent zur Analyse der bestehenden Code-Struktur
- Verwendet den `librarian`-Agent zum Suchen von Best Practices für Authentifizierung
- Aktualisiert die "Requirements"- und "Technical Decisions"-Abschnitte in der Entwurfsdatei

**Sie sollten sehen**:

```
Ich habe den Explore-Agent gestartet, um die Projektstruktur zu analysieren...

1. explore: Suche nach bestehenden Sitzungsmustern
2. librarian: Suche nach NextAuth Best Practices

Ich werde fortfahren, sobald die Ergebnisse zurückkommen.
```

### Schritt 3: Entwurfsdatei anzeigen (optional)

**Warum**
Der Entwurf ist das "externe Gedächtnis" von Prometheus, Sie können jederzeit verifizieren, ob das Verständnis korrekt ist.

**Aktion**

```bash
# Entwurfsinhalt im Terminal anzeigen
cat .sisyphus/drafts/user-auth.md
```

**Sie sollten ähnlichen Inhalt sehen**:

```markdown
# Draft: user-auth

## Requirements (confirmed)
- Technologie-Stack: Next.js 14, App Router
- Authentifizierungsmethoden: E-Mail-Passwort + GitHub OAuth
- Aktueller Status: Keine Authentifizierungsimplementierung

## Technical Decisions
- Keine Entscheidungen

## Research Findings
- Explore-Agent wird ausgeführt...
```

### Schritt 4: Weiter antworten, bis die Anforderungen klar sind

**Warum**
Prometheus hat eine "Clearance Checklist", die nur dann automatisch zur Plan-Generierung übergeht, wenn alle Kästchen angekreuzt sind.

**Bewertungskriterien von Prometheus**:

```
CLEARANCE CHECKLIST (ALLE müssen YES sein für Auto-Transition):
□ Sind die Kernziele klar?
□ Sind die Bereichsgrenzen klar (IN/OUT)?
□ Gibt es keine offenen kritischen Mehrdeutigkeiten?
□ Ist das technische Konzept festgelegt?
□ Ist die Teststrategie bestätigt (TDD/manuell)?
□ Gibt es keine blockierenden Probleme?
```

**Aktion**

Beantworten Sie weiterhin die Fragen von Prometheus, bis es sagt:

```
Alle Anforderungen sind klar. Berate Metis und generiere Plan...
```

**Sie sollten sehen**:
- Prometheus ruft den Metis-Agent auf
- Metis analysiert möglicherweise übersehene Probleme
- Prometheus passt sein Verständnis basierend auf dem Metis-Feedback an

### Schritt 5: Generierten Plan anzeigen

**Warum**
Die Plandatei ist die endgültige Ausgabe von Prometheus, enthält alle Aufgaben, Abhängigkeiten und Akzeptanzkriterien.

**Aktion**

```bash
# Generierten Plan anzeigen
cat .sisyphus/plans/user-auth.md
```

**Sie sollten die vollständige Struktur sehen**:

```markdown
# User Authentication System

## Context
[Originale Anforderungsbeschreibung]
[Interview-Zusammenfassung]
[Metis-Analyseergebnis]

## Work Objectives
- Kernziel: Implementiere E-Mail-Passwort-Login und GitHub OAuth
- Konkrete Lieferung: Login-Seite, API-Endpunkte, Sitzungsverwaltung
- Fertigstellungsdefinition: Benutzer können sich anmelden und auf geschützte Routen zugreifen

## Verification Strategy
- Infrastruktur vorhanden: YES
- Benutzer möchte Tests: TDD
- Framework: vitest

## TODOs
- [ ] 1. Installiere NextAuth.js und konfiguriere
  - References:
    - https://next-auth.js.org/getting-started/installation
  - Acceptance Criteria:
    - [ ] npm run test → PASS (1 test)

- [ ] 2. Erstelle API-Route [...nextauth]/route.ts
  - References:
    - src/lib/session.ts:10-45 - Bestehendes Sitzungsmuster
  - Acceptance Criteria:
    - [ ] curl http://localhost:3000/api/auth/... → 200

- [ ] 3. Implementiere Login-Seiten-UI
  - References:
    - src/app/login/page.tsx - Bestehende Login-Seitenstruktur
  - Acceptance Criteria:
    - [ ] Playwright-Validierung: Login-Formular sichtbar
    - [ ] Screenshot speichern in .sisyphus/evidence/

...
```

### Schritt 6: Ausführungsmethode auswählen

**Warum**
Prometheus gibt Ihnen zwei Optionen: Schnellstart oder Prüfung mit hoher Präzision.

**Präsentation von Prometheus** (mit Question-Tool):

```
## Plan Generated: user-auth

**Wichtige Entscheidungen:**
- Verwendung von NextAuth.js (gute Integration mit Next.js App Router)
- GitHub OAuth Provider + E-Mail-Passwort

**Scope:**
- IN: Login-Funktionalität, Sitzungsverwaltung, Routenschutz
- OUT: Registrierungsfunktionalität, Passwort-Reset, Benutzerprofil-Bearbeitung

**Angewendete Guardrails:**
- Muss bestehendem Sitzungsmuster folgen
- Ändert keine Kern-Geschäftslogik

Plan gespeichert in: `.sisyphus/plans/user-auth.md`

---

**Nächster Schritt**

Wie fortfahren?

1. **Start Work**: Führe /start-work aus. Der Plan sieht robust aus.
2. **High Accuracy Review**: Lasse Momus jedes Detail streng validieren. Erhöht den Prüfzyklus, garantiert aber Präzision.
```

**Aktion**

Wählen Sie eine Option (klicken Sie in OpenCode auf die Schaltfläche oder geben Sie die Option ein).

**Wenn Sie "Start Work" wählen**:

- Prometheus löscht die Entwurfsdatei
- Fordert Sie auf, `/start-work` auszuführen

**Wenn Sie "High Accuracy Review" wählen**:

- Prometheus betritt die Momus-Schleife
- Repariert kontinuierlich Feedback, bis Momus "OKAY" sagt
- Fordert Sie dann auf, `/start-work` auszuführen

### Schritt 7: Plan ausführen

**Warum**
Der Plan ist die Ausgabe von Prometheus, die Ausführung ist die Aufgabe von Atlas.

**Aktion**

```bash
# In OpenCode eingeben
/start-work
```

**Sie sollten sehen**:
- Atlas liest `.sisyphus/plans/user-auth.md`
- Erstellt `boulder.json` Statusdatei
- Führt jedes TODO in Reihenfolge aus
- Delegiert Aufgaben an spezialisierte Agenten (z.B. UI-Arbeit an Frontend)

**Checkpoint ✅**

- `boulder.json` Datei wurde erstellt
- Atlas beginnt mit der Ausführung von Aufgabe 1
- Nach Abschluss jeder Aufgabe wird der Status aktualisiert

## Fallstricke

### Fallstrick 1: Anforderungen zur Hälfte sagen und dann eilig einen Plan wollen

**Problem**:
```
Benutzer: @prometheus mache eine Benutzerauthentifizierung
Benutzer: Frag nicht so viel, generiere einfach den Plan
```

**Konsequenz**: Der Plan ist voller Annahmen, während der Ausführung müssen Änderungen vorgenommen werden.

**Richtige Vorgehensweise**:
```
Benutzer: @prometheus mache eine Benutzerauthentifizierung
Prometheus: Was ist der Technologie-Stack Ihrer Anwendung? Gibt es derzeit eine Authentifizierung?
Benutzer: Next.js 14, App Router, keine Authentifizierung
Prometheus: Welche Anmeldemethoden sollen unterstützt werden?
Benutzer: E-Mail-Passwort + GitHub OAuth
...
(Fortlaufende Antworten, bis Prometheus automatisch übergeht)
```

::: tip Merken Sie sich dieses Prinzip
**Planungszeit ≠ Zeitverschwendung**
- 5 Minuten für klare Anforderungen können 2 Stunden Nacharbeit sparen
- Der Interview-Modus von Prometheus spart zukünftigem Ihnen "Geld"
:::

### Fallstrick 2: Entwurfsdateien nicht ansehen

**Problem**: Prometheus hat viele Entscheidungen und Grenzen in den Entwurf aufgezeichnet, Sie sehen sie sich nicht an und lassen es direkt einen Plan generieren.

**Konsequenz**:
- Der Plan enthält falsches Verständnis
- Während der Ausführung stellen Sie fest: "Habe ich das gesagt?"

**Richtige Vorgehensweise**:
```
1. Nach dem Start der Planung die Dateien unter .sisyphus/drafts/ im Blick behalten
2. Bei Missverständnissen sofort korrigieren: "Nein, ich will nicht OAuth, sondern einfaches JWT"
3. Nach der Korrektur fortfahren
```

### Fallstrick 3: Plan mehrmals generieren

**Problem**:
```
Benutzer: Dieses Projekt ist zu groß, planen wir zuerst Phase 1
```

**Konsequenz**:
- Kontextbruch zwischen Phase 1 und Phase 2
- Inkonsistente Architekturentscheidungen
- Anforderungen gehen in mehreren Sitzungen verloren

**Richtige Vorgehensweise**:
```
✅ Einzelplan-Prinzip: Egal wie groß, alle TODOs in einer .md-Datei unter .sisyphus/plans/{name}.md
```

**Warum?**
- Prometheus und Atlas können große Pläne verarbeiten
- Einzelplan garantiert Architekturkonsistenz
- Vermeidet Kontextfragmentierung

### Fallstrick 4: Die Rolle von Metis vergessen

**Problem**:
```
Benutzer: Anforderungen gesagt, schnell einen Plan generieren
Prometheus: (Generiert direkt, überspringt Metis)
```

**Konsequenz**:
- Möglicherweise wichtige Grenzen im Plan übersehen
- Keine "Must NOT Have" zur klaren Abgrenzung des Bereichs
- AI slop (Überengineering) während der Ausführung

**Richtige Vorgehensweise**:
```
✅ Metis-Beratung ist obligatorisch, Sie müssen nicht drängen
```

**Was wird Metis tun?**
- Identifiziert Fragen, die Prometheus stellen sollte, aber nicht gestellt hat
- Schlägt Grenzen vor, die geklärt werden müssen
- Verhindert KI-Überengineering

### Fallstrick 5: Teststrategie-Entscheidung ignorieren

**Problem**: Prometheus fragt "Brauchen Sie Tests?", Sie sagen "Egal" oder überspringen.

**Konsequenz**:
- Wenn Testinfrastruktur vorhanden ist, aber TDD nicht genutzt wird, verpasste Gelegenheit
- Wenn keine Tests vorhanden sind und keine detaillierten manuellen Validierungsschritte, hohe Ausfallrate während der Ausführung

**Richtige Vorgehensweise**:
```
Prometheus: Ich sehe, dass Sie das vitest-Test-Framework haben. Soll die Arbeit Tests enthalten?
Benutzer: YES (TDD)
```

**Auswirkung**:
- Prometheus strukturiert jede Aufgabe als: RED → GREEN → REFACTOR
- Die Acceptance Criteria der TODO enthalten explizit Testbefehle
- Atlas arbeitet während der Ausführung nach dem TDD-Prozess

## Zusammenfassung dieser Lektion

**Kernwert von Prometheus**:
- **Trennung von Planung und Ausführung**: Durch die Zwangsbedingung "keinen Code schreiben" werden Anforderungen klar gestellt
- **Interview-Modus**: Kontinuierliches Fragen, Erforschung der Codebasis, Aktualisierung des Entwurfs
- **Qualitätssicherung**: Metis-Beratung, Momus-Validierung, Einzelplan-Prinzip

**Typischer Workflow**:
1. `@prometheus [Anforderung]` eingeben, um Planung zu starten
2. Fragen beantworten, `.sisyphus/drafts/` Entwurf ansehen
3. Warten, bis Prometheus automatisch übergeht (Clearance Checklist alle angekreuzt)
4. Generierte `.sisyphus/plans/{name}.md` ansehen
5. "Start Work" oder "High Accuracy Review" wählen
6. `/start-work` ausführen, an Atlas zur Ausführung übergeben

**Best Practices**:
- Zeit nehmen, um Anforderungen zu verstehen, nicht eilig einen Plan verlangen
- Entwurfsdateien fortlaufend ansehen, Missverständnisse zeitnah korrigieren
- Einzelplan-Prinzip befolgen, große Aufgaben nicht aufteilen
- Teststrategie klären, beeinflusst die gesamte Planstruktur

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Hintergrund-Parallelaufgaben: Arbeiten wie ein Team](../background-tasks/)**.
>
> Sie werden lernen:
> - Wie mehrere Agenten parallel arbeiten, um die Effizienz erheblich zu steigern
> - Konfiguration von Parallelitätsgrenzen, um API-Rate-Limits zu vermeiden
> - Verwaltung von Hintergrundaufgaben, Abrufen von Ergebnissen und Stornieren von Operationen
> - Koordination mehrerer Experten-Agenten wie ein "echtes Team"

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-26

| Funktion | Dateipfad | Zeilennummer |
|---|---|---|
| Prometheus System Prompt | [`src/agents/prometheus-prompt.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/prometheus-prompt.ts) | 19-1184 |
| Prometheus Berechtigungskonfiguration | [`src/agents/prometheus-prompt.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/prometheus-prompt.ts) | 1187-1197 |
| Metis Agent | [`src/agents/metis.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/metis.ts) | - |
| Momus Agent | [`src/agents/momus.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/momus.ts) | - |
| Orchestrierungsleitfaden Dokumentation | [`docs/orchestration-guide.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/orchestration-guide.md) | 67-90 |

**Kernkonstanten**:
- `PROMETHEUS_SYSTEM_PROMPT`: Vollständiger System-Prompt, definiert die Identität, den Workflow und die Einschränkungen von Prometheus

**Wichtige Funktionen/Tools**:
- `PROMETHEUS_PERMISSION`: Definiert die Tool-Berechtigungen von Prometheus (nur Bearbeitung von .md-Dateien erlaubt)

**Geschäftsregeln**:
- Prometheus Standardmodus: INTERVIEW MODE (Interview-Modus)
- Auto-Transition-Bedingung: Clearance Checklist alle YES
- Metis-Beratung: Obligatorisch, vor Plan-Generierung ausgeführt
- Momus-Loop: Optionaler Hochpräzisions-Modus, loopt bis "OKAY"
- Einzelplan-Prinzip: Egal wie groß die Aufgabe, alle TODOs in einer `.md`-Datei
- Entwurfsverwaltung: Fortlaufende Aktualisierung von `.sisyphus/drafts/{name}.md`, Löschung nach Plan-Vervollständigung
</details>

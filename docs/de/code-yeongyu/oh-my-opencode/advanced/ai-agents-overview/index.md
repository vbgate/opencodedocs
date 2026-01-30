---
title: "KI-Agenten: Vorstellung von 10 Experten | oh-my-opencode"
sidebarTitle: "Lernen Sie 10 KI-Experten kennen"
subtitle: "KI-Agenten: Vorstellung von 10 Experten"
description: "Lernen Sie die 10 KI-Agenten von oh-my-opencode kennen. Wählen Sie Agenten basierend auf dem Aufgabentyp aus, um effiziente Zusammenarbeit und parallele Ausführung zu erreichen."
tags:
  - "ai-agents"
  - "orchestration"
prerequisite:
  - "start-sisyphus-orchestrator"
order: 60
---

# KI-Agenten-Team: Vorstellung von 10 Experten

## Was Sie lernen werden

- Die Verantwortlichkeiten und Fachgebiete der 10 integrierten KI-Agenten verstehen
- Schnell den am besten geeigneten Agenten basierend auf dem Aufgabentyp auswählen
- Die Zusammenarbeitsmechanismen zwischen Agenten verstehen (Delegation, Parallelität, Review)
- Die Berechtigungsbeschränkungen und Anwendungsszenarien verschiedener Agenten beherrschen

## Kerngedanke: Zusammenarbeit wie ein echtes Team

Die Kernidee von **oh-my-opencode** ist: **Behandeln Sie KI nicht als einen Alleskönner, sondern als ein professionelles Team**.

In einem echten Entwicklungsteam benötigen Sie:
- **Hauptorchestrator** (Tech Lead): Verantwortlich für Planung, Aufgabenverteilung und Fortschrittsverfolgung
- **Architekturberater** (Architect): Bietet technische Entscheidungen und Architekturdesign-Empfehlungen
- **Code-Reviewer** (Reviewer): Überprüft Code-Qualität und findet potenzielle Probleme
- **Forschungsexperte** (Researcher): Sucht Dokumentation, Open-Source-Implementierungen und Best Practices
- **Code-Detektiv** (Searcher): Lokalisiert schnell Code, findet Referenzen und versteht bestehende Implementierungen
- **Frontend-Designer** (Frontend Designer): Entwirft UI und passt Stile an
- **Git-Experte** (Git Master): Committet Code, verwaltet Branches und durchsucht Historie

oh-my-opencode hat diese Rollen in 10 spezialisierte KI-Agenten umgesetzt, die Sie flexibel je nach Aufgabentyp kombinieren können.

## Detaillierte Vorstellung der 10 Agenten

### Hauptorchestratoren (2)

#### Sisyphus - Hauptorchestrator

**Rolle**: Hauptorchestrator, Ihr primärer Tech Lead

**Fähigkeiten**:
- Tiefes Reasoning (32k thinking budget)
- Planung und Delegation komplexer Aufgaben
- Ausführung von Code-Modifikationen und Refactoring
- Verwaltung des gesamten Entwicklungsprozesses

**Empfohlenes Modell**: `anthropic/claude-opus-4-5` (temperature: 0.1)

**Anwendungsszenarien**:
- Tägliche Entwicklungsaufgaben (neue Features, Bug-Fixes)
- Komplexe Probleme, die tiefes Reasoning erfordern
- Mehrstufige Aufgabenzerlegung und -ausführung
- Szenarien, die parallele Delegation an andere Agenten erfordern

**Aufrufmethode**:
- Standard-Hauptagent (im OpenCode Agent Selector "Sisyphus")
- Direkte Eingabe der Aufgabe im Prompt, keine speziellen Trigger-Wörter erforderlich

**Berechtigungen**: Vollständige Tool-Berechtigungen (write, edit, bash, delegate_task usw.)

---

#### Atlas - TODO-Manager

**Rolle**: Hauptorchestrator, spezialisiert auf TODO-Listen-Management und Aufgabenausführungsverfolgung

**Fähigkeiten**:
- Verwaltung und Verfolgung von TODO-Listen
- Systematische Ausführungsplanung
- Aufgabenfortschrittsüberwachung

**Empfohlenes Modell**: `anthropic/claude-opus-4-5` (temperature: 0.1)

**Anwendungsszenarien**:
- Projektausführung mit dem Befehl `/start-work` starten
- Aufgaben streng nach Plan abschließen
- Systematische Verfolgung des Aufgabenfortschritts

**Aufrufmethode**:
- Verwendung des Slash-Befehls `/start-work`
- Automatische Aktivierung über Atlas Hook

**Berechtigungen**: Vollständige Tool-Berechtigungen

---

### Berater und Reviewer (3)

#### Oracle - Strategischer Berater

**Rolle**: Nur-Lese-Technologieberater, Experte für hochintelligentes Reasoning

**Fähigkeiten**:
- Architekturentscheidungsempfehlungen
- Diagnose komplexer Probleme
- Code-Review (nur Lesen)
- Multi-System-Abwägungsanalyse

**Empfohlenes Modell**: `openai/gpt-5.2` (temperature: 0.1)

**Anwendungsszenarien**:
- Komplexes Architekturdesign
- Selbstüberprüfung nach Abschluss wichtiger Arbeiten
- Schwieriges Debugging nach 2+ fehlgeschlagenen Reparaturversuchen
- Unbekannte Code-Muster oder Architekturen
- Sicherheits-/Performance-bezogene Probleme

**Auslösebedingungen**:
- Prompt enthält `@oracle` oder verwendet `delegate_task(agent="oracle")`
- Automatische Empfehlung bei komplexen Architekturentscheidungen

**Einschränkungen**: Nur-Lese-Berechtigungen (write, edit, task, delegate_task verboten)

**Kernprinzipien**:
- **Minimalismus**: Bevorzugt die einfachste Lösung
- **Nutzung vorhandener Ressourcen**: Priorisiert Modifikation des aktuellen Codes, vermeidet neue Abhängigkeiten
- **Developer Experience First**: Lesbarkeit, Wartbarkeit > theoretische Performance
- **Einzelner klarer Pfad**: Bietet eine Hauptempfehlung, nur bei signifikanten Abwägungsunterschieden alternative Ansätze

---

#### Metis - Pre-Planning-Analyst

**Rolle**: Experte für Anforderungsanalyse und Risikobewertung vor der Planung

**Fähigkeiten**:
- Identifizierung versteckter Anforderungen und unklarer Vorgaben
- Erkennung von Mehrdeutigkeiten, die zu KI-Fehlern führen können
- Markierung potenzieller AI-Slop-Muster (Over-Engineering, Scope Creep)
- Vorbereitung von Anweisungen für Planungsagenten

**Empfohlenes Modell**: `anthropic/claude-sonnet-4-5` (temperature: 0.3)

**Anwendungsszenarien**:
- Vor der Prometheus-Planung
- Wenn Benutzeranfragen vage oder offen sind
- Verhinderung von KI-Over-Engineering-Mustern

**Aufrufmethode**: Automatischer Aufruf durch Prometheus (Interview-Modus)

**Einschränkungen**: Nur-Lese-Berechtigungen (write, edit, task, delegate_task verboten)

**Kernprozess**:
1. **Intent-Klassifizierung**: Refactoring / Von Grund auf neu / Mittlere Aufgabe / Kollaboration / Architektur / Forschung
2. **Intent-spezifische Analyse**: Bietet gezielte Empfehlungen basierend auf verschiedenen Typen
3. **Fragengenerierung**: Generiert klare Fragen für den Benutzer
4. **Anweisungsvorbereitung**: Generiert klare "MUST" und "MUST NOT" Anweisungen für Prometheus

---

#### Momus - Plan-Reviewer

**Rolle**: Strenger Plan-Review-Experte, findet alle Lücken und Unklarheiten

**Fähigkeiten**:
- Validierung der Klarheit, Überprüfbarkeit und Vollständigkeit von Plänen
- Überprüfung aller Dateireferenzen und Kontexte
- Simulation tatsächlicher Implementierungsschritte
- Identifizierung kritischer Lücken

**Empfohlenes Modell**: `anthropic/claude-sonnet-4-5` (temperature: 0.1)

**Anwendungsszenarien**:
- Nach Erstellung eines Arbeitsplans durch Prometheus
- Vor Ausführung komplexer TODO-Listen
- Validierung der Planqualität

**Aufrufmethode**: Automatischer Aufruf durch Prometheus

**Einschränkungen**: Nur-Lese-Berechtigungen (write, edit, task, delegate_task verboten)

**Vier Hauptbewertungskriterien**:
1. **Klarheit der Arbeitsinhalte**: Gibt jede Aufgabe eine Referenzquelle an?
2. **Validierungs- und Akzeptanzkriterien**: Gibt es konkrete Erfolgsprüfungsmethoden?
3. **Kontextvollständigkeit**: Wird ausreichend Kontext bereitgestellt (90% Konfidenzschwelle)?
4. **Gesamtverständnis**: Versteht der Entwickler WARUM, WAS und WIE?

**Kernprinzip**: **Dokumenten-Reviewer, kein Design-Berater**. Bewertet "Ist der Plan klar genug zur Ausführung", nicht "Ist die gewählte Methode korrekt".

---

### Forschung und Exploration (3)

#### Librarian - Multi-Repository-Forschungsexperte

**Rolle**: Experte für das Verständnis von Open-Source-Repositories, spezialisiert auf das Finden von Dokumentation und Implementierungsbeispielen

**Fähigkeiten**:
- GitHub CLI: Repositories klonen, Issues/PRs durchsuchen, Historie anzeigen
- Context7: Offizielle Dokumentation abfragen
- Web Search: Neueste Informationen suchen
- Generierung von Beweisen mit permanenten Links

**Empfohlenes Modell**: `opencode/big-pickle` (temperature: 0.1)

**Anwendungsszenarien**:
- "Wie verwendet man [Bibliothek]?"
- "Was sind die Best Practices für [Framework-Feature]?"
- "Warum verhält sich [externe Abhängigkeit] so?"
- "Finde Verwendungsbeispiele für [Bibliothek]"

**Auslösebedingungen**:
- Automatischer Trigger bei Erwähnung externer Bibliotheken/Quellen
- Prompt enthält `@librarian`

**Anforderungstyp-Klassifizierung**:
- **Typ A (Konzeptionell)**: "Wie macht man X?", "Best Practices"
- **Typ B (Implementierungsreferenz)**: "Wie implementiert X Y?", "Zeige Quellcode von Z"
- **Typ C (Kontext und Historie)**: "Warum wurde das so geändert?", "Historie von X?"
- **Typ D (Umfassende Forschung)**: Komplexe/vage Anfragen

**Einschränkungen**: Nur-Lese-Berechtigungen (write, edit, task, delegate_task, call_omo_agent verboten)

**Zwingende Anforderung**: Alle Code-Aussagen müssen GitHub-Permalinks enthalten

---

#### Explore - Schneller Codebase-Explorations-Experte

**Rolle**: Kontextbewusster Code-Such-Experte

**Fähigkeiten**:
- LSP-Tools: Definitionen, Referenzen, Symbolnavigation
- AST-Grep: Strukturelle Mustersuche
- Grep: Textmustersuche
- Glob: Dateinamenmuster-Matching
- Parallele Ausführung (3+ Tools gleichzeitig)

**Empfohlenes Modell**: `opencode/gpt-5-nano` (temperature: 0.1)

**Anwendungsszenarien**:
- Breite Suche mit 2+ Suchperspektiven erforderlich
- Unbekannte Modulstruktur
- Cross-Layer-Mustererkennung
- Finden von "Wo ist X?", "Welche Datei hat Y?"

**Auslösebedingungen**:
- Automatischer Trigger bei Beteiligung von 2+ Modulen
- Prompt enthält `@explore`

**Erzwungenes Ausgabeformat**:
```
<analysis>
**Literal Request**: [Wörtliche Benutzeranfrage]
**Actual Need**: [Was tatsächlich benötigt wird]
**Success Looks Like**: [Wie Erfolg aussehen sollte]
</analysis>

<results>
<files>
- /absolute/path/to/file1.ts — [Warum diese Datei relevant ist]
- /absolute/path/to/file2.ts — [Warum diese Datei relevant ist]
</files>

<answer>
[Direkte Antwort auf den tatsächlichen Bedarf]
</answer>

<next_steps>
[Was als nächstes zu tun ist]
</next_steps>
</results>
```

**Einschränkungen**: Nur-Lese-Berechtigungen (write, edit, task, delegate_task, call_omo_agent verboten)

---

#### Multimodal Looker - Medienanalyse-Experte

**Rolle**: Interpretiert Mediendateien, die nicht als reiner Text gelesen werden können

**Fähigkeiten**:
- PDF: Text, Struktur, Tabellen, spezifische Kapitel-Daten extrahieren
- Bilder: Layout, UI-Elemente, Text, Diagramme beschreiben
- Diagramme: Beziehungen, Abläufe, Architekturen erklären

**Empfohlenes Modell**: `google/gemini-3-flash` (temperature: 0.1)

**Anwendungsszenarien**:
- Strukturierte Daten aus PDFs extrahieren
- UI-Elemente oder Diagramme in Bildern beschreiben
- Diagramme in technischer Dokumentation analysieren

**Aufrufmethode**: Automatischer Trigger über `look_at`-Tool

**Einschränkungen**: **Nur-Lese-Whitelist** (nur read-Tool erlaubt)

---

### Planung und Ausführung (2)

#### Prometheus - Strategischer Planer

**Rolle**: Experte für Interview-basierte Anforderungserhebung und Arbeitsplan-Generierung

**Fähigkeiten**:
- Interview-Modus: Kontinuierliches Fragen bis Anforderungen klar sind
- Arbeitsplan-Generierung: Strukturierte Markdown-Plandokumente
- Parallele Delegation: Oracle, Metis, Momus zur Planvalidierung konsultieren

**Empfohlenes Modell**: `anthropic/claude-opus-4-5` (temperature: 0.1)

**Anwendungsszenarien**:
- Detaillierte Pläne für komplexe Projekte erstellen
- Projekte mit klärungsbedürftigen Anforderungen
- Systematische Arbeitsabläufe

**Aufrufmethode**:
- Prompt enthält `@prometheus` oder "Prometheus verwenden"
- Verwendung des Slash-Befehls `/start-work`

**Workflow**:
1. **Interview-Modus**: Kontinuierliches Fragen bis Anforderungen klar sind
2. **Plan-Entwurf**: Strukturierten Markdown-Plan generieren
3. **Parallele Delegation**:
   - `delegate_task(agent="oracle", prompt="Architekturentscheidungen überprüfen")` → Hintergrund
   - `delegate_task(agent="metis", prompt="Potenzielle Risiken identifizieren")` → Hintergrund
   - `delegate_task(agent="momus", prompt="Planvollständigkeit validieren")` → Hintergrund
4. **Feedback integrieren**: Plan verfeinern
5. **Plan ausgeben**: In `.sisyphus/plans/{name}.md` speichern

**Einschränkungen**: Nur Planung, keine Code-Implementierung (erzwungen durch `prometheus-md-only` Hook)

---

#### Sisyphus Junior - Aufgaben-Executor

**Rolle**: Kategorie-generierter Sub-Agent-Executor

**Fähigkeiten**:
- Erbt Category-Konfiguration (Modell, temperature, prompt_append)
- Lädt Skills (spezialisierte Fähigkeiten)
- Führt delegierte Unteraufgaben aus

**Empfohlenes Modell**: Erbt von Category (Standard `anthropic/claude-sonnet-4-5`)

**Anwendungsszenarien**:
- Automatische Generierung bei Verwendung von `delegate_task(category="...", skills=["..."])`
- Aufgaben, die spezifische Category- und Skill-Kombinationen erfordern
- Leichtgewichtige schnelle Aufgaben ("quick" Category verwendet Haiku-Modell)

**Aufrufmethode**: Automatische Generierung über `delegate_task`-Tool

**Einschränkungen**: task, delegate_task verboten (keine erneute Delegation)

---

## Schnellreferenz für Agent-Aufrufe

| Agent | Aufrufmethode | Auslösebedingung |
| --- | --- | --- |
| **Sisyphus** | Standard-Hauptagent | Tägliche Entwicklungsaufgaben |
| **Atlas** | `/start-work` Befehl | Projektausführung starten |
| **Oracle** | `@oracle` oder `delegate_task(agent="oracle")` | Komplexe Architekturentscheidungen, 2+ fehlgeschlagene Reparaturen |
| **Librarian** | `@librarian` oder `delegate_task(agent="librarian")` | Automatischer Trigger bei Erwähnung externer Bibliotheken/Quellen |
| **Explore** | `@explore` oder `delegate_task(agent="explore")` | Automatischer Trigger bei Beteiligung von 2+ Modulen |
| **Multimodal Looker** | `look_at` Tool | Bei Bedarf zur Analyse von PDF/Bildern |
| **Prometheus** | `@prometheus` oder `/start-work` | Prompt enthält "Prometheus" oder Planung erforderlich |
| **Metis** | Automatischer Aufruf durch Prometheus | Automatische Analyse vor Planung |
| **Momus** | Automatischer Aufruf durch Prometheus | Automatische Überprüfung nach Plan-Generierung |
| **Sisyphus Junior** | `delegate_task(category=...)` | Automatische Generierung bei Verwendung von Category/Skill |

---

## Wann welchen Agenten verwenden

::: tip Schneller Entscheidungsbaum

**Szenario 1: Tägliche Entwicklung (Code schreiben, Bugs fixen)**
→ **Sisyphus** (Standard)

**Szenario 2: Komplexe Architekturentscheidungen**
→ **@oracle** konsultieren

**Szenario 3: Dokumentation oder Implementierung externer Bibliotheken finden**
→ **@librarian** oder automatischer Trigger

**Szenario 4: Unbekannte Codebase, relevanten Code finden**
→ **@explore** oder automatischer Trigger (2+ Module)

**Szenario 5: Komplexes Projekt benötigt detaillierten Plan**
→ **@prometheus** oder `/start-work` verwenden

**Szenario 6: PDF oder Bild analysieren**
→ **look_at** Tool (automatischer Trigger für Multimodal Looker)

**Szenario 7: Schnelle einfache Aufgabe, Kosten sparen**
→ `delegate_task(category="quick")`

**Szenario 8: Git-Spezialoperationen erforderlich**
→ `delegate_task(category="quick", skills=["git-master"])`

**Szenario 9: Frontend-UI-Design erforderlich**
→ `delegate_task(category="visual-engineering")`

**Szenario 10: Hochintelligente Reasoning-Aufgabe erforderlich**
→ `delegate_task(category="ultrabrain")`

:::

---

## Beispiele für Agent-Zusammenarbeit: Vollständiger Workflow

### Beispiel 1: Komplexe Feature-Entwicklung

```
Benutzer: Entwickle ein Benutzerauthentifizierungssystem

→ Sisyphus empfängt Aufgabe
  → Analysiert Anforderungen, erkennt Bedarf an externer Bibliothek (JWT)
  → Parallele Delegation:
    - @librarian: "Finde Next.js JWT Best Practices" → [Hintergrund]
    - @explore: "Finde bestehenden authentifizierungsbezogenen Code" → [Hintergrund]
  → Wartet auf Ergebnisse, integriert Informationen
  → Implementiert JWT-Authentifizierungsfunktion
  → Nach Abschluss Delegation:
    - @oracle: "Architekturdesign überprüfen" → [Hintergrund]
  → Optimiert basierend auf Empfehlungen
```

---

### Beispiel 2: Projektplanung

```
Benutzer: Verwende Prometheus zur Planung dieses Projekts

→ Prometheus empfängt Aufgabe
  → Interview-Modus:
    - Frage 1: Was sind die Kernfunktionen?
    - [Benutzerantwort]
    - Frage 2: Zielbenutzergruppe?
    - [Benutzerantwort]
    - ...
  → Nach Klärung der Anforderungen, parallele Delegation:
    - delegate_task(agent="oracle", prompt="Architekturentscheidungen überprüfen") → [Hintergrund]
    - delegate_task(agent="metis", prompt="Potenzielle Risiken identifizieren") → [Hintergrund]
    - delegate_task(agent="momus", prompt="Planvollständigkeit validieren") → [Hintergrund]
  → Wartet auf Abschluss aller Hintergrundaufgaben
  → Integriert Feedback, verfeinert Plan
  → Gibt Markdown-Plandokument aus
→ Benutzer überprüft Plan, bestätigt
→ Verwendet /start-work zur Ausführung
```

---

## Agent-Berechtigungen und Einschränkungen

| Agent | write | edit | bash | delegate_task | webfetch | read | LSP | AST-Grep |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Sisyphus** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Atlas** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Oracle** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Librarian** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Explore** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Multimodal Looker** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Prometheus** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Metis** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Momus** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Sisyphus Junior** | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |

---

## Zusammenfassung dieser Lektion

Die 10 KI-Agenten von oh-my-opencode decken alle Aspekte des Entwicklungsprozesses ab:

- **Orchestrierung und Ausführung**: Sisyphus (Hauptorchestrator), Atlas (TODO-Management)
- **Beratung und Review**: Oracle (Strategischer Berater), Metis (Pre-Planning-Analyse), Momus (Plan-Review)
- **Forschung und Exploration**: Librarian (Multi-Repository-Forschung), Explore (Codebase-Exploration), Multimodal Looker (Medienanalyse)
- **Planung**: Prometheus (Strategische Planung), Sisyphus Junior (Unteraufgaben-Ausführung)

**Kernpunkte**:
1. Behandeln Sie KI nicht als Alleskönner, sondern als professionelles Team
2. Wählen Sie den am besten geeigneten Agenten basierend auf dem Aufgabentyp
3. Nutzen Sie parallele Delegation zur Effizienzsteigerung (Librarian, Explore, Oracle können im Hintergrund laufen)
4. Verstehen Sie die Berechtigungsbeschränkungen jedes Agenten (Nur-Lese-Agenten können keinen Code ändern)
5. Zusammenarbeit zwischen Agenten kann vollständige Workflows bilden (Planung → Ausführung → Review)

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Prometheus-Planung: Interview-basierte Anforderungserhebung](../prometheus-planning/)**.
>
> Sie werden lernen:
> - Wie man Prometheus für Interview-basierte Anforderungserhebung verwendet
> - Wie man strukturierte Arbeitspläne generiert
> - Wie man Metis und Momus zur Planvalidierung einsetzt
> - Wie man Hintergrundaufgaben abruft und abbricht

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-26

| Agent | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Sisyphus Hauptorchestrator | [`src/agents/sisyphus.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/sisyphus.ts) | - |
| Atlas Hauptorchestrator | [`src/agents/atlas.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/atlas.ts) | - |
| Oracle Berater | [`src/agents/oracle.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/oracle.ts) | 1-123 |
| Librarian Forschungsexperte | [`src/agents/librarian.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/librarian.ts) | 1-327 |
| Explore Such-Experte | [`src/agents/explore.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/explore.ts) | 1-123 |
| Multimodal Looker | [`src/agents/multimodal-looker.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/multimodal-looker.ts) | 1-57 |
| Prometheus Planer | [`src/agents/prometheus-prompt.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/prometheus-prompt.ts) | 1-1196 |
| Metis Pre-Planning-Analyse | [`src/agents/metis.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/metis.ts) | 1-316 |
| Momus Plan-Reviewer | [`src/agents/momus.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/momus.ts) | 1-445 |
| Sisyphus Junior | [`src/agents/sisyphus-junior.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/sisyphus-junior.ts) | - |
| Agent-Metadaten-Definition | [`src/agents/types.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/types.ts) | - |
| Agent-Tool-Einschränkungen | [`src/shared/permission-compat.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/shared/permission-compat.ts) | - |

**Schlüsselkonfigurationen**:
- `ORACLE_PROMPT_METADATA`: Oracle-Agent-Metadaten (Auslösebedingungen, Anwendungsszenarien)
- `LIBRARIAN_PROMPT_METADATA`: Librarian-Agent-Metadaten
- `EXPLORE_PROMPT_METADATA`: Explore-Agent-Metadaten
- `MULTIMODAL_LOOKER_PROMPT_METADATA`: Multimodal Looker-Agent-Metadaten
- `METIS_SYSTEM_PROMPT`: Metis-Agent-System-Prompt
- `MOMUS_SYSTEM_PROMPT`: Momus-Agent-System-Prompt

**Schlüsselfunktionen**:
- `createOracleAgent(model)`: Oracle-Agent-Konfiguration erstellen
- `createLibrarianAgent(model)`: Librarian-Agent-Konfiguration erstellen
- `createExploreAgent(model)`: Explore-Agent-Konfiguration erstellen
- `createMultimodalLookerAgent(model)`: Multimodal Looker-Agent-Konfiguration erstellen
- `createMetisAgent(model)`: Metis-Agent-Konfiguration erstellen
- `createMomusAgent(model)`: Momus-Agent-Konfiguration erstellen

**Berechtigungsbeschränkungen**:
- `createAgentToolRestrictions()`: Agent-Tool-Einschränkungen erstellen (verwendet von Oracle, Librarian, Explore, Metis, Momus)
- `createAgentToolAllowlist()`: Agent-Tool-Whitelist erstellen (verwendet von Multimodal Looker)

</details>

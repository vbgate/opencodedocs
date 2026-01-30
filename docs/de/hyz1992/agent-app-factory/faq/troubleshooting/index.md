---
title: "Häufige Fragen und Fehlerbehebung: Schnelle Lösung verschiedener Probleme | AI App Factory Tutorial"
sidebarTitle: "Was tun bei Problemen"
subtitle: "Häufige Fragen und Fehlerbehebung"
description: "Erfahren Sie, wie Sie häufige Probleme bei der Verwendung von AI App Factory schnell identifizieren und beheben können. Dieses Tutorial erklärt detailliert die Fehlerbehebungsmethoden und Reparaturschritte für Initialisierungsprobleme, Startfehler des KI-Assistenten, Phasenfehler, Abhängigkeitsversionskonflikte und Berechtigungsfehler, um Ihre Anwendungsentwicklung effizient abzuschließen."
tags:
  - "Fehlerbehebung"
  - "FAQ"
  - "Debugging"
prerequisite:
  - "../../start/installation/"
  - "../../start/init-project/"
order: 190
---

# Häufige Fragen und Fehlerbehebung

## Was Sie erreichen können

- Schnelle Identifizierung und Lösung von Verzeichnisproblemen bei der Initialisierung
- Fehlerbehebung bei Startfehlern des KI-Assistenten
- Verstehen des Phasenfehlerbehandlungsprozesses (Wiederholung/Rücksetzung/Manueller Eingriff)
- Lösung von Abhängigkeitsinstallations- und Versionskonflikten
- Umgang mit Agent-Berechtigungsfehlern
- Verwendung von `factory continue` zur Wiederaufnahme der Ausführung über mehrere Sitzungen hinweg

## Ihre aktuelle Situation

Möglicherweise haben Sie folgende Probleme:

- ❌ Bei der Ausführung von `factory init` wird "Verzeichnis ist nicht leer" angezeigt
- ❌ Der KI-Assistent kann nicht gestartet werden, die Konfiguration der Berechtigungen ist unbekannt
- ❌ Die Pipeline-Ausführung scheitert plötzlich in einer Phase, es ist unklar, wie fortzufahren ist
- ❌ Fehler bei der Abhängigkeitsinstallation, schwere Versionskonflikte
- ❌ Vom Agent generierte Artefakte werden als "unberechtigt" markiert
- ❌ Checkpoints und Wiederholungsmechanismus werden nicht verstanden

Keine Sorge, all diese Probleme haben klare Lösungen. Dieses Tutorial hilft Ihnen dabei, verschiedene Fehler schnell zu diagnostizieren und zu beheben.

---

## 🎒 Vorbereitungen vor dem Start

::: warning Voraussetzungen

Bevor Sie beginnen, stellen Sie sicher, dass Sie:

- [ ] [Installation und Konfiguration](../../start/installation/) abgeschlossen haben
- [ ] [Initialisierung eines Factory-Projekts](../../start/init-project/) abgeschlossen haben
- [ ] [Übersicht über die 7-Phasen-Pipeline](../../start/pipeline-overview/) verstanden haben
- [ ] Wissen, wie Sie die [Claude Code-Integration](../../platforms/claude-code/) verwenden

:::

## Kernkonzepte

Die Fehlerbehandlung von AI App Factory folgt einer strengen Strategie. Das Verständnis dieses Mechanismus wird Sie daran hindern, bei Problemen hilflos zu sein.

### Die drei Ebenen der Fehlerbehandlung

1. **Automatische Wiederholung**: Jede Phase erlaubt eine Wiederholung
2. **Rücksetzung auf Archiv**: Fehlende Artefakte werden nach `_failed/` verschoben, Rücksetzung zum letzten erfolgreichen Checkpoint
3. **Manueller Eingriff**: Nach zwei aufeinanderfolgenden Fehlern wird angehalten, manuelle Reparatur erforderlich

### Regeln zur Berechtigungsüberschreitung

- Agent schreibt in unautorisiertes Verzeichnis → Verschieben nach `_untrusted/`
- Pipeline wird angehalten, wartet auf Ihre Prüfung
- Anpassung der Berechtigungen oder Änderung des Agent-Verhaltens nach Bedarf

### Berechtigungsgrenzen

Jeder Agent hat einen strengen Bereich für Lese- und Schreibberechtigungen:

| Agent       | Kann lesen                        | Kann schreiben                                  |
| ----------- | --------------------------------- | ----------------------------------------------- |
| bootstrap   | Keine                            | `input/`                                        |
| prd         | `input/`                          | `artifacts/prd/`                                |
| ui          | `artifacts/prd/`                  | `artifacts/ui/`                                 |
| tech        | `artifacts/prd/`                  | `artifacts/tech/`, `artifacts/backend/prisma/`  |
| code        | `artifacts/ui/`, `artifacts/tech/`, `artifacts/backend/prisma/` | `artifacts/backend/`, `artifacts/client/`       |
| validation  | `artifacts/backend/`, `artifacts/client/` | `artifacts/validation/`                         |
| preview     | `artifacts/backend/`, `artifacts/client/` | `artifacts/preview/`                            |

---

## Initialisierungsprobleme

### Problem 1: Verzeichnis-nicht-leer-Fehler

**Symptom**:

```bash
$ factory init
Error: Directory is not empty or contains conflicting files
```

**Ursache**: Das aktuelle Verzeichnis enthält konfliktverursachende Dateien (keine `.git`, `README.md` oder andere erlaubte Dateien).

**Lösung**:

1. **Verzeichnisinhalt bestätigen**:

```bash
ls -la
```

2. **Konfliktverursachende Dateien bereinigen**:

```bash
# Methode 1: Konfliktverursachende Dateien löschen
rm -rf <conflicting-files>

# Methode 2: In neues Verzeichnis verschieben
mkdir ../my-app && mv . ../my-app/
cd ../my-app
```

3. **Erneut initialisieren**:

```bash
factory init
```

**Erlaubte Dateien**: `.git`, `.gitignore`, `README.md`, `.vscode/*`, `.idea/*`

### Problem 2: Factory-Projekt bereits vorhanden

**Symptom**:

```bash
$ factory init
Error: This is already a Factory project
```

**Ursache**: Das Verzeichnis enthält bereits ein `.factory/` oder `artifacts/` Verzeichnis.

**Lösung**:

- Für ein neues Projekt: Bereinigen und dann initialisieren:

```bash
rm -rf .factory artifacts
factory init
```

- Um das alte Projekt wiederherzustellen: Führen Sie direkt `factory run` aus

### Problem 3: Start des KI-Assistenten fehlgeschlagen

**Symptom**:

```bash
$ factory init
✓ Factory project initialized
Could not find Claude Code installation.
```

**Ursache**: Claude Code ist nicht installiert oder nicht korrekt konfiguriert.

**Lösung**:

1. **Claude Code installieren**:

```bash
# macOS
brew install claude

# Linux (vom offiziellen Download)
# https://claude.ai/code
```

2. **Installation verifizieren**:

```bash
claude --version
```

3. **Manuell starten**:

```bash
# Im Factory-Projektverzeichnis
claude "Bitte lesen Sie .factory/pipeline.yaml und .factory/agents/orchestrator.checkpoint.md, starten Sie die Pipeline"
```

**Manueller Startprozess**: 1. `pipeline.yaml` lesen → 2. `orchestrator.checkpoint.md` lesen → 3. Auf KI-Ausführung warten

---

## Pipeline-Ausführungsprobleme

### Problem 4: Kein-Projekt-Verzeichnis-Fehler

**Symptom**:

```bash
$ factory run
Error: Not a Factory project. Run 'factory init' first.
```

**Ursache**: Das aktuelle Verzeichnis ist kein Factory-Projekt (fehlendes `.factory/` Verzeichnis).

**Lösung**:

1. **Projektstruktur bestätigen**:

```bash
ls -la .factory/
```

2. **Zum korrekten Verzeichnis wechseln** oder **erneut initialisieren**:

```bash
# Zum Projektverzeichnis wechseln
cd /path/to/project

# Oder erneut initialisieren
factory init
```

### Problem 5: Pipeline-Datei nicht gefunden

**Symptom**:

```bash
$ factory run
Error: Pipeline configuration not found
```

**Ursache**: Die Datei `pipeline.yaml` fehlt oder der Pfad ist falsch.

**Lösung**:

1. **Prüfen, ob die Datei existiert**:

```bash
ls -la .factory/pipeline.yaml
ls -la pipeline.yaml
```

2. **Manuell kopieren** (falls die Datei verloren gegangen ist):

```bash
cp /path/to/factory/source/hyz1992/agent-app-factory/pipeline.yaml .factory/
```

3. **Erneut initialisieren** (am zuverlässigsten):

```bash
rm -rf .factory
factory init
```

---

## Phasenfehlerbehandlung

### Problem 6: Bootstrap-Phase fehlgeschlagen

**Symptom**:

- `input/idea.md` existiert nicht
- `idea.md` fehlt wichtige Abschnitte (Zielgruppe, Kernwert, Annahmen)

**Ursache**: Unzureichende Benutzereingaben oder Agent hat die Datei nicht korrekt geschrieben.

**Behandlungsprozess**:

```
1. Prüfen, ob das input/-Verzeichnis existiert → Falls nicht, erstellen
2. Einmal wiederholen, Agent zur Verwendung der korrekten Vorlage auffordern
3. Falls immer noch fehlerhaft, detailliertere Produktbeschreibung vom Benutzer anfordern
```

**Manuelle Reparatur**:

1. **Artefaktverzeichnis prüfen**:

```bash
ls -la artifacts/_failed/bootstrap/
```

2. **input/-Verzeichnis erstellen**:

```bash
mkdir -p input
```

3. **Detaillierte Produktbeschreibung bereitstellen**:

Der KI klarere, detailliertere Produktideen bereitstellen, einschließlich:
- Wer die Zielgruppe ist (konkrete Personas)
- Was die Kernschmerzpunkte sind
- Welches Problem gelöst werden soll
- Erste Funktionsideen

### Problem 7: PRD-Phase fehlgeschlagen

**Symptom**:

- PRD enthält technische Details (verletzt Verantwortlichkeitsgrenzen)
- Muss-Have-Funktionen > 7 (Scope Creep)
- Fehlende Nichtziele (Grenzen nicht klar definiert)

**Ursache**: Agent überschreitet Grenzen oder Scope-Kontrolle ist nicht streng.

**Behandlungsprozess**:

```
1. Prüfen, dass prd.md keine technischen Schlüsselwörter enthält
2. Prüfen, dass die Anzahl der Muss-Have-Funktionen ≤ 7
3. Prüfen, dass die Zielgruppe konkrete Personas hat
4. Bei Wiederholung konkrete Korrekturanforderungen bereitstellen
```

**Beispiele für häufige Fehler**:

| Fehlertyp | Fehlerbeispiel | Korrektes Beispiel |
| ---------- | -------------- | ------------------ |
| Enthält technische Details | "Implementierung mit React Native" | "Unterstützt iOS und Android Plattformen" |
| Scope Creep | "Enthält Zahlung, Social, Nachrichten und 10 weitere Funktionen" | "Kernfunktionen nicht mehr als 7" |
| Ziel vage | "Alle können es verwenden" | "Städtische Angestellte im Alter von 25-35 Jahren" |

**Manuelle Reparatur**:

1. **Fehlgeschlagene PRD prüfen**:

```bash
cat artifacts/_failed/prd/prd.md
```

2. **Inhalt korrigieren**:

- Tech-Stack-Beschreibung entfernen
- Funktionsliste auf ≤ 7 reduzieren
- Liste der Nichtziele ergänzen

3. **Manuell an die korrekte Position verschieben**:

```bash
mv artifacts/_failed/prd/prd.md artifacts/prd/prd.md
```

### Problem 8: UI-Phase fehlgeschlagen

**Symptom**:

- Seitenanzahl > 8 (Scope Creep)
- Vorschau-HTML-Datei beschädigt
- Verwendung von KI-Stil (Inter-Schriftart + violetter Farbverlauf)
- YAML-Analyse fehlgeschlagen

**Ursache**: UI-Scope zu groß oder Ästhetikrichtlinie nicht befolgt.

**Behandlungsprozess**:

```
1. Seitenanzahl in ui.schema.yaml zählen
2. Versuchen, preview.web/index.html im Browser zu öffnen
3. YAML-Syntax validieren
4. Prüfen, ob verbotene KI-Stil-Elemente verwendet wurden
```

**Manuelle Reparatur**:

1. **YAML-Syntax validieren**:

```bash
npx js-yaml .factory/artifacts/ui/ui.schema.yaml
```

2. **Vorschau im Browser öffnen**:

```bash
open artifacts/ui/preview.web/index.html  # macOS
xdg-open artifacts/ui/preview.web/index.html  # Linux
```

3. **Seitenanzahl reduzieren**: Prüfen Sie `ui.schema.yaml`, stellen Sie sicher, dass die Seitenanzahl ≤ 8

### Problem 9: Tech-Phase fehlgeschlagen

**Symptom**:

- Prisma-Schema-Syntaxfehler
- Einführung von Microservices, Cache und anderen Overdesigns
- Zu viele Datenmodelle (Tabellenanzahl > 10)
- Fehlende API-Definitionen

**Ursache**: Architekturverkomplizierung oder Datenbankdesignprobleme.

**Behandlungsprozess**:

```
1. npx prisma validate ausführen, um Schema zu validieren
2. Prüfen, ob tech.md notwendige Abschnitte enthält
3. Anzahl der Datenmodelle zählen
4. Prüfen, ob unnötige komplexe Technologien eingeführt wurden
```

**Manuelle Reparatur**:

1. **Prisma-Schema validieren**:

```bash
cd artifacts/backend/
npx prisma validate
```

2. **Architektur vereinfachen**: Prüfen Sie `artifacts/tech/tech.md`, entfernen Sie unnötige Technologien (Microservices, Cache usw.)

3. **API-Definitionen ergänzen**: Stellen Sie sicher, dass `tech.md` alle erforderlichen API-Endpunkte enthält

### Problem 10: Code-Phase fehlgeschlagen

**Symptom**:

- Abhängigkeitsinstallation fehlgeschlagen
- TypeScript-Kompilierungsfehler
- Fehlende notwendige Dateien
- Tests fehlgeschlagen
- API kann nicht gestartet werden

**Ursache**: Abhängigkeitsversionskonflikte, Typprobleme oder Code-Logikfehler.

**Behandlungsprozess**:

```
1. npm install --dry-run ausführen, um Abhängigkeiten zu prüfen
2. npx tsc --noEmit ausführen, um Typen zu prüfen
3. Verzeichnisstruktur gegen Dateiliste prüfen
4. npm test ausführen, um Tests zu validieren
5. Falls alles bestanden, versuchen, den Dienst zu starten
```

**Häufige Abhängigkeitsprobleme beheben**:

```bash
# Versionskonflikt
rm -rf node_modules package-lock.json
npm install

# Prisma-Version stimmt nicht überein
npm install @prisma/client@latest prisma@latest

# React Native-Abhängigkeitsprobleme
npx expo install --fix
```

**TypeScript-Fehlerbehandlung**:

```bash
# Typfehler prüfen
npx tsc --noEmit

# Nach Korrektur erneut validieren
npx tsc --noEmit
```

**Verzeichnisstrukturprüfung**:

Stellen Sie sicher, dass folgende notwendige Dateien/Verzeichnisse enthalten sind:

```
artifacts/backend/
├── package.json
├── tsconfig.json
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── index.ts
│   ├── lib/
│   └── routes/
└── vitest.config.ts

artifacts/client/
├── package.json
├── tsconfig.json
├── app.json
└── src/
```

### Problem 11: Validierungsphase fehlgeschlagen

**Symptom**:

- Validierungsbericht unvollständig
- Zu viele kritische Probleme (Fehleranzahl > 10)
- Sicherheitsprobleme (harte Schlüssel erkannt)

**Ursache**: Schlechte Qualität der Code-Phase oder Sicherheitsprobleme.

**Behandlungsprozess**:

```
1. report.md analysieren, um sicherzustellen, dass alle Abschnitte existieren
2. Anzahl kritischer Probleme zählen
3. Falls kritische Probleme > 10, Rücksetzung zur Code-Phase empfohlen
4. Sicherheitsscanner-Ergebnisse prüfen
```

**Manuelle Reparatur**:

1. **Validierungsbericht anzeigen**:

```bash
cat artifacts/validation/report.md
```

2. **Kritische Probleme beheben**: Punkt für Punkt gemäß Bericht beheben

3. **Rücksetzung zur Code-Phase** (wenn zu viele Probleme):

```bash
factory run code  # Ab Code-Phase neu beginnen
```

### Problem 12: Preview-Phase fehlgeschlagen

**Symptom**:

- README unvollständig (fehlende Installationsschritte)
- Docker-Build fehlgeschlagen
- Bereitstellungskonfiguration fehlt

**Ursache**: Fehlende Inhalte oder Konfigurationsprobleme.

**Behandlungsprozess**:

```
1. Prüfen, dass README.md alle notwendigen Abschnitte enthält
2. docker build ausführen, um Dockerfile zu validieren
3. Prüfen, ob Bereitstellungskonfigurationsdateien existieren
```

**Manuelle Reparatur**:

1. **Docker-Konfiguration validieren**:

```bash
cd artifacts/preview/
docker build -t my-app .
```

2. **Bereitstellungsdateien prüfen**:

Stellen Sie sicher, dass folgende Dateien existieren:

```
artifacts/preview/
├── README.md
├── Dockerfile
├── docker-compose.yml
└── .github/workflows/ci.yml  # CI/CD-Konfiguration
```

---

## Behandlung von Berechtigungsüberschreitungen

### Problem 13: Agent schreibt ohne Berechtigung

**Symptom**:

```bash
Error: Unauthorized write to <path>
Artifacts moved to: artifacts/_untrusted/<stage-id>/
Pipeline paused. Manual intervention required.
```

**Ursache**: Agent schreibt in ein unautorisiertes Verzeichnis oder eine unautorisierte Datei.

**Lösung**:

1. **Unberechtigte Dateien prüfen**:

```bash
ls -la artifacts/_untrusted/<stage-id>/
```

2. **Berechtigungsmatrix prüfen**: Bestätigen Sie den schreibbaren Bereich des Agents

3. **Behandlungsmethode wählen**:

   - **Option A: Agent-Verhalten korrigieren** (empfohlen)

   Weisen Sie im KI-Assistenten explizit auf das Berechtigungsproblem hin und fordern Sie Korrektur.

   - **Option B: Dateien an die korrekte Position verschieben** (vorsichtig)

   Wenn Sie sicher sind, dass die Dateien existieren sollten, verschieben Sie sie manuell:

   ```bash
   mv artifacts/_untrusted/<stage-id>/<file> artifacts/<target-stage>/
   ```

   - **Option C: Berechtigungsmatrix anpassen** (fortgeschritten)

   Ändern Sie `.factory/policies/capability.matrix.md`, erhöhen Sie die Schreibberechtigungen des Agents.

4. **Ausführung fortsetzen**:

```bash
factory continue
```

**Beispielszenarien**:

- Code-Agent versucht, `artifacts/prd/prd.md` zu ändern (verletzt Verantwortlichkeitsgrenzen)
- UI-Agent versucht, `artifacts/backend/` Verzeichnis zu erstellen (außerhalb des Berechtigungsbereichs)
- Tech-Agent versucht, in `artifacts/ui/` Verzeichnis zu schreiben (überschreitet Grenzen)

---

## Probleme bei der Ausführung über mehrere Sitzungen

### Problem 14: Unzureichende Token oder Kontextakkumulation

**Symptom**:

- KI-Antworten werden langsamer
- Zu langer Kontext führt zu verschlechterter Modellleistung
- Zu hoher Token-Verbrauch

**Ursache**: Zu viel Gesprächsverlauf in derselben Sitzung akkumuliert.

**Lösung: `factory continue` verwenden**

Der Befehl `factory continue` ermöglicht Ihnen:

1. **Aktuellen Zustand speichern** in `.factory/state.json`
2. **Neues Claude Code-Fenster starten**
3. **Ausführung von der aktuellen Phase fortsetzen**

**Ausführungsschritte**:

1. **Aktuellen Status prüfen**:

```bash
factory status
```

Beispielausgabe:

```bash
Pipeline Status:
───────────────────────────────────────
Project: my-app
Status: Waiting
Current Stage: tech
Completed: bootstrap, prd, ui
```

2. **In neuer Sitzung fortfahren**:

```bash
factory continue
```

**Effekte**:

- Jede Phase hat einen sauberen Kontext
- Vermeidung von Token-Akkumulation
- Unterstützung für Unterbrechungswiederherstellung

**Manuelles Starten einer neuen Sitzung** (falls `factory continue` fehlschlägt):

```bash
# Berechtigungskonfiguration neu generieren
claude "Bitte generieren Sie .claude/settings.local.json neu, erlauben Sie Read/Write/Glob/Bash-Operationen"

# Neue Sitzung manuell starten
claude "Bitte führen Sie die Pipeline fort, aktuelle Phase ist tech"
```

---

## Umgebungs- und Berechtigungsprobleme

### Problem 15: Node.js-Version zu niedrig

**Symptom**:

```bash
Error: Node.js version must be >= 16.0.0
```

**Ursache**: Node.js-Version erfüllt die Anforderungen nicht.

**Lösung**:

1. **Version prüfen**:

```bash
node --version
```

2. **Node.js upgraden**:

```bash
# macOS
brew install node@18
brew link --overwrite node@18

# Linux (mit nvm)
nvm install 18
nvm use 18

# Windows (vom offiziellen Download)
# https://nodejs.org/
```

### Problem 16: Claude Code-Berechtigungsprobleme

**Symptom**:

- KI meldet "keine Lese-/Schreibberechtigung"
- KI kann auf `.factory/` Verzeichnis nicht zugreifen

**Ursache**: `.claude/settings.local.json` Berechtigungskonfiguration nicht korrekt.

**Lösung**:

1. **Berechtigungsdatei prüfen**:

```bash
cat .claude/settings.local.json
```

2. **Berechtigungen neu generieren**:

```bash
factory continue  # automatische Neu-Generierung
```

Oder manuell ausführen:

```bash
node -e "
const { generateClaudeSettings } = require('./cli/utils/claude-settings');
generateClaudeSettings(process.cwd());
"
```

3. **Beispiel für korrekte Berechtigungskonfiguration**:

```json
{
  \"allowedCommands\": [\"npm\", \"npx\", \"node\", \"git\"],
  \"allowedPaths\": [
    \"/absoluter/pfad/zu/projekt/.factory\",
    \"/absoluter/pfad/zu/projekt/artifacts\",
    \"/absoluter/pfad/zu/projekt/input\",
    \"/absoluter/pfad/zu/projekt/node_modules\"
  ]
}
```

### Problem 17: Netzwerkprobleme führen zu fehlgeschlagener Abhängigkeitsinstallation

**Symptom**:

```bash
Error: Network request failed
npm ERR! code ECONNREFUSED
```

**Ursache**: Netzwerkverbindungsprobleme oder npm-Quelle-Zugriffsfehler.

**Lösung**:

1. **Netzwerkverbindung prüfen**:

```bash
ping registry.npmjs.org
```

2. **npm-Quelle wechseln**:

```bash
# Taobao-Mirror verwenden
npm config set registry https://registry.npmmirror.com

# Verifizieren
npm config get registry
```

3. **Abhängigkeiten neu installieren**:

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Entscheidungsbaum für manuellen Eingriff

```
Phase fehlgeschlagen
    │
    ▼
Ist es der erste Fehler?
    ├─ Ja → Automatische Wiederholung
    │         │
    │         ▼
    │     Wiederholung erfolgreich? → Ja → Prozess fortsetzen
    │            │
    │            Nein → Zweiter Fehler
    │
    └─ Nein → Fehlerursache analysieren
               │
               ▼
           Ist es ein Eingabeproblem?
               ├─ Ja → Eingabedatei bearbeiten
               │         └─ Zurücksetzen zur Upstream-Phase
               │
               └─ Nein → Manuellen Eingriff anfordern
```

**Entscheidungspunkte**:

- **Erster Fehler**: Automatische Wiederholung zulassen, beobachten, ob der Fehler verschwindet
- **Zweiter Fehler**: Automatische Verarbeitung stoppen, manuelle Prüfung erforderlich
- **Eingabeproblem**: `input/idea.md` oder Upstream-Artefakte bearbeiten
- **Technisches Problem**: Abhängigkeiten, Konfiguration oder Code-Logik prüfen
- **Berechtigungsproblem**: Berechtigungsmatrix oder Agent-Verhalten prüfen

---

## Häufige Fehler

### ❌ Häufige Fehler

1. **Upstream-Artefakte direkt bearbeiten**

   Falsche Vorgehensweise: In der PRD-Phase `input/idea.md` bearbeiten
   
   Richtige Vorgehensweise: Zurücksetzen zur Bootstrap-Phase

2. **Checkpoint-Bestätigung ignorieren**

   Falsche Vorgehensweise: Schnell alle Checkpoints überspringen
   
   Richtige Vorgehensweise: Sorgfältig prüfen, ob die Artefakte jeder Phase den Erwartungen entsprechen

3. **Fehlgeschlagene Artefakte manuell löschen**

   Falsche Vorgehensweise: `_failed/` Verzeichnis löschen
   
   Richtige Vorgehensweise: Fehlgeschlagene Artefakte für Vergleichsanalyse aufbewahren

4. **Berechtigungen nach Änderungen nicht neu generieren**

   Falsche Vorgehensweise: Nach Änderung der Projektstruktur `.claude/settings.local.json` nicht aktualisieren
   
   Richtige Vorgehensweise: `factory continue` ausführen, um Berechtigungen automatisch zu aktualisieren

### ✅ Best Practices

1. **Früher Fehler**: Probleme so früh wie möglich erkennen, Verschwendung von Zeit in nachfolgenden Phasen vermeiden

2. **Detaillierte Logs**: Vollständige Fehlerprotokolle aufbewahren, erleichtert die Fehlerdiagnose

3. **Atomare Operationen**: Ausgabe jeder Phase sollte atomar sein, erleichtert Rollback

4. **Beweise aufbewahren**: Fehlgeschlagene Artefakte vor Wiederholung archivieren, erleichtert Vergleichsanalyse

5. **Schrittweise Wiederholung**: Bei Wiederholung konkretere Anweisungen bereitstellen, nicht einfach wiederholen

---

## Zusammenfassung dieses Abschnitts

Dieser Abschnitt deckt verschiedene häufige Probleme bei der Verwendung von AI App Factory ab:

| Kategorie | Anzahl Probleme | Kernlösungsmethode |
| --------- | -------------- | ------------------ |
| Initialisierung | 3 | Verzeichnis bereinigen, KI-Assistent installieren, manuell starten |
| Pipeline-Ausführung | 2 | Projektstruktur bestätigen, Konfigurationsdateien prüfen |
| Phasenfehler | 7 | Wiederholen, Zurücksetzen, nach Reparatur erneut ausführen |
| Berechtigungsbehandlung | 1 | Berechtigungsmatrix prüfen, Dateien verschieben oder Berechtigungen anpassen |
| Ausführung über mehrere Sitzungen | 1 | `factory continue` verwenden, um neue Sitzung zu starten |
| Umgebungsberechtigungen | 3 | Node.js upgraden, Berechtigungen neu generieren, npm-Quelle wechseln |

**Wichtige Punkte**:

- Jede Phase erlaubt **einmalige automatische Wiederholung**
- Nach zwei aufeinanderfolgenden Fehlern ist **manueller Eingriff** erforderlich
- Fehlgeschlagene Artefakte werden automatisch nach `_failed/` archiviert
- Unberechtigte Dateien werden nach `_untrusted/` verschoben
- Verwenden Sie `factory continue`, um Token zu sparen

**Merken Sie**:

Bei Problemen nicht in Panik geraten. Prüfen Sie zuerst das Fehlerprotokoll, dann das entsprechende Artefaktverzeichnis, und beheben Sie die Probleme Schritt für Schritt mit den Lösungen aus diesem Abschnitt. Die meisten Probleme können durch Wiederholen, Zurücksetzen oder Bearbeiten der Eingabedateien gelöst werden.

## Vorschau auf den nächsten Abschnitt

> Im nächsten Abschnitt lernen wir **[Best Practices](../best-practices/)**.
>
> Sie werden lernen:
> - Wie Sie klare Produktbeschreibungen bereitstellen
> - Wie Sie den Checkpoint-Mechanismus nutzen
> - Wie Sie den Projekt-Projectumfang steuern
> - Wie Sie schrittweise iterativ optimieren

**Zusätzliche Lektüre**:

- [Fehlerbehandlung und Rollback](../../advanced/failure-handling/) - Vertiefte Einblicke in Fehlerbehandlungsstrategien
- [Berechtigungen und Sicherheitsmechanismen](../../advanced/security-permissions/) - Verstehen der Capability-Grenzenmatrix
- [Kontextoptimierung](../../advanced/context-optimization/) - Techniken zur Einsparung von Token

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-29

| Funktion | Dateipfad | Zeilennummer |
| -------- | --------- | ------------ |
| Initialisierungsverzeichnisprüfung | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 32-53 |
| KI-Assistent starten | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 119-147 |
| Fehlerstrategiedefinition | [`policies/failure.policy.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/failure.policy.md) | 1-276 |
| Fehlercode-Spezifikation | [`policies/error-codes.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/error-codes.md) | 1-469 |
| Capability-Grenzenmatrix | [`policies/capability.matrix.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/capability.matrix.md) | 1-23 |
| Pipeline-Konfiguration | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | Vollständiger Text |
| Scheduler-Kern | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 1-301 |
| Continue-Befehl | [`cli/commands/continue.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/continue.js) | 1-144 |

**Wichtige Konstanten**:
- Erlaubte Anzahl der Muss-Have-Funktionen: ≤ 7
- Erlaubte Anzahl der UI-Seiten: ≤ 8
- Erlaubte Anzahl der Datenmodelle: ≤ 10
- Wiederholungsanzahl: Jede Phase erlaubt einmalige Wiederholung

**Wichtige Funktionen**:
- `isFactoryProject(dir)` - Prüft, ob es ein Factory-Projekt ist
- `isDirectorySafeToInit(dir)` - Prüft, ob das Verzeichnis initialisiert werden kann
- `generateClaudeSettings(projectDir)` - Generiert Claude Code-Berechtigungskonfiguration
- `factory continue` - Führt Pipeline in neuer Sitzung fort

</details>

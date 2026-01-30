---
title: "Skriptausführung: Ausführung im Skill-Verzeichnis | opencode-agent-skills"
sidebarTitle: "Automatisierungsskripte ausführen"
subtitle: "Skriptausführung: Ausführung im Skill-Verzeichnis"
description: "Meistern Sie die Ausführung von Skill-Skripten. Lernen Sie, Skripte im Skill-Verzeichniskontext auszuführen, Parameter zu übergeben, Fehler zu behandeln und Berechtigungen festzulegen, um die Effizienz durch Automatisierung zu steigern."
tags:
  - "Skriptausführung"
  - "Automatisierung"
  - "Werkzeugnutzung"
prerequisite:
  - "start-installation"
  - "platforms-listing-available-skills"
order: 5
---

# Skill-Skripte ausführen

## Was Sie lernen können

- Verwenden Sie das Tool `run_skill_script`, um ausführbare Skripte im Skill-Verzeichnis auszuführen
- Übergeben Sie Befehlszeilenargumente an Skripte
- Verstehen Sie den Arbeitsverzeichniskontext der Skriptausführung
- Behandeln Sie Skriptausführungsfehler und Exit-Codes
- Meistern Sie Skriptberechtigungseinstellungen und Sicherheitsmechanismen

## Ihr aktuelles Problem

Sie möchten, dass die KI ein Automatisierungsskript eines Skills ausführt, z. B. ein Projekt erstellen, Tests ausführen oder eine Anwendung bereitstellen. Sie sind jedoch unsicher, wie Sie das Skript aufrufen sollen, oder stoßen bei der Ausführung auf Probleme wie Berechtigungsfehler oder fehlende Skripte.

## Wann Sie dies verwenden sollten

- **Automatisierter Build**: Führen Sie `build.sh` oder `build.py` des Skills aus, um das Projekt zu erstellen
- **Testausführung**: Lösen Sie die Testsuite des Skills aus, um einen Coverage-Bericht zu erstellen
- **Bereitstellungsprozess**: Führen Sie das Bereitstellungsskript aus, um die Anwendung in der Produktionsumgebung zu veröffentlichen
- **Datenverarbeitung**: Führen Sie Skripte aus, um Dateien zu verarbeiten und Datenformate zu konvertieren
- **Abhängigkeitsinstallation**: Führen Sie Skripte aus, um die für den Skill erforderlichen Abhängigkeiten zu installieren

## Kernkonzept

Das Tool `run_skill_script` ermöglicht es Ihnen, ausführbare Skripte im Kontext des Skill-Verzeichnisses auszuführen. Die Vorteile sind:

- **Korrekte Ausführungsumgebung**: Skripte werden im Skill-Verzeichnis ausgeführt und können auf die Konfiguration und Ressourcen des Skills zugreifen
- **Automatisierte Workflows**: Skills können eine Reihe von Automatisierungsskripten enthalten, die wiederholte Operationen reduzieren
- **Berechtigungsprüfung**: Es werden nur Dateien mit ausführbaren Berechtigungen ausgeführt, um versehentliche Ausführung von normalen Textdateien zu verhindern
- **Fehlererfassung**: Erfassen der Exit-Codes und Ausgaben von Skripten zur erleichterten Fehlersuche

::: info Skript-Erkennungsregeln
Das Plugin sucht rekursiv im Skill-Verzeichnis nach ausführbaren Dateien (maximale Tiefe von 10 Ebenen):
- **Übersprungene Verzeichnisse**: Versteckte Verzeichnisse (die mit `.` beginnen), `node_modules`, `__pycache__`, `.git`, `.venv` usw.
- **Ausführbarkeitsprüfung**: Nur Dateien mit ausführbaren Berechtigungen (mode & 0o111) werden in die Skriptliste aufgenommen
- **Relative Pfade**: Skriptpfade sind relativ zum Skill-Verzeichnis, z. B. `tools/build.sh`
:::

::: tip Zuerst verfügbare Skripte anzeigen
Bevor Sie ausführen, verwenden Sie `get_available_skills`, um die Skriptliste des Skills anzuzeigen:
```
docker-helper (project)
  Docker-Containerisierung und -Bereitstellungshandbuch [scripts: build.sh, deploy.sh]
```
::

## Lassen Sie es uns zusammen tun

### Schritt 1: Skill-Skript ausführen

Angenommen, Sie haben einen `docker-helper`-Skill, der das Skript `build.sh` enthält:

```
Benutzereingabe:
Führe das build.sh-Skript von docker-helper aus

Systemantwort:
Building Docker image...
Successfully built abc123def456
Tagged as myapp:latest
```

**Was Sie sehen sollten**: Die Ausgabe des Skripts wird in der Antwort angezeigt.

Das Arbeitsverzeichnis bei der Skriptausführung wurde zum Skill-Verzeichnis gewechselt, sodass `build.sh` korrekt auf Ressourcen wie die `Dockerfile` des Skills zugreifen kann.

### Schritt 2: Befehlszeilenargumente übergeben

Viele Skripte unterstützen Parameter, z. B. benötigt `deploy.sh` möglicherweise die Angabe der Umgebung:

```
Benutzereingabe:
Führe deploy.sh von docker-helper aus, Parameter ist production

Systemantwort:
Deploying to production environment...
Uploading image to registry...
Deployment successful: https://myapp.example.com
```

Sie können auch mehrere Parameter übergeben:

```
Benutzereingabe:
Bereitstellung mit deploy.sh, Parameter sind staging und --force

Systemantwort:
Deploying to staging environment (--force mode)...
Skipping validation...
Deployment successful
```

**Was Sie sehen sollten**: Das Skript führt die entsprechenden Operationen aus, nachdem es die Parameter erhalten hat.

### Schritt 3: Skript in verschachtelten Verzeichnissen ausführen

Skripte können in Unterverzeichnissen des Skills liegen, z. B. `tools/setup.sh`:

```
Benutzereingabe:
Führe tools/setup.sh von docker-helper aus

Systemantwort:
Setting up Docker environment...
✓ Docker network created
✓ Volume mounted
✓ Environment configured
```

Relative Pfade sind immer relativ zum Skill-Verzeichnis, egal wie tief das Skript tatsächlich liegt.

**Was Sie sehen sollten**: Skripte in verschachtelten Verzeichnissen werden ebenfalls korrekt ausgeführt.

### Schritt 4: Fehler bei nicht vorhandenem Skill behandeln

Wenn Sie einen falschen Skill-Namen eingeben:

```
Benutzereingabe:
Führe build.sh von docker-asistant aus

Systemantwort:
Skill "docker-asistant" not found. Did you mean "docker-helper"?
```

Das Plugin schlägt auf Basis einer Fuzzy-Matching-Abfrage den korrekten Skill-Namen vor. Sie können zuerst `get_available_skills` aufrufen, um die verfügbaren Skills anzuzeigen.

**Was Sie sehen sollten**: Fehlermeldung und Vorschlag des korrekten Namens.

### Schritt 5: Fehler bei nicht vorhandenem Skript behandeln

Wenn das Skript nicht in der Skriptliste des Skills enthalten ist:

```
Benutzereingabe:
Führe run.sh von docker-helper aus

Systemantwort:
Script "run.sh" not found in skill "docker-helper". Did you mean "build.sh"?
Available scripts: build.sh, deploy.sh
```

Das Plugin listet alle verfügbaren Skripte auf, damit Sie den korrekten Skriptnamen auswählen können.

**Was Sie sehen sollten**: Fehlermeldung und Liste der verfügbaren Skripte.

### Schritt 6: Skriptausführungsfehler verstehen

Wenn die Skriptausführung fehlschlägt (Exit-Code ungleich 0), gibt das Plugin eine Fehlermeldung zurück:

```
Benutzereingabe:
Führe build.sh von docker-helper aus

Systemantwort:
Script failed (exit 1): Dockerfile not found in /path/to/skill
```

Die Fehlermeldung enthält:
- **Exit-Code**: `exit 1` gibt an, dass das Skript mit einem Nicht-Null-Status beendet wurde
- **Fehlerausgabe**: stderr oder stdout des Skripts
- **Fehlerursache**: Die spezifische Fehlermeldung des Skripts

**Was Sie sehen sollten**: Detaillierte Fehlerinformationen helfen Ihnen, das Problem zu lokalisieren.

## Kontrollpunkte ✅

- [ ] Können Sie ausführbare Skripte im Skill-Verzeichnis ausführen?
- [ ] Können Sie Befehlszeilenargumente an Skripte übergeben?
- [ ] Verstehen Sie den Arbeitsverzeichniskontext der Skriptausführung?
- [ ] Können Sie Skriptausführungsfehler erkennen und behandeln?
- [ ] Wissen Sie, wie Sie die Berechtigungseinstellungen eines Skripts überprüfen?

## Warnung vor häufigen Fehlern

### Falle 1: Skript hat keine ausführbaren Berechtigungen

Wenn Sie ein neues Skript erstellen, aber vergessen, ausführbare Berechtigungen zu setzen, wird es nicht in der Skriptliste angezeigt.

**Fehlerverhalten**:
```
Available scripts: build.sh  # Ihr neues Skript new-script.sh ist nicht in der Liste
```

**Ursache**: Die Datei hat keine ausführbaren Berechtigungen (mode & 0o111 ist false).

**Lösung**: Setzen Sie im Terminal die ausführbaren Berechtigungen:
```bash
chmod +x .opencode/skills/my-skill/new-script.sh
```

**Überprüfung**: Rufen Sie erneut `get_available_skills` auf, um die Skriptliste anzuzeigen.

### Falle 2: Falscher Skriptpfad

Der Skriptpfad muss ein relativer Pfad zum Skill-Verzeichnis sein; absolute Pfade oder Verweise auf übergeordnete Verzeichnisse dürfen nicht verwendet werden.

**Fehlerbeispiel**:

```bash
# ❌ Falsch: Verwendung eines absoluten Pfads
Führe /path/to/skill/build.sh von docker-helper aus

# ❌ Falsch: Versuch, auf ein übergeordnetes Verzeichnis zuzugreifen (obwohl es die Sicherheitsprüfung besteht, ist der Pfad falsch)
Führe ../build.sh von docker-helper aus
```

**Korrektes Beispiel**:

```bash
# ✅ Korrekt: Verwendung eines relativen Pfads
Führe build.sh von docker-helper aus
Führe tools/deploy.sh von docker-helper aus
```

**Ursache**: Das Plugin überprüft die Pfadsicherheit, um Directory-Traversal-Angriffe zu verhindern, und der relative Pfad basiert auf dem Skill-Verzeichnis.

### Falle 3: Skript hängt vom Arbeitsverzeichnis ab

Wenn ein Skript davon ausgeht, dass das aktuelle Verzeichnis das Projektstammverzeichnis und nicht das Skill-Verzeichnis ist, kann die Ausführung fehlschlagen.

**Fehlerbeispiel**:
```bash
# build.sh im Skill-Verzeichnis
#!/bin/bash
# ❌ Falsch: Annahme, dass das aktuelle Verzeichnis das Projektstammverzeichnis ist
docker build -t myapp .
```

**Problem**: Bei der Ausführung ist das aktuelle Verzeichnis das Skill-Verzeichnis (`.opencode/skills/docker-helper`), nicht das Projektstammverzeichnis.

**Lösung**: Das Skript sollte absolute Pfade verwenden oder das Projektstammverzeichnis dynamisch ermitteln:
```bash
# ✅ Korrekt: Verwendung eines relativen Pfads zum Projektstammverzeichnis
docker build -t myapp ../../..

# Oder: Verwendung von Umgebungsvariablen oder Konfigurationsdateien
PROJECT_ROOT="${SKILL_DIR}/../../.."
docker build -t myapp "$PROJECT_ROOT"
```

**Hinweis**: Im Skill-Verzeichnis befinden sich möglicherweise nicht die `Dockerfile` des Projekts, sodass das Skript die Ressourcendateien selbst lokalisieren muss.

### Falle 4: Skriptausgabe zu lang

Wenn ein Skript viele Protokollinformationen ausgibt (z. B. den Download-Fortschritt von npm install), kann die Antwort sehr lang werden.

**Verhalten**:

```bash
Systemantwort:
npm WARN deprecated package...
npm notice created a lockfile...
added 500 packages in 2m
# Möglicherweise Hunderte von Zeilen Ausgabe
```

**Empfehlung**: Skripte sollten die Ausgabe vereinfachen und nur wichtige Informationen anzeigen:

```bash
#!/bin/bash
echo "Installing dependencies..."
npm install --silent
echo "✓ Dependencies installed (500 packages)"
```

## Zusammenfassung dieser Lektion

Das Tool `run_skill_script` ermöglicht es Ihnen, ausführbare Skripte im Kontext des Skill-Verzeichnisses auszuführen und unterstützt:

- **Parameterübergabe**: Übergeben von Befehlszeilenargumenten durch das `arguments`-Array
- **Arbeitsverzeichniswechsel**: Bei der Skriptausführung wird das CWD zum Skill-Verzeichnis gewechselt
- **Fehlerbehandlung**: Erfassen von Exit-Codes und Fehlerausgaben zur erleichterten Fehlersuche
- **Berechtigungsprüfung**: Ausführen nur von Dateien mit ausführbaren Berechtigungen
- **Pfadsicherheit**: Überprüfung der Skriptpfade, um Directory-Traversal zu verhindern

Regeln zur Skript-Erkennung:
- Rekursive Überprüfung des Skill-Verzeichnisses, maximale Tiefe von 10 Ebenen
- Überspringen von versteckten Verzeichnissen und häufigen Abhängigkeitsverzeichnissen
- Nur Einbeziehung von Dateien mit ausführbaren Berechtigungen
- Pfade sind relativ zum Skill-Verzeichnis

**Best Practices**:
- Skriptausgabe sollte präzise sein und nur wichtige Informationen anzeigen
- Skripte sollten nicht davon ausgehen, dass das aktuelle Verzeichnis das Projektstammverzeichnis ist
- Verwenden Sie `chmod +x`, um ausführbare Berechtigungen für neue Skripte zu setzen
- Verwenden Sie zuerst `get_available_skills`, um verfügbare Skripte anzuzeigen

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Skill-Dateien lesen](../reading-skill-files/)**.
>
> Sie werden lernen:
> - Verwendung des read_skill_file-Tools, um auf Dokumentation und Konfigurationen von Skills zuzugreifen
> - Verständnis des Pfadsicherheitsüberprüfungsmechanismus, um Directory-Traversal-Angriffe zu verhindern
> - Meistern Sie das Format des Dateilessens und der XML-Injektion
> - Lernen Sie, Support-Dateien (Dokumentation, Beispiele, Konfigurationen usw.) in Skills zu organisieren

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-24

| Funktion        | Dateipfad                                                                                    | Zeilennummer    |
|--- | --- | ---|
| RunSkillScript-Tool-Definition | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L137-L198) | 137-198 |
| findScripts-Funktion | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L59-L99) | 59-99   |

**Wichtige Typen**:
- `Script = { relativePath: string; absolutePath: string }`: Skript-Metadaten, die relativen Pfad und absoluten Pfad enthalten

**Wichtige Konstanten**:
- Maximale Rekursionstiefe: `10` (`skills.ts:64`) - Begrenzung der Skript-Suchtiefe
- Liste der übersprungenen Verzeichnisse: `['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']` (`skills.ts:61`)
- Ausführbare Berechtigungen-Maske: `0o111` (`skills.ts:86`) - Prüft, ob die Datei ausführbar ist

**Wichtige Funktionen**:
- `RunSkillScript(skill: string, script: string, arguments?: string[])`: Führt ein Skill-Skript aus, unterstützt Parameterübergabe und Arbeitsverzeichniswechsel
- `findScripts(skillPath: string)`: Sucht rekursiv nach ausführbaren Dateien im Skill-Verzeichnis, gibt sie sortiert nach relativen Pfaden zurück

**Geschäftsregeln**:
- Bei der Skriptausführung wird das Arbeitsverzeichnis zum Skill-Verzeichnis gewechselt (`tools.ts:180`): `$.cwd(skill.path)`
- Es werden nur Skripte ausgeführt, die in der Skriptliste des Skills enthalten sind (`tools.ts:165-177`)
- Wenn das Skript nicht existiert, wird die Liste der verfügbaren Skripte zurückgegeben, Fuzzy-Matching-Vorschläge werden unterstützt (`tools.ts:168-176`)
- Bei Fehlschlag der Ausführung werden Exit-Code und Fehlerausgabe zurückgegeben (`tools.ts:184-195`)
- Versteckte Verzeichnisse (die mit `.` beginnen) und häufige Abhängigkeitsverzeichnisse werden übersprungen (`skills.ts:70-71`)

</details>

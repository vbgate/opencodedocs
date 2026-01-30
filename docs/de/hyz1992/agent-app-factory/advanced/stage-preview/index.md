---
title: "Preview-Phase: Automatische Generierung von Bereitstellungsleitfäden und Betriebsanweisungen | Agent App Factory Tutorial"
sidebarTitle: "Bereitstellungsleitfaden generieren"
subtitle: "Bereitstellungsleitfaden generieren: Vollständiger Leitfaden zur Preview-Phase"
description: "Lernen Sie, wie die AI App Factory Preview-Phase automatisch Betriebsanweisungen und Bereitstellungskonfigurationen für generierte Apps erstellt, einschließlich lokalem Start, Docker-Containerisierung, Expo EAS-Builds, CI/CD-Pipelines und Demo-Prozessdesign."
tags:
  - "Bereitstellungsleitfaden"
  - "Docker"
  - "CI/CD"
prerequisite:
  - "advanced-stage-validation"
order: 140
---

# Bereitstellungsleitfaden generieren: Vollständiger Leitfaden zur Preview-Phase

## Was Sie nach diesem Kurs können

Nach Abschluss dieser Lektion werden Sie in der Lage sein:

- Zu verstehen, wie der Preview Agent Betriebsanweisungen für generierte Apps erstellt
- Die Generierungsmethoden für Docker-Bereitstellungskonfigurationen zu beherrschen
- Die Funktionsweise von Expo EAS-Build-Konfigurationen zu verstehen
- Kurze Demo-Workflows für MVPs zu entwerfen
- Best Practices für CI/CD- und Git Hooks-Konfigurationen zu verstehen

## Ihre aktuelle Herausforderung

Der Code wurde generiert und validiert. Sie möchten das MVP schnell Ihrem Team oder Kunden präsentieren, wissen aber nicht:

- Was für eine Betriebsdokumentation sollte geschrieben werden?
- Wie können andere die Anwendung schnell starten und betreiben?
- Welche Funktionen sollten bei der Demo gezeigt werden? Welche Fallstricke sollten vermieden werden?
- Wie sollte die Produktionsumgebung bereitgestellt werden? Docker oder Cloud-Plattform?
- Wie wird kontinuierliche Integration und Code-Quality-Gates eingerichtet?

Die Preview-Phase ist genau dafür da – sie generiert automatisch vollständige Betriebsanweisungen und Bereitstellungskonfigurationen.

## Wann diese Phase verwenden

Die Preview-Phase ist die 7. und letzte Phase der Pipeline, direkt nach der Validation-Phase.

**Typische Anwendungsszenarien**:

| Szenario | Beschreibung |
| ---- | ---- |
| MVP-Demo | Anwendung dem Team oder Kunden präsentieren, detaillierte Betriebsanweisungen benötigt |
| Team-Zusammenarbeit | Neue Mitglieder treten dem Projekt bei, schnelle Einarbeitung in die Entwicklungsumgebung erforderlich |
| Produktionsbereitstellung | Anwendung soll in Produktion gehen, Docker-Konfiguration und CI/CD-Pipeline benötigt |
| Mobile App-Veröffentlichung | Expo EAS konfigurieren, Vorbereitung für App Store und Google Play |

**Nicht anwendbare Szenarien**:

- Nur Code ansehen, nicht ausführen (Preview-Phase ist trotzdem erforderlich)
- Code hat Validation-Phase nicht bestanden (zuerst Probleme beheben, dann Preview ausführen)

## Vorbereitungen vor dem Start

::: warning Voraussetzungen

Diese Lektion setzt voraus, dass Sie:

1. **Validation-Phase abgeschlossen haben**: `artifacts/validation/report.md` muss existieren und die Validierung bestanden haben
2. **Anwendungsarchitektur verstehen**: Klarheit über Backend- und Frontend-Technologiestack, Datenmodell und API-Endpunkte
3. **Grundkonzepte kennen**: Grundverständnis von Docker, CI/CD, Git Hooks

:::

**Erforderliche Konzepte**:

::: info Was ist Docker?

Docker ist eine Containerisierungsplattform, die Anwendungen und ihre Abhängigkeiten in einem portablen Container paketieren kann.

**Kernvorteile**:

- **Umgebungskonsistenz**: Entwicklungs-, Test- und Produktionsumgebungen sind identisch, vermeidet "Auf meinem Rechner läuft es"
- **Schnelle Bereitstellung**: Mit einem Befehl kann der gesamte Anwendungsstack gestartet werden
- **Ressourcenisolierung**: Container beeinflussen sich nicht gegenseitig, erhöht die Sicherheit

**Grundkonzepte**:

```
Dockerfile → Image → Container
```

:::

::: info Was ist CI/CD?

CI/CD (Continuous Integration/Continuous Deployment) ist eine automatisierte Softwareentwicklungspraxis.

**CI (Continuous Integration)**:
- Tests und Checks werden bei jedem Commit automatisch ausgeführt
- Code-Probleme werden frühzeitig erkannt
- Code-Qualität wird verbessert

**CD (Continuous Deployment)**:
- Automatischer Build und Deployment der Anwendung
- Neue Features werden schnell in Produktion gebracht
- Manuelle Fehler werden reduziert

**GitHub Actions** ist die CI/CD-Plattform von GitHub. Automatisierungsworkflows werden durch Konfiguration von `.github/workflows/*.yml` Dateien definiert.

:::

::: info Was sind Git Hooks?

Git Hooks sind Skripte, die zu bestimmten Zeitpunkten bei Git-Operationen automatisch ausgeführt werden.

**Häufig verwendete Hooks**:

- **pre-commit**: Vor dem Commit Code-Checks und Formatierung ausführen
- **commit-msg**: Commit-Message-Format validieren
- **pre-push**: Vor dem Push vollständige Tests ausführen

**Husky** ist ein beliebtes Tool zur Verwaltung von Git Hooks, das die Konfiguration und Wartung von Hooks vereinfacht.

:::

## Kerngedanken

Die Preview-Phase hat als Kernaufgabe, **vollständige Nutzungs- und Bereitstellungsdokumentation für die Anwendung vorzubereiten**, dabei folgt sie dem Prinzip "Lokal zuerst, transparente Risiken".

### Denkrahmen

Der Preview Agent folgt diesem Denkrahmen:

| Prinzip | Beschreibung |
| ---- | ---- |
| **Lokal zuerst** | Sicherstellen, dass jeder mit grundlegenden Entwicklungswerkzeugen lokal starten kann |
| **Bereitstellungsbereit** | Alle Konfigurationsdateien für die Produktionsbereitstellung bereitstellen |
| **User Story** | Kurze Demo-Workflows entwerfen, die den Kernwert zeigen |
| **Transparente Risiken** | Aktiv Einschränkungen oder bekannte Probleme der aktuellen Version auflisten |

### Ausgabedateistruktur

Der Preview Agent generiert zwei Arten von Dateien:

**Erforderliche Dateien** (jedes Projekt benötigt diese):

| Datei | Beschreibung | Position |
| ---- | ---- | ---- |
| `README.md` | Haupt-Betriebsdokumentation | `artifacts/preview/README.md` |
| `Dockerfile` | Backend Docker-Konfiguration | `artifacts/backend/Dockerfile` |
| `docker-compose.yml` | Docker Compose für Entwicklungsumgebung | `artifacts/backend/docker-compose.yml` |
| `.env.production.example` | Vorlage für Produktionsumgebungsvariablen | `artifacts/backend/.env.production.example` |
| `eas.json` | Expo EAS Build-Konfiguration | `artifacts/client/eas.json` |

**Empfohlene Dateien** (für Produktionsumgebung empfohlen):

| Datei | Beschreibung | Position |
| ---- | ---- | ---- |
| `DEPLOYMENT.md` | Detaillierter Bereitstellungsleitfaden | `artifacts/preview/DEPLOYMENT.md` |
| `docker-compose.production.yml` | Docker Compose für Produktionsumgebung | Projekt-Root-Verzeichnis |

### README-Dokumentstruktur

Die `artifacts/preview/README.md` muss folgende Kapitel enthalten:

```markdown
# [Projektname]

## Schnellstart

### Umgebungsanforderungen
- Node.js >= 18
- npm >= 9
- [Weitere Abhängigkeiten]

### Backend-Start
[Abhängigkeiten installieren, Umgebung konfigurieren, Datenbank initialisieren, Service starten]

### Frontend-Start
[Abhängigkeiten installieren, Umgebung konfigurieren, Entwicklungsserver starten]

### Installation verifizieren
[Testbefehle, Health-Check]

---

## Demo-Workflow

### Vorbereitungen
### Demo-Schritte
### Demo-Hinweise

---

## Bekannte Probleme und Einschränkungen

### Funktionseinschränkungen
### Technische Schulden
### Zu vermeidende Aktionen während der Demo

---

## Häufig gestellte Fragen
```

## Arbeitsablauf des Preview Agent

Der Preview Agent ist ein KI-Agent, der für die Erstellung von Betriebsanweisungen und Bereitstellungskonfigurationen für generierte Anwendungen verantwortlich ist. Sein Arbeitsablauf ist wie folgt:

### Eingabedateien

Der Preview Agent kann nur folgende Dateien lesen:

| Datei | Beschreibung | Position |
| ---- | ---- | ---- |
| Backend-Code | Validierter Backend-Anwendungscode | `artifacts/backend/` |
| Frontend-Code | Validierter Frontend-Anwendungscode | `artifacts/client/` |

### Ausgabedateien

Der Preview Agent muss folgende Dateien generieren:

| Datei | Beschreibung | Position |
| ---- | ---- | ---- |
| `README.md` | Haupt-Betriebsdokumentation | `artifacts/preview/README.md` |
| `Dockerfile` | Backend Docker-Konfiguration | `artifacts/backend/Dockerfile` |
| `docker-compose.yml` | Docker Compose für Entwicklungsumgebung | `artifacts/backend/docker-compose.yml` |
| `.env.production.example` | Vorlage für Produktionsumgebungsvariablen | `artifacts/backend/.env.production.example` |
| `eas.json` | Expo EAS Build-Konfiguration | `artifacts/client/eas.json` |

### Ausführungsschritte

1. **Code durchsuchen**: Backend- und Frontend-Verzeichnisse analysieren, Installationsbefehle und Startbefehle bestimmen
2. **README schreiben**: Gemäß den Anweisungen in `skills/preview/skill.md` klare Installations- und Betriebsanweisungen erstellen
3. **Docker-Konfiguration generieren**: Dockerfile und docker-compose.yml erstellen
4. **EAS konfigurieren**: Expo EAS Build-Konfiguration generieren (Mobile Apps)
5. **Demo-Workflow vorbereiten**: Kurze Demo-Szenarien entwerfen
6. **Bekannte Probleme auflisten**: Aktiv Defekte oder Einschränkungen der aktuellen Version auflisten

## Schritt für Schritt: Preview-Phase ausführen

### Schritt 1: Validation-Phase abgeschlossen bestätigen

**Warum**

Der Preview Agent muss `artifacts/backend/` und `artifacts/client/` lesen. Wenn der Code nicht validiert wurde, sind die vom Preview Agent generierten Dokumente möglicherweise ungenau.

**Aktion**

```bash
# Validierungsbericht prüfen
cat artifacts/validation/report.md
```

**Sie sollten sehen**: Der Validierungsbericht zeigt, dass alle Backend- und Frontend-Prüfungen bestanden wurden.

```
✅ Backend Dependencies: OK
✅ Backend Type Check: OK
✅ Prisma Schema: OK
✅ Frontend Dependencies: OK
✅ Frontend Type Check: OK
```

### Schritt 2: Preview-Phase ausführen

**Warum**

Verwenden Sie den KI-Assistenten, um den Preview Agent auszuführen und automatisch Betriebsanweisungen und Bereitstellungskonfigurationen zu generieren.

**Aktion**

```bash
# Preview-Phase mit Claude Code ausführen
factory run preview
```

**Sie sollten sehen**:

```
✓ Aktuelle Phase: preview
✓ Backend-Code laden: artifacts/backend/
✓ Frontend-Code laden: artifacts/client/
✓ Preview Agent starten

Preview Agent generiert Betriebsanweisungen und Bereitstellungskonfigurationen...

[KI-Assistent führt folgende Aktionen aus]
1. Projektstruktur von Backend und Frontend analysieren
2. README.md generieren (Installation, Betrieb, Demo-Workflow)
3. Dockerfile und docker-compose.yml erstellen
4. Expo EAS Build-Datei konfigurieren
5. Produktionsumgebungsvariablen-Vorlage vorbereiten
6. Bekannte Probleme und Einschränkungen auflisten

Warten auf Agent-Abschluss...
```

### Schritt 3: Generiertes README anzeigen

**Warum**

Überprüfen, ob das README vollständig ist und ob Installationsschritte sowie Betriebsbefehle klar sind.

**Aktion**

```bash
# Betriebsanweisungen anzeigen
cat artifacts/preview/README.md
```

**Sie sollten sehen**: Eine vollständige Betriebsanweisung mit folgenden Kapiteln

```markdown
# KI Restaurant-Empfehlungsassistent

## Schnellstart

### Umgebungsanforderungen

- Node.js >= 18
- npm >= 9
- Docker (optional, für containerisierte Bereitstellung)

### Backend-Start

```bash
# In Backend-Verzeichnis wechseln
cd artifacts/backend

# Abhängigkeiten installieren
npm install

# Umgebungsvariablen konfigurieren
cp .env.example .env
# .env bearbeiten und notwendige Konfiguration eintragen

# Datenbank initialisieren
npx prisma migrate dev

# (Optional) Seed-Daten einfügen
npm run db:seed

# Entwicklungsserver starten
npm run dev
```

Backend läuft unter: http://localhost:3000
Health-Check: http://localhost:3000/health
API-Dokumentation: http://localhost:3000/api-docs

### Frontend-Start

```bash
# In Frontend-Verzeichnis wechseln
cd artifacts/client

# Abhängigkeiten installieren
npm install

# Umgebungsvariablen konfigurieren
cp .env.example .env
# API_URL auf Backend-Adresse zeigen lassen

# Entwicklungsserver starten
npm start
```

- iOS-Simulator: `i` drücken
- Android-Simulator: `a` drücken
- Webbrowser: `w` drücken

### Installation verifizieren

Führen Sie folgende Befehle aus, um die Installation zu verifizieren:

```bash
# Backend-Tests
cd artifacts/backend && npm test

# Frontend-Tests
cd artifacts/client && npm test

# API Health-Check
curl http://localhost:3000/health
```

---

## Demo-Workflow

### Vorbereitungen

1. Stellen Sie sicher, dass Backend und Frontend gestartet sind
2. Demo-Daten leeren oder zurücksetzen (optional)

### Demo-Schritte

1. **Szenario-Introduktion** (30 Sekunden)
   - Zielbenutzer vorstellen: Benutzer, die neue Restaurants ausprobieren möchten
   - Kernproblem vorstellen: Auswahlqual, weiß nicht was gegessen werden soll

2. **Funktionsdemo** (3-5 Minuten)
   - Schritt 1: Benutzer gibt Präferenzen ein (Küche, Geschmack, Budget)
   - Schritt 2: KI empfiehlt Restaurants basierend auf Präferenzen
   - Schritt 3: Benutzer sieht Empfehlungsergebnisse und wählt aus

3. **Technische Highlights** (optional, 1 Minute)
   - Echtzeit-KI-Empfehlung (OpenAI API-Aufruf)
   - Mobile responsive Design
   - Lokale Datenbankpersistenz

### Demo-Hinweise

- Stellen Sie sicher, dass die Netzwerkverbindung normal ist (KI-Empfehlung erfordert API-Aufruf)
- Vermeiden Sie zu lange oder vage Präferenzen (könnten zu ungenauen Empfehlungen führen)
- Ändern Sie während der Demo nicht die Datenbank (könnte Demo-Effekt beeinträchtigen)

---

## Bekannte Probleme und Einschränkungen

### Funktionseinschränkungen

- [ ] Benutzerregistrierung und -anmeldung noch nicht unterstützt
- [ ] Favoriten und Verlauf noch nicht unterstützt
- [ ] KI-Empfehlung unterstützt nur Texteingabe, noch keine Sprache oder Bilder

### Technische Schulden

- [ ] Frontend-Fehlerbehandlung nicht ausreichend optimiert
- [ ] Backend-Logging erfordert Optimierung
- [ ] Datenbankindizes nicht optimiert (bei kleinen Datenmengen kein Einfluss)

### Bei Demo zu vermeidende Aktionen

- Versuchen, ein Konto zu registrieren oder anzumelden - könnte Demo unterbrechen
- Sonderzeichen oder extrem lange Texte eingeben - könnte Fehler auslösen
- Schnell aufeinanderfolgende Anfragen senden - könnte API-Rate-Limiting auslösen

---

## Häufig gestellte Fragen

### F: Was tun, wenn der Port belegt ist?

A: Ändern Sie die `PORT`-Variable in `.env` oder beenden Sie zuerst den Prozess, der den Port belegt.

### F: Was tun bei Datenbankverbindungsfehlern?

A: Überprüfen Sie, ob die `DATABASE_URL`-Konfiguration in `.env` korrekt ist, und stellen Sie sicher, dass die Datenbank läuft.

### F: Was tun, wenn die KI-Empfehlung nicht reagiert?

A: Überprüfen Sie, ob der `OPENAI_API_KEY` in `.env` gültig ist und ob die Netzwerkverbindung normal ist.
```

### Schritt 4: Generierte Docker-Konfiguration anzeigen

**Warum**

Überprüfen, ob die Docker-Konfiguration korrekt ist, um sicherzustellen, dass Container problemlos gebaut und ausgeführt werden können.

**Aktion**

```bash
# Dockerfile anzeigen
cat artifacts/backend/Dockerfile

# docker-compose.yml anzeigen
cat artifacts/backend/docker-compose.yml
```

**Sie sollten sehen**: Docker-Konfigurationsdateien, die Docker-Best-Practices folgen

**Dockerfile-Beispiel**:

```dockerfile
# Basis-Image
FROM node:20-alpine AS builder

WORKDIR /app

# Abhängigkeitsdateien kopieren
COPY package*.json ./
COPY prisma ./prisma/

# Abhängigkeiten installieren
RUN npm ci --only=production

# Prisma Client generieren
RUN npx prisma generate

# Quellcode kopieren
COPY . .

# Build durchführen
RUN npm run build

# Produktions-Image
FROM node:20-alpine AS production

WORKDIR /app

# Produktionsabhängigkeiten installieren
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

# Port freigeben
EXPOSE 3000

# Health-Check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Startbefehl
CMD ["npm", "start"]
```

**docker-compose.yml-Beispiel**:

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=file:./dev.db
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3
```

### Schritt 5: EAS-Konfiguration anzeigen

**Warum**

Überprüfen, ob die Expo EAS-Konfiguration korrekt ist, um sicherzustellen, dass Mobile Apps problemlos gebaut und veröffentlicht werden können.

**Aktion**

```bash
# EAS-Konfiguration anzeigen
cat artifacts/client/eas.json
```

**Sie sollten sehen**: Konfiguration mit drei Umgebungen (development, preview, production)

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_API_URL": "http://localhost:3000"
      }
    },
    "preview": {
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_API_URL": "https://api-staging.your-domain.com"
      }
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://api.your-domain.com"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Schritt 6: Exit-Bedingungen verifizieren

**Warum**

Sisyphus verifiziert, ob der Preview Agent die Exit-Bedingungen erfüllt. Wenn nicht, wird eine erneute Ausführung angefordert.

**Prüfliste**

| Prüfpunkt | Beschreibung | Bestanden/Fehlgeschlagen |
| ---- | ---- | ---- |
| README enthält Installationsschritte | Klare Auflistung der Installationsbefehle für Backend und Frontend | [ ] |
| README enthält Betriebsbefehle | Befehle zum Starten von Backend und Frontend separat bereitgestellt | [ ] |
| README listet Zugriffsadressen und Demo-Workflow auf | Demo-Zugriffsadressen und Ports erklärt | [ ] |
| Docker-Konfiguration kann erfolgreich gebaut werden | Dockerfile und docker-compose.yml ohne Syntaxfehler | [ ] |
| Produktionsumgebungsvariablen-Vorlage vollständig | .env.production.example enthält alle erforderlichen Konfigurationen | [ ] |

**Bei Fehlschlag**:

```bash
# Preview-Phase erneut ausführen
factory run preview
```

## Prüfpunkte ✅

**Bestätigen Sie, dass Sie folgendes abgeschlossen haben**:

- [ ] Preview-Phase erfolgreich ausgeführt
- [ ] `artifacts/preview/README.md` Datei existiert und Inhalt ist vollständig
- [ ] `artifacts/backend/Dockerfile` Datei existiert und kann gebaut werden
- [ ] `artifacts/backend/docker-compose.yml` Datei existiert
- [ ] `artifacts/backend/.env.production.example` Datei existiert
- [ ] `artifacts/client/eas.json` Datei existiert (Mobile App)
- [ ] README enthält klare Installationsschritte und Betriebsbefehle
- [ ] README enthält Demo-Workflow und bekannte Probleme

## Fallstricke

### ⚠️ Falle 1: Abhängigkeitsinstallationsschritte ignorieren

**Problem**: Im README steht nur "Service starten", ohne zu erklären, wie Abhängigkeiten installiert werden.

**Symptom**: Neue Mitglieder folgen dem README, führen `npm run dev` aus und erhalten den Fehler "Modul nicht gefunden".

**Lösung**: Der Preview Agent zwingt "README muss Installationsschritte enthalten", stellt sicher, dass jeder Schritt klare Befehle hat.

**Korrektes Beispiel**:

```bash
# ❌ Falsch - Installationsschritte fehlen
npm run dev

# ✅ Richtig - Vollständige Schritte enthalten
npm install
npm run dev
```

### ⚠️ Falle 2: Docker-Konfiguration verwendet latest-Tag

**Problem**: Im Dockerfile wird `FROM node:latest` oder `FROM node:alpine` verwendet.

**Symptom**: Bei jedem Build wird möglicherweise eine andere Node.js-Version verwendet, was zu inkonsistenten Umgebungen führt.

**Lösung**: Der Preview Agent zwingt "NIEMALS latest als Docker-Image-Tag verwenden, stattdessen konkrete Versionsnummern verwenden".

**Korrektes Beispiel**:

```dockerfile
# ❌ Falsch - latest verwenden
FROM node:latest

# ❌ Falsch - Keine konkrete Version angegeben
FROM node:alpine

# ✅ Richtig - Konkrete Version verwenden
FROM node:20-alpine
```

### ⚠️ Falle 3: Umgebungsvariablen hartcodieren

**Problem**: In Docker-Konfiguration oder EAS-Konfiguration werden sensible Informationen (Passwörter, API Keys usw.) hartcodiert.

**Symptom**: Sensible Informationen gelangen in das Code-Repository, was Sicherheitsrisiken birgt.

**Lösung**: Der Preview Agent zwingt "NIEMALS sensible Informationen in Bereitstellungskonfigurationen hartcodieren", stattdessen Umgebungsvariablen-Vorlagen verwenden.

**Korrektes Beispiel**:

```yaml
# ❌ Falsch - Datenbankpasswort hartcodieren
DATABASE_URL=postgresql://user:password123@host:5432/database

# ✅ Richtig - Umgebungsvariablen verwenden
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_NAME}
```

### ⚠️ Falle 4: Bekannte Probleme nicht auflisten

**Problem**: Im README werden keine bekannten Probleme und Einschränkungen aufgelistet, Produktfähigkeiten werden übertrieben.

**Symptom**: Während der Demo treten unerwartete Probleme auf, was zu Peinlichkeit und Vertrauensverlust führt.

**Lösung**: Der Preview Agent zwingt "NIEMALS Funktionen übertreiben oder Defekte verbergen", aktiv Probleme der aktuellen Version auflisten.

**Korrektes Beispiel**:

```markdown
## Bekannte Probleme und Einschränkungen

### Funktionseinschränkungen
- [ ] Benutzerregistrierung und -anmeldung noch nicht unterstützt
- [ ] KI-Empfehlung möglicherweise ungenau (abhängig von OpenAI API-Antwort)
```

### ⚠️ Falle 5: Demo-Workflow zu komplex

**Problem**: Der Demo-Workflow enthält 10+ Schritte und dauert über 10 Minuten.

**Symptom**: Der Demo-Moderator kann sich die Schritte nicht merken, das Publikum verliert die Geduld.

**Lösung**: Der Preview Agent zwingt "Demo-Workflow sollte 3-5 Minuten dauern, nicht mehr als 5 Schritte".

**Korrektes Beispiel**:

```markdown
### Demo-Schritte

1. **Szenario-Introduktion** (30 Sekunden)
   - Zielbenutzer und Kernproblem vorstellen

2. **Funktionsdemo** (3-5 Minuten)
   - Schritt 1: Benutzer gibt Präferenzen ein
   - Schritt 2: KI empfiehlt basierend auf Präferenzen
   - Schritt 3: Benutzer sieht Ergebnisse

3. **Technische Highlights** (optional, 1 Minute)
   - Echtzeit-KI-Empfehlung
   - Mobile responsive Design
```

## CI/CD-Konfigurationsvorlagen

Der Preview Agent kann auf `templates/cicd-github-actions.md` verweisen, um CI/CD-Konfigurationen zu generieren, einschließlich:

### Backend CI-Pipeline

```yaml
name: Backend CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'backend/**'
      - '.github/workflows/backend-ci.yml'
  pull_request:
    branches: [main, develop]
    paths:
      - 'backend/**'

jobs:
  test:
    name: Test & Lint
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        working-directory: backend
        run: npm ci

      - name: Run linter
        working-directory: backend
        run: npm run lint

      - name: Run type check
        working-directory: backend
        run: npx tsc --noEmit

      - name: Validate Prisma schema
        working-directory: backend
        run: npx prisma validate

      - name: Generate Prisma Client
        working-directory: backend
        run: npx prisma generate

      - name: Run tests
        working-directory: backend
        run: npm test
```

### Frontend CI-Pipeline

```yaml
name: Frontend CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'client/**'
      - '.github/workflows/frontend-ci.yml'
  pull_request:
    branches: [main, develop]
    paths:
      - 'client/**'

jobs:
  test:
    name: Test & Lint
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'
          cache-dependency-path: client/package-lock.json

      - name: Install dependencies
        working-directory: client
        run: npm ci

      - name: Run linter
        working-directory: client
        run: npm run lint

      - name: Run type check
        working-directory: client
        run: npx tsc --noEmit

      - name: Run tests
        working-directory: client
        run: npm test -- --coverage
```

## Git Hooks-Konfigurationsvorlagen

Der Preview Agent kann auf `templates/git-hooks-husky.md` verweisen, um Git Hooks-Konfigurationen zu generieren, einschließlich:

### pre-commit Hook

Führt vor dem Commit Code-Checks und Formatierung aus.

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Pre-commit-Checks werden ausgeführt..."

# lint-staged ausführen
npx lint-staged

# TypeScript-Typen prüfen
echo "📝 Typenprüfung läuft..."
npm run type-check

echo "✅ Pre-commit-Checks bestanden!"
```

### commit-msg Hook

Validiert das Format der Commit-Nachricht.

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "📋 Commit-Nachricht wird validiert..."

npx --no -- commitlint --edit "$1"

echo "✅ Commit-Nachricht ist gültig!"
```

## Zusammenfassung dieser Lektion

Die Preview-Phase ist die letzte Phase der Pipeline und ist dafür verantwortlich, vollständige Nutzungs- und Bereitstellungsdokumentation für die generierte Anwendung vorzubereiten. Sie generiert automatisch:

- **Betriebsanweisungen**: Klare Installationsschritte, Startbefehle und Demo-Workflows
- **Docker-Konfiguration**: Dockerfile und docker-compose.yml für containerisierte Bereitstellung
- **EAS-Konfiguration**: Expo EAS Build-Konfiguration für Mobile App-Veröffentlichungen
- **CI/CD-Konfiguration**: GitHub Actions-Pipelines für kontinuierliche Integration und Bereitstellung
- **Git Hooks**: Husky-Konfiguration für Pre-Commit-Checks

**Kernprinzipien**:

1. **Lokal zuerst**: Sicherstellen, dass jeder mit grundlegenden Entwicklungswerkzeugen lokal starten kann
2. **Bereitstellungsbereit**: Alle Konfigurationsdateien für die Produktionsbereitstellung bereitstellen
3. **User Story**: Kurze Demo-Workflows entwerfen, die den Kernwert zeigen
4. **Transparente Risiken**: Aktiv Einschränkungen oder bekannte Probleme der aktuellen Version auflisten

Nach Abschluss der Preview-Phase erhalten Sie:

- ✅ Vollständige Betriebsanweisungen (`README.md`)
- ✅ Docker-Containerisierungskonfiguration (`Dockerfile`, `docker-compose.yml`)
- ✅ Produktionsumgebungsvariablen-Vorlage (`.env.production.example`)
- ✅ Expo EAS Build-Konfiguration (`eas.json`)
- ✅ Optionaler detaillierter Bereitstellungsleitfaden (`DEPLOYMENT.md`)

## Vorschau auf die nächste Lektion

> Herzlichen Glückwunsch! Sie haben alle 7 Phasen der AI App Factory abgeschlossen.
>
> Wenn Sie den Koordinierungsmechanismus der Pipeline tiefer verstehen möchten, können Sie die **[Sisyphus Orchestrator im Detail](../orchestrator/)** lernen.
>
> Sie werden lernen:
> - Wie der Orchestrator die Pipeline-Ausführung koordiniert
> - Berechtigungsprüfung und Berechtigungsüberschreitungsbehandlungsmechanismen
> - Fehlerbehandlungs- und Rollback-Strategien
> - Kontextoptimierung und Token-Saving-Tipps

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-29

| Funktion | Dateipfad | Zeile |
| ---- | ---- | ---- |
| Preview Agent Definition | [`source/hyz1992/agent-app-factory/agents/preview.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/preview.agent.md) | 1-33 |
| Preview Skill-Leitfaden | [`source/hyz1992/agent-app-factory/skills/preview/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/preview/skill.md) | 1-583 |
| Pipeline-Konfiguration | [`source/hyz1992/agent-app-factory/pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 98-111 |
| CI/CD-Konfigurationsvorlage | [`source/hyz1992/agent-app-factory/templates/cicd-github-actions.md`](https://github.com/hyz1992/agent-app-factory/blob/main/templates/cicd-github-actions.md) | 1-617 |
| Git Hooks-Konfigurationsvorlage | [`source/hyz1992/agent-app-factory/templates/git-hooks-husky.md`](https://github.com/hyz1992/agent-app-factory/blob/main/templates/git-hooks-husky.md) | 1-530 |

**Wichtige Einschränkungen**:
- **Lokal zuerst**: Sicherstellen, dass jeder mit grundlegenden Entwicklungswerkzeugen lokal starten kann
- **Bereitstellungsbereit**: Alle Konfigurationsdateien für die Produktionsbereitstellung bereitstellen
- **Transparente Risiken**: Aktiv Einschränkungen oder bekannte Probleme der aktuellen Version auflisten

**Dateien, die generiert werden müssen**:
- `artifacts/preview/README.md` - Haupt-Betriebsdokumentation
- `artifacts/backend/Dockerfile` - Backend Docker-Konfiguration
- `artifacts/backend/docker-compose.yml` - Docker Compose für Entwicklungsumgebung
- `artifacts/backend/.env.production.example` - Produktionsumgebungsvariablen-Vorlage
- `artifacts/client/eas.json` - Expo EAS Build-Konfiguration

**NICHT tun (NIEMALS)**:
- NIEMALS Abhängigkeitsinstallation oder Konfigurationsschritte ignorieren, sonst schlägt Betrieb oder Bereitstellung wahrscheinlich fehl
- NIEMALS zusätzliche Anweisungen oder Marketing-Sprache bereitstellen, die nichts mit der Anwendung zu tun haben
- NIEMALS Produktfähigkeiten übertreiben, Defekte oder Einschränkungen verbergen
- NIEMALS sensible Informationen (Passwörter, API Keys usw.) in Bereitstellungskonfigurationen hartcodieren
- NIEMALS Health-Check-Konfiguration ignorieren, dies ist entscheidend für die Produktionsumgebungsüberwachung
- NIEMALS Datenbankmigrationsanweisungen überspringen, dies ist ein kritischer Schritt für die Produktionsfreigabe
- NIEMALS `latest` als Docker-Image-Tag verwenden, stattdessen konkrete Versionsnummern verwenden
- NIEMALS SQLite in der Produktionsumgebung verwenden (sollte zu PostgreSQL migriert werden)

</details>

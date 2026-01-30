---
title: "Technische Architektur entwerfen: Vollständige Anleitung zur Tech-Phase | Agent App Factory Tutorial"
sidebarTitle: "Technische Architektur entwerfen"
subtitle: "Technische Architektur entwerfen: Vollständige Anleitung zur Tech-Phase"
description: "Lernen Sie, wie die AI App Factory Tech-Phase eine minimal viable technische Architektur und Prisma-Datenmodelle basierend auf dem PRD entwirft, einschließlich Technologie-Stack-Auswahl, Datenmodell-Design, API-Definition und Datenbank-Migrationsstrategie."
tags:
  - "Technische Architektur"
  - "Datenmodell"
  - "Prisma"
prerequisite:
  - "advanced-stage-prd"
order: 110
---

# Technische Architektur entwerfen: Vollständige Anleitung zur Tech-Phase

## Was Sie nach diesem Kurs können werden

Nach Abschluss dieses Kurses werden Sie in der Lage sein:

- Zu verstehen, wie der Tech-Agent technische Architekturen basierend auf dem PRD entwirft
- Die Design-Methoden und Einschränkungen von Prisma Schema zu beherrschen
- Die Entscheidungsprinzipien der Technologie-Stack-Auswahl zu verstehen
- Angemessene Datenmodelle und API-Designs für MVPs zu erstellen
- Die Migrationsstrategie zwischen SQLite-Entwicklungsumgebung und PostgreSQL-Produktionsumgebung zu verstehen

## Ihre aktuelle Situation

Der PRD ist fertig, Sie wissen genau, welche Funktionen Sie umsetzen müssen, aber Sie wissen nicht:

- Welchen Technologie-Stack sollten Sie wählen? Node.js oder Python?
- Wie sollten die Datentabellen entworfen werden? Wie definieren Sie Beziehungen?
- Welche API-Endpunkte sollten es geben? Welche Standards sollten befolgt werden?
- Wie stellen Sie sicher, dass das Design sowohl schnelle Bereitstellung als auch zukünftige Erweiterung unterstützt?

Die Tech-Phase löst genau diese Probleme – sie generiert automatisch technische Architektur und Datenmodelle basierend auf dem PRD.

## Wann diese Methode verwenden

Die Tech-Phase ist die 4. Phase der Pipeline, direkt nach der UI-Phase und vor der Code-Phase.

**Typische Anwendungsszenarien**:

| Szenario | Beschreibung |
| -------- | ------------ |
| Neues Projekt starten | Nach PRD-Bestätigung muss ein technisches Konzept entworfen werden |
| MVP-Schnellprototyp | Benötigt eine minimal viable technische Architektur, um Over-Engineering zu vermeiden |
| Technologie-Stack-Entscheidung | Unsicher, welche Technologiekombination am besten geeignet ist |
| Datenmodell-Design | Klare Entitätsbeziehungen und Felder müssen definiert werden |

**Nicht anwendbare Szenarien**:

- Projekte mit bereits definierter technischer Architektur (die Tech-Phase würde neu entwerfen)
- Nur Frontend oder Backend (die Tech-Phase entwirft Full-Stack-Architektur)
- Projekte, die Microservices-Architektur benötigen (nicht für MVP-Phase empfohlen)

## 🎒 Vorbereitung vor dem Start

::: warning Voraussetzungen

Dieser Kurs setzt voraus, dass Sie bereits:

1. **Die PRD-Phase abgeschlossen haben**: `artifacts/prd/prd.md` muss existieren und validiert sein
2. **Die Produktanforderungen verstehen**: Klar über Kernfunktionen, User Stories und MVP-Umfang Bescheid wissen
3. **Grundlegende Konzepte kennen**: Vertraut mit RESTful API, relationalen Datenbanken und ORM-Grundkonzepten sein

:::

**Konzepte, die Sie kennen sollten**:

::: info Was ist Prisma?

Prisma ist ein modernes ORM-Tool (Object-Relational Mapping) für den Betrieb von Datenbanken in TypeScript/Node.js.

**Kernvorteile**:

- **Typsicherheit**: Automatische Generierung von TypeScript-Typen für vollständige Entwicklungshinweise
- **Migrationsmanagement**: `prisma migrate dev` verwaltet automatisch Datenbankänderungen
- **Entwicklungserfahrung**: Prisma Studio zur visuellen Anzeige und Bearbeitung von Daten

**Grundlegender Arbeitsablauf**:

```
Schema.prisma definieren → Migration ausführen → Client generieren → Im Code verwenden
```

:::

::: info Warum SQLite für MVP und PostgreSQL für Produktion?

**SQLite (Entwicklungsumgebung)**:

- Null-Konfiguration, Datei-basierte Datenbank (`dev.db`)
- Leichtgewichtig und schnell, ideal für lokale Entwicklung und Demonstration
- Unterstützt keine gleichzeitigen Schreibzugriffe

**PostgreSQL (Produktionsumgebung)**:

- Vollständige Funktionalität, unterstützt Parallelzugriff, komplexe Abfragen
- Hervorragende Leistung, geeignet für Produktionsbereitstellung
- Prisma-Migration nahtlos wechselbar: Nur `DATABASE_URL` ändern

**Migrationsstrategie**: Prisma passt sich automatisch an den Datenbankanbieter basierend auf `DATABASE_URL` an, ohne manuelle Schema-Änderungen.

:::

## Kernkonzept

Das Kernkonzept der Tech-Phase ist die **Umwandlung von Produktanforderungen in technische Lösungen**, wobei das Prinzip "MVP zuerst" befolgt wird.

### Denkrahmen

Der Tech-Agent folgt diesem Denkrahmen:

| Prinzip | Beschreibung |
| ------- | ------------ |
| **Zielorientierung** | Technische Lösungen müssen den Kernwert des Produkts unterstützen |
| **Einfachheit zuerst** | Wählen Sie einfache, ausgereifte Technologie-Stacks für schnelle Bereitstellung |
| **Erweiterbarkeit** | Reservieren Sie Erweiterungspunkte im Design für zukünftige Entwicklung |
| **Datengetrieben** | Ausdrücken von Entitäten und Beziehungen durch klare Datenmodelle |

### Technologie-Stack-Entscheidungsbaum

**Backend-Technologie-Stack**:

| Komponente | Empfohlen | Alternative | Beschreibung |
| ---------- | --------- | ----------- | ------------ |
| **Laufzeitumgebung** | Node.js + TypeScript | Python + FastAPI | Node.js hat reiches Ökosystem, einheitliches Frontend/Backend |
| **Web-Framework** | Express | Fastify | Express ist ausgereift und stabil, reich an Middleware |
| **ORM** | Prisma 5.x | TypeORM | Prisma bietet Typsicherheit, hervorragendes Migrationsmanagement |
| **Datenbank** | SQLite (Entwicklung) / PostgreSQL (Produktion) | - | SQLite null Konfiguration, PostgreSQL produktionsbereit |

**Frontend-Technologie-Stack**:

| Szenario | Empfohlen | Beschreibung |
| -------- | --------- | ------------ |
| Nur Mobile | React Native + Expo | Plattformübergreifend, Hot-Update |
| Mobile + Web | React Native Web | Ein Codebase, mehrere Plattformen |
| Nur Web | React + Vite | Hervorragende Leistung, reifes Ökosystem |

**State Management**:

| Komplexität | Empfohlen | Beschreibung |
| ----------- | --------- | ------------ |
| Einfach (< 5 globale Zustände) | React Context API | Null Abhängigkeiten, niedrige Lernkurve |
| Mittlere Komplexität | Zustand | Leichtgewichtig, einfache API, gute Leistung |
| Komplexe Anwendung | Redux Toolkit | ⚠️ Nicht für MVP-Phase empfohlen, zu komplex |

### Datenmodell-Design-Prinzipien

**Entitätserkennung**:

1. Extrahieren Sie Substantive aus den User Stories im PRD → Kandidatenentitäten
2. Unterscheiden Sie zwischen Kernentitäten (erforderlich) und Hilfsentitäten (optional)
3. Jede Entität muss eine klare geschäftliche Bedeutung haben

**Beziehungsdesign**:

| Beziehungstyp | Beispiel | Beschreibung |
| ------------- | -------- | ------------ |
| Eins-zu-viele (1:N) | User → Posts | Ein Benutzer hat mehrere Artikel |
| Viele-zu-viele (M:N) | Posts ↔ Tags | Artikel und Tags (über Zwischentabelle) |
| Eins-zu-eins (1:1) | User → UserProfile | ⚠️ Weniger verwenden, normalerweise zusammenführbar |

**Feldprinzipien**:

- **Erforderliche Felder**: `id`, `createdAt`, `updatedAt`
- **Redundanz vermeiden**: Felder, die durch Berechnung oder Assoziation erhalten werden können, nicht speichern
- **Angemessene Typen**: String, Int, Float, Boolean, DateTime
- **Sensible Felder markieren**: Passwörter etc. sollten nicht direkt gespeichert werden

### ⚠️ SQLite-Kompatibilitätseinschränkungen

Der Tech-Agent muss beim Generieren von Prisma Schema SQLite-Kompatibilitätsanforderungen einhalten:

#### Verwendung von Composite Types verbieten

SQLite unterstützt Prisma's `type`-Definition nicht, muss `String` verwenden, um JSON-Strings zu speichern.

```prisma
// ❌ Falsch - SQLite wird nicht unterstützt
type UserProfile {
  identity String
  ageRange String
}

model User {
  id      Int        @id @default(autoincrement())
  profile UserProfile
}

// ✅ Richtig - String verwenden, um JSON zu speichern
model User {
  id      Int    @id @default(autoincrement())
  profile String // JSON: {"identity":"student","ageRange":"18-25"}
}
```

#### JSON-Feld-Kommentar-Spezifikation

Verwenden Sie Kommentare im Schema, um die JSON-Struktur zu erklären:

```prisma
model User {
  id      Int    @id @default(autoincrement())
  // JSON-Format: {"identity":"student","ageRange":"18-25"}
  profile String
}
```

Definieren Sie die entsprechende Schnittstelle im TypeScript-Code:

```typescript
// src/types/index.ts
export interface UserProfile {
  identity: string;
  ageRange: string;
}
```

#### Prisma-Versionsfixierung

Muss Prisma 5.x verwenden, nicht 7.x (hat Kompatibilitätsprobleme):

```json
{
  "dependencies": {
    "@prisma/client": "5.22.0",
    "prisma": "5.22.0"
  }
}
```

## Arbeitsablauf des Tech-Agents

Der Tech-Agent ist ein AI-Agent, der für das Entwerfen technischer Architekturen basierend auf dem PRD verantwortlich ist. Sein Arbeitsablauf ist wie folgt:

### Eingabedateien

Der Tech-Agent kann nur die folgenden Dateien lesen:

| Datei | Beschreibung | Position |
| ----- | ------------ | -------- |
| `prd.md` | Produktdokumentation | `artifacts/prd/prd.md` |

### Ausgabedateien

Der Tech-Agent muss die folgenden Dateien generieren:

| Datei | Beschreibung | Position |
| ----- | ------------ | -------- |
| `tech.md` | Technisches Konzept und Architekturdokument | `artifacts/tech/tech.md` |
| `schema.prisma` | Datenmodell-Definition | `artifacts/backend/prisma/schema.prisma` |

### Ausführungsschritte

1. **PRD lesen**: Kernfunktionen, Datenfluss und Einschränkungsbedingungen erkennen
2. **Technologie-Stack auswählen**: Basierend auf `skills/tech/skill.md`, Sprache, Framework und Datenbank auswählen
3. **Datenmodell entwerfen**: Entitäten, Attribute und Beziehungen definieren, mit Prisma schema ausdrücken
4. **Technisches Dokument schreiben**: Auswahlgründe, Erweiterungsstrategien und Nicht-Ziele in `tech.md` erklären
5. **Ausgabedateien generieren**: Design in den angegebenen Pfad schreiben, ohne Upstream-Dateien zu ändern

### Exit-Bedingungen

Der Sisyphus-Scheduler überprüft, ob der Tech-Agent die folgenden Bedingungen erfüllt:

- ✅ Technologie-Stack explizit deklariert (Backend, Frontend, Datenbank)
- ✅ Datenmodell stimmt mit PRD überein (alle Entitäten stammen aus dem PRD)
- ✅ Keine vorzeitige Optimierung oder Überdesign

## Mach es mit mir: Tech-Phase ausführen

### Schritt 1: Bestätigen, dass die PRD-Phase abgeschlossen ist

**Warum**

Der Tech-Agent muss `artifacts/prd/prd.md` lesen, wenn die Datei nicht existiert, kann die Tech-Phase nicht ausgeführt werden.

**Operation**

```bash
# Überprüfen, ob die PRD-Datei existiert
cat artifacts/prd/prd.md
```

**Sie sollten sehen**: Strukturiertes PRD-Dokument, enthält Zielbenutzer, Funktionsliste, Nicht-Ziele usw.

### Schritt 2: Tech-Phase ausführen

**Warum**

Verwenden Sie den AI-Assistenten, um den Tech-Agent auszuführen, um automatisch technische Architektur und Datenmodelle zu generieren.

**Operation**

```bash
# Verwenden von Claude Code, um die tech-Phase auszuführen
factory run tech
```

**Sie sollten sehen**:

```
✓ Aktuelle Phase: tech
✓ PRD-Dokument laden: artifacts/prd/prd.md
✓ Tech-Agent starten

Tech-Agent entwirft technische Architektur...

[AI-Assistent führt die folgenden Operationen aus]
1. PRD analysieren, Entitäten und Funktionen extrahieren
2. Technologie-Stack auswählen (Node.js + Express + Prisma)
3. Datenmodell entwerfen (User, Post usw. Entitäten)
4. API-Endpunkte definieren
5. tech.md und schema.prisma generieren

Warten Sie, bis der Agent abgeschlossen ist...
```

### Schritt 3: Generiertes technisches Dokument anzeigen

**Warum**

Überprüfen Sie, ob das technische Dokument vollständig ist, und validieren Sie, ob das Design angemessen ist.

**Operation**

```bash
# Technisches Dokument anzeigen
cat artifacts/tech/tech.md
```

**Sie sollten sehen**: Vollständiges technisches Dokument mit den folgenden Kapiteln

```markdown
## Technologie-Stack

**Backend**
- Laufzeitumgebung: Node.js 20+
- Sprache: TypeScript 5+
- Framework: Express 4.x
- ORM: Prisma 5.x
- Datenbank: SQLite (Entwicklung) / PostgreSQL (Produktion)

**Frontend**
- Framework: React Native + Expo
- Sprache: TypeScript
- Navigation: React Navigation 6
- State Management: React Context API
- HTTP-Client: Axios

## Architektur-Design

**Schichtenstruktur**
- Routing-Schicht (routes/): API-Endpunkte definieren
- Controller-Schicht (controllers/): Anfragen und Antworten verarbeiten
- Service-Schicht (services/): Geschäftslogik
- Datenzugriffsschicht: Prisma ORM

**Datenfluss**
Client → API Gateway → Controller → Service → Prisma → Database

## API-Endpunkt-Design

| Endpunkt | Methode | Beschreibung | Anfragekörper | Antwort |
|----------|---------|--------------|---------------|---------|
| /api/items | GET | Liste abrufen | - | Item[] |
| /api/items/:id | GET | Details abrufen | - | Item |
| /api/items | POST | Erstellen | CreateItemDto | Item |
| /api/items/:id | PUT | Aktualisieren | UpdateItemDto | Item |
| /api/items/:id | DELETE | Löschen | - | { deleted: true } |

## Datenmodell

### User
- id: Primärschlüssel
- email: E-Mail (erforderlich)
- name: Name (erforderlich)
- createdAt: Erstellungszeit
- updatedAt: Aktualisierungszeit

**Beziehungen**:
- posts: Eins-zu-viele (Benutzer hat mehrere Artikel)

## Umgebungsvariablen

**Backend (.env)**
- PORT: Service-Port (Standard 3000)
- DATABASE_URL: Datenbank-Verbindungszeichenfolge
- NODE_ENV: Umgebung (development/production)
- CORS_ORIGINS: Erlaubte Cross-Origin-Quellen

**Frontend (.env)**
- EXPO_PUBLIC_API_URL: Backend-API-Adresse

## Zukünftige Erweiterungspunkte

**Kurzfristig (v1.1)**
- Paginierung und Filterung hinzufügen
- Datenexport-Funktion implementieren

**Mittelfristig (v2.0)**
- Zu PostgreSQL migrieren
- Benutzerauthentifizierung hinzufügen

**Langfristig**
- In Microservices aufteilen
- Cache-Schicht hinzufügen (Redis)
```

### Schritt 4: Generiertes Prisma Schema anzeigen

**Warum**

Überprüfen Sie, ob das Datenmodell dem PRD entspricht und ob SQLite-Kompatibilitätseinschränkungen eingehalten werden.

**Operation**

```bash
# Prisma Schema anzeigen
cat artifacts/backend/prisma/schema.prisma
```

**Sie sollten sehen**: Schema, das der Prisma 5.x-Syntax entspricht, enthält vollständige Entitätsdefinitionen und Beziehungen

```prisma
// Dies ist Ihre Prisma-Schema-Datei,
// mehr Infos in der Dokumentation: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite" // Entwicklungsumgebung
  url      = "file:./dev.db"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  posts     Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  published Boolean  @default(false)
  authorId  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  author    User     @relation(fields: [authorId], references: [id])
}
```

### Schritt 5: Exit-Bedingungen validieren

**Warum**

Sisyphus überprüft, ob der Tech-Agent die Exit-Bedingungen erfüllt, falls nicht, wird eine erneute Ausführung angefordert.

**Checkliste**

| Prüfpunkt | Beschreibung | Bestanden/Fehlgeschlagen |
| --------- | ------------ | ------------------------ |
| Technologie-Stack explizit deklariert | Backend, Frontend, Datenbank sind klar definiert | [ ] |
| Datenmodell stimmt mit PRD überein | Alle Entitäten stammen aus dem PRD, keine zusätzlichen Felder | [ ] |
| Keine vorzeitige Optimierung oder Überdesign | Entspricht MVP-Umfang, keine unvalidierten Funktionen | [ ] |

**Falls fehlgeschlagen**:

```bash
# Tech-Phase erneut ausführen
factory run tech
```

## Checkpoint ✅

**Bestätigen Sie, dass Sie abgeschlossen haben**:

- [ ] Tech-Phase erfolgreich ausgeführt
- [ ] `artifacts/tech/tech.md` Datei existiert und Inhalt ist vollständig
- [ ] `artifacts/backend/prisma/schema.prisma` Datei existiert und Syntax ist korrekt
- [ ] Technologie-Stack-Auswahl ist angemessen (Node.js + Express + Prisma)
- [ ] Datenmodell stimmt mit PRD überein, keine zusätzlichen Felder
- [ ] Schema befolgt SQLite-Kompatibilitätseinschränkungen (keine Composite Types)

## Fallenwarnung

### ⚠️ Falle 1: Überdesign

**Problem**: Einführung von Microservices, komplexem Caching oder erweiterten Funktionen in der MVP-Phase.

**Symptom**: `tech.md` enthält "Microservices-Architektur", "Redis-Cache", "Message Queue" usw.

**Lösung**: Der Tech-Agent hat eine `NEVER`-Liste, die Überdesign explizit verbietet. Wenn Sie diese Inhalte sehen, führen Sie erneut aus.

```markdown
## Nicht tun (NEVER)
* **NEVER** Überdesign, wie Einführung von Microservices, komplexen Message Queues oder Hochleistungs-Cache in der MVP-Phase
* **NEVER** Redundanten Code für noch nicht bestätigte Szenarien schreiben
```

### ⚠️ Falle 2: SQLite-Kompatibilitätsfehler

**Problem**: Prisma Schema verwendet Funktionen, die SQLite nicht unterstützt.

**Symptom**: Fehler in der Validation-Phase oder `npx prisma generate` schlägt fehl.

**Häufige Fehler**:

```prisma
// ❌ Falsch - SQLite unterstützt Composite Types nicht
type UserProfile {
  identity String
  ageRange String
}

model User {
  profile UserProfile
}

// ❌ Falsch - Verwendung der 7.x-Version
{
  "prisma": "^7.0.0"
}
```

**Lösung**: Überprüfen Sie das Schema, stellen Sie sicher, dass String verwendet wird, um JSON zu speichern, und fixieren Sie die Prisma-Version auf 5.x.

### ⚠️ Falle 3: Datenmodell überschreitet MVP-Umfang

**Problem**: Schema enthält Entitäten oder Felder, die im PRD nicht definiert sind.

**Symptom**: Die Anzahl der Entitäten in `tech.md` ist deutlich höher als die Kernentitäten im PRD.

**Lösung**: Der Tech-Agent ist eingeschränkt durch "Das Datenmodell sollte alle für MVP-Funktionen erforderlichen Entitäten und Beziehungen abdecken, keine Felder für unvalidierte Funktionen vorab hinzufügen". Wenn zusätzliche Felder gefunden werden, löschen oder markieren Sie sie als "Zukünftige Erweiterungspunkte".

### ⚠️ Falle 4: Beziehungsdesign-Fehler

**Problem**: Beziehungsdefinition entspricht nicht der tatsächlichen Geschäftslogik.

**Symptom**: Eins-zu-viele wurde als Viele-zu-viele geschrieben, oder notwendige Beziehungen fehlen.

**Beispielfehler**:

```prisma
// ❌ Falsch - Benutzer und Artikel sollten Eins-zu-viele sein, nicht Eins-zu-eins
model User {
  id   Int    @id @default(autoincrement())
  post Post?  // Eins-zu-eins-Beziehung
}

model Post {
  id      Int    @id @default(autoincrement())
  author  User?  // Sollte @relation verwenden
}
```

**Richtige Schreibweise**:

```prisma
// ✅ Richtig - Eins-zu-viele-Beziehung
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model Post {
  id       Int  @id @default(autoincrement())
  authorId Int
  author   User @relation(fields: [authorId], references: [id])
}
```

## Zusammenfassung dieses Kurses

Die Tech-Phase ist die Brücke in der Pipeline, die "Produktanforderungen" und "Code-Implementierung" verbindet. Sie entwirft automatisch basierend auf dem PRD:

- **Technologie-Stack**: Node.js + Express + Prisma (Backend), React Native + Expo (Frontend)
- **Datenmodell**: Prisma Schema, das SQLite-Kompatibilitätsanforderungen erfüllt
- **Architektur-Design**: Schichtenstruktur (Routing → Controller → Service → Daten)
- **API-Definition**: RESTful-Endpunkte und Datenfluss

**Schlüsselprinzipien**:

1. **MVP zuerst**: Nur Kernfunktionen entwerfen, Überdesign vermeiden
2. **Einfachheit zuerst**: Ausgereifte, stabile Technologie-Stacks wählen
3. **Datengetrieben**: Entitäten und Beziehungen durch klare Datenmodelle ausdrücken
4. **Erweiterbarkeit**: Zukünftige Erweiterungspunkte im Dokument markieren, aber nicht vorab implementieren

Nach Abschluss der Tech-Phase erhalten Sie:

- ✅ Vollständiges technisches Konzeptdokument (`tech.md`)
- ✅ Datenmodell, das den Prisma 5.x-Spezifikationen entspricht (`schema.prisma`)
- ✅ Klares API-Design und Umgebungskonfiguration

## Vorschau auf den nächsten Kurs

> Im nächsten Kurs lernen wir **[Code-Phase: Generierung ausführbaren Codes](../stage-code/)**.
>
> Sie werden lernen:
> - Wie der Code-Agent Frontend- und Backend-Code basierend auf UI Schema und Tech-Design generiert
> - Welche Funktionen die generierte Anwendung enthält (Tests, Dokumentation, CI/CD)
> - Wie die Qualität des generierten Codes validiert wird
> - Besondere Anforderungen und Ausgabespezifikationen des Code-Agents

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie, um die Quellcode-Position anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-29

| Funktion | Dateipfad | Zeilennummer |
| -------- | --------- | ------------ |
| Tech-Agent-Definition | [`source/hyz1992/agent-app-factory/agents/tech.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/tech.agent.md) | 1-63 |
| Tech-Skill-Anleitung | [`source/hyz1992/agent-app-factory/skills/tech/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/tech/skill.md) | 1-942 |
| Pipeline-Konfiguration | [`source/hyz1992/agent-app-factory/pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 49-62 |
| SQLite-Kompatibilitätseinschränkungen | [`source/hyz1992/agent-app-factory/agents/tech.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/tech.agent.md) | 28-56 |

**Wichtige Einschränkungen**:
- **Verwendung von Composite Types verbieten**: SQLite wird nicht unterstützt, muss String verwenden, um JSON zu speichern
- **Prisma-Versionsfixierung**: Muss 5.x verwenden, nicht 7.x
- **MVP-Umfang**: Datenmodell sollte alle für MVP-Funktionen erforderlichen Entitäten abdecken, keine Felder für unvalidierte Funktionen vorab hinzufügen

**Technologie-Stack-Entscheidungsprinzipien**:
- Priorisieren Sie Sprachen und Frameworks mit aktiver Community und vollständiger Dokumentation
- Wählen Sie in der MVP-Phase eine leichtgewichtige Datenbank (SQLite), später kann zu PostgreSQL migriert werden
- Systemschichten folgen Routing-Schicht → Geschäftslogik-Schicht → Datenzugriffsschicht

**Nicht tun (NEVER)**:
- NEVER Überdesign, wie Einführung von Microservices, komplexen Message Queues oder Hochleistungs-Cache in der MVP-Phase
- NEVER Unbekannte oder schlecht gewartete Technologien wählen
- NEVER Felder oder Beziehungen hinzufügen, die nicht durch Produktvalidierung bestätigt wurden
- NEVER Konkrete Code-Implementierung in technische Dokumente aufnehmen

</details>

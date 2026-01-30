---
title: "CLI vs MCP: Designentscheidung | OpenSkills"
sidebarTitle: "Warum CLI statt MCP"
subtitle: "Warum CLI statt MCP?"
description: "Lernen Sie die Designentscheidungen, warum OpenSkills CLI statt MCP wählt. Verstehen Sie die Positionsunterschiede beider Ansätze und warum das Skill-System für statische Dateien geeignet ist sowie wie Multi-Agent-Universalität und Zero-Config-Bereitstellung erreicht werden."
tags:
  - "FAQ"
  - "Designphilosophie"
  - "MCP"
prerequisite:
  - "start-what-is-openskills"
order: 3
---

# Warum CLI statt MCP?

## Was Sie nach diesem Tutorial können

Dieses Tutorial hilft Ihnen zu verstehen:

- ✅ Die Positionsunterschiede zwischen MCP und dem Skill-System kennen
- ✅ Verstehen, warum CLI besser zum Laden von Skills geeignet ist
- ✅ Die Designphilosophie von OpenSkills beherrschen
- ✅ Die technischen Prinzipien des Skill-Systems verstehen

## Ihre aktuelle Situation

Möglicherweise denken Sie:

- "Warum nicht das fortschrittlichere MCP-Protokoll verwenden?"
- "Ist der CLI-Ansatz nicht zu veraltet?"
- "Ist MCP nicht besser für das AI-Zeitalter geeignet?"

Dieses Tutorial hilft Ihnen, die technischen Überlegungen hinter diesen Designentscheidungen zu verstehen.

---

## Kernfrage: Was sind Skills?

Bevor wir CLI vs MCP diskutieren, verstehen Sie zunächst das Wesen von "Skills".

### Das Wesen von Skills

::: info Definition von Skills
Skills sind eine Kombination aus **statischen Anweisungen + Ressourcen**, einschließlich:
- `SKILL.md`: Detaillierte Bedienungsanleitungen und Prompts
- `references/`: Referenzdokumentation
- `scripts/`: Ausführbare Skripte
- `assets/`: Bilder, Vorlagen und andere Ressourcen

Skills sind **keine** dynamischen Dienste, Echtzeit-APIs oder Tools, die einen Server benötigen.
:::

### Das offizielle Design von Anthropic

Das Skill-System von Anthropic ist von Grund auf für das **Dateisystem** konzipiert:

- Skills existieren als `SKILL.md`-Dateien
- Verfügbare Skills werden über `<available_skills>`-XML-Blöcke beschrieben
- KI-Agenten laden Dateiinhalte bei Bedarf in den Kontext

Dies bestimmt, dass die technische Auswahl des Skill-Systems mit dem Dateisystem kompatibel sein muss.

---

## MCP vs OpenSkills: Positionsvergleich

| Vergleichsdimension | MCP (Model Context Protocol) | OpenSkills (CLI) |
|--- | --- | ---|
| **Anwendungsszenario** | Dynamische Tools, Echtzeit-API-Aufrufe | Statische Anweisungen, Dokumentation, Skripte |
| **Laufzeitanforderungen** | Erfordert MCP-Server | Kein Server erforderlich (reine Dateien) |
| **Agent-Unterstützung** | Nur MCP-unterstützte Agenten | Alle Agenten, die `AGENTS.md` lesen können |
| **Komplexität** | Erfordert Server-Bereitstellung und -Wartung | Zero-Config, sofort einsatzbereit |
| **Datenquelle** | Echtzeit vom Server abrufen | Aus dem lokalen Dateisystem lesen |
| **Netzwerkabhängigkeit** | Erforderlich | Nicht erforderlich |
| **Skill-Laden** | Über Protokollaufrufe | Über Dateilesungen |

---

## Warum ist CLI besser für das Skill-System geeignet?

### 1. Skills sind Dateien

**MCP benötigt einen Server**: Erfordert die Bereitstellung eines MCP-Servers, die Verarbeitung von Anfragen und Antworten, Protokoll-Handshakes...

**CLI benötigt nur Dateien**:

```bash
# Skills werden im Dateisystem gespeichert
.claude/skills/pdf/
├── SKILL.md              # Hauptanweisungsdatei
├── references/           # Referenzdokumentation
│   └── pdf-format-spec.md
├── scripts/             # Ausführbare Skripte
│   └── extract-pdf.py
└── assets/              # Ressourcendateien
    └── pdf-icon.png
```

**Vorteile**:
- ✅ Zero-Config, kein Server erforderlich
- ✅ Skills können versioniert werden
- ✅ Offline verfügbar
- ✅ Einfache Bereitstellung

### 2. Universalität: Alle Agenten können es verwenden

**Einschränkungen von MCP**:

Nur MCP-unterstützte Agenten können es verwenden. Wenn Agenten wie Cursor, Windsurf, Aider jeweils MCP implementieren, führt dies zu:
- Doppelter Entwicklungsarbeit
- Protokollkompatibilitätsproblemen
- Schwierigkeiten bei der Versionssynchronisierung

**Vorteile von CLI**:

Jeder Agent, der Shell-Befehle ausführen kann, kann es verwenden:

```bash
# Claude Code-Aufruf
npx openskills read pdf

# Cursor-Aufruf
npx openskills read pdf

# Windsurf-Aufruf
npx openskills read pdf
```

**Null-Integrationskosten**: Es wird nur benötigt, dass der Agent Shell-Befehle ausführen kann.

### 3. Entspricht dem offiziellen Design

Das Skill-System von Anthropic ist von Grund auf ein **Dateisystem-Design**, kein MCP-Design:

```xml
<!-- Skill-Beschreibung in AGENTS.md -->
<available_skills>
<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit...</description>
<location>project</location>
</skill>
</available_skills>
```

**Aufrufmethode**:

```bash
# Offizieller Aufruf
npx openskills read pdf
```

OpenSkills folgt vollständig dem offiziellen Design von Anthropic und behält die Kompatibilität bei.

### 4. Inkrementelles Laden (Progressive Disclosure)

**Kernvorteil des Skill-Systems**: Bedarfsgerechtes Laden, um den Kontext schlank zu halten.

**CLI-Implementierung**:

```bash
# Skill-Inhalte nur bei Bedarf laden
npx openskills read pdf
# Ausgabe: Vollständiger Inhalt von SKILL.md nach stdout
```

**Herausforderungen bei MCP**:

Bei der Implementierung mit MCP wären erforderlich:
- Server verwaltet die Skill-Liste
- Implementierung der bedarfsgerechten Lade-Logik
- Kontextverarbeitung

Der CLI-Ansatz unterstützt inkrementelles Laden von Natur aus.

---

## Anwendungsszenarien von MCP

Die Probleme, die MCP löst, unterscheiden sich vom Skill-System ****:

| Probleme, die MCP löst | Beispiel |
|--- | ---|
| **Echtzeit-API-Aufrufe** | Aufrufen der OpenAI-API, Datenbankabfragen |
| **Dynamische Tools** | Rechner, Datenkonvertierungsdienste |
| **Remote-Dienst-Integration** | Git-Operationen, CI/CD-Systeme |
| **Statusverwaltung** | Tools, die Serverstatus verwalten müssen |

Diese Szenarien erfordern **Server** und **Protokolle**, MCP ist die richtige Wahl.

---

## Skill-System vs MCP: Kein Wettbewerbsverhältnis

**Kernansicht**: MCP und das Skill-System lösen unterschiedliche Probleme, es ist kein Entweder-Oder.

### Position des Skill-Systems

```
[Statische Anweisungen] → [SKILL.md] → [Dateisystem] → [CLI-Laden]
```

Anwendungsszenarien:
- Bedienungsanleitungen und Best Practices
- Dokumentation und Referenzmaterialien
- Statische Skripte und Vorlagen
- Konfigurationen, die versioniert werden müssen

### Position von MCP

```
[Dynamische Tools] → [MCP-Server] → [Protokollaufrufe] → [Echtzeitantwort]
```

Anwendungsszenarien:
- Echtzeit-API-Aufrufe
- Datenbankabfragen
- Remote-Dienste mit Status
- Komplexe Berechnungen und Konvertierungen

### Ergänzendes Verhältnis

OpenSkills schließt MCP nicht aus, sondern **konzentriert sich auf das Laden von Skills**:

```
KI-Agent
  ├─ Skill-System (OpenSkills CLI) → Statische Anweisungen laden
  └─ MCP-Tools → Dynamische Dienste aufrufen
```

Sie ergänzen sich, sie ersetzen sich nicht.

---

## Praktische Fälle: Wann verwendet man was?

### Fall 1: Git-Operationen aufrufen

❌ **Nicht geeignet für das Skill-System**:
- Git-Operationen sind dynamisch und erfordern Echtzeit-Interaktion
- Hängen vom Status des Git-Servers ab

✅ **Geeignet für MCP**:
```bash
# Über MCP-Tools aufrufen
git:checkout(branch="main")
```

### Fall 2: PDF-Verarbeitungsanleitung

❌ **Nicht geeignet für MCP**:
- Bedienungsanleitungen sind statisch
- Erfordert keinen laufenden Server

✅ **Geeignet für das Skill-System**:
```bash
# Über CLI laden
npx openskills read pdf
# Ausgabe: Detaillierte PDF-Verarbeitungsschritte und Best Practices
```

### Fall 3: Datenbankabfragen

❌ **Nicht geeignet für das Skill-System**:
- Erfordert Verbindung zur Datenbank
- Ergebnisse sind dynamisch

✅ **Geeignet für MCP**:
```bash
# Über MCP-Tools aufrufen
database:query(sql="SELECT * FROM users")
```

### Fall 4: Code-Review-Richtlinien

❌ **Nicht geeignet für MCP**:
- Review-Richtlinien sind statische Dokumentation
- Erfordern Versionierung

✅ **Geeignet für das Skill-System**:
```bash
# Über CLI laden
npx openskills read code-review
# Ausgabe: Detaillierte Code-Review-Checklisten und Beispiele
```

---

## Zukunft: Fusion von MCP und Skill-System

### Mögliche Entwicklungsrichtungen

**MCP + Skill-System**:

```bash
# MCP-Tools in Skills referenzieren
npx openskills read pdf-tool

# SKILL.md-Inhalt
Dieses Skill benötigt die Verwendung von MCP-Tools:

1. Verwenden Sie mcp:pdf-extract zum Extrahieren von Text
2. Verwenden Sie mcp:pdf-parse zum Parsen der Struktur
3. Verwenden Sie die in diesem Skill bereitgestellten Skripte zur Ergebnisverarbeitung
```

**Vorteile**:
- Skills bieten fortgeschrittene Anweisungen und Best Practices
- MCP bietet zugrundeliegende dynamische Tools
- Kombination beider macht es mächtiger

### Aktuelle Phase

OpenSkills wählt CLI, weil:
1. Das Skill-System bereits ein ausgereiftes Dateisystem-Design ist
2. Der CLI-Ansatz einfach zu implementieren und hochgradig universell ist
3. Es nicht abgewartet werden muss, bis jeder Agent MCP-Support implementiert

---

## Zusammenfassung dieser Lektion

Kerngründe, warum OpenSkills CLI statt MCP wählt:

### Kernursachen

- ✅ **Skills sind statische Dateien**: Kein Server erforderlich, Dateisystemspeicherung
- ✅ **Höhere Universalität**: Alle Agenten können es verwenden, nicht vom MCP-Protokoll abhängig
- ✅ **Entspricht dem offiziellen Design**: Das Skill-System von Anthropic ist von Grund auf ein Dateisystem-Design
- ✅ **Zero-Config-Bereitstellung**: Kein Server erforderlich, sofort einsatzbereit

### MCP vs Skill-System

| MCP | Skill-System (CLI) |
|--- | ---|
| Dynamische Tools | Statische Anweisungen |
| Erfordert Server | Reines Dateisystem |
| Echtzeit-API | Dokumentation und Skripte |
| Erfordert Protokoll-Unterstützung | Null-Integrationskosten |

### Kein Wettbewerb, sondern Ergänzung

- MCP löst Probleme mit dynamischen Tools
- Das Skill-System löst Probleme mit statischen Anweisungen
- Beide können kombiniert verwendet werden

---

## Weiterführende Literatur

- [Was ist OpenSkills?](../../start/what-is-openskills/)
- [Befehlsübersicht](../../platforms/cli-commands/)
- [Benutzerdefinierte Skills erstellen](../../advanced/create-skills/)

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Zum Anzeigen der Quellcode-Position klicken</strong></summary>

> Aktualisiert: 2026-01-24

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
| CLI-Eingang | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts) | 39-80 |
| Read-Befehl | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts) | 1-50 |
| AGENTS.md-Generierung | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts) | 23-93 |

**Wichtige Designentscheidungen**:
- CLI-Ansatz: Laden von Skills über `npx openskills read <name>`
- Dateisystem-Speicherung: Skills werden in `.claude/skills/` oder `.agent/skills/` gespeichert
- Universelle Kompatibilität: Ausgabe im XML-Format, vollständig identisch mit Claude Code

</details>

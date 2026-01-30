---
title: "Schnellstart: Erste Schritte mit OpenSkills | OpenSkills"
sidebarTitle: "15-Minuten-Schnellstart"
subtitle: "Schnellstart: Erste Schritte mit OpenSkills | OpenSkills"
description: "Lernen Sie die Schnellstart-Methoden für OpenSkills. Installieren Sie Tools und Skills in 15 Minuten und ermöglichen Sie KI-Agenten, neue Skills zu nutzen und ihre Funktionsweise zu verstehen."
order: 1
---

# Schnellstart

In diesem Kapitel lernen Sie die ersten Schritte mit OpenSkills kennen. Von der Installation der Tools bis zur Nutzung von Skills durch KI-Agenten – alles in 10-15 Minuten.

## Lernpfad

Wir empfehlen, in folgender Reihenfolge zu lernen:

### 1. [Schnellstart](./quick-start/)

Abschluss der Installation von Tools, Skills und Synchronisierung innerhalb von 5 Minuten – erleben Sie den Kernwert von OpenSkills.

- Installation der OpenSkills-Tools
- Installation von Skills aus dem offiziellen Anthropic-Repository
- Synchronisierung der Skills zu AGENTS.md
- Verifizierung, dass KI-Agenten die Skills nutzen können

### 2. [Was ist OpenSkills?](./what-is-openskills/)

Verstehen Sie die Kernkonzepte und die Funktionsweise von OpenSkills.

- Beziehung zwischen OpenSkills und Claude Code
- Einheitliches Skills-Format, progressives Laden, Multi-Agenten-Unterstützung
- Wann Sie OpenSkills anstelle des eingebauten Skills-Systems verwenden sollten

### 3. [Installationsanleitung](./installation/)

Ausführliche Installationsschritte und Umgebungskonfiguration.

- Prüfung von Node.js und Git-Umgebung
- Temporäre Nutzung vs. globale Installation
- Behebung häufiger Installationsprobleme

### 4. [Ersten Skill installieren](./first-skill/)

Von Anthropic offiziellem Repository Skills installieren und die interaktive Auswahl erleben.

- Verwendung des `openskills install`-Befehls
- Interaktive Auswahl der benötigten Skills
- Verständnis der Verzeichnisstruktur von Skills (.claude/skills/)

### 5. [Skills zu AGENTS.md synchronisieren](./sync-to-agents/)

Erstellen Sie die AGENTS.md-Datei, damit KI-Agenten verfügbare Skills erkennen.

- Verwendung des `openskills sync`-Befehls
- Verständnis des XML-Formats von AGENTS.md
- Auswahl der zu synchronisierenden Skills zur Kontrolle der Kontextgröße

### 6. [Skills verwenden](./read-skills/)

Erfahren Sie, wie KI-Agenten Skill-Inhalte laden.

- Verwendung des `openskills read`-Befehls
- 4-stufige Prioritätsreihenfolge bei der Skill-Suche
- Lesen mehrerer Skills gleichzeitig

## Voraussetzungen

Bevor Sie beginnen, stellen Sie sicher:

- [Node.js](https://nodejs.org/) 20.6.0 oder höher ist installiert
- [Git](https://git-scm.com/) ist installiert (für die Installation von Skills aus GitHub)
- Mindestens ein KI-Coding-Agent ist installiert (Claude Code, Cursor, Windsurf, Aider usw.)

::: tip Schnelle Umgebungsprüfung
```bash
node -v  # Sollte v20.6.0 oder höher anzeigen
git -v   # Sollte git version x.x.x anzeigen
```
:::

## Nächste Schritte

Nach Abschluss dieses Kapitels können Sie weiter lernen:

- [Befehle im Detail](../platforms/cli-commands/): Vertiefen Sie alle Befehle und Parameter
- [Installationsquellen im Detail](../platforms/install-sources/): Lernen Sie, Skills aus GitHub, lokalen Pfaden und privaten Repositories zu installieren
- [Eigene Skills erstellen](../advanced/create-skills/): Erstellen Sie Ihre eigenen Skills

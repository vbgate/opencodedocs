---
title: "Erweiterte Funktionen"
sidebarTitle: "KI-Superkräfte freischalten"
subtitle: "Erweiterte Funktionen"
description: "Lerne die Konfiguration der erweiterten Funktionen von Clawdbot kennen, einschließlich KI-Modellkonfiguration, Multi-Agent-Zusammenarbeit, Browserautomatisierung, Befehlsausführungs-Tools, Web-Such-Tools, Canvas-Visualisierungsoberfläche, Sprachsteuerung und TTS, Gedächtnissystem, Cron-zeitgesteuerte Aufgaben, Skill-Plattform, Sicherheits-Sandbox und Remote-Gateway."
prerequisite:
  - "start/getting-started"
  - "start/gateway-startup"
order: 185
---

# Erweiterte Funktionen

## Kapitelübersicht

Dieses Kapitel führt tief in die erweiterten Funktionen von Clawdbot ein und hilft dir, die leistungsstarken Fähigkeiten deines KI-Assistenten voll zu nutzen. Von der KI-Modellkonfiguration und Multi-Agent-Zusammenarbeit bis hin zur Browserautomatisierung, Gedächtnissystem und Sprachfunktionen – du kannst je nach Bedarf auswählen, was du lernen möchtest.

::: info Voraussetzungen
Bevor du dieses Kapitel bearbeitest, schließe bitte folgende Inhalte ab:
- [Schnellstart](../../start/getting-started/)
- [Gateway starten](../../start/gateway-startup/)
:::

## Lernpfad

Je nach Bedarf kannst du verschiedene Lernpfade wählen:

### 🚀 Schnellstart-Pfad (empfohlen für Anfänger)
1. [KI-Modell- und Authentifizierungskonfiguration](./models-auth/) – Konfiguriere dein bevorzugtes KI-Modell
2. [Befehlsausführungs-Tools und Genehmigung](./tools-exec/) – Lass die KI sicher Befehle ausführen
3. [Web-Suche und Extraktions-Tools](./tools-web/) – Erweitere die Wissenserfassung der KI

### 🤖 KI-Fähigkeitserweiterungspfad
1. [Sitzungsverwaltung und Multi-Agent](./session-management/) – Verstehe den KI-Zusammenarbeitsmechanismus
2. [Gedächtnissystem und Vektorsuche](./memory-system/) – Lass die KI wichtige Informationen speichern
3. [Skill-Plattform und ClawdHub](./skills-platform/) – Nutze und teile Skill-Pakete

### 🔧 Automatisierungs-Tool-Pfad
1. [Browserautomatisierungs-Tools](./tools-browser/) – Webseitenoperationen automatisieren
2. [Cron-zeitgesteuerte Aufgaben und Webhook](./cron-automation/) – Zeitgesteuerte Aufgaben und Ereignisauslösung
3. [Remote-Gateway und Tailscale](./remote-gateway/) – Fernzugriff auf deinen KI-Assistenten

### 🎨 Interaktionserfahrungspfad
1. [Canvas-Visualisierungsoberfläche und A2UI](./canvas/) – Visuelle Interaktionsoberfläche
2. [Sprachsteuerung und Text-zu-Sprache](./voice-tts/) – Sprachinteraktionsfunktionen

### 🔒 Sicherheit und Bereitstellungspfad
1. [Sicherheit und Sandbox-Isolation](./security-sandbox/) – Vertiefte Einblicke in Sicherheitsmechanismen
2. [Remote-Gateway und Tailscale](./remote-gateway/) – Sicherer Fernzugriff
## Unterseiten-Navigation

### Kernkonfiguration

| Thema | Beschreibung | Geschätzte Zeit |
|-------|-------------|-----------------|
| [KI-Modell- und Authentifizierungskonfiguration](./models-auth/) | Konfiguration verschiedener KI-Modellanbieter und Authentifizierungsmethoden wie Anthropic, OpenAI, OpenRouter, Ollama | 15 Minuten |
| [Sitzungsverwaltung und Multi-Agent](./session-management/) | Lerne Kernkonzepte wie Sitzungsmodelle, Sitzungsisolierung, Unter-Agent-Zusammenarbeit, Kontextkompression | 20 Minuten |

### Tool-System

| Thema | Beschreibung | Geschätzte Zeit |
|-------|-------------|-----------------|
| [Browserautomatisierungs-Tools](./tools-browser/) | Nutze Browser-Tools für Webseitenautomatisierung, Screenshots, Formularoperationen | 25 Minuten |
| [Befehlsausführungs-Tools und Genehmigung](./tools-exec/) | Konfiguration und Nutzung des exec-Tools, Verständnis des Sicherheitsgenehmigungsmechanismus und Berechtigungssteuerung | 15 Minuten |
| [Web-Suche und Extraktions-Tools](./tools-web/) | Nutze die Tools web_search und web_fetch für Netzwerksuche und Inhaltsextraktion | 20 Minuten |

### Interaktionserfahrung

| Thema | Beschreibung | Geschätzte Zeit |
|-------|-------------|-----------------|
| [Canvas-Visualisierungsoberfläche und A2UI](./canvas/) | Verstehe Canvas A2UI-Push-Mechanismus, visuelle Oberflächenoperationen und benutzerdefinierte Oberflächen | 20 Minuten |
| [Sprachsteuerung und Text-zu-Sprache](./voice-tts/) | Konfiguration von Voice Wake, Talk Mode und TTS-Anbietern, Implementierung der Sprachinteraktion | 15 Minuten |

### Intelligente Erweiterung

| Thema | Beschreibung | Geschätzte Zeit |
|-------|-------------|-----------------|
| [Gedächtnissystem und Vektorsuche](./memory-system/) | Konfiguration und Nutzung des Gedächtnissystems (SQLite-vec, FTS5, hybride Suche) | 25 Minuten |
| [Skill-Plattform und ClawdHub](./skills-platform/) | Verständnis des Skill-Systems, Bundled/Managed/Workspace-Skills, ClawdHub-Integration | 20 Minuten |

### Automatisierung und Bereitstellung

| Thema | Beschreibung | Geschätzte Zeit |
|-------|-------------|-----------------|
| [Cron-zeitgesteuerte Aufgaben und Webhook](./cron-automation/) | Konfiguration zeitgesteuerter Aufgaben, Webhook-Auslösung, Gmail Pub/Sub und weitere Automatisierungsfunktionen | 20 Minuten |
| [Remote-Gateway und Tailscale](./remote-gateway/) | Fernzugriff auf das Gateway über Tailscale Serve/Funnel oder SSH-Tunnel | 15 Minuten |

### Sicherheitsmechanismen

| Thema | Beschreibung | Geschätzte Zeit |
|-------|-------------|-----------------|
| [Sicherheit und Sandbox-Isolation](./security-sandbox/) | Verständnis des Sicherheitsmodells, Tool-Berechtigungssteuerung, Sandbox-Isolation, Containerisierungsbereitstellung | 20 Minuten |
## Nächste Schritte

Nach Abschluss dieses Kapitels kannst du:

1. **Vertiefte Einsicht** – Siehe [Fehlerbehebung](../../faq/troubleshooting/) um aufgetretene Probleme zu lösen
2. **Bereitstellung verstehen** – Siehe [Bereitstellungsoptionen](../../appendix/deployment/) um Clawdbot in einer Produktionsumgebung bereitzustellen
3. **Erweiterungen entwickeln** – Siehe [Entwicklerhandbuch](../../appendix/development/) um zu lernen, wie man Plugins entwickelt und Code beiträgt
4. **Konfiguration ansehen** – Siehe [Vollständige Konfigurationsreferenz](../../appendix/config-reference/) um alle Konfigurationsoptionen zu verstehen

::: tip Lernempfehlung
Wir empfehlen, den Lernpfad entsprechend deinen tatsächlichen Anforderungen zu wählen. Wenn du unsicher bist, wo du beginnen sollst, kannst du dem „Schnellstart-Pfad" schrittweise folgen. Andere Themen können bei Bedarf vertieft werden.
:::

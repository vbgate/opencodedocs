---
title: "版本更新: v1.0.0-v1.0.1 | opencode-mystatus"
sidebarTitle: "v1.0.0-v1.0.1"
subtitle: "v1.0.0 - v1.0.1: Erste Veröffentlichung und Slash-Befehlsbehebung"
description: "Erfahren Sie über opencode-mystatus v1.0.0 Erstveröffentlichung mit OpenAI/Zhipu Kreditabfrage und v1.0.1 Slash-Befehlsbehebung."
tags:
  - "Version"
  - "Änderungsprotokoll"
  - "v1.0.0"
  - "v1.0.1"
order: 2
---

# v1.0.0 - v1.0.1: Erste Veröffentlichung und Slash-Befehlsbehebung

## Versionsübersicht

**v1.0.0** (2026-01-11) ist die Anfangsversion von opencode-mystatus und bringt die Kernfunktionen der Mehrplattformkreditabfrage.

**v1.0.1** (2026-01-11) folgte unmittelbar und behebt das kritische Problem der Slash-Befehlsunterstützung.

## v1.0.1 - Slash-Befehlsbehebung

### Behobenes Problem

**Einbindung des `command/`-Verzeichnisses in das npm-Paket**

- **Problembeschreibung**: Nach Veröffentlichung von v1.0.0 wurde festgestellt, dass der Slash-Befehl `/mystatus` nicht normal funktioniert
- **Ursachenanalyse**: Beim npm-Packaging wurde das `command/`-Verzeichnis übersehen, sodass OpenCode den Slash-Befehl nicht erkennen kann
- **Lösungsansatz**: Aktualisierung des Felds `files` in `package.json`, um sicherzustellen, dass das `command/`-Verzeichnis im Veröffentlichungspaket enthalten ist
- **Auswirkungsbereich**: Betrifft nur Benutzer, die über npm installiert haben, manuelle Installation ist nicht betroffen

### Upgrade-Empfehlung

Wenn Sie bereits v1.0.0 installiert haben, wird empfohlen, sofort auf v1.0.1 zu aktualisieren, um vollständige Slash-Befehlsunterstützung zu erhalten:

```bash
## Upgrade auf neueste Version
npm update @vbgate/opencode-mystatus
```

## v1.0.0 - Erste Veröffentlichung

### Neue Funktionen

**1. Mehrplattformkreditabfrage**

Unterstützt Kreditnutzung der folgenden Plattformen mit einem Klick abzufragen:

| Plattform | Unterstützte Abonnementtypen | Kreditart |
| ---- | -------------- | -------- |
| OpenAI | Plus/Team/Pro | 3-Stunden-Kredit, 24-Stunden-Kredit |
| Zhipu AI | Coding Plan | 5-Stunden-Token-Kredit, MCP-monatliche Quote |

**2. Visueller Fortschrittsbalken**

Visualisiert Kreditnutzung intuitiv:

```
OpenAI (user@example.com)
━━━━━━━━━━━━━━━━━━━ 75%
Verwendet 750 / 1000 Anfragen
```

**3. Mehrsprachige Unterstützung**

- Chinesisch (vereinfacht)
- Englisch

Automatische Spracherkennung, ohne manuellen Wechsel.

**4. API-Key-Sicherheitsmaskierung**

Alle sensiblen Informationen (API-Key, OAuth-Token) werden automatisch maskiert angezeigt:

```
Zhipu AI (zhipuai-coding-plan)
API-Key: sk-a1b2****xyz
```

## Verwendungsmethoden

### Slash-Befehl (empfohlen)

Geben Sie in OpenCode ein:

```
/mystatus
```

### Natürliche Sprache

Sie können auch Fragen in natürlicher Sprache stellen:

```
Zeigen Sie alle meine KI-Plattformkredite an
```

## Upgrade-Leitfaden

### Upgrade von v1.0.0 auf v1.0.1

```bash
npm update @vbgate/opencode-mystatus
```

Nach dem Upgrade starten Sie OpenCode neu, um den Slash-Befehl `/mystatus` zu verwenden.

### Erste Installation

```bash
npm install -g @vbgate/opencode-mystatus
```

Nach der Installation geben Sie in OpenCode `/mystatus` ein, um Kredite aller Plattformen abzufragen.

## Bekannte Einschränkungen

- v1.0.0 unterstützt GitHub Copilot nicht (v1.2.0 neu hinzugefügt)
- v1.0.0 unterstützt Z.ai nicht (v1.1.0 neu hinzugefügt)

Wenn Sie diese Funktionen benötigen, aktualisieren Sie auf die neueste Version.

## Nächster Schritt

Sehen Sie das [Änderungsprotokoll v1.2.0 - v1.2.4](../v120-v124/), um neue Funktionen wie GitHub Copilot-Unterstützung kennenzulernen.

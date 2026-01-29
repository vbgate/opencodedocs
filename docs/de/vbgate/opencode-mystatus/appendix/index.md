---
title: "Anhang: Technische Referenz | opencode-mystatus"
sidebarTitle: "Anhang"
subtitle: "Anhang: Technische Referenz"
description: "Lernen Sie die technischen Details von opencode-mystatus kennen. Erfahren Sie mehr über Datenmodelle, API-Endpunkte und wie Sie neue Plattformen erweitern."
order: 5
---

# Anhang

Dieses Kapitel bietet technische Referenzmaterialien zu opencode-mystatus, geeignet für Entwickler und fortgeschrittene Benutzer.

## Referenzdokumentation

### [Datenmodelle](./data-models/)

Erfahren Sie mehr über die Datenstruktur des Plugins:

- Struktur der Authentifizierungsdateien (`auth.json`, `antigravity-accounts.json`, `copilot-quota-token.json`)
- API-Antwortformate verschiedener Plattformen
- Interne Datentypdefinitionen
- Wie man Unterstützung für neue Plattformen erweitert

### [API-Endpunktesammlung](./api-endpoints/)

Zeigen Sie alle offiziellen APIs an, die das Plugin aufruft:

- OpenAI-Kreditabfrage-Endpunkt
- Zhipu AI / Z.ai-Kreditabfrage-Endpunkt
- GitHub Copilot-Kreditabfrage-Endpunkt
- Google Cloud Antigravity-Kreditabfrage-Endpunkt
- Authentifizierungsmethode und Anfrageformat

## Anwendungsszenarien

| Szenario | Empfohlenes Dokument |
|------|---------|
| Funktionsweise des Plugins verstehen | [Datenmodelle](./data-models/) |
| Manuell API aufrufen | [API-Endpunktesammlung](./api-endpoints/) |
| Unterstützung für neue Plattformen erweitern | Beide Dokumente erforderlich |
| Datenformatprobleme beheben | [Datenmodelle](./data-models/) |

## Verwandte Links

- [GitHub-Repository](https://github.com/vbgate/opencode-mystatus) - Vollständiger Quellcode
- [NPM-Paket](https://www.npmjs.com/package/opencode-mystatus) - Version und Abhängigkeiten
- [Änderungsprotokoll](../changelog/) - Versionshistorie

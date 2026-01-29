---
title: "Anhang: Technisches Referenzhandbuch | Antigravity-Manager"
sidebarTitle: "Technisches Wörterbuch"
subtitle: "Anhang: Technisches Referenzhandbuch"
description: "Durchsuche technische Referenzmaterialien für Antigravity Tools, einschließlich API-Endpunktsübersicht, Datenbankstruktur und Funktionsgrenzen. Finde schnell Schlüsselinformationen."
order: 500
---

# Anhang

Dieses Kapitel sammelt technische Referenzmaterialien für Antigravity Tools, einschließlich API-Endpunktsübersicht, Datenbankstruktur und Funktionsgrenzen experimenteller Funktionen. Wenn du schnell ein technisches Detail nachschlagen musst, ist dies dein "Wörterbuch".

## Kapitelinhalt

| Dokument | Beschreibung | Geeignet für |
| --- | --- | --- |
| **[Endpunkte-Übersicht](./endpoints/)** | Übersicht der öffentlichen HTTP-Routen: OpenAI/Anthropic/Gemini/MCP-Endpunkte, Authentifizierungsmodi und Header-Formate | Neue Client-Integration, 404/401-Fehlerbehebung |
| **[Daten & Modelle](./storage-models/)** | Kontodateistruktur, SQLite-Statistikdatenbankstruktur, Definitionen wichtiger Felder | Backup & Migration, direkte Datenbankabfragen, Fehlerbehebung |
| **[z.ai Integrationsgrenzen](./zai-boundaries/)** | Liste der implementierten vs. explizit nicht implementierten Funktionen von z.ai | Bewertung von z.ai-Fähigkeiten, Vermeidung von Missbrauch |

## Empfohlener Lernpfad

```
Endpunkte-Übersicht → Daten & Modelle → z.ai Integrationsgrenzen
    ↓              ↓              ↓
 Welche Pfade    Wo die Daten    Wo die Grenzen
 zu rufen        liegen         liegen
```

1. **Beginne mit der Endpunkte-Übersicht**: Verstehe, welche APIs verfügbar sind und wie die Authentifizierung konfiguriert wird
2. **Dann lies Daten & Modelle**: Verstehe die Datenbankstruktur für Backup, Migration und direkte Fehlerbehebung
3. **Zum Schluss lies z.ai Integrationsgrenzen**: Wenn du z.ai verwendest, hilft dir dieser Artikel, "nicht implementierte" Funktionen von "verfügbaren" zu unterscheiden

::: tip Diese Dokumente sind nicht "Pflichtlektüre"
Der Anhang ist Referenzmaterial, kein Tutorial. Du musst ihn nicht von vorne bis hinten lesen – konsultiere ihn bei konkreten Problemen.
:::

## Voraussetzungen

::: warning Empfohlene Vorbereitung
- [Was sind Antigravity Tools](../start/getting-started/): Baue ein grundlegendes mentales Modell auf
- [Starte den lokalen Reverse Proxy und integriere den ersten Client](../start/proxy-and-first-client/): Lasse den grundlegenden Prozess laufen
:::

Wenn du den grundlegenden Prozess noch nicht zum Laufen gebracht hast, empfehle ich, zuerst die Tutorials im Abschnitt [Erste Schritte](../start/) zu absolvieren.

## Nächste Schritte

Nach dem Lesen des Anhangs kannst du:

- **[Versionsentwicklung](../changelog/release-notes/)**: Informiere dich über aktuelle Änderungen und führe vor dem Upgrade Verifizierungen durch
- **[Häufig gestellte Fragen](../faq/invalid-grant/)**: Gehe zum FAQ-Abschnitt, um Antworten auf spezifische Fehlermeldungen zu finden
- **[Erweiterte Konfiguration](../advanced/config/)**: Tauche tiefer in fortgeschrittene Funktionen wie Hot-Reload von Konfigurationen und Scheduling-Strategien ein

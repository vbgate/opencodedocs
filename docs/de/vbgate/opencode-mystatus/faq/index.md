---
title: "FAQ: Häufige Fragen | opencode-mystatus"
sidebarTitle: "FAQ"
subtitle: "FAQ: Häufige Fragen"
description: "Lernen Sie die Lösungen zu häufigen Problemen bei der Verwendung von opencode-mystatus. Finden Sie Antworten zu Fehlerbehebung, Sicherheit und Konfiguration."
order: 4
---

# Häufige Fragen

Dieses Kapitel sammelt häufige Fragen und Lösungen bei der Verwendung von opencode-mystatus.

## Problemerkennung

### [Fehlerbehebung](./troubleshooting/)

Lösen Sie verschiedene Abfragefehler:

- Authentifizierungsdatei kann nicht gelesen werden
- Token abgelaufen oder unzureichende Berechtigungen
- API-Anfrage fehlgeschlagen oder Zeitüberschreitung
- Plattformspezifische Fehlerbehandlung

### [Sicherheit und Privatsphäre](./security/)

Erfahren Sie mehr über den Sicherheitsmechanismus des Plugins:

- Schreibgeschützter lokaler Dateizugriff
- Automatische Maskierung von API-Keys
- Nur Aufruf offizieller Schnittstellen
- Keine Datenübertragung oder -speicherung

## Schnellsuche

Suchen Sie basierend auf der Fehlermeldung die Lösung:

| Fehler-Schlüsselwort | Mögliche Ursache | Lösung |
|-----------|---------|---------|
| `auth.json not found` | Authentifizierungsdatei existiert nicht | [Fehlerbehebung](./troubleshooting/) |
| `Token expired` | Token abgelaufen | [Fehlerbehebung](./troubleshooting/) |
| `Permission denied` | Unzureichende Berechtigungen | [Copilot-Authentifizierungskonfiguration](../advanced/copilot-auth/) |
| `project_id missing` | Unvollständige Google Cloud-Konfiguration | [Google Cloud-Konfiguration](../advanced/google-setup/) |
| `Request timeout` | Netzwerkprobleme | [Fehlerbehebung](./troubleshooting/) |

## Hilfe erhalten

Wenn dieses Kapitel Ihr Problem nicht löst:

- Reichen Sie einen [Issue](https://github.com/vbgate/opencode-mystatus/issues) ein - Fehler berichten oder neue Funktionen anfordern
- Sehen Sie sich das [GitHub-Repository](https://github.com/vbgate/opencode-mystatus) an - aktuelle Version und Quellcode erhalten

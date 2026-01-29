---
title: "FAQ: Fehlerbehebung und Lösungen | Antigravity-Manager"
sidebarTitle: "Umgang mit Fehlern"
subtitle: "FAQ: Fehlerbehebung und Lösungen"
description: "Beherrschen Sie die Fehlerbehebung bei häufigen Problemen mit Antigravity Tools. Enthält schnelle Diagnose und Lösungen für inaktive Konten, Authentifizierungsfehler und Ratenbegrenzungen."
order: 4
---

# Häufig gestellte Fragen

In diesem Abschnitt finden Sie die am häufigsten auftretenden Fehlercodes und Ausnahmesituationen bei der Verwendung von Antigravity Tools. Er hilft Ihnen, die Ursache von Problemen schnell zu identifizieren und Lösungen zu finden.

## In diesem Abschnitt

| Problemtyp | Seite | Beschreibung |
|--- | --- | ---|
| Konto inaktiv | [invalid_grant und automatische Kontosperrung](./invalid-grant/) | Konto plötzlich nicht mehr verfügbar? Erfahren Sie die Gründe für den Verfall von OAuth-Token und den Wiederherstellungsprozess |
| Authentifizierungsfehler | [401/Authentifizierungsfehler](./auth-401/) | Anfrage abgelehnt? Überprüfen Sie die auth_mode-Konfiguration und das Header-Format |
| Ratenbegrenzung | [429/Kapazitätsfehler](./429-rotation/) | Häufige 429-Fehler? Unterscheiden Sie zwischen Kontingentmangel und Upstream-Begrenzung und nutzen Sie Rotationsstrategien zur Verringerung der Auswirkungen |
| Pfadfehler | [404/Pfadinkompatibilität](./404-base-url/) | API 404? Lösen Sie das Verkettungsproblem zwischen Base URL und /v1-Präfix |
| Streaming-Exceptions | [Streaming-Unterbrechung/0 Token/Signaturverfall](./streaming-0token/) | Antwort unterbrochen oder leer? Verstehen Sie den Selbstheilungsmechanismus des Proxys und den Fehlersuchpfad |

## Empfehlung zum Lernpfad

**Fehlerbehebung nach Fehlercode**: Springen Sie bei einem konkreten Fehler direkt zur entsprechenden Seite.

**Systematisches Lernen**: Wenn Sie ein umfassendes Verständnis der möglichen Probleme erlangen möchten, empfehlen wir, die folgenden Abschnitte in dieser Reihenfolge zu lesen:

1. **[404/Pfadinkompatibilität](./404-base-url/)** — Das häufigste Onboarding-Problem, meist die erste Hürde
2. **[401/Authentifizierungsfehler](./auth-401/)** — Pfad korrekt, aber Anfrage abgelehnt? Überprüfen Sie die Authentifizierungskonfiguration
3. **[invalid_grant und automatische Kontosperrung](./invalid-grant/)** — Probleme auf Kontoebene
4. **[429/Kapazitätsfehler](./429-rotation/)** — Anfrage erfolgreich, aber begrenzt
5. **[Streaming-Unterbrechung/0 Token/Signaturverfall](./streaming-0token/)** — Fortgeschrittene Probleme, betreffen Streaming-Antworten und Signaturmechanismen

## Voraussetzungen

::: warning Empfohlene Voraussetzungen
- [Starten Sie den lokalen Reverse-Proxy und binden Sie den ersten Client ein](../start/proxy-and-first-client/) — Stellen Sie sicher, dass die grundlegende Umgebung funktioniert
- [Konto hinzufügen](../start/add-account/) — Verstehen Sie die korrekte Methode zum Hinzufügen von Konten
:::

## Nächste Schritte

Nach der Fehlerbehebung können Sie mit vertieftem Studium fortfahren:

- **[Hochverfügbare Planung](../advanced/scheduling/)** — Verwenden Sie Rotations- und Wiederholungsstrategien, um Fehler zu reduzieren
- **[Proxy Monitor](../advanced/monitoring/)** — Verfolgen Sie Anfragedetails mit dem Protokollsystem
- **[Komplette Konfiguration](../advanced/config/)** — Verstehen Sie die Funktion aller Konfigurationsoptionen

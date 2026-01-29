---
title: "Erweiterte Konfiguration: Detaillierte Funktionen | Antigravity-Manager"
order: 300
sidebarTitle: "System auf Produktionsniveau bringen"
subtitle: "Erweiterte Konfiguration: Detaillierte Funktionen"
description: "Erfahren Sie mehr über die erweiterte Konfiguration von Antigravity-Manager. Beherrschen Sie fortgeschrittene Funktionen wie Kontoverwaltung, Modellrouting, Quotenmanagement und Überwachungsstatistiken."
---

# Erweiterte Konfiguration

Dieses Kapitel vertieft die fortgeschrittenen Funktionen von Antigravity Tools: Konfigurationsmanagement, Sicherheitsstrategien, Kontoverwaltung, Modellrouting, Quotenmanagement, Überwachungsstatistiken sowie Server-Bereitstellungsoptionen. Nachdem Sie diese Inhalte beherrschen, können Sie Antigravity Tools von "funktionierend" auf "benutzerfreundlich, stabil und betriebsbereit" upgraden.

## In diesem Kapitel

| Tutorial | Beschreibung |
|--- | ---|
| [Konfiguration komplett](./config/) | Vollständige Felder von AppConfig/ProxyConfig, Speicherorte und Hot-Update-Semantik |
| [Sicherheit und Datenschutz](./security/) | `auth_mode`, `allow_lan_access` und Sicherheitsbaseline-Design |
| [Hochverfügbare Verwaltung](./scheduling/) | Rotation, feste Konten, klebrige Sitzungen und Retry-Mechanismen |
|--- | ---|
| [Quotenmanagement](./quota/) | Kombinationsstrategie aus Quota Protection + Smart Warmup |
| [Proxy Monitor](./monitoring/) | Anforderungsprotokolle, Filterung, Detailrekonstruktion und Export |
| [Token-Statistiken](./token-stats/) | Kostenperspektive und Diagramminterpretation |
|--- | ---|
| [Systemfunktionen](./system/) | Mehrsprachigkeit/Themen/Updates/Autostart/HTTP API Server |
| [Server-Bereitstellung](./deployment/) | Docker noVNC vs Headless Xvfb Auswahl und Betrieb |

## Empfohlener Lernpfad

::: tip Empfohlene Reihenfolge
Dieses Kapitel enthält umfangreiche Inhalte. Es wird empfohlen, sie in Modulen zu lernen:
:::

**Erste Phase: Konfiguration und Sicherheit (Pflicht)**

```
Konfiguration komplett → Sicherheit und Datenschutz
config                   security
```

Verstehen Sie zunächst das Konfigurationssystem (was einen Neustart erfordert, was Hot-Update unterstützt), dann lernen Sie die Sicherheitseinstellungen (insbesondere bei Exposition im LAN/Internet).

**Zweite Phase: Verwaltung und Routing (Empfohlen)**

```
Hochverfügbare Verwaltung → Modell-Routing
scheduling               model-router
```

Lernen Sie, wie Sie maximale Stabilität mit minimaler Anzahl von Konten erreichen, und nutzen Sie dann Modell-Routing, um Upstream-Änderungen zu abstrahieren.

**Dritte Phase: Quoten und Überwachung (Bei Bedarf)**

```
Quotenmanagement → Proxy Monitor → Token-Statistiken
quota            monitoring      token-stats
```

Verhindern Sie unbemerkte Quotenverschwendung, machen Sie die Blackbox zu einem beobachtbaren System und quantifizieren Sie die Kostenoptimierung.

**Vierte Phase: Stabilität und Bereitstellung (Fortgeschritten)**

```
Stabilität langer Sitzungen → Systemfunktionen → Server-Bereitstellung
context-compression          system          deployment
```

Lösen Sie die versteckten Probleme langer Sitzungen, machen Sie den Client mehr zu einem Produkt, und lernen Sie schließlich die Server-Bereitstellung.

**Schnellauswahl**:

| Ihre Szenario | Empfohlen zuerst |
|--- | ---|
| Mehrkontenrotation instabil | [Hochverfügbare Verwaltung](./scheduling/) |
| Einen Modellnamen fixieren | [Modell-Routing](./model-router/) |
| Quoten immer verbraucht | [Quotenmanagement](./quota/) |
| Anforderungsprotokolle ansehen | [Proxy Monitor](./monitoring/) |
|--- | ---|
| Lange Konversationen fehleranfällig | [Stabilität langer Sitzungen](./context-compression/) |
| Im LAN freigeben | [Sicherheit und Datenschutz](./security/) |
| Auf Server bereitstellen | [Server-Bereitstellung](./deployment/) |

## Voraussetzungen

::: warning Bitte vor dem Start bestätigen
- [Schnellstart](../start/)-Kapitel abgeschlossen (mindestens Installation, Konto hinzufügen, Reverse-Proxy starten)
- Mindestens ein Protokoll aus [Plattformen und Integrationen](../platforms/) integriert (z.B. OpenAI oder Anthropic)
- Lokaler Reverse-Proxy antwortet korrekt auf Anforderungen
:::

## Nächste Schritte

Nach Abschluss dieses Kapitels können Sie weiter lernen:

- [Häufig gestellte Fragen](../faq/): Leitfaden zur Fehlerbehebung bei Problemen wie 401/404/429/Streaming-Unterbrechungen
- [Anhang](../appendix/): Referenzmaterial wie Endpunkte-Schnellreferenz, Datenmodelle, Grenzen von z.ai-Funktionen usw.

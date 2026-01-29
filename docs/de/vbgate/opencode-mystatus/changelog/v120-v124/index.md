---
title: "v1.2.0-v1.2.4: Copilot | opencode-mystatus"
sidebarTitle: "v1.2.0-v1.2.4"
subtitle: "v1.2.0-v1.2.4: Copilot und Dokumentation"
description: "Lernen Sie über die Updates von opencode-mystatus v1.2.0 bis v1.2.4. Neue Copilot-Unterstützung, verbesserte Dokumentation und behobene Lint-Fehler."
tags:
  - "changelog"
  - "v1.2.0"
  - "v1.2.1"
  - "v1.2.2"
  - "Copilot"
order: 1
---

# v1.2.0 - v1.2.4: Copilot-Unterstützung und Dokumentationsverbesserungen

## Versionsübersicht

Diese Aktualisierung (v1.2.0 - v1.2.4) bringt wichtige Funktionserweiterungen für opencode-mystatus, insbesondere die **Unterstützung für die GitHub Copilot-Kreditabfrage**. Gleichzeitig wurden die Installationsdokumentation verbessert und Code-lint-Fehler behoben.

**Hauptänderungen**:
- ✅ Neue GitHub Copilot Premium Requests-Abfrage
- ✅ Integration der GitHub-Internen API
- ✅ Aktualisierung chinesischer und englischer Dokumentation
- ✅ Verbesserung der Installationsanleitung, Entfernung von Versionsbeschränkungen
- ✅ Behebung von Code-lint-Fehlern

## [1.2.2] - 2026-01-14

### Dokumentationsverbesserungen

- **Aktualisierung der Installationsanleitung**: Entfernung der Versionsbeschränkung in `README.md` und `README.zh-CN.md`
- **Automatische Update-Unterstützung**: Benutzer können jetzt automatisch die neueste Version erhalten, ohne die Versionsnummer manuell ändern zu müssen

## [1.2.1] - 2026-01-14

### Fehlerbehebung

- **Behobung von lint-Fehlern**: Entfernung des ungenutzten `maskString`-Imports in `copilot.ts`

## [1.2.0] - 2026-01-14

### Neue Funktionen

#### GitHub Copilot-Unterstützung

Dies ist die Kernfunktion dieser Aktualisierung:

- **Neue Copilot-Kreditabfrage**: Unterstützt die Anzeige der Premium Requests-Nutzung von GitHub Copilot
- **Integration der GitHub-Internen API**: Hinzufügen des Moduls `copilot.ts` zum Abrufen von Kreditdaten über die GitHub-API
- **Dokumentation aktualisiert**: Hinzufügen von Copilot-bezogenen Dokumentationen in `README.md` und `README.zh-CN.md`

**Unterstützte Authentifizierungsmethoden**:
1. **Fine-grained PAT** (empfohlen): Vom Benutzer erstellter Fine-grained Personal Access Token
2. **OAuth-Token**: OpenCode OAuth-Token (benötigt Copilot-Berechtigung)

**Abfrageinhalt**:
- Gesamtkredit und verwendeter Wert von Premium Requests
- Nutzungsdetails verschiedener Modelle
- Abonnementtyperkennung (free, pro, pro+, business, enterprise)

**Verwendungsbeispiel**:

```bash
# mystatus-Befehl ausführen
/mystatus

# Sie werden sehen, dass die Ausgabe den GitHub Copilot-Abschnitt enthält
Account:        GitHub Copilot (@username)

  Premium Requests  ██████████░░░░░░░░░░ 75% (75/300)

  Modelldetails:
    gpt-4o: 150 Anfragen
    claude-3.5-sonnet: 75 Anfragen

  Abrechnungszeitraum: 2026-01
```

## Upgrade-Leitfaden

### Automatisches Upgrade (empfohlen)

Da v1.2.2 die Installationsanleitung aktualisiert und die Versionsbeschränkung entfernt hat, können Sie jetzt:

```bash
# Installieren mit dem neuesten Tag
opencode plugin install vbgate/opencode-mystatus@latest
```

## Bekannte Probleme

### Copilot-Berechtigungsproblem

Wenn Ihr OpenCode OAuth-Token nicht über die Copilot-Berechtigung verfügt, wird bei der Abfrage ein Hinweis angezeigt. Lösung:

1. Fine-grained PAT verwenden (empfohlen)
2. OpenCode neu autorisieren, um sicherzustellen, dass die Copilot-Berechtigung markiert ist

## Nächste Versionen

Zukünftige Versionen können folgende Verbesserungen enthalten:

- [ ] Unterstützung weiterer GitHub Copilot-Abonnementtypen
- [ ] Optimierung des Copilot-Kreditanzeigeformats
- [ ] Hinzufügen der Kreditwarnfunktion
- [ ] Unterstützung weiterer KI-Plattformen

## Verwandte Dokumentationen

- [Copilot-Kreditabfrage](/de/vbgate/opencode-mystatus/platforms/copilot-usage/)
- [Copilot-Authentifizierungskonfiguration](/de/vbgate/opencode-mystatus/advanced/copilot-auth/)
- [Häufige Fehlerbehebung](/de/vbgate/opencode-mystatus/faq/troubleshooting/)

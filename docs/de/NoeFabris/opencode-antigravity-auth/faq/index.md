---
title: "Häufige Fragen: OAuth-Authentifizierung und Modellfehlerbehebung | Antigravity Auth"
sidebarTitle: "Was tun bei Authentifizierungsfehlern"
subtitle: "Häufige Fragen: OAuth-Authentifizierung und Modellfehlerbehebung"
description: "Lernen Sie die häufigsten Probleme und Lösungen für das Antigravity Auth-Plugin kennen. Erfahren Sie, wie Sie OAuth-Authentifizierungsfehler beheben, 'Modell nicht gefunden'-Fehler behandeln, Plugin-Kompatibilität konfigurieren und andere Probleme schnell lösen können."
order: 4
---

# Häufige Fragen

In diesem Abschnitt finden Sie die häufigsten Probleme und ihre Lösungen bei der Verwendung des Antigravity Auth-Plugins. Ob OAuth-Authentifizierungsfehler, Modellanforderungsfehler oder Plugin-Kompatibilitätsprobleme – hier finden Sie entsprechende Lösungshinweise.

## Voraussetzungen

::: warning Stellen Sie vor dem Start sicher
- ✅ Haben Sie die [Schnellinstallation](../start/quick-install/) abgeschlossen und erfolgreich ein Konto hinzugefügt
- ✅ Haben Sie die [erste Authentifizierung](../start/first-auth-login/) durchgeführt und den OAuth-Ablauf verstanden
:::

## Lernpfad

Wählen Sie basierend auf Ihrem Problemtyp den entsprechenden Lösungshinweis:

### 1. [OAuth-Authentifizierungsfehler beheben](./common-auth-issues/)

Lösen Sie häufige Probleme mit OAuth-Authentifizierung, Token-Aktualisierung und Konten.

- Browser-Autorisierung erfolgreich, aber Terminal zeigt "Autorisierung fehlgeschlagen"
- Plötzlicher Fehler "Permission Denied" oder "invalid_grant"
- OAuth-Callback im Safari-Browser fehlgeschlagen
- Authentifizierung kann in WSL2/Docker-Umgebungen nicht abgeschlossen werden

### 2. [Konto migrieren](./migration-guide/)

Migrieren Sie Konten zwischen verschiedenen Computern und behandeln Sie Version-Upgrades.

- Konto vom alten Computer auf den neuen Computer übertragen
- Formatänderungen des Speichers verstehen (v1/v2/v3)
- Invalid_grant-Fehler nach Migration lösen

### 3. [Modell nicht gefunden beheben](./model-not-found/)

Lösen Sie Probleme mit "Modell nicht gefunden", 400-Fehlern und anderen modellbezogenen Problemen.

- Fehlerbehebung bei "Model not found"
- "Invalid JSON payload received. Unknown name 'parameters'" 400-Fehler
- Fehler beim Aufrufen von MCP-Servern

### 4. [Plugin-Kompatibilität](./plugin-compatibility/)

Lösen Sie Kompatibilitätsprobleme mit oh-my-opencode, DCP und anderen Plugins.

- Plugin-Ladereihenfolge korrekt konfigurieren
- Konfliktverursachende Authentifizierungsmethoden in oh-my-opencode deaktivieren
- PID-Offset für parallele Agent-Szenarien aktivieren

### 5. [ToS-Warnung](./tos-warning/)

Verstehen Sie die Risiken der Nutzung und vermeiden Sie Kontosperrungen.

- Die Einschränkungen der Google-Nutzungsbedingungen verstehen
- Risikoreiche Szenarien identifizieren (neue Konten, dichte Anforderungen)
- Best Practices zur Vermeidung von Kontosperrungen beherrschen

## Schnelles Problemlösen

| Fehlererscheinung | Empfohlene Lektüre |
|--- | ---|
| Authentifizierungsfehler, Autorisierungs-Timeout | [OAuth-Authentifizierungsfehler beheben](./common-auth-issues/) |
| invalid_grant, Permission Denied | [OAuth-Authentifizierungsfehler beheben](./common-auth-issues/) |
| Model not found, 400-Fehler | [Modell nicht gefunden beheben](./model-not-found/) |
| Konflikte mit anderen Plugins | [Plugin-Kompatibilität](./plugin-compatibility/) |
| Neuer Computer, Version-Upgrade | [Konto migrieren](./migration-guide/) |
| Bedenken zur Kontosicherheit | [ToS-Warnung](./tos-warning/) |

## Nächste Schritte

Nach der Lösung Ihres Problems können Sie:

- 📖 [Erweiterte Funktionen](../advanced/) lesen, um Multi-Konto-, Sitzungswiederherstellung und andere Funktionen zu beherrschen
- 📚 Im [Anhang](../appendix/) nachlesen, um die Architektur und die vollständige Konfigurationsreferenz zu verstehen
- 🔄 Den [Änderungsprotokoll](../changelog/) verfolgen, um die neuesten Funktionen und Änderungen zu erhalten

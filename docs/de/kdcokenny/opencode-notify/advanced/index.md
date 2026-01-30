---
title: "Erweiterte Nutzung: Tiefere Konfiguration und Optimierung | opencode-notify-Tutorial"
sidebarTitle: "Passe deine Benachrichtigungserfahrung an"
subtitle: "Erweiterte Nutzung: Tiefere Konfiguration und Optimierung"
description: "Lerne die erweiterte Konfiguration von opencode-notify: Konfigurationsreferenz, Ruhezeiten, Terminalerkennung und Best Practices. Optimiere deine Benachrichtigungserfahrung nach deinen Bedürfnissen und steigere deine Effizienz."
tags:
  - "Erweitert"
  - "Konfiguration"
  - "Optimierung"
prerequisite:
  - "/de/kdcokenny/opencode-notify/start/quick-start"
  - "/de/kdcokenny/opencode-notify/start/how-it-works"
order: 3
---

# Erweiterte Nutzung: Tiefere Konfiguration und Optimierung

Dieses Kapitel hilft dir, die fortgeschrittenen Funktionen von opencode-notify zu beherrschen, Konfigurationsoptionen zu verstehen, Benachrichtigungserlebnisse zu optimieren und Benachrichtigungsverhalten nach deinen persönlichen Bedürfnissen anzupassen.

## Lernpfad

Wir empfehlen, dieses Kapitel in der folgenden Reihenfolge zu lernen:

### 1. [Konfigurationsreferenz](./config-reference/)

Verstehe alle verfügbaren Konfigurationsoptionen und ihre Funktionen vollständig.

- Beherrsche die Struktur und Syntax der Konfigurationsdatei
- Lerne Methoden zur Anpassung von Benachrichtigungstönen
- Verstehe die Verwendungsszenarien für die Subsitzungs-Benachrichtigungsumschaltung
- Erfahre die Konfigurationsmethode für Terminaltyp-Overrides

### 2. [Ruhezeiten im Detail](./quiet-hours/)

Lerne, wie du Ruhezeiten einrichtest, um zu bestimmten Zeiten nicht gestört zu werden.

- Konfiguriere Start- und Endzeiten für Ruhezeiten
- Behandle Ruhezeiten über Nacht (z. B. 22:00 - 08:00)
- Deaktiviere bei Bedarf temporär die Ruhezeitanfunktion
- Verstehe die Priorität von Ruhezeiten im Verhältnis zu anderen Filterregeln

### 3. [Terminalerkennungs-Prinzipien](./terminal-detection/)

Verstehe die Funktionsweise der automatischen Terminalerkennung im Detail.

- Lerne, wie das Plugin 37+ Terminal-Emulatoren erkennt
- Verstehe die Implementierung der Fokuserkennung auf der macOS-Plattform
- Beherrsche Methoden zur manuellen Angabe des Terminaltyps
- Verstehe das Standardverhalten bei Erkennungsfehlern

### 4. [Erweiterte Nutzung](./advanced-usage/)

Beherrsche Konfigurationstechniken und Best Practices.

- Konfigurationsstrategien zur Vermeidung von Benachrichtigungs-Spam
- Anpassen des Benachrichtigungsverhaltens an deinen Workflow
- Konfigurationsempfehlungen für Multi-Window- und Multi-Terminal-Umgebungen
- Leistungsoptimierung und Fehlerbehebungstechniken

## Voraussetzungen

Bevor Sie mit diesem Kapitel beginnen, wird empfohlen, die folgenden Grundlagen abzuschließen:

- ✅ **Schnellstart**: Installation des Plugins und grundlegende Konfiguration
- ✅ **Funktionsweise**: Verständnis der Kernfunktionen des Plugins und des Ereignisüberwachungsmechanismus
- ✅ **Plattformfunktionen** (optional): Verständnis der plattformspezifischen Funktionen, die Sie verwenden

::: tip Lernempfehlung
Wenn Sie nur Benachrichtigungstöne anpassen oder Ruhezeiten einrichten möchten, können Sie direkt zur entsprechenden Unterseite springen. Bei Problemen können Sie jederzeit das Kapitel Konfigurationsreferenz konsultieren.
:::

## Nächste Schritte

Nach Abschluss dieses Kapitels können Sie weiter erkunden:

- **[Fehlerbehebung](../../faq/troubleshooting/)**: Lösungen für häufige Probleme und Schwierigkeiten
- **[Häufig gestellte Fragen](../../faq/common-questions/)**: Verständnis wichtiger Fragen, die Nutzer interessieren
- **[Ereignistyp-Erklärung](../../appendix/event-types/)**: Tiefes Erlernen aller Ereignistypen, die das Plugin überwacht
- **[Konfigurationsdatei-Beispiel](../../appendix/config-file-example/)**: Ansehen eines vollständigen Konfigurationsbeispiels mit Kommentaren

---

<details>
<summary><strong>Klicken, um Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-27

| Funktion        | Dateipfad                                                                                    | Zeile    |
|--- | --- | ---|
| Konfigurationsschnittstelle-Definition | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L30-L48) | 30-48   |
| Standardkonfiguration    | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68   |
| Konfigurationsladung    | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114  |
| Ruhezeit-Prüfung | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L181-L199) | 181-199 |
| Terminalerkennung    | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L176) | 145-176 |
| Terminalprozessnamenzuordnung | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84   |

**Wichtige Schnittstellen**:
- `NotifyConfig`: Konfigurationsschnittstelle, enthält alle konfigurierbaren Elemente
- `quietHours`: Ruhezeitkonfiguration (enabled/start/end)
- `sounds`: Soundkonfiguration (idle/error/permission)
- `terminal`: Terminaltyp-Override (optional)

**Wichtige Konstanten**:
- `DEFAULT_CONFIG`: Standardwerte aller Konfigurationselemente
- `TERMINAL_PROCESS_NAMES`: Zuordnungstabelle von Terminalnamen zu macOS-Prozessnamen

</details>

---
title: "Copilot: Premium Requests | opencode-mystatus"
sidebarTitle: "Copilot-Kredit"
subtitle: "Copilot: Premium Requests | opencode-mystatus"
description: "Lernen Sie, wie Sie die Premium Requests-Monatsnutzung von GitHub Copilot anzeigen, Modelldetails abfragen und Übernutzung erkennen."
tags:
  - "github-copilot"
  - "quota"
  - "premium-requests"
  - "pat-authentifizierung"
prerequisite:
  - "start-quick-start"
order: 3
---

# GitHub Copilot-Kreditabfrage: Premium Requests und Modelldetails

::: info Berechtigungsproblem der neuen OpenCode-Integration

Die neueste OAuth-Integration von OpenCode gewährt nicht mehr die Berechtigung zum Zugriff auf die `/copilot_internal/*` API, wodurch die ursprüngliche OAuth-Token-Methode keine Kredite mehr abfragen kann.

Sie können auf einen solchen Fehler stoßen:

```
⚠️ GitHub Copilot-Kreditabfrage vorübergehend nicht verfügbar.
Die neue OAuth-Integration von OpenCode unterstützt keinen Zugriff auf die Kredit-API.

Lösung:
1. Erstellen Sie ein fine-grained PAT (besuchen Sie https://github.com/settings/tokens?type=beta)
2. Setzen Sie 'Plan' unter 'Account permissions' auf 'Read-only'
...
```

Dies ist normal, dieses Tutorial zeigt Ihnen, wie Sie das Problem lösen.

:::

## Was Sie nach diesem Tutorial können

- Schnell anzeigen der Premium Requests-Monatsnutzung von GitHub Copilot
- Kreditunterschiede verschiedener Abonnementtypen (Free/Pro/Pro+/Business/Enterprise) verstehen
- Modelldetails anzeigen (z. B. Nutzungshäufigkeit von GPT-4, Claude)
- Übernutzungsanzahl erkennen und zusätzliche Kosten schätzen
- Berechtigungsproblem der neuen OpenCode-Integration lösen (OAuth-Token kann keine Quote abfragen)

## Wann sollten Sie dies verwenden?

Wenn Sie:
- Schnell alle Modellkredite von GitHub Copilot anzeigen möchten
- Monatliche Quote planen und verschiedene Modelle nutzen möchten
- Mehrere GitHub Copilot-Konten haben und einheitlich verwalten möchten

## Grundlegende Idee

GitHub Copilot bietet zwei API-Abfragemethoden, die unterschiedliche Antwortformate haben:

| Methode | Authentifizierung | API-Typ | Vor- und Nachteile |
|--- | --- | --- | ---|
| **Public Billing API** (empfohlen) | Fine-grained PAT | Öffentliche API | Stabil, detaillierte Modellnutzung, erfordert manuelle Konfiguration |
| **Internal API** (alt) | OAuth Token | Interne API | Automatisch, keine Modelldetails, mögliche Berechtigungsprobleme |

## Folgen Sie mir

### Schritt 1: Abfragebefehl ausführen

Geben Sie in OpenCode den Slash-Befehl ein:

```bash
/mystatus
```

**Was Sie sehen sollten**:
Die Ausgabe enthält Copilot-Kreditinformationen mit Fortschrittsbalken, verwendetem/verbleibendem Wert und Modelldetails.

### Schritt 2: Ausgabe interpretieren

Die Ausgabe enthält folgende Schlüsselinformationen:

**1. Kontoinformation**

```
Account:        GitHub Copilot (pro)
```

Zeigt Ihren Copilot-Abonnementtyp (pro/free/business).

**2. Premium Requests-Quote**

```
Premium Requests [████████░░░░░░░░░░░░░] 40% (180/300)
```

- **Fortschrittsbalken**: Visuelle Darstellung des verbleibenden Anteils
- **Prozent**: Verbleibend 40%
- **Verwendet/Gesamt**: Verwendet 180 Mal, insgesamt 300 Mal

**3. Modelldetails (nur öffentliche API)**

```
Modelldetails:
  gpt-4: 120 Anfragen
  claude-3.5-sonnet: 60 Anfragen
```

Zeigt die Nutzungshäufigkeit jedes Modells, absteigend nach Nutzung (maximal 5 angezeigt).

::: info Warum zeigt meine Ausgabe keine Modelldetails?

Modelldetails werden nur angezeigt, wenn die öffentliche API (Fine-grained PAT) verwendet wird. Bei Verwendung von OAuth-Token (interne API) werden keine Modelldetails angezeigt.

:::

**4. Übernutzung (falls vorhanden)**

Wenn Sie die monatliche Quote überschreiten, wird Folgendes angezeigt:

```
Übernutzung: 25 Anfragen
```

Übernutzung verursacht zusätzliche Kosten, die Tarife finden Sie in den GitHub Copilot-Preisen.

**5. Rücksetzzeit (nur interne API)**

```
Quoterücksetzung: 12d 5h (2026-02-01)
```

Zeigt den Countdown bis zur nächsten Quoterücksetzung.

## Häufige Fehler

### Häufigster Fehler: OAuth-Token kann keine Quote abfragen

::: danger Häufiger Fehler

```
⚠️ GitHub Copilot-Kreditabfrage vorübergehend nicht verfügbar.
Die neue OAuth-Integration von OpenCode unterstützt keinen Zugriff auf die Kredit-API.
```

**Ursache**: Die OAuth-Integration von OpenCode gewährt keine `/copilot_internal/*` API-Berechtigung.

**Lösung**: Verwenden Sie die Methode 1 (Fine-grained PAT) gemäß der Konfiguration.

:::

### Fehler 2: Formatfehler der Konfigurationsdatei

Wenn die Konfigurationsdatei `~/.config/opencode/copilot-quota-token.json` falsch formatiert ist, schlägt die Abfrage fehl.

**Lösung**: Stellen Sie sicher, dass die Datei folgende Felder enthält:

```json
{
  "token": "github_pat_abc123",
  "username": "johndoe",
  "tier": "pro"
}
```

### Fehler 3: Falscher Abonnementtyp

Wenn das Feld `tier` nicht mit Ihrem tatsächlichen Abonnement übereinstimmt, wird die Quotaberechnung falsch.

**Abonnementtyp-Tabelle**:

| Ihr tatsächliches Abonnement | tier-Feld sollte sein | Falsches Beispiel |
|--- | --- | ---|
| Free | `free` | `pro` ❌ |
| Pro | `pro` | `free` ❌ |
| Pro+ | `pro+` | `pro` ❌ |
| Business | `business` | `enterprise` ❌ |
| Enterprise | `enterprise` | `business` ❌ |

## Zusammenfassung

- **Premium Requests** ist die Hauptquote-Kennzahl von Copilot
- **Abonnementtypen** bestimmen die monatliche Quote: Free 50, Pro 300, Pro+ 1500, Business 300, Enterprise 1000
- **Übernutzung** verursacht zusätzliche Kosten
- **Fine-grained PAT** ist die empfohlene Authentifizierungsmethode
- **OAuth-Token** kann aufgrund von Berechtigungsproblemen fehlschlagen

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Google Cloud-Kreditabfrage](../google-usage/)**.
>
> Sie werden lernen:
> - 4 Modelle (G3 Pro, G3 Image, G3 Flash, Claude) und deren Unterschiede
> - Verwaltung mehrerer Konten
> - Authentifizierungsdateilesemmechanismus

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|

**Wichtige Konstanten**:

- `COPILOT_PLAN_LIMITS`: Monatliche Quoten verschiedener Abonnementtypen (Zeilen 397-403)
  - `free: 50`
  - `pro: 300`
  - `pro+: 1500`
  - `business: 300`
  - `enterprise: 1000`

</details>

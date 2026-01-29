---
title: "OpenAI-Kredit: 3h/24h Abfrage | opencode-mystatus"
sidebarTitle: "OpenAI-Kredit"
subtitle: "OpenAI-Kredit: 3h/24h Abfrage"
description: "Lernen Sie die OpenAI-Kreditabfrage für 3-Stunden- und 24-Stunden-Fenster. Verstehen Sie Rate-Limits, Haupt- und Nebenfenster, Plus/Team/Pro-Unterschiede und lösen Token-Ablaufprobleme."
tags:
  - "OpenAI"
  - "Kreditabfrage"
  - "API-Quote"
prerequisite:
  - "start-quick-start"
  - "start-understanding-output"
order: 1
---

# OpenAI-Kreditabfrage: 3-Stunden- und 24-Stunden-Kredite

## Was Sie nach diesem Tutorial können

- Verwenden Sie `/mystatus`, um Kredite von OpenAI Plus/Team/Pro-Abonnements abzufragen
- Verstehen Sie die Informationen zu 3-Stunden- und 24-Stunden-Krediten in der Ausgabe
- Verstehen Sie den Unterschied zwischen Haupt- und Nebenfenstern
- Erfahren Sie, wie Token-Ablauf behandelt wird

## Ihre aktuelle Situation

Die OpenAI-API-Aufrufe sind begrenzt. Nach Überschreitung werden Sie temporär eingeschränkt. Aber Sie wissen nicht:
- Wie viel Kredit verbleibt aktuell?
- Welches der 3-Stunden- und 24-Stunden-Fenster wird verwendet?
- Wann wird zurückgesetzt?
- Warum werden manchmal Daten aus zwei Fenstern angezeigt?

Wenn Sie diese Informationen nicht rechtzeitig kennen, kann dies Ihren Fortschritt bei der Entwicklung mit ChatGPT beeinträchtigen.

## Wann sollten Sie dies verwenden?

Wenn Sie:
- Häufig OpenAI-API zur Entwicklung verwenden
- Langsamere Antworten oder Rate-Limiting bemerken
- Die Nutzung von Teamkonten erfahren möchten
- Wann der Kredit zurückgesetzt wird, wissen möchten

## Grundlegende Idee

OpenAI hat zwei Rate-Limiting-Fenster für API-Aufrufe:

| Fenstertyp | Dauer | Funktion |
|---------|------|------|
| **Hauptfenster** (primary) | Wird vom OpenAI-Server zurückgegeben | Verhindert zahlreiche Aufrufe in kurzer Zeit |
| **Nebenfenster** (secondary) | Wird vom OpenAI-Server zurückgegeben (kann fehlen) | Verhindert langfristige Übernutzung |

mystatus fragt beide Fenster parallel ab und zeigt für jedes:
- Verwendeten Prozentsatz
- Verbleibenden Kredit-Fortschrittsbalken
- Zeit bis zur Rücksetzung

::: info
Die Fensterausführungszeit wird vom OpenAI-Server zurückgegeben und kann für verschiedene Abonnementtypen (Plus, Team, Pro) unterschiedlich sein.
:::

## Folgen Sie mir

### Schritt 1: Abfragebefehl ausführen

Geben Sie in OpenCode `/mystatus` ein, das System fragt automatisch die Kreditinformationen aller konfigurierten Plattformen ab.

**Was Sie sehen sollten**:
Enthält Kreditinformationen von Plattformen wie OpenAI, Zhipu AI, Z.ai, Copilot, Google Cloud (abhängig davon, welche Plattformen Sie konfiguriert haben).

### Schritt 2: OpenAI-Abschnitt finden

Suchen Sie in der Ausgabe den Abschnitt `## OpenAI Account Quota`.

**Was Sie sehen sollten**:
Ähnlich diesem Inhalt:

```
## OpenAI Account Quota

Account:        user@example.com (plus)

3-hour limit
██████████████████░░░░░░░░ 60% remaining
Resets in: 2h 30m
```

### Schritt 3: Hauptfenster-Informationen interpretieren

Das **Hauptfenster** (primary_window) zeigt normalerweise:
- **Fenstername**: Wie `3-hour limit` oder `24-hour limit`
- **Fortschrittsbalken**: Visuelle Darstellung des verbleibenden Kreditanteils
- **Verbleibender Prozentsatz**: Wie `60% remaining`
- **Rücksetzzeit**: Wie `Resets in: 2h 30m`

**Was Sie sehen sollten**:
- Der Fenstername zeigt die Dauer (3 Stunden / 24 Stunden)
- Je voller der Fortschrittsbalken, desto mehr verbleibt, je leerer, desto schneller wird er aufgebraucht
- Die Rücksetzzeit ist ein Countdown, bei Null wird der Kredit aktualisiert

::: warning
Wenn Sie `Limit reached!` sehen, ist der aktuelle Kredit aufgebraucht, Sie müssen auf die Rücksetzung warten.
:::

### Schritt 4: Nebenfenster anzeigen (falls vorhanden)

Wenn OpenAI Daten des Nebenfensters zurückgibt, sehen Sie:

```
24-hour limit
████████████████████████████ 90% remaining
Resets in: 20h 45m
```

**Was Sie sehen sollten**:
- Das Nebenfenster zeigt eine andere Zeitdimension der Kreditnutzung (normalerweise 24 Stunden)
- Kann einen anderen verbleibenden Prozentsatz haben als das Hauptfenster

::: info
Das Nebenfenster ist ein unabhängiger Kredit-Pool. Wenn das Hauptfenster aufgebraucht ist, wird das Nebenfenster nicht beeinträchtigt und umgekehrt.
:::

### Schritt 5: Abonnementtyp anzeigen

In der `Account`-Zeile können Sie den Abonnementtyp sehen:

```
Account:        user@example.com (plus)
                                   ^^^^^
                                   Abonnementtyp
```

**Häufige Abonnementtypen**:
- `plus`: Persönliches Plus-Abonnement
- `team`: Team-/Organisationsabonnement
- `pro`: Pro-Abonnement

**Was Sie sehen sollten**:
- Ihr Kontotyp wird in Klammern nach der E-Mail angezeigt
- Unterschiedliche Typen können unterschiedliche Kreditbeschränkungen haben

## Kontrollpunkt ✅

Überprüfen Sie, dass Sie Folgendes verstehen:

| Szenario | Was Sie sehen sollten |
|------|----------|
| Hauptfenster verbleibend 60% | Fortschrittsbalken ca. 60% voll, zeigt `60% remaining` |
| Rücksetzung nach 2,5 Stunden | Zeigt `Resets in: 2h 30m` |
| Limit erreicht | Zeigt `Limit reached!` |
| Nebenfenster vorhanden | Haupt- und Nebenfenster haben jeweils eine Zeile Daten |

## Häufige Fehler

### ❌ Falsche Operation: Nicht nach Token-Ablauf aktualisieren

**Fehlererscheinung**: Sie sehen `⚠️ OAuth-Autorisierung abgelaufen` (Chinesisch) oder `⚠️ OAuth token expired` (Englisch)

**Ursache**: Der OAuth-Token ist abgelaufen (bestimmte Dauer vom Server gesteuert), nach Ablauf kann der Kredit nicht abgefragt werden.

**Richtige Operation**:
1. Melden Sie sich in OpenCode erneut bei OpenAI an
2. Der Token wird automatisch aktualisiert
3. Führen Sie `/mystatus` erneut aus, um abzufragen

### ❌ Falsche Operation: Haupt- und Nebenfenster verwechseln

**Fehlererscheinung**: Sie denken, es gibt nur ein Kreditfenster, aber das Hauptfenster ist aufgebraucht und das Nebenfenster wird weiterhin verwendet

**Ursache**: Die beiden Fenster sind unabhängige Kredit-Pools.

**Richtige Operation**:
- Achten Sie auf die Rücksetzzeit beider Fenster
- Hauptfenster setzt schneller zurück, Nebenfenster langsamer
- Ordnen Sie die Verwendung angemessen zu, vermeiden Sie, dass ein Fenster langfristig überlastet ist

### ❌ Falsche Operation: Teamkonto-ID ignorieren

**Fehlererscheinung**: Team-Abonnement zeigt nicht Ihre eigene Nutzung

**Ursache**: Team-Abonnement muss die Teamkonto-ID übergeben, andernfalls wird möglicherweise das Standardkonto abgefragt.

**Richtige Operation**:
- Stellen Sie sicher, dass Sie das richtige Teamkonto in OpenCode angemeldet haben
- Der Token enthält automatisch `chatgpt_account_id`

## Zusammenfassung

mystatus fragt Kredite ab, indem es die offizielle OpenAI-API aufruft:
- Unterstützt OAuth-Authentifizierung (Plus/Team/Pro)
- Zeigt Haupt- und Nebenfenster (falls vorhanden)
- Visualisiert verbleibenden Kredit mit Fortschrittsbalken
- Countdown zeigt Rücksetzzeit
- Erkennung von Token-Ablauf automatisch

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Zhipu AI und Z.ai-Kreditabfrage](../zhipu-usage/)**.
>
> Sie werden lernen:
> - Was ist der 5-Stunden-Token-Kredit
> - Wie man die MCP-monatliche Quote anzeigt
> - Warnhinweise, wenn die Nutzung 80% überschreitet

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
| ----------------------- | --------------------------------------------------------------------------------------------- | ------- |
| OpenAI-Kreditabfrage-Einstieg | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L207-L236) | 207-236 |
| OpenAI-API-Aufruf | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L132-L155) | 132-155 |
| Ausgabe formatieren | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L164-L194) | 164-194 |
| JWT-Token-Analyse | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L64-L73) | 64-73 |
| Benutzer-E-Mail extrahieren | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L78-L81) | 78-81 |
| Token-Ablaufprüfung | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L216-L221) | 216-221 |
| OpenAIAuthData Typdefinition | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L28-L33) | 28-33 |

**Konstanten**:
- `OPENAI_USAGE_URL = "https://chatgpt.com/backend-api/wham/usage"`: Offizielle OpenAI-Kreditabfrage-API

**Wichtige Funktionen**:
- `queryOpenAIUsage(authData)`: Hauptfunktion zum Abfragen von OpenAI-Krediten
- `fetchOpenAIUsage(accessToken)`: Ruft OpenAI-API auf
- `formatOpenAIUsage(data, email)`: Formatiert Ausgabe
- `parseJwt(token)`: Analysiert JWT-Token (keine Standardbibliothek)
- `getEmailFromJwt(token)`: Extrahiert Benutzer-E-Mail aus Token
- `getAccountIdFromJwt(token)`: Extrahiert Teamkonto-ID aus Token

</details>

---
title: "Zhipu: Token-Kredit | opencode-mystatus"
sidebarTitle: "Zhipu-Kredit"
subtitle: "Zhipu AI und Z.ai-Kreditabfrage: 5-Stunden-Token-Kredit und MCP-monatliche Quote"
description: "Lernen Sie den 5-Stunden-Token-Kredit und die MCP-Quote von Zhipu AI und Z.ai abzufragen. Verstehen Fortschrittsbalken und Rücksetzzeit, vermeiden Übernutzung."
tags:
  - "Zhipu AI"
  - "Z.ai"
  - "Kreditabfrage"
  - "Token-Kredit"
  - "MCP-Quote"
prerequisite:
  - "start-quick-start"
order: 2
---

# Zhipu AI und Z.ai-Kreditabfrage: 5-Stunden-Token-Kredit und MCP-monatliche Quote

## Was Sie nach diesem Tutorial können

- Anzeigen der 5-Stunden-Token-Kreditnutzung von **Zhipu AI** und **Z.ai**
- Verstehen der Bedeutung der **MCP-monatlichen Quote** und Rücksetzregeln
- Interpretieren von Informationen wie Fortschrittsbalken, verwendetem Wert, Gesamtwert in der Kreditausgabe
- Wissen, wann ein **Nutzungswarnung** ausgelöst wird

## Ihre aktuelle Situation

Sie verwenden Zhipu AI oder Z.ai zur Anwendungsentwicklung, stoßen aber häufig auf folgende Probleme:

- Sie wissen nicht, wie viel des **5-Stunden-Token-Kredits** noch verbleibt
- Nach Überschreitung des Kredits scheitern die Anfragen, was den Entwicklungsfortschritt beeinträchtigt
- Sie verstehen nicht die genaue Bedeutung der **MCP-monatlichen Quote**
- Sie müssen sich separat bei beiden Plattformen anmelden, um Kredite anzuzeigen - das ist umständlich

## Wann sollten Sie dies verwenden?

Wenn Sie:

- Die APIs von Zhipu AI / Z.ai zur Anwendungsentwicklung verwenden
- Die Token-Nutzung überwachen müssen, um Übernutzung zu vermeiden
- Die monatliche Quote für die MCP-Suchfunktion erfahren möchten
- Gleichzeitig Zhipu AI und Z.ai verwenden und Kredite einheitlich verwalten möchten

## Grundlegende Idee

Das Kreditsystem von **Zhipu AI** und **Z.ai** ist in zwei Typen unterteilt:

| Kreditart | Bedeutung | Rücksetzzyklus |
| -------- | ---- | -------- |
| **5-Stunden-Token-Kredit** | Token-Nutzungskredit für API-Anfragen | Automatische Rücksetzung nach 5 Stunden |
| **MCP-monatliche Quote** | Monatliche Quote für MCP-Suchanfragen (Model Context Protocol) | Monatliche Rücksetzung |

Das Plugin ruft diese Daten über die offizielle API in Echtzeit ab und zeigt die verbleibenden Kredite visuell mit Fortschrittsbalken und Prozentsätzen an.

::: info Was ist MCP?

**MCP** (Model Context Protocol) ist ein von Zhipu AI bereitgestellter Modellkontextprotokoll, das KI-Modellen ermöglicht, externe Ressourcen zu durchsuchen und zu referenzieren. Die MCP-monatliche Quote begrenzt die Anzahl der Suchanfragen pro Monat.

:::

## Folgen Sie mir

### Schritt 1: Zhipu AI / Z.ai-Konto konfigurieren

**Warum**
Das Plugin benötigt einen API-Key, um Ihre Kredite abzufragen. Zhipu AI und Z.ai verwenden die **API-Key-Authentifizierungsmethode**.

**Operation**

1. Öffnen Sie die Datei `~/.local/share/opencode/auth.json`

2. Fügen Sie die API-Key-Konfiguration von Zhipu AI oder Z.ai hinzu:

```json
{
  "zhipuai-coding-plan": {
    "type": "api",
    "key": "Ihr Zhipu AI API-Key"
  },
  "zai-coding-plan": {
    "type": "api",
    "key": "Ihr Z.ai API-Key"
  }
}
```

**Was Sie sehen sollten**:
- Die Konfigurationsdatei enthält das Feld `zhipuai-coding-plan` oder `zai-coding-plan`
- Jedes Feld hat `type: "api"` und ein `key`-Feld

### Schritt 2: Kreditabfrage

**Warum**
Aufrufen der offiziellen API zur Echtzeitabfrage der Kreditnutzung.

**Operation**

Führen Sie in OpenCode den Slash-Befehl aus:

```bash
/mystatus
```

oder stellen Sie eine Frage in natürlicher Sprache:

```
Zeigen Sie meine Zhipu AI-Kredite an
```

**Was Sie sehen sollten**:
Ähnlich dieser Ausgabe:

```
## Zhipu AI Account Quota

Account:        9c89****AQVM (Coding Plan)

5 Stunden Token-Kredit
███████████████████████████ Verbleibend 95%
Verwendet: 0,5M / 10,0M
Rücksetzung: 4 Stunden später

## Z.ai Account Quota

Account:        9c89****AQVM (Z.ai)

5 Stunden Token-Kredit
███████████████████████████ Verbleibend 95%
Verwendet: 0,5M / 10,0M
Rücksetzung: 4 Stunden später
```

### Schritt 3: Ausgabe interpretieren

**Warum**
Nur wenn Sie die Bedeutung jeder Ausgabezeile verstehen, können Sie Kredite effektiv verwalten.

**Operation**

Vergleichen Sie Ihre Ausgabe mit folgenden Erklärungen:

| Ausgabefeld | Bedeutung | Beispiel |
| -------- | ---- | ---- |
| **Account** | Maskierter API-Key und Kontotyp | `9c89****AQVM (Coding Plan)` |
| **5 Stunden Token-Kredit** | Token-Nutzung im aktuellen 5-Stunden-Zeitraum | Fortschrittsbalken + Prozentsatz |
| **Verwendet: X / Y** | Verwendet / Gesamt | `0,5M / 10,0M` |
| **Rücksetzung: X Stunden später** | Countdown bis zur nächsten Rücksetzung | `4 Stunden später` |
| **MCP-monatliche Quote** | Nutzung der monatlichen MCP-Suchanfragen | Fortschrittsbalken + Prozentsatz |
| **Verwendet: X / Y** | Verwendete Anfragen / Gesamt | `200 / 500` |

**Was Sie sehen sollten**:
- Der 5-Stunden-Token-Kredit hat einen **Rücksetzzeit-Countdown**
- Die MCP-monatliche Quote hat **keine Rücksetzzeit** (da sie monatlich zurückgesetzt wird)
- Wenn die Nutzung 80% überschreitet, wird unten ein **Warnhinweis** angezeigt

## Kontrollpunkt ✅

Stellen Sie sicher, dass Sie Folgendes verstehen:

- [ ] Der 5-Stunden-Token-Kredit hat einen Rücksetzzeit-Countdown
- [ ] Die MCP-monatliche Quote wird monatlich zurückgesetzt und zeigt keinen Countdown an
- [ ] Wenn die Nutzung 80% überschreitet, wird eine Warnung ausgelöst
- [ ] Der API-Key wird maskiert angezeigt (nur erste 4 und letzte 4 Zeichen sichtbar)

## Häufige Fehler

### Häufiger Fehler 1: Fehlendes `type`-Feld in der Konfigurationsdatei

**Fehlererscheinung**: Bei der Abfrage wird "Keine konfigurierten Konten gefunden" angezeigt

**Ursache**: In `auth.json` fehlt das Feld `type: "api"`

**Korrektur**:

```json
// ❌ Falsch
{
  "zhipuai-coding-plan": {
    "key": "Ihr API-Key"
  }
}

// ✅ Richtig
{
  "zhipuai-coding-plan": {
    "type": "api",
    "key": "Ihr API-Key"
  }
}
```

### Häufiger Fehler 2: API-Key abgelaufen oder ungültig

**Fehlererscheinung**: Zeigt "API-Anfrage fehlgeschlagen" oder "Authentifizierung fehlgeschlagen"

**Ursache**: Der API-Key ist abgelaufen oder widerrufen

**Korrektur**:
- Melden Sie sich in der Zhipu AI / Z.ai-Konsole an
- Generieren Sie den API-Key neu
- Aktualisieren Sie das Feld `key` in `auth.json`

### Häufiger Fehler 3: Verwechslung der beiden Kreditarten

**Fehlererscheinung**: Sie denken, dass Token-Kredit und MCP-Quote dasselbe sind

**Korrektur**:
- **Token-Kredit**: Token-Nutzung für API-Aufrufe, Rücksetzung nach 5 Stunden
- **MCP-Quote**: Anzahl der MCP-Suchanfragen, monatliche Rücksetzung
- Dies sind **zwei unabhängige Kredite**, die sich gegenseitig nicht beeinflussen

## Zusammenfassung

In diesem Lektion haben Sie gelernt, wie Sie mit opencode-mystatus Kredite von Zhipu AI und Z.ai abfragen:

**Kernkonzepte**:
- 5-Stunden-Token-Kredit: API-Aufrufbeschränkung mit Rücksetz-Countdown
- MCP-monatliche Quote: MCP-Suchanfragen, monatliche Rücksetzung

**Operationsschritte**:
1. Konfigurieren Sie `zhipuai-coding-plan` oder `zai-coding-plan` in `auth.json`
2. Führen Sie `/mystatus` aus, um Kredite abzufragen
3. Interpretieren Sie Fortschrittsbalken, verwendeten Wert und Rücksetzzeit in der Ausgabe

**Schlüsselpunkte**:
- Warnung bei Nutzung über 80%
- Automatische Maskierung des API-Keys
- Token-Kredit und MCP-Quote sind zwei unabhängige Kredite

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[GitHub Copilot-Kreditabfrage](../copilot-usage/)**.
>
> Sie werden lernen:
> - Wie Sie die Premium Requests-Nutzung anzeigen
> - Kreditunterschiede verschiedener Abonnementtypen
> - Interpretationsmethode der Modellnutzungsdetails

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Zhipu AI-Kreditabfrage | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 213-217 |
| Z.ai-Kreditabfrage | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 224-228 |
| Ausgabe formatieren | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 115-177 |
| API-Endpunktkonfiguration | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 62-76 |
| ZhipuAuthData Typdefinition | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 38-41 |
| Hochnutzungswarnungsschwelle | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 110-111 |

**Wichtige Konstanten**:
- `HIGH_USAGE_THRESHOLD = 80`: Zeigt Warnung, wenn die Nutzung 80% überschreitet (`types.ts:111`)

**Wichtige Funktionen**:
- `queryZhipuUsage(authData)`: Fragt Zhipu AI-Kontokredite ab (`zhipu.ts:213-217`)
- `queryZaiUsage(authData)`: Fragt Z.ai-Kontokredite ab (`zhipu.ts:224-228`)
- `formatZhipuUsage(data, apiKey, accountLabel)`: Formatiert Kreditausgabe (`zhipu.ts:115-177`)
- `fetchUsage(apiKey, config)`: Ruft offizielle API zur Abfrage von Kreditdaten auf (`zhipu.ts:81-106`)

**API-Endpunkte**:
- Zhipu AI: `https://bigmodel.cn/api/monitor/usage/quota/limit` (`zhipu.ts:63`)
- Z.ai: `https://api.z.ai/api/monitor/usage/quota/limit` (`zhipu.ts:64`)

</details>

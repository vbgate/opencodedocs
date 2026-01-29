---
title: "Ausgabe verstehen: Fortschrittsbalken | opencode-mystatus"
sidebarTitle: "Ausgabe verstehen"
subtitle: "Ausgabe verstehen: Fortschrittsbalken | opencode-mystatus"
description: "Lernen Sie das Ausgabeformat von opencode-mystatus zu interpretieren. Verstehen Sie Fortschrittsbalken, Rücksetzzeit und Kreditzyklen von OpenAI, Zhipu AI, Copilot und Google Cloud."
tags:
  - "output-format"
  - "progress-bar"
  - "reset-time"
  - "multi-account"
prerequisite:
  - "start-quick-start"
order: 3
---

# Ausgabe verstehen: Fortschrittsbalken, Rücksetzzeit und mehrere Konten

## Was Sie nach diesem Tutorial können

- Jede Information in der mystatus-Ausgabe verstehen
- Die Bedeutung von Fortschrittsbalken verstehen (ausgefüllt vs. leer)
- Kreditzyklen verschiedener Plattformen kennen (3 Stunden, 5 Stunden, monatlich)
- Kreditunterschiede mehrerer Konten erkennen

## Ihre aktuelle Situation

Sie haben `/mystatus` ausgeführt und sehen eine Reihe von Fortschrittsbalken, Prozentwerten und Countdown-Timern, aber Sie verstehen nicht:

- Ist ein voller Fortschrittsbalken gut oder schlecht?
- Was bedeutet "Resets in: 2h 30m"?
- Warum zeigen einige Plattformen zwei Fortschrittsbalken, andere nur einen?
- Warum hat Google Cloud mehrere Konten?

In dieser Lektion werden wir diese Informationen einzeln erklären.

## Grundlegende Idee

Die mystatus-Ausgabe hat ein einheitliches Format, aber es gibt Unterschiede zwischen den Plattformen:

**Einheitliche Elemente**:
- Fortschrittsbalken: `█` (ausgefüllt) bedeutet verbleibend, `░` (leer) bedeutet verwendet
- Prozent: Berechnet als verbleibender Prozentsatz basierend auf verwendetem Wert
- Rücksetzzeit: Countdown bis zur nächsten Aktualisierung der Kredite

**Plattformunterschiede**:
| Plattform | Kreditzyklus | Merkmale |
| -------------- | --------------------------- | ----------------------- |
| OpenAI | 3 Stunden / 24 Stunden | Möglicherweise zwei Fenster |
| Zhipu AI / Z.ai | 5-Stunden-Token / MCP-monatliche Quote | Zwei verschiedene Kreditarten |
| GitHub Copilot | Monatlich | Zeigt konkrete Werte (229/300) |
| Google Cloud | Pro Modell | Zeigt 4 Modelle pro Konto |

## Struktur der Ausgabe

### Vollständiges Ausgabebeispiel

```
## OpenAI Account Quota

Account:        user@example.com (team)

3-hour limit
███████████████████████████ 85% remaining
Resets in: 2h 30m

24-hour limit
█████████░░░░░░░░░░░░░ 60% remaining
Resets in: 20h 30m

## Zhipu AI Account Quota

Account:        9c89****AQVM (Coding Plan)

5-hour token limit
███████████████████████████ 95% remaining
Used: 0.5M / 10.0M
Resets in: 4h

## GitHub Copilot Account Quota

Account:        GitHub Copilot (individual)

Premium        ████░░░░░░░░░░░░░░░ 24% (229/300)

Quota resets: 19d 0h (2026-02-01)

## Google Cloud Account Quota

### user@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%

### work@gmail.com

G3 Pro     4h 59m     ████████░░░░░░░░░░░░ 50%
G3 Image   4h 59m     ████████████████████ 100%
```

### Bedeutung der einzelnen Teile

#### 1. Kontoinformationszeile

```
Account:        user@example.com (team)
```

- **OpenAI / Copilot**: Zeigt E-Mail + Abonnementtyp
- **Zhipu AI / Z.ai**: Zeigt maskierten API-Key + Kontotyp (Coding Plan)
- **Google Cloud**: Zeigt E-Mail, mehrere Konten werden mit `###` getrennt

#### 2. Fortschrittsbalken

```
███████████████████████████ 85% remaining
```

- `█` (ausgefüllter Block): **Verbleibender** Kredit
- `░` (leerer Block): **Verwendeter** Kredit
- **Prozent**: Verbleibender Prozentsatz (je größer, desto besser)

::: info Merksatz
Je mehr ausgefüllte Blöcke, desto mehr verbleibt → können Sie weiterhin sorgenfrei verwenden
Je mehr leere Blöcke, desto mehr verwendet → achten Sie darauf, sparsam zu sein
:::

#### 3. Rücksetzzeit-Countdown

```
Resets in: 2h 30m
```

Zeigt die verbleibende Zeit bis zur nächsten Kreditaktualisierung.

**Rücksetzzyklen**:
- **OpenAI**: 3-Stunden-Fenster / 24-Stunden-Fenster
- **Zhipu AI / Z.ai**: 5-Stunden-Token-Kredit / MCP-monatliche Quote
- **GitHub Copilot**: Monatlich (zeigt konkretes Datum)
- **Google Cloud**: Jedes Modell hat eine unabhängige Rücksetzzeit

#### 4. Werte-Detail (einige Plattformen)

Zhipu AI und Copilot zeigen konkrete Werte:

```
Used: 0.5M / 10.0M              # Zhipu AI: Verwendet / Gesamt (Einheit: Millionen Token)
Premium        24% (229/300)     # Copilot: Verbleibender Prozentsatz (Verwendet / Gesamtkredit)
```

## Detaillierte Erklärung der Plattformunterschiede

### OpenAI: Doppel-Fenster-Kredit

OpenAI kann zwei Fortschrittsbalken anzeigen:

```
3-hour limit
███████████████████████████ 85% remaining
Resets in: 2h 30m

24-hour limit
████████████████████████████ 90% remaining
Resets in: 20h 45m
```

- **3-hour limit**: 3-Stunden-Schiebefenster, geeignet für häufige Nutzung
- **24-hour limit**: 24-Stunden-Schiebefenster, geeignet für langfristige Planung

**Teamkonten** (Team):
- Hat ein Hauptfenster und ein Nebenfenster mit zwei Krediten
- Verschiedene Mitglieder teilen sich denselben Team-Kredit

**Personalkonten** (Plus):
- Normalerweise wird nur das 3-Stunden-Fenster angezeigt

### Zhipu AI / Z.ai: Zwei Kreditarten

```
5-hour token limit
███████████████████████████ 95% remaining
Used: 0.5M / 10.0M
Resets in: 4h

MCP limit
███████████████████████████ 100% remaining
Used: 0 / 1000
```

- **5-hour token limit**: Token-Nutzungskredit innerhalb von 5 Stunden
- **MCP limit**: MCP-monatliche Quote (Model Context Protocol), wird für die Suchfunktion verwendet

::: warning
Die MCP-Quote ist monatlich, die Rücksetzzeit ist lang. Wenn angezeigt wird, dass sie aufgebraucht ist, müssen Sie bis zum nächsten Monat warten, bis sie wiederhergestellt wird.
:::

### GitHub Copilot: Monatliche Quote

```
Premium        ████░░░░░░░░░░░░░░░ 24% (229/300)

Quota resets: 19d 0h (2026-02-01)
```

- **Premium Requests**: Hauptkredit von Copilot
- Zeigt konkrete Werte (Verwendet / Gesamtkredit)
- Monatliche Rücksetzung, zeigt konkretes Datum

**Unterschiede zwischen Abonnementtypen**:
| Abonnementtyp | Monatlicher Kredit | Beschreibung |
| ---------- | -------- | ---------------------- |
| Free | N/A | Keine Kreditbeschränkung, aber Funktionen eingeschränkt |
| Pro | 300 | Standard-Personalversion |
| Pro+ | Höher | Upgrade-Version |
| Business | Höher | Teamversion |
| Enterprise | Unbegrenzt | Unternehmensversion |

### Google Cloud: Mehrere Konten + Mehrere Modelle

```
### user@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%

### work@gmail.com

G3 Pro     4h 59m     ████████░░░░░░░░░░░░ 50%
G3 Image   4h 59m     ████████████████████ 100%
```

**Format**: `Modellname | Rücksetzzeit | Fortschrittsbalken + Prozentsatz`

**Erklärung der 4 Modelle**:
| Modellname | API-Key (Haupt/Reserve) | Zweck |
| -------- | ---------------------------------------------- | ----------- |
| G3 Pro | `gemini-3-pro-high` / `gemini-3-pro-low` | Hochwertige Inferenz |
| G3 Image | `gemini-3-pro-image` | Bildgenerierung |
| G3 Flash | `gemini-3-flash` | Schnelle Generierung |
| Claude | `claude-opus-4-5-thinking` / `claude-opus-4-5` | Claude-Modell |

**Anzeige mehrerer Konten**:
- Jedes Google-Konto wird mit `###` getrennt
- Jedes Konto zeigt seine 4 Modellkredite
- Sie können die Kreditnutzung verschiedener Konten vergleichen

## Häufige Fehler

### Häufige Missverständnisse

| Missverständnis | Tatsache |
| ------------------------- | -------------------------------------- |
| Fortschrittsbalken vollständig ausgefüllt = Nicht verwendet | Viele ausgefüllte Blöcke = **Viel verbleibend**, können Sie weiterhin sorgenfrei verwenden |
| Kurze Rücksetzzeit = Kredit fast aufgebraucht | Kurze Rücksetzzeit = Wird bald zurückgesetzt, können Sie weiterhin verwenden |
| Prozent 100% = Aufgebraucht | Prozent 100% = **Alles verbleibend** |
| Zhipu AI zeigt nur einen Kredit an | Tatsächlich gibt es TOKENS_LIMIT und TIME_LIMIT zwei Arten |

### Was tun, wenn der Kredit aufgebraucht ist?

Wenn der Fortschrittsbalken vollständig leer ist (0% remaining):

1. **Kurzfristiger Kredit** (z. B. 3 Stunden, 5 Stunden): Warten bis der Rücksetzzeit-Countdown abgelaufen ist
2. **Monatlicher Kredit** (z. B. Copilot, MCP): Warten bis zum Anfang des nächsten Monats
3. **Mehrere Konten**: Wechseln Sie zu einem anderen Konto (Google Cloud unterstützt mehrere Konten)

::: info
mystatus ist ein **schreibgeschütztes Tool**, es verbraucht Ihren Kredit nicht und löst keine API-Aufrufe aus.
:::

## Zusammenfassung

- **Fortschrittsbalken**: Ausgefüllt `█` = verbleibend, leer `░` = verwendet
- **Rücksetzzeit**: Countdown bis zur nächsten Kreditaktualisierung
- **Plattformunterschiede**: Verschiedene Plattformen haben verschiedene Kreditzyklen (3h/5h/monatlich)
- **Mehrere Konten**: Google Cloud zeigt mehrere Konten, erleichtert die Kreditverwaltung

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[OpenAI-Kreditabfrage](../../platforms/openai-usage/)**.
>
> Sie werden lernen:
> - Unterschied zwischen 3-Stunden- und 24-Stunden-Krediten von OpenAI
> - Kreditfreigabemechanismus von Teamkonten
> - Wie man JWT-Tokens analysiert, um Kontoinformationen zu erhalten

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------- | ------- |
| Fortschrittsbalkenerzeugung | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L40-L53) | 40-53 |
| Zeitformatierung | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L18-L29) | 18-29 |
| Berechnung verbleibender Prozentsatz | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L63-L65) | 63-65 |
| Token-Anzahlformatierung | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L70-L72) | 70-72 |
| OpenAI-Ausgabeformatierung | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L164-L194) | 164-194 |
| Zhipu AI-Ausgabeformatierung | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L115-L177) | 115-177 |
| Copilot-Ausgabeformatierung | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L395-L447) | 395-447 |
| Google Cloud-Ausgabeformatierung | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L265-L294) | 265-294 |

**Wichtige Funktionen**:
- `createProgressBar(percent, width)`: Erzeugt Fortschrittsbalken, ausgefüllte Blöcke bedeuten verbleibend
- `formatDuration(seconds)`: Wandelt Sekunden in menschenlesbares Zeitformat um (z. B. "2h 30m")
- `calcRemainPercent(usedPercent)`: Berechnet verbleibenden Prozentsatz (100 - verwendeter Prozentsatz)
- `formatTokens(tokens)`: Formatiert Token-Anzahl in Millionen (z. B. "0.5M")

**Wichtige Konstanten**:
- Standardbreite des Fortschrittsbalkens: 30 Zeichen (Google Cloud-Modelle verwenden 20 Zeichen)
- Fortschrittsbalkenzeichen: `█` (ausgefüllt), `░` (leer)

</details>

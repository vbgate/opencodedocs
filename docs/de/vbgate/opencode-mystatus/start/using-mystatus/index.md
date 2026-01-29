---
title: "Benutzerhandbuch: Kredite abfragen | opencode-mystatus"
sidebarTitle: "mystatus verwenden"
subtitle: "Benutzerhandbuch: Kredite abfragen | opencode-mystatus"
description: "Lernen Sie opencode-mystatus: Slash-Befehl oder natürliche Sprache für KI-Kredite."
tags:
  - "Schnellstart"
  - "Slash-Befehl"
  - "Natürliche Sprache"
prerequisite:
  - "start-quick-start"
order: 2
---
# mystatus verwenden: Slash-Befehl und natürliche Sprache

## Was Sie nach diesem Tutorial können

- Verwenden Sie den Slash-Befehl `/mystatus`, um Kredite aller KI-Plattformen mit einem Klick abzufragen
- Verwenden Sie Fragen in natürlicher Sprache, damit OpenCode automatisch das mystatus-Tool aufruft
- Verstehen Sie den Unterschied zwischen den beiden Auslösemethoden (Slash-Befehl und natürliche Sprache) und deren Anwendungsfälle

## Ihre aktuelle Situation

Sie verwenden mehrere KI-Plattformen zur Entwicklung (OpenAI, Zhipu AI, GitHub Copilot usw.) und möchten wissen, wie viele Kredite auf jeder Plattform noch verbleiben, aber Sie möchten sich nicht separat auf jeder Plattform anmelden - das ist zu umständlich.

## Wann sollten Sie dies verwenden?

- **Wenn Sie schnell alle Plattformkredite anzeigen möchten**: Überprüfen Sie dies vor der täglichen Entwicklung, um die Verwendung angemessen zu planen
- **Wenn Sie wissen möchten, wie viel Kredit eine bestimmte Plattform hat**: Zum Beispiel, um zu bestätigen, ob OpenAI bald aufgebraucht ist
- **Wenn Sie überprüfen möchten, ob die Konfiguration wirksam ist**: Nach der Konfiguration eines neuen Kontos überprüfen, ob die Abfrage normal funktioniert

::: info Vorabprüfung

Dieses Tutorial setzt voraus, dass Sie bereits die[opencode-mystatus-Plugin-Installation](/de/vbgate/opencode-mystatus/start/quick-start/) abgeschlossen haben. Wenn Sie noch nicht installiert haben, schließen Sie bitte die Installationsschritte ab.

:::

## Grundlegende Idee

opencode-mystatus bietet zwei Methoden, um das mystatus-Tool auszulösen:

1. **Slash-Befehl `/mystatus`**: Schnell, direkt, ohne Mehrdeutigkeit, geeignet für häufige Abfragen
2. **Natürliche Sprache**: Flexibler, geeignet für abfragespezifische Szenarien

Beide Methoden rufen dasselbe `mystatus`-Tool auf. Das Tool fragt alle konfigurierten KI-Plattformkredite parallel ab und gibt Ergebnisse mit Fortschrittsbalken, Nutzungsstatistiken und Rücksetz-Countdown zurück.

## Folgen Sie mir

### Schritt 1: Kreditabfrage mit Slash-Befehl

Geben Sie in OpenCode den folgenden Befehl ein:

```bash
/mystatus
```

**Warum**
Der Slash-Befehl ist ein Schnellbefehlsmechanismus von OpenCode, um vordefinierte Tools schnell aufzurufen. Der Befehl `/mystatus` ruft direkt das mystatus-Tool auf, ohne zusätzliche Parameter.

**Was Sie sehen sollten**:
OpenCode gibt die Kreditinformationen aller konfigurierten Plattformen zurück (abhängig davon, welche Plattformen Sie konfiguriert haben).

### Schritt 2: Fragen in natürlicher Sprache

Neben dem Slash-Befehl können Sie auch Fragen in natürlicher Sprache stellen. OpenCode erkennt Ihre Absicht automatisch und ruft das mystatus-Tool auf.

Probieren Sie diese Fragestellungen:

```bash
Check my OpenAI quota
```

oder

```bash
How much Codex quota do I have left?
```

oder

```bash
Show my AI account status
```

**Warum**
Abfragen in natürlicher Sprache entsprechen eher den alltäglichen Gesprächsgewohnheiten und eignen sich für Fragen in konkreten Entwicklungsszenarien. OpenCode erkennt durch semantische Übereinstimmung, dass Sie Kreditnutzung abfragen möchten, und ruft automatisch das mystatus-Tool auf.

**Was Sie sehen sollten**:
Das gleiche Ausgabeergebnis wie beim Slash-Befehl, nur die Auslösemethode ist unterschiedlich.

### Schritt 3: Konfiguration des Slash-Befehls verstehen

Wie funktioniert der Slash-Befehl `/mystatus`? Er ist in der OpenCode-Konfigurationsdatei definiert.

Öffnen Sie `~/.config/opencode/opencode.json` und suchen Sie den `command`-Teil:

```json
{
  "plugin": ["opencode-mystatus"],
  "command": {
    "mystatus": {
      "description": "Query quota usage for all AI accounts",
      "template": "Use the mystatus tool to query quota usage. Return the result as-is without modification."
    }
  }
}
```

**Erklärung der wichtigsten Konfigurationselemente**:

| Konfigurationselement | Wert | Funktion |
|--- | --- | ---|
| `description` | "Query quota usage for all AI accounts" | In der Befehlsliste angezeigte Beschreibung |
| `template` | "Use to mystatus tool..." | Weist OpenCode an, wie dieser Befehl zu verarbeiten ist |

**Warum ist ein template erforderlich**
Das template ist eine "Anweisung" an OpenCode: Wenn der Benutzer `/mystatus` eingibt, soll das mystatus-Tool aufgerufen werden und das Ergebnis unverändert an den Benutzer zurückgegeben werden (ohne Änderungen).

## Kontrollpunkt ✅

Vergewissern Sie sich, dass Sie beide Verwendungsmethoden beherrschen:

| Fertigkeit | Überprüfungsmethode | Erwartetes Ergebnis |
|--- | --- | ---|
| Slash-Befehl-Abfrage | `/mystatus` eingeben | Zeigt Kreditinformationen aller Plattformen |
| Abfrage in natürlicher Sprache | "Check my OpenAI quota" eingeben | Zeigt Kreditinformationen |
| Konfiguration verstehen | opencode.json aufrufen | Finden Sie die mystatus-Befehlskonfiguration |

## Häufige Fehler

### Häufiger Fehler 1: Slash-Befehl reagiert nicht

**Symptom**: Nach Eingabe von `/mystatus` gibt es keine Reaktion

**Ursache**: Die OpenCode-Konfigurationsdatei hat den Slash-Befehl nicht korrekt konfiguriert

**Lösung**:
1. Öffnen Sie `~/.config/opencode/opencode.json`
2. Stellen Sie sicher, dass der `command`-Teil die `mystatus`-Konfiguration enthält (siehe Schritt 3)
3. Starten Sie OpenCode neu

### Häufiger Fehler 2: Fragen in natürlicher Sprache lösen mystatus-Tool nicht aus

**Symptom**: Nach Eingabe von "Check my OpenAI quota" ruft OpenCode das mystatus-Tool nicht auf, sondern versucht selbst zu antworten

**Ursache**: OpenCode erkennt Ihre Absicht nicht korrekt

**Lösung**:
1. Versuchen Sie eine klarere Formulierung: "Use mystatus tool to check my OpenAI quota"
2. Oder verwenden Sie direkt den Slash-Befehl `/mystatus`, zuverlässiger

### Häufiger Fehler 3: Anzeige "Keine konfigurierten Konten gefunden"

**Symptom**: Nach Ausführung von `/mystatus` wird "Keine konfigurierten Konten gefunden" angezeigt

**Ursache**: Es wurden keine Authentifizierungsinformationen für eine Plattform konfiguriert

**Lösung**:
- Mindestens Authentifizierungsinformationen für eine Plattform konfigurieren (OpenAI, Zhipu AI, Z.ai, GitHub Copilot oder Google Cloud)
- Siehe [Schnellstart-Tutorial](/de/vbgate/opencode-mystatus/start/quick-start/) für Konfigurationsdetails

## Zusammenfassung

Das mystatus-Tool bietet zwei Verwendungsmöglichkeiten:
1. **Slash-Befehl `/mystatus`**: Schnell und direkt, geeignet für häufige Abfragen
2. **Fragen in natürlicher Sprache**: Flexibler, geeignet für spezifische Szenarien

Beide Methoden fragen alle konfigurierten KI-Plattformkredite parallel ab und geben Ergebnisse mit Fortschrittsbalken und Rücksetz-Countdown zurück. Die Slash-Befehlskonfiguration wird in `~/.config/opencode/opencode.json` definiert und weist durch template OpenCode an, wie das mystatus-Tool aufgerufen wird.

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Ausgabe verstehen: Fortschrittsbalken, Rücksetzzeit und mehrere Konten](/de/vbgate/opencode-mystatus/start/understanding-output/)**.
>
> Sie werden lernen:
> - Wie Sie die Bedeutung von Fortschrittsbalken interpretieren
> - Wie Rücksetzzeit-Countdown berechnet wird
> - Ausgabeformat bei mehreren Konten
> - Funktionsweise der Fortschrittsbalkenerzeugung

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
|--- | --- | ---|
| Toolbeschreibung | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 30-31 |
|--- | --- | ---|
| Parallele Abfrage aller Plattformen | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 49-56 |
|--- | --- | ---|

**Wichtige Konstanten**:
Keine (dieser Abschnitt führt hauptsächlich Aufrufmethoden ein, keine spezifischen Konstanten)

**Wichtige Funktionen**:
- `mystatus()`: Hauptfunktion des mystatus-Tools, liest die Authentifizierungsdatei und fragt alle Plattformen parallel ab (`plugin/mystatus.ts:29-33`)
- `collectResult()`: Sammelt Abfrageergebnisse in Arrays results und errors (`plugin/mystatus.ts:100-116`)

</details>

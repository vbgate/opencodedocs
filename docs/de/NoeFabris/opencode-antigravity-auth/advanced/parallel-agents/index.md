---
title: "PID-Offset: Optimierung der Account-Zuweisung für parallele Agenten | Antigravity Auth"
sidebarTitle: "Mehrere Agenten ohne Konflikte"
subtitle: "Parallel-Agent-Optimierung: PID-Offset und Account-Zuweisung"
description: "Lernen Sie, wie PID-Offset die Account-Zuweisung für parallele Agenten in oh-my-opencode optimiert. Umfasst Konfiguration, Strategieabstimmung, Validierung und Fehlersuche."
tags:
  - "advanced"
  - "parallel-agents"
  - "pid-offset"
  - "oh-my-opencode"
  - "load-balancing"
prerequisite:
  - "start-quick-install"
  - "start-first-auth-login"
  - "advanced-multi-account-setup"
order: 5
---

# Parallel-Agent-Optimierung: PID-Offset und Account-Zuweisung

**PID-Offset** ist ein optimierter Account-Zuweisungsmechanismus basierend auf der Prozess-ID, der durch `process.pid % accounts.length` den Versatz berechnet. Dies ermöglicht mehreren OpenCode-Prozessen oder parallelen oh-my-opencode-Agenten die Priorisierung verschiedener Google-Accounts. Wenn mehrere Prozesse gleichzeitig laufen, wählt jeder Prozess automatisch einen anderen Start-Account basierend auf dem Rest seiner PID. Dies verhindert effektiv 429-Rate-Limit-Fehler, die durch mehrere Prozesse entstehen, die gleichzeitig denselben Account belasten. Es verbessert die Erfolgsrate von Anfragen und die Kontingentausnutzung erheblich in parallelen Szenarien und ist besonders geeignet für Entwickler, die mehrere Agenten oder parallele Aufgaben gleichzeitig ausführen müssen.

## Was Sie nach diesem Tutorial können

- Verstehen von Account-Konflikten in parallelen Agenten-Szenarien
- Aktivieren der PID-Offset-Funktion, damit verschiedene Prozesse unterschiedliche Accounts priorisieren
- Kombinieren mit der Round-Robin-Strategie zur Maximierung der Mehrfach-Account-Ausnutzung
- Fehlersuche bei Rate-Limits und Account-Auswahlproblemen in parallelen Agenten

## Ihre aktuelle Situation

Bei der Verwendung von oh-my-opencode oder dem gleichzeitigen Betrieb mehrerer OpenCode-Instanzen können Sie auf folgende Probleme stoßen:

- Mehrere Unter-Agenten verwenden denselben Account und stoßen häufig auf 429-Rate-Limits
- Auch bei Konfiguration mehrerer Accounts werden gleichzeitige Anfragen auf denselben Account gerichtet
- Verschiedene Prozesse starten immer mit dem ersten Account, was zu ungleichmäßiger Account-Verteilung führt
- Nach einem fehlgeschlagenen Request muss lange gewartet werden, bevor ein erneuter Versuch möglich ist

## Wann Sie diese Funktion verwenden sollten

Die PID-Offset-Funktion ist für folgende Szenarien geeignet:

| Szenario | PID-Offset erforderlich? | Grund |
| --- | --- | --- |
| Einzelne OpenCode-Instanz | ❌ Nein | Einzelprozess, keine Account-Konflikte |
| Manuelles Wechseln mehrerer Accounts | ❌ Nein | Keine Gleichzeitigkeit, Sticky-Strategie ausreichend |
| oh-my-opencode mit mehreren Agenten | ✅ Empfohlen | Mehrprozess-Gleichzeitigkeit, Accounts müssen verteilt werden |
| Gleichzeitiger Betrieb mehrerer OpenCode-Instanzen | ✅ Empfohlen | Unterschiedliche PIDs für verschiedene Prozesse, automatische Verteilung |
| CI/CD-Parallelaufgaben | ✅ Empfohlen | Jede Aufgabe ist ein unabhängiger Prozess, vermeidet Konkurrenz |

::: warning Voraussetzungen prüfen
Bevor Sie mit diesem Tutorial beginnen, stellen Sie sicher, dass Sie Folgendes abgeschlossen haben:
- ✅ Mindestens 2 Google-Accounts konfiguriert
- ✅ Verständnis der Funktionsweise von Account-Auswahlstrategien
- ✅ Verwendung von oh-my-opencode oder Bedarf an parallelem Betrieb mehrerer OpenCode-Instanzen

[Tutorial zur Mehrfach-Account-Konfiguration](../multi-account-setup/) | [Tutorial zu Account-Auswahlstrategien](../account-selection-strategies/)
:::

## Kernkonzept

### Was ist PID-Offset?

**PID (Process ID)** ist die eindeutige Kennung, die das Betriebssystem jedem Prozess zuweist. Wenn mehrere OpenCode-Prozesse gleichzeitig laufen, hat jeder Prozess eine andere PID.

**PID-Offset** ist eine optimierte Account-Zuweisung basierend auf der Prozess-ID:

```
Angenommen es gibt 3 Accounts (Index: 0, 1, 2):

Prozess A (PID=123):
  123 % 3 = 0 → Priorisierung von Account 0

Prozess B (PID=456):
  456 % 3 = 1 → Priorisierung von Account 1

Prozess C (PID=789):
  789 % 3 = 2 → Priorisierung von Account 2
```

Jeder Prozess priorisiert basierend auf dem Rest seiner PID einen anderen Account, um zu vermeiden, dass alle von Beginn an denselben Account belasten.

### Warum ist PID-Offset notwendig?

Ohne PID-Offset starten alle Prozesse mit Account 0:

```
Zeitlinie:
T1: Prozess A startet → Verwendet Account 0
T2: Prozess B startet → Verwendet Account 0  ← Konflikt!
T3: Prozess C startet → Verwendet Account 0  ← Konflikt!
```

Nach Aktivierung von PID-Offset:

```
Zeitlinie:
T1: Prozess A startet → PID-Offset → Verwendet Account 0
T2: Prozess B startet → PID-Offset → Verwendet Account 1  ← Verteilung!
T3: Prozess C startet → PID-Offset → Verwendet Account 2  ← Verteilung!
```

### Zusammenwirken mit Account-Auswahlstrategien

PID-Offset wirkt nur in der Fallback-Phase der Sticky-Strategie (Round-Robin und Hybrid haben ihre eigene Verteilungslogik):

| Strategie | PID-Offset wirksam? | Empfohlenes Szenario |
| --- | --- | --- |
| `sticky` | ✅ Wirksam | Einzelprozess + Prompt-Cache-Priorität |
| `round-robin` | ❌ Nicht wirksam | Mehrprozess/Parallele Agenten, maximaler Durchsatz |
| `hybrid` | ❌ Nicht wirksam | Intelligente Zuweisung, Gesundheitsbewertung priorisiert |

**Warum benötigt Round-Robin keinen PID-Offset?**

Die Round-Robin-Strategie rotiert die Accounts selbst:

```typescript
// Jede Anfrage wechselt zum nächsten Account
this.cursor++;
const account = available[this.cursor % available.length];
```

Mehrere Prozesse verteilen sich natürlicherweise auf verschiedene Accounts, ohne zusätzlichen PID-Offset.

::: tip Best Practice
Für parallele Agenten-Szenarien empfohlen:

```json
{
  "account_selection_strategy": "round-robin",
  "pid_offset_enabled": false  // Round-Robin benötigt keinen PID-Offset
}
```

Wenn Sticky- oder Hybrid-Strategien unbedingt erforderlich sind, aktivieren Sie PID-Offset.
:::

## Schritt-für-Schritt-Anleitung

### Schritt 1: Mehrfach-Account-Konfiguration bestätigen

**Warum**
PID-Offset benötigt mindestens 2 Accounts, um effektiv zu sein. Bei nur einem Account wird unabhängig vom PID-Rest immer dieser eine Account verwendet.

**Vorgehen**

Überprüfen Sie die aktuelle Account-Anzahl:

```bash
opencode auth list
```

Sie sollten mindestens 2 Accounts sehen:

```
2 account(s) saved:
  1. user1@gmail.com
  2. user2@gmail.com
```

Falls nur 1 Account vorhanden ist, fügen Sie weitere hinzu:

```bash
opencode auth login
```

Wählen Sie `(a)dd new account(s)` entsprechend der Anweisung.

**Erwartetes Ergebnis**: Die Account-Liste zeigt 2 oder mehr Accounts an.

### Schritt 2: PID-Offset konfigurieren

**Warum**
Durch die Konfigurationsdatei wird die PID-Offset-Funktion aktiviert, damit das Plugin bei der Account-Auswahl die Prozess-ID berücksichtigt.

**Vorgehen**

Öffnen Sie die OpenCode-Konfigurationsdatei:

- **macOS/Linux**: `~/.config/opencode/antigravity.json`
- **Windows**: `%APPDATA%\opencode\antigravity.json`

Fügen Sie die folgende Konfiguration hinzu oder ändern Sie sie:

```json
{
  "pid_offset_enabled": true
}
```

Vollständiges Konfigurationsbeispiel (mit Sticky-Strategie):

```json
{
  "pid_offset_enabled": true,
  "account_selection_strategy": "sticky"
}
```

**Alternative über Umgebungsvariablen**:

```bash
export OPENCODE_ANTIGRAVITY_PID_OFFSET_ENABLED=1
```

**Erwartetes Ergebnis**: In der Konfigurationsdatei ist `pid_offset_enabled` auf `true` gesetzt.

### Schritt 3: PID-Offset-Effekt validieren

**Warum**
Durch tatsächliches Ausführen mehrerer Prozesse wird überprüft, ob PID-Offset wirksam ist und verschiedene Prozesse unterschiedliche Accounts priorisieren.

**Vorgehen**

Öffnen Sie zwei Terminal-Fenster und führen Sie OpenCode aus:

**Terminal 1**:
```bash
opencode chat
# Senden Sie eine Anfrage, notieren Sie den verwendeten Account (Logs oder Toast anzeigen)
```

**Terminal 2**:
```bash
opencode chat
# Senden Sie eine Anfrage, notieren Sie den verwendeten Account
```

Beobachten Sie das Account-Auswahlverhalten:

- ✅ **Erwartet**: Beide Terminals priorisieren unterschiedliche Accounts
- ❌ **Problem**: Beide Terminals verwenden denselben Account

Falls das Problem weiterhin besteht, überprüfen Sie:

1. Ob die Konfiguration korrekt geladen wird
2. Ob die Account-Auswahlstrategie `sticky` ist (Round-Robin benötigt keinen PID-Offset)
3. Ob nur 1 Account vorhanden ist

Aktivieren Sie Debug-Logs für detaillierte Account-Auswahlprozesse:

```bash
export OPENCODE_ANTIGRAVITY_DEBUG=1
opencode chat
```

Die Logs zeigen:

```
[accounts] Applying PID offset: 1 (process.pid % accounts.length)
[accounts] Starting account index for 'claude': 1
```

**Erwartetes Ergebnis**: Verschiedene Terminals priorisieren unterschiedliche Accounts, oder die Logs zeigen, dass PID-Offset angewendet wurde.

### Schritt 4: (Optional) Kombination mit Round-Robin-Strategie

**Warum**
Die Round-Robin-Strategie rotiert die Accounts selbst und benötigt keinen PID-Offset. Für hochfrequente, parallele Agenten ist Round-Robin jedoch die bessere Wahl.

**Vorgehen**

Ändern Sie die Konfigurationsdatei:

```json
{
  "account_selection_strategy": "round-robin",
  "pid_offset_enabled": false
}
```

Starten Sie mehrere oh-my-opencode-Agenten und beobachten Sie die Request-Verteilung:

```
Agent 1 → Account 0 → Account 1 → Account 2 → Account 0 ...
Agent 2 → Account 1 → Account 2 → Account 0 → Account 1 ...
```

Jeder Agent rotiert unabhängig und nutzt die Kontingente aller Accounts vollständig aus.

**Erwartetes Ergebnis**: Anfragen werden gleichmäßig auf alle Accounts verteilt, jeder Agent rotiert unabhängig.

## Kontrollpunkte ✅

Nach Abschluss der obigen Schritte sollten Sie folgende Fähigkeiten besitzen:

- [ ] Mindestens 2 Google-Accounts erfolgreich konfiguriert
- [ ] `pid_offset_enabled` in `antigravity.json` aktiviert
- [ ] Beim Betrieb mehrerer OpenCode-Instanzen priorisieren verschiedene Prozesse unterschiedliche Accounts
- [ ] Verständnis, warum Round-Robin keinen PID-Offset benötigt
- [ ] Verwendung von Debug-Logs zur Anzeige des Account-Auswahlprozesses

## Häufige Fehlerquellen

### Problem 1: Keine Wirkung nach Aktivierung

**Symptom**: `pid_offset_enabled: true` ist konfiguriert, aber mehrere Prozesse verwenden weiterhin denselben Account.

**Ursache**: Möglicherweise ist die Account-Auswahlstrategie `round-robin` oder `hybrid`, diese Strategien verwenden keinen PID-Offset.

**Lösung**: Wechseln Sie zur `sticky`-Strategie oder verstehen Sie, dass die aktuelle Strategie keinen PID-Offset benötigt.

```json
{
  "account_selection_strategy": "sticky",  // Zu sticky wechseln
  "pid_offset_enabled": true
}
```

### Problem 2: Nur 1 Account vorhanden

**Symptom**: Nach Aktivierung von PID-Offset verwenden alle Prozesse weiterhin Account 0.

**Ursache**: PID-Offset berechnet durch `process.pid % accounts.length`, bei nur einem Account ist der Rest immer 0.

**Lösung**: Fügen Sie weitere Accounts hinzu:

```bash
opencode auth login
# (a)dd new account(s) wählen
```

### Problem 3: Prompt-Cache nicht wirksam

**Symptom**: Nach Aktivierung von PID-Offset funktioniert Anthropics Prompt-Cache nicht mehr.

**Ursache**: PID-Offset kann dazu führen, dass verschiedene Prozesse oder Sitzungen unterschiedliche Accounts verwenden. Der Prompt-Cache wird pro Account geteilt. Nach dem Wechsel des Accounts müssen die Prompts erneut gesendet werden.

**Lösung**: Dies ist erwartetes Verhalten. Wenn Prompt-Cache höhere Priorität hat, deaktivieren Sie PID-Offset und verwenden Sie die Sticky-Strategie:

```json
{
  "pid_offset_enabled": false,
  "account_selection_strategy": "sticky"
}
```

### Problem 4: Konflikte bei mehreren oh-my-opencode-Agenten

**Symptom**: Auch bei Konfiguration mehrerer Accounts stoßen mehrere Agenten von oh-my-opencode häufig auf 429-Fehler.

**Ursache**: oh-my-opencode startet Agenten möglicherweise sequenziell, sodass mehrere Agenten kurzzeitig denselben Account anfragen.

**Lösung**:

1. Verwenden Sie die `round-robin`-Strategie (empfohlen):

```json
{
  "account_selection_strategy": "round-robin"
}
```

2. Oder erhöhen Sie die Account-Anzahl, damit jeder Agent einen unabhängigen Account hat:

```bash
# Bei 3 Agenten werden mindestens 5 Accounts empfohlen
opencode auth login
```

## Zusammenfassung

Die PID-Offset-Funktion optimiert die Account-Zuweisung in Mehrprozess-Szenarien durch die Prozess-ID (PID):

- **Prinzip**: Berechnung des Offsets durch `process.pid % accounts.length`
- **Funktion**: Verschiedene Prozesse priorisieren unterschiedliche Accounts, vermeiden Konflikte
- **Einschränkung**: Nur bei Sticky-Strategie wirksam, Round-Robin und Hybrid benötigen es nicht
- **Best Practice**: Für parallele Agenten-Szenarien wird die Round-Robin-Strategie empfohlen, kein PID-Offset erforderlich

Nach der Konfiguration mehrerer Accounts wählen Sie basierend auf Ihrem Anwendungsszenario die passende Strategie:

| Szenario | Empfohlene Strategie | PID-Offset |
| --- | --- | --- |
| Einzelprozess, Prompt-Cache-Priorität | sticky | Nein |
| Mehrprozess/Parallele Agenten | round-robin | Nein |
| Hybrid-Strategie + verteilter Start | hybrid | Optional |

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen Sie die **[Vollständige Konfigurationsanleitung](../configuration-guide/)**.
>
> Sie werden lernen:
> - Position und Priorität der Konfigurationsdateien
> - Konfigurationsoptionen für Modellverhalten, Account-Rotation und Anwendungsverhalten
> - Empfohlene Konfigurationen für verschiedene Szenarien
> - Erweiterte Konfigurationstuning-Methoden

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Aufklappen der Quellcode-Positionen</strong></summary>

> Aktualisiert: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| PID-Offset-Implementierung | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L388-L393) | 388-393 |
| Konfigurations-Schema-Definition | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts#L244-L255) | 244-255 |
| Umgebungsvariablen-Unterstützung | [`src/plugin/config/loader.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/loader.ts#L163-L168) | 163-168 |
| Konfigurationsübergabeposition | [`src/plugin.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin.ts#L902) | 902 |
| Verwendungsdokumentation | [`docs/MULTI-ACCOUNT.md`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/docs/MULTI-ACCOUNT.md#L111-L125) | 111-125 |
| Konfigurationsleitfaden | [`docs/CONFIGURATION.md`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/docs/CONFIGURATION.md#L69) | 69 |

**Wichtige Funktionen**:
- `getCurrentOrNextForFamily()`: Hauptfunktion für Account-Auswahl, verarbeitet intern die PID-Offset-Logik
- `process.pid % this.accounts.length`: Kernformel zur Offset-Berechnung

**Wichtige Konstanten**:
- `sessionOffsetApplied[family]`: Offset-Anwendungsmarkierung für jede Modellfamilie (nur einmal pro Sitzung angewendet)

</details>

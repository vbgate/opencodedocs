---
title: "Kontoauswahlstrategien: Multi-Account-Rotation konfigurieren | Antigravity Auth"
sidebarTitle: "Die richtige Strategie wählen"
subtitle: "Kontoauswahlstrategien: Best Practices für sticky, round-robin und hybrid"
description: "Lernen Sie die drei Kontoauswahlstrategien sticky, round-robin und hybrid kennen. Wählen Sie die optimale Konfiguration basierend auf Ihrer Kontoanzahl, maximieren Sie die Kontingentnutzung und vermeiden Sie Ratenbegrenzungen."
tags:
  - "Multi-Account"
  - "Lastverteilung"
  - "Konfiguration"
  - "Fortgeschritten"
prerequisite:
  - "advanced-multi-account-setup"
order: 1
---

# Kontoauswahlstrategien: Best Practices für sticky, round-robin und hybrid

## Was Sie lernen werden

Basierend auf der Anzahl Ihrer Google-Konten und Ihrem Anwendungsfall die passende Kontoauswahlstrategie auswählen und konfigurieren:
- 1 Konto → `sticky`-Strategie für Prompt-Caching
- 2-3 Konten → `hybrid`-Strategie für intelligente Anfragenverteilung
- 4+ Konten → `round-robin`-Strategie für maximalen Durchsatz

Vermeiden Sie die Situation, dass alle Konten gedrosselt werden, obwohl das Kontingent noch nicht ausgeschöpft ist.

## Das Problem

Sie haben mehrere Google-Konten konfiguriert, aber:
- Sie sind unsicher, welche Strategie die Kontingentnutzung maximiert
- Häufig werden alle Konten gedrosselt, obwohl ein Konto noch Kontingent übrig hat
- Bei parallelen Agenten nutzen mehrere Unterprozesse dasselbe Konto, was zu Drosselung führt

## Kernkonzept

### Was sind Kontoauswahlstrategien?

Das Antigravity Auth Plugin unterstützt drei Kontoauswahlstrategien, die bestimmen, wie Modellanfragen auf mehrere Google-Konten verteilt werden:

| Strategie | Verhalten | Anwendungsfall |
| --- | --- | --- |
| `sticky` | Verwendet dasselbe Konto, bis es gedrosselt wird | Einzelkonto, Prompt-Caching erforderlich |
| `round-robin` | Wechselt bei jeder Anfrage zum nächsten verfügbaren Konto | Multi-Account, maximaler Durchsatz |
| `hybrid` (Standard) | Intelligente Auswahl basierend auf Gesundheitsbewertung + Token-Bucket + LRU | 2-3 Konten, Balance zwischen Leistung und Stabilität |

::: info Warum brauchen wir Strategien?
Google hat Ratenbegrenzungen für jedes Konto. Mit nur einem Konto führen häufige Anfragen schnell zur Drosselung. Mehrere Konten können durch Rotation oder intelligente Auswahl die Anfragen verteilen und eine Überlastung einzelner Konten vermeiden.
:::

### Funktionsweise der drei Strategien

#### 1. Sticky-Strategie (Anhaftend)

**Kernlogik**: Behält das aktuelle Konto bei, bis es gedrosselt wird.

**Vorteile**:
- Erhält Prompt-Cache, schnellere Antworten bei gleichem Kontext
- Stabiles Nutzungsmuster, weniger wahrscheinlich Sicherheitsmaßnahmen auszulösen

**Nachteile**:
- Ungleichmäßige Kontingentnutzung bei mehreren Konten
- Andere Konten können nicht genutzt werden, bis die Drosselung aufgehoben ist

**Anwendungsfälle**:
- Nur ein Konto vorhanden
- Prompt-Caching wichtig (z.B. lange Konversationen)

#### 2. Round-Robin-Strategie (Rotierend)

**Kernlogik**: Wechselt bei jeder Anfrage zum nächsten verfügbaren Konto, zyklisch.

**Vorteile**:
- Gleichmäßigste Kontingentnutzung
- Maximaler paralleler Durchsatz
- Ideal für Hochlast-Szenarien

**Nachteile**:
- Berücksichtigt nicht den Gesundheitszustand der Konten, könnte kürzlich gedrosselte Konten auswählen
- Kein Prompt-Caching möglich

**Anwendungsfälle**:
- 4 oder mehr Konten
- Batch-Aufgaben mit maximalem Durchsatz
- Parallele Agenten (mit `pid_offset_enabled`)

#### 3. Hybrid-Strategie (Gemischt, Standard)

**Kernlogik**: Berücksichtigt drei Faktoren für die optimale Kontoauswahl:

**Bewertungsformel**:
```
Gesamtpunktzahl = Gesundheitspunkte × 2 + Token-Punkte × 5 + Frische-Punkte × 0.1
```

- **Gesundheitspunkte** (0-200): Basierend auf Erfolgs-/Fehlerhistorie des Kontos
  - Erfolgreiche Anfrage: +1 Punkt
  - Ratenbegrenzung: -10 Punkte
  - Andere Fehler (Authentifizierung, Netzwerk): -20 Punkte
  - Startwert: 70 Punkte, Minimum 0, Maximum 100
  - Regeneration: 2 Punkte pro Stunde (auch ohne Nutzung)

- **Token-Punkte** (0-500): Basierend auf Token-Bucket-Algorithmus
  - Jedes Konto hat maximal 50 Token, initial 50 Token
  - Regeneration: 6 Token pro Minute
  - Jede Anfrage verbraucht 1 Token
  - Token-Punkte = (aktuelle Token / 50) × 100 × 5

- **Frische-Punkte** (0-360): Basierend auf Zeit seit letzter Nutzung
  - Je länger nicht genutzt, desto höher die Punktzahl
  - Maximum nach 3600 Sekunden (1 Stunde)

**Vorteile**:
- Vermeidet intelligent Konten mit niedriger Gesundheitsbewertung
- Token-Bucket verhindert Drosselung durch intensive Anfragen
- LRU (Least Recently Used) gibt Konten ausreichend Erholungszeit
- Ausgewogene Balance zwischen Leistung und Stabilität

**Nachteile**:
- Komplexerer Algorithmus, weniger intuitiv als Round-Robin
- Bei 2 Konten weniger effektiv

**Anwendungsfälle**:
- 2-3 Konten (Standardstrategie)
- Balance zwischen Kontingentnutzung und Stabilität erforderlich

### Schnellreferenz zur Strategieauswahl

Basierend auf den Empfehlungen aus README und CONFIGURATION.md:

| Ihre Konfiguration | Empfohlene Strategie | Begründung |
| --- | --- | --- |
| **1 Konto** | `sticky` | Keine Rotation nötig, erhält Prompt-Cache |
| **2-3 Konten** | `hybrid` (Standard) | Intelligente Rotation, vermeidet übermäßige Drosselung |
| **4+ Konten** | `round-robin` | Maximaler Durchsatz, gleichmäßigste Kontingentnutzung |
| **Parallele Agenten** | `round-robin` + `pid_offset_enabled: true` | Verschiedene Prozesse nutzen verschiedene Konten |

## 🎒 Voraussetzungen

::: warning Checkliste
Stellen Sie sicher, dass Sie Folgendes abgeschlossen haben:
- [x] Multi-Account-Setup (mindestens 2 Google-Konten)
- [x] Verständnis des [Dual-Kontingent-Systems](/de/NoeFabris/opencode-antigravity-auth/platforms/dual-quota-system/)
:::

## Schritt-für-Schritt-Anleitung

### Schritt 1: Aktuelle Konfiguration prüfen

**Warum**
Verstehen Sie zunächst den aktuellen Konfigurationsstatus, um doppelte Änderungen zu vermeiden.

**Aktion**

Prüfen Sie Ihre Plugin-Konfigurationsdatei:

```bash
cat ~/.config/opencode/antigravity.json
```

**Erwartete Ausgabe**:
```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json"
}
```

Falls die Datei nicht existiert, verwendet das Plugin die Standardkonfiguration (`account_selection_strategy` = `"hybrid"`).

### Schritt 2: Strategie basierend auf Kontoanzahl konfigurieren

**Warum**
Verschiedene Kontoanzahlen erfordern verschiedene Strategien. Die falsche Strategie kann zu Kontingentverschwendung oder häufiger Drosselung führen.

::: code-group

```bash [1 Konto - Sticky-Strategie]
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "sticky"
}
EOF
```

```bash [2-3 Konten - Hybrid-Strategie (Standard)]
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "hybrid"
}
EOF
```

```bash [4+ Konten - Round-Robin-Strategie]
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin"
}
EOF
```

:::

**Erwartete Ausgabe**: Die Konfigurationsdatei wurde mit der entsprechenden Strategie aktualisiert.

### Schritt 3: PID-Offset aktivieren (für parallele Agenten)

**Warum**
Wenn Sie Plugins wie oh-my-opencode verwenden, die parallele Agenten erzeugen, können mehrere Unterprozesse gleichzeitig Anfragen senden. Standardmäßig beginnen sie alle mit demselben Startkonto, was zu Kontokonflikten und Drosselung führt.

**Aktion**

Konfiguration mit PID-Offset erweitern:

```bash
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin",
  "pid_offset_enabled": true
}
EOF
```

**Erwartete Ausgabe**: `pid_offset_enabled` ist auf `true` gesetzt.

**Funktionsweise**:
- Jeder Prozess berechnet einen Offset basierend auf seiner PID (Prozess-ID)
- Offset = `PID % Kontoanzahl`
- Verschiedene Prozesse bevorzugen verschiedene Startkonten
- Beispiel: 3 Konten, Prozesse mit PID 100, 101, 102 nutzen Konten 1, 2, 0

### Schritt 4: Strategie verifizieren

**Warum**
Bestätigen Sie, dass die Konfiguration korrekt ist und die Strategie wie erwartet funktioniert.

**Aktion**

Mehrere parallele Anfragen senden und Kontowechsel beobachten:

```bash
# Debug-Logging aktivieren
export OPENCODE_ANTIGRAVITY_DEBUG=1

# 5 Anfragen senden
for i in {1..5}; do
  opencode run "Test $i" --model=google/antigravity-gemini-3-pro &
done
wait
```

**Erwartete Ausgabe**:
- Logs zeigen verschiedene Konten für verschiedene Anfragen
- `account-switch`-Events protokollieren Kontowechsel

Beispiel-Log (Round-Robin-Strategie):
```
[DEBUG] Selected account: user1@gmail.com (index: 0) - reason: rotation
[DEBUG] Selected account: user2@gmail.com (index: 1) - reason: rotation
[DEBUG] Selected account: user3@gmail.com (index: 2) - reason: rotation
[DEBUG] Selected account: user1@gmail.com (index: 0) - reason: rotation
[DEBUG] Selected account: user2@gmail.com (index: 1) - reason: rotation
```

### Schritt 5: Kontogesundheit überwachen (Hybrid-Strategie)

**Warum**
Die Hybrid-Strategie wählt Konten basierend auf Gesundheitsbewertungen. Das Verständnis des Gesundheitsstatus hilft bei der Beurteilung, ob die Konfiguration angemessen ist.

**Aktion**

Gesundheitsbewertungen in den Debug-Logs anzeigen:

```bash
export OPENCODE_ANTIGRAVITY_DEBUG=2 opencode run "Hello" --model=google/antigravity-gemini-3-pro
```

**Erwartete Ausgabe**:
```
[VERBOSE] Health scores: {
  "0": { "score": 85, "consecutiveFailures": 0 },
  "1": { "score": 60, "consecutiveFailures": 2 },
  "2": { "score": 70, "consecutiveFailures": 0 }
}
[DEBUG] Selected account: user1@gmail.com (index: 0) - hybrid score: 270.2
```

**Interpretation**:
- Konto 0: Gesundheitspunkte 85 (ausgezeichnet)
- Konto 1: Gesundheitspunkte 60 (nutzbar, aber 2 aufeinanderfolgende Fehler)
- Konto 2: Gesundheitspunkte 70 (gut)
- Endauswahl: Konto 0 mit Gesamtbewertung 270.2

## Checkliste ✅

::: tip Wie verifizieren Sie, dass die Konfiguration wirksam ist?
1. Konfigurationsdatei prüfen und `account_selection_strategy`-Wert bestätigen
2. Mehrere Anfragen senden und Kontowechselverhalten in den Logs beobachten
3. Hybrid-Strategie: Konten mit niedriger Gesundheitsbewertung sollten seltener ausgewählt werden
4. Round-Robin-Strategie: Konten sollten zyklisch ohne erkennbare Präferenz genutzt werden
:::

## Häufige Fehler

### ❌ Kontoanzahl und Strategie passen nicht zusammen

**Fehlerhaftes Verhalten**:
- Nur 2 Konten, aber Round-Robin führt zu häufigem Wechsel
- 5 Konten, aber Sticky führt zu ungleichmäßiger Kontingentnutzung

**Richtige Vorgehensweise**: Strategie gemäß Schnellreferenz auswählen.

### ❌ PID-Offset bei parallelen Agenten nicht aktiviert

**Fehlerhaftes Verhalten**:
- Mehrere parallele Agenten nutzen gleichzeitig dasselbe Konto
- Führt zu schneller Kontodrosselung

**Richtige Vorgehensweise**: `pid_offset_enabled: true` setzen.

### ❌ Gesundheitsbewertung ignorieren (Hybrid-Strategie)

**Fehlerhaftes Verhalten**:
- Ein Konto wird häufig gedrosselt, aber weiterhin oft genutzt
- Gesundheitsbewertung wird nicht genutzt, um problematische Konten zu vermeiden

**Richtige Vorgehensweise**: Regelmäßig Debug-Logs auf Gesundheitsbewertungen prüfen. Bei Anomalien (z.B. aufeinanderfolgende Fehler > 5) das Konto entfernen oder Strategie wechseln.

### ❌ Dual-Kontingent-Pool und Einzelkontingent-Strategie vermischen

**Fehlerhaftes Verhalten**:
- Gemini-Modell mit `:antigravity`-Suffix erzwingt Antigravity-Kontingent-Pool
- Gleichzeitig `quota_fallback: false` konfiguriert
- Führt dazu, dass bei erschöpftem Pool kein Fallback auf anderen Pool möglich ist

**Richtige Vorgehensweise**: [Dual-Kontingent-System](/de/NoeFabris/opencode-antigravity-auth/platforms/dual-quota-system/) verstehen und `quota_fallback` entsprechend konfigurieren.

## Zusammenfassung

| Strategie | Kernmerkmal | Anwendungsfall |
| --- | --- | --- |
| `sticky` | Behält Konto bis zur Drosselung | 1 Konto, Prompt-Caching erforderlich |
| `round-robin` | Zyklische Kontorotation | 4+ Konten, maximaler Durchsatz |
| `hybrid` | Intelligente Auswahl: Gesundheit + Token + LRU | 2-3 Konten, Balance zwischen Leistung und Stabilität |

**Wichtige Konfigurationsoptionen**:
- `account_selection_strategy`: Strategie festlegen (`sticky` / `round-robin` / `hybrid`)
- `pid_offset_enabled`: Für parallele Agenten aktivieren (`true`)
- `quota_fallback`: Gemini Dual-Kontingent-Pool Fallback (`true` / `false`)

**Verifizierungsmethoden**:
- Debug-Logging aktivieren: `OPENCODE_ANTIGRAVITY_DEBUG=1`
- Kontowechsel-Logs und Gesundheitsbewertungen prüfen
- Kontoindizes bei verschiedenen Anfragen beobachten

## Nächste Lektion

> In der nächsten Lektion lernen Sie **[Ratenbegrenzungsbehandlung](/de/NoeFabris/opencode-antigravity-auth/advanced/rate-limit-handling/)**.
>
> Sie werden lernen:
> - Verschiedene Arten von 429-Fehlern verstehen (Kontingent erschöpft, Ratenbegrenzung, Kapazität erschöpft)
> - Funktionsweise von automatischen Wiederholungen und Backoff-Algorithmen
> - Wann Konto wechseln, wann auf Reset warten

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Anzeigen der Quellcode-Positionen</strong></summary>

> Aktualisiert: 2026-01-23

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| Kontoauswahl-Einstiegspunkt | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L340-L412) | 340-412 |
| Sticky-Strategie-Implementierung | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L395-L411) | 395-411 |
| Hybrid-Strategie-Implementierung | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L358-L383) | 358-383 |
| Gesundheitsbewertungssystem | [`src/plugin/rotation.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/rotation.ts#L14-L163) | 14-163 |
| Token-Bucket-System | [`src/plugin/rotation.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/rotation.ts#L290-L402) | 290-402 |
| LRU-Auswahlalgorithmus | [`src/plugin/rotation.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/rotation.ts#L215-L288) | 215-288 |
| PID-Offset-Logik | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L387-L393) | 387-393 |
| Konfigurations-Schema | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | siehe Datei |

**Wichtige Konstanten**:
- `DEFAULT_HEALTH_SCORE_CONFIG.initial = 70`: Initiale Gesundheitspunkte für neue Konten
- `DEFAULT_HEALTH_SCORE_CONFIG.minUsable = 50`: Minimale nutzbare Gesundheitspunkte
- `DEFAULT_TOKEN_BUCKET_CONFIG.maxTokens = 50`: Maximale Token pro Konto
- `DEFAULT_TOKEN_BUCKET_CONFIG.regenerationRatePerMinute = 6`: Token-Regeneration pro Minute

**Wichtige Funktionen**:
- `getCurrentOrNextForFamily()`: Kontoauswahl basierend auf Strategie
- `selectHybridAccount()`: Hybrid-Strategie-Bewertungsalgorithmus
- `getScore()`: Kontogesundheitspunkte abrufen (inkl. Zeitregeneration)
- `hasTokens()` / `consume()`: Token-Bucket-Prüfung und -Verbrauch
- `sortByLruWithHealth()`: LRU + Gesundheitspunkte-Sortierung

</details>

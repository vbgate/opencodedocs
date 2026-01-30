---
title: "Google Search: Gemini im Internet suchen lassen | Antigravity"
sidebarTitle: "Gemini im Internet suchen lassen"
subtitle: "Google Search Grounding: Gemini im Internet suchen lassen"
description: "Erfahren Sie, wie Sie Google Search Grounding für Gemini aktivieren, damit das Modell aktuelle Informationen aus dem Internet suchen kann. Lernen Sie die Konfiguration und Schwellenwert-Anpassung, um Genauigkeit und Geschwindigkeit auszubalancieren."
tags:
  - "gemini"
  - "google-search"
  - "grounding"
  - "Konfiguration"
prerequisite:
  - "start-quick-install"
  - "start-first-request"
order: "3"
---

# Google Search Grounding: Gemini im Internet suchen lassen

## Was Sie nach diesem Tutorial können

- Google Search für Gemini-Modelle aktivieren, damit die KI aktuelle Informationen aus dem Internet suchen kann
- Den Suchschwellenwert anpassen, um zu steuern, wie häufig das Modell sucht
- Die Funktionsweise und Anwendungsfälle von Google Search Grounding verstehen
- Die passende Konfiguration basierend auf Ihren Aufgabenanforderungen auswählen

## Ihre aktuelle Problematik

::: info Was ist Google Search Grounding?

**Google Search Grounding** ist eine Funktion von Gemini, die es dem Modell ermöglicht, bei Bedarf automatisch Google zu durchsuchen, um aktuelle Informationen (wie Nachrichten, Statistiken, Produktpreise usw.) zu erhalten, anstatt sich ausschließlich auf Trainingsdaten zu verlassen.

:::

Wenn Sie Gemini fragen "Wie ist das Wetter heute?" oder "Was ist die neueste VS Code-Versionsnummer", kann das Modell möglicherweise keine Antwort geben, da seine Trainingsdaten bereits veraltet sind. Nach der Aktivierung von Google Search Grounding kann das Modell selbst im Internet nach Antworten suchen, wie Sie es mit einem Browser tun würden.

## Wann Sie diese Funktion nutzen sollten

| Szenario | Aktivierung empfohlen? | Grund |
| --- | --- | --- |
| Codegenerierung, Programmierfragen | ❌ Nicht nötig | Programmierkenntnisse sind relativ stabil, Trainingsdaten reichen aus |
| Aktuelle Informationen abrufen (Nachrichten, Preise, Versionen) | ✅ Stark empfohlen | Echtzeitdaten erforderlich |
| Faktenprüfung (spezifische Daten, Statistiken) | ✅ Empfohlen | Verhindert, dass das Modell Informationen erfindet |
| Kreatives Schreiben, Brainstorming | ❌ Nicht nötig | Keine Faktengenauigkeit erforderlich |
| Technische Dokumentationssuche | ✅ Empfohlen | Aktuelle API-Dokumentation finden |

## Kernkonzept

Der Kern von Google Search Grounding besteht darin, dass das Modell**bei Bedarf**automatisch sucht, anstatt jedes Mal zu suchen. Das Plugin injiziert das `googleSearchRetrieval`-Tool, sodass Gemini die Google-Such-API aufrufen kann.

::: tip Wichtige Konzepte

- **Auto-Modus**: Das Modell entscheidet selbst, ob es sucht (basierend auf dem Schwellenwert)
- **Schwellenwert (grounding_threshold)**: Steuert die "Hürde" für das Modell zu suchen. Je kleiner der Wert, desto häufiger wird gesucht

:::

## 🎒 Vorbereitung vor dem Start

::: warning Voraussetzungsprüfung

Bevor Sie beginnen, stellen Sie sicher, dass:

- [ ] Sie die [Schnellinstallation](../../start/quick-install/) abgeschlossen haben
- [ ] Sie mindestens ein Google-Konto hinzugefügt haben
- [ ] Sie eine erste Anfrage erfolgreich gesendet haben (siehe [Erste Anfrage](../../start/first-request/))

:::

## Anleitung

### Schritt 1: Konfigurationsdatei prüfen

Die Konfigurationsdatei des Plugins befindet sich:

- **macOS/Linux**: `~/.config/opencode/antigravity.json`
- **Windows**: `%APPDATA%\opencode\antigravity.json`

Wenn die Datei nicht existiert, erstellen Sie sie zuerst:

```bash
# macOS/Linux
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json"
}
EOF
```

```powershell
# Windows
@"
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json"
}
"@ | Out-File -FilePath "$env:APPDATA\opencode\antigravity.json" -Encoding utf8
```

**Sie sollten sehen**: Die Konfigurationsdatei wurde erstellt und enthält das `$schema`-Feld

### Schritt 2: Google Search aktivieren

Fügen Sie die `web_search`-Konfiguration in der Konfigurationsdatei hinzu:

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "web_search": {
    "default_mode": "auto",
    "grounding_threshold": 0.3
  }
}
```

**Konfigurationserklärung**:

| Feld | Wert | Beschreibung |
| --- | --- | --- |
| `web_search.default_mode` | `"auto"` oder `"off"` | Google Search aktivieren oder deaktivieren, Standard ist `"off"` |
| `web_search.grounding_threshold` | `0.0` - `1.0` | Suchschwellenwert, Standard ist `0.3`, nur im `auto`-Modus wirksam |

**Sie sollten sehen**: Die Konfigurationsdatei wurde aktualisiert und enthält die `web_search`-Konfiguration

### Schritt 3: Suchschwellenwert anpassen (optional)

`grounding_threshold` steuert, wie häufig das Modell sucht:

| Schwellenwert | Verhalten | Anwendungsfall |
| --- | --- | --- |
| `0.0 - 0.2` | Häufige Suche, fast bei jeder Unsicherheit | Hochgenaue Echtzeitdaten erforderlich |
| `0.3` (Standard) | Ausgewogen, Modell sucht nur bei höherer Sicherheit | Täglicher Gebrauch, Balance zwischen Genauigkeit und Geschwindigkeit |
| `0.7 - 1.0` | Seltene Suche, nur bei hoher Konfidenz | Weniger Suchvorgänge, höhere Geschwindigkeit |

::: tip Praktische Tipps

Beginnen Sie mit dem Standardwert `0.3`. Wenn Sie feststellen:
- **Modell sucht nicht** → Schwellenwert senken (z.B. `0.2`)
- **Suche zu häufig, Antwort langsam** → Schwellenwert erhöhen (z.B. `0.5`)

:::

**Sie sollten sehen**: Der Schwellenwert wurde angepasst und kann basierend auf Ihrem Nutzungserlebnis optimiert werden

### Schritt 4: Konfiguration verifizieren

Starten Sie OpenCode neu oder laden Sie die Konfiguration neu (falls unterstützt), und senden Sie dann eine Anfrage, die aktuelle Informationen erfordert:

```
Benutzereingabe:
Was ist die neueste VS Code-Version?

Systemantwort (Google Search aktiviert):
Die neueste stabile VS Code-Version ist 1.96.4 (Stand Januar 2026)...

[citation:1] ← Quellenverweis-Markierung
```

**Sie sollten sehen**:
- Die Antwort des Modells enthält Quellenverweise (`[citation:1]` usw.)
- Der Inhalt ist aktuell, nicht eine alte Version aus den Trainingsdaten

### Schritt 5: Verschiedene Schwellenwerte testen

Passen Sie `grounding_threshold` an und beobachten Sie die Verhaltensänderungen des Modells:

```json
// Niedriger Schwellenwert (häufige Suche)
"grounding_threshold": 0.1

// Hoher Schwellenwert (seltene Suche)
"grounding_threshold": 0.7
```

Testen Sie nach jeder Anpassung mit derselben Frage und beobachten Sie:
- Ob gesucht wird (prüfen Sie, ob Antworten Quellenverweise enthalten)
- Suchhäufigkeit (mehrere `citation`-Verweise)
- Antwortgeschwindigkeit

**Sie sollten sehen**:
- Niedriger Schwellenwert: Häufigere Suche, aber etwas langsamere Antworten
- Hoher Schwellenwert: Seltener Suchvorgang, aber möglicherweise ungenauere Antworten

## Checkliste ✅

::: details Klicken zum Aufklappen der Verifikationsliste

Führen Sie folgende Prüfungen durch, um die korrekte Konfiguration zu bestätigen:

- [ ] Konfigurationsdatei enthält `web_search`-Konfiguration
- [ ] `default_mode` ist auf `"auto"` gesetzt
- [ ] `grounding_threshold` liegt zwischen `0.0` und `1.0`
- [ ] Bei Anfragen, die aktuelle Informationen erfordern, gibt das Modell Antworten mit Quellenverweisen zurück
- [ ] Nach Anpassung des Schwellenwerts ändern sich die Suchverhalten des Modells

Wenn alle Punkte erfüllt sind, ist Google Search Grounding korrekt aktiviert!

:::

## Fallstricke und Hinweise

### Problem 1: Modell sucht nicht

**Symptom**: Nach Aktivierung des `auto`-Modus sucht das Modell immer noch nicht und zeigt auch keine Quellenverweise.

**Ursachen**:
- Schwellenwert zu hoch (z.B. `0.9`), Modell benötigt sehr hohe Sicherheit zum Suchen
- Die Frage selbst erfordert keine Suche (z.B. Programmierfragen)

**Lösungen**:
- `grounding_threshold` auf `0.2` oder niedriger senken
- Fragen testen, die eindeutig aktuelle Informationen erfordern (z.B. "Wie ist das Wetter heute?", "Neueste Nachrichten")

### Problem 2: Suche zu häufig, Antwort langsam

**Symptom**: Jede Frage löst eine Suche aus, die Antwortzeit erhöht sich deutlich.

**Ursachen**:
- Schwellenwert zu niedrig (z.B. `0.1`), Modell löst zu häufig Suchvorgänge aus
- Fragetyp erfordert本身 Echtzeitinformationen (z.B. Aktienkurse, Nachrichten)

**Lösungen**:
- `grounding_threshold` auf `0.5` oder höher erhöhen
- Wenn die Aufgabe keine Echtzeitinformationen benötigt, `default_mode` auf `"off"` setzen

### Problem 3: Konfigurationsdatei-Formatfehler

**Symptom**: Plugin meldet Fehler, Konfiguration kann nicht geladen werden.

**Ursache**: JSON-Formatfehler (z.B. überzählige Kommas, nicht übereinstimmende Anführungszeichen).

**Lösung**: JSON-Validierungstool verwenden, um die Konfigurationsdatei zu prüfen und korrektes Format sicherzustellen.

```bash
# JSON-Format validieren
cat ~/.config/opencode/antigravity.json | python3 -m json.tool
```

## Zusammenfassung dieser Lektion

- **Google Search Grounding** ermöglicht Gemini-Modellen, aktuelle Informationen aus dem Internet zu suchen
- Aktivierung über `web_search.default_mode: "auto"`, Deaktivierung über `"off"`
- `grounding_threshold` steuert die Suchhäufigkeit: Je kleiner der Wert, desto häufiger die Suche
- Der Standardschwellenwert `0.3` eignet sich für die meisten Szenarien und kann basierend auf dem Nutzungserlebnis angepasst werden
- Das Modell verweist in seinen Antworten auf Quellen, markiert als `[citation:1]` usw.

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir das **[Dual-Quota-System](../dual-quota-system/)**.
>
> Sie werden lernen:
> - Wie Antigravity und Gemini CLI zwei unabhängige Quota-Pools funktionieren
> - Wie Sie zwischen Quota-Pools wechseln und die Auslastung maximieren
> - Best Practices für Quota-Pooling

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Aufklappen der Quellcode-Positionen</strong></summary>

> Aktualisierungsdatum: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Google Search Konfiguration Schema | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 303-319 |
| Google Search Typendefinition | [`src/plugin/transform/types.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/types.ts) | 85-88 |
| Google Search Injektionslogik | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 402-419 |
| Google Search Konfigurationsladen | [`src/plugin/config/loader.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/loader.ts) | 173-184 |
| Google Search Konfigurationsanwendung | [`src/plugin.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin.ts) | 1194-1196 |

**Wichtige Konfigurationsoptionen**:

- `web_search.default_mode`: `"auto"` oder `"off"`, Standard ist `"off"`
- `web_search.grounding_threshold`: `0.0` - `1.0`, Standard ist `0.3`

**Wichtige Funktionen**:

- `applyGeminiTransforms()`: Wendet alle Gemini-Transformationen an, einschließlich Google Search-Injektion
- `normalizeGeminiTools()`: Normalisiert das Tool-Format und behält das `googleSearchRetrieval`-Tool bei
- `wrapToolsAsFunctionDeclarations()`: Wrapt Tools als `functionDeclarations`-Format

**Funktionsweise**:

1. Das Plugin liest `web_search.default_mode` und `grounding_threshold` aus der Konfigurationsdatei
2. Wenn `mode === "auto"`, wird das `googleSearchRetrieval`-Tool in das `tools`-Array der Anfrage injiziert:
   ```json
   {
     "googleSearchRetrieval": {
       "dynamicRetrievalConfig": {
         "mode": "MODE_DYNAMIC",
         "dynamicThreshold": 0.3  // grounding_threshold
       }
     }
   }
   ```
3. Das Gemini-Modell entscheidet basierend auf dem Schwellenwert, ob es das Suchtool aufruft
4. Die Suchergebnisse werden in die Antwort aufgenommen und mit Quellenverweisen markiert (`[citation:1]` usw.)

</details>

---
title: "Erste Anfrage: Antigravity-Installation verifizieren | opencode-antigravity-auth"
sidebarTitle: "Erste Anfrage senden"
description: "Lernen Sie, Ihre erste Antigravity-Modellanfrage zu senden und zu überprüfen, ob OAuth-Authentifizierung und Konfiguration korrekt sind. Verstehen Sie Modellauswahl, Variant-Parameter-Nutzung und gängige Fehlerbehebung."
subtitle: "Erste Anfrage: Installation erfolgreich verifizieren"
tags:
  - "Installationsverifizierung"
  - "Modellanfrage"
  - "Schnellstart"
prerequisite:
  - "start-quick-install"
order: 4
---

# Erste Anfrage: Installation erfolgreich verifizieren

## Was Sie nach diesem Kurs können

- Ihre erste Antigravity-Modellanfrage senden
- Die Funktion der `--model`- und `--variant`-Parameter verstehen
- Das passende Modell und die Denkkonfiguration basierend auf Ihren Anforderungen auswählen
- Gängige Modellanfragefehler beheben

## Ihre aktuelle Situation

Sie haben das Plugin gerade installiert, die OAuth-Authentifizierung abgeschlossen und die Modelldefinitionen konfiguriert, aber sind sich nun nicht sicher:
- Funktioniert das Plugin wirklich?
- Mit welchem Modell sollte ich Tests beginnen?
- Wie verwendet man den `--variant`-Parameter?
- Wenn die Anfrage fehlschlägt, wie finde ich heraus, bei welchem Schritt das Problem liegt?

## Wann diese Methode anzuwenden ist

Verwenden Sie die Verifizierungsmethode dieses Kurses in den folgenden Szenarien:
- **Nach der Erstinstallation** — Bestätigen, dass Authentifizierung, Konfiguration und Modell ordnungsgemäß funktionieren
- **Nach Hinzufügen eines neuen Kontos** — Verifizieren, ob das neue Konto verfügbar ist
- **Nach Ändern der Modellkonfiguration** — Bestätigen, dass die neue Modellkonfiguration korrekt ist
- **Vor dem Auftreten von Problemen** — Eine Basislinie erstellen, um spätere Vergleiche zu ermöglichen

## 🎒 Vorbereitungen vor dem Start

::: warning Voraussetzungen prüfen

Bevor Sie fortfahren, bestätigen Sie bitte:

- ✅ [Schnellinstallation](/de/NoeFabris/opencode-antigravity-auth/start/quick-install/) abgeschlossen
- ✅ `opencode auth login` ausgeführt, um OAuth-Authentifizierung abzuschließen
- ✅ Modelldefinitionen zu `~/.config/opencode/opencode.json` hinzugefügt
- ✅ OpenCode-Terminal oder CLI verfügbar

:::

## Kernkonzept

### Warum zuerst verifizieren?

Das Plugin erfordert die Zusammenarbeit mehrerer Komponenten:
1. **OAuth-Authentifizierung** — Zugriffstoken erhalten
2. **Kontenverwaltung** — Verfügbare Konten auswählen
3. **Anfragenumwandlung** — OpenCode-Format in Antigravity-Format umwandeln
4. **Streaming-Antwort** — SSE-Antworten verarbeiten und zurück in OpenCode-Format umwandeln

Das Senden der ersten Anfrage kann verifizieren, ob die gesamte Verbindung funktioniert. Bei Erfolg bedeutet dies, dass alle Komponenten ordnungsgemäß funktionieren; bei Fehlschlag kann das Problem anhand der Fehlermeldung lokalisiert werden.

### Beziehung zwischen Modell und Variant

Im Antigravity-Plugin sind **Modell und Variant zwei unabhängige Konzepte**:

| Konzept | Funktion | Beispiel |
| --- | --- | --- |
| **Modell** | Das spezifische KI-Modell auswählen | `antigravity-claude-sonnet-4-5-thinking` |
| **Variant** | Den Denkbudget oder Modus des Modells konfigurieren | `low` (leichtes Denken), `max` (maximales Denken) |

::: info Was ist ein Denkbudget?

Ein Denkbudget (thinking budget) bezieht sich auf die Anzahl der Token, die ein Modell vor der Generierung einer Antwort zum "Denken" verwenden kann. Ein höheres Budget bedeutet, dass das Modell mehr Zeit für das Schlussfolgern hat, aber auch die Antwortzeit und Kosten erhöht.

- **Claude Thinking-Modelle**: Konfiguriert mit `thinkingConfig.thinkingBudget` (Einheit: Token)
- **Gemini 3-Modelle**: Konfiguriert mit `thinkingLevel` (String-Level: minimal/low/medium/high)

:::

### Empfohlene Einsteigerkombinationen

Empfohlene Modell- und Variant-Kombinationen für verschiedene Anforderungen:

| Anforderung | Modell | Variant | Merkmale |
| --- | --- | --- | --- |
| **Schneller Test** | `antigravity-gemini-3-flash` | `minimal` | Schnellste Antwort, geeignet für Verifizierung |
| **Tägliche Entwicklung** | `antigravity-claude-sonnet-4-5-thinking` | `low` | Ausgewogen zwischen Geschwindigkeit und Qualität |
| **Komplexes Schlussfolgern** | `antigravity-claude-opus-4-5-thinking` | `max` | Stärkste Schlussfolgerungsfähigkeit |
| **Vision-Aufgaben** | `antigravity-gemini-3-pro` | `high` | Multimodale Unterstützung (Bilder/PDFs) |

## Mach mit

### Schritt 1: Einfachste Testanfrage senden

Testen Sie zuerst mit dem einfachsten Befehl, ob die grundlegende Verbindung funktioniert.

**Warum**
Diese Anfrage verwendet keine Thinking-Funktion, gibt sehr schnell zurück und ist geeignet, um Authentifizierung und Kontostatus schnell zu verifizieren.

**Befehl ausführen**

```bash
opencode run "Hello" --model=google/antigravity-claude-sonnet-4-5
```

**Sie sollten sehen**

```
Hello! I'm Claude Sonnet 4.5, an AI assistant...
```

::: tip Erfolgsindikator

Wenn Sie die Antwort der KI sehen, bedeutet dies:
- ✅ OAuth-Authentifizierung erfolgreich
- ✅ Konto hat Zugriffsberechtigung
- ✅ Anfragenumwandlung funktioniert normal
- ✅ Streaming-Antwort korrekt geparst

:::

### Schritt 2: Thinking-Modell und Variant verwenden

Testen Sie nun den vollständigen Thinking-Prozess, einschließlich des Variant-Parameters.

**Warum**
Thinking-Modelle erfordern zusätzliche Anfragenumwandlungslogik, was eine der Kernfunktionen des Plugins ist.

**Befehl ausführen**

```bash
opencode run "Erkläre, was ein Closure ist, mit einer einfachen Metapher" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=max
```

**Sie sollten sehen**

1. **Streaming-Thinking-Ausgabe**: Sie sehen, dass das Modell zuerst den Thinking-Prozess ausgibt (mit `<thinking>`-Tags)
2. **Thinking-Prozess**: Das Modell analysiert detailliert, wie die Antwort organisiert werden soll
3. **Finale Antwort**: Nach Abschluss des Thinking-Prozesses wird die finale Inhalt ausgegeben

::: details Ein vollständiges Antwortbeispiel ansehen

```
<thinking>
Der Benutzer fragt, was ein Closure ist, und möchte eine einfache Metapher zur Erklärung.

Konzept des Closures:
1. Funktionen können auf Variablen aus ihrem äußeren Geltungsbereich zugreifen
2. Auch wenn die äußere Funktion bereits ausgeführt wurde
3. Diese Fähigkeit ist wie ein "Rucksack"

Metaphern-Ansatz:
- Kann "Rucksack"-Metapher verwenden
- Funktion nimmt beim Zurückgeben einige Variablen mit
- Wie beim Verlassen des Hauses mit Dingen aus dem Haus im Rucksack
</thinking>

Ein Closure ist wie ein "Rucksack" einer Funktion.

Wenn eine Funktion erstellt wird, "packt" sie alle Variablen, auf die sie zugreifen kann, in diesen "Rucksack", so wie man vor dem Verlassen des Hauses die benötigten Dinge in den Rucksack packt. Auch wenn die Funktion den Ort verlässt, an dem sie erstellt wurde (die äußere Funktion wurde ausgeführt), kann sie weiterhin über diesen "Rucksack" auf diese Variablen zugreifen.

Ein Beispiel:
```javascript
function createCounter() {
  let count = 0;  // Diese Variable wird in den "Rucksack" gepackt
  return function() {
    count++;  // Kann weiterhin auf die Variable im Rucksack zugreifen
    return count;
  };
}
```
```

:::

**Kontrollpunkt ✅**

- [ ] `<thinking>`-Block gesehen (wenn `keep_thinking: true` konfiguriert)
- [ ] Antwortinhalt ist sinnvoll und logisch
- [ ] Antwortzeit im akzeptablen Bereich (normalerweise 2-10 Sekunden)

### Schritt 3: Gemini 3-Modell testen

Testen Sie verschiedene Denkniveaus mit Gemini 3 Pro.

**Warum**
Gemini 3 verwendet String-Level `thinkingLevel`, um die Unterstützung für verschiedene Modellfamilien zu verifizieren.

**Befehl ausführen**

```bash
# Gemini 3 Flash testen (schnelle Antwort)
opencode run "Schreibe einen Bubble Sort" --model=google/antigravity-gemini-3-flash --variant=low

# Gemini 3 Pro testen (tiefgreifendes Denken)
opencode run "Analysiere die Zeitkomplexität von Bubble Sort" --model=google/antigravity-gemini-3-pro --variant=high
```

**Sie sollten sehen**

- Flash-Modell antwortet schneller (geeignet für einfache Aufgaben)
- Pro-Modell denkt tiefer (geeignet für komplexe Analysen)
- Beide Modelle funktionieren normal

### Schritt 4: Multimodale Fähigkeiten testen (optional)

Wenn Ihre Modellkonfiguration Bildeingabe unterstützt, können Sie die multimodale Funktion testen.

**Warum**
Antigravity unterstützt Bilder/PDFs als Eingabe, was in vielen Szenarien benötigt wird.

**Ein Testbild vorbereiten**: Eine beliebige Bilddatei (z.B. `test.png`)

**Befehl ausführen**

```bash
opencode run "Beschreibe den Inhalt dieses Bildes" --model=google/antigravity-gemini-3-pro --image=test.png
```

**Sie sollten sehen**

- Das Modell beschreibt den Bildinhalt genau
- Die Antwort enthält visuelle Analyseergebnisse

## Kontrollpunkt ✅

Nach Abschluss der obigen Tests bestätigen Sie die folgende Checkliste:

| Kontrollpunkt | Erwartetes Ergebnis | Status |
| --- | --- | ---|
| **Grundverbindung** | Schritt 1 einfache Anfrage erfolgreich | ☐ |
| **Thinking-Modell** | Schritt 2 Thinking-Prozess gesehen | ☐ |
| **Gemini 3-Modell** | Schritt 3 beide Modelle normal | ☐ |
| **Variant-Parameter** | Unterschiedliche Varianten erzeugen unterschiedliche Ergebnisse | ☐ |
| **Streaming-Ausgabe** | Antwort wird in Echtzeit angezeigt, keine Unterbrechung | ☐ |

::: tip Alles bestanden?

Wenn alle Kontrollpunkte bestanden sind, herzlichen Glückwunsch! Das Plugin ist vollständig konfiguriert und einsatzbereit.

Als Nächstes können Sie:
- [Verfügbare Modelle erkunden](/de/NoeFabris/opencode-antigravity-auth/platforms/available-models/)
- [Multi-Account-Lastverteilung konfigurieren](/de/NoeFabris/opencode-antigravity-auth/advanced/multi-account-setup/)
- [Google Search aktivieren](/de/NoeFabris/opencode-antigravity-auth/platforms/google-search-grounding/)

:::

## Warnhinweise für Stolperfallen

### Fehler 1: `Model not found`

**Fehlermeldung**
```
Error: Model 'antigravity-claude-sonnet-4-5' not found
```

**Ursache**
Die Modelldefinition wurde nicht korrekt zu `opencode.json` unter `provider.google.models` hinzugefügt.

**Lösung**

Überprüfen Sie die Konfigurationsdatei:

```bash
cat ~/.config/opencode/opencode.json | grep -A 10 "models"
```

Bestätigen Sie, dass das Modell das korrekte Format hat:

```json
{
  "provider": {
    "google": {
      "models": {
        "antigravity-claude-sonnet-4-5": {
          "name": "Claude Sonnet 4.5 (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        }
      }
    }
  }
}
```

::: warning Achten Sie auf die Schreibweise

Der Modellname muss exakt mit dem Schlüssel in der Konfigurationsdatei übereinstimmen (Groß-/Kleinschreibung beachten):

- ❌ Falsch: `--model=google/claude-sonnet-4-5`
- ✅ Richtig: `--model=google/antigravity-claude-sonnet-4-5`

:::

### Fehler 2: `403 Permission Denied`

**Fehlermeldung**
```
403 Permission denied on resource '//cloudaicompanion.googleapis.com/...'
```

**Ursache**
1. OAuth-Authentifizierung nicht abgeschlossen
2. Konto hat keine Zugriffsberechtigung
3. Project ID Konfigurationsproblem (für Gemini CLI Modelle)

**Lösung**

1. **Authentifizierungsstatus prüfen**:
   ```bash
   cat ~/.config/opencode/antigravity-accounts.json
   ```

   Sie sollten mindestens einen Kontoeintrag sehen.

2. **Wenn das Konto leer ist oder die Authentifizierung fehlschlägt**:
   ```bash
   rm ~/.config/opencode/antigravity-accounts.json
   opencode auth login
   ```

3. **Wenn ein Gemini CLI-Modellfehler auftritt**:
   Project ID muss manuell konfiguriert werden (siehe [FAQ - 403 Permission Denied](/de/NoeFabris/opencode-antigravity-auth/faq/common-auth-issues/))

### Fehler 3: `Invalid variant 'max'`

**Fehlermeldung**
```
Error: Invalid variant 'max' for model 'antigravity-gemini-3-pro'
```

**Ursache**
Verschiedene Modelle unterstützen unterschiedliche Variant-Konfigurationsformate.

**Lösung**

Überprüfen Sie die Variant-Definition in der Modellkonfiguration:

| Modelltyp | Variant-Format | Beispielwert |
| --- | --- | ---|
| **Claude Thinking** | `thinkingConfig.thinkingBudget` | `{ "thinkingConfig": { "thinkingBudget": 32768 } }` |
| **Gemini 3** | `thinkingLevel` | `{ "thinkingLevel": "high" }` |
| **Gemini 2.5** | `thinkingConfig.thinkingBudget` | `{ "thinkingConfig": { "thinkingBudget": 8192 } }` |

**Korrektes Konfigurationsbeispiel**:

```json
{
  "antigravity-claude-sonnet-4-5-thinking": {
    "name": "Claude Sonnet 4.5 Thinking",
    "variants": {
      "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
      "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
    }
  },
  "antigravity-gemini-3-pro": {
    "name": "Gemini 3 Pro",
    "variants": {
      "low": { "thinkingLevel": "low" },
      "high": { "thinkingLevel": "high" }
    }
  }
}
```

### Fehler 4: Anfrage-Timeout oder keine Antwort

**Symptom**
Der Befehl wird lange Zeit ohne Ausgabe ausgeführt oder endet schließlich mit einem Timeout.

**Mögliche Ursachen**
1. Netzwerkverbindungsproblem
2. Langsame Serverantwort
3. Alle Konten befinden sich im Rate-Limit-Status

**Lösung**

1. **Netzwerkverbindung prüfen**:
   ```bash
   ping cloudaicompanion.googleapis.com
   ```

2. **Debug-Logs ansehen**:
   ```bash
   OPENCODE_ANTIGRAVITY_DEBUG=1 opencode run "test" --model=google/antigravity-claude-sonnet-4-5
   ```

3. **Kontostatus prüfen**:
   ```bash
   cat ~/.config/opencode/antigravity-accounts.json
   ```

   Wenn Sie sehen, dass alle Konten einen `rateLimit`-Zeitstempel haben, sind sie alle raten-limitiert und müssen warten, bis sie zurückgesetzt werden.

### Fehler 5: SSE-Streaming-Ausgabe unterbrochen

**Symptom**
Die Antwort stoppt mitten im Prozess oder Sie sehen nur einen Teil des Inhalts.

**Mögliche Ursachen**
1. Instabiles Netzwerk
2. Konten-Token läuft während der Anfrage ab
3. Serverfehler

**Lösung**

1. **Debug-Logs aktivieren, um detaillierte Informationen zu sehen**:
   ```bash
   OPENCODE_ANTIGRAVITY_DEBUG=2 opencode run "test"
   ```

2. **Log-Dateien prüfen**:
   ```bash
   tail -f ~/.config/opencode/antigravity-logs/latest.log
   ```

3. **Bei häufigen Unterbrechungen**:
   - Versuchen Sie, zu einer stabileren Netzwerkumgebung zu wechseln
   - Verwenden Sie Nicht-Thinking-Modelle, um die Anfragezeit zu reduzieren
   - Prüfen Sie, ob das Konto nahe am Kontingentlimit ist

## Zusammenfassung dieses Kurses

Das Senden der ersten Anfrage ist ein entscheidender Schritt zur Verifizierung einer erfolgreichen Installation. Durch diesen Kurs haben Sie gelernt:

- **Grundlegende Anfrage**: Verwendung von `opencode run --model`, um Anfragen zu senden
- **Variant-Nutzung**: Konfiguration des Denkbudgets durch `--variant`
- **Modellauswahl**: Auswahl von Claude- oder Gemini-Modellen basierend auf Anforderungen
- **Problembehebung**: Lokalisierung und Lösung von Problemen basierend auf Fehlermeldungen

::: tip Empfohlene Praktiken

In der täglichen Entwicklung:

1. **Zuerst einfache Tests verwenden**: Nach jeder Konfigurationsänderung zuerst eine einfache Anfrage zur Verifizierung senden
2. **Schrittweise Komplexität erhöhen**: Von no thinking → low thinking → max thinking
3. **Basisantworten aufzeichnen**: Sich die Antwortzeiten unter normalen Umständen merken, um Vergleiche zu ermöglichen
4. **Debug-Logs geschickt nutzen**: Bei Problemen `OPENCODE_ANTIGRAVITY_DEBUG=2` aktivieren

---

## Vorschau auf den nächsten Kurs

> Im nächsten Kurs lernen wir **[Verfügbare Modelle im Überblick](/de/NoeFabris/opencode-antigravity-auth/platforms/available-models/)**.
>
> Sie werden lernen:
> - Vollständige Liste und Merkmale aller verfügbaren Modelle
> - Auswahlleitfaden für Claude- und Gemini-Modelle
> - Vergleich von Kontext- und Ausgabelimits
> - Beste Anwendungsszenarien für Thinking-Modelle

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | ---|
| Anfragenumwandlungseinstieg | [`src/plugin/request.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request.ts) | 1-100 |
| Kontenauswahl und Token-Verwaltung | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts) | 1-50 |
| Claude-Modellumwandlung | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | Volltext |
| Gemini-Modellumwandlung | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | Volltext |
| Streaming-Antwortverarbeitung | [`src/plugin/core/streaming/index.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/core/streaming/index.ts) | Volltext |
| Debug-Log-System | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts) | Volltext |

**Wichtige Funktionen**:
- `prepareAntigravityRequest()`: Wandelt OpenCode-Anfragen in Antigravity-Format um (`request.ts`)
- `createStreamingTransformer()`: Erstellt Streaming-Antwort-Transformer (`core/streaming/`)
- `resolveModelWithVariant()`: Parst Modell- und Variant-Konfiguration (`transform/model-resolver.ts`)
- `getCurrentOrNextForFamily()`: Wählt Konto für Anfrage aus (`accounts.ts`)

**Konfigurationsbeispiele**:
- Modellkonfigurationsformat: [`README.md#models`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/README.md#L110)
- Detaillierte Variant-Erklärung: [`docs/MODEL-VARIANTS.md`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/docs/MODEL-VARIANTS.md)

</details>

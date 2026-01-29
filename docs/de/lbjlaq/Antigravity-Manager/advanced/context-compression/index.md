---
title: "Kontextkomprimierung: Stabilität langer Sitzungen | Antigravity-Manager"
sidebarTitle: "Lange Sitzungen stabilisieren"
subtitle: "Kontextkomprimierung: Stabilität langer Sitzungen"
description: "Lernen Sie den dreischichtigen Kontextkomprimierungsmechanismus von Antigravity kennen. Reduzieren Sie 400-Fehler und Versagen durch zu lange Prompts durch Werkzeugrunden-Beschneidung, Thinking-Komprimierung und Signatur-Caching."
tags:
  - "Kontextkomprimierung"
  - "Signatur-Caching"
  - "Thinking"
  - "Tool Result"
  - "Stabilität"
prerequisite:
  - "start-proxy-and-first-client"
  - "advanced-monitoring"
order: 8
---

# Stabilität langer Sitzungen: Kontextkomprimierung, Signatur-Caching und Werkzeugergebnis-Komprimierung

Wenn Sie lange Sitzungen mit Clients wie Claude Code oder Cherry Studio ausführen, ist das größte Problem nicht die mangelnde Intelligenz des Modells, sondern dass die Konversation plötzlich Fehler wie `Prompt is too long`, 400-Signaturfehler, unterbrochene Werkzeugaufrufketten oder immer langsamere Werkzeugschleifen beginnt.

In diesem Lernprogramm erklären wir die drei Maßnahmen, die Antigravity Tools für diese Probleme getroffen hat: Kontextkomprimierung (dreischichtige schrittweise Intervention), Signatur-Caching (die Signaturkette von Thinking wiederherstellen) und Werkzeugergebnis-Komprimierung (verhindern, dass Werkzeugausgaben den Kontext sprengen).

## Was Sie nach Abschluss können

- Die drei schichtweisen progressiven Kontextkomprimierungsstufen erklären und deren jeweilige Kosten verstehen
- Wissen, was im Signatur-Caching gespeichert wird (Tool/Family/Session drei Ebenen) und wie die 2-Stunden-TTL wirkt
- Die Regeln für die Werkzeugergebnis-Komprimierung verstehen: wann base64-Bilder entfernt werden und wann Browser-Snapshots zu Kopf- und Endzusammenfassungen werden
- Die Schwellenwerte von `proxy.experimental` anpassen können, um den Komprimierungszeitpunkt zu steuern

## Ihr aktuelles Dilemma

- Lange Konversationen führen plötzlich zu 400-Fehlern: Sieht aus wie eine ungültige Signatur, aber Sie wissen nicht, woher die Signatur kommt und wo sie verloren geht
- Immer mehr Werkzeugaufrufe, historische tool_results stauen sich bis zur direkten Ablehnung durch den Upstream (oder werden extrem langsam)
- Sie möchten Komprimierung als Rettung einsetzen, sorgen sich aber um die Zerstörung des Prompt Cache, Auswirkungen auf die Konsistenz oder Informationsverluste durch das Modell

## Wann Sie diese Taktik einsetzen

- Sie führen Aufgaben mit langen Werkzeugketten aus (Suchen/Dateien lesen/Browser-Snapshots/mehrere Werkzeugschleifen)
- Sie verwenden Thinking-Modelle für komplexes Schließen und die Sitzung übersteigt oft Dutzende von Runden
- Sie untersuchen Stabilitätsprobleme, die auf dem Client reproduzierbar sind, deren Ursache Ihnen aber nicht klar ist

## Was ist Kontextkomprimierung

**Kontextkomprimierung** ist die automatische Rauschunterdrückung und Verkleinerung historischer Nachrichten durch den Agenten, wenn er erkennt, dass der Kontextdruck zu hoch ist: Zuerst alte Werkzeugrunden beschneiden, dann alter Thinking-Text zu einem Platzhalter komprimieren aber die Signatur behalten, und schließlich im Extremfall eine XML-Zusammenfassung generieren und eine neue Sitzung forken, um das Gespräch fortzusetzen, wodurch Versagen durch zu lange Prompts und unterbrochene Signaturketten reduziert werden.

::: info Wie wird der Kontextdruck berechnet?
Der Claude-Prozessor führt mit `ContextManager::estimate_token_usage()` eine leichte Schätzung durch, kalibriert mit `estimation_calibrator`, und erhält dann `usage_ratio = estimated_usage / context_limit` als Prozentsatz des Drucks (die Logs geben raw/calibrated-Werte aus).
:::

## 🎒 Vorbereitungen vor dem Start

- Sie haben einen lokalen Proxy eingerichtet und der Client nutzt tatsächlich die Kette `/v1/messages` (siehe Lokalen Reverse-Proxy starten und ersten Client einbinden)
- Sie können Proxy-Protokolle ansehen (Entwicklerdebugging oder lokale Protokolldateien). Der Testplan im Repository gibt einen Beispielprotokollpfad und grep-Methode an (siehe `docs/testing/context_compression_test_plan.md`)

::: tip Kombination mit Proxy Monitor für bessere Lokalisierung
Wenn Sie die Komprimierungsauslösung mit Anforderungstypen, Konten oder Werkzeugaufrufrunden in Verbindung bringen möchten, empfiehlt es sich, Proxy Monitor gleichzeitig zu öffnen.
:::

## Kernkonzept

Diese Stabilitätslösung löscht nicht einfach die gesamte Historie, sondern greift schichtweise mit zunehmenden Kosten ein:

| Ebene | Auslöser (konfigurierbar) | Was getan wird | Kosten/Nebenwirkungen |
| --- | --- | --- | --- |
| Layer 1 | `proxy.experimental.context_compression_threshold_l1` (Standard 0,4) | Identifiziert Werkzeugrunden, behält nur die letzten N Runden (im Code 5), löscht frühere tool_use/tool_result-Paare | Ändert nicht den Inhalt verbleibender Nachrichten, Prompt Cache-freundlicher |
| Layer 2 | `proxy.experimental.context_compression_threshold_l2` (Standard 0,55) | Komprimiert alten Thinking-Text zu `"..."`, behält aber `signature` und schützt die letzten 4 Nachrichten vor Änderungen | Ändert historische Inhalte, Kommentare weisen explizit darauf hin, dass cache gebrochen wird, kann aber Signaturkette retten |
| Layer 3 | `proxy.experimental.context_compression_threshold_l3` (Standard 0,7) | Ruft ein Hintergrundmodell auf, um eine XML-Zusammenfassung zu generieren, und forkt eine neue Nachrichtensequenz, um das Gespräch fortzusetzen | Abhängig von Hintergrundmodellaufrufen; bei Fehlern wird 400 zurückgegeben (mit freundlicher Meldung) |

Im Folgenden erkläre ich die drei Ebenen im Detail und nehme Signatur-Caching und Werkzeugergebnis-Komprimierung dazu.

### Layer 1: Werkzeugrunden-Beschneidung (Trim Tool Messages)

Der Schlüsselpunkt von Layer 1 ist das Löschen ganzer Werkzeuginteraktionsrunden, um inkonsistente Kontexte durch halb gelöschte Runden zu vermeiden.

- Die Identifizierungsregel für eine Werkzeuginteraktionsrunde befindet sich in `identify_tool_rounds()`: Wenn in `assistant` ein `tool_use` erscheint, beginnt eine Runde, ein nachfolgendes `tool_result` in `user` zählt noch zu dieser Runde, bis ein normaler user-Text diese Runde beendet.
- Die eigentliche Beschneidung wird von `ContextManager::trim_tool_messages(&mut messages, 5)` ausgeführt: Wenn die historischen Werkzeugrunden 5 Runden überschreiten, werden Nachrichten aus früheren Runden gelöscht.

### Layer 2: Thinking-Komprimierung unter Beibehaltung der Signatur

Viele 400-Probleme entstehen nicht, weil Thinking zu lang ist, sondern weil die Signaturkette von Thinking unterbrochen ist. Die Strategie von Layer 2 ist:

- Verarbeitet nur `ContentBlock::Thinking { thinking, signature, .. }` in `assistant`-Nachrichten
- Komprimiert nur wenn `signature.is_some()` und `thinking.len() > 10`, ändert `thinking` direkt zu `"..."`
- Die letzten `protected_last_n = 4` Nachrichten werden nicht komprimiert (ungefähr die letzten 2 Runden user/assistant)

Dies spart viele Token, behält aber die `signature` in der Historie, wodurch verhindert wird, dass die Werkzeugkette bei Rückfüllung von Signaturen nicht wiederhergestellt werden kann.

### Layer 3: Fork + XML-Zusammenfassung (letzte Sicherheitsnetz)

Wenn der Druck weiter steigt, versucht der Claude-Prozessor, die Sitzung neu zu öffnen, ohne wichtige Informationen zu verlieren:

1. Extrahiert die letzte gültige Thinking-Signatur aus den ursprünglichen Nachrichten (`ContextManager::extract_last_valid_signature()`)
2. Verknüpft die gesamte Historie + `CONTEXT_SUMMARY_PROMPT` zu einer XML-Zusammenfassungserzeugungsanforderung, das Modell ist fest auf `BACKGROUND_MODEL_LITE` eingestellt (aktuell im Code `gemini-2.5-flash`)
3. Die Zusammenfassung muss `<latest_thinking_signature>` enthalten, für die Fortsetzung der Signaturkette
4. Fork eine neue Nachrichtensequenz:
   - `User: Context has been compressed... + XML summary`
   - `Assistant: I have reviewed...`
   - Anhängen der letzten user-Nachricht der ursprünglichen Anforderung (falls sie nicht gerade die Zusammenfassungsanweisung ist)

Wenn Fork + Zusammenfassung fehlschlägt, wird direkt `StatusCode::BAD_REQUEST` zurückgegeben, mit dem Hinweis, Sie sollten manuell mit `/compact` oder `/clear` verfahren (siehe error JSON, der vom Prozessor zurückgegeben wird).

### Nebenweg 1: Dreischichtiges Signatur-Caching (Tool / Family / Session)

Signatur-Caching ist die Sicherung der Kontextkomprimierung, insbesondere wenn Clients Signaturfelder beschneiden/verwerfen.

- TTL: `SIGNATURE_TTL = 2 * 60 * 60` (2 Stunden)
- Layer 1: `tool_use_id -> signature` (Werkzeugkettenwiederherstellung)
- Layer 2: `signature -> model family` (Kompatibilitätsprüfung zwischen Modellen, vermeidet, dass Claude-Signaturen auf Gemini-Familienmodelle übertragen werden)
- Layer 3: `session_id -> latest signature` (Sitzungsbasierte Isolierung, vermeidet Kontamination zwischen verschiedenen Konversationen)

Diese drei Caching-Ebenen werden beim Claude SSE-Stream-Parsing und der Anforderungskonvertierung geschrieben/gelesen:

- Beim Stream-Parsing wird die thinking-`signature` in den Session Cache (und den family Cache) geschrieben
- Beim Stream-Parsing wird die tool_use-`signature` in den Tool Cache + Session Cache geschrieben
- Bei der Konvertierung von Claude-Werkzeugaufrufen in Gemini `functionCall` werden Signaturen bevorzugt aus Session Cache oder Tool Cache zurückgefüllt

### Nebenweg 2: Werkzeugergebnis-Komprimierung (Tool Result Compressor)

Werkzeugergebnisse sprengen den Kontext oft eher als Chat-Texte, daher werden tool_results in der Anforderungskonvertierungsphase vorhersagbar reduziert.

Kernregeln (alle in `tool_result_compressor.rs`):

- Gesamtzeichenbegrenzung: `MAX_TOOL_RESULT_CHARS = 200_000`
- base64-Bildblöcke werden direkt entfernt (ein Hinweistext wird angehängt)
- Wenn eine Meldung erkannt wird, dass die Ausgabe in einer Datei gespeichert wurde, werden Schlüsselinformationen extrahiert und mit `[tool_result omitted ...]` platziert
- Wenn ein Browser-Snapshot erkannt wird (mit `page snapshot` / `ref=` etc. Merkmalen), wird er zu Kopf- und Endzusammenfassung geändert, mit Angabe, wie viele Zeichen weggelassen wurden
- Wenn die Eingabe wie HTML aussieht, werden zuerst `<style>`/`<script>`/base64-Segmente entfernt, dann abgeschnitten

## Folgen Sie mir

### Schritt 1: Komprimierungsschwellenwerte bestätigen (und Standardwerte)

**Warum**
Die Komprimierungsauslöser sind nicht fest codiert, sondern kommen aus `proxy.experimental.*`. Sie müssen zuerst die aktuellen Schwellenwerte kennen, um zu verstehen, warum es so früh/spät eingreift.

Standardwerte (Rust-Seite `ExperimentalConfig::default()`):

```json
{
  "proxy": {
    "experimental": {
      "enable_signature_cache": true,
      "enable_tool_loop_recovery": true,
      "enable_cross_model_checks": true,
      "enable_usage_scaling": true,
      "context_compression_threshold_l1": 0.4,
      "context_compression_threshold_l2": 0.55,
      "context_compression_threshold_l3": 0.7
    }
  }
}
```

**Was Sie sehen sollten**: In Ihrer Konfiguration ist `proxy.experimental` vorhanden (Feldnamen wie oben), und die Schwellenwerte sind Verhältniswerte wie `0.x`.

::: warning Konfigurationsdateipositionen werden in diesem Lernprogramm nicht wiederholt
Die Speicherorte von Konfigurationsdateien und ob ein Neustart nach Änderungen erforderlich ist, gehören zur Konfigurationsverwaltung. Nach diesem Lernprogrammsystem hat Priorität: Konfiguration komplett: AppConfig/ProxyConfig, Speicherorte und Hot-Update-Semantik.
:::

### Schritt 2: Mit Protokollen bestätigen, ob Layer 1/2/3 ausgelöst wurde

**Warum**
Diese drei Ebenen sind interne Proxy-Verhaltensweisen. Die zuverlässigste Validierungsmethode ist zu prüfen, ob `[Layer-1]` / `[Layer-2]` / `[Layer-3]` in den Protokollen erscheinen.

Der Testplan im Repository gibt einen Beispielbefehl an (passen Sie ihn bei Bedarf an den tatsächlichen Protokollpfad auf Ihrem Computer an):

```bash
tail -f ~/Library/Application\ Support/com.antigravity.tools/logs/antigravity.log | grep -E "Layer-[123]"
```

**Was Sie sehen sollten**: Wenn der Druck steigt, erscheinen im Protokoll Einträge wie `Tool trimming triggered`, `Thinking compression triggered`, `Fork successful` (konkrete Felder nach Originalprotokolltext).

### Schritt 3: Den Unterschied zwischen Bereinigung und Komprimierung verstehen (Erwartungen nicht vermischen)

**Warum**
Einige Probleme (z.B. erzwungene Downgrade auf Modelle ohne Thinking-Unterstützung) erfordern Bereinigung statt Komprimierung. Bereinigung löscht Thinking-Blöcke direkt; Komprimierung behält die Signaturkette bei.

Im Claude-Prozessor geht die Hintergrund-Task-Downgrade über `ContextManager::purify_history(..., PurificationStrategy::Aggressive)`, das historische Thinking-Blöcke direkt entfernt.

**Was Sie sehen sollten**: Sie können zwei Arten von Verhalten unterscheiden:

- Bereinigung löscht Thinking-Blöcke
- Layer 2-Komprimierung ersetzt alten Thinking-Text durch `"..."`, aber die Signatur bleibt

### Schritt 4: Wenn Sie auf 400-Signaturfehler stoßen, prüfen Sie zuerst, ob Session Cache trifft

**Warum**
Viele 400-Fehler haben ihre Wurzel nicht darin, dass keine Signatur vorhanden ist, sondern dass die Signatur nicht mit der Nachricht mitgeht. Bei der Anforderungskonvertierung werden Signaturen bevorzugt aus Session Cache zurückgefüllt.

Hinweise (Protokolle der Anforderungskonvertierungsphase weisen darauf hin, dass Signaturen aus SESSION/TOOL cache wiederhergestellt wurden):

- `[Claude-Request] Recovered signature from SESSION cache ...`
- `[Claude-Request] Recovered signature from TOOL cache ...`

**Was Sie sehen sollten**: Wenn der Client Signaturen verliert, aber der Proxy-Cache noch vorhanden ist, erscheinen im Protokoll Einträge wie "Recovered signature from ... cache".

### Schritt 5: Verstehen, was bei der Werkzeugergebnis-Komprimierung verloren geht

**Warum**
Wenn Sie Werkzeuge große HTML-/Browser-Snapshots/base64-Bilder in die Konversation einfügen lassen, wird der Proxy aktiv reduzieren. Sie müssen im Voraus wissen, welche Inhalte durch Platzhalter ersetzt werden, um nicht zu glauben, das Modell hätte sie nicht gesehen.

Denken Sie an drei Hauptpunkte:

1. base64-Bilder werden entfernt (durch Hinweistext ersetzt)
2. Browser-Snapshots werden zu Kopf- und Endzusammenfassungen (mit Angabe der weggelassenen Zeichen)
3. Über 200.000 Zeichen werden abgeschnitten und `...[truncated ...]` Hinweis angehängt

**Was Sie sehen sollten**: In `tool_result_compressor.rs` haben diese Regeln klare Konstanten und Verzweigungen, es werden nicht willkürlich abgeschnitten.

## Kontrollpunkte

- Sie können erklären, dass die Auslöser für L1/L2/L3 aus `proxy.experimental.context_compression_threshold_*` stammen, Standard ist `0,4/0,55/0,7`
- Sie können erklären, warum Layer 2 cache bricht: weil es historischen thinking-Textinhalt ändert
- Sie können erklären, warum Layer 3 Fork genannt wird: es verwandelt die Konversation in eine neue Sequenz aus XML-Zusammenfassung + Bestätigung + letzte user-Nachricht
- Sie können erklären, dass die Werkzeugergebnis-Komprimierung base64-Bilder löscht und Browser-Snapshots zu Kopf- und Endzusammenfassungen macht

## Fallstruktur-Hinweise

| Phänomen | Mögliche Ursache | Was Sie tun können |
| --- | --- | --- |
| Nach Auslösung von Layer 2 wirkt der Kontext nicht mehr so stabil | Layer 2 ändert historische Inhalte, Kommentare weisen explizit darauf hin, dass cache gebrochen wird | Wenn Sie auf Prompt Cache-Konsistenz angewiesen sind, lassen Sie L1 das Problem zuerst lösen oder erhöhen Sie L2-Schwellenwert |
| Nach Auslösung von Layer 3 wird direkt 400 zurückgegeben | Fork + Zusammenfassung Hintergrundmodellaufruf fehlgeschlagen (Netzwerk/Konto/Upstream-Fehler etc.) | Folgen Sie zuerst den Vorschlägen im error JSON mit `/compact` oder `/clear`; prüfen Sie gleichzeitig die Hintergrundmodellaufrufkette |
| Bilder/ große Inhalte in Werkzeugausgaben fehlen | tool_result entfernt base64-Bilder, schneidet zu lange Ausgaben ab | Speichern Sie wichtige Inhalte in lokale Dateien/Links und referenzieren Sie sie; zählen Sie nicht darauf, 100.000 Zeilen Text direkt in die Konversation zu geben |
| Sie verwenden Gemini-Modell aber tragen Claude-Signatur, führt zu Fehlern | Signatur ist nicht modellübergreifend kompatibel (Code hat family-Prüfung) | Bestätigen Sie die Signaturquelle; lassen Sie den Proxy bei retry-Szenarien historische Signaturen abspalten (siehe Anforderungskonvertierungslogik) |

## Zusammenfassung dieser Lektion

- Der Kern der dreischichtigen Komprimierung ist Kosteneinstufung: zuerst alte Werkzeugrunden löschen, dann alter Thinking komprimieren, schließlich Fork + XML-Zusammenfassung
- Signatur-Caching ist der Schlüssel, dass die Werkzeugkette nicht abreißt: Session/Tool/Family drei Ebenen sind für je eine Art von Problemen verantwortlich, TTL ist 2 Stunden
- Werkzeugergebnis-Komprimierung ist die harte Begrenzung, die verhindert, dass Werkzeugausgaben den Kontext sprengen: 200.000 Zeichen Obergrenze + Snapshot/ große Datei Hinweis-Spezialisierung

## Vorschau auf die nächste Lektion

> In der nächsten Lektion sprechen wir über Systemfunktionen: Mehrsprachigkeit/Themen/Updates/Autostart/HTTP API Server.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Experimentelle Konfiguration: Komprimierungsschwellenwerte und Standardwerte | `src-tauri/src/proxy/config.rs` | 119-168 |
| Kontextabschätzung: Mehrsprachige Zeichenabschätzung + 15% Puffer | `src-tauri/src/proxy/mappers/context_manager.rs` | 9-37 |
| Token-Verbrauchsabschätzung: Durchlaufen system/messages/tools/thinking | `src-tauri/src/proxy/mappers/context_manager.rs` | 103-198 |
| Layer 1: Werkzeugrunden identifizieren + alte Runden beschneiden | `src-tauri/src/proxy/mappers/context_manager.rs` | 311-439 |
| Layer 2: Thinking-Komprimierung unter Beibehaltung der Signatur (letzte N schützen) | `src-tauri/src/proxy/mappers/context_manager.rs` | 200-271 |
| Layer 3 Hilfsfunktion: letzte gültige Signatur extrahieren | `src-tauri/src/proxy/mappers/context_manager.rs` | 73-109 |
| Hintergrund-Task-Downgrade: Aggressive Bereinigung von Thinking-Blöcken | `src-tauri/src/proxy/handlers/claude.rs` | 540-583 |
| Dreischichtige Komprimierung Hauptfluss: Abschätzung, Kalibrierung, Auslösung L1/L2/L3 nach Schwellenwert | `src-tauri/src/proxy/handlers/claude.rs` | 379-731 |
| Layer 3: XML-Zusammenfassung + Fork-Sitzung-Implementierung | `src-tauri/src/proxy/handlers/claude.rs` | 1560-1687 |
| Signatur-Caching: TTL/dreischichtige Caching-Struktur (Tool/Family/Session) | `src-tauri/src/proxy/signature_cache.rs` | 5-88 |
| Signatur-Caching: Session-Signatur schreiben/lesen | `src-tauri/src/proxy/signature_cache.rs` | 141-223 |
| SSE-Stream-Parsing: thinking/tool signature in Session/Tool cache zwischenspeichern | `src-tauri/src/proxy/mappers/claude/streaming.rs` | 766-776 |
| SSE-Stream-Parsing: tool_use tool_use_id -> signature zwischenspeichern | `src-tauri/src/proxy/mappers/claude/streaming.rs` | 958-975 |
| Anforderungskonvertierung: tool_use Signatur bevorzugt aus Session/Tool cache zurückfüllen | `src-tauri/src/proxy/mappers/claude/request.rs` | 1045-1142 |
| Anforderungskonvertierung: tool_result löst Werkzeugergebnis-Komprimierung aus | `src-tauri/src/proxy/mappers/claude/request.rs` | 1159-1225 |
| Werkzeugergebnis-Komprimierung: Einstieg `compact_tool_result_text()` | `src-tauri/src/proxy/mappers/tool_result_compressor.rs` | 28-69 |
| Werkzeugergebnis-Komprimierung: Browser-Snapshot Kopf- und Endzusammenfassung | `src-tauri/src/proxy/mappers/tool_result_compressor.rs` | 123-178 |
| Werkzeugergebnis-Komprimierung: base64-Bilder entfernen + Gesamtzeichenbegrenzung | `src-tauri/src/proxy/mappers/tool_result_compressor.rs` | 247-320 |
| Testplan: Dreischichtige Komprimierungsauslösung und Protokollvalidierung | `docs/testing/context_compression_test_plan.md` | 1-116 |

</details>

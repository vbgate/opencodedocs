---
title: "Streaming-Unterbrechung: 0-Token-Fehlerbehebung | Antigravity-Manager"
sidebarTitle: "Selbstheilung oder manuelle Intervention"
subtitle: "Streaming-Unterbrechung/0 Token/Signaturverfall: Selbstheilungsmechanismus und Fehlersuchpfad"
description: "Erfahren Sie, wie Sie Streaming-Unterbrechungen, 0-Token-Fehler und Signaturverfall bei Antigravity Tools beheben können. Bestätigen Sie /v1/messages oder Gemini-Streaming-Aufrufe, verstehen Sie Peek-Vorlesen und Backoff-Wiederholung, und identifizieren Sie schnell die Ursache mit Proxy Monitor und Protokollen, um zu entscheiden, ob eine Kontorotation erforderlich ist."
tags:
  - "faq"
  - "streaming"
  - "troubleshooting"
  - "retry"
prerequisite:
  - "start-getting-started"
  - "start-first-run-data"
  - "advanced-monitoring"
  - "advanced-scheduling"
order: 5
---

# Streaming-Unterbrechung/0 Token/Signaturverfall: Selbstheilungsmechanismus und Fehlersuchpfad

Wenn Sie bei Antigravity Tools Aufrufe an `/v1/messages` (Anthropic-kompatibel) oder die nativen Gemini-Streaming-Schnittstellen tätigen und auf Probleme wie „Streaming-Ausgabe unterbrochen“, „200 OK aber 0 Token“ oder „Invalid `signature`“ stoßen, bietet dieser Kurs einen klaren Fehlersuchpfad von der UI bis zu den Protokollen.

## Was Sie nach diesem Kurs können

- Wissen, dass 0-Token-/Unterbrechungsprobleme vom Proxy meistens zunächst durch „Peek-Vorlesen“ abgefangen werden
- Konto und zugeordnetes Modell für die aktuelle Anfrage aus dem Proxy Monitor bestätigen können (`X-Account-Email` / `X-Mapped-Model`)
- Anhand der Protokolle beurteilen können, ob es sich um „vorzeitiges Abbrechen des Upstream-Streams“, „Backoff-Wiederholung“, „Kontorotation“ oder „Signaturreparatur-Wiederholung“ handelt
- Wissen, welche Situationen Sie warten sollten, bis der Proxy sich selbst heilt, und wann Sie manuell eingreifen müssen

## Ihre aktuelle Herausforderung

Sie sehen vielleicht diese „Symptome“, wissen aber nicht, wo Sie anfangen sollen:

- Die Streaming-Ausgabe bricht mittendrin ab, und der Client wirkt wie „eingefroren“ und macht nicht mehr weiter
- 200 OK, aber `usage.output_tokens=0` oder der Inhalt ist leer
- In 400-Fehlern erscheint `Invalid \`signature\``, `Corrupted thought signature`, `must be \`thinking\`` usw.

Diese Probleme sind meistens keine „Fehler in Ihrer Anfrage“, sondern resultieren aus Streaming-Übertragung, Upstream-Ratenbegrenzung/-schwankungen oder Signaturblöcken in Historiennachrichten, die die Upstream-Validierung auslösen. Antigravity Tools hat im Proxy mehrere Verteidigungslinien eingerichtet – Sie müssen nur einem festen Pfad folgen, um zu prüfen, wo genau es hakt.

## Was ist 0 Token?

**0 Token** bezeichnet meistens eine Anfrage, die am Ende `output_tokens=0` zurückgibt und so aussieht, als ob „kein Inhalt generiert wurde“. In Antigravity Tools ist die häufigere Ursache, dass „die Streaming-Antwort endet oder einen Fehler auslöst, bevor sie tatsächlich ausgibt“, nicht dass das Modell wirklich 0 Token generiert hat. Der Proxy versucht, solche leeren Antworten mit Peek-Vorlesen abzufangen und eine Wiederholung auszulösen.

## Drei Dinge, die der Proxy im Hintergrund tut (erst ein mentales Modell aufbauen)

### 1) Nicht-streaming-Anfragen können automatisch in Streaming-Anfragen umgewandelt werden

Im Pfad `/v1/messages` wandelt der Proxy intern eine „nicht-streaming Client-Anfrage“ in eine Streaming-Anfrage um, um den Upstream aufzurufen, sammelt dann nach Empfang des SSE in JSON und gibt es zurück (der Grund dafür wird in den Protokollen als „better quota“ angegeben).

Quellcodebeleg: `src-tauri/src/proxy/handlers/claude.rs#L665-L913`.

### 2) Peek-Vorlesen: Erst auf „ersten gültigen Datenblock“ warten, dann den Stream an den Client übergeben

Bei der SSE-Ausgabe von `/v1/messages` führt der Proxy zunächst ein `timeout + next()` Vorlesen durch, überspringt Herzschlag-/Kommentarzeilen (beginnend mit `:`), bis der erste „nicht leere, kein Herzschlag“ Datenblock empfangen wird, bevor mit der eigentlichen Weiterleitung begonnen wird. Wenn die Peek-Phase einen Fehler/Timeout/Stream-Ende auslöst, wird direkt in den nächsten Versuch eingetreten (der nächste Versuch löst meistens eine Kontorotation aus).

Quellcodebeleg: `src-tauri/src/proxy/handlers/claude.rs#L812-L926`; Das native Gemini-Streaming hat ein ähnliches Peek: `src-tauri/src/proxy/handlers/gemini.rs#L117-L149`.

### 3) Einheitliche Backoff-Wiederholung + Entscheidung nach Statuscode „ob Konten rotiert werden sollen“

Der Proxy hat für häufige Statuscodes eine klare Backoff-Strategie und definiert, welche Statuscodes eine Kontorotation auslösen.

Quellcodebeleg: `src-tauri/src/proxy/handlers/claude.rs#L117-L236`.

## 🎒 Vorbereitungen vor dem Start

- Sie können den Proxy Monitor öffnen (siehe [Proxy Monitor: Anfrageprotokolle, Filterung, Detailrekonstruktion und Export](../../advanced/monitoring/))
- Sie wissen, dass die Protokolle im Datenverzeichnis unter `logs/` liegen (siehe [Wichtig für den ersten Start: Datenverzeichnis, Protokolle, Taskleiste und Autostart](../../start/first-run-data/))

## Folgen Sie mir

### Schritt 1: Bestätigen Sie, welchen Schnittstellenpfad Sie aufrufen

**Warum**
Die Selbstheilungsdetails von `/v1/messages` (claude handler) und nativen Gemini (gemini handler) sind unterschiedlich. Bestätigen Sie zuerst den Pfad, um Zeit auf falschen Protokoll-Schlüsselwörtern zu vermeiden.

Öffnen Sie den Proxy Monitor, finden Sie die fehlgeschlagene Anfrage und notieren Sie zuerst den Pfad:

- `/v1/messages`: Schauen Sie die Logik in `src-tauri/src/proxy/handlers/claude.rs` an
- `/v1beta/models/...:streamGenerateContent`: Schauen Sie die Logik in `src-tauri/src/proxy/handlers/gemini.rs` an

**Was Sie sehen sollten**: In den Anfragedatensätzen können Sie URL/Methode/Statuscode (sowie Anfragezeit) sehen.

### Schritt 2: Erfassen Sie aus dem Antwortheader „Konto + zugeordnetes Modell“

**Warum**
Ob die gleiche Anfrage fehlschlägt oder erfolgreich ist, hängt oft davon ab, „welches Konto diesmal ausgewählt wurde“ und „zu welchem Upstream-Modell geroutet wurde“. Der Proxy schreibt diese beiden Informationen in die Antwortheader – notieren Sie sie zuerst, damit Sie die Protokolle später zuordnen können.

Suchen Sie in der fehlgeschlagenen Anfrage nach diesen Antwortheadern:

- `X-Account-Email`
- `X-Mapped-Model`

Diese beiden Werte werden sowohl im `/v1/messages` als auch im Gemini handler gesetzt (z.B. in der SSE-Antwort von `/v1/messages`: `src-tauri/src/proxy/handlers/claude.rs#L887-L896`; Gemini SSE: `src-tauri/src/proxy/handlers/gemini.rs#L235-L245`).

**Was Sie sehen sollten**: `X-Account-Email` ist die E-Mail-Adresse, `X-Mapped-Model` ist der tatsächlich angefragte Modellname.

### Schritt 3: Beurteilen Sie in app.log, ob es bereits „in der Peek-Phase fehlgeschlagen“ ist

**Warum**
Ein Peek-Fehler bedeutet meistens, dass „der Upstream überhaupt nicht begonnen hat, gültige Daten auszugeben“. Für solche Probleme ist die häufigste Behandlungsmethode Wiederholung/Kontorotation – Sie müssen bestätigen, ob der Proxy dies ausgelöst hat.

Lokalisieren Sie zuerst die Protokolldatei (das Protokollverzeichnis stammt aus `logs/` im Datenverzeichnis und schreibt täglich rollend in `app.log*`).

::: code-group

```bash [macOS/Linux]
ls -lt "$HOME/.antigravity_tools/logs" | head
```

```powershell [Windows]
Get-ChildItem -Force (Join-Path $HOME ".antigravity_tools\logs") | Sort-Object LastWriteTime -Descending | Select-Object -First 5
```

:::

Suchen Sie dann im neuesten `app.log*` nach diesen Schlüsselwörtern:

- `/v1/messages` (claude handler): `Stream error during peek` / `Stream ended during peek` / `Timeout waiting for first data` (`src-tauri/src/proxy/handlers/claude.rs#L828-L864`)
- Nativer Gemini-Streaming: `[Gemini] Empty first chunk received, retrying...` / `Stream error during peek` / `Stream ended immediately` (`src-tauri/src/proxy/handlers/gemini.rs#L117-L144`)

**Was Sie sehen sollten**: Wenn eine Peek-Wiederholung ausgelöst wurde, erscheint im Protokoll eine Warnung wie „retrying...“, und anschließend wird der nächste Versuch eingeleitet (der meistens eine Kontorotation mit sich bringt).

### Schritt 4: Bei 400/Invalid `signature` bestätigen, ob der Proxy eine „Signaturreparatur-Wiederholung“ durchgeführt hat

**Warum**
Signaturfehler stammen oft aus Thinking-Blöcken/Signaturblöcken in Historiennachrichten, die nicht den Upstream-Anforderungen entsprechen. Antigravity Tools versucht, „Historische Thinking-Blöcke herunterstufen + Reparatur-Prompt injizieren“ und erneut zu versuchen – Sie sollten es zuerst selbstheilen lassen.

Sie können an zwei Signalen erkennen, ob es in die Reparaturlogik eingetreten ist:

1. Im Protokoll erscheint `Unexpected thinking signature error ... Retrying with all thinking blocks removed.` (`src-tauri/src/proxy/handlers/claude.rs#L999-L1025`)
2. Anschließend werden historische `Thinking`-Blöcke in `Text` umgewandelt, und am Ende der letzten user-Nachricht wird ein Reparatur-Prompt angehängt (`src-tauri/src/proxy/handlers/claude.rs#L1027-L1102`; Der Gemini handler hängt auch denselben Prompt an `contents[].parts` an: `src-tauri/src/proxy/handlers/gemini.rs#L300-L325`)

**Was Sie sehen sollten**: Der Proxy führt nach kurzer Verzögerung automatisch eine Wiederholung durch (`FixedDelay`) und kann in den nächsten Versuch eintreten.

## Checkpoint ✅

- [ ] Sie können im Proxy Monitor den Anfragepfad bestätigen (`/v1/messages` oder natives Gemini)
- [ ] Sie können `X-Account-Email` und `X-Mapped-Model` der aktuellen Anfrage abrufen
- [ ] Sie können in `logs/app.log*` nach Peek-/Wiederholungs-bezogenen Schlüsselwörtern suchen
- [ ] Bei 400-Signaturfehlern können Sie bestätigen, ob der Proxy in die Reparaturlogik „Reparatur-Prompt + Bereinigen von Thinking-Blöcken“ eingetreten ist

## Häufige Fehler vermeiden

| Szenario | Was Sie vielleicht tun (❌) | Empfohlene Vorgehensweise (✓) |
|---------|----------------------------|----------------------------|
| Bei 0 Token sofort viele manuelle Wiederholungen durchführen | Immer den Wiederholungsbutton im Client drücken, ohne überhaupt die Protokolle anzusehen | Erst einmal den Proxy Monitor + app.log prüfen und bestätigen, ob es ein vorzeitiges Abbrechen in der Peek-Phase ist (wird automatisch wiederholt/rotiert) |
| Bei `Invalid \`signature\}` das Datenverzeichnis sofort leeren | `.antigravity_tools` komplett löschen, Konten/Statistiken sind weg | Zuerst den Proxy einmal eine „Signaturreparatur-Wiederholung“ ausführen lassen; Nur wenn das Protokoll explizit angibt, dass es nicht wiederherstellbar ist, manuell eingreifen |
| „Server-Schwankungen“ als „Konto kaputt“ betrachten | Bei 400/503/529 immer Konten rotieren | Ob Rotation wirksam ist, hängt vom Statuscode ab; Der Proxy selbst hat `should_rotate_account(...)` Regeln (`src-tauri/src/proxy/handlers/claude.rs#L226-L236`) |

## Zusammenfassung dieser Lektion

- 0 Token/Streaming-Unterbrechung werden im Proxy meistens zuerst durch Peek-Vorlesen abgefangen; Ein Peek-Phasenfehler löst eine Wiederholung aus und tritt in den nächsten Versuch ein
- `/v1/messages` kann intern nicht-streaming-Anfragen in Streaming umwandeln und dann wieder zu JSON sammeln, was Ihr Verständnis davon beeinflusst, „warum es wie ein Streaming-Problem aussieht“
- Bei Signaturverfall-400-Fehlern versucht der Proxy, „Reparatur-Prompt + Bereinigen von Thinking-Blöcken“ und erneut zu versuchen – Sie sollten zuerst prüfen, ob dieser Selbstheilungspfad funktioniert

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Endpoint-Schnellreferenz](../../appendix/endpoints/)**.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
|---------|-----------|--------------|
| Claude handler: Backoff-Wiederholungsstrategie + Rotationsregeln | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L117-L236) | 117-236 |
| Claude handler: Interne Umwandlung von nicht-streaming zu streaming (better quota) | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L665-L776) | 665-776 |
| Claude handler: Peek-Vorlesen (Herzschlag/Kommentare überspringen, leere Streams vermeiden) | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L812-L926) | 812-926 |
| Claude handler: Reparaturwiederholung bei 400 Signatur-/Blockreihenfolge-Fehlern | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L999-L1102) | 999-1102 |
| Gemini handler: Peek-Vorlesen (verhindert leere Streams 200 OK) | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L117-L149) | 117-149 |
| Gemini handler: Reparatur-Prompt-Injektion bei 400 Signaturfehlern | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L300-L325) | 300-325 |
| Signatur-Cache (drei Ebenen: tool/family/session, mit TTL/Mindestlänge) | [`src-tauri/src/proxy/signature_cache.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/signature_cache.rs#L5-L207) | 5-207 |
| Claude SSE-Konvertierung: Signatur erfassen und in Signatur-Cache schreiben | [`src-tauri/src/proxy/mappers/claude/streaming.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/claude/streaming.rs#L639-L787) | 639-787 |

**Wichtige Konstanten**:
- `MAX_RETRY_ATTEMPTS = 3`: Maximale Anzahl Wiederholungsversuche (`src-tauri/src/proxy/handlers/claude.rs#L27`)
- `SIGNATURE_TTL = 2 * 60 * 60` Sekunden: Signatur-Cache TTL (`src-tauri/src/proxy/signature_cache.rs#L6`)
- `MIN_SIGNATURE_LENGTH = 50`: Mindestlänge der Signatur (`src-tauri/src/proxy/signature_cache.rs#L7`)

**Wichtige Funktionen**:
- `determine_retry_strategy(...)`: Backoff-Strategie nach Statuscode auswählen (`src-tauri/src/proxy/handlers/claude.rs#L117-L167`)
- `should_rotate_account(...)`: Entscheiden nach Statuscode, ob Konten rotiert werden sollen (`src-tauri/src/proxy/handlers/claude.rs#L226-L236`)
- `SignatureCache::cache_session_signature(...)`: Sitzungssignatur cachen (`src-tauri/src/proxy/signature_cache.rs#L149-L188`)

</details>

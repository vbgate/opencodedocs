---
title: "Modell-Routing: Benutzerdefinierte Zuordnung | Antigravity-Manager"
sidebarTitle: "Benutzerdefiniertes Modell-Routing"
subtitle: "Modell-Routing: Benutzerdefinierte Zuordnung, Platzhalter-Priorität und voreingestellte Strategien"
description: "Lernen Sie die Modell-Routing-Konfiguration von Antigravity Tools. Implementieren Sie Modellnamen-Mappings mit custom_mapping, verstehen Sie die Regeln für exakte und Platzhalter-Übereinstimmung, verwenden Sie Voreinstellungen für OpenAI/Claude-Kompatibilität und verifizieren Sie das Routing über X-Mapped-Model."
tags:
  - "Modell-Routing"
  - "custom_mapping"
  - "Platzhalter"
  - "OpenAI-Kompatibilität"
  - "Claude-Kompatibilität"
prerequisite:
  - "start-proxy-and-first-client"
  - "platforms-openai"
order: 4
---
# Modell-Routing: Benutzerdefinierte Zuordnung, Platzhalter-Priorität und voreingestellte Strategien

Das `model`, das Sie im Client angeben, entspricht nicht unbedingt dem "physischen Modell", das Antigravity Tools bei der Anfrage an den Upstream verwendet. **Modell-Routing** erfüllt eine einfache Aufgabe: Es wandelt "nach außen stabilen Modellnamen" in "das tatsächlich zu verwendende physische Modell" um und schreibt das Ergebnis in den Antwort-Header `X-Mapped-Model`, damit Sie überprüfen können, ob der erwartete Pfad gewählt wurde.

## Nach diesem Kurs können Sie

- `proxy.custom_mapping` in der UI konfigurieren (exakte Zuordnung + Platzhalter-Zuordnung)
- Erklären, wie eine Regel genau getroffen wird (exakt > Platzhalter > Standardzuordnung)
- Voreingestellte Regeln mit einem Klick anwenden, um schnell OpenAI/Claude-Clients kompatibel zu machen
- Mit `curl -i` `X-Mapped-Model` verifizieren und den Fehler "Warum wurde nicht wie erwartet geroutet?" diagnostizieren

## Ihre aktuelle Herausforderung

- Sie möchten, dass der Client immer `gpt-4o` verwendet, aber der Upstream soll stabil auf ein bestimmtes Gemini-Modell zugreifen
- Sie haben eine Reihe von versionierten Modellnamen (z. B. `gpt-4-xxxx`), und möchten nicht jedes Mal manuell Zuordnungen hinzufügen
- Die Anfrage ist erfolgreich, aber Sie sind nicht sicher, welches physische Modell tatsächlich ausgeführt wurde

## Wann sollten Sie diese Methode anwenden

- Sie möchten Ihrem Team eine "feste externe Modellsammlung" bereitstellen und Upstream-Modelländerungen abstrahieren
- Sie möchten mehrere OpenAI/Claude-Modellnamen einheitlich zu wenigen kosteneffizienten Modellen routen
- Sie benötigen bei der Fehlersuche bei 401/429/0 Token die Bestätigung des tatsächlich zugeordneten Modells

## 🎒 Vorbereitung vor dem Start

- Sie können einen lokalen Reverse-Proxy starten und ihn extern anfordern (empfohlen: [Lokalen Reverse-Proxy starten und ersten Client integrieren (/healthz + SDK-Konfiguration)](/de/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/) vorab abgeschlossen)
- Sie wissen, wie Sie mit `curl -i` Antwort-Header anzeigen (im vorherigen Kurs wurde `X-Mapped-Model` verwendet)

::: info Zwei Schlüsselbegriffe in diesem Kurs
- **`custom_mapping`**: Ihre "Benutzerdefinierte Regeltabelle", wobei der Schlüssel der vom Client übergebene Modellname (oder Platzhalter-Pattern) ist und der Wert der zu verwendende Modellname ist (Quelle: `src/types/config.ts`).
- **Platzhalter `*`**: Wird für die Massenübereinstimmung von Modellnamen verwendet (z. B. `gpt-4*`), die Übereinstimmungsimplementierung ist **groß-/kleinschreibungsempfindlich** (Quelle: `src-tauri/src/proxy/common/model_mapping.rs`).
:::

## Kernkonzept

Beim Verarbeiten von Anfragen berechnet das Backend zunächst ein `mapped_model`:

1. Zuerst wird geprüft, ob `custom_mapping` **exakt getroffen** ist (key ist exakt gleich `model`)
2. Dann wird versucht, eine Platzhalter-Übereinstimmung zu finden: Die Regel mit "mehr **nicht `*`-Zeichen**" wird ausgewählt (spezifischere Regel hat Priorität)
3. Wenn keine Übereinstimmung gefunden wurde, wird die Standard-Systemzuordnung verwendet (z. B. Zuordnung von OpenAI/Claude-Modellaliasen zu internen Modellen)

Das `mapped_model` wird in den Antwort-Header `X-Mapped-Model` geschrieben (mindestens der OpenAI-Handler macht dies), damit Sie überprüfen können, "welches Modell aus meinem `model` letztendlich wurde".

::: tip Semantik der Hot-Updates (ohne Neustart)
Wenn der Reverse-Proxy-Dienst läuft, ruft das Frontend `update_model_mapping` auf, sodass das Backend sofort `custom_mapping` in den speicherresidenten `RwLock` schreibt und die Änderungen auch in der persistenten Konfiguration speichert (Quelle: `src-tauri/src/commands/proxy.rs`; `src-tauri/src/proxy/server.rs`).
:::

## Folgen Sie mir

### Schritt 1: Modell-Routing-Karte auf der API Proxy-Seite finden

**Warum**
Der Konfigurationseinstiegspunkt für Modell-Routing liegt in der UI; Sie müssen Konfigurationsdateien nicht manuell bearbeiten.

Öffnen Sie Antigravity Tools -> `API Proxy`-Seite und scrollen Sie nach unten.

**Was Sie sehen sollten**: Eine Karte mit einem Titel wie "Modell-Routing-Zentrum" mit zwei Schaltflächen oben rechts: "Voreingestellte Zuordnung anwenden" und "Zuordnung zurücksetzen" (Quelle: `src/pages/ApiProxy.tsx`).

### Schritt 2: "Exakte Zuordnung" hinzufügen (am besten kontrollierbar)

**Warum**
Exakte Zuordnung hat die höchste Priorität und eignet sich für "Ich möchte genau diesen Modellnamen auf genau dieses physische Modell abbilden".

Im Bereich "Zuordnung hinzufügen":

- Original: Geben Sie den Modellnamen ein, den Sie nach außen freigeben möchten, z. B. `gpt-4o`
- Target: Wählen Sie ein Zielmodell aus der Dropdown-Liste, z. B. `gemini-3-flash`

Klicken Sie auf Add.

**Was Sie sehen sollten**: In der Zuordnungsliste erscheint `gpt-4o -> gemini-3-flash` mit einer Erfolgsbenachrichtigung.

### Schritt 3: "Platzhalter-Zuordnung" hinzufügen (Massenabdeckung)

**Warum**
Wenn Sie viele versionierte Modellnamen haben (z. B. `gpt-4-turbo`, `gpt-4-1106-preview`), sparen Sie mit Platzhaltern viele wiederholte Konfigurationen.

Fügen Sie eine weitere Zuordnung hinzu:

- Original: `gpt-4*`
- Target: `gemini-3-pro-high`

**Was Sie sehen sollten**: In der Liste erscheint `gpt-4* -> gemini-3-pro-high`.

::: warning Die "Position" der Regelpriorität
Wenn `gpt-4o` sowohl die exakte Regel `gpt-4o` als auch die Platzhalterregel `gpt-4*` erfüllt, wählt das Backend zuerst die exakte Übereinstimmung (Quelle: `src-tauri/src/proxy/common/model_mapping.rs`).
:::

### Schritt 4: Voreingestellte Regeln mit einem Klick anwenden (schnelle Kompatibilität)

**Warum**
Wenn Ihr Hauptzweck "schnelle Anpassung an häufige OpenAI/Claude-Modellnamen" ist, können Voreinstellungen Ihnen helfen, direkt mehrere Platzhalterregeln auszufüllen.

Klicken Sie auf "Voreingestellte Zuordnung anwenden".

**Was Sie sehen sollten**: Der Liste werden mehrere neue Regeln hinzugefügt, einschließlich ähnlicher wie unten (Quelle: `src/pages/ApiProxy.tsx`):

```json
{
  "gpt-4*": "gemini-3-pro-high",
  "gpt-4o*": "gemini-3-flash",
  "gpt-3.5*": "gemini-2.5-flash",
  "o1-*": "gemini-3-pro-high",
  "o3-*": "gemini-3-pro-high",
  "claude-3-5-sonnet-*": "claude-sonnet-4-5",
  "claude-3-opus-*": "claude-opus-4-5-thinking",
  "claude-opus-4-*": "claude-opus-4-5-thinking",
  "claude-haiku-*": "gemini-2.5-flash",
  "claude-3-haiku-*": "gemini-2.5-flash"
}
```
### Schritt 5: Routing mit `X-Mapped-Model` verifizieren

**Warum**
Sie möchten bestätigen, dass die Konfiguration übernommen wurde, und noch wichtiger, dass die Anfrage tatsächlich dieser Regel gefolgt ist. Der einfachste Weg ist, `X-Mapped-Model` zu überprüfen.

::: code-group

```bash [macOS/Linux]
curl -i http://127.0.0.1:8045/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "hi"}]
  }'
```

```powershell [Windows]
$resp = Invoke-WebRequest "http://127.0.0.1:8045/v1/chat/completions" -Method Post -ContentType "application/json" -Body '{
  "model": "gpt-4o",
  "messages": [{"role": "user", "content": "hi"}]
}'
$resp.Headers["X-Mapped-Model"]
```

:::

**Was Sie sehen sollten**: Im Antwort-Header finden Sie `X-Mapped-Model: ...`. Wenn Sie `gpt-4o` in Schritt 2 exakt auf `gemini-3-flash` abgebildet haben, sollten Sie hier den entsprechenden Wert sehen (Antwortheader-Schreiben siehe `src-tauri/src/proxy/handlers/openai.rs`).

### Schritt 6: Zurücksetzen von custom_mapping, wenn Sie zu "reiner Standardzuordnung" zurückkehren müssen

**Warum**
Bei der Fehlersuche möchten Sie oft den Einfluss von "benutzerdefinierten Regeln" ausschließen. Das Löschen von `custom_mapping` ist der direkteste Rückweg.

Klicken Sie auf "Zuordnung zurücksetzen".

**Was Sie sehen sollten**: Die Zuordnungsliste wird geleert; nachfolgende Anfragen, die keine benutzerdefinierten Regeln treffen, werden über die Standard-Systemzuordnung geroutet (Quelle: `src/pages/ApiProxy.tsx`; `src-tauri/src/proxy/common/model_mapping.rs`).

## Kontrollpunkte ✅

- [ ] Sie können im UI `custom_mapping`-Regeln hinzufügen/löschen
- [ ] Sie können erklären, warum exakte Regeln Platzhalterregeln überschreiben
- [ ] Sie können `X-Mapped-Model` mit `curl -i` oder PowerShell lesen

## Häufige Fallstricke

| Szenario | Möglicher Ansatz (❌) | Empfohlene Vorgehensweise (✓) |
|--- | --- | ---|
| Platzhalter funktioniert nicht | `GPT-4*` geschrieben, erwartet Übereinstimmung mit `gpt-4-turbo` | Verwenden Sie Kleinbuchstaben `gpt-4*`; die Backend-Platzhalter-Übereinstimmung ist groß-/kleinschreibungsempfindlich |
|--- | --- | ---|
| Regel sieht korrekt aus, aber keine Änderung | Nur Antwort-Body geprüft, nicht Antwort-Header | Verwenden Sie `curl -i`, um `X-Mapped-Model` zu bestätigen (dies ist das explizit vom Backend zurückgegebene Ergebnis) |
| Beide Regeln "gleich spezifisch" | Zwei Platzhalterregeln mit gleicher Anzahl nicht `*`-Zeichen | Vermeiden Sie diese Konfiguration; der Quellcode-Kommentar gibt an, dass das Ergebnis in diesem Fall von der `HashMap`-Traversierungsreihenfolge abhängt, was instabil sein kann (Quelle: `src-tauri/src/proxy/common/model_mapping.rs`) |

## Zusammenfassung dieses Kapitels

- `proxy.custom_mapping` ist der Hauptzugangspunkt für die Steuerung von "externer Modellname → physisches Modell"
- Die Backend-Routing-Priorität lautet: exakte Übereinstimmung > Platzhalter-Übereinstimmung (spezifischere geht vor) > Standard-Systemzuordnung
- `X-Mapped-Model` ist das zuverlässigste Verifizierungsmittel, bei der Fehlersuche hat es Priorität

## Vorschau auf das nächste Kapitel

> Das nächste Kapitel befasst sich weiter mit **Quota-Governance: Die Kombination von Quota Protection + Smart Warmup** (entsprechender Abschnitt: `advanced-quota`).

---

## Anhang: Quellcode-Referenzen

<details>
<summary><strong>Klicken, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisierungsdatum: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
|--- | --- | ---|
| UI: Schreiben/Zurücksetzen/Voreinstellungen (Aufruf von `update_model_mapping`) | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L371-L475) | 371-475 |
|--- | --- | ---|
|--- | --- | ---|
| Serverstatus: `custom_mapping` wird mit `RwLock<HashMap<..>>` gespeichert | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L16-L53) | 16-53 |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|

**Wichtige Funktionen**:
- `resolve_model_route(original_model, custom_mapping)`: Hauptzugangspunkt für Modell-Routing (siehe `src-tauri/src/proxy/common/model_mapping.rs`)

</details>

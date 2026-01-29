---
title: "Sicherheit: Datenschutz- und Authentifizierungskonfiguration | Antigravity-Manager"
sidebarTitle: "Ihr lokales Netzwerk nicht schutzlos lassen"
subtitle: "Sicherheit und Datenschutz: auth_mode, allow_lan_access und das Design 'Keine Kontoinformationen泄露'"
description: "Lernen Sie die Sicherheitskonfigurationsmethoden von Antigravity Tools kennen. Beherrschen Sie die 4 Modi von auth_mode, die Adressunterschiede von allow_lan_access, die api_key-Konfiguration und die /healthz-Validierung, um das Leakage von Kontoinformationen zu vermeiden."
tags:
  - "security"
  - "privacy"
  - "auth_mode"
  - "allow_lan_access"
  - "api_key"
prerequisite:
  - "start-getting-started"
  - "start-proxy-and-first-client"
duration: 16
order: 2
---

# Sicherheit und Datenschutz: auth_mode, allow_lan_access und das Design "Keine Kontoinformationen泄露"

Wenn Sie Antigravity Tools als "lokale AI-Gateway" verwenden, drehen sich Sicherheitsfragen meist um zwei Dinge: Wem Sie den Service offenlegen (nur lokaler Computer oder das gesamte lokale Netzwerk/öffentliches Netz) und ob externe Anfragen einen API Key mitbringen müssen. Diese Lektion erklärt die Regeln im Quellcode klar und gibt Ihnen einen minimalen Sicherheitsstandard, den Sie direkt befolgen können.

## Was Sie nach Abschluss können

- Die richtige `allow_lan_access` auswählen: Wissen, dass sie die Bindungsadresse beeinflusst (`127.0.0.1` vs `0.0.0.0`)
- Den richtigen `auth_mode` auswählen: Das tatsächliche Verhalten von `off/strict/all_except_health/auto` verstehen
- `api_key` konfigurieren und validieren: Mit `curl` sofort erkennen, ob tatsächlich eine Authentifizierung aktiviert ist
- Die Grenzen des Datenschutzes kennen: Lokale Proxy-Keys werden nicht an Upstream weitergeleitet; Fehlermeldungen an API-Clients vermeiden das Leakage von Konto-E-Mails

## Ihr aktuelles Dilemma

- Sie möchten von einem Handy/anderem Computer aus zugreifen, haben aber Angst, dass das Öffnen des lokalen Netzwerkzugriffs zu einer "schutzlosen Situation" führt
- Sie möchten die Authentifizierung aktivieren, sind aber unsicher, ob `/healthz` ausgenommen werden sollte, weil Sie befürchten, dass auch die Gesundheitsprüfung abbricht
- Sie sorgen sich, dass lokale Keys, Cookies oder Konto-E-Mails an externe Clients oder Upstream-Plattformen geleakt werden

## Wann Sie diese Taktik einsetzen

- Sie sind bereit, `allow_lan_access` zu öffnen (NAS, Heimnetzwerk, Team-Intranet)
- Sie möchten den lokalen Service über cloudflared/Reverse Proxy öffentlich machen (zuerst **[Cloudflared One-Click-Tunnel](/de/lbjlaq/Antigravity-Manager/platforms/cloudflared/)** ansehen)
- Sie stoßen auf `401` und müssen bestätigen, ob es "kein Key" oder "Modus nicht ausgerichtet" ist

## 🎒 Vorbereitungen vor dem Start

::: warning Voraussetzungen
- Sie können den API Proxy bereits in der GUI starten (wenn es noch nicht funktioniert, zuerst **[Lokalen Reverse-Proxy starten und ersten Client einbinden](/de/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)** ansehen).
- Sie kennen das Problem, das Sie lösen möchten: Nur lokaler Zugriff oder lokales Netzwerk/öffentliches Netz.
:::

::: info Die drei Felder, die in dieser Lektion immer wieder auftauchen werden
- `allow_lan_access`: Ob lokaler Netzwerkzugriff erlaubt ist.
- `auth_mode`: Authentifizierungsstrategie (entscheidet, welche Routen einen Key benötigen).
- `api_key`: API Key des lokalen Proxies (wird nur für die lokale Proxy-Authentifizierung verwendet, nicht an Upstream weitergeleitet).
:::

## Was ist auth_mode?

**auth_mode** ist der "Proxy-Authentifizierungsschalter + Ausnahmestrategie" von Antigravity Tools. Es entscheidet, welche Anfragen einen `proxy.api_key` mitbringen müssen, wenn externe Clients auf lokale Proxy-Endpunkte zugreifen, und ob Gesundheitsprüfrouten wie `/healthz` ohne Authentifizierung zugelassen werden.

## Kernkonzept

1. Bestimmen Sie zuerst die "Exposure Surface": Wenn `allow_lan_access=false`, wird nur `127.0.0.1` abgehört; wenn `true`, wird `0.0.0.0` abgehört.
2. Bestimmen Sie dann den "Entrance Key": `auth_mode` entscheidet, ob ein Key erforderlich ist, und ob `/healthz` ausgenommen ist.
3. Abschließen mit "Datenschutz-Endpunktführung": Leiten Sie lokale Proxy-Keys/Cookies nicht an Upstream weiter; Fehlermeldungen nach außen sollten keine Konto-E-Mails enthalten.

## Folgen Sie mir

### Schritt 1: Entscheiden Sie zuerst, ob Sie lokalen Netzwerkzugriff öffnen möchten (allow_lan_access)

**Warum**
Sie sollten lokalen Netzwerkzugriff nur öffnen, wenn Sie "Zugriff von anderen Geräten" benötigen. Andernfalls ist die Standardeinstellung "nur lokaler Zugriff" die einfachste Sicherheitsstrategie.

In `ProxyConfig` wird die Bindungsadresse durch `allow_lan_access` bestimmt:

```rust
pub fn get_bind_address(&self) -> &str {
    if self.allow_lan_access {
        "0.0.0.0"
    } else {
        "127.0.0.1"
    }
}
```

Auf der Seite `API Proxy` in der GUI können Sie den Schalter "Lokalen Netzwerkzugriff zulassen" nach Ihren Anforderungen einstellen.

**Was Sie sehen sollten**
- Wenn ausgeschaltet: Der Hinweistext hat die Bedeutung "Nur lokaler Zugriff" (der genaue Wortlaut hängt vom Sprachpaket ab)
- Wenn eingeschaltet: Die Benutzeroberfläche zeigt eine deutliche Warnmeldung (Erinnerung, dass dies eine "Erweiterung der Exposition Surface" ist)

### Schritt 2: Wählen Sie einen auth_mode (empfohlen: zuerst auto)

**Warum**
`auth_mode` ist nicht nur "Authentifizierung an/aus", es entscheidet auch, ob Gesundheitsprüfungsendpunkte wie `/healthz` ausgenommen sind.

Das Projekt unterstützt 4 Modi (aus `docs/proxy/auth.md`):

- `off`: Alle Routen benötigen keine Authentifizierung
- `strict`: Alle Routen benötigen Authentifizierung
- `all_except_health`: Außer `/healthz` benötigen alle Routen Authentifizierung
- `auto`: Automatischer Modus, leitet die tatsächliche Strategie aus `allow_lan_access` ab

Die Ableitungslogik von `auto` in `ProxySecurityConfig::effective_auth_mode()`:

```rust
match self.auth_mode {
    ProxyAuthMode::Auto => {
        if self.allow_lan_access {
            ProxyAuthMode::AllExceptHealth
        } else {
            ProxyAuthMode::Off
        }
    }
    ref other => other.clone(),
}
```

**Empfohlene Vorgehensweise**
- Nur lokaler Zugriff: `allow_lan_access=false` + `auth_mode=auto` (schließlich gleichbedeutend mit `off`)
- Lokaler Netzwerkzugriff: `allow_lan_access=true` + `auth_mode=auto` (schließlich gleichbedeutend mit `all_except_health`)

**Was Sie sehen sollten**
- Auf der Seite `API Proxy` gibt es im Dropdown-Menü "Auth Mode" vier Optionen: `off/strict/all_except_health/auto`

### Schritt 3: Bestätigen Sie Ihren api_key (bei Bedarf neu generieren)

**Warum**
Wenn Ihr Proxy externen Zugriff benötigt (lokales Netzwerk/öffentliches Netz), sollte `api_key` wie ein Passwort verwaltet werden.

Standardmäßig generiert `ProxyConfig::default()` einen Key im Format `sk-...`:

```rust
api_key: format!("sk-{}", uuid::Uuid::new_v4().simple()),
```

Auf der Seite `API Proxy` können Sie den aktuellen `api_key` bearbeiten, neu generieren und kopieren.

**Was Sie sehen sollten**
- Auf der Seite gibt es ein `api_key`-Eingabefeld sowie Bearbeiten/Neu generieren/Kopieren-Buttons

### Schritt 4: Verwenden Sie /healthz, um zu validieren, ob die "Ausnahmestrategie" wie erwartet funktioniert

**Warum**
`/healthz` ist der kürzeste Zyklus: Sie können bestätigen, dass "Service erreichbar + Authentifizierungsstrategie korrekt" ist, ohne tatsächlich das Modell aufzurufen.

Ersetzen Sie `<PORT>` durch Ihren eigenen Port (Standard `8045`):

::: code-group

```bash [macOS/Linux]
curl -sS "http://127.0.0.1:<PORT>/healthz"
```

```powershell [Windows]
curl.exe -sS "http://127.0.0.1:<PORT>/healthz"
```

:::

**Was Sie sehen sollten**

```json
{"status":"ok"}
```

::: details Wenn Sie auth_mode auf strict einstellen
`strict` nimmt `/healthz` nicht aus. Sie müssen den Key mitbringen:

```bash
curl -sS "http://127.0.0.1:<PORT>/healthz" \
  -H "Authorization: Bearer <API_KEY>"
```
:::

### Schritt 5: Verwenden Sie einen "nicht-health Endpunkt", um 401 zu validieren (und dass es nach Hinzufügen des Key nicht mehr 401 ist)

**Warum**
Sie müssen bestätigen, dass die Authentifizierungsmiddleware tatsächlich funktioniert und nicht nur im UI ein Modus ausgewählt wurde, der aber in der Praxis keine Wirkung zeigt.

Der folgende Anfragetext ist absichtlich unvollständig – sein Zweck ist nicht "erfolgreicher Aufruf", sondern zu validieren, ob er durch die Authentifizierung abgefangen wird:

```bash
#Ohne Key: Wenn auth_mode != off, sollte direkt 401
curl -i "http://127.0.0.1:<PORT>/v1/messages" \
  -H "Content-Type: application/json" \
  -d "{}"

#Mit Key: Sollte nicht mehr 401 sein (kann 400/422 zurückgeben, weil der Anfragetext unvollständig ist)
curl -i "http://127.0.0.1:<PORT>/v1/messages" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <API_KEY>" \
  -d "{}"
```

**Was Sie sehen sollten**
- Ohne Key: `HTTP/1.1 401 Unauthorized`
- Mit Key: Der Statuscode ist nicht mehr 401

## Kontrollpunkte ✅

- Sie können Ihre aktuelle Exposition Surface klar benennen: Nur lokaler Computer (`127.0.0.1`) oder lokales Netzwerk (`0.0.0.0`)
- Wenn `auth_mode=auto`, können Sie den tatsächlich wirksamen Modus vorhersagen (LAN -> `all_except_health`, lokaler Computer -> `off`)
- Sie können mit 2 `curl`-Befehlen "401 ohne Key" reproduzieren

## Fallstruktur-Hinweise

::: warning Falsche Vorgehensweise vs. Empfohlene Vorgehensweise

| Szenario | ❌ Häufiger Fehler | ✓ Empfohlene Vorgehensweise |
|--- | --- | ---|
| Lokaler Netzwerkzugriff erforderlich | Nur `allow_lan_access=true` öffnen, aber `auth_mode=off` | Verwenden Sie `auth_mode=auto` und stellen Sie einen starken `api_key` ein |
| Authentifizierung aktiviert aber immer 401 | Client bringt Key mit, aber Header-Name nicht kompatibel | Der Proxy ist kompatibel mit drei Headern: `Authorization`/`x-api-key`/`x-goog-api-key` |
| Authentifizierung aktiviert aber kein Key eingerichtet | `api_key` leer und Authentifizierung aktiviert | Das Backend lehnt direkt ab (das Protokoll weist darauf hin, dass der Key leer ist) |
:::

::: warning Die Ausnahme von /healthz wirkt nur bei all_except_health
Die Middleware lässt durch, wenn der "effektive Modus" `all_except_health` ist und der Pfad `/healthz` ist; betrachten Sie es als "Gesundheitsprüfungsport" und verwenden Sie es nicht als Geschäfts-API.
:::

## Datenschutz und das Design "Keine Kontoinformationen泄露"

### 1) Lokale Proxy-Keys werden nicht an Upstream weitergeleitet

Authentifizierung erfolgt nur am lokalen Proxy-Eingang; `docs/proxy/auth.md` macht klar: Proxy-API-Keys werden nicht an Upstream weitergeleitet.

### 2) Bei der Weiterleitung an z.ai werden absichtlich nur wenige Headers durchgelassen

Wenn Anfragen an z.ai (Anthropic-kompatibel) weitergeleitet werden, lässt der Code nur wenige Headers zu, um zu vermeiden, dass lokale Proxy-Keys oder Cookies mitgenommen werden:

```rust
// Only forward a conservative set of headers to avoid leaking the local proxy key or cookies.
```

### 3) Fehlermeldungen bei Token-Refresh-Fehlern vermeiden das Enthalten von Konto-E-Mails

Wenn der Token-Refresh fehlschlägt, zeichnet das Protokoll das konkrete Konto auf, aber die an den API-Client zurückgegebene Fehlermeldung wird so umgeschrieben, dass sie keine E-Mail enthält:

```rust
// Avoid leaking account emails to API clients; details are still in logs.
last_error = Some(format!("Token refresh failed: {}", e));
```

## Zusammenfassung dieser Lektion

- Bestimmen Sie zuerst die Exposition Surface (`allow_lan_access`), dann den Entrance Key (`auth_mode` + `api_key`)
- Die Regel für `auth_mode=auto` ist einfach: LAN mindestens `all_except_health`, nur lokaler Computer `off`
- Die Grundlinie für Datenschutz ist "lokale Keys nicht nach außen mitnehmen, Konto-E-Mails nicht in externen Fehlermeldungen泄露", Details finden Sie in der Middleware und dem Upstream-Weiterleitungscode

## Vorschau auf die nächste Lektion

> In der nächsten Lektion sehen wir uns **[Hochverfügbarkeits-Scheduling: Rotation, feste Konten, Sticky-Sitzungen und Fehler-Wiederholungen](/de/lbjlaq/Antigravity-Manager/advanced/scheduling/)** an, um den "stabilen Ausgang" nach dem "sicheren Eingang" zu vervollständigen.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
| Die vier Modi von auth_mode und die Semantik von auto | [`docs/proxy/auth.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy/auth.md#L10-L24) | 10-24 |
|--- | --- | ---|
|--- | --- | ---|
| Bindungsadressableitung (127.0.0.1 vs 0.0.0.0) | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L281-L292) | 281-292 |
|--- | --- | ---|
|--- | --- | ---|
| UI: allow_lan_access und auth_mode Schalter/Dropdown | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L943-L1046) | 943-1046 |
| UI: api_key Bearbeiten/Zurücksetzen/Kopieren | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L1048-L1120) | 1048-1120 |
|--- | --- | ---|
| disable_account: Schreiben von disabled/disabled_at/disabled_reason und Entfernen aus Speicherpool | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L942-L969) | 942-969 |
|--- | --- | ---|
|--- | --- | ---|

</details>

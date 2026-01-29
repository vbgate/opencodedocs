---
title: "Authentifizierungsfehler: 401 Fehlerbehebung | Antigravity-Manager"
sidebarTitle: "401 in 3 Minuten lösen"
subtitle: "401/Authentifizierungsfehler: Zuerst auth_mode prüfen, dann Header"
description: "Lernen Sie den Authentifizierungsmechanismus des Antigravity-Tools-Proxys, beheben Sie 401-Fehler. Lokalisieren Sie Probleme in der Reihenfolge auth_mode, api_key, Header, verstehen Sie die Auto-Modus-Regeln und /healthz-Ausnahme, vermeiden Sie Fehlurteile zur Header-Priorität."
tags:
  - "FAQ"
  - "Authentifizierung"
  - "401"
  - "API Key"
prerequisite:
  - "start-proxy-and-first-client"
order: 2
---

# 401/Authentifizierungsfehler: Zuerst auth_mode prüfen, dann Header

## Lernziele

- Beurteilen Sie in 3 Minuten, ob 401 durch die Authentifizierungs-Middleware von Antigravity Tools blockiert wurde
- Verstehen Sie die "tatsächlichen effektiven Werte" der vier `proxy.auth_mode`-Modi (insbesondere `auto`) in Ihrer aktuellen Konfiguration
- Lassen Sie Anfragen mit dem korrekten API Key Header (und vermeiden Sie die Header-Prioritätsfalle) passieren

## Ihr aktuelles Problem

Der Client erhält den Fehler `401 Unauthorized` beim Aufruf des lokalen Reverse-Proxys:
- Python/OpenAI SDK: Löst `AuthenticationError` aus
- curl: Gibt `HTTP/1.1 401 Unauthorized` zurück
- HTTP-Client: Antwortstatuscode 401

## Was ist 401/Authentifizierungsfehler?

**401 Unauthorized** bedeutet in Antigravity Tools am häufigsten: Der Proxy hat die Authentifizierung aktiviert (bestimmt durch `proxy.auth_mode`), aber die Anfrage hat keinen korrekten API Key oder enthält einen Header mit höherer Priorität, der nicht übereinstimmt, daher gibt `auth_middleware()` direkt 401 zurück.

::: info Stellen Sie zuerst fest, ob es der "Proxy blockiert"
Die Upstream-Plattform kann ebenfalls 401 zurückgeben, aber dieses FAQ behandelt nur "durch Proxy-Authentifizierung verursachte 401". Sie können zuerst mit dem untenstehenden `/healthz` schnell unterscheiden.
:::

## Schnelle Fehlerbehebung (in dieser Reihenfolge)

### Schritt 1: Bestimmen Sie mit `/healthz`, ob "Authentifizierung Sie blockiert"

**Warum**
`all_except_health` lässt `/healthz` passieren, blockiert aber andere Routen; dies hilft Ihnen, schnell zu lokalisieren, ob 401 von der Proxy-Authentifizierungsschicht stammt.

```bash
 # Ohne Authentifizierungs-Header
curl -i http://127.0.0.1:8045/healthz
```

**Sie sollten sehen**
- Wenn `auth_mode=all_except_health` (oder `auto` und `allow_lan_access=true`): Normalerweise wird `200` zurückgegeben
- Wenn `auth_mode=strict`: Es wird `401` zurückgegeben

::: tip `/healthz` ist in der Routing-Schicht GET
Der Proxy registriert `GET /healthz` in den Routen (siehe `src-tauri/src/proxy/server.rs`).
:::

---

### Schritt 2: Bestätigen Sie den "tatsächlichen effektiven Wert" von `auth_mode` (insbesondere `auto`)

**Warum**
`auto` ist keine "unabhängige Strategie", sie berechnet den tatsächlich auszuführenden Modus basierend auf `allow_lan_access`.

| `proxy.auth_mode` | Zusätzliche Bedingung | Tatsächlicher effektiver Wert |
| --- | --- | --- |
| `off` | - | `off` |
| `strict` | - | `strict` |
| `all_except_health` | - | `all_except_health` |
| `auto` | `allow_lan_access=false` | `off` |
| `auto` | `allow_lan_access=true` | `all_except_health` |

**Sie können dies auf der Seite API Proxy in der GUI prüfen**: `Allow LAN Access` und `Auth Mode`.

---

### Schritt 3: Bestätigen Sie, dass `api_key` nicht leer ist und Sie denselben Wert verwenden

**Warum**
Wenn die Authentifizierung aktiviert ist und `proxy.api_key` leer ist, lehnt `auth_middleware()` alle Anfragen ab und protokolliert den Fehler.

```text
Proxy auth is enabled but api_key is empty; denying request
```

**Sie sollten sehen**
- Auf der Seite API Proxy sehen Sie einen Key, der mit `sk-` beginnt (der Standardwert wird automatisch in `ProxyConfig::default()` generiert)
- Nach dem Klicken auf "Regenerate/Bearbeiten" und Speichern werden externe Anfragen sofort mit dem neuen Key überprüft (kein Neustart erforderlich)

---

### Schritt 4: Testen Sie einmal mit dem einfachsten Header (verwenden Sie zunächst keine komplexen SDKs)

**Warum**
Die Middleware liest zuerst `Authorization`, dann `x-api-key` und schließlich `x-goog-api-key`. Wenn Sie mehrere Header gleichzeitig senden, wird der vorherige verwendet, selbst wenn er falsch ist, und der spätere, selbst wenn er korrekt ist, nicht verwendet.

```bash
 # Empfohlene Schreibweise: Authorization + Bearer
curl -i http://127.0.0.1:8045/v1/models \
  -H "Authorization: Bearer sk-REPLACE_WITH_YOUR_PROXY_API_KEY"
```

**Sie sollten sehen**: `HTTP/1.1 200 OK` (oder zumindest nicht mehr 401)

::: info Proxy-Kompatibilitätsdetails für Authorization
`auth_middleware()` entfernt den Wert von `Authorization` einmal basierend auf dem Präfix `Bearer `; wenn kein `Bearer `-Präfix vorhanden ist, wird der gesamte Wert als Key zum Vergleich verwendet. Die Dokumentation empfiehlt weiterhin `Authorization: Bearer <key>` (entspricht besser der allgemeinen SDK-Konvention).
:::

**Wenn Sie `x-api-key` verwenden müssen**:

```bash
curl -i http://127.0.0.1:8045/v1/models \
  -H "x-api-key: sk-REPLACE_WITH_YOUR_PROXY_API_KEY"
```

---

## Häufige Fallen (alles passiert im Quellcode)

| Phänomen | Wahrer Grund | Wie Sie ändern sollten |
| --- | --- | --- |
| `auth_mode=auto`, aber lokaler Aufruf immer noch 401 | `allow_lan_access=true` führt dazu, dass `auto` zu `all_except_health` wird | Deaktivieren Sie `allow_lan_access` oder lassen Sie den Client den Key mitbringen |
| Sie denken "ich habe x-api-key mitgebracht", aber immer noch 401 | Gleichzeitig einen nicht übereinstimmenden `Authorization` mitgebracht, Middleware verwendet ihn priorisiert | Löschen Sie überflüssige Header, behalten Sie nur einen, von dem Sie sicher sind, dass er korrekt ist |
| `Authorization: Bearer<key>` immer noch 401 | Fehlendes Leerzeichen nach `Bearer`, kann nicht nach dem Präfix `Bearer ` entfernt werden | Ändern Sie in `Authorization: Bearer <key>` |
| Alle Anfragen sind 401, Protokoll zeigt `api_key is empty` | `proxy.api_key` ist leer | Generieren/legen Sie einen nicht-leeren Key in der GUI fest |

## Zusammenfassung dieser Lektion

- Verwenden Sie zuerst `/healthz`, um zu lokalisieren, ob 401 von der Proxy-Authentifizierungsschicht stammt
- Bestätigen Sie dann `auth_mode` (insbesondere den effektiven Modus von `auto`)
- Senden Sie schließlich nur einen Header, von dem Sie sicher sind, dass er korrekt ist, zur Überprüfung (vermeiden Sie die Header-Prioritätsfalle)

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[429/Kapazitätsfehler: Richtige Erwartungen an Kontorotation und Missverständnisse über erschöpfte Modellkapazität](../429-rotation/)**.
>
> Sie werden lernen:
> - Ob 429 "Kontingentmangel" oder "Upstream-Ratenbegrenzung" ist
> - Richtige Erwartungen an Kontorotation (wann automatisch gewechselt wird und wann nicht)
> - Konfigurieren, um die Wahrscheinlichkeit von 429 zu verringern

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion        | Dateipfad                                                                                             | Zeilennummer    |
| ----------- | ---------------------------------------------------------------------------------------------------- | ------- |
| ProxyAuthMode-Enumeration | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L5-L18) | 5-18 |
| ProxyConfig: allow_lan_access/auth_mode/api_key und Standardwerte | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L174-L258) | 174-258 |
| Auto-Modus-Analyse (effective_auth_mode) | [`src-tauri/src/proxy/security.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/security.rs#L1-L30) | 1-30 |
| Authentifizierungs-Middleware (Header-Extraktion und Priorität, /healthz-Ausnahme, OPTIONS-Durchlass) | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L77) | 14-77 |
| /healthz-Routen-Registrierung und Middleware-Reihenfolge | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L170-L193) | 170-193 |
| Authentifizierungsdokumentation (Modi und Client-Konventionen) | [`docs/proxy/auth.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy/auth.md#L1-L45) | 1-45 |

**Wichtige Enumerationen**:
- `ProxyAuthMode::{Off, Strict, AllExceptHealth, Auto}`: Authentifizierungsmodi

**Wichtige Funktionen**:
- `ProxySecurityConfig::effective_auth_mode()`: Wandelt `auto` in eine echte Strategie um
- `auth_middleware()`: Führt Authentifizierung durch (inklusive Header-Extraktionsreihenfolge und /healthz-Ausnahme)

</details>

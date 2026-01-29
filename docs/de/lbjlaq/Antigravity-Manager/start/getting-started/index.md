---
title: "Einführung: Lokaler AI-Gateway | Antigravity Manager"
sidebarTitle: "Was ist ein lokaler AI-Gateway?"
subtitle: "Was Antigravity Tools ist: Ein lokaler AI-Gateway aus 'Konto + Protokoll'"
description: "Verstehen Sie die Kernposition von Antigravity Manager. Es bietet eine Desktop-Anwendung und einen lokalen HTTP-Gateway, unterstützt Multi-Protokoll-Endpunkte und Kontopool-Scheduling, hilft Ihnen beim schnellen Einstieg in lokale Reverse-Proxies und vermeidet häufige Konfigurationsfehler."
tags:
  - "Erste Schritte"
  - "Konzepte"
  - "Lokaler Gateway"
  - "API-Proxy"
prerequisite: []
order: 1
---

# Was Antigravity Tools ist: Ein lokaler AI-Gateway aus "Konto + Protokoll"

Die Eintrittsbarriere für viele AI-Clients/SDKs liegt nicht darin, "wie man die API aufruft", sondern in "welchem Protokoll Sie sich verbinden, wie Sie mehrere Konten verwalten, wie Sie bei Fehlern automatisch wiederherstellen". Antigravity Tools versucht, diese drei Dinge in einen lokalen Gateway zu konvergieren.

## Was sind Antigravity Tools?

**Antigravity Tools** ist eine Desktop-Anwendung: Sie verwalten Konten und Konfigurationen in der GUI, sie startet einen HTTP-Reverse-Proxy-Dienst auf Ihrem lokalen Computer, leitet Anfragen von verschiedenen Herstellern/Protokollen einheitlich an den Upstream weiter und konvertiert die Antworten zurück in ein für den Client vertrautes Format.

## Was Sie nach diesem Kurs können

- Klären, welches Problem Antigravity Tools löst (und welches es nicht löst)
- Seine Kernkomponenten erkennen: GUI, Kontopool, HTTP-Reverse-Proxy-Gateway, Protokoll-Adapter
- Die Standard-Sicherheitsgrenzen verstehen (127.0.0.1, Port, Authentifizierungsmodus) und wann sie geändert werden müssen
- Wissen, welchem Kapitel Sie als Nächstes folgen sollten: Installation, Konto hinzufügen, Reverse-Proxy starten, Client einbinden

## Ihr aktuelles Dilemma

Vielleicht haben Sie diese Probleme erlebt:

- Ein Client muss drei Protokolle unterstützen (OpenAI/Anthropic/Gemini), die Konfiguration ist oft chaotisch
- Sie haben mehrere Konten, aber das Umschalten, Rotieren und Retry bei Ratenbegrenzung erfolgt manuell
- Wenn Anfragen fehlschlagen, können Sie nur das Protokoll überwachen und raten, ob es "Konto abgelaufen" oder "Upstream-Ratenbegrenzung/Kapazität erschöpft" ist

Das Ziel von Antigravity Tools ist es, diese "Nebenarbeiten" in einen lokalen Gateway zu integrieren, damit Ihr Client/SDK sich hauptsächlich um eine Sache kümmert: Senden Sie die Anfrage an das lokale System.

## Kernkonzept

Sie können es als einen lokalen "AI-Scheduling-Gateway" verstehen, bestehend aus drei Schichten:

1) GUI (Desktop-Anwendung)
- Verantwortlich für die Verwaltung von Konten, Konfigurationen, Überwachung und Statistiken.
- Hauptseite umfasst: Dashboard, Konten, API-Proxy, Überwachung, Token-Statistiken, Einstellungen.

2) HTTP-Reverse-Proxy-Dienst (Axum Server)
- Verantwortlich für die Bereitstellung mehrerer Protokoll-Endpunkte nach außen und die Weiterleitung von Anfragen an den entsprechenden Handler.
- Der Reverse-Proxy-Dienst wird Authentifizierung, Middleware-Überwachung, CORS, Trace und andere Schichten bereitstellen.

3) Kontopool und Scheduling (TokenManager usw.)
- Verantwortlich für die Auswahl verfügbarer Konten aus dem lokalen Kontopool, bei Bedarf Token zu aktualisieren, Rotierung und Selbstheilung durchzuführen.

::: info Was bedeutet "lokaler Gateway"?
Hier bedeutet "lokal" das im wörtlichen Sinne: Der Dienst läuft auf Ihrem eigenen Computer, Ihr Client (Claude Code, OpenAI SDK, verschiedene Drittanbieter-Clients) weist die Base URL auf `http://127.0.0.1:<port>`, die Ankommen, dann leitet Antigravity Tools sie an den Upstream weiter.
:::

## Welche Endpunkte stellt es bereit?

Der Reverse-Proxy-Dienst registriert mehrere Sets von Protokoll-Endpunkten in einem Router. Sie können sich zuerst diese "Eingänge" merken:

- OpenAI-kompatibel: `/v1/chat/completions`, `/v1/completions`, `/v1/responses`, `/v1/models`
- Anthropic-kompatibel: `/v1/messages`, `/v1/messages/count_tokens`
- Gemini-nativ: `/v1beta/models`, `/v1beta/models/:model`, `/v1beta/models/:model/countTokens`
- Gesundheits-Check: `GET /healthz`

Wenn Ihr Client eines dieser Protokolle unterstützen kann, kann er theoretisch durch Ändern der Base URL Anfragen an diesen lokalen Gateway weiterleiten.

## Standard-Sicherheitsgrenzen (nicht überspringen)

Das größte Problem bei solchen "lokalen Reverse-Proxies" liegt oft nicht in unzureichenden Funktionen, sondern dass Sie sie versehentlich nach außen freigeben.

Merken Sie sich zuerst einige Standardwerte (alle aus der Standardkonfiguration):

- Standard-Port: `8045`
- Standardmäßig nur lokaler Zugriff: `allow_lan_access=false`, Überwachungsadresse ist `127.0.0.1`
- Standard-Authentifizierungsmodus: `auth_mode=off` (verlangt nicht, dass Client einen Schlüssel mitbringt)
- Standardmäßig wird ein `sk-...`-förmiger `api_key` generiert (für den Fall, dass Sie Authentifizierung benötigen)

::: warning Wann müssen Sie Authentifizierung aktivieren?
Sobald Sie LAN-Zugriff aktivieren (`allow_lan_access=true`, Überwachungsadresse wird `0.0.0.0`), sollten Sie gleichzeitig Authentifizierung aktivieren und den API-Schlüssel als Passwort verwalten.
:::

## Wann Sie Antigravity Tools verwenden

Es eignet sich besser für diese Szenarien:

- Sie haben mehrere AI-Clients/SDKs und möchten sie über eine einheitliche Base URL führen
- Sie müssen verschiedene Protokolle (OpenAI/Anthropic/Gemini) auf denselben "lokalen Ausgang" konvergieren
- Sie haben mehrere Konten und möchten das System für Rotierung und Stabilität verantwortlich machen

Wenn Sie nur "zwei Zeilen Code schreiben und direkt die offizielle API aufrufen" möchten, und das Konto/Protokoll sehr fest ist, könnte es etwas zu umfangreich sein.

## Folgen Sie mir: Richten Sie zuerst die richtige Reihenfolge ein

In dieser Lektion lernen Sie keine detaillierte Konfiguration, sondern richten nur die Hauptreihenfolge ein, um zu vermeiden, dass Sie durch Springen stecken bleiben:

### Schritt 1: Installieren, dann starten

**Warum**
Die Desktop-Anwendung ist verantwortlich für Kontoverwaltung und Start des Reverse-Proxy-Dienstes; ohne sie sind das spätere OAuth/Reverse-Proxy unmöglich.

Gehen Sie im nächsten Kapitel nach der README-Installationsmethode vor, um die Installation abzuschließen.

**Was Sie sehen sollten**: Sie können Antigravity Tools öffnen und die Dashboard-Seite sehen.

### Schritt 2: Fügen Sie mindestens ein Konto hinzu

**Warum**
Der Reverse-Proxy-Dienst muss eine verfügbare Identität aus dem Kontopool erhalten, um Anfragen an den Upstream zu senden; ohne Konto kann der Gateway auch "für Sie aufrufen" nicht.

Gehen Sie zum Kapitel "Konto hinzufügen", fügen Sie das Konto über OAuth oder Refresh-Token-Prozess hinzu.

**Was Sie sehen sollten**: Ihr Konto erscheint auf der Konten-Seite, und Sie können Kontingent/Status-Informationen sehen.

### Schritt 3: Starten Sie API Proxy und verwenden Sie /healthz für minimale Validierung

**Warum**
Validieren Sie zuerst mit `GET /healthz`, dass "lokaler Dienst läuft", bevor Sie den Client einbinden; die Fehlersuche ist viel einfacher.

Gehen Sie zum Kapitel "Lokalen Reverse-Proxy starten und ersten Client einbinden", um den Kreis zu schließen.

**Was Sie sehen sollten**: Ihr Client/SDK kann über die lokale Base URL erfolgreich Antworten erhalten.

## Hinweise zu Fallstricken

| Szenario | Was Sie vielleicht tun (❌) | Empfohlene Vorgehensweise (✓) |
|--- | --- | ---|
| Möchten, dass Telefon/anderer Computer zugreift | Direkt `allow_lan_access=true` öffnen, aber keine Authentifizierung setzen | Aktivieren Sie gleichzeitig Authentifizierung und validieren Sie zuerst `GET /healthz` im LAN |
| Client meldet 404 | Nur host/port ändern, ohne zu berücksichtigen, wie Client `/v1` zusammensetzt | Bestätigen Sie zuerst die Base-URL-Zusammensetzungsstrategie des Clients, bevor Sie entscheiden, ob Sie das `/v1`-Präfix benötigen |
| Fangen sofort mit Claude Code an | Verbinden Sie direkt komplexen Client, bei Fehler wissen Sie nicht, wo zu suchen | Führen Sie zuerst den minimalen Kreis aus: Proxy starten -> `GET /healthz` -> dann Client einbinden |

## Zusammenfassung dieser Lektion

- Die Position von Antigravity Tools ist "Desktop-Anwendung + lokaler HTTP-Reverse-Proxy-Gateway": GUI-Verwaltung, Axum stellt Multi-Protokoll-Endpunkte bereit
- Sie müssen es als lokale Infrastruktur behandeln: zuerst installieren, dann Konto hinzufügen, dann Proxy starten, zuletzt Client einbinden
- Standardmäßig wird nur `127.0.0.1:8045` überwacht; wenn Sie es an das LAN freigeben, aktivieren Sie unbedingt gleichzeitig Authentifizierung

## Vorschau auf die nächste Lektion

> In der nächsten Lektion schließen wir den Installationsschritt ab: **[Installation und Upgrade: Beste Installationspfad für die Desktop-Anwendung](../installation/)**.
>
> Sie werden lernen:
> - Die im README aufgeführten Installationsmethoden (und Prioritäten)
> - Die Upgrade-Option und die Behandlung häufiger System-Blockierungen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcode-Position anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|

**Wichtige Standardwerte**:
- `ProxyConfig.port = 8045`: Standard-Port des Reverse-Proxy-Dienstes
- `ProxyConfig.allow_lan_access = false`: Standardmäßig nur lokaler Zugriff
- `ProxyAuthMode::default() = off`: Standardmäßig keine Authentifizierung erforderlich

</details>

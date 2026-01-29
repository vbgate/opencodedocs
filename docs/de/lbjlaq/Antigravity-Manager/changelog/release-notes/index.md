---
title: "Release-Notizen: Versionsverlauf | Antigravity-Manager"
sidebarTitle: "Versionen in 3 Minuten verstehen"
subtitle: "Versionsverlauf: README-eingebetteter Changelog als Referenz"
description: "Erfahren Sie die Methoden zum Versionsverlauf von Antigravity-Manager. Bestätigen Sie Version und Updates auf der Settings-Seite, prüfen Sie Fixes und Hinweise im README-Changelog und validieren Sie die Upgradenützbarkeit mit /healthz."
tags:
  - "changelog"
  - "release"
  - "upgrade"
  - "troubleshooting"
prerequisite:
  - "start-installation"
  - "start-proxy-and-first-client"
order: 1
---

# Versionsverlauf: README-eingebetteter Changelog als Referenz

Sie bereiten sich vor, Antigravity Tools zu aktualisieren, und haben größte Angst nicht davor, "nicht aktualisiert" zu sein, sondern erst nach dem Update zu bemerken, dass es Kompatibilitätsänderungen gab. Auf dieser Seite wird die **Lese-Methode des Antigravity Tools Changelogs (Versionsverlauf)** klar erklärt, damit Sie vor dem Upgrade beurteilen können: Was wird dieses Update bei Ihnen beeinflussen?

## Was Sie nach dieser Lektion können

- Auf der About-Seite in Settings schnell die aktuelle Version bestätigen, Updates prüfen und den Download-Einstieg erhalten
- Im Changelog der README nur die Abschnitte lesen, die Sie betreffen (statt von Anfang bis Ende zu blättern)
- Vor dem Upgrade eine Sache tun: Bestätigen, ob es Hinweise gibt, die "Sie müssen manuell Konfiguration/Modell-Mapping ändern" erfordern
- Nach dem Upgrade einmal eine Mindestvalidierung (`/healthz`) durchführen, um zu bestätigen, dass der Proxy noch funktioniert

## Was ist ein Changelog?

Ein **Changelog** ist eine Liste, die pro Version aufzeichnet, "was diesmal geändert wurde". Antigravity Tools schreibt es direkt in die README im Abschnitt "Versionsverlauf", und jede Version wird mit Datum und wichtigen Änderungen gekennzeichnet. Vor dem Upgrade den Changelog zu lesen, kann die Wahrscheinlichkeit verringern, auf Kompatibilitätsänderungen oder Rückfallprobleme zu stoßen.

## Wann verwenden Sie diese Seite

- Sie bereiten sich vor, von einer alten Version auf eine neue Version zu aktualisieren und möchten zuerst die Risikopunkte bestätigen
- Sie stoßen auf ein Problem (z.B. 429/0 Token/Cloudflared) und möchten bestätigen, ob es in neueren Versionen behoben wurde
- Sie pflegen eine einheitliche Version in Ihrem Team und benötigen eine Methode für Kollegen, "Änderungen pro Version zu lesen"

## 🎒 Vorbereitung vor dem Start

::: warning Empfohlen, den Upgrade-Pfad zuerst vorzubereiten
Es gibt viele Installations-/Upgrade-Methoden (brew, manuelle Downloads von Releases, In-App-Updates). Wenn Sie noch nicht sicher sind, welchen Weg Sie wählen, schauen Sie zuerst auf **[Installation und Upgrade: Beste Installationsmethode für Desktop (brew / releases)](/de/lbjlaq/Antigravity-Manager/start/installation/)**.
:::

## Machen Sie mit

### Schritt 1: Bestätigen Sie auf der About-Seite die Version, die Sie derzeit verwenden

**Warum**
Der Changelog ist pro Version organisiert. Sie müssen zuerst Ihre aktuelle Version kennen, um zu wissen, "wo Sie anfangen sollen zu lesen".

Pfad: **Settings** → **About**.

**Sie sollten sehen**: Im Titelfeld der Seite werden der Anwendungsname und die Versionsnummer angezeigt (z.B. `v3.3.49`).

### Schritt 2: Klicken Sie auf "Update prüfen" und erhalten Sie die neueste Version und den Download-Einstieg

**Warum**
Sie müssen zuerst wissen, "was die neueste Versionsnummer ist", um dann im Changelog die Versionsabschnitte auszuwählen, die Sie übersprungen haben.

Klicken Sie auf der About-Seite auf "Update prüfen".

**Sie sollten sehen**:
- Wenn ein Update verfügbar ist: Hinweis "new version available" und ein Download-Button erscheint (öffnet `download_url`)
- Wenn bereits die neueste Version: Hinweis "latest version"

### Schritt 3: Gehen Sie zum Changelog der README und lesen Sie nur die Versionen, die Sie übersprungen haben

**Warum**
Sie müssen sich nur um Änderungen zwischen "von Ihrer aktuellen Version bis zur neuesten Version" kümmern, andere historische Versionen können vorerst übersprungen werden.

Öffnen Sie die README, navigieren Sie zum **"Versionsverlauf (Changelog)"**, und lesen Sie ab der neuesten Version nach unten, bis Sie Ihre aktuelle Version sehen.

**Sie sollten sehen**: Versionen im Format `vX.Y.Z (YYYY-MM-DD)` aufgelistet, und jede Version hat gruppierende Erklärungen (z.B. Kernfixes / Funktionsverbesserungen).

### Schritt 4: Machen Sie nach dem Upgrade eine Mindestvalidierung

**Warum**
Die erste Sache nach dem Upgrade ist nicht "komplexe Szenarien auszuführen", sondern zuerst zu bestätigen, dass der Proxy normal starten kann und von Clients aktivitätsgeprüft werden kann.

Führen Sie den Fluss aus **[Lokalen Reverse-Proxy starten und ersten Client anschließen (/healthz + SDK-Konfiguration)](/de/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)** und validieren Sie mindestens einmal `GET /healthz`.

**Sie sollten sehen**: `/healthz` gibt Erfolg zurück (zur Bestätigung der Dienstverfügbarkeit).

## Zusammenfassung neuerer Versionen (aus README)

| Version | Datum | Punkte, die Sie beachten sollten |
|--- | --- | ---|
| `v3.3.49` | 2026-01-22 | Denkunterbrechung und 0-Token-Verteidigung; Entfernung von `gemini-2.5-flash-lite` und Hinweis zum manuellen Ersetzen benutzerdefinierter Mappings; Sprache/Theme-Einstellungen wirken sofort; Monitoring-Dashboard-Verbesserungen; OAuth-Kompatibilitätserhöhung |
| `v3.3.48` | 2026-01-21 | Hintergrundprozess unter Windows läuft im Hintergrund (behebt Konsolenflackern) |
| `v3.3.47` | 2026-01-21 | Bildgenerierungsparameter-Mapping-Verbesserung (`size`/`quality`); Cloudflared-Tunnel-Unterstützung; Behebung von Startfehlern durch Merge-Konflikte; dreischichtige progressive Kontextkomprimierung |

::: tip Wie schnell beurteilen, ob dieses Update mich beeinflusst
Suchen Sie vorrangig nach zwei Arten von Sätzen:

- **Benutzerhinweise / Sie müssen ändern**: Zum Beispiel explizit erwähnen, dass ein Standardmodell entfernt wurde und Sie angehalten werden, benutzerdefinierte Mappings manuell anzupassen
- **Kernfixes / Kompatibilitätsfixes**: Zum Beispiel Probleme wie 0 Token, 429, Windows-Flackern, Startfehler, die "Sie daran hindern zu verwenden"
:::

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Inhalt | Dateipfad | Zeilennummer |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|

</details>

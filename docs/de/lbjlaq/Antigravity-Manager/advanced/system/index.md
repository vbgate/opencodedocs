---
title: "Systemfunktionen: Sprache/Theme/API | Antigravity-Manager"
sidebarTitle: "Systemkonfiguration in 5 Minuten"
subtitle: "Systemfunktionen: Sprache/Theme/API | Antigravity-Manager"
description: "Lernen Sie die Sprache, Themes, Taskleiste und API-Server von Antigravity Tools kennen. Beherrschen Sie i18n-Fallback, Autostart, HTTP-Schnittstellenaufrufe und Neustart-Regeln."
tags:
  - "Systemeinstellungen"
  - "i18n"
  - "Theme"
  - "Update"
  - "Taskleiste"
  - "HTTP API"
prerequisite:
  - "start-first-run-data"
  - "advanced-config"
order: 9
---

# Systemfunktionen: Mehrsprachigkeit/Theme/Update/Autostart/HTTP-API-Server

Sie haben das Theme auf Dark umgestellt, aber die Oberfläche bleibt hell; Sie haben das Fenster geschlossen, aber der Prozess läuft im Hintergrund; Sie möchten, dass externe Tools das aktuelle Konto wechseln, aber den Reverse-Proxy nicht im LAN offenlegen.

Diese Lektion konzentriert sich auf die "Systemfunktionen" von Antigravity Tools: Sprache, Theme, Update, Taskleiste/Autostart sowie ein HTTP-API-Server für Aufrufe durch externe Programme.

## Was sind Systemfunktionen?

**Systemfunktionen** beziehen sich auf die "Produktisierungsfähigkeiten" von Antigravity Tools als Desktop-Anwendung: mehrsprachige Benutzeroberfläche mit Theme-Wechsel, Update-Prüfung und -Upgrade, Verbleib in der Taskleiste und Autostart nach dem Schließen des Fensters sowie die Bereitstellung eines nur an `127.0.0.1` gebundenen HTTP-API-Servers für Aufrufe durch externe Programme.

## Was Sie nach dieser Lektion können

- Sprache/Theme wechseln und verstehen, welche Änderungen "sofort wirksam" werden
- Den Unterschied zwischen "Fenster schließen" und "Programm beenden" verstehen und wissen, was das Taskleistenmenü kann
- Die Auslösebedingungen, das Intervall und die Persistenzdatei der automatischen Update-Prüfung kennen
- Den HTTP-API-Server aktivieren und mit `curl` die Erreichbarkeit und Kontowechsel testen

## 🎒 Vorbereitungen

- Sie wissen, wo sich das Datenverzeichnis befindet (siehe [Wichtig beim ersten Start: Datenverzeichnis, Protokolle, Taskleiste & Autostart](../../start/first-run-data/))
- Sie wissen, dass `gui_config.json` die einzigartige Quelle für gespeicherte Konfigurationen ist (siehe [Konfiguration im Detail: AppConfig/ProxyConfig, Speicherort & Hot-Update-Semantik](../config/))

## Kernprinzip

Es ist einfacher zu merken, wenn Sie diese Fähigkeiten in zwei Kategorien einteilen:

1. "Konfigurationsgesteuerte" Fähigkeiten: Sprache und Theme werden in `gui_config.json` geschrieben (Frontend ruft `save_config` auf).
2. "Unabhängig persistierte" Fähigkeiten: Update-Einstellungen und HTTP-API-Einstellungen haben jeweils eigene JSON-Dateien; Taskleiste und Verhalten beim Schließen werden von Tauri gesteuert.

## Machen Sie mit
### Schritt 1: Sprache wechseln (sofort wirksam + automatische Persistenz)

**Warum**
Der Sprachwechsel lässt viele Menschen glauben, dass ein "Neustart erforderlich" sei. Die Implementierung hier ist: Die Benutzeroberfläche wechselt sofort, während die `language` gleichzeitig in die Konfiguration zurückgeschrieben wird.

Vorgehensweise: Öffnen Sie `Settings` → `General` und wählen Sie eine Sprache im Dropdown-Menü.

Sie sehen fast zeitgleich zwei Dinge:

- Die Benutzeroberfläche wechselt sofort zur neuen Sprache (Frontend ruft direkt `i18n.changeLanguage(newLang)` auf).
- Die Konfiguration wird persistent gespeichert (Frontend ruft `updateLanguage(newLang)` auf, was intern `save_config` auslöst).

::: info Woher kommen die Sprachpakete?
Das Frontend hat `i18next` mit mehrsprachigen Ressourcen initialisiert und `fallbackLng: "en"` festgelegt. Das bedeutet: Wenn ein key keine Übersetzung hat, wird auf Englisch zurückgefallen.
:::

### Schritt 2: Theme wechseln (light/dark/system)

**Warum**
Das Theme beeinflusst nicht nur CSS, sondern auch die Hintergrundfarbe des Tauri-Fensters, das `data-theme` von DaisyUI und die `dark`-Klasse von Tailwind.

Vorgehensweise: Wechseln Sie in `Settings` → `General` das Theme zu `light` / `dark` / `system`.

Sie sollten sehen:

- Das Theme wird sofort wirksam (`ThemeManager` liest die Konfiguration und wendet sie auf `document.documentElement` an).
- Wenn das Theme `system` ist, werden Änderungen der Systemhelligkeit in Echtzeit an die App synchronisiert (überwacht `prefers-color-scheme`).

::: warning Eine Ausnahme bei Linux
`ThemeManager` versucht, `getCurrentWindow().setBackgroundColor(...)` aufzurufen, um die Fensterhintergrundfarbe zu setzen, überspringt diesen Schritt jedoch unter Linux (im Quellcode gibt es einen Kommentar, der erklärt: Transparentes Fenster + softbuffer kann zum Absturz führen).
:::

### Schritt 3: Autostart (und warum `--minimized` übergeben wird)

**Warum**
Autostart ist kein "Konfigurationsfeld", sondern ein systemweiter Registrierungseintrag (Tauri-Autostart-Plugin).

Vorgehensweise: Aktivieren/deaktivieren Sie in `Settings` → `General` "Autostart beim Systemstart".

Sie sollten sehen:

- Beim Umschalten wird direkt das Backend `toggle_auto_launch(enable)` aufgerufen.
- Bei der Seiteninitialisierung wird `is_auto_launch_enabled()` aufgerufen, um den echten Status anzuzeigen (ohne sich auf den lokalen Cache zu verlassen).

Zusatz: Bei der Initialisierung des Autostart-Plugins wird der Parameter `--minimized` übergeben, sodass "Autostart" meistens in minimierter/im-Hintergrund-Form startet (das genaue Verhalten hängt davon ab, wie das Frontend diesen Parameter verarbeitet).
### Schritt 4: Den Unterschied zwischen "Fenster schließen" und "Programm beenden" verstehen

**Warum**
Viele Desktop-Anwendungen "beenden beim Schließen", aber das Standardverhalten von Antigravity Tools ist "beim Schließen in der Taskleiste verstecken".

Sie sollten wissen:

- Nachdem Sie auf die Schaltfläche zum Schließen des Fensters geklickt haben, fängt Tauri das Schließereignis ab und ruft `hide()` auf, anstatt den Prozess zu beenden.
- Das Taskleistenmenü enthält `Show`/`Quit`: Um vollständig zu beenden, sollten Sie `Quit` verwenden.
- Der Text in der Taskleiste folgt `config.language` (beim Erstellen der Taskleiste wird die konfigurierte Sprache gelesen und der übersetzte Text verwendet; nach Konfigurationsupdates wird das `config://updated`-Ereignis überwacht, um das Taskleistenmenü zu aktualisieren).

### Schritt 5: Update-Prüfung (automatisch ausgelöst + manuelle Prüfung)

**Warum**
Bei Updates werden gleichzeitig zwei Dinge verwendet:

- Benutzerdefinierte "Versionsprüfungs"-Logik: Die neueste Version von GitHub Releases wird abgerufen, um festzustellen, ob ein Update vorliegt.
- Tauri Updater: Verantwortlich für das Herunterladen und Installieren, dann `relaunch()`.

Sie können es so verwenden:

1. Automatische Prüfung: Nach dem App-Start wird `should_check_updates` aufgerufen; wenn eine Prüfung erforderlich ist, wird `UpdateNotification` angezeigt und sofort `last_check_time` aktualisiert.
2. Manuelle Prüfung: Klicken Sie in der `Settings`-Seite auf "Update prüfen" (ruft `check_for_updates` auf und zeigt das Ergebnis in der Benutzeroberfläche an).

::: tip Woher kommt das Update-Intervall?
Das Backend speichert die Update-Einstellungen im Datenverzeichnis in `update_settings.json`, standardmäßig `auto_check=true` und `check_interval_hours=24`.
:::
### Schritt 6: HTTP-API-Server aktivieren (nur an lokalen Rechner gebunden)

**Warum**
Wenn Sie möchten, dass externe Programme (z. B. VS Code-Plugins) "Konto wechseln/Kontingent aktualisieren/Protokolle lesen", ist der HTTP-API-Server geeigneter als der Reverse-Proxy-Port: Er ist fest an `127.0.0.1` gebunden und nur für den lokalen Rechner zugänglich.

Vorgehensweise: Im Bereich "HTTP API" in `Settings` → `Advanced`:

1. Aktivieren Sie den Schalter.
2. Legen Sie den Port fest und klicken Sie auf Speichern.

Sie sollten sehen: Die Benutzeroberfläche gibt an, dass ein "Neustart erforderlich" ist (da das Backend nur beim Start `http_api_settings.json` liest und den Dienst startet).

### Schritt 7: HTTP-API mit curl verifizieren (Erreichbarkeit/Konto/Wechsel/Protokolle)

**Warum**
Sie benötigen einen reproduzierbaren Bestätigungszyklus: Können `health` erreichen, Konten auflisten, Wechsel/Aktualisierung auslösen und verstehen, dass dies asynchrone Aufgaben sind.

Der Standardport ist `19527`. Wenn Sie den Port geändert haben, ersetzen Sie `19527` unten durch Ihren tatsächlichen Wert.

::: code-group

```bash [macOS/Linux]
 # Erreichbarkeit prüfen
curl -sS "http://127.0.0.1:19527/health" && echo

 # Konten auflisten (mit Kontingent-Zusammenfassung)
curl -sS "http://127.0.0.1:19527/accounts" | head -n 5

 # Aktuelles Konto abrufen
curl -sS "http://127.0.0.1:19527/accounts/current" | head -n 5

 # Kontowechsel auslösen (Hinweis: Gibt 202 zurück, wird asynchron im Hintergrund ausgeführt)
curl -sS -i \
  -H 'Content-Type: application/json' \
  -d '{"account_id":"<account_id>"}' \
  "http://127.0.0.1:19527/accounts/switch"

 # Alle Kontingente aktualisieren auslösen (ebenfalls 202, asynchrone Ausführung)
curl -sS -i -X POST "http://127.0.0.1:19527/accounts/refresh"

 # Proxy-Protokolle lesen (limit/offset/filter/errors_only)
curl -sS "http://127.0.0.1:19527/logs?limit=50&offset=0&filter=&errors_only=false" | head -n 5
```

```powershell [Windows]
 # Erreichbarkeit prüfen
Invoke-RestMethod "http://127.0.0.1:19527/health"

 # Konten auflisten
Invoke-RestMethod "http://127.0.0.1:19527/accounts" | ConvertTo-Json -Depth 5

 # Aktuelles Konto abrufen
Invoke-RestMethod "http://127.0.0.1:19527/accounts/current" | ConvertTo-Json -Depth 5

 # Kontowechsel auslösen (gibt 202 zurück)
$body = @{ account_id = "<account_id>" } | ConvertTo-Json
Invoke-WebRequest -Method Post -ContentType "application/json" -Body $body "http://127.0.0.1:19527/accounts/switch" | Select-Object -ExpandProperty StatusCode

 # Alle Kontingente aktualisieren auslösen (gibt 202 zurück)
Invoke-WebRequest -Method Post "http://127.0.0.1:19527/accounts/refresh" | Select-Object -ExpandProperty StatusCode

 # Proxy-Protokolle lesen
Invoke-RestMethod "http://127.0.0.1:19527/logs?limit=50&offset=0&filter=&errors_only=false" | ConvertTo-Json -Depth 5
```

:::

**Sie sollten sehen**:

- `/health` gibt ein JSON im Stil `{"status":"ok","version":"..."}` zurück.
- `/accounts/switch` gibt 202 (Accepted) zurück und zeigt "task started" an. Der eigentliche Wechsel wird im Hintergrund ausgeführt.
## Kontrollpunkt ✅

- Sie können erklären, warum Sprache/Theme "sofort wirksam" werden, während der HTTP-API-Port einen Neustart erfordert
- Sie können erklären, warum das Schließen des Fensters nicht beendet und wo Sie wirklich beenden können
- Sie können mit `curl` `/health` und `/accounts` erreichen und verstehen, dass `/accounts/switch` asynchron ist

## Häufige Fallstricke

1. Der HTTP-API-Server ist fest an `127.0.0.1` gebunden; das ist etwas anderes als `proxy.allow_lan_access`.
2. Die Logik "ob geprüft werden soll" bei der Update-Prüfung wird beim App-Start entschieden; einmal ausgelöst, wird zuerst `last_check_time` aktualisiert, selbst wenn die nachfolgende Prüfung fehlschlägt, wird nicht in kurzer Zeit erneut ein Popup angezeigt.
3. "Fenster schließen beendet nicht" ist so beabsichtigt: Um die Prozessressourcen freizugeben, verwenden Sie `Quit` in der Taskleiste.

## Zusammenfassung dieser Lektion

- Sprache: UI wechselt sofort + wird in Konfiguration zurückgeschrieben (`i18n.changeLanguage` + `save_config`)
- Theme: Wird von `ThemeManager` einheitlich in `data-theme`, `dark`-Klasse und Fensterhintergrundfarbe umgesetzt (Linux hat eine Ausnahme)
- Update: Beim Start wird basierend auf `update_settings.json` entschieden, ob ein Popup angezeigt wird; Installation wird von Tauri Updater durchgeführt
- HTTP API: Standardmäßig aktiviert, nur vom lokalen Rechner zugänglich, Konfiguration wird in `http_api_settings.json` gespeichert, Portänderung erfordert Neustart

## Vorschau auf die nächste Lektion

> Die nächste Lektion führt in die **Serverbereitstellung: Docker noVNC vs Headless Xvfb (advanced-deployment)** ein und bringt die Desktop-Version auf NAS/Server zum Laufen.
---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcode-Orte anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-23

| Thema | Dateipfad | Zeilen |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
| UpdateNotification: Update prüfen, automatisch herunterladen, installieren und relaunch | [`src/components/UpdateNotification.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/UpdateNotification.tsx#L1-L217) | 1-217 |
|--- | --- | ---|
| Taskleiste: Menü nach Sprache generieren + `config://updated` überwachen zum Aktualisieren | [`src-tauri/src/modules/tray.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/tray.rs#L1-L255) | 1-255 |
|--- | --- | ---|
|--- | --- | ---|
| Tauri: autostart/updater initialisieren + Fenster schließen zu hide konvertieren + HTTP API starten | [`src-tauri/src/lib.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/lib.rs#L50-L160) | 50-160 |
| HTTP API: Einstellungen speichern + Routen (health/accounts/switch/refresh/logs) + nur an 127.0.0.1 gebunden | [`src-tauri/src/modules/http_api.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/http_api.rs#L1-L95) | 1-95 |
|--- | --- | ---|
|--- | --- | ---|

</details>

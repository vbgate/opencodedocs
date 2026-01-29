---
title: "Erster Start: Datenverzeichnis verstehen | Antigravity Tools"
sidebarTitle: "Datenverzeichnis finden"
subtitle: "Wichtig für den ersten Start: Datenverzeichnis, Protokolle, Taskleiste und automatischer Start"
description: "Lernen Sie den Speicherort des Datenverzeichnisses von Antigravity Tools und die Protokollverwaltung kennen. Meistern Sie das Öffnen des Datenverzeichnisses über die Einstellungen, das Bereinigen von Protokollen, den Taskleistenbetrieb und den automatischen Systemstart, und unterscheiden Sie die beiden Arten des automatischen Starts."
tags:
  - "Erster Start"
  - "Datenverzeichnis"
  - "Protokolle"
  - "Taskleiste"
  - "Automatischer Start"
prerequisite:
  - "../getting-started/"
  - "../installation/"
order: 3
---

# Wichtig für den ersten Start: Datenverzeichnis, Protokolle, Taskleiste und automatischer Start

Viele der "magisch wirkenden" Fähigkeiten von Antigravity Tools (Kontopool, Kontingente, Überwachung, Statistiken, Hintergrundbetrieb) basieren letztendlich auf zwei Dingen: dem **Datenverzeichnis** und den **Protokollen**. Wenn Sie diese beiden Bereiche gleich beim ersten Start verstehen, sparen Sie später viel Zeit bei der Fehlerbehebung.

## Was ist das Datenverzeichnis?

Das **Datenverzeichnis** ist der Ordner, in dem Antigravity Tools den lokalen Status speichert: Konten-JSON, kontingentbezogene Dateien, Protokolldateien sowie die SQLite-Datenbanken von Token Stats/Proxy Monitor werden alle hier abgelegt. Wenn Sie Backups erstellen/migrieren/problemlösen, müssen Sie nur dieses Verzeichnis finden, um die maßgebliche Datenquelle zu finden.

## Was Sie nach dieser Lektion können

- Sie wissen, wo sich das Datenverzeichnis von Antigravity Tools befindet (und können es mit einem Klick öffnen)
- Sie wissen, welche Dateien gesichert werden sollten und welche Protokolle/Caches sind
- Sie können bei Problemen schnell auf Protokolle und Überwachungsdatenbanken zugreifen
- Sie verstehen den Unterschied zwischen "Fenster schließen" und "Programm beenden" (Taskleisten-Dienst)
- Sie unterscheiden die beiden Arten des automatischen Starts: Start beim Systemstart vs. automatischer Start des Reverse-Proxys

## Ihr aktuelles Dilemma

- Sie möchten Konten sichern/migrieren, wissen aber nicht, wo sie tatsächlich gespeichert sind
- Die UI meldet Fehler/Reverse-Proxy-Aufrufe schlagen fehl, aber Sie finden die Protokolle nicht
- Sie haben das Fenster geschlossen, gedacht, das Programm sei beendet, aber es läuft weiter im Hintergrund

## Wann Sie diesen Ansatz verwenden

- Sie haben gerade Antigravity Tools installiert und möchten bestätigen, "wo die Daten gespeichert sind"
- Sie möchten den Computer neu aufsetzen oder das System neu installieren und möchten zuerst Konten und Statistikdaten sichern
- Sie müssen Probleme untersuchen: OAuth-Fehler, Aktualisierung von Kontingenten fehlgeschlagen, Reverse-Proxy-Start fehlgeschlagen, Aufrufe melden 401/429

## 🎒 Vorbereitungen vor dem Start

- Antigravity Tools installiert und geöffnet
- Sie können auf die Settings-Seite zugreifen (Einstellungseingang oben rechts/in der Seitenleiste)
- Ihr Systemkonto hat Berechtigungen für den Zugriff auf Ihr Home-Verzeichnis

::: warning Hinweis
Diese Lektion wird Ihnen sagen, welche Dateien "echte Daten" sind, aber es wird nicht empfohlen, diese Dateien manuell zu bearbeiten. Wenn Sie die Konfiguration ändern möchten, tun Sie dies vorzugsweise in der UI.
:::

## Kernkonzept

Merken Sie sich zuerst einen Satz:

"**Das Datenverzeichnis ist die einzige Quelle der Wahrheit für den lokalen Status; Protokolle sind der erste Eingang zur Fehlerbehebung.**"

Antigravity Tools erstellt das Datenverzeichnis `.antigravity_tools` in Ihrem Home-Verzeichnis und speichert Konten, Protokolle, Statistikdatenbanken und andere Inhalte dort (das Verzeichnis wird automatisch erstellt, wenn es nicht existiert).

Gleichzeitig wird standardmäßig die Taskleiste aktiviert: Wenn Sie das Fenster schließen, wird das Programm nicht sofort beendet, sondern in der Taskleiste ausgeblendet und im Hintergrund weiter ausgeführt.

## Folgen Sie mir

### Schritt 1: Datenverzeichnis in den Einstellungen öffnen

**Warum**
Wenn Sie zuerst das Datenverzeichnis genau lokalisieren, haben Sie später einen "Anknüpfungspunkt" für Backups oder Fehlerbehebungen.

Öffnen Sie in Antigravity Tools Settings und wechseln Sie zu Advanced.

Sie sehen ein schreibgeschütztes Eingabefeld für "Datenverzeichnis" (es zeigt den tatsächlichen Pfad an) und daneben einen Öffnen-Button.

Klicken Sie auf den Öffnen-Button.

**Was Sie sehen sollten**: Der Systemdateimanager öffnet ein Verzeichnis mit einem Pfad ähnlich wie `~/.antigravity_tools/`.

### Schritt 2: Pfad Ihres Datenverzeichnisses bestätigen (plattformübergreifend)

**Warum**
Wenn Sie später Skripte für Backups schreiben oder Probleme über die Befehlszeile untersuchen, müssen Sie den tatsächlichen Pfad dieses Verzeichnisses auf Ihrem System kennen.

::: code-group

```bash [macOS/Linux]
echo "$HOME/.antigravity_tools"
ls -la "$HOME/.antigravity_tools"
```

```powershell [Windows]
$dataDir = Join-Path $HOME ".antigravity_tools"
$dataDir
Get-ChildItem -Force $dataDir
```

:::

**Was Sie sehen sollten**: Das Verzeichnis existiert (wenn Sie die Einstellungsseite zum ersten Mal öffnen, wird das Verzeichnis automatisch erstellt).

### Schritt 3: "Schlüsseldateien" im Datenverzeichnis kennenlernen

**Warum**
Nicht alle Dateien sind Backups wert. Unterscheiden Sie zuerst "was sind Kontendaten" und "was sind Statistikdatenbanken/Protokolle".

Die folgenden Dateinamen stammen aus dem Projektquellcode und sind fest:

| Was Sie sehen | Zweck | Was Sie beachten sollten |
| --- | --- | --- |
| `accounts.json` | Kontenindex (enthält Kontenliste/aktuelles Konto) | Es wird empfohlen, dies beim Migrieren von Konten gemeinsam zu sichern |
| `accounts/` | Ein `*.json`-Pro-Datei für jedes Konto | Dies ist der Hauptteil der Kontendaten |
| `logs/` | Verzeichnis für Anwendungsprotokolle | Für Fehlerbehebung zuerst hier nachsehen |
| `token_stats.db` | SQLite-Datenbank von Token Stats | Die Daten, die Sie auf der Token Stats-Seite sehen, stammen daraus |
| `proxy_logs.db` | SQLite-Datenbank von Proxy Monitor | Die Anfrageprotokolle, die Sie auf der Monitor-Seite sehen, stammen daraus |
| `warmup_history.json` | Lokaler Verlauf von Smart Warmup | Wird hauptsächlich verwendet, um wiederholtes Warmup zu vermeiden |
| `update_settings.json` | Update-Check-Einstellungen (automatische Prüfung/Intervall usw.) | Normalerweise müssen Sie dies nicht manuell bearbeiten |

**Was Sie sehen sollten**: Mindestens das `logs/`-Verzeichnis existiert; wenn Sie noch keine Konten hinzugefügt haben, sind `accounts.json`/`accounts/` möglicherweise noch nicht vorhanden.

### Schritt 4: Speicherort der Protokolle merken (für Fehlerbehebung wichtig)

**Warum**
Fehlermeldungen in der UI geben oft nur das "Phänomen" an; die tatsächliche Ursache für den Fehler (z. B. Anfragefehler, Dateilese-/schreibfehler) liegt oft in den Protokollen.

Antigravity Tools schreibt Protokolle in `logs/` im Datenverzeichnis.

::: code-group

```bash [macOS/Linux]
ls -la "$HOME/.antigravity_tools/logs"
```

```powershell [Windows]
Get-ChildItem -Force (Join-Path $HOME ".antigravity_tools\logs")
```

:::

**Was Sie sehen sollten**: Im Verzeichnis existieren täglich rotierende Protokolldateien (Dateinamen beginnen mit `app.log`).

### Schritt 5: Wenn Sie "Protokolle bereinigen" müssen, verwenden Sie die Ein-Klick-Bereinigung auf der Einstellungsseite

**Warum**
Manche Probleme möchten Sie nur einmal reproduzieren und dann das Protokoll davon separat aufbewahren; in diesem Fall ist es besser, zuerst die Protokolle zu bereinigen, um den Vergleich zu erleichtern.

Gehen Sie in Settings -> Advanced, finden Sie den Protokollbereich und klicken Sie auf "Protokolle bereinigen".

**Was Sie sehen sollten**: Ein Bestätigungsdialog wird angezeigt; nach Bestätigung wird die erfolgreiche Bereinigung gemeldet.

::: tip Zwei Dinge, die Sie sich Sorgen machen
- Protokolle werden automatisch "täglich rotiert" und versuchen beim Start, alte Protokolle, die älter als 7 Tage sind, zu bereinigen.
- "Protokolle bereinigen" schneidet die Protokolldateien auf 0 Bytes ab, damit laufende Prozesse weiterhin in dieselbe Dateihandle schreiben können.
:::

### Schritt 6: Unterschied zwischen "Fenster schließen" und "Programm beenden" verstehen (Taskleiste)

**Warum**
Antigravity Tools aktiviert standardmäßig die Taskleiste; wenn Sie auf das Schließen-Symbol oben rechts im Fenster klicken, wird das Programm in der Taskleiste ausgeblendet und weiter ausgeführt. Wenn Sie denken, es ist beendet, entsteht leicht der Eindruck "Port wird noch belegt/Läuft noch im Hintergrund".

Sie können diesen kleinen Ablauf bestätigen:

```
Aktion: Fenster schließen (nicht beenden)

┌─────────────────────────────────────────────────────────────┐
│  Schritt 1                Schritt 2                         │
│  Fenster schließen   →   Suchen Sie das Symbol in der       │
│                          System-Taskleiste/Menüleiste      │
└─────────────────────────────────────────────────────────────┘

Was Sie sehen sollten: Das Taskleistensymbol existiert noch, durch Klicken können Sie das Fenster erneut anzeigen.
```

Im Taskleistenmenü gibt es auch zwei häufige Aktionen (sehr bequem ohne UI):

- Konto wechseln: Zum nächsten Konto wechseln
- Kontingent aktualisieren: Kontingent des aktuellen Kontos aktualisieren (gleichzeitig wird das Frontend benachrichtigt, die Anzeige zu aktualisieren)

### Schritt 7: Automatischen Start beim Systemstart einrichten (damit es nach dem Start automatisch minimiert wird)

**Warum**
Wenn Sie möchten, dass es wie ein "Dienst" arbeitet (Taskleisten-Dienst + Hintergrundaktualisierung), spart der automatische Start beim Systemstart das manuelle Öffnen jedes Mal.

Gehen Sie in Settings -> General, finden Sie "Automatisch beim Systemstart" und wählen Sie Aktivieren.

**Was Sie sehen sollten**: Nach dem Umschalten wird die erfolgreiche Aktivierung gemeldet; beim nächsten Start beim Systemstart wird es mit dem Parameter `--minimized` ausgeführt.

::: info Zwei Arten von "automatischem Start", verwechseln Sie sie nicht
| Name | Was bedeutet das | Beweis |
| --- | --- | --- |
| Automatischer Systemstart | Automatischer Start von Antigravity Tools nach dem Start des Computers (die Desktop-Anwendung selbst) | Startparameter enthalten `--minimized` und bieten den Befehl `toggle_auto_launch` |
| Automatischer Start des Reverse-Proxys | Wenn Antigravity Tools startet und `proxy.auto_start=true` konfiguriert ist, versucht es, den lokalen Reverse-Proxy-Dienst automatisch zu starten | Liest die Konfiguration beim Anwendungsstart und führt `start_proxy_service(...)` aus |
:::

## Checkpoint ✅

- [ ] Sie können in Settings -> Advanced den tatsächlichen Pfad des Datenverzeichnisses sehen
- [ ] Sie können das Datenverzeichnis öffnen und `accounts.json`, `accounts/`, `logs/`, `token_stats.db`, `proxy_logs.db` grob erkennen
- [ ] Sie wissen, dass sich Protokolle unter `logs/` befinden, und können sie schnell über die Befehlszeile anzeigen
- [ ] Sie wissen, dass das Programm nach dem Schließen des Fensters noch in der Taskleiste läuft; zum Beenden verwenden Sie Quit im Taskleistenmenü
- [ ] Sie können zwischen "automatischem Systemstart" und "automatischem Start des Reverse-Proxys" unterscheiden

## Hinweise zu Fallstricken

| Szenario | Was Sie vielleicht tun (❌) | Empfohlene Vorgehensweise (✓) |
| --- | --- | --- |
| Datenverzeichnis nicht gefunden | Installationsverzeichnis der App im System wild durchsuchen | Gehen Sie direkt zu Settings -> Advanced, sehen Sie "Datenverzeichnis" und öffnen Sie es mit einem Klick |
| Fenster geschlossen, aber nicht beendet | Nach dem Schließen des Fensters sofort Konfiguration ändern/Port ändern | Überprüfen Sie zuerst, ob das Taskleistensymbol noch existiert; zum Beenden verwenden Sie Quit in der Taskleiste |
| Zu viele Protokolle, schwer zu untersuchen | Während Sie das Problem reproduzieren, alte Protokolle durchsuchen | Bereinigen Sie zuerst "Protokolle", reproduzieren Sie dann einmal, und sehen Sie zuletzt nur die Protokolldatei dieses Mal |
| Kontendaten ändern möchten | `accounts/*.json` manuell bearbeiten | Verwenden Sie den Import/Export/Migrations-Ablauf der UI (im nächsten Abschnitt werden verwandte Kapitel behandelt) |

## Zusammenfassung dieser Lektion

- Das Datenverzeichnis ist festgelegt unter `.antigravity_tools` im Home-Verzeichnis (unter macOS/Linux normalerweise ein verstecktes Verzeichnis), Konten/Protokolle/Statistikdatenbanken sind alle hier
- Das Protokollverzeichnis ist `logs/`, für Fehlerbehebung zuerst hier nachsehen; bei Bedarf kann es mit einem Klick auf der Einstellungsseite bereinigt werden
- Nach dem Schließen des Fensters wird es in der Taskleiste ausgeblendet und weiter ausgeführt; zum vollständigen Beenden verwenden Sie Quit in der Taskleiste
- Es gibt zwei Arten des automatischen Starts: automatischer Systemstart (Anwendung) und automatischer Start des Reverse-Proxys (Proxy)

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Konto hinzufügen: OAuth/Refresh-Token-Doppelkanal und Best Practices](../add-account/)**.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcode-Position anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Speicherort des Datenverzeichnisses (`~/.antigravity_tools`) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L33) | 16-33 |
| Kontenindex und Kontendateiverzeichnis (`accounts.json` / `accounts/`) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L46) | 16-46 |
| Protokollverzeichnis und tägliche Rotation (`logs/` + `app.log`) | [`src-tauri/src/modules/logger.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/logger.rs#L17-L83) | 17-83 |
| Protokolle bereinigen (Datei abschneiden) | [`src-tauri/src/modules/logger.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/logger.rs#L149-L169) | 149-169 |
| Einstellungsseite zeigt Datenverzeichnis + Ein-Klick-Öffnen | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L525-L576) | 525-576 |
| Einstellungsseite Ein-Klick-Protokollbereinigung (Button + Dialoglogik) | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L127-L135) | 127-135 |
| Einstellungsseite Ein-Klick-Protokollbereinigung (Advanced tab Button) | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L732-L747) | 732-747 |
| Taskleistenmenü und Klickereignisse (Konto wechseln/aktualisieren/anzeigen/beenden) | [`src-tauri/src/modules/tray.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/tray.rs#L9-L158) | 9-158 |
| Fenster schließen -> Ausblenden (minimieren zur Taskleiste) | [`src-tauri/src/lib.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/lib.rs#L150-L160) | 150-160 |
| Initialisierung des Plugins für automatischen Systemstart (inklusive `--minimized`) | [`src-tauri/src/lib.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/lib.rs#L58-L66) | 58-66 |
| Schalter für automatischen Systemstart (`toggle_auto_launch` / `is_auto_launch_enabled`) | [`src-tauri/src/commands/autostart.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/autostart.rs#L4-L39) | 4-39 |
| Befehle: Datenverzeichnis öffnen / Pfad abrufen / Protokolle bereinigen | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L578-L621) | 578-621 |
| Datenbankdateiname von Token Stats (`token_stats.db`) | [`src-tauri/src/modules/token_stats.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/token_stats.rs#L58-L61) | 58-61 |
| Datenbankdateiname von Proxy Monitor (`proxy_logs.db`) | [`src-tauri/src/modules/proxy_db.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/proxy_db.rs#L5-L8) | 5-8 |
| Warmup-Verlaufsdateiname (`warmup_history.json`) | [`src-tauri/src/modules/scheduler.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/scheduler.rs#L14-L17) | 14-17 |
| Aktualisierungseinstellungsdateiname (`update_settings.json`) | [`src-tauri/src/modules/update_checker.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/update_checker.rs#L150-L177) | 150-177 |
| Automatischer Start des Reverse-Proxys (Startet Dienst bei `proxy.auto_start=true`) | [`src-tauri/src/lib.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/lib.rs#L107-L126) | 107-126 |

</details>

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Konto hinzufügen: OAuth/Refresh-Token-Doppelkanal und Best Practices](../add-account/)**.
>
> Sie werden lernen:
> - Wann Sie OAuth und wann Sie direkt refresh_token verwenden
> - Wie Sie mit Rückruf-Fehlern und nicht erhaltenem refresh_token umgehen
> - Wie Sie refresh_token stapelweise importieren, um schnell einen Kontopool zu erstellen

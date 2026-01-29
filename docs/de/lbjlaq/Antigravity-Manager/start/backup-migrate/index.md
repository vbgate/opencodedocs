---
title: "Konto-Migration: Backup/Hot-Migration | Antigravity Manager"
sidebarTitle: "3 Minuten zur Konto-Migration"
subtitle: "Konto-Migration: Backup/Hot-Migration"
description: "Lernen Sie Backup und Migration in Antigravity Manager. Unterstützt JSON-Import/-Export, Hot-Migration von Antigravity/IDE, Migration aus V1-Datenverzeichnis und automatische Synchronisation des aktuellen Kontos."
tags:
  - "Kontoverwaltung"
  - "Backup"
  - "Migration"
  - "Import/Export"
  - "state.vscdb"
prerequisite:
  - "start-add-account"
  - "start-first-run-data"
duration: 12
order: 5
---
# Konto-Backup und -Migration: Import/Export, V1/DB Hot-Migration

Was Sie wirklich "sichern" wollen, ist nicht die Quota-Zahl, sondern das `refresh_token`, mit dem sich das Konto erneut anmelden lässt. In dieser Lektion erklären wir die verschiedenen Migrationsmethoden von Antigravity Tools: JSON-Import/-Export, Import aus `state.vscdb`, Import aus V1-Datenverzeichnis und wie die automatische Synchronisation funktioniert.

## Was Sie nach dieser Lektion können

- Ihr Konto-Pool als JSON-Datei exportieren (nur email + refresh_token)
- Auf einem neuen Computer diese JSON importieren und den Konto-Pool schnell wiederherstellen
- Direkt aus Antigravity/IDE `state.vscdb` das "aktuell angemeldete Konto" importieren (unterstützt Standardpfad und benutzerdefinierten Pfad)
- Automatisch aus dem V1-Datenverzeichnis alte Konten scannen und importieren
- Verstehen, was "automatische Synchronisation des aktuellen Kontos" tut und wann sie übersprungen wird

## Ihr aktuelles Problem

- Nach Neuinstallation/Systemwechsel müssen Sie den Konto-Pool neu hinzufügen – das ist teuer
- Sie haben in Antigravity/IDE das angemeldete Konto gewechselt, aber im Manager ist das "aktuelle Konto" nicht mitgegangen
- Sie haben früher V1/Skript-Version verwendet und haben nur alte Datendateien – fragen sich, ob diese direkt migriert werden können

## Wann verwenden Sie diese Methode

- Sie möchten den Konto-Pool auf einen anderen Computer übertragen (Desktop/Server/Container)
- Sie verwenden Antigravity als "autorisches Login-Portal" und möchten, dass der Manager automatisch das aktuelle Konto synchronisiert
- Sie möchten Konten von einer alten Version (V1-Datenverzeichnis) migrieren

## 🎒 Vorbereitung

- Sie können Antigravity Tools öffnen und haben mindestens ein Konto im Konto-Pool
- Sie wissen, dass Kontodaten sensible Informationen sind (insbesondere `refresh_token`)

::: warning Sicherheitswarnung: Behandeln Sie Backup-Dateien wie Passwörter
Die exportierte JSON-Datei enthält `refresh_token`. Jeder, der sie hat, könnte sie verwenden, um Access Tokens zu aktualisieren. Laden Sie die Backup-Datei nicht in öffentliche Cloud-Links hoch, senden Sie sie nicht in Gruppen und committen Sie sie nicht nach Git.
:::

## Kernkonzept

"Migration" in Antigravity Tools läuft im Grunde auf zwei Dinge hinaus:

1) Ein verfügbares `refresh_token` finden
2) Damit ein Access Token eintauschen, bei Google die echte E-Mail abrufen und das Konto in den lokalen Konto-Pool schreiben

Es bietet drei Wege:

- JSON-Import/-Export: Geeignet für "kontrolliertes Backup"
- DB-Import: Geeignet, wenn Sie den Anmeldestatus von Antigravity/IDE als Quelle betrachten (standardmäßig `state.vscdb`, unterstützt auch manuelle Dateiauswahl)
- V1-Import: Geeignet für automatisches Scannen und Migrieren aus alten Datenverzeichnissen

Zusätzlich gibt es eine "automatische Synchronisation": Sie liest periodisch das refresh_token aus der DB. Wenn es vom aktuellen Konto des Managers abweicht, wird automatisch ein DB-Import ausgeführt; wenn es identisch ist, wird es übersprungen (spart Traffic).

## Lernen Sie mit mir

### Schritt 1: Konto-Pool exportieren (JSON-Backup)

**Warum**
Dies ist die stabilste und kontrollierteste Migrationsmethode. Sie erhalten eine Datei, mit der Sie den Konto-Pool auf einem anderen Computer wiederherstellen können.

Vorgehensweise: Öffnen Sie die Seite `Accounts`, klicken Sie auf Export.

- Wenn Sie in den Einstellungen `default_export_path` konfiguriert haben, wird direkt in dieses Verzeichnis exportiert mit dem Dateinamen `antigravity_accounts_YYYY-MM-DD.json`.
- Wenn kein Standardverzeichnis konfiguriert ist, wird ein System-Dialog angezeigt, in dem Sie den Pfad auswählen können.

Der Inhalt der exportierten Datei sieht ungefähr so aus (jedes Element im Array enthält nur die notwendigen Felder):

```json
[
  {
    "email": "alice@example.com",
    "refresh_token": "1//xxxxxxxxxxxxxxxxxxxxxxxx"
  },
  {
    "email": "bob@example.com",
    "refresh_token": "1//yyyyyyyyyyyyyyyyyyyyyyyy"
  }
]
```

**Sie sollten sehen**: Die Seite zeigt "Export erfolgreich" und den Speicherpfad.

### Schritt 2: Auf einem neuen Computer JSON importieren (Konto-Pool wiederherstellen)

**Warum**
Der Import führt die "Konto hinzufügen"-Logik für jedes Konto aus, verwendet `refresh_token`, um die echte E-Mail abzurufen und schreibt sie in den Konto-Pool.

Vorgehensweise: Öffnen Sie die Seite `Accounts`, klicken Sie auf "JSON importieren" und wählen Sie die soeben exportierte Datei aus.

Formatanforderungen (mindestens ein gültiger Eintrag erforderlich):

- Muss ein JSON-Array sein
- Das System importiert nur Einträge, die `refresh_token` enthalten und mit `1//` beginnen

**Sie sollten sehen**: Nach dem Import erscheinen die importierten Konten in der Kontoliste.

::: tip Wenn Sie während des Imports Proxy ausführen
Nach erfolgreichem "Konto hinzufügen" versucht das Backend, den Token-Pool des Reverse-Proxys neu zu laden, damit das neue Konto sofort wirksam wird.
:::

### Schritt 3: "Aktuell angemeldetes Konto" aus `state.vscdb` importieren

**Warum**
Manchmal möchten Sie keine Backup-Datei verwalten, sondern einfach "der Anmeldestatus von Antigravity/IDE gilt". DB-Import ist genau dafür gedacht.

Vorgehensweise: Öffnen Sie die Seite `Accounts`, klicken Sie auf **Add Account**, wechseln Sie zur Registerkarte `Import`:

- Klicken Sie auf "Aus Datenbank importieren" (verwendet den Standard-DB-Pfad)
- Oder klicken Sie auf "Benutzerdefinierte DB (state.vscdb)", um eine `*.vscdb`-Datei manuell auszuwählen

Der Standard-DB-Pfad ist plattformübergreifend (und erkennt auch `--user-data-dir` oder Portable Mode vorrangig):

::: code-group

```text [macOS]
~/Library/Application Support/Antigravity/User/globalStorage/state.vscdb
```

```text [Windows]
%APPDATA%\Antigravity\User\globalStorage\state.vscdb
```

```text [Linux]
~/.config/Antigravity/User/globalStorage/state.vscdb
```

:::

**Sie sollten sehen**:

- Nach erfolgreichem Import wird dieses Konto automatisch als "aktuelles Konto" des Managers festgelegt
- Das System löst automatisch eine Quota-Aktualisierung aus

### Schritt 4: Aus V1-Datenverzeichnis migrieren (alte Version importieren)

**Warum**
Wenn Sie früher die V1/Skript-Version verwendet haben, erlaubt Ihnen Manager, das alte Datenverzeichnis direkt zu scannen und zu versuchen, zu importieren.

Vorgehensweise: Auf der Registerkarte `Import` klicken Sie auf "V1 importieren".

Es sucht in Ihrem Home-Verzeichnis nach diesem Pfad (und den darin enthaltenen Indexdateien):

```text
~/.antigravity-agent/
  - antigravity_accounts.json
  - accounts.json
```

**Sie sollten sehen**: Nach Abschluss des Imports erscheinen die Konten in der Liste. Wenn keine Indexdateien gefunden werden, gibt das Backend den Fehler `V1 account data file not found` zurück.

### Schritt 5 (optional): "Automatische Synchronisation des aktuellen Kontos" aktivieren

**Warum**
Wenn Sie in Antigravity/IDE das angemeldete Konto wechseln, kann der Manager in festen Intervallen prüfen, ob sich das refresh_token in der DB geändert hat, und bei Änderungen automatisch importieren.

Vorgehensweise: Öffnen Sie `Settings`, aktivieren Sie `auto_sync` und stellen Sie `sync_interval` ein (Einheit: Sekunden).

**Sie sollten sehen**: Nach der Aktivierung wird sofort einmal synchronisiert. Danach wird periodisch nach dem Intervall ausgeführt. Wenn das refresh_token in der DB mit dem aktuellen Konto übereinstimmt, wird es übersprungen, nicht wiederholt importiert.

## Checkpoint ✅

- Sie können die importierten Konten in der `Accounts`-Liste sehen
- Sie sehen, dass das "aktuelle Konto" auf das gewünschte Konto gewechselt wurde (DB-Import setzt es automatisch als aktuell)
- Wenn Sie Proxy starten, können die neu importierten Konten normal für Anforderungen verwendet werden (basierend auf tatsächlichen Aufrufergebnissen)

## Fallstricke

| Szenario | Was Sie vielleicht tun (❌) | Empfohlene Vorgehensweise (✓) |
|--- | --- | ---|
| Sicherheit von Backup-Dateien | Die exportierte JSON wie eine normale Konfigurationsdatei einfach herumschicken | JSON wie Passwort behandeln, Verbreitung minimieren, öffentliche Exposition vermeiden |
| JSON-Import schlägt fehl | JSON ist kein Array oder refresh_token hat kein `1//`-Präfix | Verwenden Sie die von diesem Projekt exportierte JSON als Vorlage, behalten Sie Feldnamen und Struktur bei |
| DB-Import findet keine Daten | Antigravity war noch nie angemeldet oder in der DB fehlt `jetskiStateSync.agentManagerInitState` | Stellen Sie sicher, dass Antigravity/IDE angemeldet ist, versuchen Sie erneut zu importieren; verwenden Sie bei Bedarf Custom DB, um die richtige Datei auszuwählen |
| Konto nach V1-Import nicht verfügbar | Altes refresh_token ist abgelaufen | Löschen Sie das Konto und fügen Sie es erneut mit OAuth/neuem refresh_token hinzu (basierend auf Fehlermeldung) |
| auto_sync zu häufig | `sync_interval` sehr klein eingestellt, häufiges Scannen der DB | Betrachten Sie es als "Status-Folge", stellen Sie das Intervall auf eine für Sie akzeptable Frequenz |

## Zusammenfassung

- JSON-Export/-Import ist die kontrollierteste Migrationsmethode: Die Backup-Datei enthält nur `email + refresh_token`
- DB-Import eignet sich für "nach aktuell angemeldetem Konto von Antigravity/IDE" und setzt es automatisch als aktuelles Konto des Managers
- V1-Import scannt `~/.antigravity-agent` und ist mit mehreren alten Formaten kompatibel
- auto_sync vergleicht refresh_token; wenn identisch, wird übersprungen, nicht wiederholt importiert

## Vorschau auf die nächste Lektion

> In der nächsten Lektion setzen wir den "migrierten Konto-Pool" tatsächlich ein: **[Lokalen Reverse-Proxy starten und ersten Client anschließen (/healthz + SDK-Konfiguration)](../proxy-and-first-client/)**.
>
> Sie werden lernen:
> - Wie man Proxy startet/stopt und mit `/healthz` eine minimale Verifizierung durchführt
> - Wie man Base URL in SDK/Clients konfiguriert

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Erweitern, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|

</details>

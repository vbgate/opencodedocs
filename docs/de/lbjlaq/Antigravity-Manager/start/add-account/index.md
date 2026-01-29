---
title: "Konto hinzufügen: OAuth und Refresh Token-Dualkanal | Antigravity Tools"
sidebarTitle: "Google-Konto hinzufügen"
subtitle: "Konto hinzufügen: OAuth/Refresh Token-Dualkanal und Best Practices"
description: "Lernen Sie zwei Methoden zum Hinzufügen von Konten zu Antigravity Tools kennen. OAuth-Ein-Klick-Autorisierung oder manueller Refresh-Token-Hinzufügen mit Batch-Import, Fehlerbehandlung und Konto-Pool-Verifizierung."
tags:
  - "Kontoverwaltung"
  - "OAuth"
  - "refresh_token"
  - "Google"
  - "Best Practices"
prerequisite:
  - "start-getting-started"
duration: 15
order: 4
---

# Konto hinzufügen: OAuth/Refresh Token-Dualkanal und Best Practices

In Antigravity Tools bedeutet "Konto hinzufügen", den `refresh_token` eines Google-Kontos in den lokalen Konto-Pool zu schreiben, damit nachfolgende Reverse-Proxy-Anfragen rotierend verwendet werden können. Sie können über OAuth-Ein-Klick-Autorisierung gehen oder den `refresh_token` direkt einfügen, um manuell hinzuzufügen.

## Was Sie nach diesem Kurs können

- Google-Konten über OAuth oder Refresh Token zum Antigravity Tools-Konto-Pool hinzufügen
- Autorisierungslinks kopieren/manuell öffnen und nach erfolgreichem Callback automatisch abschließen
- Wissen, wie man mit Problemen wie fehlendem `refresh_token` oder nicht verbundenem `localhost`-Callback umgeht

## Ihr aktuelles Problem

- Sie haben auf "OAuth-Autorisierung" geklickt, aber es wird immer geladen, oder der Browser zeigt `localhost refused to connect` an
- Autorisierung war erfolgreich, aber es wird "Kein Refresh Token erhalten" angezeigt
- Sie haben nur einen `refresh_token` und wissen nicht, wie Sie ihn gleichzeitig im Batch importieren können

## Wann Sie diese Methode verwenden

- Sie möchten Konten auf die stabilste Weise hinzufügen (priorisieren Sie OAuth)
- Ihnen liegt mehr an Migrations- und Backupfähigkeit (Refresh Token eignet sich besser als "Konto-Pool-Asset")
- Sie müssen viele Konten hinzufügen und möchten `refresh_token` im Batch importieren (unterstützt Extraktion aus Text/JSON)

## 🎒 Vorbereitungen

- Sie haben Antigravity Tools Desktop installiert und können es öffnen
- Sie wissen, wo sich der Einstieg befindet: Linkes Navigationsmenü → `Accounts`-Seite (Routing siehe `source/lbjlaq/Antigravity-Manager/src/App.tsx`)

::: info Zwei Schlüsselbegriffe in dieser Lektion
**OAuth**: Ein Prozess, bei dem "in den Browser zum Anmelden und Autorisieren gesprungen" wird. Antigravity Tools startet lokal eine temporäre Callback-Adresse (`http://localhost/127.0.0.1/[::1]:<port>/oauth-callback`, automatisch je nach IPv4/IPv6-Listenstatus ausgewählt), wartet darauf, dass der Browser mit einem `code` zurückkommt, und tauscht ihn dann gegen token. (Implementierung siehe `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/oauth_server.rs`)

**refresh_token**: Ein "langfristig verwendbares Token zum Aktualisieren von access_token". Bei diesem Projekt wird beim Hinzufügen von Konten zuerst damit ein access_token eingeholt, dann die echte E-Mail-Adresse von Google abgerufen und die im Frontend eingegebene E-Mail ignoriert. (Implementierung siehe `source/lbjlaq/Antigravity-Manager/src-tauri/src/commands/mod.rs`)
:::

## Kernkonzept

"Konto hinzufügen" in Antigravity Tools dient letztendlich dazu, einen verfügbaren `refresh_token` zu erhalten und die Kontoinformationen in den lokalen Konto-Pool zu schreiben.

- **OAuth-Kanal**: Die Anwendung generiert den Autorisierungslink für Sie und überwacht den lokalen Callback; nach Abschluss der Autorisierung wird automatisch das Token getauscht und das Konto gespeichert (siehe `prepare_oauth_url`, `start_oauth_login`, `complete_oauth_login`)
- **Refresh Token-Kanal**: Sie fügen den `refresh_token` direkt ein, die Anwendung verwendet ihn zum Aktualisieren des access_token, ruft die echte E-Mail-Adresse von Google ab und speichert sie (siehe `add_account`)

## Machen Sie mit

### Schritt 1: Öffnen Sie das Dialogfeld "Konto hinzufügen"

**Warum**
Alle Hinzufügungs-Einstiegspunkte sind auf der `Accounts`-Seite zentralisiert.

Vorgehensweise: Gehen Sie zur `Accounts`-Seite und klicken Sie auf die Schaltfläche **Add Account** rechts (Komponente: `AddAccountDialog`).

**Was Sie sehen sollten**: Ein Dialogfeld mit 3 Registerkarten öffnet sich: `OAuth` / `Refresh Token` / `Import` (siehe `source/lbjlaq/Antigravity-Manager/src/components/accounts/AddAccountDialog.tsx`).

### Schritt 2: Bevorzugen Sie OAuth-Ein-Klick-Autorisierung (empfohlen)

**Warum**
Dies ist der vom Produkt standardmäßig empfohlene Pfad: Die Anwendung generiert selbst den Autorisierungslink, öffnet automatisch den Browser und speichert automatisch nach dem Callback.

1. Wechseln Sie zur Registerkarte `OAuth`.
2. Kopieren Sie zunächst den Autorisierungslink: Nach dem Öffnen des Dialogfelds wird automatisch `prepare_oauth_url` aufgerufen, um die URL vorzuzugenerieren (Frontend-Aufruf siehe `AddAccountDialog.tsx:111-125`; Backend-Generierung und -Überwachung siehe `oauth_server.rs`).
3. Klicken Sie auf **Start OAuth** (entspricht Frontend `startOAuthLogin()` / Backend `start_oauth_login`), damit die Anwendung den Standardbrowser öffnet und auf den Callback wartet.

**Was Sie sehen sollten**:
- Ein kopierbarer Autorisierungslink erscheint im Dialogfeld (Ereignisname: `oauth-url-generated`)
- Der Browser öffnet die Google-Autorisierungsseite; nach der Autorisierung wird er zu einer lokalen Adresse weitergeleitet und zeigt "Authorization Successful!" an (`oauth_success_html()`)

### Schritt 3: Wenn OAuth nicht automatisch abgeschlossen wird, verwenden Sie "OAuth abschließen" zum manuellen Abschluss

**Warum**
Der OAuth-Prozess besteht aus zwei Phasen: Browser-Autorisierung erhält `code`, dann tauscht die Anwendung den `code` gegen token. Selbst wenn Sie nicht auf "Start OAuth" geklickt haben, solange Sie den Autorisierungslink manuell geöffnet und den Callback abgeschlossen haben, wird das Dialogfeld versuchen, automatisch abzuschließen; wenn dies nicht gelingt, können Sie einmal manuell klicken.

1. Wenn Sie "den Link in Ihren eigenen Browser kopiert und geöffnet" haben (statt den Standardbrowser), empfängt die Anwendung nach dem Autorisierungs-Callback das Ereignis `oauth-callback-received` und ruft automatisch `completeOAuthLogin()` auf (siehe `source/lbjlaq/Antigravity-Manager/src/components/accounts/AddAccountDialog.tsx:67-109`).
2. Wenn Sie den automatischen Abschluss nicht sehen, klicken Sie auf **Finish OAuth** im Dialogfeld (entspricht Backend `complete_oauth_login`).

**Was Sie sehen sollten**: Das Dialogfeld zeigt Erfolg an und schließt automatisch; ein neues Konto erscheint in der `Accounts`-Liste.

::: tip Tipp: Bei Callback-Verbindungsproblemen zuerst Link kopieren
Das Backend versucht, gleichzeitig IPv6 `::1` und IPv4 `127.0.0.1` zu überwachen und wählt je nach Überwachungsstatus `localhost/127.0.0.1/[::1]` als Callback-Adresse, hauptsächlich um Verbindungsfehler zu vermeiden, die entstehen, wenn "Browser localhost zu IPv6 auflöst". (siehe `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/oauth_server.rs:53-113`)
:::

### Schritt 4: Konto manuell mit Refresh Token hinzufügen (unterstützt Batch)

**Warum**
Wenn Sie keinen `refresh_token` erhalten können (oder Sie bevorzugen "migrierbare Assets"), ist das direkte Hinzufügen mit Refresh Token kontrollierbarer.

1. Wechseln Sie zur Registerkarte `Refresh Token`.
2. Fügen Sie den `refresh_token` in das Textfeld ein.

Unterstützte Eingabeformate (Frontend analysiert und fügt im Batch hinzu):

| Eingabetyp | Beispiel | Analyse-Logik |
| --- | --- | --- |
| Reiner Token-Text | `1//abc...` | Regex-Extraktion: `/1\/\/[a-zA-Z0-9_\-]+/g` (siehe `AddAccountDialog.tsx:213-220`) |
| Eingebettet in langen Text | Logs/Exporttext enthalten mehrere `1//...` | Regex-Batch-Extraktion mit Deduplizierung (siehe `AddAccountDialog.tsx:213-224`) |
| JSON-Array | `[{"refresh_token":"1//..."}]` | Array-Parser und `item.refresh_token` extrahieren (siehe `AddAccountDialog.tsx:198-207`) |

Nach dem Klicken auf **Confirm** ruft das Dialogfeld nacheinander `onAdd("", token)` pro Token auf (siehe `AddAccountDialog.tsx:231-248`), landet schließlich im Backend `add_account`.

**Was Sie sehen sollten**:
- Das Dialogfeld zeigt den Batch-Fortschritt (z. B. `1/5`)
- Nach dem Erfolg erscheinen neue Konten in der `Accounts`-Liste

### Schritt 5: Bestätigen Sie "Konto-Pool ist verfügbar"

**Warum**
Erfolgreiches Hinzufügen bedeutet nicht "sofort stabil nutzbar". Das Backend löst nach dem Hinzufügen automatisch ein "Refresh-Quota" aus und versucht während des Proxy-Betriebs, den Token-Pool neu zu laden, damit die Änderung sofort wirksam wird.

Sie können es mit den folgenden 2 Signalen bestätigen:

1. Das Konto erscheint in der Liste und zeigt die E-Mail-Adresse (die E-Mail stammt vom Backend `get_user_info`, nicht von Ihrer eingegebenen E-Mail).
2. Die Kontingent-/Abonnement-Informationen des Kontos beginnen mit der Aktualisierung (das Backend ruft automatisch `internal_refresh_account_quota` auf).

**Was Sie sehen sollten**: Nach dem Hinzufügen müssen Sie nicht manuell aktualisieren, das Konto beginnt mit dem Anzeigen von Kontingentinformationen (Erfolg ist am tatsächlichen Interface-Display zu erkennen).

## Kontrollpunkte ✅

- Die E-Mail-Adresse des neu hinzugefügten Kontos ist in der Kontenliste sichtbar
- Es verbleibt kein "loading"-Status länger als akzeptabel (OAuth-Callback-Completing sollte schnell sein)
- Wenn Sie Proxy ausführen, können neue Konten schnell an der Planung teilnehmen (das Backend versucht, neu zu laden)

## Warnungen vor Stolpersteinen

### 1) OAuth zeigt "Kein Refresh Token erhalten"

Das Backend prüft explizit in `start_oauth_login/complete_oauth_login`, ob `refresh_token` vorhanden ist; wenn nicht, wird eine Fehlermeldung mit Lösung zurückgegeben (siehe `source/lbjlaq/Antigravity-Manager/src-tauri/src/commands/mod.rs:45-56`).

Behandlung laut Quellcode-Hinweis:

1. Öffnen Sie `https://myaccount.google.com/permissions`
2. Widerrufen Sie die Zugriffsberechtigung von **Antigravity Tools**
3. Kehren Sie zur Anwendung zurück und durchlaufen Sie OAuth erneut

> Sie können auch direkt zum Refresh-Token-Kanal dieser Lektion wechseln.

### 2) Browser zeigt `localhost refused to connect` an

OAuth-Callback erfordert, dass der Browser die lokale Callback-Adresse anfordert. Um die Ausfallrate zu senken, wird das Backend:

- Versuchen, gleichzeitig `127.0.0.1` und `::1` zu überwachen
- `localhost` nur verwenden, wenn beide verfügbar sind, andernfalls zwingend `127.0.0.1` oder `[::1]`

Entsprechende Implementierung siehe `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/oauth_server.rs:53-113`.

### 3) Wechseln zu anderen Registerkarten bricht OAuth-Vorbereitung ab

Wenn das Dialogfeld von `OAuth` zu einer anderen Registerkarte wechselt, ruft das Frontend `cancelOAuthLogin()` auf und leert die URL (siehe `AddAccountDialog.tsx:127-136`).

Wenn Sie gerade autorisieren, wechseln Sie nicht eilig die Registerkarte.

### 4) Korrekte/Falsche Beispiele für Refresh Token

| Beispiel | Wird erkannt | Grund |
| --- | --- | --- |
| `1//0gAbC...` | ✓ | Entspricht `1//`-Prefix-Regel (siehe `AddAccountDialog.tsx:215-219`) |
| `ya29.a0...` | ✗ | Entspricht nicht der Frontend-Extraktionsregel, wird als ungültige Eingabe behandelt |

## Zusammenfassung der Lektion

- OAuth: Geeignet für "schnell", unterstützt auch Kopieren des Links zu Ihrem bevorzugten Browser und automatischen/manuellen Abschluss
- Refresh Token: Geeignet für "stabil" und "migrierbar", unterstützt Batch-Extraktion von `1//...` aus Text/JSON
- Wenn Sie keinen `refresh_token` erhalten können, widerrufen Sie die Berechtigung laut Fehlerhinweis und wiederholen Sie, oder wechseln Sie direkt zum Refresh-Token-Kanal

## Vorschau auf die nächste Lektion

In der nächsten Lektion machen wir etwas Solideres: den Konto-Pool zu einem "migrierbaren Asset" zu machen.

> Gehen Sie zu **[Konto-Backup und Migration: Import/Export, V1/DB-Hot-Migration](../backup-migrate/)**.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie zum Ausklappen, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Accounts-Seite Hinzufügen-Dialog montieren | [`src/pages/Accounts.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Accounts.tsx#L267-L731) | 267-731 |
| OAuth-URL-Vorgenerierung + Callback-Ereignis automatischer Abschluss | [`src/components/accounts/AddAccountDialog.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/accounts/AddAccountDialog.tsx#L49-L125) | 49-125 |
| OAuth-Callback-Ereignis löst `completeOAuthLogin()` aus | [`src/components/accounts/AddAccountDialog.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/accounts/AddAccountDialog.tsx#L67-L109) | 67-109 |
| Refresh Token-Batch-Analyse und Deduplizierung | [`src/components/accounts/AddAccountDialog.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/accounts/AddAccountDialog.tsx#L185-L268) | 185-268 |
| Frontend ruft Tauri-Commands auf (add/OAuth/cancel) | [`src/services/accountService.ts`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/services/accountService.ts#L5-L91) | 5-91 |
| Backend add_account: E-Mail ignorieren, refresh_token verwenden, echte E-Mail abrufen und speichern | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L19-L60) | 19-60 |
| Backend OAuth: refresh_token-Fehlprüfung und Berechtigung-Widerrufen-Lösung geben | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L38-L79) | 38-79 |
| OAuth-Callback-Server: Gleichzeitige Überwachung von IPv4/IPv6 und Auswahl von redirect_uri | [`src-tauri/src/modules/oauth_server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/oauth_server.rs#L43-L113) | 43-113 |
| OAuth-Callback analysiert `code` und gibt `oauth-callback-received` aus | [`src-tauri/src/modules/oauth_server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/oauth_server.rs#L140-L180) | 140-180 |

**Wichtige Ereignisnamen**:
- `oauth-url-generated`: Backend sendet OAuth-URL an Frontend nach Generierung (siehe `oauth_server.rs:250-252`)
- `oauth-callback-received`: Backend benachrichtigt Frontend nach Empfang von Callback und Analyse von code (siehe `oauth_server.rs:177-180` / `oauth_server.rs:232-235`)

**Wichtige Commands**:
- `prepare_oauth_url`: Vor-Generieren von Autorisierungslink und Start der Callback-Überwachung (siehe `src-tauri/src/commands/mod.rs:469-473`)
- `start_oauth_login`: Standardbrowser öffnen und auf Callback warten (siehe `src-tauri/src/commands/mod.rs:339-401`)
- `complete_oauth_login`: Browser nicht öffnen, nur auf Callback warten und Token-Austausch abschließen (siehe `src-tauri/src/commands/mod.rs:405-467`)
- `add_account`: Konto mit refresh_token speichern (siehe `src-tauri/src/commands/mod.rs:19-60`)

</details>

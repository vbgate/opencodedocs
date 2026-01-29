---
title: "Quota-Management: Quota Protection und Smart Warmup | Antigravity-Manager"
subtitle: "Quota-Management: Quota Protection und Smart Warmup | Antigravity-Manager"
sidebarTitle: "Schützen Sie Ihre Modell-Quoten"
description: "Lernen Sie das Quota-Management von Antigravity-Manager kennen. Verwenden Sie Quota Protection, um Modelle schwellenwertbasiert zu schützen, Smart Warmup für automatisches Warmup, mit geplanter Überprüfung und Cooldown-Steuerung."
tags:
  - "quota"
  - "warmup"
  - "accounts"
  - "proxy"
prerequisite:
  - "start-add-account"
  - "start-proxy-and-first-client"
order: 5
---

# Quota-Management: Kombinierte Strategie mit Quota Protection + Smart Warmup

Sie nutzen Antigravity Tools bereits stabil für Ihre Proxies, aber das größte Problem ist eines: Die Quoten Ihres Hauptmodells werden "leise aufgebraucht", und wenn Sie es wirklich benötigen, stellen Sie fest, dass sie bereits zu niedrig sind, um effektiv zu arbeiten.

Diese Lektion konzentriert sich auf das **Quota-Management**: Verwenden Sie Quota Protection, um wichtige Modelle zu erhalten; nutzen Sie Smart Warmup, um ein "leichtes Warmup" durchzuführen, wenn die Quoten wieder voll sind, um temporäre Ausfälle zu reduzieren.

## Was ist Quota-Management?

**Quota-Management** bezeichnet in Antigravity Tools die Verwendung von zwei verknüpften Mechanismen zur Steuerung "wie Quoten ausgegeben werden": Wenn die verbleibende Quote eines Modells unter einen Schwellenwert fällt, fügt Quota Protection das Modell zu den `protected_models` des Kontos hinzu; Anfragen an dieses Modell werden bevorzugt umgangen. Wenn die Quote wieder 100% erreicht, löst Smart Warmup eine extrem geringe Traffic-Warmup-Anfrage aus und verwendet eine lokale Verlaufsdatei für einen 4-Stunden-Cooldown.

## Was Sie nach diesem Kurs können

- Aktivieren Sie Quota Protection, damit Konten mit niedrigen Quoten automatisch "ausweichen" und hochwertige Modelle für kritische Anfragen reservieren
- Aktivieren Sie Smart Warmup, damit automatisch ein Warmup durchgeführt wird, wenn die Quoten wieder voll sind (und wissen, wie der 4-Stunden-Cooldown die Auslösefrequenz beeinflusst)
- Verstehen Sie, wo die drei Felder `quota_protection` / `scheduled_warmup` / `protected_models` wirksam werden
- Wissen, welche Modellnamen in "Schutzgruppen" normalisiert werden (und welche nicht)

## Ihr aktuelles Problem

- Sie denken, Sie "rotieren Konten", verbrauchen aber tatsächlich kontinuierlich die gleiche Kategorie hochwertiger Modelle
- Sie stellen erst fest, dass die Quoten niedrig sind, wenn es zu spät ist – manchmal verbraucht Claude Code/der Client im Hintergrund Quoten durch Warmup
- Sie haben Warmup aktiviert, wissen aber nicht, wann es genau ausgelöst wird, ob es einen Cooldown gibt und ob es die Quoten beeinflusst

## Wann Sie diese Methode verwenden

- Sie haben mehrere Konten-Pools und möchten sicherstellen, dass kritische Modelle in "wichtigen Momenten" noch Reserven haben
- Sie möchten die Quote-Wiederherstellungszeit nicht manuell überwachen; das System soll automatisch eine "leichte Verifikation nach der Wiederherstellung" durchführen

## 🎒 Vorbereitungen

::: warning Voraussetzungen
In dieser Lektion wird vorausgesetzt, dass Sie bereits Folgendes können:

- Auf der **Accounts**-Seite die Kontenliste sehen und Quoten manuell aktualisieren können
- Bereits einen lokalen Reverse-Proxy gestartet haben (mindestens `/healthz` erreichbar)

Wenn dies noch nicht funktioniert, lesen Sie zuerst **[Lokalen Reverse-Proxy starten und ersten Client einbinden](/de/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)**.
:::

Außerdem schreibt Smart Warmup eine lokale Verlaufsdatei `warmup_history.json`. Diese befindet sich im Datenverzeichnis; Position und Backup-Methoden des Datenverzeichnisms finden Sie unter **[Erster Start: Datenverzeichnis, Protokolle, Tray und automatischer Start](/de/lbjlaq/Antigravity-Manager/start/first-run-data/)**.

## Kernkonzept

Hinter dieser "kombinierten Strategie" steckt ein sehr einfaches Prinzip:

- Quota Protection sorgt für "keine weitere Verschwendung": Wenn ein Modell unter den Schwellenwert fällt, wird es als geschützt markiert; Anfragen an dieses Modell werden bevorzugt umgangen (auf Modell-Ebene, nicht pauschal Sperren von Konten).
- Smart Warmup sorgt für "Verifikation bei voller Quote": Wenn ein Modell wieder 100% erreicht, wird eine leichte Anfrage ausgelöst, um die Verfügbarkeit der Verbindung zu bestätigen; ein 4-Stunden-Cooldown verhindert wiederholte Störungen.

Die entsprechenden Konfigurationsfelder befinden sich im Frontend in `AppConfig`:

- `quota_protection.enabled / threshold_percentage / monitored_models` (siehe `src/types/config.ts`)
- `scheduled_warmup.enabled / monitored_models` (siehe `src/types/config.ts`)

Die eigentliche Logik, die entscheidet, "ob das Konto bei Anfragen an dieses Modell übersprungen werden soll", befindet sich im Backend in TokenManager:

- Das Feld `protected_models` in der Kontodatei wird in `get_token(..., target_model)` bei der Filterung berücksichtigt (siehe `src-tauri/src/proxy/token_manager.rs`)
- `target_model` wird zuerst normalisiert (`normalize_to_standard_id`), sodass Varianten wie `claude-sonnet-4-5-thinking` in dieselbe "Schutzgruppe" zusammengefasst werden (siehe `src-tauri/src/proxy/common/model_mapping.rs`)

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Proxy Monitor: Anfrageprotokolle, Filter, Detail-Rekonstruktion und Export](/de/lbjlaq/Antigravity-Manager/advanced/monitoring/)**, um die Blackbox-Aufrufe in eine rekonstruierbare Beweiskette zu verwandeln.

## Machen Sie mit

### Schritt 1: Bringen Sie die Quoten zuerst "auf den aktuellen Stand"

**Warum**
Quota Protection basiert auf dem `quota.models[].percentage` des Kontos. Ohne aktualisierte Quoten kann die Schutzlogik nichts für Sie tun.

Vorgehensweise: Öffnen Sie die **Accounts**-Seite und klicken Sie auf die Aktualisierungsschaltfläche in der Symbolleiste (entweder für ein einzelnes Konto oder alle).

**Was Sie sehen sollten**: In der Kontozeile erscheinen die Quoten-Prozentsätze der einzelnen Modelle (z. B. 0-100) und die Reset-Zeit.

### Schritt 2: Aktivieren Sie in den Einstellungen Smart Warmup (optional, aber empfohlen)

**Warum**
Das Ziel von Smart Warmup ist nicht "Quoten sparen", sondern "Verbindung bei voller Quote selbst prüfen". Es wird nur ausgelöst, wenn die Modellquote 100% erreicht, und hat einen 4-Stunden-Cooldown.

Vorgehensweise: Öffnen Sie **Settings**, wechseln Sie zum Bereich für Kontoeinstellungen, aktivieren Sie den **Smart Warmup**-Schalter und wählen Sie die Modelle aus, die Sie überwachen möchten.

Vergessen Sie nicht, die Einstellungen zu speichern.

**Was Sie sehen sollten**: Nach dem Aufklappen von Smart Warmup erscheint eine Modellliste; mindestens ein Modell muss ausgewählt bleiben.

### Schritt 3: Aktivieren Sie Quota Protection und legen Sie Schwellenwert und überwachte Modelle fest

**Warum**
Quota Protection ist der Kern der "Reservenhaltung": Wenn der Quoten-Prozentsatz der überwachten Modelle `<= threshold_percentage` ist, wird das Modell in die `protected_models`-Felder der Kontodatei geschrieben; spätere Anfragen an dieses Modell bevorzugen das Umgehen solcher Konten.

Vorgehensweise: Aktivieren Sie in **Settings** die Option **Quota Protection**.

1. Legen Sie den Schwellenwert fest (`1-99`)
2. Wählen Sie die Modelle aus, die Sie überwachen möchten (mindestens eines)

::: tip Ein sehr nützlicher Startwert
Wenn Sie sich nicht festlegen möchten, können Sie beim Standard `threshold_percentage=10` beginnen (siehe `src/pages/Settings.tsx`).
:::

**Was Sie sehen sollten**: Mindestens ein Modell muss in der Quota Protection-Auswahl ausgewählt bleiben (die UI verhindert, dass Sie auch das letzte abwählen).

### Schritt 4: Bestätigen Sie, dass die "Schutzgruppen-Normalisierung" Sie nicht vor Probleme stellt

**Warum**
Bei der Quota-Schutzentscheidung normalisiert TokenManager zuerst `target_model` zu einer Standard-ID (`normalize_to_standard_id`). Beispielsweise wird `claude-sonnet-4-5-thinking` zu `claude-sonnet-4-5` normalisiert.

Das bedeutet:

- Sie wählen `claude-sonnet-4-5` in Quota Protection aus
- Wenn Sie tatsächlich `claude-sonnet-4-5-thinking` anfordern

wird dennoch der Schutz ausgelöst (da sie zur gleichen Gruppe gehören).

**Was Sie sehen sollten**: Wenn die `protected_models` eines Kontos `claude-sonnet-4-5` enthalten, werden Anfragen an `claude-sonnet-4-5-thinking` dieses Konto bevorzugt umgehen.

### Schritt 5: Verwenden Sie "manuelles Warmup", um sofort zu verifizieren

**Warum**
Der Scan-Zyklus für geplantes Smart Warmup beträgt 10 Minuten (siehe `src-tauri/src/modules/scheduler.rs`). Wenn Sie die Verbindung sofort verifizieren möchten, ist manuelles Warmup direkter.

Vorgehensweise: Öffnen Sie die **Accounts**-Seite und klicken Sie auf die "Warmup"-Schaltfläche in der Symbolleiste:

- Ohne Kontoauswahl: Löst vollständiges Warmup aus (ruft `warm_up_all_accounts` auf)
- Mit ausgewählten Konten: Löst Warmup für die ausgewählten Konten einzeln aus (ruft `warm_up_account` auf)

**Was Sie sehen sollten**: Ein Toast erscheint, dessen Inhalt aus dem vom Backend zurückgegebenen String stammt (z. B. "Warmup task triggered ...").

## Kontrollpunkte ✅

- Sie können auf der Accounts-Seite den Quoten-Prozentsatz der einzelnen Modelle jedes Kontos sehen (beweist, dass die Quoten-Datenpipeline funktioniert)
- Sie können in Settings Quota Protection / Smart Warmup aktivieren und die Konfiguration erfolgreich speichern
- Sie verstehen, dass `protected_models` eine "Modell-Ebene"-Beschränkung ist: Ein Konto kann möglicherweise nur für bestimmte Modelle umgangen werden
- Sie wissen, dass Warmup einen 4-Stunden-Cooldown hat: Kurzfristig wiederholtes Klicken auf Warmup kann möglicherweise Hinweise wie "skipped/cooldown" anzeigen

## Warnungen vor Stolpersteinen

### 1) Sie haben Quota Protection aktiviert, aber es wirkt nie

Der häufigste Grund ist: Das Konto hat keine `quota`-Daten. Die Schutzlogik muss im Backend zuerst `quota.models[]` lesen, um den Schwellenwert beurteilen zu können (siehe `src-tauri/src/proxy/token_manager.rs`).

Sie können zu **Schritt 1** zurückkehren und die Quoten zuerst aktualisieren.

### 2) Warum werden nur wenige Modelle als "Schutzgruppe" behandelt?

Die Normalisierung von `target_model` durch TokenManager erfolgt "auf Whitelist-Basis": Nur explizit aufgelistete Modellnamen werden einer Standard-ID zugeordnet (siehe `src-tauri/src/proxy/common/model_mapping.rs`).

Die Logik nach der Normalisierung lautet: Der normalisierte Name (Standard-ID oder ursprünglicher Modellname) wird mit dem `protected_models`-Feld des Kontos abgeglichen. Wenn die Übereinstimmung erfolgreich ist, wird das Konto übersprungen (siehe `src-tauri/src/proxy/token_manager.rs:555-560, 716-719`). Das bedeutet:

- Modelle in der Whitelist (wie `claude-sonnet-4-5-thinking`) werden zur Standard-ID (`claude-sonnet-4-5`) normalisiert und dann geprüft, ob sie in `protected_models` enthalten sind
- Wenn die Normalisierung für Modelle außerhalb der Whitelist fehlschlägt, wird auf den ursprünglichen Modellnamen zurückgegriffen, der weiterhin mit `protected_models` abgeglichen wird

Mit anderen Worten: Die Quota-Schutzentscheidung gilt für "alle Modellnamen", nur dass Modelle in der Whitelist zuerst normalisiert werden.

### 3) Warum benötigen manuelles/geplantes Warmup, dass der Proxy läuft?

Die Warmup-Anfrage erreicht letztendlich den internen Endpunkt des lokalen Proxies: `POST /internal/warmup` (siehe Routing in `src-tauri/src/proxy/server.rs` und Implementierung in `src-tauri/src/proxy/handlers/warmup.rs`). Wenn Sie den Proxy-Dienst nicht gestartet haben, schlägt Warmup fehl.

Außerdem stammt der Port, den Warmup aufruft, aus der Konfiguration: `proxy.port` (wenn das Lesen der Konfiguration fehlschlägt, wird auf `8045` zurückgegriffen, siehe `src-tauri/src/modules/quota.rs`).

## Zusammenfassung der Lektion

- Quota Protection sorgt für "Verlustbegrenzung": Unter dem Schwellenwert wird das Modell in `protected_models` geschrieben; Anfragen an dieses Modell werden bevorzugt umgangen
- Smart Warmup sorgt für "Selbstprüfung bei voller Quote": Wird nur bei 100% ausgelöst, alle 10 Minuten gescannt, 4-Stunden-Cooldown
- Beide hängen von der "Quotenaktualisierungs"-Pipeline ab: Erst mit `quota.models[]` hat das Management eine Grundlage

## Vorschau auf die nächste Lektion

Quota-Management löst das Problem "wie man stabiler ausgibt". In der nächsten Lektion wird empfohlen, weiter Proxy Monitor zu lesen, um Anfrageprotokolle, Konto-Treffer und Modell-Zuordnungen in eine wiederholbare Beweiskette zu verwandeln.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie zum Ausklappen, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
| Quota Protection UI (Schwellenwert, Modellauswahl, mindestens 1 beibehalten) | [`src/components/settings/QuotaProtection.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/settings/QuotaProtection.tsx#L13-L168) | 13-168 |
| Smart Warmup UI (Standardauswahl nach Aktivierung, mindestens 1 beibehalten) | [`src/components/settings/SmartWarmup.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/settings/SmartWarmup.tsx#L14-L120) | 14-120 |
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

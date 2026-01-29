---
title: "Invalid Grant-Fehlerbehebung: Kontosperrungswiederherstellung | Antigravity-Manager"
sidebarTitle: "Wie man einen gesperrten Konto wiederherstellt"
subtitle: "invalid_grant und automatische Kontosperrung: Warum es passiert und wie man wiederherstellt"
description: "Lernen Sie die Bedeutung des invalid_grant-Fehlers und die automatische Verarbeitungslogik. Bestätigen Sie die Unwirksamkeit des refresh_token, lösen Sie durch erneutes OAuth-Hinzufügen des Kontos die automatische Entsperrung aus und verifizieren Sie, dass die Wiederherstellung für den Proxy wirksam ist."
tags:
  - "FAQ"
  - "Fehlerbehebung"
  - "OAuth"
  - "Kontoverwaltung"
  - "invalid_grant"
prerequisite:
  - "start-add-account"
  - "start-first-run-data"
  - "advanced-scheduling"
order: 1
---
# invalid_grant und automatische Kontosperrung: Warum es passiert und wie man wiederherstellt

## Was Sie nach diesem Lernen können

- Wenn Sie `invalid_grant` sehen, wissen Sie, zu welcher Art von refresh_token-Problem es gehört
- Verstehen Sie, warum ein Konto plötzlich nicht mehr verfügbar ist: Unter welchen Umständen wird es automatisch gesperrt und wie das System nach der Sperrung damit umgeht
- Setzen Sie das Konto auf dem kürzesten Weg wiederher und bestätigen Sie, dass die Wiederherstellung für den laufenden Proxy wirksam ist

## Ihre Symptome

- Plötzliches Auftreten von Fehlern beim Aufrufen des lokalen Proxy mit der Fehlermeldung `invalid_grant`
- Das Konto ist immer noch in der Accounts-Liste vorhanden, aber der Proxy überspringt es immer (oder Sie haben das Gefühl, dass es "nie mehr verwendet wird")
- Wenn Sie nur wenige Konten haben, verschlechtert sich die allgemeine Verfügbarkeit deutlich nach einmaligem Auftreten von `invalid_grant`

## Was ist invalid_grant?

**invalid_grant** ist ein Fehler, den Google OAuth beim Aktualisieren des `access_token` zurückgibt. Für Antigravity Tools bedeutet dies, dass der `refresh_token` eines Kontos wahrscheinlich widerrufen oder abgelaufen ist. Das weitere Wiederholen führt nur zu wiederholten Fehlschlägen, daher markiert das System das Konto als nicht verfügbar und entfernt es aus dem Proxy-Pool.

## Grundidee: Das System "überspringt nicht temporär", sondern "sperrt dauerhaft"

Wenn der Proxy erkennt, dass die Fehlerzeichenfolge beim Aktualisieren des Token `invalid_grant` enthält, werden zwei Schritte ausgeführt:

1. **Das Konto als disabled markieren** (persistieren in der Konto-JSON-Datei)
2. **Das Konto aus dem in-Memory Token-Pool entfernen** (um zu vermeiden, dass wiederholt derselbe fehlerhafte Konto ausgewählt wird)

Dies ist der Grund, warum Sie sehen: "Das Konto ist noch da, aber der Proxy verwendet es nicht mehr."

::: info disabled vs proxy_disabled

- `disabled=true`: Das Konto ist "dauerhaft gesperrt" (der typische Grund ist `invalid_grant`). Beim Laden des Konto-Pools wird es direkt übersprungen.
- `proxy_disabled=true`: Das Konto ist nur "für den Proxy nicht verfügbar" (manuelle Sperrung/Batch-Operationen/Kontingentschutz-bezogene Logik), die Semantik ist anders.

Diese beiden Zustände werden beim Laden des Konto-Pools separat beurteilt: Zuerst wird `disabled` beurteilt, dann werden Kontingentschutz und `proxy_disabled` beurteilt.

:::

## Schritt-für-Schritt

### Schritt 1: Bestätigen Sie, ob invalid_grant durch refresh_token-Aktualisierung ausgelöst wurde

**Warum**: `invalid_grant` kann in mehreren Aufrufketten auftreten, aber die "automatische Sperrung" dieses Projekts wird nur ausgelöst, wenn das **Aktualisieren des access_token fehlschlägt**.

In den Proxy-Protokollen sehen Sie ähnliche Fehlerprotokolle (Schlüsselwörter sind `Token 刷新失败` + `invalid_grant`):

```text
Token 刷新失败 (<email>): <...invalid_grant...>，尝试下一个账号
Disabling account due to invalid_grant (<email>): refresh_token likely revoked/expired
```

**Was Sie sehen sollten**: Nachdem `invalid_grant` bei demselben Konto aufgetreten ist, wird es sehr schnell nicht mehr ausgewählt (weil es aus dem Token-Pool entfernt wurde).

### Schritt 2: Überprüfen Sie das disabled-Feld in der Kontodatei (optional, aber am genauesten)

**Warum**: Die automatische Sperrung wird "persistiert", daher können Sie nach Bestätigung des Dateiinhalts den Fehlschluss "es ist nur eine temporäre Rotation" ausschließen.

Die Kontodatei befindet sich im `accounts/`-Verzeichnis des Anwendungsdatenverzeichnisses (für den Speicherort des Datenverzeichnisses siehe **[Erster Start: Datenverzeichnis, Protokolle, Taskleiste und automatischer Start](../../start/first-run-data/)**). Wenn das Konto gesperrt ist, erscheinen diese drei Felder in der Datei:

```json
{
  "disabled": true,
  "disabled_at": 1700000000,
  "disabled_reason": "invalid_grant: ..."
}
```

**Was Sie sehen sollten**: `disabled` ist `true`, und `disabled_reason` enthält das Präfix `invalid_grant:`.

### Schritt 3: Wiederherstellen des Kontos (empfohlene Methode: dasselbe Konto erneut hinzufügen)

**Warum**: Die "Wiederherstellung" dieses Projekts besteht nicht darin, einen Schalter manuell im Proxy zu drücken, sondern die automatische Entsperrung durch "explizites Aktualisieren des Token" auszulösen.

Gehen Sie zur **Accounts**-Seite und fügen Sie das Konto mit Ihren neuen Anmeldeinformationen erneut hinzu (wählen Sie eine der beiden Methoden):

1. Durchlaufen Sie erneut den OAuth-Autorisierungsablauf (siehe **[Konto hinzufügen: OAuth/Refresh Token Dualkanal und Best Practices](../../start/add-account/)**)
2. Fügen Sie das Konto erneut mit einem neuen `refresh_token` hinzu (das System führt ein Upsert basierend auf der von Google zurückgegebenen E-Mail-Adresse durch)

Wenn das System erkennt, dass das `refresh_token` oder `access_token` dieses Upserts vom alten Wert abweicht und das Konto zuvor `disabled=true` war, werden automatisch folgende Felder gelöscht:

- `disabled`
- `disabled_reason`
- `disabled_at`

**Was Sie sehen sollten**: Das Konto befindet sich nicht mehr im disabled-Zustand, und (wenn der Proxy läuft) wird der Konto-Pool automatisch neu geladen, damit die Wiederherstellung sofort wirksam wird.

### Schritt 4: Überprüfen Sie, ob die Wiederherstellung für den Proxy wirksam ist

**Warum**: Wenn Sie nur ein Konto haben oder andere Konten auch nicht verfügbar sind, sollten Sie sofort sehen, dass "die Verfügbarkeit zurückgekehrt ist", nachdem Sie wiederhergestellt haben.

Überprüfungsmethode:

1. Initiieren Sie eine Anforderung, die eine Token-Aktualisierung auslöst (z. B. warten Sie, bis das Token kurz vor dem Ablauf steht, und fordern Sie dann an)
2. Beobachten Sie, dass die Protokolle nicht mehr den Hinweis "Überspringen von disabled-Konto" enthalten

**Was Sie sehen sollten**: Die Anforderungen können normal durchlaufen, und in den Protokollen erscheint nicht mehr der `invalid_grant`-Sperrungsprozess für dieses Konto.

## Häufige Fehler

### ❌ disabled als "temporäre Rotation" behandeln

Wenn Sie nur in der Benutzeroberfläche sehen, dass "das Konto noch da ist", können Sie leicht fälschlicherweise glauben, dass "das System es nur vorübergehend nicht verwendet". Aber `disabled=true` wird auf die Festplatte geschrieben und bleibt auch nach dem Neustart wirksam.

### ❌ Nur access_token ergänzen, refresh_token nicht aktualisieren

Der Auslösepunkt für `invalid_grant` ist der `refresh_token`, der beim Aktualisieren des `access_token` verwendet wird. Wenn Sie nur temporär ein noch verwendbares `access_token` erhalten, aber der `refresh_token` weiterhin ungültig ist, wird die Sperrung erneut ausgelöst.

## Kontrollpunkte ✅

- [ ] Sie können in den Protokollen bestätigen, dass `invalid_grant` durch das Fehlschlagen der refresh_token-Aktualisierung verursacht wurde
- [ ] Sie kennen den semantischen Unterschied zwischen `disabled` und `proxy_disabled`
- [ ] Sie können das Konto durch erneutes Hinzufügen des Kontos (OAuth oder refresh_token) wiederherstellen
- [ ] Sie können verifizieren, dass die Wiederherstellung für den laufenden Proxy wirksam ist

## Zusammenfassung dieser Lektion

- Wenn `invalid_grant` auftritt, markiert der Proxy das Konto **als disabled auf die Festplatte geschrieben** und entfernt es aus dem Token-Pool, um wiederholte Fehlschläge zu vermeiden
- Der Schlüssel zur Wiederherstellung ist "explizites Aktualisieren des Token" (erneutes OAuth oder erneutes Hinzufügen mit einem neuen refresh_token), das System löscht automatisch die `disabled_*`-Felder
- Die Konto-JSON im Datenverzeichnis ist die maßgebliche Quelle für den Status (Sperrung/Grund/Zeitpunkt sind alle darin enthalten)

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[401/Authentifizierungsfehler: auth_mode, Header-Kompatibilität und Client-Konfigurationsliste](../auth-401/)**.
>
> Sie lernen:
> - 401 ist normalerweise ein Problem auf welcher Ebene von "Modus/Key/Header"
> - Welcher Authentifizierungs-Header sollte von verschiedenen Clients mitgeführt werden
> - Wie man mit dem kürzesten Weg selbst prüft und behebt

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
| Persistentes Schreiben von `disabled/disabled_at/disabled_reason` und Entfernen aus dem Arbeitsspeicher | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L942-L969) | 942-969 |
| Abschneiden von `disabled_reason` (Vermeiden von Vergrößerung der Kontodatei) | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L1464-L1471) | 1464-1471 |
|--- | --- | ---|
|--- | --- | ---|

</details>

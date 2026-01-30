---
title: "Multi-Account-Einrichtung: Quota-Pooling und Load-Balancing | opencode-antigravity-auth"
sidebarTitle: "Multi-Account testen"
subtitle: "Multi-Account-Einrichtung: Quota-Pooling und Load-Balancing"
description: "Erfahren Sie, wie Sie mehrere Google-Accounts für Quota-Pooling und Load-Balancing konfigurieren. Beherrschen Sie das duale Quota-System, Account-Auswahlstrategien und PID-Offset-Konfiguration zur Maximierung der API-Quota-Auslastung."
tags:
  - "advanced"
  - "multi-account"
  - "load-balancing"
  - "quota-management"
prerequisite:
  - "start-quick-install"
  - "start-first-auth-login"
order: 4
---

# Multi-Account-Einrichtung: Quota-Pooling und Load-Balancing

## Was Sie lernen werden

- Mehrere Google-Accounts hinzufügen, um die Gesamtquota zu erhöhen
- Das duale Quota-System verstehen und Antigravity- sowie Gemini CLI-Quota-Pools effektiv nutzen
- Die passende Load-Balancing-Strategie basierend auf Account-Anzahl und Anwendungsfall wählen
- Häufige Probleme bei der Multi-Account-Konfiguration beheben

## Ihre aktuelle Herausforderung

Bei der Nutzung eines einzelnen Accounts stoßen Sie möglicherweise auf folgende Probleme:

- Häufige 429-Ratenbegrenzungsfehler, die Sie zum Warten auf Quota-Wiederherstellung zwingen
- Zu viele gleichzeitige Anfragen in Entwicklungs-/Testszenarien, die ein einzelner Account nicht bewältigen kann
- Nach Erschöpfung der Gemini 3 Pro- oder Claude Opus-Quota müssen Sie bis zum nächsten Tag warten
- Intensive Account-Konkurrenz beim parallelen Betrieb mehrerer OpenCode-Instanzen oder oh-my-opencode-Subagenten

## Wann Sie diese Lösung einsetzen sollten

Die Multi-Account-Konfiguration eignet sich für folgende Szenarien:

| Szenario | Empfohlene Account-Anzahl | Begründung |
| --- | --- | --- |
| Persönliche Entwicklung | 2-3 | Backup-Accounts zur Vermeidung von Unterbrechungen |
| Teamarbeit | 3-5 | Anfragenverteilung, weniger Konkurrenz |
| Hochfrequente API-Aufrufe | 5+ | Load-Balancing, maximaler Durchsatz |
| Parallele Agenten | 3+ mit PID-Offset | Separater Account pro Agent |

::: warning Voraussetzungen prüfen
Bevor Sie mit diesem Tutorial beginnen, stellen Sie sicher, dass Sie:
- ✅ Das opencode-antigravity-auth-Plugin installiert haben
- ✅ Die OAuth-Authentifizierung erfolgreich abgeschlossen und den ersten Account hinzugefügt haben
- ✅ Anfragen mit Antigravity-Modellen senden können

[Schnellinstallation](../../start/quick-install/) | [Erste Anmeldung](../../start/first-auth-login/)
:::

## Kernkonzept

Die Kernmechanismen der Multi-Account-Konfiguration:

1. **Quota-Pooling**: Jeder Google-Account hat eine unabhängige Quota; mehrere Accounts bilden zusammen einen größeren Gesamtpool
2. **Load-Balancing**: Das Plugin wählt automatisch verfügbare Accounts und wechselt bei Ratenbegrenzung zum nächsten Account
3. **Duales Quota-System** (nur Gemini): Jeder Account kann auf zwei unabhängige Quota-Pools zugreifen – Antigravity und Gemini CLI
4. **Intelligente Wiederherstellung**: Ratenbegrenzungs-Deduplizierung (2-Sekunden-Fenster) + exponentielles Backoff zur Vermeidung unnötiger Wiederholungen

**Quota-Berechnungsbeispiel**:

Angenommen, jeder Account hat eine Claude-Quota von 1000 Anfragen/Minute:

| Account-Anzahl | Theoretische Gesamtquota | Tatsächlich verfügbar (mit Caching) |
| --- | --- | --- |
| 1 | 1000/min | 1000/min |
| 3 | 3000/min | ~2500/min (sticky-Strategie) |
| 5 | 5000/min | ~4000/min (round-robin) |

> 💡 **Warum ist die verfügbare Quota bei der sticky-Strategie niedriger?**
>
> Die sticky-Strategie verwendet denselben Account bis zur Ratenbegrenzung, wodurch die Quota anderer Accounts ungenutzt bleibt. Der Vorteil ist jedoch, dass der Anthropic Prompt-Cache erhalten bleibt und die Antwortgeschwindigkeit verbessert wird.

## Schritt-für-Schritt-Anleitung

### Schritt 1: Zweiten Account hinzufügen

**Warum**
Nach dem Hinzufügen eines zweiten Accounts wechselt das Plugin automatisch zum Backup-Account, wenn der Hauptaccount eine Ratenbegrenzung erreicht, und vermeidet so fehlgeschlagene Anfragen.

**Vorgehensweise**

Führen Sie den OAuth-Anmeldebefehl aus:

```bash
opencode auth login
```

Wenn Sie bereits einen Account haben, sehen Sie folgende Meldung:

```
1 account(s) saved:
  1. user1@gmail.com

(a)dd new account(s) or (f)resh start? [a/f]:
```

Geben Sie `a` ein und drücken Sie Enter. Der Browser öffnet automatisch die Google-Autorisierungsseite.

**Erwartetes Ergebnis**:

1. Der Browser öffnet die Google OAuth-Autorisierungsseite
2. Wählen Sie Ihren zweiten Google-Account aus oder melden Sie sich an
3. Nach der Autorisierung zeigt das Terminal:

```
Account added successfully!

2 account(s) saved:
  1. user1@gmail.com
  2. user2@gmail.com
```

::: tip
Falls der Browser nicht automatisch öffnet, kopieren Sie die im Terminal angezeigte OAuth-URL und fügen Sie sie manuell in den Browser ein.
:::

### Schritt 2: Multi-Account-Status überprüfen

**Warum**
Bestätigen Sie, dass der Account korrekt hinzugefügt wurde und verfügbar ist.

**Vorgehensweise**

Zeigen Sie die Account-Speicherdatei an:

```bash
cat ~/.config/opencode/antigravity-accounts.json
```

**Erwartetes Ergebnis**:

```json
{
  "version": 3,
  "accounts": [
    {
      "email": "user1@gmail.com",
      "refreshToken": "1//0abc...",
      "projectId": "project-id-123",
      "addedAt": 1737609600000,
      "lastUsed": 1737609600000
    },
    {
      "email": "user2@gmail.com",
      "refreshToken": "1//0xyz...",
      "addedAt": 1737609700000,
      "lastUsed": 1737609700000
    }
  ],
  "activeIndex": 0,
  "activeIndexByFamily": {
    "claude": 0,
    "gemini": 0
  }
}
```

::: warning Sicherheitshinweis
`antigravity-accounts.json` enthält OAuth-Refresh-Tokens, die wie Passwörter zu behandeln sind. Committen Sie diese Datei niemals in ein Versionskontrollsystem.
:::

### Schritt 3: Account-Wechsel testen

**Warum**
Überprüfen Sie, ob das Multi-Account-Load-Balancing korrekt funktioniert.

**Vorgehensweise**

Senden Sie mehrere gleichzeitige Anfragen, um eine Ratenbegrenzung auszulösen:

```bash
# macOS/Linux
for i in {1..10}; do
  opencode run "Test $i" --model=google/antigravity-claude-sonnet-4-5 &
done
wait

# Windows PowerShell
1..10 | ForEach-Object {
  Start-Process -FilePath "opencode" -ArgumentList "run","Test $_","--model=google/antigravity-claude-sonnet-4-5"
}
```

**Erwartetes Ergebnis**:

1. Die ersten N Anfragen verwenden Account 1 (user1@gmail.com)
2. Nach einem 429-Fehler erfolgt automatischer Wechsel zu Account 2 (user2@gmail.com)
3. Bei aktivierten Benachrichtigungen erscheint ein Toast mit "Switched to account 2"

::: info Account-Wechsel-Benachrichtigung
Bei `quiet_mode: false` (Standard) zeigt das Plugin Account-Wechsel-Benachrichtigungen an. Beim ersten Wechsel wird die E-Mail-Adresse angezeigt, danach nur noch der Account-Index.
:::

### Schritt 4: Duales Quota-System konfigurieren (nur Gemini)

**Warum**
Mit aktiviertem dualem Quota-Fallback versucht das Plugin automatisch die Gemini CLI-Quota, wenn die Antigravity-Quota erschöpft ist, ohne den Account zu wechseln.

**Vorgehensweise**

Bearbeiten Sie die Plugin-Konfigurationsdatei:

```bash
# macOS/Linux
nano ~/.config/opencode/antigravity.json

# Windows
notepad %APPDATA%\opencode\antigravity.json
```

Fügen Sie folgende Konfiguration hinzu:

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "quota_fallback": true
}
```

Speichern Sie die Datei und starten Sie OpenCode neu.

**Erwartetes Ergebnis**:

1. Bei Gemini-Modellen verwendet das Plugin bevorzugt die Antigravity-Quota
2. Wenn Antigravity 429 zurückgibt, erfolgt automatischer Wechsel zur Gemini CLI-Quota desselben Accounts
3. Wenn beide Quotas begrenzt sind, wird zum nächsten Account gewechselt

::: tip Duales Quota vs. Multi-Account
- **Duales Quota**: Zwei unabhängige Quota-Pools desselben Accounts (Antigravity + Gemini CLI)
- **Multi-Account**: Kombinierte Quota-Pools mehrerer Accounts
- Best Practice: Zuerst duales Quota aktivieren, dann weitere Accounts hinzufügen
:::

### Schritt 5: Account-Auswahlstrategie wählen

**Warum**
Unterschiedliche Account-Anzahlen und Anwendungsfälle erfordern unterschiedliche Strategien für optimale Leistung.

**Vorgehensweise**

Konfigurieren Sie die Strategie in `antigravity.json`:

```json
{
  "account_selection_strategy": "hybrid"
}
```

Wählen Sie basierend auf Ihrer Account-Anzahl:

| Account-Anzahl | Empfohlene Strategie | Konfigurationswert | Begründung |
| --- | --- | --- | --- |
| 1 | sticky | `"sticky"` | Erhält Prompt-Cache |
| 2-5 | hybrid | `"hybrid"` | Balance zwischen Durchsatz und Cache |
| 5+ | round-robin | `"round-robin"` | Maximaler Durchsatz |

**Strategien im Detail**:

- **sticky** (Standard bei einzelnem Account): Verwendet denselben Account bis zur Ratenbegrenzung, ideal für einzelne Entwicklungssitzungen
- **round-robin**: Wechselt bei jeder Anfrage zum nächsten Account, maximiert Durchsatz auf Kosten des Caches
- **hybrid** (Standard bei mehreren Accounts): Kombinierte Entscheidung basierend auf Health-Score + Token-Bucket + LRU

**Erwartetes Ergebnis**:

1. Mit `hybrid`-Strategie wählt das Plugin automatisch den aktuell optimalen Account
2. Mit `round-robin`-Strategie werden Anfragen gleichmäßig auf alle Accounts verteilt
3. Mit `sticky`-Strategie verwendet dieselbe Sitzung durchgehend denselben Account

### Schritt 6: PID-Offset aktivieren (für parallele Agenten)

**Warum**
Beim Betrieb mehrerer OpenCode-Instanzen oder paralleler oh-my-opencode-Agenten könnten verschiedene Prozesse denselben Account wählen, was zu Konkurrenz führt.

**Vorgehensweise**

Fügen Sie in `antigravity.json` hinzu:

```json
{
  "pid_offset_enabled": true
}
```

Speichern Sie und starten Sie OpenCode neu.

**Erwartetes Ergebnis**:

1. Verschiedene Prozesse (unterschiedliche PIDs) starten mit unterschiedlichen Account-Indizes
2. Account-Konkurrenz zwischen parallelen Agenten wird reduziert
3. Gesamtdurchsatz wird verbessert

::: tip Funktionsweise des PID-Offsets
Der PID-Offset ordnet die Prozess-ID einem Account-Offset zu, zum Beispiel:
- PID 100 → Offset 0 → Startet mit Account 0
- PID 101 → Offset 1 → Startet mit Account 1
- PID 102 → Offset 2 → Startet mit Account 2
:::

## Checkliste ✅

Nach Abschluss der obigen Schritte sollten Sie in der Lage sein:

- [ ] Mehrere Google-Accounts über `opencode auth login` hinzuzufügen
- [ ] Mehrere Account-Einträge in `antigravity-accounts.json` zu sehen
- [ ] Bei Ratenbegrenzung automatisch zum nächsten Account zu wechseln
- [ ] Duales Quota-Fallback für Gemini-Modelle aktiviert zu haben
- [ ] Die passende Account-Auswahlstrategie basierend auf der Account-Anzahl gewählt zu haben
- [ ] PID-Offset für parallele Agenten-Szenarien aktiviert zu haben

## Häufige Probleme

### Alle Accounts sind ratenbegrenzt

**Symptom**: Alle Accounts zeigen 429-Fehler, keine Anfragen möglich

**Ursache**: Quota erschöpft oder zu viele gleichzeitige Anfragen

**Lösung**:

1. Warten Sie auf automatisches Zurücksetzen der Ratenbegrenzung (normalerweise 1-5 Minuten)
2. Bei anhaltenden Problemen fügen Sie weitere Accounts hinzu
3. Überprüfen Sie `max_rate_limit_wait_seconds` in der Konfiguration und setzen Sie ein angemessenes Wartelimit

### Zu häufiger Account-Wechsel

**Symptom**: Jede Anfrage wechselt den Account, derselbe Account wird nicht beibehalten

**Ursache**: Falsche Strategiewahl oder abnormaler Health-Score

**Lösung**:

1. Ändern Sie die Strategie auf `sticky`
2. Überprüfen Sie die `health_score`-Konfiguration und passen Sie `min_usable` und `rate_limit_penalty` an
3. Stellen Sie sicher, dass keine häufigen 429-Fehler Accounts als ungesund markieren

### Gemini CLI-Berechtigungsfehler (403)

**Symptom**: Bei Verwendung von Gemini CLI-Modellen wird `Permission denied` zurückgegeben

**Ursache**: Account fehlt eine gültige Project ID

**Lösung**:

1. Fügen Sie für jeden Account manuell eine `projectId` hinzu:

```json
{
  "accounts": [
    {
      "email": "your@email.com",
      "refreshToken": "...",
      "projectId": "your-project-id"
    }
  ]
}
```

2. Stellen Sie sicher, dass die Gemini for Google Cloud API in der [Google Cloud Console](https://console.cloud.google.com/) aktiviert ist

### Ungültiges Token (invalid_grant)

**Symptom**: Account wird automatisch entfernt mit `invalid_grant`-Fehler

**Ursache**: Google-Account-Passwortänderung, Sicherheitsereignis oder Token-Ablauf

**Lösung**:

1. Löschen Sie den ungültigen Account und authentifizieren Sie sich erneut:

```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```

2. Bei häufigem Auftreten erwägen Sie die Verwendung eines stabileren Google-Accounts

## Zusammenfassung

- Multi-Account-Konfiguration erhöht die Gesamtquota und Systemstabilität
- Das Hinzufügen von Accounts ist einfach – führen Sie einfach `opencode auth login` erneut aus
- Das duale Quota-System verdoppelt die verfügbare Quota für jeden Gemini-Account
- Die Account-Auswahlstrategie sollte basierend auf Account-Anzahl und Anwendungsfall angepasst werden
- PID-Offset ist entscheidend für parallele Agenten-Szenarien

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen Sie **[Account-Auswahlstrategien](../account-selection-strategies/)**.
>
> Sie werden lernen:
> - Die detaillierte Funktionsweise der drei Strategien: sticky, round-robin und hybrid
> - Wie Sie die optimale Strategie für Ihr Szenario wählen
> - Methoden zur Feinabstimmung von Health-Score und Token-Bucket

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-23

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| AccountManager-Klasse | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L174-L250) | 174-250 |
| Load-Balancing-Strategien | [`src/plugin/rotation.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/rotation.ts) | Vollständig |
| Konfigurations-Schema | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | Vollständig |
| Account-Speicher | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts) | Vollständig |

**Wichtige Konstanten**:

| Konstantenname | Wert | Beschreibung |
| --- | --- | --- |
| `QUOTA_EXHAUSTED_BACKOFFS` | `[60000, 300000, 1800000, 7200000]` | Backoff-Zeiten bei Quota-Erschöpfung (1 Min → 5 Min → 30 Min → 2 Std) |
| `RATE_LIMIT_EXCEEDED_BACKOFF` | `30000` | Backoff-Zeit bei Ratenbegrenzung (30 Sek) |
| `MIN_BACKOFF_MS` | `2000` | Minimale Backoff-Zeit (2 Sek) |

**Wichtige Funktionen**:

- `calculateBackoffMs(reason, consecutiveFailures, retryAfterMs)`: Berechnet Backoff-Verzögerung
- `getQuotaKey(family, headerStyle, model)`: Generiert Quota-Schlüssel (unterstützt modellspezifische Ratenbegrenzung)
- `isRateLimitedForQuotaKey(account, key)`: Prüft, ob ein bestimmter Quota-Schlüssel ratenbegrenzt ist
- `selectHybridAccount(accounts, family)`: Account-Auswahllogik der hybrid-Strategie

**Konfigurationsoptionen** (aus schema.ts):

| Option | Typ | Standardwert | Beschreibung |
| --- | --- | --- | --- |
| `account_selection_strategy` | enum | `"hybrid"` | Account-Auswahlstrategie |
| `quota_fallback` | boolean | `false` | Aktiviert Gemini duales Quota-Fallback |
| `pid_offset_enabled` | boolean | `false` | Aktiviert PID-Offset |
| `switch_on_first_rate_limit` | boolean | `true` | Sofortiger Wechsel bei erster Ratenbegrenzung |

</details>

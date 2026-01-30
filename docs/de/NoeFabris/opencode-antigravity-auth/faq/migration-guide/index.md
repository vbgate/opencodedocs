---
title: "Kontenmigration: Geräteübergreifende Einrichtung | Antigravity Auth"
sidebarTitle: "Auf neuem Computer weiterverwenden"
subtitle: "Kontenmigration: Einrichtung auf verschiedenen Computern und Versionsupgrades"
description: "Lernen Sie, wie Sie Antigravity Auth-Kontendateien zwischen macOS/Linux/Windows migrieren, verstehen Sie den automatischen Speicherformat-Upgrade-Mechanismus und lösen Sie Authentifizierungsprobleme nach der Migration."
tags:
  - "Migration"
  - "Geräteübergreifend"
  - "Versionsupgrade"
  - "Kontenverwaltung"
prerequisite:
  - "quick-install"
order: 2
---

# Kontenmigration: Einrichtung auf verschiedenen Computern und Versionsupgrades

## Was Sie nach diesem Tutorial tun können

- ✅ Konten von einem Computer auf einen anderen migrieren
- ✅ Änderungen der Speicherformatversionen verstehen (v1/v2/v3)
- ✅ Authentifizierungsprobleme nach der Migration lösen (invalid_grant Fehler)
- ✅ Das gleiche Konto auf mehreren Geräten teilen

## Ihr aktuelles Problem

Sie haben einen neuen Computer gekauft und müssen darauf Antigravity Auth weiter verwenden, um auf Claude und Gemini 3 zuzugreifen, ohne den gesamten OAuth-Authentifizierungsprozess erneut durchlaufen zu müssen. Oder Sie haben das Plugin nach einem Upgrade auf eine neue Version gefunden, dass die ursprünglichen Kontodaten nicht mehr funktionieren.

## Wann Sie diese Methode verwenden sollten

- 📦 **Neues Gerät**: Migration vom alten zum neuen Computer
- 🔄 **Multi-Gerät-Synchronisierung**: Konten zwischen Desktop und Laptop teilen
- 🆙 **Versionsupgrade**: Änderungen des Speicherformats nach dem Plugin-Upgrade
- 💾 **Backup-Wiederherstellung**: Regelmäßige Sicherung von Kontodaten

## Kerngedanke

**Kontenmigration** ist der Prozess, die Kontendatei (antigravity-accounts.json) von einem Computer auf einen anderen zu kopieren. Das Plugin erledigt automatisch das Upgrade des Speicherformats.

### Übersicht über den Migrationsmechanismus

Das Speicherformat ist versioniert (aktuell v3), das Plugin **verarbeitet die Versionsmigration automatisch**:

| Version | Hauptänderungen | Aktueller Status |
| --- | --- | --- |
| v1 → v2 | Rate-Limit-Status wurde strukturiert | ✅ Automatische Migration |
| v2 → v3 | Unterstützung für Dual-Quota-Pools (gemini-antigravity/gemini-cli) | ✅ Automatische Migration |

Speicherdatei-Speicherorte (plattformübergreifend):

| Plattform | Pfad |
| --- | --- |
| macOS/Linux | `~/.config/opencode/antigravity-accounts.json` |
| Windows | `%APPDATA%\opencode\antigravity-accounts.json` |

::: tip Sicherheitshinweis
Die Kontendatei enthält ein OAuth-Refresh-Token, **das gleichbedeutend mit einem Passwort ist**. Verwenden Sie bei der Übertragung verschlüsselte Methoden (z.B. SFTP, verschlüsseltes ZIP).
:::

## 🎒 Vorbereitung vor dem Start

- [ ] Zielcomputer hat OpenCode installiert
- [ ] Zielcomputer hat das Antigravity Auth Plugin installiert: `opencode plugin add opencode-antigravity-auth@beta`
- [ ] Beide Computer können Dateien sicher übertragen (SSH, USB-Stick usw.)

## Schritt-für-Schritt-Anleitung

### Schritt 1: Kontendatei auf dem Quellcomputer finden

**Warum**
Es ist notwendig, die JSON-Datei zu lokalisieren, die die Kontoinformationen enthält.

```bash
# macOS/Linux
ls -la ~/.config/opencode/antigravity-accounts.json

# Windows PowerShell
Get-ChildItem "$env:APPDATA\opencode\antigravity-accounts.json"
```

**Sie sollten sehen**: Die Datei existiert und enthält ähnliche Inhalte:

```json
{
  "version": 3,
  "accounts": [...],
  "activeIndex": 0
}
```

Wenn die Datei nicht existiert, bedeutet das, dass noch kein Konto hinzugefügt wurde. Bitte führen Sie zuerst `opencode auth login` aus.

### Schritt 2: Kontendatei auf den Zielcomputer kopieren

**Warum**
Übertragen Sie die Kontoinformationen (Refresh-Token und Project-ID) auf das neue Gerät.

::: code-group

```bash [macOS/Linux]
# Methode 1: Verwendung von scp (über SSH)
scp ~/.config/opencode/antigravity-accounts.json user@new-machine:/tmp/

# Methode 2: Verwendung eines USB-Sticks
cp ~/.config/opencode/antigravity-accounts.json /Volumes/USB/
```

```powershell [Windows]
# Methode 1: Verwendung von PowerShell Copy-Item (über SMB)
Copy-Item "$env:APPDATA\opencode\antigravity-accounts.json" "\\new-machine\c$\Users\user\Downloads\"

# Methode 2: Verwendung eines USB-Sticks
Copy-Item "$env:APPDATA\opencode\antigravity-accounts.json" "E:\"
```

:::

**Sie sollten sehen**: Die Datei wurde erfolgreich in ein temporäres Verzeichnis auf dem Zielcomputer kopiert (z.B. `/tmp/` oder `Downloads/`).

### Schritt 3: Plugin auf dem Zielcomputer installieren

**Warum**
Sicherstellen, dass die Plugin-Version auf dem Zielcomputer kompatibel ist.

```bash
opencode plugin add opencode-antigravity-auth@beta
```

**Sie sollten sehen**: Erfolgreiche Plugin-Installation bestätigt.

### Schritt 4: Datei in die richtige Position bringen

**Warum**
Das Plugin sucht die Kontendatei nur an festen Pfaden.

::: code-group

```bash [macOS/Linux]
# Verzeichnis erstellen (falls nicht vorhanden)
mkdir -p ~/.config/opencode

# Datei kopieren
cp /tmp/antigravity-accounts.json ~/.config/opencode/

# Berechtigungen überprüfen
chmod 600 ~/.config/opencode/antigravity-accounts.json
```

```powershell [Windows]
# Datei kopieren (Verzeichnis wird automatisch erstellt)
Copy-Item "$env:Downloads\antigravity-accounts.json" "$env:APPDATA\opencode\"

# Überprüfung
Test-Path "$env:APPDATA\opencode\antigravity-accounts.json"
```

:::

**Sie sollten sehen**: Die Datei existiert im Konfigurationsverzeichnis.

### Schritt 5: Migrationsergebnis überprüfen

**Warum**
Bestätigen, dass das Konto korrekt geladen wurde.

```bash
# Konten auflisten (löst das Laden der Kontendatei durch das Plugin aus)
opencode auth login

# Wenn bereits Konten vorhanden sind, wird angezeigt:
# 2 account(s) saved:
#   1. user1@gmail.com
#   2. user2@gmail.com
# (a)dd new account(s) or (f)resh start? [a/f]:
```

Drücken Sie `Ctrl+C` zum Beenden (kein neues Konto erforderlich).

**Sie sollten sehen**: Das Plugin erkennt die Kontoliste erfolgreich, einschließlich der migrierten Konten-E-Mail-Adressen.

### Schritt 6: Erste Anfrage testen

**Warum**
Überprüfen, ob das Refresh-Token noch gültig ist.

```bash
# In OpenCode eine Testanfrage initiieren
# Auswählen: google/antigravity-gemini-3-flash
```

**Sie sollten sehen**: Das Modell antwortet normal.

## Checkliste ✅

- [ ] Zielcomputer kann die migrierten Konten auflisten
- [ ] Testanfrage erfolgreich (keine Authentifizierungsfehler)
- [ ] Keine Fehler im Plugin-Log

## Warnhinweise zu häufigen Problemen

### Problem 1: "API key missing" Fehler

**Symptom**: Nach der Migration erscheint der Fehler `API key missing`.

**Ursache**: Das Refresh-Token ist möglicherweise abgelaufen oder wurde von Google widerrufen (z.B. bei Passwortänderung, Sicherheitsvorfällen).

**Lösung**:

```bash
# Kontendatei löschen und neu authentifizieren
rm ~/.config/opencode/antigravity-accounts.json  # macOS/Linux
del "%APPDATA%\opencode\antigravity-accounts.json"  # Windows

opencode auth login
```

### Problem 2: Plugin-Version inkompatibel

**Symptom**: Nach der Migration kann die Kontendatei nicht geladen werden, das Log zeigt `Unknown storage version`.

**Ursache**: Die Plugin-Version auf dem Zielcomputer ist zu alt und unterstützt das aktuelle Speicherformat nicht.

**Lösung**:

```bash
# Auf die neueste Version upgraden
opencode plugin add opencode-antigravity-auth@latest

# Neu testen
opencode auth login
```

### Problem 3: Datenverlust bei Dual-Quota-Pools

**Symptom**: Nach der Migration verwendet das Gemini-Modell nur einen Quota-Pool, es gibt keinen automatischen Fallback.

**Ursache**: Während der Migration wurde nur `antigravity-accounts.json` kopiert, aber die Konfigurationsdatei `antigravity.json` wurde nicht migriert.

**Lösung**:

Kopieren Sie gleichzeitig die Konfigurationsdatei (wenn `quota_fallback` aktiviert ist):

::: code-group

```bash [macOS/Linux]
# Konfigurationsdatei kopieren
cp ~/.config/opencode/antigravity.json ~/.config/opencode/
```

```powershell [Windows]
# Konfigurationsdatei kopieren
Copy-Item "$env:APPDATA\opencode\antigravity.json" "$env:APPDATA\opencode\"
```

:::

### Problem 4: Dateiberechtigungsfehler

**Symptom**: Auf macOS/Linux erscheint die Meldung `Permission denied`.

**Ursache**: Die Dateiberechtigungen sind nicht korrekt, das Plugin kann nicht lesen.

**Lösung**:

```bash
# Berechtigungen reparieren
chmod 600 ~/.config/opencode/antigravity-accounts.json
chown $USER ~/.config/opencode/antigravity-accounts.json
```

## Detaillierte Erklärung der automatischen Speicherformat-Migration

Wenn das Plugin Konten lädt, erkennt es automatisch die Speicherversion und migriert:

```
v1 (alte Version)
  ↓ migrateV1ToV2()
v2
  ↓ migrateV2ToV3()
v3 (aktuelle Version)
```

**Migrationsregeln**:
- v1 → v2: `rateLimitResetTime` wird in zwei Felder `claude` und `gemini` aufgeteilt
- v2 → v3: `gemini` wird in `gemini-antigravity` und `gemini-cli` aufgeteilt (unterstützt Dual-Quota-Pools)
- Automatische Bereinigung: Abgelaufene Rate-Limit-Zeiten werden herausgefiltert (`> Date.now()`)

::: info Automatische Deduplizierung
Beim Laden von Konten entfernt das Plugin basierend auf der E-Mail-Adresse automatisch Duplikate und behält das neueste Konto (sortiert nach `lastUsed` und `addedAt`).
:::

## Zusammenfassung dieser Lektion

Kernschritte der Kontenmigration:

1. **Datei lokalisieren**: Finden Sie `antigravity-accounts.json` auf dem Quellcomputer
2. **Kopieren und übertragen**: Sichere Übertragung auf den Zielcomputer
3. **Richtig platzieren**: In das Konfigurationsverzeichnis legen (`~/.config/opencode/` oder `%APPDATA%\opencode\`)
4. **Überprüfung testen**: Führen Sie `opencode auth login` aus, um die Erkennung zu bestätigen

Das Plugin **verarbeitet die Versionsmigration automatisch**, es ist nicht notwendig, das Speicherdateiformat manuell zu ändern. Wenn jedoch ein `invalid_grant`-Fehler auftritt, muss die Authentifizierung erneut durchgeführt werden.

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[ToS Warnung](../tos-warning/)**.
>
> Sie werden lernen:
> - Risiken bei der Verwendung von Antigravity Auth
> - Wie man vermeidet, dass Konten gesperrt werden
> - Einschränkungen der Google-Nutzungsbedingungen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Erweitern der Quellcode-Positionen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Speicherformat-Definition | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L128-L198) | 128-198 |
| v1→v2 Migration | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L366-L395) | 366-395 |
| v2→v3 Migration | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L397-L431) | 397-431 |
| Konten laden (mit automatischer Migration) | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L433-L518) | 433-518 |
| Konfigurationsverzeichnis-Pfad | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L202-L213) | 202-213 |
| Dateideduplizierungslogik | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L301-L364) | 301-364 |

**Wichtige Schnittstellen**:

- `AccountStorageV3` (v3 Speicherformat):
  ```typescript
  interface AccountStorageV3 {
    version: 3;
    accounts: AccountMetadataV3[];
    activeIndex: number;
    activeIndexByFamily?: { claude?: number; gemini?: number; };
  }
  ```

- `AccountMetadataV3` (Konten-Metadaten):
  ```typescript
  interface AccountMetadataV3 {
    email?: string;                    // Google-Konto E-Mail
    refreshToken: string;              // OAuth refresh token (Kernkomponente)
    projectId?: string;                // GCP Projekt-ID
    managedProjectId?: string;         // Verwaltete Projekt-ID
    addedAt: number;                   // Hinzufüge-Zeitstempel
    lastUsed: number;                  // Letzte Verwendungszeit
    lastSwitchReason?: "rate-limit" | "initial" | "rotation";
    rateLimitResetTimes?: RateLimitStateV3;  // Rate-Limit-Reset-Zeiten (v3 unterstützt Dual-Quota-Pools)
    coolingDownUntil?: number;          // Abkühlungs-Endzeit
    cooldownReason?: CooldownReason;   // Abkühlungsgrund
  }
  ```

- `RateLimitStateV3` (v3 Rate-Limit-Status):
  ```typescript
  interface RateLimitStateV3 {
    claude?: number;                  // Claude Quota-Reset-Zeit
    "gemini-antigravity"?: number;    // Gemini Antigravity Quota-Reset-Zeit
    "gemini-cli"?: number;            // Gemini CLI Quota-Reset-Zeit
  }
  ```

**Wichtige Funktionen**:
- `loadAccounts()`: Lädt die Kontendatei, erkennt automatisch die Version und migriert (storage.ts:433)
- `migrateV1ToV2()`: Migriert v1-Format zu v2 (storage.ts:366)
- `migrateV2ToV3()`: Migriert v2-Format zu v3 (storage.ts:397)
- `deduplicateAccountsByEmail()`: Entfernt basierend auf E-Mail Duplikate, behält neuestes Konto (storage.ts:301)
- `getStoragePath()`: Ermittelt Speicherdateipfad, plattformübergreifende Kompatibilität (storage.ts:215)

**Migrationslogik**:
- Erkennt das Feld `data.version` (storage.ts:446)
- v1: Zuerst zu v2 migrieren, dann zu v3 (storage.ts:447-457)
- v2: Direkt zu v3 migrieren (storage.ts:458-468)
- v3: Keine Migration erforderlich, direkt laden (storage.ts:469-470)
- Automatische Bereinigung: Abgelaufene Rate-Limit-Zeiten werden gefiltert (storage.ts:404-410)

</details>

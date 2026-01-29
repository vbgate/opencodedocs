---
title: "DM-Pairing und Zugriffskontrolle: Schützen Sie Ihren AI-Assistenten | Clawdbot-Tutorial"
sidebarTitle: "Zugriff von Fremden verwalten"
subtitle: "DM-Pairing und Zugriffskontrolle: Schützen Sie Ihren AI-Assistenten"
description: "Erfahren Sie mehr über den DM-Pairing-Schutzmechanismus von Clawdbot, lernen Sie, wie Sie Pairing-Anfragen von unbekannten Absendern über CLI genehmigen, ausstehende Anfragen auflisten und die Allowlist verwalten. Dieses Tutorial führt vollständig durch den Pairing-Prozess, CLI-Befehle, Zugriffspolicy-Konfiguration und Sicherheits-Praktiken, inklusive Troubleshooting und dem Doctor-Befehl."
tags:
  - "Einsteiger"
  - "Sicherheit"
  - "Pairing"
  - "Zugriffskontrolle"
prerequisite:
  - "start-gateway-startup"
order: 50
---

# DM-Pairing und Zugriffskontrolle: Schützen Sie Ihren AI-Assistenten

## Was Sie nach diesem Tutorial können

Nach Abschluss dieses Tutorials können Sie:

- ✅ Den standardmäßigen DM-Pairing-Schutzmechanismus verstehen
- ✅ Pairing-Anfragen von unbekannten Absendern genehmigen
- ✅ Ausstehende Pairing-Anfragen auflisten und verwalten
- ✅ Verschiedene DM-Zugriffspolicies konfigurieren (pairing/allowlist/open)
- ✅ Doctor-Prüfungen für Sicherheitskonfigurationen ausführen

## Ihre aktuelle Situation

Vielleicht haben Sie gerade einen WhatsApp- oder Telegram-Kanal konfiguriert und möchten mit Ihrem AI-Assistenten chatten, stoßen aber auf folgende Probleme:

- "Warum antwortet Clawdbot nicht, wenn Fremde mir Nachrichten schicken?"
- "Ich habe einen Pairing-Code erhalten, weiß aber nicht, was das bedeutet"
- "Ich möchte jemanden genehmigen, weiß aber nicht, welchen Befehl ich verwenden soll"
- "Wie kann ich prüfen, wer auf Genehmigung wartet?"

Die gute Nachricht: **Clawdbot aktiviert standardmäßig den DM-Pairing-Schutz**, um sicherzustellen, dass nur von Ihnen autorisierte Absender mit Ihrem AI-Assistenten kommunizieren können.

## Wann Sie diese Methode verwenden

Verwenden Sie diese Methode, wenn Sie:

- 🛡 **Datenschutz schützen** müssen: Sicherstellen, dass nur vertrauenswürdige Personen mit Ihrem AI-Assistenten chatten können
- ✅ **Fremde genehmigen** müssen: Neuen Absendern den Zugriff auf Ihren AI-Assistenten ermöglichen
- 🔒 **Strikte Zugriffskontrolle** benötigen: Zugriffsrechte für bestimmte Benutzer einschränken
- 📋 **Massenverwaltung** durchführen müssen: Alle ausstehenden Pairing-Anfragen anzeigen und verwalten

---

## Kerngedanke

### Was ist DM-Pairing?

Clawdbot verbindet sich mit echten Messaging-Plattformen (WhatsApp, Telegram, Slack usw.), und **Privatchats (DMs) werden auf diesen Plattformen standardmäßig als nicht vertrauenswürdige Eingaben betrachtet**.

Um Ihren AI-Assistenten zu schützen, bietet Clawdbot einen **Pairing-Mechanismus**:

::: info Pairing-Prozess
1. Ein unbekannter Absender sendet Ihnen eine Nachricht
2. Clawdbot erkennt, dass der Absender nicht autorisiert ist
3. Clawdbot gibt einen **Pairing-Code** zurück (8 Zeichen)
4. Der Absender muss Ihnen den Pairing-Code mitteilen
5. Sie genehmigen den Code über die CLI
6. Die Absender-ID wird zur Allowlist hinzugefügt
7. Der Absender kann normal mit dem AI-Assistenten chatten
:::

### Standard-DM-Policy

**Alle Kanäle verwenden standardmäßig `dmPolicy="pairing"`**, das bedeutet:

| Policy | Verhalten |
|--- | ---|
| `pairing` | Unbekannte Absender erhalten einen Pairing-Code, Nachricht wird nicht verarbeitet (Standard) |
| `allowlist` | Nur Absender aus der `allowFrom`-Liste sind zulässig |
| `open` | Alle Absender sind zulässig (erfordert explizite Konfiguration von `"*"`) |
| `disabled` | DM-Funktionalität vollständig deaktiviert |

::: warning Sicherheitshinweis
Der Standardmodus `pairing` ist die sicherste Wahl. Ändern Sie nicht in den Modus `open`, es sei denn, Sie haben spezielle Anforderungen.
:::

---

## 🎒 Vorbereitungen vor dem Start

Stellen Sie sicher, dass Sie:

- [x] Das Tutorial [Schnellstart](../getting-started/) abgeschlossen haben
- [x] Das Tutorial [Gateway starten](../gateway-startup/) abgeschlossen haben
- [x] Mindestens einen Messaging-Kanal konfiguriert haben (WhatsApp, Telegram, Slack usw.)
- [x] Der Gateway läuft

---

## Führen Sie dies Schritt für Schritt aus

### Schritt 1: Verstehen Sie, woher der Pairing-Code stammt

Wenn ein unbekannter Absender eine Nachricht an Ihren Clawdbot sendet, erhält er eine Antwort ähnlich wie diese:

```
Clawdbot: access not configured.

Telegram ID: 123456789

Pairing code: AB3D7X9K

Ask the bot owner to approve with:
clawdbot pairing approve telegram <code>
```

**Wichtige Eigenschaften des Pairing-Codes** (Quelle: `src/pairing/pairing-store.ts`):

- **8 Zeichen**: Einfach einzugeben und zu merken
- **Großbuchstaben und Ziffern**: Vermeidet Verwirrung
- **Vermeidung leicht zu verwechselnder Zeichen**: Enthält keine 0, O, 1, I
- **1 Stunde Gültigkeit**: Läuft automatisch nach Ablauf der Zeit ab
- **Maximal 3 ausstehende Genehmigungsanfragen**: Älteste Anfragen werden automatisch gelöscht, wenn überschritten

### Schritt 2: Auflisten ausstehender Pairing-Anfragen

Führen Sie den folgenden Befehl im Terminal aus:

```bash
clawdbot pairing list telegram
```

**Sie sollten sehen**:

```
Pairing requests (1)

┌──────────────────┬────────────────┬────────┬──────────────────────┐
│ Code            │ ID            │ Meta   │ Requested            │
├──────────────────┼────────────────┼────────┼──────────────────────┤
│ AB3D7X9K        │ 123456789      │        │ 2026-01-27T10:30:00Z │
└──────────────────┴────────────────┴────────┴──────────────────────┘
```

Wenn keine ausstehenden Anfragen vorliegen, sehen Sie:

```
No pending telegram pairing requests.
```

::: tip Unterstützte Kanäle
Die Pairing-Funktion unterstützt die folgenden Kanäle:
- telegram
- whatsapp
- slack
- discord
- signal
- imessage
- msteams
- googlechat
- bluebubbles
:::

### Schritt 3: Pairing-Anfrage genehmigen

Verwenden Sie den vom Absender bereitgestellten Pairing-Code, um den Zugriff zu genehmigen:

```bash
clawdbot pairing approve telegram AB3D7X9K
```

**Sie sollten sehen**:

```
✅ Approved telegram sender 123456789
```

::: info Wirkung nach Genehmigung
Nach der Genehmigung wird die Absender-ID (123456789) automatisch zur Allowlist dieses Kanals hinzugefügt und unter folgendem Pfad gespeichert:
`~/.clawdbot/credentials/telegram-allowFrom.json`
:::

### Schritt 4: Absender benachrichtigen (optional)

Wenn Sie den Absender automatisch benachrichtigen möchten, verwenden Sie das `--notify`-Flag:

```bash
clawdbot pairing approve telegram AB3D7X9K --notify
```

Der Absender erhält die folgende Nachricht (Quelle: `src/channels/plugins/pairing-message.ts`):

```
✅ Clawdbot access approved. Send a message to start chatting.
```

**Hinweis**: Das `--notify`-Flag erfordert, dass der Clawdbot-Gateway läuft und der Kanal aktiv ist.

### Schritt 5: Verifizieren, dass der Absender normal chatten kann

Lassen Sie den Absender erneut eine Nachricht senden, der AI-Assistent sollte normal antworten.

---

## Checkpoint ✅

Führen Sie die folgenden Überprüfungen durch, um sicherzustellen, dass die Konfiguration korrekt ist:

- [ ] Mit `clawdbot pairing list <channel>` können Sie ausstehende Anfragen anzeigen
- [ ] Mit `clawdbot pairing approve <channel> <code>` können Sie Anfragen erfolgreich genehmigen
- [ ] Der genehmigte Absender kann normal mit dem AI-Assistenten chatten
- [ ] Pairing-Codes laufen nach 1 Stunde automatisch ab (kann durch erneutes Senden einer Nachricht verifiziert werden)

---

## Häufige Fehler

### Fehler 1: Pairing-Code nicht gefunden

**Fehlermeldung**:
```
No pending pairing request found for code: AB3D7X9K
```

**Mögliche Ursachen**:
- Der Pairing-Code ist abgelaufen (mehr als 1 Stunde)
- Der Pairing-Code wurde falsch eingegeben (Groß-/Kleinschreibung prüfen)
- Der Absender hat tatsächlich keine Nachricht gesendet (Pairing-Codes werden nur generiert, wenn eine Nachricht empfangen wurde)

**Lösung**:
- Lassen Sie den Absender erneut eine Nachricht senden, um einen neuen Pairing-Code zu generieren
- Stellen Sie sicher, dass der Pairing-Code korrekt kopiert wurde (Groß-/Kleinschreibung beachten)

### Fehler 2: Kanal unterstützt kein Pairing

**Fehlermeldung**:
```
Channel xxx does not support pairing
```

**Mögliche Ursachen**:
- Der Kanalname wurde falsch geschrieben
- Dieser Kanal unterstützt die Pairing-Funktion nicht

**Lösung**:
- Führen Sie `clawdbot pairing list` aus, um die Liste der unterstützten Kanäle anzuzeigen
- Verwenden Sie den korrekten Kanalnamen

### Fehler 3: Benachrichtigung fehlgeschlagen

**Fehlermeldung**:
```
Failed to notify requester: <error details>
```

**Mögliche Ursachen**:
- Der Gateway läuft nicht
- Die Kanalverbindung ist unterbrochen
- Netzwerkprobleme

**Lösung**:
- Stellen Sie sicher, dass der Gateway läuft
- Prüfen Sie den Kanalstatus: `clawdbot channels status`
- Verwenden Sie nicht das `--notify`-Flag und benachrichtigen Sie den Absender manuell

---

## Zusammenfassung

Dieses Tutorial hat den DM-Pairing-Schutzmechanismus von Clawdbot vorgestellt:

- **Standardsicherheit**: Alle Kanäle verwenden standardmäßig den Modus `pairing`, um Ihren AI-Assistenten zu schützen
- **Pairing-Prozess**: Unbekannte Absender erhalten einen 8-stelligen Pairing-Code, den Sie über die CLI genehmigen müssen
- **Verwaltungsbefehle**:
  - `clawdbot pairing list <channel>`: Auflisten ausstehender Anfragen
  - `clawdbot pairing approve <channel> <code>`: Pairing genehmigen
- **Speicherort**: Die Allowlist wird unter `~/.clawdbot/credentials/<channel>-allowFrom.json` gespeichert
- **Automatisches Ablaufen**: Pairing-Anfragen laufen nach 1 Stunde automatisch ab

Denken Sie daran: **Der Pairing-Mechanismus ist das Sicherheitsfundament von Clawdbot** und stellt sicher, dass nur von Ihnen autorisierte Personen mit Ihrem AI-Assistenten chatten können.

---

## Vorschau auf das nächste Tutorial

> Im nächsten Tutorial lernen wir **[Fehlerbehebung: Häufige Probleme lösen](../../faq/troubleshooting/)**.
>
> Sie lernen:
> - Schnelle Diagnose und Systemstatus-Prüfung
> - Lösungen für Gateway-Start, Kanalverbindung, Authentifizierungsfehler und andere Probleme
> - Fehlerbehebung bei fehlgeschlagenen Tool-Aufrufen und Performance-Optimierung

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-27

| Funktion | Dateipfad | Zeilen |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
| Standard-DM-Policy (pairing) | [`src/config/zod-schema.providers-core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.providers-core.ts#L93) | 93 |

**Wichtige Konstanten**:
- `PAIRING_CODE_LENGTH = 8`: Länge des Pairing-Codes
- `PAIRING_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"`: Zeichensatz für Pairing-Codes (ohne 0O1I)
- `PAIRING_PENDING_TTL_MS = 60 * 60 * 1000`: Gültigkeitsdauer für Pairing-Anfragen (1 Stunde)
- `PAIRING_PENDING_MAX = 3`: Maximale Anzahl ausstehender Genehmigungsanfragen

**Wichtige Funktionen**:
- `approveChannelPairingCode()`: Pairing-Code genehmigen und zur Allowlist hinzufügen
- `listChannelPairingRequests()`: Ausstehende Pairing-Anfragen auflisten
- `upsertChannelPairingRequest()`: Pairing-Anfrage erstellen oder aktualisieren
- `addChannelAllowFromStoreEntry()`: Absender zur Allowlist hinzufügen

</details>

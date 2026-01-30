---
title: "OAuth-Authentifizierung: Fehlerbehebung | Antigravity Auth"
sidebarTitle: "OAuth-Authentifizierungsprobleme beheben"
subtitle: "OAuth-Authentifizierung: Fehlerbehebung häufiger Probleme"
description: "Lernen Sie die Fehlerbehebung bei OAuth-Authentifizierungsproblemen mit dem Antigravity Auth Plugin. Behandelt Safari-Callback-Fehler, 403-Fehler, Rate Limits, WSL2/Docker-Umgebungskonfiguration und weitere häufige Lösungen."
tags:
  - FAQ
  - Fehlerbehebung
  - OAuth
  - Authentifizierung
prerequisite:
  - start-first-auth-login
  - start-quick-install
order: 1
---

# Fehlerbehebung bei häufigen Authentifizierungsproblemen

Nach dieser Lektion können Sie OAuth-Authentifizierungsfehler, Token-Aktualisierungsprobleme und Berechtigungsverweigerungen selbstständig beheben und das Plugin schnell wieder zum Laufen bringen.

## Ihre aktuelle Situation

Sie haben gerade das Antigravity Auth Plugin installiert und wollten mit Claude oder Gemini 3 Modellen arbeiten, aber dann passiert Folgendes:

- Nach `opencode auth login` zeigt der Browser eine erfolgreiche Autorisierung, aber das Terminal meldet „Autorisierung fehlgeschlagen"
- Nach einiger Nutzung erscheint plötzlich „Permission Denied" oder „invalid_grant"
- Alle Konten zeigen „Rate Limited", obwohl das Kontingent noch ausreicht
- In WSL2 oder Docker-Umgebungen kann die OAuth-Authentifizierung nicht abgeschlossen werden
- Safari-Browser OAuth-Callbacks schlagen immer fehl

Diese Probleme sind häufig. In den meisten Fällen müssen Sie nicht neu installieren oder den Support kontaktieren – folgen Sie einfach dieser Anleitung Schritt für Schritt.

## Wann Sie diese Anleitung verwenden sollten

Nutzen Sie dieses Tutorial bei folgenden Situationen:
- **OAuth-Authentifizierung fehlgeschlagen**: `opencode auth login` kann nicht abgeschlossen werden
- **Token ungültig**: invalid_grant, Permission Denied Fehler
- **Rate Limiting**: 429-Fehler, „Alle Konten gedrosselt"
- **Umgebungsprobleme**: WSL2, Docker, Remote-Entwicklungsumgebungen
- **Plugin-Konflikte**: Inkompatibilität mit oh-my-opencode oder anderen Plugins

::: tip Schneller Reset
Bei Authentifizierungsproblemen löst in **90% der Fälle** das Löschen der Kontodatei und erneute Authentifizierung das Problem:
```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```
:::

---

## Schnelle Diagnose

Bei Problemen folgen Sie dieser Reihenfolge zur schnellen Lokalisierung:

1. **Konfigurationspfad prüfen** → Dateispeicherort bestätigen
2. **Kontodatei löschen und neu authentifizieren** → Löst die meisten Authentifizierungsprobleme
3. **Fehlermeldung analysieren** → Lösung nach spezifischem Fehlertyp suchen
4. **Netzwerkumgebung prüfen** → WSL2/Docker erfordert zusätzliche Konfiguration

---

## Kernkonzepte: OAuth-Authentifizierung und Token-Verwaltung

Bevor Sie Probleme lösen, verstehen Sie zunächst einige Schlüsselkonzepte.

::: info Was ist OAuth 2.0 PKCE-Authentifizierung?

Antigravity Auth verwendet den **OAuth 2.0 with PKCE** (Proof Key for Code Exchange) Authentifizierungsmechanismus:

1. **Autorisierungscode**: Nach Ihrer Autorisierung gibt Google einen temporären Autorisierungscode zurück
2. **Token-Austausch**: Das Plugin tauscht den Autorisierungscode gegen `access_token` (für API-Aufrufe) und `refresh_token` (für Aktualisierung)
3. **Automatische Aktualisierung**: 30 Minuten vor Ablauf des `access_token` aktualisiert das Plugin automatisch mit dem `refresh_token`
4. **Token-Speicherung**: Alle Tokens werden lokal in `~/.config/opencode/antigravity-accounts.json` gespeichert und niemals auf Server hochgeladen

**Sicherheit**: Der PKCE-Mechanismus verhindert das Abfangen von Autorisierungscodes. Selbst bei Token-Leak kann ein Angreifer keine erneute Autorisierung durchführen.

:::

::: info Was ist Rate Limiting?

Google begrenzt die API-Aufruffrequenz für jedes Google-Konto. Bei Auslösung der Begrenzung:

- **429 Too Many Requests**: Anfragen zu häufig, Wartezeit erforderlich
- **403 Permission Denied**: Möglicherweise Soft-Ban oder Missbrauchserkennung ausgelöst
- **Anfrage hängt**: 200 OK aber keine Antwort, deutet meist auf stille Drosselung hin

**Vorteil mehrerer Konten**: Durch Rotation mehrerer Konten können Sie die Begrenzungen einzelner Konten umgehen und das Gesamtkontingent maximieren.

:::

---

## Konfigurationspfade

Alle Plattformen (einschließlich Windows) verwenden `~/.config/opencode/` als Konfigurationsverzeichnis:

| Datei | Pfad | Beschreibung |
| --- | --- | --- |
| Hauptkonfiguration | `~/.config/opencode/opencode.json` | OpenCode Hauptkonfigurationsdatei |
| Kontodatei | `~/.config/opencode/antigravity-accounts.json` | OAuth-Tokens und Kontoinformationen |
| Plugin-Konfiguration | `~/.config/opencode/antigravity.json` | Plugin-spezifische Konfiguration |
| Debug-Logs | `~/.config/opencode/antigravity-logs/` | Debug-Logdateien |

> **Windows-Benutzer beachten**: `~` wird automatisch zu Ihrem Benutzerverzeichnis aufgelöst (z.B. `C:\Users\IhrName`). Verwenden Sie nicht `%APPDATA%`.

---

## OAuth-Authentifizierungsprobleme

### Safari OAuth-Callback fehlgeschlagen (macOS)

**Symptome**:
- Nach erfolgreicher Browser-Autorisierung meldet das Terminal „fail to authorize"
- Safari zeigt „Safari kann die Seite nicht öffnen" oder „Verbindung abgelehnt"

**Ursache**: Safaris „Nur-HTTPS-Modus" blockiert die `http://localhost` Callback-Adresse.

**Lösungen**:

**Lösung 1: Anderen Browser verwenden (am einfachsten)**

1. Führen Sie `opencode auth login` aus
2. Kopieren Sie die im Terminal angezeigte OAuth-URL
3. Fügen Sie sie in Chrome oder Firefox ein
4. Schließen Sie die Autorisierung ab

**Lösung 2: Nur-HTTPS-Modus temporär deaktivieren**

1. Safari → Einstellungen (⌘,) → Datenschutz
2. Deaktivieren Sie „Nur-HTTPS-Modus aktivieren"
3. Führen Sie `opencode auth login` aus
4. Aktivieren Sie den Nur-HTTPS-Modus nach der Authentifizierung wieder

**Lösung 3: Callback manuell extrahieren (fortgeschritten)**

Wenn Safari einen Fehler anzeigt, enthält die Adressleiste `?code=...&scope=...`. Sie können die Callback-Parameter manuell extrahieren. Siehe [Issue #119](https://github.com/NoeFabris/opencode-antigravity-auth/issues/119).

### Port bereits belegt

**Fehlermeldung**: `Address already in use`

**Ursache**: Der OAuth-Callback-Server verwendet standardmäßig `localhost:51121`. Wenn der Port belegt ist, kann er nicht starten.

**Lösung**:

**macOS / Linux:**
```bash
# Prozess finden, der den Port belegt
lsof -i :51121

# Prozess beenden (ersetzen Sie <PID> durch die tatsächliche Prozess-ID)
kill -9 <PID>

# Erneut authentifizieren
opencode auth login
```

**Windows:**
```powershell
# Prozess finden, der den Port belegt
netstat -ano | findstr :51121

# Prozess beenden (ersetzen Sie <PID> durch die tatsächliche Prozess-ID)
taskkill /PID <PID> /F

# Erneut authentifizieren
opencode auth login
```

### WSL2 / Docker / Remote-Entwicklungsumgebungen

**Problem**: OAuth-Callback erfordert, dass der Browser auf den `localhost` zugreifen kann, auf dem OpenCode läuft. In Container- oder Remote-Umgebungen ist dies nicht direkt möglich.

**WSL2-Lösung**:
- VS Code Port-Forwarding verwenden
- Oder Windows → WSL Port-Forwarding konfigurieren

**SSH / Remote-Entwicklungslösung**:
```bash
# SSH-Tunnel einrichten, um Remote-Port 51121 auf lokal weiterzuleiten
ssh -L 51121:localhost:51121 user@remote-host
```

**Docker / Container-Lösung**:
- Localhost-Callback funktioniert nicht im Container
- Nach 30 Sekunden Wartezeit den manuellen URL-Prozess verwenden
- Oder SSH-Port-Forwarding nutzen

### Probleme bei Multi-Account-Authentifizierung

**Symptome**: Authentifizierung mehrerer Konten schlägt fehl oder wird verwechselt.

**Lösung**:
1. Kontodatei löschen: `rm ~/.config/opencode/antigravity-accounts.json`
2. Erneut authentifizieren: `opencode auth login`
3. Sicherstellen, dass jedes Konto eine andere Google-E-Mail verwendet

---

## Token-Aktualisierungsprobleme

### invalid_grant Fehler

**Fehlermeldung**:
```
Error: invalid_grant
Token has been revoked or expired.
```

**Ursachen**:
- Google-Kontopasswort geändert
- Sicherheitsereignis im Konto (z.B. verdächtige Anmeldung)
- `refresh_token` ungültig geworden

**Lösung**:
```bash
# Kontodatei löschen
rm ~/.config/opencode/antigravity-accounts.json

# Erneut authentifizieren
opencode auth login
```

### Token abgelaufen

**Symptome**: Nach längerer Nichtnutzung erscheint beim nächsten Modellaufruf ein Fehler.

**Ursache**: `access_token` ist etwa 1 Stunde gültig, `refresh_token` länger, kann aber auch ablaufen.

**Lösung**:
- Das Plugin aktualisiert automatisch 30 Minuten vor Token-Ablauf, keine manuelle Aktion erforderlich
- Bei fehlgeschlagener automatischer Aktualisierung erneut authentifizieren: `opencode auth login`

---

## Berechtigungsfehler

### 403 Permission Denied (rising-fact-p41fc)

**Fehlermeldung**:
```
Permission 'cloudaicompanion.companions.generateChat' denied on resource
'//cloudaicompanion.googleapis.com/projects/rising-fact-p41fc/locations/global'
```

**Ursache**: Das Plugin fällt auf eine Standard-Project-ID (wie `rising-fact-p41fc`) zurück, wenn kein gültiges Projekt gefunden wird. Dies funktioniert für Antigravity-Modelle, schlägt aber bei Gemini CLI-Modellen fehl, da diese ein GCP-Projekt in Ihrem eigenen Konto benötigen.

**Lösung**:

**Schritt 1: GCP-Projekt erstellen oder auswählen**

1. Besuchen Sie die [Google Cloud Console](https://console.cloud.google.com/)
2. Erstellen Sie ein neues Projekt oder wählen Sie ein bestehendes
3. Notieren Sie die Projekt-ID (z.B. `my-gemini-project`)

**Schritt 2: Gemini for Google Cloud API aktivieren**

1. Gehen Sie in der Google Cloud Console zu „APIs und Dienste" → „Bibliothek"
2. Suchen Sie nach „Gemini for Google Cloud API" (`cloudaicompanion.googleapis.com`)
3. Klicken Sie auf „Aktivieren"

**Schritt 3: projectId in der Kontodatei hinzufügen**

Bearbeiten Sie `~/.config/opencode/antigravity-accounts.json`:

```json
{
  "version": 3,
  "accounts": [
    {
      "email": "ihre@gmail.com",
      "refreshToken": "...",
      "projectId": "my-gemini-project"
    }
  ]
}
```

::: warning Multi-Account-Konfiguration
Wenn Sie mehrere Google-Konten konfiguriert haben, muss jedes Konto seine eigene `projectId` haben.
:::

---

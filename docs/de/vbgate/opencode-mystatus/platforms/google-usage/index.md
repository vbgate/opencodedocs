---
title: "Google Cloud: Kredit abfragen | opencode-mystatus"
sidebarTitle: "Google Cloud-Kredit"
subtitle: "Google Cloud-Kreditabfrage: G3 Pro/Image/Flash und Claude"
description: "Lernen Sie die Google Cloud-Kreditabfrage-Methode für G3 Pro, G3 Image, G3 Flash und Claude. Zeigen Sie verbleibende Kredite, Rücksetzzeiten an und verwalten Sie mehrere Antigravity-Konten."
tags:
  - "Google Cloud"
  - "Antigravity"
  - "Kreditabfrage"
prerequisite:
  - "start-quick-start"
  - "start-using-mystatus"
order: 4
---

# Google Cloud-Kreditabfrage: G3 Pro/Image/Flash und Claude

## Was Sie nach diesem Tutorial können

- Anzeigen der 4 Modellkredite von Google Cloud Antigravity-Konten
- Verstehen der Rücksetzzeit und des verbleibenden Prozentsatzes jedes Modells
- Verwalten der Kreditnutzung mehrerer Google Cloud-Konten

## Ihre aktuelle Situation

Google Cloud Antigravity bietet mehrere Modelle (G3 Pro, G3 Image, G3 Flash, Claude), jedes Modell hat einen unabhängigen Kredit und eine Rücksetzzeit. Sie müssen:
- Sich separat in der Google Cloud-Konsole anmelden, um den Status jedes Modells anzuzeigen
- Verbleibende Kredite und Rücksetzzeiten manuell berechnen
- Bei mehreren Konten noch verwirrender sein

## Wann sollten Sie dies verwenden?

Wenn Sie:
- Schnell die verbleibenden Kredite aller Google Cloud-Modelle erfahren möchten
- Die Nutzungszuteilung zwischen verschiedenen Modellen planen müssen
- Mehrere Google Cloud-Konten haben und einheitlich verwalten möchten

## Unterstützte Modelle

mystatus zeigt die Kredite der folgenden 4 Modelle an:

| Anzeigename | API-Key (Haupt/Reserve) | Beschreibung |
|--- | --- | ---|
| G3 Pro | `gemini-3-pro-high` / `gemini-3-pro-low` | Gemini 3 Pro Hochleistungs-Version |
| G3 Image | `gemini-3-pro-image` | Gemini 3 Pro-Bildgenerierung |
| G3 Flash | `gemini-3-flash` | Gemini 3 Flash-Schnellversion |
| Claude | `claude-opus-4-5-thinking` / `claude-opus-4-5` | Claude Opus 4.5-Modell |

## Folgen Sie mir

### Schritt 1: Abfragebefehl ausführen

**Warum**
Schnell alle Google Cloud-Kontokredite abrufen

```
/mystatus
```

**Was Sie sehen sollten**
Enthält alle konfigurierten Plattformkredite, der Google Cloud-Abschnitt zeigt ähnlich folgenden Inhalt:

```
## Google Cloud Account Quota

### user@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%
```

### Schritt 2: Ausgabeformat verstehen

**Warum**
Schnell Schlüsselinformationen lokalisieren: verbleibender Kredit und Rücksetzzeit

Jedes Zeilenformat:
```
[Modellname] [Rücksetzzeit] [Fortschrittsbalken] [Verbleibender Prozentsatz]
```

### Schritt 3: Mehrere Konten anzeigen

**Warum**
Wenn Sie mehrere Google Cloud-Konten haben, werden sie separat angezeigt

```
### user@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%

### another@gmail.com

G3 Pro     2h 30m     ████████████░░░░░░░░ 75%
G3 Image   2h 30m     ██████████░░░░░░░░ 50%
```

## Häufige Fehler

### Problem: Google Cloud-Kredit nicht sichtbar

**Mögliche Ursachen**:
- opencode-antigravity-auth-Plugin nicht installiert
- Google OAuth-Authentifizierung nicht abgeschlossen
- Datei antigravity-accounts.json nicht vorhanden oder leer

**Lösung**:
1. Installieren Sie das opencode-antigravity-auth-Plugin
2. Schließen Sie die Authentifizierung gemäß der GitHub-Repository-Dokumentation ab
3. Führen Sie `/mystatus` erneut aus

### Problem: Konto zeigt Fehler

**Mögliche Ursachen**:
- Refresh-Token abgelaufen
- projectId fehlt

**Lösung**:
1. Authentifizieren Sie das Konto erneut mit dem opencode-antigravity-auth-Plugin
2. Stellen Sie sicher, dass die Projekt-ID während der Authentifizierung korrekt festgelegt wurde

## Zusammenfassung

- Google Cloud Antigravity unterstützt 4 Modelle: G3 Pro, G3 Image, G3 Flash, Claude
- Jedes Modell hat einen unabhängigen Kredit und eine Rücksetzzeit
- Unterstützt Verwaltung mehrerer Konten, jedes Konto zeigt separat 4 Modellkredite
- Wenn die Nutzung 80% überschreitet, wird ein Warnhinweis angezeigt

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Google Cloud-Erweiterte Konfiguration: Mehrere Konten und Modellverwaltung](../../advanced/google-setup/)**.
>
> Sie werden lernen:
> - Wie man mehrere Google Cloud-Konten hinzufügt und verwaltet
> - Verstehen der Zuordnungsbeziehung der 4 Modelle
> - Unterschied zwischen projectId und managedProjectId

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
| Modellkonfiguration | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L69-L78) | 69-78 |
| Kontoabfragelogik | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L304-L370) | 304-370 |

**Wichtige Funktionen**:
- `queryGoogleUsage()`: Fragt alle Antigravity-Kontokredite ab
- `fetchAccountQuota()`: Fragt Kredit eines einzelnen Kontos ab
- `extractModelQuotas()`: Extrahiert 4 Modellkredite aus der API-Antwort
- `formatAccountQuota()`: Formatiert die Kreditanzeige eines einzelnen Kontos

</details>

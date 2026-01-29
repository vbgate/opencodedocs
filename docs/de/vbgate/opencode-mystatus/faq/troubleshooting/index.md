---
title: "FAQ: Fehlerbehebung | opencode-mystatus"
sidebarTitle: "FAQ"
subtitle: "FAQ: Fehlerbehebung"
description: "Lösen Sie häufige Probleme beim opencode-mystatus-Plugin. Beheben Sie Fehler wie Token-Ablauf, Berechtigungsprobleme und API-Fehler mit detaillierten Lösungen."
tags:
  - "Fehlerbehebung"
  - "Häufige Fragen"
  - "Token-Ablauf"
  - "Berechtigungsprobleme"
prerequisite:
  - "start-quick-start"
order: 1
---

# Häufige Fragen: Kreditabfrage fehlgeschlagen, Token abgelaufen, Berechtigungsprobleme

## Problemlösungsliste

### Problem 1: Authentifizierungsdatei kann nicht gelesen werden

**Fehlermeldung**:

```
❌ Kann Authentifizierungsdatei nicht lesen: ~/.local/share/opencode/auth.json
Fehler: ENOENT: no such file or directory
```

**Lösung**:

1. Stellen Sie sicher, dass OpenCode installiert ist
2. Konfigurieren Sie mindestens eine Plattform in OpenCode

### Problem 2: Keine konfigurierten Konten gefunden

**Fehlermeldung**:

```
Keine konfigurierten Konten gefunden.
```

**Lösung**:

1. Überprüfen Sie den Inhalt von auth.json
2. Konfigurieren Sie mindestens eine Plattform

### Problem 3: OpenAI OAuth-Token abgelaufen

**Fehlermeldung**:

```
⚠️ OAuth-Autorisierung abgelaufen
```

**Lösung**:

1. Verwenden Sie einmal das OpenAI-Modell in OpenCode
2. Der Token wird automatisch aktualisiert

### Problem 4: API-Anfrage fehlgeschlagen (allgemein)

**Fehlermeldung**:

```
OpenAI-API-Anfrage fehlgeschlagen (401): Unauthorized
```

**Lösung**:

1. Überprüfen Sie Token oder API-Key
2. Überprüfen Sie Netzwerkverbindung

### Problem 5: Anfrage-Timeout

**Fehlermeldung**:

```
Anfrage-Timeout (10 Sekunden)
```

**Lösung**:

1. Überprüfen Sie Netzwerkverbindung
2. Überprüfen Sie Proxy-Einstellungen

### Problem 6: GitHub Copilot-Kreditabfrage nicht verfügbar

**Fehlermeldung**:

```
⚠️ GitHub Copilot-Kreditabfrage vorübergehend nicht verfügbar.
```

**Lösung**:

Erstellen Sie ein Fine-grained PAT mit "Plan"-Leseberechtigung.

### Problem 7: Google Cloud project_id fehlt

**Fehlermeldung**:

```
⚠️ project_id fehlt, kann Kredit nicht abfragen.
```

**Lösung**:

Fügen Sie projectId zur antigravity-accounts.json hinzu.

## Zusammenfassung

Die meisten Fehler können durch Konfiguration oder erneute Autorisierung gelöst werden. Das Scheitern einer Plattform beeinträchtigt nicht die Abfrage anderer Plattformen.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Fehlerbehandlungsmainlogik | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 41-87 |

</details>

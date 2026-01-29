---
title: "Copilot: OAuth & PAT | opencode-mystatus"
sidebarTitle: "Copilot-Auth"
subtitle: "Copilot: OAuth & PAT"
description: "Lernen Sie die Konfiguration von GitHub Copilot OAuth-Token und Fine-grained PAT. Lösen Sie Berechtigungsprobleme und erstellen Sie PAT für stabile Kreditabfragen."
tags:
  - "GitHub Copilot"
  - "OAuth-Authentifizierung"
  - "PAT-Konfiguration"
  - "Berechtigungsprobleme"
prerequisite:
  - "start-quick-start"
  - "platforms-copilot-usage"
order: 2
---

# Copilot-Authentifizierungskonfiguration: OAuth-Token und Fine-grained PAT

## Was Sie nach diesem Tutorial können

- Die beiden Authentifizierungsmethoden von Copilot verstehen: OAuth-Token und Fine-grained PAT
- Das Problem unzureichender OAuth-Token-Berechtigungen lösen
- Fine-grained PAT erstellen und Abonnementstypen konfigurieren
- Copilot Premium Requests-Kredite erfolgreich abfragen

## Wann sollten Sie dies verwenden?

Wenn Sie:
- Die Meldung "OpenCode neue OAuth-Integration unterstützt keinen Zugriff auf Kredit-API" sehen
- Die stabilere Fine-grained PAT-Methode zur Kreditabfrage verwenden möchten
- Copilot-Kreditabfrage für Teams- oder Unternehmenskonten konfigurieren müssen

## Grundlegende Idee

mystatus unterstützt **zwei Copilot-Authentifizierungsmethoden**:

| Authentifizierungsmethode | Beschreibung | Vorteile | Nachteile |
|--- | --- | --- | ---|
| **OAuth-Token** (Standard) | GitHub-OAuth-Token bei Anmeldung in OpenCode | Keine zusätzliche Konfiguration, sofort einsatzbereit | Neue OpenCode-OAuth-Token haben möglicherweise keine Copilot-Berechtigung |
| **Fine-grained PAT** (empfohlen) | Vom Benutzer manuell erstellter Fine-grained Personal Access Token | Stabil, zuverlässig, keine Abhängigkeit von OAuth-Berechtigungen | Muss einmal manuell erstellt werden |

## Folgen Sie mir

### Schritt 1: Fine-grained PAT erstellen

1. Besuchen Sie https://github.com/settings/tokens?type=beta
2. Erstellen Sie einen neuen Fine-grained Token
3. Wählen Sie unter "Account permissions" **Plan** → **Read**
4. Erstellen Sie die Konfigurationsdatei `~/.config/opencode/copilot-quota-token.json`:

```json
{
  "token": "github_pat_11A...",
  "username": "your-username",
  "tier": "pro"
}
```

### Schritt 2: Abonnementstyp bestimmen

Wählen Sie Ihren Abonnementstyp aus:

| Abonnementstyp | Monatliche Kredit | Beschreibung |
|--- | --- | ---|
| `free` | 50 | Copilot Free (Kostenlose Benutzer) |
| `pro` | 300 | Copilot Pro (Standardpersonalversion) |
| `pro+` | 1500 | Copilot Pro+ (Erweiterte Personalversion) |
| `business` | 300 | Copilot Business (Teamgeschäftsversion) |
| `enterprise` | 1000 | Copilot Enterprise (Unternehmensversion) |

### Schritt 3: Konfiguration verifizieren

Führen Sie `/mystatus` aus. Sie sollten die Copilot-Kreditinformationen sehen.

## Zusammenfassung

- **OAuth-Token** (Standard): Automatisch abgerufen, aber möglicherweise Berechtigungsprobleme
- **Fine-grained PAT** (empfohlen): Manuelle Konfiguration, stabil und zuverlässig

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcodepositionen anzuzeigen</strong></summary>

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
|--- | --- | ---|

</details>

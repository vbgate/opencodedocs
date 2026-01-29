---
title: "API-Endpunkte: Übersicht | opencode-mystatus"
sidebarTitle: "API-Endpunkte"
subtitle: "API-Endpunktesammlung"
description: "Lernen Sie die offiziellen API-Endpunkte von OpenAI, Zhipu AI, Z.ai, Google Cloud und GitHub Copilot kennen, die das Plugin verwendet."
tags:
  - "api"
  - "endpunkte"
  - "referenz"
prerequisite:
  - "appendix-data-models"
order: 2
---

# API-Endpunktesammlung

## Was Sie nach diesem Tutorial können

- Alle offiziellen API-Endpunkte kennen, die das Plugin aufruft
- Authentifizierungsmethoden verschiedener Plattformen (OAuth / API-Key) verstehen
- Anfrageformate und Antwortdatenstrukturen meistern
- Wissen, wie Sie diese APIs unabhängig aufrufen

## OpenAI-Endpunkt

### Kreditabfrage

**API-Informationen**:

| Projekt | Wert |
|--- | ---|
| URL | `https://chatgpt.com/backend-api/wham/usage` |
| Methode | GET |
| Authentifizierung | Bearer Token (OAuth) |
| Quellcodeposition | `plugin/lib/openai.ts:127-155` |

## Zhipu AI-Endpunkt

### Kreditabfrage

**API-Informationen**:

| Projekt | Wert |
|--- | ---|
| URL | `https://bigmodel.cn/api/monitor/usage/quota/limit` |
| Methode | GET |
| Authentifizierung | API-Key |

## Z.ai-Endpunkt

### Kreditabfrage

**API-Informationen**:

| Projekt | Wert |
|--- | ---|
| URL | `https://api.z.ai/api/monitor/usage/quota/limit` |
| Methode | GET |
| Authentifizierung | API-Key |

## Google Cloud-Endpunkt

### 1. Access-Token aktualisieren

**API-Informationen**:

| Projekt | Wert |
|--- | ---|
| URL | `https://oauth2.googleapis.com/token` |
| Methode | POST |
| Authentifizierung | OAuth Refresh Token |

### 2. Verfügbare Modellkredite abfragen

**API-Informationen**:

| Projekt | Wert |
|--- | ---|
| URL | `https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels` |
| Methode | POST |
| Authentifizierung | Bearer Token (OAuth) |

## GitHub Copilot-Endpunkt

### 1. Öffentliche Billing API (empfohlen)

**API-Informationen**:

| Projekt | Wert |
|--- | ---|
| URL | `https://api.github.com/users/{username}/settings/billing/premium_request/usage` |
| Methode | GET |
| Authentifizierung | Fine-grained PAT |

### 2. Interne Quota-API (alt)

**API-Informationen**:

| Projekt | Wert |
|--- | ---|
| URL | `https://api.github.com/copilot_internal/user` |
| Methode | GET |
| Authentifizierung | Copilot Session Token |

## Anfrage-Timeout

Alle API-Anfragen haben ein 10-Sekunden-Timeout-Limit:

| Konfiguration | Wert | Quellcodeposition |
|--- | --- | ---|
| Timeout-Zeit | 10 Sekunden | `plugin/lib/types.ts:114` |

## Sicherheit

### API-Key-Maskierung

Das Plugin maskiert API-Keys automatisch bei der Anzeige und zeigt nur erste und letzte 2 Zeichen:

**Quellcodeposition**: `plugin/lib/utils.ts:130-139`

### Datenspeicherung

- Alle Authentifizierungsdateien sind **nur schreibgeschützt**, das Plugin modifiziert keine Dateien
- API-Antwortdaten werden **nicht zwischengespeichert**, **nicht gespeichert**
- Sensible Informationen (API-Key, Token) werden im Speicher maskiert angezeigt

## Zusammenfassung

| Plattform | API-Anzahl | Authentifizierung |
|--- | --- | ---|
| OpenAI | 1 | OAuth Bearer Token |
| Zhipu AI | 1 | API-Key |
| Z.ai | 1 | API-Key |
| Google Cloud | 2 | OAuth Refresh Token + Access Token |
| GitHub Copilot | 3 | Fine-grained PAT / Copilot Session Token |

Alle Endpunkte sind offizielle APIs der jeweiligen Plattformen, wodurch die Zuverlässigkeit und Sicherheit der Datenquelle gewährleistet wird.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
|--- | --- | ---|

**Wichtige Konstanten**:

- `OPENAI_USAGE_URL = "https://chatgpt.com/backend-api/wham/usage"`: OpenAI-Kreditabfrage-Endpunkt

</details>

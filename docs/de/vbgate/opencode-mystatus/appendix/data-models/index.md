---
title: "Datenmodelle: Auth & API | opencode-mystatus"
sidebarTitle: "Datenmodelle"
subtitle: "Datenmodelle: Auth & API"
description: "Erfahren Sie, wie opencode-mystatus Auth-Dateien liest und API-Antworten analysiert. Dieser Anhang definiert Datentypen für OpenAI, Zhipu AI, Z.ai, GitHub Copilot und Google Cloud."
tags:
  - "Datenmodelle"
  - "Authentifizierungsdatei"
  - "API-Antwort"
prerequisite:
  - "start-quick-start"
order: 1
---

# Datenmodle: Struktur der Authentifizierungsdatei und API-Antwortformate

> 💡 **Dieser Anhang ist für Entwickler gedacht**: Wenn Sie wissen möchten, wie das Plugin Authentifizierungsdateien liest und analysiert, oder Unterstützung für neue Plattformen erweitern möchten, finden Sie hier vollständige Referenzmaterialien für Datenmodle.

## Was Sie nach diesem Anhang können

- Wissen, welche Authentifizierungsdateien das Plugin liest
- API-Antwortformate verschiedener Plattformen verstehen
- Wissen, wie man Unterstützung für neue Plattformen erweitert

## Dieser Anhang behandelt

- Struktur der Authentifizierungsdateien (3 Konfigurationsdateien)
- API-Antwortformate (5 Plattformen)
- Interne Datentypen

## Authentifizierungsdateistruktur

### Hauptauthentifizierungsdatei: `~/.local/share/opencode/auth.json`

Offizieller Authentifizierungsspeicher von OpenCode, das Plugin liest hier Authentifizierungsinformationen von OpenAI, Zhipu AI, Z.ai und GitHub Copilot aus.

```typescript
interface AuthData {
  /** OpenAI-OAuth-Authentifizierung */
  openai?: OpenAIAuthData;

  /** Zhipu AI-API-Authentifizierung */
  "zhipuai-coding-plan"?: ZhipuAuthData;

  /** Z.ai-API-Authentifizierung */
  "zai-coding-plan"?: ZhipuAuthData;

  /** GitHub Copilot-OAuth-Authentifizierung */
  "github-copilot"?: CopilotAuthData;
}
```

## API-Antwortformate

### OpenAI-Antwortformat

**API-Endpunkt**: `GET https://chatgpt.com/backend-api/wham/usage`

**Authentifizierung**: Bearer Token (OAuth Access Token)

```typescript
interface OpenAIUsageResponse {
  /** Plantyp: plus, team, pro usw. */
  plan_type: string;

  /** Kreditbegrenzungsinformation */
  rate_limit: {
    /** Wurde das Limit erreicht? */
    limit_reached: boolean;

    /** Hauptfenster (3 Stunden) */
    primary_window: RateLimitWindow;

    /** Nebenfenster (24 Stunden, optional) */
    secondary_window: RateLimitWindow | null;
  } | null;
}
```

### Zhipu AI / Z.ai-Antwortformat

**API-Endpunkte**:
- Zhipu AI: `GET https://bigmodel.cn/api/monitor/usage/quota/limit`
- Z.ai: `GET https://api.z.ai/api/monitor/usage/quota/limit`

**Authentifizierung**: Authorization Header (API Key)

```typescript
interface QuotaLimitResponse {
  code: number;   // Bei Erfolg 200
  msg: string;    // Fehlermeldung (bei Erfolg "success")
  data: {
    limits: UsageLimitItem[];
  };
  success: boolean;
}
```

### GitHub Copilot-Antwortformat

Copilot unterstützt zwei API-Abfragemethoden mit unterschiedlichen Antwortformaten.

#### Methode 1: Interne API (benötigt Copilot-Berechtigung)

**API-Endpunkt**: `GET https://api.github.com/copilot_internal/user`

```typescript
interface CopilotUsageResponse {
  /** Copilot-Plantyp */
  copilot_plan: string;

  /** Quoterücksetzdatum (Format: YYYY-MM) */
  quota_reset_date: string;

  /** Quotenschnappschuss */
  quota_snapshots: QuotaSnapshots;
}
```

## Interne Datentypen

### Abfrageergebnistyp

Alle Plattformabfragefunktionen geben ein einheitliches Ergebnisformat zurück.

```typescript
interface QueryResult {
  /** Erfolgreich? */
  success: boolean;

  /** Ausgabeinhalt bei Erfolg */
  output?: string;

  /** Fehlermeldung bei Fehler */
  error?: string;
}
```

### Konfigurationen

```typescript
/** Warnungsschwelle für hohe Nutzung (Prozent) */
export const HIGH_USAGE_THRESHOLD = 80;

/** API-Anfrage-Timeout (Millisekunden) */
export const REQUEST_TIMEOUT_MS = 10000;
```

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
| Authentifizierungsdatentypen | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L99-L104) | 99-104  |

**Wichtige Typen**:
- `QueryResult`: Abfrageergebnistyp (types.ts:15-19)

</details>

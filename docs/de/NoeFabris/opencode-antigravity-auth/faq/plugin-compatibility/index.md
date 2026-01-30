---
title: "Plugin-Kompatibilität: Lösung häufiger Plugin-Konflikte | Antigravity Auth"
sidebarTitle: "Was tun bei Plugin-Konflikten"
subtitle: "Lösung von Kompatibilitätsproblemen mit anderen Plugins"
description: "Lernen Sie, wie Sie Kompatibilitätsprobleme zwischen Antigravity Auth und Plugins wie oh-my-opencode, DCP usw. lösen. Konfigurieren Sie die richtige Plugin-Reihenfolge und deaktivieren Sie konfliktreiche Authentifizierungsmethoden."
tags:
  - "FAQ"
  - "Plugin-Konfiguration"
  - "oh-my-opencode"
  - "DCP"
  - "OpenCode"
  - "Antigravity"
prerequisite:
  - "start-quick-install"
order: 4
---

# Lösung von Kompatibilitätsproblemen mit anderen Plugins

**Plugin-Kompatibilität** ist ein häufiges Problem bei der Verwendung von Antigravity Auth. Verschiedene Plugins können miteinander konfliktieren, was zu Authentifizierungsfehlern, verlorenen Thinking Blocks oder falschen Anfrageformaten führt. Dieses Tutorial hilft Ihnen bei der Lösung von Kompatibilitätsproblemen mit Plugins wie oh-my-opencode, DCP usw.

## Was Sie lernen können

- Konfigurieren Sie die Plugin-Ladereihenfolge korrekt, um Probleme mit DCP zu vermeiden
- Deaktivieren Sie konfliktreiche Authentifizierungsmethoden in oh-my-opencode
- Identifizieren und entfernen Sie unnötige Plugins
- Aktivieren Sie PID-Offset für Szenarien mit parallelen Agents

## Häufige Kompatibilitätsprobleme

### Problem 1: Konflikt mit oh-my-opencode

**Symptome**:
- Authentifizierungsfehler oder wiederholte OAuth-Autorisierungsfenster
- Modellanfragen geben 400- oder 401-Fehler zurück
- Agent-Modellkonfigurationen wirken nicht

**Ursache**: oh-my-opencode aktiviert standardmäßig die integrierte Google-Authentifizierung, was mit dem OAuth-Flow von Antigravity Auth konfliktiert.

::: warning Kernproblem
oh-my-opencode fängt alle Google-Modellanfragen ab und verwendet seine eigene Authentifizierungsmethode. Dies verhindert die Verwendung von OAuth-Tokens von Antigravity Auth.
:::

**Lösung**:

Bearbeiten Sie `~/.config/opencode/oh-my-opencode.json` und fügen Sie die folgende Konfiguration hinzu:

```json
{
  "google_auth": false,
  "agents": {
    "frontend-ui-ux-engineer": { "model": "google/antigravity-gemini-3-pro" },
    "document-writer": { "model": "google/antigravity-gemini-3-flash" },
    "multimodal-looker": { "model": "google/antigravity-gemini-3-flash" }
  }
}
```

**Konfigurationserklärung**:

| Konfiguration | Wert | Erklärung |
|--- | --- | ---|
| `google_auth` | `false` | Deaktiviert die integrierte Google-Authentifizierung von oh-my-opencode |
| `agents.<agent-name>.model` | `google/antigravity-*` | Überschreibt das Agent-Modell mit einem Antigravity-Modell |

**Kontrollpunkte ✅**:

- Starten Sie OpenCode nach dem Speichern der Konfiguration neu
- Testen Sie, ob der Agent Antigravity-Modelle verwendet
- Überprüfen Sie, ob kein OAuth-Autorisierungsfenster mehr angezeigt wird

---

### Problem 2: Konflikt mit DCP (@tarquinen/opencode-dcp)

**Symptome**:
- Claude Thinking-Modell gibt Fehler zurück: `thinking must be first block in message`
- Thinking Blocks fehlen im Konversationsverlauf
- Thinking-Inhalte können nicht angezeigt werden

**Ursache**: Die von DCP erstellten synthetic assistant messages (synthetische Assistenten-Nachrichten) enthalten keine thinking blocks, was mit den Anforderungen der Claude API konfliktiert.

::: info Was sind synthetic messages?
Synthetic messages sind automatisch von Plugins oder Systemen generierte Nachrichten, die zum Reparieren des Konversationsverlaufs oder zum Ergänzen fehlender Nachrichten verwendet werden. DCP erstellt diese Nachrichten in bestimmten Szenarien, fügt aber keine thinking blocks hinzu.
:::

**Lösung**:

Stellen Sie sicher, dass Antigravity Auth **vor** DCP geladen wird. Bearbeiten Sie `~/.config/opencode/config.json`:

```json
{
  "plugin": [
    "opencode-antigravity-auth@latest",
    "@tarquinen/opencode-dcp@latest"
  ]
}
```

**Warum ist diese Reihenfolge erforderlich?**:

- Antigravity Auth verarbeitet und repariert thinking blocks
- DCP erstellt synthetic messages (möglicherweise ohne thinking blocks)
- Wenn DCP zuerst geladen wird, kann Antigravity Auth die von DCP erstellten Nachrichten nicht reparieren

**Kontrollpunkte ✅**:

- Überprüfen Sie, ob `opencode-antigravity-auth` vor `@tarquinen/opencode-dcp` steht
- Starten Sie OpenCode neu
- Testen Sie, ob Thinking-Inhalte im Thinking-Modell korrekt angezeigt werden

---

### Problem 3: Kontozuweisung in Szenarien mit parallelen Agents

**Symptome**:
- Mehrere parallele Agents verwenden dasselbe Konto
- Alle Agents scheitern gleichzeitig bei Rate-Limits
- Niedrige Quota-Auslastung

**Ursache**: Standardmäßig teilen sich mehrere parallele Agents dieselbe Kontoselektionslogik, was dazu führen kann, dass sie gleichzeitig dasselbe Konto verwenden.

::: tip Szenario mit parallelen Agents
Wenn Sie die parallele Funktion von Cursor verwenden (z. B. gleichzeitige Ausführung mehrerer Agents), initiiert jeder Agent Modellanfragen unabhängig. Ohne korrekte Kontozuweisung können sie "kollidieren".
:::

**Lösung**:

Bearbeiten Sie `~/.config/opencode/antigravity.json` und aktivieren Sie PID-Offset:

```json
{
  "pid_offset_enabled": true
}
```

**Was ist PID-Offset?**

PID (Process ID)-Offset lässt jeden parallelen Agent einen anderen Startindex für Konten verwenden:

```
Agent 1 (PID 100) → Konto 0
Agent 2 (PID 101) → Konto 1
Agent 3 (PID 102) → Konto 2
```

Dadurch wird selbst bei gleichzeitigen Anfragen nicht dasselbe Konto verwendet.

**Voraussetzungen**:
- Mindestens 2 Google-Konten erforderlich
- Empfehlung: Aktivieren Sie `account_selection_strategy: "round-robin"` oder `"hybrid"`

**Kontrollpunkte ✅**:

- Bestätigen Sie, dass mehrere Konten konfiguriert sind (führen Sie `opencode auth list` aus)
- Aktivieren Sie `pid_offset_enabled: true`
- Testen Sie, ob parallele Agents unterschiedliche Konten verwenden (prüfen Sie die Debug-Logs)

---

### Problem 4: Unnötige Plugins

**Symptome**:
- Authentifizierungskonflikte oder doppelte Authentifizierung
- Plugin-Ladefehler oder Warnmeldungen
- Konfigurationsverwirrung, unklar welche Plugins wirksam sind

**Ursache**: Installation von Plugins mit überlappenden Funktionen.

::: tip Überprüfung redundanter Plugins
Überprüfen Sie regelmäßig die Plugin-Liste in `config.json` und entfernen Sie unnötige Plugins, um Konflikte und Leistungsprobleme zu vermeiden.
:::

**Unnötige Plugins**:

| Plugin-Typ | Beispiel | Grund |
|--- | --- | ---|
| **gemini-auth Plugins** | `opencode-gemini-auth`, `@username/gemini-auth` | Antigravity Auth verarbeitet bereits alle Google OAuth |
| **Claude-Authentifizierungs-Plugins** | `opencode-claude-auth` | Antigravity Auth verwendet keine Claude-Authentifizierung |

**Lösung**:

Entfernen Sie diese Plugins aus `~/.config/opencode/config.json`:

```json
{
  "plugin": [
    "opencode-antigravity-auth@latest"
    // Entfernen Sie diese:
    // "opencode-gemini-auth@latest",
    // "@username/gemini-auth@latest"
  ]
}
```

**Kontrollpunkte ✅**:

- Zeigen Sie die Plugin-Liste in `~/.config/opencode/config.json` an
- Entfernen Sie alle gemini-auth-bezogenen Plugins
- Starten Sie OpenCode neu und bestätigen Sie, dass keine Authentifizierungskonflikte bestehen

---

## Fehlerbehebung bei häufigen Fehlern

### Fehler 1: `thinking must be first block in message`

**Mögliche Ursachen**:
- DCP wird vor Antigravity Auth geladen
- Session Recovery von oh-my-opencode konfliktiert mit Antigravity Auth

**Fehlerbehebungsschritte**:

1. Überprüfen Sie die Plugin-Ladereihenfolge:
   ```bash
   grep -A 10 '"plugin"' ~/.config/opencode/config.json
   ```

2. Stellen Sie sicher, dass Antigravity Auth vor DCP geladen wird

3. Wenn das Problem weiterhin besteht, versuchen Sie, die Session Recovery von oh-my-opencode zu deaktivieren (falls vorhanden)

### Fehler 2: `invalid_grant` oder Authentifizierungsfehler

**Mögliche Ursachen**:
- `google_auth` von oh-my-opencode ist nicht deaktiviert
- Mehrere Authentifizierungs-Plugins versuchen gleichzeitig, Anfragen zu verarbeiten

**Fehlerbehebungsschritte**:

1. Überprüfen Sie die oh-my-opencode-Konfiguration:
   ```bash
   cat ~/.config/opencode/oh-my-opencode.json | grep google_auth
   ```

2. Stellen Sie sicher, dass der Wert `false` ist

3. Entfernen Sie andere gemini-auth Plugins

### Fehler 3: Alle parallelen Agents verwenden dasselbe Konto

**Mögliche Ursachen**:
- `pid_offset_enabled` ist nicht aktiviert
- Anzahl der Konten ist kleiner als Anzahl der Agents

**Fehlerbehebungsschritte**:

1. Überprüfen Sie die Antigravity-Konfiguration:
   ```bash
   cat ~/.config/opencode/antigravity.json | grep pid_offset
   ```

2. Stellen Sie sicher, dass der Wert `true` ist

3. Überprüfen Sie die Anzahl der Konten:
   ```bash
   opencode auth list
   ```

4. Wenn die Anzahl der Konten kleiner als die Anzahl der Agents ist, fügen Sie weitere Konten hinzu

---

## Konfigurationsbeispiele

### Vollständiges Konfigurationsbeispiel (mit oh-my-opencode)

```json
// ~/.config/opencode/config.json
{
  "plugin": [
    "opencode-antigravity-auth@latest",
    "@tarquinen/opencode-dcp@latest",
    "oh-my-opencode@latest"
  ]
}
```

```json
// ~/.config/opencode/antigravity.json
{
  "pid_offset_enabled": true,
  "account_selection_strategy": "hybrid"
}
```

```json
// ~/.config/opencode/oh-my-opencode.json
{
  "google_auth": false,
  "agents": {
    "frontend-ui-ux-engineer": { "model": "google/antigravity-gemini-3-pro" },
    "document-writer": { "model": "google/antigravity-gemini-3-flash" },
    "multimodal-looker": { "model": "google/antigravity-gemini-3-flash" }
  }
}
```

---

## Zusammenfassung

Plugin-Kompatibilitätsprobleme resultieren meist aus Authentifizierungskonflikten, Plugin-Ladereihenfolge oder überlappenden Funktionen. Durch korrekte Konfiguration:

- ✅ Deaktivieren Sie die integrierte Google-Authentifizierung von oh-my-opencode (`google_auth: false`)
- ✅ Stellen Sie sicher, dass Antigravity Auth vor DCP geladen wird
- ✅ Aktivieren Sie PID-Offset für parallele Agents (`pid_offset_enabled: true`)
- ✅ Entfernen Sie redundante gemini-auth Plugins

Diese Konfigurationen vermeiden die meisten Kompatibilitätsprobleme und lassen Ihre OpenCode-Umgebung stabil laufen.

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir das **[Migrationshandbuch](../migration-guide/)**.
>
> Sie werden lernen:
> - Migration von Kontokonfigurationen zwischen verschiedenen Maschinen
> - Umgang mit Konfigurationsänderungen bei Version-Upgrades
> - Sicherung und Wiederherstellung von Kontodaten

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-23

| Funktion        | Dateipfad                                                                                    | Zeilennummer    |
|--- | --- | ---|
| Verarbeitung von Thinking blocks | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts#L898-L930)         | 898-930 |
| Cache für Thinking-Block-Signaturen | [`src/plugin/cache/signature-cache.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/cache/signature-cache.ts) | Gesamte Datei |
| PID-Offset-Konfiguration | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts#L69-L72)               | 69-72   |
| Session Recovery (basierend auf oh-my-opencode) | [`src/plugin/recovery/index.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/index.ts)          | Gesamte Datei   |

**Wichtige Konfigurationen**:
- `pid_offset_enabled: true`: Aktiviert Prozess-ID-Offset, um parallele Agents mit verschiedenen Konten zu versehen
- `account_selection_strategy: "hybrid"`: Intelligente hybride Kontoselektionsstrategie

**Wichtige Funktionen**:
- `deepFilterThinkingBlocks()`: Entfernt alle thinking blocks (request-helpers.ts:898)
- `filterThinkingBlocksWithSignatureCache()`: Filtert thinking blocks basierend auf Signatur-Cache (request-helpers.ts:1183)

</details>

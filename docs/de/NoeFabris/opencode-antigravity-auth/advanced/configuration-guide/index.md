---
title: "Konfigurationsanleitung: Vollständige Optionen erklärt | Antigravity Auth"
sidebarTitle: "Konfiguration meistern"
subtitle: "Vollständige Anleitung zu allen Konfigurationsoptionen"
description: "Beherrschen Sie alle Konfigurationsoptionen des Antigravity Auth Plugins. Detaillierte Erklärungen zu Konfigurationsdateipfaden, Modellverhalten, Konto-Rotationsstrategien und Anwendungseinstellungen mit empfohlenen Konfigurationen für Einzel-, Multi-Account- und parallele Agenten-Szenarien."
tags:
  - "Konfiguration"
  - "Erweiterte Konfiguration"
  - "Multi-Account"
  - "Konto-Rotation"
prerequisite:
  - "start-quick-install"
  - "advanced-multi-account-setup"
order: 2
---

# Vollständige Anleitung zu Konfigurationsoptionen

## Was Sie lernen werden

- ✅ Konfigurationsdateien am richtigen Ort erstellen
- ✅ Die passende Konfiguration für Ihr Nutzungsszenario wählen
- ✅ Alle Konfigurationsoptionen und ihre Standardwerte verstehen
- ✅ Umgebungsvariablen zur temporären Überschreibung nutzen
- ✅ Modellverhalten, Konto-Rotation und Plugin-Verhalten anpassen

## Ihre aktuelle Herausforderung

Zu viele Konfigurationsoptionen und Sie wissen nicht, wo Sie anfangen sollen? Die Standardkonfiguration funktioniert, aber Sie möchten weiter optimieren? Bei Multi-Account-Szenarien unsicher, welche Rotationsstrategie die richtige ist?

## Das Grundkonzept

Eine Konfigurationsdatei ist wie eine „Bedienungsanleitung" für das Plugin – Sie sagen ihm, wie es arbeiten soll, und es führt Ihre Anweisungen aus. Das Antigravity Auth Plugin bietet umfangreiche Konfigurationsoptionen, aber die meisten Benutzer müssen nur wenige Kernoptionen konfigurieren.

### Priorität der Konfigurationsdateien

Die Priorität der Konfigurationsquellen von hoch nach niedrig:

1. **Umgebungsvariablen** (temporäre Überschreibung)
2. **Projektspezifische Konfiguration** `.opencode/antigravity.json` (aktuelles Projekt)
3. **Benutzerspezifische Konfiguration** `~/.config/opencode/antigravity.json` (global)

::: info
Umgebungsvariablen haben die höchste Priorität und eignen sich für temporäre Tests. Konfigurationsdateien sind für dauerhafte Einstellungen gedacht.
:::

### Speicherort der Konfigurationsdateien

Je nach Betriebssystem unterscheidet sich der Speicherort der benutzerspezifischen Konfigurationsdatei:

| System | Pfad |
| --- | --- |
| Linux/macOS | `~/.config/opencode/antigravity.json` |
| Windows | `%APPDATA%\opencode\antigravity.json` |

Die projektspezifische Konfigurationsdatei befindet sich immer unter `.opencode/antigravity.json` im Projektstammverzeichnis.

### Kategorien der Konfigurationsoptionen

Die Konfigurationsoptionen sind in vier Hauptkategorien unterteilt:

1. **Modellverhalten**: Thinking-Blöcke, Sitzungswiederherstellung, Google Search
2. **Konto-Rotation**: Multi-Account-Verwaltung, Auswahlstrategie, PID-Offset
3. **Anwendungsverhalten**: Debug-Protokolle, automatische Updates, Benachrichtigungen stumm schalten
4. **Erweiterte Einstellungen**: Fehlerwiederherstellung, Token-Verwaltung, Gesundheitsbewertung

---

## 🎒 Voraussetzungen

- [x] Plugin-Installation abgeschlossen (siehe [Schnellinstallation](../../start/quick-install/))
- [x] Mindestens ein Google-Konto konfiguriert
- [x] Grundkenntnisse der JSON-Syntax

---

## Schritt-für-Schritt-Anleitung

### Schritt 1: Konfigurationsdatei erstellen

**Warum**: Die Konfigurationsdatei lässt das Plugin nach Ihren Anforderungen arbeiten

Erstellen Sie die Konfigurationsdatei am entsprechenden Pfad für Ihr Betriebssystem:

::: code-group

```bash [macOS/Linux]
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json"
}
EOF
```

```powershell [Windows]
## Mit PowerShell
$env:APPDATA\opencode\antigravity.json = @{
  '$schema' = "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json"
} | ConvertTo-Json -Depth 10

Set-Content -Path "$env:APPDATA\opencode\antigravity.json" -Value $json
```

:::

**Erwartetes Ergebnis**: Die Datei wurde erfolgreich erstellt und enthält nur das `$schema`-Feld.

::: tip
Nach dem Hinzufügen des `$schema`-Feldes bietet VS Code automatisch intelligente Vorschläge und Typprüfung.
:::

### Schritt 2: Grundoptionen konfigurieren

**Warum**: Optimieren Sie das Plugin-Verhalten für Ihr Nutzungsszenario

Wählen Sie eine der folgenden Konfigurationen basierend auf Ihrem Szenario:

**Szenario A: Einzelkonto + Google Search benötigt**

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "sticky",
  "web_search": {
    "default_mode": "auto"
  }
}
```

**Szenario B: 2-3 Konten + intelligente Rotation**

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "hybrid",
  "web_search": {
    "default_mode": "auto"
  }
}
```

**Szenario C: Multi-Account + parallele Agenten**

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin",
  "switch_on_first_rate_limit": true,
  "pid_offset_enabled": true,
  "web_search": {
    "default_mode": "auto"
  }
}
```

**Erwartetes Ergebnis**: Die Konfigurationsdatei wurde erfolgreich gespeichert und OpenCode lädt die Plugin-Konfiguration automatisch neu.

### Schritt 3: Konfiguration überprüfen

**Warum**: Bestätigen, dass die Konfiguration wirksam ist

Senden Sie eine Modellanfrage in OpenCode und beobachten Sie:

1. Einzelkonto mit `sticky`-Strategie: Alle Anfragen verwenden dasselbe Konto
2. Multi-Account mit `hybrid`-Strategie: Anfragen werden intelligent auf verschiedene Konten verteilt
3. Gemini-Modell mit aktivierter `web_search`: Das Modell durchsucht bei Bedarf das Web

**Erwartetes Ergebnis**: Das Plugin-Verhalten entspricht Ihrer Konfiguration.

---

## Detaillierte Erklärung der Konfigurationsoptionen

### Modellverhalten

Diese Optionen beeinflussen, wie das Modell denkt und antwortet.

#### keep_thinking

| Wert | Standard | Beschreibung |
| --- | --- | --- |
| `true` | - | Claude-Thinking-Blöcke beibehalten, Kohärenz über Runden hinweg |
| `false` | ✓ | Thinking-Blöcke entfernen, stabiler, kleinerer Kontext |

::: warning Hinweis
Das Aktivieren von `keep_thinking` kann zu Modellinstabilität und Signaturfehlern führen. Es wird empfohlen, `false` beizubehalten.
:::

#### session_recovery

| Wert | Standard | Beschreibung |
| --- | --- | --- |
| `true` | ✓ | Automatische Wiederherstellung von Sitzungen, die während Tool-Aufrufen unterbrochen wurden |
| `false` | - | Keine automatische Wiederherstellung bei Fehlern |

#### auto_resume

| Wert | Standard | Beschreibung |
| --- | --- | --- |
| `true` | - | Nach Wiederherstellung automatisch "continue" senden |
| `false` | ✓ | Nach Wiederherstellung nur Hinweis anzeigen, manuell fortfahren |

#### resume_text

Benutzerdefinierter Text, der bei der Wiederherstellung gesendet wird. Standard ist `"continue"`, Sie können ihn beliebig ändern.

#### web_search

| Option | Standard | Beschreibung |
| --- | --- | --- |
| `default_mode` | `"off"` | `"auto"` oder `"off"` |
| `grounding_threshold` | `0.3` | Suchschwellenwert (0=immer suchen, 1=nie suchen) |

::: info
`grounding_threshold` ist nur wirksam, wenn `default_mode: "auto"`. Je höher der Wert, desto zurückhaltender sucht das Modell.
:::

---

### Konto-Rotation

Diese Optionen verwalten die Anfragenverteilung bei mehreren Konten.

#### account_selection_strategy

| Strategie | Standard | Anwendungsfall |
| --- | --- | --- |
| `sticky` | - | Einzelkonto, Prompt-Cache beibehalten |
| `round-robin` | - | 4+ Konten, maximaler Durchsatz |
| `hybrid` | ✓ | 2-3 Konten, intelligente Rotation |

::: tip
Empfohlene Strategien nach Kontoanzahl:
- 1 Konto → `sticky`
- 2-3 Konten → `hybrid`
- 4+ Konten → `round-robin`
- Parallele Agenten → `round-robin` + `pid_offset_enabled: true`
:::

#### switch_on_first_rate_limit

| Wert | Standard | Beschreibung |
| --- | --- | --- |
| `true` | ✓ | Bei erstem 429-Fehler sofort Konto wechseln |
| `false` | - | Erst aktuelles Konto erneut versuchen, bei zweitem 429 wechseln |

#### pid_offset_enabled

| Wert | Standard | Beschreibung |
| --- | --- | --- |
| `true` | - | Verschiedene Sitzungen (PID) verwenden unterschiedliche Startkonten |
| `false` | ✓ | Alle Sitzungen beginnen mit demselben Konto |

::: tip
Bei Einzelsitzung `false` beibehalten, um Anthropic Prompt-Cache zu erhalten. Bei mehreren parallelen Sitzungen `true` empfohlen.
:::

#### quota_fallback

| Wert | Standard | Beschreibung |
| --- | --- | --- |
| `true` | - | Gemini-Modell Quota-Pool-Fallback |
| `false` | ✓ | Kein Fallback aktivieren |

::: info
Nur für Gemini-Modelle. Wenn der Haupt-Quota-Pool erschöpft ist, wird der Backup-Quota-Pool desselben Kontos versucht.
:::

---

### Anwendungsverhalten

Diese Optionen steuern das Verhalten des Plugins selbst.

#### quiet_mode

| Wert | Standard | Beschreibung |
| --- | --- | --- |
| `true` | - | Die meisten Toast-Benachrichtigungen stumm schalten (außer Wiederherstellungsbenachrichtigungen) |
| `false` | ✓ | Alle Benachrichtigungen anzeigen |

#### debug

| Wert | Standard | Beschreibung |
| --- | --- | --- |
| `true` | - | Debug-Protokollierung aktivieren |
| `false` | ✓ | Keine Debug-Protokolle aufzeichnen |

::: tip
Um Debug-Protokolle temporär zu aktivieren, ohne die Konfigurationsdatei zu ändern, verwenden Sie Umgebungsvariablen:
```bash
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode   # Basis-Protokolle
OPENCODE_ANTIGRAVITY_DEBUG=2 opencode   # Detaillierte Protokolle
```
:::

#### log_dir

Benutzerdefiniertes Verzeichnis für Debug-Protokolle. Standard ist `~/.config/opencode/antigravity-logs/`.

#### auto_update

| Wert | Standard | Beschreibung |
| --- | --- | --- |
| `true` | ✓ | Automatisch nach Updates suchen und Plugin aktualisieren |
| `false` | - | Nicht automatisch aktualisieren |

---

### Erweiterte Einstellungen

Diese Optionen sind für Randfälle gedacht; die meisten Benutzer müssen sie nicht ändern.

<details>
<summary><strong>Erweiterte Einstellungen anzeigen</strong></summary>

#### Fehlerwiederherstellung

| Option | Standard | Beschreibung |
| --- | --- | --- |
| `empty_response_max_attempts` | `4` | Wiederholungsversuche bei leerer Antwort |
| `empty_response_retry_delay_ms` | `2000` | Verzögerung zwischen Versuchen (Millisekunden) |
| `tool_id_recovery` | `true` | Tool-ID-Nichtübereinstimmung beheben |
| `claude_tool_hardening` | `true` | Tool-Parameter-Halluzinationen verhindern |
| `max_rate_limit_wait_seconds` | `300` | Maximale Wartezeit bei Rate-Limiting (0=unbegrenzt) |

#### Token-Verwaltung

| Option | Standard | Beschreibung |
| --- | --- | --- |
| `proactive_token_refresh` | `true` | Token vor Ablauf proaktiv aktualisieren |
| `proactive_refresh_buffer_seconds` | `1800` | 30 Minuten vor Ablauf aktualisieren |
| `proactive_refresh_check_interval_seconds` | `300` | Prüfintervall für Aktualisierung (Sekunden) |

#### Signatur-Cache (wirksam bei `keep_thinking: true`)

| Option | Standard | Beschreibung |
| --- | --- | --- |
| `signature_cache.enabled` | `true` | Festplatten-Cache aktivieren |
| `signature_cache.memory_ttl_seconds` | `3600` | Speicher-Cache-TTL (1 Stunde) |
| `signature_cache.disk_ttl_seconds` | `172800` | Festplatten-Cache-TTL (48 Stunden) |
| `signature_cache.write_interval_seconds` | `60` | Hintergrund-Schreibintervall (Sekunden) |

#### Gesundheitsbewertung (verwendet bei `hybrid`-Strategie)

| Option | Standard | Beschreibung |
| --- | --- | --- |
| `health_score.initial` | `70` | Anfängliche Gesundheitspunkte |
| `health_score.success_reward` | `1` | Belohnungspunkte bei Erfolg |
| `health_score.rate_limit_penalty` | `-10` | Strafpunkte bei Rate-Limiting |
| `health_score.failure_penalty` | `-20` | Strafpunkte bei Fehler |
| `health_score.recovery_rate_per_hour` | `2` | Wiederherstellungspunkte pro Stunde |
| `health_score.min_usable` | `50` | Mindestpunktzahl für nutzbares Konto |
| `health_score.max_score` | `100` | Maximale Gesundheitspunkte |

#### Token Bucket (verwendet bei `hybrid`-Strategie)

| Option | Standard | Beschreibung |
| --- | --- | --- |
| `token_bucket.max_tokens` | `50` | Maximale Bucket-Kapazität |
| `token_bucket.regeneration_rate_per_minute` | `6` | Regenerationsrate pro Minute |
| `token_bucket.initial_tokens` | `50` | Anfängliche Token-Anzahl |

</details>

---

## Empfohlene Konfigurationen

### Einzelkonto-Konfiguration

Geeignet für: Benutzer mit nur einem Google-Konto

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "sticky",
  "web_search": {
    "default_mode": "auto"
  }
}
```

**Erklärung**:
- `sticky`: Keine Rotation, Anthropic Prompt-Cache beibehalten
- `web_search: auto`: Gemini kann bei Bedarf suchen

### Konfiguration für 2-3 Konten

Geeignet für: Kleine Teams oder Benutzer, die etwas Flexibilität benötigen

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "hybrid",
  "web_search": {
    "default_mode": "auto"
  }
}
```

**Erklärung**:
- `hybrid`: Intelligente Rotation, Gesundheitsbewertung wählt das beste Konto
- `web_search: auto`: Gemini kann bei Bedarf suchen

### Multi-Account + Parallele Agenten-Konfiguration

Geeignet für: Benutzer, die mehrere gleichzeitige Agenten ausführen

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin",
  "switch_on_first_rate_limit": true,
  "pid_offset_enabled": true,
  "web_search": {
    "default_mode": "auto"
  }
}
```

**Erklärung**:
- `round-robin`: Konto bei jeder Anfrage wechseln
- `switch_on_first_rate_limit: true`: Bei erstem 429 sofort wechseln
- `pid_offset_enabled: true`: Verschiedene Sitzungen verwenden unterschiedliche Startkonten
- `web_search: auto`: Gemini kann bei Bedarf suchen

---

## Häufige Fehler vermeiden

### ❌ Fehler: Konfigurationsänderungen werden nicht wirksam

**Ursache**: OpenCode hat die Konfigurationsdatei möglicherweise nicht neu geladen.

**Lösung**: OpenCode neu starten oder JSON-Syntax auf Fehler prüfen.

### ❌ Fehler: JSON-Formatfehler in der Konfigurationsdatei

**Ursache**: JSON-Syntaxfehler (fehlendes Komma, überflüssiges Komma, Kommentare usw.).

**Lösung**: JSON-Validierungstool verwenden oder `$schema`-Feld hinzufügen, um IDE-Intelligenz zu aktivieren.

### ❌ Fehler: Umgebungsvariablen werden nicht wirksam

**Ursache**: Variablenname falsch geschrieben oder OpenCode nicht neu gestartet.

**Lösung**: Variablennamen auf `OPENCODE_ANTIGRAVITY_*` prüfen (Großbuchstaben, korrektes Präfix), OpenCode neu starten.

### ❌ Fehler: Häufige Fehler nach Aktivierung von `keep_thinking: true`

**Ursache**: Thinking-Block-Signatur stimmt nicht überein.

**Lösung**: `keep_thinking: false` beibehalten (Standardwert) oder `signature_cache`-Konfiguration anpassen.

---

## Zusammenfassung

Priorität der Konfigurationsdateien: Umgebungsvariablen > Projektebene > Benutzerebene.

Kernkonfigurationsoptionen:
- Modellverhalten: `keep_thinking`, `session_recovery`, `web_search`
- Konto-Rotation: `account_selection_strategy`, `pid_offset_enabled`
- Anwendungsverhalten: `debug`, `quiet_mode`, `auto_update`

Empfohlene Konfigurationen nach Szenario:
- Einzelkonto: `sticky`
- 2-3 Konten: `hybrid`
- 4+ Konten: `round-robin`
- Parallele Agenten: `round-robin` + `pid_offset_enabled: true`

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Debug-Protokollierung](../debug-logging/)**.
>
> Sie werden lernen:
> - Wie Sie Debug-Protokolle aktivieren
> - Wie Sie Protokollinhalte interpretieren
> - Wie Sie häufige Probleme beheben

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um Quellcode-Speicherorte anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-23

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| Konfigurations-Schema-Definition | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 12-323 |
| Standard-Konfigurationswerte | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 325-373 |
| Konfigurations-Ladelogik | [`src/plugin/config/loader.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/loader.ts) | 1-100 |

**Wichtige Konstanten**:
- `DEFAULT_CONFIG`: Standardwerte aller Konfigurationsoptionen

**Wichtige Typen**:
- `AntigravityConfig`: Konfigurationsobjekt-Typ
- `AccountSelectionStrategy`: Kontoauswahl-Strategie-Typ
- `SignatureCacheConfig`: Signatur-Cache-Konfigurationstyp

</details>

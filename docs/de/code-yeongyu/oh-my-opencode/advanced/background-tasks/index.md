---
title: "Hintergrundaufgaben: Parallele Ausführung mehrerer Agents | oh-my-opencode"
sidebarTitle: "Mehrere KIs gleichzeitig arbeiten lassen"
subtitle: "Hintergrundaufgaben: Parallele Ausführung mehrerer Agents | oh-my-opencode"
description: "Lernen Sie die parallele Ausführungsfähigkeit des Hintergrundaufgabensystems von oh-my-opencode kennen. Beherrschen Sie die dreistufige Parallelitätssteuerung, den Aufgabenlebenszyklus und die Verwendung der Tools delegate_task und background_output."
tags:
  - "background-tasks"
  - "parallel-execution"
  - "concurrency"
prerequisite:
  - "start-sisyphus-orchestrator"
order: 80
---

# Parallele Hintergrundaufgaben: Wie ein Team arbeiten

## Was Sie nach diesem Tutorial können

- ✅ Mehrere parallele Hintergrundaufgaben starten und verschiedene KI-Agents gleichzeitig arbeiten lassen
- ✅ Parallelitätslimits konfigurieren, um API-Rate-Limits und Kostenexplosionen zu vermeiden
- ✅ Ergebnisse von Hintergrundaufgaben abrufen, ohne auf den Abschluss zu warten
- ✅ Aufgaben abbrechen und Ressourcen freigeben

## Ihr aktuelles Problem

**Nur eine Person arbeitet?**

Stellen Sie sich folgendes Szenario vor:
- Sie müssen den **Explore**-Agenten die Authentifizierungsimplementierung im Code-Repository suchen lassen
- Gleichzeitig soll der **Librarian**-Agent die Best Practices recherchieren
- Und der **Oracle**-Agent die Architekturüberprüfung durchführen

Bei sequentieller Ausführung: Gesamtdauer = 10 Minuten + 15 Minuten + 8 Minuten = **33 Minuten**

Aber bei paralleler Ausführung? Alle 3 Agents arbeiten gleichzeitig, Gesamtdauer = **max(10, 15, 8) = 15 Minuten**, Zeitersparnis von **54%**.

**Problem**: Standardmäßig verarbeitet OpenCode nur eine Sitzung gleichzeitig. Um Parallelität zu erreichen, müssen Sie mehrere Fenster manuell verwalten oder auf den Abschluss von Aufgaben warten.

**Lösung**: Das Hintergrundaufgabensystem von oh-my-opencode kann mehrere KI-Agents gleichzeitig ausführen und ihren Fortschritt im Hintergrund verfolgen, während Sie andere Aufgaben erledigen können.

## Wann Sie diese Technik verwenden

Szenarien, in denen das Hintergrundaufgabensystem die Effizienz steigert:

| Szenario | Beispiel | Wert |
|--- | --- | ---|
| **Parallele Recherche** | Explore sucht Implementierung + Librarian liest Dokumentation | 3-fache Geschwindigkeit bei der Recherche |
| **Multi-Expert-Review** | Oracle prüft Architektur + Momus validiert Plan | Schnelles Feedback aus mehreren Perspektiven |
| **Asynchrone Aufgaben** | Code-Review parallel zum Git-Commit | Blockiert nicht den Hauptprozess |
| **Ressourcenbeschränkung** | Parallelitätslimit zur Vermeidung von API-Rate-Limits | Kostenkontrolle und Stabilität |

::: tip Ultrawork-Modus
Fügen Sie `ultrawork` oder `ulw` in den Prompt ein, um automatisch den Höchstleistungsmodus zu aktivieren, einschließlich aller spezialisierten Agents und paralleler Hintergrundaufgaben. Keine manuelle Konfiguration erforderlich.
:::

## 🎒 Vorbereitungen

::: warning Voraussetzungen

Bevor Sie mit diesem Tutorial beginnen, stellen Sie sicher:
1. oh-my-opencode ist installiert (siehe [Installationsanleitung](../../start/installation/))
2. Die Grundkonfiguration ist abgeschlossen, mindestens ein AI-Provider ist verfügbar
3. Sie sind mit der grundlegenden Verwendung des Sisyphus-Orchestrators vertraut (siehe [Sisyphus-Tutorial](../sisyphus-orchestrator/))

:::

## Kernkonzepte

Die Funktionsweise des Hintergrundaufgabensystems lässt sich in drei Kernkonzepte zusammenfassen:

### 1. Parallele Ausführung

Das Hintergrundaufgabensystem ermöglicht es Ihnen, mehrere KI-Agent-Aufgaben gleichzeitig zu starten, wobei jede Aufgabe in einer unabhängigen Sitzung ausgeführt wird. Das bedeutet:

- **Explore** sucht Code
- **Librarian** liest Dokumentation
- **Oracle** prüft Design

Alle drei Aufgaben laufen parallel ab, die Gesamtdauer entspricht der langsamsten Aufgabe.

### 2. Parallelitätssteuerung

Um zu vermeiden, dass zu viele Aufgaben gleichzeitig gestartet werden und API-Rate-Limits oder Kostenexplosionen auftreten, bietet das System dreistufige Parallelitätslimits:

```
Priorität: Model > Provider > Default

Beispielkonfiguration:
modelConcurrency:     claude-opus-4-5 → 2
providerConcurrency:  anthropic → 3
defaultConcurrency:   Alle → 5
```

**Regeln**:
- Wenn ein model-spezifisches Limit definiert ist, wird dieses verwendet
- Andernfalls, wenn ein provider-spezifisches Limit definiert ist, wird dieses verwendet
- Andernfalls wird das Standardlimit verwendet (Standardwert 5)

### 3. Polling-Mechanismus

Das System prüft alle 2 Sekunden den Aufgabenstatus, um zu bestimmen, ob eine Aufgabe abgeschlossen ist. Abschlussbedingungen:

- **Sitzung ist idle** (session.idle-Ereignis)
- **Stabilitätsprüfung**: 3 aufeinanderfolgende Pollings ohne Änderung der Nachrichtenanzahl
- **TODO-Liste ist leer**: Alle Aufgaben sind abgeschlossen

## Folgen Sie mir

### Schritt 1: Hintergrundaufgaben starten

Verwenden Sie das Tool `delegate_task`, um Hintergrundaufgaben zu starten:

```markdown
Starten Sie parallele Hintergrundaufgaben:

1. Explore sucht Authentifizierungsimplementierung
2. Librarian recherchiert Best Practices
3. Oracle prüft Architekturdesign

Parallele Ausführung:
```

**Warum**
Dies ist das klassische Szenario zur Demonstration von Hintergrundaufgaben. Alle 3 Aufgaben können gleichzeitig durchgeführt werden, was die Zeit drastisch reduziert.

**Was Sie sehen sollten**
Das System gibt 3 Aufgaben-IDs zurück:

```
Background task launched successfully.

Task ID: bg_abc123
Session ID: sess_xyz789
Description: Explore: 查找认证实现
Agent: explore
Status: pending
...

Background task launched successfully.

Task ID: bg_def456
Session ID: sess_uvwx012
Description: Librarian: 研究最佳实践
Agent: librarian
Status: pending
...
```

::: info Aufgabestatus-Erklärung
- **pending**: Wartet auf Parallelitäts-Slot
- **running**: Wird ausgeführt
- **completed**: Abgeschlossen
- **error**: Fehler aufgetreten
- **cancelled**: Abgebrochen
:::

### Schritt 2: Aufgabenstatus prüfen

Verwenden Sie das Tool `background_output`, um den Aufgabenstatus anzuzeigen:

```markdown
Prüfen Sie den Status von bg_abc123:
```

**Warum**
Erfahren Sie, ob die Aufgabe abgeschlossen ist oder noch läuft. Standardmäßig wird nicht gewartet, der Status wird sofort zurückgegeben.

**Was Sie sehen sollten**
Wenn die Aufgabe noch läuft:

```
## Task Status

| Field | Value |
|--- | ---|
| Task ID | `bg_abc123` |
| Description | Explore: 查找认证实现 |
| Agent | explore |
| Status | **running** |
| Duration | 2m 15s |
| Session ID | `sess_xyz789` |

> **Note**: No need to wait explicitly - system will notify you when this task completes.

## Original Prompt

查找 src/auth 目录下的认证实现，包括登录、注册、Token 管理等
```

Wenn die Aufgabe abgeschlossen ist:

```
Task Result

Task ID: bg_abc123
Description: Explore: 查找认证实现
Duration: 5m 32s
Session ID: sess_xyz789

---

找到了 3 个认证实现：
1. `src/auth/login.ts` - JWT 认证
2. `src/auth/register.ts` - 用户注册
3. `src/auth/token.ts` - Token 刷新
...
```

### Schritt 3: Parallelitätssteuerung konfigurieren

Bearbeiten Sie `~/.config/opencode/oh-my-opencode.json`:

```jsonc
{
  "$schema": "https://code-yeongyu.github.io/oh-my-opencode/schema.json",

  "background_task": {
    // Provider-spezifische Parallelitätslimits (empfohlene Einstellung)
    "providerConcurrency": {
      "anthropic": 3,     // Maximal 3 Anthropic-Modelle gleichzeitig
      "openai": 2,         // Maximal 2 OpenAI-Modelle gleichzeitig
      "google": 2          // Maximal 2 Google-Modelle gleichzeitig
    },

    // Model-spezifische Parallelitätslimits (höchste Priorität)
    "modelConcurrency": {
      "claude-opus-4-5": 2,    // Maximal 2 Opus 4.5 gleichzeitig
      "gpt-5.2": 2              // Maximal 2 GPT 5.2 gleichzeitig
    },

    // Standard-Parallelitätslimit (wird verwendet, wenn nichts anderes konfiguriert ist)
    "defaultConcurrency": 3
  }
}
```

**Warum**
Parallelitätssteuerung ist der Schlüssel zur Vermeidung von Kostenexplosionen. Wenn Sie kein Limit festlegen und gleichzeitig 10 Opus 4.5-Aufgaben starten, können Sie sofort große API-Kontingente verbrauchen.

::: tip Empfohlene Einstellungen
Für die meisten Szenarien werden folgende Einstellungen empfohlen:
- `providerConcurrency.anthropic: 3`
- `providerConcurrency.openai: 2`
- `defaultConcurrency: 5`
:::

**Was Sie sehen sollten**
Nachdem die Konfiguration wirksam ist, beim Starten von Hintergrundaufgaben:
- Wenn das Parallelitätslimit erreicht ist, gehen Aufgaben in den **pending**-Status und warten
- Sobald eine Aufgabe abgeschlossen ist, starten wartende Aufgaben automatisch

### Schritt 4: Aufgaben abbrechen

Verwenden Sie das Tool `background_cancel`, um Aufgaben abzubrechen:

```markdown
Brechen Sie alle Hintergrundaufgaben ab:
```

**Warum**
Manchmal bleiben Aufgaben hängen oder werden nicht mehr benötigt, dann können Sie sie aktiv abbrechen und Ressourcen freigeben.

**Was Sie sehen sollten**

```
Cancelled 3 background task(s):

| Task ID | Description | Status | Session ID |
|--- | --- | --- | ---|
| `bg_abc123` | Explore: 查找认证实现 | running | `sess_xyz789` |
| `bg_def456` | Librarian: 研究最佳实践 | running | `sess_uvwx012` |
| `bg_ghi789` | Oracle: 审查架构设计 | pending | (not started) |

## Continue Instructions

To continue a cancelled task, use:

    delegate_task(session_id="<session_id>", prompt="Continue: <your follow-up>")

Continuable sessions:
- `sess_xyz789` (Explore: 查找认证实现)
- `sess_uvwx012` (Librarian: 研究最佳实践)
```

## Checkpoint ✅

Bestätigen Sie, dass Sie folgende Punkte verstanden haben:

- [ ] Mehrere parallele Hintergrundaufgaben starten können
- [ ] Aufgabestatus verstehen (pending, running, completed)
- [ ] Angemessene Parallelitätslimits konfiguriert haben
- [ ] Aufgabenstatus und Ergebnisse abrufen können
- [ ] Nicht benötigte Aufgaben abbrechen können

## Häufige Fallstricke

### Falle 1: Vergessen, Parallelitätslimits zu konfigurieren

**Symptome**: Zu viele Aufgaben gestartet, API-Kontingente sofort aufgebraucht, oder Rate-Limits erreicht.

**Lösung**: Konfigurieren Sie `providerConcurrency` oder `defaultConcurrency` in `oh-my-opencode.json`.

### Falle 2: Zu häufiges Polling der Ergebnisse

**Symptome**: Alle paar Sekunden `background_output` aufrufen, um den Aufgabenstatus zu prüfen, was unnötigen Overhead verursacht.

**Lösung**: Das System benachrichtigt Sie automatisch, wenn Aufgaben abgeschlossen sind. Prüfen Sie nur manuell, wenn Sie wirklich Zwischenergebnisse benötigen.

### Falle 3: Aufgaben-Timeout

**Symptome**: Aufgaben werden nach mehr als 30 Minuten automatisch abgebrochen.

**Ursache**: Hintergrundaufgaben haben eine TTL (Timeout-Zeit) von 30 Minuten.

**Lösung**: Wenn Sie langlaufende Aufgaben benötigen, erwägen Sie, sie in mehrere Teilaufgaben aufzuteilen, oder verwenden Sie `delegate_task(background=false)` für die Vordergrundausführung.

### Falle 4: Pending-Aufgaben starten nicht

**Symptome**: Aufgabenstatus bleibt `pending`, geht nicht in `running` über.

**Ursache**: Parallelitätslimit ist voll, keine verfügbaren Slots.

**Lösung**:
- Warten Sie, bis vorhandene Aufgaben abgeschlossen sind
- Erhöhen Sie die Parallelitätslimit-Konfiguration
- Brechen Sie nicht benötigte Aufgaben ab, um Slots freizugeben

## Zusammenfassung

Das Hintergrundaufgabensystem ermöglicht es Ihnen, wie ein echtes Team zu arbeiten, wobei mehrere KI-Agents Aufgaben parallel ausführen:

1. **Parallele Aufgaben starten**: Verwenden Sie das Tool `delegate_task`
2. **Parallelität steuern**: Konfigurieren Sie `providerConcurrency`, `modelConcurrency`, `defaultConcurrency`
3. **Ergebnisse abrufen**: Verwenden Sie das Tool `background_output` (das System benachrichtigt automatisch)
4. **Aufgaben abbrechen**: Verwenden Sie das Tool `background_cancel`

**Kernregeln**:
- Alle 2 Sekunden wird der Aufgabenstatus geprüft
- Aufgabe gilt als abgeschlossen, wenn 3-mal stabil oder idle
- Aufgaben werden nach 30 Minuten automatisch timeout
- Priorität: modelConcurrency > providerConcurrency > defaultConcurrency

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[LSP und AST-Grep: Code-Refactoring-Werkzeuge](../lsp-ast-tools/)**.
>
> Sie werden lernen:
> - Wie Sie LSP-Tools für Code-Navigation und Refactoring verwenden
> - Wie Sie AST-Grep für präzise Mustersuche und -ersetzung verwenden
> - Best Practices für die kombinierte Verwendung von LSP und AST-Grep

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-26

| Funktion | Dateipfad | Zeilen |
|--- | --- | ---|
|--- | --- | ---|
| Parallelitätssteuerung | [`src/features/background-agent/concurrency.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/background-agent/concurrency.ts) | 1-138 |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|

**Wichtige Konstanten**:
- `TASK_TTL_MS = 30 * 60 * 1000`: Aufgaben-Timeout (30 Minuten)
- `MIN_STABILITY_TIME_MS = 10 * 1000`: Startzeit der Stabilitätsprüfung (10 Sekunden)
- `DEFAULT_STALE_TIMEOUT_MS = 180_000`: Standard-Timeout (3 Minuten)
- `MIN_IDLE_TIME_MS = 5000`: Minimale Zeit zum Ignorieren von frühem idle (5 Sekunden)

**Wichtige Klassen**:
- `BackgroundManager`: Hintergrundaufgaben-Manager, verantwortlich für Starten, Verfolgen, Polling und Abschließen von Aufgaben
- `ConcurrencyManager`: Parallelitätssteuerungs-Manager, implementiert dreistufige Priorität (model > provider > default)

**Wichtige Funktionen**:
- `BackgroundManager.launch()`: Hintergrundaufgabe starten
- `BackgroundManager.pollRunningTasks()`: Alle 2 Sekunden Aufgabenstatus prüfen (Zeile 1182)
- `BackgroundManager.tryCompleteTask()`: Aufgabe sicher abschließen, Race-Conditions verhindern (Zeile 909)
- `ConcurrencyManager.getConcurrencyLimit()`: Parallelitätslimit abrufen (Zeile 24)
- `ConcurrencyManager.acquire()` / `ConcurrencyManager.release()`: Parallelitäts-Slot belegen/freigeben (Zeilen 41, 71)

</details>

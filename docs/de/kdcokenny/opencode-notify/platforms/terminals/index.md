---
title: "Unterstützte Terminals: Vollständige Übersicht über 37+ Terminal-Emulatoren und Automatische Erkennung | opencode-notify Tutorial"
sidebarTitle: "Wird dein Terminal unterstützt"
subtitle: "Liste unterstützter Terminals: Vollständige Übersicht über 37+ Terminal-Emulatoren"
description: "Lerne die 37+ von opencode-notify unterstützten Terminal-Emulatoren kennen, einschließlich der vollständigen Terminal-Listen für macOS, Windows und Linux. Dieses Tutorial erklärt die Prinzipien der automatischen Terminal-Erkennung, manuelle Spezifikationsmethoden und Lösungen für Terminal-Erkennungsfehler, um deine Benachrichtigungserfahrung zu optimieren, intelligente Filterfunktionen zu aktivieren, Benachrichtigungsstörungen zu vermeiden, Fensterwechsel zu reduzieren, den Fokus bei der Arbeit zu bewahren und Produktivität sowie Benutzererfahrung effektiv zu steigern."
tags:
- "Terminal"
- "Terminal-Erkennung"
- "Plattform-Unterstützung"
prerequisite:
- "start-quick-start"
order: 60
---

# Liste unterstützter Terminals: Vollständige Übersicht über 37+ Terminal-Emulatoren

## Was du nach diesem Tutorial können wirst

- Alle von opencode-notify unterstützten Terminal-Emulatoren kennenlernen
- Überprüfen, ob dein verwendetes Terminal in der Unterstützungsliste enthalten ist
- Die Funktionsweise der automatischen Terminal-Erkennung verstehen
- Lernen, wie man den Terminal-Typ manuell angibt

## Deine aktuelle Situation

Du hast opencode-notify installiert, aber die Benachrichtigungsfunktion funktioniert nicht richtig. Möglicherweise wird das Terminal nicht erkannt oder die Fokuserkennung funktioniert nicht. Du verwendest Alacritty / Windows Terminal / tmux und bist dir nicht sicher, ob es unterstützt wird. Fehler bei der Terminal-Erkennung führen dazu, dass intelligente Filterfunktionen nicht funktionieren und die Benutzererfahrung beeinträchtigt wird.

## Wann du diese Informationen brauchst

**Überprüfe die Liste der unterstützten Terminals in folgenden Szenarien**:
- Du möchtest wissen, ob dein verwendetes Terminal unterstützt wird
- Die automatische Terminal-Erkennung schlägt fehl und muss manuell konfiguriert werden
- Du wechselst zwischen mehreren Terminals und möchtest die Kompatibilität kennenlernen
- Du möchtest die technischen Prinzipien der Terminal-Erkennung verstehen

## Kernkonzept

opencode-notify verwendet die Bibliothek `detect-terminal`, um deinen Terminal-Emulator automatisch zu erkennen und **unterstützt 37+ Terminals**. Nach erfolgreicher Erkennung kann das Plugin:
- **Fokuserkennung aktivieren** (nur macOS): Benachrichtigungen unterdrücken, wenn das Terminal im Vordergrund ist
- **Klick-Fokus unterstützen** (nur macOS): Durch Klicken auf die Benachrichtigung zum Terminal-Fenster wechseln

::: info Warum ist die Terminal-Erkennung wichtig?

Die Terminal-Erkennung ist die Grundlage für intelligente Filterung:
- **Fokuserkennung**: Verhindert, dass Benachrichtigungen erscheinen, während du das Terminal betrachtest
- **Klick-Fokus**: macOS-Benutzer können durch Klicken auf die Benachrichtigung direkt zum Terminal zurückkehren
- **Leistungsoptimierung**: Verschiedene Terminals erfordern möglicherweise spezielle Behandlung

Wenn die Erkennung fehlschlägt, funktionieren die Benachrichtigungen weiterhin, aber die intelligente Filterung wird deaktiviert.
:::

## Liste der unterstützten Terminals

### macOS-Terminals

| Terminal-Name | Prozessname | Funktionen |
| --- | --- | --- |
| **Ghostty** | Ghostty | ✅ Fokuserkennung + ✅ Klick-Fokus |
| **iTerm2** | iTerm2 | ✅ Fokuserkennung + ✅ Klick-Fokus |
| **Kitty** | kitty | ✅ Fokuserkennung + ✅ Klick-Fokus |
| **WezTerm** | WezTerm | ✅ Fokuserkennung + ✅ Klick-Fokus |
| **Alacritty** | Alacritty | ✅ Fokuserkennung + ✅ Klick-Fokus |
| **Terminal.app** | Terminal | ✅ Fokuserkennung + ✅ Klick-Fokus |
| **Hyper** | Hyper | ✅ Fokuserkennung + ✅ Klick-Fokus |
| **Warp** | Warp | ✅ Fokuserkennung + ✅ Klick-Fokus |
| **VS Code integriertes Terminal** | Code / Code - Insiders | ✅ Fokuserkennung + ✅ Klick-Fokus |

::: tip macOS-Terminal-Funktionen
macOS-Terminals unterstützen die vollständige Funktionalität:
- Native Benachrichtigungen (Notification Center)
- Fokuserkennung (über AppleScript)
- Automatischer Fokus beim Klicken auf Benachrichtigungen
- Benutzerdefinierte Systemtöne

Alle Terminals verwenden das macOS Notification Center zum Senden von Benachrichtigungen.
:::

### Windows-Terminals

| Terminal-Name | Funktionen |
| --- | --- |
| **Windows Terminal** | ✅ Native Benachrichtigungen (Toast) |
| **Git Bash** | ✅ Native Benachrichtigungen (Toast) |
| **ConEmu** | ✅ Native Benachrichtigungen (Toast) |
| **Cmder** | ✅ Native Benachrichtigungen (Toast) |
| **PowerShell** | ✅ Native Benachrichtigungen (Toast) |
| **VS Code integriertes Terminal** | ✅ Native Benachrichtigungen (Toast) |
| **Andere Windows-Terminals** | ✅ Native Benachrichtigungen (Toast) |

::: details Einschränkungen bei Windows-Terminals
Die Funktionalität auf Windows-Plattformen ist relativ grundlegend:
- ✅ Native Benachrichtigungen (Windows Toast)
- ✅ Terminal-Erkennung
- ❌ Fokuserkennung (Systemeinschränkung)
- ❌ Klick-Fokus (Systemeinschränkung)

Alle Windows-Terminals senden Benachrichtigungen über Windows Toast und verwenden den System-Standardton.
:::

### Linux-Terminals

| Terminal-Name | Funktionen |
| --- | --- |
| **konsole** | ✅ Native Benachrichtigungen (notify-send) |
| **xterm** | ✅ Native Benachrichtigungen (notify-send) |
| **lxterminal** | ✅ Native Benachrichtigungen (notify-send) |
| **alacritty** | ✅ Native Benachrichtigungen (notify-send) |
| **kitty** | ✅ Native Benachrichtigungen (notify-send) |
| **wezterm** | ✅ Native Benachrichtigungen (notify-send) |
| **VS Code integriertes Terminal** | ✅ Native Benachrichtigungen (notify-send) |
| **Andere Linux-Terminals** | ✅ Native Benachrichtigungen (notify-send) |

::: details Einschränkungen bei Linux-Terminals
Die Funktionalität auf Linux-Plattformen ist relativ grundlegend:
- ✅ Native Benachrichtigungen (notify-send)
- ✅ Terminal-Erkennung
- ❌ Fokuserkennung (Systemeinschränkung)
- ❌ Klick-Fokus (Systemeinschränkung)

Alle Linux-Terminals senden Benachrichtigungen über notify-send und verwenden den Standardton der Desktop-Umgebung.
:::

### Weitere unterstützte Terminals

Die Bibliothek `detect-terminal` unterstützt auch die folgenden Terminals (möglicherweise unvollständige Liste):

**Windows / WSL**:
- WSL-Terminal
- Windows Command Prompt (cmd)
- PowerShell (pwsh)
- PowerShell Core (pwsh-preview)
- Cygwin Mintty
- MSYS2 MinTTY

**macOS / Linux**:
- tmux (Erkennung über Umgebungsvariablen)
- screen
- rxvt-unicode (urxvt)
- rxvt
- Eterm
- eterm
- aterm
- wterm
- sakura
- roxterm
- xfce4-terminal
- pantheon-terminal
- lxterminal
- mate-terminal
- terminator
- tilix
- guake
- yakuake
- qterminal
- terminology
- deepin-terminal
- gnome-terminal
- konsole
- xterm
- uxterm
- eterm

::: tip Terminal-Statistik
opencode-notify unterstützt durch die Bibliothek `detect-terminal` **37+ Terminal-Emulatoren**.
Wenn dein verwendetes Terminal nicht in der Liste enthalten ist, kannst du die [vollständige Liste von detect-terminal](https://github.com/jonschlinkert/detect-terminal#supported-terminals) einsehen.
:::

## Prinzipien der Terminal-Erkennung

### Automatischer Erkennungsprozess

Beim Start des Plugins wird der Terminal-Typ automatisch erkannt:

```
1. Aufruf der detect-terminal()-Bibliothek
↓
2. Scannen der Systemprozesse, Erkennung des aktuellen Terminals
↓
3. Rückgabe des Terminal-Namens (z.B. "ghostty", "kitty")
↓
4. Suche in der Mapping-Tabelle, Abruf des macOS-Prozessnamens
↓
5. macOS: Dynamischer Abruf der Bundle ID
↓
6. Speichern der Terminal-Informationen für spätere Benachrichtigungen
```

### macOS-Terminal-Mapping-Tabelle

Im Quellcode sind Mapping-Tabellen für gängige Terminals vordefiniert:

```typescript
// src/notify.ts:71-84
const TERMINAL_PROCESS_NAMES: Record<string, string> = {
  ghostty: "Ghostty",
  kitty: "kitty",
  iterm: "iTerm2",
  iterm2: "iTerm2",
  wezterm: "WezTerm",
  alacritty: "Alacritty",
  terminal: "Terminal",
  apple_terminal: "Terminal",
  hyper: "Hyper",
  warp: "Warp",
  vscode: "Code",
  "vscode-insiders": "Code - Insiders",
}
```

::: details Erkennungs-Quellcode
Vollständige Logik der Terminal-Erkennung:

```typescript
// src/notify.ts:145-164
async function detectTerminalInfo(config: NotifyConfig): Promise<TerminalInfo> {
  // Verwendung der Konfigurationsüberschreibung, falls vorhanden
  const terminalName = config.terminal || detectTerminal() || null

  if (!terminalName) {
    return { name: null, bundleId: null, processName: null }
  }

  // Abruf des Prozessnamens für die Fokuserkennung
  const processName = TERMINAL_PROCESS_NAMES[terminalName.toLowerCase()] || terminalName

  // Dynamischer Abruf der Bundle ID von macOS (keine Hardcodierung!)
  const bundleId = await getBundleId(processName)

  return {
    name: terminalName,
    bundleId,
    processName,
  }
}
```

:::

### Besondere Behandlung für macOS

Auf der macOS-Plattform gibt es zusätzliche Erkennungsschritte:

1. **Bundle ID abrufen**: Dynamische Abfrage der Bundle ID der Anwendung über `osascript` (z.B. `com.mitchellh.ghostty`)
2. **Fokuserkennung**: Abfrage des Prozessnamens der Vordergrundanwendung über `osascript`
3. **Klick-Fokus**: Setzen des `activate`-Parameters in der Benachrichtigung, Wechsel zum Terminal über Bundle ID beim Klicken

::: info Vorteile der dynamischen Bundle ID
Der Quellcode hardcoded keine Bundle IDs, sondern fragt sie dynamisch über `osascript` ab. Das bedeutet:
- ✅ Unterstützung von Terminal-Updates (solange die Bundle ID gleich bleibt)
- ✅ Reduzierte Wartungskosten (keine manuelle Aktualisierung der Liste erforderlich)
- ✅ Bessere Kompatibilität (theoretisch werden alle macOS-Terminals unterstützt)
:::

### tmux-Terminal-Unterstützung

tmux ist ein Terminal-Multiplexer, das Plugin erkennt tmux-Sitzungen über Umgebungsvariablen:

```bash
# In einer tmux-Sitzung
echo $TMUX
# Ausgabe: /tmp/tmux-1000/default,1234,0

# Nicht in tmux
echo $TMUX
# Ausgabe: (leer)
```

::: tip tmux-Workflow-Unterstützung
tmux-Benutzer können die Benachrichtigungsfunktion normal verwenden:
- Automatische Erkennung von tmux-Sitzungen
- Benachrichtigungen werden an das aktuelle Terminal-Fenster gesendet
- **Keine Fokuserkennung** (Unterstützung für tmux-Multi-Window-Workflows)
:::

## Manuelle Terminal-Spezifikation

Wenn die automatische Erkennung fehlschlägt, kannst du den Terminal-Typ manuell in der Konfigurationsdatei angeben.

### Wann eine manuelle Spezifikation erforderlich ist

Eine manuelle Konfiguration ist in folgenden Fällen erforderlich:
- Dein verwendetes Terminal ist nicht in der Unterstützungsliste von `detect-terminal` enthalten
- Du verwendest ein Terminal innerhalb eines anderen (z.B. tmux + Alacritty)
- Die automatische Erkennung ist fehlerhaft (fälschlicherweise als anderes Terminal erkannt)

### Konfigurationsmethode

**Schritt 1: Konfigurationsdatei öffnen**

::: code-group

```bash [macOS/Linux]
nano ~/.config/opencode/kdco-notify.json
```

```powershell [Windows]
notepad $env:USERPROFILE\.config\opencode\kdco-notify.json
```

:::

**Schritt 2: Terminal-Konfiguration hinzufügen**

```json
{
  "terminal": "ghostty"
}
```

**Schritt 3: Speichern und OpenCode neu starten**

### Verfügbare Terminal-Namen

Terminal-Namen müssen von der Bibliothek `detect-terminal` erkannt werden. Häufige Namen:

| Terminal | Konfigurationswert |
| --- | --- |
| Ghostty | `"ghostty"` |
| iTerm2 | `"iterm2"` oder `"iterm"` |
| Kitty | `"kitty"` |
| WezTerm | `"wezterm"` |
| Alacritty | `"alacritty"` |
| macOS Terminal | `"terminal"` oder `"apple_terminal"` |
| Hyper | `"hyper"` |
| Warp | `"warp"` |
| VS Code | `"vscode"` |
| VS Code Insiders | `"vscode-insiders"` |
| Windows Terminal | `"windows-terminal"` oder `"Windows Terminal"` |

::: details Vollständige Liste verfügbarer Namen
Siehe [detect-terminal Quellcode](https://github.com/jonschlinkert/detect-terminal) für die vollständige Liste.
:::

### Beispiel für vollständige macOS-Terminal-Funktionalität

```json
{
  "terminal": "ghostty",
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  }
}
```

### Beispiel für Windows/Linux-Terminals

```json
{
  "terminal": "Windows Terminal",
  "notifyChildSessions": false,
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

::: warning Einschränkungen bei Windows/Linux-Konfiguration
Windows und Linux unterstützen keine `sounds`-Konfiguration (Verwendung des System-Standardtons) und keine Fokuserkennung (Systemeinschränkung).
:::

## Checkliste ✅

Nach dem Lesen bitte bestätigen:

- [ ] Ich weiß, ob mein verwendetes Terminal unterstützt wird
- [ ] Ich verstehe die Prinzipien der automatischen Terminal-Erkennung
- [ ] Ich weiß, wie man den Terminal-Typ manuell angibt
- [ ] Ich verstehe die Funktionsunterschiede zwischen den Plattformen

## Warnhinweise

### Häufiges Problem 1: Terminal-Erkennung fehlgeschlagen

**Symptom**: Benachrichtigungen werden nicht angezeigt oder die Fokuserkennung funktioniert nicht.

**Ursache**: `detect-terminal` kann dein Terminal nicht erkennen.

**Lösung**:

1. Überprüfe, ob dein Terminal-Name korrekt ist (Groß-/Kleinschreibung beachten)
2. Manuelle Angabe in der Konfigurationsdatei:

```json
{
  "terminal": "dein-terminal-name"
}
```

3. Siehe [detect-terminal Unterstützungsliste](https://github.com/jonschlinkert/detect-terminal#supported-terminals)

### Häufiges Problem 2: macOS Klick-Fokus funktioniert nicht

**Symptom**: Klicken auf die Benachrichtigung wechselt nicht zum Terminal-Fenster.

**Ursache**: Bundle ID konnte nicht abgerufen werden oder das Terminal ist nicht in der Mapping-Tabelle.

**Lösung**:

1. Überprüfe, ob das Terminal in der `TERMINAL_PROCESS_NAMES`-Mapping-Tabelle enthalten ist
2. Falls nicht, kannst du den Terminal-Namen manuell angeben

**Überprüfungsmethode**:

```typescript
// Temporäres Debugging (console.log in notify.ts hinzufügen)
console.log("Terminal info:", terminalInfo)
// Sollte anzeigen: { name: "ghostty", bundleId: "com.mitchellh.ghostty", processName: "Ghostty" }
```

### Häufiges Problem 3: tmux-Terminal-Fokuserkennung funktioniert nicht

**Symptom**: In einer tmux-Sitzung werden Benachrichtigungen angezeigt, auch wenn das Terminal im Vordergrund ist.

**Ursache**: tmux hat eigene Sitzungsverwaltung, die Fokuserkennung kann ungenau sein.

**Erklärung**: Dies ist normales Verhalten. In tmux-Workflows ist die Fokuserkennung eingeschränkt, aber Benachrichtigungen können weiterhin normal empfangen werden.

### Häufiges Problem 4: VS Code integriertes Terminal wird als Code erkannt

**Symptom**: Sowohl `"vscode"` als auch `"vscode-insiders"` sind in der Konfiguration gültig, aber du weißt nicht, welches du verwenden sollst.

**Erklärung**:
- Verwendest du **VS Code Stable** → Konfiguration `"vscode"`
- Verwendest du **VS Code Insiders** → Konfiguration `"vscode-insiders"`

Die automatische Erkennung wählt automatisch den richtigen Prozessnamen basierend auf der installierten Version.

### Häufiges Problem 5: Windows Terminal Erkennung fehlgeschlagen

**Symptom**: Windows Terminal verwendet den Namen "windows-terminal", wird aber nicht erkannt.

**Ursache**: Der Prozessname von Windows Terminal kann `WindowsTerminal.exe` oder `Windows Terminal` sein.

**Lösung**: Versuche verschiedene Konfigurationswerte:

```json
{
  "terminal": "windows-terminal" // oder "Windows Terminal"
}
```

## Zusammenfassung

In dieser Lektion haben wir gelernt:

- ✅ opencode-notify unterstützt 37+ Terminal-Emulatoren
- ✅ macOS-Terminals unterstützen die vollständige Funktionalität (Fokuserkennung + Klick-Fokus)
- ✅ Windows/Linux-Terminals unterstützen grundlegende Benachrichtigungen
- ✅ Die Prinzipien und Quellcode-Implementierung der automatischen Terminal-Erkennung
- ✅ Wie man den Terminal-Typ manuell angibt
- ✅ Lösungen für häufige Terminal-Erkennungsprobleme

**Wichtige Punkte**:
1. Die Terminal-Erkennung ist die Grundlage für intelligente Filterung und unterstützt 37+ Terminals
2. macOS-Terminals bieten die umfangreichste Funktionalität, Windows/Linux sind relativ grundlegend
3. Bei Fehlern der automatischen Erkennung kann der Terminal-Name manuell konfiguriert werden
4. tmux-Benutzer können Benachrichtigungen normal verwenden, aber die Fokuserkennung ist eingeschränkt
5. Die dynamische Bundle ID-Abfrage auf macOS bietet bessere Kompatibilität

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir die **[Konfigurationsreferenz](../../advanced/config-reference/)** kennen.
>
> Du wirst lernen:
> - Vollständige Erklärung aller Konfigurationsoptionen und Standardwerte
> - Sound-Anpassung (macOS)
> - Konfiguration von Ruhezeiten
> - Schalter für Benachrichtigungen in untergeordneten Sitzungen
> - Überschreiben des Terminal-Typs
> - Erweiterte Konfigurationstechniken

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Erweitern der Quellcode-Positionen</strong></summary>

> Aktualisiert: 2026-01-27

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Terminal-Mapping-Tabelle | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84 |
| Terminal-Erkennungsfunktion | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| macOS Bundle ID Abruf | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L135-L137) | 135-137 |
| macOS Vordergrundanwendungserkennung | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L139-L143) | 139-143 |
| macOS Fokuserkennung | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |

**Wichtige Konstanten**:
- `TERMINAL_PROCESS_NAMES`: Mapping-Tabelle von Terminal-Namen zu macOS-Prozessnamen

**Wichtige Funktionen**:
- `detectTerminalInfo()`: Erkennt Terminal-Informationen (Name, Bundle ID, Prozessname)
- `detectTerminal()`: Ruft die detect-terminal-Bibliothek zur Terminal-Erkennung auf
- `getBundleId()`: Ruft die Bundle ID von macOS-Anwendungen dynamisch über osascript ab
- `getFrontmostApp()`: Abfrage des aktuellen Vordergrundanwendungsnamens
- `isTerminalFocused()`: Erkennt, ob das Terminal das Vordergrundfenster ist (nur macOS)

**Externe Abhängigkeiten**:
- [detect-terminal](https://github.com/jonschlinkert/detect-terminal): Terminal-Erkennungsbibliothek, unterstützt 37+ Terminals

</details>

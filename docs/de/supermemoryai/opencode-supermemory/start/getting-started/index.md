---
title: "Schnellstart: Installation und Konfiguration | opencode-supermemory"
sidebarTitle: "Schnellstart"
subtitle: "Schnellstart: Installation und Konfiguration"
description: "Lernen Sie opencode-supermemory zu installieren und zu konfigurieren. Konfigurieren Sie den API Key, lösen Sie Konflikte und geben Sie dem Agenten persistenten Speicher."
tags:
  - "Installation"
  - "Konfiguration"
  - "Erste Schritte"
prerequisite:
  - ""
order: 1
---

# Schnellstart: Installation und Konfiguration

## Was Sie nach dieser Lektion können

In dieser Lektion lernen Sie:
1. Installieren Sie das **opencode-supermemory**-Plugin in Ihrer OpenCode-Umgebung.
2. Konfigurieren Sie den Supermemory API Key, um die Verbindung zur Cloud-Speicherdatenbank herzustellen.
3. Verifizieren Sie, ob das Plugin erfolgreich geladen wurde.
4. Lösen Sie potenzielle Konflikte mit anderen Plugins (z. B. Oh My OpenCode).

Nach Abschluss verfügt Ihr Agent über die grundlegenden Fähigkeiten zur Verbindung mit der Cloud-Speicherdatenbank.

## Ihre aktuelle Situation

Vielleicht haben Sie bereits bemerkt, dass der OpenCode Agent zwar schlau ist, aber sehr vergesslich:
- Jedes Mal, wenn Sie eine neue Sitzung starten, vergisst er wie am ersten Tag Ihre bisherigen Vorlieben.
- Was Sie dem Agenten in Projekt A über Architekturkonventionen beigebracht haben, vergisst er in Projekt B wieder.
- In langen Sitzungen werden wichtige Informationen aus dem Kontext "herausgedrängt".

Sie benötigen ein externes Gehirn, das dem Agenten hilft, diese Dinge zu behalten.

## Wann Sie diese Methode anwenden sollten

- **Bei der ersten Verwendung**: Wenn Sie opencode-supermemory zum ersten Mal verwenden.
- **Bei Neuinstallation der Umgebung**: Wenn Sie zu einem neuen Computer wechseln oder die OpenCode-Konfiguration zurücksetzen.
- **Bei der Fehlerbehebung**: Wenn Sie vermuten, dass das Plugin nicht korrekt installiert wurde oder API-Verbindungsprobleme bestehen.

---

## 🎒 Vorbereitungen

Stellen Sie sicher, dass Sie bereits Folgendes vorbereitet haben:

1.  **OpenCode installiert**: Stellen Sie sicher, dass der `opencode`-Befehl im Terminal verfügbar ist.
2.  **API Key erhalten**:
    - Besuchen Sie die [Supermemory Console](https://console.supermemory.ai)
    - Registrieren Sie sich / melden Sie sich an
    - Erstellen Sie einen neuen API Key (beginnt mit `sm_`)

::: info Was ist Supermemory?
Supermemory ist eine Cloud-Speicherschicht, die speziell für AI-Agenten entwickelt wurde. Sie kann nicht nur Daten speichern, sondern auch durch semantische Suche dem Agenten helfen, zur richtigen Zeit an die richtigen Dinge zu erinnern.
:::

---

## Kernkonzept

Der Installationsprozess ist sehr einfach und besteht im Grunde aus drei Schritten:

1.  **Plugin installieren**: Führen Sie das Installationsskript aus, um das Plugin bei OpenCode zu registrieren.
2.  **Schlüssel konfigurieren**: Teilen Sie dem Plugin mit, wie Ihr API Key lautet.
3.  **Verbindung verifizieren**: Starten Sie OpenCode neu und bestätigen Sie, dass der Agent die neuen Tools sehen kann.

---

## Führen Sie es mit mir aus

### Schritt 1: Plugin installieren

Wir bieten zwei Installationsmethoden an. Wählen Sie die für Sie passende aus.

::: code-group

```bash [Ich bin Mensch (interaktive Installation)]
# Empfohlen: Es gibt interaktive Anleitungen, die Ihnen automatisch bei der Konfiguration helfen
bunx opencode-supermemory@latest install
```

```bash [Ich bin Agent (automatische Installation)]
# Wenn Sie einen Agenten die Installation durchführen lassen, verwenden Sie diesen Befehl (überspringt interaktive Bestätigungen und löst Konflikte automatisch)
bunx opencode-supermemory@latest install --no-tui --disable-context-recovery
```

:::

**Was Sie sehen sollten**:
Die Terminalausgabe zeigt `✓ Setup complete!`, was bedeutet, dass das Plugin erfolgreich bei `~/.config/opencode/opencode.jsonc` registriert wurde.

### Schritt 2: API Key konfigurieren

Das Plugin benötigt einen API Key, um Ihre Cloud-Speicherdatenbank zu lesen und zu schreiben. Sie haben zwei Konfigurationsmöglichkeiten:

#### Methode A: Umgebungsvariable (empfohlen)

Fügen Sie ihn direkt zu Ihrer Shell-Konfigurationsdatei (z. B. `.zshrc` oder `.bashrc`) hinzu:

```bash
export SUPERMEMORY_API_KEY="sm_Ihr-Schlüssel..."
```

#### Methode B: Konfigurationsdatei

Alternativ erstellen Sie eine dedizierte Konfigurationsdatei `~/.config/opencode/supermemory.jsonc`:

```json
{
  "apiKey": "sm_Ihr-Schlüssel..."
}
```

**Warum**: Umgebungsvariablen sind sicherer und werden nicht versehentlich in Code-Repositories committet; Konfigurationsdateien sind bequemer für die Verwaltung mehrerer Einstellungen.

### Schritt 3: Konflikte lösen (falls Sie Oh My OpenCode verwenden)

Wenn Sie [Oh My OpenCode](https://github.com/code-yeongyu/oh-my-opencode) installiert haben, kann die integrierte Kontextverwaltungsfunktion mit Supermemory kollidieren.

**Überprüfungsmethode**:
Das Installationsskript erkennt und warnt Sie normalerweise automatisch, um konfliktierende Hooks zu deaktivieren. Wenn nicht, überprüfen Sie manuell `~/.config/opencode/oh-my-opencode.json`:

```json
{
  "disabled_hooks": [
    "anthropic-context-window-limit-recovery"  // ✅ Stellen Sie sicher, dass diese Zeile vorhanden ist
  ]
}
```

**Warum**: Supermemory bietet eine intelligentere "präemptive Komprimierung" (Preemptive Compaction). Wenn zwei Plugins gleichzeitig versuchen, den Kontext zu verwalten, führt dies zu Verwirrung.

### Schritt 4: Installation verifizieren

Starten Sie OpenCode neu und führen Sie dann den Prüfbefehl aus:

```bash
opencode -c
```

Oder gehen Sie direkt in den OpenCode-Interaktionsmodus und prüfen Sie die Tool-Liste.

**Was Sie sehen sollten**:
In der Tool-Liste (Tools) erscheint das `supermemory`-Tool.

```
Available Tools:
- supermemory (add, search, profile, list, forget)
...
```

---

## Prüfpunkt ✅

Überprüfen Sie die folgenden Punkte, um sicherzustellen, dass alles bereit ist:

- [ ] Führen Sie `cat ~/.config/opencode/opencode.jsonc` aus, und Sie können `"opencode-supermemory"` in der `plugin`-Liste sehen.
- [ ] Die Umgebungsvariable `SUPERMEMORY_API_KEY` ist wirksam (Sie können sie mit `echo $SUPERMEMORY_API_KEY` überprüfen).
- [ ] Nach dem Ausführen von `opencode` zeigt der Agent keine Fehlermeldungen an.

---

## Fallstricke

::: warning Häufiger Fehler: API Key nicht wirksam
Wenn Sie eine Umgebungsvariable festgelegt haben, aber das Plugin meldet "nicht authentifiziert", überprüfen Sie Folgendes:
1. Haben Sie das Terminal neu gestartet? (Nach dem Ändern von `.zshrc` müssen Sie `source ~/.zshrc` ausführen oder neu starten)
2. Haben Sie OpenCode neu gestartet? (Der OpenCode-Prozess muss neu gestartet werden, um neue Variablen zu lesen)
:::

::: warning Häufiger Fehler: JSON-Formatfehler
Wenn Sie `opencode.jsonc` manuell ändern, stellen Sie sicher, dass das JSON-Format korrekt ist (insbesondere Kommas). Das Installationsskript verarbeitet dies automatisch, aber manuelle Änderungen führen leicht zu Fehlern.
:::

---

## Zusammenfassung dieser Lektion

Glückwunsch! Sie haben OpenCode erfolgreich mit einem "Hippocampus" ausgestattet. Jetzt ist Ihr Agent bereit zu beginnen, Dinge zu behalten.

- Wir haben das `opencode-supermemory`-Plugin installiert.
- Wir haben die Cloud-Verbindungsanmeldeinformationen konfiguriert.
- Wir haben potenzielle Plugin-Konflikte ausgeschlossen.

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Projektinitialisierung: Erster Eindruck](../initialization/index.md)**.
>
> Sie werden lernen:
> - Wie Sie mit einem einzigen Befehl den Agenten die gesamte Codebasis tiefgehend scannen lassen.
> - Wie Sie den Agenten die Projektarchitektur, den Tech-Stack und die impliziten Regeln merken lassen.
> - Wie Sie sehen können, was der Agent genau behalten hat.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie, um die Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
| Konflikterkennungslogik | [`src/cli.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/cli.ts#L273-L320) | 273-320 |
| Konfigurationsdatei laden | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts) | - |

</details>

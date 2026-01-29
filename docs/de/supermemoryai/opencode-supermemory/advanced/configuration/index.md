---
title: "Tiefenkonfiguration: Speicher-Engine anpassen | opencode-supermemory"
sidebarTitle: "Tiefenkonfiguration"
subtitle: "Tiefenkonfiguration: Speicher-Engine anpassen | opencode-supermemory"
description: "Meistern Sie die erweiterten Konfigurationsoptionen von opencode-supermemory. Passen Sie Speicherauslösewörter an, ändern Sie die Kontextinjektionsstrategie und optimieren Sie Komprimierungsschwellenwerte."
tags:
  - "Konfiguration"
  - "Erweitert"
  - "Anpassung"
prerequisite:
  - "start-getting-started"
order: 2
---

# Tiefenkonfiguration-Detaillierung: Passen Sie Ihre Speicher-Engine an

## Was Sie nach dieser Lektion können

- **Benutzerdefinierte Auslösewörter**: Lassen Sie den Agenten Ihre spezifischen Befehle verstehen (z. B. "Notieren", "markieren").
- **Speicherkapazität anpassen**: Kontrollieren Sie die Anzahl der in den Kontext injizierten Speicher und gleichen Sie Token-Verbrauch mit Informationsgehalt aus.
- **Komprimierungsstrategie optimieren**: Passen Sie den Auslösezeitpunkt der präemptiven Komprimierung je nach Projektgröße an.
- **Multi-Umgebungsverwaltung**: Wechseln Sie flexibel zwischen API-Keys über Umgebungsvariablen.

## Position der Konfigurationsdatei

opencode-supermemory sucht in der folgenden Reihenfolge nach Konfigurationsdateien, **beim ersten Fund abbrechend**:

1. `~/.config/opencode/supermemory.jsonc` (empfohlen, unterstützt Kommentare)
2. `~/.config/opencode/supermemory.json`

::: tip Warum .jsonc empfohlen?
Das `.jsonc`-Format ermöglicht das Schreiben von Kommentaren (`//`) in JSON, was sehr gut geeignet ist, um den Zweck von Konfigurationselementen zu erklären.
:::

## Detaillierte Kernkonfiguration

Das folgende ist ein vollständiges Konfigurationsbeispiel, das alle verfügbaren Optionen und ihre Standardwerte enthält.

### Grundkonfiguration

```jsonc
// ~/.config/opencode/supermemory.jsonc
{
  // Supermemory API Key
  // Priorität: Konfigurationsdatei > Umgebungsvariable SUPERMEMORY_API_KEY
  "apiKey": "your-api-key-here",

  // Ähnlichkeitsschwelle für semantische Suche (0.0 - 1.0)
  // Höhere Werte: präzisere Ergebnisse, aber weniger; niedrigere Werte: streuere Ergebnisse
  "similarityThreshold": 0.6
}
```

### Kontextinjektionssteuerung

Diese Einstellungen bestimmen, wie viele Speicher der Agent beim Start einer Sitzung automatisch liest und in den Prompt injiziert.

```jsonc
{
  // Ob das Benutzerprofil injiziert werden soll
  // Auf false gesetzt, um Tokens zu sparen, aber der Agent könnte Ihre grundlegenden Präferenzen vergessen
  "injectProfile": true,

  // Maximale Anzahl der injizierten Benutzerprofileinträge
  "maxProfileItems": 5,

  // Maximale Anzahl der injizierten benutzerspezifischen Speicher (User Scope)
  // Dies sind allgemeine Speicher, die über alle Projekte geteilt werden
  "maxMemories": 5,

  // Maximale Anzahl der injizierten projektspezifischen Speicher (Project Scope)
  // Dies sind Speicher, die spezifisch für das aktuelle Projekt sind
  "maxProjectMemories": 10
}
```

### Benutzerdefinierte Auslösewörter

Sie können benutzerdefinierte reguläre Ausdrücke hinzufügen, damit der Agent spezifische Anweisungen erkennt und automatisch Speicher speichert.

```jsonc
{
  // Liste der benutzerdefinierten Auslösewörter (unterstützt reguläre Ausdrücke)
  // Diese Wörter werden mit den integrierten Standardauslösewörtern zusammengeführt
  "keywordPatterns": [
    "记一下",           // einfacher Abgleich
    "mark\\s+this",     // Regex-Abgleich: mark this
    "重要[:：]",         // stimmt mit "Wichtig:" oder "Wichtig：" überein
    "TODO\\(memory\\)"  // stimmt mit spezifischem Marker überein
  ]
}
```

::: details Integrierte Standardauslösewörter anzeigen
Das Plugin enthält die folgenden Auslösewörter, die ohne Konfiguration verwendet werden können:
- `remember`, `memorize`
- `save this`, `note this`
- `keep in mind`, `don't forget`
- `learn this`, `store this`
- `record this`, `make a note`
- `take note`, `jot down`
- `commit to memory`
- `remember that`
- `never forget`, `always remember`
:::

### Präemptive Komprimierung (Preemptive Compaction)

Wenn der Sitzungskontext zu lang ist, löst das Plugin automatisch den Komprimierungsmechanismus aus.

```jsonc
{
  // Komprimierungsauslöseschwellenwert (0.0 - 1.0)
  // Wird ausgelöst, wenn die Token-Nutzungsrate diesen Prozentsatz überschreitet
  // Standard 0.80 (80%)
  "compactionThreshold": 0.80
}
```

::: warning Empfehlung für Schwellenwerteinstellung
- **Nicht zu hoch einstellen** (z. B. > 0.95): Kann dazu führen, dass das Kontextfenster erschöpft wird, bevor die Komprimierung abgeschlossen ist.
- **Nicht zu niedrig einstellen** (z. B. < 0.50): Führt zu häufiger Komprimierung, unterbricht den Fluss und verschwendet Tokens.
- **Empfohlener Wert**: Zwischen 0.70 - 0.85.
:::

## Unterstützung für Umgebungsvariablen

Zusätzlich zur Konfigurationsdatei können Sie auch Umgebungsvariablen verwenden, um sensible Informationen zu verwalten oder das Standardverhalten zu überschreiben.

| Umgebungsvariable | Beschreibung | Priorität |
| :--- | :--- | :--- |
| `SUPERMEMORY_API_KEY` | Supermemory API-Schlüssel | Niedriger als Konfigurationsdatei |
| `USER` oder `USERNAME` | Bezeichner, der zur Generierung des User-Scope-Hash verwendet wird | Systemstandard |

### Verwendungsszenario: Multi-Umgebungswechsel

Wenn Sie verschiedene Supermemory-Konten für Unternehmens- und persönliche Projekte verwenden, können Sie Umgebungsvariablen nutzen:

::: code-group

```bash [macOS/Linux]
# Legen Sie den Standard-Key in .zshrc oder .bashrc fest
export SUPERMEMORY_API_KEY="key_personal"

# Überschreiben Sie den Key temporär im Unternehmensprojektverzeichnis
export SUPERMEMORY_API_KEY="key_work" && opencode
```

```powershell [Windows]
# Umgebungsvariable festlegen
$env:SUPERMEMORY_API_KEY="key_work"
opencode
```

:::

## Führen Sie es mit mir aus: Passen Sie Ihre benutzerdefinierte Konfiguration an

Lassen Sie uns eine optimierte Konfiguration erstellen, die für die meisten Entwickler geeignet ist.

### Schritt 1: Konfigurationsdatei erstellen

Wenn die Datei nicht existiert, erstellen Sie sie.

```bash
mkdir -p ~/.config/opencode
touch ~/.config/opencode/supermemory.jsonc
```

### Schritt 2: Optimierungskonfiguration schreiben

Kopieren Sie den folgenden Inhalt in `supermemory.jsonc`. Diese Konfiguration erhöht das Gewicht der Projektspeicher und fügt chinesische Auslösewörter hinzu.

```jsonc
{
  // Ähnlichkeitsschwellenwert beibehalten
  "similarityThreshold": 0.6,

  // Projektspeicheranzahl erhöhen, allgemeine Speicher reduzieren, besser für tiefe Entwicklung
  "maxMemories": 3,
  "maxProjectMemories": 15,

  // Chinesische Auslösewörter für Gewohnheiten hinzufügen
  "keywordPatterns": [
    "记一下",
    "记住",
    "保存记忆",
    "别忘了"
  ],

  // Komprimierung etwas früher auslösen, um mehr Sicherheitsplatz zu reservieren
  "compactionThreshold": 0.75
}
```

### Schritt 3: Konfiguration verifizieren

Starten Sie OpenCode neu und versuchen Sie im Dialog, die neu definierten Auslösewörter zu verwenden:

```
Benutzereingabe:
记一下：Die API-Basis-URL dieses Projekts ist /api/v2

Systemantwort (erwartet):
(Agent ruft das supermemory-Tool auf, um den Speicher zu speichern)
Speicher gespeichert: Die API-Basis-URL dieses Projekts ist /api/v2
```

## Häufige Fragen

### F: Muss ich nach Änderung der Konfiguration neu starten?
**A: Ja.** Das Plugin lädt die Konfiguration beim Start. Nach dem Ändern von `supermemory.jsonc` müssen Sie OpenCode neu starten, damit die Änderungen wirksam werden.

### F: Unterstützt `keywordPatterns` chinesische Regex?
**A: Ja.** Die unterliegende Ebene verwendet `new RegExp()` von JavaScript und unterstützt vollständig Unicode-Zeichen.

### F: Was passiert, wenn das Format der Konfigurationsdatei falsch ist?
**A: Das Plugin greift auf die Standardwerte zurück.** Wenn das JSON-Format ungültig ist (z. B. überflüssige Kommas), fängt das Plugin den Fehler ab und verwendet die integrierten `DEFAULTS`, was nicht zum Absturz von OpenCode führt.

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Privatsphäre und Datensicherheit](../../security/privacy/)**.
>
> Sie werden lernen:
> - Automatischer Mechanismus zur Maskierung sensibler Daten
> - Verwenden Sie das `&lt;private&gt;`-Tag, um die Privatsphäre zu schützen
> - Sicherheitsgrenzen für Datenspeicherung

---

## Anhang: Quellcode-Referenz

| Funktion | Dateipfad | Zeilennummer |
| :--- | :--- | :--- |
| Konfigurationsschnittstellendefinition | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L12-L23) | 12-23 |
| Standardwertdefinition | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L44-L54) | 44-54 |
| Standardauslösewörter | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L25-L42) | 25-42 |
| Konfigurationsdatei laden | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L73-L86) | 73-86 |
| Umgebungsvariable lesen | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L90) | 90 |

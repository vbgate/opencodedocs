---
title: "Tool-Suite: Speicher steuern | opencode-supermemory"
sidebarTitle: "Tool-Suite"
subtitle: "Tool-Suite: Den Agenten Speichern lehren"
description: "Meistern Sie die 5 Kernmodi des supermemory-Tools (add, search, profile, list, forget) und steuern Sie das Speicherverhalten durch natürliche Sprache."
tags:
  - "Tool-Verwendung"
  - "Speichermanagement"
  - "Kernfunktionen"
prerequisite:
  - "start-getting-started"
order: 2
---

# Tool-Suite-Detaillierung: Den Agenten Speichern lehren

## Was Sie nach dieser Lektion können

In dieser Lektion meistern Sie die Kerninteraktionsmethode des `supermemory`-Plugins. Obwohl der Agent normalerweise Speicher automatisch verwaltet, müssen Sie als Entwickler oft manuell eingreifen.

Nach dieser Lektion können Sie:
1. Verwenden Sie den `add`-Modus, um wichtige technische Entscheidungen manuell zu speichern.
2. Verwenden Sie den `search`-Modus, um zu verifizieren, ob der Agent Ihre Präferenzen gespeichert hat.
3. Verwenden Sie `profile`, um zu sehen, wie der Agent "Sie" sieht.
4. Verwenden Sie `list` und `forget`, um veraltete oder fehlerhafte Speicher zu bereinigen.

## Kernkonzept

opencode-supermemory ist keine Black Box; es interagiert mit dem Agenten über das Standard-OpenCode-Tool-Protokoll. Das bedeutet, Sie können es wie eine Funktion aufrufen oder den Agenten durch natürliche Sprache anweisen, es zu verwenden.

Das Plugin registriert ein Tool namens `supermemory` beim Agenten, das wie ein Schweizer Taschenmesser mit 6 Modi ist:

| Modus | Funktion | Typisches Szenario |
|--- | --- | ---|
| **add** | Speicher hinzufügen | "Merken Sie sich, dieses Projekt muss mit Bun laufen" |
| **search** | Speicher suchen | "Habe ich vorher gesagt, wie man Authentifizierung behandelt?" |
| **profile** | Benutzerprofil | Zeigen Sie die Codierungsgewohnheiten, die der Agent über Sie zusammengefasst hat |
| **list** | Speicher auflisten | Überprüfen Sie die zuletzt gespeicherten 10 Speicher |
| **forget** | Speicher löschen | Löschen Sie einen fehlerhaften Konfigurationsdatensatz |
| **help** | Benutzerhandbuch | Zeigen Sie die Tool-Hilfedokumentation an |

::: info Automatischer Auslösemechanismus
Neben dem manuellen Aufruf überwacht das Plugin auch Ihren Chat-Inhalt. Wenn Sie durch natürliche Sprache "Remember this" oder "Save this" sagen, erkennt das Plugin automatisch die Schlüsselwörter und zwingt den Agenten, das `add`-Tool aufzurufen.
:::

## Führen Sie es mit mir aus: Speicher manuell verwalten

Obwohl wir normalerweise den Agenten automatisch agieren lassen, ist der manuelle Aufruf von Tools beim Debuggen oder Aufbau des initialen Speichers sehr nützlich. Sie können den Agenten im OpenCode-Dialogfenster direkt durch natürliche Sprache anweisen, diese Operationen auszuführen.

### 1. Speicher hinzufügen (Add)

Dies ist die am häufigsten verwendete Funktion. Sie können den Inhalt, Typ und Umfang des Speichers angeben.

**Operation**: Weisen Sie den Agenten an, einen Speicher über die Projektarchitektur zu speichern.

**Eingabebefehl**:
```text
Verwenden Sie das supermemory-Tool, um einen Speicher zu speichern:
Inhalt: "Alle Service-Schicht-Codes dieses Projekts müssen im Verzeichnis src/services abgelegt werden"
Typ: architecture
Umfang: project
```

**Interne Verhalten des Agenten** (Quellcode-Logik):
```json
{
  "tool": "supermemory",
  "args": {
    "mode": "add",
    "content": "Alle Service-Schicht-Codes dieses Projekts müssen im Verzeichnis src/services abgelegt werden",
    "type": "architecture",
    "scope": "project"
  }
}
```

**Was Sie sehen sollten**:
Der Agent gibt eine ähnliche Bestätigung zurück:
> ✅ Memory added to project scope (ID: mem_12345...)

::: tip Auswahl des Speichertyps (Type)
Um die Suche präziser zu machen, empfehle ich, genaue Typen zu verwenden:
- `project-config`: Tech-Stack, Toolchain-Konfiguration
- `architecture`: Architekturmuster, Verzeichnisstruktur
- `preference`: Ihre persönlichen Codierungspräferenzen (z. B. "bevorzugt Pfeilfunktionen")
- `error-solution`: Spezifische Lösung für einen bestimmten Fehler
- `learned-pattern`: Vom Agenten beobachtete Codemuster
:::

### 2. Speicher suchen (Search)

Wenn Sie verifizieren möchten, ob der Agent etwas "weißt", können Sie die Suchfunktion verwenden.

**Operation**: Suchen Sie nach Speichern über "Service-Schicht".

**Eingabebefehl**:
```text
Fragen Sie supermemory ab, das Schlüsselwort ist "services", der Umfang ist project
```

**Interne Verhalten des Agenten**:
```json
{
  "tool": "supermemory",
  "args": {
    "mode": "search",
    "query": "services",
    "scope": "project"
  }
}
```

**Was Sie sehen sollten**:
Der Agent listet relevante Speicherfragmente und ihre Ähnlichkeit (Similarity) auf.

### 3. Benutzerprofil anzeigen (Profile)

Supermemory unterhält automatisch ein "Benutzerprofil", das Ihre langfristigen Präferenzen enthält.

**Operation**: Sehen Sie Ihr Profil an.

**Eingabebefehl**:
```text
Rufen Sie den profile-Modus des supermemory-Tools auf, um zu sehen, was Sie über mich wissen
```

**Was Sie sehen sollten**:
Zwei Arten von Informationen werden zurückgegeben:
- **Static**: Statische Fakten (z. B. "Benutzer ist Full-Stack-Ingenieur")
- **Dynamic**: Dynamische Präferenzen (z. B. "Benutzer beschäftigt sich kürzlich mit Rust")

### 4. Audit und Vergessen (List & Forget)

Wenn der Agent fehlerhafte Informationen gespeichert hat (z. B. einen veralteten API Key), müssen Sie ihn löschen.

**Erster Schritt: Letzte Speicher auflisten**
```text
Listen Sie die letzten 5 Projektspeicher auf
```
*(Agent ruft `mode: "list", limit: 5` auf)*

**Zweiter Schritt: ID abrufen und löschen**
Angenommen, Sie sehen einen fehlerhaften Speicher mit der ID `mem_abc123`.

```text
Löschen Sie den Speicher mit der ID mem_abc123
```
*(Agent ruft `mode: "forget", memoryId: "mem_abc123"` auf)*

**Was Sie sehen sollten**:
> ✅ Memory mem_abc123 removed from project scope

## Fortgeschritten: Auslösung durch natürliche Sprache

Sie müssen nicht jedes Mal Tool-Parameter detailliert beschreiben. Das Plugin verfügt über einen Schlüsselworterkennungsmechanismus.

**Probieren Sie es aus**:
Sagen Sie direkt im Dialog:
> **Remember this**: Alle Datumsbearbeitungen müssen die Bibliothek date-fns verwenden, die Verwendung von moment.js ist verboten.

**Was passiert?**
1.  Der `chat.message`-Hook des Plugins erkennt das Schlüsselwort "Remember this".
2.  Das Plugin injiziert einen System-Hinweis an den Agenten: `[MEMORY TRIGGER DETECTED]`.
3.  Der Agent erhält die Anweisung: "You MUST use the supermemory tool with mode: 'add'...".
4.  Der Agent extrahiert automatisch den Inhalt und ruft das Tool auf.

Dies ist eine sehr natürliche Interaktionsweise, die es Ihnen ermöglicht, Wissen im Codierungsprozess jederzeit zu "festigen".

## Häufige Fragen (FAQ)

**F: Was ist der Standard von `scope`?**
A: Der Standard ist `project`. Wenn Sie projektübergreifende allgemeine Präferenzen speichern möchten (z. B. "Ich verwende immer TypeScript"), geben Sie explizit `scope: "user"` an.

**F: Warum werden hinzugefügte Speicher nicht sofort wirksam?**
A: Die `add`-Operation ist asynchron. Normalerweise "weiß" der Agent sofort nach erfolgreichem Tool-Aufruf diesen neuen Speicher, aber bei extremen Netzwerkverzögerungen kann es ein paar Sekunden dauern.

**F: Werden sensible Informationen hochgeladen?**
A: Das Plugin maskiert automatisch den Inhalt innerhalb von `<private>`-Tags. Um sicher zu sein, empfehle ich jedoch, keine Passwörter oder API-Keys in Speicher zu legen.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie, um die Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
|--- | --- | ---|
| Schlüsselworterkennung | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L34-L37) | 34-37 |
| Auslöseprompt | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L20-L28) | 20-28 |
| Client-Implementierung | [`src/services/client.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/client.ts) | Vollständiger Text |

**Wichtige Typdefinitionen**:
- `MemoryType`: Definiert in [`src/types/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/types/index.ts)
- `MemoryScope`: Definiert in [`src/types/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/types/index.ts)

</details>

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Speicherumfang und Lebenszyklus](../memory-management/index.md)**.
>
> Sie werden lernen:
> - Der zugrundeliegende Isolationsmechanismus von User Scope und Project Scope
> - Wie man eine effiziente Speicherpartitionsstrategie entwirft
> - Lebenszyklusmanagement von Speichern

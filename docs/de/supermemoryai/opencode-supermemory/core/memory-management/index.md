---
title: "Speicher: Umfang & Lebenszyklus | opencode-supermemory"
sidebarTitle: "Speicherumfang"
subtitle: "Speicher: Umfang & Lebenszyklus"
description: "Lernen Sie die User- und Project-Umfänge von opencode-supermemory kennen. Meistern Sie CRUD-Operationen für Speicher und erreichen Sie die Wiederverwendung von Erfahrung über Projekte hinweg."
tags:
  - "memory-management"
  - "scope"
  - "crud"
prerequisite:
  - "core-tools"
order: 3
---

# Speicherumfang und Lebenszyklus: Verwalten Sie Ihr digitales Gehirn

## Was Sie nach dieser Lektion können

- **Umfänge unterscheiden**: Verstehen Sie, welche Speicher "mit Ihnen gehen" (projektübergreifend) und welche "mit dem Projekt gehen" (projektspezifisch).
- **Speicher verwalten**: Lernen Sie, Speicher manuell anzuzeigen, hinzuzufügen und zu löschen, um die Kognition des Agenten sauber zu halten.
- **Agent debuggen**: Wenn der Agent "falsche" Dinge merkt, wissen Sie, wo Sie korrigieren.

## Kernkonzept

opencode-supermemory unterteilt Speicher in zwei isolierte **Umfänge (Scope)**, ähnlich wie globale und lokale Variablen in Programmiersprachen.

### 1. Zwei Arten von Umfängen

| Umfang | Bezeichner (Scope ID) | Lebenszyklus | Typische Verwendung |
| :--- | :--- | :--- | :--- |
| **User Scope**<br>(Benutzerumfang) | `user` | **Bleibt für immer bei Ihnen**<br>wird über alle Projekte hinweg geteilt | • Codestilpräferenzen (z. B. "bevorzugt TypeScript")<br>• Persönliche Gewohnheiten (z. B. "schreibt immer Kommentare")<br>• Allgemeines Wissen |
| **Project Scope**<br>(Projektumfang) | `project` | **Nur für das aktuelle Projekt**<br>wird beim Wechsel des Verzeichnisses ungültig | • Projektarchitekturdesign<br>• Geschäftslogikbeschreibung<br>• Spezifische Lösungen für bestimmte Bugs |

::: info Wie werden Umfänge generiert?
Das Plugin generiert automatisch eindeutige Tags über `src/services/tags.ts`:
- **User Scope**: Basierend auf Hash Ihrer Git-E-Mail (`opencode_user_{hash}`).
- **Project Scope**: Basierend auf Hash des aktuellen Projektpfads (`opencode_project_{hash}`).
:::

### 2. Lebenszyklus von Speichern

1.  **Erstellen (Add)**: Wird durch CLI-Initialisierung oder Agentendialog (`Remember this...`) geschrieben.
2.  **Aktivieren (Inject)**: Bei jedem Start einer neuen Sitzung zieht das Plugin automatisch relevante User- und Project-Speicher und injiziert sie in den Kontext.
3.  **Suchen (Search)**: Der Agent kann während des Dialogs aktiv nach spezifischen Speichern suchen.
4.  **Vergessen (Forget)**: Wenn Speicher veraltet oder falsch sind, werden sie per ID gelöscht.

---

## Führen Sie es mit mir aus: Verwalten Sie Ihre Speicher

Wir werden die Speicher dieser beiden Umfänge durch den Dialog mit dem Agenten manuell verwalten.

### Schritt 1: Vorhandene Speicher anzeigen

Lassen Sie uns zuerst sehen, was der Agent derzeit gespeichert hat.

**Operation**: Geben Sie im OpenCode-Chatfenster ein:

```text
Bitte listen Sie alle Speicher des aktuellen Projekts auf (List memories in project scope)
```

**Was Sie sehen sollten**:
Der Agent ruft den `list`-Modus des `supermemory`-Tools auf und gibt eine Liste zurück:

```json
// Beispielausgabe
{
  "success": true,
  "scope": "project",
  "count": 3,
  "memories": [
    {
      "id": "mem_123456",
      "content": "Das Projekt verwendet MVC-Architektur, die Service-Schicht ist für die Geschäftslogik verantwortlich",
      "createdAt": "2023-10-01T10:00:00Z"
    }
    // ...
  ]
}
```

### Schritt 2: Projektübergreifenden Speicher hinzufügen (User Scope)

Angenommen, Sie möchten, dass der Agent in **allen** Projekten auf Deutsch antwortet. Dies ist ein Speicher, der für den User Scope geeignet ist.

**Operation**: Geben Sie den folgenden Befehl ein:

```text
Bitte merken Sie sich meine persönlichen Präferenzen: Unabhängig vom Projekt antworten Sie mir bitte immer auf Deutsch.
Bitte speichern Sie ihn im User Scope.
```

**Was Sie sehen sollten**:
Der Agent ruft das `add`-Tool auf, Parameter `scope: "user"`:

```json
{
  "mode": "add",
  "content": "User prefers responses in German across all projects",
  "scope": "user",
  "type": "preference"
}
```

Das System bestätigt, dass der Speicher hinzugefügt wurde, und gibt eine `id` zurück.

### Schritt 3: Projektspezifischen Speicher hinzufügen (Project Scope)

Jetzt fügen wir eine spezifische Regel für **das aktuelle Projekt** hinzu.

**Operation**: Geben Sie den folgenden Befehl ein:

```text
Bitte merken Sie sich: In diesem Projekt muss alle Datumsformate YYYY-MM-DD sein.
Speichern Sie es im Project Scope.
```

**Was Sie sehen sollten**:
Der Agent ruft das `add`-Tool auf, Parameter `scope: "project"` (dies ist der Standardwert, der Agent könnte ihn weglassen):

```json
{
  "mode": "add",
  "content": "Date format must be YYYY-MM-DD in this project",
  "scope": "project",
  "type": "project-config"
}
```

### Schritt 4: Isolation verifizieren

Um zu verifizieren, ob der Umfang wirksam ist, können wir versuchen zu suchen.

**Operation**: Geben Sie ein:

```text
Suchen Sie nach Speichern über "Datumsformat"
```

**Was Sie sehen sollten**:
Der Agent ruft das `search`-Tool auf. Wenn er `scope: "project"` angibt oder eine gemischte Suche durchführt, sollte er den soeben hinzugefügten Speicher finden können.

::: tip Projektübergreifende Fähigkeiten verifizieren
Wenn Sie ein neues Terminalfenster öffnen, in ein anderes anderes Projektverzeichnis wechseln und erneut nach "Datumsformat" fragen, sollte der Agent diesen Speicher **nicht finden** (weil er im Project Scope des ursprünglichen Projekts isoliert ist). Wenn Sie jedoch fragen "Welche Sprache soll ich verwenden", sollte er die Präferenz "auf Deutsch antworten" aus dem User Scope abrufen können.
:::

### Schritt 5: Veraltete Speicher löschen

Wenn die Projektkonventionen geändert haben, müssen wir alte Speicher löschen.

**Operation**:
1. Führen Sie zuerst **Schritt 1** aus, um die Speicher-ID abzurufen (z. B. `mem_987654`).
2. Geben Sie den Befehl ein:

```text
Bitte vergessen Sie den Speicher mit der ID mem_987654 über das Datumsformat.
```

**Was Sie sehen sollten**:
Der Agent ruft das `forget`-Tool auf:

```json
{
  "mode": "forget",
  "memoryId": "mem_987654"
}
```

Das System gibt `success: true` zurück.

---

## Häufige Fragen (FAQ)

### F: Wenn ich den Computer wechsle, ist der User Scope-Speicher noch vorhanden?
**A: Hängt von Ihrer Git-Konfiguration ab.**
Der User Scope basiert auf `git config user.email`. Wenn Sie auf zwei Computern dieselbe Git-E-Mail verwenden und mit demselben Supermemory-Konto verbunden sind (denselben API Key verwenden), sind die Speicher **synchronisiert**.

### F: Warum kann ich den soeben hinzugefügten Speicher nicht sehen?
**A: Möglicherweise Cache- oder Indexverzögerung.**
Der Vektorindex von Supermemory ist normalerweise sekundenschnell, kann aber bei Netzwerkschwankungen kurze Verzögerungen haben. Außerdem ist der Kontext, den der Agent beim Sitzungsstart injiziert, **statisch** (Snapshot); neu hinzugefügte Speicher müssen möglicherweise die Sitzung neu starten (`/clear` oder OpenCode neu starten), um in der "automatischen Injektion" wirksam zu werden, können aber über das `search`-Tool sofort gefunden werden.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie, um die Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
| :--- | :--- | :--- |
| Scope-Generierungslogik | [`src/services/tags.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/tags.ts#L18-L36) | 18-36 |
| Speicher-Tool-Definition | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L183-L485) | 183-485 |
| Speichertyp-Definition | [`src/types/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/types/index.ts) | - |
| Client-Implementierung | [`src/services/client.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/client.ts) | 23-182 |

**Wichtige Funktionen**:
- `getUserTag()`: Generiert Benutzer-Tag basierend auf Git-E-Mail
- `getProjectTag()`: Generiert Projekt-Tag basierend auf Verzeichnispfad
- `supermemoryClient.addMemory()`: API-Aufruf zum Hinzufügen von Speichern
- `supermemoryClient.deleteMemory()`: API-Aufruf zum Löschen von Speichern

</details>

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Präemptive Komprimierungsprinzipien](../../advanced/compaction/index.md)**.
>
> Sie werden lernen:
> - Warum der Agent "vergisst" (Kontextüberlauf)
> - Wie das Plugin die Token-Nutzungsrate automatisch überwacht
> - Wie Sie Sitzungen komprimieren, ohne wichtige Informationen zu verlieren

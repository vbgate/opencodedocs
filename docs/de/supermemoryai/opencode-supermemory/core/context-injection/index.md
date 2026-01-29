---
title: "Automatische Kontextinjektion: Agenten-Vorgewitter | opencode-supermemory"
sidebarTitle: "Kontextinjektion"
subtitle: "Automatische Kontextinjektion: Agenten-Vorgewitter"
description: "Lernen Sie den automatischen Kontextinjektionsmechanismus von opencode-supermemory kennen. Erfahren Sie, wie der Agent beim Sitzungsstart Benutzerprofil und Projektwissen erhält."
tags:
  - "context"
  - "injection"
  - "prompt"
  - "memory"
prerequisite:
  - "start-getting-started"
order: 1
---

# Automatische Kontextinjektionsmechanismus: Lassen Sie den Agenten "vorhersehen"

## Was Sie nach dieser Lektion können

Nach dieser Lektion können Sie:
1.  **Verstehen**, warum der Agent sofort Ihre Codierungsgewohnheiten und die Projektarchitektur kennt.
2.  **Meistern** das "dreidimensionale Modell" der Kontextinjektion (Benutzerprofil, Projektwissen, relevante Speicher).
3.  **Lernen**, Schlüsselwörter (z. B. "Remember this") zu verwenden, um das Speicherverhalten des Agenten aktiv zu beeinflussen.
4.  **Konfigurieren** die Anzahl der injizierten Einträge, um die Kontextlänge mit Informationsreichtum auszugleichen.

---

## Kernkonzept

Bevor es ein Speicher-Plugin gab, war der Agent bei jeder neuen Sitzung ein leeres Blatt. Sie mussten ihm immer wieder sagen: "Ich verwende TypeScript", "Dieses Projekt verwendet Next.js".

**Kontextinjektion (Context Injection)** löst dieses Problem. Es ist so, als ob Sie dem Agenten im Moment des Erwachens eine "Aufgabenübersicht" in den Kopf stecken.

### Auslösezeitpunkt

opencode-supermemory ist sehr zurückhaltend und wird nur bei **der ersten Nachricht der Sitzung** automatisch ausgelöst.

- **Warum bei der ersten Nachricht?** Weil dies der entscheidende Moment ist, um den Ton der Sitzung zu bestimmen.
- **Was ist mit nachfolgenden Nachrichten?** Spätere Nachrichten werden nicht mehr automatisch injiziert, um den Dialogfluss nicht zu stören, es sei denn, Sie lösen ihn aktiv aus (siehe unten "Schlüsselwortauslösung").

### Dreidimensionales Injektionsmodell

Das Plugin ruft parallel drei Arten von Daten ab und kombiniert sie zu einem `[SUPERMEMORY]`-Prompt-Block:

| Datendimension | Quelle | Funktion | Beispiel |
|--- | --- | --- | ---|
| **1. Benutzerprofil** (Profile) | `getProfile` | Ihre langfristigen Präferenzen | "Benutzer bevorzugt funktionale Programmierung", "bevorzugt Pfeilfunktionen" |
| **2. Projektwissen** (Project) | `listMemories` | Globales Wissen über das aktuelle Projekt | "Dieses Projekt verwendet Clean Architecture", "API befindet sich in src/api" |
| **3. Relevante Speicher** (Relevant) | `searchMemories` | Frühere Erfahrungen, die mit Ihrem ersten Satz relevant sind | Sie fragen "Wie behebe ich diesen Bug", es sucht nach früheren ähnlichen Lösungsaufzeichnungen |

---

## Was wird injiziert?

Wenn Sie die erste Nachricht in OpenCode senden, fügt das Plugin im Hintergrund stillschweigend den folgenden Inhalt in den System-Prompt ein.

::: details Klicken Sie, um die reale Struktur des injizierten Inhalts anzuzeigen
```text
[SUPERMEMORY]

User Profile:
- User prefers concise responses
- User uses Zod for all validations

Recent Context:
- Working on auth module refactoring

Project Knowledge:
- [100%] Architecture follows MVC pattern
- [100%] Use 'npm run test' for testing

Relevant Memories:
- [85%] Previous fix for hydration error: use useEffect
```
:::

Nachdem der Agent diese Informationen gesehen hat, wird er sich wie ein erfahrener Mitarbeiter verhalten, der schon lange an diesem Projekt gearbeitet hat, und nicht wie ein neuer Praktikant.

---

## Schlüsselwortauslösungsmechanismus (Nudge)

Neben der automatischen Injektion am Anfang können Sie die Speicherfunktion jederzeit im Dialog "aufwecken".

Das Plugin verfügt über einen **Schlüsselwortdetektor**. Solange Ihre Nachricht bestimmte Auslösewörter enthält, sendet das Plugin dem Agenten einen "unsichtbaren Hinweis" (Nudge) und zwingt ihn, das Speichertool aufzurufen.

### Standardauslösewörter

- `remember`
- `save this`
- `don't forget`
- `memorize`
- `take note`
- ... (mehr siehe Quellcodekonfiguration)

### Interaktionsbeispiel

**Ihre Eingabe**:
> Das API-Antwortformat hat sich geändert, **remember** verwenden Sie künftig `data.result` statt `data.payload`.

**Plugin erkennt "remember"**:
> (Hintergrund injiziert Hinweis): `[MEMORY TRIGGER DETECTED] The user wants you to remember something...`

**Agent reagiert**:
> Verstanden. Ich werde diese Änderung merken.
> *(Hintergrund ruft `supermemory.add` auf, um den Speicher zu speichern)*

---

## Tiefenkonfiguration

Sie können das Injektionsverhalten anpassen, indem Sie `~/.config/opencode/supermemory.jsonc` ändern.

### Häufige Konfigurationsoptionen

```jsonc
{
  // Ob das Benutzerprofil injiziert werden soll (Standard true)
  "injectProfile": true,

  // Wie viele Projektspeicher jeweils injiziert werden (Standard 10)
  // Erhöhen, damit der Agent das Projekt besser kennt, aber verbraucht mehr Token
  "maxProjectMemories": 10,

  // Wie viele Benutzerprofileinträge jeweils injiziert werden (Standard 5)
  "maxProfileItems": 5,

  // Benutzerdefinierte Auslösewörter (unterstützt Regex)
  "keywordPatterns": [
    "记一下",
    "永久保存"
  ]
}
```

::: tip Hinweis
Nach Änderung der Konfiguration müssen Sie OpenCode neu starten oder das Plugin neu laden, damit die Änderungen wirksam werden.
:::

---

## Häufige Fragen

### F: Nimmt die injizierte Information viele Tokens ein?
**A**: Es nimmt einen Teil ein, ist aber normalerweise kontrollierbar. Mit der Standardkonfiguration (10 Projektspeicher + 5 Profileinträge) verbraucht es etwa 500-1000 Token. Für moderne Large Language Models (wie Claude 3.5 Sonnet) mit 200k Kontext ist dies ein Bruchteil.

### F: Warum reagiert es nicht, wenn ich "remember" sage?
**A**: 
1. Überprüfen Sie, ob die Rechtschreibung korrekt ist (unterstützt Regex-Matching).
2. Bestätigen Sie, ob der API Key korrekt konfiguriert ist (wenn das Plugin nicht initialisiert ist, wird es nicht ausgelöst).
3. Der Agent könnte sich entscheiden, es zu ignorieren (obwohl das Plugin es erzwungen hat, hat der Agent das letzte Wort).

### F: Wie werden "relevante Speicher" gesucht?
**A**: Sie werden basierend auf dem Inhalt Ihrer **ersten Nachricht** durch semantische Suche gefunden. Wenn Ihr erster Satz nur "Hi" sagt, werden möglicherweise keine nützlichen relevanten Speicher gefunden, aber "Projektwissen" und "Benutzerprofil" werden weiterhin injiziert.

---

## Zusammenfassung dieser Lektion

- **Automatische Injektion** wird nur bei der ersten Nachricht der Sitzung ausgelöst.
- **Dreidimensionales Modell** umfasst Benutzerprofil, Projektwissen und relevante Speicher.
- **Schlüsselwortauslösung** ermöglicht es Ihnen, den Agenten jederzeit zu befehlen, Speicher zu speichern.
- Durch die **Konfigurationsdatei** können Sie die Menge der injizierten Informationen steuern.

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Tool-Suite-Detaillierung: Den Agenten Speichern lehren](../tools/index.md)**.
>
> Sie werden lernen:
> - Wie man `add`, `search` und andere Tools manuell verwendet.
> - Wie man fehlerhafte Speicher anzeigt und löscht.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie, um die Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
| Injektionsauslösungslogik | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L125-L176) | 125-176 |
| Schlüsselworterkennung | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L34-L37) | 34-37 |
|--- | --- | ---|
| Standardkonfiguration | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L44-L54) | 44-54 |

**Wichtige Funktionen**:
- `formatContextForPrompt()`: Assembliert den `[SUPERMEMORY]`-Textblock.
- `detectMemoryKeyword()`: Regex-Matching der Auslösewörter in der Benutzernachricht.

</details>

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Tool-Suite-Detaillierung: Den Agenten Speichern lehren](../tools/index.md)**.
>
> Sie werden lernen:
> - Meistern Sie 5 Kernmodi des supermemory-Tools: add, search, profile, list, forget
> - Wie man manuell in die Speicher des Agenten eingreift und korrigiert
> - Speichern mit natürlicher Sprache auslösen

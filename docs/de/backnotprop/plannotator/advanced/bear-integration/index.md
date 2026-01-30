---
title: "Bear-Integration: Pläne automatisch speichern | Plannotator"
sidebarTitle: "Pläne automatisch in Bear speichern"
subtitle: "Bear-Integration: Genehmigte Pläne automatisch speichern | Plannotator"
description: "Erfahren Sie, wie Sie die Bear-Integration in Plannotator konfigurieren. Speichern Sie genehmigte Pläne automatisch über x-callback-url, generieren Sie intelligente Tags und archivieren Sie Ihr Wissen."
tags:
  - "Integration"
  - "Bear"
  - "Notiz-App"
  - "Wissensmanagement"
prerequisite:
  - "installation-claude-code"
  - "platforms-plan-review-basics"
order: 3
---

# Bear-Integration: Genehmigte Pläne automatisch speichern

## Was Sie lernen werden

Nach der Aktivierung der Bear-Integration speichert Plannotator bei jeder Plangenehmigung automatisch den Plan in Ihren Bear-Notizen, einschließlich:
- Automatisch generierter Titel (aus dem Plan extrahiert)
- Intelligente Tags (Projektname, Schlüsselwörter, Programmiersprachen)
- Vollständiger Planinhalt

So können Sie alle genehmigten Pläne an einem Ort verwalten, um sie später nachzuschlagen und Wissen zu sammeln.

## Das Problem

Vielleicht kennen Sie diese Situationen:
- Der KI-generierte Plan ist gut, aber Sie möchten ihn für später speichern
- Manuelles Kopieren und Einfügen von Plänen in Bear ist umständlich
- Pläne verschiedener Projekte sind durcheinander, ohne Tag-Verwaltung

Mit der Bear-Integration werden all diese Probleme automatisch gelöst.

## Wann Sie diese Funktion nutzen sollten

- Sie verwenden Bear als Ihre Haupt-Notiz-App
- Sie müssen genehmigte Pläne als Wissensdatenbank archivieren
- Sie möchten historische Pläne schnell über Tags finden

::: info Über Bear
Bear ist eine Markdown-Notiz-App für macOS mit Unterstützung für Tags, Verschlüsselung, Synchronisierung und mehr. Falls Sie Bear noch nicht installiert haben, besuchen Sie [bear.app](https://bear.app/) für weitere Informationen.
:::

## 🎒 Voraussetzungen

- Plannotator ist installiert (siehe [Installationsanleitung](../../start/installation-claude-code/))
- Bear ist installiert und funktioniert ordnungsgemäß
- Sie kennen den grundlegenden Plan-Review-Prozess (siehe [Plan-Review-Grundlagen](../../platforms/plan-review-basics/))

## Kernkonzept

Der Kern der Bear-Integration ist das **x-callback-url**-Protokoll:

1. Aktivieren Sie die Bear-Integration in der Plannotator-UI (gespeichert im Browser-localStorage)
2. Bei der Plangenehmigung sendet Plannotator eine `bear://x-callback-url/create`-URL
3. Das System öffnet Bear automatisch mit dem `open`-Befehl, um eine Notiz zu erstellen
4. Planinhalt, Titel und Tags werden automatisch ausgefüllt

**Hauptmerkmale**:
- Keine Vault-Pfad-Konfiguration erforderlich (anders als bei Obsidian)
- Intelligente Tag-Generierung (maximal 7)
- Automatisches Speichern bei Plangenehmigung

::: tip Unterschied zu Obsidian
Die Bear-Integration ist einfacher und erfordert keine Vault-Pfad-Konfiguration – nur einen Schalter. Obsidian hingegen ermöglicht die Angabe von Speicherordnern und mehr Anpassungsmöglichkeiten.
:::

## Schritt-für-Schritt-Anleitung

### Schritt 1: Plannotator-Einstellungen öffnen

Nachdem der KI-Agent einen Plan generiert und die Plannotator-UI geöffnet hat, klicken Sie auf die ⚙️ **Settings**-Schaltfläche oben rechts.

**Erwartetes Ergebnis**: Das Einstellungsfenster öffnet sich mit mehreren Konfigurationsoptionen

### Schritt 2: Bear-Integration aktivieren

Suchen Sie im Einstellungsfenster den Abschnitt **Bear Notes** und klicken Sie auf den Schalter.

**Warum**
Der Schalter wechselt von grau (deaktiviert) zu blau (aktiviert) und wird gleichzeitig im localStorage des Browsers gespeichert.

**Erwartetes Ergebnis**:
- Der Bear Notes-Schalter wird blau
- Beschreibungstext: „Auto-save approved plans to Bear"

### Schritt 3: Plan genehmigen

Klicken Sie nach Abschluss der Plan-Review auf die **Approve**-Schaltfläche unten.

**Warum**
Plannotator liest die Bear-Einstellungen und ruft bei aktivierter Integration die x-callback-url von Bear auf.

**Erwartetes Ergebnis**:
- Die Bear-App öffnet sich automatisch
- Ein neues Notizfenster erscheint
- Titel und Inhalt sind bereits ausgefüllt
- Tags wurden automatisch generiert (beginnend mit `#`)

### Schritt 4: Gespeicherte Notiz überprüfen

Überprüfen Sie in Bear die neu erstellte Notiz und bestätigen Sie:
- Ist der Titel korrekt (aus der H1 des Plans)?
- Ist der Inhalt vollständig (enthält den gesamten Plan)?
- Sind die Tags sinnvoll (Projektname, Schlüsselwörter, Programmiersprachen)?

**Erwartetes Ergebnis**:
Eine Notizstruktur ähnlich wie diese:

```markdown
## User Authentication

[Vollständiger Planinhalt...]

#plannotator #myproject #authentication #typescript #api
```

## Checkliste ✅

- [ ] Bear Notes-Schalter in den Einstellungen ist aktiviert
- [ ] Bear öffnet sich automatisch nach der Plangenehmigung
- [ ] Notiztitel stimmt mit der H1 des Plans überein
- [ ] Notiz enthält den vollständigen Planinhalt
- [ ] Tags enthalten `#plannotator` und den Projektnamen

## Fehlerbehebung

### Bear öffnet sich nicht automatisch

**Ursache**: Der System-`open`-Befehl ist fehlgeschlagen, möglicherweise weil:
- Bear ist nicht installiert oder wurde nicht aus dem App Store heruntergeladen
- Das URL-Schema von Bear wird von einer anderen App überschrieben

**Lösung**:
1. Bestätigen Sie, dass Bear ordnungsgemäß installiert ist
2. Testen Sie manuell im Terminal: `open "bear://x-callback-url/create?title=test"`

### Tags entsprechen nicht den Erwartungen

**Ursache**: Tags werden automatisch nach folgenden Regeln generiert:
- Pflicht: `#plannotator`
- Pflicht: Projektname (aus Git-Repository-Name oder Verzeichnisname extrahiert)
- Optional: Bis zu 3 Schlüsselwörter aus dem H1-Titel (Stoppwörter ausgeschlossen)
- Optional: Programmiersprachen-Tags aus Codeblöcken (json/yaml/markdown ausgeschlossen)
- Maximal 7 Tags

**Lösung**:
- Wenn Tags nicht den Erwartungen entsprechen, können Sie sie manuell in Bear bearbeiten
- Wenn der Projektname falsch ist, überprüfen Sie die Git-Repository-Konfiguration oder den Verzeichnisnamen

### Genehmigt, aber nicht gespeichert

**Ursache**:
- Bear-Schalter ist nicht aktiviert (überprüfen Sie die Einstellungen)
- Netzwerkfehler oder Bear-Timeout
- Planinhalt ist leer

**Lösung**:
1. Bestätigen Sie, dass der Schalter in den Einstellungen blau ist (aktiviert)
2. Überprüfen Sie das Terminal auf Fehlerprotokolle (`[Bear] Save failed:`)
3. Genehmigen Sie den Plan erneut

## Tag-Generierungsmechanismus im Detail

Plannotator generiert intelligente Tags, damit Sie Pläne in Bear schnell finden können. Hier sind die Generierungsregeln:

| Tag-Quelle | Beispiel | Priorität |
| --- | --- | --- |
| Festes Tag | `#plannotator` | Pflicht |
| Projektname | `#myproject`, `#plannotator` | Pflicht |
| H1-Schlüsselwörter | `#authentication`, `#api` | Optional (max. 3) |
| Programmiersprache | `#typescript`, `#python` | Optional |

**Stoppwortliste** (werden nicht als Tags verwendet):
- `the`, `and`, `for`, `with`, `this`, `that`, `from`, `into`
- `plan`, `implementation`, `overview`, `phase`, `step`, `steps`

**Ausgeschlossene Programmiersprachen** (werden nicht als Tags verwendet):
- `json`, `yaml`, `yml`, `text`, `txt`, `markdown`, `md`

::: details Beispiel: Tag-Generierungsprozess
Angenommen, der Plantitel lautet „Implementation Plan: User Authentication System in TypeScript" und die Codeblöcke enthalten Python und JSON:

1. **Festes Tag**: `#plannotator`
2. **Projektname**: `#myproject` (angenommener Git-Repository-Name)
3. **H1-Schlüsselwörter**:
   - `implementation` → ausgeschlossen (Stoppwort)
   - `plan` → ausgeschlossen (Stoppwort)
   - `user` → beibehalten → `#user`
   - `authentication` → beibehalten → `#authentication`
   - `system` → beibehalten → `#system`
   - `typescript` → beibehalten → `#typescript`
4. **Programmiersprachen**:
   - `python` → beibehalten → `#python`
   - `json` → ausgeschlossen (Ausschlussliste)

Endgültige Tags: `#plannotator #myproject #user #authentication #system #typescript #python` (7, Maximum erreicht)
:::

## Vergleich mit Obsidian-Integration

| Merkmal | Bear-Integration | Obsidian-Integration |
| --- | --- | --- |
| Konfigurationskomplexität | Einfach (nur Schalter) | Mittel (Vault und Ordner auswählen) |
| Speicherort | Innerhalb der Bear-App | Angegebener Vault-Pfad |
| Dateiname | Von Bear automatisch verwaltet | `Title - Mon D, YYYY H-MMam.md` |
| Frontmatter | Nein (Bear unterstützt es nicht) | Ja (created, source, tags) |
| Plattformübergreifend | Nur macOS | macOS/Windows/Linux |
| x-callback-url | ✅ Verwendet | ❌ Schreibt direkt in Datei |

::: tip Welche sollten Sie wählen?
- Wenn Sie nur macOS verwenden und Bear mögen: Bear-Integration ist einfacher
- Wenn Sie plattformübergreifende Unterstützung oder benutzerdefinierte Speicherpfade benötigen: Obsidian-Integration ist flexibler
- Wenn Sie beide nutzen möchten: Sie können beide gleichzeitig aktivieren (genehmigte Pläne werden an beiden Orten gespeichert)
:::

## Zusammenfassung

- Die Bear-Integration funktioniert über das x-callback-url-Protokoll und ist einfach zu konfigurieren
- Aktivieren Sie einfach den Schalter in den Einstellungen, ohne einen Pfad anzugeben
- Pläne werden bei der Genehmigung automatisch in Bear gespeichert
- Tags werden intelligent generiert, einschließlich Projektname, Schlüsselwörter und Programmiersprachen (maximal 7)
- Im Vergleich zur Obsidian-Integration ist Bear einfacher, aber weniger funktionsreich

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen Sie den **[Remote-/Devcontainer-Modus](../remote-mode/)**.
>
> Sie werden lernen:
> - Wie Sie Plannotator in Remote-Umgebungen (SSH, Devcontainer, WSL) verwenden
> - Konfiguration von festen Ports und Port-Weiterleitung
> - Öffnen des Browsers in Remote-Umgebungen zur Anzeige der Review-Seite

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-24

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| Bear-Konfigurationsschnittstelle | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L18-L20) | 18-20 |
| In Bear speichern | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L234-L257) | 234-257 |
| Tag-Extraktion | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L34-L74) | 34-74 |
| Titel-Extraktion | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L94-L105) | 94-105 |
| Bear-Einstellungsschnittstelle | [`packages/ui/utils/bear.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/bear.ts#L15-L17) | 15-17 |
| Bear-Einstellungen lesen | [`packages/ui/utils/bear.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/bear.ts#L22-L26) | 22-26 |
| Bear-Einstellungen speichern | [`packages/ui/utils/bear.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/bear.ts#L31-L33) | 31-33 |
| UI-Einstellungskomponente | [`packages/ui/components/Settings.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Settings.tsx#L496-L518) | 496-518 |
| Bear bei Genehmigung aufrufen | [`packages/editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/editor/App.tsx#L512-L514) | 512-514 |
| Server-Bear-Verarbeitung | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L250-L257) | 250-257 |

**Wichtige Funktionen**:
- `saveToBear(config: BearConfig)`: Speichert den Plan über x-callback-url in Bear
- `extractTags(markdown: string)`: Extrahiert intelligent Tags aus dem Planinhalt (maximal 7)
- `extractTitle(markdown: string)`: Extrahiert den Notiztitel aus der H1-Überschrift des Plans
- `getBearSettings()`: Liest Bear-Integrationseinstellungen aus localStorage
- `saveBearSettings(settings)`: Speichert Bear-Integrationseinstellungen in localStorage

**Wichtige Konstanten**:
- `STORAGE_KEY_ENABLED = 'plannotator-bear-enabled'`: Schlüsselname für Bear-Einstellungen in localStorage

**Bear-URL-Format**:
```typescript
bear://x-callback-url/create?title={title}&text={content}&open_note=no
```

</details>

---
title: "URL-Freigabe: Backend-freie Zusammenarbeit | Plannotator"
sidebarTitle: "Mit dem Team teilen"
subtitle: "URL-Freigabe: Backend-freie Zusammenarbeit"
description: "Lernen Sie die URL-Freigabefunktion von Plannotator kennen. Realisieren Sie Backend-freie Zusammenarbeit durch Deflate-Komprimierung und Base64-Kodierung, konfigurieren Sie Umgebungsvariablen und lösen Sie häufige Freigabeprobleme."
tags:
  - "URL-Freigabe"
  - "Teamzusammenarbeit"
  - "Backend-frei"
  - "Deflate-Komprimierung"
  - "Base64-Kodierung"
  - "Sicherheit"
prerequisite:
  - "start-getting-started"
  - "platforms-plan-review-basics"
order: 1
---

# URL-Freigabe: Backend-freie Plan-Zusammenarbeit

## Was Sie lernen werden

- ✅ Pläne und Annotationen per URL teilen, ohne Anmeldung oder Server-Deployment
- ✅ Verstehen, wie Deflate-Komprimierung und Base64-Kodierung Daten in den URL-Hash einbetten
- ✅ Zwischen Freigabemodus (schreibgeschützt) und lokalem Modus (bearbeitbar) unterscheiden
- ✅ Die Umgebungsvariable `PLANNOTATOR_SHARE` zur Steuerung der Freigabefunktion konfigurieren
- ✅ URL-Längenbeschränkungen und Freigabefehler behandeln

## Ihre aktuelle Herausforderung

**Problem 1**: Sie möchten Teammitglieder bitten, einen KI-generierten Plan zu überprüfen, haben aber keine Kollaborationsplattform.

**Problem 2**: Wenn Sie Screenshots oder kopierten Text zum Teilen von Review-Inhalten verwenden, kann der Empfänger Ihre Annotationen nicht direkt sehen.

**Problem 3**: Die Bereitstellung eines Online-Kollaborationsservers ist kostspielig, oder die Sicherheitsrichtlinien Ihres Unternehmens erlauben es nicht.

**Problem 4**: Sie benötigen eine einfache und schnelle Freigabemethode, wissen aber nicht, wie Sie den Datenschutz gewährleisten können.

**Plannotator kann Ihnen helfen**:
- Kein Backend-Server erforderlich, alle Daten werden in der URL komprimiert
- Der Freigabelink enthält den vollständigen Plan und alle Annotationen, der Empfänger kann sie einsehen
- Daten verlassen Ihr lokales Gerät nicht, Privatsphäre ist gewährleistet
- Die generierte URL kann in jedes Kommunikationstool kopiert werden

## Wann Sie diese Methode verwenden sollten

**Anwendungsfälle**:
- Teammitglieder sollen einen KI-generierten Implementierungsplan überprüfen
- Sie möchten Code-Review-Ergebnisse mit Kollegen teilen
- Sie möchten Review-Inhalte in Notizen speichern (in Kombination mit Obsidian/Bear-Integration)
- Sie möchten schnell Feedback von anderen zu einem Plan erhalten

**Nicht geeignet für**:
- Echtzeit-Kollaboration beim Bearbeiten (Plannotator-Freigabe ist schreibgeschützt)
- Planinhalte, die die URL-Längenbeschränkung überschreiten (normalerweise mehrere tausend Zeilen)
- Freigabeinhalte mit sensiblen Informationen (die URL selbst ist nicht verschlüsselt)

::: warning Sicherheitshinweis
Die Freigabe-URL enthält den vollständigen Plan und alle Annotationen. Teilen Sie keine Inhalte mit sensiblen Informationen (wie API-Schlüssel, Passwörter usw.). Die Freigabe-URL kann von jedem aufgerufen werden und läuft nicht automatisch ab.
:::

## Kernkonzept

### Was ist URL-Freigabe

**URL-Freigabe** ist eine Backend-freie Kollaborationsmethode von Plannotator, die Pläne und Annotationen in den URL-Hash komprimiert und so eine Freigabefunktion ohne Server ermöglicht.

::: info Warum "Backend-frei"?
Traditionelle Kollaborationslösungen erfordern einen Backend-Server zum Speichern von Plänen und Annotationen, auf die Benutzer über ID oder Token zugreifen. Die URL-Freigabe von Plannotator ist von keinem Backend abhängig – alle Daten befinden sich in der URL, und der Empfänger kann den Inhalt durch Öffnen des Links analysieren. Dies gewährleistet Privatsphäre (keine Daten werden hochgeladen) und Einfachheit (kein Service-Deployment erforderlich).
:::

### Funktionsweise

```
┌─────────────────────────────────────────────────────────┐
│  Benutzer A (Absender)                                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Plan überprüfen, Annotationen hinzufügen            │
│     ┌──────────────────────┐                           │
│     │ Plan: Implementierung │                           │
│     │ Annotations: [       │                           │
│     │   {type: 'REPLACE'},│                           │
│     │   {type: 'COMMENT'}  │                           │
│     │ ]                   │                           │
│     └──────────────────────┘                           │
│              │                                         │
│              ▼                                         │
│  2. Klick auf Export → Share                           │
│              │                                         │
│              ▼                                         │
│  3. Daten komprimieren                                 │
│     JSON → deflate → Base64 → URL-sichere Zeichen      │
│     ↓                                                │
│     https://share.plannotator.ai/#eJyrVkrLz1...       │
│                                                         │
└─────────────────────────────────────────────────────────┘
                         │
                         │ URL kopieren
                         ▼
┌─────────────────────────────────────────────────────────┐
│  Benutzer B (Empfänger)                                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Freigabe-URL öffnen                                 │
│     https://share.plannotator.ai/#eJyrVkrLz1...       │
│              │                                         │
│              ▼                                         │
│  2. Browser analysiert Hash                            │
│     URL-sichere Zeichen → Base64-Dekodierung → deflate-Dekomprimierung → JSON │
│              │                                         │
│              ▼                                         │
│  3. Plan und Annotationen wiederherstellen             │
│     ┌──────────────────────┐                           │
│     │ Plan: Implementierung │  ✅ Schreibgeschützt     │
│     │ Annotations: [       │  (Keine Entscheidungen)  │
│     │   {type: 'REPLACE'},│                           │
│     │   {type: 'COMMENT'}  │                           │
│     │ ]                   │                           │
│     └──────────────────────┘                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Komprimierungsalgorithmus im Detail

**Schritt 1: JSON-Serialisierung**
```json
{
  "p": "# Plan\n\nStep 1...",
  "a": [
    ["R", "old text", "new text", null, null],
    ["C", "context", "comment text", null, null]
  ],
  "g": ["image1.png", "image2.png"]
}
```

**Schritt 2: Deflate-raw-Komprimierung**
- Verwendet die native `CompressionStream('deflate-raw')` API
- Typische Kompressionsrate: 60-80% (abhängig von Textwiederholungen, nicht im Quellcode definiert)
- Quellcode-Position: `packages/ui/utils/sharing.ts:34`

**Schritt 3: Base64-Kodierung**
```typescript
const base64 = btoa(String.fromCharCode(...compressed));
```

**Schritt 4: URL-sichere Zeichenersetzung**
```typescript
base64
  .replace(/\+/g, '-')   // + → -
  .replace(/\//g, '_')   // / → _
  .replace(/=/g, '');    // = → '' (Padding entfernen)
```

::: tip Warum werden Sonderzeichen ersetzt?
Bestimmte Zeichen haben in URLs eine besondere Bedeutung (z.B. `+` steht für Leerzeichen, `/` ist ein Pfadtrenner). Base64-kodierte Daten können diese Zeichen enthalten, was zu URL-Parsing-Fehlern führen würde. Nach der Ersetzung durch `-` und `_` wird die URL sicher und kopierbar.
:::

### Annotationsformat-Optimierung

Für eine effiziente Komprimierung verwendet Plannotator ein kompaktes Annotationsformat (`ShareableAnnotation`):

| Original Annotation | Kompaktformat | Beschreibung |
| --- | --- | --- |
| `{type: 'DELETION', originalText: '...', text: undefined, ...}` | `['D', 'old text', null, images?]` | D = Deletion, null bedeutet kein text |
| `{type: 'REPLACEMENT', originalText: '...', text: 'new...', ...}` | `['R', 'old text', 'new text', null, images?]` | R = Replacement |
| `{type: 'COMMENT', originalText: '...', text: 'comment...', ...}` | `['C', 'old text', 'comment text', null, images?]` | C = Comment |
| `{type: 'INSERTION', originalText: '...', text: 'new...', ...}` | `['I', 'context', 'new text', null, images?]` | I = Insertion |
| `{type: 'GLOBAL_COMMENT', text: '...', ...}` | `['G', 'comment text', null, images?]` | G = Global comment |

Die Feldreihenfolge ist fest, Schlüsselnamen werden weggelassen, was die Datenmenge erheblich reduziert. Quellcode-Position: `packages/ui/utils/sharing.ts:76`

### Struktur der Freigabe-URL

```
https://share.plannotator.ai/#<compressed_data>
                             ↑
                         Hash-Teil
```

- **Basis-Domain**: `share.plannotator.ai` (eigenständige Freigabeseite)
- **Hash-Trennzeichen**: `#` (wird nicht an den Server gesendet, vollständig vom Frontend geparst)
- **Komprimierte Daten**: Base64url-kodiertes komprimiertes JSON

## 🎒 Vorbereitung

**Voraussetzungen**:
- ✅ [Plan-Review-Grundlagen](../../platforms/plan-review-basics/) abgeschlossen, Verständnis für das Hinzufügen von Annotationen
- ✅ [Plan-Annotationen-Tutorial](../../platforms/plan-review-annotations/) abgeschlossen, Verständnis der Annotationstypen
- ✅ Browser unterstützt `CompressionStream` API (alle modernen Browser unterstützen dies)

**Prüfen, ob die Freigabefunktion aktiviert ist**:
```bash
# Standardmäßig aktiviert
echo $PLANNOTATOR_SHARE

# Bei Bedarf deaktivieren (z.B. Unternehmens-Sicherheitsrichtlinien)
export PLANNOTATOR_SHARE=disabled
```

::: info Erklärung der Umgebungsvariablen
`PLANNOTATOR_SHARE` steuert den Aktivierungsstatus der Freigabefunktion:
- **Nicht gesetzt oder nicht "disabled"**: Freigabefunktion aktiviert
- **Auf "disabled" gesetzt**: Freigabe deaktiviert (Export Modal zeigt nur Raw Diff Tab)

Quellcode-Position: `apps/hook/server/index.ts:44`, `apps/opencode-plugin/index.ts:50`
:::

**Browser-Kompatibilität prüfen**:
```bash
# In der Browser-Konsole ausführen
const stream = new CompressionStream('deflate-raw');
console.log('CompressionStream supported');
```

Wenn `CompressionStream supported` ausgegeben wird, unterstützt der Browser die Funktion. Moderne Browser (Chrome 80+, Firefox 113+, Safari 16.4+) unterstützen dies alle.

## Schritt-für-Schritt-Anleitung

### Schritt 1: Plan-Review abschließen

**Warum**
Vor dem Teilen müssen Sie das Review abschließen, einschließlich des Hinzufügens von Annotationen.

**Vorgehensweise**:
1. Lösen Sie in Claude Code oder OpenCode ein Plan-Review aus
2. Sehen Sie sich den Planinhalt an, wählen Sie Text aus, der geändert werden soll
3. Fügen Sie Annotationen hinzu (Löschen, Ersetzen, Kommentieren usw.)
4. (Optional) Laden Sie Bildanhänge hoch

**Sie sollten sehen**:
```
┌─────────────────────────────────────────────────────────────┐
│  Plan Review                                              │
├─────────────────────────────────────────────────────────────┤
│                                                           │
│  # Implementation Plan                                    │
│                                                           │
│  ## Phase 1: Setup                                      │
│  Set up WebSocket server on port 8080                    │
│                                                           │
│  ## Phase 2: Authentication                             │
│  Implement JWT authentication middleware                   │
│                    ┌─────────────────────┐               │
│  ━━━━━━━━━━━━━━━━│ Replace: "implement" │               │
│                    └─────────────────────┘               │
│                                                           │
│  Annotation Panel                                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ REPLACE: "implement" → "add"                      │  │
│  │ JWT is overkill, use simple session tokens         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                           │
│  [Approve] [Request Changes] [Export]                   │
└─────────────────────────────────────────────────────────────┘
```

### Schritt 2: Export Modal öffnen

**Warum**
Das Export Modal bietet den Einstiegspunkt zur Generierung der Freigabe-URL.

**Vorgehensweise**:
1. Klicken Sie auf die **Export**-Schaltfläche oben rechts
2. Warten Sie, bis das Export Modal geöffnet wird

**Sie sollten sehen**:
```
┌─────────────────────────────────────────────────────────────┐
│  Export                                     ×             │
│  1 annotation                          Share | Raw Diff   │
├─────────────────────────────────────────────────────────────┤
│                                                           │
│  Shareable URL                                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ https://share.plannotator.ai/#eJyrVkrLz1...        │ │
│  │                                              [Copy] │ │
│  │                                           3.2 KB    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                           │
│  This URL contains full plan and all annotations.          │
│  Anyone with this link can view and add to your annotations.│
│                                                           │
└─────────────────────────────────────────────────────────────┘
```

::: tip URL-Größenhinweis
Unten rechts wird die Bytegröße der URL angezeigt (z.B. 3.2 KB). Wenn die URL zu lang ist (über 8 KB), sollten Sie die Anzahl der Annotationen oder Bildanhänge reduzieren.
:::

### Schritt 3: Freigabe-URL kopieren

**Warum**
Nach dem Kopieren der URL können Sie sie in jedes Kommunikationstool einfügen (Slack, E-Mail, WeChat usw.).

**Vorgehensweise**:
1. Klicken Sie auf die **Copy**-Schaltfläche
2. Warten Sie, bis die Schaltfläche zu **Copied!** wechselt
3. Die URL wurde in die Zwischenablage kopiert

**Sie sollten sehen**:
```
┌─────────────────────────────────────────────────────────────┐
│  Shareable URL                                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ https://share.plannotator.ai/#eJyrVkrLz1...        │ │
│  │                                    ✓ Copied         │ │
│  │                                           3.2 KB    │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

::: tip Automatische Auswahl
Ein Klick auf das URL-Eingabefeld wählt automatisch den gesamten Inhalt aus, was das manuelle Kopieren erleichtert (falls Sie die Copy-Schaltfläche nicht verwenden).
:::

### Schritt 4: URL an Mitarbeiter senden

**Warum**
Mitarbeiter können durch Öffnen der URL den Plan und die Annotationen einsehen.

**Vorgehensweise**:
1. Fügen Sie die URL in ein Kommunikationstool ein (Slack, E-Mail usw.)
2. Senden Sie sie an Teammitglieder

**Beispielnachricht**:
```
Hallo @Team,

Bitte helft mir bei der Überprüfung dieses Implementierungsplans:
https://share.plannotator.ai/#eJyrVkrLz1...

Ich habe in Phase 2 eine Ersetzungsannotation hinzugefügt, da ich JWT für zu komplex halte.

Bitte gebt mir euer Feedback, danke!
```

### Schritt 5: Mitarbeiter öffnet die Freigabe-URL (Empfängerseite)

**Warum**
Mitarbeiter müssen die URL im Browser öffnen, um den Inhalt anzuzeigen.

**Vorgehensweise** (vom Mitarbeiter ausgeführt):
1. Klicken Sie auf die Freigabe-URL
2. Warten Sie, bis die Seite geladen ist

**Sie sollten sehen** (Mitarbeiterperspektive):
```
┌─────────────────────────────────────────────────────────────┐
│  Plan Review                               Read-only     │
├─────────────────────────────────────────────────────────────┤
│                                                           │
│  # Implementation Plan                                    │
│                                                           │
│  ## Phase 1: Setup                                      │
│  Set up WebSocket server on port 8080                    │
│                                                           │
│  ## Phase 2: Authentication                             │
│  Implement JWT authentication middleware                   │
│                    ┌─────────────────────┐               │
│  ━━━━━━━━━━━━━━━━│ Replace: "implement" │               │
│  │                  └─────────────────────┘               │
│  │ This annotation was shared by [Your Name]             │
│                                                           │
│  Annotation Panel                                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ REPLACE: "implement" → "add"                      │  │
│  │ JWT is overkill, use simple session tokens         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                           │
│  [View Only Mode - Approve and Deny disabled]            │
└─────────────────────────────────────────────────────────────┘
```

::: warning Schreibgeschützter Modus
Nach dem Öffnen der Freigabe-URL wird oben rechts das Label "Read-only" angezeigt, und die Schaltflächen Approve und Deny sind deaktiviert. Mitarbeiter können den Plan und die Annotationen einsehen, aber keine Entscheidungen treffen.
:::

::: info Dekomprimierungsprozess
Wenn ein Mitarbeiter die URL öffnet, führt der Browser automatisch die folgenden Schritte aus (ausgelöst durch den `useSharing` Hook):
1. Komprimierte Daten aus `window.location.hash` extrahieren
2. Umgekehrte Ausführung: Base64-Dekodierung → deflate-Dekomprimierung → JSON-Parsing
3. Plan und Annotationen wiederherstellen
4. URL-Hash löschen (um erneutes Laden beim Aktualisieren zu vermeiden)

Quellcode-Position: `packages/ui/hooks/useSharing.ts:67`
:::

### Checkpoint ✅

**Überprüfen, ob die Freigabe-URL gültig ist**:
1. Kopieren Sie die Freigabe-URL
2. Öffnen Sie sie in einem neuen Tab oder im Inkognito-Modus
3. Bestätigen Sie, dass derselbe Plan und dieselben Annotationen angezeigt werden

**Schreibgeschützten Modus überprüfen**:
1. Mitarbeiter öffnet die Freigabe-URL
2. Prüfen Sie, ob oben rechts das Label "Read-only" angezeigt wird
3. Bestätigen Sie, dass die Schaltflächen Approve und Deny deaktiviert sind

**URL-Länge überprüfen**:
1. Sehen Sie sich die URL-Größe im Export Modal an
2. Bestätigen Sie, dass sie 8 KB nicht überschreitet (falls ja, reduzieren Sie die Annotationen)

## Häufige Probleme

### Problem 1: URL-Freigabe-Schaltfläche wird nicht angezeigt

**Symptom**: Im Export Modal gibt es keinen Share-Tab, nur Raw Diff.

**Ursache**: Die Umgebungsvariable `PLANNOTATOR_SHARE` ist auf "disabled" gesetzt.

**Lösung**:
```bash
# Aktuellen Wert prüfen
echo $PLANNOTATOR_SHARE

# Entfernen oder auf anderen Wert setzen
unset PLANNOTATOR_SHARE
# oder
export PLANNOTATOR_SHARE=enabled
```

Quellcode-Position: `apps/hook/server/index.ts:44`

### Problem 2: Freigabe-URL zeigt leere Seite

**Symptom**: Mitarbeiter öffnet die URL, die Seite hat keinen Inhalt.

**Ursache**: Der URL-Hash wurde beim Kopieren verloren oder abgeschnitten.

**Lösung**:
1. Stellen Sie sicher, dass Sie die vollständige URL kopieren (einschließlich `#` und aller folgenden Zeichen)
2. Verwenden Sie keine URL-Kürzungsdienste (diese können den Hash abschneiden)
3. Verwenden Sie die Copy-Schaltfläche im Export Modal anstelle von manuellem Kopieren

::: tip URL-Hash-Länge
Der Hash-Teil der Freigabe-URL hat normalerweise mehrere tausend Zeichen, manuelles Kopieren kann leicht etwas übersehen. Es wird empfohlen, die Copy-Schaltfläche zu verwenden oder durch zweimaliges Kopieren → Einfügen die Vollständigkeit zu überprüfen.
:::

### Problem 3: URL zu lang zum Senden

**Symptom**: Die URL überschreitet die Zeichenbegrenzung des Kommunikationstools (z.B. WeChat, Slack).

**Ursache**: Der Planinhalt ist zu lang oder es gibt zu viele Annotationen.

**Lösung**:
1. Unnötige Annotationen löschen
2. Bildanhänge reduzieren
3. Raw Diff Export verwenden und als Datei speichern
4. Code-Review-Funktion verwenden (Diff-Modus hat höhere Kompressionsrate)

### Problem 4: Mitarbeiter kann meine Bilder nicht sehen

**Symptom**: Die Freigabe-URL enthält Bildpfade, aber der Mitarbeiter sieht "Image not found".

**Ursache**: Bilder werden im lokalen `/tmp/plannotator/`-Verzeichnis gespeichert, auf das der Mitarbeiter keinen Zugriff hat.

**Lösung**:
- Die URL-Freigabe von Plannotator unterstützt keinen geräteübergreifenden Bildzugriff
- Es wird empfohlen, die Obsidian-Integration zu verwenden; nach dem Speichern von Bildern im Vault können diese geteilt werden
- Oder Screenshots machen und in die Annotation einbetten (als Textbeschreibung)

Quellcode-Position: `packages/server/index.ts:163` (Bildspeicherpfad)

### Problem 5: URL wird nach Änderung der Annotationen nicht aktualisiert

**Symptom**: Nach dem Hinzufügen neuer Annotationen ändert sich die URL im Export Modal nicht.

**Ursache**: Der `shareUrl`-Status wurde nicht automatisch aktualisiert (seltener Fall, normalerweise ein React-Statusaktualisierungsproblem).

**Lösung**:
1. Export Modal schließen
2. Export Modal erneut öffnen
3. Die URL sollte automatisch auf den neuesten Inhalt aktualisiert werden

Quellcode-Position: `packages/ui/hooks/useSharing.ts:128` (`refreshShareUrl`-Funktion)

## Zusammenfassung

Die **URL-Freigabefunktion** ermöglicht es Ihnen, Pläne und Annotationen ohne Backend-Server zu teilen:

- ✅ **Backend-frei**: Daten werden im URL-Hash komprimiert, kein Server erforderlich
- ✅ **Datenschutz**: Daten werden nicht hochgeladen, nur zwischen Ihnen und dem Mitarbeiter übertragen
- ✅ **Einfach und effizient**: URL mit einem Klick generieren, kopieren und einfügen zum Teilen
- ✅ **Schreibgeschützter Modus**: Mitarbeiter können Annotationen einsehen und hinzufügen, aber keine Entscheidungen treffen

**Technische Prinzipien**:
1. **Deflate-raw-Komprimierung**: JSON-Daten um ca. 60-80% komprimieren
2. **Base64-Kodierung**: Binärdaten in Text umwandeln
3. **URL-sichere Zeichenersetzung**: `+` → `-`, `/` → `_`, `=` → `''`
4. **Hash-Parsing**: Frontend dekomprimiert und stellt Inhalt automatisch wieder her

**Konfigurationsoptionen**:
- `PLANNOTATOR_SHARE=disabled`: Freigabefunktion deaktivieren
- Standardmäßig aktiviert: Freigabefunktion verfügbar

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir die **[Obsidian-Integration](../obsidian-integration/)**.
>
> Sie werden lernen:
> - Obsidian Vaults automatisch erkennen
> - Genehmigte Pläne in Obsidian speichern
> - Frontmatter und Tags automatisch generieren
> - URL-Freigabe mit Obsidian-Wissensmanagement kombinieren

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir die **[Obsidian-Integration](../obsidian-integration/)**.
>
> Sie werden lernen:
> - Wie Sie die Obsidian-Integration konfigurieren, um Pläne automatisch im Vault zu speichern
> - Den Frontmatter- und Tag-Generierungsmechanismus verstehen
> - Backlinks nutzen, um einen Wissensgraphen aufzubauen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisierungsdatum: 2026-01-24

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Daten komprimieren (deflate + Base64) | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L30-L48) | 30-48 |
| Daten dekomprimieren | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L53-L71) | 53-71 |
| Annotationsformat konvertieren (kompakt) | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L76-L95) | 76-95 |
| Annotationsformat wiederherstellen | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L102-L155) | 102-155 |
| Freigabe-URL generieren | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L162-L175) | 162-175 |
| URL-Hash parsen | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L181-L194) | 181-194 |
| URL-Größe formatieren | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L199-L205) | 199-205 |
| URL-Freigabe-Hook | [`packages/ui/hooks/useSharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/hooks/useSharing.ts#L45-L155) | 45-155 |
| Export Modal UI | [`packages/ui/components/ExportModal.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ExportModal.tsx#L1-L196) | 1-196 |
| Freigabe-Schalter-Konfiguration (Hook) | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L44) | 44 |
| Freigabe-Schalter-Konfiguration (OpenCode) | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L50) | 50 |

**Wichtige Konstanten**:
- `SHARE_BASE_URL = 'https://share.plannotator.ai'`: Basis-Domain der Freigabeseite

**Wichtige Funktionen**:
- `compress(payload: SharePayload): Promise<string>`: Komprimiert Payload zu base64url-String
- `decompress(b64: string): Promise<SharePayload>`: Dekomprimiert base64url-String zu Payload
- `toShareable(annotations: Annotation[]): ShareableAnnotation[]`: Konvertiert vollständige Annotationen in kompaktes Format
- `fromShareable(data: ShareableAnnotation[]): Annotation[]`: Stellt kompaktes Format zu vollständigen Annotationen wieder her
- `generateShareUrl(markdown, annotations, attachments): Promise<string>`: Generiert vollständige Freigabe-URL
- `parseShareHash(): Promise<SharePayload | null>`: Parst den Hash der aktuellen URL

**Datentypen**:
```typescript
interface SharePayload {
  p: string;  // plan markdown
  a: ShareableAnnotation[];
  g?: string[];  // global attachments
}

type ShareableAnnotation =
  | ['D', string, string | null, string[]?]  // Deletion
  | ['R', string, string, string | null, string[]?]  // Replacement
  | ['C', string, string, string | null, string[]?]  // Comment
  | ['I', string, string, string | null, string[]?]  // Insertion
  | ['G', string, string | null, string[]?];  // Global Comment
```

</details>

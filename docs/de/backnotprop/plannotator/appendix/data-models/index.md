---
title: "Datenmodelle: Vollständige Definition der Kerntypen | Plannotator"
subtitle: "Datenmodelle: Vollständige Definition der Kerntypen | Plannotator"
sidebarTitle: "Kerndatenmodelle beherrschen"
description: "Lernen Sie die Datenmodelle von Plannotator kennen. Beherrschen Sie die vollständigen Definitionen und Feldbeschreibungen der Kerntypen wie Annotation, Block, CodeAnnotation und verstehen Sie die Systemarchitektur tiefgehend."
tags:
  - "Datenmodelle"
  - "Typdefinitionen"
  - "API-Referenz"
prerequisite: []
order: 2
---

# Plannotator Datenmodelle

Dieser Anhang stellt alle von Plannotator verwendeten Datenmodelle vor, einschließlich der Kerndatenstrukturen für Planprüfung, Codeprüfung, URL-Sharing und mehr.

## Übersicht der Kerndatenmodelle

Plannotator definiert die folgenden Kerndatenmodelle mit TypeScript:

| Modell | Verwendungszweck | Definitionsort |
| --- | --- | --- |
| `Annotation` | Kommentare in der Planprüfung | [`packages/ui/types.ts:11-33`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L11-L33) |
| `Block` | Inhaltsblöcke nach Markdown-Parsing | [`packages/ui/types.ts:35-44`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L35-L44) |
| `CodeAnnotation` | Kommentare in der Codeprüfung | [`packages/ui/types.ts:55-66`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L55-L66) |
| `ShareableAnnotation` | Kompaktes Kommentarformat für URL-Sharing | [`packages/ui/utils/sharing.ts:14-19`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L14-L19) |

## Annotation (Plankommentar)

`Annotation` repräsentiert einen Kommentar in der Planprüfung und wird verwendet, um Löschungen, Einfügungen, Ersetzungen oder Kommentare im Plan zu markieren.

### Vollständige Definition

```typescript
export interface Annotation {
  id: string;              // Eindeutige Kennung
  blockId: string;         // Zugehörige Block-ID (veraltet, für Kompatibilität beibehalten)
  startOffset: number;     // Start-Offset (veraltet, für Kompatibilität beibehalten)
  endOffset: number;       // End-Offset (veraltet, für Kompatibilität beibehalten)
  type: AnnotationType;     // Kommentartyp
  text?: string;           // Kommentarinhalt (für INSERTION/REPLACEMENT/COMMENT)
  originalText: string;    // Ursprünglicher kommentierter Text
  createdA: number;        // Erstellungszeitstempel
  author?: string;         // Mitarbeiteridentität (für URL-Sharing)
  imagePaths?: string[];    // Pfade zu angehängten Bildern
  startMeta?: {            // web-highlighter Metadaten für elementübergreifende Auswahl
    parentTagName: string;
    parentIndex: number;
    textOffset: number;
  };
  endMeta?: {              // web-highlighter Metadaten für elementübergreifende Auswahl
    parentTagName: string;
    parentIndex: number;
    textOffset: number;
  };
}
```

### AnnotationType Enumeration

```typescript
export enum AnnotationType {
  DELETION = 'DELETION',           // Diesen Inhalt löschen
  INSERTION = 'INSERTION',         // Diesen Inhalt einfügen
  REPLACEMENT = 'REPLACEMENT',     // Diesen Inhalt ersetzen
  COMMENT = 'COMMENT',             // Diesen Inhalt kommentieren
  GLOBAL_COMMENT = 'GLOBAL_COMMENT', // Globaler Kommentar (nicht mit spezifischem Text verknüpft)
}
```

### Feldbeschreibungen

| Feld | Typ | Erforderlich | Beschreibung |
| --- | --- | --- | --- |
| `id` | string | ✅ | Eindeutige Kennung, normalerweise automatisch generierte UUID |
| `blockId` | string | ✅ | Zugehörige `Block`-ID (veraltet, für Kompatibilität beibehalten) |
| `startOffset` | number | ✅ | Start-Zeichen-Offset (veraltet, für Kompatibilität beibehalten) |
| `endOffset` | number | ✅ | End-Zeichen-Offset (veraltet, für Kompatibilität beibehalten) |
| `type` | AnnotationType | ✅ | Kommentartyp (DELETION/INSERTION/REPLACEMENT/COMMENT/GLOBAL_COMMENT) |
| `text` | string | ❌ | Kommentarinhalt (auszufüllen bei INSERTION/REPLACEMENT/COMMENT) |
| `originalText` | string | ✅ | Ursprünglicher kommentierter Text |
| `createdA` | number | ✅ | Erstellungszeitstempel (Millisekunden) |
| `author` | string | ❌ | Mitarbeiteridentität (zur Unterscheidung von Autoren beim URL-Sharing) |
| `imagePaths` | string[] | ❌ | Array von Pfaden zu angehängten Bildern |
| `startMeta` | object | ❌ | Start-Metadaten für elementübergreifende Auswahl mit web-highlighter |
| `endMeta` | object | ❌ | End-Metadaten für elementübergreifende Auswahl mit web-highlighter |

### Beispiele

#### Löschungskommentar

```typescript
{
  id: "anno-001",
  blockId: "block-0",
  startOffset: 0,
  endOffset: 50,
  type: AnnotationType.DELETION,
  originalText: "Dieser Teil wird nicht benötigt",
  createdA: Date.now(),
}
```

#### Ersetzungskommentar

```typescript
{
  id: "anno-002",
  blockId: "block-0",
  startOffset: 0,
  endOffset: 50,
  type: AnnotationType.REPLACEMENT,
  text: "Neuer Inhalt",
  originalText: "Alter Inhalt",
  createdA: Date.now(),
  imagePaths: ["/tmp/plannotator/screenshot-001.png"],
}
```

#### Globaler Kommentar

```typescript
{
  id: "anno-003",
  blockId: "",
  startOffset: 0,
  endOffset: 0,
  type: AnnotationType.GLOBAL_COMMENT,
  text: "Insgesamt ist der Plan sehr klar",
  originalText: "",
  createdA: Date.now(),
}
```

::: info Erklärung veralteter Felder
Die Felder `blockId`, `startOffset` und `endOffset` wurden in älteren Versionen für zeichenbasiertes Text-Highlighting verwendet. Die aktuelle Version verwendet die [web-highlighter](https://github.com/alvarotrigo/web-highlighter)-Bibliothek und implementiert elementübergreifende Auswahl über `startMeta` und `endMeta`. Diese Felder werden nur aus Kompatibilitätsgründen beibehalten.
:::

## Block (Planblock)

`Block` repräsentiert einen Inhaltsblock nach dem Parsen von Markdown-Text und wird zur strukturierten Anzeige von Planinhalten verwendet.

### Vollständige Definition

```typescript
export interface Block {
  id: string;              // Eindeutige Kennung
  type: BlockType;         // Blocktyp
  content: string;        // Reiner Textinhalt
  level?: number;         // Ebene (für Überschriften oder Listen)
  language?: string;      // Code-Sprache (für Codeblöcke)
  checked?: boolean;      // Checkbox-Status (für Listenelemente)
  order: number;          // Sortierreihenfolge
  startLine: number;      // Startzeilennummer (1-basiert)
}
```

### BlockType Typ

```typescript
type BlockType =
  | 'paragraph'     // Absatz
  | 'heading'       // Überschrift
  | 'blockquote'    // Zitatblock
  | 'list-item'     // Listenelement
  | 'code'          // Codeblock
  | 'hr'            // Trennlinie
  | 'table';        // Tabelle
```

### Feldbeschreibungen

| Feld | Typ | Erforderlich | Beschreibung |
| --- | --- | --- | --- |
| `id` | string | ✅ | Eindeutige Kennung im Format `block-{Nummer}` |
| `type` | BlockType | ✅ | Blocktyp (paragraph/heading/blockquote/list-item/code/hr/table) |
| `content` | string | ✅ | Reiner Textinhalt des Blocks |
| `level` | number | ❌ | Ebene: 1-6 für Überschriften, Einrückungsebene für Listenelemente |
| `language` | string | ❌ | Sprache des Codeblocks (z.B. 'typescript', 'rust') |
| `checked` | boolean | ❌ | Checkbox-Status des Listenelements (true = aktiviert, false = deaktiviert) |
| `order` | number | ✅ | Sortierindex zur Beibehaltung der Blockreihenfolge |
| `startLine` | number | ✅ | Startzeilennummer im Quell-Markdown (beginnend bei 1) |

### Beispiele

#### Überschriftenblock

```typescript
{
  id: "block-0",
  type: "heading",
  content: "Implementation Plan",
  level: 1,
  order: 1,
  startLine: 1,
}
```

#### Absatzblock

```typescript
{
  id: "block-1",
  type: "paragraph",
  content: "This is a paragraph with some text.",
  order: 2,
  startLine: 3,
}
```

#### Codeblock

```typescript
{
  id: "block-2",
  type: "code",
  content: "function hello() {\n  return 'world';\n}",
  language: "typescript",
  order: 3,
  startLine: 5,
}
```

#### Listenelement (mit Checkbox)

```typescript
{
  id: "block-3",
  type: "list-item",
  content: "Authentifizierungsmodul abschließen",
  level: 0,
  checked: true,
  order: 4,
  startLine: 10,
}
```

::: tip Markdown-Parsing
Plannotator verwendet einen benutzerdefinierten vereinfachten Markdown-Parser (`parseMarkdownToBlocks`), um Quell-Markdown in ein `Block[]`-Array zu konvertieren. Der Parser unterstützt gängige Syntax wie Überschriften, Listen, Codeblöcke, Tabellen und Zitatblöcke.
:::

## CodeAnnotation (Codekommentar)

`CodeAnnotation` repräsentiert einen zeilenbasierten Kommentar in der Codeprüfung und wird verwendet, um Feedback zu bestimmten Zeilen oder Bereichen eines Git-Diffs hinzuzufügen.

### Vollständige Definition

```typescript
export interface CodeAnnotation {
  id: string;              // Eindeutige Kennung
  type: CodeAnnotationType;  // Kommentartyp
  filePath: string;         // Dateipfad
  lineStart: number;        // Startzeilennummer
  lineEnd: number;          // Endzeilennummer
  side: 'old' | 'new';     // Seite ('old' = gelöschte Zeilen, 'new' = hinzugefügte Zeilen)
  text?: string;           // Kommentarinhalt
  suggestedCode?: string;    // Vorgeschlagener Code (für suggestion-Typ)
  createdAt: number;        // Erstellungszeitstempel
  author?: string;         // Mitarbeiteridentität
}
```

### CodeAnnotationType Typ

```typescript
export type CodeAnnotationType =
  | 'comment'      // Normaler Kommentar
  | 'suggestion'  // Änderungsvorschlag (erfordert suggestedCode)
  | 'concern';     // Bedenken (wichtige Erinnerung)
```

### Feldbeschreibungen

| Feld | Typ | Erforderlich | Beschreibung |
| --- | --- | --- | --- |
| `id` | string | ✅ | Eindeutige Kennung |
| `type` | CodeAnnotationType | ✅ | Kommentartyp (comment/suggestion/concern) |
| `filePath` | string | ✅ | Relativer Pfad der kommentierten Datei (z.B. `src/auth.ts`) |
| `lineStart` | number | ✅ | Startzeilennummer (beginnend bei 1) |
| `lineEnd` | number | ✅ | Endzeilennummer (beginnend bei 1) |
| `side` | 'old' \| 'new' | ✅ | Seite: `'old'` = gelöschte Zeilen (alte Version), `'new'` = hinzugefügte Zeilen (neue Version) |
| `text` | string | ❌ | Kommentarinhalt |
| `suggestedCode` | string | ❌ | Vorgeschlagener Code (erforderlich wenn type 'suggestion' ist) |
| `createdAt` | number | ✅ | Erstellungszeitstempel (Millisekunden) |
| `author` | string | ❌ | Mitarbeiteridentität |

### Erklärung des side-Feldes

Das `side`-Feld entspricht der Diff-Ansicht der [@pierre/diffs](https://www.npmjs.com/package/@pierre/diffs)-Bibliothek:

| side-Wert | @pierre/diffs Entsprechung | Beschreibung |
| --- | --- | --- |
| `'old'` | `deletions` | Gelöschte Zeilen (Inhalt in der alten Version) |
| `'new'` | `additions` | Hinzugefügte Zeilen (Inhalt in der neuen Version) |

### Beispiele

#### Normaler Kommentar (hinzugefügte Zeile)

```typescript
{
  id: "code-anno-001",
  type: "comment",
  filePath: "src/auth.ts",
  lineStart: 15,
  lineEnd: 15,
  side: "new",
  text: "Hier muss der Fehlerfall behandelt werden",
  createdAt: Date.now(),
}
```

#### Änderungsvorschlag (gelöschte Zeile)

```typescript
{
  id: "code-anno-002",
  type: "suggestion",
  filePath: "src/auth.ts",
  lineStart: 10,
  lineEnd: 12,
  side: "old",
  text: "Empfehle Verwendung von async/await",
  suggestedCode: "async function authenticate() {\n  const user = await fetchUser();\n  return user;\n}",
  createdAt: Date.now(),
}
```

## ShareableAnnotation (Sharing-Kommentar)

`ShareableAnnotation` ist ein kompaktes Kommentarformat für URL-Sharing, dargestellt durch Array-Tupel zur Reduzierung der Payload-Größe.

### Vollständige Definition

```typescript
export type ShareableAnnotation =
  | ['D', string, string | null, string[]?]           // Deletion: [type, original, author, images]
  | ['R', string, string, string | null, string[]?]   // Replacement: [type, original, replacement, author, images]
  | ['C', string, string, string | null, string[]?]   // Comment: [type, original, comment, author, images]
  | ['I', string, string, string | null, string[]?]   // Insertion: [type, context, new text, author, images]
  | ['G', string, string | null, string[]?];          // Global Comment: [type, comment, author, images]
```

### Typbeschreibungen

| Typ | Erstes Zeichen | Tupelstruktur | Beschreibung |
| --- | --- | --- | --- |
| DELETION | `'D'` | `['D', original, author?, images?]` | Inhalt löschen |
| REPLACEMENT | `'R'` | `['R', original, replacement, author?, images?]` | Inhalt ersetzen |
| COMMENT | `'C'` | `['C', original, comment, author?, images?]` | Inhalt kommentieren |
| INSERTION | `'I'` | `['I', context, newText, author?, images?]` | Inhalt einfügen |
| GLOBAL_COMMENT | `'G'` | `['G', comment, author?, images?]` | Globaler Kommentar |

### Beispiele

```typescript
// Löschung
['D', 'Zu löschender Inhalt', null, []]

// Ersetzung
['R', 'Originaltext', 'Ersetzen durch', null, ['/tmp/img.png']]

// Kommentar
['C', 'Dieser Code', 'Empfehle Optimierung', null, []]

// Einfügung
['I', 'Kontext', 'Einzufügender neuer Inhalt', null, []]

// Globaler Kommentar
['G', 'Insgesamt sehr gut', null, []]
```

::: tip Warum kompaktes Format?
Die Verwendung von Array-Tupeln anstelle von Objekten reduziert die Payload-Größe, was zu kürzeren URLs nach Komprimierung führt. Zum Beispiel:
- Objektformat: `{"type":"DELETION","originalText":"text"}` → 38 Bytes
- Kompaktformat: `["D","text",null,[]]` → 18 Bytes
:::

## SharePayload (Sharing-Payload)

`SharePayload` ist die vollständige Datenstruktur für URL-Sharing, die Planinhalte und Kommentare enthält.

### Vollständige Definition

```typescript
export interface SharePayload {
  p: string;                  // Markdown-Text des Plans
  a: ShareableAnnotation[];    // Kommentar-Array (kompaktes Format)
  g?: string[];              // Globale Anhangspfade (Bilder)
}
```

### Feldbeschreibungen

| Feld | Typ | Erforderlich | Beschreibung |
| --- | --- | --- | --- |
| `p` | string | ✅ | Markdown-Inhalt des ursprünglichen Plans |
| `a` | ShareableAnnotation[] | ✅ | Kommentar-Array (verwendet `ShareableAnnotation` kompaktes Format) |
| `g` | string[] | ❌ | Globale Anhangspfade (Bilder, die nicht mit spezifischen Kommentaren verknüpft sind) |

### Beispiel

```typescript
{
  p: "# Implementation Plan\n\n1. Add auth\n2. Add UI",
  a: [
    ['C', 'Add auth', 'Muss OAuth unterstützen', null, []],
    ['G', 'Gesamtplan ist klar', null, []],
  ],
  g: ['/tmp/plannotator/diagram.png'],
}
```

## Frontmatter (Vordere Metadaten)

`Frontmatter` repräsentiert YAML-Metadaten am Anfang einer Markdown-Datei zur Speicherung zusätzlicher Informationen.

### Vollständige Definition

```typescript
export interface Frontmatter {
  [key: string]: string | string[];
}
```

### Beispiel

```markdown
---
created: 2026-01-24T14:30:00.000Z
source: plannotator
tags: [authentication, typescript]
author: John Doe
---

### Implementation Plan (Beispiel)
...
```

Nach dem Parsen:

```typescript
{
  created: "2026-01-24T14:30:00.000Z",
  source: "plannotator",
  tags: ["authentication", "typescript"],
  author: "John Doe",
}
```

::: tip Verwendungszweck von Frontmatter
Plannotator generiert beim Speichern von Plänen in Obsidian automatisch Frontmatter, einschließlich Erstellungszeit, Quell-Tags usw., um Notizverwaltung und -suche zu erleichtern.
:::

## Verwandte Hilfstypen

### EditorMode (Editor-Modus)

```typescript
export type EditorMode = 'selection' | 'comment' | 'redline';
```

- `'selection'`: Textauswahlmodus
- `'comment'`: Kommentarmodus
- `'redline'`: Rotlinienmodus

### DiffResult (Diff-Ergebnis)

```typescript
export interface DiffResult {
  original: string;    // Ursprünglicher Inhalt
  modified: string;    // Geänderter Inhalt
  diffText: string;    // Unified Diff-Text
}
```

### DiffAnnotationMetadata (Diff-Kommentar-Metadaten)

```typescript
export interface DiffAnnotationMetadata {
  annotationId: string;      // Zugehörige Kommentar-ID
  type: CodeAnnotationType;  // Kommentartyp
  text?: string;            // Kommentarinhalt
  suggestedCode?: string;   // Vorgeschlagener Code
  author?: string;          // Autor
}
```

### SelectedLineRange (Ausgewählter Zeilenbereich)

```typescript
export interface SelectedLineRange {
  start: number;                      // Startzeilennummer
  end: number;                        // Endzeilennummer
  side: 'deletions' | 'additions';   // Seite (entspricht @pierre/diffs Diff-Ansicht)
  endSide?: 'deletions' | 'additions'; // Endseite (für seitenübergreifende Auswahl)
}
```

## Datenkonvertierungsbeziehungen

### Annotation ↔ ShareableAnnotation

```typescript
// Vollständig → Kompakt
function toShareable(annotations: Annotation[]): ShareableAnnotation[]

// Kompakt → Vollständig
function fromShareable(data: ShareableAnnotation[]): Annotation[]
```

::: info Koordinatenverlust
Die von `fromShareable` generierten `Annotation`-Felder `blockId`, `startOffset` und `endOffset` sind leer oder 0 und müssen durch Textabgleich oder web-highlighter wiederhergestellt werden.
:::

### Markdown ↔ Block[]

```typescript
// Markdown → Block[]
function parseMarkdownToBlocks(markdown: string): Block[]

// Block[] + Annotation[] → Markdown
function exportDiff(blocks: Block[], annotations: Annotation[]): string
```

## Zusammenfassung dieser Lektion

Dieser Anhang stellte alle Kerndatenmodelle von Plannotator vor:

- **Annotation**: Kommentare in der Planprüfung, unterstützt Typen wie Löschung, Einfügung, Ersetzung und Kommentar
- **Block**: Inhaltsblöcke nach Markdown-Parsing zur strukturierten Anzeige von Plänen
- **CodeAnnotation**: Zeilenbasierte Kommentare in der Codeprüfung, unterstützt Kommentare und Vorschläge
- **ShareableAnnotation**: Kompaktes Format für URL-Sharing zur Reduzierung der Payload-Größe
- **SharePayload**: Vollständige Datenstruktur für URL-Sharing

Diese Datenmodelle werden in Funktionen wie Planprüfung, Codeprüfung und URL-Sharing umfassend eingesetzt. Ihr Verständnis hilft bei der tiefgehenden Anpassung und Erweiterung von Plannotator.

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Plannotator Lizenzinformationen](../license/)**.
>
> Sie werden sehen:
> - Kernbestimmungen der Business Source License 1.1 (BSL)
> - Erlaubte Nutzungsweisen und kommerzielle Einschränkungen
> - Zeitplan für die Umstellung auf Apache 2.0 im Jahr 2030
> - Wie man eine kommerzielle Lizenz erhält

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie zum Erweitern der Quellcode-Positionen</strong></summary>

> Aktualisierungszeit: 2026-01-24

| Funktion | Dateipfad | Zeilennummern |
| --- | --- | --- |
| Annotation Interface | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L11-L33) | 11-33 |
| AnnotationType Enumeration | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L1-L7) | 1-7 |
| Block Interface | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L35-L44) | 35-44 |
| CodeAnnotation Interface | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L55-L66) | 55-66 |
| CodeAnnotationType Typ | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L53) | 53 |
| ShareableAnnotation Typ | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L14-L19) | 14-19 |
| SharePayload Interface | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L21-L25) | 21-25 |
| toShareable() | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L76-L95) | 76-95 |
| fromShareable() | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L102-L155) | 102-155 |
| parseMarkdownToBlocks() | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L70-L244) | 70-244 |
| exportDiff() | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L246-L323) | 246-323 |
| extractFrontmatter() | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L14-L63) | 14-63 |

**Wichtige Konstanten**:
- Keine

**Wichtige Funktionen**:
- `toShareable(annotations: Annotation[]): ShareableAnnotation[]`: Konvertiert vollständige Kommentare in kompaktes Format
- `fromShareable(data: ShareableAnnotation[]): Annotation[]`: Stellt kompaktes Format zu vollständigen Kommentaren wieder her
- `parseMarkdownToBlocks(markdown: string): Block[]`: Parst Markdown zu Block-Array
- `exportDiff(blocks: Block[], annotations: Annotation[]): string`: Exportiert Kommentare in Markdown-Format

</details>

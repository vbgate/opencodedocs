---
title: "Plan-Anmerkungen: Vier Anmerkungstypen | plannotator"
sidebarTitle: "Vier Anmerkungstypen hinzufügen"
subtitle: "Plan-Anmerkungen: Vier Anmerkungstypen"
description: "Beherrschen Sie die Verwendung der vier Anmerkungstypen in Plannotator. Lernen Sie Techniken zum Hinzufügen von Löschungen, Ersetzungen, Einfügungen und Kommentaren mit type-to-comment-Schnelleingabe und Bildanhängen zur Verbesserung der Planeffizienz."
tags:
  - "Plan-Anmerkungen"
  - "Anmerkungstypen"
  - "Löschung"
  - "Ersetzung"
  - "Einfügung"
  - "Kommentar"
  - "type-to-comment"
  - "Bildanhang"
prerequisite:
  - "platforms-plan-review-basics"
order: 2
---

# Plan-Anmerkungen hinzufügen: Beherrschen der vier Anmerkungstypen

## Was Sie nach diesem Tutorial können

- ✅ Vier verschiedene Anmerkungstypen zu ausgewähltem Plantext hinzufügen (Löschung, Ersetzung, Einfügung, Kommentar)
- ✅ type-to-comment-Tastenkürzel verwenden, um direkt Kommentare einzugeben
- ✅ Bilder zu Anmerkungen hinzufügen (Referenzbilder, Screenshots usw.)
- ✅ Die Bedeutung und Anwendungsszenarien jedes Anmerkungstyps verstehen
- ✅ Das Markdown-Format von exportierten Anmerkungen anzeigen

## Ihre aktuelle Situation

**Problem 1**: Sie wissen, dass ein bestimmter Inhalt gelöscht werden soll, aber nach dem Markieren des Textes wissen Sie nicht, welchen Button Sie klicken sollen.

**Problem 2**: Sie möchten einen Code-Abschnitt ersetzen, aber in der Toolbar gibt es nur "Löschen" und "Kommentar", keine "Ersetzen"-Option.

**Problem 3**: Sie möchten einen Kommentar zu mehreren markierten Textzeilen eingeben, aber jedes Mal müssen Sie zuerst auf die "Comment"-Schaltfläche klicken, was ineffizient ist.

**Problem 4**: Sie möchten einem Code-Abschnitt ein Referenzbild hinzufügen, wissen aber nicht, wie Sie ein Bild hochladen.

**Plannotator kann Ihnen helfen**:
- Klare Button-Symbole, auf denen Sie auf einen Blick den Unterschied zwischen Löschen, Ersetzen, Einfügen und Kommentieren erkennen
- type-to-comment-Tastenkürzel, direkte Eingabe ohne Button-Klick
- Unterstützung für Bildanhänge in Anmerkungen, einfaches Hinzufügen von Referenzbildern
- Automatische Konvertierung von Anmerkungen in strukturiertes Markdown, das AI genau versteht

## Wann Sie diese Funktion verwenden

**Anwendungsszenarien**:
- Überprüfung von AI-generierten Implementierungsplänen, präzises Feedback zu Änderungen erforderlich
- Ein Abschnitt ist nicht erforderlich (Löschung)
- Ein Abschnitt muss anders formuliert werden (Ersetzung)
- Nach einem Abschnitt muss eine Erklärung ergänzt werden (Einfügung)
- Fragen oder Vorschläge zu einem Abschnitt (Kommentar)

**Nicht geeignete Szenarien**:
- Nur allgemeine Genehmigung oder Ablehnung des Plans (keine Anmerkungen erforderlich, direkte Entscheidung ausreichend)
- Bereits Überprüfung von Code-Änderungen (Verwendung der Code-Review-Funktion)

## 🎒 Vorbereitung vor dem Start

**Voraussetzungen**:
- ✅ Tutorial [Plan-Review-Grundlagen](../../plan-review-basics/) abgeschlossen
- ✅ Verständnis, wie die Plannotator-Plan-Review-Oberfläche aufgerufen wird

**Annahmen für diese Lektion**:
- Sie haben die Plannotator-Plan-Review-Seite geöffnet
- Die Seite zeigt einen AI-generierten Markdown-Plan

## Kernkonzept

### Detaillierte Erklärung der Anmerkungstypen

Plannotator unterstützt vier Plan-Anmerkungstypen (plus einen globalen Kommentar):

| Anmerkungstyp | Symbol | Verwendung | Eingabe erforderlich |
| --- | --- | --- | --- |
| **Löschung (DELETION)** | 🗑️ | Markiert Inhalt, der aus dem Plan entfernt werden soll | ❌ Nicht erforderlich |
| **Kommentar (COMMENT)** | 💬 | Stellt Fragen oder macht Vorschläge zum markierten Inhalt | ✅ Eingabe erforderlich |
| **Ersetzung (REPLACEMENT)** | Über Kommentar | Ersetzt markierten Inhalt durch neuen Inhalt | ✅ Neuer Inhalt erforderlich |
| **Einfügung (INSERTION)** | Über Kommentar | Fügt neuen Inhalt nach markiertem Inhalt ein | ✅ Neuer Inhalt erforderlich |
| **Globaler Kommentar (GLOBAL_COMMENT)** | Eingabefeld am Seitenende | Gibt Feedback zum gesamten Plan | ✅ Kommentareingabe erforderlich |

**Warum haben Ersetzung und Einfügung keine eigenen Buttons?**

Weil aus der Quellcode-Implementierung hervorgeht, dass Ersetzung und Einfügung im Wesentlichen spezielle Kommentartypen sind (`packages/ui/utils/parser.ts:287-296`):
- **Ersetzung**: Kommentarinhalt als neuer Ersatztext
- **Einfügung**: Kommentarinhalt als einzufügender neuer Text

Beide werden mit der **Kommentar (COMMENT)**-Schaltfläche erstellt, der Unterschied liegt darin, wie Sie Ihre Absicht beschreiben.

### Toolbar-Workflow

```
Text markieren → Toolbar erscheint (Menü-Schritt)
│
├── Klick auf Delete → Löschanmerkung sofort erstellt
├── Klick auf Comment → Eingabe-Schritt → Inhalt eingeben → Speichern
└── Direkte Zeicheneingabe → type-to-comment → Automatischer Eingabe-Schritt
```

**Unterschied zwischen den beiden Schritten**:
- **Menü-Schritt**: Auswahl des Operationstyps (Löschen, Kommentieren, Abbrechen)
- **Eingabe-Schritt**: Eingabe von Kommentarinhalt oder Anhängen von Bildern (aus Kommentar/Ersetzung/Einfügung)

### type-to-comment-Tastenkürzel

Dies ist die Schlüsselfunktion zur Effizienzsteigerung. Wenn Sie einen Textabschnitt markiert haben, **beginnen Sie einfach zu tippen** (ohne einen Button zu klicken), die Toolbar wechselt automatisch:
1. In den "Kommentar"-Modus
2. Das erste eingegebene Zeichen wird in das Eingabefeld gesetzt
3. Der Cursor wird automatisch am Ende des Eingabefelds positioniert

Quellcode-Implementierung: `packages/ui/components/AnnotationToolbar.tsx:127-147`

## Schritt für Schritt

### Schritt 1: Plan-Review starten

**Warum**
Ein tatsächlicher Plan wird benötigt, um das Hinzufügen von Anmerkungen zu üben.

**Aktion**

Lösen Sie den Plan-Review in Claude Code oder OpenCode aus:

```bash
# Claude Code Beispiel: Lassen Sie die AI einen Plan generieren, sie wird ExitPlanMode aufrufen
"Bitte generieren Sie einen Implementierungsplan für die Benutzerauthentifizierung"

# Warten Sie, bis die AI den Plan abgeschlossen hat, Plannotator öffnet sich automatisch im Browser
```

**Sie sollten sehen**:
- Der Browser öffnet die Plan-Review-Seite
- Die Seite zeigt einen Markdown-formatierten Implementierungsplan

### Schritt 2: Löschanmerkung hinzufügen

**Warum**
Löschanmerkungen werden verwendet, um Inhalt zu markieren, der nicht im endgültigen Plan erscheinen soll.

**Aktion**

1. Finden Sie im Plan den Abschnitt, den Sie nicht benötigen (z.B. eine Beschreibung einer nicht relevanten Funktion)
2. Markieren Sie den Text mit der Maus
3. Die Toolbar erscheint automatisch, klicken Sie auf die **Löschen-Schaltfläche (🗑️)**

**Sie sollten sehen**:
- Der markierte Text wird im Löschstil angezeigt (normalerweise Durchstreichung oder roter Hintergrund)
- Die Toolbar schließt sich automatisch

::: tip Eigenschaften von Löschanmerkungen
Löschanmerkungen **erfordern keine Eingabe**. Nach dem Klick auf die Löschen-Schaltfläche ist die Anmerkung sofort erstellt.
:::

### Schritt 3: Kommentar mit type-to-comment hinzufügen

**Warum**
Kommentare sind der am häufigsten verwendete Anmerkungstyp, type-to-comment ermöglicht es Ihnen, einen Button-Klick zu sparen.

**Aktion**

1. Markieren Sie Text im Plan (z.B. einen Funktionsnamen oder eine Beschreibung)
2. **Klicken Sie auf keinen Button, beginnen Sie einfach zu tippen**
3. Geben Sie Ihren Kommentar ein (z.B.: "Dieser Funktionsname ist nicht klar genug")
4. Drücken Sie `Enter` zum Speichern oder klicken Sie auf die **Save**-Schaltfläche

**Sie sollten sehen**:
- Die Toolbar wechselt automatisch in den Eingabefeld-Modus
- Das erste eingegebene Zeichen ist bereits im Eingabefeld
- Der Cursor wird automatisch am Ende des Eingabefelds positioniert
- Nach Drücken von `Enter` wird der markierte Text im Kommentarstil angezeigt (normalerweise gelber Hintergrund)

::: tip type-to-comment-Tastenkürzel
- `Enter`: Anmerkung speichern (wenn das Eingabefeld Inhalt hat)
- `Shift + Enter`: Zeilenumbruch (bei mehrzeiligen Kommentaren verwenden)
- `Escape`: Eingabe abbrechen, zurück zum Menü-Schritt
:::

### Schritt 4: Ersetzungsanmerkung hinzufügen

**Warum**
Ersetzungsanmerkungen werden verwendet, um markierten Inhalt durch neuen Inhalt zu ersetzen, die AI wird den Plan basierend auf Ihrer Anmerkung ändern.

**Aktion**

1. Markieren Sie Text im Plan (z.B. "Verwendung von JWT-Token zur Authentifizierung")
2. Verwenden Sie type-to-comment oder klicken Sie auf die Kommentar-Schaltfläche
3. Geben Sie den neuen Inhalt im Eingabefeld ein (z.B.: "Verwendung von Session-Cookies zur Authentifizierung")
4. Drücken Sie `Enter` zum Speichern

**Sie sollten sehen**:
- Der markierte Text wird im Kommentarstil angezeigt
- Ihr Kommentarinhalt wird in der Anmerkungs-Seitenleiste angezeigt

**Exportiertes Format** (`packages/ui/utils/parser.ts:292-296`):

```markdown
## 1. Ändere dies

**Von:**
```
Verwendung von JWT-Token zur Authentifizierung
```

**Zu:**
```
Verwendung von Session-Cookies zur Authentifizierung
```
```

::: info Unterschied zwischen Ersetzung und Löschung
- **Löschung**: Inhalt direkt entfernen, keine Begründung erforderlich
- **Ersetzung**: Alten Inhalt durch neuen Inhalt ersetzen, neuer Inhalt muss angegeben werden
:::

### Schritt 5: Einfügeanmerkung hinzufügen

**Warum**
Einfügeanmerkungen werden verwendet, um nach markiertem Inhalt Erklärungen oder Code-Snippets hinzuzufügen.

**Aktion**

1. Markieren Sie Text im Plan (z.B. am Ende einer Funktionssignatur)
2. Verwenden Sie type-to-comment oder klicken Sie auf die Kommentar-Schaltfläche
3. Geben Sie den einzufügenden Inhalt im Eingabefeld ein (z.B.: ", muss Authentifizierungsfehler behandeln")
4. Drücken Sie `Enter` zum Speichern

**Sie sollten sehen**:
- Der markierte Text wird im Kommentarstil angezeigt
- Ihr Kommentar wird in der Anmerkungs-Seitenleiste angezeigt

**Exportiertes Format** (`packages/ui/utils/parser.ts:287-290`):

```markdown
## 1. Füge dies hinzu

```
, muss Authentifizierungsfehler behandeln
```
```

### Schritt 6: Bilder zu Anmerkungen hinzufügen

**Warum**
Manchmal ist eine textliche Beschreibung nicht intuitiv genug, Referenzbilder oder Screenshots sind erforderlich.

**Aktion**

1. Markieren Sie beliebigen Text, gehen Sie in den Eingabe-Schritt (klicken Sie auf die Kommentar-Schaltfläche oder verwenden Sie type-to-comment)
2. Klicken Sie neben dem Toolbar-Eingabefeld auf die **Anhang-Schaltfläche (📎)**
3. Wählen Sie das hochzuladende Bild aus (unterstützt PNG, JPEG, WebP-Formate)
4. Sie können weiterhin Kommentarinhalt eingeben
5. Drücken Sie `Enter` zum Speichern

**Sie sollten sehen**:
- Eine Bildvorschau wird im Eingabefeld angezeigt
- Nach dem Speichern wird das Bild in der Anmerkungs-Seitenleiste angezeigt

::: warning Bildspeicherort
Hochgeladene Bilder werden im lokalen Verzeichnis `/tmp/plannotator` gespeichert (Quellcode-Position: `packages/server/index.ts:163`). Wenn temporäre Dateien bereinigt werden, gehen die Bilder verloren.
:::

### Schritt 7: Globalen Kommentar hinzufügen

**Warum**
Verwenden Sie globale Kommentare, wenn Sie Feedback zum gesamten Plan haben (nicht zu einem bestimmten Textabschnitt).

**Aktion**

1. Finden Sie das Eingabefeld am Seitenende (Beschriftung könnte "Add a general comment about the plan..." sein)
2. Geben Sie Ihren Kommentar ein
3. Drücken Sie `Enter` zum Speichern oder klicken Sie auf die Senden-Schaltfläche

**Sie sollten sehen**:
- Der Kommentar erscheint im globalen Kommentarbereich am Seitenende
- Der Kommentar wird als separate Karte angezeigt, nicht mit einem Textblock verknüpft

::: tip Globaler Kommentar vs. Textkommentar
- **Globaler Kommentar**: Feedback zum gesamten Plan, nicht mit konkretem Text verknüpft (z.B. "Der gesamte Plan berücksichtigt die Leistung nicht")
- **Textkommentar**: Feedback zu einem Textabschnitt, der entsprechende Text wird hervorgehoben
:::

## Kontrollpunkt ✅

Nach Abschluss der oben genannten Schritte sollten Sie:

- [ ] Mindestens eine Löschanmerkung erfolgreich hinzugefügt haben
- [ ] Einen Kommentar mit type-to-comment hinzugefügt haben
- [ ] Ersetzungs- und Einfügeanmerkungen hinzugefügt haben
- [ ] Bilder zu Anmerkungen hinzugefügt haben
- [ ] Einen globalen Kommentar hinzugefügt haben
- [ ] Alle Anmerkungen in der rechten Seitenleiste sehen

## Fallstricke

### Fallstrick 1: "Ersetzen"-Button nicht gefunden

**Falsche Operation**:
- Nach dem Markieren von Text zeigt die Toolbar nur Delete und Comment, keine Replace- oder Insert-Buttons

**Richtige Vorgehensweise**:
- Ersetzung und Einfügung werden über die **Kommentar (COMMENT)**-Schaltfläche realisiert
- Beschreiben Sie Ihre Absicht im Kommentarinhalt (Ersetzung oder Einfügung)
- Die AI wird Ihre Absicht basierend auf dem Kommentarinhalt verstehen

### Fallstrick 2: type-to-comment funktioniert nicht

**Mögliche Ursachen**:
1. Kein Text wurde markiert
2. Ein Button wurde bereits geklickt, die Toolbar ist im Eingabe-Schritt
3. Es wurde eine Sondertaste gedrückt (`Ctrl`, `Alt`, `Escape` usw.)

**Richtige Vorgehensweise**:
1. Markieren Sie zuerst Text, stellen Sie sicher, dass die Toolbar den Menü-Schritt anzeigt (mit Delete- und Comment-Buttons)
2. Geben Sie direkt normale Zeichen ein (Buchstaben, Zahlen, Satzzeichen)
3. Drücken Sie keine Funktionstasten

### Fallstrick 3: Bild nach Upload nicht gefunden

**Mögliche Ursachen**:
- Bilder werden im Verzeichnis `/tmp/plannotator` gespeichert
- Das System hat temporäre Dateien bereinigt

**Richtige Vorgehensweise**:
- Wenn Bilder langfristig gespeichert werden müssen, wird empfohlen, sie in das Projektverzeichnis zu kopieren
- Beim Exportieren von Anmerkungen ist der Bildpfad ein absoluter Pfad, stellen Sie sicher, dass andere Tools darauf zugreifen können

### Fallstrick 4: `Enter` für Zeilenumbruch speichert stattdessen die Anmerkung

**Falsche Operation**:
- Im Eingabefeld soll ein Zeilenumbruch eingefügt werden, direktes Drücken von `Enter` speichert stattdessen die Anmerkung

**Richtige Vorgehensweise**:
- Verwenden Sie `Shift + Enter` für Zeilenumbrüche
- `Enter` ist speziell für das Speichern von Anmerkungen reserviert

## Zusammenfassung dieser Lektion

**Vier Anmerkungstypen**:
- **Löschung (DELETION)**: Markiert Inhalt, der nicht im Plan erscheinen soll
- **Ersetzung (REPLACEMENT)**: Ersetzt markierten Inhalt durch neuen Inhalt (über Kommentar realisiert)
- **Einfügung (INSERTION)**: Ergänzt Inhalt nach markiertem Inhalt (über Kommentar realisiert)
- **Kommentar (COMMENT)**: Stellt Fragen oder macht Vorschläge zum markierten Inhalt
- **Globaler Kommentar (GLOBAL_COMMENT)**: Feedback zum gesamten Plan

**Wichtige Operationen**:
- Markieren → Toolbar erscheint → Operationstyp auswählen
- type-to-comment: Direkte Zeicheneingabe, automatischer Wechsel in den Kommentarmodus
- `Shift + Enter`: Zeilenumbruch; `Enter`: Speichern
- Anhang-Schaltfläche: Bilder zu Anmerkungen hochladen

**Anmerkungsexportformate**:
- Löschung: `## Remove this` + Originaltext
- Einfügung: `## Add this` + Neuer Text
- Ersetzung: `## Change this` + Von/Zu-Vergleich
- Kommentar: `## Feedback on: "..."` + Kommentarinhalt

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Bildannotationen hinzufügen](../../plan-review-images/)**.
>
> Sie werden lernen:
> - Wie man Bilder im Plan-Review anhängt
> - Verwendung von Pinsel-, Pfeil- und Kreiswerkzeugen für Annotationen
> - Annotierte Bilder als Referenzfeedback

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-24

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Anmerkungstyp-Enum-Definition | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L1-L7) | 1-7 |
| Annotation Interface | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L11-L33) | 11-33 |
| Anmerkungs-Toolbar-Komponente | [`packages/ui/components/AnnotationToolbar.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationToolbar.tsx#L29-L272) | 29-272 |
| Anmerkungsexport-Formatierung | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L246-L323) | 246-323 |
| Markdown zu Blöcken parsen | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L70-L244) | 70-244 |
| Viewer-Komponente (Textauswahl-Verarbeitung) | [`packages/ui/components/Viewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Viewer.tsx#L66-L350) | 66-350 |

**Wichtige Konstanten**:
- `AnnotationType.DELETION = 'DELETION'`: Löschanmerkungstyp
- `AnnotationType.INSERTION = 'INSERTION'`: Einfügeanmerkungstyp
- `AnnotationType.REPLACEMENT = 'REPLACEMENT'`: Ersetzungsanmerkungstyp
- `AnnotationType.COMMENT = 'COMMENT'`: Kommentaranmerkungstyp
- `AnnotationType.GLOBAL_COMMENT = 'GLOBAL_COMMENT'`: Globaler Kommentartyp

**Wichtige Funktionen**:
- `exportDiff(blocks, annotations)`: Exportiert Anmerkungen als Markdown-Format, enthält Von/Zu-Vergleich
- `parseMarkdownToBlocks(markdown)`: Parst Markdown in ein lineares Block-Array
- `createAnnotationFromSource()`: Erstellt Annotation-Objekt aus Textauswahl

</details>

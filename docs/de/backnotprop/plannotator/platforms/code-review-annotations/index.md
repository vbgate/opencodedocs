---
title: "Code-Anmerkungen: Zeilenweise Kommentare | Plannotator"
subtitle: "Code-Anmerkungen: Zeilenweise Kommentare"
sidebarTitle: "Anmerkungen in 5 Minuten"
description: "Lernen Sie die Code-Kommentarfunktion von Plannotator. Fügen Sie präzise zeilenweise Kommentare (comment/suggestion/concern) in Diffs hinzu, hängen Sie vorgeschlagenen Code an, markieren Sie Risikopunkte, verwalten Sie alle Kommentare und exportieren Sie Feedback."
tags:
  - "Code-Review"
  - "Anmerkungen"
  - "diff"
  - "comment"
  - "suggestion"
  - "concern"
  - "Claude Code"
  - "OpenCode"
prerequisite:
  - "start-getting-started"
  - "platforms-code-review-basics"
order: 5
---

# Code-Anmerkungen hinzufügen: Zeilenweise Kommentare, Vorschläge und Bedenken

## Was Sie nach diesem Tutorial können

- ✅ Zeilenweise Anmerkungen (comment/suggestion/concern) in Code-Diffs hinzufügen
- ✅ Vorgeschlagenen Code für Änderungen bereitstellen (suggestedCode)
- ✅ Code-Abschnitte markieren, die Aufmerksamkeit erfordern (concern)
- ✅ Alle Anmerkungen anzeigen und verwalten (Seitenleiste)
- ✅ Die Anwendungsszenarien der drei Anmerkungstypen verstehen
- ✅ Feedback im Markdown-Format exportieren

## Ihre aktuelle Situation

**Problem 1**: Bei der Überprüfung von Code-Änderungen können Sie das Diff nur im Terminal sehen und schreiben dann "Zeile 3 hat ein Problem", "Vorschlag zur Änderung in XXX", was nicht präzise ist.

**Problem 2**: Manchmal möchten Sie nur einen Kommentar abgeben (comment), manchmal einen Änderungsvorschlag machen (suggestion), manchmal ist es ein ernstes Problem, das Aufmerksamkeit erfordert (concern), aber es gibt kein Tool, das Ihnen hilft, diese zu unterscheiden.

**Problem 3**: Sie möchten einen Änderungsvorschlag für eine Funktion machen, wissen aber nicht, wie Sie das Code-Snippet an die AI übergeben.

**Problem 4**: Nach dem Hinzufügen mehrerer Anmerkungen vergessen Sie, welche Stellen Sie überprüft haben, es gibt keine Übersicht.

**Plannotator kann Ihnen helfen**:
- Klicken Sie auf Zeilennummern, um Code-Bereiche auszuwählen, präzise bis zur Zeile
- Drei Anmerkungstypen (comment/suggestion/concern) für verschiedene Szenarien
- Sie können vorgeschlagenen Code anhängen, die AI sieht direkt die Änderungsvorschläge
- Die Seitenleiste listet alle Anmerkungen auf, mit einem Klick zur Navigation

## Wann Sie diese Funktion verwenden

**Anwendungsszenarien**:
- Nach Ausführung des Befehls `/plannotator-review` Code-Änderungen überprüfen
- Feedback zu bestimmten Code-Zeilen geben müssen
- Code-Änderungsvorschläge für die AI bereitstellen möchten
- Potenzielle Probleme oder Risikopunkte markieren müssen

**Nicht geeignete Szenarien**:
- Überprüfung von AI-generierten Implementierungsplänen (verwenden Sie die Plan-Review-Funktion)
- Nur schnelles Durchsehen des Diffs (verwenden Sie die Code-Review-Grundfunktion)

## 🎒 Vorbereitung vor dem Start

**Voraussetzungen**:
- ✅ Plannotator CLI installiert (siehe [Schnellstart](../../start/getting-started/))
- ✅ Code-Review-Grundlagen gelernt (siehe [Code-Review-Grundlagen](../code-review-basics/))
- ✅ Lokales Git-Repository mit nicht committeten Änderungen

**Auslösemethode**:
- Führen Sie den Befehl `/plannotator-review` in OpenCode oder Claude Code aus

## Kernkonzept

### Was sind Code-Anmerkungen

**Code-Anmerkungen** sind die Kernfunktion des Code-Reviews von Plannotator, um zeilenweises Feedback in Git-Diffs hinzuzufügen. Durch Klicken auf Zeilennummern wählen Sie Code-Bereiche aus, Sie können präzise Kommentare, Vorschläge oder Bedenken zu bestimmten Code-Zeilen hinzufügen, Anmerkungen werden unter dem Diff angezeigt, damit die AI Ihre Feedback-Absicht genau versteht.

::: info Warum brauchen wir Code-Anmerkungen?
Im Code-Review müssen Sie Feedback zu bestimmten Code-Zeilen geben. Wenn Sie nur mit Text beschreiben "Zeile 5 hat ein Problem", "Vorschlag zur Änderung in XXX", muss die AI selbst den Code lokalisieren, was fehleranfällig ist. Plannotator lässt Sie auf Zeilennummern klicken, um Code-Bereiche auszuwählen, direkt an dieser Position Anmerkungen hinzufügen, Anmerkungen werden unter dem Diff angezeigt (GitHub-Stil), die AI kann genau sehen, zu welchem Code-Abschnitt Sie Vorschläge gemacht haben.
:::

### Workflow

```
┌─────────────────┐
│  /plannotator-   │  Befehl auslösen
│  review Befehl   │
└────────┬────────┘
         │
         │ git diff ausführen
         ▼
┌─────────────────┐
│  Diff Viewer    │  ← Code-Diff anzeigen
│  (split/unified) │
└────────┬────────┘
         │
         │ Zeilennummer klicken / Hover +
         ▼
┌─────────────────┐
│  Code-Bereich   │
│  auswählen      │
│  (lineStart-    │
│   lineEnd)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Anmerkung      │  ← Toolbar erscheint
│  hinzufügen     │     Kommentarinhalt eingeben
│  - Comment     │     Optional: Vorgeschlagenen Code bereitstellen
│  - Suggestion  │
│  - Concern     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Anmerkung      │  Unter dem Diff
│  anzeigen       │  Seitenleiste listet alle Anmerkungen auf
│  (GitHub-Stil)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Feedback       │  Send Feedback
│  exportieren    │  AI erhält strukturiertes Feedback
│  (Markdown)     │
└─────────────────┘
```

### Anmerkungstypen

Plannotator unterstützt drei Code-Anmerkungstypen, jeder mit unterschiedlichem Zweck:

| Anmerkungstyp | Zweck | Typisches Szenario | Vorgeschlagener Code |
| --- | --- | --- | --- |
| **Comment** | Kommentar zu einem Code-Abschnitt, allgemeines Feedback | "Diese Logik kann vereinfacht werden", "Variablenbenennung nicht klar" | Optional |
| **Suggestion** | Konkreten Code-Änderungsvorschlag bereitstellen | "Vorschlag: map statt for-Schleife verwenden", "await statt Promise.then verwenden" | Empfohlen |
| **Concern** | Potenzielle Probleme oder Risikopunkte markieren | "Diese SQL-Abfrage könnte Leistungsprobleme haben", "Fehlerbehandlung fehlt" | Optional |

::: tip Empfehlung zur Auswahl des Anmerkungstyps
- **Comment**: Für "Vorschlag, aber nicht zwingend", z.B. Code-Stil, Optimierungsrichtung
- **Suggestion**: Für "dringend empfohlene Änderung", und Sie haben einen klaren Änderungsvorschlag
- **Concern**: Für "muss beachtet werden", z.B. Bug, Leistungsrisiko, Sicherheitslücke
:::

### Comment vs Suggestion vs Concern

| Szenario | Typ wählen | Beispieltext |
| --- | --- | --- |
| Code funktioniert, hat aber Optimierungspotenzial | Comment | "Dieser Abschnitt kann mit async/await vereinfacht werden" |
| Code hat klaren Verbesserungsvorschlag | Suggestion | "Vorschlag: `Array.from()` statt Spread-Operator verwenden" (mit Code) |
| Bug oder ernstes Problem gefunden | Concern | "Hier fehlt Null-Prüfung, könnte zu Laufzeitfehler führen" |

## Schritt für Schritt

### Schritt 1: Code-Review auslösen

Führen Sie im Terminal aus:

```bash
/plannotator-review
```

**Sie sollten sehen**:
1. Browser öffnet automatisch die Code-Review-Oberfläche
2. Zeigt git diff Inhalt (Standard ist `git diff HEAD`)
3. Links ist der Dateibaum, Mitte ist der Diff-Viewer, rechts ist die Anmerkungsseitenleiste

### Schritt 2: Diff-Inhalt durchsuchen

Im Browser Code-Änderungen anzeigen:

- Standard verwendet **Split-Ansicht** (links-rechts Vergleich)
- Kann zur **Unified-Ansicht** wechseln (oben-unten Vergleich)
- Klicken Sie auf Dateinamen im Dateibaum, um die angezeigte Datei zu wechseln

### Schritt 3: Code-Zeilen auswählen, Anmerkung hinzufügen

**Methode 1: Hover-Klick auf "+" Button**

1. Bewegen Sie die Maus über die Code-Zeile, zu der Sie eine Anmerkung hinzufügen möchten
2. Rechts erscheint ein **+** Button (nur auf Diff-Zeilen angezeigt)
3. Klicken Sie auf den **+** Button
4. Anmerkungstoolbar erscheint

**Methode 2: Direkt auf Zeilennummer klicken**

1. Klicken Sie auf eine Zeilennummer (z.B. `L10`), um eine einzelne Zeile auszuwählen
2. Klicken Sie auf eine andere Zeilennummer (z.B. `L15`), um einen Mehrfachzeilenbereich auszuwählen
3. Nach Auswahl des Bereichs erscheint die Toolbar automatisch

**Sie sollten sehen**:
- Toolbar zeigt ausgewählte Zeilennummer (z.B. `Line 10` oder `Lines 10-15`)
- Toolbar enthält Texteingabefeld (`Leave feedback...`)
- Optionaler "Add suggested code" Button

### Schritt 4: Comment-Anmerkung hinzufügen

**Szenario**: Vorschlag zum Code geben, aber keine Änderung erforderlich

1. Geben Sie Kommentarinhalt in das Textfeld der Toolbar ein
2. Optional: Klicken Sie auf **Add suggested code**, geben Sie vorgeschlagenen Code ein
3. Klicken Sie auf **Add Comment** Button

**Beispiel**:

```
Kommentarinhalt: Die Parameterbenennung dieser Funktion ist nicht klar genug, Vorschlag zur Umbenennung in fetchUserData
```

**Sie sollten sehen**:
- Toolbar verschwindet
- Anmerkung wird unter dem Diff angezeigt (blauer Rahmen)
- Neue Anmerkung in der Seitenleiste hinzugefügt
- Wenn vorgeschlagener Code bereitgestellt wurde, wird er unter der Anmerkung angezeigt (Code-Block-Format)

### Schritt 5: Suggestion-Anmerkung hinzufügen

**Szenario**: Klaren Code-Änderungsvorschlag bereitstellen, hoffen, dass die AI ihn direkt übernimmt

1. Geben Sie Vorschlagsbeschreibung in das Textfeld der Toolbar ein (optional)
2. Klicken Sie auf **Add suggested code**
3. Geben Sie den vorgeschlagenen Code in das erscheinende Code-Eingabefeld ein
4. Klicken Sie auf **Add Comment** Button

**Beispiel**:

```
Vorschlagsbeschreibung: Promise-Kette mit async/await vereinfachen

Vorgeschlagener Code:
async function fetchData() {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
```

**Sie sollten sehen**:
- Anmerkung wird unter dem Diff angezeigt (blauer Rahmen)
- Vorgeschlagener Code wird als Code-Block mit "Suggested:"-Label angezeigt
- Seitenleiste zeigt erste Zeile des vorgeschlagenen Codes (mit Auslassungspunkten)

### Schritt 6: Concern-Anmerkung hinzufügen

**Szenario**: Potenzielle Probleme oder Risikopunkte markieren, AI darauf aufmerksam machen

**Hinweis**: In der aktuellen Version der Plannotator-UI ist der Anmerkungstyp standardmäßig **Comment**. Wenn Sie **Concern** markieren müssen, können Sie dies im Anmerkungstext explizit angeben.

1. Geben Sie Bedenkensbeschreibung in das Textfeld der Toolbar ein
2. Sie können `Concern:` oder `⚠️` verwenden, um explizit zu kennzeichnen, dass dies ein Bedenken ist
3. Klicken Sie auf **Add Comment** Button

**Beispiel**:

```
Concern: Hier fehlt Null-Prüfung, wenn user null ist, führt dies zu Laufzeitfehler

Vorschlag hinzufügen:
if (!user) return null;
```

**Sie sollten sehen**:
- Anmerkung wird unter dem Diff angezeigt
- Seitenleiste zeigt Anmerkungsinhalt

### Schritt 7: Anmerkungen anzeigen und verwalten

**Alle Anmerkungen in der Seitenleiste anzeigen**:

1. Rechte Seitenleiste zeigt alle Anmerkungsliste
2. Jede Anmerkung zeigt:
   - Dateiname (letzter Pfadkomponent abgeschnitten)
   - Zeilennummernbereich (z.B. `L10` oder `L10-L15`)
   - Autor (bei kollaborativem Review)
   - Zeitstempel (z.B. `5m`, `2h`, `1d`)
   - Anmerkungsinhalt (maximal 2 Zeilen angezeigt)
   - Vorgeschlagener Code-Vorschau (erste Zeile)

**Auf Anmerkung klicken, um zu navigieren**:

1. Klicken Sie auf eine Anmerkung in der Seitenleiste
2. Diff-Viewer scrollt automatisch zur entsprechenden Position
3. Diese Anmerkung wird hervorgehoben

**Anmerkung löschen**:

1. Bewegen Sie die Maus über eine Anmerkung in der Seitenleiste
2. Klicken Sie auf den **×** Button oben rechts
3. Anmerkung wird gelöscht, Hervorhebung im Diff verschwindet

**Sie sollten sehen**:
- Seitenleiste zeigt Anmerkungsanzahl (z.B. `Annotations: 3`)
- Nach Klick auf Anmerkung scrollt Diff-Viewer sanft zur entsprechenden Zeile
- Nach Löschen der Anmerkung wird die Anzahl aktualisiert

### Schritt 8: Feedback exportieren

Nach Abschluss aller Anmerkungen klicken Sie auf den **Send Feedback** Button am Seitenende.

**Sie sollten sehen**:
- Browser schließt automatisch
- Terminal zeigt Feedback-Inhalt im Markdown-Format
- AI erhält strukturiertes Feedback, kann automatisch reagieren

**Exportiertes Markdown-Format**:

```markdown
# Code Review Feedback

## src/app/api/users.ts

### Line 10 (new)
Diese Logik kann vereinfacht werden, Vorschlag: async/await verwenden

### Lines 15-20 (new)
**Suggested code:**
```typescript
async function fetchUserData() {
  const response = await fetch(url);
  return await response.json();
}
```

### Line 25 (old)
Concern: Hier fehlt Null-Prüfung, wenn user null ist, führt dies zu Laufzeitfehler
```

::: tip Feedback kopieren
Wenn Sie Feedback-Inhalt manuell kopieren müssen, können Sie auf den **Copy Feedback** Button am Ende der Seitenleiste klicken, um das Feedback im Markdown-Format in die Zwischenablage zu kopieren.
:::

## Kontrollpunkt ✅

Nach Abschluss der oben genannten Schritte sollten Sie:

- [ ] Im Code-Diff auf Zeilennummer klicken oder Hover "+" Button verwenden, um Code-Zeilen auszuwählen
- [ ] Comment-Anmerkung hinzufügen (allgemeiner Kommentar)
- [ ] Suggestion-Anmerkung hinzufügen (mit vorgeschlagenem Code)
- [ ] Concern-Anmerkung hinzufügen (potenzielle Probleme markieren)
- [ ] Alle Anmerkungen in der Seitenleiste anzeigen, auf Klick zur entsprechenden Position navigieren
- [ ] Nicht benötigte Anmerkungen löschen
- [ ] Feedback im Markdown-Format exportieren
- [ ] Feedback-Inhalt in die Zwischenablage kopieren

**Wenn ein Schritt fehlschlägt**, siehe:
- [Häufige Probleme](../../faq/common-problems/)
- [Code-Review-Grundlagen](../code-review-basics/)
- [Fehlerbehebung](../../faq/troubleshooting/)

## Fallstricke

**Häufiger Fehler 1**: Nach Klick auf Zeilennummer erscheint die Toolbar nicht

**Ursache**: Möglicherweise wurde auf Dateiname geklickt oder Zeilennummer ist nicht im Diff-Bereich.

**Lösung**:
- Stellen Sie sicher, dass Sie auf die Zeilennummer der Diff-Zeile klicken (grüne oder rote Zeile)
- Für gelöschte Zeilen (rot) klicken Sie auf die linke Zeilennummer
- Für hinzugefügte Zeilen (grün) klicken Sie auf die rechte Zeilennummer

**Häufiger Fehler 2**: Nach Auswahl mehrerer Zeilen wird Anmerkung an falscher Position angezeigt

**Ursache**: side (old/new) ist nicht korrekt.

**Lösung**:
- Überprüfen Sie, ob Sie alten Code (deletions) oder neuen Code (additions) ausgewählt haben
- Anmerkung wird unter der letzten Zeile des Bereichs angezeigt
- Wenn Position nicht stimmt, löschen Sie Anmerkung und fügen Sie sie erneut hinzu

**Häufiger Fehler 3**: Nach Hinzufügen von vorgeschlagenem Code ist Code-Format durcheinander

**Ursache**: Vorgeschlagener Code enthält möglicherweise Sonderzeichen oder Einrückungsprobleme.

**Lösung**:
- Stellen Sie im vorgeschlagenen Code-Eingabefeld sicher, dass die Einrückung korrekt ist
- Verwenden Sie Monospace-Schriftart zum Bearbeiten des vorgeschlagenen Codes
- Bei Zeilenumbrüchen verwenden Sie `Shift + Enter` statt direktem Enter

**Häufiger Fehler 4**: Neu hinzugefügte Anmerkung in Seitenleiste nicht sichtbar

**Ursache**: Seitenleiste wurde möglicherweise nicht aktualisiert, oder Anmerkung wurde zu anderer Datei hinzugefügt.

**Lösung**:
- Wechseln Sie die Datei und wechseln Sie zurück
- Überprüfen Sie, ob Anmerkung zur aktuell angezeigten Datei hinzugefügt wurde
- Aktualisieren Sie die Browser-Seite (kann nicht committete Anmerkungen verlieren)

**Häufiger Fehler 5**: Nach Export des Feedbacks ändert die AI nicht gemäß Vorschlag

**Ursache**: AI hat möglicherweise die Absicht der Anmerkung nicht richtig verstanden, oder Vorschlag ist nicht umsetzbar.

**Lösung**:
- Verwenden Sie klarere Anmerkungen (Suggestion ist klarer als Comment)
- Fügen Sie Kommentare im vorgeschlagenen Code hinzu, um den Grund zu erklären
- Wenn Problem weiterhin besteht, können Sie Feedback erneut senden, Anmerkungsinhalt anpassen

## Zusammenfassung dieser Lektion

Code-Anmerkungen sind die Kernfunktion des Code-Reviews von Plannotator, ermöglichen präzises Feedback zu Code-Problemen:

**Kernoperationen**:
1. **Auslösen**: Führen Sie `/plannotator-review` aus, Browser öffnet automatisch Diff-Viewer
2. **Durchsuchen**: Code-Änderungen anzeigen (split/unified Ansicht wechseln)
3. **Auswählen**: Auf Zeilennummer klicken oder Hover "+" Button verwenden, um Code-Bereich auszuwählen
4. **Anmerken**: Comment/Suggestion/Concern-Anmerkung hinzufügen
5. **Verwalten**: In Seitenleiste anzeigen, navigieren, Anmerkungen löschen
6. **Exportieren**: Send Feedback, AI erhält strukturiertes Feedback

**Anmerkungstypen**:
- **Comment**: Allgemeiner Kommentar, Vorschlag geben, aber nicht zwingend
- **Suggestion**: Klare Änderungsempfehlung, mit vorgeschlagenem Code
- **Concern**: Potenzielle Probleme oder Risikopunkte markieren

**Best Practices**:
- Bei Verwendung von Suggestion möglichst vollständigen, ausführbaren Code bereitstellen
- Für Leistungs- oder Sicherheitsprobleme Concern verwenden
- Anmerkungsinhalt sollte spezifisch sein, vage Beschreibungen vermeiden (wie "das ist nicht gut")
- Sie können Bilder anhängen, um zu erklären (verwenden Sie Bildanmerkungsfunktion)

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Diff-Ansicht wechseln](../code-review-diff-types/)**.
>
> Sie werden lernen:
> - Wie man zwischen verschiedenen Diff-Typen wechselt (uncommitted/staged/last commit/branch)
> - Anwendungsszenarien verschiedener Diff-Typen
> - Wie man schnell zwischen mehreren Diff-Typen wechselt

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisierungsdatum: 2026-01-24

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| CodeAnnotation Typ-Definition | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L53-L56) | 53-56 |
| CodeAnnotation Interface | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L55-L66) | 55-66 |
| DiffViewer Komponente | [`packages/review-editor/components/DiffViewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/DiffViewer.tsx#L1-L349) | 1-349 |
| ReviewPanel Komponente | [`packages/review-editor/components/ReviewPanel.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/ReviewPanel.tsx#L1-L211) | 1-211 |
| Feedback Markdown exportieren | [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx#L86-L126) | 86-126 |
| Hover "+" Button | [`packages/review-editor/components/DiffViewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/DiffViewer.tsx#L180-L199) | 180-199 |
| Anmerkungstoolbar | [`packages/review-editor/components/DiffViewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/DiffViewer.tsx#L267-L344) | 267-344 |
| Anmerkungsrendering | [`packages/review-editor/components/DiffViewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/DiffViewer.tsx#L140-L177) | 140-177 |

**Wichtige Typen**:
- `CodeAnnotationType`: Code-Anmerkungstyp ('comment' | 'suggestion' | 'concern') (`packages/ui/types.ts:53`)
- `CodeAnnotation`: Code-Anmerkung Interface (`packages/ui/types.ts:55-66`)
- `SelectedLineRange`: Ausgewählter Code-Bereich (`packages/ui/types.ts:77-82`)

**Wichtige Funktionen**:
- `exportReviewFeedback()`: Konvertiert Anmerkungen in Markdown-Format (`packages/review-editor/App.tsx:86`)
- `renderAnnotation()`: Rendert Anmerkung im Diff (`packages/review-editor/components/DiffViewer.tsx:140`)
- `renderHoverUtility()`: Rendert Hover "+" Button (`packages/review-editor/components/DiffViewer.tsx:180`)

**API-Routen**:
- `POST /api/feedback`: Review-Feedback einreichen (`packages/server/review.ts`)
- `GET /api/diff`: Git diff abrufen (`packages/server/review.ts:111`)
- `POST /api/diff/switch`: Diff-Typ wechseln (`packages/server/review.ts`)

**Geschäftsregeln**:
- Standard zeigt nicht committetes Diff (`git diff HEAD`) (`packages/server/review.ts:111`)
- Anmerkung wird unter der letzten Zeile des Bereichs angezeigt (GitHub-Stil) (`packages/review-editor/components/DiffViewer.tsx:81`)
- Unterstützt Anhängen von vorgeschlagenem Code in Anmerkung (`suggestedCode` Feld) (`packages/ui/types.ts:63`)

</details>

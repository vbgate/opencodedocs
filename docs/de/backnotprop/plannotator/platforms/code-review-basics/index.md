---
title: "Code-Review: Visuelle Git-Diff-Prüfung | plannotator"
sidebarTitle: "Agent-Codeänderungen prüfen"
subtitle: "Code-Review: Visuelle Git-Diff-Prüfung"
description: "Lernen Sie die Code-Review-Funktion von Plannotator. Nutzen Sie die visuelle Oberfläche zur Git-Diff-Prüfung, wechseln Sie zwischen Side-by-Side- und Unified-Ansicht, fügen Sie zeilenbasierte Kommentare hinzu und senden Sie Feedback an den KI-Agent."
tags:
  - "Code-Review"
  - "Git Diff"
  - "Zeilenkommentare"
  - "Side-by-side"
  - "Unified"
  - "Claude Code"
  - "OpenCode"
prerequisite:
  - "start-getting-started"
order: 4
---

# Code-Review-Grundlagen: Git-Diff mit /plannotator-review prüfen

## Was Sie nach dieser Lektion können

- ✅ Den Befehl `/plannotator-review` zur Git-Diff-Prüfung verwenden
- ✅ Zwischen Side-by-Side- und Unified-Ansicht wechseln
- ✅ Zeilennummern anklicken, um Codebereiche auszuwählen und zeilenbasierte Kommentare hinzuzufügen
- ✅ Verschiedene Kommentartypen hinzufügen (Comment/Suggestion/Concern)
- ✅ Zwischen verschiedenen Diff-Typen wechseln (uncommitted/staged/last commit/branch)
- ✅ Review-Feedback an den KI-Agent senden

## Ihr aktuelles Problem

**Problem 1**: Beim Anzeigen von Codeänderungen mit `git diff` scrollt die Ausgabe im Terminal, was es schwierig macht, die Änderungen vollständig zu erfassen.

**Problem 2**: Wenn Sie dem Agent Feedback zu Codeproblemen geben möchten, können Sie nur textbasiert beschreiben wie „Zeile 10 hat ein Problem" oder „Diese Funktion ändern", was zu Missverständnissen führen kann.

**Problem 3**: Sie wissen nicht genau, welche Dateien der Agent geändert hat, und es ist schwierig, sich bei vielen Änderungen auf die wichtigen Teile zu konzentrieren.

**Problem 4**: Nach dem Code-Review möchten Sie strukturiertes Feedback an den Agent senden, damit er den Code basierend auf Ihren Vorschlägen überarbeitet.

**Plannotator hilft Ihnen dabei**:
- Git-Diff visuell darstellen, mit Unterstützung für Side-by-Side- und Unified-Ansicht
- Durch Klicken auf Zeilennummern Codebereiche auswählen und Problemstellen präzise markieren
- Zeilenbasierte Kommentare hinzufügen (Comment/Suggestion/Concern) mit Codevorschlägen
- Mit einem Klick zwischen Diff-Typen wechseln (uncommitted, staged, last commit, branch)
- Kommentare werden automatisch in Markdown konvertiert, damit der Agent Ihr Feedback präzise versteht

## Wann diese Methode verwenden

**Anwendungsfälle**:
- Nachdem der Agent Codeänderungen abgeschlossen hat und Sie die Änderungen prüfen müssen
- Vor dem Commit, wenn Sie Ihre eigenen Änderungen umfassend überprüfen möchten
- Bei der Teamarbeit, wenn Sie strukturiertes Feedback zu Codeproblemen geben müssen
- Wenn Sie zwischen verschiedenen Diff-Typen wechseln möchten (uncommitted vs. staged vs. letzter Commit)

**Nicht geeignet für**:
- Prüfung von KI-generierten Implementierungsplänen (verwenden Sie die Plan-Review-Funktion)
- Direkte Verwendung von `git diff` im Terminal (wenn keine visuelle Oberfläche benötigt wird)

## 🎒 Vorbereitungen

**Voraussetzungen**:
- ✅ Plannotator CLI installiert (siehe [Schnellstart](../../start/getting-started/))
- ✅ Claude Code oder OpenCode Plugin konfiguriert (siehe entsprechende Installationsanleitung)
- ✅ Aktuelles Verzeichnis befindet sich in einem Git-Repository

**Auslösung**:
- Führen Sie den Befehl `/plannotator-review` in Claude Code oder OpenCode aus

## Kernkonzept

### Was ist Code-Review?

**Code-Review** ist das visuelle Git-Diff-Prüfungstool von Plannotator, mit dem Sie Codeänderungen im Browser anzeigen und zeilenbasierte Kommentare hinzufügen können.

::: info Warum Code-Review?
Nachdem der KI-Agent Codeänderungen abgeschlossen hat, gibt er normalerweise den Git-Diff-Inhalt im Terminal aus. Diese reine Textdarstellung macht es schwierig, die Änderungen vollständig zu erfassen, und es ist unpraktisch, Problemstellen präzise zu markieren. Plannotator bietet eine visuelle Oberfläche (Side-by-Side oder Unified), unterstützt das Hinzufügen von Kommentaren durch Klicken auf Zeilennummern und sendet strukturiertes Feedback an den Agent, damit er den Code basierend auf Ihren Vorschlägen überarbeitet.
:::

### Arbeitsablauf

```
┌─────────────────┐
│  Benutzer       │
│  (Befehl        │
│   ausführen)    │
└────────┬────────┘
         │
         │ /plannotator-review
         ▼
┌─────────────────┐
│  CLI            │
│  (git ausführen)│
│  git diff HEAD  │
└────────┬────────┘
         │
         │ rawPatch + gitRef
         ▼
┌─────────────────┐
│ Review Server   │  ← Lokaler Server startet
│  /api/diff      │
└────────┬────────┘
         │
         │ Browser öffnet UI
         ▼
┌─────────────────┐
│ Review UI       │
│                 │
│ ┌───────────┐   │
│ │ File Tree │   │
│ │ (Datei-   │   │
│ │  liste)   │   │
│ └───────────┘   │
│       │         │
│       ▼         │
│ ┌───────────┐   │
│ │ DiffViewer│   │
│ │ (Code-    │   │
│ │ vergleich)│   │
│ │ split/    │   │
│ │ unified   │   │
│ └───────────┘   │
│       │         │
│       │ Zeilennummer
│       │ anklicken
│       ▼         │
│ ┌───────────┐   │
│ │ Kommentar │   │
│ │ hinzufügen│   │
│ │ comment/  │   │
│ │ suggestion│   │
│ │ /concern  │   │
│ └───────────┘   │
│       │         │
│       ▼         │
│ ┌───────────┐   │
│ │ Feedback  │   │
│ │ senden    │   │
│ │ Send      │   │
│ │ Feedback  │   │
│ │ oder LGTM │   │
│ └───────────┘   │
└────────┬────────┘
         │
         │ Markdown-formatiertes Feedback
         ▼
┌─────────────────┐
│  KI-Agent       │
│  (ändert Code   │
│   nach Vorschlag│
└─────────────────┘
```

### Ansichtsmodi

| Ansichtsmodus | Beschreibung | Anwendungsfall |
| --- | --- | --- |
| **Split (Side-by-side)** | Links-rechts-Aufteilung, alter Code links, neuer Code rechts | Vergleich großer Änderungen, klare Vorher-Nachher-Ansicht |
| **Unified** | Oben-unten zusammengeführt, Löschungen und Hinzufügungen in einer Spalte | Kleine Änderungen anzeigen, vertikalen Platz sparen |

### Kommentartypen

Plannotator unterstützt drei Arten von Code-Kommentaren:

| Kommentartyp | Verwendung | UI-Darstellung |
| --- | --- | --- |
| **Comment** | Codezeile kommentieren, Fragen stellen oder erklären | Lila/blauer Rahmen |
| **Suggestion** | Konkreten Codeänderungsvorschlag machen | Grüner Rahmen mit Codeblock |
| **Concern** | Potenzielle Probleme markieren, die Aufmerksamkeit erfordern | Gelber/oranger Rahmen |

::: tip Unterschied zwischen Kommentartypen
- **Comment**: Für Fragen, Erklärungen, allgemeines Feedback
- **Suggestion**: Für konkrete Codeänderungsvorschläge (mit Beispielcode)
- **Concern**: Für Probleme oder potenzielle Risiken, die behoben werden müssen
:::

### Diff-Typen

| Diff-Typ | Git-Befehl | Beschreibung |
| --- | --- | --- |
| **Uncommitted** | `git diff HEAD` | Nicht committete Änderungen (Standard) |
| **Staged** | `git diff --staged` | Gestagete Änderungen |
| **Unstaged** | `git diff` | Nicht gestagete Änderungen |
| **Last commit** | `git diff HEAD~1..HEAD` | Inhalt des letzten Commits |
| **Branch** | `git diff main..HEAD` | Vergleich des aktuellen Branches mit dem Standardbranch |

## Lernen Sie durch Handlung

### Schritt 1: Code-Review starten

Führen Sie den Befehl `/plannotator-review` in Claude Code oder OpenCode aus:

```
Benutzer: /plannotator-review

CLI: Git diff wird ausgeführt...
     Browser wurde geöffnet
```

**Sie sollten sehen**:
1. Browser öffnet automatisch die Plannotator Code-Review-Oberfläche
2. Links wird die Dateiliste angezeigt (File Tree)
3. Rechts wird der Diff Viewer angezeigt (standardmäßig Split-Ansicht)
4. Oben befinden sich Schaltflächen zum Wechseln der Ansicht (Split/Unified)
5. Unten befinden sich die Schaltflächen „Send Feedback" und „LGTM"

### Schritt 2: Dateiliste durchsuchen

Sehen Sie sich die geänderten Dateien im File Tree auf der linken Seite an:

- Dateien werden nach Pfad gruppiert angezeigt
- Jede Datei zeigt Änderungsstatistiken (additions/deletions)
- Klicken Sie auf eine Datei, um zum entsprechenden Diff-Inhalt zu wechseln

**Sie sollten sehen**:
```
src/
  auth/
    login.ts          (+12, -5)  ← Klicken, um Diff dieser Datei anzuzeigen
    user.ts          (+8, -2)
  api/
    routes.ts        (+25, -10)
```

### Schritt 3: Ansichtsmodus wechseln

Klicken Sie oben auf der Seite auf „Split" oder „Unified", um die Ansicht zu wechseln:

**Split-Ansicht** (Side-by-side):
- Alter Code links (grauer Hintergrund, rote Durchstreichung)
- Neuer Code rechts (weißer Hintergrund, grüne Hinzufügungslinien)
- Geeignet für den Vergleich großer Änderungen

**Unified-Ansicht** (zusammengeführt):
- Alter und neuer Code in einer Spalte
- Gelöschte Zeilen mit rotem Hintergrund, hinzugefügte Zeilen mit grünem Hintergrund
- Geeignet für kleine Änderungen

**Sie sollten sehen**:
- Split-Ansicht: Links-rechts-Aufteilung, klarer Vorher-Nachher-Vergleich
- Unified-Ansicht: Oben-unten zusammengeführt, spart vertikalen Platz

### Schritt 4: Codezeilen auswählen und Kommentare hinzufügen

**Comment-Kommentar hinzufügen**:

1. Bewegen Sie die Maus über eine Codezeile, neben der Zeilennummer erscheint ein `+`-Button
2. Klicken Sie auf den `+`-Button oder direkt auf die Zeilennummer, um die Zeile auszuwählen
3. Mehrere Zeilen auswählen: Klicken Sie auf die Startzeilennummer, halten Sie Shift gedrückt und klicken Sie auf die Endzeilennummer
4. Geben Sie Ihren Kommentar in der erscheinenden Werkzeugleiste ein
5. Klicken Sie auf „Add Comment"

**Suggestion-Kommentar hinzufügen (mit Codevorschlag)**:

1. Folgen Sie den obigen Schritten zum Hinzufügen eines Kommentars
2. Klicken Sie in der Werkzeugleiste auf „Add suggested code"
3. Geben Sie den vorgeschlagenen Code in das erscheinende Codefeld ein
4. Klicken Sie auf „Add Comment"

**Sie sollten sehen**:
- Kommentar wird unter der Codezeile angezeigt
- Comment-Kommentar: Lila/blauer Rahmen, zeigt Kommentarinhalt
- Suggestion-Kommentar: Grüner Rahmen, zeigt Kommentarinhalt und Codeblock mit Vorschlag
- In der rechten Seitenleiste wird eine Liste aller Kommentare angezeigt

### Schritt 5: Diff-Typ wechseln

Wählen Sie oben auf der Seite verschiedene Diff-Typen aus:

- **Uncommitted changes** (Standard): Nicht committete Änderungen
- **Staged changes**: Gestagete Änderungen
- **Last commit**: Inhalt des letzten Commits
- **vs main** (wenn nicht auf dem Standardbranch): Vergleich mit dem Standardbranch

**Sie sollten sehen**:
- Diff Viewer aktualisiert sich mit dem neuen Diff-Inhalt
- Dateiliste wird mit neuen Änderungsstatistiken aktualisiert

### Schritt 6: Feedback an den Agent senden

**Send Feedback (Feedback senden)**:

1. Fügen Sie die notwendigen Kommentare hinzu (Comment/Suggestion/Concern)
2. Klicken Sie unten auf der Seite auf „Send Feedback"
3. Wenn keine Kommentare vorhanden sind, erscheint ein Bestätigungsdialog

**LGTM (Looks Good To Me)**:

Wenn der Code keine Probleme hat, klicken Sie auf „LGTM".

**Sie sollten sehen**:
- Browser schließt sich automatisch (1,5 Sekunden Verzögerung)
- Terminal zeigt Feedback-Inhalt oder „LGTM - no changes requested."
- Agent beginnt nach Erhalt des Feedbacks mit der Codeänderung

### Schritt 7: Feedback-Inhalt anzeigen (optional)

Wenn Sie den Feedback-Inhalt sehen möchten, den Plannotator an den Agent gesendet hat, können Sie ihn im Terminal anzeigen:

```
# Code Review Feedback

## src/auth/login.ts

### Line 15 (new)
Hier muss Fehlerbehandlungslogik hinzugefügt werden.

### Line 20-25 (old)
**Suggested code:**
```typescript
try {
  await authenticate(req);
} catch (error) {
  return res.status(401).json({ error: 'Authentication failed' });
}
```

## src/api/routes.ts

### Line 10 (new)
Diese Funktion hat keine Eingabevalidierung.
```

**Sie sollten sehen**:
- Feedback ist nach Dateien gruppiert
- Jeder Kommentar zeigt Dateipfad, Zeilennummer und Typ
- Suggestion-Kommentare enthalten einen Codeblock mit Vorschlag

## Kontrollpunkt ✅

Nach Abschluss der obigen Schritte sollten Sie in der Lage sein:

- [ ] Den Befehl `/plannotator-review` auszuführen, Browser öffnet automatisch die Code-Review-Oberfläche
- [ ] Im File Tree die Liste der geänderten Dateien anzuzeigen
- [ ] Zwischen Split- und Unified-Ansicht zu wechseln
- [ ] Zeilennummern oder den `+`-Button anzuklicken, um Codezeilen auszuwählen
- [ ] Comment-, Suggestion- und Concern-Kommentare hinzuzufügen
- [ ] Codevorschläge in Kommentaren hinzuzufügen
- [ ] Zwischen verschiedenen Diff-Typen zu wechseln (uncommitted/staged/last commit/branch)
- [ ] Auf Send Feedback zu klicken, Browser schließt sich, Terminal zeigt Feedback-Inhalt
- [ ] Auf LGTM zu klicken, Browser schließt sich, Terminal zeigt „LGTM - no changes requested."

**Bei Problemen** siehe:
- [Häufige Probleme](../../faq/common-problems/)
- [Claude Code Installationsanleitung](../../start/installation-claude-code/)
- [OpenCode Installationsanleitung](../../start/installation-opencode/)

## Häufige Fehler

**Häufiger Fehler 1**: Nach Ausführung von `/plannotator-review` öffnet sich der Browser nicht

**Ursache**: Möglicherweise ist der Port belegt oder der Server konnte nicht gestartet werden.

**Lösung**:
- Prüfen Sie, ob im Terminal Fehlermeldungen angezeigt werden
- Versuchen Sie, die angezeigte URL manuell im Browser zu öffnen
- Bei anhaltenden Problemen siehe [Fehlerbehebung](../../faq/troubleshooting/)

**Häufiger Fehler 2**: Nach Klicken auf Zeilennummer erscheint keine Werkzeugleiste

**Ursache**: Möglicherweise wurde eine leere Zeile ausgewählt oder das Browserfenster ist zu klein.

**Lösung**:
- Versuchen Sie, eine Zeile mit Code auszuwählen
- Vergrößern Sie das Browserfenster
- Stellen Sie sicher, dass JavaScript nicht deaktiviert ist

**Häufiger Fehler 3**: Nach Hinzufügen eines Kommentars wird dieser nicht unter dem Code angezeigt

**Ursache**: Möglicherweise wurde eine leere Zeile ausgewählt oder das Browserfenster ist zu klein.

**Lösung**:
- Versuchen Sie, eine Zeile mit Code auszuwählen
- Vergrößern Sie das Browserfenster
- Stellen Sie sicher, dass JavaScript nicht deaktiviert ist
- Prüfen Sie, ob die Kommentarliste in der rechten Seitenleiste angezeigt wird

**Häufiger Fehler 4**: Nach Klicken auf Send Feedback zeigt das Terminal keinen Feedback-Inhalt

**Ursache**: Möglicherweise ein Netzwerkproblem oder Serverfehler.

**Lösung**:
- Prüfen Sie, ob im Terminal Fehlermeldungen angezeigt werden
- Versuchen Sie, das Feedback erneut zu senden
- Bei anhaltenden Problemen siehe [Fehlerbehebung](../../faq/troubleshooting/)

**Häufiger Fehler 5**: Agent ändert den Code nach Erhalt des Feedbacks nicht wie vorgeschlagen

**Ursache**: Der Agent hat möglicherweise die Absicht des Kommentars nicht richtig verstanden.

**Lösung**:
- Versuchen Sie, präzisere Kommentare zu verwenden (Suggestion ist klarer als Comment)
- Verwenden Sie Comment für detaillierte Erklärungen
- Geben Sie in Suggestion vollständigen Beispielcode an
- Bei anhaltenden Problemen können Sie `/plannotator-review` erneut ausführen, um die neuen Änderungen zu prüfen

**Häufiger Fehler 6**: Nach Wechsel des Diff-Typs ist die Dateiliste leer

**Ursache**: Der ausgewählte Diff-Typ hat möglicherweise keine Änderungen.

**Lösung**:
- Versuchen Sie, zu „Uncommitted changes" zurückzuwechseln
- Prüfen Sie den Git-Status, um zu bestätigen, ob Änderungen vorhanden sind
- Verwenden Sie `git status`, um den aktuellen Status anzuzeigen

## Zusammenfassung

Code-Review ist das visuelle Git-Diff-Prüfungstool von Plannotator:

**Kernoperationen**:
1. **Starten**: `/plannotator-review` ausführen, Browser öffnet automatisch die UI
2. **Durchsuchen**: Im File Tree die Liste der geänderten Dateien anzeigen
3. **Ansicht**: Zwischen Split (Side-by-side) und Unified wechseln
4. **Kommentieren**: Zeilennummern anklicken, um Codezeilen auszuwählen, Comment/Suggestion/Concern hinzufügen
5. **Wechseln**: Verschiedene Diff-Typen auswählen (uncommitted/staged/last commit/branch)
6. **Feedback**: Send Feedback oder LGTM klicken, Feedback wird an den Agent gesendet

**Ansichtsmodi**:
- **Split (Side-by-side)**: Links-rechts-Aufteilung, alter Code links, neuer Code rechts
- **Unified**: Oben-unten zusammengeführt, Löschungen und Hinzufügungen in einer Spalte

**Kommentartypen**:
- **Comment**: Codezeile kommentieren, Fragen stellen oder erklären
- **Suggestion**: Konkreten Codeänderungsvorschlag machen (mit Beispielcode)
- **Concern**: Potenzielle Probleme markieren, die Aufmerksamkeit erfordern

**Diff-Typen**:
- **Uncommitted**: Nicht committete Änderungen (Standard)
- **Staged**: Gestagete Änderungen
- **Unstaged**: Nicht gestagete Änderungen
- **Last commit**: Inhalt des letzten Commits
- **Branch**: Vergleich des aktuellen Branches mit dem Standardbranch

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Code-Kommentare hinzufügen](../code-review-annotations/)**.
>
> Sie lernen:
> - Wie Sie Comment-, Suggestion- und Concern-Kommentare präzise verwenden
> - Wie Sie Codevorschläge hinzufügen und formatiert anzeigen
> - Wie Sie Kommentare bearbeiten und löschen
> - Best Practices und häufige Anwendungsfälle für Kommentare
> - Wie Sie in der Side-by-Side-Ansicht die alte/neue Seite auswählen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcodeposition anzuzeigen</strong></summary>

> Aktualisierungsdatum: 2026-01-24

| Funktion | Dateipfad | Zeile |
| --- | --- | --- |
| Code-Review-Server | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L1-L302) | 1-302 |
| Code-Review-UI | [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx#L1-L150) | 1-150 |
| DiffViewer-Komponente | [`packages/review-editor/components/DiffViewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/DiffViewer.tsx#L1-L349) | 1-349 |
| Git-Tools | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L1-L148) | 1-148 |
| Hook-Einstiegspunkt (review) | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L46-L84) | 46-84 |
| Code-Kommentar-Typdefinition | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L53-L83) | 53-83 |

**Wichtige Typen**:
- `CodeAnnotationType`: Enum für Code-Kommentartypen (comment, suggestion, concern) (`packages/ui/types.ts:53`)
- `CodeAnnotation`: Interface für Code-Kommentare (`packages/ui/types.ts:55-66`)
- `DiffType`: Enum für Diff-Typen (uncommitted, staged, unstaged, last-commit, branch) (`packages/server/git.ts:10-15`)
- `GitContext`: Interface für Git-Kontext (`packages/server/git.ts:22-26`)

**Wichtige Funktionen**:
- `startReviewServer()`: Startet den Code-Review-Server (`packages/server/review.ts:79`)
- `runGitDiff()`: Führt den git diff-Befehl aus (`packages/server/git.ts:101`)
- `getGitContext()`: Ruft Git-Kontext ab (Branch-Informationen und Diff-Optionen) (`packages/server/git.ts:79`)
- `parseDiffToFiles()`: Parst Diff in Dateiliste (`packages/review-editor/App.tsx:48`)
- `exportReviewFeedback()`: Exportiert Kommentare als Markdown-Feedback (`packages/review-editor/App.tsx:86`)

**API-Routen**:
- `GET /api/diff`: Ruft Diff-Inhalt ab (`packages/server/review.ts:118`)
- `POST /api/diff/switch`: Wechselt Diff-Typ (`packages/server/review.ts:130`)
- `POST /api/feedback`: Sendet Review-Feedback (`packages/server/review.ts:222`)
- `GET /api/image`: Ruft Bild ab (`packages/server/review.ts:164`)
- `POST /api/upload`: Lädt Bild hoch (`packages/server/review.ts:181`)
- `GET /api/agents`: Ruft verfügbare Agents ab (OpenCode) (`packages/server/review.ts:204`)

**Geschäftsregeln**:
- Standardmäßig werden nicht committete Diffs angezeigt (`apps/hook/server/index.ts:55`)
- Unterstützt Wechsel zu vs main Diff (`packages/server/git.ts:131`)
- Feedback wird als Markdown formatiert (`packages/review-editor/App.tsx:86`)
- Bei Genehmigung wird „LGTM"-Text gesendet (`packages/review-editor/App.tsx:430`)

</details>

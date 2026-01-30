---
title: "Diff-Ansichten: Änderungen aus verschiedenen Perspektiven prüfen | Plannotator"
sidebarTitle: "5 Diff-Ansichten wechseln"
subtitle: "Diff-Ansichten: Änderungen aus verschiedenen Perspektiven prüfen"
description: "Lernen Sie, wie Sie in Plannotator Code-Reviews zwischen verschiedenen Diff-Typen wechseln. Wählen Sie im Dropdown-Menü zwischen uncommitted, staged, last commit oder branch-Ansicht, um Codeänderungen aus verschiedenen Perspektiven zu prüfen."
tags:
  - "code-review"
  - "git"
  - "diff"
  - "tutorial"
prerequisite:
  - "code-review-basics"
order: 6
---

# Diff-Ansichten wechseln

## Was Sie nach dieser Lektion können

Beim Code-Review können Sie:
- Über das Dropdown-Menü schnell zwischen 5 Diff-Ansichten wechseln
- Verstehen, welchen Änderungsbereich jede Ansicht anzeigt
- Je nach Prüfungsbedarf den passenden Diff-Typ auswählen
- Vermeiden, dass wichtige Änderungen durch falsche Ansichtswahl übersehen werden

## Ihr aktuelles Problem

**Beim Review nur das Arbeitsverzeichnis geprüft und bereits gestagete Dateien übersehen**:

Sie führen den Befehl `/plannotator-review` aus und sehen einige Codeänderungen, fügen ein paar Kommentare hinzu. Nach dem Commit stellen Sie fest, dass im Review die Dateien fehlen, die bereits mit `git add` in den Staging-Bereich verschoben wurden – diese Dateien erschienen gar nicht im Diff.

**Sie möchten den Gesamtunterschied zwischen aktuellem Branch und main-Branch sehen**:

Sie entwickeln seit einigen Wochen auf einem Feature-Branch und möchten sehen, was insgesamt geändert wurde. Die Standard-Ansicht „Uncommitted changes" zeigt aber nur die Änderungen der letzten Tage.

**Sie möchten die Unterschiede zwischen zwei bestimmten Commits vergleichen**:

Sie möchten überprüfen, ob ein Bugfix korrekt ist und müssen den Code vor und nach der Korrektur vergleichen, wissen aber nicht, wie Sie Plannotator dazu bringen, den Diff historischer Commits anzuzeigen.

## Wann Sie diese Technik anwenden

- **Bei umfassenden Reviews**: Gleichzeitig Änderungen im Arbeitsverzeichnis und Staging-Bereich prüfen
- **Vor dem Branch-Merge**: Alle Änderungen des aktuellen Branches gegenüber main/master überprüfen
- **Bei Rollback-Reviews**: Bestätigen, welche Dateien beim letzten Commit geändert wurden
- **Bei Teamarbeit**: Code prüfen, den Kollegen gestaged aber noch nicht committet haben

## Kernkonzept

Der Git-Diff-Befehl hat viele Varianten, die jeweils unterschiedliche Codebereiche anzeigen. Plannotator fasst diese Varianten in einem Dropdown-Menü zusammen, sodass Sie sich keine komplexen Git-Befehle merken müssen.

::: info Git Diff-Typen Übersicht

| Diff-Typ | Anzeigebereich | Typischer Anwendungsfall |
| --- | --- | --- |
| Uncommitted changes | Arbeitsverzeichnis + Staging | Alle Änderungen der aktuellen Entwicklung prüfen |
| Staged changes | Nur Staging-Bereich | Vor dem Commit die zu committenden Inhalte prüfen |
| Unstaged changes | Nur Arbeitsverzeichnis | Änderungen prüfen, die noch nicht mit `git add` hinzugefügt wurden |
| Last commit | Letzter Commit | Rollback oder Prüfung des gerade erfolgten Commits |
| vs main | Aktueller Branch vs. Standard-Branch | Umfassende Prüfung vor dem Branch-Merge |

:::

Die Optionen im Dropdown-Menü ändern sich dynamisch je nach Ihrem Git-Status:
- Wenn Sie nicht auf dem Standard-Branch sind, erscheint die Option „vs main"
- Wenn keine Dateien gestaged sind, zeigt die Staged-Ansicht „No staged changes"

## Schritt für Schritt

### Schritt 1: Code-Review starten

**Warum**

Sie müssen zuerst die Code-Review-Oberfläche von Plannotator öffnen.

**Aktion**

Führen Sie im Terminal aus:

```bash
/plannotator-review
```

**Was Sie sehen sollten**

Der Browser öffnet die Code-Review-Seite. Über dem Dateibaum auf der linken Seite befindet sich ein Dropdown-Menü, das den aktuellen Diff-Typ anzeigt (normalerweise „Uncommitted changes").

### Schritt 2: Zur Staged-Ansicht wechseln

**Warum**

Um Dateien zu sehen, die bereits mit `git add` hinzugefügt, aber noch nicht committet wurden.

**Aktion**

1. Klicken Sie auf das Dropdown-Menü über dem Dateibaum links
2. Wählen Sie „Staged changes"

**Was Sie sehen sollten**

- Wenn gestagete Dateien vorhanden sind, zeigt der Dateibaum diese Dateien
- Wenn keine Dateien gestaged sind, zeigt der Hauptbereich: „No staged changes. Stage some files with git add."

### Schritt 3: Zur Last Commit-Ansicht wechseln

**Warum**

Um den gerade committeten Code zu prüfen und sicherzustellen, dass alles in Ordnung ist.

**Aktion**

1. Öffnen Sie erneut das Dropdown-Menü
2. Wählen Sie „Last commit"

**Was Sie sehen sollten**

- Alle Dateien werden angezeigt, die beim letzten Commit geändert wurden
- Der Diff-Inhalt zeigt die Unterschiede von `HEAD~1..HEAD`

### Schritt 4: Zur vs main-Ansicht wechseln (falls verfügbar)

**Warum**

Um alle Änderungen des aktuellen Branches gegenüber dem Standard-Branch zu sehen.

**Aktion**

1. Prüfen Sie, ob im Dropdown-Menü die Option „vs main" oder „vs master" vorhanden ist
2. Falls ja, wählen Sie diese aus

**Was Sie sehen sollten**

- Der Dateibaum zeigt alle unterschiedlichen Dateien zwischen aktuellem Branch und Standard-Branch
- Der Diff-Inhalt zeigt die vollständigen Änderungen von `main..HEAD`

::: tip Aktuellen Branch prüfen

Wenn Sie die Option „vs main" nicht sehen, befinden Sie sich auf dem Standard-Branch. Mit folgendem Befehl können Sie den aktuellen Branch anzeigen:

```bash
git rev-parse --abbrev-ref HEAD
```

Wechseln Sie zu einem Feature-Branch und versuchen Sie es erneut:

```bash
git checkout feature-branch
```

:::

## Checkliste ✅

Bestätigen Sie, dass Sie Folgendes beherrschen:

- [ ] Sie können das Diff-Typ-Dropdown-Menü finden und öffnen
- [ ] Sie verstehen den Unterschied zwischen „Uncommitted", „Staged" und „Last commit"
- [ ] Sie erkennen, wann die Option „vs main" erscheint
- [ ] Sie wissen, welchen Diff-Typ Sie in welchem Szenario verwenden sollten

## Häufige Fallstricke

### Fallstrick 1: Beim Review nur Uncommitted geprüft und Staged-Dateien übersehen

**Symptom**

Nach dem Commit stellen Sie fest, dass im Review einige bereits gestagete Dateien fehlen.

**Ursache**

Die Uncommitted-Ansicht zeigt alle Änderungen im Arbeitsverzeichnis und Staging-Bereich (`git diff HEAD`), bereits gestagete Dateien sind ebenfalls enthalten.

**Lösung**

Wechseln Sie vor dem Review zur Staged-Ansicht und prüfen Sie diese, oder verwenden Sie die Uncommitted-Ansicht (enthält den Staging-Bereich).

### Fallstrick 2: Vor dem Branch-Merge nicht mit main verglichen

**Symptom**

Nach dem Merge in main stellen Sie fest, dass unbeabsichtigte Änderungen eingeführt wurden.

**Ursache**

Sie haben nur die Commits der letzten Tage geprüft, nicht den gesamten Unterschied des Branches gegenüber main.

**Lösung**

Führen Sie vor dem Merge eine umfassende Prüfung mit der „vs main"-Ansicht durch.

### Fallstrick 3: Annahme, dass beim Ansichtswechsel Kommentare verloren gehen

**Symptom**

Sie trauen sich nicht, den Diff-Typ zu wechseln, aus Angst, dass zuvor hinzugefügte Kommentare verschwinden.

**Ursache**

Missverständnis des Wechselmechanismus.

**Tatsächliche Situation**

Beim Wechsel des Diff-Typs behält Plannotator die vorherigen Kommentare bei – sie können weiterhin relevant sein, oder Sie können irrelevante Kommentare manuell löschen.

## Zusammenfassung dieser Lektion

Die 5 von Plannotator unterstützten Diff-Typen:

| Typ | Git-Befehl | Anwendungsfall |
| --- | --- | --- |
| Uncommitted | `git diff HEAD` | Alle Änderungen der aktuellen Entwicklung prüfen |
| Staged | `git diff --staged` | Staging-Bereich vor dem Commit prüfen |
| Unstaged | `git diff` | Änderungen im Arbeitsverzeichnis prüfen |
| Last commit | `git diff HEAD~1..HEAD` | Rollback oder Prüfung des letzten Commits |
| vs main | `git diff main..HEAD` | Umfassende Prüfung vor dem Branch-Merge |

Beim Wechsel der Ansicht gehen keine Kommentare verloren. Sie können dieselben oder neue Kommentare aus verschiedenen Perspektiven betrachten.

## Vorschau der nächsten Lektion

> In der nächsten Lektion lernen wir **[URL-Freigabe](../../advanced/url-sharing/)**.
>
> Sie werden lernen:
> - Wie Sie Review-Inhalte in einer URL komprimieren und mit Kollegen teilen
> - Wie der Empfänger den geteilten Review-Link öffnet
> - Einschränkungen und Hinweise im Freigabemodus

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-24

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| Diff-Typ-Definition | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L10-L15) | 10-15 |
| Git-Kontext abrufen | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L79-L96) | 79-96 |
| Git Diff ausführen | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L101-L147) | 101-147 |
| Diff-Wechsel-Behandlung | [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx#L300-L331) | 300-331 |
| Diff-Optionen im Dateibaum rendern | [`packages/review-editor/components/FileTree.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/FileTree.tsx) | - |

**Wichtige Typen**:

- `DiffType`: `'uncommitted' | 'staged' | 'unstaged' | 'last-commit' | 'branch'`

**Wichtige Funktionen**:

- `getGitContext()`: Ruft den aktuellen Branch, Standard-Branch und verfügbare Diff-Optionen ab
- `runGitDiff(diffType, defaultBranch)`: Führt den entsprechenden Git-Befehl basierend auf dem Diff-Typ aus

**Wichtige API**:

- `POST /api/diff/switch`: Wechselt den Diff-Typ und gibt neue Diff-Daten zurück

</details>

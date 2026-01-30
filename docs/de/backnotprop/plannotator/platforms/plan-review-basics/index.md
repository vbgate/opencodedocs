---
title: "Plan-Review: KI-Pläne visuell überprüfen | Plannotator"
subtitle: "Grundlagen des Plan-Reviews: KI-Pläne visuell überprüfen"
description: "Lernen Sie die Plan-Review-Funktion von Plannotator. Nutzen Sie die visuelle Oberfläche zur Überprüfung von KI-generierten Plänen, fügen Sie Anmerkungen hinzu, genehmigen oder lehnen Sie ab. Verstehen Sie den Unterschied zwischen Approve und Request Changes."
sidebarTitle: "Plan-Review in 5 Minuten"
tags:
  - "Plan-Review"
  - "Visuelle Überprüfung"
  - "Anmerkungen"
  - "Genehmigung"
  - "Ablehnung"
  - "Claude Code"
  - "OpenCode"
prerequisite:
  - "start-getting-started"
order: 1
---

# Grundlagen des Plan-Reviews: KI-Pläne visuell überprüfen

## Was Sie lernen werden

- ✅ KI-generierte Pläne mit der visuellen Oberfläche von Plannotator überprüfen
- ✅ Plantext markieren und verschiedene Anmerkungstypen hinzufügen (Löschen, Ersetzen, Kommentieren)
- ✅ Pläne genehmigen, damit die KI mit der Umsetzung fortfahren kann
- ✅ Pläne ablehnen und Anmerkungen als Feedback an die KI senden
- ✅ Anwendungsfälle und Unterschiede der Anmerkungstypen verstehen

## Ihre aktuelle Herausforderung

**Problem 1**: KI-generierte Umsetzungspläne im Terminal zu lesen ist mühsam – viel Text, unklare Struktur, anstrengende Überprüfung.

**Problem 2**: Feedback an die KI zu geben erfordert umständliche Textbeschreibungen wie „lösche Absatz 3" oder „ändere diese Funktion". Hoher Kommunikationsaufwand, und die KI kann es falsch verstehen.

**Problem 3**: Manche Stellen im Plan brauchen keine Änderung, andere müssen ersetzt werden, wieder andere brauchen einen Kommentar – aber es fehlt ein Tool, um dieses Feedback zu strukturieren.

**Problem 4**: Unklar, wie Sie der KI mitteilen, ob Sie den Plan genehmigt haben oder Änderungen wünschen.

**Plannotator hilft Ihnen dabei**:
- Visuelle Oberfläche statt Terminal-Lesen, klare Struktur
- Text markieren und Anmerkungen hinzufügen (Löschen, Ersetzen, Kommentieren), präzises Feedback
- Anmerkungen werden automatisch in strukturierte Daten umgewandelt, die KI versteht Ihre Absicht genau
- Ein Klick zum Genehmigen oder Ablehnen, sofortige KI-Reaktion

## Wann Sie diese Funktion nutzen

**Anwendungsfälle**:
- KI-Agent hat den Plan fertiggestellt und ruft `ExitPlanMode` auf (Claude Code)
- KI-Agent ruft das `submit_plan`-Tool auf (OpenCode)
- Sie müssen einen KI-generierten Umsetzungsplan überprüfen
- Sie möchten präzises Feedback zu Planänderungen geben

**Nicht geeignet für**:
- Direkte Code-Umsetzung durch die KI (Plan-Review überspringen)
- Plan bereits genehmigt, tatsächliche Code-Änderungen überprüfen (nutzen Sie die Code-Review-Funktion)

## 🎒 Vorbereitung

**Voraussetzungen**:
- ✅ Plannotator CLI installiert (siehe [Schnellstart](../start/getting-started/))
- ✅ Claude Code oder OpenCode Plugin konfiguriert (siehe entsprechende Installationsanleitung)
- ✅ KI-Agent unterstützt Plan-Review (Claude Code 2.1.7+ oder OpenCode)

**Auslöser**:
- **Claude Code**: Nach Abschluss des Plans ruft die KI automatisch `ExitPlanMode` auf, Plannotator startet automatisch
- **OpenCode**: KI ruft das `submit_plan`-Tool auf, Plannotator startet automatisch

## Kernkonzept

### Was ist Plan-Review

**Plan-Review** ist die Kernfunktion von Plannotator zur visuellen Überprüfung von KI-generierten Umsetzungsplänen.

::: info Warum brauchen Sie Plan-Review?
Nachdem die KI einen Plan erstellt hat, fragt sie normalerweise „Ist dieser Plan in Ordnung?" oder „Soll ich mit der Umsetzung beginnen?". Ohne visuelles Tool können Sie nur reinen Text im Terminal lesen und dann vage antworten wie „OK" oder „Nein, ändere XX". Mit Plannotator können Sie den Plan in einer visuellen Oberfläche betrachten, genau die zu ändernden Stellen markieren und strukturierte Anmerkungen hinzufügen – die KI versteht Ihre Absicht besser.
:::

### Arbeitsablauf

```
┌─────────────────┐
│  KI-Agent       │
│  (erstellt Plan)│
└────────┬────────┘
         │
         │ ExitPlanMode / submit_plan
         ▼
┌─────────────────┐
│ Plannotator UI  │  ← Browser öffnet automatisch
│                 │
│ ┌───────────┐  │
│ │ Planinhalt │  │
│ │ (Markdown) │  │
│ └───────────┘  │
│       │         │
│       │ Text markieren
│       ▼         │
│ ┌───────────┐  │
│ │ Anmerkung  │  │
│ │ hinzufügen │  │
│ │ Delete/    │  │
│ │ Replace/   │  │
│ │ Comment    │  │
│ └───────────┘  │
│       │         │
│       ▼         │
│ ┌───────────┐  │
│ │ Entscheidung│ │
│ │ Approve/  │  │
│ │ Request   │  │
│ │ Changes   │  │
│ └───────────┘  │
└────────┬────────┘
         │
         │ {"behavior": "allow"} oder
         │ {"behavior": "deny", "message": "..."}
         ▼
┌─────────────────┐
│  KI-Agent       │
│  (setzt um)     │
└─────────────────┘
```

### Anmerkungstypen

Plannotator unterstützt vier Anmerkungstypen, jeder mit unterschiedlichem Zweck:

| Anmerkungstyp | Zweck | Feedback an die KI |
| --- | --- | --- |
| **Delete** | Unerwünschten Inhalt löschen | „Löschen: [markierter Text]" |
| **Replace** | Durch besseren Inhalt ersetzen | „Ersetzen: [markierter Text] durch [Ihr eingegebener Text]" |
| **Comment** | Einen Abschnitt kommentieren, keine Änderung erforderlich | „Kommentar: [markierter Text]. Hinweis: [Ihr Kommentar]" |
| **Global Comment** | Globaler Kommentar, nicht an bestimmten Text gebunden | „Globaler Kommentar: [Ihr Kommentar]" |

### Approve vs Request Changes

| Entscheidungstyp | Aktion | Feedback an die KI | Anwendungsfall |
| --- | --- | --- | --- |
| **Approve** | Approve-Button klicken | `{"behavior": "allow"}` | Plan ist in Ordnung, direkt genehmigen |
| **Request Changes** | Request Changes-Button klicken | `{"behavior": "deny", "message": "..."}` | Änderungen erforderlich |

::: tip Unterschiede zwischen Claude Code und OpenCode
- **Claude Code**: Bei Approve werden Anmerkungen nicht gesendet (werden ignoriert)
- **OpenCode**: Bei Approve können Anmerkungen optional als Notizen gesendet werden

**Bei Planablehnung**: Auf beiden Plattformen werden Anmerkungen an die KI gesendet
:::

## Schritt-für-Schritt-Anleitung

### Schritt 1: Plan-Review auslösen

**Claude Code Beispiel**:

Führen Sie in Claude Code ein Gespräch mit der KI, um einen Umsetzungsplan zu erstellen:

```
Benutzer: Erstelle mir einen Umsetzungsplan für ein Benutzerauthentifizierungsmodul

Claude: Hier ist der Umsetzungsplan:
1. Benutzermodell erstellen
2. Registrierungs-API implementieren
3. Login-API implementieren
...
(KI ruft ExitPlanMode auf)
```

**OpenCode Beispiel**:

In OpenCode ruft die KI automatisch das `submit_plan`-Tool auf.

**Was Sie sehen sollten**:
1. Browser öffnet automatisch die Plannotator-Oberfläche
2. Der KI-generierte Planinhalt wird angezeigt (Markdown-Format)
3. Am unteren Seitenrand befinden sich die Buttons „Approve" und „Request Changes"

### Schritt 2: Planinhalt durchsehen

Betrachten Sie den Plan im Browser:

- Der Plan wird im Markdown-Format gerendert, einschließlich Überschriften, Absätze, Listen, Codeblöcke
- Sie können durch den gesamten Plan scrollen
- Hell-/Dunkelmodus-Umschaltung wird unterstützt (Theme-Umschalter oben rechts)

### Schritt 3: Plantext markieren und Anmerkungen hinzufügen

**Delete-Anmerkung hinzufügen**:

1. Markieren Sie mit der Maus den zu löschenden Text im Plan
2. Klicken Sie in der erscheinenden Werkzeugleiste auf **Delete**
3. Der Text wird als gelöscht markiert (rote Durchstreichung)

**Replace-Anmerkung hinzufügen**:

1. Markieren Sie mit der Maus den zu ersetzenden Text im Plan
2. Klicken Sie in der erscheinenden Werkzeugleiste auf **Replace**
3. Geben Sie im erscheinenden Eingabefeld den Ersatztext ein
4. Drücken Sie Enter oder klicken Sie auf Bestätigen
5. Der Originaltext wird als ersetzt markiert (gelber Hintergrund), der Ersatztext erscheint darunter

**Comment-Anmerkung hinzufügen**:

1. Markieren Sie mit der Maus den zu kommentierenden Text im Plan
2. Klicken Sie in der erscheinenden Werkzeugleiste auf **Comment**
3. Geben Sie im erscheinenden Eingabefeld Ihren Kommentar ein
4. Drücken Sie Enter oder klicken Sie auf Bestätigen
5. Der Text wird als kommentiert markiert (blaue Hervorhebung), der Kommentar erscheint in der Seitenleiste

**Global Comment hinzufügen**:

1. Klicken Sie oben rechts auf **Add Global Comment**
2. Geben Sie im erscheinenden Eingabefeld Ihren globalen Kommentar ein
3. Drücken Sie Enter oder klicken Sie auf Bestätigen
4. Der Kommentar erscheint im Bereich „Global Comments" der Seitenleiste

**Was Sie sehen sollten**:
- Nach dem Markieren von Text erscheint sofort eine Werkzeugleiste (Delete, Replace, Comment)
- Nach dem Hinzufügen von Anmerkungen zeigt der Text den entsprechenden Stil (Durchstreichung, Hintergrundfarbe, Hervorhebung)
- Die Seitenleiste zeigt alle Anmerkungen, Klick springt zur entsprechenden Position
- Sie können auf **Löschen** neben einer Anmerkung klicken, um sie zu entfernen

### Schritt 4: Plan genehmigen

**Wenn der Plan in Ordnung ist**:

Klicken Sie auf den **Approve**-Button am unteren Seitenrand.

**Was Sie sehen sollten**:
- Browser schließt automatisch (1,5 Sekunden Verzögerung)
- Claude Code/OpenCode Terminal zeigt, dass der Plan genehmigt wurde
- KI fährt mit der Umsetzung fort

::: info Verhalten von Approve
- **Claude Code**: Sendet nur `{"behavior": "allow"}`, Anmerkungen werden ignoriert
- **OpenCode**: Sendet `{"behavior": "allow"}`, Anmerkungen können optional als Notizen gesendet werden
:::

### Schritt 5: Plan ablehnen (Request Changes)

**Wenn der Plan Änderungen benötigt**:

1. Fügen Sie die notwendigen Anmerkungen hinzu (Delete, Replace, Comment)
2. Klicken Sie auf den **Request Changes**-Button am unteren Seitenrand
3. Ein Bestätigungsdialog erscheint

**Was Sie sehen sollten**:
- Bestätigungsdialog zeigt „Send X annotations to AI?"
- Nach Bestätigung schließt der Browser automatisch
- Claude Code/OpenCode Terminal zeigt den Feedback-Inhalt
- KI wird den Plan basierend auf dem Feedback überarbeiten

::: tip Verhalten von Request Changes
- **Claude Code** und **OpenCode**: Beide senden `{"behavior": "deny", "message": "..."}`
- Anmerkungen werden in strukturierten Markdown-Text umgewandelt
- KI überarbeitet den Plan und ruft erneut ExitPlanMode/submit_plan auf
:::

### Schritt 6: Feedback-Inhalt anzeigen (optional)

Wenn Sie den von Plannotator an die KI gesendeten Feedback-Inhalt sehen möchten, schauen Sie im Terminal:

**Claude Code**:
```
Plan rejected by user
Please modify the plan based on the following feedback:

[Strukturierter Anmerkungsinhalt]
```

**OpenCode**:
```
<feedback>
[Strukturierter Anmerkungsinhalt]
</feedback>
```

## Checkliste ✅

Nach Abschluss der obigen Schritte sollten Sie in der Lage sein:

- [ ] Nach Auslösung des Plan-Reviews durch die KI öffnet der Browser automatisch die Plannotator-Oberfläche
- [ ] Plantext markieren und Delete-, Replace-, Comment-Anmerkungen hinzufügen
- [ ] Global Comment hinzufügen
- [ ] Alle Anmerkungen in der Seitenleiste anzeigen und zur entsprechenden Position springen
- [ ] Approve klicken, Browser schließt, KI setzt um
- [ ] Request Changes klicken, Browser schließt, KI überarbeitet den Plan

**Bei Problemen** siehe:
- [Häufige Probleme](../../faq/common-problems/)
- [Claude Code Installationsanleitung](../../start/installation-claude-code/)
- [OpenCode Installationsanleitung](../../start/installation-opencode/)

## Häufige Fehler

**Häufiger Fehler 1**: Nach dem Markieren von Text erscheint keine Werkzeugleiste

**Ursache**: Möglicherweise wurde Text in einem Codeblock markiert, oder der markierte Text erstreckt sich über mehrere Elemente.

**Lösung**:
- Versuchen Sie, Text innerhalb eines einzelnen Absatzes oder Listenelements zu markieren
- Für Codeblöcke verwenden Sie Comment-Anmerkungen, markieren Sie nicht über mehrere Zeilen

**Häufiger Fehler 2**: Nach dem Hinzufügen einer Replace-Anmerkung wird der Ersatztext nicht angezeigt

**Ursache**: Das Eingabefeld für den Ersatztext wurde möglicherweise nicht korrekt abgeschickt.

**Lösung**:
- Nach Eingabe des Ersatztextes Enter drücken oder auf Bestätigen klicken
- Prüfen Sie, ob der Ersatztext in der Seitenleiste angezeigt wird

**Häufiger Fehler 3**: Nach Klick auf Approve oder Request Changes schließt der Browser nicht

**Ursache**: Möglicherweise ein Serverfehler oder Netzwerkproblem.

**Lösung**:
- Prüfen Sie das Terminal auf Fehlermeldungen
- Schließen Sie den Browser manuell
- Bei anhaltenden Problemen siehe [Fehlerbehebung](../../faq/troubleshooting/)

**Häufiger Fehler 4**: KI ändert nach Erhalt des Feedbacks nicht gemäß den Anmerkungen

**Ursache**: Die KI hat möglicherweise die Absicht der Anmerkungen nicht richtig verstanden.

**Lösung**:
- Versuchen Sie, eindeutigere Anmerkungen zu verwenden (Replace ist eindeutiger als Comment)
- Verwenden Sie Comment für detaillierte Erklärungen
- Bei anhaltenden Problemen können Sie den Plan erneut ablehnen und die Anmerkungen anpassen

**Häufiger Fehler 5**: Nach mehreren Delete-Anmerkungen löscht die KI nur einen Teil des Inhalts

**Ursache**: Mehrere Delete-Anmerkungen überlappen oder kollidieren möglicherweise.

**Lösung**:
- Stellen Sie sicher, dass sich die Textbereiche der Delete-Anmerkungen nicht überlappen
- Wenn Sie einen großen Abschnitt löschen möchten, markieren Sie den gesamten Absatz auf einmal

## Zusammenfassung

Plan-Review ist die Kernfunktion von Plannotator, mit der Sie KI-generierte Pläne visuell überprüfen können:

**Kernoperationen**:
1. **Auslösen**: KI ruft `ExitPlanMode` oder `submit_plan` auf, Browser öffnet automatisch die Oberfläche
2. **Durchsehen**: Planinhalt in der visuellen Oberfläche betrachten (Markdown-Format)
3. **Anmerken**: Text markieren, Delete, Replace, Comment oder Global Comment hinzufügen
4. **Entscheiden**: Approve (genehmigen) oder Request Changes (ablehnen) klicken
5. **Feedback**: Anmerkungen werden in strukturierte Daten umgewandelt, KI fährt fort oder überarbeitet den Plan

**Anmerkungstypen**:
- **Delete**: Unerwünschten Inhalt löschen
- **Replace**: Durch besseren Inhalt ersetzen
- **Comment**: Einen Abschnitt kommentieren, keine Änderung erforderlich
- **Global Comment**: Globaler Kommentar, nicht an bestimmten Text gebunden

**Entscheidungstypen**:
- **Approve**: Plan ist in Ordnung, direkt genehmigen (Claude Code ignoriert Anmerkungen)
- **Request Changes**: Änderungen erforderlich, Anmerkungen werden an die KI gesendet

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen Sie **[Plan-Anmerkungen hinzufügen](../plan-review-annotations/)**.
>
> Sie werden lernen:
> - Wie Sie Delete, Replace, Comment-Anmerkungen präzise verwenden
> - Wie Sie Bildanmerkungen hinzufügen
> - Wie Sie Anmerkungen bearbeiten und löschen
> - Best Practices und häufige Szenarien für Anmerkungen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-24

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| Plan-Review UI | [`packages/editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/editor/App.tsx#L1-L200) | 1-200 |
| Anmerkungstyp-Definition | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L1-L70) | 1-70 |
| Plan-Review-Server | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L91-L310) | 91-310 |
| API: Planinhalt abrufen | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L132-L134) | 132-134 |
| API: Plan genehmigen | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L201-L277) | 201-277 |
| API: Plan ablehnen | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L280-L309) | 280-309 |
| Viewer-Komponente | [`packages/ui/components/Viewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Viewer.tsx#L1-L100) | 1-100 |
| AnnotationPanel-Komponente | [`packages/ui/components/AnnotationPanel.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationPanel.tsx#L1-L50) | 1-50 |

**Wichtige Typen**:
- `AnnotationType`: Anmerkungstyp-Enum (DELETION, INSERTION, REPLACEMENT, COMMENT, GLOBAL_COMMENT) (`packages/ui/types.ts:1-7`)
- `Annotation`: Anmerkungsschnittstelle (`packages/ui/types.ts:11-33`)
- `Block`: Planblock-Schnittstelle (`packages/ui/types.ts:35-44`)

**Wichtige Funktionen**:
- `startPlannotatorServer()`: Startet den Plan-Review-Server (`packages/server/index.ts:91`)
- `parseMarkdownToBlocks()`: Parst Markdown in Blocks (`packages/ui/utils/parser.ts`)

**API-Routen**:
- `GET /api/plan`: Planinhalt abrufen (`packages/server/index.ts:132`)
- `POST /api/approve`: Plan genehmigen (`packages/server/index.ts:201`)
- `POST /api/deny`: Plan ablehnen (`packages/server/index.ts:280`)

**Geschäftsregeln**:
- Claude Code sendet bei Genehmigung keine Anmerkungen (`apps/hook/server/index.ts:132`)
- OpenCode kann bei Genehmigung Anmerkungen als Notizen senden (`apps/opencode-plugin/index.ts:270`)
- Bei Planablehnung werden Anmerkungen immer gesendet (`apps/hook/server/index.ts:154`)

</details>

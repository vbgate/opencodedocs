---
title: "UI-Phase: Interface und Prototyp Design - ui-ux-pro-max Designsystem | Agent App Factory Tutorial"
sidebarTitle: "Interface und Prototyp Design"
subtitle: "Phase 3: UI - Interface und Prototyp Design"
description: "Erfahren Sie, wie die UI-Phase professionelle UI-Schemas und vorschaufähige Prototypen basierend auf dem PRD generiert. Dieses Tutorial erklärt die Aufgaben des UI-Agents, die Verwendung des ui-ux-pro-max Designsystems, die Standardstruktur von ui.schema.yaml, Designprinzipien und die Liefer-Checkliste."
tags:
  - "Pipeline"
  - "UI/UX"
  - "Designsystem"
prerequisite:
  - "advanced-stage-prd"
order: 100
---

# Phase 3: UI - Interface und Prototyp Design

Die UI-Phase ist die dritte Phase der Agent App Factory Pipeline und verantwortlich für die Umwandlung der Funktionsbeschreibungen aus dem PRD in eine klare Interface-Struktur (UI-Schema) und vorschaufähige Prototypen. Diese Phase bestimmt das Aussehen und die Interaktionserfahrung der endgültigen Anwendung und ist die Schlüsselbrücke zwischen Produktanforderungen und technischer Implementierung.

## Was Sie nach diesem Kurs können werden

- PRD in eine konforme `ui.schema.yaml`-Datei umwandeln
- Verwenden Sie die ui-ux-pro-max-Skill, um professionelle Designsysteme (Stile, Farben, Schriftarten) zu erstellen
- Erstellen Sie vorschaufähige Prototypen (HTML + CSS + JS), die im Browser angezeigt werden können
- Verstehen Sie die Verantwortungsgrenzen des UI-Agents (visuelles Design, keine technische Implementierung)
- Vermeiden Sie häufige AI-Design-Fallen (wie übermäßige Verwendung von lila Farbverläufen, Inter-Schriftart)

## Ihre aktuelle Situation

Sie haben möglicherweise ein klares PRD, wissen aber nicht, wie Sie mit dem Interface-Design beginnen sollen:

- "Das PRD ist fertig, aber ich finde keinen passenden UI-Stil" (fehlendes Designsystem-Wissen)
- "Ich weiß nicht, welche Farben, Schriftarten und Layouts verwendet werden sollen" (abhängig von persönlicher Ästhetik statt professionellen Standards)
- "Der entworfene Prototyp stimmt nicht mit dem PRD überein" (Interface-Struktur und funktionale Anforderungen sind entkoppelt)
- "Ich habe Angst, dass das Design zu hässlich oder zu überladen ist und nicht zur Produktpositionierung passt" (mangelnde Branchendesignerfahrung)

Solche Designblindstellen führen dazu, dass die nachfolgende Code-Phase keine klaren visuellen Richtlinien hat, was dazu führen kann, dass die generierte Anwendung ein verworrenes Erscheinungsbild und inkonsistente Interaktionen aufweist.

## Wann diese Methode verwenden

Wenn Ihr PRD abgeschlossen ist und die folgenden Bedingungen erfüllt sind:

1. **Ein klares PRD-Dokument vorhanden ist** (enthält User Stories, Funktionsliste, Nicht-Ziele)
2. **Noch kein Interface-Design begonnen hat** (UI ist die erste Designphase)
3. **Der Technologie-Stack noch nicht entschieden ist** (technische Implementierungsdetails in der Tech-Phase)
4. **Den Designumfang kontrollieren und Überdesign vermeiden möchte** (UI-Phase begrenzt auf maximal 3 Seiten)

## 🎒 Vorbereitung vor dem Start

::: warning Voraussetzungen
Bevor Sie mit der UI-Phase beginnen, stellen Sie sicher:

- ✅ Die [PRD-Phase](../stage-prd/) wurde abgeschlossen, `artifacts/prd/prd.md` wurde generiert
- ✅ Das ui-ux-pro-max-Plugin wurde installiert (empfohlene Methode: Ausführen von [factory init](../../start/installation/) installiert es automatisch)
- ✅ Sie haben die [7-Phasen-Pipeline-Übersicht](../../start/pipeline-overview/) verstanden
- ✅ Sie haben einen AI-Assistenten vorbereitet (empfohlen: Claude Code)
:::

## Kernkonzept

### Was ist die UI-Phase?

Die **UI-Phase** ist die Brücke zwischen Produktanforderungen und technischer Implementierung. Ihre einzige Aufgabe besteht darin, **die Funktionsbeschreibungen aus dem PRD in Interface-Strukturen und visuelle Richtlinien umzuwandeln**.

::: info Keine Frontend-Entwicklung
Der UI-Agent ist kein Frontend-Entwickler, er schreibt keine React-Komponenten oder CSS-Code. Seine Aufgaben sind:
- Analysieren der Funktionsanforderungen aus dem PRD
- Festlegen der Interface-Informationsarchitektur (Seiten und Komponenten)
- Generieren des Designsystems (Farben, Schriftarten, Abstände, Eckenradien)
- Erstellen vorschaufähiger Prototypen (HTML + CSS + JS)

Er entscheidet nicht, "mit welchem Framework implementiert wird", sondern nur, "wie es aussieht".
:::

### Warum benötigen wir ein Designsystem?

Stellen Sie sich eine Hausrenovierung ohne Designsystem vor:

- ❌ Ohne Designsystem: Wohnzimmer im minimalistischen Stil, Schlafzimmer im Retro-Stil, Küche im industriellen Stil, insgesamt chaotisch
- ✅ Mit Designsystem: Einheitliche Farbgebung, einheitlicher Stil, einheitliche Materialien im gesamten Haus, harmonisch und konsistent

Die UI-Phase generiert durch die ui-ux-pro-max-Skill genau solche "Hausrenovierungsleitfäden", um sicherzustellen, dass alle in der nachfolgenden Code-Phase generierten Interfaces einheitlichen visuellen Richtlinien folgen.

### Struktur der Ausgabedateien

Die UI-Phase generiert drei Dateien:

| Datei | Inhalt | Zweck |
|------|-------|-------|
| **ui.schema.yaml** | Designsystem-Konfiguration + Interface-Struktur-Definition | Die Tech-Phase liest diese Datei, um Datenmodelle zu entwerfen, die Code-Phase liest diese Datei, um Interfaces zu generieren |
| **preview.web/index.html** | Vorschaufähiger Prototyp, der im Browser angezeigt werden kann | Ermöglicht Ihnen, vorab die Interface-Effekte zu sehen und zu validieren, ob das Design den Erwartungen entspricht |
| **design-system.md** (optional) | Persistiertes Designsystem-Dokument | Zeichnet Designentscheidungen auf, erleichtert spätere Anpassungen |

## Mach es mit mir

### Schritt 1: Bestätigen, dass die PRD-Phase abgeschlossen ist

Bevor Sie die UI-Phase starten, stellen Sie sicher, dass `artifacts/prd/prd.md` existiert und der Inhalt vollständig ist.

**Checkliste ✅**:

1. **Ist die Zielgruppe klar definiert?**
   - ✅ Konkrete Persona vorhanden (Alter/Beruf/technische Fähigkeiten)
   - ❌ Vage: "Alle"

2. **Sind die Kernfunktionen aufgelistet?**
   - ✅ 3-7 Schlüsselfunktionen vorhanden
   - ❌ Zu viele oder zu wenige

3. **Sind die Nicht-Ziele ausreichend?**
   - ✅ Mindestens 3 Funktionen aufgelistet, die nicht umgesetzt werden
   - ❌ Fehlend oder zu wenige

::: tip Wenn das PRD unvollständig ist
Kehren Sie zur [PRD-Phase](../stage-prd/) zurück und ändern Sie es, um sicherzustellen, dass das Design klare Eingaben hat.
:::

### Schritt 2: Pipeline zur UI-Phase starten

Führen Sie im Factory-Projektverzeichnis Folgendes aus:

```bash
# Aus der PRD-Phase weitermachen (wenn die PRD-Phase gerade abgeschlossen wurde)
factory continue

# Oder direkt angeben, dass bei ui begonnen werden soll
factory run ui
```

Die CLI zeigt den aktuellen Status und die verfügbaren Phasen an.

### Schritt 3: Der AI-Assistent liest die UI-Agent-Definition

Der AI-Assistent (z. B. Claude Code) liest automatisch `agents/ui.agent.md`, um seine Aufgaben und Einschränkungen zu verstehen.

::: info Agent-Aufgaben
Der UI-Agent darf nur:
- `artifacts/prd/prd.md` lesen
- In `artifacts/ui/` schreiben
- Die ui-ux-pro-max-Skill verwenden, um Designsysteme zu generieren
- Bis zu 3 Seiten Prototypen erstellen

Er darf nicht:
- Andere Dateien lesen
- In andere Verzeichnisse schreiben
- Den Technologie-Stack entscheiden (dies geschieht in der Tech-Phase)
- AI-Standardstile verwenden (lila Farbverläufe, Inter-Schriftart)
:::

### Schritt 4: Verwenden Sie zwingend das ui-ux-pro-max Designsystem (Schlüssel Schritt)

Dies ist der Kernschritt der UI-Phase. Der AI-Assistent **muss** zuerst die `ui-ux-pro-max`-Skill aufrufen, auch wenn Sie glauben, dass die Designrichtung klar ist.

**Die Funktion der ui-ux-pro-max-Skill**:

1. **Automatische Empfehlung von Designsystemen**: Empfiehlt automatisch die besten Stile basierend auf Produkttyp und Branche
2. **Bietet 67 UI-Stile**: Vom Minimalismus bis zum Neuen Brutalismus
3. **Bietet 96 Farbpaletten**: Vorab designed nach Branche und Stil
4. **Bietet 57 Schriftartkombinationen**: Vermeidet häufige AI-Stile (Inter, Roboto)
5. **Wendet 100 Branchen-Regeln an**: Stellt sicher, dass das Design zur Produktpositionierung passt

**Was der AI-Assistent tun wird**:
- Extrahieren Sie Schlüsselinformationen aus dem PRD: Produkttyp, Branche, Zielgruppe
- Aufrufen der `ui-ux-pro-max`-Skill, um vollständige Designsystem-Empfehlungen zu erhalten
- Anwenden der empfohlenen Designsysteme auf `ui.schema.yaml` und den Prototyp

::: danger Überspringen dieses Schritts wird abgelehnt
Der Sisyphus-Scheduler überprüft, ob die ui-ux-pro-max-Skill verwendet wurde. Wenn nicht, werden die vom UI-Agenten generierten Artefakte abgelehnt und müssen erneut ausgeführt werden.
:::

**Was enthält das Designsystem?**

```yaml
design_system:
  style: "Glassmorphism"           # Gewählter Stil (z. B. Glas, Minimalismus)
  colors:
    primary: "#2563eb"             # Primärfarbe (für Hauptaktionen)
    secondary: "#64748b"           # Sekundärfarbe
    success: "#10b981"             # Erfolgsfarbe
    warning: "#f59e0b"             # Warnfarbe
    error: "#ef4444"               # Fehlerfarbe
    background: "#ffffff"          # Hintergrundfarbe
    surface: "#f8fafc"            # Oberflächenfarbe
    text:
      primary: "#1e293b"           # Primärer Text
      secondary: "#64748b"         # Sekundärer Text
  typography:
    font_family:
      headings: "DM Sans"          # Überschriftschrift (vermeiden Sie Inter)
      body: "DM Sans"              # Fließtextschrift
    font_size:
      base: 16
      lg: 18
      xl: 20
      2xl: 24
  spacing:
    unit: 8                        # Abstandsbasis (8px-Raster)
  border_radius:
    md: 8
    lg: 12
  effects:
    hover_transition: "200ms"      # hover-Übergangszeit
    blur: "backdrop-blur-md"       # Milchglas-Effekt
```

### Schritt 5: Interface-Struktur entwerfen

Der AI-Assistent entwirft die Interface-Informationsarchitektur (Seiten und Komponenten) basierend auf den Funktionsanforderungen im PRD.

**Beispiel für Interface-Struktur** (aus `ui.schema.yaml`):

```yaml
pages:
  - id: home
    title: "Startseite"
    type: list
    description: "Liste aller Projekte anzeigen"
    components:
      - type: header
        content: "Meine Anwendung"
      - type: list
        source: "api/items"
        item_layout:
          - type: text
            field: "title"
            style: "heading"
          - type: text
            field: "description"
            style: "body"
        actions:
          - type: "navigate"
            target: "detail"
            params: ["id"]

  - id: detail
    title: "Details"
    type: detail
    params:
      - name: "id"
        type: "number"

  - id: create
    title: "Erstellen"
    type: form
    fields:
      - name: "title"
        type: "text"
        label: "Titel"
        required: true
    submit:
      action: "post"
      endpoint: "/api/items"
      on_success: "navigate:home"
```

**Seitentypen**:
- `list`: Listenseite (z. B. Startseite, Suchergebnisse)
- `detail`: Detailseite (z. B. Anzeigen von Projektdetails)
- `form`: Formularseite (z. B. Erstellen, Bearbeiten)

### Schritt 6: Vorschau-Prototyp erstellen

Der AI-Assistent erstellt einen vorschaufähigen Prototyp mit HTML + CSS + JS, der Schlüsselinteraktionsabläufe zeigt.

**Prototyp-Merkmale**:
- Verwendet native Technologien (keine Framework-Abhängigkeiten)
- Wendet die vom Designsystem empfohlenen Farben, Schriftarten und Effekte an
- Alle anklickbaren Elemente haben Hover-Zustände und `cursor-pointer`
- Mobile-First-Design (korrekt responsiv bei 375px und 768px)
- Verwendet SVG-Symbole (Heroicons/Lucide), keine Emojis

**Vorschau-Methode**:
Öffnen Sie `artifacts/ui/preview.web/index.html` mit einem Browser, um den Prototyp anzuzeigen.

### Schritt 7: UI-Ausgabe bestätigen

Nach Abschluss des UI-Agents müssen Sie die Ausgabedateien überprüfen.

**Checkliste ✅**:

1. **Existiert ui.schema.yaml?**
   - ✅ Datei befindet sich im Verzeichnis `artifacts/ui/`
   - ❌ Fehlend oder Pfad falsch

2. **Wurde das ui-ux-pro-max-Skill für das Designsystem verwendet?**
   - ✅ Explizit in der Ausgabe oder im Schema angegeben
   - ❌ Selbst gewähltes Designsystem

3. **Ist die Anzahl der Seiten nicht mehr als 3?**
   - ✅ 1-3 Seiten (MVP konzentriert auf Kernfunktionen)
   - ❌ Mehr als 3 Seiten

4. **Ist der Prototyp im Browser zu öffnen?**
   - ✅ Öffnen von `preview.web/index.html` mit einem Browser zeigt korrekt an
   - ❌ Kann nicht geöffnet werden oder zeigt Fehler

5. **Wurden AI-Standardstile vermieden?**
   - ✅ Keine lila/pink Farbverläufe
   - ✅ Keine Verwendung der Inter-Schriftart
   - ✅ Verwendung von SVG-Symbolen (keine Emojis)
   - ❌ Erscheint der oben genannte AI-Stil

6. **Haben alle anklickbaren Elemente Interaktions-Feedback?**
   - ✅ `cursor-pointer` und Hover-Zustände vorhanden
   - ✅ Glatte Übergänge (150-300ms)
   - ❌ Keine Interaktionsanzeige oder sofortige Änderung

### Schritt 8: Wählen Sie zwischen Fortsetzen, Wiederholen oder Pausieren

Nach Bestätigung zeigt die CLI Optionen an:

```bash
Wählen Sie eine Aktion:
[1] Fortfahren (eintreten in die Tech-Phase)
[2] Wiederholen (erneut UI generieren)
[3] Pausieren (später fortfahren)
```

::: tip Empfehlung: Zuerst Prototypvorschau
Bevor Sie den AI-Assistenten bestätigen, öffnen Sie zuerst den Prototyp mit einem Browser, um zu validieren, ob das Design den Erwartungen entspricht. Sobald Sie in die Tech-Phase eintreten, steigen die Kosten für Designänderungen.
:::

## Fallenwarnung

### Falle 1: ui-ux-pro-max-Skill nicht verwendet

**Fehlerbeispiel**:
```
Der AI-Assistent hat eigenständig den Glas-Stil und blaues Farbschema gewählt
```

**Konsequenz**: Der Sisyphus-Scheduler wird die Artefakte ablehnen und eine erneute Ausführung anfordern.

**Empfehlung**:
```
Der AI-Assistent muss zuerst die ui-ux-pro-max-Skill aufrufen, um ein empfohlenes Designsystem zu erhalten
```

### Falle 2: AI-Standardstile verwendet

**Fehlerbeispiel**:
- Lila/pink Farbverlaufshintergrund
- Inter- oder Roboto-Schriftart
- Emojis als UI-Symbole

**Konsequenz**: Das Design ist unprofessionell, leicht als AI-generiert zu erkennen und beeinträchtigt das Produktbild.

**Empfehlung**:
- Wählen Sie aus den 57 Schriftartkombinationen, die von ui-ux-pro-max empfohlen werden
- Verwenden Sie SVG-Symbolbibliotheken (Heroicons/Lucide)
- Vermeiden Sie übermäßige Verwendung von Farbverläufen und Neonfarben

### Falle 3: Mehr als 3 Seiten

**Fehlerbeispiel**:
```
Es wurden 5 Seiten generiert: Startseite, Details, Erstellen, Bearbeiten, Einstellungen
```

**Konsequenz**: MVP-Umfang gerät außer Kontrolle, Arbeitsaufwand in Tech- und Code-Phase steigt massiv an.

**Empfehlung**: Begrenzen Sie auf 1-3 Seiten, konzentrieren Sie auf Kernnutzungspfade.

### Falle 4: Prototyp ohne Interaktions-Feedback

**Fehlerbeispiel**:
```
Schaltflächen haben keinen Hover-Zustand, Links haben keinen cursor-pointer
```

**Konsequenz**: Schlechte Benutzererfahrung, der Prototyp wirkt unrealistisch.

**Empfehlung**: Fügen Sie allen anklickbaren Elementen `cursor-pointer` und Hover-Zustände hinzu (150-300ms Übergang).

### Falle 5: Mangelnder Kontrast im hellen Modus

**Fehlerbeispiel**:
```
Hintergrundfarbe der Glaskarte bg-white/10 (zu transparent), Textfarbe #94A3B8 (zu hell)
```

**Konsequenz**: Inhalt im hellen Modus nicht sichtbar, Barrierefreiheit nicht erfüllt.

**Empfehlung**:
- Glaskarten im hellen Modus verwenden `bg-white/80` oder höher
- Textkontrast >= 4.5:1 (WCAG AA Standard)

### Falle 6: Prototyp und Schema inkonsistent

**Fehlerbeispiel**:
```
Im Schema sind 2 Seiten definiert, im Prototyp werden jedoch 3 Seiten angezeigt
```

**Konsequenz**: Tech- und Code-Phase werden verwirrt sein, nicht wissen, welche Quelle maßgeblich ist.

**Empfehlung**: Stellen Sie sicher, dass Prototyp und Schema vollständig konsistent sind, Anzahl der Seiten und Komponentenstruktur müssen übereinstimmen.

## Zusammenfassung dieses Kurses

Das Kernkonzept der UI-Phase ist das **Designsystem**:

1. **Eingabe**: Klares PRD-Dokument (`artifacts/prd/prd.md`)
2. **Prozess**: Der AI-Assistent generiert ein professionelles Designsystem durch die ui-ux-pro-max-Skill
3. **Ausgabe**: `ui.schema.yaml` (Designsystem + Interface-Struktur) + `preview.web/index.html` (vorschaufähiger Prototyp)
4. **Validierung**: Überprüfen, ob das Designsystem professionell ist, ob der Prototyp vorschaufähig ist, ob AI-Standardstile vermieden wurden

::: tip Schlüsselprinzipien
- ❌ Was nicht getan wird: Technologie-Stack nicht entscheiden, keinen Frontend-Code schreiben, keine AI-Standardstile verwenden
- ✅ Was nur getan wird: Designsystem generieren, Interface-Struktur entwerfen, vorschaufähige Prototypen erstellen
:::

## Vorschau auf den nächsten Kurs

> Im nächsten Kurs lernen wir **[Phase 4: Tech - Technische Architektur entwerfen](../stage-tech/)**.
>
> Sie werden lernen:
> - Wie man basierend auf PRD und UI-Schema eine technische Architektur entwirft
> - Wie man einen geeigneten Technologie-Stack wählt (Express + Prisma + React Native)
> - Wie man ein minimales durchführbares Datenmodell entwirft (Prisma-Schema)
> - Warum die Tech-Phase keine UI-Implementierungsdetails beinhalten darf

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie, um die Quellcode-Position anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-29

| Funktion | Dateipfad | Zeilennummer |
| ------ | ------------------------------------------------------------- | ------- |
| UI-Agent-Definition | [`agents/ui.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/ui.agent.md) | 1-98 |
| UI-Skill | [`skills/ui/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/ui/skill.md) | 1-430 |
| Pipeline-Definition (UI-Phase) | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 34-47 |
| Scheduler-Definition | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 1-100+ |

**Wichtige Einschränkungen**:
- **Zwingende Verwendung von ui-ux-pro-max-Skill**: ui.agent.md:33, 53-54
- **Verbot von AI-Farbgebung**: ui.agent.md:36
- **Verbot von Emoji-Symbolen**: ui.agent.md:37
- **Muss cursor-pointer und Hover-Zustände hinzufügen**: ui.agent.md:38
- **Prototypseiten nicht mehr als 3**: ui.agent.md:34
- **Verwendung von nativem HTML/CSS/JS**: ui.agent.md:35

**Exit-Bedingungen** (pipeline.yaml:43-47):
- ui.schema.yaml existiert
- Seitenanzahl nicht mehr als 3
- Vorschauseiten im Browser zu öffnen
- Agent hat `ui-ux-pro-max`-Skill verwendet, um Designsystem zu generieren

**Inhaltsrahmen der UI-Skill**:
- **Denkrahmen**: Zweck, Ton, Differenzierung, Informationsarchitektur
- **Designsystem-Generierungs-Workflow**: Anforderungen analysieren → Designsystem generieren → Suche ergänzen → Tech-Stack-Leitfaden erhalten
- **67 UI-Stile**: Minimalismus, Neumorphismus, Glas, Brutalismus usw.
- **Branchen-Regeln**: 100 Regeln, automatische Empfehlung von Designsystemen basierend auf Produkttyp
- **Designsystem-Leitfaden**: Farbsystem, Typografiesystem, Abstandssystem, Komponentenspezifikationen
- **Liefer-Checkliste**: Visuelle Qualität, Interaktion, Hell/Dunkel-Modus, Layout, Barrierefreiheit
- **Entscheidungsprinzipien**: Zweckorientiert, Mobile-First, Barrierefreiheit, Einfachheit begrenzt, Vorschau konsistent, Tool-Priorität
- **Nicht tun (NEVER)**: AI-Stil-Schriftarten/Farben, Emoji-Symbole, geringer Kontrast, mehr als 3 Seiten usw.

</details>

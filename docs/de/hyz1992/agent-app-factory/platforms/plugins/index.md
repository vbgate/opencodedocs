---
title: "Erforderliche Plugin-Installation: superpowers und ui-ux-pro-max | AI App Factory Tutorial"
sidebarTitle: "Plugins in 5 Minuten installieren"
subtitle: "Erforderliche Plugin-Installation: superpowers und ui-ux-pro-max | AI App Factory Tutorial"
description: "Lernen Sie, wie Sie die beiden erforderlichen Plugins für AI App Factory installieren und verifizieren: superpowers (für Bootstrap-Brainstorming) und ui-ux-pro-max (für UI-Designsysteme). Dieses Tutorial deckt automatische Installation, manuelle Installation, Verifizierungsmethoden und häufige Probleme ab, um sicherzustellen, dass die Pipeline reibungslos läuft und qualitativ hochwertige, funktionsfähige Apps generiert werden können."
tags:
  - "Plugin-Installation"
  - "Claude Code"
  - "superpowers"
  - "ui-ux-pro-max"
prerequisite:
  - "start-installation"
  - "start-init-project"
  - "platforms-claude-code"
order: 70
---

# Erforderliche Plugin-Installation: superpowers und ui-ux-pro-max | AI App Factory Tutorial

## Was Sie nach diesem Tutorial können werden

- Überprüfen, ob die Plugins superpowers und ui-ux-pro-max installiert sind
- Diese beiden erforderlichen Plugins manuell installieren (falls die automatische Installation fehlschlägt)
- Verifizieren, dass die Plugins korrekt aktiviert sind
- Verstehen, warum diese beiden Plugins Voraussetzungen für den Pipeline-Betrieb sind
- Häufige Probleme bei der Plugin-Installation beheben

## Ihre aktuelle Situation

Beim Ausführen der Factory-Pipeline können Sie auf folgende Probleme stoßen:

- **Bootstrap-Phase fehlgeschlagen**: Hinweis "Skill superpowers:brainstorm nicht verwendet"
- **UI-Phase fehlgeschlagen**: Hinweis "Skill ui-ux-pro-max nicht verwendet"
- **Automatische Installation fehlgeschlagen**: Fehler bei der Plugin-Installation während `factory init`
- **Plugin-Konflikte**: Ein Plugin mit gleichem Namen ist vorhanden, aber die Version ist falsch
- **Berechtigungsprobleme**: Plugins sind nach der Installation nicht korrekt aktiviert

Tatsächlich versucht Factory während der Initialisierung, diese beiden Plugins **automatisch zu installieren**, aber bei Fehlern müssen Sie manuell eingreifen.

## Wann diese Anleitung anwenden

Eine manuelle Plugin-Installation ist erforderlich, wenn:

- `factory init` einen Fehler bei der Plugin-Installation anzeigt
- Die Bootstrap- oder UI-Phase erkennt, dass ein erforderlicher Skill nicht verwendet wird
- Sie Factory zum ersten Mal verwenden und sicherstellen möchten, dass die Pipeline normal läuft
- Die Plugin-Version veraltet ist und neu installiert werden muss

## Warum diese beiden Plugins benötigt werden

Die Factory-Pipeline ist von zwei wichtigen Claude Code-Plugins abhängig:

| Plugin | Verwendung | Pipeline-Phase | Bereitgestellte Skills |
| --- | --- | --- | --- |
| **superpowers** | Tiefgehende Produktideen-Entwicklung | Bootstrap | `superpowers:brainstorm` - Systematisches Brainstorming zur Analyse von Problemen, Nutzern, Werten und Annahmen |
| **ui-ux-pro-max** | Generierung professioneller Designsysteme | UI | `ui-ux-pro-max` - 67 Stile, 96 Farbpaletten, 100 Branchenregeln |

::: warning Pflichtvoraussetzung
Laut Definition in `agents/orchestrator.checkpoint.md` sind diese beiden Plugins **zwingend erforderlich**:
- **Bootstrap-Phase**: Der Skill `superpowers:brainstorm` muss verwendet werden, sonst wird das Ergebnis abgelehnt
- **UI-Phase**: Der Skill `ui-ux-pro-max` muss verwendet werden, sonst wird das Ergebnis abgelehnt

:::

## 🎒 Vorbereitungen vor dem Start

Bevor Sie beginnen, stellen Sie bitte sicher:

- [ ] Claude CLI ist installiert (`claude --version` funktioniert)
- [ ] `factory init` wurde zur Projektinitialisierung ausgeführt
- [ ] Claude Code-Berechtigungen sind konfiguriert (siehe [Claude Code-Integrationsleitfaden](../claude-code/))
- [ ] Internetverbindung ist aktiv (Zugriff auf GitHub Plugin-Marktplatz erforderlich)

## Kernkonzept

Die Plugin-Installation folgt einem vierstufigen Prozess **Prüfen → Marktplatz hinzufügen → Installieren → Verifizieren**:

1. **Prüfen**: Überprüfen, ob das Plugin bereits installiert ist
2. **Marktplatz hinzufügen**: Das Plugin-Repository zum Claude Code Plugin-Marktplatz hinzufügen
3. **Installieren**: Installationsbefehl ausführen
4. **Verifizieren**: Bestätigen, dass das Plugin aktiviert ist

Die automatischen Installationsskripte von Factory (`cli/scripts/check-and-install-*.js`) führen diese Schritte automatisch aus, aber Sie sollten die manuelle Methode kennen, um bei Fehlern reagieren zu können.

## Schritt-für-Schritt-Anleitung

### Schritt 1: Plugin-Status prüfen

**Warum**
Zuerst prüfen, ob bereits installiert, um doppelte Aktionen zu vermeiden.

Öffnen Sie das Terminal und führen Sie im Projektstammverzeichnis aus:

```bash
claude plugin list
```

**Sie sollten sehen**: Eine Liste der installierten Plugins. Wenn folgende Einträge enthalten sind, ist alles installiert:

```
✅ superpowers (enabled)
✅ ui-ux-pro-max (enabled)
```

Wenn Sie diese beiden Plugins nicht sehen oder `disabled` angezeigt wird, fahren Sie mit den folgenden Schritten fort.

::: info Automatische Installation durch factory init
Der Befehl `factory init` führt automatisch eine Plugin-Installationsprüfung durch (Zeilen 360-392 in `init.js`). Bei Erfolg sehen Sie:

```
📦 Installing superpowers plugin... ✓
📦 Installing ui-ux-pro-max-skill plugin... ✓
✅ Plugins installed!
```
:::

### Schritt 2: superpowers-Plugin installieren

**Warum**
Die Bootstrap-Phase benötigt den Skill `superpowers:brainstorm` für das Brainstorming.

#### Zum Plugin-Marktplatz hinzufügen

```bash
claude plugin marketplace add obra/superpowers-marketplace
```

**Sie sollten sehen**:

```
✅ Plugin marketplace added successfully
```

::: tip Fehler beim Hinzufügen des Marktplatzes
Falls die Meldung "Plugin-Marktplatz existiert bereits" angezeigt wird, können Sie dies ignorieren und mit dem Installationsschritt fortfahren.
:::

#### Plugin installieren

```bash
claude plugin install superpowers@superpowers-marketplace
```

**Sie sollten sehen**:

```
✅ Plugin installed successfully
```

#### Installation verifizieren

```bash
claude plugin list
```

**Sie sollten sehen**: Die Liste enthält `superpowers (enabled)`.

### Schritt 3: ui-ux-pro-max-Plugin installieren

**Warum**
Die UI-Phase benötigt den Skill `ui-ux-pro-max` zur Generierung des Designsystems.

#### Zum Plugin-Marktplatz hinzufügen

```bash
claude plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
```

**Sie sollten sehen**:

```
✅ Plugin marketplace added successfully
```

#### Plugin installieren

```bash
claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

**Sie sollten sehen**:

```
✅ Plugin installed successfully
```

#### Installation verifizieren

```bash
claude plugin list
```

**Sie sollten sehen**: Die Liste enthält `ui-ux-pro-max (enabled)`.

### Schritt 4: Verifizieren, dass beide Plugins funktionieren

**Warum**
Sicherstellen, dass die Pipeline diese beiden Plugin-Skills normal aufrufen kann.

#### superpowers verifizieren

Führen Sie in Claude Code aus:

```
Bitte verwenden Sie den Skill superpowers:brainstorm, um mir bei der Analyse folgender Produktidee zu helfen: [Ihre Idee]
```

**Sie sollten sehen**: Claude beginnt mit dem Brainstorm-Skill, Probleme, Nutzer, Werte und Annahmen systematisch zu analysieren.

#### ui-ux-pro-max verifizieren

Führen Sie in Claude Code aus:

```
Bitte verwenden Sie den Skill ui-ux-pro-max, um ein Farbschema für meine App zu entwerfen
```

**Sie sollten sehen**: Claude gibt einen professionellen Farbvorschlag mit mehreren Design-Optionen zurück.

## Checkpoint ✅

Nach Abschluss der oben genannten Schritte prüfen Sie folgendes:

- [ ] Ausführung von `claude plugin list` zeigt beide Plugins als `enabled` an
- [ ] In Claude Code kann der Skill `superpowers:brainstorm` aufgerufen werden
- [ ] In Claude Code kann der Skill `ui-ux-pro-max` aufgerufen werden
- [ ] Ausführung von `factory run` zeigt keine Plugin-Fehlermeldungen mehr an

## Häufige Probleme

### ❌ Plugin installiert, aber nicht aktiviert

**Phänomen**: `claude plugin list` zeigt das Plugin an, aber ohne `enabled`-Markierung.

**Lösung**: Installationsbefehl erneut ausführen:

```bash
claude plugin install <Plugin-ID>
```

### ❌ Berechtigung blockiert

**Phänomen**: Hinweis "Permission denied: Skill(superpowers:brainstorming)"

**Ursache**: Die Berechtigungskonfiguration von Claude Code enthält nicht `Skill`.

**Lösung**: Prüfen Sie, ob `.claude/settings.local.json` Folgendes enthält:

```json
{
  "permissions": [
    "Skill(superpowers:brainstorming)",
    "Skill(ui-ux-pro-max)"
  ]
}
```

::: info Vollständige Berechtigungskonfiguration
Dies ist eine minimale Berechtigungskonfiguration. Der Befehl `init` von Factory generiert automatisch eine vollständige Berechtigungskonfigurationsdatei (inklusive `Skill(superpowers:brainstorm)` und anderen notwendigen Berechtigungen), die normalerweise nicht manuell bearbeitet werden muss.

Falls Sie die Berechtigungskonfiguration neu generieren müssen, führen Sie im Projektstammverzeichnis aus:
```bash
factory init --force-permissions
```
:::

Siehe [Claude Code-Integrationsleitfaden](../claude-code/) zur Neugenerierung der Berechtigungskonfiguration.

### ❌ Fehler beim Hinzufügen des Marktplatzes

**Phänomen**: `claude plugin marketplace add` schlägt fehl mit Hinweis "not found" oder Netzwerkfehler.

**Lösung**:

1. Netzwerkverbindung prüfen
2. Claude CLI auf neueste Version aktualisieren: `npm update -g @anthropic-ai/claude-code`
3. Direkte Installation versuchen: Marktplatz-Hinzufügen überspringen und direkt `claude plugin install <Plugin-ID>` ausführen

### ❌ Plugin-Versionskonflikt

**Phänomen**: Ein Plugin mit gleichem Namen ist installiert, aber die Version ist falsch und führt zu Pipeline-Fehlern.

**Lösung**:

```bash
# Alte Version deinstallieren
claude plugin uninstall <Plugin-Name>

# Neu installieren
claude plugin install <Plugin-ID>
```

### ❌ Windows-Pfadprobleme

**Phänomen**: Bei der Ausführung von Skripten unter Windows wird "Befehl nicht gefunden" angezeigt.

**Lösung**:

Verwenden Sie Node.js zur direkten Ausführung der Installationsskripte:

```bash
node cli/scripts/check-and-install-superpowers.js
node cli/scripts/check-and-install-ui-skill.js
```

## Reaktion auf automatische Installationsfehler

Falls die automatische Installation während `factory init` fehlschlägt, können Sie:

1. **Fehlermeldung anzeigen**: Das Terminal zeigt die genaue Fehlerursache an
2. **Manuelle Installation**: Die beiden Plugins gemäß den obigen Schritten manuell installieren
3. **Neu ausführen**: `factory run` erkennt den Plugin-Status und fährt mit der Pipeline fort, falls installiert

::: warning Keine Auswirkung auf Pipeline-Start
Selbst wenn die Plugin-Installation fehlschlägt, wird `factory init` die Initialisierung abschließen. Sie können die Plugins später manuell installieren, ohne nachfolgende Operationen zu beeinträchtigen.
:::

## Rolle der Plugins in der Pipeline

### Bootstrap-Phase (superpowers erforderlich)

- **Skill-Aufruf**: `superpowers:brainstorm`
- **Ausgabe**: `input/idea.md` - Strukturiertes Produktideen-Dokument
- **Prüfpunkt**: Prüfen, ob der Agent explizit angibt, diesen Skill verwendet zu haben (`orchestrator.checkpoint.md:60-70`)

### UI-Phase (ui-ux-pro-max erforderlich)

- **Skill-Aufruf**: `ui-ux-pro-max`
- **Ausgabe**: `artifacts/ui/ui.schema.yaml` - UI-Schema mit Designsystem
- **Prüfpunkt**: Prüfen, ob die Designsystem-Konfiguration von diesem Skill stammt (`orchestrator.checkpoint.md:72-84`)

## Zusammenfassung

- Factory ist von zwei erforderlichen Plugins abhängig: `superpowers` und `ui-ux-pro-max`
- `factory init` versucht automatisch zu installieren, aber bei Fehlern ist manuelles Eingreifen erforderlich
- Plugin-Installationsprozess: Prüfen → Marktplatz hinzufügen → Installieren → Verifizieren
- Stellen Sie sicher, dass beide Plugins den Status `enabled` haben und die Berechtigungskonfiguration korrekt ist
- Die Bootstrap- und UI-Phasen der Pipeline prüfen zwingend die Verwendung dieser beiden Plugins

## Vorschau auf das nächste Tutorial

> Im nächsten Tutorial lernen Sie **[7-Phasen-Pipeline-Übersicht](../../start/pipeline-overview/)** kennen.
>
> Sie werden lernen:
> - Den vollständigen Ausführungsablauf der Pipeline
> - Eingaben, Ausgaben und Verantwortlichkeiten jeder Phase
> - Wie das Checkpoint-System Qualität sicherstellt
> - Wie Sie von einer fehlgeschlagenen Phase wiederherstellen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Aufklappen der Quellcode-Positionen</strong></summary>

> Aktualisiert am: 2026-01-29

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| Superpowers-Plugin-Prüfskript | [`cli/scripts/check-and-install-superpowers.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/scripts/check-and-install-superpowers.js) | 1-208 |
| UI/UX Pro Max-Plugin-Prüfskript | [`cli/scripts/check-and-install-ui-skill.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/scripts/check-and-install-ui-skill.js) | 1-209 |
| Automatische Plugin-Installationslogik | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 360-392 |
| Bootstrap-Phase Skill-Verifizierung | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 60-70 |
| UI-Phase Skill-Verifizierung | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 72-84 |

**Wichtige Konstanten**:
- `PLUGIN_NAME = 'superpowers'`: superpowers-Plugin-Name
- `PLUGIN_ID = 'superpowers@superpowers-marketplace'`: Vollständige superpowers-ID
- `PLUGIN_MARKETPLACE = 'obra/superpowers-marketplace'`: Plugin-Marktplatz-Repository
- `UI_PLUGIN_NAME = 'ui-ux-pro-max'`: UI-Plugin-Name
- `UI_PLUGIN_ID = 'ui-ux-pro-max@ui-ux-pro-max-skill'`: Vollständige UI-Plugin-ID
- `UI_PLUGIN_MARKETPLACE = 'nextlevelbuilder/ui-ux-pro-max-skill'`: UI-Plugin-Marktplatz-Repository

**Wichtige Funktionen**:
- `isPluginInstalled()`: Prüft, ob Plugin installiert ist (über `claude plugin list`-Ausgabe)
- `addToMarketplace()`: Fügt Plugin zum Marktplatz hinzu (`claude plugin marketplace add`)
- `installPlugin()`: Installiert Plugin (`claude plugin install`)
- `verifyPlugin()`: Verifiziert, dass Plugin installiert und aktiviert ist
- `main()`: Hauptfunktion, führt vollständigen Prüfen→Hinzufügen→Installieren→Verifizieren-Prozess aus

</details>

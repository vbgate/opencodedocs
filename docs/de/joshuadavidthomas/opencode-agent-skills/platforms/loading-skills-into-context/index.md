---
title: "Skill-Ladung: XML-Inhalt injizieren | opencode-agent-skills"
sidebarTitle: "KI kann Ihre Skills nutzen"
subtitle: "Skills in den Sitzungskontext laden"
description: "Beherrschen Sie das use_skill-Tool zum Laden von Skills in den Sitzungskontext. Verstehen Sie XML-Injektion und Synthetic Message Injection-Mechanismen, lernen Sie Skill-Metadatenverwaltung."
tags:
  - "Skill-Ladung"
  - "XML-Injektion"
  - "Kontextverwaltung"
prerequisite:
  - "start-creating-your-first-skill"
  - "platforms-listing-available-skills"
order: 3
---

# Skills in den Sitzungskontext laden

## Was Sie lernen können

- Verwenden Sie das Tool `use_skill`, um Skills in die aktuelle Sitzung zu laden
- Verstehen Sie, wie Skill-Inhalte im XML-Format in den Kontext injiziert werden
- Meistern Sie den Synthetic Message Injection-Mechanismus (synthetic-Nachrichteninjektion)
- Verstehen Sie die Skill-Metadatenstruktur (Quelle, Verzeichnis, Skripte, Dateien)
- Erfahren Sie, wie Skills nach einer Sitzungskomprimierung weiterhin verfügbar bleiben

## Ihr aktuelles Problem

Sie haben einen Skill erstellt, aber die KI scheint nicht auf seinen Inhalt zugreifen zu können. Oder in langen Gesprächen verschwinden die Skill-Anweisungen plötzlich und die KI vergisst die vorherigen Regeln. All dies hängt mit dem Skill-Lademechanismus zusammen.

## Wann Sie dies verwenden sollten

- **Manuelles Laden von Skills**: Wenn die automatische Empfehlung der KI nicht geeignet ist, geben Sie direkt den benötigten Skill an
- **Langes Gespräch beibehalten**: Stellen Sie sicher, dass Skill-Inhalte auch nach einer Kontextkomprimierung zugänglich bleiben
- **Claude Code-Kompatibilität**: Laden Sie Skills im Claude-Format, um Tool-Mappings zu erhalten
- **Präzise Kontrolle**: Laden Sie eine spezifische Version eines Skills (über Namespaces)

## Kernkonzept

Das Tool `use_skill` injiziert den SKILL.md-Inhalt eines Skills in den Sitzungskontext, sodass die KI den im Skill definierten Regeln und Workflows folgen kann.

### XML-Inhaltsinjektion

Skill-Inhalte werden in einem strukturierten XML-Format injiziert, das drei Teile umfasst:

```xml
<skill name="skill-name">
  <metadata>
    <source>Skillsourcen-Label</source>
    <directory>Skillsverzeichnispfad</directory>
    <scripts>
      <script>tools/script1.sh</script>
    </scripts>
    <files>
      <file>docs/guide.md</file>
    </files>
  </metadata>

  <tool-mapping>
    <!-- Claude Code-Tool-Mapping -->
  </tool-mapping>

  <content>
    Vollständiger Inhalt von SKILL.md
  </content>
</skill>
```

### Synthetic Message Injection

Das Plugin verwendet die Methode `session.prompt()` des OpenCode SDKs, um Skill-Inhalte zu injizieren, und setzt zwei wichtige Flags:

::: info Synthetic Message Injection
- `noReply: true` - Die KI antwortet nicht auf die Injektion selbst
- `synthetic: true` - Markiert die Nachricht als systemgeneriert (für Benutzer versteckt, zählt nicht als Benutzereingabe)
:::

Dies bedeutet:
- **Für Benutzer unsichtbar**: Skill-Injektion wird nicht im Gesprächsverlauf angezeigt
- **Verbraucht keine Eingabe**: Zählt nicht zur Benutzernachrichtenzählung
- **Dauerhaft verfügbar**: Auch nach einer Sitzungskomprimierung bleiben Skill-Inhalte im Kontext

### Sitzungslebenszyklus

1. **Bei der ersten Nachricht**: Das Plugin injiziert automatisch eine `<available-skills>`-Liste, die alle verfügbaren Skills anzeigt
2. **Verwendung von `use_skill`**: Injiziert den XML-Inhalt des ausgewählten Skills in den Kontext
3. **Nach Sitzungskomprimierung**: Das Plugin hört auf das Ereignis `session.compacted` und injiziert die Skill-Liste erneut

## Lassen Sie es uns zusammen tun
### Schritt 1: Einen grundlegenden Skill laden

Lassen Sie die KI in OpenCode einen Skill laden:

```
Benutzereingabe:
Lade den brainstorming-Skill

Systemantwort:
Skill "brainstorming" loaded.
```

**Was Sie sehen sollten**: Die KI gibt eine Erfolgsmeldung zurück, und der Skill-Inhalt wurde in den Kontext injiziert.

Jetzt können Sie testen, ob die KI den Skill-Regeln folgt:

```
Benutzereingabe:
Helfen Sie mir, eine Produktbeschreibung zu schreiben

Systemantwort:
(Die KI generiert Inhalte basierend auf den Regeln des brainstorming-Skills und folgt den Techniken und Prozessen darin)
```

### Schritt 2: Verfügbare Ressourcen nach dem Laden anzeigen

Beim Laden eines Skills gibt das System eine Liste der verfügbaren Skripte und Dateien zurück:

```
Benutzereingabe:
Lade git-helper

Systemantwort:
Skill "git-helper" loaded.
Available scripts: tools/branch.sh, tools/commit.sh
Available files: docs/usage.md, examples/workflow.md
```

Diese Informationen zeigen Ihnen, welche Ressourcen im Skill-Verzeichnis verfügbar sind:
- **Skripte**: Können mit dem Tool `run_skill_script` ausgeführt werden
- **Dateien**: Können mit dem Tool `read_skill_file` gelesen werden

**Was Sie sehen sollten**: Eine Erfolgsmeldung gefolgt von einer Liste der verfügbaren Skripte und Dateien.

### Schritt 3: Laden von Skills mit gleichem Namen über Namespaces

Angenommen, auf Projektebene und auf Benutzerebene gibt es beide einen `build-helper`-Skill:

```
Benutzereingabe:
Lade build-helper

Systemantwort:
Skill "build-helper" loaded.
Available scripts: build.sh, optimize.sh

Benutzereingabe:
(Überprüfen, welche Version von build-helper geladen wurde)
```

Basierend auf der Skill-Entdeckungspriorität wird standardmäßig der Skill auf Projektebene geladen. Wenn Sie den auf Benutzerebene benötigen:

```
Benutzereingabe:
Lade user:build-helper

Systemantwort:
Skill "build-helper" loaded.
Available scripts: ci.sh, test.sh
Available files: README.md
```

**Was Sie sehen sollten**: Laden von Skills mit gleichem Namen aus verschiedenen Quellen im Format `namespace:skill-name`.

### Schritt 4: Die Wirkung der Skill-Anleitung erleben

Nach dem Laden eines Skills sollte das Verhalten der KI den im Skill definierten Regeln folgen. Am Beispiel des brainstorming-Skills:

```
Benutzereingabe:
Lade brainstorming
Helfen Sie mir, die Hauptverkaufsargumente eines Smart-Home-Produkts zu entwickeln

Systemantwort:
(Die KI verwendet die im brainstorming-Skill definierten Techniken, wie:
- Zuerst mögliche Richtungen auflisten, dann vertiefend erkunden
- Vermeiden Sie zu frühes Beurteilen von Ideen
- Verwenden Sie "Ja, und..."-Technik, um Gedanken zu erweitern
- Alle Ideen aufzeichnen, dann auswählen)

Lassen Sie uns zuerst mögliche Richtungen auflisten:
1. Bequeme Steuerung
2. Energiemanagement
3. Sicherheitsfunktionen
...
```

**Was Sie sehen sollten**: Der Antwortstil und Prozess der KI ist konsistent mit den im Skill definierten Vorgaben.

### Schritt 5: Die Persistenz von Skills in langen Gesprächen verstehen

Führen Sie ein langes Gespräch und beobachten Sie, ob der Skill wirksam bleibt:

```
Benutzereingabe:
Lade docker-helper
(Führen Sie mehrere Gesprächsrunden, die Build- und Bereitstellungsoperationen umfassen)
...
(Angenommen, das Gespräch ist sehr lang und hat die Kontextkomprimierung von OpenCode ausgelöst)
Benutzereingabe:
Fahren Sie mit der vorherigen Docker-Bereitstellung fort

Systemantwort:
(Die KI kann weiterhin auf den Inhalt von docker-helper zugreifen,
da das Plugin die Skill-Liste nach der Komprimierung erneut injiziert hat)
```

::: tip Komprimierungswiederherstellungsmechanismus
Das Plugin hört auf das Ereignis `session.compacted` und injiziert die Skill-Liste erneut, wenn die Sitzung komprimiert wird, um sicherzustellen, dass bereits geladene Skills nach der Komprimierung noch zugänglich sind.
:::

**Was Sie sehen sollten**: Auch wenn das Gespräch lang ist und der Kontext komprimiert wurde, kann die KI weiterhin auf Skill-Inhalte zugreifen.

### Schritt 6: Laden von Skills im Claude Code-Format

Wenn Sie Claude Code-Skills haben, werden sie automatisch entdeckt:

```
Benutzereingabe:
Liste alle verfügbaren Skills auf

Systemantwort:
...
claude-code-superpowers (claude-plugins)
  Vollständiger Softwareentwicklungs-Workflow

Benutzereingabe:
Lade claude-code-superpowers

Systemantwort:
Skill "claude-code-superpowers" loaded.
```

Beim Laden von Skills im Claude-Format wird automatisch eine Tool-Mapping (toolTranslation) injiziert, die Claude-Toolnamen auf OpenCode-Tools mapped:

::: info Tool-Mapping-Beispiel
- Claudes `TodoWrite` → OpenCodes `todowrite`
- Claudes `Task` → OpenCodes `task` (Unter-Agent)
- Claudes `Bash` → OpenCodes `bash`
:::

**Was Sie sehen sollten**: Skill erfolgreich geladen, die KI kann Workflows im Claude-Format verstehen und verwenden.
## Kontrollpunkte ✅

- [ ] Können Sie das Tool `use_skill` verwenden, um Skills zu laden?
- [ ] Können Sie den Mechanismus verstehen, bei dem Skill-Inhalte im XML-Format injiziert werden?
- [ ] Können Sie die beiden wichtigsten Flags für synthetic-Nachrichten nennen?
- [ ] Können Sie erklären, warum Skills auch nach einer Sitzungskomprimierung noch verfügbar sind?
- [ ] Können Sie über Namespaces unterschiedliche Versionen von Skills mit gleichem Namen laden?

## Warnung vor häufigen Fehlern

### Falle 1: Tippfehler im Skill-Namen

Wenn Sie einen falschen Skill-Namen eingeben:

```
Benutzereingabe:
Lade brainstormig

Systemantwort:
Skill "brainstormig" not found. Did you mean "brainstorming"?
```

Das Plugin bietet Fuzzy-Matching-Vorschläge basierend auf der Editierdistanz.

**Lösung**: Überprüfen Sie die Schreibweise oder verwenden Sie `get_available_skills`, um die korrekten Namen anzuzeigen.

### Falle 2: Verwechslung von Skills mit gleichem Namen

Wenn auf Projektebene und auf Benutzerebene Skills mit gleichem Namen existieren, könnten Sie die falsche Version laden:

```
Benutzereingabe:
Lade build-helper

Systemantwort:
Skill "build-helper" loaded.
Available scripts: build.sh, optimize.sh  # Dies ist der auf Projektebene

Der Benutzer erwartet den auf Benutzerebene, aber standardmäßig wird der auf Projektebene geladen
```

**Lösung**: Verwenden Sie Namespaces zur expliziten Angabe, z. B. `user:build-helper`.

### Falle 3: Skill-Inhalt hat keine Wirkung

Manchmal haben Sie einen Skill geladen, aber die KI scheint den Regeln nicht zu folgen:

```
Benutzereingabe:
Lade my-conventions
(Erwarten Sie, dass die KI den Codierungsstandards folgt)
Benutzereingabe:
Schreiben Sie eine Funktion

Systemantwort:
(Der von der KI geschriebene Code entspricht nicht den erwarteten Standards)
```

**Mögliche Ursachen**:
- Der Inhalt des SKILL.md des Skills ist nicht klar genug
- Die Skill-Beschreibung ist nicht detailliert genug, die KI hat ein Missverständnis
- In langen Gesprächen wurde der Kontext komprimiert, die Skill-Liste muss erneut injiziert werden

**Lösung**:
- Überprüfen Sie, ob das Frontmatter und der Inhalt des Skills klar sind
- Weisen Sie die KI explizit an, spezifische Regeln zu verwenden: "Bitte verwenden Sie die Regeln im my-conventions-Skill"
- Laden Sie den Skill nach der Komprimierung erneut

### Falle 4: Tool-Mapping-Probleme bei Claude-Skills

Nach dem Laden eines Claude Code-Skills könnte die KI weiterhin falsche Toolnamen verwenden:

```
Benutzereingabe:
Lade claude-code-superpowers
Verwenden Sie das TodoWrite-Tool

Systemantwort:
(Die KI könnte versuchen, den falschen Toolnamen zu verwenden, da er nicht korrekt gemappt wurde)
```

**Ursache**: Beim Laden des Skills wird automatisch eine Tool-Mapping injiziert, aber die KI könnte eine explizite Erinnerung benötigen.

**Lösung**: Weisen Sie nach dem Laden des Skills die KI explizit an, die gemappten Tools zu verwenden:

```
Benutzereingabe:
Lade claude-code-superpowers
Beachten Sie, das todowrite-Tool zu verwenden (nicht TodoWrite)
```
## Zusammenfassung dieser Lektion

Das Tool `use_skill` injiziert Skill-Inhalte im XML-Format in den Sitzungskontext und实现通过 Synthetic Message Injection-Mechanismus:

- **XML-strukturierte Injektion**: Enthält Metadaten, Tool-Mappings und Skill-Inhalte
- **Synthetic-Nachrichten**: `noReply: true` und `synthetic: true` stellen sicher, dass Nachrichten für Benutzer versteckt sind
- **Dauerhaft verfügbar**: Auch nach Kontextkomprimierung sind Skill-Inhalte noch zugänglich
- **Namespace-Unterstützung**: Das Format `namespace:skill-name` gibt die Skill-Quelle präzise an
- **Claude-Kompatibilität**: Automatische Injektion von Tool-Mappings, unterstützt Claude Code-Skills

Das Laden von Skills ist ein Schlüsselmechanismus, damit die KI spezifischen Workflows und Regeln folgt. Durch die Inhaltsinjektion kann die KI während des gesamten Gesprächs einen konsistenten Verhaltensstil beibehalten.

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Automatische Skill-Empfehlung: Prinzipien der semantischen Übereinstimmung](../automatic-skill-matching/)**.
>
> Sie werden lernen:
> - Verstehen, wie das Plugin basierend auf semantischer Ähnlichkeit automatisch relevante Skills empfiehlt
> - Meistern Sie die grundlegenden Prinzipien von Embedding-Modellen und Kosinus-Ähnlichkeitsberechnung
> - Erfahren Sie Techniken zur Optimierung von Skill-Beschreibungen für bessere Empfehlungsergebnisse
> - Verstehen Sie, wie der Embedding-Cache-Mechanismus die Leistung verbessert

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-24

| Funktion        | Dateipfad                                                                                    | Zeilennummer    |
|--- | --- | ---|
| UseSkill-Tool-Definition | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L200-L267)         | 200-267 |
| injectSyntheticContent-Funktion | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L147-L162)    | 147-162 |
| injectSkillsList-Funktion | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L345-L370) | 345-370 |
| resolveSkill-Funktion | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |
| listSkillFiles-Funktion | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L289-L316) | 289-316 |

**Wichtige Konstanten**:
- Keine

**Wichtige Funktionen**:
- `UseSkill()`: Akzeptiert den Parameter `skill`, baut Skill-Inhalte im XML-Format und injiziert sie in die Sitzung
- `injectSyntheticContent(client, sessionID, text, context)`: Injiziert synthetic-Nachrichten über `client.session.prompt()`, setzt `noReply: true` und `synthetic: true`
- `injectSkillsList()`: Injiziert die `<available-skills>`-Liste bei der ersten Nachricht
- `resolveSkill(skillName: string, skillsByName: Map<string, Skill>)`: Unterstützt Skill-Parsing im Format `namespace:skill-name`
- `listSkillFiles(skillPath: string, maxDepth: number)`: Listet rekursiv alle Dateien im Skill-Verzeichnis auf (SKILL.md ausgeschlossen)

**Geschäftsregeln**:
- Skill-Inhalte werden im XML-Format injiziert, inklusive Metadaten, Tool-Mappings und Inhalten (`tools.ts:238-249`)
- Injizierte Nachrichten sind als synthetic markiert und zählen nicht zur Benutzereingabe (`utils.ts:159`)
- Bereits geladene Skills werden in der aktuellen Sitzung nicht mehr empfohlen (`plugin.ts:128-132`)
- Die Skill-Liste wird bei der ersten Nachricht automatisch injiziert (`plugin.ts:70-105`)
- Nach Sitzungskomprimierung wird die Skill-Liste erneut injiziert (`plugin.ts:145-151`)

**XML-Inhaltsformat**:
```xml
<skill name="${skill.name}">
  <metadata>
    <source>${skill.label}</source>
    <directory>${skill.path}</directory>
    <scripts>
      <script>${script.relativePath}</script>
    </scripts>
    <files>
      <file>${file}</file>
    </files>
  </metadata>

  ${toolTranslation}

  <content>
  ${skill.template}
  </content>
</skill>
```

</details>

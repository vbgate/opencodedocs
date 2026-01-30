---
title: "Skill-Dateien lesen: Zugriff auf Ressourcen | opencode-agent-skills"
subtitle: "Skill-Dateien lesen: Zugriff auf Ressourcen | opencode-agent-skills"
sidebarTitle: "Zugriff auf Skill-Ressourcen"
description: "Lernen Sie, wie Sie Skill-Dateien lesen. Verstehen Sie Pfadsicherheitsprüfungen und XML-Injektionsmechanismen für den sicheren Zugriff auf Dokumente und Konfigurationen im Skill-Verzeichnis."
tags:
  - "Skill-Dateien"
  - "Tool-Nutzung"
  - "Pfadsicherheit"
prerequisite:
  - "start-installation"
  - "platforms-listing-available-skills"
order: 6
---

# Skill-Dateien lesen

## Was Sie danach können

- Verwenden Sie das `read_skill_file`-Tool, um Dokumente, Konfigurationen und Beispieldateien im Skill-Verzeichnis zu lesen
- Verstehen Sie Pfadsicherheitsmechanismen zur Verhinderung von Directory-Traversal-Angriffen
- Beherrschen Sie die XML-basierte Dateiinhaltsinjektion
- Behandeln Sie Fehlermeldungen bei nicht existierenden Dateien und verfügbare Dateilisten

## Ihre aktuelle Situation

Die SKILL.md eines Skills enthält nur die Kernanleitung, aber viele Skills bieten begleitende Dokumentation, Konfigurationsbeispiele, Nutzungsanleitungen und andere Unterstützungsdateien. Sie möchten auf diese Dateien zugreifen, um detailliertere Informationen zu erhalten, wissen aber nicht, wie Sie Dateien im Skill-Verzeichnis sicher lesen können.

## Wann Sie diese Funktion nutzen

- **Detaillierte Dokumentation anzeigen**: Das `docs/`-Verzeichnis eines Skills enthält detaillierte Nutzungsanleitungen
- **Konfigurationsbeispiele**: Sie müssen Beispielkonfigurationsdateien im `config/`-Verzeichnis referenzieren
- **Code-Beispiele**: Das `examples/`-Verzeichnis eines Skills enthält Code-Beispiele
- **Debugging-Unterstützung**: Anzeigen der README oder anderer Erklärungsdateien eines Skills
- **Ressourcenstruktur verstehen**: Erkunden, welche Dateien im Skill-Verzeichnis verfügbar sind

## Kernkonzept

Das `read_skill_file`-Tool ermöglicht den sicheren Zugriff auf Unterstützungsdateien im Skill-Verzeichnis. Es garantiert Sicherheit und Verfügbarkeit durch folgende Mechanismen:

::: info Sicherheitsmechanismus
Das Plugin überprüft Dateipfade streng, um Directory-Traversal-Angriffe zu verhindern:
- Verwendung von `..` zum Zugriff auf Dateien außerhalb des Skill-Verzeichnisses ist untersagt
- Absolute Pfade sind untersagt
- Nur Dateien im Skill-Verzeichnis und seinen Unterverzeichnissen sind zugänglich
:::

Tool-Ausführungsablauf:
1. Überprüfung, ob der Skill-Name existiert (Namespaces werden unterstützt)
2. Überprüfung, ob der angeforderte Dateipfad sicher ist
3. Lesen des Dateiinhalts
4. Verpacken und Injizieren in den Sitzungskontext im XML-Format
5. Rückgabe einer Bestätigungsmeldung über erfolgreiches Laden

::: tip Dateiinhalt-Persistenz
Dateiinhalte werden mit den Flags `synthetic: true` und `noReply: true` injiziert, was bedeutet:
- Der Dateiinhalt wird Teil des Sitzungskontexts
- Selbst wenn die Sitzung komprimiert wird, bleibt der Inhalt zugänglich
- Die Injektion löst keine direkte KI-Antwort aus
:::

## Schritt-für-Schritt-Anleitung

### Schritt 1: Skill-Dokumentation lesen

Angenommen, es gibt detaillierte Nutzungsdokumentation im Skill-Verzeichnis:

```
Benutzereingabe:
Lese die Dokumentation von git-helper

Systemaufruf:
read_skill_file(skill="git-helper", filename="docs/usage-guide.md")

Systemantwort:
File "docs/usage-guide.md" from skill "git-helper" loaded.
```

Der Dateiinhalt wird im XML-Format in den Sitzungskontext injiziert:

```xml
<skill-file skill="git-helper" file="docs/usage-guide.md">
  <metadata>
    <directory>/path/to/project/.opencode/skills/git-helper</directory>
  </metadata>

  <content>
# Git Helper Nutzungsanleitung

Dieser Skill bietet Anleitungen zur Git-Branch-Verwaltung, Commit-Konventionen und Kollaborations-Workflows...

[Dokumentation wird fortgesetzt]
  </content>
</skill-file>
```

**Sie sollten sehen**: Eine Meldung über erfolgreiches Laden, der Dateiinhalt wurde in den Sitzungskontext injiziert.

### Schritt 2: Konfigurationsbeispiele lesen

Beispielkonfigurationen eines Skills anzeigen:

```
Benutzereingabe:
Zeige Konfigurationsbeispiele von docker-helper

Systemaufruf:
read_skill_file(skill="docker-helper", filename="config/docker-compose.yml.example")

Systemantwort:
File "config/docker-compose.yml.example" from skill "docker-helper" loaded.
```

**Sie sollten sehen**: Der Konfigurationsdateiinhalt wurde injiziert, die KI kann das Beispiel als Referenz verwenden, um tatsächliche Konfigurationen für Sie zu generieren.

### Schritt 3: Dateien mit Namespace lesen

Wenn projekt- und benutzerebene Skills denselben Namen haben:

```
Benutzereingabe:
Lese das Build-Skript von project:build-helper

Systemaufruf:
read_skill_file(skill="project:build-helper", filename="scripts/build.sh")

Systemantwort:
File "scripts/build.sh" from skill "build-helper" loaded.
```

**Sie sollten sehen**: Die Skill-Quelle wurde durch den Namespace eindeutig spezifiziert.

### Schritt 4: Umgang mit nicht existierenden Dateien

Wenn Sie versuchen, eine nicht existierende Datei zu lesen:

```
Benutzereingabe:
Lese api-docs.md von git-helper

Systemaufruf:
read_skill_file(skill="git-helper", filename="api-docs.md")

Systemantwort:
File "api-docs.md" not found. Available files: docs/usage-guide.md, examples/branch-flow.md, README.md, SKILL.md
```

Das Tool listet alle verfügbaren Dateien im Skill-Verzeichnis auf, um Ihnen zu helfen, den richtigen Dateinamen zu finden.

**Sie sollten sehen**: Fehlermeldung und Liste der verfügbaren Dateien.

### Schritt 5: Pfadsicherheitsschutz erleben

Versuchen Sie, auf Dateien außerhalb des Skill-Verzeichnisses zuzugreifen:

```
Benutzereingabe:
Lese Dateien im übergeordneten Verzeichnis von git-helper

Systemaufruf:
read_skill_file(skill="git-helper", filename="../secrets.txt")

Systemantwort:
Invalid path: cannot access files outside skill directory.
```

Das Tool lehnt alle Anfragen ab, die auf Dateien außerhalb des Skill-Verzeichnisses zuzugreifen versuchen.

**Sie sollten sehen**: Fehlermeldung zur Pfadsicherheit.

## Checkliste ✅

- [ ] Können Sie `read_skill_file` verwenden, um Skill-Dateien zu lesen?
- [ ] Verstehen Sie die Funktion des Pfadsicherheitsmechanismus?
- [ ] Können Sie das XML-Format der Dateiinhaltsinjektion erkennen?
- [ ] Können Sie die Liste der verfügbaren Dateien aus Fehlermeldungen entnehmen?
- [ ] Können Sie Skills präzise mit Namespaces lokalisieren?

## Warnhinweise

### Warnung 1: Falscher Dateipfad

Wenn Sie vergessen, dass sich die Datei in einem Unterverzeichnis befindet:

```
Benutzereingabe:
Lese usage-guide.md von git-helper

Systemantwort:
File "usage-guide.md" not found. Available files: docs/usage-guide.md, examples/branch-flow.md, README.md
```

**Ursache**: Die Datei befindet sich möglicherweise in einem Unterverzeichnis und erfordert einen relativen Pfad.

**Lösung**: Verwenden Sie den vollständigen Pfad, z.B. `docs/usage-guide.md`.

### Warnung 2: Namespace-Konflikte ignorieren

Wenn Skills mit demselben Namen in mehreren Namespaces existieren:

```
Benutzereingabe:
Lese README von build-helper

Systemantwort:
File "README.md" from skill "build-helper" loaded.
```

Möglicherweise lesen Sie den projektebenen Skill, erwarten aber den benutzerebenen Skill.

**Lösung**: Verwenden Sie den Namespace zur eindeutigen Spezifikation, z.B. `read_skill_file(skill="user:build-helper", filename="README.md")`.

### Warnung 3: Directory-Traversal-Versuche

Versuch, `..` zu verwenden, um auf übergeordnete Verzeichnisse zuzugreifen:

```
Benutzereingabe:
Lese Dateien außerhalb des Skill-Verzeichnisses

Systemaufruf:
read_skill_file(skill="my-skill", filename="../../../etc/passwd")

Systemantwort:
Invalid path: cannot access files outside skill directory.
```

**Ursache**: Dies ist eine Sicherheitsbeschränkung zur Verhinderung von Directory-Traversal-Angriffen.

**Lösung**: Nur Dateien im Skill-Verzeichnis sind zugänglich. Für andere Dateien lassen Sie die KI direkt das `Read`-Tool verwenden.

### Warnung 4: Datei bereits im Sitzungskontext

Wenn Sie den Skill bereits geladen haben, befindet sich der Dateiinhalt möglicherweise bereits in der SKILL.md des Skills oder anderen injizierten Inhalten:

```
Benutzereingabe:
Lese die Kerndokumentation des Skills

Systemaufruf:
read_skill_file(skill="my-skill", filename="core-guide.md")
```

Dies ist möglicherweise unnötig, da sich der Kerninhalt normalerweise in der SKILL.md befindet.

**Lösung**: Überprüfen Sie zuerst den bereits geladenen Skill-Inhalt, um zu bestätigen, ob zusätzliche Dateien benötigt werden.

## Lektionszusammenfassung

Das `read_skill_file`-Tool ermöglicht den sicheren Zugriff auf Unterstützungsdateien im Skill-Verzeichnis:

- **Sichere Pfadüberprüfung**: Verhindert Directory-Traversal, erlaubt nur Zugriff auf Dateien im Skill-Verzeichnis
- **XML-Injektionsmechanismus**: Dateiinhalte werden in `<skill-file>`-XML-Tags verpackt, enthalten Metadaten
- **Benutzerfreundliche Fehler**: Listet verfügbare Dateien auf, wenn Dateien nicht existieren, hilft beim Finden des richtigen Pfads
- **Namespace-Unterstützung**: Ermöglicht präzise Lokalisierung von Skills mit `namespace:skill-name` bei Namensgleichheit
- **Kontext-Persistenz**: Durch das Flag `synthetic: true` bleiben Dateiinhalte auch nach Sitzungskomprimierung zugänglich

Dieses Tool ist ideal zum Lesen von:
- Detaillierten Dokumentationen (`docs/`-Verzeichnis)
- Konfigurationsbeispielen (`config/`-Verzeichnis)
- Code-Beispielen (`examples/`-Verzeichnis)
- README- und Erklärungsdateien
- Skriptquellcode (wenn Implementationsdetails betrachtet werden müssen)

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Claude Code Skill-Kompatibilität](../../advanced/claude-code-compatibility/)** kennen.
>
> Sie werden lernen:
> - Wie das Plugin mit dem Skill- und Plugin-System von Claude Code kompatibel ist
> - Das Tool-Mapping-Mechanismus (Konvertierung von Claude Code-Tools zu OpenCode-Tools)
> - Wie Skills von Claude Code-Installationsorten erkannt werden

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um Quellcode-Standorte anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-24

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| ReadSkillFile Tool-Definition | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L74-L135) | 74-135 |
| Pfadsicherheitsprüfung | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L130-L133) | 130-133 |
| Skill-Dateien auflisten | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L289-L316) | 289-316 |
| resolveSkill Funktion | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |
| injectSyntheticContent Funktion | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L147-L162) | 147-162 |

**Wichtige Typen**:
- `Skill`: Skill-Metadaten-Interface (`skills.ts:43-52`)
- `OpencodeClient`: OpenCode SDK Client-Typ (`utils.ts:140`)
- `SessionContext`: Sitzungskontext, enthält model- und agent-Informationen (`utils.ts:142-145`)

**Wichtige Funktionen**:
- `ReadSkillFile(directory: string, client: OpencodeClient)`: Gibt Tool-Definition zurück, verarbeitet Skill-Datei-Lesevorgänge
- `isPathSafe(basePath: string, requestedPath: string): boolean`: Überprüft, ob Pfad im Basisverzeichnis liegt, verhindert Directory-Traversal
- `listSkillFiles(skillPath: string, maxDepth: number = 3): Promise<string[]>`: Listet alle Dateien im Skill-Verzeichnis auf (exklusive SKILL.md)
- `resolveSkill(skillName: string, skillsByName: Map<string, Skill>): Skill | null`: Unterstützt `namespace:skill-name`-Format für Skill-Auflösung
- `injectSyntheticContent(client, sessionID, text, context)`: Injiziert Inhalt in Sitzung durch `noReply: true` und `synthetic: true`

**Geschäftsregeln**:
- Pfadsicherheitsprüfung verwendet `path.resolve()` zur Validierung, stellt sicher, dass aufgelöster Pfad mit Basisverzeichnis beginnt (`utils.ts:131-132`)
- Bei nicht existierenden Dateien wird `fs.readdir()` versucht, um verfügbare Dateien aufzulisten und benutzerfreundliche Fehlermeldungen zu liefern (`tools.ts:126-131`)
- Dateiinhalte werden im XML-Format verpackt, enthalten `skill`-, `file`-Attribute und `<metadata>`-, `<content>`-Tags (`tools.ts:111-119`)
- Bei Injektion werden aktuelle model- und agent-Kontexte der Sitzung abgerufen, um sicherzustellen, dass Inhalt in den richtigen Kontext injiziert wird (`tools.ts:121-122`)

**Sicherheitsmechanismen**:
- Directory-Traversal-Schutz: `isPathSafe()` prüft, ob Pfad im Basisverzeichnis liegt (`utils.ts:130-133`)
- Bei nicht existierenden Skills werden Fuzzy-Matching-Vorschläge bereitgestellt (`tools.ts:90-95`)
- Bei nicht existierenden Dateien werden verfügbare Dateien aufgelistet, um Benutzern beim Finden des richtigen Pfads zu helfen (`tools.ts:126-131`)

</details>

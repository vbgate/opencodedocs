---
title: "Sicherheitsschutz: Pfadtraversierung und symbolische Links | OpenSkills"
sidebarTitle: "Pfadtraversierung verhindern"
subtitle: "Sicherheitsschutz: Pfadtraversierung und symbolische Links | OpenSkills"
description: "Lernen Sie den dreischichtigen Sicherheitsmechanismus von OpenSkills kennen. Verstehen Sie den Pfadtraversierungsschutz, die sichere Verarbeitung symbolischer Links und die YAML-Parsersicherheit, um die Sicherheit bei der Installation und Nutzung von Skills zu gewährleisten."
tags:
  - "Sicherheit"
  - "Pfadtraversierung"
  - "Symbolische Links"
  - "YAML"
prerequisite:
  - "advanced-ci-integration"
order: 7
---

# OpenSkills-Sicherheitshinweise

## Was Sie lernen werden

- Den dreischichtigen Sicherheitsmechanismus von OpenSkills verstehen
- Das Prinzip und die Schutzmethoden gegen Pfadtraversierungsangriffe verstehen
- Die sichere Verarbeitungsmethode für symbolische Links beherrschen
- Die ReDoS-Risiken und Schutzmaßnahmen beim YAML-Parsing erkennen

## Ihre aktuelle Situation

Sie haben wahrscheinlich gehört, dass "lokale Ausführung sicherer" ist, kennen aber nicht die konkreten Sicherheitsmaßnahmen. Oder Sie haben sich bei der Installation von Skills folgende Sorgen gemacht:
- Werden Dateien in Systemverzeichnisse geschrieben?
- Stellen symbolische Links ein Sicherheitsrisiko dar?
- Gibt es Sicherheitslücken beim Parsen von YAML in SKILL.md?

## Wann Sie diese Methode verwenden sollten

Wenn Sie müssen:
- OpenSkills in einer Unternehmensumgebung bereitstellen
- Die Sicherheit von OpenSkills auditieren
- Eine Skill-Lösung aus Sicherheitsperspektive bewerten
- Eine technische Überprüfung durch das Sicherheitsteam durchlaufen

## Kernkonzept

Das Sicherheitsdesign von OpenSkills folgt drei Prinzipien:

::: info Dreischichtiger Sicherheitsmechanismus
1. **Eingabevalidierung** - Alle externen Eingaben überprüfen (Pfade, URLs, YAML)
2. **Isolierte Ausführung** - Sicherstellen, dass Operationen im erwarteten Verzeichnis erfolgen
3. **Sicheres Parsen** - Parser-Sicherheitslücken verhindern (ReDoS)
:::

Lokale Ausführung + Kein Datenupload + Eingabevalidierung + Pfadisolierung = Sicheres Skill-Management

## Schutz vor Pfadtraversierung

### Was ist ein Pfadtraversierungsangriff

Ein **Pfadtraversierungsangriff (Path Traversal)** ist ein Angriff, bei dem der Angreifer durch die Verwendung von Sequenzen wie `../` auf Dateien außerhalb des erwarteten Verzeichnisses zugreift.

**Beispiel**: Ohne Schutz könnte ein Angreifer versuchen:
```bash
# Versucht, in ein Systemverzeichnis zu installieren
openskills install malicious/skill --target ../../../etc/

# Versucht, Konfigurationsdateien zu überschreiben
openskills install malicious/skill --target ../../../../.ssh/
```

### Schutzmechanismus von OpenSkills

OpenSkills verwendet die Funktion `isPathInside`, um zu überprüfen, ob der Installationspfad innerhalb des Zielverzeichnisses liegt.

**Quellcode-Position**: [`src/commands/install.ts:71-78`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L71-L78)

```typescript
function isPathInside(targetPath: string, targetDir: string): boolean {
  const resolvedTargetPath = resolve(targetPath);
  const resolvedTargetDir = resolve(targetDir);
  const resolvedTargetDirWithSep = resolvedTargetDir.endsWith(sep)
    ? resolvedTargetDir
    : resolvedTargetDir + sep;
  return resolvedTargetPath.startsWith(resolvedTargetDirWithSep);
}
```

**Funktionsweise**:
1. `resolve()` aufrufen, um alle relativen Pfade in absolute Pfade aufzulösen
2. Zielverzeichnis normalisieren und sicherstellen, dass es mit einem Pfadtrennzeichen endet
3. Überprüfen, ob der Zielpfad mit dem Zielverzeichnis beginnt

**Überprüfung bei der Installation** ([`src/commands/install.ts:257-260`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L257-L260)):
```typescript
if (!isPathInside(targetPath, targetDir)) {
  console.error(chalk.red('Security error: Installation path outside target directory'));
  process.exit(1);
}
```

### Schutzwirksamkeit verifizieren

**Testszenario**: Versuchen, einen Pfadtraversierungsangriff durchzuführen

```bash
# Normale Installation (erfolgreich)
openskills install anthropics/skills

# Versuch, ../ zu verwenden (scheitert)
openskills install malicious/skill --target ../../../etc/
# Security error: Installation path outside target directory
```

**Sie sollten sehen**: Jeder Installationsversuch, der das Zielverzeichnis verlässt, wird abgelehnt und zeigt einen Sicherheitsfehler an.

## Sicherheit symbolischer Links

### Risiken symbolischer Links

Ein **symbolischer Link (Symlink)** ist eine Verknüpfung zu einer anderen Datei oder einem anderen Verzeichnis. Unsachgemäße Verarbeitung kann zu Folgendem führen:

1. **Informationsleck** - Ein Angreifer erstellt einen symbolischen Link, der auf sensible Dateien verweist
2. **Dateiüberschreibung** - Ein symbolischer Link verweist auf eine Systemdatei und wird vom Installationsvorgang überschrieben
3. **Zirkelreferenz** - Ein symbolischer Link verweist auf sich selbst, führt zu unendlicher Rekursion

### Dereferenzierung bei der Installation

OpenSkills verwendet `dereference: true`, um symbolische Links zu dereferenzieren und direkt die Zieldateien zu kopieren.

**Quellcode-Position**: [`src/commands/install.ts:262`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L262)

```typescript
cpSync(skillDir, targetPath, { recursive: true, dereference: true });
```

**Wirkung**:
- Symbolische Links werden durch tatsächliche Dateien ersetzt
- Der symbolische Link selbst wird nicht kopiert
- Verhindert, dass Dateien, auf die der symbolische Link verweist, überschrieben werden

### Überprüfung symbolischer Links bei der Skill-Suche

OpenSkills unterstützt Skills in Form von symbolischen Links, überprüft aber, ob sie beschädigt sind.

**Quellcode-Position**: [`src/utils/skills.ts:10-25`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L10-L25)

```typescript
function isDirectoryOrSymlinkToDirectory(entry: Dirent, parentDir: string): boolean {
  if (entry.isDirectory()) {
    return true;
  }
  if (entry.isSymbolicLink()) {
    try {
      const fullPath = join(parentDir, entry.name);
      const stats = statSync(fullPath); // statSync folgt Symlinks
      return stats.isDirectory();
    } catch {
      // Beschädigter Symlink oder Berechtigungsfehler
      return false;
    }
  }
  return false;
}
```

**Sicherheitsmerkmale**:
- `statSync()` aufrufen, um dem symbolischen Link zum Ziel zu folgen
- Beschädigte symbolische Links werden übersprungen (`catch`-Block)
- Kein Absturz, stille Verarbeitung

::: tip Anwendungsfall
Die Unterstützung symbolischer Links ermöglicht es Ihnen:
- Skills direkt aus einem git-Repository zu nutzen (ohne Kopieren)
- Synchronisierte Änderungen während der lokalen Entwicklung vorzunehmen
- Skills in mehreren Projekten gemeinsam zu nutzen
:::

## Sicherheit beim YAML-Parsing

### ReDoS-Risiko

**Regulärer Ausdruck Denial of Service (ReDoS)** bezeichnet eine exponentielle Matching-Zeit regulärer Ausdrücke durch böswillig konstruierte Eingabe, was CPU-Ressourcen verbraucht.

OpenSkills muss den YAML-Frontmatter von SKILL.md parsen:
```yaml
---
name: skill-name
description: Skill description
---
```

### Schutz durch nicht-gierige reguläre Ausdrücke

OpenSkills verwendet nicht-gierige reguläre Ausdrücke, um ReDoS zu vermeiden.

**Quellcode-Position**: [`src/utils/yaml.ts:4`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts#L4)

```typescript
export function extractYamlField(content: string, field: string): string {
  const match = content.match(new RegExp(`^${field}:\\s*(.+?)$`, 'm'));
  return match ? match[1].trim() : '';
}
```

**Schlüsselfaktoren**:
- `+?` ist ein **nicht-gieriger** Quantifizierer, der die kürzestmögliche Übereinstimmung erfasst
- `^` und `$` sperren den Zeilenanfang und das Zeilenende
- Passt nur auf eine einzelne Zeile, vermeidet komplexe Verschachtelung

**Falsches Beispiel (gieriges Matching)**:
```typescript
// ❌ Gefährlich: + ist gierig, kann zu Backtracking-Explosion führen
new RegExp(`^${field}:\\s*(.+)$`, 'm')
```

**Richtiges Beispiel (nicht-gieriges Matching)**:
```typescript
// ✅ Sicher: +? ist nicht-gierig, stoppt beim ersten Zeilenumbruch
new RegExp(`^${field}:\\s*(.+?)$`, 'm')
```

## Dateiberechtigungen und Quellcode-Verifikation

### Vererbung von Systemberechtigungen

OpenSkills verwaltet keine Dateiberechtigungen direkt, sondern übernimmt die Berechtigungskontrolle des Betriebssystems:

- Dateibesitzer sind mit dem Benutzer identisch, der OpenSkills ausführt
- Verzeichnisberechtigungen folgen den System-umask-Einstellungen
- Berechtigungsverwaltung wird einheitlich durch das Dateisystem gesteuert

### Quellcode-Verifikation für private Repositories

Bei der Installation aus einem privaten git-Repository verlässt sich OpenSkills auf die SSH-Schlüssel-Verifikation von git.

**Quellcode-Position**: [`src/commands/install.ts:167`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L167)

::: tip Empfehlung
Stellen Sie sicher, dass Ihr SSH-Schlüssel korrekt konfiguriert ist und zur Liste der autorisierten Schlüssel des git-Servers hinzugefügt wurde.
:::

## Sicherheit der lokalen Ausführung

OpenSkills ist ein rein lokales Werkzeug und beinhaltet keine Netzwerkkommunikation (außer beim Klonen von git-Repositories):

### Kein Datenupload

| Vorgang | Datenfluss |
|--- | ---|
| Skill installieren | Git-Repository → Lokal |
| Skills lesen | Lokal → Standardausgabe |
| AGENTS.md synchronisieren | Lokal → Lokale Datei |
| Skills aktualisieren | Git-Repository → Lokal |

### Datenschutz

- Alle Skill-Dateien werden lokal gespeichert
- KI-Agenten lesen über das lokale Dateisystem
- Keine Cloud-Abhängigkeiten oder Telemetrie-Sammlung

::: info Unterschied zum Marketplace
OpenSkills ist nicht vom Anthropic Marketplace abhängig und läuft vollständig lokal.
:::

## Lektionszusammenfassung

Dreischichtiger Sicherheitsmechanismus von OpenSkills:

| Sicherheitsebene | Schutzmaßnahme | Quellcode-Position |
|--- | --- | ---|
| **Schutz vor Pfadtraversierung** | `isPathInside()` verifiziert, dass der Pfad innerhalb des Zielverzeichnisses liegt | `install.ts:71-78` |
| **Sicherheit symbolischer Links** | `dereference: true` dereferenziert symbolische Links | `install.ts:262` |
| **Sicherheit beim YAML-Parsing** | Nicht-gieriger regulärer Ausdruck `+?` verhindert ReDoS | `yaml.ts:4` |

**Merken**:
- Pfadtraversierungsangriffe greifen auf Dateien außerhalb des erwarteten Verzeichnisses durch die Sequenz `../` zu
- Symbolische Links müssen dereferenziert oder überprüft werden, um Informationslecks und Dateiüberschreibungen zu vermeiden
- YAML-Parsing verwendet nicht-gierige reguläre Ausdrücke, um ReDoS zu vermeiden
- Lokale Ausführung + Kein Datenupload = Höhere Datenschutzsicherheit

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Best Practices](../best-practices/)**.
>
> Sie werden lernen:
> - Best Practices für die Projektkonfiguration
> - Team-Zusammenarbeitslösungen für das Skill-Management
> - Nutzungstipps für Multi-Agenten-Umgebungen
> - Häufige Fallstricke und Methoden zur Vermeidung

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-24

| Funktion          | Dateipfad                                                                                     | Zeilennummer |
|--- | --- | ---|
| Schutz vor Pfadtraversierung   | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L71-L78) | 71-78    |
| Überprüfung des Installationspfads   | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L257-L260) | 257-260  |
| Dereferenzierung symbolischer Links | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L262) | 262      |
| Überprüfung des Aktualisierungspfads   | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L156-L172) | 156-172  |
| Überprüfung symbolischer Links   | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L10-L25) | 10-25    |
| Sicherheit beim YAML-Parsing  | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts#L4) | 4        |

**Schlüsselfunktionen**:
- `isPathInside(targetPath, targetDir)`: Verifiziert, ob der Zielpfad innerhalb des Zielverzeichnisses liegt (verhindert Pfadtraversierung)
- `isDirectoryOrSymlinkToDirectory(entry, parentDir)`: Überprüft, ob ein Verzeichnis oder ein symbolischer Link auf ein Verzeichnis verweist
- `extractYamlField(content, field)`: Extrahiert YAML-Felder mit einem nicht-gierigen regulären Ausdruck (verhindert ReDoS)

**Änderungsprotokoll**:
- [`CHANGELOG.md:64-68`](https://github.com/numman-ali/openskills/blob/main/CHANGELOG.md#L64-L68) - v1.5.0 Sicherheitsupdate-Hinweise

</details>

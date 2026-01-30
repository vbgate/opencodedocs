---
title: "Paketmanager-Konfiguration: Automatische Erkennung | Everything Claude Code"
sidebarTitle: "Einheitliche Projektbefehle"
subtitle: "Paketmanager-Konfiguration: Automatische Erkennung | Everything Claude Code"
description: "Lernen Sie die automatische Erkennung des Paketmanagers zu konfigurieren. Verstehen Sie den 6-stufigen Prioritätsmechanismus mit Unterstützung für npm/pnpm/yarn/bun und vereinheitlichen Sie Befehle über mehrere Projekte hinweg."
tags:
  - "package-manager"
  - "configuration"
  - "npm"
  - "pnpm"
prerequisite:
  - "start-installation"
order: 30
---

# Paketmanager-Konfiguration: Automatische Erkennung und Anpassung

## Was Sie lernen werden

- ✅ Automatische Erkennung des verwendeten Paketmanagers (npm/pnpm/yarn/bun)
- ✅ Verständnis des 6-stufigen Erkennungsprioritätsmechanismus
- ✅ Konfiguration des Paketmanagers auf globaler und Projektebene
- ✅ Verwendung des `/setup-pm`-Befehls für schnelle Einrichtung
- ✅ Umgang mit verschiedenen Paketmanagern in Multi-Projekt-Umgebungen

## Ihre aktuelle Herausforderung

Sie haben immer mehr Projekte – einige verwenden npm, andere pnpm, wieder andere yarn oder bun. Jedes Mal, wenn Sie einen Befehl in Claude Code eingeben, müssen Sie sich erinnern:

- Verwendet dieses Projekt `npm install` oder `pnpm install`?
- Soll ich `npx`, `pnpm dlx` oder `bunx` verwenden?
- Lautet der Skriptbefehl `npm run dev`, `pnpm dev` oder `bun run dev`?

Ein einziger Fehler führt zu einer Fehlermeldung und kostet Zeit.

## Wann Sie diese Technik anwenden sollten

- **Bei Projektstart**: Konfigurieren Sie sofort nach der Entscheidung für einen Paketmanager
- **Beim Projektwechsel**: Überprüfen Sie, ob die Erkennung korrekt ist
- **Bei Teamarbeit**: Stellen Sie sicher, dass alle Teammitglieder denselben Befehlsstil verwenden
- **In Multi-Paketmanager-Umgebungen**: Globale Konfiguration + projektspezifische Überschreibung für flexible Verwaltung

::: tip Warum muss der Paketmanager konfiguriert werden?
Die Hooks und Agents von Everything Claude Code generieren automatisch paketmanagerbezogene Befehle. Bei falscher Erkennung verwenden alle Befehle das falsche Tool, was zu Fehlern führt.
:::

## 🎒 Vorbereitung

::: warning Voraussetzungen prüfen
Stellen Sie vor Beginn dieser Lektion sicher, dass Sie die [Installationsanleitung](../installation/) abgeschlossen haben und das Plugin korrekt in Claude Code installiert ist.
:::

Überprüfen Sie, ob Paketmanager auf Ihrem System installiert sind:

```bash
# Installierte Paketmanager prüfen
which npm pnpm yarn bun

# Oder unter Windows (PowerShell)
Get-Command npm, pnpm, yarn, bun -ErrorAction SilentlyContinue
```

Bei einer ähnlichen Ausgabe sind sie installiert:

```
/usr/local/bin/npm
/usr/local/bin/pnpm
```

Falls ein Paketmanager nicht gefunden wird, muss er zuerst installiert werden (nicht Teil dieser Lektion).

## Kernkonzept

Everything Claude Code verwendet einen **intelligenten Erkennungsmechanismus**, der den Paketmanager nach 6 Prioritätsstufen automatisch auswählt. Sie müssen nur einmal an der richtigen Stelle konfigurieren, und es funktioniert in allen Szenarien korrekt.

### Erkennungspriorität (von hoch nach niedrig)

```
1. Umgebungsvariable CLAUDE_PACKAGE_MANAGER  ─── Höchste Priorität, temporäre Überschreibung
2. Projektkonfiguration .claude/package-manager.json  ─── Projektspezifische Überschreibung
3. packageManager-Feld in package.json  ─── Projektstandard
4. Lock-Dateien (pnpm-lock.yaml usw.)  ─── Automatische Erkennung
5. Globale Konfiguration ~/.claude/package-manager.json  ─── Globaler Standard
6. Fallback: Erster verfügbarer in Reihenfolge  ─── Notfalllösung
```

### Warum diese Reihenfolge?

- **Umgebungsvariable zuerst**: Ermöglicht temporäres Umschalten (z.B. in CI/CD-Umgebungen)
- **Projektkonfiguration als Zweites**: Erzwingt Einheitlichkeit im selben Projekt
- **package.json-Feld**: Dies ist der Node.js-Standard
- **Lock-Dateien**: Tatsächlich vom Projekt verwendete Dateien
- **Globale Konfiguration**: Persönliche Standardpräferenz
- **Fallback**: Stellt sicher, dass immer ein Tool verfügbar ist

## Schritt-für-Schritt-Anleitung

### Schritt 1: Aktuelle Einstellung prüfen

**Warum**
Verstehen Sie zunächst die aktuelle Erkennungssituation, um festzustellen, ob eine manuelle Konfiguration erforderlich ist.

```bash
# Aktuellen Paketmanager erkennen
node scripts/setup-package-manager.js --detect
```

**Erwartete Ausgabe**:

```
=== Package Manager Detection ===

Current selection:
  Package Manager: pnpm
  Source: lock-file

Detection results:
  From package.json: not specified
  From lock file: pnpm
  Environment var: not set

Available package managers:
  ✓ npm
  ✓ pnpm (current)
  ✗ yarn
  ✓ bun

Commands:
  Install: pnpm install
  Run script: pnpm [script-name]
  Execute binary: pnpm dlx [binary-name]
```

Wenn der angezeigte Paketmanager Ihren Erwartungen entspricht, ist die Erkennung korrekt und keine manuelle Konfiguration erforderlich.

### Schritt 2: Globalen Standard-Paketmanager konfigurieren

**Warum**
Legen Sie einen globalen Standard für alle Ihre Projekte fest, um wiederholte Konfiguration zu vermeiden.

```bash
# Globalen Standard auf pnpm setzen
node scripts/setup-package-manager.js --global pnpm
```

**Erwartete Ausgabe**:

```
✓ Global preference set to: pnpm
  Saved to: ~/.claude/package-manager.json
```

Überprüfen Sie die generierte Konfigurationsdatei:

```bash
cat ~/.claude/package-manager.json
```

**Erwartete Ausgabe**:

```json
{
  "packageManager": "pnpm",
  "setAt": "2026-01-25T12:00:00.000Z"
}
```

### Schritt 3: Projektspezifischen Paketmanager konfigurieren

**Warum**
Einige Projekte erfordern möglicherweise einen bestimmten Paketmanager (z.B. wegen spezifischer Funktionen). Die Projektkonfiguration überschreibt die globale Einstellung.

```bash
# bun für das aktuelle Projekt setzen
node scripts/setup-package-manager.js --project bun
```

**Erwartete Ausgabe**:

```
✓ Project preference set to: bun
  Saved to: .claude/package-manager.json
```

Überprüfen Sie die generierte Konfigurationsdatei:

```bash
cat .claude/package-manager.json
```

**Erwartete Ausgabe**:

```json
{
  "packageManager": "bun",
  "setAt": "2026-01-25T12:00:00.000Z"
}
```

::: tip Projektspezifisch vs. Global
- **Globale Konfiguration**: ~/.claude/package-manager.json, betrifft alle Projekte
- **Projektkonfiguration**: .claude/package-manager.json, betrifft nur das aktuelle Projekt, hat höhere Priorität
:::

### Schritt 4: /setup-pm-Befehl verwenden (optional)

**Warum**
Wenn Sie das Skript nicht manuell ausführen möchten, können Sie den Slash-Befehl direkt in Claude Code verwenden.

Geben Sie in Claude Code ein:

```
/setup-pm
```

Claude Code ruft das Skript auf und zeigt interaktive Optionen an.

**Erwartete Ausgabe** ähnlich wie:

```
[PackageManager] Available package managers:
  - npm
  - pnpm (current)
  - bun

To set your preferred package manager:
  - Global: Set CLAUDE_PACKAGE_MANAGER environment variable
  - Or add to ~/.claude/package-manager.json: {"packageManager": "pnpm"}
  - Or add to package.json: {"packageManager": "pnpm@8"}
```

### Schritt 5: Erkennungslogik überprüfen

**Warum**
Nach dem Verständnis der Erkennungspriorität können Sie die Ergebnisse in verschiedenen Situationen vorhersagen.

Testen wir einige Szenarien:

**Szenario 1: Lock-Datei-Erkennung**

```bash
# Projektkonfiguration löschen
rm .claude/package-manager.json

# Erkennung durchführen
node scripts/setup-package-manager.js --detect
```

**Erwartete Ausgabe**: `Source: lock-file` (falls eine Lock-Datei existiert)

**Szenario 2: package.json-Feld**

```bash
# Zu package.json hinzufügen
cat >> package.json << 'EOF'
  "packageManager": "pnpm@8.6.0"
EOF

# Erkennung durchführen
node scripts/setup-package-manager.js --detect
```

**Erwartete Ausgabe**: `From package.json: pnpm@8.6.0`

**Szenario 3: Umgebungsvariablen-Überschreibung**

```bash
# Umgebungsvariable temporär setzen
export CLAUDE_PACKAGE_MANAGER=yarn

# Erkennung durchführen
node scripts/setup-package-manager.js --detect
```

**Erwartete Ausgabe**: `Source: environment` und `Package Manager: yarn`

```bash
# Umgebungsvariable löschen
unset CLAUDE_PACKAGE_MANAGER
```

## Checkliste ✅

Stellen Sie sicher, dass alle folgenden Punkte erfüllt sind:

- [ ] Der `--detect`-Befehl erkennt den aktuellen Paketmanager korrekt
- [ ] Die globale Konfigurationsdatei wurde erstellt: `~/.claude/package-manager.json`
- [ ] Die Projektkonfigurationsdatei wurde erstellt (falls erforderlich): `.claude/package-manager.json`
- [ ] Die Überschreibungsbeziehungen verschiedener Prioritäten entsprechen den Erwartungen
- [ ] Die aufgelisteten verfügbaren Paketmanager stimmen mit den tatsächlich installierten überein

## Häufige Fehler

### ❌ Fehler 1: Konfiguration wurde gesetzt, aber nicht angewendet

**Symptom**: Sie haben `pnpm` konfiguriert, aber die Erkennung zeigt `npm`.

**Ursache**:
- Lock-Dateien haben höhere Priorität als die globale Konfiguration (falls vorhanden)
- Das `packageManager`-Feld in package.json hat ebenfalls höhere Priorität als die globale Konfiguration

**Lösung**:
```bash
# Erkennungsquelle prüfen
node scripts/setup-package-manager.js --detect

# Bei Lock-Datei oder package.json diese Dateien prüfen
ls -la | grep -E "(package-lock|yarn.lock|pnpm-lock|bun.lockb)"
cat package.json | grep packageManager
```

### ❌ Fehler 2: Nicht existierenden Paketmanager konfiguriert

**Symptom**: Sie haben `bun` konfiguriert, aber es ist nicht installiert.

**Erkennungsergebnis** zeigt:

```
Available package managers:
  ✓ npm
  ✗ bun (current)  ← Hinweis: Als current markiert, aber nicht installiert
```

**Lösung**: Installieren Sie zuerst den Paketmanager oder konfigurieren Sie einen anderen, der bereits installiert ist.

```bash
# Verfügbare Paketmanager prüfen
node scripts/setup-package-manager.js --list

# Zu einem installierten wechseln
node scripts/setup-package-manager.js --global npm
```

### ❌ Fehler 3: Windows-Pfadprobleme

**Symptom**: Unter Windows meldet das Skript, dass die Datei nicht gefunden wurde.

**Ursache**: Pfadtrennzeichen-Problem bei Node.js-Skripten (im Quellcode behandelt, aber korrekter Befehl erforderlich).

**Lösung**: Verwenden Sie PowerShell oder Git Bash und stellen Sie sicher, dass der Pfad korrekt ist:

```powershell
# PowerShell
node scripts\setup-package-manager.js --detect
```

### ❌ Fehler 4: Projektkonfiguration beeinflusst andere Projekte

**Symptom**: Projekt A wurde mit `bun` konfiguriert, nach dem Wechsel zu Projekt B wird immer noch `bun` verwendet.

**Ursache**: Die Projektkonfiguration gilt nur im aktuellen Projektverzeichnis. Nach dem Verzeichniswechsel wird neu erkannt.

**Lösung**: Dies ist normales Verhalten. Die Projektkonfiguration betrifft nur das aktuelle Projekt und beeinflusst keine anderen Projekte.

## Zusammenfassung

Der Paketmanager-Erkennungsmechanismus von Everything Claude Code ist sehr intelligent:

- **6 Prioritätsstufen**: Umgebungsvariable > Projektkonfiguration > package.json > Lock-Datei > Globale Konfiguration > Fallback
- **Flexible Konfiguration**: Unterstützt globale Standards und projektspezifische Überschreibungen
- **Automatische Erkennung**: In den meisten Fällen ist keine manuelle Konfiguration erforderlich
- **Einheitliche Befehle**: Nach der Konfiguration verwenden alle Hooks und Agents die richtigen Befehle

**Empfohlene Konfigurationsstrategie**:

1. Setzen Sie global Ihren am häufigsten verwendeten Paketmanager (z.B. `pnpm`)
2. Überschreiben Sie auf Projektebene für spezielle Projekte (z.B. wenn `bun`-Performance benötigt wird)
3. Lassen Sie die automatische Erkennung den Rest erledigen

## Vorschau der nächsten Lektion

> In der nächsten Lektion lernen Sie die **[MCP-Server-Konfiguration](../mcp-setup/)**.
>
> Sie werden lernen:
> - Wie Sie über 15 vorkonfigurierte MCP-Server einrichten
> - Wie MCP-Server die Fähigkeiten von Claude Code erweitern
> - Wie Sie den Aktivierungsstatus und die Token-Nutzung von MCP-Servern verwalten

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-25

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| Kernlogik der Paketmanager-Erkennung | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L157-L236) | 157-236 |
| Lock-Datei-Erkennung | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L92-L102) | 92-102 |
| package.json-Erkennung | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L107-L126) | 107-126 |
| Paketmanager-Definitionen (Konfiguration) | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L13-L54) | 13-54 |
| Erkennungsprioritäts-Definition | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L57) | 57 |
| Globale Konfiguration speichern | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L241-L252) | 241-252 |
| Projektkonfiguration speichern | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L257-L272) | 257-272 |
| Kommandozeilen-Skript-Einstiegspunkt | [`scripts/setup-package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/setup-package-manager.js#L158-L206) | 158-206 |
| Erkennungsbefehl-Implementierung | [`scripts/setup-package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/setup-package-manager.js#L62-L95) | 62-95 |

**Wichtige Konstanten**:
- `PACKAGE_MANAGERS`: Unterstützte Paketmanager und ihre Befehlskonfigurationen (Zeilen 13-54)
- `DETECTION_PRIORITY`: Erkennungsprioritätsreihenfolge `['pnpm', 'bun', 'yarn', 'npm']` (Zeile 57)

**Wichtige Funktionen**:
- `getPackageManager()`: Kernerkennungslogik, gibt Paketmanager nach Priorität zurück (Zeilen 157-236)
- `detectFromLockFile()`: Erkennt Paketmanager aus Lock-Datei (Zeilen 92-102)
- `detectFromPackageJson()`: Erkennt Paketmanager aus package.json (Zeilen 107-126)
- `setPreferredPackageManager()`: Speichert globale Konfiguration (Zeilen 241-252)
- `setProjectPackageManager()`: Speichert Projektkonfiguration (Zeilen 257-272)

**Erkennungsprioritäts-Implementierung** (Quellcode Zeilen 157-236):
```javascript
function getPackageManager(options = {}) {
  // 1. Umgebungsvariable (höchste Priorität)
  if (envPm && PACKAGE_MANAGERS[envPm]) { return { name: envPm, source: 'environment' }; }

  // 2. Projektkonfiguration
  if (projectConfig) { return { name: config.packageManager, source: 'project-config' }; }

  // 3. package.json-Feld
  if (fromPackageJson) { return { name: fromPackageJson, source: 'package.json' }; }

  // 4. Lock-Datei
  if (fromLockFile) { return { name: fromLockFile, source: 'lock-file' }; }

  // 5. Globale Konfiguration
  if (globalConfig) { return { name: globalConfig.packageManager, source: 'global-config' }; }

  // 6. Fallback: Ersten verfügbaren nach Priorität finden
  for (const pmName of fallbackOrder) {
    if (available.includes(pmName)) { return { name: pmName, source: 'fallback' }; }
  }

  // Standard npm
  return { name: 'npm', source: 'default' };
}
```

</details>

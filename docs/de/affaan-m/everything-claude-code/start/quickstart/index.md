---
title: "Schnellstart: Plugin-Installation | everything-claude-code"
sidebarTitle: "Schnellstart in 5 Minuten"
subtitle: "Schnellstart: Installation des everything-claude-code Plugins"
description: "Lernen Sie die Installation und Kernfunktionen von everything-claude-code kennen. Installieren Sie das Plugin in 5 Minuten und steigern Sie Ihre Entwicklungseffizienz mit den Befehlen /plan, /tdd und /code-review."
tags:
  - "quickstart"
  - "installation"
  - "getting-started"
prerequisite: []
order: 10
---

# Schnellstart: Everything Claude Code in 5 Minuten

## Was Sie nach diesem Tutorial können werden

**Everything Claude Code** ist ein Claude Code Plugin, das professionelle Agents, Commands, Rules und Hooks bereitstellt, um Ihre Code-Qualität und Entwicklungseffizienz zu steigern. Dieses Tutorial hilft Ihnen:

- ✅ Everything Claude Code in 5 Minuten zu installieren
- ✅ Den `/plan` Befehl zu nutzen, um einen Umsetzungsplan zu erstellen
- ✅ Den `/tdd` Befehl für testgetriebene Entwicklung zu verwenden
- ✅ Den `/code-review` Befehl für Code-Reviews durchzuführen
- ✅ Die Kernkomponenten des Plugins zu verstehen

## Ihre aktuelle Situation

Sie möchten Claude Code leistungsfähiger machen, aber:
- ❌ Sie müssen jedes Mal Coding-Standards und Best Practices wiederholen
- ❌ Die Testabdeckung ist niedrig und Bugs tauchen ständig auf
- ❌ Sicherheitsprobleme werden beim Code-Review immer wieder übersehen
- ❌ Sie möchten TDD nutzen, wissen aber nicht, wie Sie anfangen sollen
- ❌ Sie wünschen sich spezialisierte Sub-Agents für bestimmte Aufgaben

**Everything Claude Code** löst diese Probleme:
- 9 spezialisierte Agents (planner, tdd-guide, code-reviewer, security-reviewer usw.)
- 14 Slash-Commands (/plan, /tdd, /code-review usw.)
- 8 verpflichtende Regelsets (security, coding-style, testing usw.)
- 15+ automatisierte Hooks
- 11 Workflow Skills

## Das Grundprinzip

**Everything Claude Code** ist ein Claude Code Plugin, das Folgendes bietet:
- **Agents**: Spezialisierte Sub-Agents für domänenspezifische Aufgaben (z. B. TDD, Code-Review, Sicherheitsaudit)
- **Commands**: Slash-Commands zum schnellen Starten von Workflows (z. B. `/plan`, `/tdd`)
- **Rules**: Verpflichtende Regeln zur Sicherstellung von Code-Qualität und Sicherheit (z. B. 80%+ Abdeckung, kein console.log)
- **Skills**: Workflow-Definitionen zur Wiederverwendung von Best Practices
- **Hooks**: Automatisierungs-Hooks, die bei bestimmten Ereignissen ausgelöst werden (z. B. Sitzungspersistenz, console.log Warnung)

::: tip Was ist ein Claude Code Plugin?
Claude Code Plugins erweitern die Fähigkeiten von Claude Code, ähnlich wie VS Code Plugins den Editor erweitern. Nach der Installation können Sie alle Agents, Commands, Skills und Hooks des Plugins nutzen.
:::

## 🎒 Vorbereitung

**Was Sie benötigen**:
- Claude Code ist installiert
- Grundlegendes Verständnis von Terminal-Befehlen
- Ein Projektverzeichnis (zum Testen)

**Was Sie nicht benötigen**:
- Keine speziellen Programmiersprachenkenntnisse
- Keine vorherige Konfiguration

---

## Schritt für Schritt: Installation in 5 Minuten

### Schritt 1: Claude Code öffnen

Starten Sie Claude Code und öffnen Sie ein Projektverzeichnis.

**Sie sollten sehen**: Die Claude Code Kommandozeilenschnittstelle ist bereit.

---

### Schritt 2: Marketplace hinzufügen

Führen Sie in Claude Code den folgenden Befehl aus, um den Marketplace hinzuzufügen:

```bash
/plugin marketplace add affaan-m/everything-claude-code
```

**Warum**
Fügt Everything Claude Code als Plugin-Quelle für Claude Code hinzu, sodass Sie Plugins daraus installieren können.

**Sie sollten sehen**:
```
✓ Successfully added marketplace: everything-claude-code
```

---

### Schritt 3: Plugin installieren

Führen Sie den folgenden Befehl aus, um das Plugin zu installieren:

```bash
/plugin install everything-claude-code@everything-claude-code
```

**Warum**
Installiert das Everything Claude Code Plugin, sodass Sie alle bereitgestellten Funktionen nutzen können.

**Sie sollten sehen**:
```
✓ Successfully installed plugin: everything-claude-code@everything-claude-code
```

---

### Schritt 4: Installation überprüfen

Führen Sie den folgenden Befehl aus, um die installierten Plugins anzuzeigen:

```bash
/plugin list
```

**Sie sollten sehen**:
```
Installed Plugins:
  everything-claude-code@everything-claude-code
```

✅ Installation erfolgreich!

---

## Schritt für Schritt: Kernfunktionen ausprobieren

### Schritt 5: Umsetzungsplan mit /plan erstellen

Angenommen, Sie möchten eine Benutzer-Authentifizierung hinzufügen, führen Sie aus:

```bash
/plan I need to add user authentication with email and password
```

**Warum**
Nutzt den planner agent, um einen detaillierten Umsetzungsplan zu erstellen und wichtige Schritte nicht zu übersehen.

**Sie sollten sehen**:
```
# Implementation Plan: User Authentication with Email and Password

## Requirements Restatement
- User registration with email and password
- User login with email and password
- Password hashing with bcrypt
- JWT token generation
- Session management

## Implementation Phases
[Detailed implementation steps...]

## Risks
- HIGH: Password security (use bcrypt, salt rounds)
- MEDIUM: JWT token expiration
- LOW: Email uniqueness validation

## Estimated Complexity: MEDIUM
**WAITING FOR CONFIRMATION**: Proceed with this plan? (yes/no/modify)
```

Geben Sie `yes` ein, um den Plan zu bestätigen, dann startet der planner mit der Umsetzung.

---

### Schritt 6: Testgetriebene Entwicklung mit /tdd

Während der Funktionsimplementierung führen Sie aus:

```bash
/tdd I need to implement a function to validate email format
```

**Warum**
Nutzt den tdd-guide agent, um den TDD-Prozess durchzusetzen und sicherzustellen, dass zuerst Tests geschrieben werden, dann der Code implementiert wird, um 80%+ Abdeckung zu erreichen.

**Sie sollten sehen**:
```
# TDD Session: Email Format Validator

## Step 1: Define Interface (SCAFFOLD)
```typescript
// lib/email-validator.ts
export interface ValidationResult {
  isValid: boolean
  error?: string
}

export function validateEmail(email: string): ValidationResult {
  // TODO: Implementation
  throw new Error('Not implemented')
}
```

## Step 2: Write Failing Test (RED)
[Test code...]

## Step 3: Run Tests - Verify FAIL
[Test failure...]

✅ Tests fail as expected. Ready to implement.

## Step 4: Implement Minimal Code (GREEN)
[Implementation code...]

## Step 5: Run Tests - Verify PASS
[Tests passing...]

## Step 6: Refactor (IMPROVE)
[Refactored code...]

## Step 7: Verify Tests Still Pass
[Tests still passing...]

## Step 8: Check Coverage
Coverage: 100% ✅ (Target: 80%)

✅ TDD session complete!
```

---

### Schritt 7: Code-Review mit /code-review durchführen

Vor dem Commit führen Sie aus:

```bash
/code-review
```

**Warum**
Nutzt den code-reviewer agent, um Code-Qualität, Sicherheit und Best Practices zu überprüfen.

**Sie sollten sehen**:
```
# Code Review Report

## Overview
- Files reviewed: 3
- Total lines: 150
- Issues found: 2

## Issues Found

### 1. [CRITICAL] Hardcoded JWT Secret
**Location**: `lib/auth.ts:15`
**Issue**: JWT secret is hardcoded in source code
**Fix**: Move to environment variable
**Impact**: Security vulnerability - secret exposed in code

### 2. [MEDIUM] Missing Error Handling
**Location**: `lib/email-validator.ts:23`
**Issue**: No error handling for null/undefined input
**Fix**: Add null check at function start
**Impact**: Potential runtime errors

## Recommendations
✓ Tests are well written
✓ Code is readable
✓ Follows TypeScript best practices

**Action Required**: Fix CRITICAL issues before commit.
```

Beheben Sie die Probleme und führen Sie `/code-review` erneut aus, um zu bestätigen, dass alle Probleme gelöst sind.

---

## Checkpoints ✅

Bestätigen Sie, dass Sie die folgenden Schritte erfolgreich abgeschlossen haben:

- [ ] Marketplace erfolgreich hinzugefügt
- [ ] everything-claude-code Plugin erfolgreich installiert
- [ ] Umsetzungsplan mit `/plan` erstellt
- [ ] TDD-Entwicklung mit `/tdd` durchgeführt
- [ ] Code-Review mit `/code-review` durchgeführt

Falls Probleme auftreten, sehen Sie unter [Häufige Probleme und Lösungen](../../faq/troubleshooting-hooks/) nach oder überprüfen Sie [MCP-Verbindungsfehler](../../faq/troubleshooting-mcp/).

---

## Warnhinweise

::: warning Installation fehlgeschlagen
Falls `/plugin marketplace add` fehlschlägt, stellen Sie sicher:
1. Sie verwenden die neueste Version von Claude Code
2. Die Netzwerkverbindung ist normal
3. Der GitHub-Zugriff ist normal (Proxy ggf. erforderlich)
:::

::: warning Befehl nicht verfügbar
Falls `/plan` oder `/tdd` nicht verfügbar sind:
1. Führen Sie `/plugin list` aus, um zu bestätigen, dass das Plugin installiert ist
2. Überprüfen Sie, ob der Plugin-Status auf enabled steht
3. Starten Sie Claude Code neu
:::

::: tip Für Windows-Benutzer
Everything Claude Code unterstützt Windows vollständig. Alle Hooks und Skripte wurden mit Node.js neu geschrieben, um plattformübergreifende Kompatibilität zu gewährleisten.
:::

---

## Zusammenfassung dieser Lektion

✅ Sie haben:
1. Das Everything Claude Code Plugin erfolgreich installiert
2. Die Kernkonzepte verstanden: Agents, Commands, Rules, Skills, Hooks
3. Die drei Kernbefehle `/plan`, `/tdd` und `/code-review` ausprobiert
4. Den grundlegenden TDD-Entwicklungsprozess gemeistert

**Merken Sie sich**:
- Agents sind spezialisierte Sub-Agents, die bestimmte Aufgaben bearbeiten
- Commands sind Schnelleinstiegspunkte zum Starten von Workflows
- Rules sind verpflichtende Regeln, die Code-Qualität und Sicherheit gewährleisten
- Beginnen Sie mit Funktionen, die Sie ansprechen, und erweitern Sie schrittweise
- Aktivieren Sie nicht alle MCPs, halten Sie es bei weniger als 10

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen Sie **[Installationsanleitung: Plugin-Marketplace vs. manuelle Installation](../installation/)** kennen.
>
> Sie werden lernen:
> - Detaillierte Schritte zur Installation über den Plugin-Marketplace
> - Den vollständigen Prozess zur manuellen Installation
> - Wie Sie nur die benötigten Komponenten kopieren
> - Die Konfigurationsmethode für MCP-Server

Setzen Sie Ihr Lernen fort und vertiefen Sie sich in die vollständige Installation und Konfiguration von Everything Claude Code.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-25

| Funktion          | Dateipfad                                                                                    | Zeilen  |
| ----------------- | -------------------------------------------------------------------------------------------- | ------- |
| Plugin-Manifest   | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28    |
| Marketplace-Konfiguration | [`.claude-plugin/marketplace.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/marketplace.json) | 1-45    |
| Installationsanweisungen   | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md)                        | 175-242 |
| /plan Befehl      | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md)            | 1-114   |
| /tdd Befehl       | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md)            | 1-327   |

**Wichtige Konstanten**:
- Plugin-Name: `everything-claude-code`
- Marketplace-Repository: `affaan-m/everything-claude-code`

**Wichtige Dateien**:
- `plugin.json`: Plugin-Metadaten und Komponentenpfade
- `commands/*.md`: 14 Slash-Command-Definitionen
- `agents/*.md`: 9 spezialisierte Sub-Agents
- `rules/*.md`: 8 verpflichtende Regelsets
- `hooks/hooks.json`: 15+ automatisierte Hook-Konfigurationen

</details>

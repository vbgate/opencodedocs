---
title: "Integrierte Skills: Browser-Automatisierung & Git | oh-my-opencode"
sidebarTitle: "4 Schweizer Taschenmesser-Skills"
subtitle: "Integrierte Skills: Browser-Automatisierung, UI/UX-Design und Git-Experte"
description: "Lernen Sie die 4 integrierten Skills von oh-my-opencode: playwright, frontend-ui-ux, git-master, dev-browser. Beherrschen Sie Browser-Automatisierung, UI-Design und Git-Operationen."
tags:
  - "skills"
  - "browser-automation"
  - "git"
  - "ui-ux"
prerequisite:
  - "categories-skills"
order: 110
---

# Integrierte Skills: Browser-Automatisierung, UI/UX-Design und Git-Experte

## Was Sie lernen werden

Nach dieser Lektion werden Sie in der Lage sein:
- Mit `playwright` oder `agent-browser` Browser-Automatisierungstests und Datenextraktion durchzuführen
- Den Agenten eine Designer-Perspektive einnehmen zu lassen, um ansprechende UI/UX-Oberflächen zu erstellen
- Git-Operationen zu automatisieren, einschließlich atomarer Commits, Verlaufssuche und Rebase
- Mit `dev-browser` persistente Browser-Automatisierung für die Entwicklung zu nutzen

## Ihre aktuelle Herausforderung

Kennen Sie diese Situationen?
- Sie möchten Frontend-Seiten testen, aber manuelles Klicken ist zu langsam und Sie können keine Playwright-Skripte schreiben
- Nach dem Programmieren sind Ihre Commit-Nachrichten chaotisch und die Historie unübersichtlich
- Sie müssen eine UI-Oberfläche gestalten, wissen aber nicht, wo Sie anfangen sollen, und das Ergebnis wirkt unästhetisch
- Sie benötigen Browser-Automatisierung, müssen sich aber jedes Mal neu authentifizieren

**Integrierte Skills** sind Ihr Schweizer Taschenmesser – jeder Skill ist ein Experte in seinem Bereich und hilft Ihnen, diese Probleme schnell zu lösen.

## Wann Sie diese Technik einsetzen

| Szenario | Empfohlener Skill | Warum |
| --- | --- | --- |
| Frontend-UI benötigt ansprechendes Design | `frontend-ui-ux` | Designer-Perspektive, Fokus auf Typografie, Farben, Animationen |
| Browser-Tests, Screenshots, Datenextraktion | `playwright` oder `agent-browser` | Vollständige Browser-Automatisierungsfähigkeiten |
| Git-Commits, Verlaufssuche, Branch-Management | `git-master` | Automatische Erkennung des Commit-Stils, atomare Commits |
| Mehrfache Browser-Operationen (Login-Status beibehalten) | `dev-browser` | Persistenter Seitenstatus, wiederverwendbar |

## Kernkonzept

**Was ist ein Skill?**

Ein Skill ist ein Mechanismus, der dem Agenten **Fachwissen** und **spezialisierte Werkzeuge** injiziert. Wenn Sie `delegate_task` mit dem Parameter `load_skills` verwenden, wird das System:
1. Das `template` des Skills als Teil des System-Prompts laden
2. Die im Skill konfigurierten MCP-Server injizieren (falls vorhanden)
3. Den verfügbaren Werkzeugbereich einschränken (falls `allowedTools` definiert ist)

**Integrierte vs. benutzerdefinierte Skills**

- **Integrierte Skills**: Sofort einsatzbereit, mit vorkonfigurierten Prompts und Werkzeugen
- **Benutzerdefinierte Skills**: Sie können eigene SKILL.md-Dateien im Verzeichnis `.opencode/skills/` oder `~/.claude/skills/` erstellen

Diese Lektion konzentriert sich auf 4 integrierte Skills, die die häufigsten Entwicklungsszenarien abdecken.

## 🎒 Vorbereitung

Bevor Sie mit den integrierten Skills beginnen, stellen Sie sicher:
- [ ] Sie haben die Lektion [Categories und Skills](../categories-skills/) abgeschlossen
- [ ] Sie verstehen die grundlegende Verwendung des `delegate_task`-Werkzeugs
- [ ] Für Browser-Automatisierungs-Skills muss der entsprechende Server gestartet sein (Playwright MCP oder agent-browser)

---

## Skill 1: playwright (Browser-Automatisierung)

### Funktionsübersicht

Der `playwright`-Skill nutzt den Playwright MCP-Server und bietet vollständige Browser-Automatisierungsfähigkeiten:
- Seitennavigation und Interaktion
- Elementlokalisierung und -manipulation (Klicken, Formulare ausfüllen)
- Screenshots und PDF-Export
- Netzwerkanfragen abfangen und simulieren

**Anwendungsfälle**: UI-Validierung, E2E-Tests, Webseiten-Screenshots, Datenextraktion

### Praxisübung: Website-Funktionalität überprüfen

**Szenario**: Sie müssen überprüfen, ob die Login-Funktion korrekt funktioniert.

#### Schritt 1: playwright-Skill aktivieren

Geben Sie in OpenCode ein:

```
Verwende playwright, um zu https://example.com/login zu navigieren und einen Screenshot des Seitenstatus zu machen
```

**Erwartetes Ergebnis**: Der Agent ruft automatisch die Playwright MCP-Werkzeuge auf, öffnet den Browser und erstellt einen Screenshot.

#### Schritt 2: Formular ausfüllen und absenden

Fahren Sie fort mit:

```
Verwende playwright, um die Felder Benutzername und Passwort auszufüllen (user@example.com / password123), dann klicke auf den Login-Button und mache einen Screenshot des Ergebnisses
```

**Erwartetes Ergebnis**: Der Agent lokalisiert automatisch die Formularelemente, füllt die Daten aus, klickt auf den Button und liefert einen Ergebnis-Screenshot.

#### Schritt 3: Weiterleitung überprüfen

```
Warte, bis die Seite vollständig geladen ist, und prüfe, ob die URL zu /dashboard weitergeleitet wurde
```

**Erwartetes Ergebnis**: Der Agent meldet die aktuelle URL und bestätigt die erfolgreiche Weiterleitung.

### Checkliste ✅

- [ ] Der Browser kann erfolgreich zur Zielseite navigieren
- [ ] Formularausfüllung und Klick-Operationen werden korrekt ausgeführt
- [ ] Screenshots zeigen den Seitenstatus deutlich an

::: tip Konfigurationshinweis
Standardmäßig verwendet die Browser-Automatisierungs-Engine `playwright`. Wenn Sie zu `agent-browser` wechseln möchten, konfigurieren Sie in `oh-my-opencode.json`:

```json
{
  "browser_automation_engine": {
    "provider": "agent-browser"
  }
}
```
:::

---

## Skill 2: frontend-ui-ux (Designer-Perspektive)

### Funktionsübersicht

Der `frontend-ui-ux`-Skill verwandelt den Agenten in die Rolle eines "Designers, der zum Entwickler wurde":
- Fokus auf **Typografie, Farben, Animationen** und andere visuelle Details
- Betonung **mutiger ästhetischer Richtungen** (Minimalismus, Maximalismus, Retro-Futurismus usw.)
- Bereitstellung von **Designprinzipien**: Vermeidung generischer Schriftarten (Inter, Roboto, Arial), Erstellung einzigartiger Farbschemata

**Anwendungsfälle**: UI-Komponentendesign, Interface-Verschönerung, Aufbau visueller Systeme

### Praxisübung: Ein ansprechendes Dashboard gestalten

**Szenario**: Sie müssen ein Datenstatistik-Dashboard entwerfen, haben aber kein Design-Mockup.

#### Schritt 1: frontend-ui-ux-Skill aktivieren

```
Verwende den frontend-ui-ux-Skill, um eine Datenstatistik-Dashboard-Seite zu gestalten
Anforderungen: 3 Datenkarten (Benutzeranzahl, Umsatz, Bestellungen), moderner Designstil
```

**Erwartetes Ergebnis**: Der Agent führt zunächst eine "Designplanung" durch und legt Zweck, Tonalität, Einschränkungen und Differenzierungspunkte fest.

#### Schritt 2: Ästhetische Richtung festlegen

Der Agent wird Sie fragen (oder intern festlegen), welchen Designstil Sie bevorzugen. Zum Beispiel:

```
**Auswahl der ästhetischen Richtung**:
- Minimalismus (Minimalist)
- Maximalismus (Maximalist)
- Retro-Futurismus (Retro-futuristic)
- Raffinierter Luxus (Luxury/Refined)
```

Antwort: **Minimalismus**

**Erwartetes Ergebnis**: Der Agent generiert basierend auf Ihrer Wahl Designspezifikationen (Schriftarten, Farben, Abstände).

#### Schritt 3: Code generieren

```
Basierend auf den obigen Designspezifikationen, implementiere diese Dashboard-Seite mit React + Tailwind CSS
```

**Erwartetes Ergebnis**:
- Sorgfältig gestaltete Typografie und Abstände
- Markante, aber harmonische Farbgebung (nicht die üblichen lila Verläufe)
- Subtile Animationen und Übergangseffekte

### Checkliste ✅

- [ ] Die Seite verwendet einen einzigartigen Designstil, kein generisches "AI slop"
- [ ] Die Schriftauswahl ist charakteristisch, Inter/Roboto/Arial werden vermieden
- [ ] Das Farbschema ist kohäsiv mit klarer visueller Hierarchie

::: tip Unterschied zum normalen Agenten
Ein normaler Agent könnte funktional korrekten Code schreiben, aber die Oberfläche wirkt unästhetisch. Der Kernwert des `frontend-ui-ux`-Skills liegt in:
- Betonung des Designprozesses (Planung > Codierung)
- Bereitstellung klarer ästhetischer Anleitung
- Warnung vor Anti-Patterns (generisches Design, lila Verläufe)
:::

---

## Skill 3: git-master (Git-Experte)

### Funktionsübersicht

Der `git-master`-Skill ist ein Git-Experte mit drei integrierten Fachkompetenzen:
1. **Commit-Architekt**: Atomare Commits, Abhängigkeitsreihenfolge, Stilerkennung
2. **Rebase-Chirurg**: Verlaufsumschreibung, Konfliktlösung, Branch-Bereinigung
3. **Verlaufs-Archäologe**: Herausfinden, wann/wo eine bestimmte Änderung eingeführt wurde

**Kernprinzip**: Standardmäßig werden **mehrere Commits** erstellt; das "faule" Verhalten "ein Commit für mehrere Dateien" wird abgelehnt.

**Anwendungsfälle**: Code-Commits, Verlaufssuche, Branch-Management, Rebase-Operationen

### Praxisübung: Intelligentes Code-Committing

**Szenario**: Sie haben 5 Dateien geändert und müssen den Code committen.

#### Schritt 1: git-master-Skill aktivieren (empfohlen mit quick-Category)

```
Verwende delegate_task(category='quick', load_skills=['git-master']), um die aktuellen Codeänderungen zu committen
```

**Warum die `quick`-Category verwenden?**
- Git-Operationen erfordern keine komplexe Schlussfolgerung
- Das `claude-haiku-4-5`-Modell ist schnell genug
- Kosteneinsparung (Haiku ist 10x günstiger als Opus)

**Erwartetes Ergebnis**: Der Agent führt eine parallele Analyse durch (Phase 0), einschließlich:
- `git status` und `git diff --stat`
- Die letzten 30 Commit-Nachrichten (zur Stilerkennung)
- Aktueller Branch-Status

#### Schritt 2: Stilerkennung (Phase 1)

Der Agent gibt aus:

```
STYLE DETECTION RESULT
======================
Analyzed: 30 commits from git log

Language: ENGLISH
  - English commits: 28 (93%)
  
Style: SEMANTIC
  - Semantic (feat:, fix:, etc.): 25 (83%)
  - Plain: 3 (10%)
  
Reference examples from repo:
  1. "feat: add user authentication"
  2. "fix: resolve database connection issue"
  3. "refactor: extract validation logic"

All commits will follow: ENGLISH + SEMANTIC
```

**Erwartetes Ergebnis**: Der Agent teilt Ihnen klar mit, welchen Commit-Stil und welche Sprache er verwenden wird.

#### Schritt 3: Atomare Commits planen (Phase 3)

Der Agent analysiert die Dateiänderungen und gibt aus:

```
COMMIT PLAN
===========
Files changed: 5
Minimum commits required: ceil(5/3) = 2
Planned commits: 3
Status: 3 >= 2 (PASS)

COMMIT 1: feat: add authentication service
  - src/services/auth.ts
  - src/types/auth.ts
  Justification: service implementation + its type definitions

COMMIT 2: feat: implement login page
  - src/pages/login.tsx
  - src/components/login-form.tsx
  Justification: page and its components

COMMIT 3: feat: add API endpoint
  - src/api/auth.ts
  - tests/auth.test.ts
  Justification: API endpoint + its test

Execution order: Commit 1 -> Commit 2 -> Commit 3
```

**Erwartetes Ergebnis**: Der Agent teilt die Commits klar auf und erklärt, warum diese Dateien zusammengehören.

#### Schritt 4: Commits ausführen (Phase 5)

Der Agent führt automatisch aus:
```bash
git add src/services/auth.ts src/types/auth.ts
git commit -m "feat: add authentication service"

git add src/pages/login.tsx src/components/login-form.tsx
git commit -m "feat: implement login page"

git add src/api/auth.ts tests/auth.test.ts
git commit -m "feat: add API endpoint"
```

**Erwartetes Ergebnis**:
- 3 separate Commits, jeder mit einer klaren semantischen Nachricht
- Sauberes Arbeitsverzeichnis (`git status` zeigt keine uncommitteten Dateien)

### Checkliste ✅

- [ ] Der Agent hat eine Stilerkennung durchgeführt und Sie klar informiert
- [ ] Die Anzahl der Commits erfüllt die "Mindest-Commit-Anzahl"-Regel (Dateianzahl / 3, aufgerundet)
- [ ] Jede Commit-Nachricht entspricht dem erkannten Stil (semantisch, einfache Beschreibung usw.)
- [ ] Testdateien und Implementierungsdateien sind im selben Commit

::: tip Verlaufssuchfunktion
`git-master` unterstützt auch leistungsstarke Verlaufssuche:

- "when was X added" → `git log -S` (Pickaxe-Suche)
- "who wrote this line" → `git blame`
- "when did bug start" → `git bisect`
- "find commits changing X pattern" → `git log -G` (Regex-Suche)

Beispiel: `Verwende git-master, um herauszufinden, in welchem Commit die Funktion 'calculate_discount' hinzugefügt wurde`
:::

::: warning Anti-Pattern: Ein großer Commit
Die erzwungene Regel von `git-master` ist:

| Dateianzahl | Mindest-Commits |
| --- | --- |
| 3+ Dateien | 2+ Commits |
| 5+ Dateien | 3+ Commits |
| 10+ Dateien | 5+ Commits |

Wenn der Agent versucht, mehrere Dateien in einem Commit zusammenzufassen, schlägt dies automatisch fehl und wird neu geplant.
:::

---

## Skill 4: dev-browser (Entwickler-Browser)

### Funktionsübersicht

Der `dev-browser`-Skill bietet persistente Browser-Automatisierungsfähigkeiten:
- **Persistenter Seitenstatus**: Login-Status bleibt zwischen mehreren Skriptausführungen erhalten
- **ARIA Snapshot**: Automatische Erkennung von Seitenelementen, Rückgabe einer Baumstruktur mit Referenzen (`@e1`, `@e2`)
- **Zwei Modi**:
  - **Standalone-Modus**: Startet einen neuen Chromium-Browser
  - **Extension-Modus**: Verbindet sich mit dem vorhandenen Chrome-Browser des Benutzers

**Anwendungsfälle**: Mehrfache Browser-Operationen (Login-Status beibehalten), komplexe Workflow-Automatisierung

### Praxisübung: Skript für Operationen nach dem Login schreiben

**Szenario**: Sie müssen eine Reihe von Operationen nach dem Login automatisieren und den Sitzungsstatus beibehalten.

#### Schritt 1: dev-browser-Server starten

**macOS/Linux**:
```bash
cd skills/dev-browser && ./server.sh &
```

**Windows (PowerShell)**:
```powershell
cd skills/dev-browser
Start-Process -NoNewWindow -FilePath "node" -ArgumentList "server.js"
```

**Erwartetes Ergebnis**: Die Konsole zeigt eine `Ready`-Nachricht an.

#### Schritt 2: Login-Skript schreiben

Geben Sie in OpenCode ein:

```bash
cd skills/dev-browser && npx tsx <<'EOF'
import { connect, waitForPageLoad } from "@/client.js";

const client = await connect();
const page = await client.page("login", { viewport: { width: 1920, height: 1080 } });

await page.goto("https://example.com/login");
await waitForPageLoad(page);

console.log({
  title: await page.title(),
  url: page.url()
});

await client.disconnect();
EOF
```

**Erwartetes Ergebnis**: Der Browser öffnet die Login-Seite und gibt Seitentitel und URL aus.

#### Schritt 3: Formularausfüllung hinzufügen

Modifizieren Sie das Skript:

```bash
cd skills/dev-browser && npx tsx <<'EOF'
import { connect, waitForPageLoad } from "@/client.js";

const client = await connect();
const page = await client.page("login", { viewport: { width: 1920, height: 1080 } });

await page.goto("https://example.com/login");
await waitForPageLoad(page);

// ARIA Snapshot abrufen
const snapshot = await client.getAISnapshot("login");
console.log(snapshot);

// Formular auswählen und ausfüllen (basierend auf ref aus dem Snapshot)
await client.fill("input[name='username']", "user@example.com");
await client.fill("input[name='password']", "password123");
await client.click("button[type='submit']");

await waitForPageLoad(page);

console.log({
  title: await page.title(),
  url: page.url(),
  loggedIn: page.url().includes("/dashboard")
});

await client.disconnect();
EOF
```

**Erwartetes Ergebnis**:
- Ausgabe des ARIA Snapshots (zeigt Seitenelemente und Referenzen)
- Formular wird automatisch ausgefüllt und abgesendet
- Seite leitet zum Dashboard weiter (Login erfolgreich bestätigt)

#### Schritt 4: Login-Status wiederverwenden

Schreiben Sie nun ein zweites Skript, das eine Seite bedient, die Login erfordert:

```bash
cd skills/dev-browser && npx tsx <<'EOF'
import { connect, waitForPageLoad } from "@/client.js";

const client = await connect();

// Zuvor erstellte "login"-Seite wiederverwenden (Sitzung ist gespeichert)
const page = await client.page("login");

// Direkt auf eine Seite zugreifen, die Login erfordert
await page.goto("https://example.com/settings");
await waitForPageLoad(page);

console.log({
  title: await page.title(),
  url: page.url()
});

await client.disconnect();
EOF
```

**Erwartetes Ergebnis**: Die Seite leitet direkt zur Einstellungsseite weiter, ohne erneutes Login (da der Sitzungsstatus gespeichert ist).

### Checkliste ✅

- [ ] Der dev-browser-Server wurde erfolgreich gestartet und zeigt `Ready` an
- [ ] ARIA Snapshot erkennt Seitenelemente korrekt
- [ ] Der Sitzungsstatus nach dem Login kann skriptübergreifend wiederverwendet werden
- [ ] Zwischen mehreren Skriptausführungen ist kein erneutes Login erforderlich

::: tip Unterschied zwischen playwright und dev-browser

| Eigenschaft | playwright | dev-browser |
| --- | --- | --- |
| **Sitzungspersistenz** | ❌ Jedes Mal neue Sitzung | ✅ Skriptübergreifend gespeichert |
| **ARIA Snapshot** | ❌ Verwendet Playwright API | ✅ Automatische Referenzgenerierung |
| **Extension-Modus** | ❌ Nicht unterstützt | ✅ Verbindung zum Benutzer-Browser |
| **Anwendungsfälle** | Einzeloperationen, Tests | Mehrfachoperationen, komplexe Workflows |
:::

---

## Best Practices

### 1. Den richtigen Skill wählen

Wählen Sie den Skill basierend auf dem Aufgabentyp:

| Aufgabentyp | Empfohlene Kombination |
| --- | --- |
| Schneller Git-Commit | `delegate_task(category='quick', load_skills=['git-master'])` |
| UI-Interface-Design | `delegate_task(category='visual-engineering', load_skills=['frontend-ui-ux'])` |
| Browser-Validierung | `delegate_task(category='quick', load_skills=['playwright'])` |
| Komplexer Browser-Workflow | `delegate_task(category='quick', load_skills=['dev-browser'])` |

### 2. Mehrere Skills kombinieren

Sie können mehrere Skills gleichzeitig laden:

```typescript
delegate_task(
  category="quick",
  load_skills=["git-master", "playwright"],
  prompt="Teste die Login-Funktion und committe den Code nach Abschluss"
)
```

### 3. Häufige Fehler vermeiden

::: warning Warnung

- ❌ **Falsch**: Bei Verwendung von `git-master` manuell Commit-Nachrichten angeben
  - ✅ **Richtig**: `git-master` automatisch erkennen und projektkonformen Commit-Nachrichten generieren lassen

- ❌ **Falsch**: Bei Verwendung von `frontend-ui-ux` "einfach nur normal" verlangen
  - ✅ **Richtig**: Den Agenten seine Designer-Fähigkeiten voll entfalten lassen, um einzigartige Designs zu schaffen

- ❌ **Falsch**: In `dev-browser`-Skripten TypeScript-Typannotationen verwenden
  - ✅ **Richtig**: In `page.evaluate()` reines JavaScript verwenden (Browser erkennt keine TS-Syntax)
:::

---

## Zusammenfassung

Diese Lektion hat 4 integrierte Skills vorgestellt:

| Skill | Kernwert | Typische Szenarien |
| --- | --- | --- |
| **playwright** | Vollständige Browser-Automatisierung | UI-Tests, Screenshots, Web-Scraping |
| **frontend-ui-ux** | Designer-Perspektive, Ästhetik zuerst | UI-Komponentendesign, Interface-Verschönerung |
| **git-master** | Automatisierte Git-Operationen, atomare Commits | Code-Commits, Verlaufssuche |
| **dev-browser** | Persistente Sitzung, komplexe Workflows | Mehrfache Browser-Operationen |

**Kernpunkte**:
1. **Skill = Fachwissen + Werkzeuge**: Injiziert Best Practices eines bestimmten Bereichs in den Agenten
2. **Kombinierte Nutzung**: `delegate_task(category=..., load_skills=[...])` für präzise Zuordnung
3. **Kostenoptimierung**: Einfache Aufgaben mit `quick`-Category, teure Modelle vermeiden
4. **Anti-Pattern-Warnungen**: Jeder Skill hat klare "Was man nicht tun sollte"-Anleitungen

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Lifecycle Hooks](../lifecycle-hooks/)**.
>
> Sie werden lernen:
> - Die Funktion und Ausführungsreihenfolge der 32 Lifecycle Hooks
> - Wie Sie Kontextinjektion und Fehlerwiederherstellung automatisieren
> - Konfigurationsmethoden für häufig verwendete Hooks (todo-continuation-enforcer, keyword-detector usw.)

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisierungsdatum: 2026-01-26

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| playwright Skill-Definition | [`src/features/builtin-skills/skills.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/skills.ts) | 4-16 |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |
| createBuiltinSkills-Funktion | [`src/features/builtin-skills/skills.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/skills.ts) | 1723-1729 |
| BuiltinSkill-Typdefinition | [`src/features/builtin-skills/types.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/types.ts) | 3-16 |
| Ladelogik für integrierte Skills | [`src/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/index.ts) | 51, 311-319 |
| Browser-Engine-Konfiguration | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | - |

**Wichtige Konfigurationen**:
- `browser_automation_engine.provider`: Browser-Automatisierungs-Engine (Standard `playwright`, optional `agent-browser`)
- `disabled_skills`: Liste der deaktivierten Skills

**Wichtige Funktionen**:
- `createBuiltinSkills(options)`: Gibt basierend auf der Browser-Engine-Konfiguration das entsprechende Skills-Array zurück

</details>

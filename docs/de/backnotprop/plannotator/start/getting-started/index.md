---
title: "Schnellstart: In 5 Minuten loslegen | Plannotator"
sidebarTitle: "In 5 Minuten loslegen"
subtitle: "Schnellstart: In 5 Minuten mit Plannotator loslegen"
description: "Lernen Sie die Installation und Konfiguration von Plannotator. Installieren Sie die CLI in 5 Minuten, konfigurieren Sie das Claude Code- oder OpenCode-Plugin und beherrschen Sie den Plan-Review- und Code-Review-Workflow."
tags:
  - "Schnellstart"
  - "Einstieg"
  - "Installation"
  - "Claude Code"
  - "OpenCode"
order: 1
---

# Schnellstart: In 5 Minuten mit Plannotator loslegen

## Was Sie nach dieser Lektion können

- ✅ Die Kernfunktionen und Anwendungsfälle von Plannotator verstehen
- ✅ Plannotator in 5 Minuten installieren
- ✅ Claude Code oder OpenCode Integration konfigurieren
- ✅ Ihren ersten Plan-Review und Code-Review durchführen

## Ihr aktuelles Problem

**Plannotator** ist ein interaktives Review-Tool für Claude Code und OpenCode, das folgende Probleme löst:

**Problem 1**: Von AI generierte Implementierungspläne im Terminal zu lesen ist mühsam – zu viel Text, unklare Struktur, anstrengende Reviews.

**Problem 2**: Feedback an die AI zu geben erfordert umständliche Textbeschreibungen wie "lösche Absatz 3" oder "ändere diese Funktion" – hoher Kommunikationsaufwand.

**Problem 3**: Beim Code-Review müssen mehrere Terminals oder IDEs geöffnet werden, ständiges Wechseln erschwert die Konzentration.

**Problem 4**: Teammitglieder möchten am Review teilnehmen, wissen aber nicht, wie sie Planinhalte teilen können.

**Plannotator hilft Ihnen**:
- Visuelle Benutzeroberfläche statt Terminal-Lesen, klare Struktur
- Text markieren und Anmerkungen hinzufügen (Löschen, Ersetzen, Kommentieren), präzises Feedback
- Git-Diff visuell reviewen, Anmerkungen auf Zeilenebene
- URL-Sharing-Funktion, Teamzusammenarbeit ohne Backend

## Wann diese Methode verwenden

**Geeignete Szenarien**:
- Sie verwenden Claude Code oder OpenCode für AI-gestützte Entwicklung
- Sie müssen von AI generierte Implementierungspläne reviewen
- Sie müssen Codeänderungen überprüfen
- Sie müssen Plan- oder Code-Review-Ergebnisse mit Teammitgliedern teilen

**Nicht geeignete Szenarien**:
- Rein manuelles Programmieren (keine AI-generierten Pläne)
- Sie haben bereits einen vollständigen Code-Review-Prozess (z.B. GitHub PR)
- Sie benötigen kein visuelles Review-Tool

## Kernkonzept

### Was ist Plannotator

**Plannotator** ist ein interaktives Review-Tool für AI Coding Agents (Claude Code, OpenCode) mit zwei Hauptfunktionen:

1. **Plan-Review**: Visuelles Review von AI-generierten Implementierungsplänen mit Anmerkungen, Genehmigung oder Ablehnung
2. **Code-Review**: Visuelles Review von Git-Diffs mit Anmerkungen auf Zeilenebene und verschiedenen Ansichtsmodi

### Funktionsweise

```
┌─────────────────┐
│  AI Agent      │
│  (Plan erstellen)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Plannotator   │  ← Lokaler HTTP-Server
│  (Visuelle UI) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Browser       │
│  (Benutzer-Review)│
└─────────────────┘
```

**Kernablauf**:
1. AI Agent erstellt Plan oder Codeänderungen
2. Plannotator startet lokalen HTTP-Server und öffnet Browser
3. Benutzer sieht Plan/Code im Browser und fügt Anmerkungen hinzu
4. Benutzer genehmigt oder lehnt ab, Plannotator gibt Entscheidung an AI Agent zurück
5. AI Agent setzt Implementierung fort oder nimmt Änderungen vor

### Sicherheit

**Alle Daten werden lokal verarbeitet**, nichts wird in die Cloud hochgeladen:
- Planinhalte, Code-Diffs und Anmerkungen werden auf Ihrem lokalen Rechner gespeichert
- Lokaler HTTP-Server verwendet zufälligen Port (oder festen Port)
- URL-Sharing komprimiert Daten in den URL-Hash, kein Backend erforderlich

## 🎒 Vorbereitungen

**Systemanforderungen**:
- Betriebssystem: macOS / Linux / Windows / WSL
- Laufzeit: Bun (wird vom Installationsskript automatisch behandelt)
- AI-Umgebung: Claude Code 2.1.7+ oder OpenCode

**Installationsoptionen**:
- Bei Verwendung von Claude Code: CLI + Plugin installieren
- Bei Verwendung von OpenCode: Plugin konfigurieren
- Nur für Code-Review: Nur CLI installieren

## Folgen Sie mir

### Schritt 1: Plannotator CLI installieren

**macOS / Linux / WSL**:

```bash
curl -fsSL https://plannotator.ai/install.sh | bash
```

**Windows PowerShell**:

```powershell
irm https://plannotator.ai/install.ps1 | iex
```

**Windows CMD**:

```cmd
curl -fsSL https://plannotator.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

**Sie sollten sehen**: Das Installationsskript lädt die Plannotator CLI herunter, fügt sie zum Systempfad hinzu und zeigt die Versionsnummer an (z.B. "plannotator v0.6.7 installed to ...").

::: tip Was macht das Installationsskript?
Das Installationsskript:
1. Lädt die neueste Version der Plannotator CLI herunter
2. Fügt sie zum Systempfad (PATH) hinzu
3. Bereinigt möglicherweise vorhandene alte Versionen
4. Installiert automatisch den `/plannotator-review` Befehl (für Code-Review)
:::

### Schritt 2: Claude Code konfigurieren (optional)

Wenn Sie Claude Code verwenden, müssen Sie das Plugin installieren.

**In Claude Code ausführen**:

```
/plugin marketplace add backnotprop/plannotator
/plugin install plannotator@plannotator
```

**Wichtig**: Nach der Plugin-Installation **muss Claude Code neu gestartet werden**, damit die Hooks wirksam werden.

**Sie sollten sehen**: Nach erfolgreicher Plugin-Installation erscheint `plannotator` in der Plugin-Liste von Claude Code.

::: info Manuelle Konfiguration (optional)
Wenn Sie das Plugin-System nicht verwenden möchten, können Sie den Hook manuell konfigurieren. Siehe Kapitel [Claude Code Plugin-Installation](../installation-claude-code/).
:::

### Schritt 3: OpenCode konfigurieren (optional)

Wenn Sie OpenCode verwenden, müssen Sie die Datei `opencode.json` bearbeiten.

**`opencode.json` bearbeiten**:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["@plannotator/opencode@latest"]
}
```

**OpenCode neu starten**.

**Sie sollten sehen**: Nach dem Neustart lädt OpenCode das Plugin automatisch und das `submit_plan` Tool wird verfügbar.

### Schritt 4: Erster Plan-Review (Claude Code Beispiel)

**Auslösebedingung**: Lassen Sie Claude Code einen Implementierungsplan erstellen und `ExitPlanMode` aufrufen.

**Beispieldialog**:

```
Benutzer: Erstelle mir einen Implementierungsplan für ein Benutzerauthentifizierungsmodul

Claude: Okay, hier ist der Implementierungsplan:
1. Benutzermodell erstellen
2. Registrierungs-API implementieren
3. Login-API implementieren
...
(ruft ExitPlanMode auf)
```

**Sie sollten sehen**:
1. Browser öffnet automatisch die Plannotator UI
2. Zeigt den von AI generierten Planinhalt
3. Sie können Plantext markieren und Anmerkungen hinzufügen (Löschen, Ersetzen, Kommentieren)
4. Unten befinden sich "Approve" und "Request Changes" Buttons

**Aktionen**:
1. Plan im Browser ansehen
2. Wenn der Plan in Ordnung ist, klicken Sie **Approve** → AI setzt Implementierung fort
3. Wenn Änderungen nötig sind, markieren Sie den zu ändernden Text, klicken Sie **Delete**, **Replace** oder **Comment** → klicken Sie **Request Changes**

**Sie sollten sehen**: Nach dem Klick schließt sich der Browser automatisch und Claude Code erhält Ihre Entscheidung und fährt mit der Ausführung fort.

### Schritt 5: Erster Code-Review

**Im Projektverzeichnis ausführen**:

```bash
/plannotator-review
```

**Sie sollten sehen**:
1. Browser öffnet die Code-Review-Seite
2. Zeigt Git-Diff (standardmäßig nicht committete Änderungen)
3. Links der Dateibaum, rechts der Diff-Viewer
4. Klicken Sie auf Zeilennummern, um Codebereiche auszuwählen und Anmerkungen hinzuzufügen

**Aktionen**:
1. Codeänderungen im Diff-Viewer durchsehen
2. Auf Zeilennummern klicken, um zu reviewenden Code auszuwählen
3. Im rechten Panel Anmerkungen hinzufügen (comment/suggestion/concern)
4. Klicken Sie **Send Feedback** um an den Agent zu senden, oder **LGTM** zum Genehmigen

**Sie sollten sehen**: Nach Klick auf Send Feedback schließt sich der Browser, das Terminal gibt formatiertes Feedback aus und der Agent verarbeitet es automatisch.

## Kontrollpunkt ✅

Nach Abschluss der obigen Schritte sollten Sie:

- [ ] Installationsskript zeigt "plannotator vX.X.X installed to ..."
- [ ] In Claude Code Plan-Review auslösen, Browser öffnet automatisch UI
- [ ] In der UI Plantext markieren und Anmerkungen hinzufügen
- [ ] Approve oder Request Changes klicken, Browser schließt sich
- [ ] `/plannotator-review` ausführen, Code-Review-Oberfläche sehen
- [ ] Im Code-Review Anmerkungen auf Zeilenebene hinzufügen, Send Feedback klicken

**Bei Fehlern in einem Schritt**, siehe:
- [Claude Code Installationsanleitung](../installation-claude-code/)
- [OpenCode Installationsanleitung](../installation-opencode/)
- [Häufige Probleme](../../faq/common-problems/)

## Häufige Fehler

**Fehler 1**: Nach Installation zeigt `plannotator` "command not found"

**Ursache**: PATH-Umgebungsvariable nicht aktualisiert oder Terminal muss neu gestartet werden.

**Lösung**:
- macOS/Linux: Führen Sie `source ~/.zshrc` oder `source ~/.bashrc` aus, oder starten Sie das Terminal neu
- Windows: Starten Sie PowerShell oder CMD neu

**Fehler 2**: Nach Plugin-Installation in Claude Code wird Plan-Review nicht ausgelöst

**Ursache**: Claude Code wurde nicht neu gestartet, Hooks sind nicht aktiv.

**Lösung**: Beenden Sie Claude Code vollständig (nicht nur Fenster schließen) und öffnen Sie es erneut.

**Fehler 3**: Browser öffnet sich nicht automatisch

**Ursache**: Möglicherweise Remote-Modus (z.B. Devcontainer, SSH) oder Port ist belegt.

**Lösung**:
- Prüfen Sie, ob die Umgebungsvariable `PLANNOTATOR_REMOTE=1` gesetzt ist
- Sehen Sie die URL in der Terminal-Ausgabe und öffnen Sie sie manuell im Browser
- Siehe [Remote-/Devcontainer-Modus](../../advanced/remote-mode/)

**Fehler 4**: Code-Review zeigt "No changes"

**Ursache**: Aktuell keine nicht committeten Git-Änderungen.

**Lösung**:
- Führen Sie zuerst `git status` aus, um Änderungen zu bestätigen
- Oder führen Sie `git add` aus, um einige Dateien zu stagen
- Oder wechseln Sie zu einem anderen Diff-Typ (z.B. last commit)

## Zusammenfassung

Plannotator ist ein lokal laufendes Review-Tool, das durch visuelle UI die Effizienz von Plan-Review und Code-Review steigert:

**Kernfunktionen**:
- **Plan-Review**: Visuelles Review von AI-generierten Plänen mit präzisen Anmerkungen
- **Code-Review**: Visuelles Review von Git-Diffs mit Anmerkungen auf Zeilenebene
- **URL-Sharing**: Review-Inhalte ohne Backend teilen
- **Drittanbieter-Integration**: Genehmigte Pläne automatisch in Obsidian/Bear speichern

**Kernvorteile**:
- Lokale Ausführung, Datensicherheit
- Visuelle UI, höhere Effizienz
- Präzises Feedback, geringerer Kommunikationsaufwand
- Teamzusammenarbeit ohne Kontosystem

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Claude Code Plugin-Installation](../installation-claude-code/)**.
>
> Sie werden lernen:
> - Detaillierte Schritte zur Claude Code Plugin-Installation
> - Methode zur manuellen Hook-Konfiguration
> - Wie Sie überprüfen, ob die Installation erfolgreich war
> - Lösungen für häufige Installationsprobleme

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Position anzuzeigen</strong></summary>

> Aktualisierungsdatum: 2026-01-24

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| CLI-Einstieg (Plan-Review) | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L1-L50) | 1-50 |
| CLI-Einstieg (Code-Review) | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L46-L84) | 46-84 |
| Plan-Review-Server | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L1-L200) | 1-200 |
| Code-Review-Server | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L1-L150) | 1-150 |
| Git-Tools | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L1-L100) | 1-100 |
| Plan-Review-UI | [`packages/editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/editor/App.tsx#L1-L200) | 1-200 |
| Code-Review-UI | [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx#L1-L200) | 1-200 |

**Wichtige Konstanten**:
- `MAX_RETRIES = 5`: Anzahl der Port-Wiederholungsversuche (`packages/server/index.ts:80`)
- `RETRY_DELAY_MS = 500`: Verzögerung bei Port-Wiederholung (`packages/server/index.ts:80`)

**Wichtige Funktionen**:
- `startPlannotatorServer()`: Startet den Plan-Review-Server (`packages/server/index.ts`)
- `startReviewServer()`: Startet den Code-Review-Server (`packages/server/review.ts`)
- `runGitDiff()`: Führt git diff Befehl aus (`packages/server/git.ts`)

**Umgebungsvariablen**:
- `PLANNOTATOR_REMOTE`: Remote-Modus-Flag (`apps/hook/server/index.ts:17`)
- `PLANNOTATOR_PORT`: Fester Port (`apps/hook/server/index.ts:18`)
- `PLANNOTATOR_BROWSER`: Benutzerdefinierter Browser (`apps/hook/README.md:79`)
- `PLANNOTATOR_SHARE`: URL-Sharing-Schalter (`apps/hook/server/index.ts:44`)

</details>

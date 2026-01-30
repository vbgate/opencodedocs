---
title: "Änderungsprotokoll: Versionshistorie | Plannotator"
sidebarTitle: "Neue Funktionen entdecken"
subtitle: "Änderungsprotokoll: Versionshistorie | Plannotator"
description: "Erfahren Sie mehr über die Versionshistorie und neuen Funktionen von Plannotator. Entdecken Sie wichtige Updates, Bugfixes und Leistungsverbesserungen für Code-Review, Bildannotation, Obsidian-Integration und mehr."
tags:
  - "Änderungsprotokoll"
  - "Versionshistorie"
  - "Neue Funktionen"
  - "Bugfixes"
order: 1
---

# Änderungsprotokoll: Versionshistorie und neue Funktionen von Plannotator

## Was Sie lernen werden

- ✅ Die Versionshistorie und neuen Funktionen von Plannotator kennenlernen
- ✅ Die wichtigsten Updates und Verbesserungen jeder Version verstehen
- ✅ Über Bugfixes und Leistungsoptimierungen informiert sein

---

## Aktuelle Version

### v0.6.7 (2026-01-24)

**Neue Funktionen**:
- **Comment-Modus**: Neuer Kommentarmodus zum direkten Eingeben von Kommentaren in Plänen
- **Type-to-comment-Shortcut**: Tastenkürzel zum direkten Eingeben von Kommentaren

**Verbesserungen**:
- Sub-Agent-Blocking-Problem im OpenCode-Plugin behoben
- Prompt-Injection-Sicherheitslücke (CVE) behoben
- Intelligente Erkennung beim Agent-Wechsel in OpenCode verbessert

**Quellcode-Referenz**:
- Comment-Modus: [`packages/ui/components/AnnotationToolbar.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationToolbar.tsx#L23-L42)
- Type-to-comment: [`packages/ui/components/AnnotationToolbar.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationToolbar.tsx#L80-L100)

---

### v0.6.6 (2026-01-20)

**Bugfixes**:
- CVE-Sicherheitslücke im OpenCode-Plugin behoben
- Sub-Agent-Blocking-Problem behoben, Prompt-Injection verhindert
- Intelligente Erkennungslogik beim Agent-Wechsel verbessert

**Quellcode-Referenz**:
- OpenCode-Plugin: [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L245-L280)
- Agent-Wechsel: [`packages/ui/utils/agentSwitch.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/agentSwitch.ts#L1-L50)

---

### v0.6.5 (2026-01-15)

**Verbesserungen**:
- **Hook-Timeout erhöht**: Hook-Timeout von Standardwert auf 4 Tage erhöht, um lang laufende KI-Pläne zu unterstützen
- **Kopierfunktion korrigiert**: Zeilenumbrüche beim Kopieren werden beibehalten
- **Neues Cmd+C-Tastenkürzel**: Unterstützung für Cmd+C-Tastenkürzel hinzugefügt

**Quellcode-Referenz**:
- Hook-Timeout: [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L44-L50)
- Zeilenumbrüche beim Kopieren: [`packages/ui/components/Viewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Viewer.tsx#L150-L170)

---

### v0.6.4 (2026-01-10)

**Neue Funktionen**:
- **Cmd+Enter-Tastenkürzel**: Unterstützung für Cmd+Enter (Windows: Strg+Enter) zum Absenden von Genehmigungen oder Feedback

**Verbesserungen**:
- Tastatursteuerung optimiert

**Quellcode-Referenz**:
- Tastenkürzel: [`packages/ui/components/AnnotationPanel.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationPanel.tsx#L323)
  (Cmd+Enter-Funktion ist direkt in den jeweiligen Komponenten implementiert)

---

### v0.6.3 (2026-01-05)

**Bugfixes**:
- Problem mit skip-title-generation-prompt behoben

**Quellcode-Referenz**:
- Skip-Title: [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L67-L71)

---

### v0.6.2 (2026-01-01)

**Bugfixes**:
- Problem behoben, bei dem HTML-Dateien nicht im npm-Paket des OpenCode-Plugins enthalten waren

**Quellcode-Referenz**:
- OpenCode-Plugin-Build: [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L1-L50)

---

### v0.6.1 (2025-12-20)

**Neue Funktionen**:
- **Bear-Integration**: Genehmigte Pläne können automatisch in der Bear-Notiz-App gespeichert werden

**Verbesserungen**:
- Tag-Generierungslogik für Obsidian-Integration verbessert
- Obsidian-Vault-Erkennungsmechanismus optimiert

**Quellcode-Referenz**:
- Bear-Integration: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L234-L280)
- Obsidian-Integration: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L136-L220)

---

## Wichtige Feature-Releases

### Code-Review-Funktion (2026-01)

**Neue Funktionen**:
- **Code-Review-Tool**: Mit dem Befehl `/plannotator-review` können Git-Diffs visuell überprüft werden
- **Zeilenbasierte Kommentare**: Durch Klicken auf Zeilennummern können Codebereiche ausgewählt und mit Kommentaren, Vorschlägen oder Bedenken versehen werden
- **Verschiedene Diff-Ansichten**: Unterstützung für verschiedene Diff-Typen wie uncommitted/staged/last-commit/branch
- **Agent-Integration**: Strukturiertes Feedback an KI-Agenten senden mit automatischer Antwortunterstützung

**Verwendung**:
```bash
# Im Projektverzeichnis ausführen
/plannotator-review
```

**Verwandte Tutorials**:
- [Code-Review-Grundlagen](../../platforms/code-review-basics/)
- [Code-Annotationen hinzufügen](../../platforms/code-review-annotations/)
- [Diff-Ansichten wechseln](../../platforms/code-review-diff-types/)

**Quellcode-Referenz**:
- Code-Review-Server: [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts)
- Code-Review-UI: [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx)
- Git-Diff-Tools: [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts)

---

### Bildannotations-Funktion (2026-01)

**Neue Funktionen**:
- **Bilder hochladen**: Bildanhänge in Plänen und Code-Reviews hochladen
- **Annotationswerkzeuge**: Drei Annotationswerkzeuge verfügbar: Pinsel, Pfeil und Kreis
- **Visuelle Annotationen**: Direkt auf Bildern annotieren für besseres Review-Feedback

**Verwandte Tutorials**:
- [Bildannotationen hinzufügen](../../platforms/plan-review-images/)

**Quellcode-Referenz**:
- Bild-Annotator: [`packages/ui/components/ImageAnnotator/index.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ImageAnnotator/index.tsx)
- Upload-API: [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L160-L180)

---

### Obsidian-Integration (2025-12)

**Neue Funktionen**:
- **Automatische Vault-Erkennung**: Automatische Erkennung des Obsidian-Vault-Konfigurationspfads
- **Automatisches Speichern von Plänen**: Genehmigte Pläne werden automatisch in Obsidian gespeichert
- **Frontmatter-Generierung**: Automatische Einbindung von Frontmatter wie created, source und tags
- **Intelligente Tag-Extraktion**: Schlüsselwörter werden aus dem Planinhalt als Tags extrahiert

**Konfiguration**:
Keine zusätzliche Konfiguration erforderlich – Plannotator erkennt den Obsidian-Installationspfad automatisch.

**Verwandte Tutorials**:
- [Obsidian-Integration](../../advanced/obsidian-integration/)

**Quellcode-Referenz**:
- Obsidian-Erkennung: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L136-L145)
- Obsidian-Speicherung: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L180-L220)
- Frontmatter-Generierung: [`packages/ui/utils/obsidian.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/obsidian.ts#L50-L80)

---

### URL-Sharing-Funktion (2025-11)

**Neue Funktionen**:
- **Serverlose Freigabe**: Pläne und Annotationen werden im URL-Hash komprimiert – kein Backend-Server erforderlich
- **Ein-Klick-Freigabe**: Über Export → Als URL teilen einen Freigabelink generieren
- **Nur-Lese-Modus**: Mitarbeiter können die URL öffnen und ansehen, aber keine Entscheidungen treffen

**Technische Umsetzung**:
- Verwendung des Deflate-Komprimierungsalgorithmus
- Base64-Kodierung + URL-sichere Zeichenersetzung
- Unterstützt maximal etwa 7 Tags als Payload

**Verwandte Tutorials**:
- [URL-Sharing](../../advanced/url-sharing/)

**Quellcode-Referenz**:
- Sharing-Utilities: [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts)
- Share-Hook: [`packages/ui/hooks/useSharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/hooks/useSharing.ts)

---

### Remote-/Devcontainer-Modus (2025-10)

**Neue Funktionen**:
- **Remote-Modus-Unterstützung**: Plannotator in Remote-Umgebungen wie SSH, Devcontainer oder WSL verwenden
- **Fester Port**: Port über Umgebungsvariable festlegen
- **Port-Weiterleitung**: URL wird automatisch ausgegeben, damit Benutzer den Browser manuell öffnen können
- **Browser-Steuerung**: Über die Umgebungsvariable `PLANNOTATOR_BROWSER` steuern, ob der Browser automatisch geöffnet wird

**Umgebungsvariablen**:
- `PLANNOTATOR_REMOTE=1`: Remote-Modus aktivieren
- `PLANNOTATOR_PORT=3000`: Festen Port festlegen
- `PLANNOTATOR_BROWSER=disabled`: Automatisches Öffnen des Browsers deaktivieren

**Verwandte Tutorials**:
- [Remote-/Devcontainer-Modus](../../advanced/remote-mode/)
- [Umgebungsvariablen-Konfiguration](../../advanced/environment-variables/)

**Quellcode-Referenz**:
- Remote-Modus: [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts)
- Browser-Steuerung: [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts)

---

## Versionskompatibilität

| Plannotator-Version | Claude Code | OpenCode | Bun-Mindestversion |
| --- | --- | --- | --- |
| v0.6.x | 2.1.7+ | 1.0+ | 1.0+ |
| v0.5.x | 2.1.0+ | 0.9+ | 0.7+ |

**Upgrade-Empfehlungen**:
- Halten Sie Plannotator auf dem neuesten Stand, um die neuesten Funktionen und Sicherheitsfixes zu erhalten
- Claude Code und OpenCode sollten ebenfalls aktuell gehalten werden

---

## Lizenzänderungen

**Aktuelle Version (v0.6.7+)**: Business Source License 1.1 (BSL-1.1)

**Lizenzdetails**:
- Erlaubt: Persönliche Nutzung, interne kommerzielle Nutzung
- Eingeschränkt: Hosting-Dienste, SaaS-Produkte
- Details siehe [LICENSE](https://github.com/backnotprop/plannotator/blob/main/LICENSE)

---

## Feedback und Support

**Probleme melden**:
- GitHub Issues: https://github.com/backnotprop/plannotator/issues

**Feature-Vorschläge**:
- Feature-Requests über GitHub Issues einreichen

**Sicherheitslücken**:
- Bitte melden Sie Sicherheitslücken über einen privaten Kanal

---

## Vorschau auf die nächste Lektion

> Sie kennen nun die Versionshistorie und neuen Funktionen von Plannotator.
>
> Als Nächstes können Sie:
> - Zum [Schnellstart](../../start/getting-started/) zurückkehren, um Installation und Verwendung zu lernen
> - Die [Häufigen Fragen](../../faq/common-problems/) lesen, um Probleme bei der Nutzung zu lösen
> - Die [API-Referenz](../../appendix/api-reference/) lesen, um alle API-Endpunkte kennenzulernen

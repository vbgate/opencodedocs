---
title: "Fehlerbehebung: Probleme lösen | Agent Skills"
sidebarTitle: "Fehlerbehebung"
subtitle: "Fehlerbehebung: Probleme lösen"
description: "Lernen Sie Agent Skills-Fehlerbehebung. Beheben Sie Netzwerkfehler, inaktive Skills und Regelnvalidierungsprobleme mit schnellen Diagnoseverfahren."
tags:
  - "FAQ"
  - "Fehlerbehebung"
  - "Debuggen"
  - "Netzwerkkonfiguration"
prerequisite:
  - "start-getting-started"
  - "start-installation"
---

# Häufige Probleme beheben

## Was Sie nach diesem Kurs können

- Schnell diagnostizieren und Deployment-Netzwerkfehler beheben
- Reparatur von inaktiven Skills
- Behebung von fehlgeschlagenen Regelnvalidierungsfehlern
- Erkennen von Ursachen für ungenaue Framework-Erkennung

## Deployment-bezogene Probleme

### Network Egress Error (Netzwerkfehler)

**Problem**: Beim Deployment auf Vercel tritt ein Netzwerkfehler auf, der besagt, dass kein Zugriff auf das externe Netzwerk möglich ist.

**Ursache**: In der claude.ai-Umgebung ist der Netzwerkzugriff standardmäßig eingeschränkt. Der Skill `vercel-deploy-claimable` benötigt Zugriff auf die Domäne `*.vercel.com`, um Dateien hochzuladen.

**Lösung**:

::: tip Netzwerkberechtigungen in claude.ai konfigurieren

1. Besuchen Sie [https://claude.ai/settings/capabilities](https://claude.ai/settings/capabilities)
2. Fügen Sie `*.vercel.com` zu "Allowed Domains" hinzu
3. Speichern Sie die Einstellungen und deployen Sie erneut

:::

**Überprüfungsmethode**:

```bash
# Testen der Netzwerkverbindung (führt kein Deployment aus)
curl -I https://claude-skills-deploy.vercel.com/api/deploy
```

**Sie sollten sehen**:
```bash
HTTP/2 200
```

### Deployment fehlgeschlagen: Vorschau-URL kann nicht extrahiert werden

**Problem**: Das Deployment-Skript wurde erfolgreich ausgeführt, aber es wird eine Fehlermeldung "Error: Could not extract preview URL from response" angezeigt.

**Ursache**: Die Deployment-API hat eine Fehlerantwort zurückgegeben (die das Feld `"error"` enthält), aber das Skript prüft zuerst das Extrahieren der URL.

Gemäß Quellcode [`deploy.sh:224-229`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh#L224-L229):

```bash
# Prüfen auf Fehler in der Antwort
if echo "$RESPONSE" | grep -q '"error"'; then
    ERROR_MSG=$(echo "$RESPONSE" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)
    echo "Error: $ERROR_MSG" >&2
    exit 1
fi
```

**Lösung**:

1. Vollständige Fehlerantwort anzeigen:
```bash
# Deployment erneut im Stammverzeichnis ausführen, Fehlermeldung beachten
bash skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh .
```

2. Häufige Fehlertypen:

| Fehlermeldung | Mögliche Ursache | Lösung |
| -------- | -------- | -------- |
| "File too large" | Projektgröße überschreitet Limit | Unötige Dateien ausschließen (wie `*.log`, `*.test.ts`) |
| "Invalid framework" | Framework-Erkennung fehlgeschlagen | `package.json` hinzufügen oder Framework manuell spezifizieren |
| "Network timeout" | Netzwerk-Timeout | Netzwerkverbindung prüfen, erneut versuchen |

### Framework-Erkennung ungenau

**Problem**: Beim Deployment stimmt das erkannte Framework nicht mit dem tatsächlichen Framework überein, oder es wird `null` zurückgegeben.

**Ursache**: Die Framework-Erkennung hängt von der Liste der Abhängigkeiten in `package.json` ab. Wenn Abhängigkeiten fehlen oder der Projekttyp speziell ist, kann die Erkennung fehlschlagen.

Gemäß Quellcode [`deploy.sh:12-156`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh#L12-L156), die Erkennungslogik:
1. `package.json` lesen
2. Spezifische Abhängigkeitsnamen prüfen
3. In Prioritätsreihenfolge abgleichen (Blitz → Next.js → Gatsby → ...)

**Lösung**:

| Szenario | Lösung |
| ---- | -------- |
| `package.json` vorhanden, aber Erkennung fehlgeschlagen | Prüfen Sie, ob die Abhängigkeiten in `dependencies` oder `devDependencies` liegen |
| Reine statische HTML-Projekte | Stellen Sie sicher, dass `index.html` im Stammverzeichnis liegt, das Skript benennt einzelne HTML-Dateien automatisch um (siehe Quellcode [`deploy.sh:198-205`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh#L198-L205)) |
| Framework nicht in der Unterstützungsliste | Direktes Deployment (framework ist null), Vercel erkennt automatisch |

**Manuelle Prüfung der Framework-Erkennung**:

```bash
# Framework-Erkennung simulieren (benötigt Bash-Umgebung)
grep -E '"(next|gatsby|vite|astro)"' package.json
```

## Skill-Aktivierungsprobleme

### Skill nicht aktiviert

**Problem**: Bei Verwendung relevanter Auslöse-Keywords (z. B. "Deploy my app") in Claude wird der Skill nicht aktiviert.

**Ursache**: Die Skill-Aktivierung hängt vom Abgleich von Keywords im Prompt ab. Wenn Keywords nicht klar sind oder der Skill nicht korrekt geladen wurde, kann die KI nicht erkennen, welcher Skill verwendet werden soll.

**Lösung**:

::: warning Überprüfungsliste

1. **Skill installiert überprüfen**:
    ```bash
    # Claude Desktop-Benutzer
    ls ~/.claude/skills/ | grep agent-skills

    # claude.ai-Benutzer
    Überprüfen Sie, ob die Projekt-Wissensbasis agent-skills enthält
    ```

2. **Klare Keywords verwenden**:
    - ✅ Verfügbar: `Deploy my app to Vercel`
    - ✅ Verfügbar: `Review this React component for performance`
    - ✅ Verfügbar: `Check accessibility of my site`
    - ❌ Nicht verfügbar: `帮我部署` (Keywords fehlen)

3. **Skill neu laden**:
    - Claude Desktop: Anwendung schließen und neu starten
    - claude.ai: Seite aktualisieren oder Skill neu zum Projekt hinzufügen

:::

**Skill-Beschreibung prüfen**:

Jeder Skill enthält zu Beginn eine Beschreibung in `SKILL.md`, die die Auslöse-Keywords angibt. Zum Beispiel:
- `vercel-deploy`: Keywords umfassen "Deploy", "deploy", "production"
- `react-best-practices`: Keywords umfassen "React", "component", "performance"

### Web-Design-Richtlinien können Regeln nicht abrufen

**Problem**: Bei Verwendung des Skills `web-design-guidelines` wird eine Fehlermeldung angezeigt, dass Regeln nicht von GitHub abgerufen werden können.

**Ursache**: Dieser Skill benötigt Zugriff auf das GitHub-Repository, um die neuesten Regeln abzurufen. claude.ai beschränkt standardmäßig den Netzwerkzugriff.

**Lösung**:

1. Fügen Sie unter [https://claude.ai/settings/capabilities](https://claude.ai/settings/capabilities) Folgendes hinzu:
    - `raw.githubusercontent.com`
    - `github.com`

2. Netzwerkzugriff verifizieren:
```bash
# Testen, ob die Regelnquelle zugänglich ist
curl -I https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

**Alternativlösung**: Wenn das Netzwerk eingeschränkt ist, laden Sie die Regeldateien manuell herunter und platzieren Sie sie lokal, ändern Sie die Skill-Definition, um auf den lokalen Pfad zu verweisen.

## Regelnvalidierungsprobleme

### VALIDATION_ERROR

**Problem**: Bei Ausführung von `pnpm validate` tritt ein Fehler auf, der besagt, dass die Regelnvalidierung fehlgeschlagen ist.

**Ursache**: Das Format der Regeldateien entspricht nicht den Spezifikationen, es fehlen Pflichtfelder oder Codebeispiele.

Gemäß Quellcode [`validate.ts:21-66`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts#L21-L66), die Validierungsregeln:
1. **Titel nicht leer**: Die Regel muss einen Titel haben
2. **Erklärung nicht leer**: Die Regel muss eine Erklärung haben
3. **Beispiele nicht leer**: Mindestens ein Codebeispiel muss vorhanden sein
4. **Impact-Level gültig**: Muss einer der Werte `CRITICAL`/`HIGH`/`MEDIUM-HIGH`/`MEDIUM`/`LOW-MEDIUM`/`LOW` sein
5. **Codebeispiele vollständig**: Mindestens ein "Incorrect/Correct"-Vergleich muss vorhanden sein

**Lösung**:

::: tip Validierungsfehlerbeispiele und Lösungen

| Fehlermeldung | Ursache | Lösung |
| -------- | ---- | -------- |
| `Missing or empty title` | Frontmatter fehlt das Feld `title` | Fügen Sie am Anfang der Regeldatei hinzu:<br>`---`<br>`title: "Regeltitel"`<br>`---` |
| `Missing or empty explanation` | Regelerklärung fehlt | Fügen Sie das Feld `explanation` im Frontmatter hinzu |
| `Missing examples` | Keine Codebeispiele | Fügen Sie `**Incorrect:**`- und `**Correct:**`-Codeblöcke hinzu |
| `Invalid impact level` | Impact-Wert falsch | Überprüfen Sie, ob `impact` im Frontmatter ein gültiger Enum-Wert ist |
| `Missing bad/incorrect or good/correct examples` | Beispiel-Labels stimmen nicht überein | Stellen Sie sicher, dass Beispiel-Labels "Incorrect" oder "Correct" enthalten |

:::

**Vollständiges Beispiel**:

```markdown
---
title: "My Rule"
impact: "CRITICAL"
explanation: "Regelerklärungstext"
---

## My Rule

**Incorrect:**
\`\`\`typescript
// Falsches Beispiel
\`\`\`

**Correct:**
\`\`\`typescript
// Richtiges Beispiel
\`\`\`
```

**Validierung ausführen**:

```bash
cd packages/react-best-practices-build
pnpm validate
```

**Sie sollten sehen**:
```
Validating rule files...
Rules directory: ../../skills/react-best-practices/rules
✓ All 57 rule files are valid
```

### Regeldatei-Parasierung fehlgeschlagen

**Problem**: Bei der Validierung wird eine Fehlermeldung `Failed to parse: ...` angezeigt, normalerweise aufgrund eines Markdown-Formatfehlers.

**Ursache**: YAML-Frontmatter-Formatfehler, nicht korrekte Überschriftenhierarchie oder Codeblock-Syntaxfehler.

**Lösung**:

1. **Frontmatter prüfen**:
    - Muss mit drei Bindestrichen `---` umschlossen sein
    - Nach dem Doppelpunkt muss ein Leerzeichen folgen
    - Zeichenfolgenwerte sollten in Anführungszeichen gesetzt werden

2. **Überschriftenhierarchie prüfen**:
    - Regeltitel verwenden `##` (H2)
    - Beispiel-Labels verwenden `**Incorrect:**` und `**Correct:**`

3. **Codeblöcke prüfen**:
    - Verwenden Sie drei Backticks \`\`\` zum Einschließen von Code
    - Geben Sie den Sprachtyp an (z. B. `typescript`)

## Zusammenfassung dieser Lektion

Die häufigsten Probleme bei Agent Skills konzentrieren sich auf:

1. **Netzwerkberechtigungen**: In claude.ai müssen Sie zulässige Domänen konfigurieren
2. **Skill-Aktivierung**: Verwenden Sie klare Keywords zum Auslösen von Skills
3. **Regelnvalidierung**: Befolgen Sie das `_template.md`-Template, um das Format zu gewährleisten
4. **Framework-Erkennung**: Stellen Sie sicher, dass `package.json` die korrekten Abhängigkeiten enthält

Bei Problemen haben Sie Priorität, Fehlermeldungen und die Fehlerbehandlungslogik im Quellcode (wie `validate.ts` und `deploy.sh`) zu prüfen.

## Hilfe erhalten

Wenn die oben genannten Methoden das Problem nicht lösen:

1. **Quellcode ansehen**:
    - Deployment-Skript: [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh)
    - Validierungs-Skript: [`packages/react-best-practices-build/src/validate.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts)
    - Skill-Definition: [`AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md)

2. **GitHub Issues**: Ein Problem in [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/issues) erstellen

3. **Community-Diskussion**: Hilfen in technischen Foren (wie Twitter, Discord) suchen

---

## Anhang: Quellcodereferenz

<details>
<summary><strong>Klicken zum Anzeigen der Quellcodepositionen</strong></summary>

> Aktualisierungszeit:2026-01-25

| Funktion        | Dateipfad                                                                                      | Zeilen    |
| ----------- | --------------------------------------------------------------------------------------------- | ------- |
| Netzwerkfehlerbehandlung | [`skills/claude.ai/vercel-deploy-claimable/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/SKILL.md#L100-L113) | 100-113 |
| Regelnvalidierungslogik | [`packages/react-best-practices-build/src/validate.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts) | 21-66   |
| Framework-Erkennungslogik | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 12-156  |
| Deployment-Fehlerbehandlung | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 224-239 |
| Statisches HTML-Handling | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 192-205  |

</details>

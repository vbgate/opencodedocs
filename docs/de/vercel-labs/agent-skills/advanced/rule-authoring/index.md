---
title: "Regelerstellung: React Best Practices | Agent Skills"
sidebarTitle: "Regelerstellung"
subtitle: "Regelerstellung: React Best Practices"
description: "Lernen Sie das Verfassen von Regeldateien, die den Spezifikationen entsprechen. Verwenden Sie _template.md und validieren Sie die Regelvollständigkeit durch pnpm validate."
tags:
  - "Regelerstellung"
  - "React"
  - "Best Practices"
prerequisite:
  - "start-getting-started"
---

# Erstellen von React Best Practices Regeln

## Was Sie nach diesem Kurs können

- Regeln für die React-Performance-Optimierung erstellen, die den Spezifikationen von Agent Skills entsprechen
- Das _template.md-Template verwenden, um schnell Regeldateien zu erstellen
- Korrekte Auswahl von Impact-Levels (CRITICAL/HIGH/MEDIUM) zur Klassifizierung von Regeln
- Klare und verständliche Incorrect/Correct-Codevergleichsbeispiele schreiben
- Validierung der Regelvollständigkeit durch `pnpm validate`

## Kernkonzept

Regeldateien sind im Markdown-Format und folgen einer **dreiteiligen Struktur**:

1. **Frontmatter**: Metadaten der Regel (title, impact, tags)
2. **Hauptüberschrift**: Anzeigename der Regel und Impact-Erklärung
3. **Codebeispiele**: `**Incorrect:**` und `**Correct:**` Vergleichsansicht

## Schritt-für-Schritt-Anleitung

### Schritt 1: Vorlagedatei kopieren

Verwenden Sie die Vorlage, um sicherzustellen, dass das Format korrekt ist und keine Pflichtfelder fehlen.

```bash
cd skills/react-best-practices/rules
cp _template.md my-new-rule.md
```

### Schritt 2: Frontmatter-Metadaten schreiben

Die Frontmatter definiert den Titel, den Impact-Level und die Klassifizierungs-Tags der Regel.

### Schritt 3: Hauptüberschrift und Erklärung schreiben

Die Hauptüberschrift wird in der endgültigen Dokumentation angezeigt, die Erklärung hilft den Benutzern, die Bedeutung der Regel zu verstehen.

### Schritt 4: Incorrect- und Correct-Beispiele schreiben

Vergleichsbeispiele sind der Kern der Regel, zeigen direkt "Problemcode" und "korrekte Vorgehensweise".

### Schritt 5: Referenzen hinzufügen (optional)

Referenzen bieten der Regel autoritative Quellen und erhöhen die Glaubwürdigkeit.

### Schritt 6: Regeldatei validieren

`pnpm validate` prüft die Vollständigkeit der Regel und stellt sicher, dass sie korrekt geparst werden kann.

## Zusammenfassung

Regelerstellung folgt einem **template-gesteuerten** Ansatz, der Kernpunkte sind:

1. **Frontmatter** definiert Metadaten (title, impact, tags)
2. **Hauptteil** enthält Überschrift, Impact-Erklärung und Codebeispiele
3. **Beispiele** verwenden `**Incorrect:**`- und `**Correct:**`-Tags
4. **Validierung** stellt durch `pnpm validate` die Formatkorrektheit sicher

**5 Kernpunkte, die Sie sich merken sollten**:
- ✅ Verwenden Sie `_template.md` als Ausgangspunkt
- ✅ Impact-Levels verwenden Sie GROSSBUCHSTABEN (CRITICAL/HIGH/MEDIUM)
- ✅ Dateinamenpräfix bestimmt die Kapitelzuordnung (async-/bundle-/rerender- usw.)
- ✅ Beispiel-Label-Format: `**Incorrect (Beschreibung):**`
- ✅ Führen Sie vor dem Commit `pnpm validate` aus

---

## Anhang: Quellcodereferenz

<details>
<summary><strong>Klicken zum Anzeigen der Quellcodepositionen</strong></summary>

> Aktualisierungszeit: 2026-01-25

| Funktion                     | Dateipfad                                                                                                                                                           | Zeilen    |
|--- | --- | ---|
| Regelvorlagedatei             | [`skills/react-best-practices/rules/_template.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/_template.md)           | 1-29    |
| Regeltypendefinition             | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts)       | 5-26    |
| Regelvalidierungslogik             | [`packages/react-best-practices-build/src/validate.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts) | 21-66   |

**Validierungsregeln**:

- Titel nicht leer
- Anzahl der examples ≥ 1
- Impact muss ein gültiger Enum-Wert sein

**Kapitel-Mapping** (Dateinamenpräfix → Kapitel → Level):

| Dateipräfix | Kapitelnummer | Kapiteltitel | Standard-Level |
|--- | --- | --- | ---|
| `async-` | 1 | Beseitigung von Waterfalls | CRITICAL |
| `bundle-` | 2 | Bundle-Optimierung | CRITICAL |

</details>

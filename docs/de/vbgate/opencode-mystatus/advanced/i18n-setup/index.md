---
title: "Mehrsprachige Unterstützung: Automatische Sprachumschaltung | opencode-mystatus"
sidebarTitle: "Mehrsprachige"
subtitle: "Mehrsprachige Unterstützung: Automatische Umschaltung zwischen Chinesisch und Englisch"
description: "Erfahren Sie die Spracherkennungsprinzipien von opencode-mystatus (Intl-API + Umgebungsvariablen-Fallback) und wie Sie die Ausgabesprache wechseln."
tags:
  - "i18n"
  - "Internationalisierung"
  - "Spracherkennung"
  - "Mehrsprachigkeit"
prerequisite:
  - "start-quick-start"
order: 3
---

# Mehrsprachige Unterstützung: Automatische Umschaltung zwischen Chinesisch und Englisch

## Was Sie nach diesem Tutorial können

- Erfahren, wie mystatus automatisch die Systemsprache erkennt
- Wissen, wie Sie durch Wechseln der Systemsprache die Ausgabesprache ändern
- Verstehen der Priorität und des Fallback-Mechanismus der Spracherkennung
- Meistern der Funktionsweise von Intl-API und Umgebungsvariablen

## Grundlegende Idee

**Mehrsprachige Unterstützung** wählt automatisch Chinesisch oder Englisch basierend auf der Systemspracheumgebung aus, ohne manuelle Konfiguration. Die Erkennungspriorität ist: Intl-API → Umgebungsvariablen → Standard Englisch.

**Erkennungspriorität** (von hoch nach niedrig):

1. **Intl-API** (empfohlen) → `Intl.DateTimeFormat().resolvedOptions().locale`
2. **Umgebungsvariablen** (Fallback) → `LANG`, `LC_ALL`, `LANGUAGE`
3. **Standard Englisch** (Fallback) → `"en"`

**Unterstützte Sprachen**:
| Sprache | Code | Erkennungsbedingung |
| ---- | ---- | -------- |
| Chinesisch | `zh` | locale beginnt mit `zh` (z. B. `zh-CN`, `zh-TW`) |
| Englisch | `en` | Andere Fälle |

## Folgen Sie mir

### Schritt 1: Aktuelle Systemsprache anzeigen

Bestätigen Sie zunächst Ihre Systemspracheinstellungen:

```bash
echo $LANG
```

**Was Sie sehen sollten**:
- Chinesisches System: `zh_CN.UTF-8`, `zh_TW.UTF-8` oder ähnlich
- Englisches System: `en_US.UTF-8`, `en_GB.UTF-8` oder ähnlich

### Schritt 2: Spracherkennung testen

Führen Sie `/mystatus` aus und beobachten Sie die Ausgabesprache:

```
/mystatus
```

**Was Sie sehen sollten**:
- Wenn die Systemsprache Chinesisch ist → Ausgabe auf Chinesisch (z. B. `3小时限额`, `重置: 2小时30分钟后`)
- Wenn die Systemsprache Englisch ist → Ausgabe auf Englisch (z. B. `3-hour limit`, `Resets in: 2h 30m`)

### Schritt 3: Temporärer Systemsprachwechsel (zum Testen)

Wenn Sie die Ausgabe in verschiedenen Sprachen testen möchten, können Sie die Umgebungsvariablen vorübergehend ändern:

```bash
# Temporär auf Englisch umschalten
LANG=en_US.UTF-8 /mystatus
```

**Was Sie sehen sollten**:
Auch wenn Ihr System chinesisch ist, wird die Ausgabe englisch.

::: warning
Dies ist nur ein temporärer Test, die Systemsprache wird nicht dauerhaft geändert. Nach Schließen des Terminals wird die ursprüngliche Einstellung wiederhergestellt.
:::

## Häufige Fehler

### Häufige Probleme

| Problem | Ursache | Lösung |
| ---- | ---- | -------- |
| Ausgabesprache entspricht nicht den Erwartungen | Falsche Systemspracheinstellung | Überprüfen Sie die Umgebungsvariable `LANG` oder die Systemspracheinstellung |
| Intl-API nicht verfügbar | Node.js-Version zu niedrig oder Umgebung nicht unterstützt | Das Plugin fällt automatisch auf die Umgebungsvariablen-Erkennung zurück |
| Chinesisches System zeigt Englisch an | Umgebungsvariable `LANG` nicht auf `zh_*` gesetzt | Stellen Sie den korrekten `LANG`-Wert ein (z. B. `zh_CN.UTF-8`) |

## Zusammenfassung

- **Automatische Erkennung**: mystatus erkennt automatisch die Systemsprache, ohne manuelle Konfiguration
- **Erkennungspriorität**: Intl-API → Umgebungsvariablen → Standard Englisch
- **Unterstützte Sprachen**: Chinesisch (`zh`) und Englisch (`en`)
- **Sprachwechsel**: Ändern der Systemspracheinstellung, OpenCode neu starten

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Spracherkennungsfunktion | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L24-L40) | 24-40 |

**Wichtige Funktionen**:
- `detectLanguage()`: Erkennt die Systemsprache des Benutzers, priorisiert Intl-API, fällt auf Umgebungsvariablen zurück, Standard Englisch

</details>

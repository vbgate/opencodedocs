---
title: "Sicherheit: Datenschutz | opencode-mystatus"
sidebarTitle: "Sicherheit"
subtitle: "Sicherheit: Datenschutz"
description: "Erfahren Sie über den Sicherheitsmechanismus des opencode-mystatus-Plugins: schreibgeschützter lokaler Dateizugriff, automatische API-Key-Maskierung, nur Aufruf offizieller Schnittstellen, keine Datenübertragung, -speicherung und Datenschutz."
tags:
  - "Sicherheit"
  - "Privatsphäre"
  - "FAQ"
prerequisite: []
order: 2
---

# Sicherheit und Privatsphäre: Lokaler Dateizugriff, API-Maskierung, offizielle Schnittstellen

## Ihre aktuelle Situation

Bei der Verwendung von Drittanbieter-Tools sind Sie am meisten besorgt über:

- "Liest es meinen API-Key?"
- "Werden meine Authentifizierungsinformationen an einen Server hochgeladen?"
- "Gibt es ein Risiko für Datenlecks?"
- "Was passiert, wenn es meine Konfigurationsdateien ändert?"

Diese Bedenken sind verständlich, besonders bei der Verarbeitung von sensiblen KI-Plattform-Authentifizierungsinformationen. Dieses Tutorial erklärt ausführlich, wie opencode-mystatus Ihre Daten und Privatsphäre durch das Design schützt.

::: info Lokalitätsprinzip

opencode-mystatus befolgt das Prinzip "Schreibgeschützer lokaler Dateizugriff + direkte Abfrage offizieller APIs". Alle sensiblen Operationen werden auf Ihrem Computer abgeschlossen, ohne dass ein Drittanbieterserver durchlaufen wird.
:::

## Grundlegende Idee

Das Sicherheitsdesign des Plugins umfasst drei Kernprinzipien:

1. **Schreibgeschützkeitsprinzip**: Nur Lesen lokaler Authentifizierungsdateien, kein Schreiben oder Ändern von Inhalten
2. **Offizielle Schnittstellen**: Nur Aufruf der offiziellen APIs der einzelnen Plattformen, ohne Verwendung von Drittanbieterdiensten
3. **Datenmaskierung**: Automatisches Ausblenden sensibler Informationen (z. B. API-Key) bei der Anzeige

Diese drei Prinzipien werden übereinander gestapelt, um sicherzustellen, dass Ihre Daten während des gesamten Prozesses vom Lesen bis zur Anzeige sicher sind.

## Lokaler Dateizugriff (schreibgeschützt)

### Welche Dateien liest das Plugin

Das Plugin liest nur zwei lokale Konfigurationsdateien, und zwar **nur schreibgeschützt**:

| Dateipfad | Zweck | Quellcodeposition |
| -------- | ---- | -------- |
| `~/.local/share/opencode/auth.json` | Offizieller Authentifizierungsspeicher von OpenCode | `mystatus.ts:35` |
| `~/.config/opencode/antigravity-accounts.json` | Antigravity-Plugin-Kontospeicher | `google.ts` (Leselogik) |

::: info Keine Dateiänderung
Im Quellcode wird nur die Funktion `readFile` zum Lesen von Dateien verwendet, ohne `writeFile` oder andere Änderungsoperationen. Das bedeutet, dass das Plugin versehentlich Ihre Konfiguration nicht überschreibt.
:::

## Offizielle Schnittstellenaufrufe

### Welche APIs ruft das Plugin auf

Das Plugin ruft nur die **offiziellen APIs** der einzelnen Plattformen auf, ohne Drittanbieterserver:

| Plattform | API-Endpunkt | Zweck |
| ---- | -------- | ---- |
| OpenAI | `https://chatgpt.com/backend-api/wham/usage` | Kreditabfrage |
| Zhipu AI | `https://bigmodel.cn/api/monitor/usage/quota/limit` | Token-Kreditabfrage |

::: info Sicherheit offizieller APIs
Diese API-Endpunkte sind die offiziellen Schnittstellen der jeweiligen Plattformen und verwenden HTTPS-verschlüsselte Übertragung. Das Plugin dient lediglich als "Client" zum Senden von Anfragen, speichert oder leitet keine Daten weiter.
:::

## Privatsphärezusammenfassung

### Was das Plugin nicht tut

| Operation | Pluginkonfiguration |
| ---- | -------- |
| Daten speichern | ❌ Speichert keine Benutzerdaten |
| Daten hochladen | ❌ Lädt keine Daten an Drittanbieterserver hoch |
| Ergebnisse zwischenspeichern | ❌ Speichert keine Abfrageergebnisse |
| Dateien ändern | ❌ Ändert keine lokalen Konfigurationsdateien |
| Protokolle aufzeichnen | ❌ Zeichnet keine Nutzungsprotokolle auf |

### Was das Plugin tut

| Operation | Pluginkonfiguration |
| ---- | -------- |
| Dateien lesen | ✅ Nur schreibgeschütztes Lesen lokaler Authentifizierungsdateien |
| APIs aufrufen | ✅ Nur Aufruf offizieller API-Endpunkte |
| Maskierte Anzeige | ✅ Automatisches Ausblenden von API-Keys und anderen sensiblen Informationen |
| Open-Source-Überprüfung | ✅ Vollständig open-source Quellcode, selbst auditierbar |

## Zusammenfassung

- **Schreibgeschütztkeitsprinzip**: Das Plugin liest nur lokale Authentifizierungsdateien, ändert keine Inhalte
- **API-Maskierung**: Beim Anzeigen werden kritische Teile des API-Keys ausgeblendet
- **Offizielle Schnittstellen**: Nur Aufruf der offiziellen APIs der einzelnen Plattformen, ohne Drittanbieterdienste
- **Open-Source-Transparenz**: Alle Codes sind open-source, Sicherheitsmechanismen können selbst auditierbar sein

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Authentifizierungsdateilesung | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts#L38-L40) | 38-40 |
| API-Maskierungsfunktion | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L130-L135) | 130-135 |

**Wichtige Funktionen**:
- `maskString(str, showChars = 4)`: Maskierte Anzeige sensibler Zeichenketten, zeigt erste und letzte `showChars` Zeichen an, ersetzt den Mittelteil mit `****`

</details>

---
title: "Privatsphäre: Datenschutz | opencode-supermemory"
sidebarTitle: "Privatsphäre"
subtitle: "Privatsphäre: Datenschutz"
description: "Lernen Sie die Datenschutzmechanismen von opencode-supermemory kennen. Verwenden Sie private Tags zum Maskieren von Daten, konfigurieren Sie API-Keys sicher und verstehen Sie den Datenfluss."
tags:
  - "Privatsphäre"
  - "Sicherheit"
  - "Konfiguration"
prerequisite:
  - "start-getting-started"
order: 1
---

# Privatsphäre und Datensicherheit: Wie Sie Ihre sensiblen Informationen schützen

## Was Sie nach dieser Lektion können

*   **Verstehen, wohin Daten gehen**: Wissen Sie genau, welche Daten in die Cloud hochgeladen werden und welche lokal verbleiben.
*   **Maskierungstechniken meistern**: Lernen Sie, wie Sie das `<private>`-Tag verwenden, um sensible Informationen (z. B. Passwörter, Schlüssel) vor dem Hochladen zu schützen.
*   **Sichere Schlüsselverwaltung**: Lernen Sie, wie Sie `SUPERMEMORY_API_KEY` auf sicherste Weise konfigurieren.

## Kernkonzept

Bei der Verwendung von opencode-supermemory ist es entscheidend, den Datenfluss zu verstehen:

1.  **Cloud-Speicherung**: Ihre Speicher (Memories) werden in der Cloud-Datenbank von Supermemory gespeichert, nicht in lokalen Dateien. Das bedeutet, dass Sie eine Netzwerkverbindung benötigen, um auf Speicher zuzugreifen.
2.  **Lokale Maskierung**: Um die Privatsphäre zu schützen, maskiert das Plugin Daten **bevor** sie in die Cloud gesendet werden, lokal.
3.  **Explizite Steuerung**: Das Plugin scannt nicht automatisch alle Dateien zum Hochladen. Nur wenn der Agent explizit das `add`-Tool aufruft oder die Komprimierung ausgelöst wird, werden relevante Inhalte verarbeitet.

### Maskierungsmechanismus

Das Plugin verfügt über einen einfachen Filter, der speziell das `<private>`-Tag erkennt.

*   **Eingabe**: `Das Datenbankkennwort hier ist <private>123456</private>`
*   **Verarbeitung**: Das Plugin erkennt das Tag und ersetzt seinen Inhalt durch `[REDACTED]`.
*   **Hochladen**: `Das Datenbankkennwort hier ist [REDACTED]`

::: info Hinweis
Dieser Verarbeitungsprozess erfolgt innerhalb des Plugin-Codes, bevor die Daten Ihren Computer verlassen.
:::

## Führen Sie es mit mir aus

### Schritt 1: API Key sicher konfigurieren

Obwohl Sie den API Key direkt in die Konfigurationsdatei schreiben können, empfehlen wir, die Prioritätslogik zu verstehen, um versehentliche Lecks (z. B. versehentliches Teilen der Konfigurationsdatei mit anderen) zu verhindern.

**Prioritätsregeln**:
1.  **Konfigurationsdatei** (`~/.config/opencode/supermemory.jsonc`): Höchste Priorität.
2.  **Umgebungsvariable** (`SUPERMEMORY_API_KEY`): Wird verwendet, wenn in der Konfigurationsdatei nicht festgelegt.

**Empfohlene Vorgehensweise**:
Wenn Sie flexibel wechseln oder in CI/CD-Umgebungen verwenden möchten, verwenden Sie Umgebungsvariablen. Wenn Sie ein einzelner Entwickler sind, ist die Konfiguration in der JSONC-Datei im Benutzerverzeichnis auch sicher (weil sie nicht in Ihrem Git-Repository liegt).

### Schritt 2: Verwenden Sie das `<private>`-Tag

Wenn Sie den Agenten durch natürliche Sprache anweisen, Inhalte zu speichern, die sensible Informationen enthalten, können Sie sensible Teile mit dem `<private>`-Tag umschließen.

**Demonstration**:

Sagen Sie dem Agenten:
> Bitte merken Sie sich, die Produktions-Datenbank-IP ist 192.168.1.10, aber das root-Kennwort ist `<private>SuperSecretPwd!</private>`, geben Sie das Kennwort nicht preis.

**Was Sie sehen sollten**:
Der Agent ruft das `supermemory`-Tool auf, um den Speicher zu speichern. Obwohl die Antwort des Agenten das Kennwort enthalten kann (weil es im Kontext ist), ist der **tatsächlich in die Supermemory-Cloud gespeicherte Speicher** bereits maskiert.

### Schritt 3: Maskierungsergebnis verifizieren

Wir können durch eine Suche verifizieren, ob das soeben verwendete Kennwort wirklich nicht gespeichert wurde.

**Operation**:
Lassen Sie den Agenten nach dem soeben verwendeten Speicher suchen:
> Suchen Sie nach dem Kennwort der Produktionsdatenbank.

**Erwartetes Ergebnis**:
Der vom Agenten aus Supermemory abgerufene Inhalt sollte sein:
`Die Produktions-Datenbank-IP ist 192.168.1.10, aber das root-Kennwort ist [REDACTED]...`

Wenn der Agent Ihnen sagt "Das Kennwort ist [REDACTED]", funktioniert der Maskierungsmechanismus korrekt.

## Häufige Missverständnisse

::: warning Missverständnis 1: Alle Code werden hochgeladen
**Tatsache**: Das Plugin lädt **nicht** automatisch Ihre gesamte Codebase hoch. Es lädt nur die spezifischen Segmente hoch, wenn es bei der Initialisierung `/supermemory-init` ausführt oder wenn der Agent explizit entscheidet, "diese Codierungslogik zu merken".
:::

::: warning Missverständnis 2: .env-Dateien werden automatisch geladen
**Tatsache**: Das Plugin liest `SUPERMEMORY_API_KEY` aus der Prozessumgebung. Wenn Sie eine `.env`-Datei im Projektstammverzeichnis ablegen, wird das Plugin **nicht** automatisch lesen, es sei denn, Ihr verwendeter Terminal oder das OpenCode-Hauptprogramm lädt sie.
:::

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie, um die Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Datenschutzmaskierungslogik | [`src/services/privacy.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/privacy.ts#L1-L13) | 1-13 |
| API Key laden | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L90) | 90 |
| Plugin-Aufruf Maskierung | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L282) | 282 |

**Wichtige Funktionen**:
- `stripPrivateContent(content)`: Führt Regex-Ersetzung durch, verwandelt `<private>`-Inhalte in `[REDACTED]`.
- `loadConfig()`: Lädt die lokale Konfigurationsdatei, Priorität höher als Umgebungsvariablen.

</details>

## Vorschau auf die nächste Lektion

> Herzlichen Glückwunsch, Sie haben die Kernkurse von opencode-supermemory abgeschlossen!
>
> Als Nächstes können Sie:
> - Lesen Sie [Erweiterte Konfiguration](/de/supermemoryai/opencode-supermemory/advanced/configuration/) für weitere Anpassungsoptionen.

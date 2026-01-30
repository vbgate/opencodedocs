---
title: "Plugin-Einführung: Funktionen und Risiken | Antigravity Auth"
sidebarTitle: "Ist dieses Plugin das Richtige für Sie"
subtitle: "Lernen Sie den Kernwert des Antigravity Auth Plugins kennen"
description: "Lernen Sie die Kernwerte und Risikohinweise des Antigravity Auth Plugins kennen. Zugriff auf Claude- und Gemini-3-Modelle über Google OAuth mit Unterstützung für Multi-Account-Lastausgleich."
tags:
  - "Einstieg"
  - "Plugin-Einführung"
  - "OpenCode"
  - "Antigravity"
order: 1
---

# Lernen Sie den Kernwert des Antigravity Auth Plugins kennen

**Antigravity Auth** ist ein OpenCode-Plugin, das über Google OAuth-Authentifizierung auf die Antigravity API zugreift. Es ermöglicht Ihnen den Aufruf fortschrittlicher KI-Modelle wie Claude Opus 4.5, Sonnet 4.5 und Gemini 3 Pro/Flash mit Ihrem gewohnten Google-Konto – ohne API-Schlüssel verwalten zu müssen. Das Plugin bietet auch Multi-Account-Lastausgleich, duale Kontingent-Pools und automatische Sitzungswiederherstellung. Es ist ideal für Benutzer, die fortschrittliche Modelle und automatisierte Verwaltung benötigen.

## Was Sie nach diesem Kurs erreichen können

- Einschätzen, ob dieses Plugin zu Ihrem Anwendungsfall passt
- Verstehen, welche KI-Modelle und Kernfunktionen das Plugin unterstützt
- Die Risiken und Vorsichtsmaßnahmen beim Einsatz dieses Plugins kennen
- Entscheiden, ob Sie mit Installation und Konfiguration fortfahren möchten

## Ihre aktuelle Herausforderung

Sie möchten auf die fortschrittlichsten KI-Modelle zugreifen (wie Claude Opus 4.5, Gemini 3 Pro), haben aber eingeschränkten offiziellen Zugriff. Sie suchen nach einer zuverlässigen Möglichkeit, diese Modelle zu nutzen, und möchten:

- Keine mehreren API-Schlüssel manuell verwalten müssen
- Bei Ratenbegrenzungen automatisch auf andere Konten umschalten
- Nach Unterbrechungen automatisch die Konversation fortsetzen, ohne Kontext zu verlieren

## Die Kernidee

**Antigravity Auth** ist ein OpenCode-Plugin, das über **Google OAuth-Authentifizierung** auf die Google Antigravity API zugreift und Ihnen ermöglicht, fortschrittliche KI-Modelle mit Ihrem gewohnten Google-Konto aufzurufen.

Es fungiert nicht als Proxy für alle Anfragen, sondern **interzeptiert und konvertiert** Ihre Modellaufrufe, leitet sie an die Antigravity API weiter und konvertiert die Antworten zurück in ein von OpenCode verständliches Format.

## Hauptfunktionen

### Unterstützte Modelle

| Modellreihe | Verfügbare Modelle | Besonderheiten |
| --- | --- | --- |
| **Claude** | Opus 4.5, Sonnet 4.5 | Unterstützt erweiterten Denkmodus |
| **Gemini 3** | Pro, Flash | Google Search-Integration, erweitertes Denken |

::: info Denkmodus (Thinking)
Thinking-Modelle führen vor der Antwortgenerierung eine "Tiefenanalyse" durch und zeigen den Schlussfolgerungsprozess an. Sie können das Denkbudget konfigurieren, um Qualität und Antwortgeschwindigkeit abzuwägen.
:::

### Multi-Account-Lastausgleich

- **Unterstützung für bis zu 10 Google-Konten**
- Automatischer Wechsel zum nächsten Konto bei Ratenbegrenzung (429-Fehler)
- Drei Kontoauswahlstrategien: sticky (fest), round-robin (rotation), hybrid (intelligente Mischung)

### Duales Kontingentsystem

Das Plugin greift gleichzeitig auf **zwei unabhängige Kontingent-Pools** zu:

1. **Antigravity-Kontingent**: Aus der Google Antigravity API
2. **Gemini CLI-Kontingent**: Aus dem Google Gemini CLI

Wenn ein Pool ratenbegrenzt wird, versucht das Plugin automatisch den anderen Pool zu nutzen, um die Kontingentnutzung zu maximieren.

### Automatische Sitzungswiederherstellung

- Erkennt fehlgeschlagene Tool-Aufrufe (z.B. Unterbrechung durch ESC-Taste)
- Injiziert automatisch synthetic tool_result, um Konversationsabstürze zu verhindern
- Unterstützt automatisches Senden von "continue" zur Fortsetzung der Konversation

### Google Search-Integration

Aktiviert Websuche für Gemini-Modelle, um die Faktengenauigkeit zu verbessern:

- **Auto-Modus**: Das Modell entscheidet basierend auf Bedarf, ob gesucht werden soll
- **Always-on-Modus**: Bei jeder Anfrage wird gesucht

## Wann sollten Sie dieses Plugin verwenden

::: tip Geeignet für folgende Szenarien
- Sie haben mehrere Google-Konten und möchten die Gesamtkontingente erhöhen
- Sie müssen Thinking-Modelle von Claude oder Gemini 3 nutzen
- Sie möchten Google Search für Gemini-Modelle aktivieren
- Sie möchten keine API-Schlüssel manuell verwalten, sondern bevorzugen OAuth-Authentifizierung
- Sie stoßen häufig auf Ratenbegrenzungen und möchten automatisch zwischen Konten wechseln
:::

::: warning Nicht geeignet für folgende Szenarien
- Sie müssen Modelle verwenden, die Google offiziell nicht veröffentlicht hat
- Sie sind sehr sensibel gegenüber Google ToS-Risiken (siehe Risikohinweis unten)
- Sie benötigen nur grundlegende Gemini 1.5- oder Claude 3-Modelle (offizielle Schnittstellen sind stabiler)
- Sie haben Schwierigkeiten, den Browser in WSL-, Docker- oder ähnlichen Umgebungen zu öffnen
:::

## ⚠️ Wichtiger Risikohinweis

Die Nutzung dieses Plugins **kann gegen die Nutzungsbedingungen von Google verstoßen**. Einige wenige Benutzer haben berichtet, dass ihre Google-Konten **gesperrt** oder **schatten-gesperrt** (Zugriff eingeschränkt, aber keine explizite Benachrichtigung) wurden.

### Hochrisiko-Szenarien

- 🚨 **Brandneue Google-Konten**: Sehr hohe Wahrscheinlichkeit einer Sperrung
- 🚨 **Konten mit neu abgeschlossenem Pro/Ultra-Abonnement**: Leicht als verdächtig markiert und gesperrt

### Bitte bestätigen Sie vor der Nutzung

- Dies ist ein **inoffizielles Tool**, das von Google nicht anerkannt wird
- Ihr Konto kann ausgesetzt oder dauerhaft gesperrt werden
- Sie tragen das volle Risiko bei der Nutzung dieses Plugins

### Empfehlungen

- Verwenden Sie **etablierte Google-Konten**, anstatt neue Konten speziell für dieses Plugin zu erstellen
- Vermeiden Sie die Nutzung wichtiger Konten, die an kritische Dienste gebunden sind
- Falls Ihr Konto gesperrt wird, können Sie über dieses Plugin keinen Einspruch einlegen

::: danger Kontosicherheit
Alle OAuth-Token werden lokal in `~/.config/opencode/antigravity-accounts.json` gespeichert und auf keine Server hochgeladen. Bitte stellen Sie jedoch sicher, dass Ihr Computer sicher ist, um Token-Lecks zu verhindern.
:::

## Zusammenfassung dieser Lektion

Antigravity Auth ist ein leistungsstarkes OpenCode-Plugin, das Ihnen über Google OAuth Zugriff auf Claude- und Gemini 3-Hochleistungsmodelle ermöglicht. Es bietet Multi-Account-Lastausgleich, duale Kontingent-Pools, automatische Sitzungswiederherstellung und andere Funktionen. Es ist ideal für Benutzer, die Hochleistungsmodelle und automatisierte Verwaltung benötigen.

Bitte beachten Sie jedoch: **Die Nutzung dieses Plugins birgt das Risiko einer Kontosperrung**. Bitte verwenden Sie nicht kritische Google-Konten und informieren Sie sich über die damit verbundenen Risiken, bevor Sie mit der Installation fortfahren.

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Schnellinstallation](../../quick-install/)**.
>
> Sie werden lernen:
> - Plugin-Installation in 5 Minuten
> - Hinzufügen des ersten Google-Kontos
> - Überprüfung der erfolgreichen Installation

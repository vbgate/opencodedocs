---
title: "Plattformintegration: Unterstützung mehrerer Protokolle | Antigravity-Manager"
sidebarTitle: "Verbinde deine KI-Plattformen"
subtitle: "Plattformintegration: Unterstützung mehrerer Protokolle"
description: "Erfahre, wie du Antigravity Tools für die Integration von Plattformprotokollen verwendest. Unterstützt die einheitliche API-Gateway-Umwandlung für 7 Protokolle wie OpenAI, Anthropic, Gemini und mehr."
order: 200
---

# Plattformen und Integrationen

Die Kernfunktion von Antigravity Tools ist die Konvertierung mehrerer KI-Plattformprotokolle in ein einheitliches lokales API-Gateway. Dieses Kapitel beschreibt im Detail die Integrationsmethoden, Kompatibilitätsgrenzen und bewährte Praktiken für jedes Protokoll.

## Inhalt dieses Kapitels

| Tutorial | Beschreibung |
|--- | ---|
| [OpenAI-kompatible API](./openai/) | Implementierungsstrategien für `/v1/chat/completions` und `/v1/responses`, nahtlose Integration mit OpenAI SDK |
|--- | ---|
| [Gemini Native API](./gemini/) | `/v1beta/models` und Google SDK Endpunkte, unterstützt `x-goog-api-key` Kompatibilität |
| [Imagen 3 Bildgenerierung](./imagen/) | Automatische Abbildung von OpenAI Images-Parametern `size`/`quality`, unterstützt beliebige Seitenverhältnisse |
| [Audio-Transkription](./audio/) | Einschränkungen von `/v1/audio/transcriptions` und Verarbeitung großer Datenvolumen |
| [MCP Endpunkte](./mcp/) | Web Search/Reader/Vision als aufrufbare Tools verfügbar machen |
| [Cloudflared Tunnel](./cloudflared/) | Ein-Klick-Exposition der lokalen API ins öffentliche Internet (nicht standardmäßig sicher) |

## Empfohlener Lernpfad

::: tip Empfohlene Reihenfolge
1. **Lerne zuerst das von dir verwendete Protokoll**: Wenn du Claude Code verwendest, lies zuerst [Anthropic-kompatible API](./anthropic/); wenn du OpenAI SDK verwendest, lies zuerst [OpenAI-kompatible API](./openai/)
2. **Dann lerne Gemini Native**: Verstehe die direkte Integrationsmethode des Google SDK
3. **Lerne Erweiterungsfunktionen nach Bedarf**: Bildgenerierung, Audio-Transkription, MCP-Tools
4. **Zuletzt lerne Tunnel**: Lies [Cloudflared Tunnel](./cloudflared/), wenn du eine öffentliche Exposition benötigst
:::

**Schnellauswahl**:

| Dein Szenario | Empfohlen, zuerst zu lesen |
|--- | ---|
| Verwendung von Claude Code CLI | [Anthropic-kompatible API](./anthropic/) |
| Verwendung von OpenAI Python SDK | [OpenAI-kompatible API](./openai/) |
| Verwendung von Google offiziellem SDK | [Gemini Native API](./gemini/) |
| Benötigst du KI-Bilderzeugung | [Imagen 3 Bildgenerierung](./imagen/) |
|--- | ---|
| Benötigst du Internetsuche/Weblesen | [MCP Endpunkte](./mcp/) |
| Benötigst du Remote-Zugriff | [Cloudflared Tunnel](./cloudflared/) |

## Voraussetzungen

::: warning Vor dem Start bitte bestätigen
- [Installation und Upgrade](../start/installation/) abgeschlossen
- [Konto hinzufügen](../start/add-account/) abgeschlossen
- [Lokalen Reverse-Proxy starten](../start/proxy-and-first-client/) abgeschlossen (mindestens Zugriff auf `/healthz`)
:::

## Nächste Schritte

Nach Abschluss dieses Kapitels kannst du weiter lernen:

- [Erweiterte Konfiguration](../advanced/): Modell-Routing, Quotenverwaltung, Hochverfügbarkeitsplanung und andere erweiterte Funktionen
- [Häufig gestellte Fragen](../faq/): Fehlerbehebungsleitfaden für 401/404/429 und andere Fehler

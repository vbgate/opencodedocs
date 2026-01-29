---
title: "Sprachwecker und TTS: Voice Wake, Talk Mode und Sprachkonfiguration | Clawdbot Tutorial"
sidebarTitle: "Mit einem Satz die AI aufwecken"
subtitle: "Sprachwecker und Text-zu-Sprache"
description: "Lernen Sie, die Sprachfunktionen von Clawdbot zu konfigurieren: Voice Wake Sprachwecker, Talk Modus fortlaufendes Gesprächsmodus und TTS Text-zu-Sprache-Anbieter (Edge, OpenAI, ElevenLabs). Dieses Tutorial deckt die Konfiguration von Sprachwecker-Wörtern, fortlaufende Sprachgespräche, TTS-Konfiguration für mehrere Anbieter und allgemeine Problemlösung ab."
tags:
  - "advanced"
  - "voice"
  - "tts"
  - "configuration"
prerequisite:
  - "start-getting-started"
order: 250
---

# Sprachwecker und Text-zu-Sprache

## Was Sie nach dem Lernen tun können

- Voice Wake Sprachwecker konfigurieren, unterstützt macOS/iOS/Android-Knoten
- Talk Modus verwenden für fortlaufende Sprachgespräche (Spracheingabe → AI → Sprachausgabe)
- Mehrere TTS-Anbieter (Edge, OpenAI, ElevenLabs) und automatische Failover-Konfiguration
- Benutzerdefinierte Sprachwecker-Wörter, TTS-Stimmen und Gesprächsparameter
- Häufige Probleme mit Sprachfunktionen lösen (Berechtigungen, Audioformate, API-Fehler)

## Ihre aktuelle Situation

Sprachinteraktion ist praktisch, aber die Konfiguration kann verwirrend sein:

- Welchen TTS-Anbieter sollten Sie verwenden? Edge ist kostenlos aber die Qualität ist durchschnittlich, ElevenLabs hat hohe Qualität aber kostet Geld
- Was ist der Unterschied zwischen Voice Wake und Talk Modus? Wann verwenden Sie welchen?
- Wie konfigurieren Sie benutzerdefinierte Wecker-Wörter statt dem Standard "clawd"?
- Wie synchronisieren Sie die Sprachkonfiguration auf verschiedenen Geräten (macOS, iOS, Android)?
- Warum ist das TTS-Ausgabeformat wichtig? Warum verwendet Telegram Opus während andere Kanäle MP3 verwenden?

## Wann Sie diese Funktion verwenden

- **Voice Wake**: Wenn Sie eine freihändige Sprachassistent-Erfahrung benötigen. Zum Beispiel die AI durch direktes Sprechen auf macOS oder iOS/Android aufwecken, ohne Tastaturbedienung.
- **Talk Modus**: Wenn Sie fortlaufende Sprachgespräche benötigen. Zum Beispiel Mehr-Runden-Gespräche mit der AI per Sprache während des Fahrens, Kochens oder Laufens.
- **TTS-Konfiguration**: Wenn möchten, dass KI-Antworten per Sprache abgespielt werden. Zum Beispiel Sprachassistent für ältere Menschen oder sehbehinderte Menschen oder persönliche Sprachassistent-Erfahrung.
- **Benutzerdefinierte Sprache**: Wenn Sie mit der Standardsprache nicht zufrieden sind. Zum Beispiel Geschwindigkeit, Tonhöhe, Stabilität anpassen oder zu chinesischen Sprachmodellen wechseln.

## 🎒 Vorbereitung vor dem Start

::: warning Voraussetzungen
Dieses Tutorial setzt voraus, dass Sie [Schnellstart](../../start/getting-started/) abgeschlossen haben, Gateway installiert und gestartet haben.
::

- Gateway-Daemon läuft
- Mindestens ein KI-Modell-Anbieter konfiguriert (Anthropic oder OpenAI)
- **Für Voice Wake**: macOS/iOS/Android-Gerät installiert und mit Gateway verbunden
- **Für Talk Modus**: iOS- oder Android-Knoten verbunden (macOS-Menüleisten-App unterstützt nur Voice Wake)
- **Für ElevenLabs TTS**: ElevenLabs API-Key vorbereitet (wenn Sie hochwertige Sprache benötigen)
- **Für OpenAI TTS**: OpenAI API-Key vorbereitet (optional, Edge TTS ist kostenlos aber die Qualität ist durchschnittlich)

::: info Berechtigungshinweis
Voice Wake und Talk Modus erfordern folgende Berechtigungen:
- **Mikrofonberechtigung**: Wesentlich für Spracheingabe
- **Spracherkennungsberechtigung** (Speech Recognition): Sprache zu Text
- **Eingabehilfen-Berechtigung** (macOS): Überwachung globaler Tastenkürzel (wie Cmd+Fn push-to-talk)
::

## Kernkonzepte

Clawdbot hat drei Sprachfunktionsmodule, die zusammenarbeiten: Voice Wake (Aufwecken), Talk Modus (fortlaufendes Gespräch), TTS (Text-zu-Sprache).

### Voice Wake: Globales Wecker-Wort-System

Die Wecker-Wörter sind eine globale Gateway-Konfiguration.

### Talk Modus: Sprachgesprächsschleife

Fortlaufende Sprachgesprächsschleife mit Zustandsübergängen Listening → Thinking → Speaking.

### TTS: Automatischer Failover zwischen mehreren Anbietern

Unterstützt drei TTS-Anbieter (Edge, OpenAI, ElevenLabs) mit automatischem Failover.

## Machen Sie mit

### Schritt 1: TTS-Grundkonfiguration

Bearbeiten Sie `~/.clawdbot/clawdbot.json`:

```yaml
messages:
  tts:
    auto: "always"
    provider: "edge"
    edge:
      enabled: true
      voice: "zh-CN-XiaoxiaoNeural"
      lang: "zh-CN"
      outputFormat: "audio-24khz-48kbitrate-mono-mp3"
```

```bash
clawdbot gateway restart
```

### Schritt 2: ElevenLabs TTS konfigurieren

API-Key auf [ElevenLabs-Konsole](https://elevenlabs.io/app) generieren.

Umgebungsvariablen:

```bash
export ELEVENLABS_API_KEY="xi_..."
```

Oder Konfigurationsdatei:

```yaml
messages:
  tts:
    provider: "elevenlabs"
    elevenlabs:
      voiceId: "pMsXgVXv3BLzUgSXRplE"
      modelId: "eleven_multilingual_v2"
```

### Schritt 3: OpenAI TTS als Backup konfigurieren

```yaml
messages:
  tts:
    provider: "elevenlabs"
    openai:
      model: "gpt-4o-mini-tts"
      voice: "alloy"
```

### Schritt 4: Voice Wake Wecker-Wörter konfigurieren

Auf der macOS-App gehen Sie zu Settings → Voice Wake um Wecker-Wörter zu bearbeiten.

Oder mit RPC verwenden:

```bash
clawdbot gateway rpc voicewake.set '{"triggers":["助手","小助"]}'
```

### Schritt 5: Talk Modus verwenden (iOS/Android)

Tippen Sie auf den Talk-Button in der iOS/Android-App um zu aktivieren.

## Kontrollpunkt ✅

- [ ] TTS-Grundkonfiguration abgeschlossen
- [ ] KI-Sprachantwort auf mindestens einem Kanal erhalten
- [ ] Voice Wake Wecker-Wörter benutzerdefiniert
- [ ] Talk Modus iOS/Android kann starten und Gespräch fortsetzen
- [ ] TTS-Unterbrechungsfunktion funktioniert korrekt
- [ ] Kann Anbieter mit `/tts`-Befehl wechseln
- [ ] Keine TTS-Fehler in Gateway-Protokollen

## Zusammenfassung

- Die Sprachfunktionen von Clawdbot bestehen aus drei Modulen: Voice Wake, Talk Modus, TTS
- TTS unterstützt drei Anbieter: Edge (kostenlos), OpenAI (stabil), ElevenLabs (hohe Qualität)
- Voice Wake verwendet globale Wecker-Wort-Konfiguration
- Talk Modus unterstützt nur iOS/Android
- Das TTS-Ausgabeformat wird durch den Kanal bestimmt
- Empfohlene Konfiguration: ElevenLabs hauptsächlich, OpenAI Backup, Edge TTS für Notfälle

## Nächste Lektion

> In der nächsten Lektion lernen wir **[Speichersystem und Vektorsuche](../memory-system/)**.

---

## Anhang: Quellcode-Referenzen

<details>
<summary><strong>Klicken Sie um Quellcode-Speicherorte anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-27

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
| TTS-Kernlogik | [`src/tts/tts.ts`](https://github.com/moltbot/moltbot/blob/main/src/tts/tts.ts) | 1-1472 |
| ElevenLabs TTS | [`src/tts/tts.ts`](https://github.com/moltbot/moltbot/blob/main/src/tts/tts.ts) | 916-991 |
| OpenAI TTS | [`src/tts/tts.ts`](https://github.com/moltbot/moltbot/blob/main/src/tts/tts.ts) | 993-1037 |
| Edge TTS | [`src/tts/tts.ts`](https://github.com/moltbot/moltbot/blob/main/src/tts/tts.ts) | 1050-1069 |
| Voice Wake-Konfigurationsverwaltung | [`src/infra/voicewake.ts`](https://github.com/moltbot/moltbot/blob/main/src/infra/voicewake.ts) | 1-91 |

</details>

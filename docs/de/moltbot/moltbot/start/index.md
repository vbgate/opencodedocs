---
title: "Schnellstart: Installation, Konfiguration, Gateway-Start und erste Nachricht mit DM-Pairing-Schutz | Clawdbot Tutorial"
sidebarTitle: "Start von Null"
subtitle: "Schnellstart: Von der Installation zur ersten Nachricht"
description: "Dieses Kapitel führt dich durch die erste Verwendung von Clawdbot – von Installation, Konfiguration, Start des Gateway, Senden der ersten Nachricht bis zum Verständnis des DM-Pairing-Schutzmechanismus."
tags:
  - "Einstieg"
  - "Schnellstart"
prerequisite: []
order: 10
---

# Schnellstart: Von der Installation zur ersten Nachricht

Willkommen bei Clawdbot! Dieses Kapitel führt dich durch den vollständigen Prozess, Clawdbot von Null zu nutzen. Egal, ob du KI-Assistenten schnell ausprobieren oder Konfigurationsoptionen genauer verstehen möchtest – hier findest du die passenden Tutorials.

---

## Kapitelübersicht

Dieses Kapitel enthält 5 Tutorials, die den vollständigen Einstieg in Clawdbot abdecken: Von der Installation der Software, Konfiguration von KI-Modellen und Kommunikationskanälen, über den Start des Gateway-Dienstes, das Senden der ersten Nachricht bis zum Verständnis des Standardschutzmechanismus. Nach Abschluss dieses Kapitels hast du einen funktionsfähigen persönlichen KI-Assistenten.

---

## Empfohlener Lernpfad

Wir empfehlen, diese Tutorials in folgender Reihenfolge zu durchlaufen:

```mermaid
flowchart LR
    A[getting-started<br>Schnellstart] --> B[onboarding-wizard<br>Assistent-gestützte Konfiguration]
    B --> C[gateway-startup<br>Gateway starten]
    C --> D[first-message<br>Erste Nachricht senden]
    D --> E[pairing-approval<br>DM-Pairing & Zugriffskontrolle]

    style A fill:#3b82f6,color:#fff
    style B fill:#10b981,color:#fff
    style C fill:#f59e0b,color:#fff
    style D fill:#8b5cf6,color:#fff
    style E fill:#ef4444,color:#fff
```

**Erläuterung zur Lernreihenfolge**:

1. **Schnellstart** (obligatorisch): Basisinstallation und -konfiguration abschließen – Grundlage für alle weiteren Lerninhalte
2. **Assistent-gestützte Konfiguration** (empfohlen): Tiefere Einblicke in die Optionen des Assistenten, geeignet für Nutzer mit Bedarf an detaillierter Konfiguration
3. **Gateway starten** (obligatorisch): Verstehen, wie der Gateway-Dienst gestartet und verwaltet wird
4. **Erste Nachricht senden** (obligatorisch): Konfiguration verifizieren und KI-Assistenten nutzen
5. **DM-Pairing & Zugriffskontrolle** (empfohlen): Standardschutzmechanismen verstehen, um deinen KI-Assistenten zu schützen

::: tip Schneller Einstieg
Wenn du nur eine schnelle Testerfahrung möchtest, kannst du nur die Tutorials „Schnellstart" und „Gateway starten" durchgehen und direkt eine Nachricht senden. Die anderen Tutorials kannst du bei Bedarf später nachholen.
:::

---

## Voraussetzungen

Bevor du dieses Kapitel bearbeitest, stelle bitte sicher, dass folgende Voraussetzungen erfüllt sind:

- **Node.js**: ≥ 22.12.0 (mit `node -v` prüfen)
- **Betriebssystem**: macOS / Linux / Windows (WSL2)
- **Paketmanager**: npm / pnpm / bun
- **KI-Modell-Konto** (empfohlen):
  - Anthropic Claude-Konto (Pro/Max-Abonnement), unterstützt OAuth-Fluss
  - oder API-Key eines anderen Anbieters wie OpenAI / DeepSeek / OpenRouter vorbereiten

::: warning Hinweis für Windows-Nutzer
Auf Windows wird dringend empfohlen, **WSL2** zu verwenden, da:
- Viele Kanäle auf lokale Binärdateien angewiesen sind
- Hintergrunddienste (launchd/systemd) unter Windows nicht verfügbar sind
:::

---

## Unterseiten-Navigation

### [1. Schnellstart](./getting-started/) ⭐ Kern-Tutorial

**Was kannst du nach dem Lernen**:
- ✅ Clawdbot auf deinem Gerät installieren
- ✅ KI-Modell-Authentifizierung konfigurieren (Anthropic / OpenAI / andere Anbieter)
- ✅ Gateway-Dienst starten
- ✅ Erste Nachricht über WebChat oder konfigurierte Kanäle senden

**Zielgruppe**: Alle Nutzer, Pflicht-Tutorial

**Geschätzte Zeit**: 15-20 Minuten

**Hauptinhalte**:
- Clawdbot mit npm/pnpm/bun installieren
- Onboarding-Assistenten ausführen, um Basis-Konfiguration abzuschließen
- Gateway starten und Status überprüfen
- Testnachricht über CLI oder Kanäle senden

**Voraussetzungen**: Keine

---

### [2. Assistent-gestützte Konfiguration](./onboarding-wizard/)

**Was kannst du nach dem Lernen**:
- ✅ Vollständige Konfiguration mit interaktivem Assistenten durchführen
- ✅ Unterschied zwischen QuickStart- und Manual-Modus verstehen
- ✅ Gateway-Netzwerk, Authentifizierung und Tailscale konfigurieren
- ✅ KI-Modell-Anbieter einrichten (setup-token und API-Key)
- ✅ Kommunikationskanäle aktivieren (WhatsApp, Telegram usw.)
- ✅ Skill-Pakete installieren und verwalten

**Zielgruppe**: Nutzer mit Bedarf an detaillierter Konfiguration, Verständnis erweiterter Optionen

**Geschätzte Zeit**: 20-30 Minuten

**Hauptinhalte**:
- QuickStart vs. Manual-Modus: Auswahl
- Gateway-Netzwerk-Konfiguration (Ports, Bindung, Authentifizierung)
- KI-Modell-Authentifizierungsmethoden (setup-token empfohlen)
- Konfigurationsprozess für Kommunikationskanäle
- Einführung in das Skill-System

**Voraussetzungen**: [Schnellstart](./getting-started/)

---

### [3. Gateway starten](./gateway-startup/) ⭐ Kern-Tutorial

**Was kannst du nach dem Lernen**:
- ✅ Gateway-Vordergrundprozess über Kommandozeile starten
- ✅ Gateway als Hintergrunddienst konfigurieren (macOS LaunchAgent / Linux systemd / Windows Scheduled Task)
- ✅ Verschiedene Bindungsmodi (loopback / LAN / Tailnet) und Authentifizierungsmethoden verstehen
- ✅ Zwischen Entwicklungs- und Produktionsmodus wechseln
- ✅ `--force` verwenden, um belegte Ports zu erzwingen

**Zielgruppe**: Alle Nutzer, Pflicht-Tutorial

**Geschätzte Zeit**: 15-20 Minuten

**Hauptinhalte**:
- Vordergrundmodus vs. Dienstmodus
- Auswahl des Bindungsmodus (loopback / LAN / Tailnet / Auto)
- Konfiguration der Authentifizierungsmethode (Token / Passwort / Tailscale Identity)
- Entwicklungsmodus (`--dev`) und Produktionsmodus
- Dienstverwaltungsbefehle (install / start / stop / restart)
- Behandlung von Port-Konflikten (`--force`)

**Voraussetzungen**: [Assistent-gestützte Konfiguration](./onboarding-wizard/)

---

### [4. Erste Nachricht senden](./first-message/) ⭐ Kern-Tutorial

**Was kannst du nach dem Lernen**:
- ✅ Nachricht über WebChat-Oberfläche senden
- ✅ Über konfigurierte Kanäle (WhatsApp / Telegram / Slack usw.) mit KI-Assistenten kommunizieren
- ✅ Nachrichten-Routing und Antwortabläufe verstehen
- ✅ Grundlegende Aufgaben mit KI-Assistenten ausführen (Abfragen, Zusammenfassungen, Code-Generierung usw.)

**Zielgruppe**: Alle Nutzer, Pflicht-Tutorial

**Geschätzte Zeit**: 10-15 Minuten

**Hauptinhalte**:
- Nutzung der WebChat-Oberfläche
- Nachrichtenversand über verschiedene Kanäle
- Nachrichtenformat und Antwortmechanismus
- Beispiele für häufige Aufgaben (Informationen abfragen, Code generieren, Text zusammenfassen)
- Debugging und Fehlerbehebung

**Voraussetzungen**: [Gateway starten](./gateway-startup/)

---

### [5. DM-Pairing & Zugriffskontrolle](./pairing-approval/)

**Was kannst du nach dem Lernen**:
- ✅ Standardmäßigen DM-Pairing-Schutzmechanismus verstehen
- ✅ Pairing-Anfragen unbekannter Absender genehmigen oder ablehnen
- ✅ Whitelist und Blacklist konfigurieren
- ✅ Zugriffskontrollrichtlinien einstellen
- ✅ Pairing-Modi und Sicherheits-Best-Practices verstehen

**Zielgruppe**: Sicherheitsbewusste Nutzer, empfohlene Lektüre

**Geschätzte Zeit**: 10-15 Minuten

**Hauptinhalte**:
- Funktionsweise des DM-Pairing-Mechanismus
- Pairing-Ablauf und Nutzererlebnis
- Whitelist- und Blacklist-Konfiguration
- Einstellung der Zugriffskontrollrichtlinien
- Sicherheits-Best-Practices

**Voraussetzungen**: [Erste Nachricht senden](./first-message/)

---

## Häufig gestellte Fragen

### F: Sollte ich alle Tutorials durchlaufen?

**A**: Nicht unbedingt. Wenn du schnell einsteigen möchtest, reichen die beiden Kern-Tutorials „Schnellstart" und „Gateway starten", dann kannst du direkt mit Clawdbot loslegen. Die anderen Tutorials kannst du bei Bedarf später nachholen.

### F: Hat es Auswirkungen, wenn ich bestimmte Tutorials überspringe?

**A**: Nein. Jedes Tutorial ist eigenständig, aber „Schnellstart" ist die Grundlage und enthält Installation und Basis-Konfiguration – daher empfohlen als Erstes. Die anderen Tutorials kannst du je nach Bedarf auswählen.

### F: Ich bin bereits mit KI-Assistenten vertraut, kann ich die Basis-Tutorials überspringen?

**A**: Ja. Wenn du bereits mit ähnlichen KI-Assistenten-Tools vertraut bist, kannst du „Schnellstart" überspringen und direkt „Assistent-gestützte Konfiguration" und „Gateway starten" durcharbeiten, um die spezifische Konfiguration und Startweise von Clawdbot kennenzulernen.

### F: Was kann ich nach Abschluss dieses Kapitels tun?

**A**: Nach Abschluss hast du ein funktionsfähiges Clawdbot-System und kannst:
- Über WebChat oder mehrere Kanäle mit dem KI-Assistenten kommunizieren
- Der KI grundlegende Aufgaben zuweisen (Informationen abfragen, Code generieren, Text zusammenfassen usw.)
- Sicherheit durch DM-Pairing-Mechanismus gewährleisten
- Fortgeschrittene Funktionen erlernen (Multi-Channel-Konfiguration, Tool-System, Skill-Plattform usw.)

---

## Nächste Schritte

Nach Abschluss dieses Kapitels kannst du folgende Themen vertiefen:

- **[Übersicht Multi-Channel-System](../../platforms/channels-overview/)**: Alle von Clawdbot unterstützten Kommunikationskanäle und deren Merkmale kennenlernen
- **[WhatsApp-Kanal](../../platforms/whatsapp/)**: Vertiefte Einblicke in Konfiguration und Nutzung des WhatsApp-Kanals
- **[Telegram-Kanal](../../platforms/telegram/)**: Vertiefte Einblicke in Konfiguration und Nutzung des Telegram-Kanals
- **[WebChat-Oberfläche](../../platforms/webchat/)**: Funktionen der integrierten WebChat-Oberfläche kennenlernen

::: tip Hinweis
Wähle je nach Nutzungsbedarf die entsprechenden Kanäle für vertieftes Lernen aus. Wenn du hauptsächlich einen bestimmten Kanal nutzt (z.B. WhatsApp oder Telegram), kannst du dessen spezielles Tutorial priorisieren.
:::

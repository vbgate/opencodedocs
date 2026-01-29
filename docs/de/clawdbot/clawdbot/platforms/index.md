---
title: "Mehrkanal-Systeme & Plattformen | Clawdbot-Tutorial"
sidebarTitle: "Integration gängiger Chat-Tools"
subtitle: "Mehrkanal-Systeme & Plattformen"
description: "Lernen Sie, wie Sie das Mehrkanal-System von Clawdbot konfigurieren und verwenden, einschließlich WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage, LINE, WebChat, macOS, iOS und Android."
tags:
  - "Kanäle"
  - "Plattformen"
  - "Integration"
order: 60
---

# Mehrkanal-Systeme & Plattformen

Clawdbot unterstützt über die einheitliche Gateway-Kontrollebene verschiedene Kommunikationskanäle und Plattformen, sodass Sie auf einer vertrauten Oberfläche mit Ihrem AI-Assistenten interagieren können.

## Kapitelübersicht

In diesem Kapitel werden alle von Clawdbot unterstützten Kommunikationskanäle und Plattformen vorgestellt, darunter Instant-Messaging-Anwendungen (WhatsApp, Telegram, Slack, Discord usw.), mobile Nodes (iOS, Android) und Desktop-Anwendungen (macOS). Erfahren Sie, wie Sie diese Kanäle konfigurieren, damit der AI-Assistent nahtlos in Ihren täglichen Arbeitsablauf integriert wird.
## Unterseitennavigation

### Kanalübersicht

- **[Übersicht des Mehrkanal-Systems](channels-overview/)** - Erfahren Sie mehr über alle von Clawdbot unterstützten Kommunikationskanäle und deren Funktionen sowie die grundlegenden Konzepte der Kanalkonfiguration.

### Instant-Messaging-Kanäle

- **[WhatsApp](whatsapp/)** - Konfigurieren und verwenden Sie den WhatsApp-Kanal (basierend auf Baileys) mit Unterstützung für Geräteverbindung und Gruppenverwaltung.
- **[Telegram](telegram/)** - Konfigurieren und verwenden Sie den Telegram-Kanal (basierend auf grammY Bot API) mit Einrichtung von Bot-Token und Webhook.
- **[Slack](slack/)** - Konfigurieren und verwenden Sie den Slack-Kanal (basierend auf Bolt) für die Integration in Ihren Arbeitsbereich.
- **[Discord](discord/)** - Konfigurieren und verwenden Sie den Discord-Kanal (basierend auf discord.js) mit Unterstützung für Server und Kanäle.
- **[Google Chat](googlechat/)** - Konfigurieren und verwenden Sie den Google Chat-Kanal für die Integration mit Google Workspace.
- **[Signal](signal/)** - Konfigurieren und verwenden Sie den Signal-Kanal (basierend auf signal-cli) für privatsphäreschützende Kommunikation.
- **[iMessage](imessage/)** - Konfigurieren und verwenden Sie den iMessage-Kanal (macOS-exklusiv) für die Integration mit der macOS-Nachrichten-App.
- **[LINE](line/)** - Konfigurieren und verwenden Sie den LINE-Kanal (Messaging API) für die Interaktion mit LINE-Benutzern.

### Web & Native Anwendungen

- **[WebChat-Oberfläche](webchat/)** - Verwenden Sie die integrierte WebChat-Oberfläche zur Interaktion mit dem AI-Assistenten, ohne externe Kanäle konfigurieren zu müssen.
- **[macOS-Anwendung](macos-app/)** - Erfahren Sie mehr über die Funktionen der macOS-Menüleistenanwendung, einschließlich Voice Wake, Talk Mode und Fernsteuerung.
- **[iOS-Node](ios-node/)** - Konfigurieren Sie die iOS-Node zur Ausführung lokaler Geräteoperationen (Camera, Canvas, Voice Wake).
- **[Android-Node](android-node/)** - Konfigurieren Sie die Android-Node zur Ausführung lokaler Geräteoperationen (Camera, Canvas).
## Empfohlener Lernpfad

Je nach Ihrem Anwendungsfall wird die folgende Lernreihenfolge empfohlen:

### Schnelleinsteigung für Anfänger

Wenn Sie Clawdbot zum ersten Mal verwenden, wird empfohlen, die folgenden Schritte in dieser Reihenfolge zu lernen:

1. **[Übersicht des Mehrkanal-Systems](channels-overview/)** - Verstehen Sie zuerst die Gesamtarchitektur und die Kanalkonzepte
2. **[WebChat-Oberfläche](webchat/)** - Die einfachste Methode, ohne Konfiguration sofort loszulegen
3. **Wählen Sie einen gängigen Kanal** - Wählen Sie basierend auf Ihren täglichen Gewohnheiten:
   - Tägliches Chatten → [WhatsApp](whatsapp/) oder [Telegram](telegram/)
   - Teamzusammenarbeit → [Slack](slack/) oder [Discord](discord/)
   - macOS-Benutzer → [iMessage](imessage/)

### Mobile Integration

Wenn Sie Clawdbot auf Ihrem Handy verwenden möchten:

1. **[iOS-Node](ios-node/)** - Konfigurieren Sie die lokalen Funktionen auf iPhone/iPad
2. **[Android-Node](android-node/)** - Konfigurieren Sie die lokalen Funktionen auf Android-Geräten
3. **[macOS-Anwendung](macos-app/)** - Verwenden Sie die macOS-Anwendung als Steuerungszentrum

### Unternehmensweite Bereitstellung

Wenn Sie in einer Teamumgebung bereitstellen müssen:

1. **[Slack](slack/)** - Integration mit dem Team-Arbeitsbereich
2. **[Discord](discord/)** - Einrichten eines Community-Servers
3. **[Google Chat](googlechat/)** - Integration mit Google Workspace
## Voraussetzungen

Bevor Sie mit diesem Kapitel beginnen, wird empfohlen, Folgendes abzuschließen:

- **[Schnellstart](../start/getting-started/)** - Führen Sie die Installation und die Grundkonfiguration von Clawdbot durch
- **[Assistentenbasierte Konfiguration](../start/onboarding-wizard/)** - Führen Sie die Grundeinstellungen für Gateway und Kanäle mit dem Assistenten durch

::: tip Hinweis
Wenn Sie die assistentengestützte Konfiguration bereits abgeschlossen haben, sind einige Kanäle möglicherweise bereits automatisch konfiguriert. Sie können wiederholte Konfigurationsschritte überspringen und direkt erweiterte Funktionen für bestimmte Kanäle prüfen.
:::
## Nächste Schritte

Nach Abschluss dieses Kapitels können Sie weiter erkunden:

- **[AI-Modell- und Authentifizierungskonfiguration](../advanced/models-auth/)** - Konfigurieren Sie verschiedene AI-Modellanbieter
- **[Sitzungsverwaltung und Multi-Agent](../advanced/session-management/)** - Lernen Sie die Sitzungsisolierung und die Zusammenarbeit von Sub-Agenten
- **[Tools-System](../advanced/tools-browser/)** - Verwenden Sie Tools wie Browser-Automatisierung, Befehlsausführung usw.
## Häufig gestellte Fragen

::: details Kann ich mehrere Kanäle gleichzeitig verwenden?
Ja! Clawdbot unterstützt die gleichzeitige Aktivierung mehrerer Kanäle. Sie können auf verschiedenen Kanälen Nachrichten empfangen und senden, alle Nachrichten werden über den einheitlichen Gateway verarbeitet.
:::

::: details Welcher Kanal wird am meisten empfohlen?
Das hängt von Ihrem Anwendungsfall ab:
- **WebChat** - Am einfachsten, keine Konfiguration erforderlich
- **WhatsApp** - Geeignet für Chats mit Freunden und Familie
- **Telegram** - Bot API stabil, geeignet für automatische Antworten
- **Slack/Discord** - Geeignet für Teamzusammenarbeit
:::

::: details Ist die Konfiguration von Kanälen kostenpflichtig?
Die meisten Kanäle sind selbst kostenlos, aber einige Kanäle können Kosten verursachen:
- WhatsApp Business API - Kann Gebühren verursachen
- Google Chat - Erfordert Google Workspace-Konto
- Andere Kanäle - Normalerweise kostenlos, nur Beantragung von Bot-Token erforderlich
:::

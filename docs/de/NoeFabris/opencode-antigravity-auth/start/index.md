---
title: "Schnellstart: Antigravity Auth Installation & Konfiguration | OpenCode"
sidebarTitle: "In 10 Minuten startklar"
subtitle: "Schnellstart: Antigravity Auth Installation & Konfiguration"
description: "Lernen Sie die Installation und Konfiguration des Antigravity Auth Plugins. Schließen Sie die Google OAuth-Authentifizierung in 10 Minuten ab, senden Sie die erste Modellanfrage und verifizieren Sie den erfolgreichen Zugriff auf Claude- und Gemini-Modelle."
order: 1
---

# Schnellstart

Dieses Kapitel hilft Ihnen, das Antigravity Auth Plugin von Grund auf zu nutzen. Sie erfahren mehr über den Kernwert des Plugins, schließen die Installation und OAuth-Authentifizierung ab und senden eine erste Modellanfrage, um zu überprüfen, ob die Konfiguration erfolgreich ist.

## Lernpfad

Lernen Sie in der folgenden Reihenfolge, wobei jeder Schritt auf dem vorherigen aufbaut:

### 1. [Plugin-Übersicht](./what-is-antigravity-auth/)

Erfahren Sie mehr über den Kernwert, die Anwendungsszenarien und Risikohinweise des Antigravity Auth Plugins.

- Beurteilen Sie, ob das Plugin für Ihr Anwendungsszenario geeignet ist
- Lernen Sie die unterstützten KI-Modelle kennen (Claude Opus 4.5, Sonnet 4.5, Gemini 3 Pro/Flash)
- Verstehen Sie die Nutzungsrisiken und Hinweise

### 2. [Schnellinstallation](./quick-install/)

Schließen Sie die Plugin-Installation und erste Authentifizierung in 5 Minuten ab.

- Zwei Installationsmethoden (KI-gestützt / Manuelle Konfiguration)
- Modelldefinitionen konfigurieren
- Google OAuth-Authentifizierung durchführen

### 3. [OAuth 2.0 PKCE-Authentifizierung](./first-auth-login/)

Verstehen Sie den OAuth 2.0 PKCE-Authentifizierungsablauf und schließen Sie die erste Anmeldung ab.

- Verstehen Sie den Sicherheitsmechanismus der PKCE-Authentifizierung
- Schließen Sie die erste Anmeldung ab, um API-Zugriff zu erhalten
- Erfahren Sie mehr über die automatisierte Token-Aktualisierung

### 4. [Erste Anfrage](./first-request/)

Senden Sie eine erste Modellanfrage und überprüfen Sie, ob die Installation erfolgreich war.

- Senden Sie Ihre erste Antigravity-Modellanfrage
- Verstehen Sie die `--model`- und `--variant`-Parameter
- Beheben Sie häufige Modellanfragefehler

## Voraussetzungen

Bevor Sie mit diesem Kapitel beginnen, stellen Sie bitte sicher:

- ✅ OpenCode CLI ist installiert (Befehl `opencode` verfügbar)
- ✅ Ein verwendbares Google-Konto ist vorhanden (für OAuth-Authentifizierung)

## Nächste Schritte

Nach Abschluss des Schnellstarts können Sie:

- **[Verfügbare Modelle kennenlernen](../platforms/available-models/)** — Entdecken Sie alle unterstützten Modelle und deren Variantenkonfigurationen
- **[Mehrere Konten konfigurieren](../advanced/multi-account-setup/)** — Richten Sie mehrere Google-Konten ein, um Kontingente zu bündeln
- **[Häufige Authentifizierungsprobleme](../faq/common-auth-issues/)** — Konsultieren Sie die Fehlerbehebungsanleitung bei Problemen

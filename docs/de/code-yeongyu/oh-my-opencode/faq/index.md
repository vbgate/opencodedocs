---
title: "FAQ und Fehlerbehebung | oh-my-opencode"
sidebarTitle: "FAQ"
subtitle: "FAQ und Fehlerbehebung | oh-my-opencode"
description: "Lernen Sie die Diagnose und Lösung häufiger Probleme mit oh-my-opencode. Beherrschen Sie die Konfigurationsdiagnose, die Fehlersuche bei der Installation, Nutzungstipps und Sicherheitsempfehlungen."
order: 150
---

# FAQ und Fehlerbehebung

Dieses Kapitel hilft Ihnen, häufige Probleme zu lösen, die bei der Verwendung von oh-my-opencode auftreten, von der Konfigurationsdiagnose bis zu Nutzungstipps und Sicherheitsempfehlungen, damit Sie Probleme schnell lokalisieren und Lösungen finden können.

## Lernpfad

Befolgen Sie diese Sequenz, um die Fehlerbehebung und Best Practices schrittweise zu meistern:

### 1. [Konfigurationsdiagnose und Fehlerbehebung](./troubleshooting/)

Lernen Sie, den Doctor-Befehl zu verwenden, um Konfigurationsprobleme schnell zu diagnostizieren und zu beheben.
- Führen Sie den Doctor-Befehl für eine vollständige Systemprüfung durch
- Interpretieren Sie 17+ Prüfungsergebnisse (Installation, Konfiguration, Authentifizierung, Abhängigkeiten, Tools, Updates)
- Lokalisieren und beheben Sie häufige Konfigurationsprobleme
- Verwenden Sie den Verbose-Modus und die JSON-Ausgabe für erweiterte Diagnosen

### 2. [Häufig gestellte Fragen](./faq/)

Finden und lösen Sie häufige Probleme bei der Nutzung.
- Schnelle Antworten zu Installations- und Konfigurationsproblemen
- Nutzungstipps und Best Practices (ultrawork, Proxy-Aufrufe, Hintergrundtasks)
- Claude Code-Kompatibilitätshinweise
- Sicherheitswarnungen und Empfehlungen zur Leistungsoptimierung
- Beiträge und Hilferessourcen

## Voraussetzungen

Bevor Sie mit diesem Kapitel beginnen, stellen Sie sicher:
- Sie haben die [Schnellinstallation und -konfiguration](../start/installation/) abgeschlossen
- Sie sind mit der grundlegenden Struktur der oh-my-opencode-Konfigurationsdatei vertraut
- Sie haben ein spezifisches Problem festgestellt oder möchten Best Practices verstehen

::: tip Empfohlene Lesezeit
Nach Abschluss der grundlegenden Installation empfehlen wir, zuerst die FAQ durchzulesen, um häufige Fallstricke und Best Practices zu verstehen. Wenn Sie auf spezifische Probleme stoßen, verwenden Sie die Fehlerbehebungstools zur Diagnose.
:::

## Schnellanleitung zur Fehlerbehebung

Wenn Sie auf ein dringendes Problem stoßen, befolgen Sie diese Schritte zur schnellen Fehlerbehebung:

```bash
# Schritt 1: Führen Sie eine vollständige Diagnose durch
bunx oh-my-opencode doctor

# Schritt 2: Detaillierte Fehlerinformationen anzeigen
bunx oh-my-opencode doctor --verbose

# Schritt 3: Prüfen Sie eine bestimmte Kategorie (z. B. Authentifizierung)
bunx oh-my-opencode doctor --category authentication

# Schritt 4: Wenn das Problem weiterhin besteht, prüfen Sie die FAQ
# oder suchen Sie Hilfe in den GitHub Issues
```

## Nächste Schritte

Nach Abschluss dieses Kapitels können Sie weiterlernen:
- **[Claude Code-Kompatibilität](../appendix/claude-code-compatibility/)** - Erfahren Sie mehr über die vollständige Kompatibilitätsunterstützung mit Claude Code
- **[Konfigurationsreferenz](../appendix/configuration-reference/)** - Anzeigen des vollständigen Konfigurationsdatei-Schemas und der Feldbeschreibungen
- **[Eingebaute MCP-Server](../appendix/builtin-mcps/)** - Erfahren Sie, wie Sie eingebaute MCP-Server verwenden

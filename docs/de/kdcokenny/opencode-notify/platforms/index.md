---
title: "Plattformen & Integration: macOS, Windows, Linux Terminal-Funktionen und Support | opencode-notify"
sidebarTitle: "Für deine Plattform optimieren"
subtitle: "Plattformen & Integration"
description: "Lernen Sie die Funktionsunterschiede von opencode-notify auf macOS, Windows und Linux kennen. Beherrschen Sie Terminal-Support (37+ Terminal-Emulatoren), Fokus-Erkennung, Klick-Fokussierung und benutzerdefinierte Sounds. Dieses Kapitel enthält Plattform-Funktionsvergleiche, Terminal-Erkennungsmechanismen und Konfigurationsanleitungen."
tags:
  - "Plattform-Funktionen"
  - "Terminal-Support"
  - "Systemkompatibilität"
prerequisite:
  - "start-quick-start"
  - "start-how-it-works"
order: 2
---

# Plattformen & Integration

Dieses Kapitel hilft Ihnen, die Funktionsunterschiede von opencode-notify auf verschiedenen Betriebssystemen zu verstehen, plattformspezifische Konfigurationen zu beherrschen und das Beste aus Ihrem Terminal herauszuholen.

## Lernpfad

### 1. [macOS-Plattformfunktionen](../macos/)

Umfassender Überblick über erweiterte Funktionen unter macOS, einschließlich intelligenter Fokus-Erkennung, Klick-Fokussierung bei Benachrichtigungen und benutzerdefinierter Sounds.

- Fokus-Erkennung: Automatische Erkennung, ob das Terminal das aktive Fenster ist
- Klick-Fokussierung: Automatischer Wechsel zum Terminal beim Klicken auf eine Benachrichtigung
- Benutzerdefinierte Sounds: Individuelle Sounds für verschiedene Ereignisse konfigurieren
- 37+ Terminal-Support: Einschließlich Ghostty, iTerm2, VS Code integriertes Terminal und mehr

### 2. [Windows-Plattformfunktionen](../windows/)

Beherrschen Sie die Grundlagen der Benachrichtigungen und Konfigurationsmethoden unter Windows.

- Native Benachrichtigungen: Nutzung des Windows 10/11 Benachrichtigungscenters
- Benachrichtigungsberechtigungen: Sicherstellen, dass OpenCode Benachrichtigungen senden darf
- Grundkonfiguration: Speicherort der Konfigurationsdatei unter Windows
- Einschränkungen: Windows unterstützt derzeit keine Fokus-Erkennung

### 3. [Linux-Plattformfunktionen](../linux/)

Verstehen Sie den Benachrichtigungsmechanismus und die Abhängigkeitsinstallation unter Linux.

- libnotify-Integration: Benachrichtigungen mit notify-send senden
- Desktop-Umgebungsunterstützung: GNOME, KDE Plasma, XFCE und andere gängige Umgebungen
- Abhängigkeitsinstallation: Installationsbefehle für verschiedene Distributionen
- Einschränkungen: Linux unterstützt derzeit keine Fokus-Erkennung

### 4. [Unterstützte Terminals](../terminals/)

Übersicht über alle 37+ unterstützten Terminal-Emulatoren und den automatischen Erkennungsmechanismus.

- Terminal-Erkennung: Wie Ihr Terminal-Typ automatisch erkannt wird
- Terminal-Liste: Vollständige Liste der unterstützten Terminals
- Manuelle Konfiguration: Wie Sie das Terminal manuell angeben, wenn die automatische Erkennung fehlschlägt
- Spezielle Terminals: Behandlung von VS Code integriertem Terminal und Remote-SSH-Sitzungen

## Voraussetzungen

::: warning Bevor Sie dieses Kapitel beginnen, stellen Sie sicher, dass Sie Folgendes abgeschlossen haben

- ✅ **[Schnellstart](../../start/quick-start/)**: opencode-notify Installation abgeschlossen
- ✅ **[Funktionsweise](../../start/how-it-works/)**: Verständnis der vier Benachrichtigungstypen und des intelligenten Filtermechanismus

:::

## Plattformauswahl-Empfehlungen

Wählen Sie das entsprechende Kapitel basierend auf Ihrem Betriebssystem:

| Betriebssystem | Empfohlene Lernreihenfolge | Kernfunktionen |
| --- | --- | --- |
| **macOS** | 1. macOS-Plattformfunktionen → 4. Unterstützte Terminals | Fokus-Erkennung, Klick-Fokussierung, benutzerdefinierte Sounds |
| **Windows** | 2. Windows-Plattformfunktionen → 4. Unterstützte Terminals | Native Benachrichtigungen, Grundkonfiguration |
| **Linux** | 3. Linux-Plattformfunktionen → 4. Unterstützte Terminals | libnotify-Integration, Abhängigkeitsinstallation |

::: tip Allgemeine Empfehlung
Unabhängig von Ihrer Plattform lohnt es sich, Lektion 4 „Unterstützte Terminals" zu lernen. Sie hilft Ihnen, den Terminal-Erkennungsmechanismus zu verstehen und Konfigurationsprobleme zu lösen.
:::

## Funktionsvergleichstabelle

| Funktion | macOS | Windows | Linux |
| --- | --- | --- | --- |
| Native Benachrichtigungen | ✅ | ✅ | ✅ |
| Terminal-Fokus-Erkennung | ✅ | ❌ | ❌ |
| Klick-Fokussierung | ✅ | ❌ | ❌ |
| Benutzerdefinierte Sounds | ✅ | ✅ | ✅ (teilweise) |
| Ruhezeiten | ✅ | ✅ | ✅ |
| Übergeordnete Sitzungsprüfung | ✅ | ✅ | ✅ |
| 37+ Terminal-Support | ✅ | ✅ | ✅ |
| Automatische Terminal-Erkennung | ✅ | ✅ | ✅ |

## Nächste Schritte

Nach Abschluss dieses Kapitels werden Sie die Funktionsunterschiede und Konfigurationsmethoden der verschiedenen Plattformen verstehen.

Empfohlene Fortsetzung:

### [Erweiterte Konfiguration](../../advanced/config-reference/)

Vertiefen Sie Ihr Wissen über alle Optionen der Konfigurationsdatei und beherrschen Sie fortgeschrittene Konfigurationstechniken.

- Vollständige Konfigurationsreferenz: Detaillierte Beschreibung aller Konfigurationsoptionen
- Ruhezeiten im Detail: Einrichtung und Funktionsweise
- Terminal-Erkennungsprinzip: Interne Mechanismen der automatischen Erkennung
- Fortgeschrittene Nutzung: Konfigurationstipps und Best Practices

### [Fehlerbehebung](../../faq/troubleshooting/)

Bei Problemen finden Sie hier Lösungen für häufige Fehler.

- Benachrichtigungen werden nicht angezeigt: Berechtigungs- und Systemeinstellungsprobleme
- Fokus-Erkennung funktioniert nicht: Terminal-Konfiguration und Erkennungsmechanismus
- Konfigurationsfehler: Format und Feldbeschreibungen der Konfigurationsdatei
- Sound-Probleme: Sound-Konfiguration und Systemkompatibilität

::: info Lernpfad-Empfehlung
Wenn Sie gerade erst anfangen, empfehlen wir die Reihenfolge **Plattform-Kapitel → Erweiterte Konfiguration → Fehlerbehebung**. Bei konkreten Problemen können Sie direkt zum Kapitel Fehlerbehebung springen.
:::

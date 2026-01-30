---
title: "Erweiterte Funktionen: Multi-Account-Verwaltung | Antigravity Auth"
sidebarTitle: "Multi-Account-Master"
subtitle: "Erweiterte Funktionen: Multi-Account-Verwaltung"
description: "Beherrschen Sie die erweiterten Funktionen des Antigravity Auth-Plugins. Vertiefen Sie Ihr Wissen über Kernmechanismen wie Multi-Account-Load-Balancing, intelligente Account-Auswahl, Ratenbegrenzungsbehandlung, Sitzungswiederherstellung und Anfragetransformation."
order: 3
---

# Erweiterte Funktionen

Dieses Kapitel hilft Ihnen, die erweiterten Funktionen des Antigravity Auth-Plugins tiefgreifend zu beherrschen, einschließlich Multi-Account-Load-Balancing, intelligenter Account-Auswahl, Ratenbegrenzungsbehandlung, Sitzungswiederherstellung, Anfragetransformation und anderen Kernmechanismen. Ob Sie die Quota-Auslastung optimieren oder komplexe Probleme beheben möchten – hier finden Sie die Antworten, die Sie benötigen.

## Voraussetzungen

::: warning Stellen Sie vor dem Start sicher, dass
- ✅ Sie die [Schnellinstallation](../start/quick-install/) abgeschlossen und Ihren ersten Account erfolgreich hinzugefügt haben
- ✅ Sie die [erste Authentifizierung](../start/first-auth-login/) durchgeführt und den OAuth-Ablauf verstanden haben
- ✅ Sie die [erste Anfrage](../start/first-request/) gesendet und die korrekte Funktionsweise des Plugins verifiziert haben
:::

## Lernpfad

### 1. [Multi-Account-Einrichtung](./multi-account-setup/)

Konfigurieren Sie mehrere Google-Accounts, um Quota-Pooling und Load-Balancing zu implementieren.

- Fügen Sie mehrere Accounts hinzu, um die Gesamtobergrenze für Quota zu erhöhen
- Verstehen Sie das doppelte Quota-System (Antigravity + Gemini CLI)
- Wählen Sie die passende Anzahl an Accounts basierend auf Ihrem Anwendungsfall

### 2. [Account-Auswahlstrategien](./account-selection-strategies/)

Beherrschen Sie die bewährten Verfahren für die drei Account-Auswahlstrategien: sticky, round-robin und hybrid.

- 1 Account → sticky-Strategie behält Prompt-Cache bei
- 2-3 Accounts → hybrid-Strategie verteilt Anfragen intelligent
- 4+ Accounts → round-robin-Strategie maximiert Durchsatz

### 3. [Ratenbegrenzungsbehandlung](./rate-limit-handling/)

Verstehen Sie die Erkennung von Ratenbegrenzungen, automatische Wiederholungen und Account-Wechselmechanismen.

- Unterscheiden Sie 5 verschiedene Typen von 429-Fehlern
- Verstehen Sie den exponentiellen Backoff-Algorithmus für automatische Wiederholungen
- Beherrschen Sie die automatische Umschaltlogik in Multi-Account-Szenarien

### 4. [Sitzungswiederherstellung](./session-recovery/)

Erfahren Sie mehr über den Sitzungswiederherstellungsmechanismus zur automatischen Behandlung von Tool-Aufruffehlern und Unterbrechungen.

- Automatische Behandlung von tool_result_missing-Fehlern
- Behebung von thinking_block_order-Problemen
- Konfiguration der Optionen auto_resume und session_recovery

### 5. [Anfragetransformationsmechanismus](./request-transformation/)

Verstehen Sie tiefgreifend den Anfragetransformationsmechanismus und wie er Protokollunterschiede verschiedener KI-Modelle kompatibel macht.

- Verstehen Sie die Protokollunterschiede zwischen Claude- und Gemini-Modellen
- Beheben Sie 400-Fehler durch Schema-Inkompatibilitäten
- Optimieren Sie die Thinking-Konfiguration für beste Leistung

### 6. [Konfigurationsleitfaden](./configuration-guide/)

Beherrschen Sie alle Konfigurationsoptionen und passen Sie das Plugin-Verhalten nach Bedarf an.

- Speicherort und Priorität der Konfigurationsdatei
- Einstellungen für Modellverhalten, Account-Rotation und Anwendungsverhalten
- Empfohlene Konfigurationen für Single-Account/Multi-Account/Parallel-Agent-Szenarien

### 7. [Parallel-Agent-Optimierung](./parallel-agents/)

Optimieren Sie die Account-Zuweisung für Parallel-Agent-Szenarien und aktivieren Sie PID-Offset.

- Verstehen Sie Account-Konflikte in Parallel-Agent-Szenarien
- Aktivieren Sie PID-Offset, damit verschiedene Prozesses bevorzugt verschiedene Accounts auswählen
- Kombinieren Sie mit der round-robin-Strategie, um die Multi-Account-Nutzung zu maximieren

### 8. [Debug-Logging](./debug-logging/)

Aktivieren Sie Debug-Logs, um Probleme zu beheben und den Laufzeitstatus zu überwachen.

- Aktivieren Sie Debug-Logging für detaillierte Informationen
- Verstehen Sie verschiedene Log-Levels und deren Anwendungsgebiete
- Interpretieren Sie Log-Inhalte, um Probleme schnell zu lokalisieren

## Nächste Schritte

Nach Abschluss der erweiterten Funktionen können Sie:

- 📖 In den [Häufig gestellten Fragen](../faq/) Lösungen für Probleme bei der Nutzung finden
- 📚 Im [Anhang](../appendix/) mehr über Architekturdesign und vollständige Konfigurationsreferenz lesen
- 🔄 Im [Änderungsprotokoll](../changelog/) die neuesten Funktionen und Änderungen verfolgen

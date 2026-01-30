---
title: "Versionsverlauf: Antigravity Auth Changelog | opencode-antigravity-auth"
sidebarTitle: "Neue Funktionen"
subtitle: "Versionsverlauf: Antigravity Auth Changelog"
description: "Erfahren Sie mehr über den Versionsverlauf des Antigravity Auth Plugins und wichtige Änderungen. Sehen Sie sich neue Funktionen, Bugfixes und Leistungsverbesserungen jeder Version an und erhalten Sie Upgrade-Anleitungen und Kompatibilitätshinweise."
tags:
  - "Versionsverlauf"
  - "Changelog"
  - "Änderungsprotokoll"
order: 1
---

# Versionsverlauf

Dieses Dokument zeichnet den Versionsverlauf des Antigravity Auth Plugins und wichtige Änderungen auf.

::: tip Aktuelle Version
Aktuelle neueste stabile Version: **v1.3.0** (2026-01-17)
:::

## Versionshinweise

### Stabile Version (Stable)
- Umfassend getestet, empfohlen für Produktionsumgebungen
- Versionsnummernformat: `vX.Y.Z` (z.B. v1.3.0)

### Beta-Version (Beta)
- Enthält die neuesten Funktionen, kann instabil sein
- Versionsnummernformat: `vX.Y.Z-beta.N` (z.B. v1.3.1-beta.3)
- Geeignet für frühzeitige Erfahrungen und Feedback

---

## v1.3.x Serie

### v1.3.1-beta.3
**Veröffentlichungsdatum**: 2026-01-22

**Änderungen**:
- Optimiert den Backoff-Algorithmus für `MODEL_CAPACITY_EXHAUSTED`-Fehler, erhöhter Jitter-Bereich

### v1.3.1-beta.2
**Veröffentlichungsdatum**: 2026-01-22

**Änderungen**:
- Entfernt ungenutzte `googleSearch`-Konfigurationsoption
- Fügt ToS (Nutzungsbedingungen) Warnung und Nutzungshinweise zur README hinzu

### v1.3.1-beta.1
**Veröffentlichungsdatum**: 2026-01-22

**Änderungen**:
- Verbessert die Debounce-Logik für Kontowechsel-Benachrichtigungen, reduziert doppelte Hinweise

### v1.3.1-beta.0
**Veröffentlichungsdatum**: 2026-01-20

**Änderungen**:
- Entfernt Submodul-Tracking, stellt tsconfig.json wieder her

### v1.3.0
**Veröffentlichungsdatum**: 2026-01-17

**Wichtige Änderungen**:

**Neue Funktionen**:
- Verwendet die native `toJSONSchema`-Methode von Zod v4 zur Schema-Generierung

**Fixes**:
- Korrigiert Token-Verbrauch-Tests, verwendet `toBeCloseTo` zur Behandlung von Fließkommapräzisionsproblemen
- Verbessert die Testabdeckungsberechnung

**Dokumentationsverbesserungen**:
- Erweitert die Dokumentation zum Load Balancing
- Fügt Formatierungsverbesserungen hinzu

---

## v1.2.x Serie

### v1.2.9-beta.10
**Veröffentlichungsdatum**: 2026-01-17

**Änderungen**:
- Korrigiert Token-Guthaben-Assertionen, verwendet Fließkommapräzisionsabgleich

### v1.2.9-beta.9
**Veröffentlichungsdatum**: 2026-01-16

**Änderungen**:
- Aktualisiert Token-Verbrauch-Tests, verwendet `toBeCloseTo` zur Behandlung von Fließkommapräzision
- Erweitert Gemini-Tool-Wrapper-Funktionalität, fügt Statistik zur Wrapper-Funktionsanzahl hinzu

### v1.2.9-beta.8
**Veröffentlichungsdatum**: 2026-01-16

**Änderungen**:
- Fügt neue Issue-Vorlagen hinzu (Bug-Report und Feature-Request)
- Verbessert die Onboarding-Logik des Projekts

### v1.2.9-beta.7
**Veröffentlichungsdatum**: 2026-01-16

**Änderungen**:
- Aktualisiert Issue-Vorlagen, erfordert beschreibende Titel

### v1.2.9-beta.6
**Veröffentlichungsdatum**: 2026-01-16

**Änderungen**:
- Fügt konfigurierbare Rate-Limit-Wiederholungsverzögerung hinzu
- Verbessert Hostname-Erkennung, unterstützt OrbStack Docker-Umgebung
- Intelligente OAuth-Callback-Server-Adressbindung
- Klärt die Priorität von `thinkingLevel` und `thinkingBudget`

### v1.2.9-beta.5
**Veröffentlichungsdatum**: 2026-01-16

**Änderungen**:
- Verbessert Gemini-Tool-Wrapping, unterstützt `functionDeclarations`-Format
- Stellt sicher, dass benutzerdefinierte Funktionswrapper in `normalizeGeminiTools` korrekt erstellt werden

### v1.2.9-beta.4
**Veröffentlichungsdatum**: 2026-01-16

**Änderungen**:
- Wrappt Gemini-Tools im `functionDeclarations`-Format
- Wendet `toGeminiSchema` in `wrapToolsAsFunctionDeclarations` an

### v1.2.9-beta.3
**Veröffentlichungsdatum**: 2026-01-14

**Änderungen**:
- Aktualisiert Dokumentation und Code-Kommentare, erklärt Hybrid-Strategie-Implementierung
- Vereinfacht die Antigravity-Systemanweisung für Tests

### v1.2.9-beta.2
**Veröffentlichungsdatum**: 2026-01-12

**Änderungen**:
- Korrigiert Gemini 3 Modell-Parsing-Logik, entfernt doppelte Think-Block-Verarbeitung
- Fügt Gemini 3 Modell-Check für angezeigte Think-Hashes hinzu

### v1.2.9-beta.1
**Veröffentlichungsdatum**: 2026-01-08

**Änderungen**:
- Aktualisiert Beta-Version in Plugin-Installationsanweisungen
- Verbessert Kontoverwaltung, stellt sicher, dass aktuelle Authentifizierung zu gespeicherten Konten hinzugefügt wird

### v1.2.9-beta.0
**Veröffentlichungsdatum**: 2026-01-08

**Änderungen**:
- Aktualisiert README, korrigiert Antigravity Plugin URL
- Aktualisiert Schema URL auf NoeFabris Repository

### v1.2.8
**Veröffentlichungsdatum**: 2026-01-08

**Wichtige Änderungen**:

**Neue Funktionen**:
- Gemini 3 Modell-Unterstützung
- Think-Block-Deduplizierungsverarbeitung

**Fixes**:
- Korrigiert Gemini 3 Modell-Parsing-Logik
- Behandlung angezeigter Think-Hashes in der Antwortkonvertierung

**Dokumentationsverbesserungen**:
- Aktualisiert Testskript-Ausgabeumleitung
- Aktualisiert Modelltest-Optionen

### v1.2.7
**Veröffentlichungsdatum**: 2026-01-01

**Wichtige Änderungen**:

**Neue Funktionen**:
- Verbesserte Kontoverwaltung, stellt sicher, dass aktuelle Authentifizierung korrekt gespeichert wird
- Automatische npm-Versionsveröffentlichung über GitHub Actions

**Fixes**:
- Korrigierte Ausgabeumleitung in E2E-Testskripten

**Dokumentationsverbesserungen**:
- Aktualisierte Repository-URL auf NoeFabris

---

## v1.2.6 - v1.2.0 Serie

### v1.2.6
**Veröffentlichungsdatum**: 2025-12-26

**Änderungen**:
- Fügt Workflow zur automatischen Neupublikation von npm-Versionen hinzu

### v1.2.5
**Veröffentlichungsdatum**: 2025-12-26

**Änderungen**:
- Dokumentationsaktualisierung, Versionsnummer auf 1.2.6 korrigiert

### v1.2.4 - v1.2.0
**Veröffentlichungsdatum**: Dezember 2025

**Änderungen**:
- Multi-Account-Load-Balancing-Funktion
- Duales Quotasystem (Antigravity + Gemini CLI)
- Sitzungswiederherstellungsmechanismus
- OAuth 2.0 PKCE-Authentifizierung
- Thinking-Modell-Unterstützung (Claude und Gemini 3)
- Google Search Grounding

---

## v1.1.x Serie

### v1.1.0 und folgende Versionen
**Veröffentlichungsdatum**: November 2025

**Änderungen**:
- Optimierter Authentifizierungsfluss
- Verbesserte Fehlerbehandlung
- Mehr Konfigurationsoptionen hinzugefügt

---

## v1.0.x Serie (frühe Versionen)

### v1.0.4 - v1.0.0
**Veröffentlichungsdatum**: Oktober 2025 und früher

**Anfangsfunktionen**:
- Grundlegende Google OAuth-Authentifizierung
- Antigravity API-Zugriff
- Einfache Modellunterstützung

---

## Versions-Upgrade-Anleitung

### Upgrade von v1.2.x auf v1.3.x

**Kompatibilität**: Vollständig kompatibel, keine Konfigurationsänderungen erforderlich

**Empfohlene Aktionen**:
```bash
# Plugin aktualisieren
opencode plugin update opencode-antigravity-auth

# Installation verifizieren
opencode auth status
```

### Upgrade von v1.1.x auf v1.2.x

**Kompatibilität**: Kontospeicherformat muss aktualisiert werden

**Empfohlene Aktionen**:
```bash
# Bestehende Konten sichern
cp ~/.config/opencode/antigravity-accounts.json ~/.config/opencode/antigravity-accounts.json.bak

# Plugin aktualisieren
opencode plugin update opencode-antigravity-auth@latest

# Neu anmelden (falls Probleme)
opencode auth login
```

### Upgrade von v1.0.x auf v1.2.x

**Kompatibilität**: Kontospeicherformat nicht kompatibel, Neuauthentifizierung erforderlich

**Empfohlene Aktionen**:
```bash
# Plugin aktualisieren
opencode plugin update opencode-antigravity-auth@latest

# Neu anmelden
opencode auth login

# Modellkonfiguration nach neuen Anforderungen hinzufügen
```

---

## Beta-Versionshinweise

**Empfehlungen für Beta-Versionen**:

| Verwendungsszenario | Empfohlene Version | Beschreibung |
| --- | --- | --- |
| Produktionsumgebung | Stabil (vX.Y.Z) | Umfassend getestet, hohe Stabilität |
| Tägliche Entwicklung | Neueste stabile Version | Vollständige Funktionen, weniger Bugs |
| Frühzeitige Erfahrung | Neueste Beta | Neueste Funktionen erlebbar, aber möglicherweise instabil |

**Beta-Version installieren**:

```json
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```

**Auf stabile Version upgraden**:

```bash
opencode plugin update opencode-antigravity-auth@latest
```

---

## Versionsnummern-Erklärung

Versionsnummern folgen der [Semantischen Versionierung 2.0.0](https://semver.org/lang/de/) Spezifikation:

- **Hauptversionsnummer (X)**: Nicht abwärtskompatible API-Änderungen
- **Nebenversionsnummer (Y)**: Abwärtskompatible Funktionserweiterungen
- **Revisionsnummer (Z)**: Abwärtskompatible Fehlerbehebungen

**Beispiele**:
- `1.3.0` → Hauptversion 1, Nebenversion 3, Revision 0
- `1.3.1-beta.3` → 3. Beta-Version von 1.3.1

---

## Update-Benachrichtigungen erhalten

**Automatische Updates** (standardmäßig aktiviert):

```json
{
  "auto_update": true
}
```

**Manuell auf Updates prüfen**:

```bash
# Aktuelle Version anzeigen
opencode plugin list

# Plugin aktualisieren
opencode plugin update opencode-antigravity-auth
```

---

## Download-Links

- **NPM Stabil**: https://www.npmjs.com/package/opencode-antigravity-auth
- **GitHub Releases**: https://github.com/NoeFabris/opencode-antigravity-auth/releases

---

## Beitrag und Feedback

Wenn Sie auf Probleme stoßen oder Funktionsvorschläge haben:

1. Sehen Sie sich den [Fehlerbehebungs-Leitfaden](../../faq/common-auth-issues/) an
2. Reichen Sie ein Problem auf [GitHub Issues](https://github.com/NoeFabris/opencode-antigravity-auth/issues) ein
3. Verwenden Sie die korrekte Issue-Vorlage (Bug Report / Feature Request)

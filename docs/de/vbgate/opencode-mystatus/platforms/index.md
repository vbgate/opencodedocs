---
title: "Plattformfunktionen | opencode-mystatus"
sidebarTitle: "Plattformen"
subtitle: "Plattformfunktionen"
description: "Lernen Sie die Kreditabfragefunktionen verschiedener KI-Plattformen kennen. opencode-mystatus unterstützt OpenAI, Zhipu AI, GitHub Copilot und Google Cloud."
order: 2
---

# Plattformfunktionen

Dieses Kapitel beschreibt ausführlich die Kreditabfragefunktionen der verschiedenen KI-Plattformen, die von opencode-mystatus unterstützt werden.

## Unterstützte Plattformen

opencode-mystatus unterstützt die folgenden 4 Haupt-KI-Plattformen:

| Plattform | Kreditart | Merkmale |
|--- | --- | ---|
| OpenAI | 3 Stunden / 24 Stunden Schiebefenster | Unterstützt Plus, Team, Pro-Abonnements |
| Zhipu AI | 5-Stunden-Token / MCP-monatliche Quote | Unterstützt Coding Plan |
| GitHub Copilot | Monatliche Quote | Zeigt Premium Requests-Nutzung |
| Google Cloud | Nach Modell berechnet | Unterstützt mehrere Konten, 4 Modelle |

## Detaillierte Plattformbeschreibungen

### [OpenAI-Kredit](./openai-usage/)

Erfahren Sie mehr über den Kreditabfrage-Mechanismus von OpenAI:

- Unterschied zwischen 3-Stunden- und 24-Stunden-Schiebefenstern
- Kreditfreigabemechanismus von Teamkonten
- JWT-Token-Analyse zum Abrufen von Kontoinformationen

### [Zhipu AI-Kredit](./zhipu-usage/)

Verstehen Sie die Kreditabfrage von Zhipu AI und Z.ai:

- Berechnungsweise des 5-Stunden-Token-Kredits
- Verwendung der MCP-monatlichen Quote
- Maskierte Anzeige des API-Keys

### [GitHub Copilot-Kredit](./copilot-usage/)

Meistern Sie die Kreditverwaltung von GitHub Copilot:

- Bedeutung von Premium Requests
- Kreditunterschiede verschiedener Abonnementtypen
- Berechnung der monatlichen Rücksetzzeit

### [Google Cloud-Kredit](./google-usage/)

Lernen Sie die Kreditabfrage von mehreren Google Cloud-Konten:

- Unterschiede zwischen den 4 Modellen (G3 Pro, G3 Image, G3 Flash, Claude)
- Verwaltung und Wechsel mehrerer Konten
- Mechanismus zum Lesen der Authentifizierungsdatei

## Auswahlleitfaden

Wählen Sie je nach den verwendeten Plattformen das entsprechende Tutorial:

- **Nur OpenAI verwenden**: Lesen Sie direkt [OpenAI-Kredit](./openai-usage/)
- **Nur Zhipu AI verwenden**: Lesen Sie direkt [Zhipu AI-Kredit](./zhipu-usage/)
- **Multiplattform-Benutzer**: Wir empfehlen, alle Plattformtutorials in Reihenfolge zu lesen
- **Google Cloud-Benutzer**: Sie müssen zuerst das [opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth)-Plugin installieren

## Nächster Schritt

Nach Abschluss dieses Kapitels können Sie mit [Erweiterte Funktionen](../advanced/) fortfahren, um weitere Konfigurationsoptionen kennenzulernen.

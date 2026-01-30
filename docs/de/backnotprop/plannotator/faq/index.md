---
title: "Häufige Fragen: Problemlösung | opencode-plannotator"
sidebarTitle: "Problemlösung"
subtitle: "Häufige Fragen: Problemlösung"
description: "Lernen Sie Lösungen für häufige Probleme mit Plannotator kennen. Beherrschen Sie schnelle Fehlerbehebungsmethoden für Port-Konflikte, nicht geöffnete Browser und Integrationsfehler."
order: 4
---

# Häufige Fragen

Dieses Kapitel hilft Ihnen, verschiedene Probleme bei der Verwendung von Plannotator zu lösen. Egal ob Port-Konflikte, nicht geöffnete Browser oder Integrationsfehler – hier finden Sie entsprechende Lösungen und Debugging-Tipps.

## Inhalt dieses Kapitels

<div class="grid-cards">

<a href="./common-problems/" class="card">
  <h3>🔧 Häufige Probleme</h3>
  <p>Lösen Sie häufige Probleme während der Verwendung, einschließlich Port-Konflikten, nicht geöffneten Browsern, nicht angezeigten Plänen, Git-Fehlern, fehlgeschlagenen Bild-Uploads sowie Problemen mit Obsidian- und Bear-Integration.</p>
</a>

<a href="./troubleshooting/" class="card">
  <h3>🔍 Fehlerbehebung</h3>
  <p>Beherrschen Sie grundlegende Fehlerbehebungsmethoden, einschließlich Protokollanzeige, Fehlerbehandlung und Debugging-Techniken. Lernen Sie, Probleme schnell durch Protokollausgaben zu lokalisieren.</p>
</a>

</div>

## Lernpfad

```
Häufige Fragen → Fehlerbehebung
      ↓               ↓
  Schnelle Lösung    Tiefes Debugging
```

**Empfohlene Reihenfolge**:

1. **Zuerst die häufigen Probleme ansehen**: Die meisten Probleme finden hier sofortige Lösungen
2. **Dann die Fehlerbehebung lernen**: Wenn häufige Probleme nicht abgedeckt sind, lernen Sie, wie Sie Protokolle und Debugging-Techniken zur eigenständigen Fehlerbehebung nutzen

::: tip Tipp bei Problemen
Suchen Sie zunächst in den "Häufigen Fragen" nach Schlüsselwörtern (z. B. "Port", "Browser", "Obsidian") und finden Sie entsprechende Lösungen. Bei komplexeren oder nicht gelisteten Problemen konsultieren Sie bitte die "Fehlerbehebung", um Debugging-Methoden zu lernen.
:::

## Voraussetzungen

Bevor Sie dieses Kapitel durchgehen, sollten Sie Folgendes abgeschlossen haben:

- ✅ [Erste Schritte](../start/getting-started/) - Grundlegende Konzepte von Plannotator verstehen
- ✅ Installation des Claude Code- oder OpenCode-Plugins (eines von beiden):
  - [Claude Code Plugin installieren](../start/installation-claude-code/)
  - [OpenCode Plugin installieren](../start/installation-opencode/)

## Nächste Schritte

Nach Abschluss dieses Kapitels können Sie Folgendes lernen:

- [API-Referenz](../appendix/api-reference/) - Alle API-Endpunkte und Anfrage-/Antwortformate verstehen
- [Datenmodelle](../appendix/data-models/) - Die vom Plannotator verwendeten Datenstrukturen verstehen
- [Umgebungsvariablen-Konfiguration](../advanced/environment-variables/) - Alle verfügbaren Umgebungsvariablen im Detail kennenlernen

<style>
.grid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.grid-cards .card {
  display: block;
  padding: 1.25rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.25s;
}

.grid-cards .card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.grid-cards .card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
}

.grid-cards .card p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.dark .grid-cards .card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}
</style>

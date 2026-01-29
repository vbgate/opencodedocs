---
title: "Schnellstart: Erste Schritte mit Antigravity Tools | Antigravity-Manager"
sidebarTitle: "Loslegen"
subtitle: "Schnellstart: Erste Schritte mit Antigravity Tools"
description: "Lernen Sie den kompletten Einstieg in Antigravity Tools kennen. Von der Installation und Konfiguration bis zum ersten API-Aufruf – verstehen Sie schnell die Kernfunktionen des lokalen Gateways."
order: 1
---

# Schnellstart

Dieses Kapitel führt Sie Schritt für Schritt in die Nutzung von Antigravity Tools ein – von der Installation bis zum ersten erfolgreichen API-Aufruf. Sie lernen die Kernkonzepte, das Kontomanagement, die Datensicherung und wie Sie Ihre AI-Clients mit dem lokalen Gateway verbinden können.

## Kapitelübersicht

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

<a href="./getting-started/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Was sind Antigravity Tools?</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">Aufbau des richtigen mentalen Modells: Lokales Gateway, Protokollkompatibilität, Kernkonzepte der Kontopool-Verteilung und Anwendungsgrenzen.</p>
</a>

<a href="./installation/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Installation & Updates</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">Bester Installationsweg für Desktop (brew / Releases) sowie Behandlung häufiger System-Blockierungen.</p>
</a>

<a href="./first-run-data/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Wichtig beim ersten Start</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">Datenverzeichnis, Protokolle, Taskleiste & Autostart – vermeiden Sie versehentliches Löschen und unwiederbringlichen Datenverlust.</p>
</a>

<a href="./add-account/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Konto hinzufügen</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">OAuth/Refresh-Token-Dualkanal & Best Practices – erstellen Sie Ihren Kontopool auf stabilste Weise.</p>
</a>

<a href="./backup-migrate/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Kontensicherung & -migration</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">Import/Export, V1/DB-Hot-Migration – unterstützt Multi-Machine-Wiederverwendung und Server-Deployment-Szenarien.</p>
</a>

<a href="./proxy-and-first-client/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Reverse-Proxy starten & Client verbinden</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">Vom Dienststart bis zum erfolgreichen externen Client-Aufruf – einmal durch den gesamten Bestätigungszyklus.</p>
</a>

</div>

## Lernpfad

::: tip Empfohlene Reihenfolge
Folgen Sie der folgenden Reihenfolge, um Antigravity Tools am schnellsten kennenzulernen:
:::

```
1. Konzeptverständnis  →  2. Softwareinstallation  →  3. Datenverzeichnis
   getting-started           installation               first-run-data
        ↓                         ↓                          ↓
4. Konto hinzufügen  →  5. Kontensicherung   →  6. Reverse-Proxy starten
   add-account             backup-migrate             proxy-and-first-client
```

| Schritt | Kurs | Geschätzte Zeit | Was Sie lernen |
|---------|------|-----------------|----------------|
| 1 | [Konzeptverständnis](./getting-started/) | 5 Minuten | Was ist ein lokales Gateway und warum brauche ich einen Kontopool? |
| 2 | [Software installieren](./installation/) | 3 Minuten | brew-Installation oder manueller Download, Behandlung von System-Blockierungen |
| 3 | [Datenverzeichnis verstehen](./first-run-data/) | 5 Minuten | Wo werden Daten gespeichert, wie man Protokolle liest, Taskleisten-Operationen |
| 4 | [Konto hinzufügen](./add-account/) | 10 Minuten | OAuth-Autorisierung oder manuelle Eingabe von Refresh Tokens |
| 5 | [Konto sichern](./backup-migrate/) | 5 Minuten | Konten exportieren, geräteübergreifende Migration |
| 6 | [Reverse-Proxy starten](./proxy-and-first-client/) | 10 Minuten | Dienst starten, Client konfigurieren, Aufrufe verifizieren |

**Minimaler Pfad**: Wenn Sie es eilig haben, können Sie nur 1 → 2 → 4 → 6 abschließen und in ca. 25 Minuten mit der Nutzung beginnen.

## Nächste Schritte

Nach Abschluss dieses Kapitels können Sie Antigravity Tools bereits normal verwenden. Danach können Sie bei Bedarf tiefer eintauchen:

- **[Plattformen & Integration](../platforms/)**: Details zur Integration verschiedener Protokolle wie OpenAI, Anthropic, Gemini usw.
- **[Erweiterte Konfiguration](../advanced/)**: Fortgeschrittene Funktionen wie Modell-Routing, Kontingent-Schutz, Hochverfügbarkeits-Verteilung usw.
- **[Häufig gestellte Fragen](../faq/)**: Fehlerbehebungsleitfaden für 401, 429, 404 usw.

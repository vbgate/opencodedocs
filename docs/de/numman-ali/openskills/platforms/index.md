---
title: "Plattformfunktionen: Kernbefehle & Skill-Management | OpenSkills"
sidebarTitle: "Kernoperationen meistern"
subtitle: "Plattformfunktionen: Kernbefehle & Skill-Management | OpenSkills"
description: "Lernen Sie die OpenSkills-Plattformfunktionen kennen, meistern Sie Kernoperationen wie Befehle, Installation, Auflisten, Aktualisieren und Entfernen von Skills, und verstehen Sie die Unterschiede zwischen globaler und projektspezifischer Verwaltung."
order: 2
---

# Plattformfunktionen

Dieses Kapitel behandelt die Kernbefehle und das Skill-Management der OpenSkills CLI im Detail und hilft Ihnen, von "Grundlagenkenntnissen" zu "Expertenwissen" zu gelangen.

## Voraussetzungen

::: warning Bitte vor dem Start bestätigen
Bevor Sie mit diesem Kapitel beginnen, stellen Sie sicher, dass Sie das Kapitel [Schnellstart](../start/) abgeschlossen haben, insbesondere:
- [OpenSkills installieren](../start/installation/): OpenSkills CLI wurde erfolgreich installiert
- [Ersten Skill installieren](../start/first-skill/): Grundlegender Installationsprozess für Skills verstanden
:::

## Inhalt dieses Kapitels

Dieses Kapitel umfasst 6 Themen, die alle Kernfunktionen von OpenSkills abdecken:

### [Befehlsdetails](./cli-commands/)

Vollständige Übersicht über alle 7 Befehle, Parameter und Flags, inklusive Befehlsübersicht. Ideal für Benutzer, die schnell nach Befehlsverwendungen suchen müssen.

### [Installationsquellen im Detail](./install-sources/)

Detaillierte Erklärung der drei Installationsquellen: GitHub-Repositorys, lokale Pfade und private Git-Repositorys. Anwendungsszenarien, Befehlsformate und Hinweise für jede Methode.

### [Globale vs. projektspezifische Installation](./global-vs-project/)

Erklärung der Unterschiede zwischen `--global` und der Standard-Installation (projektspezifisch), um Ihnen bei der Wahl des richtigen Installationsorts zu helfen und die Suchprioritätsregeln für Skills zu verstehen.

### [Installierte Skills auflisten](./list-skills/)

Lernen Sie, den `list`-Befehl zu verwenden, um installierte Skills anzuzeigen, und verstehen Sie die Bedeutung der Standort-Tags `(project)` und `(global)`.

### [Skills aktualisieren](./update-skills/)

Anleitung zur Verwendung des `update`-Befehls zum Aktualisieren installierter Skills, mit Unterstützung für vollständige und spezifische Skill-Aktualisierungen, um Skills mit dem Quell-Repository synchron zu halten.

### [Skills entfernen](./remove-skills/)

Vorstellung von zwei Löschmethoden: dem interaktiven `manage`-Befehl und dem skriptbasierten `remove`-Befehl, um Ihre Skill-Bibliothek effizient zu verwalten.

## Lernpfad

Wählen Sie je nach Ihren Bedürfnissen den passenden Lernpfad:

### Pfad A: Systematisches Lernen (empfohlen für Einsteiger)

Lernen Sie alle Inhalte der Reihe nach, um ein vollständiges Wissenssystem aufzubauen:

```
Befehlsdetails → Installationsquellen → Global vs. Projekt → Skills auflisten → Skills aktualisieren → Skills entfernen
```

### Pfad B: Bedarfsgerechtes Nachschlagen

Springen Sie direkt zu den relevanten Inhalten basierend auf Ihrer aktuellen Aufgabe:

| Was möchten Sie tun? | Lesen Sie diesen Artikel |
| --- | --- |
| Die Verwendung eines bestimmten Befehls nachschlagen | [Befehlsdetails](./cli-commands/) |
| Einen Skill aus einem privaten Repository installieren | [Installationsquellen im Detail](./install-sources/) |
| Entscheiden, ob global oder projektspezifisch installiert werden soll | [Global vs. Projekt](./global-vs-project/) |
| Anzeigen, welche Skills bereits installiert sind | [Installierte Skills auflisten](./list-skills/) |
| Skills auf die neueste Version aktualisieren | [Skills aktualisieren](./update-skills/) |
| Nicht mehr benötigte Skills bereinigen | [Skills entfernen](./remove-skills/) |

## Nächste Schritte

Nach Abschluss dieses Kapitels haben Sie die täglichen Verwendungsfähigkeiten von OpenSkills gemeistert. Als Nächstes können Sie:

- **[Erweiterte Funktionen](../advanced/)**: Lernen Sie erweiterte Funktionen wie den Universal-Modus, benutzerdefinierte Ausgabepfade, symbolische Links und die Erstellung benutzerdefinierter Skills kennen
- **[FAQ](../faq/)**: Konsultieren Sie FAQ und Fehlerbehebungsanleitungen bei Problemen

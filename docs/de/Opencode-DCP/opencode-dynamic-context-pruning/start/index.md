---
title: "Schnellstart: Installation und Konfiguration | opencode-dynamic-context-pruning"
sidebarTitle: "In 5 Minuten loslegen"
subtitle: "Schnellstart: Installation und Konfiguration"
description: "Lernen Sie die Installation und Konfiguration des OpenCode DCP-Plugins kennen. Vollenden Sie die Plugin-Installation in 5 Minuten, erleben Sie die Token-Einsparung und beherrschen Sie das dreistufige Konfigurationssystem."
order: 1
---

# Schnellstart

Dieses Kapitel hilft Ihnen, das DCP-Plugin von Grund auf zu nutzen. Sie lernen, das Plugin zu installieren, die Effekte zu validieren und die Konfiguration entsprechend Ihren Anforderungen anzupassen.

## Inhalt dieses Kapitels

<div class="vp-card-container">

<a href="./getting-started/" class="vp-card">
  <h3>Installation und Schnellstart</h3>
  <p>Vollenden Sie die DCP-Plugin-Installation in 5 Minuten und sehen Sie sofort die Token-Einsparung. Lernen Sie den Befehl /dcp zur Überwachung der Pruning-Statistiken kennen.</p>
</a>

<a href="./configuration/" class="vp-card">
  <h3>Konfiguration im Überblick</h3>
  <p>Beherrschen Sie das dreistufige Konfigurationssystem (global, Umgebungsvariablen, projektweit), verstehen Sie die Konfigurationsprioritäten und passen Sie die Pruning-Strategien sowie Schutzmechanismen nach Bedarf an.</p>
</a>

</div>

## Lernpfad

```
Installation und Schnellstart → Konfiguration im Überblick
         ↓                           ↓
   Plugin funktioniert       Weiß, wie man es anpasst
```

**Empfohlene Reihenfolge**:

1. **Zuerst [Installation und Schnellstart](./getting-started/) abschließen**: Stellen Sie sicher, dass das Plugin ordnungsgemäß funktioniert und erleben Sie die standardmäßigen Pruning-Effekte
2. **Danach [Konfiguration im Überblick](./configuration/) lernen**: Passen Sie die Pruning-Strategien entsprechend den Projektanforderungen an

::: tip Tipp für Anfänger
Wenn Sie DCP zum ersten Mal verwenden, empfehlen wir, es erst einmal mit der Standardkonfiguration zu nutzen und die Pruning-Effekte zu beobachten, bevor Sie die Konfiguration anpassen.
:::

## Voraussetzungen

Bevor Sie mit diesem Kapitel beginnen, stellen Sie bitte sicher:

- [x] **OpenCode** ist installiert (Version mit Plugin-Funktionalität)
- [x] Grundkenntnisse der **JSONC-Syntax** (JSON mit Kommentaren)
- [x] Sie wissen, wie man die **OpenCode-Konfigurationsdatei** bearbeitet

## Nächste Schritte

Nach Abschluss dieses Kapitels können Sie fortfahren mit:

- **[Automatische Pruning-Strategien im Detail](../platforms/auto-pruning/)**: Vertiefen Sie das Verständnis der drei Strategien Deduplizierung, Überschreiben und Fehlerlöschung
- **[LLM-gesteuerte Pruning-Tools](../platforms/llm-tools/)**: Erfahren Sie, wie KI aktiv die Tools discard und extract aufruft, um den Kontext zu optimieren
- **[Slash-Befehle](../platforms/commands/)**: Beherrschen Sie die Verwendung der Befehle /dcp context, /dcp stats, /dcp sweep

<style>
.vp-card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin: 16px 0;
}

.vp-card {
  display: block;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: border-color 0.25s, box-shadow 0.25s;
}

.vp-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.vp-card h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.vp-card p {
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
</style>

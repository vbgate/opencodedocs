---
title: "Google Cloud: 多账户配置 | opencode-mystatus"
sidebarTitle: "Google Cloud"
subtitle: "Google Cloud: 多账户配置"
description: "学习 opencode-mystatus 的 Google Cloud 多账户配置方法。支持同时管理多个账户，查看 4 种模型额度，解决单账户额度不足问题。"
tags:
  - "Google Cloud"
  - "Mehrere Konten verwalten"
  - "Antigravity"
  - "Modellzuordnung"
prerequisite:
  - "start-quick-start"
order: 1
---

# Google Cloud-Erweiterte Konfiguration: Mehrere Konten und Modellverwaltung

## Was Sie nach diesem Tutorial können

Mehrere Google Cloud-Konten konfigurieren, mit einem Klick alle Kontokredite anzeigen, die Zuordnungsbeziehung von 4 Modellen (G3 Pro, G3 Image, G3 Flash, Claude) verstehen und das Problem unzureichender Modellkredite eines einzelnen Kontos lösen.

## Grundlegende Idee

### Mehrere Konten unterstützen

opencode-mystatus unterstützt gleichzeitige Abfrage mehrerer Google Cloud Antigravity-Konten. Jedes Konto zeigt separat 4 Modellkredite an, was Ihnen erleichtert, die Kreditverteilung mehrerer Projekte zu verwalten.

### Modellzuordnungsbeziehung

Google Cloud Antigravity bietet mehrere Modelle, das Plugin zeigt davon die 4 am häufigsten verwendeten:

| Anzeigename | Modell-Key (Haupt) | Modell-Key (Reserve) |
| -------- | -------------- | --------------- |
| G3 Pro | `gemini-3-pro-high` | `gemini-3-pro-low` |
| G3 Image | `gemini-3-pro-image` | - |
| G3 Flash | `gemini-3-flash` | - |
| Claude | `claude-opus-4-5-thinking` | `claude-opus-4-5` |

## Folgen Sie mir

### Schritt 1: Erstes Google Cloud-Konto hinzufügen

Verwenden Sie das Plugin `opencode-antigravity-auth`, um ein Konto hinzuzufügen.

### Schritt 2: Google Cloud-Kreditabfrage

```bash
/mystatus
```

### Schritt 3: Zweites Google Cloud-Konto hinzufügen

Wiederholen Sie den Vorgang mit einem anderen Google-Konto.

### Schritt 4: Mehrere Kontenkredite anzeigen

```bash
/mystatus
```

## Häufige Fehler

### Konto nicht angezeigt

Stellen Sie sicher, dass das Konto ein `email`-Feld hat.

### Fehlender Project-ID

Stellen Sie sicher, dass die Konfiguration `projectId` oder `managedProjectId` enthält.

## Zusammenfassung

- Installation des Plugins `opencode-antigravity-auth` ist Voraussetzung für die Verwendung der Google Cloud-Kreditabfrage
- Unterstützt gleichzeitige Abfrage mehrerer Konten, jedes zeigt separat 4 Modellkredite
- Jedes Konto muss ein `email`-Feld enthalten

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcodepositionen anzuzeigen</strong></summary>

| Funktion | Dateipfad | Zeilennummer |
| ---------- | ------------------------------------------------------ | ------- |
| Modellkonfiguration | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 69-78 |

</details>

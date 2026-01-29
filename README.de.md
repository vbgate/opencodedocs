<div align="center">
 
# 🔥 OpenCodeDocs

![VitePress](https://img.shields.io/badge/VitePress-1.0-646CFF?style=flat&logo=vitepress)
![License](https://img.shields.io/badge/License-MIT%2B%20CC--BY--NC--SA%204.0-green?style=flat)
![Cloudflare](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-orange?style=flat)
![Languages](https://img.shields.io/badge/Languages-10%2B-blue?style=flat)

**🎯 #1 AI-Ökosystem-Tutorial-Site · Quellcode-gesteuert · 100% ausführbar**

AI-Tools werden zu schnell aktualisiert? Die offizielle Dokumentation kann nicht mithalten? Online-Tutorials sind veraltet?

Wir analysieren tiefgehend Open-Source-Quellcode, jede Codezeile ist verifiziert.
**✅ Mach es Schritt für Schritt, Erfolg beim ersten Mal, keine Umwege.**

[🚀 Jetzt starten](https://opencodedocs.com) · [⭐ Star dieses Repository](../../) · [💬 Diskussion beitreten](../../discussions)

</div>

## Sprache

[简体中文](README.md) · [English](README.en.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português](README.pt.md) · [Русский](README.ru.md) · [繁體中文](README.zh-tw.md)

---

## 💡 Haben Sie diese Situationen erlebt?

- ❌ Offizielle Dokumentation hinkt hinterher, Sie folgen Anweisungen, aber es funktioniert nicht?
- ❌ Online-Tutorials sind Kopien, der Code läuft überhaupt nicht?
- ❌ Fehler auftreten, Sie suchen im Kreis und finden keine Lösung?
- ❌ Wollen weiterkommen, aber keine tiefgehende Anleitung zur Quellcodeanalyse finden?

**OpenCodeDocs löst genau diese Probleme.**

---

## ✨ Warum OpenCodeDocs wählen?

### 🎯 Quellcode-Verifizierung, keine Halluzinationen

> Nicht aus dem Internet kopiert, sondern aus **echtem Quellcode** abgeleitete Kernlogik

Wir analysieren tiefgehend Open-Source-Projekte und stellen sicher, dass jede Codezeile automatisch verifiziert wurde. **Tutorials markieren konkrete Git-Commit-Versionen**, damit Sie genau wissen, auf welcher Version der Code basiert.

### 🚀 Kontinuierliche Aktualisierung, synchrone Updates

> Tools aktualisiert, Tutorials automatisch aktualisiert

Wenn eine Projektversion veröffentlicht wird, aktualisieren wir unsere Tutorials synchron. Sie müssen sich keine Sorgen um veraltete Tutorials machen, Sie lernen immer die neuesten Inhalte.

> 💡 **Unsere Tutorials werden schnell aktualisiert, weitere hochwertige Projekte werden laufend aufgenommen!**

### 🌍 10+ Sprachen, weltweit zugänglich

> Chinesisch, Englisch, Japanisch, Koreanisch, Spanisch, Französisch, Deutsch, Portugiesisch, Russisch, traditionelles Chinesisch...

Egal woher Sie kommen, Sie können AI-Tools in Ihrer Muttersprache lernen.

### ✅ 100% ausführbar, null Trial-and-Error

> Schritt für Schritt, Erfolg beim ersten Mal, kein Raten, kein Probieren

Jeder Schritt der Tutorials ist verifiziert, von Installation bis Deployment, solange Sie folgen, läuft es. **Kein Rumprobieren, keine Fallen, keine Umwege.**

---

## 👤 Zu welcher Kategorie gehören Sie?

### 🌱 AI-Tool-Anfänger

**Nicht installieren können? Nicht konfigurieren können? Keine Sorge, wir haben Schritt-für-Schritt-Anleitungen**

- Auch ohne Vorkenntnisse einfach loslegen
- Jeder Schritt hat detaillierte Erklärungen
- Häufige Fehler haben Lösungen

### 💻 Fortgeschrittene Entwickler

**Wollen weiterkommen? Wir tauchen tief in den Quellcode ein**

- Techniken für Kontowechsel
- Geld-Spar-Geheimnisse für Token
- Agent-Automatisierung in der Praxis
- Tiefgehende Analyse auf Quellcode-Ebene

### 🏢 Technisches Team

**Brauchen Sie einheitliche Standards für die Teamarbeit?**

- Wiederverwendbare Best Practices
- Vollständige Projektstruktur
- Produktivumgebungs-Bereitstellungsanleitung

---

## 🚀 In 3 Minuten schnell starten

### Schritt 1: Repository klonen

```bash
git clone https://github.com/vbgate/opencodedocs.git
cd opencodedocs/site
```

### Schritt 2: Abhängigkeiten installieren

```bash
npm install
```

### Schritt 3: Entwicklungsserver starten

```bash
npm run dev
```

Besuchen Sie `http://localhost:5173` und beginnen Sie Ihre AI-Tool-Lernreise! 🎉

---

> 💡 **Tipp**: Sie können auch direkt [opencodedocs.com](https://opencodedocs.com) besuchen, um die Online-Dokumentation anzuzeigen.

---

## 📂 Projektstruktur

```
site/
├── docs/                      # Dokumentations-Stammverzeichnis
│   ├── zh/                    # Chinesische Tutorials 🇨🇳
│   ├── en/                    # Englische Tutorials 🇺🇸
│   ├── ja/                    # Japanische Tutorials 🇯🇵
│   ├── ko/                    # Koreanische Tutorials 🇰🇷
│   ├── es/                    # Spanische Tutorials 🇪🇸
│   ├── fr/                    # Französische Tutorials 🇫🇷
│   ├── de/                    # Deutsche Tutorials 🇩🇪
│   ├── pt/                    # Portugiesische Tutorials 🇵🇹
│   ├── ru/                    # Russische Tutorials 🇷🇺
│   ├── zh-tw/                 # Traditionelle chinesische Tutorials 🇹🇼
│   ├── .vitepress/            # VitePress-Konfiguration
│   │   ├── config.mts         # Hauptkonfigurationsdatei
│   │   ├── sidebar.config.ts  # Automatische Seitenleisten-Generierung
│   │   └── theme/             # Benutzerdefinierte Themenkomponenten
│   ├── about.md               # Über uns
│   └── terms.md               # Nutzungsbedingungen
├── scripts/                   # Werkzeug-Skripte
│   ├── add-order-to-md.ts     # Sortierfeld hinzufügen
│   ├── check-frontmatter.ts   # Frontmatter prüfen
│   └── create-category-indexes.ts  # Kategorien-Indizes erstellen
├── package.json               # Projektkonfiguration
├── tailwind.config.js         # Tailwind CSS-Konfiguration
└── postcss.config.js          # PostCSS-Konfiguration
```

---

## 🛠️ Tech Stack

| Technologie | Version | Beschreibung |
|:---:|:---:|:---:|
| ![VitePress](https://img.shields.io/badge/VitePress-1.0-646CFF?style=flat&logo=vitepress) | 1.x | Statischer Site-Generator · Schneller Build |
| ![Vue](https://img.shields.io/badge/Vue-3.4+-4FC08D?style=flat&logo=vue.js) | 3.4+ | Frontend-Framework · Composition API |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=flat&logo=tailwind-css) | 4.x | Stylesystem · CSS-first-Konfiguration |
| ![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178C6?style=flat&logo=typescript) | 5.9+ | Typsicherheit · Compile-Time-Prüfung |
| ![Mermaid](https://img.shields.io/badge/Mermaid-11.x-9F7DFE?style=flat&logo=mermaid) | 11.x | Diagramm-Unterstützung · Flussdiagramm-Visualisierung |
| ![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages-F38020?style=flat&logo=cloudflare) | Pages | Globaler CDN · 200+ Edge-Knoten |

---

## 📚 Entwicklerleitfaden

### ➕ Neues Tutorial hinzufügen

1. **Verzeichnisstruktur erstellen**
    ```
    docs/zh/[owner]/[repo]/
    ├── index.md          # Projekt-Homepage
    ├── start/            # Schnellstart
    ├── features/         # Feature-Einführung
    └── faq/              # Häufige Fragen
    ```

2. **Frontmatter schreiben**
    ```yaml
    ---
    title: "Tutorial-Titel"              # 2-6 chinesische Zeichen
    order: 10                            # Sortierung (10, 20, 30...)
    sidebarTitle: "Seitenleisten-Titel"  # Optional
    description: "SEO-Beschreibung"     # Suchmaschinenoptimierung
    ---
    ```

3. **Build verifizieren**
    ```bash
    npm run docs:build
    ```

### 🌍 Mehrsprachige Unterstützung hinzufügen

Projekt in `docs/.vitepress/sidebar.config.ts` hinzufügen:
```typescript
const projects = [
  'owner/repo',  // Fügen Sie Ihr Projekt hinzu
]
```

Dann übersetzen Sie die Datei `home-config.[lang].json`.

### 🎨 Benutzerdefiniertes Theme

- **Komponenten-Speicherort**: `docs/.vitepress/theme/components/`
- **Style-Datei**: `docs/.vitepress/theme/custom.css`
- **Tailwind v4**: Verwenden Sie die CSS-first-Konfigurationsmethode

---

## 🚀 Bereitstellungsanleitung

### Lokales Build

```bash
npm run docs:build
```

Das Build-Ergebnis befindet sich im Verzeichnis `docs/.vitepress/dist/`.

### Auf Cloudflare Pages bereitstellen

```bash
# Automatische Bereitstellung
npm run deploy
```

### Build-Ergebnis vorschauen

```bash
npm run docs:preview
```

### ⚡ Leistungsoptimierung

- **Bildoptimierung**: WebP-Format verwenden, auf unter 200KB komprimieren
- **Code-Splitting**: VitePress teilt automatisch nach Routen auf
- **CDN-Beschleunigung**: Statische Ressourcen automatisch zu Cloudflare CDN hochgeladen
- **Prerendering**: Kernseiten vorgeladen, First-Screen-Laden < 500ms

---

> ✅ **Unsere Site ist weltweit auf CDN bereitgestellt, Zugriffsgeschwindigkeit wie ein Blitz!**

---

## 🤝 Mitmachen

Wir begrüßen Community-Beiträge! Reichen Sie Ihre Tutorials ein, korrigieren Sie Fehler, fügen Sie neue Features hinzu.

### Mitwirkungsprozess

1. **Dieses Repository forken**
    ```bash
    # Klicken Sie auf die Fork-Schaltfläche auf der GitHub-Seite
    ```

2. **Feature-Branch erstellen**
    ```bash
    git checkout -b feature/amazing-feature
    ```

3. **Änderungen committen**
    ```bash
    git commit -m 'Add amazing feature'
    ```

4. **Auf Branch pushen**
    ```bash
    git push origin feature/amazing-feature
    ```

  5. **Pull Request einreichen**
    - Klicken Sie auf die Schaltfläche "Pull Request" auf der GitHub-Seite
    - Füllen Sie die PR-Beschreibung aus und erläutern Sie Ihre Änderungen
  
---
  
> 🌟 **Ihr Beitrag wird Entwicklern weltweit helfen, AI-Tools besser zu nutzen!**
  
---

## 📥 Tutorial beantragen

Möchten Sie auch ein hochwertiges Tutorial für Ihr Projekt? Nur 3 Schritte!

### 📝 Einreichungsprozess

**Schritt 1: Issue erstellen**

1. Besuchen Sie [GitHub Issues](https://github.com/vbgate/opencodedocs/issues)
2. Klicken Sie auf "New Issue"
3. Verwenden Sie die folgende Vorlage:

```markdown
**Projektname**：[Projektname]
**GitHub-Repository**：https://github.com/[owner]/[repo]
**Projektbeschreibung**：[1-2 Sätze zum Projektzweck]
**Zielgruppe**：[Anfänger/Fortgeschrittene/Experte/Alle]
**Tutorial-Sprache**：[Chinesisch/Englisch/Andere]
**Anmerkung**：[Andere ergänzende Hinweise]
```

**Schritt 2: Team-Review**

- Wir überprüfen Ihren Antrag innerhalb von 1-3 Werktagen
- Bewertung, ob das Projekt für die Aufnahme geeignet ist
- Bestätigung der Quellcode-Qualität und -Aktivität des Projekts

**Schritt 3: Tutorial live gehen**

- Nach Genehmigung generieren wir automatisch das Tutorial
- Verifizierung der Ausführbarkeit jedes Schritts
- Veröffentlichung auf der offiziellen Website mit mehrsprachiger Unterstützung

### ⏱️ Bearbeitungszeit

- **Überprüfungszyklus**: 1-3 Werktage
- **Tutorial-Generierung**: 3-7 Werktage
- **Veröffentlichungszeit**: Sofort nach Genehmigung veröffentlicht

### ❓ Häufige Fragen

**F: Welche Art von Projekten eignet sich für die Aufnahme?**
A: Open-Source AI-Tools, Entwicklungstools, Bibliotheken, Frameworks usw. Erfordert gewisse technische Tiefe und Nutzungswert.

**F: Sind die Tutorials kostenlos?**
A: Ja, unsere Tutorials sind völlig kostenlos und werden kontinuierlich aktualisiert und gewartet.

**F: Kann die Tutorial-Sprache angegeben werden?**
A: Ja, wir unterstützen 10 Sprachen. Sie können die gewünschte Sprache im Issue angeben.

---

> 🎯 **Jetzt einreichen：[Issue erstellen →](https://github.com/vbgate/opencodedocs/issues/new)**

---

## 📄 Lizenz

### Site-Code

[MIT License](LICENSE)

### Tutorial-Inhalte

[CC-BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)

**Namensnennung - Nicht-kommerziell - Weitergabe unter gleichen Bedingungen**

✅ Sie können：
- 📋 Teilen: Frei teilen und anpassen
- 🔧 Modifizieren: Auf Basis von Tutorial-Inhalten Sekundärkreation
- 👥 Beitragen: Ihre Verbesserungen einreichen

❌ Sie können nicht：
- 💰 Kommerzielle Nutzung: Unbefugt nicht für kommerzielle Zwecke verwenden

---

> 💡 **Wenn Sie Tutorials für kommerzielle Zwecke verwenden möchten, kontaktieren Sie uns bitte：[vbgatecom@gmail.com](mailto:vbgatecom@gmail.com)**

---

## 📞 Kontaktieren Sie uns

Haben Sie Fragen oder Vorschläge? Kontaktieren Sie uns jederzeit!

- 📧 **Email**: [vbgatecom@gmail.com](mailto:vbgatecom@gmail.com)
- 🐦 **Twitter**: [@codingzys](https://x.com/codingzys)
- 💻 **GitHub**: [vbgate/opencodedocs](https://github.com/vbgate/opencodedocs)
- 📥 **Tutorial einreichen**: [GitHub Issues](https://github.com/vbgate/opencodedocs/issues)
- 🌐 **Website**: [opencodedocs.com](https://opencodedocs.com)

---

<div align="center">

**🎉 Danke, dass Sie OpenCodeDocs gewählt haben!**

**Von der ersten Codezeile bis zur produktionsreifen Anwendung, wir bieten Ihnen Tutorials für jede Phase.**

[⭐ Star dieses Repository](../../) · [📥 Tutorial beantragen](https://github.com/vbgate/opencodedocs/issues/new) · [💬 Diskussion beitreten](../../discussions)

Made with ❤️ by [OpenCodeDocs Team](https://github.com/vbgate/opencodedocs)

</div>

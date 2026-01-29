---
title: "Vercel Deployment: Schnelles Veröffentlichen | Agent Skills"
sidebarTitle: "Vercel Deployment"
subtitle: "Vercel Deployment: Schnelles Veröffentlichen"
description: "Lernen Sie, wie Sie Ihr Projekt mit einem Klick auf Vercel deployen. Automatische Framework-Erkennung, 40+ Frontend-Frameworks und schnelle Vorschau-Links."
tags:
  - "Vercel"
  - "Deployment"
  - "Ein-Klick-Deployment"
  - "Frontend-Frameworks"
prerequisite:
  - "start-installation"
---

# Vercel Ein-Klick-Deployment: Schnelles Veröffentlichen ohne Authentifizierung

## Was Sie nach diesem Kurs können

- Lassen Sie Claude Ihr Projekt mit einem einzigen Satz auf Vercel deployen, ohne manuelle Konfiguration
- Erhalten Sie einen zugänglichen Vorschaulink und einen Übertragungslink für die Eigentümerschaft
- Automatische Erkennung des Projekt-Frameworks (Next.js, React, Vue, Svelte und weitere 40+)
- Behandlung von statischen HTML-Websites, Unterstützung für das Umbenennen einzelner Dateien

## Ihre aktuelle Herausforderung

Jedes Mal, wenn Sie Ihr Projekt mit anderen teilen möchten, müssen Sie:

1. Manuelles Einloggen auf der Vercel-Website
2. Neues Projekt erstellen
3. Git-Repository verbinden
4. Auf den Abschluss des Builds warten
5. Einen langen URL merken und mit anderen teilen

Wenn Sie nur schnell ein Demo oder einen Prototyp zeigen möchten, sind diese Schritte zu umständlich.

## Wann man diesen Ansatz anwendet

Geeignet für die folgenden Szenarien:

- 🚀 Schnelle Erstellung von Projektvorschauen für das Team
- 📦 Demo-Präsentation für Kunden oder Freunde
- 🔄 Automatische Generierung von Deployment-Vorschauen in CI/CD
- 🌐 Deployment von statischen HTML-Seiten oder Single-Page-Anwendungen

## Kernkonzept

Der Arbeitsablauf des Vercel-Deploy-Skills ist sehr einfach:

```
Ihr Eingabe → Claude erkennt Schlüsselwort → Aktiviert Deployment-Skill
    ↓
          Framework-Typ erkannt (aus package.json)
    ↓
          Projekt gepackt (schließt node_modules und .git aus)
    ↓
          Auf Vercel-API hochgeladen
    ↓
          Gibt zwei Links zurück (Vorschau + Eigentümerschaftsübertragung)
```

**Warum werden zwei Links benötigt?**

- **Preview-URL**: Sofort zugängliche Vorschauadresse
- **Claim-URL**: Überträgt dieses Deployment in Ihr Vercel-Konto zur Verwaltung

Dieser Designvorteil: Der Deployer (Agent) benötigt keine Zugriffsberechtigungen Ihres Kontos. Sie können später über die Claim-URL die Eigentümerschaft erhalten.

## 🎒 Vorbereitungen vor dem Start

::: warning Vorab-Überprüfung

- ✅ Installation von [Agent Skills abgeschlossen](../installation/)
- ✅ Projekt-Verzeichnisstruktur vollständig (hat `package.json` oder ist ein statisches HTML-Projekt)
- ✅ Netzwerkberechtigungen von claude.ai konfiguriert (falls Sie claude.ai verwenden)

:::

::: info Netzwerkberechtigungshinweis

Wenn Sie **claude.ai** (Online-Version) verwenden, müssen Sie den Zugriff auf die Domäne `*.vercel.com` zulassen:

1. Gehen Sie zu [https://claude.ai/settings/capabilities](https://claude.ai/settings/capabilities)
2. Fügen Sie `*.vercel.com` zur Whitelist hinzu
3. Speichern Sie die Einstellungen und versuchen Sie erneut

Wenn Ihr Deployment fehlschlägt und einen Netzwerkfehler meldet, überprüfen Sie diese Einstellung.

:::

## Schritt-für-Schritt-Anleitung

### Schritt 1: Wechseln zum Projektverzeichnis

```bash
# Wechseln Sie zu Ihrem Projektverzeichnis
cd /path/to/your/project
```

**Warum**
Das Deployment-Skript muss die `package.json` und Quelldateien Ihres Projekts finden, daher ist die Verzeichnissuche wichtig.

### Schritt 2: Sagen Sie Claude, dass er deployen soll

Geben Sie im Claude-Dialog ein:

```
Deploy my app to Vercel
```

Sie können diese Auslöseschlüsselwörter auch verwenden:

- "Deploy this to production"
- "Deploy and give me a link"
- "Push this live"
- "Create a preview deployment"

### Schritt 3: Beobachten Sie den Deployment-Prozess

Sie werden eine ähnliche Ausgabe sehen:

```
Preparing deployment...
Detected framework: nextjs
Creating deployment package...
Deploying...
✓ Deployment successful!

Preview URL: https://skill-deploy-abc123.vercel.app
Claim URL:   https://vercel.com/claim-deployment?code=...

View your site at the Preview URL.
To transfer this deployment to your Vercel account, visit the Claim URL.
```

Gleichzeitig gibt Claude das Ergebnis im JSON-Format aus (für einfache Skriptanalyse):

```json
{
  "previewUrl": "https://skill-deploy-abc123.vercel.app",
  "claimUrl": "https://vercel.com/claim-deployment?code=...",
  "deploymentId": "dpl_...",
  "projectId": "prj_..."
}
```

**Sie sollten sehen**:
- Bestätigung der erfolgreichen Bereitstellung ✓
- Zwei URLs (preview und claim)
- Falls es ein Code-Projekt ist, wird auch der erkannte Framework-Name angezeigt

### Schritt 4: Vorschaulink besuchen

**Klicken Sie auf die Preview URL**, und Sie können sehen, dass Ihre Website sofort online ist!

Wenn dies ein Demo oder eine temporäre Präsentation ist, ist die Aufgabe hier erledigt.

### Schritt 5: (Optional) Eigentümerschaft übertragen

Wenn Sie dieses Deployment langfristig verwalten möchten:

1. Klicken Sie auf **Claim URL**
2. Melden Sie sich bei Ihrem Vercel-Konto an
3. Bestätigen Sie die Übertragung
4. Das Deployment gehört nun Ihrem Konto, Sie können es weiter bearbeiten und verwalten

**Sie sollten sehen**:
- Das Deployment erscheint in Ihrem Vercel-Konto
- Sie können Logs, Redeployments usw. im Vercel Dashboard einsehen

## Kontrollpunkt ✅

Nach dem Deployment überprüfen Sie Folgendes:

- [ ] Die Preview URL kann im Browser geöffnet werden
- [ ] Die Seite wird korrekt angezeigt (keine 404 oder Build-Fehler)
- [ ] Falls es ein Code-Projekt ist, ist die Framework-Erkennung korrekt (Next.js, Vite usw.)
- [ ] Falls eine langfristige Verwaltung erforderlich ist, wurde die Eigentümerschaft über die Claim URL übertragen

## Unterstützte Frameworks

Der Vercel-Deploy-Skill kann automatisch **40+ Frameworks** erkennen:

| Kategorie | Frameworks (Teilbeispiele) |
| ---- | --------------- |
| **React** | Next.js, Gatsby, Create React App, Remix |
| **Vue** | Nuxt, Vitepress, Vuepress |
| **Svelte** | SvelteKit, Svelte |
| **Angular** | Angular, Ionic Angular |
| **Node.js Backend** | Express, Hono, Fastify, NestJS |
| **Build-Tools** | Vite, Parcel |
| **Andere** | Astro, Solid Start, Ember, Astro, Hexo, Eleventy |

::: tip Prinzip der Framework-Erkennung

Das Skript liest Ihre `package.json` und prüft die Paketnamen in `dependencies` und `devDependencies`.

Wenn mehrere Übereinstimmungen vorhanden sind, wählt das Skript das spezifischste Framework (z. B. Next.js hat Priorität vor generischem React).

:::

## Statische HTML-Projekte

Wenn Ihr Projekt **keine** `package.json` hat (reine statische Website), behandelt der Deployment-Skill dies intelligent:

- **Automatische Erkennung**: Identifiziert `.html`-Dateien im Stammverzeichnis
- **Umbenennung**: Wenn nur eine `.html`-Datei vorhanden ist und diese nicht `index.html` heißt, wird sie automatisch in `index.html` umbenannt
- **Direktes Deployment**: Wird als statische Website auf Vercel gehostet

**Beispielszenario**:
```bash
my-static-site/
└── demo.html  # Wird automatisch in index.html umbenannt
```

Nach dem Deployment können Sie den Inhalt von `demo.html` über den Vorschaulink sehen.

## Häufige Fallstricke

### Problem 1: Deployment fehlschlägt, Netzwerkfehler gemeldet

**Phänomen**:
```
Error: Network Egress Error
```

**Ursache**: claude.ai blockiert standardmäßig den Zugriff auf externe Domänen.

**Lösung**:
1. Gehen Sie zu [https://claude.ai/settings/capabilities](https://claude.ai/settings/capabilities)
2. Fügen Sie `*.vercel.com` zur Whitelist hinzu
3. Deployen Sie erneut

### Problem 2: Framework-Erkennung ungenau

**Phänomen**:
```
Detected framework: vite
# Aber Sie erwarten nextjs
```

**Ursache**: Das Skript matcht nach Priorität, möglicherweise stoppt es, nachdem es `vite` erkannt hat.

**Lösung**:
- Überprüfen Sie die Reihenfolge der Abhängigkeiten in `package.json`
- Wenn dies das Deployment nicht beeinträchtigt, können Sie es ignorieren (Vercel wird automatisch builden)
- Das Projekt kann immer noch normal deployt werden, verwendet lediglich die Standard-Vite-Konfiguration

### Problem 3: Statische Website 404

**Phänomen**:
Einzelne `.html`-Datei deployed, aber beim Zugriff tritt 404 auf.

**Lösung**:
Stellen Sie sicher, dass die HTML-Datei im Stammverzeichnis liegt. Wenn die Datei in einem Unterverzeichnis liegt, wird sie von Vercel nicht standardmäßig zum Stammpfad geroutet.

**Korrekte Struktur**:
```
project/
└── my-site.html  # Einzelne Datei im Stammverzeichnis, wird automatisch in index.html umbenannt
```

**Falsche Struktur**:
```
project/
└── dist/
    └── my-site.html  # Wird nicht automatisch umbenannt, beim Zugriff tritt 404 auf
```

### Problem 4: Deployment erfolgreich, aber Seite meldet Fehler

**Phänomen**:
Deployment erfolgreich, aber beim Aufrufen der Seite treten Build-Fehler oder Laufzeitfehler auf.

**Lösung**:
- Führen Sie lokal `npm run build` aus, um zu überprüfen, ob es erfolgreich ist
- Sehen Sie sich die Deployment-Logs an (falls das Deployment in Ihr eigenes Vercel-Konto übertragen wurde)
- Überprüfen Sie Umgebungsvariablen (falls das Projekt von `.env` abhängt)

::: tip Automatischer Ausschluss von Dateien

Das Deployment-Skript schließt automatisch Folgendes aus:
- `node_modules/` (verhindert das Hochladen von Abhängigkeiten)
- `.git/` (verhindert das Hochladen der Versionshistorie)

Wenn Ihr Projekt andere Dateien ausschließen muss (wie `.env`), empfiehlt es sich, dies beim manuellen Packen zu handhaben.

:::

## Erweiterte Verwendung

### Spezifizieren des Deployment-Pfads

Sie können auch Deployments in anderen Verzeichnissen vornehmen:

```
Deploy project at ./my-app
```

Claude wird diesen Pfad für das Deployment verwenden.

### Deployment aus vorhandenem tarball

Wenn Sie bereits ein gepacktes `.tgz`-Archiv haben:

```
Deploy /path/to/project.tgz to Vercel
```

Das Skript lädt das vorhandene Archiv direkt hoch und überspringt den Pack-Schritt.

## Zusammenfassung dieser Lektion

Der Vercel-Deploy-Skill macht Deployment einfacher als je zuvor:

**Kernwerte**:
- ✅ Ein Satz für Deployment, keine manuelle Konfiguration erforderlich
- ✅ Automatische Framework-Erkennung, Unterstützung für 40+ Technologiestacks
- ✅ Deployment ohne Authentifizierung, hohe Sicherheit
- ✅ Gibt Vorschaulink + Übertragungslink für Eigentümerschaft zurück

**Geeignete Szenarien**:
- 🚀 Schnelles Teilen von Demos oder Prototypen
- 📦 Teaminterne Vorschau
- 🔄 Automatisierte CI/CD-Prozesse
- 🌐 Hosting von statischen Websites

**Nächste Schritte**:
Wenn Sie die Arbeitsweise des Skills vertieft verstehen möchten, können Sie sich [React-Performance-Optimierung Best Practices](../react-best-practices/) ansehen oder lernen, wie man [eigene Skills entwickelt](../../advanced/skill-development/).

## Vorschau auf die nächste Lektion

> Die nächste Lektion behandelt **[React/Next.js Performance-Optimierung Best Practices](../react-best-practices/)**.
>
> Sie werden lernen:
> - 57 Regeln zur React-Performance-Optimierung
> - Wie man Waterfalls beseitigt und Bundle-Größen optimiert
> - Wie der KI automatisch Code prüft und Reparaturvorschläge macht

---

## Anhang: Quellcodereferenz

<details>
<summary><strong>Klicken zum Anzeigen der Quellcodepositionen</strong></summary>

> Aktualisierungszeit:2026-01-25

| Funktion              | Dateipfad                                                                                             | Zeilen     |
| ----------------- | ---------------------------------------------------------------------------------------------------- | -------- |
| Deployment-Skript-Einstieg      | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 1-250    |
| Framework-Erkennungslogik      | [`deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 12-156   |
| Packen und Hochladen auf API  | [`deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 208-222  |
| Umbenennung von statischem HTML  | [`deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 192-205  |
| Skill-Definitionsdatei      | [`skills/claude.ai/vercel-deploy-claimable/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/SKILL.md) | 1-113    |
| Netzwerkfehlerbehandlung      | [`SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/SKILL.md) | 102-112  |

**Wichtige Konstanten**:
- `DEPLOY_ENDPOINT = "https://claude-skills-deploy.vercel.com/api/deploy"`: Vercel Deployment API-Endpunkt

**Wichtige Funktionen**:
- `detect_framework()`: Erkennt 40+ Frameworks aus package.json

**Unterstützte Framework-Erkennung** (nach Priorität sortiert):
- React-Typ: Next.js, Gatsby, Remix, React Router
- Vue-Typ: Nuxt, Vitepress, Vuepress
- Svelte-Typ: SvelteKit, Svelte
- Andere: Astro, Angular, Express, Hono, Vite, Parcel usw.

</details>

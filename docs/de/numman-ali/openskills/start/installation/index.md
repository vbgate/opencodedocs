---
title: "Installation: Schnelle Bereitstellung | OpenSkills"
sidebarTitle: "In 5 Minuten loslegen"
subtitle: "Installation: Schnelle Bereitstellung | OpenSkills"
description: "Erfahren Sie, wie Sie OpenSkills installieren. Konfigurieren Sie die Umgebung in 5 Minuten mit npx und globaler Installation, einschließlich Umgebungsprüfung und Fehlerbehebung."
tags:
  - "Installation"
  - "Umgebungskonfiguration"
  - "Node.js"
  - "Git"
prerequisite:
  - "Grundlegende Terminaloperationen"
duration: 3
order: 3
---

# OpenSkills-Tool installieren

## Was Sie nach dieser Lektion können

Nach Abschluss dieser Lektion werden Sie in der Lage sein:

- Node.js- und Git-Umgebung zu prüfen und zu konfigurieren
- OpenSkills mit `npx` oder globaler Installation zu verwenden
- zu überprüfen, ob OpenSkills korrekt installiert und verfügbar ist
- häufige Installationsprobleme zu lösen (Versionskonflikte, Netzwerkprobleme usw.)

## Ihr aktuelles Problem

Möglicherweise haben Sie folgende Probleme:

- **Unklare Anforderungen**: Unbekannt ist, welche Versionen von Node.js und Git benötigt werden
- **Unklare Installation**: OpenSkills ist ein npm-Paket, aber es ist unklar, ob npx oder globale Installation verwendet werden sollte
- **Installationsfehler**: Auftreten von Versionsinkompatibilitäten oder Netzwerkproblemen
- **Berechtigungsprobleme**: EACCES-Fehler bei globaler Installation

Diese Lektion hilft Ihnen, diese Probleme Schritt für Schritt zu lösen.

## Wann diese Methode verwenden

Wenn Sie müssen:

- OpenSkills zum ersten Mal verwenden
- auf eine neue Version aktualisieren
- die Entwicklungsumgebung auf einem neuen Computer einrichten
- Installationsprobleme beheben

## 🎒 Vorbereitungen

::: tip Systemanforderungen

OpenSkills hat Mindestanforderungen an das System. Wenn diese nicht erfüllt sind, schlägt die Installation fehl oder es treten Laufzeitfehler auf.

:::

::: warning Vorabprüfung

Bitte stellen Sie vor Beginn sicher, dass Sie die folgende Software installiert haben:

1. **Node.js 20.6 oder höher**
2. **Git** (zum Klonen von Skills aus Repositorys)

:::

## Kernkonzept

OpenSkills ist ein Node.js-CLI-Tool mit zwei Verwendungsmöglichkeiten:

| Methode | Befehl | Vorteile | Nachteile | Einsatzszenario |
|--- | --- | --- | --- | ---|
| **npx** | `npx openskills` | Keine Installation erforderlich, automatische Verwendung der neuesten Version | Download bei jeder Ausführung erforderlich (mit Cache) | Gelegentliche Nutzung, Test neuer Versionen |
| **Globale Installation** | `openskills` | Kürzerer Befehl, schnellere Reaktion | Manuelle Aktualisierung erforderlich | Häufige Nutzung, feste Version |

**Empfehlung: Verwenden Sie npx**, es sei denn, Sie verwenden OpenSkills sehr häufig.

---

## Lernen Sie durch Handlung

### Schritt 1: Node.js-Version prüfen

Zuerst prüfen Sie, ob Node.js installiert ist und ob die Version die Anforderungen erfüllt:

```bash
node --version
```

**Warum**

OpenSkills benötigt Node.js 20.6 oder höher. Ältere Versionen führen zu Laufzeitfehlern.

**Sie sollten sehen**:

```bash
v20.6.0
```

Oder eine höhere Version (z. B. `v22.0.0`).

::: danger Version zu niedrig

Wenn Sie `v18.x.x` oder niedrigere Versionen (z. B. `v16.x.x`) sehen, müssen Sie Node.js aktualisieren.

:::

**Wenn die Version zu niedrig ist**:

Empfehlung: Verwenden Sie [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm) zur Installation und Verwaltung von Node.js:

::: code-group

```bash [macOS/Linux]
# nvm installieren (falls noch nicht installiert)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Terminal-Konfiguration neu laden
source ~/.bashrc  # oder source ~/.zshrc

# Node.js 20 LTS installieren
nvm install 20
nvm use 20

# Version prüfen
node --version
```

```powershell [Windows]
# nvm-windows herunterladen und installieren
# Besuchen Sie: https://github.com/coreybutler/nvm-windows/releases

# Nach der Installation in PowerShell ausführen:
nvm install 20
nvm use 20

# Version prüfen
node --version
```

:::

**Sie sollten sehen** (nach Aktualisierung):

```bash
v20.6.0
```

---

### Schritt 2: Git-Installation prüfen

OpenSkills benötigt Git zum Klonen von Skill-Repositorys:

```bash
git --version
```

**Warum**

Bei der Installation von Skills aus GitHub verwendet OpenSkills den Befehl `git clone`, um das Repository herunterzuladen.

**Sie sollten sehen**:

```bash
git version 2.40.0
```

(Versionsnummer kann unterschiedlich sein, Hauptsache es wird eine Ausgabe angezeigt)

::: danger Git nicht installiert

Wenn Sie `command not found: git` oder ähnliche Fehler sehen, müssen Sie Git installieren.

:::

**Wenn Git nicht installiert ist**:

::: code-group

```bash [macOS]
# macOS hat Git normalerweise vorinstalliert. Falls nicht, verwenden Sie Homebrew:
brew install git
```

```powershell [Windows]
# Git für Windows herunterladen und installieren
# Besuchen Sie: https://git-scm.com/download/win
```

```bash [Linux (Ubuntu/Debian)]
sudo apt update
sudo apt install git
```

```bash [Linux (CentOS/RHEL)]
sudo yum install git
```

:::

Nach der Installation führen Sie `git --version` erneut aus, um zu überprüfen.

---

### Schritt 3: Umgebung prüfen

Prüfen Sie nun, ob Node.js und Git beide verfügbar sind:

```bash
node --version && git --version
```

**Sie sollten sehen**:

```bash
v20.6.0
git version 2.40.0
```

Wenn beide Befehle erfolgreich ausgegeben werden, ist die Umgebung korrekt konfiguriert.

---

### Schritt 4: npx-Methode verwenden (empfohlen)

OpenSkills empfiehlt die direkte Verwendung von `npx` ohne zusätzliche Installation:

```bash
npx openskills --version
```

**Warum**

`npx` lädt automatisch die neueste Version von OpenSkills herunter und führt sie aus, ohne manuelle Installation oder Aktualisierung. Bei der ersten Ausführung wird das Paket in den lokalen Cache heruntergeladen. Spätere Ausführungen verwenden den Cache und sind sehr schnell.

**Sie sollten sehen**:

```bash
1.5.0
```

(Versionsnummer kann unterschiedlich sein)

::: tip Funktionsweise von npx

`npx` (Node Package eXecute) ist ein Tool, das ab npm 5.2.0+ enthalten ist:
- Erste Ausführung: Paket aus npm in temporäres Verzeichnis herunterladen
- Spätere Ausführungen: Cache verwenden (verfällt standardmäßig nach 24 Stunden)
- Aktualisierung: Nach Ablauf des Caches wird automatisch die neueste Version heruntergeladen

:::

**Installationsbefehl testen**:

```bash
npx openskills list
```

**Sie sollten sehen**:

```bash
Installed Skills:

No skills installed. Run: npx openskills install <source>
```

Oder eine Liste der bereits installierten Skills.

---

### Schritt 5: (Optional) Globale Installation

Wenn Sie OpenSkills häufig verwenden, können Sie es global installieren:

```bash
npm install -g openskills
```

**Warum**

Nach der globalen Installation können Sie den Befehl `openskills` direkt verwenden, ohne jedes Mal `npx` einzugeben. Die Reaktion ist schneller.

**Sie sollten sehen**:

```bash
added 4 packages in 3s
```

(Ausgabe kann unterschiedlich sein)

::: warning Berechtigungsprobleme

Wenn Sie bei der globalen Installation auf einen `EACCES`-Fehler stoßen, haben Sie keine Schreibberechtigung für das globale Verzeichnis.

**Lösungsmethoden**:

```bash
# Methode 1: sudo verwenden (macOS/Linux)
sudo npm install -g openskills

# Methode 2: npm-Berechtigungen korrigieren (empfohlen)
# Globales Installationsverzeichnis anzeigen
npm config get prefix

# Korrekte Berechtigungen festlegen (ersetzen Sie /usr/local durch den tatsächlichen Pfad)
sudo chown -R $(whoami) /usr/local/lib/node_modules
sudo chown -R $(whoami) /usr/local/bin
```

:::

**Globale Installation prüfen**:

```bash
openskills --version
```

**Sie sollten sehen**:

```bash
1.5.0
```

::: tip Globale Installation aktualisieren

Um die global installierte Version von OpenSkills zu aktualisieren:

```bash
npm update -g openskills
```

:::

---

## Kontrollpunkt ✅

Nach den obigen Schritten sollten Sie Folgendes bestätigen:

- [ ] Node.js-Version ist 20.6 oder höher (`node --version`)
- [ ] Git ist installiert (`git --version`)
- [ ] `npx openskills --version` oder `openskills --version` gibt die Versionsnummer korrekt aus
- [ ] `npx openskills list` oder `openskills list` läuft normal

Wenn alle Prüfungen bestanden sind, herzlichen Glückwunsch! OpenSkills wurde erfolgreich installiert.

---

## Häufige Fehler

### Problem 1: Node.js-Version zu niedrig

**Fehlermeldung**:

```bash
Error: The module was compiled against a different Node.js version
```

**Ursache**: Node.js-Version niedriger als 20.6

**Lösung**:

Verwenden Sie nvm, um Node.js 20 oder höher zu installieren:

```bash
nvm install 20
nvm use 20
```

---

### Problem 2: npx-Befehl nicht gefunden

**Fehlermeldung**:

```bash
command not found: npx
```

**Ursache**: npm-Version zu niedrig (npx benötigt npm 5.2.0+)

**Lösung**:

```bash
# npm aktualisieren
npm install -g npm@latest

# Version prüfen
npx --version
```

---

### Problem 3: Netzwerk-Timeout oder Download fehlgeschlagen

**Fehlermeldung**:

```bash
Error: network timeout
```

**Ursache**: Eingeschränkter Zugriff auf npm-Repository

**Lösung**:

```bash
# npm-Mirror verwenden (z. B. Taobao-Mirror)
npm config set registry https://registry.npmmirror.com

# Erneut versuchen
npx openskills --version
```

Standard-Quelle wiederherstellen:

```bash
npm config set registry https://registry.npmjs.org
```

---

### Problem 4: Berechtigungsfehler bei globaler Installation

**Fehlermeldung**:

```bash
Error: EACCES: permission denied
```

**Ursache**: Keine Schreibberechtigung für das globale Installationsverzeichnis

**Lösung**:

Beziehen Sie sich auf die Berechtigungskorrektur in "Schritt 5" oder verwenden Sie `sudo` (nicht empfohlen).

---

### Problem 5: Git-Klonen fehlgeschlagen

**Fehlermeldung**:

```bash
Error: git clone failed
```

**Ursache**: SSH-Schlüssel nicht konfiguriert oder Netzwerkprobleme

**Lösung**:

```bash
# Git-Verbindung testen
git ls-remote https://github.com/numman-ali/openskills.git

# Wenn fehlschlägt, Netzwerk oder Proxy konfigurieren
git config --global http.proxy http://proxy.example.com:8080
```

---

## Zusammenfassung

In dieser Lektion haben wir gelernt:

1. **Umgebungsanforderungen**: Node.js 20.6+ und Git
2. **Empfohlene Methode**: `npx openskills` (keine Installation erforderlich)
3. **Optionale globale Installation**: `npm install -g openskills` (bei häufiger Nutzung)
4. **Umgebungsprüfung**: Versionsnummern und Befehlsverfügbarkeit prüfen
5. **Häufige Probleme**: Versionskonflikte, Berechtigungsprobleme, Netzwerkprobleme

Sie haben nun die Installation von OpenSkills abgeschlossen. In der nächsten Lektion lernen wir, wie Sie den ersten Skill installieren.

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Ersten Skill installieren](../first-skill/)**
>
> Sie lernen:
> - Wie Sie Skills aus dem offiziellen Anthropic-Repository installieren
> - Techniken zur interaktiven Auswahl von Skills
> - Verzeichnisstruktur von Skills
> - Überprüfung, ob der Skill korrekt installiert ist

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcodeposition anzuzeigen</strong></summary>

> Aktualisierungsdatum: 2026-01-24

### Kernkonfiguration

| Konfiguration | Dateipfad                                                                                       | Zeile      |
|--- | --- | ---|
| Node.js-Versionsanforderung | [`package.json`](https://github.com/numman-ali/openskills/blob/main/package.json) | 45-47     |
| Paketinformation         | [`package.json`](https://github.com/numman-ali/openskills/blob/main/package.json) | 1-9       |
| CLI-Eingang       | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts)             | 39-80     |

### Wichtige Konstanten

- **Node.js-Anforderung**: `>=20.6.0` (package.json:46)
- **Paketname**: `openskills` (package.json:2)
- **Version**: `1.5.0` (package.json:3)
- **CLI-Befehl**: `openskills` (package.json:8)

### Abhängigkeiten

**Laufzeitabhängigkeiten** (package.json:48-53):
- `@inquirer/prompts`: Interaktive Auswahl
- `chalk`: Farbige Terminalausgabe
- `commander`: CLI-Argumentparsing
- `ora`: Ladeanimation

**Entwicklungsabhängigkeiten** (package.json:54-59):
- `typescript`: TypeScript-Kompilierung
- `vitest`: Unit-Tests
- `tsup`: Build-Tool

</details>

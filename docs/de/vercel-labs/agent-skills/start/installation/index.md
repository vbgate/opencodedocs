---
title: "安装: Agent Skills 部署 | Agent Skills"
sidebarTitle: "安装"
subtitle: "安装: Agent Skills 部署"
description: "学习 Agent Skills 安装方法。掌握 npx 安装、手动配置、网络权限设置，支持 Claude Code 和 claude.ai，快速完成部署。"
tags:
  - "Installation"
  - "Claude Code"
  - "claude.ai"
  - "Netzwerkberechtigungen"
prerequisite:
  - "start-getting-started"
---

# Agent Skills installieren

## Was Sie nach diesem Kurs können

- Agent Skills mit einem einzigen Befehl schnell installieren (empfohlen)
- Skills manuell in das lokale Verzeichnis von Claude Code kopieren
- Skills in claude.ai aktivieren und Netzwerkberechtigungen konfigurieren
- Häufige Fehler bei der Installation diagnostizieren

## Ihre aktuelle Herausforderung

Sie möchten Agent Skills nutzen, um Claude bei der Deployment und Codeüberprüfung zu unterstützen, wissen aber nicht, wie Sie sie in Claude Code oder claude.ai installieren sollen. Oder Sie haben bereits versucht, sie zu installieren, aber die Skills wurden nicht aktiviert und das Deployment scheitert mit einer "Network Egress Error"-Meldung.

## Wann man diesen Ansatz anwendet

- ✓ Erstmalige Verwendung von Agent Skills
- ✓ Sie verwenden Claude Code (Terminal-Kommandozeilen-Tool)
- ✓ Sie verwenden claude.ai (Webversion von Claude)
- ✓ Sie müssen den Skills Netzwerkzugriff ermöglichen (Deployment-Funktion)

## 🎒 Vorbereitungen vor dem Start

Vergewissern Sie sich vor dem Start, dass Sie bereits:

- [ ] Node.js Version 20 oder höher installiert haben
- [ ] Ein aktives Claude Code- oder claude.ai-Konto besitzen

::: tip Hinweis
Wenn Sie Agent Skills noch nicht verstehen, empfehlen wir Ihnen zuerst [Agent Skills Erste Schritte](../getting-started/) zu lesen.
:::

## Kernkonzept

Die Installation von Agent Skills erfolgt auf zwei Arten:

1. **npx-Installation (empfohlen)**: Ein-Klick-Installation in Claude Code, automatisiert alle Schritte
2. **Manuelle Installation**: Kopieren der Dateien in ein bestimmtes Verzeichnis, geeignet für claude.ai oder wenn Sie den Installationsort selbst kontrollieren möchten

Nach der Installation werden Skills automatisch in Claude aktiviert – Sie müssen nur die Schlüsselwörter auslösen (z. B. "Deploy my app"), und Claude wird automatisch den entsprechenden Skill aufrufen.

## Methode 1: Schnelle Installation mit npx (empfohlen)

Dies ist die einfachste Installationsmethode und eignet sich für Claude Code-Benutzer.

### Schritt 1: Installationsbefehl ausführen

Führen Sie den folgenden Befehl im Terminal aus:

```bash
npx add-skill vercel-labs/agent-skills
```

**Warum**
`add-skill` ist ein npm-Paket, das automatisch Agent Skills herunterlädt und im korrekten Verzeichnis installiert.

**Sie sollten sehen**:
```
Skills successfully installed.
```

### Schritt 2: Installation überprüfen

Geben Sie in Claude Code ein:

```
List available skills
```

**Sie sollten sehen**:
Claude gibt eine Liste der Skills zurück, die Folgendes enthält:
- `react-best-practices`
- `web-design-guidelines`
- `vercel-deploy`

**Kontrollpunkt ✅**: Wenn Sie diese 3 Skills sehen, war die Installation erfolgreich.

## Methode 2: Manuelle Installation in Claude Code

Wenn Sie npx nicht verwenden möchten oder den Installationsort steuern möchten, können Sie die manuelle Installation verwenden.

### Schritt 1: Projekt klonen oder herunterladen

```bash
git clone https://github.com/vercel-labs/agent-skills.git
cd agent-skills
```

**Warum**
Die manuelle Installation erfordert den Zugriff auf den Quellcode des Projekts.

### Schritt 2: Skills in das Claude Code-Verzeichnis kopieren

```bash
cp -r skills/react-best-practices ~/.claude/skills/
cp -r skills/web-design-guidelines ~/.claude/skills/
cp -r skills/claude.ai/vercel-deploy-claimable ~/.claude/skills/vercel-deploy
```

**Warum**
Die Skills von Claude Code werden im Verzeichnis `~/.claude/skills/` gespeichert. Nach dem Kopieren kann Claude diese Skills erkennen.

**Sie sollten sehen**:
Nach dem Ausführen des Befehls gibt es keine Fehlermeldung.

**Kontrollpunkt ✅**:
Verwenden Sie `ls ~/.claude/skills/` zum Überprüfen, Sie sollten 3 Skill-Verzeichnisse sehen: `react-best-practices`, `web-design-guidelines`, `vercel-deploy`.

### Schritt 3: Claude Code neu starten

Beenden Sie Claude Code zwangsweise und starten Sie es erneut.

**Warum**
Claude Code lädt die Skillliste nur beim Start, damit müssen Sie es neu starten, um die neu installierten Skills zu erkennen.

## Methode 3: Verwenden von Skills in claude.ai

Wenn Sie claude.ai (die Webversion von Claude) verwenden, unterscheidet sich die Installationsmethode.

### Methode 3.1: Zum Projekt-Wissensbasis hinzufügen

#### Schritt 1: Skill-Dateien auswählen

Packen Sie alle Dateien aus den Verzeichnissen `skills/react-best-practices`, `skills/web-design-guidelines`, `skills/claude.ai/vercel-deploy-claimable` zusammen.

**Warum**
claude.ai muss die Skill-Dateien als "Wissensbasis" zum Projekt hinzugefügt werden.

#### Schritt 2: Zum Projekt hochladen

In claude.ai:
1. Neues Projekt erstellen oder ein Projekt öffnen
2. Klicken Sie auf "Knowledge" → "Add Files"
3. Laden Sie die Skill-Dateien hoch (oder das gesamte Verzeichnis)

**Sie sollten sehen**:
Die Wissensbasis zeigt die Dateiliste des Projekts an.

### Methode 3.2: Inhalt von SKILL.md einfügen

Wenn Sie nicht das gesamte Verzeichnis hochladen möchten, können Sie den Inhalt von `SKILL.md` direkt kopieren.

#### Schritt 1: Skill-Definition kopieren

Öffnen Sie `skills/react-best-practices/SKILL.md` und kopieren Sie den gesamten Inhalt.

**Warum**
`SKILL.md` enthält die vollständige Definition des Skills. Claude wird anhand dieser Datei die Funktionalität des Skills verstehen.

#### Schritt 2: In den Dialog einfügen

Fügen Sie den Inhalt von `SKILL.md` in einen claude.ai-Dialog ein, oder fügen Sie ihn zu den "Instructions" des Projekts hinzu.

**Sie sollten sehen**:
Claude bestätigt den Empfang der Skill-Definition.

## Netzwerkberechtigungen konfigurieren (wichtig)

Wenn Sie den Skill `vercel-deploy` zum Deployment von Projekten verwenden, müssen Sie Netzwerkberechtigungen konfigurieren.

::: warning Wichtig
Der Skill `vercel-deploy` benötigt Zugriff auf die Domäne `*.vercel.com`, um Deployments hochzuladen. Wenn Sie diesen Schritt überspringen, wird das Deployment fehlschlagen!
:::

### Schritt 1: Claude-Fähigkeiten öffnen

Besuchen Sie im Browser:

```
https://claude.ai/settings/capabilities
```

**Warum**
Hier kontrollieren Sie, welche Domänen Claude zugreifen darf.

### Schritt 2: Vercel-Domäne hinzufügen

Klicken Sie auf "Add domain" und geben Sie ein:

```
*.vercel.com
```

Klicken Sie auf "Save" zum Speichern.

**Sie sollten sehen**:
Die Domänenliste zeigt `*.vercel.com` an.

**Kontrollpunkt ✅**: Die Domäne wurde hinzugefügt, der Skill kann nun auf das Netzwerk zugreifen.

## Häufige Fallstricke

### Problem 1: Skill nicht aktiviert

**Symptom**: Sie geben "Deploy my app" ein, aber Claude weiß nicht, was er tun soll.

**Mögliche Ursachen**:
- Claude Code wurde nicht neu gestartet (bei manueller Installation)
- Die Projekt-Wissensbasis von claude.ai hat den Skill nicht korrekt geladen

**Lösung**:
- Claude Code: Anwendung neu starten
- claude.ai: Bestätigen, dass die Skill-Dateien in die Wissensbasis (Knowledge) des Projekts hochgeladen wurden

### Problem 2: Deployment gescheitert (Network Egress Error)

**Symptom**:
```
Deployment failed due to network restrictions
```

**Lösung**:
Überprüfen Sie, ob `*.vercel.com` zu den Netzwerkberechtigungen hinzugefügt wurde:
```
Besuchen Sie https://claude.ai/settings/capabilities
Überprüfen Sie, ob *.vercel.com enthalten ist
```

### Problem 3: Verzeichnis `~/.claude/skills/` nicht gefunden

**Symptom**: Die manuelle Installation meldet, dass das Verzeichnis nicht existiert.

**Lösung**:
```bash
mkdir -p ~/.claude/skills/
```

### Problem 4: npx-Installation fehlgeschlagen

**Symptom**:
```
npx: command not found
```

**Lösung**:
```bash
# Bestätigen Sie, dass Node.js und npm installiert sind
node -v
npm -v

# Wenn nicht installiert, installieren Sie die LTS-Version von https://nodejs.org/
```

## Zusammenfassung dieser Lektion

Diese Lektion hat drei Installationsmethoden für Agent Skills vorgestellt:
- **Schnelle Installation mit npx**: Empfohlen für Claude Code, führt alle Schritte automatisch aus
- **Manuelle Installation**: Kopieren der Dateien nach `~/.claude/skills/`, geeignet wenn Sie den Installationsort kontrollieren möchten
- **Installation in claude.ai**: Hochladen der Dateien in die Projekt-Wissensbasis oder Einfügen von SKILL.md

Wenn Sie den Skill `vercel-deploy` verwenden, vergessen Sie nicht, `*.vercel.com` zu den Netzwerkberechtigungen unter `https://claude.ai/settings/capabilities` hinzuzufügen.

Nach der Installation können Sie Claude automatisch diese Skills für die Codeüberprüfung, Barrierefreiheitsprüfung und Projektdeployment nutzen lassen.

## Vorschau auf die nächste Lektion

> Die nächste Lektion behandelt **[React/Next.js Performance-Optimierung Best Practices](../../platforms/react-best-practices/)**.
>
> Sie werden lernen:
> - Wie man die 57 Regeln zur React-Performance-Optimierung anwendet
> - Beseitigung von Waterfalls, Optimierung der Bundle-Größe, Reduzierung von Re-renders
> - Lassen Sie die KI automatisch Code prüfen und Reparaturvorschläge machen

---

## Anhang: Quellcodereferenz

<details>
<summary><strong>Klicken zum Anzeigen der Quellcodepositionen</strong></summary>

> Aktualisierungszeit: 2026-01-25

| Funktion          | Dateipfad                                                                                      | Zeilen    |
| ------------- | --------------------------------------------------------------------------------------------- | ------- |
| npx-Installationsmethode  | [`README.md:83-86`](https://github.com/vercel-labs/agent-skills/blob/main/README.md#L83-L86)  | 83-86   |
| Claude Code manuelle Installation | [`AGENTS.md:98-105`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L98-L105) | 98-105  |
| claude.ai Installationsmethode | [`AGENTS.md:106-109`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L106-L109) | 106-109  |
| Netzwerkberechtigungskonfiguration  | [`skills/claude.ai/vercel-deploy-claimable/SKILL.md:104-112`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/SKILL.md#L104-L112) | 104-112  |

**Wichtige Skillpakete**:
- `react-best-practices`: 57 Regeln zur React-Performance-Optimierung (tatsächliche Anzahl der Regeldateien)
- `web-design-guidelines`: 100+ Regeln zur Web-Design-Leitlinie
- `vercel-deploy`: Ein-Klick-Deployment auf Vercel (40+ Framework-Unterstützung)

</details>

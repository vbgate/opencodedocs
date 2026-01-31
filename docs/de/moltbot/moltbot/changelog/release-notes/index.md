---
title: "Versionsänderungsprotokoll: Neue Funktionen, Verbesserungen und Breaking Changes | Clawdbot Tutorial"
sidebarTitle: "Was ist neu"
subtitle: "Versionsänderungsprotokoll: Neue Funktionen, Verbesserungen und Breaking Changes"
description: "Erfahren Sie mehr über die Versionshistorie von Clawdbot, einschließlich neuer Funktionen, Verbesserungen, Fehlerbehebungen und Breaking Changes. Dieses Tutorial hilft Ihnen, die Funktionsentwicklung zu verfolgen und Ihr System aktuell zu halten."
tags:
  - "Änderungsprotokoll"
  - "Versionshistorie"
  - "changelog"
prerequisite: []
order: 380
---

# Versionsänderungsprotokoll: Neue Funktionen, Verbesserungen und Breaking Changes

Clawdbot wird kontinuierlich weiterentwickelt, wobei jede Version neue Funktionen, Leistungsverbesserungen und Sicherheitserweiterungen mit sich bringt. Dieses Protokoll hilft Ihnen, die Versionsentwicklung schnell zu verstehen und zu entscheiden, wann und worauf Sie beim Upgrade achten sollten.

## Was Sie lernen werden

- Die neuesten Funktionen und Highlights jeder Version kennenlernen
- Breaking Changes verstehen, um Unterbrechungen beim Upgrade zu vermeiden
- Die Liste der Fehlerbehebungen überprüfen, um zu sehen, ob Ihr Problem gelöst wurde
- Die Funktionsentwicklung verfolgen und die Nutzung neuer Features planen

::: tip Versionsnummern-Erklärung
Versionsnummernformat: `YYYY.M.D` (Jahr.Monat.Tag)

- **Hauptversion**: Änderungen der Jahres- oder Monatszahl bedeuten in der Regel größere Funktionsupdates
- **Patch-Version**: `-1`, `-2`, `-3` kennzeichnen Bugfix-Releases, die nur Fehlerbehebungen enthalten
:::

---

## 2026.1.25
**Status**: Unveröffentlicht

### Highlights

Noch keine

### Änderungen (Changes)

- **Agents**: `tools.exec.safeBins` bei exec-Allowlist-Prüfung berücksichtigen (#2281)
- **Docs**: Fly Private-Deployment-Schritte verschärfen (#2289) - Danke an @dguido
- **Gateway**: Warnung bei Hook-Token-Übergabe via Query-Parameter; bevorzugte Header-Authentifizierung dokumentieren (#2200) - Danke an @YuriNachos
- **Gateway**: Gefährliches Control-UI-Geräteauthentifizierungs-Bypass-Flag + Audit-Warnung hinzufügen (#2248)
- **Doctor**: Warnung bei exponiertem Gateway ohne Authentifizierung (#2016) - Danke an @Alex-Alaniz
- **Discord**: Konfigurierbare privilegierte Gateway-Intents (presences/members) hinzufügen (#2266) - Danke an @kentaro
- **Docs**: Vercel AI Gateway zur Provider-Sidebar hinzufügen (#1901) - Danke an @jerilynzheng
- **Agents**: Cron-Tool-Beschreibung mit vollständiger Schema-Dokumentation erweitern (#1988) - Danke an @tomascupr
- **Skills**: Fehlende Abhängigkeits-Metadaten für GitHub, Notion, Slack, Discord hinzufügen (#1995) - Danke an @jackheuberger
- **Docs**: Render-Deployment-Anleitung hinzufügen (#1975) - Danke an @anurag
- **Docs**: Claude Max API-Proxy-Anleitung hinzufügen (#1875) - Danke an @atalovesyou
- **Docs**: DigitalOcean-Deployment-Anleitung hinzufügen (#1870) - Danke an @0xJonHoldsCrypto
- **Docs**: Raspberry Pi-Installationsanleitung hinzufügen (#1871) - Danke an @0xJonHoldsCrypto
- **Docs**: GCP Compute Engine-Deployment-Anleitung hinzufügen (#1848) - Danke an @hougangdev
- **Docs**: LINE-Kanal-Anleitung hinzufügen - Danke an @thewilloftheshadow
- **Docs**: Zwei Mitwirkende für Control-UI-Refresh würdigen (#1852) - Danke an @EnzeD
- **Onboarding**: Venice API-Key zum nicht-interaktiven Flow hinzufügen (#1893) - Danke an @jonisjongithub
- **Onboarding**: Beta-Sicherheitswarnungstext + Zugangskontroll-Erwartungen verstärken
- **Tlon**: Thread-Antwort-ID als `@ud` formatieren (#1837) - Danke an @wca4a
- **Gateway**: Neueste Session-Metadaten beim Zusammenführen des Speichers bevorzugen (#1823) - Danke an @emanuelst
- **Web UI**: Sub-Agent-Ankündigungsantworten in WebChat sichtbar halten (#1977) - Danke an @andrescardonas7
- **CI**: Node-Heap-Größe für macOS-Checks erhöhen (#1890) - Danke an @realZachi
- **macOS**: Absturz beim Rendern von Codeblöcken durch Upgrade auf Textual 0.3.1 vermeiden (#2033) - Danke an @garricn
- **Browser**: Fallback auf URL-Matching für Extension-Relay-Zielauflösung (#1999) - Danke an @jonit-dev
- **Update**: dist/control-ui bei Dirty-Check ignorieren und nach UI-Build wiederherstellen (#1976) - Danke an @Glucksberg
- **Telegram**: Caption-Parameter bei Medienversand erlauben (#1888) - Danke an @mguellsegarra
- **Telegram**: Plugin sendPayload channelData (Medien/Buttons) unterstützen und Plugin-Befehle validieren (#1917) - Danke an @JoshuaLelon
- **Telegram**: Chunk-Antworten vermeiden, wenn Streaming deaktiviert ist (#1885) - Danke an @ivancasco
- **Auth**: Kopierbare Google-Auth-URL nach ASCII-Prompt anzeigen (#1787) - Danke an @robbyczgw-cla
- **Routing**: Session-Key-Regex vorkompilieren (#1697) - Danke an @Ray0907
- **TUI**: Breitenüberlauf beim Rendern von Auswahllisten vermeiden (#1686) - Danke an @mossein
- **Telegram**: Themen-ID in Neustart-Sentinel-Benachrichtigungen beibehalten (#1807) - Danke an @hsrvc
- **Config**: `config.env` vor `${VAR}`-Ersetzung anwenden (#1813) - Danke an @spanishflu-est1918
- **Slack**: Ack-Reaktion nach Streaming-Antwort löschen (#2044) - Danke an @fancyboi999
- **macOS**: Benutzerdefinierten SSH-Benutzernamen in Remote-Zielen beibehalten (#2046) - Danke an @algal

### Fehlerbehebungen (Fixes)

- **Telegram**: Reasoning-Kursivschrift pro Zeile umbrechen, um rohe Unterstriche zu vermeiden (#2181) - Danke an @YuriNachos
- **Voice Call**: Twilio-Webhook-Signaturvalidierung für ngrok-URLs erzwingen; ngrok-Free-Tier-Bypass standardmäßig deaktivieren
- **Security**: Tailscale-Serve-Authentifizierung durch Validierung der lokalen tailscaled-Identität vor Header-Vertrauen härten
- **Build**: memory-core Peer-Abhängigkeiten mit Lockfile abgleichen
- **Security**: mDNS-Discovery-Modus hinzufügen, standardmäßig minimal zur Reduzierung von Informationslecks (#1882) - Danke an @orlyjamie
- **Security**: URL-Fetch durch DNS-Pinning härten, um Rebinding-Risiken zu reduzieren - Danke an Chris Zheng
- **Web UI**: WebChat-Bild-Einfüge-Vorschau verbessern und Nur-Bild-Versand erlauben (#1925) - Danke an @smartprogrammer93
- **Security**: Externen Hook-Inhalt standardmäßig mit Per-Hook-Opt-out-Option umschließen (#1827) - Danke an @mertcicekci0
- **Gateway**: Standard-Authentifizierung schlägt jetzt fehl-geschlossen (erfordert Token/Passwort; Tailscale-Serve-Identität weiterhin erlaubt)
- **Onboarding**: Nicht unterstützte Gateway-Auth-"off"-Auswahl aus Onboarding/Configure-Flow und CLI-Flags entfernen

---

## 2026.1.24-3

### Fehlerbehebungen (Fixes)

- **Slack**: Bild-Download-Fehler durch fehlenden Authorization-Header bei Cross-Domain-Redirect beheben (#1936) - Danke an @sanderhelgesen
- **Gateway**: Lokale Client-Erkennung und Reverse-Proxy-Behandlung für nicht authentifizierte Proxy-Verbindungen härten (#1795) - Danke an @orlyjamie
- **Security audit**: Loopback-Control-UI mit deaktivierter Authentifizierung als kritisch markieren (#1795) - Danke an @orlyjamie
- **CLI**: claude-cli-Session wiederherstellen und CLI-Antworten an TUI-Client streamen (#1921) - Danke an @rmorse

---

## 2026.1.24-2

### Fehlerbehebungen (Fixes)

- **Packaging**: dist/link-understanding-Ausgabe in npm-Tarball einschließen (behebt fehlenden apply.js-Import bei Installation)

---

## 2026.1.24-1

### Fehlerbehebungen (Fixes)

- **Packaging**: dist/shared-Ausgabe in npm-Tarball einschließen (behebt fehlenden reasoning-tags-Import bei Installation)

---

## 2026.1.24

### Highlights

- **Providers**: Ollama-Discovery + Dokumentation; Venice-Anleitung-Upgrade + Querverweise (#1606) - Danke an @abhaymundhara
- **Channels**: LINE-Plugin (Messaging API) mit Rich-Replies + Quick-Replies (#1630) - Danke an @plum-dawg
- **TTS**: Edge-Fallback (ohne Key) + `/tts`-Auto-Modus (#1668, #1667) - Danke an @steipete, @sebslight
- **Exec approvals**: Chat-interne Genehmigung über `/approve` in allen Kanälen (einschließlich Plugins) (#1621) - Danke an @czekaj
- **Telegram**: DM-Themen als separate Sessions + ausgehende Link-Vorschau-Toggle (#1597, #1700) - Danke an @rohannagpal, @zerone0x

### Änderungen (Changes)

- **Channels**: LINE-Plugin (Messaging API) mit Rich-Replies, Quick-Replies und Plugin-HTTP-Registry hinzufügen (#1630) - Danke an @plum-dawg
- **TTS**: Edge-TTS-Provider-Fallback hinzufügen, standardmäßig Edge ohne Key, bei Formatfehler MP3 erneut versuchen (#1668) - Danke an @steipete
- **TTS**: Auto-Modus-Enum (off/always/inbound/tagged) mit Per-Session `/tts`-Override hinzufügen (#1667) - Danke an @sebslight
- **Telegram**: DM-Themen als separate Sessions behandeln und DM-Verlaufslimit mit Thread-Suffix stabil halten (#1597) - Danke an @rohannagpal
- **Telegram**: `channels.telegram.linkPreview` zum Umschalten der ausgehenden Link-Vorschau hinzufügen (#1700) - Danke an @zerone0x
- **Web search**: Brave-Freshness-Filter-Parameter für zeitlich begrenzte Ergebnisse hinzufügen (#1688) - Danke an @JonUleis
- **UI**: Control-UI-Dashboard-Designsystem aktualisieren (Farben, Icons, Typografie) (#1745, #1786) - Danke an @EnzeD, @mousberg
- **Exec approvals**: Genehmigungsaufforderungen an Chat weiterleiten, `/approve` für alle Kanäle (einschließlich Plugins) unterstützen (#1621) - Danke an @czekaj
- **Gateway**: `config.patch` in Gateway-Tools exponieren, sichere Teilupdates + Neustart-Sentinel unterstützen (#1653) - Danke an @Glucksberg
- **Diagnostics**: Diagnose-Flags für gezielte Debug-Logs (Config + Env-Override) hinzufügen
- **Docs**: FAQ erweitern (Migration, Scheduling, Parallelität, Modellempfehlungen, OpenAI-Abo-Auth, Pi-Größe, Hackable-Installation, Docs-SSL-Workaround)
- **Docs**: Detaillierte Installer-Fehlerbehebungsanleitung hinzufügen
- **Docs**: macOS-VM-Anleitung mit lokalen/gehosteten Optionen + VPS/Node-Anleitung hinzufügen (#1693) - Danke an @f-trycua
- **Docs**: Bedrock-EC2-Instanzrollen-Setup + IAM-Schritte hinzufügen (#1625) - Danke an @sergical
- **Docs**: Fly.io-Anleitungsbeschreibung aktualisieren
- **Dev**: prek Pre-Commit-Hooks + wöchentliche Abhängigkeits-Update-Konfiguration hinzufügen (#1720) - Danke an @dguido

### Fehlerbehebungen (Fixes)

- **Web UI**: Config/Debug-Layout-Überlauf, Scrollen und Codeblock-Größe beheben (#1715) - Danke an @saipreetham589
- **Web UI**: Stop-Button während aktivem Lauf anzeigen, bei Leerlauf zu neuer Session wechseln (#1664) - Danke an @ndbroadbent
- **Web UI**: Veraltetes Disconnect-Banner bei Wiederverbindung löschen; Speichern von Formularen ohne Schema-Pfad erlauben, aber fehlendes Schema blockieren (#1707) - Danke an @Glucksberg
- **Web UI**: Interne `message_id`-Hinweise in Chat-Blasen ausblenden
- **Gateway**: Control-UI-Nur-Token-Auth erlauben, Gerätekopplung zu überspringen, auch wenn Geräteidentität existiert (`gateway.controlUi.allowInsecureAuth`) (#1679) - Danke an @steipete
- **Matrix**: Entschlüsselte E2EE-Medienanhänge mit Preflight-Größe schützen (#1744) - Danke an @araa47
- **BlueBubbles**: Telefonnummernziele an DM routen, Routing-ID-Leak vermeiden und fehlende DMs automatisch erstellen (erfordert Private API) (#1751) - Danke an @tyler6204
- **BlueBubbles**: Part-Index-GUID in Antwort-Tags beibehalten, wenn Short-ID fehlt
- **iMessage**: chat_id/chat_guid/chat_identifier-Präfixe case-insensitiv normalisieren und Service-Präfix-Handle stabil halten (#1708) - Danke an @aaronn
- **Signal**: Reaction-Versand beheben (group/UUID-Ziel + CLI-Author-Flag) (#1651) - Danke an @vilkasdev
- **Signal**: Konfigurierbares signal-cli-Startup-Timeout + externe Daemon-Modus-Dokumentation hinzufügen (#1677)
- **Telegram**: fetch duplex="half" für Uploads auf Node 22 setzen, um sendPhoto-Fehler zu vermeiden (#1684) - Danke an @commdata2338
- **Telegram**: Wrapped fetch für Long-Polling auf Node verwenden, um AbortSignal-Behandlung zu normalisieren (#1639)
- **Telegram**: Per-Account-Proxy für ausgehende API-Aufrufe berücksichtigen (#1774) - Danke an @radek-paclt
- **Telegram**: Auf Text zurückfallen, wenn Sprachnotiz durch Datenschutzeinstellungen blockiert ist (#1725) - Danke an @foeken
- **Voice Call**: Streaming-TwiML bei initialem Twilio-Webhook für ausgehende Session-Anrufe zurückgeben (#1634)
- **Voice Call**: Twilio-TTS-Wiedergabe serialisieren und bei Unterbrechung abbrechen, um Überlappung zu verhindern (#1713) - Danke an @dguido
- **Google Chat**: E-Mail-Allowlist-Matching verschärfen, Eingabe bereinigen, Medien-Limits und Onboarding/Docs/Tests (#1635) - Danke an @iHildy
- **Google Chat**: Space-Ziele ohne doppeltes `spaces/`-Präfix normalisieren
- **Agents**: Bei Context-Overflow-Prompt-Fehler automatisch komprimieren (#1627) - Danke an @rodrigouroz
- **Agents**: Aktives Auth-Profil für Auto-Komprimierungs-Recovery verwenden
- **Media understanding**: Bildverständnis überspringen, wenn Hauptmodell bereits Vision unterstützt (#1747) - Danke an @tyler6204
- **Models**: Fehlende Custom-Provider-Felder standardmäßig setzen, um minimale Konfiguration zu akzeptieren
- **Messaging**: Newline-Block-Splitting für Fenced-Markdown-Blöcke kanalübergreifend sicher halten
- **Messaging**: Newline-Block-Verarbeitung absatzorientiert (Leerzeilen-Split), um Listen und Überschriften zusammenzuhalten (#1726) - Danke an @tyler6204
- **TUI**: Verlauf nach Gateway-Wiederverbindung neu laden, um Session-Status wiederherzustellen (#1663)
- **Heartbeat**: Ziel-Identifikatoren normalisieren, um Routing konsistent zu halten
- **Exec**: Genehmigung für erhöhte Ask beibehalten, außer im Full-Modus (#1616) - Danke an @ivancasco
- **Exec**: Windows-Plattform-Tags als Windows für Node-Shell-Auswahl behandeln (#1760) - Danke an @ymat19
- **Gateway**: Inline-Config-Env-Variablen in Service-Installationsumgebung einschließen (#1735) - Danke an @Seredeep
- **Gateway**: Tailscale-DNS-Probe überspringen, wenn tailscale.mode off ist (#1671)
- **Gateway**: Log-Rauschen für verzögerte Aufrufe + Remote-Node-Probes reduzieren; Skill-Refresh entprellen (#1607) - Danke an @petter-b
- **Gateway**: Control-UI/WebChat-Auth-Fehlermeldung bei fehlendem Token verdeutlichen (#1690)
- **Gateway**: IPv6-Loopback mithören, wenn an 127.0.0.1 gebunden, damit localhost-Webhooks funktionieren
- **Gateway**: Lockfile in temporärem Verzeichnis speichern, um veraltete Locks auf persistenten Volumes zu vermeiden (#1676)
- **macOS**: Direkte `ws://`-URL-Übertragung standardmäßig auf Port 18789; `gateway.remote.transport` dokumentieren (#1603) - Danke an @ngutman
- **Tests**: Vitest-Worker auf CI-macOS begrenzen, um Timeouts zu reduzieren (#1597) - Danke an @rohannagpal
- **Tests**: Fake-Timer-Abhängigkeit in Embedded-Runner-Stream-Mock vermeiden, um CI-Flakiness zu reduzieren (#1597) - Danke an @rohannagpal
- **Tests**: Embedded-Runner-Sortiertest-Timeout erhöhen, um CI-Flakiness zu reduzieren (#1597) - Danke an @rohannagpal

---

## 2026.1.23-1

### Fehlerbehebungen (Fixes)

- **Packaging**: dist/tts-Ausgabe in npm-Tarball einschließen (behebt fehlende dist/tts/tts.js)

---

## 2026.1.23

### Highlights

- **TTS**: Telegram-TTS in Core verschieben + standardmäßig modellgesteuerte TTS-Tags für ausdrucksstarke Audio-Antworten aktivieren (#1559) - Danke an @Glucksberg
- **Gateway**: `/tools/invoke`-HTTP-Endpunkt für direkte Tool-Aufrufe hinzufügen (erzwingt Authentifizierung + Tool-Richtlinien) (#1575) - Danke an @vignesh07
- **Heartbeat**: Pro-Kanal-Sichtbarkeitskontrolle (OK/Alerts/Indicator) (#1452) - Danke an @dlauer
- **Deploy**: Fly.io-Deployment-Unterstützung + Anleitung hinzufügen (#1570)
- **Channels**: Tlon/Urbit-Kanal-Plugin (DM, Gruppenerwähnungen, Thread-Antworten) hinzufügen (#1544) - Danke an @wca4a

### Änderungen (Changes)

- **Channels**: Pro-Gruppe Tool-Allow/Deny-Richtlinien in integrierten + Plugin-Kanälen erlauben (#1546) - Danke an @adam91holt
- **Agents**: Bedrock-Auto-Discovery-Defaults + Config-Override hinzufügen (#1553) - Danke an @fal3
- **CLI**: `clawdbot system` für Systemereignisse + Heartbeat-Kontrolle hinzufügen; eigenständiges `wake` entfernen
- **CLI**: Live-Auth-Probe zu `clawdbot models status` für Pro-Profil-Validierung hinzufügen
- **CLI**: Gateway nach `clawdbot update` standardmäßig neu starten; `--no-restart` zum Überspringen hinzufügen
- **Browser**: Node-Host-Proxy-Auto-Routing für Remote-Gateways hinzufügen (pro Gateway/Node konfigurierbar)
- **Plugins**: Optionales `llm-task`-JSON-only-Tool für Workflows hinzufügen (#1498) - Danke an @vignesh07
- **Markdown**: Pro-Kanal-Tabellenkonvertierung hinzufügen (Signal/WhatsApp verwenden Aufzählungszeichen, andere Codeblöcke) (#1495) - Danke an @odysseus0
- **Agents**: System-Prompt nur Zeitzone behalten und aktuelle Zeit zu `session_status` verschieben für bessere Cache-Treffer
- **Agents**: Redundante Bash-Tool-Aliase aus Tool-Registrierung/Anzeige entfernen (#1571) - Danke an @Takhoffman
- **Docs**: Cron-vs-Heartbeat-Entscheidungsleitfaden (mit Lobster-Workflow-Notizen) hinzufügen (#1533) - Danke an @JustYannicc
- **Docs**: Klarstellen, dass leere HEARTBEAT.md-Datei Heartbeat überspringt, fehlende Datei läuft weiter (#1535) - Danke an @JustYannicc

### Fehlerbehebungen (Fixes)

- **Sessions**: Nicht-UUID-sessionIds für History/Send/Status akzeptieren, Agent-Scope beibehalten
- **Heartbeat**: Plugin-Channel-IDs für Heartbeat-Zielvalidierung + UI-Hinweise akzeptieren
- **Messaging/Sessions**: Ausgehende Sends an Ziel-Session-Key spiegeln (Thread + dmScope), Session-Eintrag bei Send erstellen und Session-Key-Groß-/Kleinschreibung normalisieren (#1520)
- **Sessions**: Array-gestützte Session-Speicher ablehnen, um stilles Löschen zu verhindern (#1469)
- **Gateway**: Linux-Prozess-Startzeit vergleichen, um PID-Recycling-Lock-Schleifen zu vermeiden; Lock beibehalten, außer wenn veraltet (#1572) - Danke an @steipete
- **Gateway**: Null-optionale Felder in Exec-Genehmigungsanfragen akzeptieren (#1511) - Danke an @pvoo
- **Exec approvals**: Allowlist-Eintrags-ID persistieren, um macOS-Allowlist-Zeilen stabil zu halten (#1521) - Danke an @ngutman
- **Exec**: tools.exec ask/security-Defaults für erhöhte Genehmigungen berücksichtigen (unnötige Prompts vermeiden)
- **Daemon**: Plattform-PATH-Trennzeichen beim Erstellen minimaler Service-Pfade verwenden
- **Linux**: Env-konfiguriertes User-Bin-Root in systemd-PATH einschließen und PATH-Audit ausrichten (#1512) - Danke an @robbyczgw-cla
- **Tailscale**: serve/funnel nur bei Berechtigungsfehler mit sudo wiederholen und ursprüngliche Fehlerdetails beibehalten (#1551) - Danke an @sweepies
- **Docker**: Gateway-Befehl in docker-compose und Hetzner-Anleitung aktualisieren (#1514)
- **Agents**: Tool-Fehler-Fallback anzeigen, wenn letzte Assistenten-Runde nur Tools aufgerufen hat (stilles Stoppen verhindern)
- **Agents**: IDENTITY.md-Template-Platzhalter beim Parsen der Identität ignorieren (#1556)
- **Agents**: Verwaiste OpenAI-Responses-Reasoning-Blöcke bei Modellwechsel löschen (#1562) - Danke an @roshanasingh4
- **Agents**: CLI-Log-Hinweis zu "Agent failed before replying"-Nachricht hinzufügen (#1550) - Danke an @sweepies
- **Agents**: Warnen und Tool-Allowlists ignorieren, die nur auf unbekannte oder nicht geladene Plugin-Tools verweisen (#1566)
- **Agents**: Nur-Plugin-Tool-Allowlists als Opt-in behandeln; Core-Tools aktiviert lassen (#1467)
- **Agents**: Enqueue-Override für eingebettete Läufe berücksichtigen, um Queue-Deadlocks in Tests zu vermeiden
- **Slack**: Offene groupPolicy für nicht gelistete Kanäle in Message + Slash-Gate berücksichtigen (#1563) - Danke an @itsjaydesu
- **Discord**: Auto-Thread-Erwähnungs-Bypass auf Bot-eigene Threads beschränken; Ack-Reaktions-Erwähnungs-Gate beibehalten (#1511) - Danke an @pvoo
- **Discord**: Rate-limitierte Allowlist-Auflösung + Befehlsbereitstellung wiederholen, um Gateway-Absturz zu vermeiden
- **Mentions**: mentionPattern-Match in Gruppenchats ignorieren, wenn eine andere explizite Erwähnung existiert (Slack/Discord/Telegram/WhatsApp)
- **Telegram**: Markdown in Medien-Captions rendern (#1478)
- **MS Teams**: `.default`-Suffix aus Graph-Scopes und Bot-Framework-Probe-Scopes entfernen (#1507, #1574) - Danke an @Evizero
- **Browser**: Extension-Relay-Tab steuerbar halten, wenn Extension Session-ID nach Tab-Wechsel wiederverwendet (#1160)
- **Voice wake**: Wake-Word bei Blur/Submit über iOS/Android automatisch speichern und Limits mit macOS ausrichten
- **UI**: Control-UI-Sidebar beim Scrollen langer Seiten sichtbar halten (#1515) - Danke an @pookNast
- **UI**: Control-UI-Markdown-Rendering cachen + Chat-Text-Extraktion memoizen, um Safari-Eingabe-Jitter zu reduzieren
- **TUI**: Unbekannte Slash-Befehle weiterleiten, Gateway-Befehle in Autocomplete einschließen und Slash-Antworten als Systemausgabe rendern
- **CLI**: Auth-Probe-Ausgabe polieren (Tabellenausgabe, Inline-Fehler, Rauschen reduzieren und Zeilenumbruch-Fix in `clawdbot models status`)
- **Media**: `MEDIA:`-Tags nur parsen, wenn sie am Zeilenanfang stehen, um Prosa-Erwähnungen nicht zu entfernen (#1206)
- **Media**: PNG-Alpha wenn möglich beibehalten; auf JPEG zurückfallen, wenn Größenlimit weiterhin überschritten (#1491) - Danke an @robbyczgw-cla
- **Skills**: bird-Homebrew-Installation auf macOS beschränken (#1569) - Danke an @bradleypriest

---

## Upgrade-Empfehlungen

### Vor dem Upgrade prüfen

Vor dem Upgrade auf eine neue Version wird empfohlen:

1. **Breaking Changes lesen**: Prüfen, ob Breaking Changes Ihre Konfiguration betreffen
2. **Konfiguration sichern**: `~/.clawdbot/clawdbot.json` sichern
3. **Diagnose ausführen**: `clawdbot doctor` um sicherzustellen, dass der aktuelle Systemzustand gesund ist
4. **Abhängigkeiten prüfen**: Sicherstellen, dass die Node.js-Version den Anforderungen entspricht (≥22)

### Nach dem Upgrade verifizieren

Nach Abschluss des Upgrades folgende Überprüfungen durchführen:

```bash
# 1. Version prüfen
clawdbot --version

# 2. Status prüfen
clawdbot status

# 3. Kanalverbindungen verifizieren
clawdbot channels status

# 4. Nachrichtenversand testen
clawdbot message "Hello" --target=<your-channel>
```

### Vollständiges Änderungsprotokoll anzeigen

Für detailliertere Versionshistorie und Issue-Links besuchen Sie:

- **GitHub Releases**: https://github.com/moltbot/moltbot/releases
- **Offizielle Dokumentation**: https://docs.clawd.bot

---

## Historische Versionen

Für ältere Versionsupdates besuchen Sie [GitHub Releases](https://github.com/moltbot/moltbot/releases) oder die [CHANGELOG.md](https://github.com/moltbot/moltbot/blob/main/CHANGELOG.md) im Projektstammverzeichnis.

::: tip Beitragen
Wenn Sie einen Bug gefunden haben oder Funktionsvorschläge haben, können Sie diese gerne in den [GitHub Issues](https://github.com/moltbot/moltbot/issues) einreichen.
:::

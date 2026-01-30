---
title: "ToS-Warnung: Kontorisiken und Sicherheitspraktiken | Antigravity Auth"
sidebarTitle: "Kontosperrung vermeiden"
subtitle: "ToS-Warnung: Kontorisiken und Sicherheitspraktiken"
description: "Erfahren Sie mehr über die Nutzungsrisiken des Antigravity Auth Plugins und bewährte Sicherheitspraktiken für Ihr Konto. Verstehen Sie Hochrisiko-Szenarien, Shadow-Ban-Mechanismen und Rate-Limiting-Unterschiede. Lernen Sie Multi-Account-Strategien, Nutzungskontrolle und Account-Warming-Methoden."
tags:
  - FAQ
  - Risikohinweis
  - Kontosicherheit
prerequisite:
  - start-quick-install
order: 5
---

# ToS-Warnung

Nach diesem Kapitel verstehen Sie die möglichen Risiken bei der Nutzung des Antigravity Auth Plugins und wissen, wie Sie Ihr Google-Konto schützen können.

## Ihre aktuelle Situation

Sie erwägen, das Antigravity Auth Plugin zu verwenden, um auf die KI-Modelle von Google Antigravity zuzugreifen, haben aber einige Bedenken:

- Sie haben in der Community Berichte über gesperrte oder shadow-gebannte Konten gesehen
- Sie befürchten, dass die Nutzung inoffizieller Tools gegen Googles Nutzungsbedingungen verstößt
- Sie sind unsicher, ob Sie ein neues oder ein bestehendes Konto verwenden sollten
- Sie möchten wissen, wie Sie das Risiko minimieren können

Diese Bedenken sind berechtigt. Die Nutzung jedes inoffiziellen Tools birgt gewisse Risiken. Dieser Artikel hilft Ihnen, die konkreten Risikopunkte und Gegenmaßnahmen zu verstehen.

## Wann Sie dieses Kapitel lesen sollten

- **Vor der Plugin-Installation**: Verstehen Sie die Risiken, bevor Sie sich für die Nutzung entscheiden
- **Bei der Kontowahl**: Entscheiden Sie, welches Google-Konto Sie für die Authentifizierung verwenden
- **Bei einer Sperrung**: Verstehen Sie mögliche Ursachen und Präventivmaßnahmen
- **Bei der Neuregistrierung**: Vermeiden Sie risikoreiche Nutzungsmuster

---

## Überblick über die Kernrisiken

::: danger Wichtige Warnung

**Die Nutzung dieses Plugins kann gegen Googles Nutzungsbedingungen (Terms of Service) verstoßen.**

Einige Nutzer haben berichtet, dass ihre Google-Konten gesperrt oder shadow-gebannt wurden (Shadow Ban bedeutet eingeschränkter Zugriff ohne explizite Benachrichtigung).

**Mit der Nutzung dieses Plugins akzeptieren Sie folgende Erklärung:**
1. Dies ist ein inoffizielles Tool, das nicht von Google genehmigt oder unterstützt wird
2. Ihr Google-Konto kann vorübergehend oder dauerhaft gesperrt werden
3. Sie tragen alle Risiken und Konsequenzen der Nutzung dieses Plugins selbst

:::

### Was ist ein Shadow Ban?

**Shadow Ban** ist eine Einschränkungsmaßnahme, die Google bei verdächtigen Konten anwendet. Im Gegensatz zu einer direkten Sperrung zeigt ein Shadow Ban keine eindeutige Fehlermeldung an, sondern:
- API-Anfragen geben 403- oder 429-Fehler zurück
- Das Kontingent wird als verfügbar angezeigt, aber Aufrufe sind tatsächlich nicht möglich
- Andere Konten funktionieren normal, nur das markierte Konto ist betroffen

Ein Shadow Ban dauert in der Regel länger (Tage bis Wochen) und kann nicht durch Einspruch aufgehoben werden.

---

## Hochrisiko-Szenarien

Die folgenden Szenarien erhöhen das Risiko einer Markierung oder Sperrung Ihres Kontos erheblich:

### 🚨 Szenario 1: Brandneues Google-Konto

**Risikostufe: Sehr hoch**

Die Wahrscheinlichkeit einer Sperrung ist bei neu registrierten Google-Konten, die dieses Plugin nutzen, sehr hoch. Gründe:
- Neue Konten haben keine historischen Verhaltensdaten und werden leicht vom Missbrauchserkennungssystem von Google markiert
- Viele API-Aufrufe auf neuen Konten werden als abnormales Verhalten angesehen
- Google prüft neue Konten strenger

**Empfehlung**: Erstellen Sie kein neues Konto speziell für dieses Plugin.

### 🚨 Szenario 2: Neues Konto + Pro/Ultra-Abonnement

**Risikostufe: Sehr hoch**

Neu registrierte Konten, die sofort ein Pro- oder Ultra-Abonnement von Google abschließen, werden häufig markiert und gesperrt. Gründe:
- Das hohe Nutzungsmuster nach dem Abonnement sieht bei neuen Konten wie Missbrauch aus
- Google prüft neue zahlende Nutzer strenger
- Dieses Muster weicht zu stark vom normalen Wachstumspfad eines Nutzers ab

**Empfehlung**: Lassen Sie das Konto erst eine Weile „natürlich wachsen" (mindestens einige Monate), bevor Sie ein Abonnement in Betracht ziehen.

### 🟡 Szenario 3: Viele Anfragen in kurzer Zeit

**Risikostufe: Hoch**

Das Senden vieler API-Anfragen in kurzer Zeit oder die häufige Nutzung von parallelen Proxys/Multi-Sessions löst Rate-Limiting und Missbrauchserkennung aus. Gründe:
- Das Anfragemuster von OpenCode ist intensiver als bei nativen Anwendungen (Tool-Aufrufe, Wiederholungen, Streaming usw.)
- Hochkonkurrente Anfragen lösen Googles Schutzmechanismen aus

**Empfehlungen**:
- Kontrollieren Sie die Anfragehäufigkeit und Parallelität
- Vermeiden Sie das gleichzeitige Starten mehrerer paralleler Agenten
- Verwenden Sie Multi-Account-Rotation zur Verteilung der Anfragen

### 🟡 Szenario 4: Nutzung eines einzigen Google-Kontos

**Risikostufe: Mittel**

Wenn Sie nur ein Google-Konto haben und für wichtige Dienste (Gmail, Drive usw.) darauf angewiesen sind, ist das Risiko höher. Gründe:
- Eine Kontosperrung beeinträchtigt Ihre tägliche Arbeit
- Keine Wiederherstellung durch Einspruch möglich
- Keine Backup-Lösung vorhanden

**Empfehlung**: Verwenden Sie ein separates Konto, das nicht von wichtigen Diensten abhängt.

---

## Best-Practice-Empfehlungen

### ✅ Empfohlene Vorgehensweisen

**1. Verwenden Sie ein etabliertes Google-Konto**

Bevorzugen Sie ein Google-Konto, das bereits eine Weile genutzt wird (empfohlen: mindestens 6 Monate):
- Hat eine normale Nutzungshistorie von Google-Diensten (Gmail, Drive, Google Search usw.)
- Keine früheren Verstöße
- Konto ist mit einer Telefonnummer verknüpft und verifiziert

**2. Konfigurieren Sie mehrere Konten**

Fügen Sie mehrere Google-Konten hinzu und verteilen Sie Anfragen durch Rotation:
- Konfigurieren Sie mindestens 2-3 Konten
- Verwenden Sie die Strategie `account_selection_strategy: "hybrid"` (Standard)
- Automatischer Kontowechsel bei Rate-Limiting

**3. Kontrollieren Sie die Nutzung**

- Vermeiden Sie intensive Anfragen in kurzer Zeit
- Reduzieren Sie die Anzahl paralleler Agenten
- Setzen Sie in `antigravity.json` `max_rate_limit_wait_seconds: 0` für schnelles Scheitern statt Wiederholung

**4. Überwachen Sie den Kontostatus**

Überprüfen Sie regelmäßig den Kontostatus:
- Prüfen Sie `rateLimitResetTimes` in `~/.config/opencode/antigravity-accounts.json`
- Aktivieren Sie Debug-Logging: `OPENCODE_ANTIGRAVITY_DEBUG=1 opencode`
- Pausieren Sie die Nutzung für 24-48 Stunden bei 403/429-Fehlern

**5. Erst in der offiziellen Oberfläche „aufwärmen"**

Von Community-Nutzern berichtete effektive Methode:
1. Melden Sie sich im Browser bei [Antigravity IDE](https://idx.google.com/) an
2. Führen Sie einige einfache Prompts aus (z.B. „Hallo", „Was ist 2+2")
3. Nach 5-10 erfolgreichen Aufrufen können Sie das Plugin verwenden

**Prinzip**: Die Nutzung des Kontos über die offizielle Oberfläche lässt Google glauben, dass es sich um normales Nutzerverhalten handelt, was das Risiko einer Markierung verringert.

### ❌ Zu vermeidende Vorgehensweisen

- ❌ Erstellen Sie kein brandneues Google-Konto speziell für dieses Plugin
- ❌ Abonnieren Sie nicht sofort Pro/Ultra auf einem neu registrierten Konto
- ❌ Verwenden Sie nicht Ihr einziges Konto für wichtige Dienste (z.B. Arbeits-E-Mail)
- ❌ Wiederholen Sie nicht ständig nach einem 429-Limit
- ❌ Starten Sie nicht viele parallele Agenten gleichzeitig
- ❌ Committen Sie `antigravity-accounts.json` nicht in die Versionskontrolle

---

## Häufig gestellte Fragen

### F: Mein Konto wurde gesperrt, kann ich Einspruch einlegen?

**A: Nein.**

Wenn die Sperrung oder der Shadow Ban durch die Missbrauchserkennung von Google aufgrund dieses Plugins ausgelöst wurde, ist eine Wiederherstellung durch Einspruch in der Regel nicht möglich. Gründe:
- Die Sperrung wird automatisch basierend auf API-Nutzungsmustern ausgelöst
- Google hat eine strenge Haltung gegenüber der Nutzung inoffizieller Tools
- Bei einem Einspruch müssten Sie den Verwendungszweck des Tools erklären, aber dieses Plugin selbst könnte als Verstoß angesehen werden

**Empfehlungen**:
- Verwenden Sie andere nicht betroffene Konten
- Wenn alle Konten gesperrt sind, nutzen Sie direkt [Antigravity IDE](https://idx.google.com/)
- Vermeiden Sie weitere Versuche auf dem gesperrten Konto

### F: Wird mein Konto bei Nutzung dieses Plugins definitiv gesperrt?

**A: Nicht unbedingt.**

Die meisten Nutzer haben bei der Verwendung dieses Plugins keine Probleme. Das Risiko hängt ab von:
- Kontoalter und historischem Verhalten
- Nutzungshäufigkeit und Anfragemuster
- Einhaltung der Best Practices

**Risikobewertung**:
- Altes Konto + moderate Nutzung + Multi-Account-Rotation → Niedriges Risiko
- Neues Konto + intensive Anfragen + Einzelkonto → Hohes Risiko

### F: Was ist der Unterschied zwischen Shadow Ban und Rate-Limiting?

**A: Grundlegend unterschiedlich, auch die Wiederherstellungsmethoden.**

| Merkmal | Shadow Ban | Rate-Limiting (429) |
| --- | --- | --- |
| Auslöser | Missbrauchserkennung, als verdächtig markiert | Anfragehäufigkeit überschreitet Kontingent |
| Fehlercode | 403 oder stilles Scheitern | 429 Too Many Requests |
| Dauer | Tage bis Wochen | Stunden bis ein Tag |
| Wiederherstellung | Nicht möglich, anderes Konto erforderlich | Warten auf Reset oder Kontowechsel |
| Vermeidbar | Best Practices befolgen reduziert Risiko | Anfragehäufigkeit kontrollieren |

### F: Kann ich ein Unternehmens-Google-Konto verwenden?

**A: Nicht empfohlen.**

Unternehmenskonten sind in der Regel mit wichtigen Diensten und Daten verknüpft, eine Sperrung hat schwerwiegendere Auswirkungen. Außerdem:
- Unternehmenskonten werden strenger geprüft
- Könnte gegen die IT-Richtlinien des Unternehmens verstoßen
- Das Risiko trägt die Einzelperson, aber es betrifft das Team

**Empfehlung**: Verwenden Sie ein persönliches Konto.

### F: Können mehrere Konten eine Sperrung vollständig verhindern?

**A: Nicht vollständig, aber sie können die Auswirkungen reduzieren.**

Vorteile mehrerer Konten:
- Verteilung der Anfragen, geringere Wahrscheinlichkeit, dass ein einzelnes Konto Limits auslöst
- Wenn ein Konto gesperrt wird, sind andere Konten weiterhin verfügbar
- Automatischer Wechsel bei Limits, höhere Verfügbarkeit

**Aber mehrere Konten sind kein „Schutzschild"**:
- Wenn alle Konten die Missbrauchserkennung auslösen, können alle gesperrt werden
- Missbrauchen Sie nicht mehrere Konten für intensive Anfragen
- Jedes Konto muss weiterhin den Best Practices folgen

---

## Checkliste ✅

Nach diesem Kapitel sollten Sie wissen:
- [ ] Die Nutzung dieses Plugins kann gegen Googles ToS verstoßen, auf eigenes Risiko
- [ ] Neues Konto + Pro/Ultra-Abonnement ist ein Hochrisiko-Szenario
- [ ] Empfohlen wird die Verwendung eines etablierten Google-Kontos
- [ ] Die Konfiguration mehrerer Konten kann das Risiko verteilen
- [ ] Nach einer Kontosperrung ist keine Wiederherstellung durch Einspruch möglich
- [ ] Die Kontrolle von Anfragehäufigkeit und Nutzung ist wichtig

---

## Zusammenfassung

Dieses Kapitel hat die möglichen Risiken bei der Nutzung des Antigravity Auth Plugins vorgestellt:

1. **Kernrisiken**: Möglicher Verstoß gegen Googles ToS, Konto kann gesperrt oder shadow-gebannt werden
2. **Hochrisiko-Szenarien**: Neues Konto, neues Konto + Abonnement, intensive Anfragen, einzelnes wichtiges Konto
3. **Best Practices**: Altes Konto verwenden, mehrere Konten konfigurieren, Nutzung kontrollieren, Status überwachen, erst „aufwärmen"
4. **Häufige Fragen**: Kein Einspruch möglich, Risiko variiert individuell, mehrere Konten können Auswirkungen reduzieren

Bitte bewerten Sie die Risiken sorgfältig, bevor Sie dieses Plugin verwenden. Wenn Sie die möglichen Konsequenzen einer Kontosperrung nicht akzeptieren können, empfehlen wir die direkte Nutzung von [Antigravity IDE](https://idx.google.com/).

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-23

Der Inhalt dieses Kapitels basiert auf dem Risikowarnungsabschnitt der Projekt-README-Dokumentation (README.md:23-40) und beinhaltet keine spezifische Code-Implementierung.

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| ToS-Warnungshinweis | [`README.md`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/README.md#L23-L40) | 23-40 |

</details>

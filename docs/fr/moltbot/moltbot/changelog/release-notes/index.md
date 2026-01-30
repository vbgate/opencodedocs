---
title: "Journal des Versions : Nouvelles Fonctionnalités, Améliorations et Changements Majeurs | Tutoriel Clawdbot"
sidebarTitle: "Nouveautés des Versions"
subtitle: "Journal des Versions : Nouvelles Fonctionnalités, Améliorations et Changements Majeurs"
description: "Découvrez l'historique des versions de Clawdbot, les nouvelles fonctionnalités, améliorations, corrections et changements majeurs. Ce tutoriel vous aide à suivre l'évolution du produit et à planifier vos mises à jour."
tags:
  - "Journal des versions"
  - "Historique"
  - "Changelog"
prerequisite: []
order: 380
---

# Journal des Versions : Nouvelles Fonctionnalités, Améliorations et Changements Majeurs

Clawdbot évolue constamment, chaque version apportant de nouvelles fonctionnalités, des améliorations de performance et des renforcements de sécurité. Ce journal vous permet de suivre rapidement l'évolution des versions, de décider quand effectuer une mise à jour et de connaître les points d'attention lors de la migration.

## Ce que vous apprendrez

- Découvrir les nouvelles fonctionnalités et points forts des dernières versions
- Identifier les changements majeurs pour éviter les interruptions lors des mises à jour
- Consulter la liste des corrections de bugs pour vérifier si votre problème a été résolu
- Suivre la feuille de route des fonctionnalités pour planifier l'adoption des nouveautés

::: tip Convention de numérotation des versions
Format du numéro de version : `AAAA.M.J` (Année.Mois.Jour)

- **Version majeure** : Un changement d'année ou de mois indique généralement une mise à jour importante
- **Version corrective** : `-1`, `-2`, `-3` indiquent des versions de correction, contenant uniquement des corrections de bugs
:::

---

## 2026.1.25
**Statut** : Non publiée

### Points forts (Highlights)

Aucun pour le moment

### Améliorations (Changes)

- **Agents** : Respect de `tools.exec.safeBins` dans la vérification de la liste blanche exec (#2281)
- **Docs** : Renforcement des étapes de déploiement privé Fly (#2289) - Merci @dguido
- **Gateway** : Avertissement pour les tokens hook passés via paramètres de requête ; documentation de l'authentification par header recommandée (#2200) - Merci @YuriNachos
- **Gateway** : Ajout d'un flag dangereux de contournement d'authentification Control UI + avertissement d'audit (#2248)
- **Doctor** : Avertissement lors de l'exposition d'un gateway sans authentification (#2016) - Merci @Alex-Alaniz
- **Discord** : Ajout d'intents gateway privilégiés configurables (presences/members) (#2266) - Merci @kentaro
- **Docs** : Ajout de Vercel AI Gateway dans la barre latérale des providers (#1901) - Merci @jerilynzheng
- **Agents** : Extension de la description de l'outil cron avec documentation complète du schéma (#1988) - Merci @tomascupr
- **Skills** : Ajout des métadonnées de dépendances manquantes pour GitHub, Notion, Slack, Discord (#1995) - Merci @jackheuberger
- **Docs** : Ajout du guide de déploiement Render (#1975) - Merci @anurag
- **Docs** : Ajout du guide proxy Claude Max API (#1875) - Merci @atalovesyou
- **Docs** : Ajout du guide de déploiement DigitalOcean (#1870) - Merci @0xJonHoldsCrypto
- **Docs** : Ajout du guide d'installation Raspberry Pi (#1871) - Merci @0xJonHoldsCrypto
- **Docs** : Ajout du guide de déploiement GCP Compute Engine (#1848) - Merci @hougangdev
- **Docs** : Ajout du guide du canal LINE - Merci @thewilloftheshadow
- **Docs** : Attribution aux deux contributeurs pour la refonte de Control UI (#1852) - Merci @EnzeD
- **Onboarding** : Ajout de la clé API Venice au flux non interactif (#1893) - Merci @jonisjongithub
- **Onboarding** : Renforcement du texte d'avertissement de sécurité beta + attentes de contrôle d'accès
- **Tlon** : Formatage de l'ID de réponse de thread en `@ud` (#1837) - Merci @wca4a
- **Gateway** : Priorité aux métadonnées de session les plus récentes lors de la fusion du stockage (#1823) - Merci @emanuelst
- **Web UI** : Maintien de la visibilité des réponses d'annonce des sous-agents dans WebChat (#1977) - Merci @andrescardonas7
- **CI** : Augmentation de la taille du heap Node pour les vérifications macOS (#1890) - Merci @realZachi
- **macOS** : Évitement des crashs lors du rendu des blocs de code via mise à jour de Textual vers 0.3.1 (#2033) - Merci @garricn
- **Browser** : Repli sur la correspondance URL pour la résolution des cibles de relais d'extension (#1999) - Merci @jonit-dev
- **Update** : Ignorer dist/control-ui dans la vérification dirty et restauration après build UI (#1976) - Merci @Glucksberg
- **Telegram** : Autorisation du paramètre caption lors de l'envoi de médias (#1888) - Merci @mguellsegarra
- **Telegram** : Support du channelData sendPayload des plugins (médias/boutons) et validation des commandes plugins (#1917) - Merci @JoshuaLelon
- **Telegram** : Évitement des réponses par blocs lorsque le streaming est désactivé (#1885) - Merci @ivancasco
- **Auth** : Affichage de l'URL Google auth copiable après le prompt ASCII (#1787) - Merci @robbyczgw-cla
- **Routing** : Précompilation des expressions régulières des clés de session (#1697) - Merci @Ray0907
- **TUI** : Évitement du débordement de largeur lors du rendu des listes de sélection (#1686) - Merci @mossein
- **Telegram** : Conservation de l'ID de topic dans les notifications sentinelle de redémarrage (#1807) - Merci @hsrvc
- **Config** : Application de `config.env` avant la substitution `${VAR}` (#1813) - Merci @spanishflu-est1918
- **Slack** : Effacement de la réaction ack après les réponses en streaming (#2044) - Merci @fancyboi999
- **macOS** : Conservation du nom d'utilisateur SSH personnalisé dans les cibles distantes (#2046) - Merci @algal

### Corrections (Fixes)

- **Telegram** : Encapsulation italique du reasoning par ligne pour éviter les underscores bruts (#2181) - Merci @YuriNachos
- **Voice Call** : Application de la validation de signature webhook Twilio pour les URLs ngrok ; désactivation par défaut du contournement du niveau gratuit ngrok
- **Security** : Renforcement de l'authentification Tailscale Serve via vérification de l'identité tailscaled locale avant de faire confiance aux headers
- **Build** : Alignement des dépendances peer memory-core avec le fichier lock
- **Security** : Ajout du mode découverte mDNS, minimal par défaut pour réduire les fuites d'information (#1882) - Merci @orlyjamie
- **Security** : Renforcement de la récupération d'URL via DNS pinning pour réduire les risques de rebinding - Merci Chris Zheng
- **Web UI** : Amélioration de l'aperçu de collage d'image WebChat et autorisation d'envoi d'image seule (#1925) - Merci @smartprogrammer93
- **Security** : Encapsulation par défaut du contenu des hooks externes avec option de désactivation par hook (#1827) - Merci @mertcicekci0
- **Gateway** : L'authentification par défaut échoue maintenant en mode fermé (token/mot de passe requis ; l'identité Tailscale Serve reste autorisée)
- **Onboarding** : Suppression du choix d'authentification gateway "off" non supporté du flux onboarding/configure et des flags CLI

---

## 2026.1.24-3

### Corrections (Fixes)

- **Slack** : Correction de l'échec de téléchargement d'images dû à l'absence du header Authorization lors des redirections cross-domain (#1936) - Merci @sanderhelgesen
- **Gateway** : Renforcement de la détection des clients locaux et du traitement des connexions proxy non authentifiées via reverse proxy (#1795) - Merci @orlyjamie
- **Security audit** : Marquage du Control UI loopback sans authentification comme critique (#1795) - Merci @orlyjamie
- **CLI** : Restauration de la session claude-cli et streaming des réponses CLI vers le client TUI (#1921) - Merci @rmorse

---

## 2026.1.24-2

### Corrections (Fixes)

- **Packaging** : Inclusion de la sortie dist/link-understanding dans le tarball npm (correction de l'import apply.js manquant à l'installation)

---

## 2026.1.24-1

### Corrections (Fixes)

- **Packaging** : Inclusion de la sortie dist/shared dans le tarball npm (correction de l'import reasoning-tags manquant à l'installation)

---

## 2026.1.24

### Points forts (Highlights)

- **Providers** : Découverte Ollama + documentation ; mise à niveau du guide Venice + liens croisés (#1606) - Merci @abhaymundhara
- **Channels** : Plugin LINE (Messaging API) avec support des réponses riches + réponses rapides (#1630) - Merci @plum-dawg
- **TTS** : Repli Edge (sans clé) + mode auto `/tts` (#1668, #1667) - Merci @steipete, @sebslight
- **Exec approvals** : Approbation dans le chat via `/approve` sur tous les canaux (y compris plugins) (#1621) - Merci @czekaj
- **Telegram** : Topics DM comme sessions indépendantes + bascule d'aperçu des liens sortants (#1597, #1700) - Merci @rohannagpal, @zerone0x

### Améliorations (Changes)

- **Channels** : Ajout du plugin LINE (Messaging API) avec support des réponses riches, réponses rapides et registre HTTP des plugins (#1630) - Merci @plum-dawg
- **TTS** : Ajout du provider TTS Edge en repli, Edge par défaut sans clé, retry MP3 en cas d'échec de format (#1668) - Merci @steipete
- **TTS** : Ajout de l'énumération mode auto (off/always/inbound/tagged) avec override `/tts` par session (#1667) - Merci @sebslight
- **Telegram** : Traitement des topics DM comme sessions indépendantes avec suffixe de thread pour stabiliser la limite d'historique DM (#1597) - Merci @rohannagpal
- **Telegram** : Ajout de `channels.telegram.linkPreview` pour basculer l'aperçu des liens sortants (#1700) - Merci @zerone0x
- **Web search** : Ajout du paramètre de filtre de fraîcheur Brave pour les résultats limités dans le temps (#1688) - Merci @JonUleis
- **UI** : Refonte du système de design du tableau de bord Control UI (couleurs, icônes, typographie) (#1745, #1786) - Merci @EnzeD, @mousberg
- **Exec approvals** : Transfert des prompts d'approbation vers le chat, support de tous les canaux (y compris plugins) via `/approve` (#1621) - Merci @czekaj
- **Gateway** : Exposition de `config.patch` dans les outils gateway pour les mises à jour partielles sécurisées + sentinelle de redémarrage (#1653) - Merci @Glucksberg
- **Diagnostics** : Ajout de flags de diagnostic pour les logs de débogage ciblés (config + override env)
- **Docs** : Extension de la FAQ (migration, planification, concurrence, recommandations de modèles, authentification abonnement OpenAI, taille Pi, installation hackable, contournement SSL docs)
- **Docs** : Ajout d'un guide détaillé de dépannage de l'installateur
- **Docs** : Ajout du guide VM macOS avec options locales/hébergées + guidance VPS/noeud (#1693) - Merci @f-trycua
- **Docs** : Ajout de la configuration du rôle d'instance EC2 Bedrock + étapes IAM (#1625) - Merci @sergical
- **Docs** : Mise à jour des instructions du guide Fly.io
- **Dev** : Ajout des hooks pre-commit prek + configuration de mise à jour hebdomadaire des dépendances (#1720) - Merci @dguido

### Corrections (Fixes)

- **Web UI** : Correction du débordement de mise en page config/debug, défilement et taille des blocs de code (#1715) - Merci @saipreetham589
- **Web UI** : Affichage du bouton stop pendant l'exécution active, basculement vers nouvelle session au repos (#1664) - Merci @ndbroadbent
- **Web UI** : Effacement de la bannière de déconnexion obsolète lors de la reconnexion ; autorisation de sauvegarde des formulaires sans chemin de schéma supporté mais blocage des schémas manquants (#1707) - Merci @Glucksberg
- **Web UI** : Masquage du prompt interne `message_id` dans les bulles de chat
- **Gateway** : Autorisation de l'authentification Control UI par token uniquement à ignorer l'appairage d'appareil même si l'identité d'appareil existe (`gateway.controlUi.allowInsecureAuth`) (#1679) - Merci @steipete
- **Matrix** : Protection des pièces jointes média E2EE déchiffrées avec vérification de taille préalable (#1744) - Merci @araa47
- **BlueBubbles** : Routage des cibles de numéro de téléphone vers DM, évitement de fuite d'ID de routage, création automatique des DM manquants (nécessite Private API) (#1751) - Merci @tyler6204
- **BlueBubbles** : Conservation du GUID part-index dans les tags de réponse lorsque l'ID court est manquant
- **iMessage** : Normalisation insensible à la casse des préfixes chat_id/chat_guid/chat_identifier et maintien de la stabilité des handles avec préfixe de service (#1708) - Merci @aaronn
- **Signal** : Correction de l'envoi de réaction (cible group/UUID + flag author CLI) (#1651) - Merci @vilkasdev
- **Signal** : Ajout d'un timeout de démarrage signal-cli configurable + documentation du mode daemon externe (#1677)
- **Telegram** : Configuration de fetch duplex="half" pour les uploads sur Node 22 pour éviter l'échec sendPhoto (#1684) - Merci @commdata2338
- **Telegram** : Utilisation de fetch encapsulé sur Node pour le long polling afin de normaliser la gestion AbortSignal (#1639)
- **Telegram** : Respect du proxy par compte pour les appels API sortants (#1774) - Merci @radek-paclt
- **Telegram** : Repli vers texte lorsque les notes vocales sont bloquées par les paramètres de confidentialité (#1725) - Merci @foeken
- **Voice Call** : Retour de TwiML streaming lors du webhook Twilio initial pour les appels de session sortants (#1634)
- **Voice Call** : Sérialisation de la lecture TTS Twilio et annulation lors d'interruption pour éviter les chevauchements (#1713) - Merci @dguido
- **Google Chat** : Renforcement de la correspondance de liste blanche email, nettoyage des entrées, limites média et onboarding/docs/tests (#1635) - Merci @iHildy
- **Google Chat** : Normalisation des cibles d'espace sans double préfixe `spaces/`
- **Agents** : Compression automatique lors d'erreur de prompt de dépassement de contexte (#1627) - Merci @rodrigouroz
- **Agents** : Utilisation du profil d'authentification actif pour la récupération de compression automatique
- **Media understanding** : Saut de la compréhension d'image lorsque le modèle principal supporte déjà la vision (#1747) - Merci @tyler6204
- **Models** : Valeurs par défaut pour les champs manquants des providers personnalisés afin d'accepter une configuration minimale
- **Messaging** : Maintien de la sécurité du découpage des blocs de saut de ligne pour les blocs markdown clôturés cross-canal
- **Messaging** : Traitement des blocs de saut de ligne comme sensibles aux paragraphes (séparation par ligne vide) pour garder les listes et titres ensemble (#1726) - Merci @tyler6204
- **TUI** : Rechargement de l'historique après reconnexion gateway pour restaurer l'état de session (#1663)
- **Heartbeat** : Normalisation des identifiants de cible pour maintenir la cohérence du routage
- **Exec** : Maintien de l'approbation pour les demandes ask élevées sauf en mode complet (#1616) - Merci @ivancasco
- **Exec** : Traitement des labels de plateforme Windows comme Windows pour la sélection du shell de noeud (#1760) - Merci @ymat19
- **Gateway** : Inclusion des variables env de configuration inline dans l'environnement d'installation de service (#1735) - Merci @Seredeep
- **Gateway** : Saut de la sonde DNS Tailscale lorsque tailscale.mode est off (#1671)
- **Gateway** : Réduction du bruit de log pour les appels différés + sondes de noeuds distants ; anti-rebond du rafraîchissement des skills (#1607) - Merci @petter-b
- **Gateway** : Clarification du message d'erreur d'authentification Control UI/WebChat en cas de token manquant (#1690)
- **Gateway** : Écoute sur le loopback IPv6 lors de la liaison à 127.0.0.1 pour que les webhooks localhost fonctionnent
- **Gateway** : Stockage du fichier lock dans le répertoire temporaire pour éviter les locks obsolètes sur les volumes persistants (#1676)
- **macOS** : Transfert direct des URLs `ws://` par défaut vers le port 18789 ; documentation de `gateway.remote.transport` (#1603) - Merci @ngutman
- **Tests** : Limitation des workers Vitest sur macOS CI pour réduire les timeouts (#1597) - Merci @rohannagpal
- **Tests** : Évitement de la dépendance fake-timer dans la simulation de flux du runner embarqué pour réduire l'instabilité CI (#1597) - Merci @rohannagpal
- **Tests** : Augmentation du timeout des tests de tri du runner embarqué pour réduire l'instabilité CI (#1597) - Merci @rohannagpal

---

## 2026.1.23-1

### Corrections (Fixes)

- **Packaging** : Inclusion de la sortie dist/tts dans le tarball npm (correction de dist/tts/tts.js manquant)

---

## 2026.1.23

### Points forts (Highlights)

- **TTS** : Migration du TTS Telegram vers le core + activation par défaut des tags TTS pilotés par le modèle pour les réponses audio expressives (#1559) - Merci @Glucksberg
- **Gateway** : Ajout du endpoint HTTP `/tools/invoke` pour l'invocation directe d'outils (authentification + politique d'outils appliquées) (#1575) - Merci @vignesh07
- **Heartbeat** : Contrôle de visibilité par canal (OK/alertes/indicateur) (#1452) - Merci @dlauer
- **Deploy** : Ajout du support de déploiement Fly.io + guide (#1570)
- **Channels** : Ajout du plugin canal Tlon/Urbit (DM, mentions de groupe, réponses en thread) (#1544) - Merci @wca4a

### Améliorations (Changes)

- **Channels** : Autorisation des politiques allow/deny par groupe d'outils dans les canaux intégrés + plugins (#1546) - Merci @adam91holt
- **Agents** : Ajout des valeurs par défaut de découverte automatique Bedrock + override de configuration (#1553) - Merci @fal3
- **CLI** : Ajout de `clawdbot system` pour les événements système + contrôle heartbeat ; suppression du `wake` autonome
- **CLI** : Ajout de la sonde d'authentification en temps réel à `clawdbot models status` pour la vérification par profil
- **CLI** : Redémarrage du gateway par défaut après `clawdbot update` ; ajout de `--no-restart` pour ignorer
- **Browser** : Ajout du routage automatique du proxy hôte de noeud pour les gateways distants (configurable par gateway/noeud)
- **Plugins** : Ajout de l'outil JSON-only optionnel `llm-task` pour les workflows (#1498) - Merci @vignesh07
- **Markdown** : Ajout de la conversion de tableau par canal (Signal/WhatsApp utilisent les puces, les autres utilisent les blocs de code) (#1495) - Merci @odysseus0
- **Agents** : Maintien du prompt système uniquement pour le fuseau horaire et déplacement de l'heure actuelle vers `session_status` pour de meilleurs hits de cache
- **Agents** : Suppression des alias d'outils bash redondants de l'enregistrement/affichage des outils (#1571) - Merci @Takhoffman
- **Docs** : Ajout du guide de décision cron vs heartbeat (avec notes de workflow Lobster) (#1533) - Merci @JustYannicc
- **Docs** : Clarification que le fichier HEARTBEAT.md vide ignore le heartbeat, le fichier manquant l'exécute toujours (#1535) - Merci @JustYannicc

### Corrections (Fixes)

- **Sessions** : Acceptation des sessionIds non-UUID pour history/send/status tout en préservant la portée agent
- **Heartbeat** : Acceptation des ids de canal plugin pour la validation des cibles heartbeat + prompt UI
- **Messaging/Sessions** : Miroir des envois sortants vers la clé de session cible (thread + dmScope), création de l'entrée de session lors de l'envoi, et normalisation de la casse des clés de session (#1520)
- **Sessions** : Rejet du stockage de session basé sur tableau pour éviter l'effacement silencieux (#1469)
- **Gateway** : Comparaison du temps de démarrage du processus Linux pour éviter la boucle de lock de recyclage PID ; maintien du lock sauf s'il est obsolète (#1572) - Merci @steipete
- **Gateway** : Acceptation des champs optionnels null dans les requêtes d'approbation exec (#1511) - Merci @pvoo
- **Exec approvals** : Persistance de l'id d'entrée allowlist pour maintenir la stabilité des lignes allowlist macOS (#1521) - Merci @ngutman
- **Exec** : Respect des valeurs par défaut tools.exec ask/security pour les approbations élevées (évite les prompts inutiles)
- **Daemon** : Utilisation du séparateur PATH de la plateforme lors de la construction du chemin de service minimal
- **Linux** : Inclusion de la racine bin utilisateur configurée par env dans le PATH systemd et alignement de l'audit PATH (#1512) - Merci @robbyczgw-cla
- **Tailscale** : Retry avec sudo uniquement sur erreur de permission pour serve/funnel et conservation des détails d'échec originaux (#1551) - Merci @sweepies
- **Docker** : Mise à jour de la commande gateway dans docker-compose et le guide Hetzner (#1514)
- **Agents** : Affichage du repli d'erreur d'outil lorsque le dernier tour assistant n'a appelé que des outils (évite l'arrêt silencieux)
- **Agents** : Ignorer les placeholders de template IDENTITY.md lors de l'analyse de l'identité (#1556)
- **Agents** : Suppression des blocs de reasoning OpenAI Responses orphelins lors du changement de modèle (#1562) - Merci @roshanasingh4
- **Agents** : Ajout d'un indice de log CLI dans le message "agent a échoué avant de répondre" (#1550) - Merci @sweepies
- **Agents** : Avertissement et ignorer les allowlists d'outils référençant uniquement des outils de plugins inconnus ou non chargés (#1566)
- **Agents** : Traitement des allowlists d'outils uniquement plugins comme opt-in ; maintien des outils core activés (#1467)
- **Agents** : Respect de l'override enqueue pour les exécutions embarquées afin d'éviter le deadlock de queue dans les tests
- **Slack** : Respect de la groupPolicy ouverte pour les canaux non listés dans le gate message + slash (#1563) - Merci @itsjaydesu
- **Discord** : Limitation du contournement de mention auto-thread aux threads appartenant au bot ; maintien du gate de mention de réaction ack (#1511) - Merci @pvoo
- **Discord** : Retry de la résolution allowlist et du déploiement de commandes limités en débit pour éviter le crash gateway
- **Mentions** : Ignorer les correspondances mentionPattern dans le chat de groupe lorsqu'une autre mention explicite existe (Slack/Discord/Telegram/WhatsApp)
- **Telegram** : Rendu markdown dans les légendes média (#1478)
- **MS Teams** : Suppression du suffixe `.default` des scopes Graph et des scopes de sonde Bot Framework (#1507, #1574) - Merci @Evizero
- **Browser** : Maintien du contrôle de l'onglet de relais d'extension lorsque l'extension réutilise l'id de session après changement d'onglet (#1160)
- **Voice wake** : Sauvegarde automatique du mot de réveil sur blur/submit cross iOS/Android et alignement des limites avec macOS
- **UI** : Maintien de la visibilité de la barre latérale Control UI lors du défilement des pages longues (#1515) - Merci @pookNast
- **UI** : Cache du rendu markdown Control UI + mémoïsation de l'extraction de texte de chat pour réduire le jitter d'entrée Safari
- **TUI** : Transfert des commandes slash inconnues, inclusion des commandes Gateway dans l'autocomplétion, et rendu des réponses slash comme sortie système
- **CLI** : Polissage de la sortie de sonde d'authentification (sortie tableau, erreurs inline, réduction du bruit et correction des sauts de ligne dans `clawdbot models status`)
- **Media** : Analyse des tags `MEDIA:` uniquement lorsqu'ils commencent une ligne pour éviter de supprimer les mentions en prose (#1206)
- **Media** : Préservation de l'alpha PNG si possible ; repli vers JPEG si toujours au-dessus de la limite de taille (#1491) - Merci @robbyczgw-cla
- **Skills** : Restriction de l'installation bird Homebrew à macOS (#1569) - Merci @bradleypriest

---

## Recommandations de mise à jour

### Vérifications avant mise à jour

Avant de mettre à jour vers une nouvelle version, nous recommandons :

1. **Lire les changements majeurs** : Vérifiez si des changements majeurs affecteront votre configuration
2. **Sauvegarder la configuration** : Sauvegardez `~/.clawdbot/clawdbot.json`
3. **Exécuter le diagnostic** : `clawdbot doctor` pour s'assurer que l'état actuel du système est sain
4. **Vérifier les dépendances** : Assurez-vous que la version de Node.js répond aux exigences (≥22)

### Vérifications après mise à jour

Après la mise à jour, effectuez les vérifications suivantes :

```bash
# 1. Vérifier la version
clawdbot --version

# 2. Vérifier le statut
clawdbot status

# 3. Vérifier les connexions des canaux
clawdbot channels status

# 4. Tester l'envoi de message
clawdbot message "Hello" --target=<votre-canal>
```

### Consulter le journal complet des versions

Pour voir l'historique détaillé des versions et les liens vers les issues, visitez :

- **GitHub Releases** : https://github.com/moltbot/moltbot/releases
- **Documentation officielle** : https://docs.clawd.bot

---

## Versions antérieures

Pour consulter les mises à jour de versions plus anciennes, visitez [GitHub Releases](https://github.com/moltbot/moltbot/releases) ou le fichier [CHANGELOG.md](https://github.com/moltbot/moltbot/blob/main/CHANGELOG.md) à la racine du projet.

::: tip Contribuer
Si vous avez trouvé un bug ou avez une suggestion de fonctionnalité, n'hésitez pas à soumettre une issue sur [GitHub Issues](https://github.com/moltbot/moltbot/issues).
:::

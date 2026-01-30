---
title: "Logs de débogage : Diagnostic et surveillance de l'état d'exécution | opencode-antigravity-auth"
sidebarTitle: "Les logs pour diagnostiquer"
subtitle: "Logs de débogage : diagnostic et surveillance de l'état d'exécution"
description: "Apprenez à activer les logs de débogage pour diagnostiquer les problèmes du plugin Antigravity Auth. Couvre les niveaux de logs, l'interprétation du contenu, la configuration des variables d'environnement et la gestion des fichiers de logs."
tags:
  - "advanced"
  - "debug"
  - "logging"
  - "troubleshooting"
prerequisite:
  - "start-quick-install"
  - "start-first-request"
order: 3
---

# Logs de débogage : diagnostic et surveillance de l'état d'exécution

## Ce que vous allez apprendre

- Activer les logs de débogage pour enregistrer les détails de toutes les requêtes et réponses
- Comprendre les différents niveaux de logs et leurs cas d'utilisation
- Interpréter le contenu des logs pour identifier rapidement la source des problèmes
- Utiliser les variables d'environnement pour activer temporairement le débogage sans modifier la configuration
- Gérer les fichiers de logs pour éviter une occupation excessive du disque

## Votre situation actuelle

Face à un problème, vous pourriez :

- Voir des messages d'erreur vagues sans connaître la cause exacte
- Ne pas savoir si la requête a bien atteint l'API Antigravity
- Soupçonner un problème de sélection de compte, de rate limiting ou de transformation de requête
- Ne pas pouvoir fournir d'informations de diagnostic utiles lorsque vous demandez de l'aide

## Quand utiliser cette technique

Les logs de débogage sont adaptés aux scénarios suivants :

| Scénario | Nécessaire ? | Raison |
| --- | --- | --- |
| Diagnostiquer les erreurs 429 | ✅ Oui | Voir quel compte et quel modèle sont limités |
| Diagnostiquer les échecs d'authentification | ✅ Oui | Vérifier le rafraîchissement des tokens et le flux OAuth |
| Diagnostiquer les problèmes de transformation | ✅ Oui | Comparer la requête originale et la requête transformée |
| Diagnostiquer la stratégie de sélection de compte | ✅ Oui | Voir comment le plugin sélectionne les comptes |
| Surveiller l'état d'exécution quotidien | ✅ Oui | Statistiques de fréquence des requêtes, taux de succès/échec |
| Exécution à long terme | ⚠️ Prudence | Les logs croissent continuellement, nécessitent une gestion |

::: warning Vérifications préalables
Avant de commencer ce tutoriel, assurez-vous d'avoir :
- ✅ Installé le plugin opencode-antigravity-auth
- ✅ Réussi l'authentification OAuth
- ✅ Pu envoyer des requêtes avec les modèles Antigravity

[Tutoriel d'installation rapide](../../start/quick-install/) | [Tutoriel première requête](../../start/first-request/)
:::

## Concepts fondamentaux

Fonctionnement du système de logs de débogage :

1. **Logs structurés** : Chaque entrée de log comporte un horodatage et des tags pour faciliter le filtrage et l'analyse
2. **Enregistrement par niveaux** :
   - Level 1 (basic) : Enregistre les métadonnées des requêtes/réponses, la sélection de compte, les événements de rate limiting
   - Level 2 (verbose) : Enregistre intégralement le body des requêtes/réponses (jusqu'à 50 000 caractères)
3. **Masquage de sécurité** : Masque automatiquement les informations sensibles (comme le header Authorization)
4. **Fichiers indépendants** : Crée un nouveau fichier de log à chaque démarrage pour éviter la confusion

**Aperçu du contenu des logs** :

| Type de log | Tag | Exemple de contenu |
| --- | --- | --- |
| Traçage des requêtes | `Antigravity Debug ANTIGRAVITY-1` | URL, headers, aperçu du body |
| Traçage des réponses | `Antigravity Debug ANTIGRAVITY-1` | Code de statut, durée, body de la réponse |
| Contexte du compte | `[Account]` | Compte sélectionné, index du compte, famille de modèles |
| Rate limiting | `[RateLimit]` | Détails de la limitation, temps de réinitialisation, délai de retry |
| Identification du modèle | `[ModelFamily]` | Analyse de l'URL, extraction du modèle, détermination de la famille |

## Suivez-moi

### Étape 1 : Activer les logs de débogage de base

**Pourquoi**
Une fois les logs de débogage de base activés, le plugin enregistre les métadonnées de toutes les requêtes, incluant l'URL, les headers, la sélection de compte, les événements de rate limiting, etc., vous aidant à diagnostiquer les problèmes sans exposer de données sensibles.

**Action**

Éditez le fichier de configuration du plugin :

::: code-group

```bash [macOS/Linux]
nano ~/.config/opencode/antigravity.json
```

```powershell [Windows]
notepad %APPDATA%\opencode\antigravity.json
```

:::

Ajoutez ou modifiez la configuration suivante :

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "debug": true
}
```

Enregistrez le fichier et redémarrez OpenCode.

**Vous devriez voir** :

1. Après le démarrage d'OpenCode, un nouveau fichier de log est généré dans le répertoire de configuration
2. Format du nom de fichier : `antigravity-debug-YYYY-MM-DDTHH-MM-SS-mmmZ.log`
3. Après l'envoi d'une requête, de nouvelles entrées apparaissent dans le fichier de log

::: tip Emplacement des fichiers de logs
- **Linux/macOS** : `~/.config/opencode/antigravity-logs/`
- **Windows** : `%APPDATA%\opencode\antigravity-logs\`
:::

### Étape 2 : Interpréter le contenu des logs

**Pourquoi**
Comprendre le format et le contenu des logs permet d'identifier rapidement les problèmes.

**Action**

Envoyez une requête de test, puis consultez le fichier de log :

```bash
<!-- macOS/Linux -->
tail -f ~/.config/opencode/antigravity-logs/antigravity-debug-*.log

<!-- Windows PowerShell -->
Get-Content "$env:APPDATA\opencode\antigravity-logs\antigravity-debug-*.log" -Wait
```

**Vous devriez voir** :

```log
[2026-01-23T10:30:15.123Z] [Account] Request: Account 1 (1/2) family=claude
[2026-01-23T10:30:15.124Z] [Antigravity Debug ANTIGRAVITY-1] POST https://cloudcode-pa.googleapis.com/...
[2026-01-23T10:30:15.125Z] [Antigravity Debug ANTIGRAVITY-1] Streaming: yes
[2026-01-23T10:30:15.126Z] [Antigravity Debug ANTIGRAVITY-1] Headers: {"user-agent":"opencode-antigravity-auth/1.3.0","authorization":"[redacted]",...}
[2026-01-23T10:30:15.127Z] [Antigravity Debug ANTIGRAVITY-1] Body Preview: {"model":"google/antigravity-claude-sonnet-4-5",...}
[2026-01-23T10:30:18.456Z] [Antigravity Debug ANTIGRAVITY-1] Response 200 OK (3330ms)
[2026-01-23T10:30:18.457Z] [Antigravity Debug ANTIGRAVITY-1] Response Headers: {"content-type":"application/json",...}
```

**Interprétation des logs** :

1. **Horodatage** : `[2026-01-23T10:30:15.123Z]` - Format ISO 8601, précision à la milliseconde
2. **Sélection du compte** : `[Account]` - Le plugin a sélectionné le compte 1, sur 2 comptes au total, famille de modèles claude
3. **Début de la requête** : `Antigravity Debug ANTIGRAVITY-1` - ID de requête 1
4. **Méthode de requête** : `POST https://...` - Méthode HTTP et URL cible
5. **Mode streaming** : `Streaming: yes/no` - Utilisation ou non de la réponse SSE en streaming
6. **Headers de requête** : `Headers: {...}` - Authorization automatiquement masqué (affiche `[redacted]`)
7. **Body de requête** : `Body Preview: {...}` - Contenu de la requête (maximum 12 000 caractères, tronqué au-delà)
8. **Statut de réponse** : `Response 200 OK (3330ms)` - Code de statut HTTP et durée
9. **Headers de réponse** : `Response Headers: {...}` - Headers de la réponse

### Étape 3 : Activer les logs détaillés (Verbose)

**Pourquoi**
Les logs détaillés enregistrent intégralement le body des requêtes/réponses (jusqu'à 50 000 caractères), adaptés au diagnostic des problèmes profonds de transformation de requêtes ou d'analyse de réponses.

**Action**

Modifiez la configuration au niveau verbose :

```json
{
  "debug": true,
  "OPENCODE_ANTIGRAVITY_DEBUG": "2"
}
```

Ou utilisez une variable d'environnement (recommandé, sans modifier le fichier de configuration) :

::: code-group

```bash [macOS/Linux]
export OPENCODE_ANTIGRAVITY_DEBUG=2
opencode
```

```powershell [Windows]
$env:OPENCODE_ANTIGRAVITY_DEBUG="2"
opencode
```

:::

**Vous devriez voir** :

1. Le fichier de log affiche le body complet des requêtes/réponses (plus d'aperçu tronqué)
2. Pour les réponses volumineuses, les 50 000 premiers caractères sont affichés avec indication du nombre de caractères tronqués

```log
[2026-01-23T10:30:15.127Z] [Antigravity Debug ANTIGRAVITY-1] Response Body (200): {"id":"msg_...","type":"message","role":"assistant",...}
```

::: warning Avertissement espace disque
Les logs détaillés enregistrent l'intégralité du contenu des requêtes/réponses, ce qui peut entraîner une croissance rapide des fichiers de logs. Une fois le débogage terminé, désactivez impérativement le mode verbose.
:::

### Étape 4 : Diagnostiquer les problèmes de rate limiting

**Pourquoi**
Le rate limiting (erreur 429) est l'un des problèmes les plus courants. Les logs vous indiquent précisément quel compte et quel modèle sont limités, ainsi que le temps d'attente nécessaire.

**Action**

Envoyez plusieurs requêtes concurrentes pour déclencher le rate limiting :

```bash
<!-- macOS/Linux -->
for i in {1..10}; do
  opencode run "Test $i" --model=google/antigravity-claude-sonnet-4-5 &
done
wait
```

Consultez les événements de rate limiting dans les logs :

```bash
grep "RateLimit" ~/.config/opencode/antigravity-logs/antigravity-debug-*.log
```

**Vous devriez voir** :

```log
[2026-01-23T10:30:20.123Z] [RateLimit] 429 on Account 1 family=claude retryAfterMs=60000
[2026-01-23T10:30:20.124Z] [RateLimit] message: Resource has been exhausted
[2026-01-23T10:30:20.125Z] [RateLimit] quotaResetTime: 2026-01-23T10:31:00.000Z
[2026-01-23T10:30:20.126Z] [Account] Request: Account 2 (2/2) family=claude
[2026-01-23T10:30:20.127Z] [RateLimit] snapshot family=claude Account 1=wait 60s | Account 2=ready
```

**Interprétation des logs** :

1. **Détails de la limitation** : `429 on Account 1 family=claude retryAfterMs=60000`
   - Le compte 1 (famille de modèles claude) a rencontré une erreur 429
   - Attendre 60 000 millisecondes (60 secondes) avant de réessayer
2. **Message d'erreur** : `message: Resource has been exhausted` - Quota épuisé
3. **Temps de réinitialisation** : `quotaResetTime: 2026-01-23T10:31:00.000Z` - Heure exacte de réinitialisation du quota
4. **Changement de compte** : Le plugin bascule automatiquement vers le compte 2
5. **Snapshot global** : `snapshot` - Affiche l'état de limitation de tous les comptes

### Étape 5 : Personnaliser le répertoire des logs

**Pourquoi**
Par défaut, les fichiers de logs sont stockés dans `~/.config/opencode/antigravity-logs/`. Si vous souhaitez les stocker ailleurs (par exemple dans le répertoire du projet), vous pouvez personnaliser le répertoire des logs.

**Action**

Ajoutez l'option `log_dir` dans le fichier de configuration :

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "debug": true,
  "log_dir": "/path/to/your/custom/logs"
}
```

Ou utilisez une variable d'environnement :

```bash
export OPENCODE_ANTIGRAVITY_LOG_DIR="/path/to/your/custom/logs"
opencode
```

**Vous devriez voir** :

1. Les fichiers de logs sont écrits dans le répertoire spécifié
2. Si le répertoire n'existe pas, le plugin le crée automatiquement
3. Le format du nom de fichier reste inchangé

::: tip Recommandations de chemins
- Débogage en développement : Stocker à la racine du projet (`.logs/`)
- Environnement de production : Stocker dans le répertoire système des logs (`/var/log/` ou `~/Library/Logs/`)
- Débogage temporaire : Stocker dans `/tmp/` pour faciliter le nettoyage
:::

### Étape 6 : Nettoyer et gérer les fichiers de logs

**Pourquoi**
En exécution prolongée, les fichiers de logs croissent continuellement et occupent beaucoup d'espace disque. Un nettoyage régulier est nécessaire.

**Action**

Vérifier la taille du répertoire des logs :

```bash
<!-- macOS/Linux -->
du -sh ~/.config/opencode/antigravity-logs/

<!-- Windows PowerShell -->
Get-ChildItem "$env:APPDATA\opencode\antigravity-logs\" | Measure-Object -Property Length -Sum
```

Nettoyer les anciens logs :

```bash
<!-- macOS/Linux -->
find ~/.config/opencode/antigravity-logs/ -name "antigravity-debug-*.log" -mtime +7 -delete

<!-- Windows PowerShell -->
Get-ChildItem "$env:APPDATA\opencode\antigravity-logs\antigravity-debug-*.log" |
  Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } |
  Remove-Item
```

**Vous devriez voir** :

1. La taille du répertoire des logs diminue
2. Seuls les fichiers de logs des 7 derniers jours sont conservés

::: tip Nettoyage automatisé
Vous pouvez ajouter le script de nettoyage à cron (Linux/macOS) ou au Planificateur de tâches (Windows) pour une exécution régulière.
:::

## Point de contrôle ✅

Après avoir terminé les étapes ci-dessus, vous devriez être capable de :

- [ ] Activer les logs de débogage via le fichier de configuration
- [ ] Utiliser les variables d'environnement pour activer temporairement le débogage
- [ ] Interpréter le contenu des logs pour trouver les détails des requêtes/réponses
- [ ] Comprendre le rôle des différents niveaux de logs
- [ ] Personnaliser le répertoire des logs
- [ ] Gérer et nettoyer les fichiers de logs

## Pièges à éviter

### Les fichiers de logs croissent continuellement

**Symptôme** : L'espace disque est occupé par les fichiers de logs

**Cause** : Logs de débogage activés à long terme, surtout en mode verbose

**Solution** :

1. Une fois le débogage terminé, désactivez immédiatement avec `debug: false`
2. Configurez un script de nettoyage régulier (comme à l'étape 6)
3. Surveillez la taille du répertoire des logs, définissez des alertes de seuil

### Fichiers de logs introuvables

**Symptôme** : `debug: true` est activé, mais le répertoire des logs est vide

**Cause** :
- Chemin du fichier de configuration incorrect
- Problème de permissions (impossible d'écrire dans le répertoire des logs)
- Une variable d'environnement écrase la configuration

**Solution** :

1. Vérifiez que le chemin du fichier de configuration est correct :
   ```bash
   # Rechercher le fichier de configuration
   find ~/.config/opencode/ -name "antigravity.json" 2>/dev/null
   ```
2. Vérifiez si une variable d'environnement écrase la configuration :
   ```bash
   echo $OPENCODE_ANTIGRAVITY_DEBUG
   ```
3. Vérifiez les permissions du répertoire des logs :
   ```bash
   ls -la ~/.config/opencode/antigravity-logs/
   ```

### Contenu des logs incomplet

**Symptôme** : Le body des requêtes/réponses n'apparaît pas dans les logs

**Cause** : Utilisation par défaut du niveau basic (Level 1), qui n'enregistre qu'un aperçu du body (maximum 12 000 caractères)

**Solution** :

1. Activez le niveau verbose (Level 2) :
   ```json
   {
     "OPENCODE_ANTIGRAVITY_DEBUG": "2"
   }
   ```
2. Ou utilisez une variable d'environnement :
   ```bash
   export OPENCODE_ANTIGRAVITY_DEBUG=2
   ```

### Fuite d'informations sensibles

**Symptôme** : Inquiétude concernant la présence de données sensibles dans les logs (comme le token Authorization)

**Cause** : Le plugin masque automatiquement le header `Authorization`, mais d'autres headers peuvent contenir des informations sensibles

**Solution** :

1. Le plugin masque déjà automatiquement le header `Authorization` (affiche `[redacted]`)
2. Lors du partage des logs, vérifiez s'il y a d'autres headers sensibles (comme `Cookie`, `Set-Cookie`)
3. Si vous trouvez des informations sensibles, supprimez-les manuellement avant de partager

### Impossible d'ouvrir le fichier de log

**Symptôme** : Le fichier de log est verrouillé par un autre processus, impossible de le consulter

**Cause** : OpenCode est en train d'écrire dans le fichier de log

**Solution** :

1. Utilisez la commande `tail -f` pour consulter les logs en temps réel (ne verrouille pas le fichier)
2. Si vous devez éditer, fermez d'abord OpenCode
3. Utilisez la commande `cat` pour consulter le contenu (ne verrouille pas le fichier)

## Résumé de cette leçon

- Les logs de débogage sont un outil puissant pour diagnostiquer les problèmes, enregistrant les détails des requêtes/réponses, la sélection de compte, les événements de rate limiting
- Il existe deux niveaux de logs : basic (Level 1) et verbose (Level 2)
- Les variables d'environnement permettent d'activer temporairement le débogage sans modifier le fichier de configuration
- Le plugin masque automatiquement les informations sensibles (comme le header Authorization)
- En exécution prolongée, un nettoyage régulier des fichiers de logs est nécessaire

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons la **[Gestion des rate limits](../rate-limit-handling/)**.
>
> Vous apprendrez :
> - Les mécanismes de détection des rate limits et les stratégies de retry
> - Le fonctionnement de l'algorithme de backoff exponentiel
> - Comment configurer le temps d'attente maximum et le nombre de retries
> - La gestion des rate limits en scénario multi-compte

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Module Debug | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts) | Complet |
| Initialisation du débogage | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L98-L118) | 98-118 |
| Traçage des requêtes | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L189-L212) | 189-212 |
| Enregistrement des réponses | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L217-L250) | 217-250 |
| Masquage des headers | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L255-L270) | 255-270 |
| Logs de rate limiting | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L354-L396) | 354-396 |
| Schéma de configuration | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts#L64-L72) | 64-72 |

**Constantes clés** :

| Nom de la constante | Valeur | Description |
| --- | --- | --- |
| `MAX_BODY_PREVIEW_CHARS` | 12000 | Longueur de l'aperçu du body au niveau Basic |
| `MAX_BODY_VERBOSE_CHARS` | 50000 | Longueur de l'aperçu du body au niveau Verbose |
| `DEBUG_MESSAGE_PREFIX` | `"[opencode-antigravity-auth debug]"` | Préfixe des logs de débogage |

**Fonctions clés** :

- `initializeDebug(config)` : Initialise l'état de débogage, lit la configuration et les variables d'environnement
- `parseDebugLevel(flag)` : Analyse la chaîne de niveau de débogage ("0"/"1"/"2"/"true"/"verbose")
- `getLogsDir(customLogDir?)` : Obtient le répertoire des logs, supporte les chemins personnalisés
- `createLogFilePath(customLogDir?)` : Génère le chemin du fichier de log avec horodatage
- `startAntigravityDebugRequest(meta)` : Démarre le traçage de la requête, enregistre les métadonnées
- `logAntigravityDebugResponse(context, response, meta)` : Enregistre les détails de la réponse
- `logAccountContext(label, info)` : Enregistre le contexte de sélection du compte
- `logRateLimitEvent(...)` : Enregistre les événements de rate limiting
- `maskHeaders(headers)` : Masque les headers sensibles (Authorization)

**Options de configuration** (depuis schema.ts) :

| Option | Type | Valeur par défaut | Description |
| --- | --- | --- | --- |
| `debug` | boolean | `false` | Activer les logs de débogage |
| `log_dir` | string? | undefined | Répertoire personnalisé des logs |

**Variables d'environnement** :

| Variable d'environnement | Valeur | Description |
| --- | --- | --- |
| `OPENCODE_ANTIGRAVITY_DEBUG` | "0"/"1"/"2"/"true"/"verbose" | Écrase la configuration debug, contrôle le niveau de logs |
| `OPENCODE_ANTIGRAVITY_LOG_DIR` | string | Écrase la configuration log_dir, spécifie le répertoire des logs |

</details>

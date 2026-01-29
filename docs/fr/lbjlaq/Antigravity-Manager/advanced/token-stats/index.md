---
title: "Statistiques Token : Surveillance des coûts et analyse des données | Antigravity Manager"
sidebarTitle: "Identifier rapidement ce qui coûte le plus"
subtitle: "Statistiques Token : Surveillance des coûts et analyse des données"
description: "Apprenez à utiliser la fonction de statistiques Token. Comprenez comment extraire les données token des réponses, analyser l'utilisation par modèle et par compte, identifier les modèles et comptes les plus coûteux, et résoudre les problèmes de statistiques manquantes."
tags:
  - "Statistiques Token"
  - "Coûts"
  - "Surveillance"
  - "SQLite"
  - "Statistiques d'utilisation"
prerequisite:
  - "start-proxy-and-first-client"
  - "advanced-model-router"
order: 7
---
# Statistiques Token : Perspectives de statistiques de coûts et interprétation des graphiques

Vous avez déjà connecté vos clients à Antigravity Tools, mais "qui consomme les coûts, où les coûts sont-ils élevés, et si un modèle a soudainement augmenté" est généralement difficile à juger par intuition. Ce cours ne fait qu'une seule chose : clarifier les critères de données dans la page Token Stats et vous enseigner à utiliser les graphiques pour localiser rapidement les problèmes de coûts.

## Ce que vous pourrez faire après ce cours

- Expliquer clairement d'où proviennent les données de Token Stats (quand elles sont enregistrées, dans quel cas elles manquent)
- Basculer entre les fenêtres d'observation par heure/jour/semaine pour éviter les erreurs de jugement dues à "ne regarder qu'un seul jour"
- Dans les deux vues "par modèle/par compte", utiliser les graphiques de tendance pour identifier les pics anormaux
- Utiliser la liste Top pour verrouiller le modèle/le compte le plus coûteux, puis revenir aux journaux de requêtes pour remonter à la cause racine

## Votre situation actuelle

- Vous avez l'impression que les appels deviennent plus coûteux, mais vous ne savez pas si le modèle a changé, le compte a changé, ou si le volume a soudainement augmenté un certain jour
- Vous avez vu `X-Mapped-Model`, mais vous n'êtes pas sûr de quel critère de modèle les statistiques sont basées
- Dans Token Stats, il y a parfois 0 ou "pas de données", vous ne savez pas si c'est qu'il n'y a pas de trafic ou que les statistiques ne sont pas enregistrées

## Quand utiliser cette méthode

- Vous voulez optimiser les coûts : quantifiez d'abord "ce qui coûte le plus"
- Vous êtes en train de dépanner une limitation soudaine/anomalie : utilisez les points de temps de pic pour comparer avec les journaux de requêtes
- Après avoir apporté des modifications à la configuration du routage de modèles ou de la gouvernance des quotas, vous voulez vérifier si les coûts ont diminué comme prévu

## Qu'est-ce que Token Stats ?

**Token Stats** est la page de statistiques d'utilisation locale d'Antigravity Tools : après avoir transféré la requête, le proxy tente d'extraire le nombre de tokens de `usage/usageMetadata` dans la réponse JSON ou les données en streaming, et écrit chaque requête par compte et modèle dans le SQLite local (`token_stats.db`), puis affiche le résumé par temps/modèle/compte dans l'interface utilisateur.

::: info Clarification d'un point facile à confondre
Le critère "modèle" de Token Stats provient du champ `model` de votre requête (ou de l'analyse de chemin `/v1beta/models/<model>` de Gemini), et n'est pas égal au `X-Mapped-Model` après le routage.
:::

## 🎒 Préparation avant de commencer

- Vous avez déjà réussi un appel de proxy (ne vous arrêtez pas seulement à `/healthz` pour vérifier la disponibilité)
- Votre réponse amont retournera des champs de consommation de token analysables (sinon les statistiques manqueront)

::: tip Recommandation de lecture complémentaire
Si vous utilisez le mappage de modèles pour router `model` vers un autre modèle physique, il est recommandé de lire d'abord **[Routage de modèles : mappage personnalisé, priorité des caractères génériques et stratégies prédéfinies](/fr/lbjlaq/Antigravity-Manager/advanced/model-router/)**, puis revenir pour mieux comprendre "les critères de statistiques".
:::

## Idée centrale

Le pipeline de données de Token Stats peut être divisé en trois segments :

1. Le middleware du proxy tente d'extraire la consommation de token de la réponse (compatible avec `usage`/`usageMetadata`, le streaming est également analysé)
2. Si à la fois `account_email + input_tokens + output_tokens` sont obtenus, écrire dans le SQLite local (`token_stats.db`)
3. L'interface utilisateur extrait les données agrégées via Tauri `invoke(get_token_stats_*)` et affiche par heure/jour/semaine

## Suivez-moi

### Étape 1 : Confirmez d'abord que vous "avez du trafic"

**Pourquoi**
Les statistiques Token Stats proviennent de requêtes réelles. Si vous démarrez seulement le proxy sans avoir jamais envoyé de requête de modèle, la page affichera "pas de données".

Procédure : Réutilisez la méthode d'appel que vous avez déjà vérifiée avec succès dans **[Démarrer le reverse proxy local et intégrer le premier client](/fr/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)** et envoyez 1-2 requêtes.

**Ce que vous devriez voir** : La page Token Stats passe de "chargement/pas de données" à afficher des graphiques ou des listes.

### Étape 2 : Choisissez la bonne fenêtre de temps (heure/jour/semaine)

**Pourquoi**
Avec les mêmes données, les "pics/tendances" vus dans différentes fenêtres sont complètement différents. Les trois fenêtres de l'interface utilisateur correspondent également à différentes plages de récupération de données :

- Heure : dernières 24 heures
- Jour : derniers 7 jours
- Semaine : dernières 4 semaines (la vue de tendance agrège sur les 30 derniers jours)

**Ce que vous devriez voir** : Après le basculement, la granularité de l'axe horizontal du graphique de tendance change (l'heure affiche jusqu'à "heure", le jour affiche jusqu'à "mois/jour", la semaine affiche jusqu'à "année-W numéros de semaine").

### Étape 3 : Regardez d'abord l'aperçu en haut, déterminez "l'échelle des coûts"

**Pourquoi**
Les cartes d'aperçu peuvent d'abord répondre à 3 questions : le volume total est-il important, le ratio entrée/sortie est-il anormal, et le nombre de comptes/modèles participants a-t-il soudainement augmenté.

Concentrez-vous sur ces éléments :

- Total des tokens (`total_tokens`)
- Tokens d'entrée/sortie (`total_input_tokens` / `total_output_tokens`)
- Nombre de comptes actifs (`unique_accounts`)
- Nombre de modèles utilisés (l'interface utilisateur utilise directement la longueur de "la liste de statistiques par modèle")

**Ce que vous devriez voir** : Si le "nombre de comptes actifs" augmente soudainement, cela signifie généralement que vous avez exécuté plus de comptes en peu de temps (par exemple, en basculant vers une stratégie de rotation).

### Étape 4 : Utilisez "les tendances d'utilisation par modèle/par compte" pour capturer les pics anormaux

**Pourquoi**
Les graphiques de tendance sont le meilleur moyen de capturer "soudainement plus coûteux". Vous n'avez pas besoin de connaître la cause d'abord, encerclez d'abord "quel jour/quel heure a augmenté".

Procédure :

1. Dans le coin supérieur droit du graphique de tendance, basculez "par modèle / par compte"
2. Survolez (Tooltip) pour voir les valeurs Top, concentrez-vous d'abord sur "celle qui a soudainement sauté en premier"

**Ce que vous devriez voir** :

- Par modèle : un modèle augmente soudainement dans une certaine période
- Par compte : un compte augmente soudainement dans une certaine période

### Étape 5 : Utilisez la liste Top pour verrouiller "la cible la plus coûteuse"

**Pourquoi**
Le graphique de tendance vous dit "quand c'est anormal", la liste Top vous dit "qui est le plus coûteux". En croisant ces deux, vous pouvez rapidement localiser la portée du dépannage.

Procédure :

- Dans la vue "par modèle", regardez `total_tokens / request_count / proportion` du tableau "statistiques détaillées par modèle"
- Dans la vue "par compte", regardez `total_tokens / request_count` du tableau "statistiques détaillées par compte"

**Ce que vous devriez voir** : Le modèle/compte le plus coûteux est classé en premier, et `request_count` peut vous aider à distinguer "une fois particulièrement coûteux" ou "nombre de fois particulièrement élevé".

### Étape 6 (optionnel) : Trouvez `token_stats.db`, faites une sauvegarde/vérification

**Pourquoi**
Lorsque vous soupçonnez "statistiques manquantes" ou souhaitez faire une analyse hors ligne, il est plus fiable de prendre directement le fichier SQLite.

Procédure : Entrez la zone Advanced de Settings, cliquez sur "Ouvrir le répertoire de données", vous trouverez `token_stats.db` dans le répertoire de données.

**Ce que vous devriez voir** : `token_stats.db` est présent dans la liste des fichiers (le nom de fichier est codé en dur par le backend).

## Points de contrôle ✅

- Vous pouvez expliquer clairement que les statistiques Token Stats sont "extraites de usage/usageMetadata dans la réponse puis écrites dans le SQLite local", et non la facturation cloud
- Dans les deux vues de tendance "par modèle/par compte", vous pouvez indiquer une période de pic spécifique
- Vous pouvez utiliser la liste Top pour donner une conclusion de dépannage exécutable : d'abord vérifier quel modèle ou compte

## Mises en garde sur les pièges courants

| Phénomène | Cause courante | Ce que vous pouvez faire |
|--- | --- | ---|
| Token Stats affiche "pas de données" | Vous n'avez vraiment pas généré de requêtes de modèle ; ou la réponse amont ne contient pas de champs token analysables | Réutilisez d'abord un client vérifié pour envoyer des requêtes ; puis vérifiez si la réponse contient `usage/usageMetadata` |
| Les statistiques par "modèle" semblent incorrectes | Le critère de statistique utilise le `model` de la requête, et non le `X-Mapped-Model` | Considérez le routage de modèles comme "modèle de requête -> modèle mappé" ; les statistiques regardent le "modèle de requête" |
| Dimension compte manquante | Écrit uniquement lorsque `X-Account-Email` est obtenu et la consommation de token est analysée | Confirmez que la requête a vraiment atteint le pool de comptes ; puis comparez avec les journaux de requêtes/les en-têtes de réponse |
| Les données statistiques sont trop grandes après avoir activé Proxy Monitor | Lorsque Proxy Monitor est activé, les tokens de chaque requête sont enregistrés deux fois | C'est un détail d'implémentation connu, cela n'affecte pas l'analyse de tendance relative ; si vous avez besoin de valeurs précises, vous pouvez temporairement désactiver le Monitor et retester |

## Résumé de ce cours

- La valeur centrale de Token Stats est de "quantifier les problèmes de coûts", d'abord localiser, puis optimiser
- Lors de l'écriture des statistiques, le compte et la consommation de token sont obligatoires ; si le modèle manque, il sera enregistré comme `"unknown"` (cela n'empêche pas l'écriture)
- Pour un contrôle des coûts plus précis, l'étape suivante consiste généralement à revenir au routage de modèles ou à la gouvernance des quotas

## Aperçu du prochain cours

> Dans le prochain cours, nous résolvons les "problèmes de stabilité invisibles" dans les sessions longues : **[Stabilité des sessions longues : compression de contexte, cache de signatures et compression des résultats d'outils](/fr/lbjlaq/Antigravity-Manager/advanced/context-compression/)**.

Vous apprendrez :

- Ce que fait la compression de contexte progressive à trois couches
- Pourquoi le "cache de signatures" peut réduire les erreurs de signature 400
- Ce qui est supprimé et ce qui est conservé dans la compression des résultats d'outils

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer et voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonction | Chemin du fichier | Numéros de ligne |
|--- | --- | ---|
|--- | --- | ---|
| UI Token Stats : basculement de fenêtre de temps/vue et récupération de données | [`src/pages/TokenStats.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/TokenStats.tsx#L49-L166) | 49-166 |
| UI Token Stats : indication de données vides ("pas de données") | [`src/pages/TokenStats.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/TokenStats.tsx#L458-L507) | 458-507 |
| Extraction de consommation de token : analyse du model depuis la requête, analyse de usage/usageMetadata depuis la réponse | [`src-tauri/src/proxy/middleware/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/monitor.rs#L32-L120) | 32-120 |
| Extraction de consommation de token : analyse du champ usage dans les réponses streaming et JSON | [`src-tauri/src/proxy/middleware/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/monitor.rs#L122-L336) | 122-336 |
| Point d'écriture Token Stats : écriture dans SQLite après obtention du compte+token | [`src-tauri/src/proxy/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/monitor.rs#L79-L136) | 79-136 |
| Nom de fichier de base de données et structure de table : `token_stats.db` / `token_usage` / `token_stats_hourly` | [`src-tauri/src/modules/token_stats.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/token_stats.rs#L58-L126) | 58-126 |
| Logique d'écriture : `record_usage(account_email, model, input, output)` | [`src-tauri/src/modules/token_stats.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/token_stats.rs#L128-L159) | 128-159 |
| Logique de requête : heure/jour/semaine, par compte/par modèle, tendance et aperçu | [`src-tauri/src/modules/token_stats.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/token_stats.rs#L161-L555) | 161-555 |
| Commande Tauri : `get_token_stats_*` exposé au frontend | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L791-L847) | 791-847 |
| Initialisation de la base de données Token Stats au démarrage de l'application | [`src-tauri/src/lib.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/lib.rs#L50-L56) | 50-56 |
| Page de paramètres : obtenir/ouvrir le répertoire de données (pour trouver `token_stats.db`) | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L76-L143) | 76-143 |

</details>

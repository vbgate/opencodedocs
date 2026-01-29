---
title: "Premier lancement : Maîtriser le répertoire de données | Antigravity Tools"
sidebarTitle: "Trouver le répertoire de données"
subtitle: "Essentiel au premier lancement : répertoire de données, journaux, barre d'état système et démarrage automatique"
description: "Apprenez l'emplacement du répertoire de données et la gestion des journaux d'Antigravity Tools. Maîtrisez l'ouverture du répertoire de données depuis les paramètres, le nettoyage des journaux, l'exécution en barre d'état et le démarrage automatique, en distinguant les deux types de démarrage automatique."
tags:
  - "Premier lancement"
  - "Répertoire de données"
  - "Journaux"
  - "Barre d'état"
  - "Démarrage automatique"
prerequisite:
  - "start-getting-started"
  - "start-installation"
order: 3
---

# Essentiel au premier lancement : Répertoire de données, journaux, barre d'état et démarrage automatique

De nombreuses capacités d'Antigravity Tools qui semblent "magiques" (pool de comptes, quotas, surveillance, statistiques, exécution en arrière-plan) reposent en fin de compte sur deux éléments : le **répertoire de données** et les **journaux**. Si vous comprenez bien ces deux éléments dès le premier lancement, vous gagnerez beaucoup de temps lors du dépannage.

## Qu'est-ce que le répertoire de données ?

Le **répertoire de données** est le dossier où Antigravity Tools enregistre son état local : les fichiers JSON de comptes, les fichiers liés aux quotas, les fichiers journaux, ainsi que les bases de données SQLite de Token Stats et Proxy Monitor sont tous stockés ici. Lorsque vous effectuez des sauvegardes, des migrations ou des dépannages, une fois que vous avez localisé ce répertoire, vous pouvez trouver la source de données fiable.

## Ce que vous saurez faire après ce cours

- Savoir où se trouve le répertoire de données d'Antigravity Tools (et pouvoir l'ouvrir en un clic)
- Comprendre quels fichiers doivent être sauvegardés et lesquels sont des journaux/cache
- Pouvoir localiser rapidement les journaux et la base de données de surveillance en cas de dépannage
- Comprendre la différence entre "fermer la fenêtre" et "quitter l'application" (barre d'état système permanente)
- Distinguer les deux types de démarrage automatique : démarrage au démarrage du système vs démarrage automatique du proxy inverse

## Vos difficultés actuelles

- Vous voulez sauvegarder/migrer vos comptes, mais vous ne savez pas où ils sont enregistrés
- L'interface signale une erreur / l'appel au proxy inverse échoue, mais vous ne trouvez pas les journaux
- Vous avez fermé la fenêtre en pensant que l'application s'était arrêtée, mais elle continue de fonctionner en arrière-plan

## Quand utiliser cette approche

- Vous venez d'installer Antigravity Tools et voulez confirmer "où les données sont stockées"
- Vous préparez un changement d'ordinateur / une réinstallation du système et voulez sauvegarder d'abord vos comptes et vos données statistiques
- Vous devez dépanner : échec OAuth, échec de rafraîchissement des quotas, échec de démarrage du proxy inverse, erreur 401/429 lors des appels

## 🎒 Préparation avant de commencer

- Antigravity Tools installé et fonctionnel
- Vous pouvez accéder à la page Settings (entrée dans le coin supérieur droit / barre latérale)
- Votre compte système a les permissions nécessaires pour accéder à votre répertoire Home

::: warning Rappel
Ce cours vous indiquera quels fichiers sont de "vraies données", mais nous ne recommandons pas de modifier manuellement ces fichiers. Pour modifier la configuration, privilégiez l'interface utilisateur.
:::

## Approche fondamentale

Retenez d'abord une phrase :

"**Le répertoire de données est la source unique de vérité de l'état local ; les journaux sont le premier point d'entrée pour le dépannage.**"

Antigravity Tools crée un répertoire de données `.antigravity_tools` dans votre répertoire Home et y place les comptes, journaux, bases de données statistiques, etc. (le répertoire sera créé automatiquement s'il n'existe pas).

Simultanément, il active par défaut la barre d'état : lorsque vous fermez la fenêtre, l'application ne se ferme pas immédiatement, mais se cache dans la barre d'état et continue de fonctionner en arrière-plan.

## Suivez les étapes

### Étape 1 : Ouvrir le répertoire de données depuis la page des paramètres

**Pourquoi**
Commencez par localiser avec précision le répertoire de données. Par la suite, que ce soit pour la sauvegarde ou le dépannage, vous aurez un "point de repère".

Dans Antigravity Tools, ouvrez Settings, puis basculez sur Advanced.

Vous verrez un champ en lecture seule pour "Répertoire de données" (il affichera le chemin réel), avec un bouton Ouvrir à côté.

Cliquez sur le bouton Ouvrir.

**Ce que vous devriez voir** : L'explorateur de fichiers système ouvre un répertoire, avec un chemin similaire à `~/.antigravity_tools/`.

### Étape 2 : Confirmer le chemin de votre répertoire de données (multiplateforme)

**Pourquoi**
Pour écrire des scripts de sauvegarde ou dépanner depuis la ligne de commande par la suite, vous devez connaître le chemin réel de ce répertoire sur votre système.

::: code-group

```bash [macOS/Linux]
echo "$HOME/.antigravity_tools"
ls -la "$HOME/.antigravity_tools"
```

```powershell [Windows]
$dataDir = Join-Path $HOME ".antigravity_tools"
$dataDir
Get-ChildItem -Force $dataDir
```

:::

**Ce que vous devriez voir** : Le répertoire existe (si c'est la première fois que vous ouvrez la page des paramètres, le répertoire sera créé automatiquement).

### Étape 3 : Connaître les "fichiers clés" dans le répertoire de données

**Pourquoi**
Tous les fichiers ne méritent pas d'être sauvegardés. Commençons par distinguer "quels sont les données de comptes" et "quels sont les bases de données statistiques/journaux".

Les noms de fichiers ci-dessous proviennent du code source du projet et sont tous fixes :

| Contenu que vous verrez | Utilité | Ce qui vous intéresse |
| --- | --- | --- |
| `accounts.json` | Index des comptes (contient la liste des comptes/compte actuel) | Recommandé de sauvegarder ensemble lors de la migration de comptes |
| `accounts/` | Un fichier `*.json` par compte | C'est le corps principal des données de compte |
| `logs/` | Répertoire des journaux de l'application | Priorité pour le dépannage |
| `token_stats.db` | Base de données SQLite de Token Stats | Les données que vous voyez sur la page Token Stats proviennent de cette base |
| `proxy_logs.db` | Base de données SQLite de Proxy Monitor | Les journaux de requêtes que vous voyez sur la page Monitor proviennent de cette base |
| `warmup_history.json` | Historique local de Smart Warmup | Principalement utilisé pour éviter les warmup en double |
| `update_settings.json` | Paramètres de vérification de mises à jour (vérification automatique/intervalle, etc.) | Généralement pas besoin de le modifier manuellement |

**Ce que vous devriez voir** : Au moins le répertoire `logs/` ; si vous n'avez pas encore ajouté de comptes, `accounts.json`/`accounts/` peuvent ne pas encore apparaître.

### Étape 4 : Mémoriser l'emplacement des journaux (essentiel pour le dépannage)

**Pourquoi**
Les messages d'erreur de l'interface ne donnent généralement que le "symptôme", la cause réelle de l'échec (par exemple échec de requête, échec de lecture/écriture de fichier) se trouve souvent dans les journaux.

Antigravity Tools écrit les journaux dans le répertoire `logs/` du répertoire de données.

::: code-group

```bash [macOS/Linux]
ls -la "$HOME/.antigravity_tools/logs"
```

```powershell [Windows]
Get-ChildItem -Force (Join-Path $HOME ".antigravity_tools\logs")
```

:::

**Ce que vous devriez voir** : Le répertoire contient des fichiers journaux avec rotation quotidienne (les noms de fichiers commencent par `app.log`).

### Étape 5 : Pour "vider les journaux", utilisez le nettoyage en un clic de la page des paramètres

**Pourquoi**
Pour certains problèmes, vous voulez seulement reproduire une fois, puis conserver uniquement les journaux de cette fois ; dans ce cas, vider d'abord les journaux facilitera la comparaison.

Dans Settings -> Advanced, trouvez la zone des journaux, cliquez sur "Vider les journaux".

**Ce que vous devriez voir** : Une boîte de confirmation apparaît ; après confirmation, un message de nettoyage réussi s'affiche.

::: tip Deux choses dont vous vous inquiéterez peut-être
- Les journaux effectuent automatiquement une "rotation quotidienne" et tentent de nettoyer les anciens journaux de plus de 7 jours au démarrage.
- "Vider les journaux" tronque les fichiers journaux à 0 octets, ce qui permet aux processus en cours d'écrire dans le même descripteur de fichier.
:::

### Étape 6 : Comprendre la différence entre "fermer la fenêtre" et "quitter l'application" (barre d'état)

**Pourquoi**
Antigravity Tools active par défaut la barre d'état ; lorsque vous cliquez sur la fermeture en haut à droite de la fenêtre, l'application se cache dans la barre d'état et continue de fonctionner. Si vous pensez qu'elle s'est arrêtée, il est facile d'avoir l'illusion "le port est toujours occupé/l'application tourne encore en arrière-plan".

Vous pouvez utiliser ce petit processus pour confirmer :

```
Action : Fermer la fenêtre (pas quitter)

┌─────────────────────────────────────────────────────────────┐
│  Étape 1                 Étape 2                             │
│  Cliquer sur fermer  →  Aller chercher l'icône dans la     │
│  la fenêtre               barre d'état système/la barre     │
│                           de menu                            │
└─────────────────────────────────────────────────────────────┘

Ce que vous devriez voir : L'icône de la barre d'état existe toujours, cliquez dessus pour réafficher la fenêtre.
```

Le menu de la barre d'état contient également deux actions courantes (très pratiques lorsque vous n'utilisez pas l'interface) :

- Changer de compte : passer au compte suivant
- Rafraîchir le quota : rafraîchir le quota du compte actuel (notifiera également l'interface pour rafraîchir l'affichage)

### Étape 7 : Configurer le démarrage automatique au démarrage du système (pour qu'il démarre automatiquement minimisé)

**Pourquoi**
Si vous souhaitez qu'il fonctionne comme un "service permanent" (barre d'état permanente + rafraîchissement en arrière-plan), le démarrage automatique au démarrage du système vous évitera d'avoir à l'ouvrir manuellement à chaque fois.

Dans Settings -> General, trouvez "Démarrage automatique au démarrage du système", choisissez Activer.

**Ce que vous devriez voir** : Un message de succès s'affiche après le basculement ; au prochain démarrage du système, il démarrera avec le paramètre `--minimized`.

::: info Deux types de "démarrage automatique", ne les confondez pas
| Nom | De quoi il s'agit | Preuve |
| --- | --- | --- |
| Démarrage au démarrage du système | Antigravity Tools démarre automatiquement après le démarrage de l'ordinateur (l'application de bureau elle-même) | Les paramètres de démarrage contiennent `--minimized`, et la commande `toggle_auto_launch` est fournie |
| Démarrage automatique du proxy inverse | Après le démarrage d'Antigravity Tools, si la configuration `proxy.auto_start=true`, il tente de démarrer automatiquement le service de proxy inverse local | L'application lit la configuration au démarrage et exécute `start_proxy_service(...)` |
:::

## Point de contrôle ✅

- [ ] Vous pouvez voir le chemin réel du répertoire de données dans Settings -> Advanced
- [ ] Vous pouvez ouvrir le répertoire de données et reconnaître globalement `accounts.json`, `accounts/`, `logs/`, `token_stats.db`, `proxy_logs.db`
- [ ] Vous savez que les journaux sont dans `logs/` et pouvez les consulter rapidement depuis la ligne de commande
- [ ] Vous savez qu'après avoir fermé la fenêtre, l'application continue dans la barre d'état ; pour quitter, utilisez Quit du menu de la barre d'état
- [ ] Vous pouvez distinguer "démarrage au démarrage du système" et "démarrage automatique du proxy inverse"

## Mises en garde sur les pièges

| Scénario | Ce que vous pourriez faire (❌) | Approche recommandée (✓) |
| --- | --- | --- |
| Répertoire de données introuvable | Chercher au hasard le répertoire d'installation de l'App dans le système | Allez directement dans Settings -> Advanced, regardez "Répertoire de données" et ouvrez en un clic |
| Fermer la fenêtre en pensant avoir quitté | Après avoir cliqué sur fermer la fenêtre, modifier la configuration/changer de port | Vérifiez d'abord si l'icône de la barre d'état existe toujours ; pour quitter, utilisez Quit de la barre d'état |
| Trop de journaux difficiles à dépanner | Chercher dans les anciens journaux tout en reproduisant le problème | D'abord "Vider les journaux", puis reproduire une fois, enfin regarder uniquement le fichier journal de cette fois |
| Modifier les données de compte | Modifier manuellement `accounts/*.json` | Utilisez le flux d'importation/exportation/migration de l'interface (la section suivante liée expliquera) |

## Résumé du cours

- Le répertoire de données est fixé dans `.antigravity_tools` sous Home (sur macOS/Linux, généralement un répertoire caché), comptes/journaux/bases de données statistiques sont tous ici
- Le répertoire des journaux est `logs/`, priorité pour le dépannage ; si nécessaire, vous pouvez vider en un clic depuis la page des paramètres
- Fermer la fenêtre cache dans la barre d'état et continue de fonctionner ; pour quitter complètement, utilisez Quit de la barre d'état
- Le démarrage automatique a deux types : démarrage au démarrage du système (application) et démarrage automatique du proxy inverse (Proxy)

---

## Aperçu du prochain cours

> Dans le prochain cours, nous apprendrons **[Ajouter un compte : double canal OAuth/Refresh Token et bonnes pratiques](../add-account/)**.

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Emplacement du répertoire de données (`~/.antigravity_tools`) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L33) | 16-33 |
| Index des comptes et répertoire des fichiers de comptes (`accounts.json` / `accounts/`) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L46) | 16-46 |
| Répertoire des journaux et rotation quotidienne (`logs/` + `app.log`) | [`src-tauri/src/modules/logger.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/logger.rs#L17-L83) | 17-83 |
| Vider les journaux (tronquer les fichiers) | [`src-tauri/src/modules/logger.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/logger.rs#L149-L169) | 149-169 |
| Page des paramètres affiche le répertoire de données + ouverture en un clic | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L525-L576) | 525-576 |
| Page des paramètres vide les journaux en un clic (bouton + logique de fenêtre contextuelle) | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L127-L135) | 127-135 |
| Page des paramètres vide les journaux en un clic (bouton onglet Advanced) | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L732-L747) | 732-747 |
| Menu de la barre d'état et événements de clic (changer de compte/rafraîchir/afficher/quitter) | [`src-tauri/src/modules/tray.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/tray.rs#L9-L158) | 9-158 |
| Fermer la fenêtre -> masquer (minimiser dans la barre d'état) | [`src-tauri/src/lib.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/lib.rs#L150-L160) | 150-160 |
| Initialisation du plugin de démarrage automatique au démarrage (incluant `--minimized`) | [`src-tauri/src/lib.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/lib.rs#L58-L66) | 58-66 |
| Interrupteur de démarrage automatique (`toggle_auto_launch` / `is_auto_launch_enabled`) | [`src-tauri/src/commands/autostart.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/autostart.rs#L4-L39) | 4-39 |
| Commandes d'ouverture en un clic du répertoire de données / obtention du chemin / vidage des journaux | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L578-L621) | 578-621 |
| Nom du fichier de base de données Token Stats (`token_stats.db`) | [`src-tauri/src/modules/token_stats.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/token_stats.rs#L58-L61) | 58-61 |
| Nom du fichier de base de données Proxy Monitor (`proxy_logs.db`) | [`src-tauri/src/modules/proxy_db.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/proxy_db.rs#L5-L8) | 5-8 |
| Nom du fichier d'historique Warmup (`warmup_history.json`) | [`src-tauri/src/modules/scheduler.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/scheduler.rs#L14-L17) | 14-17 |
| Nom du fichier de paramètres de mise à jour (`update_settings.json`) | [`src-tauri/src/modules/update_checker.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/update_checker.rs#L150-L177) | 150-177 |
| Démarrage automatique du proxy inverse (démarrage du service lorsque `proxy.auto_start=true`) | [`src-tauri/src/lib.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/lib.rs#L107-L126) | 107-126 |

</details>

## Aperçu du prochain cours

> Dans le prochain cours, nous apprendrons **[Ajouter un compte : double canal OAuth/Refresh Token et bonnes pratiques](../add-account/)**.
>
> Vous apprendrez :
> - Quand utiliser OAuth et quand utiliser directement refresh_token
> - Comment gérer les échecs de rappel et l'impossibilité d'obtenir refresh_token
> - Comment importer refresh_token en masse pour créer rapidement un pool de comptes

---
title: "Démarrage rapide : Maîtrisez opencode-notify en 5 minutes | Tutoriel opencode-notify"
sidebarTitle: "Recevoir une notification en 5 min"
subtitle: "Démarrage rapide : Maîtrisez opencode-notify en 5 minutes"
description: "Apprenez à installer le plugin opencode-notify, à le configurer en 5 minutes et à recevoir votre première notification de bureau. Ce tutoriel couvre l'installation via le gestionnaire de paquets OCX et l'installation manuelle, compatible avec macOS, Windows et Linux, pour vous alerter dès qu'une tâche IA est terminée."
tags:
  - "Démarrage"
  - "Installation"
  - "Prise en main rapide"
prerequisite: []
order: 10
---

# Démarrage rapide : Maîtrisez opencode-notify en 5 minutes

## Ce que vous saurez faire

- Installer le plugin opencode-notify en 3 minutes
- Déclencher votre première notification de bureau pour vérifier l'installation
- Comprendre les différences entre les méthodes d'installation et leurs cas d'usage

## Votre problème actuel

Vous confiez une tâche à l'IA puis basculez vers une autre fenêtre pour travailler. Maintenant, vous revenez vérifier toutes les 30 secondes : c'est terminé ? Une erreur ? En attente de permissions ? opencode-notify est conçu exactement pour résoudre ce problème.

Ces allers-retours constants interrompent votre concentration et font perdre du temps.

## Quand utiliser cette solution

**Activez opencode-notify dans les situations suivantes** :
- Vous basculez souvent vers d'autres applications pendant que l'IA exécute des tâches
- Vous souhaitez être alerté immédiatement quand l'IA a besoin de vous
- Vous voulez rester concentré sans manquer les événements importants

## Concept clé

Le fonctionnement d'opencode-notify est simple : il écoute les événements d'OpenCode et envoie des notifications de bureau natives aux moments clés.

**Il vous notifie pour** :
- ✅ Tâche terminée (Session idle)
- ✅ Erreur d'exécution (Session error)
- ✅ Demande de permissions (Permission updated)

**Il ne vous notifie pas pour** :
- ❌ Chaque sous-tâche terminée (trop bruyant)
- ❌ Tout événement quand le terminal est au premier plan (vous regardez déjà le terminal)

## 🎒 Prérequis

::: warning Conditions préalables
- [OpenCode](https://github.com/sst/opencode) installé
- Un terminal disponible (macOS Terminal, iTerm2, Windows Terminal, etc.)
- Système macOS/Windows/Linux (tous trois supportés)
:::

## Suivez le guide

### Étape 1 : Choisir la méthode d'installation

opencode-notify propose deux méthodes d'installation :

| Méthode | Cas d'usage | Avantages | Inconvénients |
|--- | --- | --- | ---|
| **Gestionnaire OCX** | La plupart des utilisateurs | Installation en un clic, mises à jour automatiques, gestion complète des dépendances | Nécessite d'installer OCX d'abord |
| **Installation manuelle** | Besoins spécifiques | Contrôle total, pas besoin d'OCX | Gestion manuelle des dépendances et mises à jour |

**Recommandé** : Privilégiez l'installation via OCX, plus simple.

### Étape 2 : Installation via OCX (recommandé)

#### 2.1 Installer le gestionnaire de paquets OCX

OCX est le gestionnaire officiel de plugins OpenCode, permettant d'installer, mettre à jour et gérer facilement les plugins.

**Installer OCX** :

```bash
curl -fsSL https://ocx.kdco.dev/install.sh | sh
```

**Vous devriez voir** : Le script d'installation affiche la progression et confirme le succès à la fin.

#### 2.2 Ajouter le Registry KDCO

Le Registry KDCO est un dépôt de plugins contenant opencode-notify et d'autres plugins utiles.

**Ajouter le registry** :

```bash
ocx registry add https://registry.kdco.dev --name kdco
```

**Vous devriez voir** : Un message "Registry added successfully" ou similaire.

::: tip Optionnel : Configuration globale
Si vous souhaitez utiliser le même registry dans tous vos projets, ajoutez le paramètre `--global` :

```bash
ocx registry add https://registry.kdco.dev --name kdco --global
```
:::

#### 2.3 Installer opencode-notify

**Installer le plugin** :

```bash
ocx add kdco/notify
```

**Vous devriez voir** :
```
✓ Added kdco/notify to your OpenCode workspace
```

### Étape 3 : Installation complète de l'espace de travail (optionnel)

Si vous souhaitez une expérience complète, vous pouvez installer l'espace de travail KDCO, qui inclut :

- opencode-notify (notifications de bureau)
- Agents en arrière-plan (Background Agents)
- Agents spécialisés (Specialist Agents)
- Outils de planification (Planning Tools)

**Installer l'espace de travail** :

```bash
ocx add kdco/workspace
```

**Vous devriez voir** : Un message confirmant l'ajout de plusieurs composants.

### Étape 4 : Vérifier l'installation

Une fois l'installation terminée, nous devons déclencher une notification pour vérifier que la configuration est correcte.

**Méthode de vérification 1 : Faire exécuter une tâche par l'IA**

Dans OpenCode, entrez :

```
Calcule la somme de 1 à 10, puis attends 5 secondes avant de me donner le résultat.
```

Basculez vers une autre fenêtre pendant quelques secondes, vous devriez voir une notification de bureau apparaître.

**Méthode de vérification 2 : Vérifier le fichier de configuration**

Vérifiez si le fichier de configuration existe :

```bash
# macOS/Linux
cat ~/.config/opencode/kdco-notify.json

# Windows PowerShell
type $env:USERPROFILE\.config\opencode\kdco-notify.json
```

**Vous devriez voir** :
- Si le fichier n'existe pas → Configuration par défaut utilisée (normal)
- Si le fichier existe → Votre configuration personnalisée s'affiche

### Étape 5 : Installation manuelle (alternative)

Si vous ne souhaitez pas utiliser OCX, vous pouvez installer manuellement.

#### 5.1 Copier le code source

Copiez le code source d'opencode-notify dans le répertoire des plugins OpenCode :

```bash
# Copier depuis le code source vers un répertoire dédié
mkdir -p ~/.opencode/plugin/kdco-notify
cp src/notify.ts ~/.opencode/plugin/kdco-notify/
cp -r src/plugin/kdco-primitives ~/.opencode/plugin/kdco-notify/
```

#### 5.2 Installer les dépendances

Installez manuellement les dépendances nécessaires :

```bash
cd ~/.opencode/plugin/
npm install node-notifier detect-terminal @opencode-ai/plugin @opencode-ai/sdk
```

::: warning Points d'attention
- **Gestion des dépendances** : Vous devez installer et mettre à jour manuellement `node-notifier` et `detect-terminal`
- **Mises à jour difficiles** : Chaque mise à jour nécessite de recopier manuellement le code source
- **Non recommandé** : Sauf besoins spécifiques, privilégiez l'installation via OCX
:::

### Point de contrôle ✅

Après avoir terminé les étapes ci-dessus, vérifiez :

- [ ] OCX installé avec succès (`ocx --version` affiche le numéro de version)
- [ ] Registry KDCO ajouté (`ocx registry list` affiche kdco)
- [ ] opencode-notify installé (`ocx list` affiche kdco/notify)
- [ ] Première notification de bureau reçue
- [ ] La notification affiche le bon titre de tâche

**Si une étape échoue** :
- Consultez le [Dépannage](../../faq/troubleshooting/) pour obtenir de l'aide
- Vérifiez qu'OpenCode fonctionne correctement
- Confirmez que votre système supporte les notifications de bureau

## Pièges à éviter

### Problème courant 1 : Les notifications ne s'affichent pas

**Causes** :
- macOS : Les notifications système sont désactivées
- Windows : Les permissions de notification ne sont pas accordées
- Linux : notify-send n'est pas installé

**Solutions** :

| Plateforme | Solution |
|--- | ---|
| macOS | Préférences Système → Notifications → OpenCode → Autoriser les notifications |
| Windows | Paramètres → Système → Notifications → Activer les notifications |
| Linux | Installer libnotify-bin : `sudo apt install libnotify-bin` |

### Problème courant 2 : Échec de l'installation d'OCX

**Causes** : Problème réseau ou permissions insuffisantes

**Solutions** :
1. Vérifiez votre connexion réseau
2. Utilisez sudo pour l'installation (nécessite les droits administrateur)
3. Téléchargez et exécutez manuellement le script d'installation

### Problème courant 3 : Échec de l'installation des dépendances

**Causes** : Version de Node.js incompatible

**Solutions** :
- Utilisez Node.js 18 ou supérieur
- Videz le cache npm : `npm cache clean --force`

## Résumé de la leçon

Dans cette leçon, nous avons accompli :
- ✅ Installation du gestionnaire de paquets OCX
- ✅ Ajout du Registry KDCO
- ✅ Installation du plugin opencode-notify
- ✅ Déclenchement de la première notification de bureau
- ✅ Découverte de la méthode d'installation manuelle

**Points clés** :
1. opencode-notify utilise les notifications de bureau natives, évitant les changements de fenêtre fréquents
2. OCX est la méthode d'installation recommandée, gérant automatiquement les dépendances et mises à jour
3. Par défaut, seules les sessions parentes sont notifiées, évitant le bruit des sous-tâches
4. Les notifications sont automatiquement supprimées quand le terminal est au premier plan

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous étudierons **[Comment ça fonctionne](../how-it-works/)**.
>
> Vous apprendrez :
> - Comment le plugin écoute les événements OpenCode
> - Le flux de travail du mécanisme de filtrage intelligent
> - Les principes de détection du terminal et de perception du focus
> - Les différences fonctionnelles entre plateformes

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-27

| Fonctionnalité | Chemin du fichier | Lignes |
|--- | --- | ---|
| Point d'entrée du plugin | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L1-L407) | 1-407 |
| Chargement de la configuration | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
| Envoi de notification | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L280-L308) | 280-308 |
| Détection du terminal | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L176) | 145-176 |
| Vérification des heures silencieuses | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L181-L199) | 181-199 |
| Configuration par défaut | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L30-L48) | 30-48 |

**Constantes clés** :
- `DEFAULT_CONFIG.sounds.idle = "Glass"` : Son par défaut pour tâche terminée
- `DEFAULT_CONFIG.sounds.error = "Basso"` : Son par défaut pour erreur
- `DEFAULT_CONFIG.sounds.permission = "Submarine"` : Son par défaut pour demande de permission
- `DEFAULT_CONFIG.notifyChildSessions = false` : Par défaut, seules les sessions parentes sont notifiées

**Fonctions clés** :
- `NotifyPlugin()` : Fonction d'entrée du plugin, retourne les gestionnaires d'événements
- `loadConfig()` : Charge le fichier de configuration, fusionne avec les valeurs par défaut
- `sendNotification()` : Envoie une notification de bureau native
- `detectTerminalInfo()` : Détecte le type de terminal et le Bundle ID
- `isQuietHours()` : Vérifie si l'heure actuelle est dans la période silencieuse
- `isParentSession()` : Détermine s'il s'agit d'une session parente
- `isTerminalFocused()` : Détecte si le terminal est la fenêtre active

</details>

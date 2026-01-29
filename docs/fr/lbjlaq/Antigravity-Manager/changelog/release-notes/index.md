---
title: "Notes de publication : évolution des versions | Antigravity-Manager"
sidebarTitle: "Comprendre les mises à jour en 3 minutes"
subtitle: "Évolution des versions : basé sur le Changelog intégré dans le README"
description: "Découvrez la méthode d'évolution des versions d'Antigravity-Manager. Confirmez la version et vérifiez les mises à jour dans la page Settings, consultez les corrections et les rappels dans le Changelog README, et vérifiez la disponibilité après mise à niveau avec /healthz."
tags:
  - "changelog"
  - "release"
  - "upgrade"
  - "troubleshooting"
prerequisite:
  - "start-installation"
  - "start-proxy-and-first-client"
order: 1
---

# Évolution des versions : basé sur le Changelog intégré dans le README

Vous vous préparez à mettre à niveau Antigravity Tools, et ce que vous craignez le plus n'est pas « de ne pas avoir mis à jour », mais « de découvrir un changement de compatibilité après la mise à jour ». Cette page explique clairement comment lire le **Changelog d'Antigravity Tools (évolution des versions)**, afin que vous puissiez juger avant la mise à niveau : cet impact de mise à jour vous affectera comment.

## Ce que vous pourrez faire après ce chapitre

- Dans la page About des Settings, confirmer rapidement la version actuelle, vérifier les mises à jour et obtenir le lien de téléchargement
- Dans le Changelog README, ne lire que les sections de version qui vous affectent (au lieu de parcourir du début à la fin)
- Avant la mise à niveau, faire une chose : confirmer s'il y a des rappels de « nécessitant de modifier manuellement la configuration/le mappage des modèles »
- Après la mise à niveau, effectuer une vérification minimale (`/healthz`) pour confirmer que le proxy fonctionne toujours

## Qu'est-ce que le Changelog ?

**Changelog** est une liste enregistrant « ce qui a changé » par version. Antigravity Tools l'écrit directement dans « Évolution des versions » du README, chaque version indiquant la date et les changements clés. Avant la mise à niveau, consulter le Changelog peut réduire la probabilité de rencontrer des changements de compatibilité ou des problèmes de régression.

## Quand utiliser cette page

- Vous préparez à mettre à niveau d'une ancienne version vers une nouvelle version et souhaitez d'abord confirmer les points de risque
- Vous rencontrez un problème (comme 429/0 Token/Cloudflared) et souhaitez confirmer s'il a été corrigé dans une version récente
- Vous maintenez une version unifiée dans une équipe et devez fournir à vos collègues une méthode pour « lire les changements par version »

## 🎒 Préparatifs avant de commencer

::: warning Il est recommandé de préparer d'abord le chemin de mise à niveau
Il y a de nombreuses façons d'installer/mettre à niveau (brew, téléchargement manuel depuis Releases, mise à jour dans l'application). Si vous n'avez pas encore déterminé quelle voie utiliser, consultez d'abord **[Installation et mise à niveau : meilleur chemin d'installation de bureau (brew / releases)](/fr/lbjlaq/Antigravity-Manager/start/installation/)**.
:::

## Suivez-moi

### Étape 1 : Dans la page About, confirmez la version que vous utilisez actuellement

**Pourquoi**
Le Changelog est organisé par version. Vous devez d'abord connaître votre version actuelle pour savoir « à partir d'où commencer à lire ».

Chemin d'accès : **Settings** → **About**.

**Ce que vous devriez voir** : la zone d'en-tête de la page affiche le nom de l'application et le numéro de version (par exemple `v3.3.49`).

### Étape 2 : Cliquez sur « Vérifier les mises à jour » et obtenez la dernière version et le lien de téléchargement

**Pourquoi**
Vous devez d'abord savoir « quel est le numéro de la dernière version », puis aller dans le Changelog pour sélectionner les sections de version entre les deux.

Dans la page About, cliquez sur « Vérifier les mises à jour ».

**Ce que vous devriez voir** :
- S'il y a une mise à jour : invite « new version available » et un bouton de téléchargement apparaît (ouvre `download_url`)
- Si c'est déjà la dernière : invite « latest version »

### Étape 3 : Allez dans le Changelog README et ne lisez que les versions que vous avez sautées

**Pourquoi**
Vous n'avez besoin de vous soucier que des changements « entre votre version actuelle et la dernière version », les autres versions historiques peuvent être ignorées pour l'instant.

Ouvrez le README, localisez **« Évolution des versions (Changelog) »**, et commencez à lire à partir de la dernière version vers le bas, jusqu'à ce que vous voyiez votre version actuelle.

**Ce que vous devriez voir** : les versions sont listées au format `vX.Y.Z (YYYY-MM-DD)`, et chaque version a des explications groupées (comme corrections principales/améliorations de fonctionnalités).

### Étape 4 : Après la mise à niveau, effectuez une vérification minimale

**Pourquoi**
La première chose après la mise à niveau n'est pas « d'exécuter des scénarios complexes », mais de confirmer d'abord que le proxy peut démarrer normalement et peut être détecté par le client.

Suivez le processus de **[Démarrer le proxy inverse local et connecter le premier client (/healthz + configuration SDK)](/fr/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)**, et vérifiez au moins une fois `GET /healthz`.

**Ce que vous devriez voir** : `/healthz` renvoie un succès (pour confirmer que le service est disponible).

## Résumé des versions récentes (extrait du README)

| Version | Date | Ce que vous devez surveiller |
|--- | --- | ---|
| `v3.3.49` | 2026-01-22 | Défense contre l'interruption de réflexion et 0 Token ; suppression de `gemini-2.5-flash-lite` et rappel de remplacer manuellement le mappage personnalisé ; langage/thème et autres paramètres prennent effet immédiatement ; renforcement du tableau de bord de surveillance ; amélioration de la compatibilité OAuth |
| `v3.3.48` | 2026-01-21 | Processus en arrière-plan en mode silencieux sur Windows (correction du scintillement de la console) |
| `v3.3.47` | 2026-01-21 | Renforcement du mappage des paramètres de génération d'images (`size`/`quality`) ; prise en charge du tunnel Cloudflared ; correction de l'échec de démarrage dû aux conflits de fusion ; compression contextuelle progressive en trois couches |

::: tip Comment juger rapidement « cette mise à jour m'affectera-t-elle »
Priorisez ces deux types de phrases :

- **Rappel utilisateur/vous devez modifier** : comme nommer explicitement un modèle par défaut qui a été supprimé, exigeant que vous ajustiez manuellement le mappage personnalisé
- **Correction principale/correction de compatibilité** : comme 0 Token, 429, scintillement Windows, échec de démarrage, etc. problèmes « qui vous empêcheront de l'utiliser »
:::

---

## Annexe : référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Contenu | Chemin du fichier | Numéros de ligne |
|--- | --- | ---|
| Changelog intégré README (évolution des versions) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L324-L455) | 324-455 |
| Page About affiche le numéro de version et le bouton « Vérifier les mises à jour » | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L821-L954) | 821-954 |
| Structure de retour de la commande « Vérifier les mises à jour » de la page About | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L187-L215) | 187-215 |
| Notification de mise à jour automatique (télécharger et redémarrer) | [`src/components/UpdateNotification.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/UpdateNotification.tsx#L33-L96) | 33-96 |
| Numéro de version actuel (métadonnées de construction) | [`package.json`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/package.json#L1-L4) | 1-4 |

</details>

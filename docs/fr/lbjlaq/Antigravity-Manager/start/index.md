---
title: "Démarrage Rapide : Utiliser Antigravity Tools de Zéro | Antigravity-Manager"
sidebarTitle: "Démarrer de Zéro"
subtitle: "Démarrage Rapide : Utiliser Antigravity Tools de Zéro"
description: "Apprenez le processus complet pour débuter avec Antigravity Tools. De l'installation et la configuration au premier appel API, maîtrisez rapidement les méthodes d'utilisation principales de la passerelle locale."
order: 1
---

# Démarrage Rapide

Ce chapitre vous guide à utiliser Antigravity Tools à partir de zéro, en accomplissant le processus complet de l'installation au premier appel API réussi. Vous apprendrez les concepts clés, la gestion des comptes, la sauvegarde des données, et comment connecter vos clients IA à la passerelle locale.

## Contenu du chapitre

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

<a href="./getting-started/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Antigravity Tools, c'est quoi</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">Établir le bon modèle mental : concepts et limites d'utilisation de la passerelle locale, de la compatibilité des protocoles et de l'ordonnancement des pools de comptes.</p>
</a>

<a href="./installation/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Installation et mise à niveau</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">Meilleur chemin d'installation pour le bureau (brew / releases) et gestion des blocages système courants.</p>
</a>

<a href="./first-run-data/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">À savoir au premier démarrage</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">Répertoire de données, journaux, barre des tâches et démarrage automatique, éviter la suppression accidentelle et la perte irréversible.</p>
</a>

<a href="./add-account/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Ajouter un compte</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">Double canal OAuth/Refresh Token et meilleures pratiques, établir un pool de comptes de la manière la plus stable.</p>
</a>

<a href="./backup-migrate/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Sauvegarde et migration des comptes</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">Import/Export, migration à chaud V1/DB, support pour le multi-appareils et les déploiements serveur.</p>
</a>

<a href="./proxy-and-first-client/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Démarrer le reverse proxy et connecter le client</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">Du démarrage du service au premier appel réussi d'un client externe, compléter la boucle de validation.</p>
</a>

</div>

## Parcours d'apprentissage

::: tip Ordre recommandé
Suivez l'ordre ci-dessous pour apprendre le plus rapidement possible à utiliser Antigravity Tools :
:::

```
1. Comprendre les concepts  →  2. Installer le logiciel  →  3. Comprendre le répertoire de données
   getting-started              installation              first-run-data
        ↓                            ↓                            ↓
4. Ajouter un compte      →  5. Sauvegarder les comptes  →  6. Démarrer le reverse proxy
   add-account                  backup-migrate            proxy-and-first-client
```

| Étape | Cours | Temps estimé | Ce que vous apprendrez |
|--- | --- | --- | ---|
| 1 | [Comprendre les concepts](./getting-started/) | 5 minutes | Qu'est-ce qu'une passerelle locale, pourquoi avons-nous besoin d'un pool de comptes |
| 2 | [Installer le logiciel](./installation/) | 3 minutes | Installer avec brew ou télécharger manuellement, gérer les blocages système |
| 3 | [Comprendre le répertoire de données](./first-run-data/) | 5 minutes | Où sont les données, comment consulter les journaux, opérations de la barre des tâches |
| 4 | [Ajouter un compte](./add-account/) | 10 minutes | Autorisation OAuth ou saisie manuelle du Refresh Token |
| 5 | [Sauvegarder les comptes](./backup-migrate/) | 5 minutes | Exporter les comptes, migration entre appareils |
| 6 | [Démarrer le reverse proxy](./proxy-and-first-client/) | 10 minutes | Démarrer le service, configurer le client, valider les appels |

**Chemin minimum** : Si vous êtes pressé, vous pouvez compléter seulement 1 → 2 → 4 → 6, environ 25 minutes pour commencer à utiliser.

## Prochaines étapes

Après avoir terminé ce chapitre, vous pouvez normalement utiliser Antigravity Tools. Ensuite, vous pouvez approfondir selon vos besoins :

- **[Plateformes et intégrations](../platforms/)** : Comprendre les détails d'intégration des différents protocoles OpenAI, Anthropic, Gemini, etc.
- **[Configuration avancée](../advanced/)** : Routage des modèles, protection des quotas, ordonnancement haute disponibilité et autres fonctionnalités avancées
- **[Questions fréquentes](../faq/)** : Guide de dépannage pour les erreurs 401, 429, 404, etc.

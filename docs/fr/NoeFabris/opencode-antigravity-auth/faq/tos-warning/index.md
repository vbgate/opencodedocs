---
title: "Avertissement ToS : Risques de compte et pratiques de sécurité | Antigravity Auth"
sidebarTitle: "Évitez le bannissement"
subtitle: "Avertissement ToS : Risques de compte et pratiques de sécurité"
description: "Apprenez les risques d'utilisation du plugin Antigravity Auth et les pratiques de sécurité des comptes. Comprenez les scénarios à haut risque, les mécanismes de shadow ban et les différences de limitation de débit, maîtrisez les stratégies multi-comptes, le contrôle d'utilisation et les méthodes de préchauffage des comptes."
tags:
  - FAQ
  - Avertissement de risque
  - Sécurité des comptes
prerequisite:
  - start-quick-install
order: 5
---

# Avertissement ToS

Après ce cours, vous comprendrez les risques potentiels liés à l'utilisation du plugin Antigravity Auth et comment protéger la sécurité de votre compte Google.

## Votre situation actuelle

Vous envisagez d'utiliser le plugin Antigravity Auth pour accéder aux modèles d'IA de Google Antigravity, mais vous avez quelques inquiétudes :

- Vous avez vu des rapports communautaires de comptes bannis ou shadow-bannis
- Vous craignez que l'utilisation d'outils non officiels viole les conditions de service de Google
- Vous ne savez pas si vous devez utiliser un nouveau compte ou un ancien compte
- Vous voulez savoir comment réduire les risques

Ces préoccupations sont légitimes. L'utilisation de tout outil non officiel comporte certains risques, et cet article vous aidera à comprendre les points de risque spécifiques et les stratégies d'atténuation.

## Quand consulter ce cours

- **Avant d'installer le plugin** : Comprendre les risques avant de décider d'utiliser
- **Lors du choix du compte** : Décider quel compte Google utiliser pour l'authentification
- **En cas de bannissement** : Comprendre les causes possibles et les mesures préventives
- **Lors de l'inscription d'un nouveau compte** : Éviter les modèles d'utilisation à haut risque

---

## Aperçu des risques principaux

::: danger Avertissement important

**L'utilisation de ce plugin peut violer les conditions de service (Terms of Service) de Google.**

Un petit nombre d'utilisateurs ont signalé que leurs comptes Google ont été bannis ou shadow-bannis (Shadow Ban, c'est-à-dire restriction d'accès sans notification explicite).

**L'utilisation de ce plugin signifie que vous acceptez les déclarations suivantes :**
1. Il s'agit d'un outil non officiel, non approuvé ou endossé par Google
2. Votre compte Google peut être suspendu ou banni définitivement
3. Vous assumez tous les risques et conséquences de l'utilisation de ce plugin

:::

### Qu'est-ce qu'un shadow ban ?

**Le shadow ban (Shadow Ban)** est une mesure restrictive que Google applique aux comptes suspects. Contrairement au bannissement direct, le shadow ban n'affiche pas de message d'erreur explicite, mais plutôt :
- Les requêtes API retournent des erreurs 403 ou 429
- Le quota s'affiche comme disponible, mais ne peut pas être utilisé en réalité
- Les autres comptes fonctionnent normalement, seul le compte marqué est affecté

Le shadow ban dure généralement longtemps (de quelques jours à quelques semaines) et ne peut pas être récupéré par appel.

---

## Scénarios à haut risque

Les scénarios suivants augmentent considérablement le risque de marquage ou de bannissement du compte :

### 🚨 Scénario 1 : Compte Google tout neuf

**Niveau de risque : Extrêmement élevé**

Les comptes Google nouvellement enregistrés utilisant ce plugin ont une très forte probabilité d'être bannis. Raisons :
- Les nouveaux comptes manquent de données d'historique comportemental, faciles à marquer par le système de détection d'abus de Google
- Un grand nombre d'appels API sur un nouveau compte sera considéré comme un comportement anormal
- Google applique un examen plus strict sur les nouveaux comptes

**Recommandation** : Ne créez pas de nouveau compte spécifiquement pour ce plugin.

### 🚨 Scénario 2 : Nouveau compte + Abonnement Pro/Ultra

**Niveau de risque : Extrêmement élevé**

Les comptes nouvellement enregistrés qui s'abonnent immédiatement aux services Pro ou Ultra de Google sont souvent marqués et bannis. Raisons :
- Le modèle d'utilisation élevée après l'abonnement sur un nouveau compte ressemble à un abus
- Google applique un examen plus strict sur les nouveaux utilisateurs payants
- Ce modèle diffère trop du parcours de croissance d'un utilisateur normal

**Recommandation** : Laissez le compte "croître naturellement" pendant un certain temps (au moins quelques mois) avant d'envisager un abonnement.

### 🟡 Scénario 3 : Grand nombre de requêtes en peu de temps

**Niveau de risque : Élevé**

Lancer un grand nombre de requêtes API en peu de temps, ou utiliser fréquemment des proxies parallèles/sessions multiples, déclenchera la limitation de débit et la détection d'abus. Raisons :
- Le modèle de requêtes d'OpenCode est plus dense que les applications natives (appels d'outils, tentatives, streaming, etc.)
- Les requêtes hautement concurrentes déclenchent les mécanismes de protection de Google

**Recommandations** :
- Contrôler la fréquence des requêtes et le nombre de connexions concurrentes
- Éviter de lancer plusieurs proxies parallèles simultanément
- Utiliser la rotation multi-comptes pour disperser les requêtes

### 🟡 Scénario 4 : Utilisation d'un compte Google unique

**Niveau de risque : Moyen**

Si vous n'avez qu'un seul compte Google et que vous en dépendez pour accéder aux services critiques (Gmail, Drive, etc.), le risque est plus élevé. Raisons :
- Le bannissement du compte affectera votre travail quotidien
- Impossible de récupérer par appel
- Absence de solution de secours

**Recommandation** : Utilisez un compte indépendant qui ne dépend pas de services critiques.

---

## Recommandations de meilleures pratiques

### ✅ Pratiques recommandées

**1. Utiliser un compte Google établi**

Privilégiez un compte Google utilisé depuis un certain temps (recommandé 6 mois ou plus) :
- Avec un historique d'utilisation normale des services Google (Gmail, Drive, Google Search, etc.)
- Sans antécédents de violation
- Compte lié à un numéro de téléphone et vérifié

**2. Configurer plusieurs comptes**

Ajoutez plusieurs comptes Google, dispersez les requêtes par rotation :
- Configurez au moins 2-3 comptes
- Utilisez la stratégie `account_selection_strategy: "hybrid"` (par défaut)
- Basculez automatiquement entre les comptes en cas de limitation de débit

**3. Contrôler le volume d'utilisation**

- Évitez les requêtes intensives en peu de temps
- Réduisez le nombre de proxies parallèles
- Définissez `max_rate_limit_wait_seconds: 0` dans `antigravity.json` pour échouer rapidement plutôt que de réessayer

**4. Surveiller l'état des comptes**

Vérifiez régulièrement l'état des comptes :
- Consultez `rateLimitResetTimes` dans `~/.config/opencode/antigravity-accounts.json`
- Activez les journaux de débogage : `OPENCODE_ANTIGRAVITY_DEBUG=1 opencode`
- En cas d'erreurs 403/429, suspendez l'utilisation pendant 24-48 heures

**5. "Préchauffer" d'abord dans l'interface officielle**

Méthode efficace rapportée par la communauté :
1. Connectez-vous à [Antigravity IDE](https://idx.google.com/) dans le navigateur
2. Exécutez quelques invites simples (comme « Bonjour », « Combien font 2+2 »)
3. Après 5-10 appels réussis, utilisez le plugin

**Principe** : L'utilisation du compte via l'interface officielle fait croire à Google qu'il s'agit d'un comportement d'utilisateur normal, réduisant le risque de marquage.

### ❌ Pratiques à éviter

- ❌ Créer un nouveau compte Google spécifiquement pour ce plugin
- ❌ S'abonner immédiatement à Pro/Ultra sur un compte nouvellement enregistré
- ❌ Utiliser votre unique compte de services critiques (comme l'email professionnel)
- ❌ Réessayer de manière répétée après avoir déclenché une limitation 429
- ❌ Lancer un grand nombre de proxies parallèles simultanément
- ❌ Soumettre `antigravity-accounts.json` au contrôle de version

---

## Questions fréquentes

### Q : Mon compte a été banni, puis-je faire appel ?

**R : Non.**

Si le bannissement ou le shadow ban est déclenché par la détection d'abus de Google via ce plugin, il est généralement impossible de récupérer par appel. Raisons :
- Le bannissement est déclenché automatiquement en fonction du modèle d'utilisation de l'API
- Google adopte une attitude stricte envers l'utilisation d'outils non officiels
- L'appel nécessite d'expliquer l'utilisation de l'outil, mais ce plugin lui-même peut être considéré comme une violation

**Recommandations** :
- Utilisez d'autres comptes non affectés
- Si tous les comptes sont bannis, utilisez directement [Antigravity IDE](https://idx.google.com/)
- Évitez de continuer à essayer sur les comptes bannis

### Q : L'utilisation de ce plugin entraînera-t-elle forcément un bannissement ?

**R : Pas nécessairement.**

La plupart des utilisateurs n'ont rencontré aucun problème en utilisant ce plugin. Le risque dépend de :
- L'âge du compte et l'historique comportemental
- La fréquence d'utilisation et le modèle de requêtes
- Le respect des meilleures pratiques

**Évaluation des risques** :
- Ancien compte + utilisation modérée + rotation multi-comptes → Risque faible
- Nouveau compte + requêtes intensives + compte unique → Risque élevé

### Q : Quelle est la différence entre shadow ban et limitation de débit ?

**R : Nature différente, méthodes de récupération différentes.**

| Caractéristique | Shadow Ban | Limitation de débit (429) |
| --- | --- | --- |
| Cause du déclenchement | Détection d'abus, marqué comme suspect | Fréquence de requêtes dépassant le quota |
| Code d'erreur | 403 ou échec silencieux | 429 Too Many Requests |
| Durée | Quelques jours à quelques semaines | Quelques heures à un jour |
| Méthode de récupération | Impossible à récupérer, utiliser un autre compte | Attendre la réinitialisation ou changer de compte |
| Peut-on prévenir | Suivre les meilleures pratiques pour réduire le risque | Contrôler la fréquence des requêtes |

### Q : Puis-je utiliser un compte Google d'entreprise ?

**R : Non recommandé.**

Les comptes d'entreprise sont généralement liés à des services et données critiques, le bannissement a un impact plus grave. De plus :
- Les comptes d'entreprise font l'objet d'un examen plus strict
- Peut violer la politique informatique de l'entreprise
- Le risque est assumé individuellement, mais affecte l'équipe

**Recommandation** : Utilisez un compte personnel.

### Q : Les comptes multiples peuvent-ils éviter complètement le bannissement ?

**R : Impossible d'éviter complètement, mais peut réduire l'impact.**

Rôle des comptes multiples :
- Disperser les requêtes, réduire la probabilité qu'un seul compte déclenche une limitation
- Si un compte est banni, les autres comptes restent utilisables
- Basculer automatiquement en cas de limitation, améliorer la disponibilité

**Mais les comptes multiples ne sont pas un "talisman"** :
- Si tous les comptes déclenchent la détection d'abus, ils peuvent tous être bannis
- Ne pas abuser des comptes multiples pour des requêtes intensives
- Chaque compte doit toujours suivre les meilleures pratiques

---

## Points de contrôle ✅

Après avoir lu ce cours, vous devriez savoir :
- [ ] L'utilisation de ce plugin peut violer les ToS de Google, risques à vos propres frais
- [ ] Nouveau compte + abonnement Pro/Ultra est un scénario à haut risque
- [ ] Il est recommandé d'utiliser un compte Google établi
- [ ] Configurer plusieurs comptes peut disperser les risques
- [ ] Les comptes bannis ne peuvent pas être récupérés par appel
- [ ] Contrôler la fréquence des requêtes et le volume d'utilisation est important

---

## Résumé de ce cours

Ce cours a présenté les risques potentiels liés à l'utilisation du plugin Antigravity Auth :

1. **Risques principaux** : Peut violer les ToS de Google, le compte peut être banni ou shadow-banni
2. **Scénarios à haut risque** : Nouveau compte, nouveau compte + abonnement, requêtes intensives, compte critique unique
3. **Meilleures pratiques** : Utiliser un ancien compte, configurer plusieurs comptes, contrôler le volume d'utilisation, surveiller l'état, "préchauffer" d'abord
4. **Questions fréquentes** : Impossible de faire appel, les risques varient selon les personnes, les comptes multiples peuvent réduire l'impact

Avant d'utiliser ce plugin, veuillez évaluer soigneusement les risques. Si vous ne pouvez pas accepter les conséquences d'un éventuel bannissement de compte, il est recommandé d'utiliser directement [Antigravity IDE](https://idx.google.com/).

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquer pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

Ce cours est basé sur la section d'avertissement de risque du document README du projet (README.md:23-40), sans impliquer d'implémentation de code spécifique.

| Fonction | Chemin du fichier | Lignes |
| --- | --- | --- |
| Déclaration d'avertissement ToS | [`README.md`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/README.md#L23-L40) | 23-40 |

</details>

---
title: "Historique des versions : Journal des modifications d'Antigravity Auth | opencode-antigravity-auth"
sidebarTitle: "Aperçu des nouveautés"
subtitle: "Historique des versions : Journal des modifications d'Antigravity Auth"
description: "Découvrez l'historique des versions et les modifications importantes du plugin Antigravity Auth. Consultez les nouvelles fonctionnalités, corrections de bugs et améliorations de performances pour chaque version, ainsi que les guides de mise à niveau et les notes de compatibilité."
tags:
  - "Historique des versions"
  - "Journal des modifications"
  - "Notes de version"
order: 1
---

# Historique des versions

Ce document retrace l'historique des versions et les modifications importantes du plugin Antigravity Auth.

::: tip Dernière version
Version stable actuelle : **v1.3.0** (17/01/2026)
:::

## Notes de version

### Version stable (Stable)
- Entièrement testée, recommandée pour les environnements de production
- Format du numéro de version : `vX.Y.Z` (ex. v1.3.0)

### Version bêta (Beta)
- Contient les dernières fonctionnalités, peut présenter des instabilités
- Format du numéro de version : `vX.Y.Z-beta.N` (ex. v1.3.1-beta.3)
- Idéale pour les tests précoces et les retours d'expérience

---

## Série v1.3.x

### v1.3.1-beta.3
**Date de publication** : 22/01/2026

**Modifications** :
- Optimisation de l'algorithme de backoff pour l'erreur `MODEL_CAPACITY_EXHAUSTED`, augmentation de la plage de jitter aléatoire

### v1.3.1-beta.2
**Date de publication** : 22/01/2026

**Modifications** :
- Suppression de l'option de configuration `googleSearch` inutilisée
- Ajout d'un avertissement ToS (Conditions d'utilisation) et de recommandations d'usage dans le README

### v1.3.1-beta.1
**Date de publication** : 22/01/2026

**Modifications** :
- Amélioration de la logique de debounce pour les notifications de changement de compte, réduction des alertes répétitives

### v1.3.1-beta.0
**Date de publication** : 20/01/2026

**Modifications** :
- Suppression du suivi des sous-modules, restauration de tsconfig.json

### v1.3.0
**Date de publication** : 17/01/2026

**Modifications importantes** :

**Nouvelles fonctionnalités** :
- Utilisation de la méthode native `toJSONSchema` de Zod v4 pour la génération de schémas

**Corrections** :
- Correction des tests de consommation de tokens, utilisation de `toBeCloseTo` pour gérer la précision des nombres à virgule flottante
- Amélioration du calcul de la couverture des tests

**Améliorations de la documentation** :
- Documentation enrichie sur l'équilibrage de charge
- Améliorations du formatage

---

## Série v1.2.x

### v1.2.9-beta.10
**Date de publication** : 17/01/2026

**Modifications** :
- Correction de l'assertion du solde de tokens, utilisation de la correspondance de précision pour les nombres à virgule flottante

### v1.2.9-beta.9
**Date de publication** : 16/01/2026

**Modifications** :
- Mise à jour des tests de consommation de tokens, utilisation de `toBeCloseTo` pour la précision des nombres à virgule flottante
- Amélioration de l'encapsulation des outils Gemini, ajout du comptage des fonctions encapsulées

### v1.2.9-beta.8
**Date de publication** : 16/01/2026

**Modifications** :
- Ajout de nouveaux modèles d'issues (rapport de bug et demande de fonctionnalité)
- Amélioration de la logique d'onboarding du projet

### v1.2.9-beta.7
**Date de publication** : 16/01/2026

**Modifications** :
- Mise à jour des modèles d'issues, exigence d'un titre descriptif

### v1.2.9-beta.6
**Date de publication** : 16/01/2026

**Modifications** :
- Ajout d'un délai de réessai configurable pour la limitation de débit
- Amélioration de la détection du hostname, support de l'environnement Docker OrbStack
- Liaison intelligente de l'adresse du serveur de callback OAuth
- Clarification de la priorité entre `thinkingLevel` et `thinkingBudget`

### v1.2.9-beta.5
**Date de publication** : 16/01/2026

**Modifications** :
- Amélioration de l'encapsulation des outils Gemini, support du format `functionDeclarations`
- Garantie de création correcte des wrappers de fonctions personnalisées dans `normalizeGeminiTools`

### v1.2.9-beta.4
**Date de publication** : 16/01/2026

**Modifications** :
- Encapsulation des outils Gemini au format `functionDeclarations`
- Application de `toGeminiSchema` dans `wrapToolsAsFunctionDeclarations`

### v1.2.9-beta.3
**Date de publication** : 14/01/2026

**Modifications** :
- Mise à jour de la documentation et des commentaires de code, explication de l'implémentation de la stratégie hybride
- Simplification des instructions système antigravity pour les tests

### v1.2.9-beta.2
**Date de publication** : 12/01/2026

**Modifications** :
- Correction de la logique d'analyse du modèle Gemini 3, déduplication du traitement des blocs de réflexion
- Ajout de la vérification du modèle Gemini 3 pour les hachages de réflexion affichés

### v1.2.9-beta.1
**Date de publication** : 08/01/2026

**Modifications** :
- Mise à jour de la version bêta dans les instructions d'installation du plugin
- Amélioration de la gestion des comptes, garantie que l'authentification actuelle est ajoutée aux comptes stockés

### v1.2.9-beta.0
**Date de publication** : 08/01/2026

**Modifications** :
- Mise à jour du README, correction de l'URL du plugin Antigravity
- Mise à jour de l'URL du schéma vers le dépôt NoeFabris

### v1.2.8
**Date de publication** : 08/01/2026

**Modifications importantes** :

**Nouvelles fonctionnalités** :
- Support du modèle Gemini 3
- Déduplication des blocs de réflexion

**Corrections** :
- Correction de la logique d'analyse du modèle Gemini 3
- Traitement des hachages de réflexion affichés dans la conversion des réponses

**Améliorations de la documentation** :
- Mise à jour de la redirection de sortie des scripts de test
- Mise à jour des options de test des modèles

### v1.2.7
**Date de publication** : 01/01/2026

**Modifications importantes** :

**Nouvelles fonctionnalités** :
- Amélioration de la gestion des comptes, garantie que l'authentification actuelle est correctement stockée
- Publication automatique des versions npm via GitHub Actions

**Corrections** :
- Correction de la redirection de sortie dans les scripts de test E2E

**Améliorations de la documentation** :
- Mise à jour de l'URL du dépôt vers NoeFabris

---

## Série v1.2.6 - v1.2.0

### v1.2.6
**Date de publication** : 26/12/2025

**Modifications** :
- Ajout d'un workflow pour la republication automatique des versions npm

### v1.2.5
**Date de publication** : 26/12/2025

**Modifications** :
- Mise à jour de la documentation, correction du numéro de version à 1.2.6

### v1.2.4 - v1.2.0
**Date de publication** : Décembre 2025

**Modifications** :
- Équilibrage de charge multi-comptes
- Système de double quota (Antigravity + Gemini CLI)
- Mécanisme de restauration de session
- Authentification OAuth 2.0 PKCE
- Support des modèles Thinking (Claude et Gemini 3)
- Google Search grounding

---

## Série v1.1.x

### v1.1.0 et versions ultérieures
**Date de publication** : Novembre 2025

**Modifications** :
- Optimisation du flux d'authentification
- Amélioration de la gestion des erreurs
- Ajout d'options de configuration supplémentaires

---

## Série v1.0.x (Versions initiales)

### v1.0.4 - v1.0.0
**Date de publication** : Octobre 2025 et antérieur

**Fonctionnalités initiales** :
- Authentification Google OAuth de base
- Accès à l'API Antigravity
- Support de modèles simple

---

## Guide de mise à niveau

### De v1.2.x vers v1.3.x

**Compatibilité** : Entièrement compatible, aucune modification de configuration requise

**Actions recommandées** :
```bash
# Mettre à jour le plugin
opencode plugin update opencode-antigravity-auth

# Vérifier l'installation
opencode auth status
```

### De v1.1.x vers v1.2.x

**Compatibilité** : Nécessite une mise à jour du format de stockage des comptes

**Actions recommandées** :
```bash
# Sauvegarder les comptes existants
cp ~/.config/opencode/antigravity-accounts.json ~/.config/opencode/antigravity-accounts.json.bak

# Mettre à jour le plugin
opencode plugin update opencode-antigravity-auth@latest

# Se reconnecter (en cas de problème)
opencode auth login
```

### De v1.0.x vers v1.2.x

**Compatibilité** : Format de stockage des comptes incompatible, réauthentification requise

**Actions recommandées** :
```bash
# Mettre à jour le plugin
opencode plugin update opencode-antigravity-auth@latest

# Se reconnecter
opencode auth login

# Ajouter la configuration du modèle selon les exigences de la nouvelle version
```

---

## Notes sur les versions bêta

**Recommandations d'utilisation des versions bêta** :

| Cas d'utilisation | Version recommandée | Description |
| --- | --- | --- |
| Production | Stable (vX.Y.Z) | Entièrement testée, haute stabilité |
| Développement quotidien | Dernière stable | Fonctionnalités complètes, moins de bugs |
| Accès anticipé | Dernière bêta | Accès aux dernières fonctionnalités, peut être instable |

**Installer une version bêta** :

```json
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```

**Passer à la version stable** :

```bash
opencode plugin update opencode-antigravity-auth@latest
```

---

## Explication des numéros de version

Les numéros de version suivent la spécification [Semantic Versioning 2.0.0](https://semver.org/lang/fr/) :

- **Version majeure (X)** : Modifications incompatibles de l'API
- **Version mineure (Y)** : Ajout de fonctionnalités rétrocompatibles
- **Version de correctif (Z)** : Corrections de bugs rétrocompatibles

**Exemples** :
- `1.3.0` → Version majeure 1, version mineure 3, correctif 0
- `1.3.1-beta.3` → 3ème version bêta de 1.3.1

---

## Recevoir les notifications de mise à jour

**Mise à jour automatique** (activée par défaut) :

```json
{
  "auto_update": true
}
```

**Vérifier manuellement les mises à jour** :

```bash
# Voir la version actuelle
opencode plugin list

# Mettre à jour le plugin
opencode plugin update opencode-antigravity-auth
```

---

## Liens de téléchargement

- **NPM (version stable)** : https://www.npmjs.com/package/opencode-antigravity-auth
- **GitHub Releases** : https://github.com/NoeFabris/opencode-antigravity-auth/releases

---

## Contribuer et signaler des problèmes

Si vous rencontrez des problèmes ou avez des suggestions de fonctionnalités :

1. Consultez le [Guide de dépannage](../../faq/common-auth-issues/)
2. Soumettez un problème sur [GitHub Issues](https://github.com/NoeFabris/opencode-antigravity-auth/issues)
3. Utilisez le modèle d'issue approprié (Bug Report / Feature Request)

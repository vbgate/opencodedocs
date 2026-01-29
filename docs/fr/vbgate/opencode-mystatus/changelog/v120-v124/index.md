---
title: "v1.2.0-v1.2.4: Support Copilot | opencode-mystatus"
sidebarTitle: "v1.2.0 - v1.2.4"
subtitle: "v1.2.0 - v1.2.4: Support Copilot et améliorations"
description: "Découvrez les mises à jour v1.2.0-v1.2.4 d'opencode-mystatus: support GitHub Copilot, documentation améliorée et corrections de lint."
tags:
  - "journal des modifications"
  - "v1.2.0"
  - "v1.2.1"
  - "v1.2.2"
  - "Copilot"
order: 1
---

# v1.2.0 - v1.2.4 : ajout du support Copilot et amélioration de la documentation

## Aperçu des versions

Cette mise à jour (v1.2.0 - v1.2.4) apporte des améliorations fonctionnalités importantes à opencode-mystatus, la plus notable étant **l'ajout du support pour l'interrogation de quota GitHub Copilot**. En parallèle, la documentation a été améliorée, les instructions d'installation ont été mises à jour et les erreurs de lint du code ont été corrigées.

**Principaux changements** :
- ✅ Ajout de l'interrogation des Premium Requests GitHub Copilot
- ✅ Intégration de l'API interne GitHub
- ✅ Mise à jour de la documentation en chinois et anglais
- ✅ Amélioration des instructions d'installation, suppression des restrictions de version
- ✅ Correction des erreurs de lint du code

---

## [1.2.2] - 2026-01-14

### Améliorations de la documentation

- **Mise à jour des instructions d'installation** : Suppression des restrictions de version dans `README.md` et `README.zh-CN.md`
- **Prise en charge de la mise à jour automatique** : Les utilisateurs peuvent désormais recevoir automatiquement la dernière version sans avoir à modifier manuellement le numéro de version

**Impact** : Lors de l'installation ou de la mise à niveau du plugin, les utilisateurs n'ont plus besoin de spécifier une version spécifique et peuvent obtenir la dernière version via le tag `@latest`.

---

## [1.2.1] - 2026-01-14

### Corrections de bugs

- **Correction des erreurs de lint** : Suppression de l'importation inutilisée `maskString` dans `copilot.ts`

**Impact** : Amélioration de la qualité du code, réussite des vérifications ESLint, aucun changement fonctionnel.

---

## [1.2.0] - 2026-01-14

### Nouvelles fonctionnalités

#### Support GitHub Copilot

C'est la fonctionnalité principale de cette mise à jour :

- **Ajout de l'interrogation de quota Copilot** : Prend en charge l'interrogation de l'utilisation des Premium Requests GitHub Copilot
- **Intégration de l'API interne GitHub** : Ajout du module `copilot.ts`, obtention des données de quota via l'API GitHub
- **Mise à jour de la documentation** : Ajout de la documentation Copilot dans `README.md` et `README.zh-CN.md`

**Méthodes d'authentification prises en charge** :
1. **Fine-grained PAT** (recommandé) : PAT (Personal Access Token) Fine-grained créé par l'utilisateur
2. **Jeton OAuth** : Jeton OAuth OpenCode (nécessite des autorisations Copilot)

**Contenu de l'interrogation** :
- Total et utilisation des Premium Requests
- Détails d'utilisation par modèle
- Identification du type d'abonnement (free, pro, pro+, business, enterprise)

**Exemple d'utilisation** :

```bash
# Exécuter la commande mystatus
/mystatus

# Vous verrez la section GitHub Copilot dans la sortie
Account:        GitHub Copilot (@username)

  Premium Requests  ██████████░░░░░░░░░░ 75% (75/300)

  Détails d'utilisation du modèle:
    gpt-4o: 150 demandes
    claude-3.5-sonnet: 75 demandes

  Période de facturation: 2026-01
```

---

## Guide de mise à niveau

### Mise à niveau automatique (recommandée)

Puisque v1.2.2 a mis à jour les instructions d'installation et supprimé les restrictions de version, vous pouvez maintenant :

```bash
# Installer avec le tag latest
opencode plugin install vbgate/opencode-mystatus@latest
```

### Mise à niveau manuelle

Si vous avez déjà installé une ancienne version, vous pouvez la mettre à jour directement :

```bash
# Désinstaller l'ancienne version
opencode plugin uninstall vbgate/opencode-mystatus

# Installer la nouvelle version
opencode plugin install vbgate/opencode-mystatus@latest
```

### Configuration de Copilot

Après la mise à niveau, vous pouvez configurer l'interrogation de quota GitHub Copilot :

#### Méthode 1 : Utiliser Fine-grained PAT (recommandé)

1. Créez un Fine-grained Personal Access Token sur GitHub
2. Créez le fichier de configuration `~/.config/opencode/copilot-quota-token.json` :

```json
{
  "token": "ghp_your_fine_grained_pat_here",
  "username": "your-github-username",
  "tier": "pro"
}
```

3. Exécutez `/mystatus` pour interroger le quota

#### Méthode 2 : Utiliser le jeton OAuth OpenCode

Assurez-vous que votre jeton OAuth OpenCode a les autorisations Copilot, exécutez directement `/mystatus`.

::: tip Indice
Pour une configuration détaillée de l'authentification Copilot, consultez le tutoriel [Configuration de l'authentification Copilot](/fr/vbgate/opencode-mystatus/advanced/copilot-auth/).
:::

---

## Problèmes connus

### Problème d'autorisation Copilot

Si votre jeton OAuth OpenCode n'a pas les autorisations Copilot, un message d'invite s'affichera lors de l'interrogation. Solution :

1. Utiliser Fine-grained PAT (recommandé)
2. Réautoriser OpenCode, en vous assurant de cocher les autorisations Copilot

Pour une solution détaillée, consultez le tutoriel [Configuration de l'authentification Copilot](/fr/vbgate/opencode-mystatus/advanced/copilot-auth/).

---

## Plans futurs

Les futures versions pourraient inclure les améliorations suivantes :

- [ ] Prendre en charge davantage de types d'abonnement GitHub Copilot
- [ ] Optimiser le format d'affichage du quota Copilot
- [ ] Ajouter une fonctionnalité d'alerte de quota
- [ ] Prendre en charge davantage de plateformes IA

---

## Documentation connexe

- [Interrogation de quota Copilot](/fr/vbgate/opencode-mystatus/platforms/copilot-usage/)
- [Configuration de l'authentification Copilot](/fr/vbgate/opencode-mystatus/advanced/copilot-auth/)
- [Résolution des problèmes courants](/fr/vbgate/opencode-mystatus/faq/troubleshooting/)

---

## Journal des modifications complet

Pour consulter toutes les modifications de version, visitez les [Releases GitHub](https://github.com/vbgate/opencode-mystatus/releases).

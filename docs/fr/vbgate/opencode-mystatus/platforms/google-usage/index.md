---
title: "Quota Google Cloud : G3 Pro/Image/Flash | opencode-mystatus"
sidebarTitle: "Google Cloud"
subtitle: "Interrogation de quota Google Cloud : G3 Pro/Image/Flash et Claude"
description: "Apprenez à interroger le quota Google Cloud. Affichez le quota restant et l'heure de réinitialisation des modèles G3 Pro, G3 Image, G3 Flash et Claude."
tags:
  - "Google Cloud"
  - "Antigravity"
  - "interrogation de quota"
prerequisite:
  - "start-quick-start"
  - "start-using-mystatus"
order: 4
---

# Interrogation de quota Google Cloud : G3 Pro/Image/Flash et Claude

## Ce que vous apprendrez

- Afficher le quota de 4 modèles de comptes Google Cloud Antigravity
- Comprendre l'heure de réinitialisation et le pourcentage restant de chaque modèle
- Gérer l'utilisation du quota de plusieurs comptes Google Cloud

## Votre problème actuel

Google Cloud Antigravity propose plusieurs modèles (G3 Pro, G3 Image, G3 Flash, Claude), chaque modèle ayant un quota et une heure de réinitialisation indépendants. Vous avez besoin de :
- Connexion séparée à la console Google Cloud pour vérifier l'état de chaque modèle
- Calcul manuel du quota restant et de l'heure de réinitialisation
- Plus de confusion lors de la gestion de plusieurs comptes

## Quand utiliser cette méthode

Lorsque vous :
- Voulez comprendre rapidement le quota restant de tous les modèles Google Cloud
- Besoin de planifier l'allocation de l'utilisation entre différents modèles
- Avez plusieurs comptes Google Cloud nécessitant une gestion unifiée

## 🎒 Avant de commencer

::: warning Vérification préalable

1. **Plugin mystatus installé** : Référence [Démarrage rapide](/fr/vbgate/opencode-mystatus/start/quick-start/)
2. **Authentification Google Cloud configurée** : Nécessite d'abord d'installer le plugin [opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth) pour compléter l'authentification OAuth
3. **Fichier d'authentification existant** : `~/.config/opencode/antigravity-accounts.json` inclut au moins un compte

:::

## Concept clé

Google Cloud Antigravity utilise le mécanisme OAuth pour l'authentification, chaque compte ayant un jeton de rafraîchissement indépendant. Le plugin mystatus :
1. Lit `antigravity-accounts.json` pour obtenir tous les comptes configurés
2. Utilise le jeton de rafraîchissement pour rafraîchir le jeton d'accès
3. Appelle l'API Google Cloud pour obtenir le quota de tous les modèles
4. Affiche le quota et l'heure de réinitialisation des 4 modèles, regroupés par compte

## Modèles Google Cloud pris en charge

mystatus affiche le quota des 4 modèles suivants :

| Nom affiché | Clé de modèle (principale/alternative) | Description |
|--- | --- | ---|
| G3 Pro | `gemini-3-pro-high` / `gemini-3-pro-low` | Version haute performance de Gemini 3 Pro |
| G3 Image | `gemini-3-pro-image` | Génération d'images Gemini 3 Pro |
| G3 Flash | `gemini-3-flash` | Version rapide de Gemini 3 Flash |
| Claude | `claude-opus-4-5-thinking` / `claude-opus-4-5` | Modèle Claude Opus 4.5 |

**Mécanisme de clé principale et alternative** :
- La réponse API peut ne renvoyer que les données de la clé principale ou de la clé alternative
- mystatus essaiera automatiquement d'obtenir le quota de l'une ou l'autre clé
- Par exemple : si `gemini-3-pro-high` n'a pas de données, il essaiera `gemini-3-pro-low`

## Suivez les étapes

### Étape 1 : Exécuter la commande d'interrogation

**Pourquoi**
Obtenir rapidement les informations de quota de tous les comptes Google Cloud

```
/mystatus
```

**Ce que vous devriez voir**

Inclut les informations de quota de toutes les plateformes configurées, dont la partie Google Cloud affichera un contenu similaire à :

```
## Google Cloud Account Quota

### user@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%
```

### Étape 2 : Comprendre le format de sortie

**Pourquoi**
Localiser rapidement les informations clés : quota restant et heure de réinitialisation

Format de chaque ligne :
```
[Nom du modèle] [Heure de réinitialisation] [Barre de progression] [Pourcentage restant]
```

**Description des champs** :
- **Nom du modèle** : G3 Pro, G3 Image, G3 Flash, Claude
- **Heure de réinitialisation** : Temps restant avant la prochaine réinitialisation du quota (comme `4h 59m`, `2d 9h`)
- **Barre de progression** : Affichage visuel du pourcentage restant
- **Pourcentage restant** : Valeur numérique 0-100

**Ce que vous devriez voir**
Chaque modèle sur une ligne, affichant clairement le quota et l'heure de réinitialisation

### Étape 3 : Voir la situation multi-comptes

**Pourquoi**
Si vous avez plusieurs comptes Google Cloud, ils s'afficheront séparément

```
### user@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%

### another@gmail.com

G3 Pro     2h 30m     ████████████░░░░░░░░ 75%
G3 Image   2h 30m     ████████████░░░░░░░░ 75%
```

**Ce que vous devriez voir**
Chaque compte dans un bloc séparé, incluant le quota des 4 modèles de ce compte

### Étape 4 : Vérifier les avertissements de quota

**Pourquoi**
Éviter une interruption de service due au dépassement du quota

Si l'utilisation d'un modèle dépasse 80%, un avertissement s'affichera :

```
### user@gmail.com

G3 Pro     1h 30m     ████░░░░░░░░░░░░░░░ 20%
G3 Image   1h 30m     ████░░░░░░░░░░░░░░░ 20%

⚠️ Utilisation atteinte ou dépassée 80%
```

**Ce que vous devriez voir**
L'avertissement s'affiche sous la liste des modèles du compte correspondant

## Point de vérification ✅

Effectuez les vérifications suivantes pour confirmer que vous avez bien suivi les étapes :

- [ ] Après avoir exécuté `/mystatus`, vous pouvez voir les informations de quota Google Cloud
- [ ] Vous comprenez les noms et heures de réinitialisation des 4 modèles
- [ ] Vous pouvez identifier la barre de progression et le pourcentage restant
- [ ] Si vous avez plusieurs comptes, vous pouvez voir le quota de tous les comptes

## Pièges courants

### Problème 1 : Impossible de voir le quota Google Cloud

**Causes possibles** :
- Le plugin opencode-antigravity-auth n'est pas installé
- L'authentification Google OAuth n'est pas terminée
- Le fichier `antigravity-accounts.json` n'existe pas ou est vide

**Solution** :
1. Installez le plugin opencode-antigravity-auth
2. Complétez l'authentification selon les instructions du dépôt GitHub
3. Réexécutez `/mystatus`

### Problème 2 : Un compte affiche une erreur

**Causes possibles** :
- Le jeton de rafraîchissement a expiré
- Le projectId est manquant

**Exemple d'erreur** :
```
user@gmail.com: No project ID found
```

**Solution** :
1. Réauthentifiez ce compte en utilisant le plugin opencode-antigravity-auth
2. Assurez-vous que l'ID de projet est correctement défini lors de l'authentification

### Problème 3 : Un modèle affiche "-" ou l'heure de réinitialisation est anormale

**Causes possibles** :
- Le champ resetTime renvoyé par l'API est manquant ou a un format anormal
- Ce modèle n'a temporairement pas d'informations de quota

**Solution** :
- C'est normal, mystatus affichera "-" indiquant que les données ne sont pas disponibles
- Si tous les modèles affichent "-", vérifiez la connexion réseau ou l'état de l'API Google Cloud

## Résumé de cette leçon

- Google Cloud Antigravity prend en charge 4 modèles : G3 Pro, G3 Image, G3 Flash, Claude
- Chaque modèle a un quota et une heure de réinitialisation indépendants
- Prend en charge la gestion multi-comptes, chaque compte s'affiche séparément
- Un avertissement s'affiche lorsque l'utilisation dépasse 80%

## Prochaine leçon

> La prochaine leçon nous apprendrons **[Configuration avancée Google Cloud : gestion multi-comptes et de modèles](../../advanced/google-setup/)**.
>
> Vous apprendrez :
> - Comment ajouter et gérer plusieurs comptes Google Cloud
> - Comprendre la relation de mappage des 4 modèles
> - Différence entre projectId et managedProjectId

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour afficher l'emplacement du code source</strong></summary>

> Date de mise à jour :2026-01-23

| Fonction          | Chemin du fichier                                                                                                                  | Ligne    |
|--- | --- | ---|
| Configuration des modèles      | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L69-L78)                    | 69-78   |
| Logique d'interrogation de comptes  | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L304-L370)                   | 304-370 |
| Rafraîchissement de jeton    | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L162-L184)                   | 162-184 |
| Extraction de quota      | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L132-L157)                   | 132-157 |
| Formatage de sortie    | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L265-L294)                   | 265-294 |
| Définition de type      | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L78-L94)                      | 78-94   |

**Constantes clés** :
- `GOOGLE_QUOTA_API_URL = "https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels"` : API d'interrogation de quota Google Cloud
- `GOOGLE_TOKEN_REFRESH_URL = "https://oauth2.googleapis.com/token"` : API de rafraîchissement du jeton OAuth
- `USER_AGENT = "antigravity/1.11.9 windows/amd64"` : User-Agent de demande API

**Fonctions clés** :
- `queryGoogleUsage()` : Interroge le quota de tous les comptes Antigravity
- `fetchAccountQuota()` : Interroge le quota d'un seul compte
- `extractModelQuotas()` : Extrait le quota des 4 modèles à partir de la réponse API
- `formatAccountQuota()` : Formate l'affichage du quota d'un seul compte

**Règles de mappage des modèles** :
- G3 Pro prend en charge `gemini-3-pro-high` et `gemini-3-pro-low`, priorité à la clé principale
- Claude prend en charge `claude-opus-4-5-thinking` et `claude-opus-4-5`, priorité à la clé principale
- G3 Image et G3 Flash n'ont qu'une seule clé

</details>

---
title: "Utilisation mystatus : commandes slash | opencode-mystatus"
sidebarTitle: "Utilisation"
subtitle: "Utiliser mystatus : commandes slash et langage naturel"
description: "Apprenez à utiliser mystatus avec les commandes slash et le langage naturel pour consulter rapidement les quotas de vos plateformes IA."
tags:
  - "Démarrage rapide"
  - "Commande slash"
  - "Langage naturel"
prerequisite:
  - "start-quick-start"
order: 2
---

# Utiliser mystatus : commandes slash et langage naturel

## Ce que vous saurez faire à la fin

- Utiliser la commande slash `/mystatus` pour consulter en un clic les quotas de toutes les plateformes IA
- Poser des questions en langage naturel pour qu'OpenCode appelle automatiquement l'outil mystatus
- Comprendre les différences et scénarios d'utilisation des deux méthodes de déclenchement

## Votre situation actuelle

Vous utilisez plusieurs plateformes IA pour le développement (OpenAI, Zhipu AI, GitHub Copilot, etc.) et voulez savoir combien de quota reste sur chaque plateforme, mais ne souhaitez pas vous connecter individuellement à chaque plateforme - c'est trop fastidieux.

## Quand utiliser cette méthode

- **Lorsque vous devez consulter rapidement les quotas de toutes les plateformes** : Vérifiez avant chaque journée de développement pour planifier raisonnablement l'utilisation
- **Lorsque vous voulez connaître le quota spécifique d'une plateforme** : Par exemple, pour confirmer si OpenAI est presque épuisé
- **Pour vérifier que la configuration fonctionne** : Après avoir configuré un nouveau compte, vérifiez que la consultation fonctionne normalement

::: info Vérification préalable

Ce tutoriel suppose que vous avez déjà [installé le plugin opencode-mystatus](/fr/vbgate/opencode-mystatus/start/quick-start/). Si ce n'est pas encore le cas, veuillez d'abord compléter les étapes d'installation.

:::

## Approche principale

opencode-mystatus offre deux méthodes pour déclencher l'outil mystatus :

1. **Commande slash `/mystatus`** : Rapide, directe, sans ambiguïté, adaptée aux consultations fréquentes
2. **Questions en langage naturel** : Plus flexible, adaptée aux consultations dans des scénarios spécifiques

Les deux méthodes appellent le même outil `mystatus`, qui interroge en parallèle les quotas de toutes les plateformes IA configurées et renvoie des résultats avec barres de progression, statistiques d'utilisation et compteurs à rebours de réinitialisation.

## Suivez les étapes

### Étape 1 : Utiliser la commande slash pour consulter les quotas

Dans OpenCode, entrez la commande suivante :

```bash
/mystatus
```

**Pourquoi**
La commande slash est le mécanisme de commande rapide d'OpenCode, permettant d'appeler rapidement des outils prédéfinis. La commande `/mystatus` appelle directement l'outil mystatus sans paramètres supplémentaires.

**Ce que vous devriez voir** :
OpenCode renverra les informations de quota de toutes les plateformes configurées, avec le format suivant :

```
## OpenAI 账号额度

Account:        user@example.com (team)

3小时限额
███████████████████████████ 剩余 85%
重置: 2h 30m后

## 智谱 AI 账号额度

Account:        9c89****AQVM (Coding Plan)

5小时 token 限额
███████████████████████████ 剩余 95%
已用: 0.5M / 10.0M
重置: 4h后
```

Chaque plateforme affichera :
- Informations du compte (email ou clé API masquée)
- Barre de progression (affichage visuel du quota restant)
- Compteur à rebours de réinitialisation
- Utilisation et quota total (certaines plateformes)

### Étape 2 : Poser des questions en langage naturel

En plus de la commande slash, vous pouvez également poser des questions en langage naturel, et OpenCode reconnaîtra automatiquement votre intention et appellera l'outil mystatus.

Essayez ces méthodes de question :

```bash
Check my OpenAI quota
```

Ou

```bash
How much Codex quota do I have left?
```

Ou

```bash
Show my AI account status
```

**Pourquoi**
Les questions en langage naturel correspondent davantage aux habitudes de conversation quotidienne, adaptées aux questions dans des scénarios de développement spécifiques. OpenCode reconnaîtra par correspondance sémantique que vous voulez consulter le quota et appellera automatiquement l'outil mystatus.

**Ce que vous devriez voir** :
Le même résultat que la commande slash, seule la méthode de déclenchement est différente.

### Étape 3 : Comprendre la configuration de la commande slash

Comment fonctionne la commande slash `/mystatus` ? Elle est définie dans le fichier de configuration d'OpenCode.

Ouvrez `~/.config/opencode/opencode.json`, trouvez la section `command` :

```json
{
  "plugin": ["opencode-mystatus"],
  "command": {
    "mystatus": {
      "description": "Query quota usage for all AI accounts",
      "template": "Use mystatus tool to query quota usage. Return the result as-is without modification."
    }
  }
}
```

**Explication des éléments de configuration** :

| Élément | Valeur | Rôle |
|--- | --- | ---|
| `description` | "Query quota usage for all AI accounts" | Description affichée dans la liste des commandes |
| `template` | "Use to mystatus tool..." | Indique à OpenCode comment traiter cette commande |

**Pourquoi le template est nécessaire**
Le template est une "instruction" pour OpenCode, lui disant : lorsque l'utilisateur entre `/mystatus`, appeler l'outil mystatus et renvoyer le résultat tel quel (sans aucune modification).

## Point de contrôle ✅

Confirmez que vous maîtrisez les deux méthodes d'utilisation :

| Compétence | Méthode de vérification | Résultat attendu |
|--- | --- | ---|
| Consultation par commande slash | Entrer `/mystatus` | Affichage des informations de quota de toutes les plateformes |
| Consultation en langage naturel | Entrer "Check my OpenAI quota" | Affichage des informations de quota |
| Comprendre la configuration | Vérifier opencode.json | Trouver la configuration de la commande mystatus |

## Pièges à éviter

### Erreur courante 1 : Commande slash sans réponse

**Symptôme** : Après avoir entré `/mystatus`, aucune réaction

**Cause** : Le fichier de configuration d'OpenCode n'a pas configuré correctement la commande slash

**Solution** :
1. Ouvrez `~/.config/opencode/opencode.json`
2. Confirmez que la section `command` contient la configuration `mystatus` (voir étape 3)
3. Redémarrez OpenCode

### Erreur courante 2 : Les questions en langage naturel n'appellent pas l'outil mystatus

**Symptôme** : Après avoir entré "Check my OpenAI quota", OpenCode n'appelle pas l'outil mystatus, mais essaie de répondre lui-même

**Cause** : OpenCode n'a pas reconnu correctement votre intention

**Solution** :
1. Essayez une expression plus claire : "Use mystatus tool to check my OpenAI quota"
2. Ou utilisez directement la commande slash `/mystatus`, plus fiable

### Erreur courante 3 : Affichage "Aucun compte configuré trouvé"

**Symptôme** : Après l'exécution de `/mystatus`, affichage "Aucun compte configuré trouvé"

**Cause** : Vous n'avez pas encore configuré les informations d'authentification d'aucune plateforme

**Solution** :
- Configurez au moins les informations d'authentification d'une plateforme (OpenAI, Zhipu AI, Z.ai, GitHub Copilot ou Google Cloud)
- Voir les instructions de configuration dans [le tutoriel de démarrage rapide](/fr/vbgate/opencode-mystatus/start/quick-start/)

## Résumé de la leçon

L'outil mystatus propose deux méthodes d'utilisation :
1. **Commande slash `/mystatus`** : Rapide et directe, adaptée aux consultations fréquentes
2. **Questions en langage naturel** : Plus flexible, adaptée aux scénarios spécifiques

Les deux méthodes interrogent en parallèle les quotas de toutes les plateformes IA configurées et renvoient des résultats avec barres de progression et compteurs à rebours. La configuration de la commande slash est définie dans `~/.config/opencode/opencode.json`, indiquant à OpenCode comment appeler l'outil mystatus via le template.

## Prochaine leçon

> La prochaine leçon couvre **[Comprendre la sortie : barres de progression, temps de réinitialisation et multi-comptes](/fr/vbgate/opencode-mystatus/start/understanding-output/)**.
>
> Vous apprendrez :
> - Comment interpréter la signification des barres de progression
> - Comment les compteurs à rebours de réinitialisation sont calculés
> - Le format de sortie dans les scénarios multi-comptes
> - Principes de génération des barres de progression

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer l'emplacement du code source</strong></summary>

> Date de mise à jour :2026-01-23

| Fonction | Chemin du fichier | Ligne |
|--- | --- | ---|
| Définition de l'outil mystatus | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 29-33 |
| Description de l'outil | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 30-31 |
| Configuration de la commande slash | [`command/mystatus.md`](https://github.com/vbgate/opencode-mystatus/blob/main/command/mystatus.md) | 1-6 |
| Requête parallèle de toutes les plateformes | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 49-56 |
| Collecte et synthèse des résultats | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 58-89 |

**Constantes clés** :
Aucune (cette section présente principalement les méthodes d'appel, n'implique pas de constantes spécifiques)

**Fonctions clés** :
- `mystatus()` : Fonction principale de l'outil mystatus, lit le fichier d'authentification et interroge en parallèle toutes les plateformes (`plugin/mystatus.ts:29-33`)
- `collectResult()` : Collecte les résultats de requête dans les tableaux results et errors (`plugin/mystatus.ts:100-116`)

</details>

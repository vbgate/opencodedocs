---
title: "Démarrage rapide : Installation | opencode-supermemory"
sidebarTitle: "Démarrage rapide"
subtitle: "Démarrage rapide : Installation et configuration"
description: "Apprenez à installer le plugin opencode-supermemory et configurer la clé API. En 5 minutes, donnez à votre Agent une mémoire persistante cross-session."
tags:
  - "Installation"
  - "Configuration"
  - "Prise en main"
prerequisite:
  - ""
order: 1
---

# Démarrage rapide : Installation et configuration

## Ce que vous pourrez faire après ce cours

Dans ce cours, vous apprendrez à :
1. Installer le plugin **opencode-supermemory** dans votre environnement OpenCode.
2. Configurer la clé API Supermemory pour connecter à la banque de mémoire cloud.
3. Vérifier que le plugin est chargé avec succès.
4. Résoudre les conflits potentiels avec d'autres plugins (comme Oh My OpenCode).

Une fois terminé, votre Agent aura la capacité de se connecter à la banque de mémoire cloud.

## Votre situation actuelle

Vous avez peut-être remarqué que l'Agent OpenCode est intelligent mais oublie facilement :
- Chaque fois que vous commencez une nouvelle session, il semble avoir oublié vos préférences précédentes.
- Les normes d'architecture que vous lui avez enseignées dans le projet A sont oubliées dans le projet B.
- Au cours de longues conversations, les informations clés du début sont "évincées" du contexte.

Vous avez besoin d'un cerveau externe pour aider l'Agent à se souvenir de ces choses.

## Quand utiliser cette approche

- **Première utilisation** : Lorsque vous découvrez opencode-supermemory pour la première fois.
- **Réinstallation** : Lorsque vous migrez vers un nouvel ordinateur ou réinitialisez votre configuration OpenCode.
- **Résolution de problèmes** : Lorsque vous soupçonnez que le plugin n'est pas installé correctement ou qu'il y a un problème de connexion API.

---

## 🎒 Préparation avant de commencer

Avant de commencer, assurez-vous d'avoir :

1. **Installé OpenCode** : Assurez-vous que la commande `opencode` est disponible dans le terminal.
2. **Obtenu une clé API** :
    - Visitez [Supermemory Console](https://console.supermemory.ai)
    - Connectez-vous/créez un compte
    - Créez une nouvelle clé API (commençant par `sm_`)

::: info Qu'est-ce que Supermemory ?
Supermemory est une couche de mémoire cloud conçue spécifiquement pour les agents IA. Elle permet non seulement de stocker des données, mais aussi d'aider l'Agent à se souvenir des bonnes choses au bon moment grâce à la recherche sémantique.
:::

---

## Idée principale

Le processus d'installation est très simple, en trois étapes essentiellement :

1. **Installer le plugin** : Exécutez le script d'installation pour enregistrer le plugin dans OpenCode.
2. **Configurer la clé** : Dites au plugin quelle est votre clé API.
3. **Vérifier la connexion** : Redémarrez OpenCode et confirmez que l'Agent peut voir les nouveaux outils.

---

## Suivez-moi

### Étape 1 : Installer le plugin

Nous proposons deux méthodes d'installation, choisissez celle qui vous convient.

::: code-group

```bash [Humain (installation interactive)]
# Recommandé : vous guidera de manière interactive et traitera automatiquement la configuration
bunx opencode-supermemory@latest install
```

```bash [Agent (installation automatique)]
# Si vous laissez un Agent vous aider à installer, utilisez cette commande (saute les confirmations interactives et résout automatiquement les conflits)
bunx opencode-supermemory@latest install --no-tui --disable-context-recovery
```

:::

**Ce que vous devriez voir** :
La sortie du terminal affiche `✓ Setup complete!`, indiquant que le plugin a été enregistré avec succès dans `~/.config/opencode/opencode.jsonc`.

### Étape 2 : Configurer la clé API

Le plugin a besoin d'une clé API pour lire et écrire votre mémoire cloud. Vous avez deux méthodes de configuration :

#### Méthode A : Variable d'environnement (recommandée)

Ajoutez directement dans votre fichier de configuration Shell (comme `.zshrc` ou `.bashrc`) :

```bash
export SUPERMEMORY_API_KEY="sm_votre_clé..."
```

#### Méthode B : Fichier de configuration

Ou bien, créez un fichier de configuration dédié `~/.config/opencode/supermemory.jsonc` :

```json
{
  "apiKey": "sm_votre_clé..."
}
```

**Pourquoi** : La variable d'environnement est plus sûre et ne sera pas accidentellement soumise au dépôt de code ; le fichier de configuration est plus pratique pour gérer plusieurs paramètres.

### Étape 3 : Résoudre les conflits (si vous utilisez Oh My OpenCode)

Si vous avez installé [Oh My OpenCode](https://github.com/code-yeongyu/oh-my-opencode), sa fonction de gestion de contexte intégrée pourrait entrer en conflit avec Supermemory.

**Méthode de vérification** :
Le script d'installation détecte généralement automatiquement et vous invite à désactiver les hooks en conflit. Sinon, vérifiez manuellement `~/.config/opencode/oh-my-opencode.json` :

```json
{
  "disabled_hooks": [
    "anthropic-context-window-limit-recovery"  // ✅ Assurez-vous que cette ligne est présente
  ]
}
```

**Pourquoi** : Supermemory fournit un "compactage préemptif" (Preemptive Compaction) plus intelligent. Si deux plugins essaient simultanément de gérer le contexte, cela entraînera de la confusion.

### Étape 4 : Vérifier l'installation

Redémarrez OpenCode, puis exécutez la commande de vérification :

```bash
opencode -c
```

Ou entrez directement en mode interactif OpenCode et consultez la liste des outils.

**Ce que vous devriez voir** :
Dans la liste des outils (Tools), l'outil `supermemory` apparaît.

```
Available Tools:
- supermemory (add, search, profile, list, forget)
...
```

---

## Point de contrôle ✅

Vérifiez les éléments suivants pour vous assurer que tout est prêt :

- [ ] Exécutez `cat ~/.config/opencode/opencode.jsonc`, vous devriez voir `"opencode-supermemory"` dans la liste `plugin`.
- [ ] La variable d'environnement `SUPERMEMORY_API_KEY` est active (vérifiez avec `echo $SUPERMEMORY_API_KEY`).
- [ ] Après avoir exécuté `opencode`, l'Agent n'affiche aucune erreur.

---

## Pièges courants

::: warning Erreur courante : La clé API n'a pas pris effet
Si vous avez défini une variable d'environnement mais que le plugin indique qu'il n'est pas authentifié, vérifiez :
1. Avez-vous redémarré le terminal ? (Après avoir modifié `.zshrc`, vous devez faire `source ~/.zshrc` ou redémarrer)
2. Avez-vous redémarré OpenCode ? (Le processus OpenCode doit redémarrer pour lire les nouvelles variables)
:::

::: warning Erreur courante : Erreur de format JSON
Si vous modifiez manuellement `opencode.jsonc`, assurez-vous que le format JSON est correct (surtout les virgules). Le script d'installation gère cela automatiquement, mais les modifications manuelles sont sujettes aux erreurs.
:::

---

## Résumé du cours

Félicitations ! Vous avez équipé OpenCode d'un "hippocampe". Maintenant, votre Agent est prêt à commencer à mémoriser.

- Nous avons installé le plugin `opencode-supermemory`.
- Nous avons configuré les identifiants de connexion cloud.
- Nous avons résolu les conflits potentiels de plugins.

## Aperçu du prochain cours

> Le prochain cours est **[Initialisation du projet : Créer une première impression](../initialization/index.md)**.
>
> Vous apprendrez :
> - Comment faire en sorte que l'Agent analyse en profondeur tout le projet avec une seule commande.
> - Comment faire en sorte que l'Agent mémorise l'architecture, la pile technologique et les règles implicites du projet.
> - Comment voir ce que l'Agent a mémorisé.

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Logique du script d'installation | [`src/cli.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/cli.ts#L327-L410) | 327-410 |
| Logique d'enregistrement du plugin | [`src/cli.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/cli.ts#L195-L248) | 195-248 |
| Logique de détection des conflits | [`src/cli.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/cli.ts#L273-L320) | 273-320 |
| Chargement du fichier de configuration | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts) | - |

</details>

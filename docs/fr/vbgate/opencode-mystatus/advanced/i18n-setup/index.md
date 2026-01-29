---
title: "Multilingue : détection automatique de langue | opencode-mystatus"
sidebarTitle: "Multilingue"
subtitle: "Support multilingue : basculement automatique entre le chinois et l'anglais"
description: "Découvrez le support multilingue d'opencode-mystatus. Apprenez la détection de langue via l'API Intl et les variables d'environnement, et comment basculer entre chinois et anglais."
tags:
  - "i18n"
  - "internationalisation"
  - "détection de langue"
  - "multilingue"
prerequisite:
  - "start-quick-start"
order: 3
---

# Support multilingue : basculement automatique entre le chinois et l'anglais

## Ce que vous apprendrez

- Comprendre comment mystatus détecte automatiquement la langue du système
- Savoir comment changer la langue du système pour modifier la langue de sortie
- Comprendre la priorité et le mécanisme de repli de la détection de langue
- Maîtriser le fonctionnement de l'API Intl et des variables d'environnement

## Votre problème actuel

Vous avez peut-être remarqué que le **support multilingue** de mystatus est parfois en chinois, parfois en anglais :

```
# Sortie en chinois
3小时限额
████████████████████████████ 剩余 85%
重置: 2小时30分钟后

# Sortie en anglais
3-hour limit
████████████████████████████ 85% remaining
Resets in: 2h 30m
```

Mais vous ne savez pas :
- Comment le plugin sait-il quelle langue utiliser ?
- Peut-on basculer manuellement vers le chinois ou l'anglais ?
- Que faire si la détection est incorrecte ?

Cette leçon vous aidera à comprendre le mécanisme de détection de langue.

## Concept clé

Le **support multilingue** choisit automatiquement la sortie en chinois ou en anglais en fonction de la langue du système, sans configuration manuelle. La priorité de détection est : API Intl → Variables d'environnement → Anglais par défaut.

**Priorité de détection** (de la plus haute à la plus basse) :

1. **API Intl** (recommandée) → `Intl.DateTimeFormat().resolvedOptions().locale`
2. **Variable d'environnement** (repli) → `LANG`, `LC_ALL`, `LANGUAGE`
3. **Anglais par défaut** (repli ultime) → `"en"`

::: tip Pourquoi aucune configuration manuelle n'est-elle nécessaire ?
Parce que la détection de langue est basée sur l'environnement système, le plugin identifie automatiquement au démarrage, l'utilisateur n'a pas besoin de modifier de fichier de configuration.
:::

**Langues prises en charge** :
| Langue | Code | Condition de détection |
| ------ | ---- | ---------------------- |
| Chinois | `zh` | La locale commence par `zh` (comme `zh-CN`, `zh-TW`) |
| Anglais | `en` | Autres cas |

**Contenu de la traduction** :
- Unités de temps (jours, heures, minutes)
- Limites liées (pourcentage restant, temps de réinitialisation)
- Messages d'erreur (échec d'authentification, erreur API, délai d'attente)
- Titres de plateformes (OpenAI, Zhipu AI, Z.ai, Google Cloud, GitHub Copilot)

## Suivez les étapes

### Étape 1 : Vérifier la langue actuelle du système

Tout d'abord, confirmez vos paramètres de langue système :

::: code-group

```bash [macOS/Linux]
echo $LANG
```

```powershell [Windows]
Get-ChildItem Env:LANG
```

:::

**Ce que vous devriez voir** :

- Système chinois : `zh_CN.UTF-8`, `zh_TW.UTF-8` ou similaire
- Système anglais : `en_US.UTF-8`, `en_GB.UTF-8` ou similaire

### Étape 2 : Tester la détection de langue

Exécutez la commande `/mystatus` et observez la langue de sortie :

```
/mystatus
```

**Ce que vous devriez voir** :

- Si la langue du système est le chinois → La sortie est en chinois (comme `3小时限额`, `重置: 2小时30分钟后`)
- Si la langue du système est l'anglais → La sortie est en anglais (comme `3-hour limit`, `Resets in: 2h 30m`)

### Étape 3 : Basculer temporairement la langue du système (pour test)

Si vous souhaitez tester l'effet de sortie dans différentes langues, vous pouvez modifier temporairement les variables d'environnement :

::: code-group

```bash [macOS/Linux (basculement temporaire vers l'anglais)]
LANG=en_US.UTF-8 /mystatus
```

```powershell [Windows (basculement temporaire vers l'anglais)]
$env:LANG="en_US.UTF-8"; /mystatus
```

:::

**Ce que vous devriez voir** :

Même si votre système est en chinois, la sortie deviendra au format anglais.

::: warning
Ceci est uniquement un test temporaire, cela ne changera pas définitivement la langue du système. Après la fermeture du terminal, les paramètres originaux sont restaurés.
:::

### Étape 4 : Comprendre le mécanisme de détection de l'API Intl

L'API Intl est une interface standard d'internationalisation fournie par les navigateurs et Node.js. Le plugin utilisera en priorité cette API pour détecter la langue :

**Code de détection** (version simplifiée) :

```javascript
// 1. Priorité à l'API Intl
const intlLocale = Intl.DateTimeFormat().resolvedOptions().locale;
if (intlLocale.startsWith("zh")) {
  return "zh";  // Chinois
}

// 2. Repli vers les variables d'environnement
const lang = process.env.LANG || process.env.LC_ALL || "";
if (lang.startsWith("zh")) {
  return "zh";
}

// 3. Anglais par défaut
return "en";
```

**Avantages de l'API Intl** :
- Plus fiable, basée sur les paramètres réels du système
- Prend en charge les navigateurs et les environnements Node.js
- Fournit des informations de locale complètes (comme `zh-CN`, `en-US`)

**Variables d'environnement comme repli** :
- Compatible avec les environnements ne prenant pas en charge l'API Intl
- Fournit un moyen de contrôler manuellement la langue (en modifiant les variables d'environnement)

### Étape 5 : Basculer définitivement la langue du système (si nécessaire)

Si vous souhaitez que mystatus utilise toujours une certaine langue, vous pouvez modifier les paramètres de langue système :

::: info
Modifier la langue du système affectera toutes les applications, pas seulement mystatus.
:::

**macOS** :
1. Ouvrez « Paramètres système » → « Général » → « Langue et région »
2. Ajoutez la langue souhaitée et faites-la glisser tout en haut
3. Redémarrez OpenCode

**Linux** :
```bash
# Modifier ~/.bashrc ou ~/.zshrc
export LANG=zh_CN.UTF-8

# Recharger la configuration
source ~/.bashrc
```

**Windows** :
1. Ouvrez « Paramètres » → « Heure et langue » → « Langue et région »
2. Ajoutez la langue souhaitée et définissez-la par défaut
3. Redémarrez OpenCode

## Point de vérification ✅

Vérifiez que la détection de langue est correcte :

| Élément de test | Action | Résultat attendu |
| ---------------- | ------ | ---------------- |
| Système chinois | Exécutez `/mystatus` | La sortie est en chinois (comme `3小时限额`) |
| Système anglais | Exécutez `/mystatus` | La sortie est en anglais (comme `3-hour limit`) |
| Basculement temporaire | Exécutez la commande après modification de la variable `LANG` | La langue de sortie change en conséquence |

## Pièges courants

### Questions courantes

| Question | Cause | Solution |
| ------- | ----- | -------- |
| La langue de sortie ne correspond pas aux attentes | Paramètres de langue système incorrects | Vérifiez la variable d'environnement `LANG` ou les paramètres de langue système |
| L'API Intl n'est pas disponible | Version Node.js trop ancienne ou environnement non pris en charge | Le plugin repliera automatiquement sur la détection de variable d'environnement |
| Système chinois affiche en anglais | La variable d'environnement `LANG` n'est pas définie sur `zh_*` | Définissez la bonne valeur `LANG` (comme `zh_CN.UTF-8`) |

### Explication de la logique de détection

**Quand utiliser l'API Intl** :
- Node.js ≥ 0.12 (prend en charge l'API Intl)
- Environnement navigateur (tous les navigateurs modernes)

**Quand replier vers les variables d'environnement** :
- L'API Intl lève une exception
- L'environnement ne prend pas en charge l'API Intl

**Quand utiliser l'anglais par défaut** :
- La variable d'environnement n'est pas définie
- La variable d'environnement ne commence pas par `zh`

::: tip
Le plugin détecte la langue **une seule fois** lors du chargement du module. Après avoir modifié la langue du système, vous devez redémarrer OpenCode pour que cela prenne effet.
:::

## Résumé de cette leçon

- **Détection automatique** : mystatus détecte automatiquement la langue du système, sans configuration manuelle
- **Priorité de détection** : API Intl → Variables d'environnement → Anglais par défaut
- **Langues prises en charge** : Chinois (zh) et Anglais (en)
- **Couverture de la traduction** : Unités de temps, limites liées, messages d'erreur, titres de plateformes
- **Changer de langue** : Modifiez les paramètres de langue système, redémarrez OpenCode

## Prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[Questions fréquentes : impossibilité d'interroger le quota, jeton expiré, problèmes d'autorisation](../../faq/troubleshooting/)**.
>
> Vous apprendrez :
> - Comment résoudre les problèmes de lecture de fichiers d'authentification
> - Solutions lorsque le jeton expire
> - Recommandations de configuration en cas d'autorisation insuffisante

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour afficher l'emplacement du code source</strong></summary>

> Date de mise à jour : 2026-01-23

| Fonction | Chemin du fichier | Ligne |
| --- | --- | --- |
| Fonction de détection de langue | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L24-L40) | 24-40 |
| Définition de la traduction chinoise | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L46-L124) | 46-124 |
| Définition de la traduction anglaise | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L125-L203) | 125-203 |
| Export de la langue actuelle | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L210) | 210 |
| Export de la fonction de traduction | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L213) | 213 |

**Fonctions clés** :
- `detectLanguage()`: Détecte la langue du système utilisateur, priorité à l'API Intl, repli vers les variables d'environnement, anglais par défaut
- `currentLang`: Langue actuelle (détectée une fois au chargement du module)
- `t`: Fonction de traduction, renvoie le contenu de traduction correspondant selon la langue actuelle

**Constantes clés** :
- `translations`: Dictionnaire de traduction, contient deux paquets de langue `zh` et `en`
- Types de traduction pris en charge : unités de temps (days, hours, minutes), limites liées (hourLimit, dayLimit, remaining, resetIn), messages d'erreur (authError, apiError, timeoutError), titres de plateformes (openaiTitle, zhipuTitle, googleTitle, copilotTitle)

**Logique de détection** :
1. Priorité à l'utilisation de `Intl.DateTimeFormat().resolvedOptions().locale` pour détecter la langue
2. Si l'API Intl n'est pas disponible, repli vers les variables d'environnement `LANG`, `LC_ALL`, `LANGUAGE`
3. Si les variables d'environnement n'existent pas non plus ou ne commencent pas par `zh`, anglais par défaut

</details>

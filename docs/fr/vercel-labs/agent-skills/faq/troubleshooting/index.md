---
title: "Dépannage : résoudre les erreurs courantes | Agent Skills"
sidebarTitle: "Dépannage"
subtitle: "Dépannage des problèmes courants"
description: "Résoudre les erreurs réseau, les compétences non activées et les échecs de validation d'Agent Skills. Guide de diagnostic rapide et étapes de correction efficaces."
tags:
  - "FAQ"
  - "Dépannage"
  - "Débogage"
  - "Configuration réseau"
prerequisite:
  - "start-getting-started"
  - "start-installation"
---

# Dépannage des problèmes courants

## Ce que vous pourrez faire après ce cours

- Diagnostiquer rapidement et résoudre les erreurs réseau lors du déploiement
- Réparer les problèmes de compétences non activées
- Gérer les erreurs d'échec de validation de règles
- Identifier les causes de détection inexacte de frameworks

## Problèmes de déploiement

### Erreur de sortie réseau (Network Egress Error）

**Problème** : lors du déploiement vers Vercel, une erreur réseau apparaît, indiquant l'impossibilité d'accéder au réseau externe.

**Cause** : dans l'environnement claude.ai, l'accès au réseau est limité par défaut. La compétence `vercel-deploy-claimable` nécessite d'accéder au domaine `*.vercel.com` pour téléverser les fichiers.

**Solution** :

::: tip Configuration des autorisations réseau dans claude.ai

1. Visiter [https://claude.ai/settings/capabilities](https://claude.ai/settings/capabilities)
2. Dans « Allowed Domains », ajouter `*.vercel.com`
3. Enregistrer les paramètres et redéployer

:::

**Méthode de vérification** :

```bash
# Tester la connexion réseau (sans exécuter le déploiement)
curl -I https://claude-skills-deploy.vercel.com/api/deploy
```

**Vous devriez voir** :
```bash
HTTP/2 200
```

### Échec du déploiement : impossible d'extraire l'URL de prévisualisation

**Problème** : le script de déploiement se termine, mais signale « Error: Could not extract preview URL from response ».

**Cause** : l'API de déploiement a renvoyé une réponse d'erreur (contenant le champ `"error"`), mais le script a d'abord vérifié l'échec de l'extraction d'URL.

Selon le code source [`deploy.sh:224-229`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh#L224-L229) :

```bash
# Check for error in response
if echo "$RESPONSE" | grep -q '"error"'; then
    ERROR_MSG=$(echo "$RESPONSE" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)
    echo "Error: $ERROR_MSG" >&2
    exit 1
fi
```

**Solution** :

1. Voir la réponse d'erreur complète :
```bash
# Exécuter à nouveau le déploiement dans le répertoire racine du projet, en remarquant les messages d'erreur
bash skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh .
```

2. Types d'erreurs courants :

| Message d'erreur | Cause possible | Solution |
| -------- | -------- | -------- |
| "File too large" | Volume du projet dépassant la limite | Exclure les fichiers inutiles (comme `*.log`, `*.test.ts`) |
| "Invalid framework" | Échec de la reconnaissance de framework | Ajouter `package.json` ou spécifier manuellement le framework |
| "Network timeout" | Délai d'attente réseau | Vérifier la connexion réseau, réessayer le déploiement |

---

## Problèmes d'activation des compétences

### Compétence non activée

**Problème** : dans Claude, en utilisant des invites pertinentes (comme « Deploy my app »), la compétence n'est pas activée.

**Cause** : l'activation des compétences dépend de la correspondance des mots-clés dans l'invite. Si les mots-clés ne sont pas clairs ou si la compétence n'est pas correctement chargée, l'IA ne peut pas identifier quelle compétence utiliser.

**Solution** :

::: warning Liste de contrôle

1. **Vérifier que la compétence est installée** :
   ```bash
   # Utilisateurs Claude Desktop
   ls ~/.claude/skills | grep agent-skills

   # Utilisateurs claude.ai
   Vérifier que la base de connaissances du projet contient agent-skills
   ```

2. **Utiliser des mots-clés explicites** :
   - ✅ Disponible : `Deploy my app to Vercel`
   - ✅ Disponible : `Review this React component for performance`
   - ✅ Disponible : `Check accessibility of my site`
   - ❌ Non disponible : `帮我部署` (manque de mots-clés)

3. **Recharger les compétences** :
   - Claude Desktop : quitter et redémarrer
   - claude.ai : rafraîchir la page ou réajouter les compétences au projet

:::

### Web Design Guidelines impossible à récupérer les règles

**Problème** : lors de l'utilisation de la compétence `web-design-guidelines`, un message indique l'impossibilité de récupérer les règles depuis GitHub.

**Cause** : cette compétence nécessite d'accéder au dépôt GitHub pour obtenir les dernières règles, mais claude.ai limite l'accès au réseau par défaut.

**Solution** :

1. Ajouter dans [https://claude.ai/settings/capabilities](https://claude.ai/settings/capabilities) :
   - `raw.githubusercontent.com`
   - `github.com`

2. Vérifier l'accès réseau :
```bash
# Tester si la source de règles est accessible
curl -I https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

**Solution de secours** : si le réseau est restreint, télécharger manuellement le fichier de règles et le placer localement, modifier la définition de compétence pour pointer vers le chemin local.

---

## Résumé de ce cours

Les problèmes courants d'Agent Skills se concentrent principalement sur :

1. **Autorisations réseau** : dans claude.ai, il est nécessaire de configurer les domaines autorisés
2. **Activation des compétences** : utiliser des mots-clés explicites pour déclencher les compétences
3. **Validation des règles** : suivre le modèle `_template.md` pour garantir le format correct
4. **Détection de frameworks** : s'assurer que `package.json` contient les dépendances correctes

Lorsque vous rencontrez des problèmes, priorisez l'examen des messages d'erreur et de la logique de gestion des erreurs dans le code source (comme `validate.ts` et `deploy.sh`).

## Obtenir de l'aide

Si les méthodes ci-dessus ne peuvent pas résoudre le problème :

1. **Voir le code source** :
   - Script de déploiement : [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh)
   - Script de validation : [`packages/react-best-practices-build/src/validate.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts)
   - Définition de compétences : [`AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md)

2. **Issues GitHub** : soumettre le problème sur [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/issues)

3. **Discussion communautaire** : chercher de l'aide dans les forums techniques pertinents (comme Twitter, Discord)

## Aperçu du cours suivant

> Dans le cours suivant, nous apprendrons **[Meilleures pratiques d'utilisation](../best-practices/)**.
>
> Vous apprendrez :
> - Comment choisir efficacement les mots-clés de déclenchement
> - Techniques de gestion du contexte
> - Scénarios de collaboration multi-compétences
> - Suggestions d'optimisation des performances

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Dernière mise à jour :2026-01-25

| Fonctionnalité | Chemin de fichier | Ligne |
| ----------- | -------------------------------------------------------------------------------------------- | ------- |
| Gestion des erreurs réseau | [`skills/claude.ai/vercel-deploy-claimable/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/SKILL.md#L100-L113) | 100-113 |
| Logique de validation des règles | [`packages/react-best-practices-build/src/validate.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts) | 21-66 |
| Logique de détection de frameworks | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 12-156 |
| Gestion des erreurs de déploiement | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 224-239 |
| Gestion HTML statique | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 192-205 |

**Constantes clés** :
- `DEPLOY_ENDPOINT = "https://claude-skills-deploy.vercel.com/api/deploy"` : point de terminaison API de déploiement

**Fonctions clés** :
- `detect_framework()` : détecter le type de framework depuis package.json
- `validateRule()` : valider l'intégrité du format des fichiers de règles
- `cleanup()` : nettoyer les fichiers temporaires

**Codes d'erreur** :
- `VALIDATION_ERROR` : échec de la validation des règles
- `INPUT_INVALID` : entrée de déploiement invalide (pas un répertoire ou .tgz)
- `API_ERROR` : l'API de déploiement a renvoyé une erreur

</details>

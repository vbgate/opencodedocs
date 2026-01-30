---
title: "Dépannage des erreurs de modèle : Résolution des erreurs 400 et MCP | opencode-antigravity-auth"
sidebarTitle: "Que faire si le modèle est introuvable ?"
subtitle: "Dépannage des erreurs 'Model not found' et 400"
description: "Apprenez à diagnostiquer les erreurs de modèle Antigravity. Ce tutoriel couvre le diagnostic et la résolution des erreurs Model not found et 400 Unknown name parameters, ainsi que le dépannage des problèmes de compatibilité des serveurs MCP."
tags:
  - "troubleshooting"
  - "model-errors"
  - "400-error"
  - "MCP"
prerequisite:
  - "start-quick-install"
order: 3
---

# Dépannage des erreurs "Model not found" et 400

## Les problèmes que vous rencontrez

Lorsque vous utilisez le modèle Antigravity, vous pouvez rencontrer les erreurs suivantes :

| Message d'erreur | Symptômes typiques |
| --- | --- |
| `Model not found` | Indique que le modèle n'existe pas, impossible d'envoyer une requête |
| `Invalid JSON payload received. Unknown name "parameters"` | Erreur 400, échec de l'appel d'outil |
| Erreur d'appel du serveur MCP | Certains outils MCP spécifiques ne peuvent pas être utilisés |

Ces problèmes sont généralement liés à la configuration, à la compatibilité des serveurs MCP ou à la version du plugin.

## Diagnostic rapide

Avant d'approfondir le dépannage, confirmez les points suivants :

**macOS/Linux** :
```bash
# Vérifier la version du plugin
grep "opencode-antigravity-auth" ~/.config/opencode/opencode.json

# Vérifier le fichier de configuration
cat ~/.config/opencode/antigravity.json | grep -E "(google|npm)"
```

**Windows** :
```powershell
# Vérifier la version du plugin
Get-Content "$env:USERPROFILE\.config\opencode\opencode.json" | Select-String "opencode-antigravity-auth"

# Vérifier le fichier de configuration
Get-Content "$env:USERPROFILE\.config\opencode\antigravity.json" | Select-String "google|npm"
```

---

## Problème 1 : Model not found

**Symptômes de l'erreur** :

```
Model not found: antigravity-claude-sonnet-4-5
```

**Cause** : La configuration du provider Google dans OpenCode manque le champ `npm`.

**Solution** :

Dans votre fichier `~/.config/opencode/opencode.json`, ajoutez le champ `npm` au provider `google` :

```json
{
  "provider": {
    "google": {
      "npm": "@ai-sdk/google",
      "models": { ... }
    }
  }
}
```

**Étapes de vérification** :

1. Éditez `~/.config/opencode/opencode.json`
2. Sauvegardez le fichier
3. Essayez de nouveau d'appeler le modèle dans OpenCode
4. Vérifiez si l'erreur "Model not found" persiste

::: tip Astuce
Si vous n'êtes pas sûr de l'emplacement du fichier de configuration, exécutez :
```bash
opencode config path
```
:::

---

## Problème 2 : Erreur 400 - Unknown name 'parameters'

**Symptômes de l'erreur** :

```
Invalid JSON payload received. Unknown name "parameters" at 'request.tools[0]'
```

**Quel est le problème ?**

Les modèles Gemini 3 utilisent une **validation protobuf stricte**, et l'API Antigravity requiert un format spécifique pour la définition des outils :

```json
// ❌ Format incorrect (sera rejeté)
{
  "tools": [
    {
      "name": "my_tool",
      "parameters": { ... }  // ← Ce champ n'est pas accepté
    }
  ]
}

// ✅ Format correct
{
  "tools": [
    {
      "functionDeclarations": [
        {
          "name": "my_tool",
          "description": "...",
          "parameters": { ... }  // ← À l'intérieur de functionDeclarations
        }
      ]
    }
  ]
}
```

Le plugin convertit automatiquement le format, mais certains **schémas retournés par les serveurs MCP contiennent des champs incompatibles** (comme `const`, `$ref`, `$defs`), ce qui échoue au nettoyage.

### Solution 1 : Mettre à jour vers la dernière version bêta

La dernière version bêta contient des correctifs pour le nettoyage des schémas :

```json
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```

**macOS/Linux** :
```bash
npm install -g opencode-antigravity-auth@beta
```

**Windows** :
```powershell
npm install -g opencode-antigravity-auth@beta
```

### Solution 2 : Désactiver les serveurs MCP un par un pour identifier le problème

Certains serveurs MCP retournent des formats de schéma qui ne respectent pas les exigences d'Antigravity.

**Étapes** :

1. Ouvrez `~/.config/opencode/opencode.json`
2. Trouvez la configuration `mcpServers`
3. **Désactivez tous les serveurs MCP** (commentez ou supprimez)
4. Essayez de nouveau d'appeler le modèle
5. Si cela fonctionne, **réactivez les serveurs MCP un par un**, en testant à chaque fois
6. Une fois le serveur problématique identifié, désactivez-le ou signalez le problème aux mainteneurs du projet

**Exemple de configuration** :

```json
{
  "mcpServers": {
    // "filesystem": { ... },  ← Désactivé temporairement
    // "github": { ... },       ← Désactivé temporairement
    "brave-search": { ... }     ← Testez d'abord celui-ci
  }
}
```

### Solution 3 : Ajouter un override npm

Si les méthodes ci-dessus ne fonctionnent pas, forcez l'utilisation de `@ai-sdk/google` dans la configuration du provider `google` :

```json
{
  "provider": {
    "google": {
      "npm": "@ai-sdk/google"
    }
  }
}
```

---

## Problème 3 : Le serveur MCP provoque l'échec de l'appel d'outil

**Symptômes de l'erreur** :

- Certains outils spécifiques ne peuvent pas être utilisés (comme WebFetch, opérations de fichiers, etc.)
- Messages d'erreur liés au schéma
- Les autres outils fonctionnent normalement

**Cause** : Le schéma JSON retourné par le serveur MCP contient des champs non supportés par l'API Antigravity.

### Caractéristiques des schémas incompatibles

Le nettoie automatiquement les caractéristiques incompatibles (source `src/plugin/request-helpers.ts:24-37`) :

| Caractéristique | Méthode de conversion | Exemple |
| --- | --- | --- |
| `const` | Converti en `enum` | `{ const: "text" }` → `{ enum: ["text"] }` |
| `$ref` | Converti en description hint | `{ $ref: "#/$defs/Foo" }` → `{ type: "object", description: "See: Foo" }` |
| `$defs` / `definitions` | Déployé dans le schéma | N'utilise plus les références |
| `minLength` / `maxLength` / `pattern` | Déplacé dans description | Ajouté aux `description` hints |
| `additionalProperties` | Déplacé dans description | Ajouté aux `description` hints |

Mais si la structure du schéma est trop complexe (par exemple, `anyOf`/`oneOf` imbriqués à plusieurs niveaux), le nettoyage peut échouer.

### Processus de diagnostic

```bash
# Activer les logs de débogage
export OPENCODE_ANTIGRAVITY_DEBUG=1  # macOS/Linux
$env:OPENCODE_ANTIGRAVITY_DEBUG=1     # Windows PowerShell

# Redémarrer OpenCode

# Voir les erreurs de conversion de schéma dans les logs
tail -f ~/.config/opencode/antigravity-logs/*.log
```

**Mots-clés à rechercher dans les logs** :

- `cleanJSONSchemaForAntigravity`
- `Failed to clean schema`
- `Unsupported keyword`
- `anyOf/oneOf flattening failed`

### Signalement d'un problème

Si vous identifiez qu'un serveur MCP spécifique cause le problème, veuillez soumettre une [issue GitHub](https://github.com/NoeFabris/opencode-antigravity-auth/issues) avec :

1. **Nom et version du serveur MCP**
2. **Logs d'erreur complets** (depuis `~/.config/opencode/antigravity-logs/`)
3. **Exemple d'outil déclenchant le problème**
4. **Version du plugin** (exécutez `opencode --version`)

---

## Rappels importants

::: warning Ordre de désactivation des plugins

Si vous utilisez simultanément `opencode-antigravity-auth` et `@tarquinen/opencode-dcp`, **placez le plugin Antigravity Auth en premier** :

```json
{
  "plugin": [
    "opencode-antigravity-auth@latest",  ← Doit être avant DCP
    "@tarquinen/opencode-dcp@latest"
  ]
}
```

Le DCP crée des messages assistant synthétiques qui manquent de blocs de réflexion, ce qui peut provoquer des erreurs de vérification de signature.
:::

::: warning Erreur de nom de clé de configuration

Assurez-vous d'utiliser `plugin` (singulier), et non `plugins` (pluriel) :

```json
// ❌ Incorrect
{
  "plugins": ["opencode-antigravity-auth@beta"]
}

// ✅ Correct
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```
:::

---

## Quand demander de l'aide

Si vous avez essayé toutes les méthodes ci-dessus et que le problème persiste :

**Vérifier les fichiers de logs** :
```bash
cat ~/.config/opencode/antigravity-logs/latest.log
```

**Réinitialiser le compte** (efface tous les états) :
```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```

**Soumettre une issue GitHub** avec :
- Le message d'erreur complet
- La version du plugin (`opencode --version`)
- La configuration `~/.config/opencode/antigravity.json` (**supprimez les informations sensibles comme le refreshToken**)
- Les logs de débogage (`~/.config/opencode/antigravity-logs/latest.log`)

---

## Tutoriels connexes

- [Guide d'installation rapide](/fr/NoeFabris/opencode-antigravity-auth/start/quick-install/) - Configuration de base
- [Compatibilité des plugins](/fr/NoeFabris/opencode-antigravity-auth/faq/plugin-compatibility/) - Dépannage des conflits avec d'autres plugins
- [Logs de débogage](/fr/NoeFabris/opencode-antigravity-auth/advanced/debug-logging/) - Activer les logs détaillés

---

## Annexe : Références du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Numéros de ligne |
| --- | --- | --- |
| Fonction principale de nettoyage JSON Schema | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 658-685 |
| Conversion const en enum | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 86-104 |
| Conversion $ref en hints | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 55-80 |
| Aplatissement anyOf/oneOf | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 368-453 |
| Conversion du format des outils Gemini | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 425-517 |

**Constantes clés** :
- `UNSUPPORTED_KEYWORDS` : Mots-clés Schema supprimés (`request-helpers.ts:33-37`)
- `UNSUPPORTED_CONSTRAINTS` : Contraintes déplacées dans description (`request-helpers.ts:24-28`)

**Fonctions clés** :
- `cleanJSONSchemaForAntigravity(schema)` : Nettoie les JSON Schema incompatibles
- `convertConstToEnum(schema)` : Convertit `const` en `enum`
- `convertRefsToHints(schema)` : Convertit `$ref` en hints de description
- `flattenAnyOfOneOf(schema)` : Aplatit les structures `anyOf`/`oneOf`

</details>

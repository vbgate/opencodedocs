---
title: "API Audio : Point de terminaison compatible Whisper | Antigravity-Manager"
subtitle: "API Audio : Point de terminaison compatible Whisper"
sidebarTitle: "Transcription audio en 5 minutes"
description: "Apprenez à utiliser l'API de transcription audio d'Antigravity-Manager. Maîtrisez la prise en charge de 6 formats, la limite de 15 Mo et la gestion des grandes charges pour transcrire rapidement l'audio en texte."
tags:
  - "Transcription audio"
  - "OpenAI"
  - "Whisper"
  - "Gemini"
  - "Proxy API"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 5
---
# Transcription audio : Limites de /v1/audio/transcriptions et gestion des grandes charges

Vous pouvez utiliser le **point de terminaison de transcription audio `POST /v1/audio/transcriptions`** pour convertir des fichiers audio en texte. Il ressemble à l'API OpenAI Whisper, mais effectue la validation de format, la limitation de la taille des fichiers dans la passerelle locale, et envoie l'audio en tant que demande amont `inlineData` de Gemini.

## Ce que vous pourrez faire après ce cours

- Appeler `POST /v1/audio/transcriptions` avec curl / le SDK OpenAI pour convertir l'audio en `{"text":"..."}`
- Comprendre les 6 formats audio pris en charge et la forme réelle de l'erreur **limite stricte de 15 Mo**
- Connaître les valeurs par défaut et le mode de transmission de `model` / `prompt` (sans deviner les règles amont)
- Localiser les demandes audio dans Proxy Monitor et comprendre la source de `[Binary Request Data]`

## Votre problème actuel

Vous souhaitez transcrire des enregistrements de réunion, des podcasts ou des appels de service client en texte, mais vous êtes souvent bloqué sur ces points :

- Différents outils ont des formats/formes d'interface audio différents, ce qui rend difficile la réutilisation des scripts et des SDK
- En cas d'échec du téléchargement, vous ne voyez que "mauvaise demande/erreur de passerelle", sans savoir si le format est incorrect ou si le fichier est trop volumineux
- Vous souhaitez intégrer la transcription dans Antigravity Tools pour une planification et une surveillance unifiées via la "passerelle locale", mais vous n'êtes pas sûr du niveau réel de compatibilité

## 🎒 Préparatifs avant de commencer

::: warning Conditions préalables
- Vous avez déjà exécuté [Démarrer le proxy inverse local et connecter le premier client](/fr/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/) et vous connaissez le port du proxy inverse (cette page utilise `8045` comme exemple)
- Vous avez déjà exécuté [Ajouter un compte](/fr/lbjlaq/Antigravity-Manager/start/add-account/) avec au moins 1 compte disponible
:::

## Qu'est-ce que le point de terminaison de transcription audio (/v1/audio/transcriptions) ?

Le **point de terminaison de transcription audio** est une route compatible OpenAI Whisper exposée par Antigravity Tools. Le client télécharge des fichiers audio via `multipart/form-data`, le serveur valide l'extension et la taille, convertit l'audio en Base64 `inlineData`, appelle ensuite `generateContent` amont, et ne renvoie qu'un champ `text`.

## Aperçu du point de terminaison et des limites

| Élément | Conclusion | Preuve de code |
| --- | --- | --- |
| Route d'entrée | `POST /v1/audio/transcriptions` | `src-tauri/src/proxy/server.rs` enregistre la route vers `handlers::audio::handle_audio_transcription` |
| Formats pris en charge | Reconnus par extension de fichier : `mp3/wav/m4a/ogg/flac/aiff(aif)` | `src-tauri/src/proxy/audio/mod.rs` `detect_mime_type()` |
| Taille de fichier | **Limite stricte de 15 Mo** (renvoie 413 + message d'erreur texte si dépassé) | `src-tauri/src/proxy/audio/mod.rs` `exceeds_size_limit()` ; `src-tauri/src/proxy/handlers/audio.rs` |
| Limite globale de corps du proxy inverse | Au niveau Axum, autorisé jusqu'à 100 Mo | `src-tauri/src/proxy/server.rs` `DefaultBodyLimit::max(100 * 1024 * 1024)` |
| Paramètres par défaut | `model="gemini-2.0-flash-exp"` ; `prompt="Generate a transcript of the speech."` | `src-tauri/src/proxy/handlers/audio.rs` |

## Suivez le guide

### Étape 1 : Vérifiez que la passerelle est en cours d'exécution (/healthz)

**Pourquoi**
Éliminez d'abord les problèmes tels que mauvais port ou service non démarré.

::: code-group

```bash [macOS/Linux]
curl -s http://127.0.0.1:8045/healthz
```

```powershell [Windows]
curl http://127.0.0.1:8045/healthz
```

:::

**Vous devriez voir** : Un JSON similaire à `{"status":"ok"}`.

### Étape 2 : Préparez un fichier audio ne dépassant pas 15 Mo

**Pourquoi**
Le serveur effectue une vérification de 15 Mo dans le processeur et renvoie 413 si dépassé.

::: code-group

```bash [macOS/Linux]
ls -lh audio.mp3
```

```powershell [Windows]
Get-Item audio.mp3 | Select-Object Length
```

:::

**Vous devriez voir** : La taille du fichier ne dépasse pas `15 Mo`.

### Étape 3 : Appelez /v1/audio/transcriptions avec curl

**Pourquoi**
curl est le plus direct, pratique pour valider d'abord la forme du protocole et les messages d'erreur.

```bash
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -F "file=@audio.mp3" \
  -F "model=gemini-2.0-flash-exp" \
  -F "prompt=Generate a transcript of the speech."
```

**Vous devriez voir** : Un JSON renvoyé avec un seul champ `text`.

```json
{
  "text": "..."
}
```

### Étape 4 : Appelez avec le SDK OpenAI Python

```python
from openai import OpenAI

client = OpenAI(
  base_url="http://127.0.0.1:8045/v1",
  api_key="your-proxy-api-key"  # Si l'authentification est activée
)

audio_file = open("audio.mp3", "rb")
transcript = client.audio.transcriptions.create(
  model="gemini-2.0-flash-exp",
  file=audio_file
)

print(transcript.text)
```

**Vous devriez voir** : `print(transcript.text)` affiche un texte transcrit.

## Formats audio pris en charge

Antigravity Tools détermine le type MIME par extension de fichier (pas par détection de contenu de fichier).

| Format | Type MIME | Extension |
| --- | --- | --- |
| MP3 | `audio/mp3` | `.mp3` |
| WAV | `audio/wav` | `.wav` |
| AAC (M4A) | `audio/aac` | `.m4a` |
| OGG | `audio/ogg` | `.ogg` |
| FLAC | `audio/flac` | `.flac` |
| AIFF | `audio/aiff` | `.aiff`, `.aif` |

::: warning Formats non pris en charge
Si l'extension n'est pas dans le tableau, une erreur `400` est renvoyée avec un corps de réponse texte, par exemple : `不支持的音频格式: txt`.
:::

## Point de contrôle ✅

- [ ] Le corps de réponse est `{"text":"..."}` (pas de structures supplémentaires comme `segments`, `verbose_json`)
- [ ] Les en-têtes de réponse contiennent `X-Account-Email` (marque le compte réellement utilisé)
- [ ] L'enregistrement de cette demande est visible dans la page "Monitor"

## Gestion des grandes charges : Pourquoi voyez-vous 100 Mo mais êtes toujours bloqué à 15 Mo

Le serveur définit la limite du corps de demande à 100 Mo au niveau Axum (pour empêcher certaines demandes volumineuses d'être rejetées directement par le framework), mais le processeur de transcription audio effectue une vérification supplémentaire de **15 Mo**.

Cela signifie que :

- `15 Mo < fichier <= 100 Mo` : La demande peut atteindre le processeur mais renverra `413` + message d'erreur texte
- `fichier > 100 Mo` : La demande peut échouer directement au niveau du framework (la forme exacte de l'erreur n'est pas garantie)

### Que voyez-vous lorsque vous dépassez 15 Mo

Code d'état `413 Payload Too Large` renvoyé, le corps de réponse est un texte (pas JSON), le contenu est similaire à :

```
音频文件过大 (18.5 MB)。最大支持 15 MB (约 16 分钟 MP3)。建议: 1) 压缩音频质量 2) 分段上传
```

### Deux méthodes de division applicables

1) Compresser la qualité audio (convertir WAV en MP3 plus petit)

```bash
ffmpeg -i input.wav -b:a 64k -ac 1 output.mp3
```

2) Diviser (couper l'audio long en plusieurs segments)

```bash
ffmpeg -i long_audio.mp3 -f segment -segment_time 600 -c copy segment_%03d.mp3
```

## Notes sur la collecte des journaux

### Pourquoi les corps de demande réels sont souvent invisibles dans Monitor

Le middleware Monitor lit d'abord le **corps de demande POST** pour l'enregistrement :

- Si le corps de demande peut être analysé comme texte UTF-8, le texte original est enregistré
- Sinon, il est enregistré comme `[Binary Request Data]`

La transcription audio utilise `multipart/form-data` qui contient du contenu audio binaire, donc il tombe facilement dans le deuxième cas.

### Ce que vous devriez voir dans Monitor

```
URL: /v1/audio/transcriptions
Request Body: [Binary Request Data]
Response Body: {"text":"..."}
```

::: info Note sur les limites des journaux
Le corps audio lui-même n'est pas visible dans les journaux, mais vous pouvez toujours utiliser `status/duration/X-Account-Email` pour juger rapidement : incompatibilité de protocole, fichier trop volumineux ou échec amont.
:::

## Description des paramètres (pas de "complément empirique")

Ce point de terminaison lit explicitement seulement 3 champs de formulaire :

| Champ | Obligatoire | Valeur par défaut | Méthode de traitement |
| --- | --- | --- | --- |
| `file` | ✅ | Aucun | Doit être fourni ; manquant renvoie `400` + texte `缺少音频文件` |
| `model` | ❌ | `gemini-2.0-flash-exp` | Transmis comme chaîne et participe à l'obtention de jetons (les règles amont spécifiques sont basées sur la réponse réelle) |
| `prompt` | ❌ | `Generate a transcript of the speech.` | Envoyé comme premier paragraphe `text` à l'amont pour guider la transcription |

## Rappels sur les pièges

### ❌ Erreur 1 : Mauvais paramètres curl, résultant en non-multipart

```bash
#Erreur : utiliser directement -d
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -d "file=@audio.mp3"
```

Méthode correcte :

```bash
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -F "file=@audio.mp3"
```

### ❌ Erreur 2 : L'extension du fichier n'est pas dans la liste de prise en charge

```bash
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -F "file=@document.txt"
```

Méthode correcte : Ne téléchargez que des fichiers audio (`.mp3`, `.wav`, etc.).

### ❌ Erreur 3 : Traiter 413 comme "passerelle cassée"

`413` signifie généralement que la vérification de 15 Mo a été déclenchée. Faites d'abord la compression/division, c'est plus rapide que de réessayer aveuglément.

## Résumé du cours

- **Point de terminaison principal** : `POST /v1/audio/transcriptions` (forme compatible Whisper)
- **Prise en charge des formats** : mp3, wav, m4a, ogg, flac, aiff (aif)
- **Limite de taille** : 15 Mo (renvoie `413` + message d'erreur texte si dépassé)
- **Comportement des journaux** : Lorsque le multipart contient du contenu binaire, Monitor affiche `[Binary Request Data]`
- **Paramètres clés** : `file` / `model` / `prompt` (voir tableau ci-dessus pour les valeurs par défaut)

## Aperçu du prochain cours

> Dans le prochain cours, nous apprendrons **[Point de terminaison MCP : Exposer Web Search/Reader/Vision comme outils appelables](/fr/lbjlaq/Antigravity-Manager/platforms/mcp/)**.
>
> Vous apprendrez :
> - La forme de route et la stratégie d'authentification du point de terminaison MCP
> - Web Search/Web Reader/Vision utilisent-ils le "transfert amont" ou les "outils intégrés"
> - Quelles capacités sont expérimentales pour éviter les pièges en production

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer et voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonction | Chemin du fichier | Numéro de ligne |
| --- | --- | --- |
| Enregistrement de route (/v1/audio/transcriptions + limite de corps) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| Processeur de transcription audio (multipart/15 Mo/inlineData) | [`src-tauri/src/proxy/handlers/audio.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/audio.rs#L16-L162) | 16-162 |
| Formats pris en charge (extension → MIME + 15 Mo) | [`src-tauri/src/proxy/audio/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/audio/mod.rs#L6-L35) | 6-35 |
| Middleware Monitor (Binary Request Data) | [`src-tauri/src/proxy/middleware/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/monitor.rs#L13-L337) | 13-337 |

**Constantes clés** :
- `MAX_SIZE = 15 * 1024 * 1024` : Limite de taille de fichier audio (15 Mo)
- `MAX_REQUEST_LOG_SIZE = 100 * 1024 * 1024` : Limite supérieure pour que Monitor lise le corps de demande POST (100 Mo)
- `MAX_RESPONSE_LOG_SIZE = 100 * 1024 * 1024` : Limite supérieure pour que Monitor lise le corps de réponse (100 Mo)

**Fonctions clés** :
- `handle_audio_transcription()` : Analyser multipart, valider extension et taille, assembler `inlineData` et appeler l'amont
- `AudioProcessor::detect_mime_type()` : Extension → MIME
- `AudioProcessor::exceeds_size_limit()` : Vérification 15 Mo
- `monitor_middleware()` : Faire atterrir le corps de demande/réponse sur Proxy Monitor (enregistrement complet uniquement pour UTF-8)

</details>

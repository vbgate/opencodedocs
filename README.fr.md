<div align="center">
 
# 🔥 OpenCodeDocs

![VitePress](https://img.shields.io/badge/VitePress-1.0-646CFF?style=flat&logo=vitepress)
![License](https://img.shields.io/badge/License-MIT%2B%20CC--BY--NC--SA%204.0-green?style=flat)
![Cloudflare](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-orange?style=flat)
![Languages](https://img.shields.io/badge/Languages-10%2B-blue?style=flat)

**🎯 N°1 du site de tutoriels de l'écosystème IA · Guidé par le code source · 100% fonctionnel**

Les outils d'IA évoluent trop vite ? La documentation officielle ne suit pas ? Les tutoriels en ligne sont obsolètes ?

Nous analysons en profondeur le code source des projets open source, chaque ligne de code est vérifiée.
**✅ Suivez les étapes, réussissez du premier coup, évitez les détours.**

[🚀 Commencer à apprendre](https://opencodedocs.com) · [⭐ Star ce dépôt](../../) · [💬 Rejoindre la discussion](../../discussions)

</div>

## Langue

[简体中文](README.zh-CN.md) · [English](README.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português](README.pt.md) · [Русский](README.ru.md) · [繁體中文](README.zh-TW.md)

---

## 💡 Avez-vous déjà rencontré ces situations ?

- ❌ La documentation officielle est en retard, vous suivez mais ça ne fonctionne pas ?
- ❌ Les tutoriels en ligne sont des copier-coller, le code ne fonctionne pas du tout ?
- ❌ Vous rencontrez une erreur, vous cherchez partout mais ne trouvez pas de solution ?
- ❌ Vous voulez progresser, mais vous ne trouvez pas de guide pratique approfondissant le code source ?

**OpenCodeDocs résout spécifiquement ces problèmes.**

---

## ✨ Pourquoi choisir OpenCodeDocs ?

### 🎯 Vérification par le code source, refus des hallucinations

> Pas copié depuis Internet, mais dérivé du **code source réel**

Nous analysons en profondeur le code source des projets open source, en nous assurant que chaque ligne de code est vérifiée automatiquement. **Les tutoriels indiquent la version Git Commit spécifique**, vous savez donc clairement sur quelle version le code est basé.

### 🚀 Mises à jour continues, synchronisées avec les versions

> Si l'outil est mis à jour, le tutoriel se met à jour automatiquement

Lorsqu'une nouvelle version est publiée, nos tutoriels sont mis à jour simultanément. Vous n'avez pas à vous soucier de l'obsolescence des tutoriels, vous apprenez toujours le contenu le plus récent.

> 💡 **Nos tutoriels sont en cours de mise à jour rapide, nous intégrons continuellement plus de projets de qualité !**

### 🌍 10+ langues, accessible dans le monde entier

> Chinois, anglais, japonais, coréen, espagnol, français, allemand, portugais, russe, chinois traditionnel...

Peu importe d'où vous venez, vous pouvez apprendre les outils d'IA dans votre langue maternelle.

### ✅ 100% fonctionnel, zéro essai-erreur

> Suivez les étapes, réussissez du premier coup, sans deviner, sans essayer

Chaque étape du tutoriel est vérifiée, de l'installation au déploiement. Tant que vous suivez les étapes, cela fonctionnera. **Pas de complications, pas de pièges, pas de détours.**

---

## 👤 À quelle catégorie appartenez-vous ?

### 🌱 Débutant en outils d'IA

**Ne savez-vous pas installer ? Ne savez-vous pas configurer ? Pas d'inquiétude, nous avons des tutoriels pas à pas**

- Aucune base requise, accessible aux débutants
- Chaque étape est expliquée en détail
- Solutions pour les erreurs courantes

### 💻 Développeur avancé

**Vous voulez progresser ? Nous allons approfondir le code source**

- Techniques de rotation de comptes multiples
- Secrets pour économiser des tokens
- Pratique d'automatisation d'agents
- Analyse approfondie au niveau du code source

### 🏢 Équipe technique

**Besoin d'uniformiser les normes pour le travail d'équipe ?**

- Meilleures pratiques réutilisables
- Structure complète de projet
- Guide de déploiement en environnement de production

---

## 🚀 Démarrage rapide en 3 minutes

### Première étape : Cloner le dépôt

```bash
git clone https://github.com/vbgate/opencodedocs.git
cd opencodedocs/site
```

### Deuxième étape : Installer les dépendances

```bash
npm install
```

### Troisième étape : Démarrer le serveur de développement

```bash
npm run dev
```

Visitez `http://localhost:5173`, commencez votre voyage d'apprentissage des outils d'IA ! 🎉

---

> 💡 **Astuce** : Vous pouvez également visiter directement [opencodedocs.com](https://opencodedocs.com) pour voir la documentation en ligne.

---

## 📂 Structure du projet

```
site/
├── docs/                      # Racine de la documentation
│   ├── zh/                    # Tutoriels chinois 🇨🇳
│   ├── en/                    # Tutoriels anglais 🇺🇸
│   ├── ja/                    # Tutoriels japonais 🇯🇵
│   ├── ko/                    # Tutoriels coréen 🇰🇷
│   ├── es/                    # Tutoriels espagnol 🇪🇸
│   ├── fr/                    # Tutoriels français 🇫🇷
│   ├── de/                    # Tutoriels allemand 🇩🇪
│   ├── pt/                    # Tutoriels portugais 🇵🇹
│   ├── ru/                    # Tutoriels russe 🇷🇺
│   ├── zh-tw/                 # Tutoriels chinois traditionnel 🇹🇼
│   ├── .vitepress/            # Configuration VitePress
│   │   ├── config.mts         # Fichier de configuration principal
│   │   ├── sidebar.config.ts  # Génération automatique de la barre latérale
│   │   └── theme/             # Composants de thème personnalisés
│   ├── about.md               # À propos de nous
│   └── terms.md               # Conditions d'utilisation
├── scripts/                   # Scripts utilitaires
│   ├── add-order-to-md.ts     # Ajouter des champs de tri
│   ├── check-frontmatter.ts   # Vérifier le Frontmatter
│   └── create-category-indexes.ts  # Créer des index de catégories
├── package.json               # Configuration du projet
├── tailwind.config.js         # Configuration Tailwind CSS
└── postcss.config.js          # Configuration PostCSS
```

---

## 🛠️ Stack technique

| Technologie | Version | Description |
|:---:|:---:|:---|
| ![VitePress](https://img.shields.io/badge/VitePress-1.0-646CFF?style=flat&logo=vitepress) | 1.x | Générateur de site statique · Construction ultra-rapide |
| ![Vue](https://img.shields.io/badge/Vue-3.4+-4FC08D?style=flat&logo=vue.js) | 3.4+ | Framework frontend · Composition API |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=flat&logo=tailwind-css) | 4.x | Système de style · Configuration CSS-first |
| ![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178C6?style=flat&logo=typescript) | 5.9+ | Sécurité de type · Vérification à la compilation |
| ![Mermaid](https://img.shields.io/badge/Mermaid-11.x-9F7DFE?style=flat&logo=mermaid) | 11.x | Support des diagrammes · Visualisation des flux |
| ![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages-F38020?style=flat&logo=cloudflare) | Pages | CDN global · 200+ nœuds de bordure |

---

## 📚 Guide de développement

### ➕ Ajouter un nouveau tutoriel

1. **Créer la structure des répertoires**
    ```
    docs/zh/[owner]/[repo]/
    ├── index.md          # Page d'accueil du projet
    ├── start/            # Démarrage rapide
    ├── features/         # Présentation des fonctionnalités
    └── faq/              # Questions fréquentes
    ```

2. **Écrire le Frontmatter**
    ```yaml
    ---
    title: "Titre du tutoriel"       # 2-6 caractères chinois
    order: 10                        # Tri (10, 20, 30...)
    sidebarTitle: "Titre de la barre latérale"  # Optionnel
    description: "Description SEO"   # Optimisation pour les moteurs de recherche
    ---
    ```

3. **Vérifier la construction**
    ```bash
    npm run docs:build
    ```

### 🌍 Ajouter le support multilingue

Ajoutez le projet dans `docs/.vitepress/sidebar.config.ts` :
```typescript
const projects = [
  'owner/repo',  // Ajoutez votre projet
]
```

Ensuite, traduisez les fichiers `home-config.[lang].json`.

### 🎨 Personnaliser le thème

- **Emplacement des composants** : `docs/.vitepress/theme/components/`
- **Fichier de style** : `docs/.vitepress/theme/custom.css`
- **Tailwind v4** : Utilisez la configuration CSS-first

---

## 🚀 Guide de déploiement

### Construction locale

```bash
npm run docs:build
```

Les artefacts de construction se trouvent dans le répertoire `docs/.vitepress/dist/`.

### Déploiement sur Cloudflare Pages

```bash
# Déploiement automatique
npm run deploy
```

### Aperçu du résultat de construction

```bash
npm run docs:preview
```

### ⚡ Optimisation des performances

- **Optimisation des images** : Utilisez le format WebP, compressé à moins de 200KB
- **Division du code** : VitePress divise automatiquement par route
- **Accélération CDN** : Les ressources statiques sont automatiquement téléchargées vers Cloudflare CDN
- **Pré-rendu** : Les pages principales sont pré-rendues, premier écran < 500ms

---

> ✅ **Notre site est déployé sur un CDN mondial, vitesse d'accès fulgurante !**

---

## 🤝 Contribuer

Nous accueillons les contributions de la communauté ! Soumettez vos tutoriels, corrigez des erreurs, ajoutez de nouvelles fonctionnalités.

### Processus de contribution

1. **Fork ce dépôt**
    ```bash
    # Cliquez sur le bouton Fork de la page GitHub
    ```

2. **Créer une branche de fonctionnalité**
    ```bash
    git checkout -b feature/amazing-feature
    ```

3. **Soumettre les modifications**
    ```bash
    git commit -m 'Add amazing feature'
    ```

4. **Pousser vers la branche**
    ```bash
    git push origin feature/amazing-feature
    ```

  5. **Soumettre une Pull Request**
    - Cliquez sur le bouton "Pull Request" de la page GitHub
    - Remplissez la description de la PR, expliquez vos modifications
  
---
  
> 🌟 **Votre contribution aidera les développeurs du monde entier à mieux utiliser les outils d'IA !**
  
---

## 📥 Soumettre une demande de tutoriel

Vous voulez que votre projet ait également un tutoriel de haute qualité ? Seulement 3 étapes !

### 📝 Processus de soumission

**Première étape : Soumettre une Issue**

1. Visitez [GitHub Issues](https://github.com/vbgate/opencodedocs/issues)
2. Cliquez sur "New Issue"
3. Utilisez le modèle suivant :

```markdown
**Nom du projet** : [Nom du projet]
**Dépôt GitHub** : https://github.com/[owner]/[repo]
**Brève description** : [1-2 phrases décrivant l'utilité du projet]
**Public cible** : [Débutant/Intermédiaire/Expert/Tous]
**Langues du tutoriel** : [Chinois/Anglais/Autre]
**Remarques** : [Autres informations supplémentaires]
```

**Deuxième étape : Révision par l'équipe**

- Nous réviserons votre demande dans les 1 à 3 jours ouvrables
- Nous évaluerons si le projet convient à être inclus
- Nous confirmerons la qualité du code source et l'activité du projet

**Troisième étape : Mise en ligne du tutoriel**

- Après l'approbation, nous générons automatiquement le tutoriel
- Nous vérifions l'exécutabilité de chaque étape
- Publication sur le site officiel, support multilingue

### ⏱️ Délai de traitement

- **Cycle de révision** : 1 à 3 jours ouvrables
- **Génération du tutoriel** : 3 à 7 jours ouvrables
- **Temps de mise en ligne** : Publication immédiate après approbation

### ❓ Questions fréquentes

**Q : Quels types de projets conviennent à l'inclusion ?**
R : Outils d'IA open source, outils de développement, bibliothèques, frameworks, etc. Doivent avoir une certaine profondeur technique et une valeur d'utilisation.

**Q : Les tutoriels sont-ils gratuits ?**
R : Oui, nos tutoriels sont entièrement gratuits et continuellement mis à jour et maintenus.

**Q : Puis-je spécifier les langues du tutoriel ?**
R : Oui, nous supportons 10 langues. Vous pouvez indiquer les langues nécessaires dans l'Issue.

---

> 🎯 **Soumettre maintenant : [Créer une Issue →](https://github.com/vbgate/opencodedocs/issues/new)**

---

## 📄 Licence

### Code du site

[MIT License](LICENSE)

### Contenu des tutoriels

[CC-BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)

**Attribution - Pas d'utilisation commerciale - Partage dans les mêmes conditions**

✅ Vous pouvez :
- 📋 Partager : Partager et adapter librement
- 🔧 Modifier : Créer des dérivés basés sur le contenu du tutoriel
- 👥 Contribuer : Soumettre vos améliorations

❌ Vous ne pouvez pas :
- 💰 Utilisation commerciale : Utilisation à des fins commerciales sans autorisation

---

> 💡 **Si vous souhaitez utiliser les tutoriels à des fins commerciales, veuillez nous contacter : [vbgatecom@gmail.com](mailto:vbgatecom@gmail.com)**

---

## 📞 Contactez-nous

Des questions ou des suggestions ? N'hésitez pas à nous contacter à tout moment !

- 📧 **Email** : [vbgatecom@gmail.com](mailto:vbgatecom@gmail.com)
- 🐦 **Twitter** : [@codingzys](https://x.com/codingzys)
- 💻 **GitHub** : [vbgate/opencodedocs](https://github.com/vbgate/opencodedocs)
- 📥 **Soumettre un tutoriel** : [GitHub Issues](https://github.com/vbgate/opencodedocs/issues)
- 🌐 **Site officiel** : [opencodedocs.com](https://opencodedocs.com)

---

<div align="center">

**🎉 Merci de choisir OpenCodeDocs !**

**De la première ligne de code aux applications de niveau production, nous vous fournissons des tutoriels pour chaque étape.**

[⭐ Star ce dépôt](../../) · [📥 Soumettre une demande de tutoriel](https://github.com/vbgate/opencodedocs/issues/new) · [💬 Rejoindre la discussion](../../discussions)

Made with ❤️ by [OpenCodeDocs Team](https://github.com/vbgate/opencodedocs)

</div>

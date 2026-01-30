---
title: "Communauté : Échange en programmation IA | OpenCodeDocs"
sidebarTitle: "Trouver la communauté"
subtitle: "Communauté : Échange en programmation IA | OpenCodeDocs"
description: "Rejoignez la communauté de développeurs OpenCodeDocs et échangez sur l'expérience en programmation IA avec des milliers de développeurs. Explorez le concept Vibe Coding et obtenez les derniers tutoriels et supports techniques."
layout: doc
---

# Rejoignez la grande famille OpenCodeDocs <Badge type="tip" text="Communauté Vibe Coding" />

Le concept central ici est **Vibe Coding & Vibe Writing**. Que vous soyez un ingénieur expérimenté ou un explorateur de l'IA, tant que vous souhaitez créer de la valeur avec l'IA, vous êtes le bienvenu.

## 🤝 Notre communauté

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const groups = [
  {
    icon: 'ph-wechat-logo',
    color: 'text-[#07C160]',
    bg: 'bg-[#07C160]/10',
    title: 'Ajouter l\'assistant',
    desc: 'Notez IA pour rejoindre',
    qr: '/images/community/wechat-helper.png'
  },
  {
    icon: 'ph-users-three',
    color: 'text-[#07C160]',
    bg: 'bg-[#07C160]/10',
    title: 'Rejoindre le groupe WeChat',
    desc: 'Échanges en temps réel, partage de contenu',
    qr: '/images/community/wechat-group.png'
  },
  {
    icon: 'ph-messenger-logo',
    color: 'text-[#12B7F5]',
    bg: 'bg-[#12B7F5]/10',
    title: 'Rejoindre le groupe QQ',
    desc: 'Ressources accumulées, partage de fichiers',
    qr: '/images/community/qq-group.png'
  },
  {
    icon: 'ph-newspaper',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    title: 'Suivre le compte officiel',
    desc: 'Ne manquez aucun tutoriel en profondeur',
    qr: '/images/community/official-account.png'
  }
]
</script>

<div class="grid md:grid-cols-2 gap-6 my-8">
  <div v-for="group in groups" :key="group.title" class="vp-doc-card border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 bg-neutral-50 dark:bg-neutral-900">
    <div class="flex items-center gap-4 mb-4">
      <div :class="['w-10 h-10 rounded-full flex items-center justify-center', group.bg, group.color]">
        <i :class="['ph-fill text-xl', group.icon]"></i>
      </div>
      <div>
        <h3 class="text-lg font-bold m-0!">{{ group.title }}</h3>
        <p class="text-sm text-neutral-500 m-0!">{{ group.desc }}</p>
      </div>
    </div>
    <div class="aspect-square bg-white dark:bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-100 dark:border-neutral-700 overflow-hidden">
      <!-- <span class="text-neutral-300 dark:text-neutral-600 font-mono text-sm">{{ group.qr }}</span> -->
       <img :src="group.qr" :alt="group.title" class="w-full h-full object-cover" />
    </div>
  </div>
</div>

## 💡 À propos de Vibe Coding

### Qu'est-ce que Vibe Coding ?
UNE nouvelle façon de programmer — vous n'avez pas besoin de maîtriser la syntaxe, il suffit d'exprimer vos idées clairement. L'IA est responsable d'implémenter le code, vous êtes responsable de la direction et de l'ambiance (Vibe). Nous croyons qu'à l'avenir, tout le monde sera créateur.

### Je suis débutant, puis-je comprendre ?
Absolument pas de problème. Il y a de nombreux membres sans background technique dans la communauté (product managers, designers, étudiants, etc.), tous utilisent des outils d'IA pour construire leurs idées.

---
title: "Comunidade: compartilhe programação com IA | OpenCodeDocs"
sidebarTitle: "Encontre a comunidade"
subtitle: "Comunidade: compartilhe programação com IA | OpenCodeDocs"
description: "Junte-se à comunidade de desenvolvedores OpenCodeDocs, compartilhe experiências de programação com IA com milhares de desenvolvedores. Explore a filosofia Vibe Coding, obtenha os tutoriais mais recentes e suporte técnico."
layout: doc
---

# Junte-se à grande família OpenCodeDocs <Badge type="tip" text="Comunidade Vibe Coding" />

O conceito central aqui é **Vibe Coding & Vibe Writing**. Seja você um engenheiro experiente ou um explorador de IA, desde que queira usar IA para criar valor, você é bem-vindo.

## 🤝 Nossa comunidade

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const groups = [
  {
    icon: 'ph-wechat-logo',
    color: 'text-[#07C160]',
    bg: 'bg-[#07C160]/10',
    title: 'Adicione o assistente',
    desc: 'Observação: AI para convidar para o grupo',
    qr: '/images/community/wechat-helper.png'
  },
  {
    icon: 'ph-users-three',
    color: 'text-[#07C160]',
    bg: 'bg-[#07C160]/10',
    title: 'Junte-se ao grupo WeChat',
    desc: 'Comunicação instantânea, compartilhamento de conteúdo',
    qr: '/images/community/wechat-group.png'
  },
  {
    icon: 'ph-messenger-logo',
    color: 'text-[#12B7F5]',
    bg: 'bg-[#12B7F5]/10',
    title: 'Junte-se ao grupo QQ',
    desc: 'Acúmulo de recursos, compartilhamento de arquivos',
    qr: '/images/community/qq-group.png'
  },
  {
    icon: 'ph-newspaper',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    title: 'Siga a conta oficial',
    desc: 'Não perca nenhum tutorial profundo',
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

## 💡 Sobre Vibe Coding

### O que é Vibe Coding?
Uma nova maneira de programar — você não precisa dominar a sintaxe, apenas expressar suas ideias claramente. A IA é responsável por implementar o código, você é responsável por direcionar e definir o vibe (atmosfera). Acreditamos que, no futuro, todos serão criadores.

### Eu sou iniciante, consigo entender?
Nenhum problema. Há muitos membros sem background técnico na comunidade (gerentes de produto, designers, estudantes, etc.), todos estão usando ferramentas de IA para construir suas ideias.


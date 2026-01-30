---
title: "Comunidad: Comparte Programación con IA | OpenCodeDocs"
sidebarTitle: "Encuentra tu comunidad"
subtitle: "Comunidad: Comparte Programación con IA | OpenCodeDocs"
description: "Únete a la comunidad de desarrolladores de OpenCodeDocs y comparte experiencias de programación con IA con miles de desarrolladores. Explora la filosofía Vibe Coding, obtén los últimos tutoriales y soporte técnico."
layout: doc
---

# Únete a la gran familia de OpenCodeDocs <Badge type="tip" text="Comunidad Vibe Coding" />

La filosofía central aquí es **Vibe Coding & Vibe Writing**. Ya seas un ingeniero experimentado o un explorador de IA, siempre que estés dispuesto a crear valor con IA, eres bienvenido a unirte.

## 🤝 Nuestra comunidad

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const groups = [
  {
    icon: 'ph-wechat-logo',
    color: 'text-[#07C160]',
    bg: 'bg-[#07C160]/10',
    title: 'Añadir asistente',
    desc: 'Nota "AI" para invitación',
    qr: '/images/community/wechat-helper.png'
  },
  {
    icon: 'ph-users-three',
    color: 'text-[#07C160]',
    bg: 'bg-[#07C160]/10',
    title: 'Unirse al grupo de WeChat',
    desc: 'Comunicación instantánea, compartir recursos',
    qr: '/images/community/wechat-group.png'
  },
  {
    icon: 'ph-messenger-logo',
    color: 'text-[#12B7F5]',
    bg: 'bg-[#12B7F5]/10',
    title: 'Unirse al grupo de QQ',
    desc: 'Recursos acumulados, compartir archivos',
    qr: '/images/community/qq-group.png'
  },
  {
    icon: 'ph-newspaper',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    title: 'Seguir cuenta oficial',
    desc: 'No te pierdas ningún tutorial profundo',
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

### ¿Qué es Vibe Coding?
Una forma completamente nueva de programar: no necesitas dominar la sintaxis, solo expresar tus ideas con claridad. La IA se encarga de implementar el código, mientras tú diriges la dirección y el ambiente (Vibe). Creemos que en el futuro, todos serán creadores.

### Soy principiante, ¿puedo entenderlo?
Absolutamente sin problemas. En la comunidad hay muchos miembros sin experiencia técnica (gestores de productos, diseñadores, estudiantes, etc.), todos están usando herramientas de IA para construir sus ideas.

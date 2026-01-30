---
title: "Community: AI Programming austauschen | OpenCodeDocs"
sidebarTitle: "Finde die Gruppe"
subtitle: "Community: AI Programming austauschen | OpenCodeDocs"
description: "Trete der OpenCodeDocs Entwickler-Community bei und tausche dich mit Tausenden von Entwicklern über AI-Programmierung aus. Entdecke die Vibe Coding Philosophie, erhalte die neuesten Tutorials und technische Unterstützung."
layout: doc
---

# Der OpenCodeDocs Familie beitreten <Badge type="tip" text="Vibe Coding Community" />

Das Kernkonzept hier ist **Vibe Coding & Vibe Writing**. Egal ob du ein erfahrener Ingenieur bist oder ein AI-Entdecker, solange du bereit bist, mit AI Werte zu schaffen, bist du herzlich willkommen.

## 🤝 Unsere Community

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const groups = [
  {
    icon: 'ph-wechat-logo',
    color: 'text-[#07C160]',
    bg: 'bg-[#07C160]/10',
    title: 'Assistent hinzufügen',
    desc: 'Mit AI-Notiz zur Gruppe einladen',
    qr: '/images/community/wechat-helper.png'
  },
  {
    icon: 'ph-users-three',
    color: 'text-[#07C160]',
    bg: 'bg-[#07C160]/10',
    title: 'WeChat-Gruppe beitreten',
    desc: 'Sofortiger Austausch, nützliche Inhalte',
    qr: '/images/community/wechat-group.png'
  },
  {
    icon: 'ph-messenger-logo',
    color: 'text-[#12B7F5]',
    bg: 'bg-[#12B7F5]/10',
    title: 'QQ-Gruppe beitreten',
    desc: 'Ressourcen sammeln, Dateien teilen',
    qr: '/images/community/qq-group.png'
  },
  {
    icon: 'ph-newspaper',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    title: 'Offizieller Account folgen',
    desc: 'Verpasse kein tiefgründiges Tutorial',
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

## 💡 Über Vibe Coding

### Was ist Vibe Coding?
Eine völlig neue Art zu programmieren – du musst keine Syntax beherrschen, sondern deine Ideen klar ausdrücken können. AI übernimmt die Code-Implementierung, du bist für die Richtung und die Atmosphäre (Vibe) verantwortlich. Wir glauben, dass in der Zukunft jeder ein Kreativer sein wird.

### Bin ich Anfänger, kann ich das verstehen?
Gar kein Problem. In der Community gibt es viele Mitglieder ohne technischen Hintergrund (Produktmanager, Designer, Studenten usw.), die alle AI-Tools nutzen, um ihre Ideen zu verwirklichen.

---
title: "Community: Connect, Share, and Learn AI Programming | OpenCodeDocs"
sidebarTitle: "Find Your Community"
subtitle: "Community: Connect, Share, and Learn AI Programming | OpenCodeDocs"
description: "Join the OpenCodeDocs developer community to connect with thousands of developers exploring AI programming. Discover the Vibe Coding philosophy, access the latest tutorials, and get technical support."
layout: doc
---

# Join the OpenCodeDocs Family <Badge type="tip" text="Vibe Coding Community" />

The core philosophy here is **Vibe Coding & Vibe Writing**. Whether you're a seasoned engineer or an AI explorer, as long as you're willing to use AI to create value, you're welcome to join us.

## 🤝 Our Community

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const groups = [
  {
    icon: 'ph-wechat-logo',
    color: 'text-[#07C160]',
    bg: 'bg-[#07C160]/10',
    title: 'Add Helper',
    desc: 'Add helper with note "AI"',
    qr: '/images/community/wechat-helper.png'
  },
  {
    icon: 'ph-users-three',
    color: 'text-[#07C160]',
    bg: 'bg-[#07C160]/10',
    title: 'Join WeChat Group',
    desc: 'Real-time chat and knowledge sharing',
    qr: '/images/community/wechat-group.png'
  },
  {
    icon: 'ph-messenger-logo',
    color: 'text-[#12B7F5]',
    bg: 'bg-[#12B7F5]/10',
    title: 'Join QQ Group',
    desc: 'Resource repository and file sharing',
    qr: '/images/community/qq-group.png'
  },
  {
    icon: 'ph-newspaper',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    title: 'Follow Official Account',
    desc: 'Never miss an in-depth tutorial',
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

## 💡 About Vibe Coding

### What is Vibe Coding?

A brand new approach to programming—you don't need to master syntax, just express your ideas clearly. AI implements the code, while you provide direction and set the vibe. We believe that everyone will be a creator in the future.

### I'm a beginner, can I understand this?

Absolutely no problem. The community has many members from non-technical backgrounds (product managers, designers, students, etc.), and everyone is using AI tools to bring their ideas to life.

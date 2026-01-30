---
title: "社群: 交流 AI 程式設計 | OpenCodeDocs"
sidebarTitle: "找到組織"
subtitle: "社群: 交流 AI 程式設計 | OpenCodeDocs"
description: "加入 OpenCodeDocs 開發者社群，與數千名開發者交流 AI 程式設計經驗。探索 Vibe Coding 理念，獲取最新教程和技術支援。"
layout: doc
---

# 加入 OpenCodeDocs 大家庭 <Badge type="tip" text="Vibe Coding 社群" />

這裡的核心理念是 **Vibe Coding & Vibe Writing**。無論你是資深工程師，還是 AI 探索者，只要你願意使用 AI 創造價值，都歡迎加入。

## 🤝 我們的社群

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const groups = [
  {
    icon: 'ph-wechat-logo',
    color: 'text-[#07C160]',
    bg: 'bg-[#07C160]/10',
    title: '添加小助手',
    desc: '備註 AI 邀請入群',
    qr: '/images/community/wechat-helper.png'
  },
  {
    icon: 'ph-users-three',
    color: 'text-[#07C160]',
    bg: 'bg-[#07C160]/10',
    title: '加入微信交流群',
    desc: '即時交流，乾貨分享',
    qr: '/images/community/wechat-group.png'
  },
  {
    icon: 'ph-messenger-logo',
    color: 'text-[#12B7F5]',
    bg: 'bg-[#12B7F5]/10',
    title: '加入 QQ 交流群',
    desc: '沈澱資源，檔案共享',
    qr: '/images/community/qq-group.png'
  },
  {
    icon: 'ph-newspaper',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    title: '關注公眾號',
    desc: '不錯過任何一篇深度教程',
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

## 💡 關於 Vibe Coding

### 什麼是 Vibe Coding？
一種全新的程式設計方式——你不需要精通語法，只需要清晰地表達想法。AI 負責實現代碼，你負責把握方向和氛圍 (Vibe)。我們相信，未來每個人都是創造者。

### 我是小白，能聽懂嗎？
完全沒問題。社群裡有大量非技術背景的成員（產品經理、設計師、學生等），大家都在用 AI 工具構建自己的想法。

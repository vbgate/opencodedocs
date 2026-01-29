---
title: "社群: 交流 AI 编程 | OpenCodeDocs"
sidebarTitle: "找到组织"
subtitle: "社群: 交流 AI 编程 | OpenCodeDocs"
description: "加入 OpenCodeDocs 开发者社群，与数千名开发者交流 AI 编程经验。探索 Vibe Coding 理念，获取最新教程和技术支持。"
layout: doc
---

# 加入 OpenCodeDocs 大家庭 <Badge type="tip" text="Vibe Coding 社群" />

这里的核心理念是 **Vibe Coding & Vibe Writing**。无论你是资深工程师，还是 AI 探索者，只要你愿意使用 AI 创造价值，都欢迎加入。

## 🤝 我们的社群

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const groups = [
  {
    icon: 'ph-wechat-logo',
    color: 'text-[#07C160]',
    bg: 'bg-[#07C160]/10',
    title: '添加小助手',
    desc: '备注 AI 邀请入群',
    qr: '/images/community/wechat-helper.png'
  },
  {
    icon: 'ph-users-three',
    color: 'text-[#07C160]',
    bg: 'bg-[#07C160]/10',
    title: '加入微信交流群',
    desc: '即时交流，干货分享',
    qr: '/images/community/wechat-group.png'
  },
  {
    icon: 'ph-messenger-logo',
    color: 'text-[#12B7F5]',
    bg: 'bg-[#12B7F5]/10',
    title: '加入 QQ 交流群',
    desc: '沉淀资源，文件共享',
    qr: '/images/community/qq-group.png'
  },
  {
    icon: 'ph-newspaper',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    title: '关注公众号',
    desc: '不错过任何一篇深度教程',
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

## 💡 关于 Vibe Coding

### 什么是 Vibe Coding？
一种全新的编程方式——你不需要精通语法，只需要清晰地表达想法。AI 负责实现代码，你负责把握方向和氛围 (Vibe)。我们相信，未来每个人都是创造者。

### 我是小白，能听懂吗？
完全没问题。社群里有大量非技术背景的成员（产品经理、设计师、学生等），大家都在用 AI 工具构建自己的想法。

---
title: "コミュニティ：AI プログラミングの交流 | OpenCodeDocs"
sidebarTitle: "コミュニティを見つける"
subtitle: "コミュニティ：AI プログラミングの交流 | OpenCodeDocs"
description: "OpenCodeDocs 開発者コミュニティに参加し、数千人の開発者と AI プログラミングの経験を交流しましょう。Vibe Coding の理念を探求し、最新のチュートリアルと技術サポートを入手できます。"
layout: doc
---

# OpenCodeDocs ファミリーに参加しよう <Badge type="tip" text="Vibe Coding コミュニティ" />

ここでの核心理念は **Vibe Coding & Vibe Writing** です。ベテランエンジニアでも AI 探求者でも、AI を使って価値を創造したい方なら誰でも参加できます。

## 🤝 私たちのコミュニティ

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const groups = [
  {
    icon: 'ph-wechat-logo',
    color: 'text-[#07C160]',
    bg: 'bg-[#07C160]/10',
    title: 'アシスタントを追加',
    desc: 'AI とメモしてグループ招待',
    qr: '/images/community/wechat-helper.png'
  },
  {
    icon: 'ph-users-three',
    color: 'text-[#07C160]',
    bg: 'bg-[#07C160]/10',
    title: 'WeChat グループに参加',
    desc: '即時交流、実用的な情報の共有',
    qr: '/images/community/wechat-group.png'
  },
  {
    icon: 'ph-messenger-logo',
    color: 'text-[#12B7F5]',
    bg: 'bg-[#12B7F5]/10',
    title: 'QQ グループに参加',
    desc: 'リソースの蓄積、ファイルの共有',
    qr: '/images/community/qq-group.png'
  },
  {
    icon: 'ph-newspaper',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    title: '公式アカウントをフォロー',
    desc: '深いチュートリアルを見逃さない',
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

## 💡 Vibe Coding について

### Vibe Coding とは？
全く新しいプログラミング手法——文法を完全に理解する必要はなく、アイデアを明確に表現するだけで十分です。AI がコード実装を担当し、あなたは方向性と雰囲気をコントロールします。私たちは、未来のすべての人が創造者になれると信じています。

### 初心者でも理解できますか？
完全に問題ありません。コミュニティには多くの技術的背景がないメンバー（プロダクトマネージャー、デザイナー、学生など）がおり、すべての人が AI ツールを使って自分のアイデアを構築しています。

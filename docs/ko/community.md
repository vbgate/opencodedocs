---
title: "커뮤니티: AI 코딩 교류 | OpenCodeDocs"
sidebarTitle: "조직 찾기"
subtitle: "커뮤니티: AI 코딩 교류 | OpenCodeDocs"
description: "OpenCodeDocs 개발자 커뮤니티에 가입하여 수천 명의 개발자와 AI 코딩 경험을 교류하세요. Vibe Coding 철학을 탐구하고, 최신 튜토리얼과 기술 지원을 받으세요."
layout: doc
---

# OpenCodeDocs 대가족에 참여하세요 <Badge type="tip" text="Vibe Coding 커뮤니티" />

여기의 핵심 철학은 **Vibe Coding & Vibe Writing**입니다. 당신이 숙련된 엔지니어든, AI 탐구자든, AI를 사용하여 가치를 창출하고 싶다면 누구나 환영합니다.

## 🤝 우리 커뮤니티

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const groups = [
  {
    icon: 'ph-wechat-logo',
    color: 'text-[#07C160]',
    bg: 'bg-[#07C160]/10',
    title: '도우미 추가',
    desc: 'AI라고 적으면 그룹 초대',
    qr: '/images/community/wechat-helper.png'
  },
  {
    icon: 'ph-users-three',
    color: 'text-[#07C160]',
    bg: 'bg-[#07C160]/10',
    title: '위챗 교류 그룹',
    desc: '실시간 소통, 유용한 정보 공유',
    qr: '/images/community/wechat-group.png'
  },
  {
    icon: 'ph-messenger-logo',
    color: 'text-[#12B7F5]',
    bg: 'bg-[#12B7F5]/10',
    title: 'QQ 교류 그룹',
    desc: '자원 축적, 파일 공유',
    qr: '/images/community/qq-group.png'
  },
  {
    icon: 'ph-newspaper',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    title: '공식 계정 팔로우',
    desc: '심도 있는 튜토리얼을 놓치지 마세요',
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
       <img :src="group.qr" :alt="group.title" class="w-full h-full object-cover" />
    </div>
  </div>
</div>

## 💡 Vibe Coding에 대해

### Vibe Coding이란?
전혀 새로운 코딩 방식 - 문법을 완벽히 마스터할 필요 없이, 생각을 명확하게 표현하기만 하면 됩니다. AI가 코드 구현을 담당하고, 당신은 방향과 분위기(Vibe)를 이끌어갑니다. 우리는 미래의 모든 사람이 창작자가 될 것이라 믿습니다.

### 초보자도 이해할 수 있나요?
전혀 문제없습니다. 커뮤니티에는 기술적 배경이 없는 많은 회원(제품 관리자, 디자이너, 학생 등)이 있으며, 모두 AI 도구를 사용하여 자신의 아이디어를 구현하고 있습니다.

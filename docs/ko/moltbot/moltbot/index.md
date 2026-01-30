---
layout: page
pageClass: project-home-page
sidebar: false
title: clawdbot
sidebarTitle: "나만의 AI 어시스턴트 만들기"
description: 개인 AI 어시스턴트, 언제 어디서나 사용 가능
---

<script setup>
import data from './project.json'
import ProjectHome from '../../../.vitepress/theme/components/ProjectHome.vue'
</script>

<ProjectHome :data="data" />

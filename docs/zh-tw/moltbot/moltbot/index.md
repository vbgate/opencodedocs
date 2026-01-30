---
layout: page
pageClass: project-home-page
sidebar: false
title: clawdbot
sidebarTitle: "打造你的 AI 助手"
description: 你的私有 AI 助手，隨處可用
---

<script setup>
import data from './project.json'
import ProjectHome from '../../../../.vitepress/theme/components/ProjectHome.vue'
</script>

<ProjectHome :data="data" />

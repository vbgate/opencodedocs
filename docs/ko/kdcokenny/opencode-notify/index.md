---
layout: page
pageClass: project-home-page
sidebar: false
title: "opencode-notify"
sidebarTitle: "집중할 때의 부드러운 알림"
description: "OpenCode AI가 집중하는 동안 부드럽게 알려드립니다"
---

<script setup>
import data from './project.json'
import ProjectHome from '../../../.vitepress/theme/components/ProjectHome.vue'
</script>

<ProjectHome :data="data" />

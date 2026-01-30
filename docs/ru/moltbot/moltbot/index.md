---
layout: page
pageClass: project-home-page
sidebar: false
title: clawdbot
sidebarTitle: "Создайте своего ИИ-ассистента"
description: Ваш личный ИИ-ассистент, доступный везде
---

<script setup>
import data from './project.json'
import ProjectHome from '../../../.vitepress/theme/components/ProjectHome.vue'
</script>

<ProjectHome :data="data" />

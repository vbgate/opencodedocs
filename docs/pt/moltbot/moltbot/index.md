---
layout: page
pageClass: project-home-page
sidebar: false
title: "clawdbot"
sidebarTitle: "Crie Seu Assistente de IA"
description: "Seu assistente de IA privado, disponível em qualquer lugar"
---

<script setup>
import data from './project.json'
import ProjectHome from '../../.vitepress/theme/components/ProjectHome.vue'
</script>

<ProjectHome :data="data" />

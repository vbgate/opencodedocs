---
layout: page
pageClass: project-home-page
sidebar: false
title: "clawdbot"
sidebarTitle: "Construye tu asistente de IA"
description: "Tu asistente de IA privado, disponible en cualquier lugar"
---

<script setup>
import data from './project.json'
import ProjectHome from '../../../.vitepress/theme/components/ProjectHome.vue'
</script>

<ProjectHome :data="data" />

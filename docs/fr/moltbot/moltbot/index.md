---
layout: page
pageClass: project-home-page
sidebar: false
title: clawdbot
sidebarTitle: "Créez votre assistant IA"
description: "Votre assistant IA privé, disponible partout"
---

<script setup>
import data from './project.json'
import ProjectHome from '../../.vitepress/theme/components/ProjectHome.vue'
</script>

<ProjectHome :data="data" />

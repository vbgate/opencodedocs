---
layout: page
pageClass: project-home-page
sidebar: false
title: clawdbot
sidebarTitle: "Erstelle deinen KI-Assistenten"
description: "Dein privater KI-Assistent, überall verfügbar"
---

<script setup>
import data from './project.json'
import ProjectHome from '../../../.vitepress/theme/components/ProjectHome.vue'
</script>

<ProjectHome :data="data" />

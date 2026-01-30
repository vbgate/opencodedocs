---
layout: page
pageClass: project-home-page
sidebar: false
title: "agent-app-factory"
description: "1 Ideia, 7 Passos para o App"
---

<script setup>
import data from './project.json'
import ProjectHome from '../../.vitepress/theme/components/ProjectHome.vue'
</script>

<ProjectHome :data="data" />

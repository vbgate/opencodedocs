---
layout: page
pageClass: project-home-page
sidebar: false
title: "agent-app-factory"
description: "1 Idée, 7 Étapes vers une App"
---

<script setup>
import data from './project.json'
import ProjectHome from '../../../.vitepress/theme/components/ProjectHome.vue'
</script>

<ProjectHome :data="data" />

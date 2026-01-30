---
layout: page
pageClass: project-home-page
sidebar: false
title: "agent-app-factory"
description: "1 Idea, 7 Pasos para la App"
---

<script setup>
import data from './project.json'
import ProjectHome from '../../../.vitepress/theme/components/ProjectHome.vue'
</script>

<ProjectHome :data="data" />

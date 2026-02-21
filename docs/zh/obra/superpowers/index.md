---
layout: page
pageClass: project-home-page
sidebar: false
title: superpowers
description: 让 AI 编码代理遵循最佳实践
---

<script setup>
import data from './project.json'
import ProjectHome from '../../../.vitepress/theme/components/ProjectHome.vue'
</script>

<ProjectHome :data="data" />

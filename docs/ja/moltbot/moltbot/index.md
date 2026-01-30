---
layout: page
pageClass: project-home-page
sidebar: false
title: "clawdbot"
sidebarTitle: "あなたの AI アシスタントを作ろう"
description: "あなたのプライベート AI アシスタント、どこでも使える"
---

<script setup>
import data from './project.json'
import ProjectHome from '../../../../.vitepress/theme/components/ProjectHome.vue'
</script>

<ProjectHome :data="data" />

---
layout: page
pageClass: project-home-page
sidebar: false
title: "opencode-notify"
sidebarTitle: "集中力を高める優しいリマインダー"
description: "OpenCode AI が集中しているあなたに優しくリマインダーします"
---

<script setup>
import data from './project.json'
import ProjectHome from '../../../.vitepress/theme/components/ProjectHome.vue'
</script>

<ProjectHome :data="data" />

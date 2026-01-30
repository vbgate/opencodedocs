---
layout: page
pageClass: project-home-page
sidebar: false
title: "agent-app-factory"
description: "1개의 아이디어, 7단계로 앱 만들기"
---

<script setup>
import data from './project.json'
import ProjectHome from '../../../.vitepress/theme/components/ProjectHome.vue'
</script>

<ProjectHome :data="data" />

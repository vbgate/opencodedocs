---
layout: page
pageClass: project-home-page
sidebar: false
title: "superpowers"
description: "Make AI coding agents follow best practices"
---

<script setup>
import data from './project.json'
import ProjectHome from '../../.vitepress/theme/components/ProjectHome.vue'
</script>

<ProjectHome :data="data" />

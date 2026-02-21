---
layout: page
pageClass: project-home-page
sidebar: false
title: "OpenSkills: Загрузчик навыков | openskills"
sidebarTitle: "Навыки для ИИ"
subtitle: "OpenSkills: Загрузчик навыков | openskills"
description: "Изучите использование загрузчика навыков OpenSkills. Быстро загружайте пользовательские навыки, расширяйте возможности ИИ-агентов с поддержкой горячей замены и управления версиями."
---

<script setup>
import data from './project.json'
import ProjectHome from '../../../.vitepress/theme/components/ProjectHome.vue'
</script>

<ProjectHome :data="data" />

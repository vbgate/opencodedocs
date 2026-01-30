---
layout: page
pageClass: project-home-page
sidebar: false
title: "OpenSkills: Carregador de Habilidades | openskills"
sidebarTitle: "Adicione Habilidades ao AI"
subtitle: "OpenSkills: Carregador de Habilidades | openskills"
description: "Aprenda a usar o carregador de habilidades OpenSkills. Carregue rapidamente habilidades personalizadas, expanda as capacidades do agente AI, suporte hot reload e gerenciamento de versão."
---

<script setup>
import data from './project.json'
import ProjectHome from '../../../.vitepress/theme/components/ProjectHome.vue'
</script>

<ProjectHome :data="data" />

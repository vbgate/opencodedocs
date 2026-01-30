---
title: "Avanzado: Gestión del Ecosistema de Skills | opencode-agent-skills"
sidebarTitle: "Dominar Ecosistemas de Skills Complejos"
subtitle: "Funciones Avanzadas"
order: 3
description: "Domina las funciones avanzadas de opencode-agent-skills, incluyendo compatibilidad con Claude Code, integración con Superpowers, espacios de nombres y mecanismos de compresión de contexto para mejorar la gestión de skills."
---

# Funciones Avanzadas

Este capítulo profundiza en las funciones avanzadas de OpenCode Agent Skills, incluyendo compatibilidad con Claude Code, integración con flujos de trabajo de Superpowers, sistema de prioridades de espacios de nombres y mecanismos de recuperación por compresión de contexto. Al dominar estos contenidos, podrás gestionar mejor ecosistemas de skills complejos y asegurar que los skills estén siempre disponibles en sesiones prolongadas.

## Prerrequisitos

::: warning Por favor confirma antes de comenzar
Antes de estudiar este capítulo, asegúrate de haber completado:

- [Instalar OpenCode Agent Skills](../start/installation/) - El plugin está instalado y funcionando correctamente
- [Crear tu primera skill](../start/creating-your-first-skill/) - Comprender la estructura básica de las skills
- [Mecanismo de descubrimiento de skills en detalle](../platforms/skill-discovery-mechanism/) - Entender desde qué ubicaciones se descubren las skills
- [Cargar skills en el contexto de la sesión](../platforms/loading-skills-into-context/) - Dominar el uso de la herramienta `use_skill`
:::

## Contenido de este capítulo

<div class="grid-cards">

<a href="./claude-code-compatibility/" class="card">
  <h3>Compatibilidad de Skills con Claude Code</h3>
  <p>Comprende cómo el plugin es compatible con el sistema de skills y plugins de Claude Code, domina el mecanismo de mapeo de herramientas y reutiliza el ecosistema de skills de Claude.</p>
</a>

<a href="./superpowers-integration/" class="card">
  <h3>Integración con Flujos de Trabajo Superpowers</h3>
  <p>Configura y utiliza el modo Superpowers para obtener orientación estricta en flujos de trabajo de desarrollo de software, mejorando la eficiencia del desarrollo y la calidad del código.</p>
</a>

<a href="./namespaces-and-priority/" class="card">
  <h3>Espacios de Nombres y Prioridad de Skills</h3>
  <p>Comprende el sistema de espacios de nombres de las skills y las reglas de prioridad de descubrimiento, resuelve conflictos de skills con el mismo nombre y controla precisamente las fuentes de las skills.</p>
</a>

<a href="./context-compaction-resilience/" class="card">
  <h3>Mecanismo de Recuperación por Compresión de Contexto</h3>
  <p>Comprende cómo las skills mantienen su disponibilidad en sesiones prolongadas, domina los momentos de activación del proceso de recuperación por compresión.</p>
</a>

</div>

## Ruta de Aprendizaje

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Orden de Aprendizaje Recomendado                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   1. Compatibilidad Claude Code  ──→  2. Integración Superpowers  ──→  3. Espacios de Nombres │
│         │                              │                              │             │
│         ▼                              ▼                              ▼             │
│   Reutilizar skills de Claude  Habilitar orientación de flujo  Control preciso de fuentes │
│                                                                         │
│                                         │                               │
│                                         ▼                               │
│                                                                         │
│                              4. Recuperación por Compresión              │
│                                         │                               │
│                                         ▼                               │
│                              Persistencia de skills en sesiones largas   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Se recomienda aprender en orden**:

1. **Aprende primero la compatibilidad con Claude Code** - Si tienes skills de Claude Code o quieres usar skills del marketplace de plugins de Claude, este es el primer paso
2. **Luego la integración con Superpowers** - Para usuarios que desean orientación estricta en flujos de trabajo, aprende cómo habilitarla y configurarla
3. **Después los espacios de nombres** - Cuando el número de skills aumenta y surgen conflictos con el mismo nombre, este conocimiento es clave
4. **Finalmente la recuperación por compresión** - Comprende cómo las skills mantienen su disponibilidad en sesiones prolongadas, contenido más teórico

::: tip Aprende según tus necesidades
- **Migrando desde Claude Code**: Enfócate en las lecciones 1 (compatibilidad) y 3 (espacios de nombres)
- **Buscas normativas de flujo de trabajo**: Enfócate en la lección 2 (Superpowers)
- **Enfrentas conflictos de skills**: Ve directamente a la lección 3 (espacios de nombres)
- **Skills se pierden en sesiones largas**: Ve directamente a la lección 4 (recuperación por compresión)
:::

## Siguientes pasos

Después de completar este capítulo, puedes continuar aprendiendo:

- [Solución de problemas comunes](../faq/troubleshooting/) - Consulta la guía de resolución de problemas cuando encuentres dificultades
- [Consideraciones de seguridad](../faq/security-considerations/) - Comprende los mecanismos de seguridad del plugin y las mejores prácticas
- [Referencia de herramientas API](../appendix/api-reference/) - Consulta los parámetros detallados y valores de retorno de todas las herramientas disponibles
- [Mejores prácticas de desarrollo de skills](../appendix/best-practices/) - Domina las técnicas y normativas para escribir skills de alta calidad

<style>
.grid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.grid-cards .card {
  display: block;
  padding: 1.25rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: border-color 0.25s, box-shadow 0.25s;
}

.grid-cards .card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.grid-cards .card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.grid-cards .card p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
</style>

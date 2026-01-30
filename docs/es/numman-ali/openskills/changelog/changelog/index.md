---
title: "Registro de Cambios: Actualizaciones de Funciones | OpenSkills"
sidebarTitle: "Conoce las Novedades"
subtitle: "Registro de Cambios: Actualizaciones de Funciones | OpenSkills"
description: "Consulta el historial de cambios de versiones de OpenSkills. Conoce las nuevas funciones como el comando update, enlaces simbólicos, repositorios privados, así como mejoras importantes como la protección contra recorrido de rutas y correcciones de problemas."
tags:
  - "changelog"
  - "historial de versiones"
order: 1
---

# Registro de Cambios

Esta página documenta el historial de cambios de versiones de OpenSkills, ayudándote a comprender las nuevas funciones, mejoras y correcciones de problemas de cada versión.

---

## [1.5.0] - 2026-01-17

### Nuevas Funciones

- **`openskills update`** - Actualiza las habilidades instaladas desde las fuentes registradas (por defecto: actualiza todas)
- **Seguimiento de Metadatos de Origen** - Ahora se registra información de origen durante la instalación para actualizar las habilidades de manera confiable

### Mejoras

- **Lectura de Múltiples Habilidades** - El comando `openskills read` ahora admite una lista de nombres de habilidades separados por comas
- **Generación de Instrucciones de Uso** - Optimizado el mensaje de invocación del comando read en entornos shell
- **README** - Añadida guía de actualización e indicaciones de uso manual

### Correcciones de Errores

- **Optimización de Experiencia de Actualización** - Omite habilidades sin metadatos de origen y lista estas habilidades para indicar reinstalación

---

## [1.4.0] - 2026-01-17

### Mejoras

- **README** - Clarificado el método de instalación predeterminado local del proyecto, eliminado el mensaje de sincronización redundante
- **Mensajes de Instalación** - El instalador ahora distingue claramente entre la instalación predeterminada local del proyecto y la opción `--global`

---

## [1.3.2] - 2026-01-17

### Mejoras

- **Documentación y Guía AGENTS.md** - Todos los ejemplos de comandos e instrucciones de uso generadas ahora usan `npx openskills` de manera uniforme

---

## [1.3.1] - 2026-01-17

### Correcciones de Errores

- **Instalación en Windows** - Corregido el problema de validación de ruta en sistemas Windows ("Security error: Installation path outside target directory")
- **Versión CLI** - `npx openskills --version` ahora lee correctamente el número de versión de package.json
- **SKILL.md en Directorio Raíz** - Corregido el problema de instalación de repositorios de habilidades individuales con SKILL.md en el directorio raíz

---

## [1.3.0] - 2025-12-14

### Nuevas Funciones

- **Soporte de Enlaces Simbólicos** - Las habilidades ahora pueden instalarse en el directorio de habilidades mediante enlaces simbólicos ([#3](https://github.com/numman-ali/openskills/issues/3))
  - Admite actualizaciones de habilidades basadas en git mediante la creación de enlaces simbólicos desde repositorios clonados
  - Admite flujos de trabajo de desarrollo local de habilidades
  - Los enlaces simbólicos dañados se omiten elegantemente

- **Ruta de Salida Configurable** - El comando sync añade la opción `--output` / `-o` ([#5](https://github.com/numman-ali/openskills/issues/5))
  - Puede sincronizarse a cualquier archivo `.md` (como `.ruler/AGENTS.md`)
  - Si el archivo no existe, crea automáticamente el archivo y añade el título
  - Crea automáticamente directorios anidados si es necesario

- **Instalación desde Ruta Local** - Admite la instalación de habilidades desde directorios locales ([#10](https://github.com/numman-ali/openskills/issues/10))
  - Admite rutas absolutas (`/path/to/skill`)
  - Admite rutas relativas (`./skill`, `../skill`)
  - Admite expansión de tilde (`~/my-skills/skill`)

- **Soporte de Repositorios Git Privados** - Admite la instalación de habilidades desde repositorios privados ([#10](https://github.com/numman-ali/openskills/issues/10))
  - URLs SSH (`git@github.com:org/private-skills.git`)
  - URLs HTTPS con autenticación
  - Usa automáticamente las claves SSH del sistema

- **Suite de Pruebas Completa** - 88 pruebas en 6 archivos de prueba
  - Pruebas unitarias de detección de enlaces simbólicos, análisis YAML
  - Pruebas de integración de comandos install, sync
  - Pruebas de extremo a extremo del flujo de trabajo completo de CLI

### Mejoras

- **La bandera `--yes` ahora omite todos los avisos** - Modo completamente no interactivo, adecuado para CI/CD ([#6](https://github.com/numman-ali/openskills/issues/6))
  - No solicita confirmación al sobrescribir habilidades existentes
  - Muestra el mensaje `Overwriting: <skill-name>` al omitir avisos
  - Todos los comandos ahora pueden ejecutarse en entornos sin interfaz

- **Reordenamiento del Flujo de Trabajo CI** - Los pasos de construcción ahora se ejecutan antes que las pruebas
  - Asegura que `dist/cli.js` exista para pruebas de extremo a extremo

### Seguridad

- **Protección contra Recorrido de Rutas** - Verifica que la ruta de instalación se mantenga dentro del directorio de destino
- **Desreferenciación de Enlaces Simbólicos** - `cpSync` usa `dereference: true` para copiar de manera segura los destinos de enlaces simbólicos
- **Regex YAML No Codicioso** - Previene posibles ataques ReDoS en el análisis de frontmatter

---

## [1.2.1] - 2025-10-27

### Correcciones de Errores

- Limpieza de documentación README - Eliminadas secciones duplicadas y marcas incorrectas

---

## [1.2.0] - 2025-10-27

### Nuevas Funciones

- Bandera `--universal`, instala habilidades en `.agent/skills/` en lugar de `.claude/skills/`
  - Aplicable a entornos de múltiples agentes (Claude Code + Cursor/Windsurf/Aider)
  - Evita conflictos con el complemento del mercado nativo de Claude Code

### Mejoras

- La instalación local del proyecto ahora es la opción predeterminada (anteriormente era instalación global)
- Las habilidades se instalan por defecto en `./.claude/skills/`

---

## [1.1.0] - 2025-10-27

### Nuevas Funciones

- README de una sola página completo con análisis técnico profundo
- Comparación paralela con Claude Code

### Correcciones de Errores

- La etiqueta de ubicación ahora muestra correctamente `project` o `global` según la ubicación de instalación

---

## [1.0.0] - 2025-10-26

### Nuevas Funciones

- Versión inicial
- `npx openskills install <source>` - Instala habilidades desde repositorios de GitHub
- `npx openskills sync` - Genera XML `<available_skills>` para AGENTS.md
- `npx openskills list` - Muestra las habilidades instaladas
- `npx openskills read <name>` - Carga el contenido de habilidades para agentes
- `npx openskills manage` - Eliminación interactiva de habilidades
- `npx openskills remove <name>` - Elimina una habilidad específica
- Interfaz TUI interactiva para todos los comandos
- Soporte para el formato SKILL.md de Anthropic
- Divulgación progresiva (carga habilidades bajo demanda)
- Soporte de recursos empaquetados (references/, scripts/, assets/)

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Click para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-24

| Función           | Ruta de Archivo                                                                      |
|--- | ---|
| Changelog Original   | [`CHANGELOG.md`](https://github.com/numman-ali/openskills/blob/main/CHANGELOG.md) |

</details>

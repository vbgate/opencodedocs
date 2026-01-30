---
title: "CLI vs MCP: Elección de Diseño | OpenSkills"
sidebarTitle: "¿Por qué CLI en lugar de MCP"
subtitle: "¿Por qué CLI en lugar de MCP?"
description: "Aprende las razones de diseño por las que OpenSkills eligió CLI en lugar de MCP. Compara las diferencias de posicionamiento entre ambos, entiende por qué el sistema de habilidades es adecuado para el modo de archivos estáticos, y cómo lograr universalidad multi-agente y despliegue de configuración cero."
tags:
  - "FAQ"
  - "Filosofía de Diseño"
  - "MCP"
prerequisite:
  - "start-what-is-openskills"
order: 3
---

# ¿Por qué CLI en lugar de MCP?

## Lo que Aprenderás

Esta lección te ayudará a entender:

- ✅ Entender las diferencias de posicionamiento entre MCP y el sistema de habilidades
- ✅ Comprender por qué CLI es más adecuado para cargar habilidades
- ✅ Dominar la filosofía de diseño de OpenSkills
- ✅ Entender los principios técnicos del sistema de habilidades

## Tu Dilema Actual

Podrías estar pensando:

- "¿Por qué no usar el protocolo MCP más avanzado?"
- "¿La forma CLI no es demasiado antigua?"
- "¿MCP no es más adecuada para la era de IA?"

Esta lección te ayuda a entender las consideraciones técnicas detrás de estas decisiones de diseño.

---

## Pregunta Central: ¿Qué es una Habilidad?

Antes de discutir CLI vs MCP, primero entendamos la esencia de "habilidad".

### Esencia de la Habilidad

::: info Definición de Habilidad
Una habilidad es una combinación de **instrucciones estáticas + recursos**, incluyendo:
- `SKILL.md`: Guía detallada de operación y prompts
- `references/`: Documentación de referencia
- `scripts/`: Scripts ejecutables
- `assets/`: Recursos como imágenes, plantillas, etc.

Una habilidad **no** es un servicio dinámico, una API en tiempo real o una herramienta que necesita ejecutar un servidor.
:::

### Diseño Oficial de Anthropic

El sistema de habilidades de Anthropic está diseñado basado en el **sistema de archivos**:

- Las habilidades existen como archivos `SKILL.md`
- Se describen habilidades disponibles a través del bloque XML `<available_skills>`
- El agente de IA lee el contenido del archivo al contexto bajo demanda

Esto determina que la selección técnica del sistema de habilidades debe ser compatible con el sistema de archivos.

---

## MCP vs OpenSkills: Comparación de Posicionamiento

| Dimensión | MCP (Model Context Protocol) | OpenSkills (CLI) |
|--- | --- |---|
| **Escenario Aplicable** | Herramientas dinámicas, llamadas API en tiempo real | Instrucciones estáticas, documentos, scripts |
| **Requisitos de Ejecución** | Requiere servidor MCP | Sin servidor (pura archivo) |
| **Soporte de Agentes** | Solo agentes que soportan MCP | Todos los agentes que pueden leer `AGENTS.md` |
| **Complejidad** | Requiere despliegue y mantenimiento de servidor | Configuración cero, listo para usar |
| **Fuente de Datos** | Obtener del servidor en tiempo real | Leer del sistema de archivos local |
| **Dependencia de Red** | Requerida | No requerida |
| **Carga de Habilidades** | A través de llamadas de protocolo | A través de lectura de archivos |

---

## ¿Por qué CLI es Más Adecuado para el Sistema de Habilidades?

### 1. Las Habilidades Son Archivos

**MCP requiere servidor**: Necesita desplegar un servidor MCP, procesar solicitudes, respuestas, handshake de protocolo...

**CLI solo requiere archivos**:

```bash
# Habilidades almacenadas en el sistema de archivos
.claude/skills/pdf/
├── SKILL.md              # Archivo de instrucciones principal
├── references/           # Documentación de referencia
│   └── pdf-format-spec.md
├── scripts/             # Scripts ejecutables
│   └── extract-pdf.py
└── assets/              # Archivos de recursos
    └── pdf-icon.png
```

**Ventajas**:
- ✅ Configuración cero, sin servidor necesario
- ✅ Las habilidades pueden ser versionadas
- ✅ Disponible sin conexión
- ✅ Despliegue simple

### 2. Universalidad: Todos los Agentes Pueden Usar

**Limitaciones de MCP**:

Solo los agentes que soportan el protocolo MCP pueden usarlo. Si agentes como Cursor, Windsurf, Aider, etc., implementan MCP individualmente, traerá:
- Trabajo de desarrollo repetido
- Problemas de compatibilidad de protocolo
- Dificultad de sincronización de versiones

**Ventajas de CLI**:

Cualquier agente que pueda ejecutar comandos shell puede usar:

```bash
# Llamada desde Claude Code
npx openskills read pdf

# Llamada desde Cursor
npx openskills read pdf

# Llamada desde Windsurf
npx openskills read pdf
```

**Costo de integración cero**: Solo requiere que el agente pueda ejecutar comandos shell.

### 3. Cumple con el Diseño Oficial

El sistema de habilidades de Anthropic es inherentemente un **diseño de sistema de archivos**, no un diseño MCP:

```xml
<!-- Descripción de habilidad en AGENTS.md -->
<available_skills>
<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit...</description>
<location>project</location>
</skill>
</available_skills>
```

**Método de llamada**:

```bash
# Método de llamada del diseño oficial
npx openskills read pdf
```

OpenSkills sigue completamente el diseño oficial de Anthropic, manteniendo la compatibilidad.

### 4. Carga Progresiva (Progressive Disclosure)

**Ventaja central del sistema de habilidades**: Cargar bajo demanda, mantener el contexto conciso.

**Implementación de CLI**:

```bash
# Solo cargar contenido de habilidad cuando sea necesario
npx openskills read pdf
# Salida: Contenido completo de SKILL.md a salida estándar
```

**Desafíos de MCP**:

Si se implementa con MCP, necesita:
- Servidor gestionando la lista de habilidades
- Implementar lógica de carga bajo demanda
- Gestionar contexto

El método CLI soporta naturalmente la carga progresiva.

---

## Escenarios Aplicables de MCP

Los problemas que MCP resuelve son **diferentes** del sistema de habilidades:

| Problemas que MCP Resuelve | Ejemplo |
|--- |---|
| **Llamadas API en Tiempo Real** | Llamar a OpenAI API, consultas a base de datos |
| **Herramientas Dinámicas** | Calculadora, servicios de conversión de datos |
| **Integración de Servicios Remotos** | Operaciones Git, sistemas CI/CD |
| **Gestión de Estado** | Herramientas que necesitan mantener el estado del servidor |

Estos escenarios requieren **servidor** y **protocolo**, MCP es la elección correcta.

---

## Sistema de Habilidades vs MCP: No Es una Relación Competitiva

**Punto clave**: MCP y el sistema de habilidades resuelven diferentes problemas, no es una elección exclusiva.

### Posicionamiento del Sistema de Habilidades

```
[Instrucciones Estáticas] → [SKILL.md] → [Sistema de Archivos] → [Carga CLI]
```

Escenarios aplicables:
- Guías de operación y mejores prácticas
- Documentación y materiales de referencia
- Scripts estáticos y plantillas
- Configuración que necesita control de versiones

### Posicionamiento de MCP

```
[Herramientas Dinámicas] → [Servidor MCP] → [Llamada de Protocolo] → [Respuesta en Tiempo Real]
```

Escenarios aplicables:
- Llamadas API en tiempo real
- Consultas a base de datos
- Servicios remotos que necesitan estado
- Cálculos y conversiones complejos

### Relación Complementaria

OpenSkills no excluye MCP, sino que **se enfoca en la carga de habilidades**:

```
Agente IA
  ├─ Sistema de habilidades (OpenSkills CLI) → Cargar instrucciones estáticas
  └─ Herramientas MCP → Llamar servicios dinámicos
```

Son complementarios, no sustitutos.

---

## Casos Prácticos: ¿Cuándo Usar Cada Uno?

### Caso 1: Llamar Operaciones Git

❌ **No adecuado para sistema de habilidades**:
- Las operaciones Git son dinámicas, necesitan interacción en tiempo real
- Dependiente del estado del servidor Git

✅ **Adecuado para MCP**:
```bash
# Llamar a través de herramienta MCP
git:checkout(branch="main")
```

### Caso 2: Guía de Procesamiento PDF

❌ **No adecuado para MCP**:
- La guía de operación es estática
- No necesita ejecutar servidor

✅ **Adecuado para sistema de habilidades**:
```bash
# Cargar a través de CLI
npx openskills read pdf
# Salida: Pasos detallados de procesamiento PDF y mejores prácticas
```

### Caso 3: Consulta a Base de Datos

❌ **No adecuado para sistema de habilidades**:
- Necesita conectar a base de datos
- El resultado es dinámico

✅ **Adecuado para MCP**:
```bash
# Llamar a través de herramienta MCP
database:query(sql="SELECT * FROM users")
```

### Caso 4: Normas de Revisión de Código

❌ **No adecuado para MCP**:
- Las normas de revisión son documentos estáticos
- Necesita control de versiones

✅ **Adecuado para sistema de habilidades**:
```bash
# Cargar a través de CLI
npx openskills read code-review
# Salida: Lista detallada de revisión de código y ejemplos
```

---

## Futuro: Fusión de MCP y Sistema de Habilidades

### Direcciones Posibles de Evolución

**MCP + Sistema de Habilidades**:

```bash
# Habilidades que hacen referencia a herramientas MCP
npx openskills read pdf-tool

# Contenido de SKILL.md
Esta habilidad necesita usar herramientas MCP:

1. Usar mcp:pdf-extract para extraer texto
2. Usar mcp:pdf-parse para analizar estructura
3. Usar scripts proporcionados por esta habilidad para procesar resultados
```

**Ventajas**:
- Las habilidades proporcionan instrucciones avanzadas y mejores prácticas
- MCP proporciona herramientas dinámicas subyacentes
- Combinando ambos, la funcionalidad es más poderosa

### Etapa Actual

OpenSkills eligió CLI porque:
1. El sistema de habilidades ya es un diseño maduro de sistema de archivos
2. El método CLI es simple de implementar y fuertemente universal
3. No es necesario esperar que cada agente implemente soporte MCP

---

## Resumen de Esta Lección

Las razones principales por las que OpenSkills eligió CLI en lugar de MCP:

### Razones Principales

- ✅ **Las habilidades son archivos estáticos**: Sin servidor necesario, almacenamiento en sistema de archivos
- ✅ **Mayor universalidad**: Todos los agentes pueden usar, sin depender del protocolo MCP
- ✅ **Cumple con el diseño oficial**: El sistema de habilidades de Anthropic es inherentemente un diseño de sistema de archivos
- ✅ **Despliegue de configuración cero**: Sin servidor necesario, listo para usar

### MCP vs Sistema de Habilidades

| MCP | Sistema de Habilidades (CLI) |
|--- |---|
| Herramientas dinámicas | Instrucciones estáticas |
| Requiere servidor | Sistema de archivos puro |
| API en tiempo real | Documentos y scripts |
| Requiere soporte de protocolo | Costo de integración cero |

### No Es Competencia, Es Complementariedad

- MCP resuelve el problema de herramientas dinámicas
- El sistema de habilidades resuelve el problema de instrucciones estáticas
- Ambos pueden ser usados juntos

---

## Lecturas Relacionadas

- [¿Qué es OpenSkills?](../../start/what-is-openskills/)
- [Detalles de Comandos](../../platforms/cli-commands/)
- [Crear Habilidades Personalizadas](../../advanced/create-skills/)

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Clic para expandir ver ubicación del código fuente</strong></summary>

> Hora de actualización: 2026-01-24

| Funcionalidad | Ruta del Archivo                                                                                      | Línea |
|--- | --- |---|
| Entrada CLI    | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts)                     | 39-80   |
| Comando Leer    | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts) | 1-50    |
| Generación AGENTS.md  | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts) | 23-93   |

**Decisiones de Diseño Clave**:
- Método CLI: Cargar habilidades a través de `npx openskills read <name>`
- Almacenamiento en sistema de archivos: Habilidades almacenadas en `.claude/skills/` o `.agent/skills/`
- Compatibilidad universal: Salida en formato XML completamente consistente con Claude Code

</details>

---
title: "Seguridad: Path Traversal y Enlaces Simbólicos | OpenSkills"
sidebarTitle: "Prevención de Path Traversal"
subtitle: "Seguridad: Path Traversal y Enlaces Simbólicos | OpenSkills"
description: "Aprende el mecanismo de seguridad de tres capas de OpenSkills. Comprende la protección contra path traversal, el manejo seguro de enlaces simbólicos y la seguridad del análisis YAML para garantizar la seguridad de la instalación y uso de habilidades."
tags:
  - "Seguridad"
  - "Path Traversal"
  - "Enlaces Simbólicos"
  - "YAML"
prerequisite:
  - "advanced-ci-integration"
order: 7
---

# Seguridad de OpenSkills

## Lo Que Podrás Hacer al Completar Esta Lección

- Comprender el mecanismo de seguridad de tres capas de OpenSkills
- Entender el principio y los métodos de protección contra ataques de path traversal
- Dominar el manejo seguro de enlaces simbólicos
- Reconocer los riesgos de ReDoS en el análisis YAML y las medidas de protección

## Tu Situación Actual

Podrías haber escuchado sobre la idea de que "ejecutar localmente es más seguro", pero no estar seguro de las medidas de seguridad específicas. O al instalar habilidades podrías estar preocupado por:

- ¿Podría escribir archivos en directorios del sistema?
- ¿Podrían los enlaces simbólicos representar riesgos de seguridad?
- ¿Podría haber vulnerabilidades al analizar el YAML de SKILL.md?

## Cuándo Usar Esta Técnica

Cuando necesitas:
- Desplegar OpenSkills en un entorno empresarial
- Auditar la seguridad de OpenSkills
- Evaluar soluciones de gestión de habilidades desde una perspectiva de seguridad
- Enfrentarte a revisiones técnicas por parte del equipo de seguridad

## Idea Central

El diseño de seguridad de OpenSkills sigue tres principios:

::: info Tres capas de seguridad
1. **Validación de entrada** - Verificar todas las entradas externas (rutas, URL, YAML)
2. **Aislamiento de ejecución** - Asegurar que las operaciones se realicen dentro del directorio esperado
3. **Análisis seguro** - Prevenir vulnerabilidades del analizador (ReDoS)
:::

Ejecución local + sin carga de datos + validación de entrada + aislamiento de rutas = gestión de habilidades segura

## Protección contra Path Traversal

### ¿Qué es un ataque de Path Traversal?

Un **ataque de Path Traversal** es cuando un atacante intenta acceder a archivos fuera del directorio esperado usando secuencias como `../`.

**Ejemplo**: Sin protección, un atacante podría intentar:
```bash
# Intentar instalar en el directorio del sistema
openskills install malicious/skill --target ../../../etc/

# Intentar sobrescribir archivos de configuración
openskills install malicious/skill --target ../../../../.ssh/
```

### Mecanismo de Protección de OpenSkills

OpenSkills usa la función `isPathInside` para verificar que la ruta de instalación debe estar dentro del directorio de destino.

**Ubicación en el código fuente**: [`src/commands/install.ts:71-78`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L71-L78)

```typescript
function isPathInside(targetPath: string, targetDir: string): boolean {
  const resolvedTargetPath = resolve(targetPath);
  const resolvedTargetDir = resolve(targetDir);
  const resolvedTargetDirWithSep = resolvedTargetDir.endsWith(sep)
    ? resolvedTargetDir
    : resolvedTargetDir + sep;
  return resolvedTargetPath.startsWith(resolvedTargetDirWithSep);
}
```

**Cómo funciona**:
1. Usa `resolve()` para resolver todas las rutas relativas a rutas absolutas
2. Normaliza el directorio de destino, asegurándose de que termine con el separador de rutas
3. Verifica que la ruta de destino comience con el directorio de destino

**Validación durante la instalación** ([`src/commands/install.ts:257-260`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L257-L260)):
```typescript
if (!isPathInside(targetPath, targetDir)) {
  console.error(chalk.red('Security error: Installation path outside target directory'));
  process.exit(1);
}
```

### Verificar el Efecto de la Protección

**Escenario de prueba**: Intentar un ataque de path traversal

```bash
# Instalación normal (éxito)
openskills install anthropics/skills

# Intentar usar ../ (fallo)
openskills install malicious/skill --target ../../../etc/
# Security error: Installation path outside target directory
```

**Lo que deberías ver**: Cualquier instalación que intente salir del directorio de destino será rechazada, mostrando un error de seguridad.

## Seguridad de Enlaces Simbólicos

### Riesgos de los Enlaces Simbólicos

Un **Enlace Simbólico (Symlink)** es un acceso directo que apunta a otro archivo o directorio. Si no se maneja correctamente, puede causar:

1. **Fuga de información** - Un atacante crea un enlace simbólico que apunta a archivos sensibles
2. **Sobrescritura de archivos** - El enlace simbólico apunta a archivos del sistema, que se sobrescriben durante la instalación
3. **Referencia circular** - El enlace simbólico apunta a sí mismo, causando recursión infinita

### Desreferenciación Durante la Instalación

OpenSkills usa `dereference: true` al copiar archivos para desreferenciar los enlaces simbólicos, copiando directamente el archivo de destino.

**Ubicación en el código fuente**: [`src/commands/install.ts:262`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L262)

```typescript
cpSync(skillDir, targetPath, { recursive: true, dereference: true });
}
```

**Efecto**:
- Los enlaces simbólicos se reemplazan por los archivos reales
- No se copia el enlace simbólico en sí
- Evita que los archivos apuntados por el enlace simbólico se sobrescriban

### Verificación de Enlaces Simbólicos al Buscar Habilidades

OpenSkills soporta habilidades en forma de enlaces simbólicos, pero verifica si están dañados.

**Ubicación en el código fuente**: [`src/utils/skills.ts:10-25`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L10-L25)

```typescript
function isDirectoryOrSymlinkToDirectory(entry: Dirent, parentDir: string): boolean {
  if (entry.isDirectory()) {
    return true;
  }
  if (entry.isSymbolicLink()) {
    try {
      const fullPath = join(parentDir, entry.name);
      const stats = statSync(fullPath); // statSync sigue symlinks
      return stats.isDirectory();
    } catch {
      // Enlace simbólico roto o error de permisos
      return false;
    }
  }
  return false;
}
```

**Características de seguridad**:
- Usa `statSync()` para seguir el enlace simbólico y verificar el destino
- Los enlaces simbólicos dañados se saltan (bloque `catch`)
- No falla, se maneja silenciosamente

::: tip Casos de Uso
El soporte de enlaces simbólicos te permite:
- Usar habilidades directamente desde repositorios git (sin copiar)
- Sincronizar modificaciones durante el desarrollo local
- Compartir biblioteca de habilidades entre múltiples proyectos
:::

## Seguridad del Análisis YAML

### Riesgo de ReDoS

**Expresión Regular de Denegación de Servicio (ReDoS)** se refiere a entradas maliciosamente construidas que causan tiempos de coincidencia exponenciales en expresiones regulares, consumiendo recursos de CPU.

OpenSkills necesita analizar el frontmatter YAML de SKILL.md:
```yaml
---
name: skill-name
description: Skill description
---
```

### Protección con Regex No Codicioso

OpenSkills usa expresiones regulares no codiciosas para evitar ReDoS.

**Ubicación en el código fuente**: [`src/utils/yaml.ts:4`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts#L4)

```typescript
export function extractYamlField(content: string, field: string): string {
  const match = content.match(new RegExp(`^${field}:\\s*(.+?)$`, 'm'));
  return match ? match[1].trim() : '';
}
```

**Puntos clave**:
- `+?` es un cuantificador **no codicioso**, coincide con la posibilidad más corta
- `^` y `$` fijan el inicio y fin de línea
- Solo coincide con una sola línea, evitando anidamiento complejo

**Ejemplo incorrecto (coincidencia codiciosa)**:
```typescript
// ❌ Peligroso: + coincidirá codiciosamente, podría encontrar una explosión de backtracking
new RegExp(`^${field}:\\s*(.+)$`, 'm')
```

**Ejemplo correcto (coincidencia no codiciosa)**:
```typescript
// ✅ Seguro: +? no codicioso, se detiene al encontrar el primer carácter de nueva línea
new RegExp(`^${field}:\\s*(.+?)$`, 'm')
```

## Permisos de Archivos y Verificación de Fuente

### Herencia de Permisos del Sistema

OpenSkills no gestiona permisos de archivos, hereda directamente el control de permisos del sistema operativo:

- Los archivos pertenecen al usuario que ejecuta OpenSkills
- Los permisos de directorio siguen la configuración de umask del sistema
- La gestión de permisos está controlada uniformemente por el sistema de archivos

### Verificación de Fuente para Repositorios Privados

Al instalar desde repositorios git privados, OpenSkills depende de la verificación de claves SSH de git.

**Ubicación en el código fuente**: [`src/commands/install.ts:167`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L167)

::: tip Recomendación
Asegúrate de que tu clave SSH esté configurada correctamente y se haya agregado a la lista de claves autorizadas del servidor git.
:::

## Seguridad de Ejecución Local

OpenSkills es una herramienta puramente local, no implica comunicación de red (excepto al clonar repositorios git):

### Sin Carga de Datos

| Operación | Flujo de Datos |
|--- | ---|
| Instalar habilidad | Repositorio Git → Local |
| Leer habilidad | Local → Salida Estándar |
| Sincronizar AGENTS.md | Local → Archivo Local |
| Actualizar habilidad | Repositorio Git → Local |

### Protección de Privacidad

- Todos los archivos de habilidades se almacenan localmente
- Los agentes de AI leen a través del sistema de archivos local
- Sin dependencias en la nube ni recopilación de telemetría

::: info Diferencia con Marketplace
OpenSkills no depende de Anthropic Marketplace, se ejecuta completamente en local.
:::

## Resumen de Esta Lección

Las tres capas de seguridad de OpenSkills:

| Capa de Seguridad | Medida de Protección | Ubicación en el Código |
|--- | --- | ---|
| **Protección contra Path Traversal** | `isPathInside()` verifica que la ruta esté dentro del directorio de destino | `install.ts:71-78` |
| **Seguridad de Enlaces Simbólicos** | `dereference: true` desreferencia enlaces simbólicos | `install.ts:262` |
| **Seguridad del Análisis YAML** | Regex no codicioso `+?` previene ReDoS | `yaml.ts:4` |

**Recuerda**:
- Los ataques de path traversal acceden a archivos fuera del directorio esperado usando secuencias `../`
- Los enlaces simbólicos necesitan desreferenciarse o verificarse para evitar fugas de información y sobrescritura de archivos
- El análisis YAML usa regex no codicioso para evitar ReDoS
- Ejecución local + sin carga de datos = mayor privacidad y seguridad

## Próxima Lección

> En la próxima lección aprenderemos **[Mejores Prácticas](../best-practices/)**.
>
> Aprenderás:
> - Mejores prácticas de configuración de proyectos
> - Planes de colaboración en equipo para gestión de habilidades
> - Técnicas de uso en entornos multi-agente
> - Trampas comunes y métodos para evitarlas

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicaciones del código fuente</strong></summary>

> Última actualización: 2026-01-24

| Funcionalidad          | Ruta de Archivo                                                                                     | Líneas     |
|--- | --- | ---|
| Protección contra Path Traversal   | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L71-L78) | 71-78    |
| Verificación de ruta de instalación   | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L257-L260) | 257-260  |
| Desreferenciación de enlaces simbólicos | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L262) | 262      |
| Verificación de ruta de actualización   | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L156-L172) | 156-172  |
| Verificación de enlaces simbólicos   | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L10-L25) | 10-25    |
| Seguridad del análisis YAML  | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts#L4) | 4        |

**Funciones clave**:
- `isPathInside(targetPath, targetDir)`: Verifica que la ruta de destino esté dentro del directorio de destino (previene path traversal)
- `isDirectoryOrSymlinkToDirectory(entry, parentDir)`: Verifica si un directorio o enlace simbólico apunta a un directorio
- `extractYamlField(content, field)`: Extrae campos YAML usando regex no codicioso (previene ReDoS)

**Registro de cambios**:
- [`CHANGELOG.md:64-68`](https://github.com/numman-ali/openskills/blob/main/CHANGELOG.md#L64-L68) - v1.5.0 Notas de actualización de seguridad

</details>

---
title: "Solución de Problemas: Resolviendo Problemas Comunes de OpenSkills | openskills"
sidebarTitle: "¿Qué hacer si encuentras errores?"
subtitle: "Solución de Problemas: Resolviendo Problemas Comunes de OpenSkills"
description: "Resuelve errores comunes de OpenSkills. Este tutorial cubre fallos de Git clone, SKILL.md no encontrado, skill no encontrado, errores de permisos, actualizaciones omitidas y más, proporcionando pasos detallados de diagnóstico y métodos de reparación para ayudarte a resolver rápidamente diversos problemas de uso."
tags:
  - FAQ
  - Solución de Problemas
  - Resolución de Errores
prerequisite:
  - "start-quick-start"
  - "start-installation"
order: 2
---

# Solución de Problemas: Resolviendo Problemas Comunes de OpenSkills

## Qué podrás hacer después de aprender esto

- Diagnosticar y reparar rápidamente problemas comunes al usar OpenSkills
- Comprender las razones detrás de los mensajes de error
- Dominar técnicas de diagnóstico para problemas de clonación Git, permisos, formatos de archivo y más
- Saber cuándo es necesario reinstalar una skill

## Tu situación actual

Encontraste errores al usar OpenSkills y no sabes qué hacer:

```
Error: No SKILL.md files found in repository
```

O fallos de git clone, errores de permisos, formatos de archivo incorrectos... estos problemas pueden impedir que las skills funcionen correctamente.

## Cuándo necesitas leer este tutorial

Cuando encuentres las siguientes situaciones:

- **Instalación fallida**: Errores al instalar desde GitHub o rutas locales
- **Lectura fallida**: `openskills read` indica que no encuentra la skill
- **Sincronización fallida**: `openskills sync` indica que no hay skills o errores de formato de archivo
- **Actualización fallida**: `openskills update` omite ciertas skills
- **Errores de permisos**: Indicaciones de acceso restringido a rutas o errores de seguridad

## Enfoque principal

Los errores de OpenSkills se dividen principalmente en 4 categorías:

| Tipo de Error | Causas Comunes | Enfoque de Solución |
| --- | --- | --- |
| **Relacionado con Git** | Problemas de red, configuración SSH, repositorio no existe | Verificar red, configurar credenciales Git, validar dirección del repositorio |
| **Relacionado con Archivos** | SKILL.md faltante, error de formato, error de ruta | Verificar existencia de archivos, validar formato YAML |
| **Relacionado con Permisos** | Permisos de directorio, recorrido de rutas, enlaces simbólicos | Verificar permisos de directorio, validar ruta de instalación |
| **Relacionado con Metadatos** | Pérdida de metadatos durante actualización, cambio de ruta de origen | Reinstalar la skill para restaurar metadatos |

**Técnicas de Diagnóstico**:
1. **Lee el mensaje de error**: La salida roja generalmente contiene la causa específica
2. **Lee las sugerencias amarillas**: Generalmente son advertencias y recomendaciones, como `Tip: For private repos...`
3. **Verifica la estructura de directorios**: Usa `openskills list` para ver las skills instaladas
4. **Verifica la ubicación del código fuente**: El mensaje de error listará las rutas de búsqueda (4 directorios)

---

## Instalación Fallida

### Problema 1: Fallo de Git clone

**Mensaje de Error**:
```
Failed to clone repository
fatal: repository '...' not found
Tip: For private repos, ensure git SSH keys or credentials are configured
```

**Posibles Causas**:

| Causa | Escenario |
| --- | --- |
| Repositorio no existe | owner/repo mal escrito |
| Repositorio privado | Clave SSH o credenciales Git no configuradas |
| Problema de red | No se puede acceder a GitHub |

**Soluciones**:

1. **Valida la dirección del repositorio**:
   ```bash
   # Accede a la URL del repositorio en el navegador
   https://github.com/owner/repo
   ```

2. **Verifica la configuración de Git** (repositorios privados):
   ```bash
   # Verifica la configuración SSH
   ssh -T git@github.com

   # Configura las credenciales de Git
   git config --global credential.helper store
   ```

3. **Prueba la clonación**:
   ```bash
   git clone https://github.com/owner/repo.git
   ```

**Lo que deberías ver**:
- El repositorio se clona exitosamente en el directorio local

---

### Problema 2: No se encuentra SKILL.md

**Mensaje de Error**:
```
Error: No SKILL.md files found in repository
Error: No valid SKILL.md files found
```

**Posibles Causas**:

| Causa | Descripción |
| --- | --- |
| Repositorio sin SKILL.md | El repositorio no es un repositorio de skills |
| SKILL.md sin frontmatter | Falta metadatos YAML |
| Formato de SKILL.md incorrecto | Error de sintaxis YAML |

**Soluciones**:

1. **Verifica la estructura del repositorio**:
   ```bash
   # Ver el directorio raíz del repositorio
   ls -la

   # Verificar si existe SKILL.md
   find . -name "SKILL.md"
   ```

2. **Valida el formato de SKILL.md**:
   ```markdown
   ---
   name: Nombre de la Skill
   description: Descripción de la skill
   ---

   Contenido de la skill...
   ```

   **Requisitos obligatorios**:
   - Debe tener YAML frontmatter delimitado por `---` al inicio
   - Debe contener los campos `name` y `description`

3. **Ver el ejemplo oficial**:
   ```bash
   git clone https://github.com/anthropics/skills.git
   cd skills
   ls -la
   ```

**Lo que deberías ver**:
- El repositorio contiene uno o más archivos `SKILL.md`
- Cada SKILL.md comienza con YAML frontmatter

---

### Problema 3: La ruta no existe o no es un directorio

**Mensaje de Error**:
```
Error: Path does not exist: /path/to/skill
Error: Path must be a directory
```

**Posibles Causas**:

| Causa | Descripción |
| --- | --- |
| Ruta mal escrita | Se ingresó una ruta incorrecta |
| Ruta apunta a un archivo | Debería ser un directorio, no un archivo |
| Ruta no expandida | Al usar `~` necesita ser expandida |

**Soluciones**:

1. **Verifica que la ruta existe**:
   ```bash
   # Verificar la ruta
   ls -la /path/to/skill

   # Verificar si es un directorio
   file /path/to/skill
   ```

2. **Usa rutas absolutas**:
   ```bash
   # Obtener la ruta absoluta
   realpath /path/to/skill

   # Usar la ruta absoluta al instalar
   openskills install /absolute/path/to/skill
   ```

3. **Usa rutas relativas**:
   ```bash
   # En el directorio del proyecto
   openskills install ./skills/my-skill
   ```

**Lo que deberías ver**:
- La ruta existe y es un directorio
- El directorio contiene el archivo `SKILL.md`

---

### Problema 4: SKILL.md inválido

**Mensaje de Error**:
```
Error: Invalid SKILL.md (missing YAML frontmatter)
```

**Posibles Causas**:

| Causa | Descripción |
| --- | --- |
| Campos obligatorios faltantes | Debe tener `name` y `description` |
| Error de sintaxis YAML | Problemas de formato con dos puntos, comillas, etc. |

**Soluciones**:

1. **Verifica el YAML frontmatter**:
   ```markdown
   ---              ← Delimitador de inicio
   name: my-skill   ← Obligatorio
   description: Descripción de la skill  ← Obligatorio
   ---              ← Delimitador de fin
   ```

2. **Usa una herramienta de validación YAML en línea**:
   - Visita YAML Lint o herramientas similares para validar la sintaxis

3. **Consulta el ejemplo oficial**:
   ```bash
   openskills install anthropics/skills
   cat .claude/skills/*/SKILL.md | head -20
   ```

**Lo que deberías ver**:
- SKILL.md comienza con el YAML frontmatter correcto
- Contiene los campos `name` y `description`

---

### Problema 5: Error de seguridad de recorrido de rutas

**Mensaje de Error**:
```
Security error: Installation path outside target directory
```

**Posibles Causas**:

| Causa | Descripción |
| --- | --- |
| Nombre de skill contiene `..` | Intenta acceder a rutas fuera del directorio de destino |
| Enlace simbólico apunta afuera | El symlink apunta fuera del directorio de destino |
| Skill maliciosa | La skill intenta eludir restricciones de seguridad |

**Soluciones**:

1. **Verifica el nombre de la skill**:
   - Asegúrate de que el nombre de la skill no contenga `..`, `/` u otros caracteres especiales

2. **Verifica los enlaces simbólicos**:
   ```bash
   # Ver los enlaces simbólicos en el directorio de skills
   find .claude/skills/skill-name -type l

   # Ver el destino del enlace simbólico
   ls -la .claude/skills/skill-name
   ```

3. **Usa skills seguras**:
   - Instala skills solo de fuentes confiables
   - Revisa el código de la skill antes de instalar

**Lo que deberías ver**:
- El nombre de la skill solo contiene letras, números y guiones
- No hay enlaces simbólicos que apunten afuera

---

## Lectura Fallida

### Problema 6: Skill no encontrada

**Mensaje de Error**:
```
Error: Skill(s) not found: my-skill

Searched:
  .agent/skills/ (project universal)
  ~/.agent/skills/ (global universal)
  .claude/skills/ (project)
  ~/.claude/skills/ (global)

Install skills: npx openskills install owner/repo
```

**Posibles Causas**:

| Causa | Descripción |
| --- | --- |
| Skill no instalada | La skill no está instalada en ningún directorio |
| Nombre de skill mal escrito | El nombre no coincide |
| Instalada en otra ubicación | La skill está instalada en un directorio no estándar |

**Soluciones**:

1. **Ver las skills instaladas**:
   ```bash
   openskills list
   ```

2. **Verifica el nombre de la skill**:
   - Compara con la salida de `openskills list`
   - Asegúrate de que el nombre coincida exactamente (distingue mayúsculas/minúsculas)

3. **Instala la skill faltante**:
   ```bash
   openskills install owner/repo
   ```

4. **Busca en todos los directorios**:
   ```bash
   # Verifica los 4 directorios de skills
   ls -la .agent/skills/
   ls -la ~/.agent/skills/
   ls -la .claude/skills/
   ls -la ~/.claude/skills/
   ```

**Lo que deberías ver**:
- `openskills list` muestra la skill objetivo
- La skill existe en uno de los 4 directorios

---

### Problema 7: No se proporcionó nombre de skill

**Mensaje de Error**:
```
Error: No skill names provided
```

**Posibles Causas**:

| Causa | Descripción |
| --- | --- |
| Olvidó pasar parámetros | No hay parámetros después de `openskills read` |
| Cadena vacía | Se pasó una cadena vacía |

**Soluciones**:

1. **Proporciona el nombre de la skill**:
   ```bash
   # Skill individual
   openskills read my-skill

   # Múltiples skills (separadas por comas)
   openskills read skill1,skill2,skill3
   ```

2. **Primero verifica las skills disponibles**:
   ```bash
   openskills list
   ```

**Lo que deberías ver**:
- El contenido de la skill se lee exitosamente en la salida estándar

---

## Sincronización Fallida

### Problema 8: El archivo de salida no es Markdown

**Mensaje de Error**:
```
Error: Output file must be a markdown file (.md)
```

**Posibles Causas**:

| Causa | Descripción |
| --- | --- |
| Archivo de salida no es .md | Se especificó formato .txt, .json, etc. |
| Parámetro --output incorrecto | La ruta no termina en .md |

**Soluciones**:

1. **Usa archivos .md**:
   ```bash
   # Correcto
   openskills sync -o AGENTS.md
   openskills sync -o custom.md

   # Incorrecto
   openskills sync -o AGENTS.txt
   openskills sync -o AGENTS
   ```

2. **Ruta de salida personalizada**:
   ```bash
   # Salida a subdirectorio
   openskills sync -o .ruler/AGENTS.md
   openskills sync -o docs/agents.md
   ```

**Lo que deberías ver**:
- Archivo .md generado exitosamente
- El archivo contiene la sección XML de skills

---

### Problema 9: No hay skills instaladas

**Mensaje de Error**:
```
No skills installed. Install skills first:
  npx openskills install anthropics/skills --project
```

**Posibles Causas**:

| Causa | Descripción |
| --- | --- |
| Nunca se instaló una skill | Primer uso de OpenSkills |
| Directorio de skills eliminado | Archivos de skills eliminados manualmente |

**Soluciones**:

1. **Instala skills**:
   ```bash
   # Instalar skills oficiales
   openskills install anthropics/skills

   # Instalar desde otro repositorio
   openskills install owner/repo
   ```

2. **Verifica la instalación**:
   ```bash
   openskills list
   ```

**Lo que deberías ver**:
- `openskills list` muestra al menos una skill
- Sincronización exitosa

---

## Actualización Fallida

### Problema 10: Sin metadatos de origen

**Mensaje de Error**:
```
Skipped: my-skill (no source metadata; re-install once to enable updates)
```

**Posibles Causas**:

| Causa | Descripción |
| --- | --- |
| Instalación de versión antigua | La skill se instaló antes de la función de metadatos |
| Copia manual | Se copió directamente el directorio de la skill, sin usar OpenSkills |
| Archivo de metadatos dañado | `.openskills.json` dañado o perdido |

**Soluciones**:

1. **Reinstala la skill**:
   ```bash
   # Eliminar skill antigua
   openskills remove my-skill

   # Reinstalar
   openskills install owner/repo
   ```

2. **Verifica el archivo de metadatos**:
   ```bash
   # Ver los metadatos de la skill
   cat .claude/skills/my-skill/.openskills.json
   ```

3. **Conservar la skill pero agregar metadatos**:
   - Crear manualmente `.openskills.json` (no recomendado)
   - Reinstalar es más simple y confiable

**Lo que deberías ver**:
- Actualización exitosa, sin advertencias de omisión

---

### Problema 11: Origen local faltante

**Mensaje de Error**:
```
Skipped: my-skill (local source missing)
```

**Posibles Causas**:

| Causa | Descripción |
| --- | --- |
| Ruta local movida | La ubicación del directorio de origen cambió |
| Ruta local eliminada | El directorio de origen no existe |
| Ruta no expandida | Se usó `~` pero los metadatos almacenaron la ruta expandida |

**Soluciones**:

1. **Verifica la ruta local en los metadatos**:
   ```bash
   cat .claude/skills/my-skill/.openskills.json
   ```

2. **Restaura el directorio de origen o actualiza los metadatos**:
   ```bash
   # Si el directorio de origen se movió
   openskills remove my-skill
   openskills install /new/path/to/skill

   # O editar manualmente los metadatos (no recomendado)
   vi .claude/skills/my-skill/.openskills.json
   ```

**Lo que deberías ver**:
- La ruta de origen local existe y contiene `SKILL.md`

---

### Problema 12: No se encuentra SKILL.md en el repositorio

**Mensaje de Error**:
```
SKILL.md missing for my-skill
Skipped: my-skill (SKILL.md not found in repo at subpath)
```

**Posibles Causas**:

| Causa | Descripción |
| --- | --- |
| Cambio en la estructura del repositorio | La subruta o nombre de la skill cambió |
| Skill eliminada | El repositorio ya no contiene esa skill |
| Subruta incorrecta | La subruta registrada en los metadatos es incorrecta |

**Soluciones**:

1. **Accede al repositorio para ver la estructura**:
   ```bash
   # Clonar el repositorio para verificar
   git clone https://github.com/owner/repo.git
   cd repo
   ls -la
   find . -name "SKILL.md"
   ```

2. **Reinstala la skill**:
   ```bash
   openskills remove my-skill
   openskills install owner/repo/subpath
   ```

3. **Verifica el historial de actualizaciones del repositorio**:
   - En GitHub, revisa el historial de commits del repositorio
   - Busca registros de movimiento o eliminación de la skill

**Lo que deberías ver**:
- Actualización exitosa
- SKILL.md existe en la subruta registrada

---

## Problemas de Permisos

### Problema 13: Permisos de directorio restringidos

**Síntomas**:

| Operación | Síntoma |
| --- | --- |
| Instalación fallida | Indica error de permisos |
| Eliminación fallida | Indica que no se puede eliminar el archivo |
| Lectura fallida | Indica acceso restringido al archivo |

**Posibles Causas**:

| Causa | Descripción |
| --- | --- |
| Permisos de directorio insuficientes | El usuario no tiene permisos de escritura |
| Permisos de archivo insuficientes | El archivo es de solo lectura |
| Protección del sistema | Restricciones de macOS SIP, Windows UAC |

**Soluciones**:

1. **Verifica los permisos del directorio**:
   ```bash
   # Ver permisos
   ls -la .claude/skills/

   # Modificar permisos (usar con precaución)
   chmod -R 755 .claude/skills/
   ```

2. **Usa sudo (no recomendado)**:
   ```bash
   # Último recurso
   sudo openskills install owner/repo
   ```

3. **Verifica la protección del sistema**:
   ```bash
   # macOS: verificar estado de SIP
   csrutil status

   # Para desactivar SIP (requiere modo de recuperación)
   # No recomendado, usar solo cuando sea necesario
   ```

**Lo que deberías ver**:
- Lectura y escritura normal de directorios y archivos

---

## Problemas de Enlaces Simbólicos

### Problema 14: Enlace simbólico dañado

**Síntomas**:

| Síntoma | Descripción |
| --- | --- |
| Skill omitida al listar | `openskills list` no muestra la skill |
| Lectura fallida | Indica que el archivo no existe |
| Actualización fallida | Ruta de origen inválida |

**Posibles Causas**:

| Causa | Descripción |
| --- | --- |
| Directorio de destino eliminado | El enlace simbólico apunta a una ruta inexistente |
| Enlace simbólico dañado | El archivo de enlace en sí está dañado |
| Enlace entre dispositivos | Algunos sistemas no admiten enlaces simbólicos entre dispositivos |

**Soluciones**:

1. **Verifica los enlaces simbólicos**:
   ```bash
   # Buscar todos los enlaces simbólicos
   find .claude/skills -type l

   # Ver el destino del enlace
   ls -la .claude/skills/my-skill

   # Probar el enlace
   readlink .claude/skills/my-skill
   ```

2. **Elimina el enlace simbólico dañado**:
   ```bash
   openskills remove my-skill
   ```

3. **Reinstala**:
   ```bash
   openskills install owner/repo
   ```

**Lo que deberías ver**:
- Sin enlaces simbólicos dañados
- La skill se muestra y se lee normalmente

---

## Recordatorios de Errores Comunes

::: warning Operaciones de Error Comunes

**❌ No hagas esto**:

- **Copiar directamente el directorio de skills** → Causará falta de metadatos, fallo de actualización
- **Editar manualmente `.openskills.json`** → Fácil de corromper el formato, causando fallo de actualización
- **Usar sudo para instalar skills** → Creará archivos propiedad de root, operaciones posteriores pueden requerir sudo
- **Eliminar `.openskills.json`** → Causará que la skill se omita durante la actualización

**✅ Deberías hacer esto**:

- Instalar a través de `openskills install` → Crea automáticamente metadatos
- Eliminar a través de `openskills remove` → Limpia correctamente los archivos
- Actualizar a través de `openskills update` → Actualiza automáticamente desde la fuente
- Verificar a través de `openskills list` → Confirma el estado de la skill

:::

::: tip Técnicas de Diagnóstico

1. **Comienza simple**: Primero ejecuta `openskills list` para confirmar el estado
2. **Lee el mensaje de error completo**: Las sugerencias amarillas generalmente contienen recomendaciones de solución
3. **Verifica la estructura de directorios**: Usa `ls -la` para ver archivos y permisos
4. **Valida la ubicación del código fuente**: El mensaje de error listará 4 directorios de búsqueda
5. **Usa -y para omitir interacción**: Usa la bandera `-y` en CI/CD o scripts

:::

---

## Resumen de la Lección

Esta lección cubrió los métodos de diagnóstico y reparación de problemas comunes de OpenSkills:

| Tipo de Problema | Método de Solución Clave |
| --- | --- |
| Fallo de Git clone | Verificar red, configurar credenciales, validar dirección del repositorio |
| No se encuentra SKILL.md | Verificar estructura del repositorio, validar formato YAML |
| Lectura fallida | Usar `openskills list` para verificar el estado de la skill |
| Actualización fallida | Reinstalar la skill para restaurar metadatos |
| Problemas de permisos | Verificar permisos de directorio, evitar usar sudo |

**Recuerda**:
- Los mensajes de error generalmente contienen indicaciones claras
- Reinstalar es el método más simple para resolver problemas de metadatos
- Instala skills solo de fuentes confiables

## Siguientes Pasos

- **Ver [Preguntas Frecuentes (FAQ)](../faq/)** → Más respuestas a preguntas comunes
- **Aprender [Mejores Prácticas](../../advanced/best-practices/)** → Evitar errores comunes
- **Explorar [Notas de Seguridad](../../advanced/security/)** → Comprender los mecanismos de seguridad

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-24

| Funcionalidad | Ruta del Archivo | Número de Línea |
| --- | --- | --- |
| Manejo de fallo de Git clone | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L162-L168) | 162-168 |
| Error de ruta no existe | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L205-L207) | 205-207 |
| Error de no es directorio | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L210-L213) | 210-213 |
| SKILL.md inválido | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L241-L243) | 241-243 |
| Error de seguridad de recorrido de rutas | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L256-L259) | 256-259 |
| No se encuentra SKILL.md | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L378-L380) | 378-380 |
| No se proporcionó nombre de skill | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts#L10-L12) | 10-12 |
| Skill no encontrada | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts#L26-L34) | 26-34 |
| Archivo de salida no es Markdown | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L23-L25) | 23-25 |
| No hay skills instaladas | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L40-L43) | 40-43 |
| Omisión por sin metadatos de origen | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L57-L61) | 57-61 |
| Origen local faltante | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L66-L71) | 66-71 |
| No se encuentra SKILL.md en el repositorio | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L102-L107) | 102-107 |

**Funciones Clave**:
- `hasValidFrontmatter(content)`: Valida si SKILL.md tiene YAML frontmatter válido
- `isPathInside(targetPath, targetDir)`: Valida si la ruta está dentro del directorio de destino (verificación de seguridad)
- `findSkill(name)`: Busca la skill en 4 directorios por prioridad
- `readSkillMetadata(path)`: Lee los metadatos de origen de instalación de la skill

**Constantes Clave**:
- Orden de directorios de búsqueda (`src/utils/skills.ts`):
  1. `.agent/skills/` (project universal)
  2. `~/.agent/skills/` (global universal)
  3. `.claude/skills/` (project)
  4. `~/.claude/skills/` (global)

</details>

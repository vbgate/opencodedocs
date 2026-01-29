<div align="center">
 
# 🔥 OpenCodeDocs

![VitePress](https://img.shields.io/badge/VitePress-1.0-646CFF?style=flat&logo=vitepress)
![License](https://img.shields.io/badge/License-MIT%2B%20CC--BY--NC--SA%204.0-green?style=flat)
![Cloudflare](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-orange?style=flat)
![Languages](https://img.shields.io/badge/Languages-10%2B-blue?style=flat)

**🎯 #1 Sitio de Tutoriales del Ecosistema AI · Impulsado por Código Fuente · 100% Funcional**

¿Las herramientas de AI evolucionan demasiado rápido? ¿La documentación oficial no logra seguir el ritmo? ¿Los tutoriales en línea están desactualizados?

Analizamos profundamente el código fuente de proyectos de código abierto, cada línea de código ha sido verificada.
**✅ Sigue los pasos, éxito en el primer intento, sin rodeos.**

[🚀 Comenzar](https://opencodedocs.com) · [⭐ Star en GitHub](../../) · [💬 Unirse a la Discusión](../../discussions)

</div>

## Idioma

[简体中文](README.zh-CN.md) · [English](README.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português](README.pt.md) · [Русский](README.ru.md) · [繁體中文](README.zh-TW.md)

---

## 💡 ¿Te has encontrado con alguna de estas situaciones?

- ❌ ¿La documentación oficial se actualiza con retraso, sigues los pasos pero no funciona?
- ❌ ¿Los tutoriales en línea son copia y pega, el código simplemente no funciona?
- ❌ ¿Te encuentras con errores y no encuentras soluciones tras buscar en todas partes?
- ❌ ¿Quieres avanzar, pero no encuentras guías prácticas que profundicen en el código fuente?

**OpenCodeDocs está diseñado específicamente para resolver estos problemas.**

---

## ✨ ¿Por qué elegir OpenCodeDocs?

### 🎯 Verificación de Código Fuente, Rechazo de Alucinaciones

> No copiado de Internet, sino derivado de **código fuente real**

Analizamos profundamente el código fuente de proyectos de código abierto, asegurando que cada línea de código sea verificada automáticamente. **Los tutoriales especifican la versión exacta de Git Commit**, para que sepas claramente en qué versión se basa el código.

### 🚀 Actualizaciones Continuas, Actualización Sincronizada

> Cuando la herramienta se actualiza, el tutorial también se actualiza automáticamente

Cuando el proyecto lanza una nueva versión, nuestros tutoriales se actualizan simultáneamente. No te preocupes de que el tutorial esté desactualizado, siempre aprenderás el contenido más reciente.

> 💡 **Nuestros tutoriales se están actualizando rápidamente, incorporando continuamente más proyectos de alta calidad.**

### 🌍 10+ Idiomas, Accesible Globalmente

> Chino, Inglés, Japonés, Coreano, Español, Francés, Alemán, Portugués, Ruso, Chino Tradicional...

No importa de dónde seas, puedes aprender herramientas de AI en tu idioma nativo.

### ✅ 100% Funcional, Cero Ensayos y Errores

> Sigue los pasos, éxito en el primer intento, sin adivinar ni probar

Cada paso del tutorial ha sido verificado, desde la instalación hasta el despliegue, sigue los pasos y funcionará. **Sin complicaciones, sin errores, sin rodeos.**

---

## 👤 ¿A qué categoría perteneces?

### 🌱 Novato en Herramientas de AI

**¿No sabes instalar? ¿No sabes configurar? No te preocupes, tenemos tutoriales paso a paso**

- Cero base, puedes empezar desde cero
- Cada paso tiene explicaciones detalladas
- Los errores comunes tienen soluciones disponibles

### 💻 Desarrollador Avanzado

**¿Quieres avanzar? Analizamos el código fuente en profundidad**

- Técnicas de rotación de múltiples cuentas
- Secretos para ahorrar Tokens
- Práctica real con Agentes automatizados
- Análisis profundo a nivel de código fuente

### 🏢 Equipo Técnico

**¿Tu equipo necesita estandarización unificada para la colaboración?**

- Mejores prácticas reutilizables
- Estructura completa del proyecto
- Guía de despliegue en entorno de producción

---

## 🚀 Comenzar Rápidamente en 3 Minutos

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/vbgate/opencodedocs.git
cd opencodedocs/site
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

### Paso 3: Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

Visita `http://localhost:5173`, ¡comienza tu viaje de aprendizaje de herramientas de AI! 🎉

---

> 💡 **Consejo**: También puedes visitar directamente [opencodedocs.com](https://opencodedocs.com) para ver la documentación en línea.

---

## 📂 Estructura del Proyecto

```
site/
├── docs/                      # Raíz de documentación
│   ├── zh/                    # Tutoriales en Chino 🇨🇳
│   ├── en/                    # Tutoriales en Inglés 🇺🇸
│   ├── ja/                    # Tutoriales en Japonés 🇯🇵
│   ├── ko/                    # Tutoriales en Coreano 🇰🇷
│   ├── es/                    # Tutoriales en Español 🇪🇸
│   ├── fr/                    # Tutoriales en Francés 🇫🇷
│   ├── de/                    # Tutoriales en Alemán 🇩🇪
│   ├── pt/                    # Tutoriales en Portugués 🇵🇹
│   ├── ru/                    # Tutoriales en Ruso 🇷🇺
│   ├── zh-tw/                 # Tutoriales en Chino Tradicional 🇹🇼
│   ├── .vitepress/            # Configuración de VitePress
│   │   ├── config.mts         # Archivo de configuración principal
│   │   ├── sidebar.config.ts  # Generación automática de barra lateral
│   │   └── theme/             # Componentes de tema personalizados
│   ├── about.md               # Sobre nosotros
│   └── terms.md               # Términos de servicio
├── scripts/                   # Scripts de utilidad
│   ├── add-order-to-md.ts     # Añadir campo de orden
│   ├── check-frontmatter.ts   # Verificar Frontmatter
│   └── create-category-indexes.ts  # Crear índices de categoría
├── package.json               # Configuración del proyecto
├── tailwind.config.js         # Configuración de Tailwind CSS
└── postcss.config.js          # Configuración de PostCSS
```

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Descripción |
|:---:|:---:|:---:|
| ![VitePress](https://img.shields.io/badge/VitePress-1.0-646CFF?style=flat&logo=vitepress) | 1.x | Generador de sitios estáticos · Compilación ultra rápida |
| ![Vue](https://img.shields.io/badge/Vue-3.4+-4FC08D?style=flat&logo=vue.js) | 3.4+ | Framework frontend · Composition API |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=flat&logo=tailwind-css) | 4.x | Sistema de estilos · Configuración CSS-first |
| ![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178C6?style=flat&logo=typescript) | 5.9+ | Seguridad de tipos · Verificación en tiempo de compilación |
| ![Mermaid](https://img.shields.io/badge/Mermaid-11.x-9F7DFE?style=flat&logo=mermaid) | 11.x | Soporte de diagramas · Visualización de flujos |
| ![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages-F38020?style=flat&logo=cloudflare) | Pages | CDN global · 200+ nodos de borde |

---

## 📚 Guía de Desarrollo

### ➕ Añadir Nuevo Tutorial

1. **Crear estructura de directorios**
   ```
   docs/zh/[owner]/[repo]/
   ├── index.md          # Página principal del proyecto
   ├── start/            # Inicio rápido
   ├── features/         # Introducción de características
   └── faq/              # Preguntas frecuentes
   ```

2. **Escribir Frontmatter**
   ```yaml
   ---
   title: "Título del Tutorial"              # 2-6 palabras
   order: 10                      # Ordenamiento (10, 20, 30...)
   sidebarTitle: "Título de Barra Lateral"      # Opcional
   description: "Descripción SEO"         # Optimización para motores de búsqueda
   ---
   ```

3. **Verificar construcción**
   ```bash
   npm run docs:build
   ```

### 🌍 Añadir Soporte Multilingüe

Añade el proyecto en `docs/.vitepress/sidebar.config.ts`:
```typescript
const projects = [
  'owner/repo',  // Añade tu proyecto
]
```

Luego traduce el archivo `home-config.[lang].json`.

### 🎨 Personalizar Tema

- **Ubicación de componentes**: `docs/.vitepress/theme/components/`
- **Archivo de estilos**: `docs/.vitepress/theme/custom.css`
- **Tailwind v4**: Utiliza el método de configuración CSS-first

---

## 🚀 Guía de Despliegue

### Construcción Local

```bash
npm run docs:build
```

Los archivos de construcción se encuentran en el directorio `docs/.vitepress/dist/`.

### Despliegue en Cloudflare Pages

```bash
# Despliegue automático
npm run deploy
```

### Previsualizar Resultado de Construcción

```bash
npm run docs:preview
```

### ⚡ Optimización de Rendimiento

- **Optimización de imágenes**: Usar formato WebP, comprimir a menos de 200KB
- **División de código**: VitePress divide automáticamente por rutas
- **Aceleración CDN**: Recursos estáticos subidos automáticamente a Cloudflare CDN
- **Prerrenderizado**: Páginas principales prerenderizadas, carga inicial < 500ms

---

> ✅ **Nuestro sitio está desplegado en CDN global, ¡acceso tan rápido como un rayo!**

---

## 🤝 Contribuir

¡Bienvenimos las contribuciones de la comunidad! Envía tu tutorial, corrige errores, añade nuevas características.

### Proceso de Contribución

1. **Hacer Fork del repositorio**
   ```bash
   # Haz clic en el botón Fork en la página de GitHub
   ```

2. **Crear rama de características**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Confirmar cambios**
   ```bash
   git commit -m 'Add amazing feature'
   ```

4. **Empujar a la rama**
   ```bash
   git push origin feature/amazing-feature
   ```

  5. **Enviar Pull Request**
   - Haz clic en el botón "Pull Request" en la página de GitHub
   - Rellena la descripción del PR, explicando tus cambios

---

> 🌟 **¡Tu contribución ayudará a desarrolladores de todo el mundo a usar mejor las herramientas de AI!**

---

## 📥 Solicitar Tutorial

¿Quieres que tu proyecto también tenga tutoriales de alta calidad? ¡Solo 3 pasos!

### 📝 Proceso de Envío

**Paso 1: Enviar Issue**

1. Visita [GitHub Issues](https://github.com/vbgate/opencodedocs/issues)
2. Haz clic en "New Issue"
3. Usa la siguiente plantilla:

```markdown
**Nombre del Proyecto**: [Nombre del Proyecto]
**Repositorio GitHub**: https://github.com/[owner]/[repo]
**Descripción del Proyecto**: [1-2 frases describiendo el propósito del proyecto]
**Público Objetivo**: [Novato/Intermedio/Experto/Todos]
**Idioma del Tutorial**: [Chino/Inglés/Otro]
**Notas**: [Información adicional]
```

**Paso 2: Revisión del Equipo**

- Revisaremos tu solicitud en 1-3 días laborables
- Evaluaremos si el proyecto es adecuado para su inclusión
- Confirmaremos la calidad y actividad del código fuente del proyecto

**Paso 3: Publicación del Tutorial**

- Una vez aprobado, generamos automáticamente el tutorial
- Verificamos la funcionalidad de cada paso
- Publicamos en el sitio web oficial, con soporte multilingüe

### ⏱️ Tiempo de Procesamiento

- **Ciclo de revisión**: 1-3 días laborables
- **Generación del tutorial**: 3-7 días laborables
- **Tiempo de publicación**: Publicado inmediatamente después de la aprobación

### ❓ Preguntas Frecuentes

**P: ¿Qué tipo de proyectos son adecuados para incluir?**
R: Herramientas de AI de código abierto, herramientas de desarrollo, bibliotecas, frameworks, etc. Necesitan tener cierta profundidad técnica y valor de uso.

**P: ¿Los tutoriales son gratuitos?**
R: Sí, nuestros tutoriales son completamente gratuitos y se actualizarán y mantendrán continuamente.

**P: ¿Puedo especificar el idioma del tutorial?**
R: Sí, soportamos 10 idiomas. Puedes indicar el idioma deseado en el Issue.

---

> 🎯 **Enviar ahora: [Crear Issue →](https://github.com/vbgate/opencodedocs/issues/new)**

---

## 📄 Licencia

### Código del Sitio

[MIT License](LICENSE)

### Contenido de los Tutoriales

[CC-BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)

**Atribución - No Comercial - Compartir Igual**

✅ Puedes:
- 📋 Compartir: Compartir y adaptar libremente
- 🔧 Modificar: Crear obras derivadas basadas en el contenido del tutorial
- 👥 Contribuir: Enviar tus mejoras

❌ No puedes:
- 💰 Uso Comercial: No utilizar sin autorización para fines comerciales

---

> 💡 **Si deseas utilizar los tutoriales para fines comerciales, contáctanos: [vbgatecom@gmail.com](mailto:vbgatecom@gmail.com)**

---

## 📞 Contáctanos

¿Tienes alguna pregunta o sugerencia? Siéntete libre de contactarnos en cualquier momento.

- 📧 **Email**: [vbgatecom@gmail.com](mailto:vbgatecom@gmail.com)
- 🐦 **Twitter**: [@codingzys](https://x.com/codingzys)
- 💻 **GitHub**: [vbgate/opencodedocs](https://github.com/vbgate/opencodedocs)
- 📥 **Enviar Tutorial**: [GitHub Issues](https://github.com/vbgate/opencodedocs/issues)
- 🌐 **Sitio Web**: [opencodedocs.com](https://opencodedocs.com)

---

<div align="center">

**🎉 ¡Gracias por elegir OpenCodeDocs!**

**Desde la primera línea de código hasta aplicaciones de nivel de producción, te proporcionamos tutoriales para cada etapa.**

[⭐ Star en GitHub](../../) · [📥 Solicitar Tutorial](https://github.com/vbgate/opencodedocs/issues/new) · [💬 Unirse a la Discusión](../../discussions)

Made with ❤️ by [OpenCodeDocs Team](https://github.com/vbgate/opencodedocs)

</div>

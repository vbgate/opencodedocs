---
title: "Apéndice: Manual de Referencia Técnica | Antigravity-Manager"
sidebarTitle: "Diccionario Técnico"
subtitle: "Apéndice: Manual de Referencia Técnica"
description: "Consulte materiales de referencia técnica de Antigravity Tools, incluidos endpoints de API, estructura de almacenamiento de datos y límites funcionales. Busque información clave rápidamente."
order: 500
---

# Apéndice

Este capítulo compila materiales de referencia técnica para Antigravity Tools, incluida la referencia rápida de endpoints de API, estructura de almacenamiento de datos y descripciones de límites de funciones experimentales. Cuando necesites consultar rápidamente un detalle técnico, este es tu "diccionario".

## Contenido del Capítulo

| Documento | Descripción | Casos de Uso |
|-----------|-------------|--------------|
| **[Tabla de Referencia de Endpoints](./endpoints/)** | Vista general de rutas HTTP externas: endpoints OpenAI/Anthropic/Gemini/MCP, modos de autenticación y formatos de Header | Integrar nuevos clientes, solucionar errores 404/401 |
| **[Datos y Modelos](./storage-models/)** | Estructura de archivos de cuenta, estructura de tablas de base de datos estadística SQLite, definiciones de campos clave | Respaldo y migración, consultas directas a la base de datos, resolución de problemas |
| **[Límites de Integración z.ai](./zai-boundaries/)** | Lista de funciones implementadas vs. explícitamente no implementadas en z.ai | Evaluar capacidades de z.ai, evitar mal uso |

## Ruta de Aprendizaje Recomendada

```
Tabla de Referencia de Endpoints → Datos y Modelos → Límites de Integración z.ai
            ↓                              ↓                      ↓
     Saber qué ruta llamar           Saber dónde están los datos    Saber dónde están los límites
```

1. **Primero revise la Tabla de Referencia de Endpoints**: Entienda qué APIs están disponibles y cómo configurar la autenticación
2. **Luego Datos y Modelos**: Entienda la estructura de almacenamiento de datos para facilitar respaldos, migraciones y resolución directa de problemas en la base de datos
3. **Por último Límites de Integración z.ai**: Si usa z.ai, esto le ayudará a evitar tratar "no implementado" como "disponible"

::: tip Estos Documentos No Son de Lectura Obligatoria
El apéndice es material de referencia, no un tutorial. No necesita leerlo de principio a fin; simplemente consúltelo cuando encuentre preguntas específicas.
:::

## Prerrequisitos

::: warning Recomendado Primero
- [¿Qué es Antigravity Tools](../start/getting-started/): Construya un modelo mental básico
- [Iniciar Proxy Inverso Local y Conectar el Primer Cliente](../start/proxy-and-first-client/): Complete el flujo de trabajo básico
:::

Si aún no ha completado el flujo de trabajo básico, se recomienda terminar primero el capítulo [Introducción](../start/).

## Siguientes Pasos

Después de leer el apéndice, puede:

- **[Notas de Versión](../changelog/release-notes/)**: Conozca los cambios recientes, verifique antes de actualizar
- **[Preguntas Frecuentes](../faq/invalid-grant/)**: Cuando encuentre errores específicos, busque respuestas en el capítulo FAQ
- **[Configuración Avanzada](../advanced/config/)**: Profundice en recarga en caliente, estrategias de programación y otras funciones avanzadas

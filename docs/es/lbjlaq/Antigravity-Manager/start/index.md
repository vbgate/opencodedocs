---
title: "Inicio rápido: Uso de Antigravity Tools desde cero | Antigravity-Manager"
sidebarTitle: "Empezar desde cero"
subtitle: "Inicio rápido: Uso de Antigravity Tools desde cero"
description: "Aprende el flujo completo de uso de Antigravity Tools. Desde la instalación y configuración hasta la primera llamada a la API, domina rápidamente los métodos principales de uso de la puerta de enlace local."
order: 1
---

# Inicio rápido

Este capítulo te guía desde cero en el uso de Antigravity Tools, completando el flujo completo desde la instalación hasta la primera llamada exitosa a la API. Aprenderás los conceptos clave, la gestión de cuentas, la copia de seguridad de datos, y cómo conectar tu cliente de IA a la puerta de enlace local.

## Contenido de este capítulo

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

<a href="./getting-started/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">¿Qué es Antigravity Tools?</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">Construye el modelo mental correcto: conceptos centrales y límites de uso de la puerta de enlace local, compatibilidad de protocolos y programación de grupo de cuentas.</p>
</a>

<a href="./installation/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Instalación y actualización</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">La mejor ruta de instalación de escritorio (brew / releases), y cómo manejar bloqueos comunes del sistema.</p>
</a>

<a href="./first-run-data/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Primera ejecución: lo esencial</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">Directorio de datos, registros, bandeja y inicio automático. Evita eliminaciones erróneas y pérdidas irreversibles.</p>
</a>

<a href="./add-account/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Añadir cuenta</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">Doble canal OAuth/Refresh Token y mejores prácticas. Construye el grupo de cuentas de la manera más estable.</p>
</a>

<a href="./backup-migrate/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Copia de seguridad y migración de cuentas</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">Importar/exportar, migración en caliente V1/DB. Soporta reutilización multi-dispositivo y escenarios de despliegue en servidor.</p>
</a>

<a href="./proxy-and-first-client/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Iniciar proxy inverso y conectar cliente</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">Desde iniciar el servicio hasta la llamada exitosa del cliente externo. Cierra el ciclo de verificación en una sola ejecución.</p>
</a>

</div>

## Ruta de aprendizaje

::: tip Orden recomendado
Sigue el siguiente orden para aprender para empezar a usar Antigravity Tools lo más rápido posible:
:::

```
1. Comprensión de conceptos →  2. Instalar software        →  3. Conocer directorio de datos
   getting-started                installation                  first-run-data
        ↓                              ↓                              ↓
4. Añadir cuenta          →  5. Copia de seguridad   →  6. Iniciar proxy inverso
   add-account                   backup-migrate                 proxy-and-first-client
```

| Paso | Lección | Tiempo estimado | Qué aprenderás |
|--- | --- | --- | ---|
| 1 | [Comprensión de conceptos](./getting-started/) | 5 minutos | Qué es la puerta de enlace local, por qué necesitas un grupo de cuentas |
| 2 | [Instalar software](./installation/) | 3 minutos | Instalación con brew o descarga manual, manejar bloqueos del sistema |
| 3 | [Conocer directorio de datos](./first-run-data/) | 5 minutos | Dónde están los datos, cómo ver registros, operaciones de bandeja |
| 4 | [Añadir cuenta](./add-account/) | 10 minutos | Autorización OAuth o rellenar manualmente Refresh Token |
| 5 | [Copia de seguridad de cuentas](./backup-migrate/) | 5 minutos | Exportar cuentas, migración entre dispositivos |
| 6 | [Iniciar proxy inverso](./proxy-and-first-client/) | 10 minutos | Iniciar servicio, configurar cliente, verificar llamada |

**Ruta mínima viable**: Si tienes prisa, puedes completar solo 1 → 2 → 4 → 6, aproximadamente 25 minutos para empezar a usar.

## Siguiente paso

Al completar este capítulo, ya puedes usar Antigravity Tools normalmente. A continuación, puedes profundizar según tus necesidades:

- **[Plataformas e integración](../platforms/)**: Conoce los detalles de integración de diferentes protocolos como OpenAI, Anthropic, Gemini, etc.
- **[Configuración avanzada](../advanced/)**: Enrutamiento de modelos, protección de cuotas, programación de alta disponibilidad y otras funciones avanzadas
- **[Preguntas frecuentes](../faq/)**: Guía de solución de problemas cuando encuentres errores como 401, 429, 404, etc.

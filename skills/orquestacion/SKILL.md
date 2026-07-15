---
name: orquestacion
description: Reglas sobre cómo debes coordinar el trabajo en paralelo y la comunicación entre agentes.
---

# Guía de Orquestación y Comunicación entre Agentes

Este documento establece el protocolo que los agentes de Antigravity deben seguir para cooperar de manera autónoma, coordinar tareas paralelas y mantener una comunicación libre de redundancias y conflictos.

---

## 1. Coordinación del Trabajo en Paralelo

Para maximizar la eficiencia en flujos de trabajo multi-agente, se deben seguir las siguientes reglas de distribución:

- **Especialización estricta por roles**:
  - `@frontend` se encarga exclusivamente de la maquetación UI, interactividad del cliente, lógica visual y consumo de APIs de cliente.
  - `@backend` se encarga del modelado de base de datos, lógica de negocio en el servidor, autenticación y API endpoints.
- **Identificación de dependencias**: Antes de iniciar trabajos concurrentes, se debe definir el contrato de la interfaz (los endpoints HTTP y sus esquemas JSON/Zod). Una vez acordado el contrato, ambos agentes pueden trabajar simultáneamente.
- **Uso de Tareas en Background**: Los procesos que tardan en ejecutarse (e.g. tests automatizados, builds) deben mandarse a segundo plano (`run_command` con duración asíncrona) para no bloquear la ejecución del agente principal.

---

## 2. Protocolo de Comunicación entre Agentes

Cuando un agente requiera soporte o delegue una tarea a otro a través de la herramienta `send_message`:

- **Sin duplicación de contexto**: Evita reenviar el historial completo del chat o transcripciones masivas. Envía resúmenes concisos con la información estrictamente necesaria.
- **Estructura del Mensaje**:
  1. **Objetivo Claro**: Qué se espera que haga el agente receptor.
  2. **Contratos/Especificaciones**: Enlaces directos a archivos, firmas de métodos o esquemas de datos.
  3. **Criterios de Aceptación**: Cómo saber si la tarea está terminada con éxito.
- **Gestión de Bloqueos (Blockers)**: Si un agente encuentra un problema bloqueante (por ejemplo, un fallo en base de datos que detiene la UI), debe informarlo inmediatamente de forma clara, indicando el error exacto y los pasos para reproducirlo.

---

## 3. Control de Versiones y Resolución de Conflictos

- **Propiedad del Código**: Cada agente respeta el ámbito de trabajo asignado. Si `@frontend` necesita una modificación en el backend para poder continuar, debe pedírselo a `@backend` en lugar de editar directamente el código del servidor, a menos que el orquestador autorice lo contrario.
- **Sincronización mediante Artefactos**: El plan de implementación (`implementation_plan.md`) y la lista de tareas (`task.md`) son la fuente de verdad. Ambos agentes deben consultar estos archivos de manera constante para alinear su progreso.

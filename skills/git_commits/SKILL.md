---
name: git_commits
description: Reglas obligatorias para redactar mensajes de commit claros, consistentes y estandarizados en este proyecto.
---

# Estándar de mensajes de commit

Este documento define las reglas estrictas para redactar mensajes de commit en este repositorio. Debes aplicar estas instrucciones sin excepción cuando se te pida crear, ajustar o revisar un commit.

## 1. Formato obligatorio

Todos los mensajes de commit deben seguir este formato:

<emoji> <tipo>(<alcance>): <descripción>

### Reglas de la estructura
- Usa exactamente un emoji inicial que represente el tipo de cambio.
- Usa un tipo breve y consistente.
- Usa un alcance entre paréntesis para identificar el módulo, componente o área afectada.
- Usa una descripción corta, clara y accionable.

## 2. Reglas de redacción

- La descripción debe ir en minúsculas.
- La descripción debe escribirse en infinitivo o imperativo, por ejemplo: "agregar", "corregir", "optimizar".
- Evita formas como "agregado", "corrigió", "actualiza".
- Mantén la descripción directa y específica.

## 3. Diccionario de emojis y tipos

| Tipo | Emoji | Uso recomendado |
| --- | --- | --- |
| feat | ✨ | Nuevas características o funcionalidades. |
| fix | 🐛 | Correcciones de errores o fallos. |
| refactor | ♻️ | Mejoras internas de estructura, legibilidad o diseño sin cambiar comportamiento visible. |
| chore | 🚀 | Tareas de mantenimiento, configuración, dependencias, build o automatización. |
| docs | 📝 | Cambios en documentación. |
| style | 💄 | Ajustes visuales, formato o presentación sin impacto funcional. |
| test | 🚨 | Cambios en pruebas o validaciones. |

## 4. Ejemplos de referencia

- ✨ feat(auth): agregar validación de login con base de datos
- 🐛 fix(ui): corregir alineación de tarjetas en el dashboard
- ♻️ refactor(dao): optimizar consultas preparadas de UsuarioDAO
- 🚀 chore(deps): agregar dependencia de jakarta-mail al build.gradle

## 5. Reglas adicionales

- Usa un alcance breve, por ejemplo: auth, ui, api, dao, deps, db, frontend, backend.
- Si el cambio afecta varios módulos, usa un alcance amplio o uno general como core o shared.
- Prioriza mensajes cortos y comprensibles para el historial del proyecto.
- No uses mensajes vagos como "actualización", "mejora" o "cambios varios".

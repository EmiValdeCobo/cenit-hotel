---
name: backend_rules
description: Reglas de Workspace aplicables para desarrollo backend y el agente @backend.
alwaysApply: true
glob: "backend/**/*"
---

# Reglas de Workspace para Backend

Siempre que se trabaje bajo el rol del agente `@backend` o se realicen modificaciones en archivos dentro de la carpeta `backend/`, se debe cumplir obligatoriamente lo siguiente:

- **Habilidades Requeridas**: Leer y aplicar las guías en:
  - [backend_fastapi/SKILL.md](file:///c:/Users/emili/OneDrive/Desktop/cenit/skills/backend_fastapi/SKILL.md)
  - [analizador_de_datos/SKILL.md](file:///c:/Users/emili/OneDrive/Desktop/cenit/skills/analizador_de_datos/SKILL.md)
- **Modelos y Migraciones**: Garantizar el uso de SQLAlchemy 2.0 y validaciones con Pydantic V2 antes de persistir o procesar datos.
- **Consultas complejas**: Estructurar queries en PostgreSQL utilizando CTEs e índices adecuados para optimización de datos.

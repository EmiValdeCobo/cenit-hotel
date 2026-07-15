---
name: analizador_de_datos
description: Reglas para estructurar queries complejas en PostgreSQL, optimización de agregaciones, y endpoints de reportes estadísticos.
---

# Guía de Análisis de Datos y Consultas PostgreSQL

Este documento establece los estándares y pautas de optimización para consultas a bases de datos PostgreSQL, agregaciones analíticas y el diseño de APIs estadísticas.

---

## 1. Estructura de Consultas PostgreSQL Complejas

- **Legibilidad sobre Brevedad**: Utiliza nombres de alias descriptivos para tablas y columnas.
- **Common Table Expressions (CTEs)**: Usa `WITH` para modularizar y hacer legibles las consultas complejas y anidadas. Evita las subconsultas profundas dentro del `FROM` o `WHERE`.
- **Funciones de Ventana (Window Functions)**: Utiliza `OVER (PARTITION BY ... ORDER BY ...)` para cálculos acumulados, rangos (`RANK`, `DENSE_RANK`), diferencias temporales (`LAG`, `LEAD`) y promedios móviles sin necesidad de realizar múltiples auto-joins.

```sql
-- Ejemplo correcto: Uso de CTEs y Window Functions
WITH VentasMensuales AS (
    SELECT 
        v.vendedor_id,
        v.vendedor_nombre,
        DATE_TRUNC('month', v.fecha) AS mes,
        SUM(v.monto) AS total_ventas
    FROM ventas v
    GROUP BY v.vendedor_id, v.vendedor_nombre, DATE_TRUNC('month', v.fecha)
),
VentasConRango AS (
    SELECT 
        vendedor_id,
        vendedor_nombre,
        mes,
        total_ventas,
        RANK() OVER (PARTITION BY mes ORDER BY total_ventas DESC) as ranking_mes,
        LAG(total_ventas, 1) OVER (PARTITION BY vendedor_id ORDER BY mes) as ventas_mes_anterior
    FROM VentasMensuales
)
SELECT * 
FROM VentasConRango 
WHERE ranking_mes <= 3;
```

---

## 2. Optimización de Agregaciones y Consultas

Para evitar problemas de rendimiento en bases de datos con volumen medio/alto:
- **Evita `SELECT *`**: Solicita únicamente las columnas necesarias. Esto reduce el tráfico de red y permite un uso eficiente de índices de cobertura.
- **Estrategia de Indexación**:
  - Crea índices B-Tree en columnas que se utilicen frecuentemente para filtrar (`WHERE`) o realizar joins (`JOIN`).
  - Utiliza índices parciales (`CREATE INDEX ... WHERE active = true`) para tablas con datos sesgados.
  - Diseña índices compuestos respetando el orden de izquierda a derecha según la selectividad y filtros comunes.
- **Agregaciones Pesadas**:
  - Para reportes históricos lentos, implementa **Vistas Materializadas** (`MATERIALIZED VIEW`) y configúralas para actualizarse de forma asíncrona mediante cron jobs (e.g., cada hora o diariamente).
  - Limita el uso de ordenamientos explícitos (`ORDER BY`) y agrupaciones (`GROUP BY`) sobre campos de texto largo sin indexar.

---

## 3. Endpoints de Reportes Estadísticos

- **Estructuración de Respuestas**: Las respuestas analíticas deben estar formateadas para integrarse fácilmente con bibliotecas de visualización del frontend (como Chart.js, Recharts o D3.js).
- **Tipos de Datos Estandarizados**:
  - **Series Temporales**: Devuelve arrays de objetos con claves `date` (formato ISO 8601 YYYY-MM-DD o timestamp) y `value`.
  - **Distribuciones y Categorías**: Utiliza formatos llave-valor planos `[{ "category": "A", "count": 120 }]`.
- **Parámetros de Filtrado Obligatorios**: Todos los endpoints estadísticos deben soportar límites temporales (`start_date`, `end_date`) con valores por defecto razonables (e.g., últimos 30 días) para evitar sobrecargar el servidor con consultas que escaneen tablas completas.
- **Paginación y Agregación**: Si el volumen de datos a retornar es masivo, realiza la agregación del lado del servidor utilizando PostgreSQL y retorna solo el resumen estadístico en lugar de delegar el cálculo al frontend.

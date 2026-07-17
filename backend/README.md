# Cenit Backend

Este es el módulo backend del proyecto Cenit. Provee una API RESTful robusta, construida en Python, para la gestión integral del hotel. Maneja operaciones clave como el control de hoteles, habitaciones, huéspedes, reservaciones, estadías, servicios, empleados y reportes.

## Stack Tecnológico y Versiones

- **Framework API:** [FastAPI](https://fastapi.tiangolo.com/) versión **>=0.110.0**
- **Servidor ASGI:** [Uvicorn](https://www.uvicorn.org/) versión **>=0.28.0**
- **ORM:** [SQLAlchemy](https://www.sqlalchemy.org/) versión **>=2.0.28**
- **Base de Datos:** PostgreSQL (conector `psycopg2-binary` **>=2.9.9**)
- **Migraciones:** [Alembic](https://alembic.sqlalchemy.org/) versión **>=1.13.1**
- **Validación de Datos:** [Pydantic](https://docs.pydantic.dev/) versión **>=2.6.3**

## Estructura del Código

- `main.py`: Punto de entrada de la aplicación FastAPI, donde se inicializa la app y se configuran los `routers` y los controladores de excepciones.
- `routers/`: Contiene los distintos endpoints agrupados por dominios (ej. hoteles, habitaciones, etc.).
- `services/`: Lógica de negocio y reglas de la aplicación.
- `schemas/`: Modelos de Pydantic usados para la validación y serialización de los datos (entradas y salidas de la API).
- `db/`: Modelos de base de datos declarativos (SQLAlchemy) y la configuración de conexión a la BD.
- `alembic/`: Archivos y scripts para gestionar las migraciones de la base de datos a medida que los modelos cambian.
- `errors/`: Manejo unificado de errores y excepciones del negocio.

## Ejecución Local

Existen dos formas principales de levantar el backend: utilizando Docker (recomendado para desarrollo por la facilidad de tener la DB) o corriendo de forma local.

### Usando Docker Compose (Recomendado)

En la raíz del proyecto global (o directamente en `backend`), ejecuta:

```bash
docker-compose up --build
```
Este comando levantará los servicios estipulados, que habitualmente incluyen el servicio de base de datos PostgreSQL y el servidor FastAPI.

### Entorno Virtual (Local)

1. Crear un entorno virtual e instalar las dependencias:
   ```bash
   python -m venv venv
   
   # Activar el entorno virtual (Windows)
   .\venv\Scripts\activate
   # (Linux/Mac)
   # source venv/bin/activate
   
   # Instalar requerimientos
   pip install -r requirements.txt
   ```
2. Asegúrate de configurar tus credenciales de base de datos. Renombra `.env.example` a `.env` (si existe) y ajusta los valores de conexión.
3. Ejecutar el servidor usando Uvicorn:
   ```bash
   uvicorn main:app --reload
   ```

Una vez el servidor esté en ejecución, puedes explorar y probar todos los endpoints a través de la documentación interactiva provista por Swagger UI:
[http://localhost:8000/docs](http://localhost:8000/docs)

Además, dispones de una explicación detallada y estática de las reglas de negocio y esquemas en:
[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)


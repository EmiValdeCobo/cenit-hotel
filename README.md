# Cenit - Sistema de Gestión Hotelera

Cenit es un sistema integral de gestión hotelera (Hotel Management System). Este proyecto está dividido en dos partes principales: un **Backend** desarrollado con FastAPI (Python) y un **Frontend** desarrollado con Next.js (React).

## Estructura del Proyecto

El repositorio está organizado en las siguientes carpetas principales:

- `/backend`: Contiene la API RESTful, modelos de base de datos, lógica de negocio y migraciones. Construido con **FastAPI** y **PostgreSQL**.
- `/frontend`: Contiene la interfaz de usuario web interactiva. Construido con **Next.js 16**, **React 19** y **Tailwind CSS**.

## Requisitos Previos

Para ejecutar este proyecto localmente, necesitarás tener instalado:

- [Node.js](https://nodejs.org/) (versión 20 o superior recomendada)
- [Python](https://www.python.org/) (versión 3.9 o superior recomendada)
- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/) (para la base de datos y contenedorización del backend)

## Instalación y Configuración

El proyecto incluye scripts en el archivo `package.json` de la raíz para facilitar la instalación y ejecución de todo el entorno.

1. **Clonar el repositorio** e ir a la carpeta raíz del proyecto.
2. **Instalar dependencias globales y de ambos entornos**:
   ```bash
   npm run setup
   ```
   Esto instalará las dependencias de Node en el frontend e instalará las dependencias de Python en un entorno virtual (`venv`) dentro de la carpeta `backend`.

## Ejecución en Desarrollo

Puedes levantar ambos servicios (frontend y backend) simultáneamente usando el script integrado:

```bash
npm run dev
```

Este comando utilizará `concurrently` para:
1. Levantar el Backend usando Docker Compose (`npm run dev:backend`), exponiendo la API de FastAPI.
2. Levantar el Frontend usando el servidor de desarrollo de Next.js (`npm run dev:frontend`), disponible usualmente en http://localhost:3000.

Para detener los servicios de Docker del backend, puedes usar:
```bash
npm run docker:down
```

---

Consulta el [README del Frontend](./frontend/README.md) y el [README del Backend](./backend/README.md) para detalles específicos de cada módulo, incluyendo arquitecturas y versiones exactas de las tecnologías.

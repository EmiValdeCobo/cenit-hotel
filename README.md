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

## Ejecución en Desarrollo (Recomendado para evitar problemas de memoria)

Dado que ejecutar ambos servicios en paralelo o mediante contenedores puede consumir demasiada RAM (especialmente el nuevo compilador de Next.js), se recomienda **ejecutar los servicios por separado y sin Docker**.

### 1. Levantar el Backend (API FastAPI localmente)
En una terminal nueva, ejecuta el backend directamente usando el entorno virtual de Python:

```bash
cd backend
# Activar entorno virtual (Windows)
.\venv\Scripts\activate
# O en Mac/Linux: source venv/bin/activate

# Iniciar el servidor Uvicorn
uvicorn main:app --reload
```
La API estará disponible en `http://localhost:8000`.

### 2. Levantar el Frontend (Modo Producción)
El servidor de desarrollo (`npm run dev`) puede crashear por falta de memoria (Out Of Memory) en sistemas con recursos limitados. Se recomienda compilar el proyecto y correrlo en producción:

En otra terminal separada:
```bash
cd frontend
npm run build
npm run start
```
El frontend estará disponible de forma ultra-rápida y estable en `http://localhost:3000`.

---

Consulta el [README del Frontend](./frontend/README.md) y el [README del Backend](./backend/README.md) para detalles específicos de cada módulo, incluyendo arquitecturas y versiones exactas de las tecnologías.

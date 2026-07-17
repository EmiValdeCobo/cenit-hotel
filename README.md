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

El proyecto incluye soporte para gestores de paquetes como **npm** y **pnpm**. 

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd cenit-hotel
```

### 2. Configurar el Entorno

Dependiendo de tu sistema operativo y gestor de paquetes preferido, sigue una de las opciones:

#### Opción A: Usando NPM (Windows)
```bash
npm run setup
```
*Esto instalará las dependencias del frontend y configurará el entorno virtual de Python (`venv`) con sus dependencias en la carpeta `/backend`.*

#### Opción B: Usando NPM (Linux / macOS)
En Linux/macOS, debido a las diferencias en las rutas de los ejecutables de Python, realiza la instalación de forma manual o ajustando los comandos:
```bash
npm install
npm run install:frontend
# Configurar backend manualmente en Linux:
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..
```

#### Opción C: Usando PNPM (Cualquier Sistema Operativo)
Si prefieres usar `pnpm`, ejecuta los siguientes comandos desde la raíz:
```bash
# Instalar dependencias de Node para el espacio de trabajo
pnpm install

# Configurar el entorno virtual del backend
cd backend
# En Windows:
python -m venv venv
.\venv\Scripts\pip install -r requirements.txt
# En Linux / macOS:
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..
```

---

## Ejecución de los Servicios

Puedes levantar toda la aplicación en paralelo o iniciar los servicios de manera individual.

### Método 1: Levantar ambos a la vez (Simultáneamente)
Este método levantará la base de datos de PostgreSQL en Docker y el servidor de desarrollo del frontend al mismo tiempo usando `concurrently`.

- **Usando NPM:**
  ```bash
  npm run dev
  ```
- **Usando PNPM:**
  ```bash
  pnpm run dev
  ```

---

### Método 2: Levantar individualmente (Recomendado para ahorrar memoria RAM)
Si estás en un equipo con recursos limitados o deseas debuguear el backend y el frontend por separado sin usar contenedores Docker para la lógica de la API:

#### 1. Iniciar solo la base de datos (PostgreSQL en Docker)
Navega a la carpeta `/backend` e inicia únicamente el servicio de base de datos en segundo plano (`-d`):
```bash
cd backend
docker-compose up -d db
```

#### 2. Levantar el Backend (FastAPI de Python)
Abre una terminal nueva para el backend:
```bash
cd backend
# Activar entorno virtual:
# En Windows:
.\venv\Scripts\activate
# En Linux / macOS:
source venv/bin/activate

# Iniciar servidor FastAPI local
uvicorn main:app --reload
```
La API estará disponible en `http://localhost:8000`.

#### 3. Levantar el Frontend (Next.js)
Abre otra terminal para el frontend:
- **Usando NPM:**
  ```bash
  cd frontend
  npm run dev      # Modo desarrollo
  # O para modo producción (consume menos memoria):
  npm run build && npm run start
  ```
- **Usando PNPM:**
  ```bash
  cd frontend
  pnpm dev         # Modo desarrollo
  # O para modo producción (consume menos memoria):
  pnpm build && pnpm start
  ```
El frontend estará disponible en `http://localhost:3000`.

---

## Solución de Problemas en Linux

1. **Permisos de Docker:** Si al correr `docker-compose` obtienes un error de permisos, asegúrate de iniciar el daemon de docker o usar sudo:
   ```bash
   sudo systemctl start docker
   # Añadir tu usuario al grupo docker para evitar usar sudo:
   sudo usermod -aG docker $USER
   ```
2. **Puertos en uso:** Si el puerto `5432` está en uso, verifica si tienes un PostgreSQL local corriendo en tu sistema nativo Linux:
   ```bash
   sudo systemctl stop postgresql
   ```
3. **Versión de Python:** Asegúrate de instalar `python3-venv` en distribuciones Debian/Ubuntu antes de crear el entorno virtual:
   ```bash
   sudo apt update && sudo apt install python3-venv python3-pip
   ```


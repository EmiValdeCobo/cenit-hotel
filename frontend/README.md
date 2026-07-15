# Cenit Frontend

Este es el módulo frontend del proyecto Cenit (Sistema de Gestión Hotelera). Proporciona la interfaz de usuario web dinámica y responsiva con la que interactúan los clientes y administradores del hotel.

## Stack Tecnológico y Versiones

- **Framework:** [Next.js](https://nextjs.org/) versión **16.2.10**
- **Librería UI:** [React](https://react.dev/) versión **19.2.4**
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) versión **^5**
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/) versión **^4**
- **Validación de esquemas:** [Zod](https://zod.dev/) versión **^4.4.3**

## Estructura del Código

- `src/`: Contiene el código fuente principal (componentes, páginas, lógica del cliente).
- `public/`: Archivos estáticos como imágenes y fuentes.
- `scripts/`: Scripts personalizados de desarrollo.

## Ejecución Local

Para ejecutar únicamente el entorno de desarrollo del frontend (se recomienda que el backend esté corriendo simultáneamente para que la aplicación funcione en su totalidad):

```bash
# Navegar a la carpeta frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

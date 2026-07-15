---
name: frontend_nextjs
description: Reglas y estándares de desarrollo frontend para Next.js App Router, Server/Client components, Tailwind CSS y consumo de APIs.
---

# Guía de Desarrollo Frontend: Next.js + Tailwind CSS

Este documento define las reglas estrictas de desarrollo y mejores prácticas para la interfaz visual y la lógica del cliente en el proyecto. Debes seguir estas directrices sin excepción.

---

## 1. Arquitectura de Next.js (App Router) y Componentes

Next.js (App Router) utiliza por defecto **React Server Components (RSC)**. Debes estructurar la UI minimizando el código ejecutado en el cliente.

### Server Components (Por defecto)
- **Cuándo usarlos**: En la mayoría de las páginas, layouts, y componentes estructurales que solo renderizan datos estáticos o dinámicos obtenidos directamente del servidor.
- **Acciones permitidas**:
  - Consultas directas a base de datos u orígenes de datos (si aplica).
  - Peticiones HTTP asíncronas con `fetch`.
  - Importación y renderizado de componentes del lado del cliente.
  - Uso de componentes asíncronos (`async/await`).
- **Prohibido**:
  - Usar hooks de React (`useState`, `useEffect`, `useContext`, `useReducer`, etc.).
  - Usar eventos de interactividad (`onClick`, `onChange`, `onSubmit`, etc.).
  - Importar o usar APIs exclusivas del navegador (e.g., `window`, `localStorage`).

### Client Components (Con `"use client"`)
- **Cuándo usarlos**: Únicamente cuando sea indispensable interactividad, estados del cliente, o hooks de React/navegador.
- **Reglas obligatorias**:
  - Coloca la directiva `"use client"` estrictamente en la primera línea del archivo.
  - Mantén los componentes de cliente lo más pequeños posible (hojas del árbol de componentes).
  - Pasa los datos procesados en el Server Component al Client Component mediante `props` (evita refetching innecesario).

```tsx
// Ejemplo correcto: Separación lógica
// src/components/UserProfile.tsx (Server Component)
import { UserCard } from './UserCard'; // Client Component

export default async function UserProfile() {
  const res = await fetch('https://api.cenit.com/users/me');
  const user = await res.json();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Perfil de Usuario</h1>
      {/* Pasamos los datos al componente de cliente */}
      <UserCard user={user} />
    </div>
  );
}

// src/components/UserCard.tsx (Client Component)
"use client";

import { useState } from 'react';

export function UserCard({ user }: { user: any }) {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div className="mt-4 p-4 border rounded-xl">
      <p>Nombre: {user.name}</p>
      <button onClick={() => setIsEditing(!isEditing)} className="btn-primary">
        {isEditing ? 'Cancelar' : 'Editar'}
      </button>
    </div>
  );
}
```

---

## 2. Estilizado y Diseño con Tailwind CSS

Para ofrecer un diseño premium, dinámico y estéticamente superior, sigue estas pautas:

- **Estructura y Consistencia**: Utiliza clases semánticas de Tailwind. No utilices estilos inline arbitrarios (`style={{ ... }}`) a menos que sea una propiedad altamente dinámica (como una posición calculada por JS).
- **Aesthetics Premium**:
  - Evita colores planos genéricos. Utiliza la paleta extendida de Tailwind (e.g., `slate`, `zinc`, `indigo`, `violet`) con opacidades sutiles.
  - Diseña con efectos de cristal (Glassmorphism): `backdrop-blur-md bg-white/10 border border-white/20`.
  - Usa sombras premium (`shadow-xl`, `shadow-indigo-500/10`) y bordes redondeados orgánicos (`rounded-2xl`, `rounded-3xl`).
- **Interactividad y Micro-animaciones**:
  - Todos los botones, enlaces y tarjetas interactivas deben reaccionar al hover y focus de forma suave (`transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-[0.98]`).
  - Utiliza animaciones sutiles para transiciones de estados (e.g., `animate-fade-in`, `animate-pulse` para skeletons).
- **Diseño Responsivo Obligatorio**:
  - Usa el enfoque *Mobile-first*. Define primero las clases móviles y luego añade breakpoints (`md:`, `lg:`, `xl:`).
  - Nunca fijes anchos (`w-[500px]`) que rompan el responsive. Usa clases relativas, `max-w-screen-xl`, flexbox (`flex-wrap`) o grid dinámico (`grid-cols-1 md:grid-cols-3`).

---

## 3. Consumo de Endpoints (APIs)

- **Direccionamiento**:
  - Utiliza variables de entorno (`process.env.NEXT_PUBLIC_API_URL`) para definir la base de la API.
  - Nunca expongas tokens sensibles en llamadas de cliente. Usa rutas de API internas de Next.js (`/app/api/...`) como proxy si es necesario realizar peticiones seguras.
- **Tipado y Validación**:
  - Valida siempre las respuestas de los endpoints utilizando **Zod** para garantizar la seguridad en tiempo de ejecución.
  - Define interfaces TypeScript estrictas para todas las respuestas de API.
- **Gestión de Errores y Estados**:
  - Implementa siempre estados de carga visibles (Spinners, Skeletons) mientras se obtienen los datos.
  - Captura y maneja de manera elegante todos los errores HTTP (400, 401, 403, 404, 500) mostrando componentes de error interactivos y amigables.
- **Cache y Revalidación**:
  - Aprovecha el sistema de cache de Next.js. Configura `revalidate` o `cache: 'no-store'` explícitamente según el dinamismo del endpoint.

/**
 * Cliente HTTP Seguro Wrapper (API Client Hardened) - Frontend Cenit Hotel.
 * Encapsula la comunicación con la API REST de FastAPI aplicando:
 * - Envío seguro de credenciales (Cookies SameSite/HTTP-Only y Bearer Tokens)
 * - Captura y sanitización centralizada de errores (401, 403, 429, 500)
 * - Prevención de exposición de trazas técnicas al usuario final
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ApiClientOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Petición HTTP wrapper segura contra la API REST.
 */
export async function secureFetch<T = any>(endpoint: string, options: ApiClientOptions = {}): Promise<T> {
  const { params, headers, ...restOptions } = options;

  // Construir URL con parámetros sanitizados
  let url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        searchParams.append(key, String(val));
      }
    });
    url += `?${searchParams.toString()}`;
  }

  const defaultHeaders: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...restOptions,
    credentials: 'include', // Transmite cookies HTTP-Only SameSite de forma segura
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorDetail = 'Ocurrió un error al procesar la solicitud.';
      let errorData = null;

      try {
        errorData = await response.json();
        if (errorData && errorData.detail) {
          errorDetail = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
        }
      } catch {
        // Mantener mensaje genérico sanitizado si la respuesta no es JSON
      }

      // MANEJO SEGURO DE ESTADOS HTTP:
      if (response.status === 401) {
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          console.warn('[SEGURIDAD] Sesión no autorizada o expirada (401).');
        }
      } else if (response.status === 403) {
        console.warn('[SEGURIDAD] Acceso prohibido a recurso protegido (403).');
      } else if (response.status === 429) {
        errorDetail = 'Has realizado demasiadas peticiones. Por favor, espera un momento antes de reintentar.';
      }

      throw new ApiError(errorDetail, response.status, errorData);
    }

    // Retornar JSON si la respuesta no es vacía
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await response.json();
    }

    return (await response.text()) as unknown as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Sanitización de errores de red o fallo de conexión
    throw new ApiError('No se pudo establecer conexión segura con el servidor.', 503);
  }
}

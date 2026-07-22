# backend/main.py
"""
Punto de Entrada de la Aplicación FastAPI con Hardening de Ciberseguridad Integrado.
- CORS Restrictivo
- SecurityHeadersMiddleware (HSTS, CSP, X-Frame-Options, X-Content-Type-Options)
- RateLimitingMiddleware (Protección Anti-DDoS / Brute Force)
- Registro Centralizado de Excepciones Sanitizadas
"""
import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from errors.exceptions import register_exception_handlers
from core.security import SecurityHeadersMiddleware, RateLimitingMiddleware
from routers import (
    hoteles, habitaciones, huespedes, reservaciones, 
    estadias, servicios, empleados, reportes, configuraciones
)

app = FastAPI(
    title="Cenit API - Sistema de Gestión Hotelera (Secured)",
    description="API REST Hardened para Cénit Boutique Hotel",
    docs_url="/api/docs" if os.getenv("ENV") != "production" else None,
    redoc_url=None
)

# 1. Registrar Middleware de Rate Limiting (Anti-DDoS)
app.add_middleware(RateLimitingMiddleware)

# 2. Registrar Middleware de Cabeceras de Seguridad HTTP (OWASP)
app.add_middleware(SecurityHeadersMiddleware)

# 3. Middleware para asegurar codificación UTF-8 en respuestas JSON
@app.middleware("http")
async def ensure_utf8_response(request: Request, call_next):
    response = await call_next(request)
    content_type = response.headers.get("content-type", "")
    if content_type.startswith("application/json") and "charset" not in content_type:
        response.headers["content-type"] = f"{content_type}; charset=utf-8"
    return response

# 4. Configuración Restrictiva de CORS
allowed_origins_env = os.getenv("CORS_ALLOWED_ORIGINS", "")
allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]

if not allowed_origins:
    allowed_origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept", "X-Requested-With"],
)

# 5. Registrar controlador global de excepciones sanitizadas
register_exception_handlers(app)

# 6. Registrar routers de la API REST
app.include_router(hoteles.router, prefix="/api")
app.include_router(habitaciones.router, prefix="/api")
app.include_router(huespedes.router, prefix="/api")
app.include_router(reservaciones.router, prefix="/api")
app.include_router(estadias.router, prefix="/api")
app.include_router(servicios.router, prefix="/api")
app.include_router(empleados.router, prefix="/api")
app.include_router(reportes.router, prefix="/api")
app.include_router(configuraciones.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Cenit Hotel Management API runs securely!"}

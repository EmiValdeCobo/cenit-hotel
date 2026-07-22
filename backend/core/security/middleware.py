# backend/core/security/middleware.py
"""
Middlewares de Ciberseguridad para FastAPI.
- SecurityHeadersMiddleware: Inyecta cabeceras HTTP defensivas (HSTS, CSP, XSS, Frame-Options, etc.).
- RateLimitingMiddleware: Intercepta peticiones entrantes y aplica restricción de frecuencia por IP.
"""
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from core.security.rate_limiter import global_rate_limiter
import logging

logger = logging.getLogger("CenitSecurity")

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Middleware para inyectar cabeceras HTTP de seguridad OWASP en cada respuesta."""

    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)
        
        # Evitar inyección MIME
        response.headers["X-Content-Type-Options"] = "nosniff"
        # Prevenir Clickjacking
        response.headers["X-Frame-Options"] = "DENY"
        # Filtro XSS en navegadores legados
        response.headers["X-XSS-Protection"] = "1; mode=block"
        # HSTS (Forzar HTTPS durante 1 año)
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        # Referrer Policy restrictivo
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        # Content Security Policy (CSP) base
        response.headers["Content-Security-Policy"] = "default-src 'self'; frame-ancestors 'none';"

        return response


class RateLimitingMiddleware(BaseHTTPMiddleware):
    """Middleware para limitar el número de peticiones por IP (Anti-DDoS / Brute Force)."""

    async def dispatch(self, request: Request, call_next) -> Response:
        # Eximir archivos estáticos o favicon si fuera necesario
        if request.url.path == "/favicon.ico":
            return await call_next(request)

        # Obtener IP del cliente (considerando cabecera X-Forwarded-For si hay proxy)
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            client_ip = forwarded_for.split(",")[0].strip()
        else:
            client_ip = request.client.host if request.client else "127.0.0.1"

        allowed, retry_after = global_rate_limiter.is_allowed(client_ip)

        if not allowed:
            logger.warning(f"[SECURITY ALERT] Exceso de peticiones detectado desde la IP {client_ip}.")
            return JSONResponse(
                status_code=429,
                content={
                    "success": False,
                    "detail": "Demasiadas peticiones. Por favor, reintente más tarde.",
                    "retry_after_seconds": retry_after
                },
                headers={"Retry-After": str(retry_after)}
            )

        return await call_next(request)

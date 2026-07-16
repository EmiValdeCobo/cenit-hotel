# backend/main.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from errors.exceptions import register_exception_handlers
from routers import hoteles, habitaciones, huespedes, reservaciones, estadias, servicios, empleados, reportes, configuraciones

app = FastAPI(title="Cenit API - Sistema de Gestión Hotelera")

@app.middleware("http")
async def ensure_utf8_response(request: Request, call_next):
    response = await call_next(request)
    content_type = response.headers.get("content-type", "")
    if content_type.startswith("application/json") and "charset" not in content_type:
        response.headers["content-type"] = f"{content_type}; charset=utf-8"
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar controlador global de excepciones de negocio y de sistema
register_exception_handlers(app)

# Registrar todos los routers de la API
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
    return {"message": "Cenit Hotel Management API runs successfully!"}

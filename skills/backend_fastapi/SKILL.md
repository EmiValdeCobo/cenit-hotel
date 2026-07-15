---
name: backend_fastapi
description: Reglas y estándares de desarrollo backend para FastAPI, Pydantic V2, Patrón Repositorio y SQLAlchemy.
---

# Guía de Desarrollo Backend: FastAPI + SQLAlchemy + Pydantic V2

Este documento define las reglas estrictas de desarrollo y mejores prácticas para el diseño, estructura y lógica del servidor en el proyecto. Debes seguir estas directrices sin excepción.

---

## 1. Tipado y Validación con Pydantic V2

Pydantic V2 es la base para la serialización y validación de datos en FastAPI.
- **Uso de anotaciones**: Todas las entradas y salidas de las API deben estar estrictamente tipadas con esquemas de Pydantic.
- **Validadores de Campo (`@field_validator`)**: Usa validadores de campo para lógica específica de validación de atributos individuales.
- **Validadores de Modelo (`@model_validator`)**: Usa validadores antes o después de la creación del modelo para lógica que dependa de múltiples campos.
- **Metadatos y Restricciones**: Utiliza `Field` de Pydantic para definir valores por defecto, límites (`gt`, `lt`, `min_length`, `max_length`), descripciones y ejemplos.

```python
from pydantic import BaseModel, Field, field_validator, model_validator
from typing import Optional

class UserCreate(BaseModel):
    email: str = Field(..., description="Correo electrónico único del usuario", example="user@cenit.com")
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8)
    role: Optional[str] = Field("user", pattern="^(admin|user|manager)$")

    @field_validator("email")
    @classmethod
    def validate_email_domain(cls, v: str) -> str:
        if not v.endswith(("@cenit.com", "@gmail.com")):
            raise ValueError("El correo debe pertenecer a un dominio permitido.")
        return v.lower()
```

---

## 2. Estructura y Patrón Repositorio

El patrón repositorio desacopla la lógica de negocio (servicios/routers) de la persistencia de datos (SQLAlchemy).
- **Interface Base**: Define operaciones CRUD comunes en un repositorio genérico para evitar duplicidad de código.
- **Repositorios Específicos**: Heredan del repositorio base e implementan consultas personalizadas o complejas.
- **Servicios**: La capa intermedia (Service Layer) consume los repositorios, maneja transacciones y ejecuta lógica de negocio pura. Los routers de FastAPI **solo** interactúan con la capa de servicios.

```
📁 backend/
  📁 routers/        # Recibe HTTP requests, valida esquemas Pydantic y llama a Services.
  📁 services/       # Lógica de negocio pura, orquestación y llamadas a Repositories.
  📁 db/
    📁 repositories/ # Consultas SQL y acceso a la base de datos (SQLAlchemy).
    📄 models.py     # Modelos declarativos de SQLAlchemy.
    📄 database.py   # Configuración de la sesión asíncrona.
```

---

## 3. Estructura y Sesiones de SQLAlchemy 2.0

SQLAlchemy 2.0 utiliza un estilo de tipado moderno y declarativo.
- **Declaraciones Modernas**: Utiliza `Mapped[...]` y `mapped_column(...)` para definir esquemas de tabla.
- **Relaciones**: Usa `relationship` con anotaciones de tipo claras y opciones como `lazy="selectin"` (para colecciones en sesiones asíncronas) o `lazy="joined"`.
- **Sesiones Asíncronas**: Utiliza `AsyncSession` de manera exclusiva.
- **Inyección de Dependencias**: Obtén la sesión de la base de datos a través de dependencias de FastAPI (`Depends`).

```python
# db/models.py
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey
from typing import List

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    
    posts: Mapped[List["Post"]] = relationship(back_populates="author", lazy="selectin")

# db/database.py Dependency Injection
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

engine = create_async_engine("postgresql+asyncpg://user:pass@localhost/db")
AsyncSessionLocal = async_sessionmaker(bind=engine, expire_on_commit=False)

async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
```

---

## 4. Manejo de Errores y Excepciones

- **Excepciones de Negocio**: Crea una excepción base para tu aplicación (`AppException`) y hereda de ella para crear excepciones semánticas (e.g., `EntityNotFoundException`, `PermissionDeniedException`).
- **Manejadores Globales (`Exception Handlers`)**: Registra manejadores globales en la instancia de FastAPI para capturar excepciones personalizadas y retornar una respuesta JSON estándar con códigos de error y mensajes claros.
- **Logs**: Registra los errores en consola/archivos usando la librería nativa `logging` antes de levantar cualquier excepción.

```python
# routers/errors.py
from fastapi import Request, FastAPI
from fastapi.responses import JSONResponse

class AppException(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code

class EntityNotFoundException(AppException):
    def __init__(self, entity_name: str, entity_id: any):
        super().__init__(f"{entity_name} con ID {entity_id} no encontrado.", 404)

def register_exception_handlers(app: FastAPI):
    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"success": False, "error": exc.message}
        )
```

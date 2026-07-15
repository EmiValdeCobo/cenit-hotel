# backend/errors/exceptions.py
from fastapi import Request, FastAPI
from fastapi.responses import JSONResponse
import logging

logger = logging.getLogger("hotel_api")

class AppException(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class EntityNotFoundException(AppException):
    def __init__(self, entity_name: str, entity_id: any):
        super().__init__(f"{entity_name} con ID {entity_id} no fue encontrado.", 404)

class BusinessException(AppException):
    def __init__(self, message: str):
        super().__init__(message, 400)

class DatabaseException(AppException):
    def __init__(self, message: str):
        super().__init__(f"Error de base de datos: {message}", 500)

def register_exception_handlers(app: FastAPI):
    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        logger.error(f"AppException: {exc.message} (Status: {exc.status_code})")
        return JSONResponse(
            status_code=exc.status_code,
            content={"success": False, "error": exc.message}
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled Exception: {str(exc)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": "Error interno del servidor."}
        )

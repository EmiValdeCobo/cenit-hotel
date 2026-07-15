# backend/services/servicio_service.py
from sqlalchemy.orm import Session
from db.repositories.servicio_repository import ServicioRepository

class ServicioService:
    def __init__(self, db: Session):
        self.repo = ServicioRepository(db)

    def listar_servicios(self):
        return self.repo.get_all()

    def obtener_mas_consumidos(self):
        return self.repo.get_mas_consumidos()

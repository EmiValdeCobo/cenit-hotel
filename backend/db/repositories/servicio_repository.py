# backend/db/repositories/servicio_repository.py
from sqlalchemy.orm import Session
from sqlalchemy import text
from db.models import Servicio
from db.repositories.base import BaseRepository
from typing import List, Dict, Any

class ServicioRepository(BaseRepository[Servicio]):
    def __init__(self, db: Session):
        super().__init__(Servicio, db)

    def get_mas_consumidos(self) -> List[Dict[str, Any]]:
        query = text("SELECT * FROM v_servicios_mas_consumidos_tipo_habitacion")
        result = self.db.execute(query)
        return [dict(row._mapping) for row in result]

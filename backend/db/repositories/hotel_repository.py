# backend/db/repositories/hotel_repository.py
from sqlalchemy.orm import Session
from sqlalchemy import text
from db.models import Hotel
from db.repositories.base import BaseRepository
from typing import List, Dict, Any

class HotelRepository(BaseRepository[Hotel]):
    def __init__(self, db: Session):
        super().__init__(Hotel, db)

    def get_datos_generales(self) -> List[Dict[str, Any]]:
        query = text("SELECT * FROM v_datos_generales_hoteles")
        result = self.db.execute(query)
        return [dict(row._mapping) for row in result]

    def get_info_general(self) -> List[Dict[str, Any]]:
        query = text("SELECT * FROM v_info_general_hoteles")
        result = self.db.execute(query)
        return [dict(row._mapping) for row in result]

    def get_detalle_habitaciones_y_comodidades(self) -> List[Dict[str, Any]]:
        query = text("SELECT * FROM v_detalle_habitaciones_y_comodidades")
        result = self.db.execute(query)
        return [dict(row._mapping) for row in result]

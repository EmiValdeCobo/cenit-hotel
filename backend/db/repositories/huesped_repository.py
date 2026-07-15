# backend/db/repositories/huesped_repository.py
from sqlalchemy.orm import Session
from sqlalchemy import text
from db.models import Huesped
from db.repositories.base import BaseRepository
from typing import List, Dict, Any

class HuespedRepository(BaseRepository[Huesped]):
    def __init__(self, db: Session):
        super().__init__(Huesped, db)

    def get_por_hotel(self) -> List[Dict[str, Any]]:
        query = text("SELECT * FROM v_huespedes_por_hotel")
        result = self.db.execute(query)
        return [dict(row._mapping) for row in result]

    def get_gasto_historico(self) -> List[Dict[str, Any]]:
        query = text("SELECT * FROM v_gasto_historica")
        result = self.db.execute(query)
        return [dict(row._mapping) for row in result]

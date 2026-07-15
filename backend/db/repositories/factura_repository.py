# backend/db/repositories/factura_repository.py
from sqlalchemy.orm import Session
from sqlalchemy import text
from db.models import Factura
from db.repositories.base import BaseRepository
from typing import List, Dict, Any, Optional

class FacturaRepository(BaseRepository[Factura]):
    def __init__(self, db: Session):
        super().__init__(Factura, db)

    def get_factura_completa(self, id_factura: int) -> Optional[Dict[str, Any]]:
        query = text("SELECT * FROM v_factura_completa WHERE id_factura = :id")
        result = self.db.execute(query, {"id": id_factura}).fetchone()
        return dict(result._mapping) if result else None

    def get_ingresos_mensuales(self) -> List[Dict[str, Any]]:
        query = text("SELECT * FROM v_ingresos_mes")
        result = self.db.execute(query)
        return [dict(row._mapping) for row in result]

    def get_ocupacion_mensual(self) -> List[Dict[str, Any]]:
        query = text("SELECT * FROM v_tasa_ocupacion_mensual")
        result = self.db.execute(query)
        return [dict(row._mapping) for row in result]

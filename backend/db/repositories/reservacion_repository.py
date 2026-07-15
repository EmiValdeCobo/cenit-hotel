# backend/db/repositories/reservacion_repository.py
from sqlalchemy.orm import Session
from sqlalchemy import text
from db.models import Reservacion, DetalleReservacion
from db.repositories.base import BaseRepository
from typing import List, Dict, Any

class ReservacionRepository(BaseRepository[Reservacion]):
    def __init__(self, db: Session):
        super().__init__(Reservacion, db)

    def crear_reservacion_con_detalles(self, reservacion: Reservacion, detalles: List[DetalleReservacion]) -> Reservacion:
        self.db.add(reservacion)
        self.db.flush()
        
        for detalle in detalles:
            detalle.id_reservacion = reservacion.id_reservacion
            self.db.add(detalle)
            
        self.db.commit()
        self.db.refresh(reservacion)
        return reservacion

    def get_dias_restantes(self) -> List[Dict[str, Any]]:
        query = text("SELECT * FROM v_dias_restantes_reservacion")
        result = self.db.execute(query)
        return [dict(row._mapping) for row in result]

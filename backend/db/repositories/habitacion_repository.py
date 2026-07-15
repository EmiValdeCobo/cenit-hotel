# backend/db/repositories/habitacion_repository.py
from sqlalchemy.orm import Session
from sqlalchemy import text
from db.models import Habitacion
from db.repositories.base import BaseRepository
from typing import List, Dict, Any
from datetime import date

class HabitacionRepository(BaseRepository[Habitacion]):
    def __init__(self, db: Session):
        super().__init__(Habitacion, db)

    def buscar_disponibles(self, fecha_entrada: date, fecha_salida: date, id_tipo_habitacion: int) -> List[Dict[str, Any]]:
        query = text("SELECT * FROM fn_buscar_habitaciones_disponibles(:entrada, :salida, :tipo)")
        result = self.db.execute(query, {
            "entrada": fecha_entrada,
            "salida": fecha_salida,
            "tipo": id_tipo_habitacion
        })
        return [
            {
                "id_habitacion": row.id_habitacion_libre,
                "hotel": row.nombre_hotel_pertenece,
                "numero_habitacion": row.numero_habitacion_libre,
                "tipo_habitacion": row.tipo_habitacion_libre,
                "precio": row.precio_habitacion,
                "nivel": 0,  # Valores por defecto para mapear con esquema de respuesta
                "estado": "DISPONIBLE",
                "capacidad_maxima": 0
            }
            for row in result
        ]

    def get_disponibles_vista(self) -> List[Dict[str, Any]]:
        query = text("SELECT * FROM v_habitaciones_disponibles")
        result = self.db.execute(query)
        return [dict(row._mapping) for row in result]

    def get_totales_por_tipo(self) -> List[Dict[str, Any]]:
        query = text("SELECT * FROM v_total_habitaciones_por_tipo")
        result = self.db.execute(query)
        return [dict(row._mapping) for row in result]

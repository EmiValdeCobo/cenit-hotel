# backend/services/habitacion_service.py
from sqlalchemy.orm import Session
from db.repositories.habitacion_repository import HabitacionRepository
from datetime import date

class HabitacionService:
    def __init__(self, db: Session):
        self.repo = HabitacionRepository(db)

    def buscar_disponibles(self, fecha_entrada: date, fecha_salida: date, id_tipo_habitacion: int):
        return self.repo.buscar_disponibles(fecha_entrada, fecha_salida, id_tipo_habitacion)

    def listar_disponibles(self):
        return self.repo.get_disponibles_vista()

    def obtener_totales_por_tipo(self):
        return self.repo.get_totales_por_tipo()

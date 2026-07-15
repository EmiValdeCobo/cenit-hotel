# backend/routers/habitaciones.py
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from db.database import get_db
from services.habitacion_service import HabitacionService
from schemas.schemas import HabitacionDisponibleResponse, TotalHabitacionesTipoResponse
from typing import List
from datetime import date

router = APIRouter(prefix="/habitaciones", tags=["Habitaciones"])

@router.get("/disponibles-busqueda", response_model=List[HabitacionDisponibleResponse])
def buscar_habitaciones(
    fecha_entrada: date = Query(...),
    fecha_salida: date = Query(...),
    id_tipo_habitacion: int = Query(...),
    db: Session = Depends(get_db)
):
    service = HabitacionService(db)
    return service.buscar_disponibles(fecha_entrada, fecha_salida, id_tipo_habitacion)

@router.get("/disponibles", response_model=List[HabitacionDisponibleResponse])
def listar_disponibles(db: Session = Depends(get_db)):
    service = HabitacionService(db)
    return service.listar_disponibles()

@router.get("/totales-por-tipo", response_model=List[TotalHabitacionesTipoResponse])
def get_totales_por_tipo(db: Session = Depends(get_db)):
    service = HabitacionService(db)
    return service.obtener_totales_por_tipo()

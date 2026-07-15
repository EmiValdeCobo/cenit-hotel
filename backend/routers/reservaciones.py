# backend/routers/reservaciones.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from services.reservacion_service import ReservacionService
from schemas.schemas import ReservacionCreate, ReservacionResponse, DiasRestantesReservacionResponse
from typing import List

router = APIRouter(prefix="/reservaciones", tags=["Reservaciones"])

@router.post("", response_model=ReservacionResponse)
def crear_reservacion(reservacion: ReservacionCreate, db: Session = Depends(get_db)):
    service = ReservacionService(db)
    return service.crear_reservacion(reservacion)

@router.get("", response_model=List[ReservacionResponse])
def listar_reservaciones(db: Session = Depends(get_db)):
    service = ReservacionService(db)
    return service.listar_reservaciones()

@router.get("/dias-restantes", response_model=List[DiasRestantesReservacionResponse])
def get_dias_restantes(db: Session = Depends(get_db)):
    service = ReservacionService(db)
    return service.dias_restantes()

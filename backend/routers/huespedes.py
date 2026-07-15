# backend/routers/huespedes.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from services.huesped_service import HuespedService
from schemas.schemas import HuespedCreate, HuespedResponse, HuespedesPorHotelResponse, GastoHistoricoHuespedResponse
from typing import List

router = APIRouter(prefix="/huespedes", tags=["Huéspedes"])

@router.post("", response_model=HuespedResponse)
def crear_huesped(huesped: HuespedCreate, db: Session = Depends(get_db)):
    service = HuespedService(db)
    return service.crear_huesped(huesped)

@router.get("", response_model=List[HuespedResponse])
def listar_huespedes(db: Session = Depends(get_db)):
    service = HuespedService(db)
    return service.listar_huespedes()

@router.get("/por-hotel", response_model=List[HuespedesPorHotelResponse])
def huespedes_por_hotel(db: Session = Depends(get_db)):
    service = HuespedService(db)
    return service.huespedes_por_hotel()

@router.get("/gastos", response_model=List[GastoHistoricoHuespedResponse])
def gasto_historico(db: Session = Depends(get_db)):
    service = HuespedService(db)
    return service.gasto_historico()

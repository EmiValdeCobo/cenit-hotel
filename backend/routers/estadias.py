# backend/routers/estadias.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from services.estadia_service import EstadiaService
from schemas.schemas import EstadiaCreate, EstadiaResponse, EstadiaCheckout, FacturaCompletaResponse, ConsumoServicioCreate, ConsumoServicioResponse, ConsumoEstadiaResponse, EstadiaActivaResponse
from typing import List

router = APIRouter(prefix="/estadias", tags=["Estadías"])

# Rutas estáticas primero (antes de las dinámicas con {id_estadia})
@router.get("/activas", response_model=List[EstadiaActivaResponse])
def obtener_estadias_activas(db: Session = Depends(get_db)):
    service = EstadiaService(db)
    return service.obtener_estadias_activas()

@router.post("/checkin", response_model=EstadiaResponse)
def registrar_checkin(estadia: EstadiaCreate, db: Session = Depends(get_db)):
    service = EstadiaService(db)
    return service.registrar_checkin(estadia)

# Rutas dinámicas después
@router.post("/{id_estadia}/checkout", response_model=FacturaCompletaResponse)
def registrar_checkout(id_estadia: int, checkout_data: EstadiaCheckout, db: Session = Depends(get_db)):
    service = EstadiaService(db)
    return service.registrar_checkout(id_estadia, checkout_data)

@router.post("/{id_estadia}/consumo", response_model=ConsumoServicioResponse)
def registrar_consumo(id_estadia: int, consumo: ConsumoServicioCreate, db: Session = Depends(get_db)):
    service = EstadiaService(db)
    return service.registrar_consumo(id_estadia, consumo)

@router.get("/{id_estadia}/consumo-reporte", response_model=ConsumoEstadiaResponse)
def obtener_reporte_consumo(id_estadia: int, db: Session = Depends(get_db)):
    service = EstadiaService(db)
    return service.obtener_reporte_consumo(id_estadia)

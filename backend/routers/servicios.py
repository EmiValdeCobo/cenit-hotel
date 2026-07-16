# backend/routers/servicios.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from services.servicio_service import ServicioService
from schemas.schemas import ServiciosMasConsumidosResponse, ServicioResponse
from typing import List

router = APIRouter(prefix="/servicios", tags=["Servicios"])

@router.get("/mas-consumidos", response_model=List[ServiciosMasConsumidosResponse])
def get_mas_consumidos(db: Session = Depends(get_db)):
    service = ServicioService(db)
    return service.obtener_mas_consumidos()

@router.get("", response_model=List[ServicioResponse])
def listar_servicios(db: Session = Depends(get_db)):
    service = ServicioService(db)
    return service.listar_servicios()

# backend/routers/configuraciones.py
# Router del módulo "Extras": cobros extra por temporada y descuentos por estancia.
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from db.database import get_db
from services.extras_service import ExtrasService
from schemas.schemas import (
    AumentoCostoResponse,
    AumentoCostoCreate,
    AumentoCostoUpdate,
    DescuentoResponse,
    DescuentoCreate,
    DescuentoUpdate,
)

router = APIRouter(prefix="/configuraciones", tags=["Configuraciones"])


# ---------- Cobros extra por temporada ----------
@router.get("/temporadas", response_model=List[AumentoCostoResponse])
def listar_temporadas(db: Session = Depends(get_db)):
    return ExtrasService(db).listar_temporadas()


@router.post("/temporadas", response_model=AumentoCostoResponse)
def crear_temporada(data: AumentoCostoCreate, db: Session = Depends(get_db)):
    return ExtrasService(db).crear_temporada(data)


@router.put("/temporadas/{id_aumento_costo}", response_model=AumentoCostoResponse)
def actualizar_temporada(id_aumento_costo: int, data: AumentoCostoUpdate, db: Session = Depends(get_db)):
    return ExtrasService(db).actualizar_temporada(id_aumento_costo, data)


@router.delete("/temporadas/{id_aumento_costo}")
def eliminar_temporada(id_aumento_costo: int, db: Session = Depends(get_db)):
    return ExtrasService(db).eliminar_temporada(id_aumento_costo)


@router.post("/temporadas/{id_aumento_costo}/toggle", response_model=AumentoCostoResponse)
def toggle_temporada(id_aumento_costo: int, db: Session = Depends(get_db)):
    return ExtrasService(db).toggle_temporada(id_aumento_costo)


# ---------- Descuentos por estancia ----------
@router.get("/descuentos", response_model=List[DescuentoResponse])
def listar_descuentos(db: Session = Depends(get_db)):
    return ExtrasService(db).listar_descuentos()


@router.post("/descuentos", response_model=DescuentoResponse)
def crear_descuento(data: DescuentoCreate, db: Session = Depends(get_db)):
    return ExtrasService(db).crear_descuento(data)


@router.put("/descuentos/{id_descuento}", response_model=DescuentoResponse)
def actualizar_descuento(id_descuento: int, data: DescuentoUpdate, db: Session = Depends(get_db)):
    return ExtrasService(db).actualizar_descuento(id_descuento, data)


@router.delete("/descuentos/{id_descuento}")
def eliminar_descuento(id_descuento: int, db: Session = Depends(get_db)):
    return ExtrasService(db).eliminar_descuento(id_descuento)


@router.post("/descuentos/{id_descuento}/toggle", response_model=DescuentoResponse)
def toggle_descuento(id_descuento: int, db: Session = Depends(get_db)):
    return ExtrasService(db).toggle_descuento(id_descuento)

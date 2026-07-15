# backend/routers/configuraciones.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from schemas.schemas import AumentoCostoResponse, DescuentoResponse
from typing import List
from db.models import AumentoCostos, Descuento

router = APIRouter(prefix="/configuraciones", tags=["Configuraciones"])

@router.get("/temporadas", response_model=List[AumentoCostoResponse])
def listar_temporadas(db: Session = Depends(get_db)):
    return db.query(AumentoCostos).all()

@router.post("/temporadas/{id_aumento_costo}/toggle")
def toggle_temporada(id_aumento_costo: int, db: Session = Depends(get_db)):
    ac = db.query(AumentoCostos).filter(AumentoCostos.id_aumento_costo == id_aumento_costo).first()
    if ac:
        ac.activado = not ac.activado
        db.commit()
        return {"success": True, "activado": ac.activado}
    return {"error": "No encontrado"}

@router.get("/descuentos", response_model=List[DescuentoResponse])
def listar_descuentos(db: Session = Depends(get_db)):
    return db.query(Descuento).all()

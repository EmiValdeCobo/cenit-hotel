# backend/routers/reportes.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from services.factura_service import FacturaService
from schemas.schemas import FacturaCompletaResponse, IngresosMesResponse, TasaOcupacionResponse, FacturaSimplificadaResponse
from typing import List
from sqlalchemy import text

router = APIRouter(prefix="/reportes", tags=["Reportes"])

@router.get("/ingresos-mensuales", response_model=List[IngresosMesResponse])
def get_ingresos_mensuales(db: Session = Depends(get_db)):
    service = FacturaService(db)
    return service.obtener_ingresos_mensuales()

@router.get("/ocupacion-mensual", response_model=List[TasaOcupacionResponse])
def get_ocupacion_mensual(db: Session = Depends(get_db)):
    service = FacturaService(db)
    return service.obtener_tasa_ocupacion_mensual()

@router.get("/factura/{id_factura}", response_model=FacturaCompletaResponse)
def get_factura_completa(id_factura: int, db: Session = Depends(get_db)):
    service = FacturaService(db)
    return service.obtener_factura_completa(id_factura)

@router.get("/facturas", response_model=List[FacturaSimplificadaResponse])
def listar_facturas(db: Session = Depends(get_db)):
    query = text("""
        SELECT f.id_factura, h.nombre as nombre_huesped, e.nombre as nombre_empleado, f.fecha, f.metodo_pago, f.total_a_pagar
        FROM factura f
        JOIN huesped h ON f.id_huesped = h.id_huesped
        JOIN empleado e ON f.id_empleado = e.id_empleado
        ORDER BY f.fecha DESC
    """)
    result = db.execute(query)
    return [dict(row._mapping) for row in result]

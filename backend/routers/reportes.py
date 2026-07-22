# backend/routers/reportes.py
"""
Controlador HTTP para el Módulo de Reportes y Facturación.
Completamente refactorizado para mantener únicamente la responsabilidad de ruteo HTTP (SRP),
delegando las consultas y el renderizado visual al ReportesService y RendererFactory.
"""
from fastapi import APIRouter, Depends
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from typing import List

from db.database import get_db
from services.reportes_service import ReportesService
from schemas.schemas import (
    FacturaCompletaResponse, 
    IngresosMesResponse, 
    TasaOcupacionResponse, 
    FacturaSimplificadaResponse
)

router = APIRouter(prefix="/reportes", tags=["Reportes"])

def get_reportes_service(db: Session = Depends(get_db)) -> ReportesService:
    """Proveedor de dependencia para instanciar el servicio de reportes."""
    return ReportesService(db)

@router.get("/ingresos-mensuales", response_model=List[IngresosMesResponse])
def get_ingresos_mensuales(service: ReportesService = Depends(get_reportes_service)):
    return service.obtener_ingresos_mensuales()

@router.get("/ocupacion-mensual", response_model=List[TasaOcupacionResponse])
def get_ocupacion_mensual(service: ReportesService = Depends(get_reportes_service)):
    return service.obtener_tasa_ocupacion_mensual()

@router.get("/factura/{id_factura}", response_model=FacturaCompletaResponse)
def get_factura_completa(id_factura: int, service: ReportesService = Depends(get_reportes_service)):
    return service.obtener_factura_completa(id_factura)

@router.get("/facturas", response_model=List[FacturaSimplificadaResponse])
def listar_facturas(service: ReportesService = Depends(get_reportes_service)):
    return service.listar_facturas()

@router.get("/factura/{id_factura}/html", response_class=HTMLResponse)
def get_factura_completa_html(id_factura: int, service: ReportesService = Depends(get_reportes_service)):
    """Delega la generación del documento HTML al subsistema de renderizado modularizado."""
    return service.generar_factura_documento(id_factura, formato="html")

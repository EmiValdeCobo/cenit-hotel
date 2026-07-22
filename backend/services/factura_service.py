# backend/services/factura_service.py
"""
Servicio de Facturación (Capa de Aplicación).
Maneja las reglas de aplicación relativas a la facturación e informes financieros.
"""
from sqlalchemy.orm import Session
from db.repositories.factura_repository import FacturaRepository
from errors.exceptions import EntityNotFoundException

class FacturaService:
    """Servicio de aplicación para coordinar operaciones de facturas y reportes financieros."""

    def __init__(self, db: Session):
        self.repo = FacturaRepository(db)

    def obtener_factura_completa(self, id_factura: int):
        factura = self.repo.get_factura_completa(id_factura)
        if not factura:
            raise EntityNotFoundException("Factura", id_factura)
        return factura

    def listar_facturas(self):
        return self.repo.listar_facturas_resumen()

    def obtener_ingresos_mensuales(self):
        return self.repo.get_ingresos_mensuales()

    def obtener_tasa_ocupacion_mensual(self):
        return self.repo.get_ocupacion_mensual()

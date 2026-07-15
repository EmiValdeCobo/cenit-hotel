# backend/services/factura_service.py
from sqlalchemy.orm import Session
from db.repositories.factura_repository import FacturaRepository
from errors.exceptions import EntityNotFoundException

class FacturaService:
    def __init__(self, db: Session):
        self.repo = FacturaRepository(db)

    def obtener_factura_completa(self, id_factura: int):
        factura = self.repo.get_factura_completa(id_factura)
        if not factura:
            raise EntityNotFoundException("Factura", id_factura)
        return factura

    def obtener_ingresos_mensuales(self):
        return self.repo.get_ingresos_mensuales()

    def obtener_tasa_ocupacion_mensual(self):
        return self.repo.get_ocupacion_mensual()

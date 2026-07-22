# backend/db/repositories/factura_repository.py
"""
Repositorio para la entidad Factura (Patrón Repository).
Encapsula todas las operaciones de acceso a datos y vistas SQL de facturación.
"""
from sqlalchemy.orm import Session
from sqlalchemy import text
from db.models import Factura
from db.repositories.base import BaseRepository
from typing import List, Dict, Any, Optional

class FacturaRepository(BaseRepository[Factura]):
    """Repositorio especializado en consultas complejas y reportes de facturación."""

    def __init__(self, db: Session):
        super().__init__(Factura, db)

    def get_factura_completa(self, id_factura: int) -> Optional[Dict[str, Any]]:
        """Consulta la vista SQL v_factura_completa para obtener el desglose total de una factura."""
        query = text("SELECT * FROM v_factura_completa WHERE id_factura = :id")
        result = self.db.execute(query, {"id": id_factura}).fetchone()
        return dict(result._mapping) if result else None

    def listar_facturas_resumen(self) -> List[Dict[str, Any]]:
        """Obtiene la lista resumida de todas las facturas emitidas."""
        query = text("""
            SELECT f.id_factura, h.nombre as nombre_huesped, e.nombre as nombre_empleado, f.fecha, f.metodo_pago, f.total_a_pagar
            FROM factura f
            JOIN huesped h ON f.id_huesped = h.id_huesped
            JOIN empleado e ON f.id_empleado = e.id_empleado
            ORDER BY f.fecha DESC
        """)
        result = self.db.execute(query)
        return [dict(row._mapping) for row in result]

    def get_ingresos_mensuales(self) -> List[Dict[str, Any]]:
        """Consulta la vista SQL v_ingresos_mes."""
        query = text("SELECT * FROM v_ingresos_mes")
        result = self.db.execute(query)
        return [dict(row._mapping) for row in result]

    def get_ocupacion_mensual(self) -> List[Dict[str, Any]]:
        """Consulta la vista SQL v_tasa_ocupacion_mensual."""
        query = text("SELECT * FROM v_tasa_ocupacion_mensual")
        result = self.db.execute(query)
        return [dict(row._mapping) for row in result]

# backend/services/reportes_service.py
"""
Servicio de Coordinación de Reportes (Capa de Aplicación).
Utiliza el servicio de facturas y la fábrica de renderizadores (Factory Pattern) 
para desacoplar los formatos de exportación (HTML, PDF, etc.) de las rutas HTTP.
"""
from sqlalchemy.orm import Session
from services.factura_service import FacturaService
from services.renderers.renderer_factory import RendererFactory

class ReportesService:
    """Coordinador para la generación y renderizado de reportes."""

    def __init__(self, db: Session):
        self.factura_service = FacturaService(db)

    def generar_factura_documento(self, id_factura: int, formato: str = "html") -> str:
        """
        Obtiene los datos de la factura completa y delega la renderización al formato
        especificado usando la RendererFactory.
        """
        factura_data = self.factura_service.obtener_factura_completa(id_factura)
        renderer = RendererFactory.get_renderer(formato)
        return renderer.render(factura_data)

    def obtener_ingresos_mensuales(self):
        return self.factura_service.obtener_ingresos_mensuales()

    def obtener_tasa_ocupacion_mensual(self):
        return self.factura_service.obtener_tasa_ocupacion_mensual()

    def obtener_factura_completa(self, id_factura: int):
        return self.factura_service.obtener_factura_completa(id_factura)

    def listar_facturas(self):
        return self.factura_service.listar_facturas()

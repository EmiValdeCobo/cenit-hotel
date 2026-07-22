# backend/services/renderers/base_renderer.py
"""
Interfaz Abstracta para Renderizadores de Factura (Patrón Strategy / Template Method).
Define el contrato común para generar representaciones visuales o exportables de una factura.
"""
from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseInvoiceRenderer(ABC):
    """Interfaz base para renderizar datos de factura en distintos formatos (HTML, PDF, JSON, etc.)."""

    @abstractmethod
    def render(self, factura: Dict[str, Any]) -> Any:
        """
        Recibe un diccionario con el detalle completo de la factura y retorna el documento generado.
        """
        pass

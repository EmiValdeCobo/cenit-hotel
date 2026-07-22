# backend/services/renderers/renderer_factory.py
"""
Fábrica de Renderizadores de Facturas (Patrón Factory Method).
Instancia el renderizador adecuado según el formato solicitado ("html", "json", "pdf").
"""
from typing import Dict, Type
from services.renderers.base_renderer import BaseInvoiceRenderer
from services.renderers.html_invoice_renderer import HTMLInvoiceRenderer

class RendererFactory:
    """Factory para instanciar estrategias de renderizado de documentos/facturas."""

    _renderers: Dict[str, Type[BaseInvoiceRenderer]] = {
        "html": HTMLInvoiceRenderer,
    }

    @classmethod
    def register_renderer(cls, format_name: str, renderer_cls: Type[BaseInvoiceRenderer]) -> None:
        """Permite registrar dinámicamente nuevos renderizadores (Principio Open/Closed)."""
        cls._renderers[format_name.lower()] = renderer_cls

    @classmethod
    def get_renderer(cls, format_name: str = "html") -> BaseInvoiceRenderer:
        """Retorna la instancia del renderizador solicitado."""
        key = format_name.lower()
        renderer_cls = cls._renderers.get(key)
        if not renderer_cls:
            raise ValueError(f"Formato de renderizado no soportado: '{format_name}'. Opciones válidas: {list(cls._renderers.keys())}")
        return renderer_cls()

# backend/domain/strategies/base.py
"""
Interfaz Abstracta para Estrategias de Tarificación (Patrón Strategy).
Permite evaluar y aplicar recargos o descuentos sobre un ítem de factura o subtotal.
"""
from abc import ABC, abstractmethod
from typing import Dict, Any

class PricingStrategy(ABC):
    """Contrato base para algoritmos de cálculo de recargos y descuentos."""

    @abstractmethod
    def calculate(self, base_price: float, context: Dict[str, Any]) -> float:
        """
        Calcula el monto del ajuste (recargo o descuento) dado un precio base y un contexto de negocio.
        """
        pass

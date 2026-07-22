# backend/domain/strategies/discount_strategy.py
"""
Estrategias de Descuento (Patrón Strategy).
Permite aplicar deducciones porcentuales o fijas por estadías prolongadas, fidelidad o promociones.
"""
from typing import Dict, Any
from domain.strategies.base import PricingStrategy

class PercentageDiscountStrategy(PricingStrategy):
    """Estrategia para calcular un descuento basándose en un porcentaje."""

    def __init__(self, porcentaje_descuento: float):
        self.porcentaje_descuento = porcentaje_descuento

    def calculate(self, base_price: float, context: Dict[str, Any]) -> float:
        if not context.get("activado", True):
            return 0.0
        return base_price * (self.porcentaje_descuento / 100.0)

class FixedDiscountStrategy(PricingStrategy):
    """Estrategia para aplicar un monto fijo de descuento."""

    def __init__(self, monto_descuento: float):
        self.monto_descuento = monto_descuento

    def calculate(self, base_price: float, context: Dict[str, Any]) -> float:
        if not context.get("activado", True):
            return 0.0
        return min(self.monto_descuento, base_price)

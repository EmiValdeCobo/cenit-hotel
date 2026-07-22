# backend/domain/strategies/surcharge_strategy.py
"""
Estrategia de Recargo de Temporada Alta (Patrón Strategy).
Aplica incrementos porcentuales o fijos configurados para periodos especiales.
"""
from typing import Dict, Any
from domain.strategies.base import PricingStrategy

class HighSeasonSurchargeStrategy(PricingStrategy):
    """Estrategia para calcular aumentos por temporada alta o día festivo."""

    def __init__(self, porcentaje_aumento: float = 0.0, monto_fijo: float = 0.0):
        self.porcentaje_aumento = porcentaje_aumento
        self.monto_fijo = monto_fijo

    def calculate(self, base_price: float, context: Dict[str, Any]) -> float:
        if not context.get("activado", True):
            return 0.0
        incremento_porcentaje = base_price * (self.porcentaje_aumento / 100.0)
        return incremento_porcentaje + self.monto_fijo

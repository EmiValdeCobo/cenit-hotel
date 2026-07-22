# backend/domain/strategies/__init__.py
from domain.strategies.base import PricingStrategy
from domain.strategies.surcharge_strategy import HighSeasonSurchargeStrategy
from domain.strategies.discount_strategy import PercentageDiscountStrategy, FixedDiscountStrategy

__all__ = [
    "PricingStrategy",
    "HighSeasonSurchargeStrategy",
    "PercentageDiscountStrategy",
    "FixedDiscountStrategy",
]

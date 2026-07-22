# backend/core/events/events.py
"""
Eventos de Dominio para el Sistema Cenit Hotel (Patrón Observer).
Define los objetos de evento emitidos cuando ocurren acciones importantes en el sistema.
"""
from dataclasses import dataclass
from typing import Dict, Any, Optional

@dataclass
class DomainEvent:
    """Clase base abstracta para todos los eventos de dominio."""
    pass

@dataclass
class CheckInCompletedEvent(DomainEvent):
    """Evento emitido al completar exitosamente el Check-in de una reservación."""
    id_estadia: int
    id_reservacion: int

@dataclass
class CheckOutCompletedEvent(DomainEvent):
    """Evento emitido al finalizar el Check-out de una estadía."""
    id_estadia: int
    id_factura: int
    total_pagado: float
    metodo_pago: str

@dataclass
class ConsumoRegistradoEvent(DomainEvent):
    """Evento emitido al registrar un consumo de servicio dentro de una estadía."""
    id_estadia: int
    id_servicio: int
    id_habitacion: Optional[int] = None

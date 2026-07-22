# backend/core/events/dispatcher.py
"""
Despachador de Eventos de Dominio (Patrón Observer).
Permite registrar suscriptores (listeners/observers) y emitir eventos de forma desacoplada.
"""
from typing import Dict, List, Type, Callable, Any
from core.events.events import DomainEvent
import logging

logger = logging.getLogger("CenitEvents")

class EventDispatcher:
    """
    Sujeto/Dispatcher de eventos que mantiene el registro de observadores 
    y despacha eventos a las funciones manejadoras asociadas.
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EventDispatcher, cls).__new__(cls)
            cls._instance._listeners = {}
        return cls._instance

    def subscribe(self, event_type: Type[DomainEvent], handler: Callable[[DomainEvent], None]) -> None:
        """Registra un observador para un tipo de evento específico."""
        if event_type not in self._listeners:
            self._listeners[event_type] = []
        self._listeners[event_type].append(handler)
        logger.info(f"[Observer] Handler '{handler.__name__}' suscrito a '{event_type.__name__}'")

    def publish(self, event: DomainEvent) -> None:
        """Notifica a todos los observadores registrados para el tipo de evento dado."""
        event_type = type(event)
        handlers = self._listeners.get(event_type, [])
        logger.info(f"[Observer] Despachando evento '{event_type.__name__}' a {len(handlers)} observadores.")
        for handler in handlers:
            try:
                handler(event)
            except Exception as e:
                logger.error(f"[Observer Error] Fallo en el manejador '{handler.__name__}': {str(e)}")

# Instancia global (Singleton) para fácil acceso
event_dispatcher = EventDispatcher()

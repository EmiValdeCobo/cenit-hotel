# backend/core/events/__init__.py
from core.events.events import DomainEvent, CheckInCompletedEvent, CheckOutCompletedEvent, ConsumoRegistradoEvent
from core.events.dispatcher import EventDispatcher, event_dispatcher

__all__ = [
    "DomainEvent",
    "CheckInCompletedEvent",
    "CheckOutCompletedEvent",
    "ConsumoRegistradoEvent",
    "EventDispatcher",
    "event_dispatcher",
]

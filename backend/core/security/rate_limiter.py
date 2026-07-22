# backend/core/security/rate_limiter.py
"""
Limitador de Tasa de Peticiones por IP (Rate Limiter - Algoritmo Sliding Window).
Previene ataques de denegación de servicio (DDoS) y fuerza bruta.
"""
import time
from typing import Dict, List, Tuple
from threading import Lock

class InMemoryRateLimiter:
    """Limitador de frecuencia en memoria basado en IP del cliente."""

    def __init__(self, requests_limit: int = 120, window_seconds: int = 60):
        self.requests_limit = requests_limit
        self.window_seconds = window_seconds
        self._history: Dict[str, List[float]] = {}
        self._lock = Lock()

    def is_allowed(self, client_ip: str) -> Tuple[bool, int]:
        """
        Evalúa si la IP solicitante ha superado el límite configurado.
        Retorna (permitido: bool, tiempo_restante_reintento_segundos: int).
        """
        now = time.time()
        cutoff = now - self.window_seconds

        with self._lock:
            # Obtener el historial de la IP y purgar marcas de tiempo expiradas
            timestamps = self._history.get(client_ip, [])
            valid_timestamps = [t for t in timestamps if t > cutoff]

            if len(valid_timestamps) >= self.requests_limit:
                # Calcular tiempo que debe esperar para el siguiente intento
                oldest_timestamp = valid_timestamps[0]
                retry_after = int(oldest_timestamp + self.window_seconds - now)
                return False, max(1, retry_after)

            valid_timestamps.append(now)
            self._history[client_ip] = valid_timestamps
            return True, 0

# Instancia global del Rate Limiter (120 peticiones por minuto por IP)
global_rate_limiter = InMemoryRateLimiter(requests_limit=120, window_seconds=60)

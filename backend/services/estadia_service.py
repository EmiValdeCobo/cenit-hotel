# backend/services/estadia_service.py
"""
Servicio de Gestión de Estadías (Capa de Aplicación).
Coordina los procesos de check-in, check-out, consumos y emisión de eventos de dominio (Observer Pattern).
"""
from sqlalchemy.orm import Session
from db.repositories.estadia_repository import EstadiaRepository
from db.repositories.reservacion_repository import ReservacionRepository
from db.repositories.factura_repository import FacturaRepository
from db.models import Estadia, ConsumoServicio
from errors.exceptions import EntityNotFoundException, BusinessException
from schemas.schemas import EstadiaCreate, EstadiaCheckout, ConsumoServicioCreate
from sqlalchemy.exc import DBAPIError

from core.events.dispatcher import event_dispatcher
from core.events.events import CheckInCompletedEvent, CheckOutCompletedEvent, ConsumoRegistradoEvent

class EstadiaService:
    def __init__(self, db: Session):
        self.repo = EstadiaRepository(db)
        self.reservacion_repo = ReservacionRepository(db)
        self.factura_repo = FacturaRepository(db)

    def registrar_checkin(self, estadia_in: EstadiaCreate):
        res = self.reservacion_repo.get(estadia_in.id_reservacion)
        if not res:
            raise EntityNotFoundException("Reservacion", estadia_in.id_reservacion)
        if res.estado != "CONFIRMADA" and res.estado != "PENDIENTE":
            raise BusinessException(f"Reservación con estado {res.estado} no admite check-in.")

        estadia = Estadia(id_reservacion=estadia_in.id_reservacion)
        res.estado = "CONFIRMADA"
        self.reservacion_repo.update(res)
        nueva_estadia = self.repo.create(estadia)

        # Publicar evento de dominio (Patrón Observer)
        event_dispatcher.publish(CheckInCompletedEvent(
            id_estadia=nueva_estadia.id_estadia,
            id_reservacion=nueva_estadia.id_reservacion
        ))

        return nueva_estadia

    def registrar_checkout(self, id_estadia: int, checkout_in: EstadiaCheckout):
        estadia = self.repo.get(id_estadia)
        if not estadia:
            raise EntityNotFoundException("Estadia", id_estadia)
        if estadia.checkout is not None:
            raise BusinessException(f"La estadía {id_estadia} ya completó el checkout.")

        res = self.reservacion_repo.get(estadia.id_reservacion)
        if res:
            res.estado = "COMPLETADA"
            self.reservacion_repo.update(res)

        try:
            self.repo.ejecutar_checkout_factura(id_estadia, checkout_in.id_empleado, checkout_in.metodo_pago)
            
            factura = self.factura_repo.db.query(self.factura_repo.model).filter_by(id_estadia=id_estadia).first()
            if not factura:
                raise BusinessException("No se pudo obtener la factura del checkout.")
                
            factura_completa = self.factura_repo.get_factura_completa(factura.id_factura)

            # Publicar evento de dominio (Patrón Observer)
            event_dispatcher.publish(CheckOutCompletedEvent(
                id_estadia=id_estadia,
                id_factura=factura.id_factura,
                total_pagado=float(factura.total_a_pagar or 0.0),
                metodo_pago=checkout_in.metodo_pago
            ))

            return factura_completa
        except DBAPIError as e:
            raise BusinessException(str(e.orig))

    def registrar_consumo(self, id_estadia: int, consumo_in: ConsumoServicioCreate):
        estadia = self.repo.get(id_estadia)
        if not estadia:
            raise EntityNotFoundException("Estadia", id_estadia)
        if estadia.checkout is not None:
            raise BusinessException("Estadía ya completada. No se admiten consumos.")

        consumo = ConsumoServicio(
            id_estadia=id_estadia,
            id_servicio=consumo_in.id_servicio,
            id_habitacion=consumo_in.id_habitacion
        )
        try:
            resultado = self.repo.registrar_consumo(consumo)

            # Publicar evento de dominio (Patrón Observer)
            event_dispatcher.publish(ConsumoRegistradoEvent(
                id_estadia=id_estadia,
                id_servicio=consumo_in.id_servicio,
                id_habitacion=consumo_in.id_habitacion
            ))

            return resultado
        except DBAPIError as e:
            raise BusinessException(str(e.orig))

    def obtener_reporte_consumo(self, id_estadia: int):
        reporte = self.repo.get_consumo_reporte(id_estadia)
        if not reporte:
            raise EntityNotFoundException("Estadia (Consumo)", id_estadia)
        return reporte

    def obtener_estadias_activas(self):
        from sqlalchemy import text
        query = text("""
            SELECT 
                e.id_estadia, 
                e.id_reservacion, 
                e.checkin, 
                hu.nombre AS nombre_huesped, 
                ha.numero_habitacion, 
                th.tipo_habitacion,
                ha.id_habitacion
            FROM estadia e
            JOIN reservacion r ON e.id_reservacion = r.id_reservacion
            JOIN huesped hu ON r.id_huesped = hu.id_huesped
            JOIN detalle_reservacion dr ON r.id_reservacion = dr.id_reservacion
            JOIN habitacion ha ON dr.id_habitacion = ha.id_habitacion
            JOIN tipo_habitacion th ON ha.id_tipo_habitacion = th.id_tipo_habitacion
            WHERE e.checkout IS NULL;
        """)
        result = self.repo.db.execute(query)
        return [dict(row._mapping) for row in result]

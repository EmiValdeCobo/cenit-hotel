# backend/services/reservacion_service.py
from sqlalchemy.orm import Session
from db.repositories.reservacion_repository import ReservacionRepository
from db.repositories.habitacion_repository import HabitacionRepository
from db.repositories.huesped_repository import HuespedRepository
from db.repositories.empleado_repository import EmpleadoRepository
from db.models import Reservacion, DetalleReservacion
from errors.exceptions import EntityNotFoundException, BusinessException
from schemas.schemas import ReservacionCreate
from sqlalchemy.exc import DBAPIError

class ReservacionService:
    def __init__(self, db: Session):
        self.repo = ReservacionRepository(db)
        self.habitacion_repo = HabitacionRepository(db)
        self.huesped_repo = HuespedRepository(db)
        self.empleado_repo = EmpleadoRepository(db)

    def crear_reservacion(self, reservacion_in: ReservacionCreate):
        if not self.huesped_repo.get(reservacion_in.id_huesped):
            raise EntityNotFoundException("Huesped", reservacion_in.id_huesped)
        if not self.empleado_repo.get(reservacion_in.id_empleado):
            raise EntityNotFoundException("Empleado", reservacion_in.id_empleado)

        reservacion = Reservacion(
            id_empleado=reservacion_in.id_empleado,
            id_huesped=reservacion_in.id_huesped,
            cant_huespedes_totales=reservacion_in.cant_huespedes_totales,
            estado="PENDIENTE"
        )

        detalles = []
        for det_in in reservacion_in.detalles:
            hab = self.habitacion_repo.get(det_in.id_habitacion)
            if not hab:
                raise EntityNotFoundException("Habitacion", det_in.id_habitacion)
            if hab.estado != "DISPONIBLE":
                raise BusinessException(f"La habitación {hab.numero_habitacion} no está disponible.")
            if det_in.cant_huespedes > hab.capacidad_maxima:
                raise BusinessException(f"Los huéspedes ({det_in.cant_huespedes}) superan la capacidad máxima ({hab.capacidad_maxima}).")

            detalle = DetalleReservacion(
                id_habitacion=det_in.id_habitacion,
                cant_huespedes=det_in.cant_huespedes,
                fecha_entrada=det_in.fecha_entrada,
                fecha_salida=det_in.fecha_salida
            )
            detalles.append(detalle)

        try:
            return self.repo.crear_reservacion_con_detalles(reservacion, detalles)
        except DBAPIError as e:
            raise BusinessException(str(e.orig))

    def listar_reservaciones(self):
        return self.repo.get_all()

    def obtener_reservacion(self, id_reservacion: int):
        res = self.repo.get(id_reservacion)
        if not res:
            raise EntityNotFoundException("Reservacion", id_reservacion)
        return res

    def dias_restantes(self):
        return self.repo.get_dias_restantes()

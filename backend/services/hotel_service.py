# backend/services/hotel_service.py
from sqlalchemy.orm import Session
from db.repositories.hotel_repository import HotelRepository
from sqlalchemy.exc import IntegrityError
from errors.exceptions import EntityNotFoundException, BusinessException

class HotelService:
    def __init__(self, db: Session):
        self.repo = HotelRepository(db)

    def listar_hoteles(self):
        return self.repo.get_all()

    def obtener_hotel(self, id_hotel: int):
        hotel = self.repo.get(id_hotel)
        if not hotel:
            raise EntityNotFoundException("Hotel", id_hotel)
        return hotel

    def obtener_datos_generales(self):
        return self.repo.get_datos_generales()

    def obtener_info_general(self):
        return self.repo.get_info_general()

    def obtener_detalle_habitaciones_y_comodidades(self):
        return self.repo.get_detalle_habitaciones_y_comodidades()

    def crear_hotel(self, hotel_in):
        from db.models import Hotel
        hotel = Hotel(**hotel_in.model_dump())
        try:
            return self.repo.create(hotel)
        except IntegrityError:
            self.repo.db.rollback()
            raise BusinessException("Error: El nombre del hotel ya podría estar registrado.")

    def actualizar_hotel(self, id_hotel: int, hotel_in):
        hotel = self.obtener_hotel(id_hotel)
        update_data = hotel_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(hotel, key, value)
        try:
            return self.repo.update(hotel)
        except IntegrityError:
            self.repo.db.rollback()
            raise BusinessException("Error de integridad al actualizar el hotel.")

    def eliminar_hotel(self, id_hotel: int):
        self.obtener_hotel(id_hotel)
        try:
            self.repo.delete(id_hotel)
            return {"success": True, "message": "Hotel eliminado correctamente"}
        except IntegrityError:
            self.repo.db.rollback()
            raise BusinessException("No se puede eliminar el hotel porque tiene registros dependientes (habitaciones).")

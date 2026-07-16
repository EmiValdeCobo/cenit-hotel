# backend/services/huesped_service.py
from sqlalchemy.orm import Session
from db.repositories.huesped_repository import HuespedRepository
from sqlalchemy.exc import IntegrityError
from db.models import Huesped
from errors.exceptions import EntityNotFoundException, BusinessException
from schemas.schemas import HuespedCreate

class HuespedService:
    def __init__(self, db: Session):
        self.repo = HuespedRepository(db)

    def crear_huesped(self, huesped_in: HuespedCreate):
        all_huespedes = self.repo.get_all(limit=1000)
        for h in all_huespedes:
            if h.correo == huesped_in.correo:
                raise BusinessException(f"El correo {huesped_in.correo} ya está registrado.")
            if h.documento == huesped_in.documento:
                raise BusinessException(f"El documento {huesped_in.documento} ya está registrado.")
                
        huesped = Huesped(**huesped_in.model_dump())
        return self.repo.create(huesped)

    def obtener_huesped(self, id_huesped: int):
        huesped = self.repo.get(id_huesped)
        if not huesped:
            raise EntityNotFoundException("Huesped", id_huesped)
        return huesped

    def listar_huespedes(self):
        return self.repo.get_all()

    def huespedes_por_hotel(self):
        return self.repo.get_por_hotel()

    def gasto_historico(self):
        return self.repo.get_gasto_historico()

    def eliminar_huesped(self, id_huesped: int):
        self.obtener_huesped(id_huesped)
        try:
            self.repo.delete(id_huesped)
            return {"success": True, "message": "Huésped eliminado correctamente"}
        except IntegrityError:
            self.repo.db.rollback()
            raise BusinessException("No se puede eliminar el huésped porque tiene reservaciones o estadías asociadas.")

    def actualizar_huesped(self, id_huesped: int, huesped_in):
        from schemas.schemas import HuespedUpdate
        huesped = self.obtener_huesped(id_huesped)
        update_data = huesped_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(huesped, key, value)
        try:
            return self.repo.update(huesped)
        except IntegrityError:
            self.repo.db.rollback()
            raise BusinessException("El correo o documento ya está registrado en otro huésped.")

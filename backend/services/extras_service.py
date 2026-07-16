# backend/services/extras_service.py
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from db.repositories.base import BaseRepository
from db.models import AumentoCostos, Descuento
from errors.exceptions import EntityNotFoundException, BusinessException


class ExtrasService:
    """
    Servicio encargado de la gestión del módulo 'Extras':
    cobros extra por temporada (AumentoCostos) y descuentos por estancia (Descuento).
    Provee un CRUD completo más la posibilidad de activar/desactivar cada registro
    individualmente sin necesidad de eliminarlo.
    """

    def __init__(self, db: Session):
        self.db = db
        self.temporadas_repo = BaseRepository(AumentoCostos, db)
        self.descuentos_repo = BaseRepository(Descuento, db)

    # ---------- Temporadas / Aumentos de costo ----------
    def listar_temporadas(self):
        return self.temporadas_repo.get_all(limit=1000)

    def obtener_temporada(self, id_aumento_costo: int):
        temporada = self.temporadas_repo.get(id_aumento_costo)
        if not temporada:
            raise EntityNotFoundException("Cobro extra por temporada", id_aumento_costo)
        return temporada

    def crear_temporada(self, data):
        temporada = AumentoCostos(**data.model_dump())
        try:
            return self.temporadas_repo.create(temporada)
        except IntegrityError:
            self.db.rollback()
            raise BusinessException("Ya existe un cobro extra registrado con ese nombre de temporada.")

    def actualizar_temporada(self, id_aumento_costo: int, data):
        temporada = self.obtener_temporada(id_aumento_costo)
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(temporada, key, value)
        try:
            return self.temporadas_repo.update(temporada)
        except IntegrityError:
            self.db.rollback()
            raise BusinessException("Error de integridad al actualizar el cobro extra.")

    def eliminar_temporada(self, id_aumento_costo: int):
        self.obtener_temporada(id_aumento_costo)
        try:
            self.temporadas_repo.delete(id_aumento_costo)
            return {"success": True, "message": "Cobro extra eliminado correctamente."}
        except IntegrityError:
            self.db.rollback()
            raise BusinessException("No se puede eliminar: este cobro extra está referenciado en facturas existentes.")

    def toggle_temporada(self, id_aumento_costo: int):
        temporada = self.obtener_temporada(id_aumento_costo)
        temporada.activado = not temporada.activado
        return self.temporadas_repo.update(temporada)

    # ---------- Descuentos ----------
    def listar_descuentos(self):
        return self.descuentos_repo.get_all(limit=1000)

    def obtener_descuento(self, id_descuento: int):
        descuento = self.descuentos_repo.get(id_descuento)
        if not descuento:
            raise EntityNotFoundException("Descuento", id_descuento)
        return descuento

    def crear_descuento(self, data):
        descuento = Descuento(**data.model_dump())
        try:
            return self.descuentos_repo.create(descuento)
        except IntegrityError:
            self.db.rollback()
            raise BusinessException("Error al crear el descuento.")

    def actualizar_descuento(self, id_descuento: int, data):
        descuento = self.obtener_descuento(id_descuento)
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(descuento, key, value)
        try:
            return self.descuentos_repo.update(descuento)
        except IntegrityError:
            self.db.rollback()
            raise BusinessException("Error de integridad al actualizar el descuento.")

    def eliminar_descuento(self, id_descuento: int):
        self.obtener_descuento(id_descuento)
        try:
            self.descuentos_repo.delete(id_descuento)
            return {"success": True, "message": "Descuento eliminado correctamente."}
        except IntegrityError:
            self.db.rollback()
            raise BusinessException("No se puede eliminar: este descuento está referenciado en facturas existentes.")

    def toggle_descuento(self, id_descuento: int):
        descuento = self.obtener_descuento(id_descuento)
        descuento.activado = not descuento.activado
        return self.descuentos_repo.update(descuento)

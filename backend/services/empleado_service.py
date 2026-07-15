# backend/services/empleado_service.py
from sqlalchemy.orm import Session
from db.repositories.empleado_repository import EmpleadoRepository

class EmpleadoService:
    def __init__(self, db: Session):
        self.repo = EmpleadoRepository(db)

    def listar_empleados(self):
        return self.repo.get_empleados_vista()

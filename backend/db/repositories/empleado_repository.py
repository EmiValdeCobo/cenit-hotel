# backend/db/repositories/empleado_repository.py
from sqlalchemy.orm import Session
from sqlalchemy import text
from db.models import Empleado
from db.repositories.base import BaseRepository
from typing import List, Dict, Any

class EmpleadoRepository(BaseRepository[Empleado]):
    def __init__(self, db: Session):
        super().__init__(Empleado, db)

    def get_empleados_vista(self) -> List[Dict[str, Any]]:
        query = text("SELECT * FROM vista_empleados")
        result = self.db.execute(query)
        return [dict(row._mapping) for row in result]

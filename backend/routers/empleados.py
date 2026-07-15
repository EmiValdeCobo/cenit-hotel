# backend/routers/empleados.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from services.empleado_service import EmpleadoService
from schemas.schemas import EmpleadoResponse
from typing import List

router = APIRouter(prefix="/empleados", tags=["Empleados"])

@router.get("", response_model=List[EmpleadoResponse])
def listar_empleados(db: Session = Depends(get_db)):
    service = EmpleadoService(db)
    return service.listar_empleados()

from schemas.schemas import EmpleadoCreate

@router.post("", response_model=EmpleadoResponse)
def crear_empleado(empleado: EmpleadoCreate, db: Session = Depends(get_db)):
    from db.models import Empleado
    db_empleado = Empleado(
        id_tipo_empleado=empleado.id_tipo_empleado,
        nombre=empleado.nombre,
        correo=empleado.correo,
        telefono=empleado.telefono,
        dui=empleado.dui,
        salario=empleado.salario
    )
    db.add(db_empleado)
    db.commit()
    db.refresh(db_empleado)
    
    from sqlalchemy import text
    query = text("""
        SELECT e.nombre as empleado, e.dui as documento_de_identidad, e.telefono, e.correo as email, te.tipo_empleado as rol_de_trabajo, e.salario
        FROM empleado e
        JOIN tipo_empleado te ON e.id_tipo_empleado = te.id_tipo_empleado
        WHERE e.id_empleado = :id
    """)
    res = db.execute(query, {"id": db_empleado.id_empleado}).fetchone()
    return dict(res._mapping)

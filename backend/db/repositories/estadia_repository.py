# backend/db/repositories/estadia_repository.py
from sqlalchemy.orm import Session
from sqlalchemy import text
from db.models import Estadia, ConsumoServicio
from db.repositories.base import BaseRepository
from typing import List, Dict, Any, Optional
from datetime import datetime

class EstadiaRepository(BaseRepository[Estadia]):
    def __init__(self, db: Session):
        super().__init__(Estadia, db)

    def get_consumo_reporte(self, id_estadia: int) -> Optional[Dict[str, Any]]:
        query = text("SELECT * FROM v_consumo_estadia WHERE id_estadia = :id")
        result = self.db.execute(query, {"id": id_estadia}).fetchone()
        return dict(result._mapping) if result else None

    def registrar_consumo(self, consumo: ConsumoServicio) -> ConsumoServicio:
        self.db.add(consumo)
        self.db.commit()
        self.db.refresh(consumo)
        return consumo
        
    def ejecutar_checkout_factura(self, id_estadia: int, id_empleado: int, metodo_pago: str) -> None:
        estadia = self.get(id_estadia)
        if estadia:
            estadia.checkout = datetime.now()
            self.db.commit()
            
            # Procedemos a llamar a sp_calcular_total_factura
            query = text("CALL sp_calcular_total_factura(:id_estadia, :id_empleado, :metodo_pago)")
            self.db.execute(query, {
                "id_estadia": id_estadia,
                "id_empleado": id_empleado,
                "metodo_pago": metodo_pago
            })
            self.db.commit()
v = 1 # version variable

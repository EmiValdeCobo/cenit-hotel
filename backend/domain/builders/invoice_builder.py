# backend/domain/builders/invoice_builder.py
"""
Constructor de Facturas (Patrón Builder).
Facilita la construcción paso a paso de facturas complejas con desglose de ítems, recargos y descuentos.
"""
from typing import Dict, List, Any, Optional
from datetime import datetime

class InvoiceBuilder:
    """Builder para ensamblar la estructura de datos de una factura completa."""

    def __init__(self):
        self.reset()

    def reset(self):
        self._factura = {
            "id_factura": None,
            "fecha": datetime.now(),
            "metodo_pago": "EFECTIVO",
            "total_a_pagar": 0.0,
            "id_estadia": None,
            "id_huesped": None,
            "nombre_huesped": "",
            "correo_huesped": "",
            "id_empleado": None,
            "nombre_empleado": "",
            "detalle_factura": []
        }
        return self

    def set_encabezado(
        self, 
        id_factura: int, 
        fecha: Any, 
        metodo_pago: str, 
        id_estadia: int, 
        id_huesped: int, 
        nombre_huesped: str, 
        correo_huesped: str,
        id_empleado: int,
        nombre_empleado: str
    ):
        self._factura["id_factura"] = id_factura
        self._factura["fecha"] = fecha
        self._factura["metodo_pago"] = metodo_pago
        self._factura["id_estadia"] = id_estadia
        self._factura["id_huesped"] = id_huesped
        self._factura["nombre_huesped"] = nombre_huesped
        self._factura["correo_huesped"] = correo_huesped
        self._factura["id_empleado"] = id_empleado
        self._factura["nombre_empleado"] = nombre_empleado
        return self

    def add_linea_detalle(
        self, 
        concepto: str, 
        cantidad: int, 
        precio_unitario: float, 
        monto_descuento: float = 0.0, 
        monto_aumento: float = 0.0
    ):
        subtotal = cantidad * precio_unitario
        precio_total = subtotal + monto_aumento - monto_descuento
        
        item = {
            "concepto": concepto,
            "cantidad": cantidad,
            "precio_unitario": precio_unitario,
            "subtotal": subtotal,
            "monto_descuento": monto_descuento,
            "monto_aumento": monto_aumento,
            "precio_total": max(0.0, precio_total)
        }
        self._factura["detalle_factura"].append(item)
        return self

    def build(self) -> Dict[str, Any]:
        """Calcula los totales acumulados y retorna la factura terminada."""
        total = sum(item["precio_total"] for item in self._factura["detalle_factura"])
        self._factura["total_a_pagar"] = total
        result = self._factura
        self.reset()
        return result

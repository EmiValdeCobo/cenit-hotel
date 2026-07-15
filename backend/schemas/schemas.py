# backend/schemas/schemas.py
from pydantic import BaseModel, Field, field_validator, model_validator
from typing import List, Optional
from datetime import date, datetime
from decimal import Decimal

# Huesped Schemas
class HuespedBase(BaseModel):
    nombre: str = Field(..., min_length=3, max_length=255, description="Nombre completo del huésped")
    correo: str = Field(..., pattern=r"^[^@]+@[^@]+\.[^@]+$", description="Correo electrónico único")
    telefono: str = Field(..., pattern=r"^\+?[0-9\s\-]{7,20}$", description="Número de teléfono")
    documento: str = Field(..., min_length=5, max_length=50, description="Documento de identidad único")
    tipo_documento: str = Field(..., pattern="^(DUI|PASAPORTE|CONSTANCIA DE RESIDENCIA)$", description="Tipo de documento")

class HuespedCreate(HuespedBase):
    pass

class HuespedResponse(HuespedBase):
    id_huesped: int

    class Config:
        from_attributes = True

# Detalle Reservacion Schemas
class DetalleReservacionBase(BaseModel):
    id_habitacion: int
    cant_huespedes: int = Field(..., gt=0, description="Huéspedes en esta habitación")
    fecha_entrada: date
    fecha_salida: date

    @model_validator(mode="after")
    def validate_dates(self) -> "DetalleReservacionBase":
        if self.fecha_entrada >= self.fecha_salida:
            raise ValueError("La fecha de entrada debe ser anterior a la fecha de salida.")
        return self

class DetalleReservacionCreate(DetalleReservacionBase):
    pass

class DetalleReservacionResponse(DetalleReservacionBase):
    id_detalle_reservacion: int
    id_reservacion: int

    class Config:
        from_attributes = True

# Reservacion Schemas
class ReservacionCreate(BaseModel):
    id_empleado: int
    id_huesped: int
    cant_huespedes_totales: int = Field(..., gt=0)
    detalles: List[DetalleReservacionCreate]

class ReservacionResponse(BaseModel):
    id_reservacion: int
    id_empleado: int
    id_huesped: int
    cant_huespedes_totales: int
    estado: str

    class Config:
        from_attributes = True

# Consumo Servicio Schemas
class ConsumoServicioCreate(BaseModel):
    id_servicio: int
    id_habitacion: int

class ConsumoServicioResponse(BaseModel):
    id_consumo_servicio: int
    id_servicio: int
    id_habitacion: int
    id_estadia: int
    hora_consumo: datetime

    class Config:
        from_attributes = True

# Estadia Schemas
class EstadiaCreate(BaseModel):
    id_reservacion: int

class EstadiaCheckout(BaseModel):
    id_empleado: int
    metodo_pago: str = Field("EFECTIVO", pattern="^(EFECTIVO|TRANSFERENCIA|TARJETA|BITCOIN|PAYPAL)$")

class EstadiaResponse(BaseModel):
    id_estadia: int
    id_reservacion: int
    checkin: datetime
    checkout: Optional[datetime] = None

    class Config:
        from_attributes = True

# Resenia Schemas
class ReseniaCreate(BaseModel):
    id_huesped: int
    calificacion: Decimal = Field(..., ge=1.0, le=5.0)
    comentario: Optional[str] = None

class ReseniaResponse(BaseModel):
    id_resenia: int
    id_estadia: int
    id_huesped: int
    calificacion: Decimal
    comentario: Optional[str]

    class Config:
        from_attributes = True

# Vista Schemas (para reportes y agregaciones)
class TasaOcupacionResponse(BaseModel):
    mes: str
    tipo_habitacion: str
    total_dias_ocupados: int
    total_dias_disponibles: int
    porcentaje_ocupacion: str

class HuespedesPorHotelResponse(BaseModel):
    id_huesped: int
    huesped: str
    correo: str
    documento: str
    tipo_documento: str
    nombre_hotel: str
    veces_hospedado: int

class DatosGeneralesHotelResponse(BaseModel):
    id_hotel: int
    nombre_hotel: str
    calificacion: Optional[Decimal] = None
    direccion: Optional[str] = None
    niveles_edificios: int
    descripcion: Optional[str] = None
    habitaciones_totales: int
    habitaciones_disponibles: int
    habitaciones_ocupadas: int
    habitaciones_mantenimiento: int
    ganancia_promedio_anual: Decimal
    ganancia_promedio_mensual: Decimal

class NyMResponse(BaseModel):
    pass # No usado

class IngresosMesResponse(BaseModel):
    anio: int
    num_mes: int
    mes: str
    ingresos: Decimal

class InfoGeneralHotelResponse(BaseModel):
    hotel: str
    calificacion: Optional[Decimal] = None
    cant_habitaciones: int
    ganancias: Optional[Decimal] = None

class HabitacionDisponibleResponse(BaseModel):
    id_habitacion: int
    hotel: str
    direccion: Optional[str] = None
    nivel: int
    numero_habitacion: int
    tipo_habitacion: str
    precio: Decimal
    estado: str
    capacidad_maxima: int

class GastoHistoricoHuespedResponse(BaseModel):
    id_huesped: int
    huesped: str
    correo: str
    documento: str
    tipo_documento: str
    gasto_total: Optional[Decimal] = None
    cantidad_facturas: int

class ServiciosMasConsumidosResponse(BaseModel):
    id_tipo_habitacion: int
    tipo_habitacion: str
    id_servicio: int
    tipo_servicio: str
    total_consumos: int

class DiasRestantesReservacionResponse(BaseModel):
    id_reservacion: int
    nombre_huesped: str
    documento_huesped: str
    telefono_huesped: str
    nombre_empleado: str
    cant_huespedes_totales: int
    estado_reservacion: str
    fecha_entrada_proxima: date
    fecha_salida_proxima: date
    dias_para_iniciar: int

class DetalleHabitacionComodidadesResponse(BaseModel):
    id_habitacion: int
    numero_habitacion: int
    precio: Decimal
    estado: str
    capacidad_maxima: int
    tipo_habitacion: str
    total_habitaciones_este_tipo: int
    comodidades: Optional[str] = None
    total_comodidades: int

class TotalHabitacionesTipoResponse(BaseModel):
    tipo_habitacion: str
    total_habitaciones: int

class ConsumoEstadiaResponse(BaseModel):
    id_estadia: int
    nombre: str
    documento: str
    reporte_json: dict

class EmpleadoResponse(BaseModel):
    empleado: str
    documento_de_identidad: str
    telefono: Optional[str] = None
    email: str
    rol_de_trabajo: str
    salario: Decimal

class FacturaCompletaResponse(BaseModel):
    id_factura: int
    fecha: datetime
    metodo_pago: str
    total_a_pagar: Decimal
    id_estadia: int
    nombre_empleado: str
    nombre_huesped: str
    correo_huesped: str
    id_huesped: int
    detalle_factura: list

class ServicioResponse(BaseModel):
    id_servicio: int
    tipo_servicio: str
    precio: Decimal

    class Config:
        from_attributes = True

class EstadiaActivaResponse(BaseModel):
    id_estadia: int
    id_reservacion: int
    checkin: datetime
    nombre_huesped: str
    numero_habitacion: int
    tipo_habitacion: str
    id_habitacion: int

    class Config:
        from_attributes = True

class EmpleadoCreate(BaseModel):
    id_tipo_empleado: int
    nombre: str
    correo: str
    telefono: Optional[str] = None
    dui: str
    salario: Decimal

class FacturaSimplificadaResponse(BaseModel):
    id_factura: int
    nombre_huesped: str
    nombre_empleado: str
    fecha: datetime
    metodo_pago: str
    total_a_pagar: Decimal

    class Config:
        from_attributes = True

class AumentoCostoResponse(BaseModel):
    id_aumento_costo: int
    porcentaje_aumento: Decimal
    fecha_inicio: date
    fecha_fin: date
    nombre_temporada: Optional[str] = None
    activado: bool

    class Config:
        from_attributes = True

class DescuentoResponse(BaseModel):
    id_descuento: int
    porcentaje_descuento: Decimal
    cant_dia_hospedado: Optional[int] = None

    class Config:
        from_attributes = True
# --- CRUD de Hoteles ---
class HotelBase(BaseModel):
    nombre: str = Field(..., max_length=255)
    direccion: Optional[str] = None
    niveles_edificios: int
    calificacion: Optional[Decimal] = None
    descripcion: Optional[str] = None

class HotelCreate(HotelBase):
    pass

class HotelUpdate(BaseModel):
    nombre: Optional[str] = Field(None, max_length=255)
    direccion: Optional[str] = None
    niveles_edificios: Optional[int] = None
    calificacion: Optional[Decimal] = None
    descripcion: Optional[str] = None

class HotelResponseBase(HotelBase):
    id_hotel: int
    class Config:
        from_attributes = True

# --- CRUD de Huéspedes ---
class HuespedUpdate(BaseModel):
    nombre: Optional[str] = Field(None, min_length=3, max_length=255)
    correo: Optional[str] = Field(None, pattern=r"^[^@]+@[^@]+\.[^@]+$")
    telefono: Optional[str] = Field(None, pattern=r"^\+?[0-9\s\-]{7,20}$")
    documento: Optional[str] = Field(None, min_length=5, max_length=50)
    tipo_documento: Optional[str] = Field(None, pattern="^(DUI|PASAPORTE|CONSTANCIA DE RESIDENCIA)$")

# --- CRUD de Empleados ---
class EmpleadoUpdate(BaseModel):
    id_tipo_empleado: Optional[int] = None
    nombre: Optional[str] = None
    correo: Optional[str] = None
    telefono: Optional[str] = None
    dui: Optional[str] = None
    salario: Optional[Decimal] = None

class EmpleadoResponseBase(BaseModel):
    id_empleado: int
    id_tipo_empleado: int
    nombre: str
    correo: str
    telefono: Optional[str] = None
    dui: str
    salario: Decimal
    class Config:
        from_attributes = True

# --- CRUD de Servicios ---
class ServicioCreate(BaseModel):
    tipo_servicio: str = Field(..., max_length=100)
    precio: Decimal

class ServicioUpdate(BaseModel):
    tipo_servicio: Optional[str] = Field(None, max_length=100)
    precio: Optional[Decimal] = None

# --- CRUD de Reservaciones ---
class ReservacionUpdate(BaseModel):
    estado: str = Field(..., pattern="^(PENDIENTE|CONFIRMADA|CANCELADA|FINALIZADA)$")


from sqlalchemy import Column, Integer, String, Boolean, Numeric, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from db.database import Base
from sqlalchemy.sql import func

class AumentoCostos(Base):
    __tablename__ = 'aumento_costos'
    id_aumento_costo = Column(Integer, primary_key=True, index=True)
    porcentaje_aumento = Column(Numeric(5, 2), nullable=False)
    fecha_inicio = Column(Date, nullable=False)
    fecha_fin = Column(Date, nullable=False)
    nombre_temporada = Column(String(100), unique=True)
    activado = Column(Boolean, default=True)

class TipoHabitacion(Base):
    __tablename__ = 'tipo_habitacion'
    id_tipo_habitacion = Column(Integer, primary_key=True, index=True)
    tipo_habitacion = Column(String(100), nullable=False, unique=True)
    habitaciones = relationship("Habitacion", back_populates="tipo")

class TipoComodidad(Base):
    __tablename__ = 'tipo_comodidad'
    id_tipo_comodidad = Column(Integer, primary_key=True, index=True)
    tipo_comodidad = Column(String(100), nullable=False, unique=True)

class ComodidadTipoHabitacion(Base):
    __tablename__ = 'comodidad_tipo_habitacion'
    id_comodidad_habitacion = Column(Integer, primary_key=True, index=True)
    id_tipo_habitacion = Column(Integer, ForeignKey('tipo_habitacion.id_tipo_habitacion'), nullable=False)
    id_tipo_comodidad = Column(Integer, ForeignKey('tipo_comodidad.id_tipo_comodidad'), nullable=False)
    detalle = Column(Text, nullable=False)

class Hotel(Base):
    __tablename__ = 'hotel'
    id_hotel = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False, unique=True)
    direccion = Column(String(255))
    niveles_edificios = Column(Integer, nullable=False)
    calificacion = Column(Numeric(2, 1))
    descripcion = Column(Text)
    habitaciones = relationship("Habitacion", back_populates="hotel")

class Habitacion(Base):
    __tablename__ = 'habitacion'
    id_habitacion = Column(Integer, primary_key=True, index=True)
    id_hotel = Column(Integer, ForeignKey('hotel.id_hotel'), nullable=False)
    nivel = Column(Integer, nullable=False)
    numero_habitacion = Column(Integer, nullable=False)
    id_tipo_habitacion = Column(Integer, ForeignKey('tipo_habitacion.id_tipo_habitacion'), nullable=False)
    precio = Column(Numeric(10, 2), nullable=False)
    estado = Column(String(50), nullable=False)
    capacidad_maxima = Column(Integer, nullable=False)
    descripcion = Column(Text)

    hotel = relationship("Hotel", back_populates="habitaciones")
    tipo = relationship("TipoHabitacion", back_populates="habitaciones")

class Huesped(Base):
    __tablename__ = 'huesped'
    id_huesped = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False)
    correo = Column(String(255), nullable=False, unique=True)
    telefono = Column(String(20), nullable=False)
    documento = Column(String(50), nullable=False, unique=True)
    tipo_documento = Column(String(50), nullable=False)

class TipoEmpleado(Base):
    __tablename__ = 'tipo_empleado'
    id_tipo_empleado = Column(Integer, primary_key=True, index=True)
    tipo_empleado = Column(String(100), nullable=False, unique=True)

class Empleado(Base):
    __tablename__ = 'empleado'
    id_empleado = Column(Integer, primary_key=True, index=True)
    id_tipo_empleado = Column(Integer, ForeignKey('tipo_empleado.id_tipo_empleado'), nullable=False)
    nombre = Column(String(255), nullable=False)
    correo = Column(String(100), nullable=False, unique=True)
    telefono = Column(String(20))
    dui = Column(String(10), nullable=False, unique=True)
    salario = Column(Numeric(10, 2), nullable=False)

class Reservacion(Base):
    __tablename__ = 'reservacion'
    id_reservacion = Column(Integer, primary_key=True, index=True)
    id_empleado = Column(Integer, ForeignKey('empleado.id_empleado'), nullable=False)
    id_huesped = Column(Integer, ForeignKey('huesped.id_huesped'), nullable=False)
    cant_huespedes_totales = Column(Integer, nullable=False)
    estado = Column(String(50), nullable=False)

class DetalleReservacion(Base):
    __tablename__ = 'detalle_reservacion'
    id_detalle_reservacion = Column(Integer, primary_key=True, index=True)
    id_reservacion = Column(Integer, ForeignKey('reservacion.id_reservacion'), nullable=False)
    id_habitacion = Column(Integer, ForeignKey('habitacion.id_habitacion'), nullable=False)
    cant_huespedes = Column(Integer, nullable=False)
    fecha_entrada = Column(Date, nullable=False)
    fecha_salida = Column(Date, nullable=False)

class Estadia(Base):
    __tablename__ = 'estadia'
    id_estadia = Column(Integer, primary_key=True, index=True)
    id_reservacion = Column(Integer, ForeignKey('reservacion.id_reservacion'), nullable=False)
    checkin = Column(DateTime, nullable=False, server_default=func.now())
    checkout = Column(DateTime)

class Resenia(Base):
    __tablename__ = 'resenia'
    id_resenia = Column(Integer, primary_key=True, index=True)
    id_estadia = Column(Integer, ForeignKey('estadia.id_estadia'), nullable=False)
    id_huesped = Column(Integer, ForeignKey('huesped.id_huesped'), nullable=False)
    calificacion = Column(Numeric(2, 1))
    comentario = Column(Text)

class Servicio(Base):
    __tablename__ = 'servicio'
    id_servicio = Column(Integer, primary_key=True, index=True)
    tipo_servicio = Column(String(100), nullable=False, unique=True)
    precio = Column(Numeric(10, 2), nullable=False)

class ConsumoServicio(Base):
    __tablename__ = 'consumo_servicio'
    id_consumo_servicio = Column(Integer, primary_key=True, index=True)
    id_servicio = Column(Integer, ForeignKey('servicio.id_servicio'), nullable=False)
    id_habitacion = Column(Integer, ForeignKey('habitacion.id_habitacion'), nullable=False)
    id_estadia = Column(Integer, ForeignKey('estadia.id_estadia'), nullable=False)
    hora_consumo = Column(DateTime, nullable=False, server_default=func.now())

class Factura(Base):
    __tablename__ = 'factura'
    id_factura = Column(Integer, primary_key=True, index=True)
    id_empleado = Column(Integer, ForeignKey('empleado.id_empleado'), nullable=False)
    id_huesped = Column(Integer, ForeignKey('huesped.id_huesped'), nullable=False)
    id_estadia = Column(Integer, ForeignKey('estadia.id_estadia'), nullable=False)
    fecha = Column(DateTime, nullable=False, server_default=func.now())
    metodo_pago = Column(String(50), nullable=False)
    total_a_pagar = Column(Numeric(10, 2), nullable=False)

class Descuento(Base):
    __tablename__ = 'descuento'
    id_descuento = Column(Integer, primary_key=True, index=True)
    porcentaje_descuento = Column(Numeric(5, 2), nullable=False)
    cant_dia_hospedado = Column(Integer)

class DetalleFactura(Base):
    __tablename__ = 'detalle_factura'
    id_detalle_factura = Column(Integer, primary_key=True, index=True)
    id_factura = Column(Integer, ForeignKey('factura.id_factura'), nullable=False)
    id_servicio = Column(Integer, ForeignKey('servicio.id_servicio'))
    id_habitacion = Column(Integer, ForeignKey('habitacion.id_habitacion'))
    id_descuento = Column(Integer, ForeignKey('descuento.id_descuento'))
    id_aumento_costo = Column(Integer, ForeignKey('aumento_costos.id_aumento_costo'))
    concepto = Column(String(255), nullable=False)
    precio_unitario = Column(Numeric(10, 2), nullable=False)
    cantidad = Column(Integer, nullable=False)
    subtotal = Column(Numeric(10, 2), nullable=False)
    monto_descuento = Column(Numeric(10, 2), default=0.00)
    monto_aumento = Column(Numeric(10, 2), default=0.00)
    precio_total = Column(Numeric(10, 2), nullable=False)

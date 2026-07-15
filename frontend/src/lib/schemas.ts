import { z } from 'zod';

const NumericCoerce = z.union([z.number(), z.string().transform(Number)]);

export const HuespedResponseSchema = z.object({
  id_huesped: z.number(),
  nombre: z.string(),
  correo: z.string(),
  telefono: z.string(),
  documento: z.string(),
  tipo_documento: z.string(),
});

export type Huesped = z.infer<typeof HuespedResponseSchema>;

export const HabitacionDisponibleResponseSchema = z.object({
  id_habitacion: z.number(),
  hotel: z.string(),
  direccion: z.string().optional().nullable(),
  nivel: z.number(),
  numero_habitacion: z.number(),
  tipo_habitacion: z.string(),
  precio: NumericCoerce,
  estado: z.string(),
  capacidad_maxima: z.number(),
});

export type Habitacion = z.infer<typeof HabitacionDisponibleResponseSchema>;

export const ReservacionResponseSchema = z.object({
  id_reservacion: z.number(),
  id_empleado: z.number(),
  id_huesped: z.number(),
  cant_huespedes_totales: z.number(),
  estado: z.string(),
});

export type Reservacion = z.infer<typeof ReservacionResponseSchema>;

export const DiasRestantesReservacionResponseSchema = z.object({
  id_reservacion: z.number(),
  nombre_huesped: z.string(),
  documento_huesped: z.string(),
  telefono_huesped: z.string(),
  nombre_empleado: z.string(),
  cant_huespedes_totales: z.number(),
  estado_reservacion: z.string(),
  fecha_entrada_proxima: z.string(),
  fecha_salida_proxima: z.string(),
  dias_para_iniciar: z.number(),
});

export type DiasRestantesReservacion = z.infer<typeof DiasRestantesReservacionResponseSchema>;

export const EmpleadoResponseSchema = z.object({
  empleado: z.string(),
  documento_de_identidad: z.string(),
  telefono: z.string().optional().nullable(),
  email: z.string(),
  rol_de_trabajo: z.string(),
  salario: NumericCoerce,
});

export type Empleado = z.infer<typeof EmpleadoResponseSchema>;

export const ServicioResponseSchema = z.object({
  id_servicio: z.number(),
  tipo_servicio: z.string(),
  precio: NumericCoerce,
});

export type Servicio = z.infer<typeof ServicioResponseSchema>;

export const EstadiaActivaResponseSchema = z.object({
  id_estadia: z.number(),
  id_reservacion: z.number(),
  checkin: z.string(),
  nombre_huesped: z.string(),
  numero_habitacion: z.number(),
  tipo_habitacion: z.string(),
  id_habitacion: z.number(),
});

export type EstadiaActiva = z.infer<typeof EstadiaActivaResponseSchema>;

export const FacturaSimplificadaResponseSchema = z.object({
  id_factura: z.number(),
  nombre_huesped: z.string(),
  nombre_empleado: z.string(),
  fecha: z.string(),
  metodo_pago: z.string(),
  total_a_pagar: NumericCoerce,
});

export type FacturaSimplificada = z.infer<typeof FacturaSimplificadaResponseSchema>;

export const DetalleFacturaSchema = z.object({
  id_detalle_factura: z.number(),
  concepto: z.string(),
  precio_unitario: NumericCoerce,
  cantidad: z.number(),
  subtotal: NumericCoerce,
  monto_descuento: NumericCoerce,
  monto_aumento: NumericCoerce,
  precio_total: NumericCoerce,
});

export const FacturaCompletaResponseSchema = z.object({
  id_factura: z.number(),
  fecha: z.string(),
  metodo_pago: z.string(),
  total_a_pagar: NumericCoerce,
  id_estadia: z.number(),
  nombre_empleado: z.string(),
  nombre_huesped: z.string(),
  correo_huesped: z.string(),
  id_huesped: z.number(),
  detalle_factura: z.array(DetalleFacturaSchema),
});

export type FacturaCompleta = z.infer<typeof FacturaCompletaResponseSchema>;

export const AumentoCostoResponseSchema = z.object({
  id_aumento_costo: z.number(),
  porcentaje_aumento: NumericCoerce,
  fecha_inicio: z.string(),
  fecha_fin: z.string(),
  nombre_temporada: z.string().optional().nullable(),
  activado: z.boolean(),
});

export type AumentoCosto = z.infer<typeof AumentoCostoResponseSchema>;

export const DescuentoResponseSchema = z.object({
  id_descuento: z.number(),
  porcentaje_descuento: NumericCoerce,
  cant_dia_hospedado: z.number().optional().nullable(),
});

export type Descuento = z.infer<typeof DescuentoResponseSchema>;

export const DatosGeneralesHotelResponseSchema = z.object({
  id_hotel: z.number(),
  nombre_hotel: z.string(),
  calificacion: z.union([z.number(), z.string().transform(Number)]).optional().nullable(),
  direccion: z.string().optional().nullable(),
  niveles_edificios: z.number(),
  descripcion: z.string().optional().nullable(),
  habitaciones_totales: z.number(),
  habitaciones_disponibles: z.number(),
  habitaciones_ocupadas: z.number(),
  habitaciones_mantenimiento: z.number(),
  ganancia_promedio_anual: NumericCoerce,
  ganancia_promedio_mensual: NumericCoerce,
});

export type DatosGeneralesHotel = z.infer<typeof DatosGeneralesHotelResponseSchema>;

export const ServiciosMasConsumidosResponseSchema = z.object({
  id_tipo_habitacion: z.number(),
  tipo_habitacion: z.string(),
  id_servicio: z.number(),
  tipo_servicio: z.string(),
  total_consumos: z.number(),
});
export type ServiciosMasConsumidos = z.infer<typeof ServiciosMasConsumidosResponseSchema>;

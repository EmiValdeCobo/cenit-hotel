# Documentación de la API de Cenit Hotel

Esta documentación proporciona una descripción exhaustiva de todos los endpoints disponibles en el backend de **Cénit Boutique Hotel**, detallando sus rutas, métodos HTTP, parámetros requeridos, reglas de negocio, respuestas de éxito (200/201 OK) y los posibles códigos de error.

El punto de entrada principal del servidor FastAPI se encuentra en [main.py](./main.py).

---

## Tabla de Contenidos
1. [Información General y Errores](#información-general-y-errores)
2. [Módulo de Hoteles (`/api/hoteles`)](#1-módulo-de-hoteles-apihoteles)
3. [Módulo de Habitaciones (`/api/habitaciones`)](#2-módulo-de-habitaciones-apihabitaciones)
4. [Módulo de Huéspedes (`/api/huespedes`)](#3-módulo-de-huéspedes-apihuespedes)
5. [Módulo de Reservaciones (`/api/reservaciones`)](#4-módulo-de-reservaciones-apireservaciones)
6. [Módulo de Estadías (`/api/estadias`)](#5-módulo-de-estadías-apiestadias)
7. [Módulo de Servicios (`/api/servicios`)](#6-módulo-de-servicios-apiservicios)
8. [Módulo de Empleados (`/api/empleados`)](#7-módulo-de-empleados-apiempleados)
9. [Módulo de Reportes (`/api/reportes`)](#8-módulo-de-reportes-apireportes)
10. [Módulo de Configuraciones e Extras (`/api/configuraciones`)](#9-módulo-de-configuraciones-e-extras-apiconfiguraciones)

---

## Información General y Errores

### URL Base de la API
*   **Desarrollo Local:** `http://localhost:8000/api`
*   **Formatos admitidos:** Todos los envíos y respuestas son en formato **JSON** (con codificación UTF-8 garantizada por middleware), a excepción de la generación física de facturas que devuelve **HTML**.

### Manejo de Excepciones Comunes
La API cuenta con un controlador de excepciones unificado definido en [exceptions.py](./errors/exceptions.py). Los errores se serializan de la siguiente forma:

*   **Error de Regla de Negocio (HTTP 400 Bad Request)**
    Se lanza cuando se violan restricciones del hotel (ej. intentar reservar una habitación ocupada, superar la capacidad máxima, etc.).
    ```json
    {
      "success": false,
      "detail": "La habitación 102 no está disponible."
    }
    ```
*   **Recurso No Encontrado (HTTP 404 Not Found)**
    Se lanza cuando un recurso con un ID específico no existe en la base de datos.
    ```json
    {
      "success": false,
      "detail": "Huesped con ID 99 no fue encontrado."
    }
    ```
*   **Error de Validación Pydantic (HTTP 422 Unprocessable Entity)**
    Se genera automáticamente cuando el formato o tipo de dato en la solicitud no coincide con los esquemas requeridos.

---

## 1. Módulo de Hoteles (`/api/hoteles`)

Implementado en el router [hoteles.py](./routers/hoteles.py) y gestionado por [hotel_service.py](./services/hotel_service.py).

### `GET /api/hoteles/datos-generales`
*   **Descripción:** Retorna una lista con la información operativa y financiera detallada de cada hotel registrado, incluyendo agregaciones en tiempo real (habitaciones disponibles, ocupadas, en mantenimiento, ganancias promedio anuales y mensuales).
*   **Modelo de Respuesta:** `List[`[DatosGeneralesHotelResponse](./schemas/schemas.py#L129)`]`
*   **Estructura del Objeto Devuelto:**
    *   `id_hotel` (int): Identificador único del hotel.
    *   `nombre_hotel` (str): Nombre comercial.
    *   `calificacion` (Decimal/null): Calificación por estrellas (1.00 a 5.00).
    *   `direccion` (str/null): Dirección física.
    *   `niveles_edificios` (int): Cantidad de pisos del hotel.
    *   `descripcion` (str/null): Breve reseña del hotel.
    *   `habitaciones_totales` (int): Total de habitaciones configuradas.
    *   `habitaciones_disponibles` (int): Habitaciones en estado 'DISPONIBLE'.
    *   `habitaciones_ocupadas` (int): Habitaciones en estado 'OCUPADA'.
    *   `habitaciones_mantenimiento` (int): Habitaciones en estado 'MANTENIMIENTO'.
    *   `ganancia_promedio_anual` (Decimal): Ingresos históricos promedio por año.
    *   `ganancia_promedio_mensual` (Decimal): Ingresos históricos promedio por mes.

### `GET /api/hoteles/info-general`
*   **Descripción:** Recupera una vista resumida de los hoteles ideal para listados rápidos en paneles administrativos.
*   **Modelo de Respuesta:** `List[`[InfoGeneralHotelResponse](./schemas/schemas.py#L152)`]`
*   **Estructura del Objeto Devuelto:**
    *   `hotel` (str): Nombre del hotel.
    *   `calificacion` (Decimal/null): Calificación.
    *   `cant_habitaciones` (int): Número total de habitaciones.
    *   `ganancias` (Decimal/null): Ganancias acumuladas brutas.

### `GET /api/hoteles/comodidades`
*   **Descripción:** Proporciona un desglose detallado de las habitaciones de cada hotel, correlacionando su tipo, precio, estado y una cadena consolidada de comodidades asociadas.
*   **Modelo de Respuesta:** `List[`[DetalleHabitacionComodidadesResponse](./schemas/schemas.py#L197)`]`
*   **Estructura del Objeto Devuelto:**
    *   `id_habitacion` (int), `numero_habitacion` (int), `precio` (Decimal), `estado` (str), `capacidad_maxima` (int), `tipo_habitacion` (str).
    *   `total_habitaciones_este_tipo` (int): Total de inventario de este tipo de habitación en el hotel.
    *   `comodidades` (str/null): Lista de comodidades separadas por comas (ej: "Wifi, Mini Bar, A/C").
    *   `total_comodidades` (int): Cantidad numérica de comodidades que tiene.

### `POST /api/hoteles`
*   **Descripción:** Registra un nuevo hotel en la base de datos.
*   **Cuerpo de Solicitud (JSON):** [HotelCreate](./schemas/schemas.py#L328)
    *   `nombre` (str): Obligatorio. Máx 255 caracteres.
    *   `direccion` (str/null): Opcional.
    *   `niveles_edificios` (int): Opcional, por defecto 1.
    *   `calificacion` (Decimal/null): Opcional.
    *   `descripcion` (str/null): Opcional.
*   **Modelo de Respuesta:** [HotelResponseBase](./schemas/schemas.py#L338)
*   **Regla de Negocio:** Si ya existe un hotel con el mismo nombre, se elevará un error `HTTP 400 Bad Request` indicando la duplicación.

### `PUT /api/hoteles/{id_hotel}`
*   **Descripción:** Actualiza de forma parcial los datos de un hotel específico.
*   **Parámetro de Ruta:** `id_hotel` (int)
*   **Cuerpo de Solicitud (JSON):** [HotelUpdate](./schemas/schemas.py#L331) (Todos los campos son opcionales).
*   **Modelo de Respuesta:** [HotelResponseBase](./schemas/schemas.py#L338)

### `DELETE /api/hoteles/{id_hotel}`
*   **Descripción:** Elimina físicamente un hotel del sistema.
*   **Parámetro de Ruta:** `id_hotel` (int)
*   **Regla de Negocio:** No se puede eliminar un hotel que tenga habitaciones configuradas. Si se intenta, se retornará un `HTTP 400 Bad Request`.
*   **Respuesta Exitosa:**
    ```json
    {
      "success": true,
      "message": "Hotel eliminado correctamente"
    }
    ```

---

## 2. Módulo de Habitaciones (`/api/habitaciones`)

Implementado en el router [habitaciones.py](./routers/habitaciones.py) y gestionado por [habitacion_service.py](./services/habitacion_service.py).

### `GET /api/habitaciones/disponibles-busqueda`
*   **Descripción:** Filtra y lista habitaciones actualmente libres que cumplen con un tipo específico y un rango de fechas. Utiliza una consulta compleja para verificar que la habitación no tenga reservaciones activas solapadas.
*   **Parámetros Query:**
    *   `fecha_entrada` (date, formato YYYY-MM-DD): Obligatorio.
    *   `fecha_salida` (date, formato YYYY-MM-DD): Obligatorio.
    *   `id_tipo_habitacion` (int): Identificador del tipo (ej: Simple, Doble, Suite).
*   **Modelo de Respuesta:** `List[`[HabitacionDisponibleResponse](./schemas/schemas.py#L158)`]`

### `GET /api/habitaciones/disponibles`
*   **Descripción:** Retorna de manera global todas las habitaciones del hotel cuyo estado actual en la base de datos es exactamente `'DISPONIBLE'`.
*   **Modelo de Respuesta:** `List[`[HabitacionDisponibleResponse](./schemas/schemas.py#L158)`]`

### `GET /api/habitaciones/totales-por-tipo`
*   **Descripción:** Proporciona estadísticas rápidas sobre la cantidad de habitaciones existentes por cada tipo (ej: cuántas hay de tipo "Suite Presidencial").
*   **Modelo de Respuesta:** `List[`[TotalHabitacionesTipoResponse](./schemas/schemas.py#L208)`]`
*   **Estructura del Objeto Devuelto:**
    *   `tipo_habitacion` (str): Nombre o categoría del tipo.
    *   `total_habitaciones` (int): Conteo físico en el hotel.

---

## 3. Módulo de Huéspedes (`/api/huespedes`)

Implementado en el router [huespedes.py](./routers/huespedes.py) y gestionado por [huesped_service.py](./services/huesped_service.py).

### `POST /api/huespedes`
*   **Descripción:** Crea un nuevo perfil de huésped.
*   **Cuerpo de Solicitud (JSON):** [HuespedCreate](./schemas/schemas.py#L15)
    *   `nombre` (str): Mínimo 3 caracteres, máximo 255.
    *   `correo` (str): Debe coincidir con expresión regular de email válido (`^[^@]+@[^@]+\.[^@]+$`).
    *   `telefono` (str): Debe cumplir el patrón de formato telefónico nacional/internacional (`^\+?[0-9\s\-]{7,20}$`).
    *   `documento` (str): Documento identificativo único (DUI o pasaporte). Mínimo 5 caracteres.
    *   `tipo_documento` (str): Debe ser estrictamente `'DUI'`, `'PASAPORTE'` o `'CONSTANCIA DE RESIDENCIA'`.
*   **Modelo de Respuesta:** [HuespedResponse](./schemas/schemas.py#L18)
*   **Reglas de Negocio:** No se admiten correos electrónicos ni números de documento duplicados. Si ya existen en el sistema, arrojará un error `HTTP 400 Bad Request`.

### `GET /api/huespedes`
*   **Descripción:** Lista todos los huéspedes registrados.
*   **Modelo de Respuesta:** `List[`[HuespedResponse](./schemas/schemas.py#L18)`]`

### `GET /api/huespedes/por-hotel`
*   **Descripción:** Devuelve un reporte agrupado por la cantidad de veces que cada huésped se ha alojado en los diferentes hoteles del sistema.
*   **Modelo de Respuesta:** `List[`[HuespedesPorHotelResponse](./schemas/schemas.py#L120)`]`

### `GET /api/huespedes/gastos`
*   **Descripción:** Calcula el gasto histórico acumulado y el número total de facturas emitidas por cada huésped.
*   **Modelo de Respuesta:** `List[`[GastoHistoricoHuespedResponse](./schemas/schemas.py#L169)`]`

### `PUT /api/huespedes/{id_huesped}`
*   **Descripción:** Modifica los datos personales de un huésped.
*   **Parámetro de Ruta:** `id_huesped` (int)
*   **Cuerpo de Solicitud (JSON):** [HuespedUpdate](./schemas/schemas.py#L344) (Campos opcionales con las mismas restricciones de validación que `HuespedCreate`).
*   **Modelo de Respuesta:** [HuespedResponse](./schemas/schemas.py#L18)

### `DELETE /api/huespedes/{id_huesped}`
*   **Descripción:** Remueve la información de un huésped.
*   **Regla de Negocio:** Si el huésped cuenta con reservaciones o estadías pasadas/futuras registradas en el sistema, no podrá ser eliminado por integridad referencial (`HTTP 400 Bad Request`).
*   **Respuesta Exitosa:**
    ```json
    {
      "success": true,
      "message": "Huésped eliminado correctamente"
    }
    ```

---

## 4. Módulo de Reservaciones (`/api/reservaciones`)

Implementado en el router [reservaciones.py](./routers/reservaciones.py) y gestionado por [reservacion_service.py](./services/reservacion_service.py).

### `POST /api/reservaciones`
*   **Descripción:** Registra una reservación, asociándole una o múltiples habitaciones en un rango de fechas determinado.
*   **Cuerpo de Solicitud (JSON):** [ReservacionCreate](./schemas/schemas.py#L48)
    *   `id_empleado` (int): ID del recepcionista o empleado que procesa la reserva.
    *   `id_huesped` (int): ID del huésped titular.
    *   `cant_huespedes_totales` (int): Total acumulado de ocupantes.
    *   `detalles` (List[[DetalleReservacionCreate](./schemas/schemas.py#L37)]):
        *   `id_habitacion` (int): Habitación a reservar.
        *   `cant_huespedes` (int): Cantidad de huéspedes en esta habitación.
        *   `fecha_entrada` (date, formato YYYY-MM-DD).
        *   `fecha_salida` (date, formato YYYY-MM-DD).
*   **Modelo de Respuesta:** [ReservacionResponse](./schemas/schemas.py#L54)
*   **Reglas de Negocio Validadas:**
    1. La fecha de entrada debe ser estrictamente anterior a la fecha de salida.
    2. La habitación solicitada debe estar en estado `'DISPONIBLE'`.
    3. La cantidad de huéspedes asignados a una habitación no debe exceder su `capacidad_maxima`.
    4. El empleado y huésped deben existir previamente en el sistema.
    5. Las transacciones se realizan de forma atómica: si una habitación falla en la reserva múltiple, todo el proceso se cancela.
*   **Estado Inicial:** Se crea por defecto en estado `'PENDIENTE'`.

### `GET /api/reservaciones`
*   **Descripción:** Lista todas las reservas del sistema con su estado actual (PENDIENTE, CONFIRMADA, CANCELADA, RECHAZADA, COMPLETADA).
*   **Modelo de Respuesta:** `List[`[ReservacionResponse](./schemas/schemas.py#L54)`]`

### `GET /api/reservaciones/dias-restantes`
*   **Descripción:** Retorna una cuenta regresiva de los días restantes para que den inicio las reservaciones que se encuentran en estado de espera activa.
*   **Modelo de Respuesta:** `List[`[DiasRestantesReservacionResponse](./schemas/schemas.py#L185)`]`
*   **Estructura del Objeto Devuelto:**
    *   `id_reservacion` (int), `nombre_huesped` (str), `documento_huesped` (str), `telefono_huesped` (str), `nombre_empleado` (str), `cant_huespedes_totales` (int), `estado_reservacion` (str).
    *   `fecha_entrada_proxima` (date), `fecha_salida_proxima` (date).
    *   `dias_para_iniciar` (int): Número de días calculados desde la fecha actual hasta el check-in planeado.

---

## 5. Módulo de Estadías (`/api/estadias`)

Implementado en el router [estadias.py](./routers/estadias.py) y gestionado por [estadia_service.py](./services/estadia_service.py).

### `GET /api/estadias/activas`
*   **Descripción:** Muestra los huéspedes que actualmente están físicamente alojados en el hotel (es decir, aquellos con check-in registrado pero que aún no han hecho checkout).
*   **Modelo de Respuesta:** `List[`[EstadiaActivaResponse](./schemas/schemas.py#L246)`]`

### `POST /api/estadias/checkin`
*   **Descripción:** Registra el ingreso físico de un cliente al hotel a partir de una reservación previa.
*   **Cuerpo de Solicitud (JSON):** [EstadiaCreate](./schemas/schemas.py#L80)
    *   `id_reservacion` (int): Identificador de la reservación de base.
*   **Modelo de Respuesta:** [EstadiaResponse](./schemas/schemas.py#L87)
*   **Reglas de Negocio:**
    *   La reservación debe estar en estado `'PENDIENTE'` o `'CONFIRMADA'`.
    *   Una vez realizado el check-in, el estado de la reserva se actualiza a `'CONFIRMADA'` y se crea un registro de estadía marcando la fecha/hora actual del servidor (`checkin`).

### `POST /api/estadias/{id_estadia}/checkout`
*   **Descripción:** Finaliza el hospedaje de un huésped, liberando las habitaciones correspondientes y procesando automáticamente la factura de cobro.
*   **Parámetro de Ruta:** `id_estadia` (int)
*   **Cuerpo de Solicitud (JSON):** [EstadiaCheckout](./schemas/schemas.py#L83)
    *   `id_empleado` (int): Empleado que procesa el egreso.
    *   `metodo_pago` (str): Método de pago utilizado. Restringido a: `'EFECTIVO'`, `'TRANSFERENCIA'`, `'TARJETA'`, `'BITCOIN'` o `'PAYPAL'`.
*   **Modelo de Respuesta:** [FacturaCompletaResponse](./schemas/schemas.py#L226)
*   **Reglas de Negocio:**
    1. Si la estadía ya completó el checkout con anterioridad, se produce un error `HTTP 400 Bad Request`.
    2. La reservación de origen cambia su estado a `'COMPLETADA'`.
    3. Internamente ejecuta un procedimiento almacenado en la base de datos (`ejecutar_checkout_factura`) que consolida costos de noches, cargos extras de temporada, descuentos por cantidad de días alojados y consumos adicionales de servicios.
    4. Devuelve la factura final totalmente estructurada con sus subtotales y detalle.

### `POST /api/estadias/{id_estadia}/consumo`
*   **Descripción:** Carga un consumo de servicio adicional (ej: restaurante, bar, lavandería) a la cuenta de una estadía activa.
*   **Parámetro de Ruta:** `id_estadia` (int)
*   **Cuerpo de Solicitud (JSON):** [ConsumoServicioCreate](./schemas/schemas.py#L65)
    *   `id_servicio` (int): ID del servicio consumido.
    *   `id_habitacion` (int): Habitación a la que se asocia el consumo.
*   **Modelo de Respuesta:** [ConsumoServicioResponse](./schemas/schemas.py#L69)
*   **Reglas de Negocio:** No se pueden añadir consumos si la estadía ya se encuentra cerrada (es decir, tiene fecha de `checkout` registrada).

### `GET /api/estadias/{id_estadia}/consumo-reporte`
*   **Descripción:** Retorna una estructura JSON con el acumulado y la lista de todos los servicios adicionales consumidos por un huésped durante su estancia.
*   **Parámetro de Ruta:** `id_estadia` (int)
*   **Modelo de Respuesta:** [ConsumoEstadiaResponse](./schemas/schemas.py#L212)
*   **Estructura del Objeto Devuelto:**
    *   `id_estadia` (int), `nombre` (str) del huésped, `documento` (str).
    *   `reporte_json` (dict): Diccionario crudo con los datos de consumos calculados directamente desde la base de datos.

---

## 6. Módulo de Servicios (`/api/servicios`)

Implementado en el router [servicios.py](./routers/servicios.py) y gestionado por [servicio_service.py](./services/servicio_service.py).

### `GET /api/servicios/mas-consumidos`
*   **Descripción:** Reporta estadísticas agregadas sobre los servicios más consumidos, segmentados por el tipo de habitación del cliente. Permite identificar tendencias (ej: qué consumen más los huéspedes de las Suites).
*   **Modelo de Respuesta:** `List[`[ServiciosMasConsumidosResponse](./schemas/schemas.py#L178)`]`

### `GET /api/servicios`
*   **Descripción:** Obtiene el catálogo de servicios complementarios disponibles en el hotel con sus respectivos precios unitarios.
*   **Modelo de Respuesta:** `List[`[ServicioResponse](./schemas/schemas.py#L238)`]`

---

## 7. Módulo de Empleados (`/api/empleados`)

Implementado en el router [empleados.py](./routers/empleados.py) y gestionado por [empleado_service.py](./services/empleado_service.py).

### `GET /api/empleados`
*   **Descripción:** Devuelve la planilla completa de trabajadores del hotel incluyendo su rol laboral y salario.
*   **Modelo de Respuesta:** `List[`[EmpleadoResponse](./schemas/schemas.py#L218)`]`

### `POST /api/empleados`
*   **Descripción:** Inserta un nuevo empleado en la nómina.
*   **Cuerpo de Solicitud (JSON):** [EmpleadoCreate](./schemas/schemas.py#L258)
    *   `id_tipo_empleado` (int): Rol (ej. 1 para Administrador, 2 para Recepcionista, etc.).
    *   `nombre` (str): Nombre completo.
    *   `correo` (str): Dirección de correo electrónico.
    *   `telefono` (str/null): Número de contacto.
    *   `dui` (str): Documento Único de Identidad.
    *   `salario` (Decimal): Sueldo asignado.
*   **Modelo de Respuesta:** [EmpleadoResponse](./schemas/schemas.py#L218) (Devuelve el formato mapeado con el nombre de su rol de trabajo en lugar de sólo el ID numérico).

---

## 8. Módulo de Reportes (`/api/reportes`)

Implementado en el router [reportes.py](./routers/reportes.py) y gestionado por [factura_service.py](./services/factura_service.py).

### `GET /api/reportes/ingresos-mensuales`
*   **Descripción:** Genera un histórico financiero agrupado por año y mes que consolida la suma total de ingresos reales facturados por el hotel.
*   **Modelo de Respuesta:** `List[`[IngresosMesResponse](./schemas/schemas.py#L146)`]`
*   **Campos:** `anio` (int), `num_mes` (int), `mes` (str), `ingresos` (Decimal).

### `GET /api/reportes/ocupacion-mensual`
*   **Descripción:** Reporta el porcentaje y tasa de ocupación real de las habitaciones de forma mensual, categorizadas por el tipo de habitación.
*   **Modelo de Respuesta:** `List[`[TasaOcupacionResponse](./schemas/schemas.py#L113)`]`
*   **Campos:** `mes` (str), `tipo_habitacion` (str), `total_dias_ocupados` (int), `total_dias_disponibles` (int), `porcentaje_ocupacion` (str).

### `GET /api/reportes/factura/{id_factura}`
*   **Descripción:** Obtiene los datos detallados de una factura emitida por su identificador.
*   **Parámetro de Ruta:** `id_factura` (int)
*   **Modelo de Respuesta:** [FacturaCompletaResponse](./schemas/schemas.py#L226)
*   **Estructura del Objeto Devuelto:** Contiene información del emisor (empleado), receptor (huésped), estadía, método de pago, fecha, total acumulado y un arreglo `detalle_factura` que lista cada concepto cobrado (noches de alojamiento, servicios extras, aumentos aplicados y descuentos restados).

### `GET /api/reportes/facturas`
*   **Descripción:** Lista de manera simplificada y ordenada cronológicamente (más recientes primero) todas las facturas procesadas en el hotel.
*   **Modelo de Respuesta:** `List[`[FacturaSimplificadaResponse](./schemas/schemas.py#L266)`]`

### `GET /api/reportes/factura/{id_factura}/html`
*   **Descripción:** Renderiza una representación visual premium de la factura en HTML5, estructurada con hojas de estilo personalizadas (Google Fonts Outfit, colores de marca del hotel Cénit) y barras de utilidades no imprimibles para facilitar su impresión directa (`window.print()`).
*   **Parámetro de Ruta:** `id_factura` (int)
*   **Tipo de Respuesta:** `HTMLResponse` (Devuelve código HTML directamente con cabecera `text/html`).

---

## 9. Módulo de Configuraciones e Extras (`/api/configuraciones`)

Implementado en el router [configuraciones.py](./routers/configuraciones.py) y gestionado por [extras_service.py](./services/extras_service.py).

### Cobros Extra por Temporada (Aumento de Costos)

#### `GET /api/configuraciones/temporadas`
*   **Descripción:** Retorna todas las reglas configuradas para cargos extras debido a temporadas de alta demanda (ej: Semana Santa, Fin de Año).
*   **Modelo de Respuesta:** [AumentoCostoResponse](./schemas/schemas.py#L277)

#### `POST /api/configuraciones/temporadas`
*   **Descripción:** Crea una nueva regla de aumento por temporada.
*   **Cuerpo de Solicitud (JSON):** [AumentoCostoCreate](./schemas/schemas.py#L288)
    *   `porcentaje_aumento` (Decimal): Porcentaje extra a cobrar (de 0.01 a 100.00).
    *   `fecha_inicio` (date), `fecha_fin` (date).
    *   `nombre_temporada` (str/null): Nombre representativo (máx 100 caracteres).
    *   `activado` (bool): Estado inicial (defecto `True`).
*   **Modelo de Respuesta:** [AumentoCostoResponse](./schemas/schemas.py#L277)
*   **Regla de Negocio:** No se permiten duplicar nombres de temporadas para evitar confusiones operativas.

#### `PUT /api/configuraciones/temporadas/{id_aumento_costo}`
*   **Descripción:** Edita parcialmente los rangos de fechas o porcentajes de aumento de una temporada.
*   **Parámetro de Ruta:** `id_aumento_costo` (int)
*   **Cuerpo de Solicitud (JSON):** [AumentoCostoUpdate](./schemas/schemas.py#L295) (Campos opcionales).
*   **Modelo de Respuesta:** [AumentoCostoResponse](./schemas/schemas.py#L277)

#### `DELETE /api/configuraciones/temporadas/{id_aumento_costo}`
*   **Descripción:** Elimina una regla de aumento de costo.
*   **Regla de Negocio:** Si la regla ya está referenciada en facturas históricas cerradas, no se podrá eliminar física de la base de datos para preservar la contabilidad (`HTTP 400 Bad Request`). Para estos casi se recomienda desactivarla usando el endpoint `/toggle`.

#### `POST /api/configuraciones/temporadas/{id_aumento_costo}/toggle`
*   **Descripción:** Invierte de manera lógica el estado de activación (`activado = true/false`) de una regla de aumento.
*   **Parámetro de Ruta:** `id_aumento_costo` (int)
*   **Modelo de Respuesta:** [AumentoCostoResponse](./schemas/schemas.py#L277)

---

### Descuentos por Estancia

#### `GET /api/configuraciones/descuentos`
*   **Descripción:** Lista todas las políticas de descuento configuradas en base a la cantidad de días de hospedaje continuo (ej: 10% de descuento para estancias de 5 o más días).
*   **Modelo de Respuesta:** [DescuentoResponse](./schemas/schemas.py#L302)

#### `POST /api/configuraciones/descuentos`
*   **Descripción:** Registra una nueva promoción o descuento por volumen de días.
*   **Cuerpo de Solicitud (JSON):** [DescuentoCreate](./schemas/schemas.py#L311)
    *   `porcentaje_descuento` (Decimal): Porcentaje a deducir (0.01 a 100.00).
    *   `cant_dia_hospedado` (int/null): Umbral mínimo de días de estancia requeridos (mínimo 1).
    *   `activado` (bool): Por defecto `True`.
*   **Modelo de Respuesta:** [DescuentoResponse](./schemas/schemas.py#L302)

#### `PUT /api/configuraciones/descuentos/{id_descuento}`
*   **Descripción:** Modifica los parámetros de un descuento registrado.
*   **Parámetro de Ruta:** `id_descuento` (int)
*   **Cuerpo de Solicitud (JSON):** [DescuentoUpdate](./schemas/schemas.py#L316)
*   **Modelo de Respuesta:** [DescuentoResponse](./schemas/schemas.py#L302)

#### `DELETE /api/configuraciones/descuentos/{id_descuento}`
*   **Descripción:** Elimina una regla de descuento.
*   **Regla de Negocio:** No se podrá eliminar físicamente si ya se aplicó a una factura existente. Retornará `HTTP 400 Bad Request`. Use `/toggle` como alternativa.

#### `POST /api/configuraciones/descuentos/{id_descuento}/toggle`
*   **Descripción:** Alterna la activación de una regla de descuento.
*   **Parámetro de Ruta:** `id_descuento` (int)
*   **Modelo de Respuesta:** [DescuentoResponse](./schemas/schemas.py#L302)

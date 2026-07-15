CREATE TABLE public.aumento_costos (
    id_aumento_costo bigint NOT NULL,
    porcentaje_aumento numeric(5,2) NOT NULL,
    fecha_inicio date NOT NULL,
    fecha_fin date NOT NULL,
    nombre_temporada character varying(100),
    activado boolean DEFAULT true,
    CONSTRAINT ck_fecha_inicio CHECK ((fecha_inicio < fecha_fin)),
    CONSTRAINT ck_porcentaje_aumento CHECK ((porcentaje_aumento >= (0)::numeric))
);

CREATE TABLE public.comodidad_tipo_habitacion (
    id_comodidad_habitacion bigint NOT NULL,
    id_tipo_habitacion bigint NOT NULL,
    id_tipo_comodidad bigint NOT NULL,
    detalle text NOT NULL
);

CREATE TABLE public.consumo_servicio (
    id_consumo_servicio bigint NOT NULL,
    id_servicio bigint NOT NULL,
    id_habitacion bigint NOT NULL,
    id_estadia bigint NOT NULL,
    hora_consumo timestamp without time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.detalle_reservacion (
    id_detalle_reservacion bigint NOT NULL,
    id_reservacion bigint NOT NULL,
    id_habitacion bigint NOT NULL,
    cant_huespedes integer NOT NULL,
    fecha_entrada date NOT NULL,
    fecha_salida date NOT NULL,
    CONSTRAINT ck_cant_huespedes_detalle CHECK ((cant_huespedes > 0)),
    CONSTRAINT ck_fecha_entrada CHECK ((fecha_entrada < fecha_salida))
);

CREATE TABLE public.estadia (
    id_estadia bigint NOT NULL,
    id_reservacion bigint NOT NULL,
    checkin timestamp without time zone DEFAULT now() NOT NULL,
    checkout timestamp without time zone,
    CONSTRAINT ck_checkin CHECK (((checkout IS NULL) OR (checkin < checkout)))
);

CREATE TABLE public.factura (
    id_factura bigint NOT NULL,
    id_empleado bigint NOT NULL,
    id_huesped bigint NOT NULL,
    id_estadia bigint NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL,
    metodo_pago character varying(50) NOT NULL,
    total_a_pagar numeric(10,2) NOT NULL,
    CONSTRAINT ck_metodo_pago CHECK (((metodo_pago)::text = ANY (ARRAY[('EFECTIVO'::character varying)::text, ('TRANSFERENCIA'::character varying)::text, ('TARJETA'::character varying)::text, ('BITCOIN'::character varying)::text, ('PAYPAL'::character varying)::text]))),
    CONSTRAINT ck_total_pagar CHECK ((total_a_pagar >= (0)::numeric))
);

CREATE TABLE public.habitacion (
    id_habitacion bigint NOT NULL,
    id_hotel bigint NOT NULL,
    nivel integer NOT NULL,
    numero_habitacion integer NOT NULL,
    id_tipo_habitacion bigint NOT NULL,
    precio numeric(10,2) NOT NULL,
    estado character varying(50) NOT NULL,
    capacidad_maxima integer NOT NULL,
    descripcion text,
    CONSTRAINT ck_capacidad_maxima CHECK (((capacidad_maxima >= 1) AND (capacidad_maxima <= 15))),
    CONSTRAINT ck_estado CHECK (((estado)::text = ANY (ARRAY[('DISPONIBLE'::character varying)::text, ('OCUPADA'::character varying)::text, ('MANTENIMIENTO'::character varying)::text]))),
    CONSTRAINT ck_nivel CHECK ((nivel >= 0)),
    CONSTRAINT ck_num_habitacion CHECK ((numero_habitacion >= 0)),
    CONSTRAINT ck_precio CHECK ((precio >= (0)::numeric))
);

CREATE TABLE public.hotel (
    id_hotel bigint NOT NULL,
    nombre character varying(255) NOT NULL,
    direccion character varying(255),
    niveles_edificios integer NOT NULL,
    calificacion numeric(2,1),
    descripcion text,
    CONSTRAINT ck_calificacion CHECK (((calificacion >= (1)::numeric) AND (calificacion <= (5)::numeric))),
    CONSTRAINT ck_niveles CHECK ((niveles_edificios > 0))
);

CREATE TABLE public.descuento (
    id_descuento bigint NOT NULL,
    porcentaje_descuento numeric(5,2) NOT NULL,
    cant_dia_hospedado integer,
    CONSTRAINT ck_cant_dia CHECK ((cant_dia_hospedado > 0)),
    CONSTRAINT ck_porcentaje CHECK (((porcentaje_descuento >= (0)::numeric) AND (porcentaje_descuento <= (100)::numeric)))
);

CREATE TABLE public.detalle_factura (
    id_detalle_factura bigint NOT NULL,
    id_factura bigint NOT NULL,
    id_servicio bigint,
    id_habitacion bigint,
    id_descuento bigint,
    id_aumento_costo bigint,
    concepto character varying(255) NOT NULL,
    precio_unitario numeric(10,2) NOT NULL,
    cantidad integer NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    monto_descuento numeric(10,2) DEFAULT 0.00,
    monto_aumento numeric(10,2) DEFAULT 0.00,
    precio_total numeric(10,2) NOT NULL,
    CONSTRAINT ck_cantidad CHECK ((cantidad >= 1)),
    CONSTRAINT ck_monto_aumento CHECK ((monto_aumento >= (0)::numeric)),
    CONSTRAINT ck_monto_descuento CHECK ((monto_descuento >= (0)::numeric)),
    CONSTRAINT ck_origen_cobro CHECK ((((id_servicio IS NOT NULL) AND (id_habitacion IS NULL)) OR ((id_servicio IS NULL) AND (id_habitacion IS NOT NULL)))),
    CONSTRAINT ck_precio_total CHECK ((precio_total >= (0)::numeric)),
    CONSTRAINT ck_precio_unitario CHECK ((precio_unitario >= (0)::numeric)),
    CONSTRAINT ck_subtotal CHECK ((subtotal >= (0)::numeric))
);

CREATE TABLE public.empleado (
    id_empleado bigint NOT NULL,
    id_tipo_empleado bigint NOT NULL,
    nombre character varying(255) NOT NULL,
    correo character varying(100) NOT NULL,
    telefono character varying(20),
    dui character varying(10) NOT NULL,
    salario numeric(10,2) NOT NULL,
    CONSTRAINT ck_correo CHECK (((correo)::text ~~ '%@%.%'::text)),
    CONSTRAINT ck_dui CHECK (((dui)::text ~ '^[0-9]{8}-[0-9]{1}$'::text)),
    CONSTRAINT ck_salario CHECK ((salario >= (0)::numeric)),
    CONSTRAINT ck_telefono CHECK (((telefono)::text ~ '^\+503[267][0-9]{7}$'::text))
);

CREATE TABLE public.huesped (
    id_huesped bigint NOT NULL,
    nombre character varying(255) NOT NULL,
    correo character varying(255) NOT NULL,
    telefono character varying(20) NOT NULL,
    documento character varying(50) NOT NULL,
    tipo_documento character varying(50) NOT NULL,
    CONSTRAINT ck_correo CHECK (((correo)::text ~~ '%@%.%'::text)),
    CONSTRAINT ck_telefono_huesped CHECK (((telefono)::text ~ '^\+?[0-9\s\-]{7,20}$'::text)),
    CONSTRAINT ck_tipo_documento CHECK (((tipo_documento)::text = ANY (ARRAY[('DUI'::character varying)::text, ('PASAPORTE'::character varying)::text, ('CONSTANCIA DE RESIDENCIA'::character varying)::text])))
);

CREATE TABLE public.resenia (
    id_resenia bigint NOT NULL,
    id_estadia bigint NOT NULL,
    id_huesped bigint NOT NULL,
    calificacion numeric(2,1),
    comentario text,
    CONSTRAINT ck_calificacion CHECK (((calificacion >= (1)::numeric) AND (calificacion <= (5)::numeric)))
);

CREATE TABLE public.reservacion (
    id_reservacion bigint NOT NULL,
    id_empleado bigint NOT NULL,
    id_huesped bigint NOT NULL,
    cant_huespedes_totales integer NOT NULL,
    estado character varying(50) NOT NULL,
    CONSTRAINT ck_cant_huepedes CHECK ((cant_huespedes_totales > 0)),
    CONSTRAINT ck_estado CHECK (((estado)::text = ANY (ARRAY[('PENDIENTE'::character varying)::text, ('CONFIRMADA'::character varying)::text, ('CANCELADA'::character varying)::text, ('RECHAZADA'::character varying)::text, ('COMPLETADA'::character varying)::text])))
);

CREATE TABLE public.servicio (
    id_servicio bigint NOT NULL,
    tipo_servicio character varying(100) NOT NULL,
    precio numeric(10,2) NOT NULL,
    CONSTRAINT ck_precio CHECK ((precio >= (0)::numeric))
);

CREATE TABLE public.tipo_habitacion (
    id_tipo_habitacion bigint NOT NULL,
    tipo_habitacion character varying(100) NOT NULL
);

CREATE TABLE public.tipo_comodidad (
    id_tipo_comodidad bigint NOT NULL,
    tipo_comodidad character varying(100) NOT NULL
);

CREATE TABLE public.tipo_empleado (
    id_tipo_empleado bigint NOT NULL,
    tipo_empleado character varying(100) NOT NULL
);

ALTER TABLE public.aumento_costos OWNER TO postgres;

ALTER TABLE public.aumento_costos ALTER COLUMN id_aumento_costo ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.aumento_costos_id_aumento_costo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE public.comodidad_tipo_habitacion OWNER TO postgres;

ALTER TABLE public.comodidad_tipo_habitacion ALTER COLUMN id_comodidad_habitacion ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.comodidad_tipo_habitacion_id_comodidad_habitacion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE public.consumo_servicio OWNER TO postgres;

ALTER TABLE public.consumo_servicio ALTER COLUMN id_consumo_servicio ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.consumo_servicio_id_consumo_servicio_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE public.detalle_reservacion OWNER TO postgres;

ALTER TABLE public.estadia OWNER TO postgres;

ALTER TABLE public.factura OWNER TO postgres;

ALTER TABLE public.habitacion OWNER TO postgres;

ALTER TABLE public.hotel OWNER TO postgres;

ALTER TABLE public.descuento OWNER TO postgres;

ALTER TABLE public.descuento ALTER COLUMN id_descuento ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.descuento_id_descuento_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE public.detalle_factura OWNER TO postgres;

ALTER TABLE public.detalle_factura ALTER COLUMN id_detalle_factura ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.detalle_factura_id_detalle_factura_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE public.detalle_reservacion ALTER COLUMN id_detalle_reservacion ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.detalle_reservacion_id_detalle_reservacion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE public.empleado OWNER TO postgres;

ALTER TABLE public.empleado ALTER COLUMN id_empleado ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.empleado_id_empleado_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE public.estadia ALTER COLUMN id_estadia ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.estadia_id_estadia_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE public.factura ALTER COLUMN id_factura ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.factura_id_factura_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE public.habitacion ALTER COLUMN id_habitacion ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.habitacion_id_habitacion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE public.hotel ALTER COLUMN id_hotel ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.hotel_id_hotel_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE public.huesped OWNER TO postgres;

ALTER TABLE public.huesped ALTER COLUMN id_huesped ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.huesped_id_huesped_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE public.resenia OWNER TO postgres;

ALTER TABLE public.resenia ALTER COLUMN id_resenia ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.resenia_id_resenia_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE public.reservacion OWNER TO postgres;

ALTER TABLE public.reservacion ALTER COLUMN id_reservacion ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.reservacion_id_reservacion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE public.servicio OWNER TO postgres;

ALTER TABLE public.servicio ALTER COLUMN id_servicio ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.servicio_id_servicio_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE public.tipo_habitacion OWNER TO postgres;

ALTER TABLE public.tipo_comodidad OWNER TO postgres;

ALTER TABLE public.tipo_comodidad ALTER COLUMN id_tipo_comodidad ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tipo_comodidad_id_tipo_comodidad_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE public.tipo_empleado OWNER TO postgres;

ALTER TABLE public.tipo_empleado ALTER COLUMN id_tipo_empleado ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tipo_empleado_id_tipo_empleado_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE public.tipo_habitacion ALTER COLUMN id_tipo_habitacion ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tipo_habitacion_id_tipo_habitacion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY public.aumento_costos
    ADD CONSTRAINT pk_aumento_costo PRIMARY KEY (id_aumento_costo);

ALTER TABLE ONLY public.comodidad_tipo_habitacion
    ADD CONSTRAINT pk_comodidad_tipo_habitacion PRIMARY KEY (id_comodidad_habitacion);

ALTER TABLE ONLY public.consumo_servicio
    ADD CONSTRAINT pk_consumo_servicio PRIMARY KEY (id_consumo_servicio);

ALTER TABLE ONLY public.descuento
    ADD CONSTRAINT pk_descuento PRIMARY KEY (id_descuento);

ALTER TABLE ONLY public.detalle_factura
    ADD CONSTRAINT pk_detalle_factura PRIMARY KEY (id_detalle_factura);

ALTER TABLE ONLY public.detalle_reservacion
    ADD CONSTRAINT pk_detalle_reservacion PRIMARY KEY (id_detalle_reservacion);

ALTER TABLE ONLY public.empleado
    ADD CONSTRAINT pk_empleado PRIMARY KEY (id_empleado);

ALTER TABLE ONLY public.estadia
    ADD CONSTRAINT pk_estadia PRIMARY KEY (id_estadia);

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT pk_factura PRIMARY KEY (id_factura);

ALTER TABLE ONLY public.habitacion
    ADD CONSTRAINT pk_habitacion PRIMARY KEY (id_habitacion);

ALTER TABLE ONLY public.hotel
    ADD CONSTRAINT pk_hotel PRIMARY KEY (id_hotel);

ALTER TABLE ONLY public.huesped
    ADD CONSTRAINT pk_huesped PRIMARY KEY (id_huesped);

ALTER TABLE ONLY public.resenia
    ADD CONSTRAINT pk_resenia PRIMARY KEY (id_resenia);

ALTER TABLE ONLY public.reservacion
    ADD CONSTRAINT pk_reservacion PRIMARY KEY (id_reservacion);

ALTER TABLE ONLY public.servicio
    ADD CONSTRAINT pk_servicio PRIMARY KEY (id_servicio);

ALTER TABLE ONLY public.tipo_comodidad
    ADD CONSTRAINT pk_tipo_comodidad PRIMARY KEY (id_tipo_comodidad);

ALTER TABLE ONLY public.tipo_empleado
    ADD CONSTRAINT pk_tipo_empleado PRIMARY KEY (id_tipo_empleado);

ALTER TABLE ONLY public.tipo_habitacion
    ADD CONSTRAINT pk_tipo_habitacion PRIMARY KEY (id_tipo_habitacion);

ALTER TABLE ONLY public.huesped
    ADD CONSTRAINT uq_correo UNIQUE (correo);

ALTER TABLE ONLY public.empleado
    ADD CONSTRAINT uq_correo_empleado UNIQUE (correo);

ALTER TABLE ONLY public.huesped
    ADD CONSTRAINT uq_documento UNIQUE (documento);

ALTER TABLE ONLY public.empleado
    ADD CONSTRAINT uq_dui UNIQUE (dui);

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT uq_empleado_huesped_estadia UNIQUE (id_empleado, id_huesped, id_estadia);

ALTER TABLE ONLY public.habitacion
    ADD CONSTRAINT uq_hotel_nivel_numhab UNIQUE (id_hotel, nivel, numero_habitacion);

ALTER TABLE ONLY public.hotel
    ADD CONSTRAINT uq_nombre UNIQUE (nombre);

ALTER TABLE ONLY public.aumento_costos
    ADD CONSTRAINT uq_nombre_temp UNIQUE (nombre_temporada);

ALTER TABLE ONLY public.resenia
    ADD CONSTRAINT uq_resenia_huesped UNIQUE (id_estadia, id_huesped);

ALTER TABLE ONLY public.tipo_comodidad
    ADD CONSTRAINT uq_tipo_comodidad UNIQUE (tipo_comodidad);

ALTER TABLE ONLY public.tipo_empleado
    ADD CONSTRAINT uq_tipo_empleado UNIQUE (tipo_empleado);

ALTER TABLE ONLY public.tipo_habitacion
    ADD CONSTRAINT uq_tipo_habitacion UNIQUE (tipo_habitacion);

ALTER TABLE ONLY public.servicio
    ADD CONSTRAINT uq_tipo_servicio UNIQUE (tipo_servicio);

ALTER TABLE ONLY public.detalle_factura
    ADD CONSTRAINT fk_aumento_detalle FOREIGN KEY (id_aumento_costo) REFERENCES public.aumento_costos(id_aumento_costo) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.detalle_factura
    ADD CONSTRAINT fk_descuento_detalle FOREIGN KEY (id_descuento) REFERENCES public.descuento(id_descuento) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.reservacion
    ADD CONSTRAINT fk_empleado FOREIGN KEY (id_empleado) REFERENCES public.empleado(id_empleado) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT fk_empleado_factura FOREIGN KEY (id_empleado) REFERENCES public.empleado(id_empleado) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.resenia
    ADD CONSTRAINT fk_estadia FOREIGN KEY (id_estadia) REFERENCES public.estadia(id_estadia) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.consumo_servicio
    ADD CONSTRAINT fk_estadia_consumo FOREIGN KEY (id_estadia) REFERENCES public.estadia(id_estadia) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT fk_estadia_factura FOREIGN KEY (id_estadia) REFERENCES public.estadia(id_estadia) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.detalle_factura
    ADD CONSTRAINT fk_factura_detalle FOREIGN KEY (id_factura) REFERENCES public.factura(id_factura) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.consumo_servicio
    ADD CONSTRAINT fk_habitacion FOREIGN KEY (id_habitacion) REFERENCES public.habitacion(id_habitacion) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.detalle_reservacion
    ADD CONSTRAINT fk_habitacion FOREIGN KEY (id_habitacion) REFERENCES public.habitacion(id_habitacion) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.detalle_factura
    ADD CONSTRAINT fk_habitacion_detalle FOREIGN KEY (id_habitacion) REFERENCES public.habitacion(id_habitacion) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.habitacion
    ADD CONSTRAINT fk_hotel FOREIGN KEY (id_hotel) REFERENCES public.hotel(id_hotel) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.resenia
    ADD CONSTRAINT fk_huesped FOREIGN KEY (id_huesped) REFERENCES public.huesped(id_huesped) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.reservacion
    ADD CONSTRAINT fk_huesped FOREIGN KEY (id_huesped) REFERENCES public.huesped(id_huesped) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT fk_huesped_factura FOREIGN KEY (id_huesped) REFERENCES public.huesped(id_huesped) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.detalle_reservacion
    ADD CONSTRAINT fk_reservacion FOREIGN KEY (id_reservacion) REFERENCES public.reservacion(id_reservacion) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.estadia
    ADD CONSTRAINT fk_reservacion FOREIGN KEY (id_reservacion) REFERENCES public.reservacion(id_reservacion) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.consumo_servicio
    ADD CONSTRAINT fk_servicio FOREIGN KEY (id_servicio) REFERENCES public.servicio(id_servicio) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.detalle_factura
    ADD CONSTRAINT fk_servicio_detalle FOREIGN KEY (id_servicio) REFERENCES public.servicio(id_servicio) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.comodidad_tipo_habitacion
    ADD CONSTRAINT fk_tipo_comodidad FOREIGN KEY (id_tipo_comodidad) REFERENCES public.tipo_comodidad(id_tipo_comodidad);

ALTER TABLE ONLY public.empleado
    ADD CONSTRAINT fk_tipo_empleado FOREIGN KEY (id_tipo_empleado) REFERENCES public.tipo_empleado(id_tipo_empleado) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.comodidad_tipo_habitacion
    ADD CONSTRAINT fk_tipo_habitacion FOREIGN KEY (id_tipo_habitacion) REFERENCES public.tipo_habitacion(id_tipo_habitacion);

ALTER TABLE ONLY public.habitacion
    ADD CONSTRAINT fk_tipo_habitacion FOREIGN KEY (id_tipo_habitacion) REFERENCES public.tipo_habitacion(id_tipo_habitacion) ON UPDATE CASCADE ON DELETE RESTRICT;


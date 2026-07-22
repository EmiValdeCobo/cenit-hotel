# backend/demo_architecture.py
"""
Ejemplo de Integración y Demostración Arquitectónica - Cenit Hotel System.
Demuestra la ejecución de los Patrones de Diseño implementados:
- Factory Method & Strategy (RendererFactory y HTMLInvoiceRenderer)
- Builder Pattern (InvoiceBuilder)
- Observer Pattern (EventDispatcher)
- Strategy Pattern (HighSeasonSurchargeStrategy & PercentageDiscountStrategy)
"""
import os
import sys

# Asegurar path de importación
sys.path.append(os.path.dirname(__file__))

from core.events.dispatcher import event_dispatcher
from core.events.events import CheckOutCompletedEvent
from domain.builders.invoice_builder import InvoiceBuilder
from domain.strategies.surcharge_strategy import HighSeasonSurchargeStrategy
from domain.strategies.discount_strategy import PercentageDiscountStrategy
from services.renderers.renderer_factory import RendererFactory

def main():
    print("==================================================================")
    print(" DEMO DE ARQUITECTURA Y PATRONES DE DISEÑO - CENIT HOTEL SYSTEM ")
    print("==================================================================\n")

    # 1. Demostración del Patrón Observer
    print(">>> 1. Probando Patrón Observer (EventDispatcher)...")
    def logger_checkout_listener(event: CheckOutCompletedEvent):
        print(f"    [OBSERVER HANDLER] ¡Evento detectado! Checkout completado para Estadía #{event.id_estadia}.")
        print(f"                       Factura generado: #{event.id_factura} | Total: ${event.total_pagado:.2f} | Método: {event.metodo_pago}")

    event_dispatcher.subscribe(CheckOutCompletedEvent, logger_checkout_listener)
    
    # Emitir un evento de simulación
    simulated_event = CheckOutCompletedEvent(
        id_estadia=101,
        id_factura=5001,
        total_pagado=450.00,
        metodo_pago="TARJETA_CREDITO"
    )
    event_dispatcher.publish(simulated_event)
    print("    -> Evento despachado con éxito.\n")

    # 2. Demostración del Patrón Strategy (Tarificación y Descuentos)
    print(">>> 2. Probando Patrón Strategy (Cálculo de Recargos y Descuentos)...")
    recargo_temporada = HighSeasonSurchargeStrategy(porcentaje_aumento=15.0, monto_fijo=10.0)
    descuento_permanencia = PercentageDiscountStrategy(porcentaje_descuento=10.0)

    precio_habitacion_base = 200.00
    contexto = {"activado": True}

    monto_recargo = recargo_temporada.calculate(precio_habitacion_base, contexto)
    monto_descuento = descuento_permanencia.calculate(precio_habitacion_base, contexto)

    print(f"    Precio Base Habitación: ${precio_habitacion_base:.2f}")
    print(f"    Recargo Temporada High Season (+15% + $10): +${monto_recargo:.2f}")
    print(f"    Descuento Permanencia Prolongada (-10%): -${monto_descuento:.2f}")
    precio_final = precio_habitacion_base + monto_recargo - monto_descuento
    print(f"    Precio Ajustado Final: ${precio_final:.2f}\n")

    # 3. Demostración del Patrón Builder (InvoiceBuilder)
    print(">>> 3. Probando Patrón Builder (InvoiceBuilder)...")
    builder = InvoiceBuilder()
    factura_demo = (
        builder
        .set_encabezado(
            id_factura=5001,
            fecha="2026-07-21 19:15:00",
            metodo_pago="TARJETA_CREDITO",
            id_estadia=101,
            id_huesped=42,
            nombre_huesped="Emilio Ramírez",
            correo_huesped="emilio@example.com",
            id_empleado=5,
            nombre_empleado="Ana Martínez"
        )
        .add_linea_detalle(
            concepto="Habitación Suite Presidencial (2 Noches)",
            cantidad=2,
            precio_unitario=200.00,
            monto_aumento=monto_recargo,
            monto_descuento=monto_descuento
        )
        .add_linea_detalle(
            concepto="Servicio de Room Service / Gourmet Breakfast",
            cantidad=1,
            precio_unitario=50.00
        )
        .build()
    )

    print(f"    Factura construida exitosamente.")
    print(f"    Factura ID: #{factura_demo['id_factura']} | Huésped: {factura_demo['nombre_huesped']}")
    print(f"    Total a Pagar Calculado por Builder: ${factura_demo['total_a_pagar']:.2f}\n")

    # 4. Demostración del Patrón Factory & Strategy (RendererFactory + HTMLInvoiceRenderer)
    print(">>> 4. Probando Patrón Factory Method & Strategy (RendererFactory)...")
    renderer = RendererFactory.get_renderer("html")
    html_output = renderer.render(factura_demo)

    print(f"    Renderizador Obtenido de Factory: {type(renderer).__name__}")
    print(f"    Longitud del HTML generado: {len(html_output)} caracteres.")
    print(f"    ¿Contiene encabezado de Cénit Boutique Hotel?: {'CÉNIT' in html_output}")
    print("    -> Documento HTML renderizado correctamente de forma 100% desacoplada.")

    print("\n==================================================================")
    print(" ¡TODAS LAS PRUEBAS DE INTEGRACIÓN Y ARQUITECTURA COMPLETADAS! ")
    print("==================================================================")

if __name__ == "__main__":
    main()

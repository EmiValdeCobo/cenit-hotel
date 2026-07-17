# backend/routers/reportes.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from services.factura_service import FacturaService
from schemas.schemas import FacturaCompletaResponse, IngresosMesResponse, TasaOcupacionResponse, FacturaSimplificadaResponse
from typing import List
from sqlalchemy import text

router = APIRouter(prefix="/reportes", tags=["Reportes"])

@router.get("/ingresos-mensuales", response_model=List[IngresosMesResponse])
def get_ingresos_mensuales(db: Session = Depends(get_db)):
    service = FacturaService(db)
    return service.obtener_ingresos_mensuales()

@router.get("/ocupacion-mensual", response_model=List[TasaOcupacionResponse])
def get_ocupacion_mensual(db: Session = Depends(get_db)):
    service = FacturaService(db)
    return service.obtener_tasa_ocupacion_mensual()

@router.get("/factura/{id_factura}", response_model=FacturaCompletaResponse)
def get_factura_completa(id_factura: int, db: Session = Depends(get_db)):
    service = FacturaService(db)
    return service.obtener_factura_completa(id_factura)

@router.get("/facturas", response_model=List[FacturaSimplificadaResponse])
def listar_facturas(db: Session = Depends(get_db)):
    query = text("""
        SELECT f.id_factura, h.nombre as nombre_huesped, e.nombre as nombre_empleado, f.fecha, f.metodo_pago, f.total_a_pagar
        FROM factura f
        JOIN huesped h ON f.id_huesped = h.id_huesped
        JOIN empleado e ON f.id_empleado = e.id_empleado
        ORDER BY f.fecha DESC
    """)
    result = db.execute(query)
    return [dict(row._mapping) for row in result]

from fastapi.responses import HTMLResponse

def generate_html_invoice(factura: dict) -> str:
    id_factura = factura.get("id_factura")
    fecha = factura.get("fecha")
    fecha_str = fecha.strftime("%d/%m/%Y %I:%M %p") if hasattr(fecha, "strftime") else str(fecha)
    metodo_pago = factura.get("metodo_pago", "")
    total_a_pagar = float(factura.get("total_a_pagar", 0.0))
    id_estadia = factura.get("id_estadia")
    nombre_empleado = factura.get("nombre_empleado", "")
    nombre_huesped = factura.get("nombre_huesped", "")
    correo_huesped = factura.get("correo_huesped", "")
    id_huesped = factura.get("id_huesped")
    
    rows_html = ""
    subtotal_acumulable = 0.0
    total_descuentos = 0.0
    total_aumentos = 0.0
    
    for det in factura.get("detalle_factura", []):
        concepto = det.get("concepto", "")
        cantidad = int(det.get("cantidad", 1))
        precio_unitario = float(det.get("precio_unitario", 0.0))
        sub = float(det.get("subtotal", 0.0))
        monto_desc = float(det.get("monto_descuento", 0.0))
        monto_aum = float(det.get("monto_aumento", 0.0))
        precio_tot = float(det.get("precio_total", 0.0))
        
        subtotal_acumulable += sub
        total_descuentos += monto_desc
        total_aumentos += monto_aum
        
        desc_str = f"-${monto_desc:.2f}" if monto_desc > 0.005 else "$0.00"
        aum_str = f"+${monto_aum:.2f}" if monto_aum > 0.005 else "$0.00"
        
        rows_html += f"""
        <tr>
          <td class="col-concepto">{concepto}</td>
          <td class="col-qty">{cantidad}</td>
          <td class="col-price">${precio_unitario:.2f}</td>
          <td class="col-aum">{aum_str}</td>
          <td class="col-desc">{desc_str}</td>
          <td class="col-total">${precio_tot:.2f}</td>
        </tr>
        """
        
    return f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Factura #{id_factura} - Cénit Boutique Hotel</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {{
      --color-primary: #00241a;
      --color-secondary: #006d3a;
      --color-background: #fef9e9;
      --color-surface: #ffffff;
      --color-text: #1d1c12;
      --color-text-light: #717974;
      --color-border: #e6e3d3;
    }}
    body {{
      font-family: 'Outfit', sans-serif;
      background-color: var(--color-background);
      color: var(--color-text);
      margin: 0;
      padding: 40px 20px;
      display: flex;
      justify-content: center;
    }}
    .invoice-container {{
      width: 100%;
      max-width: 800px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 24px;
      padding: 48px;
      box-shadow: 0 10px 30px rgba(13, 59, 46, 0.05);
      position: relative;
      box-sizing: border-box;
    }}
    .header {{
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid var(--color-border);
      padding-bottom: 30px;
      margin-bottom: 40px;
    }}
    .logo-container h1 {{
      font-size: 32px;
      font-weight: 700;
      color: var(--color-primary);
      margin: 0;
      letter-spacing: -0.03em;
    }}
    .logo-container p {{
      color: var(--color-secondary);
      font-weight: 600;
      margin: 4px 0 0 0;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }}
    .invoice-meta {{
      text-align: right;
    }}
    .invoice-meta h2 {{
      font-size: 24px;
      font-weight: 600;
      color: var(--color-primary);
      margin: 0 0 8px 0;
    }}
    .invoice-meta p {{
      margin: 4px 0;
      font-size: 14px;
      color: var(--color-text-light);
    }}
    .details-row {{
      display: grid;
      grid-template-cols: 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }}
    .details-block h3 {{
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-secondary);
      margin: 0 0 12px 0;
      border-bottom: 1px solid var(--color-border);
      padding-bottom: 6px;
    }}
    .details-block p {{
      margin: 6px 0;
      font-size: 15px;
      line-height: 1.5;
    }}
    .details-block p strong {{
      color: var(--color-primary);
    }}
    .table-container {{
      margin-bottom: 40px;
    }}
    table {{
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }}
    th {{
      font-size: 13px;
      text-transform: uppercase;
      color: var(--color-text-light);
      padding: 12px 16px;
      border-bottom: 2px solid var(--color-border);
      letter-spacing: 0.05em;
    }}
    td {{
      padding: 16px;
      border-bottom: 1px solid var(--color-border);
      font-size: 15px;
    }}
    .col-concepto {{ width: 40%; }}
    .col-qty {{ width: 10%; text-align: center; }}
    .col-price {{ width: 15%; text-align: right; }}
    .col-aum {{ width: 15%; text-align: right; color: #ba1a1a; }}
    .col-desc {{ width: 15%; text-align: right; color: #006d3a; }}
    .col-total {{ width: 15%; text-align: right; font-weight: 600; color: var(--color-primary); }}
    
    td.col-qty {{ text-align: center; }}
    td.col-price, td.col-aum, td.col-desc, td.col-total {{ text-align: right; }}

    .summary-section {{
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }}
    .summary-table {{
      width: 320px;
    }}
    .summary-row {{
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 15px;
    }}
    .summary-row.total {{
      font-size: 20px;
      font-weight: 700;
      color: var(--color-primary);
      border-top: 2px solid var(--color-primary);
      padding-top: 16px;
      margin-top: 8px;
    }}
    .actions-bar {{
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-bottom: 30px;
      width: 100%;
      max-width: 800px;
    }}
    .btn {{
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      border: none;
      transition: all 0.2s ease;
      font-family: 'Outfit', sans-serif;
    }}
    .btn-print {{
      background: var(--color-primary);
      color: #ffffff;
    }}
    .btn-print:hover {{
      opacity: 0.9;
      transform: translateY(-1px);
    }}
    .btn-close {{
      background: var(--color-border);
      color: var(--color-primary);
    }}
    .btn-close:hover {{
      background: #d8d4c2;
      transform: translateY(-1px);
    }}
    
    @media print {{
      body {{
        background-color: #ffffff;
        padding: 0;
      }}
      .invoice-container {{
        border: none;
        box-shadow: none;
        padding: 0;
      }}
      .no-print {{
        display: none !important;
      }}
    }}
  </style>
</head>
<body>
  <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
    <div class="actions-bar no-print">
      <button class="btn btn-print" onclick="window.print()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
        Imprimir Factura
      </button>
      <button class="btn btn-close" onclick="window.close()">
        Cerrar pestaña
      </button>
    </div>
    
    <div class="invoice-container">
      <div class="header">
        <div class="logo-container">
          <h1>CÉNIT</h1>
          <p>Boutique Hotel</p>
        </div>
        <div class="invoice-meta">
          <h2>FACTURA</h2>
          <p><strong>N° Factura:</strong> #FC-{id_factura}</p>
          <p><strong>Fecha Emisión:</strong> {fecha_str}</p>
        </div>
      </div>
      
      <div class="details-row">
        <div class="details-block">
          <h3>Cliente / Huésped</h3>
          <p><strong>Nombre:</strong> {nombre_huesped}</p>
          <p><strong>Email:</strong> {correo_huesped}</p>
          <p><strong>ID Huésped:</strong> #{id_huesped}</p>
        </div>
        <div class="details-block">
          <h3>Detalle de Estadía</h3>
          <p><strong>ID Estadía:</strong> #{id_estadia}</p>
          <p><strong>Atendido por:</strong> {nombre_empleado}</p>
          <p><strong>Método de Pago:</strong> {metodo_pago}</p>
        </div>
      </div>
      
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th class="col-concepto">Concepto / Servicio</th>
              <th class="col-qty">Cant.</th>
              <th class="col-price">P. Unitario</th>
              <th class="col-aum">Recargos</th>
              <th class="col-desc">Descuentos</th>
              <th class="col-total">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows_html}
          </tbody>
        </table>
      </div>
      
      <div class="summary-section">
        <div class="summary-table">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>${subtotal_acumulable:.2f}</span>
          </div>
          <div class="summary-row" style="color: #006d3a;">
            <span>Total Descuentos:</span>
            <span>-${total_descuentos:.2f}</span>
          </div>
          <div class="summary-row" style="color: #ba1a1a;">
            <span>Total Recargos:</span>
            <span>+${total_aumentos:.2f}</span>
          </div>
          <div class="summary-row total">
            <span>Total a Pagar:</span>
            <span>${total_a_pagar:.2f}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>"""

@router.get("/factura/{id_factura}/html", response_class=HTMLResponse)
def get_factura_completa_html(id_factura: int, db: Session = Depends(get_db)):
    service = FacturaService(db)
    factura = service.obtener_factura_completa(id_factura)
    return generate_html_invoice(factura)


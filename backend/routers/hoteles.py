# backend/routers/hoteles.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from services.hotel_service import HotelService
from schemas.schemas import (
    DatosGeneralesHotelResponse, 
    InfoGeneralHotelResponse, 
    DetalleHabitacionComodidadesResponse,
    HotelCreate,
    HotelUpdate,
    HotelResponseBase
)
from typing import List

router = APIRouter(prefix="/hoteles", tags=["Hoteles"])

@router.get("/datos-generales", response_model=List[DatosGeneralesHotelResponse])
def get_datos_generales(db: Session = Depends(get_db)):
    service = HotelService(db)
    return service.obtener_datos_generales()

@router.get("/info-general", response_model=List[InfoGeneralHotelResponse])
def get_info_general(db: Session = Depends(get_db)):
    service = HotelService(db)
    return service.obtener_info_general()

@router.get("/comodidades", response_model=List[DetalleHabitacionComodidadesResponse])
def get_comodidades(db: Session = Depends(get_db)):
    service = HotelService(db)
    return service.obtener_detalle_habitaciones_y_comodidades()

@router.post("", response_model=HotelResponseBase)
def crear_hotel(hotel: HotelCreate, db: Session = Depends(get_db)):
    return HotelService(db).crear_hotel(hotel)

@router.put("/{id_hotel}", response_model=HotelResponseBase)
def actualizar_hotel(id_hotel: int, hotel: HotelUpdate, db: Session = Depends(get_db)):
    return HotelService(db).actualizar_hotel(id_hotel, hotel)

@router.delete("/{id_hotel}")
def eliminar_hotel(id_hotel: int, db: Session = Depends(get_db)):
    return HotelService(db).eliminar_hotel(id_hotel)

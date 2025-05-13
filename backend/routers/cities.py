from fastapi import APIRouter, Depends, HTTPException, Query, File, UploadFile
from dependencies import *
from schemas.cities import CityResponse, CreateCity, UpdateCity
from utils.enums import Status
from utils.image import save_image

router = APIRouter()

@router.post('/', status_code=201)
async def create_city(data: CreateCity,
                        city_service: CityService = Depends(get_city_service)):
    new_city = city_service.create_city(data)
    if new_city == Status.FAILED.value:
        raise HTTPException(status_code=400, detail={'status': Status.FAILED.value})
    return Status.SUCCESS.value

@router.get('/', status_code=200, response_model=list[CityResponse])
async def get_all_cities(name: str | None = Query(None), 
                        city_service: CityService = Depends(get_city_service)):
    filter = {k: v for k, v in locals().items() if v is not None and k != 'city_service'}
    cities = city_service.get_all_cities_filter_by(**filter)
    if not cities:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    response = [CityResponse(**city.__dict__) for city in cities]
    return response

@router.get('/{id}', status_code=200, response_model=CityResponse)
async def get_city(id: int, city_service: CityService = Depends(get_city_service)):
    city = city_service.get_one_city_filter_by(id=id)
    if not city:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    response = CityResponse(**city.__dict__)
    return response

@router.put('/{id}', status_code=200)
async def update_city(id: int, data: UpdateCity,
                          city_service: CityService = Depends(get_city_service)):
    city = city_service.get_one_city_filter_by(id=id)
    if not city:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    update_city = city_service.update_city(id, data)
    return {'status': Status.SUCCESS.value, 'city': update_city}

@router.delete('/{id}', status_code=200)
async def delete_city(id: int, city_service: CityService = Depends(get_city_service)):
    city = city_service.get_one_city_filter_by(id=id)
    if not city:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    city_service.delete_city(id)
    return {'status': Status.SUCCESS.value}

@router.patch('/{id}/image', status_code=200)
async def update_city_image(id: int, image: UploadFile = File(...),
                                city_service: CityService = Depends(get_city_service)):
    city = city_service.get_one_city_filter_by(id=id)
    if not city:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    upd_city = city_service.update_city(id, UpdateCity(image=image.filename))
    image_name = save_image(image)
    return {'status': Status.SUCCESS.value, 'image': image_name}
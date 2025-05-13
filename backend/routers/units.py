from fastapi import APIRouter, Depends, HTTPException, Query
from dependencies import *
from schemas.projects import UnitResponse, CreateUnit, UpdateUnit
from utils.enums import Status

router = APIRouter()

@router.post('/', status_code=201)
async def create_unit(data: CreateUnit,
                            project_service: ProjectService = Depends(get_project_service)):
    new_unit = project_service.create_unit(data)
    if new_unit == Status.FAILED.value:
        raise HTTPException(status_code=400, detail={'status': Status.FAILED.value})
    return Status.SUCCESS.value

@router.get('/', status_code=200, response_model=list[UnitResponse])
async def get_all_units(name: str | None = Query(None), 
                             full_name: str | None = Query(None),
                             project_service: ProjectService = Depends(get_project_service)):
    filter = {k: v for k, v in locals().items() if v is not None and k != 'project_service'}
    units = project_service.get_all_units_filter_by(**filter)
    if not units:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    response = [UnitResponse(**unit.__dict__) for unit in units]
    return response

@router.get('/{id}', status_code=200, response_model=UnitResponse)
async def get_unit(id: int, project_service: ProjectService = Depends(get_project_service)):
    unit = project_service.get_one_unit_filter_by(id=id)
    if not unit:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    response = UnitResponse(**unit.__dict__)
    return response

@router.put('/{id}', status_code=200)
async def update_unit(id: int, data: UpdateUnit,
                          project_service: ProjectService = Depends(get_project_service)):
    unit = project_service.get_one_unit_filter_by(id=id)
    if not unit:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    update_unit = project_service.update_unit(id, data)
    return {'status': Status.SUCCESS.value, 'unit': update_unit}

@router.delete('/{id}', status_code=200)
async def delete_unit(id: int, project_service: ProjectService = Depends(get_project_service)):
    unit = project_service.get_one_unit_filter_by(id=id)
    if not unit:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    project_service.delete_unit(id)
    return {'status': Status.SUCCESS.value}

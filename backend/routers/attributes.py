from fastapi import APIRouter, Depends, HTTPException, Query
from dependencies import *
from schemas.projects import AttributeResponse, CreateAttribute, UpdateAttribute
from utils.enums import Status

router = APIRouter()

@router.post('/', status_code=201)
async def create_attribute(data: CreateAttribute,
                            project_service: ProjectService = Depends(get_project_service)):
    new_attribute = project_service.create_attribute(data)
    if new_attribute == Status.FAILED.value:
        raise HTTPException(status_code=400, detail={'status': Status.FAILED.value})
    return Status.SUCCESS.value

@router.get('/', status_code=200, response_model=list[AttributeResponse])
async def get_all_attributes(name: str | None = Query(None), 
                             project_service: ProjectService = Depends(get_project_service)):
    filter = {k: v for k, v in locals().items() if v is not None and k != 'project_service'}
    attributes = project_service.get_all_attributes_filter_by(**filter)
    if not attributes:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    response = [AttributeResponse(**attribute.__dict__) for attribute in attributes]
    return response

@router.get('/{id}', status_code=200, response_model=AttributeResponse)
async def get_attribute(id: int, project_service: ProjectService = Depends(get_project_service)):
    attribute = project_service.get_one_attribute_filter_by(id=id)
    if not attribute:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    response = AttributeResponse(**attribute.__dict__)
    return response

@router.put('/{id}', status_code=200)
async def update_attribute(id: int, data: UpdateAttribute,
                          project_service: ProjectService = Depends(get_project_service)):
    attribute = project_service.get_one_attribute_filter_by(id=id)
    if not attribute:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    update_attribute = project_service.update_attribute(id, data)
    return update_attribute

@router.delete('/{id}', status_code=200)
async def delete_attribute(id: int, project_service: ProjectService = Depends(get_project_service)):
    attribute = project_service.get_one_attribute_filter_by(id=id)
    if not attribute:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    project_service.delete_attribute(id)
    return {'status': Status.SUCCESS.value}

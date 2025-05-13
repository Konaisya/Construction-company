from fastapi import APIRouter, Depends, HTTPException, Query, File, UploadFile
from dependencies import *
from schemas.projects import CategoryResponse, CreateCategory, UpdateCategory
from utils.enums import Status
from utils.image import save_image

router = APIRouter()

@router.post('/', status_code=201)
async def create_category(data: CreateCategory,
                            project_service: ProjectService = Depends(get_project_service)):
    new_category = project_service.create_category(data)
    if new_category == Status.FAILED.value:
        raise HTTPException(status_code=400, detail={'status': Status.FAILED.value})
    return Status.SUCCESS.value

@router.get('/', status_code=200, response_model=list[CategoryResponse])
async def get_all_categories(name: str | None = Query(None), 
                             project_service: ProjectService = Depends(get_project_service)):
    filter = {k: v for k, v in locals().items() if v is not None and k != 'project_service'}
    categories = project_service.get_all_categories_filter_by(**filter)
    if not categories:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    response = [CategoryResponse(**category.__dict__) for category in categories]
    return response

@router.get('/{id}', status_code=200, response_model=CategoryResponse)
async def get_category(id: int, project_service: ProjectService = Depends(get_project_service)):
    category = project_service.get_one_category_filter_by(id=id)
    if not category:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    response = CategoryResponse(**category.__dict__)
    return response

@router.put('/{id}', status_code=200)
async def update_category(id: int, data: UpdateCategory,
                          project_service: ProjectService = Depends(get_project_service)):
    category = project_service.get_one_category_filter_by(id=id)
    if not category:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    update_category = project_service.update_category(id, data)
    return {'status': Status.SUCCESS.value, 'category': update_category}

@router.delete('/{id}', status_code=200)
async def delete_category(id: int, project_service: ProjectService = Depends(get_project_service)):
    category = project_service.get_one_category_filter_by(id=id)
    if not category:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    project_service.delete_category(id)
    return {'status': Status.SUCCESS.value}

@router.patch('/{id}/image', status_code=200)
async def update_category_image(id: int, image: UploadFile = File(...),
                                project_service: ProjectService = Depends(get_project_service)):
    category = project_service.get_one_category_filter_by(id=id)
    if not category:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    upd_category = project_service.update_category(id, UpdateCategory(image=image.filename))
    image_name = save_image(image)
    return {'status': Status.SUCCESS.value, 'image': image_name}
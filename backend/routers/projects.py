from fastapi import APIRouter, Depends, HTTPException, Query, File, UploadFile, Body
from dependencies import *
from schemas.projects import *
from utils.enums import OrderStatus, Status, Roles
from service.projects import ProjectService
from utils.image import save_image, delete_image

router = APIRouter()

@router.post('/', status_code=201)
async def create_project(data: CreateProject,
                         project_service: ProjectService = Depends(get_project_service)):
    new_project = project_service.create_project(data)
    if new_project == Status.FAILED.value:
        raise HTTPException(status_code=400, detail={'status': Status.FAILED.value})
    return Status.SUCCESS.value

@router.get('/', status_code=200)
async def get_all_projects(name: str | None = Query(None),
                           slug: str | None = Query(None),
                           is_done: bool | None = Query(None),
                           id_category: int | None = Query(None),
                           id_city: int | None = Query(None),
                           id_attribute: int | None = Query(None),
                           attribute_value: str | None = Query(None),
                           project_service: ProjectService = Depends(get_project_service),
                           city_service: CityService = Depends(get_city_service)):
    filter = {k: v for k, v in locals().items() if v is not None 
              and k not in {'project_service', 'city_service', 'id_attribute', 'attribute_value'}}
    projects = project_service.get_all_projects_filter_by(**filter, id_attribute=id_attribute, attribute_value=attribute_value)
    if not projects:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    response = []
    for project in projects:
        category = project_service.get_one_category_filter_by(id=project.id_category)
        category_resp = CategoryResponse(**category.__dict__)

        city = city_service.get_one_city_filter_by(id=project.id_city)
        city_resp = CityResponse(**city.__dict__)

        images = project_service.get_all_project_images_filter_by(id_project=project.id)
        images_list = [ProjectImageResponse(**image.__dict__) for image in images]

        attribute_assoc = project_service.get_all_project_attributes_filter_by(id_project=project.id)
        attributes_list = []
        for attr_assoc in attribute_assoc:
            attribute = project_service.get_one_attribute_filter_by(id=attr_assoc.id_attribute)
            attribute_resp = AttributeResponse(**attribute.__dict__)

            unit = project_service.get_one_unit_filter_by(id=attr_assoc.id_unit) if attr_assoc.id_unit else None
            unit_resp = UnitResponse(**unit.__dict__) if unit else None

            attributes_list.append(ProjectAttributeResponse(
                attribute=attribute_resp,
                value=attr_assoc.value,
                unit=unit_resp
            ))
        project_data = project.__dict__
        project_data.update({
            'category': category_resp,
            'city': city_resp,
            'attributes': attributes_list,
            'images': images_list
        })
        response.append(ProjectResponse(**project_data))
    return response

@router.get('/{id}', status_code=200)
async def get_one_project(id: int,
                          project_service: ProjectService = Depends(get_project_service),
                          city_service: CityService = Depends(get_city_service)):
    project = project_service.get_one_project_filter_by(id=id)
    if not project:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    category = project_service.get_one_category_filter_by(id=project.id_category)
    category_resp = CategoryResponse(**category.__dict__)

    city = city_service.get_one_city_filter_by(id=project.id_city)
    city_resp = CityResponse(**city.__dict__)

    images = project_service.get_all_project_images_filter_by(id_project=project.id)
    images_list = [image.image for image in images]

    attribute_assoc = project_service.get_all_project_attributes_filter_by(id_project=project.id)
    attributes_list = []
    for attr_assoc in attribute_assoc:
        attribute = project_service.get_one_attribute_filter_by(id=attr_assoc.id_attribute)
        attribute_resp = AttributeResponse(**attribute.__dict__)

        unit = project_service.get_one_unit_filter_by(id=attr_assoc.id_unit) if attr_assoc.id_unit else None
        unit_resp = UnitResponse(**unit.__dict__) if unit else None

        attributes_list.append(ProjectAttributeResponse(
            attribute=attribute_resp,
            value=attr_assoc.value,
            unit=unit_resp
        ))
    project_data = project.__dict__
    project_data.update({
        'category': category_resp,
        'city': city_resp,
        'attributes': attributes_list,
        'images': images_list
    })
    return ProjectResponse(**project_data)
    
@router.put('/{id}', status_code=200)
async def update_project(id: int,
                          data: UpdateProject,
                          project_service: ProjectService = Depends(get_project_service)):
    project = project_service.get_one_project_filter_by(id=id)
    if not project:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    updated_project = project_service.update_project(id, data)
    if updated_project == Status.FAILED.value:
        raise HTTPException(status_code=400, detail={'status': Status.FAILED.value})
    return Status.SUCCESS.value

@router.delete('/{id}', status_code=200)
async def delete_project(id: int,
                          project_service: ProjectService = Depends(get_project_service)):
    project = project_service.get_one_project_filter_by(id=id)
    if not project:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    project_images = project_service.get_all_project_images_filter_by(id_project=id)
    delete_image(project.main_image)
    for image in project_images:
        delete_image(image.image)
    deleted_project = project_service.delete_project(id)
    return Status.SUCCESS.value

@router.patch('/{id}', status_code=200)
async def update_project_main_image(id: int,
                              main_image: UploadFile = File(...),
                              project_service: ProjectService = Depends(get_project_service)):
    project = project_service.get_one_project_filter_by(id=id)
    if not project:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    delete_image(project.main_image)
    project_service.update_project(id, UpdateProject(main_image=main_image.filename))
    save_image(main_image)
    return Status.SUCCESS.value

# Project Images
@router.post('/{id}/images', status_code=201)
async def add_project_images(id: int,
                             images: list[UploadFile] | None = File(None),
                             project_service: ProjectService = Depends(get_project_service)):
    project = project_service.get_one_project_filter_by(id=id)
    if not project:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    if images:
        for image in images:
            project_image = ProjectImageForm(id_project=id, image=image.filename)
            project_service.create_project_image(project_image)
            save_image(image)
    return Status.SUCCESS.value

@router.delete('/{id}/images', status_code=200)
async def delete_project_images(id: int,
                                images: ImageToDelete,
                                project_service: ProjectService = Depends(get_project_service)):
    project = project_service.get_one_project_filter_by(id=id)
    if not project:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    ids_images = images.ids_images
    if ids_images:
        for id_image in ids_images:
            image = project_service.get_one_project_image_filter_by(id=id_image)
            if not image or image.id_project != id:
                continue
            project_service.delete_project_image(id_image)
            delete_image(image.image)
    return Status.SUCCESS.value


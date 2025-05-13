from dependencies import ProjectRepository
from schemas.projects import *
from utils.enums import Status
from sqlalchemy.orm import joinedload
from models.projects import Project, ProjectAttribute

class ProjectService:
    def __init__(self, project_repository: ProjectRepository, 
                category_repository: ProjectRepository,
                unit_repository: ProjectRepository,
                attribute_repository: ProjectRepository,
                project_attribute_repository: ProjectRepository,
                project_image_repository: ProjectRepository):
        self.project_repository = project_repository
        self.category_repository = category_repository
        self.unit_repository = unit_repository
        self.attribute_repository = attribute_repository
        self.project_attribute_repository = project_attribute_repository
        self.project_image_repository = project_image_repository

    
    # Category
    def get_all_categories_filter_by(self, **filter):
        return self.category_repository.get_all_filter_by(**filter)
    
    def get_one_category_filter_by(self, **filter):
        return self.category_repository.get_one_filter_by(**filter)
    
    def create_category(self, new_category: CreateCategory):
        create_category = self.category_repository.add(new_category.model_dump())
        if not new_category:
            return Status.FAILED.value
        return create_category
    
    def update_category(self, id: int, upd_category: UpdateCategory):
        entity = upd_category.model_dump()
        entity['id'] = id
        entity = {k: v for k, v in entity.items() if v is not None}
        update_category = self.category_repository.update(entity)
        return update_category
    
    def delete_category(self, id: int):
        return self.category_repository.delete(id)
    
    
    # Unit 
    def get_all_units_filter_by(self, **filter):
        return self.unit_repository.get_all_filter_by(**filter)
    
    def get_one_unit_filter_by(self, **filter):
        return self.unit_repository.get_one_filter_by(**filter)
    
    def create_unit(self, new_unit: CreateUnit):
        create_unit = self.unit_repository.add(new_unit.model_dump())
        if not new_unit:
            return Status.FAILED.value
        return create_unit
    
    def update_unit(self, id: int, upd_unit: UpdateUnit):
        entity = upd_unit.model_dump()
        entity['id'] = id
        entity = {k: v for k, v in entity.items() if v is not None}
        update_unit = self.unit_repository.update(entity)
        return update_unit
    
    def delete_unit(self, id: int):
        return self.unit_repository.delete(id)
    

    # Attribute
    def get_all_attributes_filter_by(self, **filter):
        return self.attribute_repository.get_all_filter_by(**filter)
    
    def get_one_attribute_filter_by(self, **filter):
        return self.attribute_repository.get_one_filter_by(**filter)
    
    def create_attribute(self, new_attribute: CreateAttribute):
        create_attribute = self.attribute_repository.add(new_attribute.model_dump())
        if not new_attribute:
            return Status.FAILED.value
        return create_attribute
    
    def update_attribute(self, id: int, upd_attribute: UpdateAttribute):
        entity = upd_attribute.model_dump()
        entity['id'] = id
        entity = {k: v for k, v in entity.items() if v is not None}
        update_attribute = self.attribute_repository.update(entity)
        return update_attribute
    
    def delete_attribute(self, id: int):
        return self.attribute_repository.delete(id)
    

    # Project Attribute
    def get_all_project_attributes_filter_by(self, **filter):
        return self.project_attribute_repository.get_all_filter_by(**filter)
    
    def get_one_project_attribute_filter_by(self, **filter):
        return self.project_attribute_repository.get_one_filter_by(**filter)
    
    def create_project_attribute(self, new_project_attribute: ProjectAttributeForm):
        create_project_attribute = self.project_attribute_repository.add(new_project_attribute.model_dump())
        if not new_project_attribute:
            return Status.FAILED.value
        return create_project_attribute
    
    def update_project_attribute(self, id: int, upd_project_attribute: ProjectAttributeForm):
        entity = upd_project_attribute.model_dump()
        entity['id'] = id
        entity = {k: v for k, v in entity.items() if v is not None}
        update_project_attribute = self.project_attribute_repository.update(entity)
        return update_project_attribute
    
    def delete_project_attribute(self, id: int):
        return self.project_attribute_repository.delete(id)
    

    # Project Image
    def get_all_project_images_filter_by(self, **filter):
        return self.project_image_repository.get_all_filter_by(**filter)
    
    def get_one_project_image_filter_by(self, **filter):
        return self.project_image_repository.get_one_filter_by(**filter)
    
    def create_project_image(self, data: ProjectImageForm):
        create_project_image = self.project_image_repository.add(data.model_dump())
        if not data:
            return Status.FAILED.value
        return create_project_image
    
    def delete_project_image(self, id: int):
        return self.project_image_repository.delete(id)

    
    # Project
    def get_all_projects_filter_by(self, id_attribute: int, attribute_value: str, **filter):
        query = self.project_repository.get_all_filter_by(**filter).options(
            joinedload(Project.project_attribute).joinedload(ProjectAttribute.attribute),
            joinedload(Project.project_attribute).joinedload(ProjectAttribute.unit)
        )
        if id_attribute and attribute_value:
            query = query.join(ProjectAttribute).filter(
                ProjectAttribute.id_attribute == id_attribute,
                ProjectAttribute.value == attribute_value
            )
        projects = query.all()
        return projects
        
    def get_one_project_filter_by(self, **filter):
        return self.project_repository.get_one_filter_by(**filter)
    
    def create_project(self, new_project: CreateProject):
        new_project_dict = new_project.model_dump()
        attributes = new_project_dict.pop('attributes', []) or []
        images = new_project_dict.pop('images', []) or []

        create_project = self.project_repository.add(new_project_dict)
        if not new_project:
            return Status.FAILED.value
        
        if attributes:
            for attribute in attributes:
                attribute['id_project'] = create_project.id
                self.project_attribute_repository.add(attribute)
        return create_project
    
    def update_project(self, id: int, upd_project: UpdateProject):
        entity = upd_project.model_dump()
        entity['id'] = id

        attributes = entity.pop('attributes', []) or []
        images = entity.pop('images', []) or []

        entity = {k: v for k, v in entity.items() if v is not None}
        update_project = self.project_repository.update(entity)
        if not update_project:
            return Status.FAILED.value
        
        if attributes:
            existing_attributes = self.project_attribute_repository.get_all_filter_by(id_project=id)
            existing_attributes_dict = {attr.id_attribute: attr for attr in existing_attributes}
            for attribute in attributes:
                id_attribute = attribute['id_attribute']
                value = attribute['value']
                id_unit = attribute['id_unit']

                if id_attribute in existing_attributes_dict:
                    self.project_attribute_repository.update_by_filter(
                        {'id_project': id, 'id_attribute': id_attribute},
                        {'value': value, 'id_unit': id_unit})
                else:
                    attribute['id_project'] = id
                    self.project_attribute_repository.add(attribute)
        return update_project
    
    def delete_project(self, id: int):
        self.project_attribute_repository.delete_by_filter(id_project=id)
        self.project_image_repository.delete_by_filter(id_project=id)
        return self.project_repository.delete(id)

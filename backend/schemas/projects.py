from pydantic import BaseModel, Field, field_validator, EmailStr
import re
from typing import Optional, List
from .cities import CityResponse

class CategoryResponse(BaseModel):
    id: int
    name: str
    image: Optional[str] = None

class CreateCategory(BaseModel):
    name: str
    image: Optional[str] = None

class UpdateCategory(BaseModel):
    name: Optional[str] = None
    image: Optional[str] = None


class UnitResponse(BaseModel):
    id: int
    name: str
    full_name: Optional[str] = None

class CreateUnit(BaseModel):
    name: str
    full_name: Optional[str] = None

class UpdateUnit(BaseModel):
    name: Optional[str] = None
    full_name: Optional[str] = None


class AttributeResponse(BaseModel):
    id: int
    name: str

class CreateAttribute(BaseModel):
    name: str

class UpdateAttribute(BaseModel):
    name: Optional[str] = None


class ProjectAttributeResponse(BaseModel):
    attribute: AttributeResponse
    value: str
    unit: Optional[UnitResponse] = None

class ProjectAttributeForm(BaseModel):
    id_attribute: int
    value: str
    id_unit: Optional[int] = None


class ProjectImageResponse(BaseModel):
    id: int
    image: str

class ProjectImageForm(BaseModel):
    id_project: int
    image: str

class ImageToDelete(BaseModel):
    ids_images: List[int]


class ProjectResponse(BaseModel):
    id: int
    name: str
    main_image: str
    slug: str
    description: str
    is_done: bool
    category: CategoryResponse
    city: CityResponse
    attributes: List[ProjectAttributeResponse]
    images: List[ProjectImageResponse]

class CreateProject(BaseModel):
    name: str
    slug: str
    description: str
    is_done: bool
    id_category: int
    id_city: int
    attributes: List[ProjectAttributeForm]

class UpdateProject(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    main_image: Optional[str] = None
    description: Optional[str] = None
    is_done: Optional[bool] = None
    id_category: Optional[int] = None
    id_city: Optional[int] = None
    attributes: Optional[List[ProjectAttributeForm]] = None
    images: Optional[List[str]] = None

class ShortProjectResponse(BaseModel):
    id: int
    name: str
    slug: str
    main_image: str
    description: str
    is_done: bool

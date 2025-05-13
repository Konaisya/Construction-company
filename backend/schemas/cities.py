from pydantic import BaseModel, Field, field_validator, EmailStr
from typing import Optional, List
from datetime import date

class CityResponse(BaseModel):
    id: int
    name: str
    image: str
    
class CreateCity(BaseModel):
    name: str
    image: Optional[str] = None

class UpdateCity(BaseModel):
    name: Optional[str] = None
    image: Optional[str] = None
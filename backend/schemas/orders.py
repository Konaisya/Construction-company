from pydantic import BaseModel, Field, field_validator, EmailStr
from typing import Optional, List
from datetime import date
from schemas.users import UserResponse
from schemas.projects import ShortProjectResponse
from utils.enums import OrderStatus

class OrderResponse(BaseModel):
    id: int
    user: UserResponse
    project: ShortProjectResponse
    status: OrderStatus
    created_date: date
    updated_date: Optional[date] = None
    start_price: Optional[float] = None
    final_price: Optional[float] = None
    payment_date: Optional[date] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class CreateOrder(BaseModel):
    id_project: int

class UpdateOrder(BaseModel):
    status: Optional[OrderStatus] = None
    start_price: Optional[float] = None
    final_price: Optional[float] = None
    payment_date: Optional[date] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
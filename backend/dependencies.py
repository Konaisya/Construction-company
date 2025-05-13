from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from models import *
from crud import *
from service.projects import ProjectService
from service.orders import OrderService
from service.cities import CityService
from config.database import get_session
from config.auth import oauth2_scheme
from utils.enums import Roles, AuthStatus
from service.auth import AuthService
from service.users import UserService


# User and Auth
def get_user_repository(db: Session = Depends(get_session)):
    return UserRepository(model=User, session=db)

def get_auth_service(user_repository: UserRepository = Depends(get_user_repository)) -> AuthService:
    return AuthService(user_repository=user_repository)

def get_current_user(token: str=Depends(oauth2_scheme), user_repository: UserRepository = Depends(get_user_repository)) -> User:
    service = AuthService(user_repository=user_repository)
    return service.get_user_by_token(token)

def get_current_admin(token: str=Depends(oauth2_scheme), user_repository: UserRepository = Depends(get_user_repository)) -> User:
    service = AuthService(user_repository=user_repository)
    user = service.get_user_by_token(token)
    if user.role != Roles.ADMIN.value:
        raise HTTPException(status_code=403, detail={'status': AuthStatus.FORBIDDEN.value})
    return user

def get_user_service(user_repository: UserRepository = Depends(get_user_repository)) -> UserService:
    return UserService(user_repository=user_repository)


# Order
def get_order_repository(db: Session = Depends(get_session)):
    return OrderRepository(model=Order, session=db)

def get_order_service(order_repository: OrderRepository = Depends(get_order_repository)) -> OrderService:
    return OrderService(order_repository=order_repository)


# Project
def get_project_repository(db: Session = Depends(get_session)):
    return ProjectRepository(model=Project, session=db)

def get_category_repository(db: Session = Depends(get_session)):
    return ProjectRepository(model=Category, session=db)

def get_unit_repository(db: Session = Depends(get_session)):
    return ProjectRepository(model=Unit, session=db)

def get_attribute_repository(db: Session = Depends(get_session)):
    return ProjectRepository(model=Attribute, session=db)

def get_project_attribute_repository(db: Session = Depends(get_session)):
    return ProjectRepository(model=ProjectAttribute, session=db)

def get_project_image_repository(db: Session = Depends(get_session)):
    return ProjectRepository(model=ProjectImage, session=db)

def get_project_service(project_repository: ProjectRepository = Depends(get_project_repository),
                        category_repository: ProjectRepository = Depends(get_category_repository),
                        unit_repository: ProjectRepository = Depends(get_unit_repository),
                        attribute_repository: ProjectRepository = Depends(get_attribute_repository),
                        project_attribute_repository: ProjectRepository = Depends(get_project_attribute_repository),
                        project_image_repository: ProjectRepository = Depends(get_project_image_repository)) -> ProjectService:
    return ProjectService(project_repository=project_repository,
                          category_repository=category_repository,
                          unit_repository=unit_repository,
                          attribute_repository=attribute_repository,
                          project_attribute_repository=project_attribute_repository,
                          project_image_repository=project_image_repository)


# City
def get_city_repository(db: Session = Depends(get_session)):
    return CityRepository(model=City, session=db)

def get_city_service(city_repository: CityRepository = Depends(get_city_repository)) -> CityService:
    return CityService(city_repository=city_repository)

from fastapi import APIRouter
from routers.users import router as user_router
from routers.auth import router as auth_router
from routers.attributes import router as attribute_router
from routers.category import router as category_router
from routers.projects import router as product_router
from routers.cities import router as cities_router
from routers.units import router as unit_router
from routers.orders import router as order_router

routers = APIRouter(prefix='/api')
routers.include_router(auth_router, prefix='/auth', tags=['auth'])
routers.include_router(user_router, prefix='/users', tags=['users'])
routers.include_router(attribute_router, prefix='/attributes', tags=['attributes'])
routers.include_router(category_router, prefix='/categories', tags=['categories'])
routers.include_router(product_router, prefix='/products', tags=['products'])
routers.include_router(cities_router, prefix='/cities', tags=['cities'])
routers.include_router(unit_router, prefix='/units', tags=['units'])
routers.include_router(order_router, prefix='/orders', tags=['orders'])
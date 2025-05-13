from fastapi import APIRouter, Depends, HTTPException, Query
from dependencies import *
from schemas.orders import *
from schemas.users import UserResponse
from utils.enums import OrderStatus, Status, Roles
from datetime import datetime
from service.orders import OrderService
from schemas.projects import UpdateProject

router = APIRouter()

@router.post('/', status_code=201)
async def create_order(data: CreateOrder,
                       order_service: OrderService = Depends(get_order_service),
                       user = Depends(get_current_user)):
    data_dict = data.model_dump()
    data_dict['id_user'] = user.id
    data_dict['status'] = OrderStatus.PENDING.value
    data_dict['created_date'] = datetime.now().strftime('%Y-%m-%d')
    new_order = order_service.create_order(data_dict)
    if new_order == Status.FAILED.value:
        raise HTTPException(status_code=400, detail={'status': Status.FAILED.value})
    return {'status': Status.SUCCESS.value, 'id order': new_order.id}

@router.get('/', status_code=200)
async def get_all_orders(id_user: int | None = Query(None),
                         id_project: int | None = Query(None),
                         status: OrderStatus | None = Query(None),
                         created_date: str | None = Query(None),
                         updated_date: str | None = Query(None),
                         start_price: float | None = Query(None),
                         final_price: float | None = Query(None),
                         payment_date: str | None = Query(None),
                         start_date: str | None = Query(None),
                         end_date: str | None = Query(None),
                         order_service: OrderService = Depends(get_order_service),
                         project_service: ProjectService = Depends(get_project_service),
                         user_service: UserService = Depends(get_user_service),
                         user = Depends(get_current_user)):
    if user.role == Roles.ADMIN.value:
        filter = {k: v for k, v in locals().items() if v is not None and k 
                not in {'order_service', 'project_service', 'user_service', 'user'}}
    else:
        filter = {k: v for k, v in locals().items() if v is not None and k 
                not in {'order_service', 'project_service', 'user_service', 'user'}}
        filter['id_user'] = user.id
    orders = order_service.get_all_orders_filter_by(**filter)
    if not orders:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    response = []
    for order in orders:
        user = user_service.get_user_filter_by(id=order.id_user)
        user_resp = UserResponse(**user.__dict__)

        project = project_service.get_one_project_filter_by(id=order.id_project)
        project_resp = ShortProjectResponse(**project.__dict__)

        order_data = order.__dict__
        order_data.update({
            'user': user_resp,
            'project': project_resp
        })
        response.append(OrderResponse(**order_data))
    return response

@router.get('/{id}', status_code=200)
async def get_order(id: int,
                    order_service: OrderService = Depends(get_order_service),
                    project_service: ProjectService = Depends(get_project_service),
                    user_service: UserService = Depends(get_user_service),
                    user = Depends(get_current_user)):
    order = order_service.get_one_order_filter_by(id=id)
    if not order:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    user = user_service.get_user_filter_by(id=order.id_user)
    user_resp = UserResponse(**user.__dict__)

    project = project_service.get_one_project_filter_by(id=order.id_project)
    project_resp = ShortProjectResponse(**project.__dict__)

    order_data = order.__dict__
    order_data.update({
        'user': user_resp,
        'project': project_resp
    })
    return OrderResponse(**order_data)

@router.put('/{id}', status_code=200)
async def update_order(id: int,
                       data: UpdateOrder,
                       order_service: OrderService = Depends(get_order_service),
                       project_service: ProjectService = Depends(get_project_service),
                       user = Depends(get_current_user)):
    order = order_service.get_one_order_filter_by(id=id)
    if not order:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    data_dict = data.dict()
    data_dict['updated_date'] = datetime.now().strftime('%Y-%m-%d')

    if 'status' in data.dict(exclude_unset=True):
        new_status = data.status
        if new_status == OrderStatus.IN_PROGRESS.value and order.start_date is None:
            data_dict['start_date'] = datetime.now().strftime('%Y-%m-%d')
        elif new_status == OrderStatus.COMPLETED.value and order.end_date is None:
            data_dict['end_date'] = datetime.now().strftime('%Y-%m-%d')
            project_service.update_project(order.id_project, UpdateProject(is_done=True))
        elif new_status == OrderStatus.PAID.value and order.payment_date is None:
            data_dict['payment_date'] = datetime.now().strftime('%Y-%m-%d')
        
    if (
        'final_price' in data.dict(exclude_unset=True) 
        and (
            data.final_price < 0 
            or data.start_price < 0
            )
        ):
        raise HTTPException(status_code=400, detail={'status': Status.FAILED.value})
    
    data_unset = data.dict(exclude_unset=True)
    for date_field in ['start_date', 'end_date', 'payment_date']:
        if date_field in data_unset:
            if getattr(data, date_field) > datetime.now().strftime('%Y-%m-%d'):
                raise HTTPException(status_code=400, detail={'status': Status.FAILED.value})
    
    if 'start_date' in data_unset and 'end_date' in data_unset:
        if data.start_date > data.end_date:
            raise HTTPException(status_code=400, detail={'status': Status.FAILED.value})
            
    updated_order = order_service.update_order(id, data_dict)
    if updated_order == Status.FAILED.value:
        raise HTTPException(status_code=400, detail={'status': Status.FAILED.value})
    return {'status': Status.SUCCESS.value}

@router.delete('/{id}', status_code=200)
async def delete_order(id: int,
                       order_service: OrderService = Depends(get_order_service),
                       user = Depends(get_current_user)):
    order = order_service.get_one_order_filter_by(id=id)
    if not order:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    deleted_order = order_service.delete_order(id)
    return {'status': Status.SUCCESS.value}
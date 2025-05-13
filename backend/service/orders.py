from dependencies import OrderRepository
from schemas.orders import CreateOrder, UpdateOrder
from schemas.projects import *
from utils.enums import Status, OrderStatus

class OrderService:
    def __init__(self, order_repository: OrderRepository):
        self.order_repository = order_repository

    # Order
    def get_all_orders_filter_by(self, **filter):
        return self.order_repository.get_all_filter_by(**filter)
    
    def get_one_order_filter_by(self, **filter):
        return self.order_repository.get_one_filter_by(**filter)
    
    def create_order(self, new_order: dict):
        create_order = self.order_repository.add(new_order)
        if not create_order:
            return Status.FAILED.value
        return create_order
    
    def update_order(self, id: int, entity: dict):
        entity['id'] = id
        entity = {k: v for k, v in entity.items() if v is not None}
        return self.order_repository.update(entity)
    
    def delete_order(self, id: int):
        return self.order_repository.delete(id)


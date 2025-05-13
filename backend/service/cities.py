from dependencies import CityRepository
from schemas.cities import *
from utils.enums import Status
from sqlalchemy.orm import joinedload

class CityService:
    def __init__(self, city_repository: CityRepository):
        self.city_repository = city_repository

    def get_all_cities_filter_by(self, **filter):
        return self.city_repository.get_all_filter_by(**filter)

    def get_one_city_filter_by(self, **filter):
        return self.city_repository.get_one_filter_by(**filter)

    def create_city(self, new_city: CreateCity):
        new_city_dict = new_city.model_dump()
        create_city = self.city_repository.add(new_city_dict)
        if not new_city:
            return Status.FAILED.value
        return create_city

    def update_city(self, id: int, upd_city: UpdateCity):
        entity = upd_city.model_dump()
        entity['id'] = id
        entity = {k: v for k, v in entity.items() if v is not None}
        update_city = self.city_repository.update(entity)
        return update_city

    def delete_city(self, id: int):
        return self.city_repository.delete(id)

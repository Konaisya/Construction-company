from config.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String

class City(Base):
    __tablename__ = 'cities'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255))

    project: Mapped['Project'] = relationship('Project', back_populates='city')

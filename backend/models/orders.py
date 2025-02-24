from config.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, DECIMAL, ForeignKey
from datetime import datetime

class Order(Base):
    __tablename__ = 'orders'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_user: Mapped[int] = mapped_column(ForeignKey("users.id"))
    id_project: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    status: Mapped[str] = mapped_column(String(255))
    price: Mapped[float] = mapped_column(DECIMAL(10, 2))
    begin_date: Mapped[str] = mapped_column(String(255), default=datetime.now().date())
    end_date: Mapped[str] = mapped_column(String(255))

    user: Mapped["User"] = relationship("User", back_populates="order")
    project: Mapped["Project"] = relationship("Project", back_populates="order")
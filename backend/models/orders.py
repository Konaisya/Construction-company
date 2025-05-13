from config.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, DECIMAL, ForeignKey, DATE
from datetime import datetime

class Order(Base):
    __tablename__ = 'orders'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_user: Mapped[int] = mapped_column(ForeignKey("users.id"))
    id_project: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    status: Mapped[str] = mapped_column(String(255))
    created_date: Mapped[datetime] = mapped_column(DATE)
    updated_date: Mapped[datetime] = mapped_column(DATE, nullable=True)
    start_price: Mapped[DECIMAL] = mapped_column(DECIMAL(10, 2), nullable=True)
    final_price: Mapped[DECIMAL] = mapped_column(DECIMAL(10, 2), nullable=True)
    payment_date: Mapped[datetime] = mapped_column(DATE, nullable=True)
    start_date: Mapped[datetime] = mapped_column(DATE, nullable=True)
    end_date: Mapped[datetime] = mapped_column(DATE, nullable=True)

    user: Mapped["User"] = relationship("User", back_populates="order")
    project: Mapped["Project"] = relationship("Project", back_populates="order")

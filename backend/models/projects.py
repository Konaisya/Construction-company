from config.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Text, DECIMAL, ForeignKey, Boolean, DATE
from datetime import datetime

class Category(Base):
    __tablename__ = 'category'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255))
    image: Mapped[str] = mapped_column(String(255), default="placeholder.png")

    project: Mapped[list["Project"]] = relationship("Project", back_populates="category")


class Project(Base):
    __tablename__ = 'projects'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255))
    slug: Mapped[str] = mapped_column(String(255))
    main_image: Mapped[str] = mapped_column(String(255), default="placeholder.png")
    description: Mapped[str] = mapped_column(Text)
    is_done: Mapped[bool] = mapped_column(Boolean, default=False)
    id_category: Mapped[int] = mapped_column(ForeignKey('category.id'))
    id_city: Mapped[int] = mapped_column(ForeignKey('cities.id'))

    order: Mapped["Order"] = relationship("Order", back_populates="project")
    category: Mapped["Category"] = relationship("Category", back_populates="project")
    project_attribute: Mapped[list["ProjectAttribute"]] = relationship("ProjectAttribute", back_populates="project")
    project_image: Mapped[list["ProjectImage"]] = relationship("ProjectImage", back_populates="project")
    city: Mapped["City"] = relationship("City", back_populates="project")

class ProjectImage(Base):
    __tablename__ = 'projects_images'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_project: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    image: Mapped[str] = mapped_column(String(255))

    project: Mapped["Project"] = relationship("Project", back_populates="project_image")


class Unit(Base):
    __tablename__ = "units"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255))
    full_name: Mapped[str] = mapped_column(String(255), nullable=True)

    project_attribute: Mapped[list["ProjectAttribute"]] = relationship("ProjectAttribute", back_populates="unit")


class Attribute(Base):
    __tablename__ = "attributes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255))

    project_attribute: Mapped[list["ProjectAttribute"]] = relationship("ProjectAttribute", back_populates="attribute")

class ProjectAttribute(Base):
    __tablename__ = "projects_attributes"

    id_project: Mapped[int] = mapped_column(ForeignKey("projects.id"), primary_key=True)
    id_attribute: Mapped[int] = mapped_column(ForeignKey("attributes.id"), primary_key=True)
    value: Mapped[str] = mapped_column(String(255)) # Строка, если надо конвертируй в нужный тип
    id_unit: Mapped[int] = mapped_column(ForeignKey("units.id"), nullable=True)

    unit: Mapped["Unit"] = relationship("Unit", back_populates="project_attribute")
    project: Mapped["Project"] = relationship("Project", back_populates="project_attribute")
    attribute: Mapped["Attribute"] = relationship("Attribute", back_populates="project_attribute")

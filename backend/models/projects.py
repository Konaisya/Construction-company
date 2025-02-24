from config.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, ForeignKey, TEXT

class Category(Base):
    __tablename__ = 'category'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255))

    project: Mapped['Project'] = relationship('Project', back_populates='category')
    category_image: Mapped['CategoryImage'] = relationship('CategoryImage', back_populates='category')

class CategoryImage(Base):
    __tablename__ = 'category_images'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    image: Mapped[str] = mapped_column(String(255))
    id_category: Mapped[int] = mapped_column(ForeignKey("category.id"))

    category: Mapped['Category'] = relationship('Category', back_populates='category_image')


class Project(Base):
    __tablename__ = 'projects'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(TEXT)
    id_category: Mapped[int] = mapped_column(ForeignKey('category.id'))
    status: Mapped[str] = mapped_column(String(255))
    address: Mapped[str] = mapped_column(String(255), nullable=True)
    id_city: Mapped[int] = mapped_column(ForeignKey('cities.id'))

    category: Mapped['Category'] = relationship('Category', back_populates='project')
    order: Mapped['Order'] = relationship('Order', back_populates='project')
    project_image: Mapped['ProjectImage'] = relationship('ProjectImage', back_populates='project')
    city: Mapped['City'] = relationship('City', back_populates='project')
    attribute: Mapped['Attribute'] = relationship('Attribute', back_populates='project')

class ProjectImage(Base):
    __tablename__ = 'project_images'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    image: Mapped[str] = mapped_column(String(255))
    id_project: Mapped[int] = mapped_column(ForeignKey("projects.id"))

    project: Mapped['Project'] = relationship('Project', back_populates='project_image')


class Attribute(Base):
    __tablename__ = 'attributes'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255))
    value: Mapped[str] = mapped_column(String(255))
    id_project: Mapped[int] = mapped_column(ForeignKey("projects.id"))

    project: Mapped['Project'] = relationship('Project', back_populates='attribute')


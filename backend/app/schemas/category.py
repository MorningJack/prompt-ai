"""
分类相关的数据模式
"""
from typing import Optional, List
from pydantic import BaseModel


class CategoryBase(BaseModel):
    """分类基础模式"""
    name: str
    description: Optional[str] = None
    parent_id: Optional[int] = None
    sort_order: int = 0
    icon: Optional[str] = None


class CategoryCreate(CategoryBase):
    """分类创建模式"""
    is_active: bool = True


class CategoryUpdate(BaseModel):
    """分类更新模式"""
    name: Optional[str] = None
    description: Optional[str] = None
    parent_id: Optional[int] = None
    sort_order: Optional[int] = None
    icon: Optional[str] = None
    is_active: Optional[bool] = None


class CategoryInDBBase(CategoryBase):
    """数据库中的分类基础模式"""
    id: int
    is_active: bool

    class Config:
        from_attributes = True


class Category(CategoryInDBBase):
    """分类响应模式"""
    children: Optional[List['Category']] = []


class CategoryInDB(CategoryInDBBase):
    """数据库中的分类模式"""
    pass


# 更新前向引用
Category.model_rebuild() 
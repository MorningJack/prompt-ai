"""
分类数据模型
"""
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from ..core.database import Base


class Category(Base):
    """分类模型"""
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True, comment="分类名称")
    description = Column(Text, comment="分类描述")
    parent_id = Column(Integer, ForeignKey("categories.id"), comment="父分类ID")
    sort_order = Column(Integer, default=0, comment="排序")
    icon = Column(String(50), comment="图标")
    is_active = Column(Boolean, default=True, comment="是否启用")
    
    # 自关联关系
    parent = relationship("Category", remote_side=[id], back_populates="children")
    children = relationship("Category", back_populates="parent", cascade="all, delete-orphan")
    
    # 关联关系
    prompts = relationship("Prompt", back_populates="category")

    def __repr__(self):
        return f"<Category(id={self.id}, name='{self.name}')>" 
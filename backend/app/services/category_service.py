"""
分类服务
"""
from typing import Optional, List
from sqlalchemy.orm import Session
from ..models.category import Category
from ..models.prompt import Prompt
from ..schemas.category import CategoryCreate, CategoryUpdate


class CategoryService:
    def __init__(self, db: Session):
        self.db = db

    def get(self, category_id: int) -> Optional[Category]:
        """获取分类"""
        return self.db.query(Category).filter(Category.id == category_id).first()

    def get_list(self, parent_id: Optional[int] = None, include_inactive: bool = False) -> List[Category]:
        """获取分类列表"""
        query = self.db.query(Category)
        
        if parent_id is not None:
            query = query.filter(Category.parent_id == parent_id)
        else:
            query = query.filter(Category.parent_id.is_(None))
        
        if not include_inactive:
            query = query.filter(Category.is_active == True)
        
        return query.order_by(Category.sort_order, Category.name).all()

    def get_tree(self, include_inactive: bool = False) -> List[Category]:
        """获取分类树"""
        # 简化实现：只返回顶级分类
        return self.get_list(parent_id=None, include_inactive=include_inactive)

    def create(self, category_create: CategoryCreate) -> Category:
        """创建分类"""
        db_category = Category(**category_create.model_dump())
        self.db.add(db_category)
        self.db.commit()
        self.db.refresh(db_category)
        return db_category

    def update(self, category_id: int, category_update: CategoryUpdate) -> Optional[Category]:
        """更新分类"""
        db_category = self.get(category_id)
        if not db_category:
            return None
        
        update_data = category_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_category, field, value)
        
        self.db.commit()
        self.db.refresh(db_category)
        return db_category

    def delete(self, category_id: int) -> bool:
        """删除分类"""
        db_category = self.get(category_id)
        if not db_category:
            return False
        
        self.db.delete(db_category)
        self.db.commit()
        return True

    def has_children(self, category_id: int) -> bool:
        """检查是否有子分类"""
        count = self.db.query(Category).filter(Category.parent_id == category_id).count()
        return count > 0

    def has_prompts(self, category_id: int) -> bool:
        """检查是否有关联的提示词"""
        count = self.db.query(Prompt).filter(Prompt.category_id == category_id).count()
        return count > 0 
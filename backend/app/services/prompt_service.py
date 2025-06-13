"""
提示词服务
"""
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from ..models.prompt import Prompt
from ..models.category import Category
from ..schemas.prompt import PromptCreate, PromptUpdate, PromptList


class PromptService:
    def __init__(self, db: Session):
        self.db = db

    def get(self, prompt_id: int) -> Optional[Prompt]:
        """获取提示词"""
        return self.db.query(Prompt).filter(Prompt.id == prompt_id).first()

    def get_list(self, page: int = 1, size: int = 20, **filters) -> PromptList:
        """获取提示词列表"""
        query = self.db.query(Prompt)
        
        # 应用筛选条件
        if filters.get("category_id"):
            query = query.filter(Prompt.category_id == filters["category_id"])
        
        if filters.get("is_public") is not None:
            query = query.filter(Prompt.is_public == filters["is_public"])
        
        if filters.get("is_featured"):
            query = query.filter(Prompt.is_featured == True)
        
        if filters.get("search"):
            search_term = f"%{filters['search']}%"
            query = query.filter(
                or_(
                    Prompt.name_zh.ilike(search_term),
                    Prompt.name_en.ilike(search_term),
                    Prompt.description.ilike(search_term)
                )
            )
        
        # 处理用户权限
        if filters.get("current_user_id"):
            current_user_id = filters["current_user_id"]
            query = query.filter(
                or_(
                    Prompt.is_public == True,
                    Prompt.author_id == current_user_id
                )
            )
        else:
            query = query.filter(Prompt.is_public == True)
        
        # 计算总数
        total = query.count()
        
        # 分页
        offset = (page - 1) * size
        items = query.offset(offset).limit(size).all()
        
        return PromptList(
            items=items,
            total=total,
            page=page,
            size=size,
            pages=(total + size - 1) // size
        )

    def create(self, prompt_create: PromptCreate, author_id: int) -> Prompt:
        """创建提示词"""
        db_prompt = Prompt(
            **prompt_create.model_dump(),
            author_id=author_id
        )
        self.db.add(db_prompt)
        self.db.commit()
        self.db.refresh(db_prompt)
        return db_prompt

    def update(self, prompt_id: int, prompt_update: PromptUpdate) -> Optional[Prompt]:
        """更新提示词"""
        db_prompt = self.get(prompt_id)
        if not db_prompt:
            return None
        
        update_data = prompt_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_prompt, field, value)
        
        self.db.commit()
        self.db.refresh(db_prompt)
        return db_prompt

    def delete(self, prompt_id: int) -> bool:
        """删除提示词"""
        db_prompt = self.get(prompt_id)
        if not db_prompt:
            return False
        
        self.db.delete(db_prompt)
        self.db.commit()
        return True

    def category_exists(self, category_id: int) -> bool:
        """检查分类是否存在"""
        return self.db.query(Category).filter(Category.id == category_id).first() is not None

    def increment_usage_count(self, prompt_id: int) -> None:
        """增加使用次数"""
        self.db.query(Prompt).filter(Prompt.id == prompt_id).update(
            {Prompt.usage_count: Prompt.usage_count + 1}
        )
        self.db.commit()

    def get_prompts_by_user(self, user_id: int, skip: int = 0, limit: int = 100):
        """获取指定用户的所有提示词"""
        return self.db.query(Prompt).filter(
            Prompt.author_id == user_id
        ).offset(skip).limit(limit).all() 
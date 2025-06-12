"""
提示词相关的数据模式
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class PromptBase(BaseModel):
    """提示词基础模式"""
    name_zh: str
    name_en: Optional[str] = None
    aliases: Optional[List[str]] = []
    description: Optional[str] = None
    content: str
    example_input: Optional[str] = None
    example_output: Optional[str] = None
    usage_tips: Optional[str] = None
    category_id: int
    tags: Optional[List[str]] = []
    supported_models: Optional[List[str]] = []
    model_types: Optional[List[str]] = []
    use_cases: Optional[List[str]] = []


class PromptCreate(PromptBase):
    """提示词创建模式"""
    is_public: bool = False


class PromptUpdate(BaseModel):
    """提示词更新模式"""
    name_zh: Optional[str] = None
    name_en: Optional[str] = None
    aliases: Optional[List[str]] = None
    description: Optional[str] = None
    content: Optional[str] = None
    example_input: Optional[str] = None
    example_output: Optional[str] = None
    usage_tips: Optional[str] = None
    category_id: Optional[int] = None
    tags: Optional[List[str]] = None
    supported_models: Optional[List[str]] = None
    model_types: Optional[List[str]] = None
    use_cases: Optional[List[str]] = None
    is_public: Optional[bool] = None
    status: Optional[str] = None


class PromptInDBBase(PromptBase):
    """数据库中的提示词基础模式"""
    id: int
    is_public: bool
    is_featured: bool
    status: str
    rating_avg: float
    rating_count: int
    usage_count: int
    author_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Prompt(PromptInDBBase):
    """提示词响应模式"""
    pass


class PromptInDB(PromptInDBBase):
    """数据库中的提示词模式"""
    pass


class PromptList(BaseModel):
    """提示词列表响应模式"""
    items: List[Prompt]
    total: int
    page: int
    size: int
    pages: int 
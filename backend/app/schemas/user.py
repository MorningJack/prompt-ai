"""
用户相关的数据模式
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class UserBase(BaseModel):
    """用户基础模式"""
    username: str
    email: str  # 临时改为str，避免email-validator依赖问题
    full_name: Optional[str] = None


class UserCreate(UserBase):
    """用户创建模式"""
    password: str


class UserUpdate(BaseModel):
    """用户更新模式"""
    username: Optional[str] = None
    email: Optional[str] = None  # 临时改为str，避免email-validator依赖问题
    full_name: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    avatar_url: Optional[str] = None


class UserInDBBase(UserBase):
    """数据库中的用户基础模式"""
    id: int
    bio: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: bool
    is_premium: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class User(UserInDBBase):
    """用户响应模式"""
    pass


class UserInDB(UserInDBBase):
    """数据库中的用户模式（包含敏感信息）"""
    password_hash: str


class Token(BaseModel):
    """访问令牌模式"""
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """令牌数据模式"""
    username: Optional[str] = None 
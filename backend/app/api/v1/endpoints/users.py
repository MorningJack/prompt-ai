"""
用户相关的API端点
"""
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ....core.database import get_db
from ....schemas.user import User, UserUpdate
from ....services.user_service import UserService
from ....api.deps import get_current_user

router = APIRouter()


@router.get("/me", response_model=User, summary="获取当前用户信息")
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    获取当前登录用户的信息
    """
    return current_user


@router.put("/me", response_model=User, summary="更新当前用户信息")
async def update_current_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    更新当前登录用户的信息
    
    - **username**: 新用户名（可选）
    - **email**: 新邮箱地址（可选）
    - **avatar_url**: 新头像URL（可选）
    """
    user_service = UserService(db)
    
    # 检查用户名是否已被其他用户使用
    if user_update.username:
        existing_user = user_service.get_by_username(user_update.username)
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="用户名已被使用"
            )
    
    # 检查邮箱是否已被其他用户使用
    if user_update.email:
        existing_user = user_service.get_by_email(user_update.email)
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="邮箱已被使用"
            )
    
    # 更新用户信息
    updated_user = user_service.update(current_user.id, user_update)
    return updated_user


@router.get("/{user_id}", response_model=User, summary="获取指定用户信息")
async def get_user(
    user_id: int,
    db: Session = Depends(get_db)
) -> Any:
    """
    获取指定用户的公开信息
    """
    user_service = UserService(db)
    user = user_service.get(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    
    return user 
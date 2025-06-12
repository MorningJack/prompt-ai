"""
API依赖注入
"""
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from ..core.config import settings
from ..core.database import get_db
from ..schemas.user import TokenData, User
from ..services.user_service import UserService

# OAuth2 密码流
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login",
    auto_error=False
)

# 必须登录的依赖
oauth2_scheme_required = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login"
)


async def get_current_user_optional(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    获取当前用户（可选）
    如果token无效或不存在，返回None
    """
    if not token:
        return None
    
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
        token_data = TokenData(username=user_id)
    except JWTError:
        return None
    
    user_service = UserService(db)
    user = user_service.get(int(token_data.username))
    return user


async def get_current_user(
    token: str = Depends(oauth2_scheme_required),
    db: Session = Depends(get_db)
) -> User:
    """
    获取当前用户（必须）
    如果token无效或不存在，抛出异常
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="无法验证身份信息",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        token_data = TokenData(username=user_id)
    except JWTError:
        raise credentials_exception
    
    user_service = UserService(db)
    user = user_service.get(int(token_data.username))
    if user is None:
        raise credentials_exception
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="用户账户已被禁用"
        )
    
    return user


async def get_current_active_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    获取当前活跃的超级用户
    """
    if not current_user.is_premium:  # 这里可以改为is_superuser字段
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="权限不足"
        )
    return current_user 
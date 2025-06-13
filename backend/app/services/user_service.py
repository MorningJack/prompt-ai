"""
用户服务
"""
from typing import Optional
from sqlalchemy.orm import Session
from ..core.security import get_password_hash, verify_password
from ..models.user import User
from ..schemas.user import UserCreate, UserUpdate


class UserService:
    def __init__(self, db: Session):
        self.db = db

    def get(self, user_id: int) -> Optional[User]:
        """获取用户"""
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_email(self, email: str) -> Optional[User]:
        """通过邮箱获取用户"""
        return self.db.query(User).filter(User.email == email).first()

    def get_by_username(self, username: str) -> Optional[User]:
        """通过用户名获取用户"""
        return self.db.query(User).filter(User.username == username).first()

    def create(self, user_create: UserCreate) -> User:
        """创建用户"""
        password_hash = get_password_hash(user_create.password)
        db_user = User(
            username=user_create.username,
            email=user_create.email,
            password_hash=password_hash,
            full_name=user_create.full_name
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def update(self, user_id: int, user_update: UserUpdate) -> Optional[User]:
        """更新用户"""
        db_user = self.get(user_id)
        if not db_user:
            return None
        
        update_data = user_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_user, field, value)
        
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def authenticate(self, username: str, password: str) -> Optional[User]:
        """验证用户"""
        # 尝试通过用户名或邮箱查找用户
        user = self.get_by_username(username)
        if not user:
            user = self.get_by_email(username)
        
        if not user:
            return None
        
        if not verify_password(password, user.password_hash):
            return None
        
        return user 
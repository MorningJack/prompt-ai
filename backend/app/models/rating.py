"""
评分数据模型
"""
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..core.database import Base


class Rating(Base):
    """评分模型"""
    __tablename__ = "ratings"

    id = Column(Integer, primary_key=True, index=True)
    prompt_id = Column(Integer, ForeignKey("prompts.id"), nullable=False, comment="提示词ID")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, comment="用户ID")
    score = Column(Integer, nullable=False, comment="评分 (1-5)")
    comment = Column(Text, comment="评价内容")
    
    # 时间戳
    created_at = Column(DateTime(timezone=True), server_default=func.now(), comment="创建时间")
    
    # 关联关系
    prompt = relationship("Prompt", back_populates="ratings")
    user = relationship("User", back_populates="ratings")

    def __repr__(self):
        return f"<Rating(id={self.id}, score={self.score})>" 
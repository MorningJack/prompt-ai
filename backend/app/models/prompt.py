"""
提示词数据模型
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, JSON, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..core.database import Base


class Prompt(Base):
    """提示词模型"""
    __tablename__ = "prompts"

    id = Column(Integer, primary_key=True, index=True)
    
    # 基本信息
    name_zh = Column(String(200), nullable=False, index=True, comment="中文名称")
    name_en = Column(String(200), index=True, comment="英文名称")
    aliases = Column(JSON, comment="别名列表")
    description = Column(Text, comment="描述")
    content = Column(Text, nullable=False, comment="提示词内容")
    
    # 示例和使用
    example_input = Column(Text, comment="示例输入")
    example_output = Column(Text, comment="示例输出")
    usage_tips = Column(Text, comment="使用技巧")
    
    # 分类和标签
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False, comment="分类ID")
    tags = Column(JSON, comment="标签列表")
    
    # 适用性
    supported_models = Column(JSON, comment="支持的模型")
    model_types = Column(JSON, comment="模型类型")
    use_cases = Column(JSON, comment="使用场景")
    
    # 状态信息
    is_public = Column(Boolean, default=False, comment="是否公开")
    is_featured = Column(Boolean, default=False, comment="是否精选")
    status = Column(String(20), default="draft", comment="状态：draft/published/archived")
    
    # 评价信息
    rating_avg = Column(Float, default=0.0, comment="平均评分")
    rating_count = Column(Integer, default=0, comment="评分数量")
    usage_count = Column(Integer, default=0, comment="使用次数")
    
    # 关联信息
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False, comment="作者ID")
    
    # 时间戳
    created_at = Column(DateTime(timezone=True), server_default=func.now(), comment="创建时间")
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), comment="更新时间")
    
    # 关联关系
    author = relationship("User", back_populates="prompts")
    category = relationship("Category", back_populates="prompts")
    ratings = relationship("Rating", back_populates="prompt", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Prompt(id={self.id}, name_zh='{self.name_zh}')>" 
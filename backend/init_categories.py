#!/usr/bin/env python3
"""
初始化分类数据
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models.category import Category

def init_categories():
    """初始化基础分类数据"""
    db: Session = SessionLocal()
    
    try:
        # 检查是否已有分类数据
        if db.query(Category).count() > 0:
            print("分类数据已存在，跳过初始化")
            return
        
        # 创建基础分类
        categories = [
            {
                "name": "写作助手",
                "description": "帮助写作、编辑和内容创作的提示词",
                "icon": "pen-tool",
                "sort_order": 1
            },
            {
                "name": "编程开发",
                "description": "代码生成、调试和技术问题解决",
                "icon": "code",
                "sort_order": 2
            },
            {
                "name": "数据分析",
                "description": "数据处理、分析和可视化相关",
                "icon": "bar-chart",
                "sort_order": 3
            },
            {
                "name": "学习教育",
                "description": "学习辅导、知识解释和教学相关",
                "icon": "book-open",
                "sort_order": 4
            },
            {
                "name": "商务办公",
                "description": "商业分析、报告撰写和办公自动化",
                "icon": "briefcase",
                "sort_order": 5
            },
            {
                "name": "创意设计",
                "description": "创意思维、设计灵感和艺术创作",
                "icon": "palette",
                "sort_order": 6
            },
            {
                "name": "生活助手",
                "description": "日常生活、健康、旅行等实用建议",
                "icon": "home",
                "sort_order": 7
            },
            {
                "name": "语言翻译",
                "description": "多语言翻译和语言学习辅助",
                "icon": "globe",
                "sort_order": 8
            }
        ]
        
        # 插入分类数据
        for cat_data in categories:
            category = Category(**cat_data)
            db.add(category)
        
        db.commit()
        print(f"成功创建 {len(categories)} 个基础分类")
        
        # 创建子分类
        subcategories = [
            # 写作助手子分类
            {"name": "文章写作", "parent_id": 1, "sort_order": 1},
            {"name": "邮件撰写", "parent_id": 1, "sort_order": 2},
            {"name": "文案策划", "parent_id": 1, "sort_order": 3},
            {"name": "学术论文", "parent_id": 1, "sort_order": 4},
            
            # 编程开发子分类
            {"name": "Python", "parent_id": 2, "sort_order": 1},
            {"name": "JavaScript", "parent_id": 2, "sort_order": 2},
            {"name": "Java", "parent_id": 2, "sort_order": 3},
            {"name": "Web开发", "parent_id": 2, "sort_order": 4},
            {"name": "移动开发", "parent_id": 2, "sort_order": 5},
            
            # 数据分析子分类
            {"name": "数据清洗", "parent_id": 3, "sort_order": 1},
            {"name": "统计分析", "parent_id": 3, "sort_order": 2},
            {"name": "机器学习", "parent_id": 3, "sort_order": 3},
            {"name": "数据可视化", "parent_id": 3, "sort_order": 4},
        ]
        
        for subcat_data in subcategories:
            subcategory = Category(**subcat_data)
            db.add(subcategory)
        
        db.commit()
        print(f"成功创建 {len(subcategories)} 个子分类")
        
    except Exception as e:
        print(f"初始化分类数据失败: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("正在初始化分类数据...")
    init_categories()
    print("分类数据初始化完成！") 
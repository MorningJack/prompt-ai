"""
分类相关的API端点
"""
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ....core.database import get_db
from ....schemas.category import Category, CategoryCreate, CategoryUpdate
from ....schemas.user import User
from ....services.category_service import CategoryService
from ....api.deps import get_current_user, get_current_user_optional

router = APIRouter()


@router.get("/", response_model=List[Category], summary="获取分类列表")
async def get_categories(
    parent_id: int = None,
    include_inactive: bool = False,
    db: Session = Depends(get_db)
) -> Any:
    """
    获取分类列表
    
    - **parent_id**: 父分类ID（为空时获取顶级分类）
    - **include_inactive**: 是否包含未启用的分类
    """
    category_service = CategoryService(db)
    categories = category_service.get_list(
        parent_id=parent_id,
        include_inactive=include_inactive
    )
    return categories


@router.get("/tree", response_model=List[Category], summary="获取分类树")
async def get_category_tree(
    include_inactive: bool = False,
    db: Session = Depends(get_db)
) -> Any:
    """
    获取完整的分类树结构
    
    - **include_inactive**: 是否包含未启用的分类
    """
    category_service = CategoryService(db)
    tree = category_service.get_tree(include_inactive=include_inactive)
    return tree


@router.post("/", response_model=Category, summary="创建分类")
async def create_category(
    category_data: CategoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    创建新分类（需要登录）
    
    - **name**: 分类名称（必填）
    - **description**: 分类描述（可选）
    - **parent_id**: 父分类ID（可选）
    - **sort_order**: 排序（默认0）
    - **icon**: 图标（可选）
    """
    category_service = CategoryService(db)
    
    # 检查父分类是否存在
    if category_data.parent_id:
        parent = category_service.get(category_data.parent_id)
        if not parent:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="父分类不存在"
            )
    
    # 创建分类
    category = category_service.create(category_data)
    return category


@router.get("/{category_id}", response_model=Category, summary="获取分类详情")
async def get_category(
    category_id: int,
    db: Session = Depends(get_db)
) -> Any:
    """
    获取指定分类的详细信息
    """
    category_service = CategoryService(db)
    category = category_service.get(category_id)
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="分类不存在"
        )
    
    return category


@router.put("/{category_id}", response_model=Category, summary="更新分类")
async def update_category(
    category_id: int,
    category_update: CategoryUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    更新分类信息（需要登录）
    """
    category_service = CategoryService(db)
    category = category_service.get(category_id)
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="分类不存在"
        )
    
    # 检查父分类是否存在
    if category_update.parent_id:
        parent = category_service.get(category_update.parent_id)
        if not parent:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="父分类不存在"
            )
        
        # 防止循环引用
        if category_update.parent_id == category_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="不能将自己设为父分类"
            )
    
    # 更新分类
    updated_category = category_service.update(category_id, category_update)
    return updated_category


@router.delete("/{category_id}", summary="删除分类")
async def delete_category(
    category_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    删除分类（需要登录）
    """
    category_service = CategoryService(db)
    category = category_service.get(category_id)
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="分类不存在"
        )
    
    # 检查是否有子分类
    if category_service.has_children(category_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="该分类下还有子分类，无法删除"
        )
    
    # 检查是否有关联的提示词
    if category_service.has_prompts(category_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="该分类下还有提示词，无法删除"
        )
    
    # 删除分类
    category_service.delete(category_id)
    return {"message": "分类已删除"} 
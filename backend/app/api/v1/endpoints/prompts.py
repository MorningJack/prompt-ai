"""
提示词相关的API端点
"""
from typing import Any, Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from ....core.database import get_db
from ....schemas.prompt import Prompt, PromptCreate, PromptUpdate, PromptList
from ....schemas.user import User
from ....services.prompt_service import PromptService
from ....api.deps import get_current_user, get_current_user_optional

router = APIRouter()


@router.get("/", response_model=PromptList, summary="获取提示词列表")
async def get_prompts(
    page: int = Query(1, ge=1, description="页码"),
    size: int = Query(20, ge=1, le=100, description="每页数量"),
    category_id: Optional[int] = Query(None, description="分类ID"),
    search: Optional[str] = Query(None, description="搜索关键词"),
    is_public: Optional[bool] = Query(None, description="是否公开"),
    is_featured: bool = Query(False, description="是否仅显示精选"),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
) -> Any:
    """
    获取提示词列表
    
    - **page**: 页码（从1开始）
    - **size**: 每页数量（1-100）
    - **category_id**: 按分类筛选
    - **search**: 搜索关键词（在名称和描述中搜索）
    - **is_public**: 是否公开（仅登录用户可见非公开的自己的提示词）
    - **is_featured**: 是否仅显示精选
    """
    prompt_service = PromptService(db)
    
    # 构建查询条件
    filters = {}
    if category_id:
        filters["category_id"] = category_id
    if search:
        filters["search"] = search
    if is_featured:
        filters["is_featured"] = True
    
    # 处理公开状态筛选
    if current_user:
        # 登录用户可以看到自己的所有提示词和他人的公开提示词
        if is_public is not None:
            filters["is_public"] = is_public
        filters["current_user_id"] = current_user.id
    else:
        # 未登录用户只能看到公开的提示词
        filters["is_public"] = True
    
    result = prompt_service.get_list(page=page, size=size, **filters)
    return result


@router.post("/", response_model=Prompt, summary="创建提示词")
async def create_prompt(
    prompt_data: PromptCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    创建新的提示词
    
    - **name_zh**: 中文名称（必填）
    - **name_en**: 英文名称（可选）
    - **content**: 提示词内容（必填）
    - **category_id**: 分类ID（必填）
    - **is_public**: 是否公开（默认false）
    """
    prompt_service = PromptService(db)
    
    # 检查分类是否存在
    if not prompt_service.category_exists(prompt_data.category_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="分类不存在"
        )
    
    # 创建提示词
    prompt = prompt_service.create(prompt_data, author_id=current_user.id)
    return prompt


@router.get("/{prompt_id}", response_model=Prompt, summary="获取提示词详情")
async def get_prompt(
    prompt_id: int,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
) -> Any:
    """
    获取指定提示词的详细信息
    """
    prompt_service = PromptService(db)
    prompt = prompt_service.get(prompt_id)
    
    if not prompt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="提示词不存在"
        )
    
    # 检查访问权限
    if not prompt.is_public:
        if not current_user or current_user.id != prompt.author_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="提示词不存在"
            )
    
    # 增加使用次数
    prompt_service.increment_usage_count(prompt_id)
    
    return prompt


@router.put("/{prompt_id}", response_model=Prompt, summary="更新提示词")
async def update_prompt(
    prompt_id: int,
    prompt_update: PromptUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    更新提示词信息
    """
    prompt_service = PromptService(db)
    prompt = prompt_service.get(prompt_id)
    
    if not prompt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="提示词不存在"
        )
    
    # 检查权限：只有作者可以编辑
    if prompt.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="无权限编辑此提示词"
        )
    
    # 检查分类是否存在
    if prompt_update.category_id and not prompt_service.category_exists(prompt_update.category_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="分类不存在"
        )
    
    # 更新提示词
    updated_prompt = prompt_service.update(prompt_id, prompt_update)
    return updated_prompt


@router.delete("/{prompt_id}", summary="删除提示词")
async def delete_prompt(
    prompt_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    删除提示词
    """
    prompt_service = PromptService(db)
    prompt = prompt_service.get(prompt_id)
    
    if not prompt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="提示词不存在"
        )
    
    # 检查权限：只有作者可以删除
    if prompt.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="无权限删除此提示词"
        )
    
    # 删除提示词
    prompt_service.delete(prompt_id)
    return {"message": "提示词已删除"}


@router.get("/user/{user_id}", response_model=List[Prompt])
def get_user_prompts(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    获取指定用户的提示词（仅限用户本人或管理员）
    """
    # 权限检查：只能查看自己的提示词，除非是管理员
    if current_user.id != user_id and not getattr(current_user, 'is_superuser', False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="没有权限访问其他用户的提示词"
        )
    
    prompt_service = PromptService(db)
    prompts = prompt_service.get_prompts_by_user(user_id=user_id)
    return prompts 
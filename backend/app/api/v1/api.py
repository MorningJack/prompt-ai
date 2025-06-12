"""
API v1 路由汇总
"""
from fastapi import APIRouter
from .endpoints import auth, users, prompts, categories

api_router = APIRouter()

# 注册各个模块的路由
api_router.include_router(auth.router, prefix="/auth", tags=["认证"])
api_router.include_router(users.router, prefix="/users", tags=["用户"])
api_router.include_router(prompts.router, prefix="/prompts", tags=["提示词"])
api_router.include_router(categories.router, prefix="/categories", tags=["分类"]) 
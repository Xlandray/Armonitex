from fastapi import APIRouter

from app.api.v1.routes import admin, auth, contact, contents, portal, users

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(contents.router, prefix="/contents", tags=["contents"])
api_router.include_router(contact.router, prefix="/contact", tags=["contact"])
api_router.include_router(portal.router, prefix="/portal", tags=["portal"])

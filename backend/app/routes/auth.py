from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
# system: db, security
from app.system.db import db
from app.system.system import generate_access_token, verify_token
# schemas: auth
from app.models.schemas.auth_schema import authBasePlus, authOut, Token, RF_Token
# controllers: auth
from app.controllers import auth_controller
# utils: exceptions
from app.utils.exceptions import THROW_ERROR

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=authOut, name="registerUser")
def register_user(
    payload: authBasePlus,
    db: Session = Depends(db)
):
    return auth_controller.register(payload,db)

@router.post("/login", response_model=Token, name="loginUser")
def login_user(
    payload: authBasePlus,
    db: Session = Depends(db)
):
    return auth_controller.login(payload,db)


# refresh JWT token
@router.post("/refresh", response_model=Token, name="refreshToken")
def refresh_token(payload: RF_Token):
    token = payload.refresh_token
    if not token:
        THROW_ERROR("Refresh token required", 400)

    claims = verify_token(token)
    if claims.get("scope") != "refresh":
        THROW_ERROR("Invalid refresh token", 403)

    new_access_token = generate_access_token(
        subject=claims["sub"],
        minutes=15
    )

    return {
        "access_token": new_access_token,
        "refresh_token": token, 
        "token_type": "bearer"
    }


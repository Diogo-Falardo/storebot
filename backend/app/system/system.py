from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_NAME: str
    API_PREFIX: str
    DB_URL: str
    JWT_SECRET: str
    ISSUER: str
    AUDIENCE: str
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()

# SECURITY CONFIG

from fastapi import Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Optional
import uuid
# system: db
from app.system.db import db
# utils: exceptions
from app.utils.exceptions import THROW_ERROR
# services: auth
from app.services.auth_service import aUser
"jwt"
import jwt
from jwt import ExpiredSignatureError, InvalidTokenError
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
"password prottection"
from passlib.context import CryptContext

def _now() -> datetime:
    return datetime.now(timezone.utc)
def generate_access_token(
    subject: str,
    minutes: int = 15,
    scope: str | None = None,
    extra_claims: Dict[str,Any] | None = None,
) -> str:
    now = _now()
    payload = {
        "sub": subject, # owner of  the token
        "iss": settings.ISSUER, # who send the token
        "aud": settings.AUDIENCE, # who must accept token
        "iat": int(now.timestamp()), # when it was created
        "nbf": int(now.timestamp()), # not valid before this time
        "exp": int((now + timedelta(minutes=minutes)).timestamp()), # expires
        "jti": str(uuid.uuid4()), # permissons (custom claim)
    }
    if scope:
        payload["scope"] = scope
    if extra_claims:
        payload.update(extra_claims)

    token = jwt.encode(payload, settings.JWT_SECRET, algorithm="HS256", headers={"typ": "JWT"})
    return token
def verify_token(token: str)-> Dict[str, Any]:
    claims = jwt.decode(
        token,
        settings.JWT_SECRET,
        algorithms=["HS256"],
        audience=settings.AUDIENCE,
        issuer=settings.ISSUER,
        options={"require": ["exp", "iat", "nbf", "iss", "aud"]},
        leeway=60,
    )
    return claims

# validate the token
# return id
http_bearer = HTTPBearer()
def validate_auth_token(
    creds: HTTPAuthorizationCredentials = Depends(http_bearer),
    db: Session = Depends(db)  
) -> int:
    token = creds.credentials
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"], audience=settings.AUDIENCE, issuer=settings.ISSUER,
        options={"require": ["sub", "exp", "iat", "nbf", "iss", "aud"]}, 
        leeway=60
        )

        sub = payload.get("sub")

        if sub is None:
            THROW_ERROR("Invalid token!", 401)

        try:
            auth_UID= int(sub)
        except (TypeError, ValueError):
            THROW_ERROR("Invalid token subject!", 401)

        if aUser(sub,db) is None:
            THROW_ERROR("Invalid user!", 400)

        return auth_UID
    
    except ExpiredSignatureError:
        THROW_ERROR("Token expired!", 400)
    except InvalidTokenError:
        THROW_ERROR("Invalid token!", 400)
    except Exception as e:
        THROW_ERROR(str(e), 500)


pwd_context = CryptContext(schemes=["bcrypt_sha256", "bcrypt"], deprecated="auto")
def create_password_hash(password: str) -> str:
    return pwd_context.hash(password)
def verify_password_hash(plain_password: str, password_hash: str)-> bool:
    return pwd_context.verify(plain_password, password_hash)

from pydantic import BaseModel, EmailStr, field_validator,ConfigDict
from datetime import datetime
from typing import Optional
# utils: validatores
from app.utils import field_V

# auth
class authBase(BaseModel):
    email: EmailStr

    @field_validator("email", mode="before")
    @classmethod
    def _email(cls, email):
        return field_V.vEmail(email)

# auth base extended
class authBasePlus(authBase):
    password: str

    @field_validator("password", mode="before")
    @classmethod
    def _password(cls, password):
        return field_V.vPassword(password)

# out
class authOut(authBase):
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

# JWT 
class RF_Token(BaseModel):
    refresh_token: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
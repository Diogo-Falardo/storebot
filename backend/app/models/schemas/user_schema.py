from pydantic import BaseModel, ConfigDict,field_validator,HttpUrl
from datetime import datetime
from typing import Optional
# utils: validatores
from app.utils import field_V

# user
class userBase(BaseModel):
    username: str

    @field_validator("username", mode="before")
    @classmethod
    def _username(cls, username):
        return field_V.vUsername(username)
    
class userUpdate(BaseModel):
    username: Optional[str] = None
    avatar_url: Optional[HttpUrl] = None
    country: Optional[str] = None
    bio: Optional[str] = None
    website: Optional[HttpUrl] = None

    @field_validator("username", mode="before")
    @classmethod
    def _username(cls, username):
        return field_V.vUsername(username)
    
    @field_validator("avatar_url", mode="before")
    @classmethod
    def _avatar_url(cls, avatar):
        return field_V.vUrl(avatar, title="avatar")
    
    @field_validator("country", mode="before")
    @classmethod
    def _country(cls, country):
        return field_V.vString(country, title="country", minlen=5, maxlen=30)
    
    @field_validator("bio", mode="before")
    @classmethod
    def _bio(cls, bio):
        return field_V.vString(bio, title="bio", maxlen=1000)
    
    @field_validator("website", mode="before")
    @classmethod
    def _website(cls, website):
        return field_V.vUrl(website, title="website")


    
class userOut(BaseModel):
    username: str
    avatar_url: HttpUrl | None = None
    country: str | None = None
    bio: str | None = None
    website: HttpUrl | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


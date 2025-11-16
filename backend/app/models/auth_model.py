from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Enum, DateTime
from ._base import Base

class Auth(Base):
    __tablename__ = "auth"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), nullable=False, unique=True)
    hash_password = Column(String(255), nullable=False)
    roles = Column(Enum("user", "admin", name="user_roles"), nullable=False, default="user")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    last_login = Column(DateTime, nullable=True)

    def __repr__(self):
        return f"<Auth(id={self.id}, email='{self.email}', roles='{self.roles}')>"

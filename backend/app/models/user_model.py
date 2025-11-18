from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from ._base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    auth_id = Column(Integer, ForeignKey("auth.id"), nullable=False, unique=True)
    username = Column(String(50), nullable=False, unique=True)
    avatar_url = Column(String(255), nullable=True)
    country = Column(String(100), nullable=True)
    bio = Column(Text, nullable=True)
    website = Column(String(255), nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    auth = relationship("Auth", backref="user", uselist=False)

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}')>"

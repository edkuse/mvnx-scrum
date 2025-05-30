from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, JSON


class User(SQLModel, table=True):
    __tablename__ = "users"

    attuid: str = Field(primary_key=True, index=True)
    sup_attuid: Optional[str] = None
    email: Optional[str] = None
    last_nm: str
    first_nm: str
    preferred_nm: Optional[str] = None
    job_title_nm: Optional[str] = None
    dept_nm: Optional[str] = None
    level: Optional[str] = None
    profile_picture: Optional[str] = None
    is_superuser: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True)

    # Relationships

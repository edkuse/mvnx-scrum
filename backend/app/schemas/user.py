from typing import Optional
from sqlmodel import SQLModel

class UserBase(SQLModel):
    attuid: str
    sup_attuid: Optional[str] = None
    email: str
    last_nm: str
    first_nm: str
    preferred_nm: Optional[str] = None
    job_title_nm: Optional[str] = None
    dept_nm: Optional[str] = None
    level: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserUpdate(SQLModel):
    sup_attuid: Optional[str] = None
    email: Optional[str] = None
    last_nm: Optional[str] = None
    first_nm: Optional[str] = None
    preferred_nm: Optional[str] = None
    job_title_nm: Optional[str] = None
    dept_nm: Optional[str] = None
    level: Optional[str] = None

class UserResponse(UserBase):
    created_at: Optional[str]
    updated_at: Optional[str] 
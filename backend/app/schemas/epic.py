from typing import Optional, List
from sqlmodel import SQLModel
from datetime import date, datetime

class EpicBase(SQLModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = "backlog"
    priority: Optional[str] = "low"
    owner_id: Optional[str] = None
    application_ids: List[str]
    start_date: Optional[date] = None
    due_date: Optional[date] = None
    completed_date: Optional[date] = None
    estimated_effort: Optional[int] = None
    actual_effort: Optional[int] = None
    progress: Optional[int] = 0
    tags: Optional[List[str]] = None
    is_active: Optional[bool] = True

class EpicCreate(EpicBase):
    pass

class EpicUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    owner_id: Optional[str] = None
    application_ids: Optional[List[str]] = None
    start_date: Optional[date] = None
    due_date: Optional[date] = None
    completed_date: Optional[date] = None
    estimated_effort: Optional[int] = None
    actual_effort: Optional[int] = None
    progress: Optional[int] = None
    tags: Optional[List[str]] = None
    is_active: Optional[bool] = None

class EpicResponse(EpicBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None 
from typing import Optional, List
from sqlmodel import SQLModel, Field
from datetime import date, datetime
from sqlalchemy import Column, String, ARRAY


class Epic(SQLModel, table=True):
    __tablename__ = "epics"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(max_length=255)
    description: Optional[str] = None
    status: Optional[str] = Field(default="backlog", max_length=50)
    priority: Optional[str] = Field(default="low", max_length=50)
    owner_id: Optional[str] = Field(default=None, foreign_key="users.attuid", max_length=10)
    application_ids: List[str] = Field(sa_column=Column(ARRAY(String)))
    start_date: Optional[date] = None
    due_date: Optional[date] = None
    completed_date: Optional[date] = None
    estimated_effort: Optional[int] = None
    actual_effort: Optional[int] = None
    progress: Optional[int] = Field(default=0, ge=0, le=100)
    tags: Optional[List[str]] = Field(default=None, sa_column=Column(ARRAY(String)))
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True)
    
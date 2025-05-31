from datetime import datetime, date
from typing import Optional, List, Any
from enum import Enum
from sqlmodel import ARRAY, SQLModel, String, Field, Column, JSON


class Sprint(SQLModel, table=True):
    __tablename__ = "sprints"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True, max_length=100)
    lead_id: Optional[str] = Field(default=None, foreign_key="users.attuid", max_length=10)
    goal: Optional[str] = None
    status: str = "Planned"
    start_date: date
    end_date: date
    completed_at: Optional[datetime] = None
    committed_story_points: int = Field(default=0)
    completed_story_points: int = Field(default=0)
    velocity: Optional[int] = None
    progress_percent: int = Field(default=0, ge=0, le=100)
    burndown_data: Optional[Any] = Field(default=None, sa_column=Column(JSON))
    tags: Optional[List[str]] = Field(default=None, sa_column=Column(ARRAY(String)))
    created_by: str = Field(foreign_key="users.attuid", max_length=10)
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updated_by: Optional[str] = Field(default=None, foreign_key="users.attuid", max_length=10)
    updated_at: Optional[datetime] = None
    is_active: bool = Field(default=True) 
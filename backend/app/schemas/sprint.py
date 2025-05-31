from datetime import datetime, date
from typing import Optional, List, Any
from sqlmodel import SQLModel

class SprintBase(SQLModel):
    title: str
    lead_id: Optional[str] = None
    goal: Optional[str] = None
    status: str = "Planned"
    start_date: date
    end_date: date
    completed_at: Optional[datetime] = None
    committed_story_points: int = 0
    completed_story_points: int = 0
    velocity: Optional[int] = None
    progress_percent: int = 0
    burndown_data: Optional[Any] = None
    tags: Optional[List[str]] = None
    is_active: bool = True

class SprintCreate(SprintBase):
    created_by: str

class SprintUpdate(SQLModel):
    title: Optional[str] = None
    lead_id: Optional[str] = None
    goal: Optional[str] = None
    status: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    completed_at: Optional[datetime] = None
    committed_story_points: Optional[int] = None
    completed_story_points: Optional[int] = None
    velocity: Optional[int] = None
    progress_percent: Optional[int] = None
    burndown_data: Optional[Any] = None
    tags: Optional[List[str]] = None
    is_active: Optional[bool] = None
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None

class SprintResponse(SprintBase):
    id: int
    created_by: str
    created_at: Optional[datetime] = None
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None
    
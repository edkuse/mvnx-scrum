from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

# Shared properties
class StoryBase(BaseModel):
    title: str = Field(..., max_length=255)
    epic_id: int
    sprint_id: Optional[int] = None
    description: Optional[str] = None
    type: str = Field(default="Story", max_length=50)
    status: str = Field(default="To Do", max_length=50)
    priority: str = Field(default="Medium", max_length=50)
    assignee_ids: Optional[List[str]] = None
    start_date: Optional[datetime] = None
    due_date: Optional[datetime] = None
    story_points: Optional[int] = None
    time_estimate_minutes: Optional[int] = None
    progress: int = Field(default=0, ge=0, le=100)
    tags: Optional[List[str]] = None
    created_by: str = Field(default="ek2842")
    created_at: Optional[datetime] = Field(default=datetime.now().isoformat())


# Properties to receive on story creation
class StoryCreate(StoryBase):
    pass

# Properties to receive on story update
class StoryUpdate(StoryBase):
    title: Optional[str] = Field(None, max_length=255)
    epic_id: Optional[int] = None
    sprint_id: Optional[int] = None
    type: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    completed_date: Optional[datetime] = None
    is_active: Optional[bool] = None

class StoryResponse(StoryBase):
    id: int
    updated_by: Optional[str]
    updated_at: Optional[str]
    is_active: Optional[bool]

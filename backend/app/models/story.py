from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Column, String, Integer, DateTime, Date, Boolean, ForeignKey, ARRAY
from pydantic import EmailStr

class Story(SQLModel, table=True):
    __tablename__ = "stories"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    epic_id: int = Field(foreign_key="epics.id")
    title: str = Field(max_length=255)
    description: Optional[str] = None
    type: str = Field(default="Story", max_length=50)
    status: str = Field(default="To Do", max_length=50)
    priority: str = Field(default="Medium", max_length=50)
    assignee_ids: List[str] = Field(default=[], sa_column=Column(ARRAY(String)))
    start_date: Optional[datetime] = Field(default=None, sa_column=Column(Date))
    due_date: Optional[datetime] = Field(default=None, sa_column=Column(Date))
    completed_date: Optional[datetime] = Field(default=None, sa_column=Column(Date))
    story_points: Optional[int] = None
    time_estimate_minutes: Optional[int] = None
    time_logged_minutes: Optional[int] = None
    progress: int = Field(default=0, ge=0, le=100)
    tags: List[str] = Field(default=[], sa_column=Column(ARRAY(String)))
    created_by: str = Field(foreign_key="users.attuid", max_length=10)
    created_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column(DateTime(timezone=True)))
    updated_by: Optional[str] = Field(default=None, foreign_key="users.attuid", max_length=10)
    updated_at: Optional[datetime] = Field(default=None, sa_column=Column(DateTime(timezone=True)))
    is_active: bool = Field(default=True)
    sprint_id: Optional[int] = Field(default=None, foreign_key="sprints.id")
    
    # Relationships
    # epic: "Epic" = Relationship(back_populates="stories")
    # sprint: "Sprint" = Relationship(back_populates="stories")
    # assignee: Optional["User"] = Relationship(back_populates="stories") 
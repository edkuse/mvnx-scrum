from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, JSON


class Standup(SQLModel, table=True):
    __tablename__ = "standups"

    id: Optional[int] = Field(default=None, primary_key=True)
    team_name: str  # Each standup has its own team context
    user_id: str = Field(foreign_key="users.attuid")
    date: datetime
    responses: dict = Field(sa_column=Column(JSON))  # Store responses as JSON
    status: str  # e.g., "completed", "missed"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    # user: "User" = Relationship(back_populates="standups") 
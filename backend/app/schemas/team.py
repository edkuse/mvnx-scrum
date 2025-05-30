from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field

class TeamBase(SQLModel):
    name: str
    description: Optional[str] = None

class TeamCreate(TeamBase):
    pass

class TeamUpdate(SQLModel):
    name: Optional[str] = None
    description: Optional[str] = None

class TeamResponse(TeamBase):
    id: int
    created_at: datetime
    updated_at: datetime 